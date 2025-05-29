export const rclass: RegExp = /[\t\r\n\f]/g;
/**
 *  クラス名追加
 *  @param tgt HTMLElement
 *  @param name クラス名
 */
export const AddClass = (tgt: HTMLElement, name: string): boolean => {
  if (!tgt) {
    return false;
  }
  const target = tgt;
  const src = ` ${target.className.replace(rclass, ' ')} `;
  if (src.indexOf(` ${name} `) >= 0) {
    return false;
  }
  target.className += ` ${name}`;

  return true;
};

/**
 *  クラス名削除
 *  @param tgt HTMLElement
 *  @param name クラス名
 */
export const RemoveClass = (tgt: HTMLElement, name: string): boolean => {
  if (!tgt) {
    return false;
  }
  const target = tgt;
  const src = ` ${target.className.replace(rclass, ' ')} `;
  const dst = src.replace(` ${name} `, ' ');
  target.className = dst.replace(/^\s+/, '').replace(/\s+$/, '');
  return src !== dst;
};

/**
 *  クラス名有無チェック
 *  @param tgt HTMLElement
 *  @param name クラス名
 */
export const HasClass = (tgt: HTMLElement, name: string): boolean => {
  if (!tgt) {
    return false;
  }
  const className = ` ${name} `;
  if (` ${tgt.className} `.replace(rclass, ' ').indexOf(className) >= 0) {
    return true;
  }
  return false;
};
