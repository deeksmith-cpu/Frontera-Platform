// Note: We use plain style objects instead of StyleSheet.create() to avoid
// dual React instance issues when this module is imported dynamically.
// StyleSheet.create() is optional in react-pdf - plain objects work fine.

// Frontera brand colors
export const COLORS = {
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    900: '#312e81',
  },
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    500: '#06b6d4',
    600: '#0891b2',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    900: '#0f172a',
  },
  emerald: {
    50: '#ecfdf5',
    500: '#10b981',
    600: '#059669',
  },
  amber: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  purple: {
    50: '#faf5ff',
    600: '#9333ea',
  },
  red: {
    50: '#fef2f2',
    500: '#ef4444',
  },
  white: '#ffffff',
};

// Quadrant colors for the strategic map
export const QUADRANT_COLORS = {
  invest: { bg: COLORS.emerald[50], text: COLORS.emerald[600], border: COLORS.emerald[500] },
  explore: { bg: COLORS.indigo[50], text: COLORS.indigo[600], border: COLORS.indigo[500] },
  harvest: { bg: COLORS.amber[50], text: COLORS.amber[600], border: COLORS.amber[500] },
  divest: { bg: COLORS.slate[100], text: COLORS.slate[600], border: COLORS.slate[400] },
};

// Opportunity type colors
export const OPPORTUNITY_TYPE_COLORS = {
  where_to_play: COLORS.indigo[600],
  how_to_win: COLORS.cyan[600],
  capability_gap: COLORS.amber[600],
};

// Territory colors
export const TERRITORY_COLORS = {
  company: COLORS.indigo[600],
  customer: COLORS.cyan[600],
  competitor: COLORS.purple[600],
};

// Impact level colors
export const IMPACT_COLORS = {
  blocking: COLORS.red[500],
  significant: COLORS.amber[600],
  minor: COLORS.slate[500],
};

// Shared PDF styles (plain objects - react-pdf accepts these directly)
export const styles = {
  // Page layouts
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: COLORS.slate[900],
    backgroundColor: COLORS.white,
  },
  coverPage: {
    padding: 60,
    backgroundColor: COLORS.slate[50],
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },

  // Typography
  h1: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.slate[900],
    marginBottom: 16,
  },
  h2: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.slate[900],
    marginBottom: 12,
  },
  h3: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.slate[900],
    marginBottom: 8,
  },
  body: {
    fontSize: 10,
    lineHeight: 1.5,
    color: COLORS.slate[700],
  },
  bodySmall: {
    fontSize: 9,
    lineHeight: 1.4,
    color: COLORS.slate[600],
  },
  label: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: COLORS.slate[500],
  },
  caption: {
    fontSize: 8,
    color: COLORS.slate[400],
  },

  // Components
  card: {
    backgroundColor: COLORS.white,
    border: `1pt solid ${COLORS.slate[200]}`,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  cardCompact: {
    backgroundColor: COLORS.white,
    border: `1pt solid ${COLORS.slate[200]}`,
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
  },
  badgeInvest: {
    backgroundColor: COLORS.emerald[50],
    color: COLORS.emerald[600],
  },
  badgeExplore: {
    backgroundColor: COLORS.indigo[50],
    color: COLORS.indigo[600],
  },
  badgeHarvest: {
    backgroundColor: COLORS.amber[50],
    color: COLORS.amber[600],
  },
  badgeDivest: {
    backgroundColor: COLORS.slate[100],
    color: COLORS.slate[600],
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: COLORS.slate[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },

  // Layout helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  col: {
    flexDirection: 'column',
  },
  flex1: {
    flex: 1,
  },
  flexWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gap4: { gap: 4 },
  gap8: { gap: 8 },
  gap12: { gap: 12 },

  // Spacing
  mb4: { marginBottom: 4 },
  mb6: { marginBottom: 6 },
  mb8: { marginBottom: 8 },
  mb12: { marginBottom: 12 },
  mb16: { marginBottom: 16 },
  mb24: { marginBottom: 24 },
  mt4: { marginTop: 4 },
  mt8: { marginTop: 8 },
  mt12: { marginTop: 12 },
  mr4: { marginRight: 4 },
  mr8: { marginRight: 8 },
  ml4: { marginLeft: 4 },
  p8: { padding: 8 },
  p12: { padding: 12 },

  // Dividers
  divider: {
    borderBottom: `1pt solid ${COLORS.slate[200]}`,
    marginVertical: 12,
  },
  dividerLight: {
    borderBottom: `0.5pt solid ${COLORS.slate[100]}`,
    marginVertical: 8,
  },

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
  },
  pageNumber: {
    fontSize: 8,
    color: COLORS.slate[400],
  },

  // Table styles
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.slate[50],
    borderBottom: `1pt solid ${COLORS.slate[200]}`,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: `0.5pt solid ${COLORS.slate[100]}`,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableCell: {
    fontSize: 9,
    color: COLORS.slate[700],
  },
  tableCellHeader: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.slate[600],
    textTransform: 'uppercase',
  },

  // Bullet list
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.slate[400],
    marginRight: 8,
    marginTop: 4,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: COLORS.slate[700],
    lineHeight: 1.4,
  },
};

// Helper to get quadrant badge style
export function getQuadrantBadgeStyle(quadrant: string) {
  switch (quadrant) {
    case 'invest':
      return styles.badgeInvest;
    case 'explore':
      return styles.badgeExplore;
    case 'harvest':
      return styles.badgeHarvest;
    case 'divest':
      return styles.badgeDivest;
    default:
      return styles.badgeDivest;
  }
}

// Helper to format quadrant label
export function getQuadrantLabel(quadrant: string): string {
  return quadrant.charAt(0).toUpperCase() + quadrant.slice(1);
}

// Helper to get progress bar color
export function getScoreColor(score: number): string {
  if (score >= 8) return COLORS.emerald[500];
  if (score >= 6) return COLORS.cyan[500];
  if (score >= 4) return COLORS.amber[500];
  return COLORS.slate[400];
}
