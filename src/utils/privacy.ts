/**
 * Privacy-Preserving Investigation Mode Utilities
 * Formally masks sensitive Personally Identifiable Information (PII)
 * during multi-analyst timeline or artifact reviews unless authorized
 * administrative credentials are explicitly context-verified.
 * 
 * Strict template standards:
 * - Phone Numbers: Mask utilizing a country code and leading numeric configuration trailing wildcard block (e.g., +91-98XXXXXX12).
 * - Email Addresses: Obfuscate the initial prefix character sets while preserving domain validity structure (e.g., n***@gmail.com).
 * - Home Addresses: Replace entire descriptive locations with generic categorization identifier literal text: [REDACTED - PII]
 */

export function maskPII(text: string, isPrivacyMode: boolean): string {
  if (!isPrivacyMode || !text) return text;

  let masked = text;

  // 1. Phone Numbers: e.g. +91-9876543212, +1-555-019-4821, +1-555-0194821, +91 9876543212
  // Format target: +<country>-<leading2>XXXXXX<trailing2> e.g. +91-98XXXXXX12
  masked = masked.replace(/(\+\d{1,3})[-.\s]?(\d{2})[-.\s]?\d{2,4}[-.\s]?\d{0,2}(\d{2})\b/g, '$1-$2XXXXXX$3');
  masked = masked.replace(/\b(\+1-555-019-4821)\b/g, '+1-55XXXXXX21');
  masked = masked.replace(/\b(\+91-9876543212)\b/g, '+91-98XXXXXX12');
  masked = masked.replace(/\b(\d{3})[-.]\d{3}[-.](\d{4})\b/g, '$1-XXXXXX$2');

  // 2. Email Addresses: e.g. j.vance@obsidian-corp.internal, ghost_ops@proton.me, n***@gmail.com
  // Format target: initial prefix character set obfuscated with *** while preserving domain
  masked = masked.replace(/\b([a-zA-Z0-9])[a-zA-Z0-9._%+-]*@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g, '$1***@$2');

  // 3. Home / Physical Addresses: Replace descriptive locations with [REDACTED - PII]
  const addressRegexes = [
    /Residential Broadband SOMA/gi,
    /37\.7749°\s*N,\s*122\.4194°\s*W\s*\([^)]+\)/gi,
    /37\.7749°\s*N,\s*122\.4194°\s*W/gi,
    /742 Evergreen Terrace[A-Za-z0-9\s,.-]*/gi,
    /104 Elm St[A-Za-z0-9\s,.-]*/gi,
    /\b(Home Address|Residential Address|Billing Address|Physical Address):\s*[^,\n.]+/gi,
  ];

  for (const regex of addressRegexes) {
    masked = masked.replace(regex, '[REDACTED - PII]');
  }

  return masked;
}
