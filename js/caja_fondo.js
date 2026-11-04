/* Caja chica · fondo fijo de $10,000 (petición de Fernando Cadengo del 4-nov-2026 con la idea de Gabriel Cavazos; la
   autorizó Héctor Daniel Nava). Lo usa la pestaña Caja chica (cajachica.html):
     · las categorías de los gastos;
     · la solicitud de reposición en formato de estado de cuenta (de «Saldo inicial · fondo surtido» a «Saldo al corte»
       y «Se solicita reponer», con separación y subtotal por mes si junta dos meses), para verla en pantalla;
     · su PDF con la marca PROFASE (js/marca.js).
   Lo que se autorizó a sí mismo quien lo autorizó (g.auto, lo decide la base: caja_auto()) sale marcado en cada renglón
   y en un recuadro «Para revisar antes de depositar», para que Eva lo revise (Héctor Daniel Nava, 4-nov-2026).
   Los datos los da la base (portal/sql/237_caja_fondo.sql: caja_fondo_estado y caja_repo_ver); aquí solo se pintan.
   Uso: CAJA_FONDO.ver(repo, {dl}) abre la vista con «Bajar PDF»; CAJA_FONDO.pdf(repo, dl) baja el PDF. */
(function () {
  'use strict';
  var CATS_V = [
    { id: 'tramites', label: 'Trámites y derechos' },
    { id: 'traslados', label: 'Traslados', ruta: true },
    { id: 'gasolina', label: 'Gasolina', ruta: true },
    { id: 'casetas', label: 'Casetas', ruta: true },
    { id: 'estacionamiento', label: 'Estacionamiento', ruta: true },
    { id: 'kilometraje', label: 'Kilometraje (vehículo propio)', ruta: true, km: true },
    { id: 'papeleria', label: 'Papelería' },
    { id: 'mensajeria', label: 'Mensajería y copias' },
    { id: 'alimentos', label: 'Alimentos' },
    { id: 'otros', label: 'Otros' }
  ];
  var CATS_I = [
    { id: 'cumpleanos', label: 'Cumpleaños' },
    { id: 'festejos', label: 'Decoración y festejos' },
    { id: 'papeleria_oficina', label: 'Papelería y consumibles' },
    { id: 'cafeteria', label: 'Cafetería y limpieza' },
    { id: 'otros_interno', label: 'Otros (interno)' }
  ];
  var FESTIVOS = { cumpleanos: 1, festejos: 1 };
  var MESL = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var mxn = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

  function cat(id) {
    var l = CATS_V.concat(CATS_I);
    for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i].label;
    return id || '—';
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { return mxn.format(Number(n) || 0); }
  function fecha(s) { var p = String(s || '').slice(0, 10).split('-'); return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : (s || ''); }
  function nomMes(f) { var p = String(f || '').split('-'); return p.length < 2 ? f : MESL[+p[1] - 1] + ' ' + p[0]; }
  // a dónde fue el dinero: a un cliente o grupo, a festejos y RH, o a la oficina
  function destino(g) {
    if (g.rel === 'cliente' || g.rel === 'grupo') return 'Clientes';
    if (g.tipo === 'interno' && FESTIVOS[g.categoria]) return 'Festividades y RH';
    return 'Oficina';
  }
  function relTxt(g) {
    if (g.rel === 'grupo') return g.grupo ? 'Grupo ' + g.grupo : '';
    if (g.rel === 'cliente' || g.cliente) return (g.cliente || '') + (g.rfc ? ' · ' + g.rfc : '') + (g.grupo ? ' · ' + g.grupo : '');
    return '';
  }
  function sello(r) {
    switch (r.estado) {
      case 'solicitada': return { t: 'POR DEPOSITAR', c: '' };
      case 'depositada': return { t: 'DEPOSITADA ' + fecha(r.dep_fecha), c: 'az' };
      case 'recibida': return { t: 'SURTIDA ' + fecha(r.rec_en), c: 'ok' };
      case 'cancelada': return { t: 'CANCELADA', c: 'gr' };
      default: return { t: 'VISTA PREVIA', c: 'gr' };
    }
  }
  // Las filas del estado de cuenta, en orden, con separación y subtotal por mes si junta dos o más meses
  function filas(r) {
    var G = (r.gastos || []).slice().sort(function (a, b) { return String(a.fecha).localeCompare(String(b.fecha)); });
    var meses = {}; G.forEach(function (g) { meses[String(g.fecha).slice(0, 7)] = 1; });
    var varios = Object.keys(meses).length > 1, saldo = Number(r.saldo_ini) || 0, mes = '', sub = 0, out = [];
    function cierra() { if (varios && mes) out.push({ k: 'sub', t: 'Subtotal de ' + nomMes(mes), v: sub }); }
    G.forEach(function (g) {
      var m = String(g.fecha).slice(0, 7);
      if (m !== mes) { cierra(); mes = m; sub = 0; if (varios) out.push({ k: 'mes', t: nomMes(m).toUpperCase() }); }
      saldo -= Number(g.importe) || 0; sub += Number(g.importe) || 0;
      out.push({ k: 'g', g: g, saldo: saldo });
    });
    cierra();
    return { filas: out, n: G.length, saldo: saldo };
  }
  function revisar(r) {
    var G = (r.gastos || []).filter(function (g) { return g.auto; }), t = 0;
    G.forEach(function (g) { t += Number(g.importe) || 0; });
    return { n: G.length, total: t };
  }
  function resumen(r) {
    var d = {}; (r.gastos || []).forEach(function (g) { var k = destino(g); d[k] = (d[k] || 0) + (Number(g.importe) || 0); });
    return ['Clientes', 'Festividades y RH', 'Oficina'].filter(function (k) { return d[k]; }).map(function (k) { return { t: k, v: d[k] }; });
  }

  var CSS = '.cfv{position:fixed;inset:0;z-index:60;background:rgba(10,16,28,.55);display:flex;flex-direction:column;align-items:center;overflow:auto;padding:12px;overscroll-behavior:contain}'
    + '.cfv-bar{position:sticky;top:0;z-index:2;display:flex;gap:8px;justify-content:flex-end;width:100%;max-width:820px;margin-bottom:10px}'
    + '.cfv-bar button{font:600 14px/1 "Public Sans",system-ui,sans-serif;border-radius:10px;padding:10px 14px;border:1px solid #c9d2de;background:#fff;color:#132036;cursor:pointer}'
    + '.cfv-bar button.nar{background:#F07A1E;border-color:#F07A1E;color:#fff}'
    + '.cfv-bar button:focus-visible{outline:2px solid #F07A1E;outline-offset:2px}'
    + '.cfh{background:#fff;color:#132036;width:100%;max-width:820px;border-radius:12px;padding:22px 20px 26px;font:12px/1.45 "Public Sans",system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.25);position:relative;overflow:hidden}'
    + '.cfh .cb{display:flex;align-items:center;gap:12px;flex-wrap:wrap;border-bottom:2px solid #1F3864;padding-bottom:10px;margin-bottom:14px;position:relative}'
    + '.cfh .cb img{width:34px;height:auto}.cfh .cb b{display:block;font-size:15px;color:#1F3864}.cfh .cb span{display:block;font:500 10.5px/1.4 "JetBrains Mono",ui-monospace,monospace;color:#5A6577;letter-spacing:.04em}'
    + '.cfh .sello{margin-left:auto;font-style:normal;font-weight:800;font-size:11px;letter-spacing:.08em;color:#B42318;border:2px solid #B42318;border-radius:8px;padding:4px 10px;transform:rotate(-3deg)}'
    + '.cfh .sello.ok{color:#15803D;border-color:#15803D}.cfh .sello.az{color:#1F3864;border-color:#1F3864}.cfh .sello.gr{color:#5A6577;border-color:#5A6577}'
    + '.cfh .monto{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:16px;align-items:center;background:#F4F6FA;border-radius:10px;padding:12px 14px;position:relative}'
    + '.cfh .monto small{display:block;font-size:9.5px;letter-spacing:.1em;color:#5A6577;font-weight:700;text-transform:uppercase}'
    + '.cfh .monto b{font:600 24px/1.2 "JetBrains Mono",ui-monospace,monospace;color:#1F3864}.cfh .monto span{display:block;font-size:10.5px;color:#5A6577}'
    + '.cfh .dests{display:grid;gap:4px;font-size:11px}.cfh .dests div{display:flex;justify-content:space-between;gap:10px;border-bottom:1px solid #DCE2EB;padding-bottom:3px}'
    + '.cfh .dests b{font:600 11px "JetBrains Mono",ui-monospace,monospace;color:#132036}'
    + '.cfh h4{margin:16px 0 6px;font-size:10px;letter-spacing:.12em;color:#5A6577}'
    + '.cfh .tw{overflow-x:auto;position:relative}.cfh table{width:100%;border-collapse:collapse;min-width:560px}'
    + '.cfh th{background:#1F3864;color:#fff;text-align:left;font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;padding:6px 8px}'
    + '.cfh td{border-bottom:1px solid #DCE2EB;padding:6px 8px;vertical-align:top}.cfh .r{text-align:right;white-space:nowrap;font-family:"JetBrains Mono",ui-monospace,monospace}'
    + '.cfh td:first-child{white-space:nowrap}.cfh .ds{color:#5A6577}.cfh .mo{color:#5A6577;font-size:10px}'
    + '.cfh tr.mes td{background:#1F3864;color:#fff;font-weight:800;font-size:10px;letter-spacing:.1em;padding:5px 8px}'
    + '.cfh tr.smes td{background:#F4F6FA;font-weight:700;color:#1F3864}.cfh tr.tot td{font-weight:800;background:#F4F6FA}'
    + '.cfh tr.pide td{font-weight:800;color:#C2410C;border-bottom:2px solid #F07A1E;font-size:12px}'
    + '.cfh .dep{margin-top:12px;font-size:11px;color:#5A6577}'
    + '.cfh .rv{margin-top:12px;border:1.5px solid #F07A1E;background:#FDEEDF;color:#7A3A06;border-radius:10px;padding:9px 12px;font-size:11.5px}'
    + '.cfh .rv b{color:#7A3A06}.cfh tr.auto td{background:#FFF6EE}.cfh .tag{display:inline-block;margin-top:3px;font-size:9.5px;font-weight:800;letter-spacing:.04em;color:#A24B08}'
    + '.cfh .fir{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:44px}.cfh .fir div{border-top:1px solid #132036;padding-top:6px;text-align:center;font-size:10.5px}'
    + '@media (max-width:560px){.cfh{padding:16px 12px 20px}.cfh .monto{grid-template-columns:1fr}.cfh .fir{gap:14px}}'
    + '[hidden]{display:none!important}';
  function poneCSS() {
    if (document.getElementById('cf-css')) return;
    var s = document.createElement('style'); s.id = 'cf-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  // La solicitud como página (lo mismo que sale en el PDF)
  function hoja(r) {
    var F = filas(r), s = sello(r), fondo = Number(r.fondo) || 10000, d = resumen(r), rv = revisar(r);
    var html = '<div class="cfh">'
      + '<div class="cb"><img src="img/logo.png" alt="PROFASE"><div><b>Solicitud de reposición de caja chica</b><span>FOLIO ' + esc(r.folio || 'POR ASIGNAR')
      + ' · DEL ' + esc(fecha(r.desde)) + ' AL ' + esc(fecha(r.hasta)) + '</span></div><em class="sello ' + s.c + '">' + esc(s.t) + '</em></div>'
      + '<div class="monto"><div><small>Se solicita reponer</small><b>' + money(r.monto) + '</b><span>para que el fondo vuelva a ' + money(fondo) + '</span></div>'
      + '<div class="dests">' + d.map(function (x) { return '<div><span>' + esc(x.t) + '</span><b>' + money(x.v) + '</b></div>'; }).join('') + '</div></div>'
      + (rv.n ? '<div class="rv"><b>Para revisar antes de depositar:</b> ' + rv.n + (rv.n === 1 ? ' gasto que se autorizó' : ' gastos que se autorizó')
        + ' la misma persona que ' + (rv.n === 1 ? 'lo hizo' : 'los hizo') + ', por ' + money(rv.total) + '. Vienen marcados abajo.</div>' : '')
      + '<h4>ESTADO DE CUENTA DEL FONDO</h4><div class="tw"><table><thead><tr><th>Fecha</th><th>Concepto y motivo</th><th>Cliente o grupo</th><th>Quién</th><th class="r">Salida</th><th class="r">Saldo</th></tr></thead><tbody>'
      + '<tr class="tot"><td>' + esc(fecha(r.desde)) + '</td><td colspan="3">Saldo inicial · fondo surtido</td><td></td><td class="r">' + money(r.saldo_ini) + '</td></tr>';
    F.filas.forEach(function (x) {
      if (x.k === 'mes') html += '<tr class="mes"><td colspan="6">' + esc(x.t) + '</td></tr>';
      else if (x.k === 'sub') html += '<tr class="smes"><td></td><td colspan="3">' + esc(x.t) + '</td><td class="r">' + money(x.v) + '</td><td></td></tr>';
      else {
        var g = x.g;
        html += '<tr' + (g.auto ? ' class="auto"' : '') + '><td>' + esc(fecha(g.fecha)) + '</td><td>' + esc(g.concepto || '—') + ' <span class="ds">· ' + esc(cat(g.categoria)) + '</span>'
          + (g.motivo ? '<div class="mo">' + esc(g.motivo) + '</div>' : '')
          + (g.auto ? '<div class="tag">REVISAR · SE LO AUTORIZÓ ' + esc((g.autorizo || 'ÉL MISMO').toUpperCase()) + '</div>' : '')
          + '</td><td>' + (esc(relTxt(g)) || '<span class="ds">—</span>') + '</td><td>' + esc(g.quien || '—')
          + '</td><td class="r">' + money(g.importe) + '</td><td class="r">' + money(x.saldo) + '</td></tr>';
      }
    });
    html += '<tr class="tot"><td>' + esc(fecha(r.hasta)) + '</td><td colspan="3">Saldo al corte · ' + F.n + (F.n === 1 ? ' gasto' : ' gastos') + '</td><td class="r">' + money(r.gastado) + '</td><td class="r">' + money(F.saldo) + '</td></tr>'
      + '<tr class="pide"><td></td><td colspan="4">Se solicita reponer para regresar a ' + money(fondo) + '</td><td class="r">' + money(r.monto) + '</td></tr></tbody></table></div>'
      + (r.dep_fecha ? '<p class="dep">Depositada el ' + esc(fecha(r.dep_fecha)) + (r.dep_ref ? ' · referencia ' + esc(r.dep_ref) : '') + (r.dep_por ? ' · confirmó ' + esc(r.dep_por) : '')
        + (r.revisado ? ' · revisó los gastos marcados' : '') + '</p>' : '')
      + ((r.regresos || []).length ? '<p class="dep">' + r.regresos.length + (r.regresos.length === 1 ? ' depósito regresado' : ' depósitos regresados')
        + ': ' + r.regresos.map(function (x) { return esc(x.quien || '') + ' · «' + esc(x.motivo || '') + '»'; }).join('; ') + '</p>' : '')
      + '<div class="fir"><div>' + esc(r.pedida_por || '') + '<br>Solicita</div><div>' + esc(r.dep_por || '') + '<br>Surte el fondo</div></div></div>';
    return html;
  }

  // La vista en pantalla, con «Bajar PDF» (si la página puede bajar archivos)
  function ver(r, op) {
    op = op || {}; poneCSS();
    var prev = document.activeElement, cap = document.createElement('div');
    cap.className = 'cfv'; cap.setAttribute('role', 'dialog'); cap.setAttribute('aria-modal', 'true'); cap.setAttribute('aria-label', 'Solicitud de reposición ' + (r.folio || ''));
    cap.innerHTML = '<div class="cfv-bar"><button type="button" data-cf="cerrar">Cerrar</button>' + (op.dl ? '<button type="button" class="nar" data-cf="pdf" data-descarga="pdf">Bajar PDF</button>' : '') + '</div>' + hoja(r);
    function cierra() { cap.remove(); document.removeEventListener('keydown', tecla); try { if (prev) prev.focus(); } catch (e) { /* nada */ } }
    function tecla(e) { if (e.key === 'Escape') cierra(); }
    cap.addEventListener('click', function (e) {
      if (e.target === cap) { cierra(); return; }
      var b = e.target.closest('[data-cf]'); if (!b) return;
      if (b.getAttribute('data-cf') === 'cerrar') cierra();
      else { b.disabled = true; pdf(r, op.dl).then(function () { b.disabled = false; }, function (err) { b.disabled = false; if (op.falla) op.falla(err); }); }
    });
    document.addEventListener('keydown', tecla);
    document.body.appendChild(cap);
    cap.querySelector('[data-cf]').focus();
    return cap;
  }

  // El PDF, con la marca PROFASE (encabezado y marca de agua en cada hoja)
  async function pdf(r, dl) {
    if (!dl) throw new Error('No se pueden bajar archivos en esta vista.');
    var MK = window.PROFASE_MARCA;
    var jsPDF = await MK.pdfJS();
    var doc = new jsPDF({ unit: 'pt', format: 'letter' });
    var W = doc.internal.pageSize.getWidth(), M = 36, SM = !!(MK.sinMarca && MK.sinMarca());
    var y = MK.marcaPDF(doc), s = sello(r), F = filas(r), fondo = Number(r.fondo) || 10000, rv = revisar(r);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(14); if (SM) doc.setTextColor(0, 0, 0); else doc.setTextColor(31, 56, 100);
    doc.text('Solicitud de reposición de caja chica', M, y + 4);
    doc.setFontSize(11); doc.setTextColor(240, 122, 30); doc.text(r.folio || 'POR ASIGNAR', W - M, y + 4, { align: 'right' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(90, 101, 119);
    doc.text('Del ' + fecha(r.desde) + ' al ' + fecha(r.hasta) + ' · ' + s.t, W - M, y + 17, { align: 'right' });
    y += 34;
    doc.setFontSize(9); doc.setTextColor(90, 101, 119); doc.text('SE SOLICITA REPONER', M, y);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor(31, 56, 100); doc.text(money(r.monto), M, y + 20);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(90, 101, 119); doc.text('para que el fondo vuelva a ' + money(fondo), M, y + 32);
    var xr = W / 2 + 20, yy = y;
    resumen(r).forEach(function (d) {
      doc.setFontSize(9); doc.setTextColor(19, 32, 54); doc.text(d.t, xr, yy); doc.text(money(d.v), W - M, yy, { align: 'right' });
      doc.setDrawColor(220, 226, 235); doc.setLineWidth(0.5); doc.line(xr, yy + 4, W - M, yy + 4); yy += 15;
    });
    y = Math.max(y + 46, yy + 8);
    if (rv.n) {
      var txt = 'PARA REVISAR ANTES DE DEPOSITAR: ' + rv.n + (rv.n === 1 ? ' gasto que se autorizó' : ' gastos que se autorizó') + ' la misma persona que '
        + (rv.n === 1 ? 'lo hizo' : 'los hizo') + ', por ' + money(rv.total) + '. Vienen marcados en la tabla.';
      var ln = doc.splitTextToSize(txt, W - 2 * M - 16);
      if (!SM) { doc.setFillColor(253, 238, 223); doc.setDrawColor(240, 122, 30); doc.roundedRect(M, y - 2, W - 2 * M, 10 + ln.length * 10, 4, 4, 'FD'); }
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(122, 58, 6); doc.text(ln, M + 8, y + 9);
      y += 18 + ln.length * 10;
    }
    var azul = SM ? [217, 217, 217] : [31, 56, 100], claro = [244, 246, 250];
    var neg = { fontStyle: 'bold', fillColor: claro };
    var body = [[{ content: fecha(r.desde), styles: neg }, { content: 'Saldo inicial · fondo surtido', colSpan: 3, styles: neg },
      { content: '', styles: neg }, { content: money(r.saldo_ini), styles: Object.assign({ halign: 'right' }, neg) }]];
    F.filas.forEach(function (x) {
      if (x.k === 'mes') body.push([{ content: x.t, colSpan: 6, styles: { fillColor: azul, textColor: SM ? 0 : 255, fontStyle: 'bold', fontSize: 7.5 } }]);
      else if (x.k === 'sub') body.push(['', { content: x.t, colSpan: 3, styles: { fontStyle: 'bold' } }, { content: money(x.v), styles: { halign: 'right', fontStyle: 'bold' } }, '']);
      else {
        var g = x.g;
        var est = g.auto ? { fillColor: SM ? [242, 242, 242] : [255, 246, 238] } : {};
        body.push([{ content: fecha(g.fecha), styles: est },
          { content: (g.concepto || '—') + ' · ' + cat(g.categoria) + (g.motivo ? '\n' + g.motivo : '') + (g.auto ? '\nREVISAR · SE LO AUTORIZÓ ' + (g.autorizo || 'ÉL MISMO').toUpperCase() : ''), styles: est },
          { content: relTxt(g) || '—', styles: est }, { content: g.quien || '—', styles: est },
          { content: money(g.importe), styles: Object.assign({ halign: 'right' }, est) }, { content: money(x.saldo), styles: Object.assign({ halign: 'right' }, est) }]);
      }
    });
    body.push([{ content: fecha(r.hasta), styles: neg }, { content: 'Saldo al corte · ' + F.n + (F.n === 1 ? ' gasto' : ' gastos'), colSpan: 3, styles: neg },
      { content: money(r.gastado), styles: Object.assign({ halign: 'right' }, neg) }, { content: money(F.saldo), styles: Object.assign({ halign: 'right' }, neg) }]);
    body.push(['', { content: 'Se solicita reponer para regresar a ' + money(fondo), colSpan: 4, styles: { fontStyle: 'bold', textColor: [194, 65, 12] } },
      { content: money(r.monto), styles: { halign: 'right', fontStyle: 'bold', textColor: [194, 65, 12] } }]);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(90, 101, 119); doc.text('ESTADO DE CUENTA DEL FONDO', M, y); y += 6;
    doc.autoTable(Object.assign(MK.tablaPDF(), {
      startY: y, head: [['Fecha', 'Concepto y motivo', 'Cliente o grupo', 'Quién', 'Salida', 'Saldo']], body: body,
      columnStyles: { 0: { cellWidth: 52 }, 2: { cellWidth: 120 }, 3: { cellWidth: 74 }, 4: { cellWidth: 62, halign: 'right' }, 5: { cellWidth: 62, halign: 'right' } }
    }));
    y = (doc.lastAutoTable ? doc.lastAutoTable.finalY : y) + 14;
    if (r.dep_fecha) {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(90, 101, 119);
      doc.text('Depositada el ' + fecha(r.dep_fecha) + (r.dep_ref ? ' · referencia ' + r.dep_ref : '') + (r.dep_por ? ' · confirmó ' + r.dep_por : '') + (r.revisado ? ' · revisó los gastos marcados' : ''), M, y);
    }
    y += 56;
    if (y > doc.internal.pageSize.getHeight() - 80) { doc.addPage(); y = 140; }
    var col = (W - 2 * M - 40) / 2;
    doc.setDrawColor(19, 32, 54); doc.setLineWidth(0.8); doc.line(M, y, M + col, y); doc.line(M + col + 40, y, W - M, y);
    doc.setFontSize(9); doc.setTextColor(19, 32, 54);
    doc.text(r.pedida_por || '', M + col / 2, y + 12, { align: 'center' }); doc.text('Solicita', M + col / 2, y + 24, { align: 'center' });
    doc.text(r.dep_por || '', M + col + 40 + col / 2, y + 12, { align: 'center' }); doc.text('Surte el fondo', M + col + 40 + col / 2, y + 24, { align: 'center' });
    var n = doc.internal.getNumberOfPages(), H = doc.internal.pageSize.getHeight();
    for (var i = 1; i <= n; i++) {
      doc.setPage(i); doc.setFontSize(7.5); doc.setTextColor(122, 133, 151);
      doc.text((SM ? '' : 'PROFASE · ' + MK.subtitulo + ' · ') + 'Caja chica · ' + (r.folio || 'vista previa') + ' · Página ' + i + ' de ' + n, W / 2, H - 18, { align: 'center' });
    }
    await dl.save({ filename: 'Reposición caja chica ' + (r.folio || 'vista previa') + '.pdf', data: doc.output('blob') });
  }

  window.CAJA_FONDO = { CATS_V: CATS_V, CATS_I: CATS_I, cat: cat, destino: destino, relTxt: relTxt, money: money, fecha: fecha,
                        revisar: revisar, hoja: hoja, ver: ver, pdf: pdf };
})();
