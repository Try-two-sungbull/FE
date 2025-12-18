import { useQueryClient } from '@tanstack/react-query';
import { ExtractedData } from '@/types';

interface TemplatePreviewProps {
  data?: Record<string, any>;
  documentId?: string;
  onSave?: (data: ExtractedData) => void | Promise<void>;
}

/**
 * TemplatePreview에서 사용하는 데이터를 ExtractedData 형식으로 변환
 */
export const convertToExtractedData = (
  data: Record<string, any>
): ExtractedData => {
  return {
    title: data.projectName || '',
    noticeNumber: data.noticeNumber || '',
    amount: data.estimated_amount || '0',
    period: data.contractPeriod || '',
    phone: data.contactPhone || '',
    manager: data.contactName || '',
    deadline: data.bidSubmitEnd || '',
    openingDate: data.bidOpenTime || '',
    department: data.orgName || '',
    description: data.productName || '',
    // 추가 필드들
    projectName: data.projectName || '',
    bidSubmitStart: data.bidSubmitStart || '',
    bidSubmitEnd: data.bidSubmitEnd || '',
    bidOpenTime: data.bidOpenTime || '',
    bidMethod: data.bidMethod || '',
    contractMethod: data.contractMethod || '',
    productName: data.productName || '',
    jointContract: data.jointContract || '',
    consortiumDeadline: data.consortiumDeadline || '',
    orgName: data.orgName || '',
    contactPhone: data.contactPhone || '',
    contactName: data.contactName || '',
    estimated_amount: data.estimated_amount || '',
    contractPeriod: data.contractPeriod || '',
  };
};

export const TemplatePreview = ({
  data: propData,
  documentId,
  onSave,
}: TemplatePreviewProps) => {
  const queryClient = useQueryClient();

  // documentId가 있으면 TanStack Query에서 해당 데이터 조회
  const cachedData = documentId
    ? queryClient.getQueryData(['uploadedTemplateData', documentId])
    : null;

  // documentId로 조회한 데이터 또는 propData 사용
  const rawData = (documentId ? cachedData : propData) as Record<
    string,
    any
  > | null;

  const sourceNode =
    rawData?.extractedData || rawData?.extracted_data || rawData;

  const data = sourceNode
    ? {
        ...sourceNode,
        noticeNumber:
          propData?.noticeNumber || sourceNode.noticeNumber || '2025-00123',
        projectName:
          propData?.projectName ||
          sourceNode.project_name ||
          sourceNode.projectName ||
          '',
        contractPeriod:
          propData?.contractPeriod ||
          (sourceNode.delivery_deadline_days
            ? `계약체결일로부터 ${sourceNode.delivery_deadline_days}일`
            : sourceNode.contractPeriod || ''),
        estimated_amount:
          propData?.estimated_amount ||
          (sourceNode.total_budget_vat
            ? new Intl.NumberFormat('ko-KR').format(sourceNode.total_budget_vat)
            : sourceNode.estimated_amount || '0'),
        contactPhone:
          propData?.contactPhone || sourceNode.contactPhone || '032-590-4000',
        contactName:
          propData?.contactName || sourceNode.contactName || '담당자',
        bidSubmitStart:
          propData?.bidSubmitStart ||
          sourceNode.schedule?.order_request ||
          sourceNode.bidSubmitStart ||
          '2025.11.01 10:00',
        bidSubmitEnd:
          propData?.bidSubmitEnd ||
          sourceNode.schedule?.expected_delivery ||
          sourceNode.bidSubmitEnd ||
          '2025.11.08 10:00',
        bidOpenTime:
          propData?.bidOpenTime || sourceNode.bidOpenTime || '2025.11.08 11:00',
        bidMethod:
          propData?.bidMethod ||
          (sourceNode.procurement_method_raw?.includes('소액수의') ||
          sourceNode.bidMethod === 'small'
            ? 'small'
            : 'general'),
        contractMethod:
          propData?.contractMethod ||
          (sourceNode.procurement_method_raw?.includes('제한경쟁') ||
          sourceNode.contractMethod === 'restricted'
            ? 'restricted'
            : 'general'),
        productName:
          propData?.productName ||
          sourceNode.item_name ||
          sourceNode.productName ||
          '',
        detail_item_codes: sourceNode.detail_item_codes ||
          sourceNode.detailItemCodes || [''],
        jointContract:
          propData?.jointContract ||
          (sourceNode.is_joint_contract || sourceNode.jointContract === 'yes'
            ? 'yes'
            : 'no'),
        consortiumDeadline:
          propData?.consortiumDeadline ||
          sourceNode.consortiumDeadline ||
          '2025.11.07 18:00',
        orgName:
          propData?.orgName ||
          sourceNode.requesting_department ||
          sourceNode.orgName ||
          '한국환경공단',
        noticeDate:
          propData?.noticeDate ||
          sourceNode.noticeDate ||
          (sourceNode.document_date
            ? sourceNode.document_date.includes('일')
              ? sourceNode.document_date
              : `${sourceNode.document_date} 00일`
            : '2025년 00월 00일'),
        goodsContactInfo:
          propData?.goodsContactInfo ||
          sourceNode.goodsContactInfo ||
          'oooo처 ooo부(☎ oooo-oooo-oooo, 담당 : oooo)',
        bidContactInfo:
          propData?.bidContactInfo ||
          sourceNode.bidContactInfo ||
          'oooo처 ooo부(☎ oooo-oooo-oooo, 담당 : oooo)',
      }
    : null;

  if (!data) {
    return (
      <div className="flex items-center justify-center p-10 text-muted-foreground">
        데이터가 없습니다.
      </div>
    );
  }
  return (
    <div className="max-w-[210mm] mx-auto bg-white p-10 font-sans text-sm leading-relaxed">
      <div className="text-center text-green-700 text-xs mb-5 font-medium">
        지속가능한 미래, 함께 누리는 환경, 탄소중립시대를 선도하는 글로벌
        환경전문기관
      </div>

      <h1 className="text-center text-lg font-bold my-8 border-t-2 border-b-2 border-black py-4">
        물품구매 입찰공고
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
          <div className="border-[0.5mm] border-solid border-black p-2">
            <p className="indent-2 mb-2 font-bold">
              이 계약은 「국가를 당사자로 하는 계약에 관한 법률」또는
              「지방자치단체를 당사자로 하는 계약에 관한 법률」에 따른
              청렴계약제가 적용됩니다. 입찰자는 반드시 입찰서 제출 시 아래
              청렴계약서에 관한 내용을 숙지·승낙하여야 하며, 동 내용을 위반한
              경우 발주기관의 조치에 대해서 어떠한 이의도 제기할 수 없습니다.
            </p>
          </div>

          <p className="indent-2 mb-2 mt-4">
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
            가. 공 고 명 :
            <strong>
              <span className="text-blue-600">{data.projectName}</span>
            </strong>
          </p>
          <p>
            나. 계약기간 :{' '}
            <span className="text-blue-600 font-bold">
              {data.delivery_deadline_days}일
            </span>
          </p>
          <p>
            다. 예 산 액 :
            <strong>
              <span className="text-blue-600">{data.estimated_amount}원</span>
            </strong>
          </p>
          <p>
            라. 구매범위 : 물품규격서 등 참조(문의 ☎{data.contactPhone},{' '}
            {data.contactName})
          </p>
          <p>
            마. 전자입찰서 제출기간 :{' '}
            <strong>
              <span className="text-blue-600">{data.bidSubmitStart}</span>
            </strong>{' '}
            ～{' '}
            <strong>
              <span className="text-blue-600">{data.bidSubmitEnd}</span>
            </strong>
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
          {data.bidMethod === 'small' ? (
            <>
              <p>
                <span className="text-blue-600 font-bold">
                  가. 소액수의(총액, 전자) 대상입니다.
                </span>
              </p>
              <p>
                <span className="text-blue-600 font-bold">
                  나. 적격심사 제외대상입니다.
                </span>{' '}
                [우리공단 물품구매 적격심사 세부기준{' '}
                <span className="text-blue-600 font-bold">
                  [별표3] 추정가격 고시금액 미만인 물품 제조 또는 구매입찰 적용]
                </span>
              </p>
            </>
          ) : (
            <>
              <p>
                <span className="text-blue-600 font-bold">
                  가.{' '}
                  {data.contractMethod === 'general' ? '일반경쟁' : '제한경쟁'}
                  (총액), 전자입찰대상 용역입니다.
                </span>
              </p>
              <p>
                <span className="text-blue-600 font-bold">
                  나. 적격심사 대상 용역입니다.
                </span>
              </p>
            </>
          )}
          <p>
            ※ 공단 물품구매 적격심사세부기준은 공단홈페이지
            (http://www.keco.or.kr/)"입찰정보 /집행기준 “ 참고
          </p>
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
              <span className="text-blue-600 font-bold">
                ❍ 중소기업제품 구매촉진 및 판로지원에 관한법률 제9조 및 동법
                시행규칙 제5조 규정에 의한 직접생산확인증명서[세부품명번호:{' '}
                {data.productName}({data.detail_item_codes[0]})]제조 또는
                공급물품으로 등록된 자
              </span>
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
            라. 「중소기업기본법」 제2조에 따른{' '}
            <span className="text-blue-600 font-bold">소기업</span> 또는
            「소상공인 보호 및 지원에 관한 법률」 제2조에 따른{' '}
            <span className="text-blue-600 font-bold">소상공인</span>으로서
            <span className="text-blue-600 font-bold">
              소기업·소상공인확인서
            </span>
            를 소지한 업체이어야 합니다.
          </p>

          <div className=" p-3 my-2 ">
            <p className="mb-2 font-bold">
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
          {data.jointContract === 'yes' ? (
            <>
              <p>
                가. 단독 또는 공동이행방식으로만 입찰참여가 가능하며, 공동수급체
                구성원은 각각 본 입찰에서 요구하는 입찰참가자격을 모두 갖추어야
                합니다.
              </p>
              <p>
                나. 공동수급체 구성원은 대표사가 참여 지분율이 가장 많아야 하고,
                대표사를 포함하여 5개사 이하로 구성하여야 하며, 구성원별
                계약참여 최소 지분율은 10% 이상으로 하여야 합니다.
              </p>
              <p>
                다. 공동수급협정서 제출기한: {data.consortiumDeadline},
                ※해당자에 한함, 나라장터 전자 제출
              </p>
            </>
          ) : (
            <p className="text-blue-600 font-bold">해당 없음</p>
          )}
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
              ○ 물품 규격 등 관련사항 -{' '}
              <span className="font-bold text-blue-600">
                oooo처 ooo부(☎ oooo-oooo-oooo, 담당 : oooo)
              </span>
            </p>
            <p>
              ○ 입찰․계약 관련사항 :{' '}
              <span className="font-bold text-blue-600">
                oooo처 ooo부(☎ oooo-oooo-oooo, 담당 : oooo)
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-12">
        <div className="bg-blue-100 p-4 border border-black">
          <h3 className="font-bold mb-2 text-center">
            이의제기 및 신고채널 안내
          </h3>
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
        <p className="text-base  mb-2 ml-[25rem]">{data.noticeDate}</p>
        <p className="text-xl font-bold">{data.orgName} 계약담당</p>
      </div>
    </div>
  );
};
