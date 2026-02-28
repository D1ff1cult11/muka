import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getHandledNotifications } from '@/services/classify.service';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await getHandledNotifications(user.id);
        return NextResponse.json({ success: true, data });
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
