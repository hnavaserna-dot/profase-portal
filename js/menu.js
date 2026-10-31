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
   - El signo PROFASE es siempre el logo oficial, con sus colores (regla de Daniel, 29-oct-2026). En temporadas se le
     pone al lado un adorno aparte (js/temporada.js: arañita en Halloween y Día de Muertos, Santa en Navidad, corazón el
     14 de febrero, banderita en las fiestas patrias) que nunca tapa ni cambia el signo. Esto reemplazó el «signo de temporada» de un
     solo color de la propuesta #3; el menú de arriba de esa propuesta se quedó igual.
   - Riel de íconos (29-oct-2026, propuesta de Gabriel): en computadora el menú arranca como una tira de íconos grandes
     con su nombre corto e «Inicio» arriba; al picar o pasar el mouse sale la tarjeta del módulo, como en el celular
     (qué es y cada opción con su explicación). En el celular arranca con el menú arriba. Cada quien puede cambiarlo
     («Mostrar menú», «Menú arriba») y su navegador lo recuerda.
   - Submenús siempre completos (pedido de Daniel, 30-oct-2026: «no alcanzo a ver todo el sub menú … siempre se tiene
     que ver bien»): la tarjeta de cada módulo (en el riel y en el menú arriba) sale junto a su ícono y, si no cabe
     hacia abajo, sube lo necesario; si es más alta que la pantalla, sus opciones se deslizan dentro de la tarjeta con
     el título fijo arriba. El riel y el menú se deslizan solos si la pantalla es baja. Los módulos no llevan el
     globito del navegador («title»), que tapaba la tarjeta, y el menú abierto queda encima de los avisos flotantes.
     La prueba es herramientas/pruebas/pantallas/prueba_submenus.py (profase-datos). */
(function () {
  'use strict';
  var ROL = document.documentElement.getAttribute('data-rol') || '';
  if (['director', 'gerente', 'contador'].indexOf(ROL) < 0 || window.top !== window.self) return;

  var IC = {
    wf: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17"/>',
    rep: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    adm: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
    quo: '<circle cx="11.5" cy="11.5" r="7.5"/><path d="m16.5 16.5 4 4"/>',
    ayuda: '<path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.1A8.5 8.5 0 1 1 21 12Z"/><path d="M9.6 9.6a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.1-2.4 3.5"/><path d="M12 16.6h.01"/>',
    access: '<ellipse cx="12" cy="5.5" rx="8" ry="2.8"/><path d="M4 5.5v13c0 1.5 3.6 2.8 8 2.8s8-1.3 8-2.8v-13M4 12c0 1.5 3.6 2.8 8 2.8s8-1.3 8-2.8"/>',
    mas: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    msj: '<path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.1A8.5 8.5 0 1 1 21 12Z"/><path d="M8 10.5h8M8 14h5"/>',
    rh: '<circle cx="9" cy="7" r="3.5"/><path d="M2.5 20v-1.5A4.5 4.5 0 0 1 7 14h4a4.5 4.5 0 0 1 4.5 4.5V20"/><path d="M17 11h5M19.5 8.5v5"/>',
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>'
  };
  // k: lo que va en la dirección; v: el botón de la pestaña (data-view); q: la sub pestaña de QUO
  var MODS = [
    { k: 'wf', t: 'Workflow', d: 'El avance del trabajo de cada cliente y de cada contador.', subs: [
      { k: 'panel', v: 'wf', t: 'Panel', tc: 'Mi panel', d: 'Obligaciones, vencimientos y pausas.' },
      { k: 'workflow-trabajo', v: 'wft', t: 'Panel de trabajo', d: 'Cada actividad con su ficha: estatus, comentarios, documentos y autorización.' },   // etapa 2 del Access (29-oct-2026)
      { k: 'workflow-config', v: 'wfc', t: 'Configuración', d: 'Catálogo de actividades, plantillas y las plantillas de cada cliente.' },   // las pantallas de configuración del Access (30-oct-2026, pedido de Fernando Cadengo)
      { k: 'clientes', v: 'cli', t: 'Clientes', d: 'Cada cliente y su avance.' },
      { k: 'comentarios', v: 'com', t: 'Comentarios', d: 'Las notas del equipo.' }] },
    // Chat interno (30-oct-2026, pedido de Daniel): cada quien ve solo sus conversaciones
    { k: 'msj', t: 'Chat', d: 'Mensajes y archivos con el equipo, 1 a 1 y en grupos.', subs: [
      { k: 'chat', v: 'chat', t: 'Chat interno', d: 'Tus conversaciones; solo las ven quienes están en ellas.' }] },
    { k: 'rep', t: 'Reportes', d: 'Los reportes para revisar los números del despacho.', subs: [
      { k: 'cartera', v: 'car', t: 'Cartera', d: 'Lo que deben los clientes.' },
      { k: 'variaciones', v: 'var', t: 'Variaciones', d: 'Variaciones contables mes a mes.' },
      { k: 'activofijo', v: 'af', t: 'Activo fijo', d: 'Los activos y su depreciación.' }] },
    // SuperConta (29-oct-2026, pedido de Fernando Cadengo; quién lo usa lo decide Daniel): preguntas en palabras sobre la empresa
    { k: 'ayuda', t: 'Ayuda', d: 'SuperConta: pregúntale lo que quieras saber de la empresa.', subs: [
      { k: 'superconta', v: 'sc', t: 'SuperConta', d: 'Pregunta en palabras; contesta con cifras y tablas.' }] },
    { k: 'adm', t: 'Administración', d: 'El día a día del despacho.', subs: [
      { k: 'notificaciones', v: 'ntf', t: 'Notificaciones', d: 'Avisos para ti y para todos.' },   // las de cada quien y las de todos (29-oct-2026, pedido de Daniel)
      { k: 'cobranza', v: 'cxc', t: 'Cobranza', d: 'Lo cobrado y lo pendiente.' },
      { k: 'facturacion', v: 'fac', t: 'Facturación', d: 'Alta y control de facturas.' },   // etapa 5 del Access (29-oct-2026)
      { k: 'pagos', v: 'pag', t: 'Pagos', d: 'Pagos de los clientes y su reparto a facturas.' },   // etapa 5 del Access (29-oct-2026)
      { k: 'base-clientes', v: 'bcli', t: 'Base de clientes', d: 'La ficha de cada cliente: datos, contactos, servicios y precios.' },   // etapa 4 del Access (29-oct-2026)
      { k: 'recordatorios', v: 'rec', t: 'Recordatorios de pago', d: 'Recordatorios de saldos a los clientes.' },   // etapa 5 del Access (29-oct-2026)
      { k: 'comisiones-direccion', v: 'cdir', t: 'Comisiones de dirección', d: 'Facturas con comisión, gastos, reserva y utilidad del periodo.' },   // Access de la dirección (30-oct-2026; solo quien Daniel decidió)
      { k: 'cajachica', v: 'caja', t: 'Caja chica', d: 'Gastos menores y sus comprobantes.' },
      { k: 'cotizador', v: 'cot', t: 'Cotizador DECOMSA', d: 'Cotizaciones de DECOMSA.' },
      { k: 'calendario', v: 'cal', t: 'Calendario', d: 'Cumpleaños, aniversarios y eventos.' },   // cumpleaños, aniversarios y eventos: todos lo ven
      { k: 'accesos', v: 'acc', t: 'Accesos', d: 'Quién entró al portal y cuándo.' },   // bitácora de accesos: solo la ve el director
      { k: 'cambios', v: 'chg', t: 'Cambios al portal', d: 'Propuestas de cambios y su autorización.' }] },   // propuestas de Gabo; las autorizan Daniel o Fernando Cadengo
    // RH (30-oct-2026, pedido de Daniel; lo propuso Alex Luna): solo Alex Luna, HNR y Daniel (y Colaboradores, quien
    // los captura); quién ve cada opción lo decide la base (rh_estado(), portal/sql/72_rh.sql; bloque rh_tab.js)
    { k: 'rh', t: 'RH', d: 'Recursos humanos: vacaciones, permisos, préstamos, colaboradores, eventos, altas y bajas.', subs: [
      { k: 'rh-vacaciones', v: 'rhv', t: 'Vacaciones y permisos', d: 'Quién está fuera y cuántos días le quedan a cada quien.' },
      { k: 'rh-prestamos', v: 'rhp', t: 'Préstamos', d: 'Préstamos al personal, su autorización y sus descuentos.' },
      { k: 'rh-colaboradores', v: 'rhc', t: 'Colaboradores', d: 'Cumpleaños, ingreso y área de cada colaborador.' },
      { k: 'rh-eventos', v: 'rhe', t: 'Eventos PROFASE', d: 'La posada y los festejos del despacho.' },
      { k: 'rh-altas', v: 'rhm', t: 'Altas y bajas', d: 'Ingresos y salidas del personal.' }] },
    { k: 'quo', t: 'QUO', d: 'Quo Contabilita: cotizaciones y membresías.', subs: [
      { k: 'quo-cotizador', v: 'quo', q: 'cot', t: 'Cotizador QUO', d: 'Cotizaciones de Quo Contabilita.' },
      { k: 'quo-membresias', v: 'quo', q: 'mem', t: 'Control de membresías', d: 'Membresías y sus pagos.' }] },
    // Lo que se pasa del Access, por etapas (29-oct-2026, pedido de Daniel; Fernando Cadengo dirá cómo acomodarlo)
    { k: 'access', t: 'Access', d: 'Lo que se pasa del Access, por etapas.', subs: [
      { k: 'access-clientes', v: 'axcli', t: 'Clientes', d: 'La base de clientes del Access.' },
      { k: 'access-wf', v: 'axwf', t: 'WorkFlow', d: 'Cada actividad como en el Access: estatus, bitácora y documentos.' },
      { k: 'access-facturas', v: 'axfac', t: 'Facturas', d: 'Facturas, pagos y recordatorios de pago (dirección y gerentes).' },
      { k: 'access-comisiones', v: 'axcom', t: 'Comisiones', d: 'Comisiones del periodo (dirección y Cadengo).' },
      { k: 'access-tareas', v: 'axtar', t: 'Tareas y proyectos', d: 'Pendientes por grupo con responsables, fechas y avance.' }] }
  ];
  // Una pestaña nueva que todavía no tenga lugar en el menú sale en «Más», para que nunca se pierda
  var MAS = { k: 'mas', t: 'Más', d: 'Pestañas nuevas que todavía no tienen lugar en el menú.', subs: [] };
  var ENT = {};
  MODS.forEach(function (m) { m.subs.forEach(function (s) { s.m = m; ENT[s.k] = s; }); });
  // Inicio (30-oct-2026, pedido de Daniel): la página de tarjetas de cada quien (ini_tab.js). No va dentro de un
  // módulo: es la casita de arriba del menú, y es donde abre el portal cuando la dirección no pide otra sección.
  var INI = { k: 'inicio', v: 'ini', t: 'Inicio', d: 'Lo que necesita tu atención hoy.', m: { k: 'ini', t: 'PROFASE', d: '' } };
  ENT.inicio = INI;

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento: no se recuerda */ } }
  };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function svg(d, cls) { return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
  var FLECHA = '<path d="m9 6 6 6-6 6"/>';

  var CORTO = { wf: 'Workflow', msj: 'Chat', rep: 'Reportes', adm: 'Admin', rh: 'RH', quo: 'QUO', access: 'Access', ayuda: 'Ayuda', mas: 'Más' };
  // Una sombrita arriba o abajo cuando quedan opciones por deslizar (se va sola al llegar a la orilla)
  var SOMBRAS = 'background:linear-gradient(var(--surface,#fff) 30%,transparent) top/100% 28px no-repeat local,'
    + 'linear-gradient(transparent,var(--surface,#fff) 70%) bottom/100% 28px no-repeat local,'
    + 'radial-gradient(farthest-side at 50% 0,rgba(10,18,32,.22),transparent) top/100% 10px no-repeat scroll,'
    + 'radial-gradient(farthest-side at 50% 100%,rgba(10,18,32,.22),transparent) bottom/100% 10px no-repeat scroll';
  var CSS = ':root{--pm-sw:248px;--pm-rail:88px;--pm-top:0px}'
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
    + '.pm-subs{margin:2px 0 6px;padding:0 0 0 22px;display:none}.pm-sl{list-style:none;margin:0;padding:0}'
    + '.pm-mod[data-open="true"] .pm-subs{display:block}'
    + '.pm-subs a{display:block;color:#A9BBD8;text-decoration:none;padding:7px 10px 7px 20px;font-size:13.5px;border-left:2px solid rgba(255,255,255,.14);border-radius:0 7px 7px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    + '.pm-subs a:hover{color:#fff;background:rgba(255,255,255,.1)}'
    + '.pm-subs a[aria-current="page"]{color:#fff;font-weight:700;border-left:3px solid var(--accent,#F07A1E);background:rgba(240,122,30,.18)}'
    // aviso de una pestaña (data-aviso en su botón; por ahora «Cambios al portal»): número junto al nombre y punto en el módulo
    + '.pm-av{display:inline-block;min-width:19px;margin-left:6px;padding:0 6px;border-radius:999px;background:var(--accent,#F07A1E);color:#fff;font-size:11.5px;font-weight:700;line-height:19px;text-align:center;vertical-align:1px}'
    + '.pm-mb{position:relative}.pm-mod.con-aviso>.pm-mb::after{content:"";position:absolute;left:24px;top:8px;width:8px;height:8px;border-radius:50%;background:var(--accent,#F07A1E);box-shadow:0 0 0 2px var(--navy,#1F3864)}'
    + '.pm-fly{display:none}.pm-fd,.pm-sd,.pm-ct{display:none}'
    + '.pm-inicio{margin-bottom:6px}'
    + '.pm-pie{border-top:1px solid rgba(255,255,255,.12);padding:8px}'
    + '.pm-pie button{width:100%;display:flex;align-items:center;gap:12px;border:0;background:none;color:#A9BBD8;padding:9px 10px;border-radius:8px;cursor:pointer;font-size:13px;white-space:nowrap;text-align:left}'
    + '.pm-pie button:hover{background:rgba(255,255,255,.1);color:#fff}'
    // menú arriba: tira de íconos al centro, debajo del encabezado
    + '.pm-top{display:none}'
    + 'body.pm-arriba .pm-side,body.pm-arriba .pm-ham,body.pm-arriba .pm-scrim{display:none!important}'
    + 'body.pm-arriba .pm-top{display:flex;justify-content:center;justify-content:safe center;position:relative;flex:none;background:var(--surface,#fff);border-bottom:1px solid var(--line,#DCE2EB);padding:8px 12px;z-index:30;font-family:var(--f-body,inherit)}'
    // los íconos se encogen un poco si no caben (en el teléfono, con 8 módulos, la tira se salía por los dos lados)
    + '.pm-tira{display:flex;align-items:center;gap:4px;min-width:0;max-width:100%}.pm-lado{display:flex;gap:4px;min-width:0}'
    + '.pm-tb{position:relative;min-width:0;width:52px;height:52px;border:0;border-radius:14px;background:none;color:var(--navy,#1F3864);display:grid;place-items:center;cursor:pointer;padding:0}'
    + ':root[data-theme="dark"] .pm-tb{color:var(--ink,#E5EAF2)}'
    + '.pm-tb svg{width:28px;height:28px;max-width:calc(100% - 4px);display:block}'
    + '.pm-tb:hover,.pm-tb[aria-expanded="true"]{background:var(--navy-soft,#E6ECF6)}'
    + '.pm-tb.on{color:var(--accent,#F07A1E)!important;box-shadow:inset 0 -3px 0 var(--accent,#F07A1E)}'
    + '.pm-tb.pm-home{flex:none;width:60px;height:60px;border-radius:50%;margin:0 10px;background:var(--navy,#1F3864);color:#fff!important;box-shadow:0 4px 14px rgba(19,32,54,.25)}'
    + ':root[data-theme="dark"] .pm-tb.pm-home{background:var(--accent,#F07A1E);color:#0D1320!important}'
    + '.pm-tb.pm-home svg{width:30px;height:30px}.pm-tb.pm-home:hover{filter:brightness(1.12)}'
    + '.pm-tb:focus-visible,.pm-pop a:focus-visible,.pm-pop button:focus-visible{outline:2px solid var(--accent,#F07A1E);outline-offset:2px}'
    + '.pm-tb.con-aviso::after{content:"";position:absolute;right:9px;top:9px;width:9px;height:9px;border-radius:50%;background:var(--accent,#F07A1E);box-shadow:0 0 0 2px var(--surface,#fff)}'
    // la tarjeta del menú arriba: debajo de la tira y siempre completa en la pantalla (popArriba() le da su lugar y su alto)
    + '.pm-pop{position:fixed;top:var(--pm-py,120px);left:50%;transform:translateX(-50%);width:min(340px,calc(100vw - 24px));box-sizing:border-box;' + SOMBRAS + ',var(--surface,#fff);color:var(--ink,#132036);border:1px solid var(--line,#DCE2EB);border-top:3px solid var(--accent,#F07A1E);border-radius:12px;box-shadow:0 16px 40px rgba(10,18,32,.22);padding:14px 14px 10px;text-align:left;max-height:var(--pm-ph,calc(100vh - 16px));overflow:auto;overscroll-behavior:contain}'
    + 'body.pm-arriba .pm-top.pm-con-pop{z-index:85}'   // abierta, encima de los avisos flotantes
    + '.pm-pop[hidden]{display:none}'
    + '.pm-pcab{position:sticky;top:-14px;z-index:1;margin:-14px -14px 10px;padding:12px 14px 10px;background:var(--navy-soft,#E6ECF6);border-bottom:1px solid var(--line,#DCE2EB);border-radius:11px 11px 0 0/9px 9px 0 0}'   // encabezado sombreado (30-oct-2026)
    + '.pm-pop h2{margin:0 0 2px;font-size:16px;font-weight:700}.pm-pcab p{margin:0;color:var(--muted,#5A6577);font-size:13px}'
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
    + 'body:not(.pm-mini) .pm-mod[data-open="true"]>.pm-mb:not(.pm-inicio){background:rgba(255,255,255,.09)}'   // el módulo abierto, sombreado como encabezado de sus opciones
    + 'body.pm-mini .pm-side{width:var(--pm-rail)}'
    + 'body.pm-mini .pm-car{display:none}'
    // el riel se desliza si la pantalla es baja (las tarjetas van aparte, fijas en la pantalla, y no se recortan)
    + 'body.pm-mini .pm-lista{overflow-x:hidden;overflow-y:auto;padding:10px 10px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.3) transparent;overscroll-behavior:contain}'
    + 'body.pm-mini .pm-side:hover,body.pm-mini .pm-side:focus-within,body.pm-mini .pm-side.pm-fly-on{z-index:85}'   // la tarjeta abierta, encima de los avisos flotantes
    + 'body.pm-mini .pm-mod{margin-bottom:6px}'
    + 'body.pm-mini .pm-mb{flex-direction:column;justify-content:center;gap:5px;padding:10px 0 8px;border-radius:14px}'
    + 'body.pm-mini .pm-mb .pm-ic{width:26px;height:26px}'
    + 'body.pm-mini .pm-mb .pm-lbl{flex:none;max-width:100%;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#A9BBD8}'
    + 'body.pm-mini .pm-mb .pm-lbl .pm-lg{display:none}body.pm-mini .pm-mb .pm-lbl .pm-ct{display:inline}'
    + 'body.pm-mini .pm-mod.on>.pm-mb{background:rgba(240,122,30,.18);box-shadow:inset 3px 0 0 var(--accent,#F07A1E)}body.pm-mini .pm-mod.on>.pm-mb .pm-lbl{color:#fff}'
    + 'body.pm-mini .pm-mod.con-aviso>.pm-mb::after{left:auto;right:14px;top:8px}'
    + 'body.pm-mini .pm-inicio{width:52px;height:52px;margin:2px auto 10px;padding:0;border-radius:50%;background:#2C4A80;box-shadow:0 6px 16px rgba(0,0,0,.3)}'
    + 'body.pm-mini .pm-inicio .pm-lbl{display:none}body.pm-mini .pm-inicio:hover{background:#365A99}'
    + 'body.pm-mini .pm-pie button{justify-content:center}body.pm-mini .pm-pie .pm-lbl{display:none}body.pm-mini .pm-pmini svg{transform:rotate(180deg)}'
    // la tarjeta del módulo, igual que la del menú arriba
    // fija en la pantalla: colocaTarjeta() la pone a la altura de su ícono, sin salirse por abajo ni por arriba
    + 'body.pm-mini .pm-subs{display:none!important;position:fixed;left:var(--pm-fx,98px);top:var(--pm-fy,8px);width:348px;max-width:calc(100vw - var(--pm-fx,98px) - 8px);max-height:var(--pm-fh,calc(100vh - 16px));box-sizing:border-box;flex-direction:column;background:var(--surface,#fff);color:var(--ink,#132036);border:1px solid var(--line,#DCE2EB);border-left:3px solid var(--accent,#F07A1E);border-radius:14px;padding:14px 12px 10px;box-shadow:0 18px 44px rgba(10,18,32,.3);margin:0;z-index:31}'
    + 'body.pm-mini .pm-mod:hover .pm-subs,body.pm-mini .pm-mod:focus-within .pm-subs,body.pm-mini .pm-mod.fly .pm-subs{display:flex!important}'
    + 'body.pm-mini .pm-mod.pm-mide .pm-subs{display:flex!important;visibility:hidden!important}'   // solo para medirla
    + 'body.pm-mini .pm-subs::before{content:"";position:absolute;left:-14px;top:0;bottom:0;width:14px}'
    + 'body.pm-mini .pm-sl{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;' + SOMBRAS + '}'   // si no caben, las opciones se deslizan; el título se queda arriba
    // el encabezado de la tarjeta (nombre y qué es) va en una franja sombreada, para que se vea que abajo están sus opciones
    // (pedido de Daniel, 30-oct-2026); en claro, el azul grisáceo de PROFASE; en oscuro, un tono más claro que la tarjeta
    + 'body.pm-mini .pm-fly{display:block;flex:none;margin:-14px -12px 8px;padding:13px 18px 11px;background:var(--navy-soft,#E6ECF6);border-bottom:1px solid var(--line,#DCE2EB);border-radius:11px 13px 0 0/13px 13px 0 0;font-size:15px;font-weight:700;color:var(--ink,#132036);letter-spacing:0;text-transform:none}'
    + 'body.pm-mini .pm-fly .pm-fd{display:block;font-size:12.5px;font-weight:400;color:var(--muted,#5A6577);margin-top:2px}'
    + 'body.pm-mini .pm-subs a{border-left:0;padding:8px 10px;border-radius:9px;color:var(--ink,#132036);white-space:normal;font-weight:600;font-size:13.5px}'
    + 'body.pm-mini .pm-subs a:hover{background:var(--navy-soft,#E6ECF6);color:var(--ink,#132036)}'
    + 'body.pm-mini .pm-subs a .pm-sd{display:block;font-size:12px;font-weight:400;color:var(--muted,#5A6577)}'
    + 'body.pm-mini .pm-subs a[aria-current="page"]{border-left:0;color:var(--ink,#132036);background:var(--accent-soft,#FDEBDC);box-shadow:inset 3px 0 0 var(--accent,#F07A1E)}'
    + '}'
    + '@media (max-width:900px){'
    // abierto, encima de los avisos flotantes (que antes tapaban las últimas opciones); con las orillas del iPhone
    + '.pm-side{top:0;width:min(290px,85vw);box-sizing:border-box;padding-left:env(safe-area-inset-left,0px);transform:translateX(-105%);transition:transform .2s ease;z-index:86;box-shadow:none}'
    + 'body.pm-abierto .pm-side{transform:none;box-shadow:8px 0 30px rgba(0,0,0,.3)}'
    + 'body.pm-abierto .pm-scrim{display:block;position:fixed;inset:0;background:rgba(10,18,32,.45);z-index:85}'
    + '.pm-cab{display:flex;align-items:center;gap:10px;padding:calc(12px + env(safe-area-inset-top,0px)) 10px 10px 16px;border-bottom:1px solid rgba(255,255,255,.12)}'
    + '.pm-pie{padding-bottom:calc(8px + env(safe-area-inset-bottom,0px))}'
    + '.pm-mod[data-open="true"]>.pm-mb:not(.pm-inicio){background:rgba(255,255,255,.09)}'
    + '.pm-cab img{width:30px;height:30px;object-fit:contain;display:block;background:#fff;border-radius:8px;padding:3px;box-sizing:border-box}'
    + '.pm-cab span{flex:1;font-family:Arial,"Helvetica Neue",Helvetica,sans-serif;font-weight:700;letter-spacing:.16em;color:#fff;font-size:15px}'
    + '.pm-cab button{border:0;background:none;color:#fff;width:36px;height:36px;border-radius:8px;cursor:pointer;display:grid;place-items:center}'
    + '.pm-cab button:hover{background:rgba(255,255,255,.1)}.pm-cab svg{width:20px;height:20px;display:block}'
    + '.pm-pie .pm-pmini{display:none}'
    + '}'
    + '@media (max-width:600px){header.band .tag{display:none}.pm-tit h1{font-size:17px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}'   // en el celular el título no se parte a media palabra
    + '@media (min-width:901px){body.pm.pm-arriba{padding-left:0!important}body.pm.pm-arriba header.band{margin-left:0}}'
    + '@media (max-width:420px){.pm-tira,.pm-lado{gap:2px}.pm-tb{width:46px;height:46px}.pm-tb svg{width:26px;height:26px}.pm-tb.pm-home{width:54px;height:54px;margin:0 6px}}'
    + '@media (max-width:370px){.pm-tb{width:44px;height:44px}.pm-tb.pm-home{margin:0 3px}}'   // 360 px: la tira de íconos cabía 3 px de más
    + '@media (prefers-reduced-motion:reduce){.pm-side,.pm-car,.pm-pie svg{transition:none}}';

  var sw, side, lista, hdr, titulo, crumb, top, pendiente = 0, listo = false, quoObs = null, popAbierto = '', popHecho = '', hecho = '', hechoArriba = '', cerrarAlPintar = false;
  // Mientras el recorrido general (bienvenida_tab.js) explica un módulo, su tarjeta se queda abierta aunque el mouse
  // salga del menú o se pique «Siguiente» (ver ensena() y suelta(), abajo)
  var retiene = false;

  function movil() { return matchMedia('(max-width:900px)').matches; }
  function boton(v) { return sw.querySelector('button[data-view="' + v + '"]'); }
  function aLaVista(b) { return !!b && !b.hidden && getComputedStyle(b).display !== 'none'; }
  function subQuo(q) { return document.querySelector('#v-quo .qsw button[data-q="' + q + '"]'); }

  // Qué sub módulos ve esta persona (en el orden del menú), más los botones nuevos que no estén en el menú
  function modulos() {
    var conocidos = { ini: 1 }, out = [];
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
    cierraFly(); cerrarAlPintar = true;   // escogida la opción, su tarjeta se cierra
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
        // sin «title»: el globito del navegador tapaba el nombre y la descripción de la tarjeta (30-oct-2026)
        + '<button type="button" class="pm-mb" aria-expanded="' + open + '" aria-label="' + esc(m.t) + '">' + svg(IC[m.k] || IC.mas, 'pm-ic')
        + '<span class="pm-lbl"><span class="pm-lg">' + esc(m.t) + '</span><span class="pm-ct">' + esc(CORTO[m.k] || m.t) + '</span></span>' + svg(FLECHA, 'pm-car') + '</button>'
        + '<div class="pm-subs"><div class="pm-fly" aria-hidden="true">' + esc(m.t) + '<span class="pm-fd">' + esc(m.d || '') + '</span></div><ul class="pm-sl">'
        + x.subs.map(function (s) {
          var n = +((boton(s.v) || {}).dataset || {}).aviso || 0;
          return '<li><a href="#' + esc(s.k) + '" data-k="' + esc(s.k) + '"' + (s === act ? ' aria-current="page"' : '') + '>' + esc(nombre(s))
            + (n > 0 ? '<span class="pm-av" aria-label="' + n + ' pendientes">' + n + '</span>' : '') + (s.d ? '<span class="pm-sd">' + esc(s.d) + '</span>' : '') + '</a></li>';
        }).join('') + '</ul></div></div>';
    });
    if (h) h = '<div class="pm-mod' + (act === INI ? ' on' : '') + '"><button type="button" class="pm-mb pm-inicio" title="Inicio" aria-label="Inicio"' + (act === INI ? ' aria-current="page"' : '') + '>' + svg(IC.home, 'pm-ic') + '<span class="pm-lbl">Inicio</span></button></div>' + h;
    if (guarda) store.set('portal.menu.abiertos', JSON.stringify(abiertos));
    if (h !== hecho) {
      // Si la tarjeta de un módulo está abierta cuando el menú se vuelve a pintar solo (por ejemplo, porque llegó un
      // mensaje al Chat y cambió su número), se queda abierta y en el mismo lugar; antes se cerraba bajo el mouse.
      // Al escoger una opción sí se cierra (ir() pone cerrarAlPintar).
      var ab = !cerrarAlPintar && enRiel() ? tarjetaAbierta() : null, km = ab && ab.dataset.m;
      var sl = ab && ab.querySelector('.pm-sl'), st = sl ? sl.scrollTop : 0, rs = lista.scrollTop;
      lista.innerHTML = h; hecho = h; sobre = null;
      lista.scrollTop = rs;
      var nm = km ? lista.querySelector('.pm-mod[data-m="' + km + '"]') : null;
      if (nm) {
        nm.classList.add('fly'); side.classList.add('pm-fly-on');
        colocaTarjeta(nm);
        var ns = nm.querySelector('.pm-sl'); if (ns) ns.scrollTop = st;
      } else { side.classList.remove('pm-fly-on'); recoloca(); }
    }
    cerrarAlPintar = false;
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
  function inicio() { if (aLaVista(boton(INI.v))) return INI; var m = modulos()[0]; return m ? m.subs[0] : null; }
  function pintaArriba(act) {
    if (!top) return;
    var ms = modulos(), mitad = Math.ceil(ms.length / 2), ini = inicio();
    // con una tarjeta abierta, sin el globito del navegador (taparía la tarjeta); cerrada, sí, para saber qué es cada ícono
    function tb(x) {
      var m = x.m, on = !!act && x.subs.indexOf(act) >= 0, ab = popAbierto === m.k;
      var av = x.subs.some(function (s) { var b = boton(s.v); return b && +b.dataset.aviso > 0; });
      return '<button type="button" class="pm-tb' + (on ? ' on' : '') + (av ? ' con-aviso' : '') + '" data-m="' + m.k + '" aria-expanded="' + ab + '" aria-controls="pm-pop" aria-label="' + esc(m.t) + '"' + (popAbierto ? '' : ' title="' + esc(m.t) + '"') + '>' + svg(IC[m.k] || IC.mas, '') + '</button>';
    }
    var h = '<div class="pm-tira"><div class="pm-lado">' + ms.slice(0, mitad).map(tb).join('') + '</div>'
      + '<button type="button" class="pm-tb pm-home' + (act === INI ? ' on' : '') + '" data-m="home" aria-expanded="' + (popAbierto === 'home') + '" aria-controls="pm-pop" aria-label="Inicio"' + (popAbierto ? '' : ' title="Inicio"') + '>' + svg(IC.home, '') + '</button>'
      + '<div class="pm-lado">' + ms.slice(mitad).map(tb).join('') + '</div></div>';
    var pop = '';
    var x = popAbierto === 'home' ? null : ms.filter(function (y) { return y.m.k === popAbierto; })[0];
    if (popAbierto === 'home' && ini) {
      pop = '<div class="pm-pcab"><h2>Inicio</h2><p>Regresa al principio del portal.</p></div><ul><li><a href="#' + esc(ini.k) + '" data-k="' + esc(ini.k) + '"><b>' + esc(nombre(ini)) + '</b><span class="pm-d">' + esc(ini.d || '') + '</span></a></li></ul>';
    } else if (x) {
      pop = '<div class="pm-pcab"><h2>' + esc(x.m.t) + '</h2><p>' + esc(x.m.d || '') + '</p></div><ul>' + x.subs.map(function (s) {
        var n = +((boton(s.v) || {}).dataset || {}).aviso || 0;
        return '<li><a href="#' + esc(s.k) + '" data-k="' + esc(s.k) + '"' + (s === act ? ' aria-current="page"' : '') + '><b>' + esc(nombre(s))
          + (n > 0 ? '<span class="pm-av" aria-label="' + n + ' pendientes">' + n + '</span>' : '') + '</b><span class="pm-d">' + esc(s.d || '') + '</span></a></li>';
      }).join('') + '</ul>';
    }
    if (pop) pop += '<button type="button" class="pm-cambia">Usar el menú de la izquierda</button>';
    h += '<div class="pm-pop" id="pm-pop" role="dialog" aria-label="Opciones del menú"' + (pop ? '' : ' hidden') + '>' + pop + '</div>';
    if (h !== hechoArriba) {
      // la misma tarjeta abierta que se vuelve a pintar sola conserva hasta dónde se deslizó
      var p0 = top.querySelector('.pm-pop'), st = p0 && popHecho === popAbierto ? p0.scrollTop : 0;
      top.innerHTML = h; hechoArriba = h;
      var p1 = top.querySelector('.pm-pop'); if (p1 && st) p1.scrollTop = st;
    }
    popHecho = popAbierto;
    top.classList.toggle('pm-con-pop', !!pop);
    if (pop) popArriba();
  }

  // Submenús siempre completos en la pantalla (pedido de Daniel, 30-oct-2026). Los lugares van en variables del riel
  // (--pm-fx, --pm-fy, --pm-fh) y de la tira de arriba (--pm-py, --pm-ph), fuera de lo que se vuelve a pintar.
  var MARGEN = 8, sobre = null;
  function altoPantalla() { return window.innerHeight || document.documentElement.clientHeight; }
  function enRiel() { var c = document.body.classList; return c.contains('pm-mini') && !c.contains('pm-arriba') && !movil(); }
  // La tarjeta del módulo en el riel: a la altura de su ícono; si no cabe hacia abajo, sube lo necesario; si es más
  // alta que la pantalla, ocupa la pantalla y sus opciones se deslizan dentro (el título se queda arriba).
  function colocaTarjeta(mod) {
    if (!mod || !side || !enRiel()) return;
    var t = mod.querySelector('.pm-subs'), b = mod.querySelector('.pm-mb');
    if (!t || !b) return;
    var rb = b.getBoundingClientRect(), H = altoPantalla();
    side.style.setProperty('--pm-fx', Math.round(rb.right + 10) + 'px');
    side.style.setProperty('--pm-fh', Math.max(120, H - 2 * MARGEN) + 'px');
    mod.classList.add('pm-mide');
    var h = t.offsetHeight;
    mod.classList.remove('pm-mide');
    side.style.setProperty('--pm-fy', Math.round(Math.max(MARGEN, Math.min(rb.top - 6, H - MARGEN - h))) + 'px');
  }
  function tarjetaAbierta() {
    if (!lista) return null;
    try { return lista.querySelector('.pm-mod.fly') || lista.querySelector('.pm-mod:hover') || lista.querySelector('.pm-mod:focus-within'); } catch (e) { return null; }
  }
  function recoloca() { var m = tarjetaAbierta(); if (m) colocaTarjeta(m); }
  function cierraFly(salvo) {
    if (!lista) return;
    lista.querySelectorAll('.pm-mod.fly').forEach(function (m) { if (m !== salvo) m.classList.remove('fly'); });
    side.classList.toggle('pm-fly-on', !!lista.querySelector('.pm-mod.fly'));
  }
  // La tarjeta del menú arriba: debajo de la tira; si no cabe, sube lo necesario (puede tapar la tira, como una
  // ventana) y, si es más alta que la pantalla, se desliza por dentro
  function popArriba() {
    if (!top) return;
    var p = top.querySelector('.pm-pop');
    if (!p || p.hidden) return;
    var H = altoPantalla();
    top.style.setProperty('--pm-ph', Math.max(120, H - 2 * MARGEN) + 'px');
    var y = top.getBoundingClientRect().bottom + 6, h = p.offsetHeight;
    top.style.setProperty('--pm-py', Math.round(Math.max(MARGEN, Math.min(y, H - MARGEN - h))) + 'px');
  }
  function abrePop(k) { popAbierto = k; if (k) avisaMenu('pm-pop'); pintaArriba(activo()); var a = top.querySelector('.pm-pop a'); if (a && k) a.focus(); }
  // Un solo menú abierto a la vez (regla de Daniel, 30-oct-2026: «que no se entrelapen»): al abrir la tarjeta del menú
  // arriba, la del riel o el ☰ del celular se avisa (js/portal.js, PORTAL.abreMenu) y se cierran los demás menús
  function avisaMenu(q) { try { if (window.PORTAL && window.PORTAL.abreMenu) window.PORTAL.abreMenu(q); } catch (e) { /* sin aviso */ } }
  function arriba(v) {
    if (v !== undefined) store.set('portal.menu.modo', v ? 'arriba' : 'lado');
    var m = store.get('portal.menu.modo');
    var on = m ? m === 'arriba' : movil();   // sin escoger: en el celular, arriba; en computadora, el riel
    document.body.classList.toggle('pm-arriba', on);
    if (on) abre(false);
    popAbierto = '';
    pinta();
    setTimeout(alto, 50);
  }

  function estaMini() { return store.get('portal.menu.mini') !== '0'; }   // sin escoger: el riel de íconos
  function mini(v) {
    if (v !== undefined) store.set('portal.menu.mini', v ? '1' : '0');
    var on = estaMini();
    document.body.classList.toggle('pm-mini', on);
    var l = side.querySelector('.pm-pmini .pm-lbl');
    if (l) l.textContent = on ? 'Mostrar menú' : 'Ocultar menú';
    side.querySelector('.pm-pmini').setAttribute('aria-label', on ? 'Mostrar menú' : 'Ocultar menú');
    side.querySelector('.pm-parr').setAttribute('aria-label', 'Menú arriba');
    setTimeout(alto, 200);
  }
  function abre(v) { document.body.classList.toggle('pm-abierto', v); if (v) avisaMenu('pm-cajon'); }
  // En computadora el menú empieza justo abajo del encabezado
  function alto() {
    var r = hdr.getBoundingClientRect();
    document.documentElement.style.setProperty('--pm-top', Math.max(0, r.bottom) + 'px');
    recoloca(); popArriba();   // si el encabezado cambia de alto, las tarjetas abiertas se vuelven a acomodar
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
      + '<div class="pm-pie"><button type="button" class="pm-parr">' + svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>', 'pm-ic') + '<span class="pm-lbl">Menú arriba</span></button>'
      + '<button type="button" class="pm-pmini">' + svg('<path d="m11 17-5-5 5-5M18 17l-5-5 5-5"/>', 'pm-ic') + '<span class="pm-lbl">Ocultar menú</span></button></div>';
    document.body.appendChild(side);
    var scrim = document.createElement('div'); scrim.className = 'pm-scrim';
    document.body.appendChild(scrim);
    lista = side.querySelector('.pm-lista');

    ham.onclick = function () { if (movil()) abre(!document.body.classList.contains('pm-abierto')); else mini(!estaMini()); };
    side.querySelector('.pm-pmini').onclick = function () { mini(!estaMini()); };
    side.querySelector('.pm-parr').onclick = function () { arriba(true); };

    top = document.createElement('nav');
    top.className = 'pm-top'; top.setAttribute('aria-label', 'Menú del portal (arriba)');
    hdr.parentNode.insertBefore(top, hdr.nextSibling);
    top.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-k]');
      if (a) { e.preventDefault(); ir(a.dataset.k); return; }
      if (e.target.closest('.pm-cambia')) { arriba(false); return; }
      var b = e.target.closest('.pm-tb');
      if (b && b.dataset.m === 'home' && inicio() === INI) { abrePop(''); ir(INI.k); return; }
      if (b) abrePop(popAbierto === b.dataset.m ? '' : b.dataset.m);
    });
    // el ícono picado se vuelve a pintar (ya no está en la página): ese clic no cuenta como «afuera»
    document.addEventListener('click', function (e) { if (popAbierto && !retiene && e.target.isConnected && !top.contains(e.target)) abrePop(''); });
    side.querySelector('.pm-cab button').onclick = function () { abre(false); };
    if (window.PROFASE_TEMPORADA) window.PROFASE_TEMPORADA.pon(logo);   // js/temporada.js
    scrim.onclick = function () { abre(false); };
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (document.body.classList.contains('pm-abierto')) abre(false);
      if (popAbierto) { var k = popAbierto; abrePop(''); var b = top.querySelector('.pm-tb[data-m="' + k + '"]'); if (b) b.focus(); }
    });

    lista.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-k]');
      if (a) { e.preventDefault(); ir(a.dataset.k); return; }
      if (e.target.closest('.pm-inicio')) { var ini = inicio(); if (ini) ir(ini.k); return; }
      var mb = e.target.closest('.pm-mb');
      if (!mb) return;
      var mod = mb.parentNode;
      if (enRiel()) {
        // en el riel, picar el ícono deja fija su tarjeta (en tableta no hay mouse); solo una a la vez
        var ya = mod.classList.contains('fly');
        cierraFly();
        if (!ya) { mod.classList.add('fly'); side.classList.add('pm-fly-on'); colocaTarjeta(mod); avisaMenu('pm-fly'); } else mb.blur();
        return;
      }
      var o = mod.dataset.open !== 'true';
      mod.dataset.open = o; mb.setAttribute('aria-expanded', o);
      var ab = {};
      try { ab = JSON.parse(store.get('portal.menu.abiertos') || '{}') || {}; } catch (er) { ab = {}; }
      ab[mod.dataset.m] = o; store.set('portal.menu.abiertos', JSON.stringify(ab));
    });
    lista.addEventListener('mouseleave', function () { sobre = null; if (!retiene) cierraFly(); });
    // al llegar a otro ícono del riel, su tarjeta se acomoda dentro de la pantalla y se cierran las demás
    lista.addEventListener('mouseover', function (e) {
      var m = e.target.closest('.pm-mod');
      if (!m || m === sobre) return;
      sobre = m;
      cierraFly(m);
      var f = document.activeElement;
      if (f && f !== document.body && lista.contains(f) && !m.contains(f) && enRiel()) f.blur();
      colocaTarjeta(m);
    });
    lista.addEventListener('focusin', function (e) { colocaTarjeta(e.target.closest('.pm-mod')); });
    lista.addEventListener('scroll', recoloca, { passive: true });
    document.addEventListener('click', function (e) { if (!retiene && e.target.isConnected && !side.contains(e.target)) cierraFly(); });
    // si se abre otro menú (el de la foto, la campanita, los filtros…) o se toca dentro de una pestaña, se cierran los del menú
    document.addEventListener('profase-menu', function (e) {
      if (retiene) return;   // el recorrido general deja abierta la tarjeta que está enseñando
      var q = e.detail;
      if (q !== 'pm-pop' && popAbierto) abrePop('');
      if (q !== 'pm-fly' && lista.querySelector('.pm-mod.fly')) cierraFly();
      if (q !== 'pm-cajon' && document.body.classList.contains('pm-abierto')) abre(false);
    });

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
    addEventListener('resize', function () { alto(); if (!movil()) abre(false); recoloca(); popArriba(); });
    addEventListener('scroll', alto, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(alto).observe(hdr);
    addEventListener('hashchange', function () { var k = location.hash.slice(1); var a = activo(); if (k && (!a || a.k !== k)) ir(k); });

    // Abre la sección de la dirección (#cartera…) en cuanto su pestaña esté a la vista; algunas esperan a la base
    var pedida = location.hash.slice(1), t0 = Date.now();
    // Al entrar al portal (la entrada deja la marca «portal.entrada») o sin sección pedida, todos ven primero su Inicio
    // (regla de Daniel, 30-oct-2026: «siempre que ingreses sesión veas el home, todos»). Al recargar o con una liga a una
    // sección, se queda en esa. Un aviso del chat (?chat=…) lo abre chat_tab.js.
    var entrada = false;
    try { entrada = sessionStorage.getItem('portal.entrada') === '1'; sessionStorage.removeItem('portal.entrada'); } catch (e) { entrada = false; }
    if ((entrada || !ENT[pedida]) && !/[?&]chat=/.test(location.search) && aLaVista(boton(INI.v))) pedida = INI.k;
    pinta();
    if (!pedida || !(ENT[pedida])) { listo = true; pinta(); return; }
    (function intenta() {
      if (listo) return;
      if (ir(pedida)) return;
      if (Date.now() - t0 > 12000) { listo = true; pinta(); return; }
      setTimeout(intenta, 250);
    })();
  }
  // Recorrido general del portal (bienvenida_tab.js; Daniel, 30-oct-2026: «hagas un recorrido de todo a cada usuario para
  // que sepan»): qué módulos y opciones ve esta persona, y abrir la tarjeta de un módulo donde esté su menú (riel, menú
  // completo, menú arriba o ☰ del celular) para iluminarla. No cambia de pantalla ni de sección.
  function datosModulos() {
    return modulos().map(function (x) {
      return { k: x.m.k, t: x.m.t, d: x.m.d || '', subs: x.subs.map(function (s) { return { k: s.k, t: nombre(s), d: s.d || '' }; }) };
    });
  }
  function ensena(k) {
    if (!sw || !lista) return null;
    retiene = true;
    if (document.body.classList.contains('pm-arriba')) {
      abrePop(k);
      var p = top.querySelector('.pm-pop');
      return p && !p.hidden ? p : null;
    }
    var m = lista.querySelector('.pm-mod[data-m="' + k + '"]');
    if (!m) return null;
    if (enRiel()) {
      cierraFly();
      m.classList.add('fly'); side.classList.add('pm-fly-on');
      colocaTarjeta(m);
      avisaMenu('pm-fly');
      return m.querySelector('.pm-subs');
    }
    if (movil()) abre(true);
    m.dataset.open = 'true';
    var mb = m.querySelector('.pm-mb'); if (mb) mb.setAttribute('aria-expanded', 'true');
    try { m.scrollIntoView({ block: 'nearest' }); } catch (e) { /* se queda donde está */ }
    return m;
  }
  function suelta() {
    retiene = false;
    if (!sw || !lista) return;
    cierraFly();
    if (popAbierto) abrePop('');
    if (movil()) abre(false);
    pinta();
  }
  window.PORTAL_MENU = {
    ir: function (k) { return !!sw && ir(k); },
    ve: function (k) { var s = ENT[k]; return !!(sw && s && aLaVista(boton(s.v)) && (!s.q || subQuo(s.q))); },
    modulos: function () { return sw ? datosModulos() : []; },
    ensena: ensena,
    suelta: suelta
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arranca);
  else arranca();
})();
