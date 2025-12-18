import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import baseModal from './modal';
import animalDetail from './animalDetailsModal';

// ================= DOM =================

const categoriesList = document.querySelector('.js-pet-list-categories');
const petsListCards = document.querySelector('.js-pets-list-cards');
const showMoreBtn = document.querySelector('.js-showmore-btn');
const loaderElem = document.querySelector('.js-loader');

// ================= STATE =================

let currentPets = [];
let currentCategory = 'all';
let currentPage = 1;
let visibleCount = 0;
let totalItems = 0;

const API_LIMIT = getRenderLimit();

// ================= API =================

async function getPetsCategories() {
  try {
    const res = await axios.get('https://paw-hut.b.goit.study/api/categories');
    renderCategories(res.data);
  } catch (err) {
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
      limit: API_LIMIT,
    };

    if (category !== 'all') {
      params.categoryId = category;
    }

    const res = await axios.get('https://paw-hut.b.goit.study/api/animals', {
      params,
    });

    return res.data;
  } catch (err) {
    iziToast.error({
      title: 'Помилка',
      message: 'Неможливо завантажити тварин',
    });
    return { animals: [], totalItems: 0 };
  }
}

// ================= RENDER =================

function renderCategories(categories) {
  const allBtn = `
    <li>
      <button class="category-btn active" data-category-id="all">
        Всі
      </button>
    </li>`;

  categoriesList.innerHTML =
    allBtn + categories.map(renderCategoryItem).join('');
}

function renderCategoryItem(category) {
  return `
    <li>
      <button class="category-btn" data-category-id="${category._id}">
        ${category.name}
      </button>
    </li>`;
}

function renderNextBatch() {
  const uiLimit = getRenderLimit();

  const nextPets = currentPets.slice(visibleCount, visibleCount + uiLimit);

  if (!nextPets.length) {
    checkShowBtn();
    return;
  }

  petsListCards.insertAdjacentHTML(
    'beforeend',
    nextPets.map(createPetCard).join('')
  );

  visibleCount += nextPets.length;
  checkShowBtn();
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
      pet.categories?.length
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

// ================= LOAD LOGIC =================

async function loadInitialPets() {
  showLoader();

  currentPage = 1;
  visibleCount = 0;
  petsListCards.innerHTML = '';

  const data = await getPetsList({
    category: currentCategory,
    page: currentPage,
  });

  currentPets = data.animals;
  totalItems = data.totalItems;

  renderNextBatch();
  hideLoader();
}

async function loadMorePets() {
  const uiLimit = getRenderLimit();

  if (visibleCount < currentPets.length) {
    renderNextBatch();
    return;
  }

  if (visibleCount >= totalItems) {
    hideShowBtn();
    return;
  }

  showLoader();
  currentPage += 1;

  const data = await getPetsList({
    category: currentCategory,
    page: currentPage,
  });

  currentPets.push(...data.animals);
  renderNextBatch();

  hideLoader();
}

// ================= EVENTS =================

document.addEventListener('DOMContentLoaded', async () => {
  await loadInitialPets();
  await getPetsCategories();
});

categoriesList.addEventListener('click', async e => {
  const btn = e.target.closest('.category-btn');
  if (!btn) return;

  const categoryId = btn.dataset.categoryId;
  if (categoryId === currentCategory) return;

  currentCategory = categoryId;

  categoriesList
    .querySelectorAll('.category-btn')
    .forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  await loadInitialPets();
});

showMoreBtn.addEventListener('click', loadMorePets);

petsListCards.addEventListener('click', e => {
  const btn = e.target.closest('.js-pet-more-btn');
  if (!btn) return;

  const card = btn.closest('.petlist-pet-card');
  const pet = currentPets.find(p => p._id === card.dataset.id);

  if (!pet) return;

  animalDetail.animalId = pet._id;
  animalDetail.data = pet;
  baseModal.openModal(animalDetail);
});

// ================= UTILS =================

function getRenderLimit() {
  return window.innerWidth >= 1440 ? 9 : 8;
}

function checkShowBtn() {
  showMoreBtn.classList.toggle('hidden', visibleCount >= totalItems);
}

function showLoader() {
  loaderElem.classList.remove('hidden');
  hideShowBtn();
}

function hideLoader() {
  loaderElem.classList.add('hidden');
  checkShowBtn();
}

function hideShowBtn() {
  showMoreBtn.classList.add('hidden');
}
