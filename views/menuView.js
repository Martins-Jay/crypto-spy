// menuController.js (refactor — preserves original API names)
// ---------------------------------------------------------------------
// Imports (unchanged)
import { renderTemplate } from '../helpers/templateHelper.js';
import { dashboardSectionEl, authSectionEl } from '../views/authView.js';
import { modeAndThemeMediumViewObj } from './menuDevices/modeThemeMediumView.js';
import { fontsMediumActionsObj } from './menuDevices/fontsMediumView.js';
import { ThemeManager } from '../models/ui/themeManager.js';
import { fontsModel } from '../models/ui/fontModel.js';

import * as domHelpers from '../helpers/domHelpers.js';
import { publish } from '../helpers/pubsub.js';
import { navViewObj } from './navView.js';

// ---------------------------------------------------------------------
// Helper: safe getElementById. call by running $(id)
const $ = (id) => document.getElementById(id);

// Shared theme manager instance (same as your original)
const themeManagerObj = new ThemeManager();

// ---------------------------------------------------------------------
export const menuToggleBtns = {
  mobileToggleBtn: $('menu-toggle-btn'),
  mediumToggleBtn: $('medium-menu-btn'),
};

export const menuElements = {
  mobile: {
    aside: $('mobile-menu-container'),
    overlay: $('mobile-menu-overlay'),
    contentArea: $('mobile-menu-content'),
    dataset: $('mobile-menu-content')?.dataset.screen,
  },

  mobileSettings: {
    aside: $('mobile-settings-container'),
    overlay: $('mobile-settings-overlay'),
    contentArea: $('mobile-settings-content'),
    modeThemeContentArea: $('mode-theme-panel'),
    fontsContentArea: $('fonts-panel'),
  },

  medium: {
    aside: $('medium-menu-container'),
    overlay: $('medium-menu-overlay'),
    contentArea: $('medium-menu-content'),
    bottomNav: $('bottom-nav'),
  },

  desktop: {
    navProfileDropdownEl: $('nav-profile-dropdown'),
    navSettingsdropdownEl: $('nav-settings-dropdown'),
  },
};

export const templates = {
  menuItemsTemplate: $('menu-template'),
  settingsPanelTemplate: $('settings-template'),
  modeAndThemeTemplate: $('mode-theme-template'),
  fontsTemplate: $('fonts-template'),
};

// ---------------------------------------------------------------------
export function getUserInfoElements() {
  return {
    userNameEls: document.querySelectorAll('.user-name'),
    userEmailEls: document.querySelectorAll('.user-email'),
    userIdEls: document.querySelectorAll('.user-id'),
  };
}

// ---------------------------------------------------------------------
export function renderMenu(screen) {
  switch (screen) {
    case 'mobile':
      if (menuElements.mobile.contentArea && templates.menuItemsTemplate) {
        renderTemplate(
          menuElements.mobile.contentArea,
          templates.menuItemsTemplate,
        );
      }
      break;

    case 'medium':
      if (menuElements.medium.contentArea && templates.menuItemsTemplate) {
        renderTemplate(
          menuElements.medium.contentArea,
          templates.menuItemsTemplate,
        );
      }
      if (menuElements.medium.contentArea && templates.settingsPanelTemplate) {
        renderTemplate(
          menuElements.medium.contentArea,
          templates.settingsPanelTemplate,
          { screen: 'medium' },
        );
      }
      break;

    case 'desktop':
      if (
        menuElements.desktop.navProfileDropdownEl &&
        templates.menuItemsTemplate
      ) {
        renderTemplate(
          menuElements.desktop.navProfileDropdownEl,
          templates.menuItemsTemplate,
        );
      }
      if (
        menuElements.desktop.navSettingsdropdownEl &&
        templates.settingsPanelTemplate
      ) {
        renderTemplate(
          menuElements.desktop.navSettingsdropdownEl,
          templates.settingsPanelTemplate,
          { screen: 'large' },
        );
      }
      break;

    default:
      // unknown screen — no-op
      break;
  }
}

// ---------------------------------------------------------------------
// initMenuButtons: attach event handlers
export function initMenuButtons() {
  const bodyEl = document.querySelector('body');
  const navHeader = document.getElementById('#header'); // your nav wrapper

  if (menuToggleBtns.mobileToggleBtn) {
    menuToggleBtns.mobileToggleBtn.addEventListener('click', () => {
      publish('menu:open', { screen: 'mobile' });
    });
  }

  if (menuToggleBtns.mediumToggleBtn) {
    menuToggleBtns.mediumToggleBtn.addEventListener('click', () => {
      publish('menu:open', { screen: 'medium' });
    });
  }

  // Attach a single body click listener (used by controllers to close dropdowns)
  if (bodyEl) {
    bodyEl.addEventListener('click', (e) => {
      const navBtnClicked = e.target;
      const isInsideHeader = navBtnClicked.closest('#header');

      if (!isInsideHeader) {
        publish('desktop:bodyEL', { screen: 'desktop' });
        // console.log('Outside click → closing dropdowns');
        navViewObj.handleAppReset();
        navViewObj.closeAllAccordion();
      }
    });
  }
}

// ---------------------------------------------------------------------
export function showMenu(screen) {
  const menu = menuElements[screen];
  if (!menu || !menu.aside || !menu.contentArea) return;

  // ---------- Mobile behavior (slide-in / slide-out)
  if (screen === 'mobile') {
    // Guard checks (defensive)
    const { aside, contentArea } = menu;
    if (!aside || !contentArea) return;

    // Toggle hidden state immediately (controls layout)
    aside.classList.toggle('hidden');

    // Small timeout to allow the browser to apply the change before starting transition
    setTimeout(() => {
      contentArea.classList.toggle('translate-x-full');
    }, 10);
    return;
  }

  // ---------- Medium behavior (overlay + accordion resets)
  if (screen === 'medium') {
    const mediumBtn = menuToggleBtns.mediumToggleBtn;
    if (!mediumBtn) return;

    mediumBtn.classList.toggle('open');
    const overlayEl = menuElements.medium.overlay;
    const { aside, contentArea, bottomNav } = menuElements.medium;

    const isOpen = mediumBtn.classList.contains('open');

    // Update active theme & font display (if elements exist)
    const activeThemeEl = document.querySelector(
      '#medium-menu-content #active-theme-name',
    );
    const activeFontEl = document.querySelector(
      '#medium-menu-content #active-font-name',
    );
    if (activeThemeEl)
      activeThemeEl.textContent = themeManagerObj.getCurrentMode() || '';
    if (activeFontEl) activeFontEl.textContent = fontsModel.getFont() || '';

    if (isOpen) {
      // show medium menu
      aside?.classList.remove('invisible');
      console.log(document.querySelector('[data-nav]'));
      contentArea?.classList.remove('opacity-0', 'invisible');
      contentArea?.classList.add('opacity-100', 'visible');
      document.querySelector('[data-nav]')?.classList.add('md:hidden');

      if (overlayEl) {
        overlayEl.onclick = () => {
          aside.classList.add('invisible');
          contentArea.classList.remove('opacity-100', 'visible');
          contentArea.classList.add('opacity-0', 'invisible');
          mediumBtn.classList.remove('open');
          document.querySelector('[data-nav]')?.classList.remove('md:hidden');

          // reset view accordions (safe check)
          if (modeAndThemeMediumViewObj?.resetAccordion)
            modeAndThemeMediumViewObj.resetAccordion();
          if (fontsMediumActionsObj?.resetAccordion)
            fontsMediumActionsObj.resetAccordion();
        };
      }
    } else {
      // closing state
      aside?.classList.add('invisible');
      contentArea?.classList.remove('opacity-100', 'visible');
      contentArea?.classList.add('opacity-0', 'invisible');
      document.querySelector('[data-nav]')?.classList.remove('md:hidden');

      // Remove overlay onclick so it doesn't linger
      if (overlayEl) overlayEl.onclick = null;
    }
    return;
  }
}

// ---------------------------------------------------------------------
class MenuActions {
  hideMobileMenu() {
    const { aside, contentArea } = menuElements.mobile;

    // First transition-x-full
    setTimeout(() => {
      contentArea.classList.toggle('translate-x-full');
    }, 100);

    // Wait for transition to finish before hiding the aside to avoid jump
    // Use once: true to avoid multiple handlers stacking
    const onTransitionEnd = () => {
      aside.classList.add('hidden');
    };

    contentArea.addEventListener('transitionend', onTransitionEnd, {
      once: true,
    });
  }

  renderSocials(device) {
    const socialsWrapper = document.querySelector(
      `#${device}-menu-content #socials-wrapper`,
    );
    if (!socialsWrapper) return;

    if (socialsWrapper.classList.contains('max-w-0')) {
      socialsWrapper.classList.remove('max-w-0', 'opacity-0');
      socialsWrapper.classList.add('max-w-96', 'opacity-100');
    } else {
      socialsWrapper.classList.add('max-w-0', 'opacity-0');
      socialsWrapper.classList.remove('max-w-96', 'opacity-100');
    }
  }

  hideSocialWrapper(device) {
    const socialsWrapper = document.querySelector(
      `#${device}-menu-content #socials-wrapper`,
    );
    if (!socialsWrapper) return;

    if (!socialsWrapper.classList.contains('max-w-0')) {
      socialsWrapper.classList.add('max-w-0', 'opacity-0');
      socialsWrapper.classList.remove('max-w-96', 'opacity-100');
    }
  }

  renderSettings() {
    // Always reset content when opening settings
    if (!menuElements.mobileSettings.contentArea) return;

    menuElements.mobileSettings.contentArea.innerHTML = '';

    if (templates.settingsPanelTemplate) {
      renderTemplate(
        menuElements.mobileSettings.contentArea,
        templates.settingsPanelTemplate,
      );
    }

    menuElements.mobileSettings.aside?.classList.remove('hidden');

    // Slide-in transform — small timeout to allow CSS to pick up the change
    setTimeout(() => {
      menuElements.mobileSettings.contentArea?.classList.toggle(
        'translate-x-full',
      );
    }, 10);

    // Update active theme/font in the settings view (defensive)
    const currentThemeInUse = themeManagerObj.getCurrentMode();
    const currentFontInUse = localStorage.getItem('appFont');

    const activeThemeEl = document.querySelector(
      '#mobile-settings-content #active-theme-name',
    );
    const activeFontEl = document.querySelector(
      '#mobile-settings-content #active-font-name',
    );

    if (activeThemeEl)
      activeThemeEl.textContent = currentThemeInUse || 'System';
    if (activeFontEl) activeFontEl.textContent = currentFontInUse || 'Inter';
  }
}

// ---------------------------------------------------------------------
class OnLogout {
  mobileDevice() {
    menuElements.mobileSettings.aside?.classList.add('hidden');
    menuElements.mobileSettings.contentArea?.classList.add('translate-x-full');

    menuElements.mobile.aside?.classList.add('hidden');
    menuElements.mobile.contentArea?.classList.add('translate-x-full');


  }

  mediumDevice() {
    const mediumBtn = $('medium-menu-btn');
    const isOpen = mediumBtn?.classList.contains('open'); // True if open

    if (isOpen) {
      mediumBtn.classList.remove('open');

      // hide medium aside + content
      menuElements.medium.aside?.classList.add('invisible', 'hidden');
      menuElements.medium.contentArea?.classList.remove(
        'opacity-100',
        'visible',
      );
      menuElements.medium.contentArea?.classList.add('opacity-0', 'invisible');
    }

    // restore hidden removal after transition so future opens work as expected
    setTimeout(() => {
      menuElements.medium.aside?.classList.remove('hidden');
    }, 100);
  }

  forScreen(screen) {
    if (screen === 'mobile') {
      this.mobileDevice();
    } else if (screen === 'medium') {
      this.mediumDevice();
    }
  }
}

export const menuActionsObj = new MenuActions();
export const onLogoutObj = new OnLogout();
