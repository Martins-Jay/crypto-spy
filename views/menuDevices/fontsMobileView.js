import * as menuView from '../menuView.js';
import { fontsModel } from '../../models/ui/fontModel.js';

class FontsActions {
  constructor() {
    this.bodyEl = document.querySelector('body'); // Apply font here

    this.fontsContentArea = null;
    this.storageKey = 'appFont';

    this.fontName = localStorage.getItem(this.storageKey) || 'inter';
  }

  activeIndicatorTemplate() {
    return `
      <div
        id="outer-color"
        class="flex items-center justify-center w-3 h-3 bg-appBg-white dark:bg-appBg-white light:bg-appBg-black rounded-full "
      >
        <div
          id="inner-color"
          class="w-1.5 h-1.5 bg-brand rounded-full"
        ></div>
      </div>
    `;
  }

  // Generate HTML markup for each font
  generateFontMarkup({ action, id, value, fontName, title }) {
    const activeFont = this.getCurrentFont();

    const indicator =
      fontName === activeFont ? this.activeIndicatorTemplate() : '';

    const html = `
      <!-- Font 1 wrapper -->
      <div data-action="${action}"
        id="${id}"
        class="flex items-center justify-between p-4 rounded-lg border-0 cursor-pointer"
      >
        <!-- font title -->
        <div
          id="font-${value}-title"
          class="flex font-${fontName} text-sm tracking-wider"
        >
          ${title}
        </div>

        <div
          id="${fontName}-highlight-wrapper"
          class="highlight-wrapper flex items-center justify-center"
        >
          ${indicator}
        </div>
      </div>
    `;

    return html;
  }

  renderFonts() {
    const fontMarkupData = [
      {
        action: 'activate-font-1',
        id: 'font-1-wrapper',
        value: '1',
        fontName: 'inter',
        title: 'Inter',
      },
      {
        action: 'activate-font-2',
        id: 'font-2-wrapper',
        value: '2',
        fontName: 'rubik',
        title: 'Rubik',
      },
      {
        action: 'activate-font-3',
        id: 'font-3-wrapper',
        value: '3',
        fontName: 'spaceGrotesk',
        title: 'SpaceGrotesk',
      },
      {
        action: 'activate-font-4',
        id: 'font-4-wrapper',
        value: '4',
        fontName: 'spectral',
        title: 'Spectral',
      },
      {
        action: 'activate-font-5',
        id: 'font-5-wrapper',
        value: '5',
        fontName: 'tagesschrift',
        title: 'Tagesschrift',
      },
    ];

    // Build all font blocks into markup
    const fontOptionsMarkup = fontMarkupData
      .map((fontObj) => this.generateFontMarkup(fontObj))
      .join('');

    const { fontsContentArea } = menuView.menuElements.mobileSettings;
    this.fontsContentArea = fontsContentArea; // parentEl

    // Inject into the container
    this.fontsContentArea.querySelector('#font-options-container').innerHTML =
      fontOptionsMarkup;
  }

  clearIndicatorEls() {
    const { fontsContentArea } = menuView.menuElements.mobileSettings;

    const btnWrapperEls =
      fontsContentArea.querySelectorAll('.highlight-wrapper');

    btnWrapperEls.forEach((btnWrapperEl) => (btnWrapperEl.innerHTML = ''));
  }

  activateIndicator(fontName) {
    document.getElementById(`${fontName}-highlight-wrapper`).innerHTML =
      this.activeIndicatorTemplate();
  }

  activateFont(fontName) {
    this.clearIndicatorEls();
    this.fontName = fontName;
    fontsModel.applyAndSaveFont(this.fontName);
    this.activateIndicator(this.fontName);
  }

  showActiveFont() {
    this.activeFontEl = document.querySelector(
      '#mobile-settings-content #active-font-name'
    );
    this.activeFontEl.textContent = '';
    this.activeFontEl.textContent = this.fontName;
  }

  getCurrentFont() {
    return localStorage.getItem(this.storageKey);
  }

  init() {
    this.fontName = localStorage.getItem(this.storageKey) || 'inter';
    fontsModel.applyAndSaveFont(this.fontName);
  }
}

export const fontActionsObj = new FontsActions();
