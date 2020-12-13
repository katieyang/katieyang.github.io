var button;
var eaten = false;
var s;
var f;
var dir;
var dirSet = false;
var gameStart = false;
var gameOver = false;
var musicIsPlaying = false;
var scl = 40;
var score = 0;

function preload() {
  song = loadSound('bensound-punky.mp3');
  gameOverSFX = loadSound('game-over.wav');
  eatingSFX = loadSound('eating.mp3');
  song.setVolume(0.05);
  apple = loadImage('apple.png');
}

function setup() {
  createCanvas(400, 400);
  s = new Snake();
  f = new Food();
  frameRate(5);
}

function draw() {
  background(51);
  if(gameOver){
    textSize(30);
    fill("red");
    textAlign(CENTER,CENTER);
    text("GAME OVER",width/2,height/2-30);
    fill("white");
    text("Score: " + score,width/2,height/2);
    button = createButton('Retry');
    button.size(50);
    button.position(width/2-25, height/2+30);
    button.mousePressed(restart);
    song.stop()
    musicIsPlaying = false;
  }else{
    if(!musicIsPlaying && gameStart){
      song.loop();
      musicIsPlaying = true;
    }
    s.checkIfEat(f)
    s.checkIfDead()
    s.update();
    if(eaten){
      eaten = false;
      f.update();
    }
    s.show();
    f.show();
    dirSet = false;
  }
  // Add instructions at start
  if(!gameStart){
    fill(150);
    rect(width/2-125,height/2-20,250,40);
    fill("white");
    textSize(15);
    textAlign(CENTER,CENTER)
    text("Use arrow keys to move the snake!",width/2,height/2);
  }
}

function keyPressed(){ //don't allow going backwards
  gameStart = true;
  if (keyCode === UP_ARROW && !dirSet){
    if(dir != "DOWN"){
      s.dir(0,-1);
      dir = "UP";
    }
  }
  else if (keyCode === DOWN_ARROW && !dirSet){
    if(dir != "UP"){
      s.dir(0,1);
      dir = "DOWN";
    }
  }
  else if (keyCode === RIGHT_ARROW && !dirSet){
    if(dir != "LEFT"){
      s.dir(1,0);
      dir = "RIGHT";
    }
  }
  else if (keyCode === LEFT_ARROW && !dirSet){
    if(dir != "RIGHT"){
      s.dir(-1,0);
      dir = "LEFT";
    }
  }
  // dirset will get reset when updated; this makes sure no more than one key press will register before snake is updated
  dirSet = true;
}

function Snake() {
  this.x = 0;
  this.y = 0;
  this.xspeed = 0;
  this.yspeed = 0;
  //create an array to store previous locations
  this.total = 1; //how many to store
  this.body = [];

  this.checkIfDead = function() {
    if(this.body.length == this.total && gameStart){
      for (i = 0; i < this.total; i++){
        if(this.x == this.body[i][0] && this.y == this.body[i][1]){
          gameOver = true;
          gameOverSFX.play();
        }
      }       
    }
  }
  
  this.checkIfEat = function(f){
    if (this.x === f.x && this.y === f.y) {
      eaten = true;
      score++;
      this.total++;
      eatingSFX.play();
    }
  }

  this.dir = function(x,y) {
    this.xspeed = x;
    this.yspeed = y;
  }
  
  this.update = function() {
    if(gameStart){
      //shift every location in body by one
      for (i = this.total - 1; i > 0; i--){
        this.body[i] = this.body[i-1];
      }
      // add current location to body
      this.body[0] = [this.x,this.y];
    }
    
    this.x = this.x + this.xspeed * scl;
    this.y = this.y + this.yspeed * scl;
    
    this.x = constrain(this.x, 0, width-scl);
    this.y = constrain(this.y, 0, height-scl);
  }
  
  this.show = function() {
    fill("green");
    if(gameStart){
      //show snake body
      for(i = 0; i < this.total; i++){
        rect(this.body[i][0], this.body[i][1], scl, scl);
      }
      //show snake eyes
      fill("black")
      if(dir == "UP"){
        ellipse(this.body[0][0] + 10,this.body[0][1] + 30,10,10);
        ellipse(this.body[0][0] + 30,this.body[0][1] + 30,10,10);
      } else if (dir == "DOWN") {
        ellipse(this.body[0][0] + 10,this.body[0][1] + 10,10,10);
        ellipse(this.body[0][0] + 30,this.body[0][1] + 10,10,10);
      } else if (dir == "LEFT") {
        ellipse(this.body[0][0] + 30,this.body[0][1] + 10,10,10);
        ellipse(this.body[0][0] + 30,this.body[0][1] + 30,10,10);
      } else if (dir == "RIGHT") {
        ellipse(this.body[0][0] + 10,this.body[0][1] + 10,10,10);
        ellipse(this.body[0][0] + 10,this.body[0][1] + 30,10,10); 
      }
    } else {
      rect(0,0,scl,scl);
      fill("black");
      ellipse(10,10,10,10);
      ellipse(30,10,10,10);
    }
    //add eyes

  }
}

function Food(){
  this.x = round(random(0,(width-scl)/scl)) * scl;
  this.y = round(random(0,(height-scl)/scl)) * scl;
  
  this.show = function() {
    image(apple, this.x, this.y, scl, scl);
  }

  this.update = function(){ 
    //don't generate food where the snake currently is
    while(true){
      foodNotInSnake = true
      this.x = round(random(0,(width-scl)/scl)) * scl;
      this.y = round(random(0,(height-scl)/scl)) * scl;
      for (i=0; i<s.total; i++){
        if (this.x == s.body[i][0] && this.y == s.body[i][1]){
          foodNotInSnake = false;
        }
      }
      if(foodNotInSnake){
        break;
      }
    }
  }
  
}

function restart() {
  removeElements();
  gameOver = false;
  gameStart = false;
  dirSet = false;
  dir = "";
  score = 0;
  s = new Snake();
}