//FIELDS
var sec5 = 5000,
	sec1 = 1000,
	loading = [];
var languages = ["C", "C++", "C#", "Java", "Python"],
	my_languages = [];

	
//IE FIX
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
     for (var i = (start || 0), j = this.length; i < j; i++) {
         if (this[i] === obj) { return i; }
     }
     return -1;
	}
}

//COLORS
var colors = ["white", "black"],
	elements = ["color", "backgroundColor"];

function randomColor(){
	return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
}

/*
*	Sets whatever the solid color should be in a second transition
*	In trippy mode, this generates a random color every 5 seconds
*/
function setSolidColors(){
	var color = night? colors[1] : colors[0];
	var element = flip? elements[0] : elements[1];
	var options = {};
	options[element] = trip ? randomColor() : color;
	var interval = trip? sec5 : sec1;
	$("#main").animate(options, sec1, 'linear', function() {});
}

//Split due to solid color changes at 1s while colors changes at 5s

/*
*	Sets whatever the changing color should be every 5 seconds
*/
function setColors() {
	var element = flip? elements[1] : elements[0];
	var options = {};
	options[element] = randomColor();
	var interval = trip? sec1: sec5;
	$("#main").animate(options, interval, 'linear', function() {	
		if(loading.length > 0){
			loading=[];
			if (current_menu == settings)updateSettingsMenu();
		}
		setSolidColors();
		setColors();
	});
}

//MAIN MENU
var current_menu;
	
function isLoading(option){
	return loading.indexOf(option) > -1;
}

function changeMenuItemText(index, text){
	var id = "menu-item-" + index;
	document.getElementById(id).innerHTML = text;
}

var main_menu = {
	"Daily Practice" : "",
	"Learn a Language" : "",
	"The Interview" : "loadMenu(the_interview, 1);",
	"Quick Play" : "",
	"Find a Game" : "loadMenu(find_a_game, 1);",
	"Settings" : "loadSettingsMenu(1);"
}

//The Interview
var the_interview = {
	"Back": "loadMenu(main_menu,2);",
	"Google" : "",
	"Amazon" : "",
	"Facebook" : "",
	"Microsoft" : "",
	"Valve" : ""
}

//Find a Game
var find_a_game = {
	"Back": "loadMenu(main_menu, 4);",
	"Bridge and Torch" : "loadGame(\"games/river-crossing/bridge-and-torch/bridge-and-torch.html\");",
	"Monty Hall Problem" : "",
	"Language-Specific" : "",
	"Algorithms" : ""
}

//SETTINGS - defaults
var settings ={},
	night = false,
	flip = false,
	trip_option = false,
	trip = false;

function toggleSetting(option){
	loading.push(option);
	updateSettingsMenu();
	switch(option){
		case "night":
			night = !night;
			setSolidColors();
			break;
		case "flip":
			flip = !flip;
			break;
		case "trip":
			trip = !trip;
			break;
	}
}

function getSettingText(option){
	switch(option){
		case "night":
			return isLoading(option)? 
				"Wait for it..."  : 
				night? "Day Mode" : "Night Mode";
			break;
		case "flip":
			return isLoading(option)? 
				"Swapping..." : "Swap Colors";
			break;
		case "trip":
			return isLoading(option)? 
				trip? "Buzzkilling..." : "Generating Party..." :
				trip? "Buzzkill" : "Party Time";
			break;
	}
}

function updateSettingsMenu(){
	var index = 1;
	var settings = ["night", "flip"];
	if(trip_option)settings[2]="trip";
	for (var setting in settings){
		changeMenuItemText(index++, getSettingText(settings[setting]));
	}
}


function loadSettingsMenu(focus){
	settings = {};
	
	settings["Back"]= "loadMenu(main_menu, 5);";
	
	settings[getSettingText("night")]= "toggleSetting(\"night\");";
	
	settings[getSettingText("flip")]= "toggleSetting(\"flip\");";
	
	if(trip_option)settings[getSettingText("trip")]= "toggleSetting(\"trip\");";
	
	settings["My Languages"]= "loadMyLanguages(1);";
	
	loadMenu(settings, focus);
}

//My Languages
var my_languages_menu = {};

function toggleLanguage(language){
	var index = languages.indexOf(language) + 1;
	var myindex = my_languages.indexOf(language);
	if(myindex < 0){//not my language? add it
		my_languages.push(language);
		changeMenuItemText(index, language);
	}
	else{//remove it
		my_languages.splice(myindex, 1);
		changeMenuItemText(index, "<S>" + language + "</S>");
	}
}

function loadMyLanguages(){
	my_languages_menu = {"Back": "loadSettingsMenu(0)"};
	for (var language in languages){
		language = languages[language]; //ugh
		var myindex = my_languages.indexOf(language);
		if(myindex < 0){//not my language? cross it out
			my_languages_menu["<S>" + language + "</S>"] = "toggleLanguage(\"" + language + "\");";
		}
		else{//keep it
			my_languages_menu[language] = "toggleLanguage(\"" + language + "\");";
		}
	}
	loadMenu(my_languages_menu, 1);
}


//CRUCIAL, everytime there's a change to the menu, this loads the HTML
//menu - associate array of items {Name : onClick}
//focusindex - index of menu item to be focused on when drawing menu
function loadMenu(menu, focus){
	var html = "";
	var index=0;
	for (var option in menu){
		html+= "<li><a href='#' ";
		html+="id='menu-item-" + index + "' ";
		html+= "onclick='" + menu[option] + "' ";
		html+= ">" + option + "</a></li>\n";
		index++;
	}
	
	//get the currently focused element before switching
	var focus = (document.activeElement.tagName=="A" && focus==undefined)?
		"#" + document.activeElement.id : "#menu-item-" + focus;
	
	//do the switch
	document.getElementById('menu').innerHTML = html;
	
	//focus on the focusindex
	$(focus).focus();
	bindUI(index);//allows looping list
	
	current_menu = menu;
}

//binds arrow keys, tabs, and mouse to navigate menu
function bindUI(length){
	var TAB = 9,
		UP = 38,
		DOWN = 40,
		W = 87,
		S = 83;
		
	$('#menu a').bind('keydown focus',function(e){
		var link = e.target.id;
			id = link.split('-')[2],
			SHIFT = e.shiftKey;
		
		if(e.keyCode == UP ||
			e.keyCode == W ||
			(e.keyCode == TAB && SHIFT)){
			id--;
		}
		else if(e.keyCode == DOWN || 
				e.keyCode == S ||
				(e.keyCode == TAB && !SHIFT)){
			id++;
		}
		else return;
		
		if(id<0)id+=length;
		id = id%length;
		var element = "#menu-item-" + id;
		e.preventDefault();
		$(element).focus();
	});
	
	$('#menu a').bind('mouseover',function(e){
		this.focus();
	});
}

//Switches between game and main layers
function toggleMainMenu(){
	if(isLoading("toggle"))return;
	loading.push("toggle");//loading toggle
	var mainmenu = $('#main');
	var options = ["fadeIn", "fadeOut"];
	if(mainmenu.hasClass(options[1])){ //if main menu is hidden, reveal it
		mainmenu.toggle();
		loadMenu(main_menu, 0);
		mainmenu.addClass(options[0]);
		mainmenu.removeClass(options[1]);
	}
	else{//otherwise, hide it
		mainmenu.addClass(options[1]);
		mainmenu.removeClass(options[0]);
		mainmenu.one('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd' , function(e){
					$('#main ul').removeClass(options[0]);
					mainmenu.toggle();
					var index = loading.indexOf("toggle");
					loading.splice(index, 1);
					});
	}
}


function setMainUI(){	
	$('#main').bind('mousedown',function(e){ //prevent other mouse clicks
		if(!$(e.target).is("a")) e.preventDefault();
	});
	
	var easter_egg = new Konami(function(){
		if(!trip_option){
			trip_option = true;
			if(current_menu == settings)loadSettingsMenu(3);
			alert("Added 'Party Time' to settings");
		}
	});
}

function loadGame(html){
	toggleMainMenu();
	
	$("#game").load(html);
}
 
$(document).ready(function() {
	loadMenu(main_menu, 0);
	setMainUI();
	setSolidColors();
	setColors();
	//loadGame("games/river-crossing/bridge-and-torch/bridge-and-torch.html");
}); 

