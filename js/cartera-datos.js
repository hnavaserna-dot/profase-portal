/* ===== Portal PROFASE · lo que baja Reportes › Depuración de CxC / CxP (la colección «cartera» de la base).
   Una sola pieza para la pantalla (cartera.html) y para la precarga de la vista (cartera_tab.js).
   11-nov-2026 (Héctor Daniel Nava, 06:10: «Cómo le podemos hacer para que sea más rápido es demasiado tiempo de espera»;
   06:51, al plan: «Si asi es y agrega ambas»):
   · se pide en tandas parejas por tamaño, varias a la vez (antes de 12 en 12 por orden alfabético, 4 a la vez);
   · descomprimir y leer cada empresa lo hace un trabajador aparte del navegador (la pantalla no se traba);
   · cada empresa viene por columnas (nube/cartera_nube.py, desde ese día): pesa menos; aquí se regresa a renglones,
     así la pantalla recibe lo mismo de siempre;
   · lo bajado se guarda en este navegador con su firma en la llave (saber qué falta no obliga a leerlo todo) y se escribe
     después de pintar;
   · la precarga: al entrar al portal en la computadora (o el iPad; en el celular no), lo que cambió se baja solo, de
     fondo, para que la pantalla abra con lo que ya está en el navegador.
   Lo que se ve y lo que suma no cambia: solo cuándo y cuánto se baja. Nunca lee otra colección ni escribe en la base. */
(function(){
  'use strict';
  if (window.PROFASE_CARTERA) return;

  /* un paquete de empresa por columnas ({c:[col0, col1, …], n}) → por renglones ({f:[[…], …]}); el de antes ya trae «f» */
  function deColumnas(o){
    if (!o || typeof o !== 'object' || Array.isArray(o) || !o.c || o.f) return o;
    var c = o.c, n = o.n != null ? o.n : (c.length ? c[0].length : 0), m = c.length, f = new Array(n);
    for (var i = 0; i < n; i++){ var r = new Array(m); for (var j = 0; j < m; j++) r[j] = c[j][i]; f[i] = r; }
    o.f = f; delete o.c; delete o.n;
    return o;
  }

  async function desb64Aqui(b64){
    var r = await fetch('data:application/octet-stream;base64,' + b64);
    var s = r.body.pipeThrough(new DecompressionStream('gzip'));
    return deColumnas(JSON.parse(await new Response(s).text()));
  }
  /* el trabajador aparte, que nace la primera vez que hace falta (si el navegador no deja, aquí mismo, como antes) */
  var desb64 = (function(){
    var w = null, listo = false, n = 0, esp = new Map();
    function arma(){
      listo = true;
      try {
        var cod = deColumnas.toString() + ";onmessage=async function(e){var i=e.data.i,b=e.data.b;try{"
          + "var r=await fetch('data:application/octet-stream;base64,'+b);"
          + "var s=r.body.pipeThrough(new DecompressionStream('gzip'));"
          + "postMessage({i:i,o:deColumnas(JSON.parse(await new Response(s).text()))});}"
          + "catch(x){postMessage({i:i,err:String(x&&x.message||x)});}};";
        w = new Worker(URL.createObjectURL(new Blob([cod], { type: 'text/javascript' })));
        w.onmessage = function(e){ var x = esp.get(e.data.i); if (!x) return; esp.delete(e.data.i); e.data.err ? x[1](new Error(e.data.err)) : x[0](e.data.o); };
        w.onerror = function(){ var w0 = w; w = null; esp.forEach(function(x){ desb64Aqui(x[2]).then(x[0], x[1]); }); esp.clear(); try { w0.terminate(); } catch (e) {} };
      } catch (e) { w = null; }
    }
    return function(b){
      if (!listo) arma();
      if (!w) return desb64Aqui(b);
      return new Promise(function(res, rej){
        var i = ++n; esp.set(i, [res, rej, b]);
        try { w.postMessage({ i: i, b: b }); } catch (e) { esp.delete(i); desb64Aqui(b).then(res, rej); }
      });
    };
  })();

  /* lo ya bajado, en este navegador: llave «k|RFC#firma» (o «u|RFC#firma»), por persona (si entra otra, se borra) */
  var BD = 'portal-cartera-2';
  var cache = (function(){
    var p = null;
    function abre(){
      return p || (p = new Promise(function(res, rej){
        try { indexedDB.deleteDatabase('portal-cartera'); } catch (e) {}   // la de antes del 11-nov-2026 (llave sin firma)
        var abreYa = function(otra){
          var r = indexedDB.open(BD, 1);
          r.onupgradeneeded = function(){ if (!r.result.objectStoreNames.contains('docs')) r.result.createObjectStore('docs'); };
          r.onsuccess = function(){
            var db = r.result;
            if (db.objectStoreNames.contains('docs') || otra) return res(db);
            // una base con ese nombre pero sin su almacén (no debería pasar): se borra y se vuelve a crear
            db.close(); var d = indexedDB.deleteDatabase(BD); d.onsuccess = d.onerror = d.onblocked = function(){ abreYa(true); };
          };
          r.onerror = function(){ rej(r.error); };
        };
        abreYa(false);
      }));
    }
    async function tx(modo, fn){
      try {
        var db = await abre();
        return await new Promise(function(res){
          var t = db.transaction('docs', modo), st = t.objectStore('docs'), out, q = fn(st);
          if (q) q.onsuccess = function(){ out = q.result; };
          t.oncomplete = function(){ res(out); }; t.onerror = function(){ res(undefined); }; t.onabort = function(){ res(undefined); };
        });
      } catch (e) { return undefined; }
    }
    async function varios(ks){
      try {
        var db = await abre();
        return await new Promise(function(res){
          var t = db.transaction('docs', 'readonly'), st = t.objectStore('docs'), out = new Array(ks.length);
          ks.forEach(function(k, i){ var q = st.get(k); q.onsuccess = function(){ out[i] = q.result; }; });
          t.oncomplete = function(){ res(out); }; t.onerror = function(){ res(out); }; t.onabort = function(){ res(out); };
        });
      } catch (e) { return ks.map(function(){ return undefined; }); }
    }
    /* guarda uno y quita lo de esa misma empresa con otra firma */
    async function pon(id, firma, v){
      try {
        var db = await abre();
        return await new Promise(function(res){
          var t = db.transaction('docs', 'readwrite'), st = t.objectStore('docs'), q = st.getAllKeys();
          q.onsuccess = function(){ (q.result || []).forEach(function(k){ if (typeof k === 'string' && k.indexOf(id + '#') === 0 && k !== id + '#' + firma) st.delete(k); }); st.put(v, id + '#' + firma); };
          t.oncomplete = function(){ res(true); }; t.onerror = function(){ res(false); }; t.onabort = function(){ res(false); };
        });
      } catch (e) { return false; }
    }
    return {
      get: function(k){ return tx('readonly', function(st){ return st.get(k); }); },
      claves: function(){ return tx('readonly', function(st){ return st.getAllKeys(); }); },
      varios: varios, pon: pon,
      set: function(k, v){ return tx('readwrite', function(st){ return st.put(v, k); }); },
      borra: function(){ return tx('readwrite', function(st){ return st.clear(); }); }
    };
  })();
  /* lo guardado de varios a la vez: {id: objeto} de los que están con su firma */
  async function cacheVarios(ids, firmaDe){
    var cs = await cache.varios(ids.map(function(id){ return id + '#' + firmaDe(id); })), out = {};
    ids.forEach(function(id, i){ if (cs[i]) out[id] = cs[i]; });
    return out;
  }
  /* si entra otra persona en este navegador, lo de antes se borra */
  async function dueno(uid){
    var d = await cache.get('__usuario');
    if (d !== uid){ await cache.borra(); await cache.set('__usuario', uid); }
  }
  /* lo que se guarda se escribe después (uno por uno, sin trabar la pantalla) */
  var GUARDA = [], escribiendo = false;
  function guardaLuego(id, firma, v){ GUARDA.push([id, firma, v]); }
  function guardaYa(){
    if (escribiendo || !GUARDA.length) return;
    escribiendo = true;
    var sig = function(){
      var x = GUARDA.shift();
      if (!x){ escribiendo = false; return; }
      cache.pon(x[0], x[1], x[2]).then(function(){ setTimeout(sig, 0); });
    };
    setTimeout(sig, 300);
  }

  /* varias tandas a la vez: corre(tarea) por cada una, «par» al mismo tiempo */
  async function enPar(tareas, par, corre){
    var i = 0;
    var uno = async function(){ while (i < tareas.length){ var t = tareas[i++]; await corre(t); } };
    var hilos = []; for (var k = 0; k < Math.min(par, tareas.length); k++) hilos.push(uno());
    await Promise.all(hilos);
  }
  /* tandas parejas por tamaño: hasta 12 documentos y unos 9,000 renglones por tanda, las más grandes primero */
  function tandas(ids, nDe){
    var out = [], t = [], n = 0;
    ids.slice().sort(function(a, b){ return (nDe(b) || 0) - (nDe(a) || 0); }).forEach(function(id){
      var k = +nDe(id) || 0;
      if (t.length && (t.length >= 12 || n + k > 9000)){ out.push(t); t = []; n = 0; }
      t.push(id); n += k;
    });
    if (t.length) out.push(t);
    return out;
  }
  var PAR = 6;

  /* de la base: solo la colección «cartera» (la base decide qué empresas ve cada quien) */
  async function bajaDocs(sb, ids){
    var out = {};
    for (var i = 0; i < ids.length; i += 12){
      var q = await sb.from('docs').select('id,data').eq('col', 'cartera').in('id', ids.slice(i, i + 12));
      if (q.error) throw q.error;
      (q.data || []).forEach(function(x){ out[x.id] = x.data; });
    }
    return out;
  }
  /* las firmas y cuántos documentos trae cada empresa (para armar las tandas) */
  async function firmas(sb, pref){
    var q = await sb.from('docs').select('id,firma:data->>firma,n:data->>documentos').eq('col', 'cartera').like('id', pref + '|%');
    if (q.error) throw q.error;
    var f = {}, n = {};
    (q.data || []).forEach(function(x){ f[x.id] = x.firma; n[x.id] = +x.n || 0; });
    return { f: f, n: n };
  }

  /* los folios fiscales (u|RFC, o q|RFC de p|RFC) de varias empresas: lo traído en esta página, lo guardado y lo que falte.
     firmaDe(id) es la firma de su k|/p| (la misma); nDe(id), cuántos documentos trae. Regresa {id k|/p|: lista de folios} */
  var uDe = function(id){ return (id[0] === 'k' ? 'u' : 'q') + id.slice(1); };
  var deU = function(u){ return (u[0] === 'u' ? 'k' : 'p') + u.slice(1); };
  var PRE_U = new Map();
  async function traeUuids(sb, ids, firmaDe, nDe, par){
    var objs = {}, resto = [];
    ids.forEach(function(id){ var x = PRE_U.get(id); if (x && x.firma === firmaDe(id)) objs[id] = x.obj; else resto.push(id); });
    if (resto.length){
      var g = await cacheVarios(resto.map(uDe), function(u){ return firmaDe(deU(u)); });
      var faltan = [];
      resto.forEach(function(id){ var o = g[uDe(id)]; if (o) objs[id] = o; else faltan.push(id); });
      await enPar(tandas(faltan.map(uDe), function(u){ return nDe(deU(u)); }), par || PAR, async function(lote){
        var docs = await bajaDocs(sb, lote);
        await Promise.all(lote.map(async function(u){
          var id = deU(u), d = docs[u];
          if (!d || d.firma !== firmaDe(id)) return;
          objs[id] = await desb64(d.b64);
          guardaLuego(u, d.firma, objs[id]);
        }));
      });
    }
    ids.forEach(function(id){ if (objs[id]) PRE_U.set(id, { firma: firmaDe(id), obj: objs[id] }); });
    return objs;
  }

  /* una marca de estatus vigente (la misma regla de la pantalla) */
  var viva = function(m){ return m.estado === 'aprobada' || m.estado === 'por_aprobar'; };
  /* las empresas cuyos folios se necesitan al abrir: lo marcado, lo aplicado y lo cancelado en el SAT */
  function rfcsQueUsan(qm, qa, qs){
    var rs = new Set();
    if (qm && !qm.error && qm.data) (qm.data.marcas || []).forEach(function(m){ if (m.uuid && viva(m)) rs.add(m.rfc); });
    if (qa && !qa.error && qa.data) (qa.data.rel || []).forEach(function(x){ rs.add(x.rfc); });
    if (qs && !qs.error && qs.data) (qs.data.canceladas || []).forEach(function(x){ rs.add(x.rfc); });
    return rs;
  }
  /* lo que pide la pantalla al abrir, además de la cartera (la misma llamada, para no pedirla dos veces) */
  function pideTodo(sb){
    var pide = function(f, a){ try { return Promise.resolve(sb.rpc(f, a)).catch(function(e){ return { error: e }; }); } catch (e) { return Promise.resolve({ error: e }); } };
    return { marcas: pide('cartera_marcas'), apl: pide('cartera_apl'), sat: pide('cartera_sat', { p: { modo: 'canceladas' } }), can: pide('cartera_can', { p: {} }) };
  }

  /* ¿aquí sí se precarga? En la computadora y el iPad; en el celular no, ni con «ahorro de datos» o datos del celular */
  function toca(){
    try {
      if (/iPhone|iPod|Android.*Mobile|Mobile.*Android|Windows Phone/i.test(navigator.userAgent || '')) return false;
      if (Math.min(screen.width || 0, screen.height || 0) < 600) return false;
      var c = navigator.connection;
      if (c && (c.saveData || c.type === 'cellular')) return false;
      return typeof indexedDB !== 'undefined' && typeof DecompressionStream !== 'undefined';
    } catch (e) { return false; }
  }
  /* la precarga: lo que cambió desde la última vez, de fondo, 2 tandas a la vez; una vez cada 30 minutos por persona
     en este navegador. alto() dice que se detenga (la pantalla ya se abrió: ella sigue con lo suyo) */
  var PRE_CADA = 30 * 60 * 1000;
  async function precarga(o){
    var sb = o && o.sb, yo = o && o.perfil, alto = (o && o.alto) || function(){ return false; };
    if (!sb || !yo || !yo.id || !toca()) return { hecho: false, por: 'no toca' };
    var llave = 'profase-carpre:' + yo.id;
    try { var t = +localStorage.getItem(llave) || 0; if (Date.now() - t < PRE_CADA) return { hecho: false, por: 'reciente' }; localStorage.setItem(llave, String(Date.now())); } catch (e) {}
    await dueno(yo.id);
    var fk = await firmas(sb, 'k'), fp = yo.rol === 'director' ? await firmas(sb, 'p') : { f: {}, n: {} };
    var fs = Object.assign({}, fk.f, fp.f), N = Object.assign({}, fk.n, fp.n);
    var claves = new Set((await cache.claves()) || []);
    var faltan = Object.keys(fs).filter(function(id){ return !claves.has(id + '#' + fs[id]); });
    var bajadas = 0;
    await enPar(tandas(faltan, function(id){ return N[id]; }), 2, async function(lote){
      if (alto()) return;
      var docs = await bajaDocs(sb, lote);
      for (var i = 0; i < lote.length; i++){
        var id = lote[i], d = docs[id];
        if (!d || d.firma !== fs[id]) continue;
        await cache.pon(id, d.firma, await desb64(d.b64));
        bajadas++;
        await new Promise(function(r){ setTimeout(r, 0); });
      }
    });
    if (alto()) return { hecho: false, por: 'se abrió la pantalla', bajadas: bajadas };
    var q = pideTodo(sb), r = await Promise.all([q.marcas, q.apl, q.sat]);
    var ids = []; rfcsQueUsan(r[0], r[1], r[2]).forEach(function(rfc){ ['k|', 'p|'].forEach(function(p){ if (fs[p + rfc]) ids.push(p + rfc); }); });
    var uf = ids.filter(function(id){ return !claves.has(uDe(id) + '#' + fs[id]); });
    if (uf.length && !alto()){
      await traeUuids(sb, uf, function(id){ return fs[id]; }, function(id){ return N[id]; }, 2);
      guardaYa();
    }
    return { hecho: true, bajadas: bajadas, folios: uf.length };
  }

  window.PROFASE_CARTERA = {
    deColumnas: deColumnas, desb64: desb64, cache: cache, cacheVarios: cacheVarios, dueno: dueno,
    guardaLuego: guardaLuego, guardaYa: guardaYa, enPar: enPar, tandas: tandas, PAR: PAR,
    bajaDocs: bajaDocs, firmas: firmas, uDe: uDe, traeUuids: traeUuids,
    viva: viva, rfcsQueUsan: rfcsQueUsan, pideTodo: pideTodo, toca: toca, precarga: precarga
  };
})();
