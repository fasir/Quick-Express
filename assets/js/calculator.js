/* =====================================================================
   Quick Express — Business Setup Cost Calculator
   ---------------------------------------------------------------------
   ALL PRICES ARE INDICATIVE PLACEHOLDERS (AED).
   Update the numbers in PRICING below to match your real fee schedule.
   ===================================================================== */
(function () {
  'use strict';

  var PRICING = {
    jurisdictions: [
      { id: 'mainland', label: 'Mainland', icon: 'bi-buildings', licence: 12500,
        desc: 'Trade anywhere in the UAE and work directly with government entities.',
        points: ['Trade across the UAE', 'Unlimited branches', 'Government contracts'] },
      { id: 'freezone', label: 'Freezone', icon: 'bi-globe2', licence: 5750, badge: 'Most popular',
        desc: 'Fast, cost-effective setup with 100% ownership. Ideal for startups.',
        points: ['100% foreign ownership', 'Quick, simple setup', 'Lowest starting cost'] },
      { id: 'industrial', label: 'Industrial', icon: 'bi-gear-wide-connected', licence: 18500,
        desc: 'For manufacturing and industrial businesses that need production space.',
        points: ['Manufacturing activities', 'Factory / warehouse', 'Industrial approvals'] }
    ],
    // extra = one-time approval / activity cost
    activities: [
      { id: 'trading', label: 'General Trading', icon: 'bi-box-seam', extra: 1500 },
      { id: 'ecommerce', label: 'E-commerce', icon: 'bi-cart3', extra: 0 },
      { id: 'consultancy', label: 'Management Consultancy', icon: 'bi-briefcase', extra: 0 },
      { id: 'it', label: 'IT &amp; Software', icon: 'bi-cpu', extra: 0 },
      { id: 'marketing', label: 'Marketing &amp; Media', icon: 'bi-megaphone', extra: 500 },
      { id: 'realestate', label: 'Real Estate', icon: 'bi-house-door', extra: 3500 },
      { id: 'food', label: 'Restaurant &amp; Food', icon: 'bi-cup-hot', extra: 4000 },
      { id: 'construction', label: 'Contracting', icon: 'bi-cone-striped', extra: 3000 },
      { id: 'tourism', label: 'Travel &amp; Tourism', icon: 'bi-airplane', extra: 2500 },
      { id: 'health', label: 'Healthcare &amp; Clinic', icon: 'bi-heart-pulse', extra: 5000 },
      { id: 'manufacturing', label: 'Manufacturing', icon: 'bi-tools', extra: 4500 },
      { id: 'other', label: 'Other Activity', icon: 'bi-three-dots', extra: 1000 }
    ],
    // cost = per year
    office: [
      { id: 'virtual', label: 'Virtual Office', icon: 'bi-laptop', cost: 3500, desc: 'Business address & mail handling' },
      { id: 'flexi', label: 'Flexi Desk', icon: 'bi-person-workspace', cost: 7500, desc: 'Shared desk, meeting rooms' },
      { id: 'physical', label: 'Physical Office', icon: 'bi-building', cost: 25000, desc: 'Private office space (from)' }
    ],
    visa: { perVisa: 3850, immigrationFile: 2250 },
    shareholderExtra: 1200,
    years: [
      { n: 1, discount: 0 },
      { n: 2, discount: 0.05, tag: 'Save 5%' },
      { n: 3, discount: 0.10, tag: 'Save 10%' }
    ],
    // yearly = charged per licence year
    addons: [
      { id: 'bank', label: 'Corporate bank account', icon: 'bi-bank', cost: 1500 },
      { id: 'vat', label: 'VAT registration', icon: 'bi-receipt', cost: 1000 },
      { id: 'ct', label: 'Corporate tax registration', icon: 'bi-percent', cost: 750 },
      { id: 'pro', label: 'PRO services (annual)', icon: 'bi-person-badge', cost: 4500, yearly: true },
      { id: 'acc', label: 'Accounting &amp; bookkeeping', icon: 'bi-journal-text', cost: 9000, yearly: true },
      { id: 'golden', label: 'Golden Visa assistance', icon: 'bi-award', cost: 3500 }
    ],
    rangeSpread: 0.12,
    whatsapp: '971509605770'
  };

  var START = ['Immediately', 'Within 2 weeks', 'Within 1 month', 'Just exploring'];

  var state = { step: 1, juris: null, activity: null, other: '', office: 'virtual', visas: 0, shareholders: 1, years: 1, addons: [], start: START[0] };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fmt = function (n) { return Math.round(n).toLocaleString('en-US'); };
  var strip = function (s) { var d = document.createElement('div'); d.innerHTML = s; return d.textContent; };
  var find = function (arr, id) { for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i]; return null; };

  if (!$('#ccForm')) return;

  /* ---------- Render option lists ---------- */
  $('#ccJuris').innerHTML = PRICING.jurisdictions.map(function (j) {
    return '<label class="cc-jcard">' +
      '<input type="radio" name="juris" value="' + j.id + '">' +
      '<span class="cc-jcard-in">' +
        (j.badge ? '<em class="cc-badge">' + j.badge + '</em>' : '') +
        '<span class="cc-jico"><i class="bi ' + j.icon + '"></i></span>' +
        '<strong>' + j.label + '</strong>' +
        '<small>' + j.desc + '</small>' +
        '<ul>' + j.points.map(function (p) { return '<li><i class="bi bi-check2"></i>' + p + '</li>'; }).join('') + '</ul>' +
        '<span class="cc-from">Licence from <b>AED ' + fmt(j.licence) + '</b>/yr</span>' +
        '<span class="cc-tick"><i class="bi bi-check-lg"></i></span>' +
      '</span></label>';
  }).join('');

  $('#ccActs').innerHTML = PRICING.activities.map(function (a) {
    return '<label class="cc-chip"><input type="radio" name="activity" value="' + a.id + '">' +
      '<span><i class="bi ' + a.icon + '"></i>' + a.label + '</span></label>';
  }).join('');

  $('#ccOffice').innerHTML = PRICING.office.map(function (o) {
    return '<label class="cc-ocard"><input type="radio" name="office" value="' + o.id + '"' + (o.id === state.office ? ' checked' : '') + '>' +
      '<span><i class="bi ' + o.icon + '"></i><strong>' + o.label + '</strong><small>' + o.desc + '</small>' +
      '<b>AED ' + fmt(o.cost) + '/yr</b></span></label>';
  }).join('');

  $('#ccYears').innerHTML = PRICING.years.map(function (y) {
    return '<label><input type="radio" name="years" value="' + y.n + '"' + (y.n === 1 ? ' checked' : '') + '>' +
      '<span>' + y.n + ' Year' + (y.n > 1 ? 's' : '') + (y.tag ? '<em>' + y.tag + '</em>' : '') + '</span></label>';
  }).join('');

  $('#ccAddons').innerHTML = PRICING.addons.map(function (a) {
    return '<label class="cc-addon"><input type="checkbox" name="addons" value="' + a.id + '">' +
      '<span><i class="bi ' + a.icon + '"></i><span class="cc-addon-txt"><strong>' + a.label + '</strong>' +
      '<b>+AED ' + fmt(a.cost) + (a.yearly ? ' / yr' : ' one-time') + '</b></span><em class="cc-check"><i class="bi bi-check-lg"></i></em></span></label>';
  }).join('');

  $('#ccStart').innerHTML = START.map(function (s, i) {
    return '<label><input type="radio" name="start" value="' + s + '"' + (i === 0 ? ' checked' : '') + '><span>' + s + '</span></label>';
  }).join('');

  /* ---------- Calculation ---------- */
  function calc() {
    var lines = [];
    var j = find(PRICING.jurisdictions, state.juris);
    var a = find(PRICING.activities, state.activity);
    var o = find(PRICING.office, state.office);
    var y = PRICING.years.filter(function (x) { return x.n === state.years; })[0] || PRICING.years[0];
    if (j) {
      var lic = j.licence * y.n * (1 - y.discount);
      lines.push([j.label + ' trade licence (' + y.n + ' yr' + (y.n > 1 ? 's' : '') + (y.discount ? ', ' + (y.discount * 100) + '% off' : '') + ')', lic]);
    }
    if (a && a.extra) lines.push(['Activity approvals &ndash; ' + (a.id === 'other' && state.other ? state.other : strip(a.label)), a.extra]);
    if (o && j) lines.push([o.label + ' (' + y.n + ' yr' + (y.n > 1 ? 's' : '') + ')', o.cost * y.n]);
    if (state.visas > 0) {
      lines.push(['Establishment card &amp; immigration file', PRICING.visa.immigrationFile]);
      lines.push([state.visas + ' residence visa' + (state.visas > 1 ? 's' : '') + ' (medical, Emirates ID, stamping)', state.visas * PRICING.visa.perVisa]);
    }
    if (state.shareholders > 1) lines.push([(state.shareholders - 1) + ' additional shareholder' + (state.shareholders > 2 ? 's' : ''), (state.shareholders - 1) * PRICING.shareholderExtra]);
    state.addons.forEach(function (id) {
      var ad = find(PRICING.addons, id);
      if (ad) lines.push([strip(ad.label) + (ad.yearly && y.n > 1 ? ' (' + y.n + ' yrs)' : ''), ad.cost * (ad.yearly ? y.n : 1)]);
    });
    var total = lines.reduce(function (s, l) { return s + l[1]; }, 0);
    return { lines: lines, total: total, max: Math.ceil(total * (1 + PRICING.rangeSpread) / 100) * 100, years: y.n };
  }

  /* ---------- Animated number ---------- */
  var shown = 0, raf;
  function animateTo(target) {
    cancelAnimationFrame(raf);
    var from = shown, t0 = null;
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 500, 1), e = 1 - Math.pow(1 - p, 3);
      shown = from + (target - from) * e;
      $$('.js-total').forEach(function (el) { el.textContent = fmt(shown); });
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
  }

  /* ---------- Summary ---------- */
  function updateSummary() {
    var r = calc();
    animateTo(r.total);
    var j = find(PRICING.jurisdictions, state.juris), a = find(PRICING.activities, state.activity), o = find(PRICING.office, state.office);
    var set = function (k, v) { var el = $('[data-sum="' + k + '"]'); if (el) el.innerHTML = v; };
    set('juris', j ? j.label : '&mdash;');
    set('activity', a ? (a.id === 'other' && state.other ? state.other : a.label) : '&mdash;');
    set('office', state.step >= 3 && o ? o.label : '&mdash;');
    set('visas', state.visas);
    set('shareholders', state.shareholders);
    set('addons', state.addons.length ? state.addons.length + ' selected' : 'None');
    $('#ccSumYears').textContent = r.years + '-year licence';
  }

  /* ---------- Inputs ---------- */
  $('#ccForm').addEventListener('change', function (e) {
    var t = e.target;
    if (t.name === 'juris') state.juris = t.value;
    if (t.name === 'activity') { state.activity = t.value; $('#ccOtherWrap').hidden = t.value !== 'other'; if (t.value === 'other') $('#ccOther').focus(); }
    if (t.name === 'office') state.office = t.value;
    if (t.name === 'years') state.years = +t.value;
    if (t.name === 'start') state.start = t.value;
    if (t.name === 'addons') state.addons = $$('input[name="addons"]:checked').map(function (x) { return x.value; });
    $$('.cc-error').forEach(function (x) { x.hidden = true; });
    updateSummary();
    // auto-advance on single-choice steps
    if ((t.name === 'juris' && state.step === 1) || (t.name === 'activity' && state.step === 2 && t.value !== 'other')) {
      setTimeout(function () { go(state.step + 1); }, 320);
    }
  });
  $('#ccOther').addEventListener('input', function () { state.other = this.value.trim(); updateSummary(); });

  $$('.cc-stepper').forEach(function (st) {
    var out = $('output', st), f = st.getAttribute('data-field'), min = +st.getAttribute('data-min'), max = +st.getAttribute('data-max');
    function setv(v) {
      v = Math.max(min, Math.min(max, v)); state[f] = v; out.textContent = v;
      $('.cc-minus', st).disabled = v <= min; $('.cc-plus', st).disabled = v >= max;
      out.classList.remove('bump'); void out.offsetWidth; out.classList.add('bump');
      updateSummary();
    }
    $('.cc-minus', st).addEventListener('click', function () { setv(state[f] - 1); });
    $('.cc-plus', st).addEventListener('click', function () { setv(state[f] + 1); });
    $('.cc-minus', st).disabled = state[f] <= min;
  });

  /* ---------- Steps ---------- */
  function validate(step) {
    var ok = true;
    if (step === 1) ok = !!state.juris;
    if (step === 2) ok = !!state.activity;
    if (step === 4) {
      var name = $('#ccName').value.trim(), phone = $('#ccPhone').value.replace(/[^\d+]/g, ''), email = $('#ccEmail').value.trim();
      ok = name.length > 1 && phone.replace(/\D/g, '').length >= 7 && (!email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
      $('#ccName').classList.toggle('is-bad', name.length <= 1);
      $('#ccPhone').classList.toggle('is-bad', phone.replace(/\D/g, '').length < 7);
      $('#ccEmail').classList.toggle('is-bad', !!email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    }
    var err = $('[data-error="' + step + '"]'); if (err) err.hidden = ok;
    return ok;
  }

  function go(n) {
    state.step = n;
    $$('.cc-pane').forEach(function (p) { p.classList.toggle('is-active', +p.getAttribute('data-pane') === n); });
    $$('#ccSteps li').forEach(function (li) {
      var s = +li.getAttribute('data-step');
      li.classList.toggle('is-active', s === n); li.classList.toggle('is-done', s < n);
    });
    $('#ccProgress').style.width = (n * 25) + '%';
    $('#ccBack').hidden = n === 1;
    $('#ccNext').innerHTML = n === 4 ? 'Get My Estimate <i class="bi bi-calculator"></i>' : 'Continue <i class="bi bi-arrow-right"></i>';
    $('#ccSumStep').textContent = 'Step ' + n + '/4';
    var ms = $('#ccMiniStep'); if (ms) ms.textContent = 'Step ' + n + ' of 4';
    updateSummary();
    var card = $('#ccCard'), top = card.getBoundingClientRect().top + window.scrollY - 110;
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' });
  }

  $$('#ccSteps li').forEach(function (li) {
    li.addEventListener('click', function () {
      var s = +li.getAttribute('data-step');
      if (s < state.step) go(s);
      else if (s > state.step) { for (var i = state.step; i < s; i++) { if (!validate(i)) { go(i); return; } } go(s); }
    });
  });
  $('#ccBack').addEventListener('click', function () { if (state.step > 1) go(state.step - 1); });
  $('#ccNext').addEventListener('click', function () {
    if (!validate(state.step)) return;
    if (state.step < 4) go(state.step + 1); else showResult();
  });

  /* ---------- Result ---------- */
  function showResult() {
    var r = calc(), name = $('#ccName').value.trim(), first = name.split(' ')[0];
    $('#ccHello').textContent = 'Here\'s your estimate, ' + first + '!';
    $('#ccMin').textContent = fmt(r.total);
    $('#ccMax').textContent = fmt(r.max);
    $('#ccRangeNote').textContent = 'for a ' + r.years + '-year licence, incl. government fees';
    $('#ccBreak').innerHTML = r.lines.map(function (l) { return '<li><span>' + l[0] + '</span><b>AED ' + fmt(l[1]) + '</b></li>'; }).join('');
    $('#ccBreakTotal').textContent = fmt(r.total);

    var incl = ['Trade name reservation &amp; initial approval', 'Trade licence issuance', 'MOA / company documents', 'Certificate of incorporation', 'Bank account introduction letter'];
    if (state.visas > 0) incl.push('Establishment card &amp; e-channel registration', 'Entry permit, medical &amp; Emirates ID', 'Visa stamping for ' + state.visas + ' person' + (state.visas > 1 ? 's' : ''));
    incl.push('Dedicated Quick Express advisor');
    $('#ccIncl').innerHTML = incl.map(function (i) { return '<li><i class="bi bi-check-circle-fill"></i>' + i + '</li>'; }).join('');

    var j = find(PRICING.jurisdictions, state.juris), a = find(PRICING.activities, state.activity), o = find(PRICING.office, state.office);
    var msg = 'Hello Quick Express, I used your cost calculator.\n\n' +
      'Name: ' + name + '\nPhone: ' + $('#ccPhone').value.trim() +
      ($('#ccEmail').value.trim() ? '\nEmail: ' + $('#ccEmail').value.trim() : '') +
      ($('#ccNation').value ? '\nNationality: ' + $('#ccNation').value : '') +
      '\n\nJurisdiction: ' + j.label +
      '\nActivity: ' + (a.id === 'other' && state.other ? state.other : strip(a.label)) +
      '\nOffice: ' + o.label + '\nVisas: ' + state.visas + '\nShareholders: ' + state.shareholders +
      '\nLicence: ' + r.years + ' year(s)' +
      (state.addons.length ? '\nAdd-ons: ' + state.addons.map(function (id) { return strip(find(PRICING.addons, id).label); }).join(', ') : '') +
      '\nStart: ' + state.start +
      '\n\nEstimate: AED ' + fmt(r.total) + ' - ' + fmt(r.max) + '\n\nPlease confirm my exact quote.';
    $('#ccWa').href = 'https://wa.me/' + PRICING.whatsapp + '?text=' + encodeURIComponent(msg);

    $('#ccForm').hidden = true; $('#ccSteps').hidden = true; $('.cc-progress').hidden = true;
    $('#ccResult').hidden = false;
    $('#ccSumStep').textContent = 'Complete';
    var ms = $('#ccMiniStep'); if (ms) ms.textContent = 'Your estimate';
    var top = $('#ccCard').getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  $('#ccPrint').addEventListener('click', function () { window.print(); });
  $('#ccRestart').addEventListener('click', function () {
    $('#ccResult').hidden = true; $('#ccForm').hidden = false; $('#ccSteps').hidden = false; $('.cc-progress').hidden = false;
    go(1);
  });

  updateSummary();
  // animate the progress line in on load
  setTimeout(function () { $('#ccProgress').style.width = '25%'; }, 350);
})();

/* ---------- Calculate & Save 10% countdown ---------- */
(function () {
  var sec = document.getElementById('calcOffer');
  if (!sec) return;
  var now = new Date();
  var attr = sec.getAttribute('data-end');
  // Default: end of the current month (23:59:59 local time)
  var end = attr ? new Date(attr) : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  var start = attr ? new Date(end.getTime() - 30 * 864e5) : new Date(now.getFullYear(), now.getMonth(), 1);
  var els = {}, last = {};
  ['d', 'h', 'm', 's'].forEach(function (k) { els[k] = sec.querySelector('[data-u="' + k + '"]'); });
  var bar = document.getElementById('coBar'), ends = document.getElementById('coEnds');
  if (ends && !isNaN(end)) {
    ends.innerHTML = '<i class="bi bi-calendar-event"></i> Offer ends ' +
      end.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    var diff = end - new Date();
    if (isNaN(diff) || diff <= 0) {
      ['d', 'h', 'm', 's'].forEach(function (k) { if (els[k]) els[k].textContent = '00'; });
      if (bar) bar.style.width = '0';
      Array.prototype.forEach.call(sec.querySelectorAll('.co-ring-fg'), function (fg) { fg.style.strokeDashoffset = 2 * Math.PI * 44; });
      if (ends) ends.innerHTML = '<i class="bi bi-calendar-x"></i> This offer has ended &mdash; contact us for current offers';
      sec.classList.add('is-ended');
      clearInterval(timer);
      return;
    }
    var v = {
      d: Math.floor(diff / 864e5),
      h: Math.floor(diff / 36e5) % 24,
      m: Math.floor(diff / 6e4) % 60,
      s: Math.floor(diff / 1e3) % 60
    };
    Object.keys(v).forEach(function (k) {
      if (!els[k] || last[k] === v[k]) return;
      els[k].textContent = pad(v[k]);
      els[k].classList.remove('tick'); void els[k].offsetWidth; els[k].classList.add('tick');
      last[k] = v[k];
    });
    // rings: fraction remaining of each unit
    var C = 2 * Math.PI * 44, totalDays = Math.max(1, Math.ceil((end - start) / 864e5));
    var frac = { d: v.d / totalDays, h: v.h / 24, m: v.m / 60, s: v.s / 60 };
    Object.keys(frac).forEach(function (k) {
      var fg = sec.querySelector('[data-ring="' + k + '"] .co-ring-fg');
      if (fg) { fg.style.strokeDasharray = C; fg.style.strokeDashoffset = C * (1 - Math.min(1, frac[k])); }
    });
    var pct = Math.max(0, Math.min(100, diff / (end - start) * 100));
    if (bar) bar.style.width = pct + '%';
    var pe = document.getElementById('coPct'); if (pe) pe.textContent = Math.ceil(pct) + '% left';
  }
  var timer = setInterval(tick, 1000);
  tick();
})();
