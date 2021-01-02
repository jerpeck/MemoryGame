document.addEventListener('DOMContentLoaded', addListeners());
let solution = [];
let guessIndex = 0
function addListeners(){
    d3.selectAll('.button')
        .on(
            'mouseover', function(){
                d3.select(this)
                    .style("cursor", "pointer");
            })
        .on(
            'mouseout', function(){
                d3.select(this)
                    .style("cursor", "default");
            })
        .on(
            'mousedown', function(){
                d3.select(this)
                    .style('opacity', '100%')
                playTone(this.id);
            })
        .on(
            'mouseup', function(){
                d3.select(this)
                    .style('opacity', '50%')
                stopTone();
            })
    d3.select('#start')
        .on(
            'mousedown', function(){
                d3.select(this)
                    .style('background-color', 'white')
            })
        .on(
            'mouseup', function(){
                d3.select(this)
                    .style('background-color', '#444');
                startGame();
            })
}

function removeListeners(){
    d3.selectAll('.button')
        .on(
            'mouseover', null
            )
        .on(
            'mouseout', null
            )
        .on(
            'mousedown', null
            )
        .on(
            'mouseup', null
            )
    d3.select('#start')
        .on(
            'mousedown', null
            )
        .on(
            'mouseup', null
            )

}

function startGame(){
    solution = [];
    guessIndex = 0;
    // console.log('game started')
    removeListeners();
    // add to solution
    addToSolution();
    // play solution
    playSolution();
    // wait for turn
}

function addToSolution(){
    let colors = {
        1: 'blue',
        2: 'red',
        3: 'yellow',
        4: 'green'
    }
    let val = Math.ceil(Math.random() * 4);
    solution.push(colors[val]);
}

function playSolution(){
    let num = 0;
    let lightOn = false
    let playInterval = setInterval(function(){
        if(lightOn === false){
            d3.select(`#${solution[num]}`)
                .style('opacity', '100%');
            playTone(solution[num])
            lightOn = true;
        } else {
            d3.select(`#${solution[num]}`)
                .style('opacity', '50%');
            stopTone();
            lightOn = false;
            num++
            if(num === solution.length){
                clearInterval(playInterval);
                waitForPlayer();
            }
        }
    }, 250)
}

function waitForPlayer(){
    addListeners();
    d3.selectAll('.color')
        .on('mouseup', function (){
            d3.select(this)
                    .style('opacity', '50%')
            stopTone();
            checkIfCorrect(this.id);
        })
}

function checkIfCorrect(color){
    if(color === solution[guessIndex]){
        guessIndex++
        if(guessIndex === solution.length){
            removeListeners();
            guessIndex = 0;
            addToSolution();
            playSolution();
        }
    } else {
        gameOver(color);
    }
}

function gameOver(color){
    removeListeners();
    solution = [];
    guessIndex = 0;
    d3.select('h1')
        .text('Game Over');
    d3.select(`#${color}`)
        .style('opacity', '100%');
    playTone('fail');
    setTimeout(function(){
        d3.select('h1')
            .text('New Game');
        d3.select(`#${color}`)
            .style('opacity', '50%');
        stopTone();    
        addListeners();        
    }, 2000)
}

let context = '';
let o = '';
let g = '';
let f = '';

function playTone(color){
    context = new AudioContext()
    o = context.createOscillator()
    g = context.createGain();
    let notes = {
        'red': 659.3,
        'green': 880,
        'blue': 440,
        'yellow': 523.3,
        'fail': 73.42
    }
    f = notes[color];
    o.frequency.value = f;
    o.type = "sawtooth";
    o.connect(g);
    g.connect(context.destination);
    o.start();
}

function stopTone(time){
    g.gain.exponentialRampToValueAtTime(
        0.00001, context.currentTime + 0.04
    )
    o.stop(time);
}