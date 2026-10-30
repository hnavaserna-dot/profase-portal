/* Portal PROFASE: sesión, permisos y base de datos.
   Las páginas del equipo se escribieron para la base de Claude (window.claude.use('db'|'user'|'downloads')).
   Aquí se da esa misma interfaz encima de Supabase, para que la página funcione igual fuera de Claude.
   La llave publicable es pública por diseño: lo que cada quien puede leer o escribir lo cuidan las reglas
   de la base (RLS) según su rol, no esta página. */
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
      rec_guarda: 1, rec_estatus: 1, rec_borra: 1, rec_destinatario: 1 };   // etapa 5 (56_recordatorios.sql)
    sb.rpc = function (fn) { return P.consulta && ESCRIBEN[fn] ? rechazo() : rpc.apply(null, arguments); };
    // funciones del servidor que mandan algo (recordatorios de pago desde cumplimiento@): en solo consulta, no
    // (sb.functions se arma de nuevo cada vez que se pide: se envuelve el que se entrega)
    var MANDAN = { recordatorios: 1 };
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
        // su propia foto de perfil sí la puede poner o quitar
        if (P.consulta && b !== 'fotos') ['upload', 'update', 'remove', 'move', 'copy', 'uploadToSignedUrl'].forEach(function (m) {
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
    + '.pt-dlg{width:min(440px,100%);max-height:calc(100vh - 32px);overflow:auto;box-sizing:border-box;background:#fff;color:#1A2333;border-radius:14px;'
    + 'border-top:4px solid #F07A1E;box-shadow:0 18px 50px rgba(0,0,0,.3);padding:20px 20px 16px;font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;text-align:left}'
    + '.pt-dlg h2{margin:0 0 8px;font-size:17px;color:#1F3864}.pt-dlg p{margin:0 0 10px}.pt-dlg b{font-weight:700}'
    + '.pt-ic{width:42px;height:42px;border-radius:50%;background:#E6ECF6;color:#1F3864;display:grid;place-items:center;margin-bottom:10px}.pt-ic svg{width:22px;height:22px;display:block}'
    + '.pt-acts{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;margin-top:14px}'
    + '.pt-b{font:inherit;font-size:14px;font-weight:600;border-radius:9px;padding:10px 14px;cursor:pointer;border:1px solid #C5CEDC;background:#fff;color:#1A2333;flex:1 1 auto;min-height:44px}'
    + '.pt-b.pri{background:#1F3864;border-color:#1F3864;color:#fff}.pt-b:focus-visible{outline:2px solid #F07A1E;outline-offset:2px}'
    + '.pt-toast{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:2147483000;width:max-content;max-width:calc(100vw - 24px);box-sizing:border-box;'
    + 'display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;background:#1A2333;color:#fff;border-left:5px solid #F07A1E;border-radius:10px;padding:10px 14px;'
    + 'font:13.5px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.3)}'
    + '.pt-toast button{font:inherit;font-weight:700;background:none;border:0;color:#FFB070;text-decoration:underline;cursor:pointer;padding:6px 0}'
    + ':root[data-theme="dark"] .pt-dlg{background:#172133;color:#E5EAF2;box-shadow:0 18px 50px rgba(0,0,0,.6)}'
    + ':root[data-theme="dark"] .pt-dlg h2{color:#fff}:root[data-theme="dark"] .pt-ic{background:#22324D;color:#F07A1E}'
    + ':root[data-theme="dark"] .pt-b{background:#1E2A40;border-color:#3A4A66;color:#E5EAF2}:root[data-theme="dark"] .pt-b.pri{background:#F07A1E;border-color:#F07A1E;color:#fff}'
    + ':root[data-theme="dark"] .pt-toast{background:#F5F7FB;color:#1A2333}:root[data-theme="dark"] .pt-toast button{color:#B4520A}';
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
  function avisoManual(txt) {
    cssModo();
    var a = document.getElementById('pt-toast');
    if (!a) { a = document.createElement('div'); a.id = 'pt-toast'; a.className = 'pt-toast'; a.setAttribute('role', 'status'); document.body.appendChild(a); }
    if (txt) { a.innerHTML = '<span></span>'; a.firstChild.textContent = txt; }
    else {
      a.innerHTML = '<span>Modo ' + NOMBRE_MODO[P.tema()] + ', escogido por ti.</span><button type="button">Usar el de mi dispositivo</button>';
      a.querySelector('button').onclick = function () { P.ponModo('auto'); avisoManual('Listo: el portal sigue otra vez a tu dispositivo.'); };
    }
    a.hidden = false;
    clearTimeout(a._t); a._t = setTimeout(function () { a.hidden = true; }, txt ? 3500 : 7000);
  }
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
       para que se note, y la pestaña escogida se queda a la vista. ---- */
  (function pantallas() {
    var css = 'html{-webkit-text-size-adjust:100%;text-size-adjust:100%}'
      + '@media (pointer:coarse) and (max-width:900px){input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]):not([type=file]),select,textarea{font-size:16px!important}}'
      + '.pt-desliza{scroll-behavior:smooth;overscroll-behavior-x:contain}'
      + '.pt-desliza.pt-der{-webkit-mask-image:linear-gradient(to right,#000 calc(100% - 36px),transparent);mask-image:linear-gradient(to right,#000 calc(100% - 36px),transparent)}'
      + '.pt-desliza.pt-izq{-webkit-mask-image:linear-gradient(to left,#000 calc(100% - 36px),transparent);mask-image:linear-gradient(to left,#000 calc(100% - 36px),transparent)}'
      + '.pt-desliza.pt-izq.pt-der{-webkit-mask-image:linear-gradient(to right,transparent,#000 36px,#000 calc(100% - 36px),transparent);mask-image:linear-gradient(to right,transparent,#000 36px,#000 calc(100% - 36px),transparent)}';
    function pon() {
      if (document.getElementById('pt-pantallas')) return;
      var st = document.createElement('style'); st.id = 'pt-pantallas'; st.textContent = css;
      (document.head || document.documentElement).appendChild(st);
    }
    pon();
    var TIRAS = '[role="tablist"],nav.tabs,.tabs,.wtabs,.qsw,.subtabs,.seg,.wmv';
    function escogida(t) { return t.querySelector('[aria-selected="true"],[aria-current="page"],[aria-current="true"],[aria-pressed="true"],.on,.active'); }
    function marca(t, centra) {
      var cs = getComputedStyle(t);
      if (!/(auto|scroll)/.test(cs.overflowX) || t.scrollWidth <= t.clientWidth + 2) {
        t.classList.remove('pt-desliza', 'pt-izq', 'pt-der'); return;
      }
      t.classList.add('pt-desliza');
      if (centra) {
        var e = escogida(t);
        if (e) {
          var a = e.offsetLeft - t.offsetLeft, b = a + e.offsetWidth;
          if (e.offsetParent !== t.offsetParent) { var rt = t.getBoundingClientRect(), re = e.getBoundingClientRect(); a = re.left - rt.left + t.scrollLeft; b = a + re.width; }
          if (a < t.scrollLeft + 24 || b > t.scrollLeft + t.clientWidth - 24) t.scrollLeft = Math.max(0, a - (t.clientWidth - (b - a)) / 2);
        }
      }
      t.classList.toggle('pt-izq', t.scrollLeft > 4);
      t.classList.toggle('pt-der', t.scrollLeft + t.clientWidth < t.scrollWidth - 4);
    }
    var espera = null;
    function todas(centra) {
      clearTimeout(espera);
      espera = setTimeout(function () {
        if (!document.body) return;
        document.querySelectorAll(TIRAS).forEach(function (t) { try { marca(t, centra); } catch (e) { /* nada */ } });
      }, 120);
    }
    document.addEventListener('scroll', function (e) {
      var t = e.target;
      if (t && t.classList && t.classList.contains('pt-desliza')) marca(t, false);
    }, true);
    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target.closest(TIRAS) : null;
      if (t) setTimeout(function () { marca(t, true); }, 60);
      else todas(false);
    }, true);
    window.addEventListener('resize', function () { todas(true); });
    function arranca() {
      todas(true);
      if (window.MutationObserver && document.body) {
        new MutationObserver(function () { todas(false); }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'aria-selected', 'class'] });
      }
    }
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
  var NOMBRE_PAG = { director: 'Dirección', gerentes: 'Vista del equipo', contadores: 'Mi WorkFlow', cartera: 'Cartera',
    cajachica: 'Caja chica', variaciones: 'Variaciones', activofijo: 'Activo fijo', 'quo-cotizador': 'Cotizador QUO',
    'quo-membresias': 'Membresías QUO', cotizador: 'Cotizador DECOMSA', accesos: 'Accesos', calendario: 'Calendario', cambios: 'Cambios al portal' };
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
    + '.pt-toast.pv-toast b{font-variant-numeric:tabular-nums}'
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
    function ventana() {
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
      tic = setInterval(function () { if (cuenta(fin, num) <= 0) { clearInterval(tic); recarga(nueva, true); } }, 1000);
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
      var a = document.createElement('div');
      a.id = 'pv-toast'; a.className = 'pt-toast pv-toast'; a.setAttribute('role', 'status');
      a.innerHTML = '<span>El portal se va a actualizar en <b data-mmss="1">3:00</b>.</span><button type="button">Actualizar ahora</button>';
      document.body.appendChild(a);
      var num = a.querySelector('b');
      a.querySelector('button').onclick = function () { clearInterval(tic); recarga(nueva, false); };
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

  /* ---- Sesión: las páginas de rol exigen sesión y el rol correcto ---- */
  P.listo = (async function () {
    if (!ROL) return null;
    var s = (await sb.auth.getSession()).data.session;
    if (!s) { location.replace('./'); throw new Error('sin sesión'); }
    var p = null;
    try { p = await P.perfilDe(s.user.id); } catch (e) { p = null; }
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
    // ¿Solo consulta? (tabla solo_consulta de la base). Si la base no contesta, la base igual lo detiene al guardar.
    try { var c = await sb.rpc('es_solo_consulta'); P.consulta = !c.error && c.data === true; } catch (e) { P.consulta = false; }
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
        var q = await sb.from('docs').select('id,version').eq('col', w.col).order('id');
        if (q.error) throw q.error;
        var f2 = (q.data || []).map(function (x) { return x.id + ':' + x.version; }).join(',');
        if (f2 === w.firma) return;
        var t = await sb.from('docs').select('id,data,version').eq('col', w.col).order('id');
        if (t.error) throw t.error;
        var docs = (t.data || []).map(function (x) { return foto(x.id, x); });
        w.firma = f2; w.cb({ docs: docs, size: docs.length, empty: !docs.length });
      }
    } catch (e) { if (w.err) { try { w.err(error(e)); } catch (_) {} } }
  }
  async function vuelta() {
    if (revisando) return;
    revisando = true;
    try { await Promise.all(Array.from(VIG).map(revisa)); } finally { revisando = false; }
  }
  function pronto() { setTimeout(vuelta, 300); }
  function arranca() {
    if (reloj) return;
    reloj = setInterval(function () { if (!document.hidden) vuelta(); }, CADA);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) vuelta(); });
    window.addEventListener('focus', vuelta);
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
      get: async function () {
        var t = await sb.from('docs').select('id,data').eq('col', col).order('id');
        if (t.error) throw error(t.error);
        var docs = (t.data || []).map(function (x) { return foto(x.id, x); });
        return { docs: docs, size: docs.length, empty: !docs.length };
      },
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
    + '.pu-dd{position:absolute;right:0;top:calc(100% + 8px);width:270px;background:var(--surface);color:var(--ink);border:1px solid var(--line-strong);border-radius:12px;box-shadow:0 14px 40px rgba(0,0,0,.18);padding:6px;z-index:45;text-align:left}'
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
    + '.pu .btn.pu-ac,.ov .btn.pu-ac{background:var(--accent);border-color:var(--accent);color:#fff}'
    + '.pu-rec{position:relative;width:260px;height:260px;max-width:100%;margin:0 auto;border-radius:12px;overflow:hidden;background:#000;touch-action:none;cursor:grab}'
    + '.pu-rec canvas{display:block;width:100%;height:100%}'
    + '.pu-rec .pu-masc{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at center,transparent 45.5%,rgba(0,0,0,.55) 46%)}'
    + '.pu-rec .pu-masc::after{content:"";position:absolute;left:4%;top:4%;width:92%;height:92%;box-sizing:border-box;border-radius:50%;border:2px solid #fff}'
    + '.pu-zoom{display:flex;align-items:center;gap:10px;margin:14px auto 0;width:260px;max-width:100%;color:var(--muted);font-size:12.5px}'
    + '.pu-zoom input{flex:1;accent-color:var(--accent)}'
    + '.pu-aviso{position:fixed;top:14px;right:14px;z-index:60;max-width:min(380px,calc(100% - 28px));background:var(--surface);color:var(--ink);'
    + 'border:1px solid var(--line-strong);border-left:5px solid var(--accent);border-radius:10px;padding:10px 14px;font-size:13.5px;box-shadow:0 10px 30px rgba(0,0,0,.18)}'
    + '.pu-aviso[hidden]{display:none}'
    + '.pu-cons{flex:none;display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:var(--navy);background:var(--navy-soft);border:1px solid var(--line-strong);border-radius:999px;padding:5px 11px;white-space:nowrap;cursor:default}'
    + '.pu-cons svg{width:15px;height:15px;display:block;flex:none}'
    + ':root[data-theme="dark"] .pu-cons{color:var(--accent)}'
    + '@media (max-width:900px){.pu-nom,.pu-btn .pu-car{display:none}.pu-btn{padding:3px}.pu-cons b{display:none}.pu-cons{padding:8px}'
    + '.pu-dd{position:fixed;right:12px;top:var(--pu-top,64px);width:min(270px,calc(100vw - 24px));max-height:calc(100vh - var(--pu-top,64px) - 12px);overflow-y:auto}}';
  var IC = {
    perfil: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    clave: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    act: '<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 4v5h-5"/>',
    vista: '<circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="9" r="2.6"/><path d="M3 20c.8-3.4 3.2-5 6-5s5.2 1.6 6 5M15 15.2c2.6-.4 4.9 1 5.7 4.3"/>',
    salir: '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
    ojo: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    car: '<path d="m6 9 6 6 6-6"/>',
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
  var FOTO = { url: null };
  function pintaFoto(p) {
    document.querySelectorAll('[data-pu-av]').forEach(function (a) {
      a.innerHTML = FOTO.url ? '<img alt="" src="' + esc(FOTO.url) + '">' : esc(iniciales(p.nombre));
    });
    var q = document.getElementById('pu-quita'); if (q) q.hidden = !FOTO.url;
  }
  async function cargaFoto(p) {
    try {
      var l = await sb.storage.from('fotos').list('', { search: P.uid + '.jpg', limit: 1 });
      if (l.error || !l.data || !l.data.some(function (f) { return f.name === P.uid + '.jpg'; })) { FOTO.url = null; pintaFoto(p); return; }
      var s = await sb.storage.from('fotos').createSignedUrl(P.uid + '.jpg', 6 * 3600);
      FOTO.url = (!s.error && s.data && s.data.signedUrl) || null;
    } catch (e) { FOTO.url = null; }
    pintaFoto(p);
  }
  /* Fotos de perfil de otros usuarios, para espejearlas en otras pestañas (Calendario › Colaboradores y la ventana de
     cumpleaños; pedido de Daniel, 29-oct-2026). Recibe ids de usuario y regresa { id: liga firmada } solo de quienes
     tienen foto. Las ligas duran 6 horas. Si algo falla, regresa {} y la pestaña sigue con lo que tenía. */
  P.fotosDe = async function (ids) {
    var out = {};
    try {
      var pide = {};
      (ids || []).forEach(function (u) { u = String(u || ''); if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(u)) pide[u.toLowerCase()] = 1; });
      if (!Object.keys(pide).length) return out;
      var l = await sb.storage.from('fotos').list('', { limit: 1000 });
      if (l.error || !Array.isArray(l.data)) return out;
      var rutas = l.data.map(function (f) { return f && f.name; }).filter(function (n) { return n && pide[String(n).replace(/\.jpg$/i, '').toLowerCase()] && /\.jpg$/i.test(n); });
      if (!rutas.length) return out;
      var s = await sb.storage.from('fotos').createSignedUrls(rutas, 6 * 3600);
      var base = SB_URL + '/storage/v1/object/sign/fotos/';
      (s.data || []).forEach(function (x) {
        if (x && !x.error && typeof x.signedUrl === 'string' && x.signedUrl.indexOf(base) === 0 && x.path) out[String(x.path).replace(/\.jpg$/i, '').toLowerCase()] = x.signedUrl;
      });
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
        b.disabled = false; b.textContent = 'Guardar foto';
        if (r.error) { falla('pf-msg2', r.error); return; }
        await cargaFoto(p);
        ver(); msg('pf-msg', 'Listo: tu foto quedó guardada.', 'ok');
      }, 'image/jpeg', 0.85);
    };
    $('pu-quita').onclick = async function () {
      var b = $('pu-quita'); b.disabled = true;
      var r = await sb.storage.from('fotos').remove([P.uid + '.jpg']);
      b.disabled = false;
      if (r.error) { falla('pf-msg', r.error); return; }
      FOTO.url = null; pintaFoto(p); msg('pf-msg', 'Listo: se quitó tu foto; se ven tus iniciales.', 'ok');
    };
    return function () { cerrar(); ov.hidden = false; $('pu-cambia').focus(); };
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
    function despliega(o) {
      // en celular el menú se pega a la orilla derecha, justo abajo de la foto
      if (o) document.documentElement.style.setProperty('--pu-top', Math.round(btn.getBoundingClientRect().bottom + 8) + 'px');
      dd.hidden = !o; btn.setAttribute('aria-expanded', o ? 'true' : 'false');
      if (o) { var f = dd.querySelector('[role="menuitem"]'); if (f) f.focus(); }
    }
    btn.onclick = function (e) { e.stopPropagation(); despliega(dd.hidden); };
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
