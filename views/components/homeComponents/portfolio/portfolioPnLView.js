class PortfolioPnLView {
  constructor() {
    this.parentEl = document.getElementById('portfolio-pnl')
  }

  markup() {
    return `
      <!-- Accumulated Profit -->
      <div class="pnl-item flex items-center space-x-2">
        <button
          id="pnl-accumulated-label"
          class="text-textBase-darkGray text-xs underline decoration-dotted underline-offset-4"
        >
          Accumulated Profit
        </button>
        <span
          id="profit-accumulated"
          class="text-[12px] text-state-success"
        >
          +$1.00 (+0.97%)
        </span>
      </div>

      <!-- Today's PNL -->
      <div class="pnl-item flex items-center space-x-2">
        <button
          id="pnl-today-label"
          class="text-textBase-darkGray text-xs underline decoration-dotted underline-offset-4"
        >
          Today's PNL
        </button>
        <span id="profit-today" class="text-[12px] text-state-success">
          +$1.00 (+0.1%)
        </span>
      </div>
    `
  }

  renderPNL() {
    this.parentEl.innerHTML = this.markup()
  }
}

export const portfolioPnLView = new PortfolioPnLView();