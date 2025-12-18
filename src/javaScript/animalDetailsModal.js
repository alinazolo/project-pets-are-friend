// scripts for the animal details modal

import baseModal from './modal';
import orderForm from './orderModal';

const animalDetail = {
  animalId: '',
  data: {},
  getMarkup() {
    return `<div class="animal-details-container js-animal-details-container">
    <div class="animal-details-img-container">
    <img src=${this.data.image}></div>
    <div class="animal-details-content-container">
    <div class="grid-header">   <p class="animal-details-species">${this.data.species}</p>
    <h3 class="animal-details-name">${this.data.name}</h3>
    <ul class="animal-details-age-and-gender-list">
    <li class="animal-details-age">${this.data.age}</li>
    <li class="animal-details-gender">${this.data.gender}</li> </ul></div>
   <div class="grid-description"><h4>Опис:</h4>
    <p class="animal-details-description">${this.data.description}</p>
    <h4>Здоров’я:</h4>
    <p class="animal-details-healthStatus">${this.data.healthStatus}</p>
    <h4>Поведінка:</h4>
    <p class="animal-details-behavior">${this.data.behavior}</p></div>
    <div class='animal-details-controllers-container grid-button'> 
    <button type="button" class="dark js-go-to-order-btn">Взяти додому</button>
    </div>
    </div>
    </div>`;
  },
  listnerHandler() {
    const goToOrderBtn = document.querySelector('.js-go-to-order-btn');
    goToOrderBtn.addEventListener('click', async e => {
      orderForm.animalId = this.animalId;
      baseModal.openModal(orderForm);
    });
  },
};
export default animalDetail;
