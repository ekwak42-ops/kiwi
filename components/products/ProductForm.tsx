'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader } from './ImageUploader'

export function ProductForm() {
  const router = useRouter()
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      
      // 이미지 URL을 FormData에 추가
      imageUrls.forEach((url) => {
        formData.append('images[]', url)
      })

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '상품 등록에 실패했습니다.')
      }

      // 성공 시 상품 상세 페이지로 이동
      router.push(`/products/${data.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 제목 */}
      <div className="space-y-2">
        <Label htmlFor="title">상품명 *</Label>
        <Input
          id="title"
          name="title"
          placeholder="예: 아이폰 15 Pro"
          required
          maxLength={100}
        />
      </div>

      {/* 가격 */}
      <div className="space-y-2">
        <Label htmlFor="price">가격 (원) *</Label>
        <Input
          id="price"
          name="price"
          type="number"
          placeholder="0"
          required
          min="0"
          step="1000"
        />
      </div>

      {/* 설명 */}
      <div className="space-y-2">
        <Label htmlFor="description">상품 설명 *</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="상품의 상태, 구매 시기, 사용 빈도 등을 자세히 알려주세요."
          required
          rows={6}
          maxLength={2000}
        />
        <p className="text-sm text-muted-foreground">
          최대 2,000자까지 입력 가능합니다.
        </p>
      </div>

      {/* 지역 정보 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location_gu">구 *</Label>
          <Input
            id="location_gu"
            name="location_gu"
            placeholder="예: 강남구"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location_dong">동 *</Label>
          <Input
            id="location_dong"
            name="location_dong"
            placeholder="예: 역삼동"
            required
          />
        </div>
      </div>

      {/* 이미지 업로드 */}
      <div className="space-y-2">
        <Label>상품 이미지 (상하좌우) *</Label>
        <ImageUploader
          onImagesChange={setImageUrls}
          maxImages={4}
        />
        {imageUrls.length === 0 && (
          <p className="text-sm text-muted-foreground">
            최소 1장 이상의 이미지를 업로드해주세요.
          </p>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* 제출 버튼 */}
      <div className="flex gap-4">
        <Button
          type="submit"
          className="flex-1"
          disabled={isSubmitting || imageUrls.length === 0}
        >
          {isSubmitting ? '등록 중...' : '상품 등록하기'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          취소
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        * 필수 입력 항목입니다. 등록된 상품은 같은 지역 사용자에게만 노출됩니다.
      </p>
    </form>
  )
}
