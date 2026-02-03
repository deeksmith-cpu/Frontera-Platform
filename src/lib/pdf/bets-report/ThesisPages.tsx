import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { styles, COLORS, getThesisTypeBadgeStyle, getBetStatusBadgeStyle } from './styles';
import { PageFooter } from './PageFooter';
import type { StrategicThesis, StrategicBet } from '@/types/bets';

type ThesisWithBets = StrategicThesis & { bets: StrategicBet[] };

interface ThesisPagesProps {
  theses: ThesisWithBets[];
  companyName?: string;
  startPage?: number;
}

// Helper to truncate text
function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength - 3) + '...';
}

// Helper to format date
function formatDate(dateString: string | null): string {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ThesisPages({ theses, companyName, startPage = 3 }: ThesisPagesProps) {
  const pages: JSX.Element[] = [];
  let currentPageNumber = startPage;

  theses.forEach((thesis, thesisIndex) => {
    const thesisTypeBadgeStyle = getThesisTypeBadgeStyle(thesis.thesisType);
    const bets = thesis.bets || [];

    // Create a page for each thesis with its bets (max 2 bets per page)
    const betPages: typeof bets[] = [];
    for (let i = 0; i < bets.length; i += 2) {
      betPages.push(bets.slice(i, i + 2));
    }

    // If no bets, still create one page for the thesis
    if (betPages.length === 0) {
      betPages.push([]);
    }

    betPages.forEach((pageBets, betPageIndex) => {
      pages.push(
        <Page key={`${thesis.id}-${betPageIndex}`} size="A4" style={styles.page}>
          {/* Thesis Header (only on first page of thesis) */}
          {betPageIndex === 0 && (
            <View style={{ marginBottom: 16 }}>
              <View style={[styles.rowSpaceBetween, styles.mb8]}>
                <Text style={[styles.h2, { marginBottom: 0 }]}>
                  Thesis {thesisIndex + 1}: {truncate(thesis.title, 60)}
                </Text>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: thesisTypeBadgeStyle.backgroundColor,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 8,
                      fontFamily: 'Helvetica-Bold',
                      color: thesisTypeBadgeStyle.color,
                      textTransform: 'uppercase',
                    }}
                  >
                    {thesis.thesisType}
                  </Text>
                </View>
              </View>

              {thesis.description && (
                <Text style={[styles.body, styles.mb12]}>{thesis.description}</Text>
              )}

              <View style={styles.divider} />
            </View>
          )}

          {/* Bets for this page */}
          {pageBets.length > 0 ? (
            pageBets.map((bet) => {
              const statusBadgeStyle = getBetStatusBadgeStyle(bet.status);
              const killDateApproaching =
                bet.killDate &&
                new Date(bet.killDate).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000;

              return (
                <View key={bet.id} style={[styles.card, { marginBottom: 12 }]}>
                  {/* Bet Header */}
                  <View style={[styles.rowSpaceBetween, styles.mb8]}>
                    <Text style={[styles.h3, { marginBottom: 0, flex: 1 }]}>
                      {truncate(bet.bet, 50)}
                    </Text>
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: statusBadgeStyle.backgroundColor,
                          paddingHorizontal: 6,
                          paddingVertical: 3,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 7,
                          fontFamily: 'Helvetica-Bold',
                          color: statusBadgeStyle.color,
                          textTransform: 'uppercase',
                        }}
                      >
                        {bet.status}
                      </Text>
                    </View>
                  </View>

                  {/* Kill Criteria */}
                  {bet.killCriteria && (
                    <View style={styles.mb8}>
                      <Text style={[styles.label, styles.mb4]}>Kill Criteria</Text>
                      <Text style={styles.bodySmall}>{truncate(bet.killCriteria, 120)}</Text>
                    </View>
                  )}

                  {/* Kill Date */}
                  {bet.killDate && (
                    <View style={[styles.row, styles.mb8, { gap: 8 }]}>
                      <Text style={styles.label}>Kill Date:</Text>
                      <Text
                        style={[
                          styles.bodySmall,
                          {
                            color: killDateApproaching ? COLORS.amber[600] : COLORS.slate[600],
                            fontFamily: killDateApproaching ? 'Helvetica-Bold' : 'Helvetica',
                          },
                        ]}
                      >
                        {formatDate(bet.killDate)}
                        {killDateApproaching && ' (Approaching)'}
                      </Text>
                    </View>
                  )}

                  {/* Evidence Links */}
                  {bet.evidenceLinks && bet.evidenceLinks.length > 0 && (
                    <View style={styles.mb8}>
                      <Text style={[styles.label, styles.mb4]}>
                        Evidence ({bet.evidenceLinks.length})
                      </Text>
                      {bet.evidenceLinks.slice(0, 2).map((evidenceId, idx) => (
                        <View key={idx} style={[styles.row, { marginBottom: 2 }]}>
                          <View style={[styles.bullet, { marginRight: 6, marginTop: 2 }]} />
                          <Text style={styles.caption}>Linked to opportunity evidence</Text>
                        </View>
                      ))}
                      {bet.evidenceLinks.length > 2 && (
                        <Text style={[styles.caption, { marginLeft: 10 }]}>
                          +{bet.evidenceLinks.length - 2} more
                        </Text>
                      )}
                    </View>
                  )}

                  {/* Assumption Being Tested */}
                  {bet.assumptionBeingTested && (
                    <View>
                      <Text style={[styles.label, styles.mb4]}>Assumption Being Tested</Text>
                      <Text style={styles.bodySmall}>{truncate(bet.assumptionBeingTested, 120)}</Text>
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View
              style={{
                padding: 20,
                backgroundColor: COLORS.slate[50],
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={[styles.body, { color: COLORS.slate[500] }]}>
                No bets defined for this thesis yet
              </Text>
            </View>
          )}

          <PageFooter companyName={companyName} pageNumber={currentPageNumber++} />
        </Page>
      );
    });
  });

  return <>{pages}</>;
}
