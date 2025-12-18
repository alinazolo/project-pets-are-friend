// scripts for the success stories section
import spriteUrl from '../images/sprite.svg';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const reviewsList = document.querySelector(".swiper-wrapper.success-stories-lists");
const reviewsNextButton = document.querySelector('.success-stories-button-next');
const reviewsPrevButton = document.querySelector('.success-stories-button-prev');
const reviewsPagination = document.querySelector(".success-stories-swiper-pagination");

const BASE_URL = "https://paw-hut.b.goit.study";
const END_POINT = "/api/feedbacks";
axios.defaults.baseURL = BASE_URL;

async function getFeedbacks({ page = 1, limit = 6 } = {}) {
  try {
    const response = await axios.get(END_POINT, { params: { page, limit } });
    return response.data;
  } catch (error) {
    console.error('❌ Error receiving reviews:', error);
    throw error;
  }
}

function createFeedbacks(feedbacks) {
  const markup = feedbacks.map(({ author, rate, description }) => `
    <div class="swiper-slide success-stories-list">
      <div class="rating" data-rate="${rate}"></div>
      <p class="success-stories-list-review">${description}</p>
      <p class="success-stories-list-author">${author}</p>
    </div>
  `).join('');

  reviewsList.innerHTML = '';
  reviewsList.insertAdjacentHTML('beforeend', markup);
}

let swiper;
function initSwiper() {
  swiper = new Swiper('.success-stories-swiper', {
    slidesPerView: 1,
    spaceBetween: 32,
    navigation: {
      nextEl: '.success-stories-button-next',
      prevEl: '.success-stories-button-prev',
    },
    pagination: {
      el: '.success-stories-swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
    },
  });
}

function initStars() {
  document.querySelectorAll('.rating').forEach(container => {
    container.innerHTML = '';

    const rate = parseFloat(container.dataset.rate || 0);
    const fullStars = Math.floor(rate);
    const hasHalf = rate % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      let starType;

      if (i < fullStars) {
        starType = 'icon-star-filled';
      } else if (i === fullStars && hasHalf) {
        starType = 'icon-star-half';
      } else {
        starType = 'icon-star-outline';
      }

      const svg = `
        <svg width="20" height="20" class="star">
          <use href="${spriteUrl}#${starType}"></use>
        </svg>
      `;

      container.insertAdjacentHTML('beforeend', svg);
    }
  });
}

async function handleReviews() {
  try {
    const data = await getFeedbacks();
    const { feedbacks } = data;

    createFeedbacks(feedbacks);
    initSwiper();

    requestAnimationFrame(() => {
      initStars();
    });

  } catch (err) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load reviews',
      position: 'topRight',
    });
  }
}

handleReviews();