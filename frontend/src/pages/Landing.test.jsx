import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Landing from './Landing';

// Mock Clerk's useAuth hook
vi.mock('@clerk/clerk-react', () => ({
  useAuth: () => ({
    isSignedIn: false,
    isLoaded: true,
  }),
  SignInButton: ({ children }) => <div data-testid="signin-btn">{children}</div>,
}));

describe('Landing Page', () => {
  it('renders the hero title properly', () => {
    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );
    expect(screen.getByText(/Don't Junk It./i)).toBeInTheDocument();
    expect(screen.getByText(/ReCircuit It./i)).toBeInTheDocument();
  });

  it('renders three main feature cards', () => {
    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );
    expect(screen.getByText(/Snap a Photo/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Classification/i)).toBeInTheDocument();
    expect(screen.getByText(/Match & Sell/i)).toBeInTheDocument();
  });
});
