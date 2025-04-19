const searchForm = document.querySelector('.js-form');
const searchResultObj = document.querySelector('.js-search-results');
const projectContainer  = document.querySelector('.js-container');
const API_Key = 'd356faf76ff245fc87c936fbaa616aeb';

let userSearchQuery = '';


searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  userSearchQuery = event.target.querySelector('input').value;
  callAPI();
});


async function callAPI() {
  const baseURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_Key}&query=${userSearchQuery}&addRecipeInformation=true&number=15`
  const response = await fetch(baseURL);
  const fetchedData = await response.json(); /*json to obj method for recipe fetches*/
  console.log(fetchedData);
}

function renderSearchResults() {

}

