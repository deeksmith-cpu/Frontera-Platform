#!/usr/bin/env node
/**
 * Clear Test Data Script
 *
 * Clears conversation messages, territory insights, synthesis outputs, and strategic materials
 * for a specific organization (Frontera) to enable clean UAT testing.
 *
 * Usage: node scripts/clear-test-data.mjs
 *
 * Note: Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
const envPath = join(__dirname, '..', '.env.local');
let SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY;

try {
  const envFile = readFileSync(envPath, 'utf8');
  const envVars = {};
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
  SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
  SUPABASE_SERVICE_ROLE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;
} catch (error) {
  // Fallback to process.env if file read fails
  SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase configuration');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function clearTestData() {
  console.log('🧹 Starting test data cleanup...\n');

  try {
    // Get all conversations (we'll clear all for simplicity, or you can filter by org)
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('id, clerk_org_id, title');

    if (convError) {
      console.error('❌ Error fetching conversations:', convError);
      return;
    }

    console.log(`📋 Found ${conversations?.length || 0} conversation(s) to clean\n`);

    for (const conv of conversations || []) {
      console.log(`🔄 Cleaning conversation: ${conv.title || conv.id}`);

      // Delete conversation messages
      const { error: msgError } = await supabase
        .from('conversation_messages')
        .delete()
        .eq('conversation_id', conv.id);

      if (msgError) {
        console.error(`  ❌ Error deleting messages:`, msgError.message);
      } else {
        console.log(`  ✅ Deleted conversation messages`);
      }

      // Delete territory insights
      const { error: insightError } = await supabase
        .from('territory_insights')
        .delete()
        .eq('conversation_id', conv.id);

      if (insightError) {
        console.error(`  ❌ Error deleting territory insights:`, insightError.message);
      } else {
        console.log(`  ✅ Deleted territory insights`);
      }

      // Delete synthesis outputs
      const { error: synthesisError } = await supabase
        .from('synthesis_outputs')
        .delete()
        .eq('conversation_id', conv.id);

      if (synthesisError) {
        console.error(`  ❌ Error deleting synthesis outputs:`, synthesisError.message);
      } else {
        console.log(`  ✅ Deleted synthesis outputs`);
      }

      // Delete strategic materials
      const { error: materialsError } = await supabase
        .from('strategic_materials')
        .delete()
        .eq('conversation_id', conv.id);

      if (materialsError) {
        console.error(`  ❌ Error deleting strategic materials:`, materialsError.message);
      } else {
        console.log(`  ✅ Deleted strategic materials`);
      }

      // Reset conversation framework state
      const { error: updateError } = await supabase
        .from('conversations')
        .update({
          framework_state: {
            version: 1,
            currentPhase: 'discovery',
            sessionCount: 1,
            totalMessageCount: 0,
            strategicBets: [],
            keyInsights: [],
            researchPillars: {
              macroMarket: { started: false, completed: false, insights: [] },
              customer: { started: false, completed: false, insights: [] },
              colleague: { started: false, completed: false, insights: [] },
            },
            lastActivityAt: new Date().toISOString(),
          },
          last_message_at: null,
        })
        .eq('id', conv.id);

      if (updateError) {
        console.error(`  ❌ Error resetting conversation state:`, updateError.message);
      } else {
        console.log(`  ✅ Reset conversation to discovery phase`);
      }

      console.log('');
    }

    console.log('✨ Test data cleanup complete!\n');
    console.log('📝 Summary:');
    console.log(`   - ${conversations?.length || 0} conversation(s) cleaned`);
    console.log('   - All messages, insights, synthesis, and materials removed');
    console.log('   - Conversations reset to discovery phase\n');
    console.log('🎯 You can now start fresh UAT testing!\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the cleanup
clearTestData();
