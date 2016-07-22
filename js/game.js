var screenW = 800;
var screenH = 600;
var blockW = 10;
var blockH = 10;

var game = new Phaser.Game(screenW, screenH, Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
    render: render
});


var keyUp;
var keyDown;
var keyLeft;
var keyRight;
var scoreTextField;
var gameOverTextField;

var head;
var body = [];

var food;
var score = 1;
var stepX = 0;
var stepY = 0;
var keyPressed = false;
var tickIntervalId;
var spawnX = 405;
var spawnY = 305;

function preload() {

}

function create() {
    food = createFood();
    head = createHead(spawnX, spawnY);

    tickIntervalId = setInterval(tick, 250);

    keyUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    keyUp.onDown.add(onKeyUp, this);

    keyDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    keyDown.onDown.add(onKeyDown, this);

    keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    keyLeft.onDown.add(onKeyLeft, this);

    keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    keyRight.onDown.add(onKeyRight, this);
    
    keySpaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    keySpaceBar.onDown.add(onSpaceBarDown, this);

    var style = {
        width: 100,
        font: "20px Arial",
        fill: "#ff0044",
        align: "center",
        //backgroundColor: "#ffff00" 
    };
    scoreTextField = game.add.text(0, 0, "length: " + score, style);
    scoreTextField.x = screenW/2 - scoreTextField.width/2;


    // add for-loop here
    // inside for-loop create 5-10 new rectangles as a grid of different colors
}
function teleportHead() {
    if (head.x < 0) {
        head.x = head.x + screenW;
    } else if (head.x > screenW) {
        head.x = head.x - screenW;
    } else if (head.y < 0) {
        head.y = head.y + screenH;
    } else if (head.y > screenH) {
        head.y = head.y - screenH;
    }
}
function tick() {
    
    //console.log('tick()');
    head.previousX = head.x;
    head.previousY = head.y;
    head.x = head.x + stepX;
    head.y = head.y + stepY;
    
    teleportHead();

    moveBody();

    for(var i = 3; i < body.length; i++){
        if(head.x == body[i].x && head.y == body[i].y){
            gameOver();
        }
    }
    
    var distanceX = head.x - food.x;
    var distanceY = head.y - food.y;

    if (distanceX < blockW && distanceX > -blockW && distanceY < blockH && distanceY > -blockH) {
        console.log('hit');

        food.x = 5 + 10 * randomInt(79);
        food.y = 5 + 10 * randomInt(59);

        score = score + 1;
        scoreTextField.text = "length: " + score;

        grow();
    }
    
    keyPressed = false;
}

function update() {
    //console.log('yo');
}

function render() {

}

function onKeyUp() {
    if (stepY == 0 && keyPressed == false) {
        stepX = 0;
        stepY = -10;
        keyPressed=true;
    }
}

function onKeyDown() {
    if (stepY == 0 && keyPressed == false) {
        stepX = 0;
        stepY = +10;
        keyPressed=true;
    }
}

function onKeyLeft() {
    if (stepX == 0 && keyPressed == false) {
        stepX = -10;
        stepY = 0;
        keyPressed=true;
    }
}

function onKeyRight() {
    if (stepX == 0 && keyPressed == false) {
        stepX = +10;
        stepY = 0;
        keyPressed=true;
    }
}

function onSpaceBarDown(){
    clearInterval(tickIntervalId);
    tickIntervalId = setInterval(tick, 250);
    
    score = 1;
    scoreTextField.text = "length: " + score;
    
    for(var i = 0; i<body.length; i++){
        body[i].destroy();
    }
    body = [];
    
    stepX = 0;
    stepY = 0;
    
    head.x = spawnX;
    head.y = spawnY;
    
    food.x = 5 + 10 * randomInt(79);
    food.y = 5 + 10 * randomInt(59);
    
    if(gameOverTextField != null)
    {
        gameOverTextField.destroy();
        gameOverTextField = null;
    }
}

function grow() {
    var bodyPart = createRect(head.x, head.y);
    body.push(bodyPart);

    game.world.bringToTop(head);
}

//26D429
function createRect(x, y) {

    var w = 10;
    var h = 10;

    // create a new bitmap data object
    var bmd = game.add.bitmapData(w, h);

    // draw to the canvas context like normal
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, w, h);
    bmd.ctx.fillStyle = '#18dcf0';
    bmd.ctx.fill();

    // use the bitmap data as the texture for the sprite
    var sprite = game.add.sprite(x, y, bmd);
    sprite.anchor.setTo(0.5, 0.5);

    return sprite;
}

function createHead(x, y) {
    var w = 10;
    var h = 10;

    // create a new bitmap data object
    var bmd = game.add.bitmapData(w, h);
    bmd.rect(0, 0, w, h,'#18dcf0');
    bmd.circle(w/2,h/2, w/3, '#ff0000');

    // use the bitmap data as the texture for the sprite
    var sprite = game.add.sprite(x, y, bmd);
    sprite.anchor.setTo(0.5, 0.5);

    return sprite;
}

function createFood() {

    var w = 10;
    var h = 10;

    // create a new bitmap data object
    var bmd = game.add.bitmapData(w, h);

    // draw to the canvas context like normal
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, w, h);
    bmd.ctx.fillStyle = '#26D429';
    bmd.ctx.fill();

    // use the bitmap data as the texture for the sprite
    var sprite = game.add.sprite(305, 205, bmd);

    sprite.anchor.setTo(0.5, 0.5);

    return sprite;
}

function randomInt(a) {
    return Math.floor(Math.random() * (a + 1));
}

function moveBody() {
    if (body.length > 0) {
        body[0].previousX = body[0].x;
        body[0].previousY = body[0].y;
        body[0].x = head.previousX;
        body[0].y = head.previousY;

        for (var i = 1; i < body.length; i++) {
            body[i].previousX = body[i].x;
            body[i].previousY = body[i].y;
            body[i].x = body[i-1].previousX;
            body[i].y = body[i-1].previousY;
        }
    }
}

function gameOver(){
    clearInterval(tickIntervalId);
    
    var style = {
        width: 100,
        font: "70px Arial",
        fill: "#00ff00",
        align: "center",
        //backgroundColor: "#ffff00" 
    };
    gameOverTextField = game.add.text(0, 0, "GAME OVER", style);
    gameOverTextField.x = screenW/2 - gameOverTextField.width/2;
    gameOverTextField.y = screenH/2 - gameOverTextField.height/2;
}