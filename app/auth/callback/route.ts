import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    
    // code를 session으로 교환
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('OAuth 콜백 오류:', error)
      // 에러 발생 시 로그인 페이지로 리디렉트
      return NextResponse.redirect(`${origin}/login?error=oauth_error`)
    }
  }

  // 성공 시 홈으로 리디렉트
  return NextResponse.redirect(`${origin}/`)
}
