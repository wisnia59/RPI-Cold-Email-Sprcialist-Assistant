export function cleanEmailText(text: string): string {
  let cleaned = text;

  // Remove em dashes
  cleaned = cleaned.replace(/—/g, '. ');
  cleaned = cleaned.replace(/--/g, '. ');

  // Perform mandatory word swaps (though the LLM should handle this, this is a safety net)
  const swaps: [RegExp, string][] = [
    [/\bfree\b/gi, 'on me'],
    [/\bno cost\b/gi, 'nothing to pay upfront'],
    [/\bno obligation\b/gi, 'no commitment'],
    [/10% off/gi, '10% less'],
    [/Pay at Close/gi, 'you don\'t pay until the home sells'],
  ];

  swaps.forEach(([regex, replacement]) => {
    cleaned = cleaned.replace(regex, replacement);
  });

  return cleaned;
}
