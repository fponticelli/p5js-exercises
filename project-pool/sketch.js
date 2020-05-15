function metersToPx(meters) {
  return Math.round(meters * 220);
}

function inchesToPx(inches) {
  return metersToPx((inches * 2.54) / 100);
}

function feetToPx(feet, inches = 0) {
  return inchesToPx(feet * 12 + inches);
}

let table = {
  width: inchesToPx(59),
  height: inchesToPx(103),
};

let tableToRoomDistance = feetToPx(1); // 3' 5"

let playArea = {
  width: inchesToPx(44),
  height: inchesToPx(88),
};

let room = {
  width: table.width + tableToRoomDistance * 2,
  height: table.height + tableToRoomDistance * 2,
};

playArea.x = (room.width - playArea.width) / 2;
playArea.y = (room.height - playArea.height) / 2;

let bumperSize = inchesToPx(1.25);

let pockets = [
  {
    x: playArea.x,
    y: playArea.y,
  },
  {
    x: playArea.x + playArea.width,
    y: playArea.y,
  },
  {
    x: playArea.x,
    y: playArea.y + playArea.height,
  },
  {
    x: playArea.x + playArea.width,
    y: playArea.y + playArea.height,
  },
  {
    x: playArea.x,
    y: playArea.y + playArea.height / 2,
  },
  {
    x: playArea.x + playArea.width,
    y: playArea.y + playArea.height / 2,
  },
];

let balls;

let pocketDiameter = inchesToPx(4 + 5 / 8);

let ballDiameter = inchesToPx(4); // inchesToPx(2 + 1 / 4);
let ballRadius = ballDiameter / 2;

let ballLabelFontSize = inchesToPx(1 + 1 / 2);
let ballLabelDiameter = inchesToPx(2 + 1 / 4);

let cueStickLength = inchesToPx(56);

let attrition = 0.95;
let bounceAttrition = 0.9;
let minVelocity2 = 1;

let maxVelocity = metersToPx(11.6); // m/s
let maxStickPull = inchesToPx(25);

let styles;

function setup() {
  colorMode(HSB);
  styles = {
    table: () => {
      noStroke();
      fill(26, 68, 66);
    },
    green: () => {
      noStroke();
      fill(118, 55, 72);
    },
    bumper: () => {
      noStroke();
      fill(118, 45, 60);
    },
    pocket: () => {
      noStroke();
      fill(118, 5, 10);
    },
    background: () => {
      return color(36, 10, 85);
    },
    ball: (color) => {
      noStroke();
      fill(color);
    },
    ballHighlight: () => {
      fill(0, 0, 95, 0.6);
    },
    ballLabelBackground: () => {
      noStroke();
      fill(0, 0, 100);
    },
    ballLabelText: () => {
      noStroke();
      textSize(ballLabelFontSize);
      textAlign(CENTER, CENTER);
      fill(30);
    },
    stick: () => {
      stroke(20, 70, 90);
      strokeWeight(5);
    },
  };

  let cv = createCanvas(room.width, room.height);
  balls = initBalls();
  cv.mouseClicked(() => {
    if (!isMoving(balls[0])) {
      hit(balls[0]);
    }
  });
}

function draw() {
  background(styles.background());
  drawTable();
  drawBalls();
  if (!isMoving(balls[0])) {
    drawStick(balls[0]);
  }
  updatePositions();
  bounceBallsOnWalls();
  applyBallsCollisions();
  checkHoles();
}

function drawBumper() {
  styles.bumper();
  rect(
    playArea.x - bumperSize,
    playArea.y - bumperSize,
    playArea.width + bumperSize * 2,
    playArea.height + bumperSize * 2
  );
}

function drawGreen() {
  styles.green();
  rect(playArea.x, playArea.y, playArea.width, playArea.height);
}

function drawTableFrame() {
  styles.table();
  rect(
    tableToRoomDistance,
    tableToRoomDistance,
    table.width,
    table.height,
    inchesToPx(6)
  );
}

function drawPockets() {
  styles.pocket();
  for (let i = 0; i < pockets.length; i++) {
    circle(pockets[i].x, pockets[i].y, pocketDiameter);
  }
}

function drawTable() {
  drawTableFrame();
  drawBumper();
  drawGreen();
  drawPockets();
}

function initBalls() {
  colorMode(HSB);
  let cx = playArea.x + playArea.width / 2;
  let cy = playArea.y + (playArea.height * 3) / 4;

  let dx = playArea.x + playArea.width / 2;
  let dy = playArea.y + playArea.height / 4;

  let white = color(0, 0, 100);
  let yellow = color(50, 90, 95);
  let red = color(10, 90, 95);
  let green = color(145, 90, 95);
  let orange = color(35, 90, 95);
  let blue = color(240, 90, 95);
  let purple = color(335, 90, 95);
  let magenta = color(280, 90, 95);
  let black = color(0, 10, 30);

  let angle = (30 / 180) * Math.PI;
  let dist = 1.1;

  let row1x = Math.sin(angle) * ballDiameter * dist;
  let row1y = Math.cos(angle) * ballDiameter * dist;
  let row2y = row1y + Math.cos(angle) * ballDiameter * dist;
  let row3y = row2y + Math.cos(angle) * ballDiameter * dist;
  let row4y = row3y + Math.cos(angle) * ballDiameter * dist;
  return [
    { x: cx, y: cy, vx: 0, vy: 0, color: white },
    { x: dx, y: dy, vx: 0, vy: 0, number: 1, color: yellow },
    { x: dx + row1x, y: dy - row1y, vx: 0, vy: 0, number: 3, color: red },
    { x: dx - row1x, y: dy - row1y, vx: 0, vy: 0, number: 11, color: red },
    {
      x: dx + ballDiameter * dist,
      y: dy - row2y,
      vx: 0,
      vy: 0,
      number: 14,
      color: green,
    },
    {
      x: dx,
      y: dy - row2y,
      vx: 0,
      vy: 0,
      number: 8,
      color: black,
    },
    {
      x: dx - ballDiameter * dist,
      y: dy - row2y,
      vx: 0,
      vy: 0,
      number: 7,
      color: green,
    },

    {
      x: dx + row1x + ballDiameter * dist,
      y: dy - row3y,
      vx: 0,
      vy: 0,
      number: 9,
      color: yellow,
    },
    { x: dx + row1x, y: dy - row3y, vx: 0, vy: 0, number: 4, color: magenta },
    {
      x: dx - row1x,
      y: dy - row3y,
      vx: 0,
      vy: 0,
      number: 15,
      color: purple,
    },
    {
      x: dx - row1x - ballDiameter * dist,
      y: dy - row3y,
      vx: 0,
      vy: 0,
      number: 13,
      color: orange,
    },

    {
      x: dx + ballDiameter * dist * 2,
      y: dy - row4y,
      vx: 0,
      vy: 0,
      number: 12,
      color: magenta,
    },
    {
      x: dx + ballDiameter * dist,
      y: dy - row4y,
      vx: 0,
      vy: 0,
      number: 5,
      color: orange,
    },
    { x: dx, y: dy - row4y, vx: 0, vy: 0, number: 10, color: blue },
    {
      x: dx - ballDiameter * dist,
      y: dy - row4y,
      vx: 0,
      vy: 0,
      number: 2,
      color: blue,
    },
    {
      x: dx - ballDiameter * dist * 2,
      y: dy - row4y,
      vx: 0,
      vy: 0,
      number: 7,
      color: purple,
    },
  ];
}

function drawBall(x, y, color) {
  styles.ball(color);
  circle(x, y, ballDiameter);
  styles.ballHighlight();
  let factor = 0.15;
  circle(x - ballDiameter * factor, y - ballDiameter * factor, ballRadius);
}

function drawAnyBall(x, y, color, number) {
  drawBall(x, y, color);
  if (typeof number !== "undefined") {
    styles.ballLabelBackground();
    circle(x, y, ballLabelDiameter);
    styles.ballLabelText();
    text(String(number), x, y);
  }
}

function drawBalls() {
  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];
    drawAnyBall(ball.x, ball.y, ball.color, ball.number);
  }
}

function drawStick(ballPosition) {
  styles.stick();
  let ex = mouseX - ballPosition.x;
  let ey = mouseY - ballPosition.y;
  // let d = Math.min(maxVelocity, Math.sqrt(ex * ex + ey * ey))
  let a = Math.atan2(ey, ex);
  line(
    mouseX,
    mouseY,
    mouseX + Math.cos(a) * cueStickLength,
    mouseY + Math.sin(a) * cueStickLength
  );
}

function hit(ball) {
  let ex = mouseX - ball.x;
  let ey = mouseY - ball.y;
  let d = Math.min(Math.sqrt(ex * ex + ey * ey), maxStickPull);
  let a = Math.atan2(ey, ex);
  let v = (d / maxStickPull) * maxVelocity;
  ball.vx = -Math.cos(a) * v;
  ball.vy = -Math.sin(a) * v;
}

function applyVelocity(ball) {
  let mul = deltaTime / 1000;
  ball.x += ball.vx * mul;
  ball.y += ball.vy * mul;
  ball.vx *= attrition;
  ball.vy *= attrition;
  let v = ball.vx * ball.vx + ball.vy * ball.vy;
  if (v < minVelocity2) {
    ball.vx = 0;
    ball.vy = 0;
  }
}

function updatePositions() {
  balls.forEach(applyVelocity);
}

function bounceBall(ball) {
  if (ball.x < playArea.x) {
    ball.x = playArea.x;
    ball.vx = -bounceAttrition * ball.vx;
  } else if (ball.x > playArea.x + playArea.width) {
    ball.x = playArea.x + playArea.width;
    ball.vx = -bounceAttrition * ball.vx;
  }

  if (ball.y < playArea.y) {
    ball.y = playArea.y;
    ball.vy = -bounceAttrition * ball.vy;
  } else if (ball.y > playArea.y + playArea.height) {
    ball.y = playArea.y + playArea.height;
    ball.vy = -bounceAttrition * ball.vy;
  }
}

function bounceBallsOnWalls() {
  balls.forEach(bounceBall);
}

function testCollision(a, r1, b, r2) {
  let dx = a.x - b.x;
  let dy = a.y - b.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  return distance <= r1 + r2;
}

// https://en.wikipedia.org/wiki/Elastic_collision
function applyBallsCollision(a, b) {
  let tvx = b.y - a.y;
  let tvy = -(b.x - a.x);
  let td = Math.sqrt(tvx * tvx + tvy * tvy);
  tvx /= td;
  tvy /= td;

  let rvx = a.vx - b.vx;
  let rvy = a.vy - b.vy;

  let dp = tvx * rvx + tvy * rvy;

  let vcOnTangentX = tvx * dp;
  let vcOnTangentY = tvy * dp;

  let vcPerpendicularToTangentX = rvx - vcOnTangentX;
  let vcPerpendicularToTangentY = rvy - vcOnTangentY;

  a.vx -= vcPerpendicularToTangentX;
  a.vy -= vcPerpendicularToTangentY;

  b.vx += vcPerpendicularToTangentX;
  b.vy += vcPerpendicularToTangentY;

  let d = Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
  let d2 = (ballDiameter - d) / 0.51;

  a.x -= d2 * tvx;
  a.y -= d2 * tvy;

  b.x += d2 * tvx;
  b.y += d2 * tvy;
}

function applyOneToManyBallsCollisions(target, rest) {
  for (let other of rest) {
    if (testCollision(target, ballRadius, other, ballRadius)) {
      applyBallsCollision(target, other);
    }
  }
}

function applyBallsCollisions() {
  for (let i = 0; i < balls.length - 1; i++) {
    applyOneToManyBallsCollisions(balls[i], balls.slice(i + 1));
  }
}

function arrayRemove(arr, item) {
  let i = arr.indexOf(item);
  if (i >= 0) {
    arr.splice(i, 1);
  }
}

function checkHole(ball) {
  for (let pocket of pockets) {
    if (
      testCollision(pocket, pocketDiameter / 2, ball, ballLabelDiameter / 2)
    ) {
      arrayRemove(balls, ball);
      return;
    }
  }
}

function checkHoles() {
  // not checking the white ball on purpose
  for (let i = 1; i < balls.length; i++) {
    checkHole(balls[i]);
  }
}

function isMoving(ball) {
  return ball.vx !== 0 || ball.vy !== 0;
}
