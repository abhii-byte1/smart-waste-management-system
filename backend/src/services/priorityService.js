const keywordPatterns = {
  High: [/\bhospital\b/i, /\burgent\b/i, /\bdanger\b/i, /\bfire\b/i, /\btoxic\b/i, /\bhazard(?:ous)?\b/i],
  Medium: [/\bsmell\b/i, /\bdirty\b/i, /\boverflow(?:ing)?\b/i, /\brats?\b/i, /\bpest\b/i, /\bblocked\b/i]
};

const containsKeyword = (text, patterns) => patterns.some((pattern) => pattern.test(text));

/**
 * Classify complaint priority based on description AND location keywords.
 * @param {string} description - The complaint description text
 * @param {string} location - The complaint location text
 * @returns {'High' | 'Medium' | 'Low'}
 */
export const classifyPriority = (description = '', location = '') => {
  // Combine both fields so location-based keywords (e.g. "hospital") are also evaluated
  const content = `${description} ${location}`.trim();

  if (containsKeyword(content, keywordPatterns.High)) {
    return 'High';
  }

  if (containsKeyword(content, keywordPatterns.Medium)) {
    return 'Medium';
  }

  return 'Low';
};
