/**
 * Notification Model
 * Typed wrappers around the Supabase `notifications` table.
 * Use NotificationService (classify.service.ts) for business logic.
 */

import type { Zone, NotificationRow, NotificationInsert, NotificationUpdate } from '@/types/database'

export type { Zone, NotificationRow, NotificationInsert, NotificationUpdate }

/**
 * Represents a fully classified notification as used throughout the client.
 * Mirrors NotificationRow but with a friendlier name.
 */
export type Notification = NotificationRow

/**
 * Payload sent from the client to POST /api/ingest
 */
export interface IngestPayload {
    raw_text: string
    source: 'whatsapp' | 'email' | 'manual' | 'classroom' | 'gmail' | string
    sender?: string
    title?: string
    external_id?: string
    scheduled_for?: string
}

/**
 * The AI classification result returned by the classify service.
 */
export interface ClassificationResult {
    zone: Zone
    confidence: number
    ai_model: string
    fallback_used: boolean
}

/**
 * Payload sent from the client to PATCH /api/notifications/:id
 * when the user manually changes a notification's zone.
 */
export interface ZoneOverridePayload {
    user_zone: Zone
}
