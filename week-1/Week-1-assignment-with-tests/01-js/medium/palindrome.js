/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npm run test-palindrome`
*/

function isPalindrome(str) {

  // Converting string to the same case
  str = str.toLowerCase()

  // Removing spaces
  str = str.replace(/[^\w]/g, '');

  // Getting the midpoint Index of String
  // If the length is odd -> this index will refer to the middle character
  // If the length is even -> this index will refer to the first character in the second half of the string
  // In both cases, you can traverse the first half of the string using the midpoint index as constraint
  const palMidIdx = Math.floor( str.length / 2 )
  
  // Assuming the string is palindrome
  var res = true

  // Confirming our assumption is true or not
  for (var i=0; i<palMidIdx; ++i) {
    // Indices
    firstHalfIdx = i;
    secondHalfIdx = (str.length - 1) -i;

    // Comparing char of first and second halves
    // If not same, our assumption is wrong
    if ( str[firstHalfIdx] !== str[secondHalfIdx] ) {
      res = false;
      break;
    }
  }

  return res
}

module.exports = isPalindrome;
