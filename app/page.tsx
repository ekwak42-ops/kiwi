import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, MessageCircle, Truck } from "lucide-react";

export default function Home() {
  // 임시 상품 데이터 (추후 실제 DB에서 가져옴)
  const featuredProducts = [
    {
      id: "1",
      title: "아이폰 14 Pro",
      price: 850000,
      location: "강남구",
      image: "https://placehold.co/400x300?text=Product+1",
      status: "available",
    },
    {
      id: "2",
      title: "맥북 에어 M2",
      price: 1200000,
      location: "서초구",
      image: "https://placehold.co/400x300?text=Product+2",
      status: "available",
    },
    {
      id: "3",
      title: "에어팟 프로 2세대",
      price: 180000,
      location: "송파구",
      image: "https://placehold.co/400x300?text=Product+3",
      status: "reserved",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#3DD598]/10 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            만나지 않고 배달로 거래하는
            <br />
            <span className="text-[#3DD598]">우리 동네 키위마켓</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            대면 거래의 번거로움은 이제 그만! 
            우리 동네에서 안전하고 편리하게 중고 거래를 시작해보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-lg"
              asChild
            >
              <Link href="/products">상품 둘러보기</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg"
              asChild
            >
              <Link href="/sell">판매하기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#F5F7FA]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            키위마켓의 특별함
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-none shadow-sm">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-[#3DD598]/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-[#3DD598]" />
                </div>
                <CardTitle className="text-lg">지역 기반 거래</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  같은 동네에서만 거래하여 빠르고 안전하게
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-sm">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-[#FF8A00]/10 rounded-full flex items-center justify-center mb-4">
                  <Truck className="w-6 h-6 text-[#FF8A00]" />
                </div>
                <CardTitle className="text-lg">배달 서비스</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  만나지 않고도 배달로 안전하게 거래 완료
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-sm">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-[#3DD598]/10 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-[#3DD598]" />
                </div>
                <CardTitle className="text-lg">실시간 채팅</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  판매자와 즉시 소통하여 빠른 거래
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-sm">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-[#FF8A00]/10 rounded-full flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-[#FF8A00]" />
                </div>
                <CardTitle className="text-lg">상태 확인</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  상하좌우 사진으로 정확한 물품 상태 확인
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              방금 올라온 신선한 상품 🥝
            </h2>
            <Button variant="ghost" asChild>
              <Link href="/products">전체보기</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="relative h-64">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                  {product.status === "reserved" && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge variant="secondary" className="bg-gray-900/80 text-white">
                        예약중
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{product.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-sm">
                    <MapPin className="w-3 h-3" />
                    {product.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#FF8A00]">
                    {product.price.toLocaleString()}원
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/products/${product.id}`}>
                      자세히 보기
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#3DD598] to-[#2AB87D]">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            지금 바로 키위마켓에서 거래를 시작하세요!
          </h2>
          <p className="text-lg mb-8 opacity-90">
            회원가입하고 우리 동네 중고 거래의 새로운 경험을 만나보세요
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-[#3DD598] hover:bg-white/90 text-lg"
            asChild
          >
            <Link href="/signup">회원가입하기</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}