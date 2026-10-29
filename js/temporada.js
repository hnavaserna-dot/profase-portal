/* Portal PROFASE · adornos de temporada junto al signo (regla de Daniel, 29-oct-2026).
   El signo PROFASE es siempre el logo oficial, con sus colores: nunca se redibuja ni se pinta de otro color. En
   temporadas se le pone al lado un adorno aparte, que nunca lo tapa ni lo cambia: una arañita colgando (Halloween y Día
   de Muertos), un Santa (Navidad y Año Nuevo), un corazón (Día del Amor y la Amistad) y una banderita (fiestas patrias).
   Daniel: «la idea es que siempre sea el logo de siempre; pero sí se puede poner una arañita cayendo porque es
   Halloween, un Santa Claus porque es Navidad… pero el logo con el azul y tonos y colores, nunca».
   Lo usan las tres vistas (js/menu.js, junto al logo del encabezado) y la entrada (index.html, junto al signo grande).
   ?temporada=navidad en la dirección deja ver otra temporada para revisarla (amor, patrias, muertos o navidad). */
(function () {
  'use strict';
  var ADORNOS = {
    arana: '<svg viewBox="0 0 16 26" fill="none" stroke="currentColor" stroke-linecap="round"><g class="pt-ar">'
      + '<path d="M8-40V13" stroke-width=".7" opacity=".6"/>'
      + '<path d="M5.6 15.2 2 12.6 1 9.6M5.4 16.6 1.2 15.6 0 13.4M5.6 18.2 1.6 19.6.6 22.4M6.2 19.4 3.8 22.6 3.6 25.2'
      + 'M10.4 15.2 14 12.6l1-3M10.6 16.6l4.2-1 1.2-2.2M10.4 18.2l4 1.4 1 2.8M9.8 19.4l2.4 3.2.2 2.6" stroke-width=".9"/>'
      + '<circle cx="8" cy="14.4" r="2.3" fill="currentColor" stroke="none"/><circle cx="8" cy="18.6" r="3.2" fill="currentColor" stroke="none"/>'
      + '<circle cx="7.1" cy="14" r=".5" fill="#F07A1E" stroke="none"/><circle cx="8.9" cy="14" r=".5" fill="#F07A1E" stroke="none"/></g></svg>',
    santa: '<svg viewBox="0 0 20 24"><path d="M3.5 10.5C4.5 4 9 1.2 14.5 2.2l1.2 5.6-12.2 2.7z" fill="#C8102E"/>'
      + '<circle cx="15.6" cy="2.6" r="1.9" fill="#fff" stroke="#D5DAE1" stroke-width=".5"/>'
      + '<rect x="2.6" y="9.4" width="14.6" height="3" rx="1.5" fill="#fff" stroke="#D5DAE1" stroke-width=".5"/>'
      + '<circle cx="10" cy="15.2" r="4.2" fill="#F6C9A8"/><circle cx="8.5" cy="14.4" r=".55" fill="#3A2A20"/><circle cx="11.5" cy="14.4" r=".55" fill="#3A2A20"/>'
      + '<path d="M4.6 15.6c.4 5 3 7.6 5.4 7.6s5-2.6 5.4-7.6c-1.2 1.6-2.6 2.4-5.4 2.4s-4.2-.8-5.4-2.4z" fill="#fff" stroke="#D5DAE1" stroke-width=".5"/>'
      + '<circle cx="10" cy="16.4" r=".8" fill="#E8836B"/></svg>',
    corazon: '<svg viewBox="0 0 16 16"><path class="pt-lat" d="M8 14.2S1.4 10.1 1.4 5.6A3.5 3.5 0 0 1 8 4a3.5 3.5 0 0 1 6.6 1.6C14.6 10.1 8 14.2 8 14.2z" fill="#D6336C"/></svg>',
    bandera: '<svg viewBox="0 0 18 18"><path d="M2 1v16" stroke="#8A94A6" stroke-width="1.2" stroke-linecap="round"/>'
      + '<path d="M2.6 2h4.6v8H2.6z" fill="#006847"/><path d="M7.2 2h4.6v8H7.2z" fill="#fff" stroke="#C9D1DE" stroke-width=".4"/>'
      + '<path d="M11.8 2h4.6v8h-4.6z" fill="#CE1126"/><circle cx="9.5" cy="6" r="1.1" fill="#8C6A3D"/></svg>'
  };  // [mes, día] de inicio y de fin (incluidos); la Navidad cruza el año
  var TEMPORADAS = [
    { k: 'amor', de: [2, 7], a: [2, 14], adorno: 'corazon' },
    { k: 'patrias', de: [9, 1], a: [9, 16], adorno: 'bandera' },
    { k: 'muertos', de: [10, 15], a: [11, 2], adorno: 'arana' },
    { k: 'navidad', de: [12, 1], a: [1, 6], adorno: 'santa' }
  ];
  function actual(f) {
    var pide = (location.search.match(/[?&]temporada=([a-z]+)/) || [])[1];
    if (pide) return TEMPORADAS.filter(function (x) { return x.k === pide; })[0] || null;
    var n = (f.getMonth() + 1) * 100 + f.getDate();
    return TEMPORADAS.filter(function (x) {
      var de = x.de[0] * 100 + x.de[1], a = x.a[0] * 100 + x.a[1];
      return de <= a ? n >= de && n <= a : n >= de || n <= a;
    })[0] || null;
  }
  // chico: el logo de 30 px del encabezado (aparta su lugar para no encimarse en «PROFASE»).
  // grande: el signo de la entrada; el adorno queda a su derecha sin moverlo del centro. «oscuro»: fondo siempre oscuro.
  var CSS = '.pt-caja{position:relative;display:block;flex:none}.pt-chico{padding-right:16px}'
    + '.pt-adorno{position:absolute;pointer-events:none}.pt-adorno svg{display:block;width:100%;height:auto;overflow:visible}'
    + '.pt-chico .pt-adorno{left:32px}.pt-grande .pt-adorno{left:calc(100% + 6px)}'
    + '.pt-arana{color:#1F2937}:root[data-theme="dark"] .pt-arana,.pt-oscuro .pt-arana{color:#E5EAF2}'
    + '.pt-chico .pt-arana{top:-6px;width:13px}.pt-grande .pt-arana{top:-34px;width:30px}'
    + '.pt-chico .pt-santa{bottom:-3px;width:17px}.pt-grande .pt-santa{bottom:-6px;width:40px}'
    + '.pt-chico .pt-corazon{top:2px;width:13px}.pt-grande .pt-corazon{top:6px;width:28px}'
    + '.pt-chico .pt-bandera{top:0;width:15px}.pt-grande .pt-bandera{top:0;width:34px}'
    + '.pt-ar{animation:pt-ar 2.8s ease-in-out infinite alternate}@keyframes pt-ar{from{transform:translateY(-2px)}to{transform:translateY(6px)}}'
    + '.pt-lat{transform-origin:50% 60%;animation:pt-lat 1.6s ease-in-out infinite}@keyframes pt-lat{0%,100%{transform:scale(1)}15%{transform:scale(1.15)}30%{transform:scale(1)}}'
    + '@media (prefers-reduced-motion:reduce){.pt-adorno *{animation:none!important}}';
  function pon(logo, opc) {
    opc = opc || {};
    var x = actual(new Date());
    if (!x || !logo || !logo.parentNode || !ADORNOS[x.adorno]) return null;
    if (!document.getElementById('pt-css')) {
      var st = document.createElement('style'); st.id = 'pt-css'; st.textContent = CSS; document.head.appendChild(st);
    }
    var caja = document.createElement('span');
    caja.className = 'pt-caja ' + (opc.grande ? 'pt-grande' : 'pt-chico') + (opc.oscuro ? ' pt-oscuro' : '');
    logo.parentNode.insertBefore(caja, logo); caja.appendChild(logo);
    var a = document.createElement('span'); a.className = 'pt-adorno pt-' + x.adorno; a.setAttribute('aria-hidden', 'true');
    a.innerHTML = ADORNOS[x.adorno]; caja.appendChild(a);
    return x.k;
  }
  window.PROFASE_TEMPORADA = { actual: function () { return actual(new Date()); }, pon: pon };
})();
