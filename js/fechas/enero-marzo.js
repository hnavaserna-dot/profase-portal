/* Portal PROFASE · dibujos de las fechas «chispa» de enero a marzo (Daniel, 31-oct-2026: «sí a todas»; en la entrada y
   adentro). js/temporada.js baja este archivo solo los días de una de sus fechas, para que el portal siga ligero; las
   fechas, su felicitación y su día viven allá, en TEMPORADAS. Dibujos propios: ninguno es el signo PROFASE, ni marcas,
   ni personajes. Agregar o quitar fechas solo lo decide Daniel (CLAUDE.md). */
(window.PROFASE_TEMPORADA_FECHAS = window.PROFASE_TEMPORADA_FECHAS || []).push(function (T) {
  'use strict';
  var alta = T.alta, svg = T.svg, PICADO = T.PICADO, COHETE = T.COHETE, BANDERITA = T.BANDERITA, JUNTO = T.JUNTO, CSS_FECHAS = '';
  /* ---- Parte A: enero a marzo (Año Nuevo a Día del Taco) ---- */
  // destello de cuatro picos (lo usan varias fechas de esta parte)
  function ANIO_DESTELLO(x, y, r, c) {
    return '<path d="M' + x + ' ' + (y - r) + 'Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y + r)
      + 'Q' + x + ' ' + y + ' ' + (x - r) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y - r) + 'z" fill="' + c + '"/>';
  }

  // Año Nuevo (1 de enero): el reloj a las 12 con sus campanas, las 12 uvas y fuegos artificiales
  function ANIO_RELOJ() {
    var h = '', i, a, r1, w;
    for (i = 0; i < 12; i++) {
      a = i * Math.PI / 6; r1 = i % 3 ? 23.5 : 21; w = i % 3 ? 1.8 : 3;
      h += '<path d="M' + (50 + Math.sin(a) * r1).toFixed(1) + ' ' + (56 - Math.cos(a) * r1).toFixed(1) + 'L' + (50 + Math.sin(a) * 26.5).toFixed(1) + ' '
        + (56 - Math.cos(a) * 26.5).toFixed(1) + '" stroke="' + (i ? '#1F3864' : '#F07A1E') + '" stroke-width="' + w + '" stroke-linecap="round"/>';
    }
    return '<path d="M30 88 21 100M70 88l9 12" stroke="#C9A75A" stroke-width="6" stroke-linecap="round"/>'
      + '<g class="pt-anio-timbre"><path d="M50 18V9" stroke="#C9A75A" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="7" r="4.4" fill="#F2C066"/>'
      + '<path d="M11 33A15 15 0 0 1 33 12z" fill="#F2C066"/><path d="M67 12A15 15 0 0 1 89 33z" fill="#F2C066"/>'
      + '<path d="M14 30 30 14M70 14l16 16" stroke="#C9A75A" stroke-width="3.4" stroke-linecap="round"/></g>'
      + '<circle cx="50" cy="56" r="36" fill="#F07A1E"/><path d="M23 42a30 30 0 0 1 15-16" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/>'
      + '<circle cx="50" cy="56" r="29" fill="#FFF8EC"/>' + h
      + '<path d="M50 56V41" stroke="#1F3864" stroke-width="5" stroke-linecap="round"/><path d="M50 56V33.5" stroke="#1F3864" stroke-width="3" stroke-linecap="round"/>'
      + '<g class="pt-anio-seg"><rect x="49.3" y="35" width="1.4" height="21" rx=".7" fill="#E03A3A"/></g><circle cx="50" cy="56" r="3.2" fill="#E03A3A"/>';
  }
  var ANIO_M = { vb: '0 0 100 102', g: ANIO_RELOJ() };
  var ANIO_M2 = { vb: '0 0 80 96', g: (function () {
    var h = '<path d="M40 24C40 15 44 9 50 5" stroke="#7A4B2A" stroke-width="3.6" fill="none" stroke-linecap="round"/>'
      + '<path d="M43 16c6-10 20-12 29-6-7 9-19 12-29 6z" fill="#4E9A3A"/><path d="M45 15c8-3 15-4 22-4" stroke="#2F6B24" stroke-width="1.2" fill="none"/>';
    // las 12 uvas: 3, 4, 3 y 2
    var u = [[26, 30], [40, 28], [54, 30], [19, 42], [33, 41], [47, 41], [61, 42], [26, 54], [40, 53], [54, 54], [33, 66], [47, 66]], i;
    for (i = 0; i < u.length; i++) {
      h += '<circle cx="' + u[i][0] + '" cy="' + u[i][1] + '" r="8.2" fill="#8CCB4A" stroke="#5E9E2E" stroke-width="1.4"/>'
        + '<circle cx="' + (u[i][0] - 2.6) + '" cy="' + (u[i][1] - 2.8) + '" r="2" fill="#fff" opacity=".55"/>';
    }
    return h + '<g class="pt-anio-dest">' + ANIO_DESTELLO(66, 70, 6, '#FFE27A') + '</g>';
  })() };
  // junto al signo: un cohete que estalla
  var ANIO_J = { vb: '0 0 20 20', g: (function () {
    var h = '', c = ['#F07A1E', '#E0A100', '#2E86DE', '#E8418C'], i, a;
    for (i = 0; i < 8; i++) {
      a = i * Math.PI / 4;
      h += '<path d="M' + (10 + Math.cos(a) * 3.6).toFixed(2) + ' ' + (10 + Math.sin(a) * 3.6).toFixed(2) + 'L' + (10 + Math.cos(a) * 8.4).toFixed(2) + ' '
        + (10 + Math.sin(a) * 8.4).toFixed(2) + '" stroke="' + c[i % 4] + '" stroke-width="2.5" stroke-linecap="round"/>';
      a += Math.PI / 8;
      h += '<circle cx="' + (10 + Math.cos(a) * 7).toFixed(2) + '" cy="' + (10 + Math.sin(a) * 7).toFixed(2) + '" r=".9" fill="' + c[(i + 2) % 4] + '"/>';
    }
    return '<g class="pt-anio-chispa">' + h + '</g><circle cx="10" cy="10" r="2.2" fill="#E0A100"/>';
  })() };
  // una serpentina enroscada (rizos a lo largo de una diagonal)
  function ANIO_SERPENTINA(c) {
    var h = '', i, s, t;
    for (i = 0; i <= 72; i++) {
      s = i / 72; t = s * 6 * Math.PI - Math.PI / 4;
      h += (i ? 'L' : 'M') + (3.4 + 13.2 * s + Math.cos(t) * 2.7).toFixed(2) + ' ' + (3.4 + 13.2 * s + Math.sin(t) * 2.7).toFixed(2);
    }
    return '<path d="' + h + '" stroke="' + c + '" stroke-width="1.9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  // lo que cae al fondo de la entrada: confeti de colores, racimitos de uvas y serpentinas
  var ANIO_LLUEVE = { n: 28, z: [12, 24], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: '<rect x="2.4" y="2.6" width="3.6" height="6.6" rx="1" fill="#F07A1E" transform="rotate(-22 4.2 5.9)"/>'
      + '<rect x="12.6" y="1.8" width="3.6" height="6.6" rx="1" fill="#F2C066" transform="rotate(34 14.4 5.1)"/>'
      + '<rect x="3.6" y="12.4" width="3.6" height="6.6" rx="1" fill="#7FB2EA" transform="rotate(16 5.4 15.7)"/>'
      + '<rect x="12.4" y="11.6" width="3.6" height="6.6" rx="1" fill="#E8418C" transform="rotate(-40 14.2 14.9)"/>' },
    { modo: 'cae', vb: '0 0 20 22', g: (function () {
      var h = '<path d="M10 7V2" stroke="#9C6A3E" stroke-width="1.5" stroke-linecap="round"/><path d="M10 3.6c2.2-2.6 6.2-2.8 8.4-.8-2.6 2.4-5.8 2.8-8.4.8z" fill="#4E9A3A"/>', i;
      var u = [[6.2, 9], [10, 8.4], [13.8, 9], [8.1, 12.6], [11.9, 12.6], [10, 16.2]];
      for (i = 0; i < u.length; i++) {
        h += '<circle cx="' + u[i][0] + '" cy="' + u[i][1] + '" r="2.7" fill="#8CCB4A" stroke="#5E9E2E" stroke-width=".7"/>'
          + '<circle cx="' + (u[i][0] - .9).toFixed(1) + '" cy="' + (u[i][1] - .9).toFixed(1) + '" r=".75" fill="#fff" opacity=".6"/>';
      }
      return h;
    })() },
    { modo: 'flota', vb: '0 0 20 20', g: ANIO_SERPENTINA('#E8418C') },
    { modo: 'flota', vb: '0 0 20 20', g: ANIO_SERPENTINA('#F2C066') }] };
  alta('anio',
    { m: ANIO_M, m2: ANIO_M2, j: ANIO_J, mov: 'brinca', mov2: 'mece', jmov: 'late', lluvia: ANIO_LLUEVE, w2: 84,
      dice: ['¡Ya son las 12!', '¡Tic, tac!', '¡Mis 12 uvas!', '¡Pide tus deseos!'],
      extra: [['pt-cuete', COHETE('#F2C066'), 'left:10%;top:12%;width:66px'], ['pt-cuete pt-tarde', COHETE('#E8418C'), 'right:12%;top:16%;width:56px']] });
  CSS_FECHAS += '.pt-anio-timbre{transform-box:fill-box;transform-origin:50% 100%;animation:pt-anio-timbre 1.8s ease-in-out infinite}'
    + '@keyframes pt-anio-timbre{0%,45%,100%{transform:rotate(0)}5%,15%,25%,35%{transform:rotate(-7deg)}10%,20%,30%,40%{transform:rotate(7deg)}}'
    + '.pt-anio-seg{transform-box:fill-box;transform-origin:50% 100%;animation:pt-anio-seg 6s steps(60) infinite}@keyframes pt-anio-seg{to{transform:rotate(360deg)}}'
    + '.pt-anio-dest{transform-box:fill-box;transform-origin:50% 50%;animation:pt-anio-dest 1.4s ease-in-out infinite}'
    + '@keyframes pt-anio-dest{0%,100%{opacity:.2;transform:scale(.5)}50%{opacity:1;transform:scale(1.1)}}'
    + '.pt-anio-chispa{transform-box:fill-box;transform-origin:50% 50%;animation:pt-anio-chispa 1.6s ease-out infinite}'
    + '@keyframes pt-anio-chispa{0%{transform:scale(.6);opacity:.6}30%{transform:scale(1);opacity:1}100%{transform:scale(1.04);opacity:.85}}';

  // Día de Reyes (6 de enero): la rosca con sus frutas cristalizadas y la corona dorada
  function REYES_ELI(cx, cy, rx, ry) {
    return 'M' + (cx - rx) + ' ' + cy + 'a' + rx + ' ' + ry + ' 0 1 0 ' + (2 * rx) + ' 0a' + rx + ' ' + ry + ' 0 1 0 ' + (-2 * rx) + ' 0z';
  }
  function REYES_ROSCA() {
    var h = '<ellipse cx="60" cy="65" rx="54" ry="6.5" fill="#0A1222" opacity=".25"/>'
      + '<path fill-rule="evenodd" d="' + REYES_ELI(60, 43, 57, 21) + REYES_ELI(60, 40, 30, 8) + '" fill="#B9661F"/>'
      + '<path fill-rule="evenodd" d="' + REYES_ELI(60, 37, 57, 21) + REYES_ELI(60, 36, 30, 8) + '" fill="#E39A4A"/>'
      + '<path d="M10 31c10-10 28-14 50-14" stroke="#F6C67A" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>';
    var i, k, t, c, s, x, y, ang, n = 10, fr = ['#C8102E', '#3E9A3A', '#F07A1E', '#C8102E', '#F2C066'], pos = [];
    for (i = 0; i < n; i++) pos.push(i);
    // primero lo de atrás (arriba) y luego lo de enfrente
    pos.sort(function (a, b) { return Math.sin((a * 36 + 198) * Math.PI / 180) - Math.sin((b * 36 + 198) * Math.PI / 180); });
    for (k = 0; k < n; k++) {
      i = pos[k]; t = (i * 36 + 198) * Math.PI / 180; c = Math.cos(t); s = Math.sin(t);
      // tira de pasta de azúcar, de la orilla de adentro a la de afuera
      h += '<path d="M' + (60 + 35 * c).toFixed(1) + ' ' + (36.5 + 11 * s).toFixed(1) + 'L' + (60 + 51 * c).toFixed(1) + ' ' + (36.5 + 18 * s).toFixed(1)
        + '" stroke="#C99A55" stroke-width="8.4" stroke-linecap="round"/><path d="M' + (60 + 35 * c).toFixed(1) + ' ' + (36.5 + 11 * s).toFixed(1) + 'L'
        + (60 + 51 * c).toFixed(1) + ' ' + (36.5 + 18 * s).toFixed(1) + '" stroke="#F8E6BA" stroke-width="6.6" stroke-linecap="round"/>';
      // fruta cristalizada entre tira y tira
      t += 18 * Math.PI / 180; c = Math.cos(t); s = Math.sin(t);
      x = 60 + 43 * c; y = 36.5 + 14.5 * s; ang = Math.atan2(14.5 * c, -43 * s) * 180 / Math.PI;
      h += i % 2 ? '<rect x="-6.4" y="-2.8" width="12.8" height="5.6" rx="2" fill="' + fr[i % 5] + '" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + ang.toFixed(0) + ')"/>'
        : '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4" fill="' + fr[i % 5] + '"/><circle cx="' + (x - 1.2).toFixed(1) + '" cy="' + (y - 1.3).toFixed(1) + '" r="1.1" fill="#fff" opacity=".6"/>';
    }
    return h;
  }
  var REYES_M = { vb: '0 0 120 74', g: REYES_ROSCA() };
  var REYES_M2 = { vb: '0 0 100 84', g: '<path d="M16 64 10 22l22 20 18-30 18 30 22-20-6 42z" fill="#F2C066"/>'
    + '<path d="M50 12l18 30 22-20-6 42H50z" fill="#E0A100" opacity=".35"/>'
    + '<rect x="12" y="60" width="76" height="15" rx="4" fill="#E0A100"/><path d="M16 64h68" stroke="#F7D88A" stroke-width="2" stroke-linecap="round"/>'
    + '<circle cx="10" cy="22" r="5.5" fill="#F2C066"/><circle cx="50" cy="11" r="6" fill="#F2C066"/><circle cx="90" cy="22" r="5.5" fill="#F2C066"/>'
    + '<path d="M50 32l8 10-8 10-8-10z" fill="#C8102E"/><path d="M50 32l8 10h-16z" fill="#E8414E"/>'
    + '<circle cx="50" cy="67.5" r="4.6" fill="#C8102E"/><path d="M30 63l4.5 4.5-4.5 4.5-4.5-4.5z" fill="#2E86DE"/><path d="M70 63l4.5 4.5-4.5 4.5-4.5-4.5z" fill="#3E9A3A"/>'
    + '<g class="pt-reyes-brillo">' + ANIO_DESTELLO(82, 8, 7, '#FFF3C4') + '</g><g class="pt-reyes-brillo pt-reyes-b2">' + ANIO_DESTELLO(20, 6, 4.5, '#FFF3C4') + '</g>' };
  var REYES_J = { vb: '0 0 20 18', g: '<path d="M3.6 14.6 2.4 6l4.4 3.8L10 4l3.2 5.8L17.6 6l-1.2 8.6z" fill="#F2B630" stroke="#B9800F" stroke-width=".6" stroke-linejoin="round"/>'
    + '<rect x="3.2" y="13.2" width="13.6" height="3.6" rx="1" fill="#E0A100" stroke="#B9800F" stroke-width=".6"/>'
    + '<circle cx="2.4" cy="6" r="1.2" fill="#F2B630" stroke="#B9800F" stroke-width=".5"/><circle cx="10" cy="4" r="1.3" fill="#F2B630" stroke="#B9800F" stroke-width=".5"/>'
    + '<circle cx="17.6" cy="6" r="1.2" fill="#F2B630" stroke="#B9800F" stroke-width=".5"/><circle cx="10" cy="15" r="1.1" fill="#C8102E"/>'
    + '<path d="M10 8.4l1.5 2-1.5 2-1.5-2z" fill="#C8102E"/>'
    + '<g class="pt-reyes-brillo">' + ANIO_DESTELLO(16.6, 1.8, 1.9, '#F07A1E') + '</g>' };
  // estrella de cinco picos con centro en (cx, cy)
  function REYES_ESTRELLA(cx, cy, r1, r2) {
    var h = '', i, a, r;
    for (i = 0; i < 10; i++) {
      a = (i * 36 - 90) * Math.PI / 180; r = i % 2 ? r2 : r1;
      h += (i ? 'L' : 'M') + (cx + Math.cos(a) * r).toFixed(2) + ' ' + (cy + Math.sin(a) * r).toFixed(2);
    }
    return h + 'z';
  }
  // lo que cae al fondo de la entrada: estrellitas doradas y fruta cristalizada (tiras de ate e higos)
  var REYES_LLUEVE = { n: 26, z: [12, 23], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: '<path d="' + REYES_ESTRELLA(10, 10.6, 9, 3.9) + '" fill="#F2C066" stroke="#E0A100" stroke-width=".9" stroke-linejoin="round"/>'
      + '<path d="' + REYES_ESTRELLA(10, 10.6, 4.4, 1.9) + '" fill="#FFE9A6"/>' },
    { modo: 'flota', vb: '0 0 20 20', g: ANIO_DESTELLO(10, 10, 8.6, '#FFF3C4') + ANIO_DESTELLO(10, 10, 3.6, '#FFE27A') },
    { modo: 'cae', vb: '0 0 20 12', g: '<rect x="1.5" y="2" width="17" height="8" rx="3" fill="#D42A3A"/><rect x="3.4" y="3" width="11" height="2.2" rx="1.1" fill="#F27A86"/>'
      + '<g fill="#fff" opacity=".85"><circle cx="5" cy="7.6" r=".55"/><circle cx="8.6" cy="8" r=".55"/><circle cx="12.4" cy="7.4" r=".55"/><circle cx="16" cy="5" r=".55"/></g>' },
    { modo: 'cae', vb: '0 0 16 20', g: '<path d="M8 3.6V1" stroke="#9C6A3E" stroke-width="1.4" stroke-linecap="round"/>'
      + '<path d="M8 3c-1.2 3-5.6 5.8-5.6 10.2a5.6 5.6 0 0 0 11.2 0C13.6 8.8 9.2 6 8 3z" fill="#5BAE3E"/>'
      + '<path d="M5.4 12.4c.2-2 1.2-3.8 2.4-5" stroke="#B4E68A" stroke-width="1.3" fill="none" stroke-linecap="round"/>'
      + '<g fill="#fff" opacity=".85"><circle cx="9.6" cy="11" r=".55"/><circle cx="7.4" cy="15.6" r=".55"/><circle cx="10.8" cy="15" r=".55"/></g>' }] };
  alta('reyes',
    { m: REYES_M, m2: REYES_M2, j: REYES_J, mov: 'brinca', mov2: 'flota', jmov: 'brinca', lluvia: REYES_LLUEVE, w: 112, w2: 92,
      dice: ['¡Rosca de Reyes!', '¡A partir la rosca!', '¡Corona de rey!', '¡Hoy eres rey!'] });
  CSS_FECHAS += '.pt-reyes-brillo{transform-box:fill-box;transform-origin:50% 50%;animation:pt-reyes-brillo 1.5s ease-in-out infinite}.pt-reyes-b2{animation-delay:-.75s}'
    + '@keyframes pt-reyes-brillo{0%,100%{opacity:.25;transform:scale(.5)}50%{opacity:1;transform:scale(1.1)}}';

  // Día de la Pizza (17 de enero): la rebanada con queso que se estira y la pizza entera
  function PIZZA_SECTOR(cx, cy, r, a1, a2) {
    var p = function (a) { a = a * Math.PI / 180; return (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1); };
    return 'M' + cx + ' ' + cy + 'L' + p(a1) + 'A' + r + ' ' + r + ' 0 ' + (a2 - a1 > 180 ? 1 : 0) + ' 1 ' + p(a2) + 'z';
  }
  function PIZZA_PEPE(x, y, r) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#C8102E"/><circle cx="' + (x - r * .3).toFixed(1) + '" cy="' + (y - r * .25).toFixed(1) + '" r="' + (r * .18).toFixed(1) + '" fill="#8E1420"/>'
      + '<circle cx="' + (x + r * .35).toFixed(1) + '" cy="' + (y + r * .3).toFixed(1) + '" r="' + (r * .15).toFixed(1) + '" fill="#8E1420"/>';
  }
  var PIZZA_M = { vb: '0 0 90 110', g: '<path d="M8 22Q45 9 82 22L50 94Q45 101 40 94z" fill="#D9432B"/>'
    + '<path d="M12 24Q45 13 78 24L49 89Q45 94 41 89z" fill="#FFC93C"/>'
    + '<path d="M17 36q-3 7 0 11 2 2 3.6-1 1.4-4 0-10z" fill="#FFC93C"/><path d="M71 40q3 6 1 10-2 2-3.4-1-1-4 0-9z" fill="#FFC93C"/>'
    + PIZZA_PEPE(30, 40, 7) + PIZZA_PEPE(58, 38, 7) + PIZZA_PEPE(45, 60, 6.5) + PIZZA_PEPE(45, 78, 4.2)
    + '<path d="M54 52c4-4 9-3 10 0-4 3-8 3-10 0zM26 54c3-4 8-4 9-1-3 3-7 4-9 1z" fill="#3E9A3A"/>'
    + '<g class="pt-pizza-queso"><path d="M41.5 86Q40 98 43 104Q45 107 47 104Q50 98 48.5 86z" fill="#FFC93C"/></g>'
    + '<path d="M4 20Q45 2 86 20Q88 28 80 28Q45 14 10 28Q2 28 4 20z" fill="#E3A04F"/>'
    + '<path d="M14 18Q45 8 76 18" stroke="#F6C67A" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
    + '<g fill="#C9822F"><circle cx="24" cy="18" r="1.1"/><circle cx="52" cy="14" r="1.1"/><circle cx="68" cy="17" r="1.1"/></g>' };
  var PIZZA_M2 = { vb: '0 0 100 104', g: (function () {
    var h = '<ellipse cx="50" cy="96" rx="40" ry="6" fill="#0A1222" opacity=".25"/>', a = -67.5, b = 247.5;
    h += '<path d="' + PIZZA_SECTOR(50, 54, 44, a, b) + '" fill="#E3A04F"/><path d="' + PIZZA_SECTOR(50, 54, 38, a, b) + '" fill="#D9432B"/>'
      + '<path d="' + PIZZA_SECTOR(50, 54, 36, a, b) + '" fill="#FFC93C"/>';
    [-22.5, 22.5, 67.5, 112.5, 157.5, 202.5].forEach(function (g) {
      g = g * Math.PI / 180; h += '<path d="M50 54L' + (50 + 36 * Math.cos(g)).toFixed(1) + ' ' + (54 + 36 * Math.sin(g)).toFixed(1) + '" stroke="#E8A82A" stroke-width="1.6"/>';
    });
    h += PIZZA_PEPE(72, 48, 6) + PIZZA_PEPE(66, 72, 6) + PIZZA_PEPE(40, 78, 6) + PIZZA_PEPE(28, 56, 6) + PIZZA_PEPE(58, 60, 4.5) + PIZZA_PEPE(40, 60, 4)
      + '<path d="M76 60c4-4 9-3 10 0-4 3-8 3-10 0zM20 70c3-4 8-4 9-1-3 3-7 4-9 1zM52 86c3-4 8-4 9-1-3 3-7 4-9 1z" fill="#3E9A3A"/>';
    // la rebanada que se jala, con su queso estirado
    h += '<g stroke="#FFC93C" stroke-width="2.2" stroke-linecap="round"><path d="M45 44l1.5-9M41 34l1.6-9M57.5 41.5 59 32.5M62 32l1.4-9"/></g>'
      + '<g transform="translate(2 -10)"><path d="' + PIZZA_SECTOR(50, 54, 44, -112.5, -67.5) + '" fill="#E3A04F"/><path d="' + PIZZA_SECTOR(50, 54, 38, -112.5, -67.5) + '" fill="#D9432B"/>'
      + '<path d="' + PIZZA_SECTOR(50, 54, 36, -112.5, -67.5) + '" fill="#FFC93C"/>' + PIZZA_PEPE(50, 32, 5.5) + '</g>';
    return h;
  })() };
  var PIZZA_J = { vb: '0 0 18 20', g: '<path d="M1.8 4.2Q9 1 16.2 4.2L9.9 18.4Q9 19.8 8.1 18.4z" fill="#FFC93C" stroke="#D9921E" stroke-width=".7" stroke-linejoin="round"/>'
    + '<circle cx="6.8" cy="7.8" r="1.7" fill="#C8102E"/><circle cx="11.4" cy="8.4" r="1.5" fill="#C8102E"/><circle cx="9.1" cy="12.6" r="1.2" fill="#C8102E"/>'
    + '<path d="M1 3.8Q9 .2 17 3.8Q17.6 6 15.8 6Q9 3.4 2.2 6Q.4 6 1 3.8z" fill="#D98A3A"/>' };
  // lo que cae al fondo de la entrada: rebanaditas de pepperoni, hojitas de albahaca y champiñones rebanados
  var PIZZA_LLUEVE = { n: 24, z: [13, 23], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: '<circle cx="10" cy="10" r="8.6" fill="#B81E24"/><circle cx="10" cy="10" r="7.4" fill="#E0402F"/>'
      + '<g fill="#A81C22"><circle cx="7" cy="7.6" r="1.4"/><circle cx="13" cy="8.4" r="1.1"/><circle cx="8.6" cy="13.2" r="1.2"/><circle cx="13.4" cy="12.8" r=".9"/></g>'
      + '<g fill="#F6A28E"><circle cx="10.4" cy="5.6" r=".8"/><circle cx="5.4" cy="11" r=".7"/><circle cx="11.4" cy="10.6" r=".6"/></g>' },
    { modo: 'flota', vb: '0 0 20 20', g: '<path d="M10 1.5C15.4 5 16.6 11.4 12.8 15.6 11.6 17 10 18.4 10 18.4S8.4 17 7.2 15.6C3.4 11.4 4.6 5 10 1.5z" fill="#3E9A3A"/>'
      + '<path d="M10 1.5C4.6 5 3.4 11.4 7.2 15.6 8.4 17 10 18.4 10 18.4z" fill="#56B84A"/>'
      + '<path d="M10 4.4v14" stroke="#B5E69A" stroke-width="1" stroke-linecap="round"/>'
      + '<path d="M10 8 7.4 6.4M10 8l2.6-1.6M10 11.6 6.8 10M10 11.6l3.2-1.6" stroke="#B5E69A" stroke-width=".7" stroke-linecap="round"/>' },
    { modo: 'cae', vb: '0 0 20 19', g: '<path d="M2 10C2 5.4 5.6 2 10 2s8 3.4 8 8c0 1-.8 1.6-1.8 1.6H13v4.4c0 1.4-1.2 2-3 2s-3-.6-3-2v-4.4H3.8C2.8 11.6 2 11 2 10z" fill="#F1E2C4" stroke="#9C6B3C" stroke-width="1"/>'
      + '<path d="M3 9.4C3.2 5.8 6.2 3 10 3s6.8 2.8 7 6.4" stroke="#B9875A" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
      + '<path d="M4.6 10.4h10.8" stroke="#C9A276" stroke-width="1" stroke-linecap="round"/>' }] };
  alta('pizza',
    { m: PIZZA_M, m2: PIZZA_M2, j: PIZZA_J, mov: 'brinca', mov2: 'flota', jmov: 'brinca', lluvia: PIZZA_LLUEVE, w: 90,
      dice: ['¡Mucho queso!', '¡Otra rebanada!', '¡Pizza para todos!', '¡Recién salida!'] });
  CSS_FECHAS += '.pt-pizza-queso{transform-box:fill-box;transform-origin:50% 0;animation:pt-pizza-queso 1.8s ease-in-out infinite alternate}'
    + '@keyframes pt-pizza-queso{from{transform:scaleY(.55)}to{transform:scaleY(1.12)}}';

  // Día de las Palomitas (19 de enero): la cubeta de rayas con palomitas que brincan
  function PALOMITAS_G(x, y, s) {
    var c = function (cx, cy, r) { return '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + r.toFixed(1) + '"/>'; };
    return '<g fill="#FFF6DC" stroke="#E2C98A" stroke-width="1">' + c(x - s * .7, y + s * .35, s * .75) + c(x + s * .7, y + s * .3, s * .8) + c(x + s * .1, y - s * .6, s * .72)
      + c(x, y + s * .1, s * .8) + '</g><circle cx="' + (x + s * .25).toFixed(1) + '" cy="' + (y + s * .3).toFixed(1) + '" r="' + (s * .3).toFixed(1) + '" fill="#FFE08A"/>';
  }
  var PALOMITAS_M = { vb: '0 0 90 112', g: (function () {
    var h = '<g class="pt-palomitas-pop">' + PALOMITAS_G(22, 12, 6) + '</g><g class="pt-palomitas-pop pt-palomitas-p2">' + PALOMITAS_G(68, 10, 6) + '</g>', i;
    var g = [[33, 22, 7.5], [50, 20, 7.5], [60, 27, 7.5], [24, 32, 7.5], [41, 29, 8], [70, 36, 7.5], [17, 41, 7], [31, 40, 8], [49, 38, 8], [62, 42, 7.5], [74, 45, 6.5]];
    for (i = 0; i < g.length; i++) h += PALOMITAS_G(g[i][0], g[i][1], g[i][2]);
    for (i = 0; i < 6; i++) {
      h += '<path d="M' + (14 + i * 62 / 6).toFixed(1) + ' 48L' + (14 + (i + 1) * 62 / 6).toFixed(1) + ' 48L' + (24 + (i + 1) * 7).toFixed(1) + ' 108L' + (24 + i * 7).toFixed(1)
        + ' 108z" fill="' + (i % 2 ? '#FFF8EC' : '#D62839') + '"/>';
    }
    return h + '<rect x="10" y="44" width="70" height="9" rx="4" fill="#D62839"/><rect x="10" y="44" width="70" height="3" rx="1.5" fill="#F05A68"/>'
      + '<circle cx="45" cy="78" r="12" fill="#1F3864" stroke="#F2C066" stroke-width="2.4"/>' + ANIO_DESTELLO(45, 78, 8, '#F2C066')
      + '<path d="M24 108h42" stroke="#A81E2C" stroke-width="3" stroke-linecap="round"/>';
  })() };
  var PALOMITAS_M2 = { vb: '0 0 84 84', g: (function () {
    // un grano de palomita con su cascarita abajo
    var h = '<path d="M34 70c2-7 14-8 17-1 1.6 4.6-2 9-8.6 9S32.6 74.6 34 70z" fill="#F2B544" stroke="#C98A12" stroke-width="1.4"/>'
      + '<g fill="#FFF6DC" stroke="#E2C98A" stroke-width="1.5">', i;
    var p = [[22, 56, 11], [64, 56, 12], [29, 26, 13], [58, 23, 12], [22, 42, 16], [63, 40, 16], [43, 20, 15], [43, 58, 17], [42, 40, 20]];
    for (i = 0; i < p.length; i++) h += '<circle cx="' + p[i][0] + '" cy="' + p[i][1] + '" r="' + p[i][2] + '"/>';
    return h + '</g><path d="M30 16q4-4 9-3M60 15q5 0 7 4" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
      + '<g class="pt-palomitas-ojos"><ellipse cx="34" cy="42" rx="3.6" ry="4.8" fill="#1F3864"/><ellipse cx="50" cy="42" rx="3.6" ry="4.8" fill="#1F3864"/></g>'
      + '<circle cx="35.2" cy="40.4" r="1.3" fill="#fff"/><circle cx="51.2" cy="40.4" r="1.3" fill="#fff"/>'
      + '<path d="M35 52q7 7 14 0" stroke="#1F3864" stroke-width="2.8" fill="none" stroke-linecap="round"/>'
      + '<circle cx="28" cy="50" r="3.6" fill="#F29BC4" opacity=".7"/><circle cx="56" cy="50" r="3.6" fill="#F29BC4" opacity=".7"/>';
  })() };
  var PALOMITAS_J = { vb: '0 0 18 20', g: (function () {
    var h = '', i;
    for (i = 0; i < 5; i++) {
      h += '<path d="M' + (2.4 + i * 2.64).toFixed(2) + ' 8.6L' + (2.4 + (i + 1) * 2.64).toFixed(2) + ' 8.6L' + (4.6 + (i + 1) * 1.76).toFixed(2) + ' 19L' + (4.6 + i * 1.76).toFixed(2)
        + ' 19z" fill="' + (i % 2 ? '#fff' : '#D62839') + '"/>';
    }
    return '<g class="pt-palomitas-salta"><circle cx="13.6" cy="2.6" r="1.7" fill="#FFF6DC" stroke="#B9A066" stroke-width=".55"/></g>'
      + '<g fill="#FFF6DC" stroke="#B9A066" stroke-width=".55"><circle cx="4.6" cy="7.2" r="2.3"/><circle cx="13.4" cy="7.2" r="2.3"/><circle cx="7.4" cy="5.6" r="2.4"/><circle cx="10.8" cy="5.8" r="2.4"/></g>'
      + h + '<path d="M2.4 8.6h13.2L13.4 19H4.6z" fill="none" stroke="#9E1A28" stroke-width=".6" stroke-linejoin="round"/>';
  })() };
  // lo que cae al fondo de la entrada: palomitas de tres formas que caen girando (una con su cascarita)
  var PALOMITAS_LLUEVE = { n: 26, z: [12, 22], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: '<g fill="#FFF6DC" stroke="#E2C98A" stroke-width=".8"><circle cx="6.4" cy="11.6" r="4.2"/><circle cx="13.8" cy="11" r="4.4"/>'
      + '<circle cx="10.2" cy="5.8" r="4.2"/><circle cx="10" cy="12.6" r="4.2"/></g><circle cx="11.6" cy="12.6" r="1.8" fill="#FFE08A"/>'
      + '<path d="M8 4.6q1.6-1.2 3.4-.6" stroke="#fff" stroke-width="1" fill="none" stroke-linecap="round"/>' },
    { modo: 'cae', vb: '0 0 20 20', g: '<path d="M7 15.4c1-2.6 5-2.8 6.2-.4.6 1.6-.8 3.2-3.2 3.2s-3.6-1.2-3-2.8z" fill="#F2B544" stroke="#C98A12" stroke-width=".7"/>'
      + '<g fill="#FFF6DC" stroke="#E2C98A" stroke-width=".8"><circle cx="6.6" cy="8.4" r="4.6"/><circle cx="13.4" cy="8" r="4.4"/><circle cx="10" cy="12.2" r="4.4"/></g>'
      + '<circle cx="8.4" cy="11" r="1.5" fill="#FFE08A"/>' },
    { modo: 'cae', vb: '0 0 20 20', g: '<g fill="#FFF6DC" stroke="#E2C98A" stroke-width=".8"><circle cx="5.6" cy="9.6" r="3.6"/><circle cx="10.4" cy="6" r="4"/>'
      + '<circle cx="14.4" cy="10.4" r="3.8"/><circle cx="9.8" cy="12.8" r="3.8"/><circle cx="14" cy="14.8" r="2.6"/></g>'
      + '<g fill="#FFE08A"><circle cx="9" cy="10.4" r="1.5"/><circle cx="13.4" cy="13.6" r="1"/></g>' }] };
  alta('palomitas',
    { m: PALOMITAS_M, m2: PALOMITAS_M2, j: PALOMITAS_J, mov: 'brinca', mov2: 'saluda', jmov: 'mece', lluvia: PALOMITAS_LLUEVE, w: 92, w2: 80,
      dice: ['¡Pop, pop, pop!', '¡Con mantequilla!', '¡Hola, soy palomita!', '¡A ver una peli!'] });
  CSS_FECHAS += '.pt-palomitas-pop{transform-box:fill-box;transform-origin:50% 100%;animation:pt-palomitas-pop 1.3s ease-out infinite}.pt-palomitas-p2{animation-delay:-.65s}'
    + '@keyframes pt-palomitas-pop{0%,100%{transform:translateY(80%) scale(.6);opacity:0}15%{opacity:1}50%{transform:translateY(-55%) rotate(25deg) scale(1)}85%{transform:translateY(30%) rotate(50deg);opacity:1}}'
    + '.pt-palomitas-salta{transform-box:fill-box;transform-origin:50% 50%;animation:pt-palomitas-salta 1.2s ease-out infinite}'
    + '@keyframes pt-palomitas-salta{0%,100%{transform:translate(-60%,140%);opacity:0}20%{opacity:1}55%{transform:translate(0,0) rotate(40deg)}90%{opacity:1}}'
    + '.pt-palomitas-ojos{transform-box:fill-box;transform-origin:50% 50%;animation:pt-palomitas-ojos 3.2s ease-in-out infinite}'
    + '@keyframes pt-palomitas-ojos{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}';

  // Día del Abrazo (21 de enero): dos corazoncitos que se abrazan
  var ABRAZO_D = 'M8 14.2S1.4 10.1 1.4 5.6A3.5 3.5 0 0 1 8 4a3.5 3.5 0 0 1 6.6 1.6C14.6 10.1 8 14.2 8 14.2z';
  function ABRAZO_C(x, y, s, r, c) { return '<path transform="translate(' + x + ' ' + y + ') rotate(' + r + ') scale(' + s + ') translate(-8 -9)" d="' + ABRAZO_D + '" fill="' + c + '"/>'; }
  var ABRAZO_M = { vb: '0 0 112 96', g: '<g class="pt-abrazo-sube">' + ABRAZO_C(56, 12, 1.1, 0, '#F29BC4') + '</g>'
    + '<g class="pt-abrazo-sube pt-abrazo-s2">' + ABRAZO_C(70, 18, .8, 12, '#F2C066') + '</g>'
    // la manita del naranja asoma por la espalda del rosa
    + '<path d="M24 62q-8 1-11-4" stroke="#C85A0E" stroke-width="7.4" fill="none" stroke-linecap="round"/><path d="M24 62q-8 1-11-4" stroke="#F07A1E" stroke-width="5" fill="none" stroke-linecap="round"/>'
    + ABRAZO_C(38, 56, 4.1, 12, '#E8418C') + ABRAZO_C(74, 56, 4.1, -12, '#F07A1E')
    + '<path d="M22 46q4.5-6 9 0M37 44q4.5-6 9 0" stroke="#5A1A3A" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
    + '<path d="M66 44q4.5-6 9 0M81 46q4.5-6 9 0" stroke="#6A2A0A" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
    + '<path d="M29 54q5 5 10 0" stroke="#5A1A3A" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M73 54q5 5 10 0" stroke="#6A2A0A" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    + '<circle cx="21" cy="54" r="3.2" fill="#F7A8C8"/><circle cx="89" cy="52" r="3" fill="#FFC48A"/>'
    // y el bracito del rosa abraza al naranja por enfrente
    + '<path d="M52 62q20 12 40-1" stroke="#B8236A" stroke-width="7.4" fill="none" stroke-linecap="round"/><path d="M52 62q20 12 40-1" stroke="#E8418C" stroke-width="5" fill="none" stroke-linecap="round"/>' };
  var ABRAZO_M2 = { vb: '0 0 100 84', g: '<path d="M26 48 10 26" stroke="#E8418C" stroke-width="7" stroke-linecap="round"/><circle cx="9" cy="24" r="5" fill="#E8418C"/>'
    + '<g class="pt-abrazo-brazo"><path d="M74 48 90 26" stroke="#E8418C" stroke-width="7" stroke-linecap="round"/><circle cx="91" cy="24" r="5" fill="#E8418C"/></g>'
    + ABRAZO_C(50, 48, 4.6, 0, '#E8418C')
    + '<ellipse cx="40" cy="40" rx="3.4" ry="4.6" fill="#4A1030"/><ellipse cx="60" cy="40" rx="3.4" ry="4.6" fill="#4A1030"/>'
    + '<circle cx="41.2" cy="38.4" r="1.3" fill="#fff"/><circle cx="61.2" cy="38.4" r="1.3" fill="#fff"/>'
    + '<path d="M41 50q9 10 18 0z" fill="#8C1840"/><circle cx="31" cy="48" r="3.6" fill="#F7A8C8"/><circle cx="69" cy="48" r="3.6" fill="#F7A8C8"/>' };
  var ABRAZO_J = { vb: '0 0 22 18', g: '<path d="M4.6 11.6q-2 .2-2.8-1.2" stroke="#F07A1E" stroke-width="1.5" fill="none" stroke-linecap="round"/>'
    + ABRAZO_C(7.8, 10.2, .84, 12, '#E8418C') + ABRAZO_C(14.2, 10.2, .84, -12, '#F07A1E')
    + '<path d="M10.4 11.6q4 2.6 8.2-.4" stroke="#C02670" stroke-width="2" fill="none" stroke-linecap="round"/>'
    + '<path d="M10.4 11.6q4 2.6 8.2-.4" stroke="#E8418C" stroke-width="1.3" fill="none" stroke-linecap="round"/>' };
  // lo que sube al fondo de la entrada: corazones (dibujados, iguales en todo aparato) y parejitas de corazones abrazados
  function ABRAZO_LL(c) {
    return { modo: 'sube', vb: '0 0 16 16', g: '<path d="' + ABRAZO_D + '" fill="' + c + '"/><path d="M3.6 5.4q.4-1.8 2.2-1.9" stroke="#fff" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".6"/>' };
  }
  var ABRAZO_LLUEVE = { n: 22, z: [12, 24], formas: [ABRAZO_LL('#E8418C'), ABRAZO_LL('#F07A1E'), ABRAZO_LL('#F29BC4'), { modo: 'sube', vb: ABRAZO_J.vb, g: ABRAZO_J.g }] };
  alta('abrazo',
    { m: ABRAZO_M, m2: ABRAZO_M2, j: ABRAZO_J, mov: 'late', mov2: 'brinca', jmov: 'late', lluvia: ABRAZO_LLUEVE, w: 112, w2: 92,
      dice: ['¡Un abrazo!', '¡Abrazo de oso!', '¡Ven, abrázame!', '¡Abrazos para todos!'] });
  CSS_FECHAS += '.pt-abrazo-sube{transform-box:fill-box;transform-origin:50% 50%;animation:pt-abrazo-sube 2.4s ease-out infinite}.pt-abrazo-s2{animation-delay:-1.2s}'
    + '@keyframes pt-abrazo-sube{0%{transform:translateY(120%) scale(.4);opacity:0}25%{opacity:1}100%{transform:translateY(-90%) scale(1);opacity:0}}'
    + '.pt-abrazo-brazo{transform-box:fill-box;transform-origin:0 100%;animation:pt-abrazo-brazo 1s ease-in-out infinite alternate}'
    + '@keyframes pt-abrazo-brazo{from{transform:rotate(-14deg)}to{transform:rotate(16deg)}}';

  // Día del Croissant (30 de enero): el cuernito dorado y su café
  // el cuernito: cinco gajos a lo largo de un arco (las puntas abajo), cada gajo atravesado como en el pan de verdad
  function CROISSANT_FORMA(sw, brillo) {
    var g = [[-171, 5.5, 6.5, '#C06C24'], [-9, 5.5, 6.5, '#C06C24'], [-149, 10, 11.5, '#CC7A2A'], [-31, 10, 11.5, '#CC7A2A'],
      [-121, 13.5, 16.5, '#DA8C38'], [-59, 13.5, 16.5, '#DA8C38'], [-90, 16.5, 21, '#E8A24A']], h = '', i, t, x, y, r;
    for (i = 0; i < g.length; i++) {
      t = g[i][0] * Math.PI / 180; x = 58 + 40 * Math.cos(t); y = 72 + 40 * Math.sin(t); r = g[i][0] + 90;
      h += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="' + g[i][1] + '" ry="' + g[i][2] + '" transform="rotate(' + r + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')" fill="' + g[i][3] + '" stroke="#A9581A" stroke-width="' + sw + '"/>';
      if (brillo) {
        h += '<ellipse cx="' + (x + Math.cos(t) * g[i][2] * .5).toFixed(1) + '" cy="' + (y + Math.sin(t) * g[i][2] * .5).toFixed(1) + '" rx="' + (g[i][1] * .5).toFixed(1) + '" ry="' + (g[i][2] * .16).toFixed(1)
          + '" transform="rotate(' + r + ' ' + (x + Math.cos(t) * g[i][2] * .5).toFixed(1) + ' ' + (y + Math.sin(t) * g[i][2] * .5).toFixed(1) + ')" fill="#F8CF86"/>';
      }
    }
    return h;
  }
  var CROISSANT_M = { vb: '0 0 116 80', g: '<ellipse cx="58" cy="74" rx="46" ry="4.6" fill="#0A1222" opacity=".25"/>' + CROISSANT_FORMA(1.6, true)
    + '<g fill="#fff" opacity=".55"><circle cx="64" cy="24" r="1.6"/><circle cx="36" cy="40" r="1.2"/><circle cx="82" cy="40" r="1.2"/></g>' };
  var CROISSANT_M2 = { vb: '0 0 92 96', g: '<g class="pt-croissant-vapor"><path d="M34 30c-6-6 6-10 0-16s6-10 0-13" stroke="#EEF1F6" stroke-width="3" fill="none" stroke-linecap="round" opacity=".75"/></g>'
    + '<g class="pt-croissant-vapor pt-croissant-v2"><path d="M50 30c-6-6 6-10 0-16s6-10 0-13" stroke="#EEF1F6" stroke-width="3" fill="none" stroke-linecap="round" opacity=".75"/></g>'
    + '<ellipse cx="45" cy="86" rx="40" ry="8" fill="#EEF1F6"/><ellipse cx="45" cy="84.5" rx="25" ry="4.6" fill="#C9D1DE"/>'
    + '<path d="M70 50c14-3 17 15 2 19" stroke="#F07A1E" stroke-width="6" fill="none" stroke-linecap="round"/>'
    + '<path d="M14 38h62v14c0 18-14 31-31 31S14 70 14 52z" fill="#F07A1E"/><path d="M16 60c12 4 46 4 58 0" stroke="#FFF8EC" stroke-width="3.4" fill="none"/>'
    + '<ellipse cx="45" cy="38" rx="31" ry="7" fill="#FFF8EC"/><ellipse cx="45" cy="39" rx="27" ry="5" fill="#6B3E1E"/><ellipse cx="40" cy="38.2" rx="10" ry="1.6" fill="#A0663A"/>' };
  var CROISSANT_J = { vb: '0 0 20 14', g: '<g transform="translate(-1.98 -1.52) scale(.2065)">' + CROISSANT_FORMA(3, false) + '</g>'
    + '<path d="M8.6 2.4q1.5-.8 3 0" stroke="#F8CF86" stroke-width=".9" fill="none" stroke-linecap="round"/>' };
  // lo que cae al fondo de la entrada: migajas doradas (hojaldre y boronitas) y granos de café
  var CROISSANT_LLUEVE = { n: 24, z: [12, 22], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: '<path d="M2.4 9.6 7.6 3.4l8.2 1.2 2 6.4-5.6 5.8-8-1.6z" fill="#E8A24A" stroke="#B66A22" stroke-width=".9" stroke-linejoin="round"/>'
      + '<path d="M5.2 8.4 11 6.4l3.8 4M5.4 12l6-1.6 2.4 3" stroke="#C47A2C" stroke-width="1" fill="none" stroke-linecap="round"/>'
      + '<path d="M8.4 5 13 5.6" stroke="#F8CF86" stroke-width="1.4" stroke-linecap="round"/>' },
    { modo: 'cae', vb: '0 0 20 20', g: '<path d="M2 5l3-2.6 3.4 1.4-.6 3.6-3.6.6z" fill="#E8A24A"/><path d="M11 3.6l4.6.4 1.2 3.6-3.4 2.2-3-2z" fill="#F2BC66"/>'
      + '<path d="M5.4 12.4l4.4-1.4 3 3.2-2 4.2-4.4-.8z" fill="#D98C38"/><path d="M14.6 13.6l2.8.6.4 2.6-2.6 1-1.6-2.2z" fill="#F8CF86"/>' },
    { modo: 'cae', vb: '0 0 16 20', g: '<ellipse cx="8" cy="10" rx="6.2" ry="8.6" fill="#8A5228"/><path d="M4 6.6c.8-2.4 2.4-3.6 4-4" stroke="#C08A52" stroke-width="1.4" fill="none" stroke-linecap="round"/>'
      + '<path d="M8.4 1.8c-2.8 3-2.8 5.4-.4 8.2s2.4 5.2-.4 8.2" stroke="#3B1F0E" stroke-width="1.5" fill="none" stroke-linecap="round"/>' }] };
  alta('croissant',
    { m: CROISSANT_M, m2: CROISSANT_M2, j: CROISSANT_J, mov: 'brinca', mov2: 'mece', jmov: 'brinca', lluvia: CROISSANT_LLUEVE, w: 112, w2: 84,
      dice: ['¡Recién horneado!', '¡Crujientito!', '¡Con un cafecito!', '¡Buenos días!'] });
  CSS_FECHAS += '.pt-croissant-vapor{transform-box:fill-box;transform-origin:50% 100%;animation:pt-croissant-vapor 2.2s ease-in-out infinite}.pt-croissant-v2{animation-delay:-1.1s}'
    + '@keyframes pt-croissant-vapor{0%{opacity:0;transform:translateY(18%) scaleY(.8)}40%{opacity:1}100%{opacity:0;transform:translateY(-22%) scaleY(1.05)}}';

  // Día de la Candelaria (2 de febrero): tamales en hoja de maíz y un jarrito de atole humeante
  // vapor: la clase animada va sola en su grupo (un transform en el mismo grupo lo pisaría la animación)
  function CANDELARIA_VAPOR(x, y, otra) {
    return '<g class="pt-candelaria-vapor' + (otra ? ' pt-candelaria-v2' : '') + '"><path d="M' + x + ' ' + y + 'c-5-5 5-9 0-14s5-9 0-12" stroke="#EEF1F6" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".8"/></g>';
  }
  var CANDELARIA_M = { vb: '0 0 112 82', g: CANDELARIA_VAPOR(70, 42) + CANDELARIA_VAPOR(84, 40, true)
    + '<ellipse cx="56" cy="68" rx="52" ry="12" fill="#B5522B"/><ellipse cx="56" cy="66" rx="44" ry="8.5" fill="#C96A3A"/>'
    + '<path d="M10 70c6 5 12-1 18 3s12-2 18 2 12-2 18 1 12-2 18 0 12-2 16-4" stroke="#F2C066" stroke-width="2" fill="none"/>'
    // el tamal envuelto (atrás)
    + '<path d="M6 42C10 31 25 27 42 28l20 1c3 5 3 15 0 20l-20 1C25 51 10 50 6 42z" fill="#E3CF8E" stroke="#BFA65E" stroke-width="1.4"/>'
    + '<ellipse cx="61.5" cy="39" rx="3.4" ry="9.6" fill="#F6DC8C"/>'
    + '<path d="M12 41c12-6 28-7 46-6M12 42c12 4 28 5 46 4" stroke="#C9B36A" stroke-width="1.3" fill="none"/>'
    + '<path d="M40 28.6v21.6" stroke="#CDB66E" stroke-width="4"/>'
    // el tamal abierto (enfrente), con su salsa roja
    + '<path d="M34 60C42 46 70 40 106 44C102 56 82 67 54 66C44 65 37 63 34 60z" fill="#EADDA8" stroke="#C9B36A" stroke-width="1.4"/>'
    + '<path d="M44 60c14-8 34-12 56-12" stroke="#D2BD78" stroke-width="1.2" fill="none"/>'
    + '<g transform="rotate(-7 70 53)"><rect x="52" y="46" width="38" height="14" rx="6.5" fill="#F6DC8C"/><path d="M58 53h26" stroke="#C8102E" stroke-width="3.6" stroke-linecap="round"/>'
    + '<path d="M56 49.4h22" stroke="#FFF1C2" stroke-width="2" stroke-linecap="round"/></g>' };
  var CANDELARIA_M2 = { vb: '0 0 84 96', g: CANDELARIA_VAPOR(31, 26) + CANDELARIA_VAPOR(45, 26, true)
    + '<path d="M62 44c15-5 18 22 0 25" stroke="#9C4422" stroke-width="7" fill="none" stroke-linecap="round"/>'
    + '<path d="M12 32h52c2 8 0 12-2 16 6 10 6 24-2 32-6 6-14 9-22 9s-16-3-22-9c-8-8-8-22-2-32-2-4-4-8-2-16z" fill="#B5522B"/>'
    + '<path d="M17 52c4 3 8-3 12 0s8-3 12 0 8-3 12 0 8-3 10-1" stroke="#F2C066" stroke-width="2.4" fill="none"/>'
    + '<g fill="#F4ECD8"><circle cx="24" cy="66" r="2.2"/><circle cx="38" cy="70" r="2.2"/><circle cx="52" cy="66" r="2.2"/></g>'
    + '<g fill="#3E9A3A"><circle cx="31" cy="68" r="1.4"/><circle cx="45" cy="68" r="1.4"/></g>'
    + '<ellipse cx="38" cy="32" rx="27" ry="6.5" fill="#C96A3A"/><ellipse cx="38" cy="32.6" rx="22" ry="4.4" fill="#C79A6E"/>'
    + '<path d="M30 31.6c4-1 10-1 14 0" stroke="#E2BE94" stroke-width="1.6" fill="none" stroke-linecap="round"/>' };
  // junto al signo: el jarrito de atole humeando (se entiende mejor que un tamal a ese tamaño)
  var CANDELARIA_J = { vb: '0 0 18 20', g: '<g class="pt-candelaria-humito" stroke="#9AA6BA" stroke-width=".95" fill="none" stroke-linecap="round"><path d="M6.6 5.2c-1-1 1-1.9 0-3.2M10.4 5.2c-1-1 1-1.9 0-3.2"/></g>'
    + '<path d="M13.6 9.8c3.2-1 3.8 4.6 0 5.2" stroke="#8E3E1F" stroke-width="1.7" fill="none" stroke-linecap="round"/>'
    + '<path d="M2.4 7.2h12.4c.4 1.8 0 2.8-.4 3.6 1.4 2.2 1.4 5.4-.4 7.2-1.4 1.4-3.2 1.8-5.4 1.8s-4-.4-5.4-1.8c-1.8-1.8-1.8-5-.4-7.2-.4-.8-.8-1.8-.4-3.6z" fill="#B5522B" stroke="#8E3E1F" stroke-width=".5"/>'
    + '<ellipse cx="8.6" cy="7.2" rx="6.4" ry="1.6" fill="#C96A3A" stroke="#8E3E1F" stroke-width=".4"/><ellipse cx="8.6" cy="7.4" rx="5" ry="1" fill="#D9B48A"/>'
    + '<path d="M3.4 11.8c1 .7 1.8-.7 2.8 0s1.8-.7 2.8 0 1.8-.7 2.8 0 1.6-.6 2.2-.2" stroke="#F2C066" stroke-width=".75" fill="none"/>'
    + '<g fill="#F4ECD8"><circle cx="5.6" cy="15" r=".7"/><circle cx="8.6" cy="15.8" r=".7"/><circle cx="11.6" cy="15" r=".7"/></g>' };
  // lo que cae al fondo de la entrada: tamalitos envueltos, tamalitos abiertos con su salsa y hojas de maíz
  var CANDELARIA_LLUEVE = { n: 22, z: [14, 26], formas: [
    { modo: 'cae', vb: '0 0 24 12', g: '<path d="M1 6C2.4 2.6 7 1.4 13 1.6l7 .4c1.4 2 1.4 6 0 8l-7 .4C7 10.6 2.4 9.4 1 6z" fill="#E6D292" stroke="#B49A52" stroke-width=".8"/>'
      + '<ellipse cx="20" cy="6" rx="1.8" ry="4" fill="#F6DC8C" stroke="#D9B85A" stroke-width=".6"/>'
      + '<path d="M4 5.4c4-2 9-2.4 14-2.2M4 6.6c4 1.6 9 2 14 1.8" stroke="#C4AC62" stroke-width=".8" fill="none"/>'
      + '<path d="M13.4 1.8v8.4" stroke="#B49A52" stroke-width="2"/>' },
    { modo: 'cae', vb: '0 0 24 14', g: '<path d="M1 10C4 4.6 12 2.6 23 3.4 21.6 9 16 12.6 8.4 12.4 4.6 12.4 2 11.4 1 10z" fill="#EADDA8" stroke="#BFA65E" stroke-width=".8"/>'
      + '<rect x="6" y="4.6" width="14" height="6" rx="3" fill="#F6DC8C" transform="rotate(-8 13 7.6)"/>'
      + '<path d="M8.6 8.2 17.6 6.8" stroke="#D42A2A" stroke-width="1.8" stroke-linecap="round"/>' },
    { modo: 'flota', vb: '0 0 12 24', g: '<path d="M7 1C2 5 1 14 2.6 23h6C10 15 10.4 7 7 1z" fill="#EADCA4" stroke="#C2A85E" stroke-width=".8"/>'
      + '<path d="M6.8 4C6 10 5.6 16 5.8 22M4.6 9c-.6 4-.6 9-.2 13M8.6 9c.2 4 0 9-.6 13" stroke="#CDB572" stroke-width=".7" fill="none" stroke-linecap="round"/>' }] };
  alta('candelaria',
    { m: CANDELARIA_M, m2: CANDELARIA_M2, j: CANDELARIA_J, mov: 'brinca', mov2: 'mece', jmov: 'brinca', lluvia: CANDELARIA_LLUEVE, w: 112, w2: 80,
      dice: ['¡Tamales para todos!', '¡De rajas, por favor!', '¡Atole calientito!', '¡Con champurrado!'],
      extra: [['pt-picado', PICADO(['#F07A1E', '#F2C066', '#5BD69A', '#E8418C', '#7FB2EA']), 'left:0;right:0;top:0;height:56px']] });
  CSS_FECHAS += '.pt-candelaria-vapor{transform-box:fill-box;transform-origin:50% 100%;animation:pt-candelaria-vapor 2.2s ease-in-out infinite}.pt-candelaria-v2{animation-delay:-1.1s}'
    + '@keyframes pt-candelaria-vapor{0%{opacity:0;transform:translateY(18%) scaleY(.8)}40%{opacity:1}100%{opacity:0;transform:translateY(-22%) scaleY(1.05)}}'
    + '.pt-candelaria-humito{transform-box:fill-box;transform-origin:50% 100%;animation:pt-candelaria-humito 1.8s ease-in-out infinite}'
    + '@keyframes pt-candelaria-humito{0%,100%{opacity:.3;transform:translateY(25%)}50%{opacity:1;transform:translateY(-15%)}}';

  // Día de la Constitución (5 de febrero): el pergamino que se desenrolla, con su listón tricolor
  function CONSTITUCION_ROLLO(y) {
    return '<rect x="8" y="' + y + '" width="74" height="12" rx="6" fill="#E9D3A0"/><path d="M14 ' + (y + 3.4) + 'h62" stroke="#F7EBCB" stroke-width="2" stroke-linecap="round"/>'
      + '<ellipse cx="11" cy="' + (y + 6) + '" rx="3" ry="6" fill="#C9A75A"/><ellipse cx="79" cy="' + (y + 6) + '" rx="3" ry="6" fill="#C9A75A"/>';
  }
  var CONSTITUCION_M = { vb: '0 0 90 116', g: '<g class="pt-constitucion-hoja"><rect x="14" y="16" width="62" height="70" fill="#F7ECCF"/>'
    + '<path d="M27 29h36" stroke="#1F3864" stroke-width="3.4" stroke-linecap="round"/>'
    + '<path d="M22 39h46M22 46h46M22 53h40M22 60h46M22 67h30" stroke="#C9B48A" stroke-width="2" stroke-linecap="round"/>'
    + '<path d="M50 77c3-4 5 2 8-1s4 2 8-1" stroke="#1F3864" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>'
    + CONSTITUCION_ROLLO(8)
    + '<g class="pt-constitucion-rollo">' + CONSTITUCION_ROLLO(80)
    // el moño tricolor cuelga del rollo de abajo (su grupo mide de 80 a 116: el rollo sube 35, el 97.2 % de su alto)
    + '<path d="M41 103 34 115l4-2 2 3 5-12z" fill="#006847"/><path d="M49 103l7 12-4-2-2 3-5-12z" fill="#CE1126"/>'
    + (function () { var h = '', i, a; for (i = 0; i < 12; i++) { a = i * Math.PI / 6; h += '<circle cx="' + (45 + Math.cos(a) * 9.4).toFixed(1) + '" cy="' + (99 + Math.sin(a) * 9.4).toFixed(1) + '" r="2.6" fill="#006847"/>'; } return h; })()
    + '<circle cx="45" cy="99" r="9.6" fill="#006847"/><circle cx="45" cy="99" r="6.6" fill="#fff"/><circle cx="45" cy="99" r="3.8" fill="#CE1126"/><circle cx="45" cy="99" r="1.4" fill="#F2C066"/></g>' };
  var CONSTITUCION_M2 = { vb: '0 0 80 100', g: '<g class="pt-constitucion-pluma"><path d="M40 66 64 7" stroke="#C9D1DE" stroke-width="2" stroke-linecap="round"/>'
    + '<path d="M65 5C76 14 70 34 52 50L41 61C43 44 48 22 65 5z" fill="#FFF8EC" stroke="#C9D1DE" stroke-width="1.2"/>'
    + '<path d="M63 9c4 3 6 7 6 11M60 15c4 2 6 6 6 10" stroke="#F07A1E" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
    + '<path d="M58 22 50 26M55 30l-8 4M52 38l-7 3" stroke="#D5DCE8" stroke-width="1.2" stroke-linecap="round"/></g>'
    + '<rect x="27" y="58" width="26" height="11" rx="3" fill="#C9A75A"/>'
    + '<rect x="14" y="66" width="52" height="30" rx="9" fill="#2E5AA8"/><path d="M20 74v14" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".35"/>'
    + '<rect x="30" y="74" width="26" height="14" rx="2" fill="#F7ECCF"/><path d="M34 79h18M34 83.4h12" stroke="#C9B48A" stroke-width="1.6" stroke-linecap="round"/>' };
  var CONSTITUCION_J = { vb: '0 0 20 16', g: '<rect x="1.6" y="4.6" width="16.4" height="7.4" rx="3.7" fill="#F1DDA8" stroke="#A88B4A" stroke-width=".7"/>'
    + '<ellipse cx="16.2" cy="8.3" rx="1.6" ry="3.4" fill="#D9BE7A" stroke="#A88B4A" stroke-width=".5"/>'
    + '<path d="M7.6 4.4v7.8" stroke="#006847" stroke-width="1.4"/><path d="M9 4.4v7.8" stroke="#fff" stroke-width="1.4"/><path d="M10.4 4.4v7.8" stroke="#CE1126" stroke-width="1.4"/>'
    + '<path d="M8.2 12 6.6 15.4M9.8 12l1.6 3.4" stroke="#CE1126" stroke-width="1.2" stroke-linecap="round"/><path d="M8.2 12 6.6 15.4" stroke="#006847" stroke-width="1.2" stroke-linecap="round"/>'
    + '<path d="M7 4.6h4M7 12h4" stroke="#B9C2D0" stroke-width=".4"/>' };
  // un listón tricolor que ondea (lo usa también el Día de la Bandera); verde y rojo un poco más vivos para que se vean en el azul
  var CONSTITUCION_LISTON = { modo: 'flota', vb: '0 0 20 20', g: (function () {
    var h = '', i, c = ['#15995C', '#fff', '#E0283A'];
    for (i = 0; i < 3; i++) h += '<path d="M' + (6.4 + i * 2.4).toFixed(1) + ' 1q4 3 0 6t0 6 0 6" stroke="' + c[i] + '" stroke-width="2.5" fill="none"/>';
    return h;
  })() };
  // lo que cae al fondo de la entrada: hojitas de papel escritas, listones tricolor y rollitos con su listón
  var CONSTITUCION_LLUEVE = { n: 24, z: [13, 24], formas: [
    { modo: 'flota', vb: '0 0 16 20', g: '<path d="M2 1.5h9l3.5 3.5v13.5H2z" fill="#F7ECCF" stroke="#C9B48A" stroke-width=".7" stroke-linejoin="round"/><path d="M11 1.5V5h3.5z" fill="#D9C79C"/>'
      + '<path d="M4.4 5h4.4" stroke="#1F3864" stroke-width="1.3" stroke-linecap="round"/><path d="M4.4 8.4h7.4M4.4 11h7.4M4.4 13.6h5.4" stroke="#C9B48A" stroke-width="1" stroke-linecap="round"/>'
      + '<path d="M9 16.2c.8-1 1.4.6 2.2-.2s1 .6 1.8-.2" stroke="#1F3864" stroke-width=".7" fill="none" stroke-linecap="round"/>' },
    CONSTITUCION_LISTON,
    { modo: 'cae', vb: CONSTITUCION_J.vb, g: CONSTITUCION_J.g }] };
  alta('constitucion',
    { m: CONSTITUCION_M, m2: CONSTITUCION_M2, j: CONSTITUCION_J, mov: 'flota', mov2: 'mece', jmov: 'flota', lluvia: CONSTITUCION_LLUEVE, w: 84, w2: 80,
      dice: ['¡Viva la Constitución!', '¡Desde 1917!', '¡A firmar!', '¡Feliz 5 de febrero!'] });
  CSS_FECHAS += '.pt-constitucion-hoja{transform-box:fill-box;transform-origin:50% 0;animation:pt-constitucion-hoja 4.6s ease-in-out infinite}'
    + '@keyframes pt-constitucion-hoja{0%,8%{transform:scaleY(.5)}38%,84%{transform:scaleY(1)}100%{transform:scaleY(.5)}}'
    + '.pt-constitucion-rollo{transform-box:fill-box;animation:pt-constitucion-rollo 4.6s ease-in-out infinite}'
    + '@keyframes pt-constitucion-rollo{0%,8%{transform:translateY(-97.2%)}38%,84%{transform:translateY(0)}100%{transform:translateY(-97.2%)}}'
    + '.pt-constitucion-pluma{transform-box:fill-box;transform-origin:0 100%;animation:pt-constitucion-pluma 2s ease-in-out infinite alternate}'
    + '@keyframes pt-constitucion-pluma{from{transform:rotate(-7deg)}to{transform:rotate(5deg)}}';

  // Día de la Bandera (24 de febrero): la bandera ondeando (sin escudo: un circulito café) y el moño tricolor
  var BANDERA_M = { vb: '0 0 124 104', g: (function () {
    var h = '<rect x="6" y="6" width="5" height="96" rx="2" fill="#C9D1DE"/><circle cx="8.5" cy="6" r="5" fill="#F2C066"/>', i, x, c, d;
    // la tela en 36 tiras angostas que suben y bajan una tras otra (más cerca del asta, menos)
    for (i = 0; i < 36; i++) {
      x = 11 + i * 2.8; c = i < 12 ? '#006847' : i < 24 ? '#fff' : '#CE1126'; d = (i * .045 - 2).toFixed(3);
      h += '<g class="pt-bandera-ola pt-bandera-o' + (1 + Math.floor(i / 6)) + '" style="animation-delay:' + d + 's">'
        + '<rect x="' + x.toFixed(1) + '" y="12" width="5" height="52" fill="' + c + '"/></g>';
    }
    // el circulito café se mueve con la tela de en medio (el rectángulo sin relleno le da el mismo alto)
    return h + '<g class="pt-bandera-ola pt-bandera-o4" style="animation-delay:-1.190s"><rect x="54" y="12" width="1" height="52" fill="none"/>'
      + '<circle cx="61.4" cy="38" r="7.4" fill="#8C6A3D"/><path d="M55 42q6.4 7 12.8 0" stroke="#3E7A2E" stroke-width="2" fill="none" stroke-linecap="round"/></g>';
  })() };
  var BANDERA_M2 = { vb: '0 0 80 100', g: (function () {
    var h = '<g class="pt-bandera-cola"><path d="M34 44 18 94l8-5 6 8 12-51z" fill="#006847"/><path d="M46 44l16 50-8-5-6 8-12-51z" fill="#CE1126"/></g>', i, a;
    for (i = 0; i < 16; i++) { a = i * Math.PI / 8; h += '<circle cx="' + (40 + Math.cos(a) * 25).toFixed(1) + '" cy="' + (40 + Math.sin(a) * 25).toFixed(1) + '" r="7" fill="#006847"/>'; }
    h += '<circle cx="40" cy="40" r="26" fill="#006847"/>';
    for (i = 0; i < 12; i++) { a = i * Math.PI / 6 + .26; h += '<circle cx="' + (40 + Math.cos(a) * 16.5).toFixed(1) + '" cy="' + (40 + Math.sin(a) * 16.5).toFixed(1) + '" r="5.4" fill="#fff"/>'; }
    h += '<circle cx="40" cy="40" r="17" fill="#fff"/>';
    for (i = 0; i < 10; i++) { a = i * Math.PI / 5; h += '<circle cx="' + (40 + Math.cos(a) * 9).toFixed(1) + '" cy="' + (40 + Math.sin(a) * 9).toFixed(1) + '" r="3.6" fill="#CE1126"/>'; }
    return h + '<circle cx="40" cy="40" r="9.5" fill="#CE1126"/><circle cx="40" cy="40" r="4.4" fill="#F2C066"/>'
      + '<path d="M40 16v6M40 58v6M16 40h6M58 40h6" stroke="#004F36" stroke-width="1.4" stroke-linecap="round" opacity=".6"/>';
  })() };
  // la banderita quieta de junto a la campanita es la del motor (BANDERITA), con su orilla para el encabezado blanco
  var BANDERA_C1 = { vb: '0 0 40 34', g: BANDERITA.replace(/^<svg[^>]*>|<\/svg>$/g, '') + '<path d="M5 4h33v18H5z" fill="none" stroke="#C9D1DE" stroke-width=".8"/>' };
  // junto al signo va la banderita que ondea de las fiestas patrias (JUNTO.bandera, abajo)
  // una franja de la banderita que ondea, de x0 a x1 (sin escudo)
  function BANDERA_TELA(x0, x1, c) {
    var t = '', b = '', i, x, y;
    for (i = 0; i <= 8; i++) {
      x = x0 + (x1 - x0) * i / 8; y = 3.4 + Math.sin((x - 3) / 15 * 2 * Math.PI) * 1.4;
      t += (i ? 'L' : 'M') + x.toFixed(2) + ' ' + y.toFixed(2); b = 'L' + x.toFixed(2) + ' ' + (y + 9.4).toFixed(2) + b;
    }
    return '<path d="' + t + b + 'z" fill="' + c + '"/>';
  }
  // lo que cae al fondo de la entrada: banderitas tricolor (sin escudo), listones y moñitos tricolor
  var BANDERA_LLUEVE = { n: 24, z: [13, 25], formas: [
    { modo: 'flota', vb: '0 0 20 20', g: '<path d="M2.4 1.6v17" stroke="#C9D1DE" stroke-width="1.4" stroke-linecap="round"/><circle cx="2.4" cy="1.6" r="1.4" fill="#F2C066"/>'
      + BANDERA_TELA(3, 8.4, '#15995C') + BANDERA_TELA(8.2, 13.2, '#fff') + BANDERA_TELA(13, 18.4, '#E0283A')
      + '<circle cx="10.7" cy="' + (8.1 + Math.sin(7.7 / 15 * 2 * Math.PI) * 1.4).toFixed(2) + '" r="1.9" fill="#8C6A3D"/>' },
    CONSTITUCION_LISTON,
    { modo: 'cae', vb: '0 0 20 22', g: '<path d="M8 12 4.6 21l2.4-1.2 1.4 1.8L11 13z" fill="#15995C"/><path d="M12 12l3.4 9-2.4-1.2-1.4 1.8L9 13z" fill="#E0283A"/>'
      + '<circle cx="10" cy="9" r="8" fill="#15995C"/><circle cx="10" cy="9" r="5.6" fill="#fff"/><circle cx="10" cy="9" r="3.2" fill="#E0283A"/><circle cx="10" cy="9" r="1.1" fill="#F2C066"/>' }] };
  alta('bandera',
    { m: BANDERA_M, m2: BANDERA_M2, c1: BANDERA_C1, c2: BANDERA_M2, mov: 'flota', mov2: 'mece', lluvia: BANDERA_LLUEVE, w: 116, w2: 76,
      dice: ['¡Viva mi bandera!', '¡Verde, blanco y rojo!', '¡Con orgullo!', '¡Honores a la bandera!'] });
  JUNTO.bandera = 'banderita';
  CSS_FECHAS += '.pt-bandera-ola{transform-box:fill-box;animation:pt-bandera-o1 1.4s ease-in-out infinite}'
    + '.pt-bandera-o2{animation-name:pt-bandera-o2}.pt-bandera-o3{animation-name:pt-bandera-o3}.pt-bandera-o4{animation-name:pt-bandera-o4}'
    + '.pt-bandera-o5{animation-name:pt-bandera-o5}.pt-bandera-o6{animation-name:pt-bandera-o6}'
    + '@keyframes pt-bandera-o1{0%,100%{transform:translateY(-1.2%)}50%{transform:translateY(1.2%)}}'
    + '@keyframes pt-bandera-o2{0%,100%{transform:translateY(-2.2%)}50%{transform:translateY(2.2%)}}'
    + '@keyframes pt-bandera-o3{0%,100%{transform:translateY(-3.2%)}50%{transform:translateY(3.2%)}}'
    + '@keyframes pt-bandera-o4{0%,100%{transform:translateY(-4.2%)}50%{transform:translateY(4.2%)}}'
    + '@keyframes pt-bandera-o5{0%,100%{transform:translateY(-5.2%)}50%{transform:translateY(5.2%)}}'
    + '@keyframes pt-bandera-o6{0%,100%{transform:translateY(-6.2%)}50%{transform:translateY(6.2%)}}'
    + '.pt-bandera-cola{transform-box:fill-box;transform-origin:50% 0;animation:pt-bandera-cola 1.6s ease-in-out infinite alternate}'
    + '@keyframes pt-bandera-cola{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}';

  // Día de Pi (14 de marzo): el símbolo π y un pay de frutas (¿pi o pay?)
  var PI_TRAZO = 'M10 34Q12 22 26 22L88 20M37 23Q37 58 27 82M64 22Q62 58 66 74Q69 84 79 80';
  var PI_M = { vb: '0 0 100 96', g: '<path d="' + PI_TRAZO + '" transform="translate(3 4)" stroke="#B5561A" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<path d="' + PI_TRAZO + '" stroke="#F07A1E" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<path d="M30 20.6 80 19M34.6 30Q34 52 28 70" stroke="#FFC08A" stroke-width="3" fill="none" stroke-linecap="round"/>'
    + '<g class="pt-pi-brillo">' + ANIO_DESTELLO(90, 8, 6, '#FFE27A') + '</g><g class="pt-pi-brillo pt-pi-b2">' + ANIO_DESTELLO(8, 62, 4.5, '#7FB2EA') + '</g>' };
  var PI_M2 = { vb: '0 0 124 86', g: (function () {
    var h = '<g class="pt-pi-vapor"><path d="M44 26c-5-5 5-9 0-14s5-8 0-11" stroke="#EEF1F6" stroke-width="2.8" fill="none" stroke-linecap="round" opacity=".75"/></g>'
      + '<g class="pt-pi-vapor pt-pi-v2"><path d="M64 26c-5-5 5-9 0-14s5-8 0-11" stroke="#EEF1F6" stroke-width="2.8" fill="none" stroke-linecap="round" opacity=".75"/></g>'
      + '<path d="M10 52h90l-8 26H18z" fill="#AEB8C8"/><path d="M14 62h82" stroke="#C9D1DE" stroke-width="3"/>'
      + '<ellipse cx="55" cy="48" rx="48" ry="16" fill="#D98A3A"/>', i, a;
    for (i = 0; i < 24; i++) { a = i * Math.PI / 12; h += '<circle cx="' + (55 + Math.cos(a) * 46).toFixed(1) + '" cy="' + (48 + Math.sin(a) * 14.6).toFixed(1) + '" r="4.4" fill="#E9A552"/>'; }
    return h + '<ellipse cx="55" cy="47" rx="40" ry="11.4" fill="#EBB062"/><path d="M28 42q12-6 30-6" stroke="#F8CF86" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
      // el π recortado en la costra deja ver el relleno de frutas
      + '<path d="M44 44.4 66 43.4M50 44.2q0 5-3 8.4M60.4 43.8q-.6 5.4 2.6 8" stroke="#B3122E" stroke-width="3.8" fill="none" stroke-linecap="round"/>'
      + '<path d="M106 68c2-8 6-14 12-18M112 70c0-8 2-14 6-20" stroke="#3E7A2E" stroke-width="2" fill="none" stroke-linecap="round"/>'
      + '<path d="M117 50c3-3 7-2 8 0-3 2-6 2-8 0z" fill="#4E9A3A"/>'
      + '<circle cx="105" cy="73" r="7" fill="#C8102E"/><circle cx="114" cy="75" r="7" fill="#D6233C"/><circle cx="103" cy="70.6" r="1.8" fill="#fff" opacity=".6"/><circle cx="112" cy="72.6" r="1.8" fill="#fff" opacity=".6"/>';
  })() };
  var PI_J = { vb: '0 0 20 18', g: '<path d="M2.2 6.6Q2.6 3.8 5.4 3.8L17.8 3.4M7.6 4Q7.6 11 5.6 15.6M12.8 3.8Q12.4 11 13.2 13.8Q13.8 15.8 16 15.2" stroke="#F07A1E" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' };
  // lo que cae al fondo de la entrada: el signo π (naranja y blanco), rebanaditas de pay y el «3.14»
  var PI_LLUEVE = { n: 24, z: [14, 26], formas: [
    { modo: 'cae', vb: PI_J.vb, g: PI_J.g },
    { modo: 'cae', vb: PI_J.vb, g: PI_J.g.replace('#F07A1E', '#EEF1F6') },
    { modo: 'cae', vb: '0 0 20 20', g: '<circle cx="10" cy="10" r="7.6" fill="#C8102E"/>'
      + '<path d="M3.8 7.6h12.4M3.8 12.4h12.4M7.6 3.8v12.4M12.4 3.8v12.4" stroke="#EBB062" stroke-width="1.8"/>'
      + '<circle cx="10" cy="10" r="7.8" fill="none" stroke="#E9A552" stroke-width="2.6"/><path d="M4.4 6.4a7 7 0 0 1 4-3.6" stroke="#F8CF86" stroke-width="1" fill="none" stroke-linecap="round"/>' },
    { modo: 'flota', vb: '0 0 28 14', g: '<text x="14" y="11.4" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="12.5" font-weight="700" fill="#F2C066">3.14</text>' }] };
  alta('pi',
    { m: PI_M, m2: PI_M2, j: PI_J, mov: 'brinca', mov2: 'flota', jmov: 'brinca', lluvia: PI_LLUEVE, w: 92, w2: 112,
      dice: ['¡3.14159…!', '¡Soy irracional!', '¿Pi o pay? ¡Los dos!', '¡Rebanada de pay!'] });
  CSS_FECHAS += '.pt-pi-brillo{transform-box:fill-box;transform-origin:50% 50%;animation:pt-pi-brillo 1.5s ease-in-out infinite}.pt-pi-b2{animation-delay:-.75s}'
    + '@keyframes pt-pi-brillo{0%,100%{opacity:.25;transform:scale(.5) rotate(0)}50%{opacity:1;transform:scale(1.1) rotate(45deg)}}'
    + '.pt-pi-vapor{transform-box:fill-box;transform-origin:50% 100%;animation:pt-pi-vapor 2.2s ease-in-out infinite}.pt-pi-v2{animation-delay:-1.1s}'
    + '@keyframes pt-pi-vapor{0%{opacity:0;transform:translateY(18%) scaleY(.8)}40%{opacity:1}100%{opacity:0;transform:translateY(-22%) scaleY(1.05)}}';

  // Día de la Felicidad (20 de marzo): una carita sonriente que brinca y un sol contento
  // una carita con su copete que levanta los brazos y saluda (personaje propio, no un emoji)
  var FELICIDAD_M = { vb: '0 0 112 100', g: '<path d="M26 64 8 30" stroke="#F2B01E" stroke-width="7" stroke-linecap="round"/><circle cx="7" cy="26" r="6.4" fill="#FFD23F" stroke="#F2B01E" stroke-width="2"/>'
    + '<g class="pt-felicidad-mano"><path d="M86 64 104 30" stroke="#F2B01E" stroke-width="7" stroke-linecap="round"/><circle cx="105" cy="26" r="6.4" fill="#FFD23F" stroke="#F2B01E" stroke-width="2"/></g>'
    + '<path d="M51 22c-4-8 3-15 10-11 4 3 1 8-3 6" stroke="#F2B01E" stroke-width="3.4" fill="none" stroke-linecap="round"/>'
    + '<circle cx="56" cy="59" r="38" fill="#FFD23F" stroke="#F2B01E" stroke-width="2.6"/>'
    + '<path d="M33 54q7-9 14 0M65 54q7-9 14 0" stroke="#5A3A10" stroke-width="4.4" fill="none" stroke-linecap="round"/>'
    + '<path d="M38 66q18 24 36 0z" fill="#8C2F1E" stroke="#8C2F1E" stroke-width="2.4" stroke-linejoin="round"/><path d="M46 76c4-5 16-5 20 0-4 4.6-16 4.6-20 0z" fill="#F07A8A"/>'
    + '<g class="pt-felicidad-cachete"><circle cx="29" cy="67" r="6" fill="#F28A5A" opacity=".6"/><circle cx="83" cy="67" r="6" fill="#F28A5A" opacity=".6"/></g>' };
  var FELICIDAD_M2 = { vb: '0 0 100 100', g: (function () {
    var h = '<g class="pt-felicidad-rayos">', i, a, b, l;
    for (i = 0; i < 12; i++) {
      a = i * Math.PI / 6; b = .2; l = i % 2 ? 42 : 48;
      h += '<path d="M' + (50 + Math.cos(a - b) * 30).toFixed(1) + ' ' + (50 + Math.sin(a - b) * 30).toFixed(1) + 'L' + (50 + Math.cos(a) * l).toFixed(1) + ' ' + (50 + Math.sin(a) * l).toFixed(1)
        + 'L' + (50 + Math.cos(a + b) * 30).toFixed(1) + ' ' + (50 + Math.sin(a + b) * 30).toFixed(1) + 'z" fill="' + (i % 2 ? '#F9A51E' : '#F07A1E') + '" stroke="' + (i % 2 ? '#F9A51E' : '#F07A1E') + '" stroke-width="3" stroke-linejoin="round"/>';
    }
    return h + '</g><circle cx="50" cy="50" r="29" fill="#FFC23F"/><circle cx="50" cy="50" r="25" fill="#FFD23F"/>'
      + '<ellipse cx="41" cy="46" rx="3.4" ry="4.4" fill="#5A3A10"/><ellipse cx="59" cy="46" rx="3.4" ry="4.4" fill="#5A3A10"/>'
      + '<circle cx="42.2" cy="44.6" r="1.2" fill="#fff"/><circle cx="60.2" cy="44.6" r="1.2" fill="#fff"/>'
      + '<path d="M40 57q10 10 20 0" stroke="#5A3A10" stroke-width="3.4" fill="none" stroke-linecap="round"/>'
      + '<circle cx="33" cy="55" r="4" fill="#F28A5A" opacity=".55"/><circle cx="67" cy="55" r="4" fill="#F28A5A" opacity=".55"/>';
  })() };
  var FELICIDAD_J = { vb: '0 0 22 20', g: '<path d="M5.6 12.4 2.4 6.6M16.4 12.4l3.2-5.8" stroke="#D99A00" stroke-width="1.7" stroke-linecap="round"/>'
    + '<circle cx="2.2" cy="5.8" r="1.5" fill="#FFD23F" stroke="#D99A00" stroke-width=".6"/><circle cx="19.8" cy="5.8" r="1.5" fill="#FFD23F" stroke="#D99A00" stroke-width=".6"/>'
    + '<path d="M10.2 4.6c-.9-1.8.6-3.3 2.1-2.4.9.6.2 1.7-.6 1.3" stroke="#D99A00" stroke-width=".9" fill="none" stroke-linecap="round"/>'
    + '<circle cx="11" cy="12" r="7.4" fill="#FFD23F" stroke="#D99A00" stroke-width=".8"/>'
    + '<path d="M7 11q1.3-1.8 2.6 0M12.4 11q1.3-1.8 2.6 0" stroke="#6B4410" stroke-width="1.1" fill="none" stroke-linecap="round"/>'
    + '<path d="M7.8 13.4q3.2 4.6 6.4 0z" fill="#9C3420" stroke="#9C3420" stroke-width=".5" stroke-linejoin="round"/>'
    + '<circle cx="5.6" cy="13.6" r="1.1" fill="#F28A5A" opacity=".7"/><circle cx="16.4" cy="13.6" r="1.1" fill="#F28A5A" opacity=".7"/>' };
  // lo que cae al fondo de la entrada: caritas felices (dos gestos, propias) y soles chiquitos
  var FELICIDAD_CACHETES = '<circle cx="4.8" cy="12" r="1.4" fill="#F28A5A" opacity=".7"/><circle cx="15.2" cy="12" r="1.4" fill="#F28A5A" opacity=".7"/>';
  var FELICIDAD_LLUEVE = { n: 24, z: [13, 24], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: '<circle cx="10" cy="10" r="8.6" fill="#FFD23F" stroke="#F2B01E" stroke-width="1"/>'
      + '<path d="M5.6 8.8q1.4-1.9 2.8 0M11.6 8.8q1.4-1.9 2.8 0" stroke="#5A3A10" stroke-width="1.3" fill="none" stroke-linecap="round"/>'
      + '<path d="M6.2 11.4q3.8 5.2 7.6 0z" fill="#8C2F1E" stroke="#8C2F1E" stroke-width=".8" stroke-linejoin="round"/>' + FELICIDAD_CACHETES },
    { modo: 'cae', vb: '0 0 20 20', g: '<circle cx="10" cy="10" r="8.6" fill="#FFC23F" stroke="#F09A1E" stroke-width="1"/>'
      + '<ellipse cx="7.2" cy="8.2" rx="1.1" ry="1.5" fill="#5A3A10"/><ellipse cx="12.8" cy="8.2" rx="1.1" ry="1.5" fill="#5A3A10"/>'
      + '<path d="M6.4 11.6q3.6 3.8 7.2 0" stroke="#5A3A10" stroke-width="1.3" fill="none" stroke-linecap="round"/>' + FELICIDAD_CACHETES },
    { modo: 'cae', vb: '0 0 20 20', g: (function () {
      var h = '', i, a, b = .32;
      for (i = 0; i < 8; i++) {
        a = i * Math.PI / 4;
        h += '<path d="M' + (10 + Math.cos(a - b) * 5.6).toFixed(2) + ' ' + (10 + Math.sin(a - b) * 5.6).toFixed(2) + 'L' + (10 + Math.cos(a) * 9.6).toFixed(2) + ' ' + (10 + Math.sin(a) * 9.6).toFixed(2)
          + 'L' + (10 + Math.cos(a + b) * 5.6).toFixed(2) + ' ' + (10 + Math.sin(a + b) * 5.6).toFixed(2) + 'z" fill="' + (i % 2 ? '#F9A51E' : '#F07A1E') + '"/>';
      }
      return h + '<circle cx="10" cy="10" r="5.8" fill="#FFC23F"/><circle cx="10" cy="10" r="4.6" fill="#FFD23F"/><path d="M7.6 8.6q1-1.4 2.4-1.6" stroke="#fff" stroke-width="1" fill="none" stroke-linecap="round" opacity=".7"/>';
    })() }] };
  alta('felicidad',
    { m: FELICIDAD_M, m2: FELICIDAD_M2, j: FELICIDAD_J, mov: 'brinca', mov2: 'flota', jmov: 'brinca', lluvia: FELICIDAD_LLUEVE, w: 104, w2: 100,
      dice: ['¡Sonríe!', '¡Qué buen día!', '¡Brilla como el sol!', '¡Feliz, feliz!'] });
  CSS_FECHAS += '.pt-felicidad-rayos{transform-box:fill-box;transform-origin:50% 50%;animation:pt-felicidad-rayos 14s linear infinite}@keyframes pt-felicidad-rayos{to{transform:rotate(360deg)}}'
    + '.pt-felicidad-cachete{animation:pt-felicidad-cachete 1.7s ease-in-out infinite}@keyframes pt-felicidad-cachete{50%{opacity:.55}}'
    + '.pt-felicidad-mano{transform-box:fill-box;transform-origin:0 100%;animation:pt-felicidad-mano .9s ease-in-out infinite alternate}'
    + '@keyframes pt-felicidad-mano{from{transform:rotate(-10deg)}to{transform:rotate(14deg)}}';

  // Inicio de la primavera (21 de marzo): flores y una mariposa que vuela aleteando
  function PRIMAVERA_MARGARITA(x, y, r, c, cc) {
    var h = '', i;
    for (i = 0; i < 10; i++) h += '<ellipse cx="' + x + '" cy="' + (y - r * .55) + '" rx="' + (r * .28).toFixed(1) + '" ry="' + (r * .5).toFixed(1) + '" transform="rotate(' + (i * 36) + ' ' + x + ' ' + y + ')"/>';
    return '<g fill="' + c + '" stroke="#E2E6EE" stroke-width=".6">' + h + '</g><circle cx="' + x + '" cy="' + y + '" r="' + (r * .32).toFixed(1) + '" fill="' + cc + '"/>';
  }
  var PRIMAVERA_M = { vb: '0 0 100 100', g: '<g stroke="#3E7A2E" stroke-width="3.4" fill="none" stroke-linecap="round"><path d="M30 88Q26 62 28 44M53 86Q57 58 54 36M75 88Q80 68 78 54"/></g>'
    + '<path d="M28 70c-8-4-14-2-16 4 8 2 12 0 16-4zM55 64c8-5 14-3 17 2-8 3-13 2-17-2zM77 76c6-6 12-6 15-2-6 4-11 5-15 2z" fill="#4E9A3A"/>'
    + '<g class="pt-primavera-cabeza">' + PRIMAVERA_MARGARITA(28, 38, 17, '#FFF8EC', '#FFC23F') + '</g>'
    + '<g class="pt-primavera-cabeza pt-primavera-c2"><path d="M44 22c0 11 4 17 10 17s10-6 10-17l-5 5-5-9-5 9z" fill="#E8418C"/><path d="M54 18l5 9-5 12-5-12z" fill="#F06AA6"/></g>'
    + '<g class="pt-primavera-cabeza pt-primavera-c3">' + PRIMAVERA_MARGARITA(78, 48, 13, '#F07A1E', '#FFE27A') + '</g>'
    + '<path d="M4 98c4-14 22-20 46-20s42 6 46 20z" fill="#3E9A3A"/><path d="M12 90l3-7 3 7M80 90l3-7 3 7M44 86l3-6 3 6" stroke="#5BBF3A" stroke-width="2" fill="none" stroke-linejoin="round"/>' };
  function PRIMAVERA_ALAS(lado) {
    // lado 1: la izquierda; -1: la derecha (espejo)
    var t = lado > 0 ? '' : ' transform="matrix(-1 0 0 1 100 0)"';
    return '<g class="pt-primavera-ala' + (lado > 0 ? '' : ' pt-primavera-ad') + '"><g' + t + '><path d="M48 40C38 14 12 6 6 18c-6 12 10 26 42 24z" fill="#F07A1E"/>'
      + '<path d="M48 44C30 46 15 56 19 68c4 10 21 6 29-20z" fill="#4FA3E0"/>'
      + '<circle cx="21" cy="22" r="5.4" fill="#FFD23F"/><circle cx="33" cy="30" r="3" fill="#FFD23F"/><circle cx="29" cy="60" r="3.6" fill="#fff"/></g></g>';
  }
  var PRIMAVERA_M2 = { vb: '0 0 100 84', g: PRIMAVERA_ALAS(1) + PRIMAVERA_ALAS(-1)
    + '<path d="M48 18c-4-8-8-11-13-11M52 18c4-8 8-11 13-11" stroke="#4A3470" stroke-width="2" fill="none" stroke-linecap="round"/>'
    + '<circle cx="35" cy="7" r="2.6" fill="#E8418C"/><circle cx="65" cy="7" r="2.6" fill="#E8418C"/>'
    + '<ellipse cx="50" cy="46" rx="4.6" ry="21" fill="#4A3470"/><circle cx="50" cy="22" r="5.6" fill="#4A3470"/>' };
  var PRIMAVERA_J = { vb: '0 0 20 16', g: '<g class="pt-primavera-ala"><path d="M9.4 7.6C7.6 2.4 2.4.8 1.2 3.2-.1 5.6 3 8.4 9.4 8z" fill="#F07A1E"/><path d="M9.4 8.6C5.8 9 3 11 3.8 13.4c.8 2 4.2 1.2 5.6-4.8z" fill="#2E86DE"/></g>'
    + '<g class="pt-primavera-ala pt-primavera-ad"><path d="M10.6 7.6C12.4 2.4 17.6.8 18.8 3.2c1.3 2.4-1.8 5.2-8.2 4.8z" fill="#F07A1E"/><path d="M10.6 8.6c3.6.4 6.4 2.4 5.6 4.8-.8 2-4.2 1.2-5.6-4.8z" fill="#2E86DE"/></g>'
    + '<ellipse cx="10" cy="9" rx="1.1" ry="4.6" fill="#4A3F7A"/><path d="M9.6 4.4 8 1.6M10.4 4.4 12 1.6" stroke="#4A3F7A" stroke-width=".7" stroke-linecap="round"/>' };
  // lo que cae al fondo de la entrada: florecitas rosas, margaritas, pétalos y hojitas
  var PRIMAVERA_LLUEVE = { n: 26, z: [12, 23], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: (function () {
      var h = '<g fill="#F29BC4" stroke="#E8418C" stroke-width=".6">', i;
      for (i = 0; i < 5; i++) h += '<ellipse cx="10" cy="5.2" rx="3.6" ry="4.6" transform="rotate(' + (i * 72) + ' 10 10)"/>';
      return h + '</g><circle cx="10" cy="10" r="2.8" fill="#FFD23F"/><circle cx="9.2" cy="9.2" r=".8" fill="#fff" opacity=".7"/>';
    })() },
    { modo: 'cae', vb: '0 0 20 20', g: PRIMAVERA_MARGARITA(10, 10, 9.2, '#FFF8EC', '#FFC23F') },
    { modo: 'flota', vb: '0 0 14 20', g: '<path d="M7 1C2 6 2 13 7 19c5-6 5-13 0-18z" fill="#F7A8C8"/><path d="M7 4.6v11" stroke="#FCD6E6" stroke-width="1" stroke-linecap="round"/>' },
    { modo: 'flota', vb: '0 0 20 20', g: '<path d="M3 17C2 9 8 3 17 3c1 9-5 15-14 14z" fill="#5BBF3A"/><path d="M3.6 16.4 14 6" stroke="#B5E69A" stroke-width="1.1" stroke-linecap="round"/>' }] };
  alta('primavera',
    { m: PRIMAVERA_M, m2: PRIMAVERA_M2, j: PRIMAVERA_J, mov: 'mece', mov2: 'vuela', jmov: 'vuela', lluvia: PRIMAVERA_LLUEVE, w: 100, w2: 96,
      dice: ['¡Llegó la primavera!', '¡Huele a flores!', '¡A volar!', '¡Qué colores!'] });
  CSS_FECHAS += '.pt-primavera-ala{transform-box:fill-box;transform-origin:100% 50%;animation:pt-primavera-ala .42s ease-in-out infinite alternate}.pt-primavera-ad{transform-origin:0 50%}'
    + '@keyframes pt-primavera-ala{from{transform:scaleX(1)}to{transform:scaleX(.35)}}'
    + '.pt-primavera-cabeza{transform-box:fill-box;transform-origin:50% 100%;animation:pt-primavera-cabeza 2.4s ease-in-out infinite alternate}'
    + '.pt-primavera-c2{animation-delay:-.8s}.pt-primavera-c3{animation-delay:-1.6s}@keyframes pt-primavera-cabeza{from{transform:rotate(-7deg)}to{transform:rotate(7deg)}}';

  // Día del Agua (22 de marzo): una gotita con carita que rebota y un vaso de agua
  var AGUA_M = { vb: '0 0 80 100', g: '<path d="M40 4C34 16 10 42 10 64a30 30 0 0 0 60 0C70 42 46 16 40 4z" fill="#4FB3F0"/>'
    + '<path d="M70 64a30 30 0 0 1-30 30c16-5 24-18 22-38 4 3 8 5 8 8z" fill="#2E8FD6" opacity=".55"/>'
    + '<path d="M20 58c1-10 7-20 13-28" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>'
    + '<g class="pt-agua-ojos"><ellipse cx="31" cy="62" rx="4.2" ry="5.6" fill="#1F3864"/><ellipse cx="51" cy="62" rx="4.2" ry="5.6" fill="#1F3864"/>'
    + '<circle cx="32.4" cy="60.2" r="1.5" fill="#fff"/><circle cx="52.4" cy="60.2" r="1.5" fill="#fff"/></g>'
    + '<path d="M34 74q7 7 14 0" stroke="#1F3864" stroke-width="3" fill="none" stroke-linecap="round"/>'
    + '<circle cx="23" cy="71" r="3.6" fill="#F29BC4" opacity=".7"/><circle cx="59" cy="71" r="3.6" fill="#F29BC4" opacity=".7"/>' };
  var AGUA_M2 = { vb: '0 0 72 100', g: (function () {
    var h = '<path d="M38 72 46 7l9-5" stroke="#F07A1E" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
      + '<path d="M8 14h54l-6 82H14z" fill="#DDEBF7" opacity=".2"/>'
      + '<path d="M9.9 40h50.2L56 96H14z" fill="#4FB3F0" opacity=".88"/><ellipse cx="35" cy="40" rx="25" ry="3.4" fill="#8FD0F7"/>'
      + '<rect x="18" y="44" width="13" height="13" rx="3" transform="rotate(-12 24.5 50.5)" fill="#fff" opacity=".7"/>'
      + '<rect x="35" y="50" width="12" height="12" rx="3" transform="rotate(14 41 56)" fill="#fff" opacity=".6"/>', i, b = [[22, 88, 0], [44, 84, -.7], [32, 90, -1.4], [50, 90, -2.1]];
    for (i = 0; i < b.length; i++) h += '<g class="pt-agua-burb" style="animation-delay:' + b[i][2] + 's"><circle cx="' + b[i][0] + '" cy="' + b[i][1] + '" r="1.9" fill="#E6F5FF"/></g>';
    return h + '<path d="M8 14h54l-6 82H14z" fill="none" stroke="#DDEBF7" stroke-width="2.6" stroke-linejoin="round"/>'
      + '<path d="M16 22l4 66" stroke="#fff" stroke-width="3" opacity=".45" stroke-linecap="round"/>';
  })() };
  var AGUA_J = { vb: '0 0 16 20', g: '<path d="M8 .8C6.6 3.4 1.8 8.4 1.8 12.6a6.2 6.2 0 0 0 12.4 0C14.2 8.4 9.4 3.4 8 .8z" fill="#3BA3E8" stroke="#1F78C0" stroke-width=".6"/>'
    + '<path d="M4.2 11.6c.2-2 1.2-3.8 2.4-5.2" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".7"/>'
    + '<circle cx="6.2" cy="12.4" r="1" fill="#14325E"/><circle cx="9.8" cy="12.4" r="1" fill="#14325E"/>'
    + '<path d="M6.4 14.6q1.6 1.5 3.2 0" stroke="#14325E" stroke-width=".9" fill="none" stroke-linecap="round"/>' };
  // lo que gotea al fondo de la entrada: gotas de agua de tres tonos y tamaños, con su brillo
  function AGUA_GOTA(c, s) {
    return { modo: 'gotea', vb: '0 0 14 20', g: '<path d="M7 1C5 6 2 9 2 13a5 5 0 0 0 10 0c0-4-3-7-5-12z" fill="' + c + '"/>'
      + '<path d="M12 13a5 5 0 0 1-5 5c3-1.4 4-4 3.6-7.6.8.8 1.4 1.6 1.4 2.6z" fill="' + s + '" opacity=".6"/>'
      + '<path d="M4.6 12.6c0-1.8.8-3.4 1.8-4.8" stroke="#fff" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".8"/>' };
  }
  var AGUA_LLUEVE = { n: 26, z: [10, 22], formas: [AGUA_GOTA('#4FB3F0', '#2E8FD6'), AGUA_GOTA('#8FD3F8', '#4FB3F0'),
    { modo: 'gotea', vb: '0 0 10 20', g: '<path d="M5 1C4.2 7 2 10 2 14a3 3 0 0 0 6 0c0-4-2.2-7-3-13z" fill="#6CC4F4"/>'
      + '<path d="M3.6 13.6c0-1.2.4-2.4 1-3.4" stroke="#fff" stroke-width="1" fill="none" stroke-linecap="round" opacity=".8"/>' }] };
  alta('agua',
    { m: AGUA_M, m2: AGUA_M2, j: AGUA_J, mov: 'brinca', mov2: 'mece', jmov: 'brinca', lluvia: AGUA_LLUEVE, w: 84, w2: 72,
      dice: ['¡Toma agüita!', '¡Plic, ploc!', '¡Bien fresquita!', '¡Cuida el agua!'] });
  CSS_FECHAS += '.pt-agua-ojos{transform-box:fill-box;transform-origin:50% 50%;animation:pt-agua-ojos 3.4s ease-in-out infinite}'
    + '@keyframes pt-agua-ojos{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}'
    + '.pt-agua-burb{transform-box:fill-box;transform-origin:50% 50%;animation:pt-agua-burb 2.8s ease-in infinite}'
    + '@keyframes pt-agua-burb{0%{transform:translateY(0);opacity:0}15%{opacity:.9}85%{opacity:.9}100%{transform:translateY(-1150%);opacity:0}}';

  // Día del Waffle (25 de marzo): el waffle con mantequilla y miel que escurre, y el tarro de miel
  // una gota de miel que cuelga de (x, y)
  function WAFFLE_GOTA(x, y, r, c) {
    var f = function (v) { return +(v * r).toFixed(2); };
    return '<path d="M' + x + ' ' + y + 'c' + f(-1) + ' ' + f(1.2) + ' ' + f(-1.4) + ' ' + f(2) + ' ' + f(-1.4) + ' ' + f(2.7) + 'a' + f(1.4) + ' ' + f(1.4) + ' 0 0 0 ' + f(2.8) + ' 0c0 '
      + f(-.7) + ' ' + f(-.4) + ' ' + f(-1.5) + ' ' + f(-1.4) + ' ' + f(-2.7) + 'z" fill="' + (c || '#F2A007') + '"/>';
  }
  var WAFFLE_M = { vb: '0 0 104 92', g: (function () {
    var h = '<ellipse cx="52" cy="78" rx="48" ry="11" fill="#EEF1F6"/><ellipse cx="52" cy="77" rx="36" ry="7" fill="#DDE3EC"/>'
      + '<rect x="16" y="30" width="72" height="44" rx="10" fill="#C9822F"/><rect x="16" y="24" width="72" height="44" rx="10" fill="#E8A94A"/>', i, j;
    for (i = 0; i < 4; i++) for (j = 0; j < 3; j++) h += '<rect x="' + (22 + i * 16.5) + '" y="' + (30 + j * 12.5) + '" width="13" height="9" rx="2" fill="#C9822F"/>';
    return h + '<path d="M28 44c-2-8 10-12 22-12s26 2 26 10c0 5-5 8-8 10v13c0 3.4-4.4 3.4-4.4 0V54c-7 2-16 2-24 0-5-1.4-10-5-11.6-10z" fill="#E88A00" stroke="#B86A00" stroke-width="1"/>'
      + '<path d="M66 54v9" stroke="#FFC24A" stroke-width="1.6" stroke-linecap="round"/>'
      + '<g class="pt-waffle-gota">' + WAFFLE_GOTA(65.8, 67, 2.4, '#E88A00') + '</g>'
      + '<rect x="40" y="33" width="22" height="15" rx="3" fill="#FFE9A0"/><rect x="40" y="33" width="22" height="5" rx="2.5" fill="#FFF6CC"/>'
      + '<path d="M34 40q4-3 9-3" stroke="#FFD36B" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
  })() };
  var WAFFLE_M2 = { vb: '0 0 84 100', g: '<path d="M36 34 62 4" stroke="#B9661F" stroke-width="4.4" stroke-linecap="round"/>'
    + '<g transform="rotate(-41 34 30)"><rect x="26" y="20" width="16" height="20" rx="6" fill="#D98A3A"/><path d="M26 25h16M26 30h16M26 35h16" stroke="#A9581A" stroke-width="1.6"/></g>'
    + '<g class="pt-waffle-gota pt-waffle-g2">' + WAFFLE_GOTA(31, 38, 2.6) + '</g>'
    + '<path d="M14 44c-6 10-6 36 0 46 4 6 14 8 26 8s22-2 26-8c6-10 6-36 0-46z" fill="#F2A007"/>'
    + '<path d="M20 52c-3 10-3 26 0 34" stroke="#FFD36B" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"/>'
    + '<rect x="10" y="38" width="60" height="10" rx="5" fill="#C9822F"/><path d="M20 47v8a3 3 0 0 0 6 0v-8zM56 47v5a2.6 2.6 0 0 0 5.2 0v-5z" fill="#E08E00"/>'
    + '<rect x="26" y="60" width="30" height="22" rx="4" fill="#FFF3D6"/><path d="M41 63.4l6 3.5v7l-6 3.5-6-3.5v-7z" fill="#F2A007" stroke="#C9822F" stroke-width="1.4"/>' };
  var WAFFLE_J = { vb: '0 0 20 18', g: '<rect x="1.6" y="1.6" width="16.8" height="13" rx="3" fill="#E8A94A" stroke="#A86414" stroke-width=".7"/>'
    + '<path d="M7.2 2v12.2M12.8 2v12.2M2 6h16M2 10.2h16" stroke="#B9701F" stroke-width="1"/>'
    + '<path d="M8.6 1.8h6.6c1.4 0 2.6 1 2.6 2.4v6.6a1.2 1.2 0 0 1-2.4 0V6.2c-2.6.4-5 0-6.8-1.6-.8-.8-.8-2.8 0-2.8z" fill="#F29A07" stroke="#B9700F" stroke-width=".4"/>'
    + '<g class="pt-waffle-gota"><circle cx="16.6" cy="13.6" r="1.05" fill="#F29A07" stroke="#B9700F" stroke-width=".3"/></g>' };
  // lo que cae al fondo de la entrada: cuadritos de mantequilla, gotas de miel y fresas
  var WAFFLE_LLUEVE = { n: 24, z: [13, 24], formas: [
    { modo: 'cae', vb: '0 0 20 14', g: '<rect x="2" y="3" width="16" height="9" rx="2.2" fill="#FFE07A"/><rect x="2" y="3" width="16" height="3.4" rx="1.7" fill="#FFF1B0"/><path d="M4 11.4h12" stroke="#E9B949" stroke-width="1"/>' },
    { modo: 'gotea', vb: '0 0 14 20', g: '<path d="M7 1C5 6 2 9 2 13a5 5 0 0 0 10 0c0-4-3-7-5-12z" fill="#F2A31B"/><path d="M5 12.5a2.2 2.2 0 0 0 1.6 2.6" stroke="#FFD27A" stroke-width="1.2" fill="none" stroke-linecap="round"/>' },
    { modo: 'flota', vb: '0 0 20 20', g: '<path d="M10 5c-5 0-8 3-7 7 1 4 5 7 7 7s6-3 7-7c1-4-2-7-7-7z" fill="#E8334A"/><path d="M6 4l4 2 4-2-2 3h-4z" fill="#3E9A3A"/><g fill="#FFE07A"><circle cx="7" cy="10" r=".7"/><circle cx="12" cy="9.5" r=".7"/><circle cx="9.5" cy="13" r=".7"/><circle cx="13" cy="13.5" r=".7"/><circle cx="6.5" cy="14" r=".7"/></g>' }] };
  alta('waffle',
    { m: WAFFLE_M, m2: WAFFLE_M2, j: WAFFLE_J, mov: 'brinca', mov2: 'mece', jmov: 'brinca', lluvia: WAFFLE_LLUEVE, w: 104, w2: 80,
      dice: ['¡Con miel, por favor!', '¡Calientito!', '¡Pura miel!', '¡A desayunar!'] });
  CSS_FECHAS += '.pt-waffle-gota{transform-box:fill-box;transform-origin:50% 0;animation:pt-waffle-gota 2s ease-in infinite}.pt-waffle-g2{animation-delay:-1s}'
    + '@keyframes pt-waffle-gota{0%{transform:scale(.3);opacity:0}25%{transform:scale(1);opacity:1}55%{transform:translateY(0) scale(1,1.15)}90%{transform:translateY(200%);opacity:1}100%{transform:translateY(230%);opacity:0}}';

  // Día del Taco (31 de marzo): un taco que brinca y el molcajete con salsa y limones
  // el taco de lado y un poco inclinado: atrás se ve la orilla de la tortilla, en medio el relleno y enfrente su carita
  var TACO_M = { vb: '0 0 112 86', g: '<g transform="rotate(-6 56 46)">'
    + '<path d="M4 38Q56 -2 108 38z" fill="#E0A845"/><path d="M4 38Q56 -2 108 38" stroke="#C98A2A" stroke-width="2" fill="none"/>'
    + '<path d="M8 40C11 32 17 33 21 29c4-5 10 1 14-3s10 2 14-2 10 2 14-1 10 3 14 0 10 3 13 1c5-1 9 5 8 10z" fill="#5BBF3A"/>'
    + '<path d="M14 36c4-4 8-2 12-5M44 31c4-2 8 0 12-2M76 31c4 0 8-1 12 2" stroke="#3E9A2E" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
    + '<g fill="#8B4A26"><rect x="16" y="30" width="10" height="8" rx="3"/><rect x="38" y="27" width="11" height="9" rx="3"/><rect x="62" y="26" width="10" height="9" rx="3"/><rect x="84" y="29" width="10" height="8" rx="3"/></g>'
    + '<g fill="#E03A2A"><rect x="28" y="27" width="6" height="6" rx="1.4"/><rect x="52" y="24" width="6" height="6" rx="1.4"/><rect x="74" y="26" width="6" height="6" rx="1.4"/></g>'
    + '<g fill="#FFF8EC"><rect x="46" y="32" width="5" height="4" rx="1"/><rect x="22" y="26" width="4" height="4" rx="1"/><rect x="92" y="25" width="4" height="4" rx="1"/></g>'
    + '<g fill="#2E7A2E"><circle cx="34" cy="35" r="1.6"/><circle cx="58" cy="32" r="1.6"/><circle cx="80" cy="34" r="1.6"/><circle cx="96" cy="35" r="1.6"/></g>'
    + '<path d="M4 38A52 42 0 0 0 108 38z" fill="#F2C066"/><path d="M4 38A52 42 0 0 0 108 38" stroke="#D9A43A" stroke-width="2.4" fill="none"/>'
    + '<path d="M6 38h100" stroke="#F8D88A" stroke-width="2.6" stroke-linecap="round"/>'
    + '<g fill="#DDA448" opacity=".7"><ellipse cx="22" cy="50" rx="3" ry="2"/><ellipse cx="88" cy="52" rx="3.4" ry="2"/><ellipse cx="56" cy="73" rx="3" ry="1.8"/><ellipse cx="34" cy="66" rx="2" ry="1.4"/><ellipse cx="80" cy="67" rx="2.2" ry="1.4"/></g>'
    + '<g class="pt-taco-ojos"><ellipse cx="45" cy="52" rx="3.4" ry="4.4" fill="#5A3A10"/><ellipse cx="67" cy="52" rx="3.4" ry="4.4" fill="#5A3A10"/></g>'
    + '<circle cx="46.2" cy="50.6" r="1.2" fill="#fff"/><circle cx="68.2" cy="50.6" r="1.2" fill="#fff"/>'
    + '<path d="M50 61q6 6 12 0" stroke="#5A3A10" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
    + '<circle cx="37" cy="60" r="3.4" fill="#F07A1E" opacity=".45"/><circle cx="75" cy="60" r="3.4" fill="#F07A1E" opacity=".45"/></g>' };
  function TACO_LIMON(x, y, r) {
    var h = '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#3E9A3A"/><circle cx="' + x + '" cy="' + y + '" r="' + (r * .82).toFixed(1) + '" fill="#C8EE7A"/>', i, a;
    for (i = 0; i < 6; i++) { a = i * Math.PI / 3; h += '<path d="M' + x + ' ' + y + 'L' + (x + Math.cos(a) * r * .74).toFixed(1) + ' ' + (y + Math.sin(a) * r * .74).toFixed(1) + '" stroke="#EAF9C0" stroke-width="1.3"/>'; }
    return h + '<circle cx="' + x + '" cy="' + y + '" r="1.4" fill="#EAF9C0"/>';
  }
  var TACO_M2 = { vb: '0 0 128 86', g: '<path d="M26 70 22 82M50 74v9M74 70l4 12" stroke="#5A6478" stroke-width="7" stroke-linecap="round"/>'
    + '<path d="M8 40c0 22 18 36 42 36s42-14 42-36z" fill="#6B7894"/><g fill="#5A6478"><circle cx="24" cy="54" r="1.6"/><circle cx="40" cy="64" r="1.6"/><circle cx="62" cy="62" r="1.6"/><circle cx="76" cy="52" r="1.6"/><circle cx="52" cy="54" r="1.4"/></g>'
    + '<ellipse cx="50" cy="40" rx="42" ry="10" fill="#8A96B0"/><ellipse cx="50" cy="40" rx="36" ry="7.4" fill="#C8102E"/>'
    + '<g fill="#E8513A"><circle cx="34" cy="39" r="2"/><circle cx="58" cy="42" r="2.2"/><circle cx="70" cy="38" r="1.8"/></g><g fill="#3E9A3A"><circle cx="44" cy="37" r="1.4"/><circle cx="64" cy="43" r="1.4"/><circle cx="28" cy="42" r="1.2"/></g>'
    + '<path d="M60 38 82 8" stroke="#7F8BA6" stroke-width="9" stroke-linecap="round"/><path d="M64 30 80 9" stroke="#9AA6BE" stroke-width="2.4" stroke-linecap="round"/>'
    + TACO_LIMON(114, 62, 10) + TACO_LIMON(100, 70, 12) };
  var TACO_J = { vb: '0 0 20 16', g: '<path d="M1.2 7.6Q10 .4 18.8 7.6z" fill="#E0A845" stroke="#B9800F" stroke-width=".6" stroke-linejoin="round"/>'
    + '<path d="M2.6 8.2C3.4 6 5.4 6.8 6.4 5.6 7.6 4.2 9 5.8 10.2 4.8 11.4 3.8 12.8 5.6 14.2 4.8c1.4-.8 2.8.8 3.2 2.4.3 1 0 1.4-.4 1.2z" fill="#4CAF3A"/>'
    + '<circle cx="7" cy="6.4" r="1.1" fill="#E03A2A"/><circle cx="12.8" cy="6" r="1.1" fill="#E03A2A"/><circle cx="10" cy="6.8" r="1" fill="#8B4A26"/>'
    + '<path d="M1.2 7.6A8.8 8 0 0 0 18.8 7.6z" fill="#F2C066" stroke="#C98A12" stroke-width=".7" stroke-linejoin="round"/>'
    + '<circle cx="7.6" cy="10.4" r=".75" fill="#6B4410"/><circle cx="12.4" cy="10.4" r=".75" fill="#6B4410"/><path d="M8.8 12.2q1.2 1 2.4 0" stroke="#6B4410" stroke-width=".7" fill="none" stroke-linecap="round"/>' };
  // lo que cae al fondo de la entrada: rodajas de limón, cebollita picada, hojitas de cilantro y chiles
  // una hojita de cilantro de tres lóbulos que nace en (x, y), girada a grados y de tamaño s
  function TACO_CILANTRO(x, y, a, s) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + a + ') scale(' + s + ')"><path d="M0 0C-2.8-.6-5-2.8-4.8-5.2-4.6-7-3-7.4-2.2-7-2-8.6-.8-9.2 0-9.2S2-8.6 2.2-7c.8-.4 2.4 0 2.6 1.8C5-2.8 2.8-.6 0 0z" fill="#4CB04A"/>'
      + '<path d="M0-.6V-6.6M0-2.6-2.6-5M0-2.6 2.6-5" stroke="#A6DD7E" stroke-width=".6" fill="none" stroke-linecap="round"/></g>';
  }
  var TACO_LLUEVE = { n: 26, z: [13, 24], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: TACO_LIMON(10, 10, 8.6) },
    { modo: 'cae', vb: '0 0 20 20', g: '<g fill="#FBF7FF" stroke="#C9B8E2" stroke-width=".8" stroke-linejoin="round">'
      + '<rect x="2.4" y="3" width="6" height="5.6" rx="1.2" transform="rotate(-14 5.4 5.8)"/><rect x="11.4" y="2.4" width="5.6" height="5.6" rx="1.2" transform="rotate(18 14.2 5.2)"/>'
      + '<rect x="4" y="11.6" width="5.6" height="5.4" rx="1.2" transform="rotate(10 6.8 14.3)"/><rect x="12" y="11.2" width="5" height="5" rx="1.2" transform="rotate(-24 14.5 13.7)"/></g>'
      + '<g stroke="#fff" stroke-width=".9" stroke-linecap="round"><path d="M3.6 4.6l2.6-.6M12.6 3.8l2.4.8M5.2 12.8l2.4.4M13 12.6l2-.8"/></g>' },
    { modo: 'flota', vb: '0 0 20 20', g: '<path d="M10.4 19.4Q10 14 10 9.6M10.1 13.6Q8 12 5.8 11.6M10.1 13Q12.4 11.2 14.6 10.8" stroke="#3E8A2E" stroke-width="1.1" fill="none" stroke-linecap="round"/>'
      + TACO_CILANTRO(10, 10, 0, 1) + TACO_CILANTRO(5.8, 11.8, -58, .82) + TACO_CILANTRO(14.6, 11, 56, .82) },
    { modo: 'cae', vb: '0 0 20 20', g: '<path d="M5.4 5.6c3.2-.4 5.4 1.4 7 4.2s3.4 5.8 6 7.6c-5 1.2-10-.8-12.6-4.8-1.4-2.2-1.8-4.6-.4-7z" fill="#E0352A"/>'
      + '<path d="M7 8c1.6.2 3 1.4 4 3" stroke="#FF9A8A" stroke-width="1" fill="none" stroke-linecap="round"/>'
      + '<path d="M4 5.8c.6-1.2 2-1.6 3.2-1.1L6.6 7z" fill="#3E9A3A"/><path d="M5 5.2c-.4-1.6.2-3 1.8-3.6" stroke="#3E9A3A" stroke-width="1.4" fill="none" stroke-linecap="round"/>' }] };
  alta('taco',
    { m: TACO_M, m2: TACO_M2, j: TACO_J, mov: 'brinca', mov2: 'mece', jmov: 'brinca', lluvia: TACO_LLUEVE, w: 108, w2: 112,
      dice: ['¡Uno de pastor!', '¡Con todo!', '¡Salsa, por favor!', '¡Con limoncito!'] });
  CSS_FECHAS += '.pt-taco-ojos{transform-box:fill-box;transform-origin:50% 50%;animation:pt-taco-ojos 3s ease-in-out infinite}'
    + '@keyframes pt-taco-ojos{0%,88%,100%{transform:scaleY(1)}93%{transform:scaleY(.1)}}';
  return CSS_FECHAS;
});
