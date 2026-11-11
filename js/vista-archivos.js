/* Portal PROFASE · Vista previa de Excel, CSV, XML (con la ficha del CFDI) y texto, en grande, encima de toda la
   pantalla (11-nov-2026). Una sola versión para el portal: la usan el chat interno (antes vivía dentro de chat.html:
   pedido de Sebastián Sánchez que Daniel aprobó el 30-oct-2026; en grande, como la foto, desde el 6-nov-2026: Héctor
   Daniel, «Si») y WorkFlow › Panel de trabajo («Ver» en grande también los Excel). Regla de Daniel: «nunca nunca
   repetir código ni crear 2 versiones»; una pantalla nueva que enseñe estos archivos usa esta pieza.
     PROFASE_VISTA.tipo(a)     'hojas' (xlsx, xlsm, xls, ods, csv), 'xml', 'texto' (txt, log, json, md) o '' si aquí no se
                               ve (los PDF, las fotos, los videos y los audios tienen su propia vista); a = {nombre, tipo}
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
  var MAX_VISTA = 15 * 1024 * 1024, MAX_FILAS = 1000, MAX_COLS = 60, MAX_TEXTO = 3 * 1024 * 1024;
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
    if (/^(xlsx|xlsm|xls|ods|csv)$/.test(e) || /spreadsheet|ms-excel|text\/csv/.test(t)) return 'hojas';
    if (e === 'xml' || /[\/+]xml$/.test(t)) return 'xml';
    if (/^(txt|log|json|md)$/.test(e) || t === 'text/plain' || t === 'application/json') return 'texto';
    return '';
  }
  // el cuadrito de arriba con su tipo (verde el Excel, morado el XML; los demás, gris con su extensión), como en el chat
  function insignia(a) {
    var e = ext(a), t = String(a.tipo || '').toLowerCase();
    if (/^(xls|xlsx|xlsm|ods)$/.test(e) || /spreadsheet|excel/.test(t)) return ['xls', e.toUpperCase() || 'XLS'];
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
      var t = setTimeout(function () { w.terminate(); URL.revokeObjectURL(url); ko(new Error('El archivo tardó demasiado en abrir.')); }, 25000);
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
    + '#pf-vx .vx-cab{padding-top:max(10px,env(safe-area-inset-top,0px));padding-left:max(14px,env(safe-area-inset-left,0px));padding-right:max(10px,env(safe-area-inset-right,0px))}'
    + '#pf-vx .vx-cu{margin-bottom:env(safe-area-inset-bottom,0px)}'
    + '#pf-vx .vx-t th,#pf-vx .vx-t td{max-width:240px}}'
    + '@media (prefers-reduced-motion: reduce){#pf-vx{animation:none}}'
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
  function cierra() { if (VX && VX.__cierra) VX.__cierra(true); }
  addEventListener('pagehide', cierra);
  function abre(op, cuerpo, hojas) {
    cierra();
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
    v.innerHTML = '<div class="vx-p"><div class="vx-cab"><span class="tipo ' + t[0] + '">' + esc(t[1]) + '</span><b title="' + esc(op.nombre) + '">' + esc(op.nombre) + '</b>'
      + (typeof op.alBajar === 'function' ? '<button type="button" class="vx-baja" data-vx-baja>Bajar</button>' : '')
      + '<button type="button" class="vx-x" data-cierra aria-label="Cerrar (Esc)" title="Cerrar (Esc)">' + X + '</button></div>'
      + (hojas && hojas.length > 1 ? '<div class="vx-tabs" role="tablist">' + hojas.map(function (h, i) { return '<button type="button" role="tab" data-hoja="' + i + '" aria-selected="' + (i === 0 ? 'true' : 'false') + '">' + esc(h.n) + '</button>'; }).join('') + '</div>' : '')
      + '<div class="vx-cu" tabindex="0">' + cuerpo + '</div></div>';
    D.body.appendChild(v);
    VX = v;
    if (hojas && hojas[0]) ponImagenes(v.querySelector('.vx-cu'), hojas[0], ligas);
    function cierraEsta(sinFoco) {
      if (VX === v) VX = null;
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
  var ABRIENDO = false;
  async function ver(op) {
    op = op || {};
    var q = tipo(op);
    if (!q || ABRIENDO) return null;
    if ((op.tam || 0) > MAX_VISTA) throw new Error('Es muy grande para verlo aquí; bájalo.');
    ABRIENDO = true;
    var btn = op.boton, t0 = btn ? btn.textContent : '', v = null, falla = null;
    if (btn) { btn.disabled = true; btn.textContent = 'Abriendo…'; }
    try {
      var b = typeof op.bytes === 'function' ? op.bytes() : op.bytes;
      b = await b;
      if (!b) throw new Error('No llegó el archivo');
      if (!(b instanceof Uint8Array)) b = ArrayBuffer.isView(b) ? new Uint8Array(b.buffer, b.byteOffset, b.byteLength) : new Uint8Array(b);
      if (b.length > MAX_VISTA) throw new Error('Es muy grande para verlo aquí; bájalo.');
      if (q === 'hojas') {
        var csv = /\.csv$/i.test(op.nombre || '') || /text\/csv/i.test(op.tipo || '');
        var r = await leeHojas(b, csv, !csv && (/\.xls[xm]$/i.test(op.nombre || '') || /openxmlformats-officedocument\.spreadsheetml|ms-excel\.sheet\.macroenabled/i.test(op.tipo || '')));
        if (!r.hojas.length) throw new Error('No trae hojas visibles.');
        v = abre(op, tablaHoja(r.hojas[0]) + (r.ocultas ? '<p class="vx-nota">' + r.ocultas + (r.ocultas === 1 ? ' hoja oculta no se enseña' : ' hojas ocultas no se enseñan') + '.</p>' : ''), r.hojas);
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
      falla = new Error(/^Es muy grande/.test(m) ? m : 'No se pudo abrir aquí: ' + (m || 'intenta otra vez') + '. Puedes bajarlo.');
    }
    if (btn) { btn.disabled = false; btn.textContent = t0; }
    ABRIENDO = false;
    if (falla) throw falla;
    return v;
  }
  window.PROFASE_VISTA = { tipo: tipo, ver: ver, abierta: abierta, cierra: cierra };
})();
