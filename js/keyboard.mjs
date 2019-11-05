import DATA from './rows.js'; // ToDo

class Keyboard {
  constructor() {
    this.element = null;
    this.textarea = null;
    this.cursorPos = 0;

    this.state = {
      isShiftLeftPressed: false,
      isShiftRightPressed: false,
      isCapsLockPressed: false,
      case: 'caseDown',
      lang: 'eng',
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

  initDomStructure(ROWS_DATA) {
    document.body.classList.add('body');

    const centralizer = document.createElement('div');
    centralizer.classList.add('centralizer');

    const textarea = document.createElement('textarea');
    textarea.classList.add('body--textarea', 'textarea');
    textarea.setAttribute('id', 'textarea');
    textarea.setAttribute('rows', '5');
    textarea.setAttribute('cols', '50');
    this.textarea = textarea;
    centralizer.appendChild(this.textarea);

    this.element = document.createElement('div');
    this.element.classList.add('body--keyboard', 'keyboard');
    this.element.setAttribute('id', 'keyboard');

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < ROWS_DATA.length; i += 1) {
      const row = document.createElement('div');
      row.classList.add('keyboard--row', 'row');
      for (let j = 0; j < ROWS_DATA[i].length; j += 1) {
        const div = document.createElement('div');
        div.classList.add('keyboard--key', 'key', ROWS_DATA[i][j].className);

        const spanRus = document.createElement('span');
        spanRus.classList.add('rus', 'hidden');
        spanRus.insertAdjacentHTML('afterBegin',
          `<span class="caseDown hidden">${ROWS_DATA[i][j].rus.caseDown}</span>`);
        spanRus.insertAdjacentHTML('beforeEnd',
          `<span class="caseUp hidden">${ROWS_DATA[i][j].rus.caseUp}</span>`);
        div.appendChild(spanRus);

        const spanEng = document.createElement('span');
        spanEng.classList.add('eng');
        spanEng.insertAdjacentHTML('afterBegin',
          `<span class="caseDown">${ROWS_DATA[i][j].eng.caseDown}</span>`);
        spanEng.insertAdjacentHTML('beforeEnd',
          `<span class="caseUp hidden">${ROWS_DATA[i][j].eng.caseUp}</span>`);
        div.appendChild(spanEng);

        row.appendChild(div);
      }
      fragment.appendChild(row);
    }

    this.element.appendChild(fragment);
    centralizer.appendChild(this.element);
    document.body.appendChild(centralizer);
  }

  addActiveState() {
    this.current.element.classList.add('active');
  }

  removeActiveState() {
    if (!this.current.element) return;
    if (this.previous.element && this.previous.element.classList.contains('active')) {
      if (this.previous.code !== 'CapsLock' && this.previous.code !== 'ShiftLeft' && this.previous.code !== 'ShiftRight') {
        this.previous.element.classList.remove('active');
      }
    }
    this.current.element.classList.remove('active');
  }

  toggleCase() {
    const langSpans = this.element.querySelectorAll(`div > .${this.state.lang}`);
    for (let i = 0; i < langSpans.length; i += 1) {
      langSpans[i].querySelectorAll('span')[0].classList.toggle('hidden');
      langSpans[i].querySelectorAll('span')[1].classList.toggle('hidden');
    }
    if (this.state.case === 'caseUp') {
      this.state.case = 'caseDown';
    } else {
      this.state.case = 'caseUp';
    }
  }

  toggleLang() {
    function toggleHiddenState() {
      const langSpans = this.element.querySelectorAll(`div > .${this.state.lang}`);
      for (let i = 0; i < langSpans.length; i += 1) {
        langSpans[i].classList.toggle('hidden');
        langSpans[i].querySelectorAll(`span.${this.state.case}`)[0].classList.toggle('hidden');
      }
    }
    const toggleHiddenStateByLang = toggleHiddenState.bind(this);

    toggleHiddenStateByLang();
    if (this.state.lang === 'eng') {
      this.state.lang = 'rus';
    } else {
      this.state.lang = 'eng';
    }
    localStorage.setItem('lang', this.state.lang);
    toggleHiddenStateByLang();
  }

  implementKeyFunction() {
    let text = this.textarea.value;
    const selStart = this.textarea.selectionStart;

    function print() {
      if (selStart >= 0 && selStart <= text.length) {
        // this.textarea.selectionStart = this.cursorPos;
        // this.textarea.selectionEnd = this.cursorPos;
        this.textarea.value = this.textarea.value.slice(0, selStart) + this.current.char + this.textarea.value.slice(selStart, this.textarea.value.length);
        // this.cursorPos += 1;
        this.textarea.selectionStart = selStart + 1;
        this.textarea.selectionEnd = selStart + 1;
      } else {
        this.textarea.value += this.current.char;
      }
    }

    const printChar = print.bind(this);
    
    // function textareaRemovePrev() {
    //   if (selStart > 0 && selStart <= text.length) {
    //     text = text.slice(0, selStart - 1) + text.slice(selStart, text.length);//
    //     this.textarea.value = text;
    //     this.textarea.selectionStart = selStart - 1;
    //     this.textarea.selectionEnd = selStart - 1;
        // this.textarea.position = this.textarea.selectionStart;
    //   }
    // }

    // const backspace = textareaRemovePrev.bind(this);

    if (DATA.SPECIALS.includes(this.current.code)) {
      switch (this.current.code) {
        case 'Backspace':
          if (selStart > 0 && selStart <= text.length) {
            text = text.slice(0, selStart - 1) + text.slice(selStart, text.length);
            this.textarea.value = text;
            this.textarea.selectionStart = selStart - 1;
            this.textarea.selectionEnd = selStart - 1;
          }
          break;
        case 'Tab':
          this.current.char = '    ';
          printChar();
          // this.textarea.value += '    ';
          break;
        case 'Enter':
          this.current.char = '\n';
          printChar();
          // this.textarea.value += '\n';
          break;
        case 'CapsLock':
          if (this.state.isCapsLockPressed && !this.current.event.repeat) {
            this.removeActiveState();
            this.state.isCapsLockPressed = false;
          } else {
            this.addActiveState();
            this.state.isCapsLockPressed = true;
          }
          this.toggleCase();
          break;
        case 'ShiftLeft':
          if (!this.state.isShiftLeftPressed && !this.state.isShiftRightPressed) {
            this.addActiveState();
            this.toggleCase();
            this.state.isShiftLeftPressed = true;
          }
          break;
        case 'ShiftRight':
          if (!this.state.isShiftRightPressed && !this.state.isShiftLeftPressed) {
            this.addActiveState();
            this.toggleCase();
            this.state.isShiftRightPressed = true;
          }
          break;
        default:

          break;
      }
    } else {
      printChar();
    }
    
    // if (!DATA.SPECIALS.includes(this.current.code)) {
    // if (selStart >= 0 && selStart <= text.length) {
      // this.textarea.selectionStart = this.cursorPos;
      // this.textarea.selectionEnd = this.cursorPos;
      // this.textarea.value = this.textarea.value.slice(0, selStart) + this.current.char + this.textarea.value.slice(selStart, this.textarea.value.length);
      // this.cursorPos += 1;
      // this.textarea.selectionStart = selStart + 1;
      // this.textarea.selectionEnd = selStart + 1;
    // } else {
      // this.textarea.value += this.current.char;
    // }
    // } else {
      
    // }
    if (this.current.event.ctrlKey && this.current.event.altKey) this.toggleLang();
  }

  keyDownHandler(evt) {
    this.current.event = evt;
    this.current.code = evt.code;
    [this.current.element] = this.element.getElementsByClassName(evt.code);
    if (!this.current.element) {
      evt.preventDefault();
      return;
    }
    this.current.char = this.current.element.querySelectorAll(':not(.hidden)')[1].textContent;
    this.implementKeyFunction();

    if (evt.code !== 'CapsLock' && evt.code !== 'ShiftLeft' && evt.code !== 'ShiftRight') {
      this.addActiveState();
    }

    evt.preventDefault();
  }

  keyUpHandler(evt) {
    const elem = this.element.getElementsByClassName(evt.code)[0];
    if (!elem) return;
    this.current.element = elem.closest('div');
    if (evt.code !== 'CapsLock') this.removeActiveState();
    if (evt.code === 'ShiftLeft' || evt.code === 'ShiftRight') {
      this.toggleCase();
      if (evt.code === 'ShiftLeft') {
        this.state.isShiftLeftPressed = false;
        this.removeActiveState();
      } else if (evt.code === 'ShiftRight') {
        this.state.isShiftRightPressed = false;
        this.removeActiveState();
      }
    }
  }

  mouseDownHandler(evt) {
    if (evt.target.tagName !== 'SPAN') return;

    this.current.event = evt;
    this.current.element = evt.target.closest('div');
    [, , this.current.code] = this.current.element.classList;
    this.current.char = evt.target.textContent;
    this.implementKeyFunction();

    if (this.current.code !== 'CapsLock') {
      this.addActiveState();
    }

    this.previous = { ...this.current };
    evt.preventDefault();
  }

  mouseUpHandler(evt) {
    this.current.event = evt;
    this.current.element = evt.target.closest('div');
    if (!this.current.element) return;
    if (this.current.element.classList.contains('key')) {
      [, , this.current.code] = this.current.element.classList;
    } else {
      this.current = { ...this.previous };
    }
    if (this.current.code !== 'CapsLock') {
      this.removeActiveState();
      if (this.state.isShiftLeftPressed && this.current.code === 'ShiftLeft') {
        this.toggleCase();
        this.state.isShiftLeftPressed = false;
      }
      if (this.state.isShiftRightPressed && this.current.code === 'ShiftRight') {
        this.toggleCase();
        this.state.isShiftRightPressed = false;
      }
    }
  }

  initLanguage() {
    if (localStorage.lang === 'rus') {
      this.toggleLang();
    }
  }

  initKeyboard(ROWS_DATA) {
    this.initDomStructure(ROWS_DATA);
    this.initLanguage();

    document.addEventListener('keyup', this.keyUpHandler.bind(this));
    document.addEventListener('keydown', this.keyDownHandler.bind(this));
    document.addEventListener('mouseup', this.mouseUpHandler.bind(this));
    this.element.addEventListener('mousedown', this.mouseDownHandler.bind(this));
  }
}

const keyboard = new Keyboard();
keyboard.initKeyboard(DATA.ROWS);

/* <div class="key keyQ">
  <span class="rus hidden">
    <span class="caseDown hidden">й</span>
    <span class="caseUp hidden">Й</span>
  </span>
  <span class="eng">
    <span class="caseDown">q</span>
    <span class="caseUp hidden">Q</span>
  </span>
</div> */
