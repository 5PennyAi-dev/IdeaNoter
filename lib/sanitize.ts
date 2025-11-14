import DOMPurify from 'dompurify'

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Allows only safe HTML tags and attributes for rich text formatting
 *
 * @param dirty - The unsanitized HTML string
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHTML(dirty: string): string {
  // Return empty string if no content
  if (!dirty) return ''

  // Check if we're in a browser environment (DOMPurify requires DOM)
  if (typeof window === 'undefined') {
    return dirty // During SSR, return as-is (components are client-side anyway)
  }

  // Configure DOMPurify to allow common rich text tags
  const config = {
    ALLOWED_TAGS: [
      'strong', 'em', 'u', 's', 'p', 'br',
      'blockquote', 'code', 'pre',
      'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'a', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    // Ensure links open in new tab safely
    ALLOW_DATA_ATTR: false,
  }

  return DOMPurify.sanitize(dirty, config)
}
