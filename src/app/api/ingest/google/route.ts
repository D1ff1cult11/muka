export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { getGoogleAuth, fetchLatestEmail, fetchUpcomingAssignments } from '@/lib/google';
import { ingestAndClassify } from '@/services/classify.service';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
            return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
        }

        const accessToken = session.provider_token;
        const refreshToken = session.provider_refresh_token ?? undefined; // handle null type mismatch

        if (!accessToken) {
            return NextResponse.json({ error: 'Google Access Token not found in session. Please sign in with Google.' }, { status: 400 });
        }

        const auth = getGoogleAuth(accessToken, refreshToken);

        const results = {
            emailsIngested: 0,
            assignmentsIngested: 0,
            errors: [] as string[],
        };

        // 1. Fetch and ingest latest email
        try {
            const email = await fetchLatestEmail(auth);
            if (email) {
                await ingestAndClassify({
                    raw_text: `Subject: ${email.subject}\n\n${email.body}`,
                    source: 'gmail',
                    sender: email.sender,
                });
                results.emailsIngested++;
            }
        } catch (e: any) {
            results.errors.push(`Gmail Error: ${e.message}`);
        }

        // 2. Fetch and ingest upcoming assignments
        try {
            const assignments = await fetchUpcomingAssignments(auth);
            for (const assignment of assignments) {
                await ingestAndClassify({
                    raw_text: `Assignment: ${assignment.title}\nDue: ${assignment.dueDate.toLocaleString()}\n\n${assignment.description}`,
                    source: 'classroom',
                    sender: 'Google Classroom',
                    scheduled_for: assignment.dueDate.toISOString(),
                });
                results.assignmentsIngested++;
            }
        } catch (e: any) {
            results.errors.push(`Classroom Error: ${e.message}`);
        }

        return NextResponse.json({
            message: 'Google sync complete',
            data: results,
        }, { status: 200 });

    } catch (err: any) {
        console.error('[POST /api/ingest/google]', err);
        return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 });
    }
}
