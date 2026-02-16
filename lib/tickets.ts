/**
 * Generate a unique ticket code
 * Format: XXX-XXXX-XXXX (e.g., NIH-7A3F-9K2M)
 * Uses a mix of letters and numbers for readability
 */
export function generateTicketCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excludes I, O, 0, 1 to avoid confusion
  const segments = [3, 4, 4];
  
  return segments
    .map(length => {
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    })
    .join('-');
}

/**
 * Format a ticket code for display
 * Adds NIH- prefix for branding
 */
export function formatTicketCode(code: string): string {
  if (code.startsWith('NIH-')) return code;
  return `NIH-${code}`;
}

/**
 * Parse a ticket code (remove NIH- prefix if present)
 */
export function parseTicketCode(code: string): string {
  return code.replace(/^NIH-/, '');
}
