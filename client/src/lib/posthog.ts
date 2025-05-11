// lib/posthog.ts
import type PostHog from 'posthog-js';

let posthog: typeof PostHog | null = null;

export async function initPostHog(): Promise<void> {
  if (typeof window === 'undefined') return; // Ensure it only runs on the client

  if (!posthog) {
    const mod = await import('posthog-js');
    posthog = mod.default;
  }

  const isLoaded = (posthog as typeof PostHog & { __loaded?: boolean }).__loaded;

  if (!isLoaded) {
    posthog.init('phc_89KWzUiyHYSQpRy2i0JVxjGjXnkc9sZeMe6deq6pmj2', {
      api_host: 'https://app.posthog.com',
    });
  }
}
