/**
 *  index番号取得
 *  @param rgb string[]
 */
export const Rgb2hex = (rgb: string[]): string =>
  `#${rgb
    .map((value: string) => `0${Number(value).toString(16).slice(-2)}`)
    .join('')}`;
