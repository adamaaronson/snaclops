class FruitType {
	constructor(colorName, fruitID, score, color) {
		this.colorName = colorName;
		this.fruitID = fruitID;
		this.fruitScore = score;
		this.fruitColor = color;
		this.cell = null;
	}

	get fileName() {
		return "sprites/fruit" + this.colorName + ".png";
	}
}

class Speed {
	constructor(speedName, menuName, speedID, inter, steep, frames, score, buttonColor, darkColor) {
		this.speedName = speedName;
		this.menuName = menuName;
		this.speedID = speedID;
		this.inter = inter;
		this.steep = steep;
		this.frames = frames;
		this.score = score;
		this.using = false;
		this.buttonColor = buttonColor;
		this.darkColor = darkColor;
	}

}

const FRUITTYPES = [
	new FruitType("red", 0, 1, "#D20"),
	new FruitType("orange", 1, 2, "#fb8614"),
	new FruitType("yellow", 2, 3, "#FD0"),
	new FruitType("green", 3, 4, "#22fe1d"),
	new FruitType("blue", 4, 5, "#1da7fe"),
	new FruitType("purple", 5, 10, "#8b2ac6")
];

const MESSAGES = ["Mm", "Mmm", "Mmmm", "Mmmmm", "Mmmmmm", "Mmmmmmm", "Mmmmmmmm", "Mmmmmmmmm", "Mmmmmmmmmmm",
				  "Tasty", "Delicious", "Yum", "Scrumptious", "Delish", "Delectable",
				  "Yummy", "Exquisite", "Sweet", "Fruity", "Toothsome",
				  "Succulent", "Luscious", "Juicy"];

const SPEEDS = [
	new Speed("slow", "Slow", 0, 40, 0.2, 4, 0, "#FD0", "#CA0"),
	new Speed("slither", "Slither", 1, 28, 0.2, 3, 50, "#F81", "#C50"),
	new Speed("sprint", "Sprint", 2, 12, 0.2, 2, 100, "#F42", "#C10")
];

// difference between scores when new fruit's growth peaks (middle of logistic curve)
const INTER = 30;

// steepness of logistic curve; speed at which fruits are introduced
const STEEP = 0.3;

// calculate the number of parts that this fruit gets in the random selection
// uses a logistic curve that is translated right by INTER points for each consecutive fruit
function fruitFunction(speed, score, index) {
	if (index == 0)
		return 1;
	else
		return 1 / (1 + Math.exp(-speed.steep * (score - index * speed.inter)));
}

// counts the total number of parts of all the fruits, for normalization
function fruitTotal(speed, score) {
	var total = 0;
	for (var i = 0; i < FRUITTYPES.length; i++) {
		total += fruitFunction(speed, score, i);
	}
	return total;
}

// normalize the fruitFunction with a known total
function fruitChance(speed, score, index, fruitTotal) {
	return fruitFunction(speed, score, index) / fruitTotal;
}

// normalize the fruitFunction calculating the total on the fly
function fruitChance(speed, score, index) {
	return fruitFunction(speed, score, index) / fruitTotal(speed, score);
}

// randomly generates a fruit at a certain score, using the fruit chances
function chooseFruitType(speed, score) {
	var fTotal = fruitTotal(score);
	var randomNumber = Math.random();
	var totalChance = 0;
	for (var i = 0; i < FRUITTYPES.length; i++) {
		totalChance += fruitChance(speed, score, i, fTotal);
		if (totalChance > randomNumber) {
			return FRUITTYPES[i];
		}
	}
	return FRUITTYPES[0];
}

function simulateGame(score) {
	for (var i = 0; i < score; i++) {
		console.log(chooseFruitType(i).colorName);
	}
}