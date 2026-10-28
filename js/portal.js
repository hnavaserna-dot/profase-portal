/* Portal PROFASE: sesión, permisos y base de datos.
   Las páginas del equipo se escribieron para la base de Claude (window.claude.use('db'|'user'|'downloads')).
   Aquí se da esa misma interfaz encima de Supabase, para que la página funcione igual fuera de Claude.
   La llave publicable es pública por diseño: lo que cada quien puede leer o escribir lo cuidan las reglas
   de la base (RLS) según su rol, no esta página. */
(function () {
  'use strict';
  var SB_URL = 'https://arbykgauatkldznwwtjx.supabase.co';
  var SB_KEY = 'sb_publishable_gUzFFB-YnzC5AOFOK_-H9Q_jBbDUzG5';
  var DOMINIO = '@usuarios.profase.com.mx';
  var PAGINA = { director: 'director.html', gerente: 'gerentes.html', contador: 'contadores.html' };
  // El director (Daniel) también puede abrir la vista de los gerentes
  var TAMBIEN = { gerente: ['director'] };
  var ROL = document.documentElement.getAttribute('data-rol') || '';
  var CADA = 20000; // revisa cambios cada 20 s mientras la página está a la vista

  var sb = window.supabase.createClient(SB_URL, SB_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'profase-portal' }
  });

  var P = { sb: sb, DOMINIO: DOMINIO, perfil: null, uid: null };
  window.PORTAL = P;

  P.usuarioLimpio = function (u) {
    return String(u || '').split('@')[0].normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().trim().replace(/\s+/g, '.');
  };
  P.correoDe = function (u) { return P.usuarioLimpio(u) + DOMINIO; };
  P.paginaDe = function (rol) { return PAGINA[rol] || './'; };
  P.perfilDe = async function (uid) {
    var r = await sb.from('perfiles').select('id,usuario,nombre,nombre_wf,rol').eq('id', uid).maybeSingle();
    if (r.error) throw r.error;
    return r.data;
  };
  P.salir = async function () {
    try { await sb.auth.signOut(); } catch (e) { /* sin red: igual se va */ }
    location.replace('./');
  };

  /* ---- Sesión: las páginas de rol exigen sesión y el rol correcto ---- */
  P.listo = (async function () {
    if (!ROL) return null;
    var s = (await sb.auth.getSession()).data.session;
    if (!s) { location.replace('./'); throw new Error('sin sesión'); }
    var p = null;
    try { p = await P.perfilDe(s.user.id); } catch (e) { p = null; }
    if (!p) { await sb.auth.signOut(); location.replace('./?e=perfil'); throw new Error('sin perfil'); }
    // «todos»: páginas que abre cualquier rol (la bitácora de variaciones, dentro de su pestaña)
    if (ROL !== 'todos' && p.rol !== ROL && (TAMBIEN[ROL] || []).indexOf(p.rol) < 0) { location.replace(P.paginaDe(p.rol)); throw new Error('otra página'); }
    P.perfil = p; P.uid = s.user.id;
    return p;
  })();
  P.listo.catch(function () {});
  sb.auth.onAuthStateChange(function (ev) { if (ROL && ev === 'SIGNED_OUT') location.replace('./'); });

  /* ---- Errores con los mismos códigos que espera la página ---- */
  function error(e) {
    if (e && e.code && /^[a-z_]+$/.test(e.code)) return e;
    var pg = (e && e.code) || '', st = e && e.status, m = (e && e.message) || String(e || '');
    var code = 'unknown';
    if (pg === '42501' || st === 403 || /row-level security|permission denied/i.test(m)) code = 'not_granted';
    else if (pg === 'PGRST301' || st === 401 || /jwt/i.test(m)) code = 'unauthenticated';
    else if (st === 413) code = 'quota_exceeded';
    else if (e instanceof TypeError || /fetch|network/i.test(m)) code = 'unavailable';
    var x = new Error(m); x.code = code; return x;
  }

  /* ---- Base de datos (tabla docs: colección / documento → JSON) ---- */
  function partir(path) {
    var i = String(path).indexOf('/');
    if (i < 1) throw error({ code: 'invalid_argument', message: 'ruta inválida: ' + path });
    var col = path.slice(0, i), id = path.slice(i + 1);
    // Cada contador lee su propio paquete del WorkFlow en lugar del del equipo
    if (P.perfil && P.perfil.rol === 'contador' && col === 'datos' && id === 'wf_0') id = 'wfc_' + P.perfil.usuario;
    // La vista del director (su página PROFASE) usa sus propios documentos, con EQUILIBRIO
    if (ROL === 'director') {
      if (col === 'datos' && /^(wf|cxc)_\d+$/.test(id)) return ['director', id];
      if (col === 'estado' && id === 'wf') return ['director', 'estado_wf'];
      if (col === 'estado' && id === 'actualizacion') return ['director', 'estado_cxc'];
      if (col === 'estado') return ['privado', id];
      if (col === 'equipo' && id === 'decisiones') return ['privado', 'decisiones'];
      if (col === 'equipo' && id === 'pausas') return ['virtual', 'pausas'];
    }
    return [col, id];
  }

  /* «equipo/pausas» de la página del director: se arma al momento con lo que el equipo marca en el portal */
  var NOMBRES_P = null;
  async function nombresPortal() {
    if (NOMBRES_P) return NOMBRES_P;
    var r = await sb.from('perfiles').select('id,nombre');
    NOMBRES_P = {};
    (r.data || []).forEach(function (p) { NOMBRES_P[p.id] = p.nombre; });
    return NOMBRES_P;
  }
  function mapa(snap) { var o = {}; snap.docs.forEach(function (d) { if (d.exists) o[d.id] = d.data(); }); return o; }
  function pausasVirtual() {
    return {
      id: 'pausas', path: 'equipo/pausas',
      get: async function () {
        var a = await colRef('pausas').get(), b = await colRef('clientes').get(), c = await colRef('sugerencias').get();
        return foto('pausas', { data: { items: mapa(a), clientes: mapa(b), sugerencias: mapa(c), nombres: await nombresPortal(), sincronizadoAt: new Date().toISOString() } });
      },
      set: async function () { throw error({ code: 'not_granted', message: 'Las pausas se cambian en la vista del equipo' }); },
      update: async function () { throw error({ code: 'not_granted', message: 'Las pausas se cambian en la vista del equipo' }); },
      onSnapshot: function (cb, err) {
        var ult = {}, fuera = [];
        async function junta() {
          if (!ult.pausas || !ult.clientes || !ult.sugerencias) return;
          var nom = {};
          try { nom = await nombresPortal(); } catch (e) { nom = {}; }
          cb(foto('pausas', { data: { items: ult.pausas, clientes: ult.clientes, sugerencias: ult.sugerencias, nombres: nom, sincronizadoAt: new Date().toISOString() } }));
        }
        ['pausas', 'clientes', 'sugerencias'].forEach(function (c) {
          fuera.push(colRef(c).onSnapshot(function (snap) { ult[c] = mapa(snap); junta(); }, err));
        });
        return function () { fuera.forEach(function (f) { f(); }); };
      }
    };
  }
  function foto(id, fila) { return { id: id, exists: !!fila, data: function () { return fila ? fila.data : undefined; } }; }
  function mezcla(base, cambios) {
    var out = {}, k;
    for (k in base) if (Object.prototype.hasOwnProperty.call(base, k)) out[k] = base[k];
    for (k in cambios) if (Object.prototype.hasOwnProperty.call(cambios, k)) {
      var v = cambios[k];
      if (v && typeof v === 'object' && v.__delete__ === true) delete out[k]; else out[k] = v;
    }
    return out;
  }
  async function leer(col, id) {
    var r = await sb.from('docs').select('data,version').eq('col', col).eq('id', id).maybeSingle();
    if (r.error) throw error(r.error);
    return r.data;
  }
  async function guardar(col, id, data) {
    var r = await sb.from('docs').upsert({ col: col, id: id, data: data }, { onConflict: 'col,id' });
    if (r.error) throw error(r.error);
    pronto();
  }

  /* Vigilancia: la página pide «avísame si cambia»; se revisa la versión y solo se baja lo que cambió */
  var VIG = new Set(), revisando = false, reloj = null;
  async function revisa(w) {
    try {
      if (w.doc) {
        var r = await sb.from('docs').select('version,updated_at').eq('col', w.col).eq('id', w.id).maybeSingle();
        if (r.error) throw r.error;
        var f = r.data ? r.data.version + '|' + r.data.updated_at : '-';
        if (f === w.firma) return;
        var fila = r.data ? await leer(w.col, w.id) : null;
        w.firma = f; w.cb(foto(w.id, fila));
      } else {
        var q = await sb.from('docs').select('id,version').eq('col', w.col).order('id');
        if (q.error) throw q.error;
        var f2 = (q.data || []).map(function (x) { return x.id + ':' + x.version; }).join(',');
        if (f2 === w.firma) return;
        var t = await sb.from('docs').select('id,data,version').eq('col', w.col).order('id');
        if (t.error) throw t.error;
        var docs = (t.data || []).map(function (x) { return foto(x.id, x); });
        w.firma = f2; w.cb({ docs: docs, size: docs.length, empty: !docs.length });
      }
    } catch (e) { if (w.err) { try { w.err(error(e)); } catch (_) {} } }
  }
  async function vuelta() {
    if (revisando) return;
    revisando = true;
    try { await Promise.all(Array.from(VIG).map(revisa)); } finally { revisando = false; }
  }
  function pronto() { setTimeout(vuelta, 300); }
  function arranca() {
    if (reloj) return;
    reloj = setInterval(function () { if (!document.hidden) vuelta(); }, CADA);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) vuelta(); });
    window.addEventListener('focus', vuelta);
  }
  function vigila(w) {
    VIG.add(w); arranca(); revisa(w);
    return function () { VIG.delete(w); };
  }

  function docRef(path) {
    var c = partir(path), col = c[0], id = c[1];
    if (col === 'virtual') return pausasVirtual();
    return {
      id: id, path: col + '/' + id,
      get: async function () { return foto(id, await leer(col, id)); },
      set: async function (data) { await guardar(col, id, data); },
      update: async function (cambios) { var f = await leer(col, id); await guardar(col, id, mezcla(f ? f.data : {}, cambios)); },
      delete: async function () { var r = await sb.from('docs').delete().eq('col', col).eq('id', id); if (r.error) throw error(r.error); pronto(); },
      onSnapshot: function (cb, err) { return vigila({ doc: true, col: col, id: id, cb: cb, err: err, firma: null }); }
    };
  }
  function colRef(col) {
    return {
      id: col,
      doc: function (id) { return docRef(col + '/' + id); },
      add: async function (data) {
        var id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()).replace(/[^a-z0-9]/gi, '').slice(0, 20);
        var r = await sb.from('docs').insert({ col: col, id: id, data: data });
        if (r.error) throw error(r.error);
        pronto();
        return docRef(col + '/' + id);
      },
      get: async function () {
        var t = await sb.from('docs').select('id,data').eq('col', col).order('id');
        if (t.error) throw error(t.error);
        var docs = (t.data || []).map(function (x) { return foto(x.id, x); });
        return { docs: docs, size: docs.length, empty: !docs.length };
      },
      onSnapshot: function (cb, err) { return vigila({ doc: false, col: col, cb: cb, err: err, firma: null }); }
    };
  }
  var DB = { doc: docRef, collection: colRef };

  /* ---- Quién ve la página ---- */
  var USER = {
    id: async function () { return P.uid; },
    isOwner: async function () { return P.perfil.rol === 'gerente' || P.perfil.rol === 'director'; },
    canEdit: async function () { return P.perfil.rol === 'gerente' || P.perfil.rol === 'director'; },
    // Los contadores también escriben (sus justificaciones); qué colección puede tocar cada quien lo decide la base
    can: async function (que) { return que === 'data.write' || que === 'data.read'; },
    profiles: async function (ids) {
      var out = {}, uu = (ids || []).filter(function (x) { return /^[0-9a-f-]{36}$/i.test(x); });
      if (uu.length) {
        var r = await sb.from('perfiles').select('id,nombre').in('id', uu);
        (r.data || []).forEach(function (p) { out[p.id] = { name: p.nombre }; });
      }
      if (P.perfil && P.uid && !out[P.uid] && (ids || []).indexOf(P.uid) >= 0) out[P.uid] = { name: P.perfil.nombre };
      return out;
    }
  };

  /* ---- Descargas: el archivo se baja directo en el navegador ---- */
  var DL = {
    save: async function (o) {
      var blob = o.data instanceof Blob ? o.data : new Blob([o.data]);
      var u = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = u; a.download = o.filename || 'archivo'; document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 4000);
    }
  };

  if (ROL) {
    window.claude = {
      use: async function (cap) {
        await P.listo;
        if (cap === 'db') return DB;
        if (cap === 'user') return USER;
        if (cap === 'downloads') return DL;
        throw error({ code: 'not_granted', message: 'No disponible en el portal: ' + cap });
      }
    };
  }

  /* ---- Encabezado: nombre de quien entró, cambiar contraseña y salir ---- */
  var CSS = '.pu{display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap}'
    + '.pu-nom{font-weight:600;color:var(--ink)}'
    + '.pu .notas{padding:5px 10px;text-decoration:none}'
    + '.pu-f{display:grid;gap:10px;margin-top:6px}'
    + '.pu-f label{display:grid;gap:4px;font-size:12.5px;font-weight:600;color:var(--muted)}'
    + '.pu-f input{font:inherit;font-size:14px;padding:9px 11px;border-radius:8px;border:1px solid var(--line-strong);background:var(--surface);color:var(--ink)}'
    + '.pu-f input:focus-visible{outline:2px solid var(--accent);outline-offset:1px}'
    + '.pu .pu-act{background:var(--navy);color:var(--navy-ink);border-color:var(--navy);font-weight:600}'
    + '.pu .pu-act[disabled]{opacity:.7;cursor:default}'
    + '.pu-aviso{position:fixed;top:14px;right:14px;z-index:60;max-width:min(380px,calc(100% - 28px));background:var(--surface);color:var(--ink);'
    + 'border:1px solid var(--line-strong);border-left:5px solid var(--accent);border-radius:10px;padding:10px 14px;font-size:13.5px;box-shadow:0 10px 30px rgba(0,0,0,.18)}'
    + '.pu-aviso[hidden]{display:none}';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function dialogoClave() {
    var ov = document.createElement('div');
    ov.className = 'ov'; ov.hidden = true;
    ov.innerHTML = '<div class="dlg" role="dialog" aria-modal="true" aria-labelledby="pu-h">'
      + '<h2 id="pu-h">Cambiar contraseña</h2><p class="sub">Mínimo 8 caracteres. Se cambia para todos tus dispositivos.</p>'
      + '<form class="pu-f" id="pu-form"><label>Contraseña nueva<input type="password" id="pu-n1" autocomplete="new-password" minlength="8" required></label>'
      + '<label>Repítela<input type="password" id="pu-n2" autocomplete="new-password" minlength="8" required></label>'
      + '<div class="dmsg" id="pu-msg"></div>'
      + '<div class="dacts"><button class="btn" type="button" id="pu-x">Cancelar</button><button class="btn primary" type="submit" id="pu-ok">Guardar</button></div></form></div>';
    document.body.appendChild(ov);
    var $ = function (id) { return document.getElementById(id); };
    function cerrar() { ov.hidden = true; $('pu-form').reset(); $('pu-msg').textContent = ''; }
    $('pu-x').onclick = cerrar;
    ov.addEventListener('click', function (e) { if (e.target === ov) cerrar(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !ov.hidden) cerrar(); });
    $('pu-form').addEventListener('submit', async function (e) {
      e.preventDefault();
      var a = $('pu-n1').value, b = $('pu-n2').value, m = $('pu-msg');
      if (a.length < 8) { m.className = 'dmsg warn'; m.textContent = 'Usa al menos 8 caracteres.'; return; }
      if (a !== b) { m.className = 'dmsg warn'; m.textContent = 'Las dos contraseñas no coinciden.'; return; }
      var ok = $('pu-ok'); ok.disabled = true; ok.textContent = 'Guardando…';
      var r = await sb.auth.updateUser({ password: a });
      ok.disabled = false; ok.textContent = 'Guardar';
      if (r.error) { m.className = 'dmsg bad'; m.textContent = /different/i.test(r.error.message) ? 'Escribe una contraseña distinta a la actual.' : 'No se pudo cambiar. Vuelve a intentar.'; return; }
      m.className = 'dmsg ok'; m.textContent = 'Listo: tu contraseña quedó cambiada.';
      setTimeout(cerrar, 1400);
    });
    return function () { ov.hidden = false; $('pu-n1').focus(); };
  }

  function encabezado(p) {
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var lugar = document.querySelector('header .equipo');
    var span = document.createElement('span');
    span.className = 'pu';
    // El director brinca entre su vista (con EQUILIBRIO) y la del equipo
    var otra = p.rol !== 'director' ? '' : ROL === 'director'
      ? '<a class="notas" href="gerentes.html">Vista del equipo</a>' : '<a class="notas" href="director.html">Mi vista</a>';
    span.innerHTML = '<span class="pu-nom">' + esc(p.nombre) + '</span>' + otra
      + '<button class="notas" type="button" id="pu-clave">Contraseña</button>'
      + '<button class="notas" type="button" id="pu-salir">Salir</button>';
    if (lugar) lugar.replaceWith(span);
    else { var meta = document.querySelector('header .meta'); if (!meta) return; meta.appendChild(span); }
    var abrir = dialogoClave();
    document.getElementById('pu-clave').onclick = abrir;
    document.getElementById('pu-salir').onclick = P.salir;
    botonActualizar(span);
  }

  /* Botón «Actualizar» (solo para quien está en la lista de la base): corre la actualización en ese momento.
     El horario fijo (cada 3 horas) no se mueve. Cuando llegan los datos nuevos, la página los toma sola. */
  function aviso(txt, ms) {
    var a = document.getElementById('pu-aviso');
    if (!a) { a = document.createElement('div'); a.id = 'pu-aviso'; a.className = 'pu-aviso'; a.setAttribute('role', 'status'); document.body.appendChild(a); }
    a.textContent = txt; a.hidden = false;
    clearTimeout(a._t); if (ms) a._t = setTimeout(function () { a.hidden = true; }, ms);
  }
  async function horaDatos() {
    var r = await sb.from('docs').select('data').eq('col', 'datos').eq('id', 'meta').maybeSingle();
    return r.data && r.data.data && r.data.data.refreshedAt ? Date.parse(r.data.data.refreshedAt) : 0;
  }
  async function botonActualizar(span) {
    var r = await sb.rpc('puedo_actualizar');
    if (r.error || r.data !== true) return;
    var b = document.createElement('button');
    b.className = 'notas pu-act'; b.type = 'button'; b.textContent = 'Actualizar';
    b.title = 'Trae los datos más nuevos del WorkFlow y la cobranza en este momento';
    span.insertBefore(b, span.querySelector('#pu-clave'));
    b.onclick = async function () {
      b.disabled = true; b.textContent = 'Actualizando…';
      var antes = 0; try { antes = await horaDatos(); } catch (e) { antes = 0; }
      var q = await sb.rpc('solicitar_actualizacion');
      if (q.error) {
        b.disabled = false; b.textContent = 'Actualizar';
        aviso(/llave/i.test(q.error.message) ? 'El botón todavía no está conectado. Avísale a Daniel.' : 'No se pudo pedir la actualización. Vuelve a intentar en un momento.', 6000);
        return;
      }
      aviso(q.data && q.data.yaEnCurso ? 'Ya hay una actualización en camino; en un par de minutos se ven los datos nuevos.'
        : 'Actualizando el WorkFlow y la cobranza; tarda uno o dos minutos.', 5000);
      var fin = Date.now() + 5 * 60000;
      (async function espera() {
        var ahora = 0; try { ahora = await horaDatos(); } catch (e) { ahora = 0; }
        if (ahora > antes) { vuelta(); b.disabled = false; b.textContent = 'Actualizar'; aviso('Listo: ya están los datos nuevos.', 4000); return; }
        if (Date.now() > fin) { b.disabled = false; b.textContent = 'Actualizar'; aviso('Está tardando más de lo normal; los datos llegarán solos en cuanto termine.', 7000); return; }
        setTimeout(espera, 10000);
      })();
    };
  }
  if (ROL) {
    P.listo.then(function (p) {
      if (!p) return;
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { encabezado(p); });
      else encabezado(p);
    }).catch(function () {});
  }
})();
