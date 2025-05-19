import { capitalizeEveryWord } from "../utils/capitalizeEveryWord.js";

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