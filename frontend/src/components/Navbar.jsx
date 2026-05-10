import React from 'react';
import { Link } from 'react-router-dom';
import { Show, SignInButton, UserButton } from '@clerk/react';

export default function Navbar() {
  return (
    <nav className="fixed top-4 inset-x-0 px-4 md:px-8 lg:px-16 z-50 flex items-center justify-between box-border">
      <Link to="/" className="w-12 h-12 liquid-glass rounded-full flex items-center justify-center font-heading italic text-2xl text-white hover:text-white/80 transition-colors">
        r
      </Link>
      
      <div className="flex items-center gap-4">
        <Show when="signed-in">
          <Link to="/dashboard" className="text-sm font-medium text-white/90 hover:text-white px-3 py-2 transition-colors">
            Dashboard
          </Link>
          <div className="liquid-glass p-1 rounded-full flex items-center justify-center">
            <UserButton afterSignOutUrl="/" appearance={{
              elements: {
                avatarBox: { width: '36px', height: '36px' }
              }
            }} />
          </div>
        </Show>
        
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="liquid-glass-strong px-5 py-2 rounded-full text-sm font-medium text-white hover:bg-white/10 transition-colors">
              Sign In
            </button>
          </SignInButton>
        </Show>
      </div>
    </nav>
  );
}
