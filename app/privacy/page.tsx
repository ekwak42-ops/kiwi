export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">개인정보처리방침</h1>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. 개인정보의 처리 목적</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              키위마켓(이하 &ldquo;회사&rdquo;)은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
              <li>재화 또는 서비스 제공: 중고 거래 서비스 제공, 본인인증, 구매 및 요금 결제</li>
              <li>고충처리: 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. 개인정보의 처리 및 보유 기간</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold mb-2">회원 정보</h3>
                <ul className="list-disc list-inside ml-4">
                  <li>보유근거: 회원 가입 및 관리</li>
                  <li>보유기간: 회원 탈퇴 시까지</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">거래 정보</h3>
                <ul className="list-disc list-inside ml-4">
                  <li>보유근거: 전자상거래법</li>
                  <li>보유기간: 거래 완료 후 5년</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. 처리하는 개인정보의 항목</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              회사는 다음의 개인정보 항목을 처리하고 있습니다:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>필수항목: 이메일 주소, 이름, 지역 정보(구, 동)</li>
              <li>선택항목: 프로필 사진, 연락처</li>
              <li>자동 수집 항목: IP주소, 쿠키, 서비스 이용 기록</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. 개인정보의 제3자 제공</h2>
            <p className="text-muted-foreground leading-relaxed">
              회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground mt-4">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. 개인정보처리의 위탁</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              회사는 서비스 제공을 위해 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
            </p>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold mb-2">Supabase</h3>
                <ul className="list-disc list-inside ml-4">
                  <li>위탁업무: 회원정보 저장 및 관리, 인증 서비스</li>
                  <li>보유기간: 회원 탈퇴 시 또는 위탁계약 종료 시까지</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Vercel</h3>
                <ul className="list-disc list-inside ml-4">
                  <li>위탁업무: 웹 호스팅 서비스</li>
                  <li>보유기간: 서비스 제공 종료 시까지</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. 정보주체의 권리·의무 및 행사방법</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리정지 요구</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. 개인정보의 파기</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>파기 절차:</strong> 이용자의 개인정보는 목적 달성 후 별도의 DB로 옮겨져 내부 방침 및 관련 법령에 따라 일정기간 저장된 후 파기됩니다.</p>
              <p><strong>파기 방법:</strong> 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. 개인정보 보호책임자</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-muted-foreground">
                <strong>개인정보 보호책임자</strong><br />
                이메일: privacy@kiwimarket.com<br />
                전화번호: 02-1234-5678
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. 개인정보처리방침 변경</h2>
            <p className="text-muted-foreground leading-relaxed">
              이 개인정보처리방침은 2025년 9월 30일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>

          <section className="mb-8">
            <p className="text-muted-foreground">
              <strong>공고일자:</strong> 2025년 9월 30일<br />
              <strong>시행일자:</strong> 2025년 9월 30일
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
