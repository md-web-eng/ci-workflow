import type { IPage } from '@//ts/pages/IPage';

/**
 * Defaultページのクラス
 */
export class DefaultPage implements IPage {
  public pageName: string;

  constructor() {
    this.pageName = 'Default';
  }

  /**
   * 初期化
   */
  public init = (): void => {
    console.log('>>DefaultPage >init');
  };
}
