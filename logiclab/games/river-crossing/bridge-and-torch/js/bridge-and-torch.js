// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

var element = document.getElementById("timer");
var timer = new Stopwatch(element);

var canvas = document.getElementById('canvas'),
	c = canvas.getContext('2d');

function initialize(){
	window.addEventListener('resize', resizeCanvas, false);
	resizeCanvas();
}	
	
function resizeCanvas(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	cwidth = canvas.width;
	cheight = canvas.height;
	redraw();
}

/*Game Loop
var lastTime;
function main(){
	var now = Date.now();
	var dt = (now - lastTime) / 1000.0;
	update(dt);
	render();
	lastTime = now;
	requestAnimFrame(main);
}*/

//the big guns
function redraw(){
	moon();
	cliffs();
	stars(30);
}

function moon(){
	var x = cwidth * .80;
    var y = cheight* .15;
	var ratio = 0.15;
    var size = (cwidth<cheight) ? cwidth * ratio : cheight * ratio;
	
	var element = $('#moon');
	element.css('width', size + "px");
	element.css('height', size + "px");
	var shadow = size * .15;
	var shadowcss = shadow + "px "
							+ shadow + "px " 
							+ shadow * 0.1 + "px "
							+ shadow * 0.2 + "px white";
	element.css('box-shadow', shadowcss);
	
	/*
	c.save();
    var counterClockwise = false;
	c.lineWidth = 1;
	c.fillStyle = 'white';
	
	c.beginPath();
	c.arc(x, y, radius, 0, 2 * Math.PI, counterClockwise);
	c.fill();
	
	c.globalCompositeOperation = 'destination-out';
	
	c.beginPath();
	c.arc(x-radius*.35, y-radius*.25, radius, 0, 2 * Math.PI, counterClockwise);
    c.closePath();
	
    c.fill();
	
	c.restore();
	*/
}

function stars(number){
	var x, y, w;
	while(number--){
		x = Math.random() * cwidth;
		y = Math.random() * cheight / 3;
		w = Math.random() * 3;
		c.beginPath();
		c.fillRect(x, y, w, w);
		c.fillStyle = 'white';
		c.fill();
		
	}
}

function cliffs(){
	c.lineWidth = 1;
	c.fillStyle = 'black';
	var extra = (cwidth<cheight) ? cwidth * .05 : cheight * .05;
	var post = extra/5;
	var y = cheight * .60;
	var x = cwidth * .20;
	
	var element = $('.peg');
	var css = post*1.25 + "px "
							+ post + "px " 
							+ 0 + "px "
							+ post + "px";
	element.css('border-width', css);
	
	
	/*LEFT SIDE
	c.beginPath();
	c.moveTo(0,y); 
	c.lineTo(x, y);
	c.quadraticCurveTo(x+extra, y, x+extra, y+extra);
	c.lineTo(x+extra, cheight);
	c.lineTo(0, cheight);
	c.closePath();
	c.fill();
	
	c.beginPath();
	c.moveTo(x,y+post);
	c.lineTo(x-post, y-post);
	c.lineTo(x+post, y-post);
	c.fill();
	c.closePath();
	
	//BRIDGE
	c.beginPath();
	c.moveTo(x,y);
	x = cwidth - x;
	c.quadraticCurveTo(cwidth/2, cheight * .65, x, y);
	c.stroke();
	c.closePath();
	
	RIGHT SIDE
	c.beginPath();
	c.moveTo(cwidth,y); 
	c.lineTo(x, y);
	c.quadraticCurveTo(x-extra, y, x-extra, y+extra);
	c.lineTo(x-extra, cheight);
	c.lineTo(cwidth, cheight);
	c.closePath();
	c.fill();
	
	c.beginPath();
	c.moveTo(x,y+post);
	c.lineTo(x-post, y-post);
	c.lineTo(x+post, y-post);
	c.fill();
	c.closePath();*/
}

function handleInput(dt) {
    if(input.isDown('DOWN') || input.isDown('s')) {
        //player.pos[1] += playerSpeed * dt;
    }

    if(input.isDown('UP') || input.isDown('w')) {
        //player.pos[1] -= playerSpeed * dt;
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        //player.pos[0] -= playerSpeed * dt;
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        //player.pos[0] += playerSpeed * dt;
    }
}

function update(dt){
	gameTime += dt;

    handleInput(dt);
    updateEntities(dt);

    // It gets harder over time by adding enemies using this
    // equation: 1-.993^gameTime
    if(Math.random() < 1 - Math.pow(.993, gameTime)) {
        enemies.push({
            pos: [cwidth/2,
                  cheight/2],
            sprite: new Sprite('img/vectordude.png', [0, 78], [80, 39],
                               6, [0, 1, 2, 3, 2, 1])
        });
    }

    checkCollisions();

    scoreEl.innerHTML = score;
}


$('#timer').bind('mousedown',function(e){
	timer.toggle();
});

initialize();