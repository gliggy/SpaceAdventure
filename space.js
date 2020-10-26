var myCanvas = document.getElementById('myCanvas');
  myCanvas.width = window.innerWidth;            // fill the entire browser width
  myCanvas.height = window.innerHeight;          // fill the entire browser height
var ctx = myCanvas.getContext("2d"); // Get the drawing context for the canvas
var FPS = 40;  // frames per second

function play () {
  var audio = new Audio('space ripple.wav');
  audio.play();
}

var score = 0;



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
  if ((this.velocity_y > 0) && (this.y + this.height< myCanvas.height)) this.y = this.y + this.velocity_y;                           // move the thing
}       

var spaceShip = new Ship("space_ship2.png");         // The hero
    

Asteroid.prototype.Do_Frame_Things = function() {                     
    if (this.visible) ctx.drawImage(this.MyImg, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    this.x = this.x + this.velocity_x;
    this.y = this.y + this.velocity_y;                            // move the thing
    }

var thing = new Asteroid("asteroid.png"); 
 thing.width = 15;
 thing.height = 15;
 //console.log(thing.width);
 thing.x = myCanvas.width/2 - thing.width/2;
 thing.y = myCanvas.height/2 - thing.height/2;
 
function Do_a_Frame () {
  thing.velocity_x = Math.cos(thing.direction) * thing.width / 10;
    thing.velocity_y = Math.sin(thing.direction) * thing.height / 10;
    thing.width += 3
    thing.height += 3
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);        // clear the frame
    ctx.fillStyle= "yellow";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 0, 20);
    thing.Do_Frame_Things();                                     // let the thing do its thing
    if (thing.x < -thing.width / 2 || thing.x > myCanvas.width + thing.width / 2 || thing.y < -thing.height / 2 || thing.y > myCanvas.height + thing.height / 2) {
      score += 1
      thing.width = 15;
      thing.height = 15;
      thing.x = myCanvas.width/2 - thing.width/2;
     thing.y = myCanvas.height/2 - thing.height/2;
     thing.direction = Math.random() * 2 * Math.PI;
     
    }
    spaceShip.Do_Frame_Things();
    //ctx.drawImage(ShipImg, myCanvas.width/2 - ShipImg.width/2, myCanvas.height/2 - 50); 
  }

  function MyKeyUpHandler (MyEvent) { 
    if (MyEvent.keyCode == 37 || MyEvent.keyCode == 39) {spaceShip.velocity_x=  0};    // not left or right
    if (MyEvent.keyCode == 38 || MyEvent.keyCode == 40) {spaceShip.velocity_y=  0};    // not up or down
    }
 
 function MyKeyDownHandler (MyEvent) { 
    if (MyEvent.keyCode == 37) {spaceShip.velocity_x=  -8};  // left
    if (MyEvent.keyCode == 38) {spaceShip.velocity_y=  -8};  // up
    if (MyEvent.keyCode == 39) {spaceShip.velocity_x=   8};  // right
    if (MyEvent.keyCode == 40) {spaceShip.velocity_y=   8};  // down
    MyEvent.preventDefault()
    }
 
 addEventListener("keydown", MyKeyDownHandler);          // listen for keystrokes  
 addEventListener("keyup", MyKeyUpHandler);              // listen for keys released
 
   setInterval(Do_a_Frame, 1000/FPS);                             // set my frame renderer
