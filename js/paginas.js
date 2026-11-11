/* Portal PROFASE · páginas para las tablas largas (3-nov-2026, pedido de Fernando Cadengo: «en la pantalla de base de
   cliente hay que agregar pagineo a la tabla»; y «ahora hay que continuar con la pantalla de facturación», «ambos»).
   Una sola pieza para todo el portal (Base de clientes, Facturación y Pagos; y la tabla larga que sigue):
   abajo de la tabla, «« Anterior · Página N de M · Siguiente »», cuántas se ven («Facturas 51 a 100 de 1,240») y
   «Mostrar 25 / 50 / 100» (50 por omisión). El tamaño que escoge cada quien se recuerda en su navegador; la página
   siempre empieza en la 1 al entrar y la pantalla la regresa a la 1 al buscar o filtrar (pg.inicio()). Con 25 o menos
   renglones no sale nada. Solo enseña: no lee ni escribe en la base, y el Excel de cada pantalla sigue bajando todo
   lo que dejan sus filtros (no solo la página).

   var pg = PROFASE_PAGINAS.crea({
     donde: elemento,          // un <nav class="pgn"> vacío, abajo de la tabla
     clave: 'facturacion',     // para recordar el tamaño (uno por tabla)
     nombre: 'Facturas',       // «Facturas 1 a 50 de 131»
     arriba: elemento,         // (opcional) lo que se lleva a la vista al cambiar de página (la tarjeta de la tabla)
     cambio: function () { … } // vuelve a pintar la tabla
   });
   pg.corta(lista)   // la página que toca de esa lista (y pinta los controles)
   pg.inicio()       // regresa a la página 1 (al buscar o filtrar)
   pg.nombre('Clientes')   // (11-nov-2026) cambia lo que cuenta, cuando la misma tabla se ve de otra forma (WorkFlow › Panel
                           // de trabajo: «Ver: Por cliente / Por actividad») */
(function () {
  'use strict';
  if (window.PROFASE_PAGINAS) return;

  var TAMS = [25, 50, 100], OMISION = 50;
  var CSS = '.pgn{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;justify-content:space-between;padding:10px 14px;'
    + 'border-top:1px solid var(--line,#DDE3EA);font-size:13px;color:var(--muted,var(--ink-3,#7B8A9B))}'
    + '.pgn .pgn-cu{font-variant-numeric:tabular-nums}'
    + '.pgn .pgn-ir{display:flex;gap:6px;align-items:center;flex-wrap:wrap}'
    + '.pgn .pgn-en{font-variant-numeric:tabular-nums;color:var(--ink,#131F2D);font-weight:600;padding:0 4px;white-space:nowrap}'
    + '.pgn .btn[disabled]{opacity:.45;cursor:default}'
    + '.pgn label{display:flex;gap:6px;align-items:center;white-space:nowrap}'
    + '.pgn select{border:1px solid var(--line-strong,#CDD5DF);background:var(--surface,#FFFFFF);color:var(--ink,#131F2D);border-radius:8px;padding:5px 8px;font-size:13px}'
    + '@media (max-width:600px){.pgn{justify-content:center;text-align:center}.pgn .pgn-cu{width:100%}.pgn select{font-size:16px}}';

  function estilo() {
    if (document.getElementById('pgn-css')) return;
    var s = document.createElement('style'); s.id = 'pgn-css'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }
  function lee(clave) {
    try { var n = +localStorage.getItem('profase.paginas.' + clave); return TAMS.indexOf(n) >= 0 ? n : OMISION; } catch (e) { return OMISION; }
  }
  function guarda(clave, n) { try { localStorage.setItem('profase.paginas.' + clave, String(n)); } catch (e) { /* sin guardar */ } }
  function num(n) { return Number(n).toLocaleString('es-MX'); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function crea(o) {
    estilo();
    var el = o.donde, p = 1, tam = lee(o.clave), total = 0;
    if (!el) throw new Error('PROFASE_PAGINAS: falta «donde»');
    el.classList.add('pgn');
    if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', 'Páginas de ' + String(o.nombre || 'la tabla').toLowerCase());
    el.hidden = true;

    function paginas() { return Math.max(1, Math.ceil(total / tam)); }
    function pinta() {
      el.hidden = total <= TAMS[0];
      if (el.hidden) { el.innerHTML = ''; return; }
      var tot = paginas(), de = (p - 1) * tam + 1, a = Math.min(total, p * tam);
      el.innerHTML = '<span class="pgn-cu">' + esc(o.nombre || 'Renglones') + ' ' + num(de) + ' a ' + num(a) + ' de ' + num(total) + '</span>'
        + '<span class="pgn-ir"><button class="btn" type="button" data-pgn="-1"' + (p <= 1 ? ' disabled' : '') + '>« Anterior</button>'
        + '<span class="pgn-en">Página ' + num(p) + ' de ' + num(tot) + '</span>'
        + '<button class="btn" type="button" data-pgn="1"' + (p >= tot ? ' disabled' : '') + '>Siguiente »</button></span>'
        + '<label>Mostrar <select aria-label="Renglones por página">' + TAMS.map(function (n) {
          return '<option value="' + n + '"' + (n === tam ? ' selected' : '') + '>' + n + '</option>';
        }).join('') + '</select></label>';
    }
    function corta(lista) {
      total = lista.length;
      var tot = paginas(); if (p > tot) p = tot; if (p < 1) p = 1;
      pinta();
      return lista.slice((p - 1) * tam, p * tam);
    }
    el.addEventListener('click', function (ev) {
      var b = ev.target.closest && ev.target.closest('[data-pgn]');
      if (!b || b.disabled) return;
      var paso = +b.getAttribute('data-pgn');
      p += paso;
      if (o.cambio) o.cambio();
      var arriba = o.arriba;
      if (arriba && arriba.getBoundingClientRect().top < 0) arriba.scrollIntoView({ block: 'start' });
      var otro = el.querySelector('[data-pgn="' + paso + '"]:not([disabled])') || el.querySelector('[data-pgn]:not([disabled])');
      if (otro) otro.focus();
    });
    el.addEventListener('change', function (ev) {
      var s = ev.target; if (!s || s.tagName !== 'SELECT') return;
      var primero = (p - 1) * tam;          // el primer renglón que se veía sigue a la vista
      tam = +s.value; p = Math.floor(primero / tam) + 1;
      guarda(o.clave, tam);
      if (o.cambio) o.cambio();
    });
    return { corta: corta, inicio: function () { p = 1; },
      nombre: function (t) { o.nombre = t; el.setAttribute('aria-label', 'Páginas de ' + String(t || 'la tabla').toLowerCase()); } };
  }

  window.PROFASE_PAGINAS = { crea: crea, tamanos: TAMS.slice() };
})();
