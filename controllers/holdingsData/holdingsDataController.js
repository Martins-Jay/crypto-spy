import { holdingModel } from '../../models/holdings/holdingsModel.js';
import { holdingsPanelView } from '../../views/components/homeComponents/addHoldingsView.js';
import { holdingsView } from '../../views/components/homeComponents/bottomNav/holdingsView.js';
import { auth } from '../../firebase/firebaseInit.js';

import { subscribe } from '../../helpers/pubsub.js';
import { holdingsPublisher } from '../publisher/holdingsPublisher.js';

class HoldingsDataController {
  constructor() {
    this._initSubscriber();
  }

  async handleFormSubmit(formData) {
    try {
      const user = auth.currentUser;

      // ---- Validate coin ----
      if (!formData.coinSymbol || formData.coinSymbol.length < 2) {
        alert('Please enter a valid coin symbol like BTC or ETH.');
        return;
      }

      // ---- Save to Firestore ----
      await holdingModel.addHolding(user.uid, formData);

      // ---- Feedback ----
      alert('Holding added successfully!');
    } catch (error) {
      console.error('Error saving holding: ', error);
      alert(error.message);
    }
  }

  async loadHoldings(userUid) {
    const holdings = await holdingModel.fetchHoldings(userUid);

    holdingsView.loadCards(holdings); // send data to the view

    holdingsPanelView.getHoldings(holdings); // send data to addHoldingsView
  }

  _handleHoldingsActions({ action, cardID }) {
    const actionMapObj = {
      'delete-holding': () => {
        console.log('Deleting...');
      },
    };

    if (actionMapObj[action]) {
      actionMapObj[action]();
    }
  }

  _initSubscriber() {
    subscribe('Holdings:btn-clicked', this._handleHoldingsActions);
  }

  init() {
    holdingsPanelView.onSubmit((formData) => this.handleFormSubmit(formData)); // Listen for form submission

    // Activate publisher to listen for clicks
    holdingsPublisher.addHandlerClick();
  }
}

export const holdingsDataController = new HoldingsDataController();
