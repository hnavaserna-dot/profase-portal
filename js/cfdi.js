/* Portal PROFASE · la ficha de un CFDI y el XML acomodado (3-nov-2026). Una sola versión para el portal: la usan el chat
   interno (la vista previa de un XML, pedido de Sebastián Sánchez que Daniel aprobó el 30-oct-2026) y Centauro (la bóveda
   de XML del SAT, Héctor Daniel Nava, 3-nov-2026). Antes vivía dentro de chat.html.
     PROFASE_CFDI.ficha(doc)          la ficha (HTML) de un CFDI 3.3 o 4.0 ya leído con DOMParser, o '' si no es CFDI
     PROFASE_CFDI.bonito(raiz, max)   el XML acomodado y con colores (HTML), hasta «max» letras (3 MB si no se dice)
   Todo lo que viene del XML va escapado (esc). Pone sus estilos una sola vez; los colores salen de las variables de cada
   página (--ink, --line, --navy…), en claro y en oscuro. No baja, no sube ni guarda nada. */
(function () {
  'use strict';
  if (window.PROFASE_CFDI) return;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var CSS = ".vx-pre{margin:0;padding:12px 14px;font:12px/1.55 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;white-space:pre-wrap;word-break:break-all;color:var(--ink)}" +
    ".vx-pre .xt{color:#2B5797}.vx-pre .xa{color:#A64B0A}.vx-pre .xv{color:#1D7A4F}.vx-pre .xc{color:var(--muted)}" +
    ":root[data-theme=\"dark\"] .vx-pre .xt{color:#9CC0F2}:root[data-theme=\"dark\"] .vx-pre .xa{color:#FFB27A}:root[data-theme=\"dark\"] .vx-pre .xv{color:#7FD4A6}" +
    ".vx-xml{border-top:1px solid var(--line);margin-top:6px}" +
    ".vx-xml summary{cursor:pointer;padding:10px 14px;font-weight:600;color:var(--navy-2,var(--navy))}" +
    "/* renglón completo: este desplegable se abre con todo su renglón (recuadro o fondo) */" +
    ".vx-xml summary{width:auto}" +
    ":root[data-theme=\"dark\"] .vx-xml summary{color:#9CC0F2}" +
    ".cfdi{padding:14px;display:flex;flex-direction:column;gap:12px;font-size:13px}" +
    ".cf-cab{display:flex;gap:12px;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;padding:12px 14px;border-radius:12px;background:var(--navy);color:var(--navy-ink)}" +
    ".cf-cab small{display:block;opacity:.8;font-size:12px}.cf-cab b{display:block;font-size:17px;margin:2px 0}" +
    ".cf-tot{text-align:right}.cf-tot b{font-size:20px;color:#FFB27A}" +
    ".cf-uuid{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:8px 12px;border:1px solid var(--line);border-radius:10px;background:var(--surface-2)}" +
    ".cf-uuid span{color:var(--muted);font-size:12px;font-weight:600}.cf-uuid b{flex:1;min-width:0;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12.5px;word-break:break-all}" +
    ".cf-uuid.sin{border-color:var(--red);background:var(--red-soft)}" +
    ".cf-uuid button{border:1px solid var(--line-strong);background:var(--surface);color:var(--ink);border-radius:8px;padding:4px 10px;font-weight:600;font-size:12px}" +
    ".cf-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}" +
    ".cf-2 section,.cf-s{border:1px solid var(--line);border-radius:12px;padding:10px 12px;min-width:0}" +
    ".cfdi h4{margin:0 0 6px;font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--accent-ink)}" +
    ".cf-f{display:flex;gap:10px;justify-content:space-between;padding:3px 0;border-bottom:1px dashed var(--line);min-width:0}" +
    ".cf-f:last-child{border-bottom:0}" +
    ".cf-f span{color:var(--muted);flex:none}.cf-f b{font-weight:600;text-align:right;min-width:0;overflow-wrap:anywhere}" +
    ".cf-g{display:grid;grid-template-columns:1fr 1fr;column-gap:18px}" +
    ".cf-tots{max-width:420px;margin-left:auto;width:100%}" +
    ".cf-gran{border-top:2px solid var(--ink);margin-top:4px;padding-top:6px;font-size:15px}" +
    ".cf-p{margin:2px 0 4px;color:var(--muted)}" +
    ".cf-mono{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;word-break:break-all}" +
    ".cf-tw{overflow-x:auto;margin-top:4px}" +
    ".cf-t{border-collapse:collapse;width:100%;font-size:12.5px;font-variant-numeric:tabular-nums}" +
    ".cf-t th,.cf-t td{padding:6px 8px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top;white-space:nowrap}" +
    ".cf-t th{color:var(--muted);font-weight:600;font-size:11.5px;background:var(--surface-2)}" +
    ".cf-t .n{text-align:right}.cf-t td.d{white-space:normal;min-width:220px}" +
    "@media (max-width:759px){.cf-2,.cf-g{grid-template-columns:1fr}.cf-tots{max-width:none}}";
  function estilos() {
    if (document.getElementById('profase-cfdi-css')) return;
    var st = document.createElement('style'); st.id = 'profase-cfdi-css'; st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }
  estilos();
  function bonito(raiz, max) {
    var MAX_TEXTO = max || 3 * 1024 * 1024;
    var out = [], largo = 0;
    function pon(s) { if (largo < MAX_TEXTO) { out.push(s); largo += s.length; } }
    function attrs(el) {
      var s = '';
      for (var i = 0; i < el.attributes.length; i++) { var at = el.attributes[i]; s += ' <span class="xa">' + esc(at.name) + '</span>=<span class="xv">"' + esc(at.value) + '"</span>'; }
      return s;
    }
    function va(n, nivel) {
      var sang = new Array(nivel + 1).join('  ');
      if (n.nodeType === 1) {
        var hijos = Array.prototype.filter.call(n.childNodes, function (h) { return h.nodeType === 1 || h.nodeType === 8 || ((h.nodeType === 3 || h.nodeType === 4) && h.nodeValue.trim()); });
        var abre = sang + '<span class="xt">&lt;' + esc(n.nodeName) + '</span>' + attrs(n);
        if (!hijos.length) { pon(abre + '<span class="xt">/&gt;</span>\n'); return; }
        if (hijos.length === 1 && (hijos[0].nodeType === 3 || hijos[0].nodeType === 4)) { pon(abre + '<span class="xt">&gt;</span>' + esc(hijos[0].nodeValue.trim()) + '<span class="xt">&lt;/' + esc(n.nodeName) + '&gt;</span>\n'); return; }
        pon(abre + '<span class="xt">&gt;</span>\n');
        hijos.forEach(function (h) { va(h, nivel + 1); });
        pon(sang + '<span class="xt">&lt;/' + esc(n.nodeName) + '&gt;</span>\n');
      } else if (n.nodeType === 8) pon(sang + '<span class="xc">&lt;!--' + esc(n.nodeValue) + '--&gt;</span>\n');
      else pon(sang + esc(n.nodeValue.trim()) + '\n');
    }
    va(raiz, 0);
    return out.join('') + (largo >= MAX_TEXTO ? '\n… (el resto no se enseña aquí; bájalo para verlo completo)' : '');
  }
  // la ficha: lo importante a la vista (catálogos del SAT más comunes; si no está, sale la clave)
  var CAT = {
    tipo: { I: 'Ingreso', E: 'Egreso', T: 'Traslado', N: 'Nómina', P: 'Pago' },
    forma: { '01': 'Efectivo', '02': 'Cheque nominativo', '03': 'Transferencia electrónica de fondos', '04': 'Tarjeta de crédito', '05': 'Monedero electrónico', '06': 'Dinero electrónico', '08': 'Vales de despensa', '12': 'Dación en pago', '13': 'Pago por subrogación', '14': 'Pago por consignación', '15': 'Condonación', '17': 'Compensación', '23': 'Novación', '24': 'Confusión', '25': 'Remisión de deuda', '26': 'Prescripción o caducidad', '27': 'A satisfacción del acreedor', '28': 'Tarjeta de débito', '29': 'Tarjeta de servicios', '30': 'Aplicación de anticipos', '31': 'Intermediario pagos', '99': 'Por definir' },
    metodo: { PUE: 'Pago en una sola exhibición', PPD: 'Pago en parcialidades o diferido' },
    uso: { G01: 'Adquisición de mercancías', G02: 'Devoluciones, descuentos o bonificaciones', G03: 'Gastos en general', I01: 'Construcciones', I02: 'Mobiliario y equipo de oficina por inversiones', I03: 'Equipo de transporte', I04: 'Equipo de cómputo y accesorios', I05: 'Dados, troqueles, moldes, matrices y herramental', I06: 'Comunicaciones telefónicas', I07: 'Comunicaciones satelitales', I08: 'Otra maquinaria y equipo', D01: 'Honorarios médicos, dentales y gastos hospitalarios', D02: 'Gastos médicos por incapacidad o discapacidad', D03: 'Gastos funerales', D04: 'Donativos', D05: 'Intereses reales por créditos hipotecarios', D06: 'Aportaciones voluntarias al SAR', D07: 'Primas por seguros de gastos médicos', D08: 'Gastos de transportación escolar obligatoria', D09: 'Depósitos en cuentas para el ahorro', D10: 'Pagos por servicios educativos (colegiaturas)', S01: 'Sin efectos fiscales', CP01: 'Pagos', CN01: 'Nómina', P01: 'Por definir' },
    regimen: { '601': 'General de Ley Personas Morales', '603': 'Personas Morales con Fines no Lucrativos', '605': 'Sueldos y Salarios', '606': 'Arrendamiento', '607': 'Enajenación o Adquisición de Bienes', '608': 'Demás ingresos', '610': 'Residentes en el Extranjero', '611': 'Ingresos por Dividendos', '612': 'Personas Físicas con Actividades Empresariales y Profesionales', '614': 'Ingresos por intereses', '615': 'Obtención de premios', '616': 'Sin obligaciones fiscales', '620': 'Sociedades Cooperativas de Producción', '621': 'Incorporación Fiscal', '622': 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras', '623': 'Opcional para Grupos de Sociedades', '624': 'Coordinados', '625': 'Plataformas Tecnológicas', '626': 'Régimen Simplificado de Confianza' },
    impuesto: { '001': 'ISR', '002': 'IVA', '003': 'IEPS' },
    relacion: { '01': 'Nota de crédito', '02': 'Nota de débito', '03': 'Devolución de mercancía', '04': 'Sustitución de los CFDI previos', '05': 'Traslados de mercancías facturados previamente', '06': 'Factura por traslados previos', '07': 'Aplicación de anticipo' },
    exporta: { '01': 'No aplica', '02': 'Definitiva', '03': 'Temporal', '04': 'Definitiva con clave distinta a A1' }
  };
  function cat(t, v) { v = String(v || ''); if (!v) return ''; var d = CAT[t] && CAT[t][v]; return d ? v + ' · ' + d : v; }
  function hijo(el, n) { if (!el) return null; for (var i = 0; i < el.children.length; i++) if (el.children[i].localName === n) return el.children[i]; return null; }
  function hijos(el, n) { return el ? Array.prototype.filter.call(el.children, function (x) { return x.localName === n; }) : []; }
  function bajo(el, n) { if (!el) return []; var r = []; (function va(x) { for (var i = 0; i < x.children.length; i++) { if (x.children[i].localName === n) r.push(x.children[i]); va(x.children[i]); } })(el); return r; }
  function at(el, n) { return el ? (el.getAttribute(n) || '') : ''; }
  function ficha(doc) {
    var c = doc.documentElement;
    if (!c || c.localName !== 'Comprobante' || !/sat\.gob\.mx\/cfd/i.test(c.namespaceURI || '')) return '';
    var mon = at(c, 'Moneda') || 'MXN';
    function dinero(v, m) {
      if (v === '' || v == null) return '';
      var n = parseFloat(v); if (!isFinite(n)) return esc(v);
      m = m || mon;
      try { return esc(n.toLocaleString('es-MX', { style: 'currency', currency: /^[A-Z]{3}$/.test(m) && m !== 'XXX' ? m : 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 6 })); } catch (e) { return esc(n.toFixed(2)); }
    }
    function fecha(v) { var m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(v || ''); return m ? m[3] + '/' + m[2] + '/' + m[1] + (m[4] ? ' ' + m[4] + ':' + m[5] : '') : esc(v || ''); }
    function fila(et, v) { return v ? '<div class="cf-f"><span>' + esc(et) + '</span><b>' + v + '</b></div>' : ''; }
    var em = hijo(c, 'Emisor'), re = hijo(c, 'Receptor'), cps = hijos(hijo(c, 'Conceptos'), 'Concepto'), imp = hijo(c, 'Impuestos');
    var comp = hijo(c, 'Complemento'), tfd = bajo(comp, 'TimbreFiscalDigital')[0], pagos = bajo(comp, 'Pago'), nom = bajo(comp, 'Nomina')[0];
    var tipo = at(c, 'TipoDeComprobante'), sf = [at(c, 'Serie'), at(c, 'Folio')].filter(Boolean).join('-');
    var x = '<div class="cfdi">';
    x += '<div class="cf-cab"><div><small>CFDI ' + esc(at(c, 'Version')) + ' · ' + esc(cat('tipo', tipo)) + '</small><b>' + (sf ? 'Folio ' + esc(sf) : 'Sin serie ni folio') + '</b><small>' + fecha(at(c, 'Fecha')) + '</small></div>'
      + (tipo !== 'P' && tipo !== 'T' ? '<div class="cf-tot"><small>Total</small><b>' + dinero(at(c, 'Total')) + '</b></div>' : '') + '</div>';
    if (tfd) x += '<div class="cf-uuid"><span>UUID</span><b>' + esc(at(tfd, 'UUID')) + '</b><button type="button" data-copia="' + esc(at(tfd, 'UUID')) + '">Copiar</button></div>';
    else x += '<div class="cf-uuid sin"><span>Sin timbrar</span><b>Este XML no trae el timbre del SAT.</b></div>';
    x += '<div class="cf-2">'
      + '<section><h4>Emisor</h4>' + fila('RFC', esc(at(em, 'Rfc'))) + fila('Nombre', esc(at(em, 'Nombre'))) + fila('Régimen', esc(cat('regimen', at(em, 'RegimenFiscal')))) + '</section>'
      + '<section><h4>Receptor</h4>' + fila('RFC', esc(at(re, 'Rfc'))) + fila('Nombre', esc(at(re, 'Nombre'))) + fila('Uso del CFDI', esc(cat('uso', at(re, 'UsoCFDI')))) + fila('Régimen', esc(cat('regimen', at(re, 'RegimenFiscalReceptor')))) + fila('C.P.', esc(at(re, 'DomicilioFiscalReceptor'))) + '</section>'
      + '</div>';
    x += '<section class="cf-s"><h4>Datos</h4><div class="cf-g">'
      + fila('Forma de pago', esc(cat('forma', at(c, 'FormaPago')))) + fila('Método de pago', esc(cat('metodo', at(c, 'MetodoPago'))))
      + fila('Moneda', esc(mon) + (at(c, 'TipoCambio') && mon !== 'MXN' ? ' · tipo de cambio ' + esc(at(c, 'TipoCambio')) : '')) + fila('Lugar de expedición', esc(at(c, 'LugarExpedicion')))
      + fila('Exportación', esc(cat('exporta', at(c, 'Exportacion')))) + fila('Condiciones de pago', esc(at(c, 'CondicionesDePago')))
      + (tfd ? fila('Timbrado', fecha(at(tfd, 'FechaTimbrado'))) + fila('RFC del PAC', esc(at(tfd, 'RfcProvCertif'))) : '')
      + '</div></section>';
    var rels = hijos(c, 'CfdiRelacionados');
    if (rels.length) {
      x += '<section class="cf-s"><h4>CFDI relacionados</h4>';
      rels.forEach(function (r) { x += '<p class="cf-p">' + esc(cat('relacion', at(r, 'TipoRelacion'))) + '</p>' + hijos(r, 'CfdiRelacionado').map(function (u) { return '<div class="cf-mono">' + esc(at(u, 'UUID')) + '</div>'; }).join(''); });
      x += '</section>';
    }
    if (cps.length) {
      x += '<section class="cf-s"><h4>Conceptos (' + cps.length + ')</h4><div class="cf-tw"><table class="cf-t"><thead><tr><th>Clave</th><th class="n">Cantidad</th><th>Unidad</th><th>Descripción</th><th class="n">Valor unitario</th><th class="n">Descuento</th><th class="n">Importe</th></tr></thead><tbody>';
      cps.slice(0, 500).forEach(function (p) {
        x += '<tr><td>' + esc(at(p, 'ClaveProdServ')) + '</td><td class="n">' + esc(at(p, 'Cantidad')) + '</td><td>' + esc([at(p, 'ClaveUnidad'), at(p, 'Unidad')].filter(Boolean).join(' · ')) + '</td><td class="d">' + esc(at(p, 'Descripcion')) + '</td><td class="n">' + dinero(at(p, 'ValorUnitario')) + '</td><td class="n">' + dinero(at(p, 'Descuento')) + '</td><td class="n">' + dinero(at(p, 'Importe')) + '</td></tr>';
      });
      x += '</tbody></table></div>' + (cps.length > 500 ? '<p class="vx-nota">Se ven los primeros 500 conceptos.</p>' : '') + '</section>';
    }
    if (tipo !== 'P' && tipo !== 'T') {
      var tras = hijos(hijo(imp, 'Traslados'), 'Traslado'), ret = hijos(hijo(imp, 'Retenciones'), 'Retencion');
      x += '<section class="cf-s cf-tots"><h4>Importes</h4>' + fila('Subtotal', dinero(at(c, 'SubTotal'))) + fila('Descuento', dinero(at(c, 'Descuento')));
      tras.forEach(function (t) { var tasa = parseFloat(at(t, 'TasaOCuota')); x += fila((CAT.impuesto[at(t, 'Impuesto')] || at(t, 'Impuesto')) + ' trasladado' + (isFinite(tasa) ? ' ' + (+(tasa * 100).toFixed(4)) + ' %' : at(t, 'TipoFactor') === 'Exento' ? ' exento' : ''), dinero(at(t, 'Importe')) || 'Exento'); });
      ret.forEach(function (t) { x += fila((CAT.impuesto[at(t, 'Impuesto')] || at(t, 'Impuesto')) + ' retenido', '−' + dinero(at(t, 'Importe'))); });
      x += '<div class="cf-f cf-gran"><span>Total</span><b>' + dinero(at(c, 'Total')) + '</b></div></section>';
    }
    if (pagos.length) {
      x += '<section class="cf-s"><h4>Complemento de pago</h4>';
      pagos.slice(0, 50).forEach(function (p) {
        var mp = at(p, 'MonedaP') || 'MXN', docs = hijos(p, 'DoctoRelacionado');
        x += '<div class="cf-g">' + fila('Fecha de pago', fecha(at(p, 'FechaPago'))) + fila('Forma de pago', esc(cat('forma', at(p, 'FormaDePagoP')))) + fila('Monto', dinero(at(p, 'Monto'), mp)) + fila('Operación', esc(at(p, 'NumOperacion'))) + '</div>';
        if (docs.length) {
          x += '<div class="cf-tw"><table class="cf-t"><thead><tr><th>Factura que se paga</th><th>Serie y folio</th><th class="n">Parcialidad</th><th class="n">Saldo anterior</th><th class="n">Pagado</th><th class="n">Saldo insoluto</th></tr></thead><tbody>'
            + docs.slice(0, 300).map(function (d) { var md = at(d, 'MonedaDR') || mp; return '<tr><td class="cf-mono">' + esc(at(d, 'IdDocumento')) + '</td><td>' + esc([at(d, 'Serie'), at(d, 'Folio')].filter(Boolean).join('-')) + '</td><td class="n">' + esc(at(d, 'NumParcialidad')) + '</td><td class="n">' + dinero(at(d, 'ImpSaldoAnt'), md) + '</td><td class="n">' + dinero(at(d, 'ImpPagado'), md) + '</td><td class="n">' + dinero(at(d, 'ImpSaldoInsoluto'), md) + '</td></tr>'; }).join('')
            + '</tbody></table></div>';
        }
      });
      x += '</section>';
    }
    if (nom) {
      x += '<section class="cf-s"><h4>Nómina</h4><div class="cf-g">' + fila('Fecha de pago', fecha(at(nom, 'FechaPago'))) + fila('Periodo', fecha(at(nom, 'FechaInicialPago')) + ' a ' + fecha(at(nom, 'FechaFinalPago')))
        + fila('Días pagados', esc(at(nom, 'NumDiasPagados'))) + fila('Percepciones', dinero(at(nom, 'TotalPercepciones'))) + fila('Deducciones', dinero(at(nom, 'TotalDeducciones'))) + fila('Otros pagos', dinero(at(nom, 'TotalOtrosPagos'))) + '</div></section>';
    }
    return x + '</div>';
  }
  window.PROFASE_CFDI = { ficha: ficha, bonito: bonito };
})();
