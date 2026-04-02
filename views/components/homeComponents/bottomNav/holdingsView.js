class Holdings {
  constructor() {
    this.cardsContainer = document.getElementById('cards-track');
    this.scrollbarIndicator = document.getElementById('scrollbar-indicator');
    this.holdingsSummaryWrapper = document.getElementById(
      'holdings-summary-wrapper',
    );
  }

  fetchAssetCount(holdings) {
    const accessCountEl = document.getElementById('value-location');
    if (!accessCountEl) return;

    accessCountEl.outerHTML = `
      <span class="ml-1 font-bold">${holdings.length}</span>
    `;
  }

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
 
        <!-- Total-->
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
          
            <div id='value-location' class="flex bg-gray-400 w-6 h-3 ml-1 rounded-3xl animate-pulse"></div>
          </div>
          
        </div>
      </div>
    `;
  }

  injectSummaryTemplate() {
    this.holdingsSummaryWrapper.innerHTML = this.summaryTemplate();
  }

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

  /* ----------------------------
     Skeleton Loader
  ------------------------------ */
  showSkeletons(count = 3) {
    this.cardsContainer.innerHTML = '';

    // since we created an element with document.createElement, we must use appendChild()
    for (let i = 0; i < count; i++) {
      this.cardsContainer.appendChild(this._createSkeletonCard());
    }
  }

  generateCardDisplayItems(cardData) {
    const cardInfoFields = [
      { label: 'Buy Price (USDT)', value: cardData.buyPrice, colorClass: '' },
      { label: 'Sell Price (USDT)', value: cardData.sellPrice, colorClass: '' },
      {
        label: 'Amount Invested',
        value: cardData.amountInvested,
        colorClass: '',
      },
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

    const cardDisplayItems = cardInfoFields
      .map(
        (infoObj) => `
        <div>
          <p class="text-gray-400 dark:text-gray-400 text-xs font-bold">
            ${infoObj.label}
          </p>
          <p class="text-xs">$${infoObj.value}</p>
        </div>
      `,
      )
      .join('');

    return cardDisplayItems;
  }

  // Create a single card
  createCard(cardData) {
    // Container for single card
    const cardWrapperEl = document.createElement('div');
    cardWrapperEl.className = 'flex snap-start';

    //hover:scale-[1.02]
    cardWrapperEl.innerHTML = `
      <div data-id='${cardData.id}' data-action="delete-holding" class="flex flex-col py-4 px-6 w-[90vw] max-w-[80vw] md:max-w-[40vw] lg:max-w-[30vw] light:text-gray-900 dark:text-gray-100 text-white bg-menuCard-glass light:bg-menuCard-menuLightBg backdrop-blur-2xl rounded-3xl border border-appBg-white/10 dark:border-x-border-subtle shadow-md space-y-4 transition-all duration-300"> 

        <!-- Top Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-brand/60 light:text-white font-black text-sm">
              ${cardData.coinSymbol}
            </div>
            <div>
              <h3 class="text-md font-bold text-gray-400 dark:text-gray-400">Exchange</h3>
              <p class="text-xs light:text-gray-900 dark:text-gray-100 text-white">${
                cardData.exchangeName
              }</p>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="w-full h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent"></div>

        <!-- Info Grid -->
        <div class="grid grid-cols-2 gap-y-3 text-sm">
          ${this.generateCardDisplayItems(cardData)}
        </div>

        <!-- Footer Buttons -->
        <div class="flex justify-end">
          <button id='card-delete-holding-btn' class="px-4 py-2 rounded-full text-xs font-medium bg-red-500/80 dark:text-appBg-white text-white hover:bg-red-500/30 transition">
            Delete
          </button>
        </div>
      </div>
    `;

    return cardWrapperEl;
  }

  /** Add a single card: cardData from  cardsArray.forEach((cardData) => )*/
  addCard(cardData) {
    const cardElement = this.createCard(cardData);

    this.cardsContainer.appendChild(cardElement); // since we created an element with document.createElement, we must use appendChild()
  }

  /** Load multiple cards */
  loadCards(cardsArray) {
    if (cardsArray.length === 0) return;

    this.cardsContainer.innerHTML = ''; // clear existing shadow cards

    cardsArray.forEach((cardData) => this.addCard(cardData));

    // Hydrate asset count AFTER DOM exists
    this.fetchAssetCount(cardsArray);

    this.initScrollListener(); // update scrollbar after cards are added
  }

  initScrollListener() {
    if (!this.scrollbarIndicator) return;

    this.cardsContainer.addEventListener('scroll', () => {
      this.updateScrollbar();
    });

    // Initial sync (important when cards are first added)
    this.updateScrollbar();
  }

  updateScrollbar() {
    // Stop if scrollbar indicator does not exist
    if (!this.scrollbarIndicator) return;

    const container = this.cardsContainer;
    const indicator = this.scrollbarIndicator;
    const track = indicator.parentElement;

    // -----------------------------
    // Sizes
    // -----------------------------
    const totalContentWidth = container.scrollWidth; // Total width of all cards
    const visibleWidth = container.clientWidth; // Visible width of the container
    const scrollableWidth = totalContentWidth - visibleWidth; // Maximum scrollable distance
    const scrolledDistance = container.scrollLeft; // Current horizontal scroll position

    // -----------------------------------------------------------------------------------
    // Percent of the scroll track the indicator should move based on where we are in the scroll.
    // -----------------------------------------------------------------------------------
    let viewportFraction = visibleWidth / totalContentWidth; // Fraction of content currently visible

    // If everything fits (no overflow), cap it at 1 (100%)
    if (viewportFraction > 1) viewportFraction = 1; // Cap at 1 so we get 100% if everything fits

    const indicatorWidthPercent = viewportFraction * 100; // Width of the indicator as a percentage

    // -----------------------------
    // Indicator position
    // -----------------------------
    let scrollFraction = 0;

    if (scrollableWidth > 0) {
      scrollFraction = scrolledDistance / scrollableWidth; // Fraction of scroll completed
    }

    const maxIndicatorMovePercent = 100 - indicatorWidthPercent; // Max % the indicator can move
    const indicatorLeftPercent = scrollFraction * maxIndicatorMovePercent; // Left position as %

    // -----------------------------
    // Apply styles
    // -----------------------------
    indicator.style.width = `${indicatorWidthPercent}%`;
    indicator.style.left = `${indicatorLeftPercent}%`;
  }

  initMethods() {
    this.injectSummaryTemplate();
    this.initScrollListener();
    this.showSkeletons(3);
  }
}

export const holdingsView = new Holdings();
