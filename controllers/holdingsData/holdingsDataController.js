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

      // Validate coin
      if (!formData.coinSymbol || formData.coinSymbol.length < 2) {
        alert('Please enter a valid coin symbol like BTC or ETH.');
        return;
      }

      // Save to Firestore
      await holdingModel.addHolding(user.uid, formData);

      // Feedback
      alert('Holding added successfully!');

      // Refresh the holdings view
      await this.loadHoldings(user.uid);
    } catch (error) {
      console.error('Error saving holding: ', error);
      alert(error.message);
    }
  }

  async loadHoldings(userUid) {
    const holdings = await holdingModel.fetchHoldings(userUid);

    console.log('FRESH DATA:', holdings);

    holdingsView.loadCards(holdings); // send data to the view
  }

  async handleHoldingsActions({ action, holdingId }) {
    const user = auth.currentUser;

    const actionMapObj = {
      'delete-holding': async () => {
        try {
          console.log('Deleting...');

          if (!user) return;

          await holdingModel.deleteHolding(user.uid, holdingId);

          const cardEl = document.querySelector(`[data-id="${holdingId}"]`);

          // Refresh holdings from Firestore
          await this.loadHoldings(user.uid);
        } catch (error) {}
      },

      'open-holdings': async () => {
        console.log('im here');
        const user = auth.currentUser;
        if (!user) return;

        await this.loadHoldings(user.uid);
      },
    };

    if (actionMapObj[action]) {
      await actionMapObj[action]();
    }
  }

  _initSubscriber() {
    // activate listening
    subscribe('Holdings:btn-clicked', this.handleHoldingsActions.bind(this));
    subscribe('navigation:changed', this.handleHoldingsActions.bind(this));
  }

  init() {
    holdingsPanelView.onSubmit((formData) => this.handleFormSubmit(formData)); // Listen for form submission

    // Activate publisher to listen for clicks
    holdingsPublisher.addHandlerClick();
  }
}

export const holdingsDataController = new HoldingsDataController();
