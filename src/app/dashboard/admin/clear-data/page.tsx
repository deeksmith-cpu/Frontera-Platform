'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ClearDataResult {
  success: boolean;
  message: string;
  results: {
    conversationsProcessed: number;
    messagesDeleted: number;
    insightsDeleted: number;
    synthesisDeleted: number;
    materialsDeleted: number;
    conversationsReset: number;
    errors: string[];
  };
}

export default function ClearDataPage() {
  const [isClearing, setIsClearing] = useState(false);
  const [result, setResult] = useState<ClearDataResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleClearData = async () => {
    if (!confirm('Are you sure you want to clear all test data? This will delete all conversation messages, territory insights, synthesis outputs, and strategic materials. This action cannot be undone.')) {
      return;
    }

    setIsClearing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/admin/clear-test-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to clear test data');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-stone-900 mb-2">
              Clear Test Data
            </h1>
            <p className="text-stone-600">
              This utility clears all conversation data for your organization to enable fresh UAT testing.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h3 className="text-amber-900 font-semibold mb-2">⚠️ Warning</h3>
            <p className="text-amber-800 text-sm">
              This will permanently delete:
            </p>
            <ul className="list-disc list-inside text-amber-800 text-sm mt-2 space-y-1">
              <li>All conversation messages</li>
              <li>All territory research insights</li>
              <li>All synthesis outputs</li>
              <li>All uploaded strategic materials</li>
              <li>Conversation states will be reset to Discovery phase</li>
            </ul>
          </div>

          <button
            onClick={handleClearData}
            disabled={isClearing}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            {isClearing ? 'Clearing Data...' : 'Clear All Test Data'}
          </button>

          {result && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-green-900 font-semibold mb-2">✅ Success</h3>
              <p className="text-green-800 text-sm mb-3">{result.message}</p>
              <div className="space-y-1 text-sm text-green-800">
                <p><strong>Conversations processed:</strong> {result.results.conversationsProcessed}</p>
                <p><strong>Messages deleted:</strong> {result.results.messagesDeleted}</p>
                <p><strong>Insights deleted:</strong> {result.results.insightsDeleted}</p>
                <p><strong>Synthesis outputs deleted:</strong> {result.results.synthesisDeleted}</p>
                <p><strong>Materials deleted:</strong> {result.results.materialsDeleted}</p>
                <p><strong>Conversations reset:</strong> {result.results.conversationsReset}</p>
              </div>
              {result.results.errors.length > 0 && (
                <div className="mt-3">
                  <p className="font-semibold text-amber-900">Errors encountered:</p>
                  <ul className="list-disc list-inside text-sm text-amber-800">
                    {result.results.errors.map((err: string, idx: number) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={() => router.push('/dashboard/strategy-coach')}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Go to Strategy Coach
              </button>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-900 font-semibold mb-2">❌ Error</h3>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-stone-200">
            <h3 className="text-lg font-semibold text-stone-900 mb-3">
              UAT Testing Guide
            </h3>
            <p className="text-stone-600 text-sm mb-3">
              After clearing test data, you can follow the UAT Test Pack to systematically test the MVP:
            </p>
            <ol className="list-decimal list-inside text-stone-600 text-sm space-y-2">
              <li>Clear test data using the button above</li>
              <li>Navigate to Strategy Coach</li>
              <li>Create a new conversation</li>
              <li>Follow test scenarios from <code className="bg-stone-100 px-2 py-1 rounded">UAT_TEST_PACK.md</code></li>
              <li>Test each phase: Discovery → Research → Synthesis</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
