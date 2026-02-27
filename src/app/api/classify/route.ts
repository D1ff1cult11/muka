/**
 * POST /api/classify
 *
 * Lightweight endpoint that ONLY runs AI classification without persisting.
 * Useful for previewing the zone before the user confirms ingestion.
 *
 * Body: { text: string }
 * Returns: ClassificationResult { zone, confidence, ai_model, fallback_used }
 */

import { NextRequest, NextResponse } from 'next/server'
import { classifyText } from '@/services/classify.service'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        if (!body.text || typeof body.text !== 'string' || body.text.trim() === '') {
            return NextResponse.json({ error: '`text` is required.' }, { status: 400 })
        }

        const result = await classifyText(body.text.trim())

        return NextResponse.json({ data: result }, { status: 200 })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected error'
        console.error('[POST /api/classify]', message)
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
