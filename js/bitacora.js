/* Portal PROFASE · bitácora de cambios de un reporte (3-nov-2026, pedido de Fernando Cadengo: «una bitácora de cambios en
   los reportes de cartera, variaciones y activo fijo»; una pestaña en cada reporte).
   Una sola pieza para los tres reportes (la misma pantalla, los mismos filtros y el mismo Excel con su PDF): cada página
   le da sus movimientos ya en palabras; quién ve qué lo decide la base (rep_bitacora() y cartera_bitacora()).

   var b = PROFASE_BITACORA.crea({
     donde: elemento,                 // aquí se pinta (vacío)
     reporte: 'Variaciones',          // para el título del Excel
     archivo: 'Bitácora Variaciones', // nombre del archivo, sin extensión
     cliente: 'Cliente',              // cómo se llama la columna del cliente
     tipos: [{k:'estatus', t:'Estatus'}, …],      // los botones de «Movimiento»
     carga: async function (desde) { return {filas:[…], mas:false}; }  // desde: 'AAAA-MM-DD' o null (todo)
   });
   Cada fila: {id, hora (ISO), quien, tipo (k de tipos), tipoTxt, cliente, rfc, objeto, cambio, detalle, previo, abre()}
   «abre» (opcional): lo abre en su pantalla (botón «Ver»).
   b.recarga()          // vuelve a pedir lo del periodo
   b.nota(texto)        // una nota chica arriba (por ejemplo, de qué es lo nuevo)
   No pregunta sola a la base: solo cuando se abre, al cambiar el periodo y con «Actualizar». */
(function () {
  'use strict';
  if (window.PROFASE_BITACORA) return;

  var CSS = '.btc{--bt-sf:var(--surface,#FFFFFF);--bt-sf2:var(--surface-2,#EEF1F5);--bt-ln:var(--line,#DDE3EA);'
    + '--bt-ink:var(--ink,var(--fg,#131F2D));--bt-ink2:var(--ink-2,var(--fg-2,#4E5D6E));--bt-mu:var(--ink-3,var(--muted,#7B8A9B));'
    + '--bt-ac:var(--accent,#1F3864);--bt-na:#F07A1E;min-width:0;display:grid;gap:12px;color:var(--bt-ink)}'
    + '.btc *{box-sizing:border-box}'
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
    + '@media (max-width:700px){.btc input,.btc select{font-size:16px}.btc-q{flex-basis:100%}}';

  var PERIODOS = [['30', '30 días'], ['90', '90 días'], ['365', '12 meses'], ['todo', 'Todo']];
  var norm = function (s) { return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  var mk = function (t, c, x) { var n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; };
  var fh = function (x) {
    try { return window.PROFASE_HORA ? window.PROFASE_HORA.fechaHora(x) : String(x || '').slice(0, 16).replace('T', ' '); } catch (e) { return ''; }
  };
  var desdeDe = function (p) {
    if (p === 'todo') return null;
    var hoy = window.PROFASE_HORA ? window.PROFASE_HORA.dia(new Date()) : new Date().toISOString().slice(0, 10);
    var d = new Date(hoy + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() - (+p));
    return d.toISOString().slice(0, 10);
  };

  function ponCss() {
    if (document.getElementById('btc-css')) return;
    var s = document.createElement('style'); s.id = 'btc-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  function crea(op) {
    ponCss();
    var S = { periodo: '90', tipo: '', quien: '', q: '', filas: [], mas: false, cargando: false, error: '', ver: 200, nota: '', resalta: null };
    var raiz = mk('div', 'btc');
    op.donde.innerHTML = ''; op.donde.appendChild(raiz);

    var bar = mk('div', 'btc-bar');
    var fq = mk('label', 'btc-f btc-q'); fq.appendChild(mk('span', null, 'Buscar'));
    var iq = mk('input'); iq.type = 'search'; iq.placeholder = op.marcador || 'Cliente, RFC o persona';
    var tq; iq.oninput = function () { clearTimeout(tq); tq = setTimeout(function () { S.q = norm(iq.value.trim()); S.ver = 200; pinta(); }, 200); };
    fq.appendChild(iq); bar.appendChild(fq);

    var fp = mk('div', 'btc-f'); fp.appendChild(mk('span', null, 'Periodo'));
    var sp = mk('div', 'btc-seg'); sp.setAttribute('role', 'group'); sp.setAttribute('aria-label', 'Periodo');
    PERIODOS.forEach(function (p) {
      var b = mk('button', null, p[1]); b.type = 'button'; b.dataset.p = p[0];
      b.onclick = function () { if (S.periodo === p[0]) return; S.periodo = p[0]; carga(); };
      sp.appendChild(b);
    });
    fp.appendChild(sp); bar.appendChild(fp);

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
    var ac = mk('button', 'btc-btn', 'Actualizar'); ac.type = 'button'; ac.onclick = function () { carga(); };
    acc.appendChild(cuenta); acc.appendChild(xl); acc.appendChild(ac);
    raiz.appendChild(acc);

    var nota = mk('div', 'btc-nota'); nota.hidden = true; raiz.appendChild(nota);
    var lista = mk('div', 'btc-lista'); raiz.appendChild(lista);

    function filtradas() {
      return S.filas.filter(function (f) {
        if (S.tipo && f.tipo !== S.tipo) return false;
        if (S.quien && f.quien !== S.quien) return false;
        if (S.q && f._b.indexOf(S.q) < 0) return false;
        return true;
      });
    }

    function pinta() {
      sp.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.p === S.periodo)); });
      st.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.t === S.tipo)); });
      var quienes = Array.from(new Set(S.filas.map(function (f) { return f.quien; }).filter(Boolean))).sort(function (a, b) { return a.localeCompare(b, 'es'); });
      if (S.quien && quienes.indexOf(S.quien) < 0) S.quien = '';
      sw.innerHTML = '';
      [''].concat(quienes).forEach(function (n) { var o = mk('option', null, n || 'Todas las personas'); o.value = n; sw.appendChild(o); });
      sw.value = S.quien;
      nota.hidden = !S.nota; nota.textContent = S.nota;
      lista.innerHTML = '';
      if (S.cargando) { cuenta.textContent = 'Cargando…'; lista.appendChild(mk('div', 'btc-vacio', 'Cargando la bitácora…')); xl.disabled = true; return; }
      if (S.error) { cuenta.textContent = ''; lista.appendChild(mk('div', 'btc-vacio', S.error)); xl.disabled = true; return; }
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

    async function carga() {
      S.cargando = true; S.error = ''; S.ver = 200; pinta();
      try {
        var r = await op.carga(desdeDe(S.periodo));
        S.filas = (r && r.filas || []).map(function (f) {
          f._b = norm([f.quien, f.cliente, f.rfc, f.objeto, f.cambio, f.detalle, f.tipoTxt].join(' '));
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
        var per = PERIODOS.filter(function (p) { return p[0] === S.periodo; })[0][1];
        var fil = [S.tipo ? 'Movimiento: ' + ((op.tipos || []).filter(function (x) { return x.k === S.tipo; })[0] || {}).t : '',
          S.quien ? 'Quién: ' + S.quien : '', S.q ? 'Búsqueda: ' + iq.value.trim() : ''].filter(Boolean).join(' · ');
        var f0 = MK.encabezado(wb, ws, cols.length, { titulo: 'Bitácora de cambios · ' + op.reporte,
          lineas: ['Periodo: ' + (S.periodo === 'todo' ? 'todo' : 'últimos ' + per) + (fil ? ' · ' + fil : ''),
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

    carga();
    return {
      recarga: carga,
      nota: function (t) { S.nota = t || ''; pinta(); },
      resalta: function (id) { S.resalta = id; pinta(); }
    };
  }

  window.PROFASE_BITACORA = { crea: crea };
})();
