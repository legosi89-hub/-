const BANNED_WORDS = [
  'ХУЙ', 'ПИЗД', 'ЕБАТ', 'БЛЯД', 'СУКА', 'ГОВН', 'ЖОПА', 'ЧЛЕН', 'ГАНД',
  'FUCK', 'SHIT', 'PISS', 'CUNT', 'DICK', 'COCK', 'ASS', 'DAMN', 'HELL'
];

export const isProfane = (text: string): boolean => {
  const upperText = text.toUpperCase();
  return BANNED_WORDS.some(word => upperText.includes(word));
};

export const sanitizeName = (name: string): string => {
  // Simple 4-letter name validation
  let sanitized = name.replace(/[^A-Z0-9А-Я]/gi, '').toUpperCase();
  return sanitized.slice(0, 4);
};
