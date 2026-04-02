import { greetingObj } from '../../views/components/homeComponents/greetingView.js';
import { observeUser } from '../../models/auth/authModel.js';
import { greetingModelObj } from '../../models/dateTime/getGreeting.js';

class GreetingController {
  constructor() {}

  initGreetingUi() {
    const greetingText = greetingModelObj.greetingMessage();
    const cachedName = localStorage.getItem('username');

    // Show cached name immediately to avoid delay
    greetingObj.renderGreeting(cachedName, greetingText);

    // Observe Firebase user state
    observeUser((userObj) => {
      if (!userObj) return; // Ignore the first null emission

      const userName = userObj.displayName || cachedName;
      greetingObj.renderGreeting(userName, greetingText);

      // Clear cache once Firebase confirms the user
      if (userObj.displayName) localStorage.removeItem('username');
    });
  }
}

export const greetingControllerObj = new GreetingController();
