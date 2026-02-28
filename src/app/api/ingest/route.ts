import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ingestAndClassify, getNotificationsByZone } from '@/services/classify.service';

/**
 * External Ingestion Gateway
 * Accepts notifications from WhatsApp Webhooks, Manual Navbar Input, or other sources.
 */
export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const raw_text = body.raw_text || body.text;

        if (!raw_text || typeof raw_text !== 'string' || raw_text.trim() === '') {
            return NextResponse.json({ error: '`raw_text` or `text` is required.' }, { status: 400 });
        }

        const source = body.source || 'manual';

        // PASS PERSONAL USER ID
        const notification = await ingestAndClassify({
            raw_text: raw_text,
            sender: body.sender || 'Unknown',
            source: source,
        }, user.id);


        return NextResponse.json({ success: true, data: notification });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await getNotificationsByZone(user.id);
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
