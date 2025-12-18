// scripts for the success stories section
import 'css-star-rating/css/star-rating.css';

import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

import axios from 'axios'
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
  const markup = feedbacks.map(({ author, rate, description }) => {
    const whole = Math.floor(rate);
    const isHalf = rate % 1 === 0.5;
    const ratingClass = `rating value-${whole} ${isHalf ? 'half' : ''}`;

    const starSVG = `
      <svg class="icon star-empty"><use href="./sprite.svg#icon-star-outline"></use></svg>
      <svg class="icon star-half"><use href="./sprite.svg#icon-star-half"></use></svg>
      <svg class="icon star-filled"><use href="./sprite.svg#icon-star-filled"></use></svg>
    `;

    const stars = Array.from({ length: 5 })
      .map(() => `<div class="star">${starSVG}</div>`)
      .join('');

    return `
      <li class="swiper-slide success-stories-list">
        <div class="${ratingClass} star-icon color-default">
          <div class="star-container">
            ${stars}
          </div>
        </div>
        <p class="success-stories-list-review">${description}</p>
        <p class="success-stories-list-author">${author}</p>
      </li>
    `;
  }).join('');

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


async function handleReviews() {
  try {
    const data = await getFeedbacks();
    const { feedbacks } = data;

    createFeedbacks(feedbacks);
    initSwiper();

// setTimeout(() => {
//   requestAnimationFrame(initRatings);
// }, 0);

  } catch (err) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load reviews',
      position: 'topRight',
    });
  }
}

handleReviews();
