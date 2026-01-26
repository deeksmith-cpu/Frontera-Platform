import React from 'react';
import { Document } from '@react-pdf/renderer';
import type { SynthesisResult } from '@/types/synthesis';
import type { Client } from '@/types/database';
import { CoverPage } from './CoverPage';
import { ExecutiveSummaryPage } from './ExecutiveSummaryPage';
import { StrategicMapPage } from './StrategicMapPage';
import { OpportunityPages } from './OpportunityPages';
import { TensionsPage } from './TensionsPage';
import { AppendixPage } from './AppendixPage';

interface SynthesisReportProps {
  synthesis: SynthesisResult;
  client: Client | null;
  generatedAt: Date;
}

/**
 * SynthesisReportDocument
 *
 * Main PDF document for exporting Strategic Synthesis reports.
 * Uses the Playing to Win framework methodology.
 *
 * Structure:
 * 1. Cover Page - Company branding and report title
 * 2. Executive Summary - Key findings and recommendations
 * 3. Strategic Opportunity Map - 2x2 matrix visualization
 * 4. Opportunity Pages - Detailed cards (2 per page)
 * 5. Tensions Page - Strategic conflicts and resolution options
 * 6. Appendix - Methodology and disclaimer
 */
export function SynthesisReportDocument({
  synthesis,
  client,
  generatedAt,
}: SynthesisReportProps) {
  const companyName = client?.company_name;

  // Calculate page numbers
  const opportunityPagesCount = Math.ceil(synthesis.opportunities.length / 2);
  const tensionsPageNumber = 4 + opportunityPagesCount;
  const appendixPageNumber = synthesis.tensions.length > 0 ? tensionsPageNumber + 1 : tensionsPageNumber;

  return (
    <Document
      title={`Strategic Synthesis - ${companyName || 'Report'}`}
      author="Frontera AI Strategy Coach"
      subject="Playing to Win Strategic Analysis"
      creator="Frontera Platform"
      producer="@react-pdf/renderer"
    >
      {/* Page 1: Cover */}
      <CoverPage client={client} generatedAt={generatedAt} />

      {/* Page 2: Executive Summary */}
      <ExecutiveSummaryPage synthesis={synthesis} client={client} />

      {/* Page 3: Strategic Opportunity Map */}
      <StrategicMapPage
        opportunities={synthesis.opportunities}
        companyName={companyName}
      />

      {/* Pages 4+: Opportunities (2 per page) */}
      <OpportunityPages
        opportunities={synthesis.opportunities}
        companyName={companyName}
        startPage={4}
      />

      {/* Tensions Page (if any) */}
      {synthesis.tensions.length > 0 && (
        <TensionsPage
          tensions={synthesis.tensions}
          companyName={companyName}
          pageNumber={tensionsPageNumber}
        />
      )}

      {/* Final Page: Appendix */}
      <AppendixPage
        synthesis={synthesis}
        companyName={companyName}
        pageNumber={appendixPageNumber}
      />
    </Document>
  );
}

export default SynthesisReportDocument;
