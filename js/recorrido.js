/* Portal PROFASE · Recorridos guiados de lo nuevo (30-oct-2026, pedido de Daniel para el chat interno: «hazlo tipo
   walkthrough este cambio; así como esto es nuevo y flechita; aquí le picas, aquí no sé qué»).
   Se oscurece la pantalla, se ilumina una parte (también si está dentro del marco de una pestaña), una flechita naranja
   la señala y un globo explica qué es y dónde picarle: «Atrás», «Siguiente» y «Saltar» (Esc). Funciona en celular,
   tableta y computadora, y en modo claro u oscuro. Quién ya vio cada recorrido lo guarda la base
   (portal/sql/59_recorridos.sql); eso lo hace la pestaña que lo lanza.
   Uso: PROFASE_RECORRIDO.corre({ pasos: [{ el: () => elemento o null, titulo, texto, etiqueta: 'Nuevo', icono: 'candado',
                                            antes: async () => {} }] }) → promesa: 'fin' o 'saltado'.
   Un paso sin «el» sale al centro, sin flechita. Si su parte no está a la vista, el paso se brinca.
   El globo cabe siempre (Héctor Daniel, 4-nov-2026, 19:09: «Corrige esto; o puedo ponerle siguiente»; 19:21: «si es
   demasiado texto lo apartas en dos, tres, cuatro… tanto para el nuevo como para lo viejo»): un texto de más de 400
   letras se parte solo en 2, 3 o 4 pasos con «Siguiente» (partePasos(), abajo); el globo nunca es más alto que la
   pantalla, el texto se desliza por dentro y Atrás/Siguiente siempre se ven. exige_pasos_caben() de construir.py.
   «A la vista» es de verdad (30-oct-2026, Daniel con una captura del celular: el paso «En el menú RH» iluminaba un
   pedazo vacío del Inicio): dentro de la pantalla, no escondida (visibility, display u opacidad) y no fuera de la
   pantalla (el menú del celular cerrado vive a la izquierda, fuera de ella). PROFASE_RECORRIDO.aLaVista(el) es la
   misma revisión; PROFASE_RECORRIDO.sePuede(el) es la que usan los recorridos para escoger entre varias partes: no
   escondida y dentro de lo ancho de la pantalla (lo que está más abajo sí cuenta: el motor la acerca antes de iluminarla).
   menu: 'rh' (y sub: 'rh-vacaciones', opcional): el paso abre ese módulo donde esté el menú de quien lo ve (riel, menú
   arriba o el ☰ del celular, con PORTAL_MENU.ensena) e ilumina su tarjeta u opción; al pasar a otro paso o al terminar,
   el menú se vuelve a cerrar solo.
   obligatorio: true: sin «Saltar» ni Esc; solo se sale llegando al final. Lo usan el recorrido general del portal
   (bienvenida_tab.js; Daniel: «Obligatorio») y el de «+ Subir aviso» del Buzón tributario a Liliana Lechuga y Francisco
   Rivera (bzt_tab.js; Héctor Daniel, 4-nov-2026: «dale un recorrido a lili y a frank obligatorio»), por unaVez(). El del chat ya no es obligatorio (Héctor Daniel, 3-nov-2026,
   15:57: «quita la regla del recorrido obligatorio en chat»): se puede saltar, como los de las demás pantallas.
   Último paso de todos (regla de Daniel, 31-oct-2026, 5:04): dónde está SuperConta (IA) para sus dudas. Lo registra
   PROFASE_RECORRIDO.alFinal(() => paso) (portal/guia_tab.js) y se agrega solo; sinCierre: true lo apaga (los de SuperConta).
   De la mano (Héctor Daniel Nava, 24-nov-2026, 10:36, al pedir el recorrido de los complementos de pago de Dora Montalvo:
   «pero la llevas de la mano (así deben de ser los recorridos); le da clic y así se va»): un paso puede pedirle a la persona
   que lo haga ella, en la pantalla de verdad:
     haz: 'clic'   → solo lo iluminado se puede picar (lo demás queda tapado); al picarlo pasa lo de siempre (se abre la
                     pantalla, el menú o la ventana) y el recorrido sigue solo, sin «Siguiente».
     haz: 'libre'  → la persona escribe o escoge en la pantalla (nada se tapa) y luego pica «Siguiente».
     listo: () => true cuando ya lo hizo (por ejemplo, ya palomeó una factura): el recorrido sigue solo.
     espera: ms    → lo que se abre tarda (una ventana que pide datos a la base): espera hasta ms a que su parte aparezca
                     (o una función que da los ms: 0 si no hay nada que esperar).
     siNo: { titulo, texto } → si su parte no está (no hay nada que palomear), sale al centro con ese texto y «Siguiente»
                     en lugar de brincarse.
     hazTexto: lo que dice la línea «Te toca» (si no, la de siempre); sinAtras: true, sin «Atrás» (después de cambiar de
                     pantalla, regresar no tiene a dónde).
   En un paso «haz», el teclado es de la página (las flechas, Tab y Enter no mueven el recorrido; Esc sigue igual). Si la
   parte se vuelve a pintar (la pantalla se recarga), se busca otra vez; si ya no está, el globo sale al centro con «Siguiente».
   Nunca obliga a guardar, mandar ni timbrar nada: el último clic de verdad lo da la persona.
   «Ver después» (Héctor Daniel Nava, 24-nov-2026, 12:03 y 12:08: «pongas algo como ver después o algo para que si están en
   medio de algo no los saques de lo que están haciendo»; «así es»): un recorrido que sale solo (no lo pidió la persona en el
   «?») empieza con un globo chico al centro, «¿Lo vemos ahora?», que no mueve nada de la pantalla: «Empezar» (el mismo botón
   de «Siguiente», .rc-sig), «Ver después» y, si no es obligatorio, «Saltar». «Ver después» también va en cada paso. Con
   «Ver después» el recorrido se quita, la persona sigue donde estaba y no cuenta como visto: vuelve a salir en una hora o la
   próxima vez que entre, lo que pase primero (lo que falta se guarda en sessionStorage, «profase-rc-despues»; la entrada lo
   borra). Los obligatorios también lo traen y salen hasta que se terminan. La promesa da 'despues'; quien lo lanza no lo
   marca como visto. Opciones: solo (true: salió solo; si no se dice, salió solo salvo que la persona lo haya pedido en los
   últimos segundos con PROFASE_RECORRIDO.pedido(), que llama el «?»), pedido (true: lo pidió la persona: sin globo de
   inicio ni «Ver después»), id (para acordarse de «Ver después»; si no, sale del primer paso) y otraVez (la función que lo
   vuelve a lanzar cuando se cumple la hora, en cuanto la pantalla está libre). */
(function () {
  'use strict';
  if (window.PROFASE_RECORRIDO) return;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var CSS = ''
    + '.rc-capa{position:fixed;inset:0;z-index:2147483000;font-family:var(--f-body,"Public Sans","Segoe UI",system-ui,sans-serif)}'
    + '.rc-capa.sin-luz{background:rgba(8,14,28,.66)}'
    + '.rc-luz{position:fixed;border-radius:12px;box-shadow:0 0 0 9999px rgba(8,14,28,.66);transition:left .25s ease,top .25s ease,width .25s ease,height .25s ease;pointer-events:none}'
    + '.rc-luz::after{content:"";position:absolute;inset:-4px;border-radius:15px;border:3px solid #F07A1E;animation:rc-late 1.6s ease-in-out infinite}'
    + '@keyframes rc-late{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.55;transform:scale(1.035)}}'
    + '.rc-globo{position:fixed;width:min(370px,calc(100vw - 24px));background:var(--surface,#fff);color:var(--ink,#132036);border-radius:14px;border-top:5px solid #F07A1E;box-shadow:0 18px 50px rgba(0,0,0,.35);padding:14px 16px 12px;transition:left .25s ease,top .25s ease;'
    // nunca más alto que la pantalla (Héctor Daniel, 4-nov-2026, 19:09, con la captura del celular donde «Siguiente» se
    // quedaba fuera): el globo mide a lo más lo que se ve (acomoda() lo ajusta en px, con las orillas del iPhone), el
    // texto se desliza por dentro y la cabeza, el título y Atrás/Siguiente siempre se ven
    + 'display:flex;flex-direction:column;box-sizing:border-box;max-height:calc(100vh - 16px)}'
    + '.rc-cab,.rc-globo h3,.rc-pie{flex:none}'
    + '.rc-sa{position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px)}'
    + '.rc-globo.centro{width:min(420px,calc(100vw - 24px))}'
    + '.rc-cab{display:flex;align-items:center;gap:8px;margin-bottom:6px}'
    + '.rc-et{background:#F07A1E;color:#14233F;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;border-radius:999px;padding:3px 10px}'
    + '.rc-ic{width:30px;height:30px;border-radius:50%;background:#1F3864;color:#fff;display:grid;place-items:center;flex:none}'
    + '.rc-ic svg{width:17px;height:17px}'
    + '.rc-globo h3{margin:0 0 4px;font-family:var(--f-display,"Archivo","Arial Narrow",Arial,sans-serif);font-stretch:85%;font-size:20px;font-weight:800;line-height:1.15;color:inherit}'
    + '.rc-globo p{margin:0;font-size:14.5px;line-height:1.45;color:inherit;opacity:.92;flex:1 1 auto;min-height:3em;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}'
    + '.rc-globo p.mas{-webkit-mask-image:linear-gradient(to bottom,#000 calc(100% - 26px),transparent);mask-image:linear-gradient(to bottom,#000 calc(100% - 26px),transparent)}'
    + '.rc-pie{display:flex;align-items:center;gap:8px;margin-top:12px}'
    + '.rc-n{flex:1;font-size:12.5px;color:var(--muted,#5A6577)}'
    + '.rc-pie button{font:inherit;font-size:14px;font-weight:700;border-radius:10px;padding:8px 14px;cursor:pointer;border:1px solid var(--line-strong,#C4CDDA);background:var(--surface,#fff);color:inherit}'
    + '.rc-pie .rc-sig{background:#F07A1E;border-color:#F07A1E;color:#14233F}'
    + '.rc-pie .rc-salta,.rc-pie .rc-despues{border:0;background:none;color:var(--muted,#5A6577);font-weight:600;padding:8px 4px}'
    + '.rc-pie .rc-despues{color:var(--navy,#1F3864);text-decoration:underline;text-underline-offset:3px}'
    + ':root[data-theme="dark"] .rc-pie .rc-despues{color:#9DB8E8}'
    // con «Ver después» el pie va en dos renglones: arriba «Ver después», «Saltar» y el número; abajo Atrás y Siguiente
    + '.rc-brk{display:none}.rc-pie.con-despues{flex-wrap:wrap;row-gap:6px}.rc-pie.con-despues .rc-brk{display:block;flex-basis:100%;height:0}'
    + '.rc-pie.con-despues .rc-n{text-align:right}.rc-pie.con-despues .rc-atras{margin-left:auto}'
    + '.rc-pie.con-despues .rc-atras[hidden]+.rc-sig{margin-left:auto}'
    // de la mano: lo iluminado se puede usar; con haz: 'clic', unos muros transparentes tapan todo lo demás
    + '.rc-capa.rc-haz{pointer-events:none}.rc-capa.rc-haz .rc-globo,.rc-capa.rc-haz .rc-muro{pointer-events:auto}'
    + '.rc-muro{position:fixed;background:transparent}'
    + '.rc-toca{flex:none;display:flex;align-items:flex-start;gap:8px;margin-top:10px;padding:8px 10px;border-radius:10px;background:rgba(240,122,30,.12);font-size:14px;font-weight:700;line-height:1.35}'
    + '.rc-toca::before{content:"";flex:none;width:10px;height:10px;margin-top:4px;border-radius:50%;background:#F07A1E;animation:rc-late 1.6s ease-in-out infinite}'
    + '.rc-pie button:focus-visible{outline:2px solid #1F3864;outline-offset:2px}'
    + '.rc-espera{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:var(--surface,#fff);color:var(--ink,#132036);border-radius:999px;padding:10px 18px;font-size:14.5px;font-weight:600;box-shadow:0 10px 30px rgba(0,0,0,.3);display:flex;align-items:center;gap:10px}'
    + '.rc-espera i{width:16px;height:16px;border-radius:50%;border:2.5px solid #C4CDDA;border-top-color:#F07A1E;animation:rc-gira .8s linear infinite}'
    + '@keyframes rc-gira{to{transform:rotate(360deg)}}'
    + ':root[data-theme="dark"] .rc-espera{background:var(--surface,#141C2B);color:var(--ink,#E5EAF2)}'
    + '.rc-flecha{position:fixed;width:42px;height:42px;color:#F07A1E;filter:drop-shadow(0 2px 4px rgba(0,0,0,.35));pointer-events:none}'
    + '.rc-flecha svg{width:100%;height:100%;display:block}'
    + '.rc-flecha.arriba svg{animation:rc-sube 1s ease-in-out infinite}.rc-flecha.abajo svg{animation:rc-baja 1s ease-in-out infinite}'
    + '.rc-flecha.izq svg{animation:rc-izq 1s ease-in-out infinite}.rc-flecha.der svg{animation:rc-der 1s ease-in-out infinite}'
    + '@keyframes rc-sube{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}@keyframes rc-baja{0%,100%{transform:translateY(0) rotate(180deg)}50%{transform:translateY(7px) rotate(180deg)}}'
    + '@keyframes rc-izq{0%,100%{transform:translateX(0) rotate(-90deg)}50%{transform:translateX(-7px) rotate(-90deg)}}@keyframes rc-der{0%,100%{transform:translateX(0) rotate(90deg)}50%{transform:translateX(7px) rotate(90deg)}}'
    + ':root[data-theme="dark"] .rc-globo{background:var(--surface,#141C2B);color:var(--ink,#E5EAF2)}'
    + ':root[data-theme="dark"] .rc-ic{background:#2B4C86}'
    + '@media (max-width:600px){.rc-globo h3{font-size:18px}.rc-globo p{font-size:14px}.rc-pie button{padding:8px 11px}}'
    + '@media (prefers-reduced-motion: reduce){.rc-luz,.rc-globo{transition:none}.rc-luz::after,.rc-flecha svg,.rc-espera i{animation:none!important}}';
  var FLECHA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2 4 11h5v10h6V11h5z"/></svg>';
  var ICONOS = {
    candado: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.1A8.5 8.5 0 1 1 21 12Z"/></svg>',
    listo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>'
  };

  // dónde está una parte en la pantalla, aunque viva dentro del marco de una pestaña
  function caja(el) {
    try {
      if (!el || !el.getClientRects().length) return null;
      var r = el.getBoundingClientRect(), x = r.left, y = r.top, w = el.ownerDocument.defaultView;
      while (w && w !== window && w.frameElement) {
        var f = w.frameElement.getBoundingClientRect();
        x += f.left + (w.frameElement.clientLeft || 0); y += f.top + (w.frameElement.clientTop || 0); w = w.parent;
      }
      if (r.width < 2 || r.height < 2) return null;
      return { x: x, y: y, w: r.width, h: r.height };
    } catch (e) { return null; }
  }
  function dentro(el) {
    try {
      var r = el.getBoundingClientRect(), v = el.ownerDocument.defaultView, g = caja(el);
      var fuera = r.top < 0 || r.bottom > v.innerHeight || r.left < 0 || r.right > v.innerWidth;
      // dentro del marco de una pestaña que en el celular es más alto que lo que se ve: también cuenta la pantalla de
      // afuera (si no, una parte de abajo del marco se brincaba; 2-nov-2026, Caja chica en el celular)
      if (!fuera && g && v !== window) fuera = g.y < 0 || g.y + g.h > innerHeight;
      // o tapada por el recuadro que se desliza donde vive (el cuerpo de una ventana con su pie abajo): se ve en la pantalla,
      // pero el recuadro la corta (24-nov-2026, los botones de una forma de Quo Facturita quedaban debajo del pie)
      if (!fuera) fuera = recortada(el, r, v);
      if (fuera) el.scrollIntoView({ block: 'center', inline: 'nearest' });
    } catch (e) { /* se queda donde está */ }
  }
  function recortada(el, r, v) {
    for (var x = el.parentElement; x && x !== el.ownerDocument.body; x = x.parentElement) {
      var cs = v.getComputedStyle(x), oy = cs.overflowY, ox = cs.overflowX;
      if ((oy === 'visible' && ox === 'visible') || (x.scrollHeight <= x.clientHeight + 1 && x.scrollWidth <= x.clientWidth + 1)) continue;
      var c = x.getBoundingClientRect();
      // solo si cabe en el recuadro (si es más grande, deslizar no la deja ver completa y la pantalla se quedaría brincando)
      if (r.height <= c.height && (r.top < c.top - 1 || r.bottom > c.bottom + 1)) return true;
      if (r.width <= c.width && (r.left < c.left - 1 || r.right > c.right + 1)) return true;
    }
    return false;
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(v, b)); }
  // ¿se ve de verdad? (no escondida, no transparente, y al menos un pedazo dentro de la pantalla)
  function aLaVista(el) {
    try {
      var g = caja(el);
      if (!g) return false;
      var x = el, w = el.ownerDocument.defaultView;
      while (x) {
        if (x.nodeType === 1) {
          var cs = w.getComputedStyle(x);
          if (cs.display === 'none' || cs.visibility === 'hidden' || cs.visibility === 'collapse' || +cs.opacity < 0.05) return false;
        }
        if (x.parentElement) { x = x.parentElement; continue; }
        // sube al marco de la pestaña, si vive dentro de uno
        x = w.frameElement || null; w = x ? x.ownerDocument.defaultView : null;
      }
      var vw = innerWidth, vh = innerHeight;
      var ancho = Math.min(g.x + g.w, vw) - Math.max(g.x, 0), alto = Math.min(g.y + g.h, vh) - Math.max(g.y, 0);
      return ancho >= Math.min(g.w, 24) * 0.6 && alto >= Math.min(g.h, 16) * 0.6;
    } catch (e) { return false; }
  }
  // para escoger entre varias partes: no escondida y dentro de lo ancho de la pantalla (lo de más abajo sí cuenta)
  function sePuede(el) {
    try {
      var g = caja(el);
      if (!g) return false;
      var x = el, w = el.ownerDocument.defaultView;
      while (x) {
        if (x.nodeType === 1) {
          var cs = w.getComputedStyle(x);
          if (cs.display === 'none' || cs.visibility === 'hidden' || cs.visibility === 'collapse' || +cs.opacity < 0.05) return false;
        }
        if (x.parentElement) { x = x.parentElement; continue; }
        x = w.frameElement || null; w = x ? x.ownerDocument.defaultView : null;
      }
      return Math.min(g.x + g.w, innerWidth) - Math.max(g.x, 0) >= Math.min(g.w, 24) * 0.6;
    } catch (e) { return false; }
  }
  function dormir(ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); }
  var menuAbierto = false;
  function sueltaMenu() {
    if (!menuAbierto) return false;
    menuAbierto = false;
    try { if (window.PORTAL_MENU && window.PORTAL_MENU.suelta) window.PORTAL_MENU.suelta(); } catch (e) { /* ya cerrado */ }
    return true;
  }
  // abre el módulo «k» del menú donde esté (riel, arriba o ☰ del celular) y regresa lo que se ilumina
  async function abreMenu(k, sub) {
    var M = window.PORTAL_MENU;
    if (!M || !M.ensena) return null;
    var c = null;
    try { c = M.ensena(k); } catch (e) { c = null; }
    menuAbierto = true;
    await dormir(320);   // el ☰ del celular se desliza en .2 s
    if (!c) return null;
    var o = sub ? c.querySelector('a[data-k="' + sub + '"]') : null;
    return o && aLaVista(o) ? o : c;
  }

  var activo = false, cierre = null;

  /* «Ver después» (24-nov-2026): lo que falta para que vuelva a salir cada recorrido, en esta sesión del navegador (al abrir
     otra vez el portal, sessionStorage empieza vacío: sale otra vez) */
  var DESPUES_MS = 60 * 60 * 1000, DESPUES_K = 'profase-rc-despues', timers = {}, pedidoHasta = 0;
  function despuesLee() { try { return JSON.parse(sessionStorage.getItem(DESPUES_K) || '{}') || {}; } catch (e) { return {}; } }
  function despuesGuarda(o) { try { sessionStorage.setItem(DESPUES_K, JSON.stringify(o)); } catch (e) { /* sin almacenamiento */ } }
  function despuesFalta(k) { var h = +despuesLee()[k] || 0, f = h - Date.now(); return f > 0 ? f : 0; }
  function despuesPon(k) { var o = despuesLee(); o[k] = Date.now() + DESPUES_MS; despuesGuarda(o); }
  function despuesQuita(k) {
    var o = despuesLee(); if (o[k]) { delete o[k]; despuesGuarda(o); }
    if (timers[k]) { clearTimeout(timers[k]); delete timers[k]; }
  }
  function clave(def) {
    if (def.id) return String(def.id);
    var p = def.pasos && def.pasos[0];
    return 'p:' + String((p && p.titulo) || '').slice(0, 80) + '|' + def.pasos.length;
  }
  // una ventana que pide respuesta (fuera de un recorrido) a la vista
  function hayVentanaG() {
    return Array.prototype.some.call(document.querySelectorAll('[aria-modal="true"]'), function (d) {
      if (d.closest('.rc-capa') || !d.getClientRects().length) return false;
      var cs = getComputedStyle(d); return cs.visibility !== 'hidden' && +cs.opacity > 0.05;
    });
  }
  // libre para volver a enseñar un recorrido: sin otro recorrido, ventana, llamada, «No molestar» ni alguien escribiendo
  function libre() {
    if (activo || document.hidden || hayVentanaG()) return false;
    try { var P = window.PORTAL; if (P && P.ocupado && P.ocupado()) return false; } catch (e) { /* sigue */ }
    return !document.documentElement.classList.contains('pm-cargando');
  }
  function cuandoLibre(fn) {
    var vuelta = function () { if (libre()) { try { fn(); } catch (e) { /* un recorrido nunca rompe la página */ } } else setTimeout(vuelta, 3000); };
    vuelta();
  }
  // cuando se cumple la hora, quien lo lanzó lo vuelve a lanzar (otraVez), en cuanto la pantalla esté libre
  function programa(k, otraVez) {
    if (typeof otraVez !== 'function' || timers[k]) return;
    timers[k] = setTimeout(function () { delete timers[k]; cuandoLibre(otraVez); }, Math.max(1000, despuesFalta(k) + 500));
  }
  function pedidoVigente() { return Date.now() < pedidoHasta; }
  /* «Primero» (Héctor Daniel, 1-nov-2026: «el primer pop que vean… sea el de deja de usar el Access… y luego ya empiezas
     el tour»): el aviso «¡Adiós Access, hola CRM!» (adios_access_tab.js) y el recorrido general (bienvenida_tab.js) se
     anotan aquí con primero(fn); mientras alguno le falte a la persona (fn() verdadero), activo() dice que sí y ningún otro
     recorrido ni ventana automática arranca (todas esperan a activo()). Esos dos preguntan activo(true): solo lo que de
     verdad corre. Cada uno deja de faltar solo, a más tardar 90 s después de abrir si no se pudo saber. */
  var primeros = [];
  function primeroFalta() {
    for (var i = 0; i < primeros.length; i++) { try { if (primeros[i]()) return true; } catch (e) { /* sigue */ } }
    return false;
  }
  /* Mucho texto se parte solo en 2, 3 o 4 pasos con «Siguiente» (Héctor Daniel, 4-nov-2026, 19:21: «crear una regla que si
     es demasiado texto lo apartas en dos, tres, cuatro… tanto para el nuevo como para lo viejo»). Un paso de más de LIM
     letras se reparte por oraciones (y, si una oración sola no cabe, en sus «;», «:» o comas) en partes parejas de hasta
     LIM letras; cada parte ilumina lo mismo y su título dice «(1 de 3)», «(2 de 3)»… Vale para todos los recorridos, los de
     antes y los nuevos, también los que arman su texto con partes que cambian. Al escribir uno nuevo, mejor partirlo a mano
     con su propio título (como «Empresas» de la Cartera); esto es la red para lo que se pase. */
  var LIM = 400;
  function mayus(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  // ¿la posición k está dentro de un paréntesis o de unas comillas «»? (ahí no se corta)
  function adentro(t, k) {
    var p = 0, c = 0;
    for (var j = 0; j < k; j++) { var x = t.charAt(j); if (x === '(') p++; else if (x === ')') p--; else if (x === '«') c++; else if (x === '»') c--; }
    return p > 0 || c > 0;
  }
  // corta t después de cada coincidencia de re que no quede dentro de un paréntesis o unas comillas (con libre, aunque
  // quede); fin(trozo) arregla cómo termina cada trozo
  function corta(t, re, fin, libre) {
    var out = [], ini = 0, m;
    re.lastIndex = 0;
    while ((m = re.exec(t))) {
      if (!libre && adentro(t, m.index)) continue;
      out.push(fin(t.slice(ini, m.index + m[0].length).trim())); ini = m.index + m[0].length;
    }
    out.push(t.slice(ini).trim());
    return out.filter(function (x) { return x; });
  }
  var MISMO = function (x) { return x; };
  // los trozos que no se parten: oraciones; si una sola no cabe, sus «;» (el trozo termina en punto y el siguiente
  // empieza con mayúscula), luego sus «:», luego sus comas y, si aún no cabe, en el espacio que quepa
  function trozos(t) {
    var out = [];
    function mete(x, nivel) {
      if (x.length <= LIM || nivel > 4) {
        if (x.length <= LIM) { out.push(x); return; }
        while (x.length > LIM) { var k = x.lastIndexOf(' ', LIM); if (k < 1) k = LIM; out.push(x.slice(0, k)); x = x.slice(k).trim(); }
        if (x) out.push(x);
        return;
      }
      var ps = nivel === 0 ? corta(x, /[.!?…][»)"]*\s+(?=[«¿¡"A-ZÁÉÍÓÚÑÜ])/g, MISMO)
        : nivel === 1 ? corta(x, /;\s+/g, function (z) { return z.replace(/;$/, '.'); }).map(function (z, k) { return k ? mayus(z) : z; })
        : nivel === 2 ? corta(x, /:\s+(?=\S)/g, MISMO)
        : corta(x, /,\s+/g, MISMO, nivel === 4);
      if (ps.length < 2) { mete(x, nivel + 1); return; }
      ps.forEach(function (z) { mete(z, nivel + 1); });
    }
    mete(t, 0);
    return out;
  }
  // reparte los trozos en el menor número de partes de hasta LIM letras, lo más parejas que se pueda
  function partes(t) {
    t = String(t || '').trim();
    if (t.length <= LIM) return [t];
    var ts = trozos(t), m = ts.length, pre = [0], a, b, j;
    for (a = 0; a < m; a++) pre.push(pre[a] + ts[a].length + 1);
    function largo(x, y) { return pre[y] - pre[x] - 1; }
    for (var k = Math.max(2, Math.ceil(t.length / LIM)); k <= m; k++) {
      var f = [[0]], de = [[]];
      for (b = 1; b <= m; b++) f[0][b] = Infinity;
      for (j = 1; j <= k; j++) {
        f[j] = []; de[j] = [];
        for (b = 0; b <= m; b++) {
          f[j][b] = Infinity;
          for (a = j - 1; a < b; a++) { var v = Math.max(f[j - 1][a], largo(a, b)); if (v < f[j][b]) { f[j][b] = v; de[j][b] = a; } }
        }
      }
      if (f[k][m] <= LIM) {
        var out = [], y = m;
        for (j = k; j > 0; j--) { a = de[j][y]; out.unshift(ts.slice(a, y).join(' ')); y = a; }
        return out;
      }
    }
    return ts;
  }
  function partePasos(lista) {
    var out = [];
    lista.forEach(function (p) {
      var ps = p && typeof p.texto === 'string' ? partes(p.texto) : [p && p.texto];
      if (ps.length < 2) { out.push(p); return; }
      ps.forEach(function (tx, k) {
        var q = {};
        for (var c in p) if (Object.prototype.hasOwnProperty.call(p, c)) q[c] = p[c];
        q.texto = tx;
        q.titulo = (p.titulo || '') + ' (' + (k + 1) + ' de ' + ps.length + ')';
        if (k) { delete q.antes; q.__sigue = true; }   // lo que se abre antes, solo en la primera parte
        out.push(q);
      });
    });
    return out;
  }
  function corre(def) {
    if (activo || !def || !def.pasos || !def.pasos.length) return Promise.resolve('ocupado');
    // ¿salió solo o lo pidió la persona (el «?», en los últimos segundos)? Solo el que sale solo trae «Ver después»
    var pidio = def.pedido === true || (def.solo == null && pedidoVigente());
    if (pidio) pedidoHasta = 0;
    var solo = !pidio && def.solo !== false, k = clave(def);
    // le dio «Ver después» hace menos de una hora: todavía no; quien lo lanzó lo vuelve a lanzar al cumplirse
    if (solo && despuesFalta(k) > 0) { programa(k, def.otraVez); return Promise.resolve('despues'); }
    activo = true;
    if (!document.getElementById('rc-css')) { var st = document.createElement('style'); st.id = 'rc-css'; st.textContent = CSS; document.head.appendChild(st); }
    var pasos = def.pasos.slice(), i = 0, el = null, antesFoco = document.activeElement, tick = 0, dir = 1;
    // Todos los recorridos terminan recordando dónde está SuperConta (IA) (regla de Daniel, 31-oct-2026, 5:04: «acaba todos
    // los recorridos con recordarles dónde está SuperConta»). El paso lo da quien lo registra con alFinal() (guia_tab.js,
    // el botón «?»); un recorrido que ya es de SuperConta lo apaga con sinCierre: true.
    if (!def.sinCierre && typeof cierre === 'function') {
      try { var ult = cierre(); if (ult && ult.titulo) pasos.push(ult); } catch (e) { /* sin cierre */ }
    }
    pasos = partePasos(pasos);
    var visto = -1;   // el último paso que de verdad se enseñó (para que «(2 de 3)» siga en lo mismo sin volver a abrir nada)
    var capa = document.createElement('div'); capa.className = 'rc-capa';
    capa.innerHTML = '<i class="rc-sa" aria-hidden="true"></i><div class="rc-luz" hidden></div>'
      + '<i class="rc-muro" hidden></i><i class="rc-muro" hidden></i><i class="rc-muro" hidden></i><i class="rc-muro" hidden></i>'
      + '<div class="rc-flecha" hidden>' + FLECHA + '</div><div class="rc-espera" role="status" hidden><i></i>Un momento…</div>'
      + '<div class="rc-globo" role="dialog" aria-modal="true" aria-labelledby="rc-t" aria-describedby="rc-p"><div class="rc-cab"></div><h3 id="rc-t"></h3><p id="rc-p"></p><div class="rc-toca" role="status" hidden></div>'
      + '<div class="rc-pie"><button type="button" class="rc-salta">Saltar</button><button type="button" class="rc-despues" hidden>Ver después</button>'
      + '<span class="rc-n" aria-live="polite"></span><i class="rc-brk" aria-hidden="true"></i><button type="button" class="rc-atras">Atrás</button><button type="button" class="rc-sig">Siguiente</button></div></div>';
    document.body.appendChild(capa);
    var luz = capa.querySelector('.rc-luz'), flecha = capa.querySelector('.rc-flecha'), globo = capa.querySelector('.rc-globo');
    var espera = capa.querySelector('.rc-espera'), texto = capa.querySelector('#rc-p'), sa = capa.querySelector('.rc-sa');
    // las orillas del iPhone (la hora arriba y la rayita de abajo) no cuentan como espacio para el globo
    function orillas() {
      try { var cs = getComputedStyle(sa); return { t: parseFloat(cs.paddingTop) || 0, b: parseFloat(cs.paddingBottom) || 0 }; }
      catch (e) { return { t: 0, b: 0 }; }
    }
    // si el texto no cabe, se desvanece abajo hasta que se desliza al final (así se nota que hay más)
    function masTexto() {
      try { texto.classList.toggle('mas', texto.scrollHeight > texto.clientHeight + 2 && texto.scrollTop + texto.clientHeight < texto.scrollHeight - 2); }
      catch (e) { /* sin aviso */ }
    }
    texto.addEventListener('scroll', masTexto, { passive: true });
    var bAtras = capa.querySelector('.rc-atras'), bSig = capa.querySelector('.rc-sig'), bSalta = capa.querySelector('.rc-salta');
    // un aviso de un solo paso que no abre ni mueve nada (ni menú, ni «antes», ni «de la mano») no lleva el globo de inicio:
    // ese paso ya es el globo, con su «Ver después» (24-nov-2026)
    var unAviso = pasos.length === 1 && !pasos[0].antes && !pasos[0].menu && !pasos[0].haz;
    var bDespues = capa.querySelector('.rc-despues'), enInicio = solo && !unAviso;
    capa.querySelector('.rc-pie').classList.toggle('con-despues', solo);
    // de la mano: los cuatro muros que tapan lo que no es la parte (haz: 'clic'), la línea «Te toca» y quién escucha el clic
    var muros = capa.querySelectorAll('.rc-muro'), toca = capa.querySelector('.rc-toca'), hazAhora = '', docClic = null, yendo = false;
    return new Promise(function (listo) {
      function termina(como) {
        if (!activo) return;
        activo = false; clearInterval(tick);
        escuchaClic(null);
        sueltaMenu();
        removeEventListener('resize', acomoda); removeEventListener('keydown', tecla, true);
        capa.remove();
        try { antesFoco && antesFoco.focus && antesFoco.focus(); } catch (e) { /* sin foco */ }
        // «Ver después»: en una hora (o la próxima vez que entre) vuelve a salir; terminado o saltado, ya no
        if (como === 'despues') { despuesPon(k); programa(k, def.otraVez); }
        else if (como === 'fin' || como === 'saltado') despuesQuita(k);
        listo(como);
      }
      // de la mano, haz: 'clic': cuatro muros transparentes alrededor de la parte; solo ella se puede picar
      function ponMuros(t, vw, vh) {
        var r = t ? [[0, 0, vw, t.y], [0, t.y + t.h, vw, Math.max(0, vh - t.y - t.h)], [0, t.y, t.x, t.h], [t.x + t.w, t.y, Math.max(0, vw - t.x - t.w), t.h]] : [];
        for (var k = 0; k < muros.length; k++) {
          var m = muros[k]; m.hidden = !t;
          if (t) { m.style.left = r[k][0] + 'px'; m.style.top = r[k][1] + 'px'; m.style.width = Math.max(0, r[k][2]) + 'px'; m.style.height = Math.max(0, r[k][3]) + 'px'; }
        }
      }
      // al picar la parte (haz: 'clic') el recorrido sigue solo; el clic le llega a la pantalla como siempre
      function alClic(ev) {
        var p = pasos[i], t = ev.target;
        if (!activo || yendo || hazAhora !== 'clic' || !el || !p || p.listo || !t || t.nodeType !== 1) return;
        if (el !== t && !el.contains(t)) return;
        yendo = true; var n = i;
        setTimeout(function () { if (activo && i === n) muestra(n + 1, 1); }, 120);
      }
      function escuchaClic(d) {
        if (docClic === d) return;
        if (docClic) { try { docClic.removeEventListener('click', alClic, true); } catch (e) { /* ya no está */ } }
        docClic = d;
        if (d) d.addEventListener('click', alClic, true);
      }
      // el modo de la mano según si su parte está: sin parte, sale al centro con «Siguiente», como cualquier paso
      function modo(p) {
        var ultimo = i === pasos.length - 1;
        hazAhora = p && p.haz && el ? p.haz : '';
        capa.classList.toggle('rc-haz', !!hazAhora);
        toca.hidden = !hazAhora;
        if (hazAhora) toca.textContent = p.hazTexto || (hazAhora === 'clic' ? 'Te toca: pícale a lo que está iluminado.' : 'Te toca: hazlo ahí mismo y luego pica «Siguiente».');
        bSig.hidden = hazAhora === 'clic' && !ultimo;
        escuchaClic(hazAhora === 'clic' ? el.ownerDocument : null);
        if (!hazAhora) ponMuros(null);
      }
      // la parte de un paso (o null si no está o no se ve)
      function busca(p) {
        var e = null;
        try { e = typeof p.el === 'function' ? p.el() : document.querySelector(p.el); } catch (x) { e = null; }
        return e && caja(e) ? e : null;
      }
      function acomoda() {
        var p = pasos[i]; if (!p) return;
        var vw = innerWidth, vh = innerHeight, g = el ? caja(el) : null;
        var o = orillas(), m0 = 8 + o.t, m1 = 8 + o.b;
        globo.classList.toggle('centro', !g);
        capa.classList.toggle('sin-luz', !g);
        globo.style.maxHeight = Math.max(160, vh - m0 - m1) + 'px';
        var bw = globo.offsetWidth, bh = globo.offsetHeight;
        masTexto();
        if (!g) {
          luz.hidden = true; flecha.hidden = true; ponMuros(null);
          globo.style.left = Math.round((vw - bw) / 2) + 'px'; globo.style.top = Math.round(Math.max(m0, (vh - bh) / 2)) + 'px';
          return;
        }
        var pad = 6, t = { x: g.x - pad, y: g.y - pad, w: g.w + pad * 2, h: g.h + pad * 2 };
        // una parte enorme (la conversación en el celular): se ilumina lo que se ve
        t.x = clamp(t.x, 4, vw - 8); t.y = clamp(t.y, 4, vh - 8);
        t.w = Math.min(t.w, vw - t.x - 4); t.h = Math.min(t.h, vh - t.y - 4);
        luz.hidden = false;
        luz.style.left = t.x + 'px'; luz.style.top = t.y + 'px'; luz.style.width = t.w + 'px'; luz.style.height = t.h + 'px';
        ponMuros(hazAhora === 'clic' ? t : null, vw, vh);
        var hueco = 52, cx = t.x + t.w / 2, cy = t.y + t.h / 2, lado, x, y;
        if (t.y + t.h + hueco + bh <= vh - m1) lado = 'abajo';
        else if (t.y - hueco - bh >= m0) lado = 'arriba';
        else if (t.x + t.w + hueco + bw <= vw - 8) lado = 'der';
        else if (t.x - hueco - bw >= 8) lado = 'izq';
        else lado = 'encima';
        if (lado === 'abajo' || lado === 'arriba') {
          x = clamp(cx - bw / 2, 8, vw - bw - 8); y = lado === 'abajo' ? t.y + t.h + hueco : t.y - hueco - bh;
        } else if (lado === 'der' || lado === 'izq') {
          y = clamp(cy - bh / 2, m0, vh - bh - m1); x = lado === 'der' ? t.x + t.w + hueco : t.x - hueco - bw;
        } else { x = clamp(cx - bw / 2, 8, vw - bw - 8); y = clamp(vh - bh - 8 - m1, m0, vh - bh - m1); }
        globo.style.left = Math.round(x) + 'px'; globo.style.top = Math.round(y) + 'px';
        // la flechita, entre el globo y la parte, apuntándole
        flecha.hidden = lado === 'encima';
        flecha.className = 'rc-flecha ' + ({ abajo: 'arriba', arriba: 'abajo', der: 'izq', izq: 'der' }[lado] || '');
        if (lado === 'abajo') { flecha.style.left = Math.round(clamp(cx, x + 22, x + bw - 22) - 21) + 'px'; flecha.style.top = Math.round(t.y + t.h + 4) + 'px'; }
        else if (lado === 'arriba') { flecha.style.left = Math.round(clamp(cx, x + 22, x + bw - 22) - 21) + 'px'; flecha.style.top = Math.round(t.y - 46) + 'px'; }
        else if (lado === 'der') { flecha.style.left = Math.round(t.x + t.w + 4) + 'px'; flecha.style.top = Math.round(clamp(cy, y + 22, y + bh - 22) - 21) + 'px'; }
        else if (lado === 'izq') { flecha.style.left = Math.round(t.x - 46) + 'px'; flecha.style.top = Math.round(clamp(cy, y + 22, y + bh - 22) - 21) + 'px'; }
      }
      async function muestra(n, d) {
        dir = d || 1;
        if (n < 0) n = 0;
        if (n >= pasos.length) { termina('fin'); return; }
        i = n; yendo = false;
        var p = pasos[i];
        escuchaClic(null); hazAhora = ''; ponMuros(null);
        // la parte siguiente del mismo paso: se queda con lo que ya está iluminado (sin cerrar ni volver a abrir el menú)
        if (p.__sigue && visto === n - 1 && el && caja(el)) { pinta(p, n); return; }
        globo.style.visibility = 'hidden'; luz.hidden = true; flecha.hidden = true;
        if (sueltaMenu()) await dormir(220);
        if (!activo || i !== n) return;
        if (p.antes) {
          // mientras se abre lo que sigue (por ejemplo, el chat), la pantalla se oscurece y dice «Un momento…»
          capa.classList.add('sin-luz'); espera.hidden = false;
          try { await Promise.race([p.antes(), new Promise(function (ok) { setTimeout(ok, 6000); })]); } catch (e) { /* sigue */ }
          espera.hidden = true;
        }
        if (!activo || i !== n) return;
        el = null;
        if (p.menu) {
          el = await abreMenu(p.menu, p.sub);
          if (!activo || i !== n) return;
          if (!el || !aLaVista(el)) { sueltaMenu(); el = null; }
          if (!el && !p.el) { muestra(n + dir, dir); return; }   // ese módulo no está en su menú: se brinca
        }
        if (!el && p.el) {
          el = busca(p);
          // de la mano: lo que se abre después de un clic (una ventana que pide sus datos) tarda; se espera, con «Un momento…»
          var ms = 0; try { ms = typeof p.espera === 'function' ? +p.espera() || 0 : +p.espera || 0; } catch (x) { ms = 0; }
          if (!el && ms > 0 && dir > 0) {
            capa.classList.add('sin-luz'); espera.hidden = false;
            for (var h = Date.now() + ms; !el && Date.now() < h;) { await dormir(200); if (!activo || i !== n) return; el = busca(p); }
            espera.hidden = true;
          }
          if (el) { dentro(el); if (!aLaVista(el)) el = null; }
          if (!el) {
            // siNo: sale al centro con su texto («Siguiente»); si no, se brinca como siempre
            if (p.siNo) { pinta(Object.assign({}, p, p.siNo, { haz: '' }), n); return; }
            muestra(n + dir, dir); return;                           // no está a la vista: se brinca
          }
        }
        pinta(p, n);
      }
      function pinta(p, n) {
        visto = n;
        capa.querySelector('.rc-cab').innerHTML = (p.icono && ICONOS[p.icono] ? '<span class="rc-ic">' + ICONOS[p.icono] + '</span>' : '')
          + (p.etiqueta ? '<span class="rc-et">' + esc(p.etiqueta) + '</span>' : '');
        capa.querySelector('.rc-cab').hidden = !(p.icono || p.etiqueta);
        capa.querySelector('#rc-t').textContent = p.titulo || '';
        texto.textContent = p.texto || ''; texto.scrollTop = 0;
        capa.querySelector('.rc-n').textContent = (i + 1) + ' de ' + pasos.length;
        bAtras.hidden = i === 0 || !!p.sinAtras;
        var ultimo = i === pasos.length - 1;
        bSig.textContent = ultimo ? (def.fin || 'Terminar') : 'Siguiente';
        bSalta.hidden = ultimo || !!def.obligatorio;
        bDespues.hidden = !solo;
        modo(p);
        // si estaba escondido (se abrió algo antes), aparece ya en su lugar, sin resbalar desde donde estaba
        var oculto = globo.style.visibility === 'hidden';
        if (oculto) globo.style.transition = 'none';
        acomoda();
        if (oculto) { void globo.offsetHeight; globo.style.transition = ''; }
        globo.style.visibility = '';
        // de la mano, el foco se queda en la pantalla (lo que la persona va a usar); si no, en «Siguiente»
        if (!hazAhora) { try { bSig.focus({ preventScroll: true }); } catch (e) { /* sin foco */ } }
      }
      // el globo de inicio del que sale solo: al centro, sin abrir ni mover nada de la pantalla
      function pintaInicio() {
        visto = -1; i = 0; el = null;
        escuchaClic(null); hazAhora = ''; capa.classList.remove('rc-haz'); toca.hidden = true; ponMuros(null);
        var p0 = def.pasos[0] || {}, n = pasos.length, mano = pasos.some(function (x) { return x && x.haz; });
        var nom = String(def.nombre || p0.titulo || '').replace(/\s*\(\d+ de \d+\)$/, '') || 'Un recorrido para ti';
        capa.querySelector('.rc-cab').innerHTML = (p0.icono && ICONOS[p0.icono] ? '<span class="rc-ic">' + ICONOS[p0.icono] + '</span>' : '')
          + '<span class="rc-et">' + esc(p0.etiqueta || 'Recorrido') + '</span>';
        capa.querySelector('.rc-cab').hidden = false;
        capa.querySelector('#rc-t').textContent = nom;
        texto.textContent = 'Te lo enseño paso a paso' + (mano ? ': tú vas picando en la pantalla y el recorrido sigue solo' : '')
          + ' (' + n + (n === 1 ? ' paso' : ' pasos') + '). ¿Lo vemos ahora? Si estás en medio de algo, pica «Ver después»: te quedas'
          + ' donde estás y te lo vuelvo a enseñar en un rato.' + (def.obligatorio ? ' Es importante: te lo seguiré enseñando hasta que lo termines.' : '');
        texto.scrollTop = 0;
        capa.querySelector('.rc-n').textContent = '';
        bAtras.hidden = true; bSig.hidden = false; bSig.textContent = 'Empezar';
        bSalta.hidden = !!def.obligatorio; bDespues.hidden = false;
        globo.style.transition = 'none'; acomoda(); void globo.offsetHeight; globo.style.transition = '';
        globo.style.visibility = '';
        try { bSig.focus({ preventScroll: true }); } catch (e) { /* sin foco */ }
      }
      function empieza() { enInicio = false; muestra(0, 1); }
      function tecla(ev) {
        if (hazAhora && ev.key !== 'Escape') return;   // de la mano: el teclado es de la pantalla
        if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); if (!def.obligatorio) termina('saltado'); }
        else if (ev.key === 'ArrowRight') { ev.preventDefault(); ev.stopPropagation(); if (enInicio) empieza(); else muestra(i + 1, 1); }
        else if (ev.key === 'ArrowLeft' && i > 0 && !enInicio) { ev.preventDefault(); ev.stopPropagation(); muestra(i - 1, -1); }
        else if (ev.key === 'Tab') {
          var bs = Array.prototype.filter.call(globo.querySelectorAll('button'), function (b) { return !b.hidden; });
          var k = bs.indexOf(document.activeElement);
          ev.preventDefault(); (bs[(k + (ev.shiftKey ? -1 : 1) + bs.length) % bs.length] || bSig).focus();
        }
      }
      bSig.onclick = function () { if (enInicio) empieza(); else muestra(i + 1, 1); };
      bAtras.onclick = function () { muestra(i - 1, -1); };
      bSalta.onclick = function () { if (!def.obligatorio) termina('saltado'); };
      bDespues.onclick = function () { termina('despues'); };
      addEventListener('resize', acomoda);
      addEventListener('keydown', tecla, true);
      tick = setInterval(function () {   // sigue a la parte si algo se mueve
        if (!activo || globo.style.visibility === 'hidden') return;
        var p = pasos[i];
        if (p && p.haz && p.el && visto === i) {
          // de la mano: la pantalla se volvió a pintar (otro RFC, una búsqueda): se busca otra vez la parte
          if ((el && !el.isConnected) || !el) {
            var antes0 = el; el = busca(p);
            if (el || antes0) pinta(el || !p.siNo ? p : Object.assign({}, p, p.siNo, { haz: '' }), i);
          }
          // listo(): ya lo hizo (palomeó una factura, se cerró la ventana): sigue solo
          if (p.listo && !yendo) { var ok = false; try { ok = !!p.listo(); } catch (e) { ok = false; } if (ok) { yendo = true; muestra(i + 1, 1); return; } }
        }
        acomoda();
      }, 400);
      if (enInicio) { globo.style.visibility = 'hidden'; pintaInicio(); } else muestra(0, 1);
    });
  }
  // Un recorrido de lo nuevo, una sola vez por persona (31-oct-2026): el flujo de siempre de los recorridos de lo nuevo
  // (después de su ventana de «Nuevos cambios», o al entrar si ya la cerró; nunca encima de otra ventana ni de otro
  // recorrido; visto con recorrido_visto() y, en solo consulta, en su navegador), en un solo lugar para no repetirlo en
  // cada pestaña. o = { id, liga, laVe: async (PORTAL, perfil) => true|false, pasos: [...] o async () => [...], fin, sinCierre,
  // obligatorio }. Con obligatorio: true (solo cuando Daniel lo pide) va sin «Saltar» ni Esc y solo cuenta como visto al
  // llegar al final: si se interrumpe, vuelve a salir la próxima vez.
  function unaVez(o) {
    var dormir = function (ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); };
    function vistoLocal() { try { return (JSON.parse(localStorage.getItem('profase-recorridos') || '[]') || []).indexOf(o.id) >= 0; } catch (e) { return false; } }
    async function marcaVisto() {
      var ok = false;
      try { var r = await window.PORTAL.sb.rpc('recorrido_visto', { p_recorrido: o.id }); ok = !r.error && r.data === true; } catch (e) { /* sin red */ }
      if (!ok) { try { var a = JSON.parse(localStorage.getItem('profase-recorridos') || '[]') || []; if (a.indexOf(o.id) < 0) a.push(o.id); localStorage.setItem('profase-recorridos', JSON.stringify(a)); } catch (e) { /* sin almacenamiento */ } }
    }
    async function vistos() { try { var r = await window.PORTAL.sb.rpc('recorridos_mios'); return r.error || !Array.isArray(r.data) ? null : r.data; } catch (e) { return null; } }
    function hayVentana() {
      return Array.prototype.some.call(document.querySelectorAll('[aria-modal="true"]'), function (d) {
        if (d.closest('.rc-capa') || !d.getClientRects().length) return false;
        var cs = getComputedStyle(d); return cs.visibility !== 'hidden' && +cs.opacity > 0.05;
      });
    }
    // a medio escribir (PORTAL.escribiendo: la minuta de una reunión) tampoco se empieza un recorrido
    function escribiendo() { try { var p = window.PORTAL; return !!(p && p.estaEscribiendo && p.estaEscribiendo()); } catch (e) { return false; } }
    // mientras la vista dice «Abriendo…» (construir.py, con_abriendo(); 6-nov-2026) lo de abajo está tapado: se espera
    function abriendo() { return document.documentElement.classList.contains('pm-cargando'); }
    function ocupado() { return hayVentana() || document.hidden || activo || escribiendo() || primeroFalta() || abriendo(); }
    var esperando = false;
    async function quiza(desdeAviso) {
      if (esperando) return;
      esperando = true;
      try {
        var P = window.PORTAL; if (!P) return;
        var p = await P.listo; if (!p) return;
        // Revisión nocturna 12-nov-2026: primero «¿ya lo vio?» (una sola pregunta para toda la página, guardada 5 s en
        // js/portal.js) y luego laVe(), que a veces le pregunta algo más a la base (rh_sol_mias, ~0.3 s): antes se
        // preguntaba laVe() de cada recorrido en cada entrada aunque ya lo hubiera visto. Sale el mismo recorrido.
        var v = await vistos(); if (!v || v.indexOf(o.id) >= 0 || vistoLocal()) return;
        if (!(await o.laVe(P, p))) return;
        // le dio «Ver después» hace menos de una hora: vuelve a salir al cumplirse (o la próxima vez que entre)
        if (despuesFalta(o.id) > 0) { programa(o.id, function () { quiza(true); }); return; }
        if (!desdeAviso) await dormir(6000);   // al entrar: primero sale la ventana de «Nuevos cambios», si la hay
        // espera a que no haya ventanas ni otro recorrido; un respiro (distinto para cada uno, para no encimarse) y otra vez
        for (var n = 0; n < 6; n++) {
          for (var i = 0; i < 3600 && ocupado(); i++) await dormir(500);
          await dormir(400 + Math.floor(Math.random() * 1200));
          if (!ocupado()) break;
        }
        if (ocupado()) return;
        var pasos = typeof o.pasos === 'function' ? await o.pasos() : o.pasos;
        if (!pasos || !pasos.length) return;
        var como = await corre({ pasos: pasos, fin: o.fin || '¡Listo!', obligatorio: !!o.obligatorio, sinCierre: !!o.sinCierre,
                                 solo: true, id: o.id, otraVez: function () { quiza(true); } });
        if (como === 'fin' || (como === 'saltado' && !o.obligatorio)) marcaVisto();
      } catch (e) { /* un recorrido nunca rompe la página */ } finally { esperando = false; }
    }
    addEventListener('profase:novedad-cerrada', function (ev) {
      var l = (ev.detail && ev.detail.ligas) || [];
      if (o.liga && l.indexOf(o.liga) >= 0) setTimeout(function () { quiza(true); }, 2000);
    });
    quiza(false);
  }
  window.PROFASE_RECORRIDO = { corre: corre, activo: function (real) { return activo || (!real && primeroFalta()); },
                                primero: function (fn) { if (typeof fn === 'function') primeros.push(fn); }, primeroFalta: primeroFalta,
                                aLaVista: aLaVista, sePuede: sePuede, unaVez: unaVez, partes: partePasos,
                                alFinal: function (fn) { cierre = typeof fn === 'function' ? fn : null; },
                                // el «?» (y cualquier botón que lo enseñe a petición) lo llama antes de lanzar uno: sin «Ver después»
                                pedido: function () { pedidoHasta = Date.now() + 15000; },
                                // cuánto falta (ms) para que vuelva a salir uno al que le dieron «Ver después» (0: ya puede)
                                despues: function (id) { return despuesFalta(String(id)); } };
})();
