import Link from 'next/link'
import { signUp } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '회원가입 - 키위마켓',
  description: '키위마켓에 가입하고 우리 동네 중고 거래를 시작하세요',
}

export default function SignupPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">회원가입</h2>
        <p className="text-sm text-muted-foreground mt-1">
          키위마켓과 함께 안전한 중고 거래를 시작하세요
        </p>
      </div>

      <form action={signUp} className="space-y-4">
        {/* 이메일 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            이메일
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            required
            autoComplete="email"
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            비밀번호
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="8자 이상 입력해주세요"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <p className="text-xs text-muted-foreground mt-1">
            최소 8자 이상 입력해주세요
          </p>
        </div>

        {/* 이름 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            이름
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="홍길동"
            required
            autoComplete="name"
          />
        </div>

        {/* 전화번호 */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            전화번호
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="010-1234-5678"
            required
            autoComplete="tel"
          />
        </div>

        {/* 주소 (동네) */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            우리 동네
          </label>
          <Input
            id="address"
            name="address"
            type="text"
            placeholder="예: 서울시 강남구 역삼동"
            required
            autoComplete="street-address"
          />
          <p className="text-xs text-muted-foreground mt-1">
            거래할 지역을 입력해주세요
          </p>
        </div>

        {/* 회원가입 버튼 */}
        <Button type="submit" className="w-full" size="lg">
          회원가입
        </Button>
      </form>

      {/* 로그인 링크 */}
      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
        <Link href="/login" className="text-primary hover:underline font-medium">
          로그인
        </Link>
      </div>
    </div>
  )
}
