import {} from 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js'; //icons
import {setupPopupContent} from './popup.js';
import { capitalizeEveryWord } from './utils/capitlizeEveryWord.js';
import { manageFavorites, renderFavorites, favoriteRecipes } from './favorites.js';
import { requireAuth } from './utils/authentication.js';
import { templates } from './templatesHTML.js';
import { setupRegister, setupLogin, setupLogout } from './userSession.js';



const API_Key = 'd356faf76ff245fc87c936fbaa616aeb';
let userSearchQuery = '';


renderPage('home');

document.body.addEventListener('click', (event) => {
  const page = event.target.getAttribute('data-page');
  if (page) {
    renderPage(page);
  }
});


export function renderPage(page) {
  const app = document.getElementById('app');
  app.innerHTML = templates[page];
  
  // Call specific functions for each page
  if (page === 'home') {
    renderSearchResults();
    setupLogout(page);
    requireAuth(page, () => renderFavorites());
  } else if (page === 'favorites') {
    requireAuth(page, () => renderFavorites());
    setupLogout(page);
  } else if (page === 'login') {
    setupLogin();
    setupLogout(page);
  } else if (page === 'register') {
    setupRegister();
    setupLogout(page);
  }
}





function renderSearchResults() {
  const searchForm = document.querySelector('.js-form');
  const searchResultDivObj = document.querySelector('.js-search-results'); 
  const projectContainer = document.querySelector('.js-container');

  const savedSearchResults = sessionStorage.getItem('searchResults');
  const savedUserSearchQuery = sessionStorage.getItem('userSearchQuery');

  if (savedSearchResults) {
    console.log('Loading search results from session storage...');
    const parsedResults = JSON.parse(savedSearchResults);

    const preProcessedSearchResults = parsedResults.map(result => ({
      ...result,
      title: capitalizeEveryWord(result.title),
    }));

    const recipeDataArray = generateSearchResults(preProcessedSearchResults, searchResultDivObj, projectContainer);
    manageFavorites(recipeDataArray);
    setupPopupContent(recipeDataArray);
  }

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    userSearchQuery = event.target.querySelector('input').value;

    sessionStorage.removeItem('searchResults');
    sessionStorage.removeItem('userSearchQuery');

    callAPI(userSearchQuery, searchResultDivObj, projectContainer);
    console.log('Rendering search results...');
  });
}


async function callAPI(userSearchQuery, searchResultDivObj, projectContainer) {
  const baseURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_Key}&query=${userSearchQuery}&addRecipeNutrition=true&addRecipeInstructions=true&instructionsRequired=true&fillIngredients=true&number=8`
  const response = await fetch(baseURL);
  const fetchedData = await response.json(); /*json to obj method for fetches*/

  sessionStorage.setItem('searchResults', JSON.stringify(fetchedData.results));
  sessionStorage.setItem('userSearchQuery', userSearchQuery); 
  
  const preProcessedSearchResults = fetchedData.results.map(result => ({ ... result,   //clone each object
    title: capitalizeEveryWord(result.title)
  }));

  const recipeDataArray = generateSearchResults(preProcessedSearchResults, searchResultDivObj, projectContainer); 
  manageFavorites(recipeDataArray);
  setupPopupContent(recipeDataArray);
}

function generateSearchResults(searchResults, searchResultDivObj, projectContainer) { //create array of objects with relevant data
  projectContainer.classList.remove('initial');

  const recipeDataArray = searchResults.map(result => { //generates an array object 

    const isFavorite = favoriteRecipes.some(favRecipe => favRecipe.id === result.id);
    const heartIconName = isFavorite ? 'heart' : 'heart-outline'; 

    return {
      title: result.title,
      id: result.id,     
      ingredients: result.extendedIngredients?.map(ingredient => ingredient.original) || [],  
      instructions: result.analyzedInstructions?.[0]?.steps?.map(step => step.step) || [],
      nutrition: result.nutrition.nutrients.map(item => `${item.name}: ${item.amount}${item.unit}`),
      cookingTimeMins: result.readyInMinutes,
      dairyFree: result.dairyFree,
      glutenFree: result.glutenFree,
      vegan: result.vegan,
      vegetarian: result.vegetarian,
      html: `
        <div class="item">
          <img src="${result.image}" alt=""> 
          <button class="favorite-button js-favorite-button"><ion-icon name="${heartIconName}" data-item-id=${result.id}></ion-icon></button>
          <div>
            <div class="flex-result-info">
              <h1 class="title"><a class="title-Url" href="${result.sourceUrl}">${result.title}</a></h1>
              <button class="recipe-button js-ingredients-button" data-popup-target="#popup" data-item-id=${result.id}>Recipe</button> 
            </div>
            <div class="flex-result-info flex-result-bottom">
              <button class="nutrition-button js-nutrition-button" data-popup-target="#popup" data-item-id=${result.id}>Nutrition</button>
              <button class="steps-button js-instructions-button" data-popup-target="#popup" data-item-id=${result.id}>Steps</button> 
            </div>
          </div>
        </div>
      `
    }       
  });
  
  const generatedResultsHTML = recipeDataArray.map(data => data.html).join('');
  searchResultDivObj.innerHTML = generatedResultsHTML; 
  
  return recipeDataArray;
}



