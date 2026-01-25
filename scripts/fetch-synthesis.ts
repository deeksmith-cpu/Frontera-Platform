import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data, error } = await supabase
    .from('synthesis_outputs')
    .select('*')
    .eq('conversation_id', 'af00eec7-b785-4172-8412-e5b0a405411f')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (data?.hypothesis) {
    const synthesis = JSON.parse(data.hypothesis);
    console.log('=== EXECUTIVE SUMMARY ===');
    console.log(synthesis.executiveSummary);
    console.log('\n=== STRATEGIC OPPORTUNITIES ===');
    synthesis.opportunities?.forEach((o: { title: string; opportunityType: string; scoring?: { marketAttractiveness: number; capabilityFit: number; competitiveAdvantage: number }; description: string }, i: number) => {
      console.log(`\n${i+1}. ${o.title}`);
      console.log(`   Type: ${o.opportunityType}`);
      console.log(`   Scores: Market=${o.scoring?.marketAttractiveness}, Capability=${o.scoring?.capabilityFit}, Competitive=${o.scoring?.competitiveAdvantage}`);
      console.log(`   Description: ${o.description}`);
    });
    console.log('\n=== STRATEGIC TENSIONS ===');
    synthesis.tensions?.forEach((t: { description: string; impact: string }, i: number) => {
      console.log(`\n${i+1}. ${t.description}`);
      console.log(`   Impact: ${t.impact}`);
    });
    console.log('\n=== RECOMMENDATIONS ===');
    synthesis.recommendations?.forEach((r: string, i: number) => {
      console.log(`${i+1}. ${r}`);
    });
  } else {
    console.log('No synthesis found');
    console.log(JSON.stringify(data, null, 2));
  }
}

main();
