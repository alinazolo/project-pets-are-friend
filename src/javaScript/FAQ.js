// scripts for the faq section

const headers = document.querySelectorAll('.faq-accordion-header');

headers.forEach(header => {
  header.addEventListener('click', () => {
    const icon = header.querySelector('.faq-accordion-icon');
    const content = header.nextElementSibling;
    
    // Close all other accordion items
    headers.forEach(otherHeader => {
      if (otherHeader !== header) {
        const otherIcon = otherHeader.querySelector('.faq-accordion-icon');
        const otherContent = otherHeader.nextElementSibling;
        otherIcon.classList.remove('faq-accordion-icon--rotated');
        otherContent.classList.remove('faq-accordion-content--visible');
      }
    });
    
    // Toggle current item
    icon.classList.toggle('faq-accordion-icon--rotated');
    content.classList.toggle('faq-accordion-content--visible');
  });
});
