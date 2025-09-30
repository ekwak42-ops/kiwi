import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChatRoom } from '@/components/chat/ChatRoom'
import Link from 'next/link'

interface ChatRoomPageProps {
  params: Promise<{ roomId: string }>
}

export default async function ChatRoomPage({ params }: ChatRoomPageProps) {
  const { roomId } = await params
  const supabase = await createClient()

  // 사용자 인증 확인
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 채팅방 정보 조회
  const { data: chatRoom, error: roomError } = await supabase
    .from('chat_rooms')
    .select(`
      id,
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
    .eq('id', roomId)
    .single()

  if (roomError || !chatRoom) {
    notFound()
  }

  // 참여자 확인
  const isParticipant = user.id === chatRoom.buyer_id || user.id === chatRoom.seller_id

  if (!isParticipant) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">접근 권한이 없습니다</h2>
          <p className="text-muted-foreground mt-2">이 채팅방에 참여할 수 없습니다.</p>
          <Link href="/chat" className="mt-4 inline-block">
            <Button>채팅 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    )
  }

  // 메시지 조회
  const { data: messages, error: messagesError } = await supabase
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
    .eq('chat_room_id', roomId)
    .order('created_at', { ascending: true })

  if (messagesError) {
    console.error('메시지 조회 오류:', messagesError)
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">메시지를 불러올 수 없습니다</h2>
          <p className="text-muted-foreground mt-2">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    )
  }

  const isBuyer = chatRoom.buyer_id === user.id
  const otherUser = isBuyer ? chatRoom.seller : chatRoom.buyer

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-4">
          <Link href="/chat">
            <Button variant="ghost" size="sm" className="mb-4">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              채팅 목록
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <CardTitle className="text-lg">{otherUser.name}</CardTitle>
                    <Link
                      href={`/products/${chatRoom.product.id}`}
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      {chatRoom.product.title} · {chatRoom.product.price.toLocaleString()}원
                    </Link>
                  </div>
                </div>
                <Badge variant={chatRoom.product.status === 'sold' ? 'secondary' : 'default'}>
                  {chatRoom.product.status === 'available' && '판매중'}
                  {chatRoom.product.status === 'reserved' && '예약중'}
                  {chatRoom.product.status === 'sold' && '판매완료'}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* 채팅 영역 */}
        <Card className="h-[600px] flex flex-col">
          <ChatRoom
            chatRoomId={roomId}
            currentUserId={user.id}
            initialMessages={messages || []}
          />
        </Card>

        {/* 상품 정보 */}
        <Link href={`/products/${chatRoom.product.id}`} className="block mt-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                  {chatRoom.product.images && chatRoom.product.images.length > 0 ? (
                    <img
                      src={chatRoom.product.images[0]}
                      alt={chatRoom.product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{chatRoom.product.title}</h3>
                  <p className="text-lg font-bold text-primary">
                    {chatRoom.product.price.toLocaleString()}원
                  </p>
                </div>
                <Button variant="outline">상품 보기</Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
