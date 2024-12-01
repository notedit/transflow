import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/api/socket') {
    if (request.headers.get('upgrade')?.includes('websocket')) {
      return NextResponse.next();
    }
    return NextResponse.json(
      { error: 'Expected Upgrade: websocket' },
      { status: 426 }
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/api/socket',
}