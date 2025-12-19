import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import baseModal from './modal';
import animalDetail from './animalDetailsModal';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

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

// ================= Pagination_STATE ================= 
let paginationCurrentPage = 1;
let paginationTotalPages = 0;
let pagination = null;

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
  paginationCurrentPage = 1; // Скидаємо пагінацію на першу сторінку
  visibleCount = 0;
  petsListCards.innerHTML = '';

  const data = await getPetsList({
    category: currentCategory,
    page: currentPage,
  });

  currentPets = data.animals;
  totalItems = data.totalItems;

  initPagination(totalItems); // Pagination_ініціалізація

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
  renderPagination(); // Оновлюємо пагінацію після зміни категорії
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
  if (window.innerWidth >= 1440) {
    showMoreBtn.classList.add('hidden');
    return;
  }
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

// ================= Pagination_RENDER =================

function renderPagination() { 
  if (!pagination) return;
  pagination.reset(totalItems);
}

// ================= Pagination_INIT =================

function initPagination(totalItemsCount) { 
  if (window.innerWidth < 768) return; // Pagination_з планшета

  paginationTotalPages = Math.ceil(totalItemsCount / API_LIMIT);
  paginationCurrentPage = 1;

  const paginationContainer = document.querySelector('.js-pagination');
  if (!paginationContainer) return;

  const options = {
    totalItems: totalItemsCount,
    itemsPerPage: API_LIMIT,
    visiblePages: 3,
    centerAlign: true,
    template: {
      page: '<button class="pagination-btn pagination-page">{{page}}</button>',
      currentPage: '<button class="pagination-btn pagination-page active">{{page}}</button>',
      
      moveButton: '<button class="pagination-btn pagination-arrow tui-{{type}}"><svg class="pagination-arrow-icon" width="24" height="24" viewBox="0 0 24 24"><use href="/images/sprite.svg#icon-arrow-back"></use></svg></button>',
      disabledMoveButton: '<button class="pagination-btn pagination-arrow tui-is-disabled tui-{{type}}"><svg class="pagination-arrow-icon" width="24" height="24" viewBox="0 0 24 24"><use href="/images/sprite.svg#icon-arrow-back"></use></svg></button>',
      
      firstPage: '<button class="pagination-btn pagination-page">1</button>',
      lastPage: '<button class="pagination-btn pagination-page">{{totalPages}}</button>',
    },
  };

  pagination = new Pagination(paginationContainer, options);

  // Оновлюємо firstBtn і lastBtn одразу після ініціалізації
  setTimeout(() => {
    const firstBtn = document.querySelector('.pagination .tui-first');
    const lastBtn = document.querySelector('.pagination .tui-last');
    const nextBtns = document.querySelectorAll('.pagination .tui-next use');
    
    if (firstBtn) {
      firstBtn.style.display = 'none'; // Ховаємо при ініціалізації
    }
    if (lastBtn) {
      lastBtn.textContent = paginationTotalPages;
    }
    // Змінюємо іконки next кнопок на forward
    nextBtns.forEach(use => {
      use.setAttribute('href', '/images/sprite.svg#icon-arrow-forward');
    });
  }, 0);

  pagination.on('afterMove', async (event) => {
    const currentPage = event.page;
    const totalPages = Math.ceil(totalItems / API_LIMIT);

    // Ховаємо first на 1-2 сторінках, last на останніх двох
    const firstBtn = document.querySelector('.pagination .tui-first');
    const lastBtn = document.querySelector('.pagination .tui-last');
    
    if (firstBtn) {
      firstBtn.style.display = currentPage <= 2 ? 'none' : 'flex';
      firstBtn.textContent = '1';
    }
    
    if (lastBtn) {
      lastBtn.style.display = currentPage >= totalPages - 1 ? 'none' : 'flex';
      lastBtn.textContent = totalPages;
    }

    // Оновлюємо іконки next кнопок
    const nextBtns = document.querySelectorAll('.pagination .tui-next use');
    nextBtns.forEach(use => {
      use.setAttribute('href', '/images/sprite.svg#icon-arrow-forward');
    });

    showLoader();
    const data = await getPetsList({
      category: currentCategory,
      page: currentPage,
    });

    currentPets = data.animals;
    totalItems = data.totalItems;
    visibleCount = 0;
    petsListCards.innerHTML = '';
    renderNextBatch();
    hideLoader();
  });
}
