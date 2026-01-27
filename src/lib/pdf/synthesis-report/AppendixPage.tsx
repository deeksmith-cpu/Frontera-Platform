import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { styles, COLORS } from './styles';
import type { SynthesisResult } from '@/types/synthesis';
import { PageFooter } from './PageFooter';

interface AppendixPageProps {
  synthesis: SynthesisResult;
  companyName?: string;
  pageNumber?: number;
}

export function AppendixPage({ synthesis, companyName, pageNumber }: AppendixPageProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Page size="A4" style={styles.page}>
      {/* Page Title */}
      <Text style={styles.h1}>Appendix: Methodology</Text>

      {/* Research Coverage */}
      <View style={[styles.card, styles.mb16]}>
        <Text style={[styles.h3, styles.mb8]}>Research Coverage</Text>
        <View style={[styles.row, { gap: 16 }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, styles.mb4]}>Territories Analyzed</Text>
            <View style={[styles.row, { flexWrap: 'wrap', gap: 4 }]}>
              {synthesis.metadata.territoriesIncluded.map((territory, i) => (
                <View
                  key={i}
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        territory === 'company'
                          ? COLORS.indigo[50]
                          : territory === 'customer'
                          ? COLORS.cyan[50]
                          : COLORS.purple[50],
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 7,
                      fontFamily: 'Helvetica-Bold',
                      color:
                        territory === 'company'
                          ? COLORS.indigo[600]
                          : territory === 'customer'
                          ? COLORS.cyan[600]
                          : COLORS.purple[600],
                      textTransform: 'uppercase',
                    }}
                  >
                    {territory}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, styles.mb4]}>Research Areas Completed</Text>
            <Text style={styles.body}>{synthesis.metadata.researchAreasCount} areas</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, styles.mb4]}>Overall Confidence</Text>
            <Text
              style={[
                styles.body,
                {
                  fontFamily: 'Helvetica-Bold',
                  color:
                    synthesis.metadata.confidenceLevel === 'high'
                      ? COLORS.emerald[600]
                      : synthesis.metadata.confidenceLevel === 'medium'
                      ? COLORS.amber[600]
                      : COLORS.slate[600],
                },
              ]}
            >
              {synthesis.metadata.confidenceLevel.charAt(0).toUpperCase() +
                synthesis.metadata.confidenceLevel.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      {/* Playing to Win Framework */}
      <View style={[styles.card, styles.mb16]}>
        <Text style={[styles.h3, styles.mb8]}>Playing to Win Framework</Text>
        <Text style={[styles.body, styles.mb8]}>
          This synthesis uses the Playing to Win strategic framework developed by Roger Martin
          and A.G. Lafley. The framework provides a structured approach to strategy through five
          interconnected choices.
        </Text>
        <Text style={[styles.body, styles.mb8]}>
          The 2x2 Strategic Opportunity Map plots opportunities by Market Attractiveness (vertical)
          and Capability Fit (horizontal) to identify priority actions:
        </Text>
        <View style={{ paddingLeft: 16 }}>
          <View style={styles.bulletItem}>
            <View style={[styles.bullet, { backgroundColor: COLORS.emerald[500] }]} />
            <Text style={styles.bulletText}>
              {`INVEST: High market + High capability - prioritize resources`}
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <View style={[styles.bullet, { backgroundColor: COLORS.indigo[500] }]} />
            <Text style={styles.bulletText}>
              {`EXPLORE: High market + Low capability - build or partner`}
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <View style={[styles.bullet, { backgroundColor: COLORS.amber[500] }]} />
            <Text style={styles.bulletText}>
              {`HARVEST: Low market + High capability - optimize efficiency`}
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <View style={[styles.bullet, { backgroundColor: COLORS.slate[400] }]} />
            <Text style={styles.bulletText}>
              {`DIVEST: Low market + Low capability - deprioritize`}
            </Text>
          </View>
        </View>
      </View>

      {/* Scoring Methodology */}
      <View style={[styles.card, styles.mb16]}>
        <Text style={[styles.h3, styles.mb8]}>Scoring Methodology</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, { flex: 2 }]}>Metric</Text>
            <Text style={[styles.tableCellHeader, { flex: 3 }]}>Description</Text>
            <Text style={[styles.tableCellHeader, { flex: 1, textAlign: 'center' }]}>Weight</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2, fontFamily: 'Helvetica-Bold' }]}>Market Attractiveness</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>Market size, growth rate, unmet customer needs</Text>
            <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>40%</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2, fontFamily: 'Helvetica-Bold' }]}>Capability Fit</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>{"Company's ability to execute and compete"}</Text>
            <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>35%</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2, fontFamily: 'Helvetica-Bold' }]}>Competitive Advantage</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>Differentiation potential and defensibility</Text>
            <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>25%</Text>
          </View>
        </View>
        <Text style={[styles.caption, styles.mt8]}>
          Overall Score = (Market x 0.4) + (Capability x 0.35) + (Advantage x 0.25), scaled to 0-100
        </Text>
      </View>

      {/* Disclaimer */}
      <View
        style={{
          backgroundColor: COLORS.slate[50],
          borderRadius: 6,
          padding: 12,
          marginBottom: 16,
        }}
      >
        <Text style={[styles.label, styles.mb4]}>Disclaimer</Text>
        <Text style={styles.bodySmall}>
          This report was generated using AI-assisted analysis. All strategic recommendations
          should be validated with additional research, stakeholder input, and market testing.
          The insights provided are based on the research data available at the time of analysis
          and may not reflect subsequent market changes.
        </Text>
      </View>

      {/* Report Metadata */}
      <View style={styles.divider} />
      <View style={[styles.rowSpaceBetween]}>
        <View>
          <Text style={styles.caption}>Generated: {formatDate(synthesis.metadata.generatedAt)}</Text>
          <Text style={[styles.caption, styles.mt4]}>Report ID: {synthesis.id}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.caption}>Model: {synthesis.metadata.modelUsed}</Text>
          <Text style={[styles.caption, styles.mt4]}>
            {synthesis.userEdited ? 'User edited' : 'AI generated'}
          </Text>
        </View>
      </View>

      <PageFooter companyName={companyName} pageNumber={pageNumber} />
    </Page>
  );
}
