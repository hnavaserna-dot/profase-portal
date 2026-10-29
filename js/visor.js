/* Portal PROFASE · Documentos del WorkFlow: vista previa ahí mismo y descarga rápida (29-oct-2026, pedido de Daniel:
   «al picarle ver no pasa nada; la idea es que abras ahí mismo un preview del pdf; si le picas bajar tarda mucho;
   eficientiza ambos»). Lo usan WorkFlow › Panel de trabajo (workflow-trabajo.html) y Access › WorkFlow (access-wf.html).

   - «Ver» abre el PDF dentro de la misma página, encima de la ficha (sin ventanas nuevas que el navegador bloquee).
     En computadora usa el lector de PDF del navegador; en celular, tableta o donde el navegador no lo trae, dibuja
     las hojas con PDF.js (js/lib/pdfjs, en el mismo portal). Arriba: «Bajar» y «Cerrar» (también con Esc).
   - Lo que se ve y lo que se baja es lo mismo: el PDF con la marca PROFASE (la página lo sella con
     PROFASE_MARCA.sellaPDF antes de dárselo a este módulo); los demás archivos, tal cual.
   - Rápido: al abrir una ficha con PDF ya se prepara la marca (pdf-lib) y se traen los PDF chicos; al pasar el mouse
     o tocar «Ver» o «Bajar» se adelanta la descarga; lo ya traído se guarda mientras la página está abierta, así que
     «Ver» y luego «Bajar» no lo vuelven a pedir.
   - Quién ve qué no cambia: cada archivo se pide con la sesión de quien entró y la base decide (wf_docs, cubeta wfdocs).
     Cada vista y cada descarga se siguen anotando en Accesos (la página lo hace con P.registrar).

   Uso:  var V = PROFASE_VISOR.nuevo({ trae: async d => Uint8Array (PDF ya sellado), esPdf: d => bool,
                                       doc: el => d, nombre: d => 'archivo.pdf', alVer: d => {}, alBajar: d => {} });
         V.precarga(lista, sigueAbierta);  V.ver(d, boton);  V.baja(d, boton); */
(function () {
  'use strict';
  var PDFJS = 'js/lib/pdfjs/pdf.min.js', PDFJS_TRABAJADOR = 'js/lib/pdfjs/pdf.worker.min.js';
  var GUARDA_MAX = 10, GUARDA_BYTES = 80 * 1024 * 1024, PRETRAE_MAX = 4 * 1024 * 1024;

  function cargaJS(src, listo) {
    return new Promise(function (ok, ko) {
      if (listo()) return ok();
      var s = document.createElement('script'); s.src = src; s.async = true;
      s.onload = function () { listo() ? ok() : ko(new Error(src)); }; s.onerror = function () { ko(new Error(src)); };
      document.head.appendChild(s);
    });
  }
  var PJS = null;
  function pdfjs() {
    if (window.pdfjsLib && window.pdfjsLib.getDocument) return Promise.resolve(window.pdfjsLib);
    if (!PJS) {
      PJS = cargaJS(PDFJS, function () { return !!(window.pdfjsLib && window.pdfjsLib.getDocument); }).then(function () {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(PDFJS_TRABAJADOR, location.href).href;
        return window.pdfjsLib;
      });
      PJS.catch(function () { PJS = null; });
    }
    return PJS;
  }
  // ¿El navegador muestra PDF por su cuenta dentro de la página? (computadora sí; celular y tableta, no siempre)
  function nativo() {
    if (window.__visorModo) return window.__visorModo === 'nativo';   // solo para las pruebas
    var ua = navigator.userAgent || '';
    if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return false;
    if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return false;   // iPad que se presenta como Mac
    if (navigator.pdfViewerEnabled === false) return false;
    return true;
  }
  function idle(f) { (window.requestIdleCallback || function (g) { return setTimeout(g, 120); })(f, { timeout: 1500 }); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var CSS = ''
    + '.pv-velo{position:fixed;inset:0;z-index:60;background:rgba(10,18,32,.62);display:flex;align-items:center;justify-content:center;padding:16px}'
    + '.pv-caja{background:var(--surface,#fff);color:var(--ink,#132036);width:min(1100px,100%);height:100%;border-radius:12px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 20px 50px rgba(0,0,0,.35);font-family:var(--f-body,inherit)}'
    + '.pv-cab{flex:none;background:var(--navy,#1F3864);color:var(--navy-ink,#fff);border-bottom:4px solid var(--accent,#F07A1E);padding:10px 12px 10px 16px;display:flex;gap:10px;align-items:center}'
    + '.pv-tit{flex:1;min-width:0}'
    + '.pv-tit b{display:block;font-size:15px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
    + '.pv-tit span{display:block;font-size:12px;color:var(--band-dim,#B9C7DE);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
    + '.pv-acc{flex:none;display:flex;gap:6px}'
    + '.pv-acc button{border:1px solid rgba(255,255,255,.35);background:transparent;color:var(--navy-ink,#fff);border-radius:8px;padding:7px 12px;font:inherit;font-weight:600;font-size:13px;cursor:pointer;white-space:nowrap}'
    + '.pv-acc button:hover{border-color:#fff;background:rgba(255,255,255,.1)}'
    + '.pv-acc button[disabled]{opacity:.55;cursor:default}'
    + '.pv-acc button:focus-visible{outline:2px solid var(--accent,#F07A1E);outline-offset:2px}'
    + '.pv-cuerpo{flex:1;min-height:0;position:relative;background:var(--surface-2,#EEF2F7)}'
    + '.pv-cuerpo iframe{position:absolute;inset:0;border:0;width:100%;height:100%;display:block;background:#fff}'
    + '.pv-hojas{position:absolute;inset:0;overflow:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding:12px;display:flex;flex-direction:column;align-items:center;gap:12px}'
    + '.pv-hoja{width:100%;max-width:920px;flex:none;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.2);position:relative}'
    + '.pv-hoja canvas{display:block;width:100%;height:auto}'
    + '.pv-hoja .pv-n{position:absolute;right:8px;bottom:6px;font-size:11px;color:#5A6577;background:rgba(255,255,255,.85);border-radius:6px;padding:1px 6px}'
    + '.pv-msg{position:absolute;inset:0;display:flex;flex-direction:column;gap:12px;align-items:center;justify-content:center;color:var(--muted,#5A6577);font-size:14px;padding:24px;text-align:center}'
    + '.pv-gira{width:30px;height:30px;border-radius:50%;border:3px solid var(--line,#DCE2EB);border-top-color:var(--accent,#F07A1E);animation:pv-g .8s linear infinite}'
    + '@keyframes pv-g{to{transform:rotate(360deg)}}'
    + '@media (prefers-reduced-motion:reduce){.pv-gira{animation-duration:2.4s}}'
    + '@media (max-width:700px){.pv-velo{padding:0}.pv-caja{width:100%;border-radius:0}.pv-cab{padding:8px 8px 8px 12px}.pv-acc button{padding:7px 10px}.pv-hojas{padding:8px;gap:8px}}';

  function nuevo(op) {
    var guardados = new Map();   // id → { p: promesa de los bytes, n: tamaño }
    var CAPA = null;

    function nombre(d) { return String((op.nombre ? op.nombre(d) : d.nombre) || 'documento').replace(/[\\/:*?"<>|]/g, '_'); }
    function recorta() {
      var total = 0, ids = Array.from(guardados.keys());
      ids.forEach(function (k) { total += guardados.get(k).n || 0; });
      while (ids.length && (guardados.size > GUARDA_MAX || total > GUARDA_BYTES)) {
        var k = ids.shift(); total -= guardados.get(k).n || 0; guardados.delete(k);
      }
    }
    // los bytes de un documento (con la marca si es PDF), una sola vez por página abierta
    function bytes(d) {
      var g = guardados.get(d.id);
      if (g) return g.p;
      g = { p: null, n: 0 };
      g.p = Promise.resolve().then(function () { return op.trae(d); }).then(function (b) {
        g.n = b ? b.byteLength : 0; recorta(); return b;
      }, function (e) { guardados.delete(d.id); throw e; });
      guardados.set(d.id, g);
      return g.p;
    }
    function guardaArchivo(b, d) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([b], { type: op.esPdf(d) ? 'application/pdf' : 'application/octet-stream' }));
      a.download = nombre(d); a.rel = 'noopener'; a.style.display = 'none';
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
    }

    /* ---------- Bajar ---------- */
    function baja(d, btn) {
      if (!d) return;
      var t0 = btn ? btn.textContent : '';
      if (btn) btn.disabled = true;
      var aviso = btn ? setTimeout(function () { btn.textContent = 'Bajando…'; }, 120) : 0;
      bytes(d).then(function (b) {
        guardaArchivo(b, d);
        try { if (op.alBajar) op.alBajar(d); } catch (e) { /* la descarga ya salió */ }
        if (btn) btn.textContent = 'Listo';
      }).catch(function () { if (btn) btn.textContent = 'No se pudo'; }).then(function () {
        clearTimeout(aviso);
        if (btn) setTimeout(function () { btn.textContent = t0; btn.disabled = false; }, 1200);
      });
    }

    /* ---------- Ver: la capa encima de la ficha ---------- */
    function ponCSS() {
      if (document.getElementById('pv-css')) return;
      var st = document.createElement('style'); st.id = 'pv-css'; st.textContent = CSS; document.head.appendChild(st);
    }
    function cierraCapa() {
      var c = CAPA; if (!c) return;
      CAPA = null; c.cerrada = true;
      try { if (c.pdf) c.pdf.destroy(); } catch (e) { /* ya estaba cerrado */ }
      if (c.obs) c.obs.disconnect();
      if (c.url) setTimeout(function () { URL.revokeObjectURL(c.url); }, 1000);
      c.el.remove();
      document.removeEventListener('keydown', c.tecla, true);
      try { if (c.antes && c.antes.focus) c.antes.focus(); } catch (e) { /* el botón ya no existe */ }
    }
    function abreCapa(d) {
      ponCSS(); cierraCapa();
      var el = document.createElement('div');
      el.className = 'pv-velo';
      el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Vista previa de ' + nombre(d));
      el.innerHTML = '<div class="pv-caja"><div class="pv-cab"><div class="pv-tit"><b>' + esc(nombre(d)) + '</b><span>Vista previa con la marca PROFASE</span></div>'
        + '<div class="pv-acc"><button type="button" data-pv="baja" disabled>Bajar</button><button type="button" data-pv="cierra" aria-label="Cerrar la vista previa">Cerrar</button></div></div>'
        + '<div class="pv-cuerpo"><div class="pv-msg" role="status"><div class="pv-gira" aria-hidden="true"></div><div>Abriendo el documento…</div></div></div></div>';
      var c = { el: el, d: d, cerrada: false, antes: document.activeElement, cuerpo: el.querySelector('.pv-cuerpo'), bBaja: el.querySelector('[data-pv="baja"]') };
      el.addEventListener('click', function (ev) {
        ev.stopPropagation();   // que la ficha de abajo no se entere
        var b = ev.target.closest('[data-pv]');
        if (ev.target === el || (b && b.getAttribute('data-pv') === 'cierra')) { cierraCapa(); return; }
        if (b && b.getAttribute('data-pv') === 'baja' && c.bytes) {
          guardaArchivo(c.bytes, d);
          try { if (op.alBajar) op.alBajar(d); } catch (e) { /* ya salió */ }
        }
      });
      c.tecla = function (ev) {
        if (ev.key === 'Escape') { ev.preventDefault(); ev.stopImmediatePropagation(); cierraCapa(); return; }
        if (ev.key === 'Tab') {   // el foco se queda dentro de la vista previa
          var f = Array.prototype.filter.call(el.querySelectorAll('button:not([disabled]),iframe,[tabindex="0"]'), function (x) { return x.offsetParent !== null; });
          if (!f.length) return;
          var i = f.indexOf(document.activeElement);
          if (ev.shiftKey && i <= 0) { ev.preventDefault(); f[f.length - 1].focus(); }
          else if (!ev.shiftKey && i === f.length - 1) { ev.preventDefault(); f[0].focus(); }
        }
      };
      document.addEventListener('keydown', c.tecla, true);
      document.body.appendChild(el);
      CAPA = c;
      try { el.querySelector('[data-pv="cierra"]').focus(); } catch (e) { /* sin foco */ }
      return c;
    }
    function mensaje(c, txt) {
      c.cuerpo.innerHTML = '<div class="pv-msg" role="status"><div>' + esc(txt) + '</div></div>';
    }
    function conLector(c, b) {
      c.url = URL.createObjectURL(new Blob([b], { type: 'application/pdf' }));
      var fr = document.createElement('iframe');
      fr.title = 'Vista previa de ' + nombre(c.d);
      fr.src = c.url + '#view=FitH';
      c.cuerpo.innerHTML = ''; c.cuerpo.appendChild(fr);
    }
    async function conHojas(c, b) {
      var L = await pdfjs();
      if (c.cerrada) return;
      // copia: PDF.js se queda con el arreglo que le dan, y el original sigue sirviendo para «Bajar»
      var pdf = await L.getDocument({ data: b.slice(), isEvalSupported: false }).promise;
      if (c.cerrada) { pdf.destroy(); return; }
      c.pdf = pdf;
      var caja = document.createElement('div'); caja.className = 'pv-hojas'; caja.tabIndex = 0;
      caja.setAttribute('aria-label', 'Hojas del documento (' + pdf.numPages + ')');
      c.cuerpo.innerHTML = ''; c.cuerpo.appendChild(caja);
      var p1 = await pdf.getPage(1);
      if (c.cerrada) return;
      var v1 = p1.getViewport({ scale: 1 }), prop = v1.height / v1.width;
      var hojas = [];
      for (var i = 1; i <= pdf.numPages; i++) {
        var h = document.createElement('div'); h.className = 'pv-hoja'; h.dataset.n = i;
        h.style.aspectRatio = '1 / ' + prop.toFixed(4);
        h.innerHTML = '<span class="pv-n">' + i + ' de ' + pdf.numPages + '</span>';
        caja.appendChild(h); hojas.push(h);
      }
      function dibuja(h) {
        if (h.dataset.lista || c.cerrada) return;
        h.dataset.lista = '1';
        var n = +h.dataset.n;
        (n === 1 ? Promise.resolve(p1) : pdf.getPage(n)).then(function (pg) {
          if (c.cerrada) return;
          var v = pg.getViewport({ scale: 1 }), ancho = Math.max(200, h.clientWidth || caja.clientWidth - 24);
          var dpr = Math.min(window.devicePixelRatio || 1, 2), esc2 = ancho / v.width * dpr;
          var vp = pg.getViewport({ scale: esc2 }), cv = document.createElement('canvas');
          cv.width = Math.floor(vp.width); cv.height = Math.floor(vp.height);
          cv.setAttribute('aria-label', 'Hoja ' + n);
          h.style.aspectRatio = v.width + ' / ' + v.height;
          return pg.render({ canvasContext: cv.getContext('2d', { alpha: false }), viewport: vp }).promise.then(function () {
            if (!c.cerrada) h.insertBefore(cv, h.firstChild);
          });
        }).catch(function () { delete h.dataset.lista; });
      }
      dibuja(hojas[0]);
      if ('IntersectionObserver' in window) {
        c.obs = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) dibuja(e.target); }); }, { root: caja, rootMargin: '600px 0px' });
        hojas.forEach(function (h) { c.obs.observe(h); });
      } else hojas.forEach(dibuja);
    }
    function ver(d, btn) {
      if (!d) return;
      var c = abreCapa(d);
      if (btn) c.antes = btn;
      var usaLector = nativo();
      if (!usaLector) pdfjs().catch(function () { /* se intenta con el lector del navegador */ });
      bytes(d).then(function (b) {
        if (c.cerrada) return;
        c.bytes = b; c.bBaja.disabled = false;
        try { if (op.alVer) op.alVer(d); } catch (e) { /* ya se ve */ }
        if (usaLector) return conLector(c, b);
        return conHojas(c, b).catch(function () {
          if (c.cerrada) return;
          if (navigator.pdfViewerEnabled !== false) conLector(c, b);   // sin PDF.js: el lector del navegador
          else mensaje(c, 'No se pudo mostrar aquí. Usa «Bajar» para abrirlo en tu equipo.');
        });
      }).catch(function () {
        if (!c.cerrada) mensaje(c, 'No se pudo abrir el documento. Cierra y vuelve a intentar en un momento.');
      });
    }

    /* ---------- Adelantar: al abrir la ficha y al acercarse a «Ver» o «Bajar» ---------- */
    function precarga(lista, sigue) {
      var pdfs = (lista || []).filter(function (d) { return d && d.bytes && d.en_portal && op.esPdf(d); });
      if (!pdfs.length) return;
      sigue = sigue || function () { return true; };
      idle(function () {
        if (!sigue()) return;
        try { if (window.PROFASE_MARCA && window.PROFASE_MARCA.precargaSello) window.PROFASE_MARCA.precargaSello(); } catch (e) { /* luego */ }
        if (!nativo()) pdfjs().catch(function () { /* luego */ });
      });
      setTimeout(function () {
        if (!sigue()) return;
        pdfs.filter(function (d) { return d.bytes <= PRETRAE_MAX; }).slice(0, 2).forEach(function (d) { bytes(d).catch(function () { /* al picar se reintenta */ }); });
      }, 500);
    }
    function intencion(ev) {
      var el = ev.target && ev.target.closest ? ev.target.closest('[data-dver],[data-dbaja]') : null;
      if (!el || !op.doc) return;
      var d = op.doc(el);
      if (d) bytes(d).catch(function () { /* al picar se reintenta */ });
    }
    document.addEventListener('pointerover', intencion, { passive: true });
    document.addEventListener('focusin', intencion);
    document.addEventListener('touchstart', intencion, { passive: true });

    return { ver: ver, baja: baja, precarga: precarga, bytes: bytes, cierra: cierraCapa, abierta: function () { return !!CAPA; } };
  }

  window.PROFASE_VISOR = { nuevo: nuevo, nativo: nativo };
})();
