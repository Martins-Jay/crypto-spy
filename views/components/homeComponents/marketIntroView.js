class MarketIntroView {
  constructor() {
    this.parentEl = document.getElementById('intro-container');
  }
  markup() {
    return ` 
      <!-- Text section -->
      <div class="flex flex-col md:space-y-0.5 lg:space-y-4">
        <h2 class="md:text-2xl md:font-black lg:text-4xl lg:font-black">
          Track your crypto portfolio across multiple exchanges in one place -
          <span class="text-brand">securely and in real time.</span>
        </h2>
        <p class="text-sm text-textBase-darkGray">
          Stay on top of your holdings without moving your fund — smarter
          tracking made simple.
        </p>
      </div>

      <!-- Finance image -->
      <img
        src="/assets/images/digital-finance.png"
        alt="Digital finance img"
        class="md:w-[18rem] md:h-[10rem]  lg:hidden lg:w-[18rem] lg:h-[19rem] object-contain"
      />
    `;
  }

  renderMarkup() {
    this.parentEl.innerHTML = this.markup();
  }
}

export const marketIntroView = new MarketIntroView();
