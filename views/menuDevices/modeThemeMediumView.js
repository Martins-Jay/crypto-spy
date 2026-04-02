import { ThemeManager } from '../../models/ui/themeManager.js';

class ModeAndThemeMediumView {
  constructor() {
    this.container = null;
    this.themeAccordionContentEl = null;
    this.highlightWrapperEl = null;
    this.arrowIconEl = null;

    this.themeManagerObj = new ThemeManager(); // Shared model (same as mobile)
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

  generateModeMarkup({ action, mode, label }) {
    const activeMode = this.themeManagerObj.getCurrentMode();

    const indicator = mode === activeMode ? this.activeIndicatorTemplate() : '';

    const html = `
      <button 
        data-action="${action}"
        data-mode="${mode}"
        class="flex items-center justify-between rounded-sm md:px-6"
      >
        <div

          class="mode-btn  md:py-2 md:text-sm md:block capitalize"
        >
          ${label}
        </div>

        <div
          id="highlight-wrapper"
          class="flex items-center justify-center"
        >
          ${indicator}
        </div>
      </button>
    `;

    return html;
  }

  generateModeItemsHTML() {
    const themeMarkupData = [
      { action: 'system-mode', mode: 'system', label: 'System' },
      { action: 'light-mode', mode: 'light', label: 'Light' },
      { action: 'dark-mode', mode: 'dark', label: 'Dark' },
      { action: 'default-mode', mode: 'default', label: 'Default' },
    ];

    const accordionItemsMarkup = themeMarkupData
      .map((dataObj) => this.generateModeMarkup(dataObj))
      .join('');

    return accordionItemsMarkup;
  }

  // Full accordion map
  getHTML() {
    return `
        ${this.generateModeItemsHTML()}
    `;
  }

  // Injects accordion items only once
  renderHTML(device) {
    //data-screen was attached during template render in menuView
    this.containerEl = document.querySelector(
      `#settings-wrapper[data-screen="${device}"] #menu-accordion-container`
    );

    if (!this.containerEl) return;

    if (!this.containerEl.hasChildNodes()) {
      this.containerEl.innerHTML = this.getHTML();
    }
  }

  toggleModeAccordion(device) {
    const allAccordionEl = document.querySelectorAll('.accordion-content');
    this.themeAccordionContentEl = this.containerEl;

    if (!this.themeAccordionContentEl) return;

    this.arrowIconEl = document.getElementById('theme-accordion-arrow');

    allAccordionEl.forEach((accordionEl) => {
      if (accordionEl !== this.themeAccordionContentEl) {
        accordionEl.style.maxHeight = '0px';
        accordionEl.classList.remove('open');

        accordionEl.parentElement
          .querySelector('#font-accordion-arrow')
          .classList.remove('rotate-180');
      }
    });

    if (
      !this.themeAccordionContentEl.classList.contains('open') &&
      device === 'medium'
    ) {
      this.themeAccordionContentEl.style.maxHeight =
        this.themeAccordionContentEl.scrollHeight + 'px';
      this.themeAccordionContentEl.classList.add('open');

      this.arrowIconEl.classList.add('rotate-180');
    } else {
      this.resetAccordion();
    }
  }

  resetAccordion() {
    if (!this.themeAccordionContentEl) return;

    this.themeAccordionContentEl.style.maxHeight = '0px';
    this.themeAccordionContentEl.classList.remove('open');

    this.arrowIconEl.classList.remove('rotate-180');
  }

  positionActiveIndicator(activeMode) {
    const wrapperEls = document.querySelectorAll('#highlight-wrapper');

    wrapperEls.forEach((wrapperEl) => {
      wrapperEl.innerHTML = '';
    });

    const clickedBtnEl = document.querySelector(
      `[data-mode = '${activeMode}']`
    );
    console.log(clickedBtnEl);

    const highlightWrapperEL = clickedBtnEl.querySelector('#highlight-wrapper');
    console.log(highlightWrapperEL);
    if (highlightWrapperEL) {
      highlightWrapperEL.innerHTML = this.activeIndicatorTemplate();
    }
  }

  updateActiveTheme(mode) {
    this.activeThemeEl = document.querySelector(
      '#medium-menu-content #active-theme-name'
    );

    this.activeThemeEl.textContent = '';
    this.activeThemeEl.textContent = mode;
  }

  toggleSystem(mode) {
    this.themeManagerObj.setUserTheme(mode);
    this.positionActiveIndicator(mode);
    this.updateActiveTheme(mode);
  }

  toggleLight(mode) {
    this.themeManagerObj.setUserTheme(mode);
    this.positionActiveIndicator(mode);
    this.updateActiveTheme(mode);
  }

  toggleDark(mode) {
    this.themeManagerObj.setUserTheme(mode);
    this.positionActiveIndicator(mode);
    this.updateActiveTheme(mode);
  }

  toggleDefault(mode) {
    this.themeManagerObj.setUserTheme(mode);
    this.positionActiveIndicator(mode);
    this.updateActiveTheme(mode);
  }
}

export const modeAndThemeMediumViewObj = new ModeAndThemeMediumView();
