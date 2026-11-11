/* Portal PROFASE · «Excel de hallazgos» de Reportes (11-nov-2026, pedido de Fernando Cadengo: «les quiero dar un excel que les
   facilite los casos, separados por empresa, tipo de reporte, comentario y estatus, tipo bitácora … si lo genera felipe solo
   le salgan las empresas de él … si lo genera barbosa le salgan todas»; a las preguntas, «1 c, 2 a», «3 c, 4 b y gabo solo
   sus empresas» y «sí, así es»).
   Una sola pieza para Variaciones / Movimientos, Reclasificación de activo fijo y Depuración de CxC / CxP: el mismo botón
   en «Más ▾» de las tres pantallas y el mismo archivo desde cualquiera, con la marca PROFASE y su PDF al lado (data-excel).
   Tres hojas: «Resumen» (por empresa, cuántos casos hay en cada reporte y cuántos pendientes y resueltos), «Bitácora» (un
   renglón por caso, ordenada por empresa y con filtros) y «Comentarios» (toda la plática, un renglón por comentario).
   Entran los casos con estatus o algún comentario; «Resuelto» = Justificado o Modificación Exitosa.
   Qué empresas le salen a cada quien lo decide la base (portal/sql/363_excel_hallazgos.sql, rep_hallazgos(): los contadores
   y Gabo, las suyas; los gerentes, las suyas y las de su equipo; la dirección, la Gerencia Contable y Fernando Cadengo,
   todas; y encima la regla de cada reporte). Aquí solo se arma el archivo: la pieza no lee tablas ni pide otra cosa a la base
   (construir.py, exige_hallazgos_js). Los clientes ocultos de quien entró (js/ocultos.js) no salen, como en la lista, salvo
   con «Verlos por ahora». El nombre de cada cuenta sale de los datos de Variaciones (la pantalla se los da, o se leen de
   datos/var_0 solo al picar el botón y solo si hay casos de Variaciones o Movimientos).

   var b = PROFASE_HALL.boton({clase: 'btn-2', cuentas: function () { return {lista: [[cta, nombre], …], anioBase: 2026}; }});
   MAS.pon([b]);   // en «Más ▾» de la pantalla */
(function () {
  'use strict';
  if (window.PROFASE_HALL) return;

  var TXT = 'Excel de hallazgos';
  var REP = { 'var': 'Variaciones', mov: 'Movimientos', af: 'Activo fijo', car: 'Depuración CxC / CxP' };
  var ORDEN = { 'var': 1, mov: 2, af: 3, car: 4 };
  var EST = { sin_respuesta: 'Sin revisión', consulta: 'Consulta con el Cliente', pend_aprob: 'Consulta con Gerencia',
    modif_quo: 'Modificación QUO', justificado: 'Justificado', resuelto: 'Modificación Exitosa' };
  var EST_ORDEN = ['consulta', 'pend_aprob', 'modif_quo', 'justificado', 'resuelto', 'sin_respuesta'];
  var MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'];
  var MES3 = { ene: 1, feb: 2, mar: 3, abr: 4, may: 5, jun: 6, jul: 7, ago: 8, sep: 9, sept: 9, oct: 10, nov: 11, dic: 12 };

  function estTxt(e) { return EST[e] || EST.sin_respuesta; }
  function resuelto(e) { return e === 'justificado' || e === 'resuelto'; }
  function num(n) { return Number(n || 0).toLocaleString('es-MX'); }
  function dinero(n) {
    var v = Number(n); if (!isFinite(v)) return '';
    return (v < 0 ? '-$' : '$') + Math.abs(v).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function fecha(iso) {
    if (!iso) return null;
    var H = window.PROFASE_HORA;
    if (H && H.excel) return H.excel(iso);
    var d = new Date(iso); return isNaN(d) ? null : d;
  }
  function hoy() {
    var H = window.PROFASE_HORA;
    try { if (H && H.dia) return H.dia(new Date()); } catch (e) { /* abajo */ }
    return new Date().toLocaleDateString('es-MX', { timeZone: 'America/Monterrey', day: 'numeric', month: 'short', year: 'numeric' });
  }
  function hoyArchivo() {
    var p = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Monterrey', year: 'numeric', month: '2-digit', day: '2-digit' })
      .format(new Date());
    return p;
  }
  function ahoraTxt() {
    var H = window.PROFASE_HORA;
    try { if (H && H.fechaHora) return H.fechaHora(new Date()); } catch (e) { /* abajo */ }
    return new Date().toLocaleString('es-MX', { timeZone: 'America/Monterrey', hourCycle: 'h23' });
  }

  /* el nombre de cada cuenta: lo da la pantalla (Variaciones) o se lee de los datos de Variaciones al picar el botón */
  async function desempaca(doc) {
    if (!doc || !doc.b64 || typeof DecompressionStream === 'undefined') return null;
    var bin = Uint8Array.from(atob(doc.b64), function (c) { return c.charCodeAt(0); });
    var st = new Blob([bin]).stream().pipeThrough(new DecompressionStream('gzip'));
    return JSON.parse(await new Response(st).text());
  }
  async function cuentasDe(op) {
    var r = null;
    try { if (op.cuentas) r = op.cuentas(); } catch (e) { r = null; }
    if (!r || !r.lista) {
      try {
        var db = window.claude && window.claude.use ? await window.claude.use('db') : null;
        if (db) {
          var d = await db.doc('datos/var_0').get();
          var j = d && d.exists ? await desempaca(d.data()) : null;
          if (j) r = { lista: j.cuentas || [], anioBase: j.anioBase };
        }
      } catch (e) { r = null; }
    }
    var m = new Map();
    ((r && r.lista) || []).forEach(function (c) { if (c && c[0]) m.set(String(c[0]), String(c[1] || '').trim()); });
    return { nombres: m, anioBase: (r && r.anioBase) || 2026 };
  }

  /* cada caso en palabras: qué es, su periodo (para leer y para ordenar) y su folio fiscal */
  function describe(c, CU) {
    var x = { que: '', per: '', perK: 0, uuid: '' };
    if (c.r === 'var' || c.r === 'mov') {
      var y = c.anio || CU.anioBase, nom = CU.nombres.get(String(c.cta || '')) || '';
      x.que = c.cta ? 'Cuenta ' + c.cta + (nom ? ' ' + nom : '') : String(c.k || '');
      if (c.pago) x.que += ' · pago de la provisión';
      if (c.mes) { x.per = MES[c.mes - 1] + ' ' + y; x.perK = y * 12 + c.mes; }
    } else if (c.r === 'af') {
      var partes = [c.tipo || 'Observación'];
      if (c.concepto) partes.push(String(c.concepto).slice(0, 90));
      if (c.monto != null) partes.push(dinero(c.monto));
      if (c.cp) partes.push(c.cp);
      x.que = partes.join(' · ') + (c.gone ? ' (ya no sale en el reporte)' : '');
      var mk = c.mk || 0;
      if (!mk && c.mes) { var p = String(c.mes).trim().toLowerCase().split(/\s+/); mk = (parseInt(p[1], 10) || 0) * 12 + (MES3[p[0]] || 0); }
      if (mk) { var a = Math.floor((mk - 1) / 12), m = mk - a * 12; x.per = MES[m - 1] + ' ' + a; x.perK = mk; }
      x.uuid = c.uuid || '';
    } else if (c.r === 'car') {
      if (!c.k) x.que = 'La empresa completa';
      else x.que = 'Factura' + (c.folio ? ' ' + c.folio : '') + (c.cp ? ' · ' + c.cp : '');
      x.uuid = c.uuid || '';
    }
    return x;
  }

  async function genera(op, b) {
    var MK = window.PROFASE_MARCA, P = window.PORTAL;
    if (!MK || !P || !P.sb) return 'Entra al portal para bajar el Excel';
    var q = await P.sb.rpc('rep_hallazgos');
    // mientras la base todavía no tiene la puerta (se publica la página antes de que corra su SQL), un aviso claro
    if (q.error && (q.error.code === 'PGRST202' || /rep_hallazgos/.test(q.error.message || ''))) {
      return 'El Excel de hallazgos se está terminando de instalar; vuelve a intentar en un rato';
    }
    if (q.error || !q.data || !q.data.ok) return 'No se pudo leer los casos; vuelve a intentar en unos minutos';
    var D = q.data, E = D.empresas || {};
    // los clientes ocultos de quien entró no salen (salvo con «Verlos por ahora»), como en la lista
    var OC = window.PROFASE_OCULTOS, ocultos = new Set();
    if (OC) { try { await OC.carga(); } catch (e) { /* sin lista */ } }
    var casos = (D.casos || []).filter(function (c) {
      if (OC && OC.es && OC.es(c.rfc)) { ocultos.add(c.rfc); return false; }
      return true;
    });
    if (!casos.length) {
      return ocultos.size ? 'Tus empresas a la vista no tienen casos con estatus o comentario (hay ' + ocultos.size + ' clientes ocultos)'
                          : 'Tus empresas no tienen casos con estatus o comentario todavía';
    }
    var CU = casos.some(function (c) { return c.r === 'var' || c.r === 'mov'; }) ? await cuentasDe(op) : { nombres: new Map(), anioBase: 2026 };
    var emp = function (rfc) { var e = E[rfc] || []; return { razon: e[0] || rfc, grupo: e[1] || '—', cont: e[2] || '' }; };
    casos.forEach(function (c) {
      c.d = describe(c, CU); c.e = emp(c.rfc);
      c.coms = (c.coms || []).slice().sort(function (a, z) { return String(a.en || '').localeCompare(String(z.en || '')); });
    });
    casos.sort(function (a, z) {
      return a.e.grupo.localeCompare(z.e.grupo, 'es') || a.e.razon.localeCompare(z.e.razon, 'es') || a.rfc.localeCompare(z.rfc)
        || (ORDEN[a.r] - ORDEN[z.r]) || (a.d.perK - z.d.perK) || a.d.que.localeCompare(z.d.que, 'es') || String(a.k).localeCompare(String(z.k));
    });

    var EX = await MK.excelJS();
    var wb = MK.libro(EX, 'Hallazgos de Reportes');
    var nombre = (P.perfil && P.perfil.nombre) || '';
    var rol = (P.perfil && P.perfil.rol) || '';
    var alcance = D.todas ? 'Todas las empresas'
      : (rol === 'gerente' ? 'Tus empresas y las de tu equipo' : 'Tus empresas') + ' (' + num(D.mias) + ')';
    var pend = casos.filter(function (c) { return !resuelto(c.est); }).length, res = casos.length - pend;
    var porEst = {}; casos.forEach(function (c) { porEst[c.est] = (porEst[c.est] || 0) + 1; });
    var estLinea = EST_ORDEN.filter(function (e) { return porEst[e]; }).map(function (e) { return estTxt(e) + ': ' + num(porEst[e]); }).join(' · ');
    var lin0 = alcance + (nombre ? ' · ' + nombre : '') + (ocultos.size ? ' · sin ' + num(ocultos.size) + ' clientes ocultos' : '');
    var lin1 = num(casos.length) + ' casos: ' + num(pend) + ' pendientes y ' + num(res) + ' resueltos';
    var lin2 = 'Exportado el ' + ahoraTxt();

    // 1. Resumen: por empresa
    var ws = wb.addWorksheet('Resumen');
    var cols = [['Grupo', 22], ['Empresa', 38], ['RFC', 15], ['Contador asignado', 26], ['Variaciones', 12], ['Movimientos', 13],
      ['Activo fijo', 12], ['Depuración CxC / CxP', 14], ['Pendientes', 12], ['Resueltos', 11], ['Total', 9]];
    cols.forEach(function (c, i) { ws.getColumn(i + 1).width = c[1]; });
    var f0 = MK.encabezado(wb, ws, cols.length, { titulo: 'Hallazgos de Reportes · Resumen por empresa', lineas: [lin0, lin1, estLinea, lin2] });
    cols.forEach(function (c, i) { ws.getCell(f0, i + 1).value = c[0]; });
    MK.cabecera(ws, f0, 1, cols.length);
    var porEmp = [], ix = {};
    casos.forEach(function (c) {
      var g = ix[c.rfc]; if (!g) { g = ix[c.rfc] = { e: c.e, rfc: c.rfc, n: { 'var': 0, mov: 0, af: 0, car: 0 }, p: 0, r: 0 }; porEmp.push(g); }
      g.n[c.r]++; if (resuelto(c.est)) g.r++; else g.p++;
    });
    var tot = { 'var': 0, mov: 0, af: 0, car: 0, p: 0, r: 0 };
    porEmp.forEach(function (g, j) {
      var r = ws.getRow(f0 + 1 + j);
      [g.e.grupo, g.e.razon, g.rfc, g.e.cont, g.n['var'], g.n.mov, g.n.af, g.n.car, g.p, g.r, g.p + g.r]
        .forEach(function (v, i) { r.getCell(i + 1).value = v; });
      for (var k = 5; k <= 11; k++) r.getCell(k).numFmt = '#,##0';
      for (var m = 1; m <= 4; m++) r.getCell(m).alignment = { wrapText: true, vertical: 'top' };
      ['var', 'mov', 'af', 'car'].forEach(function (k) { tot[k] += g.n[k]; }); tot.p += g.p; tot.r += g.r;
    });
    var ult = f0 + porEmp.length;
    if (porEmp.length > 1) {
      ult++;
      var t = ws.getRow(ult);
      ['Total', num(porEmp.length) + ' empresas', '', '', tot['var'], tot.mov, tot.af, tot.car, tot.p, tot.r, tot.p + tot.r]
        .forEach(function (v, i) { t.getCell(i + 1).value = v; });
      for (var k2 = 5; k2 <= 11; k2++) t.getCell(k2).numFmt = '#,##0';
    }
    MK.cuerpo(ws, f0 + 1, ult, 1, cols.length);
    if (porEmp.length > 1) ws.getRow(ult).font = { bold: true };
    ws.views = [{ state: 'frozen', ySplit: f0 }];
    MK.impresion(ws, { repetir: f0 });

    // 2. Bitácora: un renglón por caso, ordenada por empresa y con filtros
    ws = wb.addWorksheet('Bitácora');
    cols = [['Grupo', 20], ['Empresa', 34], ['RFC', 15], ['Contador asignado', 24], ['Reporte', 18], ['Qué es', 48], ['Periodo', 11],
      ['Folio fiscal (UUID)', 38], ['Estatus', 23], ['Pendiente / Resuelto', 13], ['Estatus puesto por', 24], ['Fecha del estatus', 17],
      ['Comentarios', 12], ['Último comentario', 56], ['Comentó', 24], ['Fecha del comentario', 17]];
    cols.forEach(function (c, i) { ws.getColumn(i + 1).width = c[1]; });
    f0 = MK.encabezado(wb, ws, cols.length, { titulo: 'Hallazgos de Reportes · Bitácora', lineas: [lin0, lin1, lin2] });
    cols.forEach(function (c, i) { ws.getCell(f0, i + 1).value = c[0]; });
    MK.cabecera(ws, f0, 1, cols.length);
    casos.forEach(function (c, j) {
      var r = ws.getRow(f0 + 1 + j), u = c.coms.length ? c.coms[c.coms.length - 1] : null;
      [c.e.grupo, c.e.razon, c.rfc, c.e.cont, REP[c.r], c.d.que, c.d.per, c.d.uuid, estTxt(c.est),
        resuelto(c.est) ? 'Resuelto' : 'Pendiente', c.por || '', fecha(c.en), c.coms.length,
        u ? u.t || '' : '', u ? u.q || '' : '', u ? fecha(u.en) : null]
        .forEach(function (v, i) { r.getCell(i + 1).value = v; });
      r.getCell(12).numFmt = 'dd/mm/yyyy hh:mm'; r.getCell(16).numFmt = 'dd/mm/yyyy hh:mm'; r.getCell(13).numFmt = '#,##0';
      for (var k = 1; k <= cols.length; k++) if (k !== 12 && k !== 13 && k !== 16) r.getCell(k).alignment = { wrapText: true, vertical: 'top' };
      r.getCell(12).alignment = r.getCell(13).alignment = r.getCell(16).alignment = { vertical: 'top' };
    });
    ult = f0 + casos.length;
    MK.cuerpo(ws, f0 + 1, ult, 1, cols.length);
    ws.autoFilter = { from: { row: f0, column: 1 }, to: { row: ult, column: cols.length } };
    ws.views = [{ state: 'frozen', ySplit: f0, xSplit: 2 }];
    MK.impresion(ws, { repetir: f0 });

    // 3. Comentarios: toda la plática, un renglón por comentario
    ws = wb.addWorksheet('Comentarios');
    cols = [['Grupo', 20], ['Empresa', 34], ['RFC', 15], ['Reporte', 18], ['Qué es', 44], ['Periodo', 11], ['Estatus actual', 23],
      ['Fecha y hora', 17], ['Quién', 24], ['Comentario', 70], ['Cambio de estatus', 30]];
    cols.forEach(function (c, i) { ws.getColumn(i + 1).width = c[1]; });
    var coms = [];
    casos.forEach(function (c) { c.coms.forEach(function (m) { coms.push([c, m]); }); });
    f0 = MK.encabezado(wb, ws, cols.length, { titulo: 'Hallazgos de Reportes · Comentarios',
      lineas: [lin0, num(coms.length) + ' comentarios de ' + num(casos.filter(function (c) { return c.coms.length; }).length) + ' casos', lin2] });
    cols.forEach(function (c, i) { ws.getCell(f0, i + 1).value = c[0]; });
    MK.cabecera(ws, f0, 1, cols.length);
    coms.forEach(function (x, j) {
      var c = x[0], m = x[1], r = ws.getRow(f0 + 1 + j);
      var cambio = m.de && m.a && m.de !== m.a ? estTxt(m.de) + ' → ' + estTxt(m.a) : '';
      [c.e.grupo, c.e.razon, c.rfc, REP[c.r], c.d.que, c.d.per, estTxt(c.est), fecha(m.en), m.q || '',
        (m.t || '') + (m.ed ? ' (editado)' : ''), cambio]
        .forEach(function (v, i) { r.getCell(i + 1).value = v; });
      r.getCell(8).numFmt = 'dd/mm/yyyy hh:mm';
      for (var k = 1; k <= cols.length; k++) if (k !== 8) r.getCell(k).alignment = { wrapText: true, vertical: 'top' };
      r.getCell(8).alignment = { vertical: 'top' };
    });
    ult = f0 + Math.max(coms.length, 1);
    if (!coms.length) ws.getCell(f0 + 1, 1).value = 'Sin comentarios en estos casos';
    MK.cuerpo(ws, f0 + 1, ult, 1, cols.length);
    if (coms.length) ws.autoFilter = { from: { row: f0, column: 1 }, to: { row: ult, column: cols.length } };
    ws.views = [{ state: 'frozen', ySplit: f0 }];
    MK.impresion(ws, { repetir: f0 });

    await MK.guardar(wb, 'Hallazgos de Reportes ' + hoyArchivo() + '.xlsx');
    return null;
  }

  function boton(op) {
    op = op || {};
    var b = document.createElement('button');
    b.type = 'button'; b.className = op.clase || 'btn'; b.textContent = TXT;
    b.setAttribute('data-excel', TXT);   // js/marca.js le pone al lado su «PDF de hallazgos»
    b.title = 'Los casos con estatus o comentario de Variaciones, Movimientos, Activo fijo y Depuración CxC / CxP de tus empresas, '
      + 'en un solo archivo: resumen por empresa, bitácora y comentarios';
    var ocupado = false;
    b.addEventListener('click', async function () {
      if (ocupado) return;
      ocupado = true; b.disabled = true; b.textContent = 'Preparando…';
      var msg = null;
      try { msg = await genera(op, b); } catch (e) { msg = e && e.code === 'declined' ? 'Descarga cancelada' : 'No se pudo armar el Excel'; }
      ocupado = false; b.disabled = false;
      b.textContent = msg ? TXT : 'Descargado ✓';
      if (msg) { try { if (window.PORTAL && window.PORTAL.toast) window.PORTAL.toast(msg); else window.alert(msg); } catch (e) { /* nada */ } }
      setTimeout(function () { b.textContent = TXT; }, 2200);
    });
    return b;
  }

  window.PROFASE_HALL = { boton: boton, _describe: describe, _hoy: hoy };
})();
