const searchNameInput = document.getElementById('searchName');
const searchLocationInput = document.getElementById('searchLocation');
const searchCategorySelect = document.getElementById('searchCategory');
const cards = document.querySelectorAll('.card');

searchNameInput.addEventListener('input', () => {
  const searchName = searchNameInput.value.trim().toLowerCase();
  filterUsers(searchName, 'name');
});

searchLocationInput.addEventListener('input', () => {
  const searchLocation = searchLocationInput.value.trim().toLowerCase();
  filterUsers(searchLocation, 'location');
});

searchCategorySelect.addEventListener('change', () => {
  const searchCategory = searchCategorySelect.value;
  filterUsers(searchCategory, 'category');
});

function filterUsers(searchTerm, type) {
  
    cards.forEach(card => {
      const name = card.getAttribute('data-name');
      const location = card.getAttribute('data-location');
      const category = card.getAttribute('data-category');

      let shouldDisplay = true;
  
      if (type === 'name' && name) {
        shouldDisplay = name.toLowerCase().includes(searchTerm);
      } else if (type === 'location' && location) {
        shouldDisplay = location.toLowerCase().includes(searchTerm);
      } else if (type === 'category' && category) {
        shouldDisplay = (searchTerm === '' || category === searchTerm);
      }
  
      if (shouldDisplay) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }
  
