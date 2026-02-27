/**
 * User Model
 * Placeholder for future Supabase Auth integration.
 * Muka v1.0 is stateless (no auth), but this is scaffolded for Phase 2.
 */

export interface MukaUser {
    id: string           // maps to auth.users.id in Supabase
    email: string
    display_name?: string
    campus?: string      // e.g. 'Mumbai University' — for personalised filtering
    created_at: string
}

/**
 * User preferences — stored in a future `user_preferences` table.
 * Kept here as a type reference for Phase 2.
 */
export interface UserPreferences {
    user_id: string
    batch_lock_enabled: boolean   // lock Batch zone during deep-work sessions
    instant_alert_sound: boolean  // play sound for Instant notifications
    snooze_default_minutes: number
}
