import { observeUser } from '../../models/auth/authModel.js';
import { greetingControllerObj } from '../home/greetingController.js';
import { viewManager } from '../viewManager/viewManager.js';

const loaderEl = document.getElementById('loader');

// On refresh, ensure the correct sections are still displayed
const sessionController = {
  init() {
    // Show loader while Firebase checks session
    loaderEl.classList.remove('hidden');

    observeUser((user) => {
      loaderEl.classList.add('hidden');

      if (user) {
        // User logged in — update greeting and show dashboard
        const userName = user.displayName || localStorage.getItem('username');
        greetingControllerObj.initGreetingUi(userName);
        document.getElementById('holdings').classList.add('lg:flex');
        document.getElementById('holdings').classList.remove('md:hidden', 'lg:hidden');

        viewManager.hideAndShowRest(
          'auth-section',
          'home-section',
          'dashboard-section',
          'dashboard-header',
          'market-section',
          'bottom-nav',
        );
      } else {
        document.getElementById('holdings').classList.add('lg:flex');
        document.getElementById('holdings').classList.add('lg:hidden');
        // User logged out — show auth screen, hide others
        viewManager.showndHideRest(
          'auth-section',
          'home-section',
          'dashboard-section',
          'dashboard-header',
          'market-section',
          'bottom-nav',
        );
      }
    });
  },
};

export default sessionController;
