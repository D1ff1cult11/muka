/**
 * Classify Service
 * Handles AI classification via the Hugging Face Inference API,
 * then persists the result to Supabase `notifications` table.
 */

import { supabaseAdmin } from '@/lib/db'
import type { ClassificationResult, IngestPayload, Notification } from '@/models/Notification.model'
import type { Zone } from '@/types/database'

const HF_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli'
const CONFIDENCE_THRESHOLD = 0.55  // below this, fallback safety logic triggers

// The three candidate labels passed to the zero-shot model
const CANDIDATE_LABELS: Zone[] = ['instant', 'scheduled', 'batch']

// ─────────────────────────────────────────────────────────────
// AI Classification
// ─────────────────────────────────────────────────────────────

/**
 * Calls the Hugging Face zero-shot classification API and returns
 * the zone, confidence score, and whether a fallback was used.
 */
export async function classifyText(text: string): Promise<ClassificationResult> {
    try {
        const response = await fetch(HF_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: text,
                parameters: { candidate_labels: CANDIDATE_LABELS },
            }),
        })

        if (!response.ok) {
            console.warn(`Hugging Face API returned error: ${response.status}. Using default fallback (Instant).`)
            return {
                zone: 'instant',
                confidence: 0,
                ai_model: 'fallback-static',
                fallback_used: true,
            }
        }

        const data = await response.json()

        // HF returns arrays of labels sorted by score (highest first)
        const topLabel: Zone = data.labels[0] as Zone
        const topScore: number = data.scores[0] as number

        const fallback_used = topScore < CONFIDENCE_THRESHOLD

        return {
            zone: fallback_used ? 'instant' : topLabel,
            confidence: topScore,
            ai_model: 'facebook/bart-large-mnli',
            fallback_used,
        }
    } catch (e) {
        console.error('AI Classification critical failure. defaulting to Instant.', e)
        return {
            zone: 'instant',
            confidence: 0,
            ai_model: 'error-fallback',
            fallback_used: true,
        }
    }
}

// ─────────────────────────────────────────────────────────────
// Supabase Persistence
// ─────────────────────────────────────────────────────────────

/**
 * Classifies a raw message and persists it to the `notifications` table.
 */
export async function ingestAndClassify(payload: IngestPayload, userId: string): Promise<Notification> {
    const classification = await classifyText(payload.raw_text)

    if (!supabaseAdmin) throw new Error('Supabase Admin client not initialized')

    const { data, error } = await supabaseAdmin
        .from('notifications')
        .insert({
            user_id: userId,
            raw_text: payload.raw_text,
            source: payload.source,
            sender: payload.sender ?? null,
            zone: classification.zone,
            confidence: classification.confidence,
            ai_model: classification.ai_model,
            fallback_used: classification.fallback_used,
        })
        .select()
        .single()

    if (error || !data) {
        throw new Error(`Failed to save notification: ${error?.message}`)
    }

    return data as Notification
}

/**
 * Fetches all non-dismissed notifications for a specific user.
 */
export async function getNotificationsByZone(userId: string): Promise<{
    instant: Notification[]
    scheduled: Notification[]
    batch: Notification[]
}> {
    if (!supabaseAdmin) throw new Error('Supabase Admin client not initialized')

    const { data, error } = await supabaseAdmin
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_dismissed', false)
        .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to fetch notifications: ${error.message}`)

    const notifications = (data ?? []) as Notification[]

    return {
        instant: notifications.filter(n => (n.user_zone ?? n.zone) === 'instant'),
        scheduled: notifications.filter(n => (n.user_zone ?? n.zone) === 'scheduled'),
        batch: notifications.filter(n => (n.user_zone ?? n.zone) === 'batch'),
    }
}


/**
 * Fetches all handled notifications (dismissed or snoozed) for a user.
 * Powering the 'Outbox' / Archive view.
 */
export async function getHandledNotifications(userId: string): Promise<Notification[]> {
    if (!supabaseAdmin) throw new Error('Supabase Admin client not initialized')

    const { data, error } = await supabaseAdmin
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .or('is_dismissed.eq.true,is_snoozed.eq.true')
        .order('updated_at', { ascending: false })
        .limit(50)

    if (error) throw new Error(`Failed to fetch outbox: ${error.message}`)
    return (data ?? []) as Notification[]
}

/**
 * Dismisses a notification (quick micro-action).
 */
export async function dismissNotification(id: string): Promise<void> {
    if (!supabaseAdmin) throw new Error('Supabase Admin client not initialized')

    const { error } = await supabaseAdmin
        .from('notifications')
        .update({ is_dismissed: true, updated_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw new Error(`Failed to dismiss notification: ${error.message}`)
}

/**
 * Snoozes a notification until the given time.
 */
export async function snoozeNotification(id: string, until: Date): Promise<void> {
    if (!supabaseAdmin) throw new Error('Supabase Admin client not initialized')

    const { error } = await supabaseAdmin
        .from('notifications')
        .update({
            is_snoozed: true,
            snoozed_until: until.toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)

    if (error) throw new Error(`Failed to snooze notification: ${error.message}`)
}

/**
 * Records a user's zone override and logs it to user_corrections.
 */
export async function overrideZone(
    id: string,
    correctedZone: Zone,
    rawText: string,
    originalZone: Zone,
    aiConfidence: number
): Promise<void> {
    const now = new Date().toISOString()

    if (!supabaseAdmin) throw new Error('Supabase Admin client not initialized')

    // Update the notification's user_zone
    const { error: updateError } = await supabaseAdmin
        .from('notifications')
        .update({ user_zone: correctedZone, updated_at: now })
        .eq('id', id)

    if (updateError) throw new Error(`Failed to update zone: ${updateError.message}`)

    // Log the correction for the feedback/learning layer
    const { error: correctionError } = await supabaseAdmin
        .from('user_corrections')
        .insert({
            notification_id: id,
            original_zone: originalZone,
            corrected_zone: correctedZone,
            raw_text_snapshot: rawText,
            ai_confidence: aiConfidence,
        })

    if (correctionError) throw new Error(`Failed to log correction: ${correctionError.message}`)
}

/**
 * Restores a handled notification back to active status.
 */
export async function restoreNotification(id: string): Promise<void> {
    if (!supabaseAdmin) throw new Error('Supabase Admin client not initialized')

    const { error } = await supabaseAdmin
        .from('notifications')
        .update({
            is_dismissed: false,
            is_snoozed: false,
            snoozed_until: null,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) throw new Error(`Failed to restore notification: ${error.message}`)
}

/**
 * Hard deletes a notification from the database.
 */
export async function deleteNotification(id: string): Promise<void> {
    if (!supabaseAdmin) throw new Error('Supabase Admin client not initialized')

    const { error } = await supabaseAdmin
        .from('notifications')
        .delete()
        .eq('id', id)

    if (error) throw new Error(`Failed to delete notification: ${error.message}`)
}
