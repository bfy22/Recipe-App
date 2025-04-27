export function capitalizeEveryWord(string) {
  const excludeCases = ["and", "with"];
  const targetedWords = string.split(' ');
  let modifiedString = [];
  let modifiedWord = '';

   targetedWords.forEach((word) => {
    if(excludeCases.includes(word.toLowerCase())) {
      modifiedString.push(word.toLowerCase());
    } else {
      modifiedWord = word.charAt(0).toUpperCase() + word.slice(1);
      modifiedString.push(modifiedWord); 
    }
  });
  const completeString = modifiedString.join(' ');
  return completeString;
}