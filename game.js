var rows = [];

var currentRow = 9;

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

var colors = [red, pink, yellow, blue, lime, orange, cyan, green];
var colorCircles = [];
var selectedCircle = {x: null, y: null, radius: null}

var answer = [];

function loadPage() {
	for ( var i = 0; i < 4; i++ ) {
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

	var xOffset = board.width/6;
	var xMultiplier = board.width / (numPegs + 2);
	var yOffset = board.height/6;
	var yMultiplier = board.height / (numRows + 2);
	

	for ( var i = 0; i < numRows; i++ ) {
		var row =
			{	
				pegs : [
					{color : "#848484", column : 0, x : xOffset + 0*xMultiplier, y : yOffset + i*yMultiplier },
					{color : "#848484", column : 1, x : xOffset + 1*xMultiplier, y : yOffset + i*yMultiplier },
					{color : "#848484", column : 2, x : xOffset + 2*xMultiplier, y : yOffset + i*yMultiplier },
					{color : "#848484", column : 3, x : xOffset + 3*xMultiplier, y : yOffset + i*yMultiplier },
				],
				guessResult : ["#848484", "#848484", "#848484", "#848484"]
			}

		rows[i] = row;
	}

	displayBoard();
}

function getMousePosition(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	var mousePosition = 
	{
		x : event.clientX - rect.left,
		y : event.clientY - rect.top,
	}
	return mousePosition;
}

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
		drawCircle(xOffset + pegs[i].column*xMultiplier, yOffset, radius, "#E6E6E6", "#848484", 3, board);
	}

	radius = board.width / 20;
	yOffset = board.height/6;

	for ( var i = 0; i < rows.length; i++ ) {
		var fillColor = "#848484";
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

function checkGuess() {
	var guessResult = getGuessResult();
	alert(guessResult);
	if (guessResult.length > 0) {
		if (guessResult == ["red", "red", "red", "red"]) {
			// You win
			alert("You win!");
		} else {
			rows[currentRow].guessResult = guessResult;
			if (currentRow == 0) {
				// You lose!
				alert("You lose!");
			} else {
				currentRow--;
				displayBoard();
			}
		}
	}
}

function getGuessResult() {
	guess = [];
	var row = rows[currentRow];
	for ( var i = 0; i < numPegs; i++ ) {
		guess.push(row.pegs[i].color);
		if ( row.pegs[i].color == "#848484" ) {
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
		var answerIndex = answer.indexOf(guess[i]);
		if ( answerIndex != -1) {
			if (redIndices.indexOf(answerIndex) == -1) {
				if (usedForWhiteIndices.indexOf(answerIndex) == -1) {
					whiteIndices.push(i);
					usedForWhiteIndices.push(answerIndex);
				}
			}
		}
	}
	
	// Create guessResult array
	guessResult = [];
	var times = redIndices.length;
	for (var i = 0; i < times; i++) {
		guessResult.push("red");
	} 
	times = whiteIndices.length;
	for (var i = 0; i < times; i++) {
		guessResult.push("white");
	}
	times = (4 - guessResult.length);
	for (var i = 0; i < times; i++) {
		guessResult.push("#848484");
	}
	
	return guessResult;
}

function handleClick(canvas, event) {
	var topCanvas = document.getElementById("top_canvas");
	if ( topCanvas.style.display != "inline" ) {
		var radius = board.width / 18;
		var mousePosition = getMousePosition(canvas, event);
		if ( mousePosition.y >= rows[currentRow].pegs[0].y - radius && mousePosition.y <= rows[currentRow].pegs[0].y + radius ) {
			
			for ( var i = 0; i < numPegs; i++ ) {
				if (mouseInCircle(mousePosition.x, mousePosition.y, rows[currentRow].pegs[i].x, rows[currentRow].pegs[i].y, radius)) {
					displayColors(rows[currentRow].pegs[i], radius);
				}
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

function setPegColor(color) {
	var topCanvas = document.getElementById("top_canvas");
	selectedCircle.color = color;
	displayBoard();
	clearCanvas(topCanvas);
	topCanvas.style.display = "none";
}

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

function mouseInCircle(mouseX, mouseY, circleX, circleY, radius) {
	var weirdOffset = 4;
	mouseX = mouseX - weirdOffset;
	mouseY = mouseY - weirdOffset;
	return (Math.sqrt(Math.pow(Math.abs(mouseX-circleX), 2) + Math.pow(Math.abs(mouseY-circleY), 2)) <= radius+2);
}

function displayColors(peg, radius) {
	selectedCircle = peg;
	selectedCircle.radius = radius;
	drawCircleWheel(selectedCircle, null);
	var topCanvas = document.getElementById("top_canvas");
	$(topCanvas).fadeIn("slow");
}

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
			drawCircle(x + xOffset, y + yOffset, radius/1.5, "#E6E6E6", colors[colorCircles.length], 2.5, topCanvas);
			drawCircle(x, y, radius, "black", colors[colorCircles.length], 5, topCanvas);
		} else {
			drawCircle(x + xOffset, y + yOffset, radius/2, "#E6E6E6", colors[colorCircles.length], 2.5, topCanvas);
		}
		var circle = { x: x + xOffset,
					   y: y + yOffset,
					   color: colors[colorCircles.length],
					   radius: radius/2
					 }
		colorCircles.push(circle);
	}
}

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

function clearCanvas(canvas) {
	var context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
}