const searchForm = document.querySelector('.js-form');
const searchResultDivObj = document.querySelector('.js-search-results');
const projectContainer  = document.querySelector('.js-container');
const API_Key = 'd356faf76ff245fc87c936fbaa616aeb';

let userSearchQuery = '';


searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  userSearchQuery = event.target.querySelector('input').value;
  callAPI();
});


async function callAPI() {
  const baseURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_Key}&query=${userSearchQuery}&addRecipeNutrition=true&number=15`
  const response = await fetch(baseURL);
  const fetchedData = await response.json(); /*json to obj method for fetches*/
  console.log(fetchedData);
  renderSearchResults(fetchedData.results); //param is parsed searchresults array data

}

function renderSearchResults(searchResults) { //HTML generate with data from array
  projectContainer.classList.remove('initial');
  
  let generatedResultsHTML = ''
  searchResults.map(result => {
    generatedResultsHTML += `
          <div class="item">
            <img src="${result.image}" alt=""> 
            <div class="flex-result-info">
              <h1 class="title"><a class="titleUrl" href="${result.sourceUrl}">${result.title}</a></h1>
              <a class="recipe-button" href="#">Recipe</a>
            </div>
            <p class="nutrition-data">Calories: 300 </p>
          </div>
        `
    searchResultDivObj.innerHTML = generatedResultsHTML; //note: write a function to capitalize each word of the title

    
  }) 
  
}

