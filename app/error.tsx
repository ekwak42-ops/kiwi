'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, RefreshCcw, AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 에러를 콘솔에 로깅
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-background flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full border-red-200">
        <CardHeader className="text-center">
          {/* 에러 아이콘 */}
          <div className="mb-4 flex justify-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
          </div>
          
          <CardTitle className="text-3xl text-red-700">
            문제가 발생했습니다
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* 에러 상세 정보 (개발 환경에서만 표시) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-red-800 mb-2">
                개발 모드 에러 정보:
              </p>
              <p className="text-xs text-red-700 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* 도움말 */}
          <div className="bg-muted rounded-lg p-6 mb-6">
            <p className="text-sm text-muted-foreground mb-3">
              다음 방법을 시도해보세요:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-[#FF8A00]">•</span>
                <span>페이지를 새로고침해보세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF8A00]">•</span>
                <span>브라우저의 캐시를 삭제해보세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF8A00]">•</span>
                <span>잠시 후 다시 시도해보세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF8A00]">•</span>
                <span>문제가 계속되면 고객센터에 문의해주세요</span>
              </li>
            </ul>
          </div>

          {/* 액션 버튼들 */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              onClick={reset}
              className="w-full bg-[#3DD598] hover:bg-[#3DD598]/90"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              다시 시도
            </Button>
            
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                홈으로 이동
              </Button>
            </Link>
          </div>

          {/* 추가 링크 */}
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground mb-3">
              더 많은 도움이 필요하신가요?
            </p>
            <div className="flex gap-3 justify-center text-sm flex-wrap">
              <Link href="/products" className="text-[#3DD598] hover:underline">
                상품 둘러보기
              </Link>
              <span className="text-muted-foreground">•</span>
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

