import {
  CASE_STATE,
  LANGUAGE,
  CLASS,
  KEY_CODE,
  KEY_CHAR,
  STATE_DEPENDED_KEYS,
} from './helper';

import { toggleHiddenState, printChar, removeHiddenClass } from './utils';

import DATA from './rows';

export default class Keyboard {
  constructor() {
    this.element = null;
    this.textarea = null;

    this.state = {
      isShiftLeftPressed: false,
      isShiftRightPressed: false,
      isCapsLockPressed: false,
      case: CASE_STATE.INITIAL,
      lang: LANGUAGE.ENGLISH,
    };

    this.current = {
      element: null,
      code: null,
      event: null,
      char: null,
    };

    this.previous = {
      element: null,
      code: null,
      event: null,
      char: null,
    };
  }

  addActiveState() {
    this.current.element.classList.add(CLASS.ACTIVE);
  }

  removeActiveState() {
    if (!this.current.element) return;
    if (this.previous.element && this.previous.element.classList.contains(CLASS.ACTIVE)) {
      if (!STATE_DEPENDED_KEYS.includes(this.previous.code)) {
        this.previous.element.classList.remove(CLASS.ACTIVE);
      }
    }
    this.current.element.classList.remove(CLASS.ACTIVE);
  }

  toggleCase() {
    const langSpans = this.element.querySelectorAll(`div > .${this.state.lang}`);
    langSpans.forEach((langSpan) => {
      langSpan.querySelectorAll('span').forEach((span) => {
        if (!span.classList.contains(CLASS.HIDDEN)) span.classList.add(CLASS.HIDDEN);
      });

      if ((this.state.isShiftLeftPressed || this.state.isShiftRightPressed)
        && this.state.isCapsLockPressed) {
        removeHiddenClass(langSpan.querySelectorAll('span')[3]);
        this.state.case = CASE_STATE.SHIFT_AND_CAPS;
      } else if (this.state.isCapsLockPressed) {
        removeHiddenClass(langSpan.querySelectorAll('span')[2]);
        this.state.case = CASE_STATE.CAPS_LOCK;
      } else if (this.state.isShiftLeftPressed || this.state.isShiftRightPressed) {
        removeHiddenClass(langSpan.querySelectorAll('span')[1]);
        this.state.case = CASE_STATE.SHIFT;
      } else {
        removeHiddenClass(langSpan.querySelectorAll('span')[0]);
        this.state.case = CASE_STATE.INITIAL;
      }
    });
  }

  toggleLang() {
    const language = {
      previous: this.state.lang,
      new: (this.state.lang === LANGUAGE.ENGLISH) ? LANGUAGE.RUSSIAN : LANGUAGE.ENGLISH,
    };

    this.state.lang = language.new;
    localStorage.setItem(LANGUAGE.LOCAL_STORAGE, language.new);
    toggleHiddenState(this.element, this.state.case, language);
  }

  shiftPressedAction() {
    this.addActiveState();
    this.toggleCase();
  }

  implementKeyFunction() {
    const { selectionStart } = this.textarea;

    if (DATA.SPECIALS.includes(this.current.code)) {
      switch (this.current.code) {
        case KEY_CODE.BACKSPACE:
          if (selectionStart > 0 && selectionStart <= this.textarea.value.length) {
            this.textarea.value = this.textarea.value.slice(0, selectionStart - 1)
              + this.textarea.value.slice(selectionStart, this.textarea.value.length);
            this.textarea.selectionStart = selectionStart - 1;
            this.textarea.selectionEnd = selectionStart - 1;
          }
          break;
        case KEY_CODE.DELETE:
          if (selectionStart >= 0 && selectionStart <= this.textarea.value.length - 1) {
            this.textarea.value = this.textarea.value.slice(0, selectionStart)
              + this.textarea.value.slice(selectionStart + 1, this.textarea.value.length);
            this.textarea.selectionStart = selectionStart;
            this.textarea.selectionEnd = selectionStart;
          }
          break;
        case KEY_CODE.TABULATION:
          this.current.char = KEY_CHAR.TABULATION;
          this.textarea = printChar(selectionStart, this.textarea, this.current.char);
          break;
        case KEY_CODE.ENTER:
          this.current.char = KEY_CHAR.ENTER;
          this.textarea = printChar(selectionStart, this.textarea, this.current.char);
          break;
        case KEY_CODE.CAPS_LOCK:
          if (this.state.isCapsLockPressed && !this.current.event.repeat) {
            this.removeActiveState();
            this.state.isCapsLockPressed = false;
          } else {
            this.addActiveState();
            this.state.isCapsLockPressed = true;
          }
          this.toggleCase();
          break;
        case KEY_CODE.SHIFT_LEFT:
          if (!this.state.isShiftLeftPressed && !this.state.isShiftRightPressed) {
            this.state.isShiftLeftPressed = true;
            this.shiftPressedAction();
          }
          break;
        case KEY_CODE.SHIFT_RIGHT:
          if (!this.state.isShiftRightPressed && !this.state.isShiftLeftPressed) {
            this.state.isShiftRightPressed = true;
            this.shiftPressedAction();
          }
          break;
        default:
          break;
      }
    } else {
      this.textarea = printChar(selectionStart, this.textarea, this.current.char);
    }

    if (this.current.event.ctrlKey && this.current.event.altKey) this.toggleLang();
  }

  keyDownHandler(evt) {
    evt.preventDefault();
    this.current.event = evt;
    this.current.code = evt.code;
    [this.current.element] = this.element.getElementsByClassName(evt.code);
    if (!this.current.element) {
      return;
    }
    this.current.char = this.current.element.querySelectorAll(`:not(.${CLASS.HIDDEN})`)[1].textContent;
    this.implementKeyFunction();

    if (this.current.code === KEY_CODE.META_LEFT) {
      this.addActiveState();
      setTimeout(this.removeActiveState.bind(this), 300);
    } else if (!STATE_DEPENDED_KEYS.includes(this.current.code)) {
      this.addActiveState();
    }
  }

  keyUpHandler(evt) {
    const elem = this.element.getElementsByClassName(evt.code)[0];
    if (!elem) return;
    this.current.element = elem.closest('div');
    if (evt.code !== KEY_CODE.CAPS_LOCK) this.removeActiveState();
    if (evt.code === KEY_CODE.SHIFT_LEFT || evt.code === KEY_CODE.SHIFT_RIGHT) {
      if (evt.code === KEY_CODE.SHIFT_LEFT) {
        this.state.isShiftLeftPressed = false;
        this.removeActiveState();
      } else if (evt.code === KEY_CODE.SHIFT_RIGHT) {
        this.state.isShiftRightPressed = false;
        this.removeActiveState();
      }
      this.toggleCase();
    }
  }

  mouseDownHandler(evt) {
    if (evt.target.tagName !== 'SPAN') return;

    this.current.event = evt;
    this.current.element = evt.target.closest('div');
    [, , this.current.code] = this.current.element.classList;
    this.current.char = evt.target.textContent;
    this.implementKeyFunction();

    if (this.current.code !== KEY_CODE.CAPS_LOCK) {
      this.addActiveState();
    }

    this.previous = { ...this.current };
    evt.preventDefault();
  }

  mouseUpHandler(evt) {
    this.current.event = evt;
    this.current.element = evt.target.closest('div');
    if (!this.current.element) return;
    if (this.current.element.classList.contains(CLASS.KEY)) {
      [, , this.current.code] = this.current.element.classList;
    } else {
      this.current = { ...this.previous };
    }
    if (this.current.code !== KEY_CODE.CAPS_LOCK) {
      this.removeActiveState();
      if (this.state.isShiftLeftPressed && this.current.code === KEY_CODE.SHIFT_LEFT) {
        this.state.isShiftLeftPressed = false;
        this.toggleCase();
      }
      if (this.state.isShiftRightPressed && this.current.code === KEY_CODE.SHIFT_RIGHT) {
        this.state.isShiftRightPressed = false;
        this.toggleCase();
      }
    }
  }

  initLanguage() {
    if (localStorage.lang === LANGUAGE.RUSSIAN) {
      this.toggleLang();
    }
  }

  beforeUnloadHandler() {
    document.removeEventListener('keydown', this.keyDownHandler);
    document.removeEventListener('keyup', this.keyUpHandler);

    this.element.removeEventListener('mousedown', this.mouseDownHandler);
    document.removeEventListener('mouseup', this.mouseUpHandler);

    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
  }

  initKeyboard() {
    this.element = document.querySelector(`.${CLASS.BODY_KEYBOARD}`);
    this.textarea = document.querySelector(`.${CLASS.BODY_TEXTAREA}`);

    this.initLanguage();

    this.keyUpHandler = this.keyUpHandler.bind(this);
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.beforeUnloadHandler = this.beforeUnloadHandler.bind(this);

    document.addEventListener('keyup', this.keyUpHandler);
    document.addEventListener('keydown', this.keyDownHandler);

    document.addEventListener('mouseup', this.mouseUpHandler);
    this.element.addEventListener('mousedown', this.mouseDownHandler);

    window.addEventListener('beforeunload', this.beforeUnloadHandler);
  }
}
