/* Shared by every page: color themes, the moon, the footer year, the high five, the signup form. */
(function () {
  var root = document.documentElement;
  var LOCAL = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* Signup: Buttondown holds the email, Tally holds the optional questions. Blank = the section stays hidden on the live site. */
  var SIGNUP = { buttondown: 'tl2advisory', tally: 'https://tally.so/r/WOxNOe' }; /* Buttondown approved 2026.09.29 */
  /* Feedback: a footer link on every page. A Tally form URL here replaces the email route. */
  var FEEDBACK = { tally: 'https://tally.so/r/ODO0YM', mail: 'info@tl2advisory.com' };

  /* Themes. Navy is the default; the rest are one click away. */
  var THEMES = [
    { id: 'black', name: 'Black', meta: '#000000' },
    { id: 'navy', name: 'Navy', meta: '#101e2a' },
    { id: 'tl2', name: 'TL2 blue and orange', meta: '#ffffff' },
    { id: 'azimuth', name: 'Paper', meta: '#fafbf9' }
  ];
  function applyTheme(id) {
    var t = THEMES.filter(function (x) { return x.id === id; })[0] || THEMES[0];
    if (t.id === 'black') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', t.id);
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', t.meta);
    var b = document.getElementById('theme-btn');
    if (b) { b.title = 'Colors: ' + t.name + '. Click for the next set.'; b.setAttribute('aria-label', 'Change colors, now ' + t.name); }
    return t;
  }
  var cur = applyTheme(store('tl2-theme') || 'navy'); /* Navy is the default look (Tom, 2026.09.29); Black stays in the rotation. */
  var tb = document.getElementById('theme-btn');
  if (tb) tb.addEventListener('click', function () {
    var i = THEMES.map(function (x) { return x.id; }).indexOf(cur.id);
    cur = applyTheme(THEMES[(i + 1) % THEMES.length].id);
    store('tl2-theme', cur.id);
    if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: 'theme-' + cur.id, title: 'Theme ' + cur.name, event: true });
  });

  /* The moon: today's phase, drawn and described. Mean synodic month from the 2000-01-06 18:14 UTC new moon; good to within a day. */
  var moon = document.getElementById('moon');
  if (moon) {
    var P = 29.530588853, age = ((Date.now() - Date.UTC(2000, 0, 6, 18, 14)) / 864e5) % P; if (age < 0) age += P;
    var f = age / P, lit = Math.round((1 - Math.cos(2 * Math.PI * f)) / 2 * 100);
    var names = ['New moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full moon', 'Waning gibbous', 'Last quarter', 'Waning crescent'];
    var name = names[Math.floor((f * 8) + 0.5) % 8];
    var toFull = f < 0.5 ? (0.5 - f) * P : (1.5 - f) * P, toNew = (1 - f) * P;
    var next = toFull < toNew ? 'Full moon in ' + days(toFull) : 'New moon in ' + days(toNew);
    function days(d) { var n = Math.round(d); return n <= 0 ? 'under a day' : n === 1 ? 'about a day' : 'about ' + n + ' days'; }
    var r = 18, rx = Math.abs(Math.cos(2 * Math.PI * f)) * r, wax = f < 0.5, gib = f > 0.25 && f < 0.75;
    var d = 'M20 2 A18 18 0 0 ' + (wax ? 1 : 0) + ' 20 38 A' + rx.toFixed(2) + ' 18 0 0 ' + ((wax ? gib : !gib) ? 1 : 0) + ' 20 2Z';
    moon.innerHTML = '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" class="moon-dark"/>' +
      (lit > 0 ? '<path d="' + d + '" class="moon-lit"/>' : '') + '<circle cx="20" cy="20" r="18" class="moon-rim"/></svg>';
    var tip = document.getElementById('moon-tip');
    var text = name + ', ' + lit + '% lit. ' + next + '.';
    moon.setAttribute('aria-label', 'Tonight’s moon: ' + text);
    if (tip) {
      tip.innerHTML = '<strong></strong><span></span><em>Cincinnati sky, tonight.</em>';
      tip.querySelector('strong').textContent = name;
      tip.querySelector('span').textContent = lit + '% lit. ' + next + '.';
      /* Hover and focus open it; a click right after focus (a tap) must not close it again; Escape closes. */
      var opened = 0;
      var show = function () { if (tip.hidden) { tip.hidden = false; opened = Date.now(); } }, hide = function () { tip.hidden = true; };
      /* Hover on the moon only; the toolbar also holds the color picker and the clock. */
      var t = 0, later = function () { clearTimeout(t); t = setTimeout(hide, 200); }, keep = function () { clearTimeout(t); show(); };
      moon.addEventListener('mouseenter', keep); moon.addEventListener('mouseleave', later);
      tip.addEventListener('mouseenter', keep); tip.addEventListener('mouseleave', later);
      moon.addEventListener('focus', show); moon.addEventListener('blur', hide);
      moon.addEventListener('click', function () { if (Date.now() - opened > 400) { if (tip.hidden) show(); else hide(); } });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
    }
  }

  /* Cincinnati time beside the moon. (Weather came off 2026.09.29: Open-Meteo's free tier is non-commercial only.) */
  var here = document.getElementById('here');
  if (here) {
    var clock = function () {
      try { return new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; }
    };
    var paint = function () { here.textContent = 'Cincinnati ' + clock(); };
    paint(); setInterval(paint, 30000);
  }

  /* Reading signals for GoatCounter: outside links clicked, and how far down each page people get (50% and 90%, once each). */
  function gc(path, title) { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: path, title: title, event: true }); }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.hasAttribute('data-goatcounter-click') || a.host === location.host || !/^https?:/.test(a.href)) return;
    gc('out-' + a.hostname.replace(/^www\./, ''), 'Outbound ' + a.hostname);
  });
  var marks = { 50: false, 90: false }, page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '');
  window.addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - innerHeight; if (h < 200) return;
    var pct = (scrollY / h) * 100;
    [50, 90].forEach(function (m) { if (!marks[m] && pct >= m) { marks[m] = true; gc('scroll-' + m + '-' + page, 'Scrolled ' + m + '% of ' + page); } });
  }, { passive: true });

  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* Labs mark preview: on localhost, ?mark=1 shows the "tl2 labs" pill in place of the wordmark plus Labs pill. */
  if (LOCAL && /(^|[?&])mark=1(&|$)/.test(location.search)) {
    var mk = document.querySelector('.mark-labs');
    if (mk) mk.innerHTML = '<span class="labs-pill solo">tl2 labs</span>';
  }

  /* High five: GoatCounter records the click (data-goatcounter-click); this only answers back. */
  var hf = document.getElementById('high-five');
  if (hf) {
    var said = document.getElementById('hf-said');
    if (store('tl2-hf')) { hf.classList.add('done'); said.textContent = 'Already got yours. Thanks for stopping by.'; }
    hf.addEventListener('click', function () {
      hf.classList.remove('slap'); void hf.offsetWidth; hf.classList.add('slap', 'done');
      said.textContent = store('tl2-hf') ? 'Twice? We will take it.' : 'Right back at you. Thanks for stopping by.';
      store('tl2-hf', '1');
    });
  }

  /* Signup */
  var su = document.getElementById('signup');
  if (su) {
    var form = document.getElementById('signup-form'), q = document.getElementById('signup-q');
    /* Public only when both services exist; on localhost it shows unwired so the layout can be reviewed. */
    if (SIGNUP.buttondown && SIGNUP.tally) {
      form.action = 'https://buttondown.com/api/emails/embed-subscribe/' + encodeURIComponent(SIGNUP.buttondown);
      q.href = SIGNUP.tally;
      form.addEventListener('submit', function (e) {
        /* Honeypot: people never see the field, bots fill it. Filled = drop quietly; empty = keep it out of the post. */
        var hp = document.getElementById('signup-hp');
        if (hp && hp.value) { e.preventDefault(); document.getElementById('signup-said').textContent = 'Thanks.'; return; }
        if (hp) hp.disabled = true;
        gc('subscribe', 'Newsletter signup');
        document.getElementById('signup-said').textContent = 'Finish signing up in the Buttondown tab that just opened.';
        setTimeout(function () { if (hp) hp.disabled = false; }, 0);
      });
      su.hidden = false;
    } else if (LOCAL) {
      su.hidden = false; su.classList.add('unwired');
      form.addEventListener('submit', function (e) { e.preventDefault(); document.getElementById('signup-said').textContent = 'Draft: the form is not wired to Buttondown yet.'; });
    }
  }

  /* Feedback link in every footer */
  var foot = document.querySelector('footer.site');
  if (foot && !foot.querySelector('.feedback') && (FEEDBACK.tally || FEEDBACK.mail)) {
    var pageId = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '').replace(/[^a-z0-9-]/gi, '') || 'index';
    var fp = document.createElement('p'), fa = document.createElement('a');
    fp.className = 'feedback';
    fa.textContent = 'Something off, or an idea? Tell us';
    fa.href = FEEDBACK.tally ? FEEDBACK.tally + '?page=' + encodeURIComponent(pageId)
      : 'mailto:' + FEEDBACK.mail + '?subject=' + encodeURIComponent('Site feedback') + '&body=' + encodeURIComponent('Page: ' + pageId + '\n\nWhat happened or what you would change:\n');
    if (FEEDBACK.tally) { fa.target = '_blank'; fa.rel = 'noopener'; }
    fa.addEventListener('click', function () { gc('feedback', 'Feedback link'); });
    fp.appendChild(fa);
    foot.insertBefore(fp, foot.lastElementChild);
  }
})();
