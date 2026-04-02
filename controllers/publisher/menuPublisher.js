import { publish } from '../../helpers/pubsub.js';

class Menu {
  constructor(parentSelector, channel) {
    this._parentEl = document.querySelector(parentSelector);
    this._channel = channel;
  }

  addHandlerClick() {
    this._parentEl.addEventListener('click', (e) => {
      const actionEl = e.target.closest('[data-action]');
      const modeEl = e.target.closest('[data-mode]');
      if (!actionEl) return;

      const action = actionEl.dataset.action;
      const screen = this._parentEl.dataset.screen;
      const theme = modeEl?.dataset.mode;
      // console.log(action, screen, theme);
      publish(this._channel, { action, device: screen, mode: theme });
    });
  }
}

export const mainMenuObj = new Menu(
  '#mobile-menu-content',
  'menu:mobile:action'
);

export const settingsMenuObj = new Menu(
  '#mobile-settings-content',
  'settings:mobile:action'
);

export const modeAndThemeMenuObj = new Menu(
  '#mode-theme-panel',
  'settings:modeAndTheme:action'
);

export const fontsMenuObj = new Menu('#fonts-panel', 'settings:fonts:action');

export const mediumMenuObj = new Menu(
  '#medium-menu-content',
  'menu:medium:action'
);

export const navMenuObj = new Menu('#dashboard-section', 'nav:menu::action');
