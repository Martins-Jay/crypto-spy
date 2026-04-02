class ViewManager {
  constructor() {}

  // hide auth, show remaining sections
  hideAndShowRest(hideSectionID, ...showSectionsId) {
    const hideEl = document.getElementById(hideSectionID);
    if (hideEl) {
      hideEl.classList.add('hidden');
    }

    showSectionsId.forEach((sectionId) =>
      document
        .getElementById(sectionId)
        .classList.remove('hidden', 'lg:hidden', 'md:hidden'),
    );
  }

  // show auth, hide remaining sections
  showndHideRest(showSectionId, ...hideSectionsId) {
    const showEl = document.getElementById(showSectionId);
    if (showEl) {
      showEl.classList.remove('hidden');
    }

    hideSectionsId.forEach((sectionId) =>
      document.getElementById(sectionId).classList.add('hidden'),
    );
  }
}

export const viewManager = new ViewManager();
