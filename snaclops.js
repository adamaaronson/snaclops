//=================//
//   snaclops.js   //
// Copyright ©2018 //
//  Adam Aaronson  //
//=================//

// frame count
var frames = 0;

// direction constants
const LEFT = 0;
const UP = 1;
const RIGHT = 2;
const DOWN = 3;
const ALONE = 4;

// square size
var square;
var gap;
var rows = 16;
var cols = rows;

// the snake
var head;
var tail = [];
var dir = RIGHT;
var nextDir = RIGHT;
var moves = [];

var score = 0;
var highScore = 0;
var basket = 0;

// conditions
var started = false;
var dead = false;

// eye
var eyeDir = 0;
var eyeSpin = 15;

// fruit
var fruit;
var fruitType;

// speed
var speed;

// different snakes
var currentSnake;
var snakeButtons;
var snakeEyes;
var numSnakes = 0;

// stats
var fruitStats = [];
var totalFruits;
var totalFruitPoints;
var gamesPlayed;
var highScoreStats = [];

// sprites
var snakeSpriteReady = false;
var snakeSprite = new Image();
var snakeSpriteFile;

var fruitSpriteReady = false;
var fruitSprite = new Image();
var fruitSpriteFile;

window.onload = function() {
	canv = document.getElementById("snake");
	c = canv.getContext("2d");
	setInterval(update, 1000/30);
	window.addEventListener('keydown', keyDown, false);

	// html elements
	gameMessageText = document.getElementById("game-message");
	gameOverText = document.getElementById("game-over");
	highScoreText = document.getElementById("high-score");
	scoreText = document.getElementById("score");
	basketText = document.getElementById("fruit-basket");
	basketImage = document.getElementById("basket-image");
	headerStuff = document.getElementById("header-stuff");
	boxes = document.getElementById("boxes");
	stats = document.getElementById("stats");
	shop = document.getElementById("shop");
	snakeCell = document.getElementById("snake-cell");
	shopHeaderBox = document.getElementById("shop-header-box");
	shopBody = document.getElementById("shop-body");
	menuHeaderBox = document.getElementById("menu-header-box");
	menuBody = document.getElementById("menu-body");
	snakeList = document.getElementById("snake-list");
	eyeImage = document.getElementById("eye-image");
	snakeCount = document.getElementById("snake-count");
	fruitVarieties = document.getElementById("fruit-varieties");
	totalFruitsStat = document.getElementById("total-fruits");
	totalFruitPointsStat = document.getElementById("total-fruit-points");
	gamesPlayedStat = document.getElementById("games-played");
	highScoreStat = document.getElementsByClassName("high-score-stat");
	
	// change canvas size
	c.canvas.height = Math.min(window.innerHeight - headerStuff.offsetHeight - 45, 480);
	c.canvas.width = c.canvas.height;
	snakeCell.style.height = c.canvas.height;
	stats.style.height = c.canvas.height;
	shop.style.height = c.canvas.height;
	shopBody.style.height = (c.canvas.height - shopHeaderBox.offsetHeight) + "px";
	menuBody.style.height = (c.canvas.height - menuHeaderBox.offsetHeight) + "px";

	fruitType = FRUITTYPES[0];
	speed = SPEEDS[0];

	// load all the things
	loadLocalStorage();
	loadSnakeSprite();
	loadFruitSprite();
	setSnakeCount();

	// set initial variables
	square = canv.width / rows;
	gap = square / 10;

	head = new Cell(rows / 2, 1);
	tail = [new Cell(rows / 2, 0)];
	fruit = new Cell(Math.floor(Math.random() * rows), Math.floor(Math.random() * cols));

	// CREATE STATS

	var firstFruit = fruitVarieties.firstElementChild;

	for (var i = 1; i < fruitStats.length; i++) {
		var newFruit = firstFruit.cloneNode(true);
		fruitVarieties.appendChild(newFruit);
		if (fruitStats[i] == 0) {
			newFruit.style.display = "none";
		}
	}

	fruitVarietyRows = document.getElementsByClassName("fruit-variety");
	fruitIcons = document.getElementsByClassName("fruit-icon");
	fruitNumbers = document.getElementsByClassName("fruit-number");

	for (var i = 0; i < fruitStats.length; i++) {
		fruitIcons[i].src = FRUITTYPES[i].fileName;
		fruitNumbers[i].innerHTML = fruitStats[i];
	}


	// CREATE SHOP

	// duplicate first snake in shop

	var firstSnake = snakeList.firstElementChild;
	
	for (var i = 1; i < SNAKES.length; i++) {
		var newSnake = firstSnake.cloneNode(true);
		snakeList.appendChild(newSnake);
	}

	// set icons

	var snakeIcons = document.getElementsByClassName("snake-icon");
	for (var i = 0; i < snakeIcons.length; i++) {
		snakeIcons[i].style.backgroundImage = "url(" + SNAKES[i].fileName + ")";
	}

	if (basket > 0)
		basketImage.src = "sprites/basketfull.png";

	eyeImage.style.backgroundImage = "url(" + currentSnake.fileName + ")";

	// set names

	var snakeNames = document.getElementsByClassName("snake-name");
	for (var i = 0; i < snakeNames.length; i++) {
		snakeNames[i].innerHTML = SNAKES[i].snakeName;
	}

	// set buttons

	snakeButtons = document.getElementsByClassName("snake-button");
	snakeEyes = document.getElementsByClassName("eye-icon");
	for (var i = 0; i < snakeButtons.length; i++) {
		var b = snakeButtons[i];
		var se = snakeEyes[i];
		b.mySnake = SNAKES[i];
		b.myEye = se;
		
		if (b.mySnake.using) {
			b.innerHTML = "USING";
			se.style.display = "inline";
		} else if (b.mySnake.have) {
			b.innerHTML = "USE";
			se.style.display = "none";
		} else {
			b.innerHTML = '<img src="sprites/fruitred.png" style="height: 1em; margin-bottom: -0.15em; margin-right: 2px">' + b.mySnake.snakeCost;
			se.style.display = "none";
		}
	}

	// speed buttons

	speedButtons = document.getElementsByClassName("speed-button");
	speedCaptions = document.getElementsByClassName("speed-caption");
	for (var i = 0; i < speedButtons.length; i++) {
		speedButtons[i].mySpeed = SPEEDS[i];
		speedButtons[i].off = true;
		
		if (highScore >= SPEEDS[i].score) {
			speedButtons[i].off = false;
			speedButtons[i].style.backgroundColor = SPEEDS[i].buttonColor;
			speedButtons[i].style.display = "block";
			if (i > 0)
				speedCaptions[i - 1].style.display = "none";
		} else if (speed == speedButtons[i].mySpeed) {
			speed.using = false;
			speed = speedButtons[0].mySpeed;
			speed.using = true;
			speedButtons[0].style.width = "50%";
		}

		if (speed == speedButtons[i].mySpeed) {
			speedButtons[i].style.width = "50%";
		}
	}

}

function paint() {
	// clear
	c.clearRect(0, 0, canv.width, canv.height);

	highScoreText.innerHTML = highScore;
	scoreText.innerHTML = score;
	basketText.innerHTML = basket;

	// game over / press space
	if (dead) {
		gameOverText.style.color = "#E20";
		gameMessageText.style.color = "#FD0";
		gameOverText.innerHTML = "Game Over!";
		gameMessageText.innerHTML = "Press Space to Play Again!";
	} else if (!started) {
		gameMessageText.style.color = "#FD0";
		gameOverText.innerHTML = "";
		gameMessageText.innerHTML = "Press Space to Begin!";
	}

	// update buttons
	for (var i = 0; i < snakeButtons.length; i++) {
		var sb = snakeButtons[i]
		if (sb.mySnake.have || (canAfford(sb) && currentSnake != sb.mySnake)) {
			if (!sb.hovered)
				sb.style.backgroundColor = "#FD0";
		} else {
			if (!sb.mySnake.have)
				sb.style.backgroundColor = "#CCC";
		}
	}

	// background
	c.fillStyle = "#111";
	c.fillRect(0, 0, canv.width, canv.height);
	c.fillStyle = "#222";
	for (var col = 0; col < cols; col++) {
		for (var row = 0; row < rows; row++) {
			if ((col + row) % 2 == 0) {
				c.fillRect(col * square, row * square, square, square);
			}
		}
	}

	if (started || dead)
		if (fruitSpriteReady)
			drawFruit(c, fruit.x + square/2, fruit.y + square/2, square/2 - gap);

	if (snakeSpriteReady) {
		
		// tail
		for (var i = 0; i < tail.length; i++) {
			var spr = HORIZ;
			if (head.same(tail[i]) && !dead && started) {
				gameOver();
			}
			if (tail.length == 1)
				spr = tail[i].draw([head]);
			else if (i == 0)
				spr = tail[i].draw([tail[i + 1]]);
			else if (i == tail.length - 1)
				spr = tail[i].draw([tail[i - 1], head]);
			else
				spr = tail[i].draw([tail[i - 1], tail[i + 1]]);
			c.drawImage(snakeSprite, spr.x, spr.y, spr.w, spr.h, tail[i].x, tail[i].y, square, square);
		}

		var spr = HORIZ;
		// head
		if (tail.length == 0)
			spr = head.draw([]);
		else
			spr = head.draw([tail[tail.length - 1]]);

		c.drawImage(snakeSprite, spr.x, spr.y, spr.w, spr.h, head.x, head.y, square, square);
	}

	drawEye();
}

function update() {
	paint();

	// how fast are we going
	if (frames % speed.frames == 0) {
		frames = 0;

		if (!dead && started) {
			var gotFruit = false;
			if (fruit.same(head)) {
				// fruit successfully eaten

				score += fruitType.fruitScore;
				basket += fruitType.fruitScore;
				try {
					localStorage.setItem('fruitbasket', basket);
				} catch (err) {}
				if (basket == 1) {
					basketImage.src = "sprites/basketfull.png";
				}

				// update messages
				gameOverText.style.color = "#FD0";
				gameMessageText.style.color = fruitType.fruitColor;
				gameOverText.innerHTML = MESSAGES[Math.floor(Math.random() * MESSAGES.length)] + "!";
				gameMessageText.innerHTML = "+" + fruitType.fruitScore;

				// update stats
				var fruitIndex = fruitType.fruitID;
				if (fruitStats[fruitIndex] === 0) {
					fruitVarietyRows[fruitIndex].style.display = "block";
				}
				fruitStats[fruitIndex]++;
				fruitNumbers[fruitIndex].innerHTML = fruitStats[fruitIndex];
				try {
					localStorage.setItem('fruitstats', JSON.stringify(fruitStats))
				} catch (err) {}

				totalFruits++;
				totalFruitsStat.innerHTML = "Total: " + totalFruits;

				totalFruitPoints += fruitType.fruitScore;
				totalFruitPointsStat.innerHTML = "Total Score: " + totalFruitPoints;

				var speedIndex = speed.speedID;
				if (score > highScoreStats[speedIndex]) {
					highScoreStats[speedIndex] = score;
					highScoreStat[speedIndex].innerHTML = speed.menuName + ": " + highScoreStats[speedIndex];
					try {
						localStorage.setItem('highscorestats', JSON.stringify(highScoreStats))
					} catch (err) {}
				}

				// update high score
				if (score > highScore) {
					highScore = score;
					try {
						localStorage.setItem('highscore', highScore);
					} catch (err) {}

					for (var i = 0; i < speedButtons.length; i++) {
						if (speedButtons[i].off && highScore >= SPEEDS[i].score) {
							speedButtons[i].off = false;
							speedButtons[i].style.backgroundColor = SPEEDS[i].buttonColor;
							speedButtons[i].style.display = "block";
							if (i > 0)
								speedCaptions[i - 1].style.display = "none";
						}
					}
				}
				gotFruit = true;
				fruitOnTail = true;

				// create new fruit

				// what kind of fruit is it gonna be
				fruitType = chooseFruitType(speed, score);
				loadFruitSprite();

				// where's it gonna go
				while (fruitOnTail) {
					fruit = new Cell(Math.floor(Math.random() * rows),
							 		 Math.floor(Math.random() * cols));
					fruitOnTail = false;
					if (fruit.same(head))
						fruitOnTail = true;
					for (var i = 0; i < tail.length && !fruitOnTail; i++) {
						if (fruit.same(tail[i])) {
							fruitOnTail = true;
						}
					}
				}
			}
			
			// turn snake if requested
			dir = moves.length == 0 ? dir : moves[0];
			moves = moves.slice(1);

			// check if snake hit the wall
			var next = head.getCell(dir);
			if (!next.outOfBounds()) {
				if (tail.length > 0) {
					if (!gotFruit)
						tail = tail.slice(1);
					tail.push(head);
				}
				head = head.getCell(dir);
			} else {
				gameOver();
			}
		}
	}

	frames++;
}

function keyDown(e) {
	var code = e.keyCode;
	var prev = moves.length == 0 ? dir : moves[moves.length - 1];
	switch (code) {
		case 37:
			if (started && !dead && prev != RIGHT && prev != LEFT && moves.length < 6)
				moves.push(LEFT);
			break;
		case 38:
			if (started && !dead && prev != UP && prev != DOWN && moves.length < 6)
				moves.push(UP);
			break;
		case 39:
			if (started && !dead && prev != RIGHT && prev != LEFT && moves.length < 6)
				moves.push(RIGHT);
			break;
		case 40:
			if (started && !dead && prev != UP && prev != DOWN && moves.length < 6)
				moves.push(DOWN);
			break;
		case 32:
			resetGame();
			break;
	}
}

function gameOver() {
	dead = true;
	started = false;
	gamesPlayed++;
	try {
		localStorage.setItem('gamesplayed', gamesPlayed);
	} catch (err) {}
	gamesPlayedStat.innerHTML = "Games Played: " + gamesPlayed;
}

function resetGame() {
	// new game
	gameMessageText.style.color = "#FD0";
	gameOverText.innerHTML = "";
	gameMessageText.innerHTML = "Use Arrow Keys to Turn!";

	if (!started) {
		started = true;
		score = 0;
	}
	if (dead) {
		dead = false;
		head = new Cell(rows / 2, 1);
		tail = [new Cell(rows / 2, 0)];
		fruit = new Cell(Math.floor(Math.random() * rows),
						 Math.floor(Math.random() * cols));
		fruitType = FRUITTYPES[0];
		loadFruitSprite();
		dir = RIGHT;
		nextDir = RIGHT;
		moves = [];
	}
}

function drawFruit() {
	c.drawImage(fruitSprite, fruit.x, fruit.y, square, square);
}

function drawEye() {
	c.fillStyle = "white";
	c.beginPath();
	c.arc(head.x + square / 2, head.y + square / 2,
		  square * 0.25, 0, Math.PI * 2);
	c.fill();

	if (!dead) {
		if (dir == LEFT || dir == RIGHT)
			eyeDir = 0;
		else
			eyeDir = eyeSpin / 2;
	}

	c.fillStyle = "black";
	c.beginPath();
	c.ellipse(head.x + square / 2, head.y + square / 2,
			  square * 0.25, square * 0.08,
			  Math.PI * eyeDir / eyeSpin, 0, Math.PI * 2);

	// the eye spins!
	if (dead) {
		eyeDir++;
		if (eyeDir >= eyeSpin * 2)
			eyeDir = 0;
	}

	c.fill();
}

// localStorage

function loadLocalStorage() {

	// high score
	try {
		if (localStorage.getItem('highscore') === null) {
			highScore = 0;
			localStorage.setItem('highscore', 0);
		} else {
			highScore = parseInt(localStorage.getItem('highscore'));
		}
	} catch (err) {
		highScore = 0;
	}

	// fruit basket
	try {
		if (localStorage.getItem('fruitbasket') === null) {
			basket = 0;
			localStorage.setItem('fruitbasket', 0);
		} else {
			basket = parseInt(localStorage.getItem('fruitbasket'));
		}
	} catch (err) {
		basket = 0;
	}

	// current speed

	try {
		if (localStorage.getItem('currentspeed') === null) {
			speed = SPEEDS[0];
			localStorage.setItem('currentspeed', '0');
		} else {
			speed = SPEEDS[parseInt(localStorage.getItem('currentspeed'))]
		}
		speed.using = true;
	} catch (err) {
		speed = SPEEDS[0];
	}

	// current snake
	try {
		if (localStorage.getItem('currentsnake') === null) {
			currentSnake = SNAKES[0];
			localStorage.setItem('currentsnake', SNAKES[0].itemName)
		} else {
			currentSnake = getSnake(localStorage.getItem('currentsnake'));
		}
		currentSnake.using = true;
	} catch (err) {
		currentSnake = SNAKES[0];
	}

	// purchased snakes

	SNAKES[0].have = true;
	try {
		localStorage.setItem(SNAKES[0].itemName, "have");
		for (var i = 1; i < SNAKES.length; i++) {
			if (localStorage.getItem(SNAKES[i].itemName) === null) {
				localStorage.setItem(SNAKES[i].itemName, "dont");
			} else if (localStorage.getItem(SNAKES[i].itemName) === "have") {
				SNAKES[i].have = true;
			}
		}
	} catch (err) {}

	// fruit stats

	try {
		if (localStorage.getItem('fruitstats') === null) {
			fruitStats = [];
			for (var i = 0; i < FRUITTYPES.length; i++) {
				fruitStats.push(0);
			}
		} else {
			fruitStats = JSON.parse(localStorage.getItem('fruitstats'));
		}
	} catch (err) {
		fruitStats = [];
		for (var i = 0; i < FRUITTYPES.length; i++) {
			fruitStats.push(0);
		}
	}

	totalFruits = 0;
	totalFruitPoints = 0;
	for (var i = 0; i < fruitStats.length; i++) {
		totalFruits += fruitStats[i];
		totalFruitPoints += fruitStats[i] * FRUITTYPES[i].fruitScore;
	}
	totalFruitsStat.innerHTML = "Total: " + totalFruits;
	totalFruitPointsStat.innerHTML = "Total Score: " + totalFruitPoints;

	// other stats
	try {
		if (localStorage.getItem('highscorestats') === null) {
			highScoreStats = [];
			for (var i = 0; i < SPEEDS.length; i++) {
				highScoreStats.push(0);
			}
		} else {
			highScoreStats = JSON.parse(localStorage.getItem('highscorestats'));
		}
	} catch (err) {
		highScoreStats = [];
		for (var i = 0; i < SPEEDS.length; i++) {
			highScoreStats.push(0);
		}
	}

	for (var i = 0; i < highScoreStats.length; i++) {
		highScoreStat[i].innerHTML = SPEEDS[i].menuName + ": " + highScoreStats[i];
	}

	try {
		if (localStorage.getItem('gamesplayed') === null) {
			gamesPlayed = 0;
			localStorage.setItem('gamesplayed', 0);
		} else {
			gamesPlayed = parseInt(localStorage.getItem('gamesplayed'));
		}
	} catch (err) {
		gamesPlayed = 0;
	}
	gamesPlayedStat.innerHTML = "Games Played: " + gamesPlayed;
}

function setSnakeCount() {
	numSnakes = 0;
	for (var i = 0; i < SNAKES.length; i++) {
		if (SNAKES[i].have)
			numSnakes++;
	}
	snakeCount.innerHTML = numSnakes + "/" + SNAKES.length;
}

// speed buttons

function speedButtonIn(sb) {
	if (dead || !started) {
		if (!sb.mySpeed.using && highScore >= sb.mySpeed.score) {
			sb.style.backgroundColor = sb.mySpeed.darkColor;
			sb.hovered = true;
		}
	}
}

function speedButtonOut(sb) {
	if (sb.hovered) {
		sb.style.backgroundColor = sb.mySpeed.buttonColor;
		sb.hovered = false;
	}
}

function speedButtonClick(sb) {
	if (dead || !started) {
		if (sb.hovered) {
			speed.using = false;
			speedButtons[speed.speedID].style.width = "40%";

			speed = sb.mySpeed;
			speed.using = true;
			sb.style.width = "50%";
			sb.style.backgroundColor = sb.mySpeed.buttonColor;
			try {
				localStorage.setItem("currentspeed", speed.speedID)
			} catch (err) {}
		}
	}
}

// snake buttons

function loadSnakeSprite() {
	// load images
	snakeSpriteFile = currentSnake.fileName;
	snakeSprite.src = snakeSpriteFile;
	snakeSprite.addEventListener('load', function() {
		snakeSpriteReady = true;
	}, false);
}

function loadFruitSprite() {
	fruitSpriteFile = fruitType.fileName;
	fruitSprite.src = fruitSpriteFile;
	fruitSprite.addEventListener('load', function() {
		fruitSpriteReady = true;
	}, false);
}

function canAfford(sb) {
	return sb.mySnake.snakeCost <= basket;
}

function snakeButtonIn(sb) {
	if (sb.mySnake.have && !sb.mySnake.using || (!sb.mySnake.have && canAfford(sb)))
		sb.style.backgroundColor = "#CA0";
	sb.hovered = true;
}

function snakeButtonOut(sb) {
	if (canAfford(sb) || sb.mySnake.have)
		sb.style.backgroundColor = "#FD0";
	sb.hovered = false;
}

function snakeButtonClick(sb) {
	if (sb.mySnake.have && !sb.mySnake.using) {
		// switch snakes
		switchSnake(sb);
	} else if (!sb.mySnake.have && canAfford(sb)) {
		// buy snake
		switchSnake(sb);
		sb.mySnake.have = true;
		setSnakeCount();
		basket -= sb.mySnake.snakeCost;
		if (basket == 0) {
			basketImage.src = "sprites/basket.png";
		}
		try {
			localStorage.setItem('fruitbasket', basket);
			localStorage.setItem(sb.mySnake.itemName, 'have');
		} catch (err) {}
	}
}

function switchSnake(sb) {
	var currentSnakeButton;
	for (var i = 0; i < snakeButtons.length; i++) {
		if (snakeButtons[i].mySnake.using) {
			currentSnakeButton = snakeButtons[i];
			break;
		}
	}
	currentSnakeButton.innerHTML = "USE";
	currentSnakeButton.myEye.style.display = "none";
	currentSnake.using = false;


	sb.innerHTML = "USING";
	sb.myEye.style.display = "inline";
	currentSnake = sb.mySnake;
	currentSnake.using = true;
	try {
		localStorage.setItem('currentsnake', currentSnake.itemName)
	} catch (err) {}

	loadSnakeSprite();
	eyeImage.style.backgroundImage = "url(" + currentSnake.fileName + ")";
}
