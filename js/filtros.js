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
   f.pinta();   // cuando cambian los datos o el estado desde fuera */
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
    + '.pf-pan{position:absolute;left:0;top:calc(100% + 6px);z-index:60;width:min(880px,calc(100vw - 32px));max-height:min(620px,calc(100vh - 120px));display:flex;flex-direction:column;background:var(--pf-sf);color:var(--pf-ink);border:1px solid var(--pf-ln);border-top:3px solid var(--pf-ac);border-radius:14px;box-shadow:0 18px 48px rgba(10,18,32,.28)}'
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
    // celular: hoja desde abajo
    + '@media (max-width:640px){'
    + '.pf-pan{position:fixed;left:0;right:0;bottom:0;top:auto;width:auto;max-height:86vh;border-radius:18px 18px 0 0;border-top:1px solid var(--pf-ln);padding-bottom:env(safe-area-inset-bottom,0px)}'
    + '.pf-cab{display:flex;justify-content:space-between;align-items:center;padding:12px 18px 0}.pf-cab b{font-size:15px;letter-spacing:.06em}'
    + '.pf-cab::before{content:"";position:absolute;left:50%;top:6px;width:40px;height:4px;margin-left:-20px;border-radius:4px;background:var(--pf-ln)}'
    + '.pf-cuerpo{grid-template-columns:1fr}'
    + '.pf-velo{display:block;position:fixed;inset:0;background:rgba(5,10,20,.5);z-index:59}.pf-velo[hidden]{display:none}'
    + '.pf-pie span{display:none}.pf-pie div{width:100%}.pf-pie .pri{flex:1}'
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

    function lista(c) { var v = c.valor(); return c.tipo === 'texto' ? (v ? [v] : []) : (v || []).map(String); }
    function puesto(c) { return lista(c).length > 0 && !(c.tipo === 'texto' && !String(lista(c)[0]).trim()); }
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
        var txt = c.tipo === 'texto' ? vs[0] : vs.length === 1 ? nombreDe(c, vs[0]) : vs.length;
        h += '<button type="button" class="pf-chip" data-q="' + i + '" title="Quitar este filtro"><span>' + esc(c.t) + ': ' + esc(txt) + '</span><i aria-hidden="true">×</i></button>';
      });
      if (n) h += '<button type="button" class="pf-lim">Limpiar todo</button>';
      return h;
    }
    function campo(c, i) {
      var h = '<div class="pf-campo" data-i="' + i + '"><span class="pf-lbl">' + esc(c.t) + '</span>';
      if (c.tipo === 'texto') {
        return h + '<div class="pf-q">' + ICQ + '<input type="text" data-txt="' + i + '" value="' + esc(lista(c)[0] || '') + '" placeholder="Escribe…" autocomplete="off" spellcheck="false"></div></div>';
      }
      var ops = c.opciones() || [], sel = lista(c);
      if (ops.length <= MUCHAS && !c.buscar) {
        h += '<div class="pf-seg"><button type="button" data-todo="' + i + '" aria-pressed="' + !sel.length + '">Todos</button>';
        ops.forEach(function (o) {
          h += '<button type="button" data-op="' + i + '" data-v="' + esc(o.v) + '" aria-pressed="' + (sel.indexOf(String(o.v)) >= 0) + '">' + esc(o.t) + '</button>';
        });
        return h + '</div></div>';
      }
      return h + '<div class="pf-q">' + ICQ + '<input type="search" data-q="' + i + '" value="' + esc(qs[i] || '') + '" placeholder="Escribe para buscar…" autocomplete="off" spellcheck="false" aria-label="Buscar ' + esc(c.t) + '"></div>'
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
      h += '<div class="pf-pie"><span>Lo que escribes se pasa a mayúsculas; acentos y signos no importan</span><div>'
        + '<button type="button" class="pf-b2" data-limpia="1">Limpiar</button><button type="button" class="pf-b2 pri" data-cierra="1">' + esc(r) + '</button></div></div>';
      return h;
    }
    function pinta() {
      var foco = document.activeElement, fq = foco && (raiz.contains(foco) || capa.contains(foco)) && foco.tagName === 'INPUT' ? foco.getAttribute('data-q') || foco.getAttribute('data-txt') : null;
      var pos = fq != null ? foco.selectionStart : 0, txtFoco = fq != null && foco.hasAttribute('data-txt');
      var ventana = '<div class="pf-velo"' + (abierto ? '' : ' hidden') + '></div>'
        + '<div class="pf-pan" role="dialog" aria-label="Filtros"' + (abierto ? '' : ' hidden') + '>' + (abierto ? panel() : '') + '</div>';
      var aparte = abierto && celular();
      raiz.innerHTML = barra() + (aparte ? '' : ventana);
      capa.innerHTML = aparte ? ventana : '';
      if (aparte && !capa.parentNode) document.body.appendChild(capa);
      if (!aparte && capa.parentNode) capa.parentNode.removeChild(capa);
      if (fq != null && abierto) {
        var el = zona().querySelector(txtFoco ? 'input[data-txt="' + fq + '"]' : 'input[data-q="' + fq + '"]');
        if (el) { el.focus(); try { el.setSelectionRange(pos, pos); } catch (e) { /* sin cursor */ } }
      }
      ajusta();
    }
    // En computadora y tableta la ventana nunca pasa del borde derecho: su ancho llega, como mucho, hasta 16 px antes
    // del borde, contando desde donde empieza (en tableta la barra puede empezar ya recorrida a la derecha)
    function ajusta() {
      var pan = raiz.querySelector('.pf-pan');
      if (!abierto || celular() || !pan) return;
      pan.style.maxWidth = '';
      var libre = document.documentElement.clientWidth - pan.getBoundingClientRect().left - 16;
      pan.style.maxWidth = Math.max(240, Math.floor(libre)) + 'px';
    }
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
      if (cfg.limpiar) cfg.limpiar(); else todos.forEach(function (c) { c.pon(c.tipo === 'texto' ? '' : []); });
      avisa();
    }

    function clic(e) {
      var t = e.target.closest('button');
      if (!t || !(raiz.contains(t) || capa.contains(t))) { if (e.target.classList && e.target.classList.contains('pf-velo')) abre(false); return; }
      if (t.classList.contains('pf-btn')) return abre(!abierto);
      if (t.classList.contains('pf-chip')) { var c0 = todos[+t.dataset.q]; c0.pon(c0.tipo === 'texto' ? '' : []); return avisa(); }
      if (t.dataset.cierra) return abre(false);
      if (t.dataset.limpia || (t.classList.contains('pf-lim') && !t.dataset.cierra)) return limpiaTodo();
      if (t.dataset.tab != null) { tab = +t.dataset.tab; return pinta(); }
      if (t.dataset.todo != null) { todos[+t.dataset.todo].pon([]); return avisa(); }
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
    document.addEventListener('mousedown', function (e) { if (abierto && !raiz.contains(e.target) && !capa.contains(e.target)) abre(false); });
    // un solo menú a la vez (Daniel, 30-oct-2026: «que no se entrelapen»): si se abre otro menú o se toca fuera de esta pestaña, se cierra
    document.addEventListener('profase-menu', function (e) { if (abierto && e.detail !== yo) abre(false); });
    window.addEventListener('resize', function () { if (!abierto) return; if (celular() !== !!capa.parentNode) pinta(); else ajusta(); });
    pinta();
    return { pinta: pinta, abre: function () { abre(true); }, cierra: function () { abre(false); }, raiz: raiz };
  }

  window.PROFASE_FILTROS = { crea: crea, norm: norm, pasa: pasa };
})();
