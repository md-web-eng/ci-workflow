import ClassName from '@/ts/conf/className';
import EventName from '@/ts/conf/eventName';

interface Option {
  callback?: number | Function;
  duration?: number | Function;
  easing?: number | ((t: number, b: number, c: number, d: number) => number);
  offset?: number;
}

/**
 *  Elementスクロール
 *  @param elm HTMLElement
 *  @param tgt HTMLElement
 *  @param options Option
 */
export const ScrollElement = (
  elm: HTMLElement,
  tgt: HTMLElement,
  options: Option
): void => {
  if (!tgt) return;
  // Robert Penner's easeInOutQuad - http://robertpenner.com/easing/
  const easeInOutQuad = (
    t: number,
    b: number,
    c: number,
    d: number
  ): number => {
    let tt = t;
    tt /= d / 2;
    if (tt < 1) {
      return (c / 2) * tt * tt + b;
    }
    tt -= 1;
    return (-c / 2) * (tt * (tt - 2) - 1) + b;
  };
  const wrapper = elm;
  let start = 0;
  if (!Number.isNaN(wrapper.scrollTop) && wrapper.tagName !== 'BODY') {
    start = wrapper.scrollTop;
  } else if (!Number.isNaN(window.scrollY)) {
    start = window.scrollY;
  }
  const opt = {
    duration: options.duration || 500,
    offset: options.offset || 0,
    callback: options.callback,
    easing: options.easing || easeInOutQuad,
  };
  const distance: number =
    tgt.getBoundingClientRect().top -
    (wrapper.getBoundingClientRect().top < 0
      ? 0
      : wrapper.getBoundingClientRect().top) +
    opt.offset;
  const duration =
    typeof opt.duration === 'function' ? opt.duration(distance) : opt.duration;
  let timeStart: number;
  let timeElapsed: number;
  const end = (): void => {
    wrapper.scrollTop = start + distance;
    if (typeof opt.callback === 'function') {
      opt.callback();
    }
  };
  const loop = (time: number): void => {
    timeElapsed = time - timeStart;
    if (typeof opt.easing === 'function') {
      if (wrapper.tagName === 'BODY') {
        window.scrollTo(0, opt.easing(timeElapsed, start, distance, duration));
      } else {
        wrapper.scrollTop = opt.easing(timeElapsed, start, distance, duration);
      }
    } else if (wrapper.tagName === 'BODY') {
      window.scrollTo(0, start + distance);
    } else {
      wrapper.scrollTop = start + distance;
    }
    if (timeElapsed < duration) {
      requestAnimationFrame(loop);
    } else {
      end();
    }
  };

  requestAnimationFrame((time): void => {
    timeStart = time;
    loop(time);
  });
};

/**
 *  スムーススクロール
 *  @param e:Event - Event
 */
export const SmoothScroll = (e: Event): void => {
  const target: HTMLElement = e.target as HTMLElement;
  const href: string = target.getAttribute('href') as string;
  ScrollElement(
    document.body,
    document.getElementById(href.split('#')[1] as string) as HTMLElement,
    {
      offset: 0,
    }
  );
  e.preventDefault();
};

/**
 *  インナースムーズスクロール
 *  @param wrap: HTMLElement - スクロールする要素の親要素
 *  @param Triggers: NodeListOf<HTMLElement> - スクロールトリガーNodeList
 */
export const InnerSmoothScroll = (
  wrap: HTMLElement,
  Triggers: NodeListOf<HTMLElement>
): void => {
  Array.prototype.forEach.call(Triggers, (elm) => {
    elm.addEventListener(EventName.CLICK, (e: Event) => {
      e.preventDefault();
      Array.prototype.forEach.call(Triggers, (trigger) => {
        trigger.classList.remove(ClassName.ACTIVE);
      });
      (e.currentTarget as HTMLElement).classList.add(ClassName.ACTIVE);
      const href = (e.currentTarget as HTMLElement).getAttribute(
        'href'
      ) as string;
      const target = href.split('#')[1] as string;
      ScrollElement(wrap, document.getElementById(target) as HTMLElement, {});
    });
  });
};
