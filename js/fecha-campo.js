/* Campo de fecha dd/mm/aaaa: una sola pieza para el CRM y los sistemas Quo (Fernando Cadengo, 24 y 25-nov-2026:
   «Hay que revisar el formato de la fecha en todos nuestros sistemas, que sea dd/mm/aaaa»; segunda vuelta, «2 a»: «los
   campos donde se captura una fecha pasan a un campo propio dd/mm/aaaa»; al cómo, «Sí, así es»).

   Qué hace: todo <input type="date"> de la página (el de hoy y el que se agregue después) se ve y se escribe dd/mm/aaaa.
   - Se teclean los números y las diagonales salen solas (24112026 → 24/11/2026); un año de 2 cifras se completa al salir
     del campo (24/11/26 → 24/11/2026); también se puede pegar «2026-11-24» o escribir con «-» o «.».
   - El 📅 de la derecha (o Alt+↓) abre el calendario de siempre del equipo (el del navegador, el del iPhone o el iPad).
   - Una fecha que no existe (31/02), incompleta o fuera de lo permitido (min y max del campo) pone el campo en rojo y dice
     qué es y qué hacer (regla «Todo error dice qué es y qué hacer»): abajo del campo mientras se escribe y, al salir, en
     el aviso chico (PORTAL.avisoChico en el CRM, Q.aviso en los sistemas Quo).
   - Con ↑ y ↓ se mueve un día.

   Cómo, sin tocar ninguna pantalla: el campo de siempre se queda donde está, con su id, su nombre y su valor «2026-11-24»
   (así toda pantalla lo lee, lo guarda y lo escucha igual que antes: .value, change, input, min, max, disabled), solo
   escondido (clase pf-fc-nat). Junto a él va el campo que se ve (data-fecha-vista, clase pf-fc), con la misma clase y el
   mismo estilo. Los dos se mantienen iguales: lo que se escribe pasa al de siempre (con sus eventos input y change) y lo
   que la pantalla le pone al de siempre (.value, el calendario, FILTROS) se ve en el nuevo. Los estilos de las pantallas
   que apuntan a «input[type=date]» se copian solos para «input.pf-fc» (estilos()), así mide y se ve igual.
   - Un campo que deba seguir con el del navegador lleva data-fecha-nativa. Los de solo mes (type=month) no cambian.
   - En el CRM la pone construir.py en todas las páginas (con_fecha_campo(), exige_fecha_campo()); los sistemas Quo la
     cargan de https://crmprofase.com.mx/js/fecha-campo.js (una sola versión, nunca una copia).
   Prueba: herramientas/pruebas/pantallas/prueba_fecha_campo.py (profase-datos). */
(function () {
  'use strict';
  if (window.PROFASE_CAMPO_FECHA) return;
  var D = document;
  var VAL = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  var VAD = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'valueAsDate');
  var PARES = new WeakMap();          // campo de siempre → su par
  var VISTAS = new WeakSet();         // los campos que se ven
  var VIVOS = [];                     // los pares, para saber si se quitó uno
  var SEL = 'input[type=date]:not([data-fecha-nativa])';
  var ICONO = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237A8699' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4.5' width='18' height='16.5' rx='2'/%3E%3Cpath d='M3 9.5h18M8 2.5v4M16 2.5v4'/%3E%3C/svg%3E\")";

  /* ---- leer y escribir ---- */
  function dos(n) { return (n < 10 ? '0' : '') + n; }
  function iso(d, m, a) { return a + '-' + dos(m) + '-' + dos(d); }
  function dmy(v) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || ''); return m ? m[3] + '/' + m[2] + '/' + m[1] : ''; }
  function existe(d, m, a) { var f = new Date(Date.UTC(a, m - 1, d)); return f.getUTCFullYear() === a && f.getUTCMonth() === m - 1 && f.getUTCDate() === d; }
  // lo escrito → { iso } | { falta } | { mal, txt } ; final: el año de 2 cifras se completa
  function lee(t, final) {
    t = String(t || '').trim();
    if (!t) return { vacio: true };
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(t);
    var d, me, a, ta;
    if (m) { a = +m[1]; me = +m[2]; d = +m[3]; ta = 4; }
    else {
      var p = t.split(/[\/\-.\s]+/).filter(Boolean);
      if (p.length !== 3 || p.some(function (x) { return /\D/.test(x); })) return { falta: true };
      d = +p[0]; me = +p[1]; ta = p[2].length;
      if (ta === 2 && final) { a = 2000 + (+p[2]); ta = 4; } else a = +p[2];
      if (ta !== 4 || !p[0] || !p[1]) return { falta: true };
    }
    if (me < 1 || me > 12 || d < 1 || !existe(d, me, a)) return { mal: true, txt: dos(d) + '/' + dos(me) + '/' + a };
    return { iso: iso(d, me, a) };
  }
  // lo que se va tecleando: los números con sus diagonales solas
  function forma(raw) {
    if (/^\d{4}-\d/.test(raw)) return raw.slice(0, 10);
    if (/[\/\-.\s]/.test(raw)) {
      // con diagonales (las puestas solas o las que escribió la persona: 1/2/2026): lo que sobra de un pedazo pasa al que sigue
      var p = raw.split(/[\/\-.\s]/).map(function (x) { return x.replace(/\D/g, ''); });
      for (var i = 0; i < 2 && i < p.length; i++) if (p[i].length > 2) { p[i + 1] = p[i].slice(2) + (p[i + 1] || ''); p[i] = p[i].slice(0, 2); }
      p = p.slice(0, 3);
      if (p.length === 3) p[2] = p[2].slice(0, 4);
      return p.join('/');
    }
    var n = raw.replace(/\D/g, '').slice(0, 8);
    return n.length > 4 ? n.slice(0, 2) + '/' + n.slice(2, 4) + '/' + n.slice(4) : n.length > 2 ? n.slice(0, 2) + '/' + n.slice(2) : n;
  }
  function fuera(nat, v) {
    if (nat.min && v < nat.min) return 'La fecha tiene que ser desde el ' + dmy(nat.min) + '. Qué hacer: escribe esa fecha o una posterior, o escógela con el calendario 📅.';
    if (nat.max && v > nat.max) return 'La fecha tiene que ser hasta el ' + dmy(nat.max) + '. Qué hacer: escribe esa fecha o una anterior, o escógela con el calendario 📅.';
    return '';
  }
  function problema(nat, t, final) {
    var r = lee(t, final);
    if (r.vacio) return { iso: '' };
    if (r.falta) return { err: 'Falta completar la fecha. Qué hacer: escríbela completa, como 24/11/2026, o escógela con el calendario 📅.' };
    if (r.mal) return { err: 'La fecha ' + r.txt + ' no existe. Qué hacer: revisa el día y el mes (dd/mm/aaaa).' };
    var f = fuera(nat, r.iso);
    return f ? { err: f, iso: r.iso } : { iso: r.iso };
  }

  /* ---- el aviso ---- */
  var tip = null;
  function ponTip(txt, el) {
    if (!txt) { if (tip) tip.hidden = true; return; }
    if (!tip) {
      tip = D.createElement('div'); tip.className = 'pf-fc-tip'; tip.setAttribute('role', 'status');
      D.body.appendChild(tip);
    }
    tip.textContent = txt; tip.hidden = false;
    var r = el.getBoundingClientRect(), w = Math.min(320, innerWidth - 16);
    tip.style.width = w + 'px';
    tip.style.left = Math.max(8, Math.min(r.left, innerWidth - w - 8)) + 'px';
    var abajo = r.bottom + 6, alto = tip.offsetHeight;
    tip.style.top = (abajo + alto > innerHeight - 8 ? Math.max(8, r.top - alto - 6) : abajo) + 'px';
  }
  function avisa(txt) {
    try {
      if (window.PORTAL && PORTAL.avisoChico) return PORTAL.avisoChico({ id: 'pf-fc-aviso', texto: txt, ms: 8000 });
      if (window.Q && Q.aviso) return Q.aviso(txt, { tipo: 'error' });
    } catch (e) { /* nada */ }
  }

  /* ---- el par ---- */
  // los eventos que manda la pieza: la pantalla los recibe igual que siempre; la pieza no se los vuelve a pintar
  function emite(par, tipo) { par.propio = true; try { par.nat.dispatchEvent(new Event(tipo, { bubbles: true })); } catch (e) { /* nada */ } par.propio = false; }
  function estilo(nat) {
    return String(nat.getAttribute('style') || '').split(';').filter(function (x) { return x.trim() && !/^\s*--pf-fc-/.test(x); }).join(';');
  }
  function copia(par) {
    var n = par.nat, v = par.vista;
    v.className = String(n.className || '').replace(/\bpf-fc-nat\b/g, '').trim();
    v.classList.add('pf-fc');
    var st = estilo(n); if (v.getAttribute('style') !== st) { if (st) v.setAttribute('style', st); else v.removeAttribute('style'); }
    v.hidden = n.hidden;
    v.disabled = n.disabled;
    v.readOnly = n.readOnly;
    var tt = n.getAttribute('title'); if (tt) v.title = tt; else v.removeAttribute('title');
    var al = n.getAttribute('aria-label') || etiqueta(n); if (al) v.setAttribute('aria-label', al);
    if (n.required) v.setAttribute('aria-required', 'true'); else v.removeAttribute('aria-required');
  }
  function etiqueta(n) {
    try {
      var l = (n.id && D.querySelector('label[for="' + CSS.escape(n.id) + '"]')) || n.closest('label');
      var t = l ? (l.textContent || '').replace(/\s+/g, ' ').trim() : '';
      return t ? t + ' (dd/mm/aaaa)' : 'Fecha (dd/mm/aaaa)';
    } catch (e) { return 'Fecha (dd/mm/aaaa)'; }
  }
  function pinta(par) {
    var v = VAL.get.call(par.nat), t = dmy(v);
    if (D.activeElement === par.vista && par.escribe) return;   // a media escritura no se le cambia
    if (par.vista.value !== t) par.vista.value = t;
    par.ultimo = v; rojo(par, '');
  }
  function rojo(par, err) {
    if (err) { par.vista.setAttribute('aria-invalid', 'true'); par.vista.classList.add('pf-fc-mal'); }
    else { par.vista.removeAttribute('aria-invalid'); par.vista.classList.remove('pf-fc-mal'); }
    par.err = err || '';
  }
  function pone(par, v) {
    var antes = VAL.get.call(par.nat);
    if (antes === v) return false;
    VAL.set.call(par.nat, v);
    emite(par, 'input');
    return true;
  }
  function cierra(par) {
    var r = problema(par.nat, par.vista.value, true);
    par.escribe = false;
    if (r.err) {
      rojo(par, r.err); pone(par, '');
      ponTip('');
      avisa(r.err);
    } else {
      rojo(par, ''); pone(par, r.iso);
      par.vista.value = dmy(r.iso);
      ponTip('');
    }
    var v = VAL.get.call(par.nat);
    if (v !== par.alEntrar) { par.alEntrar = v; emite(par, 'change'); }
  }
  function abre(par) {
    var n = par.nat;
    if (n.disabled || n.readOnly) return;
    var r = par.vista.getBoundingClientRect();
    n.style.setProperty('--pf-fc-x', r.left + 'px'); n.style.setProperty('--pf-fc-y', r.top + 'px');
    n.style.setProperty('--pf-fc-w', r.width + 'px'); n.style.setProperty('--pf-fc-h', r.height + 'px');
    n.classList.add('pf-fc-abre');
    par.alEntrar = VAL.get.call(n);
    try { if (n.showPicker) { n.showPicker(); return; } } catch (e) { /* abajo */ }
    try { n.focus({ preventScroll: true }); n.click(); } catch (e) { /* nada */ }
  }
  function enIcono(v, e) {
    var r = v.getBoundingClientRect(), x = (e.clientX != null ? e.clientX : -1);
    return x >= r.right - 34 && x <= r.right;
  }
  function caret(v, nDig) {
    var t = v.value, i = 0, k = 0;
    while (i < t.length && k < nDig) { if (/\d/.test(t[i])) k++; i++; }
    try { v.setSelectionRange(i, i); } catch (e) { /* nada */ }
  }

  function arma(nat) {
    var ya = PARES.get(nat);
    if (ya) {   // regresó a la página (una ventana que se vuelve a abrir): con su par, junto a él
      if (VIVOS.indexOf(ya) < 0) VIVOS.push(ya);
      if (nat.previousSibling !== ya.vista) nat.parentNode.insertBefore(ya.vista, nat);
      return;
    }
    // un clon (cloneNode) trae la clase y un campo que se ve sin vida: se quita y se arma de nuevo
    var prev = nat.previousElementSibling;
    if (prev && prev.hasAttribute('data-fecha-vista') && !VISTAS.has(prev)) prev.remove();
    var v = D.createElement('input');
    v.type = 'text'; v.setAttribute('inputmode', 'numeric'); v.setAttribute('autocomplete', 'off');
    v.setAttribute('placeholder', 'dd/mm/aaaa'); v.setAttribute('maxlength', '10'); v.setAttribute('spellcheck', 'false');
    v.setAttribute('data-fecha-vista', ''); v.setAttribute('enterkeyhint', 'done');
    VISTAS.add(v);
    var par = { nat: nat, vista: v, ultimo: '', alEntrar: '', escribe: false, propio: false, err: '' };
    PARES.set(nat, par); VIVOS.push(par);
    nat.classList.add('pf-fc-nat');
    nat.setAttribute('tabindex', '-1'); nat.setAttribute('aria-hidden', 'true');
    copia(par);
    nat.parentNode.insertBefore(v, nat);
    // lo que la pantalla le pone al de siempre se ve
    Object.defineProperty(nat, 'value', { configurable: true, get: function () { return VAL.get.call(this); }, set: function (x) { VAL.set.call(this, x); par.escribe = false; pinta(par); } });
    if (VAD) Object.defineProperty(nat, 'valueAsDate', { configurable: true, get: function () { return VAD.get.call(this); }, set: function (x) { VAD.set.call(this, x); par.escribe = false; pinta(par); } });
    nat.addEventListener('input', function () { if (!par.propio && !par.escribe) pinta(par); });
    nat.addEventListener('change', function () { if (par.propio) return; par.escribe = false; pinta(par); par.alEntrar = VAL.get.call(nat); });
    nat.addEventListener('focus', function () { if (!nat.classList.contains('pf-fc-abre')) v.focus(); });
    nat.addEventListener('blur', function () { nat.classList.remove('pf-fc-abre'); });
    new MutationObserver(function () { copia(par); }).observe(nat, { attributes: true, attributeFilter: ['class', 'style', 'hidden', 'disabled', 'readonly', 'title', 'aria-label', 'required'] });

    // lo que se escribe
    v.addEventListener('focus', function () { par.alEntrar = VAL.get.call(nat); });
    v.addEventListener('input', function (e) {
      e.stopPropagation();
      var raw = v.value, pos = v.selectionStart == null ? raw.length : v.selectionStart;
      var nDig = raw.slice(0, pos).replace(/\D/g, '').length;
      var f = forma(raw);
      if (f !== raw) { v.value = f; caret(v, nDig); }
      par.escribe = true;
      var r = problema(nat, f, false);
      if (r.iso != null && !r.err) { rojo(par, ''); ponTip(''); if (r.iso) pone(par, r.iso); else pone(par, ''); }
      else if (r.err && !lee(f, false).falta) { rojo(par, r.err); ponTip(r.err, v); }
      else { rojo(par, ''); ponTip(''); }
    });
    v.addEventListener('change', function (e) { e.stopPropagation(); });
    v.addEventListener('blur', function () { cierra(par); });
    v.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { cierra(par); return; }
      if (e.altKey && e.key === 'ArrowDown') { e.preventDefault(); abre(par); return; }
      if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !e.altKey && !v.readOnly && !v.disabled) {
        var r = lee(v.value, true); if (!r.iso) return;
        e.preventDefault();
        var p = r.iso.split('-'), f = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] + (e.key === 'ArrowUp' ? 1 : -1)));
        var nv = f.toISOString().slice(0, 10);
        if (fuera(nat, nv)) return;
        v.value = dmy(nv); par.escribe = true; rojo(par, ''); pone(par, nv);
      }
    });
    v.addEventListener('pointerdown', function (e) { if (enIcono(v, e) && !v.disabled && !v.readOnly) e.preventDefault(); });
    v.addEventListener('click', function (e) { if (enIcono(v, e)) abre(par); });
    v.addEventListener('mousemove', function (e) { v.style.cursor = enIcono(v, e) && !v.disabled && !v.readOnly ? 'pointer' : ''; });
    pinta(par);
  }

  /* ---- los estilos de cada pantalla para «input[type=date]» también para el que se ve ---- */
  var RE_TIPO = /\[\s*type\s*=\s*(?:"date"|'date'|date)\s*(?:i\s*)?\]/gi;
  function partes(sel) {
    var out = [], p = 0, cur = '';
    for (var i = 0; i < sel.length; i++) {
      var c = sel[i];
      if (c === '(') p++; else if (c === ')') p--;
      if (c === ',' && !p) { out.push(cur); cur = ''; } else cur += c;
    }
    out.push(cur); return out;
  }
  function deReglas(lista) {
    if (!lista) return;
    for (var i = 0; i < lista.length; i++) {
      var r = lista[i];
      if (r.cssRules && !r.selectorText) { deReglas(r.cssRules); continue; }
      if (!r.selectorText || r.__pfFc || !/type\s*=\s*["']?date/i.test(r.selectorText)) continue;
      r.__pfFc = true;
      var nuevas = partes(r.selectorText).filter(function (s) { RE_TIPO.lastIndex = 0; return RE_TIPO.test(s) && !/::-webkit|::-moz/i.test(s); })
        .map(function (s) { RE_TIPO.lastIndex = 0; return s.replace(RE_TIPO, '.pf-fc'); });
      if (!nuevas.length) continue;
      var sel = nuevas.join(','), sig = lista[i + 1];
      if (sig && sig.selectorText === sel) { sig.__pfFc = true; i++; continue; }   // ya estaba copiada
      try {
        var hoja = r.parentRule || r.parentStyleSheet;
        var k = hoja.insertRule(sel + '{' + r.style.cssText + '}', i + 1);
        if (hoja.cssRules[k]) hoja.cssRules[k].__pfFc = true;
        i++;
      } catch (e) { /* una regla que el navegador no acepta se queda sin copiar */ }
    }
  }
  function estilos() {
    for (var i = 0; i < D.styleSheets.length; i++) {
      var h = D.styleSheets[i], rs;
      try { rs = h.cssRules; } catch (e) { continue; }   // de otro sitio (no se puede leer): se cuida en su archivo
      deReglas(rs);
    }
  }

  /* ---- la pieza ---- */
  function base() {
    if (D.getElementById('pf-fc-css')) return;
    var s = D.createElement('style'); s.id = 'pf-fc-css';
    s.textContent =
      'input.pf-fc-nat{position:absolute!important;opacity:0!important;pointer-events:none!important;width:1px!important;height:1px!important;min-width:0!important;padding:0!important;border:0!important;margin:0!important}'
      + 'input.pf-fc-nat.pf-fc-abre{position:fixed!important;left:var(--pf-fc-x)!important;top:var(--pf-fc-y)!important;width:var(--pf-fc-w)!important;height:var(--pf-fc-h)!important}'
      + 'input.pf-fc{background-image:' + ICONO + '!important;background-repeat:no-repeat!important;background-position:right 9px center!important;background-size:16px 16px!important;padding-right:32px!important;font-variant-numeric:tabular-nums}'
      + 'input.pf-fc:disabled,input.pf-fc[readonly]{background-image:none!important;padding-right:10px!important}'
      + 'input.pf-fc.pf-fc-mal{border-color:#C62828!important;box-shadow:inset 0 0 0 1px #C62828!important}'
      + '.pf-fc-tip{position:fixed;z-index:100000;background:#FFF4F4;color:#8E1B1B;border:1px solid #E7A3A3;border-radius:8px;padding:7px 10px;font:500 13px/1.35 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 6px 18px rgba(10,18,32,.18);pointer-events:none}'
      + ':root[data-theme="dark"] .pf-fc-tip{background:#3A1717;color:#FFD9D9;border-color:#7A3030}';
    (D.head || D.documentElement).appendChild(s);
  }
  function busca(raiz) {
    if (!raiz || raiz.nodeType !== 1) return;
    if (raiz.matches && raiz.matches(SEL)) arma(raiz);
    else if (raiz.querySelectorAll) { var l = raiz.querySelectorAll(SEL); for (var i = 0; i < l.length; i++) arma(l[i]); }
  }
  var pendiente = false, nuevos = [], hojas = false;
  function revisa() {
    pendiente = false;
    var l = nuevos; nuevos = [];
    for (var i = 0; i < l.length; i++) busca(l[i]);
    if (hojas) { hojas = false; estilos(); }
    // un campo de siempre que se movió (FILTROS) se lleva a su par; uno que se quitó, se lleva a su par
    for (var j = VIVOS.length - 1; j >= 0; j--) {
      var p = VIVOS[j];
      if (!p.nat.isConnected) { if (p.vista.isConnected && p.vista.parentNode !== p.nat.parentNode) p.vista.remove(); VIVOS.splice(j, 1); continue; }
      if (p.nat.previousSibling !== p.vista) p.nat.parentNode.insertBefore(p.vista, p.nat);
    }
  }
  function mira() {
    new MutationObserver(function (ms) {
      var hay = false;
      for (var i = 0; i < ms.length; i++) {
        var m = ms[i];
        if (m.type === 'attributes') { if (m.target.matches && m.target.matches(SEL)) { nuevos.push(m.target); hay = true; } continue; }
        for (var k = 0; k < m.addedNodes.length; k++) {
          var n = m.addedNodes[k];
          if (n.nodeType !== 1) continue;
          if (n.tagName === 'STYLE' || (n.tagName === 'LINK' && /stylesheet/i.test(n.rel))) { hojas = true; if (n.tagName === 'LINK') n.addEventListener('load', function () { hojas = true; agenda(); }, { once: true }); }
          if (n.tagName === 'INPUT' || n.firstElementChild) nuevos.push(n);
          hay = true;
        }
        if (m.removedNodes.length) hay = true;
      }
      if (hay) agenda();
    }).observe(D.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['type'] });
  }
  function agenda() { if (!pendiente) { pendiente = true; (window.queueMicrotask || setTimeout)(revisa); } }
  function empieza() {
    base(); estilos(); busca(D.body || D.documentElement);
    addEventListener('load', function () { estilos(); });
  }
  mira();
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', empieza); else empieza();
  addEventListener('scroll', function () { if (tip && !tip.hidden) ponTip(''); }, true);

  window.PROFASE_CAMPO_FECHA = { lee: lee, forma: forma, dmy: dmy, arma: arma, estilos: estilos };
})();
