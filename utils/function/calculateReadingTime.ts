export function calculateReadingTime(wordCount: number): string {
  const WORDS_PER_MINUTE = 225; // Average adult reading speed
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  return `${minutes} min read`;
}