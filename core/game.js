var stage;
var bs;
var plane;
var spriteSheet;
var bullet_timer;
var manifest;           // used to register sounds for preloading
var preload;

var bullet_w = 11;
var bullet_h = 10;
var plane_w = 29;
var plane_h = 32;

var plane_image = new Image();
plane_image.src = "images/plane.png";

var bad_plane_image = new Image();
bad_plane_image.src = "images/bad_plane.png";

var bullet_image = new Image();
bullet_image.src = "images/bullet.png";

function generate_new_plane()
{

    plane = new createjs.Shape();
    // plane.graphics.beginFill("blue").drawCircle(0, 0, 20);
    plane.graphics.beginBitmapFill(plane_image, "no-repeat").drawRect(0,0,plane_w,plane_h);

    plane.x = stage.canvas.width / 2 - plane_w / 2;
    plane.y = stage.canvas.height / 2 - plane_h / 2;
    plane.x_offset = Math.random() * 10 - 5;
    plane.y_offset = Math.random() * 10 - 5;


    plane.on("pressmove",function(evt) {
                // currentTarget will be the container that the event listener was added to:
                evt.currentTarget.x = evt.stageX - plane_w / 2;
                evt.currentTarget.y = evt.stageY - plane_h / 2;
                // make sure to redraw the stage to show the change:
                stage.update();   
    });

    stage.addChild(plane);

    this.document.onkeydown = keyPressed;

    stage.update();
}

var L = 37;
var R = 39;
var U = 38;
var D = 40;

function keyPressed(e) 
{
    console.log(e.keyCode);

    switch(e.keyCode)
    {
        case U:
        plane.y-=10;
        break;
        case D:
        plane.y+=10;
        break;
        case L:
        plane.x-=10;
        break;
        case R:
        plane.x+=10;
        break;
    }
    stage.update();
}

function generate_new_bullet()
{
    var circle = new createjs.Shape();
    // circle.graphics.beginFill("red").drawCircle(0, 0, 5);
    circle.graphics.beginBitmapFill(bullet_image, "no-repeat").drawRect(0,0,bullet_w,bullet_h);

    switch (Math.floor(Math.random() * 4 % 4))
    {
        case 0:
        circle.x = 0
        circle.y = Math.random() * stage.canvas.height;
        circle.x_offset = 1;
        circle.y_offset = 0;
        break;
        case 1:
        circle.x = stage.canvas.width;
        circle.y = Math.random() * stage.canvas.height;
        circle.x_offset = -1;
        circle.y_offset = 0;
        break;
        case 2:
        circle.y = 0;
        circle.x = Math.random() * stage.canvas.width;
        circle.x_offset = 0;
        circle.y_offset = 1;
        break;
        case 3:
        circle.y = stage.canvas.height;
        circle.x = Math.random() * stage.canvas.width;
        circle.x_offset = 0;
        circle.y_offset = -1;
        break;
    }

    stage.addChild(circle);
    bs.push(circle);
    stage.update();
}

function doneLoading(event) {
        
        // start the music
        createjs.Sound.play("music", {interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1, volume: 0.4});

}

function init() 
{
    var assetsPath = "sounds/";
    manifest = [
            {id: "break", src: "break.ogg", data: 6},
            {id: "music", src: "music.ogg"}
        ];

        createjs.Sound.alternateExtensions = ["mp3"];
        preload = new createjs.LoadQueue(true, assetsPath);
        preload.installPlugin(createjs.Sound);
        preload.addEventListener("complete", doneLoading); // add an event listener for when load is completed
        preload.loadManifest(manifest);

    stage = new createjs.Stage("gameCanvas");
    bs = [];

    reset();

    generate_new_plane();

bullet_timer = setInterval(function() {
    generate_new_bullet(); 
}, 100);

createjs.Ticker.on("tick", bullet_move);

function check_collision(s1, s2)
{
    if ( ( (s1.x + bullet_w > s2.x) && (s1.x + bullet_w < s2.x + plane_w + bullet_w) ) && ( (s1.y + bullet_h > s2.y) && (s1.y + bullet_h < s2.y + plane_h + bullet_h) ) )
    {
        return true;
    }

    return false;
}

function reset()
{
    createjs.Ticker.removeAllEventListeners();

    //pauseStopwatch();

    clearInterval(bullet_timer);

    createjs.Sound.stop();
}

function stop()
{
    createjs.Ticker.removeAllEventListeners();

    pauseStopwatch();

    clearInterval(bullet_timer);

    createjs.Sound.stop();

    createjs.Sound.play("break", {interrupt: createjs.Sound.INTERRUPT_LATE, offset:0.8});

    plane.graphics.beginBitmapFill(bad_plane_image, "no-repeat").drawRect(0,0,plane_w,plane_h);
}

function bullet_move()
{ 
    // console.log("move"); 

    for (var i = 0; i < bs.length; i++) 
    {

        var circle = bs[i];
        if (circle == undefined) return;

        if (check_collision(circle, plane))
        {
            // console.log("hit");
            stop();

        }

        circle.x += circle.x_offset * 2;
        circle.y += circle.y_offset * 2;

        var should_remove = false;
        if (circle.x > stage.canvas.width) should_remove = true;
        if (circle.y > stage.canvas.height) should_remove = true;
        if (circle.x < 0) should_remove = true;
        if (circle.y < 0) should_remove = true;

        if (should_remove)    
        {     
            stage.removeChild(circle);
            bs.splice(i, 1);
        }


    }

    stage.update();

}

}

window.onload = function() {
    resetStopwatch();
};
        

