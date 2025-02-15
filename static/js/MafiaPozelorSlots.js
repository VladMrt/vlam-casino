// Global Variables
var DIRECTION = {
	IDLE: 0,
	UP: 1,
	DOWN: 2,
	LEFT: 3,
	RIGHT: 4
};

var rounds = [5, 5, 3, 3, 2];
var colors = ['#410c6c'];
var round = 0;
var roundsWonPlayer = 0;
var roundsWonPaddle = 0;

// The ball object (The cube that bounces back and forth)
var Ball = {
	new: function (incrementedSpeed) {
		return {
			width: 50,
			height: 50,
			x: (this.canvas.width / 2),
			y: (this.canvas.height / 2),
			moveX: DIRECTION.IDLE,
			moveY: DIRECTION.IDLE,
			speed: 3,
		};
	}
};

// The paddle object (The two lines that move up and down)
var Paddle = {
	new: function (side) {
		return {
			width: 60,
			height: 20,
			y: side === 'down' ? this.canvas.height - 100 : 100,
			x: (this.canvas.width / 2) - 25,
			score: 0,
			move: DIRECTION.IDLE,
			speed: 15,
		};
	}
};

var Game = {
	initialize: function () {
		this.canvas = document.querySelector('canvas');
		this.context = this.canvas.getContext('2d');

		this.canvas.width = window.screen.availHeight / 1;
		this.canvas.height = window.screen.availWidth / 2;

		this.player = Paddle.new.call(this, 'down');
		this.paddle = Paddle.new.call(this, 'up');
		this.ball = Ball.new.call(this);

		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.platform);
		if (isMobile) {
			this.canvas.width = window.screen.availHeight / 1;
			this.canvas.height = window.screen.availWidth / 1.5;
			this.player.y = this.canvas.height - 120;
			this.player.width = this.player.width * 2;
			this.player.height = this.player.height * 2;
			this.paddle.width = this.paddle.width * 2;
			this.paddle.height = this.paddle.height * 2;
			this.ball.width = this.ball.width * 2;
			this.ball.height = this.ball.height * 2;
		}
		else{
			document.getElementById("moveUp").style.display="none";
			document.getElementById("moveDown").style.display="none";
			document.getElementById("startButton").style.display="none";
		}

		this.canvas.style.position = 'absolute';
    	this.canvas.style.top = '50%';
    	this.canvas.style.left = '50%';
    	this.canvas.style.transform = 'translate(-50%, -50%)';

		this.paddle.speed = 8;
		this.running = this.over = false;
		this.turn = this.paddle;
		this.timer = this.round = 0;
		this.color = '#410c6c';

		this.ball.ballImage = new Image();
    	this.ball.ballImage.src = 'static/images/mafia.png';

		Pong.menu();
		Pong.listen();
	},

	endGameMenu: function (text) {
		// Change the canvas font size and color
		Pong.context.font = '50px Courier New';
		Pong.context.fillStyle = this.color;

		// Draw the rectangle behind the 'Press any key' text.
		Pong.context.fillRect(
			Pong.canvas.width / 2 - 350,
			Pong.canvas.height / 2 - 48,
			700,
			100
		);

		// Change the canvas color;
		Pong.context.fillStyle = '#ffffff';

		// Draw the end game menu text
		Pong.context.fillText(text,
			Pong.canvas.width / 2,
			Pong.canvas.height / 2 + 15
		);

		setTimeout(function () {
			Pong = Object.assign({}, Game);
			Pong.initialize();
			Pong.round = round;
		}, 3000);
		if(roundsWonPaddle === 3 || roundsWonPlayer === 3)
			this.reset();
	},

	reset: function(){
		round = 0;
		roundsWonPaddle = 0;
		roundsWonPlayer = 0;
	},

	menu: function () {
		// Draw all the Pong objects in their current state
		Pong.draw();

		// Change the canvas font size and color
		this.context.font = '50px Courier New';
		this.context.fillStyle = this.color;

		// Draw the rectangle behind the 'Press any key' text.
		this.context.fillRect(
			this.canvas.width / 2 - 350,
			this.canvas.height / 2 - 48,
			700,
			100
		);

		// Change the canvas color;
		this.context.fillStyle = '#ffffff';

		// Draw the 'press any key' text
		this.context.fillText('Press any key',
			this.canvas.width / 2,
			this.canvas.height / 2,
			this.canvas.width / 1.5
		);
	},

	// Update all objects (move the player, paddle, ball, increment the score, etc.)
	update: function () {
		if (!this.over) {

			// If the ball collides with the bound limits - correct the x and y coords.
			if (this.ball.y <= 0) Pong._resetTurn.call(this, this.paddle, this.player);
			if (this.ball.y >= this.canvas.height + this.ball.height) Pong._resetTurn.call(this, this.player, this.paddle);
			if (this.ball.x <= 0) this.ball.moveX = DIRECTION.RIGHT;
			if (this.ball.x >= this.canvas.width) this.ball.moveX = DIRECTION.LEFT;

			// Move player if they player.move value was updated by a keyboard event
			if (this.player.move === DIRECTION.UP) this.player.x -= this.player.speed;
			else if (this.player.move === DIRECTION.DOWN) this.player.x += this.player.speed;

			// On new serve (start of each turn) move the ball to the correct side
			// and randomize the direction to add some challenge.
			if (Pong._turnDelayIsOver.call(this) && this.turn) {
				this.ball.moveX = this.turn === this.player ? DIRECTION.LEFT : DIRECTION.RIGHT;
				this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
				this.ball.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
				this.ball.y = this.canvas.height / 2;
				this.turn = null;
			}

			// If the player collides with the bound limits, update the x and y coords.
			if (this.player.x <= 0) this.player.x = 0;
			else if (this.player.x >= (this.canvas.width - this.player.width / 1.2)) this.player.x = this.canvas.width - this.player.width / 1.2;

			// Handle paddle (AI) wall collision
			if (this.paddle.x >= this.canvas.width - this.paddle.width / 1.2) this.paddle.x = this.canvas.width - this.paddle.width / 1.2;
			else if (this.paddle.x <= 0) this.paddle.x = 0;

			// Move ball in intended direction based on moveY and moveX values
			if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
			else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
			if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
			else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;

			// Handle paddle (AI) UP and DOWN movement
			// if (this.paddle.x > this.ball.x - (this.paddle.width / 2)) {
			// 	if (this.ball.moveY === DIRECTION.UP) this.paddle.x -= this.paddle.speed / 1.5;
			// 	else this.paddle.x -= this.paddle.speed / 4;
			// }
			if(this.paddle.x + (this.paddle.width / 2) > this.ball.x + (this.ball.width / 2))
				if(this.ball.moveY === DIRECTION.UP)
					this.paddle.x -= this.paddle.speed / 1.5;
				else this.paddle.x -= this.paddle.speed / 4;
			else if(!(this.paddle.x - this.paddle.width === this.ball.x))
				if(this.ball.moveY === DIRECTION.UP)
					this.paddle.x += this.paddle.speed / 1.5;
				else this.paddle.x += this.paddle.speed / 4;

			// Handle Player-Ball collisions
			if (this.ball.x + (this.ball.width / 2) <= this.player.x + (this.player.width * 1.2) && this.ball.x + (this.ball.width / 2) >= this.player.x) {
				if (this.ball.y <= this.player.y + (this.player.height * 1.1) && this.ball.y >= (this.player.y * 0.95)) {
					// this.ball.x = (this.player.x + this.ball.width);
					this.ball.moveY = DIRECTION.UP;
					this.ball.speed = 0.2 + this.ball.speed;
				}
			}

			// Handle paddle-ball collision
			if (this.ball.x + (this.ball.width / 2) <= this.paddle.x + (this.paddle.width * 1.2) && this.ball.x + (this.ball.width / 2) >= (this.paddle.x * 0.8)) {
				if (this.ball.y >= (this.paddle.y * 0.9) && this.ball.y <= this.paddle.y + (this.paddle.height * 1.1)) {
					// this.ball.x = (this.paddle.x - this.ball.width);
					this.ball.moveY = DIRECTION.DOWN;
					this.ball.speed = 0.2 + this.ball.speed;
				}
			}
		}

		// Handle the end of round transition
		// Check to see if the player won the round.
		if (this.player.score === rounds[round]) {
			// Check to see if there are any more rounds/levels left and display the victory screen if
			// there are not.
			roundsWonPlayer++;
			if (!rounds[round + 1]) {
				this.over = true;
				setTimeout(function () { Pong.endGameMenu('Next Round'); }, 1000);
			} else {
				// If there is another round, reset all the values and increment the round number.
				this.player.score = this.paddle.score = 0;
				this.player.speed += 0.5;
				this.paddle.speed += 1;
				this.ball.speed += 0.4;
				round += 1;
			}
		}
		// Check to see if the paddle/AI has won the round.
		else if (this.paddle.score === rounds[this.round]) {
			roundsWonPaddle++;
			this.over = true;
			setTimeout(function () { Pong.endGameMenu('Next Round'); }, 1000);
		}
		if(roundsWonPlayer === 3){
			this.over = true;
			setTimeout(function () { Pong.endGameMenu('Winner!'); }, 1000);
		}
		else if(roundsWonPaddle === 3){
			this.over = true;
			setTimeout(function () { Pong.endGameMenu('Game Over!'); }, 1000);
		}
		
		if(this.player.score === rounds[this.round] || this.paddle.score === rounds[this.round])
			round++;
	},

	// Draw the objects to the canvas element
	draw: function () {
		
		// Clear the Canvas
		this.context.clearRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);

		// Set the fill style to black
		this.context.fillStyle = this.color;

		// Draw the background
		this.context.fillRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);

		// Set the fill style to white (For the paddles and the ball)
		this.context.fillStyle = '#ffffff';

		
		this.context.drawImage(this.ball.ballImage, this.ball.x - 25, this.ball.y - 25, this.ball.width, this.ball.height);

		// Draw the net (horizontal center line)
		this.context.beginPath();
		this.context.setLineDash([7, 15]);
		this.context.moveTo(0, this.canvas.height / 2);
		this.context.lineTo(this.canvas.width, this.canvas.height / 2);
		this.context.lineWidth = 10;
		this.context.strokeStyle = '#ffffff';
		this.context.stroke();

		// Set the default canvas font and align it to the center
		this.context.font = '50px Courier New';
		this.context.textAlign = 'center';

		// Draw the players score (up)
		this.context.fillText(
			this.player.score.toString(),
			(this.canvas.width - 30),
			(this.canvas.height / 2 - 20)
		);

		// // Draw the paddles score (down)
		this.context.fillText(
			this.paddle.score.toString(),
			(this.canvas.width - 30),
			(this.canvas.height / 2 + 50)
		);

		// this.context.fillText(
		// 	roundsWonPlayer.toString(),
		// 	(this.canvas.width / 2) - 300,
		// 	this.canvas.height - 50
		// );

		// this.context.fillText(
		// 	"- Overall score -",
		// 	(this.canvas.width / 2),
		// 	this.canvas.height - 50,
		// 	500
		// );

		// this.context.fillText(
		// 	roundsWonPaddle.toString(),
		// 	(this.canvas.width / 2) + 300,
		// 	this.canvas.height - 50
		// );

		// Change the font size for the center score text
		this.context.font = '30px Courier New';

		// Draw the winning score (center)
		this.context.fillText(
			'Round ' + (round + 1),
			(this.canvas.width / 2),
			(this.canvas.height / 3 - 50)
		);

		// Change the font size for the center score value
		this.context.font = '40px Courier';

		// Draw the current round number
		this.context.fillText(
			"First to " + (rounds[Pong.round] ? rounds[Pong.round] : rounds[Pong.round - 1]),
			(this.canvas.width / 2),
			(this.canvas.height / 3)
		);

		// Draw the Player
		this.context.fillRect(
			this.player.x,
			this.player.y,
			(this.player.width / 1.2),
			(this.player.height / 2)
		);

		// Draw the Paddle
		this.context.fillRect(
			this.paddle.x,
			this.paddle.y,
			(this.paddle.width / 1.2),
			(this.paddle.height / 2)
		);

		// Draw the Ball
		if (Pong._turnDelayIsOver.call(this)) {
			this.context.fillRect(
				this.ball.ballImage,
				this.ball.x,
				this.ball.y,
				this.ball.width,
				this.ball.height
			);
		}
	},

	loop: function () {
		let mySound = new Audio('static/audio/MafiaPozelor.wav')
		mySound.play()
		Pong.update();
		Pong.draw();

		// If the game is not over, draw the next frame.
		if (!Pong.over) requestAnimationFrame(Pong.loop);
	},

	listen: function () {
		document.addEventListener('keydown', function (key) {
			// Handle the 'Press any key to begin' function and start the game.
			if (Pong.running === false) {
				Pong.running = true;
				window.requestAnimationFrame(Pong.loop);
			}
				
			// Handle up arrow and w key events
			if (key.keyCode === 37 || key.keyCode === 65)
				Pong.player.move = DIRECTION.UP;

			// Handle down arrow and s key events
			if (key.keyCode === 39 || key.keyCode === 68) 
				Pong.player.move = DIRECTION.DOWN;
		});

		// Stop the player from moving when there are no keys being pressed.
		document.addEventListener('keyup', function (key) { Pong.player.move = DIRECTION.IDLE; });

		// Start button
		const startButton = document.getElementById('startButton');
		if (startButton) {
			startButton.addEventListener('click', function () {
				if (Pong.running === false) {
					Pong.running = true;
					window.requestAnimationFrame(Pong.loop);
				}
			});
		}
	
		// Move Up button
		const moveUpButton = document.getElementById('moveUp');
		if (moveUpButton) {
			moveUpButton.addEventListener('mousedown', function () {
				Pong.player.move = DIRECTION.UP;
			});
			moveUpButton.addEventListener('mouseup', function () {
				Pong.player.move = DIRECTION.IDLE;
			});
		}
	
		// Move Down button
		const moveDownButton = document.getElementById('moveDown');
		if (moveDownButton) {
			moveDownButton.addEventListener('mousedown', function () {
				Pong.player.move = DIRECTION.DOWN;
			});
			moveDownButton.addEventListener('mouseup', function () {
				Pong.player.move = DIRECTION.IDLE;
			});
		}

	},

	// Reset the ball location, the player turns and set a delay before the next round begins.
	_resetTurn: function(victor, loser) {
		this.ball = Ball.new.call(this, this.ball.speed);
		this.turn = loser;
		this.timer = (new Date()).getTime();
		this.ball.speed = 3;
		this.ball.ballImage = new Image();
    	this.ball.ballImage.src = 'static/images/mafia.png';
		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.platform);
		if (isMobile){
			this.ball.width = this.ball.width * 2;
			this.ball.height = this.ball.height * 2;
		}

		victor.score++;
	},

	// Wait for a delay to have passed after each turn.
	_turnDelayIsOver: function() {
		return ((new Date()).getTime() - this.timer >= 1000);
	},

};

var Pong = Object.assign({}, Game);
Pong.initialize();