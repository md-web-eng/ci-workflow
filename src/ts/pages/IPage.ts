/**
 * Pageのインターフェース
 */
export interface IPage {
  init(): void;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  pageName: string;
}
