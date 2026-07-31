/**
 * Authentication & Authorization configuration for DSA Pattern Map.
 * 
 * Workflow for Admin Access:
 * 1. Local Development (`npm run dev`):
 *    - `isDevEnvironment()` evaluates to true.
 *    - `isAdminAllowed()` returns true, granting full access to `/admin` and CRUD functionality.
 * 
 * 2. Production Deployment (`NODE_ENV === "production"`):
 *    - `isDevEnvironment()` evaluates to false.
 *    - `/admin` is hidden from navigation and direct visits redirect to homepage.
 * 
 * 3. Future Auth.js / Google OAuth Integration:
 *    - Pass the Auth.js session user into `isAdminAllowed(user)` to check for `user.role === 'ADMIN'`.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

/**
 * Checks if the runtime environment is development (`npm run dev`).
 */
export function isDevEnvironment(): boolean {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return (import.meta as any).env.DEV || (import.meta as any).env.MODE === 'development';
  }
  return process.env.NODE_ENV !== 'production';
}

/**
 * Determines if Admin Panel access is permitted.
 * - Allowed in local development (`npm run dev`).
 * - Blocked in production unless user is authenticated with `role === 'ADMIN'`.
 */
export function isAdminAllowed(user?: AuthUser | null): boolean {
  if (user && user.role === 'ADMIN') {
    return true;
  }
  return isDevEnvironment();
}
