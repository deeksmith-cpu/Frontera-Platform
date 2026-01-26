import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { styles, COLORS } from './styles';
import type { SynthesisResult } from '@/types/synthesis';
import type { Client } from '@/types/database';
import { PageFooter } from './PageFooter';

interface ExecutiveSummaryPageProps {
  synthesis: SynthesisResult;
  client: Client | null;
}

export function ExecutiveSummaryPage({ synthesis, client }: ExecutiveSummaryPageProps) {
  const opportunitiesCount = synthesis.opportunities.length;
  const tensionsCount = synthesis.tensions.length;
  const territoriesCount = synthesis.metadata.territoriesIncluded.length;

  // Count opportunities by quadrant
  const investCount = synthesis.opportunities.filter(o => o.quadrant === 'invest').length;
  const exploreCount = synthesis.opportunities.filter(o => o.quadrant === 'explore').length;

  return (
    <Page size="A4" style={styles.page}>
      {/* Page Title */}
      <Text style={styles.h1}>Executive Summary</Text>

      {/* Summary Text */}
      <View style={[styles.card, styles.mb16]}>
        <Text style={[styles.body, { lineHeight: 1.6 }]}>
          {synthesis.executiveSummary}
        </Text>
      </View>

      {/* Key Metrics Row */}
      <Text style={[styles.label, styles.mb8]}>Key Metrics</Text>
      <View style={[styles.row, styles.mb24, { gap: 12 }]}>
        {/* Opportunities */}
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.indigo[50],
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontFamily: 'Helvetica-Bold',
              color: COLORS.indigo[600],
            }}
          >
            {opportunitiesCount}
          </Text>
          <Text style={{ fontSize: 9, color: COLORS.slate[600], marginTop: 4 }}>
            Opportunities
          </Text>
          <Text style={{ fontSize: 8, color: COLORS.slate[500], marginTop: 2 }}>
            {investCount} Invest, {exploreCount} Explore
          </Text>
        </View>

        {/* Tensions */}
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.amber[50],
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontFamily: 'Helvetica-Bold',
              color: COLORS.amber[600],
            }}
          >
            {tensionsCount}
          </Text>
          <Text style={{ fontSize: 9, color: COLORS.slate[600], marginTop: 4 }}>
            Tensions
          </Text>
          <Text style={{ fontSize: 8, color: COLORS.slate[500], marginTop: 2 }}>
            Requiring Resolution
          </Text>
        </View>

        {/* Territories */}
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.cyan[50],
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontFamily: 'Helvetica-Bold',
              color: COLORS.cyan[600],
            }}
          >
            {territoriesCount}
          </Text>
          <Text style={{ fontSize: 9, color: COLORS.slate[600], marginTop: 4 }}>
            Territories
          </Text>
          <Text style={{ fontSize: 8, color: COLORS.slate[500], marginTop: 2 }}>
            {synthesis.metadata.researchAreasCount} Areas Analyzed
          </Text>
        </View>
      </View>

      {/* Priority Recommendations */}
      <Text style={[styles.label, styles.mb8]}>Priority Recommendations</Text>
      <View style={styles.card}>
        {synthesis.recommendations.map((recommendation, index) => (
          <View
            key={index}
            style={[
              styles.row,
              {
                paddingVertical: 10,
                borderBottomWidth: index < synthesis.recommendations.length - 1 ? 0.5 : 0,
                borderBottomColor: COLORS.slate[100],
              },
            ]}
          >
            {/* Number Badge */}
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: COLORS.indigo[600],
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: 'Helvetica-Bold',
                  color: COLORS.white,
                }}
              >
                {index + 1}
              </Text>
            </View>
            {/* Recommendation Text */}
            <Text style={[styles.body, { flex: 1 }]}>{recommendation}</Text>
          </View>
        ))}
      </View>

      {/* Confidence Level */}
      <View style={[styles.row, styles.mt12, { justifyContent: 'flex-end' }]}>
        <Text style={[styles.caption, styles.mr4]}>Analysis Confidence:</Text>
        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                synthesis.metadata.confidenceLevel === 'high'
                  ? COLORS.emerald[50]
                  : synthesis.metadata.confidenceLevel === 'medium'
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
                synthesis.metadata.confidenceLevel === 'high'
                  ? COLORS.emerald[600]
                  : synthesis.metadata.confidenceLevel === 'medium'
                  ? COLORS.amber[600]
                  : COLORS.slate[600],
              textTransform: 'uppercase',
            }}
          >
            {synthesis.metadata.confidenceLevel}
          </Text>
        </View>
      </View>

      <PageFooter companyName={client?.company_name} pageNumber={2} />
    </Page>
  );
}
