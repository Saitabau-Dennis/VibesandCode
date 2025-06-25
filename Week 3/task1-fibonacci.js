// Task 1: Fibonacci Sequence Generator
function generateFibonacci() {
  const sequence = [];
  let a = 0,
    b = 1;

  while (a <= 100) {
    sequence.push(a);
    [a, b] = [b, a + b];
  }

  return sequence;
}

// Test the function
console.log("1. Fibonacci sequence up to 100:");
console.log(generateFibonacci());
