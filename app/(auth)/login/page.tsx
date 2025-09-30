import Link from 'next/link'
import { signIn } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '로그인 - 키위마켓',
  description: '키위마켓에 로그인하세요',
}

export default function LoginPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">로그인</h2>
        <p className="text-sm text-muted-foreground mt-1">
          키위마켓 계정으로 로그인하세요
        </p>
      </div>

      <form action={signIn} className="space-y-4">
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
            placeholder="비밀번호를 입력하세요"
            required
            autoComplete="current-password"
          />
        </div>

        {/* 비밀번호 찾기 */}
        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            비밀번호를 잊으셨나요?
          </Link>
        </div>

        {/* 로그인 버튼 */}
        <Button type="submit" className="w-full" size="lg">
          로그인
        </Button>
      </form>

      {/* 회원가입 링크 */}
      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">아직 계정이 없으신가요? </span>
        <Link href="/signup" className="text-primary hover:underline font-medium">
          회원가입
        </Link>
      </div>

      {/* 소셜 로그인 (옵션) */}
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-muted-foreground">
              또는
            </span>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          소셜 로그인은 추후 지원 예정입니다
        </div>
      </div>
    </div>
  )
}
