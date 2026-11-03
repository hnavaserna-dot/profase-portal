/* Portal PROFASE · bitácora de cambios de un reporte (3-nov-2026, pedido de Fernando Cadengo: «una bitácora de cambios en
   los reportes de cartera, variaciones y activo fijo»; una pestaña en cada reporte).
   Una sola pieza para los tres reportes (la misma pantalla, los mismos filtros y el mismo Excel con su PDF): cada página
   le da sus movimientos ya en palabras; quién ve qué lo decide la base (rep_bitacora() y cartera_bitacora()).

   «Resumen por persona» (3-nov-2026, lo pidió Fernando en la pregunta «bitacora-reportes»; Héctor Daniel Nava, 13:42:
   «sí, los que cadengo te diga; pero si hnr hdn y cadengo»; 14:26: «que cadengo le mueva y te autorice quienes sí»):
   cuántos cambios hizo cada quien esta semana, la semana pasada, este mes o el mes pasado, por tipo de movimiento. Cuenta
   solo los mismos movimientos que la página ya le dio a esa persona (lo que ya ve en esa Bitácora; no pide nada más).
   A quién le sale lo decide la base: rep_bit_resumen_veo() (197_bitacora_por_persona.sql; siempre Héctor Daniel Nava,
   Héctor Nava Ramos y Fernando Cadengo, y a quien Fernando agregue). Es la única llamada de esta pieza a la base.
   Picar a una persona enseña sus movimientos de ese periodo. Su «Resumen en Excel» lleva su PDF al lado.

   var b = PROFASE_BITACORA.crea({
     donde: elemento,                 // aquí se pinta (vacío)
     reporte: 'Variaciones',          // para el título del Excel
     archivo: 'Bitácora Variaciones', // nombre del archivo, sin extensión
     cliente: 'Cliente',              // cómo se llama la columna del cliente
     tipos: [{k:'estatus', t:'Estatus'}, …],      // los botones de «Movimiento»
     carga: async function (desde) { return {filas:[…], mas:false}; }  // desde: 'AAAA-MM-DD' («Todo»: '2000-01-01')
   });
   Cada fila: {id, hora (ISO), quien, tipo (k de tipos), tipoTxt, cliente, rfc, objeto, cambio, detalle, previo, abre()}
   «abre» (opcional): lo abre en su pantalla (botón «Ver»).
   b.recarga()          // vuelve a pedir lo del periodo
   b.nota(texto)        // una nota chica arriba (por ejemplo, de qué es lo nuevo)
   b.vista('res')       // enseña el resumen por persona (si quien entró lo ve); 'mov', los movimientos
   No pregunta sola a la base: solo cuando se abre, al cambiar el periodo y con «Actualizar». Para el resumen pide desde
   el primer día del mes pasado aunque el periodo sea más corto (la lista igual enseña solo lo del periodo). */
(function () {
  'use strict';
  if (window.PROFASE_BITACORA) return;

  var CSS = '.btc{--bt-sf:var(--surface,#FFFFFF);--bt-sf2:var(--surface-2,#EEF1F5);--bt-ln:var(--line,#DDE3EA);'
    + '--bt-ink:var(--ink,var(--fg,#131F2D));--bt-ink2:var(--ink-2,var(--fg-2,#4E5D6E));--bt-mu:var(--ink-3,var(--muted,#7B8A9B));'
    + '--bt-ac:var(--accent,#1F3864);--bt-na:#F07A1E;min-width:0;display:grid;gap:12px;color:var(--bt-ink)}'
    + '.btc *{box-sizing:border-box}'
    + '.btc [hidden]{display:none!important}'
    + '.btc-bar{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end}'
    + '.btc-f{display:grid;gap:4px;min-width:0}'
    + '.btc-f>span{font-size:11px;font-weight:600;color:var(--bt-mu);text-transform:uppercase;letter-spacing:.04em}'
    + '.btc-q{flex:1 1 240px}'
    + '.btc input,.btc select{font:inherit;font-size:13px;color:var(--bt-ink);background:var(--bt-sf);border:1px solid var(--bt-ln);border-radius:8px;padding:7px 10px;min-width:0;width:100%;min-height:36px}'
    + '.btc-seg{display:flex;flex-wrap:wrap;gap:4px;background:var(--bt-sf2);border:1px solid var(--bt-ln);border-radius:9px;padding:3px}'
    + '.btc-seg button{font:inherit;font-size:12.5px;border:0;background:transparent;color:var(--bt-ink2);border-radius:7px;padding:5px 10px;cursor:pointer;min-height:30px}'
    + '.btc-seg button[aria-pressed="true"]{background:var(--bt-sf);color:var(--bt-ink);font-weight:600;box-shadow:0 1px 2px rgba(0,0,0,.12)}'
    + '.btc-acc{display:flex;flex-wrap:wrap;gap:8px;align-items:center}'
    + '.btc-btn{font:inherit;font-size:12.5px;font-weight:600;border:1px solid var(--bt-ln);background:var(--bt-sf);color:var(--bt-ink);border-radius:8px;padding:7px 12px;cursor:pointer;min-height:34px}'
    + '.btc-btn:disabled{opacity:.6;cursor:default}'
    + '.btc-cuenta{font-size:12.5px;color:var(--bt-mu)}'
    + '.btc-nota{font-size:12.5px;color:var(--bt-ink2);border-left:3px solid var(--bt-na);background:var(--bt-sf2);border-radius:6px;padding:8px 11px}'
    + '.btc-rango{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;font-size:12.5px;color:var(--bt-ink2);background:var(--bt-sf2);border:1px solid var(--bt-ln);border-radius:9px;padding:7px 11px}'
    + '.btc-rango b{color:var(--bt-ink);font-weight:600}'
    + '.btc-rango button{margin-left:auto;font:inherit;font-size:12px;font-weight:600;border:0;background:none;color:var(--bt-ac);cursor:pointer;padding:2px 4px}'
    + '.btc-lista{display:grid;gap:8px}'
    + '.btc-it{border:1px solid var(--bt-ln);border-radius:11px;background:var(--bt-sf);padding:10px 13px;display:grid;gap:4px;min-width:0}'
    + '.btc-it.on{border-color:var(--bt-na);box-shadow:0 0 0 2px rgba(240,122,30,.25)}'
    + '.btc-t{display:flex;flex-wrap:wrap;gap:6px 8px;align-items:center;font-size:13px;font-weight:600;min-width:0}'
    + '.btc-t .o{min-width:0;overflow-wrap:anywhere}'
    + '.btc-p{font-size:11px;font-weight:700;border-radius:999px;padding:2px 8px;background:var(--bt-sf2);color:var(--bt-ink2);border:1px solid var(--bt-ln);white-space:nowrap}'
    + '.btc-l{font-size:12.5px;color:var(--bt-ink2);overflow-wrap:anywhere}'
    + '.btc-l b{color:var(--bt-ink);font-weight:600}'
    + '.btc-pie{display:flex;flex-wrap:wrap;gap:4px 10px;align-items:center;font-size:11.5px;color:var(--bt-mu)}'
    + '.btc-pie .ver{margin-left:auto;font:inherit;font-size:12px;font-weight:600;border:0;background:none;color:var(--bt-ac);cursor:pointer;padding:2px 4px}'
    + '.btc-vacio{font-size:13px;color:var(--bt-mu);padding:18px 4px;text-align:center}'
    + '.btc-mas{justify-self:center}'
    + '.btc-res{display:grid;gap:10px;min-width:0}'
    + '.btc-rtit{font-size:13px;font-weight:600;color:var(--bt-ink2)}'
    + '.btc-tw{overflow-x:auto;-webkit-overflow-scrolling:touch;border:1px solid var(--bt-ln);border-radius:11px;background:var(--bt-sf);min-width:0}'
    + '.btc-tb{width:100%;min-width:0;border-collapse:collapse;font-size:13px}'   // Variaciones y Activo fijo traen table{min-width:1240px/880px}
    + '.btc-tb th{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--bt-mu);text-align:right;padding:9px 12px;border-bottom:1px solid var(--bt-ln);background:var(--bt-sf2);white-space:nowrap}'
    + '.btc-tb td{padding:8px 12px;border-bottom:1px solid var(--bt-ln);text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--bt-ink2)}'
    + '.btc-tb th:first-child,.btc-tb td:first-child{text-align:left;white-space:normal;min-width:150px}'
    + '.btc-tb td.n{font-weight:700;color:var(--bt-ink)}'
    + '.btc-tb td.cero{color:var(--bt-mu)}'
    + '.btc-tb tr.tot td{font-weight:700;color:var(--bt-ink);background:var(--bt-sf2);border-bottom:0}'
    + '.btc-per{font:inherit;font-weight:600;border:0;background:none;color:var(--bt-ac);cursor:pointer;padding:2px 0;text-align:left;overflow-wrap:anywhere}'
    + '.btc-per:hover{text-decoration:underline}'
    + '.btc-pista{font-size:11.5px;color:var(--bt-mu)}'
    + '@media (max-width:700px){.btc input,.btc select{font-size:16px}.btc-q{flex-basis:100%}.btc-tb th,.btc-tb td{padding:8px 9px}.btc-tb th:first-child,.btc-tb td:first-child{min-width:112px}}';

  var PERIODOS = [['30', '30 días'], ['90', '90 días'], ['365', '12 meses'], ['todo', 'Todo']];
  var RESUMEN = [['sem', 'Esta semana'], ['semp', 'Semana pasada'], ['mes', 'Este mes'], ['mesp', 'Mes pasado']];
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var TODO = '2000-01-01';   // «Todo» (sin fecha, la base daría solo los últimos 90 días)
  var norm = function (s) { return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  var mk = function (t, c, x) { var n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; };
  var fh = function (x) {
    try { return window.PROFASE_HORA ? window.PROFASE_HORA.fechaHora(x) : String(x || '').slice(0, 16).replace('T', ' '); } catch (e) { return ''; }
  };
  // el día (AAAA-MM-DD) en hora de Monterrey
  var diaDe = function (x) {
    try { return window.PROFASE_HORA ? window.PROFASE_HORA.dia(x) : new Date(x).toISOString().slice(0, 10); } catch (e) { return ''; }
  };
  var hoy = function () { return diaDe(new Date()); };
  var masDias = function (d, n) { var x = new Date(d + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
  var desdeDe = function (p) { return p === 'todo' ? TODO : masDias(hoy(), -(+p)); };
  var num = function (n) { return Number(n || 0).toLocaleString('es-MX'); };

  // La semana va de lunes a domingo; el mes, del día 1 al último
  function rangoDe(k) {
    var h = hoy(), dw = new Date(h + 'T12:00:00Z').getUTCDay(), lun = masDias(h, -((dw + 6) % 7)), m1 = h.slice(0, 8) + '01';
    if (k === 'sem') return { de: lun, a: h };
    if (k === 'semp') return { de: masDias(lun, -7), a: masDias(lun, -1) };
    if (k === 'mes') return { de: m1, a: h };
    var fin = masDias(m1, -1);
    return { de: fin.slice(0, 8) + '01', a: fin };
  }
  function rangoTxt(r) {
    var p = function (d) { return { d: +d.slice(8, 10), m: MESES[+d.slice(5, 7) - 1], y: d.slice(0, 4) }; };
    var a = p(r.de), b = p(r.a);
    if (r.de === r.a) return 'el ' + b.d + ' de ' + b.m + ' de ' + b.y;
    if (a.y !== b.y) return 'del ' + a.d + ' de ' + a.m + ' de ' + a.y + ' al ' + b.d + ' de ' + b.m + ' de ' + b.y;
    if (a.m !== b.m) return 'del ' + a.d + ' de ' + a.m + ' al ' + b.d + ' de ' + b.m + ' de ' + b.y;
    return 'del ' + a.d + ' al ' + b.d + ' de ' + b.m + ' de ' + b.y;
  }
  // desde cuándo hay que pedir para que el resumen salga completo en sus cuatro opciones
  function desdeResumen() {
    return RESUMEN.map(function (x) { return rangoDe(x[0]).de; }).sort()[0];
  }
  // ¿Le sale el resumen a quien entró? Lo decide la base (rep_bit_resumen_veo; la lista la decide Fernando). Una sola
  // pregunta por página: la comparten las bitácoras que se abran. Si la base no contesta, no sale. op.resumen solo lo
  // usan las pruebas.
  var VEO = null;
  function veoResumen(op) {
    if (op.resumen != null) return Promise.resolve(!!op.resumen);
    if (!VEO) {
      VEO = (async function () {
        try {
          var P = window.PORTAL; if (!P) return false;
          if (P.listo && typeof P.listo.then === 'function') await P.listo;   // con la sesión ya puesta
          if (!P.sb) return false;
          var r = await P.sb.rpc('rep_bit_resumen_veo');
          return !r.error && r.data === true;
        } catch (e) { return false; }
      })();
      VEO.then(function (v) { if (!v) VEO = null; });   // un «no» o una falla se vuelve a preguntar la siguiente vez
    }
    return VEO;
  }

  function ponCss() {
    if (document.getElementById('btc-css')) return;
    var s = document.createElement('style'); s.id = 'btc-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  function crea(op) {
    ponCss();
    var S = { periodo: '90', tipo: '', quien: '', q: '', filas: [], mas: false, cargando: false, error: '', ver: 200, nota: '', resalta: null,
      vista: 'mov', rp: 'sem', rango: null };
    var RES = false;   // se prende cuando la base dice que sí (abajo)
    var raiz = mk('div', 'btc');
    op.donde.innerHTML = ''; op.donde.appendChild(raiz);

    // Ver: Movimientos | Resumen por persona (solo a quien la base deja; nace escondido)
    var fv = mk('div', 'btc-f'); fv.appendChild(mk('span', null, 'Ver')); fv.hidden = !RES;
    var sv = mk('div', 'btc-seg'); sv.setAttribute('role', 'group'); sv.setAttribute('aria-label', 'Ver');
    [['mov', 'Movimientos'], ['res', 'Resumen por persona']].forEach(function (x) {
      var b = mk('button', null, x[1]); b.type = 'button'; b.dataset.v = x[0];
      b.onclick = function () { if (S.vista === x[0]) return; S.vista = x[0]; S.ver = 200; pinta(); };
      sv.appendChild(b);
    });
    fv.appendChild(sv); raiz.appendChild(fv);

    var bar = mk('div', 'btc-bar');
    var fq = mk('label', 'btc-f btc-q'); fq.appendChild(mk('span', null, 'Buscar'));
    var iq = mk('input'); iq.type = 'search'; iq.placeholder = op.marcador || 'Cliente, RFC o persona';
    var tq; iq.oninput = function () { clearTimeout(tq); tq = setTimeout(function () { S.q = norm(iq.value.trim()); S.ver = 200; pinta(); }, 200); };
    fq.appendChild(iq); bar.appendChild(fq);

    var fp = mk('div', 'btc-f'); fp.appendChild(mk('span', null, 'Periodo'));
    var sp = mk('div', 'btc-seg'); sp.setAttribute('role', 'group'); sp.setAttribute('aria-label', 'Periodo');
    PERIODOS.forEach(function (p) {
      var b = mk('button', null, p[1]); b.type = 'button'; b.dataset.p = p[0];
      b.onclick = function () { if (S.periodo === p[0] && !S.rango) return; S.periodo = p[0]; S.rango = null; carga(); };
      sp.appendChild(b);
    });
    fp.appendChild(sp); bar.appendChild(fp);

    var fr = mk('div', 'btc-f'); fr.appendChild(mk('span', null, 'Semana o mes'));
    var sr = mk('div', 'btc-seg'); sr.setAttribute('role', 'group'); sr.setAttribute('aria-label', 'Semana o mes');
    RESUMEN.forEach(function (x) {
      var b = mk('button', null, x[1]); b.type = 'button'; b.dataset.r = x[0];
      b.onclick = function () { S.rp = x[0]; pinta(); };
      sr.appendChild(b);
    });
    fr.appendChild(sr); fr.hidden = true;
    bar.appendChild(fr);

    var fw = mk('label', 'btc-f'); fw.appendChild(mk('span', null, 'Quién'));
    var sw = mk('select'); sw.onchange = function () { S.quien = sw.value; S.ver = 200; pinta(); };
    fw.appendChild(sw); bar.appendChild(fw);
    raiz.appendChild(bar);

    var ft = mk('div', 'btc-f'); ft.appendChild(mk('span', null, 'Movimiento'));
    var st = mk('div', 'btc-seg'); st.setAttribute('role', 'group'); st.setAttribute('aria-label', 'Movimiento');
    [{ k: '', t: 'Todos' }].concat(op.tipos || []).forEach(function (x) {
      var b = mk('button', null, x.t); b.type = 'button'; b.dataset.t = x.k;
      b.onclick = function () { S.tipo = x.k; S.ver = 200; pinta(); };
      st.appendChild(b);
    });
    ft.appendChild(st); raiz.appendChild(ft);

    var acc = mk('div', 'btc-acc');
    var cuenta = mk('span', 'btc-cuenta');
    var xl = mk('button', 'btc-btn', 'Bitácora en Excel'); xl.type = 'button'; xl.setAttribute('data-excel', 'Bitácora en Excel');   // marca.js le pone su «PDF» al lado
    xl.onclick = function () { exporta(); };
    var xr = mk('button', 'btc-btn', 'Resumen en Excel'); xr.type = 'button'; xr.setAttribute('data-excel', 'Resumen en Excel'); xr.hidden = true;
    xr.onclick = function () { exportaRes(); };
    var ac = mk('button', 'btc-btn', 'Actualizar'); ac.type = 'button'; ac.onclick = function () { carga(); };
    acc.appendChild(cuenta); acc.appendChild(xl); acc.appendChild(xr); acc.appendChild(ac);
    raiz.appendChild(acc);

    var nota = mk('div', 'btc-nota'); nota.hidden = true; raiz.appendChild(nota);
    // «Solo los de la semana pasada · Quitar»: al picar a una persona en el resumen
    var rch = mk('div', 'btc-rango'); rch.hidden = true; raiz.appendChild(rch);
    var lista = mk('div', 'btc-lista'); raiz.appendChild(lista);
    var resBox = mk('div', 'btc-res'); resBox.hidden = true; raiz.appendChild(resBox);

    var enRes = function () { return RES && S.vista === 'res'; };
    // lo del periodo (o del rango que se escogió en el resumen)
    function delPeriodo() {
      if (S.rango) return S.filas.filter(function (f) { return f._d >= S.rango.de && f._d <= S.rango.a; });
      var d = desdeDe(S.periodo);
      return S.filas.filter(function (f) { return f._d >= d; });
    }
    function pasa(f, conQuien) {
      if (S.tipo && f.tipo !== S.tipo) return false;
      if (conQuien && S.quien && f.quien !== S.quien) return false;
      if (S.q && f._b.indexOf(S.q) < 0) return false;
      return true;
    }
    function filtradas() { return delPeriodo().filter(function (f) { return pasa(f, true); }); }

    function pinta() {
      var R = enRes();
      fv.hidden = !RES;
      sv.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === S.vista)); });
      sp.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(!S.rango && b.dataset.p === S.periodo)); });
      sr.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.r === S.rp)); });
      st.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.t === S.tipo)); });
      fp.hidden = R; fw.hidden = R; fr.hidden = !R;
      xl.hidden = R; xr.hidden = !R;
      lista.hidden = R; resBox.hidden = !R;
      var base = delPeriodo();
      var quienes = Array.from(new Set(base.map(function (f) { return f.quien; }).filter(Boolean))).sort(function (a, b) { return a.localeCompare(b, 'es'); });
      if (S.quien && quienes.indexOf(S.quien) < 0) S.quien = '';
      sw.innerHTML = '';
      [''].concat(quienes).forEach(function (n) { var o = mk('option', null, n || 'Todas las personas'); o.value = n; sw.appendChild(o); });
      sw.value = S.quien;
      nota.hidden = !S.nota; nota.textContent = S.nota;
      rch.hidden = R || !S.rango;
      if (S.rango) {
        rch.innerHTML = '';
        var t = mk('span'); t.appendChild(document.createTextNode('Solo lo de ')); t.appendChild(mk('b', null, S.rango.txt));
        rch.appendChild(t);
        var qb = mk('button', null, 'Quitar'); qb.type = 'button';
        qb.onclick = function () { S.rango = null; S.ver = 200; pinta(); };
        rch.appendChild(qb);
      }
      var caja = R ? resBox : lista;
      lista.innerHTML = ''; resBox.innerHTML = '';
      if (S.cargando) { cuenta.textContent = 'Cargando…'; caja.appendChild(mk('div', 'btc-vacio', 'Cargando la bitácora…')); xl.disabled = true; xr.disabled = true; return; }
      if (S.error) { cuenta.textContent = ''; caja.appendChild(mk('div', 'btc-vacio', S.error)); xl.disabled = true; xr.disabled = true; return; }
      if (R) { pintaResumen(); return; }
      var ls = filtradas();
      xl.disabled = !ls.length;
      cuenta.textContent = ls.length === 1 ? '1 movimiento' : ls.length.toLocaleString('es-MX') + ' movimientos'
        + (S.mas ? ' (los 5,000 más recientes del periodo)' : '');
      if (!ls.length) {
        lista.appendChild(mk('div', 'btc-vacio', S.filas.length ? 'Nada con esos filtros.' : 'No hubo cambios en este periodo.'));
        return;
      }
      ls.slice(0, S.ver).forEach(function (f) { lista.appendChild(tarjeta(f)); });
      if (ls.length > S.ver) {
        var m = mk('button', 'btc-btn btc-mas', 'Ver más (' + (ls.length - S.ver).toLocaleString('es-MX') + ')'); m.type = 'button';
        m.onclick = function () { S.ver += 300; pinta(); };
        lista.appendChild(m);
      }
    }

    function tarjeta(f) {
      var k = mk('div', 'btc-it' + (S.resalta && S.resalta === f.id ? ' on' : ''));
      var t = mk('div', 'btc-t');
      t.appendChild(mk('span', 'btc-p', f.tipoTxt || ''));
      t.appendChild(mk('span', 'o', f.objeto || ''));
      k.appendChild(t);
      var l = function (lab, v) { if (!v) return; var d = mk('div', 'btc-l'); if (lab) d.appendChild(mk('b', null, lab + ': ')); d.appendChild(document.createTextNode(v)); k.appendChild(d); };
      l(op.cliente || 'Cliente', [f.cliente, f.rfc && f.rfc !== f.cliente ? f.rfc : ''].filter(Boolean).join(' · '));
      l('Cambio', f.cambio);
      l('', f.detalle);
      var p = mk('div', 'btc-pie');
      p.appendChild(mk('span', null, (f.quien || 'Alguien del equipo') + ' · ' + fh(f.hora)));
      if (f.previo) p.appendChild(mk('span', null, 'Registrado antes de la bitácora'));
      if (typeof f.abre === 'function') {
        var v = mk('button', 'ver', 'Ver'); v.type = 'button'; v.onclick = function () { f.abre(); }; p.appendChild(v);
      }
      k.appendChild(p);
      return k;
    }

    // ---- Resumen por persona ----
    function resumen() {
      var r = rangoDe(S.rp), lab = RESUMEN.filter(function (x) { return x[0] === S.rp; })[0][1];
      var ls = S.filas.filter(function (f) { return f._d >= r.de && f._d <= r.a && pasa(f, false); });
      var por = {}, tipos = {}, previo = 0;
      ls.forEach(function (f) {
        var q = f.quien || 'Alguien del equipo';
        var x = por[q] || (por[q] = { quien: q, total: 0, por: {}, ult: null });
        x.total++; x.por[f.tipo] = (x.por[f.tipo] || 0) + 1; tipos[f.tipo] = 1;
        if (!x.ult || String(f.hora) > String(x.ult)) x.ult = f.hora;
        if (f.previo) previo++;
      });
      var per = Object.keys(por).map(function (k) { return por[k]; })
        .sort(function (a, b) { return b.total - a.total || a.quien.localeCompare(b.quien, 'es'); });
      // las columnas: los tipos de la página que tuvieron algo (o el que se escogió en «Movimiento»)
      var cols = (op.tipos || []).filter(function (t) { return S.tipo ? t.k === S.tipo : tipos[t.k]; });
      var otros = Object.keys(tipos).filter(function (k) { return !(op.tipos || []).some(function (t) { return t.k === k; }); });
      if (otros.length) cols = cols.concat([{ k: '__otros', t: 'Otros', ks: otros }]);
      return { r: r, lab: lab, total: ls.length, per: per, cols: cols, previo: previo };
    }
    var cuantos = function (x, c) { return c.ks ? c.ks.reduce(function (s, k) { return s + (x.por[k] || 0); }, 0) : (x.por[c.k] || 0); };

    function pintaResumen() {
      var g = resumen();
      xr.disabled = !g.per.length;
      cuenta.textContent = g.per.length
        ? (g.per.length === 1 ? '1 persona' : g.per.length + ' personas') + ' · ' + (g.total === 1 ? '1 movimiento' : num(g.total) + ' movimientos')
        : '';
      resBox.appendChild(mk('div', 'btc-rtit', g.lab + ', ' + rangoTxt(g.r)));
      if (!g.per.length) {
        resBox.appendChild(mk('div', 'btc-vacio', S.tipo || S.q ? 'Nadie hizo cambios con esos filtros en ese periodo.' : 'Nadie hizo cambios en ese periodo.'));
        return;
      }
      var tw = mk('div', 'btc-tw'), tb = mk('table', 'btc-tb'), th = mk('thead'), hr = mk('tr');
      ['Persona', 'Cambios'].concat(g.cols.map(function (c) { return c.t; })).concat(['Último cambio']).forEach(function (t) { hr.appendChild(mk('th', null, t)); });
      th.appendChild(hr); tb.appendChild(th);
      var bd = mk('tbody'), sum = {};
      g.per.forEach(function (x) {
        var tr = mk('tr'), td = mk('td'), b = mk('button', 'btc-per', x.quien); b.type = 'button';
        b.title = 'Ver los movimientos de ' + x.quien + ' (' + g.lab.toLowerCase() + ')';
        b.onclick = function () { verPersona(x.quien, g); };
        td.appendChild(b); tr.appendChild(td);
        tr.appendChild(mk('td', 'n', num(x.total)));
        g.cols.forEach(function (c) { var n = cuantos(x, c); sum[c.k] = (sum[c.k] || 0) + n; tr.appendChild(mk('td', n ? null : 'cero', n ? num(n) : '—')); });
        tr.appendChild(mk('td', null, fh(x.ult)));
        bd.appendChild(tr);
      });
      if (g.per.length > 1) {
        var tt = mk('tr', 'tot');
        tt.appendChild(mk('td', null, 'Total')); tt.appendChild(mk('td', null, num(g.total)));
        g.cols.forEach(function (c) { tt.appendChild(mk('td', null, num(sum[c.k]))); });
        tt.appendChild(mk('td'));
        bd.appendChild(tt);
      }
      tb.appendChild(bd); tw.appendChild(tb); resBox.appendChild(tw);
      resBox.appendChild(mk('div', 'btc-pista', 'Pica un nombre para ver sus movimientos de ese periodo.'));
      if (g.previo) resBox.appendChild(mk('div', 'btc-nota', 'Incluye ' + (g.previo === 1 ? '1 movimiento registrado' : num(g.previo) + ' movimientos registrados')
        + ' antes de la bitácora: de esos días solo quedó el último cambio de cada cosa, así que la cuenta puede ser menor a lo que de verdad se hizo.'));
      if (S.mas) resBox.appendChild(mk('div', 'btc-nota', 'Hubo más de 5,000 movimientos: la cuenta trae solo los más recientes.'));
    }

    function verPersona(q, g) {
      S.vista = 'mov'; S.quien = q === 'Alguien del equipo' ? '' : q; S.ver = 200;
      S.rango = { de: g.r.de, a: g.r.a, txt: g.lab.toLowerCase() + ' (' + rangoTxt(g.r) + ')' };
      pinta();
      try { raiz.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) { /* sin desplazamiento */ }
    }

    async function carga() {
      S.cargando = true; S.error = ''; S.ver = 200; pinta();
      try {
        var d = desdeDe(S.periodo);
        if (RES) { var dr = desdeResumen(); if (dr < d) d = dr; }
        var r = await op.carga(d);
        S.filas = (r && r.filas || []).map(function (f) {
          f._b = norm([f.quien, f.cliente, f.rfc, f.objeto, f.cambio, f.detalle, f.tipoTxt].join(' '));
          f._d = diaDe(f.hora);
          return f;
        });
        S.mas = !!(r && r.mas);
      } catch (e) {
        S.filas = []; S.error = 'No se pudo cargar la bitácora' + (e && e.message ? ': ' + e.message : '') + '. Pica «Actualizar».';
      }
      S.cargando = false; pinta();
    }

    async function exporta() {
      var ls = filtradas(); if (!ls.length) return;
      var MK = window.PROFASE_MARCA; if (!MK) return;
      var antes = xl.textContent; xl.disabled = true; xl.textContent = 'Preparando…';
      try {
        var EX = await MK.excelJS();
        var wb = MK.libro(EX, 'Bitácora · ' + op.reporte);
        var ws = wb.addWorksheet('Bitácora');
        var cols = [['Fecha y hora', 18], ['Quién', 24], [op.cliente || 'Cliente', 34], ['RFC', 15], ['Movimiento', 16],
          ['Qué', 34], ['Cambio', 34], ['Detalle', 40], ['Nota', 22]];
        cols.forEach(function (c, i) { ws.getColumn(i + 1).width = c[1]; });
        var per = S.rango ? S.rango.txt : PERIODOS.filter(function (p) { return p[0] === S.periodo; })[0][1];
        var fil = [S.tipo ? 'Movimiento: ' + ((op.tipos || []).filter(function (x) { return x.k === S.tipo; })[0] || {}).t : '',
          S.quien ? 'Quién: ' + S.quien : '', S.q ? 'Búsqueda: ' + iq.value.trim() : ''].filter(Boolean).join(' · ');
        var f0 = MK.encabezado(wb, ws, cols.length, { titulo: 'Bitácora de cambios · ' + op.reporte,
          lineas: ['Periodo: ' + (S.rango ? per : S.periodo === 'todo' ? 'todo' : 'últimos ' + per) + (fil ? ' · ' + fil : ''),
            'Exportado el ' + fh(new Date()) + ' · ' + ls.length.toLocaleString('es-MX') + ' movimientos'] });
        cols.forEach(function (c, i) { ws.getCell(f0, i + 1).value = c[0]; });
        MK.cabecera(ws, f0, 1, cols.length);
        ls.forEach(function (f, j) {
          var r = ws.getRow(f0 + 1 + j);
          var h = window.PROFASE_HORA ? window.PROFASE_HORA.excel(f.hora) : new Date(f.hora);
          [h, f.quien || '', f.cliente || '', f.rfc || '', f.tipoTxt || '', f.objeto || '', f.cambio || '', f.detalle || '',
            f.previo ? 'Registrado antes de la bitácora' : ''].forEach(function (v, i) { r.getCell(i + 1).value = v; });
          r.getCell(1).numFmt = 'dd/mm/yyyy hh:mm';
          for (var c = 2; c <= cols.length; c++) r.getCell(c).alignment = { wrapText: true, vertical: 'top' };
          r.getCell(1).alignment = { vertical: 'top' };
        });
        MK.cuerpo(ws, f0 + 1, f0 + ls.length, 1, cols.length);
        ws.views = [{ state: 'frozen', ySplit: f0 }];
        MK.impresion(ws, { repetir: f0 });
        await MK.guardar(wb, (op.archivo || 'Bitácora') + '.xlsx');
        xl.textContent = 'Descargado ✓';
      } catch (e) {
        xl.textContent = e && e.code === 'declined' ? 'Descarga cancelada' : 'No se pudo exportar';
      }
      setTimeout(function () { xl.textContent = antes; xl.disabled = !filtradas().length; }, 2200);
    }

    async function exportaRes() {
      var g = resumen(); if (!g.per.length) return;
      var MK = window.PROFASE_MARCA; if (!MK) return;
      var antes = xr.textContent; xr.disabled = true; xr.textContent = 'Preparando…';
      try {
        var EX = await MK.excelJS();
        var wb = MK.libro(EX, 'Resumen por persona · ' + op.reporte);
        var ws = wb.addWorksheet('Resumen por persona');
        var cols = [['Persona', 30], ['Cambios', 11]].concat(g.cols.map(function (c) { return [c.t, 14]; })).concat([['Último cambio', 18]]);
        cols.forEach(function (c, i) { ws.getColumn(i + 1).width = c[1]; });
        var fil = [S.tipo ? 'Movimiento: ' + ((op.tipos || []).filter(function (x) { return x.k === S.tipo; })[0] || {}).t : '',
          S.q ? 'Búsqueda: ' + iq.value.trim() : ''].filter(Boolean).join(' · ');
        var lineas = [g.lab + ', ' + rangoTxt(g.r) + (fil ? ' · ' + fil : ''),
          'Exportado el ' + fh(new Date()) + ' · ' + g.per.length + (g.per.length === 1 ? ' persona · ' : ' personas · ') + num(g.total) + ' movimientos'];
        if (g.previo) lineas.push('Incluye ' + num(g.previo) + ' registrados antes de la bitácora (de esos días solo quedó el último cambio de cada cosa)');
        var f0 = MK.encabezado(wb, ws, cols.length, { titulo: 'Bitácora de cambios · ' + op.reporte + ' · Resumen por persona', lineas: lineas });
        cols.forEach(function (c, i) { ws.getCell(f0, i + 1).value = c[0]; });
        MK.cabecera(ws, f0, 1, cols.length);
        var sum = {};
        g.per.forEach(function (x, j) {
          var r = ws.getRow(f0 + 1 + j);
          var v = [x.quien, x.total].concat(g.cols.map(function (c) { var n = cuantos(x, c); sum[c.k] = (sum[c.k] || 0) + n; return n; }))
            .concat([window.PROFASE_HORA ? window.PROFASE_HORA.excel(x.ult) : new Date(x.ult)]);
          v.forEach(function (y, i) { r.getCell(i + 1).value = y; });
          for (var c = 2; c < cols.length; c++) r.getCell(c).numFmt = '#,##0';
          r.getCell(cols.length).numFmt = 'dd/mm/yyyy hh:mm';
          r.getCell(1).alignment = { wrapText: true, vertical: 'top' };
        });
        var ult = f0 + g.per.length;
        if (g.per.length > 1) {
          ult++;
          var t = ws.getRow(ult);
          [ 'Total', g.total].concat(g.cols.map(function (c) { return sum[c.k] || 0; })).concat(['']).forEach(function (y, i) { t.getCell(i + 1).value = y; });
          for (var k = 2; k < cols.length; k++) t.getCell(k).numFmt = '#,##0';
          t.font = { bold: true };
        }
        MK.cuerpo(ws, f0 + 1, ult, 1, cols.length);
        if (g.per.length > 1) ws.getRow(ult).font = { bold: true };
        ws.views = [{ state: 'frozen', ySplit: f0 }];
        MK.impresion(ws, { repetir: f0 });
        await MK.guardar(wb, (op.archivo || 'Bitácora') + ' - Resumen por persona.xlsx');
        xr.textContent = 'Descargado ✓';
      } catch (e) {
        xr.textContent = e && e.code === 'declined' ? 'Descarga cancelada' : 'No se pudo exportar';
      }
      setTimeout(function () { xr.textContent = antes; xr.disabled = !resumen().per.length; }, 2200);
    }

    // Primero se pregunta si le sale el resumen (así se pide de una vez lo que necesita) y luego se carga
    S.cargando = true; pinta();
    var listo = veoResumen(op).then(function (v) { RES = !!v; if (!RES) S.vista = 'mov'; return carga(); });
    return {
      recarga: carga,
      nota: function (t) { S.nota = t || ''; pinta(); },
      resalta: function (id) { S.resalta = id; pinta(); },
      // desde un aviso (ver:bitacora-resumen): espera a saber si le sale; si no, se queda en los movimientos
      vista: function (v) { return listo.then(function () { if (v === 'res' && !RES) return false; S.vista = v === 'res' ? 'res' : 'mov'; pinta(); return true; }); }
    };
  }

  window.PROFASE_BITACORA = { crea: crea };
})();
