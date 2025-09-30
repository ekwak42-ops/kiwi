'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  onImagesChange: (urls: string[]) => void
  maxImages?: number
  existingImages?: string[]
}

type ImageSlot = 'top' | 'bottom' | 'left' | 'right'

const IMAGE_SLOTS: { slot: ImageSlot; label: string }[] = [
  { slot: 'top', label: '상 (위)' },
  { slot: 'bottom', label: '하 (아래)' },
  { slot: 'left', label: '좌 (왼쪽)' },
  { slot: 'right', label: '우 (오른쪽)' },
]

export function ImageUploader({
  onImagesChange,
  maxImages = 4,
  existingImages = [],
}: ImageUploaderProps) {
  const [images, setImages] = useState<{ [key in ImageSlot]?: File }>({})
  const [previews, setPreviews] = useState<{ [key in ImageSlot]?: string }>(
    existingImages.reduce((acc, url, index) => {
      const slot = IMAGE_SLOTS[index]?.slot
      if (slot) acc[slot] = url
      return acc
    }, {} as { [key in ImageSlot]?: string })
  )
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (slot: ImageSlot, file: File) => {
    setError(null)

    // 파일 크기 확인 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('이미지 크기는 5MB 이하여야 합니다.')
      return
    }

    // 파일 타입 확인
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.')
      return
    }

    // 미리보기 생성
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviews((prev) => ({
        ...prev,
        [slot]: reader.result as string,
      }))
    }
    reader.readAsDataURL(file)

    // 파일 저장
    setImages((prev) => ({
      ...prev,
      [slot]: file,
    }))
  }

  const handleRemove = (slot: ImageSlot) => {
    setImages((prev) => {
      const newImages = { ...prev }
      delete newImages[slot]
      return newImages
    })
    setPreviews((prev) => {
      const newPreviews = { ...prev }
      delete newPreviews[slot]
      return newPreviews
    })
    setError(null)
  }

  const uploadImages = async () => {
    setUploading(true)
    setError(null)

    try {
      const uploadedUrls: string[] = []

      // 순서대로 업로드 (상, 하, 좌, 우)
      for (const { slot } of IMAGE_SLOTS) {
        const file = images[slot]
        if (file) {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('slot', slot)

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            throw new Error('이미지 업로드에 실패했습니다.')
          }

          const { url } = await response.json()
          uploadedUrls.push(url)
        } else if (previews[slot]) {
          // 기존 이미지 유지
          uploadedUrls.push(previews[slot]!)
        }
      }

      onImagesChange(uploadedUrls)
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const imageCount = Object.keys(images).length + Object.keys(previews).filter(key => !images[key as ImageSlot]).length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {IMAGE_SLOTS.map(({ slot, label }) => (
          <Card key={slot} className="p-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{label}</label>
              
              {previews[slot] ? (
                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-primary">
                  <img
                    src={previews[slot]}
                    alt={label}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemove(slot)}
                  >
                    삭제
                  </Button>
                </div>
              ) : (
                <label
                  className={cn(
                    'flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-accent transition-colors',
                    'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileSelect(slot, file)
                    }}
                  />
                  <svg
                    className="w-12 h-12 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-sm">이미지 선택</span>
                  <span className="text-xs mt-1">최대 5MB</span>
                </label>
              )}
            </div>
          </Card>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {imageCount} / {maxImages} 이미지 선택됨
        </span>
        {imageCount > 0 && Object.keys(images).length > 0 && (
          <Button
            type="button"
            onClick={uploadImages}
            disabled={uploading}
            size="sm"
          >
            {uploading ? '업로드 중...' : '이미지 업로드'}
          </Button>
        )}
      </div>

      <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm">
        <p className="font-medium mb-1">📸 상하좌우 사진 촬영 가이드</p>
        <ul className="space-y-1 text-muted-foreground">
          <li>• 상품의 4방향을 모두 촬영해주세요</li>
          <li>• 밝은 곳에서 선명하게 촬영해주세요</li>
          <li>• 실제 상품 상태가 잘 보이도록 촬영해주세요</li>
          <li>• 각 이미지는 5MB 이하여야 합니다</li>
        </ul>
      </div>
    </div>
  )
}
