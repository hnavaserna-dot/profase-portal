/* Portal PROFASE · menú lateral con módulos y sub módulos (pedido de Fernando Cadengo, 29-oct-2026).
   Va en las tres vistas (director, gerentes, contadores). No cambia cómo funciona cada pestaña: las pestañas siguen
   siendo los botones de siempre (.vsw), que aquí se esconden; el menú solo los pica. Por eso cada quien ve en el
   menú exactamente lo que ya veía: un sub módulo aparece solo si su botón está a la vista (lo deciden la página y
   la base), y un módulo sin sub módulos no se pinta.
   - Computadora: el menú se encoge a una tira de íconos («Ocultar menú» o ☰); al pasar el mouse por un ícono
     salen sus sub módulos. Se recuerda en el navegador de cada quien.
   - Celular (900 px o menos): el menú se esconde completo y ☰ lo abre encima de la página.
   - La dirección de la página lleva la sección (#panel, #cartera…): al recargar se queda donde estaba. */
(function () {
  'use strict';
  var ROL = document.documentElement.getAttribute('data-rol') || '';
  if (['director', 'gerente', 'contador'].indexOf(ROL) < 0 || window.top !== window.self) return;

  var IC = {
    wf: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17"/>',
    rep: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    adm: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
    quo: '<circle cx="11.5" cy="11.5" r="7.5"/><path d="m16.5 16.5 4 4"/>',
    mas: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>'
  };
  // k: lo que va en la dirección; v: el botón de la pestaña (data-view); q: la sub pestaña de QUO
  var MODS = [
    { k: 'wf', t: 'Workflow', subs: [
      { k: 'panel', v: 'wf', t: 'Panel', tc: 'Mi panel' },
      { k: 'clientes', v: 'cli', t: 'Clientes' },
      { k: 'comentarios', v: 'com', t: 'Comentarios' }] },
    { k: 'rep', t: 'Reportes', subs: [
      { k: 'cartera', v: 'car', t: 'Cartera' },
      { k: 'variaciones', v: 'var', t: 'Variaciones' },
      { k: 'activofijo', v: 'af', t: 'Activo fijo' }] },
    { k: 'adm', t: 'Administración', subs: [
      { k: 'cobranza', v: 'cxc', t: 'Cobranza' },
      { k: 'cajachica', v: 'caja', t: 'Caja chica' },
      { k: 'cotizador', v: 'cot', t: 'Cotizador DECOMSA' },
      { k: 'calendario', v: 'cal', t: 'Calendario' },   // cumpleaños, aniversarios y eventos: todos lo ven
      { k: 'accesos', v: 'acc', t: 'Accesos' }] },   // bitácora de accesos: solo la ve el director
    { k: 'quo', t: 'QUO', subs: [
      { k: 'quo-cotizador', v: 'quo', q: 'cot', t: 'Cotizador QUO' },
      { k: 'quo-membresias', v: 'quo', q: 'mem', t: 'Control de membresías' }] }
  ];
  // Una pestaña nueva que todavía no tenga lugar en el menú sale en «Más», para que nunca se pierda
  var MAS = { k: 'mas', t: 'Más', subs: [] };
  var ENT = {};
  MODS.forEach(function (m) { m.subs.forEach(function (s) { s.m = m; ENT[s.k] = s; }); });

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento: no se recuerda */ } }
  };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function svg(d, cls) { return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
  var FLECHA = '<path d="m9 6 6 6-6 6"/>';

  var CSS = ':root{--pm-sw:248px;--pm-rail:64px;--pm-top:0px}'
    + '.pm-oculto{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;white-space:nowrap!important;margin:-1px!important;padding:0!important;border:0!important}'
    + '#v-quo .qsub{display:none!important}'
    + '.pm-ham{flex:none;width:38px;height:38px;border:0;background:none;border-radius:8px;cursor:pointer;display:grid;place-items:center;color:var(--navy,#1F3864);margin-left:-6px;padding:0}'
    + '.pm-ham:hover{background:var(--navy-soft,#E6ECF6)}.pm-ham svg{width:22px;height:22px;display:block}'
    + ':root[data-theme="dark"] .pm-ham{color:var(--ink,#E5EAF2)}'   // modo oscuro: el azul no se ve sobre fondo oscuro
    + '.pm-tit{display:flex;flex-direction:column;min-width:0;flex:0 1 auto}'
    + '.pm-crumb{font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted,#5A6577);line-height:1.1;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    + 'header.band .meta{margin-left:auto}'
    + '.pm-side{position:fixed;left:0;top:var(--pm-top);bottom:0;width:var(--pm-sw);background:var(--navy,#1F3864);color:#DCE5F3;display:flex;flex-direction:column;z-index:30;transition:width .18s ease;font-family:var(--f-body,inherit)}'
    + '.pm-side button{font:inherit}'
    + '.pm-cab{display:none}'
    + '.pm-lista{flex:1;overflow-y:auto;overflow-x:hidden;padding:10px 8px}'
    + '.pm-mod{margin-bottom:2px;position:relative}'
    + '.pm-mb{width:100%;display:flex;align-items:center;gap:12px;border:0;background:none;color:#DCE5F3;padding:10px;border-radius:8px;cursor:pointer;font-weight:600;font-size:14px;text-align:left;white-space:nowrap}'
    + '.pm-mb:hover{background:rgba(255,255,255,.1)}'
    + '.pm-mb:focus-visible,.pm-subs a:focus-visible,.pm-pie button:focus-visible{outline:2px solid var(--accent,#F07A1E);outline-offset:-2px}'
    + '.pm-ic{width:20px;height:20px;flex:none;display:block}'
    + '.pm-lbl{flex:1;overflow:hidden;text-overflow:ellipsis}'
    + '.pm-car{width:14px;height:14px;opacity:.7;transition:transform .15s;flex:none;display:block}'
    + '.pm-mod[data-open="true"] .pm-car{transform:rotate(90deg)}'
    + '.pm-mod.on>.pm-mb{color:#fff}.pm-mod.on>.pm-mb .pm-ic{color:var(--accent,#F07A1E)}'
    + '.pm-subs{list-style:none;margin:2px 0 6px;padding:0 0 0 22px;display:none}'
    + '.pm-mod[data-open="true"] .pm-subs{display:block}'
    + '.pm-subs a{display:block;color:#A9BBD8;text-decoration:none;padding:7px 10px 7px 20px;font-size:13.5px;border-left:2px solid rgba(255,255,255,.14);border-radius:0 7px 7px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    + '.pm-subs a:hover{color:#fff;background:rgba(255,255,255,.1)}'
    + '.pm-subs a[aria-current="page"]{color:#fff;font-weight:700;border-left:3px solid var(--accent,#F07A1E);background:rgba(240,122,30,.18)}'
    + '.pm-fly{display:none}'
    + '.pm-pie{border-top:1px solid rgba(255,255,255,.12);padding:8px}'
    + '.pm-pie button{width:100%;display:flex;align-items:center;gap:12px;border:0;background:none;color:#A9BBD8;padding:9px 10px;border-radius:8px;cursor:pointer;font-size:13px;white-space:nowrap;text-align:left}'
    + '.pm-pie button:hover{background:rgba(255,255,255,.1);color:#fff}'
    + '.pm-pie svg{transition:transform .18s}'
    + '.pm-scrim{display:none}'
    + '@media (min-width:901px){'
    + 'body.pm{padding-left:var(--pm-sw)!important}body.pm header.band{margin-left:calc(-1 * var(--pm-sw))}'
    + 'body.pm.pm-mini{padding-left:var(--pm-rail)!important}body.pm.pm-mini header.band{margin-left:calc(-1 * var(--pm-rail))}'
    + 'body.pm-mini .pm-side{width:var(--pm-rail)}'
    + 'body.pm-mini .pm-lbl,body.pm-mini .pm-car{display:none}'
    + 'body.pm-mini .pm-mb{justify-content:center;padding:11px 0}'
    + 'body.pm-mini .pm-pie button{justify-content:center}body.pm-mini .pm-pie svg{transform:rotate(180deg)}'
    + 'body.pm-mini .pm-lista{overflow:visible}'
    + 'body.pm-mini .pm-subs{display:none!important;position:absolute;left:calc(100% + 6px);top:0;min-width:220px;background:var(--navy,#1F3864);border-radius:10px;padding:6px;box-shadow:0 12px 32px rgba(0,0,0,.3);margin:0;z-index:31}'
    + 'body.pm-mini .pm-mod:hover .pm-subs,body.pm-mini .pm-mod:focus-within .pm-subs,body.pm-mini .pm-mod.fly .pm-subs{display:block!important}'
    + 'body.pm-mini .pm-subs::before{content:"";position:absolute;left:-8px;top:0;bottom:0;width:8px}'
    + 'body.pm-mini .pm-fly{display:block;padding:6px 10px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#A9BBD8}'
    + 'body.pm-mini .pm-subs a{border-left:0;padding-left:10px;border-radius:7px}'
    + 'body.pm-mini .pm-subs a[aria-current="page"]{border-left:0;box-shadow:inset 3px 0 0 var(--accent,#F07A1E)}'
    + '}'
    + '@media (max-width:900px){'
    + '.pm-side{top:0;width:min(290px,85vw);transform:translateX(-105%);transition:transform .2s ease;z-index:46;box-shadow:none}'
    + 'body.pm-abierto .pm-side{transform:none;box-shadow:8px 0 30px rgba(0,0,0,.3)}'
    + 'body.pm-abierto .pm-scrim{display:block;position:fixed;inset:0;background:rgba(10,18,32,.45);z-index:45}'
    + '.pm-cab{display:flex;align-items:center;gap:10px;padding:12px 10px 10px 16px;border-bottom:1px solid rgba(255,255,255,.12)}'
    + '.pm-cab img{width:30px;height:30px;object-fit:contain;display:block;background:#fff;border-radius:8px;padding:3px;box-sizing:border-box}'
    + '.pm-cab span{flex:1;font-family:Arial,"Helvetica Neue",Helvetica,sans-serif;font-weight:700;letter-spacing:.16em;color:#fff;font-size:15px}'
    + '.pm-cab button{border:0;background:none;color:#fff;width:36px;height:36px;border-radius:8px;cursor:pointer;display:grid;place-items:center}'
    + '.pm-cab button:hover{background:rgba(255,255,255,.1)}.pm-cab svg{width:20px;height:20px;display:block}'
    + '.pm-pie{display:none}'
    + '}'
    + '@media (max-width:600px){header.band .tag{display:none}.pm-tit h1{font-size:17px;overflow-wrap:anywhere}}'
    + '@media (prefers-reduced-motion:reduce){.pm-side,.pm-car,.pm-pie svg{transition:none}}';

  var sw, side, lista, hdr, titulo, crumb, pendiente = 0, listo = false, quoObs = null;

  function movil() { return matchMedia('(max-width:900px)').matches; }
  function boton(v) { return sw.querySelector('button[data-view="' + v + '"]'); }
  function aLaVista(b) { return !!b && !b.hidden && getComputedStyle(b).display !== 'none'; }
  function subQuo(q) { return document.querySelector('#v-quo .qsw button[data-q="' + q + '"]'); }

  // Qué sub módulos ve esta persona (en el orden del menú), más los botones nuevos que no estén en el menú
  function modulos() {
    var conocidos = {}, out = [];
    MODS.forEach(function (m) {
      var subs = m.subs.filter(function (s) { conocidos[s.v] = 1; return aLaVista(boton(s.v)) && (!s.q || subQuo(s.q)); });
      if (subs.length) out.push({ m: m, subs: subs });
    });
    var extra = [];
    sw.querySelectorAll('button[data-view]').forEach(function (b) {
      var v = b.dataset.view;
      if (conocidos[v] || !aLaVista(b)) return;
      var s = ENT['v-' + v] || (ENT['v-' + v] = { k: v, v: v, t: b.textContent.trim(), m: MAS });
      extra.push(s);
    });
    if (extra.length) out.push({ m: MAS, subs: extra });
    return out;
  }
  function activo() {
    var b = sw.querySelector('button[aria-pressed="true"]');
    if (!b) return null;
    var v = b.dataset.view;
    if (v === 'quo') {
      var q = document.querySelector('#v-quo .qsw button[aria-pressed="true"]');
      return ENT[q && q.dataset.q === 'mem' ? 'quo-membresias' : 'quo-cotizador'];
    }
    for (var k in ENT) if (ENT[k].v === v && !ENT[k].q) return ENT[k];
    return null;
  }
  function nombre(s) { return ROL === 'contador' && s.tc ? s.tc : s.t; }

  function ir(k) {
    var s = ENT[k] || ENT['v-' + k];
    if (!s) return false;
    var b = boton(s.v);
    if (!aLaVista(b)) return false;
    if (s.q) {
      var x = subQuo(s.q);
      if (!x) return false;
      x.click();      // primero la sub pestaña (para que no cargue la otra), luego QUO
    }
    b.click();
    listo = true;
    if (movil()) abre(false);
    pinta();
    return true;
  }

  function pinta() {
    pendiente = 0;
    var abiertos = {};
    try { abiertos = JSON.parse(store.get('portal.menu.abiertos') || '{}') || {}; } catch (e) { abiertos = {}; }
    var act = activo(), h = '', guarda = false;
    modulos().forEach(function (x) {
      var m = x.m, on = !!act && x.subs.indexOf(act) >= 0, open = on || abiertos[m.k] === true;
      // el módulo de la sección abierta se queda abierto aunque luego se elija otro, hasta que lo cierren
      if (on && abiertos[m.k] !== true) { abiertos[m.k] = true; guarda = true; }
      h += '<div class="pm-mod' + (on ? ' on' : '') + '" data-m="' + m.k + '" data-open="' + open + '">'
        + '<button type="button" class="pm-mb" aria-expanded="' + open + '" title="' + esc(m.t) + '">' + svg(IC[m.k] || IC.mas, 'pm-ic')
        + '<span class="pm-lbl">' + esc(m.t) + '</span>' + svg(FLECHA, 'pm-car') + '</button>'
        + '<ul class="pm-subs"><li class="pm-fly" aria-hidden="true">' + esc(m.t) + '</li>'
        + x.subs.map(function (s) {
          return '<li><a href="#' + esc(s.k) + '" data-k="' + esc(s.k) + '"' + (s === act ? ' aria-current="page"' : '') + '>' + esc(nombre(s)) + '</a></li>';
        }).join('') + '</ul></div>';
    });
    if (guarda) store.set('portal.menu.abiertos', JSON.stringify(abiertos));
    if (lista.innerHTML !== h) lista.innerHTML = h;
    if (act) {
      crumb.textContent = act.m.t;
      var t = nombre(act);
      if (titulo.textContent !== t) titulo.textContent = t;
      document.title = t + ' · Portal PROFASE';
      if (listo && location.hash !== '#' + act.k) { try { history.replaceState(null, '', '#' + act.k); } catch (e) { /* sin historial */ } }
    }
  }
  function luego() { if (!pendiente) pendiente = requestAnimationFrame(pinta); }

  function mini(v) {
    if (v !== undefined) store.set('portal.menu.mini', v ? '1' : '0');
    var on = store.get('portal.menu.mini') === '1';
    document.body.classList.toggle('pm-mini', on);
    var l = side.querySelector('.pm-pie .pm-lbl');
    if (l) l.textContent = on ? 'Mostrar menú' : 'Ocultar menú';
    side.querySelector('.pm-pie button').setAttribute('aria-label', on ? 'Mostrar menú' : 'Ocultar menú');
    setTimeout(alto, 200);
  }
  function abre(v) { document.body.classList.toggle('pm-abierto', v); }
  // En computadora el menú empieza justo abajo del encabezado
  function alto() {
    var r = hdr.getBoundingClientRect();
    document.documentElement.style.setProperty('--pm-top', Math.max(0, r.bottom) + 'px');
  }

  function arranca() {
    sw = document.querySelector('header .vsw');
    hdr = document.querySelector('header.band');
    titulo = document.getElementById('vtitle');
    if (!sw || !hdr || !titulo) return;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    sw.classList.add('pm-oculto');
    document.body.classList.add('pm');

    // ☰ al inicio del encabezado y, arriba del título, el módulo
    var ham = document.createElement('button');
    ham.type = 'button'; ham.className = 'pm-ham'; ham.setAttribute('aria-label', 'Mostrar u ocultar el menú'); ham.setAttribute('aria-controls', 'pm-side');
    ham.innerHTML = svg('<path d="M4 7h16M4 12h16M4 17h16"/>', '');
    var brand = hdr.querySelector('.brand') || titulo.parentNode;
    brand.insertBefore(ham, brand.firstChild);
    var tit = document.createElement('div'); tit.className = 'pm-tit';
    crumb = document.createElement('span'); crumb.className = 'pm-crumb';
    titulo.parentNode.insertBefore(tit, titulo);
    tit.appendChild(crumb); tit.appendChild(titulo);

    side = document.createElement('nav');
    side.className = 'pm-side'; side.id = 'pm-side'; side.setAttribute('aria-label', 'Menú del portal');
    var logo = hdr.querySelector('img.logo');
    side.innerHTML = '<div class="pm-cab">' + (logo ? '<img alt="" src="' + esc(logo.getAttribute('src')) + '">' : '') + '<span>PROFASE</span>'
      + '<button type="button" aria-label="Cerrar el menú">' + svg('<path d="M6 6l12 12M18 6 6 18"/>', '') + '</button></div>'
      + '<div class="pm-lista"></div>'
      + '<div class="pm-pie"><button type="button">' + svg('<path d="m11 17-5-5 5-5M18 17l-5-5 5-5"/>', 'pm-ic') + '<span class="pm-lbl">Ocultar menú</span></button></div>';
    document.body.appendChild(side);
    var scrim = document.createElement('div'); scrim.className = 'pm-scrim';
    document.body.appendChild(scrim);
    lista = side.querySelector('.pm-lista');

    ham.onclick = function () { if (movil()) abre(!document.body.classList.contains('pm-abierto')); else mini(store.get('portal.menu.mini') !== '1'); };
    side.querySelector('.pm-pie button').onclick = function () { mini(store.get('portal.menu.mini') !== '1'); };
    side.querySelector('.pm-cab button').onclick = function () { abre(false); };
    scrim.onclick = function () { abre(false); };
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && document.body.classList.contains('pm-abierto')) abre(false); });

    lista.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-k]');
      if (a) { e.preventDefault(); ir(a.dataset.k); return; }
      var mb = e.target.closest('.pm-mb');
      if (!mb) return;
      var mod = mb.parentNode;
      if (document.body.classList.contains('pm-mini') && !movil()) { mod.classList.toggle('fly'); return; }
      var o = mod.dataset.open !== 'true';
      mod.dataset.open = o; mb.setAttribute('aria-expanded', o);
      var ab = {};
      try { ab = JSON.parse(store.get('portal.menu.abiertos') || '{}') || {}; } catch (er) { ab = {}; }
      ab[mod.dataset.m] = o; store.set('portal.menu.abiertos', JSON.stringify(ab));
    });
    lista.addEventListener('mouseleave', function () { lista.querySelectorAll('.pm-mod.fly').forEach(function (m) { m.classList.remove('fly'); }); });

    // Cuando una pestaña aparece (la base dice que sí), cambia o se elige, el menú se vuelve a pintar
    new MutationObserver(luego).observe(sw, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'aria-pressed'] });
    function vigilaQuo() {
      var q = document.querySelector('#v-quo .qsw');
      if (q && !quoObs) { quoObs = new MutationObserver(luego); quoObs.observe(q, { subtree: true, attributes: true, attributeFilter: ['aria-pressed'] }); luego(); }
    }
    new MutationObserver(vigilaQuo).observe(document.body, { childList: true });
    vigilaQuo();

    mini();
    alto();
    addEventListener('resize', function () { alto(); if (!movil()) abre(false); });
    addEventListener('scroll', alto, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(alto).observe(hdr);
    addEventListener('hashchange', function () { var k = location.hash.slice(1); var a = activo(); if (k && (!a || a.k !== k)) ir(k); });

    // Abre la sección de la dirección (#cartera…) en cuanto su pestaña esté a la vista; algunas esperan a la base
    var pedida = location.hash.slice(1), t0 = Date.now();
    pinta();
    if (!pedida || !(ENT[pedida])) { listo = true; pinta(); return; }
    (function intenta() {
      if (listo) return;
      if (ir(pedida)) return;
      if (Date.now() - t0 > 12000) { listo = true; pinta(); return; }
      setTimeout(intenta, 250);
    })();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arranca);
  else arranca();
})();
