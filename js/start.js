var tooltips = ["Smartphone met gyroscoop", "Nieuwste versie van Google Chrome", "VR-bril", "VR-PARK controller. 1: Power button indrukken, 2: Verbinden via Bluetooth, 3: '@' + 'C' indrukken op controller. Stick om te bewegen, bovenste schouderknop voor interactie."];

$(document).ready(function(){
  input();
  $("#row-3").css("background-color", "#ba3737");
});

function vervagenPagina(){
  $("html").fadeOut(2000, function() {
    window.location.replace("vr.html");
  });
}

function vervangenTekst(tooltip, e){
  $("#table-1 img").not(e).css("opacity", ".3");
  $("#tooltip").fadeOut(300, function() {
    $("#tooltip").css("visibility", "visible");
    $(this).text(tooltips[tooltip])
  }).fadeIn(250);
}

function input(){
  var current = null;
  $("#start").click(function(){
    $(this).fadeOut(300);
    vervagenPagina();
  });
  $("#table-1").on('click', 'img', function (e) {
    if(this != current){
      $("#table-1 img").css("opacity", "1");
      vervangenTekst($(this).index(), this);
      current = this;
    } else {
      current = null;
      $("#tooltip").fadeOut(300, function() {
        $("#table-1 img").css("opacity", "1");
        $("#tooltip").css("visibility", "hidden");
      }).fadeIn(300);
    }
  });
  $("#sluiten-img").click(function(){
    $(this).parent().remove();
    $("#row-3").css("background-color", "white");
    $("#uvr").show();
  });
}
