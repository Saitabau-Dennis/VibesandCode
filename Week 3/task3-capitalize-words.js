// Task 3: Capitalize Words
function capitalizeWords(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Test the function
let capitalize = "hello i am developer";
console.log("3. Capitalize words:");
console.log(`${capitalize} -> ${capitalizeWords(capitalize)}`);
