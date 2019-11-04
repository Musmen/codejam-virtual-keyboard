import DATA from './rows.js'; // ToDo

class Keyboard {
  constructor(props) {
    this.props = props;
    this.state = {};
    this.element = null;
    this.textarea = null;
  }

  init(ROWS_DATA) {
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
}

const keyboard = new Keyboard();
keyboard.init(DATA.ROWS);

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

let isShiftLeftPressed = false;
let isShiftRightPressed = false;
let isCapsLockPressed = false;
let caseState = 'caseDown';
let lang = 'eng';

function addActiveState(element) {
  element.classList.add('active');
}

function removeActiveState(element) {
  element.classList.remove('active');
}

function toggleCase() {
  const langSpans = keyboard.element.querySelectorAll(`div > .${lang}`);
  for (let i = 0; i < langSpans.length; i += 1) {
    langSpans[i].querySelectorAll('span')[0].classList.toggle('hidden');
    langSpans[i].querySelectorAll('span')[1].classList.toggle('hidden');
  }
  if (caseState === 'caseUp') {
    caseState = 'caseDown';
  } else {
    caseState = 'caseUp';
  }
}

function toggleLang() {
  function toggleHiddenStateByLang() {
    const langSpans = keyboard.element.querySelectorAll(`div > .${lang}`);
    for (let i = 0; i < langSpans.length; i += 1) {
      langSpans[i].classList.toggle('hidden');
      langSpans[i].querySelectorAll(`span.${caseState}`)[0].classList.toggle('hidden');
    }
  }

  toggleHiddenStateByLang();
  if (lang === 'eng') {
    lang = 'rus';
    localStorage.setItem('lang', 'rus');
  } else {
    lang = 'eng';
    localStorage.setItem('lang', 'eng');
  }
  toggleHiddenStateByLang();
}

function keyUpHandler(evt) {
  const elem = keyboard.element.getElementsByClassName(evt.code)[0];
  if (!elem) return;
  if (evt.code !== 'CapsLock') removeActiveState(elem.closest('div'));
  if (evt.code === 'ShiftLeft' || evt.code === 'ShiftRight') {
    toggleCase();
    if (evt.code === 'ShiftLeft') {
      isShiftLeftPressed = false;
      removeActiveState(elem.closest('div'));
    } else if (evt.code === 'ShiftRight') {
      isShiftRightPressed = false;
      removeActiveState(elem.closest('div'));
    }
  }
}

if (localStorage.lang === 'rus') {
  toggleLang();
}

document.addEventListener('keyup', keyUpHandler);

document.addEventListener('keydown',
  (evt) => {
    let elem = null;
    [elem] = keyboard.element.getElementsByClassName(evt.code);
    if (!elem) {
      evt.preventDefault();
      return;
    }

    if (!DATA.SPECIALS.includes(evt.code)) {
      keyboard.textarea.value += elem.querySelectorAll(':not(.hidden)')[1].textContent;
    } else {
      switch (evt.code) {
        case 'Backspace':
          keyboard.textarea.value = keyboard.textarea.value.substr(0, keyboard.textarea.value.length - 1);
          break;
        case 'Tab':
          keyboard.textarea.value += '    ';
          break;
        case 'Enter':
          keyboard.textarea.value += '\n';
          break;
        case 'CapsLock':
          if (isCapsLockPressed && !evt.repeat) {
            removeActiveState(elem);
            isCapsLockPressed = false;
          } else {
            addActiveState(elem);
            isCapsLockPressed = true;
          }
          toggleCase();
          break;
        case 'ShiftLeft':
          if (!isShiftLeftPressed && !isShiftRightPressed) {
            addActiveState(elem);
            toggleCase();
            isShiftLeftPressed = true;
          }
          break;
        case 'ShiftRight':
          if (!isShiftRightPressed && !isShiftLeftPressed) {
            addActiveState(elem);
            toggleCase();
            isShiftRightPressed = true;
          }
          break;
        default:
          break;
      }
    }
    if (evt.ctrlKey && evt.altKey) toggleLang();


    if (evt.code !== 'CapsLock' && evt.code !== 'ShiftLeft' && evt.code !== 'ShiftRight') { //! evt.repeat
      addActiveState(elem);
    }

    evt.preventDefault();
  });

keyboard.element.addEventListener('mouseup',
  (evt) => {
    if (evt.target.tagName !== 'SPAN') return;
    const elem = evt.target.closest('div');

    if (!DATA.SPECIALS.includes(elem.classList[2])) {
      keyboard.textarea.value += evt.target.textContent;
    } else {
      switch (elem.classList[2]) { // evt.code
        case 'Backspace':
          keyboard.textarea.value = keyboard.textarea.value.substr(0, keyboard.textarea.value.length - 1);
          break;
        case 'Tab':
          keyboard.textarea.value += '    ';
          break;
        case 'Enter':
          keyboard.textarea.value += '\n';
          break;
        case 'CapsLock':
          if (isCapsLockPressed) { // && !evt.repeat
            removeActiveState(evt.target.closest('div')); // elem
            isCapsLockPressed = false;
          } else {
            addActiveState(evt.target.closest('div'));
            isCapsLockPressed = true;
          }
          toggleCase();
          break;
        case 'ShiftLeft':
          if (!isShiftLeftPressed) {
            toggleCase();
            isShiftLeftPressed = true;
          }
          break;
        case 'ShiftRight':
          if (!isShiftRightPressed) {
            toggleCase();
            isShiftRightPressed = true;
          }
          break;
        default:
          break;
      }
    }

    if (elem.classList[2] !== 'CapsLock') { //! evt.repeat &&
      addActiveState(evt.target.closest('div'));
      setTimeout(
        () => {
          removeActiveState(evt.target.closest('div'));
          if (isShiftLeftPressed) {
            toggleCase();
            isShiftLeftPressed = false;
          }
          if (isShiftRightPressed) {
            toggleCase();
            isShiftRightPressed = false;
          }
        },
        300,
      );
    }

    evt.preventDefault();
  });
