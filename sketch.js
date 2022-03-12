let increment = 0.01;
let phi = 0;

//switching trough each animation
let current = -1;
let swt = true;
let switcher = [
  heart,
  rand,
  squareish_wave,
  square,
  triangle_wave,
  gear,
  flower,
  flower_round,
  multigon,
  heart,
];

function rand(val) {
  return map(noise(val), 0, 1, 100, 300);
}

function squareish_wave() {
  return map(abs(sin(2 * phi + HALF_PI)) * -1, -1, 0, 150, 190);
}

//draw n thoothed gear (square wave function)
function gear(n) {
  let t = phi % TWO_PI;
  return map(Math.sign(cos(n * t)), -1, 1, 150, 200);
}

function heart() {
  let a = sin(phi - HALF_PI);
  return (asin(a) + HALF_PI) * 50 - a * 60;
}

function triangle_wave() {
  return map(0.4 * asin(sin((2 / 0.1) * phi)), -1, 1, 100, 150);
}

function sawtooth() {
  let amp = 0.2; //0 to 1 is best
  let per = PI * 0.2; //0 to 1 is best (*PI)
  let alpha = (PI * phi) / per;
  return map(-((2 * amp) / PI) * atan(cos(alpha) / sin(alpha)), 0, 1, 100, 200);
}

function flower(n) {
  return map(asin(cos(phi * n)), -1, 1, 100, 200);
}

function flower_round(n) {
  return map(abs(sin(phi * (n / 2))), -1, 1, 100, 200);
}

function star(n) {
  return map(abs(sin(phi * (n / 2))) * -1, -1, 1, 100, 200);
}

function squareish() {
  return map(cos(phi) + sin(phi), -300, 300, 100, 200);
  //return map(abs(cos(2*phi)/2)*(-1), -0.5, 0, 130, 200);
}

// this could also just return ngon(4) but this does way less math…
// and i had this function prior to writing the ngon function.
function square() {
  let x = Math.floor(phi * (2 / PI) - 0.5);
  return 150 / sin(phi - x * HALF_PI);
}

function ngon(n, size = 150) {
  //a is the inner angle of the ngon
  let a = TWO_PI / n;
  //x is the int of the area in which the scanline is
  let x = Math.floor((phi - 0.5 * (PI - a) - HALF_PI) * (n / TWO_PI));
  // calculate the distance of the side to center.
  // How it is done:
  // size is the distance at the closest point of side to center
  // it is devided by the sinus of the angle between scanline and to side
  //   this calculates the length of the hypotenuse
  // phi is the current angle of scanline
  return size / sin(phi - x * a - HALF_PI);
}

let multigon_count = 2;
let inc = false;
function multigon() {
  if (phi < increment) {
    if (multigon_count < 12) swt = false; //prevent switcher from incrementing
    if (inc) {
      multigon_count = (multigon_count + 1) % 13;
      inc = false;
    } else {
      inc = true;
    }
  }
  return ngon(multigon_count, (size = multigon_count < 4 ? 100 : 150));
}

let max; //max length of lines array
function setup() {
  createCanvas(600, 600);
  max = TWO_PI / increment;
}

let x = 0;
let y = 0;
let lines = [];
let a = 0;
function draw() {
  if (phi < increment) {
    if (swt) {
      swt = false;
      current = (current + 1) % switcher.length;
    } else {
      swt = true;
    }
  }
  background(20, 120, 20);
  translate(width / 2, height / 2);
  rotate(-HALF_PI); // rotates the Canvas so 0 is top center
  //textSize(20);
  //text(current, 0, 0);
  noFill();
  //draw the screen cross and distance circles
  stroke(0, 0, 0, 100);
  line(0, -300, 0, 300);
  line(-300, 0, 300, 0);
  circle(0, 0, 100);
  circle(0, 0, 200);
  circle(0, 0, 300); //this should only be visible if css is changed

  //draw scanline
  stroke(255);
  let v = p5.Vector.fromAngle(phi, 300);
  line(0, 0, v.x, v.y);

  //draw plot
  stroke(50, 255, 50);
  let r = switcher[current](8); //use any of the above functions
  v = p5.Vector.fromAngle(phi, r);
  let d = map(noise(sin(a), cos(a)), 0, 1, 0, 25);
  let v2 = p5.Vector.fromAngle(phi, r + d);
  lines.push([x, y, v.x, v.y]);
  lines.push([v.x, v.y, v2.x, v2.y]);
  while (lines.length > 2 * max) {
    lines.shift();
  }
  let sat = 255 / lines.length;
  for (let l in lines) {
    stroke(50, 255, 50, l * sat);
    let [x1, x2, x3, x4] = lines[l];
    line(x1, x2, x3, x4);
  }

  //increment for next iteration of draw loop
  phi = (phi + increment) % TWO_PI;
  a += increment * 5; //only for the sin/cos in noise
  x = v.x;
  y = v.y;
}
