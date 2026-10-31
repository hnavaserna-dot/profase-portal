/* Portal PROFASE · avisos del chat al celular y a la computadora aunque el portal esté cerrado (30-oct-2026, pedido de
   Daniel). Este archivo lo instala el navegador cuando alguien activa los avisos en el chat (ajustes ⋮).
   - Solo recibe avisos y los enseña; no guarda páginas ni datos, ni cambia cómo carga el portal (no tiene «fetch»).
   - El aviso llega cifrado desde la función «chat-push» de Supabase y dice quién escribió, en qué chat y lo que dice el
     mensaje, como WhatsApp (desde el 30-oct-2026, 17:55, decisión de Daniel: «Con texto, siempre»; lo arma la base,
     portal/sql/66_chat_push_texto.sql). Al picarlo abre el portal en esa conversación (o la abre en la ventana del portal
     que ya esté abierta).
   - El ícono chico (barra de arriba del celular) es un globito de chat blanco: Android lo pinta de un solo color, así que
     no puede ser el signo PROFASE (nunca se pinta de un color); el signo y la foto de quien escribe van en grande.
   - En iPhone y iPad solo funciona con el portal agregado a la pantalla de inicio. */
'use strict';
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

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
    data: { url: typeof d.url === 'string' && d.url.charAt(0) === '/' ? d.url : '/', conv: d.conv || null }
  };
  // «te está llamando» (llamadas del chat, 63_chat_llamadas.sql): se queda hasta que la piquen y vibra
  if (d.llamada === true) { op.requireInteraction = true; op.vibrate = [400, 200, 400, 200, 400]; }
  // Si el portal está abierto y al frente, ya enseña su propio aviso dentro de la página; ahí no se repite.
  // En Apple sí se enseña siempre (Safari quita los avisos a quien recibe sin enseñar).
  var ua = (self.navigator && self.navigator.userAgent) || '';
  var apple = /Safari\//.test(ua) && !/Chrome|Chromium|Android|Edg\//.test(ua);
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (ws) {
    var alFrente = ws.some(function (w) { return w.visibilityState === 'visible' && w.focused && /\/(director|gerentes|contadores)\.html/.test(w.url); });
    if (alFrente && !apple && op.tag !== 'chat-prueba') return null;
    return Promise.all([
      self.registration.showNotification(titulo, op),
      self.navigator && self.navigator.setAppBadge ? self.navigator.setAppBadge().catch(function () {}) : Promise.resolve()
    ]);
  }));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var data = e.notification.data || {}, url = new URL(data.url || '/', self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (ws) {
    for (var i = 0; i < ws.length; i++) {
      var w = ws[i];
      if (w.url.indexOf(self.location.origin) === 0 && /\/(director|gerentes|contadores)\.html/.test(w.url)) {
        w.postMessage({ tipo: 'chat-abre', conv: data.conv || null });
        return w.focus ? w.focus() : null;
      }
    }
    return self.clients.openWindow ? self.clients.openWindow(url) : null;
  }));
});
