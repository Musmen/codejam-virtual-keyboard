import { CASE_STATE, CLASS } from './helper';

export const createDomElement = (tagName, className, content) => {
  const element = document.createElement(tagName);
  element.innerHTML = content || '';
  element.className = className || '';
  return element;
};

export const createKeyContent = (KEY_DATA, additionalClass = '') => {
  const content = `
    <span class="${CASE_STATE.INITIAL} ${additionalClass}">${KEY_DATA.caseDown}</span>
    <span class="${CASE_STATE.SHIFT} ${CLASS.HIDDEN}">${KEY_DATA.caseUp}</span>
    <span class="${CASE_STATE.CAPS_LOCK} ${CLASS.HIDDEN}">${KEY_DATA.caps || KEY_DATA.caseUp}</span>
    <span class="${CASE_STATE.SHIFT_AND_CAPS} ${CLASS.HIDDEN}">${KEY_DATA.shiftCaps || KEY_DATA.caseDown}</span>
  `;

  return content;
};

export const toggleHiddenState = (keyboardContainer, caseState, language) => {
  const keys = keyboardContainer.querySelectorAll(`.${CLASS.KEYBOARD_KEY}`);

  keys.forEach((key) => {
    const previousLanguageSpan = key.querySelector(`.${language.previous}`);
    const newLanguageSpan = key.querySelector(`.${language.new}`);

    [previousLanguageSpan, newLanguageSpan].forEach((span) => {
      span.classList.toggle(CLASS.HIDDEN);
      span.querySelector(`span.${caseState}`).classList.toggle(CLASS.HIDDEN);
    });
  });
};

export const printChar = (selectionStart, textarea, currentChar) => {
  const newTextArea = textarea;

  if (selectionStart >= 0 && selectionStart <= textarea.value.length) {
    newTextArea.value = textarea.value.slice(0, selectionStart) + currentChar
      + textarea.value.slice(selectionStart, textarea.value.length);
    newTextArea.selectionStart = selectionStart + currentChar.length;
    newTextArea.selectionEnd = selectionStart + currentChar.length;
  } else {
    newTextArea.value += currentChar;
  }

  return newTextArea;
};

export const removeHiddenClass = (element) => {
  element.classList.remove(CLASS.HIDDEN);
};
