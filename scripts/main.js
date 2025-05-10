import {} from 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js'; //icons
import {setupPopupContent} from './popup.js';
import { capitalizeEveryWord } from './utils/capitlizeEveryWord.js';
import { manageFavorites, renderFavorites } from './favorites.js';
import { checkAuthentication } from './auth.js';
import { templates } from './templates.js';





const API_Key = 'd356faf76ff245fc87c936fbaa616aeb';

let userSearchQuery = '';


document.body.addEventListener('click', (event) => {
  const page = event.target.getAttribute('data-page');
  if (page) {
    renderPage(page);
  }
});

checkAuthentication();
renderPage('home');


function renderPage(page) {
  const app = document.getElementById('app');
  app.innerHTML = templates[page];

  // Call specific functions for each page
  if (page === 'home') {
    renderSearchResults();
  } else if (page === 'favorites') {
    renderFavorites();
  } else if (page === 'login') {
    setupLogin();
  } else if (page === 'register') {
    setupRegister();
  }
}

function setupLogin() {
  document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      renderPage('home'); // Redirect to home page
    } else {
      alert('Invalid username or password');
    }
  });
}


function setupRegister() {
  document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:4000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert('Registration successful! You can now log in.');
      renderPage('login'); // Redirect to login page
    } else {
      const errorMessage = await response.text();
      alert(`Registration failed: ${errorMessage}`);
    }
  });
}




function renderSearchResults() {
  const searchForm = document.querySelector('.js-form');
  const searchResultDivObj = document.querySelector('.js-search-results'); 
  const projectContainer = document.querySelector('.js-container');

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    userSearchQuery = event.target.querySelector('input').value;
    callAPI(userSearchQuery, searchResultDivObj, projectContainer);
    console.log('Rendering search results...');
  });
}


async function callAPI(userSearchQuery, searchResultDivObj, projectContainer) {
  const baseURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_Key}&query=${userSearchQuery}&addRecipeNutrition=true&addRecipeInstructions=true&instructionsRequired=true&fillIngredients=true&number=8`
  const response = await fetch(baseURL);
  const fetchedData = await response.json(); /*json to obj method for fetches*/
  
  
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
          <button class="favorite-button js-favorite-button"><ion-icon name="heart-outline" data-item-id=${result.id}></ion-icon></button>
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



