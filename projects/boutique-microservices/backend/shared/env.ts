/**
 * Fail-fast environment readers, shared by every service.
 *
 * WHY: the original code used `process.env.JWT_SECRET || 'your-secret-key'`.
 * JWT_SECRET was never set in any manifest, so the hardcoded fallback was what
 * ran in production — anyone who read the source could forge tokens. A service
 * that refuses to start is safer than one running on a known secret.
 */

const MIN_SECRET_LENGTH = 32;

export function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(
      `[config] Required environment variable ${name} is not set. ` +
        `Copy .env.example to .env and populate it.`
    );
  }
  return value;
}

export function requiredSecret(name: string): string {
  const value = required(name);
  if (value.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `[config] ${name} must be at least ${MIN_SECRET_LENGTH} characters ` +
        `(got ${value.length}). Generate one with: openssl rand -base64 48`
    );
  }
  if (value.includes('CHANGE_ME') || value === 'your-secret-key') {
    throw new Error(
      `[config] ${name} still holds a placeholder value. Set a real secret.`
    );
  }
  return value;
}

export function optional(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim() !== '' ? value : fallback;
}

export function optionalInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`[config] ${name} must be an integer, got "${raw}"`);
  }
  return parsed;
}

/** Comma-separated list, e.g. CORS_ALLOWED_ORIGINS. */
export function optionalList(name: string, fallback: string): string[] {
  return optional(name, fallback)
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}
