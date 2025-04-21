const openPopupButtons = document.querySelectorAll('[data-popup-target]');
const closePopupButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('overlay');


export function applyPopup() {
  openPopupButtons.forEach(button => {
    button.addEventListener('click', () => {
      const popup = document.querySelector(button.dataset.popupTarget); /*extracts the popup HTML as DOM*/
      openPopup(popup);
    });
  });

  closePopupButtons.forEach(button => {
    button.addEventListener('click', () => {
      const popup = button.closest('.popup'); //closest parent of DOM
      closePopup(popup);
    });
  });
}

function openPopup(popup) {
  if (popup == null) return ;
  popup.classList.add('active');
  overlay.classList.add('active');
}

function closePopup(popup) {
  if (popup == null) return;
  popup.classList.remove('active');
  overlay.classList.remove('active');
}

