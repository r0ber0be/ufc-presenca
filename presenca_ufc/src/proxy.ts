import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/signin', '/signup']
const PROTECTED_ROUTES = ['/dashboard']
const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasToken = request.cookies.has('token-ufc')
  
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))

  // Redirect não autenticados para login
  if (!hasToken && isProtectedRoute) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  if (hasToken && isProtectedRoute) {
    const token = request.cookies.get('token-ufc')?.value

    if (!token) return

    if (!API_URL) {
      const response = NextResponse.redirect(new URL('/signin', request.url))
      response.cookies.delete('token-ufc')
      return response
    }
    
    try {
      const authCheck = await fetch(new URL('/api/turmas', API_URL), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (authCheck.status === 401) {
        const response = NextResponse.redirect(new URL('/signin', request.url))
        response.cookies.delete('token-ufc')
        return response
      }
    } catch (error) {
      console.log('[PROXY:]', error)
      const response = NextResponse.redirect(new URL('/signin', request.url))
      response.cookies.delete('token-ufc')
      return response
    }
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