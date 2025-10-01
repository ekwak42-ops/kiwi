'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { askQuestion, type SearchResult } from '@/actions/support'

interface Message {
  type: 'user' | 'assistant'
  content: string
  sources?: SearchResult[]
}

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')

    // 사용자 메시지 추가
    setMessages((prev) => [...prev, { type: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      // AI 답변 요청
      const response = await askQuestion(userMessage)

      if (response.success && response.answer) {
        const assistantMessage: Message = {
          type: 'assistant',
          content: response.answer,
          sources: response.sources,
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        const errorMessage: Message = {
          type: 'assistant',
          content: response.error || '답변을 생성할 수 없습니다.',
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        type: 'assistant',
        content: '오류가 발생했습니다. 다시 시도해주세요.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">고객 지원</h1>
        <p className="text-gray-600">
          키위마켓 이용에 관한 궁금한 점을 물어보세요. AI가 답변해드립니다.
        </p>
      </div>

      {/* 메시지 목록 */}
      <div className="mb-6 space-y-4">
        {messages.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>무엇을 도와드릴까요?</CardTitle>
              <CardDescription>
                키위마켓 사용법, 거래 방법, 배달 서비스 등 궁금하신 내용을 질문해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 font-medium">예시 질문:</p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>상품은 어떻게 등록하나요?</li>
                  <li>배달은 어떻게 이용하나요?</li>
                  <li>안전한 거래를 위한 팁이 있나요?</li>
                  <li>채팅은 어떻게 시작하나요?</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {messages.map((message, idx) => (
          <Card key={idx} className={message.type === 'user' ? 'bg-blue-50' : ''}>
            <CardHeader>
              <CardTitle className="text-lg">
                {message.type === 'user' ? '질문' : 'AI 답변'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap">{message.content}</div>

              {/* 출처 정보 표시 */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-600 mb-2">참고한 정보:</p>
                  <div className="space-y-2">
                    {message.sources.map((source, sourceIdx) => (
                      <div
                        key={source.id}
                        className="text-sm bg-gray-50 p-3 rounded border"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500">
                            출처 {sourceIdx + 1}
                          </span>
                          <span className="text-xs text-gray-400">
                            (유사도: {(source.score * 100).toFixed(1)}%)
                          </span>
                        </div>
                        {source.question && (
                          <p className="font-medium text-gray-700">{source.question}</p>
                        )}
                        {source.answer && (
                          <p className="text-gray-600 mt-1">{source.answer}</p>
                        )}
                        {source.content && !source.question && (
                          <p className="text-gray-600">{source.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {isLoading && (
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                <p className="text-gray-600">답변을 생성하고 있습니다...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 질문 입력 폼 */}
      <Card className="sticky bottom-4">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="질문을 입력하세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              maxLength={500}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              질문하기
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            {input.length}/500 · Enter를 눌러 질문하세요
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

