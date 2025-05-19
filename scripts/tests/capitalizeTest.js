import { capitalizeEveryWord } from "../utils/capitalizeEveryWord.js";

//unit tests for capitalizing recipe title function

//1-2 test cases
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