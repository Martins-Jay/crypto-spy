import { ThemeManager } from '../../models/ui/themeManager.js';

class ModeThemeLarge {
  constructor() {
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

          class="mode-btn  md:py-1 md:text-sm md:block capitalize lg:text-[10px]"
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
    this.containerEl = document.querySelector(
      `#dashboard-section[data-screen="${device}"]  #menu-accordion-container`
    );

    if (!this.containerEl) return;

    if (!this.containerEl.hasChildNodes()) {
      this.containerEl.innerHTML = this.getHTML();
    }
  }

  toggleModeAccordion() {
    const allAccordionEl = document.querySelectorAll('.accordion-content');
    this.themeAccordionContentEl = this.containerEl;

    if (!this.themeAccordionContentEl || !this.containerEl) return;

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

    if (!this.themeAccordionContentEl.classList.contains('open')) {
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

    const highlightWrapperEL = clickedBtnEl.querySelector('#highlight-wrapper');
    console.log(highlightWrapperEL);
    if (highlightWrapperEL) {
      highlightWrapperEL.innerHTML = this.activeIndicatorTemplate();
    }
  }

  updateActiveModeStatus() {
    this.activeThemeNameEl = document.getElementById('active-theme-name');
    const activeTheme = this.themeManagerObj.getCurrentMode();
    this.activeThemeNameEl.innerHTML = '';
    this.activeThemeNameEl.innerHTML = activeTheme;
  }

  toggleSystem(mode) {
    this.themeManagerObj.setUserTheme(mode);
    this.positionActiveIndicator(mode);
    console.log(mode);
    this.updateActiveModeStatus();
  }

  toggleLight(mode) {
    this.themeManagerObj.setUserTheme(mode);
    this.positionActiveIndicator(mode);
    this.updateActiveModeStatus();
  }

  toggleDark(mode) {
    this.themeManagerObj.setUserTheme(mode);
    this.positionActiveIndicator(mode);
    this.updateActiveModeStatus();
  }

  toggleDefault(mode) {
    this.themeManagerObj.setUserTheme(mode);
    this.positionActiveIndicator(mode);
    this.updateActiveModeStatus();
  }
}

export const modeThemeLargeObj = new ModeThemeLarge();
