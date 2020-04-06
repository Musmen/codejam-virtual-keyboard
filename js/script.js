import '../scss/style.scss';

import Keyboard from './keyboard';
import DATA from './rows';

window.onload = () => {
  const keyboard = new Keyboard();
  keyboard.initKeyboard(DATA.ROWS);
};
