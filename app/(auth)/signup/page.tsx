'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { signUp } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Zod 스키마 정의
const signupSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식을 입력해주세요'),
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(/[a-zA-Z]/, '비밀번호에는 영문자가 포함되어야 합니다'),
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
  phone: z
    .string()
    .regex(/^010-\d{4}-\d{4}$/, '올바른 전화번호 형식을 입력해주세요 (예: 010-1234-5678)'),
  address: z.string().min(3, '지역을 입력해주세요'),
})

type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupForm) => {
    setServerError('')
    
    startTransition(async () => {
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('password', data.password)
      formData.append('name', data.name)
      formData.append('phone', data.phone)
      formData.append('address', data.address)

      const result = await signUp(formData)
      
      if (result?.error) {
        setServerError(result.error)
      }
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">회원가입</h2>
        <p className="text-sm text-muted-foreground mt-1">
          키위마켓과 함께 안전한 중고 거래를 시작하세요
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
            placeholder="8자 이상 입력해주세요"
            autoComplete="new-password"
            {...register('password')}
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            최소 8자 이상, 영문자 포함
          </p>
        </div>

        {/* 이름 */}
        <div>
          <Label htmlFor="name">이름</Label>
          <Input
            id="name"
            type="text"
            placeholder="홍길동"
            autoComplete="name"
            {...register('name')}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* 전화번호 */}
        <div>
          <Label htmlFor="phone">전화번호</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="010-1234-5678"
            autoComplete="tel"
            {...register('phone')}
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* 주소 (동네) */}
        <div>
          <Label htmlFor="address">우리 동네</Label>
          <Input
            id="address"
            type="text"
            placeholder="예: 서울시 강남구 역삼동"
            autoComplete="street-address"
            {...register('address')}
            className={errors.address ? 'border-red-500' : ''}
          />
          {errors.address && (
            <p className="text-xs text-red-600 mt-1">{errors.address.message}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            거래할 지역을 입력해주세요
          </p>
        </div>

        {/* 회원가입 버튼 */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isPending}
        >
          {isPending ? '처리 중...' : '회원가입'}
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