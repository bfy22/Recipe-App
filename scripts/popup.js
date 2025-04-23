const overlay = document.getElementById('overlay');



export function handlePopup() {
  document.body.addEventListener('click', (event) => {
    const target = event.target;
    
    if (target.matches('.js-recipe-button')) { //open popup
      const popup = document.querySelector(target.dataset.popupTarget);
      openPopup(popup);
      
    } else if (target.matches('[data-close-button]')) { //close popup
      const popup = target.closest('.popup');
      closePopup(popup);
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

