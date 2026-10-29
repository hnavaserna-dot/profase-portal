/* Portal PROFASE · menú lateral con módulos y sub módulos (pedido de Fernando Cadengo, 29-oct-2026).
   Va en las tres vistas (director, gerentes, contadores). No cambia cómo funciona cada pestaña: las pestañas siguen
   siendo los botones de siempre (.vsw), que aquí se esconden; el menú solo los pica. Por eso cada quien ve en el
   menú exactamente lo que ya veía: un sub módulo aparece solo si su botón está a la vista (lo deciden la página y
   la base), y un módulo sin sub módulos no se pinta.
   - Computadora: el menú se encoge a una tira de íconos («Ocultar menú» o ☰); al pasar el mouse por un ícono
     salen sus sub módulos. Se recuerda en el navegador de cada quien.
   - Celular (900 px o menos): el menú se esconde completo y ☰ lo abre encima de la página.
   - La dirección de la página lleva la sección (#panel, #cartera…): al recargar se queda donde estaba.
   - Menú arriba (29-oct-2026, propuesta de Gabriel): cada quien puede cambiar a una tira de íconos grandes arriba al
     centro, con «Inicio» en medio y los módulos repartidos a los lados; al picar un ícono se abre la descripción del
     módulo y sus sub módulos. Por omisión sigue el menú de la izquierda; se recuerda en el navegador de cada quien.
   - Signo de temporada (29-oct-2026, propuesta de Gabriel): el logo del encabezado es solo el signo PROFASE, de un
     color, y cambia solo con la fecha (Halloween y Día de Muertos naranja, Navidad rojo, fiestas patrias tricolor…). */
(function () {
  'use strict';
  var ROL = document.documentElement.getAttribute('data-rol') || '';
  if (['director', 'gerente', 'contador'].indexOf(ROL) < 0 || window.top !== window.self) return;

  var IC = {
    wf: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17"/>',
    rep: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    adm: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
    quo: '<circle cx="11.5" cy="11.5" r="7.5"/><path d="m16.5 16.5 4 4"/>',
    access: '<ellipse cx="12" cy="5.5" rx="8" ry="2.8"/><path d="M4 5.5v13c0 1.5 3.6 2.8 8 2.8s8-1.3 8-2.8v-13M4 12c0 1.5 3.6 2.8 8 2.8s8-1.3 8-2.8"/>',
    mas: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>'
  };
  // k: lo que va en la dirección; v: el botón de la pestaña (data-view); q: la sub pestaña de QUO
  var MODS = [
    { k: 'wf', t: 'Workflow', d: 'El avance del trabajo de cada cliente y de cada contador.', subs: [
      { k: 'panel', v: 'wf', t: 'Panel', tc: 'Mi panel', d: 'Obligaciones, vencimientos y pausas.' },
      { k: 'clientes', v: 'cli', t: 'Clientes', d: 'Cada cliente y su avance.' },
      { k: 'comentarios', v: 'com', t: 'Comentarios', d: 'Las notas del equipo.' }] },
    { k: 'rep', t: 'Reportes', d: 'Los reportes para revisar los números del despacho.', subs: [
      { k: 'cartera', v: 'car', t: 'Cartera', d: 'Lo que deben los clientes.' },
      { k: 'variaciones', v: 'var', t: 'Variaciones', d: 'Variaciones contables mes a mes.' },
      { k: 'activofijo', v: 'af', t: 'Activo fijo', d: 'Los activos y su depreciación.' }] },
    { k: 'adm', t: 'Administración', d: 'El día a día del despacho.', subs: [
      { k: 'notificaciones', v: 'ntf', t: 'Notificaciones', d: 'Avisos para ti y para todos.' },   // las de cada quien y las de todos (29-oct-2026, pedido de Daniel)
      { k: 'cobranza', v: 'cxc', t: 'Cobranza', d: 'Lo cobrado y lo pendiente.' },
      { k: 'cajachica', v: 'caja', t: 'Caja chica', d: 'Gastos menores y sus comprobantes.' },
      { k: 'cotizador', v: 'cot', t: 'Cotizador DECOMSA', d: 'Cotizaciones de DECOMSA.' },
      { k: 'calendario', v: 'cal', t: 'Calendario', d: 'Cumpleaños, aniversarios y eventos.' },   // cumpleaños, aniversarios y eventos: todos lo ven
      { k: 'accesos', v: 'acc', t: 'Accesos', d: 'Quién entró al portal y cuándo.' },   // bitácora de accesos: solo la ve el director
      { k: 'cambios', v: 'chg', t: 'Cambios al portal', d: 'Propuestas de cambios y su autorización.' }] },   // propuestas de Gabo; las autorizan Daniel o Fernando Cadengo
    { k: 'quo', t: 'QUO', d: 'Quo Contabilita: cotizaciones y membresías.', subs: [
      { k: 'quo-cotizador', v: 'quo', q: 'cot', t: 'Cotizador QUO', d: 'Cotizaciones de Quo Contabilita.' },
      { k: 'quo-membresias', v: 'quo', q: 'mem', t: 'Control de membresías', d: 'Membresías y sus pagos.' }] },
    // Lo que se pasa del Access, por etapas (29-oct-2026, pedido de Daniel; Fernando Cadengo dirá cómo acomodarlo)
    { k: 'access', t: 'Access', d: 'Lo que se pasa del Access, por etapas.', subs: [
      { k: 'access-clientes', v: 'axcli', t: 'Clientes', d: 'La base de clientes del Access.' }] }
  ];
  // Una pestaña nueva que todavía no tenga lugar en el menú sale en «Más», para que nunca se pierda
  var MAS = { k: 'mas', t: 'Más', d: 'Pestañas nuevas que todavía no tienen lugar en el menú.', subs: [] };
  var ENT = {};
  MODS.forEach(function (m) { m.subs.forEach(function (s) { s.m = m; ENT[s.k] = s; }); });

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento: no se recuerda */ } }
  };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function svg(d, cls) { return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
  var FLECHA = '<path d="m9 6 6 6-6 6"/>';

  /* Signo PROFASE de un solo color. Los colores de cada pieza salen de --sg1 (la vela), --sg2 (la pieza de en medio)
     y --sg3 (la punta); por omisión, azul marino (blanco en modo oscuro). Las temporadas los cambian solas. */
  var SIGNO = '<polygon class="sg1" points="360,82 413,245 385,363 288,250"/><polygon class="sg2" points="340,311 385,363 242,430 318,337"/>'
    + '<polygon class="sg3" points="98,337 318,337 242,430"/>';
  function signo(cls) { return '<svg class="' + cls + '" viewBox="90 72 334 368" role="img" aria-label="PROFASE">' + SIGNO + '</svg>'; }
  // [mes, día] de inicio y de fin (incluidos); la Navidad cruza el año
  var TEMPORADAS = [
    { k: 'amor', t: 'Amor y amistad', de: [2, 7], a: [2, 14], c: ['#D6336C', '#D6336C', '#D6336C'] },
    { k: 'patrias', t: 'Fiestas patrias', de: [9, 1], a: [9, 16], c: ['#006847', '#FFFFFF', '#CE1126'], borde: true },
    { k: 'muertos', t: 'Halloween y Día de Muertos', de: [10, 15], a: [11, 2], c: ['#F07A1E', '#F07A1E', '#F07A1E'] },
    { k: 'navidad', t: 'Navidad y Año Nuevo', de: [12, 1], a: [1, 6], c: ['#C8102E', '#C8102E', '#C8102E'] }
  ];
  function temporada(f) {
    // ?temporada=navidad en la dirección deja ver otra temporada (para revisar cómo se ve)
    var pide = (location.search.match(/[?&]temporada=([a-z]+)/) || [])[1];
    if (pide) return TEMPORADAS.filter(function (x) { return x.k === pide; })[0] || null;
    var n = (f.getMonth() + 1) * 100 + f.getDate();
    return TEMPORADAS.filter(function (x) {
      var de = x.de[0] * 100 + x.de[1], a = x.a[0] * 100 + x.a[1];
      return de <= a ? n >= de && n <= a : n >= de || n <= a;
    })[0] || null;
  }
  function cssTemporada() {
    var x = temporada(new Date());
    if (!x) return '';
    return ':root,:root[data-theme="dark"]{--sg1:' + x.c[0] + ';--sg2:' + x.c[1] + ';--sg3:' + x.c[2] + '}'
      + (x.borde ? '.pm-signo polygon,.pm-cab svg polygon{stroke:#8A94A6;stroke-width:6;stroke-linejoin:round}' : '');
  }

  var CSS = ':root{--pm-sw:248px;--pm-rail:64px;--pm-top:0px;--sg1:#1F3864;--sg2:#1F3864;--sg3:#1F3864}'
    + ':root[data-theme="dark"]{--sg1:#FFFFFF;--sg2:#FFFFFF;--sg3:#FFFFFF}'
    + '.sg1{fill:var(--sg1)}.sg2{fill:var(--sg2)}.sg3{fill:var(--sg3)}'
    + 'header.band img.logo{display:none!important}.pm-signo{width:30px;height:auto;display:block;flex:none}'
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
    // aviso de una pestaña (data-aviso en su botón; por ahora «Cambios al portal»): número junto al nombre y punto en el módulo
    + '.pm-av{display:inline-block;min-width:19px;margin-left:6px;padding:0 6px;border-radius:999px;background:var(--accent,#F07A1E);color:#fff;font-size:11.5px;font-weight:700;line-height:19px;text-align:center;vertical-align:1px}'
    + '.pm-mb{position:relative}.pm-mod.con-aviso>.pm-mb::after{content:"";position:absolute;left:24px;top:8px;width:8px;height:8px;border-radius:50%;background:var(--accent,#F07A1E);box-shadow:0 0 0 2px var(--navy,#1F3864)}'
    + '.pm-fly{display:none}'
    + '.pm-pie{border-top:1px solid rgba(255,255,255,.12);padding:8px}'
    + '.pm-pie button{width:100%;display:flex;align-items:center;gap:12px;border:0;background:none;color:#A9BBD8;padding:9px 10px;border-radius:8px;cursor:pointer;font-size:13px;white-space:nowrap;text-align:left}'
    + '.pm-pie button:hover{background:rgba(255,255,255,.1);color:#fff}'
    // menú arriba: tira de íconos al centro, debajo del encabezado
    + '.pm-top{display:none}'
    + 'body.pm-arriba .pm-side,body.pm-arriba .pm-ham,body.pm-arriba .pm-scrim{display:none!important}'
    + 'body.pm-arriba .pm-top{display:flex;justify-content:center;position:relative;flex:none;background:var(--surface,#fff);border-bottom:1px solid var(--line,#DCE2EB);padding:8px 12px;z-index:30;font-family:var(--f-body,inherit)}'
    + '.pm-tira{display:flex;align-items:center;gap:4px}.pm-lado{display:flex;gap:4px}'
    + '.pm-tb{position:relative;width:52px;height:52px;border:0;border-radius:14px;background:none;color:var(--navy,#1F3864);display:grid;place-items:center;cursor:pointer;padding:0}'
    + ':root[data-theme="dark"] .pm-tb{color:var(--ink,#E5EAF2)}'
    + '.pm-tb svg{width:28px;height:28px;display:block}'
    + '.pm-tb:hover,.pm-tb[aria-expanded="true"]{background:var(--navy-soft,#E6ECF6)}'
    + '.pm-tb.on{color:var(--accent,#F07A1E)!important;box-shadow:inset 0 -3px 0 var(--accent,#F07A1E)}'
    + '.pm-tb.pm-home{width:60px;height:60px;border-radius:50%;margin:0 10px;background:var(--navy,#1F3864);color:#fff!important;box-shadow:0 4px 14px rgba(19,32,54,.25)}'
    + ':root[data-theme="dark"] .pm-tb.pm-home{background:var(--accent,#F07A1E);color:#0D1320!important}'
    + '.pm-tb.pm-home svg{width:30px;height:30px}.pm-tb.pm-home:hover{filter:brightness(1.12)}'
    + '.pm-tb:focus-visible,.pm-pop a:focus-visible,.pm-pop button:focus-visible{outline:2px solid var(--accent,#F07A1E);outline-offset:2px}'
    + '.pm-tb.con-aviso::after{content:"";position:absolute;right:9px;top:9px;width:9px;height:9px;border-radius:50%;background:var(--accent,#F07A1E);box-shadow:0 0 0 2px var(--surface,#fff)}'
    + '.pm-pop{position:absolute;top:calc(100% + 6px);left:50%;transform:translateX(-50%);width:min(340px,calc(100vw - 24px));box-sizing:border-box;background:var(--surface,#fff);color:var(--ink,#132036);border:1px solid var(--line,#DCE2EB);border-top:3px solid var(--accent,#F07A1E);border-radius:12px;box-shadow:0 16px 40px rgba(10,18,32,.22);padding:14px 14px 10px;text-align:left;max-height:calc(100vh - 140px);overflow:auto}'
    + '.pm-pop[hidden]{display:none}'
    + '.pm-pop h2{margin:0 0 2px;font-size:16px;font-weight:700}.pm-pop>p{margin:0 0 10px;color:var(--muted,#5A6577);font-size:13px}'
    + '.pm-pop ul{list-style:none;margin:0;padding:0;display:grid;gap:2px}'
    + '.pm-pop a{display:block;text-decoration:none;color:var(--ink,#132036);padding:9px 10px;border-radius:8px}'
    + '.pm-pop a:hover{background:var(--navy-soft,#E6ECF6)}'
    + '.pm-pop a b{display:block;font-size:14px;font-weight:600}.pm-pop a span.pm-d{display:block;font-size:12.5px;color:var(--muted,#5A6577)}'
    + '.pm-pop a[aria-current="page"]{box-shadow:inset 3px 0 0 var(--accent,#F07A1E);background:var(--accent-soft,#FDEBDC)}'
    + '.pm-pop .pm-cambia{display:block;width:100%;margin-top:8px;border:0;border-top:1px solid var(--line,#DCE2EB);background:none;color:var(--muted,#5A6577);font:inherit;font-size:12.5px;padding:10px 4px 4px;text-align:left;cursor:pointer;text-decoration:underline;text-underline-offset:2px}'
    + '.pm-pmini svg{transition:transform .18s}'
    + '.pm-scrim{display:none}'
    + '@media (min-width:901px){'
    + 'body.pm{padding-left:var(--pm-sw)!important}body.pm header.band{margin-left:calc(-1 * var(--pm-sw))}'
    + 'body.pm.pm-mini{padding-left:var(--pm-rail)!important}body.pm.pm-mini header.band{margin-left:calc(-1 * var(--pm-rail))}'
    + 'body.pm-mini .pm-side{width:var(--pm-rail)}'
    + 'body.pm-mini .pm-lbl,body.pm-mini .pm-car{display:none}'
    + 'body.pm-mini .pm-mb{justify-content:center;padding:11px 0}'
    + 'body.pm-mini .pm-pie button{justify-content:center}body.pm-mini .pm-pmini svg{transform:rotate(180deg)}'
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
    + '.pm-pie .pm-pmini{display:none}'
    + '}'
    + '@media (max-width:600px){header.band .tag{display:none}.pm-tit h1{font-size:17px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}'   // en el celular el título no se parte a media palabra
    + '@media (min-width:901px){body.pm.pm-arriba{padding-left:0!important}body.pm.pm-arriba header.band{margin-left:0}}'
    + '@media (max-width:420px){.pm-tb{width:46px;height:46px}.pm-tb svg{width:26px;height:26px}.pm-tb.pm-home{width:54px;height:54px;margin:0 6px}}'
    + '@media (prefers-reduced-motion:reduce){.pm-side,.pm-car,.pm-pie svg{transition:none}}';

  var sw, side, lista, hdr, titulo, crumb, top, pendiente = 0, listo = false, quoObs = null, popAbierto = '';

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
    popAbierto = '';
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
      var av = x.subs.some(function (s) { var b = boton(s.v); return b && +b.dataset.aviso > 0; });
      // el módulo de la sección abierta se queda abierto aunque luego se elija otro, hasta que lo cierren
      if (on && abiertos[m.k] !== true) { abiertos[m.k] = true; guarda = true; }
      h += '<div class="pm-mod' + (on ? ' on' : '') + (av ? ' con-aviso' : '') + '" data-m="' + m.k + '" data-open="' + open + '">'
        + '<button type="button" class="pm-mb" aria-expanded="' + open + '" title="' + esc(m.t) + '">' + svg(IC[m.k] || IC.mas, 'pm-ic')
        + '<span class="pm-lbl">' + esc(m.t) + '</span>' + svg(FLECHA, 'pm-car') + '</button>'
        + '<ul class="pm-subs"><li class="pm-fly" aria-hidden="true">' + esc(m.t) + '</li>'
        + x.subs.map(function (s) {
          var n = +((boton(s.v) || {}).dataset || {}).aviso || 0;
          return '<li><a href="#' + esc(s.k) + '" data-k="' + esc(s.k) + '"' + (s === act ? ' aria-current="page"' : '') + '>' + esc(nombre(s))
            + (n > 0 ? '<span class="pm-av" aria-label="' + n + ' pendientes">' + n + '</span>' : '') + '</a></li>';
        }).join('') + '</ul></div>';
    });
    if (guarda) store.set('portal.menu.abiertos', JSON.stringify(abiertos));
    if (lista.innerHTML !== h) lista.innerHTML = h;
    pintaArriba(act);
    if (act) {
      crumb.textContent = act.m.t;
      var t = nombre(act);
      if (titulo.textContent !== t) titulo.textContent = t;
      document.title = t + ' · Portal PROFASE';
      if (listo && location.hash !== '#' + act.k) { try { history.replaceState(null, '', '#' + act.k); } catch (e) { /* sin historial */ } }
    }
  }
  function luego() { if (!pendiente) pendiente = requestAnimationFrame(pinta); }

  // Menú arriba: «Inicio» en medio, la primera mitad de los módulos a la izquierda y el resto a la derecha
  function inicio() { var m = modulos()[0]; return m ? m.subs[0] : null; }
  function pintaArriba(act) {
    if (!top) return;
    var ms = modulos(), mitad = Math.ceil(ms.length / 2), ini = inicio();
    function tb(x) {
      var m = x.m, on = !!act && x.subs.indexOf(act) >= 0, ab = popAbierto === m.k;
      var av = x.subs.some(function (s) { var b = boton(s.v); return b && +b.dataset.aviso > 0; });
      return '<button type="button" class="pm-tb' + (on ? ' on' : '') + (av ? ' con-aviso' : '') + '" data-m="' + m.k + '" aria-expanded="' + ab + '" aria-controls="pm-pop" aria-label="' + esc(m.t) + '" title="' + esc(m.t) + '">' + svg(IC[m.k] || IC.mas, '') + '</button>';
    }
    var h = '<div class="pm-tira"><div class="pm-lado">' + ms.slice(0, mitad).map(tb).join('') + '</div>'
      + '<button type="button" class="pm-tb pm-home" data-m="home" aria-expanded="' + (popAbierto === 'home') + '" aria-controls="pm-pop" aria-label="Inicio" title="Inicio">' + svg(IC.home, '') + '</button>'
      + '<div class="pm-lado">' + ms.slice(mitad).map(tb).join('') + '</div></div>';
    var pop = '';
    var x = popAbierto === 'home' ? null : ms.filter(function (y) { return y.m.k === popAbierto; })[0];
    if (popAbierto === 'home' && ini) {
      pop = '<h2>Inicio</h2><p>Regresa al principio del portal.</p><ul><li><a href="#' + esc(ini.k) + '" data-k="' + esc(ini.k) + '"><b>' + esc(nombre(ini)) + '</b><span class="pm-d">' + esc(ini.d || '') + '</span></a></li></ul>';
    } else if (x) {
      pop = '<h2>' + esc(x.m.t) + '</h2><p>' + esc(x.m.d || '') + '</p><ul>' + x.subs.map(function (s) {
        var n = +((boton(s.v) || {}).dataset || {}).aviso || 0;
        return '<li><a href="#' + esc(s.k) + '" data-k="' + esc(s.k) + '"' + (s === act ? ' aria-current="page"' : '') + '><b>' + esc(nombre(s))
          + (n > 0 ? '<span class="pm-av" aria-label="' + n + ' pendientes">' + n + '</span>' : '') + '</b><span class="pm-d">' + esc(s.d || '') + '</span></a></li>';
      }).join('') + '</ul>';
    }
    if (pop) pop += '<button type="button" class="pm-cambia">Usar el menú de la izquierda</button>';
    h += '<div class="pm-pop" id="pm-pop" role="dialog" aria-label="Opciones del menú"' + (pop ? '' : ' hidden') + '>' + pop + '</div>';
    if (top.innerHTML !== h) top.innerHTML = h;
  }
  function abrePop(k) { popAbierto = k; pintaArriba(activo()); var a = top.querySelector('.pm-pop a'); if (a && k) a.focus(); }
  function arriba(v) {
    if (v !== undefined) store.set('portal.menu.modo', v ? 'arriba' : 'lado');
    var on = store.get('portal.menu.modo') === 'arriba';
    document.body.classList.toggle('pm-arriba', on);
    if (on) abre(false);
    popAbierto = '';
    pinta();
    setTimeout(alto, 50);
  }

  function mini(v) {
    if (v !== undefined) store.set('portal.menu.mini', v ? '1' : '0');
    var on = store.get('portal.menu.mini') === '1';
    document.body.classList.toggle('pm-mini', on);
    var l = side.querySelector('.pm-pmini .pm-lbl');
    if (l) l.textContent = on ? 'Mostrar menú' : 'Ocultar menú';
    side.querySelector('.pm-pmini').setAttribute('aria-label', on ? 'Mostrar menú' : 'Ocultar menú');
    side.querySelector('.pm-parr').setAttribute('aria-label', 'Menú arriba');
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
    st.textContent += cssTemporada();
    if (logo) {
      var tmp = document.createElement('span'); tmp.innerHTML = signo('pm-signo');
      var t = temporada(new Date()), sg = tmp.firstChild;
      if (t) sg.setAttribute('aria-label', 'PROFASE · ' + t.t);
      logo.parentNode.insertBefore(sg, logo);
    }
    side.innerHTML = '<div class="pm-cab">' + signo('') + '<span>PROFASE</span>'
      + '<button type="button" aria-label="Cerrar el menú">' + svg('<path d="M6 6l12 12M18 6 6 18"/>', '') + '</button></div>'
      + '<div class="pm-lista"></div>'
      + '<div class="pm-pie"><button type="button" class="pm-parr">' + svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>', 'pm-ic') + '<span class="pm-lbl">Menú arriba</span></button>'
      + '<button type="button" class="pm-pmini">' + svg('<path d="m11 17-5-5 5-5M18 17l-5-5 5-5"/>', 'pm-ic') + '<span class="pm-lbl">Ocultar menú</span></button></div>';
    document.body.appendChild(side);
    var scrim = document.createElement('div'); scrim.className = 'pm-scrim';
    document.body.appendChild(scrim);
    lista = side.querySelector('.pm-lista');

    ham.onclick = function () { if (movil()) abre(!document.body.classList.contains('pm-abierto')); else mini(store.get('portal.menu.mini') !== '1'); };
    side.querySelector('.pm-pmini').onclick = function () { mini(store.get('portal.menu.mini') !== '1'); };
    side.querySelector('.pm-parr').onclick = function () { arriba(true); };

    top = document.createElement('nav');
    top.className = 'pm-top'; top.setAttribute('aria-label', 'Menú del portal (arriba)');
    hdr.parentNode.insertBefore(top, hdr.nextSibling);
    top.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-k]');
      if (a) { e.preventDefault(); ir(a.dataset.k); return; }
      if (e.target.closest('.pm-cambia')) { arriba(false); return; }
      var b = e.target.closest('.pm-tb');
      if (b) abrePop(popAbierto === b.dataset.m ? '' : b.dataset.m);
    });
    // el ícono picado se vuelve a pintar (ya no está en la página): ese clic no cuenta como «afuera»
    document.addEventListener('click', function (e) { if (popAbierto && e.target.isConnected && !top.contains(e.target)) abrePop(''); });
    side.querySelector('.pm-cab button').onclick = function () { abre(false); };
    scrim.onclick = function () { abre(false); };
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (document.body.classList.contains('pm-abierto')) abre(false);
      if (popAbierto) { var k = popAbierto; abrePop(''); var b = top.querySelector('.pm-tb[data-m="' + k + '"]'); if (b) b.focus(); }
    });

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
    new MutationObserver(luego).observe(sw, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'aria-pressed', 'data-aviso'] });
    function vigilaQuo() {
      var q = document.querySelector('#v-quo .qsw');
      if (q && !quoObs) { quoObs = new MutationObserver(luego); quoObs.observe(q, { subtree: true, attributes: true, attributeFilter: ['aria-pressed'] }); luego(); }
    }
    new MutationObserver(vigilaQuo).observe(document.body, { childList: true });
    vigilaQuo();

    mini();
    arriba();
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
