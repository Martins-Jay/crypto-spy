import { SVG_PATH } from '../../config/config.js';

export async function loadSVGSprite() {
  try {
    const response = await fetch(SVG_PATH);
    if (!response.ok)
      throw new Error(`Failed to fetch ${SVG_PATH}: ${response.status}`);
    const data = await response.text();

    const temp = document.createElement('div');
    temp.innerHTML = data;

    document.body.prepend(temp); // Inject at top of <body>
  } catch (err) {
    console.error('Failed to load SVG sprite:', err);
  }
}
