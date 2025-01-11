import { NextResponse } from 'next/server';

export function middleware(req) {
  // Example logic
  const url = req.nextUrl;

  // Example redirection logic
  if (!url.pathname.startsWith('/')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}
