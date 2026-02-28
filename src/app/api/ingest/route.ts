import { NextResponse } from 'next/server';
import { ingestAndClassify } from '@/services/classify.service';

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

        // 1. Ingest and Classify (Synchonous AI sorting)
        const notification = await ingestAndClassify({
            raw_text: text,
            sender: sender || 'User Input',
            source: source,
        });

        return NextResponse.json({
            success: true,
            message: 'Notification sorted instantly',
            data: notification
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Ingestion failed';
        console.error('[INGEST_ERROR]:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
