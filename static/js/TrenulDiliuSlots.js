var ctx; 
ctx.fillStyle = "green";
var canvas;

var MelcCotaMare=
    { width: 100, height: 50, x: 100, y: 100 };
var MelcCotaMedie=
    { width: 100, height: 50, x: 100, y: 70 };
var MelcCotaMedie=
    { width: 100, height: 50, x: 100, y: 130 };
var MelcCotaMedie=
    { width: 100, height: 50, x: 100, y: 190 };

function init() {
    canvas = document.getElementById("JocTrenulDiliu");
    if (!canvas) {
        console.error("Canvasul nu a fost găsit!");
        return;
    }
    ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("Contextul 2D nu poate fi creat!");
        return;
    }
    console.log("Canvas și context inițializate cu succes.");
    draw();
}
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.fillStyle = "green";
        ctx.fillRect(MelcCotaMare.x, MelcCotaMare.y, MelcCotaMare.width, MelcCotaMare.height);
    };