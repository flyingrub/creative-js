var circleNumber = 100;
var branch = 32;
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
    var currentPosRadius = radius * currentOffset / circles;
    var x = sin(angle) * (currentPosRadius);
    var y = cos(angle) * (currentPosRadius);
    var circleRadius =  log(1 + currentOffset * currentOffset);
    var posNoise = createVector(noise(i/5, angle, 10)*2-1, noise(i/5, angle, 10)*2-1).mult(5);
    var pos = createVector(x,y).add(middle).add(posNoise);
    drawCircle(circleRadius, 40, pos);
  }
}

function drawCircle(radius, points, center) {
  beginShape();
  for (var i = 0; i < points; i++) {
    var n = noise(i/10, center.x, center.y);
    var globalRadiusNoise = noise(center.x, center.y)*2-1 * 10;
    var x = sin(i / points * 2 * PI) * (radius + n * 0 * radius + globalRadiusNoise);
    var y = cos(i / points * 2 * PI) * (radius + n * 0 * radius + globalRadiusNoise);
    curveVertex(center.x + x, center.y + y);
  }

  endShape(CLOSE);
}