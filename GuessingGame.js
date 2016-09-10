function generateWinningNumber() {
	return Math.ceil(Math.random() * 100);
}


function shuffle(arr) {
	for(var i = arr.length-1; i > 0; i--) {
       var randomIndex = Math.floor(Math.random() * (i + 1));
       var temp = arr[i];
       arr[i] = arr[randomIndex];
       arr[randomIndex] = temp;
    }
    return arr;
}


function Game() {
	this.playersGuess = null;
	this.winningNumber = generateWinningNumber();
	this.pastGuesses = [];
}


Game.prototype.difference = function() {
	return Math.abs(this.playersGuess - this.winningNumber);
}


Game.prototype.isLower = function() {
	return (this.playersGuess < this.winningNumber);
}


Game.prototype.playersGuessSubmission = function(guess) {

	if(typeof guess !== 'number' || guess < 1 || guess > 100) {
        throw "That is an invalid guess.";
    }

	this.playersGuess = guess;
	return this.checkGuess();
}


Game.prototype.checkGuess = function() {

	if (this.playersGuess === this.winningNumber) {
		$('#hint', '#submit').prop('disabled', true);
		$('#subtitle').text('Press the Reset button to play again!');
		return "You Win!";

	} else {

		if (this.pastGuesses.includes(this.playersGuess) === true) {
			return "You have already guessed that number.";

		} else {

			this.pastGuesses.push(this.playersGuess); // update box with player's guess
			$('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);

			if (this.pastGuesses.length === 5) {
				$('#hint', '#submit').prop('disabled', true);
				$('#subtitle').text('Press the Reset button to play again!');
				return "You Lose.";

			} else {

				var diff = this.difference();

				if(this.isLower()) {
					$('#subtitle').text('Guess Higher!');
				} else {
					$('#subtitle').text('Guess Lower!');
				}

				if (diff < 10) return "You're burning up!";
				if (diff < 25) return "You're lukewarm.";
				if (diff < 50) return "You're a bit chilly.";
				else return "You're ice cold!";
			}
		}
	}

}


Game.prototype.provideHint = function() {
	var hint = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
	return shuffle(hint);
}


function newGame() {
	return new Game();
}


function makeAGuess(game) {
	var guess = $('#player-input').val();
	$('#player-input').val(""); // clear #player-input
	var output = game.playersGuessSubmission(parseInt(guess,10)); // evaluates if guess is valid, converts guess to int if necessary
    $('#title').text(output);
}



// JQUERY CODE

$(document).ready(function() {

	var game = new Game();

	$('#submit').on('click', function() {
		makeAGuess(game);
	});

	// does the same thing as the event handler above, but when the enter key is pressed
	$('#player-input').keypress(function(event) {
        if (event.which == 13) {  // enter key
           makeAGuess(game);
        }
    });

    $('#hint').click(function() {
        var hints = game.provideHint(); // array of three values, one which is the winning number
        $('#title').text('The winning number is ' + hints[0] + ', ' + hints[1] + ', or ' + hints[2]);
    });

    $('#reset').click(function() { 
        game = newGame();
        $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100!')
        $('.guess').text('-');
        $('#hint, #submit').prop("disabled",false);

    })
	
});

