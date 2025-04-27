import { capitalizeEveryWord } from "./utils/capitlizeEveryWord.js";
const overlay = document.getElementById('overlay');


//sets listeners to push recipe info with DOM
export function setupPopupContent(recipeDataArray) { 
  document.body.addEventListener('click', event => {
    if((event.target.classList.contains('js-ingredients-button')) || (event.target.classList.contains('js-instructions-button')) || (event.target.classList.contains('js-nutrition-button'))) {
      const recipeID = event.target.getAttribute('data-item-id');
      const recipeData = recipeDataArray.find(recipe => recipe.id === parseInt(recipeID)); 

      const classNames = event.target.className.split(' ');
      const secondClass = classNames[1];
      const header = secondClass.split('-')[1]; //represents the title of the content and variable from recipeData
      const bodyContent = recipeData[header].map(item => `<li>${item}</li>`).join('');
      


      if(recipeData) {
        console.log(recipeData)
        const popupBody = document.querySelector('#popup .popup-body');
        popupBody.innerHTML = `
          <h2>${recipeData.title}</h2>
          <h3>${header}</h3>
          <ul>
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

