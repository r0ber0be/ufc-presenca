import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log('pathname', request.nextUrl.pathname)
  const cookies = request.cookies.has('token-ufc')
  const redirectURL = new URL('/', request.url)
  if(!cookies) {
    //NextResponse.redirect(redirectURL , { url: 'https://localhost:3000/signin' })
  } 
}
 
export const config = {
  matcher: ['/', '/dashboard:path*', '/signin', '/signup' ],
}