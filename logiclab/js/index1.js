//Fields
var sec5 = 5000, //How long the color blend transition lasts. (in milliseconds, 1000 = 1 second)
	sec1 = 1000,
	night_mode = false,
	backgroundcolors = false;


function bg_color_tween() {
	//Get background color, assign it to foreground
	backgroundcolors = true;
	var element = document.body,
		style = window.getComputedStyle(element),
		newcolor = style.getPropertyValue('background-color');
	$('#content').animate({ color: newcolor }, sec1, 'linear', function() {});
	
	//start loop
	bg_color_tween_loop();
}
function color_tween() {
	backgroundcolors = false;
	
	//Get foreground color, assign it to background
	var element = document.getElementById('content');
	var	style = window.getComputedStyle(element);
	var newcolor = style.getPropertyValue('color');
	
	$('body').animate({ backgroundColor: newcolor }, sec1, 'linear', function() {});
	
	//start loop
	color_tween_loop();
}
function bg_color_tween_loop() {
	//alert(backgroundcolors);
	if(!backgroundcolors)return;
	var newcolor = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6); //random hex color

	$('body').animate({ backgroundColor: newcolor }, sec5, 'linear', function() {		
		bg_color_tween_loop();
	});
}
function color_tween_loop() {
	if(backgroundcolors)return;
	var newcolor = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6); //random hex color

	$('#content').animate({ color: newcolor }, sec5, 'linear', function() {		
		color_tween_loop();
	});
}

function swapColors() {
	backgroundcolors ? color_tween() : bg_color_tween();
}

function dayMode(){
	if (!backgroundcolors){
		$('body').animate({ backgroundColor: '#FFFFFF' }, sec1, 'linear', function(){});
	}
	else{
		$('#content').animate({ color: '#FFFFFF' }, sec1, 'linear', function(){});
	}
	night_mode = false;
	delete settings["Day Mode"];
	settings["Night Mode"] = "nightMode();";
	loadMenu(settings);
}

function nightMode(){
	if (!backgroundcolors){
		$('body').animate({ backgroundColor: '#000000' }, sec1, 'linear', function(){});
	}
	else{
		$('#content').animate({ color: '#000000' }, sec1, 'linear', function(){});
	}
	night_mode = true;
	delete settings["Night Mode"];
	settings["Day Mode"] = "dayMode();";
	loadMenu(settings);
}


//Main Menu
var main_menu = {
	"Daily Practice" : "",
	"The Interview" : "",
	"Quick Play" : "",
	"Find a Game" : "",
	"Settings" : "loadMenu(settings);"
}

//Settings
var settings = {"Back": "loadMenu(main_menu);"};
var daynight = night_mode ? "Day Mode" : "Night Mode";
settings[daynight] = night_mode ? "dayMode();" : "nightMode();";
settings["Swap Colors"] = "swapColors();";

function loadMenu(menu){
	var html = "";
	for (var option in menu){
		html+= "<li><a onclick='" + menu[option] + "'>" + option + "</a></li>\n";
	}
	//alert(html);
	document.getElementById('menu').innerHTML = html;
}
 
$(document).ready(function() {
	color_tween();
	loadMenu(main_menu);
}); 

