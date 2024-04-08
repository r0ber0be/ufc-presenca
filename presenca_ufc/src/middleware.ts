import { NextResponse, type NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const cookies = request.cookies.has('token-ufc')
  const redirectURL = new URL('/signin', request.url)
  if(!cookies) {
    console.log('Não temos cookies')
    if(!request.nextUrl.pathname.endsWith('/signin') && !request.nextUrl.pathname.endsWith('/signup')) {
      console.log('pathname', request.nextUrl.pathname)
      return NextResponse.redirect(redirectURL , { url: 'https://localhost:3000/signin' })
    }
  } 
}
 
export const config = {
  matcher: ['/', '/dashboard:path*', '/signin', '/signup' ],
}