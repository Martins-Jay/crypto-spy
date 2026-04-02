import { ThemeManager } from '../models/ui/themeManager.js';
import { fontsModel } from '../models/ui/fontModel.js';

class NavView {
  constructor() {
    this.bodyEl = document.querySelector('.body');
    this.themeManagerObj = new ThemeManager();
    this.headerEl = document.getElementById('header');
    this.profileBtnEl = null;
    this.settingsBtnEl = null;
  }

  closePreviousDropdowns(currentDropdownEl) {
    this.dropdownContentEls = document.querySelectorAll('.dropdown-content');

    this.dropdownContentEls.forEach((dropdownContentEl) => {
      if (dropdownContentEl !== currentDropdownEl) {
        this.hideDropdown(dropdownContentEl);
      }
    });
  }

  /**
   * Generic toggle method
   * Handles showing/hiding any dropdown
   */
  toggleDropdown(dropdownEl) {
    this.closePreviousDropdowns(dropdownEl);

    if (dropdownEl.classList.contains('opacity-0')) {
      this.showDropdown(dropdownEl);
    } else {
      this.hideDropdown(dropdownEl);
    }
  }

  /** Helper: show dropdown */
  showDropdown(el) {
    el.classList.remove('opacity-0', 'pointer-events-none');
    el.classList.add('opacity-100', 'pointer-events-auto');
  }

  /** Helper: hide dropdown */
  hideDropdown(el) {
    el.classList.add('opacity-0', 'pointer-events-none');
    el.classList.remove('opacity-100', 'pointer-events-auto');
  }

  toggleProfileDropdown() {
    this.profileBtnEl = this.headerEl.querySelector('#nav-profile-dropdown');
    this.toggleDropdown(this.profileBtnEl);
  }

  toggleSettingsDropdown() {
    this.settingsBtnEl = this.headerEl.querySelector('#nav-settings-dropdown');
    this.activeThemeNameEl = document.getElementById('active-theme-name');
    this.activeFontNameEl = document.getElementById('active-font-name');

    // Update theme text before showing
    const activeTheme = this.themeManagerObj.getCurrentMode();
    this.activeThemeNameEl.innerHTML = activeTheme;
    this.activeFontNameEl.innerHTML = fontsModel.getFont();

    this.toggleDropdown(this.settingsBtnEl);
  }

  closeAllAccordion() {
    const dropdownContentEls = document.querySelectorAll(
      '#nav-settings-dropdown .accordion-content'
    );

    dropdownContentEls.forEach((dropdownContent) => {
      dropdownContent.classList.remove('open');
      dropdownContent.style.maxHeight = '0px';
    });
  }

  handleAppReset() {
    [this.profileBtnEl, this.settingsBtnEl].forEach((btnEl) => {
      if (btnEl && btnEl.classList.contains('opacity-100')) {
        this.hideDropdown(btnEl);
      }
    });
  }
}

export const navViewObj = new NavView();
