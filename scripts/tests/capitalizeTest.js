import { capitalizeEveryWord } from "../utils/capitalizeEveryWord.js";

//unit tests for capitalizing recipe title function

//1-2 test cases
console.log('Test Suite: capitalizeEveryWord');
console.log('Capitalizes the first letter of each word. If passed, then successful')
if (capitalizeEveryWord('bisso') === 'Bisso') {
  console.log('passed');
} else {
  console.log('failed');
}

if (capitalizeEveryWord('grilled cheese and tomato soup') === 'Grilled Cheese and Tomato Soup') {
  console.log('passed');
} else {
  console.log('failed');
}

//edge cases
console.log('Attempts to capitalize the first letter of each word with non-alphabet characters involved in different positions')
if (capitalizeEveryWord('Grilled-cheese and tomato soup') === 'Grilled Cheese and Tomato Soup') {
  console.log('passed');
} else {
  console.log('failed');
}

if (capitalizeEveryWord('grilled-cheese and tomato soup') === 'Grilled Cheese and Tomato Soup') {
  console.log('passed');
} else {
  console.log('failed');
}

if (capitalizeEveryWord('!grilled-cheese and tomato soup') === 'Grilled Cheese and Tomato Soup') {
  console.log('passed');
} else {
  console.log('failed');
}

if (capitalizeEveryWord('grilled-che!ese and tomato soup') === 'Grilled Cheese and Tomato Soup') {
  console.log('passed');
} else {
  console.log('failed');
}

if (capitalizeEveryWord('gril"led-che!ese and tomato soup') === 'Grilled Cheese and Tomato Soup') {
  console.log('passed');
} else {
  console.log('failed');
}

if (capitalizeEveryWord('grill"ed-!cheese and tomato soup') === 'Grilled Cheese and Tomato Soup') {
  console.log('passed');
} else {
  console.log('failed');
}