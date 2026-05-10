import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Landing from './Landing';

// Mock Clerk's useAuth hook — note: the app uses @clerk/react, not @clerk/clerk-react
vi.mock('@clerk/react', () => ({
  useAuth: () => ({
    isSignedIn: false,
    isLoaded: true,
  }),
  SignInButton: ({ children }) => <div data-testid="signin-btn">{children}</div>,
}));

// Mock framer-motion to avoid animation issues in test environment
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_, tag) => {
      // Return a forwardRef component that renders the base HTML element
      return React.forwardRef((props, ref) => {
        const { initial, animate, whileInView, viewport, transition, ...rest } = props;
        return React.createElement(tag, { ...rest, ref });
      });
    }
  }),
  AnimatePresence: ({ children }) => children,
}));

describe('Landing Page', () => {
  it('renders the hero title text', () => {
    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );
    // The BlurText component renders "Transform E-Waste into Infinite Possibilities" word-by-word
    expect(screen.getByText(/Transform/i)).toBeInTheDocument();
    expect(screen.getByText(/Possibilities/i)).toBeInTheDocument();
  });

  it('renders three capability cards', () => {
    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );
    expect(screen.getAllByText(/Instant Classification/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Buyer Matching/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Sustainable Impact/i).length).toBeGreaterThan(0);
  });
});
