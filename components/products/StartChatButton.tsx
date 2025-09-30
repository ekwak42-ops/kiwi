'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface StartChatButtonProps {
  productId: string
  sellerId: string
  isSold: boolean
}

export function StartChatButton({ productId, sellerId, isSold }: StartChatButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleStartChat = async () => {
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      if (user.id === sellerId) {
        alert('본인의 상품에는 채팅할 수 없습니다.')
        return
      }

      // 기존 채팅방 확인
      const { data: existingRoom } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('product_id', productId)
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId)
        .maybeSingle()

      if (existingRoom) {
        router.push(`/chat/${existingRoom.id}`)
        return
      }

      // 새 채팅방 생성
      const { data: newRoom, error } = await supabase
        .from('chat_rooms')
        .insert({
          product_id: productId,
          buyer_id: user.id,
          seller_id: sellerId,
        })
        .select('id')
        .single()

      if (error) {
        console.error('채팅방 생성 오류:', error)
        alert('채팅방 생성에 실패했습니다.')
        return
      }

      router.push(`/chat/${newRoom.id}`)
    } catch (error) {
      console.error('채팅 시작 오류:', error)
      alert('채팅을 시작할 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleStartChat}
      className="flex-1"
      disabled={isSold || loading}
    >
      {loading ? '처리 중...' : isSold ? '판매 완료' : '채팅하기'}
    </Button>
  )
}
