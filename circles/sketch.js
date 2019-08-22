var framesNumber = 450;
var circleNumber = 15;
var circlePoint = 100;
var circleTime;
var middle;
var audioData;

function setup() {
  frameRate(30);
  createCanvas(800, 800);
  middle = createVector(width / 2, height / 2);
  //record();
  noFill();
}

function draw() {
  circleTime = frameCount / framesNumber * TAU;
  background(0);
  stroke(255, 255, 255, 180);
  for (var i = 0; i < circleNumber; i++) {
    drawCircle(200, circlePoint, middle, i);
  }
  audioData = audio.analyse();
  //shouldEndRecord();
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

function drawCircle(radius, points, center, offset) {
  var noiseAmount = 50;
  beginShape();
  for (var i = 0; i < points; i++) {
    var pNoise = circleCoordinate(i, points, 3);
    var xNoise = sin(millis()/5000) * pNoise.x + offset / 20;
    var yNoise = cos(millis()/5000) * pNoise.y + offset / 20;
    var circularTimeNoise = circularNoise(frameCount, framesNumber, 1);
    var n = noise(xNoise, yNoise, circularTimeNoise);
    var p = circleCoordinate(i, points, radius + n * noiseAmount);
    curveVertex(center.x + p.x, center.y + p.y);
  }

  endShape(CLOSE);
}