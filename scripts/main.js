import {} from 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js'; //search icon
import {handlePopup} from './popup.js';


const searchForm = document.querySelector('.js-form');
const searchResultDivObj = document.querySelector('.js-search-results');
const projectContainer  = document.querySelector('.js-container');
const API_Key = 'd356faf76ff245fc87c936fbaa616aeb';

let userSearchQuery = '';

renderSearchResults();
handlePopup();


function renderSearchResults() {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    userSearchQuery = event.target.querySelector('input').value;
    callAPI();
  });
}


async function callAPI() {
  const baseURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_Key}&query=${userSearchQuery}&addRecipeNutrition=true&addRecipeInstructions=true&number=24`
  const response = await fetch(baseURL);
  const fetchedData = await response.json(); /*json to obj method for fetches*/
  console.log(fetchedData);
  generateSearchResults(fetchedData.results); //param is parsed query results array data
  
}

function generateSearchResults(searchResults) { //create array of objects with relevant data
  projectContainer.classList.remove('initial');

  const recipeDataArray = searchResults.map(result => { //like forEach but generates an array object 

    return {
      id: result.id,     
      ingredients: result.analyzedInstructions?.[0]?.steps?.[0]?.ingredients?.map(ingredient => ingredient.name) || [],
      instructions: result.analyzedInstructions?.[0]?.steps?.map(step => step.step) || [],
      nutritionInfo: result.nutrition.nutrients,
      cookingTimeMins: result.readyInMinutes,
      dairyFree: result.dairyFree,
      glutenFree: result.glutenFree,
      vegan: result.vegan,
      vegetarian: result.vegetarian,
      html: `
        <div class="item">
          <img src="${result.image}" alt=""> 
          <div class="flex-result-info">
            <h1 class="title"><a class="title-Url" href="${result.sourceUrl}">${result.title}</a></h1>
            <button class="recipe-button js-recipe-button" data-popup-target="#popup" data-item-id=${result.id}>Recipe</button> 
          </div>
          <p class="nutrition-data">Nutrition: 300 </p>
        </div>
      `
    }       
  });
  console.log(recipeDataArray);
  const generatedResultsHTML = recipeDataArray.map(data => data.html)
  searchResultDivObj.innerHTML = generatedResultsHTML; //note: write a function to capitalize each word of the title  
  
  return recipeDataArray;
}



