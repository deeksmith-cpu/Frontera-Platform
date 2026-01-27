#!/usr/bin/env node
/**
 * Standalone PDF Generation Script
 *
 * This script runs completely outside of Next.js bundling to avoid
 * the dual React instance issue.
 *
 * Usage:
 *   node scripts/generate-pdf.mjs < input.json > output.pdf
 *
 * Input JSON format:
 *   { synthesis: {...}, client: {...}, generatedAt: "ISO date string" }
 */

import { renderToBuffer, Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { createElement } from 'react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load logo as base64 data URI for react-pdf compatibility
const logoFilePath = path.join(__dirname, '..', 'public', 'frontera-logo-F.jpg');
let LOGO_DATA_URI = null;
try {
  const logoBuffer = fs.readFileSync(logoFilePath);
  LOGO_DATA_URI = `data:image/jpeg;base64,${logoBuffer.toString('base64')}`;
} catch {
  // Logo not found - will render without it
  LOGO_DATA_URI = null;
}

// Frontera Brand Colors
const COLORS = {
  // Primary brand colors
  indigo: { 50: '#eef2ff', 100: '#e0e7ff', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3' },
  cyan: { 50: '#ecfeff', 100: '#cffafe', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490' },
  // Neutral colors (slate palette)
  slate: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a' },
  // Accent colors
  emerald: { 50: '#ecfdf5', 100: '#d1fae5', 500: '#10b981', 600: '#059669' },
  amber: { 50: '#fffbeb', 100: '#fef3c7', 500: '#f59e0b', 600: '#d97706' },
  purple: { 50: '#faf5ff', 100: '#f3e8ff', 500: '#a855f7', 600: '#9333ea' },
  white: '#ffffff',
};

// Enhanced styles following Frontera design guidelines
const styles = {
  // Page layouts
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: COLORS.slate[900],
    backgroundColor: COLORS.white,
  },
  coverPage: {
    padding: 0,
    backgroundColor: COLORS.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  // Typography
  h1: { fontSize: 28, fontFamily: 'Helvetica-Bold', color: COLORS.slate[900], marginBottom: 16, letterSpacing: -0.5 },
  h2: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: COLORS.slate[900], marginBottom: 12, letterSpacing: -0.3 },
  h3: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: COLORS.slate[800], marginBottom: 8 },
  body: { fontSize: 10, lineHeight: 1.6, color: COLORS.slate[700] },
  bodySmall: { fontSize: 9, lineHeight: 1.5, color: COLORS.slate[600] },
  label: { fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, color: COLORS.slate[500] },
  // Components
  card: {
    backgroundColor: COLORS.white,
    border: `1pt solid ${COLORS.slate[200]}`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHighlight: {
    backgroundColor: COLORS.slate[50],
    border: `1pt solid ${COLORS.slate[200]}`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, fontSize: 7, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  // Brand accents
  accentBar: { width: '100%', height: 4, backgroundColor: COLORS.indigo[600] },
  gradientBar: { width: '100%', height: 6, backgroundColor: COLORS.indigo[600] },
  // Layout utilities
  mb8: { marginBottom: 8 },
  mb12: { marginBottom: 12 },
  mb16: { marginBottom: 16 },
  mb24: { marginBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center' },
  flex1: { flex: 1 },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 8,
    color: COLORS.slate[400],
    borderTop: `1pt solid ${COLORS.slate[200]}`,
    paddingTop: 10,
  },
  // Stats cards
  statCard: {
    flex: 1,
    backgroundColor: COLORS.slate[50],
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: COLORS.slate[500],
  },
};

// Quadrant styles with Frontera colors
const QUADRANT_STYLES = {
  invest: { backgroundColor: COLORS.emerald[50], color: COLORS.emerald[600], borderColor: COLORS.emerald[500] },
  explore: { backgroundColor: COLORS.indigo[50], color: COLORS.indigo[600], borderColor: COLORS.indigo[500] },
  harvest: { backgroundColor: COLORS.amber[50], color: COLORS.amber[600], borderColor: COLORS.amber[500] },
  divest: { backgroundColor: COLORS.slate[100], color: COLORS.slate[600], borderColor: COLORS.slate[400] },
};

const h = createElement;

function truncate(text, maxLength) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function createCoverPage(client, generatedAt) {
  return h(Page, { size: 'A4', style: styles.coverPage },
    // Top accent bar (Indigo brand color)
    h(View, { style: { width: '100%', height: 8, backgroundColor: COLORS.indigo[600] } }),

    // Main content area
    h(View, { style: { flex: 1, padding: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' } },
      // Logo
      h(View, { style: { marginBottom: 40, alignItems: 'center' } },
        LOGO_DATA_URI && h(Image, { src: LOGO_DATA_URI, style: { width: 80, height: 80, borderRadius: 16 } }),
        h(Text, { style: { fontSize: 36, fontFamily: 'Helvetica-Bold', color: COLORS.indigo[600], marginTop: LOGO_DATA_URI ? 16 : 0, letterSpacing: 2 } }, 'FRONTERA')
      ),

      // Report type badge
      h(View, { style: { backgroundColor: COLORS.indigo[50], paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginBottom: 24 } },
        h(Text, { style: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: COLORS.indigo[600], textTransform: 'uppercase', letterSpacing: 1.5 } }, 'STRATEGIC SYNTHESIS REPORT')
      ),

      // Company name
      h(Text, { style: { fontSize: 32, fontFamily: 'Helvetica-Bold', color: COLORS.slate[900], textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 } },
        client?.company_name || 'Strategy Report'
      ),

      // Industry tag
      client?.industry && h(View, { style: { backgroundColor: COLORS.slate[100], paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 } },
        h(Text, { style: { fontSize: 10, color: COLORS.slate[600] } }, client.industry)
      ),

      // Date
      h(Text, { style: { fontSize: 11, color: COLORS.slate[400], marginTop: 32 } }, formatDate(generatedAt))
    ),

    // Footer section
    h(View, { style: { padding: 40, borderTop: `1pt solid ${COLORS.slate[200]}`, alignItems: 'center' } },
      h(Text, { style: { fontSize: 9, color: COLORS.slate[500] } }, 'Generated by Frontera AI Strategy Coach'),
      h(Text, { style: { fontSize: 8, color: COLORS.slate[400], marginTop: 4 } }, 'Using the Playing to Win Strategic Framework')
    )
  );
}

function createExecutiveSummaryPage(synthesis, client, pageNumber = 2) {
  return h(Page, { size: 'A4', style: styles.page },
    // Section header with accent
    h(View, { style: { marginBottom: 20 } },
      h(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 } },
        h(View, { style: { width: 4, height: 24, backgroundColor: COLORS.indigo[600], borderRadius: 2, marginRight: 12 } }),
        h(Text, { style: { ...styles.h2, marginBottom: 0 } }, 'Executive Summary')
      )
    ),

    // Executive summary text in a highlighted card
    h(View, { style: { ...styles.cardHighlight, marginBottom: 24 } },
      h(Text, { style: { ...styles.body, fontSize: 11, lineHeight: 1.7 } }, synthesis.executiveSummary || 'No executive summary available.')
    ),

    // Stats row
    h(View, { style: { ...styles.row, gap: 16, marginBottom: 24 } },
      h(View, { style: styles.statCard },
        h(Text, { style: { ...styles.statNumber, color: COLORS.indigo[600] } }, String(synthesis.opportunities?.length || 0)),
        h(Text, { style: styles.statLabel }, 'OPPORTUNITIES')
      ),
      h(View, { style: styles.statCard },
        h(Text, { style: { ...styles.statNumber, color: COLORS.amber[600] } }, String(synthesis.tensions?.length || 0)),
        h(Text, { style: styles.statLabel }, 'TENSIONS')
      ),
      h(View, { style: styles.statCard },
        h(Text, { style: { ...styles.statNumber, color: COLORS.emerald[600] } }, String(synthesis.recommendations?.length || 0)),
        h(Text, { style: styles.statLabel }, 'ACTIONS')
      )
    ),

    // Priority Recommendations
    synthesis.recommendations?.length > 0 && h(View, { style: styles.mb16 },
      h(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 } },
        h(View, { style: { width: 4, height: 20, backgroundColor: COLORS.emerald[600], borderRadius: 2, marginRight: 12 } }),
        h(Text, { style: { ...styles.h3, marginBottom: 0 } }, 'Priority Recommendations')
      ),
      ...synthesis.recommendations.slice(0, 3).map((rec, i) =>
        h(View, { key: `rec-${i}`, style: { ...styles.row, marginBottom: 10, padding: 12, backgroundColor: COLORS.white, border: `1pt solid ${COLORS.slate[200]}`, borderRadius: 8 } },
          h(View, { style: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.emerald[600], alignItems: 'center', justifyContent: 'center', marginRight: 12 } },
            h(Text, { style: { color: COLORS.white, fontSize: 12, fontFamily: 'Helvetica-Bold' } }, String(i + 1))
          ),
          h(Text, { style: { ...styles.body, flex: 1, fontSize: 10 } }, truncate(rec, 95))
        )
      )
    ),

    // Footer
    h(View, { style: styles.footer },
      h(Text, null, client?.company_name || 'Strategic Synthesis'),
      h(Text, null, `Page ${pageNumber}`)
    )
  );
}

// 2x2 Strategic Opportunity Map
function createStrategicMapPage(opportunities, client, pageNumber) {
  // Grid dimensions
  const gridSize = 300;
  const gridLeft = 120;
  const gridTop = 120;

  // Calculate position for each opportunity based on scores
  function getOpportunityPosition(opp) {
    const capabilityFit = opp.scoring?.capabilityFit || 5;
    const marketAttractiveness = opp.scoring?.marketAttractiveness || 5;

    // X: capabilityFit (1-10) -> 0 to gridSize
    const x = ((capabilityFit - 1) / 9) * gridSize;
    // Y: marketAttractiveness (1-10) -> gridSize to 0 (inverted so high is at top)
    const y = ((10 - marketAttractiveness) / 9) * gridSize;

    return { x, y };
  }

  // Get quadrant color for dot
  function getDotColor(quadrant) {
    switch (quadrant) {
      case 'invest': return COLORS.emerald[600];
      case 'explore': return COLORS.indigo[600];
      case 'harvest': return COLORS.amber[600];
      case 'divest': return COLORS.slate[500];
      default: return COLORS.indigo[600];
    }
  }

  return h(Page, { size: 'A4', style: styles.page },
    // Title
    h(Text, { style: styles.h2 }, 'Strategic Opportunity Map'),
    h(Text, { style: { ...styles.body, marginBottom: 24 } },
      'Opportunities positioned by market attractiveness and capability fit. Higher positions indicate greater market potential; rightward positions indicate stronger capability alignment.'
    ),

    // Grid container with relative positioning
    h(View, { style: { position: 'relative', width: gridSize + 80, height: gridSize + 80, marginLeft: 40, marginTop: 20 } },
      // Y-axis label
      h(View, { style: { position: 'absolute', left: -10, top: gridSize / 2, transform: 'rotate(-90deg)', transformOrigin: 'center' } },
        h(Text, { style: { fontSize: 9, color: COLORS.slate[600], fontFamily: 'Helvetica-Bold' } }, 'MARKET ATTRACTIVENESS')
      ),
      h(Text, { style: { position: 'absolute', left: 0, top: 0, fontSize: 8, color: COLORS.slate[500] } }, 'High'),
      h(Text, { style: { position: 'absolute', left: 0, top: gridSize - 10, fontSize: 8, color: COLORS.slate[500] } }, 'Low'),

      // X-axis label
      h(Text, { style: { position: 'absolute', left: gridLeft + gridSize / 2 - 50, top: gridSize + 55, fontSize: 9, color: COLORS.slate[600], fontFamily: 'Helvetica-Bold', textAlign: 'center' } }, 'CAPABILITY FIT'),
      h(Text, { style: { position: 'absolute', left: gridLeft, top: gridSize + 40, fontSize: 8, color: COLORS.slate[500] } }, 'Low'),
      h(Text, { style: { position: 'absolute', left: gridLeft + gridSize - 20, top: gridSize + 40, fontSize: 8, color: COLORS.slate[500] } }, 'High'),

      // Grid background with quadrants
      h(View, { style: { position: 'absolute', left: gridLeft, top: 0, width: gridSize, height: gridSize, border: `1pt solid ${COLORS.slate[300]}` } },
        // Top-left quadrant (EXPLORE)
        h(View, { style: { position: 'absolute', left: 0, top: 0, width: gridSize / 2, height: gridSize / 2, backgroundColor: COLORS.indigo[50] } },
          h(Text, { style: { position: 'absolute', left: 8, top: 8, fontSize: 8, fontFamily: 'Helvetica-Bold', color: COLORS.indigo[600] } }, 'EXPLORE')
        ),
        // Top-right quadrant (INVEST)
        h(View, { style: { position: 'absolute', left: gridSize / 2, top: 0, width: gridSize / 2, height: gridSize / 2, backgroundColor: COLORS.emerald[50] } },
          h(Text, { style: { position: 'absolute', right: 8, top: 8, fontSize: 8, fontFamily: 'Helvetica-Bold', color: COLORS.emerald[600] } }, 'INVEST')
        ),
        // Bottom-left quadrant (DIVEST)
        h(View, { style: { position: 'absolute', left: 0, top: gridSize / 2, width: gridSize / 2, height: gridSize / 2, backgroundColor: COLORS.slate[100] } },
          h(Text, { style: { position: 'absolute', left: 8, bottom: 8, fontSize: 8, fontFamily: 'Helvetica-Bold', color: COLORS.slate[600] } }, 'DIVEST')
        ),
        // Bottom-right quadrant (HARVEST)
        h(View, { style: { position: 'absolute', left: gridSize / 2, top: gridSize / 2, width: gridSize / 2, height: gridSize / 2, backgroundColor: COLORS.amber[50] } },
          h(Text, { style: { position: 'absolute', right: 8, bottom: 8, fontSize: 8, fontFamily: 'Helvetica-Bold', color: COLORS.amber[600] } }, 'HARVEST')
        ),

        // Center lines
        h(View, { style: { position: 'absolute', left: gridSize / 2, top: 0, width: 1, height: gridSize, backgroundColor: COLORS.slate[300] } }),
        h(View, { style: { position: 'absolute', left: 0, top: gridSize / 2, width: gridSize, height: 1, backgroundColor: COLORS.slate[300] } }),

        // Opportunity dots
        ...opportunities.map((opp, i) => {
          const pos = getOpportunityPosition(opp);
          const dotColor = getDotColor(opp.quadrant);
          return h(View, {
            key: `dot-${i}`,
            style: {
              position: 'absolute',
              left: pos.x - 8,
              top: pos.y - 8,
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: dotColor,
              alignItems: 'center',
              justifyContent: 'center',
            }
          },
            h(Text, { style: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: COLORS.white } }, String(i + 1))
          );
        })
      )
    ),

    // Legend
    h(View, { style: { marginTop: 60, marginLeft: 40 } },
      h(Text, { style: { ...styles.label, marginBottom: 12 } }, 'OPPORTUNITIES'),
      h(View, { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 } },
        ...opportunities.map((opp, i) => {
          const quadrantStyle = QUADRANT_STYLES[opp.quadrant] || QUADRANT_STYLES.explore;
          return h(View, {
            key: `legend-${i}`,
            style: { flexDirection: 'row', alignItems: 'center', width: '45%', marginBottom: 8 }
          },
            h(View, { style: { width: 20, height: 20, borderRadius: 10, backgroundColor: getDotColor(opp.quadrant), alignItems: 'center', justifyContent: 'center', marginRight: 8 } },
              h(Text, { style: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: COLORS.white } }, String(i + 1))
            ),
            h(View, { style: { flex: 1 } },
              h(Text, { style: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: COLORS.slate[800] } }, truncate(opp.title, 35)),
              h(View, { style: { ...styles.badge, ...quadrantStyle, alignSelf: 'flex-start', marginTop: 2, paddingVertical: 2, paddingHorizontal: 6 } },
                h(Text, { style: { fontSize: 6 } }, (opp.quadrant || 'explore').toUpperCase())
              )
            )
          );
        })
      )
    ),

    // Footer
    h(View, { style: styles.footer },
      h(Text, null, client?.company_name || 'Strategic Synthesis'),
      h(Text, null, `Page ${pageNumber}`)
    )
  );
}

function createOpportunityCard(opportunity, index) {
  const quadrantStyle = QUADRANT_STYLES[opportunity.quadrant] || QUADRANT_STYLES.explore;

  // Score bar component
  function createScoreBar(score, label, color) {
    const normalizedScore = Math.min(10, Math.max(0, score || 5));
    const percentage = (normalizedScore / 10) * 100;
    return h(View, { style: { flex: 1 } },
      h(View, { style: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 } },
        h(Text, { style: styles.label }, label),
        h(Text, { style: { fontSize: 9, fontFamily: 'Helvetica-Bold', color } }, `${normalizedScore}/10`)
      ),
      h(View, { style: { height: 6, backgroundColor: COLORS.slate[200], borderRadius: 3 } },
        h(View, { style: { width: `${percentage}%`, height: 6, backgroundColor: color, borderRadius: 3 } })
      )
    );
  }

  return h(View, { key: `opp-${index}`, style: { ...styles.card, borderLeft: `3pt solid ${quadrantStyle.borderColor || COLORS.indigo[600]}` } },
    // Header with number badge and title
    h(View, { style: { ...styles.row, marginBottom: 12 } },
      h(View, { style: { width: 24, height: 24, borderRadius: 12, backgroundColor: quadrantStyle.borderColor || COLORS.indigo[600], alignItems: 'center', justifyContent: 'center', marginRight: 10 } },
        h(Text, { style: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: COLORS.white } }, String(index + 1))
      ),
      h(Text, { style: { ...styles.h3, flex: 1, marginBottom: 0 } }, truncate(opportunity.title, 45)),
      h(View, { style: { ...styles.badge, backgroundColor: quadrantStyle.backgroundColor, color: quadrantStyle.color } },
        h(Text, { style: { color: quadrantStyle.color } }, (opportunity.quadrant || 'explore').toUpperCase())
      )
    ),

    // Description
    h(Text, { style: { ...styles.body, marginBottom: 12 } }, truncate(opportunity.description, 180)),

    // Score bars
    opportunity.scoring && h(View, { style: { ...styles.row, gap: 16, marginBottom: 12, paddingTop: 12, borderTop: `1pt solid ${COLORS.slate[200]}` } },
      createScoreBar(opportunity.scoring.marketAttractiveness, 'MARKET', COLORS.cyan[600]),
      createScoreBar(opportunity.scoring.capabilityFit, 'CAPABILITY', COLORS.indigo[600]),
      createScoreBar(opportunity.scoring.competitiveAdvantage, 'COMPETITIVE', COLORS.emerald[600])
    ),

    // How to Win section
    opportunity.ptw?.howToWin && h(View, { style: { backgroundColor: COLORS.slate[50], padding: 10, borderRadius: 8, marginTop: 4 } },
      h(Text, { style: { ...styles.label, marginBottom: 4 } }, 'HOW TO WIN'),
      h(Text, { style: styles.bodySmall }, truncate(opportunity.ptw.howToWin, 140))
    )
  );
}

function createOpportunitiesPage(opportunities, client, pageNumber, startIndex) {
  const pageOpps = opportunities.slice(startIndex, startIndex + 2);
  const isFirstPage = startIndex === 0;

  return h(Page, { key: `opp-page-${pageNumber}`, size: 'A4', style: styles.page },
    // Section header (only on first opportunities page)
    isFirstPage && h(View, { style: { marginBottom: 20 } },
      h(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 } },
        h(View, { style: { width: 4, height: 24, backgroundColor: COLORS.indigo[600], borderRadius: 2, marginRight: 12 } }),
        h(Text, { style: { ...styles.h2, marginBottom: 0 } }, 'Strategic Opportunities')
      ),
      h(Text, { style: { ...styles.body, marginLeft: 16, color: COLORS.slate[500] } },
        `${opportunities.length} opportunities identified across ${['invest', 'explore', 'harvest', 'divest'].filter(q => opportunities.some(o => o.quadrant === q)).length} strategic quadrants`
      )
    ),

    // Opportunity cards
    ...pageOpps.map((opp, i) => createOpportunityCard(opp, startIndex + i)),

    // Footer
    h(View, { style: styles.footer },
      h(Text, null, client?.company_name || 'Strategic Synthesis'),
      h(Text, null, `Page ${pageNumber}`)
    )
  );
}

function createTensionsPage(tensions, client, pageNumber) {
  return h(Page, { size: 'A4', style: styles.page },
    // Section header
    h(View, { style: { marginBottom: 20 } },
      h(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 } },
        h(View, { style: { width: 4, height: 24, backgroundColor: COLORS.amber[600], borderRadius: 2, marginRight: 12 } }),
        h(Text, { style: { ...styles.h2, marginBottom: 0 } }, 'Strategic Tensions')
      ),
      h(Text, { style: { ...styles.body, marginLeft: 16, color: COLORS.slate[500] } },
        'Areas where evidence conflicts or trade-offs must be considered.'
      )
    ),

    // Tension cards
    ...tensions.slice(0, 3).map((tension, i) =>
      h(View, { key: `tension-${i}`, style: { ...styles.card, borderLeft: `3pt solid ${COLORS.amber[600]}` } },
        // Header with number
        h(View, { style: { ...styles.row, marginBottom: 10 } },
          h(View, { style: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.amber[600], alignItems: 'center', justifyContent: 'center', marginRight: 10 } },
            h(Text, { style: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: COLORS.white } }, String(i + 1))
          ),
          h(Text, { style: { ...styles.h3, flex: 1, marginBottom: 0 } }, truncate(tension.description, 70))
        ),

        // Impact badge
        tension.impact && h(View, { style: { marginBottom: 10 } },
          h(View, { style: {
            ...styles.badge,
            alignSelf: 'flex-start',
            backgroundColor: tension.impact === 'blocking' ? COLORS.amber[100] : COLORS.slate[100],
            color: tension.impact === 'blocking' ? COLORS.amber[600] : COLORS.slate[600]
          } },
            h(Text, { style: { color: tension.impact === 'blocking' ? COLORS.amber[600] : COLORS.slate[600] } },
              `${tension.impact.toUpperCase()} IMPACT`
            )
          )
        ),

        // Resolution options
        tension.resolutionOptions?.length > 0 && h(View, { style: { backgroundColor: COLORS.slate[50], padding: 10, borderRadius: 8 } },
          h(Text, { style: { ...styles.label, marginBottom: 8 } }, 'RESOLUTION OPTIONS'),
          ...tension.resolutionOptions.slice(0, 2).map((opt, j) =>
            h(View, { key: `opt-${j}`, style: { ...styles.row, marginBottom: 6 } },
              h(View, { style: {
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: opt.recommended ? COLORS.emerald[600] : COLORS.slate[400],
                marginRight: 8,
                marginTop: 4
              } }),
              h(View, { style: { flex: 1 } },
                h(Text, { style: { ...styles.bodySmall, fontFamily: opt.recommended ? 'Helvetica-Bold' : 'Helvetica' } },
                  truncate(opt.option, 90)
                ),
                opt.recommended && h(Text, { style: { fontSize: 7, color: COLORS.emerald[600], marginTop: 2 } }, 'RECOMMENDED')
              )
            )
          )
        )
      )
    ),

    // Footer
    h(View, { style: styles.footer },
      h(Text, null, client?.company_name || 'Strategic Synthesis'),
      h(Text, null, `Page ${pageNumber}`)
    )
  );
}

function createAppendixPage(synthesis, client, pageNumber) {
  return h(Page, { size: 'A4', style: styles.page },
    // Section header
    h(View, { style: { marginBottom: 24 } },
      h(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 } },
        h(View, { style: { width: 4, height: 24, backgroundColor: COLORS.slate[500], borderRadius: 2, marginRight: 12 } }),
        h(Text, { style: { ...styles.h2, marginBottom: 0 } }, 'Appendix: Methodology')
      )
    ),

    // Playing to Win Framework
    h(View, { style: { ...styles.card, marginBottom: 20 } },
      h(View, { style: { ...styles.row, marginBottom: 12 } },
        h(View, { style: { width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.indigo[50], alignItems: 'center', justifyContent: 'center', marginRight: 12 } },
          h(Text, { style: { fontSize: 16, color: COLORS.indigo[600] } }, '📊')
        ),
        h(Text, { style: { ...styles.h3, marginBottom: 0, flex: 1 } }, 'Playing to Win Framework')
      ),
      h(Text, { style: { ...styles.body, marginBottom: 12 } },
        'This strategic synthesis uses the Playing to Win framework developed by A.G. Lafley and Roger Martin.'
      ),
      h(View, { style: { backgroundColor: COLORS.slate[50], padding: 12, borderRadius: 8 } },
        h(Text, { style: { ...styles.label, marginBottom: 8 } }, 'FIVE KEY QUESTIONS'),
        ...[
          'Winning Aspiration - What is our purpose?',
          'Where to Play - Where will we compete?',
          'How to Win - How will we succeed?',
          'Core Capabilities - What abilities do we need?',
          'Management Systems - How do we enable success?'
        ].map((q, i) =>
          h(View, { key: `q-${i}`, style: { ...styles.row, marginBottom: 4 } },
            h(View, { style: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.indigo[600], marginRight: 8, marginTop: 4 } }),
            h(Text, { style: styles.bodySmall }, q)
          )
        )
      )
    ),

    // Report Generation Details
    h(View, { style: { ...styles.card, marginBottom: 20 } },
      h(View, { style: { ...styles.row, marginBottom: 12 } },
        h(View, { style: { width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.cyan[50], alignItems: 'center', justifyContent: 'center', marginRight: 12 } },
          h(Text, { style: { fontSize: 16, color: COLORS.cyan[600] } }, '🤖')
        ),
        h(Text, { style: { ...styles.h3, marginBottom: 0, flex: 1 } }, 'Report Generation')
      ),
      h(View, { style: { flexDirection: 'row', gap: 16 } },
        h(View, { style: { flex: 1 } },
          h(Text, { style: styles.label }, 'AI MODEL'),
          h(Text, { style: { ...styles.bodySmall, marginTop: 4 } }, synthesis.metadata?.modelUsed || 'Claude Sonnet 4')
        ),
        h(View, { style: { flex: 1 } },
          h(Text, { style: styles.label }, 'GENERATED'),
          h(Text, { style: { ...styles.bodySmall, marginTop: 4 } }, formatDate(synthesis.metadata?.generatedAt || new Date().toISOString()))
        ),
        h(View, { style: { flex: 1 } },
          h(Text, { style: styles.label }, 'TERRITORIES'),
          h(Text, { style: { ...styles.bodySmall, marginTop: 4 } }, `${synthesis.metadata?.territoriesIncluded?.length || 3} analyzed`)
        )
      )
    ),

    // Disclaimer
    h(View, { style: { backgroundColor: COLORS.amber[50], border: `1pt solid ${COLORS.amber[100]}`, borderRadius: 12, padding: 16 } },
      h(View, { style: { ...styles.row, marginBottom: 8 } },
        h(Text, { style: { fontSize: 12, marginRight: 8 } }, '⚠️'),
        h(Text, { style: { ...styles.label, color: COLORS.amber[600] } }, 'IMPORTANT DISCLAIMER')
      ),
      h(Text, { style: { ...styles.bodySmall, color: COLORS.slate[700], lineHeight: 1.6 } },
        'This report is generated by AI based on information provided during the strategy coaching session. ' +
        'It should be used as a starting point for strategic discussions and validated with additional research ' +
        'and stakeholder input before making business decisions. The AI-generated opportunities and recommendations ' +
        'represent potential strategic directions, not guaranteed outcomes.'
      )
    ),

    // Footer
    h(View, { style: styles.footer },
      h(Text, null, client?.company_name || 'Strategic Synthesis'),
      h(Text, null, `Page ${pageNumber}`)
    )
  );
}

async function generatePdf(synthesis, client, generatedAt) {
  const pages = [];
  let pageNumber = 1;

  // Page 1: Cover Page
  pages.push(createCoverPage(client, generatedAt));
  pageNumber++;

  // Page 2: Executive Summary
  pages.push(createExecutiveSummaryPage(synthesis, client, pageNumber));
  pageNumber++;

  // Page 3: Strategic Opportunity Map (2x2 Grid)
  const opportunities = synthesis.opportunities || [];
  if (opportunities.length > 0) {
    pages.push(createStrategicMapPage(opportunities, client, pageNumber));
    pageNumber++;
  }

  // Pages 4+: Detailed Opportunity Cards (2 per page)
  for (let i = 0; i < opportunities.length; i += 2) {
    pages.push(createOpportunitiesPage(opportunities, client, pageNumber, i));
    pageNumber++;
  }

  // Tensions Page
  const tensions = synthesis.tensions || [];
  if (tensions.length > 0) {
    pages.push(createTensionsPage(tensions, client, pageNumber));
    pageNumber++;
  }

  // Appendix: Methodology
  pages.push(createAppendixPage(synthesis, client, pageNumber));

  const doc = h(Document, {
    title: `Strategic Synthesis - ${client?.company_name || 'Report'}`,
    author: 'Frontera AI Strategy Coach',
    subject: 'Playing to Win Strategic Analysis',
    creator: 'Frontera Platform',
    keywords: 'strategy, playing to win, synthesis, opportunities',
  }, ...pages);

  return renderToBuffer(doc);
}

// Main: Read JSON from stdin, output PDF to stdout
async function main() {
  try {
    const chunks = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    const inputJson = Buffer.concat(chunks).toString('utf8');
    const input = JSON.parse(inputJson);

    const pdfBuffer = await generatePdf(
      input.synthesis,
      input.client,
      input.generatedAt || new Date().toISOString()
    );

    process.stdout.write(pdfBuffer);
    process.exit(0);
  } catch (error) {
    console.error('PDF generation error:', error.message);
    process.exit(1);
  }
}

main();
