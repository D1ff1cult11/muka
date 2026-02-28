require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
    const { data, error } = await supabase.from('notifications').select('*');
    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log(`Found ${data.length} notifications in the database.`);
        if (data.length > 0) {
            console.log('Sample:', JSON.stringify(data[0], null, 2));
        }
    }
}
check();
