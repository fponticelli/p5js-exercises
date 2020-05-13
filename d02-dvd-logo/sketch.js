let x;
let xVelocity = 5;
let y;
let yVelocity = 5;

function setup() {
  createCanvas(800, 600);
  // We only want to load the logo once.
  dvdImage = loadImage(
    "https://cdn.glitch.com/eaea72a4-ac6d-4777-b76e-f37d75959aa5%2Fdvd.jpeg?1515761833387"
  );

  x = 50;
  y = 50;
}

function draw() {
  background(220);
  // Draw the logo at the new position.

  if (x > 600 || x < 0) {
    xVelocity = -xVelocity;
  }

  if (y > 450 || y < 0) {
    yVelocity = -yVelocity;
  }

  x += xVelocity;
  y += yVelocity;

  image(dvdImage, x, y, 200, 150);
}
