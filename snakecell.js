function Cell(row, col) {
	this.row = Math.floor(row);
	this.col = Math.floor(col);
	this.y = this.row * square;
	this.x = this.col * square;

	this.getCell = function(way) {
		switch (way) {
			case RIGHT:
				return new Cell(row, col + 1);
				break;
			case DOWN:
				return new Cell(row + 1, col);
				break;
			case LEFT:
				return new Cell(row, col - 1);
				break;
			case UP:
				return new Cell(row - 1, col);
				break;
		}
	}

	this.same = function(other) {
		return this.row == other.row && this.col == other.col;
	}

	this.outOfBounds = function() {
		return this.row >= rows ||
			   this.col >= cols ||
			   this.row < 0 || this.col < 0;
	}

	this.draw = function(neighborCells) {
		var neighborDirections = this.neighborDirections(neighborCells);
		c.fillStyle = "#FD0";

		var neighbors = [false, false, false, false];

		
		for (var i = 0; i < neighborCells.length; i++) {
			switch (neighborDirections[i]) {
				case UP:
					neighbors[UP] = true;
					break;
				case RIGHT:
					neighbors[RIGHT] = true;
					break;
				case DOWN:
					neighbors[DOWN] = true;
					break;
				case LEFT:
					neighbors[LEFT] = true;
					break;
			}
		}

		if (neighbors[UP] && neighbors[DOWN])
			return VERT;
		else if (neighbors[LEFT] && neighbors[RIGHT])
			return HORIZ;
		else if (neighbors[UP] && neighbors[RIGHT])
			return BOTLEFT;
		else if (neighbors[UP] && neighbors[LEFT])
			return BOTRIGHT;
		else if (neighbors[DOWN] && neighbors[RIGHT])
			return TOPLEFT;
		else if (neighbors[DOWN] && neighbors[LEFT])
			return TOPRIGHT;
		else if (neighbors[UP])
			return CAPBOTTOM;
		else if (neighbors[RIGHT])
			return CAPLEFT;
		else if (neighbors[DOWN])
			return CAPTOP;
		else if (neighbors[LEFT])
			return CAPRIGHT;
	}

	this.neighborDirections = function(neighborCells) {
		var directions = [];
		for (var i = 0; i < neighborCells.length; i++) {
			if (this.getCell(UP).same(neighborCells[i])) {
				directions[i] = UP;
			} else if (this.getCell(RIGHT).same(neighborCells[i])) {
				directions[i] = RIGHT;
			} else if (this.getCell(DOWN).same(neighborCells[i])) {
				directions[i] = DOWN;
			} else if (this.getCell(LEFT).same(neighborCells[i])) {
				directions[i] = LEFT;
			}
		}
		if (directions.length == 0)
			return [ALONE]
		else
			return directions;
	}
}