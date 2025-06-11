export function generateRecipeHTML(recipe, isFavorite = false) {
  const heartIconName = isFavorite ? 'heart' : 'heart-outline';

  return `
    <div class="item">
      <img src="${recipe.image || 'fallback.jpg'}" alt="${recipe.title}"/>
      <button class="favorite-button js-favorite-button">
        <ion-icon name="${heartIconName}" data-item-id="${recipe.id}"></ion-icon>
      </button>
      <div>
        <div class="flex-result-info">
          <h1 class="title">
            <a class="title-Url" href="${recipe.sourceUrl || '#'}" target="_blank" rel="noopener noreferrer">${recipe.title}</a>
          </h1>
          <button class="recipe-button js-ingredients-button" data-popup-target="#popup" data-item-id="${recipe.id}">Recipe</button> 
        </div>
        <div class="flex-result-info flex-result-bottom">
          <button class="nutrition-button js-nutrition-button" data-popup-target="#popup" data-item-id="${recipe.id}">Nutrition</button>
          <button class="steps-button js-instructions-button" data-popup-target="#popup" data-item-id="${recipe.id}">Steps</button> 
        </div>
      </div>
    </div>
  `;
}