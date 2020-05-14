function metersToPx(meters) {
  return Math.round(meters * 180);
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

let tableToRoomDistance = feetToPx(3, 5);

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

let ballLabelFontSize = inchesToPx(1 + 1 / 2);
let ballLabelDiameter = inchesToPx(2 + 1 / 4);

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
  };

  createCanvas(room.width, room.height);
  balls = initBalls();
}

function draw() {
  background(styles.background());
  drawTable();
  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];
    drawAnyBall(ball.x, ball.y, ball.color, ball.number);
  }
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

function drawpockets() {
  styles.pocket();
  for (let i = 0; i < pockets.length; i++) {
    circle(pockets[i].x, pockets[i].y, pocketDiameter);
  }
}

function drawTable() {
  drawTableFrame();
  drawBumper();
  drawGreen();
  drawpockets();
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
  circle(
    x - ballDiameter * factor,
    y - ballDiameter * factor,
    ballDiameter / 2
  );
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
