import * as menuView from '../menuView.js';
import { fontActionsObj } from './fontsMobileView.js';
import { fontsModel } from '../../models/ui/fontModel.js';

class FontsMediumActions {
  constructor() {
    this.bodyEl = document.querySelector('body'); // Apply font here

    this.contentArea = null;
    this.fontArrowIconEl = null;
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

  generateFontOptions({ action, id, value, fontName, title }) {
    const activeFont = fontActionsObj.getCurrentFont();

    const indicator =
      fontName === activeFont ? this.activeIndicatorTemplate() : '';

    const html = `
      <!-- Font 1 wrapper -->
      <button data-action="${action}"
        id="${id}"
        class="flex items-center justify-between px-6 py-2 rounded-lg border-0 lg:py-1"
      >
        <!-- font title -->
        <div
          id="font-${value}-title"
          class="flex font-${fontName} text-sm tracking-wider md:cursor-pointer lg:text-[10px]"
        >
          ${title}
        </div>


        <div
          id="${fontName}-highlight-wrapper"
          class="highlight-wrapper flex items-center justify-center"
        >
          ${indicator}
        </div>
        
      </button>
    `;

    return html;
  }

  getHTML() {
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
      .map((fontObj) => this.generateFontOptions(fontObj))
      .join('');

    return fontOptionsMarkup;
  }

  renderHTML(device) {
    this.contentArea = document.querySelector(
      `#dashboard-section[data-screen="${device}"] #medium-menu-font-accordion-container`
    );

    if (!this.contentArea.hasChildNodes()) {
      this.contentArea.innerHTML = this.getHTML();
    }
  }

  toggleFontsAccordion(device) {
    const allAccordionEl = document.querySelectorAll('.accordion-content');
    this.fontAccordionContainerEl = this.contentArea;
    this.fontArrowIconEl = document.getElementById('font-accordion-arrow');
    allAccordionEl.forEach((accordionEl) => {
      if (accordionEl !== this.fontAccordionContainerEl) {
        accordionEl.style.maxHeight = '0px';
        accordionEl.classList.remove('open');
        accordionEl.parentElement
          .querySelector('#theme-accordion-arrow')
          .classList.remove('rotate-180');
      }
    });
    if (!this.fontAccordionContainerEl.classList.contains('open')) {
      this.fontAccordionContainerEl.style.maxHeight =
        this.fontAccordionContainerEl.scrollHeight + 'px';
      this.fontAccordionContainerEl.classList.add('open');
      this.fontArrowIconEl.classList.add('rotate-180');
    } else {
      this.resetAccordion();
    }
  }

  resetAccordion() {
    if (!this.fontAccordionContainerEl) return;

    this.fontAccordionContainerEl.style.maxHeight = '0px';
    this.fontAccordionContainerEl.classList.remove('open');

    this.fontArrowIconEl.classList.remove('rotate-180');
  }

  clearIndicatorEls() {
    const btnWrapperEls =
      this.contentArea.querySelectorAll('.highlight-wrapper');

    btnWrapperEls.forEach((btnWrapperEl) => (btnWrapperEl.innerHTML = ''));
  }

  activateIndicator(fontName) {
    document.getElementById(`${fontName}-highlight-wrapper`).innerHTML =
      this.activeIndicatorTemplate();
  }

  updateActiveTheme(fontName) {
    this.activeFontEl = document.getElementById('active-font-name');
    console.log(this.activeFontEl);

    this.activeFontEl.textContent = '';
    this.activeFontEl.textContent = fontName;
  }

  activateFont(fontName) {
    this.clearIndicatorEls();
    this.fontName = fontName;
    fontsModel.applyAndSaveFont(this.fontName);
    this.activateIndicator(this.fontName);
    this.updateActiveTheme(fontName);
  }
}

export const fontsLargeObj = new FontsMediumActions();
