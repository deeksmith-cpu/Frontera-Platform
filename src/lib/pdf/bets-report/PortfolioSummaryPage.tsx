import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { styles, COLORS, THESIS_TYPE_COLORS } from './styles';
import { PageFooter } from './PageFooter';
import type { BetsResponse } from '@/types/bets';

interface PortfolioSummaryPageProps {
  betsData: BetsResponse;
  companyName?: string;
}

export function PortfolioSummaryPage({ betsData, companyName }: PortfolioSummaryPageProps) {
  const { portfolioSummary } = betsData;

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.h1}>Portfolio Summary</Text>
      <Text style={[styles.body, styles.mb24]}>
        Overview of your strategic bets portfolio across theses and investment areas.
      </Text>

      {/* Portfolio Stats Grid */}
      <View style={[styles.row, { gap: 12, marginBottom: 24 }]}>
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.slate[50],
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontFamily: 'Helvetica-Bold',
              color: COLORS.navy.DEFAULT,
            }}
          >
            {portfolioSummary.totalBets}
          </Text>
          <Text style={[styles.label, { marginTop: 4 }]}>Total Bets</Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.slate[50],
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontFamily: 'Helvetica-Bold',
              color: COLORS.navy.DEFAULT,
            }}
          >
            {portfolioSummary.totalTheses}
          </Text>
          <Text style={[styles.label, { marginTop: 4 }]}>Theses</Text>
        </View>
      </View>

      {/* Thesis Type Breakdown */}
      <Text style={[styles.h2, { marginTop: 12 }]}>Breakdown by Thesis Type</Text>
      <View style={{ marginBottom: 24 }}>
        {/* Offensive */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
            padding: 12,
            backgroundColor: THESIS_TYPE_COLORS.offensive.bg,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: THESIS_TYPE_COLORS.offensive.border,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Helvetica-Bold',
                color: THESIS_TYPE_COLORS.offensive.text,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Offensive Bets
            </Text>
            <Text style={{ fontSize: 8, color: COLORS.slate[600], marginTop: 2 }}>
              Market expansion and new value creation
            </Text>
          </View>
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'Helvetica-Bold',
              color: THESIS_TYPE_COLORS.offensive.text,
            }}
          >
            {portfolioSummary.byThesisType.offensive}
          </Text>
        </View>

        {/* Defensive */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
            padding: 12,
            backgroundColor: THESIS_TYPE_COLORS.defensive.bg,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: THESIS_TYPE_COLORS.defensive.border,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Helvetica-Bold',
                color: THESIS_TYPE_COLORS.defensive.text,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Defensive Bets
            </Text>
            <Text style={{ fontSize: 8, color: COLORS.slate[600], marginTop: 2 }}>
              Protect existing market position
            </Text>
          </View>
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'Helvetica-Bold',
              color: THESIS_TYPE_COLORS.defensive.text,
            }}
          >
            {portfolioSummary.byThesisType.defensive}
          </Text>
        </View>

        {/* Capability */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            backgroundColor: THESIS_TYPE_COLORS.capability.bg,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: THESIS_TYPE_COLORS.capability.text,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'Helvetica-Bold',
                color: THESIS_TYPE_COLORS.capability.text,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Capability Bets
            </Text>
            <Text style={{ fontSize: 8, color: COLORS.slate[600], marginTop: 2 }}>
              Build foundational capabilities
            </Text>
          </View>
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'Helvetica-Bold',
              color: THESIS_TYPE_COLORS.capability.text,
            }}
          >
            {portfolioSummary.byThesisType.capability}
          </Text>
        </View>
      </View>

      {/* Kill Dates Warning */}
      {portfolioSummary.killDatesApproaching > 0 && (
        <View
          style={{
            backgroundColor: COLORS.amber[50],
            borderWidth: 1,
            borderColor: COLORS.amber[500],
            borderRadius: 8,
            padding: 12,
            marginTop: 12,
          }}
        >
          <View style={[styles.row, { gap: 8 }]}>
            <Text style={{ fontSize: 16, color: COLORS.amber[600] }}>⚠</Text>
            <Text
              style={{
                fontSize: 9,
                color: COLORS.amber[600],
                fontFamily: 'Helvetica-Bold',
              }}
            >
              {portfolioSummary.killDatesApproaching} bet
              {portfolioSummary.killDatesApproaching !== 1 ? 's have' : ' has'} kill dates
              approaching within 30 days
            </Text>
          </View>
        </View>
      )}

      <PageFooter companyName={companyName} pageNumber={2} />
    </Page>
  );
}
