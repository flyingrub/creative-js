var splitNumber = 5;
var polygonSize = 4;
var margin = 50;
var lineWidth = 20;
var radius = 300;
var noiseAmount = 0;
var polygons = []
var center;

function setup() {
    setupSeed();
    createCanvas(1200, 1200);
    center = createVector(600, 600);
    polygonSize = 4;
    noLoop();
    noFill();
}

function draw() {
    background(0);
    polygons = []
    createFirstPolygon();
    for (var i = 0; i<splitNumber; i++){
        randomSplitPolygon();
    }
    drawAllPolygons();
}

function drawAllPolygons() {
    strokeWeight(2)
    stroke(255);
    for (polygon of polygons) {
        beginShape();
        for (point of polygon) {
            vertex(point.x, point.y);
        }
        endShape(CLOSE);
    }
}

function drawLine(l) {
    line(l[0].x, l[0].y, l[1].x, l[1].y);
}

function drawPoint(p) {
    circle(p.x, p.y, 20);
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

function getLineForIndex(polygon, index)
{
    var previousIndex = getPreviousIndex(polygon, index);
    return [ polygon[index], polygon[previousIndex] ];
}

function getPreviousIndex(polygon, index) {
    return index == 0 ? polygon.length - 1 : index - 1;
}

function getNextIndex(polygon, index) {
    return (index == polygon.length - 1) ? 0 : index + 1;
}

function getVectorFromLine(line) {
    var vector = line[1].copy();
    vector.sub(line[0]);
    vector.normalize();
    return vector.copy();
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

function randomSplitPolygon() {
    var randomOffset = floor(random(0, polygons.length));
    var currentPolygon = polygons[randomOffset].slice();
    polygons.splice(randomOffset, 1);

    var rIndex = getTwoRandomIndex(currentPolygon.length);
    var line = getLineForIndex(currentPolygon, rIndex[0]);
    var line2 = getLineForIndex(currentPolygon, rIndex[1]);
    var p = getRandomPointOnLine(line);
    var p2 = getRandomPointOnLine(line2);

    var newPolygon1 = currentPolygon.slice(0, rIndex[0]);
    newPolygon1.push(p[1].copy());
    newPolygon1.push(p2[0].copy());
    newPolygon1 = newPolygon1.concat(currentPolygon.slice(rIndex[1], currentPolygon.length));
    
    var newPolygon2 = [];
    newPolygon2.push(p[0].copy());
    newPolygon2 = newPolygon2.concat(currentPolygon.slice(rIndex[0], rIndex[1]));
    newPolygon2.push(p2[1].copy());
    polygons.push(newPolygon1);
    polygons.push(newPolygon2);


    // Debug
    console.log(rIndex);
    // strokeWeight(1)
    // stroke(255,0,0);
    // drawLine(line);
    // drawLine(line2);
    // drawPoint(p);
    // drawPoint(p2);
}

function wrap(x, max) {
    //console.log(x, max)
    if (max < 2) return max;
    if (x > max) {
        return wrap(x / max, max);
    } else {
        return x;
    }
}


function createFirstPolygon() {
    var polygon = [];
    for (var i = 0; i < polygonSize; i++) {
        var n = noise(i*10, frameCount * 0.01);
        var p = circleCoordinate(i, polygonSize, radius + n * noiseAmount);
        var v = createVector(center.x + p.x, center.y + p.y);
        polygon.push(v.copy());
    }
    polygons.push(polygon);
}