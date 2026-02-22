#!/usr/bin/env node

/**
 * Extract Amplifi's Strategic Terrain research Q&A from Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load env
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Research questions (mirroring research-questions.ts)
const RESEARCH = {
  company: {
    label: 'Company Territory',
    areas: {
      core_capabilities: {
        title: 'Core Capabilities & Constraints',
        questions: [
          "What are your organization's core competencies and differentiating capabilities?",
          "What key resources (technical, human, IP) do you control that competitors don't?",
          "What structural constraints limit your strategic freedom (legacy systems, contracts, regulations)?",
          "Which capabilities are table stakes vs. truly differentiated in your market?",
        ],
      },
      resource_reality: {
        title: 'Resource Reality',
        questions: [
          'What is the current composition and skill distribution of your team?',
          'What technology stack and infrastructure do you have in place?',
          'What funding runway and burn rate define your strategic timeline?',
          'What hiring constraints or talent gaps could impact execution?',
        ],
      },
      product_portfolio: {
        title: 'Product Portfolio & Market Position',
        questions: [
          'What products/services comprise your current portfolio and how do they perform?',
          'Which products are growth drivers vs. legacy offerings?',
          'What is your current market position and competitive standing?',
          'What gaps exist between your current portfolio and market opportunities?',
        ],
      },
    },
  },
  customer: {
    label: 'Customer Territory',
    areas: {
      customer_segmentation: {
        title: 'Customer Segmentation & Behaviors',
        questions: [
          'What are your primary customer segments, and how do they differ in needs, behaviors, and value?',
          'How do customers currently discover, evaluate, and purchase solutions in your category?',
          'What decision-making criteria matter most to each segment (price, features, trust, speed, etc.)?',
          'Which customer segments are growing, declining, or emerging in your market?',
        ],
      },
      unmet_needs: {
        title: 'Unmet Needs & Pain Points',
        questions: [
          'What are the most significant pain points customers experience with existing solutions (including yours)?',
          'What jobs-to-be-done are customers hiring products for, and where do current solutions fall short?',
          'What workarounds, hacks, or compromises do customers make to get their jobs done?',
          'What emerging needs or latent desires are customers beginning to express?',
        ],
      },
      market_dynamics: {
        title: 'Market Dynamics & Customer Evolution',
        questions: [
          'How have customer expectations evolved in the past 2-3 years, and what trends are accelerating?',
          "What new alternatives or substitutes are customers considering that didn't exist before?",
          'How are customer acquisition costs, retention rates, and lifetime value trending in your category?',
          'What external forces (technology, regulation, economics, culture) are reshaping customer needs?',
        ],
      },
    },
  },
  competitor: {
    label: 'Market Context',
    areas: {
      direct_competitors: {
        title: 'Direct Competitor Landscape',
        questions: [
          'Who are your top 3-5 direct competitors, and what makes them your primary competition?',
          "What are each competitor's core value propositions, and how do they differentiate?",
          'Where do competitors have clear advantages over your current offering?',
          'What competitive moves or announcements have you observed in the past 12 months?',
        ],
      },
      substitute_threats: {
        title: 'Substitute & Adjacent Threats',
        questions: [
          'What non-traditional solutions do customers use to solve the same problems you address?',
          'What adjacent products or services are expanding into your market space?',
          'What emerging startups or disruptors are gaining traction with your target customers?',
          'How might technology shifts (AI, automation, platforms) create new competitive threats?',
        ],
      },
      market_forces: {
        title: 'Market Forces & Dynamics',
        questions: [
          'What macroeconomic, regulatory, or industry trends are most impacting your market?',
          'How is the overall market size and growth trajectory evolving?',
          'What barriers to entry exist, and are they strengthening or weakening?',
          'What emerging customer expectations or behaviors are changing competitive dynamics?',
        ],
      },
    },
  },
};

async function main() {
  // Step 1: Find Amplifi's client record
  const { data: clients, error: clientErr } = await supabase
    .from('clients')
    .select('*')
    .ilike('company_name', '%amplifi%');

  if (clientErr) {
    console.error('Error finding Amplifi client:', clientErr);
    process.exit(1);
  }

  if (!clients || clients.length === 0) {
    console.log('No client found with name matching "Amplifi". Searching conversations directly...');
  } else {
    console.log(`Found ${clients.length} client(s) matching "Amplifi":`);
    clients.forEach((c) => console.log(`  - ${c.company_name} (org: ${c.clerk_org_id})`));
  }

  // Step 2: Find conversations (try by org_id first, then by title)
  let conversations;
  if (clients && clients.length > 0) {
    const orgId = clients[0].clerk_org_id;
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('clerk_org_id', orgId)
      .eq('agent_type', 'strategy_coach')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      process.exit(1);
    }
    conversations = data;
  } else {
    // Fallback: search all conversations for anything Amplifi-related
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('agent_type', 'strategy_coach')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      process.exit(1);
    }
    conversations = data;
  }

  if (!conversations || conversations.length === 0) {
    console.error('No strategy_coach conversations found.');
    process.exit(1);
  }

  console.log(`\nFound ${conversations.length} conversation(s):`);
  conversations.forEach((c) =>
    console.log(`  - ${c.id} | "${c.title}" | phase: ${(c.framework_state)?.currentPhase || 'unknown'}`)
  );

  // Step 3: Get territory insights for each conversation
  for (const conv of conversations) {
    const { data: insights, error: insightErr } = await supabase
      .from('territory_insights')
      .select('*')
      .eq('conversation_id', conv.id)
      .order('territory')
      .order('research_area');

    if (insightErr) {
      console.error(`Error fetching insights for ${conv.id}:`, insightErr);
      continue;
    }

    if (!insights || insights.length === 0) {
      console.log(`\n  No territory insights for conversation "${conv.title}"`);
      continue;
    }

    console.log(`\n${'='.repeat(80)}`);
    console.log(`CONVERSATION: "${conv.title}" (${conv.id})`);
    console.log(`${'='.repeat(80)}`);

    // Group by territory
    const byTerritory = {};
    for (const insight of insights) {
      if (!byTerritory[insight.territory]) byTerritory[insight.territory] = [];
      byTerritory[insight.territory].push(insight);
    }

    // Output structured Q&A
    for (const territory of ['company', 'customer', 'competitor']) {
      const territoryInsights = byTerritory[territory];
      if (!territoryInsights) continue;

      const territoryDef = RESEARCH[territory];
      console.log(`\n## ${territoryDef.label}`);
      console.log('-'.repeat(40));

      for (const insight of territoryInsights) {
        const areaDef = territoryDef.areas[insight.research_area];
        if (!areaDef) {
          console.log(`\n### Unknown area: ${insight.research_area} (status: ${insight.status})`);
          console.log(JSON.stringify(insight.responses, null, 2));
          continue;
        }

        console.log(`\n### ${areaDef.title} [${insight.status.toUpperCase()}]`);

        const responses = insight.responses || {};
        for (let i = 0; i < areaDef.questions.length; i++) {
          const answer = responses[String(i)] || responses[i];
          console.log(`\nQ${i + 1}: ${areaDef.questions[i]}`);
          if (answer) {
            console.log(`A${i + 1}: ${answer}`);
          } else {
            console.log(`A${i + 1}: [No response]`);
          }
        }
      }
    }
  }

  // Step 4: Also get uploaded materials
  if (conversations.length > 0) {
    const convId = conversations[0].id;
    const { data: materials } = await supabase
      .from('uploaded_materials')
      .select('filename, file_type, processing_status, created_at')
      .eq('conversation_id', convId);

    if (materials && materials.length > 0) {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`UPLOADED MATERIALS (${materials.length} documents)`);
      console.log(`${'='.repeat(80)}`);
      materials.forEach((m) => console.log(`  - ${m.filename} (${m.file_type}) [${m.processing_status}]`));
    }
  }
}

main().catch(console.error);
