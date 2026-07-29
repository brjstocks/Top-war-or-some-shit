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

function update(){

    roadOffset += roadSpeed;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawRoad();

    updateSquad();

    drawSquad();

    drawLeader();

    requestAnimationFrame(update);

}

update();