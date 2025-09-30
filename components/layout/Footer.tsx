import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="bg-[#F5F7FA] mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 정보 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#3DD598]">키위마켓</h3>
            <p className="text-sm text-muted-foreground">
              만나지 않고 배달로 거래하는<br />
              우리 동네 중고 거래 플랫폼
            </p>
          </div>

          {/* 서비스 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">서비스</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-foreground transition-colors">
                  상품 둘러보기
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-foreground transition-colors">
                  상품 판매하기
                </Link>
              </li>
              <li>
                <Link href="/mypage/purchases" className="hover:text-foreground transition-colors">
                  구매 내역
                </Link>
              </li>
              <li>
                <Link href="/mypage/sales" className="hover:text-foreground transition-colors">
                  판매 내역
                </Link>
              </li>
            </ul>
          </div>

          {/* 고객 지원 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">고객 지원</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  공지사항
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* 정책 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">정책</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          <p>© 2025 키위마켓. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
