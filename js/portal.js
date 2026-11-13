/* Portal PROFASE: sesión, permisos y base de datos.
   Las páginas del equipo se escribieron para la base de Claude (window.claude.use('db'|'user'|'downloads')).
   Aquí se da esa misma interfaz encima de Supabase, para que la página funcione igual fuera de Claude.
   La llave publicable es pública por diseño: lo que cada quien puede leer o escribir lo cuidan las reglas
   de la base (RLS) según su rol, no esta página. */

/* ---- Horas: siempre en formato de 24 horas y en hora de Monterrey (regla de Héctor Daniel, 31-oct-2026, 6:40:
   «Quiero que todo lo relacionado a horas en el CRM sea en formato 24 horas y siempre hora MTY; cambia todas las
   pantallas o donde se vea esto y déjalo escrito que siempre será 24 horas, tanto lo nuevo como lo viejo»).
   Va aquí, una sola vez para todo el portal y antes que todo lo demás (aunque la base no conteste): cualquier fecha
   con hora que una página o pestaña escriba con Intl.DateTimeFormat, toLocaleString o toLocaleTimeString sale con
   reloj de 24 horas (de 00:00 a 23:59, con dos dígitos; nunca «a. m.» ni «p. m.», nunca «24:00») y, si la página no
   dijo la zona, en la de Monterrey, abra quien abra y desde donde sea. Lo que es solo fecha (sin hora) no se toca.
   Para lo nuevo: window.PROFASE_HORA (abajo). construir.py (exige_24h()) cuida que nadie lo quite ni vuelva a las
   12 horas, y herramientas/pruebas/pantallas/prueba_24h.py lo comprueba en un navegador. ---- */
(function horas24() {
  'use strict';
  var ZONA = 'America/Monterrey';
  var I = window.Intl;
  if (!I || !I.DateTimeFormat || I.DateTimeFormat.__h24) return;
  var Orig = I.DateTimeFormat;
  var DE_HORA = ['hour', 'minute', 'second', 'fractionalSecondDigits', 'dayPeriod', 'timeStyle'];
  var DE_FECHA = ['weekday', 'era', 'year', 'month', 'day', 'dateStyle'];
  function trae(o, l) { for (var i = 0; i < l.length; i++) if (o[l[i]] !== undefined) return true; return false; }
  // porOmision: si sin campos la fecha sale con hora (toLocaleString y toLocaleTimeString sí; Intl.DateTimeFormat no)
  function ajusta(o, porOmision) {
    var x = o == null ? {} : Object(o);
    if (!(trae(x, DE_HORA) || (porOmision && !trae(x, DE_FECHA)))) return o;
    var n = {};
    for (var k in x) n[k] = x[k];
    delete n.hour12;                          // hour12 le gana a hourCycle; con él algunos navegadores ponen «24:00»
    n.hourCycle = 'h23';
    if (n.hour === 'numeric') n.hour = '2-digit';
    if (!n.timeZone) n.timeZone = ZONA;
    return n;
  }
  function DTF(locales, o) { return new Orig(locales, ajusta(o, false)); }
  DTF.prototype = Orig.prototype;
  DTF.supportedLocalesOf = Orig.supportedLocalesOf;
  try { Object.defineProperty(DTF, '__h24', { value: true }); } catch (e) { DTF.__h24 = true; }
  try { Object.defineProperty(I, 'DateTimeFormat', { value: DTF, writable: true, configurable: true }); } catch (e) { I.DateTimeFormat = DTF; }
  var D = Date.prototype;
  [['toLocaleString', true], ['toLocaleTimeString', true], ['toLocaleDateString', false]].forEach(function (m) {
    var f = D[m[0]];
    if (typeof f !== 'function') return;
    D[m[0]] = function (locales, o) { return f.call(this, locales, ajusta(o, m[1])); };
  });

  function dos(n) { return (n < 10 ? '0' : '') + n; }
  function fecha(d) { d = d instanceof Date ? d : new Date(d); return isNaN(d) ? null : d; }
  function partes(d) {
    var p = {};
    new Orig('en-US', { timeZone: ZONA, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })
      .formatToParts(d).forEach(function (x) { p[x.type] = x.value; });
    return { anio: +p.year, mes: +p.month, dia: +p.day, hora: +p.hour % 24, min: +p.minute, seg: +p.second };
  }
  function valida(v) {               // «9:5», «0905», «21:30» → «09:05», «21:30»; vacío → ''; otra cosa → null
    var s = String(v == null ? '' : v).trim();
    if (!s) return '';
    var m = s.match(/^(\d{1,2})(?:[:.h](\d{1,2}))?$/) || s.match(/^(\d{2})(\d{2})$/);
    if (!m) return null;
    var h = +m[1], mi = m[2] == null ? 0 : +m[2];
    return h > 23 || mi > 59 ? null : dos(h) + ':' + dos(mi);
  }
  var ES = 'width:auto;min-width:4.6em;padding:8px 6px;border:1px solid var(--line-2,#CBD5E1);border-radius:8px;background:var(--surface,#fff);color:inherit';
  window.PROFASE_HORA = {
    ZONA: ZONA,
    // «18:40», en hora de Monterrey
    hora: function (d) { d = fecha(d); if (!d) return ''; var p = partes(d); return dos(p.hora) + ':' + dos(p.min); },
    // «31 oct 2026, 18:40» (sin el año: anio = false)
    fechaHora: function (d, anio) {
      d = fecha(d); if (!d) return '';
      var o = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
      if (anio !== false) o.year = 'numeric';
      return new DTF('es-MX', o).format(d).replace(/\./g, '');
    },
    // «2026-10-31»: el día en Monterrey
    dia: function (d) { d = fecha(d); if (!d) return ''; var p = partes(d); return p.anio + '-' + dos(p.mes) + '-' + dos(p.dia); },
    // Para una celda de Excel con hora: Excel no sabe de zonas y enseña la hora tal cual viene, así que se le pasa
    // la hora de Monterrey (si no, salía la hora de Londres, 6 horas adelante).
    excel: function (d) { d = fecha(d); if (!d) return null; var p = partes(d); return new Date(Date.UTC(p.anio, p.mes - 1, p.dia, p.hora, p.min, p.seg)); },
    valida: valida,
    // Campo para capturar una hora, siempre de 24 horas (el campo de hora propio del navegador sale con «a. m./p. m.»
    // en muchos equipos). Hora (-- y 00 a 23) y minutos (de 5 en 5, más el que ya traiga). Se lee con lee().
    campo: function (id, valor, opcional) {
      var v = valida(valor) || '', h = v ? v.slice(0, 2) : '', mi = v ? v.slice(3, 5) : '00', i, x;
      var hs = opcional === false ? '' : '<option value="">--</option>';
      for (i = 0; i < 24; i++) { x = dos(i); hs += '<option value="' + x + '"' + (x === h ? ' selected' : '') + '>' + x + '</option>'; }
      var lista = [];
      for (i = 0; i < 60; i += 5) lista.push(dos(i));
      if (lista.indexOf(mi) < 0) { lista.push(mi); lista.sort(); }
      var ms = lista.map(function (y) { return '<option value="' + y + '"' + (y === mi ? ' selected' : '') + '>' + y + '</option>'; }).join('');
      return '<span class="ph-hora" style="display:inline-flex;align-items:center;gap:4px;flex-wrap:nowrap">'
        + '<select id="' + id + '" aria-label="Hora (de 00 a 23)" style="' + ES + '">' + hs + '</select>'
        + '<b aria-hidden="true">:</b>'
        + '<select id="' + id + '-m" aria-label="Minutos" style="' + ES + '">' + ms + '</select>'
        + '<small style="margin-left:2px">h</small></span>';
    },
    lee: function (raiz, id) {
      var r = raiz || document, h = r.querySelector('#' + id), m = r.querySelector('#' + id + '-m');
      if (!h || !h.value) return '';
      return h.value + ':' + (m && m.value ? m.value : '00');
    }
  };
})();

(function () {
  'use strict';
  var SB_URL = 'https://arbykgauatkldznwwtjx.supabase.co';
  var SB_KEY = 'sb_publishable_gUzFFB-YnzC5AOFOK_-H9Q_jBbDUzG5';
  var DOMINIO = '@usuarios.profase.com.mx';
  var PAGINA = { director: 'director.html', gerente: 'gerentes.html', contador: 'contadores.html' };
  // El director (Daniel) también puede abrir la vista de los gerentes
  var TAMBIEN = { gerente: ['director'] };
  // Páginas que no son de un rol: las abre quien tenga permiso en la base, sea gerente, contador o director
  // (cot_lee: quien usa el cotizador, o quien tiene la vista del equipo en consulta, que solo lo ve)
  var LIBRE = { cotizador: 'cot_lee' };
  var ROL = document.documentElement.getAttribute('data-rol') || '';
  var CADA = 20000; // revisa cambios cada 20 s mientras la página está a la vista

  /* ---- Ícono del portal (28-oct-2026, noche): el signo PROFASE para la pantalla de inicio del iPhone o iPad, Android y
     la pestaña del navegador. Sin esto el teléfono ponía una «P» genérica. index.html ya lo trae escrito; aquí se
     pone en las demás páginas (las arma construir.py), solo en la página principal y no en las pestañas en marco.
     Además, /apple-touch-icon.png en la raíz lo toma el iPhone aunque una página no lo declare. ---- */
  (function icono() {
    if (window.parent !== window || !document.head) return;
    function liga(rel, href, extra) {
      if (document.head.querySelector('link[rel="' + rel + '"]')) return;
      var l = document.createElement('link'); l.rel = rel; l.href = href;
      for (var k in (extra || {})) l.setAttribute(k, extra[k]);
      document.head.appendChild(l);
    }
    function meta(name, content) {
      if (document.head.querySelector('meta[name="' + name + '"]')) return;
      var m = document.createElement('meta'); m.name = name; m.content = content; document.head.appendChild(m);
    }
    liga('apple-touch-icon', '/apple-touch-icon.png', { sizes: '180x180' });
    liga('manifest', '/manifest.webmanifest');
    liga('icon', '/img/icono-48.png', { type: 'image/png' });
    meta('apple-mobile-web-app-title', 'CRM PROFASE');
    meta('application-name', 'CRM PROFASE');
  })();

  var sb = window.supabase.createClient(SB_URL, SB_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'profase-portal' }
  });

  var P = { sb: sb, DOMINIO: DOMINIO, perfil: null, uid: null, consulta: false };
  window.PORTAL = P;

  /* ---- Un solo menú abierto a la vez (regla de Daniel, 30-oct-2026, 16:40: «corrige este tipo de errores; que no se
     entrelapen»; el menú de la foto salía encima de la campanita abierta). Cada menú o lista que se despliega (el de la
     foto, la campanita, las tarjetas del menú, los filtros, «Con marca / Original», las opciones de un mensaje del
     chat…) avisa al abrirse con P.abreMenu('su-nombre') y escucha el evento 'profase-menu': si se abrió otro, se cierra.
     El aviso cruza entre la página y sus pestañas (marcos): un toque dentro de una pestaña cierra los menús de afuera
     y uno afuera cierra los de las pestañas, aunque el clic no llegue del otro lado. ---- */
  var EV_MENU = 'profase-menu';
  function avisaMenu(doc, quien) {
    try { doc.dispatchEvent(new doc.defaultView.CustomEvent(EV_MENU, { detail: quien })); } catch (e) { /* sin marco */ }
  }
  function menuAMarcos(quien, doc, nivel) {
    doc = doc || document; nivel = nivel || 0;
    if (nivel > 3) return;
    doc.querySelectorAll('iframe').forEach(function (f) {
      try {
        var d = f.contentDocument;
        if (d && d.defaultView) { avisaMenu(d, quien); menuAMarcos(quien, d, nivel + 1); }
      } catch (e) { /* marco de otro sitio */ }
    });
  }
  function menuAFuera() {
    // a la página que contiene esta pestaña y, si es pestaña de otra pestaña (QUO), también a la de más afuera
    try { for (var w = window, n = 0; w.parent && w.parent !== w && n < 4; w = w.parent, n++) avisaMenu(w.parent.document, 'marco'); } catch (e) { /* otro sitio */ }
  }
  P.abreMenu = function (quien) {
    avisaMenu(document, String(quien || 'menu'));
    menuAMarcos('afuera');
    menuAFuera();
  };
  document.addEventListener('pointerdown', function () { menuAMarcos('afuera'); menuAFuera(); }, true);

  /* ---- Con el dedo, se desliza el recuadro que flota, nunca la pantalla de abajo (Héctor Daniel, 4-nov-2026, 6:49, con
     una captura de su iPhone con la campanita abierta: «al querer subir y bajar … en el centro de notificaciones, se
     mueve la pantalla de abajo no como tal el menú de notificaciones»). En el iPhone y el iPad, cuando el dedo iba sobre
     una parte del recuadro que no se desliza (su título, sus pestañas, «Ver todas») o la lista ya estaba hasta arriba o
     hasta abajo, el movimiento se iba de largo a la pantalla de abajo (o al rebote del iPhone) y el recuadro se quedaba
     quieto. P.deslizaDentro(recuadro) lo arregla, para lo de hoy y lo nuevo: con el dedo dentro del recuadro solo se
     desliza lo que, bajo el dedo, todavía puede deslizarse hacia ese lado; si nada puede, no se mueve nada. Lo usan la
     campanita, la Ayuda, el menú de la foto y el ☰ del celular (con su fondo oscuro); un recuadro flotante nuevo que se
     desliza lo llama una vez al crearse y a su lista le pone overscroll-behavior: contain (una sola versión: no hagas
     otra). No toca dos dedos (acercar con los dedos sigue igual), la pantalla ya acercada ni los campos de texto, y no
     hace más lento nada: solo revisa mientras el dedo está dentro del recuadro. construir.py (exige_desliza_dentro())
     lo cuida y herramientas/pruebas/pantallas/prueba_desliza_dentro.py (en profase-datos) lo comprueba. ---- */
  function puedeIr(n, tope, dx, dy) {
    for (; n && n.nodeType === 1; n = n.parentElement) {
      var cs = n.ownerDocument.defaultView.getComputedStyle(n);
      if (dy && /(auto|scroll|overlay)/.test(cs.overflowY) && n.scrollHeight > n.clientHeight + 1
        && (dy > 0 ? n.scrollTop > 0.5 : n.scrollTop + n.clientHeight < n.scrollHeight - 1)) return true;
      if (dx && /(auto|scroll|overlay)/.test(cs.overflowX) && n.scrollWidth > n.clientWidth + 1
        && (dx > 0 ? n.scrollLeft > 0.5 : n.scrollLeft + n.clientWidth < n.scrollWidth - 1)) return true;
      if (n === tope) break;
    }
    return false;
  }
  function acercada() { try { var v = window.visualViewport; return !!(v && v.scale > 1.01); } catch (e) { return false; } }
  P.deslizaDentro = function (el) {
    if (!el || el.__ptDentro) return el;
    el.__ptDentro = true;
    // Se decide una sola vez por toque, cuando el dedo ya se movió 6 px (un temblor del dedo no cuenta): hacia dónde
    // va, y si bajo el dedo hay algo que pueda deslizarse hacia allá. Si no lo hay, ese toque no mueve nada.
    var x0 = 0, y0 = 0, decide = 0;   // 0: aún no; 1: que se deslice lo de adentro; 2: no se mueve nada
    el.addEventListener('touchstart', function (e) {
      var t = e.touches[0];
      x0 = t ? t.clientX : 0; y0 = t ? t.clientY : 0;
      decide = e.touches.length !== 1 || acercada()
        || !!(e.target && e.target.closest && e.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) ? 1 : 0;
    }, { passive: true });
    el.addEventListener('touchmove', function (e) {
      if (e.touches.length !== 1) decide = 1;
      if (decide === 1) return;
      if (!decide) {
        var t = e.touches[0], dx = t.clientX - x0, dy = t.clientY - y0;
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        var ver = Math.abs(dy) >= Math.abs(dx);
        decide = puedeIr(e.target, el, ver ? 0 : dx, ver ? dy : 0) ? 1 : 2;
        if (decide === 1) return;
      }
      if (e.cancelable) e.preventDefault();
    }, { passive: false });
    return el;
  };

  /* ---- Confeti, una sola pieza (Héctor Daniel Nava, 12-nov-2026, 11:07: «hay manera que pongas confetti al aviso?», de la
     ventana de cumpleaños de las 9:00). Nació en la bienvenida «¡Adiós Access, hola CRM!» (adios_access_tab.js, 31-oct-2026)
     y desde ese día vive aquí: la usan esa bienvenida y la ventana de cumpleaños (cal_tab.js); lo nuevo que quiera confeti
     la usa, no hace otro. P.confeti(capa, op) pone un lienzo de pantalla completa dentro de «capa» (no se puede picar:
     pointer-events none) con los colores de PROFASE y regresa { estalla(x, y), fin(espera) }: estalla() lanza confeti
     hacia arriba desde ese punto (sin punto, del centro un poco abajo) y fin() lo quita. op: cantidad (lo que cae al
     abrir, 180), goteo (cuánto sigue cayendo de arriba, en ms; 25000), ritmo (qué tanto gotea, 0 a 1; .5), fuerza (qué
     tan alto sale lo de estalla(); 7), dura (a los cuántos ms se desvanece, aunque algo siga cayendo; sin dura, hasta
     que ya no cae nada), z (z-index del lienzo; 0 = detrás de lo que sigue en la capa), id, y solo (true: se quita solo
     al terminar). Con «reducir movimiento» en el equipo no pone nada. Mientras la pestaña no se ve, el navegador lo
     detiene solo. ---- */
  var CONFETI_COL = ['#F07A1E', '#ffffff', '#9ec1ff', '#ffb46b', '#3f6fc7', '#ffd166'];
  P.confeti = function (capa, op) {
    op = op || {};
    var nada = { estalla: function () {}, fin: function () {} };
    try { if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return nada; } catch (e) { /* sin matchMedia */ }
    if (!capa || !capa.appendChild) return nada;
    var cv = document.createElement('canvas');
    if (op.id) cv.id = op.id;
    cv.setAttribute('aria-hidden', 'true');
    cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:' + (+op.z || 0);
    var cx = cv.getContext && cv.getContext('2d');
    if (!cx) return nada;
    capa.appendChild(cv);
    var W = 0, H = 0, dpr = Math.min(2, window.devicePixelRatio || 1), ps = [], vivo = true, corre = false, t0 = 0;
    var goteo = op.goteo == null ? 25000 : +op.goteo, ritmo = op.ritmo == null ? 0.5 : +op.ritmo;
    var fuerza = op.fuerza == null ? 7 : +op.fuerza, dura = +op.dura || 0;
    function mide() { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    mide(); addEventListener('resize', mide);
    function uno(x, y, v) {
      return { x: x, y: y, vx: (Math.random() - 0.5) * (v || 2), vy: v ? -(Math.random() * v * 2.2 + v) : Math.random() * 1.5 + 1,
        r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.25, w: 6 + Math.random() * 7, h: 4 + Math.random() * 5,
        c: CONFETI_COL[(Math.random() * CONFETI_COL.length) | 0], o: Math.random() * Math.PI * 2 };
    }
    function quita() { vivo = false; removeEventListener('resize', mide); if (cv.parentNode) cv.parentNode.removeChild(cv); }
    function paso(t) {
      if (!vivo) { corre = false; return; }
      if (!t0) t0 = t;
      cx.clearRect(0, 0, W, H);
      if (dura && t - t0 > dura) {   // se acabó su tiempo: se desvanece en menos de un segundo
        var a = 1 - (t - t0 - dura) / 900;
        if (a <= 0) { ps = []; corre = false; cx.globalAlpha = 1; if (op.solo) quita(); return; }
        cx.globalAlpha = a;
      }
      var gotea = t - t0 < goteo;
      if (gotea && ps.length < 260 && Math.random() < ritmo) ps.push(uno(Math.random() * W, -12));
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i];
        p.vy += 0.035; p.vx *= 0.995; p.x += p.vx + Math.sin(p.o += 0.05) * 0.6; p.y += p.vy; p.r += p.vr;
        cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c;
        cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.o))); cx.restore();
      }
      ps = ps.filter(function (p) { return p.y < H + 30; });
      if (!gotea && !ps.length) {   // ya no cae nada: se detiene (y, con «solo», se quita)
        corre = false; cx.clearRect(0, 0, W, H);
        if (op.solo) quita();
        return;
      }
      requestAnimationFrame(paso);
    }
    function arranca() { if (vivo && !corre) { corre = true; requestAnimationFrame(paso); } }
    var n = op.cantidad == null ? 180 : +op.cantidad;
    for (var k = 0; k < n; k++) ps.push(uno(Math.random() * W, -20 - Math.random() * H * 0.6));
    arranca();
    return {
      estalla: function (x, y) {
        if (!vivo) return;
        var ancho = x == null ? W * 0.3 : Math.min(W * 0.3, 160);   // del centro, a lo ancho; de un punto, más junto
        x = x == null ? W / 2 : +x; y = y == null ? H * 0.62 : +y;
        for (var j = 0; j < 220; j++) ps.push(uno(x + (Math.random() - 0.5) * ancho, y, fuerza));
        arranca();
      },
      fin: function (espera) { setTimeout(quita, espera || 0); }
    };
  };

  /* ---- El signo PROFASE lleva al Inicio (regla de Daniel, 31-oct-2026, 16:18 y 16:23: «si desde ahí le pico al logo de
     profase; me mandes a home… ponlo para todo lo nuevo y todo lo viejo»; «y también en la ipad y laptop»). En cualquier
     pantalla (celular, iPad, computadora), picar el signo de arriba de una vista (o su «PROFASE · Asesoría Contable, Legal y
     Fiscal»), el del menú ☰, el de una página abierta sola o el de la barra de una pestaña (QUO › Membresías) lleva al Inicio de quien entró: dentro de una vista, con el
     menú (PORTAL_MENU.alInicio(), js/menu.js), aunque se pique desde una pestaña en marco; en una página abierta sola,
     a su vista (#inicio). El adorno de temporada junto al signo (.ptc-adorno, js/temporada.js) ya no lleva: al picarlo
     dice qué día es («¡Feliz Día de Muertos!»; Daniel, 31-oct-2026, 20:48 y 20:56); lo demás de su caja sí. El signo no
     cambia (sigue siendo la imagen oficial); solo se puede picar. No llevan al Inicio: la entrada, la pantalla de cierre,
     las ventanas de bienvenida y los documentos (cotizaciones, PDF). Un signo nuevo de encabezado usa una de estas
     clases o data-al-inicio. construir.py (exige_signo_inicio()) lo cuida. ---- */
  var SIGNO_INICIO = '.band img.logo, .band img#logo, .pm-cab img, .pm-cab > span:not(.ptc-caja), .band .brandtxt, .topbar .brand img.mark, [data-al-inicio]';
  P.alInicio = function () {
    try {
      var t = window.top;
      if (t.PORTAL_MENU && t.PORTAL_MENU.alInicio && t.PORTAL_MENU.alInicio()) return true;
    } catch (e) { /* marco de otro sitio */ }
    var rol = P.perfil ? (P.perfil.rolReal || P.perfil.rol) : ROL;
    var a = PAGINA[rol] ? PAGINA[rol] + '#inicio' : './';
    try { window.top.location.href = a; } catch (e) { location.href = a; }
    return true;
  };
  P.signoInicio = function (raiz) {
    (raiz && raiz.matches && raiz.matches(SIGNO_INICIO) ? [raiz] : (raiz || document).querySelectorAll(SIGNO_INICIO)).forEach(function (el) {
      if (el.getAttribute('data-inicio-listo')) return;
      el.setAttribute('data-inicio-listo', '1');
      el.setAttribute('role', 'link'); el.setAttribute('tabindex', '0');
      el.setAttribute('title', 'Ir al Inicio'); el.setAttribute('aria-label', 'PROFASE · Ir al Inicio');
    });
  };
  (function signoAlInicio() {
    var st = document.createElement('style');
    st.textContent = SIGNO_INICIO + ',.ptc-caja{cursor:pointer;-webkit-tap-highlight-color:transparent}'
      + '[data-inicio-listo]:focus-visible{outline:2px solid #F07A1E;outline-offset:3px;border-radius:4px}';
    (document.head || document.documentElement).appendChild(st);
    function cual(t) {
      if (!t || !t.closest) return null;
      var el = t.closest(SIGNO_INICIO);
      if (el) return el;
      if (t.closest('.ptc-adorno')) return null;   // el adorno de temporada dice qué día es (js/temporada.js)
      var c = t.closest('.ptc-caja');   // la caja del signo con su adorno
      return c ? c.querySelector(SIGNO_INICIO) : null;
    }
    document.addEventListener('click', function (e) {
      var el = cual(e.target);
      if (!el || el.hidden) return;
      e.preventDefault();
      P.alInicio();
    });
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.matches && e.target.matches(SIGNO_INICIO)) { e.preventDefault(); P.alInicio(); }
    });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { P.signoInicio(); });
    else P.signoInicio();
  })();

  /* ---- Solo consulta (29-oct-2026): Héctor Nava Ramos (usuario hnava), papá de Daniel, ve todo lo que ve Daniel
     pero no cambia nada. El candado de verdad está en la base (portal/sql/19_solo_consulta.sql): ahí se detiene
     cualquier alta, cambio o baja suya. Aquí solo se avisa claro («Solo consulta») si una página intenta guardar,
     para que no salga un error raro; las páginas además esconden sus botones de guardar con P.consulta. ---- */
  var MSG_CONSULTA = 'Tu usuario es de solo consulta: puedes ver todo, pero no cambiar nada.';
  var MSG_EQUIPO = 'La vista del equipo es de solo consulta para ti: para capturar lo tuyo regresa a «Mi vista».';
  P.MSG_CONSULTA = MSG_CONSULTA;
  function errConsulta() { var x = new Error(MSG_CONSULTA); x.code = 'not_granted'; return x; }
  // Respuesta de Supabase que dice «no se puede», y que aguanta .eq(), .select() y demás antes del await
  function rechazo() {
    var res = { data: null, error: { code: '42501', message: MSG_CONSULTA }, status: 403, statusText: 'Solo consulta' };
    var px = new Proxy({}, {
      get: function (o, k) {
        if (k === 'then') return function (ok, no) { return Promise.resolve(res).then(ok, no); };
        if (k === 'catch' || k === 'finally') return function (f) { return Promise.resolve(res)[k](f); };
        return function () { return px; };
      }
    });
    return px;
  }
  (function candadoConsulta() {
    var desde = sb.from.bind(sb), rpc = sb.rpc.bind(sb);
    sb.from = function (t) {
      var q = desde(t);
      if (P.consulta) ['insert', 'update', 'upsert', 'delete'].forEach(function (m) { q[m] = rechazo; });
      return q;
    };
    // Funciones de la base que guardan algo; las de solo leer y la bitácora de accesos siguen igual
    var ESCRIBEN = { cot_guardar: 1, cot_estatus: 1, af_cargar: 1, caja_generar_corte: 1, caja_cancelar_corte: 1, solicitar_actualizacion: 1,
      cambios_mandar: 1, cambios_autorizar: 1, cambios_rechazar: 1, cambios_comentar: 1, cambios_deshacer: 1, cambios_sql_listo: 1, cambios_visto: 1,
      cli_felicitar: 1, sc_mi_personaje: 1,
      fac_genera: 1, fac_guarda: 1, fac_folio: 1, fac_borra: 1, pag_guarda: 1, pag_edita: 1, pag_borra: 1, pag_quita: 1,   // etapa 5 (52_facturacion.sql)
      cli_guarda: 1, cli_borra: 1,   // etapa 4 (55_clientes_ficha.sql)
      rec_guarda: 1, rec_estatus: 1, rec_borra: 1, rec_destinatario: 1,   // etapa 5 (56_recordatorios.sql)
      cdir_marca: 1, cdir_guarda_factura: 1, cdir_ajustes: 1, cdir_catalogo_guarda: 1, cdir_catalogo_borra: 1,   // comisiones de dirección
      cdir_empleado_guarda: 1, cdir_guarda: 1, cdir_borra: 1, cdir_trae: 1,   // (64_comisiones_direccion.sql)
      cpf_guardar: 1, cpf_estatus: 1, cot_liga_ren: 1 };   // Cotizador PROFASE y la liga a Renovaciones (80_cotizar_renovaciones.sql)
    /* «¿Qué recorridos ya vi?» lo preguntan una docena de partes de la página al mismo tiempo al abrirla; se pregunta una
       vez y la respuesta sirve 5 segundos (anotar uno lo vuelve a preguntar). Revisión de eficiencia del 31-oct-2026. */
    var GUARDA = { recorridos_mios: 5000 }, CACHE = {};
    /* Lo que la base dice que ve cada quien (rh_estado, cob_estado…) lo piden varias partes de la página al mismo tiempo
       al entrar («Comprobar real» del 13-nov-2026: 97 llamadas al entrar; rh_estado tres veces en la vista, ~1.1 s cada
       una porque salían todas juntas). Mientras una pregunta igual va en camino, las demás esperan esa misma respuesta,
       cada una con su propia copia (así nadie le cambia a otro lo que recibió); en cuanto llega, la siguiente vuelve a
       preguntar a la base. Solo en los primeros 30 s de la página, para que lo que se pida después de guardar algo nunca
       tome una respuesta de antes. Revisión nocturna del 13-nov-2026. */
    var JUNTA = { rh_estado: 1, cob_estado: 1, fac_estado: 1, cdir_estado: 1, exp_estado: 1, agenda_cierre_mias: 1 }, VAN = {};
    function alEntrar() { try { return performance.now() < 30000; } catch (e) { return false; } }
    function sinArgs(a) {   // sin nada o con {} (los ayudantes «rpc» de las páginas mandan {}): es la misma pregunta
      if (a === undefined || a === null) return true;
      if (typeof a !== 'object' || Array.isArray(a)) return false;
      for (var k in a) if (Object.prototype.hasOwnProperty.call(a, k)) return false;
      return true;
    }
    function suCopia(r) {
      if (!r || r.data == null || typeof r.data !== 'object') return r;
      try { return Object.assign({}, r, { data: JSON.parse(JSON.stringify(r.data)) }); } catch (e) { return r; }
    }
    sb.rpc = function (fn, args) {
      if (P.consulta && ESCRIBEN[fn]) return rechazo();
      if (fn === 'recorrido_visto') CACHE = {};
      if (JUNTA[fn] && sinArgs(args) && alEntrar()) {
        var v = VAN[fn];
        if (!v) {
          v = VAN[fn] = Promise.resolve(rpc.apply(null, arguments));
          var suelta = function () { if (VAN[fn] === v) delete VAN[fn]; };
          v.then(suelta, suelta);
        }
        return v.then(suCopia);
      }
      if (GUARDA[fn] && args === undefined) {
        var c = CACHE[fn];
        if (c && Date.now() - c.t < GUARDA[fn]) return c.p;
        var p = Promise.resolve(rpc.apply(null, arguments)).then(function (r) { if (!r || r.error) delete CACHE[fn]; return r; },
          function (e) { delete CACHE[fn]; throw e; });
        CACHE[fn] = { t: Date.now(), p: p };
        return p;
      }
      return rpc.apply(null, arguments);
    };
    // funciones del servidor que mandan algo (recordatorios de pago desde cumplimiento@): en solo consulta, no
    // (sb.functions se arma de nuevo cada vez que se pide: se envuelve el que se entrega)
    var MANDAN = { recordatorios: 1, cotizaciones: 1 };
    try {
      var proto = Object.getPrototypeOf(sb), des = proto && Object.getOwnPropertyDescriptor(proto, 'functions');
      if (des && des.get) Object.defineProperty(sb, 'functions', { configurable: true, get: function () {
        var f = des.get.call(sb), invoca = f.invoke.bind(f);
        f.invoke = function (fn) {
          return P.consulta && MANDAN[fn] ? Promise.resolve({ data: null, error: { message: MSG_CONSULTA, status: 403 } }) : invoca.apply(null, arguments);
        };
        return f;
      } });
    } catch (e) { /* sin funciones del servidor: nada que cuidar */ }
    if (sb.storage && sb.storage.from) {
      var cubeta = sb.storage.from.bind(sb.storage);
      sb.storage.from = function (b) {
        var s = cubeta(b);
        // su propia foto de perfil sí la puede poner o quitar, y el chat interno sí lo usa (decisión de Daniel,
        // 30-oct-2026: su papá «que chatee normal»; la base solo le abre la cubeta «chat»: portal/sql/58_chat.sql)
        if (P.consulta && b !== 'fotos' && b !== 'chat') ['upload', 'update', 'remove', 'move', 'copy', 'uploadToSignedUrl'].forEach(function (m) {
          if (s[m]) s[m] = function () { return Promise.resolve({ data: null, error: { message: MSG_CONSULTA, statusCode: '403' } }); };
        });
        return s;
      };
    }
  })();

  /* ---- Modo claro / oscuro: uno solo para todo el portal (botón de Fernando Cadengo; regla de Daniel del 29-oct-2026).
     Por omisión todo el portal (la entrada, cada vista, cada pestaña, sub pestaña y ventana) se ve claro u oscuro
     según el dispositivo de cada quien, y cambia solo cuando el dispositivo cambia.
     Al picar el botón de claro/oscuro: si sigue al dispositivo, sale un aviso que lo dice y deja escogerlo a mano;
     si ya lo escogió a mano, cambia al momento y un aviso chico ofrece regresar a «como mi dispositivo».
     Se guarda en el navegador de cada quien («profase-modo»: auto, claro u oscuro). La clave de antes de esta regla
     («profase-tema») ya no se usa: todos arrancaron otra vez como su dispositivo.
     Cada página ya trae sus colores oscuros para <html data-theme="dark">; aquí solo se pone ese atributo, en la
     página y en todas las pestañas abiertas en su marco (y sus sub pestañas). Una página nueva solo tiene que traer
     sus colores para :root[data-theme="dark"] y cargar este archivo. ---- */
  var MODO = 'profase-modo', modoMem = '';
  var oscuroSistema = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  try { localStorage.removeItem('profase-tema'); } catch (e) { /* sin almacenamiento */ }
  function modoGuardado() {
    try { var v = localStorage.getItem(MODO); return v === 'claro' || v === 'oscuro' || v === 'auto' ? v : ''; } catch (e) { return ''; }
  }
  function delDispositivo() { return oscuroSistema && oscuroSistema.matches ? 'dark' : 'light'; }
  // 'auto' (como el dispositivo), 'claro' u 'oscuro' (escogido a mano)
  P.modo = function () {
    var m = modoMem || modoGuardado();
    // sin almacenamiento en el navegador, la pestaña en su marco toma el de la página que la abrió
    if (!m && window.parent !== window) { try { m = window.parent.PORTAL ? window.parent.PORTAL.modo() : ''; } catch (e) { m = ''; } }
    return m === 'claro' || m === 'oscuro' ? m : 'auto';
  };
  P.tema = function () { var m = P.modo(); return m === 'oscuro' ? 'dark' : m === 'claro' ? 'light' : delDispositivo(); };
  P.pintaTema = function (t) {
    t = t || P.tema();
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.setAttribute('data-modo', P.modo());
    try { document.dispatchEvent(new CustomEvent('profase-tema', { detail: t })); } catch (e) { /* navegador viejo: sin aviso */ }
    (function baja(w) {
      for (var i = 0; i < w.frames.length; i++) {
        try { var f = w.frames[i]; if (f.PORTAL && f.PORTAL.pintaTema) f.PORTAL.pintaTema(t); else baja(f); } catch (e) { /* marco de otro sitio */ }
      }
    })(window);
  };
  P.ponModo = function (m) {
    modoMem = m === 'claro' || m === 'oscuro' ? m : 'auto';
    try { localStorage.setItem(MODO, modoMem); } catch (e) { /* sin almacenamiento: solo esta vez */ }
    P.pintaTema();
  };
  /* Lo que hace cualquier botón de claro/oscuro (el del encabezado y los que traen algunas pestañas):
     t es el modo al que quiere pasar. El aviso sale siempre en la página de arriba, no dentro de una pestaña. */
  P.cambiaTema = function (t) {
    var a = null;
    try { a = window.parent !== window && window.parent.PORTAL && window.parent.PORTAL.cambiaTema ? window.parent.PORTAL : null; } catch (e) { a = null; }
    if (a) return a.cambiaTema(t);
    t = t === 'dark' || t === 'light' ? t : (P.tema() === 'dark' ? 'light' : 'dark');
    if (P.modo() === 'auto') return avisoModo(t);
    P.ponModo(t === 'dark' ? 'oscuro' : 'claro');
    avisoManual();
  };
  var CSS_MODO = '.pt-ov{position:fixed;inset:0;z-index:2147483000;background:rgba(10,18,32,.5);display:grid;place-items:center;padding:16px;box-sizing:border-box}'
    + '.pt-dlg{width:min(440px,100%);max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);overflow:auto;box-sizing:border-box;background:#fff;color:#1A2333;border-radius:14px;'
    + 'border-top:4px solid #F07A1E;box-shadow:0 18px 50px rgba(0,0,0,.3);padding:20px 20px 16px;font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;text-align:left}'
    + '.pt-dlg h2{margin:0 0 8px;font-size:17px;color:#1F3864}.pt-dlg p{margin:0 0 10px}.pt-dlg b{font-weight:700}'
    + '.pt-ic{width:42px;height:42px;border-radius:50%;background:#E6ECF6;color:#1F3864;display:grid;place-items:center;margin-bottom:10px}.pt-ic svg{width:22px;height:22px;display:block}'
    + '.pt-acts{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;margin-top:14px}'
    + '.pt-b{font:inherit;font-size:14px;font-weight:600;border-radius:9px;padding:10px 14px;cursor:pointer;border:1px solid #C5CEDC;background:#fff;color:#1A2333;flex:1 1 auto;min-height:44px}'
    + '.pt-b.pri{background:#1F3864;border-color:#1F3864;color:#fff}.pt-b:focus-visible{outline:2px solid #F07A1E;outline-offset:2px}'
    + ':root[data-theme="dark"] .pt-dlg{background:#172133;color:#E5EAF2;box-shadow:0 18px 50px rgba(0,0,0,.6)}'
    + ':root[data-theme="dark"] .pt-dlg h2{color:#fff}:root[data-theme="dark"] .pt-ic{background:#22324D;color:#F07A1E}'
    + ':root[data-theme="dark"] .pt-b{background:#1E2A40;border-color:#3A4A66;color:#E5EAF2}:root[data-theme="dark"] .pt-b.pri{background:#F07A1E;border-color:#F07A1E;color:#14233F}';
  function cssModo() {
    if (document.getElementById('pt-css')) return;
    var st = document.createElement('style'); st.id = 'pt-css'; st.textContent = CSS_MODO; document.head.appendChild(st);
  }
  var NOMBRE_MODO = { dark: 'oscuro', light: 'claro' };
  function avisoModo(quiere) {
    cssModo();
    var viejo = document.getElementById('pt-ov'); if (viejo) viejo.remove();
    var hoy = P.tema(), ov = document.createElement('div');
    ov.className = 'pt-ov'; ov.id = 'pt-ov';
    ov.innerHTML = '<div class="pt-dlg" role="dialog" aria-modal="true" aria-labelledby="pt-h">'
      + '<div class="pt-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg></div>'
      + '<h2 id="pt-h">Modo claro y oscuro</h2>'
      + '<p>Ahorita el portal se ve en <b>modo ' + NOMBRE_MODO[hoy] + '</b> porque así está configurado tu dispositivo. Cambia solo cuando cambia tu dispositivo.</p>'
      + '<p>Si prefieres escogerlo tú, se queda como lo dejes hasta que lo vuelvas a cambiar con este mismo botón.</p>'
      + '<div class="pt-acts"><button type="button" class="pt-b" id="pt-sigue">Dejarlo como mi dispositivo</button>'
      + '<button type="button" class="pt-b pri" id="pt-mano">Escogerlo yo: modo ' + NOMBRE_MODO[quiere] + '</button></div></div>';
    document.body.appendChild(ov);
    var ant = document.activeElement;
    function cierra() { ov.remove(); document.removeEventListener('keydown', tecla, true); try { if (ant && ant.focus) ant.focus(); } catch (e) { /* nada */ } }
    function tecla(e) { if (e.key === 'Escape') { e.stopPropagation(); cierra(); } }
    document.addEventListener('keydown', tecla, true);
    ov.addEventListener('click', function (e) { if (e.target === ov) cierra(); });
    document.getElementById('pt-sigue').onclick = cierra;
    document.getElementById('pt-mano').onclick = function () {
      cierra(); P.ponModo(quiere === 'dark' ? 'oscuro' : 'claro'); avisoManual();
    };
    document.getElementById('pt-mano').focus();
  }
  // ya escogido a mano: el aviso chico de abajo con «Usar el de mi dispositivo» (con su ✕, como todos: P.avisoChico)
  function avisoManual(txt) {
    if (txt) return P.avisoChico({ id: 'modo', texto: txt, ms: 3500 });
    P.avisoChico({ id: 'modo', texto: 'Modo ' + NOMBRE_MODO[P.tema()] + ', escogido por ti.', boton: 'Usar el de mi dispositivo', ms: 7000,
      accion: function () { P.ponModo('auto'); avisoManual('Listo: el portal sigue otra vez a tu dispositivo.'); } });
  }

  /* ---- Avisos chicos (regla de Héctor Daniel, 2-nov-2026, 11:40 a 11:46: «quisiera poderle picar tachita y que se
     cierre; pero si le pico ver; se cierra la notificación y no me lleva a ver»; «quiero que a todos los avisos de este
     tipo; les salga la tachita y que sí te lleven: corrige eso con lo actual y para lo nuevo»).
     Un solo lugar para los avisos que flotan abajo con un botón («Ver», «Ya los capturé, revisar»…): P.avisoChico(o).
       o.id       uno por id: uno nuevo con el mismo id reemplaza al anterior
       o.texto    lo que dice (texto, nunca HTML); o.detalle, un segundo renglón más chico
       o.html     solo texto fijo escrito en el código (nunca datos): para un contador como el de «versión nueva»
       o.boton    el botón principal; o.accion, lo que hace; o.botones = [{texto, accion}] para más botones
       o.ms       se quita solo a los o.ms (15 s por omisión; 0 = hasta que lo quiten); se queda mientras el puntero
                  o el dedo esté encima
       o.alCerrar lo que pasa al picar ✕ (además de quitarlo)
     Regresa {el, cierra()}.
     - Siempre lleva ✕, que solo lo quita.
     - Un botón quita el aviso y hace lo suyo DESPUÉS del clic (setTimeout): así el mismo clic ya no cierra lo que el
       botón abrió (así fallaba «Ver» de la campanita: abría su ventanita y el clic, al seguir a la página, la cerraba).
     - Se apilan abajo al centro, sin encimarse entre ellos ni con la pastilla de la llamada o las reuniones por cerrar;
       los menús abiertos y las ventanas van encima de ellos. Desde una pestaña en su marco sale en la página de arriba.
     - Red de seguridad para lo que no use esta pieza: a un aviso flotante (role="status" o clase con «toast» o «aviso»)
       con botón y sin ✕, se le pone su ✕ (vigilaAviso). Los que no se deben poder quitar (las ventanas obligatorias)
       son ventanas (aria-modal), no avisos chicos; un aviso que de verdad no se deba quitar lleva data-sin-cerrar.
     construir.py (exige_avisos_chicos()) lo cuida y herramientas/pruebas/pantallas/prueba_aviso_abajo.py lo comprueba. */
  var CSS_AVISOS = '#pa-avisos{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:65;'
    + 'display:flex;flex-direction:column;align-items:center;gap:8px;width:max-content;max-width:min(460px,calc(100vw - 24px));pointer-events:none}'
    + '#pa-avisos:empty{display:none}'
    // durante un recorrido guiado no tapan lo que se está enseñando (se esconden y su tiempo no corre; regresan al terminar)
    + 'body:has(.rc-capa) #pa-avisos{visibility:hidden}'
    + '.pa-av{pointer-events:auto;box-sizing:border-box;max-width:100%;display:flex;flex-wrap:nowrap;align-items:center;gap:6px 8px;background:#1F3864;color:#fff;'
    + 'border-left:5px solid #F07A1E;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.25);padding:8px 6px 8px 14px;'
    + 'font:14px/1.35 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;animation:pa-sube .18s ease-out}'
    + '.pa-tx{flex:1 1 auto;min-width:0;overflow-wrap:anywhere;padding:3px 0}.pa-tx small{display:block;font-size:12.5px;color:#DCE5F3;margin-top:2px}'
    + '.pa-tx b{font-variant-numeric:tabular-nums}'
    // con dos botones: el texto y la ✕ arriba, los botones abajo (la ✕ nunca queda sola en otro renglón)
    + '.pa-av.dos{flex-wrap:wrap}.pa-av.dos .pa-tx{flex:1 1 calc(100% - 52px)}.pa-av.dos .pa-x{order:1;align-self:flex-start}.pa-av.dos .pa-ok,.pa-av.dos .pa-sec{order:2}'
    + '.pa-av button{flex:none;font:inherit;font-weight:600;border:0;border-radius:8px;padding:7px 12px;cursor:pointer;min-height:34px}'
    + '.pa-av .pa-ok{background:#F07A1E;color:#14233F}.pa-av .pa-sec{background:rgba(255,255,255,.14);color:#fff}'
    + '.pa-av .pa-x{background:transparent;color:#DCE5F3;padding:7px 10px;font-size:15px;line-height:1}.pa-av .pa-x:hover{background:rgba(255,255,255,.12)}'
    + '.pa-av button:focus-visible{outline:2px solid #fff;outline-offset:2px}'
    + '.pa-x-auto{flex:none;font:inherit;font-size:15px;line-height:1;border:0;border-radius:8px;background:transparent;color:inherit;opacity:.8;padding:7px 10px;cursor:pointer;margin-left:4px}'
    + '.pa-x-auto:hover{opacity:1}'
    + '@keyframes pa-sube{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}'
    + '@media (prefers-reduced-motion: reduce){.pa-av{animation:none}}@media print{#pa-avisos{display:none}}';
  function avCaja() {
    if (!document.getElementById('pa-css')) { var st = document.createElement('style'); st.id = 'pa-css'; st.textContent = CSS_AVISOS; document.head.appendChild(st); }
    var c = document.getElementById('pa-avisos');
    if (!c) { c = document.createElement('div'); c.id = 'pa-avisos'; c.setAttribute('aria-live', 'polite'); document.body.appendChild(c); }
    return c;
  }
  // que no se encimen con lo que ya flota abajo (la pastilla de la llamada, las reuniones por cerrar)
  function avAcomoda() {
    var c = document.getElementById('pa-avisos'); if (!c) return;
    c.style.bottom = '';
    if (!c.firstChild) return;
    var r = c.getBoundingClientRect(), alto = 0;
    var cosas = [];
    ['.ll-pill', '.reu-c'].forEach(function (s) {
      var o = document.querySelector(s); if (!o || o.hidden) return;
      cosas.push(o.getBoundingClientRect());
    });
    // ni con los botones de abajo de una ventana abierta (la ventana común de js/seguimiento.js), aquí o en una pantalla
    // en su marco: en el celular el aviso tapaba «Guardar» (11-nov-2026, al pasar los paneles a la ventana común)
    [].forEach.call(document.querySelectorAll('.segv .sg-foot'), function (x) { cosas.push(x.getBoundingClientRect()); });
    [].forEach.call(document.querySelectorAll('iframe'), function (f) {
      try {
        if (!f.getClientRects().length || !f.contentDocument) return;
        var fr = f.getBoundingClientRect();
        [].forEach.call(f.contentDocument.querySelectorAll('.segv .sg-foot'), function (x) {
          var q = x.getBoundingClientRect();
          cosas.push({ top: fr.top + q.top, bottom: fr.top + q.bottom, left: fr.left + q.left, right: fr.left + q.right, height: q.height });
        });
      } catch (e) { /* otro sitio */ }
    });
    cosas.forEach(function (q) {
      if (!q.height || q.right <= r.left || q.left >= r.right || q.top >= r.bottom || q.bottom <= r.top) return;
      alto = Math.max(alto, innerHeight - q.top + 10);
    });
    if (alto) c.style.bottom = Math.round(alto) + 'px';
  }
  // salió o se quitó un aviso chico: quien deba hacerle lugar (SuperConta deja dónde escribir arriba de ellos) se entera
  var avN = 0;
  // la ventana común avisa al abrirse y al cerrarse (js/seguimiento.js), aquí o desde una pantalla en su marco
  document.addEventListener('profase-ventana', function () { setTimeout(avAcomoda, 60); });
  function avCambio() { var k = document.getElementById('pa-avisos'); avN = k ? k.children.length : 0; avAcomoda(); try { document.dispatchEvent(new CustomEvent('profase-avisos')); } catch (e) { /* nada */ } }
  var avTic = 0;
  P.avisoChico = function (o) {
    o = o || {};
    var a = arriba();
    if (a && a.avisoChico) { try { return a.avisoChico(o); } catch (e) { /* sigue aquí */ } }
    var c = avCaja();
    if (o.id) { var viejo = c.querySelector('[data-pa="' + String(o.id).replace(/["\\]/g, '') + '"]'); if (viejo) viejo.remove(); }
    var el = document.createElement('div');
    el.className = 'pa-av'; el.setAttribute('role', 'status'); el.setAttribute('data-aviso-chico', '');
    if (o.id) el.setAttribute('data-pa', String(o.id));
    var tx = document.createElement('span'); tx.className = 'pa-tx';
    if (o.html) tx.innerHTML = o.html; else tx.textContent = o.texto || '';
    if (o.detalle) { var sm = document.createElement('small'); sm.textContent = o.detalle; tx.appendChild(sm); }
    el.appendChild(tx);
    var bts = [];
    if (o.boton) bts.push({ texto: o.boton, accion: o.accion, pri: true });
    (o.botones || []).forEach(function (b) { if (b && b.texto) bts.push(b); });
    var reloj = 0;
    function cierra() { clearTimeout(reloj); if (el.parentNode) el.parentNode.removeChild(el); avCambio(); }
    // mientras corre un recorrido guiado el aviso está escondido: su tiempo no corre (se quita hasta que se pueda leer)
    var tapado = false;
    function vence() {
      if (document.querySelector('.rc-capa')) { tapado = true; reloj = setTimeout(vence, 2000); return; }
      if (tapado) { tapado = false; reloj = setTimeout(vence, 6000); return; }   // ya sin recorrido: 6 s para leerlo
      cierra();
    }
    function espera(ms) { clearTimeout(reloj); if (ms > 0) reloj = setTimeout(vence, ms); }
    bts.forEach(function (b, i) {
      var x = document.createElement('button'); x.type = 'button';
      x.className = (b.pri || (i === 0 && !o.boton)) ? 'pa-ok' : 'pa-sec';
      x.textContent = b.texto;
      x.onclick = function () {
        cierra();
        // después del clic, para que el mismo clic no cierre lo que el botón abre
        setTimeout(function () { try { if (typeof b.accion === 'function') b.accion(); } catch (e) { /* nada */ } }, 0);
      };
      el.appendChild(x);
    });
    if (bts.length > 1) el.classList.add('dos');
    var cx = document.createElement('button'); cx.type = 'button'; cx.className = 'pa-x'; cx.textContent = '✕';
    cx.setAttribute('aria-label', 'Cerrar aviso'); cx.title = 'Cerrar';
    cx.onclick = function () { cierra(); try { if (typeof o.alCerrar === 'function') o.alCerrar(); } catch (e) { /* nada */ } };
    el.appendChild(cx);
    var ms = o.ms == null ? 15000 : +o.ms || 0;
    el.addEventListener('pointerenter', function () { clearTimeout(reloj); });
    el.addEventListener('pointerleave', function () { espera(ms ? 6000 : 0); });
    el.addEventListener('focusin', function () { clearTimeout(reloj); });
    c.appendChild(el);
    avCambio();
    espera(ms);
    clearInterval(avTic);
    // mientras haya avisos: se acomodan y, si alguno se quitó por fuera (la ventana de versión nueva quita el suyo), se avisa
    avTic = setInterval(function () { var k = document.getElementById('pa-avisos'), n = k ? k.children.length : 0;
      if (n !== avN) avCambio(); else avAcomoda();
      if (!n) clearInterval(avTic); }, 1000);
    return { el: el, cierra: cierra };
  };
  // un aviso de solo texto (por ejemplo «Ojo: ahora se empalma con otra cita tuya»)
  P.toast = function (txt, ms) { return P.avisoChico({ texto: txt, ms: ms == null ? 6000 : ms }); };
  addEventListener('resize', avAcomoda);
  // la red de seguridad: un aviso flotante con botón y sin ✕ recibe su ✕
  function esAviso(el) {
    if (!el || el.nodeType !== 1 || el.hasAttribute('data-aviso-chico') || el.hasAttribute('data-sin-cerrar') || el.id === 'pa-avisos') return false;
    var rol = el.getAttribute('role') || '', cls = typeof el.className === 'string' ? el.className : '';
    if (!/^(status|alert)$/.test(rol) && !/toast|aviso/i.test(cls)) return false;
    if (el.getAttribute('aria-modal') === 'true' || el.querySelector('[aria-modal="true"]')) return false;
    if (!el.querySelector('button')) return false;
    var cs = getComputedStyle(el); if (cs.position !== 'fixed' || cs.display === 'none') return false;
    var r = el.getBoundingClientRect();
    return r.height > 0 && r.height < innerHeight * 0.5 && r.width * r.height < innerWidth * innerHeight * 0.5;
  }
  function tieneCerrar(el) {
    if (el.querySelector('.x,.pa-x,.pa-x-auto,[data-cerrar],[aria-label^="Cerrar"],[aria-label^="cerrar"]')) return true;
    return [].some.call(el.querySelectorAll('button'), function (b) { return /^\s*(✕|×|x|Cerrar)\s*$/i.test(b.textContent); });
  }
  function vigilaAviso(el) {
    setTimeout(function () {
      try {
        if (!el.isConnected || !esAviso(el) || tieneCerrar(el)) return;
        var x = document.createElement('button'); x.type = 'button'; x.className = 'pa-x-auto'; x.textContent = '✕';
        x.setAttribute('aria-label', 'Cerrar aviso'); x.title = 'Cerrar';
        x.onclick = function () { if (el.parentNode) el.parentNode.removeChild(el); };
        el.appendChild(x);
      } catch (e) { /* nada */ }
    }, 0);
  }
  function vigilaAvisos() {
    if (!document.body) return document.addEventListener('DOMContentLoaded', vigilaAvisos);
    try {
      new MutationObserver(function (ms) {
        ms.forEach(function (m) { [].forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1) vigilaAviso(n); }); });
      }).observe(document.body, { childList: true });
    } catch (e) { /* navegador viejo: sin la red */ }
  }
  vigilaAvisos();
  /* ---- Sin conexión (11-nov-2026, auditoría externa, H-09; Héctor Daniel Nava: «hagamos lo que sí recomiendas»).
     Si el equipo se queda sin internet, abajo sale «Sin conexión a internet» con desde qué hora, para que nadie crea que
     guardó algo que no llegó; se queda hasta que regresa la conexión y entonces dice «Ya hay conexión otra vez». Solo en la
     página de arriba (las pantallas en su marco no lo repiten) y con la pieza común de avisos (P.avisoChico). No lee ni
     escribe nada de la base. */
  (function () {
    var enMarco = false;
    try { enMarco = window.parent !== window; } catch (e) { enMarco = true; }
    if (enMarco) return;
    var av = null;
    function sin() {
      if (av) return;
      if (!document.body) { document.addEventListener('DOMContentLoaded', sin); return; }
      var h = '';
      try { h = window.PROFASE_HORA.hora(new Date()); } catch (e) { h = ''; }
      av = P.avisoChico({ id: 'pa-sin-red', texto: 'Sin conexión a internet',
        detalle: (h ? 'Desde las ' + h + '. ' : '') + 'Lo que guardes ahorita no va a llegar; espera a que regrese.', ms: 0 });
    }
    function con() {
      if (!av) return;
      try { av.cierra(); } catch (e) { /* nada */ }
      av = null;
      P.avisoChico({ id: 'pa-sin-red', texto: 'Ya hay conexión otra vez', ms: 5000 });
    }
    addEventListener('offline', sin);
    addEventListener('online', con);
    if (navigator.onLine === false) sin();
  })();
  P.pintaTema();
  // otra ventana del portal lo cambió
  window.addEventListener('storage', function (e) { if (e.key === MODO) { modoMem = ''; P.pintaTema(); } });
  if (oscuroSistema) {
    var sigueSistema = function () { if (P.modo() === 'auto') P.pintaTema(); };
    if (oscuroSistema.addEventListener) oscuroSistema.addEventListener('change', sigueSistema); else oscuroSistema.addListener(sigueSistema);
  }

  /* ---- Pantallas (regla de Daniel, 29-oct-2026): todo el portal, lo que ya está y lo nuevo, se acomoda a la pantalla
     de cada quien (celular, tableta o computadora). Esta capa va en todas las páginas porque todas cargan este archivo;
     cada página trae además sus propios ajustes. Antes de publicar una pestaña nueva o un cambio de diseño se corre
     herramientas/pruebas/pantallas/revisa_pantallas.py (en profase-datos), que avisa de todo lo que se salga.
     - En el celular, los campos de texto van a 16 px para que el iPhone no se acerque solo al escribir.
     - Las tiras de pestañas que no caben se deslizan de lado: se desvanecen en la orilla donde hay más pestañas,
       para que se note, y la pestaña escogida se queda a la vista.
     - Campos de fecha en el iPhone y el iPad (Daniel, 31-oct-2026, 21:55, con una captura de RH › «Cargar préstamo de
       antes»: «se ve sobre encimado monto y la fecha»). En el iPhone y el iPad (todo navegador ahí usa el motor de
       Apple) el campo de fecha trae su propio ancho mínimo, no obedece a su recuadro y se encima con el campo de al
       lado o se sale de la tarjeta; vacío, además sale más alto, y la fecha centrada. Aquí se le quita el aspecto de
       fábrica solo en esos equipos (@supports -webkit-touch-callout, que solo existe ahí), para que mida lo que le da
       su recuadro, quede del mismo alto que los demás campos y con la fecha a la izquierda. Así queda para todas las
       pantallas, las de hoy y las nuevas; construir.py (exige_fechas_ios) no publica si se quita. ---- */
  (function pantallas() {
    var FECHAS = 'input[type=date],input[type=month],input[type=week]';
    var css = 'html{-webkit-text-size-adjust:100%;text-size-adjust:100%}'
      + '@media (pointer:coarse) and (max-width:900px){input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]):not([type=file]),select,textarea{font-size:16px!important}}'
      + '@supports (-webkit-touch-callout:none){' + FECHAS + '{-webkit-appearance:none;appearance:none;min-width:0;max-width:100%;box-sizing:border-box;text-align:left}'
      + FECHAS.split(',').map(function (s) { return s + '::-webkit-date-and-time-value'; }).join(',') + '{text-align:left;min-height:1.2em;margin:0}}'
      // En las tablas las palabras no se parten a la mitad (regla de Daniel: «nunca a media palabra»; revisión a fondo,
      // 31-oct-2026: «COMPA / ÑÍA», «N0200 / 2», «INVENTA / DO»). overflow-wrap:anywhere encogía la columna hasta partir
      // cada palabra; break-word solo parte lo que de verdad no cabe y, si la tabla no cabe, se desliza en su recuadro.
      + 'td,th,td *,th *{overflow-wrap:break-word!important}'
      // Con el dedo, los botones de cada pantalla miden al menos 44 px de alto (auditoría externa, 11-nov-2026, H-06:
      // medían unos 35 px en el celular y el iPad; 43 pantallas traen su propia copia del estilo, así que va aquí, una
      // sola vez, para las de hoy y las nuevas). Solo en pantallas táctiles: la computadora con mouse no cambia. Los de
      // adentro de una tabla y los de los avisos chicos se quedan como están (harían cada renglón más alto).
      + '@media (pointer:coarse){:is(button.btn,a.btn,label.btn,.ppl-masb,.pf-btn,button[data-pdf-de],.ppl-go):not(td *):not(th *):not(.pa-av *){min-height:44px;box-sizing:border-box}}'
      // Desplegables (<details>): se abren o se cierran solo al picar sus palabras, no con el blanco del mismo renglón
      // (Daniel, 2-nov-2026, 18:57, con «Más filtros» del Panel de trabajo que encontró Chuy: «ponlo como regla para que
      // no cometas ese error en lo nuevo»). Por omisión el título mide lo que sus palabras, en todas las páginas, las de
      // hoy y las nuevas; :where() no pesa, así que un desplegable que sí debe abrirse con todo su renglón (uno con
      // recuadro o fondo) lo dice en su página con «/* renglón completo */» y width:auto. construir.py
      // (exige_desplegables()) no publica si se quita.
      + ':where(details)>summary{width:fit-content;max-width:100%}'
      // Lo que va pegado al lado de una pantalla (un índice, una lista de opciones o una vista previa) se desliza por
      // dentro (Héctor Daniel Nava, 11-nov-2026, 10:30, con la ficha de Clientes › Base de clientes: «quiero poder
      // deslizarme hacia abajo sin tener que mover todo lo de la parte derecha»; «revisa en qué otras partes hay opciones
      // así y este tipo de pantalla y ponlo en todas»). La página le pone data-lado y, si lo pega más abajo, --lado-top con
      // lo mismo que su «top» (--lado-pie: lo que deja abajo): nunca mide más que la pantalla, se desliza solo, al llegar a
      // la orilla no se lleva lo de junto y una sombrita dice que hay más. Una lista adentro con data-lado-lista toma lo que
      // sobra y es la que se desliza, para que lo de arriba del lado (sus secciones) se quede siempre a la vista. :where()
      // no pesa: la página puede cambiar cualquier cosa (en el celular, donde el lado pasa arriba). Una sola versión, para
      // lo de hoy y lo nuevo; construir.py (exige_lado()) no publica si se quita.
      + ':where([data-lado],[data-lado-lista]){overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;'
      + 'background:linear-gradient(var(--lado-fondo,var(--surface,#fff)) 30%,transparent) top/100% 28px no-repeat local,'
      + 'linear-gradient(transparent,var(--lado-fondo,var(--surface,#fff)) 70%) bottom/100% 28px no-repeat local,'
      + 'radial-gradient(farthest-side at 50% 0,var(--lado-sombra,rgba(10,18,32,.24)),transparent) top/100% 10px no-repeat scroll,'
      + 'radial-gradient(farthest-side at 50% 100%,var(--lado-sombra,rgba(10,18,32,.24)),transparent) bottom/100% 10px no-repeat scroll;'
      + 'background-color:var(--lado-fondo,var(--surface,#fff))}'
      // --lado-alto lo pone lados() (abajo): lo que de verdad queda de pantalla desde donde empieza el lado, para que
      // tampoco se salga por abajo antes de pegarse (con la página hasta arriba)
      + ':where([data-lado]){max-height:calc(100vh - var(--lado-top,0px) - var(--lado-pie,12px));max-height:var(--lado-alto,calc(100dvh - var(--lado-top,0px) - var(--lado-pie,12px)))}'
      // la lista de adentro se encoge hasta --lado-lista-min (la página lo pone solo si la lista es más larga que eso);
      // si ni así cabe, se desliza todo el lado
      + ':where([data-lado-lista]){flex:0 1 auto;min-height:var(--lado-lista-min,0px)}'
      + ':where(:root[data-theme="dark"]){--lado-sombra:rgba(0,0,0,.6)}'
      + '@media (prefers-color-scheme:dark){:where(:root:not([data-theme="light"])){--lado-sombra:rgba(0,0,0,.6)}}'
      + '.pt-desliza{scroll-behavior:smooth;overscroll-behavior-x:contain}'
      + ':is(.pt-desliza,.pt-tabla).pt-der{-webkit-mask-image:linear-gradient(to right,#000 calc(100% - 36px),transparent);mask-image:linear-gradient(to right,#000 calc(100% - 36px),transparent)}'
      + ':is(.pt-desliza,.pt-tabla).pt-izq{-webkit-mask-image:linear-gradient(to left,#000 calc(100% - 36px),transparent);mask-image:linear-gradient(to left,#000 calc(100% - 36px),transparent)}'
      + ':is(.pt-desliza,.pt-tabla).pt-izq.pt-der{-webkit-mask-image:linear-gradient(to right,transparent,#000 36px,#000 calc(100% - 36px),transparent);mask-image:linear-gradient(to right,transparent,#000 36px,#000 calc(100% - 36px),transparent)}';
    function pon() {
      if (document.getElementById('pt-pantallas')) return;
      var st = document.createElement('style'); st.id = 'pt-pantallas'; st.textContent = css;
      (document.head || document.documentElement).appendChild(st);
    }
    pon();
    var TIRAS = '[role="tablist"],nav.tabs,.tabs,.wtabs,.qsw,.subtabs,.seg,.wmv';
    // [role="group"]: tiras de botones como los meses de Comisiones de dirección, los filtros del chat y las secciones de
    // la campanita (revisión a fondo, 31-oct-2026: se cortaban en la orilla sin aviso y el mes escogido quedaba fuera).
    // Se desvanecen y dejan a la vista lo escogido, pero sin el desplazamiento suave de las tiras de pestañas.
    var GRUPOS = '[role="group"]';
    function escogida(t) { return t.querySelector('[aria-selected="true"],[aria-current="page"],[aria-current="true"],[aria-pressed="true"],.on,.active'); }
    // Cambia una clase solo si de verdad cambia: poner la que ya está también avisa a los MutationObserver y la
    // revisión de abajo se volvía a disparar sola sin parar mientras hubiera una tira que se desliza (31-oct-2026).
    function clase(t, c, si) { if (t.classList.contains(c) !== !!si) t.classList.toggle(c, !!si); }
    function marca(t, centra, base) {
      base = base || 'pt-desliza';
      var cs = getComputedStyle(t);
      if (!/(auto|scroll)/.test(cs.overflowX) || t.scrollWidth <= t.clientWidth + 2) {
        clase(t, base, false); clase(t, 'pt-izq', false); clase(t, 'pt-der', false); return;
      }
      clase(t, base, true);
      if (centra) {
        var e = escogida(t);
        if (e) {
          var a = e.offsetLeft - t.offsetLeft, b = a + e.offsetWidth;
          if (e.offsetParent !== t.offsetParent) { var rt = t.getBoundingClientRect(), re = e.getBoundingClientRect(); a = re.left - rt.left + t.scrollLeft; b = a + re.width; }
          if (a < t.scrollLeft + 24 || b > t.scrollLeft + t.clientWidth - 24) t.scrollLeft = Math.max(0, a - (t.clientWidth - (b - a)) / 2);
        }
      }
      clase(t, 'pt-izq', t.scrollLeft > 4);
      clase(t, 'pt-der', t.scrollLeft + t.clientWidth < t.scrollWidth - 4);
    }
    /* Tablas anchas (revisión a fondo de Daniel, 31-oct-2026, 21:56): en el celular y el iPad una tabla que no cabe
       se desliza dentro de su recuadro, pero la última columna quedaba partida en la orilla sin que nada avisara que
       hay más. Ahora su recuadro se desvanece en la orilla donde hay más columnas, igual que las tiras de pestañas. */
    function cajaDe(tb) {
      for (var e = tb.parentElement, i = 0; e && e !== document.body && i < 6; e = e.parentElement, i++) {
        if (/(auto|scroll)/.test(getComputedStyle(e).overflowX)) return e;
      }
      return null;
    }
    /* Lo pegado al lado (data-lado; ver arriba, en la capa común): mide lo que queda de pantalla desde donde empieza,
       sin pasar de lo que mide ya pegado. Así, con la página hasta arriba (el lado todavía más abajo, debajo de los
       cuadros de resumen), tampoco se sale por abajo y su lista se desliza completa sin mover lo de junto; al bajar,
       crece hasta pegarse. Solo cambia una variable de su estilo (no despierta a los MutationObserver). */
    function ajustaLado(el) {
      var cs = getComputedStyle(el);
      if (cs.position !== 'sticky' || !el.getClientRects().length) {
        if (el.style.getPropertyValue('--lado-alto')) el.style.removeProperty('--lado-alto');
        return;
      }
      var sc = null;
      for (var a = el.parentElement; a && a !== document.body && a !== document.documentElement; a = a.parentElement) {
        if (/(auto|scroll)/.test(getComputedStyle(a).overflowY)) { sc = a; break; }
      }
      var arriba = sc ? sc.getBoundingClientRect().top + sc.clientTop : 0;
      var abajo = sc ? arriba + sc.clientHeight : document.documentElement.clientHeight || innerHeight;
      var pie = parseFloat(cs.getPropertyValue('--lado-pie')); if (isNaN(pie)) pie = 12;
      var pegado = abajo - (arriba + (parseFloat(cs.top) || 0)) - pie;   // lo que mide ya pegado (lo más)
      var queda = abajo - el.getBoundingClientRect().top - pie;          // lo que queda de pantalla desde donde empieza
      // nunca menos de 6/10 de lo que mide pegado: si empieza muy abajo (el Calendario), no se aplasta; se ve al bajar
      var alto = Math.round(Math.max(120, pegado * 0.6, Math.min(pegado, queda))) + 'px';
      if (el.style.getPropertyValue('--lado-alto') !== alto) el.style.setProperty('--lado-alto', alto);
    }
    var ladoCuadro = 0;
    function lados() {
      if (ladoCuadro) return;
      ladoCuadro = requestAnimationFrame(function () {
        ladoCuadro = 0;
        var l = document.querySelectorAll('[data-lado]');
        for (var i = 0; i < l.length; i++) { try { ajustaLado(l[i]); } catch (e) { /* nada */ } }
      });
    }
    var espera = null;
    function todas(centra) {
      clearTimeout(espera);
      espera = setTimeout(function () {
        if (!document.body) return;
        lados();
        document.querySelectorAll(TIRAS).forEach(function (t) { try { marca(t, centra); } catch (e) { /* nada */ } });
        document.querySelectorAll(GRUPOS).forEach(function (t) { try { if (!t.matches(TIRAS)) marca(t, centra, 'pt-tabla'); } catch (e) { /* nada */ } });
        var tablas = document.querySelectorAll('table');
        for (var i = 0; i < tablas.length && i < 80; i++) {
          try { var c = cajaDe(tablas[i]); if (c && !c.matches(TIRAS) && !c.matches(GRUPOS)) marca(c, false, 'pt-tabla'); } catch (e) { /* nada */ }
        }
      }, 120);
    }
    document.addEventListener('scroll', function (e) {
      var t = e.target;
      if (document.querySelector('[data-lado]')) lados();
      if (t && t.classList && t.classList.contains('pt-desliza')) marca(t, false);
      else if (t && t.classList && t.classList.contains('pt-tabla')) marca(t, false, 'pt-tabla');
    }, true);
    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target.closest(TIRAS) : null;
      var g = !t && e.target && e.target.closest ? e.target.closest(GRUPOS) : null;
      if (t) setTimeout(function () { marca(t, true); }, 60);
      else if (g) setTimeout(function () { marca(g, true, 'pt-tabla'); }, 60);
      else todas(false);
    }, true);
    window.addEventListener('resize', function () { lados(); todas(true); });
    function arranca() {
      todas(true);
      if (window.MutationObserver && document.body) {
        new MutationObserver(function () { todas(false); }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'aria-selected', 'class'] });
      }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arranca); else arranca();
  })();

  /* ---- Ventanas dentro de una pantalla, en el celular (Daniel, 1-nov-2026, 12:43: «Ya»; lo encontró la revisión
     completa del 1-nov con «Menú arriba»). En el celular cada pantalla vive en su marco, con el alto de la pantalla menos
     el encabezado; arriba del marco va la franja «Privado · …» (y antes, con «Menú arriba», la tira de íconos; el menú
     arriba se quitó el 2-nov-2026), que se va al deslizar. Una ventana que se abre dentro de la pantalla se acomoda a su marco, así que, con la página hasta arriba,
     su parte de abajo (sus botones) quedaba fuera hasta que uno deslizaba. Al abrirse una ventana, la página de afuera
     se desliza sola lo necesario para que el marco quede completo a la vista, justo debajo del encabezado (y lo mismo
     con un marco dentro de otro). En la computadora y el iPad el marco ya cabe y no se mueve nada. Vale para todas las
     pantallas, las de hoy y las nuevas: basta que su ventana lleve role="dialog" o aria-modal="true", como todas.
     construir.py (exige_ventanas_marco) no publica si se quita. ---- */
  (function ventanasEnMarco() {
    var SEL = '[aria-modal="true"],[role="dialog"],[role="alertdialog"],dialog[open]';
    function seVe(d) {
      if (!d.getClientRects().length) return false;
      var cs = getComputedStyle(d);
      return cs.visibility !== 'hidden' && cs.display !== 'none';
    }
    function hayVentana() {
      var l = document.querySelectorAll(SEL);
      for (var i = 0; i < l.length; i++) if (seVe(l[i])) return true;
      return false;
    }
    // dónde termina el encabezado pegado arriba de esa página (si lo tiene)
    function topeFijo(doc) {
      var h = doc.querySelector('header.band') || doc.querySelector('body > header');
      if (!h) return 0;
      var cs = doc.defaultView.getComputedStyle(h);
      if (cs.position !== 'sticky' && cs.position !== 'fixed') return 0;
      return Math.max(0, h.getBoundingClientRect().bottom);
    }
    function alinea() {
      for (var w = window, n = 0; n < 4; n++) {
        var p = null, fe = null;
        try { p = w.parent; fe = w.frameElement; } catch (e) { return; }   // otro origen: no se toca
        if (!p || p === w || !fe || !fe.getClientRects().length) return;
        var r = fe.getBoundingClientRect(), alto = p.innerHeight, tope = topeFijo(p.document);
        if (r.bottom > alto + 1 && r.top > tope + 1) {
          try { p.scrollBy(0, Math.min(r.top - tope, r.bottom - alto)); } catch (e) { /* nada */ }
        }
        w = p;
      }
    }
    var habia = false, espera = null;
    function revisa() {
      clearTimeout(espera);
      espera = setTimeout(function () {
        var hay = hayVentana();
        if (hay && !habia) alinea();   // solo al abrirse: si la persona desliza después, no se le regresa
        habia = hay;
      }, 30);
    }
    function arranca() {
      var fe = null;
      try { fe = window.parent !== window ? window.frameElement : null; } catch (e) { fe = null; }
      if (!fe || !document.body) return;   // página abierta sola o de otro origen: no hay marco que acomodar
      if (window.MutationObserver) {
        new MutationObserver(revisa).observe(document.body, { childList: true, subtree: true, attributes: true,
          attributeFilter: ['hidden', 'class', 'style', 'open', 'aria-hidden'] });
      }
      revisa();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arranca); else arranca();
  })();
  /* ---- La franja de arriba de cada pantalla (pedido de Fernando Cadengo, 4-nov-2026: «Cada módulo en la parte superior
     donde trae el nombre, dice una explicación de qué es el módulo, ¿no sería mejor poner un signo de interrogación…?
     Así la cintilla se hace más pequeña»; «que en pequeño traigan el nombre del menú y en grande el nombre del submenú»;
     «Todas las pantallas de una vez»). La franja azul de cada pantalla (div.band, con su línea naranja) queda de un solo
     renglón: en chico el módulo del menú y en grande la opción por la que se entró (la misma de PORTAL_MENU, una sola
     versión de los nombres; si la página se abre sola, sus propios títulos), y a un lado un «?» que enseña la
     explicación de la pantalla en un globito (al pasar el mouse o al tocarlo; se cierra al tocar fuera o con Esc). La
     explicación es el mismo párrafo de siempre de cada página (se esconde, pero la página lo sigue escribiendo, también
     el que cambia según el puesto); si no trae, la descripción de esa opción en el menú. Los títulos y párrafos
     originales se quedan escondidos para que las páginas los sigan escribiendo sin que nada se rompa. Los botones de la
     franja (.acts) no cambian. El globito es un menú más: avisa con P.abreMenu('franja') y se cierra si se abre otro.
     construir.py (exige_franja()) no publica si se quita. ---- */
  (function franja() {
    var CSS = '.fr-oculto{display:none!important}'
      + '.band.fr-lista>.wrap{padding-top:8px!important;padding-bottom:8px!important;align-items:center!important}'
      + '.band .fr-tit{min-width:0;max-width:100%}'
      + '.band .fr-tit .fr-eti{display:block;margin:0;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--band-dim,rgba(255,255,255,.72));line-height:1.3}'
      + '.band .fr-fila{display:flex;align-items:center;gap:8px;min-width:0}'
      + '.band .fr-tit h1.fr-h1{margin:0;color:inherit;font-size:20px;line-height:1.2;font-weight:750;overflow-wrap:anywhere;min-width:0}'
      + '.band .fr-q{flex:none;width:24px;height:24px;padding:0;border-radius:50%;border:1.5px solid var(--band-dim,rgba(255,255,255,.72));'
      + 'background:transparent;color:inherit;font:inherit;font-size:13px;font-weight:700;line-height:1;display:inline-grid;place-items:center;cursor:pointer}'
      + '.band .fr-q:hover,.band .fr-q[aria-expanded="true"]{background:rgba(255,255,255,.14)}'
      + '.band .fr-q:focus-visible{outline:2px solid #F07A1E;outline-offset:2px}'
      + '.fr-g{position:absolute;z-index:70;top:calc(100% + 6px);left:12px;right:12px;max-width:520px;box-sizing:border-box;'
      + 'background:var(--surface,#fff);color:var(--ink,#132036);border:1px solid var(--line,#DCE2EB);border-radius:12px;'
      + 'padding:12px 14px;box-shadow:0 10px 30px rgba(10,18,32,.28);font-size:14px;font-weight:400;line-height:1.45;'
      + 'letter-spacing:0;text-transform:none;text-align:left;white-space:normal;overflow-wrap:anywhere}'
      + '.fr-g b{display:block;margin:0 0 4px;font-size:11.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#5A6577}'
      // colores propios (no los de cada página, que no se llaman igual en todas: en Activo fijo el texto salía oscuro sobre oscuro)
      + '.fr-g{background:#fff;color:#132036;border-color:#DCE2EB}'
      + ':root[data-theme="dark"] .fr-g{background:#1B2438;color:#E6EBF5;border-color:#33405E}:root[data-theme="dark"] .fr-g b{color:#9AA8BF}'
      + '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .fr-g{background:#1B2438;color:#E6EBF5;border-color:#33405E}:root:not([data-theme="light"]) .fr-g b{color:#9AA8BF}}'
      + '.band.fr-propia{--band-dim:#B9C7DE;background:#1F3864;color:#fff;border-bottom:4px solid #F07A1E;font-family:inherit}'
      + ':root[data-theme="dark"] .band.fr-propia{--band-dim:#8FA3C4;background:#16284A;color:#E5EAF2}'
      + '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .band.fr-propia{--band-dim:#8FA3C4;background:#16284A;color:#E5EAF2}}'
      + '.band.fr-propia>.fr-wrap{padding:8px 20px;display:flex;align-items:center;justify-content:space-between;gap:10px}'
      + '@media (max-width:600px){.band .fr-tit h1.fr-h1{font-size:18px}.band .fr-q{width:26px;height:26px}.band.fr-propia>.fr-wrap{padding:8px 16px}}';
    var band = null, tit = null, eti = null, h1 = null, q = null, glo = null, orig = null, fijo = false, quita = null;
    var MENU = 'franja';
    // la opción del menú por la que se entró: el marco vive en <main id="v-<vista>"> de la vista
    function miOpcion() {
      try {
        var fe = window.parent !== window ? window.frameElement : null;
        if (!fe) return null;
        var sec = fe.closest('[id^="v-"]'), pm = window.parent.PORTAL_MENU;
        if (!sec || !pm || typeof pm.modulos !== 'function') return null;
        // una pantalla con varias opciones en el menú (Q Chat: Conversaciones, Tickets a desarrollo y Eficiencia del soporte)
        // dice la que está abierta; si no, la primera
        var v = sec.id.slice(2), mods = pm.modulos() || [], a = typeof pm.actual === 'function' ? pm.actual() : null, pri = null;
        for (var i = 0; i < mods.length; i++) {
          var subs = mods[i].subs || [];
          for (var j = 0; j < subs.length; j++) {
            if (subs[j].v !== v) continue;
            var o = { m: mods[i].t, t: subs[j].t, d: subs[j].d || '' };
            if (a && a.k === subs[j].k) return o;
            if (!pri) pri = o;
          }
        }
        if (pri) return pri;
      } catch (e) { /* otro origen o sin menú */ }
      return null;
    }
    var OP = null;
    function texto(el) { return el ? String(el.textContent || '').replace(/\s+/g, ' ').trim() : ''; }
    function explicacion() {
      var t = orig.ps.map(texto).filter(Boolean).join(' ');
      return t || (OP && OP.d) || '';
    }
    function pinta() {
      if (!tit) return;
      var m = OP ? OP.m : texto(orig.eti), t = OP ? OP.t : texto(orig.h1);
      if (eti.textContent !== m) eti.textContent = m;
      eti.hidden = !m;
      if (h1.textContent !== t) h1.textContent = t;
      q.hidden = !explicacion();
      if (q.hidden) cierra();
    }
    function abre(fija) {
      var t = explicacion();
      if (!t) return;
      fijo = fijo || !!fija;
      if (!glo.hidden) { glo.lastChild.textContent = t; return; }
      glo.innerHTML = '<b>¿Qué es esta pantalla?</b><span></span>';
      glo.lastChild.textContent = t;
      // justo debajo del «?», aunque la franja traiga más cosas abajo (los números del Calendario, el periodo de la Caja chica)
      try { glo.style.top = Math.round(q.getBoundingClientRect().bottom - band.getBoundingClientRect().top + 8) + 'px'; } catch (e) { /* se queda abajo de la franja */ }
      glo.hidden = false;
      // encima de lo que la página tenga pegado arriba (la barra de pestañas de Activo fijo)
      band.dataset.frZ = band.style.zIndex || ''; band.style.zIndex = '80';
      q.setAttribute('aria-expanded', 'true');
      try { P.abreMenu(MENU); } catch (e) { /* sin aviso */ }
    }
    function cierra() {
      fijo = false;
      clearTimeout(quita);
      if (!glo || glo.hidden) return;
      glo.hidden = true;
      band.style.zIndex = band.dataset.frZ || '';
      q.setAttribute('aria-expanded', 'false');
    }
    var conMouse = function () { try { return matchMedia('(hover:hover) and (pointer:fine)').matches; } catch (e) { return false; } };
    function arma() {
      if (tit || !document.body) return !!tit;
      // la franja de la pantalla, no el encabezado del portal (el de las vistas y el del Cotizador DECOMSA traen el signo)
      band = [].filter.call(document.querySelectorAll('body .band'), function (b) { return b.querySelector('h1') && !b.querySelector('.brandtxt'); })[0];
      // las pantallas con su propio encabezado (Cartera, Variaciones, Activo fijo; Fernando, 4-nov-2026: «hay que unificar
      // el estilo de las pantallas») marcan su título viejo con data-franja-oculta: se les pone la misma franja arriba y
      // su título se esconde (su línea de datos y sus botones se quedan donde están)
      var viejos = band ? [] : [].slice.call(document.querySelectorAll('[data-franja-oculta]'));
      if (!band && viejos.length) {
        var tv = viejos.map(function (x) { return x.tagName === 'H1' ? x : x.querySelector('h1'); }).filter(Boolean)[0];
        band = document.createElement('div'); band.className = 'band fr-propia';
        band.innerHTML = '<div class="fr-wrap"><div><h1></h1></div></div>';
        band.querySelector('h1').textContent = texto(tv);
        document.body.insertBefore(band, document.body.firstChild);
        viejos.forEach(function (x) { x.classList.add('fr-oculto'); });
        document.documentElement.classList.add('fr-con');
      }
      var h = band && band.querySelector('h1');
      if (!h) return false;
      var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
      var pe = h.parentNode;
      orig = {
        h1: h,
        eti: band.querySelector('.eti') || band.querySelector('.mark'),
        ps: [].filter.call(pe.children, function (x) { return x.tagName === 'P'; })
      };
      tit = document.createElement('div'); tit.className = 'fr-tit';
      tit.innerHTML = '<div class="eti fr-eti"></div><div class="fr-fila"><h1 class="fr-h1"></h1>'
        + '<button type="button" class="fr-q" aria-label="¿Qué es esta pantalla?" aria-expanded="false" aria-controls="fr-g">?</button></div>';
      pe.insertBefore(tit, h);
      eti = tit.querySelector('.fr-eti'); h1 = tit.querySelector('.fr-h1'); q = tit.querySelector('.fr-q');
      [orig.h1, orig.eti].concat(orig.ps).forEach(function (x) { if (x) x.classList.add('fr-oculto'); });
      glo = document.createElement('div'); glo.id = 'fr-g'; glo.className = 'fr-g'; glo.setAttribute('role', 'tooltip'); glo.hidden = true;
      band.appendChild(glo);
      if (getComputedStyle(band).position === 'static') { band.style.position = 'relative'; band.style.zIndex = '6'; }
      band.classList.add('fr-lista');
      q.addEventListener('click', function () { if (!glo.hidden && fijo) cierra(); else abre(true); });
      [q, glo].forEach(function (x) {
        x.addEventListener('mouseenter', function () { if (conMouse()) { clearTimeout(quita); abre(false); } });
        x.addEventListener('mouseleave', function () { if (conMouse() && !fijo) { clearTimeout(quita); quita = setTimeout(cierra, 220); } });
      });
      document.addEventListener('click', function (e) { if (!glo.hidden && !q.contains(e.target) && !glo.contains(e.target)) cierra(); }, true);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !glo.hidden) { cierra(); try { q.focus(); } catch (x) { /* nada */ } } });
      document.addEventListener(EV_MENU, function (e) { if (e.detail !== MENU) cierra(); });
      // la página sigue escribiendo sus títulos y su explicación (según el puesto o la sección): se vuelve a pintar
      if (window.MutationObserver) {
        new MutationObserver(function () { pinta(); }).observe(pe, { childList: true, subtree: true, characterData: true });
        if (orig.eti && !pe.contains(orig.eti)) new MutationObserver(function () { pinta(); }).observe(orig.eti, { childList: true, subtree: true, characterData: true });
      }
      return true;
    }
    function arranca() {
      if (!arma()) return;
      OP = miOpcion(); pinta();
      // el menú de afuera puede tardar en saber las opciones de quien entró: se vuelve a preguntar un rato
      var n = 0;
      (function otra() { if (OP || ++n > 24) return; setTimeout(function () { OP = miOpcion(); if (OP) pinta(); else otra(); }, 500); })();
    }
    // la pantalla cambió de opción (Q Chat, al picar su pestaña): la franja dice la nueva
    P.franjaAlDia = function () { if (!tit) return; OP = miOpcion() || OP; pinta(); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arranca); else arranca();
  })();

  P.usuarioLimpio = function (u) {
    return String(u || '').split('@')[0].normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().trim().replace(/\s+/g, '.');
  };
  P.correoDe = function (u) { return P.usuarioLimpio(u) + DOMINIO; };
  P.paginaDe = function (rol) { return PAGINA[rol] || './'; };
  P.perfilDe = async function (uid) {
    var r = await sb.from('perfiles').select('id,usuario,nombre,nombre_wf,rol').eq('id', uid).maybeSingle();
    if (r.error) throw r.error;
    return r.data;
  };
  /* ---- Bitácora de accesos (solo la lee el director; portal/sql/13_accesos.sql) ----
     Anota salidas, cierres por inactividad, cambios de contraseña y descargas. Nunca detiene la página:
     si la base no responde en 1.5 s, sigue sin anotar. */
  var NOMBRE_PAG = { director: 'Dirección', gerentes: 'Vista del equipo', contadores: 'Mi WorkFlow', cartera: 'Depuración de CxC / CxP',
    cajachica: 'Caja chica', variaciones: 'Variaciones / Movimientos', activofijo: 'Reclasificación de activo fijo', 'quo-cotizador': 'Cotizador QUO',
    'quo-membresias': 'Membresías QUO', cotizador: 'Cotizador DECOMSA', accesos: 'Accesos', calendario: 'Calendario', cambios: 'Cambios al portal', chat: 'Chat' };
  P.pagina = function () {
    var n = (location.pathname.split('/').pop() || '').replace(/\.html$/, '');
    return NOMBRE_PAG[n] || n || 'Portal';
  };
  P.registrar = function (evento, detalle) {
    var q;
    try {
      q = sb.rpc('registrar_acceso', { evento: evento, detalle: String(detalle || '').slice(0, 200) }).then(function () {}, function () {});
    } catch (e) { return Promise.resolve(); }
    return Promise.race([q, new Promise(function (r) { setTimeout(r, 1500); })]);
  };

  /* ---- Cierre por inactividad: una hora sin tocar el portal (en ninguna pestaña ni marco) cierra la sesión.
     La última actividad se comparte entre pestañas (localStorage) y los marcos le avisan a la página de arriba. ---- */
  var INACTIVO = 60 * 60 * 1000, CLAVE_ACT = 'profase-actividad', CLAVE_CIERRE = 'profase-cierre';
  var ultimaLocal = Date.now(), ultEscrita = 0, cerrando = false;
  function guardada() { try { return +localStorage.getItem(CLAVE_ACT) || 0; } catch (e) { return 0; } }
  function arriba() { try { return window.parent !== window && window.parent.PORTAL ? window.parent.PORTAL : null; } catch (e) { return null; } }
  P.ultimaActividad = function () {
    var t = Math.max(ultimaLocal, guardada()), a = arriba();
    if (a && a.ultimaActividad) { try { t = Math.max(t, a.ultimaActividad()); } catch (e) {} }
    return t;
  };
  P.marcaActividad = function () { ultimaLocal = Date.now(); };
  // Al entrar (index.html) la cuenta empieza de cero
  P.actividadNueva = function () {
    ultimaLocal = Date.now(); ultEscrita = ultimaLocal;
    try { localStorage.setItem(CLAVE_ACT, String(ultimaLocal)); } catch (e) {}
  };
  function actividad() {
    var ahora = Date.now();
    ultimaLocal = ahora;
    if (ahora - ultEscrita < 15000) return;
    ultEscrita = ahora;
    try { localStorage.setItem(CLAVE_ACT, String(ahora)); } catch (e) {}
    var a = arriba(); if (a && a.marcaActividad) { try { a.marcaActividad(); } catch (e) {} }
  }
  function aLaEntrada(extra) {
    var url = './' + (extra || '');
    try { (window.top || window).location.replace(new URL(url, location.href).href); } catch (e) { location.replace(url); }
  }
  async function cierraPorInactividad() {
    if (cerrando) return;
    cerrando = true;
    var otro = 0; try { otro = +localStorage.getItem(CLAVE_CIERRE) || 0; } catch (e) {}
    try {
      var s = (await sb.auth.getSession()).data.session;
      if (s) {
        if (Date.now() - otro > 60000) {   // si otra pestaña ya lo anotó, no se repite
          try { localStorage.setItem(CLAVE_CIERRE, String(Date.now())); } catch (e) {}
          await P.registrar('inactividad', 'una hora sin uso · ' + P.pagina());
        }
        await sb.auth.signOut();
      }
    } catch (e) { /* sin red: igual se va */ }
    aLaEntrada('?e=inactivo');
  }
  function revisaInactividad() { if (!cerrando && Date.now() - P.ultimaActividad() > INACTIVO) cierraPorInactividad(); }
  function vigilaInactividad() {
    // Si la última vez que se usó el portal fue hace más de una hora (pestañas cerradas), se cierra al abrir
    var g = guardada();
    if (g && Date.now() - g > INACTIVO) { cierraPorInactividad(); return; }
    // Si la página se acaba de recargar sola por una versión nueva, eso no cuenta como actividad: abrir la página (y sus
    // pestañas, que se mueven solas al cargar) no reinicia la hora; se empieza a escuchar unos segundos después.
    var sola = P.recargaSola();
    if (!sola) actividad();
    function escucha() {
      ['pointerdown', 'keydown', 'wheel', 'touchstart', 'mousemove'].forEach(function (ev) {
        window.addEventListener(ev, actividad, { passive: true, capture: true });
      });
      window.addEventListener('scroll', actividad, { passive: true, capture: true });
    }
    if (sola) setTimeout(escucha, 8000); else escucha();
    document.addEventListener('visibilitychange', function () { if (!document.hidden) revisaInactividad(); });
    setInterval(revisaInactividad, 30000);
  }

  /* ---- A medio escribir (1-nov-2026, Daniel: «no quiero que se pierda lo ya tomado en notas por algún pop o algo
     tuyo»). Una ventana donde se escribe algo largo (la minuta de una reunión, por ejemplo) llama
     PORTAL.escribiendo('minuta', true) al abrirse (y otra vez cada vez que guarda) y PORTAL.escribiendo('minuta', false)
     al cerrarse. Mientras tanto la página no se recarga por una versión nueva, el cierre temporal espera, jalar para
     actualizar no hace nada, la ventana de la foto y los recorridos esperan, y el aviso de cerrar la reunión se queda
     chico. Desde un marco se anota en la página de arriba. Si nadie lo renueva en 20 minutos se suelta solo (una
     pestaña que se cerró sin avisar no detiene el portal para siempre). PORTAL.ocupado() = a media llamada o escribiendo. ---- */
  var ESCRIBE = {}, ESCRIBE_MS = 20 * 60 * 1000;
  P.escribiendo = function (clave, si) {
    var a = arriba(); if (a && a.escribiendo) { try { return a.escribiendo(clave, si); } catch (e) { /* sigue aquí */ } }
    clave = String(clave || 'algo');
    if (si === false) delete ESCRIBE[clave]; else ESCRIBE[clave] = Date.now();
  };
  // a medio escribir de verdad (sin contar «No molestar», abajo)
  function escribeDe() {
    var a = arriba(); if (a && a.estaEscribiendoSolo) { try { return a.estaEscribiendoSolo(); } catch (e) { /* sigue aquí */ } }
    var t = Date.now(), k, hay = false;
    for (k in ESCRIBE) { if (t - ESCRIBE[k] < ESCRIBE_MS) hay = true; else delete ESCRIBE[k]; }
    return hay;
  }
  P.estaEscribiendoSolo = escribeDe;
  // «No molestar» cuenta como «a medio escribir»: todo lo que espera a que nadie escriba (ventanas, recorridos, avisos,
  // la versión nueva, el cierre temporal) también espera a que se quite
  P.estaEscribiendo = function () { return P.noMolestar() || escribeDe(); };
  // ¿Se escribe con teclado de verdad? (Héctor Daniel, 3-nov-2026: «quiero picarle enter y que se mande en el chat crm
  // desde mi magic keyboard»). Sí en la computadora (puntero fino) y en el iPad con Magic Keyboard, trackpad o mouse
  // (any-pointer:fine), o con un teclado sin trackpad mientras se escribe (el teclado de la pantalla no está abierto).
  // En el celular no: ahí Enter hace otro renglón. Se pregunta cada vez (el teclado se pone y se quita). Una sola versión:
  // la usan el chat y SuperConta para «Enter manda» y para poner el cursor solo en el cuadro de texto.
  P.conTeclado = function () {
    try {
      if (!window.matchMedia) return true;
      if (!matchMedia('(pointer:coarse)').matches || matchMedia('(any-pointer:fine)').matches) return true;
      var ua = navigator.userAgent || '', ipad = /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
      var a = document.activeElement;
      if (ipad && a && /^(TEXTAREA|INPUT)$/.test(a.tagName)) {
        var w = window; try { if (window.top.visualViewport) w = window.top; } catch (e) { /* otro origen: esta ventana */ }
        var vv = w.visualViewport;
        if (vv) return (w.innerHeight - vv.height * vv.scale) < 150;
      }
    } catch (e) { /* sin saber: como pantalla táctil */ }
    return false;
  };
  // ocupado(true): sin contar «No molestar» (jalar para actualizar sigue funcionando mientras está prendido)
  P.ocupado = function (sinNoMolestar) {
    var a = arriba(); if (a && a.ocupado) { try { return a.ocupado(sinNoMolestar); } catch (e) { /* sigue aquí */ } }
    try { return !!(P.enLlamada && P.enLlamada()) || (sinNoMolestar ? escribeDe() : P.estaEscribiendo()); } catch (e) { return false; }
  };

  /* ---- «No molestar» (Héctor Daniel, 2-nov-2026, 13:47: «quiero agregar un no molestar… porque estaremos presentando y
     para que no vean los mensajes que reciben las personas que están viendo las pantallas»; 13:5x: para todos los
     usuarios, «Sí, solo se calla la pantalla donde presento» y solo con el botón, sin prenderse solo).
     - Se prende en el menú de la foto (portal/nm_tab.js) y vale para ESTE navegador en este equipo: todas sus pestañas y
       marcos (se guarda en localStorage, «profase-no-molestar»). Sus demás equipos (su celular) siguen igual que siempre.
     - Mientras dura, en esta pantalla no salta nada: ni los globitos ni el sonido del chat, ni la campanita, ni llamadas,
       ni quién espera en una videollamada, ni recordatorios, ventanas, recorridos, la versión nueva o el cierre temporal
       (esperan a que se quite). Los mensajes, los avisos y los números llegan igual: nada se pierde.
     - El aviso de la computadora (el que llega aunque el portal esté cerrado) tampoco llega a este equipo: la base lo
       calla con chat_push_callar (portal/sql/147_no_molestar.sql) y la función chat-push no le manda nada mientras dure.
     - Se apaga solo a la hora escogida (como máximo, a las 23:59 de hoy) y entonces, en la pestaña que está a la vista,
       sale cuántos mensajes, avisos y llamadas llegaron mientras tanto (nunca de quién ni qué dicen).
     - La red de seguridad: mientras está prendido, <html> lleva la clase «nm-on» y estos avisos flotantes no se ven
       aunque alguno no lo revisara (NM_CSS). Un aviso flotante nuevo que salte solo revisa PORTAL.noMolestar() y, si
       algo llegó, PORTAL.noMolestarCuenta('chat'|'avisos'|'llamadas', id). ---- */
  var NM_K = 'profase-no-molestar', NM_R = 'profase-no-molestar-resumen', NM_EV = 'profase-no-molestar';
  var NM_CSS = 'html.nm-on .cht-toast,html.nm-on .ntf-toast,html.nm-on .chg-toast,html.nm-on .ll-toast,html.nm-on .ll-entra,'
    + 'html.nm-on .reu-c,html.nm-on #cal-aviso,html.nm-on .tbd-bar,html.nm-on #pv-toast,'
    // los avisos chicos que llegan solos (P.avisoChico: la campanita y Cambios al portal); los que salen por algo que uno picó, sí
    + 'html.nm-on #pa-avisos [data-pa="ntf"],html.nm-on #pa-avisos [data-pa="chg"]{display:none!important}';
  function nmLee() { try { var x = JSON.parse(localStorage.getItem(NM_K) || 'null'); return x && +x.hasta ? x : null; } catch (e) { return null; } }
  function nmGuarda(x) { try { if (x) localStorage.setItem(NM_K, JSON.stringify(x)); else localStorage.removeItem(NM_K); } catch (e) { /* sin almacenamiento */ } }
  P.noMolestar = function () { var x = nmLee(); return !!(x && +x.hasta > Date.now()); };
  P.noMolestarDe = function () { var x = nmLee(); return x && +x.hasta > Date.now() ? { desde: +x.desde || 0, hasta: +x.hasta, min: +x.min || 0, n: x.n || {} } : null; };
  // lo que llegó mientras tanto: solo cuántos (nunca de quién ni qué dice); con «id» no se cuenta dos veces lo mismo
  P.noMolestarCuenta = function (tipo, id) {
    var x = nmLee(); if (!x || +x.hasta <= Date.now()) return;
    x.n = x.n || {}; x.ya = Array.isArray(x.ya) ? x.ya : [];
    if (id != null) { var k = tipo + ':' + id; if (x.ya.indexOf(k) >= 0) return; x.ya.push(k); if (x.ya.length > 300) x.ya = x.ya.slice(-300); }
    x.n[tipo] = (+x.n[tipo] || 0) + 1; nmGuarda(x);
  };
  // las 23:59 de hoy en Monterrey (lo más que dura)
  function nmMedianoche() {
    var p = {};
    try {
      new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Monterrey', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })
        .formatToParts(new Date()).forEach(function (x) { p[x.type] = +x.value; });
    } catch (e) { return Date.now() + 3600e3; }
    var pasado = ((p.hour || 0) * 3600 + (p.minute || 0) * 60 + (p.second || 0)) * 1000;
    return Math.max(Date.now() + 60e3, Date.now() - pasado + 86340e3);
  }
  // la dirección de avisos de este navegador (la que guardó el chat al activarlos), si la tiene
  async function nmEquipo() {
    try {
      if (!('serviceWorker' in navigator)) return null;
      var reg = await navigator.serviceWorker.getRegistration('/');
      if (!reg || !reg.pushManager) return null;
      var s = await reg.pushManager.getSubscription();
      return s && s.endpoint ? s.endpoint : null;
    } catch (e) { return null; }
  }
  async function nmBase(hasta) {
    var ep = await nmEquipo(); if (!ep) return { ok: true, equipo: false };
    try {
      var r = await sb.rpc('chat_push_callar', { p_endpoint: ep, p_hasta: hasta ? new Date(hasta).toISOString() : null });
      if (r.error) throw r.error;
      return r.data || { ok: true, equipo: false };
    } catch (e) { return { ok: false, equipo: true }; }
  }
  function nmClase() { try { document.documentElement.classList.toggle('nm-on', P.noMolestar()); } catch (e) { /* nada */ } }
  function nmDispara(det) { nmClase(); try { window.dispatchEvent(new CustomEvent(NM_EV, { detail: det || {} })); } catch (e) { /* nada */ } }
  // min: 30, 60, 120… o 0 = hasta que lo quite (las 23:59 de hoy). Regresa {hasta, equipo, base}
  P.noMolestarPon = async function (min) {
    var ahora = Date.now(), tope = nmMedianoche(), x = nmLee(), sigue = !!(x && +x.hasta > ahora);
    var hasta = +min > 0 ? Math.min(ahora + min * 60000, tope) : tope;
    nmGuarda({ desde: sigue ? +x.desde : ahora, hasta: hasta, min: +min > 0 ? +min : 0, n: sigue ? (x.n || {}) : {}, ya: sigue ? (x.ya || []) : [] });
    try { localStorage.removeItem(NM_R); } catch (e) { /* nada */ }
    nmDispara({ pon: true });
    var b = await nmBase(hasta);
    return { hasta: hasta, equipo: !!b.equipo, base: b.ok !== false };
  };
  // fin: lo apaga y deja el resumen para la pestaña que está a la vista (portal/nm_tab.js lo enseña)
  function nmFin(x, como) {
    nmGuarda(null);
    try { localStorage.setItem(NM_R, JSON.stringify({ desde: +x.desde || 0, hasta: Math.min(+x.hasta, Date.now()), n: x.n || {}, como: como, t: Date.now() })); } catch (e) { /* nada */ }
    nmDispara({ fin: true, como: como });
  }
  P.noMolestarQuita = async function () {
    var x = nmLee(); if (!x) return null;
    nmFin(x, 'quito');
    await nmBase(null);
    return x;
  };
  P.noMolestarResumen = function (quitar) {
    var r = null; try { r = JSON.parse(localStorage.getItem(NM_R) || 'null'); if (quitar) localStorage.removeItem(NM_R); } catch (e) { r = null; }
    return r && Date.now() - (+r.t || 0) < 12 * 3600e3 ? r : null;
  };
  (function () {
    try { var st = document.createElement('style'); st.textContent = NM_CSS; (document.head || document.documentElement).appendChild(st); } catch (e) { /* nada */ }
    nmClase();
    // otra pestaña o marco lo prendió o lo quitó
    window.addEventListener('storage', function (e) { if (e.key === NM_K || e.key === null) nmDispara({ otra: true }); });
    var antes = P.noMolestar();
    setInterval(function () {
      var x = nmLee();
      // se acabó la hora: lo apaga la página de arriba (la base vuelve sola a la misma hora)
      if (x && +x.hasta <= Date.now() && window.parent === window) { antes = false; nmFin(x, 'hora'); return; }
      var hoy = P.noMolestar(); if (hoy !== antes) { antes = hoy; nmDispara({}); }
    }, 15000);
    // al abrir con «No molestar» prendido, la base se pone al día con este navegador (por si su suscripción cambió)
    // (P.listo se arma más abajo en este mismo archivo: se espera a que exista)
    if (window.parent === window) setTimeout(function () {
      if (!P.listo || !P.listo.then) return;
      P.listo.then(function (p) { var x = nmLee(); if (p && x && +x.hasta > Date.now()) nmBase(+x.hasta); else if (p && x) nmFin(x, 'hora'); }).catch(function () {});
    }, 0);
  })();

  /* ---- Cierre temporal (30-oct-2026, pedido de Daniel: «Saca a todos del CRM con ese aviso y cuando quede ya les
     avisamos»). Al abrir, portal/cierre.js (escrito al principio de cada página) ya revisa cierre.json; aquí, en la
     página de arriba que ya está abierta, se revisa cada minuto mientras está a la vista y al volver a ella. Si dice
     "cerrado": true, se guarda a dónde iba y se lleva a cerrado.html, que lo regresa solo al reabrir. No pasa por la
     base (cierre.json vive en profase-portal), así que funciona aunque la base no conteste. A media llamada del chat
     espera a que cuelgue, y a medio escribir (PORTAL.escribiendo), a que termine. ---- */
  (function () {
    if (window.parent !== window) return;
    if (!/(^|\.)crmprofase\.com\.mx$/.test(location.hostname) && !window.__PRUEBA_CIERRE) return;
    var ultimaC = 0;
    function revisaCierre() {
      if (document.hidden || Date.now() - ultimaC < 20000) return;
      try { if (P.ocupado()) return; } catch (e) { /* sigue */ }
      ultimaC = Date.now();
      fetch('/cierre.json?t=' + Date.now(), { cache: 'no-store', credentials: 'omit' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          if (!j || j.cerrado !== true) return;
          if (j.hasta && !isNaN(Date.parse(j.hasta)) && Date.now() >= Date.parse(j.hasta)) return;   // «hasta»: ya abrió solo
          try { sessionStorage.setItem('profase-regreso', location.pathname + location.search + location.hash); } catch (e) { /* nada */ }
          location.replace('/cerrado.html');
        }, function () { /* sin red: se revisa después */ });
    }
    setInterval(revisaCierre, 60000);
    document.addEventListener('visibilitychange', revisaCierre);
  })();

  /* ---- Versión nueva (29-oct-2026, pedido de Daniel): cada cambio que se publica (lo suba Daniel, Fernando o una
     propuesta autorizada) le llega a quien tenga el portal abierto, sin que tenga que refrescar a mano.
     construir.py deja en version.json la huella de lo publicado y la misma huella en <meta name="portal-version"> de
     las tres vistas. Aquí, solo en la página de arriba (no en las pestañas que van en su marco):
       · al abrir: si la página llegó vieja (el navegador tenía guardada la de antes), se cambia sola por la nueva;
       · cada minuto mientras está a la vista, y al volver a ella: si se publicó algo, sale una ventana que no se
         cierra; se actualiza al picar «Actualizar ahora» o sola en 60 segundos. Una sola vez se puede pedir esperar
         3 minutos (por si alguien está a medio escribir); después vuelve la ventana y se actualiza sí o sí.
     La recarga lleva ?v=<huella> para que el navegador no use la copia vieja (luego se quita de la dirección), conserva
     la sección (#…) y la sesión, y la recarga automática no cuenta como actividad para el cierre por inactividad. ---- */
  var RECARGA_SOLA = 'profase-recarga-sola', SALTOS_V = 'profase-version-saltos', CARGA_T = Date.now(), recargaSola = false;
  if (window.parent === window) {
    try {
      var rs = +sessionStorage.getItem(RECARGA_SOLA) || 0;
      sessionStorage.removeItem(RECARGA_SOLA);
      recargaSola = rs > 0 && Date.now() - rs < 60000;
    } catch (e) { recargaSola = false; }
  }
  // ¿Esta página (o la de arriba, si es una pestaña en su marco) se acaba de recargar sola? Vale los primeros 30 s.
  P.recargaSola = function () {
    var a = arriba();
    if (a && a.recargaSola) { try { return a.recargaSola(); } catch (e) { return false; } }
    return recargaSola && Date.now() - CARGA_T < 30000;
  };
  var CSS_VERSION = '.pv-nota{font-size:13px;color:#5A6474}.pv-seg{font-variant-numeric:tabular-nums}#pv-dlg:focus{outline:none}'
    + ':root[data-theme="dark"] .pv-nota{color:#A9B4C6}';
  var IC_VERSION = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>';
  function versionNueva() {
    if (window.parent !== window || P._versionNueva) return;
    P._versionNueva = true;
    var CADA_V = 60000, SEG = 60, SEG_FINAL = 30, ESPERA = 3 * 60000, HEX = /^[0-9a-f]{6,40}$/;
    var meta = document.querySelector('meta[name="portal-version"]');
    var propia = meta && HEX.test(meta.content) ? meta.content : null;
    var inicial = null, nueva = null, ultima = 0, yendo = false, espero = false, tic = null;
    // la ?v= de una recarga ya cumplió: se quita de la dirección para que se vea limpia
    try {
      var u0 = new URL(location.href);
      if (u0.searchParams.has('v')) { u0.searchParams.delete('v'); history.replaceState(history.state, '', u0.href); }
    } catch (e) { /* navegador viejo: se queda */ }
    function lee() {
      return fetch(new URL('version.json?t=' + Date.now(), location.href).href, { cache: 'no-store', credentials: 'omit' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { return j && HEX.test(j.version) ? j.version : null; }, function () { return null; });
    }
    // Si una página sigue llegando vieja, no se insiste más de dos veces por versión (cada 5 minutos)
    function saltos(v) {
      try { var s = JSON.parse(sessionStorage.getItem(SALTOS_V) || '{}'); return s.v === v && Date.now() - s.t < 5 * 60000 ? s.n : 0; } catch (e) { return 0; }
    }
    function recarga(v, sola) {
      if (yendo) return;
      yendo = true;
      try {
        sessionStorage.setItem(SALTOS_V, JSON.stringify({ v: v, n: saltos(v) + 1, t: Date.now() }));
        if (sola) sessionStorage.setItem(RECARGA_SOLA, String(Date.now()));
      } catch (e) { /* sin almacenamiento: igual recarga */ }
      var u = new URL(location.href); u.searchParams.set('v', v);
      location.replace(u.href);
    }
    function cuenta(fin, el) {
      var s = Math.max(0, Math.ceil((fin - Date.now()) / 1000));
      if (el) el.textContent = el.getAttribute('data-mmss') ? Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2) : String(s);
      return s;
    }
    // a media llamada del chat (portal/llamada_tab.js) o a medio escribir (PORTAL.escribiendo: la minuta de una reunión)
    // no se recarga: se espera a que cuelgue o termine y luego sale la ventana
    function enLlamada() { try { return !!P.ocupado(); } catch (e) { return false; } }
    function esperaLlamada() {
      var ov = document.getElementById('pv-ov'); if (ov) ov.remove();
      var t = document.getElementById('pv-toast'); if (t) t.remove();
      clearInterval(tic);
      tic = setInterval(function () { if (!enLlamada()) { clearInterval(tic); ventana(); } }, 5000);
    }
    function ventana() {
      if (enLlamada()) return esperaLlamada();
      cssModo();
      if (!document.getElementById('pv-css')) { var st = document.createElement('style'); st.id = 'pv-css'; st.textContent = CSS_VERSION; document.head.appendChild(st); }
      var t = document.getElementById('pv-toast'); if (t) t.remove();
      if (document.getElementById('pv-ov')) return;
      var seg = espero ? SEG_FINAL : SEG, fin = Date.now() + seg * 1000;
      var ov = document.createElement('div');
      ov.className = 'pt-ov'; ov.id = 'pv-ov';
      ov.innerHTML = '<div class="pt-dlg" id="pv-dlg" tabindex="-1" role="alertdialog" aria-modal="true" aria-labelledby="pv-h" aria-describedby="pv-p">'
        + '<div class="pt-ic">' + IC_VERSION + '</div>'
        + '<h2 id="pv-h">Hay una versión nueva del portal</h2>'
        + '<p id="pv-p">Se acaban de subir cambios al portal. Para que trabajes con lo más reciente, esta página se va a actualizar en <b class="pv-seg" id="pv-s">' + seg + '</b> segundos.</p>'
        + '<p class="pv-nota">Te quedas en la misma sección y no se cierra tu sesión.'
        + (espero ? '' : ' Si estás a medio escribir algo, pica «Esperar 3 minutos» y guárdalo.') + '</p>'
        + '<div class="pt-acts">' + (espero ? '' : '<button type="button" class="pt-b" id="pv-esp">Esperar 3 minutos</button>')
        + '<button type="button" class="pt-b pri" id="pv-ya">Actualizar ahora</button></div></div>';
      document.body.appendChild(ov);
      var num = document.getElementById('pv-s');
      clearInterval(tic);
      tic = setInterval(function () { if (cuenta(fin, num) <= 0) { clearInterval(tic); if (enLlamada()) return esperaLlamada(); recarga(nueva, true); } }, 1000);
      document.getElementById('pv-ya').onclick = function () { clearInterval(tic); recarga(nueva, false); };
      var esp = document.getElementById('pv-esp');
      if (esp) esp.onclick = function () { clearInterval(tic); ov.remove(); espera(); };
      // el foco va a la ventana, no a un botón: si alguien venía escribiendo, su siguiente tecla no la actualiza de golpe
      try { document.getElementById('pv-dlg').focus({ preventScroll: true }); } catch (e) { /* nada */ }
    }
    // Esperar 3 minutos: un aviso chico abajo con el tiempo que falta; al terminar, vuelve la ventana (sin otra espera)
    function espera() {
      espero = true;
      var fin = Date.now() + ESPERA;
      // con su ✕, como todos los avisos chicos (P.avisoChico): la ✕ solo lo quita; la cuenta sigue y la ventana regresa
      var av = P.avisoChico({ id: 'version', html: 'El portal se va a actualizar en <b data-mmss="1">3:00</b>.', boton: 'Actualizar ahora', ms: 0,
        accion: function () { clearInterval(tic); recarga(nueva, false); } });
      av.el.id = 'pv-toast';
      var num = av.el.querySelector('b');
      clearInterval(tic);
      tic = setInterval(function () { if (cuenta(fin, num) <= 0) { clearInterval(tic); ventana(); } }, 1000);
    }
    function revisa(alAbrir) {
      if (yendo || nueva || (!alAbrir && document.hidden)) return;
      var ahora = Date.now();
      if (!alAbrir && ahora - ultima < 20000) return;
      ultima = ahora;
      lee().then(function (v) {
        if (!v || yendo || nueva) return;
        if (!propia && !inicial) { inicial = v; return; }   // página sin huella: se compara contra la primera que vio
        if (v === (propia || inicial) || saltos(v) >= 2) return;
        // recién abierta, todavía nada que perder: se cambia sola; si no, se avisa
        if (alAbrir) return recarga(v, P.recargaSola());
        nueva = v; ventana();
      });
    }
    revisa(true);
    setInterval(function () { revisa(false); }, CADA_V);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) revisa(false); });
    window.addEventListener('focus', function () { revisa(false); });
  }

  P.salir = async function () {
    try { await P.registrar('salida', P.pagina()); } catch (e) {}
    try { await sb.auth.signOut(); } catch (e) { /* sin red: igual se va */ }
    location.replace('./');
  };

  /* ---- Jalar para actualizar (31-oct-2026, pedido de Daniel: «Si agrégalo a todos»; «que se pueda hacer en cualquier
     parte del crm»). En la app del celular o del iPad (el portal agregado a la pantalla de inicio con «Compartir ›
     Agregar a pantalla de inicio», o instalado en Android) no hay barra del navegador ni el gesto de jalar hacia abajo
     para volver a cargar. Aquí se da ese gesto en todo el portal: en cualquier vista, sección, pestaña en su marco
     (también las de adentro, como QUO), en el Inicio, el Chat y en las páginas abiertas solas. Con la pantalla hasta
     arriba se jala hacia abajo, sale el círculo debajo del encabezado (se pone naranja al llegar a la marca) y, al
     soltar, se vuelve a cargar todo el portal en la misma sección y con la misma sesión, igual que Ctrl+R o Cmd+R.
     No reinstala nada: el ícono de la pantalla de inicio sigue igual. En el navegador (Safari, Chrome) no hace nada,
     porque ahí el gesto ya lo trae el navegador, y en la computadora tampoco (no hay dedo).
     Para que no se dispare sin querer: solo cuenta si el dedo empezó con todo hasta arriba (la página, su marco y
     cualquier recuadro que se desliza bajo el dedo; si se viene deslizando rápido hacia arriba y llega al tope, no
     cuenta), si va hacia abajo y no de lado, y si se suelta pasando la marca (regresar el dedo lo cancela). Nunca
     empieza en un campo de texto, dentro de una ventana, menú abierto, recorrido o aviso flotante (lo que está fijo en
     la pantalla), en algo que se arrastra con el dedo (touch-action: none) ni a media llamada del chat. Escucha sin
     detener el deslizamiento (passive): no hace más lento nada ni le pregunta nada a la base. Si algún día un recuadro
     no debe usarlo, lleva data-sin-jalar. Prueba: herramientas/pruebas/pantallas/prueba_jalar.py (en profase-datos). ---- */
  /* ¿Es la app de la pantalla de inicio (iPhone, iPad o Android instalada) y no el navegador? Se le pregunta a la página
     de arriba, porque una pestaña en su marco no lo sabe sola. Una sola versión: la usan «Jalar para actualizar» y
     «Bajar en la app del iPhone o iPad» (abajo). */
  P.enApp = function () {
    var w = window;
    try { if (window.top && window.top.document) w = window.top; } catch (e) { w = window; }
    try {
      return w.navigator.standalone === true || w.matchMedia('(display-mode: standalone)').matches
        || w.matchMedia('(display-mode: fullscreen)').matches;
    } catch (e) { return false; }
  };

  (function jalarParaActualizar() {
    if (window.__profaseJalar) return;
    window.__profaseJalar = true;
    var MARCA = 64, MAX = 110, RESISTENCIA = 0.5;
    function deArriba() { try { return window.top && window.top.document ? window.top : window; } catch (e) { return window; } }
    function enApp() { return P.enApp(); }
    function enLlamada() { try { var t = deArriba().PORTAL; return !!(t && (t.ocupado ? t.ocupado(true) : t.enLlamada && t.enLlamada())); } catch (e) { return false; } }
    function hastaArriba(w) {
      try { var se = w.document.scrollingElement || w.document.documentElement; return (se ? se.scrollTop : 0) <= 0 && (w.scrollY || 0) <= 0; } catch (e) { return true; }
    }
    // ¿Algo entre el dedo y la página impide jalar? (campo, algo fijo, algo que se arrastra o un recuadro ya deslizado)
    function atorado(el) {
      for (var n = el && el.nodeType === 1 ? el : el && el.parentElement; n && n.nodeType === 1; n = n.parentElement) {
        var doc = n.ownerDocument;
        if (n === doc.documentElement) break;
        if (n.matches('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [data-sin-jalar]')) return true;
        var cs = doc.defaultView.getComputedStyle(n);
        if (cs.position === 'fixed' || cs.touchAction === 'none') return true;
        if (n.scrollTop > 0 && /(auto|scroll|overlay)/.test(cs.overflowY)) return true;
      }
      return false;
    }
    function sePuede(el) {
      if (!enApp() || enLlamada() || atorado(el)) return false;
      // esta página y las de afuera (si es una pestaña en su marco), todas hasta arriba y sin nada fijo encima del marco
      for (var w = window, n = 0; n < 5; n++) {
        if (!hastaArriba(w)) return false;
        var p = null, fr = null;
        try { p = w.parent; fr = w.frameElement; } catch (e) { p = null; }
        if (!p || p === w) break;
        if (fr && atorado(fr)) return false;
        w = p;
      }
      return true;
    }
    function circulo() {
      var d = deArriba().document, c = d.getElementById('pt-jalar');
      if (c) return c;
      if (!d.getElementById('pt-jalar-css')) {
        var st = d.createElement('style'); st.id = 'pt-jalar-css';
        st.textContent = '#pt-jalar{position:fixed;left:50%;top:env(safe-area-inset-top,0px);z-index:48;width:40px;height:40px;margin-left:-20px;'
          + 'box-sizing:border-box;border-radius:50%;background:var(--surface,#fff);border:1px solid var(--line,#D5DCE8);'
          + 'box-shadow:0 4px 14px rgba(19,32,54,.18);display:flex;align-items:center;justify-content:center;color:#1F3864;'
          + 'pointer-events:none;opacity:0;transform:translateY(-44px);transition:opacity .15s}'
          + '#pt-jalar svg{width:22px;height:22px}'
          + '#pt-jalar.pt-listo{color:#F07A1E;border-color:#F07A1E}'
          + '#pt-jalar.pt-va svg{animation:pt-jalar-gira .8s linear infinite}'
          + '@keyframes pt-jalar-gira{to{transform:rotate(360deg)}}'
          + ':root[data-theme="dark"] #pt-jalar{background:var(--surface,#16213A);border-color:var(--line,#2A3A5A);color:#C9D6EE}'
          + ':root[data-theme="dark"] #pt-jalar.pt-listo{color:#F07A1E;border-color:#F07A1E}';
        (d.head || d.documentElement).appendChild(st);
      }
      c = d.createElement('div'); c.id = 'pt-jalar'; c.setAttribute('aria-hidden', 'true');
      c.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>';
      (d.body || d.documentElement).appendChild(c);
      return c;
    }
    // el círculo sale de debajo del encabezado de la página de arriba (o de la orilla, si la página no trae encabezado)
    function bajoEncabezado() {
      try {
        var d = deArriba().document, h = d.querySelector('header.band') || d.querySelector('header');
        if (h && h.getClientRects().length) { var r = h.getBoundingClientRect(); if (r.bottom > 0) return Math.round(r.bottom) + 'px'; }
      } catch (e) { /* sigue */ }
      return '';
    }
    function pinta(dist) {
      var c = circulo(), s = c.firstChild;
      if (!c.getAttribute('data-y')) { c.setAttribute('data-y', '1'); c.style.top = bajoEncabezado(); }
      c.classList.toggle('pt-listo', dist >= MARCA);
      c.style.opacity = String(Math.min(1, dist / 36));
      c.style.transform = 'translateY(' + Math.round(dist - 32) + 'px)';
      if (s) s.style.transform = 'rotate(' + Math.round(Math.min(dist, MARCA) / MARCA * 270) + 'deg)';
    }
    function quita() {
      var c; try { c = deArriba().document.getElementById('pt-jalar'); } catch (e) { c = null; }
      if (!c) return;
      c.classList.remove('pt-listo'); c.removeAttribute('data-y');
      c.style.opacity = '0'; c.style.transform = 'translateY(-44px)';
    }
    function actualiza() {
      var c = circulo(), s = c.firstChild;
      if (s) s.style.transform = '';
      c.classList.add('pt-listo', 'pt-va');
      c.style.opacity = '1'; c.style.transform = 'translateY(' + (MARCA - 32) + 'px)';
      setTimeout(function () { try { deArriba().location.reload(); } catch (e) { location.reload(); } }, 150);
    }
    var ini = null, va = false, dist = 0;
    function cancela() { if (ini) quita(); ini = null; va = false; dist = 0; }
    document.addEventListener('touchstart', function (e) {
      ini = null; va = false; dist = 0;
      if (e.touches.length !== 1 || !sePuede(e.target)) return;
      ini = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true, capture: true });
    document.addEventListener('touchmove', function (e) {
      if (!ini) return;
      if (e.touches.length !== 1) return cancela();
      var dx = e.touches[0].clientX - ini.x, dy = e.touches[0].clientY - ini.y;
      if (!va) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (dy <= 0 || Math.abs(dx) * 1.2 > dy) return cancela();   // hacia arriba o de lado: no es jalar
        va = true;
      }
      if (!hastaArriba(window)) return cancela();
      dist = Math.min(MAX, Math.max(0, dy) * RESISTENCIA);
      pinta(dist);
    }, { passive: true, capture: true });
    document.addEventListener('touchend', function () {
      if (!ini) return;
      var listo = va && dist >= MARCA && !enLlamada();
      ini = null; va = false; dist = 0;
      if (listo) actualiza(); else quita();
    }, { passive: true, capture: true });
    document.addEventListener('touchcancel', cancela, { passive: true, capture: true });
  })();

  /* ---- Bajar archivos en la app del iPhone o iPad (Héctor Daniel, 4-nov-2026, 11:03, desde su iPad, en la app de la
     pantalla de inicio: «Le puse bajar en el chat crm para poder copiar y pegar algo; y ya no me deja regresar al chat
     ni nada; lo cierro y vuelve abrir ahí»). En la app de la pantalla de inicio del iPhone y del iPad, un «Bajar» del
     portal (un enlace con download a un blob: o data:) no baja nada: la app entera se va al archivo (pantalla gris con
     su nombre, «Abrir en Vista Previa» y «Más…»), sin forma de regresar, y al cerrarla vuelve a abrir ahí; la única
     salida era borrar la app de la pantalla de inicio y volverla a agregar desde Safari.
     Se arregla aquí, una sola vez para todo el portal, lo de hoy y lo nuevo (el chat, el visor de documentos, el
     expediente y su ZIP, los Excel y PDF con la marca, las facturas, las cotizaciones y cualquier descarga que venga):
     en esa app, en lugar de irse al archivo, sale la hoja de Compartir del iPhone o iPad con el archivo (Guardar en
     Archivos, Guardar imagen, Copiar, AirDrop, Mail, WhatsApp…) y el portal se queda donde estaba. Si el sistema no
     la deja salir sola (el archivo tardó en llegar y ya no cuenta como el toque de la persona), sale una ventanita con
     el nombre del archivo y «Guardar o compartir»; si es foto, ahí mismo se ve y, dejando el dedo encima, se copia o se
     guarda en Fotos. En el navegador (Safari o Chrome, que sí bajan el archivo), en Android y en la computadora no
     cambia nada.
     Cubre las tres formas de bajar que hay en el portal y en sus librerías: a.click() de un enlace (visor, marca,
     cotizador, «downloads»), el click de un enlace suelto que nunca entra a la página (dispatchEvent, como doc.save()
     de jsPDF) y el toque de la persona en un enlace con download. Lo que se anota en Accesos lo sigue haciendo quien
     baja. Para las pruebas, window.__profaseBajarApp (true o false) lo prende o lo apaga sin ser iPhone ni iPad.
     Prueba: herramientas/pruebas/pantallas/prueba_bajar_app.py (profase-datos); construir.py (exige_bajar_app()) no
     publica si se quita. Nunca hagas otra versión en una página: una descarga nueva solo usa un enlace con download. ---- */
  (function bajarEnApp() {
    if (window.__profaseBajarAppListo) return;
    window.__profaseBajarAppListo = true;
    var A = window.HTMLAnchorElement && window.HTMLAnchorElement.prototype;
    if (!A) return;
    var TIPOS = {
      png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', heic: 'image/heic', heif: 'image/heif',
      svg: 'image/svg+xml', pdf: 'application/pdf', xml: 'application/xml', zip: 'application/zip', csv: 'text/csv', txt: 'text/plain',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', xlsm: 'application/vnd.ms-excel.sheet.macroEnabled.12',
      xls: 'application/vnd.ms-excel', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', doc: 'application/msword',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', mp4: 'video/mp4', mov: 'video/quicktime',
      m4a: 'audio/mp4', mp3: 'audio/mpeg', wav: 'audio/wav', webm: 'audio/webm', ogg: 'audio/ogg'
    };
    function deApple() {
      var ua = navigator.userAgent || '';
      return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);   // el iPad se presenta como Mac
    }
    function toca() {
      var f = window.__profaseBajarApp;
      if (f === true || f === false) return f;
      return deApple() && P.enApp();
    }
    function esBajada(a) {
      if (!a || !a.hasAttribute || !a.hasAttribute('download')) return false;
      return /^(blob:|data:|https?:)/i.test(a.getAttribute('href') || '');
    }
    // el tipo de verdad: los «Bajar» del portal arman el archivo como «datos» (application/octet-stream) y así el iPad
    // no ofrece «Guardar imagen»; se saca de la terminación del nombre
    function tipoDe(nombre, tipo) {
      var t = String(tipo || '').toLowerCase();
      if (t && t !== 'application/octet-stream' && t !== 'binary/octet-stream') return tipo;
      var m = /\.([a-z0-9]{1,5})$/i.exec(nombre || '');
      return (m && TIPOS[m[1].toLowerCase()]) || 'application/octet-stream';
    }
    function nombreDe(a) {
      var n = a.getAttribute('download');
      if (!n) { try { n = decodeURIComponent(String(a.pathname || '').split('/').pop()); } catch (e) { n = ''; } }
      return String(n || 'archivo').replace(/[\\/:*?"<>|]/g, '_');
    }
    function tam(n) { return n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'; }
    function escH(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function sePuedeCompartir(f) {
      try { return !!(navigator.share && navigator.canShare && navigator.canShare({ files: [f] })); } catch (e) { return false; }
    }

    var ULTIMO = { k: '', t: 0 };
    function maneja(a) {
      var href = a.href || a.getAttribute('href'), nombre = nombreDe(a), k = href + '|' + nombre, ahora = Date.now();
      if (ULTIMO.k === k && ahora - ULTIMO.t < 1500) return;   // el mismo archivo por dos caminos a la vez: una sola hoja
      ULTIMO = { k: k, t: ahora };
      // se lee luego luego: la página suelta el archivo (revokeObjectURL) a los pocos segundos
      fetch(href).then(function (r) {
        if (!r.ok && r.status) throw new Error('HTTP ' + r.status);
        return r.blob();
      }).then(function (b) {
        comparte(new File([b], nombre, { type: tipoDe(nombre, b.type) }));
      }).catch(function (e) {
        try { console.warn('[bajar en la app] ' + nombre, e); } catch (x) { /* sin consola */ }
        // una liga de fuera que no se deja leer: se abre en la hojita de Safari de la app (tiene «OK» para regresar)
        if (/^https?:/i.test(href)) { try { window.open(href, '_blank', 'noopener'); return; } catch (x) { /* sigue */ } }
        P.toast('No se pudo preparar «' + nombre + '». Intenta otra vez.');
      });
    }
    function comparte(f) {
      if (!sePuedeCompartir(f)) { ventana(f); return; }
      navigator.share({ files: [f] }).then(null, function (e) {
        if (e && e.name === 'AbortError') return;   // la persona cerró la hoja
        ventana(f);                                   // ya no contaba como su toque: con uno más sale
      });
    }

    var CSS_BA = '.pba-velo{position:fixed;inset:0;z-index:9500;background:rgba(10,18,32,.55);display:flex;align-items:center;justify-content:center;'
      + 'padding:max(16px,env(safe-area-inset-top,0px)) 16px max(16px,env(safe-area-inset-bottom,0px));box-sizing:border-box}'
      + '.pba-caja{background:var(--surface,#fff);color:var(--ink,#132036);width:min(440px,100%);max-height:100%;overflow:auto;border-radius:14px;'
      + 'box-shadow:0 20px 50px rgba(0,0,0,.35);font-family:var(--f-body,inherit);display:flex;flex-direction:column;-webkit-overflow-scrolling:touch}'
      + '.pba-cab{flex:none;background:#1F3864;color:#fff;border-bottom:4px solid #F07A1E;padding:12px 16px;font-weight:700;font-size:16px;line-height:1.3}'
      + '.pba-cu{padding:14px 16px;display:flex;flex-direction:column;gap:12px}'
      + '.pba-nom{font-size:14px;font-weight:600;line-height:1.35;overflow-wrap:anywhere}'
      + '.pba-tam{font-weight:400;color:var(--muted,#5A6577)}'
      + '.pba-foto{display:block;max-width:100%;max-height:40vh;margin:0 auto;border-radius:8px;border:1px solid var(--line,#DCE2EB);'
      + '-webkit-touch-callout:default;-webkit-user-select:auto;user-select:auto}'
      + '.pba-nota{font-size:13px;line-height:1.45;color:var(--muted,#5A6577);margin:0}'
      + '.pba-bot{flex:none;display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;padding:0 16px 16px}'
      + '.pba-bot button{min-height:44px;border-radius:10px;padding:10px 16px;font:inherit;font-weight:700;font-size:15px;cursor:pointer}'
      + '.pba-si{background:#F07A1E;color:#14233F;border:1px solid #F07A1E;flex:1 1 auto}'
      + '.pba-no{background:transparent;color:var(--ink,#132036);border:1px solid var(--line-strong,#C4CDDA)}'
      + '.pba-bot button:focus-visible{outline:2px solid #F07A1E;outline-offset:2px}'
      + ':root[data-theme="dark"] .pba-caja{background:var(--surface,#16213A);color:var(--ink,#E6ECF7)}'
      + ':root[data-theme="dark"] .pba-no{color:var(--ink,#E6ECF7);border-color:var(--line-strong,#3A4C6E)}'
      + ':root[data-theme="dark"] .pba-nota,:root[data-theme="dark"] .pba-tam{color:var(--muted,#A9B6CC)}';
    function ventana(f) {
      var viejo = document.querySelector('.pba-velo');
      if (viejo && viejo.__cierra) viejo.__cierra();
      if (!document.getElementById('pba-css')) {
        var st = document.createElement('style'); st.id = 'pba-css'; st.textContent = CSS_BA;
        (document.head || document.documentElement).appendChild(st);
      }
      var foto = /^image\/(png|jpeg|gif|webp|heic|heif|svg\+xml)$/i.test(f.type), puede = sePuedeCompartir(f);
      var url = foto ? URL.createObjectURL(f) : '';
      var nota = puede
        ? 'Toca «Guardar o compartir» para guardarlo en Archivos' + (foto ? ' o en Fotos' : '') + ', copiarlo o mandarlo.'
          + (foto ? ' También puedes dejar el dedo sobre la foto para copiarla o guardarla.' : '')
        : (foto ? 'Deja el dedo sobre la foto para copiarla o guardarla en Fotos.'
          : 'Este equipo no deja guardarlo desde la app. Ábrelo en Safari, en crmprofase.com.mx, para bajarlo.');
      var antes = document.activeElement;
      var v = document.createElement('div');
      v.className = 'pba-velo'; v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true'); v.setAttribute('aria-labelledby', 'pba-t');
      v.innerHTML = '<div class="pba-caja">'
        + '<div class="pba-cab" id="pba-t">Tu archivo está listo</div>'
        + '<div class="pba-cu"><div class="pba-nom">' + escH(f.name) + ' <span class="pba-tam">· ' + tam(f.size) + '</span></div>'
        + (foto ? '<img class="pba-foto" alt="' + escH(f.name) + '" src="' + url + '">' : '')
        + '<p class="pba-nota">' + escH(nota) + '</p></div>'
        + '<div class="pba-bot"><button type="button" class="pba-no" data-pba="cerrar">Cerrar</button>'
        + (puede ? '<button type="button" class="pba-si" data-pba="si">Guardar o compartir</button>' : '') + '</div></div>';
      function cierra() {
        window.removeEventListener('keydown', tecla, true);
        if (url) setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        v.remove();
        try { if (antes && antes.focus && document.contains(antes)) antes.focus(); } catch (e) { /* nada */ }
      }
      // en la ventana y en captura: Esc cierra solo esta ventanita, no también lo de abajo (la foto abierta del chat)
      function tecla(e) { if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); cierra(); } }
      v.__cierra = cierra;
      v.addEventListener('click', function (e) {
        var b = e.target.closest ? e.target.closest('[data-pba]') : null;
        if (e.target === v || (b && b.getAttribute('data-pba') === 'cerrar')) { cierra(); return; }
        if (b && b.getAttribute('data-pba') === 'si') {
          navigator.share({ files: [f] }).then(cierra, function (er) {
            if (er && er.name === 'AbortError') return;   // cerró la hoja: la ventanita se queda por si quiere otra vez
            P.toast('No se pudo abrir Compartir. Intenta otra vez.');
          });
        }
      });
      window.addEventListener('keydown', tecla, true);
      (document.body || document.documentElement).appendChild(v);
      var pri = v.querySelector('[data-pba="si"]') || v.querySelector('[data-pba="cerrar"]');
      try { pri.focus({ preventScroll: true }); } catch (e) { pri.focus(); }
    }

    // 1) a.click() de un enlace (en la página o suelto)
    var clicOrig = A.click;
    A.click = function () {
      if (esBajada(this) && toca()) { maneja(this); return; }
      return clicOrig.apply(this, arguments);
    };
    // 2) el click «a mano» de un enlace suelto (jsPDF y FileSaver): nunca llega a la página
    var dispOrig = A.dispatchEvent;
    A.dispatchEvent = function (ev) {
      if (ev && ev.type === 'click' && esBajada(this) && toca()) { maneja(this); return false; }
      return dispOrig.apply(this, arguments);
    };
    // 3) el toque de la persona en un enlace con download
    document.addEventListener('click', function (ev) {
      if (ev.defaultPrevented) return;
      var a = ev.target && ev.target.closest ? ev.target.closest('a[download]') : null;
      if (!a || !esBajada(a) || !toca()) return;
      ev.preventDefault();
      maneja(a);
    }, true);
  })();

  /* ---- Seguro de arranque (30-oct-2026, pedido de Daniel: «y un mensaje o algo de que avísenle a Héctor Daniel Nava
     que se cayó»). Las tres vistas traen escrito en su <head> el seguro (portal/arranque.js de profase-datos; lo pone
     construir.py): si la página no termina de entrar en 20 s, se recarga sola una vez y, si sigue igual, enseña el
     aviso de que no se pudo abrir el portal. Aquí se le dice cuándo ya entró (listo) o cuándo ya se sabe que no se
     pudo (falla), y se vigilan igual las pestañas que van en su marco (en ellas se recarga solo su marco).
     Antes, si la base no contestaba al leer el perfil, se cerraba la sesión y mandaba a la entrada; ahora, si es por
     falta de conexión, no se cierra nada: se reintenta. ---- */
  function seguro() { try { return (window.top || window).PROFASE_ARRANQUE || null; } catch (e) { return null; } }
  var SEG = ROL ? seguro() : null;
  if (SEG) { try { SEG.vigila(window); } catch (e) { SEG = null; } }
  function noCarga(motivo) {
    if (SEG) { try { SEG.falla(motivo, window); } catch (e) {} }
    return new Error('no se pudo abrir (' + motivo + ')');
  }
  // ¿Error por falta de conexión o porque la base no contestó? (no porque la sesión ya no sirva)
  function deRed(err) {
    if (!err) return false;
    var st = +err.status || 0;
    return err.name === 'AuthRetryableFetchError' || st === 0 || st >= 500 || /fetch|network|timeout|timed out|tiempo/i.test(String(err.message || ''));
  }

  // Identificador de un inicio de sesión: el «session_id» de la llave de Supabase (no cambia al renovarse la llave ni al
  // recargar; cambia cada vez que la persona vuelve a entrar con su contraseña). Si no viene, la hora de su última entrada.
  function sesionDe(s) {
    try {
      var b = String(s.access_token || '').split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      b += '===='.slice((b.length % 4) || 4);
      var j = JSON.parse(decodeURIComponent(escape(atob(b))));
      if (j && j.session_id) return 's:' + j.session_id;
    } catch (e) { /* sigue abajo */ }
    return s && s.user && s.user.last_sign_in_at ? 'e:' + s.user.last_sign_in_at : '';
  }

  /* ---- Sesión: las páginas de rol exigen sesión y el rol correcto ---- */
  /* Lo de quien entró, sin vueltas de más (revisión de la noche del 13-nov-2026). Cada pantalla, en su marco, preguntaba
     una tras otra su perfil, si es de solo consulta y si baja el «Original» (tres vueltas a la base, ~0.4 s antes de poder
     pintar nada; «Comprobar real» las veía en casi todas las pantallas). Ahora las tres van al mismo tiempo y, en una
     pantalla dentro de la vista, si es de solo consulta y si baja el «Original» se toman de lo que la vista ya preguntó
     (la misma persona, hasta 10 minutos). El perfil se sigue pidiendo en cada pantalla: es lo que dice si la base contesta
     (el seguro de arranque se fija en eso). Son los mismos datos de la base; lo que cada pantalla cambia después (la vista
     del equipo) se sigue haciendo aquí. */
  var YO_TTL = 600000;
  function yoCasa() { try { if (window.top && window.top !== window && window.top.location.origin === location.origin) return window.top; } catch (e) {} return window; }
  function yoGuardado(uid) {
    try { var c = yoCasa().__profaseYo; if (c && c.uid === uid && Date.now() - c.t < YO_TTL) return c; } catch (e) {}
    return null;
  }
  function yoGuarda(uid, que, v) {
    try {
      var casa = yoCasa(), c = casa.__profaseYo;
      if (!c || c.uid !== uid || Date.now() - c.t >= YO_TTL) c = casa.__profaseYo = { uid: uid, t: Date.now() };
      c[que] = v;
    } catch (e) {}
  }
  function pideYo(f) { try { return Promise.resolve(f()).catch(function (e) { return { error: e }; }); } catch (e) { return Promise.resolve({ error: e }); } }
  P.listo = (async function () {
    if (!ROL) return null;
    var gs;
    try { gs = await sb.auth.getSession(); } catch (e) { throw noCarga('sesión'); }
    var s = gs && gs.data ? gs.data.session : null;
    if (!s && gs && gs.error && deRed(gs.error)) throw noCarga('sesión');
    if (!s) { location.replace('./'); throw new Error('sin sesión'); }
    var yo = yoGuardado(s.user.id);
    var pCons = yo && typeof yo.consulta === 'boolean' ? Promise.resolve({ data: yo.consulta }) : pideYo(function () { return sb.rpc('es_solo_consulta'); });
    var pOrig = yo && typeof yo.orig === 'boolean' ? Promise.resolve({ data: yo.orig }) : pideYo(function () { return sb.rpc('puedo_bajar_original'); });
    var p = null;
    try { p = await P.perfilDe(s.user.id); } catch (e) { throw noCarga('perfil'); }
    if (!p) { await sb.auth.signOut(); location.replace('./?e=perfil'); throw new Error('sin perfil'); }
    // «todos»: páginas que abre cualquier rol (la bitácora de variaciones, dentro de su pestaña)
    // LIBRE: páginas que abre quien tenga permiso en la base (el cotizador), sea del rol que sea
    // Vista del equipo en solo consulta (29-oct-2026, pedido de Fernando Cadengo; portal/sql/31_consulta_equipo.sql):
    // un contador de la tabla consulta_equipo (Gabriel Cavazos) también abre la vista de los gerentes, solo para ver.
    // La base es la que cuida: él sigue siendo contador, así que no escribe lo de los gerentes aunque la página lo intente.
    P.equipo = false;
    if (p.rol === 'contador') {
      try { var eq = await sb.rpc('es_consulta_equipo'); P.equipo = !eq.error && eq.data === true; } catch (e) { P.equipo = false; }
    }
    if (LIBRE[ROL]) {
      var ok = await sb.rpc(LIBRE[ROL]);
      if (ok.error || ok.data !== true) { location.replace(P.paginaDe(p.rol)); throw new Error('sin permiso'); }
    } else if (ROL !== 'todos' && p.rol !== ROL && (TAMBIEN[ROL] || []).indexOf(p.rol) < 0 && !(ROL === 'gerente' && P.equipo)) { location.replace(P.paginaDe(p.rol)); throw new Error('otra página'); }
    P.perfil = p; P.uid = s.user.id;
    P.creado = Date.parse(s.user.created_at || '') || 0;   // cuándo creó su acceso (ventana «Pon tu foto de perfil»)
    P.sesionId = sesionDe(s);                                // este inicio de sesión (el mismo al recargar o cambiar de vista)
    // ¿Solo consulta? (tabla solo_consulta de la base). Si la base no contesta, la base igual lo detiene al guardar.
    try {
      var c = await pCons; P.consulta = !c.error && c.data === true;
      if (!c.error && typeof c.data === 'boolean') yoGuarda(s.user.id, 'consulta', c.data);
    } catch (e) { P.consulta = false; }
    // ¿Se le ofrece bajar el «Original» (sin la marca PROFASE)? Decisión de Daniel, 30-oct-2026: hoy solo el equipo
    // VAX (tabla marca_original, portal/sql/62_marca_original.sql). Lo usan js/marca.js y js/visor.js al bajar.
    try {
      var mo = await pOrig; P.originales = !mo.error && mo.data === true;
      if (!mo.error && typeof mo.data === 'boolean') yoGuarda(s.user.id, 'orig', mo.data);
    } catch (e) { P.originales = false; }
    // Vista del equipo como gerente (29-oct-2026, pedido de Fernando; portal/sql/42_equipo_gerente.sql): quien está en
    // equipo_gerente ve la página de los gerentes y sus pestañas como gerente, con los mismos botones; lo que puede
    // guardar lo dice la base (sigue siendo contador; ahí tiene permisos de gerente en lo que pidió Fernando, nunca
    // comisiones, contraseñas del SAT de otros clientes, lo reservado de EQUILIBRIO ni autorizar propuestas).
    P.vistaEquipo = P.equipo && (ROL === 'gerente' || enVistaEquipo());
    P.equipoGerente = false;
    if (P.equipo) {
      try { var eg = await sb.rpc('es_equipo_gerente'); P.equipoGerente = !eg.error && eg.data === true; } catch (e) { P.equipoGerente = false; }
    }
    if (!P.consulta && P.equipoGerente) {
      if (P.vistaEquipo) { p = Object.assign({}, p, { rol: 'gerente', rolReal: 'contador' }); P.perfil = p; }
    // En la vista del equipo (la página de los gerentes y sus pestañas) y en el cotizador, quien la tiene en consulta
    // solo ve; en su propia vista de contador todo sigue igual.
    } else if (!P.consulta && P.equipo && (ROL === 'gerente' || ROL === 'cotizador' || enVistaEquipo())) {
      // Excepción por un tiempo (29-oct-2026, pedido de Fernando; portal/sql/39_caja_captura.sql): quien está en
      // caja_captura sí registra gastos en la pestaña de la caja chica; lo que puede guardar lo dice la base.
      var cajaCaptura = false;
      if (/\/cajachica\.html$/.test(location.pathname)) {
        try { var cc = await sb.rpc('es_caja_captura'); cajaCaptura = !cc.error && cc.data === true; } catch (e) { cajaCaptura = false; }
      }
      if (!cajaCaptura) { P.consulta = true; MSG_CONSULTA = MSG_EQUIPO; P.MSG_CONSULTA = MSG_EQUIPO; }
    }
    if (P.consulta) document.documentElement.classList.add('pu-consulta');
    if (SEG) { try { SEG.listo(window); } catch (e) {} }
    return p;
  })();
  P.listo.catch(function () {});
  // ¿Esta pestaña está dentro de la vista de los gerentes? (las pestañas van en un marco de la misma página)
  function enVistaEquipo() {
    try { return window.top !== window.self && window.top.document.documentElement.getAttribute('data-rol') === 'gerente'; }
    catch (e) { return false; }
  }
  sb.auth.onAuthStateChange(function (ev) {
    if (!ROL || ev !== 'SIGNED_OUT' || cerrando) return;
    // si la sesión se cerró en otra pestaña por inactividad, la entrada lo dice
    var c = 0; try { c = +localStorage.getItem(CLAVE_CIERRE) || 0; } catch (e) {}
    aLaEntrada(Date.now() - c < 120000 ? '?e=inactivo' : '');
  });

  /* ---- Sesión cerrada desde Accesos (29-oct-2026, portal/sql/28_sesiones.sql): si Daniel sacó a alguien de todos sus
     equipos, su sesión ya no existe en la base. Solo la página de arriba (no las pestañas en su marco) pregunta cada
     30 s mientras está a la vista, y al volver a ella; si la base contesta que no, se va a la entrada con el aviso.
     Si la base no contesta o todavía no tiene la función, no hace nada. Preguntar no cuenta como actividad. ---- */
  function vigilaSesion() {
    if (window.parent !== window || P._vigilaSesion) return;
    P._vigilaSesion = true;
    var preguntando = false;
    async function revisa() {
      if (preguntando || cerrando || document.hidden) return;
      preguntando = true;
      try {
        var r = await sb.rpc('mi_sesion_viva');
        if (!r.error && r.data === false && !cerrando) {
          cerrando = true;
          try { await sb.auth.signOut({ scope: 'local' }); } catch (e) { /* igual se va */ }
          aLaEntrada('?e=cerrada');
        }
      } catch (e) { /* sin red: se vuelve a preguntar luego */ }
      finally { preguntando = false; }
    }
    setInterval(revisa, 30000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) revisa(); });
  }
  P.listo.then(function (p) { if (p) vigilaSesion(); }).catch(function () {});

  /* ---- Errores con los mismos códigos que espera la página ---- */
  function error(e) {
    if (e && e.code && /^[a-z_]+$/.test(e.code)) return e;
    var pg = (e && e.code) || '', st = e && e.status, m = (e && e.message) || String(e || '');
    var code = 'unknown';
    if (pg === '42501' || st === 403 || /row-level security|permission denied/i.test(m)) code = 'not_granted';
    else if (pg === 'PGRST301' || st === 401 || /jwt/i.test(m)) code = 'unauthenticated';
    else if (st === 413) code = 'quota_exceeded';
    else if (e instanceof TypeError || /fetch|network/i.test(m)) code = 'unavailable';
    var x = new Error(m); x.code = code; return x;
  }

  /* ---- Base de datos (tabla docs: colección / documento → JSON) ---- */
  function partir(path) {
    var i = String(path).indexOf('/');
    if (i < 1) throw error({ code: 'invalid_argument', message: 'ruta inválida: ' + path });
    var col = path.slice(0, i), id = path.slice(i + 1);
    // Cada contador lee su propio paquete del WorkFlow en lugar del del equipo
    if (P.perfil && P.perfil.rol === 'contador' && col === 'datos' && id === 'wf_0') id = 'wfc_' + P.perfil.usuario;
    // La vista del director (su página PROFASE) usa sus propios documentos, con EQUILIBRIO
    if (ROL === 'director') {
      if (col === 'datos' && /^(wf|cxc)_\d+$/.test(id)) return ['director', id];
      if (col === 'estado' && id === 'wf') return ['director', 'estado_wf'];
      if (col === 'estado' && id === 'actualizacion') return ['director', 'estado_cxc'];
      if (col === 'estado') return ['privado', id];
      if (col === 'equipo' && id === 'decisiones') return ['privado', 'decisiones'];
      if (col === 'equipo' && id === 'pausas') return ['virtual', 'pausas'];
    }
    return [col, id];
  }

  /* «equipo/pausas» de la página del director: se arma al momento con lo que el equipo marca en el portal */
  var NOMBRES_P = null;
  async function nombresPortal() {
    if (NOMBRES_P) return NOMBRES_P;
    var r = await sb.from('perfiles').select('id,nombre');
    NOMBRES_P = {};
    (r.data || []).forEach(function (p) { NOMBRES_P[p.id] = p.nombre; });
    return NOMBRES_P;
  }
  function mapa(snap) { var o = {}; snap.docs.forEach(function (d) { if (d.exists) o[d.id] = d.data(); }); return o; }
  function pausasVirtual() {
    return {
      id: 'pausas', path: 'equipo/pausas',
      get: async function () {
        var a = await colRef('pausas').get(), b = await colRef('clientes').get(), c = await colRef('sugerencias').get();
        return foto('pausas', { data: { items: mapa(a), clientes: mapa(b), sugerencias: mapa(c), nombres: await nombresPortal(), sincronizadoAt: new Date().toISOString() } });
      },
      set: async function () { throw error({ code: 'not_granted', message: 'Las pausas se cambian en la vista del equipo' }); },
      update: async function () { throw error({ code: 'not_granted', message: 'Las pausas se cambian en la vista del equipo' }); },
      onSnapshot: function (cb, err) {
        var ult = {}, fuera = [];
        async function junta() {
          if (!ult.pausas || !ult.clientes || !ult.sugerencias) return;
          var nom = {};
          try { nom = await nombresPortal(); } catch (e) { nom = {}; }
          cb(foto('pausas', { data: { items: ult.pausas, clientes: ult.clientes, sugerencias: ult.sugerencias, nombres: nom, sincronizadoAt: new Date().toISOString() } }));
        }
        ['pausas', 'clientes', 'sugerencias'].forEach(function (c) {
          fuera.push(colRef(c).onSnapshot(function (snap) { ult[c] = mapa(snap); junta(); }, err));
        });
        return function () { fuera.forEach(function (f) { f(); }); };
      }
    };
  }
  function foto(id, fila) { return { id: id, exists: !!fila, data: function () { return fila ? fila.data : undefined; } }; }
  function mezcla(base, cambios) {
    var out = {}, k;
    for (k in base) if (Object.prototype.hasOwnProperty.call(base, k)) out[k] = base[k];
    for (k in cambios) if (Object.prototype.hasOwnProperty.call(cambios, k)) {
      var v = cambios[k];
      if (v && typeof v === 'object' && v.__delete__ === true) delete out[k]; else out[k] = v;
    }
    return out;
  }
  async function leer(col, id) {
    var r = await sb.from('docs').select('data,version').eq('col', col).eq('id', id).maybeSingle();
    if (r.error) throw error(r.error);
    return r.data;
  }
  async function guardar(col, id, data) {
    if (P.consulta) throw errConsulta();
    var r = await sb.from('docs').upsert({ col: col, id: id, data: data }, { onConflict: 'col,id' });
    if (r.error) throw error(r.error);
    pronto();
  }

  /* Una colección completa, de 1,000 en 1,000 (5-nov-2026, pedido de Gabriel Cavazos): la base entrega máximo 1,000
     renglones por pedido y antes se pedía de una sola vez. En Variaciones (var_est, var_com) ya pasan de 1,000: lo que
     quedaba después del renglón 1,000 (por id) se guardaba bien, pero al ponerse al día la página dejaba de verlo y
     regresaba a «Sin revisión». Mismo orden por id que docs_firmas() (85_docs_firmas.sql), para que la firma coincida. */
  var TANDA_COL = 1000;
  async function todaLaCol(col, campos) {
    var todas = [];
    for (var de = 0; ; de += TANDA_COL) {
      var t = await sb.from('docs').select(campos).eq('col', col).order('id').range(de, de + TANDA_COL - 1);
      if (t.error) throw error(t.error);
      var filas = t.data || [];
      todas = todas.concat(filas);
      if (filas.length < TANDA_COL) return todas;
    }
  }

  /* Cada colección se baja una sola vez y luego solo lo que cambió (6-nov-2026, Fernando Cadengo a Héctor Daniel Nava,
     16:50: «la parte de reportes… ya se está haciendo lento»). Antes, al abrir Variaciones se bajaban dos veces completos
     los comentarios y los estatus (la página los pedía y luego la vigilancia los volvía a pedir: ~5.7 MB), y cada vez que
     alguien guardaba un comentario, a todos los que la tenían abierta se les volvía a bajar la colección entera (1.8 MB).
     Ahora la página guarda en su memoria una copia de lo que la base ya le dio (en texto, tal cual llegó: cada entrega se
     lee de nuevo, así que cada pantalla recibe sus propios objetos, como antes); para ponerse al día pide la lista de
     versiones (id, versión y hora, unos KB) y baja solo los documentos nuevos o cambiados; lo que ya no viene en la lista
     (lo borraron o ya no le toca ver) se quita. Las reglas de la base siguen decidiendo qué ve cada quien: la copia es
     solo de lo que la base ya le entregó y vive mientras la página está abierta. Dos pedidos a la vez de la misma
     colección comparten la misma bajada. */
  var ESPEJO = {}, LOTE_IDS = 80, CAMPOS_TXT = 'id,version,updated_at,txt:data::text', CAMPOS_OBJ = 'id,version,updated_at,data';
  var CON_TEXTO = true;   // si la base no aceptara «::text», se pide el JSON y se guarda como texto aquí (mismo resultado)
  function aTexto(filas) {
    (filas || []).forEach(function (x) { if (x.txt === undefined) { x.txt = x.data === undefined ? null : JSON.stringify(x.data); delete x.data; } });
    return filas || [];
  }
  async function conCampos(pide) {
    if (CON_TEXTO) {
      try { return aTexto(await pide(CAMPOS_TXT)); }
      catch (e) { if (e && e.code === 'unavailable') throw e; CON_TEXTO = false; }
    }
    return aTexto(await pide(CAMPOS_OBJ));
  }
  function mismaFila(a, b) { return !!a && !!b && a.version === b.version && a.updated_at === b.updated_at; }
  async function porIds(col, ids) {
    var out = [], lotes = [];
    for (var i = 0; i < ids.length; i += LOTE_IDS) lotes.push(ids.slice(i, i + LOTE_IDS));
    for (var j = 0; j < lotes.length; j += 4) {   // hasta 4 pedidos a la vez
      var rs = await Promise.all(lotes.slice(j, j + 4).map(function (l) {
        return conCampos(async function (c) { var r = await sb.from('docs').select(c).eq('col', col).in('id', l); if (r.error) throw error(r.error); return r.data; });
      }));
      rs.forEach(function (r) { out = out.concat(r); });
    }
    return out;
  }
  function colAlDia(col) {
    var e = ESPEJO[col] || (ESPEJO[col] = { filas: null, vuelo: null });
    if (e.vuelo) return e.vuelo;
    e.vuelo = (async function () {
      if (!e.filas) {
        var todo = await conCampos(function (c) { return todaLaCol(col, c); });
        e.filas = {};
        todo.forEach(function (x) { e.filas[x.id] = x; });
        return todo;
      }
      var lista = await todaLaCol(col, 'id,version,updated_at');
      var faltan = lista.filter(function (x) { return !mismaFila(e.filas[x.id], x); }).map(function (x) { return x.id; });
      if (faltan.length > 200 && faltan.length > lista.length / 2) {
        e.filas = null;   // cambió casi todo (una carga nueva): de una vez completa
        e.vuelo = null;
        return colAlDia(col);
      }
      var nuevas = faltan.length ? await porIds(col, faltan) : [];
      var filas = {};
      lista.forEach(function (x) { if (e.filas[x.id] && mismaFila(e.filas[x.id], x)) filas[x.id] = e.filas[x.id]; });
      nuevas.forEach(function (x) { filas[x.id] = x; });
      e.filas = filas;
      return lista.map(function (x) { return filas[x.id]; }).filter(Boolean);
    })();
    e.vuelo.then(function () { e.vuelo = null; }, function () { e.vuelo = null; e.filas = null; });
    return e.vuelo;
  }
  function fotoTxt(fila) {
    var leido = false, obj;
    return { id: fila.id, exists: true, data: function () {
      if (!leido) { obj = fila.txt == null ? null : JSON.parse(fila.txt); leido = true; }
      return obj;
    } };
  }
  function fotosCol(filas) {
    var docs = filas.map(fotoTxt);
    return { docs: docs, size: docs.length, empty: !docs.length };
  }

  /* Vigilancia: la página pide «avísame si cambia»; se revisa la versión y solo se baja lo que cambió */
  var VIG = new Set(), revisando = false, reloj = null;
  async function revisa(w) {
    try {
      if (w.doc) {
        var r = await sb.from('docs').select('version,updated_at').eq('col', w.col).eq('id', w.id).maybeSingle();
        if (r.error) throw r.error;
        var f = r.data ? r.data.version + '|' + r.data.updated_at : '-';
        if (f === w.firma) return;
        var fila = r.data ? await leer(w.col, w.id) : null;
        w.firma = f; w.cb(foto(w.id, fila));
      } else {
        var filas = await colAlDia(w.col);   // solo baja lo que cambió (ver «Cada colección se baja una sola vez»)
        var f2 = filas.map(function (x) { return x.id + ':' + x.version; }).join(',');
        if (f2 === w.firma) return;
        w.firma = f2; w.cb(fotosCol(filas));
      }
    } catch (e) { if (w.err) { try { w.err(error(e)); } catch (_) {} } }
  }
  /* Una sola pregunta por vuelta (31-oct-2026, revisión de eficiencia): docs_firmas() de la base (85_docs_firmas.sql,
     SECURITY INVOKER: las reglas de siempre deciden qué ve cada quien) da de una vez la firma de cada documento y de
     cada colección que se vigila, con el mismo formato que armaba aquí cada revisa(); solo lo que cambió se vuelve a
     revisar y a bajar. Antes era una petición por cada cosa vigilada (la vista de dirección, 9 cada 20 s). Si la
     función no está o falla, se regresa a preguntar una por una, como antes. */
  var FIRMAS = true;
  async function vuelta() {
    if (revisando) return;
    revisando = true;
    try {
      var ws = Array.from(VIG);
      if (FIRMAS && ws.length > 1) {
        var docs = [], cols = [];
        ws.forEach(function (w) { if (w.doc) docs.push({ col: w.col, id: w.id }); else if (cols.indexOf(w.col) < 0) cols.push(w.col); });
        var r = null;
        try { r = await sb.rpc('docs_firmas', { p_docs: docs, p_cols: cols }); } catch (e) { r = null; }   // sin red: esta vuelta, una por una
        if (r && !r.error && r.data && r.data.docs && r.data.cols) {
          var D = r.data.docs, C = r.data.cols;
          await Promise.all(ws.map(function (w) {
            var f = w.doc ? (D[w.col + '/' + w.id] || '-') : (C[w.col] || '');
            return f === w.firma ? null : revisa(w);
          }));
          return;
        }
        if (r && r.error && !(r.status >= 500)) FIRMAS = false;   // la base no tiene la función: una por una desde ahora
      }
      await Promise.all(ws.map(revisa));
    } finally { revisando = false; }
  }
  function pronto() { setTimeout(vuelta, 300); }
  /* Una pestaña en su marco que no se está viendo no pregunta (31-oct-2026, revisión de eficiencia): cada pestaña se
     abre en su marco una sola vez y luego solo se esconde al cambiar de sección, y dentro de un marco document.hidden
     sigue a la pestaña del navegador, no a si el marco se ve. Al volver a enseñarse (el marco cambia de tamaño), se
     pone al día en ese momento. La página de arriba sigue igual que siempre. */
  var dormida = false;
  function aLaVista() {
    if (document.hidden) return false;
    try { var fe = window.frameElement; if (fe && !fe.getClientRects().length) return false; } catch (e) { /* otro origen: pregunta */ }
    return true;
  }
  // La misma regla para los relojes propios de cada pantalla (revisión de la noche del 10-nov-2026: Accesos, Cambios al
  // portal, la Cartera y el Cotizador seguían preguntando con su marco escondido): una sola versión.
  P.aLaVista = aLaVista;
  function despierta() { if (dormida && aLaVista()) { dormida = false; vuelta(); } }
  function arranca() {
    if (reloj) return;
    reloj = setInterval(function () { if (aLaVista()) { dormida = false; vuelta(); } else dormida = true; }, CADA);
    document.addEventListener('visibilitychange', function () { if (aLaVista()) vuelta(); });
    window.addEventListener('focus', function () { if (aLaVista()) vuelta(); });
    window.addEventListener('resize', despierta);
  }
  function vigila(w) {
    VIG.add(w); arranca(); revisa(w);
    return function () { VIG.delete(w); };
  }

  function docRef(path) {
    var c = partir(path), col = c[0], id = c[1];
    if (col === 'virtual') return pausasVirtual();
    return {
      id: id, path: col + '/' + id,
      get: async function () { return foto(id, await leer(col, id)); },
      set: async function (data) { await guardar(col, id, data); },
      update: async function (cambios) { var f = await leer(col, id); await guardar(col, id, mezcla(f ? f.data : {}, cambios)); },
      delete: async function () { if (P.consulta) throw errConsulta(); var r = await sb.from('docs').delete().eq('col', col).eq('id', id); if (r.error) throw error(r.error); pronto(); },
      onSnapshot: function (cb, err) { return vigila({ doc: true, col: col, id: id, cb: cb, err: err, firma: null }); }
    };
  }
  function colRef(col) {
    return {
      id: col,
      doc: function (id) { return docRef(col + '/' + id); },
      add: async function (data) {
        if (P.consulta) throw errConsulta();
        var id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()).replace(/[^a-z0-9]/gi, '').slice(0, 20);
        var r = await sb.from('docs').insert({ col: col, id: id, data: data });
        if (r.error) throw error(r.error);
        pronto();
        return docRef(col + '/' + id);
      },
      get: async function () { return fotosCol(await colAlDia(col)); },
      onSnapshot: function (cb, err) { return vigila({ doc: false, col: col, cb: cb, err: err, firma: null }); }
    };
  }
  var DB = { doc: docRef, collection: colRef };

  /* ---- Quién ve la página ---- */
  var USER = {
    id: async function () { return P.uid; },
    isOwner: async function () { return !P.consulta && (P.perfil.rol === 'gerente' || P.perfil.rol === 'director'); },
    canEdit: async function () { return !P.consulta && (P.perfil.rol === 'gerente' || P.perfil.rol === 'director'); },
    // Los contadores también escriben (sus justificaciones); qué colección puede tocar cada quien lo decide la base.
    // El usuario de solo consulta lee todo y no escribe nada: las páginas entran en su modo «solo lectura».
    can: async function (que) { return que === 'data.read' || (que === 'data.write' && !P.consulta); },
    profiles: async function (ids) {
      var out = {}, uu = (ids || []).filter(function (x) { return /^[0-9a-f-]{36}$/i.test(x); });
      if (uu.length) {
        var r = await sb.from('perfiles').select('id,nombre').in('id', uu);
        (r.data || []).forEach(function (p) { out[p.id] = { name: p.nombre }; });
      }
      if (P.perfil && P.uid && !out[P.uid] && (ids || []).indexOf(P.uid) >= 0) out[P.uid] = { name: P.perfil.nombre };
      return out;
    }
  };

  /* ---- Descargas: el archivo se baja directo en el navegador ---- */
  var DL = {
    save: async function (o) {
      var blob = o.data instanceof Blob ? o.data : new Blob([o.data]);
      var u = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = u; a.download = o.filename || 'archivo'; document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 4000);
      P.registrar('descarga', P.pagina() + ' · ' + (o.filename || 'archivo'));
    }
  };

  if (ROL && !LIBRE[ROL]) {
    window.claude = {
      use: async function (cap) {
        await P.listo;
        if (cap === 'db') return DB;
        if (cap === 'user') return USER;
        if (cap === 'downloads') return DL;
        throw error({ code: 'not_granted', message: 'No disponible en el portal: ' + cap });
      }
    };
  }

  /* ---- Encabezado: a la derecha, la foto y el nombre de quien entró; al picarlos se despliega Perfil,
     Cambiar contraseña, Actualizar (si aplica), Mi vista / Vista del equipo (director) y Salir.
     Las secciones (Cotizador incluido) están en el menú de la izquierda (js/menu.js). ---- */
  var PUESTO = { director: 'Director', gerente: 'Gerente', contador: 'Contador' };
  function puestoDe(p) { return (p.puesto || PUESTO[p.rolReal || p.rol] || '') + (p.rolReal ? ' · Vista del equipo' : '') + (P.consulta ? ' · Solo consulta' : ''); }
  var CSS = '.pu-par{display:inline-flex;align-items:center;gap:8px;flex:none;margin-left:auto}'
    + '.pu{position:relative;flex:none;display:inline-flex}'
    + '.pu-btn{font:inherit;display:flex;align-items:center;gap:8px;border:1px solid transparent;background:none;border-radius:999px;padding:3px 10px 3px 3px;cursor:pointer;color:var(--ink)}'
    + '.pu-btn:hover,.pu-btn[aria-expanded="true"]{border-color:var(--line-strong);background:var(--navy-soft)}'
    + '.pu-btn:focus-visible{outline:2px solid var(--accent);outline-offset:1px}'
    + '.pu-nom{font-weight:600;font-size:13.5px;white-space:nowrap;color:var(--ink)}'
    + '.pu-car{width:14px;height:14px;color:var(--muted);transition:transform .15s;display:block}'
    + '.pu-btn[aria-expanded="true"] .pu-car{transform:rotate(180deg)}'
    + '.pu-av{border-radius:50%;background:var(--navy);color:#fff;display:grid;place-items:center;font-weight:700;overflow:hidden;flex:none;letter-spacing:.02em;width:34px;height:34px;font-size:13px}'
    + '.pu-av img{width:100%;height:100%;object-fit:cover;display:block}'
    + '.pu-av.m{width:44px;height:44px;font-size:16px}'
    + '.pu-av.l{width:112px;height:112px;font-size:38px;border:3px solid var(--surface);box-shadow:0 0 0 2px var(--accent)}'
    + '.pu-dd{position:absolute;right:0;top:calc(100% + 8px);width:270px;background:var(--surface);color:var(--ink);border:1px solid var(--line-strong);border-radius:12px;box-shadow:0 14px 40px rgba(0,0,0,.18);padding:6px;z-index:85;text-align:left;overflow-y:auto;overscroll-behavior:contain}'
    + '.pu-dd[hidden]{display:none}'
    + '.pu-dh{display:flex;gap:10px;align-items:center;padding:10px 10px 12px;border-bottom:1px solid var(--line);margin-bottom:6px}'
    + '.pu-dh b{display:block;font-size:14px}.pu-dh small{display:block;font-size:12.5px;color:var(--muted)}'
    + '.pu-dd button,.pu-dd a{font:inherit;width:100%;display:flex;align-items:center;gap:10px;border:0;background:none;padding:9px 10px;border-radius:8px;cursor:pointer;text-align:left;font-size:13.5px;color:var(--ink);text-decoration:none;box-sizing:border-box}'
    + '.pu-dd button:hover,.pu-dd a:hover,.pu-dd button:focus-visible,.pu-dd a:focus-visible{background:var(--navy-soft);outline:none}'
    + '.pu-dd button[disabled]{opacity:.6;cursor:default}'
    + '.pu-dd svg{width:17px;height:17px;color:var(--navy);flex:none;display:block}'
    + '.pu-dd hr{border:0;border-top:1px solid var(--line);margin:6px 0}'
    + '.pu-dd .pu-salir,.pu-dd .pu-salir svg{color:var(--red,#B42318)}'
    + ':root[data-theme="dark"] .pu-dd svg{color:var(--brand-blue,#5B9BD8)}'
    + '.pu-tema{flex:none;width:36px;height:36px;border-radius:50%;border:1px solid var(--line-strong);background:var(--surface);color:var(--navy);display:grid;place-items:center;cursor:pointer;padding:0;transition:background .15s}'
    + '.pu-tema:hover{background:var(--navy-soft)}.pu-tema:focus-visible{outline:2px solid var(--accent);outline-offset:1px}'
    + '.pu-tema svg{width:18px;height:18px;display:block}'
    + ':root[data-theme="dark"] .pu-tema{color:var(--accent)}'
    + '.pu-f{display:grid;gap:10px;margin-top:6px}'
    + '.pu-f label{display:grid;gap:4px;font-size:12.5px;font-weight:600;color:var(--muted)}'
    + '.pu-f input{font:inherit;font-size:14px;padding:9px 11px;border-radius:8px;border:1px solid var(--line-strong);background:var(--surface);color:var(--ink)}'
    + '.pu-f input:focus-visible{outline:2px solid var(--accent);outline-offset:1px}'
    + '.pu-perfil{display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;margin-top:8px}'
    + '.pu-perfil .pu-pn{font-weight:700;font-size:18px;margin-top:4px}'
    + '.pu-perfil .pu-pp{color:var(--muted);font-size:13.5px;margin-top:-6px}'
    + '.pu-fila{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}'
    + '.pu-ayuda{font-size:12px;color:var(--muted);margin:0}'
    + '.pu .btn.pu-ac,.ov .btn.pu-ac{background:var(--accent);border-color:var(--accent);color:#14233F}'
    + '.pu-rec{position:relative;width:260px;height:260px;max-width:100%;margin:0 auto;border-radius:12px;overflow:hidden;background:#000;touch-action:none;cursor:grab}'
    + '.pu-rec canvas{display:block;width:100%;height:100%}'
    + '.pu-rec .pu-masc{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at center,transparent 45.5%,rgba(0,0,0,.55) 46%)}'
    + '.pu-rec .pu-masc::after{content:"";position:absolute;left:4%;top:4%;width:92%;height:92%;box-sizing:border-box;border-radius:50%;border:2px solid #fff}'
    + '.pu-zoom{display:flex;align-items:center;gap:10px;margin:14px auto 0;width:260px;max-width:100%;color:var(--muted);font-size:12.5px}'
    + '.pu-zoom input{flex:1;accent-color:var(--accent)}'
    + '.pu-aviso{position:fixed;top:calc(14px + env(safe-area-inset-top,0px));right:14px;z-index:60;max-width:min(380px,calc(100% - 28px));background:var(--surface);color:var(--ink);'
    + 'border:1px solid var(--line-strong);border-left:5px solid var(--accent);border-radius:10px;padding:10px 14px;font-size:13.5px;box-shadow:0 10px 30px rgba(0,0,0,.18)}'
    + '.pu-aviso[hidden]{display:none}'
    + '.pu-cons{flex:none;display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:var(--navy);background:var(--navy-soft);border:1px solid var(--line-strong);border-radius:999px;padding:5px 11px;white-space:nowrap;cursor:default}'
    + '.pu-cons svg{width:15px;height:15px;display:block;flex:none}'
    + ':root[data-theme="dark"] .pu-cons{color:var(--accent)}'
    + '@media (max-width:900px){.pu-nom,.pu-btn .pu-car{display:none}.pu-btn{padding:3px}.pu-cons b{display:none}.pu-cons{padding:8px}'
    + '.pu-dd{position:fixed;right:12px;top:var(--pu-top,64px);width:min(270px,calc(100vw - 24px));max-height:calc(100vh - var(--pu-top,64px) - 12px);max-height:calc(100dvh - var(--pu-top,64px) - 12px);overflow-y:auto}}';
  var IC = {
    perfil: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    clave: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    act: '<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 4v5h-5"/>',
    vista: '<circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="9" r="2.6"/><path d="M3 20c.8-3.4 3.2-5 6-5s5.2 1.6 6 5M15 15.2c2.6-.4 4.9 1 5.7 4.3"/>',
    salir: '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
    ojo: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    car: '<path d="m6 9 6 6 6-6"/>',
    cam: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/>',
    luna: '<path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.6 6.6 0 0 0 10.7 10.7z"/>',
    sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>'
  };
  function ic(k, cls) { return '<svg' + (cls ? ' class="' + cls + '"' : '') + ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[k] + '</svg>'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function iniciales(n) {
    var p = String(n || '').trim().split(/\s+/).filter(Boolean);
    if (!p.length) return '?';
    return ((p[0][0] || '') + (p.length > 1 ? (p[p.length > 2 ? p.length - 2 : p.length - 1][0] || '') : '')).toUpperCase();
  }

  function dialogoClave() {
    var ov = document.createElement('div');
    ov.className = 'ov'; ov.hidden = true;
    ov.innerHTML = '<div class="dlg" role="dialog" aria-modal="true" aria-labelledby="pu-h">'
      + '<h2 id="pu-h">Cambiar contraseña</h2><p class="sub">Mínimo 10 caracteres. Se cambia para todos tus dispositivos.</p>'
      + '<form class="pu-f" id="pu-form"><label>Contraseña nueva<input type="password" id="pu-n1" autocomplete="new-password" minlength="10" required></label>'
      + '<label>Repítela<input type="password" id="pu-n2" autocomplete="new-password" minlength="10" required></label>'
      + '<div class="dmsg" id="pu-msg"></div>'
      + '<div class="dacts"><button class="btn" type="button" id="pu-x">Cancelar</button><button class="btn primary" type="submit" id="pu-ok">Guardar</button></div></form></div>';
    document.body.appendChild(ov);
    var $ = function (id) { return document.getElementById(id); };
    function cerrar() { ov.hidden = true; $('pu-form').reset(); $('pu-msg').textContent = ''; }
    $('pu-x').onclick = cerrar;
    ov.addEventListener('click', function (e) { if (e.target === ov) cerrar(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !ov.hidden) cerrar(); });
    $('pu-form').addEventListener('submit', async function (e) {
      e.preventDefault();
      var a = $('pu-n1').value, b = $('pu-n2').value, m = $('pu-msg');
      if (a.length < 10) { m.className = 'dmsg warn'; m.textContent = 'Usa al menos 10 caracteres.'; return; }
      if (a !== b) { m.className = 'dmsg warn'; m.textContent = 'Las dos contraseñas no coinciden.'; return; }
      var ok = $('pu-ok'); ok.disabled = true; ok.textContent = 'Guardando…';
      var r = await sb.auth.updateUser({ password: a });
      ok.disabled = false; ok.textContent = 'Guardar';
      if (r.error) { m.className = 'dmsg bad'; m.textContent = /different/i.test(r.error.message) ? 'Escribe una contraseña distinta a la actual.' : 'No se pudo cambiar. Vuelve a intentar.'; return; }
      m.className = 'dmsg ok'; m.textContent = 'Listo: tu contraseña quedó cambiada.';
      P.registrar('clave', P.pagina());
      setTimeout(cerrar, 1400);
    });
    return function () { ov.hidden = false; $('pu-n1').focus(); };
  }

  /* ---- Foto de perfil: cubeta privada «fotos» (portal/sql/14_fotos_perfil.sql), un archivo <id>.jpg por usuario.
     Cada quien sube, cambia o quita solo la suya; todos los del portal las ven. ---- */
  var FOTO = { url: null, sinFoto: false };   // sinFoto: la base contestó y de verdad no tiene foto
  function pintaFoto(p) {
    document.querySelectorAll('[data-pu-av]').forEach(function (a) {
      a.innerHTML = FOTO.url ? '<img alt="" src="' + esc(FOTO.url) + '">' : esc(iniciales(p.nombre));
    });
    var q = document.getElementById('pu-quita'); if (q) q.hidden = !FOTO.url;
  }
  async function cargaFoto(p) {
    FOTO.sinFoto = false;
    try {
      var l = await sb.storage.from('fotos').list('', { search: P.uid + '.jpg', limit: 1 });
      if (l.error || !l.data || !l.data.some(function (f) { return f.name === P.uid + '.jpg'; })) {
        FOTO.url = null; FOTO.sinFoto = !l.error && Array.isArray(l.data); pintaFoto(p); return;
      }
      var s = await sb.storage.from('fotos').createSignedUrl(P.uid + '.jpg', 6 * 3600);
      FOTO.url = (!s.error && s.data && s.data.signedUrl) || null;
    } catch (e) { FOTO.url = null; }
    pintaFoto(p);
  }
  /* Fotos de perfil de otros usuarios, para espejearlas en otras pestañas (Calendario › Colaboradores y la ventana de
     cumpleaños; pedido de Daniel, 29-oct-2026). Recibe ids de usuario y regresa { id: liga firmada } solo de quienes
     tienen foto. Las ligas duran 6 horas. Si algo falla, regresa {} y la pestaña sigue con lo que tenía. */
  /* Las fotos de perfil: la lista de la cubeta y sus ligas firmadas se piden una vez y sirven 10 minutos (revisión de
     eficiencia del 31-oct-2026). Antes cada pestaña o ventana que enseñaba fotos volvía a listar la cubeta y a firmar,
     y como cada liga nueva es distinta el navegador volvía a bajar cada foto. Las ligas duran 6 horas; al cambiar o
     quitar la foto propia se vuelve a pedir todo (fotosOlvida). Cualquier usuario del portal ve todas las fotos, igual
     que antes. */
  var FOTOS = { t: 0, todas: null, p: null };
  /* Revisión nocturna del 11-nov-2026: la lista ya firmada se comparte con las demás pantallas de la misma vista (cada
     pantalla vive en su marco con su propio PORTAL y cada una volvía a listar la cubeta y a firmar: dos llamadas de ~0.6 s
     al abrir el Calendario, Eventos o RH › Colaboradores). Se guarda en la vista de arriba (mismo sitio, misma sesión y
     mismo usuario) y vale lo mismo, 10 minutos; se copia al marco (nunca se usa una promesa de otro marco). */
  function fotosCasa() { try { if (window.top && window.top !== window && window.top.location.origin === location.origin) return window.top; } catch (e) {} return window; }
  P.fotosOlvida = function () { FOTOS.t = 0; FOTOS.todas = null; try { fotosCasa().__profaseFotos = null; } catch (e) {} };
  async function todasLasFotos() {
    if (FOTOS.todas && Date.now() - FOTOS.t < 600000) return FOTOS.todas;
    try {
      var c = fotosCasa().__profaseFotos;
      if (c && c.todas && P.uid && c.yo === P.uid && Date.now() - c.t < 600000) { FOTOS.todas = Object.assign({}, c.todas); FOTOS.t = c.t; return FOTOS.todas; }
    } catch (e) {}
    if (!FOTOS.p) FOTOS.p = (async function () {
      var l = await sb.storage.from('fotos').list('', { limit: 1000 });
      if (l.error || !Array.isArray(l.data)) return null;
      var rutas = l.data.map(function (f) { return f && f.name; }).filter(function (n) { return n && /^[0-9a-f-]{36}\.jpg$/i.test(n); });
      var m = {};
      if (rutas.length) {
        var s = await sb.storage.from('fotos').createSignedUrls(rutas, 6 * 3600);
        if (s.error) return null;
        var base = SB_URL + '/storage/v1/object/sign/fotos/';
        (s.data || []).forEach(function (x) {
          if (x && !x.error && typeof x.signedUrl === 'string' && x.signedUrl.indexOf(base) === 0 && x.path) m[String(x.path).replace(/\.jpg$/i, '').toLowerCase()] = x.signedUrl;
        });
      }
      return m;
    })();
    try {
      var m = await FOTOS.p;
      if (m) { FOTOS.todas = m; FOTOS.t = Date.now(); try { fotosCasa().__profaseFotos = { t: FOTOS.t, todas: Object.assign({}, m), yo: P.uid }; } catch (e) {} }
      return m || {};
    } finally { FOTOS.p = null; }
  }
  P.fotosDe = async function (ids) {
    var out = {};
    try {
      var pide = {};
      (ids || []).forEach(function (u) { u = String(u || ''); if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(u)) pide[u.toLowerCase()] = 1; });
      if (!Object.keys(pide).length) return out;
      var m = await todasLasFotos();
      Object.keys(pide).forEach(function (k) { if (m[k]) out[k] = m[k]; });
    } catch (e) { return {}; }
    return out;
  };
  function dialogoPerfil(p) {
    var ov = document.createElement('div');
    ov.className = 'ov'; ov.hidden = true;
    ov.innerHTML = '<div class="dlg" role="dialog" aria-modal="true" aria-labelledby="pf-h">'
      + '<div id="pf-ver"><h2 id="pf-h">Perfil</h2>'
      + '<div class="pu-perfil"><span class="pu-av l" data-pu-av></span>'
      + '<div class="pu-pn">' + esc(p.nombre) + '</div><div class="pu-pp">' + esc(puestoDe(p)) + '</div>'
      + '<div class="pu-fila"><button class="btn pu-ac" type="button" id="pu-cambia">Cambiar foto</button><button class="btn" type="button" id="pu-quita" hidden>Quitar foto</button></div>'
      + '<p class="pu-ayuda">JPG, PNG o foto del celular. Todo el equipo ve tu foto; solo tú la cambias.</p></div>'
      + '<div class="dmsg" id="pf-msg"></div>'
      + '<div class="dacts"><button class="btn" type="button" id="pf-x">Cerrar</button></div></div>'
      + '<div id="pf-rec" hidden><h2>Acomoda tu foto</h2><p class="sub">Arrastra la foto para centrarla y usa la barra para acercar o alejar.</p>'
      + '<div class="pu-rec" id="pf-area"><canvas id="pf-c" width="520" height="520"></canvas><div class="pu-masc"></div></div>'
      + '<label class="pu-zoom">Alejar<input type="range" id="pf-z" min="1" max="4" step="0.01" value="1" aria-label="Acercar o alejar">Acercar</label>'
      + '<div class="dmsg" id="pf-msg2"></div>'
      + '<div class="dacts"><button class="btn" type="button" id="pf-rx">Cancelar</button><button class="btn primary" type="button" id="pf-ok">Guardar foto</button></div></div>'
      + '<input type="file" id="pf-file" accept="image/*" hidden></div>';
    document.body.appendChild(ov);
    var $ = function (id) { return document.getElementById(id); };
    var cv = $('pf-c'), cx = cv.getContext('2d'), Z = $('pf-z'), IMG = null, base = 1, zm = 1, ox = 0, oy = 0;
    function msg(id, t, c) { var m = $(id); m.className = 'dmsg' + (c ? ' ' + c : ''); m.textContent = t || ''; }
    function ver() { $('pf-ver').hidden = false; $('pf-rec').hidden = true; }
    function cerrar() { ov.hidden = true; ver(); msg('pf-msg'); msg('pf-msg2'); }
    $('pf-x').onclick = cerrar;
    $('pf-rx').onclick = function () { ver(); msg('pf-msg2'); };
    ov.addEventListener('click', function (e) { if (e.target === ov) cerrar(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !ov.hidden) cerrar(); });
    $('pu-cambia').onclick = function () { $('pf-file').click(); };
    $('pf-file').onchange = function (e) {
      var f = e.target.files[0]; e.target.value = '';
      if (!f) return;
      var u = URL.createObjectURL(f), im = new Image();
      im.onload = function () {
        IMG = im; base = Math.max(cv.width / im.width, cv.height / im.height); zm = 1; Z.value = 1; ox = 0; oy = 0;
        dibuja(); msg('pf-msg'); $('pf-ver').hidden = true; $('pf-rec').hidden = false;
      };
      im.onerror = function () { URL.revokeObjectURL(u); msg('pf-msg', 'No se pudo leer esa imagen. Prueba con una foto JPG o PNG.', 'warn'); };
      im.src = u;
    };
    function limita() {
      var s = base * zm, mx = Math.max(0, (IMG.width * s - cv.width) / 2), my = Math.max(0, (IMG.height * s - cv.height) / 2);
      ox = Math.min(mx, Math.max(-mx, ox)); oy = Math.min(my, Math.max(-my, oy));
    }
    function dibuja() {
      if (!IMG) return;
      limita();
      var s = base * zm, w = IMG.width * s, h = IMG.height * s;
      cx.fillStyle = '#000'; cx.fillRect(0, 0, cv.width, cv.height);
      cx.drawImage(IMG, (cv.width - w) / 2 + ox, (cv.height - h) / 2 + oy, w, h);
    }
    Z.oninput = function () { zm = +Z.value; dibuja(); };
    (function () {
      var arr = null, area = $('pf-area'), k = function () { return cv.width / area.clientWidth; };
      area.addEventListener('pointerdown', function (e) { arr = { x: e.clientX, y: e.clientY }; try { area.setPointerCapture(e.pointerId); } catch (er) { /* nada */ } area.style.cursor = 'grabbing'; });
      area.addEventListener('pointermove', function (e) { if (!arr) return; ox += (e.clientX - arr.x) * k(); oy += (e.clientY - arr.y) * k(); arr = { x: e.clientX, y: e.clientY }; dibuja(); });
      function fin() { arr = null; area.style.cursor = ''; }
      area.addEventListener('pointerup', fin); area.addEventListener('pointercancel', fin);
      area.addEventListener('wheel', function (e) { e.preventDefault(); zm = Math.min(4, Math.max(1, zm * (e.deltaY < 0 ? 1.06 : 1 / 1.06))); Z.value = zm; dibuja(); }, { passive: false });
    })();
    function falla(id, r) {
      var t = String((r && (r.message || r.error)) || '');
      msg(id, /bucket|not found|no existe/i.test(t) ? 'Las fotos todavía no están activadas en la base. Avísale a Fernando Cadengo.' : 'No se pudo guardar. Vuelve a intentar en un momento.', 'bad');
    }
    // Guarda solo el círculo, en 256 x 256 JPG (unos 20 KB), aunque la foto original pese varios MB
    $('pf-ok').onclick = function () {
      var b = $('pf-ok'), out = document.createElement('canvas');
      out.width = out.height = 256;
      var lado = cv.width * 0.92, ini = (cv.width - lado) / 2;
      out.getContext('2d').drawImage(cv, ini, ini, lado, lado, 0, 0, 256, 256);
      b.disabled = true; b.textContent = 'Guardando…';
      out.toBlob(async function (blob) {
        var r = blob ? await sb.storage.from('fotos').upload(P.uid + '.jpg', blob, { upsert: true, contentType: 'image/jpeg', cacheControl: '3600' }) : { error: { message: 'sin imagen' } };
        P.fotosOlvida();
        b.disabled = false; b.textContent = 'Guardar foto';
        if (r.error) { falla('pf-msg2', r.error); return; }
        await cargaFoto(p);
        ver(); msg('pf-msg', 'Listo: tu foto quedó guardada. Así te ve todo el equipo en el portal.', 'ok');
      }, 'image/jpeg', 0.85);
    };
    $('pu-quita').onclick = async function () {
      var b = $('pu-quita'); b.disabled = true;
      var r = await sb.storage.from('fotos').remove([P.uid + '.jpg']);
      P.fotosOlvida();
      b.disabled = false;
      if (r.error) { falla('pf-msg', r.error); return; }
      FOTO.url = null; pintaFoto(p); msg('pf-msg', 'Listo: se quitó tu foto; se ven tus iniciales.', 'ok');
    };
    var abre = function () { cerrar(); ov.hidden = false; $('pu-cambia').focus(); };
    // desde la ventana «Pon tu foto de perfil»: abre Perfil y, en el mismo clic, el selector de la foto
    abre.elegir = function () { abre(); $('pf-file').click(); };
    abre.abierto = function () { return !ov.hidden; };
    return abre;
  }

  /* ---- «Pon tu foto de perfil» (pedido de Daniel, 30-oct-2026, 17:32: «como ya todos se están metiendo; a los que no
     tengan foto de perfil (primero revisa www.profase.com.mx); pídeles mediante un pop up y guíalos a que carguen una
     foto»; 18:13: «permite 3 clics a más tarde; que les aparezca el botón en 3 inicios de sesión pues; ya en la 4ta
     obligados a foto de perfil»).
     - Primero se cargaron las fotos de www.profase.com.mx (acción «Fotos de perfil», nube/fotos_perfil.py); esta ventana
       sale solo a quien sigue sin foto: la base contestó y no hay «<id>.jpg» en la cubeta «fotos».
     - Sale en cada inicio de sesión (no al recargar ni al cambiar de vista) hasta que tenga foto. En los 3 primeros
       inicios de sesión en que le sale trae «Más tarde» (cerrarla la deja para la siguiente vez que entre); a partir del
       4.º es obligatoria: sin «Más tarde», sin Esc y sin cerrarse al picar fuera, hasta que guarde su foto.
     - Las veces se cuentan en la base, para que valgan en todos sus equipos: recorrido_visto('foto-mas-tarde-N')
       (portal/sql/59_recorridos.sql; sin ella, en su navegador). Qué inicio de sesión ya se contó o ya se dejó para
       después queda en su navegador.
     - Nada más se lee ni se guarda: la foto se sube igual que desde Perfil (la ventana abre Perfil y el selector). En la
       obligatoria, si cierra Perfil sin guardar, la ventana vuelve.
     - No sale en las primeras 2 horas de una cuenta nueva (si su foto está en www.profase.com.mx, la acción se la pone
       sola en esa hora) ni en las pruebas automáticas de los demás. Nunca encima de otra ventana ni de un recorrido
       (Nuevos cambios, bienvenida, chat, cumpleaños…): espera a que no haya ninguna y sale al final. ---- */
  var CSS_FOTO = '.ov.fp-ov{z-index:95}'
    + '.dlg.fp-dlg{width:min(480px,100%);border-top-color:var(--accent)}'
    + '.fp-top{display:flex;justify-content:center;margin:2px 0 10px}'
    + '.fp-ci{position:relative;display:inline-block}'
    + '.fp-ci .pu-av.l{width:96px;height:96px;font-size:32px}'
    + '.fp-cam{position:absolute;right:-2px;bottom:-2px;width:34px;height:34px;border-radius:50%;background:var(--accent);color:#14233F;display:grid;place-items:center;border:3px solid var(--surface)}'
    + '.fp-cam svg{width:17px;height:17px;display:block}'
    + '.dlg.fp-dlg h2{text-align:center}.dlg.fp-dlg .sub{text-align:center;font-size:13.5px;line-height:1.45;margin-bottom:12px}'
    + '.fp-pasos{list-style:none;counter-reset:fp;margin:0 0 10px;padding:0;display:grid;gap:8px}'
    + '.fp-pasos li{counter-increment:fp;display:grid;grid-template-columns:26px 1fr;gap:10px;align-items:start;font-size:13.5px;line-height:1.4;background:var(--navy-soft);border-radius:10px;padding:9px 11px}'
    + '.fp-pasos li::before{content:counter(fp);width:24px;height:24px;border-radius:50%;background:var(--navy);color:#fff;display:grid;place-items:center;font-weight:700;font-size:12.5px}'
    + ':root[data-theme="dark"] .fp-pasos li::before{background:var(--accent)}'
    + '.fp-vez{font-size:12.5px;line-height:1.4;margin:0;padding:8px 11px;border-radius:10px;border:1px solid var(--line-strong);color:var(--muted)}'
    + '.fp-vez b{color:var(--ink)}'
    + '.fp-vez.ob{border-color:var(--accent);color:var(--ink);background:color-mix(in srgb,var(--accent) 10%,transparent)}'
    + '.dlg.fp-dlg .dacts{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;margin-top:12px}'
    + '.dlg.fp-dlg .dacts .btn{font-size:14px;padding:9px 14px}'
    + '.dlg.fp-dlg .dacts .btn.pu-ac{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:600}'
    + '.dlg.fp-dlg .dacts .btn svg{width:17px;height:17px;display:block;flex:none}'
    + '.dlg.fp-dlg .dacts .btn[hidden]{display:none}'
    + '@media (max-width:480px){.dlg.fp-dlg .dacts{flex-direction:column-reverse}.dlg.fp-dlg .dacts .btn{width:100%}}';
  var FP_VECES = 3;                              // inicios de sesión con «Más tarde»; al siguiente, obligatoria
  var FP_RID = 'foto-mas-tarde-';                // en la base: foto-mas-tarde-1, -2 y -3
  var FP_LUEGO = 'profase-foto-luego';           // el inicio de sesión en que picó «Más tarde» (ya no sale en ese)
  var FP_CONTADA = 'profase-foto-contada';       // el inicio de sesión que ya se contó como una de las 3
  var FP_LOCAL = 'profase-foto-veces';           // las veces, en su navegador (por si la base no las guarda)
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* nada */ } }
  function sesionFoto() {
    if (P.sesionId) return P.sesionId;
    // sin identificador de la base: uno por pestaña del navegador
    try { var t = sessionStorage.getItem('profase-foto-tab'); if (!t) { t = 't:' + Date.now() + Math.random(); sessionStorage.setItem('profase-foto-tab', t); } return t; }
    catch (e) { return 't:sin'; }
  }
  function vecesLocal() { try { var a = JSON.parse(lsGet(FP_LOCAL) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  async function vecesFoto() {
    var n = 0;
    try {
      var r = await sb.rpc('recorridos_mios');
      if (!r.error && Array.isArray(r.data)) n = r.data.filter(function (x) { return new RegExp('^' + FP_RID + '\\d+$').test(String(x)); }).length;
    } catch (e) { n = 0; }
    return Math.max(n, vecesLocal().length);
  }
  async function anotaVez(k) {
    var ok = false;
    try { var r = await sb.rpc('recorrido_visto', { p_recorrido: FP_RID + k }); ok = !r.error && r.data === true; } catch (e) { ok = false; }
    if (!ok) { var a = vecesLocal(); a.push(sesionFoto()); lsSet(FP_LOCAL, JSON.stringify(a)); }
  }
  // ¿Esta vez trae «Más tarde» (y cuál de las 3 es) o ya es obligatoria? Cada inicio de sesión cuenta una sola vez.
  async function turnoFoto() {
    var ses = sesionFoto(), n = await vecesFoto();
    if (lsGet(FP_CONTADA) === ses && n >= 1) return { obliga: false, vez: Math.min(n, FP_VECES) };
    if (n >= FP_VECES) return { obliga: true, vez: n };
    await anotaVez(n + 1); lsSet(FP_CONTADA, ses);
    return { obliga: false, vez: n + 1 };
  }
  var FP_ABRE = null;
  function ventanaFoto(p, perfil) {
    if (FP_ABRE) return FP_ABRE;
    var st = document.createElement('style'); st.textContent = CSS_FOTO; document.head.appendChild(st);
    var nom = String(p.nombre || '').trim().split(/\s+/)[0] || '';
    if (nom && nom === nom.toUpperCase()) nom = nom.charAt(0) + nom.slice(1).toLowerCase();   // «ALEX» → «Alex»
    var hola = nom ? 'Hola, ' + esc(nom) + '. ' : '';
    var ov = document.createElement('div');
    ov.className = 'ov fp-ov'; ov.hidden = true;
    ov.innerHTML = '<div class="dlg fp-dlg" role="dialog" aria-modal="true" aria-labelledby="fp-h" aria-describedby="fp-s">'
      + '<div class="fp-top"><span class="fp-ci"><span class="pu-av l" data-pu-av></span><span class="fp-cam">' + ic('cam') + '</span></span></div>'
      + '<h2 id="fp-h">Pon tu foto de perfil</h2>'
      + '<p class="sub" id="fp-s"></p>'
      + '<ol class="fp-pasos">'
      + '<li><span><b>Escoge tu foto.</b> Pícale a «Escoger mi foto» y escoge la que tú quieras. En la computadora, búscala en tus archivos; en el celular, tómala con la cámara o escógela de tu galería.</span></li>'
      + '<li><span><b>Acomódala.</b> Arrástrala para que tu cara quede dentro del círculo y usa la barra para acercar o alejar.</span></li>'
      + '<li><span><b>Guárdala.</b> Pícale a «Guardar foto» y listo: todo el equipo te ve igual en todo el portal.</span></li>'
      + '</ol>'
      + '<p class="fp-vez" id="fp-vez"></p>'
      + '<div class="dacts"><button class="btn" type="button" id="fp-luego">Más tarde</button><button class="btn pu-ac" type="button" id="fp-sube">' + ic('cam') + ' Escoger mi foto</button></div>'
      + '</div>';
    document.body.appendChild(ov);
    var dlg = ov.querySelector('.fp-dlg'), sube = document.getElementById('fp-sube'), luego = document.getElementById('fp-luego');
    var T = { obliga: false, vez: 1 }, vigila = null;
    function pinta() {
      var compu = !(window.matchMedia && matchMedia('(pointer:coarse)').matches);
      document.getElementById('fp-s').innerHTML = T.obliga
        ? hola + 'Ya la dejaste para después ' + FP_VECES + ' veces; para seguir usando el portal, sube tu foto ahora. Te toma un minuto:'
        : hola + 'Ya casi todo el equipo trabaja en el portal y a ti todavía te ven con tus iniciales. Tu foto sale junto a tu nombre en el chat, en el Calendario, en la ventana de cumpleaños y aquí arriba. Te toma un minuto:';
      var v = document.getElementById('fp-vez');
      v.className = 'fp-vez' + (T.obliga ? ' ob' : '');
      v.innerHTML = T.obliga
        ? (compu ? '¿No tienes una foto en esta computadora? Entra al portal desde tu celular y tómatela con la cámara.' : 'Tómatela con la cámara o escógela de tu galería.')
        : T.vez >= FP_VECES
          ? '<b>Última vez</b> que la puedes dejar para después (' + FP_VECES + ' de ' + FP_VECES + '): la próxima vez que entres al portal ya tendrás que subirla para seguir.'
          : 'La puedes dejar para después hasta <b>' + FP_VECES + ' veces</b> (ésta es la ' + T.vez + '.ª); a la ' + (FP_VECES + 1) + '.ª vez que entres al portal ya tendrás que subirla para seguir.';
      luego.hidden = T.obliga;
      dlg.setAttribute('role', T.obliga ? 'alertdialog' : 'dialog');
    }
    function cerrar() { if (T.obliga) return; ov.hidden = true; lsSet(FP_LUEGO, sesionFoto()); }
    luego.onclick = cerrar;
    ov.addEventListener('click', function (e) { if (e.target === ov) cerrar(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !ov.hidden) { e.preventDefault(); cerrar(); } });
    // en el mismo clic: se abren Perfil y el selector de la foto (el navegador lo exige así)
    sube.onclick = function () {
      if (!T.obliga) { cerrar(); perfil.elegir(); return; }
      // obligatoria: se esconde mientras está Perfil; si cierra Perfil sin guardar su foto, vuelve
      ov.hidden = true; perfil.elegir();
      clearInterval(vigila);
      vigila = setInterval(function () {
        if (FOTO.url) { clearInterval(vigila); return; }
        if (!perfil.abierto() && ov.hidden) { clearInterval(vigila); FP_ABRE(T); }
      }, 500);
    };
    FP_ABRE = function (t) { T = t || T; pinta(); pintaFoto(p); ov.hidden = false; sube.focus(); };
    return FP_ABRE;
  }
  var dormir = function (ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); };
  function hayVentana() {
    return [].slice.call(document.querySelectorAll('[aria-modal="true"]')).some(function (d) {
      if ((d.closest && d.closest('.rc-capa')) || !d.getClientRects().length) return false;
      var cs = getComputedStyle(d); return cs.visibility !== 'hidden' && +cs.opacity > 0.05;
    });
  }
  function ocupado() {
    return hayVentana() || document.hidden || !!(window.PROFASE_RECORRIDO && window.PROFASE_RECORRIDO.activo && window.PROFASE_RECORRIDO.activo())
      || !!(window.PORTAL && window.PORTAL.estaEscribiendo && window.PORTAL.estaEscribiendo());
  }
  async function pideFoto(p, perfil, prueba) {
    var falta = function () { return FOTO.sinFoto && !FOTO.url && lsGet(FP_LUEGO) !== sesionFoto(); };
    if (!prueba) {
      if (navigator.webdriver && !window.__PRUEBA_FOTO) return;    // las pruebas automáticas de los demás no la ven
      if (P.creado && Date.now() - P.creado < 2 * 3600e3) return;   // cuenta nueva: quizá su foto del sitio va en camino
      for (var i = 0; i < 40 && !FOTO.sinFoto && !FOTO.url; i++) await dormir(500);
      if (!falta()) return;
      // primero lo demás (Nuevos cambios, recorridos, cumpleaños…): espera a que no haya nada encima, un respiro y otra vez
      await dormir(window.__PRUEBA_FOTO ? 300 : 12000);
      for (var n = 0; n < 3; n++) {
        for (var j = 0; j < 21600 && ocupado(); j++) await dormir(500);
        await dormir(window.__PRUEBA_FOTO ? 200 : 2500);
      }
      if (ocupado() || !falta()) return;
    }
    var t = await turnoFoto();
    if (!prueba && (ocupado() || !falta())) return;
    ventanaFoto(p, perfil)(t);
  }

  function encabezado(p) {
    // Solo en las páginas de cada rol abiertas solas: dentro de un marco (pestañas del portal) no va encabezado propio
    if (!PAGINA[ROL] || window.top !== window.self) return;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var lugar = document.querySelector('header .equipo');
    var pu = document.createElement('div');
    pu.className = 'pu';
    // El director brinca entre su vista (con EQUILIBRIO) y la del equipo
    var otra = p.rol !== 'director' ? '' : ROL === 'director'
      ? '<a role="menuitem" href="gerentes.html">' + ic('vista') + 'Vista del equipo</a>' : '<a role="menuitem" href="director.html">' + ic('vista') + 'Mi vista</a>';
    // quien tiene la vista del equipo en consulta (31_consulta_equipo.sql) brinca entre su vista y la de los gerentes
    if (P.equipo) otra = ROL === 'contador'
      ? '<a role="menuitem" href="gerentes.html">' + ic('vista') + 'Vista del equipo (consulta)</a>' : '<a role="menuitem" href="contadores.html">' + ic('vista') + 'Mi vista</a>';
    pu.innerHTML = '<button class="pu-btn" type="button" id="pu-btn" aria-haspopup="menu" aria-expanded="false" aria-controls="pu-dd">'
      + '<span class="pu-av" data-pu-av></span><span class="pu-nom">' + esc(p.nombre) + '</span>' + ic('car', 'pu-car') + '</button>'
      + '<div class="pu-dd" id="pu-dd" role="menu" hidden>'
      + '<div class="pu-dh"><span class="pu-av m" data-pu-av></span><div><b>' + esc(p.nombre) + '</b><small>' + esc(puestoDe(p)) + '</small></div></div>'
      + '<button type="button" role="menuitem" id="pu-perfil">' + ic('perfil') + 'Perfil</button>'
      + '<button type="button" role="menuitem" id="pu-clave">' + ic('clave') + 'Cambiar contraseña</button>'
      + otra
      + '<hr><button type="button" role="menuitem" class="pu-salir" id="pu-salir">' + ic('salir') + 'Salir</button></div>';
    // el nombre y el botón de claro/oscuro van juntos: en el celular nunca se separan en dos renglones
    var par = document.createElement('div'); par.className = 'pu-par';
    if (lugar) lugar.replaceWith(par);
    else { var meta = document.querySelector('header .meta'); if (!meta) return; meta.appendChild(par); }
    par.appendChild(pu);
    if (P.consulta) {
      var ch = document.createElement('span');
      ch.className = 'pu-cons'; ch.title = MSG_CONSULTA; ch.setAttribute('aria-label', MSG_CONSULTA);
      ch.innerHTML = ic('ojo') + '<b>Solo consulta</b>';
      pu.parentNode.insertBefore(ch, pu);
    }
    botonTema(pu);
    var btn = document.getElementById('pu-btn'), dd = document.getElementById('pu-dd');
    P.deslizaDentro(dd);   // con el dedo se desliza el menú, nunca la pantalla de abajo (4-nov-2026)
    function despliega(o) {
      // en celular el menú se pega a la orilla derecha, justo abajo de la foto
      if (o) document.documentElement.style.setProperty('--pu-top', Math.round(btn.getBoundingClientRect().bottom + 8) + 'px');
      // en cualquier pantalla, también una laptop baja, el menú cabe completo: si es más alto que lo que queda abajo de
      // la foto, sus opciones se deslizan por dentro (regla de Daniel: «todos los menús… deben de siempre verse»)
      if (o) dd.style.maxHeight = Math.max(180, Math.floor(innerHeight - btn.getBoundingClientRect().bottom - 8 - 12)) + 'px';
      dd.hidden = !o; btn.setAttribute('aria-expanded', o ? 'true' : 'false');
      if (o) { P.abreMenu('pu'); var f = dd.querySelector('[role="menuitem"]'); if (f) f.focus(); }
    }
    // un solo menú a la vez: si se abre otro (la campanita, una tarjeta del menú…), este se cierra
    document.addEventListener(EV_MENU, function (e) { if (e.detail !== 'pu' && !dd.hidden) despliega(false); });
    // sin stopPropagation: el clic sigue hasta la página para que los demás menús abiertos se cierren
    btn.onclick = function () { despliega(dd.hidden); };
    document.addEventListener('click', function (e) { if (!dd.hidden && !pu.contains(e.target)) despliega(false); });
    dd.addEventListener('click', function (e) { if (e.target.closest('[role="menuitem"]')) despliega(false); });
    document.addEventListener('keydown', function (e) {
      if (dd.hidden) return;
      if (e.key === 'Escape') { despliega(false); btn.focus(); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        var it = [].slice.call(dd.querySelectorAll('[role="menuitem"]')), i = it.indexOf(document.activeElement);
        e.preventDefault(); it[(i + (e.key === 'ArrowDown' ? 1 : it.length - 1)) % it.length].focus();
      }
    });
    var clave = dialogoClave(), perfil = dialogoPerfil(p);
    document.getElementById('pu-perfil').onclick = perfil;
    document.getElementById('pu-clave').onclick = clave;
    document.getElementById('pu-salir').onclick = P.salir;
    pintaFoto(p);
    cargaFoto(p);
    botonActualizar(dd);
    pideFoto(p, perfil);
    window.__pideFoto = function () { pideFoto(p, perfil, true); };   // para verla en las pruebas
  }

  /* Botón de modo claro / oscuro, a la derecha del nombre: la luna pasa a oscuro y el sol regresa a claro.
     Mientras siga al dispositivo, primero sale el aviso (P.cambiaTema). Cambia la página, el menú de la izquierda y
     todas las pestañas y sub pestañas. */
  function botonTema(pu) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'pu-tema'; b.id = 'pu-tema';
    function pinta() {
      var oscuro = P.tema() === 'dark';
      b.innerHTML = ic(oscuro ? 'sol' : 'luna');
      b.title = P.modo() === 'auto' ? 'Modo ' + (oscuro ? 'oscuro' : 'claro') + ', como tu dispositivo'
        : (oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      b.setAttribute('aria-label', b.title);
    }
    pinta();
    document.addEventListener('profase-tema', pinta);
    b.onclick = function () { P.cambiaTema(P.tema() === 'dark' ? 'light' : 'dark'); };
    pu.parentNode.insertBefore(b, pu.nextSibling);
  }

  /* Botón «Actualizar» (solo para quien está en la lista de la base): corre la actualización en ese momento.
     El horario fijo (cada 3 horas) no se mueve. Cuando llegan los datos nuevos, la página los toma sola. */
  function aviso(txt, ms) {
    var a = document.getElementById('pu-aviso');
    if (!a) { a = document.createElement('div'); a.id = 'pu-aviso'; a.className = 'pu-aviso'; a.setAttribute('role', 'status'); document.body.appendChild(a); }
    a.textContent = txt; a.hidden = false;
    clearTimeout(a._t); if (ms) a._t = setTimeout(function () { a.hidden = true; }, ms);
  }
  async function horaDatos() {
    var r = await sb.from('docs').select('data').eq('col', 'datos').eq('id', 'meta').maybeSingle();
    return r.data && r.data.data && r.data.data.refreshedAt ? Date.parse(r.data.data.refreshedAt) : 0;
  }
  async function botonActualizar(dd) {
    var r = await sb.rpc('puedo_actualizar');
    if (r.error || r.data !== true) return;
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'menuitem'); b.id = 'pu-act';
    b.title = 'Trae los datos más nuevos del WorkFlow y la cobranza en este momento';
    function texto(t) { b.innerHTML = ic('act') + esc(t); }
    texto('Actualizar');
    var antesDe = dd.querySelector('#pu-clave');
    antesDe.parentNode.insertBefore(b, antesDe.nextSibling);
    b.onclick = async function () {
      b.disabled = true; texto('Actualizando…');
      var antes = 0; try { antes = await horaDatos(); } catch (e) { antes = 0; }
      var q = await sb.rpc('solicitar_actualizacion');
      if (q.error) {
        b.disabled = false; texto('Actualizar');
        aviso(/llave/i.test(q.error.message) ? 'El botón todavía no está conectado. Avísale a Daniel.' : 'No se pudo pedir la actualización. Vuelve a intentar en un momento.', 6000);
        return;
      }
      aviso(q.data && q.data.yaEnCurso ? 'Ya hay una actualización en camino; en un par de minutos se ven los datos nuevos.'
        : 'Actualizando el WorkFlow y la cobranza; tarda uno o dos minutos.', 5000);
      var fin = Date.now() + 5 * 60000;
      (async function espera() {
        var ahora = 0; try { ahora = await horaDatos(); } catch (e) { ahora = 0; }
        if (ahora > antes) { vuelta(); b.disabled = false; texto('Actualizar'); aviso('Listo: ya están los datos nuevos.', 4000); return; }
        if (Date.now() > fin) { b.disabled = false; texto('Actualizar'); aviso('Está tardando más de lo normal; los datos llegarán solos en cuanto termine.', 7000); return; }
        setTimeout(espera, 10000);
      })();
    };
  }

  /* El Cotizador DECOMSA ahora vive dentro del portal (pestaña del módulo Administración):
     dentro de su marco se le esconde el encabezado; si alguien lo abre solo (una liga vieja), se le lleva a su página. */
  if (ROL === 'cotizador') {
    if (window.top !== window.self) {
      var oc = document.createElement('style'); oc.textContent = 'header.band{display:none!important}';
      document.head.appendChild(oc);
    } else {
      P.listo.then(function (p) { if (p) location.replace(P.paginaDe(p.rol) + '#cotizador'); }).catch(function () {});
    }
  }
  if (ROL) {
    P.listo.then(function (p) {
      if (!p) return;
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { encabezado(p); });
      else encabezado(p);
      vigilaInactividad();
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', versionNueva);
      else versionNueva();
    }).catch(function () {});
  }
})();
