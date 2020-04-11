import {
  LANGUAGE,
  CLASS,
  DESCRIPTION,
} from './helper';

import { createDomElement, createKeyContent } from './utils';

const renderDOM = (ROWS_DATA) => {
  document.body.classList.add(CLASS.BODY);

  const centralizer = createDomElement('div', CLASS.CENTRALIZER);

  const title = createDomElement('p', CLASS.TITLE, DESCRIPTION.TITLE);
  centralizer.append(title);

  const textarea = createDomElement('textarea', `${CLASS.BODY_TEXTAREA} ${CLASS.TEXTAREA}`);
  centralizer.append(textarea);

  const keyboard = createDomElement('div', `${CLASS.BODY_KEYBOARD} ${CLASS.KEYBOARD}`);

  ROWS_DATA.forEach((ROW_DATA) => {
    const row = createDomElement('div', `${CLASS.KEYBOARD_ROW} ${CLASS.ROW}`);

    ROW_DATA.forEach((KEY_DATA) => {
      const key = createDomElement('div', `${CLASS.KEYBOARD_KEY} ${CLASS.KEY} ${KEY_DATA.className}`);

      const spanRus = createDomElement('span', `${LANGUAGE.RUSSIAN} ${CLASS.HIDDEN}`);
      spanRus.innerHTML = createKeyContent(KEY_DATA.rus, CLASS.HIDDEN);
      key.append(spanRus);

      const spanEng = createDomElement('span', LANGUAGE.ENGLISH);
      spanEng.innerHTML = createKeyContent(KEY_DATA.eng);
      key.append(spanEng);

      row.append(key);
    });

    keyboard.append(row);
  });

  centralizer.append(keyboard);

  const description = createDomElement('p', CLASS.DESCRIPTION, DESCRIPTION.OPERATION_SYSTEM);
  centralizer.append(description);

  const languageSwitchDescription = createDomElement('p', CLASS.LANGUAGE, DESCRIPTION.LANGUAGE_SWITCH);
  centralizer.append(languageSwitchDescription);

  document.body.append(centralizer);
};

export default renderDOM;
