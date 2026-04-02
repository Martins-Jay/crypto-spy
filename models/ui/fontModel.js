class FontsModel {
  constructor() {
    this.bodyEl = document.querySelector('body'); // Apply font here
    this.storageKey = 'appFont';
    this.fontName = localStorage.getItem(this.storageKey) || 'inter';
  }


  applyAndSaveFont(fontName) {
    // Clear old font classes in body
    // Since we are injecting html into the dom, ensure the font names are saved to 
    this.bodyEl.classList.remove(
      'font-inter',
      'font-rubik',
      'font-spaceGrotesk',
      'font-spectral',
      'font-tagesschrift'
    );

    // Apply new font
    this.bodyEl.classList.add(`font-${fontName}`);

    // Save font choice
    localStorage.setItem(this.storageKey, fontName);

    // Update internal state
    this.fontName = fontName;
  }

  getFont() {
    return localStorage.getItem(this.storageKey)
  }
}

export const fontsModel = new FontsModel();