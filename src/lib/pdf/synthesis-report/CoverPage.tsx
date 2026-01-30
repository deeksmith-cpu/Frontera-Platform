import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { styles, COLORS } from './styles';
import type { Client } from '@/types/database';

interface CoverPageProps {
  client: Client | null;
  generatedAt: Date;
}

export function CoverPage({ client, generatedAt }: CoverPageProps) {
  const formattedDate = generatedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Page size="A4" style={styles.coverPage}>
      {/* Top Section - Logo placeholder */}
      <View style={{ marginBottom: 60 }}>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 12,
            backgroundColor: COLORS.navy.DEFAULT,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontFamily: 'Helvetica-Bold',
              color: COLORS.white,
            }}
          >
            F
          </Text>
        </View>
      </View>

      {/* Decorative line */}
      <View
        style={{
          width: 80,
          height: 3,
          backgroundColor: COLORS.cyan[500],
          marginBottom: 40,
          borderRadius: 2,
        }}
      />

      {/* Title */}
      <Text
        style={{
          fontSize: 14,
          fontFamily: 'Helvetica-Bold',
          color: COLORS.slate[500],
          textTransform: 'uppercase',
          letterSpacing: 2,
          marginBottom: 12,
        }}
      >
        Strategic Synthesis Report
      </Text>

      {/* Company Name */}
      <Text
        style={{
          fontSize: 32,
          fontFamily: 'Helvetica-Bold',
          color: COLORS.slate[900],
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        {client?.company_name || 'Strategic Analysis'}
      </Text>

      {/* Decorative line */}
      <View
        style={{
          width: 80,
          height: 3,
          backgroundColor: COLORS.navy.DEFAULT,
          marginBottom: 40,
          borderRadius: 2,
        }}
      />

      {/* Metadata */}
      <View style={{ alignItems: 'center', marginBottom: 60 }}>
        {client?.industry && (
          <Text
            style={{
              fontSize: 12,
              color: COLORS.slate[600],
              marginBottom: 8,
            }}
          >
            Industry: {client.industry}
          </Text>
        )}
        <Text
          style={{
            fontSize: 12,
            color: COLORS.slate[600],
          }}
        >
          Generated: {formattedDate}
        </Text>
      </View>

      {/* Methodology Badge */}
      <View
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 8,
          padding: 16,
          borderWidth: 1,
          borderColor: COLORS.slate[200],
          alignItems: 'center',
          marginBottom: 60,
        }}
      >
        <Text
          style={{
            fontSize: 10,
            fontFamily: 'Helvetica-Bold',
            color: COLORS.slate[600],
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          Methodology
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Helvetica-Bold',
            color: COLORS.navy.DEFAULT,
          }}
        >
          Playing to Win Framework
        </Text>
        <Text
          style={{
            fontSize: 9,
            color: COLORS.slate[500],
            marginTop: 4,
          }}
        >
          by Roger Martin & A.G. Lafley
        </Text>
      </View>

      {/* Footer */}
      <View style={{ position: 'absolute', bottom: 40 }}>
        <Text
          style={{
            fontSize: 10,
            color: COLORS.slate[400],
            textAlign: 'center',
          }}
        >
          Powered by Frontera AI Strategy Coach
        </Text>
        <Text
          style={{
            fontSize: 8,
            color: COLORS.slate[300],
            textAlign: 'center',
            marginTop: 4,
          }}
        >
          www.frontera.ai
        </Text>
      </View>
    </Page>
  );
}
