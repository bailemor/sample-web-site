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
// Services dropdown: hover or keyboard focus opens it; the arrow button opens and closes it on touch screens.
// Escape or a click elsewhere closes it until the pointer or focus leaves.
(function () {
  var item = document.querySelector('.site-nav .has-sub');
  if (!item) return;
  var btn = item.querySelector('.sub-toggle');
  function setOpen(open) {
    btn.setAttribute('aria-expanded', String(open));
    btn.firstChild.textContent = open ? 'Hide services' : 'Show services';
    item.setAttribute('data-open', String(open));
  }
  function reset() { if (btn.getAttribute('aria-expanded') !== 'true') item.removeAttribute('data-open'); }
  btn.addEventListener('click', function () { setOpen(btn.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('click', function (e) { if (!item.contains(e.target) && btn.getAttribute('aria-expanded') === 'true') { setOpen(false); reset(); } });
  item.addEventListener('mouseleave', reset);
  item.addEventListener('focusout', function (e) { if (!item.contains(e.relatedTarget)) { if (btn.getAttribute('aria-expanded') === 'true') setOpen(false); reset(); } });
  item.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && btn.offsetParent !== null) { e.stopPropagation(); setOpen(false); btn.focus(); }
  });
})();
