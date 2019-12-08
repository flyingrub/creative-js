var polygonNumber = 50;
var polygonSize = 10;
var radius = 300;
var noiseAmount = 100;
var polygons = []
var offset = 50;
var center;
var isSmallEnough = false;

function setup() {
    createCanvas(1200, 1200);
    center = createVector(600, 600);
    polygonSize = random(3, 10);
    //noLoop();
    background(0)
    noFill();
    strokeWeight(2)
    stroke(255);
}

function draw() {
    background(0);
    isSmallEnough = false;
    polygons = []
    drawFirstPolygon();
    for (var i = 0; i<polygonNumber; i++){
        if (isSmallEnough) return;
        drawNextPolygon();
    }
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
    var previousIndex = index == 0 ? polygon.length - 1 : index - 1;
    return [ polygon[index], polygon[previousIndex] ];
}


function drawNextPolygon() {
    var currentOffset = polygons.length-1;
    var lastPolygon = polygons[currentOffset];
    var currentPolygon = [];
    beginShape();
    for (var i = 0; i < lastPolygon.length; i++) {
        var line = getLineForIndex(lastPolygon, i);
        var lineLenght = p5.Vector.dist(line[0], line[1]);
        isSmallEnough = isSmallEnough || lineLenght < 2;
        var vector = line[0].copy();
        vector.sub(line[1]);
        vector.normalize();
        var v = line[0].copy();
        var offsetLength = offset * noise(i*10, frameCount * 0.01);
        offsetLength = wrap(offsetLength, lineLenght);
        v.sub(vector.mult(offsetLength));
        currentPolygon.push(v);
        vertex(v.x, v.y);
    }
    polygons.push(currentPolygon);
    endShape(CLOSE);
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


function drawFirstPolygon() {
    beginShape();
    var polygon = [];
    for (var i = 0; i < polygonSize; i++) {
        var n = noise(i*10, frameCount * 0.01);
        var p = circleCoordinate(i, polygonSize, radius + n * noiseAmount);
        var v = createVector(center.x + p.x, center.y + p.y);
        polygon.push(v.copy());
        vertex(v.x, v.y);
    }
    polygons.push(polygon);
    endShape(CLOSE);
}