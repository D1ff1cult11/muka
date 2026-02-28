import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/db';

export async function DELETE() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            throw new Error('Supabase Admin client is not initialized');
        }

        // Manually cascade deletes to prevent PostgreSQL foreign key constraint violations
        // if the Supabase table schema wasn't configured with `ON DELETE CASCADE`.
        await Promise.all([
            supabaseAdmin.from('notifications').delete().eq('user_id', user.id),
            supabaseAdmin.from('telemetry_sessions').delete().eq('user_id', user.id),
            supabaseAdmin.from('user_corrections').delete().eq('user_id', user.id)
        ]);

        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

        if (deleteError) {
            throw new Error(`Failed to delete user: ${deleteError.message}`);
        }

        return NextResponse.json({ success: true, message: 'Account permanently deleted' });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Deletion failed';
        console.error('[USER_DELETE_ERROR]:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
