'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

type ActionResult = {
  error?: string
  success?: boolean
}

/**
 * 회원가입 Server Action
 */
export async function signUp(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string

  // 입력값 검증
  if (!email || !password || !name || !phone || !address) {
    return { error: '모든 필드를 입력해주세요.' }
  }

  if (password.length < 8) {
    return { error: '비밀번호는 최소 8자 이상이어야 합니다.' }
  }

  const supabase = await createClient()

  // Supabase Auth 회원가입
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        phone,
        address,
      },
    },
  })

  if (authError) {
    console.error('회원가입 오류:', authError)
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: '회원가입에 실패했습니다.' }
  }

  // 성공 시 리다이렉트
  revalidatePath('/', 'layout')
  redirect('/')
}

/**
 * 로그인 Server Action
 */
export async function signIn(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 입력값 검증
  if (!email || !password) {
    return { error: '이메일과 비밀번호를 입력해주세요.' }
  }

  const supabase = await createClient()

  // Supabase Auth 로그인
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('로그인 오류:', error)
    return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
  }

  // 성공 시 리다이렉트
  revalidatePath('/', 'layout')
  redirect('/')
}

/**
 * 로그아웃 Server Action
 */
export async function signOut(): Promise<ActionResult> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('로그아웃 오류:', error)
    return { error: '로그아웃에 실패했습니다.' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

/**
 * 현재 로그인한 사용자 정보 가져오기
 */
export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}
