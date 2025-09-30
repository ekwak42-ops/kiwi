import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Next.js 인증 미들웨어
 * 보호된 라우트에 대한 접근을 제어합니다.
 * 
 * Supabase 공식 패턴: https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function middleware(request: NextRequest) {
  // 환경 변수 확인 (최우선)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.')
    // 로그인 페이지로 리다이렉트
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('error', 'config')
    return NextResponse.redirect(redirectUrl)
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

    // IMPORTANT: Supabase 세션 갱신
    // Do not run code between createServerClient and supabase.auth.getUser()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // 인증되지 않은 사용자는 로그인 페이지로
    if (!user) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // IMPORTANT: 반드시 supabaseResponse를 반환
    return supabaseResponse
  } catch (error) {
    // 에러 발생 시 로그인 페이지로
    console.error('미들웨어 오류:', error)
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('error', 'auth')
    return NextResponse.redirect(redirectUrl)
  }
}

/**
 * 미들웨어가 실행될 경로 설정
 * 보호된 라우트에만 적용 (로그인/회원가입 페이지는 제외)
 */
export const config = {
  matcher: [
    '/sell/:path*',
    '/mypage/:path*',
    '/chat/:path*',
  ],
}
