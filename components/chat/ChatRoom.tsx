'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface Message {
  id: string
  content: string
  created_at: string | null
  sender: {
    id: string
    name: string
  }
}

interface ChatRoomProps {
  chatRoomId: string
  currentUserId: string
  initialMessages: Message[]
}

export function ChatRoom({ chatRoomId, currentUserId, initialMessages }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const channelRef = useRef<RealtimeChannel | null>(null)

  // 스크롤을 맨 아래로
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Realtime 구독
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${chatRoomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        async (payload) => {
          // 새 메시지가 들어오면 sender 정보를 가져와서 추가
          const { data: message } = await supabase
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
            .eq('id', payload.new.id)
            .single()

          if (message) {
            setMessages((prev) => [...prev, message as Message])
          }
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatRoomId, supabase])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || sending) return

    setSending(true)

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          chat_room_id: chatRoomId,
          sender_id: currentUserId,
          content: newMessage.trim(),
        })

      if (error) throw error

      setNewMessage('')
    } catch (error) {
      console.error('메시지 전송 오류:', error)
      alert('메시지 전송에 실패했습니다.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>아직 메시지가 없습니다.</p>
            <p className="text-sm mt-1">첫 메시지를 보내보세요!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.sender.id === currentUserId

            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] ${
                    isCurrentUser ? 'items-end' : 'items-start'
                  } space-y-1`}
                >
                  {!isCurrentUser && (
                    <p className="text-xs text-muted-foreground px-3">
                      {message.sender.name}
                    </p>
                  )}
                  <Card
                    className={`p-3 ${
                      isCurrentUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </Card>
                {message.created_at && (
                  <p className="text-xs text-muted-foreground px-3">
                    {new Date(message.created_at).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 */}
      <form onSubmit={handleSend} className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            disabled={sending}
            maxLength={1000}
          />
          <Button type="submit" disabled={!newMessage.trim() || sending}>
            {sending ? '전송 중...' : '전송'}
          </Button>
        </div>
      </form>
    </div>
  )
}
