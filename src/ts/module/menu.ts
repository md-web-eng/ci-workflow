import ClassName from '@//ts/conf/className';
import EventName from '@//ts/conf/eventName';
import { AddClass, HasClass, RemoveClass } from '@//ts/utils/class';
/**
 * メニューのクラス
 * @class
 */
export default class Menu {
  private _top: HTMLElement;

  private _header: HTMLElement;

  private _menuBtn: HTMLElement;

  private _breakPointSp: number;

  constructor() {
    // class変数
    this._top = document.getElementById('data-top') as HTMLElement;
    this._header = document.getElementById('data-header') as HTMLElement;
    this._menuBtn = document.getElementById('data-menu-btn') as HTMLElement;
    this._breakPointSp = 750;
    // this.init();
  }

  public init = (): void => {
    // 以下共通で追加するEVENT
    this._addEvent();
    if (this._top) {
      window.onscroll = () => {
        this._checkScrollPos();
      };
      this._checkScrollPos();
    }
  };

  private _addEvent = (): void => {
    // 以下共通で追加するEVENT
    if (this._menuBtn) {
      this._menuBtn.addEventListener(EventName.CLICK, this._toggleMenu);
    }
  };

  // private removeEvent(): void {
  //   // 以下共通で削除するEVENT
  // }
  private _toggleMenu = (): void => {
    // 以下共通で追加するEVENT
    if (!HasClass(this._header, ClassName.OPEN)) {
      AddClass(this._header, ClassName.OPEN);
    } else {
      RemoveClass(this._header, ClassName.OPEN);
    }
  };

  private _checkScrollPos = (): void => {
    const concept: HTMLElement | null = document.getElementById('concept');
    const conceptPosY: number = concept
      ? window.pageYOffset + concept.getBoundingClientRect().top
      : 0;
    if (conceptPosY < window.scrollY) {
      AddClass(this._header, ClassName.VISIBLE);
    } else {
      RemoveClass(this._header, ClassName.VISIBLE);
      if (window.innerWidth > this._breakPointSp) {
        RemoveClass(this._header, ClassName.OPEN);
      }
    }
  };
}
