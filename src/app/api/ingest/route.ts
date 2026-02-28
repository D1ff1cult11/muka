import { NextResponse } from 'next/server';
import { ingestAndClassify } from '@/services/classify.service';
import { createClient } from '@/lib/supabase/server';

/**
 * External Ingestion Gateway
 * Accepts notifications from WhatsApp Webhooks, Manual Navbar Input, or other sources.
 */
export async function POST(req: Request) {
    try {
        const { text, sender, source = 'manual' } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // 0. Authenticate
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Ingest and Classify (Synchonous AI sorting)
        const notification = await ingestAndClassify({
            raw_text: text,
            sender: sender || 'User Input',
            source: source,
        }, user.id);

        return NextResponse.json({
            success: true,
            message: 'Notification sorted instantly',
            data: notification
        });

    } catch (error: any) {
        console.error('[INGEST_ERROR]:', error.message);
        return NextResponse.json({ error: error.message || 'Ingestion failed' }, { status: 500 });
    }
}
