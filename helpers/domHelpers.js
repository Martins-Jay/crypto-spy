const asides = document.querySelectorAll("aside")

export function closeAllAsides() {
  asides.forEach((aside) => aside.classList.toggle("translate-x-full"));
}

export function hideAllSections(...sections) {
  sections.forEach((sections) => sections.classList.add('hidden'));
}

export function showSection(section, ...hideSections) {
  section.classList.remove('hidden');
  hideSections.forEach((sec) => sec.classList.add('hidden'));
}

export function setText(el, text) {
  if (el) el.textContent = text;
} 


export function showAndHideRest(section, ...hideSections) {
  section.classList.remove("hidden");
  hideSections.forEach((sec) => sec.classList.add("hidden"));
}