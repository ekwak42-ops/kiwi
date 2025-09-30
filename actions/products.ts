'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * 새로운 상품을 생성합니다.
 * @param formData 폼 데이터
 */
export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  // 사용자 인증 확인
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 폼 데이터 추출
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priceStr = formData.get('price') as string
  const location_gu = formData.get('location_gu') as string
  const location_dong = formData.get('location_dong') as string

  // 가격 변환
  const price = parseInt(priceStr, 10)

  // 유효성 검증
  if (!title || !description || !price || !location_gu || !location_dong) {
    throw new Error('모든 필수 항목을 입력해주세요.')
  }

  if (price < 0) {
    throw new Error('가격은 0원 이상이어야 합니다.')
  }

  // 상품 생성
  const { data: product, error } = await supabase
    .from('products')
    .insert({
      seller_id: user.id,
      title,
      description,
      price,
      location_gu,
      location_dong,
      images: [], // 이미지는 향후 구현
      status: 'available',
    })
    .select()
    .single()

  if (error) {
    console.error('상품 생성 오류:', error)
    throw new Error('상품 등록에 실패했습니다.')
  }

  // 캐시 무효화
  revalidatePath('/products')
  revalidatePath('/')

  // 생성된 상품 페이지로 리다이렉트 (향후 구현)
  redirect(`/products/${product.id}`)
}

/**
 * 상품 상태를 업데이트합니다.
 * @param productId 상품 ID
 * @param status 새로운 상태
 */
export async function updateProductStatus(
  productId: string,
  status: 'available' | 'reserved' | 'sold'
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('로그인이 필요합니다.')
  }

  const { error } = await supabase
    .from('products')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', productId)
    .eq('seller_id', user.id) // 본인의 상품만 수정 가능

  if (error) {
    console.error('상품 상태 업데이트 오류:', error)
    throw new Error('상품 상태 업데이트에 실패했습니다.')
  }

  revalidatePath(`/products/${productId}`)
  revalidatePath('/products')
}

/**
 * 상품을 삭제합니다.
 * @param productId 상품 ID
 */
export async function deleteProduct(productId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('로그인이 필요합니다.')
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('seller_id', user.id) // 본인의 상품만 삭제 가능

  if (error) {
    console.error('상품 삭제 오류:', error)
    throw new Error('상품 삭제에 실패했습니다.')
  }

  revalidatePath('/products')
  revalidatePath('/')
  redirect('/products')
}
