/* Portal PROFASE · Vista previa de Excel, CSV, XML (con la ficha del CFDI) y texto, en grande, encima de toda la
   pantalla (11-nov-2026). Una sola versión para el portal: la usan el chat interno (antes vivía dentro de chat.html:
   pedido de Sebastián Sánchez que Daniel aprobó el 30-oct-2026; en grande, como la foto, desde el 6-nov-2026: Héctor
   Daniel, «Si»), WorkFlow › Panel de trabajo («Ver» en grande también los Excel) y, desde el 24-nov-2026, Clientes ›
   Expedientes. Regla de Daniel: «nunca nunca repetir código ni crear 2 versiones»; una pantalla nueva que enseñe estos
   archivos usa esta pieza.
   Word y PowerPoint, y «Con marca PROFASE» / «Original (sin marca)» al ver (Héctor Daniel Nava, 24-nov-2026, 15:56, con
   la captura de un Word en el chat que solo traía «Bajar»: «Quiero por ver, words exceles y ppt; así como el
   visualizador de pdfs; ver en original o ver con branding profase»; «Dale»):
     - Word (.docx, .docm, .dotx) y PowerPoint (.pptx, .pptm, .ppsx, .potx) se ven aquí mismo, hoja por hoja y lámina por
       lámina, con docx-preview y pptx-preview guardadas en el portal (js/lib; ver js/lib/LICENCIAS-vista-office.txt).
       Como el archivo lo mandó alguien más, se dibujan dentro de un marco aislado (iframe con sandbox="allow-scripts", sin
       «allow-same-origin»): ahí no hay sesión, ni la base, ni el portal, y su CSP solo deja correr esas librerías del
       portal y sus imágenes de adentro (nada de la red). Habla con esta página solo por mensajes (postMessage) y esta
       página solo le hace caso a los que vienen de ese marco. Los Word y PowerPoint viejos (.doc, .ppt) no se pueden ver
       aquí: solo «Bajar».
     - En Excel, Word y PowerPoint (y en los PDF, con js/visor.js) arriba sale «Con marca PROFASE» / «Original (sin
       marca)»; se abre con la marca. La marca es la misma de los PDF sellados (PROFASE_MARCA.sellaPDF): la marca de agua
       al centro (PROFASE_MARCA.marcaAgua, la misma imagen y la misma opacidad) y abajo a la izquierda el signo, «PROFASE»
       y «Asesoría Contable, Legal y Fiscal», en cada hoja o lámina (en Excel, sobre lo que se ve). Solo cambia cómo se ve:
       «Bajar» lo hace la página (los Excel y PowerPoint, tal cual se mandaron; un Word, como Word o pasado a PDF).
     PROFASE_VISTA.tipo(a)     'hojas' (xlsx, xlsm, xls, ods, csv), 'word', 'ppt', 'xml', 'texto' (txt, log, json, md) o
                               '' si aquí no se ve (los PDF, las fotos, los videos y los audios tienen su propia vista);
                               a = {nombre, tipo}
     PROFASE_VISTA.ver(op)     la abre y regresa una promesa con la ventana (null si el archivo no se ve aquí o ya se está
                               abriendo otro). Si no se puede, la promesa falla con el mensaje en palabras para enseñarlo
                               tal cual (e.message: «Es muy grande para verlo aquí; bájalo.» o «No se pudo abrir aquí: …»).
       op.nombre, op.tipo      el nombre del archivo y su tipo (MIME)
       op.tam                  (opcional) cuánto pesa: arriba de 15 MB ni se trae
       op.bytes                el archivo: Uint8Array, una promesa o una función que lo da (se pide solo si se va a enseñar)
       op.capa                 (opcional) función que da la página donde sale (la de arriba, la vista, para que salga encima
                               de toda la pantalla); sin ella, en esta misma
       op.boton                (opcional) el «Ver» que la abrió: dice «Abriendo…» mientras tanto y el foco regresa a él
       op.alBajar(btn)         (opcional) qué hace «Bajar»: lo baja la página con su visor (js/visor.js) y su marca, tal
                               cual se subió; sin ella no sale el botón
       op.alCerrar()           (opcional) avisa que se cerró
     PROFASE_VISTA.abierta()   si hay una abierta de esta página (aquí o en la de arriba)
     PROFASE_VISTA.cierra()    la cierra sin regresar el foco
     PROFASE_VISTA.marcaVista(btn)  cómo se está viendo, para «Bajar» de esa vista: verdadero con la marca, falso el
                               original, null si el botón no es de la vista abierta o no trae para escoger (js/visor.js,
                               al bajar un Word: con lo escogido arriba, solo «PDF» o «Word»)
     PROFASE_VISTA.wordPdf(op) pasa un Word a PDF (op.bytes, op.nombre, op.marca, op.boton) y regresa sus bytes; la descarga
                               la hace js/visor.js (ver «Bajar un Word como PDF», abajo)
   Cómo es (lo mismo que tenía el chat): se ve dentro del portal, sin bajar nada. El Excel se lee en un proceso aparte
   (Worker) con SheetJS y ExcelJS de cdnjs (las mismas versiones de siempre), para que un archivo raro no pueda tocar la
   página; el XML se lee con el lector del navegador, sin cargar nada de fuera, y su ficha del CFDI y el XML acomodado
   salen de js/cfdi.js (la página lo carga antes); todo lo que se pinta va escapado (esc). No baja, no sube ni guarda
   nada: «Bajar» lo hace la página. Sale con sus colores (claro u oscuro, los de la página que la pidió) en grande, con la
   ✕ («Cerrar (Esc)»), Esc o picando afuera para salir; pestañas de hojas, sus imágenes (el signo PROFASE de los Excel
   del portal) y «Copiar» del UUID. */
(function () {
  'use strict';
  if (window.PROFASE_VISTA) return;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var MAX_VISTA = 15 * 1024 * 1024, MAX_OFI = 30 * 1024 * 1024, MAX_FILAS = 1000, MAX_COLS = 60, MAX_TEXTO = 3 * 1024 * 1024;
  function tope(q) { return q === 'word' || q === 'ppt' ? MAX_OFI : MAX_VISTA; }
  var XLSX_URL = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
  // lo que tiene su propia vista (las mismas reglas del chat): el PDF (js/visor.js), la foto, el video y el audio
  function esPdf(a) { return /pdf/i.test(a.tipo || '') || /\.pdf$/i.test(a.nombre || ''); }
  function esImagen(a) { return /^image\/(png|jpe?g|gif|webp|bmp|heic|heif|avif)/i.test(a.tipo || '') || /\.(png|jpe?g|gif|webp|bmp|avif)$/i.test(a.nombre || ''); }
  function esVideo(a) { return /^video\//i.test(a.tipo || ''); }
  function esAudio(a) { return /^audio\//i.test(a.tipo || ''); }
  function ext(a) { return ((String(a.nombre || '').match(/\.([a-z0-9]{1,5})$/i) || [])[1] || '').toLowerCase(); }
  function tipo(a) {
    a = a || {};
    var e = ext(a), t = String(a.tipo || '').toLowerCase();
    if (esPdf(a) || esImagen(a) || esVideo(a) || esAudio(a)) return '';
    // los de Office nuevos (son un ZIP por dentro); los viejos (.doc, .ppt) no se pueden dibujar aquí
    if (/^(docx|docm|dotx|dotm)$/.test(e) || (!e && /wordprocessingml/.test(t))) return 'word';
    if (/^(pptx|pptm|ppsx|ppsm|potx|potm)$/.test(e) || (!e && /presentationml/.test(t))) return 'ppt';
    if (/^(doc|dot|ppt|pps|pot|rtf|odt|odp)$/.test(e)) return '';
    if (/^(xlsx|xlsm|xls|ods|csv)$/.test(e) || /spreadsheet|ms-excel|text\/csv/.test(t)) return 'hojas';
    if (e === 'xml' || /[\/+]xml$/.test(t)) return 'xml';
    if (/^(txt|log|json|md)$/.test(e) || t === 'text/plain' || t === 'application/json') return 'texto';
    return '';
  }
  // el cuadrito de arriba con su tipo (verde el Excel, morado el XML; los demás, gris con su extensión), como en el chat
  function insignia(a) {
    var e = ext(a), t = String(a.tipo || '').toLowerCase();
    if (/^(xls|xlsx|xlsm|ods)$/.test(e) || /spreadsheet|excel/.test(t)) return ['xls', e.toUpperCase() || 'XLS'];
    if (/^(docx|docm|dotx|dotm)$/.test(e) || /wordprocessingml/.test(t)) return ['doc', e.toUpperCase() || 'DOCX'];
    if (/^(pptx|pptm|ppsx|ppsm|potx|potm)$/.test(e) || /presentationml/.test(t)) return ['ppt', e.toUpperCase() || 'PPTX'];
    if (e === 'xml' || /xml/.test(t)) return ['xml', 'XML'];
    return ['', (e || 'ARCH').toUpperCase().slice(0, 4)];
  }
  // El Excel se lee en dos pasos dentro del mismo proceso aparte: SheetJS da los valores ya con su formato (montos,
  // fechas) y, si es .xlsx o .xlsm, ExcelJS (la misma versión que usa js/marca.js para armar los Excel del portal) da
  // cómo se ve: letra, colores, rellenos, bordes, alineación, anchos, altos e imágenes (el signo PROFASE de los Excel
  // del portal). Pedido de Daniel (30-oct-2026): «no veo el branding profase aquí»: la vista previa enseña el archivo
  // tal como es; si ExcelJS no puede, se ve como antes (solo los datos).
  var EXCELJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js';
  function trabajoExcel() {
    var MAXI = 20, MAXB = 3 * 1024 * 1024, EMU = 9525;
    function dos(n) { return (n < 10 ? '0' : '') + n; }
    // ---- colores de Excel: directos (ARGB), del tema del libro (con su «tinte») o de la paleta vieja (indexados)
    var IDX = ['000000', 'FFFFFF', 'FF0000', '00FF00', '0000FF', 'FFFF00', 'FF00FF', '00FFFF', '000000', 'FFFFFF', 'FF0000', '00FF00',
      '0000FF', 'FFFF00', 'FF00FF', '00FFFF', '800000', '008000', '000080', '808000', '800080', '008080', 'C0C0C0', '808080', '9999FF',
      '993366', 'FFFFCC', 'CCFFFF', '660066', 'FF8080', '0066CC', 'CCCCFF', '000080', 'FF00FF', 'FFFF00', '00FFFF', '800080', '800000',
      '008080', '0000FF', '00CCFF', 'CCFFFF', 'CCFFCC', 'FFFF99', '99CCFF', 'FF99CC', 'CC99FF', 'FFCC99', '3366FF', '33CCCC', '99CC00',
      'FFCC00', 'FF9900', 'FF6600', '666699', '969696', '003366', '339966', '003300', '333300', '993300', '993366', '333399', '333333'];
    var TEMA = ['FFFFFF', '000000', 'E7E6E6', '44546A', '4472C4', 'ED7D31', 'A5A5A5', 'FFC000', '5B9BD5', '70AD47', '0563C1', '954F72'];
    function leeTema(xml) {
      // el tema guarda dk1 lt1 dk2 lt2 …; Excel los numera lt1 dk1 lt2 dk2 accent1…6 hlink folHlink
      var orden = ['lt1', 'dk1', 'lt2', 'dk2', 'accent1', 'accent2', 'accent3', 'accent4', 'accent5', 'accent6', 'hlink', 'folHlink'];
      orden.forEach(function (n, i) {
        var b = new RegExp('<a:' + n + '>([\\s\\S]*?)</a:' + n + '>').exec(xml || '');
        var v = b && (/srgbClr val="([0-9A-Fa-f]{6})"/.exec(b[1]) || /lastClr="([0-9A-Fa-f]{6})"/.exec(b[1]));
        if (v) TEMA[i] = v[1].toUpperCase();
      });
    }
    function tinte(hex, t) {
      var c = [0, 2, 4].map(function (i) { return parseInt(hex.substr(i, 2), 16) / 255; });
      var mx = Math.max.apply(null, c), mn = Math.min.apply(null, c), l = (mx + mn) / 2, h = 0, s = 0, d = mx - mn;
      if (d) {
        s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
        h = mx === c[0] ? (c[1] - c[2]) / d + (c[1] < c[2] ? 6 : 0) : mx === c[1] ? (c[2] - c[0]) / d + 2 : (c[0] - c[1]) / d + 4;
        h /= 6;
      }
      l = t < 0 ? l * (1 + t) : l * (1 - t) + t;
      function f(p, q, x) { if (x < 0) x += 1; if (x > 1) x -= 1; return x < 1 / 6 ? p + (q - p) * 6 * x : x < 0.5 ? q : x < 2 / 3 ? p + (q - p) * (2 / 3 - x) * 6 : p; }
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
      return (s ? [f(p, q, h + 1 / 3), f(p, q, h), f(p, q, h - 1 / 3)] : [l, l, l]).map(function (x) {
        return ('0' + Math.round(Math.max(0, Math.min(1, x)) * 255).toString(16)).slice(-2);
      }).join('').toUpperCase();
    }
    function color(c) {
      if (!c || typeof c !== 'object') return '';
      var hex = '';
      if (typeof c.argb === 'string' && /^([0-9A-Fa-f]{2})?[0-9A-Fa-f]{6}$/.test(c.argb)) hex = c.argb.slice(-6);
      else if (typeof c.theme === 'number' && TEMA[c.theme]) hex = TEMA[c.theme];
      else if (typeof c.indexed === 'number') hex = c.indexed === 64 ? '000000' : c.indexed === 65 ? 'FFFFFF' : (IDX[c.indexed] || '');
      if (!hex) return '';
      hex = hex.toUpperCase();
      return typeof c.tint === 'number' && c.tint ? tinte(hex, Math.max(-1, Math.min(1, c.tint))) : hex;
    }
    var GROSOR = { thin: 1, hair: 1, dotted: 1, dashed: 1, dashDot: 1, dashDotDot: 1, medium: 2, mediumDashed: 2, mediumDashDot: 2,
      mediumDashDotDot: 2, slantDashDot: 2, thick: 3, double: 3 };
    function linea(b) { return b && GROSOR[b.style] ? [GROSOR[b.style], color(b.color) || '000000'] : null; }
    // lo que importa de cómo se ve una celda, en llaves cortas (b, i, u, x, fs, ff, fc, bg, ha, va, w, ind y los bordes)
    function estilo(cel) {
      var s = {}, f = cel.font, fi = cel.fill, al = cel.alignment, bo = cel.border;
      if (f) {
        if (f.bold) s.b = 1;
        if (f.italic) s.i = 1;
        if (f.underline) s.u = 1;
        if (f.strike) s.x = 1;
        if (typeof f.size === 'number' && f.size > 0) s.fs = Math.max(5, Math.min(72, f.size));
        if (typeof f.name === 'string' && /^[A-Za-z0-9 \-]{1,40}$/.test(f.name)) s.ff = f.name;
        var fc = color(f.color);
        if (fc) s.fc = fc;
      }
      if (fi) {
        var bg = '';
        if (fi.type === 'pattern' && fi.pattern && fi.pattern !== 'none') bg = color(fi.fgColor) || color(fi.bgColor);
        else if (fi.type === 'gradient' && fi.stops && fi.stops[0]) bg = color(fi.stops[0].color);
        if (bg) s.bg = bg;
      }
      if (al) {
        var ha = { left: 'l', fill: 'l', center: 'c', centerContinuous: 'c', distributed: 'c', right: 'r', justify: 'j' }[al.horizontal];
        var va = { top: 't', justify: 't', middle: 'm', center: 'm', distributed: 'm', bottom: 'b' }[al.vertical];
        if (ha) s.ha = ha;
        if (va) s.va = va;
        if (al.wrapText || ha === 'j') s.w = 1;
        if (al.indent > 0) s.ind = Math.min(15, al.indent | 0);
      }
      if (bo) [['top', 'bt'], ['left', 'bl'], ['bottom', 'bb'], ['right', 'br']].forEach(function (k) { var l = linea(bo[k[0]]); if (l) s[k[1]] = l; });
      return s;
    }
    function anchoPx(w) { return Math.max(0, Math.min(2000, Math.floor((256 * w + Math.floor(128 / 7)) / 256 * 7))); }
    function num(x) { x = +x; return isFinite(x) ? x : 0; }
    async function formatos(buf, lim) {
      var leido = new ExcelJS.Workbook();
      await leido.xlsx.load(buf);
      var wb = leido;
      try { var th = wb._themes || {}; leeTema(th.theme1 || th[Object.keys(th)[0]] || ''); } catch (x) { /* tema de siempre */ }
      var out = {}, total = 0;
      wb.eachSheet(function (ws) {
        var L = lim[ws.name];
        if (!L) return;
        var o = { cw: {}, rh: {}, st: {}, img: [], grid: true }, pr = ws.properties || {};
        try { o.grid = !(ws.views && ws.views[0] && ws.views[0].showGridLines === false); } catch (x) { /* con rejilla */ }
        o.dcw = pr.defaultColWidth > 0 ? anchoPx(pr.defaultColWidth) : 64;
        o.drh = pr.defaultRowHeight > 0 ? Math.round(Math.min(409, pr.defaultRowHeight) * 4 / 3) : 20;
        for (var C = L.c0; C <= L.c1; C++) {
          var col = ws.getColumn(C + 1);
          if (col.hidden) o.cw[C] = 0; else if (col.width > 0) o.cw[C] = anchoPx(col.width);
        }
        for (var R = L.r0; R <= L.r1; R++) {
          var row = ws.findRow(R + 1);
          if (!row) continue;
          if (row.hidden) o.rh[R] = 0; else if (row.height > 0) o.rh[R] = Math.round(Math.min(409, row.height) * 4 / 3);
          for (var C2 = L.c0; C2 <= L.c1; C2++) {
            var cel = row.findCell(C2 + 1);
            if (!cel) continue;
            var s = estilo(cel);
            if (Object.keys(s).length) o.st[R + ',' + C2] = s;
          }
        }
        // un borde izquierdo es el derecho de la celda de al lado, y uno de arriba es el de abajo de la de arriba:
        // así cada línea se dibuja una sola vez
        function pasa(desde, a, k1, k2) {
          var s = o.st[desde], l = s[k1];
          delete s[k1];
          var t = o.st[a] || (o.st[a] = {});
          if (!t[k2] || t[k2][0] < l[0]) t[k2] = l;
        }
        Object.keys(o.st).forEach(function (k) {
          var p = k.split(','), r = +p[0], c = +p[1], s = o.st[k];
          if (s.bl && c > L.c0) pasa(k, r + ',' + (c - 1), 'bl', 'br');
          if (s.bt && r > L.r0) pasa(k, (r - 1) + ',' + c, 'bt', 'bb');
        });
        // imágenes (png, jpg, gif o bmp; las demás no se pueden enseñar en la página)
        (ws.getImages ? ws.getImages() : []).forEach(function (im) {
          if (o.img.length >= MAXI) return;
          var m = wb.getImage(+im.imageId), rg = im.range || {}, tl = rg.tl, br = rg.br;
          var tipo = m && { png: 'image/png', jpeg: 'image/jpeg', jpg: 'image/jpeg', gif: 'image/gif', bmp: 'image/bmp' }[String(m.extension || '').toLowerCase()];
          if (!tipo || !m.buffer || !tl) return;
          var u = m.buffer, b = u.buffer ? u.buffer.slice(u.byteOffset || 0, (u.byteOffset || 0) + u.byteLength) : null;
          if (!b || !b.byteLength || b.byteLength > MAXB || total + b.byteLength > 4 * MAXB) return;
          var a = { tipo: tipo, b: b, c: num(tl.nativeCol), co: num(tl.nativeColOff) / EMU, r: num(tl.nativeRow), ro: num(tl.nativeRowOff) / EMU };
          if (rg.ext && rg.ext.width > 0 && rg.ext.height > 0) { a.w = num(rg.ext.width); a.h = num(rg.ext.height); }
          else if (br) { a.c2 = num(br.nativeCol); a.co2 = num(br.nativeColOff) / EMU; a.r2 = num(br.nativeRow); a.ro2 = num(br.nativeRowOff) / EMU; }
          else return;
          o.img.push(a); total += b.byteLength;
        });
        out[ws.name] = o;
      });
      return out;
    }
    self.onmessage = async function (e) {
      var F = e.data.F, K = e.data.K;
      try {
        importScripts(e.data.url);
        var op = { cellDates: true, sheetRows: F + 1, raw: e.data.s != null };
        var wb = e.data.s != null ? XLSX.read(e.data.s, Object.assign({ type: 'string' }, op)) : XLSX.read(e.data.b, Object.assign({ type: 'array' }, op));
        var ocultas = 0, hojas = [], lim = {}, previas = [];
        wb.SheetNames.forEach(function (n, i) {
          var meta = wb.Workbook && wb.Workbook.Sheets && wb.Workbook.Sheets[i];
          if (meta && meta.Hidden) { ocultas++; return; }
          if (hojas.length >= 40) return;
          var ws = wb.Sheets[n], h = { n: String(n), r0: 0, c0: 0, f: [], t: [], m: [], masF: false, masC: false };
          hojas.push(h);
          if (!ws || !ws['!ref']) return;
          var r = XLSX.utils.decode_range(ws['!ref']), full = ws['!fullref'] ? XLSX.utils.decode_range(ws['!fullref']) : r;
          var r1 = Math.min(r.e.r, r.s.r + F - 1), c1 = Math.min(r.e.c, r.s.c + K - 1);
          h.r0 = r.s.r; h.c0 = r.s.c; h.masF = full.e.r > r1; h.masC = full.e.c > c1;
          lim[n] = { r0: r.s.r, r1: r1, c0: r.s.c, c1: c1 };
          previas.push({ h: h, ws: ws, r1: r1, c1: c1 });
        });
        // cómo se ve (solo .xlsx/.xlsm); si tarda más de 12 s o falla, se enseñan solo los datos
        var fmt = null;
        if (e.data.fmt && e.data.b && previas.length) {
          try {
            importScripts(e.data.fmt);
            fmt = await Promise.race([formatos(e.data.b, lim), new Promise(function (ok) { setTimeout(function () { ok(null); }, 12000); })]);
          } catch (x) { fmt = null; }
        }
        var manda = [];
        previas.forEach(function (p) {
          var h = p.h, ws = p.ws, sf = fmt && fmt[h.n], ultF = -1, ultC = -1;
          for (var R = h.r0; R <= p.r1; R++) {
            var fila = [], tip = '';
            for (var C = h.c0; C <= p.c1; C++) {
              var c = ws[XLSX.utils.encode_cell({ r: R, c: C })], v = '', t = 's';
              if (c) {
                if (c.t === 'd' && c.v instanceof Date && !isNaN(c.v)) {
                  var d = c.v; v = dos(d.getDate()) + '/' + dos(d.getMonth() + 1) + '/' + d.getFullYear();
                  if (d.getHours() || d.getMinutes()) v += ' ' + dos(d.getHours()) + ':' + dos(d.getMinutes());
                  t = 'd';
                } else {
                  v = c.w != null ? c.w : (c.v != null ? String(c.v) : '');
                  if (c.t === 'n' || (c.t === 's' && e.data.s != null && /^-?\$?[\d,]*\.?\d+$/.test(v))) t = 'n'; else if (c.t === 'e') t = 'e'; else if (c.t === 'b') t = 'b';
                }
              }
              v = String(v).slice(0, 400);
              if (v !== '') { ultC = Math.max(ultC, C); ultF = R; }
              fila.push(v); tip += t;
            }
            h.f.push(fila); h.t.push(tip);
          }
          // con formato, también cuentan las celdas vacías que se ven (relleno o borde), como la línea azul de la marca
          if (sf) Object.keys(sf.st).forEach(function (k) {
            var s = sf.st[k], q = k.split(','), R2 = +q[0], C2 = +q[1];
            if ((s.bg || s.bb || s.br || s.bt || s.bl) && R2 <= p.r1 && C2 <= p.c1) { ultF = Math.max(ultF, R2); ultC = Math.max(ultC, C2); }
          });
          if (ultF < 0) { h.f = []; h.t = []; return; }
          h.f = h.f.slice(0, ultF - h.r0 + 1).map(function (x) { return x.slice(0, ultC - h.c0 + 1); });
          h.t = h.t.slice(0, ultF - h.r0 + 1).map(function (x) { return x.slice(0, ultC - h.c0 + 1); });
          (ws['!merges'] || []).forEach(function (m) {
            if (h.m.length >= 2000) return;
            var a = m.s.r - h.r0, b = m.s.c - h.c0, a2 = Math.min(m.e.r - h.r0, h.f.length - 1), b2 = Math.min(m.e.c - h.c0, ultC - h.c0);
            if (a >= 0 && b >= 0 && a < h.f.length && b <= ultC - h.c0 && (a2 > a || b2 > b)) h.m.push([a, b, a2, b2]);
          });
          if (!sf) return;
          // estilos sin repetir (h.est) y, por celda, cuál le toca (h.s; 0 = ninguno)
          var nf = h.f.length, nc = ultC - h.c0 + 1, idx = {};
          h.est = []; h.s = []; h.cw = []; h.rh = []; h.grid = sf.grid; h.dcw = sf.dcw; h.drh = sf.drh;
          for (var c2 = 0; c2 < nc; c2++) h.cw.push(sf.cw[h.c0 + c2] != null ? sf.cw[h.c0 + c2] : sf.dcw);
          for (var r2 = 0; r2 < nf; r2++) {
            h.rh.push(sf.rh[h.r0 + r2] != null ? sf.rh[h.r0 + r2] : sf.drh);
            var fs = [];
            for (var c3 = 0; c3 < nc; c3++) {
              var s2 = sf.st[(h.r0 + r2) + ',' + (h.c0 + c3)], j = 0;
              if (s2) {
                var k2 = JSON.stringify(s2);
                j = idx[k2] || (idx[k2] = h.est.push(s2));
              }
              fs.push(j);
            }
            h.s.push(fs);
          }
          h.img = sf.img.filter(function (a) { return a.c >= h.c0 && a.r >= h.r0; });
          h.img.forEach(function (a) { manda.push(a.b); });
        });
        self.postMessage({ ok: true, hojas: hojas, ocultas: ocultas }, manda);
      } catch (er) { self.postMessage({ ok: false, error: String(er && er.message || er) }); }
    };
  }
  var TRABAJO = '(' + trabajoExcel.toString() + ')();';
  function leeHojas(b, csv, fmt) {
    return new Promise(function (ok, ko) {
      var url = URL.createObjectURL(new Blob([TRABAJO], { type: 'text/javascript' })), w;
      try { w = new Worker(url); } catch (e) { URL.revokeObjectURL(url); ko(e); return; }
      var t = setTimeout(function () { w.terminate(); URL.revokeObjectURL(url); ko(new Error('El archivo tardó demasiado en abrir. Qué hacer: bájalo con «Bajar» y ábrelo en tu equipo.')); }, 25000);
      w.onmessage = function (ev) { clearTimeout(t); w.terminate(); URL.revokeObjectURL(url); var d = ev.data || {}; if (d.ok) ok(d); else ko(new Error(d.error || 'No se pudo leer')); };
      w.onerror = function (ev) { clearTimeout(t); w.terminate(); URL.revokeObjectURL(url); ko(new Error((ev && ev.message) || 'No se pudo leer')); };
      // el CSV se lee como texto (con sus acentos); lo demás, tal cual
      if (csv) { w.postMessage({ url: XLSX_URL, s: decodifica(b), F: MAX_FILAS, K: MAX_COLS }); return; }
      var copia = b.slice();
      w.postMessage({ url: XLSX_URL, b: copia.buffer, fmt: fmt ? EXCELJS_URL : '', F: MAX_FILAS, K: MAX_COLS }, [copia.buffer]);
    });
  }
  function letra(n) { var s = ''; n++; while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; }
  function notaTope(h) {
    return h.masF || h.masC ? '<p class="vx-nota">Aquí se ven ' + (h.masF ? 'los primeros ' + MAX_FILAS.toLocaleString('es-MX') + ' renglones' : '') + (h.masF && h.masC ? ' y ' : '') + (h.masC ? 'las primeras ' + MAX_COLS + ' columnas' : '') + '. Para verlo completo, bájalo.</p>' : '';
  }
  function tablaHoja(h) {
    if (!h.f.length) return '<p class="vx-vacio">Esta hoja está vacía.</p>';
    if (h.est) return tablaFormato(h);
    var nc = 0; h.f.forEach(function (f) { nc = Math.max(nc, f.length); });
    var tapa = {}, span = {};
    h.m.forEach(function (m) {
      span[m[0] + ',' + m[1]] = [m[2] - m[0] + 1, m[3] - m[1] + 1];
      for (var r = m[0]; r <= m[2]; r++) for (var c = m[1]; c <= m[3]; c++) if (r !== m[0] || c !== m[1]) tapa[r + ',' + c] = 1;
    });
    var x = '<table class="vx-t"><thead><tr><th class="vx-esq" scope="col"></th>';
    for (var c = 0; c < nc; c++) x += '<th scope="col">' + letra(h.c0 + c) + '</th>';
    x += '</tr></thead><tbody>';
    h.f.forEach(function (f, r) {
      x += '<tr><th scope="row">' + (h.r0 + r + 1) + '</th>';
      for (var c = 0; c < nc; c++) {
        if (tapa[r + ',' + c]) continue;
        var v = f[c] || '', t = (h.t[r] || '').charAt(c), sp = span[r + ',' + c];
        x += '<td' + (t === 'n' ? ' class="n"' : t === 'e' ? ' class="e"' : '') + (sp ? (sp[0] > 1 ? ' rowspan="' + sp[0] + '"' : '') + (sp[1] > 1 ? ' colspan="' + sp[1] + '"' : '') : '') + (v.length > 40 ? ' title="' + esc(v) + '"' : '') + '>' + esc(v) + '</td>';
      }
      x += '</tr>';
    });
    x += '</tbody></table>';
    return x + notaTope(h);
  }
  // ---- el Excel como se ve: letra, colores, bordes, anchos, altos y, encima, sus imágenes (ponImagenes)
  var HEX = /^[0-9A-F]{6}$/;
  function px(v, max) { v = +v; return isFinite(v) ? Math.max(0, Math.min(max || 2000, Math.round(v))) : 0; }
  function cssCelda(s) {
    var x = [];
    if (!s) return x;
    if (s.b) x.push('font-weight:700');
    if (s.i) x.push('font-style:italic');
    if (s.u || s.x) x.push('text-decoration:' + (s.u ? 'underline' : '') + (s.u && s.x ? ' ' : '') + (s.x ? 'line-through' : ''));
    if (typeof s.fs === 'number' && isFinite(s.fs)) x.push('font-size:' + (Math.max(5, Math.min(72, s.fs)) * 4 / 3).toFixed(1) + 'px');
    if (typeof s.ff === 'string' && /^[A-Za-z0-9 \-]{1,40}$/.test(s.ff)) x.push("font-family:'" + s.ff + "',Calibri,Carlito,Arial,sans-serif");
    if (HEX.test(s.fc)) x.push('color:#' + s.fc);
    if (HEX.test(s.bg)) x.push('background:#' + s.bg);
    return x;
  }
  function raya(l) { return l && HEX.test(l[1]) ? [Math.max(1, Math.min(3, l[0] | 0)), '#' + l[1]] : null; }
  function tablaFormato(h) {
    var nf = h.f.length, nc = 0, tapa = {}, span = {}, est = h.est || [];
    h.f.forEach(function (f) { nc = Math.max(nc, f.length); });
    h.m.forEach(function (m) {
      span[m[0] + ',' + m[1]] = [m[2] - m[0] + 1, m[3] - m[1] + 1];
      for (var r = m[0]; r <= m[2]; r++) for (var c = m[1]; c <= m[3]; c++) if (r !== m[0] || c !== m[1]) tapa[r + ',' + c] = 1;
    });
    function st(r, c) { var j = h.s[r] && h.s[r][c]; return j ? est[j - 1] : null; }
    function vacia(r, c) { return !tapa[r + ',' + c] && !(h.f[r][c] || ''); }
    function anchoDe(c1, c2) { var w = 0; for (var i = c1; i <= c2; i++) w += cw[i] || 0; return w; }
    var cw = [], tot = 46;
    for (var c = 0; c < nc; c++) { cw.push(px(h.cw && h.cw[c] != null ? h.cw[c] : 64)); tot += cw[c]; }
    var x = '<div class="vx-hoja"><table class="vx-t vx-fmt" style="width:' + tot + 'px"><colgroup><col style="width:46px">';
    cw.forEach(function (w) { x += '<col style="width:' + w + 'px">'; });
    x += '</colgroup><thead><tr><th class="vx-esq" scope="col"></th>';
    for (c = 0; c < nc; c++) x += '<th scope="col"' + (cw[c] ? '' : ' class="vx-oc"') + '>' + letra(h.c0 + c) + '</th>';
    x += '</tr></thead><tbody>';
    for (var r = 0; r < nf; r++) {
      var alto = px(h.rh && h.rh[r] != null ? h.rh[r] : 20, 600);
      x += '<tr style="height:' + alto + 'px' + (alto ? '' : ';display:none') + '"><th scope="row">' + (h.r0 + r + 1) + '</th>';
      for (c = 0; c < nc; c++) {
        if (tapa[r + ',' + c]) continue;
        var s = st(r, c), sp = span[r + ',' + c], v = h.f[r][c] || '', t = (h.t[r] || '').charAt(c), css = cssCelda(s);
        var r2 = sp ? r + sp[0] - 1 : r, c2 = sp ? c + sp[1] - 1 : c;
        // bordes y rejilla como sombras por dentro (no mueven nada): derecha y abajo de la última celda que cubre
        var sd = st(r, c2), sb = st(r2, c), ld = raya(sd && sd.br), lb = raya(sb && sb.bb), li = raya(s && s.bl), la = raya(s && s.bt), sombras = [];
        var rejilla = h.grid && !(s && HEX.test(s.bg));
        if (ld) sombras.push('inset -' + ld[0] + 'px 0 ' + ld[1]); else if (rejilla) sombras.push('inset -1px 0 #DADCE0');
        if (lb) sombras.push('inset 0 -' + lb[0] + 'px ' + lb[1]); else if (rejilla) sombras.push('inset 0 -1px #DADCE0');
        if (li) sombras.push('inset ' + li[0] + 'px 0 ' + li[1]);
        if (la) sombras.push('inset 0 ' + la[0] + 'px ' + la[1]);
        if (sombras.length) css.push('box-shadow:' + sombras.join(','));
        var ha = s && /^[lcrj]$/.test(s.ha) ? s.ha : (t === 'n' ? 'r' : t === 'b' || t === 'e' ? 'c' : 'l'), va = s && /^[tmb]$/.test(s.va) ? s.va : 'b';
        css.push('text-align:' + { l: 'left', c: 'center', r: 'right', j: 'justify' }[ha]);
        css.push('vertical-align:' + { t: 'top', m: 'middle', b: 'bottom' }[va]);
        var ind = s && s.ind ? 3 + Math.min(15, s.ind | 0) * 9 : 0;
        if (ind && ha === 'r') css.push('padding-right:' + ind + 'px'); else if (ind) css.push('padding-left:' + ind + 'px');
        if (!cw[c]) css = ['box-shadow:none'];
        var ajusta = s && s.w, clase = !cw[c] ? 'vx-oc' : '', dentro = esc(v);
        if (ajusta && v) dentro = '<div class="vx-aj" style="max-height:' + Math.max(alto * (sp ? sp[0] : 1), 16) + 'px">' + dentro + '</div>';
        // como en Excel, el texto que no cabe sigue sobre las celdas vacías de la derecha, hasta la primera que trae algo
        else if (v && !sp && ha === 'l' && t !== 'n' && c + 1 < nc && vacia(r, c + 1)) {
          var hasta = c + 1, ancho = cw[c] - (ind || 3) - 3;
          while (hasta < nc && vacia(r, hasta)) ancho += cw[hasta++];
          clase += (clase ? ' ' : '') + 'sale';
          dentro = '<div class="vx-sl" style="width:' + Math.max(ancho, 0) + 'px">' + dentro + '</div>';
        }
        x += '<td' + (clase ? ' class="' + clase + '"' : '') + (sp ? (sp[0] > 1 ? ' rowspan="' + sp[0] + '"' : '') + (sp[1] > 1 ? ' colspan="' + sp[1] + '"' : '') : '')
          + ' style="' + css.join(';') + '"' + (v && (v.length > 40 || v.length * 7.5 > anchoDe(c, c2)) ? ' title="' + esc(v) + '"' : '') + '>' + dentro + '</td>';
      }
      x += '</tr>';
    }
    return x + '</tbody></table></div>' + notaTope(h);
  }
  // las imágenes del Excel (por ejemplo, el signo PROFASE) encima de la tabla, en su lugar
  var TIPOS_IMG = { 'image/png': 1, 'image/jpeg': 1, 'image/gif': 1, 'image/bmp': 1 };
  function ponImagenes(cu, h, ligas) {
    if (!h || !h.img || !h.img.length) return;
    var hoja = cu.querySelector('.vx-hoja');
    if (!hoja) return;
    var W = hoja.getBoundingClientRect(), ths = hoja.querySelectorAll('thead th'), trs = hoja.querySelectorAll('tbody tr');
    var nc = ths.length - 1, dcw = px(h.dcw || 64), drh = px(h.drh || 20);
    function x(c, d) {
      var i = c - h.c0;
      if (!(i >= 0) || !nc) return null;
      if (i < nc) return ths[i + 1].getBoundingClientRect().left - W.left + d;
      return ths[nc].getBoundingClientRect().right - W.left + (i - nc) * dcw + d;
    }
    function y(r, d) {
      var i = r - h.r0;
      if (!(i >= 0) || !trs.length) return null;
      if (i < trs.length) { var b = trs[i].getBoundingClientRect(); return b.height ? b.top - W.top + d : null; }
      return trs[trs.length - 1].getBoundingClientRect().bottom - W.top + (i - trs.length) * drh + d;
    }
    h.img.forEach(function (a) {
      if (!TIPOS_IMG[a.tipo] || !a.b) return;
      var x1 = x(a.c, +a.co || 0), y1 = y(a.r, +a.ro || 0), w, al;
      if (x1 == null || y1 == null) return;
      if (a.w > 0) { w = +a.w; al = +a.h; }
      else { var x2 = x(a.c2, +a.co2 || 0), y2 = y(a.r2, +a.ro2 || 0); if (x2 == null || y2 == null) return; w = x2 - x1; al = y2 - y1; }
      if (!(w > 0 && al > 0 && w < 5000 && al < 5000)) return;
      if (!a.u) { a.u = URL.createObjectURL(new Blob([a.b], { type: a.tipo })); ligas.push(a.u); }
      var im = hoja.ownerDocument.createElement('img');
      im.className = 'vx-img'; im.alt = ''; im.decoding = 'async'; im.src = a.u;
      im.style.left = x1.toFixed(1) + 'px'; im.style.top = y1.toFixed(1) + 'px'; im.style.width = w.toFixed(1) + 'px'; im.style.height = al.toFixed(1) + 'px';
      hoja.appendChild(im);
    });
  }
  function decodifica(b) {
    var cab = '';
    for (var i = 0; i < Math.min(b.length, 200); i++) cab += String.fromCharCode(b[i]);
    var enc = (/encoding\s*=\s*["']([\w-]+)["']/i.exec(cab) || [])[1] || 'utf-8';
    if (b[0] === 0xEF && b[1] === 0xBB && b[2] === 0xBF) enc = 'utf-8';
    try { return new TextDecoder(enc, { fatal: true }).decode(b); } catch (e) { /* sigue */ }
    try { return new TextDecoder('utf-8', { fatal: true }).decode(b); } catch (e) { return new TextDecoder('windows-1252').decode(b); }
  }
  /* En grande, encima de TODA la pantalla, como la foto del chat (Héctor Daniel, 6-nov-2026: «Si», a que los archivos que
     se abren con «Ver» salgan en grande). Sale en la página que da op.capa (la de arriba, la vista: encima del encabezado,
     el menú, la burbuja y la ventanita del chat); sin ella, aquí mismo. Se sale con la ✕ de arriba a la derecha, con Esc
     o picando afuera. Sus estilos (VX_CSS) se ponen en esa página (#pf-vx-css) con los colores de la página que la pidió
     (copiaVars), y los de la ficha del CFDI con PROFASE_CFDI.estilos (una sola versión). «Bajar» lo hace la página
     (op.alBajar) desde el botón de esa página, así en la app del iPhone y del iPad «Tu archivo está listo» sale encima.
     Si la página que la pidió se recarga con ella abierta, se cierra (pagehide). Una sola abierta por página: si otra
     pantalla (otro marco) ya tenía una abierta allá, esa se cierra. */
  var VX_CSS = '#pf-vx{position:fixed;inset:0;z-index:9000;margin:0;background:rgba(5,10,20,.72);display:flex;align-items:center;justify-content:center;'
    + 'padding:max(2vh,env(safe-area-inset-top,0px)) max(2vw,env(safe-area-inset-right,0px)) max(2vh,env(safe-area-inset-bottom,0px)) max(2vw,env(safe-area-inset-left,0px));'
    + 'font-family:var(--f-body,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif);font-size:14.5px;line-height:1.45;color:var(--ink);'
    + '-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased;overscroll-behavior:contain;animation:pf-vx-entra .16s ease-out}'
    + '@keyframes pf-vx-entra{from{opacity:0}to{opacity:1}}'
    + '#pf-vx *{box-sizing:border-box}'
    + '#pf-vx button{font:inherit;color:inherit;cursor:pointer;margin:0;-webkit-tap-highlight-color:transparent}'
    + '#pf-vx [hidden]{display:none!important}'
    + '#pf-vx :focus-visible{outline:2px solid var(--accent);outline-offset:2px}'
    + '#pf-vx .vx-p{background:var(--surface);color:var(--ink);border-radius:14px;box-shadow:0 18px 50px rgba(0,0,0,.35);width:min(1200px,100%);height:100%;display:flex;flex-direction:column;overflow:hidden}'
    + '#pf-vx .vx-cab{flex:none;display:flex;align-items:center;gap:10px;padding:10px 10px 10px 14px;border-bottom:1px solid var(--line)}'
    + '#pf-vx .vx-cab b{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14.5px}'
    + '#pf-vx .vx-cab .tipo{flex:none;width:34px;height:34px;border-radius:8px;display:grid;place-items:center;font-size:10px;font-weight:800;color:#fff;background:#5A6577}'
    + '#pf-vx .vx-cab .tipo.xls{background:#1D6F42}#pf-vx .vx-cab .tipo.xml{background:#7A4CC2}'
    + '#pf-vx .vx-cab .tipo.doc{background:#2B5797}#pf-vx .vx-cab .tipo.ppt{background:#C43E1C}'
    // «Con marca PROFASE» / «Original (sin marca)» (24-nov-2026): en su propio renglón, abajo del nombre (en el celular,
    // a todo lo ancho); así los botones de arriba nunca se enciman
    + '#pf-vx .vx-modos{flex:none;display:flex;padding:8px 14px;border-bottom:1px solid var(--line);background:var(--surface)}'
    + '#pf-vx .vx-modo{flex:none;display:inline-flex;border:1px solid var(--line-strong);border-radius:10px;overflow:hidden;background:var(--surface-2)}'
    + '#pf-vx .vx-modo button{border:0;background:none;color:var(--muted);height:36px;padding:0 12px;font-weight:600;font-size:13px;white-space:nowrap}'
    + '#pf-vx .vx-modo button+button{border-left:1px solid var(--line-strong)}'
    + '#pf-vx .vx-modo button[aria-pressed="true"]{background:var(--navy);color:var(--navy-ink,#fff);box-shadow:inset 0 -3px 0 var(--accent,#F07A1E)}'
    + '#pf-vx .vx-area{flex:1;min-height:0;position:relative;display:flex;flex-direction:column}'
    + '#pf-vx .vx-area>.vx-cu{flex:1;min-height:0}'
    // la marca sobre el Excel (lo que se ve), como la de los PDF: marca de agua al centro y el pie abajo a la izquierda
    + '#pf-vx .vx-sello{position:absolute;inset:0;pointer-events:none;z-index:4;overflow:hidden;display:none}'
    + '#pf-vx.vx-conmarca .vx-sello{display:block}'
    + '#pf-vx .vx-sello .vx-agua{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(60%,400px);height:auto;max-height:60%;object-fit:contain;opacity:.55}'
    + '#pf-vx .vx-sello .vx-pie{position:absolute;left:16px;bottom:8px;display:flex;align-items:center;gap:4px;font:9px/1 Helvetica,Arial,sans-serif;white-space:nowrap;background:rgba(255,255,255,.82);padding:2px 6px 2px 4px;border-radius:4px}'
    + '#pf-vx .vx-sello .vx-pie img{width:11px;height:12px;display:block}'
    + '#pf-vx .vx-sello .vx-pie b{color:#1F3864;font-size:8.7px}#pf-vx .vx-sello .vx-pie i{color:#5A6577;font-size:8px;margin-left:6px}'
    // Word y PowerPoint: el marco aislado ocupa todo; mientras se dibuja, «Abriendo…»
    + '#pf-vx .vx-cu.vx-cu-ofi{position:relative;overflow:hidden;background:var(--surface-2)}'
    // mientras se dibuja, transparente (no «visibility:hidden»: así el iPhone y el iPad ya lo dejan deslizar al enseñarse)
    + '#pf-vx .vx-ofi{position:absolute;inset:0;width:100%;height:100%;border:0;display:block;opacity:0;pointer-events:none;background:var(--surface-2)}'
    + '#pf-vx .vx-ofi.listo{opacity:1;pointer-events:auto}'
    + '#pf-vx .vx-carga{position:absolute;inset:0;display:flex;flex-direction:column;gap:12px;align-items:center;justify-content:center;color:var(--muted);font-size:14px;padding:24px;text-align:center}'
    + '#pf-vx .vx-gira{width:30px;height:30px;border-radius:50%;border:3px solid var(--line);border-top-color:var(--accent,#F07A1E);animation:pf-vx-g .8s linear infinite}'
    + '@keyframes pf-vx-g{to{transform:rotate(360deg)}}'
    + '#pf-vx .vx-baja{flex:none;border:1px solid var(--line-strong);background:var(--surface);color:var(--ink);border-radius:10px;height:38px;padding:0 14px;font-weight:600;font-size:13.5px;display:inline-flex;align-items:center;white-space:nowrap}'
    + '#pf-vx .vx-baja:hover{border-color:var(--navy)}'
    + '#pf-vx .vx-baja[disabled]{opacity:.55;cursor:default}'
    + '#pf-vx .vx-x{flex:none;width:40px;height:40px;border-radius:50%;border:1px solid var(--line-strong);background:var(--surface-2);color:var(--ink);display:grid;place-items:center;padding:0}'
    + '#pf-vx .vx-x svg{width:20px;height:20px;display:block}'
    + '#pf-vx .vx-x:hover{background:#F07A1E;border-color:#F07A1E;color:#14233F}'
    + '#pf-vx .vx-tabs{flex:none;display:flex;gap:4px;padding:8px 10px 0;overflow-x:auto;scrollbar-width:thin;border-bottom:1px solid var(--line);background:var(--surface-2)}'
    + '#pf-vx .vx-tabs button{flex:none;border:1px solid transparent;border-bottom:0;background:none;color:var(--muted);padding:7px 12px;border-radius:8px 8px 0 0;font-weight:600;font-size:13px;white-space:nowrap;max-width:220px;overflow:hidden;text-overflow:ellipsis}'
    + '#pf-vx .vx-tabs button[aria-selected="true"]{background:var(--surface);color:var(--ink);border-color:var(--line);box-shadow:inset 0 3px 0 #1D6F42}'
    + '#pf-vx .vx-cu{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}'
    + '#pf-vx .vx-t{border-collapse:separate;border-spacing:0;font-size:12.5px;font-variant-numeric:tabular-nums}'
    + '#pf-vx .vx-t th,#pf-vx .vx-t td{border-right:1px solid var(--line);border-bottom:1px solid var(--line);padding:4px 8px;white-space:nowrap;max-width:360px;overflow:hidden;text-overflow:ellipsis;text-align:left;vertical-align:top}'
    + '#pf-vx .vx-t td.n{text-align:right}#pf-vx .vx-t td.e{color:var(--red)}'
    + '#pf-vx .vx-t thead th{position:sticky;top:0;z-index:2;background:var(--surface-3);color:var(--muted);font-weight:600;text-align:center;font-size:11.5px}'
    + '#pf-vx .vx-t tbody th{position:sticky;left:0;z-index:1;background:var(--surface-2);color:var(--muted);font-weight:600;text-align:right;font-size:11.5px;min-width:36px}'
    + '#pf-vx .vx-t thead th.vx-esq{left:0;z-index:3}'
    + '#pf-vx .vx-hoja{position:relative;display:inline-block;vertical-align:top}'
    + '#pf-vx .vx-fmt{table-layout:fixed;font:14.7px/1.2 Calibri,Carlito,"Segoe UI",Arial,sans-serif}'
    + '#pf-vx .vx-fmt th{font-family:var(--f-body,inherit);overflow:hidden;text-overflow:clip;padding:2px 4px;line-height:1.2}'
    + '#pf-vx .vx-fmt td{background:#fff;color:#000;padding:0 3px;max-width:none;border:0;white-space:nowrap;overflow:hidden;text-overflow:clip;vertical-align:bottom}'
    + '#pf-vx .vx-fmt td.sale{overflow:visible}'
    + '#pf-vx .vx-fmt .vx-sl{overflow:hidden;white-space:nowrap}'
    + '#pf-vx .vx-fmt .vx-aj{overflow:hidden;white-space:pre-wrap;overflow-wrap:anywhere}'
    + '#pf-vx .vx-fmt .vx-oc{padding:0;font-size:0;border:0;box-shadow:none}'
    + '#pf-vx .vx-img{position:absolute;z-index:0;pointer-events:none;max-width:none;user-select:none}'
    + '#pf-vx .vx-vacio,#pf-vx .vx-nota{color:var(--muted);font-size:12.5px;margin:10px 14px}'
    // en el celular, de orilla a orilla (con lugar para la hora y la rayita del iPhone)
    + '@media (max-width:759px){#pf-vx{padding:0}#pf-vx .vx-p{width:100%;height:100%;border-radius:0}'
    + '#pf-vx .vx-modos{padding-left:max(14px,env(safe-area-inset-left,0px));padding-right:max(14px,env(safe-area-inset-right,0px))}'
    + '#pf-vx .vx-modo{flex:1 1 100%}#pf-vx .vx-modo button{flex:1 1 50%;padding:0 6px}'
    + '#pf-vx .vx-cab{padding-top:max(10px,env(safe-area-inset-top,0px));padding-left:max(14px,env(safe-area-inset-left,0px));padding-right:max(10px,env(safe-area-inset-right,0px))}'
    + '#pf-vx .vx-cu{margin-bottom:env(safe-area-inset-bottom,0px)}'
    + '#pf-vx .vx-t th,#pf-vx .vx-t td{max-width:240px}}'
    + '@media (prefers-reduced-motion: reduce){#pf-vx{animation:none}#pf-vx .vx-gira{animation-duration:2.4s}}'
    + '@media print{#pf-vx{display:none!important}}';
  var X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  // los colores de la página que la pidió (claro u oscuro), para que en la página de arriba se vea igual
  var VARS = ['--surface', '--surface-2', '--surface-3', '--ink', '--muted', '--line', '--line-strong', '--navy', '--navy-2', '--navy-ink',
    '--accent', '--accent-ink', '--red', '--red-soft', '--f-body'];
  function copiaVars(el) {
    try {
      var cs = getComputedStyle(document.documentElement);
      VARS.forEach(function (v) { var x = cs.getPropertyValue(v).trim(); if (x) el.style.setProperty(v, x); });
    } catch (e) { /* con los colores de la página de arriba */ }
  }
  function ponCss(D) {
    var st = D.getElementById('pf-vx-css');
    if (st && st.textContent === VX_CSS) return;
    if (!st) { st = D.createElement('style'); st.id = 'pf-vx-css'; (D.head || D.documentElement).appendChild(st); }
    st.textContent = VX_CSS;
  }
  function capaDe(op) {
    var D = null;
    try { D = op.capa ? op.capa() : null; } catch (e) { D = null; }
    try { if (D && D.body) return D; } catch (e) { /* otra página que no se deja: aquí */ }
    return document;
  }
  var VX = null;   // la vista previa abierta (en esta página o en la de arriba)
  function abierta() { return !!(VX && VX.isConnected); }
  /* ¿Cómo se está viendo? Para «Bajar» de la vista en grande (Héctor Daniel Nava, 24-nov-2026, 20:35: «ya estoy
     seleccionando que la quiero con branding entonces que me de bajar Word o bajar PDF»): verdadero con la marca, falso
     el original, null si el botón no es de esta vista o la vista no trae para escoger. */
  function marcaVista(btn) {
    if (!btn || !VX || !VX.isConnected || !VX.contains(btn) || !VX.querySelector('.vx-modo')) return null;
    return VX.classList.contains('vx-conmarca');
  }
  function cierra() { if (VX && VX.__cierra) VX.__cierra(true); }
  addEventListener('pagehide', cierra);
  // la marca PROFASE de los PDF sellados (js/marca.js: la marca de agua, el signo y el subtítulo); sin ella, sin selector
  function marcaLista() {
    var M = window.PROFASE_MARCA;
    return M && /^data:image\/png;base64,/.test(M.logo || '') && /^data:image\/png;base64,/.test(M.marcaAgua || '') ? M : null;
  }
  var MODO = '<div class="vx-modo" role="group" aria-label="Cómo verlo"><button type="button" data-modo="1" aria-pressed="true">Con marca PROFASE</button>'
    + '<button type="button" data-modo="0" aria-pressed="false">Original (sin marca)</button></div>';
  // la marca sobre lo que se ve del Excel (las imágenes se ponen por DOM: son las de js/marca.js, las mismas de los PDF)
  function ponSello(v) {
    var M = marcaLista(), area = v.querySelector('.vx-area');
    if (!M || !area) return;
    var D = v.ownerDocument, s = D.createElement('div'), a = D.createElement('img'), pie = D.createElement('div'), l = D.createElement('img');
    s.className = 'vx-sello'; s.setAttribute('aria-hidden', 'true');
    a.className = 'vx-agua'; a.alt = ''; a.src = M.marcaAgua;
    pie.className = 'vx-pie'; l.alt = ''; l.src = M.logo;
    var b = D.createElement('b'), i = D.createElement('i');
    b.textContent = 'PROFASE'; i.textContent = M.subtitulo || 'Asesoría Contable, Legal y Fiscal';
    pie.appendChild(l); pie.appendChild(b); pie.appendChild(i);
    s.appendChild(a); s.appendChild(pie); area.appendChild(s);
  }
  // ext: {marca: con el selector «Con marca PROFASE» / «Original (sin marca)», sello: la marca la pone esta página
  // (el Excel; en Word y PowerPoint la pone el marco aislado), ofi: Word o PowerPoint}
  function abre(op, cuerpo, hojas, ext) {
    cierra();
    ext = ext || {};
    // el foco regresa al «Ver» que la abrió (mientras se abría estaba deshabilitado y el foco se salió de él)
    var t = insignia(op), antes = op.boton || document.activeElement, ligas = [];
    var D = capaDe(op), W = D.defaultView || window;
    var otra = D.getElementById('pf-vx');   // la de otra pantalla (otro marco) en la misma página: una sola a la vez
    if (otra) { if (otra.__cierra) otra.__cierra(true); else otra.remove(); }
    ponCss(D);
    try { if (window.PROFASE_CFDI && window.PROFASE_CFDI.estilos) window.PROFASE_CFDI.estilos(D); } catch (e) { /* la ficha sin sus colores */ }
    var v = D.createElement('div'); v.className = 'vx'; v.id = 'pf-vx';
    v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true'); v.setAttribute('aria-label', op.nombre || ''); v.setAttribute('data-sin-jalar', '');
    try { (op.copiaVars || copiaVars)(v); } catch (e) { /* con los colores de esa página */ }
    var conModo = !!ext.marca && !!marcaLista();
    v.innerHTML = '<div class="vx-p"><div class="vx-cab"><span class="tipo ' + t[0] + '">' + esc(t[1]) + '</span><b title="' + esc(op.nombre) + '">' + esc(op.nombre) + '</b>'
      + (typeof op.alBajar === 'function' ? '<button type="button" class="vx-baja" data-vx-baja>Bajar</button>' : '')
      + '<button type="button" class="vx-x" data-cierra aria-label="Cerrar (Esc)" title="Cerrar (Esc)">' + X + '</button></div>'
      + (conModo ? '<div class="vx-modos">' + MODO + '</div>' : '')
      + (hojas && hojas.length > 1 ? '<div class="vx-tabs" role="tablist">' + hojas.map(function (h, i) { return '<button type="button" role="tab" data-hoja="' + i + '" aria-selected="' + (i === 0 ? 'true' : 'false') + '">' + esc(h.n) + '</button>'; }).join('') + '</div>' : '')
      + '<div class="vx-area"><div class="vx-cu' + (ext.ofi ? ' vx-cu-ofi' : '') + '" tabindex="0">' + cuerpo + '</div></div></div>';
    // con la marca al abrir (como los PDF); «Original (sin marca)» la quita solo de la vista
    v.__marca = conModo;
    v.__alModo = null;
    v.__limpia = [];
    if (conModo) v.classList.add('vx-conmarca');
    if (conModo && ext.sello) ponSello(v);
    D.body.appendChild(v);
    VX = v;
    if (hojas && hojas[0]) ponImagenes(v.querySelector('.vx-cu'), hojas[0], ligas);
    function cierraEsta(sinFoco) {
      if (VX === v) VX = null;
      (v.__limpia || []).forEach(function (f) { try { f(); } catch (e) { /* sigue */ } });
      v.__limpia = [];
      v.remove(); D.removeEventListener('keydown', tecla, true);
      if (D !== document) document.removeEventListener('keydown', tecla, true);
      ligas.forEach(function (u) { URL.revokeObjectURL(u); });
      try { if (typeof op.alCerrar === 'function') op.alCerrar(); } catch (e) { /* sigue */ }
      if (sinFoco) return;
      // el foco regresa al «Ver» del archivo (en el marco de la pantalla que la abrió)
      try { if (D !== document) window.focus(); if (antes && antes.isConnected && antes.focus) antes.focus({ preventScroll: true }); } catch (e) { /* sin foco */ }
    }
    v.__cierra = cierraEsta;
    // en la fase de captura, en la página de la vista previa y en esta (por si el foco se quedó en el marco de la
    // pantalla): Esc solo la cierra a ella (no también la conversación del chat ni lo que tenga abierto la pantalla)
    function tecla(ev) {
      if (!v.isConnected) return;
      if (D.querySelector('.pba-velo,.pm-menu') || (D !== document && document.querySelector('.pm-menu'))) return;   // algo encima: él atiende las teclas
      if (ev.key === 'Escape') { ev.preventDefault(); ev.stopImmediatePropagation(); cierraEsta(); return; }
      if (ev.key === 'Tab') {   // el foco se queda dentro de la vista previa
        var f = [].filter.call(v.querySelectorAll('button,[tabindex="0"],summary'), function (x) { return !x.disabled && x.getClientRects().length; });
        if (!f.length) return;
        var k = f.indexOf(D.activeElement);
        if (ev.shiftKey && k <= 0) { ev.preventDefault(); f[f.length - 1].focus(); }
        else if (!ev.shiftKey && (k < 0 || k === f.length - 1)) { ev.preventDefault(); f[0].focus(); }
      }
    }
    D.addEventListener('keydown', tecla, true);
    if (D !== document) document.addEventListener('keydown', tecla, true);
    v.addEventListener('click', function (ev) {
      var b = ev.target.closest('button');
      if (ev.target === v || (b && b.hasAttribute('data-cierra'))) { cierraEsta(); return; }
      if (!b) return;
      if (b.hasAttribute('data-vx-baja')) { op.alBajar(b); return; }
      if (b.hasAttribute('data-modo')) {
        var si = b.getAttribute('data-modo') === '1';
        if (si === v.__marca) return;
        v.__marca = si;
        v.querySelectorAll('[data-modo]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        v.classList.toggle('vx-conmarca', si);
        if (typeof v.__alModo === 'function') { try { v.__alModo(si); } catch (e) { /* el marco ya no está */ } }
        return;
      }
      if (b.hasAttribute('data-copia')) {
        // el portapapeles de la página donde está la vista previa (la que tiene el foco)
        try { (W.navigator.clipboard || navigator.clipboard).writeText(b.getAttribute('data-copia')); b.textContent = 'Copiado'; setTimeout(function () { b.textContent = 'Copiar'; }, 1400); } catch (e) { /* sin portapapeles */ }
        return;
      }
      if (b.hasAttribute('data-hoja')) {
        var i = +b.getAttribute('data-hoja');
        v.querySelectorAll('[data-hoja]').forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
        var cu = v.querySelector('.vx-cu'); cu.innerHTML = tablaHoja(hojas[i]); cu.scrollTop = 0; cu.scrollLeft = 0;
        ponImagenes(cu, hojas[i], ligas);
      }
    });
    if (D !== document) {
      // la rueda del mouse y el dedo no mueven la página de abajo (solo lo que se desliza adentro)
      v.addEventListener('wheel', function (ev) { if (!ev.ctrlKey && !ev.target.closest('.vx-cu,.vx-tabs')) ev.preventDefault(); }, { passive: false });
      try { if (window.PORTAL && window.PORTAL.deslizaDentro) window.PORTAL.deslizaDentro(v); } catch (e) { /* sin él */ }
    }
    try { v.querySelector('[data-cierra]').focus({ preventScroll: true }); } catch (e) { /* sin foco */ }
    return v;
  }
  /* ---------- Word y PowerPoint, en un marco aislado (24-nov-2026) ----------
     El archivo lo mandó alguien más: se dibuja dentro de un iframe con sandbox="allow-scripts" y sin «allow-same-origin»
     (un origen aparte, sin la sesión del portal, sin la base y sin poder tocar esta página), con una CSP que solo deja
     correr su código de arranque (con su nonce) y las librerías del portal (js/lib), y solo imágenes y letras de
     adentro (data: y blob:): nada de la red. Esta página le manda los bytes por mensaje y solo le hace caso a los
     mensajes que vienen de ese marco (ev.source); él solo contesta listo, hecho, falla o esc.
     El marco solo le hace caso a los mensajes que traen la señal de un solo uso que va en su arranque (T), no a
     «de dónde vienen»: el chat abre la vista en la página de arriba (op.capa), pero el mensaje lo manda el código del
     chat, y el navegador dice que viene del chat, no de la página donde está el marco (24-nov-2026: así fallaba la
     vista de un Word en el chat; «tardó más de 45 s»). */
  var LIB = (function () {
    try { var s = document.currentScript && document.currentScript.src; return s ? new URL('lib/', s).href : new URL('js/lib/', location.href).href; } catch (e) { return ''; }
  })();
  var OFI_LIBS = { word: ['jszip.min.js', 'docx-preview.min.js'], ppt: ['pptx-preview.min.js'], wordpdf: ['jszip.min.js', 'docx-preview.min.js'] };
  var OFI_TIEMPO = 45000;
  var OFI_CSS = 'html{-webkit-text-size-adjust:100%}html,body{margin:0;padding:0}'
    + 'body{background:#EEF2F7;color:#000;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;overscroll-behavior:contain}'
    + '.docx-wrapper{background:transparent!important;padding:16px 8px 4px!important}'
    + '.docx-wrapper>section.docx{box-shadow:0 2px 10px rgba(0,0,0,.22)!important;margin-bottom:16px!important}'
    + '.pptx-preview-wrapper{height:auto!important;overflow:visible!important;background:transparent!important;padding:12px 0 2px}'
    + '.pptx-preview-slide-wrapper{box-shadow:0 2px 10px rgba(0,0,0,.22)}'
    // la marca de cada hoja o lámina: la de los PDF sellados (js/marca.js, sellaPDF)
    + '.pf-sello{position:absolute;left:0;right:0;top:0;bottom:0;pointer-events:none;z-index:2147483000;overflow:hidden}'
    + '.pf-agua{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(60%,400px);height:auto;max-height:60%;object-fit:contain;opacity:.55}'
    + '.pf-pie{position:absolute;left:16px;bottom:6px;display:flex;align-items:center;gap:4px;font:9px/1 Helvetica,Arial,sans-serif;white-space:nowrap}'
    + '.pf-pie img{width:11px;height:12px;display:block}.pf-pie b{color:#1F3864;font-weight:700;font-size:8.7px}.pf-pie i{color:#878787;font-size:8px;margin-left:6px}'
    + 'body.sin-marca .pf-sello{display:none}'
    // al pasar a PDF (no se ve: es el marco escondido de la conversión): las hojas a la izquierda, sin sombra ni margen
    + 'body.pf-pdf{background:#fff}body.pf-pdf .docx-wrapper{align-items:flex-start!important;padding:0!important;background:#fff!important}'
    + 'body.pf-pdf .docx-wrapper>section.docx{box-shadow:none!important;margin:0 0 24px!important}';
  // lo que corre DENTRO del marco aislado (se manda como texto; no ve nada de esta página)
  function dentro(T) {
    var raiz = document.getElementById('pf-doc'), E = { logo: '', agua: '', sub: '', tipo: '' }, caja = null, natural = 0;
    function avisa(m, pasa) { try { parent.postMessage(m, '*', pasa || []); } catch (e) { /* sin página */ } }
    addEventListener('keydown', function (ev) { if (ev.key === 'Escape') { ev.preventDefault(); avisa({ pf: 'esc' }); } });
    // la marca de una hoja o lámina: marca de agua al centro y, abajo a la izquierda, el signo, «PROFASE» y el subtítulo
    // (sinPie: solo la marca de agua; el pie va en el margen de abajo de la hoja, nunca encima del texto)
    function sello(arriba, alto, sinPie) {
      var s = document.createElement('div'), a = new Image(), pie = document.createElement('div'), l = new Image();
      var b = document.createElement('b'), i = document.createElement('i');
      s.className = 'pf-sello'; s.setAttribute('aria-hidden', 'true');
      if (arriba != null) { s.style.top = arriba + 'px'; s.style.height = alto + 'px'; s.style.bottom = 'auto'; }
      a.className = 'pf-agua'; a.alt = ''; a.src = E.agua;
      s.appendChild(a);
      if (sinPie) return s;
      pie.className = 'pf-pie'; l.alt = ''; l.src = E.logo;
      b.textContent = 'PROFASE'; i.textContent = E.sub;
      pie.appendChild(l); pie.appendChild(b); pie.appendChild(i); s.appendChild(pie);
      return s;
    }
    /* Las hojas del Word, como en Word (Héctor Daniel Nava, 24-nov-2026, 19:39, con la captura de un Word del chat donde
       el pie de la marca caía encima del texto: «corrígelo»). docx-preview solo parte la hoja donde el documento trae su
       salto (o donde Word lo dejó guardado al guardar); un Word que no lo trae (hecho en otro programa, o guardado sin
       eso) sale como una sola hoja muy larga, y la marca se ponía a cada alto de página, a media hoja y encima del texto.
       Aquí esa hoja larga se reparte en hojas del alto de la página: un párrafo nunca se parte (pasa completo a la
       siguiente) y una tabla se parte por renglones (como Word); cada hoja lleva su encabezado y su pie del documento,
       su marca y el pie de la marca en su margen de abajo. Todo se mide antes de mover nada. Lo que no se puede repartir
       (texto a columnas o una tabla con celdas unidas a lo alto) se queda como venía. Si algo falla, se queda como venía. */
    function filasDe(t) {
      var r = [];
      Array.prototype.forEach.call(t.children, function (x) {
        if (x.tagName === 'TR') r.push(x);
        else if (x.tagName === 'TBODY' || x.tagName === 'THEAD' || x.tagName === 'TFOOT') Array.prototype.forEach.call(x.children, function (y) { if (y.tagName === 'TR') r.push(y); });
      });
      return r;
    }
    /* Sin hojas en blanco que el Word no trae (Héctor Daniel Nava, 26-nov-2026, 13:32, con el PDF de unas resoluciones
       que bajó del chat, con la tercera hoja en blanco: «corrígelo aquí y en el chat»). Word guarda dónde empezó cada hoja
       la última vez que se guardó (w:lastRenderedPageBreak) y docx-preview parte la hoja ahí. Después de un salto de
       página a mano (o de un párrafo con «salto de página anterior»), esa marca cae justo al principio de la hoja que ya
       había empezado y docx-preview deja entre las dos una hoja sin nada, que en Word no existe. Aquí, antes de repartir,
       se quita toda hoja que no trae nada que se vea (ni texto, ni imagen, ni tabla, ni línea, ni viñeta, ni fondo; el
       encabezado y el pie del documento no cuentan). Si todas salieran vacías, se queda la primera. Al «Ver» y en el PDF. */
    function seVe(el) {
      var cs = getComputedStyle(el);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return true;
      var bg = cs.backgroundColor || '', m = /rgba?\(([^)]+)\)/.exec(bg);
      if (m) {
        var c = m[1].split(',').map(function (v) { return parseFloat(v); });
        if ((c.length < 4 || c[3] > 0) && !(c[0] >= 250 && c[1] >= 250 && c[2] >= 250)) return true;
      }
      if (['Top', 'Right', 'Bottom', 'Left'].some(function (l) { return cs['border' + l + 'Style'] !== 'none' && parseFloat(cs['border' + l + 'Width']) > 0; })) return true;
      var an = getComputedStyle(el, '::before').content;
      return !!an && an !== 'none' && an !== 'normal' && an !== '""' && an !== "''";
    }
    function vaciaHoja(h) {
      var arts = Array.prototype.filter.call(h.children, function (x) { return x.tagName === 'ARTICLE'; });
      if (!arts.length) return false;
      return arts.every(function (a) {
        if (/\S/.test(a.textContent || '')) return false;
        if (a.querySelector('img,svg,canvas,object,embed,video,iframe,picture,table,hr,math')) return false;
        return !Array.prototype.some.call(a.querySelectorAll('*'), seVe);
      });
    }
    function sinHojasVacias() {
      var hs = Array.prototype.slice.call(raiz.querySelectorAll('section.docx')), vacias = hs.filter(vaciaHoja);
      if (vacias.length && vacias.length === hs.length) vacias.shift();
      vacias.forEach(function (h) { if (h.parentNode) h.parentNode.removeChild(h); });
    }
    function reparte(h) {
      var pag = parseFloat(getComputedStyle(h).minHeight) || 0;
      if (pag < 200 || h.offsetHeight <= pag * 1.2) return;
      var hijos = Array.prototype.slice.call(h.children), arts = hijos.filter(function (x) { return x.tagName === 'ARTICLE'; });
      if (!arts.length || arts.some(function (x) { var c = parseInt(x.style.columnCount || '1', 10); return c > 1; })) return;
      var cab = null, pie = null, otros = [];
      hijos.forEach(function (x) { if (x.tagName === 'HEADER') cab = x; else if (x.tagName === 'FOOTER') pie = x; else if (x.tagName !== 'ARTICLE') otros.push(x); });
      var R = h.getBoundingClientRect(), padB = parseFloat(getComputedStyle(h).paddingBottom) || 0;
      function y(el) { return el.getBoundingClientRect().top - R.top; }
      function fin(el) { return el.getBoundingClientRect().bottom - R.top; }
      var y0 = y(arts[0]), abajo = pag - padB;
      // si el pie del documento es más alto que su margen, también le quita lugar al texto
      if (pie) abajo -= Math.max(0, (R.height - padB) - y(pie));
      // y un respiro antes del pie del documento (docx-preview lo pone pegado al texto)
      var cabe = abajo - y0 - (pie && pie.textContent.trim() ? 12 : 0);
      if (cabe < 150) return;
      var hojas = [], cur = null;
      function nueva(top) { cur = { top: top, partes: [] }; hojas.push(cur); }
      nueva(y0);
      arts.forEach(function (art) {
        Array.prototype.forEach.call(art.children, function (b) {
          if (fin(b) - cur.top <= cabe) { cur.partes.push({ el: b, art: art }); return; }
          var filas = b.tagName === 'TABLE' ? filasDe(b) : [];
          var unidas = filas.length && Array.prototype.some.call(b.querySelectorAll('td,th'), function (c) { return c.rowSpan > 1; });
          if (filas.length > 1 && !unidas) {
            var desde = 0;
            for (var j = 0; j < filas.length; j++) {
              if (fin(filas[j]) - cur.top <= cabe) continue;
              // no cabe: lo de antes se queda en esta hoja y este renglón empieza la siguiente
              // (un renglón más alto que la hoja se queda solo en la suya)
              if (j > desde) cur.partes.push({ el: b, art: art, filas: filas, de: desde, a: j });
              if (j > desde || cur.partes.length) { desde = j; nueva(y(filas[j])); }
            }
            cur.partes.push({ el: b, art: art, filas: filas, de: desde, a: filas.length });
            return;
          }
          // un párrafo (o una imagen) no se parte: pasa completo a la siguiente hoja
          if (cur.partes.length) nueva(y(b) - (parseFloat(getComputedStyle(b).marginTop) || 0));
          cur.partes.push({ el: b, art: art });
        });
      });
      if (hojas.length < 2) return;
      var padre = h.parentNode, tras = h.nextSibling, puesta = [];
      hojas.forEach(function (hj, k) {
        var s = h, suyos = [];
        if (k) {
          s = h.cloneNode(false);
          if (cab) s.appendChild(cab.cloneNode(true));
        }
        function artDe(art) {
          for (var i = 0; i < suyos.length; i++) if (suyos[i][0] === art) return suyos[i][1];
          var n = art.cloneNode(false);
          s.appendChild(n); suyos.push([art, n]);
          return n;
        }
        hj.partes.forEach(function (p) {
          if (!p.filas || puesta.indexOf(p.el) < 0) {
            if (p.filas) puesta.push(p.el);
            if (k) artDe(p.art).appendChild(p.el);
            return;
          }
          // el resto de una tabla partida: otra tabla igual (sus columnas) con sus renglones
          var t = p.el.cloneNode(false), cajas = [];
          Array.prototype.forEach.call(p.el.children, function (x) { if (x.tagName === 'COLGROUP' || x.tagName === 'COL' || x.tagName === 'CAPTION' && false) t.appendChild(x.cloneNode(true)); });
          for (var i = p.de; i < p.a; i++) {
            var f = p.filas[i], dad = f.parentNode;
            if (dad === p.el) { t.appendChild(f); continue; }
            var c = null;
            for (var q = 0; q < cajas.length; q++) if (cajas[q][0] === dad) c = cajas[q][1];
            if (!c) { c = dad.cloneNode(false); t.appendChild(c); cajas.push([dad, c]); }
            c.appendChild(f);
          }
          artDe(p.art).appendChild(t);
        });
        if (!k) return;
        if (k === hojas.length - 1) otros.forEach(function (x) { s.appendChild(x); });
        if (pie) s.appendChild(pie.cloneNode(true));
        padre.insertBefore(s, tras);
      });
    }
    // las ligas del documento no llevan a ningún lado (solo las de adentro del mismo documento, «#…»)
    function sinLigas() {
      Array.prototype.forEach.call(raiz.querySelectorAll('a[href]'), function (x) {
        var h = x.getAttribute('href') || '';
        if (h.charAt(0) === '#') return;
        x.removeAttribute('href'); if (h) x.title = h;
      });
      Array.prototype.forEach.call(raiz.querySelectorAll('[target]'), function (x) { x.removeAttribute('target'); });
    }
    // a lo ancho de la pantalla: en el celular la hoja o la lámina se achica completa (nunca se sale a lo ancho)
    function ajusta() {
      if (!caja || !natural) return;
      var z = Math.min(1, Math.max(0.2, (document.documentElement.clientWidth - (E.tipo === 'ppt' ? 24 : 0)) / natural));
      caja.style.zoom = z === 1 ? '' : String(z);
    }
    addEventListener('resize', ajusta);
    /* Bajar un Word como PDF (Héctor Daniel Nava, 24-nov-2026, 20:06: «para los documentos en Word al picarle descargar,
       puede ser una opción para ver si lo quiero descargar en Word o en PDF y tú lo transformas a PDF según lo haya
       seleccionado con Branding u original»). Aquí, en un marco aislado igual al de «Ver» (que no se ve): el Word ya
       dibujado y repartido como en Word se copia completo a una imagen SVG (foreignObject, con sus estilos y sus imágenes
       de adentro: nada sale a la red ni se baja otra librería) y cada hoja se pinta de esa imagen en un lienzo, al doble
       de su tamaño, para que se lea bien. Va completo y no hoja por hoja porque los números de las listas siguen de una
       hoja a la otra. Su texto se mide renglón por renglón (para que el PDF se pueda buscar y copiar). A la página solo le
       salen las fotos de cada hoja y sus renglones; ella arma el PDF y, si se escogió con la marca, le pone la de siempre
       (sellaPDF). Una hoja que no se pudo repartir (más alta que la página) se parte en hojas por donde no hay renglón.
       (html2canvas no sirve aquí: copia la página en otro marco y, sin «allow-same-origin», no la puede leer.) */
    function textos(h) {
      var R = h.getBoundingClientRect(), out = [], rg = document.createRange(), cur = null, n;
      var w = document.createTreeWalker(h, NodeFilter.SHOW_TEXT, null);
      function suelta() { if (cur) { out.push(cur); cur = null; } }
      while ((n = w.nextNode())) {
        var s = n.nodeValue, el = n.parentElement;
        if (!s || !/\S/.test(s) || !el) continue;
        var cs = getComputedStyle(el);
        if (cs.visibility !== 'visible') continue;
        var fs = parseFloat(cs.fontSize) || 12, re = /\S+/g, m, mismo = false;
        while ((m = re.exec(s))) {
          rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
          var rs = rg.getClientRects();
          if (!rs.length || rs[0].width < 0.3 || rs[0].height < 0.3) continue;
          var r = rs[0], x = r.left - R.left, y = r.top - R.top, hueco = cur ? x - (cur.x + cur.w) : 0;
          if (cur && Math.abs(y - cur.y) < Math.max(2, Math.min(r.height, cur.h) * 0.35) && hueco > -1 && hueco < fs * 1.6 && Math.abs(fs - cur.f) < 0.6) {
            // en el mismo texto, entre palabras va su espacio; entre dos pedazos de texto, solo si hay hueco
            cur.t += (mismo || hueco > fs * 0.12 ? ' ' : '') + m[0];
            cur.w = r.right - R.left - cur.x; cur.h = Math.max(cur.h, r.height);
          } else { suelta(); cur = { t: m[0], x: x, y: y, w: r.width, h: r.height, f: fs }; }
          mismo = true;
        }
      }
      suelta();
      return out;
    }
    function trozos(alto, pag, frs) {
      if (!(pag > 50) || alto <= pag * 1.25) return [[0, alto]];   // casi del alto de la página: en una sola, un poco más chica
      var out = [], a = 0;
      while (alto - a > pag + 1) {
        var y = a + pag, lim = a + pag * 0.6, otra = true;
        // el corte no parte un renglón: sube hasta el primer hueco
        while (otra && y > lim) {
          otra = false;
          for (var i = 0; i < frs.length; i++) { var f = frs[i]; if (f.y < y - 0.5 && f.y + f.h > y + 0.5) { y = f.y - 1; otra = true; } }
        }
        if (y <= lim) y = a + pag;
        out.push([a, y]); a = y;
      }
      out.push([a, alto]);
      return out;
    }
    function aJpg(cv) {
      return new Promise(function (ok, ko) {
        cv.toBlob(function (b) {
          if (!b) { ko(new Error('no salió la foto de la hoja')); return; }
          b.arrayBuffer().then(ok, ko);
        }, 'image/jpeg', 0.92);
      });
    }
    function espera(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
    // todo el Word, como una imagen SVG del mismo ancho que aquí (sus estilos van dentro, en raiz)
    function imagenDe(caja, W, H) {
      var c = raiz.cloneNode(true);
      Array.prototype.forEach.call(c.querySelectorAll('.pf-sello,script'), function (x) { x.remove(); });
      var css = 'html,body{margin:0;padding:0}.pf-svg{margin:0;padding:0;width:' + W + 'px;background:#fff;color:#000;'
        + 'font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}'
        + '.pf-svg .docx-wrapper{align-items:flex-start!important;padding:0!important;margin:0!important;background:#fff!important}'
        + '.pf-svg .docx-wrapper>section.docx{box-shadow:none!important;margin:0 0 24px!important}';
      var div = document.createElement('div');
      div.className = 'pf-svg';
      div.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
      var st = document.createElement('style'); st.textContent = css;
      div.appendChild(st);
      while (c.firstChild) div.appendChild(c.firstChild);
      var x = new XMLSerializer().serializeToString(div);
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">'
        + '<foreignObject x="0" y="0" width="' + W + '" height="' + H + '">' + x + '</foreignObject></svg>';
      return new Promise(function (ok, ko) {
        var im = new Image();
        im.onload = function () {
          var d = im.decode ? im.decode().catch(function () { /* ya está */ }) : Promise.resolve();
          d.then(function () { ok(im); });
        };
        im.onerror = function () { ko(new Error('no se pudo copiar el documento a imagen')); };
        im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      });
    }
    async function aPdf(m) {
      var caja = raiz.querySelector('.docx-wrapper') || raiz;
      var hojas = Array.prototype.slice.call(raiz.querySelectorAll('section.docx')), ancho = 0, esc = +m.escala || 2;
      hojas.forEach(function (h) { ancho = Math.max(ancho, h.offsetWidth); });
      if (!hojas.length || !ancho) throw new Error('no trae hojas');
      // del mismo ancho que la imagen: así las hojas quedan en el mismo lugar aquí y allá
      var W = Math.ceil(ancho);
      document.body.style.width = W + 'px';
      void document.body.offsetHeight;
      var C = caja.getBoundingClientRect(), H = Math.ceil(caja.scrollHeight || C.height) + 2;
      var im = await imagenDe(caja, W, H);
      // Safari a veces pinta la primera vez sin las imágenes de adentro: una pasada completa en chiquito que no se usa,
      // y un respiro antes de pintar las hojas
      var cv = document.createElement('canvas'), cx = cv.getContext('2d');
      cv.width = 64; cv.height = Math.max(1, Math.min(4096, Math.round(64 * H / W)));
      try { cx.drawImage(im, 0, 0, cv.width, cv.height); } catch (e) { /* nada */ }
      await espera(150);
      for (var i = 0; i < hojas.length; i++) {
        var h = hojas[i], R = h.getBoundingClientRect(), sx = R.left - C.left, sy = R.top - C.top;
        var alto = h.offsetHeight, w = h.offsetWidth, pag = parseFloat(getComputedStyle(h).minHeight) || alto, frs = textos(h);
        var cortes = trozos(alto, pag, frs);
        for (var k = 0; k < cortes.length; k++) {
          var a = cortes[k][0], b = cortes[k][1], hh = Math.max(1, b - a);
          avisa({ pf: 'avance', i: i + 1, n: hojas.length });
          cv.width = Math.ceil(w * esc); cv.height = Math.ceil(hh * esc);
          cx.fillStyle = '#ffffff'; cx.fillRect(0, 0, cv.width, cv.height);
          cx.drawImage(im, sx, sy + a, w, hh, 0, 0, w * esc, hh * esc);
          var img = await aJpg(cv);
          var suyos = frs.filter(function (f) { var c = f.y + f.h / 2; return c >= a && c < b; }).map(function (f) {
            return { t: f.t, x: f.x, y: f.y - a, w: f.w, h: f.h, f: f.f };
          });
          avisa({ pf: 'hoja', w: w, pag: pag, alto: hh, img: img, textos: suyos }, [img]);
          await espera(0);
        }
      }
      cv.width = 0; cv.height = 0;
      return hojas.length;
    }
    /* Los cuadros de texto flotantes de Word, en su lugar (Héctor Daniel Nava, 26-nov-2026, 11:52 y 12:05, con la captura
       de unas resoluciones en el chat: las dos firmas, cada una en su cuadro de texto, salían encimadas al «Ver» y, al
       bajarlo en PDF, «la firma aparece hasta abajo»; «corríjelo también en el CRM! para que no vuelva a pasar nunca con
       ningún documento»). docx-preview no sabe dibujar los cuadros de texto de hoy («wps»): usa el respaldo viejo (VML),
       que los pone sueltos encima de la hoja (position:absolute, contados desde la orilla de la hoja y no del margen), y
       el que no trae respaldo se pierde completo. Aquí, antes de dibujar, se pasan al hilo del documento: los de un mismo
       párrafo van lado a lado, en su orden y con su ancho, en una tabla sin bordes justo después de su párrafo (uno a la
       derecha o al centro queda a la derecha o al centro); los que van uno encima del otro, en renglones aparte. Así
       nunca se enciman, no se salen de la hoja, no se pierden y, al repartir las hojas, se van con su párrafo. Solo
       cambia la copia que se dibuja (el Word que se baja es el mismo); un cuadro con imágenes adentro, uno dentro de otro
       y los de los encabezados y pies se quedan como venían. Si algo falla, el Word se dibuja como venía. */
    var CJ_EMU = 635;   // EMU por veintavo de punto
    function cjHijos(el, n) { return Array.prototype.filter.call(el ? el.childNodes : [], function (x) { return x.nodeType === 1 && x.localName === n; }); }
    function cjSube(el, n) { for (var x = el.parentNode; x && x.nodeType === 1; x = x.parentNode) if (x.localName === n) return x; return null; }
    function cjHay(el, n) { return el.getElementsByTagNameNS('*', n).length > 0; }
    // una medida de VML ('207.4pt', '2in', '3cm', '120px' o sin unidad, que es px) en veintavos de punto
    function cjTw(v) {
      var m = /^\s*(-?[\d.]+)\s*(pt|in|cm|mm|px|pc)?\s*$/i.exec(v || '');
      if (!m) return NaN;
      return parseFloat(m[1]) * ({ pt: 20, 'in': 1440, cm: 566.93, mm: 56.693, px: 15, pc: 240 })[(m[2] || 'px').toLowerCase()];
    }
    function cjEstilo(s) {
      var o = {};
      String(s || '').split(';').forEach(function (p) { var i = p.indexOf(':'); if (i > 0) o[p.slice(0, i).trim().toLowerCase()] = p.slice(i + 1).trim(); });
      return o;
    }
    function cjColor(v) { var m = /^#?([0-9a-f]{6})$/i.exec(String(v || '').trim()); return m ? m[1].toUpperCase() : ''; }
    // dónde y de qué tamaño, de un cuadro de hoy (wp:anchor o wp:inline con wps; también dentro de un grupo wpg)
    function cjGeoDml(tc) {
      var an = cjSube(tc, 'anchor') || cjSube(tc, 'inline'), wsp = cjSube(tc, 'wsp');
      var g = { flota: !!an && an.localName === 'anchor', x: NaN, y: 0, w: NaN, h: NaN, alin: '', rel: 'margin', gx: 0, gy: 0, ow: NaN,
                ins: [144, 72, 144, 72], borde: null, fondo: '' };
      var ext = an && cjHijos(an, 'extent')[0];
      if (ext) { g.w = g.ow = +ext.getAttribute('cx') / CJ_EMU; g.h = +ext.getAttribute('cy') / CJ_EMU; }
      var ph = an && cjHijos(an, 'positionH')[0], pv = an && cjHijos(an, 'positionV')[0];
      if (ph) {
        g.rel = ph.getAttribute('relativeFrom') || 'margin';
        var al = cjHijos(ph, 'align')[0], of = cjHijos(ph, 'posOffset')[0];
        if (al) g.alin = al.textContent.trim(); else if (of) g.x = +of.textContent / CJ_EMU;
      }
      if (pv) { var ov = cjHijos(pv, 'posOffset')[0]; if (ov) g.y = +ov.textContent / CJ_EMU; }
      var sp = wsp && cjHijos(wsp, 'spPr')[0];
      // dentro de un grupo: su lugar y su tamaño, en las medidas del grupo
      var grp = wsp && cjSube(wsp, 'wgp'), xs = sp && cjHijos(sp, 'xfrm')[0];
      if (grp && xs) {
        var gp = cjHijos(grp, 'grpSpPr')[0], xg = gp && cjHijos(gp, 'xfrm')[0];
        var num = function (el, n, a) { var e = el && cjHijos(el, n)[0]; return e ? +e.getAttribute(a) : NaN; };
        var sx = num(xg, 'ext', 'cx') / num(xg, 'chExt', 'cx'), sy = num(xg, 'ext', 'cy') / num(xg, 'chExt', 'cy');
        if (isFinite(sx) && isFinite(sy)) {
          g.gx = (num(xs, 'off', 'x') - num(xg, 'chOff', 'x')) * sx / CJ_EMU;
          g.gy = (num(xs, 'off', 'y') - num(xg, 'chOff', 'y')) * sy / CJ_EMU;
          g.w = num(xs, 'ext', 'cx') * sx / CJ_EMU; g.h = num(xs, 'ext', 'cy') * sy / CJ_EMU;
          if (!isFinite(g.gx)) g.gx = 0;
          if (!isFinite(g.gy)) g.gy = 0;
        }
      }
      var bp = wsp && cjHijos(wsp, 'bodyPr')[0];
      if (bp) ['lIns', 'tIns', 'rIns', 'bIns'].forEach(function (k, i) { var v = bp.getAttribute(k); if (v != null && isFinite(+v)) g.ins[[0, 1, 2, 3][i]] = Math.max(0, +v / CJ_EMU); });
      if (sp) {
        var ln = cjHijos(sp, 'ln')[0];
        if (ln && !cjHijos(ln, 'noFill').length && cjHijos(ln, 'solidFill').length) {
          var c = cjHijos(ln, 'solidFill')[0].getElementsByTagNameNS('*', 'srgbClr')[0];
          g.borde = { color: (c && cjColor(c.getAttribute('val'))) || '000000', sz: Math.max(2, Math.round((+ln.getAttribute('w') || 9525) / 12700 * 8)) };
        }
        var sf = cjHijos(sp, 'solidFill')[0], sc = sf && cjHijos(sf, 'srgbClr')[0];
        if (sc) g.fondo = cjColor(sc.getAttribute('val'));
      }
      return g;
    }
    // lo mismo, de un cuadro de antes (VML: v:shape o v:rect con su v:textbox; también dentro de un v:group)
    function cjGeoVml(tc) {
      var tb = cjSube(tc, 'textbox'), sh = tb && tb.parentNode;
      var s = cjEstilo(sh && sh.getAttribute && sh.getAttribute('style'));
      var g = { flota: false, x: NaN, y: 0, w: NaN, h: NaN, alin: '', rel: 'text', gx: 0, gy: 0, ow: NaN, ins: [144, 72, 144, 72], borde: null, fondo: '' };
      var grp = sh && cjSube(sh, 'group'), fuera = s;
      if (grp) {
        // dentro de un grupo, las medidas van en las unidades del grupo (coordsize): se pasan a las del grupo en la hoja
        var gs = cjEstilo(grp.getAttribute('style')), cs = String(grp.getAttribute('coordsize') || '21600,21600').split(','),
            co = String(grp.getAttribute('coordorigin') || '0,0').split(',');
        var ex = cjTw(gs.width) / (+cs[0] || 21600), ey = cjTw(gs.height) / (+cs[1] || +cs[0] || 21600);
        if (isFinite(ex) && isFinite(ey)) {
          g.gx = ((parseFloat(s.left) || 0) - (+co[0] || 0)) * ex; g.gy = ((parseFloat(s.top) || 0) - (+co[1] || 0)) * ey;
          g.w = (parseFloat(s.width) || 0) * ex; g.h = (parseFloat(s.height) || 0) * ey;
        }
        fuera = gs;
        g.ow = cjTw(gs.width);
      } else { g.w = g.ow = cjTw(s.width); g.h = cjTw(s.height); }
      g.flota = fuera.position === 'absolute';
      g.alin = fuera['mso-position-horizontal'] || '';
      if (g.alin === 'absolute') g.alin = '';
      g.rel = fuera['mso-position-horizontal-relative'] || 'text';
      g.x = (cjTw(fuera['margin-left']) || 0) + (cjTw(fuera.left) || 0);
      g.y = (cjTw(fuera['margin-top']) || 0) + (cjTw(fuera.top) || 0);
      var ins = String((tb && tb.getAttribute('inset')) || '').split(',');
      ins.forEach(function (v, i) { var t = cjTw(v.trim() || 'x'); if (i < 4 && isFinite(t)) g.ins[i] = Math.max(0, t); });
      var st = sh && cjHijos(sh, 'stroke')[0], sin = /^(f|false)$/i;
      if (sh && !sin.test(sh.getAttribute('stroked') || '') && !(st && sin.test(st.getAttribute('on') || '')))
        g.borde = { color: cjColor(sh.getAttribute('strokecolor')) || '000000', sz: Math.max(2, Math.round((cjTw(sh.getAttribute('strokeweight') || '.75pt') || 15) / 20 * 8)) };
      if (sh && !sin.test(sh.getAttribute('filled') || '')) g.fondo = cjColor(sh.getAttribute('fillcolor'));
      return g;
    }
    async function sinCajas(buf) {
      if (typeof JSZip === 'undefined' || typeof DOMParser === 'undefined' || typeof XMLSerializer === 'undefined') return buf;
      var zip = await JSZip.loadAsync(buf), ruta = 'word/document.xml', rel = zip.file('_rels/.rels');
      if (rel) {
        var rx = await rel.async('string'), mr = /<Relationship\b[^>]*>/g, x;
        while ((x = mr.exec(rx))) if (/Type="[^"]*\/officeDocument"/.test(x[0])) { var tg = /Target="\/?([^"]+)"/.exec(x[0]); if (tg) ruta = tg[1]; }
      }
      var fz = zip.file(ruta);
      if (!fz) return buf;
      var txt = await fz.async('string');
      if (txt.indexOf('txbxContent') < 0) return buf;
      var doc = new DOMParser().parseFromString(txt, 'application/xml');
      if (doc.getElementsByTagName('parsererror').length) return buf;
      var R = doc.documentElement, W = R.namespaceURI, pre = R.prefix ? R.prefix + ':' : '';
      function nw(n, at, hijos) {
        var e = doc.createElementNS(W, pre + n);
        Object.keys(at || {}).forEach(function (k) { e.setAttributeNS(W, pre + k, String(at[k])); });
        (hijos || []).forEach(function (h) { e.appendChild(h); });
        return e;
      }
      function wv(el, n) { if (!el) return NaN; var v = el.getAttributeNS(W, n); if (v == null || v === '') v = el.getAttribute(pre + n); return v == null || v === '' ? NaN : +v; }
      var body = cjHijos(R, 'body')[0];
      if (!body) return buf;
      var sp = cjHijos(body, 'sectPr')[0], pz = cjHijos(sp, 'pgSz')[0], pm = cjHijos(sp, 'pgMar')[0];
      var pgW = wv(pz, 'w'), mL = wv(pm, 'left'), mR = wv(pm, 'right');
      if (!(pgW > 0)) pgW = 12240;
      if (!(mL >= 0)) mL = 1440;
      if (!(mR >= 0)) mR = 1440;
      var TW = Math.max(1440, pgW - mL - mR);
      // cada cuadro: el hijo del renglón (w:r) que lo lleva (mc:AlternateContent, w:drawing o w:pict) y su párrafo
      var cajas = [];
      Array.prototype.slice.call(doc.getElementsByTagNameNS('*', 'txbxContent')).forEach(function (tc) {
        if (cjSube(tc, 'txbxContent')) return;   // uno dentro de otro se va con el de afuera
        var el = tc, run = null;
        while (el.parentNode && el.parentNode.nodeType === 1) {
          if (el.parentNode.localName === 'r' && el.parentNode.namespaceURI === W) { run = el.parentNode; break; }
          el = el.parentNode;
        }
        if (!run) return;
        var p = cjSube(run, 'p');
        if (!p || p.namespaceURI !== W) return;
        var c = null;
        for (var i = 0; i < cajas.length; i++) if (cajas[i].el === el) c = cajas[i];
        if (!c) { c = { el: el, p: p, eleccion: [], respaldo: [], solo: [] }; cajas.push(c); }
        if (cjSube(tc, 'Choice')) c.eleccion.push(tc); else if (cjSube(tc, 'Fallback')) c.respaldo.push(tc); else c.solo.push(tc);
      });
      var hechos = 0, porP = [];
      cajas.forEach(function (c) {
        // con imágenes adentro (un grupo con fotos, por ejemplo), se queda como venía
        if (cjHay(c.el, 'blip') || cjHay(c.el, 'imagedata')) return;
        var dml = c.eleccion.length ? c.eleccion : (c.el.localName === 'drawing' ? c.solo : []);
        var vml = c.eleccion.length ? [] : (c.respaldo.length ? c.respaldo : (c.el.localName === 'pict' ? c.solo : []));
        var usa = dml.length ? dml : vml;
        if (!usa.length) return;
        var geos = usa.map(function (tc) { var g = dml.length ? cjGeoDml(tc) : cjGeoVml(tc); g.tc = tc; return g; });
        // uno en el renglón (no flotante) se queda donde va, salvo que docx-preview lo fuera a perder (wps sin respaldo VML)
        var flota = geos.some(function (g) { return g.flota; });
        if (!flota && !(dml.length && !c.respaldo.length)) return;
        var grupo = null;
        for (var i = 0; i < porP.length; i++) if (porP[i].p === c.p) grupo = porP[i];
        if (!grupo) { grupo = { p: c.p, cajas: [], quita: [] }; porP.push(grupo); }
        geos.forEach(function (g) { grupo.cajas.push(g); });
        grupo.quita.push(c.el);
      });
      porP.forEach(function (gr) {
        // el ancho donde caben: el del texto de la hoja o, en una tabla, el de su celda
        var area = TW, celda = cjSube(gr.p, 'tc');
        if (celda) {
          var tcw = cjHijos(cjHijos(celda, 'tcPr')[0], 'tcW')[0], tw = wv(tcw, 'w');
          var tipo = tcw ? (tcw.getAttributeNS(W, 'type') || tcw.getAttribute(pre + 'type') || 'dxa') : '';
          area = tipo === 'dxa' && tw > 400 ? tw - 216 : Math.min(TW, 4320);
        }
        gr.cajas.forEach(function (g) {
          var ow = isFinite(g.ow) && g.ow > 0 ? g.ow : g.w, rel = String(g.rel || '').toLowerCase().replace(/[^a-z]/g, '');
          var ancho = area, desde = 0, al = String(g.alin || '').toLowerCase(), base;
          if (!celda) {
            if (rel === 'page') { ancho = pgW; desde = -mL; }
            else if (/^(leftmargin|leftmarginarea|insidemargin|innermarginarea)$/.test(rel)) { ancho = mL; desde = -mL; }
            else if (/^(rightmargin|rightmarginarea|outsidemargin|outermarginarea)$/.test(rel)) { ancho = mR; desde = area; }
          }
          if (!(ow > 0)) ow = Math.min(area, 4320);
          if (al === 'left' || al === 'inside') base = desde;
          else if (al === 'right' || al === 'outside') base = desde + ancho - ow;
          else if (al === 'center') base = desde + (ancho - ow) / 2;
          else base = desde + (isFinite(g.x) ? g.x : 0);
          g.ancho = Math.max(720, Math.min(area, g.w > 0 ? g.w : ow));
          g.izq = Math.max(0, Math.min(area - g.ancho, base + (g.gx || 0)));
          g.arriba = (isFinite(g.y) ? g.y : 0) + (g.gy || 0);
          g.alto = g.h > 0 ? g.h : 720;
        });
        // renglones: los que se tocan a lo alto van en el mismo, de izquierda a derecha; los demás, abajo
        var filas = [];
        gr.cajas.slice().sort(function (a, b) { return a.arriba - b.arriba; }).forEach(function (g) {
          var f = filas[filas.length - 1];
          if (f && g.arriba < f.fin - 60) { f.cajas.push(g); f.fin = Math.max(f.fin, g.arriba + g.alto); }
          else filas.push({ cajas: [g], fin: g.arriba + g.alto });
        });
        var tras = gr.p;
        filas.forEach(function (f) {
          var cs = f.cajas.sort(function (a, b) { return a.izq - b.izq; }), piezas = [], x = 0;
          cs.forEach(function (g) {
            var hueco = g.izq - x;
            if (hueco >= 60) piezas.push({ w: hueco });
            piezas.push({ w: g.ancho, g: g });
            x = Math.max(x, g.izq) + g.ancho;
          });
          var total = piezas.reduce(function (s, q) { return s + q.w; }, 0), k = total > area ? area / total : 1;
          piezas.forEach(function (q) { q.w = Math.max(240, Math.floor(q.w * k)); });
          var sinB = ['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map(function (b) { return nw(b, { val: 'nil' }); });
          var tbl = nw('tbl', {}, [
            nw('tblPr', {}, [nw('tblW', { w: piezas.reduce(function (s, q) { return s + q.w; }, 0), type: 'dxa' }), nw('tblBorders', {}, sinB),
              nw('tblLayout', { type: 'fixed' }),
              nw('tblCellMar', {}, ['top', 'left', 'bottom', 'right'].map(function (b) { return nw(b, { w: 0, type: 'dxa' }); }))]),
            nw('tblGrid', {}, piezas.map(function (q) { return nw('gridCol', { w: q.w }); }))]);
          var tr = nw('tr', {}, [nw('trPr', {}, [nw('cantSplit')])]);
          piezas.forEach(function (q) {
            var pr = nw('tcPr', {}, [nw('tcW', { w: q.w, type: 'dxa' })]), tc = nw('tc', {}, [pr]);
            if (!q.g) {
              // el hueco entre dos cuadros: una celda vacía que no agrega alto
              tc.appendChild(nw('p', {}, [nw('pPr', {}, [nw('spacing', { before: 0, after: 0, line: 20, lineRule: 'exact' })])]));
            } else {
              var g = q.g;
              if (g.borde) pr.appendChild(nw('tcBorders', {}, ['top', 'left', 'bottom', 'right'].map(function (b) { return nw(b, { val: 'single', sz: g.borde.sz, space: 0, color: g.borde.color }); })));
              if (g.fondo && g.fondo !== 'FFFFFF') pr.appendChild(nw('shd', { val: 'clear', color: 'auto', fill: g.fondo }));
              pr.appendChild(nw('tcMar', {}, [nw('top', { w: Math.round(g.ins[1]), type: 'dxa' }), nw('left', { w: Math.round(g.ins[0]), type: 'dxa' }),
                nw('bottom', { w: Math.round(g.ins[3]), type: 'dxa' }), nw('right', { w: Math.round(g.ins[2]), type: 'dxa' })]));
              var hijos = Array.prototype.slice.call(g.tc.childNodes);
              hijos.forEach(function (h) { tc.appendChild(h); });
              var ult = null;
              for (var j = tc.childNodes.length - 1; j >= 0; j--) if (tc.childNodes[j].nodeType === 1) { ult = tc.childNodes[j]; break; }
              if (!ult || ult.localName !== 'p') tc.appendChild(nw('p'));
            }
            tr.appendChild(tc);
          });
          tbl.appendChild(tr);
          tras.parentNode.insertBefore(tbl, tras.nextSibling);
          tras = tbl;
          hechos++;
        });
        // en una celda de tabla, lo último tiene que ser un párrafo
        var sig = tras.nextSibling;
        while (sig && sig.nodeType !== 1) sig = sig.nextSibling;
        if (celda && !sig) tras.parentNode.appendChild(nw('p'));
        gr.quita.forEach(function (el) { if (el.parentNode) el.parentNode.removeChild(el); });
      });
      if (!hechos) return buf;
      zip.file(ruta, new XMLSerializer().serializeToString(doc));
      return await zip.generateAsync({ type: 'arraybuffer', compression: 'DEFLATE' });
    }
    async function abre(m) {
      E.logo = m.logo || ''; E.agua = m.pdf ? '' : (m.agua || ''); E.sub = m.sub || ''; E.tipo = m.tipo;
      document.body.classList.toggle('sin-marca', !m.marca);
      document.body.classList.toggle('pf-pdf', !!m.pdf);
      if (m.fondo) document.body.style.background = m.fondo;
      var n = 0;
      if (m.tipo === 'word') {
        var bytes = m.b;
        try { bytes = await sinCajas(m.b); } catch (e) { bytes = m.b; }
        await docx.renderAsync(bytes, raiz, null, { className: 'docx', inWrapper: true, breakPages: true, ignoreLastRenderedPageBreak: false,
          useBase64URL: true, renderHeaders: true, renderFooters: true, renderFootnotes: true, renderEndnotes: true,
          renderComments: false, renderChanges: false, experimental: false, debug: false });
        caja = raiz.querySelector('.docx-wrapper') || raiz;
        // las letras del documento llegan después de dibujarlo: se espera a que estén (hasta 3 s) antes de medir las hojas
        void raiz.offsetHeight;
        try { if (document.fonts && document.fonts.ready) await Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 3000); })]); } catch (e) { /* sin letras */ }
        try { sinHojasVacias(); } catch (e) { /* se quedan como venían */ }
        Array.prototype.forEach.call(raiz.querySelectorAll('section.docx'), function (h) {
          try { reparte(h); } catch (e) { /* se queda como venía */ }
        });
        var hojas = raiz.querySelectorAll('section.docx');
        n = hojas.length;
        Array.prototype.forEach.call(hojas, function (h) {
          natural = Math.max(natural, h.offsetWidth + 16);
          if (!E.agua) return;
          var alto = h.offsetHeight, pag = parseFloat(getComputedStyle(h).minHeight) || alto, k = pag > 50 ? Math.max(1, Math.round(alto / pag)) : 1;
          if (k === 1) { h.appendChild(sello(null)); return; }
          // una hoja que no se pudo repartir: la marca de agua a cada alto de página y el pie de la marca solo abajo, en
          // su margen (nunca a media hoja, encima del texto)
          for (var i = 0; i < k; i++) h.appendChild(sello(i * pag, i === k - 1 ? alto - i * pag : pag, i < k - 1));
        });
      } else {
        var ancho = Math.min(1100, Math.max(280, document.documentElement.clientWidth - 24));
        var p = pptxPreview.init(raiz, { width: ancho, height: Math.max(200, innerHeight), mode: 'list' });
        await p.preview(m.b);
        caja = raiz.querySelector('.pptx-preview-wrapper') || raiz;
        natural = ancho;
        var lam = raiz.querySelectorAll('.pptx-preview-slide-wrapper');
        n = lam.length;
        if (E.agua) Array.prototype.forEach.call(lam, function (x) { x.appendChild(sello(null)); });
      }
      sinLigas();
      if (!m.pdf) ajusta();
      if (!n) throw new Error('no trae hojas');
      return n;
    }
    /* Ya se ve (24-nov-2026, 20:10, Héctor Daniel Nava: «cuando abro el chat y veo un Word, no hace scroll down. Tengo que
       irme a original y luego regresar al de branding y luego ya baja»): en el iPhone y el iPad el marco ya estaba
       dibujado cuando la página lo enseñó, y su deslizar no se ponía al día hasta que algo cambiaba adentro (como «Original»
       y de regreso). Al enseñarse, aquí se mueve el alto un pixel, dos cuadros seguidos, y se regresa: el mismo cambio
       que hacía ese ir y venir, sin que se note; y otra vez un momento después, por si el teléfono lo enseñó más tarde. */
    function alVerse() {
      var b = document.body, r = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
      function mueve() {
        r(function () {
          b.style.paddingBottom = '1px'; void b.offsetHeight;
          r(function () { b.style.paddingBottom = ''; void b.offsetHeight; });
        });
      }
      mueve(); setTimeout(mueve, 400);
    }
    addEventListener('message', function (ev) {
      // JSZip y las librerías se mandan mensajes a sí mismas: esos no son de la página; y de la página, solo lo que trae
      // la señal de este marco (el que manda puede ser el chat, no la página donde está el marco: ver arriba)
      if (ev.source === window) return;
      var m = ev.data || {};
      if (!m || typeof m !== 'object' || m.t !== T) return;
      if (m.pf === 'abre') {
        abre(m).then(function (n) {
          if (!m.pdf) { avisa({ pf: 'hecho', n: n }); return; }
          return aPdf(m).then(function (k) { avisa({ pf: 'pdf', n: k }); });
        }).catch(function (e) { avisa({ pf: 'falla', m: String((e && e.message) || e || '').slice(0, 200) }); });
      } else if (m.pf === 'marca') document.body.classList.toggle('sin-marca', !m.si);
      else if (m.pf === 'visible') alVerse();
    });
    avisa({ pf: 'listo' });
  }
  function azar() {
    var a = new Uint8Array(16);
    (window.crypto || window.msCrypto).getRandomValues(a);
    return Array.prototype.map.call(a, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
  }
  function marcoDe(q, T) {
    var N = azar();
    var csp = "default-src 'none'; script-src 'nonce-" + N + "' " + LIB + "; style-src 'unsafe-inline'; img-src data: blob:; font-src data: blob:; media-src data: blob:; base-uri 'none'; form-action 'none'";
    return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="' + esc(csp) + '">'
      + '<meta name="viewport" content="width=device-width,initial-scale=1"><style>' + OFI_CSS + '</style></head><body><div id="pf-doc"></div>'
      + OFI_LIBS[q].map(function (x) { return '<script src="' + esc(LIB + x) + '"></' + 'script>'; }).join('')
      + '<script nonce="' + N + '">(' + dentro.toString() + ')(' + JSON.stringify(T) + ');</' + 'script></body></html>';
  }
  // ¿es un Word o PowerPoint de los nuevos (un ZIP por dentro)? Los viejos y los que traen contraseña no se ven aquí
  function revisaOfi(b, q) {
    var app = q === 'word' ? 'Word' : 'PowerPoint';
    if (b[0] === 0xD0 && b[1] === 0xCF && b[2] === 0x11 && b[3] === 0xE0) throw new Error('Este ' + app + ' trae contraseña o viene en el formato viejo de Office; aquí no se puede ver. Qué hacer: bájalo con «Bajar» y ábrelo en ' + app + '.');
    if (!(b[0] === 0x50 && b[1] === 0x4B)) throw new Error('El archivo no es un ' + app + ' que se pueda ver aquí. Qué hacer: bájalo con «Bajar» y ábrelo en tu equipo.');
  }
  function oficina(v, b, q, op) {
    return new Promise(function (ok) {
      var cu = v.querySelector('.vx-cu'), D = v.ownerDocument, W = D.defaultView || window, M = marcaLista();
      var fr = D.createElement('iframe'), fin = false, reloj = 0, fondo = '', T = azar();
      fr.className = 'vx-ofi';
      fr.title = (q === 'word' ? 'Documento de Word: ' : 'Presentación de PowerPoint: ') + (op.nombre || '');
      fr.setAttribute('sandbox', 'allow-scripts');
      fr.setAttribute('referrerpolicy', 'no-referrer');
      try { fondo = W.getComputedStyle(cu).backgroundColor || ''; } catch (e) { fondo = ''; }
      function termina(bien, porque) {
        if (fin) return;
        fin = true; clearTimeout(reloj);
        if (bien) {
          fr.classList.add('listo'); var c = cu.querySelector('.vx-carga'); if (c) c.remove();
          try { fr.contentWindow.postMessage({ pf: 'visible', t: T }, '*'); } catch (e) { /* ya se cerró */ }
        }
        else if (v.isConnected) {
          try { if (porque && window.PORTAL && PORTAL.fallaAnota) PORTAL.fallaAnota('vista de archivos: ' + q + ': ' + porque, ''); } catch (e) { /* nada */ }
          fr.remove();
          cu.innerHTML = '<div class="vx-carga" role="alert"><div>No se pudo abrir aquí; ya quedó avisado.</div><div>Qué hacer: bájalo con «Bajar» y ábrelo en ' + (q === 'word' ? 'Word' : 'PowerPoint') + '.</div></div>';
        }
        ok(bien);
      }
      function oye(ev) {
        if (ev.source !== fr.contentWindow) return;   // solo lo que viene del marco de este documento
        var m = ev.data || {};
        if (m.pf === 'listo') {
          var copia = b.slice().buffer;
          fr.contentWindow.postMessage({ pf: 'abre', t: T, tipo: q, b: copia, marca: v.__marca === true, logo: M ? M.logo : '', agua: M ? M.marcaAgua : '',
            sub: M ? (M.subtitulo || '') : '', fondo: fondo }, '*', [copia]);
        } else if (m.pf === 'hecho') termina(true);
        else if (m.pf === 'falla') termina(false, String(m.m || 'sin detalle'));
        else if (m.pf === 'esc' && v.__cierra && !D.querySelector('.pba-velo,.pm-menu')) v.__cierra();
      }
      W.addEventListener('message', oye);
      v.__limpia.push(function () { W.removeEventListener('message', oye); if (!fin) { fin = true; clearTimeout(reloj); ok(false); } });
      v.__alModo = function (si) { try { fr.contentWindow.postMessage({ pf: 'marca', t: T, si: !!si }, '*'); } catch (e) { /* ya se cerró */ } };
      reloj = setTimeout(function () { termina(false, 'tardó más de ' + OFI_TIEMPO / 1000 + ' s'); }, OFI_TIEMPO);
      fr.srcdoc = marcoDe(q, T);
      cu.appendChild(fr);
    });
  }
  /* ---------- Un Word, en PDF (Héctor Daniel Nava, 24-nov-2026, 20:06; lo pide js/visor.js al escoger «PDF con marca
     PROFASE» o «PDF original (sin marca)» en «Bajar»). ----------
     PROFASE_VISTA.wordPdf({ bytes, nombre, marca, boton }) → promesa con el PDF (Uint8Array). El Word se dibuja en un
     marco aislado igual al de «Ver» (sin la sesión ni la base, sin red), transparente detrás de una ventanita que dice
     cómo va («Pasando a PDF… hoja 3 de 12», con «Cancelar»); de cada hoja salen su foto y sus renglones y aquí se arma el
     PDF con pdf-lib (la misma de js/marca.js): la foto de la hoja del tamaño de la página del Word y, encima, su texto
     invisible en su lugar, para buscar y copiar. Con marca: la de los PDF sellados (PROFASE_MARCA.sellaPDF). Lo que se
     baja lo hace js/visor.js; aquí no se baja nada. Si se cancela, la promesa falla con e.cancelado. */
  var PDF_TIEMPO = 45000, CONVIRTIENDO = false;
  var WP_CSS = '.pf-wp{position:fixed;inset:0;z-index:9450;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(10,18,32,.55)}'
    + '.pf-wp-c{width:min(360px,100%);background:var(--surface,#fff);color:var(--ink,#132036);border-radius:16px;padding:18px 18px 14px;box-shadow:0 18px 48px rgba(10,18,32,.35);font-family:var(--f-body,Arial,sans-serif)}'
    + '.pf-wp-c b{display:block;font-size:16px}.pf-wp-c .pf-wp-n{display:block;margin-top:2px;font-size:13px;color:var(--muted,#5A6577);overflow-wrap:anywhere}'
    + '.pf-wp-b{height:8px;border-radius:8px;background:var(--surface-2,#EEF2F7);margin:14px 0 8px;overflow:hidden}.pf-wp-b i{display:block;height:100%;width:4%;background:var(--accent,#F07A1E);border-radius:8px;transition:width .25s}'
    + '.pf-wp-c p{margin:0 0 12px;font-size:13.5px}.pf-wp-c button{min-height:44px;padding:0 16px;border-radius:10px;border:1px solid var(--line-strong,#C4CDDA);background:var(--surface,#fff);color:inherit;font:inherit;font-weight:600;cursor:pointer}'
    + '.pf-wp-f{position:fixed;left:0;top:0;width:100vw;height:100vh;border:0;opacity:0;pointer-events:none;z-index:9440}';
  function u8(b) { return b instanceof Uint8Array ? b : ArrayBuffer.isView(b) ? new Uint8Array(b.buffer, b.byteOffset, b.byteLength) : new Uint8Array(b); }
  function qh(t) { return new Error(t); }
  async function wordPdf(op) {
    op = op || {};
    if (CONVIRTIENDO) throw qh('Ya se está pasando otro Word a PDF. Qué hacer: espera a que termine y vuelve a picar «Bajar».');
    var M = window.PROFASE_MARCA;
    if (!M || !M.pdfLib) throw qh('No se pudo pasar a PDF aquí. Qué hacer: vuelve a cargar la pantalla; si sigue, bájalo como Word y conviértelo en tu equipo.');
    CONVIRTIENDO = true;
    try {
      var b = typeof op.bytes === 'function' ? op.bytes() : op.bytes;
      b = await b;
      if (!b) throw qh('No llegó el archivo. Qué hacer: vuelve a intentar en un momento.');
      b = u8(b);
      if (b.length > MAX_OFI) throw qh('Es muy grande para pasarlo a PDF aquí. Qué hacer: bájalo como Word y conviértelo en tu equipo.');
      revisaOfi(b, 'word');
      var L = await M.pdfLib();
      if (!L || !L.PDFDocument) throw qh('No se pudo pasar a PDF aquí. Qué hacer: vuelve a intentar; si sigue, bájalo como Word y conviértelo en tu equipo.');
      var pdf = await convierte(b, L, op);
      if (op.marca && M.sellaPDF) pdf = (await M.sellaPDF(pdf, { titulo: titulo(op.nombre) })) || pdf;
      return pdf;
    } finally { CONVIRTIENDO = false; }
  }
  function titulo(n) { return String(n || 'documento').replace(/\.(docx|docm|dotx|dotm)$/i, ''); }
  function convierte(b, L, op) {
    return new Promise(function (ok, ko) {
      var D = document;
      try { if (op.boton && op.boton.ownerDocument && op.boton.ownerDocument.body) D = op.boton.ownerDocument; } catch (e) { D = document; }
      var W = D.defaultView || window, T = azar(), fin = false, reloj = 0, cadena = Promise.resolve(), doc = null, font = null, letras = null;
      if (!D.getElementById('pf-wp-css')) { var st = D.createElement('style'); st.id = 'pf-wp-css'; st.textContent = WP_CSS; (D.head || D.documentElement).appendChild(st); }
      var caja = D.createElement('div');
      caja.className = 'pf-wp'; caja.setAttribute('role', 'dialog'); caja.setAttribute('aria-modal', 'true'); caja.setAttribute('aria-label', 'Pasando a PDF'); caja.setAttribute('data-sin-jalar', '');
      caja.innerHTML = '<div class="pf-wp-c"><b>Pasando a PDF' + (op.marca ? ' con marca PROFASE' : ' sin marca') + '</b><span class="pf-wp-n">' + esc(op.nombre || '') + '</span>'
        + '<div class="pf-wp-b" aria-hidden="true"><i></i></div><p aria-live="polite">Preparando el documento…</p><button type="button" data-wp-x>Cancelar</button></div>';
      var fr = D.createElement('iframe');
      fr.className = 'pf-wp-f'; fr.setAttribute('aria-hidden', 'true'); fr.tabIndex = -1; fr.title = 'Word para pasar a PDF';
      fr.setAttribute('sandbox', 'allow-scripts'); fr.setAttribute('referrerpolicy', 'no-referrer');
      var barra = caja.querySelector('.pf-wp-b i'), dice = caja.querySelector('p');
      function cuenta(i, n) {
        barra.style.width = Math.max(4, Math.min(100, Math.round(100 * i / Math.max(1, n)))) + '%';
        dice.textContent = 'Hoja ' + i + ' de ' + n + '…';
      }
      function espera() { clearTimeout(reloj); reloj = setTimeout(function () { termina(qh('Tardó demasiado en pasarlo a PDF. Qué hacer: vuelve a intentar; si sigue, bájalo como Word y conviértelo en tu equipo.'), 'tardó más de ' + PDF_TIEMPO / 1000 + ' s'); }, PDF_TIEMPO); }
      function termina(err, porque, res) {
        if (fin) return;
        fin = true; clearTimeout(reloj);
        W.removeEventListener('message', oye); D.removeEventListener('keydown', tecla, true);
        caja.remove(); fr.remove();
        try { if (window.PORTAL && PORTAL.escribiendo) PORTAL.escribiendo('word-pdf', false); } catch (e) { /* nada */ }
        try { if (op.boton && op.boton.focus) op.boton.focus({ preventScroll: true }); } catch (e) { /* sin foco */ }
        if (err) {
          try { if (porque && window.PORTAL && PORTAL.fallaAnota) PORTAL.fallaAnota('Word a PDF: ' + porque, ''); } catch (e) { /* nada */ }
          ko(err);
        } else ok(res);
      }
      function cancela() { var e = qh('Se canceló'); e.cancelado = true; termina(e); }
      function tecla(ev) { if (ev.key === 'Escape') { ev.preventDefault(); ev.stopImmediatePropagation(); cancela(); } }
      caja.addEventListener('click', function (ev) { if (ev.target.closest('[data-wp-x]')) cancela(); });
      // una hoja: su foto (del tamaño de la página del Word) y, encima, sus renglones invisibles (para buscar y copiar)
      function hoja(m) {
        var w = +m.w, pag = +m.pag, alto = +m.alto;
        if (!(w > 0 && pag > 0 && alto > 0) || !(m.img instanceof ArrayBuffer)) throw new Error('hoja sin datos');
        var wp = w * 0.75, pp = pag * 0.75, hp = alto * 0.75, s = hp > pp ? pp / hp : 1, dw = wp * s, dh = hp * s, x0 = (wp - dw) / 2;
        return doc.embedJpg(new Uint8Array(m.img)).then(function (img) {
          var pg = doc.addPage([wp, pp]);
          pg.drawImage(img, { x: x0, y: pp - dh, width: dw, height: dh });
          var lst = Array.isArray(m.textos) ? m.textos.slice(0, 20000) : [];
          if (!lst.length) return;
          var key = pg.node.newFontDictionary(font.name, font.ref), ops = [L.pushGraphicsState(), L.beginText(), L.setTextRenderingMode(L.TextRenderingMode.Invisible)];
          lst.forEach(function (f) {
            var t = Array.from(String(f.t || '').slice(0, 2000)).map(function (c) { return letras.has(c.codePointAt(0)) ? c : '?'; }).join('');
            var tam = (+f.f || 12) * 0.75 * s, ancho = (+f.w || 0) * 0.75 * s, enc = null, tw = 0;
            if (!t.trim() || !(tam > 0.5)) return;
            try { enc = font.encodeText(t); tw = font.widthOfTextAtSize(t, tam); } catch (e) { return; }
            var sq = tw > 0 && ancho > 0 ? Math.max(10, Math.min(1000, 100 * ancho / tw)) : 100;
            var x = x0 + (+f.x || 0) * 0.75 * s, y = pp - ((+f.y || 0) + (+f.h || 0) * 0.8) * 0.75 * s;
            ops.push(L.setFontAndSize(key, tam), L.setCharacterSqueeze(sq), L.setTextMatrix(1, 0, 0, 1, x, y), L.showText(enc));
          });
          ops.push(L.endText(), L.popGraphicsState());
          pg.pushOperators.apply(pg, ops);
        });
      }
      function oye(ev) {
        if (fin || ev.source !== fr.contentWindow) return;   // solo lo que viene de este marco
        var m = ev.data || {};
        espera();
        if (m.pf === 'listo') {
          var copia = b.slice().buffer;
          fr.contentWindow.postMessage({ pf: 'abre', t: T, tipo: 'word', b: copia, marca: false, pdf: true, escala: 2, fondo: '#fff' }, '*', [copia]);
        } else if (m.pf === 'avance') cuenta(+m.i || 0, +m.n || 1);
        else if (m.pf === 'hoja') cadena = cadena.then(function () { return hoja(m); });
        else if (m.pf === 'pdf') {
          dice.textContent = 'Juntando el PDF…';
          cadena.then(function () {
            if (!doc.getPageCount()) throw new Error('sin hojas');
            try { doc.setTitle(titulo(op.nombre), { showInWindowTitleBar: true }); doc.setCreator('PROFASE'); } catch (e) { /* sin título */ }
            return doc.save({ useObjectStreams: false });
          }).then(function (r) { termina(null, '', r); }, function (e) {
            termina(qh('No se pudo pasar a PDF. Qué hacer: vuelve a intentar; si sigue, bájalo como Word y conviértelo en tu equipo.'), String((e && e.message) || e || 'sin detalle'));
          });
        } else if (m.pf === 'falla') termina(qh('No se pudo pasar este Word a PDF aquí; ya quedó avisado. Qué hacer: bájalo como Word (Bajar › Word) y conviértelo en tu equipo.'), String(m.m || 'sin detalle'));
      }
      L.PDFDocument.create().then(function (d) {
        doc = d;
        return doc.embedFont(L.StandardFonts.Helvetica);
      }).then(function (f) {
        font = f; letras = new Set(f.getCharacterSet());
        if (fin) return;
        W.addEventListener('message', oye);
        D.addEventListener('keydown', tecla, true);
        try { if (window.PORTAL && PORTAL.escribiendo) PORTAL.escribiendo('word-pdf', true); } catch (e) { /* nada */ }
        D.body.appendChild(caja);
        D.body.appendChild(fr);
        try { caja.querySelector('button').focus({ preventScroll: true }); } catch (e) { /* sin foco */ }
        espera();
        fr.srcdoc = marcoDe('wordpdf', T);
      }).catch(function (e) { termina(qh('No se pudo pasar a PDF. Qué hacer: vuelve a intentar en un momento.'), String((e && e.message) || e || '')); });
    });
  }
  var ABRIENDO = false;
  async function ver(op) {
    op = op || {};
    var q = tipo(op);
    if (!q || ABRIENDO) return null;
    if ((op.tam || 0) > tope(q)) throw new Error('Es muy grande para verlo aquí. Qué hacer: bájalo con «Bajar» y ábrelo en tu equipo.');
    ABRIENDO = true;
    var btn = op.boton, t0 = btn ? btn.textContent : '', v = null, falla = null;
    if (btn) { btn.disabled = true; btn.textContent = 'Abriendo…'; }
    try {
      var b = typeof op.bytes === 'function' ? op.bytes() : op.bytes;
      b = await b;
      if (!b) throw new Error('No llegó el archivo');
      if (!(b instanceof Uint8Array)) b = ArrayBuffer.isView(b) ? new Uint8Array(b.buffer, b.byteOffset, b.byteLength) : new Uint8Array(b);
      if (b.length > tope(q)) throw new Error('Es muy grande para verlo aquí. Qué hacer: bájalo con «Bajar» y ábrelo en tu equipo.');
      if (q === 'hojas') {
        var csv = /\.csv$/i.test(op.nombre || '') || /text\/csv/i.test(op.tipo || '');
        var r = await leeHojas(b, csv, !csv && (/\.xls[xm]$/i.test(op.nombre || '') || /openxmlformats-officedocument\.spreadsheetml|ms-excel\.sheet\.macroenabled/i.test(op.tipo || '')));
        if (!r.hojas.length) throw new Error('No trae hojas visibles. Qué hacer: bájalo con «Bajar» y ábrelo en Excel.');
        v = abre(op, tablaHoja(r.hojas[0]) + (r.ocultas ? '<p class="vx-nota">' + r.ocultas + (r.ocultas === 1 ? ' hoja oculta no se enseña' : ' hojas ocultas no se enseñan') + '.</p>' : ''), r.hojas, { marca: true, sello: true });
      } else if (q === 'word' || q === 'ppt') {
        revisaOfi(b, q);
        v = abre(op, '<div class="vx-carga" role="status"><div class="vx-gira" aria-hidden="true"></div><div>Abriendo ' + (q === 'word' ? 'el documento' : 'la presentación') + '…</div></div>', null, { marca: true, ofi: true });
        await oficina(v, b, q, op);
      } else if (q === 'xml' && window.PROFASE_CFDI) {
        var txt = decodifica(b), doc = new DOMParser().parseFromString(txt, 'application/xml');
        if (doc.getElementsByTagName('parsererror').length) v = abre(op, '<p class="vx-nota">El XML trae un error y no se puede acomodar; así viene:</p><pre class="vx-pre">' + esc(txt.slice(0, MAX_TEXTO)) + '</pre>');
        else {
          // el XML acomodado y la ficha del CFDI: la pieza común js/cfdi.js (una sola versión con Centauro, 3-nov-2026)
          var ficha = window.PROFASE_CFDI.ficha(doc);
          v = abre(op, ficha + (ficha ? '<details class="vx-xml"><summary>XML completo</summary>' : '') + '<pre class="vx-pre">' + window.PROFASE_CFDI.bonito(doc.documentElement, MAX_TEXTO) + '</pre>' + (ficha ? '</details>' : ''));
        }
      } else {
        // el texto (y un XML si la página no cargó js/cfdi.js), tal cual y escapado
        var tx = decodifica(b);
        if (/\.json$/i.test(op.nombre || '')) { try { tx = JSON.stringify(JSON.parse(tx), null, 2); } catch (e) { /* tal cual */ } }
        v = abre(op, '<pre class="vx-pre">' + esc(tx.slice(0, MAX_TEXTO)) + (tx.length > MAX_TEXTO ? '\n… (el resto no se enseña aquí; bájalo)' : '') + '</pre>');
      }
    } catch (e) {
      var m = e && e.message ? e.message : '';
      if (/Qué hacer/.test(m)) falla = new Error(m);
      else {
        try { if (window.PORTAL && PORTAL.fallaAnota && m) PORTAL.fallaAnota('vista de archivos: ' + m, ''); } catch (x) { /* nada */ }
        falla = new Error('No se pudo abrir aquí. Qué hacer: bájalo con «Bajar» y ábrelo en tu equipo.');
      }
    }
    if (btn) { btn.disabled = false; btn.textContent = t0; }
    ABRIENDO = false;
    if (falla) throw falla;
    return v;
  }
  window.PROFASE_VISTA = { tipo: tipo, ver: ver, abierta: abierta, cierra: cierra, wordPdf: wordPdf, marcaVista: marcaVista };
})();
