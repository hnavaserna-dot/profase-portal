/* Portal PROFASE · «Mis clientes ocultos» (3-nov-2026, pedido de Fernando Cadengo: «Necesito una opción en donde pueda
   decidir qué clientes ya no quiero ver, y eso hará mi lista de clientes más pequeña; al darlo de baja de aquí igual debe
   desaparecer en la búsqueda de los reportes de cartera, variaciones y activo fijo»; Héctor Daniel, 3-nov-2026: que se
   quede el nombre como lo pidió Fernando).
   Una sola pieza para Reportes › Carga de Quo, Cartera, Variaciones y Activo fijo (portal/sql/172_clientes_ocultos.sql):
   la lista es de cada quien y solo achica lo que ve esa persona; a los demás no les cambia nada. Desde 217 (3-nov-2026, pedido
   de Fernando: «Si para todos»), además se ocultan solos, para todos, los clientes sin contabilidad activa (en pausa en el
   WorkFlow, inactivos o incubados en su ficha): rep_ocultos_auto() (solo RFC de los clientes que esa persona ve). La base decide todo:
   rep_ocultos() (mis RFC ocultos), rep_ocultos_lista() (los que tengo ocultos y los que puedo ocultar, solo de los clientes
   que veo) y rep_oculta(rfcs, ocultar). Nunca lee tablas.

   PROFASE_OCULTOS.carga()              // una vez por página (las demás veces regresa lo mismo)
   PROFASE_OCULTOS.es(rfc)              // ¿lo ocultó, o se oculta solo por no tener contabilidad activa (217)? (falso mientras «Verlos por ahora»)
   PROFASE_OCULTOS.nota(donde, {sinVer}) // «Ocultaste N clientes de tu lista» con «Verlos por ahora» y «Cambiar mi lista»
   PROFASE_OCULTOS.alCambiar(fn)        // para volver a pintar cuando cambia la lista (aquí o en otra pantalla abierta)
   PROFASE_OCULTOS.ventana()            // la ventana «Mis clientes ocultos» (escoger varios y regresarlos)
   PROFASE_OCULTOS.ocultaUno(rfc, nombre)  // «Ocultar» de un cliente, con «Deshacer» en el aviso chico
   PROFASE_OCULTOS.pon(rfcs, ocultar)   // cambia la lista y avisa a las demás pantallas abiertas
   Quien es de solo consulta ve su lista pero no la cambia (la base igual lo detiene). */
(function () {
  'use strict';
  if (window.PROFASE_OCULTOS) return;

  var CSS = '.poc-velo{position:fixed;inset:0;z-index:60;background:rgba(10,18,32,.45);display:flex;align-items:center;justify-content:center;padding:16px}'
    + '.poc-velo[hidden]{display:none!important}'
    + '.poc-vent{--po-sf:var(--surface,#FFFFFF);--po-sf2:var(--surface-2,#EEF1F5);--po-ln:var(--line,#DDE3EA);--po-ink:var(--ink,#131F2D);'
    + '--po-ink2:var(--ink-2,#4E5D6E);--po-mu:var(--muted,var(--ink-3,#7B8A9B));--po-nv:var(--navy,#1F3864);--po-nvi:var(--navy-ink,#FFFFFF);'
    + '--po-ac:var(--accent,#F07A1E);background:var(--bg,var(--po-sf));color:var(--po-ink);width:min(580px,100%);'
    + 'max-height:min(760px,calc(100dvh - 32px));display:flex;flex-direction:column;border-radius:14px;overflow:hidden;box-shadow:0 14px 44px rgba(0,0,0,.28)}'
    + '.poc-vent *{box-sizing:border-box}'
    + '.poc-cab{background:var(--po-nv);color:var(--po-nvi);border-bottom:4px solid var(--po-ac);padding:14px 16px;flex:none}'
    + '.poc-cab h2{margin:0;font-size:19px;font-weight:750;line-height:1.25;overflow-wrap:anywhere}'
    + '.poc-cab p{margin:4px 0 0;font-size:12.5px;line-height:1.45;opacity:.85}'
    + '.poc-cuerpo{flex:1 1 auto;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:14px 16px;display:grid;gap:14px;min-height:0}'
    + '.poc-sec{background:var(--po-sf);border:1px solid var(--po-ln);border-radius:12px;padding:12px 14px;display:grid;gap:10px;min-width:0}'
    + '.poc-sec h3{margin:0;font-size:14.5px;font-weight:700}'
    + '.poc-mu{margin:0;font-size:12.5px;line-height:1.45;color:var(--po-mu)}'
    + '.poc-fila{display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid var(--po-ln);min-width:0}'
    + '.poc-fila:first-child{border-top:0}'
    + '.poc-fila .t{flex:1 1 auto;min-width:0;font-size:13.5px;line-height:1.35;overflow-wrap:anywhere}'
    + '.poc-fila .t small{display:block;font-size:11.5px;color:var(--po-mu)}'
    + '.poc-btn{font:inherit;font-size:13px;font-weight:600;border:1px solid var(--po-ln);background:var(--po-sf);color:var(--po-ink);border-radius:8px;'
    + 'padding:7px 12px;min-height:36px;cursor:pointer;white-space:nowrap}'
    + '.poc-btn:hover{background:var(--po-sf2)}'
    + '.poc-btn.pri{background:var(--po-nv);border-color:var(--po-nv);color:var(--po-nvi)}'
    + '.poc-btn:disabled{opacity:.55;cursor:default}'
    + '.poc-acc{display:flex;flex-wrap:wrap;gap:8px;align-items:center}'
    + '.poc-msg{font-size:12.5px;border-radius:8px;padding:8px 10px;background:var(--red-soft,#FDECEC);color:var(--red,#B42318);overflow-wrap:anywhere}'
    + '.poc-msg[hidden]{display:none}'
    + '.poc-pie{flex:none;display:flex;justify-content:flex-end;gap:8px;padding:12px 16px calc(12px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--po-ln);background:var(--po-sf)}'
    + '.poc-nota{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;font-size:12.5px;line-height:1.45;color:var(--ink-2,#4E5D6E);'
    + 'background:var(--surface-2,#EEF1F5);border-left:3px solid var(--accent,#F07A1E);border-radius:8px;padding:7px 10px;margin:8px 0;min-width:0}'
    + '.poc-nota[hidden]{display:none!important}'
    + '.poc-nota .t{flex:1 1 220px;min-width:0;overflow-wrap:anywhere}'
    + '.poc-nota button{font:inherit;font-size:12.5px;font-weight:600;border:0;background:none;color:var(--navy,#1F3864);cursor:pointer;padding:4px 6px;min-height:30px;border-radius:6px}'
    + ':root[data-theme="dark"] .poc-nota button{color:var(--accent,#F07A1E)}'
    + '.poc-nota button:hover{background:rgba(0,0,0,.06)}'
    + '@media (max-width:600px){.poc-velo{padding:0;align-items:stretch}.poc-vent{width:100%;max-height:none;height:100%;border-radius:0}'
    + '.poc-fila{flex-wrap:wrap}.poc-fila .poc-btn{margin-left:auto}}';

  var P = function () { return window.PORTAL || null; };
  function consulta() { try { var p = P(); return !!(p && p.consulta); } catch (e) { return false; } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function plural(n, uno, varios) { return n + ' ' + (n === 1 ? uno : varios); }
  async function rpc(fn, args) {
    var p = P(); if (!p || !p.sb) throw new Error('Sin conexión al portal');
    try { await p.listo; } catch (e) { /* sigue */ }
    var r = await p.sb.rpc(fn, args || {});
    if (r.error) throw r.error;
    return r.data;
  }
  function falla(e) {
    var m = (e && (e.message || e.msg)) || String(e || '');
    if (/fetch|network|Failed/i.test(m)) return 'No hay conexión. Vuelve a intentar en un momento.';
    return m || 'No se pudo guardar. Vuelve a intentar.';
  }
  function estilos() {
    if (document.getElementById('poc-css')) return;
    var st = document.createElement('style'); st.id = 'poc-css'; st.textContent = CSS; document.head.appendChild(st);
  }

  var LISTA = new Set();        // los RFC que ocultó quien entró
  var AUTO = new Map();         // los que se ocultan solos, para todos (217): RFC → pausa | inactivo | incubado
  var VER = false;              // «Verlos por ahora» (solo en esta pantalla; no cambia la lista)
  var CARGA = null;             // la promesa de la primera carga
  var OYEN = [];                // alCambiar
  var NOTAS = [];               // [{el, sinVer}]
  var canal = null;
  try { canal = new BroadcastChannel('profase-ocultos'); } catch (e) { canal = null; }

  function ponLista(arr) {
    LISTA = new Set((Array.isArray(arr) ? arr : []).map(function (r) { return String(r || '').toUpperCase().trim(); }).filter(Boolean));
  }
  function avisa() {
    NOTAS.forEach(function (n) { pintaNota(n); });
    OYEN.slice().forEach(function (fn) { try { fn(); } catch (e) { /* una pantalla no detiene a las demás */ } });
    if (VENT && !VENT.velo.hidden) pintaVentana();
  }
  if (canal) canal.onmessage = function (ev) {
    var d = ev && ev.data; if (!d || !Array.isArray(d.lista)) return;
    ponLista(d.lista); avisa();
  };

  function ponAuto(arr) {
    AUTO = new Map();
    (Array.isArray(arr) ? arr : []).forEach(function (a) {
      var r = String((a && a.rfc) || '').toUpperCase().trim(); if (r) AUTO.set(r, String((a && a.por) || 'pausa'));
    });
  }
  function carga() {
    if (!CARGA) CARGA = Promise.all([
      rpc('rep_ocultos').then(ponLista).catch(function () { ponLista([]); }),
      // los clientes sin contabilidad activa (en pausa en el WorkFlow, inactivos o incubados) se ocultan solos, para todos
      rpc('rep_ocultos_auto').then(ponAuto).catch(function () { ponAuto([]); })
    ]).then(function () { return LISTA; });
    return CARGA;
  }
  function es(rfc) {
    if (VER || (!LISTA.size && !AUTO.size)) return false;
    var r = String(rfc || '').toUpperCase().trim();
    return LISTA.has(r) || AUTO.has(r);
  }
  function alCambiar(fn) { if (typeof fn === 'function') OYEN.push(fn); }

  // Cambia la lista (de 500 en 500, como deja la base) y avisa aquí y a las demás pantallas abiertas
  async function pon(rfcs, ocultar) {
    if (consulta()) throw new Error('Tu usuario es de solo consulta: no cambia la lista.');
    var l = (rfcs || []).map(function (r) { return String(r || '').toUpperCase().trim(); }).filter(Boolean);
    var d = null;
    for (var i = 0; i < l.length; i += 500) d = await rpc('rep_oculta', { p_rfcs: l.slice(i, i + 500), p_ocultar: ocultar !== false });
    if (d) ponLista(d);
    if (canal) { try { canal.postMessage({ lista: Array.from(LISTA) }); } catch (e) { /* nada */ } }
    LISTA_V = null;
    avisa();
    return LISTA;
  }

  async function ocultaUno(rfc, nombre) {
    await pon([rfc], true);
    var p = P(), quien = nombre || rfc;
    if (p && p.avisoChico) p.avisoChico({ id: 'poc', texto: 'Ocultaste ' + quien + ' de tu lista.',
      detalle: 'Ya no te sale aquí ni en Cartera, Variaciones y Activo fijo. A los demás no les cambia nada.',
      boton: 'Deshacer', ms: 9000, accion: function () { pon([rfc], false).catch(function () { /* nada */ }); } });
  }

  // ---------- La nota de las pantallas ----------
  function pintaNota(n) {
    var el = n.el; if (!el) return;
    var c = LISTA.size, a = 0;
    AUTO.forEach(function (_, r) { if (!LISTA.has(r)) a++; });
    if (!c && !a) { el.hidden = true; el.innerHTML = ''; return; }
    el.hidden = false; el.classList.add('poc-nota');
    var donde = n.sinVer ? 'no te salen aquí.' : 'no te salen aquí ni en la búsqueda.';
    var partes = [];
    if (c) partes.push('ocultaste ' + plural(c, 'cliente', 'clientes') + ' de tu lista');
    if (a) partes.push(plural(a, 'cliente sin contabilidad activa (en pausa en el WorkFlow, inactivo o incubado) se oculta solo',
                                 'clientes sin contabilidad activa (en pausa en el WorkFlow, inactivos o incubados) se ocultan solos'));
    var t = VER ? 'Por ahora ves también ' + (c + a === 1 ? 'el cliente oculto' : 'los ' + (c + a) + ' clientes ocultos') + '.'
                : partes.join(' y ') + ': ' + donde;
    t = t.charAt(0).toUpperCase() + t.slice(1);
    el.innerHTML = '<span class="t">' + esc(t) + '</span>'
      + (n.sinVer ? '' : '<button type="button" data-poc="ver">' + (VER ? 'Ocultarlos otra vez' : 'Verlos por ahora') + '</button>')
      + '<button type="button" data-poc="cambia">Cambiar mi lista</button>';
    var bv = el.querySelector('[data-poc="ver"]'); if (bv) bv.onclick = function () { VER = !VER; avisa(); };
    el.querySelector('[data-poc="cambia"]').onclick = function () { ventana(); };
  }
  function nota(el, o) {
    if (!el) return;
    estilos();
    var n = NOTAS.filter(function (x) { return x.el === el; })[0];
    if (!n) { n = { el: el, sinVer: !!(o && o.sinVer) }; NOTAS.push(n); } else if (o) n.sinVer = !!o.sinVer;
    pintaNota(n);
  }

  // ---------- La ventana «Mis clientes ocultos» ----------
  var VENT = null, LISTA_V = null, BUS = null, ANTES = null;
  function arma() {
    if (VENT) return VENT;
    estilos();
    var velo = document.createElement('div'); velo.className = 'poc-velo'; velo.hidden = true;
    velo.innerHTML = '<div class="poc-vent" role="dialog" aria-modal="true" aria-labelledby="poc-tit">'
      + '<div class="poc-cab"><h2 id="poc-tit">Mis clientes ocultos</h2>'
      + '<p>Los que ocultes dejan de salirte solo a ti en Carga de Quo, Cartera, Variaciones y Activo fijo, también en sus búsquedas. A los demás no les cambia nada y los regresas cuando quieras. Los clientes sin contabilidad activa se ocultan solos, para todos.</p></div>'
      + '<div class="poc-cuerpo"></div>'
      + '<div class="poc-pie"><button type="button" class="poc-btn pri" id="poc-x">Cerrar</button></div></div>';
    document.body.appendChild(velo);
    velo.addEventListener('click', function (e) { if (e.target === velo) cierra(); });
    velo.querySelector('#poc-x').onclick = cierra;
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && VENT && !VENT.velo.hidden) { e.preventDefault(); cierra(); }
    });
    VENT = { velo: velo, cuerpo: velo.querySelector('.poc-cuerpo') };
    return VENT;
  }
  function cierra() {
    if (!VENT) return;
    VENT.velo.hidden = true;
    try { if (ANTES && ANTES.focus) ANTES.focus(); } catch (e) { /* nada */ }
  }
  function msg(t) { var m = VENT && VENT.cuerpo.querySelector('.poc-msg'); if (m) { m.textContent = t || ''; m.hidden = !t; } }

  function pintaVentana() {
    var v = VENT, ro = consulta();
    if (!LISTA_V) { v.cuerpo.innerHTML = '<p class="poc-mu">Cargando tu lista…</p>'; return; }
    var oc = LISTA_V.ocultos || [], cl = LISTA_V.clientes || [];
    var h = '<div class="poc-msg" role="alert" hidden></div>';
    if (ro) h += '<p class="poc-mu">Tu usuario es de solo consulta: ves tu lista, pero no la cambias.</p>';
    if (!ro) h += '<div class="poc-sec"><h3>Ocultar clientes</h3>'
      + '<p class="poc-mu">Escribe parte del nombre o del RFC y escoge uno o varios.</p>'
      + '<div id="poc-bus"></div><div class="poc-acc"><button type="button" class="poc-btn pri" id="poc-ocultar" disabled>Ocultar</button></div></div>';
    h += '<div class="poc-sec"><h3>' + (oc.length ? 'Tus ' + plural(oc.length, 'cliente oculto', 'clientes ocultos') : 'No tienes clientes ocultos') + '</h3>';
    if (!oc.length) h += '<p class="poc-mu">Cuando ocultes uno, aquí lo ves y lo puedes regresar.</p>';
    else {
      h += '<div>' + oc.map(function (o, i) {
        var nom = o.nombre || 'Cliente que ya no está en tu lista de clientes';
        return '<div class="poc-fila"><span class="t">' + esc(nom) + '<small>' + esc(o.rfc) + '</small></span>'
          + (ro ? '' : '<button type="button" class="poc-btn" data-reg="' + i + '">Regresar</button>') + '</div>';
      }).join('') + '</div>';
      if (!ro && oc.length > 1) h += '<div class="poc-acc"><button type="button" class="poc-btn" id="poc-todos">Regresar todos</button></div>';
    }
    h += '</div>';
    var au = LISTA_V.auto || [];
    if (au.length) {
      var POR = { pausa: 'En pausa en el WorkFlow', inactivo: 'Inactivo en su ficha', incubado: 'Incubado en su ficha' };
      h += '<div class="poc-sec" id="poc-solos"><h3>Se ocultan solos (' + au.length + ')</h3>'
        + '<p class="poc-mu">Los clientes sin contabilidad activa no les salen a nadie aquí ni en Cartera, Variaciones y Activo fijo. '
        + 'Vuelven a salir solos en cuanto se quita la pausa o los ponen Activos en su ficha (Clientes › Base de clientes). '
        + 'En Cartera, Variaciones y Activo fijo los ves con «Verlos por ahora».</p>'
        + '<div>' + au.map(function (o) {
          return '<div class="poc-fila"><span class="t">' + esc(o.nombre || o.rfc) + '<small>' + esc(o.rfc) + ' · '
            + esc(POR[o.por] || 'Sin contabilidad activa') + '</small></span></div>';
        }).join('') + '</div></div>';
    }
    v.cuerpo.innerHTML = h;
    if (!ro) {
      var bo = v.cuerpo.querySelector('#poc-ocultar');
      BUS = null;
      if (window.PROFASE_BUSCA && window.PROFASE_BUSCA.crea) {
        BUS = window.PROFASE_BUSCA.crea({
          donde: v.cuerpo.querySelector('#poc-bus'), id: 'poc-q', varios: true, lista: 'al-buscar',
          opciones: cl.map(function (c) { return { v: c.rfc, t: c.nombre || c.rfc, nota: c.rfc }; }),
          valor: [], marcador: 'Escribe parte del nombre o del RFC', vacio: 'No hay coincidencias',
          sinOpciones: 'Ya ocultaste todos tus clientes',
          cambio: function (vals) { bo.disabled = !vals.length; bo.textContent = vals.length > 1 ? 'Ocultar ' + vals.length : 'Ocultar'; }
        });
      }
      bo.onclick = function () {
        var vals = BUS ? BUS.valor() : []; if (!vals.length) return;
        bo.disabled = true; msg('');
        pon(vals, true).then(recargaVentana).catch(function (e) { bo.disabled = false; msg(falla(e)); });
      };
      v.cuerpo.querySelectorAll('[data-reg]').forEach(function (b) {
        b.onclick = function () {
          var o = oc[+b.dataset.reg]; if (!o) return;
          b.disabled = true; msg('');
          pon([o.rfc], false).then(recargaVentana).catch(function (e) { b.disabled = false; msg(falla(e)); });
        };
      });
      var bt = v.cuerpo.querySelector('#poc-todos');
      if (bt) bt.onclick = function () {
        var todos = oc.map(function (o) { return o.rfc; });
        bt.disabled = true; msg('');
        pon(todos, false).then(function () {
          recargaVentana();
          var p = P();
          if (p && p.avisoChico) p.avisoChico({ id: 'poc', texto: 'Regresaste ' + plural(todos.length, 'cliente', 'clientes') + ' a tu lista.',
            boton: 'Deshacer', ms: 9000, accion: function () { pon(todos, true).then(recargaVentana).catch(function () { /* nada */ }); } });
        }).catch(function (e) { bt.disabled = false; msg(falla(e)); });
      };
    }
  }
  function recargaVentana() {
    LISTA_V = null;
    if (VENT && !VENT.velo.hidden) pintaVentana();
    return rpc('rep_ocultos_lista').then(function (d) {
      LISTA_V = d || { ocultos: [], clientes: [], auto: [] };
      if (VENT && !VENT.velo.hidden) pintaVentana();
    }).catch(function (e) {
      LISTA_V = { ocultos: Array.from(LISTA).map(function (r) { return { rfc: r }; }), clientes: [] };
      if (VENT && !VENT.velo.hidden) { pintaVentana(); msg(falla(e)); }
    });
  }
  function ventana() {
    arma();
    ANTES = document.activeElement;
    VENT.velo.hidden = false;
    pintaVentana();
    try { VENT.velo.querySelector('#poc-x').focus({ preventScroll: true }); } catch (e) { /* nada */ }
    return recargaVentana();
  }

  window.PROFASE_OCULTOS = { carga: carga, es: es, nota: nota, alCambiar: alCambiar, ventana: ventana, ocultaUno: ocultaUno, pon: pon,
                             cuantos: function () { return LISTA.size; }, solos: function () { return AUTO.size; } };
})();
