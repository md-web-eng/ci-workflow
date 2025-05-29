/**
 *  index番号取得
 *  @param el HTMLElement
 *  @param elms NodeListOf<HTMLElement>
 */
export const Index = (
  el: HTMLElement,
  elms: NodeListOf<HTMLElement>
): number => {
  if (!el || !elms) {
    return 0;
  }
  let num = 0;
  for (let i = 0; i < elms.length; i += 1) {
    if (el === elms[i]) {
      num = i;
      break;
    }
  }
  return num;
};
