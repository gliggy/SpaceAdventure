var myCanvas = document.getElementById('myCanvas');
  myCanvas.width = window.innerWidth;            // fill the entire browser width
  myCanvas.height = window.innerHeight;          // fill the entire browser height
var ctx = myCanvas.getContext("2d");             // Get the drawing context for the canvas
var FPS = 40;                                    // frames per second

//begin music area
var theme_playing = false;
function playTheme () {
  var themeMusic = new Audio('space_ripple.wav');
  themeMusic.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false);
  themeMusic.play();
  theme_playing = true;
}
//end music area

//begin game variables
var score = 0;
//var game_on = false;
//var game_started = false;
var tries = 0;
var velocity = 8;
var game_state = "start";

//begin game code

//game_state logic
if (game_state == "hit") {game_state = "retrying"};

function Asteroid (asteroid_src) {
    this.x = 0;
    this.y = 0;
    this.direction = Math.random() * 2 * Math.PI;
    this.visible= true;

    this.MyImg = new Image();
    this.MyImg.src = asteroid_src ;
}

function Ship (img_url) {
  this.x = myCanvas.width/2 - 216;
  this.y = myCanvas.height/2 + 50;
  if (myCanvas.height < myCanvas.width) {
    this.height = myCanvas.height/5;
    this.width = this.height*1.6489;
  }
  if (myCanvas.width < myCanvas.height) {
    this.width = myCanvas.width/5
    this.height = this.width/1.6489
  }
  this.visible= true;
  this.velocity_x = 0;
  this.velocity_y = 0;
  this.MyImg = new Image();
  this.MyImg.src = img_url ;
}

function ImagesTouching(x1, y1, img1, x2, y2, img2) {
  if (x1 >= x2+img2.width || x1+img1.width <= x2) return false;   // too far to the side
  if (y1 >= y2+img2.height || y1+img1.height <= y2) return false; // too far above/below
  return true;                                                    // otherwise, overlap
}

Ship.prototype.Do_Frame_Things = function() {
  if (this.visible) ctx.drawImage(this.MyImg, this.x, this.y, this.width, this.height);  // draw the thing

  // if the x-velocity is to the left, only apply the velocity if the sprite is not off-screen to the left<
  if ((this.velocity_x < 0) && (this.x > 0))  this.x = this.x + this.velocity_x;

  // if the x-velocity is to the right, only apply the velocity if the sprite is not off-screen to the right<
  if ((this.velocity_x > 0) && (this.x + this.width < myCanvas.width )) this.x = this.x + this.velocity_x;

  // if the y-velocity is upward, only apply the velocity if the sprite is not off-screen at the top
  if ((this.velocity_y < 0) && (this.y > 0))  this.y = this.y + this.velocity_y;

  // if the y-velocity is downward, only apply the velocity if the sprite is not off-screen at the bottom
  if ((this.velocity_y > 0) && (this.y + this.height< myCanvas.height)) this.y = this.y + this.velocity_y; // move the thing
}

//the ship
var spaceShip = new Ship("space_ship2.png");

Asteroid.prototype.Do_Frame_Things = function() {
    if (this.visible) ctx.drawImage(this.MyImg, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    this.x = this.x + this.velocity_x;
    this.y = this.y + this.velocity_y; // move the thing
    }

//why is it called thing?!
var thing = new Asteroid("asteroid.png");
 thing.width  = 15;
 thing.height = 15;
 //console.log(thing.width);
 thing.x = myCanvas.width/2 - thing.width/2;
 thing.y = myCanvas.height/2 - thing.height/2;

//message section, should probably be refactored into something
function ShowGameMessage(message, color, exit_key, action) {
        ctx.fillStyle = "beige";
        ctx.fillStyle = color;
        ctx.font = "bold 50px Arial";
        ctx.textAlign="center";
        ctx.fillText(message, myCanvas.width / 2, myCanvas.height / 2);
        ctx.font = "bold 20px Arial";
        if (exit_key == null) {exit_key = space;}
        ctx.fillText("Press " + exit_key + " to " + action, myCanvas.width / 2, (myCanvas.height / 2)+50);
        ctx.textAlign="left";
        }
function startGame() {
        ShowGameMessage("Ready? Try to get to 100, you have 5 tries.", "yellow", "space", "start game");
        //ctx.fillStyle= "yellow";
        //ctx.font = "bold 50px Arial";
        //ctx.textAlign="center";
        //ctx.fillText("Press Space to start Game", myCanvas.width / 2, myCanvas.height / 2);
        //ctx.font = "bold 20px Arial";
        //ctx.fillText("you can tye m to mute audio", myCanvas.width / 2, (myCanvas.height / 2)+50);
        //ctx.textAlign="left";
	}
function endGame() {
  ShowGameMessage("You used all five tries.", "red", "space", "restart the game");
  game_state = "ended";
  tries = 0;
}
//end message section

//this monstrosity...
function Do_a_Frame () {
  console.log(game_state);

  //game_state logic
  if (game_state == "hit") {game_state = "retrying"};

  if (game_state == "start") startGame();
  else if (game_state == "retrying" && tries > 5) endGame();
  else if (game_state == "retrying") ShowGameMessage("You died!", "red", "R", "try again");
  else {
    thing.velocity_x = Math.cos(thing.direction) * thing.width / 10;
      thing.velocity_y = Math.sin(thing.direction) * thing.height / 10;
      thing.width += 3
      thing.height += 3
      ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);        // clear the frame
      ctx.fillStyle= "yellow";
      ctx.font = "20px Arial";
      ctx.fillText("Score: " + score, 0, 20);
      thing.Do_Frame_Things();                                     // let the thing do its thing, but which thing?!
      if (thing.x < -thing.width / 2 || thing.x > myCanvas.width + thing.width / 2 || thing.y < -thing.height / 2 || thing.y > myCanvas.height + thing.height / 2) {
        score += 1;
        thing.width = 15;
        thing.height = 15;
        thing.x = myCanvas.width/2 - thing.width/2;
       thing.y = myCanvas.height/2 - thing.height/2;
       thing.direction = Math.random() * 2 * Math.PI;
      }
      spaceShip.Do_Frame_Things();
      //ctx.drawImage(ShipImg, myCanvas.width/2 - ShipImg.width/2, myCanvas.height/2 - 50); <-- who left this comment ~me, obviously
    }
  }

//why is it here at the end?!
function retry_game() {
    // This gets called when the 'r' key is pressed and just sets
    // some important variables back to the start.
    //
    // Alternatively they could just reload the page
    //score = 0;
    game_state = "playing";
    tries += 1;
    }

//begin key handling
function MyKeyUpHandler (MyEvent) {
  if (MyEvent.keyCode == 37 || MyEvent.keyCode == 39) {spaceShip.velocity_x=  0};    // not left or right
  if (MyEvent.keyCode == 38 || MyEvent.keyCode == 40) {spaceShip.velocity_y=  0};    // not up or down
  }

function MyKeyDownHandler (MyEvent) {
  if (MyEvent.keyCode == 37) {spaceShip.velocity_x = -velocity};  // left
  if (MyEvent.keyCode == 38) {spaceShip.velocity_y = -velocity};  // up
  if (MyEvent.keyCode == 39) {spaceShip.velocity_x =  velocity};  // right
  if (MyEvent.keyCode == 40) {spaceShip.velocity_y =  velocity};  // down

  if (MyEvent.keyCode == 82 && game_state == "retrying") {retry_game();} // r to retry
  if (MyEvent.keyCode == 77 && !theme_playing) playTheme();  // m for audio
  if (MyEvent.keyCode == 32 && game_state == "start") { game_state = "playing" }  // Space to start

  MyEvent.preventDefault()
  }
//end key handling

//no idea what these do, might as well leave them be...
addEventListener("keydown", MyKeyDownHandler);          // listen for keystrokes
addEventListener("keyup", MyKeyUpHandler);              // listen for keys released
setInterval(Do_a_Frame, 1000/FPS);                      // set my frame renderer
