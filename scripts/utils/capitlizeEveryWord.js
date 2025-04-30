export function capitalizeEveryWord(string) {
  const excludeCases = ["and", "with"];
  const targetedWords = (string.toLowerCase()).split(' ');
  let modifiedString = [];
  let modifiedWord = '';

   targetedWords.forEach((word) => {
    if(excludeCases.includes(word)) {
      modifiedString.push(word);
    } else {
      modifiedWord = word.charAt(0).toUpperCase() + word.slice(1);
      modifiedString.push(modifiedWord); 
    }
  });
  return modifiedString.join(' ');
}