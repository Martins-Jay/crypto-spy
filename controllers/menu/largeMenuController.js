// controllers/menu/largeMenuController.js
import { subscribe } from '../../helpers/pubsub.js';
import { navViewObj } from '../../views/navView.js';
import { modeThemeLargeObj } from '../../views/menuDevices/modeThemeLarge.js';
import { fontsLargeObj } from '../../views/menuDevices/fontsLarge.js';
import { logoutUser } from '../../models/auth/authModel.js';
import { greetingObj } from '../../views/components/homeComponents/greetingView.js';

class LargeMenuController {
  constructor() {
    this._registerSubscriptions();
  }

  // central handler (arrow avoids needing .bind)
  _handleActions = async ({ action, device, mode }) => {
    const actionMap = {
      'logout-for-large': async () => {
        await logoutUser();
        navViewObj.handleAppReset();
        greetingObj.clearName();
      },

      'profile-dropdown': () => {
        navViewObj.toggleProfileDropdown();
        navViewObj.closeAllAccordion();
      },

      'settings-dropdown': () => {
        navViewObj.toggleSettingsDropdown();
      },

      'mode-theme': () => {
        modeThemeLargeObj.renderHTML(device);
        modeThemeLargeObj.toggleModeAccordion();
      },

      'system-mode': () => modeThemeLargeObj.toggleSystem(mode),
      'light-mode': () => modeThemeLargeObj.toggleLight(mode),
      'dark-mode': () => modeThemeLargeObj.toggleDark(mode),
      'default-mode': () => modeThemeLargeObj.toggleDefault(mode),

      'show-font-pannel': () => {
        fontsLargeObj.renderHTML(device);
        fontsLargeObj.toggleFontsAccordion(device);
      },

      'activate-font-1': () => fontsLargeObj.activateFont('inter'),
      'activate-font-2': () => fontsLargeObj.activateFont('rubik'),
      'activate-font-3': () => fontsLargeObj.activateFont('spaceGrotesk'),
      'activate-font-4': () => fontsLargeObj.activateFont('spectral'),
      'activate-font-5': () => fontsLargeObj.activateFont('tagesschrift'),
    };

    const handler = actionMap[action];
    if (handler) {
      await handler();
    }
    // else: unknown action — intentionally silent (or console.warn if you prefer)
  };

  _registerSubscriptions() {
    subscribe('nav:menu::action', this._handleActions);
  }
}

export default LargeMenuController;
