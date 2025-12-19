/**
 * HTML 엘리먼트를 일반 텍스트로 변환
 * @param htmlElement - 변환할 HTML 엘리먼트
 * @returns 변환된 텍스트
 */
export const convertHtmlToText = (htmlElement: HTMLElement): string => {
  const clone = htmlElement.cloneNode(true) as HTMLElement;

  // h1~h6 제목 앞뒤로 줄바꿈 추가
  clone.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((el) => {
    const br = document.createElement('br');
    el.parentNode?.insertBefore(br.cloneNode(), el);
    el.parentNode?.insertBefore(br.cloneNode(), el.nextSibling);
  });

  // div, p, li, tr 등 블록 요소 뒤에 줄바꿈 추가
  clone.querySelectorAll('div, p, li, tr').forEach((el) => {
    if (!['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName)) {
      const br = document.createElement('br');
      el.parentNode?.insertBefore(br.cloneNode(), el.nextSibling);
    }
  });

  // 텍스트 추출
  let text = clone.innerText || clone.textContent || '';

  // 연속된 빈 줄 제거
  text = text.replace(/\n\n+/g, '\n\n');

  // 맨 앞뒤 공백 제거
  text = text.trim();

  return text;
};
