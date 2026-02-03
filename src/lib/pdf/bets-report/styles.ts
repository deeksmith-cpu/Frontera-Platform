// Frontera brand colors for Strategic Bets PDF
export const COLORS = {
  navy: {
    DEFAULT: '#1a1f3a',
    light: '#2d3561',
  },
  gold: {
    DEFAULT: '#fbbf24',
    hover: '#f59e0b',
    50: '#fffbeb',
  },
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    400: '#22d3ee',
    500: '#0891b2',
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

// Thesis type colors
export const THESIS_TYPE_COLORS = {
  offensive: { bg: COLORS.amber[50], text: COLORS.amber[600], border: COLORS.amber[500] },
  defensive: { bg: COLORS.emerald[50], text: COLORS.emerald[600], border: COLORS.emerald[500] },
  capability: { bg: COLORS.purple[50], text: COLORS.purple[600], border: COLORS.purple[600] },
};

// Bet status colors
export const BET_STATUS_COLORS = {
  active: { bg: COLORS.cyan[50], text: COLORS.cyan[600] },
  killed: { bg: COLORS.red[50], text: COLORS.red[500] },
  graduated: { bg: COLORS.emerald[50], text: COLORS.emerald[600] },
};

// Shared PDF styles (plain objects - react-pdf accepts these directly)
// Using 'as const' to ensure TypeScript infers literal types for flexbox properties
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
} as const;

// Helper to get thesis type badge style
export function getThesisTypeBadgeStyle(thesisType: string) {
  switch (thesisType) {
    case 'offensive':
      return {
        backgroundColor: THESIS_TYPE_COLORS.offensive.bg,
        color: THESIS_TYPE_COLORS.offensive.text,
      };
    case 'defensive':
      return {
        backgroundColor: THESIS_TYPE_COLORS.defensive.bg,
        color: THESIS_TYPE_COLORS.defensive.text,
      };
    case 'capability':
      return {
        backgroundColor: THESIS_TYPE_COLORS.capability.bg,
        color: THESIS_TYPE_COLORS.capability.text,
      };
    default:
      return {
        backgroundColor: COLORS.slate[100],
        color: COLORS.slate[600],
      };
  }
}

// Helper to get bet status badge style
export function getBetStatusBadgeStyle(status: string) {
  switch (status) {
    case 'active':
      return {
        backgroundColor: BET_STATUS_COLORS.active.bg,
        color: BET_STATUS_COLORS.active.text,
      };
    case 'killed':
      return {
        backgroundColor: BET_STATUS_COLORS.killed.bg,
        color: BET_STATUS_COLORS.killed.text,
      };
    case 'graduated':
      return {
        backgroundColor: BET_STATUS_COLORS.graduated.bg,
        color: BET_STATUS_COLORS.graduated.text,
      };
    default:
      return {
        backgroundColor: COLORS.slate[100],
        color: COLORS.slate[600],
      };
  }
}

// Helper to format thesis type label
export function getThesisTypeLabel(thesisType: string): string {
  return thesisType.charAt(0).toUpperCase() + thesisType.slice(1);
}

// Helper to format bet status label
export function getBetStatusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
