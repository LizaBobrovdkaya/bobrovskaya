let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

canvas.width = 256
canvas.height = 512

let bird = new Image()
bird.src = "img/bird.png"

let back = new Image()
back.src = "img/back.png"

let road = new Image()
road.src = "img/road.png"

let pipeUp = new Image()
pipeUp.src = "img/pipeUp.png"

let pipeDown = new Image()
pipeDown.src = "img/pipeBottom.png"

let fly_audio = new Audio()
fly_audio.src = "audio/fly.mp3"

let score_audio = new Audio()
score_audio.src = "audio/score.mp3"

let score_text = document.getElementById("score")
let best_score_text = document.getElementById("best_score");

let xPos = 10
let yPos = 150
let velY = 0
let gravity = 0.1
let gap = 110;
let pipe = []
let score = 0
let best_score = 0;
let pause = false

pipe[0] = {
	x: canvas.width,
	y: 0
}


function draw() {
    if (!pause) {
        ctx.drawImage(back, 0, 0)
        ctx.drawImage(bird, xPos, yPos)
        ctx.drawImage(road, 0, canvas.height - road.height)

        if (canvas.height - road.height <= yPos || yPos < 0) {
            reload()
        }

        velY = velY + gravity /*velY += gravity */
        yPos = yPos + velY /*yPos += velY */

        for (let i = 0; i < pipe.length; i++) {
            if (pipe[i].x < -pipeUp.width) {
                pipe.shift();
            } else {   
                ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
                ctx.drawImage(pipeDown, pipe[i].x, pipe[i].y + pipeUp.height + gap);

                pipe[i].x -= 2;

                if (pipe[i].x == 80) {
                    pipe.push({ 
                        x : canvas.width, 
                        y : Math.floor(Math.random() * pipeUp.height) - pipeUp.height
                    });
                }
            }
            if (xPos + bird.width >= pipe[i].x && 
                xPos <= pipe[i].x + pipeUp.width && 
                (yPos <= pipe[i].y + pipeUp.height || 
                yPos + bird.height >= pipe[i].y + pipeUp.height + gap)) {
                reload()
            }
        
            if (pipe[i].x == 0) {
                score_audio.play();
                score++
            }

        }
        score_text.innerHTML = "Score: " + score
        best_score_text.innerHTML = "BEST SCORE: " + best_score;
    } else {
        ctx.drawImage(back, 0, 0)
        ctx.drawImage(bird, xPos, yPos)
        ctx.drawImage(road, 0, canvas.height - road.height);
        for (let i = 0; i < pipe.length; i++) {
			ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
			ctx.drawImage(pipeDown, pipe[i].x, pipe[i].y + pipeUp.height + gap);
		}
		
		ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

    }
}

setInterval(draw, 20)

document.addEventListener("keydown", function(event){
    if (event.code == "KeyW") {
        moveUp()
    }
})

function moveUp() {
    velY -= 4 
    fly_audio.play()
}

function reload() {
    if (score > best_score) {
		best_score = score;
	}

    xPos = 10
    yPos = 150
    velY = 0
    pipe = []
    score = 0
    pipe[0] = {
        x: canvas.width,
        y: 0
    }
}

function game_pause() {
	pause = !pause;
}

document.addEventListener("keydown", function(event){
    if (event.code == "KeyP") {
        game_pause()
    }
})
