// Android input

window.addEventListener('gamepadbuttondown', function (e) {
  var cursor = document.querySelector('a-entity[cursor]').components.cursor;

  // Schouderknop 1
  if (e.detail.index == 3) {
    var el = cursor.intersectedEl;
    el.emit('mousedown');
  }

  // C
  if (e.detail.index == 2) {
      window.location.reload(false);
    }
});
