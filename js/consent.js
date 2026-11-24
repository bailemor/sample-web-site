// Cookie consent for the LinkedIn Insight Tag (opt-in).
// The LinkedIn tag loads only after a visitor selects "Accept". Nothing loads
// before that, and "Decline" keeps it off. The choice is kept in this browser
// for 12 months, then the banner asks again. "Cookie settings" in the footer
// reopens the banner at any time.
// Cloudflare Web Analytics is cookieless and is not controlled here.
(function () {
  var config = window.BM_ANALYTICS || {};
  var partnerId = String(config.linkedinPartnerId || '').trim();
  if (!/^\d+$/.test(partnerId)) return; // No valid partner ID yet: do nothing.

  var KEY = 'bm-analytics-consent';
  var MAX_AGE = 365 * 24 * 60 * 60 * 1000;

  function readChoice() {
    try {
      var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (saved && (saved.choice === 'accepted' || saved.choice === 'declined') && Date.now() - saved.at < MAX_AGE) return saved.choice;
    } catch (e) {}
    return null;
  }
  function saveChoice(choice) {
    try { localStorage.setItem(KEY, JSON.stringify({ choice: choice, at: Date.now() })); } catch (e) {}
  }

  var loaded = false;
  function loadLinkedIn() {
    if (loaded) return;
    loaded = true;
    window._linkedin_partner_id = partnerId;
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(partnerId);
    if (!window.lintrk) {
      window.lintrk = function (a, b) { window.lintrk.q.push([a, b]); };
      window.lintrk.q = [];
    }
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
    document.head.appendChild(s);
  }

  var banner = null;
  function buildBanner() {
    banner = document.createElement('section');
    banner.className = 'consent';
    banner.setAttribute('aria-labelledby', 'consent-title');
    banner.hidden = true;
    banner.innerHTML =
      '<div class="wrap">' +
        '<div class="consent-text">' +
          '<h2 id="consent-title">Can we use LinkedIn cookies?</h2>' +
          '<p>With your permission, LinkedIn sets cookies that give us anonymous, combined reports on the job titles, industries and company sizes of our visitors. We never see who you are. Our own visitor counts do not use cookies. <a href="privacy.html#cookies-and-analytics">Read our Privacy Policy</a>.</p>' +
        '</div>' +
        '<div class="consent-actions">' +
          '<button type="button" class="consent-btn" data-choice="accepted">Accept</button>' +
          '<button type="button" class="consent-btn" data-choice="declined">Decline</button>' +
        '</div>' +
      '</div>';
    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-choice]');
      if (!btn) return;
      var choice = btn.getAttribute('data-choice');
      var before = readChoice();
      saveChoice(choice);
      hide();
      if (choice === 'accepted') loadLinkedIn();
      // Withdrawing consent: reload so the LinkedIn script is no longer running.
      else if (loaded || before === 'accepted') window.location.reload();
    });
    document.body.appendChild(banner);
  }
  var opener = null;
  function show() {
    if (!banner) buildBanner();
    banner.hidden = false;
    var current = readChoice();
    var first = banner.querySelector('[data-choice="' + (current || 'accepted') + '"]');
    if (opener && first) first.focus();
  }
  function hide() {
    banner.hidden = true;
    if (opener) { opener.focus(); opener = null; }
  }

  // Footer "Cookie settings" buttons stay hidden until a partner ID is set.
  var settings = document.querySelectorAll('[data-cookie-settings]');
  for (var i = 0; i < settings.length; i++) {
    var item = settings[i].closest('li') || settings[i];
    item.hidden = false;
    settings[i].addEventListener('click', function (e) { opener = e.currentTarget; show(); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && banner && !banner.hidden && opener) hide();
  });

  var choice = readChoice();
  if (choice === 'accepted') loadLinkedIn();
  else if (choice === null) show();
})();
