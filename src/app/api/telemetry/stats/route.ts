import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/telemetry/stats
 * Returns dynamic telemetry metrics derived from the user's actual notification history.
 * 
 * Formula definitions:
 *  - timeSavedHrs: batch notifications * 2 min each → converted to hrs (batch msgs are the "noise" suppressed)
 *  - blockedCount: total number of batch-zone notifications (i.e., low-priority intercepted)
 *  - focusScore:   (instant / total) * 100 — high when only urgent things break through
 *  - chartData:    last 7 days breakdown of instant (focus) vs batch+scheduled (noise) counts
 *  - noiseSources: per-source breakdown of batch+scheduled notifications as percentages
 */
export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Pull all notifications for this user (non-dismissed only for live counts, all for history)
        const { data: allNotifs, error } = await supabaseAdmin
            .from('notifications')
            .select('id, zone, user_zone, source, created_at, is_dismissed, fallback_used')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });

        if (error) throw new Error(`DB error: ${error.message}`);
        const notifs = allNotifs ?? [];

        // ── Derived Metrics ────────────────────────────────────────────
        const total = notifs.length;

        // Effective zone = user override if set, else AI zone
        const getZone = (n: typeof notifs[0]) => n.user_zone ?? n.zone;

        const instantCount = notifs.filter(n => getZone(n) === 'instant').length;
        const batchCount = notifs.filter(n => getZone(n) === 'batch').length;
        const scheduledCount = notifs.filter(n => getZone(n) === 'scheduled').length;

        // Time saved: every batch+scheduled msg = ~2 min you didn't have to process immediately
        const noiseMsgs = batchCount + scheduledCount;
        const timeSavedMins = noiseMsgs * 2;
        const timeSavedHrs = parseFloat((timeSavedMins / 60).toFixed(1));

        // Focus score: what % of messages were truly urgent (instant). 
        // Higher = your shield is letting through only real urgency.
        // If total = 0, default to 100%
        const rawFocusScore = total > 0 ? Math.round((instantCount / total) * 100) : 100;
        // Soft inversion: if >80% is instant, something's wrong — focus score rewards low noise
        // Re-derive: focusScore = 100 - (noise% * 0.6) clamped to [40, 100]
        const noisePct = total > 0 ? (noiseMsgs / total) * 100 : 0;
        const focusScore = Math.round(Math.max(40, Math.min(100, 100 - noisePct * 0.6)));

        // ── Chart Data: last 7 days ─────────────────────────────────────
        const chartDays: { label: string; focus: number; noise: number }[] = [];
        for (let d = 6; d >= 0; d--) {
            const dayStart = new Date();
            dayStart.setDate(dayStart.getDate() - d);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);

            const dayNotifs = notifs.filter(n => {
                const t = new Date(n.created_at).getTime();
                return t >= dayStart.getTime() && t <= dayEnd.getTime();
            });

            const focusDay = dayNotifs.filter(n => getZone(n) === 'instant').length;
            const noiseDay = dayNotifs.filter(n => getZone(n) !== 'instant').length;

            chartDays.push({
                label: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
                focus: focusDay,
                noise: noiseDay,
            });
        }

        // ── Noise Sources breakdown ───────────────────────────────────
        const noiseNotifs = notifs.filter(n => getZone(n) !== 'instant');
        const sourceCounts: Record<string, number> = {};
        for (const n of noiseNotifs) {
            const src = n.source || 'Other';
            sourceCounts[src] = (sourceCounts[src] ?? 0) + 1;
        }
        const noiseSourcesTotal = noiseNotifs.length || 1;
        const noiseSources = Object.entries(sourceCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 4)
            .map(([label, count]) => ({
                label,
                pct: Math.round((count / noiseSourcesTotal) * 100),
            }));

        // ── Heatmap: activity for last 48 "slots" (30 min each over 24 hrs) ─
        const now = Date.now();
        const heatmap = Array.from({ length: 48 }, (_, i) => {
            const slotEnd = now - i * 30 * 60 * 1000;
            const slotStart = slotEnd - 30 * 60 * 1000;
            const count = notifs.filter(n => {
                const t = new Date(n.created_at).getTime();
                return t >= slotStart && t < slotEnd;
            }).length;
            if (count >= 5) return 'hot';
            if (count >= 3) return 'warm';
            if (count >= 1) return 'cool';
            return 'cold';
        }).reverse();

        return NextResponse.json({
            timeSavedHrs,
            blockedCount: batchCount,
            focusScore,
            total,
            instantCount,
            noiseMsgs,
            chartDays,
            noiseSources,
            heatmap,
        });

    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unexpected error';
        console.error('[GET /api/telemetry/stats]', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
