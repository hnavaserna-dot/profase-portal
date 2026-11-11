/* Portal PROFASE · Usuarios QUO de un cliente (3-nov-2026; Héctor Daniel Nava, 17:23: «sí porfavor», a que la ficha de
   Clientes › Base de clientes traiga «Usuarios QUO» como la pestaña del Access: QUO ID, Contabilita y Facturita).
   Una sola pieza para las dos pantallas que los enseñan: Clientes › Base de clientes (sección «Usuarios QUO») y Clientes ›
   Claves SAT y renovaciones (renglón «QUO» de «Contraseñas y archivos del SAT»). El dato es uno solo (cifrado en la base;
   portal/sql/26_credenciales.sql y 57_credenciales_portal.sql): lo que se cambia en una pantalla sale al momento en la otra.

   Quién: lo decide la base (la dirección, los gerentes y el contador del cliente; Héctor Nava Ramos solo ve). Esta pieza
   solo usa cred_resumen() (qué hay, sin ningún valor), cred_ver(rfc, 'quo') (cada vista queda en Accesos) y cred_guarda()
   con los cuatro datos de QUO (cada cambio queda en Accesos, sin el valor). Lo que se ve se esconde solo al minuto, al
   cambiar de pestaña o de aplicación y al cerrar la ficha; los valores viven solo en memoria (nunca en el HTML como
   atributo), nada se guarda en el navegador y nada se escribe en la consola.

   var q = PROFASE_CLAVES_QUO.crea({
     donde: elemento,             // aquí se pinta (vacío)
     rfc: 'AAA010101AAA',
     sb: PORTAL.sb,               // la sesión del portal
     consulta: PORTAL.consulta,   // solo consulta: sin «Capturar» ni «Cambiar» (la base igual lo detiene)
     resumen: {...},              // opcional: lo que ya trajo cred_resumen() (para no pedirlo dos veces)
     nota: false                  // opcional: sin la nota de abajo (Claves SAT ya trae la suya para todas las contraseñas)
   });
   q.esconde();                         // esconde lo que se ve y cierra la forma
   PROFASE_CLAVES_QUO.escondeTodo();    // todas las de la página (al cerrar la ficha) */
(function () {
  'use strict';
  if (window.PROFASE_CLAVES_QUO) return;

  var SEG = 60;          // lo que se ve se esconde solo al minuto (igual que las demás contraseñas de los clientes)
  var QUIETA = 120;      // la forma de cambiar (que trae lo de hoy) se cierra sola si nadie escribe en 2 minutos
  // [dato en la base, sistema, qué es, cómo llega de cred_ver(rfc, 'quo')]
  var CAMPOS = [['quo_uc', 'Contabilita', 'Usuario', 'contabilita', 'usuario'], ['quo_pc', 'Contabilita', 'Contraseña', 'contabilita', 'clave'],
                ['quo_uf', 'Facturita', 'Usuario', 'facturita', 'usuario'], ['quo_pf', 'Facturita', 'Contraseña', 'facturita', 'clave']];
  var SISTEMAS = ['Contabilita', 'Facturita'];
  var TODAS = [];

  var CSS = '.cqo{display:grid;gap:10px;min-width:0;color:var(--ink,#132036)}'
    + '.cqo *{box-sizing:border-box}'
    + '.cqo [hidden]{display:none!important}'
    + '.cqo-gs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;min-width:0}'
    + '.cqo-g{border:1px solid var(--line,#DCE2EB);border-radius:10px;background:var(--surface,#FFFFFF);min-width:0;overflow:hidden}'
    + '.cqo-gt{font-size:12px;font-weight:700;color:var(--muted,#5A6577);text-transform:uppercase;letter-spacing:.04em;padding:7px 12px;background:var(--surface-2,#EEF2F7);border-bottom:1px solid var(--line,#DCE2EB)}'
    + '.cqo-r{display:grid;grid-template-columns:92px minmax(0,1fr) auto;gap:4px 10px;align-items:center;padding:8px 12px;border-top:1px solid var(--line,#DCE2EB);min-width:0}'
    + '.cqo-gt+.cqo-r{border-top:0}'
    + '.cqo-l{font-size:12.5px;font-weight:600;color:var(--muted,#5A6577)}'
    + '.cqo-v{justify-self:start;max-width:100%;min-width:0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13.5px;background:var(--surface-2,#EEF2F7);border:1px solid var(--line-strong,#C4CDDA);border-radius:6px;padding:2px 7px;overflow-wrap:anywhere;word-break:break-all;user-select:all}'
    + '.cqo-o{color:var(--muted,#5A6577);font-size:13px;min-width:0;overflow-wrap:anywhere}'
    + '.cqo-acc{display:flex;flex-wrap:wrap;gap:8px;align-items:center}'
    + '.cqo-b{font:inherit;font-size:12.5px;font-weight:600;border:1px solid var(--line-strong,#C4CDDA);background:var(--surface,#FFFFFF);color:var(--ink,#132036);border-radius:8px;padding:6px 11px;cursor:pointer;min-height:32px;white-space:nowrap}'
    + '.cqo-b:hover{border-color:var(--navy,#1F3864)}'
    + '.cqo-b.pri{background:var(--accent,#F07A1E);border-color:var(--accent,#F07A1E);color:#14233F}'
    + '.cqo-b:disabled{opacity:.6;cursor:default}'
    + '.cqo-b:focus-visible,.cqo input:focus-visible{outline:2px solid var(--accent,#F07A1E);outline-offset:2px}'
    + '.cqo-f{display:grid;gap:10px;border:1px solid var(--line,#DCE2EB);border-radius:10px;padding:10px 12px;background:var(--surface-2,#EEF2F7);min-width:0}'
    + '.cqo-ft{font-weight:700;font-size:13.5px}'
    + '.cqo-fc{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 12px;min-width:0}'
    + '.cqo-fc label{display:grid;gap:4px;font-size:12px;font-weight:600;color:var(--muted,#5A6577);min-width:0}'
    + '.cqo-fc input{font:inherit;font-size:14px;padding:7px 9px;border:1px solid var(--line-strong,#C4CDDA);border-radius:8px;background:var(--surface,#FFFFFF);color:var(--ink,#132036);min-width:0;width:100%}'
    + '.cqo-m{font-size:12.5px;color:var(--muted,#5A6577);overflow-wrap:anywhere}'
    + '.cqo-m.mal{color:var(--red,#B42318)}'
    + '.cqo-m.bien{color:var(--ok,#1D7A4F)}'
    + '.cqo-n{font-size:12px;color:var(--muted,#5A6577);overflow-wrap:anywhere}'
    + '@media (max-width:700px){.cqo-fc input{font-size:16px}}'
    + '@media (max-width:640px){.cqo-gs,.cqo-fc{grid-template-columns:minmax(0,1fr)}}'
    + '@media (max-width:420px){.cqo-r{grid-template-columns:minmax(0,1fr) auto}.cqo-l{grid-column:1/-1}}';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pone() {
    if (document.getElementById('cqo-css')) return;
    var s = document.createElement('style'); s.id = 'cqo-css'; s.textContent = CSS; document.head.appendChild(s);
  }
  function falla(e) {
    var m = String((e && (e.message || e.msg)) || '').replace(/^.*?ERROR:\s*/, '');
    if (/sin permiso/i.test(m)) return 'no tienes permiso para este cliente';
    return m || 'vuelve a intentar en un momento';
  }
  function vivo(S) { return !!(S.donde && document.contains(S.donde)); }

  function crea(o) {
    pone();
    var S = { donde: o.donde, rfc: String(o.rfc || '').toUpperCase().trim(), sb: o.sb, consulta: !!o.consulta,
              R: o.resumen === undefined ? undefined : o.resumen, nota: o.nota !== false, val: null, orig: null, forma: false, msg: '', clase: '', t: null, tq: null, ocupado: false };
    if (!S.donde) return { esconde: function () {} };
    S.donde.classList.add('cqo');
    TODAS.push(S);

    function pinta() {
      if (!vivo(S)) return;
      if (S.R === undefined) { S.donde.innerHTML = '<div class="cqo-n">Revisando…</div>'; return; }
      if (!S.R) { S.donde.innerHTML = '<div class="cqo-n">Los usuarios y contraseñas de QUO los ven la dirección, los gerentes y el contador de este cliente (responsable, quien autoriza o contador asignado en el WorkFlow).</div>'; return; }
      var hay = !!S.R.quo, h = '<div class="cqo-gs">';
      SISTEMAS.forEach(function (sis) {
        h += '<div class="cqo-g"><div class="cqo-gt">' + esc(sis) + '</div>';
        CAMPOS.filter(function (c) { return c[1] === sis; }).forEach(function (c) {
          var v = S.val ? S.val[c[0]] : null, cel;
          if (S.val) cel = v ? '<code class="cqo-v">' + esc(v) + '</code>' : '<span class="cqo-o">Vacío</span>';
          else cel = hay ? '<span class="cqo-o" aria-label="Oculto">••••••••</span>' : '<span class="cqo-o">Sin capturar</span>';
          h += '<div class="cqo-r"><span class="cqo-l">' + esc(c[2]) + '</span>' + cel
            + (S.val && v ? '<button class="cqo-b" type="button" data-cqcopia="' + c[0] + '" aria-label="Copiar ' + esc(c[2].toLowerCase() + ' de ' + sis) + '">Copiar</button>' : '<span></span>') + '</div>';
        });
        h += '</div>';
      });
      h += '</div><div class="cqo-acc">'
        + (hay && !S.forma ? '<button class="cqo-b" type="button" data-cqver="1" aria-expanded="' + (S.val ? 'true' : 'false') + '">' + (S.val ? 'Ocultar' : 'Ver') + '</button>' : '')
        + (!S.consulta && !S.forma ? '<button class="cqo-b" type="button" data-cqcambia="1">' + (hay ? 'Cambiar' : 'Capturar') + '</button>' : '')
        + '</div>';
      if (S.forma) {
        h += '<div class="cqo-f" role="group" aria-label="Usuarios de QUO"><div class="cqo-ft">' + (hay ? 'Cambiar los usuarios de QUO' : 'Capturar los usuarios de QUO') + '</div><div class="cqo-fc">'
          + CAMPOS.map(function (c) {
            return '<label>' + esc(c[2] + ' de ' + c[1]) + '<input type="text" data-cqcampo="' + c[0] + '" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" maxlength="200" data-lpignore="true" data-1p-ignore></label>';
          }).join('')
          + '</div><div class="cqo-m">Si borras un dato y guardas, ese dato se quita.</div>'
          + '<div class="cqo-acc"><button class="cqo-b pri" type="button" data-cqguarda="1">Guardar</button><button class="cqo-b" type="button" data-cqcancela="1">Cancelar</button></div></div>';
      }
      if (S.msg) h += '<div class="cqo-m ' + S.clase + '" role="status">' + esc(S.msg) + '</div>';
      if (S.nota) h += '<div class="cqo-n">Lo que ves se esconde solo al minuto. Cada vez que alguien los ve o los cambia queda anotado en Accesos (lo revisa la dirección).</div>';
      S.donde.innerHTML = h;
      if (S.forma && S.orig) {   // lo de hoy se pone con .value (nunca en el HTML)
        S.donde.querySelectorAll('[data-cqcampo]').forEach(function (i) { i.value = S.orig[i.getAttribute('data-cqcampo')] || ''; });
      }
    }
    function avisa(t, clase) { S.msg = t || ''; S.clase = clase || ''; }
    function cuentaVer() {
      clearTimeout(S.t);
      S.t = setTimeout(function () { if (!S.forma) { S.val = null; pinta(); } }, SEG * 1000);
    }
    function cuentaForma() {
      clearTimeout(S.tq);
      S.tq = setTimeout(function () { esconde(); }, QUIETA * 1000);
    }
    async function resumen() {
      try { var r = await S.sb.rpc('cred_resumen', { p_rfc: S.rfc }); S.R = r.error ? null : (r.data || null); }
      catch (e) { S.R = null; }
    }
    async function trae() {   // los cuatro datos de QUO de este cliente (queda en Accesos)
      var r = await S.sb.rpc('cred_ver', { p_rfc: S.rfc, p_que: 'quo' });
      if (r.error || !r.data) throw (r.error || new Error('sin dato'));
      var d = r.data, v = {};
      CAMPOS.forEach(function (c) { v[c[0]] = (d[c[3]] && d[c[3]][c[4]]) || ''; });
      return v;
    }
    async function ver(b) {
      if (S.val) { S.val = null; clearTimeout(S.t); avisa(''); pinta(); return; }
      b.disabled = true;
      try { S.val = await trae(); avisa(''); cuentaVer(); }
      catch (e) { avisa('No se pudo ver: ' + falla(e) + '.', 'mal'); }
      pinta();
    }
    async function cambia(b) {
      if (S.consulta) return;
      b.disabled = true;
      try {
        S.orig = S.R && S.R.quo ? (S.val || await trae()) : { quo_uc: '', quo_pc: '', quo_uf: '', quo_pf: '' };
        S.forma = true; avisa('');
        cuentaForma();
      } catch (e) { avisa('No se pudo abrir: ' + falla(e) + '.', 'mal'); }
      pinta();
      try { var i = S.donde.querySelector('[data-cqcampo]'); if (i) i.focus(); } catch (e) {}
    }
    async function guarda(b) {
      if (S.ocupado || !S.forma) return;
      var cambios = [];
      S.donde.querySelectorAll('[data-cqcampo]').forEach(function (i) {
        var k = i.getAttribute('data-cqcampo'), v = i.value.trim();
        if (!CAMPOS.some(function (c) { return c[0] === k; })) return;   // solo los cuatro de QUO
        if (v !== String((S.orig && S.orig[k]) || '')) cambios.push([k, v]);
      });
      var m = S.donde.querySelector('.cqo-f .cqo-m');
      if (!cambios.length) { if (m) { m.className = 'cqo-m mal'; m.textContent = 'No cambiaste nada.'; } return; }
      S.ocupado = true; b.disabled = true;
      if (m) { m.className = 'cqo-m'; m.textContent = 'Guardando…'; }
      try {
        for (var n = 0; n < cambios.length; n++) {
          var r = await S.sb.rpc('cred_guarda', { p_rfc: S.rfc, p_que: cambios[n][0], p_valor: cambios[n][1] });
          if (r.error) throw r.error;
        }
        S.forma = false; S.orig = null; S.val = null; clearTimeout(S.tq); clearTimeout(S.t);
        await resumen();
        avisa('Guardado.', 'bien');
        pinta();
      } catch (e) {
        if (m) { m.className = 'cqo-m mal'; m.textContent = 'No se guardó: ' + falla(e) + '.'; }
        b.disabled = false;
      }
      S.ocupado = false;
    }
    async function copia(b) {
      var k = b.getAttribute('data-cqcopia'), v = S.val && S.val[k];
      if (!v) return;
      try { await navigator.clipboard.writeText(v); b.textContent = 'Copiado'; }
      catch (e) { b.textContent = 'Selecciónalo y copia'; }
      setTimeout(function () { if (b.isConnected) b.textContent = 'Copiar'; }, 2000);
    }
    function esconde() {
      clearTimeout(S.t); clearTimeout(S.tq);
      var habia = !!(S.val || S.forma);
      S.val = null; S.orig = null; S.forma = false;
      if (habia) { avisa(''); pinta(); }
    }
    S.esconde = esconde;
    S.donde.addEventListener('click', function (ev) {
      var b = ev.target.closest && ev.target.closest('[data-cqver],[data-cqcambia],[data-cqguarda],[data-cqcancela],[data-cqcopia]');
      if (!b || !S.donde.contains(b)) return;
      if (b.hasAttribute('data-cqver')) ver(b);
      else if (b.hasAttribute('data-cqcambia')) cambia(b);
      else if (b.hasAttribute('data-cqguarda')) guarda(b);
      else if (b.hasAttribute('data-cqcancela')) { esconde(); }
      else if (b.hasAttribute('data-cqcopia')) copia(b);
    });
    S.donde.addEventListener('input', function (ev) { if (ev.target && ev.target.hasAttribute && ev.target.hasAttribute('data-cqcampo')) cuentaForma(); });
    S.donde.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' && ev.target && ev.target.hasAttribute && ev.target.hasAttribute('data-cqcampo')) {
        ev.preventDefault(); var b = S.donde.querySelector('[data-cqguarda]'); if (b) guarda(b);
      }
    });

    pinta();
    if (S.R === undefined) resumen().then(pinta);
    return { esconde: esconde };
  }

  function escondeTodo() {
    TODAS = TODAS.filter(function (S) {
      if (!vivo(S)) { clearTimeout(S.t); clearTimeout(S.tq); S.val = null; S.orig = null; return false; }
      if (S.esconde) S.esconde();
      return true;
    });
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) escondeTodo(); });
  window.addEventListener('pagehide', escondeTodo);

  window.PROFASE_CLAVES_QUO = { crea: crea, escondeTodo: escondeTodo };
})();
