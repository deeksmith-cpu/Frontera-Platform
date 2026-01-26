import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from './styles';

interface PageFooterProps {
  companyName?: string;
  pageNumber?: number;
}

export function PageFooter({ companyName, pageNumber }: PageFooterProps) {
  return (
    <View style={styles.footer}>
      <Text>
        {companyName || 'Strategic Synthesis'} | Frontera AI
      </Text>
      {pageNumber && <Text style={styles.pageNumber}>Page {pageNumber}</Text>}
    </View>
  );
}
