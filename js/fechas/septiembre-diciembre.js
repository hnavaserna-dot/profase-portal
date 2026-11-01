/* Portal PROFASE · dibujos de las fechas «chispa» de septiembre a diciembre (Daniel, 31-oct-2026: «sí a todas»; en la entrada y
   adentro). js/temporada.js baja este archivo solo los días de una de sus fechas, para que el portal siga ligero; las
   fechas, su felicitación y su día viven allá, en TEMPORADAS. Dibujos propios: ninguno es el signo PROFASE, ni marcas,
   ni personajes. Agregar o quitar fechas solo lo decide Daniel (CLAUDE.md). */
(window.PROFASE_TEMPORADA_FECHAS = window.PROFASE_TEMPORADA_FECHAS || []).push(function (T) {
  'use strict';
  var alta = T.alta, PICADO = T.PICADO, JUNTO = T.JUNTO, CSS_FECHAS = '';

  // Día de la Paella (20 de septiembre): la paellera humea; un limón partido gira
  function PAELLA_PUNTOS(n, cx, cy, rx, ry, f) {
    var h = '', i, a, r;
    for (i = 0; i < n; i++) { a = i * 2.39996 + .4; r = Math.sqrt((i + .5) / n); h += f((cx + Math.cos(a) * r * rx).toFixed(1), (cy + Math.sin(a) * r * ry).toFixed(1), i); }
    return h;
  }
  // camarón enroscado (la cabeza a la derecha, la colita abajo)
  function PAELLA_GAMBA(x, y, r) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ')">'
      + '<path d="M3.5 3.5l3.4 1M3.5 3.5l1 3.4" stroke="#E8613E" stroke-width="2.4" stroke-linecap="round"/>'
      + '<path d="M5 0A5 5 0 1 0 3.5 3.5" stroke="#F47C5A" stroke-width="4.6" fill="none" stroke-linecap="round"/>'
      + '<path d="M1.5-2.6 3.5-6M-2.6-1.5-6-3.5M-1.5 2.6-3.5 6" stroke="#FFD2BF" stroke-width=".9" stroke-linecap="round"/>'
      + '<circle cx="4.6" cy="-1.6" r=".9" fill="#3A2A20"/></g>';
  }
  function PAELLA_MEJILLON(x, y, r) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ')"><ellipse rx="7" ry="4.4" fill="#34405C" stroke="#7385A6" stroke-width="1"/>'
      + '<ellipse rx="4.8" ry="2.7" fill="#F4A259"/><path d="M-3 0h6" stroke="#D9803A" stroke-width=".9" stroke-linecap="round"/></g>';
  }
  function PAELLA_GAJO(x, y, r) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ')"><path d="M-8 0a8 8 0 0 0 16 0z" fill="#FFE97A" stroke="#F5C400" stroke-width="1.8" stroke-linejoin="round"/>'
      + '<path d="M0 .6v5.6M0 .6l-4.4 3.8M0 .6l4.4 3.8" stroke="#FFF8CC" stroke-width="1" stroke-linecap="round"/></g>';
  }
  var PAELLA_M = { vb: '0 0 120 84', g: '<path d="M14 47c-9-3-14 1-12 5s8 4 12 1M106 47c9-3 14 1 12 5s-8 4-12 1" stroke="#A9B5CA" stroke-width="3.6" fill="none" stroke-linecap="round"/>'
    + '<ellipse cx="60" cy="53" rx="50" ry="26" fill="#56647F"/><ellipse cx="60" cy="48" rx="50" ry="26" fill="#A9B5CA"/>'
    + '<ellipse cx="60" cy="49" rx="45.5" ry="22.5" fill="#7E8CA6"/><ellipse cx="60" cy="51" rx="44" ry="20.5" fill="#F2B93B"/>'
    + PAELLA_PUNTOS(46, 60, 51, 41, 18.5, function (x, y, i) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="1.7" ry=".8" fill="' + (i % 3 ? '#FFD873' : '#E09A2A') + '" transform="rotate(' + (i * 47 % 180) + ' ' + x + ' ' + y + ')"/>'; })
    + '<g stroke="#D7263D" stroke-width="2.8" stroke-linecap="round"><path d="M42 38l7 3M70 55l6-4M28 46l3 6M88 41l7-1M58 66l7 1M84 61l4 5"/></g>'
    + PAELLA_MEJILLON(27, 54, -25) + PAELLA_MEJILLON(95, 52, 20) + PAELLA_MEJILLON(66, 37, 5)
    + PAELLA_GAMBA(42, 49, 10) + PAELLA_GAMBA(80, 45, -40) + PAELLA_GAMBA(52, 62, 120) + PAELLA_GAMBA(76, 61, 70)
    + PAELLA_PUNTOS(12, 60, 51, 38, 16, function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="2.3" fill="#6DBE45"/><circle cx="' + (x - .7).toFixed(1) + '" cy="' + (y - .7).toFixed(1) + '" r=".7" fill="#B6E59A"/>'; })
    + PAELLA_GAJO(30, 66, -20) + PAELLA_GAJO(98, 38, 200)
    + '<g stroke="#fff" stroke-width="2.8" fill="none" stroke-linecap="round" opacity=".8">'
    + '<path class="pt-paella-humo" d="M44 30c-5-5 5-8 0-13s5-8 0-13"/><path class="pt-paella-humo" style="animation-delay:-.8s" d="M60 28c-5-5 5-8 0-13s5-8 0-13"/>'
    + '<path class="pt-paella-humo" style="animation-delay:-1.6s" d="M76 30c-5-5 5-8 0-13s5-8 0-13"/></g>' };
  // medio limón visto de frente: sus gajos
  var PAELLA_M2 = { vb: '0 0 80 80', g: (function () {
    var h = '<circle cx="40" cy="40" r="36" fill="#F5C400"/><circle cx="40" cy="40" r="32" fill="#FFF6C8"/><circle cx="40" cy="40" r="29" fill="#FFE15A"/>', i, a;
    for (i = 0; i < 8; i++) {
      a = (i + .5) * Math.PI / 4;
      h += '<ellipse cx="' + (40 + Math.cos(a) * 17).toFixed(1) + '" cy="' + (40 + Math.sin(a) * 17).toFixed(1) + '" rx="5" ry="2.4" fill="#FFF09A" transform="rotate(' + (a * 180 / Math.PI).toFixed(0) + ' ' + (40 + Math.cos(a) * 17).toFixed(1) + ' ' + (40 + Math.sin(a) * 17).toFixed(1) + ')"/>';
      a = i * Math.PI / 4;
      h += '<path d="M40 40L' + (40 + Math.cos(a) * 29).toFixed(1) + ' ' + (40 + Math.sin(a) * 29).toFixed(1) + '" stroke="#FFF6C8" stroke-width="2.6" stroke-linecap="round"/>';
    }
    return h + '<circle cx="40" cy="40" r="3.6" fill="#FFF6C8"/><path d="M50 36c1.6-1 3-1 4 0-1 1.4-2.6 1.6-4 0zM31 46c-1.6 1-3 1-4 0 1-1.4 2.6-1.6 4 0z" fill="#F4ECD8"/>'
      + '<path d="M14 26a30 30 0 0 1 16-14" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55"/>';
  })() };
  var PAELLA_J = { vb: '0 0 20 18', g: '<g stroke="#9AA8C0" stroke-width="1" fill="none" stroke-linecap="round"><path class="pt-paella-humo" d="M7.6 5.6c-1.1-1 1.1-1.8 0-2.7s1.1-1.8 0-2.6"/>'
    + '<path class="pt-paella-humo" style="animation-delay:-1.1s" d="M12.4 5.6c-1.1-1 1.1-1.8 0-2.7s1.1-1.8 0-2.6"/></g>'
    + '<path d="M2 11.6H.7M18 11.6h1.3" stroke="#56647F" stroke-width="1.8" stroke-linecap="round"/>'
    + '<ellipse cx="10" cy="12.4" rx="8.6" ry="5.4" fill="#56647F"/><ellipse cx="10" cy="11.6" rx="8.6" ry="5.3" fill="#8D9BB5"/>'
    + '<ellipse cx="10" cy="11.9" rx="7.3" ry="4.3" fill="#F2B632"/>'
    + '<path d="M6.6 10.2a1.8 1.8 0 1 0 1.7 2.2" stroke="#E8573A" stroke-width="1.3" fill="none" stroke-linecap="round"/>'
    + '<path d="M13.4 13.8a1.6 1.6 0 1 1 1.7-1.9" stroke="#E8573A" stroke-width="1.3" fill="none" stroke-linecap="round"/>'
    + '<circle cx="11.4" cy="9.6" r=".95" fill="#3E9A3A"/><circle cx="9.8" cy="14" r=".9" fill="#3E9A3A"/><path d="M13.8 9.4l1.9.6M4.4 12.6l.8 1.3" stroke="#D7263D" stroke-width=".95" stroke-linecap="round"/>'
    + '<path d="M9.6 11.9a1.3 1.3 0 0 0 2.6 0z" fill="#FFE97A" stroke="#E0B400" stroke-width=".4"/>' };
  // lo que cae al fondo de la entrada: camarones, chícharos, rodajas de limón y granos de arroz con azafrán
  var PAELLA_LLUEVE = { n: 26, z: [14, 25], formas: [
    // el camarón en «C» abierta (que no parezca una rosca): cabeza arriba a la derecha, colita abajo
    { modo: 'cae', vb: '0 0 20 20', g: '<path d="M11 15.2l4.6-1.6-1.2 2.6 1.8 2.4-5-.8z" fill="#E8613E"/>'
      + '<path d="M14.7 6.5A5.5 5.5 0 1 0 11.5 15.4" stroke="#F47C5A" stroke-width="4.6" fill="none" stroke-linecap="round"/>'
      + '<path d="M8.8 7.1 6.7 3.4M7.1 10H2.9M8.8 12.9l-2.1 3.7" stroke="#FFD2BF" stroke-width="1" stroke-linecap="round"/>'
      + '<circle cx="15" cy="6.2" r="3" fill="#F47C5A"/><path d="M16.6 4.2c1.4-1.2 2.2-2.4 2.4-3.6M17.4 5.4c1.2-.4 2-1 2.4-1.8" stroke="#E8613E" stroke-width=".8" fill="none" stroke-linecap="round"/>'
      + '<circle cx="15.8" cy="5.6" r=".9" fill="#3A2A20"/>' },
    // una vaina abierta con sus chícharos
    { modo: 'cae', vb: '0 0 20 20', g: '<path d="M1.6 13.4C5 7 13 3.6 18.6 5.2 16.6 11 8.4 15.6 1.6 13.4z" fill="#3E8E3E"/>'
      + '<path d="M3.4 12.6C7 8.6 12.6 6.2 17 6.4" stroke="#2C6E2C" stroke-width="1" fill="none" stroke-linecap="round"/>'
      + '<g fill="#7ED957"><circle cx="6" cy="11" r="2.1"/><circle cx="9.6" cy="9.2" r="2.2"/><circle cx="13.2" cy="7.8" r="2.1"/></g>'
      + '<g fill="#C9F0A8"><circle cx="5.4" cy="10.4" r=".6"/><circle cx="9" cy="8.6" r=".6"/><circle cx="12.6" cy="7.2" r=".6"/></g>' },
    { modo: 'flota', vb: '0 0 20 20', g: '<circle cx="10" cy="10" r="9" fill="#F5C400"/><circle cx="10" cy="10" r="7.7" fill="#FFF6C8"/><circle cx="10" cy="10" r="6.7" fill="#FFE15A"/>'
      + '<path d="M10 3.3v13.4M4.2 6.6l11.6 6.8M4.2 13.4l11.6-6.8" stroke="#FFF6C8" stroke-width="1.2" stroke-linecap="round"/><circle cx="10" cy="10" r="1.3" fill="#FFF6C8"/>' },
    { modo: 'cae', vb: '0 0 20 20', g: '<g fill="#FFD873"><ellipse cx="6" cy="7" rx="4" ry="1.7" transform="rotate(-30 6 7)"/><ellipse cx="14" cy="9" rx="4" ry="1.7" transform="rotate(25 14 9)"/></g>'
      + '<ellipse cx="9" cy="14.6" rx="4" ry="1.7" fill="#FFF3D0" transform="rotate(8 9 14.6)"/>' }] };
  alta('paella',
    { m: PAELLA_M, m2: PAELLA_M2, j: PAELLA_J, mov: 'brinca', mov2: 'gira', jmov: 'brinca', lluvia: PAELLA_LLUEVE, w: 116, w2: 80,
      dice: ['¡A la paella!', '¡Con mariscos!', '¡Un toque de limón!', '¡Bien fresquito!'] });
  CSS_FECHAS += '.pt-paella-humo{transform-box:fill-box;transform-origin:50% 100%;animation:pt-paella-humo 2.4s ease-in-out infinite}'
    + '@keyframes pt-paella-humo{0%{opacity:0;transform:translateY(18%) scaleY(.75)}40%{opacity:1}100%{opacity:0;transform:translateY(-22%) scaleY(1.1)}}';

  // Día de la Quesadilla (25 de septiembre): al jalar un pedazo, el queso se estira; la salsera al lado
  function QUESADILLA_TORTILLA(x, lado) {
    // un cuarto de la media luna: lado -1 (izquierdo) o 1 (derecho); x es la orilla del corte
    var b = x + lado * 40, s = lado < 0 ? 0 : 1, h = '';
    h += '<path d="M' + x + ' 66V23A43 43 0 0 ' + s + ' ' + (x + lado * 43) + ' 66Z" fill="#FFC83D"/>';
    h += '<path d="M' + x + ' 66V26A40 40 0 0 ' + s + ' ' + b + ' 66Z" fill="#F5D38B" stroke="#D9A55B" stroke-width="1.6" stroke-linejoin="round"/>';
    h += '<g fill="#DFA654" opacity=".75"><ellipse cx="' + (x + lado * 24) + '" cy="52" rx="4.2" ry="2.6"/><ellipse cx="' + (x + lado * 13) + '" cy="38" rx="3" ry="2"/>'
      + '<ellipse cx="' + (x + lado * 9) + '" cy="56" rx="2.4" ry="1.6"/><ellipse cx="' + (x + lado * 30) + '" cy="61" rx="2.6" ry="1.4"/></g>';
    h += '<rect x="' + (lado < 0 ? x - 2.2 : x) + '" y="27" width="2.2" height="39" fill="#FFD54A"/>';
    return h + '<path d="M' + (x + lado * 38.6) + ' 50c' + (lado * 1.4) + ' 3 ' + (lado * 1.4) + ' 6 0 7.4' + 'c' + (-lado * 1.4) + '-1.4' + ' ' + (-lado * 1.4) + '-4.4 0-7.4z" fill="#FFC83D"/>';
  }
  var QUESADILLA_M = { vb: '0 0 120 78', g: '<ellipse cx="58" cy="68" rx="54" ry="8" fill="#E8EDF5"/><ellipse cx="58" cy="67" rx="42" ry="4.6" fill="#D3DBE7"/>'
    + QUESADILLA_TORTILLA(52, -1)
    + '<g class="pt-quesadilla-hebra" stroke="#FFE27A" stroke-linecap="round" fill="none"><path d="M52 33q5 3.4 10 0" stroke-width="2.6"/><path d="M52 41q5 3 10 0" stroke-width="3.4"/>'
    + '<path d="M52 49q5 4 10 0" stroke-width="2.4"/><path d="M52 57q5 3 10 0" stroke-width="3"/><path d="M52 63q5 2.6 10 0" stroke-width="2"/></g>'
    + '<g class="pt-quesadilla-pieza">' + QUESADILLA_TORTILLA(62, 1) + '</g>' };
  // la salsera de barro con salsa roja, su cuchara y un chile
  var QUESADILLA_M2 = { vb: '0 0 96 78', g: '<path d="M62 30 84 7" stroke="#C9813A" stroke-width="4.6" stroke-linecap="round"/>'
    + '<path d="M26 64l-4 9h9l2-9zM63 64l2 9h9l-4-9zM43 67l-1 7h11l-1-7z" fill="#8E3E1F"/>'
    + '<path d="M12 34h72c0 22-14 36-36 36S12 56 12 34z" fill="#B5522B"/>'
    + '<g fill="#F4ECD8"><circle cx="24" cy="50" r="1.8"/><circle cx="34" cy="54" r="1.8"/><circle cx="48" cy="56" r="1.8"/><circle cx="62" cy="54" r="1.8"/><circle cx="72" cy="50" r="1.8"/></g>'
    + '<path d="M20 45c5 3 9-2 14 1s9-2 14 1 9-2 14 1 9-2 14 1" stroke="#F2C066" stroke-width="2" fill="none" stroke-linecap="round"/>'
    + '<ellipse cx="48" cy="34" rx="36" ry="8" fill="#C96A3D"/><ellipse cx="48" cy="34.6" rx="31" ry="6" fill="#D7263D"/>'
    + '<g fill="#A3172B"><circle cx="34" cy="33" r="1.6"/><circle cx="58" cy="36" r="1.6"/><circle cx="44" cy="37" r="1.4"/></g>'
    + '<g fill="#6DBE45"><circle cx="38" cy="36" r="1.6"/><circle cx="52" cy="32" r="1.5"/><circle cx="66" cy="35" r="1.6"/><circle cx="28" cy="35" r="1.3"/></g>'
    + '<g fill="#F4ECD8"><rect x="45" y="33.6" width="2.4" height="2" rx=".5"/><rect x="61" y="32.4" width="2.4" height="2" rx=".5"/><rect x="31" y="36" width="2.2" height="1.8" rx=".5"/></g>'
    + '<path d="M58 33c3-1 5-3 6-4" stroke="#C9813A" stroke-width="4.6" stroke-linecap="round"/><path d="M71 16l9-9" stroke="#E2A35E" stroke-width="1.4" stroke-linecap="round"/>'
    + '<path d="M3 70c9 6 24 7 34 1-9-5-24-6-34-1z" fill="#E03A2E"/><path d="M8 69c6 1.4 12 1.6 18 1" stroke="#FF8A7A" stroke-width="1.4" fill="none" stroke-linecap="round"/>'
    + '<path d="M36.6 70.4c3-1.6 5-1.4 7-4" stroke="#3E7A2E" stroke-width="2.6" fill="none" stroke-linecap="round"/>' };
  // junto al signo: la media luna con el queso derretido que se sale por la orilla y escurre
  var QUESADILLA_J = { vb: '0 0 20 16', g: '<path d="M.5 13.4A9.5 9.5 0 0 1 19.5 13.4Z" fill="#FFB800"/>'
    + '<circle cx="2.6" cy="8.6" r="1.5" fill="#FFB800"/><circle cx="12.6" cy="4.1" r="1.4" fill="#FFB800"/><circle cx="17.5" cy="8.4" r="1.3" fill="#FFB800"/>'
    + '<g class="pt-quesadilla-gota"><path d="M18 11.6c1.4 0 1.7 1.2 1.7 2.4v1.2c0 .9-.4 1.3-.85 1.3s-.85-.4-.85-1.3z" fill="#FFB800"/></g>'
    + '<path d="M1.9 13.4A8.1 8.1 0 0 1 18.1 13.4Z" fill="#F5D38B" stroke="#C98E3E" stroke-width=".7" stroke-linejoin="round"/>'
    + '<g fill="#D9963E" opacity=".8"><ellipse cx="6.4" cy="10.4" rx="1.3" ry=".75"/><ellipse cx="11.6" cy="8.2" rx="1" ry=".6"/><ellipse cx="13.8" cy="11.6" rx="1.1" ry=".6"/><ellipse cx="9" cy="12.3" rx=".7" ry=".45"/></g>'
    + '<path d="M1.6 13.5h16.8" stroke="#C98E3E" stroke-width=".8" stroke-linecap="round"/>' };
  // lo que cae al fondo de la entrada: hilos de queso derretido, cuadritos de queso y chiles rojos y verdes
  function QUESADILLA_CHILE(c, luz) {
    return '<path d="M11 5.5C9 9.5 6.5 14 2.6 17.6 8.4 16.8 14 13.2 16.6 7.6 15 4.6 13 4.4 11 5.5z" fill="' + c + '"/>'
      + '<path d="M10.8 8.2c-1 2.4-2.6 5-4.6 7.2" stroke="' + luz + '" stroke-width="1.3" fill="none" stroke-linecap="round"/>'
      + '<path d="M10.6 5.8q3-2 6.2 1.6M13.8 5.4c.2-2 1.4-3.4 3.2-4" stroke="#3E7A2E" stroke-width="2" fill="none" stroke-linecap="round"/>';
  }
  var QUESADILLA_LLUEVE = { n: 24, z: [13, 25], formas: [
    // hilos de queso deshebrado: tres hebras onduladas que bajan meciéndose
    { modo: 'flota', vb: '0 0 20 20', g: '<g fill="none" stroke-linecap="round"><path d="M3 4.4c3-1.4 4 2.4 7 1s4 2.4 7 1" stroke="#FFF0C2" stroke-width="2"/>'
      + '<path d="M2.6 9.6c3-1.6 4.2 2.6 7.4 1s4.2 2.4 7.4.8" stroke="#FFD54A" stroke-width="2.2"/>'
      + '<path d="M3.6 15c3-1.4 4 2.2 6.8.8s4 2.2 6.6.8" stroke="#FFF0C2" stroke-width="1.8"/></g>' },
    { modo: 'cae', vb: '0 0 20 20', g: '<path d="M10 2.4 17.6 6.4 10 10.4 2.4 6.4z" fill="#FFF0B0"/><path d="M2.4 6.4 10 10.4v7.4l-7.6-4z" fill="#FFD54A"/>'
      + '<path d="M10 10.4l7.6-4v7.4l-7.6 4z" fill="#E9B23A"/>' },
    { modo: 'cae', vb: '0 0 20 20', g: QUESADILLA_CHILE('#E03A2E', '#FF8A7A') },
    { modo: 'cae', vb: '0 0 20 20', g: QUESADILLA_CHILE('#4E9A3A', '#9BD16B') }] };
  alta('quesadilla',
    { m: QUESADILLA_M, m2: QUESADILLA_M2, j: QUESADILLA_J, mov: 'brinca', mov2: 'mece', jmov: 'brinca', lluvia: QUESADILLA_LLUEVE, w: 112, w2: 92,
      dice: ['¡Con queso, claro!', '¡Bien derretidita!', '¡Pásame la salsa!', '¡Que pique poquito!'] });
  CSS_FECHAS += '.pt-quesadilla-pieza{transform-box:fill-box;animation:pt-quesadilla-pieza 2.2s ease-in-out infinite alternate}'
    + '@keyframes pt-quesadilla-pieza{from{transform:translateX(-13%)}to{transform:translateX(12%)}}'
    + '.pt-quesadilla-hebra{transform-box:fill-box;transform-origin:0 50%;animation:pt-quesadilla-hebra 2.2s ease-in-out infinite alternate}'
    + '@keyframes pt-quesadilla-hebra{from{transform:scaleX(.45)}to{transform:scaleX(1.5)}}'
    + '.pt-quesadilla-gota{transform-box:fill-box;transform-origin:50% 0;animation:pt-quesadilla-gota 1.8s ease-in-out infinite}'
    + '@keyframes pt-quesadilla-gota{0%,100%{transform:scaleY(.7)}50%{transform:scaleY(1.15)}}';

  // Día del Café (1 de octubre): la taza humea; los granos flotan
  var CAFE_M = { vb: '0 0 100 96', g: '<g stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8">'
    + '<path class="pt-cafe-humo" d="M38 32c-5-5 5-8 0-13s5-8 0-13"/><path class="pt-cafe-humo" style="animation-delay:-.8s" d="M50 30c-5-5 5-8 0-13s5-8 0-13"/>'
    + '<path class="pt-cafe-humo" style="animation-delay:-1.6s" d="M62 32c-5-5 5-8 0-13s5-8 0-13"/></g>'
    + '<ellipse cx="50" cy="87" rx="44" ry="8.6" fill="#DCE3EE"/><ellipse cx="50" cy="85.6" rx="27" ry="4.6" fill="#C3CCDA"/>'
    + '<path d="M76 50c12 0 14 19 0 20" stroke="#D8D1C2" stroke-width="8.4" fill="none" stroke-linecap="round"/><path d="M76 50c12 0 14 19 0 20" stroke="#F7F4EE" stroke-width="6.4" fill="none" stroke-linecap="round"/>'
    + '<path d="M22 42h56v28c0 10-8 17-18 17H40c-10 0-18-7-18-17z" fill="#F7F4EE" stroke="#D8D1C2" stroke-width="1"/>'
    + '<path d="M68 42h10v28c0 10-8 17-18 17h-3c8-3 11-9 11-17z" fill="#E4DCCC"/>'
    + '<path d="M22 53h56v10H22z" fill="#F07A1E"/><g fill="#FFE3C8"><circle cx="30" cy="58" r="1.6"/><circle cx="40" cy="58" r="1.6"/><circle cx="50" cy="58" r="1.6"/><circle cx="60" cy="58" r="1.6"/><circle cx="70" cy="58" r="1.6"/></g>'
    + '<path d="M22.6 67.5h54.8" stroke="#1F3864" stroke-width="2.2"/>'
    + '<ellipse cx="50" cy="42" rx="28" ry="6.6" fill="#F7F4EE" stroke="#D8D1C2" stroke-width="1"/><ellipse cx="50" cy="42.6" rx="24.4" ry="4.8" fill="#6B3E26"/>'
    + '<ellipse cx="49" cy="42.4" rx="15" ry="2.8" fill="#A0673E"/><path d="M49 44.4s-3.6-1.6-3.6-3a1.8 1.8 0 0 1 3.6-.5 1.8 1.8 0 0 1 3.6.5c0 1.4-3.6 3-3.6 3z" fill="#E8C9A0"/>' };
  function CAFE_GRANO(x, y, r, s) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ') scale(' + s + ')"><ellipse rx="13" ry="9" fill="#9A6440"/><ellipse cx="-2" cy="-3.6" rx="7.6" ry="3.2" fill="#B97D4E"/>'
      + '<path d="M-11 .6c5-4.4 7.4 3.4 11 0s6-4.4 11 0" stroke="#4A2A18" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>';
  }
  var CAFE_M2 = { vb: '0 0 92 72', g: '<path d="M8 30c12-16 30-18 40-10-12 12-28 16-40 10z" fill="#3E8E3E"/><path d="M12 29c10-4 22-6 34-8" stroke="#7FC86A" stroke-width="1.4" fill="none" stroke-linecap="round"/>'
    + '<path d="M86 34c-10-14-28-18-38-12 10 12 26 16 38 12z" fill="#4E9A3A"/><path d="M82 33c-9-4-20-7-32-10" stroke="#8FD27A" stroke-width="1.4" fill="none" stroke-linecap="round"/>'
    + '<path d="M58 12c2-4 6-6 9-6M66 14c1-4 4-7 7-8" stroke="#3E7A2E" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
    + '<circle cx="58" cy="16" r="5.6" fill="#D7263D"/><circle cx="66.6" cy="18.6" r="5.2" fill="#B81D33"/><circle cx="56.4" cy="14.2" r="1.5" fill="#fff" opacity=".6"/><circle cx="65.2" cy="17" r="1.3" fill="#fff" opacity=".5"/>'
    + CAFE_GRANO(26, 50, -24, 1) + CAFE_GRANO(64, 52, 18, 1.05) + CAFE_GRANO(45, 36, 64, .9) };
  var CAFE_J = { vb: '0 0 20 19', g: '<g stroke="#9AA8C0" stroke-width="1" fill="none" stroke-linecap="round"><path class="pt-cafe-humo" d="M7.4 6.4c-1.1-1 1.1-1.9 0-3s1.1-1.9 0-3"/>'
    + '<path class="pt-cafe-humo" style="animation-delay:-1.1s" d="M11.4 6.4c-1.1-1 1.1-1.9 0-3s1.1-1.9 0-3"/></g>'
    + '<ellipse cx="9.4" cy="17.9" rx="8.2" ry="1.2" fill="#AEB8CA"/>'
    + '<path d="M14.6 10.2c3.2 0 3.4 4.8 0 5" stroke="#F07A1E" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
    + '<path d="M3.6 8.4h11.2v5.6c0 2-1.6 3.5-3.6 3.5H7.2c-2 0-3.6-1.5-3.6-3.5z" fill="#F07A1E"/>'
    + '<path d="M3.6 11.2h11.2v1.5H3.6z" fill="#1F3864"/><ellipse cx="9.2" cy="8.5" rx="5.6" ry="1.3" fill="#7A4A2C" stroke="#F07A1E" stroke-width=".6"/>' };
  // lo que cae al fondo de la entrada: granos de café que caen girando y hilos de vapor que suben
  var CAFE_LLUEVE = { n: 24, z: [13, 26], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: CAFE_GRANO(10, 10, -30, .66) },
    { modo: 'sube', vb: '0 0 20 20', g: '<path d="M10 19c-4-3 4-5.4 0-9s4-5.4 0-9" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".75"/>' },
    { modo: 'cae', vb: '0 0 20 20', g: CAFE_GRANO(10, 10, 40, .6) },
    { modo: 'sube', vb: '0 0 20 20', g: '<g stroke="#E4DCCC" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"><path d="M6.6 19c-3.4-2.6 3.4-4.6 0-7.6s3.4-4.6 0-7.6"/>'
      + '<path d="M13.4 17c-3.4-2.6 3.4-4.6 0-7.6s3.4-4.6 0-7.6"/></g>' }] };
  alta('cafe',
    { m: CAFE_M, m2: CAFE_M2, j: CAFE_J, mov: 'mece', mov2: 'flota', jmov: 'mece', lluvia: CAFE_LLUEVE, w: 100, w2: 92,
      dice: ['¡Un cafecito!', '¡Recién hecho!', '¡Granos de altura!', '¡Huele delicioso!'] });
  CSS_FECHAS += '.pt-cafe-humo{transform-box:fill-box;transform-origin:50% 100%;animation:pt-cafe-humo 2.4s ease-in-out infinite}'
    + '@keyframes pt-cafe-humo{0%{opacity:0;transform:translateY(18%) scaleY(.75)}40%{opacity:1}100%{opacity:0;transform:translateY(-22%) scaleY(1.1)}}';

  // Día de la Dona (5 de noviembre): la dona rosa con chispitas gira; la de chocolate brinca
  // aro con orilla ondulada (para el glaseado) y su hoyo; regla «evenodd»
  function DONA_ARO(cx, cy, rOut, amp, ondas, rIn, ampIn) {
    var d = '', i, a, r, n = 96;
    for (i = 0; i <= n; i++) {
      a = i / n * 2 * Math.PI; r = rOut + amp * Math.sin(a * ondas) + amp * .45 * Math.sin(a * (ondas * 2 - 1) + 1);
      d += (i ? 'L' : 'M') + (cx + Math.cos(a) * r).toFixed(2) + ' ' + (cy + Math.sin(a) * r).toFixed(2);
    }
    d += 'Z';
    for (i = 0; i <= n; i++) {
      a = -i / n * 2 * Math.PI; r = rIn + ampIn * Math.sin(a * 5 + .5);
      d += (i ? 'L' : 'M') + (cx + Math.cos(a) * r).toFixed(2) + ' ' + (cy + Math.sin(a) * r).toFixed(2);
    }
    return d + 'Z';
  }
  function DONA_CHISPAS(cx, cy, n, r0, r1, w, h, cols) {
    var s = '', i, a, r, x, y;
    for (i = 0; i < n; i++) {
      a = i * 2.39996 + .5; r = r0 + ((i * 7.3) % (r1 - r0)); x = (cx + Math.cos(a) * r).toFixed(1); y = (cy + Math.sin(a) * r).toFixed(1);
      s += '<rect x="' + (-w / 2) + '" y="' + (-h / 2) + '" width="' + w + '" height="' + h + '" rx="' + (h / 2) + '" fill="' + cols[i % cols.length] + '" transform="translate(' + x + ' ' + y + ') rotate(' + ((i * 67) % 180) + ')"/>';
    }
    return s;
  }
  function DONA_GRANDE(glas, brillo, extra) {
    return '<path d="' + DONA_ARO(50, 52, 44, 0, 1, 13, 0) + '" fill="#C47F3A" fill-rule="evenodd"/>'
      + '<path d="' + DONA_ARO(50, 50, 44, 0, 1, 13, 0) + '" fill="#E3A55E" fill-rule="evenodd"/>'
      + '<path d="' + DONA_ARO(50, 49, 37.5, 2.6, 7, 16, 1) + '" fill="' + glas + '" fill-rule="evenodd"/>'
      + '<path d="M22 36a32 32 0 0 1 18-14" stroke="' + brillo + '" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".8"/>' + extra;
  }
  var DONA_M = { vb: '0 0 100 100', g: DONA_GRANDE('#F28DB2', '#FFC9DE', DONA_CHISPAS(50, 49, 22, 21, 33, 6.4, 2.2, ['#FFE066', '#5BD69A', '#7FB2EA', '#fff', '#F07A1E', '#1F3864'])) };
  var DONA_M2 = { vb: '0 0 100 100', g: DONA_GRANDE('#6B3E26', '#9A6040', (function () {
    var d = '', i, a, r, n = 120;
    for (i = 0; i <= n; i++) { a = i / n * 2 * Math.PI; r = 27 + 4 * Math.sin(a * 8); d += (i ? 'L' : 'M') + (50 + Math.cos(a) * r).toFixed(2) + ' ' + (49 + Math.sin(a) * r).toFixed(2); }
    return '<path d="' + d + '" stroke="#FFF3E0" stroke-width="2.2" fill="none" stroke-linejoin="round"/>';
  })()) };
  // la dona chiquita (junto al signo y en la lluvia): masa, glaseado ondulado y chispitas
  function DONA_CHICA(glas, cols) {
    return '<path d="' + DONA_ARO(10, 10.5, 9.2, 0, 1, 2.7, 0) + '" fill="#B9773A" fill-rule="evenodd"/>'
      + '<path d="' + DONA_ARO(10, 10, 9.2, 0, 1, 2.7, 0) + '" fill="#DE9A50" fill-rule="evenodd"/>'
      + '<path d="' + DONA_ARO(10, 9.8, 7.4, .55, 7, 3.5, .2) + '" fill="' + glas + '" fill-rule="evenodd"/>'
      + DONA_CHISPAS(10, 9.8, 8, 4.8, 6.6, 2.4, .95, cols);
  }
  var DONA_J = { vb: '0 0 20 20', g: DONA_CHICA('#F27BAA', ['#FFE066', '#1F3864', '#fff', '#5BD69A']) };
  // lo que cae al fondo de la entrada: puñitos de chispitas de colores y donitas rosas y de chocolate
  // (las chispitas también caen el Día del Pastel)
  function DONA_PUNITO(lista) {
    return lista.map(function (c) { return '<rect x="-4.6" y="-1.6" width="9.2" height="3.2" rx="1.6" fill="' + c[3] + '" transform="translate(' + c[0] + ' ' + c[1] + ') rotate(' + c[2] + ')"/>'; }).join('');
  }
  var DONA_CHISPITAS = [
    { modo: 'cae', vb: '0 0 20 20', g: DONA_PUNITO([[6, 6, 35, '#FFE066'], [14.5, 7.5, -55, '#5BD69A'], [7.6, 15, -10, '#7FB2EA'], [16.2, 15.8, 70, '#fff']]) },
    { modo: 'cae', vb: '0 0 20 20', g: DONA_PUNITO([[5.2, 8.6, -62, '#F28DB2'], [11.8, 4.2, 12, '#F07A1E'], [15, 11.8, 52, '#fff'], [7.6, 16, 18, '#FFE066']]) }];
  var DONA_LLUEVE = { n: 26, z: [15, 27], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: DONA_J.g }, DONA_CHISPITAS[0],
    { modo: 'cae', vb: '0 0 20 20', g: DONA_CHICA('#6B3E26', ['#FFE066', '#F28DB2', '#fff', '#7FB2EA']) }, DONA_CHISPITAS[1]] };
  alta('dona',
    { m: DONA_M, m2: DONA_M2, j: DONA_J, mov: 'gira', mov2: 'brinca', jmov: 'gira', lluvia: DONA_LLUEVE, w: 96, w2: 92,
      dice: ['¡Con chispitas!', '¡Una más, porfa!', '¡De chocolate!', '¡Dulce día!'] });

  // Día de los Nachos (6 de noviembre): el totopo se moja en el queso; el plato de nachos al lado
  function NACHOS_TRI(cx, cy, s, r, c) {
    var p = [], i, a;
    for (i = 0; i < 3; i++) { a = (r - 90 + i * 120) * Math.PI / 180; p.push((cx + Math.cos(a) * s).toFixed(1) + ' ' + (cy + Math.sin(a) * s).toFixed(1)); }
    return '<path d="M' + p.join('L') + 'Z" fill="' + c + '" stroke="#D59A35" stroke-width="2" stroke-linejoin="round"/>'
      + '<g fill="#E2AE52"><circle cx="' + (cx - s * .2).toFixed(1) + '" cy="' + (cy + s * .1).toFixed(1) + '" r="' + (s * .07).toFixed(1) + '"/><circle cx="' + (cx + s * .22).toFixed(1) + '" cy="' + (cy - s * .05).toFixed(1) + '" r="' + (s * .06).toFixed(1) + '"/></g>';
  }
  var NACHOS_M = { vb: '0 0 100 96', g: '<ellipse cx="50" cy="56" rx="36" ry="8.6" fill="#F79A4A"/><ellipse cx="50" cy="56.8" rx="31.4" ry="6.4" fill="#FFB627"/>'
    + '<g fill="#FFD36B"><ellipse cx="36" cy="56" rx="4" ry="1.4"/><ellipse cx="62" cy="58" rx="3.4" ry="1.2"/><circle cx="56" cy="54.6" r="1"/></g>'
    + '<g class="pt-nachos-totopo"><path d="M36 12 66 15 51 47z" fill="#F6D488" stroke="#D59A35" stroke-width="2.4" stroke-linejoin="round"/>'
    + '<g fill="#E2AE52"><circle cx="46" cy="20" r="1.4"/><circle cx="56" cy="22" r="1.2"/><circle cx="50" cy="28" r="1.1"/></g>'
    + '<path d="M44.2 34.2c3 1.6 6 .4 8.4-.4 1.6-.6 3-.4 4 .2L51 47z" fill="#FFB627" stroke="#F09A12" stroke-width="1" stroke-linejoin="round"/>'
    + '<path d="M50.6 46.6c-1 2.6-.8 4.4.4 5.4 1-1.2 1-3-.4-5.4z" fill="#FFB627"/></g>'
    + '<path d="M14 56A36 8.6 0 0 0 86 56C86 77 70 90 50 90S14 77 14 56z" fill="#F07A1E"/>'
    + '<path d="M14.6 57.6A36 8.6 0 0 0 85.4 57.6" stroke="#F79A4A" stroke-width="2.4" fill="none"/>'
    + '<path d="M18 72q32 12 64 0" stroke="#1F3864" stroke-width="3.6" fill="none"/><g fill="#FFE3C8"><circle cx="30" cy="80" r="1.8"/><circle cx="50" cy="84" r="1.8"/><circle cx="70" cy="80" r="1.8"/></g>'
    + '' };
  function NACHOS_JALAPENO(x, y, r) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#3E8E3E"/><circle cx="' + x + '" cy="' + y + '" r="' + (r * .62).toFixed(1) + '" fill="#9BD16B"/>'
      + '<g fill="#F4ECD8"><circle cx="' + (x - r * .2).toFixed(1) + '" cy="' + (y - r * .15).toFixed(1) + '" r="' + (r * .14).toFixed(1) + '"/><circle cx="' + (x + r * .22).toFixed(1) + '" cy="' + (y + r * .05).toFixed(1) + '" r="' + (r * .14).toFixed(1) + '"/><circle cx="' + x + '" cy="' + (y + r * .3).toFixed(1) + '" r="' + (r * .14).toFixed(1) + '"/></g>';
  }
  var NACHOS_M2 = { vb: '0 0 110 82', g: '<ellipse cx="55" cy="64" rx="51" ry="14" fill="#E8EDF5"/><ellipse cx="55" cy="63" rx="40" ry="9" fill="#D3DBE7"/>'
    + NACHOS_TRI(34, 40, 17, -20, '#F6D488') + NACHOS_TRI(56, 30, 18, 10, '#F2C770') + NACHOS_TRI(77, 40, 17, 38, '#F6D488')
    + NACHOS_TRI(22, 56, 14, 28, '#F2C770') + NACHOS_TRI(88, 56, 14, -14, '#F2C770') + NACHOS_TRI(44, 54, 17, -40, '#F6D488') + NACHOS_TRI(68, 55, 17, 22, '#F6D488')
    + '<path d="M28 40c7-6 13 1 19-3s12-8 19-3 12 3 17 1c2 6-3 9-8 9l1 6c-1 3-4 2-4-1-6 2-12 2-18 0l-1 6c-1 3-4 2-4-1v-5c-8-1-15-4-21-9z" fill="#FFB627"/>'
    + '<path d="M36 41c5-2 9 0 13-2" stroke="#FFD36B" stroke-width="2" fill="none" stroke-linecap="round"/>'
    + NACHOS_JALAPENO(42, 44, 4.4) + NACHOS_JALAPENO(66, 40, 4) + NACHOS_JALAPENO(56, 52, 3.6)
    + '<g fill="#E03A2E"><rect x="30" y="47" width="4" height="4" rx="1" transform="rotate(20 32 49)"/><rect x="72" y="47" width="4" height="4" rx="1" transform="rotate(-15 74 49)"/><rect x="52" y="38" width="3.6" height="3.6" rx="1" transform="rotate(35 54 40)"/></g>' };
  var NACHOS_J = { vb: '0 0 20 18', g: '<path d="M10 1.6 18.4 16.4H1.6Z" fill="#F6D488" stroke="#C98E2B" stroke-width="1" stroke-linejoin="round"/>'
    + '<path d="M10 1.6 14.6 9.7c-.9.4-1.6-.2-2.3.5-.5.6-.5 1.4-1.2 1.4s-.7-1-1.3-1.5c-.6-.5-1.3.4-2-.1-.6-.4-.3-1-1.2-.9-.5 0-.8.4-1.2.3z" fill="#FFA41B" stroke="#E08A00" stroke-width=".4" stroke-linejoin="round"/>'
    + '<g class="pt-nachos-gota"><path d="M11.2 11.4c-.6 1.2-.6 2.2 0 2.6.6-.4.6-1.4 0-2.6z" fill="#FFA41B"/></g>'
    + '<g fill="#E2AE52"><circle cx="6.4" cy="14" r=".6"/><circle cx="13.4" cy="14.2" r=".55"/></g>' };
  // lo que cae al fondo de la entrada: totopos que caen girando (unos con queso) y rodajas de jalapeño
  var NACHOS_LLUEVE = { n: 24, z: [14, 26], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: NACHOS_TRI(10, 11.4, 8.6, 0, '#F6D488') },
    { modo: 'flota', vb: '0 0 20 20', g: NACHOS_JALAPENO(10, 10, 8.4) },
    { modo: 'cae', vb: '0 0 20 20', g: NACHOS_TRI(10, 11.4, 8.6, 0, '#F2C770')
      + '<path d="M10 2.6 13.9 9.4c-.7.6-1.4.2-2 .4v2.2c0 .8-.4 1.2-.8 1.2s-.8-.4-.8-1.2v-1.8c-.6-.3-1.1.6-1.8.3-.6-.3-.8-1-1.6-.8-.4.1-.6.2-.9.1z" fill="#FFB627" stroke="#F09A12" stroke-width=".5" stroke-linejoin="round"/>' }] };
  alta('nachos',
    { m: NACHOS_M, m2: NACHOS_M2, j: NACHOS_J, mov: 'late', mov2: 'brinca', jmov: 'brinca', lluvia: NACHOS_LLUEVE, w: 100, w2: 110,
      dice: ['¡Con mucho queso!', '¡A remojar!', '¡Con jalapeño!', '¡A compartir!'] });
  CSS_FECHAS += '.pt-nachos-totopo{transform-box:fill-box;transform-origin:50% 100%;animation:pt-nachos-moja 2.2s ease-in-out infinite}'
    + '@keyframes pt-nachos-moja{0%,100%{transform:translateY(-10%) rotate(-6deg)}45%,62%{transform:translateY(22%) rotate(3deg)}}'
    + '.pt-nachos-gota{transform-box:fill-box;transform-origin:50% 0;animation:pt-nachos-gota 1.8s ease-in-out infinite}'
    + '@keyframes pt-nachos-gota{0%,100%{transform:scaleY(.55)}50%{transform:scaleY(1.3)}}';

  // Día del Cartero (12 de noviembre): un sobre con alitas vuela; el buzón levanta su banderita
  function CARTERO_ALA(c, borde) {
    return '<path d="M30 38C22 26 10 22 2 25c4 2 6 4 7 6-4 0-7 2-8 4 5 1 8 2 10 3-3 1-5 3-5 5 8 3 18 1 24-5z" fill="' + c + '" stroke="' + borde + '" stroke-width="1.3" stroke-linejoin="round"/>'
      + '<path d="M26 37c-5-3-11-4-17-3M24 41c-4-1-9-1-14 1" stroke="' + borde + '" stroke-width="1" fill="none" stroke-linecap="round"/>';
  }
  var CARTERO_M = { vb: '0 0 116 72', g: '<g class="pt-cartero-ala">' + CARTERO_ALA('#EAF1FB', '#C9D1DE') + '</g>'
    + '<g transform="matrix(-1 0 0 1 116 0)"><g class="pt-cartero-ala">' + CARTERO_ALA('#EAF1FB', '#C9D1DE') + '</g></g>'
    + '<rect x="29" y="18" width="58" height="40" rx="4" fill="#fff" stroke="#C9D1DE" stroke-width="1.4"/>'
    + '<path d="M30.5 56.5 52 40M85.5 56.5 64 40" stroke="#C9D1DE" stroke-width="1.4" stroke-linecap="round"/>'
    + '<path d="M30.5 20 58 42 85.5 20z" fill="#EEF2F8" stroke="#C9D1DE" stroke-width="1.4" stroke-linejoin="round"/>'
    + '<rect x="71" y="24" width="11" height="12" rx="1" fill="#7FB2EA" stroke="#fff" stroke-width="1.2" stroke-dasharray="1.6 1.1"/><circle cx="76.5" cy="29" r="2.4" fill="#FFE066"/>'
    + '<circle cx="58" cy="42" r="6.6" fill="#F07A1E"/><path d="M58 45.4s-3.4-2.1-3.4-4.3a1.7 1.7 0 0 1 3.4-.9 1.7 1.7 0 0 1 3.4.9c0 2.2-3.4 4.3-3.4 4.3z" fill="#fff"/>' };
  var CARTERO_M2 = { vb: '0 0 104 100', g: '<ellipse cx="48" cy="97" rx="24" ry="3" fill="#0A1222" opacity=".3"/>'
    + '<rect x="43" y="58" width="10" height="39" rx="2" fill="#A0673E"/><rect x="43" y="58" width="3.4" height="39" rx="1.5" fill="#B97D4E"/>'
    + '<g class="pt-cartero-bandera"><rect x="84" y="20" width="3.4" height="34" rx="1.5" fill="#C9D1DE"/><path d="M87.4 21h13v10h-13z" fill="#E03A2E"/></g>'
    + '<path d="M8 60V36c0-12 9-20 22-20h36c13 0 22 8 22 20v24z" fill="#F07A1E"/>'
    + '<path d="M8 60V36c0-12 9-20 22-20h4c-11 0-18 8-18 20v24z" fill="#C85E10"/>'
    + '<rect x="6" y="57" width="84" height="6" rx="2.4" fill="#1F3864"/>'
    + '<rect x="42" y="29" width="28" height="18" rx="2" fill="#fff"/><path d="M43 30.4 56 40l13-9.6" stroke="#C9D1DE" stroke-width="1.6" fill="none" stroke-linejoin="round"/>'
    + '<g transform="rotate(-14 10 42)"><rect x="1" y="36" width="16" height="11" rx="1.4" fill="#fff" stroke="#C9D1DE" stroke-width="1"/><path d="M2 37 9 42l7-5" stroke="#C9D1DE" stroke-width="1" fill="none"/></g>'
    + '<path d="M30 22c-6 1-10 5-11 10" stroke="#FF9F55" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>' };
  var CARTERO_J = { vb: '0 0 20 15', g: '<g class="pt-cartero-ala"><path d="M6.4 7C4.4 4 2 3.4.6 4.2c.9.4 1.3 1 1.5 1.5-.9.1-1.4.6-1.6 1.1 1.4.3 2.6.5 3.6.7-.5.3-.8.8-.8 1.2 1.4.4 2.4 0 3.1-1.7z" fill="#DCE7F6" stroke="#9AA8C0" stroke-width=".6" stroke-linejoin="round"/></g>'
    + '<rect x="5.4" y="3.4" width="13.8" height="10" rx="1.2" fill="#fff" stroke="#AEB8CA" stroke-width=".8"/>'
    + '<path d="M5.9 3.9 12.3 8.6 18.7 3.9" stroke="#8A94A6" stroke-width=".8" fill="none" stroke-linejoin="round"/>'
    + '<circle cx="12.3" cy="8.6" r="1.7" fill="#F07A1E"/>' };
  // lo que cae al fondo de la entrada: sobres (uno de correo aéreo) que flotan y estampillas que giran
  // la estampilla: orilla dentada (puntitos blancos sobre la orilla) y su dibujo adentro
  function CARTERO_ESTAMPA(c, dibujo) {
    return '<rect x="3.5" y="3" width="13" height="14" fill="#fff" stroke="#fff" stroke-width="2.4" stroke-dasharray="0 2.7" stroke-linecap="round"/>'
      + '<rect x="5.6" y="5.1" width="8.8" height="9.8" fill="' + c + '"/>' + dibujo;
  }
  var CARTERO_LLUEVE = { n: 22, z: [15, 27], formas: [
    { modo: 'flota', vb: '0 0 22 16', g: '<rect x="1" y="1.5" width="20" height="13" rx="1.6" fill="#fff"/>'
      + '<path d="M1.8 13.8l6.6-5.6M20.2 13.8l-6.6-5.6" stroke="#D3DBE7" stroke-width="1" stroke-linecap="round"/>'
      + '<path d="M1.8 2.4 11 9.4l9.2-7" stroke="#AEB8CA" stroke-width="1.2" fill="none" stroke-linejoin="round"/><circle cx="11" cy="9.2" r="2.2" fill="#F07A1E"/>' },
    { modo: 'cae', vb: '0 0 20 20', g: CARTERO_ESTAMPA('#7FB2EA', '<circle cx="11.8" cy="8.2" r="1.9" fill="#FFE066"/><path d="M5.6 14.9v-2.6c1.6-1.8 3.2-1.8 4.4-.2 1.2-1.2 2.8-1.4 4.4 0v2.8z" fill="#fff"/>') },
    { modo: 'flota', vb: '0 0 22 16', g: '<rect x="1.8" y="2.3" width="18.4" height="11.4" rx="1" fill="#fff"/>'
      + '<rect x="1.8" y="2.3" width="18.4" height="11.4" rx="1" fill="none" stroke="#E03A2E" stroke-width="1.6" stroke-dasharray="2.2 2.2"/>'
      + '<rect x="1.8" y="2.3" width="18.4" height="11.4" rx="1" fill="none" stroke="#3B6FC4" stroke-width="1.6" stroke-dasharray="2.2 2.2" stroke-dashoffset="2.2"/>'
      + '<path d="M3.4 4 11 9.2 18.6 4" stroke="#AEB8CA" stroke-width="1.1" fill="none" stroke-linejoin="round"/>' },
    { modo: 'cae', vb: '0 0 20 20', g: CARTERO_ESTAMPA('#F07A1E', '<path d="M10 6.6l1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3z" fill="#fff"/>') }] };
  alta('cartero',
    { m: CARTERO_M, m2: CARTERO_M2, j: CARTERO_J, mov: 'vuela', mov2: 'brinca', jmov: 'vuela', lluvia: CARTERO_LLUEVE, w: 108, w2: 92,
      dice: ['¡Carta para ti!', '¡Con cariño!', '¡Llegó correo!', '¡Gracias, cartero!'] });
  CSS_FECHAS += '.pt-cartero-ala{transform-box:fill-box;transform-origin:100% 65%;animation:pt-cartero-ala .45s ease-in-out infinite alternate}'
    + '@keyframes pt-cartero-ala{from{transform:rotate(16deg)}to{transform:rotate(-24deg)}}'
    + '.pt-cartero-bandera{transform-box:fill-box;transform-origin:12% 100%;animation:pt-cartero-bandera 2.4s ease-in-out infinite}'
    + '@keyframes pt-cartero-bandera{0%,40%,100%{transform:rotate(0)}55%{transform:rotate(16deg)}70%{transform:rotate(-6deg)}85%{transform:rotate(4deg)}}';

  // Día de la Revolución (20 de noviembre): la bandera ondea y el sombrero de ala ancha saluda; papel picado tricolor
  function REVOLUCION_Y(x) { return 14 + 5 * Math.sin((x - 13) / 99 * 2 * Math.PI); }
  function REVOLUCION_TIRA(x0, x1, c, op) {
    var p = [], x;
    for (x = x0; x < x1; x += 2.5) p.push(x.toFixed(1) + ' ' + REVOLUCION_Y(x).toFixed(1));
    p.push(x1.toFixed(1) + ' ' + REVOLUCION_Y(x1).toFixed(1));
    for (x = x1; x > x0; x -= 2.5) p.push(x.toFixed(1) + ' ' + (REVOLUCION_Y(x) + 54).toFixed(1));
    p.push(x0.toFixed(1) + ' ' + (REVOLUCION_Y(x0) + 54).toFixed(1));
    return '<path d="M' + p.join('L') + 'Z" fill="' + c + '"' + (op ? ' opacity="' + op + '"' : '') + '/>';
  }
  var REVOLUCION_M = { vb: '0 0 116 110', g: '<rect x="8" y="5" width="5" height="104" rx="2.2" fill="#C9D1DE"/><circle cx="10.5" cy="5" r="4.6" fill="#F2C066"/>'
    + '<g class="pt-revolucion-tela">' + REVOLUCION_TIRA(13, 46, '#006847') + REVOLUCION_TIRA(46, 79, '#fff') + REVOLUCION_TIRA(79, 112, '#CE1126')
    + REVOLUCION_TIRA(24, 38, '#0A1222', .14) + REVOLUCION_TIRA(74, 88, '#fff', .16)
    + '<circle cx="62.5" cy="40" r="8" fill="#8C6A3D"/><path d="M56 45.6q6.5 6 13 0" stroke="#3E7A2E" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>' };
  var REVOLUCION_SOMBRERO = { vb: '0 0 120 64', g: '<ellipse cx="60" cy="48" rx="57" ry="13.6" fill="#B08544"/><ellipse cx="60" cy="45" rx="57" ry="13.6" fill="#DDB874"/>'
    + '<ellipse cx="60" cy="45" rx="47" ry="10" fill="none" stroke="#B08544" stroke-width="1.4" stroke-dasharray="3 2.6"/>'
    + '<path d="M37 46C36 22 45 6 60 6s24 16 23 40c-6 3-15 4-23 4s-17-1-23-4z" fill="#C9A050"/>'
    + '<path d="M51 11c-4 8-6 18-6 28" stroke="#E2C27E" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/>'
    + '<path d="M37.4 35c7 3 15 4.4 22.6 4.4S75.6 38 82.6 35l.4 8.4c-7 3-15 4.4-23 4.4s-16-1.4-23-4.4z" fill="#006847"/>'
    + '<path d="M40 41l3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3" stroke="#fff" stroke-width="1.3" fill="none" stroke-linejoin="round"/>'
    + '<g fill="#CE1126"><circle cx="43" cy="44" r="1.3"/><circle cx="52" cy="45.4" r="1.3"/><circle cx="60" cy="45.8" r="1.3"/><circle cx="68" cy="45.4" r="1.3"/><circle cx="77" cy="44" r="1.3"/></g>' };
  // la banderita quieta de junto a la campanita
  var REVOLUCION_BANDERITA = { vb: '0 0 30 28', g: '<rect x="2" y="1" width="2.4" height="27" rx="1" fill="#A9B3C4"/>'
    + '<path d="M4.4 3h8.4v15H4.4z" fill="#006847"/><path d="M12.8 3h8.4v15h-8.4z" fill="#fff"/><path d="M21.2 3h8.4v15h-8.4z" fill="#CE1126"/>'
    + '<path d="M12.8 3.4h8.4M12.8 17.6h8.4" stroke="#C9D1DE" stroke-width=".8"/><circle cx="17" cy="10.5" r="2.4" fill="#8C6A3D"/>' };
  // lo que cae al fondo de la entrada: listones tricolor y sombreritos de ala ancha que bajan meciéndose y moñitos tricolor que giran (sin escudo)
  // el verde, un poco más claro que el de la bandera para que se lea chiquito sobre el azul marino
  var REVOLUCION_LLUEVE = { n: 24, z: [15, 27], formas: [
    { modo: 'flota', vb: '0 0 20 20', g: '<g fill="none" stroke-width="2.5"><path d="M1.6 7.5c3-3.4 5.4-3.4 8.4 0s5.4 3.4 8.4 0" stroke="#16A05A"/>'
      + '<path d="M1.6 10c3-3.4 5.4-3.4 8.4 0s5.4 3.4 8.4 0" stroke="#fff"/><path d="M1.6 12.5c3-3.4 5.4-3.4 8.4 0s5.4 3.4 8.4 0" stroke="#E0283A"/></g>' },
    { modo: 'flota', vb: '0 0 24 16', g: '<ellipse cx="12" cy="11.8" rx="11" ry="3.6" fill="#B08544"/><ellipse cx="12" cy="11" rx="11" ry="3.6" fill="#DDB874"/>'
      + '<path d="M7.4 11.2C7.2 6 9 2 12 2s4.8 4 4.6 9.2c-1.4.7-3 .9-4.6.9s-3.2-.2-4.6-.9z" fill="#C9A050"/>'
      + '<path d="M7.4 8.6c1.4.7 3 1 4.6 1s3.2-.3 4.6-1v1.9c-1.4.7-3 1-4.6 1s-3.2-.3-4.6-1z" fill="#16A05A"/><path d="M10 3.6c-.8 1.6-1.2 3.4-1.3 5" stroke="#E2C27E" stroke-width="1" fill="none" stroke-linecap="round"/>' },
    { modo: 'cae', vb: '0 0 20 20', g: '<path d="M8.2 11.6 5 19.2l2.4-.9 1.4 1.6 1.2-7.6zM11.8 11.6l3.2 7.6-2.4-.9-1.4 1.6-1.2-7.6z" fill="#E0283A"/>'
      + '<circle cx="10" cy="8.4" r="6.8" fill="#16A05A"/><circle cx="10" cy="8.4" r="4.7" fill="#fff"/><circle cx="10" cy="8.4" r="2.5" fill="#E0283A"/>' }] };
  alta('revolucion',
    { m: REVOLUCION_M, m2: REVOLUCION_SOMBRERO, c1: REVOLUCION_BANDERITA, c2: REVOLUCION_SOMBRERO, mov: 'saluda', mov2: 'brinca', jmov: 'saluda', lluvia: REVOLUCION_LLUEVE, w: 110, w2: 120,
      dice: ['¡Viva México!', '¡Viva la Revolución!', '¡Ajúa!', '¡Arriba México!'],
      extra: [['pt-picado', PICADO(), 'left:0;right:0;top:0;height:56px']] });
  JUNTO.revolucion = 'banderita';
  CSS_FECHAS += '.pt-revolucion-tela{transform-box:fill-box;transform-origin:0 50%;animation:pt-revolucion-tela 1.8s ease-in-out infinite}'
    + '@keyframes pt-revolucion-tela{0%,100%{transform:skewY(0) scaleX(1)}25%{transform:skewY(4deg) scaleX(.97)}75%{transform:skewY(-4deg) scaleX(.98)}}';

  // Día del Músico (22 de noviembre): la guitarra se mece; las notas flotan y llueven notas
  function MUSICO_GUITARRA() {
    // guitarra parada, centrada en x = 50
    return '<circle cx="50" cy="84" r="23.4" fill="#A8622A"/><circle cx="50" cy="58" r="17.4" fill="#A8622A"/>'
      + '<circle cx="50" cy="84" r="21.6" fill="#E39B4A"/><circle cx="50" cy="58" r="15.6" fill="#E39B4A"/>'
      + '<path d="M36 74c2-8 8-12 14-12" stroke="#F2B872" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>'
      + '<circle cx="50" cy="66" r="7.6" fill="#F2C066"/><circle cx="50" cy="66" r="6" fill="#3A2A20"/>'
      + '<rect x="46.4" y="10" width="7.2" height="52" rx="1.2" fill="#7A4B2A"/>'
      + '<g stroke="#D9C8A0" stroke-width="1"><path d="M46.4 18h7.2M46.4 25h7.2M46.4 32h7.2M46.4 39h7.2M46.4 46h7.2M46.4 53h7.2"/></g>'
      + '<rect x="44" y="0" width="12" height="13" rx="2.4" fill="#5A3520"/><g fill="#C9D1DE"><circle cx="42.6" cy="3.6" r="1.8"/><circle cx="42.6" cy="9" r="1.8"/><circle cx="57.4" cy="3.6" r="1.8"/><circle cx="57.4" cy="9" r="1.8"/></g>'
      + '<rect x="41" y="88" width="18" height="4.4" rx="1.8" fill="#6B3E26"/>'
      + '<g stroke="#FFF6E0" stroke-width=".7" opacity=".9"><path d="M48.3 4v86M49.4 4v86M50.6 4v86M51.7 4v86"/></g>';
  }
  var MUSICO_M = { vb: '10 0 86 108', g: '<g transform="rotate(26 50 56)">' + MUSICO_GUITARRA() + '</g>' };
  function MUSICO_NOTA(x, y, s, c) {
    // corchea suelta: cabeza, plica y banderita
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="' + c + '"><ellipse cx="0" cy="0" rx="6.4" ry="4.6" transform="rotate(-22)"/>'
      + '<rect x="4.2" y="-30" width="2.6" height="29" rx="1"/><path d="M6.8-30c1 6 9 8 8 17-1-5-5-7-8-8z"/></g>';
  }
  var MUSICO_M2 = { vb: '0 0 86 80', g: '<g fill="#F2C066"><ellipse cx="22" cy="64" rx="10" ry="7" transform="rotate(-22 22 64)"/><ellipse cx="62" cy="56" rx="10" ry="7" transform="rotate(-22 62 56)"/>'
    + '<rect x="27.6" y="14" width="4" height="50" rx="1.4"/><rect x="67.6" y="6" width="4" height="50" rx="1.4"/><path d="M27.6 12 71.6 3v10l-44 9z"/></g>'
    + '<g fill="#fff" opacity=".55"><ellipse cx="19" cy="61" rx="3" ry="1.6" transform="rotate(-22 19 61)"/><ellipse cx="59" cy="53" rx="3" ry="1.6" transform="rotate(-22 59 53)"/></g>'
    + MUSICO_NOTA(10, 44, .9, '#F07A1E') + MUSICO_NOTA(76, 74, .55, '#7FB2EA') };
  var MUSICO_J = { vb: '0 0 20 20', g: '<g transform="rotate(38 10 10)"><circle cx="10" cy="14.2" r="4.9" fill="#A8622A"/><circle cx="10" cy="9.8" r="3.8" fill="#A8622A"/>'
    + '<circle cx="10" cy="14.2" r="4.3" fill="#E39B4A"/><circle cx="10" cy="9.8" r="3.2" fill="#E39B4A"/><circle cx="10" cy="11.4" r="1.25" fill="#3A2A20"/>'
    + '<rect x="9.2" y="1.6" width="1.6" height="8.4" rx=".4" fill="#8B5A36"/><rect x="8.5" y="0" width="3" height="2.8" rx=".7" fill="#7A4B2A"/>'
    + '<rect x="8.4" y="15.6" width="3.2" height="1" rx=".4" fill="#6B3E26"/></g>' };
  // lo que cae al fondo de la entrada: notas dibujadas (corchea, dos corcheas unidas y negra) que bajan meciéndose,
  // en vez de las letras ♪ ♫, que cada aparato dibuja distinto
  function MUSICO_CORCHEA(c) {
    return '<g fill="' + c + '"><ellipse cx="7.4" cy="15" rx="3.8" ry="2.7" transform="rotate(-22 7.4 15)"/><rect x="9.6" y="2.6" width="1.7" height="12.4" rx=".6"/>'
      + '<path d="M11.3 2.6c.6 3.4 5 4.4 4.4 9.6-.6-2.8-2.8-4.2-4.4-4.6z"/></g>';
  }
  var MUSICO_LLUEVE = { n: 24, z: [15, 27], formas: [
    { modo: 'flota', vb: '0 0 20 20', g: MUSICO_CORCHEA('#fff') },
    { modo: 'flota', vb: '0 0 20 20', g: '<g fill="#F2C066"><ellipse cx="4.6" cy="16.2" rx="3.3" ry="2.4" transform="rotate(-22 4.6 16.2)"/><ellipse cx="14.4" cy="14.2" rx="3.3" ry="2.4" transform="rotate(-22 14.4 14.2)"/>'
      + '<rect x="6.5" y="4.4" width="1.5" height="11.8" rx=".5"/><rect x="16.3" y="2.4" width="1.5" height="11.8" rx=".5"/><path d="M6.5 3.6 17.8 1.4v2.8L6.5 6.4z"/></g>' },
    { modo: 'flota', vb: '0 0 20 20', g: MUSICO_CORCHEA('#7FB2EA') },
    { modo: 'flota', vb: '0 0 20 20', g: '<g fill="#F07A1E"><ellipse cx="8" cy="15" rx="3.8" ry="2.7" transform="rotate(-22 8 15)"/><rect x="10.2" y="2.4" width="1.7" height="12.6" rx=".6"/></g>' }] };
  alta('musico',
    { m: MUSICO_M, m2: MUSICO_M2, j: MUSICO_J, mov: 'mece', mov2: 'flota', jmov: 'mece', lluvia: MUSICO_LLUEVE, w: 86, w2: 86,
      dice: ['¡Que suene la música!', '¡Una canción!', '¡Do, re, mi!', '¡A cantar!'] });

  // Día del Pastel (26 de noviembre): las velitas titilan; la rebanada brinca
  function PASTEL_GOTAS(x0, x1, y, n, dw, largos, c) {
    var s = '', i, paso = (x1 - x0) / n;
    for (i = 0; i < n; i++) s += '<rect x="' + (x0 + paso * i + (paso - dw) / 2).toFixed(1) + '" y="' + (y - 2) + '" width="' + dw + '" height="' + largos[i % largos.length] + '" rx="' + (dw / 2) + '" fill="' + c + '"/>';
    return s;
  }
  function PASTEL_VELA(x, c, retraso) {
    return '<circle class="pt-pastel-halo" style="animation-delay:' + retraso + 's" cx="' + x + '" cy="8.4" r="5.4" fill="#FFC857" opacity=".22"/>'
      + '<rect x="' + (x - 2.6) + '" y="15" width="5.2" height="19" rx="1.2" fill="' + c + '"/>'
      + '<path d="M' + (x - 2.6) + ' 21l5.2-3M' + (x - 2.6) + ' 27l5.2-3M' + (x - 2.6) + ' 33l5.2-3" stroke="#fff" stroke-width="1.6"/>'
      + '<rect x="' + (x - .5) + '" y="12" width="1" height="3.4" fill="#3A2A20"/>'
      + '<g class="pt-pastel-flama" style="animation-delay:' + retraso + 's"><path d="M' + x + ' .6C' + (x - 3) + ' 5 ' + (x - 4) + ' 7 ' + (x - 4) + ' 9a4 4 0 0 0 8 0c0-2-1-4-4-8.4z" fill="#F7A21B"/>'
      + '<path d="M' + x + ' 5C' + (x - 1.6) + ' 7.4 ' + (x - 2) + ' 8.4 ' + (x - 2) + ' 9.4a2 2 0 0 0 4 0c0-1-.4-2-2-4.4z" fill="#FFE27A"/></g>';
  }
  var PASTEL_M = { vb: '0 0 100 112', g: '<ellipse cx="50" cy="104" rx="47" ry="7" fill="#E8EDF5"/><ellipse cx="50" cy="103" rx="36" ry="4.2" fill="#D3DBE7"/>'
    + '<rect x="12" y="62" width="76" height="42" rx="6" fill="#F7B6CE"/><rect x="12" y="95" width="76" height="9" rx="4" fill="#EE9FBD"/>'
    + '<g><circle cx="22" cy="86" r="2" fill="#fff"/><circle cx="34" cy="88" r="2" fill="#F07A1E"/><circle cx="46" cy="86" r="2" fill="#7FB2EA"/><circle cx="58" cy="88" r="2" fill="#fff"/><circle cx="70" cy="86" r="2" fill="#F07A1E"/><circle cx="80" cy="88" r="2" fill="#7FB2EA"/></g>'
    + '<rect x="11" y="59" width="78" height="9" rx="4.5" fill="#fff"/>' + PASTEL_GOTAS(12, 88, 67, 10, 5, [8, 13, 6, 11, 9, 14, 7, 12, 8, 10], '#fff')
    + '<rect x="27" y="35" width="46" height="28" rx="5" fill="#FFF1D6"/>'
    + '<g fill="#F28DB2"><circle cx="35" cy="56" r="1.8"/><circle cx="45" cy="57" r="1.8"/><circle cx="55" cy="57" r="1.8"/><circle cx="65" cy="56" r="1.8"/></g>'
    + '<rect x="26" y="32" width="48" height="8" rx="4" fill="#F28DB2"/>' + PASTEL_GOTAS(27, 73, 39, 6, 4.6, [6, 10, 5, 9, 7, 8], '#F28DB2')
    + '<path d="M19 56c0-4 2-6 4-7M81 56c0-4-2-6-4-7" stroke="#3E7A2E" stroke-width="1.4" fill="none" stroke-linecap="round"/>'
    + '<circle cx="19" cy="58" r="4.4" fill="#D7263D"/><circle cx="81" cy="58" r="4.4" fill="#D7263D"/><circle cx="17.6" cy="56.6" r="1.3" fill="#fff" opacity=".6"/><circle cx="79.6" cy="56.6" r="1.3" fill="#fff" opacity=".6"/>'
    + PASTEL_VELA(38, '#7FB2EA', '-.2') + PASTEL_VELA(50, '#F07A1E', '-.5') + PASTEL_VELA(62, '#5BD69A', '-.35') };
  // la rebanada: cara del corte con sus capas, el betún arriba y una fresa
  var PASTEL_M2 = { vb: '0 0 96 78', g: (function () {
    var h = '<ellipse cx="48" cy="64" rx="45" ry="10" fill="#E8EDF5"/><ellipse cx="48" cy="63" rx="33" ry="5.6" fill="#D3DBE7"/>', capas = [[0, .14, '#F28DB2'], [.14, .42, '#F6D7A0'], [.42, .52, '#FFF7E8'], [.52, .59, '#E8418C'], [.59, .88, '#F6D7A0'], [.88, 1, '#E3B26E']], i;
    function y(t, lado) { return lado ? 28 + 30 * t : 40 + 24 * t; }
    for (i = 0; i < capas.length; i++) {
      var a = capas[i][0], b = capas[i][1];
      h += '<path d="M8 ' + y(a, 0).toFixed(1) + 'L88 ' + y(a, 1).toFixed(1) + 'V' + y(b, 1).toFixed(1) + 'L8 ' + y(b, 0).toFixed(1) + 'Z" fill="' + capas[i][2] + '"/>';
    }
    h += '<g fill="#E9C285"><circle cx="30" cy="45" r=".9"/><circle cx="52" cy="44" r=".9"/><circle cx="70" cy="42" r=".9"/><circle cx="40" cy="57" r=".9"/><circle cx="62" cy="57" r=".9"/><circle cx="78" cy="56" r=".9"/></g>';
    h += '<path d="M8 40 64 12 88 28z" fill="#F7A8C4" stroke="#F28DB2" stroke-width="1" stroke-linejoin="round"/><path d="M30 31c8-4 16-8 26-13" stroke="#FFD3E3" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    h += '<ellipse cx="68" cy="24" rx="8" ry="3.4" fill="#fff"/>';
    h += '<path d="M68 26c-7-3-9-9-7-13 2-3 5-3 7-1 2-2 5-2 7 1 2 4 0 10-7 13z" fill="#E03A2E"/><path d="M63.6 12.4l4.4 2.4 4.4-2.4-1.6 3.2h-5.6z" fill="#4E9A3A"/>';
    return h + '<g fill="#FFE066"><circle cx="65" cy="18" r=".7"/><circle cx="70" cy="17.6" r=".7"/><circle cx="67.6" cy="21.4" r=".7"/><circle cx="72" cy="21" r=".7"/><circle cx="64.6" cy="21.6" r=".7"/></g>';
  })() };
  var PASTEL_J = { vb: '0 0 20 20', g: '<ellipse cx="10" cy="18.8" rx="9" ry="1.1" fill="#AEB8CA"/>'
    + '<rect x="2.8" y="10.4" width="14.4" height="8" rx="1.4" fill="#F28DB2"/>'
    + '<path d="M2.8 12.2v-.6c0-.8.6-1.4 1.4-1.4h11.6c.8 0 1.4.6 1.4 1.4v.6c-.8 0-.8 1.8-1.6 1.8s-.8-1.2-1.6-1.2-.8 2-1.6 2-.8-1.6-1.6-1.6-.8 1.4-1.6 1.4-.8-1.8-1.6-1.8-.8 1.2-1.6 1.2-.8-1.6-1.6-1.6z" fill="#fff" stroke="#C9D1DE" stroke-width=".5"/>'
    + '<rect x="9.1" y="5.2" width="1.8" height="5.2" rx=".4" fill="#7FB2EA"/><path d="M9.1 7.4l1.8-1M9.1 9.4l1.8-1" stroke="#fff" stroke-width=".6"/>'
    + '<g class="pt-pastel-flama"><path d="M10 .5C8.7 2.4 8.3 3.2 8.3 4a1.7 1.7 0 0 0 3.4 0c0-.8-.4-1.6-1.7-3.5z" fill="#F7A21B"/><path d="M10 2.4c-.5.8-.7 1.2-.7 1.6a.7.7 0 0 0 1.4 0c0-.4-.2-.8-.7-1.6z" fill="#FFE27A"/></g>'
    + '<g fill="#D7263D"><circle cx="5.4" cy="15.6" r=".8"/><circle cx="14.6" cy="15.6" r=".8"/></g>' };
  // lo que cae al fondo de la entrada: chispitas (las mismas de la dona), velitas encendidas y fresitas
  function PASTEL_VELITA(c) {
    return '<rect x="7.8" y="8" width="4.4" height="11.2" rx="1" fill="' + c + '"/>'
      + '<path d="M7.8 11.6l4.4-2.2M7.8 14.8l4.4-2.2M7.8 18l4.4-2.2" stroke="#fff" stroke-width="1.3"/>'
      + '<rect x="9.55" y="5.6" width=".9" height="2.6" fill="#E8DCC4"/>'
      + '<path d="M10 .6C8.4 2.8 7.8 4 7.8 5a2.2 2.2 0 0 0 4.4 0c0-1-.6-2.2-2.2-4.4z" fill="#F7A21B"/><path d="M10 2.8c-.7 1-1 1.6-1 2.2a1 1 0 0 0 2 0c0-.6-.3-1.2-1-2.2z" fill="#FFE27A"/>';
  }
  var PASTEL_LLUEVE = { n: 24, z: [14, 26], formas: [
    DONA_CHISPITAS[0],
    { modo: 'cae', vb: '0 0 20 20', g: PASTEL_VELITA('#7FB2EA') },
    // la fresita: hombros redondos y punta abajo (que no parezca corazón), su coronita y semillas
    { modo: 'cae', vb: '0 0 20 20', g: '<path d="M10 19C6.2 17.4 3.2 13 3.4 8.8 3.6 6.2 6.2 5 10 5s6.4 1.2 6.6 3.8c.2 4.2-2.8 8.6-6.6 10.2z" fill="#E03A2E"/>'
      + '<g fill="#FFE066"><circle cx="7" cy="9.6" r=".75"/><circle cx="10.4" cy="9" r=".75"/><circle cx="13.6" cy="9.8" r=".75"/><circle cx="8.6" cy="12.8" r=".75"/>'
      + '<circle cx="12" cy="12.8" r=".75"/><circle cx="10.2" cy="15.8" r=".75"/><circle cx="6" cy="12.4" r=".65"/><circle cx="14.2" cy="12.6" r=".65"/></g>'
      + '<path d="M4.8 6.2c1.6-.6 2.8-.2 3.6.6-.2-1.6.4-2.8 1.6-3.6 1.2.8 1.8 2 1.6 3.6.8-.8 2-1.2 3.6-.6-.8 1.6-2.4 2.6-5.2 2.6s-4.4-1-5.2-2.6z" fill="#5BAE3E"/>'
      + '<path d="M10 3.4V1.2" stroke="#5BAE3E" stroke-width="1.3" stroke-linecap="round"/>' },
    { modo: 'cae', vb: '0 0 20 20', g: PASTEL_VELITA('#F28DB2') }] };
  alta('pastel',
    { m: PASTEL_M, m2: PASTEL_M2, j: PASTEL_J, mov: 'brinca', mov2: 'mece', jmov: 'brinca', lluvia: PASTEL_LLUEVE, w: 96, w2: 96,
      dice: ['¡Pide un deseo!', '¡A soplar!', '¡Una rebanada!', '¡Con fresa encima!'] });
  CSS_FECHAS += '.pt-pastel-flama{transform-box:fill-box;transform-origin:50% 100%;animation:pt-pastel-flama .7s ease-in-out infinite alternate}'
    + '@keyframes pt-pastel-flama{0%{transform:scale(1,1) rotate(-5deg)}50%{transform:scale(.88,1.1) rotate(2deg)}100%{transform:scale(1.05,.92) rotate(5deg)}}'
    + '.pt-pastel-halo{transform-box:fill-box;transform-origin:50% 50%;animation:pt-pastel-halo 1.4s ease-in-out infinite alternate}'
    + '@keyframes pt-pastel-halo{from{opacity:.12;transform:scale(.85)}to{opacity:.36;transform:scale(1.1)}}';

  // Día de los Inocentes (28 de diciembre): la palomita vuela aleteando; de la cajita sale un muñequito con resorte
  var INOCENTES_M = { vb: '0 0 100 80', g: '<path d="M24 42 3 32l5 11-6 9 22-2z" fill="#DCE5F2" stroke="#C9D1DE" stroke-width="1.4" stroke-linejoin="round"/>'
    + '<ellipse cx="46" cy="46" rx="29.4" ry="23.4" fill="#C9D1DE"/><circle cx="68" cy="31" r="16.4" fill="#C9D1DE"/>'
    + '<ellipse cx="46" cy="46" rx="28" ry="22" fill="#fff"/><circle cx="68" cy="31" r="15" fill="#fff"/><ellipse cx="50" cy="55" rx="18" ry="10" fill="#F1F5FB"/>'
    + '<path d="M44 68l-2 6M52 68l1 6" stroke="#F07A1E" stroke-width="2.4" stroke-linecap="round"/>'
    + '<path d="M80 27l11 4-11 5z" fill="#F07A1E" stroke="#E0660A" stroke-width="1" stroke-linejoin="round"/>'
    + '<circle cx="72" cy="27" r="3.2" fill="#1A2333"/><circle cx="73.1" cy="25.9" r="1.1" fill="#fff"/><circle cx="70" cy="36" r="3.2" fill="#F7A8C4" opacity=".85"/>'
    + '<g class="pt-inocentes-ala"><path d="M52 42C46 28 30 22 16 26c6 4 8 8 8 12-4 0-6 2-6 4 6 2 10 2 12 4-2 2-2 4 0 6 10 2 20-2 22-10z" fill="#CFE0F5" stroke="#9FB6D6" stroke-width="1.3" stroke-linejoin="round"/>'
    + '<path d="M46 40c-6-4-14-6-22-4M44 46c-5-2-10-2-16 0" stroke="#9FB6D6" stroke-width="1.1" fill="none" stroke-linecap="round"/></g>' };
  function INOCENTES_PREGUNTA(x, y, s, c) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-4-4.6a4.4 4.4 0 1 1 6 4.1c-1.5.8-2 1.6-2 3.2" stroke="' + c + '" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="0" cy="7" r="1.8" fill="' + c + '"/></g>';
  }
  var INOCENTES_M2 = { vb: '0 0 92 100', g: '<g transform="rotate(-68 72 60)"><g class="pt-inocentes-tapa"><rect x="72" y="55" width="30" height="7" rx="2.4" fill="#FF9A3D"/><rect x="72" y="55" width="30" height="2.4" rx="1.2" fill="#FFB774"/></g></g>'
    + '<g class="pt-inocentes-resorte"><path d="M45 62l-8-3 16-5-16-5 16-5-16-5 8-3" stroke="#C9D1DE" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>'
    + '<g class="pt-inocentes-cara"><path d="M36.6 22 45 5l8.4 17z" fill="#7FB2EA"/><path d="M39 17h12M41.4 12h7.2" stroke="#fff" stroke-width="2"/><circle cx="45" cy="5" r="3" fill="#F07A1E"/>'
    + '<circle cx="45" cy="33" r="14" fill="#FFE066"/><circle cx="40" cy="30" r="4.4" fill="#fff"/><circle cx="50.4" cy="30" r="4.4" fill="#fff"/>'
    + '<circle cx="41.4" cy="31" r="2.2" fill="#1A2333"/><circle cx="51.8" cy="29" r="2.2" fill="#1A2333"/><circle cx="45" cy="36.6" r="3" fill="#E03A2E"/>'
    + '<path d="M38 40q7 6 14 0" stroke="#1A2333" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="34.6" cy="37" r="2.2" fill="#F7A8C4" opacity=".8"/><circle cx="55.4" cy="37" r="2.2" fill="#F7A8C4" opacity=".8"/></g>'
    + '<rect x="18" y="60" width="54" height="38" rx="3" fill="#F07A1E"/><rect x="16" y="57" width="58" height="7" rx="2.4" fill="#FF9A3D"/>'
    + '<rect x="18" y="64" width="54" height="3" fill="#D9661A" opacity=".6"/>'
    + INOCENTES_PREGUNTA(31, 80, 1.1, '#1F3864') + INOCENTES_PREGUNTA(59, 80, 1.1, '#1F3864')
    + '<path d="M45 72l1.8 3.8 4.2.5-3.1 2.9.8 4.1-3.7-2-3.7 2 .8-4.1-3.1-2.9 4.2-.5z" fill="#FFE066"/>' };
  var INOCENTES_J = { vb: '0 0 20 17', g: '<path d="M4.4 9.6.6 7.6l1 2.6-1.2 2z" fill="#DCE5F2" stroke="#C9D1DE" stroke-width=".7" stroke-linejoin="round"/>'
    + '<ellipse cx="9" cy="10.6" rx="6.6" ry="5.2" fill="#C9D1DE"/><circle cx="13.6" cy="7" r="3.9" fill="#C9D1DE"/>'
    + '<ellipse cx="9" cy="10.6" rx="5.9" ry="4.5" fill="#fff"/><circle cx="13.6" cy="7" r="3.2" fill="#fff"/>'
    + '<path d="M16.6 5.9l2.8.9-2.8 1.2z" fill="#F07A1E"/><circle cx="14.4" cy="6.1" r=".85" fill="#2B3445"/><circle cx="13.9" cy="8.5" r=".8" fill="#F7A8C4"/>'
    + '<g class="pt-inocentes-ala"><path d="M10.4 9C9 6 5.8 4.6 3 5.6c1.2.8 1.6 1.6 1.6 2.4-.8 0-1.2.4-1.2.8 1.2.4 2 .4 2.4.8-.4.4-.4.8 0 1.2 2 .4 4-.4 4.6-1.8z" fill="#9DC3EE" stroke="#6F93C0" stroke-width=".5" stroke-linejoin="round"/></g>' };
  // lo que cae al fondo de la entrada: plumitas blancas de la palomita y signos de interrogación que bajan meciéndose (girando no se leen)
  var INOCENTES_LLUEVE = { n: 24, z: [14, 26], formas: [
    { modo: 'flota', vb: '0 0 20 20', g: '<path d="M4.4 16.6C4.6 10 9.4 4.2 17.4 2.2 16.6 9.6 11.6 14.8 4.4 16.6z" fill="#fff"/>'
      + '<path d="M8.2 12.4 6 10.6M10.8 9.4 9 7.4M13.4 6.6l-1.2-2M9.6 12.6l2.6.4M12 9.8l2.8.2" stroke="#DCE5F2" stroke-width=".8" stroke-linecap="round"/>'
      + '<path d="M2.6 18.4C7 12.4 11 8 15.6 4" stroke="#AEB8CA" stroke-width="1" fill="none" stroke-linecap="round"/>' },
    { modo: 'flota', vb: '0 0 20 20', g: INOCENTES_PREGUNTA(10, 10.6, 1, '#FFE066') },
    { modo: 'flota', vb: '0 0 20 20', g: '<path d="M10 1.6c3.6 3 4.4 8.4 2 13.6-3.2-.4-5.4-3-5.2-7 .2-3 1.4-5 3.2-6.6z" fill="#EEF3FA"/>'
      + '<path d="M8.6 6.6 7 5.6M8.4 10 6.8 9.4M11.6 7.6l1.6-.8M11.8 11l1.4-.4" stroke="#C9D1DE" stroke-width=".8" stroke-linecap="round"/>'
      + '<path d="M10 3.4c1 4 1 8.6-.6 15" stroke="#AEB8CA" stroke-width="1" fill="none" stroke-linecap="round"/>' },
    { modo: 'flota', vb: '0 0 20 20', g: INOCENTES_PREGUNTA(10, 10.6, 1, '#F07A1E') }] };
  alta('inocentes',
    { m: INOCENTES_M, m2: INOCENTES_M2, j: INOCENTES_J, mov: 'vuela', mov2: 'mece', jmov: 'vuela', lluvia: INOCENTES_LLUEVE, w: 100, w2: 88,
      dice: ['¡Inocente palomita!', '¡Caíste!', '¡Sorpresa!', '¡Era broma!'] });
  CSS_FECHAS += '.pt-inocentes-ala{transform-box:fill-box;transform-origin:92% 60%;animation:pt-inocentes-ala .5s ease-in-out infinite alternate}'
    + '@keyframes pt-inocentes-ala{from{transform:rotate(14deg)}to{transform:rotate(-26deg)}}'
    + '.pt-inocentes-resorte{transform-box:fill-box;transform-origin:50% 100%;animation:pt-inocentes-resorte 1.4s ease-in-out infinite}'
    + '@keyframes pt-inocentes-resorte{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.62)}}'
    + '.pt-inocentes-cara{transform-box:fill-box;animation:pt-inocentes-cara 1.4s ease-in-out infinite}'
    + '@keyframes pt-inocentes-cara{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(22%) rotate(-6deg)}}'
    + '.pt-inocentes-tapa{transform-box:fill-box;transform-origin:0 70%;animation:pt-inocentes-tapa 1.4s ease-in-out infinite}'
    + '@keyframes pt-inocentes-tapa{0%,100%{transform:rotate(0)}50%{transform:rotate(-14deg)}}';
  return CSS_FECHAS;
});
