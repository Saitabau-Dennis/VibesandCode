// Task 2: Power of Two Checker
function isPowerOfTwo(num) {
  if (num <= 0) return false;
  return (num & (num - 1)) === 0;
}

// Test the function
console.log("2. Power of Two tests:");
console.log(`8 is power of two: ${isPowerOfTwo(8)}`);
console.log(`6 is power of two: ${isPowerOfTwo(6)}`);
