import React from 'react';
import { Document } from '@react-pdf/renderer';
import { CoverPage } from './CoverPage';
import { PortfolioSummaryPage } from './PortfolioSummaryPage';
import { ThesisPages } from './ThesisPages';
import type { BetsResponse } from '@/types/bets';

interface BetsReportProps {
  betsData: BetsResponse;
  companyName?: string;
}

export function BetsReport({ betsData, companyName }: BetsReportProps) {
  // Format current date
  const generatedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Document>
      <CoverPage
        companyName={companyName}
        totalBets={betsData.portfolioSummary.totalBets}
        totalTheses={betsData.portfolioSummary.totalTheses}
        generatedDate={generatedDate}
      />
      <PortfolioSummaryPage betsData={betsData} companyName={companyName} />
      <ThesisPages
        theses={betsData.theses}
        companyName={companyName}
        startPage={3}
      />
    </Document>
  );
}
