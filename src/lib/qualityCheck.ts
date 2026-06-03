import { GenerationResponse, QualityCheckResult } from './types';

export function runQualityCheck(data: GenerationResponse): QualityCheckResult {
  const { email } = data;
  const errors: string[] = [];
  const warnings: string[] = [];

  // Length check: 4-6 sentences
  const sentenceCount = email.body.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  if (sentenceCount < 4 || sentenceCount > 6) {
    errors.push(`Email body has ${sentenceCount} sentences. Required: 4-6.`);
  }

  // No em dashes
  if (email.body.includes('—') || email.body.includes('--')) {
    errors.push('Email contains em dashes or double hyphens.');
  }

  // Forbidden words (Spam rules)
  const forbidden = [
    { word: 'free', replacement: 'on me' },
    { word: 'no cost', replacement: 'nothing to pay upfront' },
    { word: 'no obligation', replacement: 'no commitment' },
    { word: '10% off', replacement: '10% less / I\'ll knock 10% off' },
    { word: 'pay at close', replacement: 'you don\'t pay until the home sells' },
  ];

  forbidden.forEach(({ word }) => {
    const regex = new RegExp(word, 'gi');
    if (regex.test(email.body)) {
      errors.push(`Forbidden word/phrase found: "${word}".`);
    }
  });

  // Jargon
  const jargon = ['leverage', 'synergy', 'seamless', 'innovative', 'circle back'];
  jargon.forEach(word => {
    if (email.body.toLowerCase().includes(word)) {
      errors.push(`Jargon found: "${word}".`);
    }
  });

  // Subject length: 2-5 words
  const subjectWords = email.subject.split(/\s+/).filter(w => w.length > 0).length;
  if (subjectWords < 2 || subjectWords > 5) {
    errors.push(`Subject line has ${subjectWords} words. Required: 2-5.`);
  }

  // Subject lowercase check
  if (email.subject !== email.subject.toLowerCase()) {
    warnings.push('Subject line is not all lowercase.');
  }

  // Offer sequence check (Rough heuristic)
  const bodyLower = email.body.toLowerCase();
  const indexOnMe = bodyLower.indexOf('on me');
  const indexNothingToPay = bodyLower.indexOf('nothing to pay');
  const index10Percent = bodyLower.indexOf('10%');
  const indexUntilSells = bodyLower.indexOf('until the home sells');

  if (indexOnMe === -1) warnings.push('Could not find "on me" in body.');
  if (indexNothingToPay === -1) warnings.push('Could not find "nothing to pay" in body.');
  if (index10Percent === -1) warnings.push('Could not find "10%" in body.');
  if (indexUntilSells === -1) warnings.push('Could not find "until the home sells" in body.');

  // Check sequence
  if (indexOnMe > indexNothingToPay && indexOnMe !== -1 && indexNothingToPay !== -1) {
    errors.push('Offer sequence error: "on me" should come before "nothing to pay".');
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings
  };
}
