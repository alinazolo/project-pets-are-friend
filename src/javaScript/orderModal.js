// scripts for the order modal
import { postOrder } from './modalAPI';
import notification from './sweetAlert';
import baseModal from './modal';

const orderForm = {
  animalId: null,
  getMarkup() {
    return `<form class="order-form js-order-form">
                <h2 class="order-title">Залишіть заявку на знайомство</h2>
                <div class='order-form-name-block'>
                <label for="name">Ім’я*</label>
                <input type="text" id="name" name="name" placeholder="Андрій">
                <span class="validation js-name-validation">Максимальна довжина ${this.validation.lengthLimits.name} символи</span></div>
                 <div class='order-form-phone-block'>
                <label for="phone">Телефон*</label>
                <input type="text" name="phone" id="phone" placeholder="+38 (095) 555 99 22">
                 <span class="validation js-phone-validation">Очікується ${this.validation.lengthLimits.phone} цифр</span></div>
                 <div class='order-form-comment-block'><label for="comment">Коментар</label>
                <textarea type="textarea" name="comment" id="comment" placeholder="Напишіть ваш коментар"></textarea>
                 <span class="validation js-comment-validation">Максимальна довжина ${this.validation.lengthLimits.comment} символів</span></div>
               <div class='order-controllers-container'> <button type="submit" class="dark">Надіслати</button></div>
            </form>`;
  },
  getFormEle() {
    return document.querySelector('.js-order-form');
  },
  listnerHandler() {
    this.formSubmitHandler();
    this.formInputHandler();
    this.formFocusInHandler();
    this.formFocusOutHandler();
  },
  formSubmitHandler() {
    const orderForm = this.getFormEle();
    orderForm.addEventListener('submit', async e => {
      e.preventDefault();
      const form = new FormData(orderForm);
      const params = {
        name: form.get('name').trim(),
        phone: form.get('phone').trim().replace(/\D+/g, ''),
        animalId: this.animalId,
      };
      form.get('comment').trim() &&
        (params.comment = form.get('comment').trim());
      const validationPassed = this.validation.formValidation(params);
      if (!validationPassed) {
        return;
      }
      notification.openSuccessAlert(`${params.name}, Ваш запит відправлено.`);
      const data = await postOrder(params);
      e.target.reset();
      baseModal.closeModal();
      notification.openSuccessAlert(
        `${params.name}, ${data.animalName} з нетерпінням чекає на зустріч.`
      );
    });
  },
  formInputHandler() {
    let timeoutId;
    const orderForm = this.getFormEle();
    orderForm.addEventListener('input', async e => {
      let handleCheck;
      let maxLength;
      let inputName;
      switch (e.target) {
        case orderForm.elements['name']:
          inputName = 'name';
          maxLength = this.validation.lengthLimits.name;
          handleCheck = () =>
            this.validation.checkMaxLength('name', e.target.value);
          break;
        case orderForm.elements['phone']:
          inputName = 'phone';
          maxLength = this.validation.lengthLimits.phone;
          handleCheck = () => this.validation.checkPhone(e.target.value);
          break;
        case orderForm.elements['comment']:
          inputName = 'comment';
          maxLength = this.validation.lengthLimits.comment;
          handleCheck = () =>
            this.validation.checkMaxLength('comment', e.target.value);
          break;
        default: {
        }
      }
      e.target.classList.remove('input-error');
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const validationLabel = orderForm.querySelector(
          `.js-${inputName}-validation`
        );
        let outputValue = e.target.value;
        if (inputName === 'phone') {
          outputValue = this.validation.cleanPhoneValue(e.target.value);
        }
        validationLabel.innerHTML = `${outputValue.length} з ${maxLength}`;
        if (!handleCheck()) {
          e.target.classList.add('input-error');
          validationLabel.classList.add('error');
        } else {
          e.target.classList.remove('input-error');
          validationLabel.classList.remove('error');
        }
      }, 500);
    });
  },
  formFocusInHandler() {
    const orderForm = this.getFormEle();
    orderForm.addEventListener('focusin', async e => {
      if (
        e.target === orderForm.elements['name'] ||
        e.target === orderForm.elements['phone'] ||
        e.target === orderForm.elements['comment']
      ) {
        e.target.classList.remove('input-error');
      }
    });
  },
  formFocusOutHandler() {
    const orderForm = this.getFormEle();
    orderForm.addEventListener('focusout', async e => {
      switch (e.target) {
        case orderForm.elements['phone']:
          if (!this.validation.checkPhone(e.target.value)) {
            e.target.classList.add('input-error');
          }
          break;
        default: {
        }
      }
    });
  },
  validation: {
    lengthLimits: { name: 32, phone: 12, comment: 500 },
    message: {
      notEmpty: { name: '', phone: '' },
      maxLength: { name: '', comment: '' },
      content: { phone: '' },
    },
    cleanPhoneValue(phone) {
      return phone.trim().replace(/\D+/g, '');
    },
    checkIsNotEmpty(inputName, inputValue) {
      let messageName = '';
      if (inputValue === '') {
        switch (inputName) {
          case 'name':
            messageName = "І'мя";
            break;
          case 'phone':
            messageName = 'Телефон';
            break;
          default: {
          }
        }
        this.message.notEmpty[
          inputName
        ] = `Заповніть, будь ласка, ${messageName}.`;
        return false;
      }
      this.message.notEmpty[inputName] = '';
      return true;
    },
    checkMaxLength(inputName, inputValue) {
      let maxLength = '';
      let messageName = '';
      switch (inputName) {
        case 'name':
          maxLength = this.lengthLimits.name;
          messageName = "І'мя";
          break;
        case 'comment':
          maxLength = this.lengthLimits.comment;
          messageName = 'Коментаря';
          break;
        default:
          [];
      }
      if (inputValue.length > maxLength) {
        this.message.maxLength[
          inputName
        ] = `Максимальна довжина ${messageName} не має перевищувати ${maxLength} символів.`;
        return false;
      }
      this.message.maxLength[inputName] = '';
      return true;
    },
    checkPhone(phoneInputValue) {
      const cleanedPhone = this.cleanPhoneValue(phoneInputValue);
      if (!cleanedPhone.match(/^[0-9]{12}$/)) {
        this.message.content[
          'phone'
        ] = `Телефон повинен містити ${this.lengthLimits.phone} цифр.`;
        return false;
      }
      this.message.content['phone'] = '';
      return true;
    },
    formValidation(params) {
      const namePassed =
        this.checkIsNotEmpty('name', params.name) &&
        this.checkMaxLength('name', params.name);
      const phonePassed =
        this.checkIsNotEmpty('phone', params.phone) &&
        this.checkPhone(params.phone);
      const commentPassed = params.comment
        ? this.checkMaxLength('comment', params.comment)
        : true;

      const validationPassed = namePassed && phonePassed && commentPassed;
      if (!validationPassed) {
        const nameMessage =
          this.message.notEmpty.name || this.message.maxLength.name;
        const phoneMessage =
          this.message.notEmpty.phone || this.message.content.phone;
        const commentMessage = this.message.maxLength.comment;
        const accuMessage = `${nameMessage ? nameMessage + '<br>' : ''}
          ${phoneMessage ? phoneMessage + '<br>' : ''}
         ${commentMessage ? commentMessage + '<br>' : ''}`;
        notification.errorAlert(accuMessage);
      }
      return validationPassed;
    },
  },
};
export default orderForm;
