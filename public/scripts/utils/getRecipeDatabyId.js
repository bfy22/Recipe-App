//Fetches the latest recipe data from data source
export function getRecipeDataByIdFromStorage(id) {
  const storedData = JSON.parse(sessionStorage.getItem('searchResults') || '[]');
  return getRecipeDataById(id, storedData);
}


export function getRecipeDataByIdFromFavorites(id, favoriteRecipes) {
  const combinedData = [
    ...JSON.parse(sessionStorage.getItem('searchResults') || '[]'),
    ...favoriteRecipes
  ];

  return getRecipeDataById(id, combinedData)
}


// Shared helper: finds recipe in any provided array
function getRecipeDataById(id, dataSource) {
  
  if (!Array.isArray(dataSource)) {
    console.warn('Invalid dataSource provided to getRecipeDataById');
    return null;
  }
  
  return dataSource.find(recipe => recipe.id == id);
}



