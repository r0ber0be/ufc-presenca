import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/signin', '/signup']
const PROTECTED_ROUTES = ['/dashboard']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasToken = request.cookies.has('token-ufc')
  
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))

  // Redirect não autenticados para login
  if (!hasToken && isProtectedRoute) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // Redirect autenticados para dashboard
  if (hasToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect root para dashboard se autenticado
  if (pathname === '/' && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect root para signin se não autenticado  
  if (pathname === '/' && !hasToken) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}