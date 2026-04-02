import { publish } from '../../../helpers/pubsub.js';

class MarketView {
  constructor() {
    this.marketTabEl = document.getElementById('market-tabs');
    this.marketListContainer = document.getElementById('market-list-container');
    this.marketSectionEl = document.getElementById('market-section');
    this.lastUpdate = {};
    this.lightClasses = ['text-black', 'font-bold'];
    this.darkClasses = ['text-white', 'font-bold'];
    this.selectedTabEl = null;
    this.lastUpdateTimes = {}; // Throttle price updates per coin
  }

  /* ============================
     RENDER MAIN MARKET TABS
  ============================ */
  tabMarkup({ tab, label }) {
    return `
      <button
        class="tab-item text-md rounded-md font-medium text-textBase-darkGray transition-colors"
        data-tab_name="${tab}"
      >
        ${label}
      </button>
    `;
  }

  renderMarketTab(id = 'market-tabs') {
    const parentEl = document.getElementById(id);
    if (!parentEl) return;

    const tabs = [
      { tab: 'top', label: 'Top' },
      { tab: 'gainers', label: 'Gainers' },
      { tab: 'losers', label: 'Losers' },
      { tab: 'trending', label: 'Trending' },
      { tab: 'favorites', label: 'Favorites' },
    ];

    parentEl.innerHTML = tabs.map(this.tabMarkup).join('');

    // Highlight the first tab by default
    const firstMatch = parentEl.querySelector('.tab-item');
    if (firstMatch) {
      firstMatch.classList.remove(
        'text-black',
        'text-white',
        'font-medium',
        'font-bold'
      );

      document.documentElement.classList.contains('light')
        ? firstMatch.classList.add(...this.lightClasses)
        : firstMatch.classList.add(...this.darkClasses);

      this.selectedTabEl = firstMatch;
    }

    // Observe theme switching for dynamic color change
    this.observeThemeChange(parentEl);
  }

  /* ============================
     THEME CHANGE OBSERVER
  ============================ */
  observeThemeChange(parentEl) {
    const observedEl = document.documentElement;

    const observer = new MutationObserver(() => {
      const tabEls = parentEl.querySelectorAll('.tab-item');
      tabEls.forEach((tabEl) =>
        tabEl.classList.remove(
          'text-white',
          'text-black',
          'font-bold',
          'font-medium'
        )
      );

      if (!this.selectedTabEl) return;

      observedEl.classList.contains('light')
        ? this.selectedTabEl.classList.add(...this.lightClasses)
        : this.selectedTabEl.classList.add(...this.darkClasses);
    });

    observer.observe(observedEl, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  /* ============================
     TAB CLICK HANDLER
  ============================ */
  handleTabClick(loadDataCB, id = 'market-tabs') {
    const parentEl = document.getElementById(id);
    if (!parentEl) return;

    parentEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-item');
      if (!btn) return;

      this.selectedTabEl = btn;

      const tabEls = parentEl.querySelectorAll('.tab-item');
      tabEls.forEach((tabEl) =>
        tabEl.classList.remove(
          'text-white',
          'text-black',
          'font-bold',
          'font-medium'
        )
      );

      document.documentElement.classList.contains('light')
        ? btn.classList.add(...this.lightClasses)
        : btn.classList.add(...this.darkClasses);

      const tabName = btn.dataset.tab_name;
      loadDataCB(tabName);
    });
  }

  /* ============================
     LOADING PLACEHOLDER
  ============================ */
  loadingSkelentonMarkup() {
    return `
      <div class='h-12 w-full bg-gray-800/40 rounded-md animate-pulse'></div>
    `;
  }

  renderLoadingSkeleton(value, id = 'market-list-container') {
    const parentEl = document.getElementById(id);

    const items = Array.from({ length: value });
    parentEl.innerHTML = items
      .map((_, i) => this.loadingSkelentonMarkup())
      .join('');
  }

  /* ============================
     MARKET ROW RENDERING
  ============================ */
  assetMarkup({
    name,
    symbol,
    image,
    current_price,
    price_change_percentage_24h,
  }) {
    const change = price_change_percentage_24h ?? 0;
    const changeClass = change >= 0 ? 'bg-green-500' : 'bg-red-500';
    const formattedPrice = this.formatPrice(current_price ?? 0);

    return `
      <div class="market-row grid grid-cols-3 items-center py-2 md:px-4" data-symbol="${symbol}">
        <!-- Coin Info -->
        <div class="flex items-center space-x-2">
          <img src="${image}" class="w-6 h-6 rounded-full" alt="${name}" />
          <div class="flex flex-col justify-center">
            <p class="font-semibold text-sm uppercase">${symbol}</p>
            <p class="text-xs text-gray-400">${name}</p>
          </div>
        </div>

        <!-- Price -->
        <div class="flex flex-col items-end justify-center">
          <p class="font-semibold text-sm" data-price>${formattedPrice}</p>
          <p class="text-xs text-gray-400" data-dollar-price>$${formattedPrice}</p>
        </div>

        <!-- 24h Change -->
        <div class="flex items-center justify-end">
          <div class="flex items-center justify-center w-16 h-7 rounded-md text-white text-xs ${changeClass}" data-change>
            ${change.toFixed(2)}%
          </div>
        </div>
      </div>
    `;
  }

  formatPrice(current_price) {
    if (current_price >= 1000)
      return current_price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    if (current_price >= 100) return current_price.toFixed(2);
    if (current_price >= 1) return current_price.toFixed(4);
    if (current_price >= 0.01) return current_price.toFixed(5);
    return current_price.toFixed(7);
  }

  renderAsset(data, id = 'market-list-container') {
    this._data = data;

    const listCointainerEL = document.getElementById(id);
    if (!Array.isArray(data) || data.length === 0) {
      listCointainerEL = document.getElementById(id);

      listCointainerEL = `<p class="text-center py-4 text-gray-500">No data available</p>`;
      return;
    }

    listCointainerEL.innerHTML = data.map(this.assetMarkup.bind(this)).join('');
  }

  /* ============================
     LIVE PRICE UPDATES
  ============================ */
  updateCoinPrice({
    symbol,
    price,
    change,
    containerId = 'market-list-container',
  }) {
    const now = Date.now();
    const lastUpdate = this.lastUpdateTimes[symbol] || 0;
    if (now - lastUpdate < 1000) return;

    this.lastUpdateTimes[symbol] = now;

    const row = document
      .getElementById(containerId)
      .querySelector(`[data-symbol="${symbol}"]`);
    if (!row) return;

    const priceEl = row.querySelector('[data-price]');
    const dollarEl = row.querySelector('[data-dollar-price]');
    const changeEl = row.querySelector('[data-change]');
    if (!priceEl || !dollarEl || !changeEl) return;

    const safePrice = price ?? 0;
    const safeChange = change ?? 0;

    const formattedPrice = this.formatPrice(safePrice);

    priceEl.textContent = formattedPrice;
    dollarEl.textContent = `$${formattedPrice}`;
    changeEl.textContent = `${safeChange >= 0 ? '+' : ''}${safeChange.toFixed(
      2
    )}%`;

    changeEl.classList.remove('bg-green-500', 'bg-red-500');
    changeEl.classList.add(safeChange >= 0 ? 'bg-green-500' : 'bg-red-500');
  }

  /* =========== PUBLISHER =================
     VIEW MORE BUTTON HANDLER
  ============================ */
  viewMoreClickHandler() {
    const parentEl = this.marketSectionEl;

    parentEl.addEventListener('click', (e) => {
      const actionEl = e.target.closest('[data-action]');
      if (!actionEl) return; // Prevents null error

      const action = actionEl.dataset.action;
      console.log(action);
      console.log('View more clicked:', action);
      publish('market:view-more', { action });
    });
  }

  renderViewMorePanel(loadDataCB) {
    const parentEl = this.marketSectionEl;
    const panelEl = parentEl.querySelector('#view-more-panel');
    if (!panelEl) return;

    // Always re-render tabs inside the panel
    this.renderMarketTab('view-more-tabs');

    // Observe theme for the new tab group
    const tabContainer = document.getElementById('view-more-tabs');
    if (tabContainer) this.observeThemeChange(tabContainer);

    // Attach new tab click handler
    this.handleTabClick(loadDataCB, 'view-more-tabs');

    // Show skeleton instantly before transition
    this.renderLoadingSkeleton('view-more-list-container');

    // Start the slide-in animation
    if (panelEl.classList.contains('translate-x-full')) {
      panelEl.classList.toggle('translate-x-full');
    }
  }

  renderHome() {
    const parentEl = this.marketSectionEl;
    const panelEl = parentEl.querySelector('#view-more-panel');

    console.log(panelEl);
    if (!panelEl.classList.contains('translate-x-full')) {
      panelEl.classList.toggle('translate-x-full');
    }
  }
}

export const marketView = new MarketView();
