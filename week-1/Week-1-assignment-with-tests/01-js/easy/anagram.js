/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

function isAnagram(str1, str2) {

  // Converting string to the same casing
  str1 = str1.toLowerCase()
  str2 = str2.toLowerCase()

  // Splitting the string to array of characters
  var str1Chars = str1.split('');
  var str2Chars = str2.split('');

  // Popping out each character in str1 and comparing it with str2 characters
  // If character exists, then pop that character from str2 character array, keep repeating it
  // If not, break out of the loop
  const numStr1Chars = str1Chars.length
  for (var _=0; _<numStr1Chars; ++_) {
    // Popping from str1 char array
    var char2Cmpr = str1Chars.pop()
    // Popping from str2 char array (or atleast trying to)
    str2CmprIdx = str2Chars.indexOf(char2Cmpr)
    if (str2CmprIdx == -1) {
      // If no such character found in str2 char array, breaking out from the loop
      break;
    } else {
      str2Chars.splice(str2CmprIdx, 1)
    }

    tmp = 0
  }

  // If its an anagram, all characters in both arrays will be popped out
  if (str1Chars.length > 0 || str2Chars.length > 0) {
    res = false
  } else {
    res = true
  }

  return res
}

module.exports = isAnagram;
