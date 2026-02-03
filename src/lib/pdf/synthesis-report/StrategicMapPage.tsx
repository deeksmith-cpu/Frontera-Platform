import React from 'react';
import { Page, View, Text, Svg, Rect, Circle, G, Line } from '@react-pdf/renderer';
import { styles, COLORS, QUADRANT_COLORS } from './styles';
import type { StrategicOpportunity } from '@/types/synthesis';
import { PageFooter } from './PageFooter';

interface StrategicMapPageProps {
  opportunities: StrategicOpportunity[];
  companyName?: string;
}

export function StrategicMapPage({ opportunities, companyName }: StrategicMapPageProps) {
  // SVG dimensions
  const mapWidth = 400;
  const mapHeight = 300;
  const padding = 40;
  const gridWidth = mapWidth - padding * 2;
  const gridHeight = mapHeight - padding * 2;

  // Calculate position for an opportunity (1-10 scale to pixel position)
  const getPosition = (opp: StrategicOpportunity) => {
    const x = padding + ((opp.scoring.capabilityFit - 1) / 9) * gridWidth;
    const y = padding + gridHeight - ((opp.scoring.marketAttractiveness - 1) / 9) * gridHeight;
    return { x, y };
  };

  // Get dot color based on quadrant
  const getDotColor = (quadrant: string) => {
    switch (quadrant) {
      case 'invest': return COLORS.emerald[500];
      case 'explore': return COLORS.cyan[500];
      case 'harvest': return COLORS.amber[500];
      case 'divest': return COLORS.slate[400];
      default: return COLORS.slate[500];
    }
  };

  // Get dot size based on overall score
  const getDotSize = (score: number) => {
    if (score >= 80) return 8;
    if (score >= 60) return 6;
    return 5;
  };

  // Count by quadrant
  const quadrantCounts = {
    invest: opportunities.filter(o => o.quadrant === 'invest').length,
    explore: opportunities.filter(o => o.quadrant === 'explore').length,
    harvest: opportunities.filter(o => o.quadrant === 'harvest').length,
    divest: opportunities.filter(o => o.quadrant === 'divest').length,
  };

  return (
    <Page size="A4" style={styles.page}>
      {/* Page Title */}
      <Text style={styles.h1}>Strategic Opportunity Map</Text>
      <Text style={[styles.body, styles.mb16]}>
        Opportunities plotted by Market Attractiveness (vertical) and Capability Fit (horizontal).
        Higher positions indicate more attractive opportunities.
      </Text>

      {/* SVG Chart */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Svg width={mapWidth} height={mapHeight} viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
          {/* Background quadrants */}
          <G>
            {/* EXPLORE (top-left) */}
            <Rect
              x={padding}
              y={padding}
              width={gridWidth / 2}
              height={gridHeight / 2}
              fill={QUADRANT_COLORS.explore.bg}
            />
            {/* INVEST (top-right) */}
            <Rect
              x={padding + gridWidth / 2}
              y={padding}
              width={gridWidth / 2}
              height={gridHeight / 2}
              fill={QUADRANT_COLORS.invest.bg}
            />
            {/* DIVEST (bottom-left) */}
            <Rect
              x={padding}
              y={padding + gridHeight / 2}
              width={gridWidth / 2}
              height={gridHeight / 2}
              fill={QUADRANT_COLORS.divest.bg}
            />
            {/* HARVEST (bottom-right) */}
            <Rect
              x={padding + gridWidth / 2}
              y={padding + gridHeight / 2}
              width={gridWidth / 2}
              height={gridHeight / 2}
              fill={QUADRANT_COLORS.harvest.bg}
            />
          </G>

          {/* Grid border */}
          <Rect
            x={padding}
            y={padding}
            width={gridWidth}
            height={gridHeight}
            fill="none"
            stroke={COLORS.slate[300]}
            strokeWidth={1}
          />

          {/* Center lines */}
          <Line
            x1={padding + gridWidth / 2}
            y1={padding}
            x2={padding + gridWidth / 2}
            y2={padding + gridHeight}
            stroke={COLORS.slate[300]}
            strokeWidth={0.5}
          />
          <Line
            x1={padding}
            y1={padding + gridHeight / 2}
            x2={padding + gridWidth}
            y2={padding + gridHeight / 2}
            stroke={COLORS.slate[300]}
            strokeWidth={0.5}
          />

          {/* Opportunity dots */}
          {opportunities.map((opp, index) => {
            const pos = getPosition(opp);
            const color = getDotColor(opp.quadrant);
            const size = getDotSize(opp.scoring.overallScore);
            return (
              <Circle
                key={opp.id || index}
                cx={pos.x}
                cy={pos.y}
                r={size}
                fill={color}
              />
            );
          })}
        </Svg>
      </View>

      {/* Axis Labels */}
      <View style={[styles.rowSpaceBetween, styles.mb16, { paddingHorizontal: 20 }]}>
        <Text style={[styles.caption, { width: 80 }]}>Low Capability</Text>
        <Text style={[styles.label, { textAlign: 'center' }]}>Capability Fit</Text>
        <Text style={[styles.caption, { width: 80, textAlign: 'right' }]}>High Capability</Text>
      </View>

      {/* Quadrant Labels */}
      <View style={[styles.row, { gap: 8, justifyContent: 'center', marginBottom: 20 }]}>
        <View style={[styles.row, { gap: 4 }]}>
          <View style={{ width: 12, height: 12, backgroundColor: QUADRANT_COLORS.invest.bg, borderRadius: 2 }} />
          <Text style={styles.bodySmall}>INVEST</Text>
        </View>
        <View style={[styles.row, { gap: 4 }]}>
          <View style={{ width: 12, height: 12, backgroundColor: QUADRANT_COLORS.explore.bg, borderRadius: 2 }} />
          <Text style={styles.bodySmall}>EXPLORE</Text>
        </View>
        <View style={[styles.row, { gap: 4 }]}>
          <View style={{ width: 12, height: 12, backgroundColor: QUADRANT_COLORS.harvest.bg, borderRadius: 2 }} />
          <Text style={styles.bodySmall}>HARVEST</Text>
        </View>
        <View style={[styles.row, { gap: 4 }]}>
          <View style={{ width: 12, height: 12, backgroundColor: QUADRANT_COLORS.divest.bg, borderRadius: 2 }} />
          <Text style={styles.bodySmall}>DIVEST</Text>
        </View>
      </View>

      {/* Quadrant Summary */}
      <Text style={[styles.label, styles.mb8]}>Quadrant Summary</Text>
      <View style={[styles.row, { gap: 12 }]}>
        {/* INVEST */}
        <View
          style={{
            flex: 1,
            backgroundColor: QUADRANT_COLORS.invest.bg,
            borderRadius: 6,
            padding: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: QUADRANT_COLORS.invest.border,
          }}
        >
          <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: QUADRANT_COLORS.invest.text }}>
            {quadrantCounts.invest}
          </Text>
          <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: QUADRANT_COLORS.invest.text, marginTop: 2 }}>
            INVEST
          </Text>
        </View>
        {/* EXPLORE */}
        <View
          style={{
            flex: 1,
            backgroundColor: QUADRANT_COLORS.explore.bg,
            borderRadius: 6,
            padding: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: QUADRANT_COLORS.explore.border,
          }}
        >
          <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: QUADRANT_COLORS.explore.text }}>
            {quadrantCounts.explore}
          </Text>
          <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: QUADRANT_COLORS.explore.text, marginTop: 2 }}>
            EXPLORE
          </Text>
        </View>
        {/* HARVEST */}
        <View
          style={{
            flex: 1,
            backgroundColor: QUADRANT_COLORS.harvest.bg,
            borderRadius: 6,
            padding: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: QUADRANT_COLORS.harvest.border,
          }}
        >
          <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: QUADRANT_COLORS.harvest.text }}>
            {quadrantCounts.harvest}
          </Text>
          <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: QUADRANT_COLORS.harvest.text, marginTop: 2 }}>
            HARVEST
          </Text>
        </View>
        {/* DIVEST */}
        <View
          style={{
            flex: 1,
            backgroundColor: QUADRANT_COLORS.divest.bg,
            borderRadius: 6,
            padding: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: QUADRANT_COLORS.divest.border,
          }}
        >
          <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: QUADRANT_COLORS.divest.text }}>
            {quadrantCounts.divest}
          </Text>
          <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: QUADRANT_COLORS.divest.text, marginTop: 2 }}>
            DIVEST
          </Text>
        </View>
      </View>

      <PageFooter companyName={companyName} pageNumber={3} />
    </Page>
  );
}
