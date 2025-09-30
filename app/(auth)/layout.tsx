import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-orange-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 로고 */}
        <Link href="/" className="block mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">
              키위마켓
            </h1>
            <p className="text-sm text-muted-foreground">
              우리 동네 중고 거래, 배달까지!
            </p>
          </div>
        </Link>

        {/* 인증 폼 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {children}
        </div>

        {/* 하단 링크 */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
