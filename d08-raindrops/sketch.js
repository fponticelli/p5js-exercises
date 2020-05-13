let drops = [];
let totalDrops = 500;

function setup() {
  createCanvas(500, 500);
  colorMode(HSB, 100);
  // This version of the constructor only takes one argument - the drop size (diameter)
  for (let i = 0; i < totalDrops; i++) {
    drops.push(new RainDrop(random(20)));
  }
}

function draw() {
  background(0, 0, 95);
  for (let i = 0; i < totalDrops; i++) {
    drops[i].drip();
    drops[i].show();
  }
}

class RainDrop {
  constructor(d) {
    this.x = random(width);
    this.y = random(height);
    this.d = d;
    this.fallSpeed = random(5, 10);
    this.hue = 50 + random(20);
  }

  show() {
    noStroke();
    fill(this.hue, 80, 80);
    ellipse(this.x, this.y, (this.d / 3) * 2, this.d);
  }

  drip() {
    this.y += this.fallSpeed;
    if (this.y >= height) {
      this.y = 0;
      this.x = random(width);
    }
  }
}
