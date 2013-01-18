var inter;
var canvas;
var lines = [];
var x = 500;
var y = 500;
var thick = 0.1;
var length = 200;
var color = '#fff';
var koef = 0;
function drawLine(line) {
	context.moveTo(x, y);
	var x1 = Math.round(x + line.ln * Math.cos(line.angle))
	var y1 = Math.round(y + line.ln * Math.sin(line.angle))
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
	context.strokeStyle = color;
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.lineWidth = thick;
	context.beginPath();
 
}
 
function make_lines() {
	var speed = koef;
	for (i = 1; i < 720; i ++ ) {
		ln = min_max(length, 0)
 	
		lines[i] = {
			'ln'	: ln,
			'angle'	: i/2,
			'delta'	: min_max(100,0),
		}
 
		drawLine(lines[i]);
	}
	context.stroke();
}

// function update_speed() {
// 	for (i = 1; i < 720; i ++ ) {
// 		lines[i].speed = koef/10000;
// 	}
// 	return;
// }

function rotate() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.beginPath();
	var angle;
	for (i = 1; i < 720; i ++ ) {
		if (koef != 0) {
			lines[i].angle += lines[i].delta/(10000/koef);
		}
		drawLine(lines[i]);	
	}
	context.stroke();
}
 
function rand_color() {
	return "#" + min_max(255, 100).toString(16) + min_max(255, 100).toString(16) + min_max(255, 100).toString(16);
}
 
function make_colors() {
	var div = '', color;
	for (i = 0; i < 9; i++) {
		color = rand_color();
		div += "<div class='colorpick' data-color='" + color + "' style='background: " + color + ";'></div>";
	}
	$('#reload').before(div);
}
 
function begin(){
	init();
	make_lines();
	$('.length div.active').css('background', color);
	$('.thickness div.active').css('background', color);
	$('#slider, #slider a').css('background', color);
	// $('#slider a').css('border-left-color', color);
	if ($('#play').hasClass('pause')) {
		$('#play').css('border-color', color);
	} else {
		$('#play').css('border-color', 'transparent');
		$('#play').css('border-left-color', color);
	}
}
 
$(document).ready(function(){
	make_colors();
	begin();
 
	$("#play").click(function(){
		var anim_speed = 10;
		var inter_pause;
		if (!$(this).hasClass('pause')) {
			if (koef == 0) {
				koef = 1;
				$("#slider").slider("value", koef);	
			}
			
			clearInterval(inter);
			clearInterval(inter_pause);
			inter = setInterval(function(){rotate()}, anim_speed);
			$(this).addClass('pause');
			$('#play').css('border-color', color);
		} else {
			$("#play").removeClass('pause');
			$('#play').css('border-color', 'transparent');
			$('#play').css('border-left-color', color);
			inter_pause = setInterval(function(){

				clearInterval(inter);
				var sign = (koef > 0) ? -1: 1 ;
				var koef_plus = -1*koef*sign
				var delta;

				if (koef_plus >= 7) {
					delta = 0.5;
				} else if (koef_plus < 7 && koef_plus > 1) {
					delta = 0.3;
				} else {
					delta = 0.1;
				}

				koef += delta * sign;

				inter = setInterval(function(){rotate()}, anim_speed);

				if (-1*koef*sign < 0.1) {
					clearInterval(inter);
					clearInterval(inter_pause);
					koef = 0;

				}
				$("#slider").slider("value", koef);
			}, 100)
		}
	});
 
	$(".colorpick").live('click', function(){
		color = $(this).data('color');
		$(".colorpick").removeClass('active');
		$(this).addClass('active');
		begin();
	});
 
	$("#reload").click(function(){
		$(".colorpick").remove();
		make_colors();
	});
 
	$('.thickness div').click(function(){
		thick = $(this).data("thick");
		$('.thickness div').removeClass('active').css('background', '#fff');
		$(this).addClass('active').css('background', color);
		begin();
	});
 
	$('.length div').click(function(){
		length = $(this).data("length");
		$('.length div').removeClass('active').css('background', '#fff');
		$(this).addClass('active').css('background', color);
		begin();
	});

	$( "#slider" ).slider({
		step: 0.1,
		max: 10,
		min: -10,
		value: 0,
		slide: function (event, ui) {
			koef = ui.value;
		}
	});
})