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
    title: string;
    description: string;
    dueDate: Date;
    url: string;
}

/**
 * Retrieves the snippet and body of the most recent unread email.
 */
export async function fetchLatestEmail(auth: Auth.OAuth2Client): Promise<ExtractedEmail | null> {
    const gmail = google.gmail({ version: 'v1', auth });

    // Find the latest unread email in the inbox
    const listRes = await gmail.users.messages.list({
        userId: 'me',
        q: 'is:unread in:inbox',
        maxResults: 1,
    });

    const messages = listRes.data.messages;
    if (!messages || messages.length === 0) {
        return null;
    }

    const messageId = messages[0].id!;
    const msgRes = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full',
    });

    const { snippet, payload } = msgRes.data;

    // Extract headers
    const headers = payload?.headers || [];
    const subject = headers.find((h) => h.name === 'Subject')?.value || 'No Subject';
    const sender = headers.find((h) => h.name === 'From')?.value || 'Unknown Sender';

    // Extract body (prefer plain text)
    let body = snippet || '';
    if (payload?.parts) {
        const textPart = payload.parts.find((part) => part.mimeType === 'text/plain');
        if (textPart?.body?.data) {
            body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
        }
    } else if (payload?.body?.data) {
        body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
    }

    return {
        id: messageId,
        snippet: snippet || '',
        body,
        sender,
        subject,
    };
}

/**
 * Pulls the list of courseWork from Google Classroom, filtering for items due within 7 days.
 */
export async function fetchUpcomingAssignments(auth: Auth.OAuth2Client): Promise<ExtractedAssignment[]> {
    const classroom = google.classroom({ version: 'v1', auth });

    // 1. Get all active courses
    const coursesRes = await classroom.courses.list({
        courseStates: ['ACTIVE'],
    });

    const courses = coursesRes.data.courses;
    if (!courses || courses.length === 0) {
        return [];
    }

    const upcomingAssignments: ExtractedAssignment[] = [];
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    // 2. Iterate courses and fetch coursework
    for (const course of courses) {
        if (!course.id) continue;

        try {
            const workRes = await classroom.courses.courseWork.list({
                courseId: course.id,
                orderBy: 'dueDate asc',
            });

            const courseWork = workRes.data.courseWork;
            if (!courseWork) continue;

            for (const work of courseWork) {
                if (work.dueDate && work.dueDate.year && work.dueDate.month && work.dueDate.day) {
                    const dueDate = new Date(
                        work.dueDate.year,
                        work.dueDate.month - 1, // month is 1-12
                        work.dueDate.day,
                        work.dueTime?.hours || 23,
                        work.dueTime?.minutes || 59
                    );

                    // Filter assignments due within the next 7 days
                    if (dueDate > now && dueDate <= sevenDaysFromNow) {
                        upcomingAssignments.push({
                            id: work.id || '',
                            courseId: course.id,
                            title: work.title || 'Untitled Assignment',
                            description: work.description || '',
                            dueDate,
                            url: work.alternateLink || '',
                        });
                    }
                }
            }
        } catch (error) {
            // Some courses might have coursework disabled for the user, catch and continue
            console.error(`Error fetching coursework for course ${course.id}`, error);
        }
    }

    // Sort by soonest due date
    return upcomingAssignments.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}
