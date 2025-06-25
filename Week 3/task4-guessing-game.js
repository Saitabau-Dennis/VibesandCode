// Task 4: Number Guessing Game
class NumberGuessingGame {
  constructor() {
    this.targetNumber = Math.floor(Math.random() * 100) + 1;
    this.guessCount = 0;
    this.previousGuess = null;
  }

  makeGuess(guess) {
    // Check bounds
    if (guess < 1 || guess > 100) {
      return "OUT OF BOUNDS";
    }

    this.guessCount++;

    // Check if correct
    if (guess === this.targetNumber) {
      return `Correct! You guessed it in ${this.guessCount} tries!`;
    }

    const distance = Math.abs(guess - this.targetNumber);

    // First guess
    if (this.guessCount === 1) {
      this.previousGuess = guess;
      return distance <= 10 ? "WARM!" : "COLD!";
    }

    // Subsequent guesses
    const previousDistance = Math.abs(this.previousGuess - this.targetNumber);
    this.previousGuess = guess;

    return distance < previousDistance ? "WARMER!" : "COLDER!";
  }

  reset() {
    this.targetNumber = Math.floor(Math.random() * 100) + 1;
    this.guessCount = 0;
    this.previousGuess = null;
  }
}

// Test the game
console.log("4. Number Guessing Game:");
const game = new NumberGuessingGame();
console.log("Game created, target number set (hidden)");
console.log(`Guess 150: ${game.makeGuess(150)}`);
console.log(`Guess 50: ${game.makeGuess(50)}`);
console.log(`Guess 25: ${game.makeGuess(25)}`);
