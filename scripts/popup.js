const overlay = document.getElementById('overlay');


//sets listeners to push recipe info with DOM
export function setupPopupContent(recipeDataArray) { 
  document.body.addEventListener('click', event => {
    if(event.target.classList.contains('js-recipe-button')) {
      const recipeID = event.target.getAttribute('data-item-id');
      const recipeData = recipeDataArray.find(recipe => recipe.id === parseInt(recipeID)); 

      const fullClassName = event.target.className;
      const header = fullClassName.split('-')[1];
      const content = 


      if(recipeData) {
        const popupBody = document.querySelector('#popup .popup-body');
        popupBody.innerHTML = `
          <h2>${recipeData.title}</h2>
          <h3>${header}</h3>
          <ul>
            ${recipeData.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
          </ul>
        `;
        openPopup(document.getElementById('popup'));
      }
    }

    if(event.target.matches('[data-close-button]') || target === overlay) {
      closePopup(document.querySelector('.popup.active'))
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

