$(document).ready(function(){
	init();
});

Pace.on("done", function(){
	$("#scene").fadeTo(5000, 1);
});

// AFRAME.registerComponent('update-text', {
//   init: function () {
//     $('#object-title').attr("bmfont-text", "text: Bed in elkaar zetten");
//   }
// });

// Raycast component voor de cursor om de tekst (#object-title) te vernieuwen aan de hand van het gehoverde object

AFRAME.registerComponent('cursor-listener', {
  init: function () {
    this.el.addEventListener('mouseenter', function () {
			//document.querySelector('a-entity[cursor]').emit('hovering');

			//  $('#object-title').attr({"bmfont-text": 'text:'+this.id+'', "position": $(this).attr("position")});
			//  document.querySelector('#object-title').setAttribute('position', {x: this.getAttribute('position').x, y: this.getAttribute('position').y + 7, z: this.getAttribute('position').z});
    });
		this.el.addEventListener('mouseleave', function () {
			document.querySelector('a-entity[cursor]').emit('leaving');

			//  $('#object-title').attr({"bmfont-text": 'text:'+this.id+'', "position": $(this).attr("position")});
			//  document.querySelector('#object-title').setAttribute('position', {x: this.getAttribute('position').x, y: this.getAttribute('position').y + 7, z: this.getAttribute('position').z});
    });
  }
});

// Transparant maken van het voorbeeld van het bed

AFRAME.registerComponent('bed-onderdelen', {
  schema: {opacity: {default: 1}},
  update: function () {
    var opacity = this.data.opacity;
    var children = [].slice.call(this.el.children);
    children.filter(function (child) { return child.hasAttribute('position'); }).forEach(function (child) {
        child.setAttribute('material', 'opacity', opacity);
    });
  }
});

var instructie;
var geplaatseObjecten = [];
var schroevendraaierObject = false;
var hamerObject = false;
var draagObject = null;
var volgenInstructies = false;
var fadeInOpacity = 0;
var fadeOutOpacity = 1;
var objectenCompleet = 0;
var achtergrondMuziek;
var draaienTimer;

function init() {
	var updateTimer = setInterval(update, 10);
	startInterval = setInterval(start, 10);
	var positieGebruiker;
	var positieHand;
	var instructieStappenArray;
	afspelenGeluid("buiten");
	input();
}

// Bepalen of de gebruiker bij de deur staat. Zo ja, open deur

function start(){
	if(positieGebruiker.x > 6 && positieGebruiker.x < 11 && positieGebruiker.z < 22) {
		clearInterval(startInterval);
		afspelenGeluid("deur_open");
		document.querySelector('#deur').emit('rotate');
		$("#omgeving-audio").animate({volume: 0}, 1000, function() {
			var entity = document.querySelector("#radio");
			entity.components.sound.playSound();
			$("#camera").attr("wasd-controls", "enabled: true; acceleration: 200");
  	});
	}
	if(positieGebruiker.z < 22 && positieGebruiker.x < 6 || positieGebruiker.z < 22  && positieGebruiker.x > 11) {
		$("#camera").attr("wasd-controls", "enabled: false");
	}

}

// Gebruikers- en rotatiepositie vernieuwen

function update(){
	positieGebruiker = $("#camera").attr("position");
	rotatieGebruiker = $("#camera").attr("rotation");
}

/*
	DraagObject bepalen
	Object aan camera toevoegen
	x, y, z als offset
*/

function dragenObject(object, x, y, z){
	draagObject = object;
	camera.add(object);
	$(object).attr("position", ''+x+' '+y+' '+z+'');
}

function loslatenObject(object){
	camera.remove(object);
	$(object).attr({"position": ''+-positieGebruiker.x+' 0 '+-positieGebruiker.z+'', "rotation": '0 '+rotatieGebruiker.y+' 0'});
	document.querySelector("a-entity[bed-onderdelen]").add(object);
	$("#"+object.id+"-voorbeeld").attr("material", "shader: flat; color: #3e66a8; opacity: .3");
	$("#pijl").attr({"position": '0 0 0', "visible": "false"});
	schroevendraaierObject = false;
	draagObject = null;
	afspelenGeluid($(object).attr("class").split(' ')[1]);
}

// Selecteren bijbehorend geluid bij interactie

function afspelenGeluid(geluid){
	var omgevingAudio = $("#omgeving-audio");
	var jsAudio = $("#interactie-audio");
	var radioAudio = document.querySelector('#radio').components.sound;
	switch(geluid){
		case "hout":
			jsAudio.attr("src", "audio/wood_impact_"+Math.floor(Math.random()*(3-1+1)+1)+".mp3");
			jsAudio[0].play();
			jsAudio.animate({volume: 1}, 5000);
			break;
		case "schroevendraaier":
			jsAudio.attr("src", "audio/screwdriver_1.mp3");
			jsAudio[0].play();
			break;
		case "radio":
			jsAudio.attr("src", 'audio/screwdriver_1.mp3');
			jsAudio[0].play();
			radioAudio.pause();
			break;
		case "aandraaien":
			jsAudio.attr("src", 'audio/schroef_draaien_'+Math.floor(Math.random()*(3-1+1)+1)+'.mp3');
			jsAudio[0].play();
			break;
		case "papier":
			jsAudio.attr("src", 'audio/paper_2.mp3');
			jsAudio[0].play();
			break;
		case "schroeven_compleet":
			jsAudio.attr("src", 'audio/schroeven_compleet.mp3');
			jsAudio[0].play();
			break;
		case "negatief":
			jsAudio.attr("src", 'audio/negatief.mp3');
			jsAudio[0].play();
			break;
		case "klaar":
			jsAudio.attr("src", 'audio/klaar.mp3');
			jsAudio[0].play();
			break;
		case "einde":
			radioAudio.pause();
			jsAudio.attr("src", 'audio/hep_cats.mp3');
			jsAudio.volume = .5;
			jsAudio[0].play();
			break;
		case "deur_open":
			jsAudio.attr("src", 'audio/deur_open.mp3');
			jsAudio.volume = .3;
			jsAudio[0].play();
			break;
		case "deur_dicht":
			jsAudio.attr("src", 'audio/deur_dicht.mp3');
			jsAudio.volume = .3;
			jsAudio[0].play();
			break;
		case "licht_switch":
			omgevingAudio[0].volume = 0;
			jsAudio.attr("src", 'audio/licht_switch.mp3');
			jsAudio.volume = 1;
			jsAudio[0].play();
			break;
		case "buiten":
			omgevingAudio.attr("src", 'audio/buiten.mp3');
			omgevingAudio[0].volume = 0;
			omgevingAudio[0].play();
			omgevingAudio.animate({volume: 1}, 5000);
			break;
		case "binnen":
			break;
	}
}

function plaatsenObject(voorbeeldObject, object){
	afspelenGeluid("hout");
	$("#pijl").attr({"position": '0 0 0', "visible": "false"});
	volgenInstructies = true;
	geplaatstObject = object;
	draagObject = null;
	geplaatseObjecten.push(geplaatstObject);
	var voorbeeldObjectPositie = $(voorbeeldObject).attr("position");
	var voorbeeldObjectRotatie = $(voorbeeldObject).attr("rotation");
	camera.remove(geplaatstObject);
	$(geplaatstObject).attr({"position": ''+voorbeeldObjectPositie.x+' '+voorbeeldObjectPositie.y+' '+voorbeeldObjectPositie.z+'', "rotation": "0"});
	$(voorbeeldObject).attr("material", "shader: flat; color: green; opacity: 0");
	document.querySelector("a-entity[bed-onderdelen]").add(geplaatstObject);
	if($("[class*='schroefgat-"+object.id+"']").length != 0){
		instruerenSchroef(geplaatstObject);
	} else {
		voltooienObject();
		if(objectenCompleet == 9){
			voltooienSpel();
		}
	}
}

/*
	Instructies voor het plaatsen van schroeven
	Als het bedonderdeel schroeven nodig heeft dan worden deze geplaatst in een array
	Schroeficoon wordt verplaatst aan de hand van de voortgang van de gebruiker en het schroef object in de array
*/

function instruerenSchroef(object){
	var schroefDraai = 0;
	var schroeven = [];
	var schroefNummer = 0;

	$("[class*='schroefgat-"+object.id+"']").each(function(i){
		schroeven.push(this);
	});

	var pijlPosY = $(schroeven[schroefNummer]).attr("position").y + 2;
	$("#schroevendraaier-icoon").attr({"position": ''+$(schroeven[schroefNummer]).attr("position").x+' '+$(schroeven[schroefNummer]).attr("position").y+' '+$(schroeven[schroefNummer]).attr("position").z+'', "visible": "true"});
	$("#pijl").attr({"position": ''+$(schroeven[schroefNummer]).attr("position").x+' '+pijlPosY+' '+$(schroeven[schroefNummer]).attr("position").z+'', "visible": "true", "rotation": "0 0 -90"});

	$("#schroevendraaier-icoon").mousedown(function(){
		if(schroevendraaierObject == true){
			if(schroefNummer < schroeven.length){
				afspelenGeluid("aandraaien");
				schroefDraai++;
				$("#schroevendraaier-icoon").attr("src", '#schroevendraaier-icoon-'+schroefDraai+'-img');
				if(schroefDraai == 3){
					schroefNummer++;
					schroefDraai = 0;
					$("#schroevendraaier-icoon").attr("src", '#schroevendraaier-icoon-'+schroefDraai+'-img');
				}
				if(schroeven.length == schroefNummer){
					schroefNummer = 0;
					schroeven = [];
					$("#schroevendraaier-icoon").attr({"position": '0 0 0', "visible": "false"});
					$("#pijl").attr({"position": '0 0 0', "visible": "false"});
					voltooienObject();
					if(objectenCompleet == 9){
						loslatenObject(draagObject);
						voltooienSpel();
					}
				} else {
					var pijlPosY = $(schroeven[schroefNummer]).attr("position").y + 2;
					$("#schroevendraaier-icoon").attr({"position": ''+$(schroeven[schroefNummer]).attr("position").x+' '+$(schroeven[schroefNummer]).attr("position").y+' '+$(schroeven[schroefNummer]).attr("position").z+'', "visible": "true"});
					$("#pijl").attr({"position": ''+$(schroeven[schroefNummer]).attr("position").x+' '+pijlPosY+' '+$(schroeven[schroefNummer]).attr("position").z+'', "visible": "true", "rotation": "0 0 -90"});
				}
			}
		}
	});
}

// De gebruiker heeft alle schroeven aangedraaid. Het object is geplaatst en voltooid

function voltooienObject(){
	afspelenGeluid("schroeven_compleet");
	objectenCompleet++;
	volgenInstructies = false;
}

/*
	Bijhouden user input
	Bij het plaatsen van het object wordt er o.a. vergeleken of het draagObject gelijk is aan het voorbeeldObject
*/

function input(){
	$("a-obj-model").mousedown(function(){
		if($(this).parent().attr("id") == "bed-onderdelen" && jQuery.inArray(this, geplaatseObjecten) == -1 && draagObject == null && volgenInstructies == false){
			$("#"+this.id+"-voorbeeld").attr("material", "shader: flat; color: green; opacity: .3");
			var pijlPosX = $("#"+this.id+"-voorbeeld").attr("position").x - 2;
			var pijlPosY = $("#"+this.id+"-voorbeeld").attr("position").y + 2;
		 $("#pijl").attr({"visible":"true", "position": ''+pijlPosX+' '+pijlPosY+' '+$("#"+this.id+"-voorbeeld").attr("position").z+'', "rotation": "0 0 0"});
			dragenObject(this, 0, -2, -6);
		}
		else if($(this).parent().attr("id") == "bed-onderdelen" || $(this).parent().attr("id") == "bed-onderdelen" && volgenInstructies == true){
			afspelenGeluid("negatief");
		}
		else if($(this).parent().attr("id") == "bed-voorbeeld"){
			if(this.id == ($(draagObject).attr("id")+"-voorbeeld")){
				plaatsenObject(this, draagObject);
			}
		}
		else if($(this).attr("class").split(' ')[1] == "papier"){
			dragenObject(this, 0, -2, -6);
			$(this).attr("rotation", "80 0 0");
		}
		else if(this.id == "schroevendraaier"){
			schroevendraaierObject = true;
			dragenObject(this, 0, -2, -6);
		}
		else if(this.id == "inbussleutel"){
			inbussleutelObject = true;
			dragenObject(this, 0, -2, -6);
		}
		else if(this.id == "hamer"){
			hamerObject = true;
			dragenObject(this, 0, -2, -6);
		}
		else if(this.id == "radio"){
			radioObject = true;
			dragenObject(this, 0, -2, -6);
		}
		else if($(this).attr("class") == "overige"){
			dragenObject(this, 0, -2, -6);
		}
	});
	$("#floor").mousedown(function(){
		if(draagObject != null){
			loslatenObject(draagObject);
		}
	});
}

function fadeInLicht() {
	var lightList = document.getElementsByClassName("light");
	if(fadeInOpacity > 1){
		clearInterval(vervagen);
		fadeInOpacity = 0;
	} else {
			for (index = 0; index < lightList.length; ++index) {
		    lightList[index].setAttribute("light", "intensity", fadeInOpacity);
			}
			document.getElementById("sky").setAttribute('opacity', fadeInOpacity);
			fadeInOpacity += .01;
		}
};

function fadeOutLicht(sceneVan, sceneNaar){
	var lightList = document.getElementsByClassName("light");
	if(fadeOutOpacity < 0){
		clearInterval(vervagen);
		fadeOutOpacity = 1;
		$("#scene-group-"+sceneVan).attr("visible", "false");
		if(sceneNaar){
			$("#scene-group-"+sceneNaar).attr("visible", "true");
			vervagen = setInterval(fadeInLicht, 10);
		}
	} else {
			for (index = 0; index < lightList.length; ++index) {
				lightList[index].setAttribute("light", "intensity", fadeOutOpacity);
			}
			document.getElementById("sky").setAttribute('opacity', fadeOutOpacity);
			fadeOutOpacity -= .01;
	}
}

function voltooienSpel(){
	afspelenGeluid("klaar");
	$("#omgeving-audio").animate({volume: 0}, 2000, function() {
		afspelenGeluid("einde");
	});
	vervagen = setInterval(fadeOutLicht, 10, 1, 2);
	draaienBed(0.1);
}

function draaienBed(draaiSnelheid){
	var i = draaiSnelheid;
	var tijd = 0;
	draaienTimer = setInterval(function(){
		 tijd++;
		 document.getElementById('bed-voorbeeld-2').setAttribute('rotation', {x: document.getElementById('bed-voorbeeld-2').getAttribute('rotation').x, y: document.getElementById('bed-voorbeeld-2').getAttribute('rotation').y + i, z: document.getElementById('bed-voorbeeld-2').getAttribute('rotation').z})
		 if(tijd==1000){
			 afspelenGeluid("licht_switch");
			 var lightList =  document.getElementsByClassName("light");
			 document.getElementById("sky").setAttribute('opacity', .2);
			 for (index = 0; index < lightList.length; ++index) {
 		    lightList[index].setAttribute("light", "intensity", .2);
 			}
		 }
	 }, 10);
 }
