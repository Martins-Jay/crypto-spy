export function renderTemplate(targetContainer, templateId, data = {}) {
  if (!targetContainer || !templateId) return;

  // First clone template passed in and store in clone variable
  const clone = templateId.content.cloneNode(true);

  // if we passed extral data, inject it
  if (data.screen) {
    const parentEL = clone.firstElementChild; // Get access to parent element

    parentEL.dataset.screen = data.screen;
  }
  targetContainer.appendChild(clone);
}
