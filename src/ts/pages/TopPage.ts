import Carousel from '@//ts/module/carousel';
import Menu from '@//ts/module/menu';
import Modal from '@//ts/module/modal';
import { AddClass, RemoveClass } from '@//ts/utils/class';

import type { IPage } from '@/ts/pages/IPage';

export class TopPage implements IPage {
  public pageName: string;

  private _top: HTMLElement;

  private _slider: HTMLElement;

  private _menu: Menu | null;

  private _modal: Modal | null;

  private _crousel: Carousel | null;

  constructor() {
    // class変数
    this.pageName = 'TopPage';
    this._top = document.getElementById('data-top') as HTMLElement;
    this._slider = document.getElementById('data-slider') as HTMLElement;

    this._menu = null;
    this._modal = null;
    this._crousel = null;

    this.init();
  }

  public init = (): void => {
    // 以下共通で追加するEVENT
    this.checkRatio();

    this._menu = new Menu();
    this._menu.init();
    this._modal = new Modal();
    this._modal.init();
    this._crousel = new Carousel();
    this._crousel.init();
  };

  public checkRatio = (): void => {
    const ww: number = window.innerWidth;
    const wh: number = window.innerHeight;
    const image: HTMLElement | null = this._slider
      ? this._slider.querySelector('.swiper-slide img')
      : null;
    const iw: number = image ? image.clientWidth : 0;
    const ih: number = image ? image.clientHeight : 0;
    if (ww / wh > iw / ih) {
      AddClass(this._top, 'is-beside');
      RemoveClass(this._top, 'is-vertical');
    } else {
      RemoveClass(this._top, 'is-beside');
      AddClass(this._top, 'is-vertical');
    }
  };
}
