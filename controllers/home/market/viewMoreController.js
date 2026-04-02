import MarketModel from '../../../models/market/marketModel.js';
import { marketView } from '../../../views/components/homeComponents/marketView.js';
import { subscribe } from '../../../helpers/pubsub.js';
import { marketController } from './marketController.js';

class ViewMoreController {
  constructor() {
    this.model = new MarketModel();
    this.retryDelay = 10000; // retry interval if API fails
    this._liveUnsubscribe = null; // holds unsubscribe function for live updates
    this.viewMoreContainerId = 'view-more-list-container';
    this.parentEL = document.getElementById('view-more-panel');
  }

  /* ============================================================
     INITIALIZATION: ENTRY POINT
  ============================================================ */
  async init() {
    // SUBSCRIBE to the custom Pub/Sub event (triggered from MarketView)
    subscribe('market:view-more', async ({ action }) => {
      if (action === 'show-more-coins') {
        // Show skeleton inside the panel initially
        marketView.renderLoadingSkeleton(50, this.viewMoreContainerId);

        // Wait for the slide-in animation to finish before loading data
        this.parentEL.addEventListener(
          'transitionend',
          async () => {
            await this.loadTabData('top', 50, this.viewMoreContainerId);
          },
          { once: true }
        );

        // Handle tab switching inside the "View More" panel
        marketView.renderViewMorePanel(async (tabName) => {
          await this.loadTabData(tabName, 50, this.viewMoreContainerId);
        });
      }

      if (action === 'return-home') {
        marketView.renderHome();
        await marketController.init()
      }
    });
  }

  /* ============================================================
     SAFE LOADER (Retries if API fails)
  ============================================================ */
  async safeLoadTabData(tabName, value, id) {
    try {
      await this.loadTabData(tabName, value, id);
    } catch (err) {
      // Retry after delay
      setTimeout(
        () => this.safeLoadTabData(tabName, value, id),
        this.retryDelay
      );
    }
  }

  /* ============================================================
     LOAD DATA + HANDLE REAL-TIME UPDATES
  ============================================================ */
  async loadTabData(tabName, value, id) {
    // Show loading skeleton before data arrives
    marketView.renderLoadingSkeleton(value, id);

    let data = [];

    switch (tabName) {
      case 'favorites':
        data = []; // Future: load from Firestore
        break;
      case 'top':
        data = await this.model.fetchTopCoins(value);
        break;
      case 'gainers':
        data = await this.model.fetchGainers(value);
        break;
      case 'losers':
        data = await this.model.fetchLosers(value);
        break;
      case 'trending':
        data = await this.model.fetchTrending(value);
        break;
      default:
        console.warn(`Unknown tabName: ${tabName}`);
        return;
    }

    // Render list of assets
    marketView.renderAsset(data, id);

    // Clean up previous WebSocket subscription before starting a new one
    if (typeof this._liveUnsubscribe === 'function') {
      this._liveUnsubscribe(); // unsubscribe old listener
      this._liveUnsubscribe = null;
    }

    // Start receiving live updates for displayed coins
    await this.model.startLiveUpdates(data);

    // Subscribe to model updates and store unsubscribe fn
    this._liveUnsubscribe = this.model.subscribe((coinUpdate) => {
      // coinUpdate: { symbol, price, change }
      marketView.updateCoinPrice({ ...coinUpdate, containerId: id });
    });
  }
}

export const viewMoreController = new ViewMoreController();
