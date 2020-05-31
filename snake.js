class Snake {
	constructor(name, baseName, cost) {
		this.snakeName = name;
		this.baseName = baseName;
		this.snakeCost = cost;
		this.have = false;
		this.using = false;
	}

	get fileName() {
		return "sprites/snake" + this.baseName + ".png";
	}

	get itemName() {
		return "snake" + this.baseName;
	}
}

// the snakes

const SNAKES = [
	new Snake("Python", "yellow", 0),
	new Snake("Sidewinder", "gray", 20),
	new Snake("Boa", "orange", 50),
	new Snake("Mamba", "green", 50),
	new Snake("Viper", "blue", 100),
	new Snake("Garter", "pink", 100),
	new Snake("Cobra", "red", 200),
	new Snake("Anaconda", "purple", 200),
	new Snake("Zebra", "zebra", 300),
	new Snake("Honeybee", "honeybee", 300),
	new Snake("Tiger", "tiger", 400),
	new Snake("Candy", "candy", 450),
	new Snake("Rainbow", "rainbow", 500)
];

function getSnake(name) {
	for (var i = 0; i < SNAKES.length; i++) {
		if (SNAKES[i].itemName == name) {
			return SNAKES[i]
		}
	}
	return SNAKES[0];
}

// spritesheet
const CAPLEFT = new SnakeSprite(0, 0);
const CAPRIGHT = new SnakeSprite(2, 0);
const CAPTOP = new SnakeSprite(0, 1);
const CAPBOTTOM = new SnakeSprite(0, 3);
const HORIZ = new SnakeSprite(1, 0);
const VERT = new SnakeSprite(0, 2);
const TOPLEFT = new SnakeSprite(1, 1);
const TOPRIGHT = new SnakeSprite(2, 1);
const BOTLEFT = new SnakeSprite(1, 2);
const BOTRIGHT = new SnakeSprite(2, 2);

function SnakeSprite(x, y) {
	this.x = 256 * x;
	this.y = 256 * y;
	this.w = 256;
	this.h = 256;
}
