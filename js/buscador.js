/* Portal PROFASE · buscador para escoger en una forma (2-nov-2026, pedido de Daniel en «Nueva cita»: «al momento de
   escribir o al seleccionar en el menú desplegable poder escribir parte del nombre para que se filtre automáticamente»;
   «grupo 1 sola selección, razón social varias o todas»; y «¿Quiénes van?», con varias personas).
   Una sola pieza para todo el portal: un campo donde se escribe parte del nombre y la lista se va acortando sola (sin
   importar acentos, mayúsculas ni el orden de las palabras), con flechas y Enter en la computadora y con el dedo en el
   celular. Va dentro de la forma (la lista empuja lo de abajo, no flota), así cabe en cualquier ventana y en cualquier
   pantalla, y nunca se corta con «…»: lo largo pasa completo al siguiente renglón.

   var b = PROFASE_BUSCA.crea({
     donde: elemento,              // aquí se pinta (vacío)
     id: 'cGru',                   // el id del campo de texto (para su <label for>)
     varios: false,                // false: una sola opción; true: varias
     lista: 'al-buscar',           // 'al-buscar': la lista sale al tocar o escribir (y se va al salir);
                                   // 'abierta' (solo con varios): la lista siempre a la vista, con su buscador arriba
     opciones: [{ v: '12', t: 'NOMBRE', nota: 'texto chico a la derecha (opcional)' }],
     valor: ['12'],                // lo escogido
     todos: 'Todas las razones sociales',   // (varios, opcional) la opción de arriba: equivale a no escoger ninguna
     marcador: 'Escribe parte del nombre',
     vacio: 'No hay coincidencias',
     sinOpciones: 'Primero escoge el grupo',  // lo que dice si todavía no hay opciones
     cambio: function (valores) { … }        // después de cualquier cambio
   });
   b.valor()            // ['12', …]  (con varios y «todos» escogido: [])
   b.pon(['12'])        // escoge desde fuera (sin avisar)
   b.opciones([…])      // cambia las opciones (lo escogido que ya no esté, se quita)
   b.habilita(true|false)
   b.foco()
   La lista que se despliega avisa con PORTAL.abreMenu y se cierra si se abre otro menú (un solo menú abierto a la vez). */
(function () {
  'use strict';
  if (window.PROFASE_BUSCA) return;

  var CSS = '.pb{--pb-ln:var(--line-2,#CDD5DF);--pb-ln2:var(--line,#DDE3EA);--pb-sf:var(--surface,#FFFFFF);--pb-sf2:var(--surface-2,#EEF1F5);'
    + '--pb-ink:var(--ink,#131F2D);--pb-mu:var(--ink-3,#7B8A9B);--pb-ac:var(--accent,#F07A1E);--pb-acs:var(--accent-soft,#FDEEDF);--pb-aci:var(--accent-ink,#A24B08);'
    + 'position:relative;min-width:0;display:grid;gap:6px}'
    + '.pb *{box-sizing:border-box}'
    + '.pb-caja{position:relative;display:flex;align-items:center;gap:6px;min-width:0;min-height:40px;border:1px solid var(--pb-ln);background:var(--pb-sf);border-radius:8px;padding:0 6px 0 10px}'
    + '.pb-caja:focus-within{border-color:var(--pb-ac);box-shadow:0 0 0 2px var(--pb-acs)}'
    + '.pb.off .pb-caja{opacity:.6}'
    + '.pb-caja svg{width:16px;height:16px;flex:none;color:var(--pb-mu)}'
    + '.pb .pb-in{flex:1 1 0;min-width:0;width:0!important;border:0!important;outline:0!important;box-shadow:none!important;background:none!important;padding:8px 0!important;margin:0;font:inherit;font-size:14px;color:var(--pb-ink);border-radius:0!important}'
    + '.pb .pb-in::placeholder{color:var(--pb-mu)}'
    // con una sola opción ya escogida y sin escribir, el nombre completo a la vista (pasa entero al siguiente renglón)
    + '.pb-val{flex:1;min-width:0;padding:8px 0;font-size:14px;line-height:1.35;color:var(--pb-ink);overflow-wrap:anywhere;cursor:text}'
    + '.pb-val[hidden]{display:none!important}'
    + '.pb.lleno:not(.foco) .pb-in{position:absolute;left:0;top:0;width:1px!important;height:1px;opacity:0;pointer-events:none}'
    // con algo escogido y el campo con el foco, se escribe encima del nombre (que se queda sin verse, guardando su alto):
    // la caja mide lo mismo antes y después, y el siguiente toque no se va de lado (Facturación, 2-nov-2026)
    + '.pb.lleno.foco .pb-val{visibility:hidden}'
    + '.pb.lleno.foco .pb-in{position:absolute;left:10px;right:40px;top:0;bottom:0;width:auto!important;height:auto;padding:0!important}'
    + '.pb-x{flex:none;width:30px;height:30px;border-radius:50%;border:0;background:none;color:var(--pb-mu);font:inherit;font-size:18px;line-height:1;cursor:pointer;display:grid;place-items:center}'
    + '.pb-x:hover{background:var(--pb-sf2);color:var(--pb-ink)}'
    + '.pb-lst{border:1px solid var(--pb-ln2);border-radius:8px;background:var(--pb-sf);max-height:232px;overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}'
    + '.pb-lst[hidden]{display:none!important}'
    + '.pb-it{display:flex;align-items:center;gap:10px;width:100%;min-height:40px;padding:7px 10px;border:0;border-top:1px solid var(--pb-ln2);background:none;color:var(--pb-ink);font:inherit;font-size:14px;text-align:left;cursor:pointer;line-height:1.3}'
    + '.pb-it:first-child{border-top:0}'
    + '.pb-it:hover,.pb-it.act{background:var(--pb-sf2)}'
    + '.pb-it[aria-selected="true"]{background:var(--pb-acs);color:var(--pb-aci)}'
    + '.pb-it .pb-t{flex:1;min-width:0;overflow-wrap:anywhere}'
    + '.pb-it .pb-nota{flex:none;max-width:45%;font-size:11.5px;color:var(--pb-mu);text-align:right}'
    + '.pb-it[aria-selected="true"] .pb-nota{color:inherit;opacity:.85}'
    + '.pb-bx{flex:none;width:18px;height:18px;border-radius:5px;border:2px solid var(--pb-ln);display:grid;place-items:center;background:var(--pb-sf)}'
    + '.pb-uno .pb-bx{border-radius:50%}'
    + '.pb-it[aria-selected="true"] .pb-bx{background:var(--pb-ac);border-color:var(--pb-ac)}'
    + '.pb-it[aria-selected="true"] .pb-bx:after{content:"";width:8px;height:5px;border:2px solid #fff;border-top:0;border-right:0;transform:translateY(-1px) rotate(-45deg)}'
    + '.pb-uno .pb-it[aria-selected="true"] .pb-bx:after{width:6px;height:6px;border:0;border-radius:50%;background:#fff;transform:none}'
    + '.pb-todos{font-weight:600}'
    + '.pb-vacio{padding:10px 12px;font-size:13px;color:var(--pb-mu)}'
    + '.pb-chips{display:flex;flex-wrap:wrap;gap:6px}'
    + '.pb-chips:empty{display:none}'
    + '.pb-chip{display:inline-flex;align-items:center;gap:6px;max-width:100%;border:1px solid var(--pb-ac);background:var(--pb-acs);color:var(--pb-aci);border-radius:16px;padding:3px 3px 3px 11px;font-size:13px;line-height:1.3}'
    + '.pb-chip .pb-tx{display:flex;flex-wrap:wrap;align-items:baseline;column-gap:6px;min-width:0}'
    + '.pb-chip .pb-t{overflow-wrap:anywhere}'
    + '.pb-chip small{font-size:11px;opacity:.85}'
    + '.pb-chip.otro{border-color:var(--pb-ln);background:var(--pb-sf2);color:var(--pb-ink)}'
    + '.pb-chip button{flex:none;width:24px;height:24px;border-radius:50%;border:0;background:rgba(127,127,127,.18);color:inherit;font:inherit;font-size:15px;line-height:1;cursor:pointer;display:grid;place-items:center}'
    + '.pb-res{font-size:12.5px;color:var(--pb-mu)}'
    + '@media (max-width:600px){.pb .pb-in{font-size:16px}.pb-it,.pb-val{font-size:15px}'
    // en el celular la nota va debajo del nombre (a lo ancho), para que el nombre no se apriete en una columna angosta
    + '.pb-it{flex-wrap:wrap;row-gap:2px}.pb-it .pb-nota{max-width:none;flex:1 0 100%;text-align:left;font-size:12.5px}'
    + '.pb-it .pb-bx~.pb-nota{padding-left:28px}}';

  function pegaCSS() {
    if (document.getElementById('pb-css')) return;
    var s = document.createElement('style'); s.id = 'pb-css'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  // sin acentos ni mayúsculas, y los signos como espacios: «Comercial,» = «comercial»
  function norm(s) { return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9ñ]+/g, ' ').trim(); }
  // todas las palabras escritas tienen que estar en el nombre, en cualquier orden
  function coincide(o, q) {
    if (!q) return true;
    var t = o._n || (o._n = norm(o.t + ' ' + (o.buscar || '')));
    return q.split(' ').every(function (p) { return t.indexOf(p) >= 0; });
  }
  var LUPA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
  var NUM = 0;

  function crea(cfg) {
    pegaCSS();
    var yo = 'busca-' + (++NUM);              // su nombre para «un solo menú a la vez» (js/portal.js, PORTAL.abreMenu)
    var varios = !!cfg.varios, abierta = varios && cfg.lista === 'abierta';
    var ops = [], sel = [], act = -1, abierto = false, off = false, vistos = [];
    var id = cfg.id || yo, idL = id + '-lista';
    var raiz = cfg.donde;
    raiz.innerHTML = '';
    raiz.style.minWidth = '0';   // que nunca empuje a lo ancho la forma donde vive (las razones sociales largas pasan de renglón)
    var w = document.createElement('div');
    w.className = 'pb' + (varios ? '' : ' pb-uno');
    w.innerHTML = (varios && !abierta ? '<div class="pb-chips" aria-live="polite"></div>' : '')
      + '<div class="pb-caja">' + (varios ? LUPA : '')
      + '<input class="pb-in" id="' + esc(id) + '" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="' + esc(idL) + '" autocomplete="off" autocorrect="off" spellcheck="false">'
      + (varios ? '' : '<div class="pb-val" aria-hidden="true" hidden></div>')
      + (varios ? '' : '<button type="button" class="pb-x" hidden aria-label="Quitar lo escogido">×</button>') + '</div>'
      + '<div class="pb-lst" id="' + esc(idL) + '" role="listbox"' + (varios ? ' aria-multiselectable="true"' : '') + (abierta ? '' : ' hidden') + '></div>'
      + (abierta ? '<div class="pb-res" aria-live="polite"></div>' : '');
    raiz.appendChild(w);
    var inp = w.querySelector('.pb-in'), lst = w.querySelector('.pb-lst'), chips = w.querySelector('.pb-chips'),
        bx = w.querySelector('.pb-x'), res = w.querySelector('.pb-res'), val = w.querySelector('.pb-val');
    inp.placeholder = cfg.marcador || (varios ? 'Escribe para buscar' : 'Escribe parte del nombre');

    function deOp(v) { for (var i = 0; i < ops.length; i++) if (ops[i].v === v) return ops[i]; return null; }
    function texto(v) { var o = deOp(v); return o ? o.t : ''; }
    function avisa() { if (typeof cfg.cambio === 'function') { try { cfg.cambio(sel.slice()); } catch (e) { /* la página decide */ } } }
    function q() { var t = inp.value; if (!varios && sel.length && t === texto(sel[0])) return ''; return norm(t); }

    function filas() {
      var qq = q();
      vistos = ops.filter(function (o) { return coincide(o, qq) && !(varios && !abierta && sel.indexOf(o.v) >= 0); });
      var h = '';
      if (varios && cfg.todos && !qq) h += '<button type="button" class="pb-it pb-todos" role="option" data-todos aria-selected="' + (sel.length === 0) + '"><span class="pb-bx" aria-hidden="true"></span><span class="pb-t">' + esc(cfg.todos) + '</span></button>';
      h += vistos.map(function (o, i) {
        var on = sel.indexOf(o.v) >= 0;
        return '<button type="button" class="pb-it' + (i === act ? ' act' : '') + '" role="option" id="' + esc(idL + '-' + i) + '" data-i="' + i + '" aria-selected="' + on + '">'
          + (varios || abierta ? '<span class="pb-bx" aria-hidden="true"></span>' : '')
          + '<span class="pb-t">' + esc(o.t) + '</span>' + (o.nota ? '<span class="pb-nota">' + esc(o.nota) + '</span>' : '') + '</button>';
      }).join('');
      if (!vistos.length) h += '<div class="pb-vacio">' + esc(!ops.length ? (cfg.sinOpciones || 'No hay opciones') : (cfg.vacio || 'No hay coincidencias')) + '</div>';
      lst.innerHTML = h;
      inp.setAttribute('aria-activedescendant', act >= 0 && vistos[act] ? idL + '-' + act : '');
      var a = lst.querySelector('.pb-it.act'); if (a && a.scrollIntoView) { try { a.scrollIntoView({ block: 'nearest' }); } catch (e) { /* nada */ } }
    }
    function pintaChips() {
      if (!chips) return;
      chips.innerHTML = sel.map(function (v) {
        var o = deOp(v) || { v: v, t: v };
        // nombre y nota juntos si caben; si no, la nota baja completa debajo del nombre (el nombre nunca se aplasta)
        return '<span class="pb-chip' + (o.otro ? ' otro' : '') + '"><span class="pb-tx"><span class="pb-t">' + esc(o.t) + '</span>' + (o.nota ? '<small>' + esc(o.nota) + '</small>' : '') + '</span>'
          + (off ? '' : '<button type="button" data-q="' + esc(v) + '" aria-label="Quitar a ' + esc(o.t) + '">×</button>') + '</span>';
      }).join('');
    }
    function pintaRes() {
      if (!res) return;
      res.textContent = !ops.length ? '' : sel.length === 0 ? (cfg.todos ? 'Escogiste: ' + cfg.todos.charAt(0).toLowerCase() + cfg.todos.slice(1) : 'Sin escoger')
        : sel.length === 1 ? 'Escogiste 1: ' + texto(sel[0]) : 'Escogiste ' + sel.length + ' de ' + ops.length;
    }
    function pintaUno() {
      if (varios) return;
      if (document.activeElement !== inp || !abierto) inp.value = sel.length ? texto(sel[0]) : '';
      if (bx) bx.hidden = !sel.length || off;
      if (val) { val.textContent = sel.length ? texto(sel[0]) : ''; val.hidden = !sel.length; }
      w.classList.toggle('lleno', !!sel.length);
    }
    function pinta() { pintaChips(); pintaUno(); pintaRes(); if (abierta || abierto) filas(); }

    function abre(v) {
      if (abierta || off) { abierto = abierta; return; }
      if (v && !abierto) { try { if (window.PORTAL && window.PORTAL.abreMenu) window.PORTAL.abreMenu(yo); } catch (e) { /* sin aviso */ } }
      abierto = !!v; lst.hidden = !abierto; inp.setAttribute('aria-expanded', String(abierto));
      if (abierto) { act = -1; filas(); }
    }
    function escoge(o) {
      if (!o) return;
      if (varios) {
        var k = sel.indexOf(o.v);
        if (k >= 0) sel.splice(k, 1); else sel.push(o.v);
        if (!abierta) inp.value = '';
        act = -1; pinta(); avisa();
        if (!abierta) { abre(true); inp.focus(); }
      } else {
        var cambio = sel[0] !== o.v;
        sel = [o.v]; inp.value = o.t; abre(false); pinta();
        if (cambio) avisa();
      }
    }
    function quita(v) { var k = sel.indexOf(v); if (k >= 0) { sel.splice(k, 1); pinta(); avisa(); } }

    lst.addEventListener('mousedown', function (e) { e.preventDefault(); });   // que el campo no pierda el foco al picar
    lst.addEventListener('click', function (e) {
      var b = e.target.closest('.pb-it'); if (!b || off) return;
      if (b.hasAttribute('data-todos')) { if (sel.length) { sel = []; pinta(); avisa(); } return; }
      escoge(vistos[+b.dataset.i]);
      // con una sola opción, al picarla se suelta el campo: el nombre completo queda a la vista y en el celular se va el
      // teclado (con Enter el foco se queda, para seguir con el teclado)
      if (!varios) { try { inp.blur(); } catch (e2) { /* nada */ } }
    });
    if (chips) chips.addEventListener('click', function (e) { var b = e.target.closest('[data-q]'); if (b) { quita(b.dataset.q); inp.focus(); } });
    if (bx) bx.addEventListener('click', function () { if (sel.length) { sel = []; inp.value = ''; pinta(); avisa(); } inp.focus(); abre(true); });
    inp.addEventListener('focus', function () {
      w.classList.add('foco');
      if (off) return; if (!varios) { try { inp.select(); } catch (e) { /* nada */ } } abre(true);
    });
    inp.addEventListener('blur', function () { w.classList.remove('foco'); if (val) val.hidden = !sel.length; });
    if (val) val.addEventListener('click', function () { if (!off) inp.focus(); });
    inp.addEventListener('click', function () { if (!abierto) abre(true); });
    // mientras se escribe, la lista se acorta y la primera coincidencia queda lista para Enter
    inp.addEventListener('input', function () { if (!abierto && !abierta) abre(true); act = q() ? 0 : -1; filas(); });
    inp.addEventListener('keydown', function (e) {
      if (off) return;
      var k = e.key;
      if (k === 'ArrowDown' || k === 'ArrowUp') {
        e.preventDefault(); if (!abierto) abre(true);
        if (!vistos.length) return;
        act = k === 'ArrowDown' ? Math.min(vistos.length - 1, act + 1) : Math.max(0, act - 1); filas();
      } else if (k === 'Enter') {
        if (abierto || abierta) {
          var o = vistos[act] || (vistos.length === 1 ? vistos[0] : null);
          if (o) { e.preventDefault(); escoge(o); }
          else if (inp.value) e.preventDefault();
        }
      } else if (k === 'Escape') {
        if (abierto) { e.preventDefault(); e.stopPropagation(); if (!varios) inp.value = sel.length ? texto(sel[0]) : ''; abre(false); }
      } else if (k === 'Backspace' && varios && !abierta && !inp.value && sel.length) {
        quita(sel[sel.length - 1]);
      } else if (k === 'Tab' && abierto && !varios && inp.value && q()) {
        var u = vistos.length === 1 ? vistos[0] : null; if (u) escoge(u);
      }
    });
    // al salir del campo: con una sola opción, si lo escrito es un nombre de la lista se queda; si no, regresa a lo escogido
    w.addEventListener('focusout', function () {
      setTimeout(function () {
        if (w.contains(document.activeElement)) return;
        if (!varios) {
          var t = norm(inp.value);
          if (!t) { if (sel.length) { sel = []; pinta(); avisa(); } }
          else if (!sel.length || t !== norm(texto(sel[0]))) {
            var m = ops.filter(function (o) { return norm(o.t) === t; });
            if (m.length === 1) escoge(m[0]); else inp.value = sel.length ? texto(sel[0]) : '';
          }
        } else if (!abierta) inp.value = '';
        abre(false); pinta();
      }, 120);
    });
    document.addEventListener('profase-menu', function (e) { if (abierto && !abierta && e.detail !== yo) abre(false); });

    var api = {
      el: w,
      valor: function () { return sel.slice(); },
      pon: function (vals) { sel = (vals || []).map(String).filter(function (v, i, a) { return a.indexOf(v) === i; }); if (!varios) sel = sel.slice(0, 1); pinta(); },
      opciones: function (lista) {
        ops = (lista || []).map(function (o) { return { v: String(o.v), t: String(o.t == null ? o.v : o.t), nota: o.nota || '', buscar: o.buscar || '', otro: !!o.otro }; });
        var antes = sel.length;
        sel = sel.filter(function (v) { return !!deOp(v); });
        act = -1; pinta();
        return antes !== sel.length;
      },
      habilita: function (v) { off = !v; inp.disabled = off; w.classList.toggle('off', off); if (off) abre(false); pinta(); },
      foco: function () { try { inp.focus({ preventScroll: true }); } catch (e) { inp.focus(); } },
      abre: function () { abre(true); }
    };
    api.opciones(cfg.opciones || []);
    api.pon(cfg.valor || []);
    if (cfg.deshabilitado) api.habilita(false);
    if (abierta) filas();
    return api;
  }

  window.PROFASE_BUSCA = { crea: crea, norm: norm };
})();
