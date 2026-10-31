/* Portal PROFASE · Recorridos guiados de lo nuevo (30-oct-2026, pedido de Daniel para el chat interno: «hazlo tipo
   walkthrough este cambio; así como esto es nuevo y flechita; aquí le picas, aquí no sé qué»).
   Se oscurece la pantalla, se ilumina una parte (también si está dentro del marco de una pestaña), una flechita naranja
   la señala y un globo explica qué es y dónde picarle: «Atrás», «Siguiente» y «Saltar» (Esc). Funciona en celular,
   tableta y computadora, y en modo claro u oscuro. Quién ya vio cada recorrido lo guarda la base
   (portal/sql/59_recorridos.sql); eso lo hace la pestaña que lo lanza.
   Uso: PROFASE_RECORRIDO.corre({ pasos: [{ el: () => elemento o null, titulo, texto, etiqueta: 'Nuevo', icono: 'candado',
                                            antes: async () => {} }] }) → promesa: 'fin' o 'saltado'.
   Un paso sin «el» sale al centro, sin flechita. Si su parte no está a la vista, el paso se brinca.
   «A la vista» es de verdad (30-oct-2026, Daniel con una captura del celular: el paso «En el menú RH» iluminaba un
   pedazo vacío del Inicio): dentro de la pantalla, no escondida (visibility, display u opacidad) y no fuera de la
   pantalla (el menú del celular cerrado vive a la izquierda, fuera de ella). PROFASE_RECORRIDO.aLaVista(el) es la
   misma revisión; PROFASE_RECORRIDO.sePuede(el) es la que usan los recorridos para escoger entre varias partes: no
   escondida y dentro de lo ancho de la pantalla (lo que está más abajo sí cuenta: el motor la acerca antes de iluminarla).
   menu: 'rh' (y sub: 'rh-vacaciones', opcional): el paso abre ese módulo donde esté el menú de quien lo ve (riel, menú
   arriba o el ☰ del celular, con PORTAL_MENU.ensena) e ilumina su tarjeta u opción; al pasar a otro paso o al terminar,
   el menú se vuelve a cerrar solo.
   obligatorio: true (regla de Daniel, 30-oct-2026, para los cambios del chat: «que a todos nos obligues a verlo»):
   sin «Saltar» ni Esc; solo se sale llegando al final.
   Último paso de todos (regla de Daniel, 31-oct-2026, 5:04): dónde está SuperConta (IA) para sus dudas. Lo registra
   PROFASE_RECORRIDO.alFinal(() => paso) (portal/guia_tab.js) y se agrega solo; sinCierre: true lo apaga (los de SuperConta). */
(function () {
  'use strict';
  if (window.PROFASE_RECORRIDO) return;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var CSS = ''
    + '.rc-capa{position:fixed;inset:0;z-index:2147483000;font-family:var(--f-body,"Public Sans","Segoe UI",system-ui,sans-serif)}'
    + '.rc-capa.sin-luz{background:rgba(8,14,28,.66)}'
    + '.rc-luz{position:fixed;border-radius:12px;box-shadow:0 0 0 9999px rgba(8,14,28,.66);transition:left .25s ease,top .25s ease,width .25s ease,height .25s ease;pointer-events:none}'
    + '.rc-luz::after{content:"";position:absolute;inset:-4px;border-radius:15px;border:3px solid #F07A1E;animation:rc-late 1.6s ease-in-out infinite}'
    + '@keyframes rc-late{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.55;transform:scale(1.035)}}'
    + '.rc-globo{position:fixed;width:min(370px,calc(100vw - 24px));background:var(--surface,#fff);color:var(--ink,#132036);border-radius:14px;border-top:5px solid #F07A1E;box-shadow:0 18px 50px rgba(0,0,0,.35);padding:14px 16px 12px;transition:left .25s ease,top .25s ease}'
    + '.rc-globo.centro{width:min(420px,calc(100vw - 24px))}'
    + '.rc-cab{display:flex;align-items:center;gap:8px;margin-bottom:6px}'
    + '.rc-et{background:#F07A1E;color:#fff;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;border-radius:999px;padding:3px 10px}'
    + '.rc-ic{width:30px;height:30px;border-radius:50%;background:#1F3864;color:#fff;display:grid;place-items:center;flex:none}'
    + '.rc-ic svg{width:17px;height:17px}'
    + '.rc-globo h3{margin:0 0 4px;font-family:var(--f-display,"Archivo","Arial Narrow",Arial,sans-serif);font-stretch:85%;font-size:20px;font-weight:800;line-height:1.15;color:inherit}'
    + '.rc-globo p{margin:0;font-size:14.5px;line-height:1.45;color:inherit;opacity:.92}'
    + '.rc-pie{display:flex;align-items:center;gap:8px;margin-top:12px}'
    + '.rc-n{flex:1;font-size:12.5px;color:var(--muted,#5A6577)}'
    + '.rc-pie button{font:inherit;font-size:14px;font-weight:700;border-radius:10px;padding:8px 14px;cursor:pointer;border:1px solid var(--line-strong,#C4CDDA);background:var(--surface,#fff);color:inherit}'
    + '.rc-pie .rc-sig{background:#F07A1E;border-color:#F07A1E;color:#fff}'
    + '.rc-pie .rc-salta{border:0;background:none;color:var(--muted,#5A6577);font-weight:600;padding:8px 4px}'
    + '.rc-pie button:focus-visible{outline:2px solid #1F3864;outline-offset:2px}'
    + '.rc-espera{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:var(--surface,#fff);color:var(--ink,#132036);border-radius:999px;padding:10px 18px;font-size:14.5px;font-weight:600;box-shadow:0 10px 30px rgba(0,0,0,.3);display:flex;align-items:center;gap:10px}'
    + '.rc-espera i{width:16px;height:16px;border-radius:50%;border:2.5px solid #C4CDDA;border-top-color:#F07A1E;animation:rc-gira .8s linear infinite}'
    + '@keyframes rc-gira{to{transform:rotate(360deg)}}'
    + ':root[data-theme="dark"] .rc-espera{background:var(--surface,#141C2B);color:var(--ink,#E5EAF2)}'
    + '.rc-flecha{position:fixed;width:42px;height:42px;color:#F07A1E;filter:drop-shadow(0 2px 4px rgba(0,0,0,.35));pointer-events:none}'
    + '.rc-flecha svg{width:100%;height:100%;display:block}'
    + '.rc-flecha.arriba svg{animation:rc-sube 1s ease-in-out infinite}.rc-flecha.abajo svg{animation:rc-baja 1s ease-in-out infinite}'
    + '.rc-flecha.izq svg{animation:rc-izq 1s ease-in-out infinite}.rc-flecha.der svg{animation:rc-der 1s ease-in-out infinite}'
    + '@keyframes rc-sube{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}@keyframes rc-baja{0%,100%{transform:translateY(0) rotate(180deg)}50%{transform:translateY(7px) rotate(180deg)}}'
    + '@keyframes rc-izq{0%,100%{transform:translateX(0) rotate(-90deg)}50%{transform:translateX(-7px) rotate(-90deg)}}@keyframes rc-der{0%,100%{transform:translateX(0) rotate(90deg)}50%{transform:translateX(7px) rotate(90deg)}}'
    + ':root[data-theme="dark"] .rc-globo{background:var(--surface,#141C2B);color:var(--ink,#E5EAF2)}'
    + ':root[data-theme="dark"] .rc-ic{background:#2B4C86}'
    + '@media (max-width:600px){.rc-globo h3{font-size:18px}.rc-globo p{font-size:14px}.rc-pie button{padding:8px 11px}}'
    + '@media (prefers-reduced-motion: reduce){.rc-luz,.rc-globo{transition:none}.rc-luz::after,.rc-flecha svg,.rc-espera i{animation:none!important}}';
  var FLECHA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2 4 11h5v10h6V11h5z"/></svg>';
  var ICONOS = {
    candado: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.1A8.5 8.5 0 1 1 21 12Z"/></svg>',
    listo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>'
  };

  // dónde está una parte en la pantalla, aunque viva dentro del marco de una pestaña
  function caja(el) {
    try {
      if (!el || !el.getClientRects().length) return null;
      var r = el.getBoundingClientRect(), x = r.left, y = r.top, w = el.ownerDocument.defaultView;
      while (w && w !== window && w.frameElement) {
        var f = w.frameElement.getBoundingClientRect();
        x += f.left + (w.frameElement.clientLeft || 0); y += f.top + (w.frameElement.clientTop || 0); w = w.parent;
      }
      if (r.width < 2 || r.height < 2) return null;
      return { x: x, y: y, w: r.width, h: r.height };
    } catch (e) { return null; }
  }
  function dentro(el) {
    try {
      var r = el.getBoundingClientRect(), v = el.ownerDocument.defaultView;
      if (r.top < 0 || r.bottom > v.innerHeight || r.left < 0 || r.right > v.innerWidth) el.scrollIntoView({ block: 'center', inline: 'nearest' });
    } catch (e) { /* se queda donde está */ }
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(v, b)); }
  // ¿se ve de verdad? (no escondida, no transparente, y al menos un pedazo dentro de la pantalla)
  function aLaVista(el) {
    try {
      var g = caja(el);
      if (!g) return false;
      var x = el, w = el.ownerDocument.defaultView;
      while (x) {
        if (x.nodeType === 1) {
          var cs = w.getComputedStyle(x);
          if (cs.display === 'none' || cs.visibility === 'hidden' || cs.visibility === 'collapse' || +cs.opacity < 0.05) return false;
        }
        if (x.parentElement) { x = x.parentElement; continue; }
        // sube al marco de la pestaña, si vive dentro de uno
        x = w.frameElement || null; w = x ? x.ownerDocument.defaultView : null;
      }
      var vw = innerWidth, vh = innerHeight;
      var ancho = Math.min(g.x + g.w, vw) - Math.max(g.x, 0), alto = Math.min(g.y + g.h, vh) - Math.max(g.y, 0);
      return ancho >= Math.min(g.w, 24) * 0.6 && alto >= Math.min(g.h, 16) * 0.6;
    } catch (e) { return false; }
  }
  // para escoger entre varias partes: no escondida y dentro de lo ancho de la pantalla (lo de más abajo sí cuenta)
  function sePuede(el) {
    try {
      var g = caja(el);
      if (!g) return false;
      var x = el, w = el.ownerDocument.defaultView;
      while (x) {
        if (x.nodeType === 1) {
          var cs = w.getComputedStyle(x);
          if (cs.display === 'none' || cs.visibility === 'hidden' || cs.visibility === 'collapse' || +cs.opacity < 0.05) return false;
        }
        if (x.parentElement) { x = x.parentElement; continue; }
        x = w.frameElement || null; w = x ? x.ownerDocument.defaultView : null;
      }
      return Math.min(g.x + g.w, innerWidth) - Math.max(g.x, 0) >= Math.min(g.w, 24) * 0.6;
    } catch (e) { return false; }
  }
  function dormir(ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); }
  var menuAbierto = false;
  function sueltaMenu() {
    if (!menuAbierto) return false;
    menuAbierto = false;
    try { if (window.PORTAL_MENU && window.PORTAL_MENU.suelta) window.PORTAL_MENU.suelta(); } catch (e) { /* ya cerrado */ }
    return true;
  }
  // abre el módulo «k» del menú donde esté (riel, arriba o ☰ del celular) y regresa lo que se ilumina
  async function abreMenu(k, sub) {
    var M = window.PORTAL_MENU;
    if (!M || !M.ensena) return null;
    var c = null;
    try { c = M.ensena(k); } catch (e) { c = null; }
    menuAbierto = true;
    await dormir(320);   // el ☰ del celular se desliza en .2 s
    if (!c) return null;
    var o = sub ? c.querySelector('a[data-k="' + sub + '"]') : null;
    return o && aLaVista(o) ? o : c;
  }

  var activo = false, cierre = null;
  function corre(def) {
    if (activo || !def || !def.pasos || !def.pasos.length) return Promise.resolve('ocupado');
    activo = true;
    if (!document.getElementById('rc-css')) { var st = document.createElement('style'); st.id = 'rc-css'; st.textContent = CSS; document.head.appendChild(st); }
    var pasos = def.pasos.slice(), i = 0, el = null, antesFoco = document.activeElement, tick = 0, dir = 1;
    // Todos los recorridos terminan recordando dónde está SuperConta (IA) (regla de Daniel, 31-oct-2026, 5:04: «acaba todos
    // los recorridos con recordarles dónde está SuperConta»). El paso lo da quien lo registra con alFinal() (guia_tab.js,
    // el botón «?»); un recorrido que ya es de SuperConta lo apaga con sinCierre: true.
    if (!def.sinCierre && typeof cierre === 'function') {
      try { var ult = cierre(); if (ult && ult.titulo) pasos.push(ult); } catch (e) { /* sin cierre */ }
    }
    var capa = document.createElement('div'); capa.className = 'rc-capa';
    capa.innerHTML = '<div class="rc-luz" hidden></div><div class="rc-flecha" hidden>' + FLECHA + '</div><div class="rc-espera" role="status" hidden><i></i>Un momento…</div>'
      + '<div class="rc-globo" role="dialog" aria-modal="true" aria-labelledby="rc-t" aria-describedby="rc-p"><div class="rc-cab"></div><h3 id="rc-t"></h3><p id="rc-p"></p>'
      + '<div class="rc-pie"><button type="button" class="rc-salta">Saltar</button><span class="rc-n" aria-live="polite"></span><button type="button" class="rc-atras">Atrás</button><button type="button" class="rc-sig">Siguiente</button></div></div>';
    document.body.appendChild(capa);
    var luz = capa.querySelector('.rc-luz'), flecha = capa.querySelector('.rc-flecha'), globo = capa.querySelector('.rc-globo');
    var espera = capa.querySelector('.rc-espera');
    var bAtras = capa.querySelector('.rc-atras'), bSig = capa.querySelector('.rc-sig'), bSalta = capa.querySelector('.rc-salta');
    return new Promise(function (listo) {
      function termina(como) {
        if (!activo) return;
        activo = false; clearInterval(tick);
        sueltaMenu();
        removeEventListener('resize', acomoda); removeEventListener('keydown', tecla, true);
        capa.remove();
        try { antesFoco && antesFoco.focus && antesFoco.focus(); } catch (e) { /* sin foco */ }
        listo(como);
      }
      function acomoda() {
        var p = pasos[i]; if (!p) return;
        var vw = innerWidth, vh = innerHeight, g = el ? caja(el) : null;
        globo.classList.toggle('centro', !g);
        capa.classList.toggle('sin-luz', !g);
        var bw = globo.offsetWidth, bh = globo.offsetHeight;
        if (!g) {
          luz.hidden = true; flecha.hidden = true;
          globo.style.left = Math.round((vw - bw) / 2) + 'px'; globo.style.top = Math.round(Math.max(12, (vh - bh) / 2)) + 'px';
          return;
        }
        var pad = 6, t = { x: g.x - pad, y: g.y - pad, w: g.w + pad * 2, h: g.h + pad * 2 };
        // una parte enorme (la conversación en el celular): se ilumina lo que se ve
        t.x = clamp(t.x, 4, vw - 8); t.y = clamp(t.y, 4, vh - 8);
        t.w = Math.min(t.w, vw - t.x - 4); t.h = Math.min(t.h, vh - t.y - 4);
        luz.hidden = false;
        luz.style.left = t.x + 'px'; luz.style.top = t.y + 'px'; luz.style.width = t.w + 'px'; luz.style.height = t.h + 'px';
        var hueco = 52, cx = t.x + t.w / 2, cy = t.y + t.h / 2, lado, x, y;
        if (t.y + t.h + hueco + bh <= vh - 8) lado = 'abajo';
        else if (t.y - hueco - bh >= 8) lado = 'arriba';
        else if (t.x + t.w + hueco + bw <= vw - 8) lado = 'der';
        else if (t.x - hueco - bw >= 8) lado = 'izq';
        else lado = 'encima';
        if (lado === 'abajo' || lado === 'arriba') {
          x = clamp(cx - bw / 2, 8, vw - bw - 8); y = lado === 'abajo' ? t.y + t.h + hueco : t.y - hueco - bh;
        } else if (lado === 'der' || lado === 'izq') {
          y = clamp(cy - bh / 2, 8, vh - bh - 8); x = lado === 'der' ? t.x + t.w + hueco : t.x - hueco - bw;
        } else { x = clamp(cx - bw / 2, 8, vw - bw - 8); y = clamp(vh - bh - 16, 8, vh - bh - 8); }
        globo.style.left = Math.round(x) + 'px'; globo.style.top = Math.round(y) + 'px';
        // la flechita, entre el globo y la parte, apuntándole
        flecha.hidden = lado === 'encima';
        flecha.className = 'rc-flecha ' + ({ abajo: 'arriba', arriba: 'abajo', der: 'izq', izq: 'der' }[lado] || '');
        if (lado === 'abajo') { flecha.style.left = Math.round(clamp(cx, x + 22, x + bw - 22) - 21) + 'px'; flecha.style.top = Math.round(t.y + t.h + 4) + 'px'; }
        else if (lado === 'arriba') { flecha.style.left = Math.round(clamp(cx, x + 22, x + bw - 22) - 21) + 'px'; flecha.style.top = Math.round(t.y - 46) + 'px'; }
        else if (lado === 'der') { flecha.style.left = Math.round(t.x + t.w + 4) + 'px'; flecha.style.top = Math.round(clamp(cy, y + 22, y + bh - 22) - 21) + 'px'; }
        else if (lado === 'izq') { flecha.style.left = Math.round(t.x - 46) + 'px'; flecha.style.top = Math.round(clamp(cy, y + 22, y + bh - 22) - 21) + 'px'; }
      }
      async function muestra(n, d) {
        dir = d || 1;
        if (n < 0) n = 0;
        if (n >= pasos.length) { termina('fin'); return; }
        i = n;
        var p = pasos[i];
        globo.style.visibility = 'hidden'; luz.hidden = true; flecha.hidden = true;
        if (sueltaMenu()) await dormir(220);
        if (!activo || i !== n) return;
        if (p.antes) {
          // mientras se abre lo que sigue (por ejemplo, el chat), la pantalla se oscurece y dice «Un momento…»
          capa.classList.add('sin-luz'); espera.hidden = false;
          try { await Promise.race([p.antes(), new Promise(function (ok) { setTimeout(ok, 6000); })]); } catch (e) { /* sigue */ }
          espera.hidden = true;
        }
        if (!activo || i !== n) return;
        el = null;
        if (p.menu) {
          el = await abreMenu(p.menu, p.sub);
          if (!activo || i !== n) return;
          if (!el || !aLaVista(el)) { sueltaMenu(); el = null; }
          if (!el && !p.el) { muestra(n + dir, dir); return; }   // ese módulo no está en su menú: se brinca
        }
        if (!el && p.el) {
          try { el = typeof p.el === 'function' ? p.el() : document.querySelector(p.el); } catch (e) { el = null; }
          if (!el || !caja(el)) { muestra(n + dir, dir); return; }   // no está a la vista: se brinca
          dentro(el);
          if (!aLaVista(el)) { muestra(n + dir, dir); return; }      // fuera de la pantalla o escondida: se brinca
        }
        capa.querySelector('.rc-cab').innerHTML = (p.icono && ICONOS[p.icono] ? '<span class="rc-ic">' + ICONOS[p.icono] + '</span>' : '')
          + (p.etiqueta ? '<span class="rc-et">' + esc(p.etiqueta) + '</span>' : '');
        capa.querySelector('.rc-cab').hidden = !(p.icono || p.etiqueta);
        capa.querySelector('#rc-t').textContent = p.titulo || '';
        capa.querySelector('#rc-p').textContent = p.texto || '';
        capa.querySelector('.rc-n').textContent = (i + 1) + ' de ' + pasos.length;
        bAtras.hidden = i === 0;
        var ultimo = i === pasos.length - 1;
        bSig.textContent = ultimo ? (def.fin || 'Terminar') : 'Siguiente';
        bSalta.hidden = ultimo || !!def.obligatorio;
        acomoda();
        globo.style.visibility = '';
        try { bSig.focus({ preventScroll: true }); } catch (e) { /* sin foco */ }
      }
      function tecla(ev) {
        if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); if (!def.obligatorio) termina('saltado'); }
        else if (ev.key === 'ArrowRight') { ev.preventDefault(); ev.stopPropagation(); muestra(i + 1, 1); }
        else if (ev.key === 'ArrowLeft' && i > 0) { ev.preventDefault(); ev.stopPropagation(); muestra(i - 1, -1); }
        else if (ev.key === 'Tab') {
          var bs = Array.prototype.filter.call(globo.querySelectorAll('button'), function (b) { return !b.hidden; });
          var k = bs.indexOf(document.activeElement);
          ev.preventDefault(); (bs[(k + (ev.shiftKey ? -1 : 1) + bs.length) % bs.length] || bSig).focus();
        }
      }
      bSig.onclick = function () { muestra(i + 1, 1); };
      bAtras.onclick = function () { muestra(i - 1, -1); };
      bSalta.onclick = function () { if (!def.obligatorio) termina('saltado'); };
      addEventListener('resize', acomoda);
      addEventListener('keydown', tecla, true);
      tick = setInterval(function () { if (activo && globo.style.visibility !== 'hidden') acomoda(); }, 500);   // sigue a la parte si algo se mueve
      muestra(0, 1);
    });
  }
  window.PROFASE_RECORRIDO = { corre: corre, activo: function () { return activo; }, aLaVista: aLaVista, sePuede: sePuede,
                                alFinal: function (fn) { cierre = typeof fn === 'function' ? fn : null; } };
})();
