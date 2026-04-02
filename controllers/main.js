import * as AuthController from './auth/authController.js';
import { loaderEl } from '../views/authView.js';
import * as MenuController from './menu/mobileController/mobileController.js';
import { initMenuButtons } from '../views/menuView.js';
import { loadSVGSprite } from './spriteSVGController/iconController.js';
import { themeManager } from '../models/ui/themeManager.js';
import { fontActionsObj } from '../views/menuDevices/fontsMobileView.js';
import { greetingControllerObj } from './home/greetingController.js';
import sessionController from './session/sessionController.js';
import { portfolioController } from './home/portfolioController.js';
import MarketModel from '../models/market/marketModel.js';
import { marketController } from './home/market/marketController.js';
import { viewMoreController } from './home/market/viewMoreController.js';
import { holdingsPanel } from './home/holdingsPanelController.js';
import { holdingsDataController } from './holdingsData/holdingsDataController.js';
import { onAuthStateChanged, auth } from '../firebase/firebaseInit.js';
import { bottomNav } from '../views/components/homeComponents/bottomNavView.js';
import { holdingsView } from '../views/components/homeComponents/bottomNav/holdingsView.js';


const marketModel = new MarketModel();

document.addEventListener('DOMContentLoaded', async () => {
  try {
    loaderEl.classList.remove('hidden');
    bottomNav.renderBottomNav();

    holdingsView.initMethods();

    sessionController.init();
    holdingsPanel.init();

    loadSVGSprite();
    themeManager.init();
    fontActionsObj.init();

    AuthController.initAuthToggle();
    AuthController.initTogglePasswordVisibility();
    AuthController.handleLoginValidation();
    AuthController.handleSignupValidation();

    greetingControllerObj.initGreetingUi();
    portfolioController.initPortfolioSummary();
    await marketController.init();
    await viewMoreController.init();

    holdingsDataController.init();

    initMenuButtons();
    MenuController.initMenuController();
    MenuController.init();

    onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        await holdingsDataController.loadHoldings(user.uid);
      } catch (err) {
        console.error('Failed to load holdings:', err.message);
      }
    });
  } catch (err) {
  } finally {
    loaderEl.classList.add('hidden');
  }
});
