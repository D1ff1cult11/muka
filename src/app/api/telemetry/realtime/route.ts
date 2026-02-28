import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getGoogleAuth, fetchUnreadEmailsCount, fetchPendingAssignmentsCount } from '@/lib/google';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
            return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
        }

        const accessToken = session.provider_token;
        const refreshToken = session.provider_refresh_token ?? undefined;

        if (!accessToken) {
            return NextResponse.json({ error: 'Google Access Token not found in session. Please sign in with Google.' }, { status: 400 });
        }

        const auth = getGoogleAuth(accessToken, refreshToken);

        // Fetch metrics from Google parallelly
        const [unreadEmails, pendingAssignments] = await Promise.all([
            fetchUnreadEmailsCount(auth),
            fetchPendingAssignmentsCount(auth)
        ]);

        // Deep Queue = Total pending items
        const deepQueue = unreadEmails + pendingAssignments;

        // Arbitrary Focus Score Logic: Starts at 100% and decreases slightly with a large deep queue
        // Clamped between 60.0 and 100.0
        const focusScore = Math.max(60.0, Math.min(100.0, 100.0 - (deepQueue * 0.5)));

        // Arbitrary ROI Logic: Base value + (some metric to make it feel dynamic)
        // Just as a placeholder algorithm since we aren't tracking completed historical tasks yet.
        const focusROI = 42 + Math.floor(pendingAssignments * 1.5);

        return NextResponse.json({
            focus: focusScore,
            queue: deepQueue,
            saved: focusROI
        }, { status: 200 });

    } catch (err: any) {
        console.error('[GET /api/telemetry/realtime]', err);
        return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 });
    }
}
