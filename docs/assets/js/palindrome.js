
/** Palindrome tester -
*   detects if a word is the exact same word spelled backward
*/
function palindrome(word){
  /** avoid unnecessary variables(e.g. reverse), they cost memory! */
  /** Make sure to lowercase, you could upgrade to handle spaces and punctuations (mmm... regex) */
  var len = word.length;
  word = word.toLowerCase();
  /** for loop iterates through half of the string comparing the reflection and returning false upon fail.
  *   node palindrome.js(20k)  0.22s user 0.05s system 91% cpu 0.298 total
  *   node palindrome.js(100k) 0.96s user 0.19s system 97% cpu 1.192 total
  *   while loop: var i = 0; while (i < len/2) { i++;
  *   node palindrome.js(20k)  0.21s user 0.05s system 98% cpu 0.269 total
  *   node palindrome.js(100k) 0.93s user 0.18s system 99% cpu 1.119 total)
  */
  for (var i = 0; i < len/2; i++) {
    console.log(word[i]);
    if (word[i] != word[len-1-i]) {
      console.log("Nope, that ain't no palindrome.");
      return false;
    }
  }
  console.log("Yup, that's a palindrome.");
  return true;
}
palindrome("RemitRomecargotogotoGraceMortimer");
