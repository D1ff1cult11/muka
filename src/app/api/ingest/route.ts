import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * External Ingestion Gateway
 * Accepts notifications from WhatsApp Webhooks or Manual tools.
 */
export async function POST(req: Request) {
    try {
        const { text, sender, source = 'whatsapp' } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const supabase = await createClient();

        // 1. Ingest into the database
        const { data, error } = await supabase
            .from('notifications')
            .insert({
                raw_text: text,
                sender: sender || 'Unknown Source',
                source: source,
                zone: 'instant', // Default before AI classification
            })
            .select()
            .single();

        if (error) throw error;

        // 2. Trigger AI Classification (Internal fetch to /api/classify)
        // Note: In production, this would be a background job.
        return NextResponse.json({
            success: true,
            message: 'Notification ingested',
            id: data.id
        });

    } catch (error: any) {
        console.error('[INGEST_ERROR]:', error.message);
        return NextResponse.json({ error: 'Ingestion failed' }, { status: 500 });
    }
}
