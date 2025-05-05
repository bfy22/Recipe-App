

let favoriteRecipes = [];

 
function renderFavorites() {
  
}

export function manageFavorites(recipeDataArray) {
  document.body.addEventListener('click', event => {
    const favoriteButton = event.target.closest('.js-favorite-button')
    if(!favoriteButton) return;
    
    const recipeID = event.target.getAttribute('data-item-id'); 
    const recipe = recipeDataArray.find(recipe => recipe.id == recipeID); 
    if (!recipe) return; 

    
    const favIndex = favoriteRecipes.findIndex(favRecipe => favRecipe.id == recipeID);

    if (favIndex !== -1) {
      favoriteRecipes.splice(favIndex, 1);
    } else {
      favoriteRecipes.push(recipe);
    }
    console.log(favoriteRecipes); 
  });

}
