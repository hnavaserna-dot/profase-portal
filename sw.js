/* Portal PROFASE · avisos del chat al celular y a la computadora aunque el portal esté cerrado (30-oct-2026, pedido de
   Daniel). Este archivo lo instala el navegador cuando alguien activa los avisos en el chat (ajustes ⋮).
   - Solo recibe avisos y los enseña; no guarda páginas ni datos, ni cambia cómo carga el portal (no tiene «fetch»).
   - El aviso llega cifrado desde la función «chat-push» de Supabase y dice quién escribió, en qué chat y lo que dice el
     mensaje, como WhatsApp (desde el 30-oct-2026, 17:55, decisión de Daniel: «Con texto, siempre»; lo arma la base,
     portal/sql/66_chat_push_texto.sql). Al picarlo abre el portal en esa conversación (o la abre en la ventana del portal
     que ya esté abierta).
   - El ícono chico (barra de arriba del celular) es un globito de chat blanco: Android lo pinta de un solo color, así que
     no puede ser el signo PROFASE (nunca se pinta de un color); el signo y la foto de quien escribe van en grande.
   - En iPhone y iPad solo funciona con el portal agregado a la pantalla de inicio.
   - Desde el 31-oct-2026 también avisa de los Recordatorios (portal/sql/107_recordatorios_agenda.sql): llegan por la
     misma función, al picarlos abren Administración › Recordatorios y, si el portal está al frente, la página enseña su
     propia ventana con «Listo» y «Recuérdame en…» (aquí no se repite el aviso).
   - Agenda y reuniones con gente de fuera (31-oct-2026, 108_agenda_reuniones.sql): «X está esperando para entrar»
     (tag sala-…) y los recordatorios de las citas (tag cita-…). El de la sala, con el portal al frente, no se repite:
     se le avisa a la página para que lo enseñe al momento; los recordatorios de citas se enseñan siempre. Al picarlos
     abren la reunión o la cita.
   - Picar el aviso de un mensaje abre la conversación de quien lo mandó (Héctor Daniel Nava, 9-nov-2026: «no te abre el
     Chat automáticamente con la persona que te lo mandó; te abre el Chat completo»). Si el portal está abierto, se le
     manda «chat-abre» con la conversación y un número (id); si no, se abre con ?chat=<conversación>. Y por si la página no
     lo recibe (se estaba abriendo o recargando, o el iPhone abrió la app sin esa dirección), el último aviso picado se
     queda aquí en la memoria un minuto (PICADO, nunca se guarda en ningún lado): la página pregunta al arrancar
     («chat-picado»), se le contesta con «chat-abre» y avisa cuando ya lo abrió («chat-abierto»). */
'use strict';
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

var PICADO = null, PICADO_MS = 60000;
self.addEventListener('message', function (e) {
  var d = e.data || {};
  if (d.tipo === 'chat-picado') {
    var p = PICADO && Date.now() - PICADO.t < PICADO_MS ? PICADO : null;
    if (p && e.source && e.source.postMessage) e.source.postMessage({ tipo: 'chat-abre', conv: p.conv, id: p.id });
  } else if (d.tipo === 'chat-abierto' && PICADO && d.id === PICADO.id) {
    var listo = PICADO.listo; PICADO = null;
    if (listo) listo();
  }
});

self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = {}; }
  var titulo = String(d.titulo || 'Chat de PROFASE').slice(0, 80);
  var op = {
    body: String(d.cuerpo || 'Tienes un mensaje nuevo en el chat').slice(0, 300),
    icon: typeof d.icono === 'string' && /^(https:\/\/|\/)/.test(d.icono) ? d.icono : '/img/icono-192.png',
    badge: '/img/aviso-chat.png',
    tag: String(d.tag || 'chat'),
    renotify: true,
    data: { url: typeof d.url === 'string' && d.url.charAt(0) === '/' ? d.url : '/', conv: d.conv || null,
            rcd: typeof d.rcd === 'number' ? d.rcd : null,
            sala: typeof d.sala === 'string' && /^[0-9a-f-]{36}$/i.test(d.sala) ? d.sala : null }
  };
  if (op.data.rcd) op.requireInteraction = true;   // un recordatorio se queda hasta que lo piquen (el ícono chico sigue siendo el globito)
  var cita = /[?&]cita=([0-9a-f-]{36})/i.exec(op.data.url); op.data.cita = cita ? cita[1] : null;
  // «te está llamando» (llamadas del chat, 63_chat_llamadas.sql): se queda hasta que la piquen y vibra
  if (d.llamada === true) { op.requireInteraction = true; op.vibrate = [400, 200, 400, 200, 400]; }
  // Si el portal está abierto y al frente, ya enseña su propio aviso dentro de la página; ahí no se repite.
  // En Apple sí se enseña siempre (Safari quita los avisos a quien recibe sin enseñar).
  var ua = (self.navigator && self.navigator.userAgent) || '';
  var apple = /Safari\//.test(ua) && !/Chrome|Chromium|Android|Edg\//.test(ua);
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (ws) {
    var alFrente = ws.some(function (w) { return w.visibilityState === 'visible' && w.focused && /\/(director|gerentes|contadores)\.html/.test(w.url); });
    if (alFrente && op.data.rcd) ws.forEach(function (w) { try { w.postMessage({ tipo: 'rcd-ahora', aviso: op.data.rcd }); } catch (x) {} });
    if (alFrente && op.data.sala) {
      ws.forEach(function (w) { if (w.focused) w.postMessage({ tipo: 'sala-espera', sala: op.data.sala }); });
      if (!apple) return null;
    }
    if (alFrente && !apple && op.tag !== 'chat-prueba' && !op.data.cita) return null;
    return Promise.all([
      self.registration.showNotification(titulo, op),
      self.navigator && self.navigator.setAppBadge ? self.navigator.setAppBadge().catch(function () {}) : Promise.resolve()
    ]);
  }));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var data = e.notification.data || {}, url = new URL(data.url || '/', self.location.origin).href;
  // el de un mensaje del chat: se queda en la memoria hasta que la página lo abra (o un minuto); mientras, este archivo sigue vivo
  var chat = !data.rcd && !data.sala && !data.cita && typeof data.conv === 'string' && /^[0-9a-f-]{36}$/i.test(data.conv);
  var id = chat ? Date.now().toString(36) + Math.random().toString(36).slice(2, 8) : null, espera = null;
  if (chat) {
    var p = { conv: data.conv, id: id, t: Date.now(), listo: null };
    espera = new Promise(function (ok) { p.listo = ok; setTimeout(ok, PICADO_MS); });
    PICADO = p;
  }
  var abre = self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (ws) {
    for (var i = 0; i < ws.length; i++) {
      var w = ws[i];
      if (w.url.indexOf(self.location.origin) === 0 && /\/(director|gerentes|contadores)\.html/.test(w.url)) {
        if (data.rcd) w.postMessage({ tipo: 'rcd-abre', aviso: data.rcd });
        else if (data.sala) w.postMessage({ tipo: 'sala-abre', sala: data.sala });
        else if (data.cita) w.postMessage({ tipo: 'cita-abre', cita: data.cita });
        else w.postMessage({ tipo: 'chat-abre', conv: data.conv || null, id: id });
        return w.focus ? Promise.resolve(w.focus()).catch(function () {}) : null;
      }
    }
    return self.clients.openWindow ? Promise.resolve(self.clients.openWindow(url)).catch(function () {}) : null;
  });
  e.waitUntil(espera ? Promise.all([abre, espera]) : abre);
});
