import * as menuView from './menuView.js';
import { renderTemplate } from '../helpers/templateHelper.js';

export class SettingsActions {
  backToMenu() {
    const { aside, contentArea } = menuView.menuElements.mobileSettings;

    // First toggle translate-x-full
    setTimeout(() => {
      contentArea.classList.toggle('translate-x-full');
    }, 10);

    contentArea.addEventListener(
      'transitionend',
      () => {
        aside.classList.add('hidden');
      },
      { once: true }
    );
  }

  toggleModeThemeState() {
    const { modeThemeContentArea } = menuView.menuElements.mobileSettings;
    this.modeThemeContentArea = modeThemeContentArea;

    this.modeThemeContentArea.classList.toggle('translate-x-full');

    if (!this.modeThemeContentArea.hasChildNodes()) {
      renderTemplate(
        this.modeThemeContentArea,
        menuView.templates.modeAndThemeTemplate
      );
    }
  }

  toggleFontState() {
    const { fontsContentArea } = menuView.menuElements.mobileSettings;
    this.fontsContentArea = fontsContentArea;

    this.fontsContentArea.classList.toggle('translate-x-full');

    if (!this.fontsContentArea.hasChildNodes()) {
      renderTemplate(this.fontsContentArea, menuView.templates.fontsTemplate);
    }
  }
}

export const settingsActionsObj = new SettingsActions();
