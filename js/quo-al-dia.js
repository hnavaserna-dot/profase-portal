/* Portal PROFASE · «Al abrir un cliente, lo más nuevo de Quo» (3-nov-2026; Héctor Daniel, 14:47: «Sí, a 45, dale: carril
   rápido cada 10 minutos»).
   Una sola pieza para Reportes › Cartera, Reportes › Variaciones y Clientes › Expedientes
   (portal/sql/199_quo_carril_rapido.sql): al abrir un cliente le avisa a la base, que lo pone primero en el carril rápido
   de Quo y, si la siguiente vuelta está a más de 4 minutos, la manda en ese momento (1 a 2 minutos). Cuando llega algo
   nuevo, Cartera y Variaciones se ponen al día solas, como con la vuelta de cada hora. La base decide todo
   (qc_abierto()): solo los clientes que esa persona ve, nunca con solo consulta, cada cliente una vez cada 10 minutos y un
   tope al día para cuidar el gasto. Nunca lee ni escribe tablas.

   PROFASE_QUO.abierto(rfcs, {aviso})   // aviso: true enseña el aviso chico de abajo; regresa lo que dijo la base (o null)
*/
(function () {
  'use strict';
  if (window.PROFASE_QUO) return;
  var DIEZ = 10 * 60 * 1000;
  var YA = {};   // RFC -> cuándo se avisó desde esta página (la base igual lo cuida)

  function abierto(rfcs, op) {
    op = op || {};
    var P = window.PORTAL;
    if (!P || !P.sb || P.consulta) return Promise.resolve(null);
    var ahora = Date.now(), lista = [];
    (rfcs || []).forEach(function (r) {
      r = String(r || '').trim().toUpperCase();
      if (/^[A-ZÑ&0-9]{12,13}$/.test(r) && !(YA[r] > ahora - DIEZ) && lista.indexOf(r) < 0) lista.push(r);
    });
    if (!lista.length) return Promise.resolve(null);
    lista = lista.slice(0, 20);
    lista.forEach(function (r) { YA[r] = ahora; });
    return Promise.resolve(P.listo).then(function () {
      return P.sb.rpc('qc_abierto', { p_rfcs: lista });
    }).then(function (q) {
      if (!q || q.error || !q.data) return null;
      var d = q.data, uno = lista.length === 1 ? ' de este cliente' : ' de estos clientes';
      if (op.aviso && d.trae > 0 && typeof P.toast === 'function') {
        P.toast(d.ya ? 'Trayendo de Quo lo más nuevo' + uno + ': si cambió algo, se pone al día solo en unos 2 minutos.'
                     : 'Lo más nuevo de Quo' + uno + ' llega con la siguiente vuelta (en unos ' + (d.minutos || 10) + ' minutos) y se pone al día solo.');
      }
      return d;
    }).catch(function () { return null; });
  }

  window.PROFASE_QUO = { abierto: abierto };
})();
