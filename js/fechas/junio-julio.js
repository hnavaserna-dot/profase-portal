/* Portal PROFASE · dibujos de las fechas «chispa» de junio y julio (Daniel, 31-oct-2026: «sí a todas»; en la entrada y
   adentro). js/temporada.js baja este archivo solo los días de una de sus fechas, para que el portal siga ligero; las
   fechas, su felicitación y su día viven allá, en TEMPORADAS. Dibujos propios: ninguno es el signo PROFASE, ni marcas,
   ni personajes. Agregar o quitar fechas solo lo decide Daniel (CLAUDE.md). */
(window.PROFASE_TEMPORADA_FECHAS = window.PROFASE_TEMPORADA_FECHAS || []).push(function (T) {
  'use strict';
  var alta = T.alta, svg = T.svg, CSS_FECHAS = '';
  /* ===== Fechas «chispa», parte C: junio y julio ===== */

  // ---------- Día de la Marina (1 de junio): barquito que se mece sobre las olas y un ancla; burbujas ----------
  // ola suave: n tramos de ancho w y altura a, desde (x0, y)
  function MARINA_ONDA(x0, y, n, w, a) {
    var d = 'M' + x0 + ' ' + y;
    for (var i = 0; i < n; i++) d += i ? 't' + w + ' 0' : 'q' + (w / 2) + ' ' + (-a) + ' ' + w + ' 0';
    return d;
  }
  var MARINA_M = { vb: '0 0 100 90', g: '<g class="pt-marina-ola1"><path d="' + MARINA_ONDA(6, 64, 8, 11, 4) + 'V80H6z" fill="#2E6FB7"/></g>'
    + '<g class="pt-marina-barco">'
    + '<g class="pt-marina-bandera"><path d="M51.5 6.5l12 3.6-12 3.6z" fill="#F2C066"/></g>'
    + '<rect x="48.5" y="6" width="3" height="48" rx="1.2" fill="#A06C3A"/>'
    + '<path d="M53 12V49H80Q71 29 53 12z" fill="#fff"/><path d="M47 17V49H25Q35 33 47 17z" fill="#CFE3F7"/>'
    + '<path d="M53 49H80" stroke="#DDE4EE" stroke-width="1.4"/>'
    + '<path d="M12 51H88L79 65Q50 71 21 65z" fill="#F07A1E"/><path d="M16 56H84" stroke="#fff" stroke-width="2.2"/>'
    + '<g fill="#1F3864" stroke="#fff" stroke-width="1.4"><circle cx="34" cy="60.5" r="2.5"/><circle cx="50" cy="61" r="2.5"/><circle cx="66" cy="60.5" r="2.5"/></g>'
    + '</g>'
    + '<g class="pt-marina-ola2"><path d="' + MARINA_ONDA(2, 70, 8, 12, 4.5) + 'V83q0 5-5 5H7q-5 0-5-5z" fill="#4FA3E8"/>'
    + '<path d="' + MARINA_ONDA(2, 70, 8, 12, 4.5) + '" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".85"/>'
    + '<path d="M14 80h10M44 82h12M74 79h9" stroke="#9FD0F7" stroke-width="1.6" stroke-linecap="round"/></g>' };
  var MARINA_CUERDA = 'M35 13C12 22 20 44 39 44C58 44 60 57 44 61C31 64 28 72 35 77';
  // el ancla con su cuerda; c es el metal y s su brillo (clara en la entrada, más azul en el quieto de adentro)
  function MARINA_ANCLA(c, s) {
    return '<g class="pt-marina-ancla">'
      + '<circle cx="40" cy="11" r="6.5" fill="none" stroke="' + c + '" stroke-width="5"/>'
      + '<rect x="36.5" y="16" width="7" height="68" rx="3.5" fill="' + c + '"/>'
      + '<rect x="21" y="25" width="38" height="6.5" rx="3.25" fill="' + c + '"/>'
      + '<circle cx="21" cy="28.2" r="4.4" fill="' + c + '"/><circle cx="59" cy="28.2" r="4.4" fill="' + c + '"/>'
      + '<path d="M13 58Q15 85 40 86Q65 85 67 58" stroke="' + c + '" stroke-width="7" fill="none" stroke-linecap="round"/>'
      + '<path d="M13 45 3.5 63Q13 58.5 22.5 63z" fill="' + c + '"/><path d="M67 45 57.5 63Q67 58.5 76.5 63z" fill="' + c + '"/>'
      + '<circle cx="40" cy="85" r="5.5" fill="' + c + '"/><path d="M41.6 20V80" stroke="' + s + '" stroke-width="1.6" stroke-linecap="round"/>'
      + '<path d="' + MARINA_CUERDA + '" stroke="#F07A1E" stroke-width="3.6" fill="none" stroke-linecap="round"/>'
      + '<path d="' + MARINA_CUERDA + '" stroke="#FFC48C" stroke-width="1.4" fill="none" stroke-dasharray="2 3"/>'
      + '</g>';
  }
  var MARINA_M2 = { vb: '0 0 80 96', g: MARINA_ANCLA('#DDE4EE', '#AEBBCD') };
  var MARINA_C2 = { vb: '0 0 80 96', g: MARINA_ANCLA('#5F82BF', '#8FAEDF') };
  var MARINA_J = { vb: '0 0 20 18', g: '<rect x="9.3" y="1.2" width="1.3" height="11" fill="#A06C3A"/>'
    + '<path d="M11 2V11.2H17.6Q15.6 6 11 2z" fill="#fff" stroke="#C9D1DE" stroke-width=".6" stroke-linejoin="round"/>'
    + '<path d="M8.9 3.4V11.2H3.6Q5.8 7 8.9 3.4z" fill="#7FB2EA"/>'
    + '<path d="M1.6 11.6H18.4L16.2 15.2Q10 16.6 3.8 15.2z" fill="#F07A1E"/>'
    + '<path d="' + MARINA_ONDA(1, 16, 6, 3, 1.6) + 'V18H1z" fill="#4FA3E8"/>' };
  // lo que cae al fondo de la entrada: anclitas y salvavidas que bajan, y burbujas que suben
  var MARINA_LLUEVE = { n: 22, z: [12, 24], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: '<g fill="none" stroke="#DDE4EE" stroke-linecap="round"><circle cx="10" cy="3.2" r="1.9" stroke-width="1.5"/>'
      + '<path d="M10 5.2V17.6" stroke-width="2"/><path d="M6.2 7.4H13.8" stroke-width="1.8"/><path d="M3.6 12Q4 18.2 10 18.2Q16 18.2 16.4 12" stroke-width="1.9"/></g>'
      + '<path d="M3.6 10.2 1.6 13.8H5.6zM16.4 10.2 14.4 13.8H18.4z" fill="#DDE4EE"/><path d="M10.9 6.4V16.4" stroke="#AEBBCD" stroke-width=".7" stroke-linecap="round"/>' },
    { modo: 'flota', vb: '0 0 20 20', g: '<circle cx="10" cy="10" r="6.8" fill="none" stroke="#fff" stroke-width="4.4"/>'
      + '<circle cx="10" cy="10" r="6.8" fill="none" stroke="#F07A1E" stroke-width="4.4" stroke-dasharray="5.34 5.34" transform="rotate(-20 10 10)"/>'
      + '<g fill="none" stroke="#C9D1DE" stroke-width=".6"><circle cx="10" cy="10" r="9"/><circle cx="10" cy="10" r="4.6"/></g>' },
    { modo: 'sube', vb: '0 0 20 20', g: '<circle cx="10" cy="10" r="8" fill="#9FD0F7" fill-opacity=".14" stroke="#CFE8FB" stroke-width="1.2"/>'
      + '<path d="M5.4 9A4.8 4.8 0 0 1 9 5.2" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="13.6" cy="13.4" r=".9" fill="#fff" opacity=".7"/>' }] };
  alta('marina',
    { m: MARINA_M, m2: MARINA_M2, j: MARINA_J, c2: MARINA_C2, mov: 'mece', mov2: 'flota', jmov: 'mece', lluvia: MARINA_LLUEVE, w2: 84,
      dice: ['¡A toda vela!', '¡Mar adentro!', '¡Leven anclas!', '¡Gracias, marinos!'] });
  CSS_FECHAS += '.pt-marina-barco{transform-box:fill-box;transform-origin:50% 90%;animation:pt-marina-barco 2.6s ease-in-out infinite alternate}'
    + '@keyframes pt-marina-barco{from{transform:rotate(-5deg)}to{transform:rotate(5deg) translateY(-3%)}}'
    + '.pt-marina-ola1,.pt-marina-ola2{transform-box:fill-box;animation:pt-marina-ola 2.6s ease-in-out infinite alternate}'
    + '.pt-marina-ola2{animation-duration:2.1s;animation-direction:alternate-reverse}'
    + '@keyframes pt-marina-ola{from{transform:translateX(-2%)}to{transform:translateX(2%)}}'
    + '.pt-marina-bandera{transform-box:fill-box;transform-origin:0 50%;animation:pt-marina-bandera .6s ease-in-out infinite alternate}'
    + '@keyframes pt-marina-bandera{from{transform:scaleX(.75) skewY(-10deg)}to{transform:scaleX(1) skewY(6deg)}}'
    + '.pt-marina-ancla{transform-box:fill-box;transform-origin:50% 0;animation:pt-marina-ancla 2.6s ease-in-out infinite alternate}'
    + '@keyframes pt-marina-ancla{from{transform:rotate(-7deg)}to{transform:rotate(7deg)}}';

  // ---------- Día del Churro (6 de junio): churro con azúcar que se moja en una taza de chocolate; cae «azúcar» ----------
  // un churro de pie (centrado en x = 0) de y0 a y1 y ancho w; con choco, la punta bañada de chocolate desde esa altura
  function CHURRO_PALO(y0, y1, w, choco, azucar) {
    var h = '<rect x="' + (-w / 2) + '" y="' + y0 + '" width="' + w + '" height="' + (y1 - y0) + '" rx="' + (w / 2) + '" fill="#D99441"/>'
      + '<path d="M' + (-w * .22).toFixed(2) + ' ' + (y0 + w * .45).toFixed(2) + 'V' + (y1 - w * .45).toFixed(2) + 'M' + (w * .22).toFixed(2) + ' ' + (y0 + w * .45).toFixed(2) + 'V' + (y1 - w * .45).toFixed(2)
      + '" stroke="#B26C28" stroke-width="' + (w * .12).toFixed(2) + '" stroke-linecap="round"/>'
      + '<path d="M' + (-w * .37).toFixed(2) + ' ' + (y0 + w * .55).toFixed(2) + 'V' + (y1 - w * .55).toFixed(2) + '" stroke="#F4BD70" stroke-width="' + (w * .1).toFixed(2) + '" stroke-linecap="round"/>';
    if (azucar) {
      var n = Math.floor((y1 - y0) / w * 2.2), i;
      h += '<g fill="#fff">';
      for (i = 0; i < n; i++) h += '<circle cx="' + ((((i * 7) % 5) / 4 - .5) * w * .62).toFixed(2) + '" cy="' + (y0 + w * .5 + i * (y1 - y0 - w) / n).toFixed(2) + '" r="' + (w * .075).toFixed(2) + '"/>';
      h += '</g>';
    }
    if (choco !== undefined) h += '<path d="M' + (-w / 2) + ' ' + choco + 'q' + (w / 4) + ' ' + (-w * .3).toFixed(2) + ' ' + (w / 2) + ' 0t' + (w / 2) + ' 0V' + (y1 - w / 2) + 'a' + (w / 2) + ' ' + (w / 2) + ' 0 0 1 ' + (-w) + ' 0z" fill="#5A2E17"/>';
    return h;
  }
  var CHURRO_M = { vb: '0 0 100 100', g: '<ellipse cx="46" cy="86" rx="38" ry="6" fill="#C9D1DE"/><ellipse cx="46" cy="84.6" rx="31" ry="4" fill="#E6ECF4"/>'
    + '<path d="M74 50C90 48 92 72 71 74" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>'
    + '<ellipse cx="46" cy="44" rx="30" ry="8" fill="#E6ECF4"/><ellipse cx="46" cy="45" rx="26.5" ry="6.2" fill="#5A2E17"/><ellipse cx="54" cy="43.6" rx="8" ry="1.6" fill="#7A4224"/>'
    + '<g class="pt-churro-humo"><path d="M60 34q-4-5 0-10t0-10M70 36q-4-5 0-10t0-10" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".75"/></g>'
    + '<g class="pt-churro-moja"><g transform="translate(32 30) rotate(-25)">' + CHURRO_PALO(-30, 28, 11, 13, true) + '</g></g>'
    + '<ellipse cx="40.9" cy="49.4" rx="7.6" ry="2.8" fill="#5A2E17"/><path d="M34.5 49.6q6.4 2.6 12.8 0" stroke="#7A4224" stroke-width="1.1" fill="none"/>'
    + '<path d="M16 44A30 8 0 0 0 76 44L72 74Q71 84 60 84H32Q21 84 20 74z" fill="#fff"/>'
    + '<path d="M17.9 58Q46 64 74.1 58L73.1 66Q46 72 18.9 66z" fill="#1F3864"/>'
    + '<g fill="#F07A1E"><circle cx="31" cy="64.4" r="1.9"/><circle cx="46" cy="65" r="1.9"/><circle cx="61" cy="64.4" r="1.9"/></g>'
    + '<path d="M67.5 50Q70.5 62 68 79" stroke="#E6ECF4" stroke-width="3" fill="none" stroke-linecap="round"/>' };
  // la bolsita de papel con rayas: franjas que siguen el ancho de la bolsa
  function CHURRO_BOLSA() {
    var h = '<path d="M16 50H64L59 94H21z" fill="#fff" stroke="#E2C2A2" stroke-width="1.4" stroke-linejoin="round"/>', k;
    for (k = 1; k < 8; k += 2) {
      h += '<path d="M' + (16 + 6 * k) + ' 52L' + (16 + 6 * (k + 1)) + ' 52L' + (21 + 4.75 * (k + 1)).toFixed(2) + ' 93.3L' + (21 + 4.75 * k).toFixed(2) + ' 93.3z" fill="#F9C79A"/>';
    }
    return h + '<rect x="13" y="45" width="54" height="9" rx="2.5" fill="#F07A1E"/><path d="M17 49.5h46" stroke="#FFB774" stroke-width="1.2" stroke-dasharray="3 2.4"/>';
  }
  function CHURRO_CHISPA(x, y, s) { return '<path d="M' + x + ' ' + (y - s) + 'Q' + x + ' ' + y + ' ' + (x + s) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y + s) + 'Q' + x + ' ' + y + ' ' + (x - s) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y - s) + 'z"/>'; }
  var CHURRO_M2 = { vb: '0 0 80 100', g: '<g transform="rotate(-17 40 92) translate(40 0)">' + CHURRO_PALO(14, 82, 10, undefined, true) + '</g>'
    + '<g transform="rotate(17 40 92) translate(40 0)">' + CHURRO_PALO(14, 82, 10, undefined, true) + '</g>'
    + '<g transform="translate(40 0)">' + CHURRO_PALO(5, 82, 10.5, undefined, true) + '</g>'
    + CHURRO_BOLSA()
    + '<g class="pt-churro-chispa" fill="#fff">' + CHURRO_CHISPA(10, 22, 3.4) + CHURRO_CHISPA(70, 16, 3) + CHURRO_CHISPA(57, 4, 2.4) + '</g>' };
  // junto al signo: la taza más chica a la derecha y el churro más grueso, para que se entienda a 16 px
  var CHURRO_J = { vb: '0 0 20 18', g: '<path d="M17.3 11.3c2.8 0 2.8 4.2-.6 4.3" stroke="#C9D1DE" stroke-width="2.3" fill="none" stroke-linecap="round"/>'
    + '<path d="M17.3 11.3c2.8 0 2.8 4.2-.6 4.3" stroke="#fff" stroke-width="1.1" fill="none" stroke-linecap="round"/>'
    + '<ellipse cx="11.5" cy="10" rx="6" ry="1.8" fill="#5A2E17" stroke="#C9D1DE" stroke-width=".6"/>'
    + '<g class="pt-churro-moja"><g transform="translate(7.6 8.2) rotate(-30)">' + CHURRO_PALO(-8, 8, 4.2, 0, true) + '</g></g>'
    + '<ellipse cx="8.9" cy="10.5" rx="2.6" ry="1.2" fill="#5A2E17"/>'
    + '<path d="M5.5 10A6 1.8 0 0 0 17.5 10L16.7 15.8Q16.4 17.4 14.8 17.4H8.2Q6.6 17.4 6.3 15.8z" fill="#fff" stroke="#C9D1DE" stroke-width=".6"/>'
    + '<path d="M5.9 12.8Q11.5 14.2 17.1 12.8L16.95 14.3Q11.5 15.7 6.05 14.3z" fill="#1F3864"/>' };
  // una gota que cae (caja 0 0 14 20): color, su brillo y, si se da, una orilla clara para que se vea sobre el azul marino;
  // también la usan el verano, el chocolate, el helado y el aguacate
  function CHURRO_GOTA(c, b, o) {
    return '<path d="M7 1C5 6 2 9 2 13a5 5 0 0 0 10 0c0-4-3-7-5-12z" fill="' + c + '"' + (o ? ' stroke="' + o + '" stroke-width=".9"' : '') + '/>'
      + '<path d="M4.8 12.4a2.4 2.4 0 0 0 1.7 2.8" stroke="' + b + '" stroke-width="1.25" fill="none" stroke-linecap="round"/>';
  }
  // lo que cae al fondo de la entrada: azúcar con canela, rajitas de canela y gotas de chocolate
  var CHURRO_LLUEVE = { n: 24, z: [11, 22], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: '<g fill="#fff"><rect x="2.6" y="4.4" width="6.4" height="6.4" rx="1.2" transform="rotate(18 5.8 7.6)"/>'
      + '<rect x="11.2" y="2.6" width="5.4" height="5.4" rx="1" transform="rotate(-14 13.9 5.3)"/><rect x="8.4" y="11.2" width="6.8" height="6.8" rx="1.3" transform="rotate(8 11.8 14.6)"/></g>'
      + '<g fill="#DDE4EE"><rect x="9.2" y="15.6" width="5.6" height="1.6" rx=".8" transform="rotate(8 11.8 14.6)"/><rect x="3.4" y="8.8" width="4.8" height="1.4" rx=".7" transform="rotate(18 5.8 7.6)"/></g>'
      + '<g fill="#D9893F"><circle cx="4.4" cy="15.4" r="1.3"/><circle cx="16.4" cy="11.4" r="1.2"/><circle cx="11.4" cy="9.4" r=".9"/><circle cx="2.6" cy="2.8" r="1"/><circle cx="17.6" cy="16.8" r=".9"/></g>' },
    { modo: 'cae', vb: '0 0 20 20', g: '<g transform="rotate(-35 10 10)"><rect x="1.6" y="7" width="15.6" height="6" rx="1.6" fill="#B5652C"/>'
      + '<path d="M3.2 8.4H15.4" stroke="#E6A066" stroke-width="1.2" stroke-linecap="round"/><path d="M3.2 11.2H15.4" stroke="#83431B" stroke-width=".8" stroke-linecap="round"/>'
      + '<ellipse cx="17.2" cy="10" rx="2" ry="3" fill="#E6A066"/><path d="M17.2 10.3a.7.9 0 1 1 .7-.9 1.4 1.9 0 1 1-2.1 1.5" stroke="#83431B" stroke-width=".75" fill="none" stroke-linecap="round"/>'
      + '<g fill="#fff"><circle cx="5.6" cy="9.8" r=".6"/><circle cx="9" cy="8.9" r=".6"/><circle cx="12.4" cy="10.2" r=".6"/><circle cx="7.6" cy="11.9" r=".5"/></g></g>' },
    { modo: 'gotea', vb: '0 0 14 20', g: CHURRO_GOTA('#7A4524', '#D9A57A', '#C08A5A') }] };
  alta('churro',
    { m: CHURRO_M, m2: CHURRO_M2, j: CHURRO_J, mov: 'brinca', mov2: 'mece', jmov: 'brinca', lluvia: CHURRO_LLUEVE, w2: 86,
      dice: ['¡A remojar!', '¡Con chocolate!', '¡Con azúcar!', '¡Calientitos!'] });
  CSS_FECHAS += '.pt-churro-moja{transform-box:fill-box;animation:pt-churro-moja 2.2s ease-in-out infinite}'
    + '@keyframes pt-churro-moja{0%,30%,100%{transform:translate(0,0)}55%,70%{transform:translate(8%,10%)}}'
    + '.pt-churro-humo{transform-box:fill-box;animation:pt-churro-humo 2.4s ease-in-out infinite}'
    + '@keyframes pt-churro-humo{0%{opacity:0;transform:translateY(12%)}40%{opacity:1}100%{opacity:0;transform:translateY(-18%)}}'
    + '.pt-churro-chispa{animation:pt-churro-chispa 1.3s ease-in-out infinite alternate}@keyframes pt-churro-chispa{from{opacity:.25}to{opacity:1}}';

  // ---------- Día de los Océanos (8 de junio): pececito que nada y estrella de mar; burbujas ----------
  var OCEANOS_M = { vb: '0 0 100 76', g: '<g class="pt-oceanos-cola"><path d="M27 38 7 21Q12 38 7 55z" fill="#F2C066"/></g>'
    + '<path d="M40 21Q50 3 66 15Q54 16 47 23z" fill="#F2C066"/>'
    + '<path d="M22 38C30 16 62 12 80 30C86 35 86 41 80 46C62 64 30 60 22 38z" fill="#2BB3C0"/>'
    + '<path d="M30 46C42 56 62 56 76 47C62 53 42 53 30 46z" fill="#8FE3E9" opacity=".8"/>'
    + '<path d="M47 23Q41 38 47 54M60 23.5Q55 38 60 53" stroke="#F07A1E" stroke-width="5" fill="none" stroke-linecap="round"/>'
    + '<g class="pt-oceanos-aleta"><path d="M52 42q-1 11-11 13q5-7 3-13z" fill="#F2C066"/></g>'
    + '<circle cx="70" cy="33" r="6.5" fill="#fff"/><circle cx="71.6" cy="33.4" r="3.6" fill="#1A2333"/><circle cx="70.4" cy="31.8" r="1.3" fill="#fff"/>'
    + '<path d="M77.6 42q3 2.4 5.6-.6" stroke="#1A2333" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
    + '<circle cx="70" cy="43" r="2.6" fill="#F29BC4" opacity=".85"/>'
    + '<g class="pt-oceanos-burbuja" fill="none" stroke="#fff" stroke-width="1.6"><circle cx="90" cy="27" r="3"/><circle cx="95" cy="17" r="2"/><circle cx="91" cy="9" r="1.4"/></g>' };
  // la estrella de mar: cinco brazos redondeados, con puntitos y carita
  function OCEANOS_ESTRELLA(cx, cy, R, r) {
    var d = '', i, a, p = '';
    for (i = 0; i < 10; i++) { a = (-90 + i * 36) * Math.PI / 180; d += (i ? 'L' : 'M') + (cx + Math.cos(a) * (i % 2 ? r : R)).toFixed(1) + ' ' + (cy + Math.sin(a) * (i % 2 ? r : R)).toFixed(1); }
    for (i = 0; i < 5; i++) {
      a = (-90 + i * 72) * Math.PI / 180;
      p += '<circle cx="' + (cx + Math.cos(a) * R * .62).toFixed(1) + '" cy="' + (cy + Math.sin(a) * R * .62).toFixed(1) + '" r="2.3"/>'
        + '<circle cx="' + (cx + Math.cos(a) * R * .86).toFixed(1) + '" cy="' + (cy + Math.sin(a) * R * .86).toFixed(1) + '" r="1.5"/>';
    }
    return '<path d="' + d + 'z" fill="#F07A1E" stroke="#F07A1E" stroke-width="7" stroke-linejoin="round"/><g fill="#FFC08A">' + p + '</g>'
      + '<circle cx="' + (cx - 5) + '" cy="' + (cy - 2) + '" r="2.6" fill="#1A2333"/><circle cx="' + (cx + 5) + '" cy="' + (cy - 2) + '" r="2.6" fill="#1A2333"/>'
      + '<circle cx="' + (cx - 5.8) + '" cy="' + (cy - 2.9) + '" r=".9" fill="#fff"/><circle cx="' + (cx + 4.2) + '" cy="' + (cy - 2.9) + '" r=".9" fill="#fff"/>'
      + '<path d="M' + (cx - 4) + ' ' + (cy + 3.4) + 'q4 3.6 8 0" stroke="#1A2333" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
      + '<circle cx="' + (cx - 9) + '" cy="' + (cy + 2.6) + '" r="2" fill="#E8418C" opacity=".55"/><circle cx="' + (cx + 9) + '" cy="' + (cy + 2.6) + '" r="2" fill="#E8418C" opacity=".55"/>';
  }
  var OCEANOS_M2 = { vb: '0 0 90 90', g: '<g class="pt-oceanos-alga" fill="none" stroke-linecap="round">'
    + '<path d="M18 86C8 70 28 60 16 44C8 32 20 24 16 14" stroke="#3FAE6A" stroke-width="6"/>'
    + '<path d="M74 86C84 72 66 62 76 48C82 40 72 34 76 26" stroke="#2E9A5A" stroke-width="5"/></g>'
    + '<path d="M4 85Q45 70 86 85Q86 89 82 89H8Q4 89 4 85z" fill="#E8C98A"/><g fill="#D4AF6E"><circle cx="20" cy="84" r="1.6"/><circle cx="66" cy="83" r="1.4"/><circle cx="76" cy="86" r="1.2"/></g>'
    + '<g class="pt-oceanos-estrella">' + OCEANOS_ESTRELLA(45, 50, 29, 13) + '</g>' };
  var OCEANOS_J = { vb: '0 0 20 15', g: '<g class="pt-oceanos-cola"><path d="M6 7.5 1 3.4Q2.4 7.5 1 11.6z" fill="#F2C066"/></g>'
    + '<path d="M9 3.6Q11 .6 14 2.8L11.6 4.2z" fill="#F2C066"/>'
    + '<path d="M5 7.5C7 2.5 14 2 18 6C19 7 19 8 18 9C14 13 7 12.5 5 7.5z" fill="#2BB3C0"/>'
    + '<path d="M10.2 4.2Q9.2 7.5 10.2 10.9" stroke="#F07A1E" stroke-width="1.7" fill="none" stroke-linecap="round"/>'
    + '<circle cx="15" cy="6.4" r="1.6" fill="#fff"/><circle cx="15.3" cy="6.5" r=".9" fill="#1A2333"/>' };
  // lo que sube al fondo de la entrada: burbujas con brillo y pececitos (turquesa y naranja) que nadan hacia arriba
  function OCEANOS_PEZ(c, f) {
    return '<g transform="rotate(-28 10 10)"><path d="M6 10 1.4 6.4Q2.6 10 1.4 13.6z" fill="' + f + '"/>'
      + '<path d="M4.6 10C6.4 5.2 13.4 4.6 17.4 8.8C18.2 9.6 18.2 10.4 17.4 11.2C13.4 15.4 6.4 14.8 4.6 10z" fill="' + c + '"/>'
      + '<path d="M10.2 6.4Q9 10 10.2 13.6" stroke="' + f + '" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
      + '<circle cx="14.6" cy="9.2" r="1.5" fill="#fff"/><circle cx="14.9" cy="9.3" r=".8" fill="#1A2333"/></g>';
  }
  var OCEANOS_LLUEVE = { n: 22, z: [12, 24], formas: [
    { modo: 'sube', vb: '0 0 20 20', g: '<circle cx="10" cy="10" r="8" fill="#9BE7EF" fill-opacity=".14" stroke="#BFF1F5" stroke-width="1.2"/>'
      + '<path d="M5.4 9A4.8 4.8 0 0 1 9 5.2" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="13.6" cy="13.4" r=".9" fill="#fff" opacity=".7"/>' },
    { modo: 'sube', vb: '0 0 20 20', g: OCEANOS_PEZ('#2BB3C0', '#F2C066') },
    { modo: 'sube', vb: '0 0 20 20', g: '<circle cx="10" cy="10" r="5" fill="#9BE7EF" fill-opacity=".14" stroke="#BFF1F5" stroke-width="1"/><circle cx="8.6" cy="8.4" r="1" fill="#fff"/>'
      + '<circle cx="15.6" cy="4.4" r="2.6" fill="none" stroke="#BFF1F5" stroke-width=".9"/><circle cx="4.6" cy="16.2" r="2" fill="none" stroke="#BFF1F5" stroke-width=".9"/>' },
    { modo: 'sube', vb: '0 0 20 20', g: OCEANOS_PEZ('#F07A1E', '#FFC48C') }] };
  alta('oceanos',
    { m: OCEANOS_M, m2: OCEANOS_M2, j: OCEANOS_J, mov: 'vuela', mov2: 'brinca', jmov: 'vuela', lluvia: OCEANOS_LLUEVE, w2: 98,
      dice: ['¡Glu, glu!', '¡A nadar!', '¡Cuidemos el mar!', '¡Hola, amiguitos!'] });
  CSS_FECHAS += '.pt-oceanos-cola{transform-box:fill-box;transform-origin:100% 50%;animation:pt-oceanos-cola .45s ease-in-out infinite alternate}'
    + '@keyframes pt-oceanos-cola{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}'
    + '.pt-oceanos-aleta{transform-box:fill-box;transform-origin:100% 0;animation:pt-oceanos-aleta .7s ease-in-out infinite alternate}'
    + '@keyframes pt-oceanos-aleta{from{transform:rotate(-12deg)}to{transform:rotate(16deg)}}'
    + '.pt-oceanos-burbuja{transform-box:fill-box;animation:pt-oceanos-burbuja 2.2s ease-in infinite}'
    + '@keyframes pt-oceanos-burbuja{0%{opacity:0;transform:translateY(25%)}30%{opacity:1}100%{opacity:0;transform:translateY(-35%)}}'
    + '.pt-oceanos-alga{transform-box:fill-box;transform-origin:50% 100%;animation:pt-oceanos-alga 2.6s ease-in-out infinite alternate}'
    + '@keyframes pt-oceanos-alga{from{transform:skewX(-6deg)}to{transform:skewX(6deg)}}'
    + '.pt-oceanos-estrella{transform-box:fill-box;transform-origin:50% 50%;animation:pt-oceanos-estrella 1.8s ease-in-out infinite alternate}'
    + '@keyframes pt-oceanos-estrella{from{transform:rotate(-7deg)}to{transform:rotate(7deg)}}';

  // ---------- Día del Sushi (18 de junio): rollito que gira y nigiri con palillos; pétalos ----------
  function SUSHI_ARROZ(cx, cy, r0, r1, n, s) {
    var h = '<g fill="#E3E9F1">', i, a, r, x, y;
    for (i = 0; i < n; i++) {
      a = i * 2.39996; r = r0 + (r1 - r0) * ((i * 7) % 11) / 10;
      x = (cx + Math.cos(a) * r).toFixed(1); y = (cy + Math.sin(a) * r).toFixed(1);
      h += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + (2.3 * s).toFixed(2) + '" ry="' + (1.15 * s).toFixed(2) + '" transform="rotate(' + ((a * 57.3 + 90) % 180).toFixed(0) + ' ' + x + ' ' + y + ')"/>';
    }
    return h + '</g>';
  }
  var SUSHI_M = { vb: '0 0 90 90', g: '<circle cx="45" cy="45" r="41" fill="#33573C" stroke="#6FA36F" stroke-width="2.5"/>'
    + '<path d="M11.5 29.4A37 37 0 0 1 26.5 13" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".3"/>'
    + '<circle cx="45" cy="45" r="33" fill="#fff"/>' + SUSHI_ARROZ(45, 45, 22, 30, 28, 1)
    + '<g transform="translate(45 45) scale(1.3) translate(-45 -45)">'
    + '<ellipse cx="45" cy="37.5" rx="10" ry="7.5" fill="#FF8A65"/><path d="M39 33q2 4.5 0 9M45 31.5q2 5 0 11M51 33q2 4.5 0 9" stroke="#FFD3C2" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
    + '<ellipse cx="38" cy="51" rx="8" ry="6.5" transform="rotate(-25 38 51)" fill="#9BD35A" stroke="#6FA33A" stroke-width="1.2"/>'
    + '<rect x="46.5" y="44.5" width="11.5" height="11.5" rx="2.6" transform="rotate(14 52 50)" fill="#FFD45A" stroke="#E8B22E" stroke-width="1.2"/></g>' };
  var SUSHI_M2 = { vb: '0 0 100 80', g: '<rect x="4" y="62" width="92" height="9" rx="3" fill="#B9763A"/><rect x="14" y="70" width="9" height="7" rx="1.5" fill="#8A5A2B"/><rect x="77" y="70" width="9" height="7" rx="1.5" fill="#8A5A2B"/>'
    + '<path d="M20 60C17 47 30 42 50 42C70 42 83 47 80 60C80 64 20 64 20 60z" fill="#fff"/>'
    + '<g fill="#E3E9F1"><ellipse cx="26" cy="58" rx="2.3" ry="1.1"/><ellipse cx="74" cy="58" rx="2.3" ry="1.1"/><ellipse cx="33" cy="61" rx="2" ry="1"/><ellipse cx="67" cy="61" rx="2" ry="1"/></g>'
    + '<path d="M13 47C15 33 36 27 52 29C70 31 87 35 87 47C87 53 79 51 71 49C57 47 31 53 21 55C15 56 12 51 13 47z" fill="#FF8A65"/>'
    + '<path d="M29 33.5Q33 41 29 50.5M43 31Q47 39 43 48.5M57 31.5Q61 39 57 47M71 34Q74 40 71 46" stroke="#FFD3C2" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    + '<circle cx="42" cy="56" r="2" fill="#1A2333"/><circle cx="58" cy="56" r="2" fill="#1A2333"/><path d="M47 58q3 2.6 6 0" stroke="#1A2333" stroke-width="1.5" fill="none" stroke-linecap="round"/>'
    + '<circle cx="36.5" cy="58.5" r="2.3" fill="#F29BC4"/><circle cx="63.5" cy="58.5" r="2.3" fill="#F29BC4"/>'
    + '<g class="pt-sushi-palillos" stroke-linecap="round"><path d="M97 4 61 29M99 13 64 34" stroke="#E3B26A" stroke-width="3.6"/>'
    + '<path d="M97 4 89.6 9.1M99 13 91.5 18.2" stroke="#F07A1E" stroke-width="4"/></g>' };
  var SUSHI_J = { vb: '0 0 18 18', g: '<circle cx="9" cy="9" r="8.3" fill="#3D6B47" stroke="#7FB07F" stroke-width=".7"/><circle cx="9" cy="9" r="6.1" fill="#fff"/>'
    + '<ellipse cx="9" cy="7.4" rx="2.5" ry="1.9" fill="#FF8A65"/>'
    + '<ellipse cx="7.3" cy="10.6" rx="1.9" ry="1.6" fill="#8CC152"/><rect x="9.2" y="9.2" width="2.8" height="2.8" rx=".7" fill="#FFD45A"/>' };
  // lo que cae al fondo de la entrada: granos de arroz, florecitas y pétalos de cerezo, y palillos
  function SUSHI_SAKURA() {
    var h = '<g fill="#F7B8D2" stroke="#E87AA8" stroke-width=".5" stroke-linejoin="round">', i;
    for (i = 0; i < 5; i++) h += '<path transform="rotate(' + (i * 72) + ' 10 10)" d="M10 10C6.9 8.4 6.6 4.4 8.4 2.4L10 3.9L11.6 2.4C13.4 4.4 13.1 8.4 10 10z"/>';
    h += '</g><g fill="#FFE07A">';
    for (i = 0; i < 5; i++) h += '<circle cx="' + (10 + Math.cos((i * 72 - 54) * Math.PI / 180) * 2.9).toFixed(2) + '" cy="' + (10 + Math.sin((i * 72 - 54) * Math.PI / 180) * 2.9).toFixed(2) + '" r=".65"/>';
    return h + '</g><circle cx="10" cy="10" r="1.7" fill="#E8418C"/>';
  }
  var SUSHI_LLUEVE = { n: 24, z: [12, 24], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: '<g fill="#fff"><ellipse cx="6" cy="6.6" rx="3.8" ry="2.1" transform="rotate(-30 6 6.6)"/>'
      + '<ellipse cx="14" cy="8.4" rx="3.8" ry="2.1" transform="rotate(40 14 8.4)"/><ellipse cx="9.4" cy="14.6" rx="3.8" ry="2.1" transform="rotate(-6 9.4 14.6)"/></g>'
      + '<g stroke="#C9D5E4" stroke-width=".8" fill="none" stroke-linecap="round"><path d="M4.4 8.4Q6.4 8 8.4 6.6" /><path d="M12.6 10.6Q14.6 11 16.2 9.6"/><path d="M7.2 16.2Q9.4 16.8 11.8 16"/></g>' },
    { modo: 'flota', vb: '0 0 20 20', g: SUSHI_SAKURA() },
    { modo: 'cae', vb: '0 0 20 20', g: '<g stroke-linecap="round"><path d="M2.4 16.4 16.6 2.2M4.6 18.6 18.8 4.4" stroke="#E3B26A" stroke-width="1.9"/>'
      + '<path d="M14.2 4.6 16.6 2.2M16.4 6.8 18.8 4.4" stroke="#F07A1E" stroke-width="2.3"/></g>' },
    { modo: 'flota', vb: '0 0 20 20', g: '<path d="M10 18.4C4.4 14.8 3.8 6.6 7.2 2.6L10 5.2L12.8 2.6C16.2 6.6 15.6 14.8 10 18.4z" fill="#F9C6DA" stroke="#E87AA8" stroke-width=".6" stroke-linejoin="round"/>'
      + '<path d="M10 16.4V8.6" stroke="#EE8FB5" stroke-width=".9" stroke-linecap="round"/><path d="M7.4 6.6Q8 5.6 8.8 5.4" stroke="#fff" stroke-width=".9" fill="none" stroke-linecap="round" opacity=".8"/>' }] };
  alta('sushi',
    { m: SUSHI_M, m2: SUSHI_M2, j: SUSHI_J, mov: 'gira', mov2: 'brinca', jmov: 'gira', lluvia: SUSHI_LLUEVE, w: 96,
      dice: ['¡A rodar!', '¡Qué rico!', '¡Con palillos!', '¡Provecho!'] });
  CSS_FECHAS += '.pt-sushi-palillos{transform-box:fill-box;transform-origin:100% 0;animation:pt-sushi-palillos 1.4s ease-in-out infinite alternate}'
    + '@keyframes pt-sushi-palillos{from{transform:rotate(-4deg)}to{transform:rotate(3deg)}}';

  // ---------- Día del Padre (tercer domingo de junio): corbata que se mece y trofeo «#1»; confeti ----------
  // franjas diagonales dentro de la hoja de la corbata (trapecio de y0 a y1, ancho medio w0 a w1, centrada en cx)
  function PADRE_RAYAS(cx, y0, y1, w0, w1, centros, s, g, color) {
    function hw(y) { return w0 + (w1 - w0) * (y - y0) / (y1 - y0); }
    function p(x, y) { return x.toFixed(2) + ' ' + y.toFixed(2); }
    var h = '';
    centros.forEach(function (yc) {
      var a = yc + s, b = yc - s;
      h += '<path d="M' + p(cx - hw(a - g), a - g) + 'L' + p(cx + hw(b - g), b - g) + 'L' + p(cx + hw(b + g), b + g) + 'L' + p(cx - hw(a + g), a + g) + 'z" fill="' + color + '"/>';
    });
    return h;
  }
  // el saco abierto con la camisa, el pañuelo y la corbata (que se mece desde el nudo)
  var PADRE_M = { vb: '0 0 80 100', g: '<path d="M8 28Q8 19 18 16L31 11H49L62 16Q72 19 72 28V91Q72 97 66 97H14Q8 97 8 91z" fill="#3D66AD" stroke="#7FA3DA" stroke-width="1.2"/>'
    + '<path d="M30 11H50L44.5 88H35.5z" fill="#fff"/>'
    + '<path d="M30 11 18.5 30 24.5 33.5 34.2 70zM50 11 61.5 30 55.5 33.5 45.8 70z" fill="#2F5597" stroke="#7FA3DA" stroke-width=".8" stroke-linejoin="round"/>'
    + '<path d="M54 46.5H67" stroke="#2F5597" stroke-width="2.6" stroke-linecap="round"/><path d="M55.5 46 58.6 40.2 61.4 46zM59.6 46 63.2 39.4 66 46z" fill="#fff" stroke="#C9D1DE" stroke-width=".8" stroke-linejoin="round"/>'
    + '<g class="pt-padre-corbata"><path d="M36.5 28H43.5L50 74L40 86L30 74z" fill="#F07A1E"/>' + PADRE_RAYAS(40, 28, 74, 3.5, 10, [38, 50, 62], 3.5, 1.7, '#1F3864') + '</g>'
    + '<path d="M34.5 18H45.5L43.5 28.5H36.5z" fill="#D9650C"/>'
    + '<path d="M40 18 28.5 9 31 26zM40 18 51.5 9 49 26z" fill="#fff" stroke="#C9D1DE" stroke-width="1.1" stroke-linejoin="round"/>' };
  function PADRE_CHISPA(x, y, s) { return '<path d="M' + x + ' ' + (y - s) + 'Q' + x + ' ' + y + ' ' + (x + s) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y + s) + 'Q' + x + ' ' + y + ' ' + (x - s) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y - s) + 'z"/>'; }
  var PADRE_M2 = { vb: '0 0 80 100', g: '<path d="M19 16C5 16 5 40 23 42M61 16C75 16 75 40 57 42" stroke="#E0A93B" stroke-width="5" fill="none" stroke-linecap="round"/>'
    + '<path d="M18 10H62V30C62 46 52 56 40 56C28 56 18 46 18 30z" fill="#F2C066"/>'
    + '<path d="M24 15V30C24 38 27.5 44 32 47.5" stroke="#FFE6A8" stroke-width="3" fill="none" stroke-linecap="round"/>'
    + '<text x="41" y="39" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="18" fill="#1F3864">#1</text>'
    + '<rect x="35" y="55" width="10" height="12" fill="#E0A93B"/><rect x="25" y="66" width="30" height="8" rx="2" fill="#E0A93B"/>'
    + '<rect x="18" y="74" width="44" height="17" rx="3" fill="#F07A1E"/><rect x="28" y="79" width="24" height="7" rx="1.5" fill="#F2C066"/>'
    + '<g class="pt-padre-brillo" fill="#fff">' + PADRE_CHISPA(10, 8, 4.5) + PADRE_CHISPA(71, 4.5, 3.4) + PADRE_CHISPA(72, 52, 3) + '</g>' };
  var PADRE_J = { vb: '0 0 18 20', g: '<path d="M2 2.5Q9 5.5 16 2.5V4.6Q9 7.6 2 4.6z" fill="#fff" stroke="#C9D1DE" stroke-width=".6"/>'
    + '<g class="pt-padre-corbata"><path d="M7.7 7.6H10.3L12.8 15.8L9 19.4L5.2 15.8z" fill="#F07A1E"/>' + PADRE_RAYAS(9, 7.6, 15.8, 1.3, 3.8, [11, 14], .9, .55, '#1F3864') + '</g>'
    + '<path d="M7 5.4H11L10.3 8H7.7z" fill="#D9650C"/>'
    + '<path d="M9 5.6 3 3.2 4.4 8.6z M9 5.6 15 3.2 13.6 8.6z" fill="#fff" stroke="#C9D1DE" stroke-width=".6" stroke-linejoin="round"/>' };
  // estrella de cinco picos (centro, radio de las puntas y de adentro); también la usa el Día del Abogado
  function PADRE_ESTRELLA(cx, cy, R, r) {
    var d = '', i, a;
    for (i = 0; i < 10; i++) { a = (-90 + i * 36) * Math.PI / 180; d += (i ? 'L' : 'M') + (cx + Math.cos(a) * (i % 2 ? r : R)).toFixed(2) + ' ' + (cy + Math.sin(a) * (i % 2 ? r : R)).toFixed(2); }
    return d + 'z';
  }
  // lo que cae al fondo de la entrada: corbatitas, bigotes y estrellas doradas con «#1»
  var PADRE_LLUEVE = { n: 22, z: [14, 28], formas: [
    { modo: 'cae', vb: '0 0 16 24', g: '<path d="M6 6.2H10L12.6 18L8 23.2L3.4 18z" fill="#F07A1E"/>' + PADRE_RAYAS(8, 6.2, 18, 2, 4.6, [10, 14.6], 1.8, .95, '#1F3864')
      + '<path d="M5 1.4H11L10 6.4H6z" fill="#D9650C"/><path d="M6.4 2.6H9.4" stroke="#FFA65C" stroke-width=".8" stroke-linecap="round"/>' },
    { modo: 'cae', vb: '0 -5 24 22', g: '<path d="M12 4.4C10 1.8 6.4 2.2 5 4.8C4 6.6 2.6 7.2 .8 6.2C1.4 9.2 4.6 10.8 7.6 9.8C9.6 9.2 11 8 12 7C13 8 14.4 9.2 16.4 9.8C19.4 10.8 22.6 9.2 23.2 6.2C21.4 7.2 20 6.6 19 4.8C17.6 2.2 14 1.8 12 4.4z" fill="#C4844A" stroke="#F2C08C" stroke-width=".8" stroke-linejoin="round"/>'
      + '<path d="M7 5.6Q9 4.6 10.6 6M17 5.6Q15 4.6 13.4 6" stroke="#F2C08C" stroke-width=".9" fill="none" stroke-linecap="round"/>' },
    { modo: 'flota', vb: '0 0 24 24', g: '<path d="' + PADRE_ESTRELLA(12, 12.8, 11.4, 5.8) + '" fill="#FFCB47" stroke="#FFCB47" stroke-width="1.6" stroke-linejoin="round"/>'
      + '<path d="M12 4.4 13.9 9.6" stroke="#FFE6A8" stroke-width="1.1" stroke-linecap="round"/>'
      + '<text x="12" y="16" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="7.6" fill="#1F3864">#1</text>' }] };
  alta('padre',
    { m: PADRE_M, m2: PADRE_M2, j: PADRE_J, mov: 'flota', mov2: 'brinca', jmov: 'flota', lluvia: PADRE_LLUEVE, w: 86, w2: 84,
      dice: ['¡Gracias, papá!', '¡Te queremos!', '¡Papá número 1!', '¡El mejor papá!'] });
  CSS_FECHAS += '.pt-padre-corbata{transform-box:fill-box;transform-origin:50% 0;animation:pt-padre-corbata 2s ease-in-out infinite alternate}'
    + '@keyframes pt-padre-corbata{from{transform:rotate(-8deg)}to{transform:rotate(8deg)}}'
    + '.pt-padre-brillo{transform-box:fill-box;transform-origin:50% 50%;animation:pt-padre-brillo 1.4s ease-in-out infinite alternate}'
    + '@keyframes pt-padre-brillo{from{opacity:.2;transform:scale(.8)}to{opacity:1;transform:scale(1.05)}}';

  // ---------- Inicio del verano (21 de junio): sol con lentes oscuros cuyos rayos giran y sombrilla de playa ----------
  // rayos alternados (largos y cortos), parejos para que giren sobre su centro
  function VERANO_RAYOS(cx, cy, n, r0, r1, r2, w1, w2, c1, c2) {
    var h = '', i, a, r, c, w;
    for (i = 0; i < n; i++) {
      a = i * 2 * Math.PI / n; r = i % 2 ? r2 : r1; c = i % 2 ? c2 : c1; w = i % 2 ? w2 : w1;
      h += '<path d="M' + (cx + Math.cos(a) * r0).toFixed(2) + ' ' + (cy + Math.sin(a) * r0).toFixed(2) + 'L' + (cx + Math.cos(a) * r).toFixed(2) + ' ' + (cy + Math.sin(a) * r).toFixed(2) + '" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round"/>';
    }
    return h;
  }
  var VERANO_M = { vb: '0 0 100 100', g: '<g class="pt-verano-rayos">' + VERANO_RAYOS(50, 50, 16, 36, 47, 42, 5.5, 4.5, '#F07A1E', '#FFC83D') + '</g>'
    + '<circle cx="50" cy="50" r="31" fill="#FFC83D"/><path d="M78 37A31 31 0 0 1 40 79.4A40 40 0 0 0 78 37z" fill="#F5AE22" opacity=".7"/>'
    + '<ellipse cx="38" cy="30" rx="8" ry="4" transform="rotate(-30 38 30)" fill="#fff" opacity=".4"/>'
    + '<path d="M27 43.5 20.5 41.5M73 43.5 79.5 41.5M47 43Q50 40.6 53 43" stroke="#1F3864" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
    + '<path d="M27 41H47Q48 41 47.5 44L46 50Q45 55 38 55Q31 55 29 50L26.5 44Q26 41 27 41zM53 41H73Q74 41 73.5 44L71 50Q69 55 62 55Q55 55 54 50L52.5 44Q52 41 53 41z" fill="#1F3864"/>'
    + '<path d="M30.5 47.5l4.5-4M56.5 47.5l4.5-4" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>'
    + '<path d="M37 63Q50 73 63 63" stroke="#B5521B" stroke-width="3.4" fill="none" stroke-linecap="round"/>'
    + '<circle cx="29" cy="60" r="4.4" fill="#F07A1E" opacity=".4"/><circle cx="71" cy="60" r="4.4" fill="#F07A1E" opacity=".4"/>' };
  // la sombrilla: gajos naranja y blanco del centro a la orilla (con ondas abajo)
  function VERANO_SOMBRILLA() {
    var R = [8, 20.33, 32.67, 45, 57.33, 69.67, 82], h = '', k;
    function va(i) { return i === 0 ? 'C24 12 10 26 8 40' : i === 6 ? 'C66 12 80 26 82 40' : 'Q' + (45 + (R[i] - 45) * .62).toFixed(1) + ' 22 ' + R[i] + ' 40'; }
    function vuelve(i) { return i === 0 ? 'C10 26 24 12 45 10' : i === 6 ? 'C80 26 66 12 45 10' : 'Q' + (45 + (R[i] - 45) * .62).toFixed(1) + ' 22 45 10'; }
    for (k = 0; k < 6; k++) {
      h += '<path d="M45 10' + va(k) + 'Q' + ((R[k] + R[k + 1]) / 2).toFixed(2) + ' 45.5 ' + R[k + 1] + ' 40' + vuelve(k + 1) + 'z" fill="' + (k % 2 ? '#fff' : '#F07A1E') + '"/>';
    }
    return '<path d="M45 12V95" stroke="#E6ECF4" stroke-width="3.2" stroke-linecap="round"/><g stroke="#C9D1DE" stroke-width=".8" stroke-linejoin="round">' + h + '</g><circle cx="45" cy="9" r="2.8" fill="#F2C066"/>';
  }
  var VERANO_M2 = { vb: '0 0 100 100', g: '<path d="M2 95Q50 82 98 95Q98 99 94 99H6Q2 99 2 95z" fill="#F2D49B"/>'
    + '<g transform="rotate(8 42 96)">' + VERANO_SOMBRILLA() + '</g>'
    + '<circle cx="20" cy="88" r="8" fill="#fff"/><path d="M20 80C13 82 13 94 20 96C16.5 92 16.5 84 20 80z" fill="#F07A1E"/><path d="M20 80C27 82 27 94 20 96C23.5 92 23.5 84 20 80z" fill="#2E86DE"/>'
    + '<circle cx="20" cy="88" r="8" fill="none" stroke="#C9D1DE" stroke-width=".8"/>' };
  var VERANO_J = { vb: '0 0 20 20', g: '<g class="pt-verano-rayos">' + VERANO_RAYOS(10, 10, 8, 7.4, 9.5, 9.5, 1.6, 1.6, '#F07A1E', '#F07A1E') + '</g>'
    + '<circle cx="10" cy="10" r="6.2" fill="#FFC83D" stroke="#E8A317" stroke-width=".5"/>'
    + '<path d="M5.2 8.4H9.4L9 10.4Q8.6 11.4 7.3 11.4Q6 11.4 5.6 10.4zM10.6 8.4H14.8L14.4 10.4Q14 11.4 12.7 11.4Q11.4 11.4 11 10.4z" fill="#1F3864"/>'
    + '<path d="M9.4 8.7H10.6" stroke="#1F3864" stroke-width=".7"/><path d="M7.8 13.3Q10 14.8 12.2 13.3" stroke="#B5521B" stroke-width=".9" fill="none" stroke-linecap="round"/>' };
  // lo que cae al fondo de la entrada: solecitos, conchitas y gotas de agua
  var VERANO_LLUEVE = { n: 24, z: [11, 22], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: VERANO_RAYOS(10, 10, 12, 6.8, 9.4, 8.6, 1.7, 1.4, '#F07A1E', '#FFC83D')
      + '<circle cx="10" cy="10" r="5.6" fill="#FFC83D"/><path d="M7 8.2A3.4 3.4 0 0 1 9.4 6.6" stroke="#FFF1B0" stroke-width="1.1" fill="none" stroke-linecap="round"/>' },
    { modo: 'cae', vb: '0 0 20 20', g: '<path d="M7.6 16.6H12.4L13 18.8H7z" fill="#F29B6B"/>'
      + '<path d="M10 17 2.6 8.8C2.2 4.8 5.8 1.8 10 1.8C14.2 1.8 17.8 4.8 17.4 8.8z" fill="#FFD3B0" stroke="#F29B6B" stroke-width=".7" stroke-linejoin="round"/>'
      + '<path d="M10 16.2 4.2 6.4M10 16.2 7 3M10 16.2V2.4M10 16.2 13 3M10 16.2 15.8 6.4" stroke="#F29B6B" stroke-width=".8" stroke-linecap="round"/>' },
    { modo: 'gotea', vb: '0 0 14 20', g: CHURRO_GOTA('#6EC6F5', '#fff') }] };
  alta('verano',
    { m: VERANO_M, m2: VERANO_M2, j: VERANO_J, mov: 'flota', mov2: 'mece', jmov: 'flota', lluvia: VERANO_LLUEVE, w: 100, w2: 100,
      dice: ['¡Qué calor!', '¡Ponte bloqueador!', '¡A la playa!', '¡Vacaciones!'] });
  CSS_FECHAS += '.pt-verano-rayos{transform-box:fill-box;transform-origin:50% 50%;animation:pt-verano-rayos 10s linear infinite}'
    + '@keyframes pt-verano-rayos{to{transform:rotate(360deg)}}';

  // ---------- Día de las Redes Sociales (30 de junio): globito de aviso con corazón que late y un celular; corazones ----------
  var REDES_CORA = 'M8 14.2S1.4 10.1 1.4 5.6A3.5 3.5 0 0 1 8 4a3.5 3.5 0 0 1 6.6 1.6C14.6 10.1 8 14.2 8 14.2z';
  var REDES_M = { vb: '0 0 100 90', g: '<path d="M28 8H72Q90 8 90 26V50Q90 68 72 68H44L25 85L30 68H28Q10 68 10 50V26Q10 8 28 8z" fill="#F07A1E"/>'
    + '<path d="M18 32Q18 17 31 16" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".35"/>'
    + '<g class="pt-redes-cora"><path transform="translate(26 13) scale(3)" d="' + REDES_CORA + '" fill="#fff"/></g>'
    + '<g class="pt-redes-pop" stroke="#F2C066" stroke-width="2.6" stroke-linecap="round"><path d="M88 6l6-5M93 14h6M80 3l1-3"/></g>' };
  var REDES_M2 = { vb: '0 0 70 100', g: '<rect x="8" y="3" width="54" height="94" rx="10" fill="#33589B" stroke="#8FB0E0" stroke-width="2"/>'
    + '<rect x="13" y="13" width="44" height="72" rx="4" fill="#EAF2FC"/><rect x="28" y="7" width="14" height="2.6" rx="1.3" fill="#8FB0E0"/><rect x="27" y="89.5" width="16" height="2.6" rx="1.3" fill="#8FB0E0"/>'
    + '<circle cx="19.5" cy="23" r="3.2" fill="#F2C066"/><rect x="25" y="19" width="26" height="8.5" rx="4.25" fill="#F07A1E"/>'
    + '<rect x="19" y="32" width="26" height="8.5" rx="4.25" fill="#7FB2EA"/><circle cx="50.5" cy="36.2" r="3.2" fill="#5BD69A"/>'
    + '<circle cx="19.5" cy="49" r="3.2" fill="#F2C066"/><rect x="25" y="45" width="18" height="8.5" rx="4.25" fill="#F07A1E"/>'
    + '<g fill="#C9D1DE"><circle cx="20" cy="78" r="1.6"/><circle cx="26" cy="78" r="1.6"/><circle cx="32" cy="78" r="1.6"/></g>'
    + '<g class="pt-redes-sube"><path transform="translate(36 62) scale(1)" d="' + REDES_CORA + '" fill="#E8418C"/></g>'
    + '<g class="pt-redes-sube2"><path transform="translate(46 70) scale(.7)" d="' + REDES_CORA + '" fill="#F07A1E"/></g>' };
  var REDES_J = { vb: '0 0 20 18', g: '<path d="M4 1.5H16Q18.5 1.5 18.5 4V10.5Q18.5 13 16 13H8.4L4.4 16.6L5.2 13H4Q1.5 13 1.5 10.5V4Q1.5 1.5 4 1.5z" fill="#F07A1E"/>'
    + '<g class="pt-redes-cora"><path transform="translate(5.6 2.4) scale(.55)" d="' + REDES_CORA + '" fill="#fff"/></g>' };
  // lo que cae al fondo de la entrada: corazones (rosa y naranja) y globitos de mensaje con sus tres puntitos
  function REDES_CORAZON(c) {
    return '<path d="' + REDES_CORA + '" fill="' + c + '"/><path d="M3.6 5.6A2.2 2.2 0 0 1 5.6 3.9" stroke="#fff" stroke-width="1" fill="none" stroke-linecap="round" opacity=".75"/>';
  }
  var REDES_LLUEVE = { n: 22, z: [12, 24], formas: [
    { modo: 'flota', vb: '0 1.6 16 14', g: REDES_CORAZON('#E8418C') },
    { modo: 'cae', vb: '0 0 20 18', g: '<path d="M4 1.5H16Q18.5 1.5 18.5 4V10.5Q18.5 13 16 13H8.4L4.4 16.6L5.2 13H4Q1.5 13 1.5 10.5V4Q1.5 1.5 4 1.5z" fill="#fff"/>'
      + '<g fill="#F07A1E"><circle cx="6.2" cy="7.3" r="1.35"/><circle cx="10" cy="7.3" r="1.35"/><circle cx="13.8" cy="7.3" r="1.35"/></g>' },
    { modo: 'flota', vb: '0 1.6 16 14', g: REDES_CORAZON('#F07A1E') },
    { modo: 'cae', vb: '0 0 20 18', g: '<path d="M4 1.5H16Q18.5 1.5 18.5 4V10.5Q18.5 13 16 13H11.6L15.6 16.6L14.8 13H4Q1.5 13 1.5 10.5V4Q1.5 1.5 4 1.5z" fill="#7FB2EA"/>'
      + '<path d="M5 5.6H15M5 9H11.4" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>' }] };
  alta('redes',
    { m: REDES_M, m2: REDES_M2, j: REDES_J, mov: 'flota', mov2: 'brinca', jmov: 'flota', lluvia: REDES_LLUEVE, w2: 72,
      dice: ['¡Me encanta!', '¡Nuevo mensaje!', '¡Comparte!', '¡Dale me gusta!'] });
  CSS_FECHAS += '.pt-redes-cora{transform-box:fill-box;transform-origin:50% 55%;animation:pt-redes-cora 1.4s ease-in-out infinite}'
    + '@keyframes pt-redes-cora{0%,100%{transform:scale(1)}15%{transform:scale(1.2)}30%{transform:scale(.95)}45%{transform:scale(1.12)}60%{transform:scale(1)}}'
    + '.pt-redes-pop{animation:pt-redes-pop 1.4s ease-in-out infinite}@keyframes pt-redes-pop{0%,100%{opacity:.2}15%,45%{opacity:1}}'
    + '.pt-redes-sube,.pt-redes-sube2{transform-box:fill-box;animation:pt-redes-sube 2.6s ease-out infinite}.pt-redes-sube2{animation-delay:-1.3s}'
    + '@keyframes pt-redes-sube{0%{opacity:0;transform:translateY(40%) scale(.7)}25%{opacity:1}100%{opacity:0;transform:translateY(-160%) scale(1.1)}}';

  // ---------- Día del Ingeniero (1 de julio): dos engranes que giran al revés uno del otro y planos con escuadra ----------
  // engrane con n dientes (radio de paso rp, alto de diente 2h); fase: ángulo del primer diente. Va centrado en su caja para girar.
  function INGENIERO_ENGRANE(cx, cy, n, rp, h, fase, hoyos, color, aro, cls) {
    var p = 360 / n, a1 = p * .27, a2 = p * .16, ri = rp - h, ro = rp + h, d = '', i, c, t, rh = Math.max(ri * .2, .9);
    function pt(r, g) { var u = g * Math.PI / 180; return (cx + r * Math.cos(u)).toFixed(2) + ' ' + (cy + r * Math.sin(u)).toFixed(2); }
    function circ(x, y, r) { return 'M' + (x + r).toFixed(2) + ' ' + y.toFixed(2) + 'a' + r.toFixed(2) + ' ' + r.toFixed(2) + ' 0 1 0 ' + (-2 * r).toFixed(2) + ' 0a' + r.toFixed(2) + ' ' + r.toFixed(2) + ' 0 1 0 ' + (2 * r).toFixed(2) + ' 0z'; }
    for (i = 0; i < n; i++) {
      c = fase + i * p;
      d += (i ? 'L' : 'M') + pt(ri, c - a1) + 'L' + pt(ro, c - a2) + 'L' + pt(ro, c + a2) + 'L' + pt(ri, c + a1) + 'A' + ri + ' ' + ri + ' 0 0 1 ' + pt(ri, c + p - a1);
    }
    d += 'z' + circ(cx, cy, rh);
    for (i = 0; i < hoyos; i++) { t = (45 + i * 360 / hoyos) * Math.PI / 180; d += circ(cx + ri * .56 * Math.cos(t), cy + ri * .56 * Math.sin(t), ri * .17); }
    return '<g class="' + cls + '"><path d="' + d + '" fill="' + color + '" fill-rule="evenodd" stroke="' + color + '" stroke-width="' + (h * .3).toFixed(2) + '" stroke-linejoin="round"/>'
      + (aro ? '<circle cx="' + cx + '" cy="' + cy + '" r="' + (rh * 1.9).toFixed(2) + '" fill="none" stroke="' + aro + '" stroke-width="' + (rh * .6).toFixed(2) + '"/>' : '') + '</g>';
  }
  var INGENIERO_M = { vb: '0 0 100 90', g: INGENIERO_ENGRANE(36, 54, 12, 24, 3.6, 0, 4, '#F07A1E', '#C95F0E', 'pt-ingeniero-g1')
    + INGENIERO_ENGRANE(71.51, 33.5, 8, 16, 3.6, 37.5, 0, '#8FB8EE', '#5B86C4', 'pt-ingeniero-g2') };
  // los planos: hoja azul con cuadrícula y un puente, la escuadra encima y el lápiz que traza
  function INGENIERO_PLANO() {
    var h = '<g stroke="#5B92D6" stroke-width=".7">', x, y;
    for (x = 20; x <= 84; x += 8) h += '<path d="M' + x + ' 10V70"/>';
    for (y = 16; y <= 64; y += 8) h += '<path d="M12 ' + y + 'H86"/>';
    return h + '</g>';
  }
  var INGENIERO_M2 = { vb: '0 0 100 84', g: '<rect x="8" y="8" width="80" height="64" rx="3" fill="#2E6DB4"/>' + INGENIERO_PLANO()
    + '<rect x="3" y="6" width="10" height="68" rx="5" fill="#5B92D6"/><path d="M8 9V71" stroke="#3D78C4" stroke-width="1.4"/>'
    + '<g stroke="#fff" fill="none" stroke-linecap="round"><path d="M20 50H78M24 50Q49 18 74 50M24 50V60M74 50V60" stroke-width="2.2"/>'
    + '<path d="M32 41.4V50M40 36.1V50M49 34V50M58 36.1V50M66 41.4V50" stroke-width="1.3"/>'
    + '<path d="M24 26H74M24 23V29M74 23V29" stroke-width="1" opacity=".85"/></g>'
    + '<path d="M14 62H86" stroke="#9EC3EE" stroke-width="1.2" stroke-dasharray="3 2"/>'
    + '<path d="M50 78H92V36zM61 74H88V47z" fill="#F2C066" fill-rule="evenodd" opacity=".95"/>'
    + '<path d="M56 78v-3M62 78v-3M68 78v-3M74 78v-3M80 78v-3M86 78v-3" stroke="#B9862A" stroke-width="1"/>'
    + '<g class="pt-ingeniero-lapiz"><g transform="rotate(-40 84 14)"><rect x="70" y="10.5" width="25" height="7" fill="#F07A1E"/><path d="M70 10.5 62 14 70 17.5z" fill="#F4D7A8"/>'
    + '<path d="M62 14 65.2 12.6V15.4z" fill="#4A4F5C"/><rect x="94" y="10.5" width="2.6" height="7" fill="#C9D1DE"/><rect x="96" y="10.5" width="4.5" height="7" rx="1.6" fill="#E8418C"/>'
    + '<path d="M71 14H94" stroke="#FFA65C" stroke-width="1.2"/></g></g>' };
  // junto al signo, en diagonal para que los engranes salgan más grandes (un diente del naranja entra entre dos del azul)
  var INGENIERO_J = { vb: '0 -.3 19 21.3', g: INGENIERO_ENGRANE(7.2, 13.9, 8, 5.6, 1.25, -10, 0, '#F07A1E', '', 'pt-ingeniero-j1')
    + INGENIERO_ENGRANE(13.05, 5.55, 6, 4.2, 1.25, 35, 0, '#4F7CC4', '', 'pt-ingeniero-j2') };
  // lo que cae al fondo de la entrada: tuercas plateadas, tornillos y cabezas de tornillo doradas (de cruz)
  var INGENIERO_LLUEVE = { n: 24, z: [12, 24], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: '<path d="M19 10 14.5 17.8H5.5L1 10 5.5 2.2H14.5zM14.2 10A4.2 4.2 0 1 0 5.8 10A4.2 4.2 0 1 0 14.2 10z" fill="#C9D1DE" fill-rule="evenodd" stroke="#8A98B0" stroke-width=".8" stroke-linejoin="round"/>'
      + '<circle cx="10" cy="10" r="6.6" fill="none" stroke="#E6ECF4" stroke-width=".9"/><circle cx="10" cy="10" r="4.6" fill="none" stroke="#8A98B0" stroke-width="1"/>'
      + '<path d="M2.4 9.4 5.9 3.2H13.6" stroke="#fff" stroke-width=".8" fill="none" stroke-linecap="round" opacity=".7"/>' },
    { modo: 'cae', vb: '0 0 20 20', g: '<g transform="rotate(-40 10 10)"><rect x="8.2" y="6" width="3.6" height="12.6" rx=".6" fill="#C9D1DE"/>'
      + '<path d="M8.2 8.4 11.8 7.4M8.2 10.4 11.8 9.4M8.2 12.4 11.8 11.4M8.2 14.4 11.8 13.4M8.2 16.4 11.8 15.4" stroke="#8A98B0" stroke-width=".8"/>'
      + '<rect x="5.6" y="1.4" width="8.8" height="4.8" rx=".9" fill="#A9B6C9" stroke="#8A98B0" stroke-width=".6"/><path d="M8.6 1.6V6M11.4 1.6V6" stroke="#E6ECF4" stroke-width=".7"/></g>' },
    { modo: 'cae', vb: '0 0 20 20', g: '<circle cx="10" cy="10" r="8" fill="#F2C066" stroke="#C99A3A" stroke-width=".9"/><circle cx="10" cy="10" r="6.2" fill="none" stroke="#FFE6A8" stroke-width=".8"/>'
      + '<path d="M10 5.6V14.4M5.6 10H14.4" stroke="#A87A26" stroke-width="2.1" stroke-linecap="round"/>' }] };
  alta('ingeniero',
    { m: INGENIERO_M, m2: INGENIERO_M2, j: INGENIERO_J, mov: 'flota', mov2: 'mece', jmov: 'flota', lluvia: INGENIERO_LLUEVE,
      dice: ['¡Todo bien calculado!', '¡A construir!', '¡Medido y trazado!', '¡Feliz día, ingenieros!'] });
  CSS_FECHAS += '.pt-ingeniero-g1,.pt-ingeniero-g2,.pt-ingeniero-j1,.pt-ingeniero-j2{transform-box:fill-box;transform-origin:50% 50%;animation:pt-ingeniero-der 9s linear infinite}'
    + '.pt-ingeniero-g2{animation-name:pt-ingeniero-izq;animation-duration:6s}.pt-ingeniero-j1{animation-duration:6s}.pt-ingeniero-j2{animation-name:pt-ingeniero-izq;animation-duration:4.5s}'
    + '@keyframes pt-ingeniero-der{to{transform:rotate(360deg)}}@keyframes pt-ingeniero-izq{to{transform:rotate(-360deg)}}'
    + '.pt-ingeniero-lapiz{transform-box:fill-box;animation:pt-ingeniero-lapiz .9s ease-in-out infinite alternate}'
    + '@keyframes pt-ingeniero-lapiz{from{transform:translate(0,0)}to{transform:translate(-7%,6%)}}';

  // ---------- Día del OVNI (2 de julio): platillo volador con lucecitas que parpadean y un marcianito; estrellas ----------
  // el rayo de luz: franjas que se van apagando hacia abajo (de y0 a y1, medio ancho a0 arriba y a1 abajo)
  function OVNI_RAYO(cx, y0, y1, a0, a1, ops, color) {
    var h = '', n = ops.length, i, ya, yb, wa, wb;
    for (i = 0; i < n; i++) {
      ya = y0 + (y1 - y0) * i / n; yb = y0 + (y1 - y0) * (i + 1) / n;
      wa = a0 + (a1 - a0) * i / n; wb = a0 + (a1 - a0) * (i + 1) / n;
      h += '<path d="M' + (cx - wa).toFixed(2) + ' ' + ya.toFixed(2) + 'H' + (cx + wa).toFixed(2) + 'L' + (cx + wb).toFixed(2) + ' ' + yb.toFixed(2) + 'H' + (cx - wb).toFixed(2) + 'z" fill="' + color + '" opacity="' + ops[i] + '"/>';
    }
    return h;
  }
  function OVNI_LUCES(cx, cy, rx, ry, xs, r) {
    var cs = ['#F2C066', '#F07A1E', '#5BD69A', '#E8418C'], h = '';
    xs.forEach(function (x, i) {
      var y = cy + ry * Math.sqrt(Math.max(0, 1 - Math.pow((x - cx) / rx, 2)));
      h += '<circle class="pt-ovni-l' + (i % 3 + 1) + '" cx="' + x + '" cy="' + y.toFixed(2) + '" r="' + r + '" fill="' + cs[i % 4] + '"/>';
    });
    return h;
  }
  var OVNI_M = { vb: '0 0 100 80', g: '<g class="pt-ovni-rayo">' + OVNI_RAYO(50, 46, 79, 12, 28, ['.8', '.5', '.3', '.15'], '#FFF1A8') + '</g>'
    + '<path d="M50 14V7" stroke="#C9D1DE" stroke-width="2" stroke-linecap="round"/><circle cx="50" cy="6" r="3" fill="#F07A1E"/>'
    + '<circle cx="50" cy="26" r="7.5" fill="#7ED957"/><circle cx="47" cy="25" r="2" fill="#1A2333"/><circle cx="53" cy="25" r="2" fill="#1A2333"/><path d="M47.5 29.4q2.5 2 5 0" stroke="#2E6B2E" stroke-width="1.2" fill="none" stroke-linecap="round"/>'
    + '<path d="M31 32C31 12 69 12 69 32z" fill="#9BE7EF" opacity=".45"/><path d="M37 20Q41 15.5 47 15" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>'
    + '<ellipse cx="50" cy="38" rx="45" ry="12" fill="#C9D1DE"/><ellipse cx="50" cy="34" rx="31" ry="6" fill="#E6ECF4"/>'
    + '<ellipse cx="50" cy="45.5" rx="22" ry="4.6" fill="#8A98B0"/>'
    + OVNI_LUCES(50, 38, 45, 12, [14, 26, 38, 50, 62, 74, 86], 2.8) };
  var OVNI_M2 = { vb: '0 0 80 100', g: '<g fill="none" stroke="#7ED957" stroke-width="3.4" stroke-linecap="round"><path d="M31 22 23 7M49 22 57 7"/></g>'
    + '<g class="pt-ovni-ant"><circle cx="23" cy="6" r="4.5" fill="#F07A1E"/><circle cx="57" cy="6" r="4.5" fill="#F2C066"/></g>'
    + '<path d="M20 60Q11 66 12 76" stroke="#7ED957" stroke-width="6" fill="none" stroke-linecap="round"/>'
    + '<g class="pt-ovni-brazo"><path d="M60 58Q70 50 70 40" stroke="#7ED957" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="70" cy="37.5" r="4.6" fill="#7ED957"/></g>'
    + '<ellipse cx="31" cy="92" rx="8" ry="4.5" fill="#5DBB3F"/><ellipse cx="49" cy="92" rx="8" ry="4.5" fill="#5DBB3F"/>'
    + '<path d="M40 18C58 18 64 34 62 54C60 76 54 90 40 90C26 90 20 76 18 54C16 34 22 18 40 18z" fill="#7ED957"/>'
    + '<ellipse cx="40" cy="72" rx="13" ry="12" fill="#B8F09A"/>'
    + '<g fill="#5DBB3F"><circle cx="30" cy="27" r="2"/><circle cx="51" cy="25" r="1.6"/><circle cx="55" cy="31" r="1.2"/></g>'
    + '<ellipse cx="31.5" cy="41" rx="7" ry="8.5" fill="#fff"/><ellipse cx="48.5" cy="41" rx="7" ry="8.5" fill="#fff"/>'
    + '<circle cx="32.5" cy="42.5" r="4" fill="#1A2333"/><circle cx="47.5" cy="42.5" r="4" fill="#1A2333"/><circle cx="31.2" cy="40.6" r="1.4" fill="#fff"/><circle cx="46.2" cy="40.6" r="1.4" fill="#fff"/>'
    + '<path d="M33.5 56Q40 62 46.5 56" stroke="#2E6B2E" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    + '<circle cx="25" cy="53" r="2.8" fill="#F29BC4" opacity=".85"/><circle cx="55" cy="53" r="2.8" fill="#F29BC4" opacity=".85"/>' };
  var OVNI_J = { vb: '0 0 20 15', g: '<g class="pt-ovni-rayo">' + OVNI_RAYO(10, 10.6, 15, 2, 4.6, ['.95', '.55'], '#FFD95A') + '</g>'
    + '<path d="M6.4 7C6.4 2.2 13.6 2.2 13.6 7z" fill="#9BE7EF" stroke="#4FB0BC" stroke-width=".55"/>'
    + '<ellipse cx="10" cy="8.4" rx="9.2" ry="3" fill="#A9B6C9"/><ellipse cx="10" cy="7.5" rx="6" ry="1.5" fill="#E6ECF4"/>'
    + OVNI_LUCES(10, 8.4, 9.2, 3, [3.6, 7.8, 12.2, 16.4], .95) };
  alta('ovni',
    { m: OVNI_M, m2: OVNI_M2, j: OVNI_J, mov: 'vuela', mov2: 'brinca', jmov: 'flota', lluvia: 'estrellas', w: 110, w2: 82,
      dice: ['¡Bip, bip!', '¡Venimos en paz!', '¡Hola, terrícolas!', '¡Llévame contigo!'] });
  CSS_FECHAS += '.pt-ovni-l1,.pt-ovni-l2,.pt-ovni-l3{animation:pt-ovni-luz 1.2s ease-in-out infinite}.pt-ovni-l2{animation-delay:-.4s}.pt-ovni-l3{animation-delay:-.8s}'
    + '@keyframes pt-ovni-luz{0%,100%{opacity:1}50%{opacity:.25}}'
    + '.pt-ovni-rayo{animation:pt-ovni-rayo 1.6s ease-in-out infinite alternate}@keyframes pt-ovni-rayo{from{opacity:.55}to{opacity:1}}'
    + '.pt-ovni-ant{animation:pt-ovni-luz .9s ease-in-out infinite}'
    + '.pt-ovni-brazo{transform-box:fill-box;transform-origin:0 100%;animation:pt-ovni-brazo .6s ease-in-out infinite alternate}'
    + '@keyframes pt-ovni-brazo{from{transform:rotate(-14deg)}to{transform:rotate(16deg)}}';

  // ---------- Día del Chocolate (7 de julio): barra de chocolate que se derrite y taza humeante ----------
  var CHOCOLATE_M = { vb: '0 0 90 100', g: '<g transform="rotate(-8 45 50)">'
    + '<path d="M20 15Q22 7 30 9Q38 5 46 9Q56 6 62 9Q70 9 70 17V60H20z" fill="#7A4524" stroke="#A86A3E" stroke-width="1.4"/>'
    + '<g fill="#8E5530"><rect x="24" y="16" width="19" height="15" rx="2"/><rect x="47" y="16" width="19" height="15" rx="2"/><rect x="24" y="35" width="19" height="15" rx="2"/><rect x="47" y="35" width="19" height="15" rx="2"/></g>'
    + '<path d="M25 30V17H42M48 30V17H65M25 49V36H42M48 49V36H65" stroke="#B57A4A" stroke-width="1.2" fill="none" stroke-linecap="round"/>'
    + '<path d="M18 52l4.5-5 4.5 5 4.5-5 4.5 5 4.5-5 4.5 5 4.5-5 4.5 5 4.5-5 4.5 5 4.5-5 4.5 5V58H18z" fill="#DDE4EE"/>'
    + '<rect x="18" y="55" width="54" height="39" rx="4" fill="#F07A1E"/><rect x="18" y="66" width="54" height="14" fill="#1F3864"/>'
    + '<path d="M24 73q5-5 10 0t10 0 10 0 10 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>'
    + '<path d="M22 88h46" stroke="#FFB774" stroke-width="1.4" stroke-dasharray="3 3"/>'
    + '<g class="pt-chocolate-gota"><path d="M27 52v10a3.2 3.2 0 0 0 6.4 0V52z" fill="#7A4524"/></g>'
    + '<g class="pt-chocolate-gota pt-chocolate-tarde"><path d="M46 52v16a3.4 3.4 0 0 0 6.8 0V52z" fill="#7A4524"/></g>'
    + '<g class="pt-chocolate-gota"><path d="M61 52v6a2.6 2.6 0 0 0 5.2 0V52z" fill="#7A4524"/></g>'
    + '<g class="pt-chocolate-cae"><path d="M49.4 76c-2 3-3 4.6-3 6a3 3 0 0 0 6 0c0-1.4-1-3-3-6z" fill="#8E5530"/></g>'
    + '</g>' };
  var CHOCOLATE_M2 = { vb: '0 0 90 100', g: '<g class="pt-chocolate-humo" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".75"><path d="M28 28q-4-5 0-10t0-10M40 26q-4-5 0-10t0-10M52 28q-4-5 0-10t0-10"/></g>'
    + '<ellipse cx="40" cy="92" rx="34" ry="5" fill="#C9D1DE"/>'
    + '<path d="M64 44C82 44 82 74 64 74" stroke="#F07A1E" stroke-width="7" fill="none" stroke-linecap="round"/>'
    + '<path d="M16 34H64V78Q64 90 52 90H28Q16 90 16 78z" fill="#F07A1E"/>'
    + '<ellipse cx="40" cy="34" rx="24" ry="5" fill="#C95F0E"/><ellipse cx="40" cy="34.6" rx="21" ry="3.8" fill="#5A2E17"/>'
    + '<rect x="27" y="30.4" width="8" height="5.4" rx="1.6" fill="#fff"/><rect x="41" y="31.4" width="7" height="4.8" rx="1.6" fill="#FCE7F0"/><rect x="34" y="28.6" width="6" height="4" rx="1.4" fill="#fff"/>'
    + '<path transform="translate(28.5 47) scale(1.45)" d="M8 14.2S1.4 10.1 1.4 5.6A3.5 3.5 0 0 1 8 4a3.5 3.5 0 0 1 6.6 1.6C14.6 10.1 8 14.2 8 14.2z" fill="#fff"/>'
    + '<path d="M21 42V78" stroke="#FFA65C" stroke-width="2.4" stroke-linecap="round"/>' };
  var CHOCOLATE_J = { vb: '0 0 20 18', g: '<rect x="1.5" y="3" width="10.2" height="11" rx="1.2" fill="#7A4524" stroke="#A86A3E" stroke-width=".55"/>'
    + '<g fill="#93592F"><rect x="2.5" y="4" width="3.8" height="4.1" rx=".5"/><rect x="7" y="4" width="3.8" height="4.1" rx=".5"/><rect x="2.5" y="8.9" width="3.8" height="4.1" rx=".5"/><rect x="7" y="8.9" width="3.8" height="4.1" rx=".5"/></g>'
    + '<path d="M11.2 2.6l1 1.1-1 1.1 1 1.1-1 1.1 1 1.1-1 1.1 1 1.1-1 1.1 1 1.1-1 1.1 1 1.1V14.6H13V2.6z" fill="#DDE4EE"/>'
    + '<rect x="12.2" y="2.4" width="6.6" height="12.4" rx="1" fill="#F07A1E"/><rect x="14.4" y="2.4" width="2.2" height="12.4" fill="#1F3864"/>'
    + '<g class="pt-chocolate-gota"><path d="M3.6 13.6v2.4a1.1 1.1 0 0 0 2.2 0v-2.4z" fill="#7A4524"/></g>'
    + '<g class="pt-chocolate-gota pt-chocolate-tarde"><path d="M8 13.6v1.4a1 1 0 0 0 2 0v-1.4z" fill="#7A4524"/></g>' };
  // lo que cae al fondo de la entrada: cuadritos de chocolate (oscuro y de leche) y gotas que gotean
  var CHOCOLATE_LLUEVE = { n: 24, z: [12, 24], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: '<rect x="2" y="2" width="16" height="16" rx="2.4" fill="#6B3A1E" stroke="#B57A4A" stroke-width="1"/>'
      + '<rect x="5" y="5" width="10" height="10" rx="1.4" fill="#8E5530"/><path d="M5.6 14.2V5.6H14.2" stroke="#C99066" stroke-width="1.1" fill="none" stroke-linecap="round"/>' },
    { modo: 'gotea', vb: '0 0 14 20', g: CHURRO_GOTA('#7A4524', '#D9A57A', '#C08A5A') },
    { modo: 'cae', vb: '0 0 20 20', g: '<rect x="1" y="5.4" width="18" height="9.2" rx="1.8" fill="#9A5B32" stroke="#D49A68" stroke-width=".9"/>'
      + '<g fill="#B57A4A"><rect x="2.8" y="7.2" width="6.2" height="5.6" rx="1"/><rect x="11" y="7.2" width="6.2" height="5.6" rx="1"/></g>'
      + '<path d="M3.3 12.3V7.7H8.5M11.5 12.3V7.7H16.7" stroke="#E6B88E" stroke-width=".9" fill="none" stroke-linecap="round"/>' },
    { modo: 'gotea', vb: '0 0 14 20', g: '<path d="M7 .6C6.4 5 6 8.4 4.4 11.4a3.6 3.6 0 1 0 5.2 0C8 8.4 7.6 5 7 .6z" fill="#7A4524" stroke="#C08A5A" stroke-width=".9"/>'
      + '<path d="M5.4 13.6a1.8 1.8 0 0 0 1.2 2" stroke="#D9A57A" stroke-width="1.1" fill="none" stroke-linecap="round"/>' }] };
  alta('chocolate',
    { m: CHOCOLATE_M, m2: CHOCOLATE_M2, j: CHOCOLATE_J, mov: 'mece', mov2: 'flota', jmov: 'mece', lluvia: CHOCOLATE_LLUEVE, w: 90, w2: 90,
      dice: ['¡Qué rico!', '¡Un cuadrito más!', '¡Bien calientito!', '¡Con bombones!'] });
  CSS_FECHAS += '.pt-chocolate-gota{transform-box:fill-box;transform-origin:50% 0;animation:pt-chocolate-gota 2.4s ease-in-out infinite alternate}'
    + '.pt-chocolate-tarde{animation-delay:-1.2s}@keyframes pt-chocolate-gota{from{transform:scaleY(.55)}to{transform:scaleY(1.25)}}'
    + '.pt-chocolate-cae{transform-box:fill-box;animation:pt-chocolate-cae 2.4s ease-in infinite}'
    + '@keyframes pt-chocolate-cae{0%,40%{opacity:0;transform:translateY(-60%)}55%{opacity:1}100%{opacity:0;transform:translateY(160%)}}'
    + '.pt-chocolate-humo{transform-box:fill-box;animation:pt-chocolate-humo 2.4s ease-in-out infinite}'
    + '@keyframes pt-chocolate-humo{0%{opacity:0;transform:translateY(12%)}40%{opacity:.8}100%{opacity:0;transform:translateY(-18%)}}';

  // ---------- Día del Abogado (12 de julio): la balanza de la justicia que se mece y el mazo; estrellitas ----------
  // (PROFASE también es despacho legal: la balanza va en dorado, con su columna, su base y brillos)
  function ABOGADO_CHISPA(x, y, s) { return '<path d="M' + x + ' ' + (y - s) + 'Q' + x + ' ' + y + ' ' + (x + s) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y + s) + 'Q' + x + ' ' + y + ' ' + (x - s) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y - s) + 'z"/>'; }
  // un platillo que cuelga de dos cadenitas desde (x, y)
  function ABOGADO_PLATO(x, y, cls) {
    return '<g class="' + cls + '"><path d="M' + x + ' ' + (y + 1) + 'L' + (x - 12) + ' ' + (y + 34) + 'M' + x + ' ' + (y + 1) + 'L' + (x + 12) + ' ' + (y + 34) + '" stroke="#F7D98B" stroke-width="1.4" stroke-linecap="round"/>'
      + '<path d="M' + (x - 14) + ' ' + (y + 34) + 'H' + (x + 14) + 'Q' + (x + 12) + ' ' + (y + 45) + ' ' + x + ' ' + (y + 45) + 'Q' + (x - 12) + ' ' + (y + 45) + ' ' + (x - 14) + ' ' + (y + 34) + 'z" fill="#F2C066"/>'
      + '<path d="M' + (x - 14) + ' ' + (y + 34) + 'H' + (x + 14) + '" stroke="#FFE6A8" stroke-width="1.8" stroke-linecap="round"/>'
      + '<path d="M' + (x - 8) + ' ' + (y + 38) + 'Q' + (x - 6) + ' ' + (y + 42) + ' ' + (x - 1) + ' ' + (y + 42.6) + '" stroke="#D9A23C" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>';
  }
  // la balanza dorada: columna, base escalonada, brazo que se mece y platillos que siguen colgando derechos
  var ABOGADO_BAL ='<rect x="27" y="88" width="46" height="8" rx="2.5" fill="#D9A23C"/><rect x="35" y="81" width="30" height="8" rx="2.5" fill="#F2C066"/>'
    + '<rect x="46.5" y="24" width="7" height="58" rx="2" fill="#F2C066"/><path d="M48.8 28V79M51.2 28V79" stroke="#D9A23C" stroke-width=".9"/>'
    + '<rect x="42" y="77" width="16" height="5" rx="1.5" fill="#D9A23C"/><path d="M50 9l2.4 4.4H47.6z" fill="#F2C066"/><circle cx="50" cy="15" r="3.6" fill="#F2C066"/>'
    + '<g class="pt-abogado-brazo"><path d="M14 22H86" stroke="#F2C066" stroke-width="4.4" stroke-linecap="round"/><path d="M24 22Q37 17.6 50 22Q63 17.6 76 22" stroke="#FFE6A8" stroke-width="1.4" fill="none"/>'
    + '<circle cx="14" cy="22" r="2.6" fill="#D9A23C"/><circle cx="86" cy="22" r="2.6" fill="#D9A23C"/><circle cx="50" cy="22" r="4.6" fill="#D9A23C"/><circle cx="50" cy="22" r="2" fill="#FFE6A8"/></g>'
    + ABOGADO_PLATO(14, 22, 'pt-abogado-pi') + ABOGADO_PLATO(86, 22, 'pt-abogado-pd')
    + '<g class="pt-abogado-brillo" fill="#fff">' + ABOGADO_CHISPA(30, 8, 4) + ABOGADO_CHISPA(73, 10, 3) + ABOGADO_CHISPA(66, 74, 3.4) + '</g>';
  var ABOGADO_M = { vb: '0 0 100 100', g: ABOGADO_BAL };
  var ABOGADO_M2 = { vb: '0 0 100 80', g: '<g class="pt-abogado-golpe" stroke="#F2C066" stroke-width="2.6" stroke-linecap="round"><path d="M12 50 5 45M10 58H2M12 66 5 71"/></g>'
    + '<path d="M17 64H67V70Q67 75 62 75H22Q17 75 17 70z" fill="#8A4E2B"/><ellipse cx="42" cy="64" rx="25" ry="5.4" fill="#B5723F"/>'
    + '<path d="M17.5 69H66.5" stroke="#F2C066" stroke-width="1.6"/>'
    + '<g class="pt-abogado-mazo"><path d="M41 49 90 22" stroke="#C27A3E" stroke-width="6" stroke-linecap="round"/><path d="M45 47 86 24.4" stroke="#E0A06A" stroke-width="1.6" stroke-linecap="round"/>'
    + '<circle cx="90" cy="22" r="4.6" fill="#8A4E2B"/>'
    + '<rect x="26" y="40" width="30" height="18" rx="4" fill="#B5723F"/><rect x="23" y="38" width="6.5" height="22" rx="2.2" fill="#8A4E2B"/><rect x="52.5" y="38" width="6.5" height="22" rx="2.2" fill="#8A4E2B"/>'
    + '<rect x="31.5" y="40" width="3" height="18" fill="#F2C066"/><rect x="47.5" y="40" width="3" height="18" fill="#F2C066"/>'
    + '<path d="M30 43.5H52" stroke="#D99A62" stroke-width="1.6" stroke-linecap="round"/></g>' };
  // libros de leyes (adorno de arriba a la izquierda, solo en pantallas grandes)
  var ABOGADO_LIBROS = { vb: '0 0 70 56', g: '<rect x="4" y="40" width="60" height="12" rx="2" fill="#C2414F"/><rect x="58" y="41.5" width="4.5" height="9" fill="#F4ECD8"/><path d="M12 40V52M16 40V52" stroke="#F2C066" stroke-width="1.6"/>'
    + '<rect x="9" y="28" width="54" height="12" rx="2" fill="#3F7FBF"/><rect x="57" y="29.5" width="4.5" height="9" fill="#F4ECD8"/><path d="M17 28V40M21 28V40" stroke="#F2C066" stroke-width="1.6"/>'
    + '<rect x="3" y="16" width="56" height="12" rx="2" fill="#2E8A62"/><rect x="53" y="17.5" width="4.5" height="9" fill="#F4ECD8"/><path d="M11 16V28M15 16V28" stroke="#F2C066" stroke-width="1.6"/>'
    + '<rect x="24" y="19.5" width="20" height="5" rx="1" fill="#F2C066"/>'
    + '<g class="pt-abogado-brillo" fill="#fff">' + ABOGADO_CHISPA(60, 7, 3.4) + '</g>' };
  var ABOGADO_J = { vb: '0 0 20 18', g: '<rect x="5.5" y="15" width="9" height="2.4" rx=".8" fill="#CF9A2E"/><rect x="9.2" y="4.4" width="1.6" height="11" fill="#CF9A2E"/><circle cx="10" cy="2.8" r="1.3" fill="#CF9A2E"/>'
    + '<g class="pt-abogado-brazo"><path d="M2.5 5H17.5" stroke="#CF9A2E" stroke-width="1.3" stroke-linecap="round"/><circle cx="10" cy="5" r="1.4" fill="#CF9A2E"/></g>'
    + '<g class="pt-abogado-jpi"><path d="M2.5 5.4.8 10.5M2.5 5.4 4.2 10.5" stroke="#CF9A2E" stroke-width=".55"/><path d="M.3 10.4H4.7Q4.3 12.8 2.5 12.8Q.7 12.8.3 10.4z" fill="#CF9A2E"/></g>'
    + '<g class="pt-abogado-jpd"><path d="M17.5 5.4 15.8 10.5M17.5 5.4 19.2 10.5" stroke="#CF9A2E" stroke-width=".55"/><path d="M15.3 10.4H19.7Q19.3 12.8 17.5 12.8Q15.7 12.8 15.3 10.4z" fill="#CF9A2E"/></g>' };
  // lo que cae al fondo de la entrada: hojas de papel que flotan (con su sello dorado), estrellitas doradas y balancitas
  var ABOGADO_LLUEVE = { n: 22, z: [13, 26], formas: [
    { modo: 'flota', vb: '0 0 20 20', g: '<path d="M4 1.4H12.6L16.2 5V18.6H4z" fill="#F4F7FB" stroke="#C9D1DE" stroke-width=".5" stroke-linejoin="round"/><path d="M12.6 1.4V5H16.2z" fill="#C9D1DE"/>'
      + '<path d="M6.4 5H10.6M6.4 7.8H13.8M6.4 10.4H13.8M6.4 13H11" stroke="#9FB0C8" stroke-width=".9" stroke-linecap="round"/>'
      + '<circle cx="13.2" cy="15.4" r="1.9" fill="#F2C066"/><path d="M12.4 16.8 12 18.8 13.2 18.2 14.4 18.8 14 16.8" fill="#D9A23C"/>' },
    { modo: 'cae', vb: '0 0 20 20', g: '<path d="' + PADRE_ESTRELLA(10, 10.6, 9, 4.2) + '" fill="#F9CB5C" stroke="#F9CB5C" stroke-width="1.2" stroke-linejoin="round"/>'
      + '<path d="M10 3.6 11.4 8" stroke="#FFE6A8" stroke-width="1.1" stroke-linecap="round"/><g fill="#fff">' + ABOGADO_CHISPA(16.6, 3.2, 2.2) + '</g>' },
    { modo: 'flota', vb: '0 0 20 20', g: '<rect x="6" y="17.2" width="8" height="2" rx=".8" fill="#D9A23C"/><rect x="9.2" y="4.2" width="1.6" height="13.4" fill="#F2C066"/>'
      + '<circle cx="10" cy="3.2" r="1.5" fill="#F2C066"/><path d="M2.6 5.4H17.4" stroke="#F2C066" stroke-width="1.5" stroke-linecap="round"/>'
      + '<path d="M3.4 5.8 1.4 11.2M3.4 5.8 5.4 11.2M16.6 5.8 14.6 11.2M16.6 5.8 18.6 11.2" stroke="#F7D98B" stroke-width=".6"/>'
      + '<path d="M.8 11H6Q5.6 13.8 3.4 13.8Q1.2 13.8.8 11zM14 11H19.2Q18.8 13.8 16.6 13.8Q14.4 13.8 14 11z" fill="#F2C066"/>' }] };
  alta('abogado',
    { m: ABOGADO_M, m2: ABOGADO_M2, j: ABOGADO_J, mov: 'flota', mov2: 'brinca', jmov: 'flota', lluvia: ABOGADO_LLUEVE,
      dice: ['¡Justicia para todos!', '¡A derecho!', '¡Orden en la sala!', '¡Feliz día, colegas!'],
      extra: [['pt-p pt-a-flota pt-a-tarde pt-m-no', svg(ABOGADO_LIBROS), 'left:9%;top:11%;width:58px', '¡Conoce tus derechos!', 'pt-brinca']] });
  CSS_FECHAS += '.pt-abogado-brazo{transform-box:fill-box;transform-origin:50% 50%;animation:pt-abogado-brazo 3s ease-in-out infinite alternate}'
    + '@keyframes pt-abogado-brazo{from{transform:rotate(-7deg)}to{transform:rotate(7deg)}}'
    + '.pt-abogado-pi,.pt-abogado-pd,.pt-abogado-jpi,.pt-abogado-jpd{animation:pt-abogado-pi 3s ease-in-out infinite alternate}'
    + '.pt-abogado-pd{animation-name:pt-abogado-pd}.pt-abogado-jpi{animation-name:pt-abogado-jpi}.pt-abogado-jpd{animation-name:pt-abogado-jpd}'
    + '@keyframes pt-abogado-pi{from{transform:translateY(4.4px)}to{transform:translateY(-4.4px)}}@keyframes pt-abogado-pd{from{transform:translateY(-4.4px)}to{transform:translateY(4.4px)}}'
    + '@keyframes pt-abogado-jpi{from{transform:translateY(.9px)}to{transform:translateY(-.9px)}}@keyframes pt-abogado-jpd{from{transform:translateY(-.9px)}to{transform:translateY(.9px)}}'
    + '.pt-abogado-brillo{transform-box:fill-box;transform-origin:50% 50%;animation:pt-abogado-brillo 1.5s ease-in-out infinite alternate}'
    + '@keyframes pt-abogado-brillo{from{opacity:.2;transform:scale(.75)}to{opacity:1;transform:scale(1.05)}}'
    + '.pt-abogado-mazo{transform-box:fill-box;transform-origin:93.6% 10.6%;animation:pt-abogado-mazo 1.8s ease-in-out infinite}'
    + '@keyframes pt-abogado-mazo{0%,45%,100%{transform:rotate(18deg)}68%{transform:rotate(0)}76%{transform:rotate(5deg)}84%{transform:rotate(0)}}'
    + '.pt-abogado-golpe{animation:pt-abogado-golpe 1.8s ease-out infinite}@keyframes pt-abogado-golpe{0%,64%{opacity:0}70%{opacity:1}92%,100%{opacity:0}}';

  // ---------- Día de las Papas Fritas (13 de julio): cucurucho rojo con papitas que brincan y el salero ----------
  // una papita (rectángulo redondeado inclinado) de abajo (x, 50) hasta arriba (y)
  function PAPAS_PAPA(x, y, r, w, b) {
    return '<rect x="' + (x - w / 2) + '" y="' + y + '" width="' + w + '" height="' + (b - y) + '" rx="1.6" transform="rotate(' + r + ' ' + x + ' ' + b + ')" fill="#FFC83D" stroke="#E2A013" stroke-width="1.2"/>';
  }
  var PAPAS_M = { vb: '0 0 90 100', g: '<path d="M14 40Q45 31 76 40z" fill="#9E1428"/>'
    + '<g class="pt-papas-p1">' + PAPAS_PAPA(25, 18, -16, 7, 52) + PAPAS_PAPA(47, 6, 2, 7, 52) + PAPAS_PAPA(64, 16, 15, 7, 52) + '</g>'
    + '<g class="pt-papas-p2">' + PAPAS_PAPA(36, 10, -7, 7, 52) + PAPAS_PAPA(56, 9, 8, 7, 52) + '</g>'
    + '<g class="pt-papas-p3">' + PAPAS_PAPA(31, 22, -12, 6.5, 52) + PAPAS_PAPA(42, 18, -2, 6.5, 52) + PAPAS_PAPA(52, 20, 4, 6.5, 52) + PAPAS_PAPA(60, 24, 12, 6.5, 52) + '</g>'
    + '<path d="M13 39H77L49 96Q45 99.5 41 96z" fill="#D7263D"/><path d="M13 39H77L74 46H16z" fill="#fff"/><path d="M16 46H74" stroke="#F2C066" stroke-width="1.6"/>'
    + '<g fill="#fff" opacity=".9"><circle cx="30" cy="54" r="1.6"/><circle cx="60" cy="54" r="1.6"/><circle cx="36" cy="80" r="1.4"/><circle cx="54" cy="80" r="1.4"/><circle cx="45" cy="88" r="1.3"/></g>'
    + '<circle cx="38.5" cy="62" r="3.2" fill="#fff"/><circle cx="51.5" cy="62" r="3.2" fill="#fff"/><circle cx="39" cy="62.6" r="1.8" fill="#1A2333"/><circle cx="51" cy="62.6" r="1.8" fill="#1A2333"/>'
    + '<path d="M40 69q5 4.6 10 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>' };
  var PAPAS_M2 = { vb: '0 0 70 100', g: '<g class="pt-papas-sal" fill="#fff"><circle cx="9" cy="24" r="1.6"/><circle cx="5" cy="34" r="1.3"/><circle cx="12" cy="38" r="1.5"/><circle cx="7" cy="46" r="1.2"/><circle cx="14" cy="50" r="1.3"/></g>'
    + '<g class="pt-papas-salero"><path d="M18 44H52L56 89Q56 94 51 94H19Q14 94 14 89z" fill="#D6E7FA" stroke="#7FA3CF" stroke-width="1.6"/>'
    + '<path d="M16.3 66H53.7L55.3 89Q55.3 93.2 51 93.2H19Q14.7 93.2 14.7 89z" fill="#fff"/>'
    + '<path d="M16.9 53H53.1L53.8 63H16.2z" fill="#F07A1E"/>'
    + '<text x="35" y="61.4" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="8.5" fill="#fff">S</text>'
    + '<path d="M21 68V86" stroke="#E6F1FB" stroke-width="3" stroke-linecap="round"/>'
    + '<path d="M17 43C17 25 53 25 53 43z" fill="#C9D1DE" stroke="#8A98B0" stroke-width="1.2"/><rect x="14" y="40" width="42" height="7" rx="2.5" fill="#A9B6C9" stroke="#8A98B0" stroke-width="1"/>'
    + '<g fill="#5F6B82"><circle cx="28" cy="35" r="1.5"/><circle cx="35" cy="32.6" r="1.5"/><circle cx="42" cy="35" r="1.5"/><circle cx="31.5" cy="38.6" r="1.3"/><circle cx="38.5" cy="38.6" r="1.3"/></g>'
    + '<path d="M22 36Q25 30 31 29" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/></g>' };
  var PAPAS_J = { vb: '0 0 20 19', g: '<path d="M3 8Q10 6.2 17 8z" fill="#9E1428"/>'
    + '<g class="pt-papas-p1"><rect x="4.4" y="2.6" width="2.1" height="7.4" rx=".6" transform="rotate(-12 5.4 10)" fill="#FFC83D" stroke="#D99A12" stroke-width=".45"/>'
    + '<rect x="10.4" y=".7" width="2.1" height="9.3" rx=".6" transform="rotate(5 11.4 10)" fill="#FFC83D" stroke="#D99A12" stroke-width=".45"/></g>'
    + '<g class="pt-papas-p2"><rect x="7.4" y="1.4" width="2.1" height="8.6" rx=".6" transform="rotate(-4 8.4 10)" fill="#FFC83D" stroke="#D99A12" stroke-width=".45"/>'
    + '<rect x="13.2" y="2.8" width="2.1" height="7.2" rx=".6" transform="rotate(13 14.2 10)" fill="#FFC83D" stroke="#D99A12" stroke-width=".45"/></g>'
    + '<path d="M2.6 7.6H17.4L11 18.3Q10 19 9 18.3z" fill="#D7263D"/><path d="M2.6 7.6H17.4L16.5 9.3H3.5z" fill="#fff" stroke="#E7C3C8" stroke-width=".35"/>' };
  // lo que cae al fondo de la entrada: papitas que caen girando (una y en pareja) y granitos de sal
  function PAPAS_TIRA(x, y, w, h, r) {
    return '<g transform="rotate(' + r + ' ' + (x + w / 2) + ' ' + (y + h / 2) + ')"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="1.1" fill="#FFC83D" stroke="#E2A013" stroke-width=".9"/>'
      + '<path d="M' + (x + w * .32) + ' ' + (y + 1.6) + 'V' + (y + h - 1.6) + '" stroke="#FFE68F" stroke-width=".9" stroke-linecap="round"/></g>';
  }
  var PAPAS_LLUEVE = { n: 24, z: [12, 26], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: PAPAS_TIRA(8, 1, 4.2, 18, 35) },
    { modo: 'gotea', vb: '0 0 20 20', g: '<g fill="#fff"><rect x="3.4" y="2.4" width="4.4" height="4.4" rx=".6" transform="rotate(20 5.6 4.6)"/>'
      + '<rect x="11.4" y="5.4" width="4" height="4" rx=".6" transform="rotate(-15 13.4 7.4)"/><rect x="6.4" y="10.4" width="4.6" height="4.6" rx=".6" transform="rotate(35 8.7 12.7)"/>'
      + '<rect x="13" y="14" width="3.6" height="3.6" rx=".6" transform="rotate(10 14.7 15.7)"/></g>' },
    { modo: 'cae', vb: '0 0 20 20', g: PAPAS_TIRA(4.6, 2.6, 4, 15, 34) + PAPAS_TIRA(10.2, 1.4, 4, 17, 44) }] };
  alta('papas',
    { m: PAPAS_M, m2: PAPAS_M2, j: PAPAS_J, mov: 'brinca', mov2: 'flota', jmov: 'brinca', lluvia: PAPAS_LLUEVE, w: 90, w2: 70,
      dice: ['¡Crujientes!', '¡Calientitas!', '¡Una pizca de sal!', '¡Con salsita!'] });
  CSS_FECHAS += '.pt-papas-p1,.pt-papas-p2,.pt-papas-p3{transform-box:fill-box;animation:pt-papas-brinca 1.2s ease-in-out infinite}'
    + '.pt-papas-p2{animation-delay:-.4s}.pt-papas-p3{animation-delay:-.8s}'
    + '@keyframes pt-papas-brinca{0%,60%,100%{transform:translateY(0)}25%{transform:translateY(-14%)}45%{transform:translateY(2%)}}'
    + '.pt-papas-salero{transform-box:fill-box;transform-origin:50% 100%;animation:pt-papas-salero 2s ease-in-out infinite}'
    + '@keyframes pt-papas-salero{0%,70%,100%{transform:rotate(0)}15%,35%{transform:rotate(-24deg)}25%,45%{transform:rotate(-14deg)}}'
    + '.pt-papas-sal{transform-box:fill-box;animation:pt-papas-sal 2s ease-in infinite}'
    + '@keyframes pt-papas-sal{0%,10%{opacity:0;transform:translateY(-30%)}25%{opacity:1}60%,100%{opacity:0;transform:translateY(40%)}}';

  // ---------- Día del Emoji (17 de julio): carita que guiña el ojo y carita con ojos de corazón (dibujos propios) ----------
  var EMOJI_CARA = '<circle cx="50" cy="50" r="44" fill="#FFCB45"/><path d="M90 32A44 44 0 0 1 32 90A60 60 0 0 0 90 32z" fill="#F5B12A" opacity=".75"/>'
    + '<ellipse cx="33" cy="22" rx="12" ry="6" transform="rotate(-30 33 22)" fill="#fff" opacity=".35"/>';
  var EMOJI_M = { vb: '0 0 100 100', g: EMOJI_CARA
    + '<ellipse cx="34" cy="42" rx="6" ry="9" fill="#5B3A1E"/><circle cx="32" cy="38" r="2.2" fill="#fff"/>'
    + '<path d="M26 27Q33 22 41 26" stroke="#B5791E" stroke-width="3" fill="none" stroke-linecap="round"/>'
    + '<g class="pt-emoji-ojo"><ellipse cx="66" cy="42" rx="6" ry="9" fill="#5B3A1E"/><circle cx="64" cy="38" r="2.2" fill="#fff"/></g>'
    + '<g class="pt-emoji-arco"><path d="M57 44Q66 35 75 44" stroke="#5B3A1E" stroke-width="4.5" fill="none" stroke-linecap="round"/></g>'
    + '<path d="M56 70Q61 84 69 79Q73 74 68 66z" fill="#E8418C"/><path d="M62 72.4 64 78" stroke="#C22F70" stroke-width="1.4" stroke-linecap="round"/>'
    + '<path d="M28 63Q50 80 73 61" stroke="#5B3A1E" stroke-width="4.5" fill="none" stroke-linecap="round"/>'
    + '<circle cx="22" cy="58" r="6" fill="#F07A1E" opacity=".35"/><circle cx="79" cy="58" r="6" fill="#F07A1E" opacity=".35"/>' };
  var EMOJI_M2 = { vb: '0 0 100 100', g: EMOJI_CARA
    + '<g class="pt-emoji-cora"><path transform="translate(22 27) scale(1.5)" d="M8 14.2S1.4 10.1 1.4 5.6A3.5 3.5 0 0 1 8 4a3.5 3.5 0 0 1 6.6 1.6C14.6 10.1 8 14.2 8 14.2z" fill="#E8304F"/></g>'
    + '<g class="pt-emoji-cora pt-emoji-tarde"><path transform="translate(54 27) scale(1.5)" d="M8 14.2S1.4 10.1 1.4 5.6A3.5 3.5 0 0 1 8 4a3.5 3.5 0 0 1 6.6 1.6C14.6 10.1 8 14.2 8 14.2z" fill="#E8304F"/></g>'
    + '<path d="M28 60Q50 92 72 60Q50 67 28 60z" fill="#7A3B1E"/><path d="M32 61.5Q50 67.5 68 61.5L66 65.5Q50 70.5 34 65.5z" fill="#fff"/>'
    + '<path d="M40 75Q50 69 60 75Q57 82 50 82Q43 82 40 75z" fill="#E8418C"/>'
    + '<circle cx="21" cy="58" r="6" fill="#F07A1E" opacity=".35"/><circle cx="79" cy="58" r="6" fill="#F07A1E" opacity=".35"/>' };
  var EMOJI_J = { vb: '0 0 20 20', g: '<circle cx="10" cy="10" r="9.2" fill="#FFCB45" stroke="#E0A317" stroke-width=".6"/>'
    + '<ellipse cx="6.8" cy="8.2" rx="1.3" ry="1.9" fill="#5B3A1E"/>'
    + '<g class="pt-emoji-ojo"><ellipse cx="13.2" cy="8.2" rx="1.3" ry="1.9" fill="#5B3A1E"/></g>'
    + '<g class="pt-emoji-arco"><path d="M11.3 8.7Q13.2 6.9 15.1 8.7" stroke="#5B3A1E" stroke-width="1.1" fill="none" stroke-linecap="round"/></g>'
    + '<path d="M11.2 13.9Q12.2 16.8 14 15.6Q14.6 14.6 13.8 13.2z" fill="#E8418C"/>'
    + '<path d="M5.4 12.4Q10 16.4 14.8 12" stroke="#5B3A1E" stroke-width="1.1" fill="none" stroke-linecap="round"/>' };
  // lo que cae al fondo de la entrada: caritas chiquitas propias (sonriente, que guiña, que se ríe y enamorada)
  var EMOJI_CHICA = '<circle cx="10" cy="10" r="9" fill="#FFCB45" stroke="#E0A317" stroke-width=".6"/>';
  var EMOJI_CHAPAS = '<g fill="#F07A1E" opacity=".4"><circle cx="4.6" cy="12" r="1.6"/><circle cx="15.4" cy="12" r="1.6"/></g>';
  var EMOJI_LLUEVE = { n: 22, z: [14, 26], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: EMOJI_CHICA + EMOJI_CHAPAS + '<g fill="#5B3A1E"><ellipse cx="7" cy="8" rx="1.1" ry="1.6"/><ellipse cx="13" cy="8" rx="1.1" ry="1.6"/></g>'
      + '<path d="M6 11.6Q10 15.6 14 11.6" stroke="#5B3A1E" stroke-width="1.3" fill="none" stroke-linecap="round"/>' },
    { modo: 'flota', vb: '0 0 20 20', g: EMOJI_CHICA + EMOJI_CHAPAS + '<ellipse cx="7" cy="8" rx="1.1" ry="1.6" fill="#5B3A1E"/>'
      + '<path d="M11.6 8.6Q13 7 14.4 8.6M6 11.8Q10 15.6 14 11.4" stroke="#5B3A1E" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M11 13.4Q11.8 16.2 13.4 15.2Q13.9 14.2 13 12.6z" fill="#E8418C"/>' },
    { modo: 'cae', vb: '0 0 20 20', g: EMOJI_CHICA + EMOJI_CHAPAS + '<path d="M5.6 8.6Q7 6.6 8.4 8.6M11.6 8.6Q13 6.6 14.4 8.6" stroke="#5B3A1E" stroke-width="1.3" fill="none" stroke-linecap="round"/>'
      + '<path d="M5.6 10.8H14.4Q13.8 16 10 16Q6.2 16 5.6 10.8z" fill="#7A3B1E"/><path d="M6.2 11.4H13.8L13.5 12.6H6.5z" fill="#fff"/><path d="M8 14.8Q10 13.4 12 14.8Q11.2 15.6 10 15.6Q8.8 15.6 8 14.8z" fill="#E8418C"/>' },
    { modo: 'flota', vb: '0 0 20 20', g: EMOJI_CHICA + EMOJI_CHAPAS
      + '<g fill="#E8304F"><path transform="translate(4.3 4.9) scale(.34)" d="' + REDES_CORA + '"/><path transform="translate(10.3 4.9) scale(.34)" d="' + REDES_CORA + '"/></g>'
      + '<path d="M6.2 11.8Q10 15.8 13.8 11.8" stroke="#5B3A1E" stroke-width="1.3" fill="none" stroke-linecap="round"/>' }] };
  alta('emoji',
    { m: EMOJI_M, m2: EMOJI_M2, j: EMOJI_J, mov: 'saluda', mov2: 'late', jmov: 'brinca', lluvia: EMOJI_LLUEVE, w: 96, w2: 96,
      dice: ['¡Guiño, guiño!', '¡Sonríe!', '¡Me encanta!', '¡Qué bonito!'] });
  CSS_FECHAS += '.pt-emoji-ojo{transform-box:fill-box;transform-origin:50% 60%;opacity:0;animation:pt-emoji-ojo 3.2s ease-in-out infinite}'
    + '@keyframes pt-emoji-ojo{0%,38%{opacity:1;transform:scaleY(1)}46%{opacity:1;transform:scaleY(.12)}48%,84%{opacity:0;transform:scaleY(.12)}86%{opacity:1;transform:scaleY(.12)}94%,100%{opacity:1;transform:scaleY(1)}}'
    + '.pt-emoji-arco{animation:pt-emoji-arco 3.2s ease-in-out infinite}@keyframes pt-emoji-arco{0%,45%{opacity:0}48%,84%{opacity:1}87%,100%{opacity:0}}'
    + '.pt-emoji-cora{transform-box:fill-box;transform-origin:50% 55%;animation:pt-emoji-cora 1.2s ease-in-out infinite}.pt-emoji-tarde{animation-delay:-.15s}'
    + '@keyframes pt-emoji-cora{0%,100%{transform:scale(1)}20%{transform:scale(1.22)}40%{transform:scale(.96)}60%{transform:scale(1.12)}80%{transform:scale(1)}}';

  // ---------- Día del Helado (tercer domingo de julio): cono que se derrite y paleta ----------
  // las rayitas del barquillo: paralelas a cada orilla del cono (de y0 con orillas xa y xb hasta la punta xp, yp)
  function HELADO_REJA(xa, xb, y0, xp, yp, n, color, w) {
    var h = '', i, x0, t;
    for (i = 1; i < n; i++) {
      x0 = xa + (xb - xa) * i / n;
      t = (xb - x0) / (xb - xa);   // paralela a la orilla izquierda hasta la derecha
      h += 'M' + x0.toFixed(2) + ' ' + y0 + 'L' + (x0 + (xp - xa) * t).toFixed(2) + ' ' + (y0 + (yp - y0) * t).toFixed(2);
      t = (x0 - xa) / (xb - xa);   // paralela a la orilla derecha hasta la izquierda
      h += 'M' + x0.toFixed(2) + ' ' + y0 + 'L' + (x0 + (xp - xb) * t).toFixed(2) + ' ' + (y0 + (yp - y0) * t).toFixed(2);
    }
    return '<path d="' + h + '" stroke="' + color + '" stroke-width="' + w + '" stroke-linecap="round"/>';
  }
  var HELADO_M = { vb: '0 0 80 116', g: '<g transform="translate(0 6)">'
    + '<path d="M18 50H62L42 106Q40 109 38 106z" fill="#E2A75B"/>' + HELADO_REJA(18, 62, 50, 40, 107, 5, '#C68A40', 1.6)
    + '<path d="M14 52C10 36 24 26 40 26C56 26 70 36 66 52Q62 56 58 52Q54 57 50 52Q45 58 40 53Q35 58 30 52Q26 57 22 52Q18 56 14 52z" fill="#F29BC4"/>'
    + '<g class="pt-helado-gota"><path d="M23 53v8a3 3 0 0 0 6 0v-8z" fill="#F29BC4"/></g>'
    + '<g class="pt-helado-gota pt-helado-tarde"><path d="M47 54v13a3.2 3.2 0 0 0 6.4 0V54z" fill="#F29BC4"/></g>'
    + '<path d="M20 30C18 14 30 6 40 6C50 6 62 14 60 30Q56 34 52 30Q48 35 44 30Q40 34 36 30Q32 35 28 30Q24 34 20 30z" fill="#FFF1D6"/>'
    + '<g stroke-width="2" stroke-linecap="round"><path d="M30 15l3 1.6" stroke="#F07A1E"/><path d="M44 12l-2.6 2" stroke="#7FB2EA"/><path d="M50 20l3 .6" stroke="#5BD69A"/><path d="M36 23l-1 2.6" stroke="#E8418C"/><path d="M27 24l2.6-1" stroke="#7FB2EA"/><path d="M53 13l1.6 2.4" stroke="#E8418C"/></g>'
    + '<path d="M40 2Q41 -2 45 -3" stroke="#3E7A2E" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="40" cy="5" r="4.6" fill="#E0313A"/><circle cx="38.6" cy="3.6" r="1.3" fill="#fff" opacity=".7"/>'
    + '<path d="M27 40q3-3 6 0M47 40q3-3 6 0" stroke="#7A2E52" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M36 45q4 3.4 8 0" stroke="#7A2E52" stroke-width="2" fill="none" stroke-linecap="round"/>'
    + '</g>' };
  var HELADO_M2 = { vb: '0 0 60 110', g: '<rect x="25" y="68" width="10" height="38" rx="5" fill="#E3B26A"/><path d="M30 72V100" stroke="#C99448" stroke-width="1.2"/>'
    + '<path d="M8 26C8 12 18 4 30 4C35 4 39 5 42 6.6A6 6 0 0 0 48.6 13A6 6 0 0 0 51.8 21.6C51.9 23 52 24.5 52 26V70Q52 76 46 76H14Q8 76 8 70z" fill="#F07A1E"/>'
    + '<path d="M16 22V64" stroke="#FFB570" stroke-width="4" stroke-linecap="round" opacity=".85"/>'
    + '<g fill="#FFC83D"><rect x="30" y="16" width="5" height="5" rx="1.4" transform="rotate(20 32.5 18.5)"/><rect x="40" y="52" width="5" height="5" rx="1.4" transform="rotate(-15 42.5 54.5)"/><rect x="22" y="58" width="4.6" height="4.6" rx="1.4"/></g>'
    + '<circle cx="24" cy="38" r="2.6" fill="#1A2333"/><circle cx="38" cy="38" r="2.6" fill="#1A2333"/><circle cx="23.2" cy="37" r=".9" fill="#fff"/><circle cx="37.2" cy="37" r=".9" fill="#fff"/>'
    + '<path d="M26.5 44q4.5 4 9 0" stroke="#1A2333" stroke-width="2" fill="none" stroke-linecap="round"/>'
    + '<circle cx="19" cy="43.5" r="2.6" fill="#E8418C" opacity=".5"/><circle cx="43" cy="43.5" r="2.6" fill="#E8418C" opacity=".5"/>'
    + '<g class="pt-helado-gota"><path d="M40 74v7a2.6 2.6 0 0 0 5.2 0v-7z" fill="#F07A1E"/></g>' };
  var HELADO_J = { vb: '0 0 17 19', g: '<path d="M4 8.4H13L8.9 18.4Q8.5 19 8.1 18.4z" fill="#E2A75B" stroke="#B97A35" stroke-width=".5" stroke-linejoin="round"/>'
    + HELADO_REJA(4, 13, 8.4, 8.5, 18.6, 3, '#B97A35', .55)
    + '<path d="M3 9C1.8 4.2 5 1 8.5 1C12 1 15.2 4.2 14 9Q12.8 10.4 11.6 9Q10.2 10.6 8.8 9.2Q7.4 10.6 6 9.2Q4.6 10.4 3 9z" fill="#F29BC4"/>'
    + '<g class="pt-helado-gota"><path d="M10.4 9.6v2.2a.9.9 0 0 0 1.8 0V9.6z" fill="#F29BC4"/></g>'
    + '<g stroke-width=".8" stroke-linecap="round"><path d="M6 4.4l1.2.6" stroke="#F07A1E"/><path d="M10.4 3.6l-.9.8" stroke="#3E7FCF"/><path d="M11.4 6.6l1.2.2" stroke="#2E9A5A"/></g>' };
  // lo que cae al fondo de la entrada: chispitas de colores y gotitas derretidas (fresa y vainilla)
  function HELADO_CHISPAS(c) {
    return '<g stroke-width="2.8" stroke-linecap="round"><path d="M3 6.6 7.8 4.4" stroke="' + c[0] + '"/><path d="M11.4 8.6 16.2 11.2" stroke="' + c[1] + '"/>'
      + '<path d="M4.6 14.6 9.6 15.6" stroke="' + c[2] + '"/><path d="M13.6 2.6 15.4 4.6" stroke="' + c[0] + '"/></g>';
  }
  var HELADO_LLUEVE = { n: 26, z: [11, 22], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: HELADO_CHISPAS(['#E8418C', '#7FB2EA', '#FFC83D']) },
    { modo: 'gotea', vb: '0 0 14 20', g: CHURRO_GOTA('#F29BC4', '#FFE0EE') },
    { modo: 'cae', vb: '0 0 20 20', g: HELADO_CHISPAS(['#5BD69A', '#F07A1E', '#fff']) },
    { modo: 'gotea', vb: '0 0 14 20', g: CHURRO_GOTA('#FFF1D6', '#fff') }] };
  alta('helado',
    { m: HELADO_M, m2: HELADO_M2, j: HELADO_J, mov: 'mece', mov2: 'brinca', jmov: 'mece', lluvia: HELADO_LLUEVE, w: 76, w2: 58,
      dice: ['¡Se derrite!', '¡Uno de fresa!', '¡Paleta de mango!', '¡Refrescante!'] });
  CSS_FECHAS += '.pt-helado-gota{transform-box:fill-box;transform-origin:50% 0;animation:pt-helado-gota 2.6s ease-in-out infinite alternate}'
    + '.pt-helado-tarde{animation-delay:-1.3s}@keyframes pt-helado-gota{from{transform:scaleY(.6)}to{transform:scaleY(1.3)}}';

  // ---------- Día del Aguacate (31 de julio): medio aguacate con carita que saluda y molcajete con guacamole ----------
  var AGUACATE_PIEL = 'M45 6C60 6 66 22 68 38C70 52 82 62 82 80C82 98 66 106 45 106C24 106 8 98 8 80C8 62 20 52 22 38C24 22 30 6 45 6z';
  var AGUACATE_M = { vb: '0 0 90 112', g: '<path d="M12 70Q2 72 3.5 85" stroke="#3F8A3A" stroke-width="5.5" fill="none" stroke-linecap="round"/>'
    + '<g class="pt-aguacate-brazo"><path d="M74 60Q84 50 82 40" stroke="#3F8A3A" stroke-width="5.5" fill="none" stroke-linecap="round"/><circle cx="82" cy="37.5" r="4.8" fill="#3F8A3A"/></g>'
    + '<ellipse cx="33" cy="107" rx="7" ry="3.8" fill="#2E6B2E"/><ellipse cx="57" cy="107" rx="7" ry="3.8" fill="#2E6B2E"/>'
    + '<path d="' + AGUACATE_PIEL + '" fill="#3F8A3A"/>'
    + '<path d="' + AGUACATE_PIEL + '" transform="translate(45 60) scale(.86) translate(-45 -60)" fill="#C8E68A"/>'
    + '<ellipse cx="45" cy="76" rx="24" ry="23" fill="#E4F3A6"/>'
    + '<circle cx="45" cy="78" r="15" fill="#8A5A2B"/><circle cx="40" cy="73" r="4" fill="#A9744A"/>'
    + '<circle cx="38" cy="45" r="3.2" fill="#2B3A1A"/><circle cx="52" cy="45" r="3.2" fill="#2B3A1A"/><circle cx="37" cy="43.8" r="1.1" fill="#fff"/><circle cx="51" cy="43.8" r="1.1" fill="#fff"/>'
    + '<path d="M40.5 52Q45 56.4 49.5 52" stroke="#2B3A1A" stroke-width="2" fill="none" stroke-linecap="round"/>'
    + '<circle cx="33" cy="51" r="2.8" fill="#F29BC4" opacity=".85"/><circle cx="57" cy="51" r="2.8" fill="#F29BC4" opacity=".85"/>' };
  var AGUACATE_M2 = { vb: '0 0 100 90', g: '<path d="M22 72 19 86H31L32 74zM46 78 45 88H56L55 78zM68 74 69 86H81L78 72z" fill="#5F5852"/>'
    + '<path d="M10 44H90C90 66 74 80 50 80C26 80 10 66 10 44z" fill="#7D756E"/>'
    + '<g fill="#5F5852"><circle cx="24" cy="58" r="1.6"/><circle cx="38" cy="68" r="1.4"/><circle cx="60" cy="70" r="1.6"/><circle cx="74" cy="58" r="1.4"/><circle cx="50" cy="60" r="1.2"/></g>'
    + '<g fill="#9A918A"><circle cx="30" cy="64" r="1.2"/><circle cx="66" cy="64" r="1.2"/><circle cx="46" cy="72" r="1"/></g>'
    + '<ellipse cx="50" cy="44" rx="40" ry="8" fill="#8E857D"/>'
    + '<g class="pt-aguacate-totopo"><path d="M60 40 80 9 89 33z" fill="#F2C066" stroke="#D99A2B" stroke-width="1.4" stroke-linejoin="round"/><g fill="#fff"><circle cx="78" cy="22" r=".9"/><circle cx="82" cy="29" r=".9"/><circle cx="74" cy="31" r=".9"/></g></g>'
    + '<path d="M15 45Q20 34 29 38Q36 29 45 35Q53 27 61 34Q69 30 75 37Q82 36 85 45Q50 53 15 45z" fill="#8CC152"/>'
    + '<g fill="#E0313A"><rect x="30" y="38" width="4" height="3.6" rx=".8"/><rect x="56" y="36" width="3.6" height="3.4" rx=".8"/><rect x="68" y="41" width="3.6" height="3.2" rx=".8"/></g>'
    + '<g fill="#fff"><rect x="42" y="40" width="3.4" height="2.4" rx=".6"/><rect x="22" y="42" width="3" height="2.2" rx=".6"/></g>'
    + '<g fill="#3E7A2E"><ellipse cx="50" cy="33" rx="2.4" ry="1.3"/><ellipse cx="38" cy="36" rx="2" ry="1.1"/><ellipse cx="74" cy="40" rx="2" ry="1.1"/></g>' };
  var AGUACATE_J = { vb: '0 0 17 19', g: '<path d="M8.5 1C11.6 1 12.6 4.4 13 7C13.4 9.4 15.8 10.8 15.8 13.6C15.8 16.8 12.6 18.6 8.5 18.6C4.4 18.6 1.2 16.8 1.2 13.6C1.2 10.8 3.6 9.4 4 7C4.4 4.4 5.4 1 8.5 1z" fill="#3F8A3A"/>'
    + '<path d="M8.5 1C11.6 1 12.6 4.4 13 7C13.4 9.4 15.8 10.8 15.8 13.6C15.8 16.8 12.6 18.6 8.5 18.6C4.4 18.6 1.2 16.8 1.2 13.6C1.2 10.8 3.6 9.4 4 7C4.4 4.4 5.4 1 8.5 1z" transform="translate(8.5 11) scale(.8) translate(-8.5 -11)" fill="#C8E68A"/>'
    + '<circle cx="8.5" cy="13.6" r="3.1" fill="#8A5A2B"/><circle cx="7.6" cy="12.7" r=".8" fill="#A9744A"/>'
    + '<circle cx="7" cy="7.4" r=".8" fill="#2B3A1A"/><circle cx="10" cy="7.4" r=".8" fill="#2B3A1A"/><path d="M7.4 8.9Q8.5 9.9 9.6 8.9" stroke="#2B3A1A" stroke-width=".6" fill="none" stroke-linecap="round"/>' };
  // lo que cae al fondo de la entrada: hojitas de aguacate, ramitas de cilantro, rodajas y gotitas de limón
  function AGUACATE_LIMON() {
    var h = '<circle cx="10" cy="10" r="9" fill="#4CAF3A"/><circle cx="10" cy="10" r="7.6" fill="#EEF8C6"/><circle cx="10" cy="10" r="6.6" fill="#B5DE5E"/><g stroke="#EEF8C6" stroke-width=".9" stroke-linecap="round">', i, a;
    for (i = 0; i < 8; i++) { a = (i * 45 + 22.5) * Math.PI / 180; h += '<path d="M10 10L' + (10 + Math.cos(a) * 6.4).toFixed(2) + ' ' + (10 + Math.sin(a) * 6.4).toFixed(2) + '"/>'; }
    return h + '</g><circle cx="10" cy="10" r="1.1" fill="#EEF8C6"/>';
  }
  var AGUACATE_LLUEVE = { n: 24, z: [12, 24], formas: [
    { modo: 'flota', vb: '0 0 20 20', g: '<path d="M3.4 16.6 1.4 18.6" stroke="#3F8A3A" stroke-width="1.3" stroke-linecap="round"/>'
      + '<path d="M3.2 16.8C2.6 9.2 9 2.8 17.6 2.4C17.2 11 10.8 17.4 3.2 16.8z" fill="#4FA34A"/>'
      + '<path d="M3.6 16.4 16.4 3.6M6.6 13.4 6.4 10M6.6 13.4 10 13.6M9.6 10.4 9.4 7M9.6 10.4 13 10.6M12.6 7.4 12.6 4.8M12.6 7.4 15.2 7.4" stroke="#A5D88A" stroke-width=".7" fill="none" stroke-linecap="round"/>' },
    { modo: 'flota', vb: '0 0 20 20', g: '<path d="M10 19.4C10.4 15.4 9.6 12 10 6.6M10 14.2 5.8 11.4M10 12 14.4 9.2" stroke="#4FA34A" stroke-width="1.1" fill="none" stroke-linecap="round"/>'
      + '<g fill="#7ED957"><circle cx="8.4" cy="5.2" r="2.3"/><circle cx="11.6" cy="5.2" r="2.3"/><circle cx="10" cy="2.9" r="2.1"/>'
      + '<circle cx="4.2" cy="12" r="2"/><circle cx="4.4" cy="9.2" r="1.9"/><circle cx="2.4" cy="10.4" r="1.6"/>'
      + '<circle cx="15.8" cy="9.6" r="2"/><circle cx="15.4" cy="6.8" r="1.9"/><circle cx="17.8" cy="7.8" r="1.6"/></g>'
      + '<path d="M10 7.6V3.8M10 5.6 8.4 4.6M10 5.6 11.6 4.6M5.8 11.4 3.4 10M14.4 9.2 16.6 7.6" stroke="#3E9A2E" stroke-width=".55" fill="none" stroke-linecap="round"/>' },
    { modo: 'gotea', vb: '0 0 14 20', g: CHURRO_GOTA('#C8E68A', '#F4FBDD') },
    { modo: 'cae', vb: '0 0 20 20', g: AGUACATE_LIMON() }] };
  alta('aguacate',
    { m: AGUACATE_M, m2: AGUACATE_M2, j: AGUACATE_J, mov: 'brinca', mov2: 'mece', jmov: 'saluda', lluvia: AGUACATE_LLUEVE, w: 84,
      dice: ['¡Hola, hola!', '¡Qué tal!', '¡A hacer guacamole!', '¡Con totopos!'] });
  CSS_FECHAS += '.pt-aguacate-brazo{transform-box:fill-box;transform-origin:0 100%;animation:pt-aguacate-brazo .6s ease-in-out infinite alternate}'
    + '@keyframes pt-aguacate-brazo{from{transform:rotate(-14deg)}to{transform:rotate(18deg)}}'
    + '.pt-aguacate-totopo{transform-box:fill-box;animation:pt-aguacate-totopo 1.8s ease-in-out infinite}'
    + '@keyframes pt-aguacate-totopo{0%,100%{transform:translate(0,0)}45%,60%{transform:translate(-8%,14%)}}';
  // lo gracioso de cada día: lo cuenta el segundo de los dos adornos de junto a la campanita (js/temporada.js, CHISTES;
  // Héctor Daniel Nava, 12-nov-2026: «al picarle diga algo gracioso corto en base al día que se festeja»)
  if (T.chistes) T.chistes({
    marina: ["Navegando entre facturas, siempre a buen puerto.", "Capitán, el WorkFlow está despejado.", "Mar en calma, buzón tributario también."],
    churro: ["Que hoy todo te salga de churro… y bien.", "Churro con chocolate: la mejor conciliación.", "Lo único que se vale enrollar hoy es el churro."],
    oceanos: ["Un océano de facturas, y aquí vamos nadando.", "Cuida los océanos y no ahogues tu escritorio en papeles.", "Ola tras ola, tarea tras tarea."],
    sushi: ["Sushi: arroz, pescado y orden. Como un buen expediente.", "Los palillos y el debe y el haber: siempre en pareja.", "Hoy sí se vale ver todo crudo… pero solo en el sushi."],
    padre: ["Hoy se festeja al que dice «apaga la luz, que no somos socios de la CFE».", "Papá: el primer asesor financiero de la casa.", "Feliz día a los papás que siempre tienen un dato para todo."],
    verano: ["Llegó el verano: bloqueador, agua y declaraciones a tiempo.", "Calor afuera, cabeza fría para el cierre.", "Que el único que se derrita sea el hielo de la limonada."],
    redes: ["¿Ya le diste «me gusta» a terminar tu cierre?", "La mejor red social: un equipo que se ayuda.", "Comparte lo bueno… y sube tus documentos al WorkFlow."],
    ingeniero: ["Ingeniero: el que arma el puente; contador: el que lo deprecia.", "Si funciona, no lo toques: regla de oro de los ingenieros.", "Gracias a quien hace que todo sí abra."],
    ovni: ["Objeto Volador No Identificado: igual que un depósito sin referencia.", "Ni los extraterrestres entienden la miscelánea fiscal.", "La verdad está ahí afuera… y en el estado de cuenta."],
    chocolate: ["Un chocolate por cada pendiente terminado. Es la regla.", "Chocolate amargo, tareas dulces.", "El único saldo que nadie quiere conciliar: el de chocolates."],
    abogado: ["Feliz día a quienes siempre tienen un «depende».", "Lo que no está en el contrato, no existe. ¡Feliz día, abogados!", "Hoy se celebra el arte de la fracción, el inciso y el numeral."],
    papas: ["Papas a la francesa y facturas al día.", "Que lo único frito hoy sean las papas.", "Con sal, con limón y con todo terminado."],
    emoji: ["😅: la cara oficial de cada día 17.", "Hoy todo se dice con caritas… menos las declaraciones.", "👍 para la balanza que cuadra."],
    helado: ["Que lo único que se derrita hoy sea el helado.", "Una bola de helado por cada declaración a tiempo.", "Pendientes congelados, no: mejor terminados."],
    aguacate: ["Guacamole sí; pendientes aguados, no.", "Vale más que el aguacate: un cliente que manda todo a tiempo.", "Hoy todo sabe mejor con aguacate."]
  });
  return CSS_FECHAS;
});
