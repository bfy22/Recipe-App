//for the titles of the fetched recipes
export function capitalizeEveryWord(string) {
  const excludeCases = ["and", "with"];
  
  const targetedWords = string
    .toLowerCase()
    .replace(/[^a-z\s-]/gi, '') // Remove all non-English letters, except spaces and hyphens
    .split('-')
    .join(' ')
    .split(' ');

  let modifiedString = targetedWords.map((word) => {
    if (excludeCases.includes(word)) {
      return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return modifiedString.join(' ');
}