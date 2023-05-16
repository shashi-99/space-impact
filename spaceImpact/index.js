
const canvas =  document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("keypress", keyPressHandler);


let planeX = 15;
let planeY = canvas.height / 2;
let planeRadius = 12;
let planeBorder = 3;
let startAngle = Math.PI/2;
let endAngle = 2*Math.PI;


let plane_dx = 2;
let plane_dy = 2;


let bullets = [];
let bullet_dx = 4;
let bulletLength = 5;


let rightPressed = false;
let leftPressed = false;
let spacePressed = false;
let upPressed = false;
let downPressed = false;
let gameRunning = false;


let rockRadius = 8;


let rocks= [];
let rockSize = 100;
let rocksNum = 5;

let rock_dx = 2;
let rock_dy = -2;


let score = 0;

function render(){

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlane();
  drawScore();

  if(gameRunning){
    keyHandler();
    createRock(); 
    if(spacePressed)
    load_bullet();
    fired_bullet();
    collisionDetection();
  }  
}
function collisionDetection() {

  for (let i = 0; i < rocks.length; i++) {

    if(isRockCollidingPlane(i)){

      alert("GAME OVER");
      document.location.reload();
      gameRunning = false;
      clearInterval(myInterval);

    }
  }
  bulletHittingRock();
}
function bulletHittingRock(){
  for (let j = 0; j < bullets.length; j++) {
    for(let k=0;k < rocks.length; k++){
      
      if (bullets[j].x + bulletLength > (rocks[k].x - rockRadius) && bullets[j].y > (rocks[k].y -       rockRadius) && bullets[j].y < (rocks[k].y +  rockRadius)) {
        score++;
        rocks.splice(k,1);
        bullets.splice(j,1);

        if(score === rockSize){
          alert("Congrats ,You Win !");
          document.location.reload();
          gameRunning = false;
          clearInterval(myInterval);
        }
        
      }
    }
  }
}
function isRockCollidingPlane(i) {
  return ( rocks[i].x  < (planeX + planeRadius + planeBorder) && rocks[i].x  > (planeX - planeBorder)&& rocks[i].y  < (planeY + planeRadius + planeBorder) && rocks[i].y  > planeY - (planeRadius + planeBorder ));
}

function drawPlane(){

  ctx.beginPath();
  ctx.arc(planeX,planeY,planeRadius,(3*Math.PI/2) ,Math.PI/2);
  
  ctx.closePath();
  ctx.strokeStyle = 'red';
  ctx.lineWidth = planeBorder;
  ctx.stroke();
}

function createRock() {
  let min_x = canvas.width - 5;
  let max_x = canvas.width + 5;

  if (rocks.length < rocksNum) {
    let rockX = Math.floor(Math.random() * (max_x - min_x)) + min_x;
    let rockY = Math.floor(Math.random() * canvas.height);
    rocks.push({ x: rockX, y: rockY });
    drawRock(rockX, rockY);
  }
  moveRock();
}

function drawRock(x, y){
  ctx.beginPath();
  ctx.arc(x, y, rockRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
}

function moveRock(){
  for (let i = 0; i < rocks.length; i++) {
   
    if((rocks[i].y < rockRadius) || rocks[i].y > (canvas.height - rockRadius)){
      
      rock_dy = -rock_dy;
    }
    if ((rocks[i].x +  rockRadius) < 0) {  //delete rock if it  out from canvas
      rocks.splice(i, 1);
    }
    
    rocks[i].x -= rock_dx;
    rocks[i].y += rock_dy;
    drawRock(rocks[i].x, rocks[i].y)
    
  }
}

function drawBullet(x, y){

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 5, y);
  ctx.strokeStyle = "red";
  ctx.stroke();
} 

function load_bullet(){
  let bulletX = planeX + planeRadius;
  let bulletY = planeY;
  // drawBullet(bulletX, bulletY);
  bullets.push({ x: bulletX, y: bulletY });
  spacePressed = false;
}

function fired_bullet(){
  for (let i = 0; i < bullets.length; i++) {
    drawBullet(bullets[i].x, bullets[i].y)
    bullets[i].x += bullet_dx;
    if(bullets[i].x > canvas.width){
      bullets.splice(i,1);
      // continue;
    }
  }
}

function drawScore()
{
  ctx.font = "20px Arial";
  ctx.fillStyle = "red";
  ctx.fillText(`Score: ${score}`,10,15);
}

function keyHandler(){
  if (rightPressed && (planeX + planeRadius < canvas.width)) {
    planeX += plane_dx;
  }
  else if (leftPressed &&  (planeX > 0)) {
    planeX -= plane_dx;
  }
  else if(upPressed && (planeY - planeRadius > 0)){
    planeY -= plane_dy;
  }
  else if(downPressed && (planeY + planeRadius < canvas.height)){
    planeY += plane_dy;
   
  }
}
function keyDownHandler(e){

  switch(e.key){
    case "ArrowRight":
      rightPressed = true;
      break;
    case "ArrowLeft":
      leftPressed = true;
      break;
    case "ArrowUp":
      upPressed = true;
      break;
    case "ArrowDown":
      downPressed = true;
      break;
    default:
      break;
  }
}

function keyUpHandler(e){
  switch(e.key){
    case "ArrowRight":
      rightPressed = false;
      break;
    case "ArrowLeft":
      leftPressed = false;
      break;
    case "ArrowUp":
      upPressed = false;
      break;
    case "ArrowDown":
      downPressed = false;
      break;
    default:
      break;
  }
}

function keyPressHandler(e){
 
  if (e.key === " ") {
    spacePressed = true;
  }else if (e.key != undefined){
    gameRunning = true;
  }
}
let myInterval = setInterval(render, 90);

