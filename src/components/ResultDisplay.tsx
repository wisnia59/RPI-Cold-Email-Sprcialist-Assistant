import React from 'react';
import { GenerationResponse, QualityCheckResult } from '@/lib/types';

interface ResultDisplayProps {
  data: GenerationResponse;
  qualityCheck: QualityCheckResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ data, qualityCheck }) => {
  const { signals, email } = data;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="mt-8 space-y-8">
      {/* Key Signals */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Key Signals</h2>
        <ul className="space-y-2 text-gray-700">
          <li><strong>Agent:</strong> {signals.fullName} ({signals.firstName})</li>
          <li><strong>Email:</strong> <span className="bg-yellow-100 px-1">{signals.email}</span></li>
          <li><strong>Phone:</strong> <span className="bg-yellow-100 px-1">{signals.phone}</span></li>
          <li><strong>Brokerage:</strong> {signals.brokerage}</li>
          <li><strong>Locations:</strong> {signals.recentLocations.join(', ')}</li>
          <li><strong>Price Range:</strong> {signals.priceRange}</li>
          <li><strong>Volume:</strong> {signals.transactionVolume}</li>
          {signals.socialUrls.length > 0 && (
            <li><strong>Social:</strong> {signals.socialUrls.join(', ')}</li>
          )}
        </ul>
      </section>

      {/* Email Draft */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Email Draft</h2>
          <button 
            onClick={() => copyToClipboard(`Subject: ${email.subject}\n\n${email.body}`)}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
          >
            Copy Full Email
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">Subject</label>
            <p className="text-gray-900 font-medium">{email.subject}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded border border-gray-100 whitespace-pre-wrap text-gray-800 leading-relaxed">
            {email.body}
          </div>
        </div>
      </section>

      {/* Follow-up */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Follow-up #1 (3-5 days)</h2>
          <button 
            onClick={() => copyToClipboard(email.followUp)}
            className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
          >
            Copy Follow-up
          </button>
        </div>
        <div className="bg-gray-50 p-4 rounded border border-gray-100 whitespace-pre-wrap text-gray-800 leading-relaxed">
          {email.followUp}
        </div>
      </section>

      {/* Quality Check Results */}
      <section className={`p-6 rounded-lg shadow-sm border ${qualityCheck.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          {qualityCheck.passed ? '✅ Quality Check Passed' : '⚠️ Quality Check Failed'}
        </h2>
        {qualityCheck.errors.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-red-700 text-sm uppercase mb-2">Errors</h3>
            <ul className="list-disc ml-5 text-red-600 text-sm space-y-1">
              {qualityCheck.errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}
        {qualityCheck.warnings.length > 0 && (
          <div>
            <h3 className="font-semibold text-orange-700 text-sm uppercase mb-2">Warnings</h3>
            <ul className="list-disc ml-5 text-orange-600 text-sm space-y-1">
              {qualityCheck.warnings.map((warn, i) => <li key={i}>{warn}</li>)}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default ResultDisplay;
