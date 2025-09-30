import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 사용자 인증 확인
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    // FormData에서 데이터 추출
    const formData = await request.formData()
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const priceStr = formData.get('price') as string
    const location_gu = formData.get('location_gu') as string
    const location_dong = formData.get('location_dong') as string
    
    // 이미지 URL 배열 추출
    const images: string[] = []
    formData.getAll('images[]').forEach((url) => {
      if (url && typeof url === 'string') {
        images.push(url)
      }
    })

    // 가격 변환
    const price = parseInt(priceStr, 10)

    // 유효성 검증
    if (!title || !description || !price || !location_gu || !location_dong) {
      return NextResponse.json(
        { error: '모든 필수 항목을 입력해주세요.' },
        { status: 400 }
      )
    }

    if (price < 0) {
      return NextResponse.json(
        { error: '가격은 0원 이상이어야 합니다.' },
        { status: 400 }
      )
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: '최소 1장 이상의 이미지를 업로드해주세요.' },
        { status: 400 }
      )
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
        images,
        status: 'available',
      })
      .select()
      .single()

    if (error) {
      console.error('상품 생성 오류:', error)
      return NextResponse.json(
        { error: '상품 등록에 실패했습니다.' },
        { status: 500 }
      )
    }

    // 캐시 무효화
    revalidatePath('/products')
    revalidatePath('/')

    return NextResponse.json({
      id: product.id,
      message: '상품이 성공적으로 등록되었습니다.',
    })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
