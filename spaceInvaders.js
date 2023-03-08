/* 





             - if there no invaders left game over


      - if laser hits an invader, stop moving laser, stop drawing that invader


*/

const grid = document.querySelector('.grid')
let direction = 1
const width = 15
let currentShooterPosition = 202
let invadersInterval
let goingRight = true
let isAlive = true
let invadersRemoved = []
const scoreDisplay = document.querySelector('.result')
let score = 0

for(let i = 0; i < 225; i++){
    grid.appendChild(document.createElement('div'))
}

const squares = Array.from(document.querySelectorAll('.grid div'))
const invaders = [0,1,2,3,4,5,6,7,8,9,15,16,17,18,19,20,21,22,23,24,30,31,32,33,34,35,36,37,38,39]

function drawInvaders(){
    for(let i = 0; i < invaders.length; i++){
        if(!invadersRemoved.includes(i)){
            squares[invaders[i]].classList.add('invader')
        }  
    }
}

function removeInvaders() {
    for(let i = 0; i < invaders.length; i++){
        squares[invaders[i]].classList.remove('invader')
    }
}

drawInvaders()
squares[currentShooterPosition].classList.add('shooter')

function moveShooter(e){
    squares[currentShooterPosition].classList.remove('shooter')
    switch(e.key){
        case 'ArrowLeft':
            if(!(currentShooterPosition == 195) && isAlive) currentShooterPosition -= 1
            break
        case 'ArrowRight':
            if(!(currentShooterPosition == 209) && isAlive) currentShooterPosition += 1
            break
    }
    squares[currentShooterPosition].classList.add('shooter')
}
document.addEventListener('keydown', moveShooter)

function moveInvaders() {
    const rightEdge = invaders[invaders.length - 1] % width == width - 1
    const leftEdge = invaders[0] % width == 0
    
    removeInvaders()
    
    if(rightEdge && goingRight) {
        for(let i = 0; i < invaders.length; i++){
            invaders[i] += width + 1;
        }
        direction = -1
        goingRight = false
    }

    if(leftEdge && !goingRight) {
        for(let i = 0; i < invaders.length; i++){
            invaders[i] += width - 1;
        }
        direction = 1
        goingRight = true
    }
    
    for(let i = 0; i < invaders.length; i++){
        invaders[i] += direction;
    }

    drawInvaders()
    gameOver()
}



function laser(e) {
    let laserID
    let currentLaserPosition = currentShooterPosition
    function moveLaser() {
        
        if(currentLaserPosition > 14){
            if(squares[currentLaserPosition].classList.contains('invader')){
                clearInterval(laserID)
                squares[currentLaserPosition].classList.remove('laser')
                squares[currentLaserPosition].classList.remove('invader')
                squares[currentLaserPosition].classList.add('boom')
                setTimeout(()=> squares[currentLaserPosition].classList.remove('boom'), 300)

                const removedIndex = invaders.indexOf(currentLaserPosition)
                invadersRemoved.push(removedIndex)
                score++
                scoreDisplay.innerHTML = score
                console.log(invadersRemoved.sort())
            } else {
                squares[currentLaserPosition].classList.remove('laser')
                currentLaserPosition -= width
                squares[currentLaserPosition].classList.add('laser')
            }     
        } else {
            clearInterval(laserID)
            squares[currentLaserPosition].classList.remove('laser')
        }
        
    }
    switch(e.key) {
        case 'ArrowUp':
        laserID = setInterval(moveLaser, 100)
      }

}
document.addEventListener('keydown', laser)

function gameOver() {

    //invaders touch bottom
    for(let i = 0; i < invaders.length; i++){
        isInvaded = invaders[i] > 209;
        if(isInvaded){
            console.log('Invaded')
            clearInterval(invadersInterval)
        }
    }
    
    //invaders touch shooter
    for(let i = 0; i < invaders.length; i++){
        if(squares[invaders[i]].classList.contains('invader') && squares[invaders[i]].classList.contains('shooter') ){
            isAlive = false
            scoreDisplay.innerHTML = "YOU LOSE!"
            clearInterval(invadersInterval)      
        }
    }

    //shooter killed all invaders
    if(invadersRemoved.length === invaders.length) {
        clearInterval(invadersInterval)
        scoreDisplay.innerHTML += " YOU WIN!!!"
        console.log(invadersRemoved.sort())
    }
}
invadersInterval = setInterval(moveInvaders, 500)