/* Portal PROFASE · «Probar la propuesta»: la vista previa en vivo de las propuestas (2-nov-2026, pedido de Gabo y de
 * Daniel: «Las dos»). Lo usa solo Cambios al portal (cambios.html).
 *
 * La acción «Propuestas» arma, por cada versión de una propuesta, un paquete con su portal ya armado, la base simulada
 * de las pruebas de pantallas y datos inventados, y lo guarda en la cubeta privada «vista_previa» (la ve solo quien ya
 * ve esa propuesta: portal/sql/152_vista_previa.sql). Aquí se baja y se le pasa al MOTOR, que vive en otra dirección
 * (https://hnavaserna-dot.github.io/profase-vista-previa/): ahí corre el código de la propuesta, sin la sesión del
 * portal, sin red y con su base de mentiras. Lo que haga la propuesta ahí no llega al portal ni a la base.
 *
 * Lo que manda el motor es de la propuesta (su código corre en esa dirección): aquí solo se lee como texto («Cargando…»)
 * y se pinta con textContent; nunca se ejecuta ni abre nada. Si el motor intenta irse a otra página, la ventana se cierra.
 */
(function () {
  'use strict';
  var MOTOR = 'https://hnavaserna-dot.github.io/profase-vista-previa/';
  // en las pruebas locales el motor se sirve en la misma máquina (nunca en el portal publicado)
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && window.__VP_MOTOR) MOTOR = String(window.__VP_MOTOR);
  var ORIGEN = new URL(MOTOR).origin;
  var PUESTOS = [['direccion', 'Dirección'], ['gerente', 'Gerente'], ['contador', 'Contador'], ['gabo', 'Gabo']];
  var ANCHOS = [['390', 'Celular'], ['820', 'iPad'], ['0', 'Computadora']];
  var PAQ = {};          // paquetes ya bajados (por ruta): cambiar de puesto no los vuelve a pedir
  var abierta = null;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function vistaDe(p) { var r = (p && p.revision) || {}; var v = r.vista || {}; return v.sha && v.sha === p.sha && v.ruta ? v : null; }

  function estilos() {
    if (document.getElementById('vp-estilos')) return;
    var s = document.createElement('style'); s.id = 'vp-estilos';
    s.textContent = ''
      + '.vp{position:fixed;inset:0;z-index:72;background:var(--bg);display:flex;flex-direction:column}'
      + '.vp[hidden]{display:none!important}'
      + '.vp-cab{background:var(--navy);color:var(--navy-ink);border-bottom:4px solid var(--accent);padding:8px 12px;display:flex;flex-wrap:wrap;gap:8px 10px;align-items:center}'
      + '.vp-cab b{font-family:var(--f-display);font-stretch:85%;font-size:18px;flex:1 1 220px;min-width:0;overflow-wrap:anywhere}'
      + '.vp-cab label{display:flex;gap:6px;align-items:center;font-size:13px;color:var(--band-dim)}'
      + '.vp-cab select{background:var(--surface);color:var(--ink);border:1px solid var(--line-strong);border-radius:8px;min-height:36px;padding:4px 8px;font-size:16px}'
      + '@media(min-width:601px){.vp-cab select{font-size:13.5px}}'
      + '.vp-cab .btn{background:transparent;color:var(--navy-ink);border-color:rgba(255,255,255,.4)}'
      + '.vp-cab .btn:hover{border-color:var(--accent)}'
      + '.vp-nota{background:var(--amber-soft);color:var(--ink);border-bottom:1px solid var(--line);padding:7px 12px;font-size:13px}'
      + '.vp-nota b{color:var(--amber)}'
      + '.vp-edo{padding:6px 12px;font-size:13px;color:var(--muted);min-height:1.4em}'
      + '.vp-edo.mal{color:var(--red);font-weight:600}'
      + '.vp-area{flex:1;min-height:0;overflow:auto;display:flex;justify-content:center;padding:0 8px 8px}'
      + '.vp-area iframe{border:1px solid var(--line-strong);border-radius:12px;background:#fff;height:100%;min-height:420px;width:100%;max-width:100%}'
      + '.vp-area.ancho-390 iframe{width:390px;flex:0 0 390px}.vp-area.ancho-820 iframe{width:820px;flex:0 0 820px}'
      + '@media(max-width:600px){.vp-area{padding:0}.vp-area iframe{border-radius:0;border-left:0;border-right:0}}';
    document.head.appendChild(s);
  }

  /* La tarjeta de la propuesta: «Pruébala en vivo». Solo sale cuando esa versión ya trae su vista previa (la arma la
     acción «Propuestas» en su revisión, si se armó y si el motor ya está publicado). */
  function seccion(p) {
    if (!vistaDe(p)) return '';
    return '<section class="card" id="vp-card"><header><h3>Pruébala en vivo</h3></header><div class="cuerpo">'
      + '<p style="margin:0 0 10px">Ábrela como si ya estuviera publicada y pícale a todo, como dirección, gerente, contador o Gabo, en celular, iPad o computadora. '
      + 'Trae <b>datos inventados</b>: nada de lo que hagas ahí se guarda ni llega al portal.</p>'
      + '<button type="button" class="btn pri" data-vp="abre">Probar la propuesta</button>'
      + ' <span style="color:var(--muted);font-size:12.5px">La primera vez tarda unos segundos en abrir.</span>'
      + '</div></section>';
  }

  function enlaza(p, sb) {
    var b = document.querySelector('#vp-card [data-vp="abre"]');
    if (b) b.onclick = function () { abre(p, sb, b); };
  }

  function token() {
    var a = new Uint8Array(16); crypto.getRandomValues(a);
    return Array.prototype.map.call(a, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
  }

  async function paquete(sb, ruta) {
    if (PAQ[ruta]) return PAQ[ruta];
    var r = await sb.storage.from('vista_previa').download(ruta);
    if (r.error || !r.data) throw new Error('No se pudo bajar la vista previa' + (r.error && r.error.message ? ' (' + r.error.message + ')' : '') + '.');
    PAQ = {}; PAQ[ruta] = await r.data.arrayBuffer();     // solo se guarda el último (pesan varios MB)
    return PAQ[ruta];
  }

  function abre(p, sb, boton) {
    var v = vistaDe(p);
    if (!v || abierta) return;
    estilos();
    var antes = document.activeElement;
    var w = document.createElement('div');
    w.className = 'vp'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', 'Vista previa de la propuesta #' + p.id);
    var celular = (window.innerWidth || 1200) < 700;
    try { celular = celular || (window.top.innerWidth || 1200) < 700; } catch (e) {}
    w.innerHTML = '<div class="vp-cab"><b>Vista previa · #' + esc(p.id) + ' · ' + esc(p.titulo || p.rama) + '</b>'
      + '<label>Como <select data-vp="puesto">' + PUESTOS.map(function (x) { return '<option value="' + x[0] + '"' + (x[0] === 'gerente' ? ' selected' : '') + '>' + x[1] + '</option>'; }).join('') + '</select></label>'
      + (celular ? '' : '<label>En <select data-vp="ancho">' + ANCHOS.map(function (x) { return '<option value="' + x[0] + '"' + (x[0] === '0' ? ' selected' : '') + '>' + x[1] + '</option>'; }).join('') + '</select></label>')
      + '<label><input type="checkbox" data-vp="rec"> Con recorridos</label>'
      + '<button type="button" class="btn" data-vp="cierra">Cerrar</button></div>'
      + '<div class="vp-nota"><b>Vista previa con datos inventados.</b> Nada de lo que hagas aquí se guarda ni llega al portal. Aquí nunca escribas contraseñas ni datos de verdad.</div>'
      + '<div class="vp-edo" aria-live="polite" data-vp="edo">Bajando la propuesta…</div>'
      + '<div class="vp-area"></div>';
    document.body.appendChild(w);
    var area = w.querySelector('.vp-area'), edo = w.querySelector('[data-vp="edo"]');
    var selP = w.querySelector('[data-vp="puesto"]'), selA = w.querySelector('[data-vp="ancho"]'), rec = w.querySelector('[data-vp="rec"]');
    var f = document.createElement('iframe');
    f.title = 'Vista previa de la propuesta #' + p.id;
    f.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
    f.setAttribute('referrerpolicy', 'no-referrer');
    var cargas = 0, hola = false, mandado = false, buf = null;
    function estado(t, mal) { edo.textContent = String(t || '').slice(0, 300); edo.classList.toggle('mal', !!mal); }
    function manda() {
      if (!hola || !buf || mandado) return;
      mandado = true;
      var copia = buf.slice(0);
      f.contentWindow.postMessage({ tipo: 'vp-abre', paquete: copia, puesto: selP.value, recorridos: rec.checked }, ORIGEN, [copia]);
    }
    function alMensaje(e) {
      if (e.origin !== ORIGEN || e.source !== f.contentWindow) return;
      var d = e.data;
      if (!d || typeof d !== 'object') return;
      if (d.tipo === 'vp-hola') { hola = true; manda(); }
      else if (d.tipo === 'vp-estado') {
        var e2 = d.estado === 'listo' ? 'listo' : d.estado === 'error' ? 'error' : 'cargando';
        estado(e2 === 'listo' ? 'Lista. Así se vería con la propuesta publicada (con datos inventados).' : e2 === 'error' ? 'No se pudo abrir: ' + String(d.texto || '') : String(d.texto || 'Cargando…'), e2 === 'error');
      }
    }
    // el motor carga una sola vez; si vuelve a cargar, la propuesta intentó llevarlo a otra página: se cierra
    f.addEventListener('load', function () {
      cargas += 1;
      if (cargas > 1) { cierra(); aviso('La vista previa intentó abrir otra página y se cerró. Coméntaselo a Gabo en la conversación.'); }
    });
    function ancho() { area.className = 'vp-area' + (selA && selA.value !== '0' ? ' ancho-' + selA.value : ''); }
    function puesto() {
      if (!mandado) return;
      estado('Cambiando de puesto…');
      f.contentWindow.postMessage({ tipo: 'vp-puesto', puesto: selP.value, recorridos: rec.checked }, ORIGEN);
    }
    function tecla(e) { if (e.key === 'Escape') { e.preventDefault(); cierra(); } }
    function cierra() {
      removeEventListener('message', alMensaje); document.removeEventListener('keydown', tecla, true);
      if (w.parentNode) w.parentNode.removeChild(w);
      abierta = null;
      try { if (window.PORTAL && PORTAL.escribiendo) PORTAL.escribiendo('vista-previa', false); } catch (e) {}
      try { (boton && document.body.contains(boton) ? boton : antes).focus(); } catch (e) {}
    }
    function aviso(t) {
      try { if (window.PORTAL && PORTAL.toast) { PORTAL.toast(t); return; } } catch (e) {}
      var c = document.getElementById('vp-card'); if (c) { var n = document.createElement('p'); n.style.cssText = 'margin:8px 14px;color:var(--red)'; n.textContent = t; c.appendChild(n); }
    }
    abierta = { cierra: cierra };
    addEventListener('message', alMensaje);
    document.addEventListener('keydown', tecla, true);
    w.querySelector('[data-vp="cierra"]').onclick = cierra;
    selP.onchange = puesto; rec.onchange = puesto;
    if (selA) selA.onchange = ancho;
    ancho();
    // mientras está abierta, ni la versión nueva ni los recorridos ni el cierre temporal la interrumpen
    try { if (window.PORTAL && PORTAL.escribiendo) PORTAL.escribiendo('vista-previa', true); } catch (e) {}
    f.src = MOTOR + '?t=' + token();
    area.appendChild(f);
    w.querySelector('[data-vp="cierra"]').focus();
    paquete(sb, v.ruta).then(function (b) { buf = b; estado('Abriendo la vista previa (la primera vez tarda unos segundos)…'); manda(); },
      function (err) { estado(err && err.message ? err.message : 'No se pudo bajar la vista previa.', true); });
  }

  window.PROFASE_VP = { seccion: seccion, enlaza: enlaza, abierta: function () { return !!abierta; }, cierra: function () { if (abierta) abierta.cierra(); } };
})();
