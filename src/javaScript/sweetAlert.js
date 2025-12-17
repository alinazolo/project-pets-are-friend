import Swal from 'sweetalert2';

const notification = {
  openSuccessAlert(message) {
    this.successAllert(message);
    const notificationContainer = document.querySelector('.swal2-container');
    const okBtn = notificationContainer.querySelector('button.swal2-confirm');
    okBtn.focus();
  },

  successAllert(message) {
    '';
    Swal.fire({
      title: 'Відправка успішна!',
      icon: 'success',
      text: message,
    });
  },
  errorAlert(message) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
    });
  },
};

export default notification;
