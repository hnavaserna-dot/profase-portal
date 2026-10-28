/* Cotizador DECOMSA del portal PROFASE.
   Lee y escribe en las tablas cot_* de la base del portal. Quién entra y quién edita lo decide la base
   (tabla cot_permisos; el director siempre): esta página solo muestra u oculta botones.
   Las horas y fechas se manejan siempre en hora de Monterrey. */
(function () {
  'use strict';

  var TZ = 'America/Monterrey';
  var CADA = 20000;
  var LOGO_SRC = { dec: 'img/decomsa.jpg', pro: 'img/profase-sello.jpg' };
  var LOGO = { dec: null, pro: null };
  var ESTATUS = { borrador: 'Borrador', enviada: 'Enviada', aceptada: 'Aceptada', rechazada: 'Rechazada', vencida: 'Vencida' };
  var REGIMENES = ['601 General de Ley Personas Morales', '603 Personas Morales con Fines no Lucrativos', '605 Sueldos y Salarios',
    '606 Arrendamiento', '607 Enajenación o Adquisición de Bienes', '608 Demás ingresos', '610 Residentes en el Extranjero sin Establecimiento Permanente en México',
    '611 Ingresos por Dividendos', '612 Personas Físicas con Actividades Empresariales y Profesionales', '614 Ingresos por intereses',
    '615 Régimen de los ingresos por obtención de premios', '616 Sin obligaciones fiscales', '620 Sociedades Cooperativas de Producción',
    '621 Incorporación Fiscal', '622 Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras', '623 Opcional para Grupos de Sociedades',
    '624 Coordinados', '625 Plataformas Tecnológicas', '626 Régimen Simplificado de Confianza'];
  var RFC_RE = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var ACCIONES = {
    'cot.crear': ['Cotizaciones', 'Creó cotización'], 'cot.emitir': ['Cotizaciones', 'Emitió cotización'],
    'cot.editar': ['Cotizaciones', 'Editó cotización'], 'cot.corregir': ['Cotizaciones', 'Corrigió cotización ya emitida'],
    'cot.estatus': ['Cotizaciones', 'Cambió estatus'], 'cot.pdf': ['Cotizaciones', 'Descargó PDF'],
    'srv.alta': ['Servicios y precios', 'Agregó servicio'], 'srv.cambio': ['Servicios y precios', 'Cambió servicio'],
    'ase.alta': ['Asesores', 'Agregó asesor'], 'ase.cambio': ['Asesores', 'Cambió asesor'],
    'cli.alta': ['Clientes', 'Agregó cliente'], 'cli.cambio': ['Clientes', 'Editó cliente'], 'cli.baja': ['Clientes', 'Eliminó cliente'],
    'aj.cambio': ['Ajustes', 'Cambió ajustes'], 'bk.descarga': ['Respaldos', 'Descargó respaldo']
  };
  var ACC_COT = { 'cot.crear': 'Creada', 'cot.emitir': 'Emitida', 'cot.editar': 'Editada', 'cot.corregir': 'Corregida después de emitida', 'cot.pdf': 'PDF descargado' };

  // ================= Utilidades =================
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(s) { return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/\s+/g, ' ').trim(); }
  function copia(o) { return JSON.parse(JSON.stringify(o)); }
  function cents(x) { return Math.round((Number(x) || 0) * 100 + 1e-7); }
  var MXN = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function money(x) { return MXN.format(cents(x) / 100); }
  function pct(x) { return ((Number(x) || 0) * 100).toFixed(1) + '%'; }
  function hoyISO() { return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
  function fdate(iso) { if (!iso) return ''; var p = String(iso).slice(0, 10).split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
  function addDays(iso, n) {
    if (!iso) return '';
    var p = String(iso).slice(0, 10).split('-').map(Number);
    return new Date(Date.UTC(p[0], p[1] - 1, p[2] + (Number(n) || 0))).toISOString().slice(0, 10);
  }
  function fmtDT(iso) { return iso ? new Date(iso).toLocaleString('es-MX', { timeZone: TZ, dateStyle: 'short', timeStyle: 'short' }) : ''; }
  function mesTxt(m) { var p = String(m).split('-'); return MESES[Number(p[1]) - 1] + ' ' + p[0]; }
  function mesSig(m) { var p = m.split('-').map(Number); return p[1] === 12 ? (p[0] + 1) + '-01' : p[0] + '-' + String(p[1] + 1).padStart(2, '0'); }
  function corto(v, n) { var t = String(v == null ? '' : v); n = n || 120; return t.length > n ? t.slice(0, n - 1) + '…' : t; }
  function cantTxt(it) { var n = Number(it.cantidad) || 0; return it.tipo === 'mensual' ? n + ' ' + (n === 1 ? 'mes' : 'meses') : String(n); }
  function folioTxt(q) { return (q.prefijo || 'DEC') + ' - ' + (q.folio == null ? '____' : q.folio); }
  function nombreArchivo(t) { return String(t).replace(/[\\/:*?"<>|]/g, ' ').replace(/\s+/g, ' ').trim(); }
  var toastT;
  function toast(msg, ms) { var t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, ms || 3400); }
  function setSync(s, txt) { var e = $('#sync'); e.dataset.s = s; e.textContent = txt; }
  function mensajeError(e, def) {
    var m = (e && e.message) || '';
    if (/Failed to fetch|NetworkError|network/i.test(m)) return 'Sin conexión. Revisa tu internet e intenta de nuevo.';
    if (e && e.code === '23505') return 'Ya existe un registro con ese dato (por ejemplo, el mismo RFC).';
    if (e && (e.code === '42501' || /permission denied|row-level/i.test(m))) return 'Tu usuario no tiene permiso para hacer esto.';
    if (e && e.code === 'P0001' && m) return m;
    return def || 'No se pudo completar. Intenta de nuevo.';
  }
  function bajar(blob, nombre) {
    var u = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = u; a.download = nombre; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 4000);
  }

  // ================= Cálculo (igual al de la base: cot_totales) =================
  function calc(q) {
    var items = (q.items || []).filter(function (i) { return i && String(i.servicio || '').trim(); });
    var subC = 0, unicoC = 0, mensC = 0, meses = {};
    items.forEach(function (i) {
      var imp = Math.round((Number(i.cantidad) || 0) * cents(i.precio));
      subC += imp;
      if (i.tipo === 'mensual') { mensC += cents(i.precio); meses[Number(i.cantidad) || 0] = 1; } else unicoC += imp;
    });
    var ds = q.descuento || { tipo: 'porc', valor: 0 };
    var dC = ds.tipo === 'monto' ? cents(ds.valor) : Math.round(subC * (Number(ds.valor) || 0) / 100 + 1e-9);
    dC = Math.min(Math.max(dC, 0), subC);
    var baseC = subC - dC, ivaC = Math.round(baseC * (Number(q.iva) || 0) + 1e-9);
    var f = subC > 0 ? baseC / subC : 1, mk = Object.keys(meses);
    return {
      items: items, subtotal: subC / 100, descuento: dC / 100, descPct: subC ? dC / subC : 0, base: baseC / 100, iva: ivaC / 100,
      total: (baseC + ivaC) / 100, unico: Math.round(unicoC * f) / 100, mensual: Math.round(mensC * f) / 100,
      meses: mk.length === 1 ? Number(mk[0]) : null,
      hayMensual: items.some(function (i) { return i.tipo === 'mensual'; }),
      hayUnico: items.some(function (i) { return i.tipo !== 'mensual'; })
    };
  }
  function bulletsDe(q) {
    var out = ['Cotización válida por ' + q.vigencia + ' días (hasta el ' + fdate(addDays(q.fecha, q.vigencia)) + ').'];
    (q.condiciones || []).forEach(function (c) { if (String(c).trim()) out.push(String(c).trim()); });
    String(q.nota || '').split('\n').forEach(function (n) { if (n.trim()) out.push(n.trim()); });
    return out;
  }
  function efectivo(q) {
    if ((q.estatus === 'borrador' || q.estatus === 'enviada') && hoyISO() > addDays(q.fecha, q.vigencia)) return 'vencida';
    return q.estatus || 'borrador';
  }

  // ================= PDF (hoja carta, formato DECOMSA) =================
  function pdfCotizacion(q) {
    var d = new window.jspdf.jsPDF({ unit: 'pt', format: 'letter', compress: true });
    var C = { navy: [13, 78, 150], navy2: [31, 56, 100], or: [245, 130, 32], tx: [64, 64, 64], ln: [217, 217, 217], lb: [189, 215, 238], soft: [236, 243, 251], w: [255, 255, 255] };
    var L = 36, R = 576, W = R - L, PIE = 740, k = calc(q);
    function fill(c) { d.setFillColor(c[0], c[1], c[2]); }
    function stroke(c, w) { d.setDrawColor(c[0], c[1], c[2]); d.setLineWidth(w || 0.5); }
    function color(c) { d.setTextColor(c[0], c[1], c[2]); }
    function font(s, b) { d.setFont('helvetica', b ? 'bold' : 'normal'); d.setFontSize(s); }
    function text(t, x, y, o) { d.text(String(t == null ? '' : t), x, y, o || {}); }
    function fit(t, w) { t = String(t == null ? '' : t); while (t.length > 1 && d.getTextWidth(t) > w) t = t.slice(0, -2) + '…'; return t; }

    if (LOGO.dec) d.addImage(LOGO.dec, 'JPEG', L, 30, 118, 36);
    if (LOGO.pro) d.addImage(LOGO.pro, 'JPEG', R - 66, 16, 66, 66);
    font(15, true); color(C.navy); text('COTIZACIÓN DE SERVICIOS', 306, 56, { align: 'center' });
    fill(C.navy); d.rect(L, 88, W, 4, 'F'); fill(C.or); d.rect(L, 93.5, W, 2, 'F');

    var y = 116;
    [['Cliente:', q.cliente, 'Folio:', folioTxt(q)], ['RFC:', q.rfc, 'Fecha:', fdate(q.fecha)],
     ['Contacto:', q.contacto, 'Vigencia (días):', String(q.vigencia == null ? '' : q.vigencia)],
     ['Teléfono / correo:', q.telefono, 'Válida hasta:', fdate(addDays(q.fecha, q.vigencia))]].forEach(function (r) {
      font(9, true); color(C.navy2); text(r[0], L, y);
      font(9, false); text(fit(r[1], 238), 130, y);
      stroke(C.lb, 0.6); d.line(128, y + 4, 372, y + 4);
      font(9, true); color(C.navy2); text(r[2], 476, y, { align: 'right' });
      font(9, false); color(C.navy); text(r[3], R, y, { align: 'right' });
      d.line(484, y + 4, R, y + 4);
      y += 16;
    });
    y += 10;

    function encabezadoTabla() {
      fill(C.navy); d.rect(L, y, W, 18, 'F'); font(8.5, true); color(C.w);
      text('No.', L + 5, y + 12); text('Servicio', 60, y + 12); text('Descripción', 186, y + 12);
      text('Cant.', 410, y + 12, { align: 'center' }); text('Precio unitario', 496, y + 12, { align: 'right' });
      text('Importe', R - 5, y + 12, { align: 'right' }); y += 18;
    }
    encabezadoTabla();
    k.items.forEach(function (it, i) {
      font(9, true); var sl = d.splitTextToSize(String(it.servicio), 118);
      font(7.3, false); var dl = d.splitTextToSize(String(it.descripcion || ''), 200);
      var h = Math.max(36, sl.length * 11 + 16, dl.length * 8.8 + 16);
      if (y + h > PIE - 14) { d.addPage(); y = 40; encabezadoTabla(); }
      var mid = y + h / 2;
      font(9.5, true); color(C.or); text(String(i + 1), L + 9, mid + 3.2, { align: 'center' });
      font(9, true); color(C.navy); sl.forEach(function (l, j) { text(l, 60, mid - (sl.length * 11) / 2 + 8 + j * 11); });
      font(7.3, false); color(C.tx); dl.forEach(function (l, j) { text(l, 186, mid - (dl.length * 8.8) / 2 + 6.6 + j * 8.8); });
      font(8.5, false); color(C.tx);
      if (it.tipo === 'mensual') {
        text(String(Number(it.cantidad) || 0), 410, mid, { align: 'center' });
        font(6.8, false); text(Number(it.cantidad) === 1 ? 'mes' : 'meses', 410, mid + 8, { align: 'center' });
      } else text(String(Number(it.cantidad) || 0), 410, mid + 3.2, { align: 'center' });
      font(9, false); color(C.tx); text(money(it.precio), 496, mid + 3.2, { align: 'right' });
      font(9, true); color(C.navy); text(money((Number(it.cantidad) || 0) * cents(it.precio) / 100), R - 5, mid + 3.2, { align: 'right' });
      stroke(C.ln, 0.5); d.line(L, y + h, R, y + h);
      y += h;
    });

    // Bloque inferior (condiciones, pago, totales y firma) anclado arriba del pie
    var bullets = bulletsDe(q);
    font(7, false);
    var bl = bullets.map(function (b) { return d.splitTextToSize('• ' + b, 260); });
    var condH = 15 + bl.reduce(function (s, ls) { return s + ls.length * 8.6 + 5; }, 0) + 2;
    var izqH = condH + 10 + 14 + 5 * 12;
    var nRes = k.hayMensual ? (k.hayUnico ? 2 : 1) : 0;
    var totH = 70 + (nRes ? 8 + nRes * 12 + 16 : 0);
    var a = q.asesor && q.asesor.nombre ? q.asesor : null;
    var lsFirma = a ? [a.correo, a.telefono, a.puesto].filter(Boolean) : [];
    var derH = a ? totH + 26 + 23 + lsFirma.length * 10 : totH;
    var y0 = PIE - 14 - Math.max(izqH, derH);
    if (y + 16 > y0) d.addPage();
    y = y0;

    fill(C.or); d.rect(L, y, 270, 15, 'F'); font(8.5, true); color(C.w); text('Condiciones y notas', L + 5, y + 10.5);
    var cy = y + 15;
    bl.forEach(function (ls, i) {
      font(7, false); color(C.tx); ls.forEach(function (l, j) { text(l, L + 4, cy + 9 + j * 8.6); });
      cy += ls.length * 8.6 + 5;
      if (i < bl.length - 1) { stroke(C.ln, 0.4); d.line(L, cy, L + 270, cy); }
    });
    cy += 2; stroke(C.or, 0.7); d.rect(L, y, 270, cy - y, 'S');

    var pago = q.pago || {}, py = cy + 10;
    fill(C.navy); d.rect(L, py, 270, 14, 'F'); font(8.5, true); color(C.w); text('Datos para pago', L + 5, py + 10); py += 14;
    [['Beneficiario:', pago.beneficiario], ['RFC:', pago.rfc], ['Banco:', pago.banco], ['Cuenta:', pago.cuenta, true], ['CLABE:', pago.clabe, true]].forEach(function (r) {
      font(7.5, true); color(C.navy2); text(r[0], L + 4, py + 9);
      font(7.5, !!r[2]); color(C.tx); text(fit(r[1] || '', 186), L + 80, py + 9);
      stroke(C.ln, 0.4); d.line(L, py + 12, L + 270, py + 12); py += 12;
    });

    var tx0 = 330, ty = y;
    stroke(C.lb, 0.6); d.line(tx0, ty, R, ty);
    function fila(lab, p, val) {
      font(9, true); color(C.navy2); text(lab, tx0 + 4, ty + 11.5);
      if (p) { font(9, false); color(C.navy); text(p, 468, ty + 11.5, { align: 'right' }); }
      font(9, false); color(C.tx); text(val, R - 4, ty + 11.5, { align: 'right' });
      stroke(C.lb, 0.6); d.line(tx0, ty + 16, R, ty + 16); ty += 16;
    }
    fila('Subtotal', '', money(k.subtotal));
    fila('Descuento', pct(k.descPct), k.descuento ? '(' + money(k.descuento) + ')' : '-');
    fila('IVA', pct(q.iva), money(k.iva));
    fill(C.navy); d.rect(tx0, ty + 2, R - tx0, 20, 'F'); font(11, true); color(C.w);
    text('TOTAL', tx0 + 5, ty + 16); text(money(k.total), R - 5, ty + 16, { align: 'right' }); ty += 22;
    if (k.hayMensual) {
      ty += 8;
      var ls = [];
      if (k.hayUnico) ls.push(['Pago único (trámites)', money(k.unico) + ' + IVA']);
      ls.push(['Honorario mensual', money(k.mensual) + ' + IVA' + (k.meses ? ' (' + k.meses + ' ' + (k.meses === 1 ? 'mes' : 'meses') + ')' : '')]);
      var rh = ls.length * 12 + 16;
      fill(C.soft); d.rect(tx0, ty, R - tx0, rh, 'F');
      font(6.8, true); color(C.navy); text(k.descuento ? 'RESUMEN DE PAGOS (CON DESCUENTO, SIN IVA)' : 'RESUMEN DE PAGOS (SIN IVA)', tx0 + 6, ty + 10);
      ls.forEach(function (r, i) { font(8, false); color(C.navy2); text(r[0], tx0 + 6, ty + 22 + i * 12); font(8, true); text(r[1], R - 6, ty + 22 + i * 12, { align: 'right' }); });
      ty += rh;
    }
    if (a) {
      var ay = ty + 26, cx = (tx0 + R) / 2;
      stroke(C.navy2, 0.8); d.line(tx0 + 14, ay, R - 4, ay);
      font(9, true); color(C.navy2); text(String(a.nombre).toUpperCase(), cx, ay + 12, { align: 'center' });
      font(8, false); color(C.tx);
      lsFirma.forEach(function (t, i) { text(t, cx, ay + 23 + i * 10, { align: 'center' }); });
    }

    var n = d.getNumberOfPages();
    for (var p = 1; p <= n; p++) {
      d.setPage(p);
      fill(C.navy); d.rect(L, PIE, W, 16, 'F'); font(7.5, true); color(C.w); text(fit(q.pie || '', W - 10), 306, PIE + 10.5, { align: 'center' });
      if (n > 1) { font(7, false); color(C.tx); text(folioTxt(q) + ' · Página ' + p + ' de ' + n, R, PIE + 28, { align: 'right' }); }
    }
    return d;
  }

  // ================= Estado =================
  var sb = null, YO = { puede: false, editor: false, usuario: '', nombre: '' };
  var S = { ajustes: null, servicios: [], asesores: [], clientes: [], cots: [], usuarios: [], firma: null, cargado: {} };
  var AJ0 = { prefijo: 'DEC', vigencia: 15, iva: 0.16, condiciones: [], pago: {}, pie: '', siguiente_folio: 1 };
  function aj() { var a = S.ajustes || {}, o = {}; Object.keys(AJ0).forEach(function (k) { o[k] = a[k] == null ? AJ0[k] : a[k]; }); return o; }
  var draft = null, original = null, editing = null, locked = false, touched = {}, adminUnlock = false, saving = false;
  var histF = { q: '', estatus: '', asesor: '', mes: '' }, catTab = 'servicios', cliQ = '', cliEdit = null, pendingCat = false;

  function snapAsesor(a) { return a ? { id: a.id, nombre: a.nombre, correo: a.correo, telefono: a.telefono, puesto: a.puesto } : null; }
  function asesorDefault() {
    var act = S.asesores.filter(function (x) { return x.activo !== false; });
    var a = act.find(function (x) { return x.usuario && x.usuario === YO.usuario; })
      || act.find(function (x) { return YO.nombre && norm(x.nombre) === norm(YO.nombre); });
    return snapAsesor(a);
  }
  function blankItem() { return { sid: '', servicio: '', descripcion: '', tipo: 'unico', cantidad: 1, precio: 0 }; }
  function nuevoDraft() {
    var A = aj();
    return {
      folio: null, version: null, prefijo: A.prefijo, estatus: 'borrador', cliente: '', rfc: '', contacto: '', telefono: '', cliente_id: null,
      agregar_cliente: true, fecha: hoyISO(), vigencia: A.vigencia, asesor: asesorDefault(), items: [blankItem()],
      descuento: { tipo: 'porc', valor: 0 }, iva: Number(A.iva), nota: '', condiciones: (A.condiciones || []).slice(), pago: Object.assign({}, A.pago || {}),
      pie: A.pie, duplicado_de: null
    };
  }
  // Una cotización nueva siempre toma las condiciones, datos de pago y pie vigentes de Ajustes
  function syncDraftAjustes() {
    if (editing != null || !draft) return;
    var A = aj();
    draft.prefijo = A.prefijo; draft.condiciones = (A.condiciones || []).slice(); draft.pago = Object.assign({}, A.pago || {}); draft.pie = A.pie;
    if (!touched.iva) draft.iva = Number(A.iva);
    if (!touched.vigencia) draft.vigencia = A.vigencia;
    if (!touched.asesor && !draft.asesor) draft.asesor = asesorDefault();
  }
  function deFila(q) {
    return {
      folio: q.folio, version: q.version, prefijo: q.prefijo, estatus: q.estatus, cliente: q.cliente || '', rfc: q.rfc || '', contacto: q.contacto || '',
      telefono: q.telefono || '', cliente_id: q.cliente_id || null, agregar_cliente: false, fecha: q.fecha, vigencia: q.vigencia,
      asesor: q.asesor && q.asesor.nombre ? copia(q.asesor) : null, items: copia(q.items || []), descuento: copia(q.descuento || { tipo: 'porc', valor: 0 }),
      iva: Number(q.iva), nota: q.nota || '', condiciones: copia(q.condiciones || []), pago: copia(q.pago || {}), pie: q.pie || '',
      duplicado_de: q.duplicado_de || null, creado: q.creado, creado_por: q.creado_por
    };
  }

  // ================= Lecturas =================
  async function todas(tabla, orden, asc) {
    var out = [], paso = 1000;
    for (var i = 0; ; i += paso) {
      var r = await sb.from(tabla).select('*').order(orden, { ascending: asc !== false }).range(i, i + paso - 1);
      if (r.error) throw r.error;
      out = out.concat(r.data || []);
      if (!r.data || r.data.length < paso) break;
    }
    return out;
  }
  var LECTOR = {
    ajustes: async function () { var r = await sb.from('cot_ajustes').select('*').eq('id', 1).maybeSingle(); if (r.error) throw r.error; S.ajustes = r.data; },
    servicios: async function () { S.servicios = await todas('cot_servicios', 'orden'); },
    asesores: async function () { S.asesores = await todas('cot_asesores', 'nombre'); },
    clientes: async function () { S.clientes = await todas('cot_clientes', 'razon'); },
    cots: async function () { S.cots = await todas('cot_cotizaciones', 'folio', false); }
  };
  async function carga(que) {
    await Promise.all(que.map(function (k) { return LECTOR[k](); }));
    que.forEach(function (k) { S.cargado[k] = true; });
  }
  async function revisaCambios() {
    if (!sb || document.hidden) return;
    try {
      var r = await sb.rpc('cot_firma');
      if (r.error) throw r.error;
      var f = r.data || {}, antes = S.firma || {}, cambia = [];
      ['ajustes', 'servicios', 'asesores', 'clientes', 'cots'].forEach(function (k) { if (antes[k] !== f[k]) cambia.push(k); });
      var bit = antes.bitacora !== f.bitacora;
      S.firma = f;
      setSync('ok', 'En línea');
      if (cambia.length) { await carga(cambia); cambia.forEach(rerender); }
      if (bit && vista() === 'bitacora' && B.cargado) cargarBit();
    } catch (e) { console.warn(e); setSync('off', 'Sin conexión'); }
  }
  async function logEv(tipo, ref, resumen, cambios) {
    try {
      var r = await sb.from('cot_bitacora').insert({
        tipo: tipo, ref: ref == null ? '' : String(ref), resumen: corto(resumen, 200),
        cambios: (cambios || []).slice(0, 40).map(function (c) { return { campo: corto(c.campo, 60), antes: corto(c.antes), despues: corto(c.despues) }; })
      });
      if (r.error) throw r.error;
    } catch (e) { console.warn('bitácora', e); }
  }

  // ================= Vista previa (misma maquetación que el PDF) =================
  function renderDoc() {
    var q = draft, k = calc(q);
    var rows = k.items.length ? k.items.map(function (it, i) {
      return '<tr><td class="n">' + (i + 1) + '</td><td class="s">' + esc(it.servicio) + '</td><td class="ds">' + esc(it.descripcion) + '</td>'
        + '<td class="c">' + (it.tipo === 'mensual' ? (Number(it.cantidad) || 0) + '<small>' + (Number(it.cantidad) === 1 ? 'mes' : 'meses') + '</small>' : (Number(it.cantidad) || 0)) + '</td>'
        + '<td class="p">' + money(it.precio) + '</td><td class="i">' + money((Number(it.cantidad) || 0) * cents(it.precio) / 100) + '</td></tr>';
    }).join('') : '<tr class="d-empty"><td colspan="6">Agrega servicios desde el formulario</td></tr>';
    var res = k.hayMensual ? '<div class="d-res"><div class="h">' + (k.descuento ? 'RESUMEN DE PAGOS (CON DESCUENTO, SIN IVA)' : 'RESUMEN DE PAGOS (SIN IVA)') + '</div>'
      + (k.hayUnico ? '<div><span>Pago único (trámites)</span><b>' + money(k.unico) + ' + IVA</b></div>' : '')
      + '<div><span>Honorario mensual</span><b>' + money(k.mensual) + ' + IVA' + (k.meses ? ' (' + k.meses + ' ' + (k.meses === 1 ? 'mes' : 'meses') + ')' : '') + '</b></div></div>' : '';
    var a = q.asesor, p = q.pago || {};
    $('#doc').innerHTML = '<div class="d-top"><img class="l1" src="' + LOGO_SRC.dec + '" alt=""><div class="d-title">COTIZACIÓN DE SERVICIOS</div><img class="l2" src="' + LOGO_SRC.pro + '" alt=""></div>'
      + '<div class="d-rule"></div><div class="d-rule2"></div>'
      + '<div class="d-info"><div>'
      + '<div class="d-kv"><b>Cliente:</b><span>' + esc(q.cliente) + '</span></div><div class="d-kv"><b>RFC:</b><span>' + esc(q.rfc) + '</span></div>'
      + '<div class="d-kv"><b>Contacto:</b><span>' + esc(q.contacto) + '</span></div><div class="d-kv"><b>Teléfono / correo:</b><span>' + esc(q.telefono) + '</span></div>'
      + '</div><div class="r">'
      + '<div class="d-kv"><b>Folio:</b><span>' + esc(folioTxt(q)) + '</span></div><div class="d-kv"><b>Fecha:</b><span>' + fdate(q.fecha) + '</span></div>'
      + '<div class="d-kv"><b>Vigencia (días):</b><span>' + esc(q.vigencia) + '</span></div><div class="d-kv"><b>Válida hasta:</b><span>' + fdate(addDays(q.fecha, q.vigencia)) + '</span></div>'
      + '</div></div>'
      + '<table><thead><tr><th>No.</th><th>Servicio</th><th>Descripción</th><th style="text-align:center">Cant.</th><th class="p">Precio unitario</th><th class="p">Importe</th></tr></thead><tbody>' + rows + '</tbody></table>'
      + '<div class="d-bottom"><div>'
      + '<div class="d-box"><h4>Condiciones y notas</h4>' + bulletsDe(q).map(function (b) { return '<p>• ' + esc(b) + '</p>'; }).join('') + '</div>'
      + '<div class="d-pay"><h4>Datos para pago</h4><div><b>Beneficiario:</b><span>' + esc(p.beneficiario) + '</span></div><div><b>RFC:</b><span>' + esc(p.rfc) + '</span></div>'
      + '<div><b>Banco:</b><span>' + esc(p.banco) + '</span></div><div><b>Cuenta:</b><b>' + esc(p.cuenta) + '</b></div><div><b>CLABE:</b><b>' + esc(p.clabe) + '</b></div></div>'
      + '</div><div><div class="d-tot">'
      + '<div><b>Subtotal</b><span></span><span class="v">' + money(k.subtotal) + '</span></div>'
      + '<div><b>Descuento</b><span class="pc">' + pct(k.descPct) + '</span><span class="v">' + (k.descuento ? '(' + money(k.descuento) + ')' : '-') + '</span></div>'
      + '<div><b>IVA</b><span class="pc">' + pct(q.iva) + '</span><span class="v">' + money(k.iva) + '</span></div>'
      + '<div class="T"><b>TOTAL</b><span></span><span class="v">' + money(k.total) + '</span></div></div>' + res
      + (a && a.nombre ? '<div class="d-sig"><b>' + esc(String(a.nombre).toUpperCase()) + '</b><br>' + [a.correo, a.telefono, a.puesto].filter(Boolean).map(esc).join('<br>') + '</div>' : '')
      + '</div></div><div class="d-foot">' + esc(q.pie) + '</div>';
    fitDoc();
    renderMini(k);
  }
  function fitDoc() {
    var box = $('#pv-scale'), d = $('#doc');
    if (!box || !box.offsetWidth) return;
    var s = Math.min(1, box.offsetWidth / 816);
    d.style.transform = 'scale(' + s + ')';
    box.style.height = d.offsetHeight * s + 'px';
  }
  function renderMini(k) {
    var eq = $('#desc-eq');
    eq.textContent = k.descuento ? (draft.descuento.tipo === 'monto' ? 'Equivale a ' + pct(k.descPct) + ' del subtotal' : 'Equivale a ' + money(k.descuento)) : '';
    $('#tot-mini').innerHTML = '<span class="muted">Subtotal</span><span>' + money(k.subtotal) + '</span>'
      + '<span class="muted">Descuento ' + (k.descuento ? '(' + pct(k.descPct) + ')' : '') + '</span><span>' + (k.descuento ? '−' + money(k.descuento) : '—') + '</span>'
      + '<span class="muted">IVA</span><span>' + money(k.iva) + '</span><span class="t">Total</span><span class="t">' + money(k.total) + '</span>';
  }

  // ================= Editor =================
  function fillForm() {
    var q = draft;
    $('#f-cliente').value = q.cliente; $('#f-rfc').value = q.rfc; $('#f-contacto').value = q.contacto; $('#f-telefono').value = q.telefono;
    $('#f-fecha').value = q.fecha; $('#f-vigencia').value = q.vigencia; $('#f-hasta').value = fdate(addDays(q.fecha, q.vigencia));
    $('#f-desc').value = q.descuento.valor || ''; $('#f-iva').value = Math.round((Number(q.iva) || 0) * 10000) / 100;
    $('#f-nota').value = q.nota || '';
    setDescTipoUI(); renderAsesorSelect(); renderItems(); renderCliState(); renderEdHead(); renderDoc();
  }
  function setDescTipoUI() {
    var t = draft.descuento.tipo;
    $$('#desc-tipo button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === t)); });
    $('#desc-in-lbl').textContent = t === 'monto' ? 'Descuento (monto en pesos)' : 'Descuento (%)';
    $('#desc-sym').textContent = t === 'monto' ? '$' : '%';
    $('#f-desc').max = t === 'porc' ? '100' : '';
  }
  function renderAsesorSelect() {
    var sel = $('#f-asesor'), a = draft.asesor;
    var act = S.asesores.filter(function (x) { return x.activo !== false; });
    var cur = a ? (a.id && S.asesores.some(function (x) { return x.id === a.id; }) ? a.id : '_copia') : '';
    sel.innerHTML = '<option value="">Sin asesor</option>' + act.map(function (x) { return '<option value="' + esc(x.id) + '">' + esc(x.nombre) + (x.puesto ? ' · ' + esc(x.puesto) : '') + '</option>'; }).join('')
      + (a && (cur === '_copia' || !act.some(function (x) { return x.id === cur; })) ? '<option value="' + esc(cur) + '">' + esc(a.nombre) + '</option>' : '');
    sel.value = cur;
  }
  function servOptions(it) {
    var lista = S.servicios.filter(function (s) { return s.activo !== false || s.id === it.sid; });
    var conocido = lista.some(function (s) { return s.id === it.sid; });
    return '<option value="">Elige un servicio…</option>' + lista.map(function (s) {
      return '<option value="' + esc(s.id) + '">' + esc(s.nombre) + (s.tipo === 'mensual' ? ' (mensual)' : '') + (s.activo === false ? ' (inactivo)' : '') + '</option>';
    }).join('') + (!conocido && it.servicio ? '<option value="_fuera">' + esc(it.servicio) + ' (fuera de catálogo)</option>' : '');
  }
  function renderItems() {
    $('#items').innerHTML = draft.items.map(function (it, i) {
      var s = S.servicios.find(function (x) { return x.id === it.sid; });
      var lista = s && cents(s.precio) !== cents(it.precio) ? '<div class="hint">Precio de lista: ' + money(s.precio) + '</div>' : '';
      return '<div class="item" data-i="' + i + '"><div class="item-h"><span class="item-n">' + (i + 1) + '</span>'
        + '<select class="in" data-k="sid" aria-label="Servicio ' + (i + 1) + '">' + servOptions(it) + '</select>'
        + '<button type="button" class="btn ghost sm danger" data-del aria-label="Quitar servicio ' + (i + 1) + '">Quitar</button></div>'
        + '<div class="item-g"><label class="f">' + (it.tipo === 'mensual' ? 'Meses' : 'Cantidad') + '<input type="number" min="1" step="1" class="in num" data-k="cantidad" value="' + esc(it.cantidad) + '"></label>'
        + '<label class="f">Precio unitario<input type="number" min="0" step="0.01" class="in num" data-k="precio" value="' + esc(it.precio) + '"></label>'
        + '<div class="item-imp">' + money((Number(it.cantidad) || 0) * cents(it.precio) / 100) + '</div></div>' + lista
        + '<label class="f">Descripción<textarea class="in" rows="3" data-k="descripcion">' + esc(it.descripcion) + '</textarea></label></div>';
    }).join('');
    $$('#items select[data-k=sid]').forEach(function (sel, i) {
      var it = draft.items[i];
      sel.value = it.sid && S.servicios.some(function (s) { return s.id === it.sid; }) ? it.sid : (it.servicio ? '_fuera' : '');
    });
    applyLock();
  }
  function renderCliState() {
    var el = $('#cli-state'), q = draft;
    if (!q.cliente.trim()) { el.innerHTML = ''; return; }
    if (q.cliente_id) { el.innerHTML = '<span class="chip">Cliente de la base</span>'; return; }
    if (editing != null) { el.innerHTML = ''; return; }
    el.innerHTML = '<span class="chip new">Cliente nuevo</span><label class="row" style="gap:6px;font-size:13px"><input type="checkbox" id="f-addcli"' + (q.agregar_cliente ? ' checked' : '') + '> Agregar a la base de clientes al guardar</label>';
    $('#f-addcli').onchange = function (e) { draft.agregar_cliente = e.target.checked; };
  }
  function siguienteFolio() {
    var mx = S.cots.reduce(function (m, q) { return Math.max(m, Number(q.folio) || 0); }, 0);
    return Math.max(Number(aj().siguiente_folio) || 1, mx + 1);
  }
  function renderEdHead() {
    $('#ed-mode').textContent = editing == null ? (draft.duplicado_de ? 'Copia de ' + draft.prefijo + ' - ' + draft.duplicado_de : 'Nueva cotización') : 'Cotización guardada';
    $('#ed-folio').textContent = draft.folio != null ? folioTxt(draft) : 'Folio al guardar · sigue ' + aj().prefijo + ' - ' + siguienteFolio();
    var w = $('#ed-st-wrap'), sel = $('#ed-estatus');
    if (editing == null) w.hidden = true;
    else {
      w.hidden = false;
      var ef = efectivo(draft);
      sel.innerHTML = opcionesEstatus(draft, ef);
      sel.value = ef === 'vencida' ? '' : draft.estatus; sel.className = 'st st-' + ef;
    }
    locked = editing != null && draft.estatus !== 'borrador' && !adminUnlock;
    var lb = $('#ed-lock');
    if (locked) {
      lb.hidden = false;
      lb.innerHTML = '<span>Esta cotización ya se emitió y queda fija. Para cambiarla, duplícala con un folio nuevo.</span><span class="spacer"></span>'
        + '<button type="button" class="btn sm" data-act="dup">Duplicar</button>'
        + (YO.editor ? '<button type="button" class="btn ghost sm" data-act="unlock">Corregir de todos modos</button>' : '');
    } else if (editing != null && draft.estatus !== 'borrador') {
      lb.hidden = false;
      lb.innerHTML = '<span>Estás corrigiendo una cotización ya emitida. El cambio queda en la bitácora con tu nombre.</span>';
    } else lb.hidden = true;
    renderActions(); applyLock(); renderHistCot();
  }
  function opcionesEstatus(q, ef) {
    var ops = ['enviada', 'aceptada', 'rechazada'];
    if (q.estatus === 'borrador' || YO.editor) ops.unshift('borrador');
    return (ef === 'vencida' ? '<option value="" disabled>Vencida</option>' : '') + ops.map(function (s) { return '<option value="' + s + '">' + ESTATUS[s] + '</option>'; }).join('');
  }
  function applyLock() {
    $$('#ed-panel .in, #ed-panel input, #ed-panel textarea, #desc-tipo button, #add-item, #items [data-del]').forEach(function (e) {
      if (e.id !== 'f-hasta' && e.id !== 'ed-estatus') e.disabled = locked;
    });
  }
  function renderActions() {
    var a = $('#ed-actions');
    if (locked) {
      a.innerHTML = '<button type="button" class="btn primary" data-act="pdf">Descargar PDF</button><button type="button" class="btn" data-act="dup">Duplicar</button>'
        + '<span class="spacer"></span><button type="button" class="btn ghost" data-act="new">Nueva cotización</button>';
    } else {
      var emitida = editing != null && draft.estatus !== 'borrador';
      a.innerHTML = '<button type="button" class="btn primary" data-act="emit">' + (emitida ? 'Guardar corrección y descargar PDF' : 'Emitir y descargar PDF') + '</button>'
        + '<button type="button" class="btn" data-act="save">' + (emitida ? 'Guardar corrección' : 'Guardar borrador') + '</button>'
        + (editing != null ? '<button type="button" class="btn ghost" data-act="pdf">PDF</button>' : '')
        + '<span class="spacer"></span><button type="button" class="btn ghost" data-act="new">Nueva</button>';
    }
    if (saving) $$('button', a).forEach(function (b) { b.disabled = true; });
  }
  var histTok = 0;
  async function renderHistCot() {
    var el = $('#ed-hist');
    if (editing == null) { el.hidden = true; el.innerHTML = ''; return; }
    var tok = ++histTok, folio = editing;
    var r = await sb.from('cot_bitacora').select('*').eq('ref', String(folio)).like('tipo', 'cot.%').order('t', { ascending: false }).limit(200);
    if (tok !== histTok || editing !== folio) return;
    var bit = r.error ? [] : r.data || [];
    if (!bit.length) { el.hidden = true; el.innerHTML = ''; return; }
    var abierto = el.querySelector('details') && el.querySelector('details').open;
    el.hidden = false;
    el.innerHTML = '<details class="hist"' + (abierto ? ' open' : '') + '><summary>Historial de esta cotización (' + bit.length + ')</summary><ol>'
      + bit.map(function (b) {
        var acc = b.tipo === 'cot.estatus' && b.cambios && b.cambios[0] ? 'Estatus: ' + b.cambios[0].antes + ' → ' + b.cambios[0].despues : (ACC_COT[b.tipo] || b.tipo);
        return '<li><b>' + esc(acc) + '</b><div class="who-l">' + esc(fmtDT(b.t)) + ' · ' + esc(b.nombre || b.usuario || 'Sistema') + '</div>' + (b.tipo === 'cot.estatus' ? '' : chgHTML(b.cambios)) + '</li>';
      }).join('') + '</ol></details>';
  }
  function chgHTML(c) {
    return c && c.length ? '<ul class="chg">' + c.map(function (x) { return '<li><b>' + esc(x.campo) + ':</b> <span class="a">' + esc(x.antes) + '</span> → <span class="d">' + esc(x.despues) + '</span></li>'; }).join('') + '</ul>' : '';
  }

  function bindEditor() {
    var mapa = { 'f-cliente': 'cliente', 'f-rfc': 'rfc', 'f-contacto': 'contacto', 'f-telefono': 'telefono', 'f-fecha': 'fecha', 'f-vigencia': 'vigencia', 'f-nota': 'nota' };
    Object.keys(mapa).forEach(function (id) {
      var k = mapa[id];
      $('#' + id).addEventListener('input', function (e) {
        var v = e.target.value;
        if (k === 'rfc') { v = v.toUpperCase().replace(/\s/g, ''); e.target.value = v; }
        if (k === 'vigencia') { v = Math.max(0, parseInt(v, 10) || 0); touched.vigencia = true; }
        draft[k] = v;
        if (k === 'cliente') { draft.cliente_id = null; showTA(); renderCliState(); }
        if (k === 'rfc' && !draft.cliente_id) {
          var c = S.clientes.find(function (x) { return x.rfc === v; });
          if (c) { draft.cliente_id = c.id; renderCliState(); }
        }
        if (k === 'fecha' || k === 'vigencia') $('#f-hasta').value = fdate(addDays(draft.fecha, draft.vigencia));
        renderDoc();
      });
    });
    $('#f-iva').addEventListener('input', function (e) { draft.iva = (Number(e.target.value) || 0) / 100; touched.iva = true; renderDoc(); });
    $('#f-desc').addEventListener('input', function (e) { draft.descuento.valor = Number(e.target.value) || 0; renderDoc(); });
    $('#desc-tipo').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || b.dataset.v === draft.descuento.tipo) return;
      // Al cambiar de tipo se convierte el valor para que el total no cambie
      var k = calc(draft);
      draft.descuento.tipo = b.dataset.v;
      draft.descuento.valor = b.dataset.v === 'monto' ? k.descuento : Math.round(k.descPct * 10000) / 100;
      $('#f-desc').value = draft.descuento.valor || '';
      setDescTipoUI(); renderDoc();
    });
    $('#f-asesor').addEventListener('change', function (e) {
      touched.asesor = true;
      var a = S.asesores.find(function (x) { return x.id === e.target.value; });
      if (a) draft.asesor = snapAsesor(a); else if (!e.target.value) draft.asesor = null;
      renderDoc();
    });
    $('#add-item').addEventListener('click', function () {
      draft.items.push(blankItem()); renderItems(); renderDoc();
      var s = $$('#items select'); if (s.length) s[s.length - 1].focus();
    });
    $('#items').addEventListener('input', function (e) {
      var box = e.target.closest('.item'); if (!box) return;
      var it = draft.items[Number(box.dataset.i)], k = e.target.dataset.k;
      if (k === 'cantidad' || k === 'precio') { it[k] = Number(e.target.value) || 0; $('.item-imp', box).textContent = money((Number(it.cantidad) || 0) * cents(it.precio) / 100); }
      else if (k === 'descripcion') it.descripcion = e.target.value;
      renderDoc();
    });
    $('#items').addEventListener('change', function (e) {
      var box = e.target.closest('.item'); if (!box) return;
      var i = Number(box.dataset.i);
      if (e.target.dataset.k === 'sid') {
        var s = S.servicios.find(function (x) { return x.id === e.target.value; });
        if (s) draft.items[i] = { sid: s.id, servicio: s.nombre, descripcion: s.descripcion || '', tipo: s.tipo || 'unico', cantidad: draft.items[i].cantidad || 1, precio: Number(s.precio) || 0 };
        else if (!e.target.value) draft.items[i] = blankItem();
        renderItems(); renderDoc();
      }
      if (e.target.dataset.k === 'precio') renderItems();
    });
    $('#items').addEventListener('click', function (e) {
      if (!e.target.closest('[data-del]')) return;
      draft.items.splice(Number(e.target.closest('.item').dataset.i), 1);
      if (!draft.items.length) draft.items.push(blankItem());
      renderItems(); renderDoc();
    });
    // Autocompletar cliente
    var inp = $('#f-cliente');
    inp.addEventListener('focus', showTA);
    inp.addEventListener('blur', function () { setTimeout(function () { $('#ta').hidden = true; }, 160); });
    inp.addEventListener('keydown', function (e) {
      var list = $('#ta'); if (list.hidden) return;
      var bs = $$('button', list), i = bs.findIndex(function (b) { return b.classList.contains('on'); });
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault(); i = e.key === 'ArrowDown' ? Math.min(bs.length - 1, i + 1) : Math.max(0, i - 1);
        bs.forEach(function (b, j) { b.classList.toggle('on', j === i); }); if (bs[i]) bs[i].scrollIntoView({ block: 'nearest' });
      }
      if (e.key === 'Enter' && i >= 0) { e.preventDefault(); bs[i].click(); }
      if (e.key === 'Escape') list.hidden = true;
    });
    $('#ta').addEventListener('mousedown', function (e) { e.preventDefault(); });
    $('#ta').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-id]'); if (!b) return;
      var c = S.clientes.find(function (x) { return x.id === b.dataset.id; }); if (!c) return;
      draft.cliente = c.razon; draft.rfc = c.rfc; draft.cliente_id = c.id;
      if (c.contacto) draft.contacto = c.contacto;
      if (c.telefono || c.correo) draft.telefono = [c.telefono, c.correo].filter(Boolean).join(' / ');
      $('#ta').hidden = true; fillForm();
    });
    $('#ed-estatus').addEventListener('change', function (e) { cambiarEstatus(draft.folio, e.target.value); });
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return;
      var act = b.dataset.act, f = b.dataset.folio ? Number(b.dataset.folio) : null;
      var q = f != null ? S.cots.find(function (x) { return x.folio === f; }) : null;
      if (act === 'save') guardar(false);
      if (act === 'emit') guardar(true);
      if (act === 'pdf') descargarPDF(q ? deFila(q) : (editing != null ? draft : null));
      if (act === 'dup') duplicar(q ? deFila(q) : draft);
      if (act === 'new') nueva();
      if (act === 'unlock') { adminUnlock = true; renderEdHead(); }
      if (act === 'open') abrir(f);
      if (act === 'backup') respaldo(b);
    });
  }
  function showTA() {
    var list = $('#ta'), q = norm(draft.cliente);
    if (q.length < 2 || !S.clientes.length) { list.hidden = true; return; }
    var hits = S.clientes.filter(function (c) { return norm(c.razon).indexOf(q) >= 0 || norm(c.rfc).indexOf(q) >= 0; }).slice(0, 8);
    if (!hits.length) { list.hidden = true; return; }
    list.innerHTML = hits.map(function (c) { return '<button type="button" role="option" data-id="' + esc(c.id) + '"><span>' + esc(c.razon) + '</span><small>' + esc(c.rfc) + (c.contacto ? ' · ' + esc(c.contacto) : '') + '</small></button>'; }).join('');
    list.hidden = false;
  }

  // ================= Guardar, estatus, PDF =================
  function validar() {
    var q = draft, errs = [], warns = [];
    if (!q.cliente.trim()) errs.push('Captura el nombre del cliente.');
    if (!RFC_RE.test(q.rfc)) errs.push('Captura un RFC válido (12 caracteres para persona moral, 13 para persona física).');
    var its = q.items.filter(function (i) { return String(i.servicio || '').trim(); });
    if (!its.length) errs.push('Agrega al menos un servicio.');
    its.forEach(function (i, n) {
      if (!(Number(i.precio) > 0)) errs.push('El servicio ' + (n + 1) + ' (' + i.servicio + ') no tiene precio.');
      if (!(Number(i.cantidad) > 0) || Number(i.cantidad) !== Math.floor(Number(i.cantidad))) errs.push('El servicio ' + (n + 1) + ' necesita una cantidad entera mayor a cero.');
    });
    if (!(Number(q.vigencia) >= 1 && Number(q.vigencia) <= 365)) errs.push('La vigencia debe ser de 1 a 365 días.');
    if (!q.fecha) errs.push('Captura la fecha.');
    if (q.descuento.tipo === 'porc' && Number(q.descuento.valor) > 100) errs.push('El descuento no puede pasar de 100%.');
    var vistos = {};
    its.forEach(function (i) { if (vistos[i.servicio]) warns.push('«' + i.servicio + '» aparece más de una vez.'); vistos[i.servicio] = 1; });
    if (!q.asesor) warns.push('La cotización no lleva asesor que firme.');
    mostrarMsgs(errs, warns);
    return !errs.length;
  }
  function mostrarMsgs(errs, warns) {
    var m = $('#ed-msgs');
    m.hidden = !errs.length && !warns.length;
    m.innerHTML = (errs.length ? '<div class="errors"><b>Falta corregir antes de guardar</b><ul>' + errs.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul></div>' : '')
      + (warns.length ? '<div class="warnbox">' + warns.map(esc).join('<br>') + '</div>' : '');
    if (errs.length) m.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function limpio(q) {
    var k = calc(q);
    return {
      cliente: q.cliente.trim(), rfc: q.rfc.trim().toUpperCase(), contacto: q.contacto.trim(), telefono: q.telefono.trim(), fecha: q.fecha,
      vigencia: Number(q.vigencia) || 0, asesor: q.asesor || null, descuento: { tipo: q.descuento.tipo, valor: Number(q.descuento.valor) || 0 },
      iva: Number(q.iva) || 0, nota: q.nota || '',
      items: k.items.map(function (i) {
        return { sid: i.sid || '', servicio: String(i.servicio).trim(), descripcion: String(i.descripcion || '').trim(), tipo: i.tipo === 'mensual' ? 'mensual' : 'unico', cantidad: Number(i.cantidad) || 0, precio: cents(i.precio) / 100 };
      })
    };
  }
  function difCampos(a, b, campos) {
    var out = [];
    campos.forEach(function (c) {
      var x = c[2] ? c[2](a[c[0]]) : (a[c[0]] == null ? '' : a[c[0]]), y = c[2] ? c[2](b[c[0]]) : (b[c[0]] == null ? '' : b[c[0]]);
      if (String(x) !== String(y)) out.push({ campo: c[1], antes: x === '' ? '(vacío)' : x, despues: y === '' ? '(vacío)' : y });
    });
    return out;
  }
  function descTxt(ds) { return !ds || !Number(ds.valor) ? 'Sin descuento' : ds.tipo === 'monto' ? money(ds.valor) : ds.valor + '%'; }
  function itemTxt(i) { return i.servicio + ' · ' + cantTxt(i) + ' × ' + money(i.precio); }
  function difCot(prev, body) {
    var out = difCampos(prev, body, [['cliente', 'Cliente'], ['rfc', 'RFC'], ['contacto', 'Contacto'], ['telefono', 'Teléfono / correo'],
      ['fecha', 'Fecha', fdate], ['vigencia', 'Vigencia (días)'], ['asesor', 'Asesor', function (v) { return (v && v.nombre) || 'Sin asesor'; }],
      ['descuento', 'Descuento', descTxt], ['iva', 'IVA', pct], ['nota', 'Notas adicionales']]);
    var a = prev.items || [], b = body.items || [];
    for (var i = 0; i < Math.max(a.length, b.length); i++) {
      if (!a[i]) out.push({ campo: 'Servicio ' + (i + 1), antes: '(no existía)', despues: itemTxt(b[i]) });
      else if (!b[i]) out.push({ campo: 'Servicio ' + (i + 1), antes: itemTxt(a[i]), despues: '(eliminado)' });
      else {
        if (itemTxt(a[i]) !== itemTxt(b[i])) out.push({ campo: 'Servicio ' + (i + 1), antes: itemTxt(a[i]), despues: itemTxt(b[i]) });
        if (String(a[i].descripcion || '').trim() !== String(b[i].descripcion || '').trim()) out.push({ campo: 'Descripción del servicio ' + (i + 1), antes: a[i].descripcion || '(vacío)', despues: b[i].descripcion || '(vacío)' });
      }
    }
    var ta = calc(prev).total, tb = calc(body).total;
    if (ta !== tb) out.push({ campo: 'Total', antes: money(ta), despues: money(tb) });
    return out;
  }
  async function guardar(emitir) {
    if (saving) return;
    if (!validar()) return;
    saving = true; renderActions();
    try {
      var body = limpio(draft);
      var cambios = editing != null && original ? difCot(limpio(original), body) : [];
      var datos = Object.assign({}, body, {
        folio: draft.folio, version: draft.version, cliente_id: draft.cliente_id, agregar_cliente: !!draft.agregar_cliente, duplicado_de: draft.duplicado_de
      });
      var r = await sb.rpc('cot_guardar', { datos: datos, emitir: !!emitir, cambios: cambios });
      if (r.error) throw r.error;
      var folio = r.data.folio;
      await carga(['cots', 'clientes', 'ajustes']);
      var q = S.cots.find(function (x) { return x.folio === folio; });
      abrir(folio, true);
      toast('Cotización ' + folioTxt(q || draft) + ' ' + (r.data.accion === 'emitir' ? 'emitida' : r.data.accion === 'corregir' ? 'corregida' : 'guardada'));
      if (emitir && q) await descargarPDF(deFila(q));
    } catch (e) {
      console.error(e);
      var m = mensajeError(e, 'No se pudo guardar. Revisa tu conexión e intenta de nuevo.');
      mostrarMsgs([m], []); toast(m, 5000);
    } finally { saving = false; renderActions(); }
  }
  async function cambiarEstatus(folio, est) {
    if (folio == null || !est) return;
    var q = S.cots.find(function (x) { return x.folio === folio; });
    if (!q || q.estatus === est) return;
    var r = await sb.rpc('cot_estatus', { p_folio: folio, p_estatus: est });
    if (r.error) { toast(mensajeError(r.error, 'No se pudo cambiar el estatus.'), 5000); rerender('cots'); return; }
    await carga(['cots']);
    toast(folioTxt(q) + ': ' + ESTATUS[est]);
    if (editing === folio) abrir(folio, true); else rerender('cots');
  }
  async function descargarPDF(q) {
    if (!q) return;
    if (!window.jspdf) { toast('El generador de PDF no cargó. Recarga la página.'); return; }
    try {
      await cargaLogos();
      var nombre = nombreArchivo('Cotización ' + (q.folio == null ? 'borrador' : (q.prefijo || 'DEC') + '-' + q.folio) + ' - ' + (q.cliente || 'cliente')) + '.pdf';
      bajar(pdfCotizacion(q).output('blob'), nombre);
      toast('PDF listo: ' + nombre);
      if (q.folio != null) logEv('cot.pdf', q.folio, folioTxt(q) + ' · ' + q.cliente);
    } catch (e) { console.error(e); toast('No se pudo armar el PDF.'); }
  }
  function nueva() {
    draft = nuevoDraft(); original = null; editing = null; touched = {}; adminUnlock = false;
    $('#ed-msgs').hidden = true; fillForm();
    if (location.hash !== '#nueva') location.hash = 'nueva'; else route();
  }
  function abrir(folio, quieto) {
    var q = S.cots.find(function (x) { return x.folio === folio; }); if (!q) return;
    draft = deFila(q); original = deFila(q); editing = folio; touched = { iva: true, vigencia: true, asesor: true }; adminUnlock = false;
    $('#ed-msgs').hidden = true; fillForm();
    if (!quieto || location.hash !== '#nueva') { location.hash = 'nueva'; window.scrollTo(0, 0); }
  }
  function duplicar(q) {
    if (!q) return;
    var A = aj(), c = copia(q);
    draft = Object.assign(c, {
      folio: null, version: null, fecha: hoyISO(), estatus: 'borrador', duplicado_de: q.folio, prefijo: A.prefijo,
      condiciones: (A.condiciones || []).slice(), pago: Object.assign({}, A.pago || {}), pie: A.pie, agregar_cliente: !c.cliente_id
    });
    original = null; editing = null; touched = { iva: true, vigencia: true, asesor: true }; adminUnlock = false;
    $('#ed-msgs').hidden = true; fillForm();
    location.hash = 'nueva'; window.scrollTo(0, 0);
    toast('Copia de ' + folioTxt(q) + '; al guardar recibe folio nuevo.');
  }

  // ================= Cotizaciones =================
  function renderHist() {
    var v = $('#v-cotizaciones');
    var meses = Array.from(new Set(S.cots.map(function (q) { return String(q.fecha).slice(0, 7); }))).sort().reverse();
    var asesores = Array.from(new Set(S.cots.map(function (q) { return q.asesor && q.asesor.nombre; }).filter(Boolean))).sort();
    var hq = norm(histF.q);
    var list = S.cots.filter(function (q) {
      if (hq && !(norm(q.cliente).indexOf(hq) >= 0 || norm(q.rfc).indexOf(hq) >= 0 || String(q.folio).indexOf(hq) >= 0)) return false;
      if (histF.estatus && efectivo(q) !== histF.estatus) return false;
      if (histF.asesor && (!q.asesor || q.asesor.nombre !== histF.asesor)) return false;
      if (histF.mes && String(q.fecha).slice(0, 7) !== histF.mes) return false;
      return true;
    });
    var emit = list.filter(function (q) { return q.estatus !== 'borrador'; });
    var acc = list.filter(function (q) { return q.estatus === 'aceptada'; });
    var suma = function (a) { return a.reduce(function (s, q) { return s + cents(q.total); }, 0) / 100; };
    var hoy = hoyISO(), en3 = addDays(hoy, 3);
    var porVencer = S.cots.filter(function (q) { var h = addDays(q.fecha, q.vigencia); return q.estatus === 'enviada' && h >= hoy && h <= en3; });
    var focused = document.activeElement && document.activeElement.id;
    v.innerHTML = '<div class="vhead"><div><div class="eyebrow">Seguimiento comercial</div><h2>Cotizaciones</h2></div><span class="spacer"></span>'
      + '<button type="button" class="btn" data-act="backup">Descargar respaldo</button><button type="button" class="btn primary" data-act="new">+ Nueva cotización</button></div>'
      + '<div class="stats">'
      + '<div class="stat"><div class="eyebrow">Emitidas</div><div class="v">' + emit.length + '</div><div class="s">' + money(suma(emit)) + ' con IVA</div></div>'
      + '<div class="stat"><div class="eyebrow">Aceptadas</div><div class="v">' + acc.length + '</div><div class="s">' + money(suma(acc)) + ' con IVA</div></div>'
      + '<div class="stat"><div class="eyebrow">Tasa de aceptación</div><div class="v">' + (emit.length ? Math.round(acc.length / emit.length * 100) + '%' : '—') + '</div><div class="s">aceptadas entre emitidas</div></div>'
      + '<div class="stat"><div class="eyebrow">Vencen en 3 días</div><div class="v">' + porVencer.length + '</div><div class="s">' + (porVencer.length ? porVencer.slice(0, 3).map(folioTxt).join(', ') : 'Sin pendientes') + '</div></div>'
      + '</div><div class="filters">'
      + '<input class="in" id="h-q" placeholder="Buscar folio, cliente o RFC" value="' + esc(histF.q) + '" aria-label="Buscar">'
      + '<select class="in" id="h-estatus" aria-label="Estatus"><option value="">Todos los estatus</option>' + Object.keys(ESTATUS).map(function (k) { return '<option value="' + k + '">' + ESTATUS[k] + '</option>'; }).join('') + '</select>'
      + '<select class="in" id="h-asesor" aria-label="Asesor"><option value="">Todos los asesores</option>' + asesores.map(function (a) { return '<option>' + esc(a) + '</option>'; }).join('') + '</select>'
      + '<select class="in" id="h-mes" aria-label="Mes"><option value="">Todos los meses</option>' + meses.map(function (m) { return '<option value="' + m + '">' + mesTxt(m) + '</option>'; }).join('') + '</select>'
      + '</div><div class="tbl-wrap"><table class="t"><thead><tr><th>Folio</th><th>Fecha</th><th>Cliente</th><th>Asesor</th><th class="r">Total</th><th>Vence</th><th>Estatus</th><th></th></tr></thead><tbody>'
      + (list.length ? list.map(function (q) {
        var ef = efectivo(q);
        return '<tr><td class="fol">' + esc(folioTxt(q)) + '</td><td class="num">' + fdate(q.fecha) + '</td>'
          + '<td class="cl"><div title="' + esc(q.cliente) + '">' + esc(q.cliente) + '</div><small>' + esc(q.rfc) + '</small></td>'
          + '<td>' + esc(q.asesor && q.asesor.nombre ? q.asesor.nombre : '—') + '</td><td class="r">' + money(q.total) + '</td><td class="num">' + fdate(addDays(q.fecha, q.vigencia)) + '</td>'
          + '<td><select class="st st-' + ef + '" data-st="' + q.folio + '" aria-label="Estatus de ' + esc(folioTxt(q)) + '">' + opcionesEstatus(q, ef).replace('<option value="" disabled>', '<option value="" disabled selected>') + '</select></td>'
          + '<td><div class="acts"><button type="button" class="btn ghost sm" data-act="open" data-folio="' + q.folio + '">Abrir</button><button type="button" class="btn ghost sm" data-act="pdf" data-folio="' + q.folio + '">PDF</button><button type="button" class="btn ghost sm" data-act="dup" data-folio="' + q.folio + '">Duplicar</button></div></td></tr>';
      }).join('') : '<tr><td colspan="8"><div class="empty">' + (S.cargado.cots ? (S.cots.length ? 'Ninguna cotización coincide con los filtros.' : 'Aún no hay cotizaciones. La primera que guardes aparecerá aquí con su folio.') : 'Cargando cotizaciones…') + '</div></td></tr>')
      + '</tbody></table></div>';
    $('#h-estatus').value = histF.estatus; $('#h-asesor').value = histF.asesor; $('#h-mes').value = histF.mes;
    $$('[data-st]', v).forEach(function (s) {
      var q = S.cots.find(function (x) { return x.folio === Number(s.dataset.st); });
      if (q && efectivo(q) !== 'vencida') s.value = q.estatus;
      s.onchange = function (e) { cambiarEstatus(Number(s.dataset.st), e.target.value); };
    });
    $('#h-q').oninput = function (e) { histF.q = e.target.value; renderHist(); };
    ['estatus', 'asesor', 'mes'].forEach(function (k) { $('#h-' + k).onchange = function (e) { histF[k] = e.target.value; renderHist(); }; });
    if (focused === 'h-q') { var i = $('#h-q'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
  }

  // ================= Catálogos =================
  var FMT_CAT = { precio: money, activo: function (v) { return v === false ? 'No' : 'Sí'; }, tipo: function (v) { return v === 'mensual' ? 'Mensual' : 'Único'; } };
  var LBL_CAT = { nombre: 'Nombre', precio: 'Precio', tipo: 'Tipo', descripcion: 'Descripción', activo: 'Activo', puesto: 'Puesto', correo: 'Correo', telefono: 'Teléfono', usuario: 'Usuario del portal' };
  function renderCat() {
    var v = $('#v-catalogos');
    if (v.contains(document.activeElement) && document.activeElement.matches('td input, td textarea, td select, .cform input, .cform select')) { pendingCat = true; return; }
    pendingCat = false;
    var focused = document.activeElement && document.activeElement.id, ro = !YO.editor, body = '';
    if (catTab === 'servicios') {
      var rows = S.servicios.slice().sort(function (a, b) { return (a.orden || 0) - (b.orden || 0); });
      body = '<p class="muted">' + (ro ? 'Solo los editores del cotizador pueden cambiar servicios y precios.' : 'Los cambios se guardan al salir de cada campo. Las cotizaciones ya guardadas conservan su precio original.') + '</p>'
        + (ro ? '' : '<div class="row" style="margin-bottom:10px"><button type="button" class="btn sm" id="add-serv">+ Agregar servicio</button></div>')
        + '<div class="tbl-wrap"><table class="t"><thead><tr>' + (ro ? '' : '<th>Orden</th>') + '<th>Servicio</th><th>Tipo</th><th class="r">Precio</th><th>Descripción</th><th>Activo</th></tr></thead><tbody>'
        + (rows.map(function (s, i) {
          if (ro) return '<tr><td><b>' + esc(s.nombre) + '</b></td><td>' + (s.tipo === 'mensual' ? 'Mensual' : 'Único') + '</td><td class="r">' + (Number(s.precio) ? money(s.precio) : '<span class="pill st-vencida">Sin precio</span>') + '</td><td class="cat-desc muted">' + esc(s.descripcion) + '</td><td>' + (s.activo === false ? 'No' : 'Sí') + '</td></tr>';
          return '<tr data-col="servicios" data-id="' + esc(s.id) + '"><td><div class="acts"><button type="button" class="btn ghost sm" data-mover="-1" aria-label="Subir"' + (i ? '' : ' disabled') + '>↑</button><button type="button" class="btn ghost sm" data-mover="1" aria-label="Bajar"' + (i < rows.length - 1 ? '' : ' disabled') + '>↓</button></div></td>'
            + '<td style="min-width:240px"><input class="in" data-f="nombre" value="' + esc(s.nombre) + '" aria-label="Nombre"></td>'
            + '<td><select class="in" data-f="tipo" aria-label="Tipo"><option value="unico"' + (s.tipo !== 'mensual' ? ' selected' : '') + '>Único</option><option value="mensual"' + (s.tipo === 'mensual' ? ' selected' : '') + '>Mensual</option></select></td>'
            + '<td style="min-width:120px"><input class="in num" type="number" min="0" step="0.01" data-f="precio" value="' + esc(s.precio) + '" aria-label="Precio">' + (Number(s.precio) ? '' : '<div class="hint">Sin precio</div>') + '</td>'
            + '<td class="cat-desc"><textarea class="in" rows="2" data-f="descripcion" aria-label="Descripción">' + esc(s.descripcion) + '</textarea></td>'
            + '<td><input type="checkbox" data-f="activo"' + (s.activo === false ? '' : ' checked') + ' aria-label="Activo"></td></tr>';
        }).join('') || '<tr><td colspan="6"><div class="empty">' + (S.cargado.servicios ? 'Aún no hay servicios. ' + (ro ? 'Pídele a un editor del cotizador que los capture.' : 'Agrega el primero.') : 'Cargando servicios…') + '</div></td></tr>')
        + '</tbody></table></div>';
    } else if (catTab === 'clientes') {
      var q = norm(cliQ), all = S.clientes.slice().sort(function (a, b) { return String(a.razon).localeCompare(String(b.razon), 'es'); });
      var hits = q ? all.filter(function (c) { return norm(c.razon).indexOf(q) >= 0 || norm(c.rfc).indexOf(q) >= 0 || norm(c.contacto).indexOf(q) >= 0; }) : all;
      var c = cliEdit;
      body = (c ? '<form class="cform" id="cform"><h2>' + (c.id ? 'Editar cliente' : 'Nuevo cliente') + '</h2>'
        + '<div class="g"><label class="f">Razón social<input class="in" id="c-razon" required value="' + esc(c.razon) + '"></label><label class="f">RFC<input class="in num" id="c-rfc" maxlength="20" spellcheck="false" value="' + esc(c.rfc) + '"' + (c.id ? ' readonly' : '') + '></label><label class="f">Código postal<input class="in num" id="c-cp" maxlength="5" inputmode="numeric" value="' + esc(c.cp) + '"></label></div>'
        + '<div class="g"><label class="f">Contacto<input class="in" id="c-contacto" value="' + esc(c.contacto) + '"></label><label class="f">Teléfono<input class="in" id="c-telefono" value="' + esc(c.telefono) + '"></label><label class="f">Correo<input class="in" id="c-correo" type="email" value="' + esc(c.correo) + '"></label></div>'
        + '<label class="f">Régimen fiscal<select class="in" id="c-regimen"><option value="">Sin capturar</option>' + REGIMENES.map(function (r) { return '<option' + (c.regimen === r ? ' selected' : '') + '>' + r + '</option>'; }).join('') + (c.regimen && REGIMENES.indexOf(c.regimen) < 0 ? '<option selected>' + esc(c.regimen) + '</option>' : '') + '</select></label>'
        + '<div id="c-err"></div><div class="row"><button class="btn primary" type="submit">Guardar cliente</button><button class="btn" type="button" id="c-cancel">Cancelar</button><span class="spacer"></span>'
        + (c.id ? '<button class="btn ghost danger" type="button" id="c-del">' + (c.confirmDel ? 'Confirmar: eliminar' : 'Eliminar') + '</button>' : '') + '</div></form>' : '')
        + '<div class="row" style="margin-bottom:10px"><input class="in" id="cli-q" placeholder="Buscar por razón social, RFC o contacto" value="' + esc(cliQ) + '" style="max-width:420px" aria-label="Buscar cliente"><span class="muted">' + hits.length + ' de ' + all.length + '</span><span class="spacer"></span><button type="button" class="btn sm" id="add-cli">+ Nuevo cliente</button></div>'
        + '<div class="tbl-wrap"><table class="t"><thead><tr><th>Razón social</th><th>RFC</th><th>Contacto</th><th>Teléfono / correo</th><th>Régimen</th><th>Cotizaciones</th><th></th></tr></thead><tbody>'
        + (hits.slice(0, 150).map(function (x) {
          var n = S.cots.filter(function (q2) { return q2.cliente_id === x.id; }).length;
          return '<tr><td><b>' + esc(x.razon) + '</b></td><td class="num">' + esc(x.rfc) + '</td><td>' + (esc(x.contacto) || '<span class="muted">—</span>') + '</td>'
            + '<td>' + (esc([x.telefono, x.correo].filter(Boolean).join(' / ')) || '<span class="muted">—</span>') + '</td><td class="muted">' + (esc(String(x.regimen || '').slice(0, 3)) || '—') + '</td>'
            + '<td class="num">' + (n || '<span class="muted">—</span>') + '</td><td><button type="button" class="btn ghost sm" data-cli="' + esc(x.id) + '">Editar</button></td></tr>';
        }).join('') || '<tr><td colspan="7"><div class="empty">' + (S.cargado.clientes ? (all.length ? 'Sin coincidencias.' : 'Aún no hay clientes. Se agregan aquí o al guardar una cotización.') : 'Cargando clientes…') + '</div></td></tr>')
        + '</tbody></table></div>' + (hits.length > 150 ? '<p class="muted">Mostrando 150 de ' + hits.length + '. Usa el buscador para encontrar el resto.</p>' : '');
    } else {
      body = '<p class="muted">' + (ro ? 'Solo los editores del cotizador pueden cambiar asesores.' : 'Quien firma una cotización sale al pie de la hoja. «Usuario del portal» hace que el asesor se elija solo cuando esa persona cotiza.') + '</p>'
        + (ro ? '' : '<div class="row" style="margin-bottom:10px"><button type="button" class="btn sm" id="add-ase">+ Agregar asesor</button></div>')
        + '<div class="tbl-wrap"><table class="t"><thead><tr><th>Nombre</th><th>Puesto</th><th>Correo</th><th>Teléfono</th><th>Usuario del portal</th><th>Activo</th></tr></thead><tbody>'
        + (S.asesores.map(function (a) {
          var u = S.usuarios.find(function (x) { return x.usuario === a.usuario; });
          if (ro) return '<tr><td><b>' + esc(a.nombre) + '</b></td><td>' + esc(a.puesto) + '</td><td>' + esc(a.correo) + '</td><td class="num">' + esc(a.telefono) + '</td><td>' + esc(u ? u.nombre : a.usuario || '—') + '</td><td>' + (a.activo === false ? 'No' : 'Sí') + '</td></tr>';
          return '<tr data-col="asesores" data-id="' + esc(a.id) + '"><td><input class="in" data-f="nombre" value="' + esc(a.nombre) + '" aria-label="Nombre"></td><td><input class="in" data-f="puesto" value="' + esc(a.puesto) + '" aria-label="Puesto"></td>'
            + '<td><input class="in" data-f="correo" value="' + esc(a.correo) + '" aria-label="Correo"></td><td><input class="in num" data-f="telefono" value="' + esc(a.telefono) + '" aria-label="Teléfono"></td>'
            + '<td><select class="in" data-f="usuario" aria-label="Usuario del portal"><option value="">—</option>' + S.usuarios.map(function (x) { return '<option value="' + esc(x.usuario) + '"' + (x.usuario === a.usuario ? ' selected' : '') + '>' + esc(x.nombre) + '</option>'; }).join('') + '</select></td>'
            + '<td><input type="checkbox" data-f="activo"' + (a.activo === false ? '' : ' checked') + ' aria-label="Activo"></td></tr>';
        }).join('') || '<tr><td colspan="6"><div class="empty">' + (S.cargado.asesores ? 'Aún no hay asesores.' : 'Cargando asesores…') + '</div></td></tr>')
        + '</tbody></table></div>';
    }
    v.innerHTML = '<div class="eyebrow">Listas que alimentan el cotizador</div><div class="vhead"><h2>Catálogos</h2></div>'
      + '<div class="subtabs">' + [['servicios', 'Servicios y precios'], ['clientes', 'Clientes'], ['asesores', 'Asesores']].map(function (t) { return '<button type="button" data-cat="' + t[0] + '" aria-pressed="' + (catTab === t[0]) + '">' + t[1] + '</button>'; }).join('') + '</div>' + body;
    $$('[data-cat]', v).forEach(function (b) { b.onclick = function () { catTab = b.dataset.cat; cliEdit = null; renderCat(); }; });
    $$('tr[data-col]', v).forEach(function (tr) {
      tr.addEventListener('change', function (e) { cambiaCelda(tr, e.target); });
      $$('[data-mover]', tr).forEach(function (b) { b.onclick = function () { moverServicio(tr.dataset.id, Number(b.dataset.mover)); }; });
    });
    var addS = $('#add-serv'); if (addS) addS.onclick = altaServicio;
    var addA = $('#add-ase'); if (addA) addA.onclick = altaAsesor;
    var cq = $('#cli-q'); if (cq) cq.oninput = function (e) { cliQ = e.target.value; renderCatSoon(); };
    var ac = $('#add-cli'); if (ac) ac.onclick = function () { cliEdit = { id: null, razon: '', rfc: '', contacto: '', telefono: '', correo: '', cp: '', regimen: '' }; renderCat(); $('#c-razon').focus(); };
    $$('[data-cli]', v).forEach(function (b) { b.onclick = function () { cliEdit = Object.assign({}, S.clientes.find(function (x) { return x.id === b.dataset.cli; })); renderCat(); window.scrollTo(0, 0); }; });
    if ($('#cform')) bindClienteForm();
    if (focused === 'cli-q') { var i = $('#cli-q'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
  }
  var catT;
  function renderCatSoon() { clearTimeout(catT); catT = setTimeout(function () { var a = document.activeElement; if (a && a.id === 'cli-q') { a.blur(); renderCat(); } else renderCat(); }, 120); }
  async function actualizaFila(tabla, id, cambios) {
    var r = await sb.from(tabla).update(cambios).eq('id', id).select('id');
    if (r.error) throw r.error;
    if (!r.data || !r.data.length) { var e = new Error('sin permiso'); e.code = '42501'; throw e; }
  }
  async function cambiaCelda(tr, el) {
    var f = el.dataset.f; if (!f) return;
    var val = el.type === 'checkbox' ? el.checked : el.value;
    if (f === 'precio') val = Math.max(0, cents(val) / 100);
    if (typeof val === 'string') val = val.trim();
    if (f === 'usuario' && !val) val = null;
    if (f === 'nombre' && !val) { toast('El nombre no puede quedar vacío.'); rerender(tr.dataset.col); return; }
    var lista = tr.dataset.col === 'servicios' ? S.servicios : S.asesores;
    var rec = lista.find(function (x) { return x.id === tr.dataset.id; }) || {};
    var fm = FMT_CAT[f] || (f === 'usuario' ? function (x) { var u = S.usuarios.find(function (y) { return y.usuario === x; }); return u ? u.nombre : (x || ''); } : function (x) { return x == null ? '' : x; });
    var antes = fm(rec[f]), despues = fm(val);
    try {
      var c = {}; c[f] = val;
      await actualizaFila(tr.dataset.col === 'servicios' ? 'cot_servicios' : 'cot_asesores', tr.dataset.id, c);
      rec[f] = val;
      toast('Guardado');
      if (String(antes) !== String(despues)) logEv(tr.dataset.col === 'servicios' ? 'srv.cambio' : 'ase.cambio', tr.dataset.id, String(rec.nombre || ''), [{ campo: LBL_CAT[f] || f, antes: antes === '' ? '(vacío)' : antes, despues: despues === '' ? '(vacío)' : despues }]);
      if (f === 'precio' && el.closest('td')) { var h = el.closest('td').querySelector('.hint'); if (val > 0 && h) h.remove(); }
    } catch (e) { toast(mensajeError(e, 'No se pudo guardar el cambio.'), 5000); }
  }
  async function moverServicio(id, dir) {
    var rows = S.servicios.slice().sort(function (a, b) { return (a.orden || 0) - (b.orden || 0); });
    var i = rows.findIndex(function (s) { return s.id === id; }), j = i + dir;
    if (i < 0 || j < 0 || j >= rows.length) return;
    try {
      // Se renumera la lista completa para que el orden quede limpio
      var nuevo = rows.slice(); var t = nuevo[i]; nuevo[i] = nuevo[j]; nuevo[j] = t;
      for (var k = 0; k < nuevo.length; k++) if (nuevo[k].orden !== k + 1) { await actualizaFila('cot_servicios', nuevo[k].id, { orden: k + 1 }); nuevo[k].orden = k + 1; }
      S.servicios = nuevo; renderCat();
    } catch (e) { toast(mensajeError(e, 'No se pudo cambiar el orden.')); await carga(['servicios']); renderCat(); }
  }
  async function altaServicio() {
    var orden = S.servicios.reduce(function (m, s) { return Math.max(m, s.orden || 0); }, 0) + 1;
    var r = await sb.from('cot_servicios').insert({ nombre: 'Nuevo servicio', precio: 0, descripcion: '', tipo: 'unico', activo: true, orden: orden }).select('id').single();
    if (r.error) { toast(mensajeError(r.error, 'No se pudo agregar.')); return; }
    toast('Servicio agregado al final de la lista'); logEv('srv.alta', r.data.id, 'Nuevo servicio (sin precio)');
    await carga(['servicios']); renderCat();
  }
  async function altaAsesor() {
    var r = await sb.from('cot_asesores').insert({ nombre: 'Nuevo asesor', puesto: '', correo: '', telefono: '', activo: true }).select('id').single();
    if (r.error) { toast(mensajeError(r.error, 'No se pudo agregar.')); return; }
    toast('Asesor agregado'); logEv('ase.alta', r.data.id, 'Nuevo asesor');
    await carga(['asesores']); renderCat();
  }
  function bindClienteForm() {
    $('#c-rfc').oninput = function (e) { e.target.value = e.target.value.toUpperCase().replace(/\s/g, ''); };
    $('#c-cancel').onclick = function () { cliEdit = null; renderCat(); };
    var del = $('#c-del');
    if (del) del.onclick = async function () {
      var n = S.cots.filter(function (q) { return q.cliente_id === cliEdit.id; }).length;
      if (!cliEdit.confirmDel) { cliEdit.confirmDel = true; renderCat(); if (n) toast('Tiene ' + n + ' cotización(es); se conservan con sus datos aunque se elimine el cliente.', 5000); return; }
      var old = Object.assign({}, cliEdit);
      var r = await sb.from('cot_clientes').delete().eq('id', cliEdit.id).select('id');
      if (r.error || !r.data || !r.data.length) { toast(mensajeError(r.error, 'No se pudo eliminar.')); return; }
      cliEdit = null; toast('Cliente eliminado'); logEv('cli.baja', old.id, old.razon + ' (' + old.rfc + ')');
      await carga(['clientes']); renderCat();
    };
    $('#cform').onsubmit = async function (e) {
      e.preventDefault();
      var c = { razon: $('#c-razon').value.trim(), rfc: $('#c-rfc').value.trim().toUpperCase(), contacto: $('#c-contacto').value.trim(), telefono: $('#c-telefono').value.trim(), correo: $('#c-correo').value.trim(), cp: $('#c-cp').value.trim(), regimen: $('#c-regimen').value };
      var err = !c.razon ? 'Captura la razón social.' : !RFC_RE.test(c.rfc) ? 'El RFC no tiene formato válido.' : (!cliEdit.id && S.clientes.some(function (x) { return x.rfc === c.rfc; })) ? 'Ya existe un cliente con ese RFC.' : (c.cp && !/^\d{5}$/.test(c.cp)) ? 'El código postal lleva 5 dígitos.' : '';
      if (err) { $('#c-err').innerHTML = '<div class="errors">' + esc(err) + '</div>'; return; }
      var old = cliEdit.id ? S.clientes.find(function (x) { return x.id === cliEdit.id; }) || {} : null;
      try {
        var id = cliEdit.id;
        if (old) { delete c.rfc; await actualizaFila('cot_clientes', id, c); c.rfc = old.rfc; }
        else { var r = await sb.from('cot_clientes').insert(c).select('id').single(); if (r.error) throw r.error; id = r.data.id; }
        cliEdit = null; toast('Cliente guardado');
        if (!old) logEv('cli.alta', id, c.razon + ' (' + c.rfc + ')');
        else { var ch = difCampos(old, c, [['razon', 'Razón social'], ['contacto', 'Contacto'], ['telefono', 'Teléfono'], ['correo', 'Correo'], ['cp', 'Código postal'], ['regimen', 'Régimen fiscal']]); if (ch.length) logEv('cli.cambio', id, c.razon + ' (' + c.rfc + ')', ch); }
        await carga(['clientes']); renderCat();
      } catch (x) { $('#c-err').innerHTML = '<div class="errors">' + esc(mensajeError(x, 'No se pudo guardar el cliente.')) + '</div>'; }
    };
  }

  // ================= Bitácora =================
  var B = { mes: hoyISO().slice(0, 7), meses: [], data: [], cargado: false, cargando: false, f: { q: '', usr: '', area: '' } };
  async function cargarBit() {
    if (B.cargando) return;
    B.cargando = true;
    try {
      if (!B.meses.length) {
        var pr = await sb.from('cot_bitacora').select('t').order('t', { ascending: true }).limit(1);
        var ini = pr.data && pr.data[0] ? new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit' }).format(new Date(pr.data[0].t)).slice(0, 7) : B.mes;
        var m = ini, lista = [];
        while (m <= hoyISO().slice(0, 7) && lista.length < 240) { lista.push(m); m = mesSig(m); }
        B.meses = lista.reverse();
      }
      var out = [], paso = 1000;
      for (var i = 0; ; i += paso) {
        var r = await sb.from('cot_bitacora').select('*').gte('t', B.mes + '-01T00:00:00-06:00').lt('t', mesSig(B.mes) + '-01T00:00:00-06:00')
          .order('t', { ascending: false }).range(i, i + paso - 1);
        if (r.error) throw r.error;
        out = out.concat(r.data || []);
        if (!r.data || r.data.length < paso) break;
      }
      B.data = out; B.cargado = true;
    } catch (e) { console.warn(e); toast('No se pudo cargar la bitácora.'); }
    B.cargando = false;
    if (vista() === 'bitacora') renderBit();
  }
  function renderBit() {
    var v = $('#v-bitacora'), focused = document.activeElement && document.activeElement.id, q = norm(B.f.q);
    var personas = {};
    B.data.forEach(function (e) { if (e.usuario) personas[e.usuario] = e.nombre || e.usuario; });
    var rows = B.data.filter(function (e) {
      var area = (ACCIONES[e.tipo] || ['Otros'])[0];
      if (B.f.usr && e.usuario !== B.f.usr) return false;
      if (B.f.area && area !== B.f.area) return false;
      if (q && norm(e.resumen + ' ' + (e.cambios || []).map(function (c) { return c.campo + ' ' + c.antes + ' ' + c.despues; }).join(' ')).indexOf(q) < 0) return false;
      return true;
    });
    var areas = Array.from(new Set(Object.keys(ACCIONES).map(function (k) { return ACCIONES[k][0]; })));
    v.innerHTML = '<div class="vhead"><div><div class="eyebrow">Quién hizo qué y cuándo</div><h2>Bitácora</h2></div><span class="spacer"></span><button type="button" class="btn" id="b-reload">Actualizar</button></div>'
      + '<p class="muted" style="max-width:76ch;margin:4px 0 0">Se registran cotizaciones (creación, cambios, emisión, estatus y PDF), cambios de precios, clientes, asesores, ajustes y respaldos. La base solo deja agregar renglones: nadie puede cambiar ni borrar lo que quedó registrado.</p>'
      + '<div class="bit-filters"><input class="in" id="b-q" placeholder="Buscar folio, cliente, servicio o dato" value="' + esc(B.f.q) + '" aria-label="Buscar en la bitácora">'
      + '<select class="in" id="b-mes" aria-label="Mes">' + (B.meses.length ? B.meses : [B.mes]).map(function (m) { return '<option value="' + m + '"' + (m === B.mes ? ' selected' : '') + '>' + mesTxt(m) + '</option>'; }).join('') + '</select>'
      + '<select class="in" id="b-usr" aria-label="Persona"><option value="">Todas las personas</option>' + Object.keys(personas).sort().map(function (u) { return '<option value="' + esc(u) + '"' + (u === B.f.usr ? ' selected' : '') + '>' + esc(personas[u]) + '</option>'; }).join('') + '</select>'
      + '<select class="in" id="b-area" aria-label="Área"><option value="">Todas las áreas</option>' + areas.map(function (a) { return '<option' + (a === B.f.area ? ' selected' : '') + '>' + a + '</option>'; }).join('') + '</select>'
      + '<span class="muted num" style="padding-bottom:8px">' + rows.length + ' registros</span></div>'
      + '<div class="tbl-wrap"><table class="t"><thead><tr><th>Fecha y hora</th><th>Persona</th><th>Área</th><th>Acción</th><th>Detalle</th></tr></thead><tbody>'
      + (rows.length ? rows.map(function (e) {
        var a = ACCIONES[e.tipo] || ['Otros', e.tipo];
        return '<tr><td class="num" style="white-space:nowrap">' + esc(fmtDT(e.t)) + '</td><td style="white-space:nowrap">' + esc(e.nombre || e.usuario || 'Sistema') + '</td>'
          + '<td><span class="area a-' + esc(a[0].split(' ')[0]) + '">' + esc(a[0]) + '</span></td><td style="white-space:nowrap"><b>' + esc(a[1]) + '</b></td>'
          + '<td class="det">' + esc(e.resumen) + chgHTML(e.cambios) + '</td></tr>';
      }).join('') : '<tr><td colspan="5"><div class="empty">' + (B.cargado ? 'Sin registros para este mes y filtros.' : 'Cargando bitácora…') + '</div></td></tr>')
      + '</tbody></table></div>';
    $('#b-reload').onclick = cargarBit;
    $('#b-mes').onchange = function (e) { B.mes = e.target.value; B.data = []; B.cargado = false; renderBit(); cargarBit(); };
    $('#b-usr').onchange = function (e) { B.f.usr = e.target.value; renderBit(); };
    $('#b-area').onchange = function (e) { B.f.area = e.target.value; renderBit(); };
    $('#b-q').oninput = function (e) { B.f.q = e.target.value; clearTimeout(B.t); B.t = setTimeout(renderBit, 150); };
    if (focused === 'b-q') { var i = $('#b-q'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
  }

  // ================= Ajustes =================
  var ultimoRespaldo = undefined;
  async function cargaUltimoRespaldo() {
    var r = await sb.from('cot_bitacora').select('t,nombre,resumen').eq('tipo', 'bk.descarga').order('t', { ascending: false }).limit(1);
    ultimoRespaldo = r.data && r.data[0] ? r.data[0] : null;
    var e = $('#bk-last'); if (e) e.textContent = ultimoRespaldoTxt();
  }
  function ultimoRespaldoTxt() {
    if (ultimoRespaldo === undefined) return '';
    if (!ultimoRespaldo) return 'Aún nadie ha descargado un respaldo en Excel.';
    var dias = Math.floor((Date.now() - Date.parse(ultimoRespaldo.t)) / 86400000);
    return 'Último: ' + fmtDT(ultimoRespaldo.t) + ' por ' + (ultimoRespaldo.nombre || '—') + (dias >= 7 ? ' · hace ' + dias + ' días' : '');
  }
  function renderAjustes() {
    var v = $('#v-ajustes'), A = aj(), p = A.pago || {}, ro = !YO.editor;
    if (v.contains(document.activeElement) && document.activeElement.matches('input, textarea')) return;
    var dis = ro ? ' disabled' : '';
    v.innerHTML = '<div class="eyebrow">Valores para cotizaciones nuevas</div><div class="vhead"><h2>Ajustes</h2></div>'
      + '<p class="muted" style="margin:4px 0 14px">' + (ro ? 'Solo los editores del cotizador pueden cambiar estos datos.' : 'Se aplican a las cotizaciones que se guarden a partir de ahora. Las ya guardadas conservan sus datos.') + '</p>'
      + '<div class="settings" style="margin-bottom:14px"><div class="panel"><h2>Respaldo</h2>'
      + '<p class="muted" style="margin:0">Cada noche se guarda solo una copia completa del cotizador en el repositorio privado del portal. Además, aquí puedes bajar en Excel todas las cotizaciones con sus partidas, clientes, servicios, asesores, ajustes y bitácora.</p>'
      + '<div class="row"><button type="button" class="btn primary" data-act="backup">Descargar respaldo en Excel</button><span class="muted" id="bk-last">' + esc(ultimoRespaldoTxt()) + '</span></div></div></div>'
      + '<form class="settings" id="aj-form">'
      + '<div class="panel"><h2>Cotización</h2>'
      + '<div class="grid3"><label class="f">Prefijo del folio<input class="in" id="a-prefijo" maxlength="8" value="' + esc(A.prefijo) + '"' + dis + '></label><label class="f">Vigencia (días)<input class="in num" type="number" min="1" max="365" id="a-vigencia" value="' + esc(A.vigencia) + '"' + dis + '></label><label class="f">IVA (%)<input class="in num" type="number" step="0.01" min="0" max="100" id="a-iva" value="' + Math.round((Number(A.iva) || 0) * 10000) / 100 + '"' + dis + '></label></div>'
      + '<label class="f">Siguiente folio<input class="in num" type="number" min="1" step="1" id="a-folio" value="' + siguienteFolio() + '"' + dis + '></label>'
      + '<p class="muted" style="margin:0">El folio lo asigna el sistema al guardar y nunca se repite. Si ya se emitieron folios en otro lado, pon aquí desde qué número sigue; nunca baja del último usado.</p></div>'
      + '<div class="panel"><h2>Condiciones y notas</h2><p class="muted" style="margin:0">Una por renglón. La línea de vigencia se agrega sola al inicio.</p>'
      + '<textarea class="in" id="a-cond" rows="6"' + dis + '>' + esc((A.condiciones || []).join('\n')) + '</textarea></div>'
      + '<div class="panel"><h2>Datos para pago</h2>'
      + '<label class="f">Beneficiario<input class="in" id="a-benef" value="' + esc(p.beneficiario) + '"' + dis + '></label>'
      + '<div class="grid2"><label class="f">RFC<input class="in num" id="a-rfc" maxlength="20" spellcheck="false" value="' + esc(p.rfc) + '"' + dis + '></label><label class="f">Banco<input class="in" id="a-banco" value="' + esc(p.banco) + '"' + dis + '></label></div>'
      + '<div class="grid2"><label class="f">Cuenta<input class="in num" id="a-cuenta" value="' + esc(p.cuenta) + '"' + dis + '></label><label class="f">CLABE<input class="in num" id="a-clabe" maxlength="18" inputmode="numeric" value="' + esc(p.clabe) + '"' + dis + '></label></div>'
      + '<label class="f">Texto del pie de página<input class="in" id="a-pie" value="' + esc(A.pie) + '"' + dis + '></label></div>'
      + (ro ? '' : '<div class="row"><button class="btn primary" type="submit">Guardar ajustes</button><span id="a-err"></span></div>')
      + '</form>';
    $('#aj-form').onsubmit = async function (e) {
      e.preventDefault(); if (ro) return;
      var clabe = $('#a-clabe').value.trim();
      if (clabe && !/^\d{18}$/.test(clabe)) { $('#a-err').innerHTML = '<span class="hint">La CLABE lleva 18 dígitos.</span>'; return; }
      var iva = Number($('#a-iva').value);
      if (!(iva >= 0 && iva <= 100)) { $('#a-err').innerHTML = '<span class="hint">Revisa el IVA.</span>'; return; }
      var body = {
        prefijo: $('#a-prefijo').value.trim().toUpperCase() || 'DEC', vigencia: Math.min(365, Math.max(1, parseInt($('#a-vigencia').value, 10) || 15)),
        iva: Math.round(iva * 100) / 10000, siguiente_folio: Math.max(1, parseInt($('#a-folio').value, 10) || 1),
        condiciones: $('#a-cond').value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean),
        pago: { beneficiario: $('#a-benef').value.trim(), rfc: $('#a-rfc').value.replace(/\s/g, '').toUpperCase(), banco: $('#a-banco').value.trim(), cuenta: $('#a-cuenta').value.trim(), clabe: clabe },
        pie: $('#a-pie').value.trim()
      };
      var A0 = aj(), ch = difCampos(Object.assign({}, A0, { siguiente_folio: siguienteFolio() }), body, [['prefijo', 'Prefijo del folio'], ['vigencia', 'Vigencia (días)'], ['iva', 'IVA', pct], ['siguiente_folio', 'Siguiente folio'], ['pie', 'Texto del pie'], ['condiciones', 'Condiciones y notas', function (x) { return (x || []).join(' | '); }]])
        .concat(difCampos(A0.pago || {}, body.pago, [['beneficiario', 'Beneficiario'], ['rfc', 'RFC para pago'], ['banco', 'Banco'], ['cuenta', 'Cuenta'], ['clabe', 'CLABE']]));
      try {
        await actualizaFila('cot_ajustes', 1, body);
        toast('Ajustes guardados'); document.activeElement.blur();
        if (ch.length) logEv('aj.cambio', 'general', ch.some(function (x) { return ['Cuenta', 'CLABE', 'Banco', 'Beneficiario', 'RFC para pago'].indexOf(x.campo) >= 0; }) ? 'Cambió datos bancarios' : 'Ajustes de cotización', ch);
        await carga(['ajustes']); rerender('ajustes');
      } catch (x) { toast(mensajeError(x, 'No se pudieron guardar los ajustes.'), 5000); }
    };
  }

  // ================= Respaldo en Excel =================
  var respaldando = false;
  async function respaldo(btn) {
    if (respaldando) return;
    if (!window.XLSX) { toast('El generador de Excel no cargó. Recarga la página.'); return; }
    respaldando = true; var txt = btn && btn.textContent; if (btn) { btn.disabled = true; btn.textContent = 'Preparando respaldo…'; }
    try {
      var res = await Promise.all([todas('cot_cotizaciones', 'folio'), todas('cot_clientes', 'razon'), todas('cot_servicios', 'orden'), todas('cot_asesores', 'nombre'), todas('cot_bitacora', 't')]);
      var cots = res[0], clientes = res[1], servicios = res[2], asesores = res[3], bit = res[4], A = aj(), p = A.pago || {};
      var hCot = cots.map(function (q) {
        var k = calc(q);
        return {
          Folio: folioTxt(q), 'Folio núm.': q.folio, Fecha: fdate(q.fecha), 'Vigencia (días)': q.vigencia, 'Válida hasta': fdate(addDays(q.fecha, q.vigencia)),
          Estatus: ESTATUS[efectivo(q)], 'Estatus guardado': ESTATUS[q.estatus], Cliente: q.cliente, RFC: q.rfc, Contacto: q.contacto, 'Teléfono / correo': q.telefono,
          Asesor: q.asesor && q.asesor.nombre ? q.asesor.nombre : '', Servicios: (q.items || []).length, Subtotal: Number(q.subtotal), 'Descuento %': Math.round(k.descPct * 10000) / 100,
          Descuento: Number(q.descuento_monto), 'IVA %': Math.round(Number(q.iva) * 10000) / 100, IVA: Number(q.iva_monto), Total: Number(q.total),
          'Pago único (sin IVA)': k.unico, 'Honorario mensual (sin IVA)': k.mensual, 'Notas adicionales': q.nota || '', 'Condiciones': (q.condiciones || []).join(' | '),
          'Duplicada de': q.duplicado_de || '', Creada: fmtDT(q.creado), 'Creada por': q.creado_por || '', 'Última modificación': fmtDT(q.actualizado), 'Modificada por': q.actualizado_por || ''
        };
      });
      var hPart = [];
      cots.forEach(function (q) { (q.items || []).forEach(function (i, n) { hPart.push({ Folio: folioTxt(q), 'Folio núm.': q.folio, Cliente: q.cliente, 'No.': n + 1, Servicio: i.servicio, Tipo: i.tipo === 'mensual' ? 'Mensual' : 'Único', Cantidad: Number(i.cantidad), 'Precio unitario': Number(i.precio), Importe: Math.round(Number(i.cantidad) * cents(i.precio)) / 100, Descripción: i.descripcion || '' }); }); });
      var hCli = clientes.map(function (c) { return { 'Razón social': c.razon, RFC: c.rfc, Contacto: c.contacto, Teléfono: c.telefono, Correo: c.correo, 'Código postal': c.cp, 'Régimen fiscal': c.regimen, Alta: fmtDT(c.creado), 'Alta por': c.creado_por || '' }; });
      var hSer = servicios.map(function (x) { return { Orden: x.orden, Servicio: x.nombre, Tipo: x.tipo === 'mensual' ? 'Mensual' : 'Único', 'Precio (MXN)': Number(x.precio), Activo: x.activo === false ? 'No' : 'Sí', Descripción: x.descripcion }; });
      var hAse = asesores.map(function (a) { return { Nombre: a.nombre, Puesto: a.puesto, Correo: a.correo, Teléfono: a.telefono, 'Usuario del portal': a.usuario || '', Activo: a.activo === false ? 'No' : 'Sí' }; });
      var hAj = [['Fecha del respaldo', fmtDT(new Date().toISOString())], ['Siguiente folio', A.prefijo + ' - ' + siguienteFolio()], ['Prefijo', A.prefijo], ['Vigencia (días)', A.vigencia], ['IVA %', Math.round(Number(A.iva) * 10000) / 100],
        ['Beneficiario', p.beneficiario || ''], ['RFC', p.rfc || ''], ['Banco', p.banco || ''], ['Cuenta', p.cuenta || ''], ['CLABE', p.clabe || ''], ['Pie', A.pie || '']]
        .concat((A.condiciones || []).map(function (c, i) { return ['Condición ' + (i + 1), c]; }));
      var hBit = bit.map(function (e) { var a = ACCIONES[e.tipo] || ['Otros', e.tipo]; return { 'Fecha y hora': fmtDT(e.t), Persona: e.nombre || e.usuario || '', Área: a[0], Acción: a[1], Detalle: e.resumen, Cambios: (e.cambios || []).map(function (c) { return c.campo + ': ' + c.antes + ' → ' + c.despues; }).join(' | ') }; });
      var X = window.XLSX, wb = X.utils.book_new();
      function hoja(rows, nombre, anchos, dinero) {
        var ws = Array.isArray(rows[0]) ? X.utils.aoa_to_sheet([['Concepto', 'Valor']].concat(rows)) : X.utils.json_to_sheet(rows.length ? rows : [{ 'Sin datos': '' }]);
        ws['!cols'] = anchos.map(function (w) { return { wch: w }; });
        if (dinero && rows.length && !Array.isArray(rows[0])) {
          var keys = Object.keys(rows[0]);
          dinero.forEach(function (m) { var c = keys.indexOf(m); if (c < 0) return; for (var r = 1; r <= rows.length; r++) { var cell = ws[X.utils.encode_cell({ r: r, c: c })]; if (cell && cell.t === 'n') cell.z = '"$"#,##0.00'; } });
        }
        if (rows.length && !Array.isArray(rows[0])) ws['!autofilter'] = { ref: ws['!ref'] };
        X.utils.book_append_sheet(wb, ws, nombre);
      }
      hoja(hCot, 'Cotizaciones', [12, 9, 11, 9, 11, 11, 11, 40, 15, 28, 22, 22, 9, 14, 10, 13, 7, 13, 14, 16, 18, 30, 40, 11, 16, 18, 16, 18], ['Subtotal', 'Descuento', 'IVA', 'Total', 'Pago único (sin IVA)', 'Honorario mensual (sin IVA)']);
      hoja(hPart, 'Partidas', [12, 9, 36, 5, 40, 9, 9, 14, 14, 80], ['Precio unitario', 'Importe']);
      hoja(hCli, 'Clientes', [48, 15, 28, 18, 28, 12, 40, 16, 18]);
      hoja(hSer, 'Servicios', [7, 48, 9, 13, 7, 90], ['Precio (MXN)']);
      hoja(hAse, 'Asesores', [24, 30, 30, 15, 20, 7]);
      hoja(hAj, 'Ajustes', [22, 90]);
      hoja(hBit, 'Bitácora', [16, 24, 18, 28, 50, 90]);
      var buf = X.write(wb, { bookType: 'xlsx', type: 'array', compression: true });
      var nombre = 'Respaldo cotizador DECOMSA ' + hoyISO() + '.xlsx';
      bajar(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), nombre);
      toast('Respaldo listo: ' + nombre);
      await logEv('bk.descarga', '', cots.length + ' cotizaciones, ' + clientes.length + ' clientes, ' + bit.length + ' registros de bitácora');
      cargaUltimoRespaldo();
    } catch (e) { console.error(e); toast('No se pudo generar el respaldo. Intenta de nuevo.'); }
    finally { respaldando = false; if (btn && btn.isConnected) { btn.disabled = false; btn.textContent = txt; } }
  }

  // ================= Navegación =================
  function vista() { var v = (location.hash || '#nueva').slice(1); return ['nueva', 'cotizaciones', 'catalogos', 'bitacora', 'ajustes'].indexOf(v) >= 0 ? v : 'nueva'; }
  function route() {
    var v = vista();
    $$('[data-view]').forEach(function (s) { s.hidden = s.dataset.view !== v; });
    $$('[data-nav]').forEach(function (a) { if (a.dataset.nav === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    if (v === 'nueva') requestAnimationFrame(fitDoc);
    if (v === 'cotizaciones') renderHist();
    if (v === 'catalogos') renderCat();
    if (v === 'ajustes') { renderAjustes(); cargaUltimoRespaldo(); }
    if (v === 'bitacora') { renderBit(); cargarBit(); }
  }
  function rerender(que) {
    var v = vista();
    if (que === 'servicios' || que === 'asesores' || que === 'ajustes') {
      syncDraftAjustes();
      var a = document.activeElement, enItems = a && $('#items').contains(a);
      if (que === 'asesores') renderAsesorSelect();
      if (que === 'servicios' && !enItems) renderItems();
      renderDoc(); renderEdHead();
    }
    if (que === 'cots') renderEdHead();
    if (v === 'cotizaciones' && (que === 'cots' || que === 'ajustes')) renderHist();
    if (v === 'catalogos') renderCat();
    if (v === 'ajustes' && (que === 'ajustes' || que === 'cots')) renderAjustes();
  }

  // ================= Arranque =================
  async function cargaLogos() {
    await Promise.all(Object.keys(LOGO_SRC).map(async function (k) {
      if (LOGO[k]) return;
      try {
        var b = await (await fetch(LOGO_SRC[k])).blob();
        LOGO[k] = await new Promise(function (res, rej) { var fr = new FileReader(); fr.onload = function () { res(fr.result); }; fr.onerror = rej; fr.readAsDataURL(b); });
      } catch (e) { console.warn('logo', k, e); }
    }));
  }
  async function start() {
    draft = nuevoDraft();
    bindEditor(); fillForm(); route();
    window.addEventListener('hashchange', route);
    if (window.ResizeObserver) new ResizeObserver(fitDoc).observe($('#pv-scale'));
    $('#v-catalogos').addEventListener('focusout', function () { setTimeout(function () { if (pendingCat && !$('#v-catalogos').contains(document.activeElement)) renderCat(); }, 50); });

    var P = window.PORTAL;
    if (!P || !P.listo) { setSync('off', 'Sin conexión'); return; }
    try { await P.listo; } catch (e) { return; }   // sin sesión o sin permiso: portal.js ya redirigió
    sb = P.sb;
    try {
      var r = await sb.rpc('cot_yo'); if (r.error) throw r.error;
      YO = r.data || YO;
      var u = await sb.rpc('cot_usuarios'); S.usuarios = u.data || [];
      await carga(['ajustes', 'servicios', 'asesores', 'clientes', 'cots']);
      var f = await sb.rpc('cot_firma'); S.firma = f.data || null;
      setSync('ok', 'En línea');
    } catch (e) {
      console.error(e); setSync('off', 'Sin conexión');
      $('#banner').innerHTML = '<div class="banner">No se pudo leer el cotizador. Revisa tu conexión y recarga la página.</div>';
      return;
    }
    if (editing == null) { var keep = draft; draft = nuevoDraft(); ['cliente', 'rfc', 'contacto', 'telefono', 'nota'].forEach(function (k) { if (keep[k]) draft[k] = keep[k]; }); }
    fillForm(); route();
    cargaLogos();
    setInterval(revisaCambios, CADA);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) revisaCambios(); });
    window.addEventListener('focus', revisaCambios);
  }
  start();
})();
