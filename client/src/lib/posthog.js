// lib/posthog.js
import posthog from 'posthog-js';

export function initPostHog() {
  if (typeof window !== 'undefined' && !posthog.__loaded) {
    posthog.init('phc_89KWzUiyHYSQpRy2i0JVxjGjXnkc9sZeMe6deq6pmj2', {
      api_host: 'https://app.posthog.com',
    });
  }
}

export default posthog;