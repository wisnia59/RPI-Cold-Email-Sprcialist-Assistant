'use client';

import { useState } from 'react';
import { GenerationResponse, QualityCheckResult } from '@/lib/types';
import { runQualityCheck } from '@/lib/qualityCheck';
import ResultDisplay from '@/components/ResultDisplay';

export default function Home() {
  const [inputData, setInputData] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [qualityCheck, setQualityCheck] = useState<QualityCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!inputData.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setQualityCheck(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputData }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate email');
      }

      const data: GenerationResponse = await response.json();
      const check = runQualityCheck(data);
      
      setResult(data);
      setQualityCheck(check);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Rich&apos;s Property Images
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Cold Email Specialist Assistant
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <div className="space-y-6">
            <div>
              <label htmlFor="inputData" className="block text-sm font-medium text-gray-700 mb-2">
                Paste Agent Info / Extracted Text
              </label>
              <textarea
                id="inputData"
                rows={8}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="Paste the screenshot text here (Agent name, brokerage, transactions, bio...)"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !inputData.trim()}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? 'Analyzing & Crafting...' : 'Generate Personalized Email'}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
              {error}
            </div>
          )}

          {result && qualityCheck && (
            <ResultDisplay data={result} qualityCheck={qualityCheck} />
          )}
        </div>
        
        <footer className="mt-12 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Rich&apos;s Property Images LLC. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
