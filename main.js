var inter;
var canvas;
var lines = [];
var x = 500;
var y = 500;
function drawLine(line) {
	context.moveTo(x, y);
	var x1 = Math.round(x + line.ln * Math.cos(line.angle))
	var y1 = Math.round(y + line.ln * Math.sin(line.angle))
	// console.log(line.color);
	// context.stroke();
	context.lineTo(x1, y1);

}

function min_max(max, min) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function init() {
	canvas	= document.getElementById("canvas_test");
	canvas.width  = 1000;
	canvas.height = 1000;

	context             = canvas.getContext("2d");
	context.fillStyle   = "#000";
	context.strokeStyle = "#fff";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.lineWidth = 0.1;
	context.beginPath();
	
}

function make_lines() {	
	for (i = 1; i < 360; i+=0.5 ) {
		ln = min_max(400, 0)

		lines[i] = {
			'ln'	: ln,
			'angle'	: i,
		}

		drawLine(lines[i]);
	}
	context.stroke();
}

function rotate() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.beginPath();
	var angle;
	for (i = 1; i < 360; i += 0.5 ) {
		lines[i].angle += min_max(100,0)/10000;
		drawLine(lines[i]);	
	}
	context.stroke();
}

function rand_color() {
	return "#" + min_max(255, 100).toString(16) + min_max(255, 100).toString(16) + min_max(255, 100).toString(16);
}

function make_colors() {
	var div = '', color;
	for (i = 0; i < 10; i++) {
		color = rand_color();
		console.log(color);
		div += "<div class='colorpick' data-color='" + color + "' style='background: " + color + ";'></div>";
	}
	$('#play').after(div);
}

$(document).ready(function(){
	make_colors();
	init();
	make_lines();

	$("#play").click(function(){
		var anim_speed = 10;
		var inter_pause;
		if (!$(this).hasClass('pause')) {
			clearInterval(inter);
			clearInterval(inter_pause);
			inter = setInterval(function(){rotate()}, anim_speed);
			$(this).addClass('pause');
		} else {
			$("#play").removeClass('pause');
			inter_pause = setInterval(function(){
				clearInterval(inter);
				anim_speed+=20;
				inter = setInterval(function(){rotate()}, anim_speed);
				if (anim_speed >= 200) {
					clearInterval(inter);
					clearInterval(inter_pause);
				}
			}, 200)
		}
	});
	$("#stop").click(function(){
		clearInterval(inter);
		context.clearRect(0, 0, canvas.width, canvas.height);
	});

	$(".colorpick").live('click', function(){
		var color = $(this).data('color');
		$(".colorpick").removeClass('test');
		$(this).addClass('test');
		context.strokeStyle = color;
	});
})