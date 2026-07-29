const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: canvas.width / 2,
    y: canvas.height - 120,
    width: 40,
    height: 40,
    speed: 8
};

let dragging = false;

canvas.addEventListener("pointerdown", () => dragging = true);
canvas.addEventListener("pointerup", () => dragging = false);

canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;

    player.x = e.clientX;

    if (player.x < 20) player.x = 20;
    if (player.x > canvas.width - 20)
        player.x = canvas.width - 20;
});

function drawPlayer(){
    ctx.fillStyle = "#2E8B57";
    ctx.fillRect(
        player.x - player.width/2,
        player.y,
        player.width,
        player.height
    );
}

function update(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawPlayer();

    requestAnimationFrame(update);
}

update();