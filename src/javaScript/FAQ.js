// scripts for the faq section

const headers = document.querySelectorAll('.faq-accordion-header');

headers.forEach(header => {
  header.addEventListener('click', () => {
    const icon = header.querySelector('.faq-accordion-icon');
    const content = header.nextElementSibling;
    
    icon.classList.toggle('faq-accordion-icon--rotated');
    content.classList.toggle('faq-accordion-content--visible');
  });
});
