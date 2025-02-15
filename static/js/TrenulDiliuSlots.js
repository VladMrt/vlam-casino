var Mi = 10;
var Me1 = 10;
var Me2 = 10;
var Ma = 10;
var alegere=0;
const c = document.getElementById("JocTrenulDiliu");
const ctx = c.getContext("2d");

const snailImg = new Image();
snailImg.src = "static/images/New Project (2).png";

const snailWidth = 34;
const snailHeight = 34;

snailImg.onload = function () {
    Tot();
};

function enableBetButton() {
    if (alegere !== 0) {
        document.getElementById("PariazaBtn").disabled = false;
        
    }
}

function Tubularu(){
    alegere=1;
    enableBetButton()
}

function Bombonel(){
    alegere=2;
    enableBetButton()
}

function Velo(){
    alegere=3;
    enableBetButton()
}

function LeSnail(){
    alegere=4;
    enableBetButton()
}

function Tot() {
    ctx.drawImage(snailImg, Mi, 5, snailWidth, snailHeight);
    ctx.drawImage(snailImg, Me1, 40, snailWidth, snailHeight);
    ctx.drawImage(snailImg, Me2, 70, snailWidth, snailHeight);
    ctx.drawImage(snailImg, Ma, 105, snailWidth, snailHeight);
}

function Pariaza() {
    setInterval(Move, 1);
}

function Move() {
    var x = Math.random() * 0.011;
    MoveMa(x);
    x = Math.random() * 1;
    MoveMe1(x);
    x = Math.random() * 0.01;
    MoveMi(x);
    x = Math.random() * 0.009;
    MoveMe2(x);
}
function MoveMi(x) {
    ctx.clearRect(0, 5, c.width, snailHeight);
    Mi += x;
    ctx.drawImage(snailImg, Mi, 5, snailWidth, snailHeight);
    if(Mi>=300) alert('Mi castigator');
}

function MoveMa(x) {
    ctx.clearRect(0, 105, c.width, snailHeight);
    Ma += x;
    ctx.drawImage(snailImg, Ma, 105, snailWidth, snailHeight);
    if(Ma>=300) alert('Ma castigator');
}

function MoveMe1(x) {
    ctx.clearRect(0, 40, c.width, snailHeight);
    Me1 += x;
    ctx.drawImage(snailImg, Me1, 40, snailWidth, snailHeight);
    if(Me1>=250){
        alert('Ma castigator');
    } 
}

function MoveMe2(x) {
    ctx.clearRect(0, 70, c.width, snailHeight);
    Me2 += x;
    ctx.drawImage(snailImg, Me2, 70, snailWidth, snailHeight);
    if(Me2>=300) alert('Ma castigator');
}

window.onload = function () {
    Tot();
};
