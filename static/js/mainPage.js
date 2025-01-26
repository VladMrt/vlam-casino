document.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("roulette-checkbox");
    const label = document.querySelector(".roulette-label");
    const rouletteList = document.querySelector(".roulette .roulette-list");

    // Add event listener to the label (button)
    label.addEventListener("click", () => {
        // Start the spinning by adding the 'running' animation state
        rouletteList.style.animationPlayState = "running";

        // Wait for 5 seconds and then stop the animation
        setTimeout(() => {
            rouletteList.style.animationPlayState = "paused"; 
        }, getRndInteger(1000,5000)); // 5000ms = 5 seconds
    });
});
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
