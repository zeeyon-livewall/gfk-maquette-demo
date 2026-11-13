// Comportements du site de démonstration GFK : menu mobile et mise à l'échelle de la charte.
(function () {
  var sb = document.querySelector('.sb');
  var btn = document.querySelector('.nav-toggle');
  if (sb && btn) {
    btn.addEventListener('click', function () {
      var open = sb.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
  }

  var board = document.getElementById('board-scale');
  if (board) {
    var fit = function () {
      var avail = document.documentElement.clientWidth - 32;
      var s = Math.min(1, avail / 1440);
      board.style.transform = 'scale(' + s + ')';
      board.parentElement.style.height = Math.ceil(960 * s) + 'px';
    };
    fit();
    window.addEventListener('resize', fit);
  }
})();
