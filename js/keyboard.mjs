import ROWS from './rows.js'; //ToDo

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
    centralizer.appendChild(textarea);

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
keyboard.init(ROWS);

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