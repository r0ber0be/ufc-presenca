import { NextResponse, type NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const cookies = request.cookies.has('token-ufc')
  const signinPath = request.nextUrl.pathname.endsWith('/signin')
  const signupPath = request.nextUrl.pathname.endsWith('/signup')

  if(!cookies) {
    const redirectURL = new URL('/signin', request.url)
    if(!signinPath && !signupPath) {
      return NextResponse.redirect(redirectURL, { url: 'https://localhost:3000/signin' })
    }
  } 
  else {
    if(signinPath || signupPath) {
      const redirectURL = new URL('/dashboard', request.url)
      return NextResponse.redirect(redirectURL, { url: 'https://localhost:3000/dashboard' })
    }
  }
  return NextResponse.next()
}
 
export const config = {
  matcher: ['/', '/dashboard:path*', '/signin', '/signup' ],
}