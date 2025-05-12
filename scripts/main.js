import {} from 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js'; //icons
import { setupPopupContent } from './popup.js';
import { capitalizeEveryWord } from './utils/capitlizeEveryWord.js';
import { manageFavorites, renderFavorites, favoriteRecipes } from './favorites.js';
import { requireAuth } from './utils/authentication.js';
import { templates } from './templatesHTML.js';
import { setupRegister, setupLogin, setupLogout } from './userSession.js';


const API_Key = 'd356faf76ff245fc87c936fbaa616aeb';
let userSearchQuery = '';


renderPage('home');

//saves intent to redirect to footer options after login
document.body.addEventListener('click', (event) => {
  const page = event.target.getAttribute('data-page');
  if (!page) return;

  const token = localStorage.getItem('token');
  const protectedPages = ['favorites'];

  if (protectedPages.includes(page) && !token) {
    sessionStorage.setItem('redirectAfterLogin', page); // Save intent
    renderPage('login');
  } else {
    renderPage(page);
  }
});

//renders an HTML template to implement SPA architecture, using token as a key
export function renderPage(page) {
  console.log(`Rendering page: ${page}`);
  const app = document.getElementById('app');
  app.innerHTML = templates[page];

  const token = localStorage.getItem('token');

  if (page === 'home') {
    if (token) {
      
      renderSearchResults();
      setupLogout(page);
      renderFavorites();
    } else {
      console.warn('User not logged in. Redirecting to login page.');
      renderPage('login');
    }
  } else if (page === 'favorites') {
    if (token) {
      console.log('Token found. Rendering favorites page.');
      requireAuth(page, () => {
        renderFavorites();
        setupLogout(page);
      });
    } else {
      console.warn('User not logged in. Redirecting to login page.');
      renderPage('login');
    }
  } else if (page === 'login') {
    setupLogin();
    setupLogout(page);
  } else if (page === 'register') {
    setupRegister();
    setupLogout(page);
  }
}

//the function that executes everything related to acquisition, general handling and rendering of data
function renderSearchResults() {
  const searchForm = document.querySelector('.js-form');
  const searchResultDivObj = document.querySelector('.js-search-results');
  const projectContainer = document.querySelector('.js-container');

  const savedSearchResults = sessionStorage.getItem('searchResults'); 
  
  //so search results remain in the user's session
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

    callAPI(userSearchQuery, searchResultDivObj, projectContainer);
    console.log('Rendering search results...');
  });
}

async function callAPI(userSearchQuery, searchResultDivObj, projectContainer) {
  const baseURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_Key}&query=${userSearchQuery}&addRecipeNutrition=true&addRecipeInstructions=true&instructionsRequired=true&fillIngredients=true&number=12`; //&offset=0&sort=popularity&sortDirection=desc`
  const response = await fetch(baseURL);
  const fetchedData = await response.json();

  sessionStorage.setItem('searchResults', JSON.stringify(fetchedData.results));
  sessionStorage.setItem('userSearchQuery', userSearchQuery);

  const preProcessedSearchResults = fetchedData.results.map(result => ({
    ...result,
    title: capitalizeEveryWord(result.title)
  }));

  const recipeDataArray = generateSearchResults(preProcessedSearchResults, searchResultDivObj, projectContainer);
  manageFavorites(recipeDataArray);
  setupPopupContent(recipeDataArray);
}


function generateSearchResults(searchResults, searchResultDivObj, projectContainer) {
  projectContainer.classList.remove('initial');

  const recipeDataArray = searchResults.map(result => {
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
    };
  });

  const generatedResultsHTML = recipeDataArray.map(data => data.html).join('');
  searchResultDivObj.innerHTML = generatedResultsHTML;

  return recipeDataArray;
}
