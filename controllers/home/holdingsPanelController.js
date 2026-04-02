import { renderTemplate } from '../../helpers/templateHelper.js';
import { subscribe } from '../../helpers/pubsub.js';
import { homePublisher } from '../publisher/homePublisher.js';
import { holdingsPanelView } from '../../views/components/homeComponents/addHoldingsView.js';
import MarketModel from '../../models/market/marketModel.js';

class HoldingsPanel {
  constructor() {
    this.marketModel = new MarketModel();
    // Helper: safe getElementById. call by running $(id)
    this.$ = (id) => document.getElementById(id);
    this.coinList = [];
  }

  async initExchangeAutoComplete() {
    // Load exchanges once on app start
    this.exchanges = await this.marketModel.loadExchanges();
    console.log(this.exchanges);

    holdingsPanelView.initExchangeAutoComplete((userValue) => {
      const enteredValueToLower = userValue.toLowerCase();

      return this.exchanges
        .filter((exchangeObj) =>
          exchangeObj.name.toLowerCase().startsWith(enteredValueToLower)
        )
        .slice(0, 10); // limit to 10 suggestions
    });
  }

  async initCoinAutoComplete() {
    // load Binance coin once
    this.coinList = await this.marketModel.loadBinanceCoins();
    console.log(this.coinList);

    holdingsPanelView.initCoinAutocomplete((userEnteredSymbol) => {
      return this.coinList
        .filter((c) => c.startsWith(userEnteredSymbol))
        .slice(0, 8);
    });
  }

  injectTemplatetoPanel() {
    const targetContainer = this.$('add-holdings-panel');
    const templateEl = this.$('add-holdings-template');

    if (!targetContainer) return;

    // If panel content hasnt been injected yet, inject it once
    if (!targetContainer.hasChildNodes()) {
      if (templateEl) renderTemplate(targetContainer, templateEl);
    }
  }

  _handleAction({ action }) {
    if (action === 'show-add-holdings') {
      holdingsPanelView.toggleVisibility();
    }
    if (action === 'close-holdings-panel') {
      holdingsPanelView.toggleVisibility();
    }
  }

  init() {
    homePublisher.addHandlerClick();
    this.injectTemplatetoPanel()
    this.initCoinAutoComplete()
    this.initExchangeAutoComplete()
    subscribe('home:btn-clicked', this._handleAction.bind(this));
  }
}

export const holdingsPanel = new HoldingsPanel();
