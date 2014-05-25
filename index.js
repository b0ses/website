function type(string, id, speed){
	id="#" + id;
	stringindex=0;
	var write = setInterval(function(){
		$(id).val(string.substring(0,stringindex+1));
		stringindex++;
		if(stringindex==string.length+1)clearInterval(write);
	}, speed);
}

function enter(logtext){
	//Hit Enter
	var input = document.getElementById("console");
	var log = document.getElementById("log");
	var string = (logtext) ? logtext : input.value;
	log.innerHTML = ">" + string + "<br/>";
	input.value = "";
	$("#log").removeClass("fadeOut").delay(3000).queue(function(next){
	 $("#log").addClass("fadeOut");
	 next();
	});
	return string;
}

function samePageClick(page){
		var url = "" + document.location;
        return url.substring(url.lastIndexOf("/") + 1) == page;
    }
    
function swapPage(page){    
	//fadeBanner
	var bannerfaded = false;
	$("#banner").removeClass('fadeIn');
	$("#banner").addClass('fadeOut s1');
	$("#banner").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		bannerfaded = true;
	});
	
	//fadeText
	var textfaded = false;
	$("#content-container").removeClass('fadeInUp');
	$("#content-container").addClass('fadeOutDown s1');
	$("#content-container").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		textfaded = true;
	});
	
	//wait till everyone's ready
	var interval = window.setInterval(function(){
		if(textfaded && bannerfaded){
			loadPage(page)
			$("#banner").removeClass('fadeOut');
			$("#banner").addClass('fadeIn');
			$("#content-container").removeClass('fadeOutDown');
			$("#content-container").addClass('fadeInUp');
			clearInterval(interval);
		}
	}, 100);
}

var pushed=false;
function drawLinks(){
	//Add functionality to links to subpages
	$('.home-link').bind('click',function(e){
		e.preventDefault();
		if(samePageClick("home"))return;
		document.getElementById("log").innerHTML = ">cd " + "home";
		history.pushState(null, null, "/");
		pushed=true;
		swapPage("home");
	});
	$('.history-link').bind('click',function(e){
		e.preventDefault();
		if(samePageClick("history"))return;
		document.getElementById("log").innerHTML = ">cd " + "history";
		history.pushState(null, null, "history");
		pushed=true;
		swapPage("history");
	});
	$('.technical-link').bind('click',function(e){ 
		e.preventDefault();
		if(samePageClick("technical"))return;
		document.getElementById("log").innerHTML = ">cd " + "technical";
		history.pushState(null, null, "technical");
		pushed=true;
		swapPage("technical");
	});
}

function onPageLoad(page){
	drawLinks();
	if(page=="technical"){
		var experience = {
			labels : ["Android", "Haskell", "Prolog", "OS X","MIPS", "XML", "XUL", "mySQL", "SQL", "Drupal", "PHP", "Python", "Adobe Dreamweaver", "jQuery", "C", "C++", "Unix", "Adobe Photoshop", "Javascript", "Java", "CSS","HTML"],
			datasets : [
				{
					fillColor : "rgba(153,0,0,0.8)",
					strokeColor : "rgba(222,214,149,1)",
					data : [.5, .5, .5, .5, .5 , .5, .5, 1, 1, 1, 1, 1, 1, 1, 1.5, 1.5, 2, 2, 2, 3, 4, 4]
				}
			]
		}
		var proficiency = {
			labels : ["Haskell", "Prolog", "OS X", "MIPS", "XUL", "XML", "Android", "Unix", "C", "PHP", "mySQL", "SQL", "Adobe Photoshop", "C++", "jQuery", "Python", "Drupal", "Adobe Dreamweaver", "Javascript", "Java", "CSS","HTML"],
			datasets : [
				{
					fillColor : "rgba(153,0,0,0.8)",
					strokeColor : "rgba(222,214,149,1)",
					data : [3, 3, 3, 3, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 10, 10]
				}
			]
		}
		var experience_settings = {
			scaleFontSize : 16,
			scaleOverride:true,
			scaleSteps:10,
			scaleStepWidth:.5,
			scaleStartValue:0
		};
		var proficiency_settings = {
			scaleFontSize : 16,
			scaleOverride:true,
			scaleSteps:10,
			scaleStepWidth:1,
			scaleStartValue:0
		};
		var experience_bar = document.getElementById("experience-bar");
		var proficiency_bar = document.getElementById("proficiency-bar");
		new Chart(experience_bar.getContext("2d")).HorizontalBar(experience, experience_settings);
		new Chart(proficiency_bar.getContext("2d")).HorizontalBar(proficiency, proficiency_settings);
	}
}

function loadPage(page){
	document.title = (page=="home")? "Daniel Boos" : "Daniel Boos - " + page.charAt(0).toUpperCase() + page.substring(1);
	$("#log").removeClass("fadeOut");
	$("#banner").css('background-image', 'url(images/banner/' + page + '.png)');
	$("#content-container").load(page + ".html #content", function(){onPageLoad(page)});
	$("#console").focus();
	$("#log").addClass("animated fadeOut");
}

//START EVERYTHING
$(function() {
	//Don't show if IE<10
	if (!history.pushState) {
		$("html").html("Please upgrade your browser.");
	}


	var pages = ["home", "history", "technical"];
	
	function getCurrentPage(){
		var current_page= location.pathname.substring(1); //in lowercase
		return (current_page.length == 0)? "home":current_page;
	}
	
	if($.cookie("test")==null){
		//as the page loads, introduce the site
		$("#banner h1").css("visibility", "visible");
		$("#banner h1").css("color", "black");
		$("#console").css("visibility", "visible");
		$("#console").css("color", "black");
		var site = "Daniel Boos";
		if(getCurrentPage() != "home") site += " - " + getCurrentPage().charAt(0).toUpperCase() + getCurrentPage().substring(1);
		type(site, "console", 50);
	}
	
	loadPage(getCurrentPage());
	
	//runs everytime the user goes back
    window.addEventListener("popstate", function(e) {
		if(pushed) swapPage(getCurrentPage());
    });
    
	//Konami Code
    var konami = false;
    var easter_egg = new Konami(function(){
        $("#name-image").addClass('hinge');
	});
    
	//CONSOLE
    $("#console").keyup(function (e){
        if (e.keyCode == 13) { //ENTER KEY HIT
           var string = enter();
		   
		   //Empty string
		   if(string == "")return;
		   
		   //Help Command
		   if(string == "help"){
			document.getElementById("log").innerHTML = ">cd [page]" + "<br/>" + "ls";
			return;
		   }
		   
		   //ls Command
		   if(string.substring(0, 2) == "ls"){
			document.getElementById("log").innerHTML = ">Resume.doc" + "<br/>"
														+ "Resume.pdf" + "<br/>"
														+ "logiclab.exe" + "<br/>"
														+ "nim.d.rar" + "<br/>"
														+ "Final Paper G5.pdf" + "<br/>"
														+ "timemanagementfinal.xpi" + "<br/>";
			return;
		   }
		   
		   //CD Command
		   if(string.substring(0, 3) == "cd "){
		    var oldstring = string;
			string = string.substring(3).toLowerCase();
			if(string == "~" || string == "/")string="home";
			if(string == ".."){
				window.history.go(-1);
				return;
			}
			if(string == null || pages.indexOf(string) < 0){
				document.getElementById("log").innerHTML = ">" + oldstring + ": No such file or directory";
				return;
			}
			if(samePageClick(string)){
				return;
			};
			swapPage(string);
			history.pushState(null, null, string);
			pushed=true;
			return;
		   }
		   
		   //Download Files
		   if(string.toLowerCase() == "resume.doc"){
			 window.open('Downloads/Resume.doc');
			 return;
		   }
		   if(string.toLowerCase() == "resume.pdf"){
			 window.open('Downloads/Resume.pdf'); 
			 return;
		   }
		   
		   //Projects
		   if(string.toLowerCase() == "logiclab.exe"){
			 window.open('logiclab/index.html'); 
			 return;
		   }
		   if(string.toLowerCase() == "nim.d.rar"){
			 window.open('Downloads/nim.d.rar'); 
			 return;
		   }
		   if(string == "Final Paper G5.pdf"){
			 window.open('Downloads/Final%20Paper%20G5.pdf'); 
			 return;
		   }
		   if(string.toLowerCase() == "timemanagementfinal.xpi"){
			 window.open('Downloads/timemanagementfinal.xpi'); 
			 return;
		   }
		   
		   
		   
		   
		   document.getElementById("log").innerHTML = ">command not found: \'" + string + "\'. Type \'help\' for commands.";
        }
    });	
});

//once page's loaded, fadeIn
$(window).load(function() {
		if($.cookie("test")==null){
			setTimeout(function(){
				$("html").css("visibility", "visible");
				$("html").css("background", "none");
				$("html").addClass("animated fadeIn s1");
				$("#banner h1").css("color", "rgba(255,255,255,0.75)");
				$("#console").css("color", "rgba(255,255,255,0.75)");
				$('html').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
					$("html").removeAttr('class');
				});
				enter();
				$.cookie("test", 1);
			}, 2000);
		}
		else {
			$("html").css("visibility", "visible");
				$("html").addClass("animated fadeIn s1");
				$("#banner h1").css("color", "rgba(255,255,255,0.75)");
				$("#console").css("color", "rgba(255,255,255,0.75)");
				$('html').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
					$("html").removeAttr('class');
				});
				enter();
		}
}); 

