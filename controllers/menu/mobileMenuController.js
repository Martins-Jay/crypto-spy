// controllers/menus/mobileMenuController.js
import { subscribe } from '../../helpers/pubsub.js';
import { logoutUser } from '../../models/auth/authModel.js';
import { settingsActionsObj } from '../../views/settingsView.js';
import { modeAndThemeObj } from '../../views/menuDevices/modeThemeMobileView.js';
import { fontActionsObj } from '../../views/menuDevices/fontsMobileView.js';
import * as menuView from '../../views/menuView.js';
import { greetingObj } from '../../views/components/homeComponents/greetingView.js';

class MobileMenuController {
  constructor() {
    this._setupSubscriptions();
  }

  // --- Menu Actions ---
  _handleMenuActions({ action, device }) {
    if (action === 'return-home' && device === 'mobile') {
      menuView.menuActionsObj.hideMobileMenu();
      setTimeout(() => menuView.menuActionsObj.hideSocialWrapper(device), 500);
    }
    if (action === 'card-right-arrow' && device === 'mobile') {
      menuView.menuActionsObj.renderSocials(device);
    }
    if (action === 'mobile-settings' && device === 'mobile') {
      menuView.menuActionsObj.renderSettings(device);
      setTimeout(() => menuView.menuActionsObj.hideSocialWrapper(device), 500);
    }
  }

  // --- Settings Actions ---
  async _handleSettingsActions({ action }) {
    if (action === 'return-to-menu') settingsActionsObj.backToMenu();
    if (action === 'mode-theme') {
      settingsActionsObj.toggleModeThemeState();
      modeAndThemeObj.renderModeTemplate();
      modeAndThemeObj.restoreHighlight();
    }
    if (action === 'show-font-pannel') {
      settingsActionsObj.toggleFontState();
      fontActionsObj.renderFonts();
    }
    if (action === 'logout') {
      await logoutUser();
      greetingObj.clearName();
    }
  }

  // --- Mode & Theme ---
  _handleModeAndThemeActions({ action, mode }) {
    if (action === 'return-to-settings') {
      settingsActionsObj.toggleModeThemeState();
      modeAndThemeObj.showActiveTheme();
    }
    if (action === 'system-mode') modeAndThemeObj.toggleSystem(mode);
    if (action === 'light-mode') modeAndThemeObj.toggleLight(mode);
    if (action === 'dark-mode') modeAndThemeObj.toggleDark(mode);
    if (action === 'default-mode') modeAndThemeObj.toggleDefault(mode);
  }

  // --- Fonts ---
  _handleFontActions({ action }) {
    if (action === 'return-to-settings') {
      settingsActionsObj.toggleFontState();
      fontActionsObj.showActiveFont();
    }
    if (action === 'activate-font-1') fontActionsObj.activateFont('inter');
    if (action === 'activate-font-2') fontActionsObj.activateFont('rubik');
    if (action === 'activate-font-3')
      fontActionsObj.activateFont('spaceGrotesk');
    if (action === 'activate-font-4') fontActionsObj.activateFont('spectral');
    if (action === 'activate-font-5')
      fontActionsObj.activateFont('tagesschrift');
  }

  // --- Subscriptions Setup ---
  _setupSubscriptions() {
    subscribe('menu:mobile:action', this._handleMenuActions.bind(this));
    subscribe('settings:mobile:action', this._handleSettingsActions.bind(this));
    subscribe(
      'settings:modeAndTheme:action',
      this._handleModeAndThemeActions.bind(this)
    );
    subscribe('settings:fonts:action', this._handleFontActions.bind(this));
  }
}

export default MobileMenuController;
