/* La barra para moverse a los lados y los títulos de las columnas, a la vista al bajar. Una sola versión para el CRM y los
   sistemas Quo (Contabilita, Facturita, Nominita y la casa la cargan de aquí, desde su js/qc-tabla.js; el CRM, en cada página,
   junto a js/portal.js: construir.py, con_tabla_pegada()).

   De dónde viene:
   - La barra también arriba de cada tabla ancha (Fernando Barbosa, por el chat del CRM, 13-nov-2026, 16:41: «también crees
     que puedas poner esa barra de abajo arribita… la desplazamiento»; Héctor Daniel Nava, 16:42 y 16:43: «de una vez»; «a
     darle»). Vivía en js/qc-tabla.js de Quo Contabilita, solo para los sistemas Quo.
   - Y que se quede a la vista al bajar, con los títulos (Fernando Cadengo, 18-nov-2026, con un video del Tablero QUO: «la
     barra de desplazamiento que aparezca aunque bajes en los tableros en general»; a lo platicado, 18-nov-2026: «1 a, 2 sí,
     3 también en CRM; sí, así es»): la barra arriba, pegada abajo de lo que se queda fijo arriba, y los títulos de las
     columnas debajo de ella; en el CRM y en los sistemas Quo. Desde ese día la pieza vive aquí (una sola versión).

   Qué hace, solo en la computadora (con mouse o trackpad; con el dedo la tabla se desliza sola y aquí no se hace nada):
   1. Toda tabla que no cabe a lo ancho en su recuadro (el de arriba que se desliza a los lados: overflow-x auto o scroll)
      lleva otra barra pegada arriba de sus títulos, que se mueve junto con la de abajo. Donde el sistema esconde las barras
      hasta que se desliza (la Mac), esta se pinta delgada y siempre a la vista; donde se ven siempre (Windows), igual que
      la de abajo. Si la tabla cabe, no sale.
   2. Si la tabla se desliza con la página (no la de una ficha o ventana, que se desliza por dentro) y no cabe a lo ancho o
      es más alta que la pantalla, al bajar la barra se queda pegada abajo de lo que está fijo arriba (el encabezado y, en
      Contabilita, la franja de la empresa y el mes: --tp-pega) y el renglón de los títulos, el de verdad, con su filtro, su
      orden y su casilla, se queda debajo de ella hasta que se acaba la tabla. Los títulos los mueve el mismo deslizar de la
      página (una animación ligada al scroll, view-timeline: la hace el navegador en cada cuadro, sin JavaScript y sin
      brincos); donde el navegador no la sabe hacer, solo la barra se queda.
   3. Para que la barra se pueda pegar, los recuadros de alrededor que recortan lo que se sale (overflow:hidden, como .card)
      recortan igual pero sin volverse un área que se desliza (tp-clip: overflow:clip, con display:flow-root para que lo de
      adentro se siga acomodando igual). Mientras no se baja, todo se ve igual que antes.
   Una tabla o su recuadro con data-sin-pegar se queda como siempre.
   - Desde el 25-nov-2026 se queda a la vista todo el encabezado de la tabla, no solo el renglón de los títulos: así los
     totales que van arriba (debajo de los títulos, dentro del encabezado, como los de la tabla común de los sistemas Quo) y
     los filtros por columna se quedan pegados con ellos al bajar (Héctor Daniel Nava, 25-nov-2026, 06:43: «en las tablas
     cuando haya totales… es importante que también los pongas arriba porque es una flojera bajar hasta abajo»; la regla 7
     de «Todo a la mano», en el CRM y en los sistemas Quo). Todos los renglones del encabezado se mueven juntos, con lo que
     mide el encabezado completo; sus medidas van en el encabezado (thead), no en cada renglón.

   Rápido: no revisa cada cambio de la página; despierta solo cuando entra una tabla nueva, cuando una tabla o su recuadro
   cambia de tamaño o cuando cambia el tamaño de la ventana, y mide una vez por cuadro de pantalla (primero lee todo, luego
   escribe). Al deslizar no corre nada.
   Pruebas: CRM, herramientas/pruebas/pantallas/prueba_tabla_pegada.py; Quo, pruebas/pantallas/prueba_barra_arriba.py. */
(function () {
  'use strict';
  if (window.PROFASE_TABLA_PEGADA) return;
  if (!window.MutationObserver || !window.ResizeObserver || !window.matchMedia || !window.requestAnimationFrame || !document.documentElement) return;
  var mano = matchMedia('(hover:hover) and (pointer:fine)');
  var S = window.CSS && window.CSS.supports ? window.CSS : null;
  var CLIP = !!(S && S.supports('overflow', 'clip'));
  var X = [], pend = 0, FINA = null, PEGA = -1, FIJAS = null;
  var ro = new ResizeObserver(function () { pide(); });
  function pide() { if (!pend) pend = requestAnimationFrame(pasa); }

  var ESTILO = ''
    + '.tp-barra{overflow-x:auto;overflow-y:hidden;overscroll-behavior-x:contain}.tp-barra>div{height:1px}'
    + '.tp-fina::-webkit-scrollbar{height:12px}.tp-fina::-webkit-scrollbar-track{background:var(--surface-2,#eef1f6)}'
    + '.tp-fina::-webkit-scrollbar-thumb{background:var(--line-strong,#b8c1d1);background:color-mix(in srgb,var(--muted,#5b6577) 62%,transparent);'
    + 'border-radius:999px;border:3px solid var(--surface-2,#eef1f6)}'
    + '.tp-fina::-webkit-scrollbar-thumb:hover{background:var(--muted,#5b6577)}'
    + '@supports (-moz-appearance:none){.tp-fina{scrollbar-width:thin;scrollbar-color:var(--muted,#5b6577) var(--surface-2,#eef1f6)}}'
    // pegada abajo de lo fijo de arriba, con fondo para que no se vean los renglones por detrás
    + '.tp-barra.tp-pega{position:-webkit-sticky;position:sticky;top:var(--tp-pega,0px);z-index:6;background:var(--tp-fondo,var(--surface,#fff))}'
    // 24-nov-2026: lo escondido se queda escondido (antes el flow-root ganaba y un recuadro con hidden volvía a salir)
    + '.tp-clip.tp-clip{overflow:clip!important}.tp-clip.tp-fr:not([hidden]):not([style*="display: none"]):not([style*="display:none"]){display:flow-root!important}'
    // los títulos: el renglón de verdad, movido por el deslizar de la página
    + '@supports (animation-timeline:view()){'
    + '.tp-pega-w{view-timeline:--tp-pega block;view-timeline-inset:calc(var(--tp-pega,0px) + var(--tp-b,0px)) 0px}'
    + 'table.tp-pega>thead>tr{position:relative;z-index:5;animation:tp-pega linear both;animation-timeline:--tp-pega;'
    + 'animation-range:exit-crossing var(--tp-a,0px) exit-crossing var(--tp-z,0px)}'
    + 'table.tp-pega.tp-fondo>thead>tr{background-color:var(--tp-fondo,#fff)}'
    + '@keyframes tp-pega{from{transform:translateY(0)}to{transform:translateY(var(--tp-m,0px))}}}'
    + '@media print{.tp-barra{display:none!important}table.tp-pega>thead>tr{animation:none!important;transform:none!important}}';
  function estilos() {
    if (document.getElementById('tp-css')) return;
    var s = document.createElement('style'); s.id = 'tp-css'; s.textContent = ESTILO; (document.head || document.documentElement).appendChild(s);
  }
  function fina() {   // ¿el sistema esconde las barras hasta que se desliza? (la Mac): entonces la de arriba se pinta a la vista
    if (FINA === null && document.body) {
      var d = document.createElement('div'); d.style.cssText = 'position:absolute;top:-999px;left:-999px;width:60px;height:60px;overflow:scroll;visibility:hidden';
      document.body.appendChild(d); FINA = d.offsetHeight - d.clientHeight < 1; d.parentNode.removeChild(d);
    }
    return !!FINA;
  }
  function desliza(o) { return o === 'auto' || o === 'scroll'; }
  // el recuadro que desliza la tabla a los lados: el de arriba más cercano (hasta 3 arriba) con overflow-x auto o scroll
  function recuadro(t) {
    for (var e = t.parentElement, n = 0; e && n < 3 && e !== document.body && e !== document.documentElement; e = e.parentElement, n++) {
      if (desliza(getComputedStyle(e).overflowX)) return e;
    }
    return null;
  }
  // ¿se desliza con la página? Si algo de alrededor se desliza por dentro (una ficha, una ventana), no se pega (null). Si sí,
  // los recuadros de alrededor que recortan lo que se sale, con si son de bloque (a esos también flow-root).
  function deLaPagina(w) {
    var clip = [];
    for (var e = w.parentElement; e && e !== document.body && e !== document.documentElement; e = e.parentElement) {
      var cs = getComputedStyle(e), ox = cs.overflowX, oy = cs.overflowY;
      if (desliza(ox) || desliza(oy)) return null;
      if (ox === 'hidden' || oy === 'hidden') clip.push([e, cs.display === 'block']);
    }
    return clip.length && !CLIP ? null : clip;
  }
  // lo que se queda fijo arriba de la página (el encabezado, la franja de la empresa y el mes, la barra de una pantalla):
  // lo pegado (sticky) o fijo (fixed) de los primeros niveles, con «top», de al menos media pantalla de ancho y no más
  // alto que el 40 % (así no cuentan el menú de la izquierda, las ventanas, los menús abiertos ni los avisos de abajo)
  function buscaFijas() {
    var l = [];
    if (!document.body) return l;
    var c = document.body.querySelectorAll(':scope>*,:scope>*>*,:scope>*>*>*,:scope>*>*>*>*');
    for (var i = 0; i < c.length; i++) {
      var e = c[i]; if (/^(SCRIPT|STYLE|LINK|TEMPLATE|TABLE)$/.test(e.tagName)) continue;
      var cs = getComputedStyle(e), p = cs.position;
      if ((p === 'sticky' || p === '-webkit-sticky' || p === 'fixed') && cs.top !== 'auto' && parseFloat(cs.top) < 200) l.push(e);
    }
    return l;
  }
  function arriba() {
    if (!FIJAS) FIJAS = buscaFijas();
    var m = 0, W = window.innerWidth, H = window.innerHeight;
    for (var i = 0; i < FIJAS.length; i++) {
      var e = FIJAS[i]; if (!e.isConnected || e.hidden) continue;
      var r = e.getBoundingClientRect(); if (!r.height || r.width < W * 0.5 || r.height > H * 0.4) continue;
      var cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      m = Math.max(m, (parseFloat(cs.top) || 0) + r.height);
    }
    return Math.round(m);
  }
  // ¿el fondo de algo tapa lo de atrás? (sin color o con transparencia, no)
  function opaco(e) {
    var c = getComputedStyle(e).backgroundColor, m = /^rgba?\(([^)]*)\)$/.exec(c || '');
    if (!m) return false;
    var p = m[1].split(/[\s,\/]+/).filter(Boolean);
    return p.length < 4 || parseFloat(p[3]) >= 0.98;
  }
  // el fondo de lo que hay detrás de la tabla (el primero que tapa, de los títulos hacia afuera), para los títulos que no
  // traen el suyo: así al pegarse no se asoman los renglones por detrás
  function fondoDe(e) {
    for (; e && e.nodeType === 1; e = e.parentElement) if (opaco(e)) return getComputedStyle(e).backgroundColor;
    return '';
  }

  function nuevo(w) {
    estilos();
    var x = { w: w, tb: null, b: null, pag: undefined, peg: false, v: '', ancho: 0, fondo: undefined, fondoB: '' };
    w.__tp = x; X.push(x); ro.observe(w);
    // la barra va justo antes del recuadro, salvo que el de arriba la pondría en otra columna (flex en renglón o rejilla)
    var p = w.parentElement, ps = p ? getComputedStyle(p) : null;
    var col = ps && ((ps.display.indexOf('flex') >= 0 && ps.flexDirection.indexOf('column') !== 0)
                     || (ps.display.indexOf('grid') >= 0 && ps.gridTemplateColumns.split(' ').length > 1));
    if (p && !col) {
      var ant = w.previousElementSibling; if (ant && ant.classList.contains('tp-barra')) ant.parentNode.removeChild(ant);   // nunca dos
      var b = document.createElement('div'); b.className = 'tp-barra' + (fina() ? ' tp-fina' : '');
      b.setAttribute('aria-hidden', 'true'); b.tabIndex = -1; b.hidden = true;
      b.appendChild(document.createElement('div'));
      var cs = getComputedStyle(w); b.style.marginLeft = cs.marginLeft; b.style.marginRight = cs.marginRight;
      p.insertBefore(b, w);
      // una mueve a la otra; si ya están en el mismo lugar no se toca nada (así no se persiguen)
      var igual = function (de, a) { if (Math.abs(a.scrollLeft - de.scrollLeft) >= 1) a.scrollLeft = de.scrollLeft; };
      b.addEventListener('scroll', function () { igual(b, w); }, { passive: true });
      w.addEventListener('scroll', function () { if (!b.hidden) igual(w, b); }, { passive: true });
      x.b = b; ro.observe(b);
    }
    return x;
  }
  function suelta(x) {
    x.peg = false; x.v = '';
    x.w.classList.remove('tp-pega-w'); if (x.b) x.b.classList.remove('tp-pega');
    if (x.tb) x.tb.classList.remove('tp-pega', 'tp-fondo');
  }
  function quita(x) {
    ro.unobserve(x.w); if (x.b) { ro.unobserve(x.b); if (x.b.parentNode) x.b.parentNode.removeChild(x.b); }
    if (x.tb) ro.unobserve(x.tb); x.w.__tp = null;
  }

  function pasa() {
    pend = 0;
    // con el dedo (iPhone, iPad, celular) nunca: ni se pone ni se mide nada; si se conecta un mouse o un trackpad, se ponen
    if (!mano.matches) {
      for (var k = 0; k < X.length; k++) { if (X[k].b && !X[k].b.hidden) X[k].b.hidden = true; if (X[k].peg) suelta(X[k]); }
      return;
    }
    // las tablas nuevas (una vez cada una)
    var ts = document.getElementsByTagName('table'), i;
    for (i = 0; i < ts.length; i++) {
      var t = ts[i]; if (t.__tpVisto) continue; t.__tpVisto = true;
      if (t.closest('[data-sin-pegar]') || t.parentElement && t.parentElement.closest('.tp-barra')) continue;
      var w = recuadro(t); if (w && !w.__tp && !w.hasAttribute('data-sin-pegar')) nuevo(w);
    }
    X = X.filter(function (x) { if (x.w.isConnected) return true; quita(x); return false; });
    // primero se lee todo…
    var P = arriba(), H = window.innerHeight;
    var md = X.map(function (x) {
      var w = x.w, tb = w.querySelector('table');
      if (tb !== x.tb) {
        if (x.tb) { ro.unobserve(x.tb); x.tb.classList.remove('tp-pega', 'tp-fondo'); }
        x.tb = tb; x.v = ''; x.fondo = undefined; if (tb) ro.observe(tb);
      }
      var cw = w.clientWidth, sw = w.scrollWidth, sobra = cw > 0 && sw - cw > 1;
      var m = { sobra: sobra, ancho: w.offsetWidth + sw - cw, peg: false };
      if (!tb || !cw) return m;
      if (x.pag === undefined) x.pag = deLaPagina(w);
      var hd = tb.tHead, th = hd ? hd.offsetHeight : 0;   // todo el encabezado: títulos, filtros y totales (25-nov-2026)
      var rw = w.getBoundingClientRect(), rt = tb.getBoundingClientRect(), alto = rt.height;
      var vertical = w.scrollHeight - w.clientHeight > 1;   // el recuadro se desliza por dentro: no se pega
      m.peg = !!x.pag && !vertical && (sobra || (th > 0 && alto > H - P));
      if (m.peg) {
        if (x.fondo === undefined) {
          // los títulos tapan lo de atrás si su renglón o todas sus celdas tienen fondo que tapa (el de la tabla o el de
          // los títulos no cuenta: queda detrás de los renglones); si no, se les pone el primero que tapa hacia afuera
          var tapan = !hd || Array.prototype.every.call(hd.rows, function (r) { return opaco(r) || Array.prototype.every.call(r.cells, opaco); });
          x.fondo = tapan ? '' : (fondoDe(tb.tHead) || '#fff');
          x.fondoB = x.b ? fondoDe(x.b.parentElement) : '';   // la barra pegada, con el fondo de donde está
        }
        m.a = Math.round(rt.top - rw.top); m.mx = Math.max(0, Math.round(alto - th)); m.th = th;
        m.b = x.b && sobra && !x.b.hidden ? x.b.offsetHeight : 0;
      }
      return m;
    });
    // …y luego se escribe
    if (P !== PEGA) { PEGA = P; document.documentElement.style.setProperty('--tp-pega', P + 'px'); }
    X.forEach(function (x, j) {
      var m = md[j];
      if (x.b) {
        if (x.b.hidden === m.sobra) x.b.hidden = !m.sobra;
        if (m.sobra && x.ancho !== m.ancho) { x.ancho = m.ancho; x.b.firstChild.style.width = m.ancho + 'px'; }
        if (m.sobra && Math.abs(x.b.scrollLeft - x.w.scrollLeft) >= 1) x.b.scrollLeft = x.w.scrollLeft;
      }
      if (!m.peg) { if (x.peg) suelta(x); return; }
      if (!x.peg) {
        x.peg = true; x.w.classList.add('tp-pega-w'); if (x.b) x.b.classList.add('tp-pega');
        x.pag.forEach(function (c) { c[0].classList.add('tp-clip'); if (c[1]) c[0].classList.add('tp-fr'); });
      }
      x.tb.classList.add('tp-pega');   // también si la tabla de ese recuadro se volvió a pintar
      // 21-nov-2026 (revisión nocturna): lo que solo usa el renglón de los títulos (dónde empieza y acaba de moverse, cuánto y
      // su fondo) va en ese renglón y no en el recuadro: una variable puesta en el recuadro la heredan todos los renglones de
      // la tabla y, cada vez que la tabla crecía (Variaciones › «Resueltas» agrega sus miles de renglones por partes), el
      // navegador volvía a calcular los estilos de toda la tabla (hasta 1.4 s trabado en «Comprobar real»). En el recuadro
      // solo se queda --tp-b (el alto de la barra), que usa su view-timeline-inset, y solo se escribe si cambia.
      // (25-nov-2026) en el encabezado, no en su primer renglón: lo heredan todos sus renglones (títulos, filtros y totales)
      var tr0 = x.tb.tHead;
      var v = [m.a, m.mx, m.b, x.fondo, !!tr0].join('|');
      if (v !== x.v || (tr0 && x.vr !== tr0)) {
        var s = x.w.style, rs = tr0 ? tr0.style : s;
        if (x.vb !== m.b) { x.vb = m.b; s.setProperty('--tp-b', m.b + 'px'); }
        if (tr0 && x.vr !== tr0) {   // un renglón nuevo (la tabla se volvió a pintar) o la primera vez: lo de antes, fuera del recuadro
          x.vr = tr0; s.removeProperty('--tp-a'); s.removeProperty('--tp-z'); s.removeProperty('--tp-m'); s.removeProperty('--tp-fondo');
        }
        x.v = v;
        rs.setProperty('--tp-a', m.a + 'px'); rs.setProperty('--tp-z', (m.a + m.mx) + 'px'); rs.setProperty('--tp-m', m.mx + 'px');
        if (x.fondo) { x.tb.classList.add('tp-fondo'); rs.setProperty('--tp-fondo', x.fondo); }
        else { x.tb.classList.remove('tp-fondo'); rs.removeProperty('--tp-fondo'); }
        if (x.b && x.fondoB) x.b.style.setProperty('--tp-fondo', x.fondoB);
      }
    });
  }

  var NO = /^(TR|TD|TH|TBODY|THEAD|TFOOT|OPTION|svg|path|SPAN|B|I|SMALL|BR|INPUT|BUTTON|IMG|LABEL|A)$/;
  var mo = new MutationObserver(function (ms) {
    if (pend || !mano.matches) return;
    for (var i = 0; i < ms.length; i++) {
      for (var a = ms[i].addedNodes, j = 0; j < a.length; j++) {
        var n = a[j];
        if (n.nodeType === 1 && !NO.test(n.tagName) && (n.tagName === 'TABLE' || n.getElementsByTagName('table').length)) { FIJAS = null; pide(); return; }
      }
    }
  });
  // claro u oscuro: los fondos de la barra y de los títulos se vuelven a tomar (el CRM y los sistemas Quo marcan el tema
  // escogido a mano en data-theme; si no, siguen al dispositivo)
  function otroTema() { for (var i = 0; i < X.length; i++) { X[i].fondo = undefined; X[i].v = ''; } pide(); }
  new MutationObserver(otroTema).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  try { var osc = matchMedia('(prefers-color-scheme: dark)'); if (osc.addEventListener) osc.addEventListener('change', otroTema); } catch (e) { /* nada */ }
  function arranca() { mo.observe(document.body, { childList: true, subtree: true }); pide(); }
  if (mano.addEventListener) mano.addEventListener('change', pide);
  window.addEventListener('resize', function () { FIJAS = null; pide(); }, { passive: true });
  if (document.body) arranca(); else document.addEventListener('DOMContentLoaded', arranca);
  window.PROFASE_TABLA_PEGADA = { revisa: function () { FIJAS = null; pide(); } };
})();
