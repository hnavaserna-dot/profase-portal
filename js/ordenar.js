/* Ordenar cualquier tabla al picar el título de una columna. Una sola pieza para todo el CRM (construir.py la pone en cada
   página, junto a js/portal.js: con_ordenar()); las tablas de hoy y las nuevas la traen solas.

   De dónde viene: Héctor Daniel Nava, 19-nov-2026. Primero en Workflow › Auditoría SAT vs WF («al darle click a los
   encabezados de la tabla; se ordenen de a la z; o z a a»; «sí así es») y luego, para todas («y si lo haces en todas las
   tablas?»; al plan: «sí así es; dale a todos como dices tú… en las que veas viables y en las que no; no; sin problema»).

   Cómo se usa (igual en todas):
   - Primer clic en el título de una columna: de la A a la Z (▲): textos en orden alfabético, montos de menor a mayor y
     fechas de la más antigua a la más reciente. Segundo clic: al revés (▼). Tercer clic: como venía (⇅).
   - Lo vacío («—», «-», sin fecha, sin monto) siempre va al final.
   - Los renglones de grupo (los que ocupan todo el ancho) se quedan en su lugar y se ordena dentro de cada grupo; los
     renglones de totales se quedan abajo de su grupo; el detalle que va pegado a un renglón se mueve con él.
   - En las tablas por páginas (js/paginas.js) se ordena la lista completa, no solo la página que se ve, y se regresa a
     la página 1. Para eso js/paginas.js le avisa a esta pieza (PROFASE_ORDEN.paginador()) y, la primera vez que se ordena,
     se lee una sola vez lo que dice cada renglón de toda la lista (la pantalla la pinta completa en memoria, sin que se
     vea: todo pasa antes de que el navegador vuelva a pintar) y luego se pinta solo la página.
   - Con el teclado: el título se enfoca con Tab y se ordena con Enter o la barra espaciadora.

   Dónde no (se queda como estaba, sin flechas):
   - Tablas que ya ordenan a su manera (traen en sus títulos botones o marcas data-orden, data-sort, data-s, data-k o
     aria-sort): la Cartera, la Cobranza, Base de clientes, Panel de trabajo, Variaciones, Activo fijo, Expedientes y la
     Auditoría SAT vs WF.
   - Tablas para capturar (con campos de texto o listas en sus renglones), sin títulos (thead), con celdas que ocupan
     varios renglones, o donde el orden es el de la tabla misma: la primera columna es un número de renglón (1, 2, 3…),
     meses o años en orden (un plan de pagos, los meses del año, los pasos).
   - Una tabla o lo que la rodea con data-sin-orden. Una columna con data-sin-orden en su título, sin texto o de acciones.
   - Una celda puede decir con qué valor se ordena con data-orden (por ejemplo, la fecha en AAAA-MM-DD).

   Rápido: no revisa cada cambio de la página; solo cuando entra una tabla o cambian sus renglones o sus títulos, y lee
   texto (no mide nada en pantalla). Al deslizar no corre nada. Si la página vuelve a pintar los renglones, el orden
   escogido se vuelve a poner en ese mismo momento (antes de que se vea).
   Pruebas: herramientas/pruebas/pantallas/prueba_ordenar.py. */
(function () {
  'use strict';
  if (window.PROFASE_ORDEN) return;
  if (!window.MutationObserver || !document.documentElement) return;

  var COL = (window.Intl && Intl.Collator) ? new Intl.Collator('es', { numeric: true, sensitivity: 'base' }) : null;
  function cmpTxt(a, b) { return COL ? COL.compare(a, b) : (a < b ? -1 : a > b ? 1 : 0); }
  var ESTADO = {};            // tabla (su clave) → { c: columna, d: 1 o -1 }
  var SEQ = 0;                // para recordar cómo venía cada renglón
  var ANIO = new Date().getFullYear();
  var micro = window.queueMicrotask ? function (f) { window.queueMicrotask(f); } : function (f) { Promise.resolve().then(f); };

  var ESTILO = ''
    + 'th.po-th{cursor:pointer;-webkit-user-select:none;user-select:none}'
    + 'th.po-th:hover{color:var(--ink,#132036)}'
    + 'th.po-th:focus-visible{outline:2px solid var(--accent,#F07A1E);outline-offset:-2px}'
    + 'th.po-th .po-o{display:inline-block;margin-left:4px;font-size:.85em;line-height:1;font-weight:400;opacity:.5;'
    + 'font-style:normal;text-decoration:none;text-transform:none;letter-spacing:0;white-space:nowrap}'
    + 'th.po-th[aria-sort="ascending"] .po-o,th.po-th[aria-sort="descending"] .po-o{opacity:1;font-weight:700;color:var(--accent-ink,#A64B0A)}'
    + '@media print{th.po-th .po-o{display:none}}';
  function estilos() {
    if (document.getElementById('po-css')) return;
    var s = document.createElement('style'); s.id = 'po-css'; s.textContent = ESTILO;
    (document.head || document.documentElement).appendChild(s);
  }

  // ---------- leer lo que dice una celda ----------
  function limpio(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }
  function texto(cell) {
    if (!cell) return '';
    var v = cell.getAttribute && cell.getAttribute('data-orden');
    if (v != null) return limpio(v);
    var t = cell.textContent || '';
    var o = cell.querySelector && cell.querySelector('.po-o');
    if (o) t = t.replace(o.textContent, '');
    return limpio(t);
  }
  var VACIO = /^(?:[—–\-·.]*|n\/a|n\/d|s\/d)$/i;
  function sinAcento(s) { return s.normalize ? s.normalize('NFD').replace(/[̀-ͯ]/g, '') : s; }
  function aNum(t) {
    var s = t.replace(/\s+/g, '').replace(/^(?:MXN|USD|US\$)/i, '').replace(/(?:MXN|USD|pesos|dlls?\.?)$/i, '');
    var neg = false;
    if (/^\(.*\)$/.test(s)) { neg = true; s = s.slice(1, -1); }
    s = s.replace(/^[−–]/, '-').replace(/^\$[−–]/, '$-');
    var m = /^(-)?\$?(-)?(\d{1,3}(?:,\d{3})+|\d+)(\.\d+)?(%)?$/.exec(s);
    if (!m) return null;
    var v = parseFloat(m[3].replace(/,/g, '') + (m[4] || ''));
    return (m[1] || m[2] || neg) ? -v : v;
  }
  var MES = { ene: 1, enero: 1, jan: 1, feb: 2, febrero: 2, mar: 3, marzo: 3, abr: 4, abril: 4, apr: 4, may: 5, mayo: 5,
    jun: 6, junio: 6, jul: 7, julio: 7, ago: 8, agosto: 8, aug: 8, sep: 9, sept: 9, set: 9, septiembre: 9, setiembre: 9,
    oct: 10, octubre: 10, nov: 11, noviembre: 11, dic: 12, diciembre: 12, dec: 12 };
  function anio2(y) { y = +y; return y < 100 ? 2000 + y : y; }
  // fechas como las escribe el portal: 2026-11-19, 19/11/2026, 19/11, 19 nov 2026, 19 de noviembre de 2026, nov 2026, ene-26,
  // con o sin la hora y el día de la semana; regresa un número que ordena (o null)
  function aFecha(t) {
    var s = sinAcento(t.toLowerCase()).trim().replace(/^(lun|mar|mie|jue|vie|sab|dom)[a-z]*\.?,?\s+(?=\d{1,2}\b)/, '');
    var m, y = 0, mo = 0, d = 1, h = 0, mi = 0;
    if ((m = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?(?:[ t](\d{1,2}):(\d{2}))?/.exec(s))) { y = +m[1]; mo = +m[2]; d = +(m[3] || 1); h = +(m[4] || 0); mi = +(m[5] || 0); }
    else if ((m = /^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})(?!\d)(?:,?\s+(\d{1,2}):(\d{2}))?/.exec(s))) { d = +m[1]; mo = +m[2]; y = anio2(m[3]); h = +(m[4] || 0); mi = +(m[5] || 0); }
    // «24/11» y «24/11 10:15» (dd/mm sin el año, como las escribe PROFASE_FECHA: siempre con dos cifras; 25-nov-2026)
    else if ((m = /^(\d{2})\/(\d{2})(?![\d\/])(?:,?\s+(\d{1,2}):(\d{2}))?/.exec(s))) { d = +m[1]; mo = +m[2]; y = ANIO; h = +(m[3] || 0); mi = +(m[4] || 0); }
    else if ((m = /^(\d{1,2})(?:\s+de)?[\s\-\/]+([a-z]{3,10})\.?(?:[\s,\-\/]+(?:de(?:l)?\s+)?(\d{4}|\d{2})(?![\d:]))?(?:,?\s+(?:a las\s+)?(\d{1,2}):(\d{2}))?/.exec(s)) && MES[m[2]]) {
      d = +m[1]; mo = MES[m[2]]; y = m[3] ? anio2(m[3]) : ANIO; h = +(m[4] || 0); mi = +(m[5] || 0);
    }
    else if ((m = /^([a-z]{3,10})\.?[\s\-\/]+(?:de(?:l)?\s+)?(\d{4}|\d{2})(?!\d)/.exec(s)) && MES[m[1]]) { mo = MES[m[1]]; y = anio2(m[2]); }
    else if ((m = /^([a-z]{3,10})\.?$/.exec(s)) && MES[m[1]]) { mo = MES[m[1]]; }
    else return null;
    if (mo < 1 || mo > 12 || d < 1 || d > 31 || h > 23 || mi > 59) return null;
    return ((y * 100 + mo) * 100 + d) * 10000 + h * 100 + mi;
  }
  // ¿la columna es de números, de fechas o de texto? (lo que dicen la mayoría de sus celdas con algo)
  function tipo(vals) {
    var n = 0, num = 0, fec = 0;
    for (var i = 0; i < vals.length && n < 600; i++) {
      var v = vals[i]; if (VACIO.test(v)) continue; n++;
      if (aNum(v) != null) num++; else if (aFecha(v) != null) fec++;
    }
    if (!n) return 'txt';
    if (num >= n * 0.85) return 'num';
    if (fec >= n * 0.85) return 'fecha';
    if (num + fec >= n * 0.85 && fec > 0 && num > 0) return 'mixto';
    return 'txt';
  }
  function llave(v, tp) {
    if (VACIO.test(v)) return null;
    if (tp === 'num') return aNum(v);
    if (tp === 'fecha') return aFecha(v);
    if (tp === 'mixto') { var f = aFecha(v); return f != null ? f : aNum(v); }
    return v;
  }
  function compara(a, b, tp) {
    if (a == null || b == null) return (a == null) - (b == null);     // lo vacío, al final (en los dos sentidos: lo pone ordena())
    return tp === 'txt' ? cmpTxt(a, b) : (a < b ? -1 : a > b ? 1 : 0);
  }

  // ---------- la tabla: sus títulos, sus columnas y sus renglones ----------
  function cabeza(t) {
    var th = t.tHead; if (!th) return null;
    // El renglón de sumas de arriba (tr.sumas, «todo a la mano», 25-nov-2026) no es de títulos: ni se ordena ni cuenta.
    var R = Array.prototype.filter.call(th.rows, function (x) { return !x.classList.contains('sumas'); }), grid = [], n = 0, r, i, c, a, b;
    if (!R.length) return null;
    for (r = 0; r < R.length; r++) {
      grid[r] = grid[r] || []; c = 0;
      for (i = 0; i < R[r].cells.length; i++) {
        var cell = R[r].cells[i];
        while (grid[r][c]) c++;
        var cs = Math.max(1, cell.colSpan || 1), rs = Math.max(1, cell.rowSpan || 1);
        for (a = 0; a < rs && r + a < R.length; a++) for (b = 0; b < cs; b++) { grid[r + a] = grid[r + a] || []; grid[r + a][c + b] = cell; }
        c += cs;
      }
    }
    for (r = 0; r < grid.length; r++) n = Math.max(n, grid[r].length);
    var ult = grid[R.length - 1] || [], hojas = [];
    for (c = 0; c < n; c++) { var h = ult[c]; hojas[c] = h && (h.colSpan || 1) === 1 ? h : null; }
    return { n: n, hojas: hojas };
  }
  function celdas(tr) {
    var out = [], c = 0;
    for (var i = 0; i < tr.cells.length; i++) { var cell = tr.cells[i]; out[c] = cell; c += Math.max(1, cell.colSpan || 1); }
    return out;
  }
  var TOTAL = /^(?:gran\s+)?(?:sub)?(?:total(?:es)?|sumas?)(?:\s+(?:general(?:es)?|del?\b.*|\d{4}\b.*|\(.*))?:?$/i;
  var CL_TOTAL = /(?:^|[\s_-])(?:tot|total|totales|suma|pie|sumas)(?:$|[\s_-])/i;
  var CL_DET = /(?:^|[\s_-])(?:det|detalle|deta|exp|expande|hijo|hija|sub|mas|extra|nota|abierto|ficha)(?:$|[\s_-])/i;
  function especial(tr, n) {     // renglón de grupo, de detalle o de mensaje: una celda que ocupa (casi) todo el ancho
    var cs = tr.cells;
    if (!cs.length) return true;
    if (cs.length === 1 && n > 1) return true;
    for (var i = 0; i < cs.length; i++) { var s = cs[i].colSpan || 1; if (s >= 2 && s * 2 >= n) return true; }
    return false;
  }
  function esTotal(tr) {
    if (CL_TOTAL.test(tr.className || '')) return true;
    for (var i = 0; i < tr.cells.length && i < 3; i++) { var x = texto(tr.cells[i]); if (x) return TOTAL.test(x); }
    return false;
  }
  function esDetalle(tr) {
    return tr.hidden || CL_DET.test(tr.className || '') || (tr.style && tr.style.display === 'none');
  }
  // los renglones de cada tbody, en «unidades» que se mueven juntas (un renglón y su detalle) y por grupos
  function partes(tb, n) {
    var rows = tb.rows, seg = [], segs = [seg], u = null, i;
    for (i = 0; i < rows.length; i++) {
      var tr = rows[i];
      if (tr.__poI == null) tr.__poI = ++SEQ;
      if (especial(tr, n)) {
        if (u && esDetalle(tr)) { u.rows.push(tr); continue; }
        u = null; seg = []; segs.push({ sep: tr }); segs.push(seg); continue;
      }
      if (esTotal(tr)) { u = null; seg.push({ rows: [tr], tot: true, i: tr.__poI }); continue; }
      u = { rows: [tr], i: tr.__poI }; seg.push(u);
    }
    return segs;
  }
  function datos(t, n) {   // los renglones de datos (sin grupos, detalle ni totales), en el orden en que están
    var out = [];
    for (var b = 0; b < t.tBodies.length; b++) {
      partes(t.tBodies[b], n).forEach(function (s) { if (Array.isArray(s)) s.forEach(function (u) { if (!u.tot) out.push(u.rows[0]); }); });
    }
    return out;
  }

  // ---------- ¿se puede ordenar esta tabla? ----------
  var PROPIO = '[data-orden],[data-sort],[data-s],[data-k],.ord,.ordb';
  function propio(t) {
    var h = t.tHead; if (!h) return false;
    if (h.querySelector(PROPIO)) return true;
    var a = h.querySelectorAll('[aria-sort]');
    for (var i = 0; i < a.length; i++) if (!a[i].classList.contains('po-th')) return true;
    var bs = h.querySelectorAll('button');
    for (var j = 0; j < bs.length; j++) if (limpio(bs[j].textContent).length > 1) return true;
    return false;
  }
  var CAPTURA = 'input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]),select,textarea,[contenteditable="true"]';
  var MES_SOLO = /^(?:[a-z]{3,10}\.?(?:[\s\-\/]+(?:de\s+)?\d{2,4})?|\d{4}-\d{1,2})$/;
  // la primera columna dice el orden de la tabla misma: 1, 2, 3…; meses o años seguidos
  function semantico(rows) {
    if (rows.length < 2) return false;
    var v = rows.map(function (tr) { return texto(celdas(tr)[0]); });
    if (v.every(function (x) { return /^\d{1,4}$/.test(x); })) {
      var a = v.map(Number);
      if (a.every(function (x, i) { return i === 0 || x === a[i - 1] + 1; })) return true;
      if (a.every(function (x) { return x >= 1990 && x <= 2100; }) && (a.every(function (x, i) { return !i || x > a[i - 1]; }) || a.every(function (x, i) { return !i || x < a[i - 1]; }))) return true;
    }
    var meses = v.map(function (x) { var s = sinAcento(x.toLowerCase()); return MES_SOLO.test(s) ? aFecha(x) : null; });
    if (meses.every(function (f) { return f != null; })) {
      var crece = meses.every(function (f, i) { return !i || f > meses[i - 1]; }), baja = meses.every(function (f, i) { return !i || f < meses[i - 1]; });
      if (crece || baja) return true;
    }
    return false;
  }
  function viable(t, cab) {
    if (!t.isConnected || t.closest('[data-sin-orden]')) return false;
    if (!cab || cab.n < 2 || !t.tBodies.length) return false;
    if (t.__poPag && t.__poPag.no) return false;
    if (propio(t)) return false;
    for (var b = 0; b < t.tBodies.length; b++) {
      var tb = t.tBodies[b];
      for (var r = 0; r < tb.rows.length; r++) for (var c = 0; c < tb.rows[r].cells.length; c++) if ((tb.rows[r].cells[c].rowSpan || 1) > 1) return false;
    }
    var rows = datos(t, cab.n);
    if (rows.length < 2 && !(t.__poPag && rows.length)) return false;
    for (var i = 0; i < rows.length && i < 200; i++) if (rows[i].querySelector(CAPTURA)) return false;
    if (semantico(rows)) return false;
    t.__poN = rows.length;
    return true;
  }
  // Lo mismo que viable(), solo para los renglones que se agregaron al final de una tabla que ya se podía ordenar
  // (revisión nocturna del 26-nov-2026: Variaciones › «Resueltas» agrega ~6,500 renglones en 17 pedazos y, con cada
  // pedazo, viable() volvía a leer cada celda de todos los renglones: 168 ms). Agregar al final no hace «semántica» a una
  // tabla que no lo era (sus pares de antes siguen igual) ni cambia lo que ya se revisó; solo hay que ver los nuevos:
  // celdas de varios renglones y, entre los primeros 200 de datos, campos para capturar. null: no se sabe, revísala toda.
  function viableNuevos(t, cab, nuevos) {
    if (!t.isConnected || t.closest('[data-sin-orden]')) return false;
    if (!cab || cab.n < 2 || !t.tBodies.length) return false;
    if (t.__poPag && t.__poPag.no) return false;
    if (propio(t)) return false;
    if (!t.__po || t.__poN == null || t.__po.cab.n !== cab.n) return null;
    var n = t.__poN;
    for (var i = 0; i < nuevos.length; i++) {
      var tr = nuevos[i];
      if (!tr.parentNode || tr.parentNode.parentNode !== t || tr.parentNode.tagName !== 'TBODY') return null;
      for (var c = 0; c < tr.cells.length; c++) if ((tr.cells[c].rowSpan || 1) > 1) return false;
      if (especial(tr, cab.n) || esTotal(tr)) continue;
      if (n < 200 && tr.querySelector(CAPTURA)) return false;
      n++;
    }
    t.__poN = n;
    return true;
  }

  // ---------- los títulos: flechas, clic y teclado ----------
  function clave(t, cab) {
    var p = (location.pathname || '') + '#' + (t.id || '');
    return p + '|' + cab.hojas.map(function (h) { return h ? h.__poT != null ? h.__poT : texto(h) : ''; }).join('|');
  }
  var SIN_COL = /^(?:acciones?|abrir|ver|opciones|editar|seleccionar|quitar|borrar)$/i;
  function columnaSirve(h) {
    if (!h || h.closest('[data-sin-orden]')) return false;
    if (h.querySelector('input,select,textarea,button,a[href]')) return false;
    var x = texto(h);
    return !!x && x.length > 0 && !SIN_COL.test(x) && /[0-9a-záéíóúñü#%$]/i.test(x);
  }
  function flecha(st, c) { return st && st.c === c ? (st.d > 0 ? '▲' : '▼') : '⇅'; }
  function pintaCab(t) {
    var P = t.__po; if (!P) return;
    var st = ESTADO[P.k];
    P.cab.hojas.forEach(function (h, c) {
      if (!h || !h.classList.contains('po-th')) return;
      var on = st && st.c === c, o = h.querySelector('.po-o');
      if (!o) { o = document.createElement('span'); o.className = 'po-o'; o.setAttribute('aria-hidden', 'true'); h.appendChild(o); }
      var f = flecha(st, c); if (o.textContent !== f) o.textContent = f;
      var as = on ? (st.d > 0 ? 'ascending' : 'descending') : 'none';
      if (h.getAttribute('aria-sort') !== as) h.setAttribute('aria-sort', as);
      if (h.__poTitulo) {
        var tt = on ? (st.d > 0 ? 'Ordenado de la A a la Z · pica para al revés' : 'Ordenado de la Z a la A · pica para dejarlo como venía') : 'Ordenar por ' + (h.__poT || '').toLowerCase();
        if (h.title !== tt) h.title = tt;
      }
    });
  }
  function quitaCab(t) {
    var P = t.__po; if (!P) return;
    P.cab.hojas.forEach(function (h) {
      if (!h || !h.classList.contains('po-th')) return;
      h.classList.remove('po-th'); h.removeAttribute('aria-sort');
      if (h.__poTab) h.removeAttribute('tabindex');
      if (h.__poTitulo) h.removeAttribute('title');
      var o = h.querySelector('.po-o'); if (o) o.parentNode.removeChild(o);
    });
    t.__po = null;
  }
  function decora(t, nuevos) {
    var cab = cabeza(t);
    var ok = nuevos && nuevos.length ? viableNuevos(t, cab, nuevos) : null;
    if (ok === null) ok = viable(t, cab);
    if (!ok) { if (t.__po) quitaCab(t); return null; }
    // ¿ya estaba y los títulos son los mismos?
    if (t.__po && t.__po.cab.n === cab.n && t.__po.cab.hojas.every(function (h, c) { return h === cab.hojas[c] && (!h || !h.classList.contains('po-th') || h.querySelector('.po-o')); })) return t.__po;
    if (t.__po) quitaCab(t);
    estilos();
    var alguna = false;
    cab.hojas.forEach(function (h, c) {
      if (!columnaSirve(h)) return;
      h.__poT = texto(h); h.__poC = c; h.classList.add('po-th'); alguna = true;
      if (!h.hasAttribute('tabindex')) { h.tabIndex = 0; h.__poTab = true; }
      if (!h.hasAttribute('title')) h.__poTitulo = true;
      if (!h.hasAttribute('scope')) h.setAttribute('scope', 'col');
    });
    if (!alguna) return null;
    t.__po = { k: clave(t, cab), cab: cab };
    pintaCab(t);
    return t.__po;
  }

  // ---------- ordenar los renglones en la página (tablas sin páginas) ----------
  function ordenaDom(t) {
    var P = t.__po; if (!P) return;
    var st = ESTADO[P.k], n = P.cab.n, tp = 'txt';
    var todas = [], b, i;
    for (b = 0; b < t.tBodies.length; b++) todas.push(partes(t.tBodies[b], n));
    if (st) {
      var vals = [];
      todas.forEach(function (segs) { segs.forEach(function (s) { if (Array.isArray(s)) s.forEach(function (u) { if (!u.tot) vals.push(texto(celdas(u.rows[0])[st.c])); }); }); });
      tp = tipo(vals);
    }
    var cambia = false;
    todas.forEach(function (segs, bi) {
      var tb = t.tBodies[bi], orden = [];
      segs.forEach(function (s) {
        if (!Array.isArray(s)) { orden.push(s.sep); return; }
        var us = s.filter(function (u) { return !u.tot; }), tots = s.filter(function (u) { return u.tot; });
        us.forEach(function (u) { u.k = st ? llave(texto(celdas(u.rows[0])[st.c]), tp) : null; });
        us.sort(function (a, z) {
          if (!st) return a.i - z.i;
          if (a.k == null || z.k == null) return (a.k == null) - (z.k == null) || a.i - z.i;
          return st.d * compara(a.k, z.k, tp) || a.i - z.i;
        });
        us.concat(tots).forEach(function (u) { u.rows.forEach(function (r) { orden.push(r); }); });
      });
      var actual = tb.rows;
      for (i = 0; i < orden.length; i++) if (actual[i] !== orden[i]) break;
      if (i === orden.length) return;
      cambia = true;
      var fr = document.createDocumentFragment();
      orden.forEach(function (r) { fr.appendChild(r); });
      tb.appendChild(fr);
    });
    if (cambia) mo.takeRecords();
  }

  // ---------- tablas por páginas (js/paginas.js) ----------
  // Cada paginador le pasa a esta pieza su lista; si hay un orden escogido, la regresa ordenada completa. Lo que dice
  // cada renglón se lee una sola vez de lo que pinta la pantalla (mide()) y se guarda con cada elemento de la lista.
  function buscaTabla(nav) {
    for (var e = nav, n = 0; e && n < 6 && e !== document.body; e = e.parentElement, n++) {
      var ts = e.querySelectorAll ? e.querySelectorAll('table') : [], mejor = null;
      for (var i = 0; i < ts.length; i++) if (ts[i].compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING) mejor = ts[i];
      if (mejor) return mejor;
    }
    return null;
  }
  // lo que dice cada renglón se guarda con lo que trae su elemento de la lista (su contenido): así sirve aunque la pantalla
  // vuelva a armar sus objetos cada vez que pinta, y si algo cambió de verdad se vuelve a leer. Si no se puede (muy grande
  // o con vueltas), con el elemento mismo.
  function firma(item) {
    if (!item || typeof item !== 'object') return 'v:' + String(item);
    try { var j = JSON.stringify(item); return j && j.length <= 6000 ? j : null; } catch (e) { return null; }
  }
  function guardaLlaves(P, item, cs) {
    var f = firma(item);
    if (f != null) P.llM.set(f, cs); else if (item && typeof item === 'object') P.llW.set(item, cs);
  }
  function llavesDe(P, item) {
    var f = firma(item);
    return f != null ? P.llM.get(f) : (item && typeof item === 'object' ? P.llW.get(item) : undefined);
  }
  function mide(P) {
    var t = P.tabla; if (!t || P.no || !P.repinta) return;
    // nunca en vueltas: si después de leer la pantalla vuelve a pintar cosas que no se leyeron (otra lista u otros
    // objetos cada vez), a la tercera seguida en menos de 2 segundos esa tabla se queda sin ordenar, como estaba
    var ahora = Date.now();
    P.seguidas = ahora - P.medido < 2000 ? (P.seguidas || 0) + 1 : 0;
    if (P.seguidas >= 2) { P.no = true; aviso(t, 'vuelve a pintar cosas que no se leyeron'); if (t.__po) { delete ESTADO[t.__po.k]; quitaCab(t); } try { P.repinta(); } catch (e) { /* nada */ } return; }
    P.mide = true; P.ultima = null; P.nUlt = 0;
    try { P.repinta(); } catch (e) { P.mide = false; P.no = true; }
    P.mide = false;
    var L = P.ultima, cab = cabeza(t);
    if (!L || !cab || P.nUlt !== 1) { P.no = true; }   // una sola lista mientras se lee (si pinta dos distintas, no se adivina)
    else {
      var rows = datos(t, cab.n);
      if (rows.length !== L.length) P.no = true;
      else { P.llM = new Map(); P.llW = new WeakMap(); }   // solo lo de la lista de hoy
      if (!P.no) rows.forEach(function (tr, i) { var cs = celdas(tr), v = []; for (var c = 0; c < cab.n; c++) v[c] = texto(cs[c]); guardaLlaves(P, L[i], v); });
    }
    P.medido = Date.now();
    if (P.no) aviso(t, !L ? 'no pintó la lista al leerla' : P.nUlt !== 1 ? 'pintó dos listas distintas' : 'sus renglones no son uno por cada elemento');
    if (P.no) { delete ESTADO[t.__po ? t.__po.k : '']; if (t.__po) quitaCab(t); }
    try { P.repinta(); } catch (e) { /* la pantalla ya lo dice */ }
  }
  // para las pruebas y la revisión: por qué una tabla por páginas se quedó sin ordenar (sin datos de nadie)
  function aviso(t, por) { try { console.warn('[ordenar] ' + (location.pathname.split('/').pop() || '') + (t.id ? ' #' + t.id : '') + ': se queda sin ordenar (' + por + ')'); } catch (e) { /* nada */ } }
  function paginador(o) {
    var P = { donde: o.donde, tabla: o.tabla || null, repinta: o.repinta, inicio: o.inicio, llW: new WeakMap(), llM: new Map(),
      mide: false, ultima: null, no: false, pend: false, medido: 0 };
    P.corta = function (lista) {
      var t = P.tabla && P.tabla.isConnected ? P.tabla : (P.tabla = buscaTabla(P.donde));
      if (!t || P.no) return { lista: lista };
      if (t.__poPag !== P) t.__poPag = P;
      if (P.mide) { if (P.ultima && P.ultima !== lista) P.nUlt++; P.ultima = lista; if (!P.nUlt) P.nUlt = 1; return { lista: lista, completa: true }; }
      var po = t.__po || decora(t), st = po && ESTADO[po.k];
      if (!st) return { lista: lista };
      var ks = [];
      for (var i = 0; i < lista.length; i++) {
        if (!(ks[i] = llavesDe(P, lista[i]))) {
          if (!P.pend) { P.pend = true; micro(function () { P.pend = false; mide(P); }); }
          return { lista: lista };
        }
      }
      return { lista: ordenaLista(lista, st, ks) };
    };
    return P;
  }
  function ordenaLista(lista, st, ks) {
    var vals = lista.map(function (x, i) { return (ks[i] || [])[st.c] || ''; }), tp = tipo(vals);
    var us = lista.map(function (x, i) { return { x: x, i: i, k: llave(vals[i], tp) }; });
    us.sort(function (a, z) {
      if (a.k == null || z.k == null) return (a.k == null) - (z.k == null) || a.i - z.i;
      return st.d * compara(a.k, z.k, tp) || a.i - z.i;
    });
    return us.map(function (u) { return u.x; });
  }

  // ---------- el Excel en el orden escogido ----------
  // los elementos de una lista en el orden en que están ahora los renglones de la tabla (la tabla los pintó en el
  // orden de la lista, uno por renglón); null si no cuadra
  function enDom(t, arr) {
    var po = t && t.__po; if (!po || !po.cab) return null;
    var rows = datos(t, po.cab.n);
    if (rows.length !== arr.length) return null;
    var orden = rows.map(function (r) { return r.__poI; }), por = orden.slice().sort(function (a, z) { return a - z; }), pos = {};
    for (var i = 0; i < por.length; i++) { if (por[i] == null || pos[por[i]] != null) return null; pos[por[i]] = i; }
    return orden.map(function (k) { return arr[pos[k]]; });
  }
  // ¿vive dentro de una pestaña escondida que guarda lo acomodado? (data-guarda, js/portal.js): para esta pieza, escondida
  // como con display:none, sin pedirle al navegador que la acomode solo para preguntar (28-nov-2026)
  var CVH = !!(window.CSS && window.CSS.supports && window.CSS.supports('content-visibility', 'hidden'));
  function guardado(el) { try { return CVH && !!(el && el.closest && el.closest('[hidden][data-guarda-ya]')); } catch (e) { return false; } }
  // la tabla con un orden escogido más cercana a un botón (o la tabla misma); si junto al botón hay dos, ninguna
  function cerca(ref) {
    if (typeof ref === 'string') ref = document.getElementById(ref);
    if (!ref || !ref.tagName) return null;
    if (ref.tagName === 'TABLE') return ref;
    for (var n = ref.parentElement, k = 0; n && k < 8; n = n.parentElement, k++) {
      var ts = n.getElementsByTagName('table'), con = [];
      for (var i = 0; i < ts.length; i++) { var t = ts[i]; if (t.__po && ESTADO[t.__po.k] && !guardado(t) && t.offsetParent) con.push(t); }
      if (con.length === 1) return con[0];
      if (con.length > 1) return null;
    }
    return null;
  }
  function deFila(v) {
    if (v == null) return '';
    if (v instanceof Date) return isNaN(v) ? '' : v.toISOString().slice(0, 16).replace('T', ' ');
    if (typeof v === 'object') {
      if (v.richText) return limpio(v.richText.map(function (r) { return r.text; }).join(''));
      if (v.text != null) return limpio(v.text);
      if (v.result != null) return limpio(v.result);
      return '';
    }
    return limpio(v);
  }
  function igualTit(a) { return sinAcento(limpio(a).toLowerCase()).replace(/[^a-z0-9]+/g, ''); }
  function filasEnOrden(ref, head, filas) {
    if (!Array.isArray(filas) || filas.length < 2) return filas;
    var t = cerca(ref); if (!t) return filas;
    var po = t.__po, st = ESTADO[po.k], P = t.__poPag;
    if (!P) { var d = enDom(t, filas); if (d) return d; }
    var h = po.cab.hojas[st.c], tit = igualTit(h ? (h.__poT != null ? h.__poT : texto(h)) : '');
    var c = -1;
    if (tit && Array.isArray(head)) for (var i = 0; i < head.length; i++) if (igualTit(deFila(head[i])) === tit) { c = i; break; }
    if (c < 0) return filas;
    var normal = [], tot = [];
    filas.forEach(function (f, i) { (Array.isArray(f) && TOTAL.test(deFila(f[0])) ? tot : normal).push({ f: f, i: i }); });
    var vals = normal.map(function (u) { return deFila(Array.isArray(u.f) ? u.f[c] : ''); }), tp = tipo(vals);
    normal.forEach(function (u, j) { u.k = llave(vals[j], tp); });
    normal.sort(function (a, z) {
      if (a.k == null || z.k == null) return (a.k == null) - (z.k == null) || a.i - z.i;
      return st.d * compara(a.k, z.k, tp) || a.i - z.i;
    });
    return normal.concat(tot).map(function (u) { return u.f; });
  }

  // ---------- picar un título ----------
  function pica(h) {
    var t = h.closest('table'); if (!t) return;
    var P = t.__po || decora(t); if (!P || h.__poC == null) return;
    var c = h.__poC, st = ESTADO[P.k];
    if (!st || st.c !== c) ESTADO[P.k] = { c: c, d: 1 };
    else if (st.d > 0) ESTADO[P.k] = { c: c, d: -1 };
    else delete ESTADO[P.k];
    pintaCab(t);
    var pg = t.__poPag;
    if (pg && !pg.no) { if (pg.inicio) pg.inicio(); if (pg.repinta) pg.repinta(); pintaCab(t); }
    else ordenaDom(t);
    try { h.focus({ preventScroll: true }); } catch (e) { /* nada */ }
  }
  var INTER = 'button,a[href],input,select,textarea,label,[role="button"],[contenteditable="true"]';
  document.addEventListener('click', function (ev) {
    var h = ev.target && ev.target.closest && ev.target.closest('th.po-th');
    if (!h) return;
    var i = ev.target.closest(INTER); if (i && h.contains(i) && i !== h) return;
    pica(h);
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Enter' && ev.key !== ' ' && ev.key !== 'Spacebar') return;
    var h = ev.target; if (!h || !h.classList || !h.classList.contains('po-th')) return;
    ev.preventDefault(); pica(h);
  });

  // ---------- revisar las tablas que entran o cambian ----------
  function revisa(t, nuevos) {
    if (!t || t.__poRev) return;
    t.__poRev = true;
    try {
      var P = decora(t, nuevos);
      if (P && ESTADO[P.k] && !(t.__poPag && !t.__poPag.no)) ordenaDom(t);
      else if (P) pintaCab(t);
    } finally { t.__poRev = false; }
  }
  var NO_MIRA = /^(SCRIPT|STYLE|LINK|svg|path|BR|IMG|INPUT|OPTION)$/;
  // Por tabla, lo que cambió: si solo se le agregaron renglones al final de un tbody (un pedazo más de una tabla
  // larga), solo esos renglones (nv); cualquier otra cosa (quitar, insertar en medio, los títulos), toda (nv = null).
  function soloAlFinal(rec) {
    if (rec.type !== 'childList' || rec.removedNodes.length || rec.nextSibling) return null;
    var a = rec.addedNodes, out = [];
    for (var i = 0; i < a.length; i++) {
      var n = a[i];
      if (n.nodeType === 3 && !/\S/.test(n.nodeValue)) continue;
      if (n.nodeType !== 1 || n.tagName !== 'TR') return null;
      out.push(n);
    }
    return out;
  }
  var mo = new MutationObserver(function (ms) {
    var ts = [], nv = [];
    function pon(t, filas) {
      if (!t) return;
      var i = ts.indexOf(t);
      if (i < 0) { ts.push(t); nv.push(filas || null); return; }
      nv[i] = nv[i] && filas ? nv[i].concat(filas) : null;
    }
    for (var i = 0; i < ms.length; i++) {
      var g = ms[i].target;
      if (g && g.nodeType === 1) {
        var tag = g.tagName;
        if (tag === 'TBODY') pon(g.closest('table'), g.parentNode && g.parentNode.tagName === 'TABLE' ? soloAlFinal(ms[i]) : null);
        else if (tag === 'THEAD' || tag === 'TABLE' || tag === 'TFOOT') pon(g.closest('table'));
        else if (tag === 'TR' || tag === 'TH') { if (g.closest('thead')) pon(g.closest('table')); }
        else if (g.closest && g.closest('thead')) pon(g.closest('table'));
      }
      for (var a = ms[i].addedNodes, j = 0; j < a.length; j++) {
        var n = a[j]; if (n.nodeType !== 1 || NO_MIRA.test(n.tagName)) continue;
        if (n.tagName === 'TABLE') pon(n);
        else if (n.tagName !== 'TR' && n.tagName !== 'TD' && n.tagName !== 'TH' && n.getElementsByTagName) {
          var inner = n.getElementsByTagName('table'); for (var k = 0; k < inner.length; k++) pon(inner[k]);
        }
      }
    }
    for (var x = 0; x < ts.length; x++) revisa(ts[x], nv[x]);
    mo.takeRecords();
  });
  function todas() { var ts = document.getElementsByTagName('table'); for (var i = 0; i < ts.length; i++) revisa(ts[i]); mo.takeRecords(); }
  function arranca() { mo.observe(document.body, { childList: true, subtree: true }); todas(); }
  if (document.body) arranca(); else document.addEventListener('DOMContentLoaded', arranca);

  window.PROFASE_ORDEN = {
    paginador: paginador,
    // la misma lista, en el orden escogido en esa tabla (para el Excel o el PDF de la pantalla); si no hay orden, igual
    // (la tabla puede ser el elemento o su id). Por páginas: con las llaves que se leyeron de cada renglón. En la
    // pantalla: si la tabla trae un renglón por cada elemento de la lista, en el orden en que los pintó la página, se
    // regresan en el orden en que están ahora; si no cuadra, la lista tal cual (el Excel nunca sale con algo de menos).
    lista: function (tabla, lista) {
      if (typeof tabla === 'string') tabla = document.getElementById(tabla);
      if (!Array.isArray(lista)) return lista;
      var P = tabla && tabla.__poPag, po = tabla && tabla.__po, st = po && ESTADO[po.k];
      if (!st) return lista;
      if (P && !P.no) {
        var ks = [];
        for (var i = 0; i < lista.length; i++) if (!(ks[i] = llavesDe(P, lista[i]))) return lista;
        return ordenaLista(lista, st, ks);
      }
      return P ? lista : (enDom(tabla, lista) || lista);
    },
    // los renglones de un Excel ya armados (arreglos de valores, con sus títulos en «head»), en el orden escogido en la
    // tabla de junto al botón (o en la tabla que se le dé): por la columna del mismo título o, si la tabla trae un
    // renglón por cada uno, en el orden de la pantalla. Lo que no se pueda, tal cual. Para las pantallas que arman sus
    // filas en un ayudante común (excel(b, …, head, filas, …)).
    filas: function (ref, head, filas) {
      try { return filasEnOrden(ref, head, filas); } catch (e) { return filas; }
    },
    // qué orden tiene una tabla (para decirlo en el Excel): { columna, sentido } o null
    estado: function (tabla) {
      var po = tabla && tabla.__po, st = po && ESTADO[po.k];
      if (!st) return null;
      var h = po.cab.hojas[st.c];
      return { columna: h ? h.__poT : '', sentido: st.d > 0 ? 'de la A a la Z' : 'de la Z a la A' };
    },
    revisa: function (t) { if (t) revisa(t); else todas(); }
  };
})();
