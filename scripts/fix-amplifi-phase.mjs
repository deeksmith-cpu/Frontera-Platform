import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CONVERSATION_ID = '03f3e5df-ce99-4b4d-8946-ee9a72af61dd';

async function fixPhase() {
  console.log('=== Fixing Amplifi Conversation Phase ===\n');

  // Update to research phase with proper field names
  const { data, error } = await supabase
    .from('conversations')
    .update({
      current_phase: 'research',
      framework_state: {
        currentPhase: 'research',
        highestPhaseReached: 'research',
        discoveryComplete: true,
        researchComplete: false
      }
    })
    .eq('id', CONVERSATION_ID)
    .select()
    .single();

  if (error) {
    console.error('Error updating conversation:', error);
  } else {
    console.log('Updated conversation:');
    console.log('  current_phase:', data.current_phase);
    console.log('  framework_state:', JSON.stringify(data.framework_state, null, 2));
  }

  console.log('\n=== Done! ===');
}

fixPhase().catch(console.error);
