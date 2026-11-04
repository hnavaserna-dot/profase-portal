/* Portal PROFASE · filtros de los reportes (29-oct-2026, propuesta de Gabriel).
   Un solo botón «FILTROS» con el número de filtros puestos; al picarlo se despliega una ventana con sub pestañas
   (PERSONAS, PERIODO…) y lo escogido queda como etiquetas que se quitan con ×. Todo en mayúsculas: lo que se escribe
   en los buscadores se pasa solo a mayúsculas y al buscar no importan acentos ni signos («Comercial,» = «COMERCIAL»).
   Mientras se escribe, la lista se va acortando a los nombres que traen esas letras. Cliente y los demás campos de
   tipo «varios» dejan marcar más de uno. En el celular la ventana sale como hoja desde abajo.
   Cada página sigue con su propio estado y su propia forma de filtrar: este archivo solo pinta y le avisa.

   var f = PROFASE_FILTROS.crea({
     donde: elemento,                       // aquí va la barra (botón, etiquetas y la ventana)
     grupos: [{ t: 'PERSONAS', campos: [   // una sub pestaña por grupo
       { k: 'cli', t: 'CLIENTE', tipo: 'varios' | 'uno' | 'texto',
         opciones: function () { return [{ v: 'X', t: 'NOMBRE', n: 12 }]; },   // n: cuántos (opcional)
         valor: function () { return ['X']; },   // 'texto': regresa el texto
         pon: function (vals) { … },             // 'texto': recibe el texto
         buscar: true }                          // con buscador aunque tenga pocas opciones
     ]}],
     cambio: function () { render(); },     // después de cualquier cambio
     limpiar: function () { … },            // opcional: cómo quitar todo (si no, cada campo queda vacío)
     resultados: function () { return 'VER 38 RESULTADOS'; }   // opcional: el texto del botón de abajo
   });
   f.pinta();   // cuando cambian los datos o el estado desde fuera
   f.destruye();   // si la página quita la barra (le quita sus avisos a la página)

   Opcionales (3-nov-2026, la Cartera con el concepto de Gabo; las demás páginas siguen igual sin ellos):
   - en cfg: nota (texto del pie, o false para no poner ninguno) y limpiarTxt (lo que dice el botón de quitar todo);
   - en cada campo: chip(vals) (cómo se lee su etiqueta), todos (lo que dice su botón «Todos»), lista: true (lista con
     casillas aunque tenga pocas opciones, sin buscador), defecto: [...] (lo que trae puesto sin que cuente como filtro:
     no sale su etiqueta y «Limpiar» lo regresa ahí; sin botón «Todos»);
   - tipo 'rango' con entrada 'numero' o 'fecha' y etiquetas ['Desde', 'Hasta']: dos campos; valor() regresa
     ['', ''] y pon(['…', '…']) recibe los dos. */
(function () {
  'use strict';
  if (window.PROFASE_FILTROS) return;

  var CSS = '.pf{position:relative;display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 0 10px;font-family:inherit;--pf-sf:#FFFFFF;--pf-sf2:#F3F5F9;--pf-ln:#D5DCE7;--pf-ink:#132036;--pf-mu:#5A6577;--pf-ac:#F07A1E;--pf-acs:#FDEBDC;--pf-aci:#9A4A0C;--pf-nv:#1F3864}'
    + ':root[data-theme="dark"] .pf{--pf-sf:#141C2B;--pf-sf2:#1B2638;--pf-ln:#2C3A55;--pf-ink:#E5EAF2;--pf-mu:#98A3B5;--pf-acs:rgba(240,122,30,.16);--pf-aci:#FFD2AE;--pf-nv:#F07A1E}'
    + '.pf *{box-sizing:border-box}.pf-capa{margin:0}'
    + '.pf-btn{display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 14px;border-radius:10px;border:0;background:var(--pf-ac);color:#0B1220;font:inherit;font-size:12.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;cursor:pointer}'
    + '.pf-btn svg{width:17px;height:17px;flex:none}.pf-btn:hover{filter:brightness(1.07)}'
    + '.pf-num{background:#0B1220;color:var(--pf-ac);border-radius:999px;font-size:11px;font-weight:800;padding:0 7px;line-height:19px}'
    + '.pf-chip{display:inline-flex;align-items:center;gap:6px;height:30px;max-width:100%;padding:0 5px 0 11px;border-radius:999px;background:var(--pf-acs);border:1px solid rgba(240,122,30,.5);color:var(--pf-aci);font:inherit;font-size:11.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;cursor:pointer}'
    + '.pf-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
    + '.pf-chip i{font-style:normal;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:rgba(127,127,127,.18);flex:none}'
    + '.pf-lim{background:none;border:0;color:var(--pf-mu);font:inherit;font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;text-decoration:underline;cursor:pointer;padding:6px 4px}'
    + '.pf-pan{position:absolute;left:0;top:calc(100% + 6px);z-index:60;width:min(880px,calc(100vw - 32px));max-height:min(620px,calc(100vh - 120px));max-height:min(620px,calc(100dvh - 120px));display:flex;flex-direction:column;background:var(--pf-sf);color:var(--pf-ink);border:1px solid var(--pf-ln);border-top:3px solid var(--pf-ac);border-radius:14px;box-shadow:0 18px 48px rgba(10,18,32,.28)}'
    + '.pf-pan[hidden]{display:none}'
    + '.pf-cab{display:none}'
    + '.pf-tabs{display:flex;gap:20px;padding:12px 18px 0;border-bottom:1px solid var(--pf-ln);overflow-x:auto;scrollbar-width:none;flex:none}'
    + '.pf-tabs button{background:none;border:0;border-bottom:2px solid transparent;padding:4px 2px 10px;font:inherit;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--pf-mu);cursor:pointer;white-space:nowrap}'
    + '.pf-tabs button[aria-selected="true"]{color:var(--pf-ink);border-bottom-color:var(--pf-ac)}'
    + '.pf-tabs button b{display:inline-block;min-width:17px;margin-left:5px;border-radius:999px;background:var(--pf-ac);color:#0B1220;font-size:10.5px;line-height:17px;text-align:center}'
    + '.pf-cuerpo{overflow:auto;padding:16px 18px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px 22px;align-content:start}'
    + '.pf-campo{min-width:0}'
    + '.pf-lbl{display:block;font-size:10.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--pf-mu);margin:0 0 8px}'
    + '.pf-seg{display:flex;flex-wrap:wrap;gap:6px}'
    + '.pf-seg button{font:inherit;font-size:11.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:7px 11px;border-radius:8px;border:1px solid var(--pf-ln);background:var(--pf-sf2);color:var(--pf-ink);cursor:pointer}'
    + '.pf-seg button[aria-pressed="true"]{border-color:var(--pf-ac);background:var(--pf-acs);color:var(--pf-aci)}'
    + '.pf-q{display:flex;align-items:center;gap:8px;height:40px;padding:0 12px;border-radius:10px;border:1px solid var(--pf-ln);background:var(--pf-sf2)}'
    + '.pf-q:focus-within{border-color:var(--pf-ac)}'
    + '.pf-q svg{width:16px;height:16px;color:var(--pf-mu);flex:none}'
    + '.pf .pf-q input{flex:1;min-width:0;width:auto;height:auto;margin:0;border:0!important;outline:0!important;box-shadow:none!important;background:none!important;color:var(--pf-ink);font:inherit;font-size:13px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:0!important;border-radius:0}'
    + '.pf-q input::placeholder{color:var(--pf-mu);font-weight:500}'
    + '.pf-lst{margin-top:8px;border:1px solid var(--pf-ln);border-radius:10px;max-height:236px;overflow:auto}'
    + '.pf-it{display:flex;align-items:center;gap:10px;width:100%;padding:8px 12px;border:0;border-top:1px solid var(--pf-ln);background:none;color:var(--pf-ink);font:inherit;font-size:12px;font-weight:600;letter-spacing:.03em;text-transform:uppercase;text-align:left;cursor:pointer}'
    + '.pf-it:first-child{border-top:0}.pf-it:hover{background:var(--pf-sf2)}'
    + '.pf-it .pf-bx{width:16px;height:16px;border-radius:4px;border:2px solid var(--pf-ln);flex:none}'
    + '.pf-it[aria-checked="true"]{background:var(--pf-acs)}.pf-it[aria-checked="true"] .pf-bx{background:var(--pf-ac);border-color:var(--pf-ac)}'
    + '.pf-it.uno .pf-bx{border-radius:50%}'
    + '.pf-it mark{background:none;color:var(--pf-ac);font-weight:800}'
    + '.pf-it .pf-n{margin-left:auto;color:var(--pf-mu);font-weight:500;padding-left:8px}'
    + '.pf-it span.pf-t{min-width:0;overflow:hidden;text-overflow:ellipsis}'
    + '.pf-vacio{padding:12px;color:var(--pf-mu);font-size:12px}'
    + '.pf-mini{display:flex;justify-content:space-between;gap:8px;font-size:10.5px;color:var(--pf-mu);margin-top:6px;letter-spacing:.04em;text-transform:uppercase}'
    + '.pf-mini button{background:none;border:0;color:var(--pf-mu);font:inherit;text-decoration:underline;cursor:pointer;padding:0}'
    + '.pf-pie{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 18px;border-top:1px solid var(--pf-ln);flex:none}'
    + '.pf-pie span{font-size:10.5px;color:var(--pf-mu);letter-spacing:.04em;text-transform:uppercase}'
    + '.pf-pie div{display:flex;gap:8px;margin-left:auto}'
    + '.pf-b2{height:38px;padding:0 14px;border-radius:10px;border:1px solid var(--pf-ln);background:var(--pf-sf2);color:var(--pf-ink);font:inherit;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;cursor:pointer}'
    + '.pf-b2.pri{background:var(--pf-ac);border-color:var(--pf-ac);color:#0B1220}'
    + '.pf button:focus-visible,.pf input:focus-visible{outline:2px solid var(--pf-ac);outline-offset:2px}'
    + '.pf-velo{display:none}'
    + '.pf-rg{display:grid;grid-template-columns:1fr 1fr;gap:10px}'
    + '.pf-rg label{display:block;min-width:0}'
    + '.pf-rg span{display:block;font-size:11px;font-weight:600;color:var(--pf-mu);margin:0 0 5px}'
    + '.pf .pf-rg input{width:100%;min-width:0;height:40px;margin:0;padding:0 12px;border-radius:10px;border:1px solid var(--pf-ln);background:var(--pf-sf2);color:var(--pf-ink);font:inherit;font-size:13px;font-weight:600;box-shadow:none}'
    + '.pf .pf-rg input:focus{border-color:var(--pf-ac);outline:0}'
    // celular: hoja desde abajo
    + '@media (max-width:640px){'
    + '.pf-pan{position:fixed;left:0;right:0;bottom:0;top:auto;width:auto;max-height:86vh;border-radius:18px 18px 0 0;border-top:1px solid var(--pf-ln);padding-bottom:env(safe-area-inset-bottom,0px)}'
    + '.pf-cab{display:flex;justify-content:space-between;align-items:center;padding:12px 18px 0}.pf-cab b{font-size:15px;letter-spacing:.06em}'
    + '.pf-cab::before{content:"";position:absolute;left:50%;top:6px;width:40px;height:4px;margin-left:-20px;border-radius:4px;background:var(--pf-ln)}'
    + '.pf-cuerpo{grid-template-columns:1fr}'
    + '.pf-velo{display:block;position:fixed;inset:0;background:rgba(5,10,20,.5);z-index:59}.pf-velo[hidden]{display:none}'
    + '.pf-pie span{display:none}.pf-pie div{width:100%}.pf-pie .pri{flex:1}'
    + '.pf .pf-rg input{font-size:16px}'
    + '}';

  var ICF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg>';
  var ICQ = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
  var MUCHAS = 8;   // con más opciones que esto, el campo trae buscador y lista

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // Para buscar: mayúsculas, sin acentos y sin signos (la Ñ se queda)
  function norm(s) {
    return String(s == null ? '' : s).toUpperCase().replace(/Ñ/g, '\u0001').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\u0001/g, 'Ñ').replace(/[^A-Z0-9Ñ]+/g, ' ').trim();
  }
  function pasa(texto, q) {
    if (!q) return true;
    var t = norm(texto);
    return q.split(' ').every(function (w) { return t.indexOf(w) >= 0; });
  }
  // Resalta la primera palabra buscada dentro del nombre (si aparece tal cual, sin acentos de por medio)
  function resalta(t, q) {
    var e = esc(t);
    if (!q) return e;
    var w = q.split(' ')[0], i = String(t).toUpperCase().indexOf(w);
    if (i < 0) return e;
    return esc(t.slice(0, i)) + '<mark>' + esc(t.slice(i, i + w.length)) + '</mark>' + esc(t.slice(i + w.length));
  }
  function ponCss() {
    if (document.getElementById('pf-css')) return;
    var st = document.createElement('style'); st.id = 'pf-css'; st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  var NUM = 0;
  function crea(cfg) {
    ponCss();
    var yo = 'filtros-' + (++NUM);   // su nombre para «un solo menú a la vez» (js/portal.js, PORTAL.abreMenu)
    var raiz = document.createElement('div'); raiz.className = 'pf';
    cfg.donde.appendChild(raiz);
    // En el celular la ventana va directo en la página (hoja desde abajo), fuera de los recuadros que la podrían cortar
    var capa = document.createElement('div'); capa.className = 'pf pf-capa';
    function celular() { return window.matchMedia('(max-width:640px)').matches; }
    var grupos = cfg.grupos.filter(function (g) { return g && g.campos && g.campos.length; });
    var tab = 0, abierto = false, qs = {};
    var todos = [];
    grupos.forEach(function (g) { g.campos.forEach(function (c) { todos.push(c); }); });

    function lista(c) {
      var v = c.valor();
      if (c.tipo === 'rango') return [0, 1].map(function (j) { var x = (v || [])[j]; return x == null ? '' : String(x); });
      return c.tipo === 'texto' ? (v ? [v] : []) : (v || []).map(String);
    }
    function igual(a, b) { return a.length === b.length && a.slice().sort().join('\u0001') === b.slice().sort().join('\u0001'); }
    function puesto(c) {
      var l = lista(c);
      if (c.tipo === 'rango') return l.some(function (x) { return x.trim() !== ''; });
      if (c.defecto) return !igual(l, c.defecto.map(String));
      return l.length > 0 && !(c.tipo === 'texto' && !String(l[0]).trim());
    }
    // cómo queda un campo sin filtro (el de «defecto» regresa a lo suyo)
    function vacio(c) { return c.tipo === 'texto' ? '' : c.tipo === 'rango' ? ['', ''] : (c.defecto ? c.defecto.map(String) : []); }
    function nombreDe(c, v) {
      var o = (c.opciones ? c.opciones() : []).filter(function (x) { return String(x.v) === String(v); })[0];
      return o ? o.t : v;
    }
    function avisa() { if (cfg.cambio) cfg.cambio(); pinta(); }

    function barra() {
      var n = todos.filter(puesto).length;
      var h = '<button type="button" class="pf-btn" aria-expanded="' + abierto + '" aria-haspopup="dialog">' + ICF + 'Filtros'
        + (n ? '<span class="pf-num">' + n + '</span>' : '') + '</button>';
      todos.forEach(function (c, i) {
        if (!puesto(c)) return;
        var vs = lista(c);
        var txt = c.chip ? c.chip(vs) : c.tipo === 'texto' ? vs[0] : c.tipo === 'rango' ? vs.filter(function (x) { return x; }).join(' a ')
          : vs.length === 1 ? nombreDe(c, vs[0]) : vs.length;
        h += '<button type="button" class="pf-chip" data-q="' + i + '" title="Quitar este filtro"><span>' + esc(c.t) + ': ' + esc(txt) + '</span><i aria-hidden="true">×</i></button>';
      });
      if (n) h += '<button type="button" class="pf-lim">' + esc(cfg.limpiarTxt || 'Limpiar todo') + '</button>';
      return h;
    }
    function campo(c, i) {
      var h = '<div class="pf-campo" data-i="' + i + '"><span class="pf-lbl">' + esc(c.t) + '</span>';
      if (c.tipo === 'texto') {
        return h + '<div class="pf-q">' + ICQ + '<input type="text" data-txt="' + i + '" value="' + esc(lista(c)[0] || '') + '" placeholder="Escribe…" autocomplete="off" spellcheck="false"></div></div>';
      }
      if (c.tipo === 'rango') {
        var vr = lista(c), et = c.etiquetas || ['Desde', 'Hasta'], fe = c.entrada === 'fecha';
        return h + '<div class="pf-rg">' + [0, 1].map(function (j) {
          return '<label><span>' + esc(et[j]) + '</span><input ' + (fe ? 'type="date"' : 'type="text" inputmode="decimal"')
            + ' data-rg="' + i + ':' + j + '" value="' + esc(vr[j]) + '" autocomplete="off" spellcheck="false" aria-label="' + esc(c.t + ' · ' + et[j]) + '"></label>';
        }).join('') + '</div></div>';
      }
      var ops = c.opciones() || [], sel = lista(c);
      if (ops.length <= MUCHAS && !c.buscar && !c.lista) {
        h += '<div class="pf-seg">';
        if (!c.defecto) h += '<button type="button" data-todo="' + i + '" aria-pressed="' + !sel.length + '">' + esc(c.todos || 'Todos') + '</button>';
        ops.forEach(function (o) {
          h += '<button type="button" data-op="' + i + '" data-v="' + esc(o.v) + '" aria-pressed="' + (sel.indexOf(String(o.v)) >= 0) + '">' + esc(o.t) + '</button>';
        });
        return h + '</div></div>';
      }
      return h + (c.lista && !c.buscar ? '' : '<div class="pf-q">' + ICQ + '<input type="search" data-q="' + i + '" value="' + esc(qs[i] || '') + '" placeholder="Escribe para buscar…" autocomplete="off" spellcheck="false" aria-label="Buscar ' + esc(c.t) + '"></div>')
        + '<div class="pf-lst" role="listbox" aria-multiselectable="' + (c.tipo === 'varios') + '" data-l="' + i + '">' + filas(c, i) + '</div>'
        + '<div class="pf-mini" data-m="' + i + '">' + mini(c, i) + '</div></div>';
    }
    function visibles(c, i) {
      var q = norm(qs[i] || ''), sel = lista(c);
      var ops = (c.opciones() || []).filter(function (o) { return pasa(o.t, q); });
      // lo marcado, primero
      return ops.sort(function (a, b) { return (sel.indexOf(String(b.v)) >= 0) - (sel.indexOf(String(a.v)) >= 0); });
    }
    function filas(c, i) {
      var q = norm(qs[i] || ''), sel = lista(c), ops = visibles(c, i);
      if (!ops.length) return '<div class="pf-vacio">Nada con «' + esc(qs[i]) + '»</div>';
      return ops.slice(0, 300).map(function (o) {
        var on = sel.indexOf(String(o.v)) >= 0;
        return '<button type="button" class="pf-it' + (c.tipo === 'uno' ? ' uno' : '') + '" role="option" data-op="' + i + '" data-v="' + esc(o.v) + '" aria-checked="' + on + '">'
          + '<span class="pf-bx"></span><span class="pf-t">' + resalta(o.t, q) + '</span>' + (o.n != null ? '<span class="pf-n">' + esc(o.n) + '</span>' : '') + '</button>';
      }).join('');
    }
    function mini(c, i) {
      var tot = (c.opciones() || []).length, vis = visibles(c, i).length, sel = lista(c).length;
      return '<span>' + vis + ' de ' + tot + (c.tipo === 'varios' ? ' · se pueden marcar varios' : '') + (sel ? ' · ' + sel + ' marcado' + (sel > 1 ? 's' : '') : '') + '</span>'
        + (c.tipo === 'varios' && qs[i] && vis ? '<button type="button" data-todos="' + i + '">Marcar los ' + vis + '</button>' : sel ? '<button type="button" data-todo="' + i + '">Quitar</button>' : '');
    }
    function panel() {
      var h = '<div class="pf-cab"><b>FILTROS</b><button type="button" class="pf-lim" data-cierra="1">Cerrar</button></div>';
      if (grupos.length > 1) {
        h += '<div class="pf-tabs" role="tablist">' + grupos.map(function (g, gi) {
          var n = g.campos.filter(puesto).length;
          return '<button type="button" role="tab" data-tab="' + gi + '" aria-selected="' + (gi === tab) + '">' + esc(g.t) + (n ? '<b>' + n + '</b>' : '') + '</button>';
        }).join('') + '</div>';
      }
      h += '<div class="pf-cuerpo">' + grupos[tab].campos.map(function (c) { return campo(c, todos.indexOf(c)); }).join('') + '</div>';
      var r = cfg.resultados ? cfg.resultados() : 'Listo';
      var nota = cfg.nota === false ? '' : (cfg.nota || 'Lo que escribes se pasa a mayúsculas; acentos y signos no importan');
      h += '<div class="pf-pie">' + (nota ? '<span>' + esc(nota) + '</span>' : '') + '<div>'
        + '<button type="button" class="pf-b2" data-limpia="1">Limpiar</button><button type="button" class="pf-b2 pri" data-cierra="1">' + esc(r) + '</button></div></div>';
      return h;
    }
    function pinta() {
      var foco = document.activeElement, fq = foco && (raiz.contains(foco) || capa.contains(foco)) && foco.tagName === 'INPUT' ? foco.getAttribute('data-q') || foco.getAttribute('data-txt') || foco.getAttribute('data-rg') : null;
      var pos = 0, cual = fq == null ? 'q' : foco.hasAttribute('data-txt') ? 'txt' : foco.hasAttribute('data-rg') ? 'rg' : 'q';
      try { pos = fq != null ? foco.selectionStart || 0 : 0; } catch (e) { pos = 0; }
      var ventana = '<div class="pf-velo"' + (abierto ? '' : ' hidden') + '></div>'
        + '<div class="pf-pan" role="dialog" aria-label="Filtros"' + (abierto ? '' : ' hidden') + '>' + (abierto ? panel() : '') + '</div>';
      var aparte = abierto && celular();
      raiz.innerHTML = barra() + (aparte ? '' : ventana);
      capa.innerHTML = aparte ? ventana : '';
      if (aparte && !capa.parentNode) document.body.appendChild(capa);
      if (!aparte && capa.parentNode) capa.parentNode.removeChild(capa);
      if (fq != null && abierto) {
        var el = zona().querySelector('input[data-' + cual + '="' + fq + '"]');
        if (el) { el.focus(); try { el.setSelectionRange(pos, pos); } catch (e) { /* sin cursor */ } }
      }
      ajusta();
    }
    // En computadora y tableta la ventana va pegada al botón pero fija en la pantalla (position:fixed), para que ningún
    // recuadro de la página la corte (Héctor Daniel, 4-nov-2026, con la captura de Clientes › Claves SAT y renovaciones:
    // al escoger un cliente la lista quedaba de un renglón y su recuadro, que no deja salir nada, cortaba la ventana).
    // Abre hacia abajo; si abajo no cabe y arriba hay más lugar, hacia arriba. Nunca pasa de los bordes de la pantalla
    // (a lo ancho, 16 px antes del borde derecho; a lo alto, 8 px y debajo de un encabezado pegado arriba): si es más
    // alta que el lugar, su cuerpo se desliza por dentro. Sigue al botón si la página o un recuadro se deslizan, y se
    // cierra si el botón ya no se ve. Si algo de la página hace que «fixed» no cuente desde la pantalla (un recuadro con
    // transform), lo mide y lo corrige.
    function tope() {
      var t = 8, h = document.querySelector('header.band');
      if (h && !raiz.closest('header.band')) {
        var cs = getComputedStyle(h);
        if ((cs.position === 'sticky' || cs.position === 'fixed') && h.getClientRects().length) t = Math.max(t, h.getBoundingClientRect().bottom + 8);
      }
      return t;
    }
    // ¿Se ve el botón? (dentro de la pantalla y de los recuadros que lo podrían esconder)
    function seVe(el) {
      if (!el || !el.getClientRects().length) return false;
      var r = el.getBoundingClientRect(), a = r.top, b = r.bottom, iz = r.left, de = r.right;
      for (var p = el.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
        var cs = getComputedStyle(p);
        if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue;
        var q = p.getBoundingClientRect();
        a = Math.max(a, q.top); b = Math.min(b, q.bottom); iz = Math.max(iz, q.left); de = Math.min(de, q.right);
      }
      a = Math.max(a, 0); b = Math.min(b, window.innerHeight); iz = Math.max(iz, 0); de = Math.min(de, document.documentElement.clientWidth);
      return b - a > 1 && de - iz > 1;
    }
    // Los avisos chicos de abajo (PORTAL.avisoChico, en la página de más arriba) flotan encima de todo, también del
    // marco de esta pantalla: la ventana se queda arriba de ellos («Menús y submenús siempre a la vista»: nada la tapa,
    // ni los avisos flotantes; en la revisión de este cambio «… te pide autorizar 1 cambio al portal» tapaba su botón
    // de abajo). Regresa dónde empiezan, en pixeles de esta página, o null si no hay o no tocan ese tramo a lo ancho.
    function avisosArriba(iz, de) {
      try {
        var w = window, dx = 0, dy = 0;
        while (w !== w.top) {
          var fe = w.frameElement; if (!fe) return null;
          var rf = fe.getBoundingClientRect(); dx += rf.left + fe.clientLeft; dy += rf.top + fe.clientTop; w = w.parent;
        }
        var c = w.document.getElementById('pa-avisos');
        if (!c || !c.children.length) return null;
        var cs = w.getComputedStyle(c);
        if (cs.display === 'none' || cs.visibility === 'hidden') return null;
        var a = c.getBoundingClientRect();
        if (!a.height || a.right - dx <= iz || a.left - dx >= de) return null;
        return a.top - dy;
      } catch (e) { return null; }
    }
    // celular: la hoja desde abajo deja libre lo que ocupan los avisos (su botón de abajo queda arriba de ellos)
    function ajustaHoja() {
      var pan = capa.querySelector('.pf-pan');
      if (!pan) return;
      var av = avisosArriba(0, document.documentElement.clientWidth);
      pan.style.paddingBottom = av != null ? Math.ceil(window.innerHeight - av + 8) + 'px' : '';
    }
    function ajusta() {
      if (abierto && celular()) return ajustaHoja();
      var pan = raiz.querySelector('.pf-pan'), btn = raiz.querySelector('.pf-btn');
      if (!abierto || !pan || !btn) return;
      if (!seVe(btn)) return abre(false);
      var vw = document.documentElement.clientWidth, vh = window.innerHeight, t0 = tope();
      var b = btn.getBoundingClientRect(), r0 = raiz.getBoundingClientRect(), s = pan.style;
      s.position = 'fixed'; s.right = 'auto'; s.top = '0px'; s.bottom = 'auto'; s.left = '0px';
      // a lo ancho: empieza donde la barra y llega, como mucho, a 16 px del borde derecho
      var izq = Math.max(8, Math.min(r0.left, vw - 16 - 240));
      s.maxWidth = Math.max(240, Math.floor(vw - izq - 16)) + 'px';
      // a lo alto: su alto natural (hasta 620 px) contra el lugar de abajo (sin pasar de los avisos) y el de arriba
      var av = avisosArriba(izq, izq + pan.getBoundingClientRect().width), piso = vh - 8;
      if (av != null) piso = Math.min(piso, av - 8);
      s.maxHeight = Math.max(160, Math.min(620, vh - t0 - 8)) + 'px';
      var alto = pan.getBoundingClientRect().height;
      var abajo = piso - (b.bottom + 6), arriba = (b.top - 6) - t0;
      var haciaAbajo = abajo >= alto || abajo >= 320 || abajo >= arriba;
      s.maxHeight = Math.max(160, Math.floor(Math.min(620, haciaAbajo ? abajo : arriba))) + 'px';
      if (haciaAbajo) { s.top = (b.bottom + 6) + 'px'; s.bottom = 'auto'; } else { s.top = 'auto'; s.bottom = (vh - (b.top - 6)) + 'px'; }
      s.left = izq + 'px';
      // si un recuadro de la página cambia desde dónde cuenta «fixed», se corrige con lo que de verdad quedó
      var r = pan.getBoundingClientRect(), dx = izq - r.left;
      if (Math.abs(dx) > 0.5) s.left = (izq + dx) + 'px';
      if (haciaAbajo) { var dy = (b.bottom + 6) - r.top; if (Math.abs(dy) > 0.5) s.top = (b.bottom + 6 + dy) + 'px'; }
      else { var db = r.bottom - (b.top - 6); if (Math.abs(db) > 0.5) s.bottom = (vh - (b.top - 6) + db) + 'px'; }
    }
    // la sigue al deslizar la página o un recuadro (una vez por cuadro) y si la página cambia de tamaño
    var cuadro = 0;
    function sigue(e) {
      if (!abierto || cuadro) return;
      var pan = raiz.querySelector('.pf-pan');
      if (e && e.target && e.target.nodeType === 1 && pan && pan.contains(e.target)) return;   // sus propias listas
      cuadro = requestAnimationFrame(function () { cuadro = 0; ajusta(); });
    }
    var docAv = null;   // la página de más arriba avisa cuando llega o se va un aviso chico
    try { docAv = window.top.document; docAv.addEventListener('profase-avisos', sigue); } catch (e) { docAv = null; }
    var obs = null;
    try { obs = new ResizeObserver(function () { sigue(); }); obs.observe(document.documentElement); if (document.body) obs.observe(document.body); } catch (e) { obs = null; }
    // Al escribir en un buscador solo se vuelve a pintar su lista, para no perder el cursor
    function zona() { return capa.parentNode ? capa : raiz; }
    function pintaLista(i) {
      var c = todos[i], l = zona().querySelector('[data-l="' + i + '"]'), m = zona().querySelector('[data-m="' + i + '"]');
      if (l) { l.innerHTML = filas(c, i); l.scrollTop = 0; }
      if (m) m.innerHTML = mini(c, i);
    }
    function abre(v) {
      if (v && !abierto) { try { if (window.PORTAL && window.PORTAL.abreMenu) window.PORTAL.abreMenu(yo); } catch (e) { /* sin aviso */ } }
      abierto = v; pinta(); if (v) { var b = zona().querySelector('.pf-pan input,.pf-pan button'); if (b && !celular()) b.focus(); }
    }
    function limpiaTodo() {
      qs = {};
      if (cfg.limpiar) cfg.limpiar(); else todos.forEach(function (c) { c.pon(vacio(c)); });
      avisa();
    }

    function clic(e) {
      var t = e.target.closest('button');
      if (!t || !(raiz.contains(t) || capa.contains(t))) { if (e.target.classList && e.target.classList.contains('pf-velo')) abre(false); return; }
      if (t.classList.contains('pf-btn')) return abre(!abierto);
      if (t.classList.contains('pf-chip')) { var c0 = todos[+t.dataset.q]; c0.pon(vacio(c0)); return avisa(); }
      if (t.dataset.cierra) return abre(false);
      if (t.dataset.limpia || (t.classList.contains('pf-lim') && !t.dataset.cierra)) return limpiaTodo();
      if (t.dataset.tab != null) { tab = +t.dataset.tab; return pinta(); }
      if (t.dataset.todo != null) { var c1 = todos[+t.dataset.todo]; c1.pon(vacio(c1)); return avisa(); }
      if (t.dataset.todos != null) {
        var ci = +t.dataset.todos, cc = todos[ci], ya = lista(cc);
        visibles(cc, ci).forEach(function (o) { if (ya.indexOf(String(o.v)) < 0) ya.push(String(o.v)); });
        cc.pon(ya); return avisa();
      }
      if (t.dataset.op != null) {
        var c = todos[+t.dataset.op], v = t.dataset.v, sel = lista(c), k = sel.indexOf(v);
        if (c.tipo === 'uno') sel = k >= 0 ? [] : [v];
        else if (k >= 0) sel.splice(k, 1); else sel.push(v);
        c.pon(sel); return avisa();
      }
    }
    function escribe(e) {
      var t = e.target;
      if (t.tagName !== 'INPUT') return;
      // un rango (montos o fechas): se guarda al dejar de escribir; sus campos no se pasan a mayúsculas
      if (t.dataset.rg != null) {
        var pr = t.dataset.rg.split(':'), cr = todos[+pr[0]];
        clearTimeout(cr._t);
        cr._t = setTimeout(function () { var v = lista(cr); v[+pr[1]] = t.value.trim(); cr.pon(v); if (cfg.cambio) cfg.cambio(); pinta(); }, t.type === 'date' ? 0 : 350);
        return;
      }
      // todo en mayúsculas mientras se escribe
      var p = t.selectionStart, up = t.value.toUpperCase();
      if (up !== t.value) { t.value = up; try { t.setSelectionRange(p, p); } catch (er) { /* sin cursor */ } }
      if (t.dataset.q != null) { qs[t.dataset.q] = t.value; pintaLista(+t.dataset.q); return; }
      if (t.dataset.txt != null) {
        var c = todos[+t.dataset.txt];
        clearTimeout(c._t);
        c._t = setTimeout(function () { c.pon(t.value); if (cfg.cambio) cfg.cambio(); pinta(); }, 250);
      }
    }
    function tecla(e) {
      if (e.key === 'Escape' && abierto) { e.stopPropagation(); abre(false); var b = raiz.querySelector('.pf-btn'); if (b) b.focus(); }
      if (e.key === 'Enter' && e.target.dataset && e.target.dataset.q != null) {
        // Enter marca la primera de la lista
        var i = +e.target.dataset.q, o = visibles(todos[i], i)[0];
        if (o) { e.preventDefault(); var c = todos[i], sel = lista(c); if (sel.indexOf(String(o.v)) < 0) { c.pon(c.tipo === 'uno' ? [String(o.v)] : sel.concat(String(o.v))); qs[i] = ''; avisa(); } }
      }
    }
    [raiz, capa].forEach(function (z) { z.addEventListener('click', clic); z.addEventListener('input', escribe); z.addEventListener('keydown', tecla); });
    function fuera(e) { if (abierto && !raiz.contains(e.target) && !capa.contains(e.target)) abre(false); }
    // un solo menú a la vez (Daniel, 30-oct-2026: «que no se entrelapen»): si se abre otro menú o se toca fuera de esta pestaña, se cierra
    function otro(e) { if (abierto && e.detail !== yo) abre(false); }
    function tam() { if (!abierto) return; if (celular() !== !!capa.parentNode) pinta(); else ajusta(); }
    document.addEventListener('mousedown', fuera);
    document.addEventListener('profase-menu', otro);
    window.addEventListener('resize', tam);
    document.addEventListener('scroll', sigue, { capture: true, passive: true });
    function destruye() {
      document.removeEventListener('mousedown', fuera); document.removeEventListener('profase-menu', otro);
      window.removeEventListener('resize', tam);
      document.removeEventListener('scroll', sigue, { capture: true, passive: true });
      if (obs) { try { obs.disconnect(); } catch (e) { /* nada */ } }
      if (docAv) { try { docAv.removeEventListener('profase-avisos', sigue); } catch (e) { /* nada */ } }
      if (cuadro) cancelAnimationFrame(cuadro);
      if (capa.parentNode) capa.parentNode.removeChild(capa);
      if (raiz.parentNode) raiz.parentNode.removeChild(raiz);
    }
    pinta();
    return { pinta: pinta, abre: function () { abre(true); }, cierra: function () { abre(false); }, raiz: raiz,
             abierto: function () { return abierto; }, destruye: destruye };
  }

  window.PROFASE_FILTROS = { crea: crea, norm: norm, pasa: pasa };
})();
