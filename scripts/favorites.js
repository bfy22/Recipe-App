

let favoriteRecipes = [];

 
export async function renderFavorites() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to view your favorites');
    window.location.href = 'login.html';
    return;
  }

  const response = await fetch('http://localhost:3000/favorites', {
    headers: { Authorization: token },
  });

  if (response.ok) {
    const favorites = await response.json();
    const favoritesDOM = document.querySelector('.js-favorites');
    const favoritesHTML = favorites.map(recipe => `
      <div class="favorite-item">
        <h2>${recipe.title}</h2>
        <img src="${recipe.image}" alt="${recipe.title}">
      </div>
    `).join('');
    favoritesDOM.innerHTML = favoritesHTML;
  } else {
    alert('Failed to fetch favorites');
  }
}

export function manageFavorites(recipeDataArray) {
  document.body.addEventListener('click', event => {
    const favoriteButton = event.target.closest('.js-favorite-button')
    if(!favoriteButton) return;

    const heartIcon = favoriteButton.querySelector('ion-icon');
    const recipeID = event.target.getAttribute('data-item-id'); 
    const recipe = recipeDataArray.find(recipe => recipe.id == recipeID); 
    if (!recipe) return; 

    
    const favIndex = favoriteRecipes.findIndex(favRecipe => favRecipe.id == recipeID);

    if (favIndex !== -1) {
      favoriteRecipes.splice(favIndex, 1);
      heartIcon.setAttribute('name', 'heart-outline');
    } else {
      favoriteRecipes.push(recipe);
      heartIcon.setAttribute('name', 'heart');
    }

    heartIcon.classList.add('bounce');
    setTimeout(() => heartIcon.classList.remove('bounce'), 400);
    console.log(favoriteRecipes); 
    saveToLocalStorage();
  });
  
}

function saveToLocalStorage() {
  localStorage.setItem('Favorite Recipes', JSON.stringify(favoriteRecipes));
}