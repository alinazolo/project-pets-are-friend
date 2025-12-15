'use strict';
const scrollToTop = document.querySelector('.scroll-to-top');
window.addEventListener('scroll', function () {
  window.scrollY > 300
    ? scrollToTop.classList.add('visible')
    : scrollToTop.classList.remove('visible');
});
scrollToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
