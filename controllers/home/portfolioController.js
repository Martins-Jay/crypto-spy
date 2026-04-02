import { portfolioSummary } from "../../views/components/homeComponents/portfolio/portfolioSummaryView.js";
import { portfolioPnLView } from "../../views/components/homeComponents/portfolio/portfolioPnLView.js";

class PortfolioController {
  constructor() {}

  initPortfolioSummary() {
    portfolioSummary.renderPortfolioSummary();
    portfolioPnLView.renderPNL()
  }
}

export const portfolioController = new PortfolioController();
