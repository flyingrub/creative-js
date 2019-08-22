var totalCircles = 10;
var totalBranches = 100;
var middle;
var radius = 500;
var sepAngle;

autoResize();

function setup() {
  createCanvas(windowWidth, windowHeight);
  middle = createVector(width / 2, height / 2);
  sepAngle = .5 / totalBranches * TAU;
  noLoop();
}

function draw() {
  background(255);
  for (var i = 0; i < totalBranches; i++) {
    drawBranch(i, 0, 10)
  }
}

function circleCoordinate(offset, total, radius, center = createVector(0,0)) {
  var x = sin(offset / total * TAU) * radius;
  var y = cos(offset / total * TAU) * radius;
  return createVector(center.x + x, center.y + y);
}

function circularNoise(offset, total, radius, center = createVector(0,0)) {
  var p = circleCoordinate(offset, total, radius, center);
  return noise(p.x, p.y);
}

function drawBranch(branchOffset, circleOffset, circleRadius, newAngle = -1) {
  if (newAngle != -1) {
    smoothness = 0.95;
    angle = angle * smoothness + newAngle * (1 - smoothness);
  }
  circleRadius *= 0.9;
  var i = circleOffset;
  var currentOffset = totalCircles - i;
  var currentPosRadius = radius * currentOffset / totalCircles;
  var p = circleCoordinate(branchOffset, totalBranches, currentPosRadius);
  var posNoise = circularNoise(branchOffset, totalBranches, 1) * 2 - 1;
  var pos = p.add(middle).add(posNoise, posNoise);
  drawCircle(circleRadius, 30, pos);

  var prob = random(1);
  if (false && prob < 0.01) {
    drawBranch(angle, i + 1, circleRadius, angle + sepAngle);
    drawBranch(angle, i + 1, circleRadius, angle - sepAngle);
  } else if (i < totalCircles) {
    drawBranch(branchOffset, i + 1, circleRadius, newAngle);
  }
}

function drawCircle(radius, points, center) {
  beginShape();
  for (var i = 0; i < points; i++) {
    var pointNoise = circularNoise(i, points, 1, center);
    var globalRadiusNoise = noise(center.x / 50, center.y / 50) * 2 - 1;
    var currentRadius = radius + pointNoise * radius + globalRadiusNoise * radius;
    var p = circleCoordinate(i, points, currentRadius, center);
    curveVertex(p.x, p.y);
  }

  endShape(CLOSE);
}