'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { signIn } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'

// Zod 스키마 정의
const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setServerError('')

    startTransition(async () => {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('password', data.password)

      const result = await signIn(formData)

      if (result?.error) {
        setServerError(result.error)
      }
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">로그인</h2>
        <p className="text-sm text-muted-foreground mt-1">
          키위마켓 계정으로 로그인하세요
        </p>
      </div>

      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 이메일 */}
        <div>
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            autoComplete="email"
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* 비밀번호 */}
        <div>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            {...register('password')}
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
          )}
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
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isPending}
        >
          {isPending ? '처리 중...' : '로그인'}
        </Button>
      </form>

      {/* 회원가입 링크 */}
      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">아직 계정이 없으신가요? </span>
        <Link href="/signup" className="text-primary hover:underline font-medium">
          회원가입
        </Link>
      </div>

      {/* 소셜 로그인 */}
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-muted-foreground">또는</span>
          </div>
        </div>

        <div className="mt-4">
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  )
}