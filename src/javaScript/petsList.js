import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// VARIABLE----

const categoriesList = document.querySelector('.js-pet-list-categories');
const petsListCards = document.querySelector('.js-pets-list-cards');
const showMoreBtn = document.querySelector('.js-showmore-btn');
const loaderElem = document.querySelector('.js-loader');

let ALLPETS = [];
let displayedCount = 0;
let currentPets = [];

// FETCHES----

async function getPetsCategorie() {
  try {
    const res = await axios.get('https://paw-hut.b.goit.study/api/categories');

    const categories = res.data;

    renderCategories(categories);
  } catch (err) {
    iziToast.error({
      title: 'Помилка',
      message: err.response?.data?.message || 'Неможливо завантажити дані',
    });
  }
}

async function getPetsList() {
  try {
    const res = await axios.get('https://paw-hut.b.goit.study/api/animals', {
      params: {
        page: 1,
        limit: 30,
      },
    });

    ALLPETS = res.data.animals;
    currentPets = ALLPETS;

    renderPetsList(ALLPETS);
  } catch (err) {
    iziToast.error({
      title: 'Помилка',
      message: err.response?.data?.message || 'Неможливо завантажити дані',
    });
  }
}

// RENDERS----
function renderCategories(categories) {
  const allButton = `<li class="pets-list-categories-item">
      <button class="category-btn active" type="button" data-name="all">Всі</button>
    </li>`;
  const markup = categories.map(renderCategorie).join('');
  categoriesList.innerHTML = allButton + markup;
}

function renderCategorie(category) {
  return `<li>
        <button class="category-btn" type="button" data-category="${category._id}" data-name="${category.name}">
          ${category.name}
        </button>
      </li>`;
}

function getRenderLimit() {
  return window.innerWidth >= 1440 ? 9 : 8;
}

function renderPetsList(pets) {
  petsListCards.innerHTML = '';
  displayedCount = 0;

  const limit = getRenderLimit();
  const petsToRender = pets.slice(0, limit);

  if (!petsToRender.length) {
    petsListCards.innerHTML =
      '<p>Нажаль наразі не має доступних хатніх тваринок 😞 </p>';
    hideShowBtn();
    return;
  }

  const markup = petsToRender.map(createPetCard).join('');
  petsListCards.insertAdjacentHTML('afterbegin', markup);

  displayedCount = petsToRender.length;
  if (displayedCount >= pets.length) {
    hideShowBtn();
  } else {
    checkShowBtn();
  }
}

function createPetCard(pet) {
  return `<li class="petlist-pet-card" data-id="${pet._id}">
      <img
        class="pet-image"
        src="${pet.image || 'images/placeholder.jpg'}"
        alt="${pet.name}"
        loading="lazy"
      >

      <div class="petlist-pet-content">
        <div class="petlist-pet-content-about">
        <p class="petlist-pet-breed">${pet.species}</p>
            
            <h3 class="petlist-card-tag">${pet.name}</h3>

            <ul class="petlist-pet-categories">
    ${
      pet.categories && pet.categories.length
        ? pet.categories
            .map(cat => `<li class="petlist-pet-category">${cat.name}</li>`)
            .join('')
        : '<li class="petlist-pet-category">No category</li>'
    }
  </ul>
            </div>
    
            <ul class="petlist-pet-meta">
              <li class="petlist-pet-meta-item">${pet.gender}</li>
              <li class="petlist-pet-meta-item">${pet.age}</li>
            </ul>
        </div>

        <p class="petlist-pet-description">
          ${pet.shortDescription}
        </p>

        <button class="pet-more-btn js-pet-more-btn" type="button">Дізнатися більше</button>
      </div>
    </li>`;
}

function renderMorePets(petArr) {
  const limit = getRenderLimit();
  const nextPart = petArr.slice(displayedCount, displayedCount + limit);

  if (nextPart.length === 0) {
    hideShowBtn();
    return;
  }

  const markup = nextPart.map(createPetCard).join('');
  petsListCards.insertAdjacentHTML('beforeend', markup);

  displayedCount += nextPart.length;
  checkShowBtn();
}

// EVENTS----

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([getPetsList(), getPetsCategorie()]);
  hideLoader();
});

categoriesList.addEventListener('click', async e => {
  e.preventDefault();

  const button = e.target.closest('button.category-btn');
  if (!button || !categoriesList.contains(button)) return;

  showLoader();
  petsListCards.innerHTML = '';
  await new Promise(resolve => setTimeout(resolve, 300));

  const selectedCategoryName = button.dataset.name;
  currentPets = filterPetsByCategory(selectedCategoryName);

  renderPetsList(currentPets);

  categoriesList
    .querySelectorAll('.category-btn')
    .forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  hideLoader();
});

window.addEventListener('resize', () => {
  renderPetsList(currentPets.slice(0, displayedCount || getRenderLimit()));
});

showMoreBtn.addEventListener('click', () => {
  renderMorePets(currentPets);
});

petsListCards.addEventListener('click', e => {
  const btn = e.target.closest('.js-pet-more-btn');
  if (!btn) return;

  const card = btn.closest('.petlist-pet-card');
  const petId = card.dataset.id;

  console.log('Дізнатися більше', petId);
});

// FUNCTIONAL----
function filterPetsByCategory(categoryName) {
  if (categoryName === 'all') return ALLPETS;
  return ALLPETS.filter(pet =>
    pet.categories?.some(pet => pet && pet.name === categoryName)
  );
}

function hideLoader() {
  loaderElem.classList.add('hidden');
  checkShowBtn();
}

function showLoader() {
  loaderElem.classList.remove('hidden');
  hideShowBtn();
}

function checkShowBtn() {
  if (displayedCount < currentPets.length) {
    showMoreBtn.classList.remove('hidden');
  } else {
    showMoreBtn.classList.add('hidden');
  }
}

function hideShowBtn() {
  showMoreBtn.classList.add('hidden');
}
