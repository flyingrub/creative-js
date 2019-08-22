var circleNumber = 100;
var branch = 40;
var middle;
var radius = 350;
var sepAngle;

function setup() {
  createCanvas(windowWidth, windowHeight);
  middle = createVector(width / 2, height / 2);
  sepAngle = .5 / branch * 2 * PI;
  noLoop();
}

function draw() {
  background(255);
  for (var i = 0; i < branch; i++) {
    var angle = i / branch * 2 * PI;
    drawBranch(angle, 0, 10)
  }
}

function drawBranch(angle, circleOffset, circleRadius, newAngle = -1) {
  if (newAngle != -1) {
    smoothness = 0.95;
    angle = angle * smoothness + newAngle * (1- smoothness);
  }
  circleRadius *= 0.9;
  var i = circleOffset; 
  var n = noise(i, angle);
  var currentOffset = circleNumber - i;
  var currentPosRadius = radius * currentOffset / circleNumber;
  var x = sin(angle) * (currentPosRadius);
  var y = cos(angle) * (currentPosRadius);
  var posNoise = createVector(noise(i / 5, angle, 10) * 2 - 1, noise(i / 5, angle, 10) * 2 - 1).mult(5);
  var pos = createVector(x, y).add(middle).add(posNoise);
  drawCircle(circleRadius, 40, pos);

  var prob = random(1);
  if (prob < 0.01) {
      drawBranch(angle, i+1, circleRadius, angle+sepAngle);
      drawBranch(angle, i+1, circleRadius, angle-sepAngle);
  } else if (i < circleNumber) {
    drawBranch(angle, i+1, circleRadius, newAngle);
  }
}

function drawCircle(radius, points, center) {
  beginShape();
  for (var i = 0; i < points; i++) {
    var pointNoise = noise(i / 20, center.x, center.y);
    var globalRadiusNoise = noise(center.x / 50, center.y / 50) * 2 - 1;
    var currentRadius = radius + pointNoise * radius + globalRadiusNoise * radius;
    var x = sin(i / points * 2 * PI) * currentRadius;
    var y = cos(i / points * 2 * PI) * currentRadius;
    curveVertex(center.x + x, center.y + y);
  }

  endShape(CLOSE);
}