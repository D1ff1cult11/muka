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
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || '7D'; // 24H, 7D, ALL

        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // 1. Fetch notifications with enough data for real physics calculations
        const { data: allNotifs, error } = await supabaseAdmin
            .from('notifications')
            .select('id, zone, user_zone, source, created_at, raw_text, confidence, fallback_used')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });

        if (error) throw new Error(`DB error: ${error.message}`);
        const notifs = allNotifs ?? [];

        // 2. Fetch corrections to calculate AI Accuracy
        const { data: corrections, error: corrError } = await supabaseAdmin
            .from('user_corrections')
            .select('id')
            .eq('user_id', user.id);

        const accuracy = notifs.length > 0
            ? Math.round(Math.max(0, (1 - (corrections?.length || 0) / notifs.length)) * 100)
            : 100;

        // ── Filter by range for summary stats ──────────────────────────
        const now = new Date();
        const rangeStart = new Date();
        if (range === '24H') rangeStart.setHours(now.getHours() - 24);
        else if (range === '7D') rangeStart.setDate(now.getDate() - 7);
        else rangeStart.setFullYear(2020); // Beginning of time

        const filteredNotifs = notifs.filter(n => new Date(n.created_at) >= rangeStart);

        // ── Derived Metrics ────────────────────────────────────────────
        const total = filteredNotifs.length;
        const getEffectiveZone = (n: typeof notifs[0]) => n.user_zone ?? n.zone;

        const instantCount = filteredNotifs.filter(n => getEffectiveZone(n) === 'instant').length;
        const noiseNotifs = filteredNotifs.filter(n => getEffectiveZone(n) !== 'instant');
        const noiseMsgs = noiseNotifs.length;

        // Time saved: Physics based estimation
        // Reading speed: ~200 wpm. Scanning speed: ~700 wpm (when glance at Muka BLUF)
        // Savings = (Total words in noise msgs / 200) - (Total words / 700 for glance)
        let totalWords = 0;
        let noiseWords = 0;
        for (const n of filteredNotifs) {
            const words = (n.raw_text || '').split(/\s+/).length;
            totalWords += words;
            if (getEffectiveZone(n) !== 'instant') noiseWords += words;
        }

        const timeSavedMins = (noiseWords / 200) - (totalWords / 1000);
        const timeSavedHrs = parseFloat(Math.max(0, timeSavedMins / 60).toFixed(1));

        // Focus score: Ratio of focus time vs interruption risk
        const noisePct = total > 0 ? (noiseMsgs / total) * 100 : 0;
        const focusScore = Math.round(Math.max(40, Math.min(100, 100 - noisePct * 0.5)));

        // ── Chart Data based on range ───────────────────────────────────
        const chartData: { label: string; focus: number; noise: number }[] = [];

        if (range === '24H') {
            // Last 24 hours in 2-hour slots
            for (let h = 23; h >= 0; h -= 2) {
                const start = new Date(now);
                start.setHours(now.getHours() - h, 0, 0, 0);
                const end = new Date(start);
                end.setHours(start.getHours() + 2);

                const slotNotifs = notifs.filter(n => {
                    const t = new Date(n.created_at).getTime();
                    return t >= start.getTime() && t < end.getTime();
                });

                chartData.push({
                    label: `${start.getHours()}:00`,
                    focus: slotNotifs.filter(n => getEffectiveZone(n) === 'instant').length,
                    noise: slotNotifs.filter(n => getEffectiveZone(n) !== 'instant').length
                });
            }
        } else {
            // Default 7 days breakdown
            for (let d = 6; d >= 0; d--) {
                const dayStart = new Date(now);
                dayStart.setDate(now.getDate() - d);
                dayStart.setHours(0, 0, 0, 0);
                const dayEnd = new Date(dayStart);
                dayEnd.setHours(23, 59, 59, 999);

                const dayNotifs = notifs.filter(n => {
                    const t = new Date(n.created_at).getTime();
                    return t >= dayStart.getTime() && t <= dayEnd.getTime();
                });

                chartData.push({
                    label: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
                    focus: dayNotifs.filter(n => getEffectiveZone(n) === 'instant').length,
                    noise: dayNotifs.filter(n => getEffectiveZone(n) !== 'instant').length,
                });
            }
        }

        // ── Noise Sources breakdown (for filtered range) ───────────────
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

        // ── Heatmap (Always 24h context but anchored to range end) ──────
        const heatmap = Array.from({ length: 48 }, (_, i) => {
            const slotEnd = now.getTime() - i * 30 * 60 * 1000;
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
            blockedCount: noiseMsgs,
            focusScore,
            total,
            instantCount,
            noiseMsgs,
            accuracy,
            chartDays: chartData,
            noiseSources,
            heatmap,
        });

    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unexpected error';
        console.error('[GET /api/telemetry/stats]', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
