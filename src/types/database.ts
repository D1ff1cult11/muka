/**
 * Full TypeScript type definitions for the Muka Supabase database.
 * Auto-compatible with the Supabase client generic: createClient<Database>()
 */

export type Zone = 'instant' | 'scheduled' | 'batch'

export type Database = {
    public: {
        Tables: {
            notifications: {
                Row: NotificationRow
                Insert: NotificationInsert
                Update: NotificationUpdate
            }
            telemetry_sessions: {
                Row: TelemetrySessionRow
                Insert: TelemetrySessionInsert
                Update: TelemetrySessionUpdate
            }
            user_corrections: {
                Row: UserCorrectionRow
                Insert: UserCorrectionInsert
                Update: UserCorrectionUpdate
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────
// notifications
// ─────────────────────────────────────────────────────────────

export interface NotificationRow {
    id: string
    raw_text: string
    title: string | null
    source: string
    sender: string | null
    external_id: string | null
    zone: Zone
    confidence: number
    ai_model: string
    fallback_used: boolean
    user_zone: Zone | null
    user_id: string
    scheduled_for: string | null
    is_dismissed: boolean
    is_snoozed: boolean
    snoozed_until: string | null
    created_at: string
    classified_at: string
    updated_at: string
}

export type NotificationInsert = Omit<NotificationRow,
    'id' | 'created_at' | 'classified_at' | 'updated_at'
> & {
    id?: string
    confidence?: number
    ai_model?: string
    fallback_used?: boolean
    user_zone?: Zone | null
    user_id?: string
    scheduled_for?: string | null
    is_dismissed?: boolean
    is_snoozed?: boolean
    snoozed_until?: string | null
    created_at?: string
    classified_at?: string
    updated_at?: string
}

export type NotificationUpdate = Partial<NotificationInsert>

// ─────────────────────────────────────────────────────────────
// telemetry_sessions
// ─────────────────────────────────────────────────────────────

export interface TelemetrySessionRow {
    id: string
    session_start: string
    session_end: string | null
    total_ingested: number
    instant_count: number
    scheduled_count: number
    batch_count: number
    spam_blocked: number
    time_saved_seconds: number
    focus_score: number
    user_id: string
    created_at: string
}

export type TelemetrySessionInsert = Omit<TelemetrySessionRow,
    'id' | 'created_at'
> & {
    id?: string
    session_end?: string | null
    total_ingested?: number
    instant_count?: number
    scheduled_count?: number
    batch_count?: number
    spam_blocked?: number
    time_saved_seconds?: number
    focus_score?: number
    user_id?: string
    created_at?: string
}

export type TelemetrySessionUpdate = Partial<TelemetrySessionInsert>

// ─────────────────────────────────────────────────────────────
// user_corrections
// ─────────────────────────────────────────────────────────────

export interface UserCorrectionRow {
    id: string
    notification_id: string
    original_zone: Zone
    corrected_zone: Zone
    raw_text_snapshot: string
    ai_confidence: number | null
    user_id: string
    created_at: string
}

export type UserCorrectionInsert = Omit<UserCorrectionRow,
    'id' | 'created_at'
> & {
    id?: string
    ai_confidence?: number | null
    user_id?: string
    created_at?: string
}

export type UserCorrectionUpdate = Partial<UserCorrectionInsert>
