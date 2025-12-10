import { describe, it, expect, vi } from 'vitest';

// Polyfill ResizeObserver
vi.stubGlobal('ResizeObserver', class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
});

describe('App', () => {
    it('renders without crashing', async () => {
        const { default: App } = await import('./App');
        const { render } = await import('@testing-library/react');
        render(<App />);
        expect(document.body).toBeDefined();
    });
});
