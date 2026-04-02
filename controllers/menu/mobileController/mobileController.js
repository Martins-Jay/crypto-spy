import * as menuView from '../../../views/menuView.js';
import * as domHelpers from '../../../helpers/domHelpers.js';
import { modeAndThemeMediumViewObj } from '../../../views/menuDevices/modeThemeMediumView.js';
import { fontsMediumActionsObj } from '../../../views/menuDevices/fontsMediumView.js';

import MobileMenuController from '../mobileMenuController.js';
import MediumMenuController from '../mediumMenuController.js';
import LargeMenuController from '../largeMenuController.js';

import { loaderEl } from '../../../views/authView.js';

import {
  mainMenuObj,
  settingsMenuObj,
  mediumMenuObj,
  modeAndThemeMenuObj,
  fontsMenuObj,
  navMenuObj,
} from '../../publisher/menuPublisher.js';
import { subscribe } from '../../../helpers/pubsub.js';
import { observeUser } from '../../../models/auth/authModel.js';

// ------------------------------------------------
// Flag to ensure we dont attach subscriber twice
// ------------------------------------------------
let isInitialized = false;

// --------------------------
// Update user info in menu
// --------------------------
export function updateUserInfo(user) {
  const { userNameEls, userEmailEls, userIdEls } =
    menuView.getUserInfoElements();

  if (!user) {
    userNameEls.forEach((userNameEl) => (userNameEl.textContent = ''));
    userEmailEls.forEach((userEmailEl) => (userEmailEl.textContent = ''));
    userIdEls.forEach((userIdEl) => (userIdEl.textContent = ''));
    return;
  }

  const displayName = user?.displayName || 'User';
  const formattedName =
    displayName[0].toUpperCase() + displayName.slice(1).toLowerCase();
  const slicedUserID = user.uid.slice(0, 7);

  userNameEls.forEach((userNameEl) => (userNameEl.textContent = formattedName));
  userEmailEls.forEach((userEmailEl) => (userEmailEl.textContent = user.email));
  userIdEls.forEach(
    (userIdEl) =>
      (userIdEl.textContent = 'ID:' + ' ' + slicedUserID.toLowerCase() + '***')
  );
}

function renderMenusForUser(user) {
  if (user) {
    updateUserInfo(user);
  } else {
    menuView.onLogoutObj.forScreen('mobile');
    menuView.onLogoutObj.forScreen('medium');
    updateUserInfo(null);
  }
  domHelpers.hideAllSections(loaderEl);
}

export function initMenuController() {
  if (isInitialized) return;
  isInitialized = true;

  // Render menus at startup
  const screens = ['mobile', 'medium', 'desktop'];
  screens.forEach((screen) => menuView.renderMenu(screen));

  observeUser(renderMenusForUser);

  subscribe('menu:open', ({ screen }) => {
    menuView.showMenu(screen); // Hamburger menu control
    if (screen === 'medium') {
      modeAndThemeMediumViewObj.resetAccordion();
      fontsMediumActionsObj.resetAccordion();
    }
  });

  new MobileMenuController();
  new MediumMenuController();
  new LargeMenuController();
}

export function init() {
  mainMenuObj.addHandlerClick();
  settingsMenuObj.addHandlerClick();
  mediumMenuObj.addHandlerClick();
  modeAndThemeMenuObj.addHandlerClick();
  fontsMenuObj.addHandlerClick();
  navMenuObj.addHandlerClick();
}
