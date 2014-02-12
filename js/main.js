var inter;
var canvas;
var lines = [];
var x = 400;
var y = 400;
var thick = 0.1;
var lineLength = 200;
var color = '#fff';
var koef = 0;
var lineQ = 500;

function drawLine(line) {
    context.strokeStyle = color;
    context.lineWidth   = thick;
    context.moveTo(x, y);
    var x1 = Math.round(x + line.ln * Math.cos(line.angle));
    var y1 = Math.round(y + line.ln * Math.sin(line.angle));
    context.lineTo(x1, y1);
}
 
function min_max(max, min) {
    return Math.floor(Math.random() * (max - min)) + min;
}
 
function init() {
    canvas    = $("#canvas")[0];

    canvas.width  = 800;
    canvas.height = 800;
    context = canvas.getContext("2d");
}
 
function make_lines() {
    var speed = koef;
    for (i = 1; i <= 1000; i ++ ) {
        ln = min_max(lineLength, 0);

        lines[i] = {
            'ln': ln,
            'angle': i/2,
            'delta': min_max(100,0),
        };
        
        if (i <= lineQ) {
            drawLine(lines[i]);
        }
    }
    context.stroke();
}

function rotate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    var angle;
    for (i = 1; i <= lineQ; i ++ ) {
        if (koef !== 0) {
            lines[i].angle += lines[i].delta/(10000/koef);
        }
        drawLine(lines[i]);
    }
    context.stroke();
    context.closePath();
}
 
function rand_color() {
    return "#" + min_max(255, 100).toString(16) + min_max(255, 100).toString(16) + min_max(255, 100).toString(16);
}
 
function generateColors(colorsClass) {
    var color;
    for (i = 0; i < 17; i++) {
        if (i < 15) {
            color = rand_color();
        } else if (i == 15) {
            color = "#fff";
        } else {
            color = "#000";
        }

        html  = "<div class='colorpick' data-color='" +
                color + "' style='background: " +
                color + ";'></div>";
        $(colorsClass + ' .reload').before(html);
    }
}
 
function begin(){
    init();
    setColor();
    make_lines();
}

function setColor() {
    $('.slider, .slider a, .thickness div.active,.length div.active').css('background', color);

    if ($('#play').hasClass('pause')) {
        $('#play').css('border-color', color);
    } else {
        $('#play').css('border-color', 'transparent');
        $('#play').css('border-left-color', color);
    }
}

$(document).ready(function(){
    begin();
    generateColors('.colors');
    generateColors('.back-colors');

    $("#play").click(function(){
        var anim_speed = 10;
        var inter_pause;
        if (!$(this).hasClass('pause')) {
            if (koef === 0) {
                koef = 1;
                $("#slider").slider("value", koef);
            }
            
            clearInterval(inter);
            clearInterval(inter_pause);
            inter = setInterval(function(){rotate();}, anim_speed);
            $(this).addClass('pause');
            $('#play').css('border-color', color);
        } else {
            $("#play").removeClass('pause');
            $('#play').css('border-color', 'transparent');
            $('#play').css('border-left-color', color);
            inter_pause = setInterval(function(){

                clearInterval(inter);
                var sign = (koef > 0) ? -1: 1 ;
                var koef_plus = -1 * koef * sign;
                var delta;

                if (koef_plus >= 7) {
                    delta = 0.5;
                } else if (koef_plus < 7 && koef_plus > 1) {
                    delta = 0.3;
                } else {
                    delta = 0.1;
                }

                koef += delta * sign;

                inter = setInterval(function(){rotate();}, anim_speed);

                if (-1*koef*sign < 0.1) {
                    clearInterval(inter);
                    clearInterval(inter_pause);
                    koef = 0;

                }
                $("#slider").slider("value", koef);
            }, 100);
        }
    });
 
    $("body").on('click', ".colors .colorpick", function(){
        var parentClass = "." + $(this).parent().attr('class');
        $(parentClass + " .colorpick").removeClass('active');
        color = $(this).data('color');
        $(this).addClass('active');
        setColor();
        if (!$('#play').hasClass('pause')) {
            begin();
        }
    });

    $("body").on('click', ".back-colors .colorpick", function(){
        var parentClass = "." + $(this).parent().attr('class');
        $(parentClass + " .colorpick").removeClass('active');
        $(this).addClass('active');
        $("body").css("background", $(this).data('color'));
    });
 
    $(".reload").click(function(){
        var parentClass = "." + $(this).parent().attr('class');
        $(parentClass + " .colorpick").remove();
        generateColors(parentClass);
    });
 
    $('.thickness div').click(function(){
        thick = $(this).data("thick");
        $('.thickness div').removeClass('active').css('background', '#fff');
        $(this).addClass('active').css('background', color);
        setColor();
        if (!$('#play').hasClass('pause')) {
            begin();
        }
    });
 
    $('.length div').click(function(){
        lineLengthPrev = lineLength;
        lineLength     = $(this).data("length");
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

    $( "#slider-quantity" ).slider({
        step: 1,
        max: 1000,
        min: 0,
        value: lineQ,
        slide: function (event, ui) {
            lineQ = ui.value;
        }
    });
});