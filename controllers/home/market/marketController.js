import MarketModel from '../../../models/market/marketModel.js';
import { marketIntroView } from '../../../views/components/homeComponents/marketIntroView.js';
import { marketView } from '../../../views/components/homeComponents/marketView.js';

class MarketController {
  constructor() {
    this.model = new MarketModel();
    this.retryDelay = 10000; // retry interval if API fails
    this._liveUnsubscribe = null; // holds unsubscribe function for live updates
    this.homeLiveUpdatesActive = true;
  }

  #pauseHomeUpdates() {
    this.homeLiveUpdatesActive = false;
  }

  #resumeLiveHomeUpdates() {
    this.homeLiveUpdatesActive = true;
    this.safeLoadTabData('top');
  }

  /* ============================================================
     INITIALIZATION: ENTRY POINT
  ============================================================ */
  async init() {
    // Render static UI (intro + tab section)
    marketIntroView.renderMarkup();
    marketView.renderMarketTab();

    // Load default "Top" coins (home)
    await this.safeLoadTabData('top', 6, 'market-list-container');

    // Handle tab switching in the home section
    marketView.handleTabClick(async (tabName) => {
      await this.loadTabData(tabName, 5, 'market-list-container');
    });

    // PUBLISHER: Attach click event for “View More” button
    marketView.viewMoreClickHandler();
  }

  /* ============================================================
     SAFE LOADER (Retries if API fails)
  ============================================================ */
  async safeLoadTabData(tabName, value, id) {
    try {
      await this.loadTabData(tabName, value, id);
    } catch (err) {
      setTimeout(() => this.safeLoadTabData(tabName, value, id), this.retryDelay);
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
        return;
    }

    // Render list of assets
    marketView.renderAsset(data, id);

    // Clear old WebSocket subscription before starting new one
    if (typeof this._liveUnsubscribe === 'function') {
      this._liveUnsubscribe();
      this._liveUnsubscribe = null;
    }

    // Skip updates if paused (e.g., when View More is active)
    if (!this.homeLiveUpdatesActive) return;

    // Start receiving live updates for displayed coins
    await this.model.startLiveUpdates(data);

    // Subscribe to live model updates
    this._liveUnsubscribe = this.model.subscribe((coinUpdate) => {
      // coinUpdate: { symbol, price, change }
      marketView.updateCoinPrice({ ...coinUpdate, containerId: id });
    });
  }
}

export const marketController = new MarketController();
