import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Next.js 인증 미들웨어
 * Supabase 세션을 확인하고 보호된 라우트에 대한 접근을 제어합니다.
 * 
 * Supabase 공식 패턴: https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 공개 경로 (인증 체크 건너뛰기)
  const publicPaths = ['/login', '/signup', '/']
  const isPublicPath = publicPaths.some((path) => pathname === path)

  // 공개 경로는 바로 통과
  if (isPublicPath) {
    return NextResponse.next()
  }

  // 환경 변수 확인
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.')
    // 환경 변수가 없으면 그냥 통과 (Vercel 배포 초기 상태)
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
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

    // IMPORTANT: Supabase 세션 갱신을 위해 반드시 호출해야 함
    // Do not run code between createServerClient and supabase.auth.getUser()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // 보호된 라우트 목록
    const protectedRoutes = ['/sell', '/mypage', '/chat']
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

    // IMPORTANT: 반드시 supabaseResponse를 반환해야 함
    // 쿠키가 올바르게 설정되어야 세션이 유지됨
    return supabaseResponse
  } catch (error) {
    // Supabase 호출 실패 시에도 페이지는 계속 진행
    console.error('미들웨어 오류:', error)
    return NextResponse.next()
  }
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
