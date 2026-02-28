import { supabaseAdmin } from '@/lib/db'

export interface UserPreferences {
    user_id: string;
    delivery_schedule: {
        windows: Array<{
            id: string;
            time: string;
            label: string;
            active: boolean;
        }>;
    };
    batch_lock_enabled: boolean;
    theme: string;
}

/**
 * Fetches user preferences. Creates default if none exist.
 */
export async function getUserPreferences(userId: string): Promise<UserPreferences> {
    if (!supabaseAdmin) throw new Error('Supabase client not initialized');

    let { data, error } = await supabaseAdmin
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code === 'PGRST116') { // Not found
        const { data: newData, error: insertError } = await supabaseAdmin
            .from('user_preferences')
            .insert({ user_id: userId })
            .select()
            .single();

        if (insertError) throw new Error(`Init preferences failed: ${insertError.message}`);
        return newData as UserPreferences;
    }

    if (error) throw new Error(`Fetch preferences failed: ${error.message}`);
    return data as UserPreferences;
}

/**
 * Partial update to user preferences.
 */
export async function updateUserPreferences(userId: string, update: Partial<UserPreferences>): Promise<UserPreferences> {
    if (!supabaseAdmin) throw new Error('Supabase client not initialized');

    const { data, error } = await supabaseAdmin
        .from('user_preferences')
        .update(update)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) throw new Error(`Update preferences failed: ${error.message}`);
    return data as UserPreferences;
}
