

let favoriteRecipes = [];

 

export function manageFavorites(recipeDataArray) {
  document.body.addEventListener('click', event => {
    if(event.target.closest('.js-favorite-button')) {
      const recipeID = event.target.getAttribute('data-item-id');
      
      favoriteRecipes.forEach(favRecipe => {
        if(recipeID == favRecipe.id) {
          favoriteRecipes.splice(favoriteRecipes.indexOf(favRecipe), 1);
        }
      });
      
      recipeDataArray.forEach(recipe => {
        if(recipeID == recipe.id) {
          favoriteRecipes.push(recipe);
          console.log(favoriteRecipes);
        }
      });
      
    }
  })
  console.log(favoriteRecipes);
}
  
