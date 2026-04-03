class Holdings {
  constructor() {
    this.cardsContainer = document.getElementById('cards-track');
    this.scrollbarIndicator = document.getElementById('scrollbar-indicator');
    this.holdingsSummaryWrapper = document.getElementById(
      'holdings-summary-wrapper',
    );
  }

  /* ----------------------------
     Summary & Asset Count
  ------------------------------ */
  summaryTemplate() {
    return `
      <div class="section-title">
        <h2 class="text-xl font-bold">Overview</h2>
      </div>

      <div id="holdings-summary" class="flex flex-col space-y-2">
        <p
          id="portfolio-label"
          class="text-textBase-darkGray text-xs md:text-md tracking-wide"
        >
          Est. Total (USDT)
        </p>
 
        <!-- Total -->
        <div
          id="portfolio-total-container"
          class="flex items-center justify-between"
        >
          <p
            id="portfolio-total"
            class="text-3xl md:text-xl lg:text-4xl font-bold leading-tight"
          >
            $0.00
          </p>
        </div>

        <div id="asset-count" class="flex text-xs text-textBase-darkGray">
          <div class="flex items-center justify-center">
            <div>Asset Count:</div>
            <div id='value-location' class="flex ml-1 font-bold">0</div>
          </div>
        </div>
      </div>
    `;
  }

  injectSummaryTemplate() {
    if (!this.holdingsSummaryWrapper) return;
    this.holdingsSummaryWrapper.innerHTML = this.summaryTemplate();
  }

  fetchAssetCount(holdings) {
    const accessCountEl = document.getElementById('value-location');
    if (!accessCountEl) return;

    // Only update textContent
    accessCountEl.textContent = holdings.length;
  }

  /* ----------------------------
     Skeleton Loader
  ------------------------------ */
  _createSkeletonCard() {
    const skeleton = document.createElement('div');
    skeleton.className = `
      flex flex-col py-4 px-6 w-[90vw] bg-gray-300 dark:bg-gray-700 rounded-3xl animate-pulse
      space-y-4
    `;
    skeleton.innerHTML = `
      <div class="flex">
        <div class="flex items-center gap-5">
          <div class="w-10 h-10 rounded-full bg-gray-400 dark:bg-gray-600"></div>
          <div class="flex flex-col gap-1">
            <div class="h-6 w-40 bg-gray-400 dark:bg-gray-600 rounded"></div>
            <div class="h-6 w-14 bg-gray-400 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
      <div class="w-full h-px bg-gray-400 dark:bg-gray-600"></div>
      <div class="grid grid-cols-2 gap-y-3">
        <div class="h-4 w-full bg-gray-400 dark:bg-gray-600 rounded"></div>
        <div class="h-4 w-full bg-gray-400 dark:bg-gray-600 rounded"></div>
        <div class="h-4 w-full bg-gray-400 dark:bg-gray-600 rounded"></div>
        <div class="h-4 w-full bg-gray-400 dark:bg-gray-600 rounded"></div>
        <div class="h-4 w-full bg-gray-400 dark:bg-gray-600 rounded"></div>
      </div>
      <div class="flex justify-end">
        <div class="h-6 w-16 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
      </div>
    `;
    return skeleton;
  }

  showSkeletons(count = 3) {
    this.cardsContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
      this.cardsContainer.appendChild(this._createSkeletonCard());
    }
  }

  /* ----------------------------
     Card Rendering
  ------------------------------ */
  generateCardDisplayItems(cardData) {
    const cardInfoFields = [
      { label: 'Buy Price (USDT)', value: cardData.buyPrice },
      { label: 'Sell Price (USDT)', value: cardData.sellPrice },
      { label: 'Amount Invested', value: cardData.amountInvested },
      {
        label: 'Stop Loss (USDT)',
        value: cardData.stopLoss,
        colorClass: 'text-red-500',
      },
      {
        label: 'Take Profit (USDT)',
        value: cardData.takeProfit,
        colorClass: 'text-green-500',
      },
    ];

    return cardInfoFields
      .map(
        ({ label, value, colorClass = '' }) => `
          <div>
            <p class="text-gray-400 dark:text-gray-400 text-xs font-bold">${label}</p>
            <p class="text-xs ${colorClass}">$${value}</p>
          </div>
        `,
      )
      .join('');
  }

  createCard(cardData) {
    const cardWrapperEl = document.createElement('div');
    cardWrapperEl.className = 'flex snap-start';
    cardWrapperEl.innerHTML = `
      <div data-id='${cardData.id}' data-action="delete-holding"
        class="flex flex-col py-4 px-6 w-[90vw] max-w-[80vw] md:max-w-[40vw] lg:max-w-[30vw] light:text-gray-900 dark:text-gray-100 text-white
               bg-menuCard-glass light:bg-menuCard-menuLightBg backdrop-blur-2xl rounded-3xl border border-appBg-white/10 dark:border-x-border-subtle
               shadow-md space-y-4 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-brand/60 light:text-white font-black text-sm">
              ${cardData.coinSymbol}
            </div>
            <div>
              <h3 class="text-md font-bold text-gray-400 dark:text-gray-400">Exchange</h3>
              <p class="text-xs light:text-gray-900 dark:text-gray-100 text-white">
                ${cardData.exchangeName}
              </p>
            </div>
          </div>
        </div>
        <div class="w-full h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent"></div>
        <div class="grid grid-cols-2 gap-y-3 text-sm">
          ${this.generateCardDisplayItems(cardData)}
        </div>
        <div class="flex justify-end">
          <button id='card-delete-holding-btn' class="px-4 py-2 rounded-full text-xs font-medium bg-red-500/80 dark:text-appBg-white text-white hover:bg-red-500/30 transition">
            Delete
          </button>
        </div>
      </div>
    `;
    return cardWrapperEl;
  }

  addCard(cardData) {
    this.cardsContainer.appendChild(this.createCard(cardData));
  }

  loadCards(cardsArray) {
    this.cardsContainer.innerHTML = ''; // clear cards first

    this.injectSummaryTemplate(); // always re-inject summary

    cardsArray.forEach((card) => this.addCard(card));
    
    this.fetchAssetCount(cardsArray); // update fresh count
    this.initScrollListener();
  }

  initScrollListener() {
    if (!this.scrollbarIndicator) return;
    this.cardsContainer.addEventListener('scroll', () =>
      this.updateScrollbar(),
    );
    this.updateScrollbar();
  }

  updateScrollbar() {
    if (!this.scrollbarIndicator) return;
    const container = this.cardsContainer;
    const indicator = this.scrollbarIndicator;

    const totalContentWidth = container.scrollWidth;
    const visibleWidth = container.clientWidth;
    const scrollableWidth = totalContentWidth - visibleWidth;
    const scrollFraction =
      scrollableWidth > 0 ? container.scrollLeft / scrollableWidth : 0;

    const indicatorWidthPercent = Math.min(
      (visibleWidth / totalContentWidth) * 100,
      100,
    );
    const maxIndicatorMovePercent = 100 - indicatorWidthPercent;
    indicator.style.width = `${indicatorWidthPercent}%`;
    indicator.style.left = `${scrollFraction * maxIndicatorMovePercent}%`;
  }

  initMethods() {
    this.injectSummaryTemplate();
    this.initScrollListener();
    this.showSkeletons(3);
  }
}

export const holdingsView = new Holdings();
