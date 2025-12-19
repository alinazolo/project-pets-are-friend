const refs = {
  main: document.querySelector('main'),
  modalContainer: document.querySelector('.js-modal-backdrop'),
  modalContent: document.querySelector('.js-modal-content'),
  openModalBtn: document.querySelector('.open-modal-btn'),
  closeModalBtn: document.querySelector('.js-close-modal-btn'),
};

let lastFocusedNode = null;
const baseModal = {
  modalNode: refs.modalContainer,
  modalContent: refs.modalContent,
  closeBtn: refs.closeModalBtn,

  getFocusableNodes() {
    return this.modalNode.querySelectorAll('a, button, input, textarea');
  },
  openModal(contentObj) {
    lastFocusedNode = document.activeElement;
    this.modalContent.innerHTML = contentObj.getMarkup();
    contentObj.listnerHandler && contentObj.listnerHandler();
    this.modalNode.classList.remove('is-hidden');
    requestAnimationFrame(() => {
      this.modalNode.classList.add('is-open');
    });
    document.body.classList.add('modal-open');
    const focusable = this.getFocusableNodes();
    focusable[0]?.focus();
    this.closeBtn.addEventListener('click', this.closeModal.bind(baseModal));
    this.modalNode.addEventListener('click', e => {
      e.target === this.modalNode && this.closeModal();
    });
    document.addEventListener('keydown', e => {
      this.disableNotModalActions(e);
    });
  },
  closeModal() {
    this.modalNode.classList.remove('is-open');
    setTimeout(() => {
      this.modalNode.classList.add('is-hidden');
    }, 250);
    document.body.classList.remove('modal-open');
    if (refs.main.getAttribute('aria-hidden' === false)) {
      lastFocusedNode?.focus();
    }
  },
  disableNotModalActions(e) {
    if (e.key === 'Escape' && this.modalNode.classList.contains('is-open')) {
      this.closeModal();
    }
    if (e.key === 'Tab' && this.modalNode.classList.contains('is-open')) {
      const focusable = this.getFocusableNodes();
      const firstNode = focusable[0];
      const lastNode = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === firstNode) {
        e.preventDefault();
        lastNode.focus();
      }
      if (!e.shiftKey && document.activeElement === lastNode) {
        e.preventDefault();
        firstNode.focus();
      }
    }
  },
};

export default baseModal;
