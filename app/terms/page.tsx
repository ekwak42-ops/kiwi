export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">이용약관</h1>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">제1조 (목적)</h2>
            <p className="text-muted-foreground leading-relaxed">
              본 약관은 키위마켓(이하 &ldquo;회사&rdquo;)이 제공하는 지역 기반 중고 거래 서비스(이하 &ldquo;서비스&rdquo;)의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">제2조 (정의)</h2>
            <p className="text-muted-foreground leading-relaxed">
              본 약관에서 사용하는 용어의 정의는 다음과 같습니다:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground mt-4">
              <li>&ldquo;서비스&rdquo;란 회사가 제공하는 지역 기반 중고 거래 플랫폼을 의미합니다.</li>
              <li>&ldquo;회원&rdquo;이란 본 약관에 동의하고 회사와 서비스 이용계약을 체결한 자를 의미합니다.</li>
              <li>&ldquo;상품&rdquo;이란 회원이 서비스를 통해 거래하고자 등록한 물품을 의미합니다.</li>
              <li>&ldquo;거래&rdquo;란 회원 간 상품의 매매를 의미합니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">제3조 (약관의 효력 및 변경)</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>본 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.</li>
              <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.</li>
              <li>변경된 약관은 제1항과 같은 방법으로 공지 또는 통지함으로써 효력이 발생합니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">제4조 (회원가입)</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>회원가입은 이용자가 약관의 내용에 동의하고, 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 회원가입 신청을 하고, 회사가 이를 승낙함으로써 체결됩니다.</li>
              <li>회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않을 수 있습니다:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                  <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                  <li>관계 법령에 위배되거나 사회의 안녕질서 또는 미풍양속을 저해할 수 있는 목적으로 신청한 경우</li>
                </ul>
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">제5조 (서비스의 제공 및 변경)</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>회사는 다음과 같은 서비스를 제공합니다:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>중고 물품 등록 및 거래 중개</li>
                  <li>회원 간 채팅 기능</li>
                  <li>배달 서비스 연동</li>
                  <li>기타 회사가 정하는 서비스</li>
                </ul>
              </li>
              <li>회사는 상당한 이유가 있는 경우 서비스의 내용을 변경할 수 있으며, 변경된 내용은 사전에 공지합니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">제6조 (개인정보보호)</h2>
            <p className="text-muted-foreground leading-relaxed">
              회사는 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 사용에 대해서는 관련 법령 및 회사의 개인정보처리방침이 적용됩니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">제7조 (회원의 의무)</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              회원은 다음 각 호의 행위를 하여서는 안 됩니다:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>신청 또는 변경 시 허위내용의 등록</li>
              <li>타인의 정보 도용</li>
              <li>회사가 게시한 정보의 변경</li>
              <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
              <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
              <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">부칙</h2>
            <p className="text-muted-foreground">
              본 약관은 2025년 9월 30일부터 시행됩니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
