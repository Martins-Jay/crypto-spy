import { subscribe } from '../../helpers/pubsub.js';
import { modeAndThemeMediumViewObj } from '../../views/menuDevices/modeThemeMediumView.js';
import { fontsMediumActionsObj } from '../../views/menuDevices/fontsMediumView.js';
import { logoutUser } from '../../models/auth/authModel.js';
import { greetingObj } from '../../views/components/homeComponents/greetingView.js';

class MediumMenuController {
  constructor() {
    this._setupSubscriptions();
  }

  _handleMediumMenuActions({ action, device, mode }) {
    // Store action name as key and method as value
    const actionMapObj = {
      // Accordion toggle buttons
      'mode-theme': () => {
        modeAndThemeMediumViewObj.renderHTML(device);
        modeAndThemeMediumViewObj.toggleModeAccordion(device);
      },
      'show-font-pannel': () => {
        fontsMediumActionsObj.renderHTML(device);
        fontsMediumActionsObj.toggleFontsAccordion();
      },

      // Accordion content buttons
      'system-mode': () => modeAndThemeMediumViewObj.toggleSystem(mode),
      'light-mode': () => modeAndThemeMediumViewObj.toggleLight(mode),
      'dark-mode': () => modeAndThemeMediumViewObj.toggleDark(mode),
      'default-mode': () => modeAndThemeMediumViewObj.toggleDefault(mode),

      // Fonts
      'activate-font-1': () => fontsMediumActionsObj.activateFont('inter'),
      'activate-font-2': () => fontsMediumActionsObj.activateFont('rubik'),
      'activate-font-3': () =>
        fontsMediumActionsObj.activateFont('spaceGrotesk'),
      'activate-font-4': () => fontsMediumActionsObj.activateFont('spectral'),
      'activate-font-5': () =>
        fontsMediumActionsObj.activateFont('tagesschrift'),

      // Logout
      logout: async () => {
        await logoutUser();
        greetingObj.clearName();
      },
    };

    if (actionMapObj[action]) {
      actionMapObj[action]();
    }
  }

  _setupSubscriptions() {
    subscribe('menu:medium:action', this._handleMediumMenuActions.bind(this));
  }
}

export default MediumMenuController;
