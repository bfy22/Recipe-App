const searchForm = document.querySelector('.js-form');
const searchResultObj = document.querySelector('.js-search-results');
const projectContainer  = document.querySelector('.js-container');
const API_Key = 'd356faf76ff245fc87c936fbaa616aeb';
const baseURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_Key}`

let userSearchQuery = '';

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  userSearchQuery = event.target.querySelector('input').value;
  callAPI();
});

async function callAPI() {
  
}