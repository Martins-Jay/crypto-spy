class Greeting {
  constructor() {
    this.nameEl = null;
    this.mobileNameEl = null;
  }

  markup(greetingText) {
    return `
      <div
        class="greeting-text font-normal text-md md:text-lg lg:text-xl"
      >
        <span id="greeting-message">${greetingText},</span>
        <!-- Desktop/Tablet Username -->
        <span
          id="user-display-name"
          class="hidden md:inline lg:inline font-semibold md:text-xl lg:text-2xl capitalize"
        >
        </span>
      </div>

      <!-- Mobile Username -->
      <div
        id="user-display-name-mobile"
        class="text-2xl font-black md:hidden lg:hidden capitalize"
      >
        
      </div>
    `;
  }

  renderGreeting(userName, greetingText) {
    const htmlMarkup = this.markup(greetingText);

    document.getElementById('greeting-container').innerHTML = htmlMarkup; // add html to the DOM
    this.nameEl = document.getElementById('user-display-name');
    this.mobileNameEl = document.getElementById('user-display-name-mobile');

    this.nameEl.innerHTML = userName + '.';
    this.mobileNameEl.innerHTML = userName + '.';
  }

  clearName() {
    this.nameEl.innerHTML = '';
    this.mobileNameEl.innerHTML = '';
    localStorage.removeItem('username');
  }
}

export const greetingObj = new Greeting();
