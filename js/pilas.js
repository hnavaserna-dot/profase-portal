/* Portal PROFASE · «Tu trabajo»: las pilas de lo que le toca atender a cada quien y el menú «Más ▾» de las herramientas.
   Una sola pieza para Reportes (Depuración de CxC / CxP, Variaciones / Movimientos, Reclasificación de activo fijo y Carga
   de Quo). Héctor Daniel, 4 y 5-nov-2026: «quiero optimizar esos reportes para encontrar cosas fáciles y también poder
   trabajar desde ahí (los contadores)»; «agarráralo como base [la vista nueva de la Cartera que pidió Fernando] pero
   hazlo mejor»; a la propuesta: «Si asi es».

   No lee ni escribe nada de la base: solo pinta lo que le da la página, con los mismos números de la lista que tiene a la
   vista (así las pilas siempre cuadran con lo que sale abajo).

   PROFASE_PILAS.pinta(donde, {
     titulo: 'Tu trabajo · tus clientes', meta: '2 clientes · 2026 · datos al …',
     pilas: [{k, t, n, d, tono: 'rojo'|'ambar'|'azul'|'naranja'|'violeta'|'verde'|'gris', on, tag: 'Te toca', title}],
     alPicar: k => …,                       // la página filtra y vuelve a pintar (pica otra vez la misma: quita el filtro)
     boton: {t: 'Empezar a revisar', n, alPicar: () => …} | null,   // abre la primera en el seguimiento
     nota: 'texto chico junto al botón', extra: [nodos] })           // p. ej. «Ver gráfica mes a mes ▾»
   PROFASE_PILAS.mas({id, etiqueta: 'Más'}) → {w, b, nb, m, abre(v), pon(nodos), cuenta(n, title)}
     Un menú del portal: avisa al abrirse (PORTAL.abreMenu) y se cierra si se abre otro, al picar afuera o con Esc. Lo que se
     pica adentro lo cierra (salvo lo que lleva data-mas-queda). Siempre cabe: si abajo no hay lugar, abre hacia arriba, y si
     es más alto que la pantalla, se desliza por dentro. Si nada de lo de adentro se ve (todo escondido para quien entró),
     «Más ▾» no sale.

   UX PROFASE (Héctor Daniel Nava, 5-nov-2026, 23:08: «quiero que… todos los menús y sub menús tengan el UX profase… si no
   lo tienen hazlo; y recuerda: ese UX Profase ya es regla para todo lo nuevo»). La barra de trabajo de arriba, la misma en
   todas las pantallas (antes cada una la armaba a mano):
   PROFASE_PILAS.barra(donde, {
     buscar: elInput | {id, placeholder, alEscribir: q => …},   // el buscador (si la pantalla ya tenía uno, se mueve aquí)
                                                                // (o el de clientes de js/buscador.js: su caja se mueve tal cual)
     periodo: [nodos],                                          // lo que recarga los datos (año, mes, periodo), a la vista
     filtros: {grupos, cambio, …},                              // lo de PROFASE_FILTROS.crea, sin «donde» → r.f
     botones: [nodos],                                          // lo que siempre se ve (Excel con su PDF, la acción del día)
     mas: [[nodos], [nodos]],                                   // lo que se usa menos, por grupos → r.mas
     caja: true })                                              // con su recuadro (cuando va suelta, arriba de las pilas)
   → {w, q, f, mas}. Los nodos que ya existían se mueven (no se copian): sus botones siguen haciendo lo mismo.
   PROFASE_PILAS.nav({ids, id, abre: id => …, antes: el | donde: el, clase: 'btn'})   // «‹ 3 de 25 Siguiente ›»
     Para ir uno por uno en la ficha o ventana que abre la pantalla («Empezar a revisar»): se pone junto a su «Cerrar» y
     abre el anterior o el siguiente de la lista. Regresa {sig, ant} (el id del siguiente y del anterior) o null. */
(function () {
  'use strict';
  if (window.PROFASE_PILAS) return;

  var TONOS = {
    rojo: ['#B42318', '#F2857A'], ambar: ['#B7791F', '#F2B544'], azul: ['#1F3864', '#8FB3F0'], naranja: ['#D9620B', '#F59A4A'],
    violeta: ['#6B46C1', '#B69CF2'], verde: ['#2F855A', '#5FCF8E'], gris: ['#5B6B7D', '#9AA8B8']
  };
  var CSS = Object.keys(TONOS).map(function (t) {
      return '.ppl-p[data-tono="' + t + '"]{--c:' + TONOS[t][0] + '}:root[data-theme="dark"] .ppl-p[data-tono="' + t + '"]{--c:' + TONOS[t][1] + '}';
    }).join('')
    + '.ppl{--pp-sf:var(--surface,#FFFFFF);--pp-sf2:var(--surface-2,#F3F5F8);--pp-ln:var(--line,#DDE3EA);--pp-ink:var(--ink,var(--fg,#132036));'
    + '--pp-ink2:var(--ink-2,var(--fg-2,#4E5D6E));--pp-mu:var(--ink-3,var(--muted,#7B8A9B));--pp-nv:#1F3864;--pp-ac:#F07A1E;'
    + 'margin:0 0 14px;min-width:0;color:var(--pp-ink);box-sizing:border-box}'
    + ':root[data-theme="dark"] .ppl{--pp-nv:#8FB3F0}'
    + '.ppl[hidden]{display:none!important}'
    + '.ppl *{box-sizing:border-box}'
    + '.ppl-cab{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:2px 14px;margin:0 2px 8px;min-width:0}'
    + '.ppl-h{margin:0;font-size:11.5px;font-weight:750;letter-spacing:.09em;text-transform:uppercase;color:var(--pp-ink2);line-height:1.35}'
    + '.ppl-meta{font-size:12px;color:var(--pp-mu);line-height:1.35;overflow-wrap:anywhere}'
    + '.ppl-g{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(160px,1fr))}'
    + '.ppl-p{--c:#1F3864;position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:2px;min-width:0;text-align:left;'
    + 'font:inherit;color:var(--pp-ink);background:var(--pp-sf);border:1px solid var(--pp-ln);border-top:3px solid var(--c);'
    + 'border-radius:12px;padding:10px 12px 11px;cursor:pointer;box-shadow:0 1px 2px rgba(19,32,54,.05)}'
    + '.ppl-p:hover{border-color:var(--c)}'
    + '.ppl-p[aria-pressed="true"]{background:color-mix(in srgb,var(--c) 9%,var(--pp-sf));border-color:var(--c);box-shadow:0 0 0 1.5px var(--c) inset}'
    + '.ppl-p:focus-visible{outline:2px solid var(--pp-ac);outline-offset:2px}'
    + '.ppl-p.cero .ppl-n{color:var(--pp-mu)}'
    + '.ppl-t{font-size:11px;font-weight:750;letter-spacing:.06em;text-transform:uppercase;line-height:1.3;color:var(--c);overflow-wrap:anywhere}'
    + '.ppl-p.con-tag .ppl-t{padding-right:52px}.ppl-p.con-x .ppl-t{padding-right:18px}'
    + '.ppl-n{font-size:24px;font-weight:750;line-height:1.15;color:var(--pp-ink);font-variant-numeric:tabular-nums}'
    + '.ppl-d{font-size:12px;line-height:1.35;color:var(--pp-mu);overflow-wrap:anywhere}'
    + '.ppl-tag{position:absolute;top:8px;right:8px;font-size:9.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;'
    + 'background:#F07A1E;color:#FFFFFF;border-radius:999px;padding:2px 7px;line-height:1.4}'
    + '.ppl-x{position:absolute;top:8px;right:10px;font-size:11px;font-weight:800;color:var(--c)}'
    + '.ppl-tag + .ppl-x{display:none}'
    + '.ppl-acc{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-top:10px;min-width:0}'
    + '.ppl-go{font:inherit;font-size:13.5px;font-weight:700;border:0;border-radius:10px;padding:9px 16px;min-height:40px;cursor:pointer;'
    + 'background:#1F3864;color:#FFFFFF;white-space:normal;line-height:1.25;text-align:center;box-shadow:0 1px 2px rgba(19,32,54,.12)}'
    + ':root[data-theme="dark"] .ppl-go{background:#F07A1E;color:#FFFFFF}'
    + '.ppl-go:hover{filter:brightness(1.12)}'
    + '.ppl-go:focus-visible{outline:2px solid var(--pp-ac);outline-offset:2px}'
    + '.ppl-go[disabled]{background:var(--pp-sf2);color:var(--pp-mu);cursor:default;box-shadow:none;filter:none}'
    + '.ppl-hint{flex:1 1 220px;min-width:0;font-size:12px;line-height:1.4;color:var(--pp-mu)}'
    + '.ppl-extra{display:inline-flex;flex-wrap:wrap;gap:8px;min-width:0}'
    + '.ppl-extra:empty{display:none}'
    + '@media (max-width:600px){.ppl-g{grid-template-columns:1fr 1fr;gap:8px}'
    + '.ppl-g .ppl-p:last-child:nth-child(odd){grid-column:1/-1}.ppl-n{font-size:20px}.ppl-p{padding:9px 10px 10px}.ppl-t{letter-spacing:.03em}.ppl-go{width:100%}.ppl-hint{flex-basis:100%}}'
    // «Más ▾»
    + '.ppl-masw{position:relative;display:inline-flex}'
    + '.ppl-masb{display:inline-flex;align-items:center;gap:6px}'
    + '.ppl-masb .ppl-masn{background:#F07A1E;color:#fff;border-radius:999px;padding:0 7px;font-size:11px;font-weight:700;line-height:18px}'
    + '.ppl-masb .ppl-masn[hidden]{display:none}'
    + '.ppl-masm{position:absolute;right:0;top:calc(100% + 6px);z-index:40;min-width:250px;max-width:min(340px,calc(100vw - 24px));'
    + 'background:var(--surface,#FFFFFF);color:var(--ink,var(--fg,#132036));border:1px solid var(--line,#DDE3EA);border-radius:14px;'
    + 'box-shadow:0 12px 32px rgba(10,18,32,.18);padding:8px;display:grid;gap:6px;overflow:auto;overscroll-behavior:contain;box-sizing:border-box}'
    + '.ppl-masm[hidden]{display:none!important}'
    + '.ppl-masm .ppl-masi{display:flex;flex-direction:column;gap:6px;min-width:0}'
    + '.ppl-masm .ppl-masi:empty{display:none}'
    + '.ppl-masm .ppl-masi + .ppl-masi{border-top:1px solid var(--line-2,var(--line,#E6EAF0));padding-top:6px}'
    + '.ppl-masm .ppl-masi > button,.ppl-masm .ppl-masi > a,.ppl-masm .ppl-masi > label{width:100%;justify-content:flex-start;text-align:left;margin:0}'
    + '.ppl-masm .ppl-masi > [hidden]{display:none!important}'
    + '.ppl-masw[hidden]{display:none!important}'
    // la barra de trabajo (UX PROFASE)
    + '.ppl-bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px;margin:0 0 12px;min-width:0;max-width:100%;box-sizing:border-box}'
    + '.ppl-bar[hidden]{display:none!important}'
    + '.ppl-bar.caja{background:var(--surface,#FFFFFF);border:1px solid var(--line,#DDE3EA);border-radius:12px;padding:11px 14px}'
    + '.ppl-q{flex:1 1 260px;min-width:0;position:relative;display:flex;align-items:center;margin:0}'
    + '.ppl-qn{flex:1 1 260px;min-width:0;display:block;margin:0}.ppl-qn > *{margin:0;max-width:100%}'
    + '.ppl-q svg{position:absolute;left:10px;width:15px;height:15px;color:var(--muted,var(--ink-3,#7B8A9B));pointer-events:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}'
    + '.ppl-q input{width:100%;max-width:none;font:inherit;font-size:13.5px;padding:9px 12px 9px 33px;min-height:38px;border:1px solid var(--line,#DDE3EA);'
    + 'border-radius:10px;background:var(--surface-2,#F3F5F8);color:var(--ink,var(--fg,#132036));box-sizing:border-box;margin:0}'
    + '.ppl-q input:focus{outline:none;border-color:#F07A1E;box-shadow:0 0 0 2px rgba(240,122,30,.2)}'
    + '.ppl-bf{display:contents}.ppl-bar .pf{margin:0}'
    + '.ppl-per{display:inline-flex;flex-wrap:wrap;gap:8px;min-width:0}'
    + '.ppl-per select,.ppl-per input{font:inherit;font-size:13.5px;padding:8px 10px;min-height:38px;max-width:100%;border:1px solid var(--line,#DDE3EA);'
    + 'border-radius:10px;background:var(--surface,#FFFFFF);color:var(--ink,var(--fg,#132036));box-sizing:border-box;margin:0}'
    + '.ppl-bb{display:inline-flex;flex-wrap:wrap;align-items:center;gap:8px;min-width:0}.ppl-bb:empty{display:none}'
    + '.ppl-bb > [hidden]{display:none!important}'
    + '.ppl-bar .ppl-masb{font:inherit;font-size:13px;font-weight:600;border:1px solid var(--line,#DDE3EA);border-radius:10px;'
    + 'background:var(--surface,#FFFFFF);color:var(--ink,var(--fg,#132036));padding:8px 13px;min-height:38px;cursor:pointer;box-sizing:border-box}'
    + '.ppl-bar .ppl-masb:hover{background:var(--surface-2,#F3F5F8)}'
    + '.ppl-masm .btn{width:100%;justify-content:flex-start;text-align:left;margin:0}'
    + '.ppl-nav{display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap;flex:none}'
    + '.ppl-navn{font-size:12.5px;opacity:.8;font-variant-numeric:tabular-nums;white-space:nowrap}'
    + '.ppl-nav [disabled]{opacity:.45;cursor:default}'
    /* en el celular, «‹ 1 de 5 Siguiente ›» baja a su propio renglón debajo del título de la ficha (si no, el título queda
       de una o dos palabras por renglón; revisión del 6-nov-2026) */
    + '@media (max-width:600px){.ppl-navp{flex-wrap:wrap!important}.ppl-navp>:not(.ppl-nav):not(.ppl-navc){flex:1 1 100%}'
    + '.ppl-navp>.ppl-nav{order:99;flex:1 1 auto;margin-top:2px}.ppl-navp>.ppl-navc{order:100;margin-left:auto;margin-top:2px}}'
    + '@media (max-width:600px){.ppl-q,.ppl-qn{flex-basis:100%}.ppl-q input{font-size:16px}.ppl-per select,.ppl-per input{font-size:16px}}';

  function estilos() {
    if (document.getElementById('ppl-css')) return;
    var s = document.createElement('style'); s.id = 'ppl-css'; s.textContent = CSS; document.head.appendChild(s);
  }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var fmt = new Intl.NumberFormat('es-MX');

  function pinta(donde, o) {
    if (!donde) return null;
    estilos(); o = o || {};
    var foco = null;
    try { var a = document.activeElement; if (a && donde.contains(a)) foco = a.getAttribute('data-ppl') || (a.classList.contains('ppl-go') ? 'go' : null); } catch (e) { /* nada */ }
    var pilas = (o.pilas || []).filter(function (p) { return p && !p.oculta; });
    if (!pilas.length && !o.boton) { donde.hidden = true; donde.innerHTML = ''; return null; }
    donde.hidden = false; donde.classList.add('ppl');
    donde.setAttribute('aria-label', o.titulo || 'Tu trabajo');
    var h = '<div class="ppl-cab"><h2 class="ppl-h">' + esc(o.titulo || 'Tu trabajo') + '</h2>'
      + (o.meta ? '<span class="ppl-meta">' + esc(o.meta) + '</span>' : '') + '</div>';
    h += '<div class="ppl-g" role="group" aria-label="' + esc(o.titulo || 'Tu trabajo') + '">';
    pilas.forEach(function (p) {
      var n = Number(p.n) || 0;
      h += '<button type="button" class="ppl-p' + (n ? '' : ' cero') + (p.tag ? ' con-tag' : (p.on ? ' con-x' : '')) + '" data-ppl="' + esc(p.k) + '" aria-pressed="' + (!!p.on) + '"'
        + ' data-tono="' + (TONOS[p.tono] ? p.tono : 'azul') + '"' + (p.title ? ' title="' + esc(p.title) + '"' : '') + '>'
        + '<span class="ppl-t">' + esc(p.t) + '</span><span class="ppl-n">' + esc(p.txt != null ? p.txt : fmt.format(n)) + '</span>'
        + (p.d ? '<span class="ppl-d">' + esc(p.d) + '</span>' : '')
        + (p.tag ? '<span class="ppl-tag">' + esc(p.tag) + '</span>' : '')
        + (p.on ? '<span class="ppl-x" aria-hidden="true">✕</span>' : '') + '</button>';
    });
    h += '</div>';
    var bt = o.boton, conAcc = bt || (o.extra && o.extra.length) || o.nota;
    if (conAcc) {
      h += '<div class="ppl-acc">';
      if (bt) h += '<button type="button" class="ppl-go"' + (bt.n === 0 ? ' disabled' : '') + (bt.title ? ' title="' + esc(bt.title) + '"' : '') + '>'
        + esc(bt.t || 'Empezar a revisar') + (bt.n != null ? ' (' + fmt.format(bt.n) + ')' : '') + ' ›</button>';
      if (o.nota) h += '<span class="ppl-hint">' + esc(o.nota) + '</span>';
      h += '<span class="ppl-extra"></span></div>';
    }
    donde.innerHTML = h;
    Array.prototype.forEach.call(donde.querySelectorAll('.ppl-p'), function (b) {
      b.onclick = function () { if (o.alPicar) o.alPicar(b.getAttribute('data-ppl')); };
    });
    var go = donde.querySelector('.ppl-go');
    if (go) go.onclick = function () { if (bt && bt.alPicar) bt.alPicar(); };
    var ex = donde.querySelector('.ppl-extra');
    if (ex && o.extra) o.extra.forEach(function (n) { if (n) ex.appendChild(n); });
    if (foco) { var f = foco === 'go' ? go : donde.querySelector('[data-ppl="' + foco.replace(/"/g, '') + '"]'); if (f) try { f.focus({ preventScroll: true }); } catch (e) { /* nada */ } }
    return donde;
  }

  function mas(o) {
    estilos(); o = o || {};
    var id = o.id || ('ppl-mas-' + Math.random().toString(36).slice(2, 7));
    var w = document.createElement('span'); w.className = 'ppl-masw';
    var b = document.createElement('button'); b.type = 'button'; b.id = id; b.className = 'ppl-masb ' + (o.clase || '');
    b.setAttribute('aria-haspopup', 'true'); b.setAttribute('aria-expanded', 'false');
    b.appendChild(document.createTextNode((o.etiqueta || 'Más') + ' ▾'));
    var nb = document.createElement('b'); nb.className = 'ppl-masn'; nb.hidden = true; b.appendChild(nb);
    var m = document.createElement('div'); m.className = 'ppl-masm'; m.id = id + 'm'; m.hidden = true;
    m.setAttribute('role', 'group'); m.setAttribute('aria-label', o.etiqueta || 'Más');
    w.appendChild(b); w.appendChild(m);
    function coloca() {
      m.style.left = ''; m.style.right = ''; m.style.top = ''; m.style.bottom = ''; m.style.maxHeight = '';
      var rb = b.getBoundingClientRect(), H = window.innerHeight || document.documentElement.clientHeight;
      var abajo = H - rb.bottom - 12, arriba = rb.top - 12;
      if (m.scrollHeight > abajo && arriba > abajo) { m.style.top = 'auto'; m.style.bottom = 'calc(100% + 6px)'; m.style.maxHeight = Math.max(160, arriba) + 'px'; }
      else m.style.maxHeight = Math.max(160, abajo) + 'px';
      var r = m.getBoundingClientRect();
      if (r.left < 8) { m.style.right = 'auto'; m.style.left = '0'; }
      r = m.getBoundingClientRect();
      var W = window.innerWidth || document.documentElement.clientWidth;
      if (r.right > W - 8) { m.style.left = 'auto'; m.style.right = '0'; }
    }
    function abre(v) {
      m.hidden = !v; b.setAttribute('aria-expanded', String(!!v));
      if (v) {
        try { if (window.PORTAL && window.PORTAL.abreMenu) window.PORTAL.abreMenu(id); } catch (e) { /* sin aviso */ }
        coloca();
      }
    }
    b.onclick = function () { abre(m.hidden); };
    m.addEventListener('click', function (ev) {
      var x = ev.target && ev.target.closest && ev.target.closest('button,a');
      if (x && !ev.target.closest('[data-mas-queda]')) setTimeout(function () { abre(false); }, 0);
    });
    document.addEventListener('mousedown', function (ev) { if (!m.hidden && !w.contains(ev.target)) abre(false); });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !m.hidden) { abre(false); try { b.focus(); } catch (e) { /* nada */ } } });
    document.addEventListener('profase-menu', function (ev) { if (ev.detail !== id && !m.hidden) abre(false); });
    window.addEventListener('resize', function () { if (!m.hidden) coloca(); });
    // si nada de lo de adentro se ve, «Más ▾» no sale (cada pantalla esconde lo que no le toca a quien entró)
    function revisa() {
      var hay = Array.prototype.some.call(m.querySelectorAll('.ppl-masi > *'), function (x) {
        return !x.hidden && x.style.display !== 'none' && !(x.classList && x.classList.contains('oculto'));
      });
      if (w.hidden === hay) w.hidden = !hay;
      if (!hay && !m.hidden) abre(false);
    }
    try { new MutationObserver(revisa).observe(m, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'style', 'class'] }); } catch (e) { /* sin observador */ }
    function grupo() { var g = document.createElement('div'); g.className = 'ppl-masi'; m.appendChild(g); return g; }
    function pon(nodos) { var g = grupo(); (nodos || []).forEach(function (n) { if (n) g.appendChild(n); }); revisa(); return g; }
    function cuenta(n, title) { nb.hidden = !n; nb.textContent = n ? fmt.format(n) : ''; b.title = n && title ? title : ''; }
    return { w: w, b: b, nb: nb, m: m, abre: abre, pon: pon, grupo: grupo, cuenta: cuenta, revisa: revisa };
  }

  var LUPA = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>';
  function barra(donde, o) {
    if (!donde) return null;
    estilos(); o = o || {};
    donde.classList.add('ppl-bar'); if (o.caja) donde.classList.add('caja'); donde.hidden = false;
    var r = { w: donde, q: null, f: null, mas: null };
    if (o.buscar && o.buscar.nodeType === 1 && !/^(INPUT|TEXTAREA)$/.test(o.buscar.tagName)) {
      // un buscador que ya es una pieza (el de clientes de js/buscador.js): se mueve tal cual, en el lugar del buscador
      var qn = document.createElement('span'); qn.className = 'ppl-qn'; qn.appendChild(o.buscar);
      donde.appendChild(qn); r.q = o.buscar.querySelector('input');
    } else if (o.buscar) {
      var lb = document.createElement('label'); lb.className = 'ppl-q'; lb.innerHTML = LUPA;
      var inp = o.buscar.nodeType === 1 ? o.buscar : document.createElement('input');
      if (inp !== o.buscar) {
        inp.type = 'search'; inp.autocomplete = 'off'; if (o.buscar.id) inp.id = o.buscar.id;
        inp.placeholder = o.buscar.placeholder || 'Buscar';
        inp.setAttribute('aria-label', o.buscar.etiqueta || o.buscar.placeholder || 'Buscar');
        if (o.buscar.alEscribir) { var t = 0; inp.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { o.buscar.alEscribir(inp.value.trim()); }, 200); }); }
      }
      inp.hidden = false; inp.classList.remove('ancho');
      lb.appendChild(inp); donde.appendChild(lb); r.q = inp;
    }
    if (o.periodo && o.periodo.length) {   // lo que recarga los datos (año, mes o periodo): a la vista, no dentro de FILTROS
      var pp = document.createElement('span'); pp.className = 'ppl-per';
      o.periodo.forEach(function (n) { if (n) pp.appendChild(n); });   // lo que la pantalla esconde (p. ej. el día sin mes) sigue escondido
      donde.appendChild(pp);
    }
    if (o.filtros && window.PROFASE_FILTROS) {
      var sf = document.createElement('span'); sf.className = 'ppl-bf'; donde.appendChild(sf);
      var cfg = {}; Object.keys(o.filtros).forEach(function (k) { cfg[k] = o.filtros[k]; }); cfg.donde = sf;
      r.f = window.PROFASE_FILTROS.crea(cfg);
    }
    var bb = document.createElement('span'); bb.className = 'ppl-bb';
    (o.botones || []).forEach(function (n) { if (n) bb.appendChild(n); });
    donde.appendChild(bb);
    if (o.mas && o.mas.length) {
      r.mas = mas({ id: o.masId || (donde.id ? donde.id + '-mas' : null), etiqueta: o.masEtiqueta || 'Más' });
      o.mas.forEach(function (g) { r.mas.pon(Array.isArray(g) ? g : [g]); });
      donde.appendChild(r.mas.w);
    }
    return r;
  }

  function nav(o) {
    o = o || {};
    var ids = o.ids || [], ix = ids.indexOf(o.id), n = ids.length;
    if (ix < 0 || n < 2 || !(o.antes || o.donde)) return null;
    estilos();
    var c = esc(o.clase || 'btn');
    var w = document.createElement('span'); w.className = 'ppl-nav';
    w.innerHTML = '<button type="button" class="' + c + '" data-nav="-1" aria-label="El anterior"' + (ix ? '' : ' disabled') + '>‹</button>'
      + '<span class="ppl-navn">' + fmt.format(ix + 1) + ' de ' + fmt.format(n) + '</span>'
      + '<button type="button" class="' + c + '" data-nav="1"' + (ix < n - 1 ? '' : ' disabled') + '>Siguiente ›</button>';
    w.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-nav]');
      if (!b || b.disabled) return;
      e.preventDefault(); e.stopPropagation();
      var x = ids[ix + Number(b.getAttribute('data-nav'))];
      if (x != null && o.abre) o.abre(x);
    });
    if (o.antes && o.antes.parentNode) {
      var pa = o.antes.parentNode; pa.insertBefore(w, o.antes);
      try { if (/flex/.test(getComputedStyle(pa).display)) { pa.classList.add('ppl-navp'); o.antes.classList.add('ppl-navc'); } } catch (e) { /* nada */ }
    } else o.donde.appendChild(w);
    return { w: w, sig: ix < n - 1 ? ids[ix + 1] : null, ant: ix ? ids[ix - 1] : null };
  }

  window.PROFASE_PILAS = { pinta: pinta, mas: mas, barra: barra, nav: nav };
})();
