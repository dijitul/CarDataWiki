'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Session } from 'next-auth'

interface NavProps {
  session: Session | null
}

export function Nav({ session }: NavProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect width="28" height="28" rx="4" fill="#1e40af"/>
              <path d="M4 20 L8 10 L12 16 L16 8 L20 14 L24 10" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="24" cy="10" r="2" fill="#f59e0b"/>
            </svg>
            <span className="font-bold text-slate-900 text-base tracking-tight">
              cardata<span className="text-primary-700">.wiki</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm">
            <Link href="/makes" className="px-3 py-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
              Browse
            </Link>
            <Link href="/contribute" className="px-3 py-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
              Contribute
            </Link>
            <Link href="/api-docs" className="px-3 py-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
              API
            </Link>
            <Link href="/about" className="px-3 py-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
              About
            </Link>
          </nav>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <>
                {session.user?.role === 'ADMIN' && (
                  <Link href="/admin" className="btn-ghost text-xs">
                    Admin
                  </Link>
                )}
                <Link href="/dashboard" className="btn-outline text-xs px-3 py-1.5">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-ghost">Sign in</Link>
                <Link href="/register" className="btn-primary text-xs px-3 py-1.5">Get started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded text-slate-500 hover:bg-slate-100"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          <Link href="/makes"      className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded">Browse Makes</Link>
          <Link href="/contribute" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded">Contribute</Link>
          <Link href="/api-docs"   className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded">API</Link>
          <Link href="/about"      className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded">About</Link>
          {session ? (
            <Link href="/dashboard" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded">Dashboard</Link>
          ) : (
            <>
              <Link href="/login"    className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded">Sign in</Link>
              <Link href="/register" className="block px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50 rounded">Get started</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
