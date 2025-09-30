import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Next.js 인증 미들웨어
 * Supabase 세션을 확인하고 보호된 라우트에 대한 접근을 제어합니다.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 환경 변수 확인
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.')
    console.error('NEXT_PUBLIC_SUPABASE_URL:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    // 환경 변수가 없으면 미들웨어를 건너뛰고 계속 진행
    return NextResponse.next({
      request,
    })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 중요: Supabase 클라이언트를 사용하여 세션 갱신
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 보호된 라우트 목록
  const protectedRoutes = ['/sell', '/mypage', '/chat']

  // 인증이 필요한 페이지인지 확인
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // 로그인하지 않았는데 보호된 라우트에 접근하려는 경우
  if (isProtectedRoute && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 이미 로그인했는데 로그인/회원가입 페이지에 접근하려는 경우
  if (user && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

/**
 * 미들웨어가 실행될 경로 설정
 * 보호된 라우트와 인증 관련 라우트에만 적용
 */
export const config = {
  matcher: [
    '/sell/:path*',
    '/mypage/:path*',
    '/chat/:path*',
    '/login',
    '/signup',
  ],
}
