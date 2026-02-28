/**
 * POST /api/telemetry
 *
 * Creates a new telemetry session snapshot from the client's session counts.
 * Computes focus_score and time_saved_seconds server-side.
 *
 * Body: TelemetryPayload
 * Returns: The newly created TelemetrySession row.
 */

import { NextRequest, NextResponse } from 'next/server'
import {
    createTelemetrySession,
    getLatestSession,
    getAggregateTelemetry,
} from '@/services/telemetry.service'
import { createClient } from '@/lib/supabase/server'
import type { TelemetryPayload } from '@/models/Telemetry.model'

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as Partial<TelemetryPayload>

        if (typeof body.total_ingested !== 'number' || !body.session_start) {
            return NextResponse.json(
                { error: '`session_start` and `total_ingested` are required.' },
                { status: 400 }
            )
        }

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const session = await createTelemetrySession({
            session_start: body.session_start,
            session_end: body.session_end,
            total_ingested: body.total_ingested,
            instant_count: body.instant_count ?? 0,
            scheduled_count: body.scheduled_count ?? 0,
            batch_count: body.batch_count ?? 0,
        }, user.id)

        return NextResponse.json({ data: session }, { status: 201 })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected error'
        console.error('[POST /api/telemetry]', message)
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

/**
 * GET /api/telemetry
 *
 * Returns the latest session + aggregate all-time totals.
 * Powers the Telemetry Scoreboard in the UI.
 */
export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const [latest, aggregate] = await Promise.all([
            getLatestSession(user.id),
            getAggregateTelemetry(user.id),
        ])

        return NextResponse.json({ data: { latest, aggregate } }, { status: 200 })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected error'
        console.error('[GET /api/telemetry]', message)
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
