'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3DD598]/10 to-background flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          {/* 404 큰 숫자 */}
          <div className="mb-4">
            <h1 className="text-8xl font-bold text-[#3DD598] mb-2">404</h1>
            <div className="text-6xl mb-4">🥝</div>
          </div>
          <CardTitle className="text-3xl">페이지를 찾을 수 없습니다</CardTitle>
          <CardDescription className="text-lg mt-2">
            요청하신 페이지가 존재하지 않거나 삭제되었습니다.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="bg-muted rounded-lg p-6 mb-6">
            <p className="text-sm text-muted-foreground mb-3">
              다음과 같은 이유로 이 페이지가 표시될 수 있습니다:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-[#FF8A00]">•</span>
                <span>입력하신 주소가 정확하지 않습니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF8A00]">•</span>
                <span>페이지가 삭제되었거나 이동되었습니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF8A00]">•</span>
                <span>일시적인 오류가 발생했습니다</span>
              </li>
            </ul>
          </div>

          {/* 액션 버튼들 */}
          <div className="grid gap-3 sm:grid-cols-3">
            <Link href="/" className="w-full">
              <Button variant="default" className="w-full bg-[#3DD598] hover:bg-[#3DD598]/90">
                <Home className="mr-2 h-4 w-4" />
                홈으로
              </Button>
            </Link>
            
            <Link href="/products" className="w-full">
              <Button variant="outline" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                상품 둘러보기
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              이전 페이지
            </Button>
          </div>

          {/* 추가 도움말 */}
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground mb-3">
              도움이 필요하신가요?
            </p>
            <div className="flex gap-3 justify-center text-sm">
              <Link href="/terms" className="text-[#3DD598] hover:underline">
                이용약관
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/privacy" className="text-[#3DD598] hover:underline">
                개인정보처리방침
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

