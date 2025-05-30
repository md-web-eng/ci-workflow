import EventName from '@//ts/conf/eventName';
import { DefaultPage } from '@//ts/pages/DefaultPage';
import { TopPage } from '@//ts/pages/TopPage';

import type { IPage } from '@//ts/pages/IPage';

import '../sass/style.scss';

/**
 * 実行ファイル
 */
class AppMain {
  public page: IPage;

  /**
   * コンストラクタ
   */
  constructor() {
    console.log(
      '#main >AppMain >new | VITE_API_KEY',
      import.meta.env.VITE_PUBLIC_APP_VERSION
    );
    console.log(
      '#main >AppMain >new | VITE_APP_ENV:',
      import.meta.env.VITE_APP_ENV
    );
    const page: string = document.body.dataset.page as string;
    switch (page) {
      case 'top':
        this.page = new TopPage();
        break;
      default:
        this.page = new DefaultPage();
    }
  }
}

(() => {
  let app: AppMain;
  const prepare = async (): Promise<void> => Promise.resolve();

  prepare().then(() => {
    console.log('#main | App-v1.0.0@231010');
    app = new AppMain();
    console.log('#main | app.page.pageName', app.page.pageName);
    app.page.init();
  });
  window.addEventListener(EventName.DOM_CONTENT_LOADED, () => {
    console.log('window | DOMContentLoaded');
  });
  window.addEventListener(EventName.LOAD, () => {
    console.log('window | Load');
  });
})();
