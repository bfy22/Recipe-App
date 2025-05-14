import {} from 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js'; //icons
import { setupPopupContent } from './popup.js';
import { capitalizeEveryWord } from './utils/capitlizeEveryWord.js';
import { manageFavorites, renderFavorites, favoriteRecipes } from './favorites.js';
import { requireAuth } from './utils/authentication.js';
import { templates } from './templatesHTML.js';
import { setupRegister, setupLogin, setupLogout } from './userSession.js';
import { showCustomAlert } from './utils/customAlert.js';
import { generateRecipeHTML } from './utils/renderHelper.js';

const API_Key = 'e3ff50cdf8454076a220a283f064998b';
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
    setupPopupContent();
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
  const baseURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_Key}&query=${userSearchQuery}&addRecipeNutrition=true&addRecipeInstructions=true&instructionsRequired=true&fillIngredients=true&number=8&sort=popularity&sortDirection=desc`

  let fetchedData;

  try { 
  const response = await fetch(baseURL);

    if(response.ok) {
      fetchedData = await response.json();
    } else {
      console.warn('API response not OK.');
      
    }

    if (!fetchedData || !fetchedData.results || fetchedData.results.length === 0) {
      showCustomAlert('No results found, try again!');
      return;
    }

  } catch (error) {
    console.error('Error during API call:', error);
    showCustomAlert('Check your internet connection and try again!');
    }
  

  const rawResults = fetchedData.results.map(result => ({
  ...result,
  title: capitalizeEveryWord(result.title),
  nutrition: result.nutrition ?? { nutrients: [] },
  analyzedInstructions: result.analyzedInstructions ?? [],
  extendedIngredients: result.extendedIngredients ?? []
}));

const recipeDataArray = generateSearchResults(rawResults, searchResultDivObj, projectContainer);

// Save structured data (used by popups)
sessionStorage.setItem('searchResults', JSON.stringify(recipeDataArray));

manageFavorites(recipeDataArray);
}

//renders generated recipe data and provides them for software features
function generateSearchResults(searchResults, searchResultDivObj, projectContainer) {
  projectContainer.classList.remove('initial');

  const recipeDataArray = searchResults.map(result => {
    if (!result || !result.id || !result.title) {
      console.warn('Skipping invalid recipe:', result);
      return null;
    }

    const isFavorite = favoriteRecipes.some(favRecipe => favRecipe.id === result.id);
    

    return {
      title: result.title || 'Untitled Recipe',
      id: result.id,
      ingredients: Array.isArray(result.extendedIngredients)
        ? result.extendedIngredients.map(ing => ing.original)
        : [],
      instructions: Array.isArray(result.analyzedInstructions?.[0]?.steps)
        ? result.analyzedInstructions[0].steps.map(step => step.step)
        : [],
      nutrition: Array.isArray(result.nutrition?.nutrients)
        ? result.nutrition.nutrients.map(n => ({
            name: n.name || 'N/A',
            amount: `${n.amount || 0}${n.unit || ''}`
          }))
        : [],
      cookingTimeMins: result.readyInMinutes || 'N/A',
      dairyFree: result.dairyFree || false,
      image: result.image || '', 
      glutenFree: result.glutenFree || false,
      vegan: result.vegan || false,
      vegetarian: result.vegetarian || false,
      html: generateRecipeHTML(result, isFavorite),
    };
  }).filter(recipe => recipe !== null);

  console.log(recipeDataArray);
  searchResultDivObj.innerHTML = recipeDataArray.map(data => data.html).join('');
  return recipeDataArray;
}


