import React from 'react';

export const TemplatePreview = ({ data }) => {
  return (
    <div className="max-w-[210mm] mx-auto bg-white p-10 font-sans text-sm leading-relaxed">
      <div className="text-center text-green-700 text-xs mb-5 font-medium">
        지속가능한 미래, 함께 누리는 환경, 탄소중립시대를 선도하는 글로벌
        환경전문기관
      </div>

      <h1 className="text-center text-lg font-bold my-8 border-t-2 border-b-2 border-black py-4">
        소액수의 견적제출 공고
      </h1>

      <div className="text-center text-sm mb-8">
        한국환경공단 입찰공고번호 : <strong>{data.noticeNumber}</strong>
      </div>

      <div className="border-2 border-black p-4 mb-8 text-center">
        <strong className="text-base">
          &lt; 본 계약은 청렴계약제가 적용됩니다 &gt;
        </strong>
      </div>
      <div className="border-[0.5mm] border-solid border-black p-2">
        <div className="mb-6 text-xs leading-7">
          <p className="indent-2 mb-2">
            이 계약은 「국가를 당사자로 하는 계약에 관한 법률」또는
            「지방자치단체를 당사자로 하는 계약에 관한 법률」에 따른
            청렴계약제가 적용됩니다. 입찰자는 반드시 입찰서 제출 시 아래
            청렴계약서에 관한 내용을 숙지·승낙하여야 하며, 동 내용을 위반한 경우
            발주기관의 조치에 대해서 어떠한 이의도 제기할 수 없습니다.
          </p>

          <p className="indent-2 mb-2">
            우리 공단은 입찰담합 방지 및 공정거래질서 확립을 위해 「독점규제 및
            공정거래에 관한 법률」에 따라 입찰담합징후분석시스템에 입찰정보를
            제공하고 있습니다. 입찰담 합징후 발견 시 공정거래위원회 제보 및 경찰
            조사의뢰 등을 검토·시행하고 있으며, 입찰담합으로 판명시 부정당업자
            제재(입찰참가자격제한) 처분 및 손해배상청구소송 제소 등 법적
            제재조치를 시행하고 있습니다.
          </p>

          <p className="indent-2 mb-2">
            「국가를 당사자로 하는 계약에 관한 법률」 또는 「지방자치단체를
            당사자로 하는 계약에 관한 법률」에 따라 본 입찰에 참여한 당사
            대리인과 임직원은 입찰·낙찰, 계약 체결 및 이행, 감독, 검사 등의
            과정(준공·납품 이후를 포함한다)에서 아래 각호의 청렴계약 조건을
            준수할 것이며, 이를 위반한 때에는 입찰·낙찰을 취소하거나 계약을
            해제·해지하는 등의 불이익을 감수하고, 이에 민·형사상 이의를 제기하지
            않을 것임을 약정합니다.
          </p>

          <ol className="pl-8 mb-2 list-decimal">
            <li className="mb-2">
              금품․향응 등(친인척 등에 대한 부정한 취업 제공 포함)을 요구 또는
              약속하거나 수수(授受)하지 않을 것이며, 관계공무원에게 금품, 향응
              등을 제공한 경우에는 「국가를 당사자로 하는 계약에 관한
              법률」제27조 제1항 제7호 또는 「지방자치단체를 당사자로 하는
              계약에 관한 법률」제31조 제1항 제7호에 따른 부정당업자의 입찰
              참가자격 제한 처분을 받겠습니다.
            </li>
            <li className="mb-2">
              입찰가격의 사전 협의 또는 특정인의 낙찰을 위한 담합 등 공정한
              경쟁을 방해하는 행위시에는 「국가를 당사자로 하는 계약에 관한 법률
              」제27조 제1항 제2호 또는 「지방자치단체를 당사자로 하는 계약에
              관한 법률」 제31조 제1항 제2호에 따른 부정당업자 입찰참가자격 제한
              처분을 받겠습니다.
            </li>
            <li className="mb-2">
              공정한 직무수행을 방해하는 알선‧청탁을 통하여 입찰 또는 계약과
              관련된 특정 정보의 제공을 요구하거나 받는 행위를 하지 않겠습니다.
            </li>
            <li className="mb-2">
              「국가를 당사자로 하는 계약에 관한 법률 시행령」 제4조의2 제1항
              제2호 위반 시에 아래의 손해배상액을 납부토록 하겠습니다.
              <div className="ml-5 mt-1">
                - 입찰자 : 입찰금액의 100분의 5<br />- 계약상대자 : 계약금액의
                100분의 10
              </div>
            </li>
          </ol>
        </div>
      </div>

      <div className="border-t border-gray-300 my-10 pt-8">
        <div className="text-center text-green-700 text-xs mb-8 font-medium">
          지속가능한 미래, 함께 누리는 환경, 탄소중립시대를 선도하는 글로벌
          환경전문기관
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-base font-bold mb-4">
          1. 견적(입찰)에 부치는 사항
        </h2>
        <div className="pl-5 text-sm space-y-2">
          <p>
            가. 공 고 명 : <strong>{data.title}</strong>
          </p>
          <p>나. 계약기간 : {data.contractPeriod}</p>
          <p>
            다. 예 산 액 : <strong>{data.amount}</strong>
          </p>
          <p>
            라. 구매범위 : 물품규격서 등 참조(문의 ☎{data.contactPhone},{' '}
            {data.contactName})
          </p>
          <p>
            마. 전자입찰서 제출기간 : {data.bidSubmitStart} ～{' '}
            {data.bidSubmitEnd}
          </p>
          <p>
            바. 개찰일시 및 장소 : {data.bidOpenTime},
            국가종합전자조달시스템(나라장터)
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-base font-bold mb-4">2. 견적(입찰) 및 계약방식</h2>
        <div className="pl-5 text-sm space-y-2">
          <p>가. 소액수의(총액, 전자)대상 용역입니다.</p>
          <p>나. 적격심사 제외대상입니다.</p>
          <p>다. 청렴계약이행 서약제 대상입니다.</p>
          <p>
            라. 입찰서는 반드시 국가종합전자조달시스템(www.g2b.go.kr)의
            전자입찰특별유의서에 따라 제출하여야 합니다.
          </p>

          <div className=" p-3 my-2   ">
            <p className="mb-2">
              ※ 입찰 전 납품규격, 납품가능 금액, 납품가능 여부 등을 반드시
              확인하시기를 바라며, 이에 대한 검토 없이 무리하게 저가 입찰한
              책임은 입찰참가자에게 있음을 알려드립니다.
            </p>
            <p className="mb-0">
              ※ 기타 세부사항은 전자입찰 공고서에 첨부된 규격서(시방서),
              과업내용서 등을 반드시 확인하신 후 과업이행에 필요한 총금액을
              산출하여 투찰하시기 바랍니다.
            </p>
          </div>

          <p>
            마. 입찰금액은 반드시 부가가치세를 포함한 금액으로 제출하여야 하며
            비영리법인 등 부가가치세 면제대상인 경우 견적금액에서 부가가치세를
            차감한 금액을 계약금액으로 결정합니다.
          </p>
          <p>
            바. 정부입찰·계약집행기준 제10조의2 제2항제7호에 따라 전자입찰서
            제출 후 정당한 이유없이 계약에 응하지 아니하거나 포기서를 제출하는
            경우에는 나라장터 전자조달시스템에 수의계약배제업체로 등록되며,
            등록일로부터 3개월간 공단과의 소액수의 계약이 제한됩니다.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-base font-bold mb-4">
          3. 입찰참가자격: 아래의 입찰참가자격을 모두 갖춘 자이어야 합니다.
        </h2>
        <div className="pl-5 text-sm space-y-2">
          <p className="mb-3">
            가. 국가종합전자조달시스템 입찰참가자격등록규정에 따라 반드시
            전자입찰서 제출 마감일 전일까지 나라장터(G2B)시스템에 아래의 사항을
            모두 입찰참가자격으로 등록한 자
          </p>

          <div className=" p-3 my-3 ml-5 ">
            <p className="mb-0">
              ❍ 중소기업제품 구매촉진 및 판로지원에 관한법률 제9조 및 동법
              시행규칙 제5조 규정에 의한 직접생산확인증명서[세부품명번호:{' '}
              {data.productName}({data.productCode})](개찰일 전일까지 발급된
              것으로 유효기간 내에 있어야 함)를 소지한 자
            </p>
          </div>

          <p>
            나. 「국가를 당사자로 하는 계약에 관한 법률」 제27조(부정당업자의
            입찰참가 자격제한)에 해당되지 아니한 업체
          </p>
          <p>
            다. 「국가를 당사자로 하는 계약에 관한 법률」 제27조의5 및 같은 법
            시행령 제12조제3항에 따라 조세포탈 등을 한 자로서 유죄판결이 확정된
            날부터 2년이 지나지 아니한 자는 입찰에 참여할 수 없습니다.
          </p>
          <p>
            라. 「중소기업기본법」 제2조에 따른 소기업 또는 「소상공인 보호 및
            지원에 관한 법률」 제2조에 따른 소상공인으로서
            소기업·소상공인확인서를 소지한 업체이어야 합니다.
          </p>

          <div className=" p-3 my-2 ">
            <p className="mb-2">
              ※ 직접생산확인증명서, 소기업․소상공인확인서는 중소기업공공구매
              종합정보망에서 확인하며 확인되지 않을 경우 입찰참가자격이
              없습니다.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-base font-bold mb-4">4. 공동계약</h2>
        <div className="pl-5 text-sm space-y-2">
          <p>
            가. 단독 또는 공동이행방식으로만 입찰참여가 가능하며, 공동수급체
            구성원은 각각 본 입찰에서 요구하는 입찰참가자격을 모두 갖추어야
            합니다.
          </p>
          <p>
            나. 공동수급체 구성원은 대표사가 참여 지분율이 가장 많아야 하고,
            대표사를 포함하여 5개사 이하로 구성하여야 하며, 구성원별 계약참여
            최소 지분율은 10% 이상으로 하여야 합니다.
          </p>
          <p>
            다. 공동수급협정서 제출기한: {data.consortiumDeadline}, ※해당자에
            한함, 나라장터 전자 제출
          </p>
        </div>
      </div>

      <div className="border-t border-gray-300 my-10 pt-8">
        <div className="text-center text-green-700 text-xs mb-8 font-medium">
          지속가능한 미래, 함께 누리는 환경, 탄소중립시대를 선도하는 글로벌
          환경전문기관
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-base font-bold mb-4">
          5. 예정가격 및 낙찰자 결정방법
        </h2>
        <div className="pl-5 text-sm space-y-2">
          <p>
            가. 예정가격은 예비가격기초금액기준 ±2% 범위내에서 작성된 15개 복수
            예비가격 중 입찰에 참여하는 각 업체가 추첨한 번호 중 가장 많이
            선택된 4개의 예비가격을 산술평균한 가격으로 결정됩니다.
          </p>
          <p>
            나. 낙찰자 선정은 예정가격의 88%이상으로 견적서를 제출한 자 중
            최저가격으로 견적서를 제출한 자를 계약상대자로 결정합니다.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-base font-bold mb-4">
          6. 청렴계약이행 서약서 제출
        </h2>
        <div className="pl-5 text-sm space-y-2">
          <p>
            가. 입찰에 참여한 자는 모두 청렴계약이행을 위한 공정경쟁 및 청렴계약
            입찰특별유의서 제3조에 의거 청렴계약이행서약서를 제출한 것으로
            갈음합니다.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-base font-bold mb-4">
          10. 기타사항 및 추가정보 제공처
        </h2>
        <div className="pl-5 text-sm space-y-2">
          <p className="font-bold mt-4">라. 기타 문의사항</p>
          <div className="ml-5 space-y-1">
            <p>
              ○ 전자입찰이용안내 : 국가종합전자조달시스템 콜센터(☎1588-0800)
            </p>
            <p>
              ○ 물품 규격 등 관련사항 - 국민소통실(☎ {data.contactPhone}, 담당 :{' '}
              {data.contactName})
            </p>
            <p>
              ○ 입찰․계약 관련사항 : 경영지원처 계약부(☎ {data.contractPhone},
              담당 : {data.contractName})
            </p>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-black pt-6 mt-12">
        <div className="bg-gray-50 p-4 border border-gray-300">
          <h3 className="font-bold mb-2">이의제기 및 신고채널 안내</h3>
          <p className="text-xs mb-2">
            ◎ 본 입찰과 관련한 부당행위 또는 부당사례 등과 공단 직원이 금품 및
            향응요구, 지위남용 등 부당한 요구를 할 경우 아래 신고채널을 통해
            신고할 수 있으며, 신고에 따른 일체의 불이익은 없습니다.
          </p>
          <div className="text-xs ml-4">
            <p>
              - K-eco 신문고 : 공단홈페이지(www.keco.or.kr) &gt; 국민참여 &gt;
              K-eco신문고
            </p>
            <p>- 부패신고센터 : 전화 032-590-3072 FAX 032-590-3069</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <p className="mb-4">위와 같이 공고합니다.</p>
        <p className="text-base font-bold mb-2">2025년 8월 일</p>
        <p className="text-lg font-bold">{data.orgName} 계약담당</p>
      </div>
    </div>
  );
};
