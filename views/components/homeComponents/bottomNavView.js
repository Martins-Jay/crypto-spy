import { publish } from '../../../helpers/pubsub.js';

class BottomNavigation {
  constructor(containerId = 'bottom-navigation-container') {
    this.container = document.getElementById(containerId);

    this.navItems = [
      { label: 'Home', view: 'home', iconId: 'icon-home' },
      { label: 'Markets', view: 'markets', iconId: 'icon-markets' },
      { label: 'Watchlist', view: 'watchlist', iconId: 'icon-watchlist' },
      { label: 'Holdings', view: 'holdings', iconId: 'icon-holdings' },
    ];
  }

  // HTML for a single nav button
  createNavButton(itemObj) {
    return `
      <li>
        <button
          class="bottom-nav-btn flex flex-col items-center justify-center space-y-[1px]"
          data-view="${itemObj.view}" data-action="open-${itemObj.view}"
        >
          <svg class="w-6 h-6">
            <use xlink:href="#${itemObj.iconId}" class="text-textBase-darkGray"></use>
          </svg>
          <p class="text-xs text-textBase-darkGray">${itemObj.label}</p>
        </button>
      </li>
    `;
  }

  setupEventDelegation() {
    const bottomNavContainer = this.container;

    bottomNavContainer.addEventListener('click', (e) => {
      const targetEl = e.target.closest('[data-action]');
      if (!targetEl) return;

      const action = targetEl.dataset.action;
      const view = targetEl.dataset.view;

      console.log(action, view);

      this.setActiveTab(targetEl);
      this.switchView(view);

      publish('navigation:changed', { view });
    });
  }

  // Generate the full <ul> markup for the nav
  generateNavList() {
    const navList = this.navItems
      .map((itemObj) => this.createNavButton(itemObj))
      .join('');

    return navList;
  }

  // Inject the bottom nav into the container
  renderBottomNav() {
    if (!this.container) return;

    this.container.innerHTML = `
      <nav id="bottom-nav" data-nav='bottom-nav' class="fixed bottom-0 left-0 px-4 right-0 h-13 z-50 bg-brand-body light:bg-appBg-white dark:bg-black">
        <ul class="flex justify-between px-6 py-2">
          ${this.generateNavList()}
        </ul>
      </nav>
    `;

    const homeBtn = document.querySelector('.bottom-nav-btn');

    this.setActiveTab(homeBtn);

    this.setupEventDelegation();
  }

  setActiveTab(targetEl) {
    const buttonEls = this.container?.querySelectorAll('.bottom-nav-btn');

    buttonEls.forEach((btnEl) => {
      const svgUseEL = btnEl.querySelector('use');
      const textEl = btnEl.querySelector('p');

      if (btnEl === targetEl) {
        svgUseEL.classList.add('text-brand');
        svgUseEL.classList.remove('text-textBase-darkGray');
        textEl.classList.add('dark:text-white');
        textEl.classList.remove('text-textBase-darkGray');
      } else {
        svgUseEL.classList.remove('text-brand');
        svgUseEL.classList.add('text-textBase-darkGray');
        textEl.classList.remove('text-white');
        textEl.classList.add('text-textBase-darkGray');
      }
    });
  }

  switchView(activeBottomNav) {
    const sectionNameEls = document.querySelectorAll('.section-name');

    sectionNameEls.forEach((sectionNameEl) => {
      if (sectionNameEl.id === activeBottomNav) {
        sectionNameEl.classList.remove('hidden');
      } else {
        sectionNameEl.classList.add('hidden');
      }
    });
  }
}

export const bottomNav = new BottomNavigation();
