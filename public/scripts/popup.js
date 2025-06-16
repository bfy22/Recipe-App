import { capitalizeEveryWord } from "./utils/capitalizeEveryWord.js";
import { getRecipeDataByIdFromDataSources } from "./utils/getRecipeDatabyId.js";
import { favoriteRecipes } from "./favorites.js"; 

const overlay = document.getElementById('overlay');

// Extracts clicked button's js-classname (header) to push correct recipe info into Popup
export function setupPopupContent() {
  document.body.addEventListener('click', event => {
    // Handle nutrition / ingredients / steps buttons
    if (
      event.target.classList.contains('js-ingredients-button') ||
      event.target.classList.contains('js-instructions-button') ||
      event.target.classList.contains('js-nutrition-button')
    ) {
      const recipeID = event.target.getAttribute('data-item-id');
      const recipeData = getRecipeDataByIdFromDataSources(recipeID, favoriteRecipes);

      if (!recipeData) {
        console.warn(`No recipe found for popup ID: ${recipeID}`);
        return;
      }

      const eventClass = event.target.className.split(' ')[1]; // e.g., js-ingredients-button
      const header = eventClass.split('-')[1]; // ingredients, instructions, nutrition
      let bodyContent = '';

      if (header === 'nutrition') {
        if (!Array.isArray(recipeData.nutrition) || recipeData.nutrition.length === 0) {
          console.warn(`Invalid or missing nutrition data for recipe ID ${recipeID}`);
          bodyContent = '<li>Nutrition information is unavailable.</li>';
        } else {
          bodyContent = recipeData.nutrition.map(nutrient =>
            `<li><strong>${nutrient.name}:</strong> ${nutrient.amount}</li>`
          ).join('');
        }
      } else {
        const dataArray = recipeData[header];
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
          console.warn(`Invalid or missing "${header}" data for recipe ID ${recipeID}`);
          bodyContent = `<li>${capitalizeEveryWord(header)} information is unavailable.</li>`;
        } else {
          bodyContent = dataArray.map(item => `<li>${item}</li>`).join('');
        }
      }

      const diet = recipeData.vegan ? 'Vegan' : recipeData.vegetarian ? 'Vegetarian' : '';
      document.querySelector('.popup-header .diet').innerHTML = diet;

      const dairyFree = recipeData.dairyFree ? 'Dairy Free' : '';
      document.querySelector('.popup-header .dairyFree').innerHTML = dairyFree;

      const glutenFree = recipeData.glutenFree ? 'Gluten Free' : 'Recipe';
      document.querySelector('.popup-header .title').innerHTML = glutenFree;

      document.querySelector('.popup-header .cookingTime').innerHTML = `${recipeData.cookingTimeMins} mins`;

      const popupBody = document.querySelector('#popup .popup-body');
      popupBody.innerHTML = `
        <h2 class="pop-recipe-title">${recipeData.title}</h2>
        <h3 class="pop-info-header">${capitalizeEveryWord(header)}</h3>
        <ul class="pop-list">
          ${bodyContent}
        </ul>
      `;

      openPopup(document.getElementById('popup'));
    }

    // Close logic
    if (event.target.matches('[data-close-button]') || event.target === overlay) {
      closePopup(document.querySelector('.popup.active'));
    }
  });
}

function openPopup(popup) {
  if (popup) {
    popup.classList.add('active');
    overlay.classList.add('active');
  }
}

function closePopup(popup) {
  if (popup) {
    popup.classList.remove('active');
    overlay.classList.remove('active');
  }
}
