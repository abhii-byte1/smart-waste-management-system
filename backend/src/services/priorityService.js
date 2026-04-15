const keywordPatterns = {
  High: [/\bhospital\b/i, /\burgent\b/i, /\bdanger\b/i],
  Medium: [/\bsmell\b/i, /\bdirty\b/i, /\boverflow(?:ing)?\b/i]
};

const containsKeyword = (text, patterns) => patterns.some((pattern) => pattern.test(text));

export const classifyPriority = (description = '') => {
  const content = description.trim();

  if (containsKeyword(content, keywordPatterns.High)) {
    return 'High';
  }

  if (containsKeyword(content, keywordPatterns.Medium)) {
    return 'Medium';
  }

  return 'Low';
};
