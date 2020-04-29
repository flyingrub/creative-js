var margin = 15;
var linesAmount = 1000;
var maxLineStripNumber = 10;
var lineSizeRange = { min: 20, max: 50 };
var allowedAngles = [ 90, -90 ];
var noiseAmount = 0;
var lines = [];
var currentColor;
var center;

function setup() {
    setupSeed();
    angleMode(DEGREES);
    var canvasSize = min(window.innerHeight, window.innerWidth);
    createCanvas(canvasSize, canvasSize);
    center = createVector(width/2, height/2);
    noLoop();
    noFill();
}

function draw() {
    background(0);
    lines = []
    for (var i = 0; i < linesAmount; i++){
        createNewLine();
    }
    drawAllLines();
}

function drawAllLines() {
    strokeWeight(2);
    var i = 0;
    //rotate(10);
    for (line of lines) {
        i++;
        currentColor = 255;//* i / lines.length * 2;
        stroke(currentColor);
        beginShape();
        for (point of line) {
            vertex(point.x, point.y);
        }
        endShape();
        drawRandomLineEnding(getFirstLine(line));
        //stroke(255,0,0)
        drawRandomLineEnding(getLastLine(line));
    }
}

function drawLine(l) {
    beginShape();
    for (point of l) {
        vertex(point.x, point.y);
    }
    endShape();
}

function drawPlainCircle(line) {
    var vector = getVectorFromLine(line);
    vector.mult(2.5);
    var p = line[1].copy().add(vector);
    fill(currentColor);
    circle(p.x, p.y, 5);
    noFill();
}

function drawCircleOutine(line) {
    var vector = getVectorFromLine(line);
    vector.mult(2.5);
    var p = line[1].copy().add(vector);
    circle(p.x, p.y, 5);
}

function drawStraightEnd(line) {
    var vector = getVectorFromLine(line);
    vector.rotate(90);
    vector.mult(2.5);
    var p1 = line[1].copy().add(vector);
    var p2 = line[1].copy().sub(vector);
    drawLine([ p1.copy(), p2.copy() ]);
}

function drawRandomLineEnding(line) {
    var possibleEnd = [ drawPlainCircle, drawCircleOutine, drawStraightEnd ];
    var r = random(possibleEnd);
    r(line);
}

function circleCoordinate(offset, total, radius) {
    var x = sin(offset / total * TAU) * radius;
    var y = cos(offset / total * TAU) * radius;
    return createVector(x, y);
}

function circularNoise(offset, total, radius) {
    var p = circleCoordinate(offset, total, radius);
    return noise(p.x, p.y);
}

function getLineForIndex(line, index)
{
    var previousIndex = getPreviousIndex(line, index);
    return [ line[index], line[previousIndex] ];
}

function getPreviousIndex(line, index) {
    return index == 0 ? line.length - 1 : index - 1;
}

function getNextIndex(line, index) {
    return (index == line.length - 1) ? 0 : index + 1;
}

function getLastLine(line){
    var firstIndex = line.length - 2;
    var secondIndex = line.length - 1;
    return [ line[firstIndex].copy(), line[secondIndex].copy() ];
}

function getFirstLine(line){
    var firstIndex = 0;
    var secondIndex = 1;
    return [ line[secondIndex].copy(), line[firstIndex].copy() ];
}

function getVectorFromLine(line) {
    var vector = line[1].copy();
    vector.sub(line[0]);
    vector.normalize();
    return vector.copy();
}

function floor10(number) {
    return Math.floor(number/10) * 10;
}

function getRandomPointOnLine(line) {
    var lineLenght = line[0].dist(line[1]);
    var vector = getVectorFromLine(line);
    var offsetLength = random(margin, lineLenght-margin);
    if (offsetLength > lineLenght) {
        offsetLength = lineLenght / 2;
    }

    var firstOffset = offsetLength - lineWidth / 2;
    var secondOffset = offsetLength + lineWidth / 2;

    var v1 = line[0].copy();
    v1.add(vector.copy().mult(firstOffset));
    var v2 = line[0].copy();
    v2.add(vector.copy().mult(secondOffset));
    return [v1.copy(), v2.copy()];
}

function lineEquals(line1, line2) {
    return line1[0].equals(line2[0]) && line1[1].equals(line2[1]);
}

function getTwoRandomIndex(max) {
    var randomIndexNumber = floor(random(0, max));
    var randomIndexNumber2;
    do {
        randomIndexNumber2 = floor(random(0, max));
    } while (randomIndexNumber == randomIndexNumber2);
    if (randomIndexNumber > randomIndexNumber2) {
        var temp = randomIndexNumber;
        randomIndexNumber = randomIndexNumber2;
        randomIndexNumber2 = temp;
    }
    return [randomIndexNumber, randomIndexNumber2];
}

function getRandomPointOnCanvas() {
    var x = random(width);
    var y = random(height);
    var v = createVector(floor10(x), floor10(y));
    if (isTooCloseToOtherLine(v))
        return getRandomPointOnCanvas();
    return v.copy();
}

function isTooCloseToOtherLine(point)
{
    var maxDist = maxLineStripNumber * lineSizeRange.max;
    for (var j = 0; j < lines.length; j++) {
        var line = lines[j];
        for (var i = 1; i < line.length; i++) {
            var currentSegment = [ line[i-1].copy(), line[i].copy() ];
            var dist = distance(point, currentSegment);
            if (dist > maxDist) { 
                // Fail Fast if line is too far anyway
                break;
            }
            if (dist < margin) {
                return true;
            }
        }
    }
    return false;
}

function distance(point, line) {
    var x = point.x;
    var y = point.y;
    var x1 = line[0].x;
    var x2 = line[1].x;
    var y1 = line[0].y;
    var y2 = line[1].y;
    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;
  
    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq != 0) //in case of 0 length line
        param = dot / len_sq;
  
    var xx, yy;
  
    if (param < 0) {
      xx = x1;
      yy = y1;
    }
    else if (param > 1) {
      xx = x2;
      yy = y2;
    }
    else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
  
    var dx = x - xx;
    var dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

function doLineSegmentsIntersect(line1, line2) {
    var p = line1[0];
    var p2 = line1[1];
    var q = line2[0];
    var q2 = line2[1];
	var r = p5.Vector.sub(p2, p);
	var s = p5.Vector.sub(q2, q);

	var uNumerator = p5.Vector.cross(p5.Vector.sub(q, p), r);
	var denominator = p5.Vector.cross(r, s);

	if (uNumerator == 0 && denominator == 0) {
		// They are coLlinear
		
		// Do they touch? (Are any of the points equal?)
		if (p.equals(q) || p.equals(q2) || p2.equals(q) || p2.equals(q2)) {
			return true
		}
		// Do they overlap? (Are all the point differences in either direction the same sign)
		return !(
                (q.x - p.x < 0) ==
				(q.x - p2.x < 0) ==
				(q2.x - p.x < 0) ==
				(q2.x - p2.x < 0)) ||
			!(
				(q.y - p.y < 0) ==
				(q.y - p2.y < 0) ==
				(q2.y - p.y < 0) ==
				(q2.y - p2.y < 0));
	}

	if (denominator == 0) {
		// lines are paralell
		return false;
	}

	var u = uNumerator / denominator;
	var t = p5.Vector.cross(p5.Vector.sub(q, p), s) / denominator;

	return (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1);
}

function checkIfIntersectOtherLine(segment) {
    var maxDist = maxLineStripNumber * lineSizeRange.max;
    for (var j = 0; j < lines.length; j++) {
        var line = lines[j];
        for (var i = 0; i < line.length; i++) {
            if (j == lines.length - 1 && i == line.length - 1)
            {
                // Do not test the current segment against itself
                return false;
            }
            var dist = distance(line[i].copy(), segment);
            if (dist > maxDist) {
                // Fail Fast if line is too far anyway
                break;
            }
            if (dist < margin) {
                return true;
            }
            if (i == 0) continue;
            var currentSegment = [ line[i-1].copy(), line[i].copy() ];
            var res = doLineSegmentsIntersect(currentSegment, segment)
            if (res) {
                return true;
            }
        }
    }
    return false;
}

function getNextPoint(line) {
    var vector = getVectorFromLine(line);
    vector.rotate(random(allowedAngles));
    var lenght = random(lineSizeRange.min, lineSizeRange.max);
    lenght = floor10(lenght);
    var nextPoint = line[1].copy();
    nextPoint.add(vector.copy().mult(lenght));

    // Check if intersect
    var safeNextPoint = nextPoint.copy();
    safeNextPoint.add(vector.copy().mult(margin));
    var intersection = checkIfIntersectOtherLine([ line[1].copy(), safeNextPoint.copy() ]);
    if (intersection) {
        return false;
    }

    return nextPoint.copy();
}

function createNewLine() {
    var line = [];
    var lineNumber = random(maxLineStripNumber);
    var firstVector = getRandomPointOnCanvas();
    line.push(firstVector.copy());
    var imaginaryOrigin = firstVector.copy().sub(1,0);
    if (random() > .5)
        var imaginaryOrigin = firstVector.copy().sub(0, 1);
    var secondVector = getNextPoint([imaginaryOrigin.copy(), line[0].copy()]);
    if (!secondVector) return;
    lines.push(line);
    lines[lines.length-1].push(secondVector.copy());
    for (var i = 0; i < maxLineStripNumber; i++) {
        var v = getNextPoint([line[i].copy(), line[i+1].copy()]);
        if (!v) break;
        lines[lines.length-1].push(v.copy());
    }
}