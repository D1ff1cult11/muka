import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    getUserPreferences,
    updateUserPreferences
} from '@/services/preferences.service';

/**
 * GET /api/preferences
 * Returns the current user's application preferences.
 */
export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const prefs = await getUserPreferences(user.id);
        return NextResponse.json({ data: prefs });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

/**
 * PATCH /api/preferences
 * Partially updates user preferences (e.g., delivery schedule, batch lock).
 */
export async function PATCH(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const updated = await updateUserPreferences(user.id, body);

        return NextResponse.json({ data: updated });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
