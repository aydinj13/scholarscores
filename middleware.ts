import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()
  
  // If user is authenticated and trying to access sign-in/up pages, redirect to dashboard
  if (userId && (request.url.includes('/sign-in') || request.url.includes('/sign-up'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // For protected routes, redirect to sign-in if not authenticated
  if (!isPublicRoute(request)) {
    if (!userId) {
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirect_url', request.url)
      return NextResponse.redirect(signInUrl)
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}