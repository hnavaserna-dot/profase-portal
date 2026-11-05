/* Portal PROFASE · la ventana de seguimiento de los reportes (4-nov-2026, pedido de Fernando Cadengo: «hay que unificar una
   sola pantalla para comentarios y seguimiento»; «que los estatus sean los mismos que ya definimos en variaciones»; «el
   estatus sin revisión hay que quitarlo de las opciones… simplemente todo lo nuevo así debe de empezar»).
   Una sola pieza para Reportes › Variaciones, Activo fijo y Cartera: la misma ventana, los mismos 5 estatus con las mismas
   reglas y la misma plática (cada comentario aparte con quién y la hora; el propio se corrige o borra en los primeros 10
   minutos). Arriba el resumen y el estatus actual; las pastillas; lo propio de cada reporte («despues», como «¿Cuenta en el
   reporte?» de la Cartera); la plática; y abajo, plegados, el detalle y el historial. Pie: Cerrar · Guardar · Guardar y
   siguiente ›, y arriba ‹ › con «N de M».
   La pieza no habla con la base: cada página le da sus datos y lo que hace al guardar (guarda, corrige, borra); quién ve y
   quién cambia qué lo decide la base de cada reporte (218 y 230 en portal/sql). «Sin revisión» no es una opción: así empieza
   todo y nadie regresa algo ahí (la base tampoco lo deja).

   var v = PROFASE_SEG.abre({
     host: elemento,                 // opcional: dónde se pinta (si no, una capa propia)
     kick: 'Hallazgo #12', titulo: 'Seguimiento de revisión',
     nav: {pos: 3, total: 27, donde: 'en tu lista', ant: true, sig: true, ir: function (dir) {…}},   // opcional
     nota: 'texto',                  // opcional: aviso naranja arriba
     antes: '<html>',                // opcional: antes del resumen
     resumen: '<html>',              // lo de adentro del recuadro de arriba (PROFASE_SEG.chip() para el estatus)
     queHacer: '<html>',             // opcional (5-nov-2026): qué revisar y qué estatus poner, en palabras, bajo el resumen
     estatus: {actual: 'consulta', puede: true, gc: false, titulo: 'Estatus de revisión', ayudaPie: 'texto',
               nota: function (actual, puede) { return 'texto bajo las pastillas'; }} ,   // o null: sin estatus
     despues: nodo o '<html>',       // opcional: lo propio del reporte, bajo las pastillas
     platica: {hilo: [...], puede: true, yo: 'uuid', ph: 'texto', noPuede: 'texto', nombre: function (por) {…}},
     detalles: '<html>',             // opcional: <details class="det">…
     sinGuardar: 'texto',            // opcional: si no se puede guardar desde esta vista
     guarda: async function ({estatus, de, texto}) { return true || 'por qué no'; },
     corrige: async function (cid, texto) {…}, borra: async function (cid) {…},   // true o el porqué
     hiloDe: function () { return [...]; },   // la plática de hoy, después de corregir o borrar
     alGuardar: function () {…}, alCambiar: function () {…}, alCerrar: function () {…},
     enlaza: function (scrim) {…}    // para lo propio de la página (botones de «antes», «despues» o «detalles»)
   });
   Cada comentario: {id, por, porNombre, ts (a la vista), tsISO, texto, editado, de, est, legado}.
   v.cerrar(); v.scrim; v.pie('texto'). */
(function () {
  'use strict';
  if (window.PROFASE_SEG) return;

  var ESTATUS = [
    {id: 'sin_respuesta', t: 'Sin revisión', inicial: true},
    {id: 'consulta', t: 'Consulta con el Cliente'},
    {id: 'pend_aprob', t: 'Consulta con Gerencia'},
    {id: 'modif_quo', t: 'Modificación QUO', quo: true},
    {id: 'justificado', t: 'Justificado', cierra: true},
    {id: 'resuelto', t: 'Modificación Exitosa', cierra: true}
  ];
  var AYUDA = [
    ['Sin revisión', 'Así empieza todo: nadie lo ha revisado. No se escoge y nada regresa ahí; si alguien se equivoca de estatus, lo cambia al correcto.'],
    ['Consulta con el Cliente', 'Se revisó y la explicación depende del cliente: se le pidió información o soporte y se espera su respuesta.'],
    ['Consulta con Gerencia', 'Se revisó y falta algo para cerrarlo: se consultó a la Gerencia Contable (le llega el aviso) y se espera su respuesta.'],
    ['Modificación QUO', 'Hay que corregirlo en QUO y la corrección está en proceso. De aquí solo se pasa a Modificación Exitosa o a Consulta con Gerencia.'],
    ['Justificado', 'Está bien como está: tiene explicación y soporte y no hay nada que corregir. Cuenta como revisado.'],
    ['Modificación Exitosa', 'Era un error de registro y ya se corrigió en QUO. Cuenta como revisado. El contador la pone después de Modificación QUO; ya en Modificación Exitosa, solo la Gerencia Contable la cambia.']
  ];
  var MSJ = {
    quo: 'Desde Modificación QUO solo se pasa a Modificación Exitosa o a Consulta con Gerencia',
    exito: 'Modificación Exitosa se pone cuando está en Modificación QUO; si no, la pone la Gerencia Contable',
    fijo: 'Lo que está en Modificación Exitosa solo lo cambia la Gerencia Contable',
    inicial: '«Sin revisión» no se escoge: así empieza todo'
  };
  var MIN = 10;   // var_com_minutos() de la base: el propio se corrige o borra en los primeros 10 minutos

  function de(id) { for (var i = 0; i < ESTATUS.length; i++) if (ESTATUS[i].id === id) return ESTATUS[i]; return ESTATUS[0]; }
  function t(id) { return de(id).t; }
  function cierra(id) { return !!de(id).cierra; }
  function cls(id) { return id === 'modif_quo' ? ' quo' : (!id || id === 'sin_respuesta') ? ' sin' : (cierra(id) ? ' ok' : ''); }
  /* la regla de cada cambio (la misma de la base: rep_est_regla de 230); null si se puede */
  function regla(antes, nuevo, gc) {
    antes = antes || 'sin_respuesta';
    if (antes === nuevo) return null;
    if (nuevo === 'sin_respuesta') return MSJ.inicial;
    if (!gc && antes === 'resuelto') return MSJ.fijo;
    if (antes === 'modif_quo' && nuevo !== 'resuelto' && nuevo !== 'pend_aprob') return MSJ.quo;
    if (!gc && nuevo === 'resuelto' && antes !== 'modif_quo') return MSJ.exito;
    return null;
  }
  function opciones() { return ESTATUS.filter(function (e) { return !e.inicial; }); }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c];
    });
  }
  function iniciales(n) {
    return String(n || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(function (x) { return x[0]; }).join('').toUpperCase() || '?';
  }
  function chip(id, txt) { return '<span class="seg-act' + cls(id) + '"><i></i>' + esc(txt || t(id)) + '</span>'; }
  function pill(id, txt) { cssUnaVez(); return '<span class="sg-pill' + cls(id) + '">' + esc(txt || t(id)) + '</span>'; }

  var FOTOS = {};
  /* las fotos de perfil, las mismas de todo el portal (PORTAL.fotosDe); si no hay, se quedan las iniciales */
  function ponFotos(raiz) {
    var P = window.PORTAL; if (!P || typeof P.fotosDe !== 'function' || !raiz) return;
    var avs = [].slice.call(raiz.querySelectorAll('.seg-av[data-av]'));
    var ids = avs.map(function (a) { return a.getAttribute('data-av'); }).filter(function (x, i, l) { return x && l.indexOf(x) === i; });
    function pinta() {
      avs.forEach(function (a) {
        var u = FOTOS[a.getAttribute('data-av')];
        if (u && !a.querySelector('img')) { var im = document.createElement('img'); im.alt = ''; im.src = u; im.onerror = function () { im.remove(); }; a.appendChild(im); }
      });
    }
    pinta();
    var faltan = ids.filter(function (id) { return !(id in FOTOS); }); if (!faltan.length) return;
    P.fotosDe(faltan).then(function (m) { faltan.forEach(function (id) { FOTOS[id] = (m && m[id]) || ''; }); pinta(); }).catch(function () {});
  }
  function quedaMin(c, yo) {
    if (!c || c.legado || !yo || c.por !== yo || !c.tsISO) return 0;
    var m = MIN - (Date.now() - new Date(c.tsISO).getTime()) / 60000; return m > 0 ? Math.ceil(m) : 0;
  }
  var NUM = new Intl.NumberFormat('es-MX');
  function hiloHTML(h, pl, todos) {
    if (!h.length) return '<p class="sg-hint">Todavía no hay comentarios.</p>';
    var ver = todos || h.length <= 3 ? h : h.slice(-3), ocultos = h.length - ver.length;
    var nombre = pl.nombre || function (p) { return p || ''; };
    return (ocultos ? '<button type="button" class="seg-mas" data-todos>Ver ' + (ocultos === 1 ? 'el anterior' : 'los ' + NUM.format(ocultos) + ' anteriores') + '</button>' : '')
      + '<div class="seg-hilo">' + ver.map(function (c) {
        var yo = !!pl.yo && c.por === pl.yo && !c.legado, q = quedaMin(c, pl.yo);
        var nom = yo ? 'Tú' : (c.porNombre || nombre(c.por));
        var cambio = c.de && c.est && c.de !== c.est
          ? '<span class="seg-mini' + cls(c.est) + '" title="Cambió el estatus de «' + esc(t(c.de)) + '» a «' + esc(t(c.est)) + '»">→ ' + esc(t(c.est)) + '</span>' : '';
        return '<div class="seg-c" data-cid="' + esc(c.id) + '">'
          + '<span class="seg-av" data-av="' + esc(c.por || '') + '" aria-hidden="true">' + esc(iniciales(c.porNombre || nombre(c.por))) + '</span>'
          + '<div class="seg-bur' + (yo ? ' yo' : '') + '">'
          + '<div class="seg-cab"><b>' + esc(nom) + '</b>' + (c.ts ? '<span class="h">' + esc(c.ts) + '</span>' : '')
          + (c.editado ? '<span class="h">· corregido</span>' : '') + cambio + '</div>'
          + '<p class="seg-tx">' + esc(c.texto || '') + '</p>'
          + (q ? '<div class="seg-ed"><button type="button" class="lnk" data-corr>Corregir</button><button type="button" class="lnk" data-borr>Borrar</button>'
            + '<span>' + (q === 1 ? 'queda 1 min' : 'quedan ' + q + ' min') + '</span></div>' : '')
          + '</div></div>';
      }).join('') + '</div>';
  }

  var X = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var OK = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7"/></svg>';

  /* los colores son los de la pieza (PROFASE: azul #1F3864 y naranja #F07A1E), en claro y en oscuro: la ventana se ve igual en
     los tres reportes, aunque cada página tenga los suyos */
  var TOK = '--sg-sf:#ffffff;--sg-sf2:#f5f7fa;--sg-sf3:#eef1f5;--sg-ln:#dde3ea;--sg-ln2:#c9d2dd;--sg-ink:#131f2d;--sg-ink2:#3d4c5e;'
    + '--sg-ink3:#617285;--sg-ink4:#7f8d9e;--sg-ac:#1F3864;--sg-ac2:#2a5aa6;--sg-acs:#e6ecf6;--sg-na:#F07A1E;--sg-na2:#b85509;'
    + '--sg-nas:#fdf0e6;--sg-nab:rgba(240,122,30,.38);--sg-quo:#0b7480;--sg-quos:#e2f3f5;--sg-ok:#1b7a52;--sg-oks:#e1f2ea;'
    + '--sg-scrim:rgba(12,22,34,.55);--sg-sh:0 30px 60px -24px rgba(12,22,34,.45);';
  var TOK_OSC = '--sg-sf:#16202b;--sg-sf2:#1c2733;--sg-sf3:#223040;--sg-ln:#2c3b4c;--sg-ln2:#3a4b5e;--sg-ink:#e8eef4;--sg-ink2:#b3c1cf;'
    + '--sg-ink3:#8c9cad;--sg-ink4:#6f8092;--sg-ac:#3d7fd0;--sg-ac2:#7fb2ee;--sg-acs:#1d2c44;--sg-na:#ff9247;--sg-na2:#ffae74;'
    + '--sg-nas:rgba(255,146,71,.13);--sg-nab:rgba(255,146,71,.42);--sg-quo:#34d6ec;--sg-quos:rgba(52,214,236,.13);--sg-ok:#4fc28c;--sg-oks:rgba(79,194,140,.13);'
    + '--sg-scrim:rgba(2,8,14,.74);--sg-sh:0 30px 60px -20px rgba(0,0,0,.7);';
  var CSS = ''
    + '.segv,.sg-pill{' + TOK + '}'
    + ':root[data-theme="dark"] .segv,:root[data-theme="dark"] .sg-pill{' + TOK_OSC + '}'
    + '.segv{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;padding:16px;background:var(--sg-scrim);'
    + 'color:var(--sg-ink);font-size:14px;line-height:1.4;text-align:left}'
    + '.segv *{box-sizing:border-box}'
    + '.segv [hidden]{display:none!important}'
    + '.sg-modal{width:100%;max-width:760px;max-height:88vh;display:flex;flex-direction:column;overflow:hidden;border-radius:16px;'
    + 'border:1px solid var(--sg-ln2);background:var(--sg-sf);box-shadow:var(--sg-sh);animation:sgpop .18s cubic-bezier(.2,.9,.3,1.2)}'
    + '@keyframes sgpop{from{opacity:0;transform:translateY(10px) scale(.985)}to{opacity:1;transform:none}}'
    + '@media (prefers-reduced-motion:reduce){.sg-modal{animation:none}}'
    + '.sg-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;border-bottom:1px solid var(--sg-ln);padding:16px 22px}'
    + '.sg-head .kick{margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--sg-na2)}'
    + '.sg-head h2{margin:0;font-size:19px;font-weight:600;letter-spacing:-.015em;color:var(--sg-ink)}'
    + '.sg-nav{display:flex;align-items:center;gap:6px;flex:none}'
    + '.sg-x{display:grid;place-items:center;height:36px;width:36px;flex:none;border:0;border-radius:10px;background:none;color:var(--sg-ink2);cursor:pointer;font:inherit}'
    + '.sg-x:hover{background:var(--sg-sf3);color:var(--sg-ink)}'
    + '.sg-x.seg-fl{border:1px solid var(--sg-ln2);font-size:20px;line-height:1}'
    + '.sg-x.seg-fl[disabled]{opacity:.35;cursor:not-allowed;background:none}'
    + '.sg-body{padding:20px 22px;overflow-y:auto;overscroll-behavior:contain}'
    + '.sg-foot{display:flex;align-items:center;justify-content:space-between;gap:10px 12px;flex-wrap:wrap;border-top:1px solid var(--sg-ln);background:var(--sg-sf2);padding:12px 22px}'
    + '.sg-acts{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}'
    + '.sg-b1,.sg-b2{display:inline-flex;align-items:center;gap:8px;border-radius:10px;padding:9px 14px;font:inherit;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;min-height:38px}'
    + '.sg-b1{border:1px solid var(--sg-ac);background:var(--sg-ac);color:#fff}'
    + '.sg-b1:hover{filter:brightness(1.1)}'
    + '.sg-b2{border:1px solid var(--sg-ln2);background:var(--sg-sf);color:var(--sg-ink2)}'
    + '.sg-b2:hover{background:var(--sg-sf3);color:var(--sg-ink)}'
    + '.sg-b1[disabled],.sg-b2[disabled]{opacity:.45;cursor:not-allowed;filter:none}'
    + '.segv .seg-pie{font-size:11.5px;color:var(--sg-ink3);flex:1;min-width:0}'
    + '.segv .sg-hint{font-size:12px;color:var(--sg-ink3);margin:0}'
    + '.segv .lnk{border:0;background:none;font:inherit;font-size:12px;font-weight:600;color:var(--sg-ac2);cursor:pointer;padding:0}'
    + '.segv .lnk:hover{color:var(--sg-ink)}'
    + '.segv .seg-nuevo{margin:0 0 14px;border-radius:10px;border:1px solid var(--sg-nab);background:var(--sg-nas);padding:9px 12px;font-size:12.5px;color:var(--sg-ink)}'
    + '.segv .seg-res{border-radius:12px;border:1px solid var(--sg-ln);background:var(--sg-sf2);padding:12px 14px}'
    + '.segv .seg-res .r1{display:flex;align-items:baseline;justify-content:space-between;gap:12px}'
    // «Qué hacer» (5-nov-2026, Héctor Daniel: «que lo que abran sea fácil de entender y poder trabajar»): en palabras, a la vista
    + '.segv .seg-que{margin-top:10px;border-radius:12px;border:1px solid var(--sg-nab);border-left:4px solid #F07A1E;background:var(--sg-nas);'
    + 'padding:10px 14px;font-size:12.5px;line-height:1.5;color:var(--sg-ink)}'
    + '.segv .seg-que > b{display:block;font-size:10.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--sg-na2);margin-bottom:3px}'
    + '.segv .seg-que p{margin:0}.segv .seg-que p + p{margin-top:4px}'
    + '.segv .seg-que ul{margin:4px 0 0;padding-left:18px}.segv .seg-que li{margin:1px 0}'
    + '.segv .seg-res h3{margin:0;font-size:15px;font-weight:600;min-width:0;overflow-wrap:anywhere;color:var(--sg-ink)}'
    + '.segv .seg-res .big{font-variant-numeric:tabular-nums;font-size:18px;font-weight:600;white-space:nowrap}'
    + '.segv .seg-res p{margin:2px 0 0;font-size:12px;color:var(--sg-ink3);overflow-wrap:anywhere}'
    + '.segv .seg-chips{display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;margin-top:8px}'
    + '.segv .seg-act,.sg-pill{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:3px 10px;font-size:11.5px;font-weight:600;'
    + 'background:var(--sg-nas);color:var(--sg-na2);border:1px solid var(--sg-nab);white-space:nowrap}'
    + '.segv .seg-act i{display:block;width:7px;height:7px;border-radius:50%;background:currentColor}'
    + '.segv .seg-act.quo,.sg-pill.quo{background:var(--sg-quos);color:var(--sg-quo);border-color:var(--sg-quo)}'
    + '.segv .seg-act.ok,.sg-pill.ok{background:var(--sg-oks);color:var(--sg-ok);border-color:var(--sg-ok)}'
    + '.segv .seg-act.sin,.sg-pill.sin{background:var(--sg-sf3);color:var(--sg-ink3);border-color:var(--sg-ln);font-weight:500}'
    + '.sg-pill{padding:1px 8px;font-size:10.5px}'
    + '.segv .seg-quien{font-size:11.5px;color:var(--sg-ink4)}'
    + '.segv .seg-tag{display:inline-flex;align-items:center;border-radius:999px;padding:3px 10px;font:inherit;font-size:11.5px;font-weight:500;'
    + 'background:var(--sg-sf3);color:var(--sg-ink3);border:1px solid var(--sg-ln);cursor:pointer}'
    + '.segv .seg-sec{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:18px 0 8px}'
    + '.segv .seg-sec b{font-size:13px;font-weight:600;color:var(--sg-ink)}'
    + '.segv .sg-q{display:grid;place-items:center;height:26px;width:26px;flex:none;border-radius:50%;border:1px solid var(--sg-ln2);background:none;'
    + 'font:inherit;font-size:12px;font-weight:700;color:var(--sg-ink3);cursor:pointer}'
    + '.segv .sg-q:hover,.segv .sg-q[aria-expanded="true"]{background:var(--sg-nas);border-color:var(--sg-nab);color:var(--sg-na2)}'
    + '.segv .sg-ayuda{border-radius:12px;border:1px solid var(--sg-ln);background:var(--sg-sf2);padding:12px 14px;margin:0 0 12px}'
    + '.segv .sg-ayuda dl{display:grid;grid-template-columns:auto 1fr;gap:8px 14px;margin:0;font-size:12.5px}'
    + '.segv .sg-ayuda dt{font-weight:600;color:var(--sg-ink)}'
    + '.segv .sg-ayuda dd{margin:0;color:var(--sg-ink2)}'
    + '.segv .sg-ayuda p{margin:10px 0 0;font-size:12px;color:var(--sg-ink3)}'
    + '@media (max-width:520px){.segv .sg-ayuda dl{grid-template-columns:1fr;gap:2px}.segv .sg-ayuda dd{margin-bottom:6px}}'
    + '.segv .opts{display:flex;flex-direction:row;flex-wrap:wrap;gap:6px}'
    + '.segv .opt{display:inline-flex;align-items:center;justify-content:flex-start;gap:6px;width:auto;border-radius:999px;border:1px solid var(--sg-ln2);'
    + 'background:transparent;padding:6px 12px;min-height:34px;font:inherit;font-size:12.5px;text-align:left;color:var(--sg-ink2);cursor:pointer}'
    + '.segv .opt:hover:not([disabled]){background:var(--sg-sf3);color:var(--sg-ink)}'
    + '.segv .opt svg{display:none}'
    + '.segv .opt.on svg{display:block}'
    + '.segv .opt.on{border-color:var(--sg-na);background:var(--sg-nas);color:var(--sg-na2);font-weight:600}'
    + '.segv .opt.quo.on{border-color:var(--sg-quo);background:var(--sg-quos);color:var(--sg-quo)}'
    + '.segv .opt.ok.on{border-color:var(--sg-ok);background:var(--sg-oks);color:var(--sg-ok)}'
    + '.segv .opt[disabled]{opacity:.45;cursor:not-allowed}'
    + '.segv .bloq{margin:6px 0 0;font-size:11px;color:var(--sg-ink4)}'
    + '.segv .seg-mas{display:block;width:100%;text-align:center;border:1px dashed var(--sg-ln2);background:none;border-radius:10px;padding:7px;'
    + 'font:inherit;font-size:12px;font-weight:600;color:var(--sg-ac2);cursor:pointer;margin-bottom:10px}'
    + '.segv .seg-mas:hover{background:var(--sg-sf3)}'
    + '.segv .seg-hilo{display:flex;flex-direction:column;gap:10px}'
    + '.segv .seg-c{display:flex;gap:10px}'
    + '.segv .seg-av{position:relative;flex:none;width:30px;height:30px;border-radius:50%;overflow:hidden;display:grid;place-items:center;'
    + 'font-size:11px;font-weight:700;background:var(--sg-acs);color:var(--sg-ac2)}'
    + '.segv .seg-av img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}'
    + '.segv .seg-bur{flex:1;min-width:0;border:1px solid var(--sg-ln);background:var(--sg-sf2);border-radius:12px;padding:8px 12px}'
    + '.segv .seg-bur.yo{background:var(--sg-nas);border-color:var(--sg-nab)}'
    + '.segv .seg-cab{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;font-size:12px}'
    + '.segv .seg-cab b{font-size:12.5px;color:var(--sg-ink)}'
    + '.segv .seg-cab .h{color:var(--sg-ink4)}'
    + '.segv .seg-mini{border-radius:999px;padding:1px 8px;font-size:10.5px;font-weight:600;background:var(--sg-nas);color:var(--sg-na2);border:1px solid var(--sg-nab)}'
    + '.segv .seg-mini.quo{background:var(--sg-quos);color:var(--sg-quo);border-color:var(--sg-quo)}'
    + '.segv .seg-mini.ok{background:var(--sg-oks);color:var(--sg-ok);border-color:var(--sg-ok)}'
    + '.segv .seg-tx{margin:4px 0 0;font-size:13px;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere;color:var(--sg-ink)}'
    + '.segv .seg-ed{margin-top:6px;display:flex;flex-wrap:wrap;align-items:center;gap:4px 12px;font-size:11.5px;color:var(--sg-ink4)}'
    + '.segv .sg-lb{display:block;margin:14px 0 6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--sg-ink3)}'
    + '.segv textarea.sg-in{display:block;width:100%;min-height:62px;resize:vertical;border-radius:10px;border:1px solid var(--sg-ln2);background:var(--sg-sf);'
    + 'padding:10px 12px;font:inherit;font-size:13.5px;color:var(--sg-ink)}'
    + '.segv textarea.sg-in::placeholder{color:var(--sg-ink4)}'
    + '.segv textarea.sg-in:focus{border-color:var(--sg-ac2);outline:none}'
    + '.segv .seg-bur textarea.sg-in{margin-top:6px}'
    + '@media (max-width:600px){.segv textarea.sg-in{font-size:16px}}'
    + '.segv details.det{border-top:1px solid var(--sg-ln);margin-top:14px;padding-top:10px}'
    + '.segv details.det>summary{cursor:pointer;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--sg-ink3);padding:4px 0}'
    + '.segv details.det>summary:hover{color:var(--sg-ink)}'
    + '.segv .sg-dl{display:grid;grid-template-columns:minmax(120px,auto) 1fr;gap:6px 14px;margin:10px 0 0;font-size:12.5px}'
    + '.segv .sg-dl dt{color:var(--sg-ink3)}'
    + '.segv .sg-dl dd{margin:0;color:var(--sg-ink);overflow-wrap:anywhere}'
    + '@media (max-width:520px){.segv .sg-dl{grid-template-columns:1fr;gap:0}.segv .sg-dl dd{margin-bottom:8px}}'
    + '@media (max-width:560px){.segv{padding:8px;align-items:flex-end}.sg-modal{max-height:94vh}.sg-head,.sg-body,.sg-foot{padding-left:16px;padding-right:16px}'
    + '.sg-x.seg-fl{width:32px;height:32px}.segv .seg-pie{flex-basis:100%}}';

  var listo = false;
  function cssUnaVez() {
    if (listo) return; listo = true;
    var st = document.createElement('style'); st.id = 'segv-css'; st.textContent = CSS; document.head.appendChild(st);
  }

  function abre(o) {
    cssUnaVez();
    o = o || {};
    var host = o.host;
    if (!host) {
      host = document.getElementById('segvHost');
      if (!host) { host = document.createElement('div'); host.id = 'segvHost'; document.body.appendChild(host); }
    }
    var est = o.estatus || null, actual = est ? (est.actual || 'sin_respuesta') : null, elegido = actual;
    var pl = o.platica || {}, hilo = (pl.hilo || []).slice();
    var nav = o.nav || null;
    var hayNav = !!(nav && nav.total);
    var bEst = !est || !est.puede, bCom = !pl.puede, soloVer = bEst && bCom;
    var conTecla = !!(window.PORTAL && typeof window.PORTAL.conTeclado === 'function' && window.PORTAL.conTeclado());

    var estHTML = '';
    if (est) {
      estHTML = '<div class="seg-sec"><b>' + esc(est.titulo || 'Estatus de revisión') + '</b>'
        + '<button class="sg-q" type="button" data-ayuda aria-expanded="false" title="Qué significa cada estatus">?</button></div>'
        + '<div class="sg-ayuda" data-ayuda-txt hidden><dl>'
        + AYUDA.map(function (a) { return '<dt>' + esc(a[0]) + '</dt><dd>' + esc(a[1]) + '</dd>'; }).join('')
        + '<dt>Comentarios</dt><dd>Qué se revisó, qué soporte se pidió o se tiene y a qué conclusión se llegó. Cada uno queda aparte con quién lo escribió, la fecha y la hora; el tuyo lo puedes corregir o borrar en los primeros ' + MIN + ' minutos.</dd>'
        + '</dl>' + (est.ayudaPie ? '<p>' + esc(est.ayudaPie) + '</p>' : '') + '</div>'
        + '<div class="opts" data-eje="i">' + opciones().map(function (e) {
          var m = est.puede ? regla(actual, e.id, est.gc) : '', dis = !est.puede || !!m;
          return '<button type="button" class="opt i' + cls(e.id) + (actual === e.id ? ' on' : '') + '" data-v="' + e.id + '"'
            + (dis ? ' disabled' : '') + (m ? ' title="' + esc(m) + '" data-bloq="' + esc(m) + '"' : '') + '>' + esc(e.t) + OK + '</button>';
        }).join('') + '</div>'
        + '<p class="bloq" data-bloq-txt>' + esc(est.nota ? est.nota(actual, est.puede) : notaEst(actual, est.puede)) + '</p>';
    }
    var nCuantos = hayNav ? ' · ' + NUM.format(nav.pos) + ' de ' + NUM.format(nav.total) + (nav.donde ? ' ' + nav.donde : '') : '';
    var html = '<div class="segv" role="dialog" aria-modal="true" aria-label="' + esc(o.titulo || 'Seguimiento') + '">'
      + '<div class="sg-modal">'
      + '<div class="sg-head"><div><p class="kick">' + esc((o.kick || '') + nCuantos) + '</p><h2>' + esc(o.titulo || 'Seguimiento de revisión') + '</h2></div>'
      + '<div class="sg-nav">'
      + (hayNav ? '<button type="button" class="sg-x seg-fl" data-nav="-1" title="Anterior" aria-label="Anterior"' + (nav.ant ? '' : ' disabled') + '>‹</button>'
        + '<button type="button" class="sg-x seg-fl" data-nav="1" title="Siguiente" aria-label="Siguiente"' + (nav.sig ? '' : ' disabled') + '>›</button>' : '')
      + '<button type="button" class="sg-x" data-x aria-label="Cerrar ventana">' + X + '</button></div></div>'
      + '<div class="sg-body">'
      + (o.nota ? '<p class="seg-nuevo">' + esc(o.nota) + '</p>' : '')
      + (o.antes || '')
      + '<div class="seg-res">' + (o.resumen || '') + '</div>'
      + (o.queHacer ? '<div class="seg-que"><b>Qué hacer</b><div>' + o.queHacer + '</div></div>' : '')
      + estHTML
      + '<div data-despues></div>'
      + '<div class="seg-sec"><b>Comentarios · <span data-ncom>' + NUM.format(hilo.length) + '</span></b><span class="sg-hint">del más viejo al más nuevo</span></div>'
      + '<div data-hilo>' + hiloHTML(hilo, pl, false) + '</div>'
      + (bCom ? '<p class="sg-hint" style="margin-top:10px">' + esc(pl.noPuede || 'Aquí solo se ve.') + '</p>'
        : '<label class="sg-lb" for="sCom">Agregar comentario</label>'
          + '<textarea class="sg-in" id="sCom" rows="2" placeholder="' + esc(pl.ph || 'Qué se revisó, qué soporte se pidió o se tiene y a qué conclusión se llegó') + '"></textarea>'
          + '<p class="sg-hint" style="margin-top:6px">Se guarda con tu nombre y la hora. El tuyo lo puedes corregir o borrar ' + MIN + ' minutos; nadie borra el de otro.'
          + ' A quienes ya comentaron les llega el aviso.' + (conTecla ? ' Ctrl+Enter guarda.' : '') + '</p>')
      + (o.detalles || '')
      + '</div>'
      + '<div class="sg-foot"><span class="seg-pie" id="sSaved">' + esc(o.sinGuardar ? o.sinGuardar : soloVer ? '' : 'Nada que guardar todavía') + '</span>'
      + '<div class="sg-acts"><button type="button" class="sg-b2" data-cancelar>Cerrar</button>'
      + (soloVer ? '' : '<button type="button" class="sg-b2" id="sOk" disabled>Guardar</button>')
      + (hayNav && nav.sig ? '<button type="button" class="sg-b1" id="sSig">' + (soloVer ? 'Siguiente ›' : 'Guardar y siguiente ›') + '</button>' : '')
      + '</div></div></div></div>';
    host.innerHTML = html;
    var scrim = host.querySelector('.segv');
    var q = function (s) { return scrim.querySelector(s); };
    var despues = q('[data-despues]');
    if (o.despues) { if (typeof o.despues === 'string') despues.innerHTML = o.despues; else despues.appendChild(o.despues); }
    else despues.remove();

    var av = q('#sSaved'), ok = q('#sOk'), sg = q('#sSig'), txt = q('#sCom'), hiloBox = q('[data-hilo]');
    var todos = false, avisado = false, ocupado = false, tic = null, cerrado = false;
    function sucio() { return (est && elegido !== actual) || !!(txt && txt.value.trim()); }
    function repinta() {
      if (ocupado) return;
      var s = sucio();
      if (ok) ok.disabled = !s || !!o.sinGuardar;
      if (av && !o.sinGuardar && !soloVer) av.textContent = !s ? 'Nada que guardar todavía'
        : (est && elegido !== actual) && txt && txt.value.trim() ? 'Se guardará el estatus y tu comentario'
        : (est && elegido !== actual) ? 'Se guardará el estatus' : 'Se guardará tu comentario';
      avisado = false;
    }
    function pintaHilo() {
      if (o.hiloDe) hilo = (o.hiloDe() || []).slice();
      hiloBox.innerHTML = hiloHTML(hilo, pl, todos);
      var n = q('[data-ncom]'); if (n) n.textContent = NUM.format(hilo.length);
      ponFotos(hiloBox);
    }
    function cerrar() {
      if (cerrado) return; cerrado = true;
      if (tic) clearInterval(tic);
      document.removeEventListener('keydown', alTeclado, true);
      host.innerHTML = '';
      if (o.alCerrar) o.alCerrar();
    }
    function alTeclado(ev) {
      if (ev.key !== 'Escape' || !document.body.contains(scrim)) return;
      ev.stopPropagation(); cerrar();
    }
    document.addEventListener('keydown', alTeclado, true);
    scrim.addEventListener('click', function (ev) {
      if (ev.target === scrim || ev.target.closest('[data-x],[data-cancelar]')) cerrar();
    });
    ponFotos(hiloBox);
    // los minutos para corregir o borrar lo propio corren solos mientras la ventana está abierta
    if (hilo.some(function (c) { return quedaMin(c, pl.yo) > 0; })) {
      tic = setInterval(function () {
        if (!hiloBox.querySelector('textarea')) pintaHilo();
        if (!hilo.some(function (c) { return quedaMin(c, pl.yo) > 0; })) { clearInterval(tic); tic = null; }
      }, 30000);
    }
    hiloBox.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-todos]')) { todos = true; pintaHilo(); return; }
      var caja = ev.target.closest('.seg-c'); if (!caja) return;
      var cid = caja.getAttribute('data-cid'), c = hilo.filter(function (x) { return x.id === cid; })[0], bur = caja.querySelector('.seg-bur');
      if (!c) return;
      if (ev.target.closest('[data-corr]')) {
        bur.querySelector('.seg-ed').innerHTML = '';
        bur.querySelector('.seg-tx').outerHTML = '<textarea class="sg-in" rows="2" data-edtx>' + esc(c.texto || '') + '</textarea>'
          + '<div class="seg-ed"><button type="button" class="lnk" data-corr-ok>Guardar corrección</button><button type="button" class="lnk" data-cancela>Cancelar</button><span data-edmsg></span></div>';
        bur.querySelector('[data-edtx]').focus(); return;
      }
      if (ev.target.closest('[data-borr]')) {
        bur.querySelector('.seg-ed').innerHTML = '<span>¿Borrar tu comentario?</span><button type="button" class="lnk" data-borr-ok>Sí, borrar</button>'
          + '<button type="button" class="lnk" data-cancela>No</button><span data-edmsg></span>';
        return;
      }
      if (ev.target.closest('[data-cancela]')) { pintaHilo(); return; }
      var okC = ev.target.closest('[data-corr-ok]'), okB = ev.target.closest('[data-borr-ok]');
      if (!okC && !okB) return;
      var msg = bur.querySelector('[data-edmsg]'), nuevo = okC ? bur.querySelector('[data-edtx]').value.trim() : '';
      if (okC && !nuevo) { msg.textContent = 'Escribe el comentario (o bórralo).'; return; }
      msg.textContent = okC ? 'Guardando…' : 'Borrando…';
      Promise.resolve(okC ? o.corrige(cid, nuevo) : o.borra(cid)).then(function (r) {
        if (typeof r === 'string') { msg.textContent = r; return; }
        pintaHilo(); if (o.alCambiar) o.alCambiar();
      }, function () { msg.textContent = 'No se pudo. Intenta de nuevo.'; });
    });
    var qb = q('[data-ayuda]'), qt = q('[data-ayuda-txt]');
    if (qb && qt) qb.addEventListener('click', function () { qt.hidden = !qt.hidden; qb.setAttribute('aria-expanded', String(!qt.hidden)); });
    var box = q('.opts[data-eje="i"]');
    if (box) {
      // un botón apagado no recibe el clic: se oye en su caja para decir por qué (en el celular no hay «pasar el cursor»)
      box.addEventListener('pointerdown', function (ev) {
        var b = [].slice.call(box.querySelectorAll('.opt[data-bloq]')).filter(function (x) {
          var r = x.getBoundingClientRect(); return ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom;
        })[0];
        var tt = q('[data-bloq-txt]'); if (b && tt) tt.textContent = b.getAttribute('data-bloq') + '.';
      });
      box.addEventListener('click', function (ev) {
        var b = ev.target.closest('.opt'); if (!b || b.disabled) return;
        elegido = b.getAttribute('data-v');
        [].forEach.call(box.querySelectorAll('.opt'), function (x) { x.classList.toggle('on', x === b); });
        repinta();
      });
    }
    if (txt) {
      txt.addEventListener('input', repinta);
      txt.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey) && ok && !ok.disabled) { ev.preventDefault(); ok.click(); }
      });
    }
    function corre(siguiente) {
      if (!sucio()) { cerrar(); if (o.alGuardar) o.alGuardar(); if (siguiente && nav && nav.ir) nav.ir(1); return; }
      ocupado = true;
      [ok, sg].forEach(function (b) { if (b) b.disabled = true; });
      av.textContent = 'Guardando…';
      var cambia = est && elegido !== actual;
      Promise.resolve(o.guarda({estatus: cambia ? elegido : undefined, de: actual, texto: txt ? txt.value.trim() : ''})).then(function (r) {
        ocupado = false;
        if (r !== true) { av.textContent = typeof r === 'string' ? r : 'No se pudo guardar. Intenta de nuevo.'; [ok, sg].forEach(function (b) { if (b) b.disabled = false; }); return; }
        cerrar(); if (o.alGuardar) o.alGuardar();
        if (siguiente && nav && nav.ir) nav.ir(1);
      }, function () {
        ocupado = false; av.textContent = 'No se pudo guardar. Intenta de nuevo.';
        [ok, sg].forEach(function (b) { if (b) b.disabled = false; });
      });
    }
    if (ok) ok.addEventListener('click', function () { corre(false); });
    if (sg) sg.addEventListener('click', function () { corre(true); });
    // las flechas: si dejaste algo sin guardar, la primera vez avisa y la segunda pasa sin guardarlo
    [].forEach.call(scrim.querySelectorAll('[data-nav]'), function (b) {
      b.addEventListener('click', function () {
        if (b.disabled || !nav || !nav.ir) return;
        if (sucio() && !avisado) { avisado = true;
          av.textContent = 'Tienes cambios sin guardar: pica otra vez la flecha para dejarlos, o usa «Guardar y siguiente ›».'; return; }
        var dir = +b.getAttribute('data-nav'); cerrar(); nav.ir(dir);
      });
    });
    if (o.enlaza) o.enlaza(scrim, {cerrar: cerrar, pie: function (s) { if (av) av.textContent = s; }});
    repinta();
    var f = scrim.querySelector('.sg-body'); if (f) f.scrollTop = 0;
    return {scrim: scrim, cerrar: cerrar, pie: function (s) { if (av) av.textContent = s; }};
  }
  function notaEst(actual, puede) {
    if (!puede) return 'El estatus lo cambian la Gerencia Contable y los contadores de este cliente.';
    if (actual === 'modif_quo') return MSJ.quo + '.';
    return '«Justificado» o «Modificación Exitosa» lo dan por revisado.';
  }

  window.PROFASE_SEG = {
    abre: abre, ESTATUS: ESTATUS, AYUDA: AYUDA, MSJ: MSJ, MIN: MIN,
    t: t, cls: cls, cierra: cierra, regla: regla, opciones: opciones,
    chip: chip, pill: pill, esc: esc, iniciales: iniciales, ponFotos: ponFotos, quedaMin: quedaMin
  };
})();
