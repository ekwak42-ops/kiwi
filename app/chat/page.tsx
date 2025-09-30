import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default async function ChatListPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 채팅방 목록 조회
  const { data: chatRooms, error } = await supabase
    .from('chat_rooms')
    .select(`
      id,
      created_at,
      buyer_id,
      seller_id,
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
      )
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('채팅방 목록 조회 오류:', error)
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">채팅방을 불러올 수 없습니다</h2>
          <p className="text-muted-foreground mt-2">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    )
  }

  // 각 채팅방의 최근 메시지 가져오기
  const chatRoomsWithMessages = await Promise.all(
    (chatRooms || []).map(async (room) => {
      const { data: lastMessage } = await supabase
        .from('chat_messages')
        .select('content, created_at')
        .eq('chat_room_id', room.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      return {
        ...room,
        lastMessage,
      }
    })
  )

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">채팅</h1>

        {!chatRoomsWithMessages || chatRoomsWithMessages.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-muted-foreground mb-2">
                아직 채팅방이 없습니다
              </h2>
              <p className="text-muted-foreground mb-4">
                관심 있는 상품에서 판매자와 채팅을 시작해보세요
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                상품 둘러보기
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {chatRoomsWithMessages.map((room) => {
              const isBuyer = room.buyer_id === user.id
              const otherUser = isBuyer ? room.seller : room.buyer

              return (
                <Link key={room.id} href={`/chat/${room.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* 상품 이미지 */}
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                          {room.product.images && room.product.images.length > 0 ? (
                            <img
                              src={room.product.images[0]}
                              alt={room.product.title}
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

                        {/* 채팅 정보 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold truncate">
                              {otherUser.name}
                            </h3>
                            <Badge variant={room.product.status === 'sold' ? 'secondary' : 'default'}>
                              {room.product.status === 'available' && '판매중'}
                              {room.product.status === 'reserved' && '예약중'}
                              {room.product.status === 'sold' && '판매완료'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate mb-2">
                            {room.product.title} · {room.product.price.toLocaleString()}원
                          </p>
                          {room.lastMessage ? (
                            <>
                              <p className="text-sm text-muted-foreground truncate">
                                {room.lastMessage.content}
                              </p>
                              {room.lastMessage.created_at && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(room.lastMessage.created_at).toLocaleDateString('ko-KR')}
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              메시지를 보내보세요
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
