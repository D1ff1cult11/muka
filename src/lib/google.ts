import { google, Auth } from 'googleapis';

/**
 * Creates and returns an authenticated Google OAuth2 client.
 * This should be used on the server side using the user's stored refresh token.
 */
export function getGoogleAuth(accessToken: string, refreshToken?: string): Auth.OAuth2Client {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback/google`
    );

    oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    return oauth2Client;
}

export interface ExtractedEmail {
    id: string;
    snippet: string;
    body: string;
    sender: string;
    subject: string;
}

export interface ExtractedAssignment {
    id: string;
    courseId: string;
    courseName: string;
    title: string;
    description: string;
    dueDate: Date;
    url: string;
}

export interface ExtractedAnnouncement {
    id: string;
    courseId: string;
    courseName: string;
    text: string;
    createdAt: Date;
    url: string;
}

/**
 * Retrieves the snippet and body of the most recent emails.
 */
export async function fetchRecentEmails(auth: Auth.OAuth2Client): Promise<ExtractedEmail[]> {
    const gmail = google.gmail({ version: 'v1', auth });

    // Find the latest emails in the inbox (read or unread)
    const listRes = await gmail.users.messages.list({
        userId: 'me',
        q: 'in:inbox',
        maxResults: 3,
    });

    const messages = listRes.data.messages;
    if (!messages || messages.length === 0) {
        return [];
    }

    const extracted: ExtractedEmail[] = [];

    for (const msg of messages) {
        if (!msg.id) continue;

        try {
            const msgRes = await gmail.users.messages.get({
                userId: 'me',
                id: msg.id,
                format: 'full',
            });

            const { snippet, payload } = msgRes.data;

            // Extract headers
            const headers = payload?.headers || [];
            const subject = headers.find((h: { name?: string | null; value?: string | null }) => h.name === 'Subject')?.value || 'No Subject';
            const sender = headers.find((h: { name?: string | null; value?: string | null }) => h.name === 'From')?.value || 'Unknown Sender';

            // Extract body (prefer plain text)
            let body = snippet || '';
            if (payload?.parts) {
                const textPart = payload.parts.find((part: { mimeType?: string | null, body?: { data?: string | null } }) => part.mimeType === 'text/plain');
                if (textPart?.body?.data) {
                    body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
                }
            } else if (payload?.body?.data) {
                body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
            }

            extracted.push({
                id: msg.id,
                snippet: snippet || '',
                body,
                sender,
                subject,
            });
        } catch (error) {
            console.error(`Error fetching email ${msg.id}`, error);
        }
    }

    return extracted;
}

/**
 * Pulls the list of courseWork from Google Classroom, filtering for recent items.
 */
export async function fetchUpcomingAssignments(auth: Auth.OAuth2Client): Promise<ExtractedAssignment[]> {
    const classroom = google.classroom({ version: 'v1', auth });

    // 1. Get all active courses
    const coursesRes = await classroom.courses.list({
        courseStates: ['ACTIVE'],
    });

    const courses = coursesRes.data.courses;
    if (!courses || courses.length === 0) {
        console.log('[GClassroom] No active courses found.');
        return [];
    }

    console.log(`[GClassroom] Found ${courses.length} active courses: ${courses.map(c => c.name).join(', ')}`);

    const allAssignments: ExtractedAssignment[] = [];
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    // 2. Iterate courses and fetch coursework
    for (const course of courses) {
        if (!course.id) continue;

        try {
            const workRes = await classroom.courses.courseWork.list({
                courseId: course.id,
                orderBy: 'dueDate asc',
            });

            const courseWork = workRes.data.courseWork;
            if (!courseWork) {
                console.log(`[GClassroom] No coursework in: ${course.name}`);
                continue;
            }

            console.log(`[GClassroom] Found ${courseWork.length} items in: ${course.name}`);

            for (const work of courseWork) {
                let dueDate: Date;

                if (work.dueDate && work.dueDate.year && work.dueDate.month && work.dueDate.day) {
                    dueDate = new Date(
                        work.dueDate.year,
                        work.dueDate.month - 1,
                        work.dueDate.day,
                        work.dueTime?.hours || 23,
                        work.dueTime?.minutes || 59
                    );

                    // Skip assignments that are already past due
                    if (dueDate < now) continue;
                    // Skip assignments too far in the future
                    if (dueDate > thirtyDaysFromNow) continue;
                } else {
                    // No due date — treat as a general assignment, use creation time
                    dueDate = new Date(work.creationTime || Date.now());
                }

                allAssignments.push({
                    id: work.id || '',
                    courseId: course.id,
                    courseName: course.name || 'Google Classroom',
                    title: work.title || 'Untitled Assignment',
                    description: work.description || '',
                    dueDate,
                    url: work.alternateLink || '',
                });
            }
        } catch (error: unknown) {
            // Some courses might have coursework disabled for the user (400 invalid_request)
            // Catch, print a short debug warning, and continue to the next course instead of crashing
            const msg = error instanceof Error ? error.message : 'invalid_request';
            console.warn(`[GClassroom Warning] Skipping course ${course.id}: ${msg}`);
            continue;
        }
    }

    // Sort by soonest due date
    return allAssignments.sort((a: ExtractedAssignment, b: ExtractedAssignment) => a.dueDate.getTime() - b.dueDate.getTime());
}

/**
 * Pulls the most recent announcements from Google Classroom.
 */
export async function fetchRecentAnnouncements(auth: Auth.OAuth2Client): Promise<ExtractedAnnouncement[]> {
    const classroom = google.classroom({ version: 'v1', auth });

    const coursesRes = await classroom.courses.list({
        courseStates: ['ACTIVE'],
    });

    const courses = coursesRes.data.courses;
    if (!courses || courses.length === 0) return [];

    let announcements: ExtractedAnnouncement[] = [];

    for (const course of courses) {
        if (!course.id) continue;
        try {
            const annRes = await classroom.courses.announcements.list({
                courseId: course.id,
                orderBy: 'updateTime desc',
            });
            const anns = annRes.data.announcements;
            if (!anns) continue;

            for (const a of anns) {
                announcements.push({
                    id: a.id || '',
                    courseId: course.id,
                    courseName: course.name || 'Google Classroom',
                    text: a.text || 'No text',
                    createdAt: new Date(a.updateTime || Date.now()),
                    url: a.alternateLink || ''
                });
            }
        } catch (e: unknown) {
            console.warn(`[GClassroom Warning] Skipping course announcements ${course.id}: ${e instanceof Error ? e.message : String(e)}`);
        }
    }

    // Sort by most recent
    announcements = announcements.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return announcements.slice(0, 5); // Target the 5 most recent across all active classes
}

/**
 * Retrieves the count of unread emails in the user's inbox.
 * Added to support the realtime telemetry / analytics endpoint.
 */
export async function fetchUnreadEmailsCount(auth: Auth.OAuth2Client): Promise<number> {
    const gmail = google.gmail({ version: 'v1', auth });

    try {
        const listRes = await gmail.users.messages.list({
            userId: 'me',
            q: 'is:unread in:inbox',
            maxResults: 100, // Reasonable cap for calculating queue burden
        });

        return listRes.data.resultSizeEstimate || (listRes.data.messages?.length ?? 0);
    } catch (e: unknown) {
        console.error('[Google API] Error fetching unread email count', e);
        return 0;
    }
}

/**
 * Retrieves the count of pending assignments (due in the future) across active courses.
 * Added to support the realtime telemetry / analytics endpoint.
 */
export async function fetchPendingAssignmentsCount(auth: Auth.OAuth2Client): Promise<number> {
    const classroom = google.classroom({ version: 'v1', auth });

    try {
        const coursesRes = await classroom.courses.list({
            courseStates: ['ACTIVE'],
        });

        const courses = coursesRes.data.courses;
        if (!courses || courses.length === 0) return 0;

        let pendingCount = 0;
        const now = new Date();

        for (const course of courses) {
            if (!course.id) continue;
            try {
                const workRes = await classroom.courses.courseWork.list({
                    courseId: course.id,
                });

                const courseWork = workRes.data.courseWork;
                if (!courseWork) continue;

                for (const work of courseWork) {
                    if (work.dueDate && work.dueDate.year && work.dueDate.month && work.dueDate.day) {
                        const dueDate = new Date(
                            work.dueDate.year,
                            work.dueDate.month - 1,
                            work.dueDate.day,
                            work.dueTime?.hours || 23,
                            work.dueTime?.minutes || 59
                        );
                        if (dueDate > now) {
                            pendingCount++;
                        }
                    } else {
                        // Assignments without due dates are basically 'pending'
                        pendingCount++;
                    }
                }
            } catch (courseErr: unknown) {
                // Ignore per-course errors (like disabled coursework)
            }
        }

        return pendingCount;
    } catch (e: unknown) {
        console.error('[Google API] Error fetching pending assignments count', e);
        return 0;
    }
}
