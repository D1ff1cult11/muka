import { NextRequest, NextResponse } from 'next/server'
import {
    dismissNotification,
    snoozeNotification,
    overrideZone,
    restoreNotification,
    deleteNotification
} from '@/services/classify.service'
import type { Zone } from '@/types/database'

/**
 * PATCH /api/notifications/[id]
 * Handles specific actions on a notification item.
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await req.json()
        const { action } = body

        if (action === 'dismiss') {
            await dismissNotification(id)
            return NextResponse.json({ success: true })
        }

        if (action === 'snooze') {
            const { until } = body
            await snoozeNotification(id, new Date(until))
            return NextResponse.json({ success: true })
        }

        if (action === 'move') {
            const { destinationZone, originalZone, rawText, confidence } = body
            await overrideZone(
                id,
                destinationZone as Zone,
                rawText,
                originalZone as Zone,
                confidence
            )
            return NextResponse.json({ success: true })
        }

        if (action === 'restore') {
            await restoreNotification(id)
            return NextResponse.json({ success: true })
        }

        if (action === 'delete') {
            await deleteNotification(id)
            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Action failed'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

/**
 * DELETE /api/notifications/[id]
 * Hard delete support.
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await deleteNotification(id)
        return NextResponse.json({ success: true })
    } catch (err) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }
}
