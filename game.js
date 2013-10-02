// Holds the rows of pegs
var rows = [];

// Which turn are we on
var currentRow = 9;

// Holds the solution code
var answer = [];

var numPegs = 4;
var numRows = 10;
var red = "#FE2E2E";
var pink = "#F781BE"
var yellow = "#F7FE2E";
var lime = "#80FF00";
var green = "#088A08";
var blue = "#5858FA";
var cyan = "#58FAD0";
var orange = "#FAAC58";
var gray = "#848484";
var white = "#E6E6E6";

var colors = [red, pink, yellow, blue, lime, orange, cyan, green];
var colorCircles = [];
var selectedCircle = {x: null, y: null, radius: null}

// Adds the elements to the rows array and displays the board.
function loadPage() {

	// Creates a random answer	
	for ( var i = 0; i < numPegs; i++ ) {
		answer.push(colors[Math.floor(Math.random()*8)]);
	}

	var board = document.getElementById('board');
	var topCanvas = document.getElementById('top_canvas');
	
	board.addEventListener('click', function(event) {
		handleClick(board, event);
	});
	
	topCanvas.addEventListener('click', function(event) {
		handleClick(topCanvas, event);
	});
	
	topCanvas.addEventListener('mousemove', function(event) {
		handleHover(topCanvas, event);
	});

	board.addEventListener('mousemove', function(event) {
		handleHover(board, event);
	});

	var xOffset = board.width/6;
	var xMultiplier = board.width / (numPegs + 2);
	var yOffset = board.height/6;
	var yMultiplier = board.height / (numRows + 2);

	// Creates the rows array, assigning relevant information to each peg in each row.
	for ( var i = 0; i < numRows; i++ ) {
		var row =
			{	
				pegs : [
					{color : gray, column : 0, x : xOffset + 0*xMultiplier, y : yOffset + i*yMultiplier },
					{color : gray, column : 1, x : xOffset + 1*xMultiplier, y : yOffset + i*yMultiplier },
					{color : gray, column : 2, x : xOffset + 2*xMultiplier, y : yOffset + i*yMultiplier },
					{color : gray, column : 3, x : xOffset + 3*xMultiplier, y : yOffset + i*yMultiplier },
				],
				guessResult : [gray, gray, gray, gray]
			}

		rows[i] = row;
	}

	displayBoard();
}

function handleWin() {
	alert("Congratulations, you win!");
	displayAnswer();
	var checkGuess = document.getElementById("check_guess");
	checkGuess.innerHTML = "New Game";
	checkGuess.onclick = function() {location.reload();}
}

function handleLose() {
	alert("Sorry, you lose!");
	displayAnswer();
	var checkGuess = document.getElementById("check_guess");
	checkGuess.innerHTML = "New Game";
	checkGuess.onclick = function() {location.reload();}
}

// Called at the end of the game, so the player knows what the code was.
function displayAnswer() {
	var board = document.getElementById('board');
	var pegs = rows[0].pegs;
	var xOffset = board.width/6;
	var xMultiplier = board.width / (pegs.length + 2);
	var yOffset = board.height/16;
	var yMultiplier = board.height / (rows.length + 2);
	var radius = board.width / 18;
	
	// Draws the answer row
	for ( var i = 0; i < answer.length; i++ ) {
		drawCircle(xOffset + pegs[i].column*xMultiplier, yOffset, radius, white, answer[i], 3, board);
	}
}

// Returns a slightly offset mouse coordinate from the default (because it's off-center)
function getMousePosition(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	var mousePosition = 
	{
		x : event.clientX - rect.left,
		y : event.clientY - rect.top,
	}
	return mousePosition;
}

// Draws the board
function displayBoard() {
	var board = document.getElementById('board');
	clearCanvas(board);
	var pegs = rows[0].pegs;
	var xOffset = board.width/6;
	var xMultiplier = board.width / (pegs.length + 2);
	var yOffset = board.height/16;
	var yMultiplier = board.height / (rows.length + 2);
	var radius = board.width / 18;
	
	// Draws the answer row
	for ( var i = 0; i < pegs.length; i++ ) {
		drawCircle(xOffset + pegs[i].column*xMultiplier, yOffset, radius, white, gray, 3, board);
		drawText("?", xOffset + pegs[i].column*xMultiplier - 7, yOffset + 8, 24, white, board);
	}

	radius = board.width / 20;
	yOffset = board.height/6;

	// Draws all of the pegs and the guess result circles ('dots')
	for ( var i = 0; i < rows.length; i++ ) {
		var fillColor = gray;
		var borderWidth = 3;
		if ( i == currentRow ) {
			borderWidth = 5;
		}
		xOffset = board.width/6;
		var row = rows[i];
		var pegs = row.pegs;

		// Draws the pegs for the row
		for ( var j = 0; j < pegs.length; j++ ) {
      		drawCircle(pegs[j].x, pegs[j].y, radius, "black", pegs[j].color, borderWidth, board);
		}

		// Draws the result of the guess for the given row
		xOffset = board.width - board.width/5;
		for ( var k = 0; k < pegs.length; k++ ) {
			drawCircle(xOffset + (pegs[k].column)*xMultiplier/4, yOffset + i*yMultiplier, radius/4, "black", row.guessResult[k], 2, board);
		}
	}
}

// Gets the result of the player's guess, and responds accordingly.
function checkGuess() {
	var guessResult = getGuessResult();
	if (guessResult.length > 0) {
		rows[currentRow].guessResult = guessResult;
		if (guessResult[3] == red) {
			displayBoard();
			handleWin();
		} else {
			if (currentRow == 0) {
				displayBoard();
				handleLose();
			} else {
				currentRow--;
				displayBoard();
			}
		}
	}
}

// This function is the main logic behind the program. It processes a row of
// colors and generates a guess and the guess result.
function getGuessResult() {
	guess = [];
	var row = rows[currentRow];
	for ( var i = 0; i < numPegs; i++ ) {
		guess.push(row.pegs[i].color);
		if ( row.pegs[i].color == gray ) {
			alert("Please select a color for each peg!");
			return [];
		}
	}

	// Variables to keep track of indices
	redIndices = [];
	whiteIndices = [];
	usedForWhiteIndices = [];
	
	// Find colors in the exact right spot
	for (var i = 0; i < 4; i++) {
		if (guess[i] == answer[i]) {
			redIndices.push(i);
		}
	}
	
	// Find correct colors in wrong spot
	for (var i = 0; i < 4; i++) {
		// Find guess color in answer that hasn't been used yet
		var answerIndex = -1;
		if (redIndices.indexOf(i) == -1) {
			for (var j = 0; j < 4; j++) {
				if (answer[j] == guess[i]) {
					if (usedForWhiteIndices.indexOf(j) == -1) {
						answerIndex = j;
						break;
					}
				}
			}
		}
		
		// Add white peg and remove index from consideration
		if ( answerIndex != -1) {
			if (redIndices.indexOf(answerIndex) == -1) {
				whiteIndices.push(i);
				usedForWhiteIndices.push(answerIndex);
			}
		}
	}
	
	// Create guessResult array
	guessResult = [];
	var times = redIndices.length;
	for (var i = 0; i < times; i++) {
		guessResult.push(red);
	}
	times = whiteIndices.length;
	for (var i = 0; i < times; i++) {
		guessResult.push(white);
	}
	times = 4 - guessResult.length;
	for (var i = 0; i < times; i++) {
		guessResult.push(gray);
	}
	
	return guessResult;
}

// Determines which canvas is active when the click happened and responds accordingly.
function handleClick(canvas, event) {
	var topCanvas = document.getElementById("top_canvas");
	if ( topCanvas.style.display != "inline" ) {
		var radius = board.width / 18;
		var mousePosition = getMousePosition(canvas, event);
		for ( var i = 0; i < numPegs; i++ ) {
			if (mouseInCircle(mousePosition.x, mousePosition.y, rows[currentRow].pegs[i].x, rows[currentRow].pegs[i].y, radius)) {
				displayColors(rows[currentRow].pegs[i], radius);
			}
		}
	} else {
		var mousePosition = getMousePosition(canvas, event);
		for ( var i = 0; i < colorCircles.length; i++ ) {
			if ( mouseInCircle(mousePosition.x, mousePosition.y, colorCircles[i].x, colorCircles[i].y, colorCircles[i].radius)) {
				setPegColor(colorCircles[i].color);
				return;
			}
		}
		setPegColor(selectedCircle.color);
	}
}

// Determines which canvas is active when the hover happened and responds accordingly.
function handleHover(canvas, event) {
	var topCanvas = document.getElementById("top_canvas");
	var mousePosition = getMousePosition(canvas, event);
	for ( var i = 0; i < colorCircles.length; i++ ) {
		if ( mouseInCircle(mousePosition.x, mousePosition.y, colorCircles[i].x, colorCircles[i].y, colorCircles[i].radius)) {
			drawCircleWheel(selectedCircle, colorCircles[i].color);
			return;
		}
	}
	drawCircleWheel(selectedCircle, null);

}

// Sets the color of the peg after the person clicks the color
function setPegColor(color) {
	var topCanvas = document.getElementById("top_canvas");
	selectedCircle.color = color;
	displayBoard();
	clearCanvas(topCanvas);
	topCanvas.style.display = "none";
}

// Determines if the mouse is in the given circle (passed in)
function mouseInCircle(mouseX, mouseY, circleX, circleY, radius) {
	var weirdOffset = 4;
	mouseX = mouseX - weirdOffset;
	mouseY = mouseY - weirdOffset;
	return (Math.sqrt(Math.pow(Math.abs(mouseX-circleX), 2) + Math.pow(Math.abs(mouseY-circleY), 2)) <= radius+2);
}

// Displays the colors you can choose when a peg is clicked
function displayColors(peg, radius) {
	selectedCircle = peg;
	selectedCircle.radius = radius;
	drawCircleWheel(selectedCircle, null);
	var topCanvas = document.getElementById("top_canvas");
	$(topCanvas).fadeIn("slow");
}

// Actually draws the color wheel
function drawCircleWheel(selectedCircle, selectedColor) {
	var x = selectedCircle.x;
	var y = selectedCircle.y;
	var radius = selectedCircle.radius;
	var topCanvas = document.getElementById("top_canvas");
	clearCanvas(topCanvas);
	colorCircles = [];
	for ( var i = 0; i < 2*Math.PI; i += Math.PI/4 ) {
		var xOffset = 2*radius*Math.cos(i);
		var yOffset = 2*radius*Math.sin(i);
		if (colors[colorCircles.length] == selectedColor) {
			drawCircle(x + xOffset, y + yOffset, radius/1.5, white, colors[colorCircles.length], 2.5, topCanvas);
			drawCircle(x, y, radius, "black", colors[colorCircles.length], 5, topCanvas);
		} else {
			drawCircle(x + xOffset, y + yOffset, radius/2, white, colors[colorCircles.length], 2.5, topCanvas);
		}
		var circle = { x: x + xOffset,
					   y: y + yOffset,
					   color: colors[colorCircles.length],
					   radius: radius/2
					 }
		colorCircles.push(circle);
	}
}

// We defined this because it's used a lot in our program
// And it's not a built-in canvas function
function drawCircle(x, y, radius, borderColor, fillColor, borderWidth, canvas) {
	var context = canvas.getContext("2d");
	context.beginPath();
	context.strokeStyle = borderColor;
	context.lineWidth = borderWidth;
	context.arc(x, y, radius, 0, 2 * Math.PI, false);
	context.fillStyle = fillColor;
	context.fill();
	context.stroke();
}

// We defined this because it's used a lot in our program
// And it's not a built-in canvas function
function drawText(text, x, y, size, color, canvas) {
	var context = canvas.getContext("2d");
	context.fillStyle = color;
	context.font = "bold "  + size + "px verdana";
	context.fillText(text, x, y);
}

// We defined this because it's used a lot in our program
// And it's not a built-in canvas function
function clearCanvas(canvas) {
	var context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
}