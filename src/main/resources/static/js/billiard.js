let help = document.getElementById("help_button");
let hit = document.getElementById("hit_button");
let player = document.getElementById("player_change");
let elem = document.getElementById("myBar");
let mouseX = 9999, mouseY = 9999, distX, distY;
let nowdegree = 0;
let cursor_grab = "url(DATA URI), move";
let cursor_drag = "url(DATA URI), move";
let degreeToRadian = Math.PI / 180;
let canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d'),
    w = window.innerWidth,
    h = window.innerHeight,
    points = 4,
    colors = ['#feca28', '#f8f6ea', '#e51515', '#e51515'],
    balls = [],
    table,
    mouse = {
        down: false,
        button: 1,
        x: 0,
        y: 0,
        px: 0,
        py: 0
    },
    elasticity = .8,
    refreshHz = 60,
    velocityCutoff = 0.01,
    bounceLoss = .85,
    cue,
    tableFriction = 0.00003;
canvas.width = w;
canvas.height = h;
let power = 0;
xlocations = [810, 200, 810, 270];
ylocations = [190, 275, 275, 275];
nowPlayer = 0;
shootend = false;
let scoreinfo = [0, 0];


window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / refreshHz);
        };
})();

window.onload = function () {
    canvas.addEventListener('mousemove', updateCanvas, false);    //움직일때
    canvas.addEventListener('mousedown', startDrag, false); // 버튼을 누를때
    canvas.addEventListener('mouseup', stopDrag, false);  // 버튼을 놓을때

    // player.addEventListener('click', playerChange, false);
    hit.addEventListener('mousedown', startGauge, false);
    hit.addEventListener('mouseup', stopGauge, false);
    help.addEventListener('mousedown', help_alert, false);

    document.addEventListener("keydown", keyEvent1);
    document.addEventListener("keyup", keyEvent2);

    draw();
};

let Cue = function (ball) {
    this.x = ball.x + 60;
    this.y = ball.y + 60;
    this.degree = 0;
    this.mouse = false;
    this.drag = false;
    this.visible = true;
}

function draw_cue() {

    if (cue.visible) {
        ctx.clearRect(0, 0, w, h);
        table.draw();
        for (let i = 0; i < points; i++) {
            let temp = balls[i];
            temp.TestImpact();
            temp.Update(table);
            temp.draw(table);
        }

        let degree = cue.degree * degreeToRadian;
        let x1_start = cue.x + 40 * Math.cos(degree + degreeToRadian * 5);
        let x2_start = cue.x + 40 * Math.cos(degree - degreeToRadian * 5);
        let x3_start = cue.x + 50 * Math.cos(degree + degreeToRadian * 5);
        let x4_start = cue.x + 50 * Math.cos(degree - degreeToRadian * 5);
        let y1_start = cue.y + 40 * Math.sin(degree + degreeToRadian * 5);
        let y2_start = cue.y + 40 * Math.sin(degree - degreeToRadian * 5);
        let y3_start = cue.y + 50 * Math.sin(degree + degreeToRadian * 5);
        let y4_start = cue.y + 50 * Math.sin(degree - degreeToRadian * 5);


        ctx.beginPath();
        ctx.moveTo(x1_start, y1_start);
        ctx.lineTo(x2_start, y2_start);
        ctx.lineTo(x4_start, y4_start);
        ctx.lineTo(x3_start, y3_start);
        ctx.fillStyle = "#f8f6ea";
        ctx.fill();

        let x1_end = cue.x + 700 * Math.cos(degree + degreeToRadian * 0.6);
        let x2_end = cue.x + 700 * Math.cos(degree - degreeToRadian * 0.6);
        let y1_end = cue.y + 700 * Math.sin(degree + degreeToRadian * 0.6);
        let y2_end = cue.y + 700 * Math.sin(degree - degreeToRadian * 0.6);


        ctx.fillStyle = "#f6dfbd";
        ctx.beginPath();
        ctx.save();
        ctx.shadowOffsetX = 10;
        ctx.shadowOffsetY = 10;
        ctx.shadowColor = "rgba(0,0,0,.3)";
        ctx.shadowBlur = 5;
        ctx.moveTo(x1_start, y1_start);
        ctx.lineTo(x2_start, y2_start);
        ctx.lineTo(x2_end, y2_end);
        ctx.lineTo(x1_end, y1_end);
        ctx.isPointInPath(mouseX, mouseY) ? cue.mouse = true : cue.mouse = false;  //현재 경로에 포함되있는지 확인
        ctx.fill();

        let x1_middle = cue.x + 520 * Math.cos(degree + degreeToRadian * 0.6);
        let x2_middle = cue.x + 520 * Math.cos(degree - degreeToRadian * 0.6);
        let x3_middle = cue.x + 450 * Math.cos(degree);
        let x4_middle = cue.x + 680 * Math.cos(degree + degreeToRadian * 0.6);
        let x5_middle = cue.x + 680 * Math.cos(degree - degreeToRadian * 0.6);

        let y1_middle = cue.y + 520 * Math.sin(degree + degreeToRadian * 0.6);
        let y2_middle = cue.y + 520 * Math.sin(degree - degreeToRadian * 0.6);
        let y3_middle = cue.y + 450 * Math.sin(degree);
        let y4_middle = cue.y + 680 * Math.sin(degree + degreeToRadian * 0.6);
        let y5_middle = cue.y + 680 * Math.sin(degree - degreeToRadian * 0.6);

        ctx.fillStyle = "#1a1a18";

        ctx.beginPath();
        ctx.moveTo(x1_middle, y1_middle);
        ctx.lineTo(x3_middle, y3_middle);
        ctx.lineTo(x2_middle, y2_middle);
        ctx.lineTo(x5_middle, y5_middle);
        ctx.lineTo(x4_middle, y4_middle);
        ctx.fill();
        ctx.closePath();

        ctx.restore();
        draw_guide_1();

    }
}


let Table = function () {
    this.xPos = 60;
    this.yPos = 60;
    this.width = 1080;
    this.height = 550;
}


Table.prototype.draw = function () {
    let tw = this.width + 120;
    let th = this.height + 120;

    ctx.setLineDash([]);
    ctx.fillStyle = "#6a5746";
    ctx.fillRect(0, 0, tw, th);
    ctx.fillStyle = "#3456af";
    ctx.fillRect(45, 45, tw - 90, th - 90);
    ctx.fillStyle = "#4370d7";
    ctx.fillRect(60, 60, tw - 120, th - 120);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(60, 60);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(tw, 0);
    ctx.lineTo(tw - 60, 60);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(0, th);
    ctx.lineTo(60, th - 60);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(tw, th);
    ctx.lineTo(tw - 60, th - 60);
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = "#b0b0b0";

    for (let i = 1; i <= 7; i++) {
        ctx.beginPath();
//arc(중심점x, 중심점y, 반지름, 시작각도, 끝각도, 방향)
//true : 반시계 방향 , false : 시계 방향
        ctx.arc(60 + (tw - 120) / 8 * i, 30, 5, 0, Math.PI * 2, true);
        ctx.strokeStyle = "#0";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(60 + (tw - 120) / 8 * i, th - 30, 5, 0, Math.PI * 2, true);
        ctx.strokeStyle = "#0";
        ctx.fill();
        ctx.closePath();
    }

    for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(30, 60 + (th - 120) / 4 * i, 5, 0, Math.PI * 2, true);
        ctx.strokeStyle = "#0";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(tw - 30, 60 + (th - 120) / 4 * i, 5, 0, Math.PI * 2, true);
        ctx.strokeStyle = "#0";
        ctx.fill();
        ctx.closePath();
    }
}


let Ball = function (i) {
    this.r = 20;
    this.x = xlocations[i % points];
    this.y = ylocations[i % points];
    this.opacity = 1;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.xAccel = 0;
    this.yAccel = 0;
    this.bounceLoss = bounceLoss;
    this.tableFriction = tableFriction;
    this.c = colors[i % points];
    this.index = i;
    this.move = false;
    this.red1 = false;
    this.red2 = false;
    this.loss = false;
}

Ball.prototype.draw = function (table) {
    ctx.fillStyle = this.c;
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.save();
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 10;
    ctx.shadowColor = "rgba(0,0,0,.3)";
    ctx.shadowBlur = 5;
    ctx.arc(this.x + table.xPos,
        this.y + table.yPos,
        this.r, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
};

Ball.prototype.Update = function (table) {
    let dT = 1000 / refreshHz;
    this.xAccel = this.xVelocity * -this.tableFriction * dT;
    this.yAccel = this.yVelocity * -this.tableFriction * dT;
    this.yVelocity += this.yAccel * dT;
    this.xVelocity += this.xAccel * dT;
    this.y += this.yVelocity * dT;
    this.x += this.xVelocity * dT;

    let bounce = false;
    if (this.y >= table.height - this.r) // Ball at bottom edge
    {
        this.y = table.height - this.r;
        this.yVelocity = -this.yVelocity;
        this.yAccel = -this.yAccel;
        bounce = true;
    } else if (this.y <= this.r) // Ball at top edge
    {
        this.y = this.r;
        this.yVelocity = -this.yVelocity;
        this.yAccel = -this.yAccel;
        bounce = true;
    }

    if (this.x >= table.width - this.r) // Ball at right edge
    {
        // Make sure there is no overlap over the edge at all
        //  because x is probably past the edge by < velocity
        this.x = table.width - this.r;
        // "Bounce" it
        this.xVelocity = -this.xVelocity;
        this.xAccel = -this.xAccel;
        bounce = true;
    } else if (this.x <= this.r) // Ball at left edge
    {
        this.x = this.r;
        this.xVelocity = -this.xVelocity;
        this.xAccel = -this.xAccel;
        bounce = true;
    }

    // Update velocity
    if (bounce) {
        this.xVelocity *= this.bounceLoss;
        this.yVelocity *= this.bounceLoss;
    }

    if (Math.abs(this.xVelocity) + Math.abs(this.yVelocity) < velocityCutoff) {
        this.yVelocity = 0;
        this.yAccel = 0;
        this.xVelocity = 0;
        this.xAccel = 0;
    }

};

Ball.prototype.Strike = function (xImpact, yImpact) {
    this.xVelocity += xImpact;
    this.yVelocity += yImpact;
};

function CollideBalls(ball, ball2) {
    // 충돌 감지

    let lossball;
    //sound_collision.play();

    lossball = (nowPlayer + 1) % 2;

    if (ball === balls[nowPlayer]) {
        if (ball2 === balls[lossball])
            balls[nowPlayer].loss = true;
        if (ball2 === balls[2])
            balls[nowPlayer].red1 = true;
        if (ball2 === balls[3])
            balls[nowPlayer].red2 = true;
    }

    let Del = ball2.r + ball.r;
    let dX = ball2.x - ball.x;
    let dY = ball2.y - ball.y;
    let dVX = ball2.xVelocity - ball.xVelocity;
    let dVY = ball2.yVelocity - ball.yVelocity;
    let dSq = dX * dX + dY * dY;
    let alpha = (1 + elasticity) / 2 * (dX * dVX + dY * dVY) / dSq;


    ball.xVelocity += dX * alpha;
    ball.yVelocity += dY * alpha;
    ball2.xVelocity -= dX * alpha;
    ball2.yVelocity -= dY * alpha;

    let DDist = ((Del + 1) / Math.sqrt(dSq) - 1) / 2;
    ball.x -= dX * DDist;
    ball.y -= dY * DDist;
    ball2.x += dX * DDist;
    ball2.y += dY * DDist;

}

Ball.prototype.TestImpact = function () {
    for (let i = this.index + 1; i < points; i++) {
        let ball = balls[i];
        if (Dist(this.x, this.y, ball.x, ball.y) > this.r + ball.r) {
            continue;
        }
        CollideBalls(this, ball);
    }
}


function HitBall() {
    d_power = power * 0.75;

    let mouseDownX = cue.x - d_power * Math.cos(cue.degree * degreeToRadian);
    let mouseDownY = cue.y - d_power * Math.sin(cue.degree * degreeToRadian);

    let dX = mouseDownX - balls[nowPlayer].x - 60;
    let dY = mouseDownY - balls[nowPlayer].y - 60;
    shootend = true;
    balls[nowPlayer].Strike(dX / 50.0, dY / 50.0);
    sendShot(dX, dY);
}

function remoteHitBall() {
    shootend = true;
    balls[nowPlayer].Strike(remoteDx / 50.0, remoteDy / 50.0);
}

function Dist(x1, y1, x2, y2) {
    let diffX = x2 - x1;
    let diffY = y2 - y1;
    return Math.sqrt((diffX * diffX) + (diffY * diffY));
}


(function init() {

        for (let i = 0; i < points; i++) {
            balls.push(new Ball(i));
        }

        for (let i = this.index + 1; i < points; i++) {
            let ball = balls[i];
            if (Dist(this.x, this.y, ball.x, ball.y) > this.r + ball.r) {
                continue;
            }
        }

        table = new Table();
        cue = new Cue(balls[nowPlayer]);
    }
)();


function draw() {
    let stop = true;
    ctx.clearRect(0, 0, w, h);
    table.draw();
    for (let i = 0; i < points; i++) {
        let temp = balls[i];
        temp.TestImpact();
        temp.Update(table);
        temp.draw(table);
    }

    for (let i = 0; i < points; i++) {
        let temp = balls[i];
        stop = stop && (temp.xVelocity === 0 && temp.yVelocity === 0)
    }


    if (stop) {//공이 모두 멈췄을때
        cue.x = balls[nowPlayer].x + 60;
        cue.y = balls[nowPlayer].y + 60;
        cue.visible = true;
        hit.disabled = false;
        player.disabled = false;
        waite = true;
        stop = !stop;

        if (shootend) {
            getscore();
            shootend = false;
        }
    } else {// 공이 움직일때
        hit.disabled = true;
        player.disabled = true;
    }

    draw_cue();

    if (!cue.visible) {
        requestAnimFrame(draw);
    }
}
