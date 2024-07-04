const searchNameInput = document.getElementById("searchName");
const searchLocationInput = document.getElementById("searchLocation");
const searchCategorySelect = document.getElementById("searchCategory");

searchName.addEventListener("input", filterCards);
searchLocation.addEventListener("input", filterCards);
searchCategory.addEventListener("change", filterCards);

function filterCards() {
  const nameValue = searchName.value.toLowerCase();
  const locationValue = searchLocation.value.toLowerCase();
  const categoryValue = searchCategory.value;

  const cards = document.querySelectorAll(".card-container .card");

  cards.forEach((card) => {
    const name = card.getAttribute("data-name").toLowerCase();
    const location = card.getAttribute("data-location").toLowerCase();
    const category = card.getAttribute("data-category");

    const isVisible =
      name.includes(nameValue) &&
      (location.includes(locationValue) || !locationValue) &&
      (category === categoryValue || categoryValue === "");

    card.style.display = isVisible ? "" : "none";
  });
}
