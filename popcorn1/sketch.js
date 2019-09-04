var middle;
var lineCount = 1;
var t=0.2;
function setup() {
  frameRate(30);
  background(0);
  createCanvas(windowWidth, windowHeight);
  middle = createVector(width / 2, height / 2);
  //noFill();
  stroke(255, 255, 255, 180);
}

function draw() {
  //background(0,0,0,20);
  translate(width/2, height/2);

  for (var i = 0; i < lineCount; i++) {
    line(x1(t+i),y1(t+i),x2(t+i),y2(t+i));
  }
  t +=2;;
}

function x1(t) {
  return sin(t/100) * 100 + sin(t/60)*100;
}

function y1(t) {
  return sin(t/30) * 100 + cos(t/80) * 200;
}


function x2(t) {
  return sin(t/200) * 100 + sin(t/60)*200;
}

function y2(t) {
  return sin(t/40) * 100 + cos(t/100) * 20;
}