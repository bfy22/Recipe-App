import {} from 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js'; //icons
import {setupPopupContent} from './popup.js';
import { capitalizeEveryWord } from './utils/capitlizeEveryWord.js';
import { manageFavorites, renderFavorites } from './favorites.js';
import { checkAuthentication } from './auth.js';




const searchForm = document.querySelector('.js-form');
const searchResultDivObj = document.querySelector('.js-search-results');
const projectContainer  = document.querySelector('.js-container');
const API_Key = 'd356faf76ff245fc87c936fbaa616aeb';

let userSearchQuery = '';

checkAuthentication();
renderSearchResults();
renderFavorites();



function renderSearchResults() {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    userSearchQuery = event.target.querySelector('input').value;
    callAPI();
  });
}


async function callAPI() {
  const baseURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_Key}&query=${userSearchQuery}&addRecipeNutrition=true&addRecipeInstructions=true&instructionsRequired=true&fillIngredients=true&number=8`
  const response = await fetch(baseURL);
  const fetchedData = await response.json(); /*json to obj method for fetches*/
  
  
  const preProcessedSearchResults = fetchedData.results.map(result => ({ ... result,   //clone each object
    title: capitalizeEveryWord(result.title)
  }));

  const recipeDataArray = generateSearchResults(preProcessedSearchResults); //param is parsed query results array data

  manageFavorites(recipeDataArray);
  setupPopupContent(recipeDataArray);
}

function generateSearchResults(searchResults) { //create array of objects with relevant data
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



