export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { getGoogleAuth, fetchLatestEmail, fetchUpcomingAssignments } from '@/lib/google';
import { createClient } from '@/lib/supabase/server';
import { ingestAndClassify } from '@/services/classify.service';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { accessToken, refreshToken } = body;

        if (!accessToken) {
            return NextResponse.json({ error: '`accessToken` is required.' }, { status: 400 });
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
                }, user.id);
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
                }, user.id);
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
