import '../scss/style.scss';

import DATA from './rows';
import renderDOM from './domRenderer';
import Keyboard from './keyboard';

window.onload = () => {
  renderDOM(DATA.ROWS);

  const keyboard = new Keyboard();
  keyboard.initKeyboard();
};
