/**
 * Telemetry Service
 * Handles computing and persisting telemetry session data to Supabase,
 * and logging user corrections for the Feedback & Learning Layer.
 */

import { supabaseAdmin } from '@/lib/db'
import type {
    TelemetryPayload,
    ComputedTelemetry,
    TelemetrySession,
    CorrectionPayload,
    UserCorrection,
} from '@/models/Telemetry.model'

const SPAM_SECONDS_PER_MESSAGE = 30  // assumed attention cost of each batch message

// ─────────────────────────────────────────────────────────────
// Computed metrics
// ─────────────────────────────────────────────────────────────

/**
 * Derives the scoreboard metrics from raw session counts.
 * These are calculated server-side to keep the logic consistent.
 */
export function computeTelemetry(payload: TelemetryPayload): ComputedTelemetry {
    const spam_blocked = payload.batch_count
    const time_saved_seconds = spam_blocked * SPAM_SECONDS_PER_MESSAGE
    const focus_score =
        payload.total_ingested === 0
            ? 100
            : Math.round((1 - payload.instant_count / payload.total_ingested) * 100)

    return { spam_blocked, time_saved_seconds, focus_score }
}

// ─────────────────────────────────────────────────────────────
// Supabase Persistence
// ─────────────────────────────────────────────────────────────

/**
 * Creates a new telemetry session snapshot.
 * Called by POST /api/telemetry.
 */
export async function createTelemetrySession(payload: TelemetryPayload): Promise<TelemetrySession> {
    const computed = computeTelemetry(payload)

    const { data, error } = await supabaseAdmin
        .from('telemetry_sessions')
        .insert({
            session_start: payload.session_start,
            session_end: payload.session_end ?? null,
            total_ingested: payload.total_ingested,
            instant_count: payload.instant_count,
            scheduled_count: payload.scheduled_count,
            batch_count: payload.batch_count,
            spam_blocked: computed.spam_blocked,
            time_saved_seconds: computed.time_saved_seconds,
            focus_score: computed.focus_score,
        })
        .select()
        .single()

    if (error || !data) {
        throw new Error(`Failed to save telemetry session: ${error?.message}`)
    }

    return data as TelemetrySession
}

/**
 * Fetches the most recent telemetry session.
 * Used to populate the scoreboard on the dashboard.
 */
export async function getLatestSession(): Promise<TelemetrySession | null> {
    const { data, error } = await supabaseAdmin
        .from('telemetry_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (error) return null
    return data as TelemetrySession
}

/**
 * Fetches aggregate totals across all sessions.
 * Used for the all-time stats view.
 */
export async function getAggregateTelemetry(): Promise<{
    total_ingested: number
    total_spam_blocked: number
    total_time_saved_seconds: number
    avg_focus_score: number
    session_count: number
}> {
    const { data, error } = await supabaseAdmin
        .from('telemetry_sessions')
        .select('total_ingested, spam_blocked, time_saved_seconds, focus_score')

    if (error || !data) {
        return {
            total_ingested: 0,
            total_spam_blocked: 0,
            total_time_saved_seconds: 0,
            avg_focus_score: 100,
            session_count: 0,
        }
    }

    const sessions = data as TelemetrySession[]

    return {
        total_ingested: sessions.reduce((s, r) => s + r.total_ingested, 0),
        total_spam_blocked: sessions.reduce((s, r) => s + r.spam_blocked, 0),
        total_time_saved_seconds: sessions.reduce((s, r) => s + r.time_saved_seconds, 0),
        avg_focus_score:
            sessions.length === 0
                ? 100
                : Math.round(sessions.reduce((s, r) => s + r.focus_score, 0) / sessions.length),
        session_count: sessions.length,
    }
}

// ─────────────────────────────────────────────────────────────
// User Corrections (Feedback & Learning Layer)
// ─────────────────────────────────────────────────────────────

/**
 * Logs a user correction when they move a notification to a different zone.
 * Called by POST /api/corrections.
 */
export async function logUserCorrection(payload: CorrectionPayload): Promise<UserCorrection> {
    const { data, error } = await supabaseAdmin
        .from('user_corrections')
        .insert({
            notification_id: payload.notification_id,
            original_zone: payload.original_zone,
            corrected_zone: payload.corrected_zone,
            raw_text_snapshot: payload.raw_text_snapshot,
            ai_confidence: payload.ai_confidence ?? null,
        })
        .select()
        .single()

    if (error || !data) {
        throw new Error(`Failed to log correction: ${error?.message}`)
    }

    return data as UserCorrection
}

/**
 * Fetches all corrections — useful for analytics or future model fine-tuning.
 */
export async function getAllCorrections(): Promise<UserCorrection[]> {
    const { data, error } = await supabaseAdmin
        .from('user_corrections')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to fetch corrections: ${error.message}`)
    return (data ?? []) as UserCorrection[]
}
