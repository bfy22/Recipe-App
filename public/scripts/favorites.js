import { renderPage } from "./main.js";
import { generateRecipeHTML } from "./utils/renderHelper.js";
import { getRecipeDataByIdFromFavorites } from "./utils/getRecipeDatabyId.js";

// Exposed so other modules can reference favorite list
export let favoriteRecipes = [];

//fetches favorites from server endpoint with error handling and fills rendered buttons
function getRecipeDataById(id) {
  const storedData = sessionStorage.getItem('searchResults');
  if (!storedData) return null;

  const parsed = JSON.parse(storedData);
  return parsed.find(recipe => recipe.id == id);
}

let isFavoritesListenerAttached = false;

// Attach favorite logic to heart buttons
export function manageFavorites() {
  if (isFavoritesListenerAttached) return;
  isFavoritesListenerAttached = true;

  document.body.addEventListener('click', async (event) => {
    const favoriteButton = event.target.closest('.js-favorite-button');
    if (!favoriteButton) return;

    const heartIcon = favoriteButton.querySelector('ion-icon');
    const recipeID = heartIcon?.getAttribute('data-item-id');
    const recipe = getRecipeDataByIdFromFavorites(recipeID, favoriteRecipes);
    if (!recipe) {
      console.warn(`Recipe not found for favorite toggle: ID ${recipeID}`);
      return;
    }

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

    renderFavorites(); 
  });
}

// Refresh favorites from server
export async function renderFavorites() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to view your favorites');
    renderPage('login');
    return;
  }

  const favoritesDOM = document.querySelector('.js-favorites');
  if (!favoritesDOM) {
    console.warn('Favorites DOM element not found.');
    return;
  }

  try {
    const response = await fetch('http://localhost:4000/api/favorites', {
      headers: {  'Authorization': `Bearer ${token}` },
    });

    if (response.ok) {
      const favorites = await response.json();
      favoriteRecipes = favorites;

      const favoritesHTML = favorites.map(recipe => generateRecipeHTML(recipe, true)).join('');
      favoritesDOM.innerHTML = favoritesHTML;

      
      favoritesDOM.querySelectorAll('ion-icon[data-item-id]').forEach(icon => {
        icon.setAttribute('name', 'heart');
      });
    } else {
      const errorMessage = await response.text();
      console.error('Failed to fetch favorites:', errorMessage);
      alert('Failed to fetch favorites');
    }
  } catch (error) {
    console.error('Error fetching favorites:', error);
    alert('An error occurred while fetching favorites');
  }
}

// Server sync
async function updateFavoritesOnServer(recipe, action, token) {
  try {
    const response = await fetch('http://localhost:4000/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`,
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
