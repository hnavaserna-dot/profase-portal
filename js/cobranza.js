/* Portal PROFASE · Cobranza: la pantalla de Tesorería › Cobranza y el resumen de sus pilas en el Inicio.
   Una sola pieza para las tres vistas (dirección, gerentes y la tesorera) y para el Inicio (Héctor Daniel Nava,
   4-nov-2026, 15:06: «limpiame y optimizame esta pantalla con pilas y demás»; 15:10: «quiero que me des un resumen de
   las pilas cuando le clic a las de cobranza»).

   Este archivo no habla con la base: cada página le da el paquete de cobranza que ya lee (quién ve qué compañía lo
   decide la base, como siempre) y aquí solo se pinta. Las reglas son las mismas en todos lados (las del Inicio):
   - Por cobrar: el saldo de las facturas con saldo.
   - Vencido: facturas con saldo de meses anteriores al mes del corte (amarillo, 2 meses; rojo, 3 o más).
   - Mes en curso: facturas del mes del corte (por vencer).
   - Cobrado en <mes>: los pagos con fecha de este mes (solo si el paquete trae los pagos).
   - Sin IVA: el saldo ÷ 1.16 (si la factura no lleva IVA, igual).

   var P = PROFASE_CXC.prepara(D);                 // D: el paquete (invCols/inv, pagCols/pag, refreshedAt)
   var X = PROFASE_CXC.pantalla(el, { clave: 'cxc' });   // monta la pantalla dentro de el
   X.pon(D);                                        // cada vez que llegan datos nuevos
   X.abre('cia:<compañía>|pila:ven|grp:<grupo>');   // desde el Inicio (PROFASE_ABRE.cobranza)
   PROFASE_CXC.resumen(P, { cia: '<compañía>', pila: 'ven', ver: function (x) { … } });   // la ventana del Inicio
   El nombre de las compañías llega con los datos: el código es público y no las nombra. */
(function () {
  'use strict';
  if (window.PROFASE_CXC) return;

  var MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var MESL = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  // las seis columnas de antigüedad (meses desde la factura hasta el mes del corte, contando los dos)
  var EDAD = [{ t: 'Mes en curso', c: 'e0' }, { t: '2 meses', c: 'e1' }, { t: '3 meses', c: 'e2' }, { t: '4 a 6 meses', c: 'e3' },
              { t: '7 a 12 meses', c: 'e4' }, { t: 'Más de 12', c: 'e5' }];
  var PILAS = { tot: 'Por cobrar', ven: 'Vencido', curso: 'Mes en curso', cob: 'Cobrado' };

  var money0 = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  var money2 = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function fm0(v) { return (v < 0 ? '-$' : '$') + money0.format(Math.abs(Math.round(v || 0))); }
  function fm2(v) { return (v < 0 ? '-$' : '$') + money2.format(Math.abs(v || 0)); }
  function n2(v) { return v ? money2.format(v) : ''; }
  function ni(n) { return Number(n || 0).toLocaleString('es-MX'); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function norm(s) { return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase(); }
  function fd(s) { if (!s) return ''; var p = String(s).slice(0, 10).split('-'); return +p[2] + '-' + MES[+p[1] - 1] + '-' + p[0].slice(2); }
  function fdh(s) { return '<span class="cx-nw">' + fd(s) + '</span>'; }   // la fecha nunca se parte en dos renglones
  function ymTxt(ym) { return MES[ym % 100 - 1] + ' ' + String(Math.floor(ym / 100)).slice(2); }
  function edadDe(meses) { return meses <= 1 ? 0 : meses === 2 ? 1 : meses === 3 ? 2 : meses <= 6 ? 3 : meses <= 12 ? 4 : 5; }
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
                set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } } };
  // el mes de hoy en Monterrey («AAAA-MM»), para «Cobrado en …»
  function mesHoy() {
    try {
      var p = {}; new Intl.DateTimeFormat('en-US', { timeZone: 'America/Monterrey', year: 'numeric', month: '2-digit' })
        .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      return p.year + '-' + p.month;
    } catch (e) { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }
  }

  /* ---------------- datos ---------------- */
  function prepara(D) {
    if (!D || !Array.isArray(D.inv)) return null;
    var ic = D.invCols || [], pc = D.pagCols || [];
    var d = new Date(D.refreshedAt), ref = isNaN(d) ? null : d.getFullYear() * 12 + d.getMonth() + 1;
    var INV = D.inv.map(function (r) {
      var o = {}; ic.forEach(function (k, i) { o[k] = r[i]; });
      o.saldo = +o.saldo || 0; o.y = +String(o.fecha).slice(0, 4); o.m = +String(o.fecha).slice(5, 7); o.ym = o.y * 100 + o.m;
      o.meses = (ref || o.y * 12 + o.m) - (o.y * 12 + o.m) + 1; o.edad = edadDe(o.meses);
      o.ef = !(+o.iva); o.ssi = o.ef ? o.saldo : o.saldo / 1.16;
      o.grp = o.grp || 'Sin grupo'; o.rs = o.rs || o.grp;
      return o;
    });
    var porFolio = {};
    INV.forEach(function (o) { porFolio[o.cia + '|' + o.folio] = o; });
    var conPagos = Array.isArray(D.pag) && pc.indexOf('fechaPago') >= 0;
    var PAG = conPagos ? D.pag.map(function (r) {
      var o = {}; pc.forEach(function (k, i) { o[k] = r[i]; });
      var f = porFolio[o.cia + '|' + o.folio] || {};
      o.pago = +o.pago || 0; o.psi = o.pagoSinIva != null ? +o.pagoSinIva : o.pago / 1.16;
      o.rs = f.rs || ''; o.rfc = f.rfc || ''; o.grp = o.grp || f.grp || 'Sin grupo';
      return o;
    }) : [];
    var cias = []; INV.forEach(function (o) { if (o.saldo > 0 && cias.indexOf(o.cia) < 0) cias.push(o.cia); });
    cias.sort(function (a, b) { return String(a).localeCompare(String(b), 'es'); });
    var afavor = INV.filter(function (o) { return o.saldo < -0.005; });
    return { D: D, INV: INV, PAG: PAG, conPagos: conPagos, ref: ref, mes: mesHoy(), cias: cias, afavor: afavor };
  }
  // las cuentas de las pilas (una sola versión; el Inicio y la pantalla las usan igual)
  function cuentas(P, f) {
    var c = { tot: 0, ven: 0, ven2: 0, ven3: 0, curso: 0, cob: 0, nTot: 0, nVen: 0, nCurso: 0, nCob: 0, grupos: {}, gVen: {} };
    P.INV.forEach(function (o) {
      if (!(o.saldo > 0) || (f && !f(o))) return;
      c.tot += o.saldo; c.nTot++; c.grupos[o.grp] = 1;
      if (o.meses >= 2) { c.ven += o.saldo; c.nVen++; c.gVen[o.grp] = 1; if (o.meses === 2) c.ven2 += o.saldo; else c.ven3 += o.saldo; }
      else { c.curso += o.saldo; c.nCurso++; }
    });
    P.PAG.forEach(function (p) {
      if (!p.fechaPago || String(p.fechaPago).slice(0, 7) !== P.mes || (f && !f(p))) return;
      c.cob += p.pago; c.nCob++;
    });
    c.nGrp = Object.keys(c.grupos).length; c.nGrpVen = Object.keys(c.gVen).length;
    return c;
  }
  function enPila(o, pila) { return pila === 'ven' ? o.meses >= 2 : pila === 'curso' ? o.meses <= 1 : true; }
  // grupos → razones sociales → facturas, con su total por columna
  function arbol(rows, campo, col) {
    var g = {}, lista = [];
    rows.forEach(function (o) {
      var v = o[campo], k = col(o);
      var G = g[o.grp]; if (!G) { G = g[o.grp] = { n: o.grp, cel: {}, tot: 0, nf: 0, viejo: 0, ymv: 999999, rs: {}, cias: {} }; lista.push(G); }
      G.cel[k] = (G.cel[k] || 0) + v; G.tot += v; G.nf++; G.cias[o.cia] = 1;
      if (o.meses > G.viejo) G.viejo = o.meses; if (o.ym < G.ymv) G.ymv = o.ym;
      var R = G.rs[o.rs]; if (!R) R = G.rs[o.rs] = { n: o.rs, rfc: o.rfc || '', cel: {}, tot: 0, fac: [] };
      R.cel[k] = (R.cel[k] || 0) + v; R.tot += v; R.fac.push(o);
    });
    return lista;
  }
  function ciasDe(fac) { var c = []; fac.forEach(function (o) { if (c.indexOf(o.cia) < 0) c.push(o.cia); }); return c.sort(); }
  function claseViejo(meses) { return meses >= 3 ? 'rj' : meses === 2 ? 'am' : 'az'; }
  function desde(G) { return G.ymv < 999999 ? 'desde ' + ymTxt(G.ymv) : ''; }

  /* ---------------- estilos ---------------- */
  var CSS = ''
    + '.cx,.cx-dlg{--cx-az:var(--brand-blue,#014F8F);--cx-am:var(--amber,#9A5B00);--cx-rj:var(--red,#B42318);--cx-ok:var(--ok,#0B7A45);--cx-nv:var(--navy,#1F3864);'
    + '--cx-sf:var(--surface,#fff);--cx-ln:var(--line,#DCE2EB);--cx-ln2:var(--line-strong,#C4CDDA);--cx-ink:var(--ink,#132036);--cx-mu:var(--muted,#5A6577);'
    + '--cx-alt:var(--row-alt,#F8FAFC);--cx-nvs:var(--navy-soft,#E6ECF6);--cx-ac:var(--accent,#F07A1E);'
    + '--cx-e0:var(--cx-az);--cx-e1:var(--cx-am);--cx-e2:color-mix(in srgb,var(--cx-rj) 70%,var(--cx-am));--cx-e3:var(--cx-rj);'
    + '--cx-e4:color-mix(in srgb,var(--cx-rj) 78%,var(--cx-ink));--cx-e5:color-mix(in srgb,var(--cx-rj) 58%,var(--cx-ink))}'
    + '.cx{display:flex;flex-direction:column;min-width:0;padding-top:10px}'
    + '.cx *,.cx-dlg *{box-sizing:border-box}'
    + '.cx [hidden],.cx-dlg [hidden]{display:none!important}.cx-nw{white-space:nowrap}'
    // la compañía, con o sin IVA y cómo se ve: botones de dos o tres, dentro de la barra común (UX PROFASE)
    + '.cx-seg{display:inline-flex;flex-wrap:wrap;gap:4px;padding:3px;border:1px solid var(--cx-ln2);border-radius:999px;background:var(--cx-sf);max-width:100%}'
    + '.cx-seg button{font:inherit;font-size:13px;font-weight:600;border:0;background:transparent;color:var(--cx-mu);border-radius:999px;padding:6px 13px;cursor:pointer;white-space:nowrap}'
    + '.cx-seg button:hover{color:var(--cx-ink)}'
    + '.cx-seg button[aria-pressed="true"]{background:var(--cx-nv);color:#fff}'
    + ':root[data-theme="dark"] .cx-seg button[aria-pressed="true"]{background:#8FB0E8;color:#0D1320}'
    + '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .cx-seg button[aria-pressed="true"]{background:#8FB0E8;color:#0D1320}}'
    + '.cx-lb{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--cx-mu);font-weight:700;padding:0 6px 0 9px;align-self:center}'
    // la barrita de antigüedad de cada grupo (en el celular); las pilas de arriba son las comunes (js/pilas.js, UX PROFASE)
    + '.cx-mini{display:flex;width:100%;height:6px;border-radius:999px;overflow:hidden;background:var(--cx-alt);margin:6px 0 3px}'
    + '.cx-mini i{display:block;height:100%}'
    + '.cx-l{display:inline-flex;align-items:center;gap:4px;white-space:nowrap}.cx-l i{width:8px;height:8px;border-radius:50%;display:inline-block}'
    // la barra: filtros, buscar y cómo se ve
    + '.cx-bar{display:flex;flex-wrap:wrap;gap:8px 10px;align-items:center;margin-bottom:10px}'
    + '.cx-bar .pf{margin:0}'
    + '.cx-q{flex:1 1 220px;max-width:420px;display:flex;align-items:center;gap:7px;height:38px;padding:0 11px;border:1px solid var(--cx-ln2);border-radius:10px;background:var(--cx-sf);color:var(--cx-mu)}'
    + '.cx-q svg{width:16px;height:16px;flex:none}'
    + '.cx-q input{flex:1;min-width:0;border:0;background:transparent;color:var(--cx-ink);font:inherit;font-size:14px;outline:none}'
    + '.cx-btn{font:inherit;font-size:13px;font-weight:600;height:38px;border:1px solid var(--cx-ln2);background:var(--cx-sf);color:var(--cx-ink);border-radius:10px;padding:0 13px;cursor:pointer;white-space:nowrap}'
    + '.cx-btn:hover{border-color:var(--cx-nv)}'
    + '.cx-bar .cx-seg{border-radius:10px}.cx-bar .cx-seg button{border-radius:8px;padding:6px 11px}'
    + '.cx .ppl-masm .cx-btn{width:100%;text-align:left;margin:0}.cx-pp{margin:0}'
    // en la barra, la compañía va sin su letrero (cabe en un renglón en la computadora; el grupo dice «Compañía» al lector)
    + '.cx .ppl-bar .cx-lb{display:none}'
    // la tabla
    + '.cx-caja{background:var(--cx-sf);border:1px solid var(--cx-ln);border-radius:12px;overflow:auto;-webkit-overflow-scrolling:touch;max-height:max(380px,calc(100dvh - 260px));margin-bottom:8px}'
    + '.cx-tb{width:100%;border-collapse:separate;border-spacing:0;font-size:13px;font-variant-numeric:tabular-nums}'
    + '.cx-tb thead th{position:sticky;top:0;z-index:3;background:var(--cx-nv);color:#fff;font-weight:600;font-size:12.5px;padding:9px 10px;text-align:right;white-space:nowrap;cursor:pointer;user-select:none}'
    + '.cx-tb thead th.cx-thn{text-align:left}'
    + '.cx-ar{font-size:10px;opacity:.75;margin-left:4px}'
    + '.cx-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;vertical-align:1px;background:var(--d)}'
    + '.cx-tb thead th:first-child{left:0;z-index:4}'
    + '.cx-tb td{padding:8px 10px;border-bottom:1px solid var(--cx-ln);text-align:right;white-space:nowrap;vertical-align:top;background:var(--cx-sf);color:var(--cx-ink)}'
    + '.cx-tb td:first-child{position:sticky;left:0;z-index:1;text-align:left;white-space:normal;min-width:260px;max-width:400px}'
    + '.cx-tb td.cx-tt{font-weight:700}'
    + '.cx-tb td.cx-vac{color:var(--cx-ln2)}'
    + '.cx-tb tr.cx-g{cursor:pointer}'
    + '.cx-tb tr.cx-g:hover td{background:var(--cx-alt)}'
    + '.cx-tb tr.cx-g td:first-child{font-weight:700}'
    + '.cx-tb tr.cx-g.abierto td{background:var(--cx-nvs)}'
    + '.cx-nm{display:flex;align-items:flex-start;gap:6px;min-width:0}'
    + '.cx-tw{flex:none;width:18px;height:18px;border-radius:5px;display:grid;place-items:center;color:var(--cx-ac);font-weight:800;line-height:1;border:0;background:transparent;font:inherit;font-size:15px;padding:0;cursor:pointer;margin-top:1px}'
    + '.cx-tw:focus-visible{outline:2px solid var(--cx-ac)}'
    + '.cx-tx{min-width:0;overflow-wrap:break-word}'
    + '.cx-dt{display:block;font-size:11.5px;font-weight:500;color:var(--cx-mu);margin-top:1px}'
    + '.cx-ch{display:inline-block;font-size:10.5px;font-weight:700;border-radius:999px;padding:0 7px;line-height:17px;margin-right:2px;vertical-align:1px;white-space:nowrap}'
    + '.cx-ch.az{background:color-mix(in srgb,var(--cx-az) 13%,transparent);color:var(--cx-az)}'
    + '.cx-ch.am{background:color-mix(in srgb,var(--cx-am) 16%,transparent);color:var(--cx-am)}'
    + '.cx-ch.rj{background:color-mix(in srgb,var(--cx-rj) 13%,transparent);color:var(--cx-rj)}'
    + '.cx-tb tr.cx-r td{font-size:12.5px;cursor:pointer}'
    + '.cx-tb tr.cx-r td:first-child{padding-left:34px}'
    + '.cx-tb tr.cx-r:hover td{background:var(--cx-alt)}'
    + '.cx-tb tr.cx-f td{font-size:12px;color:var(--cx-mu);background:var(--cx-alt)}'
    + '.cx-tb tr.cx-f td:first-child{padding-left:58px}'
    + '.cx-tb tr.cx-f td b{color:var(--cx-ink);font-weight:600}'
    + '.cx-tb tfoot td{position:sticky;bottom:0;z-index:2;background:var(--cx-nvs);font-weight:800;border-top:1px solid var(--cx-ln2);border-bottom:0}'
    + '.cx-tb tfoot td:first-child{z-index:3}'
    + '.cx-vacio{padding:36px 16px;text-align:center;color:var(--cx-mu)}'
    + '.cx-nota{font-size:12px;color:var(--cx-mu);line-height:1.45;margin:2px 0 14px;max-width:110ch}'
    // el celular: tarjetas en lugar de la tabla
    + '.cx-tarjetas{display:none}'
    + '.cx-ley{display:flex;flex-wrap:wrap;gap:4px 12px;font-size:12px;color:var(--cx-mu);margin:0 2px 8px}'
    + '.cx-t{background:var(--cx-sf);border:1px solid var(--cx-ln);border-radius:12px;margin-bottom:8px;overflow:hidden}'
    + '.cx-t>button{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 10px;width:100%;text-align:left;font:inherit;color:var(--cx-ink);background:transparent;border:0;padding:11px 12px;cursor:pointer}'
    + '.cx-tnm{font-weight:700;font-size:14px;line-height:1.3;overflow-wrap:break-word;min-width:0}'
    + '.cx-tmt{font-weight:750;font-size:15px;font-variant-numeric:tabular-nums;white-space:nowrap}'
    + '.cx-tdt{grid-column:1/-1;font-size:12px;color:var(--cx-mu)}'
    + '.cx-t .cx-mini{grid-column:1/-1;margin:4px 0 0}'
    + '.cx-t[data-open="true"]>button{background:var(--cx-nvs)}'
    + '.cx-td{padding:4px 12px 10px;border-top:1px solid var(--cx-ln)}'
    + '.cx-trs{display:flex;justify-content:space-between;gap:10px;font-weight:600;font-size:13px;margin-top:8px;overflow-wrap:anywhere}'
    + '.cx-trs span:last-child{white-space:nowrap;font-variant-numeric:tabular-nums}'
    + '.cx-tfa{display:flex;justify-content:space-between;gap:10px;font-size:12.5px;color:var(--cx-mu);padding:3px 0 3px 10px;border-left:2px solid var(--cx-ln)}'
    + '.cx-tfa span:last-child{white-space:nowrap;color:var(--cx-ink);font-variant-numeric:tabular-nums}'
    + '.cx-t.cx-ttot{background:var(--cx-nvs);padding:11px 12px;display:flex;justify-content:space-between;gap:10px;font-weight:800}'
    + '@media (max-width:640px){'
    + '.cx .ppl-per{flex:1 1 100%;display:flex;flex-wrap:wrap;gap:8px}'
    + '.cx .ppl-per .cx-seg{width:100%;flex-wrap:nowrap}.cx .ppl-per .cx-seg button{flex:1 1 0;min-width:0;padding:6px 6px;white-space:normal;line-height:1.2}.cx .ppl-per .cx-lb{display:none}'
    + '.cx-q{max-width:none;flex:1 1 100%}.cx-q input{font-size:16px}'
    + '.cx .cx-vista{display:none!important}'
    + '.cx-caja.cx-tabla{display:none}.cx-tarjetas{display:block}'
    + '}'
    // en la computadora la pantalla no se desliza: solo la tabla (como antes)
    + '@media (min-width:700px) and (min-height:500px){'
    + '.cx{flex:1 1 auto;min-height:0}'
    + '.cx-caja{flex:1 1 auto;min-height:180px;max-height:none}'
    + '.cx-pp,.cx-bar,.cx-nota{flex:none}'
    + '.cx-nota{margin-bottom:6px}'
    + '}'
    // la ventana del resumen (Inicio)
    + '.cx-dlg{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(10,18,32,.45)}'
    + '.cx-w{width:min(640px,100%);max-height:min(88dvh,820px);display:flex;flex-direction:column;background:var(--cx-sf);color:var(--cx-ink);border-radius:16px;'
    + 'box-shadow:0 20px 50px rgba(10,18,32,.35);border-top:5px solid var(--c);overflow:hidden;font-family:var(--f-body,Arial,sans-serif)}'
    + '.cx-hd{padding:16px 18px 12px;border-bottom:1px solid var(--cx-ln);flex:none}'
    + '.cx-dk{font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--cx-mu);font-weight:700}'
    + '.cx-dlg h2{margin:2px 0 0;font-family:var(--f-display,Arial,sans-serif);font-stretch:90%;font-size:28px;font-weight:750;color:var(--ci,var(--cx-ink));font-variant-numeric:tabular-nums}'
    + '.cx-hd p{margin:2px 0 0;font-size:13px;color:var(--cx-mu)}'
    + '.cx-bd{padding:12px 18px 6px;overflow:auto;flex:1 1 auto;-webkit-overflow-scrolling:touch}'
    + '.cx-dlg h3{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--cx-mu);margin:6px 0 8px;font-weight:700}'
    + '.cx-ed{display:grid;grid-template-columns:minmax(92px,auto) minmax(0,1fr) auto;gap:6px 10px;align-items:center;font-size:13px;margin-bottom:12px}'
    + '.cx-br{height:9px;border-radius:999px;background:var(--cx-alt);overflow:hidden}.cx-br i{display:block;height:100%;border-radius:999px}'
    + '.cx-emt{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}.cx-emt small{color:var(--cx-mu);margin-left:6px}'
    + '.cx-li{list-style:none;margin:0 0 8px;padding:0}'
    + '.cx-li li{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:2px 10px;align-items:center;padding:8px 2px;border-bottom:1px solid var(--cx-ln)}'
    + '.cx-li li:last-child{border-bottom:0}'
    + '.cx-lpt{width:9px;height:9px;border-radius:50%;background:var(--d,var(--cx-az))}'
    + '.cx-la{font-weight:600;font-size:13.5px;overflow-wrap:break-word;min-width:0}'
    + '.cx-lb2{grid-column:2/3;font-size:12px;color:var(--cx-mu)}'
    + '.cx-ln{grid-row:1/3;grid-column:3;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--d,var(--cx-ink))}'
    + '.cx-li li.cx-lmas{display:block;text-align:center;font-size:12.5px;color:var(--cx-mu)}'
    + '.cx-ft{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;padding:12px 18px;border-top:1px solid var(--cx-ln);flex:none}'
    + '.cx-ft button{font:inherit;font-size:14px;font-weight:600;min-height:40px;border-radius:10px;padding:0 16px;cursor:pointer;border:1px solid var(--cx-ln2);background:var(--cx-sf);color:var(--cx-ink)}'
    + '.cx-ft button.cx-pr{background:var(--cx-nv);border-color:var(--cx-nv);color:#fff}'
    + ':root[data-theme="dark"] .cx-ft button.cx-pr{background:#8FB0E8;border-color:#8FB0E8;color:#0D1320}'
    + '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .cx-ft button.cx-pr{background:#8FB0E8;border-color:#8FB0E8;color:#0D1320}}'
    + '@media (max-width:640px){.cx-dlg{padding:0;align-items:flex-end}.cx-w{width:100%;max-height:92dvh;border-radius:16px 16px 0 0}.cx-dlg h2{font-size:24px}'
    + '.cx-ft button{flex:1 1 auto}}';
  function ponCss() {
    if (document.getElementById('cx-css')) return;
    var st = document.createElement('style'); st.id = 'cx-css'; st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  var IC = {
    q: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'
  };
  // la barrita de antigüedad de un grupo (o de una pila)
  function mezcla(cel, tot) {
    if (!(tot > 0)) return '';
    var h = '';
    for (var i = 0; i < 6; i++) { var v = cel[i] || 0; if (v > 0) h += '<i style="width:' + (v / tot * 100).toFixed(2) + '%;background:var(--cx-e' + i + ')"></i>'; }
    return '<span class="cx-mini" aria-hidden="true">' + h + '</span>';
  }

  /* ---------------- la pantalla ---------------- */
  function pantalla(raiz, cfg) {
    cfg = cfg || {};
    ponCss();
    var CL = 'cx.' + (cfg.clave || 'cxc') + '.';
    var P = null;
    var S = { cia: '', pila: 'tot', iva: store.get(CL + 'iva') === 'sin' ? 'sin' : 'con', vista: store.get(CL + 'vista') === 'mes' ? 'mes' : 'edad',
              q: '', anio: [], mes: [], grp: [], sort: { k: 'tot', dir: -1 }, abiertos: {}, rsAbiertos: {}, todos: false };
    raiz.classList.add('cx');
    /* UX PROFASE (Héctor Daniel Nava, 5-nov-2026, 23:08: «que todos los menús y sub menús tengan el UX profase»): la barra
       común de js/pilas.js (buscar, la compañía, con o sin IVA, FILTROS, cómo se ve, Excel y «Más ▾» con «Abrir todos») y,
       abajo, las pilas comunes de «Tu trabajo» (las mismas cuentas de siempre). Los botones de siempre se mueven a la barra
       y siguen haciendo lo mismo (los clics van por la raíz). Sin js/pilas.js, la barra se queda como estaba. */
    raiz.innerHTML = '<div class="cx-bar"><label class="cx-q">' + IC.q + '<input type="search" placeholder="Buscar grupo, razón social, RFC o folio" aria-label="Buscar" autocomplete="off" spellcheck="false"></label>'
      + '<div class="cx-seg cx-cias" role="group" aria-label="Compañía"></div>'
      + '<div class="cx-seg cx-iva" role="group" aria-label="Montos"><button type="button" data-iva="con">Con IVA</button><button type="button" data-iva="sin">Sin IVA</button></div>'
      + '<div class="cx-fil"></div>'
      + '<div class="cx-seg cx-vista" role="group" aria-label="Columnas"><button type="button" data-vista="edad">Por antigüedad</button><button type="button" data-vista="mes">Por mes</button></div>'
      + '<button type="button" class="cx-btn cx-xl" data-excel>Excel</button><button type="button" class="cx-btn cx-todos">Abrir todos</button></div>'
      + '<div class="cx-pp"></div>'
      + '<div class="cx-caja cx-tabla"><table class="cx-tb"></table></div><div class="cx-tarjetas"></div><p class="cx-nota"></p>';
    var $ = function (s) { return raiz.querySelector(s); };
    var FB = null, BAR = null;
    function filtros() {
      if (FB || !window.PROFASE_FILTROS) return;
      var cfg = {
        grupos: [
          { t: 'Factura', campos: [
            { k: 'anio', t: 'Año de factura', tipo: 'varios', lista: true,
              opciones: function () { return anios().map(function (y) { return { v: String(y), t: String(y) }; }); },
              valor: function () { return S.anio; }, pon: function (v) { S.anio = v; } },
            { k: 'mes', t: 'Mes de factura', tipo: 'varios', lista: true,
              opciones: function () { return MESL.map(function (m, i) { return { v: String(i + 1), t: m.charAt(0).toUpperCase() + m.slice(1) }; }); },
              valor: function () { return S.mes; }, pon: function (v) { S.mes = v; } }] },
          { t: 'Cliente', campos: [
            { k: 'grp', t: 'Grupo', tipo: 'varios', buscar: true,
              opciones: function () { return gruposLista(); }, valor: function () { return S.grp; }, pon: function (v) { S.grp = v; } }] }],
        cambio: function () { pinta(); },
        limpiar: function () { S.anio = []; S.mes = []; S.grp = []; },
        resultados: function () { if (!P) return 'Ver'; var n = arbol(filas(), 'saldo', function () { return 0; }).length; return 'Ver ' + n + (n === 1 ? ' grupo' : ' grupos'); }
      };
      if (window.PROFASE_PILAS && PROFASE_PILAS.barra) {
        var q = $('.cx-q input'), lq = $('.cx-q'), fil = $('.cx-fil');
        BAR = PROFASE_PILAS.barra($('.cx-bar'), { caja: true, buscar: q, periodo: [$('.cx-cias'), $('.cx-iva')], filtros: cfg,
          botones: [$('.cx-vista'), $('.cx-xl')], mas: [[$('.cx-todos')]] });
        if (lq && lq.parentNode) lq.remove();
        if (fil && fil.parentNode) fil.remove();
        FB = BAR.f;
      } else { cfg.donde = $('.cx-fil'); FB = window.PROFASE_FILTROS.crea(cfg); }
    }
    function anios() { if (!P) return []; var y = {}; P.INV.forEach(function (o) { if (o.saldo > 0) y[o.y] = 1; }); return Object.keys(y).map(Number).sort(); }
    function gruposLista() {
      if (!P) return [];
      var g = {}; P.INV.forEach(function (o) { if (o.saldo > 0 && (!S.cia || o.cia === S.cia)) g[o.grp] = (g[o.grp] || 0) + 1; });
      return Object.keys(g).sort(function (a, b) { return a.localeCompare(b, 'es'); }).map(function (k) { return { v: k, t: k, n: g[k] }; });
    }
    // lo que pasa los filtros (compañía, año, mes, grupo y lo que se busca); sin la pila
    function pasa(o, conFecha) {
      if (S.cia && o.cia !== S.cia) return false;
      if (S.grp.length && S.grp.indexOf(o.grp) < 0) return false;
      if (conFecha && S.anio.length && S.anio.indexOf(String(o.y)) < 0) return false;
      if (conFecha && S.mes.length && S.mes.indexOf(String(o.m)) < 0) return false;
      if (S.q) { var t = norm(o.grp + ' ' + o.rs + ' ' + o.rfc + ' ' + o.folio); if (!S.q.split(/\s+/).every(function (w) { return t.indexOf(w) >= 0; })) return false; }
      return true;
    }
    function filas() { return P.INV.filter(function (o) { return o.saldo > 0 && pasa(o, true) && enPila(o, S.pila); }); }

    function pintaTop() {
      var c = $('.cx-cias');
      if (P.cias.length < 2) { c.hidden = true; S.cia = ''; }
      else {
        if (S.cia && P.cias.indexOf(S.cia) < 0) S.cia = '';
        c.hidden = false;
        c.innerHTML = '<span class="cx-lb">Compañía</span>' + [''].concat(P.cias).map(function (x) {
          return '<button type="button" data-cia="' + esc(x) + '" aria-pressed="' + (S.cia === x) + '">' + esc(x || 'Todas') + '</button>';
        }).join('');
      }
      raiz.querySelectorAll('[data-iva]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-iva') === S.iva)); });
      raiz.querySelectorAll('[data-vista]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-vista') === S.vista)); });
    }
    function pintaPilas() {
      var conIva = S.iva === 'con';
      var c = cuentas(P, function (o) { return o.saldo == null ? pasa(o, false) : pasa(o, true); });
      // sin IVA: las mismas facturas, sus montos ÷ 1.16 (si llevan IVA)
      if (!conIva) {
        c.tot = 0; c.ven = 0; c.ven2 = 0; c.ven3 = 0; c.curso = 0; c.cob = 0;
        P.INV.forEach(function (o) { if (!(o.saldo > 0) || !pasa(o, true)) return; c.tot += o.ssi; if (o.meses >= 2) { c.ven += o.ssi; if (o.meses === 2) c.ven2 += o.ssi; else c.ven3 += o.ssi; } else c.curso += o.ssi; });
        P.PAG.forEach(function (p) { if (p.fechaPago && String(p.fechaPago).slice(0, 7) === P.mes && pasa(p, false)) c.cob += p.psi; });
      }
      var mesTxt = MESL[+P.mes.slice(5, 7) - 1];
      var sub = conIva ? 'con IVA' : 'sin IVA';
      if (!P.conPagos && S.pila === 'cob') S.pila = 'tot';
      var pl = [
        { k: 'tot', t: PILAS.tot, n: c.nTot, txt: fm0(c.tot), d: ni(c.nTot) + (c.nTot === 1 ? ' factura' : ' facturas') + ' · ' + ni(c.nGrp) + (c.nGrp === 1 ? ' grupo' : ' grupos') + ' · ' + sub, tono: 'azul', on: S.pila === 'tot' },
        { k: 'ven', t: PILAS.ven, n: c.nVen, txt: fm0(c.ven), tono: c.ven3 > 0 ? 'rojo' : 'ambar', on: S.pila === 'ven',
          mini: [{ v: c.ven2, tono: 'ambar' }, { v: c.ven3, tono: 'rojo' }],
          d: c.ven > 0 ? '2 meses ' + fm0(c.ven2) + ' · 3 o más ' + fm0(c.ven3) : 'nada de meses anteriores' },
        { k: 'curso', t: PILAS.curso, n: c.nCurso, txt: fm0(c.curso), d: 'por vencer · ' + ni(c.nCurso) + (c.nCurso === 1 ? ' factura' : ' facturas'), tono: 'gris', on: S.pila === 'curso' }
      ];
      if (P.conPagos) pl.push({ k: 'cob', t: 'Cobrado en ' + mesTxt, n: c.nCob, txt: fm0(c.cob), d: ni(c.nCob) + (c.nCob === 1 ? ' pago' : ' pagos') + ' con fecha de ' + mesTxt, tono: 'verde', on: S.pila === 'cob' });
      if (!window.PROFASE_PILAS) return;
      PROFASE_PILAS.pinta($('.cx-pp'), {
        titulo: 'Tu trabajo · la cobranza', meta: (S.cia || (P.cias.length > 1 ? 'Todas las compañías' : '')) + (S.cia || P.cias.length > 1 ? ' · ' : '') + sub,
        pilas: pl,
        alPicar: function (k) { S.pila = S.pila === k && k !== 'tot' ? 'tot' : k; if (typeof S.sort.k === 'number') S.sort = { k: 'tot', dir: -1 }; pinta(); }
      });
    }
    function columnas(rows) {
      if (S.vista === 'edad') {
        var hay = {}; rows.forEach(function (o) { hay[o.edad] = 1; });
        var base = S.pila === 'ven' ? [1, 2, 3, 4, 5] : S.pila === 'curso' ? [0] : [0, 1, 2, 3, 4, 5];
        return base.filter(function (i) { return S.pila === 'tot' || hay[i]; }).map(function (i) { return { k: i, t: EDAD[i].t, d: 'var(--cx-e' + i + ')' }; });
      }
      var ms = {}; rows.forEach(function (o) { ms[o.ym] = 1; });
      return Object.keys(ms).map(Number).sort(function (a, b) { return a - b; }).map(function (ym) { return { k: ym, t: ymTxt(ym) }; });
    }
    function ordena(lista) {
      var s = S.sort, k = s.k, d = s.dir;
      return lista.sort(function (a, b) {
        if (k === 'n') return a.n.localeCompare(b.n, 'es') * d;
        var x = k === 'tot' ? a.tot : (a.cel[k] || 0), y = k === 'tot' ? b.tot : (b.cel[k] || 0);
        return (x - y) * d || a.n.localeCompare(b.n, 'es');
      });
    }
    function pintaTabla() {
      var campo = S.iva === 'con' ? 'saldo' : 'ssi';
      var rows = filas(), cols = columnas(rows);
      var col = S.vista === 'edad' ? function (o) { return o.edad; } : function (o) { return o.ym; };
      var gs = ordena(arbol(rows, campo, col));
      var total = 0, colTot = {};
      gs.forEach(function (g) { total += g.tot; cols.forEach(function (c) { colTot[c.k] = (colTot[c.k] || 0) + (g.cel[c.k] || 0); }); });
      var ar = function (k) { return S.sort.k === k ? '<span class="cx-ar">' + (S.sort.dir > 0 ? '▲' : '▼') + '</span>' : ''; };
      var h = '<thead><tr><th class="cx-thn" data-s="n" scope="col" aria-sort="' + (S.sort.k === 'n' ? (S.sort.dir > 0 ? 'ascending' : 'descending') : 'none') + '">Grupo' + ar('n') + '</th>'
        + '<th data-s="tot" scope="col">Total' + ar('tot') + '</th>'
        + cols.map(function (c) { return '<th data-s="' + c.k + '" scope="col">' + (c.d ? '<span class="cx-dot" style="--d:' + c.d + '"></span>' : '') + esc(c.t) + ar(c.k) + '</th>'; }).join('') + '</tr></thead><tbody>';
      if (!gs.length) h += '<tr><td colspan="' + (cols.length + 2) + '" class="cx-vacio">' + (P.INV.some(function (o) { return o.saldo > 0; }) ? 'Nada con estos filtros.' : 'No hay facturas con saldo.') + '</td></tr>';
      var celdas = function (cel) { return cols.map(function (c) { var v = cel[c.k]; return v ? '<td>' + n2(v) + '</td>' : '<td class="cx-vac">·</td>'; }).join(''); };
      gs.forEach(function (g) {
        var ab = !!S.abiertos[g.n] || S.todos;
        var rss = Object.keys(g.rs).map(function (k) { return g.rs[k]; }).sort(function (a, b) { return b.tot - a.tot; });
        var info = '<span class="cx-ch ' + claseViejo(g.viejo) + '">' + desde(g) + '</span> ' + ni(g.nf) + (g.nf === 1 ? ' factura' : ' facturas')
          + (rss.length > 1 ? ' · ' + rss.length + ' razones sociales' : '');
        h += '<tr class="cx-g' + (ab ? ' abierto' : '') + '" data-g="' + esc(g.n) + '"><td><div class="cx-nm"><button type="button" class="cx-tw" aria-expanded="' + ab + '" aria-label="' + (ab ? 'Cerrar ' : 'Abrir ') + esc(g.n) + '">' + (ab ? '−' : '+') + '</button>'
          + '<span class="cx-tx">' + esc(g.n) + '<span class="cx-dt">' + info + '</span></span></div></td>'
          + '<td class="cx-tt">' + n2(g.tot) + '</td>' + celdas(g.cel) + '</tr>';
        if (!ab) return;
        rss.forEach(function (r) {
          var kr = g.n + '\u0001' + r.n, abr = !!S.rsAbiertos[kr];
          h += '<tr class="cx-r" data-r="' + esc(kr) + '"><td><div class="cx-nm"><button type="button" class="cx-tw" aria-expanded="' + abr + '" aria-label="' + (abr ? 'Cerrar las facturas de ' : 'Ver las facturas de ') + esc(r.n) + '">' + (abr ? '−' : '+') + '</button>'
            + '<span class="cx-tx">' + esc(r.n) + '<span class="cx-dt">' + esc(r.rfc) + (r.rfc ? ' · ' : '') + r.fac.length + (r.fac.length === 1 ? ' factura' : ' facturas')
            + (P.cias.length > 1 && !S.cia ? ' · ' + ciasDe(r.fac).map(esc).join(', ') : '') + '</span></span></div></td>'
            + '<td class="cx-tt">' + n2(r.tot) + '</td>' + celdas(r.cel) + '</tr>';
          if (!abr) return;
          r.fac.slice().sort(function (a, b) { return String(a.fecha).localeCompare(String(b.fecha)); }).forEach(function (o) {
            var cel = {}; cel[col(o)] = o[campo];
            h += '<tr class="cx-f"><td>Folio <b>' + esc(o.folio) + '</b> · ' + fdh(o.fecha) + (o.ef ? ' · sin IVA (efectivo)' : '') + (P.cias.length > 1 && !S.cia ? ' · ' + esc(o.cia) : '') + '</td>'
              + '<td>' + n2(o[campo]) + '</td>' + celdas(cel) + '</tr>';
          });
        });
      });
      h += '</tbody>';
      if (gs.length) h += '<tfoot><tr><td>Total · ' + ni(gs.length) + (gs.length === 1 ? ' grupo' : ' grupos') + '</td><td>' + n2(total) + '</td>' + cols.map(function (c) { return '<td>' + n2(colTot[c.k]) + '</td>'; }).join('') + '</tr></tfoot>';
      $('.cx-tb').innerHTML = h;
      $('.cx-todos').textContent = S.todos ? 'Cerrar todos' : 'Abrir todos';
      $('.cx-todos').hidden = !gs.length;
      pintaTarjetas(gs, total, campo, col);
    }
    // en el celular: una tarjeta por grupo, con su barrita de antigüedad
    function pintaTarjetas(gs, total, campo, col) {
      var edad = function (o) { return o.edad; };
      var h = '<div class="cx-ley">' + [0, 1, 2, 3, 4, 5].filter(function (i) { return S.pila === 'tot' || (S.pila === 'ven' ? i > 0 : i === 0); })
        .map(function (i) { return '<span class="cx-l"><i style="background:var(--cx-e' + i + ')"></i>' + EDAD[i].t + '</span>'; }).join('') + '</div>';
      if (!gs.length) h += '<div class="cx-t"><p class="cx-vacio">Nada con estos filtros.</p></div>';
      gs.forEach(function (g) {
        var ab = !!S.abiertos[g.n] || S.todos, cel = {};
        Object.keys(g.rs).forEach(function (k) { g.rs[k].fac.forEach(function (o) { cel[edad(o)] = (cel[edad(o)] || 0) + o[campo]; }); });
        h += '<div class="cx-t" data-open="' + ab + '"><button type="button" data-g="' + esc(g.n) + '" aria-expanded="' + ab + '"><span class="cx-tnm">' + esc(g.n) + '</span><span class="cx-tmt">' + fm2(g.tot) + '</span>'
          + '<span class="cx-tdt">' + ni(g.nf) + (g.nf === 1 ? ' factura' : ' facturas') + ' <span class="cx-ch ' + claseViejo(g.viejo) + '">' + desde(g) + '</span></span>' + mezcla(cel, g.tot) + '</button>';
        if (ab) {
          h += '<div class="cx-td">';
          Object.keys(g.rs).map(function (k) { return g.rs[k]; }).sort(function (a, b) { return b.tot - a.tot; }).forEach(function (r) {
            h += '<div class="cx-trs"><span>' + esc(r.n) + '</span><span>' + fm2(r.tot) + '</span></div>';
            r.fac.slice().sort(function (a, b) { return String(a.fecha).localeCompare(String(b.fecha)); }).forEach(function (o) {
              h += '<div class="cx-tfa"><span>Folio ' + esc(o.folio) + ' · ' + fdh(o.fecha) + ' <span class="cx-ch ' + claseViejo(o.meses) + '">' + EDAD[o.edad].t + '</span></span><span>' + fm2(o[campo]) + '</span></div>';
            });
          });
          h += '</div>';
        }
        h += '</div>';
      });
      if (gs.length) h += '<div class="cx-t cx-ttot"><span>Total · ' + ni(gs.length) + (gs.length === 1 ? ' grupo' : ' grupos') + '</span><span>' + fm2(total) + '</span></div>';
      $('.cx-tarjetas').innerHTML = h;
    }
    // «Cobrado en …»: los pagos del mes, en lugar de los saldos
    function pintaCobrado() {
      var conIva = S.iva === 'con', ps = P.PAG.filter(function (p) { return p.fechaPago && String(p.fechaPago).slice(0, 7) === P.mes && pasa(p, false); })
        .sort(function (a, b) { return String(b.fechaPago).localeCompare(String(a.fechaPago)) || a.grp.localeCompare(b.grp, 'es'); });
      var dos = P.cias.length > 1 && !S.cia, tot = 0;
      var h = '<thead><tr><th class="cx-thn" scope="col">Grupo y razón social</th><th class="cx-thn" scope="col">Fecha de pago</th><th class="cx-thn" scope="col">Folio</th>' + (dos ? '<th class="cx-thn" scope="col">Compañía</th>' : '') + '<th scope="col">Pago</th></tr></thead><tbody>';
      if (!ps.length) h += '<tr><td colspan="' + (dos ? 5 : 4) + '" class="cx-vacio">Todavía no hay pagos con fecha de este mes.</td></tr>';
      var t = '';
      ps.forEach(function (p) {
        var v = conIva ? p.pago : p.psi; tot += v;
        h += '<tr class="cx-g"><td><span class="cx-tx">' + esc(p.grp) + '<span class="cx-dt">' + esc(p.rs) + '</span></span></td><td style="text-align:left">' + fdh(p.fechaPago) + '</td><td style="text-align:left">' + esc(p.folio) + '</td>'
          + (dos ? '<td style="text-align:left">' + esc(p.cia) + '</td>' : '') + '<td class="cx-tt">' + n2(v) + '</td></tr>';
        t += '<div class="cx-t"><button type="button" tabindex="-1"><span class="cx-tnm">' + esc(p.grp) + '</span><span class="cx-tmt">' + fm2(v) + '</span><span class="cx-tdt">' + esc(p.rs) + ' · folio ' + esc(p.folio) + ' · ' + fdh(p.fechaPago) + '</span></button></div>';
      });
      h += '</tbody>';
      if (ps.length) {
        h += '<tfoot><tr><td>Total · ' + ni(ps.length) + (ps.length === 1 ? ' pago' : ' pagos') + '</td><td></td><td></td>' + (dos ? '<td></td>' : '') + '<td>' + n2(tot) + '</td></tr></tfoot>';
        t += '<div class="cx-t cx-ttot"><span>Total · ' + ni(ps.length) + (ps.length === 1 ? ' pago' : ' pagos') + '</span><span>' + fm2(tot) + '</span></div>';
      }
      $('.cx-tb').innerHTML = h;
      $('.cx-tarjetas').innerHTML = t || '<div class="cx-t"><p class="cx-vacio">Todavía no hay pagos con fecha de este mes.</p></div>';
      $('.cx-todos').hidden = true;
    }
    function pintaNota() {
      var n = 'Vencido: facturas con saldo de meses anteriores (amarillo, 2 meses; rojo, 3 o más); mes en curso: las de este mes, por vencer. '
        + 'Sin IVA: el saldo ÷ 1.16 (si la factura no lleva IVA, igual).';
      var af = P.afavor.filter(function (o) { return !S.cia || o.cia === S.cia; });
      if (af.length) {
        var s = af.reduce(function (a, o) { return a - o.saldo; }, 0);
        n += ' Aparte, ' + fm2(s) + ' a favor de clientes en ' + af.length + (af.length === 1 ? ' factura' : ' facturas') + ' (pagaron de más); no se restan aquí.';
      }
      $('.cx-nota').textContent = n;
    }
    function pinta() {
      if (!P) return;
      pintaTop(); pintaPilas();
      if (FB) FB.pinta();
      $('.cx-vista').hidden = S.pila === 'cob';
      if (S.pila === 'cob') pintaCobrado(); else pintaTabla();
      pintaNota();
    }
    // Excel (y su PDF, que pone js/marca.js al lado) de lo que se ve: con los mismos filtros, la pila, con o sin IVA y la vista
    function dia(t) { var x = String(t || '').slice(0, 10).split('-'); return x.length === 3 ? new Date(Date.UTC(+x[0], +x[1] - 1, +x[2])) : null; }
    function queSeVe() {
      var t = [S.cia || (P.cias.length > 1 ? 'Todas las compañías' : ''), S.pila === 'cob' ? 'Cobrado en ' + MESL[+P.mes.slice(5, 7) - 1] : PILAS[S.pila],
        S.iva === 'con' ? 'con IVA' : 'sin IVA', S.pila === 'cob' ? '' : (S.vista === 'edad' ? 'por antigüedad' : 'por mes')];
      if (S.anio.length) t.push('año ' + S.anio.join(', '));
      if (S.mes.length) t.push('mes ' + S.mes.map(function (m) { return MES[+m - 1]; }).join(', '));
      if (S.grp.length) t.push(S.grp.length === 1 ? 'grupo ' + S.grp[0] : S.grp.length + ' grupos');
      var q = $('.cx-q input'); if (q && q.value.trim()) t.push('buscando «' + q.value.trim() + '»');
      return t.filter(Boolean).join(' · ');
    }
    async function excel(btn) {
      var MK = window.PROFASE_MARCA; if (!MK || !P) return;
      btn.disabled = true;
      try {
        var EX = await MK.excelJS(), C = MK.colores, PESOS = '#,##0.00', FECHA = 'dd-mmm-yyyy';
        var hoy = new Date(), cuando = hoy.toLocaleString('es-MX', { timeZone: 'America/Monterrey', dateStyle: 'medium', timeStyle: 'short' });
        var titulo = 'Cobranza' + (S.cia ? ' · ' + S.cia : '');
        var wb = MK.libro(EX, titulo);
        var hoja = function (nombre, cols, filas, total, lineas) {
          var ws = wb.addWorksheet(nombre);
          ws.columns = cols.map(function (c) { return { width: c.w }; });
          var g = MK.encabezado(wb, ws, cols.length, { titulo: titulo + ' · ' + nombre, lineas: [queSeVe()].concat(lineas || [], ['Exportado el ' + cuando]) });
          cols.forEach(function (c, i) { ws.getCell(g, i + 1).value = c.h; });
          var der = []; cols.forEach(function (c, i) { if (c.f === PESOS || c.n) der.push(i + 1); });
          MK.cabecera(ws, g, 1, cols.length, { derecha: der });
          filas.forEach(function (f, k) {
            var r = ws.getRow(g + 1 + k);
            r.values = cols.map(function (c) { return c.v(f); });
            cols.forEach(function (c, i) { if (c.f) r.getCell(i + 1).numFmt = c.f; });
            if (f.__neg) for (var i = 1; i <= cols.length; i++) r.getCell(i).font = { name: MK.fuente, size: 10, bold: true, color: { argb: C.tinta } };
          });
          var ft = g + 1 + filas.length, rt = ws.getRow(ft);
          cols.forEach(function (c, i) { var v = total(c, i); if (v != null) { rt.getCell(i + 1).value = v; if (c.f) rt.getCell(i + 1).numFmt = c.f; } });
          MK.cuerpo(ws, g + 1, ft, 1, cols.length);
          filas.forEach(function (f, k) { if (f.__neg) for (var i = 1; i <= cols.length; i++) ws.getRow(g + 1 + k).getCell(i).font = { name: MK.fuente, size: 10, bold: true, color: { argb: C.tinta } }; });
          for (var c = 1; c <= cols.length; c++) { var x = rt.getCell(c); x.font = { name: MK.fuente, size: 10, bold: true, color: { argb: C.tinta } }; x.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: C.azulClaro } }; }
          if (filas.length) ws.autoFilter = { from: { row: g, column: 1 }, to: { row: g + filas.length, column: cols.length } };
          ws.views = [{ state: 'frozen', ySplit: g, showGridLines: false }];
          MK.impresion(ws, { repetir: g });
        };
        var dos = P.cias.length > 1 && !S.cia, suma = function (lista, k) { return lista.reduce(function (a, x) { return a + (+x[k] || 0); }, 0); };
        if (S.pila === 'cob') {
          var ps = P.PAG.filter(function (p) { return p.fechaPago && String(p.fechaPago).slice(0, 7) === P.mes && pasa(p, false); })
            .sort(function (a, b) { return String(a.fechaPago).localeCompare(String(b.fechaPago)) || a.grp.localeCompare(b.grp, 'es'); });
          var cp = [{ h: 'Fecha de pago', w: 14, f: FECHA, v: function (p) { return dia(p.fechaPago); } }, { h: 'Grupo', w: 30, v: function (p) { return p.grp; } },
            { h: 'Razón social', w: 40, v: function (p) { return p.rs; } }, { h: 'RFC', w: 15, v: function (p) { return p.rfc; } }]
            .concat(dos ? [{ h: 'Compañía', w: 14, v: function (p) { return p.cia; } }] : [])
            .concat([{ h: 'Folio', w: 10, v: function (p) { return p.folio; } }, { h: 'Fecha de factura', w: 14, f: FECHA, v: function (p) { return dia(p.fecha); } },
              { h: 'Pago con IVA', w: 15, f: PESOS, k: 'pago', v: function (p) { return p.pago; } }, { h: 'Pago sin IVA', w: 15, f: PESOS, k: 'psi', v: function (p) { return p.psi; } }]);
          hoja('Cobrado en ' + MESL[+P.mes.slice(5, 7) - 1], cp, ps, function (c, i) { return i === 0 ? 'TOTAL · ' + ps.length + (ps.length === 1 ? ' pago' : ' pagos') : c.k ? suma(ps, c.k) : null; });
        } else {
          var campo = S.iva === 'con' ? 'saldo' : 'ssi', rows = filas(), cols = columnas(rows);
          var col = S.vista === 'edad' ? function (o) { return o.edad; } : function (o) { return o.ym; };
          var gs = ordena(arbol(rows, campo, col)), lista = [];
          gs.forEach(function (g) {
            lista.push({ __neg: true, g: g.n, rs: '', nf: g.nf, tot: g.tot, cel: g.cel, desde: desde(g).replace('desde ', '') });
            Object.keys(g.rs).map(function (k) { return g.rs[k]; }).sort(function (a, b) { return b.tot - a.tot; }).forEach(function (r) {
              lista.push({ g: g.n, rs: r.n, rfc: r.rfc, nf: r.fac.length, tot: r.tot, cel: r.cel });
            });
          });
          var cg = [{ h: 'Grupo', w: 30, v: function (x) { return x.g; } }, { h: 'Razón social', w: 40, v: function (x) { return x.rs; } },
            { h: 'RFC', w: 15, v: function (x) { return x.rfc || ''; } }, { h: 'Facturas', w: 10, n: 1, v: function (x) { return x.nf; } },
            { h: 'Desde', w: 10, v: function (x) { return x.desde || ''; } }, { h: 'Total', w: 16, f: PESOS, v: function (x) { return x.tot; } }]
            .concat(cols.map(function (c) { return { h: c.t, w: 14, f: PESOS, ck: c.k, v: function (x) { return x.cel[c.k] || null; } }; }));
          var tg = function (c, i) {
            if (i === 0) return 'TOTAL · ' + gs.length + (gs.length === 1 ? ' grupo' : ' grupos');
            if (c.h === 'Facturas') return rows.length;
            if (c.h === 'Total') return gs.reduce(function (a, g) { return a + g.tot; }, 0);
            if (c.ck != null) return gs.reduce(function (a, g) { return a + (g.cel[c.ck] || 0); }, 0);
            return null;
          };
          hoja('Por grupo', cg, lista, tg, [S.iva === 'con' ? 'Saldos con IVA' : 'Saldos sin IVA (el saldo ÷ 1.16; si la factura no lleva IVA, igual)']);
          var fs = rows.slice().sort(function (a, b) { return a.grp.localeCompare(b.grp, 'es') || a.rs.localeCompare(b.rs, 'es') || String(a.fecha).localeCompare(String(b.fecha)); });
          var cf = [{ h: 'Grupo', w: 30, v: function (o) { return o.grp; } }, { h: 'Razón social', w: 40, v: function (o) { return o.rs; } },
            { h: 'RFC', w: 15, v: function (o) { return o.rfc || ''; } }]
            .concat(dos ? [{ h: 'Compañía', w: 14, v: function (o) { return o.cia; } }] : [])
            .concat([{ h: 'Folio', w: 10, v: function (o) { return o.folio; } }, { h: 'Fecha', w: 14, f: FECHA, v: function (o) { return dia(o.fecha); } },
              { h: 'Antigüedad', w: 14, v: function (o) { return EDAD[o.edad].t; } }, { h: 'Total factura', w: 15, f: PESOS, k: 'tot', v: function (o) { return +o.tot || 0; } },
              { h: 'Pagado', w: 15, f: PESOS, k: 'pago', v: function (o) { return +o.pago || 0; } }, { h: 'Saldo con IVA', w: 15, f: PESOS, k: 'saldo', v: function (o) { return o.saldo; } },
              { h: 'Saldo sin IVA', w: 15, f: PESOS, k: 'ssi', v: function (o) { return o.ssi; } }]);
          hoja('Facturas', cf, fs, function (c, i) { return i === 0 ? 'TOTAL · ' + fs.length + (fs.length === 1 ? ' factura' : ' facturas') : c.k ? suma(fs, c.k) : null; });
        }
        var p2 = function (n) { return String(n).padStart(2, '0'); };
        await MK.guardar(wb, 'Cobranza' + (S.cia ? ' ' + S.cia : '') + ' ' + hoy.getFullYear() + '-' + p2(hoy.getMonth() + 1) + '-' + p2(hoy.getDate()) + '.xlsx');
      } catch (err) {
        try { if (window.PORTAL && window.PORTAL.toast) window.PORTAL.toast('No se pudo bajar el archivo. Vuelve a intentarlo.'); } catch (e) { /* nada */ }
      } finally { btn.disabled = false; }
    }

    // los clics
    raiz.addEventListener('click', function (e) {
      var b;
      if ((b = e.target.closest('.cx-xl:not([data-pdf-de])'))) { excel(b); return; }
      if ((b = e.target.closest('[data-cia]'))) { S.cia = b.getAttribute('data-cia'); S.grp = []; pinta(); return; }
      if ((b = e.target.closest('[data-iva]'))) { S.iva = b.getAttribute('data-iva'); store.set(CL + 'iva', S.iva); pinta(); return; }
      if ((b = e.target.closest('[data-vista]'))) { S.vista = b.getAttribute('data-vista'); store.set(CL + 'vista', S.vista); if (typeof S.sort.k === 'number') S.sort = { k: 'tot', dir: -1 }; pinta(); return; }
      if ((b = e.target.closest('.cx-todos'))) { S.todos = !S.todos; if (!S.todos) S.abiertos = {}; pinta(); return; }
      if ((b = e.target.closest('th[data-s]'))) {
        var s = b.getAttribute('data-s'), k2 = s === 'n' || s === 'tot' ? s : +s;
        S.sort = S.sort.k === k2 ? { k: k2, dir: -S.sort.dir } : { k: k2, dir: k2 === 'n' ? 1 : -1 }; pinta(); return;
      }
      if ((b = e.target.closest('tr.cx-r'))) { var kr = b.getAttribute('data-r'); S.rsAbiertos[kr] = !S.rsAbiertos[kr]; pinta(); return; }
      if ((b = e.target.closest('tr.cx-g[data-g], .cx-t>button[data-g]'))) {
        var g = b.getAttribute('data-g');
        if (S.todos) { S.todos = false; S.abiertos = {}; gruposVisibles().forEach(function (n) { S.abiertos[n] = true; }); }
        S.abiertos[g] = !S.abiertos[g]; pinta();
      }
    });
    function gruposVisibles() { var v = {}; filas().forEach(function (o) { v[o.grp] = 1; }); return Object.keys(v); }
    // si la Cobranza deja de verse (otra sección del menú), la hoja de FILTROS del celular, que va directo en la página,
    // se cierra con ella: no se queda encima de la otra pantalla
    function seEsconde() { if (FB && !raiz.getClientRects().length) { try { FB.cierra(); } catch (e) { /* nada */ } } }
    try { new MutationObserver(seEsconde).observe(document.body, { attributes: true, attributeFilter: ['data-view', 'class', 'hidden'] }); } catch (e) { /* nada */ }
    addEventListener('hashchange', seEsconde);
    var tq = 0;
    $('.cx-q input').addEventListener('input', function (e) { clearTimeout(tq); var v = e.target.value; tq = setTimeout(function () { S.q = norm(v).trim(); pinta(); }, 120); });

    return {
      pon: function (D) { var x = prepara(D); if (!x) return false; P = x; filtros(); pinta(); return true; },
      pinta: pinta,
      // desde el Inicio: «cia:<compañía>|pila:<tot|ven|curso|cob>|grp:<grupo>»
      abre: function (x) {
        var o = {}; String(x || '').split('|').forEach(function (p) { var i = p.indexOf(':'); if (i > 0) o[p.slice(0, i)] = p.slice(i + 1); });
        if (o.cia != null) S.cia = o.cia;
        if (o.pila && PILAS[o.pila]) S.pila = o.pila;
        S.anio = []; S.mes = []; S.q = ''; var qi = $('.cx-q input'); if (qi) qi.value = '';
        S.grp = o.grp ? [o.grp] : []; S.abiertos = {}; if (o.grp) S.abiertos[o.grp] = true;
        pinta(); return true;
      }
    };
  }

  /* ---------------- la ventana del resumen de una pila (Inicio) ---------------- */
  function resumen(P, op) {
    if (!P) return null;
    ponCss();
    op = op || {};
    var cia = op.cia || '', pila = PILAS[op.pila] ? op.pila : 'tot';
    var f = function (o) { return !cia || o.cia === cia; };
    var c = cuentas(P, f), mesTxt = MESL[+P.mes.slice(5, 7) - 1];
    var colr = { tot: 'var(--cx-nv)', ven: c.ven3 > 0 ? 'var(--cx-rj)' : 'var(--cx-am)', curso: 'var(--cx-az)', cob: 'var(--cx-ok)' }[pila];
    var titulo = (pila === 'cob' ? 'Cobrado en ' + mesTxt : PILAS[pila]) + (cia ? ' · ' + cia : '');
    var v = { tot: c.tot, ven: c.ven, curso: c.curso, cob: c.cob }[pila];
    var sub = pila === 'tot' ? ni(c.nTot) + ' facturas de ' + ni(c.nGrp) + ' grupos, con IVA'
      : pila === 'ven' ? ni(c.nVen) + ' facturas de meses anteriores, de ' + ni(c.nGrpVen) + ' grupos'
      : pila === 'curso' ? ni(c.nCurso) + ' facturas de este mes, por vencer'
      : ni(c.nCob) + (c.nCob === 1 ? ' pago' : ' pagos') + ' con fecha de ' + mesTxt;
    var bd = '';
    if (pila !== 'cob') {
      var rows = P.INV.filter(function (o) { return o.saldo > 0 && f(o) && enPila(o, pila); });
      var ed = {}; rows.forEach(function (o) { ed[o.edad] = (ed[o.edad] || 0) + o.saldo; });
      if (pila !== 'curso') {
        bd += '<h3>Por antigüedad</h3><div class="cx-ed">';
        (pila === 'ven' ? [1, 2, 3, 4, 5] : [0, 1, 2, 3, 4, 5]).forEach(function (i) {
          var x = ed[i] || 0;
          if (!(x > 0)) return;
          bd += '<span>' + EDAD[i].t + '</span><span class="cx-br"><i style="width:' + (v > 0 ? (x / v * 100).toFixed(2) : 0) + '%;background:var(--cx-e' + i + ')"></i></span>'
            + '<span class="cx-emt">' + fm0(x) + '<small>' + (v > 0 ? Math.round(x / v * 100) : 0) + '%</small></span>';
        });
        bd += '</div>';
      }
      var gs = arbol(rows, 'saldo', function (o) { return o.edad; }).sort(function (a, b) { return b.tot - a.tot; });
      bd += '<h3>' + (pila === 'ven' ? 'Quién debe de meses anteriores' : pila === 'curso' ? 'A quién se le facturó este mes' : 'Quién debe') + ' (' + gs.length + ')</h3><ul class="cx-li">';
      gs.slice(0, 40).forEach(function (g) {
        var d = 'var(--cx-' + claseViejo(g.viejo) + ')';
        bd += '<li style="--d:' + (pila === 'curso' ? 'var(--cx-az)' : d) + '"><span class="cx-lpt"></span><span class="cx-la">' + esc(g.n) + '</span><span class="cx-ln">' + fm0(g.tot) + '</span>'
          + '<span class="cx-lb2">' + ni(g.nf) + (g.nf === 1 ? ' factura' : ' facturas') + (pila === 'curso' ? '' : ' · la más vieja es de hace ' + g.viejo + (g.viejo === 1 ? ' mes' : ' meses')) + '</span></li>';
      });
      if (gs.length > 40) bd += '<li class="cx-lmas">Y ' + (gs.length - 40) + ' grupos más en Cobranza.</li>';
      if (!gs.length) bd += '<li class="cx-lmas">No hay facturas aquí.</li>';
      bd += '</ul>';
    } else {
      var ps = P.PAG.filter(function (p) { return p.fechaPago && String(p.fechaPago).slice(0, 7) === P.mes && f(p); });
      var pg = {}, lista = [];
      ps.forEach(function (p) { var g = pg[p.grp]; if (!g) { g = pg[p.grp] = { n: p.grp, tot: 0, np: 0, ult: '' }; lista.push(g); } g.tot += p.pago; g.np++; if (String(p.fechaPago) > g.ult) g.ult = String(p.fechaPago); });
      lista.sort(function (a, b) { return b.tot - a.tot; });
      bd += '<h3>Quién pagó (' + lista.length + ')</h3><ul class="cx-li">';
      lista.slice(0, 40).forEach(function (g) {
        bd += '<li style="--d:var(--cx-ok)"><span class="cx-lpt"></span><span class="cx-la">' + esc(g.n) + '</span><span class="cx-ln">' + fm0(g.tot) + '</span>'
          + '<span class="cx-lb2">' + g.np + (g.np === 1 ? ' pago' : ' pagos') + ' · el último el ' + fdh(g.ult) + '</span></li>';
      });
      if (lista.length > 40) bd += '<li class="cx-lmas">Y ' + (lista.length - 40) + ' grupos más en Cobranza.</li>';
      if (!lista.length) bd += '<li class="cx-lmas">Todavía no hay pagos con fecha de este mes.</li>';
      bd += '</ul>';
    }
    var cierra = null;
    var ov = document.createElement('div');
    ov.className = 'cx-dlg';
    ov.innerHTML = '<div class="cx-w" role="dialog" aria-modal="true" aria-labelledby="cx-dlg-h" style="--c:' + colr + ';--ci:' + (pila === 'tot' || pila === 'curso' ? 'var(--cx-ink)' : colr) + '">'
      + '<div class="cx-hd"><div class="cx-dk" id="cx-dlg-h">' + esc(titulo) + '</div><h2>' + fm0(v) + '</h2><p>' + sub + '</p></div>'
      + '<div class="cx-bd">' + bd + '</div>'
      + '<div class="cx-ft"><button type="button" data-x="cerrar">Cerrar</button>' + (op.ver ? '<button type="button" class="cx-pr" data-x="ver">Ver en Cobranza</button>' : '') + '</div></div>';
    document.body.appendChild(ov);
    var antes = document.activeElement;
    function tecla(e) { if (e.key === 'Escape') { e.preventDefault(); cierra(); } }
    cierra = function () { document.removeEventListener('keydown', tecla, true); ov.remove(); try { if (antes && antes.focus) antes.focus(); } catch (e) { /* nada */ } };
    document.addEventListener('keydown', tecla, true);
    ov.addEventListener('click', function (e) {
      if (e.target === ov) { cierra(); return; }
      var b = e.target.closest('[data-x]'); if (!b) return;
      var x = b.getAttribute('data-x');
      cierra();
      if (x === 'ver' && op.ver) op.ver('cia:' + cia + '|pila:' + pila);
    });
    var pr = ov.querySelector('.cx-pr') || ov.querySelector('[data-x]'); if (pr) pr.focus();
    return { cierra: cierra };
  }

  window.PROFASE_CXC = { prepara: prepara, cuentas: cuentas, pantalla: pantalla, resumen: resumen };
})();
