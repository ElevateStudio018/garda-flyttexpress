/* Gårda Flyttexpress – main.js */
(function () {
  'use strict';

  /* ---- Form endpoint ----
     Set this to a form backend (e.g. Formspree/Formsubmit/your own) to send submissions by e-mail.
     Example: 'https://formspree.io/f/xxxxxxxx'
     If left empty, the form opens the visitor's e-mail client with the request pre-filled to info@gardaflyttexpress.se. */
  var FORM_ENDPOINT = '';
  var FORM_EMAIL = 'info@gardaflyttexpress.se';

  var header = document.querySelector('.header');
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('mobile-menu');
  var hero = document.querySelector('.hero');

  /* Header: transparent over hero, solid after */
  function updateHeader() {
    var threshold = hero ? Math.max(40, hero.offsetHeight - header.offsetHeight - 40) : 40;
    var solid = window.scrollY > threshold || (menu && menu.classList.contains('is-open')) || !hero;
    header.classList.toggle('is-solid', solid);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader);

  /* Mobile menu */
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Öppna meny');
    document.body.style.overflow = '';
    updateHeader();
  }
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Stäng meny' : 'Öppna meny');
      document.body.style.overflow = open ? 'hidden' : '';
      updateHeader();
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* Hero video: respect reduced motion / save-data */
  var video = document.querySelector('.hero__media video');
  if (video) {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var saveData = navigator.connection && navigator.connection.saveData;
    if (reduce || saveData) {
      video.removeAttribute('autoplay');
      video.pause();
      video.remove();
      var img = document.createElement('img');
      img.src = 'assets/img/hero-poster.jpg';
      img.alt = '';
      document.querySelector('.hero__media').prepend(img);
    } else {
      var p = video.play();
      if (p && p.catch) { p.catch(function () { /* autoplay blocked – poster is shown */ }); }
    }
  }

  /* Only one FAQ open at a time */
  var faqs = document.querySelectorAll('.faq-item');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d) o.removeAttribute('open'); });
    });
  });

  /* Year */
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());

  /* Quote form */
  var form = document.getElementById('quote-form');
  if (!form) return;
  var status = form.querySelector('.form__status');
  var labels = {
    namn: 'Namn', telefon: 'Mobiltelefon', epost: 'E-post', kontaktsatt: 'Kontakta mig via',
    fran_adress: 'Från – gatuadress', fran_postnr: 'Från – postnummer', fran_stad: 'Från – stad', fran_typ: 'Från – typ av bostad',
    fran_boyta: 'Från – boyta (m²)', fran_rum: 'Från – antal rum', fran_vaning: 'Från – våning', fran_hiss: 'Från – hiss',
    fran_gangavstand: 'Från – gångavstånd', fran_forrad: 'Från – förråd',
    till_adress: 'Till – gatuadress', till_postnr: 'Till – postnummer', till_stad: 'Till – stad', till_typ: 'Till – typ av bostad',
    till_vaning: 'Till – våning', till_hiss: 'Till – hiss', till_gangavstand: 'Till – gångavstånd', till_forrad: 'Till – förråd',
    flyttdatum: 'Önskat flyttdatum', tjanster: 'Hjälp med', special: 'Special', meddelande: 'Övrig information', kalla: 'Hittade oss via'
  };

  function collect() {
    var data = {};
    new FormData(form).forEach(function (v, k) {
      if (k === '_gotcha' || k === 'samtycke') return;
      if (!String(v).trim()) return;
      data[k] = data[k] ? data[k] + ', ' + v : String(v);
    });
    return data;
  }

  function setStatus(msg, ok) {
    status.textContent = msg;
    status.className = 'form__status ' + (ok ? 'is-ok' : 'is-err');
  }

  function validate() {
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (el) {
      var valid = el.type === 'checkbox' ? el.checked : el.value.trim() !== '' && el.checkValidity();
      el.style.borderColor = valid ? '' : '#b8352b';
      if (!valid) ok = false;
    });
    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.querySelector('[name="_gotcha"]').value) return;
    if (!validate()) {
      setStatus('Fyll i namn, telefon, e-post och godkänn behandlingen av dina uppgifter.', false);
      return;
    }
    var data = collect();
    var btn = form.querySelector('button[type="submit"]');

    if (FORM_ENDPOINT) {
      btn.disabled = true;
      btn.textContent = 'Skickar …';
      var payload = {};
      Object.keys(data).forEach(function (k) { payload[labels[k] || k] = data[k]; });
      payload._subject = 'Offertförfrågan från ' + data.namn + ' – gardaflyttexpress.se';
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) {
        if (!r.ok) throw new Error('Serverfel');
        form.reset();
        setStatus('Tack! Din förfrågan är skickad. Vi återkommer till dig inom kort med en offert.', true);
      }).catch(function () {
        setStatus('Något gick fel när förfrågan skulle skickas. Ring oss gärna på 0769-41 21 31 eller mejla info@gardaflyttexpress.se.', false);
      }).finally(function () {
        btn.disabled = false;
        btn.textContent = 'Skicka offertförfrågan';
      });
      return;
    }

    /* Fallback: open e-mail client with the request pre-filled */
    var lines = ['Hej! Jag vill ha en offert på min flytt.', ''];
    Object.keys(data).forEach(function (k) { lines.push((labels[k] || k) + ': ' + data[k]); });
    var href = 'mailto:' + FORM_EMAIL +
      '?subject=' + encodeURIComponent('Offertförfrågan – ' + data.namn) +
      '&body=' + encodeURIComponent(lines.join('\n'));
    window.location.href = href;
    setStatus('Ditt e-postprogram öppnas med förfrågan ifylld. Skicka mejlet så återkommer vi med en offert. Kommer inget mejl upp? Ring 0769-41 21 31.', true);
  });
})();
