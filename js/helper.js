export const CASE_STATE = {
  INITIAL: 'caseDown',
  SHIFT: 'caseUp',
  CAPS_LOCK: 'caps',
  SHIFT_AND_CAPS: 'shiftCaps',
};

export const LANGUAGE = {
  ENGLISH: 'eng',
  RUSSIAN: 'rus',
  LOCAL_STORAGE: 'lang',
};

export const CLASS = {
  BODY: 'body',
  CENTRALIZER: 'centralizer',
  TITLE: 'title',
  TEXTAREA: 'textarea',
  BODY_TEXTAREA: 'body--textarea',
  KEYBOARD: 'keyboard',
  BODY_KEYBOARD: 'body--keyboard',
  ROW: 'row',
  KEYBOARD_ROW: 'keyboard--row',
  KEYBOARD_KEY: 'keyboard--key',
  KEY: 'key',
  HIDDEN: 'hidden',
  DESCRIPTION: 'description',
  LANGUAGE: 'language',
  ACTIVE: 'active',
};

export const DESCRIPTION = {
  TITLE: 'RSS Виртуальная клавиатура (by @Musmen)',
  OPERATION_SYSTEM: 'Клавиатура создана в операционной системе Windows',
  LANGUAGE_SWITCH: 'Для переключения языка комбинация: левыe Сtrl + Alt',
};

export const KEY_CODE = {
  CAPS_LOCK: 'CapsLock',
  SHIFT_LEFT: 'ShiftLeft',
  SHIFT_RIGHT: 'ShiftRight',
  BACKSPACE: 'Backspace',
  DELETE: 'Delete',
  TABULATION: 'Tab',
  ENTER: 'Enter',
  META_LEFT: 'MetaLeft',
};

export const KEY_CHAR = {
  TABULATION: '    ',
  ENTER: '\n',
};

export const STATE_DEPENDED_KEYS = [KEY_CODE.CAPS_LOCK, KEY_CODE.SHIFT_LEFT, KEY_CODE.SHIFT_RIGHT];
