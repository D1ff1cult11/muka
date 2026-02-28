import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ingestAndClassify, getNotificationsByZone } from '@/services/classify.service';

/**
 * Technical Requirement 3: Parallel Fetching (Optimized)
 * Fetches the 5 most recent emails, but filters by cachedIds BEFORE fetching details
 * to minimize network overhead and latency in serverless environments.
 */
async function fetchGmail(accessToken: string, cachedIds: string[]) {
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5', {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) throw new Error('Gmail API fetch failed');
    const data = await response.json();

    if (!data.messages) return [];

    // OPTIMIZATION: Filter out messages we already have before fetching details
    const newMessages = data.messages.filter((msg: any) => !cachedIds.includes(msg.id));

    // Fetch detailed info ONLY for new messages
    const details = await Promise.all(
        newMessages.map(async (msg: any) => {
            const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!res.ok) return null;
            const detail = await res.json();

            const subject = detail.payload.headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject';
            return {
                id: detail.id,
                source: 'gmail',
                title: subject,
                snippet: detail.snippet,
                timestamp: new Date(parseInt(detail.internalDate)).toISOString(),
            };
        })
    );

    return details.filter(Boolean) as any[]; // Remove nulls from failed individual fetches
}

/**
 * Technical Requirement 3: Parallel Fetching
 * Fetches the 5 most recent or active assignments from Google Classroom.
 */
async function fetchClassroom(accessToken: string) {
    // Fetching courses first to get course ID, or using '-' for all courses
    const response = await fetch('https://classroom.googleapis.com/v1/courses/-/courseWork?pageSize=5', {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) throw new Error('Google Classroom API fetch failed');
    const data = await response.json();

    if (!data.courseWork) return [];

    return data.courseWork.map((work: any) => ({
        id: work.id,
        source: 'classroom',
        title: work.title,
        snippet: work.description || 'No description provided.',
        timestamp: work.creationTime,
    }));
}

/**
 * Technical Requirement 6: Hugging Face AI Classification
 * Uses Zero-Shot classification to label notifications.
 */
async function classifyMessage(title: string, snippet: string) {
    const API_KEY = process.env.HUGGINGFACE_API_KEY;
    if (!API_KEY) return 'Batch'; // Fallback if no key

    const content = `Title: ${title}\nContent: ${snippet}`;

    try {
        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli",
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: content,
                    parameters: { candidate_labels: ["Instant", "Scheduled", "Batch"] }
                }),
            }
        );

        const result = await response.json();
        return result.labels?.[0] || 'Batch';
    } catch (error) {
        console.error('AI Classification error:', error);
        return 'Batch';
    }
}

/**
 * API Route Handler
 * Technical Requirement 1: POST request
 */
export async function POST(req: Request) {
    try {
        const { cachedIds } = await req.json();

        // Technical Requirement 2: Authentication
        // Adapting for Supabase as per project architecture
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        // In Supabase, the provider_token (Google Access Token) is available if enabled in the dashboard
        // Note: This requires the 'google' provider to be linked and configured to store tokens.
        const accessToken = session?.provider_token;

        if (!user || !accessToken || authError) {
            return NextResponse.json({ error: 'Unauthorized: Missing Google Access Token' }, { status: 401 });
        }

        // Technical Requirement 3: Parallel Fetching
        const [gmailData, classroomData] = await Promise.all([
            fetchGmail(accessToken, cachedIds),
            fetchClassroom(accessToken),
        ]);

        // Technical Requirement 4: Data Standardization
        const unifiedData = [...gmailData, ...classroomData];

        // Technical Requirement 5: Intelligent Caching Logic
        const newItems = unifiedData.filter(item => !cachedIds.includes(item.id));

        if (newItems.length === 0) {
            return NextResponse.json([]);
        }

        // Technical Requirement 6: Persistent AI Classification
        await Promise.allSettled(
            newItems.map(async (item) => {
                return ingestAndClassify({
                    raw_text: item.snippet,
                    title: item.title,
                    sender: item.source === 'gmail' ? 'Gmail' : 'Classroom',
                    source: item.source,
                    external_id: item.id
                }, user.id);
            })
        );

        // Technical Requirement 7: Response (Stateful Sync)
        const notifications = await getNotificationsByZone(user.id);
        const allItems = [
            ...notifications.instant,
            ...notifications.scheduled,
            ...notifications.batch
        ].map(n => ({
            id: n.id,
            external_id: n.external_id,
            title: n.title || n.raw_text.substring(0, 50),
            snippet: n.raw_text,
            source: n.source,
            label: n.zone.charAt(0).toUpperCase() + n.zone.slice(1),
            timestamp: n.created_at
        }));

        return NextResponse.json(allItems);

    } catch (error: any) {
        // Technical Requirement 8: Error Handling
        console.error('Processing Gateway Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
    }
}
