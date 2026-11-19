/* js/opinion-seg.js · El seguimiento de la opinión de cumplimiento negativa (portal/sql/432_centauro_opinion_seguimiento.sql;
   Héctor Daniel Nava, 18-nov-2026: «cómo me puedes ayudar tú para ver que si efectivamente Frank haya enviado y se haya aclarado
   eso… al cuarto día hábil»; «Sí, así es a todo»).
   Una sola pieza para Centauro › Declaraciones y la tarea «Opinion de Cumplimiento» del Panel de trabajo:
   · enseña el caso: desde cuándo salió negativa, qué se hizo (y quién lo registró), el acuse, qué ve Centauro en el SAT de los
     meses que faltaban, cómo salieron las revisiones y cuándo la vuelve a pedir el CRM;
   · y, a quien atiende la opinión (la base lo decide: sat_decl_opi_puedo; nunca alguien de solo consulta), la ventana para
     registrar qué se hizo con el acuse: la página saca el texto del PDF con el PDF.js del portal y la base lee de ahí si es del
     cliente; con el número que da la base, el acuse se sube a la cubeta «expedientes» y se da por listo.
   Solo llama sat_decl_opi_atiende y sat_decl_opi_doc_listo, y solo sube a «expedientes» (construir.py lo revisa). */
(function () {
  'use strict';
  if (window.PROFASE_OPI) return;

  var CSS = '.opis{margin-top:10px;border:1px solid var(--line);border-radius:12px;padding:12px 14px;background:var(--surface);overflow-wrap:anywhere}'
    + '.opis-t{display:flex;flex-wrap:wrap;align-items:center;gap:8px;font-weight:700;margin-bottom:6px}'
    + '.opis-chip{display:inline-flex;align-items:center;border-radius:999px;padding:2px 10px;font-size:12px;font-weight:700;border:1px solid var(--line)}'
    + '.opis-chip.ab{background:var(--amber-soft);color:var(--amber)}.opis-chip.ok{background:var(--ok-soft);color:var(--ok)}'
    + '.opis-r{margin:4px 0;font-size:13.5px;line-height:1.45}.opis-r b{font-weight:700}'
    + '.opis-mut{color:var(--muted);font-size:12.5px}.opis-mal{color:var(--red)}.opis-bien{color:var(--ok)}'
    + '.opis ul{margin:2px 0 4px 18px;padding:0}.opis li{margin:1px 0}'
    + '.opis-acc{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}'
    + '.opis-b1,.opis-b2{display:inline-flex;align-items:center;justify-content:center;border-radius:10px;padding:8px 14px;font:inherit;font-size:13px;font-weight:600;cursor:pointer;min-height:38px}'
    + '.opis-b1{border:1px solid var(--navy);background:var(--navy);color:var(--navy-ink)}'
    + '.opis-b2{border:1px solid var(--line-strong);background:var(--surface);color:var(--ink)}'
    + '.opis-b1[disabled],.opis-b2[disabled]{opacity:.5;cursor:not-allowed}'
    + '.opis-velo{position:fixed;inset:0;z-index:300;background:rgba(10,18,32,.55);display:flex;align-items:center;justify-content:center;padding:max(12px,env(safe-area-inset-top)) 10px max(12px,env(safe-area-inset-bottom))}'
    + '.opis-v{background:var(--surface);color:var(--ink);border:1px solid var(--line);border-radius:14px;width:min(560px,100%);max-height:100%;display:flex;flex-direction:column;box-shadow:0 18px 50px rgba(0,0,0,.25);overflow:hidden}'
    + '.opis-cu{padding:16px 18px 6px;overflow-y:auto;overscroll-behavior:contain;min-height:0;flex:1 1 auto}'
    + '.opis-pie{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;padding:10px 18px 14px;border-top:1px solid var(--line);background:var(--surface)}'
    + '.opis-v h3{margin:0 0 4px;font-size:18px}'
    + '.opis-v fieldset{border:0;padding:0;margin:12px 0 4px;display:grid;gap:6px}'
    + '.opis-v legend{font-weight:700;font-size:13px;margin-bottom:6px}'
    + '.opis-op{display:flex;gap:8px;align-items:flex-start;border:1px solid var(--line);border-radius:10px;padding:9px 10px;cursor:pointer}'
    + '.opis-op input{margin-top:3px}.opis-op.sel{border-color:var(--navy);background:var(--navy-soft)}'
    + '.opis-v label.l{display:block;font-weight:600;font-size:13px;margin:12px 0 4px}'
    + '.opis-v input[type=date],.opis-v input[type=text],.opis-v textarea{width:100%;border:1px solid var(--line-strong);border-radius:8px;padding:8px 10px;background:var(--surface);color:var(--ink);font:inherit;font-size:14px}'
    + '.opis-v input[type=file]{width:100%;font-size:13px}'
    + '.opis-msg{margin-top:10px;border-radius:10px;padding:9px 11px;font-size:13px;background:var(--red-soft);color:var(--red)}'
    + '@media (max-width:600px){.opis-v input[type=date],.opis-v input[type=text],.opis-v textarea{font-size:16px}}';
  function estilos() {
    if (document.getElementById('opis-css')) return;
    var s = document.createElement('style'); s.id = 'opis-css'; s.textContent = CSS; document.head.appendChild(s);
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fecha(d) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(d || '')); return m ? m[3] + '/' + m[2] + '/' + m[1] : ''; }
  function hoyTxt() {
    var p = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Monterrey', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    var g = function (t) { return (p.filter(function (x) { return x.type === t; })[0] || {}).value; };
    return g('year') + '-' + g('month') + '-' + g('day');
  }
  // el texto de un error, en palabras y con qué hacer (la pieza común de js/portal.js si ya está; si no, lo que dice la base)
  function textoError(e, que) {
    var P = window.PORTAL;
    if (P && typeof P.falla === 'function') return P.falla(e, que);
    var m = String((e && (e.message || e.error_description)) || '');
    if (/Qué hacer/.test(m)) return m;
    return 'No se pudo ' + que + '. Qué hacer: revisa tu internet, vuelve a cargar la pantalla e inténtalo otra vez.';
  }
  var QUE = { declaracion: 'Presentamos la declaración que faltaba', aclaracion: 'Mandamos la aclaración al SAT', se_debe: 'Es correcto: el cliente lo debe' };
  var RES = { negativa: 'seguía negativa', positiva: 'ya salió positiva', sin_opinion: 'el CRM no pudo pedirla al SAT' };

  function hechoTxt(c) {
    if (!c.que) return '<span class="opis-mal">Nadie lo ha registrado todavía.</span>';
    var t = c.que === 'declaracion' ? 'Se presentó la declaración el ' + esc(fecha(c.que_fecha))
      : c.que === 'aclaracion' ? 'Se mandó la aclaración el ' + esc(fecha(c.que_fecha)) + (c.folio ? ' (folio ' + esc(c.folio) + ')' : '')
      : 'Es correcto: el cliente lo debe';
    t += '. <span class="opis-mut">Lo registró ' + esc(c.quien || '') + (c.cuando ? ' el ' + esc(fecha(c.cuando)) : '') + '.</span>';
    if (c.nota) t += '<div class="opis-mut">«' + esc(c.nota) + '»</div>';
    return t;
  }
  function acuseTxt(c) {
    var a = c.acuse; if (!a) return '';
    if (!a.listo) return '<div class="opis-r opis-mal"><b>Acuse:</b> no llegó. Qué hacer: vuelve a registrarlo con el acuse.</div>';
    var l = a.rfc_ok === true ? '<span class="opis-bien">✓ es de este cliente</span>'
      : !a.leido ? '<span class="opis-mut">no se pudo leer (es una foto o un escaneo)</span>' : '<span class="opis-mut">no trae el RFC</span>';
    if (a.folio_ok === false) l += ' · <span class="opis-mal">no trae el folio que se escribió</span>';
    return '<div class="opis-r"><b>Acuse:</b> en el expediente del cliente (Opiniones de cumplimiento) · ' + l + '</div>';
  }
  function satTxt(c) {
    var s = c.en_sat; if (!s || !s.hay) return '';
    var v = (s.vistas || []).map(function (x) { return 'la de ' + esc(x.t) + (x.presentada ? ' (presentada el ' + esc(fecha(x.presentada)) + ')' : ''); });
    var f = (s.faltan || []).map(esc);
    return '<div class="opis-r"><b>En el SAT:</b> ' + (v.length ? 'Centauro ya ve ' + v.join(', ') + '. ' : '')
      + (f.length ? 'Todavía no ve la declaración de ' + f.join(', ') + '.' : 'Ya están todas las que faltaban.') + '</div>';
  }
  function revTxt(c) {
    var h = '';
    (c.revs || []).forEach(function (r) {
      if (!r.res) return;
      h += '<div class="opis-r"><b>' + esc(r.dias) + '.º día hábil' + (r.n === 2 ? ' de la aclaración' : '') + ' (' + esc(fecha(r.fecha)) + '):</b> '
        + '<span class="' + (r.res === 'positiva' ? 'opis-bien' : 'opis-mal') + '">' + esc(RES[r.res] || r.res) + '</span></div>';
    });
    if (c.estado === 'abierto') {
      if (c.proxima) h += '<div class="opis-r"><b>Siguiente revisión:</b> el CRM la vuelve a pedir al SAT el ' + esc(fecha(c.proxima.fecha))
        + ' (' + esc(c.proxima.dias) + '.º día hábil ' + (c.proxima.de === 'aclaracion' ? 'de la aclaración' : 'de la negativa') + ') y avisa cómo salió.</div>';
      else if (c.intenta) h += '<div class="opis-r"><b>Siguiente revisión:</b> el CRM la sigue intentando pedir al SAT.</div>';
      else h += '<div class="opis-r opis-mut">Además, el CRM la vuelve a pedir cada semana hasta que salga positiva.</div>';
    }
    return h;
  }
  function pinta(box, c, op) {
    op = op || {};
    if (!box) return;
    if (!c) { box.hidden = true; box.innerHTML = ''; return; }
    estilos();
    var abierto = c.estado === 'abierto';
    var h = '<div class="opis" data-opis="' + esc(c.id) + '"><div class="opis-t">Seguimiento de la opinión negativa '
      + '<span class="opis-chip ' + (abierto ? 'ab' : 'ok') + '">' + (abierto ? 'Abierto' : 'Ya salió positiva') + '</span></div>'
      + '<div class="opis-r">Salió negativa el ' + esc(fecha(c.desde)) + (!abierto && c.cerrado ? '; el ' + esc(fecha(c.cerrado)) + ' el SAT ya la dio positiva.' : '.') + '</div>'
      + '<div class="opis-r"><b>Qué se hizo:</b> ' + hechoTxt(c) + '</div>'
      + (c.que === 'aclaracion' && c.sat_limite && abierto ? '<div class="opis-r opis-mut">El SAT tiene hasta el ' + esc(fecha(c.sat_limite)) + ' para contestar la aclaración.</div>' : '')
      + acuseTxt(c) + satTxt(c) + revTxt(c);
    if (abierto && !c.que && c.que_dice && c.que_dice.hacer) {
      h += '<div class="opis-r"><b>Qué hacer:</b> ' + esc(c.que_dice.hacer) + ' Luego regístralo aquí con el acuse.</div>';
    }
    if (c.puede && !op.consulta) {
      h += '<div class="opis-acc"><button class="opis-b1" type="button" data-opis-reg>' + (c.que ? 'Cambiar lo registrado' : 'Registrar qué se hizo') + '</button></div>';
    }
    box.innerHTML = h + '</div>';
    box.hidden = false;
    var b = box.querySelector('[data-opis-reg]');
    if (b) b.onclick = function () { ventana(c, op, function (nuevo) { pinta(box, nuevo, op); if (op.alCambiar) op.alCambiar(nuevo); }); };
  }

  // el texto del PDF (hasta 8 hojas), con el PDF.js del portal; si no se puede, vacío (la base lo deja como «no se pudo leer»)
  async function textoPdf(file) {
    try {
      var L = await window.PROFASE_VISOR.pdfjs();
      var doc = await L.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise, out = [];
      for (var p = 1; p <= Math.min(doc.numPages, 8); p++) {
        var pg = await doc.getPage(p), t = await pg.getTextContent();
        out.push(t.items.map(function (i) { return i.str || ''; }).join(' '));
      }
      try { doc.destroy(); } catch (e) { /* listo */ }
      return out.join('\n').slice(0, 200000);
    } catch (e) { return ''; }
  }

  function ventana(c, op, listo) {
    estilos();
    var P = window.PORTAL, hoy = hoyTxt();
    var v = document.createElement('div');
    v.className = 'opis-velo';
    v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true'); v.setAttribute('aria-labelledby', 'opis-tit');
    var ops = Object.keys(QUE).map(function (k) {
      return '<label class="opis-op"><input type="radio" name="opis-que" value="' + k + '"' + (c.que === k ? ' checked' : '') + '><span>' + esc(QUE[k]) + '</span></label>';
    }).join('');
    v.innerHTML = '<div class="opis-v"><div class="opis-cu"><h3 id="opis-tit">¿Qué se hizo con la opinión negativa?</h3>'
      + '<div class="opis-mut">' + esc(op.cliente || c.rfc) + ' · salió negativa el ' + esc(fecha(c.desde)) + '</div>'
      + '<fieldset><legend>Qué se hizo</legend>' + ops + '</fieldset>'
      + '<div data-v="fecha"><label class="l" for="opis-f">Fecha (la del acuse)</label><input type="date" id="opis-f" max="' + hoy + '" value="' + esc(c.que_fecha || hoy) + '"></div>'
      + '<div data-v="folio"><label class="l" for="opis-fo">Folio de la aclaración</label><input type="text" id="opis-fo" maxlength="40" autocomplete="off" value="' + esc(c.folio || '') + '" placeholder="Como viene en el acuse del SAT"></div>'
      + '<div data-v="doc">' + (c.reservado
          ? '<p class="opis-mut" style="margin:12px 0 0">El acuse de esta razón social no se guarda en el expediente: basta lo que escribas aquí.</p>'
          : '<label class="l" for="opis-a">Acuse en PDF</label><input type="file" id="opis-a" accept="application/pdf,.pdf">'
            + '<div class="opis-mut">Va al expediente del cliente, en «Opiniones de cumplimiento». El CRM revisa que sea de este cliente.'
            + (c.acuse ? ' Si no subes otro, se queda el que ya está.' : '') + '</div>') + '</div>'
      + '<label class="l" for="opis-n">Nota <span class="opis-mut" data-v="nota-ob">(obligatoria: por qué es correcto y qué va a hacer el cliente)</span></label>'
      + '<textarea id="opis-n" rows="3" maxlength="1000">' + esc(c.nota || '') + '</textarea>'
      + '<div class="opis-msg" role="alert" hidden></div></div>'
      + '<div class="opis-pie" data-pie-ventana><button class="opis-b2" type="button" data-x>Cancelar</button><button class="opis-b1" type="button" data-ok>Guardar</button></div></div>';
    document.body.appendChild(v);
    try { if (P && P.escribiendo) P.escribiendo('opinion-seg', true); } catch (e) { /* sin aviso */ }
    // que los avisos chicos de abajo (en la página de arriba) no tapen «Guardar» (js/portal.js, avAcomoda)
    try { var dt = (window.top || window).document; dt.dispatchEvent(new CustomEvent('profase-ventana')); } catch (e) { /* otro sitio */ }
    var $ = function (s) { return v.querySelector(s); }, ocupado = false;
    function que() { var r = v.querySelector('input[name="opis-que"]:checked'); return r ? r.value : ''; }
    function acomoda() {
      var q = que();
      v.querySelectorAll('.opis-op').forEach(function (l) { l.classList.toggle('sel', !!l.querySelector('input:checked')); });
      $('[data-v="folio"]').hidden = q !== 'aclaracion';
      $('[data-v="doc"]').hidden = q === 'se_debe' || !q;
      $('[data-v="fecha"]').hidden = q === 'se_debe';
      $('[data-v="nota-ob"]').hidden = q !== 'se_debe';
    }
    function cierra() {
      if (ocupado) return;
      document.removeEventListener('keydown', tecla, true);
      try { if (P && P.escribiendo) P.escribiendo('opinion-seg', false); } catch (e) { /* sin aviso */ }
      v.remove();
      try { var dt = (window.top || window).document; dt.dispatchEvent(new CustomEvent('profase-ventana')); } catch (e) { /* otro sitio */ }
    }
    function tecla(ev) { if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); cierra(); } }
    function msg(t) { var m = $('.opis-msg'); m.textContent = t || ''; m.hidden = !t; if (t) m.scrollIntoView({ block: 'nearest' }); }
    document.addEventListener('keydown', tecla, true);
    v.addEventListener('click', function (ev) { if (ev.target === v) cierra(); });
    v.querySelectorAll('input[name="opis-que"]').forEach(function (r) { r.onchange = acomoda; });
    $('[data-x]').onclick = cierra;
    acomoda();
    setTimeout(function () { var r = v.querySelector('input[name="opis-que"]:checked') || v.querySelector('input[name="opis-que"]'); try { r.focus(); } catch (e) {} }, 0);
    $('[data-ok]').onclick = async function () {
      var q = que(); msg('');
      if (!q) { msg('Escoge qué se hizo. Qué hacer: marca una de las tres opciones.'); return; }
      var f = $('#opis-a') && $('#opis-a').files && $('#opis-a').files[0];
      if (f && !/\.pdf$/i.test(f.name)) { msg('El acuse tiene que ser PDF. Qué hacer: baja el acuse en PDF del portal del SAT y súbelo.'); return; }
      var b = $('[data-ok]'); ocupado = true; b.disabled = true; b.textContent = 'Guardando…';
      try {
        var p = { caso: c.id, que: q, fecha: q === 'se_debe' ? null : ($('#opis-f').value || null), folio: q === 'aclaracion' ? $('#opis-fo').value : null,
                  nota: $('#opis-n').value };
        if (f && q !== 'se_debe') {
          b.textContent = 'Leyendo el acuse…';
          p.archivo = { nombre: f.name, bytes: f.size };
          p.lectura = { texto: await textoPdf(f) };
          b.textContent = 'Guardando…';
        }
        var r = await P.sb.rpc('sat_decl_opi_atiende', { p: p });
        if (r.error) throw r.error;
        var nuevo = r.data && r.data.caso;
        if (r.data && r.data.doc) {
          b.textContent = 'Subiendo el acuse…';
          var u = await P.sb.storage.from('expedientes').upload(String(r.data.doc), f, { contentType: 'application/pdf', upsert: false });
          if (u.error) {
            ocupado = false; b.disabled = false; b.textContent = 'Guardar';
            msg('Lo que se hizo quedó registrado, pero el acuse no llegó. Qué hacer: revisa tu internet y vuelve a guardarlo con el acuse.');
            if (listo && nuevo) listo(nuevo);
            return;
          }
          var l = await P.sb.rpc('sat_decl_opi_doc_listo', { p_caso: c.id, p_doc: r.data.doc });
          if (l.error) throw l.error;
          nuevo = l.data || nuevo;
        }
        ocupado = false; cierra();
        if (listo && nuevo) listo(nuevo);
        try { if (P.toast) P.toast('Quedó registrado qué se hizo con la opinión.'); } catch (e) { /* sin aviso */ }
      } catch (e) {
        ocupado = false; b.disabled = false; b.textContent = 'Guardar';
        msg(textoError(e, 'guardar lo que se hizo'));
      }
    };
  }

  window.PROFASE_OPI = { pinta: pinta };
})();
