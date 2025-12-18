import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import baseModal from './modal';
import animalDetail from './animalDetailsModal';

// =======================
// DOM
// =======================
const categoriesList = document.querySelector('.js-pet-list-categories');
const petsListCards = document.querySelector('.js-pets-list-cards');
const showMoreBtn = document.querySelector('.js-showmore-btn');
const loaderElem = document.querySelector('.js-loader');

// =======================
// STATE
// =======================
let currentPets = [];
let displayedCount = 0;
let currentCategory = 'all';

// =======================
// HELPERS
// =======================
function getRenderLimit() {
  return window.innerWidth >= 1440 ? 9 : 8;
}

function showLoader() {
  loaderElem.classList.remove('hidden');
  showMoreBtn.classList.add('hidden');
}

function hideLoader() {
  loaderElem.classList.add('hidden');
  checkShowBtn();
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

// =======================
// API
// =======================
async function getPetsCategorie() {
  try {
    const res = await axios.get('https://paw-hut.b.goit.study/api/categories');
    renderCategories(res.data);
  } catch {
    iziToast.error({
      title: 'Помилка',
      message: 'Неможливо завантажити категорії',
    });
  }
}

async function getPetsList({ category = 'all', page = 1 } = {}) {
  try {
    const params = {
      page,
      limit: 30,
    };

    if (category !== 'all') {
      params.categoryId = category;
    }

    const res = await axios.get('https://paw-hut.b.goit.study/api/animals', {
      params,
    });

    return res.data.animals;
  } catch (err) {
    iziToast.error({
      title: 'Помилка',
      message: 'Неможливо завантажити тварин',
    });
    return [];
  }
}

// =======================
// RENDER
// =======================
function renderCategories(categories) {
  const allButton = `
    <li>
      <button class="category-btn active" type="button"
        data-category-id="all">
        Всі
      </button>
    </li>
  `;

  const markup = categories
    .map(
      cat => `
      <li>
        <button class="category-btn" type="button" data-category-id="${cat._id}">
          ${cat.name}
        </button>
      </li>
    `
    )
    .join('');

  categoriesList.innerHTML = allButton + markup;
}

function renderPetsList(pets) {
  petsListCards.innerHTML = '';
  displayedCount = 0;

  const limit = getRenderLimit();
  const petsToRender = pets.slice(0, limit);

  if (!petsToRender.length) {
    petsListCards.innerHTML =
      '<p>Нажаль наразі немає доступних тваринок 😞</p>';
    hideShowBtn();
    return;
  }

  petsListCards.insertAdjacentHTML(
    'afterbegin',
    petsToRender.map(createPetCard).join('')
  );

  displayedCount = petsToRender.length;
  checkShowBtn();
}

function renderMorePets() {
  const limit = getRenderLimit();
  const nextPets = currentPets.slice(displayedCount, displayedCount + limit);

  if (!nextPets.length) {
    hideShowBtn();
    return;
  }

  petsListCards.insertAdjacentHTML(
    'beforeend',
    nextPets.map(createPetCard).join('')
  );

  displayedCount += nextPets.length;
  checkShowBtn();
}

function createPetCard(pet) {
  return `
    <li class="petlist-pet-card" data-id="${pet._id}">
      <img
        class="pet-image"
        src="${pet.image || 'images/placeholder.jpg'}"
        alt="${pet.name}"
        loading="lazy"
      />

      <div class="petlist-pet-content">
        <p class="petlist-pet-breed">${pet.species}</p>
        <h3 class="petlist-card-tag">${pet.name}</h3>

        <ul class="petlist-pet-categories">
          ${
            pet.categories?.length
              ? pet.categories
                  .map(
                    cat => `<li class="petlist-pet-category">${cat.name}</li>`
                  )
                  .join('')
              : '<li class="petlist-pet-category">No category</li>'
          }
        </ul>

        <ul class="petlist-pet-meta">
          <li>${pet.gender}</li>
          <li>${pet.age}</li>
        </ul>

        <p class="petlist-pet-description">
          ${pet.shortDescription}
        </p>

        <button class="pet-more-btn js-pet-more-btn">
          Дізнатися більше
        </button>
      </div>
    </li>
  `;
}

// =======================
// EVENTS
// =======================
document.addEventListener('DOMContentLoaded', async () => {
  showLoader();
  currentPets = await getPetsList();
  renderPetsList(currentPets);
  await getPetsCategorie();
  hideLoader();
});

categoriesList.addEventListener('click', async e => {
  const button = e.target.closest('.category-btn');
  if (!button) return;

  const categoryId = button.dataset.categoryId;
  if (!categoryId) return;

  if (categoryId === currentCategory) return;

  showLoader();
  currentCategory = categoryId;

  currentPets = await getPetsList({
    category: categoryId === 'all' ? 'all' : categoryId,
  });
  renderPetsList(currentPets);

  categoriesList
    .querySelectorAll('.category-btn')
    .forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');

  hideLoader();
});

showMoreBtn.addEventListener('click', renderMorePets);

petsListCards.addEventListener('click', e => {
  const btn = e.target.closest('.js-pet-more-btn');
  if (!btn) return;

  const card = btn.closest('.petlist-pet-card');
  const petId = card.dataset.id;

  const pet = currentPets.find(p => p._id === petId);
  if (!pet) return;

  animalDetail.animalId = petId;
  animalDetail.data = pet;
  baseModal.openModal(animalDetail);
});
