/* «Ayuda en vivo» de los sistemas Quo (Héctor Daniel Nava, 25-nov-2026: «un tipo AnyDesk… pero quiero tenerlo
   controlado por nosotros»; «sí así es! a darle!»; escogió «Ver su Quo en vivo»).
   Una sola pieza para los dos lados, que se carga de crmprofase.com.mx:
   - PROFASE_ENVIVO.cliente(o): en Quo Contabilita, Facturita, Nominita o la casa, con el «sí» del cliente. Manda lo que se
     ve en ESA pestaña de Quo (rrweb: la página, nunca la pantalla de la computadora), con las contraseñas y lo delicado
     tapado, por el canal privado de la sala que abrió el CRM. Si el cliente lo deja, quien lo atiende pica y escribe por él;
     lo que timbra, cancela, borra, manda o paga se le pregunta antes, cada vez.
   - PROFASE_ENVIVO.agente(o): en el CRM (QUO › Conversaciones). Pinta la pantalla del cliente tal cual (en un marco sin
     scripts), señala con su puntero y, con permiso, la mueve.
   Nada se graba ni se guarda: pasa por el canal y se pinta. El canal solo lo conocen el cliente (después de su «sí») y quien
   lo atiende, y solo vive mientras dura (portal/sql/529_qchat_envivo.sql del CRM y base/sql/95_qs_qchat.sql de Quo). */
(function () {
  'use strict';
  if (window.PROFASE_ENVIVO) return;

  // La base del CRM (la misma de js/portal.js; prueba_envivo.py revisa que sean iguales)
  var SB_URL = 'https://arbykgauatkldznwwtjx.supabase.co';
  var SB_KEY = 'sb_publishable_gUzFFB-YnzC5AOFOK_-H9Q_jBbDUzG5';
  var YO_SRC = (document.currentScript && document.currentScript.src) || '';
  var BASE = (function () { try { return new URL('./', YO_SRC).href; } catch (e) { return 'https://crmprofase.com.mx/js/'; } })();
  var V = (function () { try { return new URL(YO_SRC).searchParams.get('v') || ''; } catch (e) { return ''; } })();
  var TROZO = 48000;          // letras por mensaje del canal
  var LOTE_MS = 220;          // cada cuánto se juntan los cambios de la pantalla
  var SIN_AGENTE_MS = 60000;  // sin quien atiende, se deja de mandar la pantalla
  var Q_AZUL = '#2C4874', Q_NAR = '#E47C28', OSCURO = '#14233F';

  function ahora() { return Date.now(); }
  function dormir(ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); }
  function norm(t) {
    return String(t == null ? '' : t).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  }
  function corto(t, n) { t = String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; }

  // ── cargar las piezas (las de rrweb viven en js/lib, junto a esta) ───────────────────────────────────────────────────
  var CARGAS = {};
  function lib(n) { return BASE + 'lib/' + n + (V ? '?v=' + encodeURIComponent(V) : ''); }
  function carga(url, css) {
    if (CARGAS[url]) return CARGAS[url];
    CARGAS[url] = new Promise(function (ok, mal) {
      var el, amd = null;
      if (css) { el = document.createElement('link'); el.rel = 'stylesheet'; el.href = url; }
      else {
        el = document.createElement('script'); el.src = url; el.async = true;
        // si la página trae AMD (define), la librería se registraría ahí y no en window
        if (typeof window.define === 'function' && window.define.amd) { amd = window.define; window.define = undefined; }
      }
      el.onload = function () { if (amd) window.define = amd; ok(); };
      el.onerror = function () {
        if (amd) window.define = amd;
        delete CARGAS[url];
        mal(new Error('No se pudo cargar la ayuda en vivo. Qué hacer: revisa tu internet y vuelve a intentarlo.'));
      };
      (document.head || document.documentElement).appendChild(el);
    });
    return CARGAS[url];
  }
  function cargaSupabase() {
    if (window.supabase && window.supabase.createClient) return Promise.resolve();
    return carga(BASE + 'supabase.js');
  }

  // ── el canal: el de la sala del CRM (privado; lo deja abrir solo quien sabe su número, mientras la sala está abierta) ─
  function abreCanal(canal, alMsg, alEstado) {
    if (!/^[0-9a-f]{32}$/.test(String(canal || ''))) {
      return Promise.reject(new Error('Esta ayuda en vivo no es válida. Qué hacer: termínala y vuelve a empezarla desde la ayuda.'));
    }
    if (typeof window.__PRUEBA_ENVIVO_CANAL === 'function') {   // las pruebas: dos páginas unidas sin red
      return Promise.resolve(window.__PRUEBA_ENVIVO_CANAL(canal, alMsg, alEstado));
    }
    return cargaSupabase().then(function () {
      var sb = window.supabase.createClient(SB_URL, SB_KEY, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: 'profase-envivo' }
      });
      var ch = sb.channel('chat:sala:' + canal, { config: { private: true, broadcast: { self: false, ack: false } } });
      ch.on('broadcast', { event: 'm' }, function (m) { try { alMsg((m && m.payload) || {}); } catch (e) { /* un mensaje raro no tumba nada */ } });
      ch.subscribe(function (s) { try { alEstado(s); } catch (e) { /* nada */ } });
      return {
        manda: function (p) { return Promise.resolve(ch.send({ type: 'broadcast', event: 'm', payload: p })).catch(function () { /* se pierde: se pide otra vez */ }); },
        cierra: function () {
          try { sb.removeChannel(ch); } catch (e) { /* nada */ }
          try { sb.realtime.disconnect(); } catch (e) { /* nada */ }
        }
      };
    });
  }

  // ── comprimir (gzip, donde el navegador sabe) ────────────────────────────────────────────────────────────────────────
  var Z = (function () {
    try { new CompressionStream('gzip'); new DecompressionStream('gzip'); return true; } catch (e) { return false; }
  })();
  function b64(u8) {
    var s = '', n = 0x8000;
    for (var i = 0; i < u8.length; i += n) s += String.fromCharCode.apply(null, u8.subarray(i, i + n));
    return btoa(s);
  }
  function deB64(t) { var s = atob(t), u = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; }
  function aprieta(txt) {
    var cs = new CompressionStream('gzip'), w = cs.writable.getWriter();
    w.write(new TextEncoder().encode(txt)); w.close();
    return new Response(cs.readable).arrayBuffer().then(function (ab) { return b64(new Uint8Array(ab)); });
  }
  function afloja(t) {
    var ds = new DecompressionStream('gzip'), w = ds.writable.getWriter();
    w.write(deB64(t)); w.close();
    return new Response(ds.readable).text();
  }

  // ── lo delicado nunca se ve ni se escribe por el cliente ─────────────────────────────────────────────────────────────
  var DELICADO = /contrase|password|passwd|\bciec\b|\bcvv\b|\bnip\b|\bpin\b|tarjeta|token|secreto/i;
  function delicado(el) {
    if (!el || el.nodeType !== 1) return false;
    var t = String(el.type || '').toLowerCase();
    if (t === 'password') return true;
    var ac = String(el.getAttribute('autocomplete') || '').toLowerCase();
    if (/current-password|new-password|cc-number|cc-csc|one-time-code/.test(ac)) return true;
    if (el.hasAttribute('data-delicado') || (el.closest && el.closest('[data-delicado]'))) return true;
    var et = '';
    try { et = el.labels ? [].map.call(el.labels, function (l) { return l.textContent || ''; }).join(' ') : ''; } catch (e) { /* nada */ }
    return DELICADO.test([el.name, el.id, el.getAttribute('placeholder'), el.getAttribute('aria-label'), et].join(' '));
  }
  function escribible(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') return true;
    if (el.tagName !== 'INPUT') return false;
    return !/^(button|submit|reset|checkbox|radio|file|image|hidden|range|color)$/i.test(el.type || 'text');
  }
  // lo que dice un botón, una liga o un campo (para preguntarle al cliente y para la bitácora)
  function etiqueta(el) {
    if (!el || el.nodeType !== 1) return '';
    var t = '';
    if (el.tagName === 'INPUT' && /^(button|submit|reset)$/i.test(el.type || '')) t = el.value;
    if (!t) t = el.getAttribute('aria-label') || '';
    if (!t) t = (el.innerText || el.textContent || '');
    if (!t) t = el.getAttribute('title') || el.getAttribute('placeholder') || el.name || '';
    if (!t && el.labels && el.labels[0]) t = el.labels[0].textContent || '';
    return corto(t, 60) || 'un botón';
  }

  // ═════════════════════════════════════════ EL CLIENTE (en Quo) ═════════════════════════════════════════════════════
  var NO_DEJAR = '.qch,.qch-bur,.qch-ver,.qch-llam,[data-envivo-no]';   // la ayuda misma: la pica el cliente
  // lo que de verdad es un botón; si no hay, un renglón o tarjeta que se pica (sin tomar un recuadro grande por botón)
  var ACC_FUERTE = 'button,a[href],[role=button],[role=tab],[role=menuitem],[role=option],[role=checkbox],[role=radio],[role=link],' +
                   'input,select,textarea,label,summary';
  var ACC_DEBIL = '[onclick],[tabindex]:not([tabindex="-1"]),tr,li';
  var CERRAR_DIALOGO = /^(cancelar|no|cerrar|regresar|atras|volver|seguir|×|✕|x)$/;
  var PELIGRO = new RegExp('\\b(' + [
    'timbrar', 'timbra', 'timbrala', 'timbralo', 'cancelar', 'cancela', 'cancelala', 'borrar', 'borra', 'borralo', 'eliminar', 'elimina',
    'dar de baja', 'baja', 'enviar', 'envia', 'enviarla', 'mandar', 'manda', 'mandarla', 'pagar', 'paga', 'pagado', 'cobrar', 'cobra',
    'autorizar', 'autoriza', 'aplicar', 'aplica', 'contabilizar', 'contabiliza', 'reabrir', 'reabre', 'desbloquear', 'desbloquea',
    'suspender', 'suspende', 'desactivar', 'desactiva', 'sustituir', 'sustituye', 'importar', 'importa', 'quitar', 'quita',
    'salir', 'cerrar sesion', 'liquidar', 'liquida', 'deshacer', 'restaurar', 'vaciar', 'descartar', 'rechazar', 'aceptar solicitud',
    'cerrar (el )?(mes|periodo|ano|ejercicio)', 'cerrar mes', 'cierra el mes', 'pasar a produccion', 'timbrar de verdad'
  ].join('|') + ')\\b');
  function peligroso(el, txt) {
    var n = norm(txt).replace(/[«»"'.:;!?¿¡]/g, '').trim();
    if (el.closest && el.closest('.peligro,.rojo,.danger,[data-peligro]')) return true;
    if (el.matches && el.matches('.peligro,.rojo,.danger,[data-peligro]')) return true;
    if (el.tagName === 'A' && el.href) {
      try { if (new URL(el.href, location.href).origin !== location.origin) return true; } catch (e) { return true; }
    }
    if (CERRAR_DIALOGO.test(n)) {
      // «Cancelar» que solo cierra una ventana no es peligroso; suelto, sí (puede ser cancelar una factura)
      return !(el.closest && el.closest('[role=dialog],[role=alertdialog],dialog,.velo,.modal,.ventana'));
    }
    return PELIGRO.test(n);
  }

  var UI = null;          // lo que ve el cliente (una sola vez por página, en una sombra cerrada que no se graba)
  var ACT_C = null;       // la ayuda en vivo de esta página (una a la vez)

  function cssCliente() {
    return ':host{all:initial}' +
      '[hidden]{display:none!important}' +           // si no, el «display:flex» de abajo le gana a «hidden» (la barra se quedaba)
      '*{box-sizing:border-box;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}' +
      '.b{position:fixed;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top,0px) + 8px);z-index:3;display:flex;' +
      'flex-wrap:wrap;align-items:center;gap:6px 8px;max-width:calc(100vw - 16px);padding:6px 8px 6px 12px;border-radius:14px;' +
      'background:' + Q_AZUL + ';color:#fff;box-shadow:0 6px 24px rgba(10,20,40,.35);font-size:14px;line-height:1.25}' +
      '.b.abajo{top:auto;bottom:calc(env(safe-area-inset-bottom,0px) + 10px)}' +
      '.pt{width:10px;height:10px;border-radius:50%;background:#9aa6b8;flex:0 0 auto}' +
      '.b.vivo .pt{background:#3fd47a;box-shadow:0 0 0 0 rgba(63,212,122,.6);animation:la 1.6s infinite}' +
      '@keyframes la{70%{box-shadow:0 0 0 8px rgba(63,212,122,0)}100%{box-shadow:0 0 0 0 rgba(63,212,122,0)}}' +
      '.tx{font-weight:600;min-width:0}' +
      '.tc,.mas{display:none}' +
      '.bt{display:flex;flex-wrap:wrap;gap:6px 8px;align-items:center}' +
      'button{font:inherit;font-size:13px;font-weight:600;min-height:34px;padding:6px 11px;border-radius:9px;border:0;cursor:pointer;' +
      'background:#fff;color:' + Q_AZUL + '}' +
      'button.n{background:' + Q_NAR + ';color:' + OSCURO + '}' +
      'button.l{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.55)}' +
      'button:focus-visible{outline:3px solid #ffd27a;outline-offset:2px}' +
      'button.mv{min-width:34px;padding:6px 8px}' +
      '.pc{flex-basis:100%;display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:8px 0 2px;border-top:1px solid rgba(255,255,255,.25);font-weight:500}' +
      '.pc b{flex-basis:100%;font-weight:600}' +
      '.pu{position:fixed;left:0;top:0;z-index:2;pointer-events:none;transition:opacity .4s;opacity:0}' +
      '.pu.on{opacity:1}' +
      '.pu span{position:absolute;left:16px;top:18px;white-space:nowrap;background:' + Q_NAR + ';color:' + OSCURO + ';font-size:12px;' +
      'font-weight:700;padding:2px 7px;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,.25)}' +
      '.an{position:fixed;z-index:2;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;border:3px solid ' + Q_NAR + ';' +
      'pointer-events:none;animation:an 1.4s ease-out forwards}' +
      '@keyframes an{0%{transform:scale(.4);opacity:1}100%{transform:scale(1.6);opacity:0}}' +
      '.velo{position:fixed;inset:0;z-index:4;background:rgba(10,20,40,.4);display:flex;align-items:center;justify-content:center;padding:16px}' +
      '.cf{background:#fff;color:#1b2333;max-width:420px;width:100%;border-radius:16px;padding:18px;box-shadow:0 16px 48px rgba(0,0,0,.35);font-size:15px;line-height:1.4}' +
      '.cf b{display:block;font-size:16px;margin-bottom:6px;color:' + Q_AZUL + '}' +
      '.cf .ac{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;margin-top:14px}' +
      '.cf button{font-size:14px;min-height:40px;padding:8px 14px;background:' + Q_AZUL + ';color:#fff}' +
      '.cf button.l{background:#fff;color:' + Q_AZUL + ';border:1px solid ' + Q_AZUL + '}' +
      '.cf small{display:block;margin-top:8px;color:#4a5568}' +
      '@media (prefers-color-scheme:dark){.cf{background:#1c2536;color:#e8edf5}.cf b{color:#9cc3ff}.cf button.l{background:transparent;color:#cfe0ff;border-color:#6f89b8}.cf small{color:#a9b4c6}}' +
      '@media (max-width:480px){.b{font-size:13px}.b button{font-size:12px;padding:6px 9px}}' +
      // en el celular, chica: «En vivo con …» y ▾; al picarla (o si te piden moverla) salen sus botones. Así no tapa los
      // botones de arriba de la ayuda ni el menú de la página
      '@media (max-width:600px){.b{max-width:min(360px,calc(100vw - 16px));padding:4px 6px 4px 10px}' +
      '.mas{display:inline-block;min-width:34px;padding:6px 8px}' +
      '.b:not(.abierta) .tx,.b:not(.abierta) .bt{display:none}.b:not(.abierta) .tc{display:inline}' +
      '.b.abierta .tx{flex:1 1 calc(100% - 64px)}.bt{flex-basis:100%}}';
  }

  function armaUI() {
    if (UI) return UI;
    var host = document.createElement('div');
    host.className = 'rr-block';                 // rrweb no la graba: el que atiende no la ve
    host.setAttribute('data-envivo-no', '');
    host.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;z-index:2147483000;';
    // cerrada: la página de Quo no la puede leer ni picar (las pruebas la abren para revisarla)
    var sh = host.attachShadow({ mode: window.__PRUEBA_ENVIVO_SOMBRA === 'open' ? 'open' : 'closed' });
    if (window.__PRUEBA_ENVIVO_SOMBRA === 'open') window.__PRUEBA_ENVIVO_UI = sh;
    sh.innerHTML = '<style>' + cssCliente() + '</style>' +
      '<div class="b" role="status" aria-live="polite" hidden><i class="pt" aria-hidden="true"></i><span class="tx"></span><span class="tc"></span>' +
      '<button type="button" class="l mas" data-a="mas" aria-expanded="false" aria-label="Ver las opciones de la ayuda en vivo" title="Ver las opciones">▾</button>' +
      '<div class="bt"><button type="button" data-a="control"></button><button type="button" class="l" data-a="voz">Hablar por voz</button>' +
      '<button type="button" class="n" data-a="fin">Terminar</button>' +
      '<button type="button" class="l mv" data-a="mover" aria-label="Mover este aviso arriba o abajo" title="Mover este aviso arriba o abajo">⇅</button></div>' +
      '<div class="pc" hidden><b></b><button type="button" data-a="si">Sí, que la mueva</button><button type="button" class="l" data-a="no">No</button></div></div>' +
      '<div class="pu" aria-hidden="true"><svg width="22" height="26" viewBox="0 0 22 26"><path d="M2 2l17 10.5-7.6 1.6 4.4 8.6-3.4 1.7-4.4-8.7L2 21z" ' +
      'fill="' + Q_NAR + '" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg><span></span></div>';
    (document.body || document.documentElement).appendChild(host);
    var $ = function (s) { return sh.querySelector(s); };
    UI = { host: host, sh: sh, barra: $('.b'), tx: $('.tx'), tc: $('.tc'), mas: $('.mas'), bControl: $('[data-a="control"]'), pc: $('.pc'), pu: $('.pu'), puNom: $('.pu span'),
           alClic: null, tPu: 0 };
    try { if (localStorage.getItem('profase-envivo-abajo') === '1') UI.barra.classList.add('abajo'); } catch (e) { /* nada */ }
    sh.addEventListener('click', function (ev) {
      var b = ev.target.closest && ev.target.closest('button[data-a]');
      if (!b) return;
      if (b.dataset.a === 'mas') {
        var ab0 = UI.barra.classList.toggle('abierta'); UI.mas.setAttribute('aria-expanded', ab0 ? 'true' : 'false'); UI.mas.textContent = ab0 ? '▴' : '▾';
        return;
      }
      if (b.dataset.a === 'mover') {
        var ab = UI.barra.classList.toggle('abajo');
        try { localStorage.setItem('profase-envivo-abajo', ab ? '1' : '0'); } catch (e) { /* nada */ }
        return;
      }
      if (UI.alClic) UI.alClic(b.dataset.a, b);
    });
    return UI;
  }
  function anillo(x, y) {
    if (!UI) return;
    var a = document.createElement('div'); a.className = 'an';
    a.style.left = x + 'px'; a.style.top = y + 'px';
    UI.sh.appendChild(a);
    setTimeout(function () { a.remove(); }, 1500);
  }

  // Lo que hace el cliente: o = {canal, quien, control, pideControl, alControl(bool), alHablar(), alTerminar(), alAccion(txt)}
  function cliente(o) {
    o = o || {};
    if (ACT_C) ACT_C.fin(true);
    var ui = armaUI();
    var E = {
      canal: null, listo: false, rec: null, stop: null, cola: [], full: false, timer: null, seq: 0, envio: Promise.resolve(),
      z: false, control: !!o.control, pideControl: !!o.pideControl, quien: o.quien || 'Soporte', visto: 0, tFull: 0,
      vivo: true, pregunta: null, tick: null, conAgente: false
    };
    var REC = null;

    function pinta() {
      if (!E.vivo) return;
      ui.barra.hidden = false;
      ui.barra.classList.toggle('vivo', E.conAgente && !!E.rec);
      ui.tx.textContent = E.conAgente && E.rec ? E.quien + ' ve tu pantalla' + (E.control ? ' y la puede mover' : '')
        : E.listo ? 'Esperando a que ' + E.quien + ' abra tu pantalla…' : 'Conectando la ayuda en vivo…';
      ui.bControl.textContent = E.control ? 'Quitarle el control' : 'Dejar que la mueva';
      ui.bControl.className = E.control ? 'n' : '';
      ui.tc.textContent = E.conAgente && E.rec ? 'En vivo con ' + E.quien : E.listo ? 'Esperando a ' + E.quien + '…' : 'Conectando…';
      ui.pc.hidden = !(E.pideControl && !E.control);
      if (!ui.pc.hidden && !ui.barra.classList.contains('abierta')) {   // te piden moverla: en el celular se abre sola para que lo veas
        abre(true); E.seAbrio = true;
      } else if (ui.pc.hidden && E.seAbrio) {                           // ya contestó: se vuelve a poner chica
        abre(false); E.seAbrio = false;
      }
      ui.pc.querySelector('b').textContent = E.quien + ' pide mover tu pantalla para enseñarte. Lo que timbre, cancele o borre te lo pregunta antes.';
      ui.puNom.textContent = E.quien;
    }
    ui.alClic = function (a) {
      if (!E.vivo) return;
      if (a === 'control') { ponControl(!E.control); if (o.alControl) o.alControl(E.control); }
      else if (a === 'si') { ponControl(true); if (o.alControl) o.alControl(true); }
      else if (a === 'no') { E.pideControl = false; pinta(); if (o.alControl) o.alControl(false); }
      else if (a === 'voz') { if (o.alHablar) o.alHablar(); }
      else if (a === 'fin') { if (o.alTerminar) o.alTerminar(); else api.fin(); }
    };
    function abre(si) {
      ui.barra.classList.toggle('abierta', !!si); ui.mas.setAttribute('aria-expanded', si ? 'true' : 'false'); ui.mas.textContent = si ? '▴' : '▾';
    }
    abre(false);                               // cada ayuda empieza chica (la barra es la misma de la ayuda anterior)
    function ponControl(si) {
      E.control = !!si;
      if (si) E.pideControl = false;
      if (!si && E.pregunta) E.pregunta.no();
      pinta(); mandaEstado();
    }
    function manda(p) { if (E.canal && E.listo) return E.canal.manda(p); return Promise.resolve(); }
    function mandaEstado() { manda({ t: 'estado', control: E.control, w: window.innerWidth, h: window.innerHeight }); }
    function hecho(ok, txt) { manda({ t: 'hecho', ok: !!ok, txt: corto(txt, 240) }); }

    // ── mandar la pantalla ──
    function alEvento(e) {
      if (!E.vivo || !E.rec) return;
      if (e.type === 4) {          // Meta: empieza una foto completa; lo de antes se va solo
        if (E.cola.length) suelta();
        E.full = true; E.cola = [e]; programa(0); return;
      }
      E.cola.push(e);
      programa(E.cola.length > 400 ? 0 : LOTE_MS);
    }
    function programa(ms) {
      if (E.timer && ms > 0) return;
      clearTimeout(E.timer);
      E.timer = setTimeout(suelta, ms);
    }
    function suelta() {
      clearTimeout(E.timer); E.timer = null;
      var evs = E.cola, full = E.full;
      E.cola = []; E.full = false;
      if (!evs.length || !E.listo) return;
      var s = ++E.seq;
      E.envio = E.envio.then(function () { return mandaLote(s, evs, full); }).catch(function () { /* sigue */ });
    }
    function mandaLote(s, evs, full) {
      var txt;
      try { txt = JSON.stringify(evs); } catch (e) { return Promise.resolve(); }
      var z = E.z;
      return (z ? aprieta(txt).catch(function () { z = false; return txt; }) : Promise.resolve(txt)).then(function (d) {
        var n = Math.max(1, Math.ceil(d.length / TROZO)), p = Promise.resolve();
        for (var i = 0; i < n; i++) {
          (function (i) {
            p = p.then(function () {
              if (!E.vivo) return;
              return manda({ t: 'rr', s: s, i: i, n: n, z: z ? 1 : 0, f: full ? 1 : 0, d: d.slice(i * TROZO, (i + 1) * TROZO) });
            }).then(function () { if (n > 3) return dormir(40); });
          })(i);
        }
        return p;
      });
    }
    function empieza() {
      if (E.rec || !REC) return;
      E.tFull = ahora();
      try {
        E.stop = REC({
          emit: alEvento,
          blockClass: 'rr-block',
          maskInputOptions: { password: true, text: true, search: true, email: true, tel: true, number: true, url: true, textarea: true,
                              select: false, color: false, date: false, 'datetime-local': false, month: false, range: false, time: false, week: false },
          maskInputFn: function (txt, el) { return delicado(el) ? (txt ? '••••••' : '') : txt; },
          slimDOMOptions: 'all', inlineStylesheet: true, recordCanvas: false, collectFonts: false, inlineImages: false,
          recordCrossOriginIframes: false,
          sampling: { mousemove: 50, scroll: 150, media: 800 }   // lo que escribe se ve letra por letra
        });
        E.rec = true;
      } catch (e) {
        E.rec = null;
        hecho(false, 'No se pudo mandar la pantalla del cliente. Qué hacer: que el cliente vuelva a cargar su página y la deje ver otra vez.');
      }
      pinta();
    }
    function para() {
      try { if (E.stop) E.stop(); } catch (e) { /* nada */ }
      E.stop = null; E.rec = null; E.cola = []; E.full = false; clearTimeout(E.timer); E.timer = null;
      pinta();
    }

    // ── lo que pide quien atiende ──
    function nodo(id) {
      if (!REC || !REC.mirror || typeof id !== 'number') return null;
      var n = null;
      try { n = REC.mirror.getNode(id); } catch (e) { n = null; }
      if (n && n.nodeType === 3) n = n.parentElement;
      return n && n.nodeType === 1 && n.isConnected ? n : null;
    }
    function enPunto(x, y) {
      if (typeof x !== 'number' || typeof y !== 'number') return null;
      var el = document.elementFromPoint(x, y);
      return el && !ui.host.contains(el) && el !== ui.host ? el : null;
    }
    function noSePuede(el) { return !el || el === ui.host || (el.closest && el.closest(NO_DEJAR)); }
    function pregunta(txt) {
      return new Promise(function (ok) {
        var v = document.createElement('div'); v.className = 'velo';
        v.innerHTML = '<div class="cf" role="alertdialog" aria-modal="true" aria-labelledby="ev-cf-t"><b id="ev-cf-t"></b><span></span>' +
          '<small>Si no contestas en un minuto, no se pica.</small>' +
          '<div class="ac"><button type="button" class="l" data-r="0">No</button><button type="button" data-r="1">Sí, que lo pique</button></div></div>';
        v.querySelector('b').textContent = E.quien + ' quiere picar «' + txt + '» en tu pantalla.';
        v.querySelector('span').textContent = 'Eso puede cambiar algo de verdad (timbrar, cancelar, borrar, mandar…). ¿Lo dejas?';
        ui.sh.appendChild(v);
        var t = setTimeout(function () { fin(false); }, 60000);
        function fin(si) { clearTimeout(t); v.remove(); document.removeEventListener('keydown', tecla, true); E.pregunta = null; ok(si); }
        function tecla(ev) { if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); fin(false); } }
        document.addEventListener('keydown', tecla, true);
        v.addEventListener('click', function (ev) { var b = ev.target.closest('button[data-r]'); if (b) fin(b.dataset.r === '1'); });
        E.pregunta = { no: function () { fin(false); } };
        setTimeout(function () { try { v.querySelector('[data-r="1"]').focus(); } catch (e) { /* nada */ } }, 30);
      });
    }
    function pica(el) {
      try { el.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) { /* nada */ }
      var r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var op = { bubbles: true, cancelable: true, composed: true, clientX: cx, clientY: cy, view: window, button: 0, buttons: 1 };
      var pp = { pointerId: 1, pointerType: 'mouse', isPrimary: true };
      function ev(T, tipo, extra) {
        try { el.dispatchEvent(new T(tipo, Object.assign({}, op, extra || {}))); } catch (e) { /* nada */ }
      }
      if (typeof PointerEvent === 'function') ev(PointerEvent, 'pointerdown', pp);
      ev(MouseEvent, 'mousedown');
      try { if (escribible(el) || el.tabIndex >= 0) el.focus({ preventScroll: true }); } catch (e) { /* nada */ }
      if (typeof PointerEvent === 'function') ev(PointerEvent, 'pointerup', Object.assign({ buttons: 0 }, pp));
      ev(MouseEvent, 'mouseup', { buttons: 0 });
      if (el instanceof HTMLElement) el.click(); else ev(MouseEvent, 'click', { buttons: 0 });
      anillo(cx, cy);
    }
    function clic(el) {
      if (!E.control) { hecho(false, 'El cliente no te ha dejado mover su pantalla. Qué hacer: pídeselo con «Pedir que me deje moverla».'); return; }
      if (E.pregunta) { hecho(false, 'El cliente todavía no contesta lo de antes. Qué hacer: espera su respuesta.'); return; }
      if (noSePuede(el)) { hecho(false, 'Eso es de la ayuda del cliente: lo pica él. Qué hacer: pídeselo por mensaje.'); return; }
      var fuerte = el.closest && el.closest(ACC_FUERTE), obj = fuerte, txtEl;
      if (!obj) {
        var d = el.closest && el.closest(ACC_DEBIL);
        obj = d && (d.innerText || '').length <= 160 ? d : el;
        txtEl = (el.closest && el.closest('td,th,li')) || el;
      } else txtEl = obj;
      if (noSePuede(obj)) { hecho(false, 'Eso es de la ayuda del cliente: lo pica él. Qué hacer: pídeselo por mensaje.'); return; }
      if (obj.matches && obj.matches('input[type=file]')) {
        hecho(false, 'Escoger un archivo de su computadora lo hace el cliente. Qué hacer: pídele que lo escoja él.'); return;
      }
      if (obj.disabled) { hecho(false, '«' + etiqueta(obj) + '» está apagado en su pantalla. Qué hacer: revisa qué le falta llenar antes.'); return; }
      var txt = etiqueta(txtEl), blanco = fuerte ? obj : el;   // sin botón, el clic va a lo que se picó y sube a su renglón
      if (!peligroso(txtEl, txt)) { pica(blanco); hecho(true, 'Picaste «' + txt + '».'); return; }
      manda({ t: 'pregunta', txt: corto(txt, 60) });
      pregunta(txt).then(function (si) {
        if (!E.vivo) return;
        if (!si) { hecho(false, 'El cliente no dejó picar «' + txt + '». Qué hacer: explícale por mensaje qué hace y pídele que lo pique él.'); return; }
        if (!blanco.isConnected) { hecho(false, '«' + txt + '» ya no está en su pantalla. Qué hacer: vuelve a picarlo en lo que ves ahora.'); return; }
        if (o.alAccion) { try { o.alAccion(txt); } catch (e) { /* nada */ } }
        pica(blanco);
        hecho(true, 'El cliente dejó picar «' + txt + '» y se picó.');
      });
    }
    function escribe(el, v) {
      if (!E.control) { hecho(false, 'El cliente no te ha dejado mover su pantalla. Qué hacer: pídeselo con «Pedir que me deje moverla».'); return; }
      if (E.pregunta) { hecho(false, 'El cliente todavía no contesta lo de antes. Qué hacer: espera su respuesta.'); return; }
      if (noSePuede(el) || !escribible(el)) { hecho(false, 'Ahí no se puede escribir. Qué hacer: pica el campo que quieres llenar.'); return; }
      if (delicado(el)) { hecho(false, 'Ese campo es delicado (contraseñas y claves): lo escribe el cliente. Qué hacer: pídele que lo llene él.'); return; }
      if (el.disabled || el.readOnly) { hecho(false, 'Ese campo no se puede cambiar en su pantalla. Qué hacer: revisa si se llena solo o qué le falta antes.'); return; }
      v = String(v == null ? '' : v).slice(0, 2000);
      try {
        el.focus({ preventScroll: true });
        if (el.tagName === 'SELECT') {
          if (![].some.call(el.options, function (op) { return op.value === v; })) { hecho(false, 'Esa opción ya no está en su lista. Qué hacer: vuelve a escogerla en lo que ves ahora.'); return; }
          el.value = v;
        } else {
          var d = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value');
          if (d && d.set) d.set.call(el, v); else el.value = v;
        }
        el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      } catch (e) {
        hecho(false, 'No se pudo escribir ahí. Qué hacer: pídele al cliente que lo escriba él.'); return;
      }
      var r = el.getBoundingClientRect(); anillo(r.left + Math.min(24, r.width / 2), r.top + r.height / 2);
      hecho(true, 'Escribiste en «' + etiqueta(el) + '».');
    }
    function enfocables() {
      return [].filter.call(document.querySelectorAll('a[href],button,input,select,textarea,[tabindex]'), function (x) {
        if (x.disabled || x.tabIndex < 0 || noSePuede(x)) return false;
        var r = x.getBoundingClientRect(); return r.width > 0 && r.height > 0;
      });
    }
    function tecla(k) {
      if (!E.control) { hecho(false, 'El cliente no te ha dejado mover su pantalla. Qué hacer: pídeselo con «Pedir que me deje moverla».'); return; }
      if (E.pregunta) { hecho(false, 'El cliente todavía no contesta lo de antes. Qué hacer: espera su respuesta.'); return; }
      var a = document.activeElement;
      if (!a || a === document.body || noSePuede(a)) a = null;
      if (k === 'Tab') {
        var l = enfocables(), i = a ? l.indexOf(a) : -1, sig = l[(i + 1) % (l.length || 1)];
        if (sig) { try { sig.focus(); } catch (e) { /* nada */ } hecho(true, 'Pasaste a «' + etiqueta(sig) + '».'); }
        return;
      }
      var cod = k === 'Enter' ? 13 : 27, dest = a || document.body;
      var op = { key: k, code: k, keyCode: cod, which: cod, bubbles: true, cancelable: true, composed: true };
      var ok = true;
      try { ok = dest.dispatchEvent(new KeyboardEvent('keydown', op)); } catch (e) { /* nada */ }
      if (k === 'Enter' && ok && a && a.tagName === 'INPUT' && a.form) {
        var b = a.form.querySelector('button[type=submit],input[type=submit],button:not([type])');
        try { dest.dispatchEvent(new KeyboardEvent('keyup', op)); } catch (e) { /* nada */ }
        if (b) { clic(b); return; }
      } else {
        try { dest.dispatchEvent(new KeyboardEvent('keyup', op)); } catch (e) { /* nada */ }
      }
      hecho(true, k === 'Enter' ? 'Diste Enter.' : 'Diste Esc.');
    }
    function desplazable(el, dx, dy) {
      for (var n = el; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
        if (noSePuede(n)) return null;
        var cs = getComputedStyle(n);
        if (dy && /(auto|scroll|overlay)/.test(cs.overflowY) && n.scrollHeight > n.clientHeight + 1) return n;
        if (dx && /(auto|scroll|overlay)/.test(cs.overflowX) && n.scrollWidth > n.clientWidth + 1) return n;
      }
      return null;
    }
    function rueda(x, y, dx, dy) {
      if (!E.control) return;
      dx = Math.max(-2000, Math.min(2000, Number(dx) || 0)); dy = Math.max(-2000, Math.min(2000, Number(dy) || 0));
      var el = enPunto(x, y), s = el && desplazable(el, dx, dy);
      if (s) s.scrollBy(dx, dy); else window.scrollBy(dx, dy);
    }
    function puntero(x, y) {
      if (typeof x !== 'number' || typeof y !== 'number' || x < 0 || y < 0) { ui.pu.classList.remove('on'); return; }
      ui.pu.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
      ui.pu.classList.add('on'); ui.tPu = ahora();
    }

    function alMsg(m) {
      if (!E.vivo || !m || typeof m.t !== 'string') return;
      var t = ahora();
      switch (m.t) {
        case 'hola':
          E.visto = t; E.conAgente = true; E.z = !!m.z && Z;
          if (!E.rec) empieza();
          else if (t - E.tFull > 2000) { E.tFull = t; try { REC.takeFullSnapshot(true); } catch (e) { /* nada */ } }
          mandaEstado(); pinta(); break;
        case 'ping':
          E.visto = t; E.conAgente = true; manda({ t: 'pong' }); pinta(); break;
        case 'ptr': E.visto = t; puntero(m.x, m.y); break;
        case 'senala': E.visto = t; if (typeof m.x === 'number' && typeof m.y === 'number') anillo(m.x, m.y); break;
        case 'clic': E.visto = t; clic(nodo(m.id) || enPunto(m.x, m.y)); break;
        case 'escribe': E.visto = t; escribe(nodo(m.id), m.v); break;
        case 'tecla': E.visto = t; if (m.k === 'Enter' || m.k === 'Escape' || m.k === 'Tab') tecla(m.k); break;
        case 'rueda': E.visto = t; rueda(m.x, m.y, m.dx, m.dy); break;
        case 'adios': E.conAgente = false; para(); puntero(-1, -1); break;
      }
    }
    function alCanal(s) {
      if (!E.vivo) return;
      if (s === 'SUBSCRIBED') { E.listo = true; manda({ t: 'listo' }); mandaEstado(); }
      else if (s === 'CHANNEL_ERROR' || s === 'TIMED_OUT' || s === 'CLOSED') { E.listo = false; E.conAgente = false; }
      pinta();
    }

    var api = {
      pon: function (n) {
        if (!E.vivo || !n) return;
        if (n.quien) E.quien = n.quien;
        if (typeof n.control === 'boolean' && n.control !== E.control) { E.control = n.control; if (!n.control && E.pregunta) E.pregunta.no(); mandaEstado(); }
        if (typeof n.pideControl === 'boolean') E.pideControl = n.pideControl && !E.control;
        pinta();
      },
      fin: function (sinAdios) {
        if (!E.vivo) return;
        if (!sinAdios) manda({ t: 'adios' });
        para(); E.vivo = false;
        if (E.pregunta) E.pregunta.no();
        clearInterval(E.tick);
        var c = E.canal; E.canal = null;
        setTimeout(function () { if (c) c.cierra(); }, 300);
        ui.barra.hidden = true; ui.pu.classList.remove('on'); ui.alClic = null;
        if (ACT_C === api) ACT_C = null;
      },
      activa: function () { return E.vivo; }
    };
    ACT_C = api;
    pinta();
    E.tick = setInterval(function () {
      if (!E.vivo) return;
      var t = ahora();
      if (E.rec && t - E.visto > SIN_AGENTE_MS) { E.conAgente = false; para(); }
      if (ui.pu.classList.contains('on') && t - ui.tPu > 3000) ui.pu.classList.remove('on');
    }, 1000);
    Promise.all([
      carga(lib('rrweb-record.min.js')).then(function () {
        REC = window.rrwebRecord && window.rrwebRecord.record;
        if (!REC) throw new Error('sin rrweb');
        if (E.vivo && E.conAgente && !E.rec) empieza();          // quien atiende ya había llegado
      }),
      abreCanal(o.canal, alMsg, alCanal).then(function (c) { if (!E.vivo) { c.cierra(); return; } E.canal = c; if (E.listo) mandaEstado(); })
    ]).catch(function () {
      if (!E.vivo) return;
      ui.tx.textContent = 'No se pudo conectar la ayuda en vivo. Qué hacer: revisa tu internet; si sigue, termínala y vuelve a dejar ver tu pantalla.';
      ui.tc.textContent = 'No se pudo conectar';
      abre(true);
      if (o.alError) { try { o.alError(); } catch (e) { /* nada */ } }
    });
    return api;
  }

  // ═════════════════════════════════════════ QUIEN ATIENDE (en el CRM) ═══════════════════════════════════════════════
  var CSS_AG = '.ev-marco{position:relative;width:100%;height:100%;min-height:240px;overflow:hidden;display:flex;align-items:center;' +
    'justify-content:center;background:#0f1626;border-radius:10px}' +
    '.ev-caja{position:relative;flex:0 0 auto;box-shadow:0 8px 30px rgba(0,0,0,.45);background:#fff;overflow:hidden}' +
    '.ev-lienzo{position:absolute;left:0;top:0;transform-origin:0 0}' +
    '.ev-rep{position:absolute;left:0;top:0}' +
    '.ev-rep.nuevo{visibility:hidden}' +
    '.ev-rep .replayer-wrapper{position:relative}' +
    '.ev-rep iframe{border:0;display:block;background:#fff}' +
    '.ev-capa{position:absolute;inset:0;cursor:crosshair;touch-action:none}' +
    '.ev-capa.mueve{cursor:pointer}' +
    '.ev-capa.sin{cursor:default}' +
    '.ev-an{position:absolute;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;border:3px solid #F07A1E;pointer-events:none;' +
    'animation:ev-an 1.3s ease-out forwards}' +
    '.ev-an.mv{border-color:#3fd47a}' +
    '@keyframes ev-an{0%{transform:scale(.4);opacity:1}100%{transform:scale(1.5);opacity:0}}' +
    '.ev-espera{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;color:#dfe7f3;' +
    'font-size:15px;line-height:1.45;background:#0f1626}' +
    '.ev-espera[hidden]{display:none}' +
    '.ev-escribe{position:absolute;z-index:2;display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:8px;border-radius:10px;' +
    'background:#fff;color:#1b2333;box-shadow:0 8px 24px rgba(0,0,0,.35);min-width:220px;max-width:min(420px,96%)}' +
    '.ev-escribe input,.ev-escribe select{flex:1 1 180px;min-width:0;font:inherit;font-size:15px;padding:7px 9px;border:1px solid #9aa6b8;border-radius:8px}' +
    '.ev-escribe button{font:inherit;font-size:14px;font-weight:600;padding:7px 12px;min-height:38px;border-radius:8px;border:0;cursor:pointer;background:#1F3864;color:#fff}' +
    '.ev-escribe button.l{background:#fff;color:#1F3864;border:1px solid #1F3864}' +
    '.ev-escribe small{flex-basis:100%;color:#4a5568;font-size:12px}' +
    '.replayer-mouse{z-index:1}';

  // o = {root, canal, quien, alEstado(e)}; e: {canal:'ok'|'error'}, {conectado:bool}, {vista:true}, {control:bool}, {pregunta:txt},
  // {hecho:{ok,txt}}, {fin:true}, {aviso:txt}
  function agente(o) {
    o = o || {};
    var root = o.root;
    if (!root) throw new Error('Falta dónde pintar la pantalla del cliente. Qué hacer: vuelve a cargar la página.');
    if (!document.getElementById('ev-css')) {
      var st = document.createElement('style'); st.id = 'ev-css'; st.textContent = CSS_AG; document.head.appendChild(st);
    }
    root.innerHTML = '<div class="ev-marco"><div class="ev-caja" hidden><div class="ev-lienzo"></div><div class="ev-capa sin"></div></div>' +
      '<div class="ev-espera" role="status" aria-live="polite">Conectando con la pantalla del cliente…</div></div>';
    var marco = root.querySelector('.ev-marco'), caja = root.querySelector('.ev-caja'), lienzo = root.querySelector('.ev-lienzo'),
        capa = root.querySelector('.ev-capa'), espera = root.querySelector('.ev-espera');
    var E = {
      canal: null, listo: false, vivo: true, rep: null, repDiv: null, base: 0, ultT: 0, nEv: 0, tFull: 0, W: 0, H: 0, s: 1,
      sig: null, partes: {}, proc: Promise.resolve(), tHola: 0, vio: false, visto: 0, conectado: null, control: false, ctlCliente: null,
      modo: 'senala',
      ptr: null, tPtr: 0, ruedaX: 0, ruedaY: 0, ruedaDx: 0, ruedaDy: 0, tRueda: null, tick: null, caja: null
    };
    function avisa(x) { if (o.alEstado) { try { o.alEstado(x); } catch (e) { /* nada */ } } }
    function manda(p) { if (E.canal && E.listo) return E.canal.manda(p); return Promise.resolve(); }
    function hola(forzar) {
      var t = ahora();
      if (!forzar && t - E.tHola < 2000) return;
      E.tHola = t; manda({ t: 'hola', z: Z ? 1 : 0 });
    }
    function textoEspera(t) { espera.textContent = t; espera.hidden = false; }

    function escala() {
      var W = E.W || 1280, H = E.H || 800;
      var r = marco.getBoundingClientRect();
      var s = Math.min((r.width - 12) / W, (r.height - 12) / H);
      if (!(s > 0)) s = 1;
      s = Math.min(s, 2);
      E.s = s;
      caja.style.width = Math.round(W * s) + 'px'; caja.style.height = Math.round(H * s) + 'px';
      lienzo.style.width = W + 'px'; lienzo.style.height = H + 'px';
      lienzo.style.transform = 'scale(' + s + ')';
      if (E.caja) cierraCaja();
    }
    var ro = typeof ResizeObserver === 'function' ? new ResizeObserver(escala) : null;
    if (ro) ro.observe(marco); else window.addEventListener('resize', escala);

    // ── pintar la pantalla del cliente ──
    function nuevo(evs) {
      var R = window.rrwebReplay && window.rrwebReplay.Replayer;
      if (!R) return;
      var div = document.createElement('div'); div.className = 'ev-rep' + (E.rep ? ' nuevo' : '');
      lienzo.appendChild(div);
      var rep;
      try {
        rep = new R([], {
          root: div, liveMode: true, mouseTail: false, showWarning: false, showDebug: false, triggerFocus: false,
          UNSAFE_replayCanvas: false, pauseAnimation: false,
          insertStyleRules: ['.rr-block{background:repeating-linear-gradient(45deg,#e6ecf5,#e6ecf5 8px,#f5f7fb 8px,#f5f7fb 16px)!important}']
        });
      } catch (e) { div.remove(); return; }
      var viejo = E.rep, viejoDiv = E.repDiv, listo = false;
      function muestra() {
        if (listo) return; listo = true;
        div.classList.remove('nuevo');
        if (viejo) setTimeout(function () { try { viejo.destroy(); } catch (e) { /* nada */ } if (viejoDiv && viejoDiv.parentNode) viejoDiv.remove(); }, 60);
      }
      rep.on('resize', function (d) {
        if (rep !== E.rep || !d) return;
        E.W = Math.max(200, Math.min(4000, Number(d.width) || 0)); E.H = Math.max(200, Math.min(4000, Number(d.height) || 0));
        escala();
      });
      rep.on('fullsnapshot-rebuilded', function () { if (rep === E.rep) muestra(); });
      setTimeout(muestra, 1500);
      E.rep = rep; E.repDiv = div;
      E.base = ahora(); E.ultT = E.base; E.nEv = 0; E.tFull = E.base;
      try { rep.startLive(E.base); } catch (e) { /* nada */ }
      agrega(evs);
      caja.hidden = false; espera.hidden = true;
      if (!E.vio) { E.vio = true; avisa({ vista: true }); }
    }
    function agrega(evs) {
      if (!E.rep || !evs.length) return;
      var t0 = ahora(), L = Number(evs[evs.length - 1] && evs[evs.length - 1].timestamp) || 0;
      for (var i = 0; i < evs.length; i++) {
        var e = evs[i];
        if (!e || typeof e !== 'object' || typeof e.timestamp !== 'number') continue;
        var t = t0 + 150 - (L - e.timestamp);
        if (t < E.ultT) t = E.ultT;
        if (t <= E.base) t = E.base + 1;
        E.ultT = t; e.timestamp = t;
        try { E.rep.addEvent(e); } catch (x) { /* uno malo no tumba lo demás */ }
        E.nEv++;
      }
      if (E.nEv > 20000 || ahora() - E.tFull > 600000) { E.tFull = ahora(); hola(true); }
    }
    function lote(s, evs, f) {
      if (f) {
        var k = 0;
        for (var i = 0; i < evs.length; i++) if (evs[i] && evs[i].type === 4) { k = i; break; }
        E.sig = s + 1; nuevo(evs.slice(k)); return;
      }
      if (E.sig == null) { hola(); return; }
      if (s === E.sig) { E.sig++; agrega(evs); return; }
      if (s > E.sig) { E.sig = null; hola(); }   // se perdió un pedazo: se pide la pantalla completa otra vez
    }
    function trozo(m) {
      var s = Number(m.s), n = Number(m.n), i = Number(m.i);
      if (!(s >= 0) || !(n >= 1 && n <= 400) || !(i >= 0 && i < n) || typeof m.d !== 'string' || m.d.length > TROZO + 16) return;
      var p = E.partes[s] || (E.partes[s] = { n: n, d: new Array(n), llegaron: 0, z: m.z === 1, f: m.f === 1, t0: ahora() });
      if (p.n !== n || p.d[i] != null) return;
      p.d[i] = m.d; p.llegaron++;
      if (p.llegaron < p.n) return;
      delete E.partes[s];
      var d = p.d.join('');
      E.proc = E.proc.then(function () {
        return (p.z ? afloja(d) : Promise.resolve(d)).then(function (txt) {
          if (!E.vivo || txt.length > 40e6) return;
          var evs = JSON.parse(txt);
          if (Array.isArray(evs)) lote(s, evs, p.f);
        });
      }).catch(function () { E.sig = null; hola(); });
    }
    function alMsg(m) {
      if (!E.vivo || !m || typeof m.t !== 'string') return;
      E.visto = ahora();
      if (E.conectado !== true) { E.conectado = true; avisa({ conectado: true }); }
      switch (m.t) {
        case 'rr': trozo(m); break;
        case 'estado':
          if (typeof m.control === 'boolean' && m.control !== E.ctlCliente) {   // lo que dice el cliente manda
            E.ctlCliente = m.control; E.control = m.control; pintaCapa(); if (!E.control) cierraCaja(); avisa({ control: E.control });
          }
          if (!E.vio) hola(); break;
        case 'listo': E.sig = null; hola(true); break;          // el cliente volvió a cargar su página: su pantalla otra vez
        case 'pregunta': avisa({ pregunta: corto(m.txt, 80) }); break;
        case 'hecho': avisa({ hecho: { ok: !!m.ok, txt: corto(m.txt, 240) } }); break;
        case 'adios':
          E.conectado = false; avisa({ fin: true });
          textoEspera('El cliente dejó de compartir su pantalla.'); caja.hidden = true; break;
      }
    }
    function alCanal(s) {
      if (!E.vivo) return;
      if (s === 'SUBSCRIBED') { E.listo = true; avisa({ canal: 'ok' }); hola(true); }
      else if (s === 'CHANNEL_ERROR' || s === 'TIMED_OUT') {
        E.listo = false; avisa({ canal: 'error' });
        textoEspera('No se pudo conectar con la pantalla del cliente. Qué hacer: revisa tu internet; si sigue, termina y vuelve a pedirle ver su pantalla.');
      } else if (s === 'CLOSED') { E.listo = false; }
    }

    // ── señalar y mover ──
    function pintaCapa() {
      capa.className = 'ev-capa ' + (E.control && E.modo === 'mueve' ? 'mueve' : 'senala');
    }
    function punto(ev) {
      var r = caja.getBoundingClientRect();
      return { x: Math.round((ev.clientX - r.left) / E.s), y: Math.round((ev.clientY - r.top) / E.s) };
    }
    function anillo(x, y, mv) {
      var a = document.createElement('div'); a.className = 'ev-an' + (mv ? ' mv' : '');
      a.style.left = (x * E.s) + 'px'; a.style.top = (y * E.s) + 'px';
      caja.appendChild(a); setTimeout(function () { a.remove(); }, 1400);
    }
    capa.addEventListener('pointermove', function (ev) {
      var p = punto(ev); E.ptr = p;
      var t = ahora();
      if (t - E.tPtr >= 80) { E.tPtr = t; manda({ t: 'ptr', x: p.x, y: p.y }); }
    });
    capa.addEventListener('pointerleave', function () { E.ptr = null; manda({ t: 'ptr', x: -1, y: -1 }); });
    function nodoEn(x, y) {
      var f = E.rep && E.rep.iframe, d = null;
      try { d = f && f.contentDocument; } catch (e) { d = null; }
      if (!d || !d.elementFromPoint) return null;
      var el = d.elementFromPoint(x, y);
      if (!el) return null;
      var id = -1;
      try { id = E.rep.getMirror().getId(el); } catch (e) { id = -1; }
      return { el: el, id: id };
    }
    capa.addEventListener('click', function (ev) {
      if (!E.rep) return;
      var p = punto(ev);
      if (!(E.control && E.modo === 'mueve')) { manda({ t: 'senala', x: p.x, y: p.y }); anillo(p.x, p.y, false); return; }
      var n = nodoEn(p.x, p.y);
      if (!n || n.id < 0) { manda({ t: 'clic', id: -1, x: p.x, y: p.y }); anillo(p.x, p.y, true); return; }
      var el = n.el.closest ? (n.el.closest('input,textarea,select') || n.el) : n.el;
      if (escribible(el)) { abreCaja(el, E.rep.getMirror().getId(el)); return; }
      manda({ t: 'clic', id: n.id, x: p.x, y: p.y }); anillo(p.x, p.y, true);
    });
    capa.addEventListener('wheel', function (ev) {
      if (!(E.control && E.modo === 'mueve')) return;
      ev.preventDefault();
      var p = punto(ev);
      E.ruedaX = p.x; E.ruedaY = p.y; E.ruedaDx += ev.deltaX; E.ruedaDy += ev.deltaY;
      if (E.tRueda) return;
      E.tRueda = setTimeout(function () {
        E.tRueda = null;
        manda({ t: 'rueda', x: E.ruedaX, y: E.ruedaY, dx: Math.round(E.ruedaDx), dy: Math.round(E.ruedaDy) });
        E.ruedaDx = 0; E.ruedaDy = 0;
      }, 60);
    }, { passive: false });

    // escribir en un campo del cliente: una cajita encima del campo
    function cierraCaja() { if (E.caja) { E.caja.remove(); E.caja = null; } }
    function abreCaja(el, id) {
      cierraCaja();
      if (delicado(el) || /^password$/i.test(el.type || '')) {
        avisa({ hecho: { ok: false, txt: 'Ese campo es delicado (contraseñas y claves): lo escribe el cliente. Qué hacer: pídele que lo llene él.' } });
        return;
      }
      var r = el.getBoundingClientRect();
      var b = document.createElement('div'); b.className = 'ev-escribe'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Escribir en su pantalla');
      var campo;
      if (el.tagName === 'SELECT') {
        campo = document.createElement('select');
        [].forEach.call(el.options, function (op) { var x = document.createElement('option'); x.value = op.value; x.textContent = op.textContent; campo.appendChild(x); });
        campo.value = el.value;
      } else {
        campo = document.createElement('input'); campo.type = 'text'; campo.value = el.value || ''; campo.maxLength = 2000;
        campo.setAttribute('aria-label', 'Lo que se escribe en su campo');
      }
      var ok = document.createElement('button'); ok.type = 'button'; ok.textContent = el.tagName === 'SELECT' ? 'Escoger' : 'Escribir';
      var no = document.createElement('button'); no.type = 'button'; no.className = 'l'; no.textContent = '✕'; no.setAttribute('aria-label', 'Cerrar sin escribir');
      var nota = document.createElement('small'); nota.textContent = 'Se escribe en la pantalla del cliente y él lo ve.';
      b.appendChild(campo); b.appendChild(ok); b.appendChild(no); b.appendChild(nota);
      var x = Math.max(4, Math.min(r.left * E.s, caja.clientWidth - 230)), y = (r.bottom * E.s) + 6;
      if (y > caja.clientHeight - 90) y = Math.max(4, r.top * E.s - 96);
      b.style.left = x + 'px'; b.style.top = y + 'px';
      caja.appendChild(b); E.caja = b;
      function enviar() { manda({ t: 'escribe', id: id, v: campo.value }); cierraCaja(); anillo(r.left + 12, r.top + r.height / 2, true); }
      ok.addEventListener('click', enviar);
      no.addEventListener('click', cierraCaja);
      campo.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); enviar(); } else if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); cierraCaja(); }
      });
      setTimeout(function () { try { campo.focus(); if (campo.select) campo.select(); } catch (e) { /* nada */ } }, 20);
    }

    E.tick = setInterval(function () {
      if (!E.vivo) return;
      var t = ahora();
      if (E.listo && (!E.vio || E.sig == null)) hola();       // hasta que llega la pantalla completa
      if (E.listo && E.vio && t - E.visto > 25000) {
        if (E.conectado !== false) { E.conectado = false; avisa({ conectado: false }); }
        if (t - E.tHola > 5000) hola(true);
      }
      Object.keys(E.partes).forEach(function (k) {                 // un pedazo que no llegó: se pide todo otra vez
        if (t - E.partes[k].t0 > 4000) { delete E.partes[k]; E.sig = null; hola(); }
      });
    }, 1000);
    var tPing = setInterval(function () { if (E.vivo && E.listo) manda({ t: 'ping' }); }, 10000);

    var api = {
      control: function (si) { E.control = !!si; pintaCapa(); if (!E.control) cierraCaja(); },
      modo: function (m) { E.modo = m === 'mueve' ? 'mueve' : 'senala'; pintaCapa(); if (E.modo !== 'mueve') cierraCaja(); },
      tecla: function (k) { if (k === 'Enter' || k === 'Escape' || k === 'Tab') manda({ t: 'tecla', k: k }); },
      otraVez: function () { E.sig = null; hola(true); },
      fin: function () {
        if (!E.vivo) return;
        manda({ t: 'adios' });
        E.vivo = false; clearInterval(E.tick); clearInterval(tPing); clearTimeout(E.tRueda);
        if (ro) ro.disconnect(); else window.removeEventListener('resize', escala);
        try { if (E.rep) E.rep.destroy(); } catch (e) { /* nada */ }
        E.rep = null;
        var c = E.canal; E.canal = null;
        setTimeout(function () { if (c) c.cierra(); }, 300);
        root.innerHTML = '';
      }
    };
    pintaCapa(); escala();
    Promise.all([
      carga(lib('rrweb-replay.css'), true),
      carga(lib('rrweb-replay.min.js')).then(function () { if (!(window.rrwebReplay && window.rrwebReplay.Replayer)) throw new Error('sin rrweb'); }),
      abreCanal(o.canal, alMsg, alCanal).then(function (c) { if (!E.vivo) { c.cierra(); return; } E.canal = c; if (E.listo) hola(true); })
    ]).then(function () {
      if (E.vivo && !E.vio) textoEspera('Esperando la pantalla del cliente… En cuanto deje verla, sale aquí.');
    }).catch(function () {
      if (!E.vivo) return;
      textoEspera('No se pudo abrir la pantalla del cliente. Qué hacer: revisa tu internet y vuelve a intentarlo; si sigue, termina y vuelve a pedirle ver su pantalla.');
      avisa({ canal: 'error' });
    });
    return api;
  }

  window.PROFASE_ENVIVO = { cliente: cliente, agente: agente, version: '2026-11-25.2' };
})();
