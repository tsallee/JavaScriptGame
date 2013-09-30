var rows = [];
var currentRow = 9;
var numPegs = 4;
var numRows = 10;

function loadPage() {
	var board = document.getElementById('board');
	board.addEventListener('click', function(event) {
		handleClick(board, event);
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
	var pegs = rows[0].pegs;
	var xOffset = board.width/6;
	var xMultiplier = board.width / (pegs.length + 2);
	var yOffset = board.height/16;
	var yMultiplier = board.height / (rows.length + 2);
	var radius = board.width / 18;
	
	// Draws the answer row
	for ( var i = 0; i < pegs.length; i++ ) {
		drawCircle(xOffset + pegs[i].column*xMultiplier, yOffset, radius, "#E6E6E6", "#848484", 3);
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
      		drawCircle(pegs[j].x, pegs[j].y, radius, "black", pegs[j].color, borderWidth);
		}

		// Draws the result of the guess for the given row
		xOffset = board.width - board.width/5;
		for ( var k = 0; k < pegs.length; k++ ) {
			drawCircle(xOffset + (pegs[k].column)*xMultiplier/4, yOffset + i*yMultiplier, radius/4, "black", row.guessResult[k], 2);
		}
	}
}

function drawCircle(x, y, radius, borderColor, fillColor, borderWidth) {
	var board = document.getElementById("board");
	var context = board.getContext("2d");
	context.beginPath();
	context.strokeStyle = borderColor;
	context.lineWidth = borderWidth;
	context.arc(x, y, radius, 0, 2 * Math.PI, false);
	context.fillStyle = fillColor;
	context.fill();
	context.stroke();
}

function checkGuess() {

}

function handleClick(canvas, event) {
	var radius = board.width / 18;
	var mousePosition = getMousePosition(canvas, event);
	if ( mousePosition.y >= rows[currentRow].pegs[0].y - radius && mousePosition.y <= rows[currentRow].pegs[0].y + radius ) {
		
		for ( var i = 0; i < numPegs; i++ ) {
			if ( mousePosition.x >= rows[currentRow].pegs[i].x - radius && mousePosition.x <= rows[currentRow].pegs[i].x + radius ) {
				alert("Peg # " + i);
			}
		}
	}

}