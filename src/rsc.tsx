/**
 * Server Component entry point for Strapi Page Builder
 * This file exports server-safe components for use in React Server Components
 */

import type { ComponentConfig } from '@measured/puck';

export { Render } from '@measured/puck';

// Re-export types that are safe to use in server components
export type { ComponentConfig };

// Server-safe utilities
export { cn } from './utils';
