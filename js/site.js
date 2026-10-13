document.getElementById('year').textContent = new Date().getFullYear();
// Phone menu: the nav is always visible on wide screens; below 960px the button shows and hides it.
(function () {
  var btn = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  var narrow = window.matchMedia('(max-width: 960px)');
  function setOpen(open) {
    btn.setAttribute('aria-expanded', String(open));
    btn.lastChild.textContent = open ? 'Close' : 'Menu';
    nav.setAttribute('data-open', String(open));
  }
  btn.addEventListener('click', function () { setOpen(btn.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setOpen(false); btn.focus(); }
  });
  function sync() { if (narrow.matches) setOpen(false); else nav.removeAttribute('data-open'); }
  if (narrow.addEventListener) narrow.addEventListener('change', sync); else narrow.addListener(sync);
  sync();
})();
