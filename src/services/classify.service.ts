/**
 * Classify Service
 * Handles AI classification via the Hugging Face Inference API,
 * then persists the result to Supabase `notifications` table.
 */

import { supabaseAdmin } from '@/lib/db'
import type { ClassificationResult, IngestPayload, Notification } from '@/models/Notification.model'
import type { Zone } from '@/types/database'

const HF_API_URL = 'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct'
const CONFIDENCE_THRESHOLD = 0.55  // below this, fallback safety logic triggers

// ─────────────────────────────────────────────────────────────
// AI Classification & BLUF Extraction
// ─────────────────────────────────────────────────────────────

/**
 * Calls the Hugging Face Generative API to act as an extraction engine.
 * Returns the zone (classification) and the BLUF (Bottom Line Up Front).
 */
export async function classifyText(text: string): Promise<ClassificationResult> {
    try {
        const systemPrompt = `You are a highly efficient data extractor for a student dashboard. 
Analyze the provided text.
1. Classify it strictly as exactly one of: "instant", "scheduled", or "batch".
   - "instant": Urgent, due very soon, critical alerts.
   - "scheduled": Due in a few days, requires planning.
   - "batch": Low priority, long-term, passive reading.
2. Extract the "bluf" (Bottom Line Up Front)—a maximum 10-word string containing ONLY the core action item, deadline, or fact. Strip all pleasantries.

You must reply with ONLY a raw, minified JSON object matching this schema exactly, with no markdown formatting or backticks:
{"classification": "<zone>", "bluf": "<10-word summary>"}

TEXT TO ANALYZE:
---
${text}
---`;

        const response = await fetch(HF_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: systemPrompt,
                parameters: {
                    max_new_tokens: 100,
                    return_full_text: false,
                    temperature: 0.1 // Low temp for strict formatting
                },
            }),
        });

        if (!response.ok) {
            console.warn(`Hugging Face API returned error: ${response.status}. Using default fallback.`);
            const fallbackBluf = text.split(/\s+/).slice(0, 10).join(' ') + '...';
            return {
                zone: 'instant',
                confidence: 0,
                bluf: fallbackBluf,
                ai_model: 'fallback-static',
                fallback_used: true,
            }
        }

        const data = await response.json();
        const generatedText = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;

        if (!generatedText) throw new Error("No generated text found");

        // Clean up the output to ensure we just have the JSON
        const cleanJsonString = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJsonString);

        let topLabel: Zone = 'instant';
        const rawClass = parsed.classification?.toLowerCase();
        if (['instant', 'scheduled', 'batch'].includes(rawClass)) {
            topLabel = rawClass as Zone;
        }

        const blufText = parsed.bluf || text.split(/\s+/).slice(0, 10).join(' ') + '...';

        return {
            zone: topLabel,
            confidence: 0.95, // Generative models don't return classification logits out-of-the-box easily, assuming high confidence on successful parse
            bluf: blufText,
            ai_model: 'meta-llama/Meta-Llama-3-8B-Instruct',
            fallback_used: false,
        }

    } catch (e) {
        console.error('AI Classification critical failure. defaulting to Instant.', e);
        const fallbackBluf = text.split(/\s+/).slice(0, 10).join(' ') + '...';
        return {
            zone: 'instant',
            confidence: 0,
            bluf: fallbackBluf,
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
    if (!supabaseAdmin) throw new Error('Supabase Admin client not initialized')

    if (payload.external_id) {
        const { data: existing, error } = await supabaseAdmin
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .eq('external_id', payload.external_id)
            .maybeSingle()

        if (!error && existing) {
            return existing as Notification;
        }
    }

    const textToClassify = payload.title ? `Title: ${payload.title}\nContent: ${payload.raw_text}` : payload.raw_text
    const classification = await classifyText(textToClassify)

    const { data, error } = await supabaseAdmin
        .from('notifications')
        .insert({
            user_id: userId,
            raw_text: payload.raw_text,
            title: payload.title ?? null,
            source: payload.source,
            sender: payload.sender ?? null,
            external_id: payload.external_id ?? null,
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
export async function dismissNotification(id: string, userId: string): Promise<void> {
    if (!supabaseAdmin) throw new Error('Supabase Admin client not initialized')

    const { error } = await supabaseAdmin
        .from('notifications')
        .update({ is_dismissed: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userId)

    if (error) throw new Error(`Failed to dismiss notification: ${error.message}`)
}

/**
 * Snoozes a notification until the given time.
 */
export async function snoozeNotification(id: string, until: Date, userId: string): Promise<void> {
    if (!supabaseAdmin) throw new Error('Supabase Admin client not initialized')

    const { error } = await supabaseAdmin
        .from('notifications')
        .update({
            is_snoozed: true,
            snoozed_until: until.toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', userId)

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
    aiConfidence: number,
    userId: string
): Promise<void> {
    const now = new Date().toISOString()

    if (!supabaseAdmin) throw new Error('Supabase Admin client not initialized')

    // Update the notification's user_zone
    const { error: updateError } = await supabaseAdmin
        .from('notifications')
        .update({ user_zone: correctedZone, updated_at: now })
        .eq('id', id)
        .eq('user_id', userId)

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
            user_id: userId,
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
