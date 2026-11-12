/* Portal PROFASE · «Excel de hallazgos» de Reportes (11-nov-2026, pedido de Fernando Cadengo: «les quiero dar un excel que les
   facilite los casos, separados por empresa, tipo de reporte, comentario y estatus, tipo bitácora … si lo genera felipe solo
   le salgan las empresas de él … si lo genera barbosa le salgan todas»; a las preguntas, «1 c, 2 a», «3 c, 4 b y gabo solo
   sus empresas» y «sí, así es»).
   Una sola pieza para Variaciones / Movimientos, Reclasificación de activo fijo y Depuración de CxC / CxP: el mismo botón
   en «Más ▾» de las tres pantallas y el mismo archivo desde cualquiera, con la marca PROFASE y su PDF al lado (data-excel).
   Cuatro hojas: «Resumen» (por empresa, cuántos casos hay en cada reporte, cuántos pendientes y resueltos y cuántas
   aplicaciones), «Bitácora» (un renglón por caso, ordenada por empresa y con filtros), «Comentarios» (toda la plática, un
   renglón por comentario) y «Aplicaciones» (367, el mismo día: «1 b, 2 b» y «sí, así es»: cada relación factura–anticipo o
   nota de crédito marcada «Aplicada» en Depuración CxC / CxP, con su monto, si fue a mano o con «Agotar», quién y cuándo;
   el CRM no sabe si ya se hizo en QUO). Entran los casos con estatus o algún comentario; «Resuelto» = Justificado o
   Modificación Exitosa. Una factura de la Cartera que está cancelada y todavía sigue en el Tablero QUO o en su cartera lo
   dice en «Qué es» (la base la marca con la regla de la pestaña «Canceladas»; lo reservado del SAT, solo a la dirección).
   Qué empresas le salen a cada quien lo decide la base (portal/sql/363_excel_hallazgos.sql, rep_hallazgos(): los contadores
   y Gabo, las suyas; los gerentes, las suyas y las de su equipo; la dirección, la Gerencia Contable y Fernando Cadengo,
   todas; y encima la regla de cada reporte). Aquí solo se arma el archivo: la pieza no lee tablas ni pide otra cosa a la base
   (construir.py, exige_hallazgos_js). Los clientes ocultos de quien entró (js/ocultos.js) no salen, como en la lista, salvo
   con «Verlos por ahora».

   12-nov-2026 (Fernando Cadengo, con el Excel que armó Fernando Barbosa: «1 a, 2 a y b», «3 b, 4 b, sí así es»; 378): además
   de la bitácora general, una hoja por reporte con las columnas de cada pantalla, y las hojas se llaman como las dejó
   Barbosa: «Resumen», «Bitácora general», «Comentarios generales», «Aplicaciones CXP Y CXC», «Bitácora Variación»,
   «Bitácora Movimientos» y «Bitácora Activo fijo». Los casos de Depuración CxC / CxP siguen en la general.
     · Variación: las cifras de la pantalla de Variaciones (variación, mes anterior, mes evaluado y cambio), con su mismo
       cálculo y sus criterios: js/variaciones-calculo.js (una sola versión). La pantalla de Variaciones le da lo que ya
       calculó; desde las otras dos, se lee datos/var_0 y se calcula aquí, solo si hay casos de Variaciones o Movimientos.
     · Movimientos: un renglón por mes revisado, con los 12 meses de esa cuenta en ese año (el movimiento del mes, como
       «Movimiento del mes» de la pantalla) y el mes revisado resaltado.
     · Activo fijo: estado, prioridad, tipo, mes, si es cliente o proveedor (venta o compra), nombre, monto y cuenta.
     · Aplicaciones: solo las marcadas «Aplicada», con su lado, el saldo de la factura, la relación, su estado, el total del
       anticipo o nota, cuánto se aplica, cómo quedaría la factura, lo que le queda al anticipo o nota (demostrativo) y el
       último comentario de la factura en su seguimiento. Esas cifras las calcula la pantalla de Depuración de CxC / CxP
       con el mismo cálculo de su pestaña Aplicaciones (window.__carHallApl de cartera.html): desde ahí se las da; desde
       Variaciones o Activo fijo, la pieza abre esa pantalla por detrás (el marco de la vista, window.top.__carMarco de
       cartera_tab.js; abierta sola, un marco escondido aquí) y le pregunta. Ya no lleva «Cómo se decidió».

   var b = PROFASE_HALL.boton({clase: 'btn-2',
     variaciones: function () { return {B: datos de datos/var_0, D: la bitácora ya calculada}; },   // (Variaciones)
     aplicaciones: function (lista, avance) { return cifras; }});                                   // (Depuración CxC / CxP)
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
  /* (367) la marca de una cancelada que todavía sigue en el Tablero QUO o en su cartera (la pone la base) */
  function cancelada(k) {
    if (!k) return '';
    var en = k.sat && k.cq ? 'en el SAT y en QUO' : k.sat ? 'en el SAT' : k.cq ? 'en QUO' : '';
    var donde = k.tab ? 'sigue en el Tablero QUO: quitarla' : k.car ? 'sigue en su cartera' : '';
    return ' · Cancelada' + (en ? ' ' + en : '') + (donde ? ' · ' + donde : '');
  }
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

  /* los datos de Variaciones: la pantalla de Variaciones los da ya calculados; desde las otras dos se leen de datos/var_0 al
     picar el botón (solo si hay casos de Variaciones o Movimientos) y se calcula la bitácora con la misma pieza que usa esa
     pantalla (js/variaciones-calculo.js, con sus criterios). De ahí salen el nombre de cada cuenta, las cifras de la
     «Bitácora Variación» y los movimientos de la «Bitácora Movimientos». */
  async function datosVar(op) {
    var VC = window.PROFASE_VARCALC, r = null;
    try { if (op.variaciones) r = op.variaciones(); } catch (e) { r = null; }
    if (!r || !r.B) {
      try {
        var db = window.claude && window.claude.use ? await window.claude.use('db') : null;
        if (db && VC) {
          var critP = VC.cargarCriterios();
          var d = await db.doc('datos/var_0').get();
          var B = d && d.exists ? await VC.desempaca(d.data()) : null;
          if (B) r = { B: B, D: B.mov ? VC.construir(B, await critP) : null };
        }
      } catch (e) { r = null; }
    }
    var B2 = r && r.B, D2 = r && r.D, x = { nombres: new Map(), anioBase: (B2 && B2.anioBase) || 2026, filas: new Map(),
      mov: null, cli: new Map(), cta: new Map(), vac: null };
    if (!B2) return x;
    (B2.cuentas || []).forEach(function (c, i) { if (c && c[0]) { x.nombres.set(String(c[0]), String(c[1] || '').trim()); x.cta.set(String(c[0]), i); } });
    (B2.clientes || []).forEach(function (c, i) { if (c && c[1]) x.cli.set(String(c[1]).toUpperCase(), i); });
    // las cifras de cada hallazgo de Variaciones, por su llave (la misma de su seguimiento)
    if (D2 && D2.filas && VC) D2.filas.forEach(function (f) { x.filas.set(String(f[0]).toUpperCase(), VC.cifras(f)); });
    // el movimiento de cada empresa, cuenta y mes, y los meses con balanza de cada empresa (los demás, en blanco)
    if (B2.mov) {
      x.mov = new Map();
      B2.mov.forEach(function (m) { x.mov.set(m[0] + '|' + m[1] + '|' + m[2], m[3]); });
      if (VC) x.vac = VC.mesesVacios(B2);
    }
    return x;
  }

  /* las cifras de las aplicaciones: las calcula la pantalla de Depuración de CxC / CxP con el mismo cálculo de su pestaña
     Aplicaciones. Desde ahí la pantalla da su función; desde Variaciones o Activo fijo se abre esa pantalla por detrás (el
     marco de la vista, que queda listo para cuando la abran; abierta sola, un marco escondido aquí) y se le pregunta. */
  function espera(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  async function carteraPorDetras(aviso) {
    var fr = null;
    try { var T = window.top; if (T && T !== window && typeof T.__carMarco === 'function') fr = T.__carMarco(); } catch (e) { fr = null; }
    if (!fr) {
      fr = document.getElementById('hall-car');
      if (!fr) {
        fr = document.createElement('iframe'); fr.id = 'hall-car'; fr.title = 'Depuración de CxC / CxP (para el Excel de hallazgos)';
        fr.setAttribute('aria-hidden', 'true'); fr.tabIndex = -1;
        fr.style.cssText = 'position:fixed;left:-10000px;top:0;width:1200px;height:800px;border:0;opacity:0;pointer-events:none';
        var v = (location.search.match(/[?&]v=([^&#]+)/) || [])[1];
        fr.src = 'cartera.html' + (v ? '?v=' + v : '');
        document.body.appendChild(fr);
      }
    }
    aviso('Abriendo Depuración de CxC / CxP…');
    for (var hasta = Date.now() + 240000; Date.now() < hasta; await espera(300)) {
      try { var w = fr.contentWindow; if (w && typeof w.__carHallApl === 'function') return w.__carHallApl; } catch (e) { return null; }
    }
    return null;
  }
  async function cifrasApl(op, apls, aviso) {
    if (!apls.length) return [];
    try {
      var f = op.aplicaciones || await carteraPorDetras(aviso);
      if (!f) return null;
      aviso('Calculando aplicaciones…');
      var lista = apls.map(function (c) { return { rfc: c.rfc, uf: c.uf || '', ud: c.ud || '' }; });
      var r = await Promise.race([f(lista, function (n, t) { aviso('Calculando aplicaciones… ' + num(n) + ' de ' + num(t)); }),
        espera(300000).then(function () { return null; })]);
      return r && r.length === apls.length ? r : null;
    } catch (e) { return null; }
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
      else x.que = 'Factura' + (c.folio ? ' ' + c.folio : '') + (c.cp ? ' · ' + c.cp : '') + cancelada(c.can);
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
    var todos = (D.casos || []).filter(function (c) {
      if (OC && OC.es && OC.es(c.rfc)) { ocultos.add(c.rfc); return false; }
      return true;
    });
    // las aplicaciones (367) van en su propia hoja: no son casos con estatus
    var casos = todos.filter(function (c) { return c.r !== 'apl'; }), apls = todos.filter(function (c) { return c.r === 'apl'; });
    if (!casos.length && !apls.length) {
      return ocultos.size ? 'Tus empresas a la vista no tienen casos con estatus o comentario ni aplicaciones (hay ' + ocultos.size + ' clientes ocultos)'
                          : 'Tus empresas no tienen casos con estatus o comentario ni aplicaciones todavía';
    }
    var aviso = function (t) { if (b) b.textContent = t; };
    var CU = { nombres: new Map(), anioBase: 2026, filas: new Map(), mov: null, cli: new Map(), cta: new Map(), vac: null };
    if (casos.some(function (c) { return c.r === 'var' || c.r === 'mov'; })) { aviso('Calculando Variaciones…'); CU = await datosVar(op); }
    var emp = function (rfc) { var e = E[rfc] || []; return { razon: e[0] || rfc, grupo: e[1] || '—', cont: e[2] || '' }; };
    casos.forEach(function (c) {
      c.d = describe(c, CU); c.e = emp(c.rfc);
      c.coms = (c.coms || []).slice().sort(function (a, z) { return String(a.en || '').localeCompare(String(z.en || '')); });
    });
    casos.sort(function (a, z) {
      return a.e.grupo.localeCompare(z.e.grupo, 'es') || a.e.razon.localeCompare(z.e.razon, 'es') || a.rfc.localeCompare(z.rfc)
        || (ORDEN[a.r] - ORDEN[z.r]) || (a.d.perK - z.d.perK) || a.d.que.localeCompare(z.d.que, 'es') || String(a.k).localeCompare(String(z.k));
    });
    apls.forEach(function (c) { c.e = emp(c.rfc); });
    apls.sort(function (a, z) {
      return a.e.grupo.localeCompare(z.e.grupo, 'es') || a.e.razon.localeCompare(z.e.razon, 'es') || a.rfc.localeCompare(z.rfc)
        || String(a.cp || '').localeCompare(String(z.cp || ''), 'es') || String(a.ff || '').localeCompare(String(z.ff || ''), 'es', { numeric: true })
        || String(a.k).localeCompare(String(z.k));
    });

    var CF = await cifrasApl(op, apls, aviso);
    if (CF) apls.forEach(function (c, i) { c.x = CF[i] || {}; });
    aviso('Armando el Excel…');

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
    var lin1 = num(casos.length) + ' casos: ' + num(pend) + ' pendientes y ' + num(res) + ' resueltos'
      + (apls.length ? ' · ' + num(apls.length) + (apls.length === 1 ? ' aplicación por hacer en QUO' : ' aplicaciones por hacer en QUO') : '');
    var lin2 = 'Exportado el ' + ahoraTxt();

    // 1. Resumen: por empresa
    var ws = wb.addWorksheet('Resumen');
    var cols = [['Grupo', 22], ['Empresa', 38], ['RFC', 15], ['Contador asignado', 26], ['Variaciones', 12], ['Movimientos', 13],
      ['Activo fijo', 12], ['Depuración CxC / CxP', 14], ['Pendientes', 12], ['Resueltos', 11], ['Total', 9], ['Aplicaciones', 13]];
    cols.forEach(function (c, i) { ws.getColumn(i + 1).width = c[1]; });
    var f0 = MK.encabezado(wb, ws, cols.length, { titulo: 'Hallazgos de Reportes · Resumen por empresa', lineas: [lin0, lin1, estLinea, lin2] });
    cols.forEach(function (c, i) { ws.getCell(f0, i + 1).value = c[0]; });
    MK.cabecera(ws, f0, 1, cols.length);
    var porEmp = [], ix = {};
    var deEmp = function (c) {
      var g = ix[c.rfc]; if (!g) { g = ix[c.rfc] = { e: c.e, rfc: c.rfc, n: { 'var': 0, mov: 0, af: 0, car: 0 }, p: 0, r: 0, a: 0 }; porEmp.push(g); }
      return g;
    };
    casos.forEach(function (c) { var g = deEmp(c); g.n[c.r]++; if (resuelto(c.est)) g.r++; else g.p++; });
    apls.forEach(function (c) { deEmp(c).a++; });
    porEmp.sort(function (a, z) {
      return a.e.grupo.localeCompare(z.e.grupo, 'es') || a.e.razon.localeCompare(z.e.razon, 'es') || a.rfc.localeCompare(z.rfc);
    });
    var tot = { 'var': 0, mov: 0, af: 0, car: 0, p: 0, r: 0, a: 0 };
    porEmp.forEach(function (g, j) {
      var r = ws.getRow(f0 + 1 + j);
      [g.e.grupo, g.e.razon, g.rfc, g.e.cont, g.n['var'], g.n.mov, g.n.af, g.n.car, g.p, g.r, g.p + g.r, g.a]
        .forEach(function (v, i) { r.getCell(i + 1).value = v; });
      for (var k = 5; k <= 12; k++) r.getCell(k).numFmt = '#,##0';
      for (var m = 1; m <= 4; m++) r.getCell(m).alignment = { wrapText: true, vertical: 'top' };
      ['var', 'mov', 'af', 'car'].forEach(function (k) { tot[k] += g.n[k]; }); tot.p += g.p; tot.r += g.r; tot.a += g.a;
    });
    var ult = f0 + porEmp.length;
    if (porEmp.length > 1) {
      ult++;
      var t = ws.getRow(ult);
      ['Total', num(porEmp.length) + ' empresas', '', '', tot['var'], tot.mov, tot.af, tot.car, tot.p, tot.r, tot.p + tot.r, tot.a]
        .forEach(function (v, i) { t.getCell(i + 1).value = v; });
      for (var k2 = 5; k2 <= 12; k2++) t.getCell(k2).numFmt = '#,##0';
    }
    MK.cuerpo(ws, f0 + 1, ult, 1, cols.length);
    if (porEmp.length > 1) ws.getRow(ult).font = { bold: true };
    ws.views = [{ state: 'frozen', ySplit: f0 }];
    MK.impresion(ws, { repetir: f0 });

    // 2. Bitácora: un renglón por caso, ordenada por empresa y con filtros
    ws = wb.addWorksheet('Bitácora general');
    cols = [['Grupo', 20], ['Empresa', 34], ['RFC', 15], ['Contador asignado', 24], ['Reporte', 18], ['Qué es', 48], ['Periodo', 11],
      ['Folio fiscal (UUID)', 38], ['Estatus', 23], ['Pendiente / Resuelto', 13], ['Estatus puesto por', 24], ['Fecha del estatus', 17],
      ['Comentarios', 12], ['Último comentario', 56], ['Comentó', 24], ['Fecha del comentario', 17]];
    cols.forEach(function (c, i) { ws.getColumn(i + 1).width = c[1]; });
    f0 = MK.encabezado(wb, ws, cols.length, { titulo: 'Hallazgos de Reportes · Bitácora general', lineas: [lin0, lin1, lin2] });
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
    ult = f0 + Math.max(casos.length, 1);
    if (!casos.length) ws.getCell(f0 + 1, 1).value = 'Sin casos con estatus o comentario';
    MK.cuerpo(ws, f0 + 1, ult, 1, cols.length);
    if (casos.length) ws.autoFilter = { from: { row: f0, column: 1 }, to: { row: ult, column: cols.length } };
    ws.views = [{ state: 'frozen', ySplit: f0, xSplit: 2 }];
    MK.impresion(ws, { repetir: f0 });

    // 3. Comentarios: toda la plática, un renglón por comentario
    ws = wb.addWorksheet('Comentarios generales');
    cols = [['Grupo', 20], ['Empresa', 34], ['RFC', 15], ['Reporte', 18], ['Qué es', 44], ['Periodo', 11], ['Estatus actual', 23],
      ['Fecha y hora', 17], ['Quién', 24], ['Comentario', 70], ['Cambio de estatus', 30]];
    cols.forEach(function (c, i) { ws.getColumn(i + 1).width = c[1]; });
    var coms = [];
    casos.forEach(function (c) { c.coms.forEach(function (m) { coms.push([c, m]); }); });
    f0 = MK.encabezado(wb, ws, cols.length, { titulo: 'Hallazgos de Reportes · Comentarios generales',
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

    // 4. Aplicaciones (367; 378: con las columnas que dejó Barbosa): las relaciones marcadas «Aplicada» en Depuración CxC / CxP,
    //    para hacerlas en QUO, con las cifras de la pestaña Aplicaciones (demostrativo) y el último comentario de su factura
    ws = wb.addWorksheet('Aplicaciones CXP Y CXC');
    cols = [['Grupo', 20], ['Empresa', 34], ['RFC', 15], ['Contador asignado', 24], ['Si es cliente o proveedor', 13],
      ['Cliente o proveedor', 32], ['Factura', 14], ['Folio fiscal de la factura', 38], ['Saldo de la factura', 16],
      ['Relación (Sugerida, Automática, Aceptada, Confirmada)', 20], ['Anticipo o nota de crédito', 16],
      ['Su folio fiscal (o número de QUO)', 38], ['Monto a aplicar', 16], ['Lo decidió', 24], ['Comentario', 44], ['Fecha', 17],
      ['Estado de la relación', 26], ['Total del CFDI (anticipo o nota)', 17], ['Se aplica', 15],
      ['Saldo de la factura quedaría (demostrativo)', 18], ['Le queda al anticipo o nota', 17]];
    var MON_A = [9, 13, 18, 19, 20, 21];
    cols.forEach(function (c, i) { ws.getColumn(i + 1).width = c[1]; });
    f0 = MK.encabezado(wb, ws, cols.length, { titulo: 'Hallazgos de Reportes · Aplicaciones CXP Y CXC',
      lineas: [lin0, num(apls.length) + (apls.length === 1 ? ' aplicación marcada' : ' aplicaciones marcadas')
        + ' «Aplicada» en Depuración CxC / CxP', 'El CRM no sabe si ya se hizo en QUO: solo guarda la decisión',
        CF ? 'Las cifras son de la cartera de hoy, como la pestaña Aplicaciones (demostrativo: no cambia saldos en QUO)'
           : (apls.length ? 'Las cifras no se pudieron calcular esta vez: bájalo desde Depuración CxC / CxP' : ''), lin2]
        .filter(Boolean) });
    cols.forEach(function (c, i) { ws.getCell(f0, i + 1).value = c[0]; });
    MK.cabecera(ws, f0, 1, cols.length);
    var mon = function (v) { var n = v == null ? null : Number(v); return n != null && isFinite(n) ? n : null; };
    apls.forEach(function (c, j) {
      var r = ws.getRow(f0 + 1 + j), m = mon(c.m), x = c.x || {};
      [c.e.grupo, c.e.razon, c.rfc, c.e.cont, x.lado || '', c.cp || '', c.ff || '', c.uf || '', mon(x.saldo),
        x.rel || '', c.fd || '', c.ud || '', m != null ? m : 'Lo que alcance', c.por || '', c.com ? c.com.t || '' : '', fecha(c.en),
        x.estado || '', mon(x.total), mon(x.se), mon(x.queda), mon(x.leq)]
        .forEach(function (v, i) { r.getCell(i + 1).value = v; });
      MON_A.forEach(function (k) { r.getCell(k).numFmt = '$#,##0.00'; r.getCell(k).alignment = { vertical: 'top', horizontal: 'right' }; });
      r.getCell(16).numFmt = 'dd/mm/yyyy hh:mm'; r.getCell(16).alignment = { vertical: 'top' };
      for (var k = 1; k <= cols.length; k++) if (MON_A.indexOf(k) < 0 && k !== 16) r.getCell(k).alignment = { wrapText: true, vertical: 'top' };
    });
    ult = f0 + Math.max(apls.length, 1);
    if (!apls.length) ws.getCell(f0 + 1, 1).value = 'Sin aplicaciones marcadas «Aplicada»';
    MK.cuerpo(ws, f0 + 1, ult, 1, cols.length);
    if (apls.length) ws.autoFilter = { from: { row: f0, column: 1 }, to: { row: ult, column: cols.length } };
    ws.views = [{ state: 'frozen', ySplit: f0, xSplit: 2 }];
    MK.impresion(ws, { repetir: f0 });

    // las hojas de cada reporte (378): los casos de la bitácora general de ese reporte, con las columnas de su pantalla
    var deRep = function (k) { return casos.filter(function (c) { return c.r === k; }); };
    var ultCom = function (c) { var u = c.coms.length ? c.coms[c.coms.length - 1] : null; return u ? u.t || '' : ''; };
    var hoja = function (nombre, titulo, cols2, filas, vacio, pinta) {
      var w = wb.addWorksheet(nombre);
      cols2.forEach(function (c, i) { w.getColumn(i + 1).width = c[1]; });
      var g0 = MK.encabezado(wb, w, cols2.length, { titulo: 'Hallazgos de Reportes · ' + titulo,
        lineas: [lin0, num(filas.length) + (filas.length === 1 ? ' caso' : ' casos') + ' de ' + titulo.toLowerCase().replace(/^bitácora /, ''), lin2] });
      cols2.forEach(function (c, i) { w.getCell(g0, i + 1).value = c[0]; });
      MK.cabecera(w, g0, 1, cols2.length);
      filas.forEach(function (c, j) {
        var r = w.getRow(g0 + 1 + j);
        pinta(c, r);
        for (var k = 1; k <= cols2.length; k++) { var x = r.getCell(k); if (!x.alignment) x.alignment = { wrapText: true, vertical: 'top' }; }
      });
      var u2 = g0 + Math.max(filas.length, 1);
      if (!filas.length) w.getCell(g0 + 1, 1).value = vacio;
      MK.cuerpo(w, g0 + 1, u2, 1, cols2.length);
      if (filas.length) w.autoFilter = { from: { row: g0, column: 1 }, to: { row: u2, column: cols2.length } };
      w.views = [{ state: 'frozen', ySplit: g0, xSplit: 2 }];
      MK.impresion(w, { repetir: g0 });
      return w;
    };
    var pone = function (r, vals) { vals.forEach(function (v, i) { r.getCell(i + 1).value = v; }); };
    var dinero2 = function (r, ks) { ks.forEach(function (k) { r.getCell(k).numFmt = '$#,##0.00'; r.getCell(k).alignment = { vertical: 'top', horizontal: 'right' }; }); };

    // 5. Bitácora Variación: las cifras de la pantalla de Variaciones (la misma pieza de cálculo, con sus criterios)
    hoja('Bitácora Variación', 'Bitácora Variación', [['Grupo', 20], ['Empresa', 34], ['Contador', 24], ['Cuenta', 13],
      ['Nombre de cuenta', 32], ['Estatus actual', 23], ['Comentario', 50], ['Mes', 11], ['Variación', 12], ['Mes anterior', 16],
      ['Mes evaluado', 16], ['Cambio', 16]], deRep('var'), 'Sin casos de Variaciones', function (c, r) {
      var f = CU.filas.get(String(c.k || '').toUpperCase()) || null;
      var nom = CU.nombres.get(String(c.cta || '')) || '';
      var vari = !f ? 'Ya no sale en el reporte' : f.cero ? 'desde $0' : (f.v == null || !isFinite(f.v) ? '' : f.v);
      pone(r, [c.e.grupo, c.e.razon, c.e.cont, c.cta || '', nom + (c.pago ? ' · pago de la provisión' : ''), estTxt(c.est), ultCom(c),
        c.d.per, vari, f ? f.ap : null, f ? f.ac : null, f ? f.dif : null]);
      if (typeof vari === 'number') { r.getCell(9).numFmt = '+0%;-0%;0%'; r.getCell(9).alignment = { vertical: 'top', horizontal: 'right' }; }
      dinero2(r, [10, 11, 12]);
    });

    // 6. Bitácora Movimientos: un renglón por mes revisado y los 12 meses de esa cuenta en ese año, con el revisado resaltado
    var MESES_L = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    var movDe = function (c, m) {
      var ci = CU.cli.get(String(c.rfc || '').toUpperCase()), ct = CU.cta.get(String(c.cta || ''));
      var y = c.anio || CU.anioBase, p = y + '-' + String(m).padStart(2, '0');
      if (!CU.mov || ci == null || ct == null) return null;
      if (CU.vac) { var a = CU.vac.primero.get(ci), z = CU.vac.hasta.get(ci); if (!a || p < a || p > z || CU.vac.es(ci, p)) return null; }
      return CU.mov.get(ci + '|' + ct + '|' + p) || 0;
    };
    hoja('Bitácora Movimientos', 'Bitácora Movimientos', [['Grupo', 20], ['Empresa', 34], ['Contador', 24], ['Cuenta', 13],
      ['Nombre de cuenta', 32], ['Mes revisado', 12], ['Estatus actual', 23], ['Comentario', 50]]
      .concat(MESES_L.map(function (m) { return [m + ' (con el movimiento)', 15]; })), deRep('mov'), 'Sin casos de Movimientos', function (c, r) {
      pone(r, [c.e.grupo, c.e.razon, c.e.cont, c.cta || '', CU.nombres.get(String(c.cta || '')) || '', c.d.per, estTxt(c.est), ultCom(c)]
        .concat(MESES_L.map(function (_, i) { return movDe(c, i + 1); })));
      dinero2(r, MESES_L.map(function (_, i) { return 9 + i; }));
      if (c.mes >= 1 && c.mes <= 12) {
        var x = r.getCell(8 + c.mes);
        x.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDE3CC' } };
        x.font = { bold: true, color: { argb: 'FF14233F' } };
      }
    });

    // 7. Bitácora Activo fijo: las columnas de su pantalla
    hoja('Bitácora Activo fijo', 'Bitácora Activo fijo', [['Grupo', 20], ['Empresa', 34], ['Contador', 24], ['Comentario', 50],
      ['Estado', 23], ['Prioridad', 10], ['Tipo de observación', 30], ['Mes', 11], ['Tipo cliente / proveedor', 13], ['Nombre', 32],
      ['Monto MXN', 16], ['Cuenta donde se registró', 30]], deRep('af'), 'Sin casos de Activo fijo', function (c, r) {
      pone(r, [c.e.grupo, c.e.razon, c.e.cont, ultCom(c), estTxt(c.est), c.pr || '', (c.tipo || 'Observación') + (c.gone ? ' (ya no sale en el reporte)' : ''),
        c.d.per, c.lado === 'venta' ? 'Cliente' : c.lado === 'compra' ? 'Proveedor' : '', c.cp || '', mon(c.monto), c.cuenta || '']);
      dinero2(r, [11]);
    });

    await MK.guardar(wb, 'Hallazgos de Reportes ' + hoyArchivo() + '.xlsx');
    return null;
  }

  function boton(op) {
    op = op || {};
    var b = document.createElement('button');
    b.type = 'button'; b.className = op.clase || 'btn'; b.textContent = TXT;
    b.setAttribute('data-excel', TXT);   // js/marca.js le pone al lado su «PDF de hallazgos»
    b.title = 'Los casos con estatus o comentario de Variaciones, Movimientos, Activo fijo y Depuración CxC / CxP de tus empresas, '
      + 'en un solo archivo: resumen por empresa, bitácora general, comentarios, las aplicaciones por hacer en QUO y una bitácora de cada reporte';
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
