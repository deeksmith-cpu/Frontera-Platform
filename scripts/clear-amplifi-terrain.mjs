import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CONVERSATION_ID = '03f3e5df-ce99-4b4d-8946-ee9a72af61dd';

async function clearTerrainMapping() {
  console.log('=== Clearing Terrain Mapping for Amplifi ===\n');

  // 1. Check current territory insights
  const { data: insights } = await supabase
    .from('territory_insights')
    .select('*')
    .eq('conversation_id', CONVERSATION_ID);

  const insightCount = insights ? insights.length : 0;
  console.log('Found ' + insightCount + ' territory insights to delete');
  if (insights && insights.length > 0) {
    console.log('Insights:', insights.map(i => i.territory + '/' + i.research_area + ': ' + i.status));
  }

  // 2. Delete territory insights
  const { error: deleteError } = await supabase
    .from('territory_insights')
    .delete()
    .eq('conversation_id', CONVERSATION_ID);

  if (deleteError) {
    console.error('Error deleting insights:', deleteError);
  } else {
    console.log('✓ Deleted all territory insights');
  }

  // 3. Reset conversation phase back to discovery
  const { error: updateError } = await supabase
    .from('conversations')
    .update({
      current_phase: 'discovery',
      framework_state: {
        current_phase: 'discovery',
        discovery_complete: false,
        research_complete: false
      }
    })
    .eq('id', CONVERSATION_ID);

  if (updateError) {
    console.error('Error updating conversation:', updateError);
  } else {
    console.log('✓ Reset conversation phase to discovery');
  }

  // 4. Clear phase_progress if it exists
  const { error: progressError } = await supabase
    .from('phase_progress')
    .delete()
    .eq('conversation_id', CONVERSATION_ID);

  if (progressError) {
    console.log('Phase progress delete (may not exist):', progressError.message);
  } else {
    console.log('✓ Cleared phase progress');
  }

  console.log('\n=== Done! Amplifi terrain mapping has been reset ===');
}

clearTerrainMapping().catch(console.error);
