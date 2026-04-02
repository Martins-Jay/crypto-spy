import * as menuView from '../menuView.js';
import { ThemeManager } from '../../models/ui/themeManager.js';

class ModeAndTheme {
  constructor() {
    this.modeThemeContentArea =
      menuView.menuElements.mobileSettings.modeThemeContentArea;

    this.themeManagerObj = new ThemeManager();
    this.wrapperEl = null; // refrence to #mode-theme-wrapper
  }

  getTemplate() {
    return `
    <!-- Space container -->
      <div id="space-container" class="flex flex-col space-y-8">
        <!-- Mode container -->
        <div id="mode-container" class="flex flex-col space-y-6">
          <div id="mode-title-container" class="space-y-1">
            <!-- Title -->
            <div class="flex font-semibold text-md">Mode</div>
            <!-- SubText -->
            <div class="text-[11px] text-textBase-darkGray">
              Turn on dark mode, or let CryptoSpy visually match your device
              setting.
            </div>
          </div>

          <!-- Mode Icons -->
          <div
            id="mode-icons-wrapper"
            class="flex flex-row justify-between"
          >
            <!-- System mode outer wrapper -->
            <div
              id="system-mode-wrapper"
              class="flex flex-col items-center justify-center space-y-2"
            >
              <button
                data-action="system-mode"
                data-mode="system"
                id="system-mode-border-highlight"
                class="flex flex-col items-center justify-center w-[100px] h-[160px] border border-brand rounded-lg"
              >
                <div id="color-seperator" class="flex">
                  <div
                    class="bg-white w-[43px] h-[148px] rounded-l-md border border-border-strong border-r-0"
                  ></div>
                  <div
                    class="bg-black w-[43px] h-[148px] rounded-r-md border border-border-strong border-l-0"
                  ></div>
                </div>
              </button>

              <!-- Bottom text -->
              <div class="flex text-xs">System</div>
            </div>

            <!-- Light mode outer wrapper -->
            <div
              id="light-mode-wrapper"
              class="flex flex-col items-center space-y-2"
            >
              <!-- Light mode outer wrapper -->
              <button
                data-action="light-mode"
                data-mode="light"
                id="light-mode-border-highlight"
                class="flex flex-col items-center justify-center w-[100px] h-[160px] rounded-lg"
              >
                <div id="light-mode-bg" class="flex">
                  <div
                    class="flex flex-col items-end bg-white w-[86px] h-[148px] rounded-md border border-border-strong"
                  >
                    <!-- Light mode sun icon -->
                    <svg class="w-6 h-6 text-yellow-500 mt-1 mr-1">
                      <use xlink:href="#sun"></use>
                    </svg>
                  </div>
                </div>
              </button>

              <!-- Bottom text -->
              <div class="flex text-xs">Light</div>
            </div>

            <!-- Dark mode outer wrapper -->
            <div
              id="dark-mode-wrapper"
              class="flex flex-col items-center space-y-2"
            >
              <!-- dark mode outer wrapper -->
              <button
                data-action="dark-mode"
                data-mode="dark"
                id="dark-mode-border-highlight"
                class="flex flex-col items-center justify-center w-[100px] h-[160px] rounded-lg"
              >
                <div id="dark-mode-bg" class="flex">
                  <div
                    class="flex flex-col items-end bg-appBg-black w-[86px] h-[148px] rounded-md border border-border-strong"
                  >
                    <!-- Dark mode moon icon -->
                    <svg
                      class="w-5 h-5 light:text-white dark:text-white mt-1 mr-1"
                    >
                      <use xlink:href="#moon"></use>
                    </svg>
                  </div>
                </div>
              </button>

              <!-- Bottom text -->
              <div class="flex text-xs">Dark</div>
            </div>
          </div>
        </div>

        <!-- Theme container -->
        <div id="theme-container" class="flex flex-col space-y-6">
          <div id="mode-title-container" class="space-y-1">
            <!-- Title -->
            <div class="flex font-semibold text-md">Theme</div>
            <!-- SubText -->
            <div class="text-[11px] text-textBase-darkGray">
              Select default theme
            </div>
          </div>

          <!-- Default mode outer wrapper -->
          <div
            id="default-mode-wrapper"
            class="flex flex-col items-center space-y-2 w-[100px]"
          >
            <button
              data-action="default-mode"
              data-mode="default"
              id="default-mode-border-highlight"
              class="flex flex-col items-center justify-center w-[100px] h-[160px] rounded-lg"
            >
              <div id="default-mode-bg" class="flex">
                <div
                  class="flex flex-col items-end bg-appBg w-[86px] h-[148px] rounded-md border border-border-strong"
                ></div>
              </div>
            </button>

            <!-- Bottom text -->
            <div class="flex text-xs">Default</div>
          </div>
        </div>
      </div>
    `;
  }

  renderModeTemplate() {
    this.wrapperEl = this.modeThemeContentArea.querySelector(
      '#mode-theme-parentEl'
    );

    if (!this.wrapperEl) return;

    // Inject only once
    if (!this.wrapperEl.hasChildNodes()) {
      this.wrapperEl.innerHTML = this.getTemplate();
    }
  }

  selectModeElements() {
    // These elements are only available after the theme & modes have been injected into our html. Thus we can initialized in our constructor and assign after it is available
    this.systemModeEl = this.modeThemeContentArea.querySelector(
      '[data-mode="system"]'
    );
    this.lightModeEl = this.modeThemeContentArea.querySelector(
      '[data-mode="light"]'
    );
    this.darkModeEl =
      this.modeThemeContentArea.querySelector('[data-mode="dark"]');
    this.defaultModeEl = this.modeThemeContentArea.querySelector(
      '[data-mode="default"]'
    );
  }

  clearBorders() {
    this.selectModeElements();

    [
      this.systemModeEl,
      this.lightModeEl,
      this.darkModeEl,
      this.defaultModeEl,
    ].forEach((btnEl) => btnEl.classList.remove('border', 'border-brand'));
  }

  toggleSystem(mode) {
    this.clearBorders();
    this.systemModeEl.classList.add('border', 'border-brand');
    this.themeManagerObj.setUserTheme(mode);
  }

  toggleLight(mode) {
    this.clearBorders();
    this.lightModeEl.classList.add('border', 'border-brand');
    this.themeManagerObj.setUserTheme(mode);
  }

  toggleDark(mode) {
    this.clearBorders();
    this.darkModeEl.classList.add('border', 'border-brand');
    this.themeManagerObj.setUserTheme(mode);
  }

  toggleDefault(mode) {
    this.clearBorders();
    this.defaultModeEl.classList.add('border', 'border-brand');
    this.themeManagerObj.setUserTheme(mode);
  }

  restoreHighlight() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'system') {
      this.clearBorders();
      this.systemModeEl.classList.add('border', 'border-brand');
    } else if (savedTheme === 'light') {
      this.clearBorders();
      this.lightModeEl.classList.add('border', 'border-brand');
    } else if (savedTheme === 'dark') {
      this.clearBorders();
      this.darkModeEl.classList.add('border', 'border-brand');
    } else if (savedTheme === 'default') {
      this.clearBorders();
      this.defaultModeEl.classList.add('border', 'border-brand');
    }
  }

  showActiveTheme() {
    this.activeThemeEl = document.querySelector(
      '#mobile-settings-content #active-theme-name'
    );
    const currentThemeInUse = localStorage.getItem('theme');

    this.activeThemeEl.textContent = '';
    this.activeThemeEl.textContent = currentThemeInUse;
  }
}

export const modeAndThemeObj = new ModeAndTheme();
