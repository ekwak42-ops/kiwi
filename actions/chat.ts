'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * 채팅방을 생성하거나 기존 채팅방을 가져옵니다.
 * @param productId 상품 ID
 * @param sellerId 판매자 ID
 */
export async function createOrGetChatRoom(productId: string, sellerId: string) {
  const supabase = await createClient()

  // 사용자 인증 확인
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 본인 상품에는 채팅 불가
  if (user.id === sellerId) {
    throw new Error('본인의 상품에는 채팅할 수 없습니다.')
  }

  // 기존 채팅방 확인
  const { data: existingRoom } = await supabase
    .from('chat_rooms')
    .select('id')
    .eq('product_id', productId)
    .eq('buyer_id', user.id)
    .eq('seller_id', sellerId)
    .single()

  if (existingRoom) {
    return existingRoom.id
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
    throw new Error('채팅방 생성에 실패했습니다.')
  }

  revalidatePath('/chat')
  return newRoom.id
}

/**
 * 메시지를 전송합니다.
 * @param chatRoomId 채팅방 ID
 * @param content 메시지 내용
 */
export async function sendMessage(chatRoomId: string, content: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('로그인이 필요합니다.')
  }

  if (!content.trim()) {
    throw new Error('메시지 내용을 입력해주세요.')
  }

  // 채팅방 참여자 확인
  const { data: chatRoom } = await supabase
    .from('chat_rooms')
    .select('buyer_id, seller_id')
    .eq('id', chatRoomId)
    .single()

  if (!chatRoom) {
    throw new Error('채팅방을 찾을 수 없습니다.')
  }

  const isParticipant = user.id === chatRoom.buyer_id || user.id === chatRoom.seller_id

  if (!isParticipant) {
    throw new Error('채팅방에 참여할 권한이 없습니다.')
  }

  // 메시지 전송
  const { data: message, error } = await supabase
    .from('chat_messages')
    .insert({
      chat_room_id: chatRoomId,
      sender_id: user.id,
      content: content.trim(),
    })
    .select()
    .single()

  if (error) {
    console.error('메시지 전송 오류:', error)
    throw new Error('메시지 전송에 실패했습니다.')
  }

  return message
}

/**
 * 사용자의 모든 채팅방 목록을 가져옵니다.
 */
export async function getChatRooms() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: chatRooms, error } = await supabase
    .from('chat_rooms')
    .select(`
      id,
      created_at,
      product:products (
        id,
        title,
        price,
        images,
        status
      ),
      buyer:profiles!chat_rooms_buyer_id_fkey (
        id,
        name
      ),
      seller:profiles!chat_rooms_seller_id_fkey (
        id,
        name
      ),
      messages:chat_messages (
        content,
        created_at
      )
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('채팅방 목록 조회 오류:', error)
    throw new Error('채팅방 목록을 불러올 수 없습니다.')
  }

  return chatRooms
}

/**
 * 특정 채팅방의 정보를 가져옵니다.
 */
export async function getChatRoom(chatRoomId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: chatRoom, error } = await supabase
    .from('chat_rooms')
    .select(`
      id,
      product_id,
      buyer_id,
      seller_id,
      created_at,
      product:products (
        id,
        title,
        price,
        images,
        status,
        seller_id
      ),
      buyer:profiles!chat_rooms_buyer_id_fkey (
        id,
        name
      ),
      seller:profiles!chat_rooms_seller_id_fkey (
        id,
        name
      )
    `)
    .eq('id', chatRoomId)
    .single()

  if (error) {
    console.error('채팅방 조회 오류:', error)
    return null
  }

  // 참여자 확인
  const isParticipant = user.id === chatRoom.buyer_id || user.id === chatRoom.seller_id

  if (!isParticipant) {
    throw new Error('채팅방에 참여할 권한이 없습니다.')
  }

  return chatRoom
}

/**
 * 채팅방의 모든 메시지를 가져옵니다.
 */
export async function getChatMessages(chatRoomId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: messages, error } = await supabase
    .from('chat_messages')
    .select(`
      id,
      content,
      created_at,
      sender:profiles!chat_messages_sender_id_fkey (
        id,
        name
      )
    `)
    .eq('chat_room_id', chatRoomId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('메시지 조회 오류:', error)
    throw new Error('메시지를 불러올 수 없습니다.')
  }

  return messages
}
