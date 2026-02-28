import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getGoogleAuth, fetchRecentEmails, fetchUpcomingAssignments, fetchRecentAnnouncements } from '@/lib/google';
import { ingestAndClassify } from '@/services/classify.service';

export async function POST() {
    try {
        const supabase = await createClient();
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
        }

        const user = session.user;
        const accessToken = session.provider_token;
        const refreshToken = session.provider_refresh_token ?? undefined;

        if (!accessToken) {
            return NextResponse.json({ error: 'Google Access Token not found in session. Please sign in with Google.' }, { status: 400 });
        }

        const auth = getGoogleAuth(accessToken, refreshToken);

        const results = {
            emailsIngested: 0,
            assignmentsIngested: 0,
            announcementsIngested: 0,
            errors: [] as string[],
        };

        // 1. Fetch and ingest latest emails
        try {
            const emails = await fetchRecentEmails(auth);
            for (const email of emails) {
                await ingestAndClassify({
                    external_id: email.id,
                    raw_text: `Subject: ${email.subject}\n\n${email.body}`,
                    source: 'gmail',
                    sender: email.sender,
                }, user.id);
                results.emailsIngested++;
            }
        } catch (e: unknown) {
            console.error("Gmail Fetch Error", e);
            results.errors.push(`Gmail Error: ${e instanceof Error ? e.message : String(e)}`);
        }

        // 2. Fetch and ingest upcoming assignments
        try {
            console.log('[Classroom] Fetching assignments...');
            const assignments = await fetchUpcomingAssignments(auth);
            console.log(`[Classroom] Found ${assignments.length} assignments`);
            for (const assignment of assignments) {
                await ingestAndClassify({
                    external_id: assignment.id,
                    raw_text: `Assignment: ${assignment.title}\nDue: ${assignment.dueDate.toLocaleString()}\n\n${assignment.description}`,
                    source: 'classroom',
                    sender: assignment.courseName,
                }, user.id);
                results.assignmentsIngested++;
            }
        } catch (e: unknown) {
            console.error("Classroom Fetch Error", e);
            results.errors.push(`Classroom Error: ${e instanceof Error ? e.message : String(e)}`);
        }

        // 3. Fetch and ingest recent announcements
        try {
            console.log('[Classroom] Fetching announcements...');
            const announcements = await fetchRecentAnnouncements(auth);
            console.log(`[Classroom] Found ${announcements.length} announcements`);
            for (const ann of announcements) {
                await ingestAndClassify({
                    raw_text: `Announcement: ${ann.text}\n\nLink: ${ann.url}`,
                    source: 'classroom',
                    sender: ann.courseName,
                    external_id: ann.id,
                }, user.id);
                results.announcementsIngested++;
            }
        } catch (e: unknown) {
            console.error("Classroom Announcements Fetch Error", e);
            results.errors.push(`Classroom Announcements Error: ${e instanceof Error ? e.message : String(e)}`);
        }

        console.log("== GOOGLE SYNC RESULTS ==", results);

        return NextResponse.json({
            message: 'Google sync complete',
            data: results,
        }, { status: 200 });

    } catch (err: unknown) {
        console.error('[POST /api/ingest/google]', err);
        return NextResponse.json({ error: err instanceof Error ? err.message : 'Unexpected error' }, { status: 500 });
    }
}
