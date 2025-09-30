import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* 헤더 */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Next.js 15 + shadcn/ui
          </h1>
          <p className="text-muted-foreground text-lg">
            Next.js 15, React 19, TypeScript, Tailwind CSS v4 와 shadcn/ui로
            구성된 프로젝트입니다
          </p>
        </div>

        {/* 버튼 예제 */}
        <Card>
          <CardHeader>
            <CardTitle>버튼 컴포넌트</CardTitle>
            <CardDescription>
              다양한 버튼 스타일을 사용할 수 있습니다
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button>기본 버튼</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </CardContent>
        </Card>

        {/* 버튼 사이즈 예제 */}
        <Card>
          <CardHeader>
            <CardTitle>버튼 크기</CardTitle>
            <CardDescription>
              버튼의 다양한 크기를 선택할 수 있습니다
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center flex-wrap gap-4">
            <Button size="sm">작은 버튼</Button>
            <Button size="default">기본 버튼</Button>
            <Button size="lg">큰 버튼</Button>
          </CardContent>
        </Card>

        {/* 카드 그리드 예제 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>프로젝트 1</CardTitle>
              <CardDescription>shadcn/ui 카드 예제</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                이 카드는 shadcn/ui의 Card 컴포넌트를 사용하여 만들어졌습니다.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                자세히 보기
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>프로젝트 2</CardTitle>
              <CardDescription>반응형 디자인</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                그리드 레이아웃으로 화면 크기에 따라 자동으로 조정됩니다.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                자세히 보기
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>프로젝트 3</CardTitle>
              <CardDescription>Tailwind CSS v4</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                최신 Tailwind CSS PostCSS 버전을 사용하고 있습니다.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                자세히 보기
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* 정보 카드 */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>🎉 모든 준비가 완료되었습니다!</CardTitle>
            <CardDescription>
              이제 shadcn/ui 컴포넌트를 자유롭게 사용할 수 있습니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <strong>컴포넌트 추가하기:</strong>
            </p>
            <code className="block bg-muted p-3 rounded text-sm">
              npx shadcn@latest add [component-name]
            </code>
            <p className="text-sm text-muted-foreground mt-4">
              예: npx shadcn@latest add input dialog select
            </p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button asChild>
              <a
                href="https://ui.shadcn.com/docs/components"
                target="_blank"
                rel="noopener noreferrer"
              >
                컴포넌트 문서
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                Next.js 문서
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}