
/*var x=10;
const c = document.getElementById("JocTrenulDiliu");
const ctx = c.getContext("2d");

function Tot(){
ctx.fillStyle= "red";
ctx.fillRect(x, 20, 20, 10);
ctx.fillRect(x, 40, 20, 10);
ctx.fillRect(x, 60, 20, 10);
ctx.fillRect(x, 80, 20, 10);
}
function Move()
{
    ctx.clearRect(0, 0, c.width, c.height);
    x+=10;
    Tot();

}

window.onload = function() {
    Tot();
};*/
            var x = 10;
            const c = document.getElementById("JocTrenulDiliu");
            const ctx = c.getContext("2d");
    
            function Tot(){
                ctx.fillStyle = "red";
                ctx.fillRect(x, 20, 20, 10);
                ctx.fillRect(x, 40, 20, 10);
                ctx.fillRect(x, 60, 20, 10);
                ctx.fillRect(x, 80, 20, 10);
            }
    
            function Move() {
                ctx.clearRect(0, 0, c.width, c.height); // Clear canvas
                x += 10; // Move to the right
                Tot(); // Redraw at new position
            }
    
            // Ensure canvas draws after page loads
            window.onload = function() {
                Tot();
            };
