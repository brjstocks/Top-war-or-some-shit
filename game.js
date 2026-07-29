const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// -----------------------
// World
// -----------------------

let roadOffset = 0;
const roadSpeed = 6;

// -----------------------
// Leader
// -----------------------

const leader = {
    x: canvas.width / 2,
    y: canvas.height - 150,
    width: 32,
    height: 32
};

// -----------------------
// Squad
// -----------------------

const soldiers = [];

function createSquad(count) {
    soldiers.length = 0;

    for (let i = 0; i < count; i++) {
        soldiers.push({
            x: leader.x,
            y: leader.y + i * 40,
            targetX: leader.x,
            targetY: leader.y + i * 40
        });
    }
}

// -----------------------
// Bullets
// -----------------------

const bullets = [];
const bulletSpeed = 12;

let lastShot = 0;
const fireRate = 150; // milliseconds

function shoot() {

    bullets.push({
        x: leader.x,
        y: leader.y,
        radius: 5
    });

}

function updateBullets() {

    for (let i = bullets.length - 1; i >= 0; i--) {

        const b = bullets[i];

        b.y -= bulletSpeed;

        // Collision with wall
        if (
            b.x > wall.x - wall.width / 2 &&
            b.x < wall.x + wall.width / 2 &&
            b.y > wall.y &&
            b.y < wall.y + wall.height
        ) {

            wall.health--;

            bullets.splice(i, 1);

            continue;
        }

        if (b.y < -20)
            bullets.splice(i, 1);
    }

}

function drawBullets() {

    ctx.fillStyle = "yellow";

    bullets.forEach(b => {

        ctx.beginPath();

        ctx.arc(
            b.x,
            b.y,
            b.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

    });

}

// -----------------------
// Wall
// -----------------------

const wall = {
    x: canvas.width / 2,
    y: 150,
    width: 140,
    height: 60,
    health: 100
};

function drawWall() {

    if (wall.health <= 0)
        return;

    ctx.fillStyle = "#8B4513";

    ctx.fillRect(
        wall.x - wall.width / 2,
        wall.y,
        wall.width,
        wall.height
    );

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        wall.health,
        wall.x,
        wall.y - 10
    );

}

createSquad(5);

// -----------------------
// Controls
// -----------------------

let dragging = false;

canvas.addEventListener("pointerdown", () => dragging = true);
canvas.addEventListener("pointerup", () => dragging = false);

canvas.addEventListener("pointermove", e => {

    if (!dragging) return;

    leader.x = e.clientX;

    if (leader.x < 40) leader.x = 40;
    if (leader.x > canvas.width - 40)
        leader.x = canvas.width - 40;

});

// -----------------------
// Road
// -----------------------

function drawRoad() {

    ctx.fillStyle = "#666";
    ctx.fillRect(canvas.width/2-120,0,240,canvas.height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;

    for(let y=-40; y<canvas.height; y+=60){

        ctx.beginPath();

        ctx.moveTo(
            canvas.width/2,
            y + (roadOffset % 60)
        );

        ctx.lineTo(
            canvas.width/2,
            y+30 + (roadOffset % 60)
        );

        ctx.stroke();
    }
}

// -----------------------
// Update Squad
// -----------------------

function updateSquad(){

    soldiers[0].targetX = leader.x;
    soldiers[0].targetY = leader.y;

    for(let i=1;i<soldiers.length;i++){

        soldiers[i].targetX = soldiers[i-1].x;
        soldiers[i].targetY = soldiers[i-1].y + 40;

    }

    soldiers.forEach(s=>{

        s.x += (s.targetX-s.x)*0.18;
        s.y += (s.targetY-s.y)*0.18;

    });

}

// -----------------------
// Draw Squad
// -----------------------

function drawSquad(){

    ctx.fillStyle = "#0f0";

    soldiers.forEach(s=>{

        ctx.fillRect(
            s.x-12,
            s.y,
            24,
            24
        );

    });

}

// -----------------------
// Draw Leader
// -----------------------

function drawLeader(){

    ctx.fillStyle = "#2196F3";

    ctx.fillRect(
        leader.x-16,
        leader.y,
        32,
        32
    );

}

// -----------------------

function update() {

    roadOffset += roadSpeed;

    // Fire bullets every 150 ms
    const now = performance.now();

    if (now - lastShot > fireRate) {
        shoot();
        lastShot = now;
    }

    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawRoad();

    updateSquad();

    updateBullets();

    drawWall();

    drawBullets();

    drawSquad();

    drawLeader();

    requestAnimationFrame(update);

}

update();