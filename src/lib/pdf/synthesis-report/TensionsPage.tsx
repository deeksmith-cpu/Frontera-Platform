import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { styles, COLORS, IMPACT_COLORS } from './styles';
import type { StrategicTension } from '@/types/synthesis';
import { PageFooter } from './PageFooter';

interface TensionsPageProps {
  tensions: StrategicTension[];
  companyName?: string;
  pageNumber?: number;
}

function TensionCard({ tension, index }: { tension: StrategicTension; index: number }) {
  const impactColor = IMPACT_COLORS[tension.impact as keyof typeof IMPACT_COLORS] || COLORS.slate[500];

  // Truncate helper
  const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };

  return (
    <View style={[styles.card, { marginBottom: 16 }]}>
      {/* Header */}
      <View style={[styles.rowSpaceBetween, styles.mb8]}>
        <Text style={[styles.h3, { marginBottom: 0, flex: 1 }]}>
          Tension #{index + 1}
        </Text>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: impactColor + '20',
            },
          ]}
        >
          <Text
            style={{
              fontSize: 7,
              fontFamily: 'Helvetica-Bold',
              color: impactColor,
              textTransform: 'uppercase',
            }}
          >
            {tension.impact} Impact
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text style={[styles.body, styles.mb12]}>{tension.description}</Text>

      {/* Evidence Columns */}
      <View style={[styles.row, { gap: 12, marginBottom: 12 }]}>
        {/* Aligned Evidence */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: COLORS.emerald[50],
              borderRadius: 4,
              padding: 8,
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                fontSize: 8,
                fontFamily: 'Helvetica-Bold',
                color: COLORS.emerald[600],
                textTransform: 'uppercase',
              }}
            >
              Aligned Evidence
            </Text>
          </View>
          {tension.alignedEvidence.slice(0, 2).map((ev, i) => (
            <View key={i} style={[styles.bulletItem]}>
              <View style={[styles.bullet, { backgroundColor: COLORS.emerald[500] }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.bulletText}>{truncate(ev.insight, 80)}</Text>
                <Text style={[styles.caption, { marginTop: 2 }]}>[{ev.source}]</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Conflicting Evidence */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: COLORS.red[50],
              borderRadius: 4,
              padding: 8,
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                fontSize: 8,
                fontFamily: 'Helvetica-Bold',
                color: COLORS.red[500],
                textTransform: 'uppercase',
              }}
            >
              Conflicting Evidence
            </Text>
          </View>
          {tension.conflictingEvidence.slice(0, 2).map((ev, i) => (
            <View key={i} style={[styles.bulletItem]}>
              <View style={[styles.bullet, { backgroundColor: COLORS.red[500] }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.bulletText}>{truncate(ev.insight, 80)}</Text>
                <Text style={[styles.caption, { marginTop: 2 }]}>[{ev.source}]</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Resolution Options */}
      <View style={styles.dividerLight} />
      <Text style={[styles.label, styles.mb6]}>Resolution Options</Text>
      {tension.resolutionOptions.map((option, i) => (
        <View
          key={i}
          style={[
            {
              backgroundColor: option.recommended ? COLORS.indigo[50] : COLORS.slate[50],
              borderRadius: 4,
              padding: 8,
              marginBottom: 6,
              borderWidth: option.recommended ? 1 : 0,
              borderColor: COLORS.indigo[500],
            },
          ]}
        >
          <View style={styles.row}>
            {option.recommended && (
              <Text
                style={{
                  fontSize: 10,
                  marginRight: 6,
                }}
              >
                *
              </Text>
            )}
            <View style={{ flex: 1 }}>
              <Text style={[styles.bodySmall, { fontFamily: option.recommended ? 'Helvetica-Bold' : 'Helvetica' }]}>
                {option.option}
              </Text>
              <Text style={[styles.caption, { marginTop: 2 }]}>
                Trade-off: {truncate(option.tradeOff, 60)}
              </Text>
            </View>
          </View>
        </View>
      ))}
      <Text style={[styles.caption, { fontStyle: 'italic' }]}>* Recommended option</Text>
    </View>
  );
}

export function TensionsPage({ tensions, companyName, pageNumber }: TensionsPageProps) {
  if (tensions.length === 0) return null;

  return (
    <Page size="A4" style={styles.page}>
      {/* Page Title */}
      <Text style={styles.h1}>Strategic Tensions</Text>
      <Text style={[styles.body, styles.mb16]}>
        Areas where research insights conflict, requiring strategic decisions and trade-offs.
      </Text>

      {tensions.map((tension, index) => (
        <TensionCard key={tension.id || index} tension={tension} index={index} />
      ))}

      <PageFooter companyName={companyName} pageNumber={pageNumber} />
    </Page>
  );
}
