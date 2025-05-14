import {} from 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js'; //icons
import { setupPopupContent } from './popup.js';
import { capitalizeEveryWord } from './utils/capitlizeEveryWord.js';
import { manageFavorites, renderFavorites, favoriteRecipes } from './favorites.js';
import { requireAuth } from './utils/authentication.js';
import { templates } from './templatesHTML.js';
import { setupRegister, setupLogin, setupLogout } from './userSession.js';
import { showCustomAlert } from './utils/customAlert.js';


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

function refreshSearchPage() {
  const brandName = document.querySelector('.js-brand-name');
  if (!brandName) return;

  brandName.addEventListener('click', () => {
    const searchResultDivObj = document.querySelector('.js-search-results');
    const container = document.querySelector('.js-container');

    sessionStorage.removeItem('searchResults');
    if (searchResultDivObj) searchResultDivObj.innerHTML = '';
    if (container) container.classList.add('initial');
  });
}

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
    
    refreshSearchPage();
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
    const preProcessedSearchResults = JSON.parse(savedSearchResults);

    const recipeDataArray = generateSearchResults(preProcessedSearchResults, searchResultDivObj, projectContainer);
    manageFavorites(recipeDataArray);
    setupPopupContent(recipeDataArray);
  }
  //execute the API call at event
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    userSearchQuery = event.target.querySelector('input').value;

    sessionStorage.removeItem('searchResults');

    callAPI(userSearchQuery, searchResultDivObj, projectContainer);
    console.log('Rendering search results...');
  });
}

//handles API call & response, then pushes preprocessed data to software features
async function callAPI(userSearchQuery, searchResultDivObj, projectContainer) {
  const baseURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_Key}&query=${userSearchQuery}&addRecipeNutrition=true&addRecipeInstructions=true&instructionsRequired=true&fillIngredients=true&number=8`; //&offset=0&sort=popularity&sortDirection=desc`

  let fetchedData;

  try { 
  const response = await fetch(baseURL);

    if(response.ok) {
      fetchedData = await response.json();
    } else {
      console.warn('API response not OK. Falling back to default recipes.');
      
    }

    if (!fetchedData || !fetchedData.results || fetchedData.results.length === 0) {
      showCustomAlert('No results found, try again!');
      return;
    }

  } catch (error) {
    console.error('Error during API call:', error);
    showCustomAlert('Check your internet connection and try again!');
    }
  

  const preProcessedSearchResults = fetchedData.results.map(result => ({
    ...result,
    title: capitalizeEveryWord(result.title)
  }));

  console.log(preProcessedSearchResults);

  sessionStorage.setItem('searchResults', JSON.stringify(preProcessedSearchResults));

  const recipeDataArray = generateSearchResults(preProcessedSearchResults, searchResultDivObj, projectContainer);
  manageFavorites(recipeDataArray);
  setupPopupContent(recipeDataArray);
}

//renders generated recipe data and provides them for software features
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
      nutrition: Array.isArray(result.nutrition)
      ? result.nutrition.map(item => {
        const [name, rest] = item.split(':');
        return {
        name: name?.trim() || 'N/A',
        amount: rest?.trim() || 'N/A'
        };
      })
      : (result.nutrition?.nutrients || []).map(item => ({
      name: item.name,
      amount: `${item.amount}${item.unit}`
      })),
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

  console.log(recipeDataArray);

  searchResultDivObj.innerHTML = recipeDataArray.map(data => data.html).join('');

  return recipeDataArray;
}
