import { holdingsView } from './bottomNav/holdingsView.js';
import { holdingsDataController } from '../../../controllers/holdingsData/holdingsDataController.js';
import { onAuthStateChanged, auth } from '../../../firebase/firebaseInit.js';
import { holdingModel } from '../../../models/holdings/holdingsModel.js';

class HoldingsPanelView {
  constructor() {
    this.$ = (id) => document.getElementById(id);
    this.bottomNav = null;
  }

  init() {
    onAuthStateChanged(auth, async (user) => {
      if (!user) return

      this.user = user;
    })
  }

  toggleVisibility() {
    this.bottomNav = document.getElementById('bottom-nav');
    const panel = this.$('add-holdings-panel');

    // Check if panel is currently hidden
    const isPanelHidden = panel.classList.contains('translate-x-full');

    // Toggle panel
    panel.classList.toggle('translate-x-full');

    // Toggle bottom nav in sync
    this.bottomNav.classList.toggle('translate-y-full', isPanelHidden); // first arg is added if true, else removed

    setTimeout(() => {
      this._resetForm();
    }, 500);

    this.init()
  }

  _resetForm() {
    const form = this.$('holding-form');
    if (!form) return;
    form.reset(); // Clears all inputs automatically
  }

  /* =================================================================
     GET FORM DATA & SAVE TO FIREBASE. CHECK: holdingsController.js
  ================================================================= */
  onSubmit(callback) {
    const form = this.$('holding-form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = {
        exchangeName: this.$('exchange-name').value.trim(),
        coinSymbol: this.$('coin-name').value.trim().toUpperCase(),
        buyPrice: +this.$('buy-price').value || 0,
        sellPrice: +this.$('sell-price').value || 0,
        targetPrice: +this.$('sell-price').value || 0, // same as sellPrice
        amountInvested: +this.$('amount-invested').value || 0,
        stopLoss: +this.$('stop-loss').value || 0,
        takeProfit: +this.$('take-profit').value || 0,
      };

      callback(formData);
    });
  }

  handleOutsideClicks(inputEl, suggestionBox) {
    document.addEventListener('click', (e) => {
      const clickedEl = e.target;

      const clickedInsideInput = inputEl.contains(clickedEl);
      const clickedInsideBox = suggestionBox.contains(clickedEl);

      if (!clickedInsideInput && !clickedInsideBox) {
        this._hideSuggestions(suggestionBox);
      }
    });
  }

  /* ============================================================
     EXCHANGE AUTOCOMPLETE
  ============================================================ */
  initExchangeAutoComplete(callback) {
    const inputEl = this.$('exchange-name');
    const suggestionBox = this.$('exchange-name-suggestions');
    if (!inputEl) return;

    inputEl.addEventListener('input', async () => {
      const userValue = inputEl.value.trim().toLowerCase();

      if (!userValue) {
        this._hideSuggestions(suggestionBox);
        return;
      }

      const matches = await callback(userValue);
      const list = matches.map((e) => e.name);

      this._renderSuggestions(
        suggestionBox,
        list,
        (selected) => (inputEl.value = selected)
      );

      // Hide when clicked outside
      this.handleOutsideClicks(inputEl, suggestionBox);
    });
  }

  /* ============================================================
     COIN AUTOCOMPLETE
  ============================================================ */
  initCoinAutocomplete(callback) {
    const inputEl = this.$('coin-name');
    const suggestionBox = this.$('coin-suggestions');
    if (!inputEl) return;

    inputEl.addEventListener('input', async () => {
      const userValue = inputEl.value.trim().toUpperCase();

      if (!userValue) return this._hideSuggestions(suggestionBox);

      const matches = await callback(userValue);

      this._renderSuggestions(
        suggestionBox,
        matches,
        (selected) => (inputEl.value = selected)
      );

      // Hide when clicked outside
      this.handleOutsideClicks(inputEl, suggestionBox);
    });
  }

  /* ============================================================
     SHARED AUTOCOMPLETE HELPERS
  ============================================================ */
  _hideSuggestions(suggestionBox) {
    suggestionBox.classList.add('hidden');
    suggestionBox.innerHTML = '';
  }

  _renderSuggestions(suggestionBox, list, onSelect) {
    if (!list || list.length === 0) return this._hideSuggestions(suggestionBox);

    suggestionBox.classList.remove('hidden');
    suggestionBox.innerHTML = list
      .map(
        (item) => `
        <div class="suggest-item px-3 py-2 cursor-pointer text-sm">
          ${item}
        </div>`
      )
      .join('');

    // Handle click inside suggestion
    suggestionBox.querySelectorAll('.suggest-item').forEach((el) => {
      el.addEventListener('click', () => {
        const selected = el.textContent.trim();

        onSelect(selected);
        this._hideSuggestions(suggestionBox);
      });
    });
  }
}

export const holdingsPanelView = new HoldingsPanelView();
