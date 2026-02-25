import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findAmplifi() {
  // Find clients with "Amplifi" in the name
  const { data: clients, error: clientError } = await supabase
    .from('clients')
    .select('id, company_name, clerk_org_id')
    .ilike('company_name', '%amplifi%');
  
  console.log('Clients matching "Amplifi":', clients);
  
  if (clients && clients.length > 0) {
    // Find conversations for these clients
    for (const client of clients) {
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id, title, current_phase, created_at')
        .eq('clerk_org_id', client.clerk_org_id)
        .order('created_at', { ascending: false });
      
      console.log(`\nConversations for ${client.company_name}:`, conversations);
      
      // Check territory insights for each conversation
      if (conversations) {
        for (const conv of conversations) {
          const { data: insights } = await supabase
            .from('territory_insights')
            .select('id, territory, research_area, status')
            .eq('conversation_id', conv.id);
          
          if (insights && insights.length > 0) {
            console.log(`  - Conversation ${conv.id} has ${insights.length} territory insights`);
          }
        }
      }
    }
  }
}

findAmplifi().catch(console.error);
