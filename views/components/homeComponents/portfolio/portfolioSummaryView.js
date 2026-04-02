class PortfolioSummary {
  constructor() {
    this.parentEl = document.getElementById('portfolio-summary');
  }

  markup() {
    return `
      <p
        id="portfolio-label"
        class="text-textBase-darkGray text-sm md:text-md tracking-wide"
      >
        Est. Total (USDT)
      </p>

      <!-- Total + Add Button -->
      <div
        id="portfolio-total-container"
        class="flex items-center justify-between"
      >
        <p
          id="portfolio-total"
          class="text-3xl md:text-3xl lg:text-4xl font-bold leading-tight"
        >
          $0.00
        </p>

        <button
          id="btn-add-holding"
          class="text-sm font-semibold rounded-xl bg-brand/90 text-appBg-white px-3 py-1.5 hover:shadow-md active:scale-[0.98] transition-all duration-200 ease-in-out md:px-4 md:py-2 md:text-sm shadow-sm hover:bg-brand" 
          data-action='show-add-holdings'
        >
          Add Holdings
        </button>
      </div>
    `;
  }

  renderPortfolioSummary() {
    this.parentEl.innerHTML = this.markup();
  }
}

export const portfolioSummary = new PortfolioSummary();
