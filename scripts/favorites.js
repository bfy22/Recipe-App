import { renderPage } from "./main.js";


export let favoriteRecipes = [];

 
export async function renderFavorites() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to view your favorites');
    renderPage('login');
    return;
  }

  const favoritesDOM = document.querySelector('.js-favorites');
  if (!favoritesDOM) {
    console.warn('Favorites DOM element not found. Skipping renderFavorites.');
    return;
  }

  try {
    const response = await fetch('http://localhost:4000/favorites', {
      headers: { Authorization: token },
    });

    if (response.ok) {
      const favorites = await response.json();
      console.log('Fetched favorites:', favorites);
      favoriteRecipes = favorites;

      const favoritesHTML = favorites.map(recipe => `
        ${recipe.html}`).join('');
      favoritesDOM.innerHTML = favoritesHTML;
      
    } else {
      const errorMessage = await response.text();
      console.error('Failed to fetch favorites:', errorMessage); 
      alert('Failed to fetch favorites');
    }
  } catch (error) {
    console.error('Error occured while fetching favorites:', error);
    alert('An error occurred while fetching favorites');
  }
}


let isFavoritesListenerAttached = false;

export function manageFavorites(recipeDataArray) {
  if (isFavoritesListenerAttached) return; 
  isFavoritesListenerAttached = true;

  document.body.addEventListener('click', async (event) => {
    const favoriteButton = event.target.closest('.js-favorite-button');
    if (!favoriteButton) return;

    const heartIcon = favoriteButton.querySelector('ion-icon');
    const recipeID = favoriteButton.querySelector('ion-icon').getAttribute('data-item-id');
    const recipe = recipeDataArray.find(recipe => recipe.id == recipeID);
    if (!recipe) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to manage your favorites.');
      renderPage('login');
      return;
    }

    heartIcon.classList.add('bounce');
    setTimeout(() => heartIcon.classList.remove('bounce'), 400);
    

    const favIndex = favoriteRecipes.findIndex(favRecipe => favRecipe.id == recipeID);

    if (favIndex !== -1) {
      
      favoriteRecipes.splice(favIndex, 1);
      heartIcon.setAttribute('name', 'heart-outline');
      await updateFavoritesOnServer(recipe, 'remove', token); 
    } else {
      
      favoriteRecipes.push(recipe);
      heartIcon.setAttribute('name', 'heart');
      await updateFavoritesOnServer(recipe, 'add', token); 
    }

    console.log(favoriteRecipes);
  });
}

// Helper function to update favorites on the server
async function updateFavoritesOnServer(recipe, action, token) {
  try {
    const response = await fetch('http://localhost:4000/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ recipe, action }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error('Failed to update favorites on server:', errorMessage);
      alert('Failed to update favorites on server');
    }
  } catch (error) {
    console.error('Error updating favorites on server:', error);
    alert('An error occurred while updating favorites');
  }
}