/* El texto que escribe una IA, en una sola pieza (Héctor Daniel Nava, 9-nov-2026, 13:24: «Arregla los asteriscos de
   Q Chat»): SuperConta, Chat › Q Chat del CRM y la burbuja de ayuda de los sistemas Quo (que la carga de
   https://crmprofase.com.mx/js/texto-ia.js). Antes cada pantalla tenía lo suyo y Q Chat enseñaba los «**» tal cual.

   PROFASE_TEXTO.formato(texto, { ligas })  →  HTML, siempre escapado (nunca se pinta el texto como HTML):
     **negritas**, *cursivas*, listas («- », «• », «* » y «1. »), subtítulos («# …», que salen como <p class="tx-h">) y
     párrafos; las rayas «---» se quitan y los asteriscos que quedan sueltos también. Con ligas: true, las https se pueden
     picar (se abren aparte).
   PROFASE_TEXTO.plano(texto, { vacios })  →  los renglones sin marcas (para copiar, el Excel o un cuadro de texto);
     con vacios: true deja un renglón en blanco entre párrafos. */
(function () {
  'use strict';
  if (window.PROFASE_TEXTO) return;
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  var NEGRITA = /\*\*([^*\n]+?)\*\*/g;
  var CURSIVA = /(^|[\s(«"¿¡])\*([^*\s][^*\n]*?)\*(?=[\s).,;:!?»"]|$)/g;
  var LIGA = /(https:\/\/[^\s<"]+[^\s<".,;:)!?»])/g;
  var RAYA = /^(?:-{3,}|\*{3,}|_{3,})$/;
  function linea(s, o) {
    var t = esc(s).replace(NEGRITA, '<b>$1</b>').replace(CURSIVA, '$1<i>$2</i>').replace(/\*\*/g, '').replace(/ {2,}/g, ' ');
    if (o && o.ligas) t = t.replace(LIGA, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    return t;
  }
  function formato(texto, o) {
    var out = [], lista = null, tipo = '';
    function cierra() { if (lista) { out.push('<' + tipo + '>' + lista.join('') + '</' + tipo + '>'); lista = null; tipo = ''; } }
    String(texto == null ? '' : texto).split(/\r?\n/).forEach(function (l) {
      var s = l.trim(), m;
      if (RAYA.test(s)) { cierra(); return; }
      if ((m = s.match(/^[-•*]\s+(.*)$/))) { if (tipo !== 'ul') cierra(); tipo = 'ul'; (lista = lista || []).push('<li>' + linea(m[1], o) + '</li>'); return; }
      if ((m = s.match(/^\d+[.)]\s+(.*)$/))) { if (tipo !== 'ol') cierra(); tipo = 'ol'; (lista = lista || []).push('<li>' + linea(m[1], o) + '</li>'); return; }
      cierra();
      if ((m = s.match(/^#{1,6}\s+(.*)$/))) { out.push('<p class="tx-h">' + linea(m[1].replace(/^\*\*(.*)\*\*$/, '$1'), o) + '</p>'); return; }
      if (s) out.push('<p>' + linea(s, o) + '</p>');
    });
    cierra();
    return out.join('');
  }
  function limpia(s) {
    return s.replace(NEGRITA, '$1').replace(CURSIVA, '$1$2').replace(/\*\*/g, '').replace(/ {2,}/g, ' ').replace(/^[-•*]\s+/, '• ').replace(/^#{1,6}\s+/, '');
  }
  function plano(texto, o) {
    var r = [];
    String(texto == null ? '' : texto).split(/\r?\n/).forEach(function (l) {
      var s = l.trim();
      if (RAYA.test(s)) s = '';
      if (s) r.push(limpia(s));
      else if (o && o.vacios && r.length && r[r.length - 1] !== '') r.push('');
    });
    while (r.length && r[r.length - 1] === '') r.pop();
    return r;
  }
  window.PROFASE_TEXTO = { formato: formato, plano: plano };
})();
