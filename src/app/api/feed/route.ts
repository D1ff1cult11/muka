import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getNotificationsByZone } from '@/services/classify.service';

/**
 * API Route Handler
 * Fetches the user's stored notifications from the Supabase database.
 * Independent from the ingestion layer.
 */
export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
        }

        // Technically ignore cachedIds since the store fully replaces state
        const { cachedIds } = await req.json().catch(() => ({ cachedIds: [] }));

        // Technical Requirement 7: Response (Stateful Sync)
        const notifications = await getNotificationsByZone(user.id);
        const allItems = [
            ...notifications.instant,
            ...notifications.scheduled,
            ...notifications.batch
        ].map(n => ({
            id: n.id,
            external_id: n.external_id,
            title: n.title || n.raw_text.substring(0, 50),
            snippet: n.raw_text,
            source: n.source,
            label: (n.user_zone ?? n.zone).charAt(0).toUpperCase() + (n.user_zone ?? n.zone).slice(1),
            timestamp: n.created_at
        }));

        return NextResponse.json(allItems);

    } catch (error: any) {
        console.error('Processing Gateway Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
    }
}
