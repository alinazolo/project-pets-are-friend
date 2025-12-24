const refs = {
  main: document.querySelector('main'),
  modalContainer: document.querySelector('.js-modal-backdrop'),
  modalContent: document.querySelector('.js-modal-content'),
  openModalBtn: document.querySelector('.open-modal-btn'),
  closeModalBtn: document.querySelector('.js-close-modal-btn'),
};

let lastFocusedNode = null;
const baseModal = {
  modalBackdrop: refs.modalContainer,
  modalContent: refs.modalContent,
  closeBtn: refs.closeModalBtn,
  mouseDownOnBackdrop: false,
  getFocusableNodes() {
    return this.modalBackdrop.querySelectorAll('a, button, input, textarea');
  },
  openModal(contentObj) {
    lastFocusedNode = document.activeElement;
    this.modalContent.innerHTML = contentObj.getMarkup();
    contentObj.listnerHandler && contentObj.listnerHandler();
    this.modalBackdrop.classList.remove('is-hidden');
    requestAnimationFrame(() => {
      this.modalBackdrop.classList.add('is-open');
    });
    document.body.classList.add('modal-open');
    const focusable = this.getFocusableNodes();
    let targetNode = null;
    for (const node of focusable) {
      if (node.tagName === 'INPUT') {
        targetNode = node;
        break;
      }
      targetNode = focusable[1];
    }
    targetNode?.focus();
    this.closeBtn.addEventListener('click', this.closeModal.bind(baseModal));
    this.modalBackdrop.addEventListener('mousedown', e => {
      this.mouseDownOnBackdrop = e.target === this.modalBackdrop;
    });
    this.modalBackdrop.addEventListener('mouseup', e => {
      this.mouseDownOnBackdrop &&
        e.target === this.modalBackdrop &&
        this.closeModal();
      this.mouseDownOnBackdrop = false;
    });
    document.addEventListener('keydown', e => {
      this.disableNotModalActions(e);
    });
  },
  closeModal() {
    this.modalBackdrop.classList.remove('is-open');
    setTimeout(() => {
      this.modalBackdrop.classList.add('is-hidden');
    }, 250);
    document.body.classList.remove('modal-open');
    if (refs.main.getAttribute('aria-hidden' === false)) {
      lastFocusedNode?.focus();
    }
  },
  disableNotModalActions(e) {
    if (
      e.key === 'Escape' &&
      this.modalBackdrop.classList.contains('is-open')
    ) {
      this.closeModal();
    }
    if (e.key === 'Tab' && this.modalBackdrop.classList.contains('is-open')) {
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
