/**
 * Synthesis Report PDF Generation
 *
 * This module provides PDF generation capabilities for Strategic Synthesis reports
 * using the Playing to Win framework methodology.
 *
 * Usage:
 * ```typescript
 * import { SynthesisReportDocument } from '@/lib/pdf/synthesis-report';
 * import { renderToBuffer } from '@react-pdf/renderer';
 *
 * const pdfBuffer = await renderToBuffer(
 *   <SynthesisReportDocument
 *     synthesis={synthesisData}
 *     client={clientData}
 *     generatedAt={new Date()}
 *   />
 * );
 * ```
 */

export { SynthesisReportDocument } from './SynthesisReportDocument';
export { CoverPage } from './CoverPage';
export { ExecutiveSummaryPage } from './ExecutiveSummaryPage';
export { StrategicMapPage } from './StrategicMapPage';
export { OpportunityPages } from './OpportunityPages';
export { TensionsPage } from './TensionsPage';
export { AppendixPage } from './AppendixPage';
export { PageFooter } from './PageFooter';
export { styles, COLORS, QUADRANT_COLORS, OPPORTUNITY_TYPE_COLORS, TERRITORY_COLORS, IMPACT_COLORS } from './styles';
