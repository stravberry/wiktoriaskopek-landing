import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Polish Typography - Sierotki rule
 * Prevents orphaned short words (conjunctions, prepositions) at end of lines
 * Replaces regular space after protected words with non-breaking space (\u00A0)
 */
const PROTECTED_WORDS = [
  // Single letters
  'a', 'i', 'o', 'u', 'w', 'z',
  // Two/three letter words
  'że', 'czy', 'bo', 'lecz', 'nad', 'pod', 'dla', 'przy', 'do', 'na', 'od', 'po', 'za', 'ze',
  // Abbreviations (will be followed by non-breaking space)
  'prof.', 'dr', 'ul.', 'nr', 'mgr', 'inż.', 'tel.', 'e-mail:', 'www.'
]

export function fixPolishTypography(text: string): string {
  if (!text) return text

  let result = text

  // Replace space after protected words with non-breaking space
  PROTECTED_WORDS.forEach(word => {
    // Case insensitive match, word boundary aware
    const regex = new RegExp(`\\b(${word})\\s+`, 'gi')
    result = result.replace(regex, `$1\u00A0`)
  })

  // Fix Polish quotation marks: replace " with „ and " with "
  // Opening quote after space or at start
  result = result.replace(/(^|[\s(])"/g, '$1„')
  // Closing quote before space, punctuation or at end
  result = result.replace(/"([\s.,!?;:\-)]|$)/g, '"$1')

  return result
}

/**
 * React-safe version that returns JSX-compatible string
 * Use dangerouslySetInnerHTML or direct text content
 */
export function pl(text: string): string {
  return fixPolishTypography(text)
}
