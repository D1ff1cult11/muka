require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testApiLogic() {
    try {
        console.log("Fetching notifications just like API does...");
        const userId = "e98b24a5-f0ea-48bd-bf0d-5581cea522aa"; // Known user ID from DB

        const { data, error } = await supabaseAdmin
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .eq('is_dismissed', false)
            .order('created_at', { ascending: false });

        if (error) throw new Error(`Supabase query failed: ${error.message}`);
        const notifications = data || [];

        const grouped = {
            instant: notifications.filter(n => (n.user_zone ?? n.zone) === 'instant'),
            scheduled: notifications.filter(n => (n.user_zone ?? n.zone) === 'scheduled'),
            batch: notifications.filter(n => (n.user_zone ?? n.zone) === 'batch'),
        };

        const allItems = [
            ...grouped.instant,
            ...grouped.scheduled,
            ...grouped.batch
        ].map(n => ({
            id: n.id,
            external_id: n.external_id,
            title: n.title || n.raw_text.substring(0, 50),
            snippet: n.raw_text,
            source: n.source,
            sender: n.sender,
            label: (n.user_zone ?? n.zone).charAt(0).toUpperCase() + (n.user_zone ?? n.zone).slice(1),
            timestamp: n.created_at
        }));

        console.log(`Success! Mapped ${allItems.length} items.`);

        if (allItems.length > 0) {
            console.log("Sample mapped item:", JSON.stringify(allItems[0], null, 2));
        }
    } catch (e) {
        console.error("API LOGIC CRASHED:", e);
    }
}

testApiLogic();
