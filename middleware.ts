import { NextRequest, NextResponse } from 'next/server';



// If the incoming request has the "beta" cookie
// then we'll rewrite the request to /beta
export function middleware(req: NextRequest, res: NextResponse) {
  console.log('Middleware executed!', req.url);

  // Continuer à traiter la requête
  return;
}

// Supports both a single value or an array of matches
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|uploads|fonts|favicon|site.webmanifest).*)',
    '/',
  ],
};