/**
 * Telemetry Model
 * Typed wrappers around the `telemetry_sessions` and `user_corrections` tables.
 */

import type {
    TelemetrySessionRow,
    TelemetrySessionInsert,
    TelemetrySessionUpdate,
    UserCorrectionRow,
    UserCorrectionInsert,
    Zone,
} from '@/types/database'

export type {
    TelemetrySessionRow,
    TelemetrySessionInsert,
    TelemetrySessionUpdate,
    UserCorrectionRow,
    UserCorrectionInsert,
}

/**
 * Main alias used throughout components.
 */
export type TelemetrySession = TelemetrySessionRow
export type UserCorrection = UserCorrectionRow

/**
 * Payload POSTed to /api/telemetry to create or update a session snapshot.
 */
export interface TelemetryPayload {
    session_start: string
    session_end?: string
    total_ingested: number
    instant_count: number
    scheduled_count: number
    batch_count: number
}

/**
 * The computed telemetry values derived from a TelemetryPayload.
 * These are calculated server-side before writing to Supabase.
 */
export interface ComputedTelemetry {
    spam_blocked: number        // = batch_count
    time_saved_seconds: number  // = spam_blocked * 30
    focus_score: number         // = (1 - instant_count / total_ingested) * 100
}

/**
 * Payload POSTed to /api/corrections when the user moves a notification.
 */
export interface CorrectionPayload {
    notification_id: string
    original_zone: Zone
    corrected_zone: Zone
    raw_text_snapshot: string
    ai_confidence?: number
}
