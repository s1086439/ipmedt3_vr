<!DOCTYPE HTML>

<?php
	//include '/php/getTweets.php';
?>

<html>
<head>
  <meta charset="UTF-8">
  <link href="/css/styles.css" rel="stylesheet" type="text/css">
  <script src="/js/jquery-3.1.1.min.js"></script>
  <script src="/js/start.js"></script>
  <script src="/js/tweets.js"></script>
</head>
<body>
<div id="row-1">
  <div id="banner">
    <h1>Aanbevolen configuratie:</h1>
    <div id="table-1">
        <img class="hint-knop" id="smartphone-img" src="/images/smartphone.png" alt="Cardbox">
        <img class="hint-knop" id="browsers-img" src="/images/browsers.png" alt="Chrome/Firefox">
        <img class="hint-knop" id="cardbox-img" src="/images/cardbox.png" alt="Smiley face">
        <img class="hint-knop" id="controller-img" src="/images/controller.png" alt="Controller">
    </div>
  </div>
  <hr>
</div>
<div id="tooltip"></div>
<div id="row-2">
  <div id="vr">
    <div id="start">
      <img id="play" src="/images/play.png" alt="Play">
      <dl id="start-tekst">START IKEA VR</dl>
    </div>
  </div>
</div>
<div id="row-3">
  <div id="footer">
    <img id="uvr" src="/images/Logo_IPMEDT3_U_640x200.png" alt="Logo">

    <div id="melding">
      <img class="sluit-knop" id="sluiten-img" src="/images/icons/sluiten.png" alt="Sluiten">
      <p>Final prototype. Gericht op Android met Google Chrome. Audio op mobiel werkt enkel optimaal met het uitschakelen van de volgende Chrome flag (chrome://flags): Vereiste voor gebaar voor het afspelen van media.</p>
    </div>
  </div>
</div>
</body>
</html>
