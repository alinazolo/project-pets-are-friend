import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

Swiper.use([Navigation, Pagination]);

export const aboutSwiper = new Swiper('.about-slider', {
  slidesPerView: 1,
  allowTouchMove: true,
  touchStartPreventDefault: false,
  simulateTouch: true,
  grabCursor: true,

  navigation: {
    nextEl: '.about-btn-next',
    prevEl: '.about-btn-prev',
  },

  pagination: {
    el: '.about-pagination',
    clickable: true,
    dynamicBullets: false,
    renderBullet: function (index, className) {
      return `<span class="${className}"></span>`;
    },
  },

  on: {
    init: function () {
      updateBulletSizes(this);
    },
    slideChange: function () {
      updateBulletSizes(this);
    },
  },
});

function updateBulletSizes(swiper) {
  const bullets = swiper.pagination.bullets;
  const activeIndex = swiper.activeIndex;

  const isMobileDevice = window.innerWidth <= 768;

  if (!isMobileDevice) {
    bullets.forEach(bullet => {
      bullet.style.width = '8px';
      bullet.style.height = '8px';
    });
    return;
  }

  bullets.forEach((bullet, index) => {
    bullet.style.width = '4px';
    bullet.style.height = '4px';

    if (index === activeIndex) {
      bullet.style.width = '8px';
      bullet.style.height = '8px';
    } else if (index === activeIndex - 1 || index === activeIndex + 1) {
      bullet.style.width = '6px';
      bullet.style.height = '6px';
    }
  });
}

window.addEventListener('resize', () => updateBulletSizes(aboutSwiper));
