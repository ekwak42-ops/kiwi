'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Search, User } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-[#3DD598]">
              키위마켓
            </div>
          </Link>

          {/* 우리 동네 설정 */}
          <button className="flex items-center gap-2 text-sm hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
            <MapPin className="h-4 w-4" />
            <span className="font-medium">강남구</span>
          </button>

          {/* 검색창 */}
          <div className="flex-1 max-w-md hidden md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="상품 검색"
                className="pl-10"
              />
            </div>
          </div>

          {/* 판매하기 버튼 */}
          <Button className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 hidden sm:flex">
            판매하기
          </Button>

          {/* 로그인 버튼 */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <User className="h-5 w-5" />
          </Button>

          {/* 모바일용 메뉴 버튼 */}
          <div className="flex sm:hidden gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* 모바일 검색창 */}
        <div className="mt-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="상품 검색"
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
