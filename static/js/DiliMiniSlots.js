const ICONS = [
  'miner', 'mighty_miner', 'slot_machine', 'mining', 'strip_mining', 'dwarf', 'lucky_seven',
];

/**
* @type {number} The minimum spin time in seconds
*/
const BASE_SPINNING_DURATION = 2.7;

/**
* @type {number} The additional duration to the base duration for each row (in seconds).
* It makes the typical effect that the first reel ends, then the second, and so on...
*/
const COLUMN_SPINNING_DURATION = 0.3;


var cols;


window.addEventListener('DOMContentLoaded', function(event) {
  cols = document.querySelectorAll('.col');

  setInitialItems();
});

function setInitialItems() {
  let baseItemAmount = 40;

  for (let i = 0; i < cols.length; ++i) {
      let col = cols[i];
      let amountOfItems = baseItemAmount + (i * 3); // Increment the amount for each column
      let elms = '';
      let firstThreeElms = '';

      for (let x = 0; x < amountOfItems; x++) {
          let icon = getRandomIcon();
          let item = '<div class="icon" data-item="' + icon + '"><img src="static/images/' + icon + '.png"></div>';
          elms += item;

          if (x < 3) firstThreeElms += item; // Backup the first three items because the last three must be the same
      }
      col.innerHTML = elms + firstThreeElms;
  }
}

/**
* Called when the start-button is pressed.
*
* @param elem The button itself
*/
function spin(elem) {
  let duration = BASE_SPINNING_DURATION + randomDuration();

  for (let col of cols) { // set the animation duration for each column
      duration += COLUMN_SPINNING_DURATION + randomDuration();
      col.style.animationDuration = duration + "s";
  }

  // disable the start-button
  elem.setAttribute('disabled', true);

  // set the spinning class so the css animation starts to play
  document.getElementById('container').classList.add('spinning');

  // set the result delayed
  // this would be the right place to request the combination from the server
  let win = getRandomInt(100);
  window.setTimeout(setResult(win), BASE_SPINNING_DURATION * 1000 / 2);

  window.setTimeout(function () {
      // after the spinning is done, remove the class and enable the button again
      document.getElementById('container').classList.remove('spinning');
      elem.removeAttribute('disabled');
  }.bind(elem), duration * 1000);
}

/**
* Sets the result items at the beginning and the end of the columns
*/
function setResult(win) {
  for (let col of cols) {
    let icons = col.querySelectorAll('.icon img');
    let div5 = ((win % 5) == 0)? true : false;
    let div3 = ((win % 3) == 0)? true : false;
    let div2 = ((win % 2) == 0)? true : false;
    let winnerSymbol = 0;
    if(win == 7){
        winnerSymbol = ICONS[6];
    } 
    else if(div5 && div3 && !div2 && win > 60){
      winnerSymbol = ICONS[5];
    }
    else if(div5 && !div3 && div2 && win > 50){
      winnerSymbol = ICONS[4];
    }
    else if(!div5 && div3 && div2 && win < 40){
      winnerSymbol = ICONS[3];
    }
    else if(!div5 && !div3 && !div2 && win < 30){
      winnerSymbol = ICONS[2];
    }
    else if(!div5 && !div3 && !div2 && win > 70){
      winnerSymbol = ICONS[1];
    }
    else if(!div5 && !div3 && div2 && win < 20){
      winnerSymbol = ICONS[0];
    }
    if(winnerSymbol != 0){
      let symbol1 = getRandomIcon()
      while(symbol1 == winnerSymbol)
        symbol1 = getRandomIcon();
      let symbol2 = getRandomIcon()
      while(symbol2 == winnerSymbol)
        symbol2 = getRandomIcon();
      results = [
        symbol1,
        winnerSymbol,
        symbol2
      ];
    }else{ 
        // generate 3 random items
        results = [ 
          getRandomIcon(),
          getRandomIcon(),
          getRandomIcon()
        ]; 
      }
      // replace the first and last three items of each column with the generated items
      for (let x = 0; x < 3; x++) {
          icons[x].setAttribute('src', 'static/images/' + results[x] + '.png');
          icons[(icons.length - 3) + x].setAttribute('src', 'static/images/' + results[x] + '.png');
      }
    }
}

function getRandomIcon() {
  return ICONS[Math.floor(Math.random() * ICONS.length)];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

/**
* @returns {number} 0.00 to 0.09 inclusive
*/
function randomDuration() {
  return Math.floor(Math.random() * 10) / 100;
}
