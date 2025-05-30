import Swiper from 'swiper';
import { Pagination, Navigation } from 'swiper/modules';

/**
 * カルーセルのクラス
 * @class
 */
export default class Carousel {
  private _swipers: Swiper[];

  constructor() {
    // class変数
    this._swipers = [];
    // this.init();
  }

  public init = (): void => {
    const option = {
      // モジュールを使う
      modules: [Navigation, Pagination],
      loop: true,
      slidesPerView: 1,
      speed: 1000,
      // autoplayとかpaginationとかが使えるようになる
      autoplay: {
        delay: 5000,
      },

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    };

    const swiper = new Swiper('.swiper', option);
    this._swipers.push(swiper);
  };
}
