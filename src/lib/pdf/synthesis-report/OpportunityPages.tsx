import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { styles, COLORS, getQuadrantBadgeStyle, getQuadrantLabel, getScoreColor, TERRITORY_COLORS } from './styles';
import type { StrategicOpportunity } from '@/types/synthesis';
import { PageFooter } from './PageFooter';

interface OpportunityPagesProps {
  opportunities: StrategicOpportunity[];
  companyName?: string;
  startPage?: number;
}

// Single opportunity card component (condensed)
function OpportunityCard({ opportunity, index }: { opportunity: StrategicOpportunity; index: number }) {
  const quadrantStyle = getQuadrantBadgeStyle(opportunity.quadrant);

  // Get territory color
  const getTerritoryColor = (territory: string) => {
    return TERRITORY_COLORS[territory as keyof typeof TERRITORY_COLORS] || COLORS.slate[500];
  };

  // Truncate text helper
  const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };

  return (
    <View style={[styles.card, { marginBottom: 12 }]}>
      {/* Header Row */}
      <View style={[styles.rowSpaceBetween, styles.mb8]}>
        <View style={styles.row}>
          <Text style={[styles.h3, { marginBottom: 0, marginRight: 8 }]}>
            {index + 1}. {truncate(opportunity.title, 40)}
          </Text>
        </View>
        <View style={styles.row}>
          <View style={[styles.badge, quadrantStyle, { marginRight: 6 }]}>
            <Text>{getQuadrantLabel(opportunity.quadrant)}</Text>
          </View>
          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  opportunity.confidence === 'high'
                    ? COLORS.emerald[50]
                    : opportunity.confidence === 'medium'
                    ? COLORS.amber[50]
                    : COLORS.slate[100],
              },
            ]}
          >
            <Text
              style={{
                fontSize: 7,
                fontFamily: 'Helvetica-Bold',
                color:
                  opportunity.confidence === 'high'
                    ? COLORS.emerald[600]
                    : opportunity.confidence === 'medium'
                    ? COLORS.amber[600]
                    : COLORS.slate[600],
                textTransform: 'uppercase',
              }}
            >
              {opportunity.confidence}
            </Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <Text style={[styles.bodySmall, styles.mb8]}>{opportunity.description}</Text>

      {/* Scoring Row */}
      <View style={[styles.row, styles.mb8, { gap: 12 }]}>
        {/* Market Attractiveness */}
        <View style={{ flex: 1 }}>
          <View style={styles.rowSpaceBetween}>
            <Text style={styles.caption}>Market</Text>
            <Text style={[styles.caption, { fontFamily: 'Helvetica-Bold' }]}>
              {opportunity.scoring.marketAttractiveness}/10
            </Text>
          </View>
          <View style={[styles.progressBarContainer, styles.mt4]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${opportunity.scoring.marketAttractiveness * 10}%`,
                  backgroundColor: getScoreColor(opportunity.scoring.marketAttractiveness),
                },
              ]}
            />
          </View>
        </View>
        {/* Capability Fit */}
        <View style={{ flex: 1 }}>
          <View style={styles.rowSpaceBetween}>
            <Text style={styles.caption}>Capability</Text>
            <Text style={[styles.caption, { fontFamily: 'Helvetica-Bold' }]}>
              {opportunity.scoring.capabilityFit}/10
            </Text>
          </View>
          <View style={[styles.progressBarContainer, styles.mt4]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${opportunity.scoring.capabilityFit * 10}%`,
                  backgroundColor: getScoreColor(opportunity.scoring.capabilityFit),
                },
              ]}
            />
          </View>
        </View>
        {/* Competitive Advantage */}
        <View style={{ flex: 1 }}>
          <View style={styles.rowSpaceBetween}>
            <Text style={styles.caption}>Advantage</Text>
            <Text style={[styles.caption, { fontFamily: 'Helvetica-Bold' }]}>
              {opportunity.scoring.competitiveAdvantage}/10
            </Text>
          </View>
          <View style={[styles.progressBarContainer, styles.mt4]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${opportunity.scoring.competitiveAdvantage * 10}%`,
                  backgroundColor: getScoreColor(opportunity.scoring.competitiveAdvantage),
                },
              ]}
            />
          </View>
        </View>
        {/* Overall Score */}
        <View style={{ width: 60, alignItems: 'center' }}>
          <Text style={[styles.caption, { marginBottom: 2 }]}>Overall</Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Helvetica-Bold',
              color: COLORS.navy.DEFAULT,
            }}
          >
            {opportunity.scoring.overallScore}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.dividerLight} />

      {/* PTW Summary (condensed) */}
      <View style={styles.mb8}>
        <Text style={[styles.label, styles.mb4]}>Playing to Win</Text>
        <Text style={[styles.bodySmall, { marginBottom: 2 }]}>
          {`Aspiration: ${truncate(opportunity.ptw.winningAspiration, 60)}`}
        </Text>
        <Text style={[styles.bodySmall, { marginBottom: 2 }]}>
          {`Where: ${truncate(opportunity.ptw.whereToPlay, 60)}`}
        </Text>
        <Text style={[styles.bodySmall, { marginBottom: 2 }]}>
          {`How: ${truncate(opportunity.ptw.howToWin, 60)}`}
        </Text>
        {opportunity.ptw.capabilitiesRequired && opportunity.ptw.capabilitiesRequired.length > 0 && (
          <Text style={styles.bodySmall}>
            {`Capabilities: ${opportunity.ptw.capabilitiesRequired.slice(0, 3).join(', ')}${opportunity.ptw.capabilitiesRequired.length > 3 ? '...' : ''}`}
          </Text>
        )}
      </View>

      {/* Evidence (summarized - max 2) */}
      {opportunity.evidence && opportunity.evidence.length > 0 && (
        <View style={styles.mb8}>
          <Text style={[styles.label, styles.mb4]}>Key Evidence</Text>
          {opportunity.evidence.slice(0, 2).map((ev, i) => (
            <View key={i} style={[styles.row, { marginBottom: 4, alignItems: 'flex-start' }]}>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: getTerritoryColor(ev.territory) + '20',
                    marginRight: 6,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 6,
                    fontFamily: 'Helvetica-Bold',
                    color: getTerritoryColor(ev.territory),
                    textTransform: 'uppercase',
                  }}
                >
                  {ev.territory}
                </Text>
              </View>
              <Text style={[styles.caption, { flex: 1, fontStyle: 'italic' }]}>
                {`"${truncate(ev.quote, 80)}"`}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Assumptions (abbreviated - max 2) */}
      {opportunity.assumptions && opportunity.assumptions.length > 0 && (
        <View>
          <Text style={[styles.label, styles.mb4]}>Key Assumptions</Text>
          {opportunity.assumptions.slice(0, 2).map((assumption, i) => (
            <View key={i} style={[styles.bulletItem]}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                {`[${assumption.category.toUpperCase()}] ${truncate(assumption.assumption, 70)}`}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export function OpportunityPages({ opportunities, companyName, startPage = 4 }: OpportunityPagesProps) {
  // Split opportunities into pages (2 per page)
  const pages: StrategicOpportunity[][] = [];
  for (let i = 0; i < opportunities.length; i += 2) {
    pages.push(opportunities.slice(i, i + 2));
  }

  // Return array of Page components directly (react-pdf handles arrays)
  return pages.map((pageOpportunities, pageIndex) => (
    <Page key={pageIndex} size="A4" style={styles.page}>
      {pageIndex === 0 && (
        <View>
          <Text style={styles.h1}>Strategic Opportunities</Text>
          <Text style={[styles.body, styles.mb16]}>
            {`Detailed analysis of ${opportunities.length} identified opportunities with scoring, Playing to Win mapping, and key assumptions.`}
          </Text>
        </View>
      )}

      {pageOpportunities.map((opp, oppIndex) => (
        <OpportunityCard
          key={opp.id || oppIndex}
          opportunity={opp}
          index={pageIndex * 2 + oppIndex}
        />
      ))}

      <PageFooter companyName={companyName} pageNumber={startPage + pageIndex} />
    </Page>
  ));
}
