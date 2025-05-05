import { capitalizeEveryWord } from "./utils/capitlizeEveryWord.js";
const overlay = document.getElementById('overlay');


//extracts clicked button's js-classname (header) to push correct recipe info into Popup
export function setupPopupContent(recipeDataArray) { 
  document.body.addEventListener('click', event => {
    if((event.target.classList.contains('js-ingredients-button')) || (event.target.classList.contains('js-instructions-button')) || (event.target.classList.contains('js-nutrition-button'))) {
      const recipeID = event.target.getAttribute('data-item-id');
      const recipeData = recipeDataArray.find(recipe => recipe.id === parseInt(recipeID)); 

      const eventClassNames = event.target.className.split(' ');
      const secondClass = eventClassNames[1];
      const header = secondClass.split('-')[1]; //info title and recipeData variable
      const bodyContent = recipeData[header].map(item => `<li>${item}</li>`).join('');
      


      if(recipeData) {
        
        const popupBody = document.querySelector('#popup .popup-body');
        popupBody.innerHTML = `
          <h2 class="pop-recipe-title">${recipeData.title}</h2>
          <h3 class="pop-header">${capitalizeEveryWord(header)}</h3>
          <ul class="pop-list">
            ${bodyContent}
          </ul>
        `;
        openPopup(document.getElementById('popup'));
      }
    }

    if(event.target.matches('[data-close-button]') || event.target === overlay) {
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

