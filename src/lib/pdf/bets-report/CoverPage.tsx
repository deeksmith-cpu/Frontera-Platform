import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { styles, COLORS } from './styles';

interface CoverPageProps {
  companyName?: string;
  totalBets: number;
  totalTheses: number;
  generatedDate: string;
}

export function CoverPage({
  companyName,
  totalBets,
  totalTheses,
  generatedDate,
}: CoverPageProps) {
  return (
    <Page size="A4" style={[styles.page, { backgroundColor: COLORS.navy.DEFAULT }]}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Main Title */}
        <Text
          style={{
            fontSize: 36,
            fontFamily: 'Helvetica-Bold',
            color: COLORS.gold.DEFAULT,
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          Strategic Bets Portfolio
        </Text>

        {/* Company Name */}
        {companyName && (
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Helvetica',
              color: COLORS.white,
              marginBottom: 40,
              textAlign: 'center',
            }}
          >
            {companyName}
          </Text>
        )}

        {/* Summary Stats */}
        <View
          style={{
            flexDirection: 'row',
            gap: 30,
            marginTop: 20,
            marginBottom: 60,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 48,
                fontFamily: 'Helvetica-Bold',
                color: COLORS.gold.DEFAULT,
              }}
            >
              {totalBets}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.slate[300],
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Strategic Bets
            </Text>
          </View>

          <View
            style={{
              width: 1,
              backgroundColor: COLORS.slate[600],
            }}
          />

          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 48,
                fontFamily: 'Helvetica-Bold',
                color: COLORS.gold.DEFAULT,
              }}
            >
              {totalTheses}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.slate[300],
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Strategic Theses
            </Text>
          </View>
        </View>

        {/* Generated Date */}
        <Text
          style={{
            fontSize: 10,
            color: COLORS.slate[400],
            position: 'absolute',
            bottom: 40,
          }}
        >
          Generated on {generatedDate}
        </Text>

        {/* Branding */}
        <Text
          style={{
            fontSize: 8,
            color: COLORS.slate[500],
            position: 'absolute',
            bottom: 20,
          }}
        >
          Powered by Frontera
        </Text>
      </View>
    </Page>
  );
}
