/**
 * POST /api/ingest
 *
 * Accepts a raw campus message, classifies it via Hugging Face,
 * and persists it to the Supabase `notifications` table.
 *
 * Body: IngestPayload { raw_text, source, sender? }
 * Returns: The newly created Notification row.
 */

import { NextRequest, NextResponse } from 'next/server'
import { ingestAndClassify, getNotificationsByZone } from '@/services/classify.service'
import type { IngestPayload } from '@/models/Notification.model'

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as Partial<IngestPayload>

        // Validate required fields
        if (!body.raw_text || typeof body.raw_text !== 'string' || body.raw_text.trim() === '') {
            return NextResponse.json({ error: '`raw_text` is required.' }, { status: 400 })
        }

        if (!body.source || !['whatsapp', 'email', 'manual'].includes(body.source)) {
            return NextResponse.json(
                { error: '`source` must be one of: whatsapp, email, manual.' },
                { status: 400 }
            )
        }

        const notification = await ingestAndClassify({
            raw_text: body.raw_text.trim(),
            source: body.source as IngestPayload['source'],
            sender: body.sender,
        })

        return NextResponse.json({ data: notification }, { status: 201 })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected error'
        console.error('[POST /api/ingest]', message)
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

/**
 * GET /api/ingest
 *
 * Returns all non-dismissed notifications grouped by zone.
 * Used by the dashboard to populate the three-zone view.
 */
export async function GET() {
    try {
        const grouped = await getNotificationsByZone()
        return NextResponse.json({ data: grouped }, { status: 200 })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected error'
        console.error('[GET /api/ingest]', message)
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
