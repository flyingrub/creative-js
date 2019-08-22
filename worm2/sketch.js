var circleNumber = 100;
var branch = 30;
var middle;
function setup() {
  createCanvas(windowWidth, windowHeight);
  middle = createVector(width / 2, height / 2);
  noLoop();
}

function draw() {
  background(255);
  for (var i = 0; i < branch; i++) {
    var angle =  i / branch * 2 * PI;
    drawBranch( angle, circleNumber, 400 ) 
  }
}

function drawBranch(angle, circles, radius) {
  for (var i = 0; i < circles; i++) {
    var n = noise(i, angle);
    var currentOffset = circles - i;
    var currentRadius = radius * currentOffset / circles;
    var x = sin(angle) * (currentRadius);
    var y = cos(angle) * (currentRadius);
    var circleRadius =  log(1 + i / circles  * 100);
    var circleNoise = 2;
    drawCircle(circleRadius, 40, circleNoise, createVector(x,y).add(middle));
  }
}

function drawCircle(radius, points, noiseAmount, center) {
  beginShape();
  for (var i = 0; i < points; i++) {
    var n = noise(i / 10, center.x, center.y);
    var x = sin(i / points * 2 * PI) * (radius + n * noiseAmount * radius);
    var y = cos(i / points * 2 * PI) * (radius + n * noiseAmount * radius);
    curveVertex(center.x + x, center.y + y);
  }

  endShape(CLOSE);
}