/* Marca PROFASE para lo que se descarga del portal (Excel).
   Cada hoja lleva arriba el signo PROFASE, el nombre «PROFASE» en Arial negrita azul institucional, el subtítulo
   «Asesoría Contable, Legal y Fiscal» y una línea azul, igual que los PDF; encabezados de tabla en azul institucional
   y pie de página con la marca al imprimir. No se usa en la pestaña QUO (tiene su propia marca) ni en el Cotizador
   DECOMSA (ya trae los logos de DECOMSA y PROFASE). */
(function () {
  'use strict';
  var LOGO = 'data:image/png;base64,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';
  var C = { azul: 'FF1F3864', naranja: 'FFF07A1E', gris: 'FF5A6577', grisClaro: 'FF888888', rojo: 'FFB42318',
            azulClaro: 'FFE6ECF6', fondo: 'FFF8FAFC', borde: 'FFDCE2EB', tinta: 'FF132036', blanco: 'FFFFFFFF' };
  var FUENTE = 'Arial';
  var SUB = 'Asesoría Contable, Legal y Fiscal';
  var EXJS = null;

  function excelJS() {
    if (window.ExcelJS) return Promise.resolve(window.ExcelJS);
    if (!EXJS) EXJS = new Promise(function (ok, ko) {
      var s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js';
      s.onload = function () { window.ExcelJS ? ok(window.ExcelJS) : ko(new Error('sin generador de Excel')); };
      s.onerror = function () { EXJS = null; ko(new Error('no cargó el generador de Excel')); };
      document.head.appendChild(s);
    });
    return EXJS;
  }

  /* Libro nuevo con las propiedades de PROFASE (autor y compañía que se ven en Archivo › Propiedades) */
  function libro(EX, titulo) {
    var wb = new EX.Workbook();
    wb.creator = 'PROFASE'; wb.lastModifiedBy = 'Portal PROFASE';
    wb.company = 'PROFASE · ' + SUB; wb.title = titulo || 'Portal PROFASE';
    wb.created = new Date(); wb.modified = wb.created;
    return wb;
  }

  function logoDe(wb) {
    if (wb.__logoProfase == null) wb.__logoProfase = wb.addImage({ base64: LOGO.split(',')[1], extension: 'png' });
    return wb.__logoProfase;
  }

  /* Encabezado de marca en las filas 1 a 4 de la hoja. ancho = cuántas columnas cubre la línea azul.
     op.titulo (fila 5, negrita azul) y op.lineas (debajo, en gris). Regresa la primera fila libre, dejando un renglón
     en blanco antes de la tabla. */
  function encabezado(wb, ws, ancho, op) {
    op = op || {}; ancho = Math.max(ancho || 1, 1);
    ws.getRow(1).height = 24; ws.getRow(2).height = 14; ws.getRow(3).height = 5; ws.getRow(4).height = 9;
    ws.addImage(logoDe(wb), { tl: { nativeCol: 0, nativeColOff: 5 * 9525, nativeRow: 0, nativeRowOff: 6 * 9525 },
      ext: { width: 30, height: 34 }, editAs: 'oneCell' });
    var a1 = ws.getCell(1, 1), a2 = ws.getCell(2, 1);
    a1.value = 'PROFASE';
    a1.font = { name: FUENTE, size: 16, bold: true, color: { argb: C.azul } };
    a1.alignment = { vertical: 'bottom', horizontal: 'left', indent: 5 };
    a2.value = SUB;
    a2.font = { name: FUENTE, size: 9, italic: true, color: { argb: C.grisClaro } };
    a2.alignment = { vertical: 'top', horizontal: 'left', indent: 5 };
    // la línea azul cubre las columnas de la tabla y, como mínimo, el ancho del nombre y el subtítulo
    for (var c = 1, w = 0; c <= ancho || w < 42; c++) {
      ws.getCell(3, c).border = { bottom: { style: 'medium', color: { argb: C.azul } } };
      w += ws.getColumn(c).width || 9;
    }
    var f = 5;
    if (op.titulo) {
      var t = ws.getCell(f, 1); t.value = op.titulo;
      t.font = { name: FUENTE, size: 13, bold: true, color: { argb: C.azul } };
      ws.getRow(f).height = 19; f++;
    }
    (op.lineas || []).forEach(function (l) {
      if (l == null || l === '') return;
      var x = ws.getCell(f, 1); x.value = l;
      x.font = { name: FUENTE, size: 9, color: { argb: C.gris } };
      f++;
    });
    return f + 1;
  }

  /* Renglón de encabezados de una tabla: azul institucional con letra blanca */
  function cabecera(ws, fila, desde, hasta, op) {
    op = op || {};
    var r = ws.getRow(fila); r.height = op.alto || 22;
    for (var c = desde; c <= hasta; c++) {
      var x = r.getCell(c);
      x.font = { name: FUENTE, size: 10, bold: true, color: { argb: C.blanco } };
      x.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.azul } };
      x.alignment = { vertical: 'middle', horizontal: (op.derecha && op.derecha.indexOf(c) >= 0) ? 'right' : 'left', wrapText: true };
      x.border = borde(C.azul);
    }
  }

  function borde(color) {
    var b = { style: 'thin', color: { argb: color || C.borde } };
    return { top: b, left: b, bottom: b, right: b };
  }

  /* Letra Arial y borde fino en un rango de celdas de datos */
  function cuerpo(ws, f1, f2, c1, c2) {
    var B = borde(), fN = { name: FUENTE, size: 10, color: { argb: C.tinta } };
    for (var f = f1; f <= f2; f++) for (var c = c1; c <= c2; c++) {
      var x = ws.getCell(f, c);
      x.font = x.font && x.font.color ? Object.assign({}, fN, x.font, { name: FUENTE }) : fN;
      x.border = B;
    }
  }

  /* Hoja carta horizontal, ajustada a lo ancho, con la marca en el pie y la fila de encabezados repetida */
  function impresion(ws, op) {
    op = op || {};
    ws.pageSetup = Object.assign({}, ws.pageSetup, { paperSize: 1, orientation: op.vertical ? 'portrait' : 'landscape',
      fitToPage: true, fitToWidth: 1, fitToHeight: 0,
      margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.6, header: 0.25, footer: 0.3 } });
    if (op.repetir) ws.pageSetup.printTitlesRow = op.repetir + ':' + op.repetir;
    ws.headerFooter = { oddFooter: '&L&"Arial,Italic"&8&K888888PROFASE · ' + SUB + '&R&"Arial"&8&K888888Página &P de &N',
      evenFooter: '&L&"Arial,Italic"&8&K888888PROFASE · ' + SUB + '&R&"Arial"&8&K888888Página &P de &N' };
  }

  /* Guarda el libro: con la descarga del portal si existe, si no con una liga directa */
  async function guardar(wb, nombre) {
    var datos = await wb.xlsx.writeBuffer();
    var blob = new Blob([datos], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    var dl = null;
    try { dl = window.claude && window.claude.use ? await window.claude.use('downloads') : null; } catch (e) { dl = null; }
    if (dl) { await dl.save({ filename: nombre, data: blob }); return; }
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombre;
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }

  window.PROFASE_MARCA = { logo: LOGO, colores: C, fuente: FUENTE, subtitulo: SUB, excelJS: excelJS, libro: libro,
    encabezado: encabezado, cabecera: cabecera, cuerpo: cuerpo, borde: borde, impresion: impresion, guardar: guardar };
})();
