// scripts for the order modal
import { postOrder } from './modalAPI';
import notification from './sweetAlert';
import baseModal from './modal';

const orderForm = {
  animalId: null,
  getMarkup() {
    return `<form class="order-form js-order-form">
                <h2 class="order-title">Залишіть заявку на знайомство</h2>
                <label for="name">Ім’я*</label>
                <input type="text" id="name" name="name" placeholder="Андрій">
                <label for="phone">Телефон*</label>
                <input type="text" name="phone" id="phone" placeholder="+38 (095) 555 99 22">
                <label for="comment">Коментар</label>
                <textarea type="textarea" name="comment" id="comment" placeholder="Напишіть ваш коментар"></textarea>
               <div class='order-controllers-container'> <button type="submit" class="dark">Надіслати</button></div>
            </form>`;
  },
  listnerHandler() {
    const orderForm = document.querySelector('.js-order-form');
    orderForm.addEventListener('submit', async e => {
      e.preventDefault();
      const form = new FormData(orderForm);
      const params = {
        name: form.get('name').trim(),
        phone: form.get('phone').trim(),
        animalId: this.animalId,
      };
      form.get('comment').trim() &&
        (params.comment = form.get('comment').trim());
      const validationPassed = this.fieldsValidation(params);
      if (!validationPassed) {
        return;
      }
      const data = await postOrder(params);
      e.target.reset();
      baseModal.closeModal();
      notification.openSuccessAlert(
        `${params.name}, ${data.animalName} з нетерпінням чекає на зустріч.`
      );
    });
  },
  fieldsValidation(params) {
    if (params.name === '' || params.phone === '') {
      notification.errorAlert(`Заповніть, будь ласка І'мя та Телефон.`);
      return false;
    }
    if (params.name.length > 32) {
      notification.errorAlert(
        `Максимальна довжина І'мя не має перевищувати 32 символи.`
      );
      return false;
    }
    if (!params.phone.match(/^[0-9]{12}$/)) {
      notification.errorAlert(`Телефон має складатися з 12 цифр.`);
      return false;
    }
    if (params.comment && params.comment.length > 500) {
      notification.errorAlert(
        `Максимальна довжина Коментаря не має перевищувати 500 символів. Зараз він ${params.comment.length} символів.`
      );
      return false;
    }
    return true;
  },
};
export default orderForm;
