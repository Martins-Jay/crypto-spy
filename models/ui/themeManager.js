export class ThemeManager {
  constructor() {
    this.html = document.documentElement; // points to the <html> tag
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)'); // CSS media query to check if the device is in dark mode
    this.systemListenerAdded = false; // flag that tells us if we have already attached a system preference listener. Initially, it is false.
  }

  applyTheme(mode) {
    // Remove previous classes
    this.html.classList.remove('light', 'dark', 'default');

    if (mode === 'system') {
      const prefersDark = this.mediaQuery.matches; // Ask if user system preference is set to dark mode.
      prefersDark === true
        ? this.html.classList.add('dark')
        : this.html.classList.add('light');
    } else if (mode === 'light') {
      this.html.classList.add('light');
    } else if (mode === 'dark') {
      this.html.classList.add('dark');
    } else if (mode === 'default') {
      this.html.classList.add('default');
    }

    //  We update here and inside one of the if in menu:mobile:action in menuController.js
    // this.getActiveThemeEl(mode);
  }

  setUserTheme(mode) {
    localStorage.setItem('theme', mode); // First save users theme
    // selection to local storage
    this.applyTheme(mode); // Apply selected theme (for light/ dark)

    // System is treated specially. (special case executes watch function which listens for change)
    if (mode === 'system' && !this.systemListenerAdded) {
      this.watchSystemTheme();
    }
  }


  // Listen for system changes
  watchSystemTheme() {
    this.systemListenerAdded = true;

    this.mediaQuery.addEventListener('change', () => {
      if (localStorage.getItem('theme') === 'system') {
        this.applyTheme('system'); // Only executes if if condition is true
      }
    });
  }

  getCurrentMode() {
    return localStorage.getItem('theme') || 'default'
  }

  // Initialize theme on page load
  init() {
    const savedTheme = localStorage.getItem('theme');

    //  For system (special case executes watch function which listens for change)
    if (savedTheme === 'system') {
      this.applyTheme('system'); // <-- Apply system theme immediately
      // this.getActiveThemeEl('System')
      this.watchSystemTheme(); // <-- Then attach listener
    } else {
      this.applyTheme(savedTheme); // for light/dark/default
      // this.getActiveThemeEl(savedTheme)
    }
  }
}

export const themeManager = new ThemeManager();
