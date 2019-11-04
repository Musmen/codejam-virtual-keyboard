document.body.insertAdjacentHTML('afterBegin',
  '<div class="centralizer"><textarea id="textarea" class="textarea" rows="5" cols="50"></textarea><div id="keyboard" class="keyboard"></div></div>');

const fragment = document.createDocumentFragment();

for (let i = 0; i < ROWS.length; i++) {
  const row = document.createElement('div');
  row.classList.add('row');
  for (let j = 0; j < ROWS[i].length; j++) {
    const div = document.createElement('div');
    div.classList.add('key');
    div.classList.add(ROWS[i][j].className);
    div.insertAdjacentHTML('afterBegin',
      `<span class="rus hidden"><span class="caseDown hidden">${ROWS[i][j].rus.caseDown}</span><span class="caseUp hidden">${ROWS[i][j].rus.caseUp}</span></span><span class="eng"><span class="caseDown">${ROWS[i][j].eng.caseDown}</span><span class="caseUp hidden">${ROWS[i][j].eng.caseUp}</span></span>`);
    row.appendChild(div);
  }
  fragment.appendChild(row);
}

keyboard.appendChild(fragment);

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