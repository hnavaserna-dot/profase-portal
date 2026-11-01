/* Portal PROFASE · dibujos de las fechas «chispa» de abril y mayo (Daniel, 31-oct-2026: «sí a todas»; en la entrada y
   adentro). js/temporada.js baja este archivo solo los días de una de sus fechas, para que el portal siga ligero; las
   fechas, su felicitación y su día viven allá, en TEMPORADAS. Dibujos propios: ninguno es el signo PROFASE, ni marcas,
   ni personajes. Agregar o quitar fechas solo lo decide Daniel (CLAUDE.md). */
(window.PROFASE_TEMPORADA_FECHAS = window.PROFASE_TEMPORADA_FECHAS || []).push(function (T) {
  'use strict';
  var alta = T.alta, svg = T.svg, FLOR = T.FLOR, CSS_FECHAS = '';

  /* ===== Parte B: fechas «chispa» de abril y mayo ===== */

  // Día del Burrito (primer jueves de abril): el burrito, envuelto a medias en papel aluminio, se mece
  var BURRITO_M = { vb: '0 0 100 100', g: '<ellipse cx="50" cy="96" rx="24" ry="3.4" fill="#050B18" opacity=".35"/>'
    + '<g transform="rotate(-16 50 54)">'
    + '<rect x="31" y="12" width="38" height="82" rx="19" fill="#F2D29B"/>'
    + '<g fill="#E2B26A"><ellipse cx="38" cy="34" rx="2.4" ry="1.6"/><ellipse cx="62" cy="31" rx="2" ry="1.4"/><ellipse cx="61" cy="53" rx="2.6" ry="1.6"/><ellipse cx="37" cy="55" rx="1.8" ry="1.2"/></g>'
    + '<path d="M34 27c5 5 7 13 7 26" stroke="#E2B26A" stroke-width="2" fill="none" stroke-linecap="round"/>'
    + '<ellipse cx="50" cy="19" rx="17" ry="7" fill="#8B4A2B"/>'
    + '<path d="M34 19c1-6 5-5 7-9 2 4 6 1 8-4 2 4 6 4 8 0 2 4 3 7 9 10-6 3-27 6-32 3z" fill="#6BBF59"/>'
    + '<circle cx="42" cy="18" r="3" fill="#E0483A"/><circle cx="57" cy="17" r="3" fill="#E0483A"/><circle cx="49" cy="21" r="2.6" fill="#F7C531"/>'
    + '<g fill="#FFF6E0"><circle cx="61" cy="21" r="1.8"/><circle cx="39" cy="22" r="1.8"/><circle cx="51" cy="15" r="1.6"/></g>'
    + '<path d="M33 20c6 7 28 7 34 0" stroke="#E6BC78" stroke-width="3.2" fill="none" stroke-linecap="round"/>'
    + '<circle cx="43" cy="41" r="2.8" fill="#3A2A20"/><circle cx="57" cy="41" r="2.8" fill="#3A2A20"/>'
    + '<circle cx="42" cy="40" r=".9" fill="#fff"/><circle cx="56" cy="40" r=".9" fill="#fff"/>'
    + '<path d="M45.5 47q4.5 4.5 9 0" stroke="#3A2A20" stroke-width="2" fill="none" stroke-linecap="round"/>'
    + '<circle cx="38" cy="46" r="3" fill="#F28B6B" opacity=".55"/><circle cx="62" cy="46" r="3" fill="#F28B6B" opacity=".55"/>'
    + '<path d="M31 60l4.75-4 4.75 4 4.75-4 4.75 4 4.75-4 4.75 4 4.75-4 4.75 4V75a19 19 0 0 1-38 0z" fill="#D5DCE6" stroke="#A9B3C3" stroke-width="1"/>'
    + '<path d="M37 64l5 9-3 10M58 63l-3 9 5 9M64.5 66v11" stroke="#F7F9FC" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<path d="M47 66l2 8-2 8M52 69l3 6" stroke="#AEB8C8" stroke-width="1.2" fill="none" stroke-linecap="round"/></g>' };
  // de compañía: la cazuelita de salsa con su totopo
  var BURRITO_M2 = { vb: '0 0 100 80', g: '<ellipse cx="50" cy="77" rx="32" ry="2.6" fill="#050B18" opacity=".35"/>'
    + '<path d="M12 40h76c0 20-17 34-38 34S12 60 12 40z" fill="#C0602E"/>'
    + '<path d="M19 52c5 4 10-4 15.5 0s10-4 15.5 0 10-4 15.5 0 10-4 15.5 0" stroke="#F2C066" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    + '<g fill="#F4ECD8"><circle cx="34" cy="62" r="1.8"/><circle cx="50" cy="65" r="1.8"/><circle cx="66" cy="62" r="1.8"/></g>'
    + '<ellipse cx="50" cy="40" rx="38" ry="8" fill="#8E3E1F"/>'
    + '<path d="M56 41L73 7Q75 4 77 7L80 37Z" fill="#F2C066" stroke="#D9A13A" stroke-width="1.4" stroke-linejoin="round"/>'
    + '<g fill="#E0A93A"><circle cx="72" cy="20" r="1.4"/><circle cx="76" cy="28" r="1.2"/><circle cx="67" cy="31" r="1.1"/></g>'
    + '<ellipse cx="50" cy="40" rx="33" ry="5.6" fill="#D7263D"/>'
    + '<g fill="#6BBF59"><circle cx="36" cy="39" r="1.6"/><circle cx="52" cy="42" r="1.4"/><circle cx="64" cy="38.4" r="1.5"/><circle cx="44" cy="41.5" r="1.2"/><circle cx="28" cy="41" r="1.2"/></g>'
    + '<g fill="#FFF6E0"><circle cx="40" cy="38" r="1.2"/><circle cx="58" cy="41.6" r="1.1"/><circle cx="31" cy="38.6" r="1"/></g>' };
  // junto al logo: el burrito chico, inclinado
  var BURRITO_J = { vb: '0 0 18 18', g: '<g transform="rotate(-26 9 9)">'
    + '<rect x="4.2" y=".8" width="9.6" height="16.4" rx="4.8" fill="#F2D29B" stroke="#D9A75A" stroke-width=".5"/>'
    + '<ellipse cx="9" cy="3.2" rx="4" ry="1.8" fill="#8B4A2B"/><circle cx="7.6" cy="2.8" r="1.1" fill="#5BBF59"/><circle cx="10.4" cy="3.1" r="1" fill="#E0483A"/><circle cx="9.1" cy="4" r=".7" fill="#F7C531"/>'
    + '<circle cx="7.5" cy="7.1" r=".7" fill="#3A2A20"/><circle cx="10.5" cy="7.1" r=".7" fill="#3A2A20"/>'
    + '<path d="M7.9 8.6q1.1 1 2.2 0" stroke="#3A2A20" stroke-width=".5" fill="none" stroke-linecap="round"/>'
    + '<path d="M4.2 11l1.07-.9 1.07.9 1.07-.9 1.07.9 1.07-.9 1.07.9 1.07-.9 1.07.9 1.07-.9V12.4a4.8 4.8 0 0 1-9.6 0z" fill="#D5DCE6" stroke="#9AA5B6" stroke-width=".5"/>'
    + '<path d="M6 12.2l.9 2.1" stroke="#fff" stroke-width=".7" stroke-linecap="round"/></g>' };
  // lo que cae al fondo de la entrada: frijolitos, granos de arroz, un chile rojo y un jalapeño
  function BURRITO_CHILE(c, luz, tallo) {
    return '<path d="M5.4 6.2c2.8-1.4 5.4.2 6.6 3.4 1.2 3.2 3 6 6.4 7.6-4.4 1.6-9.6-.2-12.2-3.6C4.4 11 3.6 8 5.4 6.2z" fill="' + c + '"/>'
      + '<path d="M7.4 8.4c1.8.2 3 1.6 3.8 3.8" stroke="' + luz + '" stroke-width="1.3" fill="none" stroke-linecap="round"/>'
      + '<path d="M3.4 7.6c.4-2.2 3-3.2 4.8-1.8-1.4.2-3.2.8-4.8 1.8z" fill="#4E9A3A" stroke="#4E9A3A" stroke-width="1.4" stroke-linejoin="round"/>'
      + '<path d="M5.6 5.6C5.2 3.8 6 2.2 7.8 1.6" stroke="' + tallo + '" stroke-width="1.7" fill="none" stroke-linecap="round"/>';
  }
  var BURRITO_LLUEVE = { n: 26, z: [14, 26], formas: [
    { modo: 'cae', vb: '0 0 20 14', g: '<path d="M2.6 7c0-3.5 3-5.5 6.5-5 2 .3 2.6 1.8 4.4 1.6 2.6-.3 4.8 1 4.8 3.6 0 3.6-4 6.3-8.6 6.3C5.4 13.5 2.6 11 2.6 7z" fill="#A9532C"/>'
      + '<path d="M5.4 6.2c.6-1.6 2-2.4 3.6-2.2" stroke="#E7A577" stroke-width="1.3" fill="none" stroke-linecap="round"/>' },
    { modo: 'cae', vb: '0 0 20 20', g: '<g fill="#FFF8E6" stroke="#E2D3B0" stroke-width=".5"><ellipse cx="6" cy="6.6" rx="4.6" ry="2" transform="rotate(-32 6 6.6)"/>'
      + '<ellipse cx="14" cy="9" rx="4.6" ry="2" transform="rotate(24 14 9)"/><ellipse cx="8.6" cy="14.4" rx="4.6" ry="2" transform="rotate(-6 8.6 14.4)"/></g>' },
    { modo: 'cae', vb: '0 0 20 20', g: BURRITO_CHILE('#E0392B', '#FF9A84', '#3E8A2E') },
    { modo: 'cae', vb: '0 0 20 20', g: BURRITO_CHILE('#3FA34D', '#A6E39A', '#7A8A2E') }] };
  alta('burrito',
    { m: BURRITO_M, m2: BURRITO_M2, j: BURRITO_J, mov: 'mece', mov2: 'brinca', jmov: 'mece', lluvia: BURRITO_LLUEVE,
      dice: ['¡Bien envueltito!', '¡De frijol con queso!', '¡Con salsa, porfa!', '¡Ñam, ñam!'] });

  // Día de la Tierra (22 de abril): el planeta gira (sus continentes dan la vuelta) y un arbolito se mece
  var TIERRA_M = { vb: '0 0 100 100', g: '<circle cx="50" cy="50" r="47" fill="#7FB2EA" opacity=".18"/>'
    + '<circle cx="50" cy="50" r="40" fill="#2F86D6"/>'
    + '<g class="pt-tierra-gira"><circle cx="50" cy="50" r="40" fill="none"/>'
    + '<path d="M24 30c5-8 15-11 22-7 4 2 1 7 5 10 4 4 11 1 12 6 1 6-6 9-11 8-5 0-6 6-11 6-6 0-7-6-11-8-5-3-9-8-6-15z" fill="#5BBF6A"/>'
    + '<path d="M58 60c6-5 15-4 18 1 3 6-2 12-8 15-6 2-12 0-13-6-1-4 0-7 3-10z" fill="#5BBF6A"/>'
    + '<path d="M62 22c4-3 9-2 12 2 2 4-1 7-5 7-5 0-8-5-7-9z" fill="#5BBF6A"/>'
    + '<path d="M28 66c3-2 8-1 9 2 1 4-3 6-6 5-3 0-5-4-3-7z" fill="#5BBF6A"/>'
    + '<path d="M32 33c3-2 7 0 7 3s-4 4-6 3-2-4-1-6zM64 66c2-2 6-1 6 2s-3 4-5 3-2-3-1-5z" fill="#3E9A54"/>'
    + '<g stroke="#fff" stroke-linecap="round" fill="none" opacity=".85"><path d="M17 50h13" stroke-width="4"/><path d="M50 42h12" stroke-width="3.5"/><path d="M44 82h11" stroke-width="3.5"/><path d="M72 40h7" stroke-width="3"/></g></g>'
    + '<path d="M50 87.5a37.5 37.5 0 0 0 37.5-37.5" stroke="#123E73" stroke-width="5" fill="none" opacity=".3"/>'
    + '<path d="M22 34a32 32 0 0 1 18-16" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".45"/>' };
  var TIERRA_M2 = { vb: '0 0 80 100', g: '<ellipse cx="40" cy="93" rx="32" ry="6.5" fill="#3E8A3A"/>'
    + '<g fill="#F29BC4"><circle cx="16" cy="91" r="2.2"/><circle cx="64" cy="92" r="2.2"/></g><g fill="#FFE27A"><circle cx="16" cy="91" r=".9"/><circle cx="64" cy="92" r=".9"/></g>'
    + '<path d="M35 92c2-12 2-22 1-34h8c-1 12-1 22 1 34z" fill="#8B5A2B"/>'
    + '<path d="M38 70l-8-7M42 66l7-6" stroke="#8B5A2B" stroke-width="3" stroke-linecap="round"/>'
    + '<g class="pt-tierra-copa"><circle cx="40" cy="36" r="22" fill="#4E9A3A"/><circle cx="23" cy="47" r="14" fill="#5BBF6A"/><circle cx="57" cy="47" r="14" fill="#5BBF6A"/>'
    + '<circle cx="40" cy="22" r="15" fill="#6FCB6A"/><path d="M30 18a12 12 0 0 1 10-8" stroke="#B6EBA8" stroke-width="3" fill="none" stroke-linecap="round"/>'
    + '<g fill="#F07A1E"><circle cx="30" cy="38" r="2.6"/><circle cx="52" cy="30" r="2.6"/><circle cx="58" cy="50" r="2.6"/><circle cx="22" cy="52" r="2.4"/><circle cx="42" cy="48" r="2.4"/></g></g>' };
  var TIERRA_J = { vb: '0 0 18 18', g: '<circle cx="9" cy="9" r="8" fill="#2F86D6"/>'
    + '<g class="pt-tierra-gira"><circle cx="9" cy="9" r="8" fill="none"/>'
    + '<path d="M3.6 6.4c1-1.8 3.4-2.6 5-1.6.9.6.2 1.6 1.1 2.2.9.8 2.4.2 2.6 1.3.2 1.3-1.3 2-2.4 1.8-1.1 0-1.3 1.3-2.4 1.3-1.3 0-1.5-1.3-2.4-1.8-1.1-.6-2-1.7-1.5-3.2z" fill="#5BBF6A"/>'
    + '<path d="M11 11.8c1.3-1 3.2-.8 3.8.3.6 1.3-.5 2.6-1.7 3.1-1.3.4-2.5 0-2.7-1.3-.2-.8 0-1.5.6-2.1z" fill="#5BBF6A"/>'
    + '<path d="M12.2 3.8c.9-.6 2.1-.4 2.6.4.4.9-.2 1.5-1.1 1.5-1 0-1.8-1.1-1.5-1.9z" fill="#5BBF6A"/></g>'
    + '<path d="M4.4 6.6a5.6 5.6 0 0 1 3-2.8" stroke="#fff" stroke-width=".9" fill="none" stroke-linecap="round" opacity=".6"/>' };
  // lo que cae al fondo de la entrada: hojitas verdes (claras y oscuras) que flotan y gotas de lluvia
  function TIERRA_HOJA(c, vena) {
    return '<path d="M2.6 17.4C2 9.4 7.6 3 18 2.2 18.6 11.4 12.2 17.6 2.6 17.4z" fill="' + c + '"/>'
      + '<path d="M3.4 16.6C7.6 12.4 11 8.8 15 5.2M8.2 12l-.2-3.6M11.2 9l3.4.2" stroke="' + vena + '" stroke-width="1.1" fill="none" stroke-linecap="round"/>';
  }
  var TIERRA_LLUEVE = { n: 24, z: [12, 24], formas: [
    { modo: 'flota', vb: '0 0 20 20', g: TIERRA_HOJA('#6FCB6A', '#2E8A44') },
    { modo: 'gotea', vb: '0 0 14 20', g: '<path d="M7 1C5 6 2 9 2 13a5 5 0 0 0 10 0c0-4-3-7-5-12z" fill="#4FA8F0"/>'
      + '<path d="M4.8 12.6a2.4 2.4 0 0 0 1.8 2.6" stroke="#D6EEFF" stroke-width="1.2" fill="none" stroke-linecap="round"/>' },
    { modo: 'flota', vb: '0 0 20 20', g: TIERRA_HOJA('#3E9A54', '#B6EBA8') }] };
  alta('tierra',
    { m: TIERRA_M, m2: TIERRA_M2, j: TIERRA_J, mov: 'flota', mov2: 'mece', jmov: 'flota', lluvia: TIERRA_LLUEVE,
      dice: ['¡Cuida el planeta!', '¡Hogar, dulce hogar!', '¡Planta un árbol!', '¡Recicla y reúsa!'] });
  CSS_FECHAS += '.pt-tierra-gira{transform-box:fill-box;transform-origin:50% 50%;animation:pt-tierra-gira 16s linear infinite}@keyframes pt-tierra-gira{to{transform:rotate(360deg)}}'
    + '.pt-tierra-copa{transform-box:fill-box;transform-origin:50% 100%;animation:pt-tierra-copa 2.6s ease-in-out infinite alternate}@keyframes pt-tierra-copa{from{transform:rotate(-3deg)}to{transform:rotate(3deg)}}';

  // Día del Libro (23 de abril): el libro abierto pasa una hoja; a un lado, la pila de libros
  function LIBRO_RENGLONES(der, col) {
    var h = '';
    for (var i = 0; i < 6; i++) {
      var y = 31 + i * 6.4, ancho = i === 5 ? 18 : 34;
      h += der ? 'M60 ' + y + 'Q' + (60 + ancho / 2) + ' ' + (y - 7) + ' ' + (60 + ancho) + ' ' + y
        : 'M50 ' + y + 'Q' + (50 - ancho / 2) + ' ' + (y - 7) + ' ' + (50 - ancho) + ' ' + y;
    }
    return '<path d="' + h + '" stroke="' + col + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
  }
  var LIBRO_HOJA = 'M55 23Q78 15 100 23V71Q78 63 55 71Z';
  var LIBRO_M = { vb: '0 0 110 86', g: '<g class="pt-libro-chispa"><path d="M28 3l1.8 4.4 4.4 1.8-4.4 1.8-1.8 4.4-1.8-4.4-4.4-1.8 4.4-1.8z" fill="#FFE27A"/></g>'
    + '<g class="pt-libro-chispa" style="animation-delay:-.7s"><path d="M84 1l1.4 3.4 3.4 1.4-3.4 1.4-1.4 3.4-1.4-3.4-3.4-1.4 3.4-1.4z" fill="#fff"/></g>'
    + '<g class="pt-libro-chispa" style="animation-delay:-1.2s"><circle cx="56" cy="8" r="2.2" fill="#F2C066"/></g>'
    + '<path d="M3 30Q30 22 55 28Q80 22 107 30V80Q80 72 55 78Q30 72 3 80Z" fill="#F07A1E"/>'
    + '<path d="M7 27Q31 19 55 26V75Q31 67 7 75ZM103 27Q79 19 55 26V75Q79 67 103 75Z" fill="#E9E1CF"/>'
    + '<path d="M10 23Q32 15 55 23V71Q32 63 10 71Z" fill="#FFFDF7" stroke="#D8CFBC" stroke-width="1"/>' + LIBRO_RENGLONES(false, '#C9D1DE')
    + '<path d="' + LIBRO_HOJA + '" fill="#FFFDF7" stroke="#D8CFBC" stroke-width="1"/>' + LIBRO_RENGLONES(true, '#C9D1DE')
    + '<path d="M70 70v15l3.5-3.5 3.5 3.5V70" fill="#D7263D"/>'
    + '<g class="pt-libro-hoja"><path d="' + LIBRO_HOJA + '" fill="#FFFDF7" stroke="#D8CFBC" stroke-width="1"/>' + LIBRO_RENGLONES(true, '#C9D1DE') + '</g>'
    + '<path d="M55 23V71" stroke="#D8CFBC" stroke-width="1.4"/>' };
  var LIBRO_M2 = { vb: '0 0 100 92', g: '<ellipse cx="50" cy="89" rx="42" ry="3" fill="#050B18" opacity=".35"/>'
    + '<rect x="9" y="66" width="82" height="21" rx="3" fill="#3A6FC4"/><rect x="17" y="66" width="3.4" height="21" fill="#F2C066"/><rect x="80" y="66" width="3.4" height="21" fill="#F2C066"/>'
    + '<rect x="32" y="74.5" width="38" height="4.4" rx="2.2" fill="#DCE8FA"/>'
    + '<rect x="17" y="46" width="70" height="20" rx="3" fill="#F07A1E"/><rect x="24" y="46" width="3.2" height="20" fill="#FFE0C2"/><rect x="76" y="46" width="3.2" height="20" fill="#FFE0C2"/>'
    + '<rect x="36" y="54" width="30" height="4.4" rx="2.2" fill="#FFE0C2"/>'
    + '<g transform="rotate(-5 48 36)"><rect x="12" y="26" width="72" height="20" rx="3" fill="#5BBF6A"/><rect x="19" y="26" width="3.2" height="20" fill="#E8F7E5"/><rect x="73" y="26" width="3.2" height="20" fill="#E8F7E5"/>'
    + '<rect x="32" y="34" width="32" height="4.4" rx="2.2" fill="#E8F7E5"/>'
    + '<g transform="translate(0 -2)"><circle cx="40" cy="17" r="7.5" fill="#BFE3FF" fill-opacity=".45" stroke="#E0483A" stroke-width="2.6"/><circle cx="58" cy="17" r="7.5" fill="#BFE3FF" fill-opacity=".45" stroke="#E0483A" stroke-width="2.6"/>'
    + '<path d="M47.4 16q1.6-2 3.2 0M32.6 16l-6 5" stroke="#E0483A" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    + '<path d="M36 13a5 5 0 0 1 4-2M54 13a5 5 0 0 1 4-2" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round"/></g></g>' };
  var LIBRO_J = { vb: '0 0 20 16', g: '<path d="M.6 4.6V15.2Q5.4 13.8 10 15.6Q14.6 13.8 19.4 15.2V4.6Z" fill="#F07A1E"/>'
    + '<path d="M10 3.2Q5.6 1.4 1.4 2.8V13.6Q5.6 12.2 10 14Z" fill="#fff" stroke="#C9D1DE" stroke-width=".6"/>'
    + '<path d="M3 5.4Q6 4.6 8.6 5.8M3 7.8Q6 7 8.6 8.2M3 10.2Q6 9.4 8.6 10.6" stroke="#7FA6DA" stroke-width=".8" fill="none" stroke-linecap="round"/>'
    + '<path d="M10 3.2Q14.4 1.4 18.6 2.8V13.6Q14.4 12.2 10 14Z" fill="#fff" stroke="#C9D1DE" stroke-width=".6"/>'
    + '<path d="M11.4 5.8Q14 4.6 17 5.4M11.4 8.2Q14 7 17 7.8M11.4 10.6Q14 9.4 17 10.2" stroke="#7FA6DA" stroke-width=".8" fill="none" stroke-linecap="round"/>'
    + '<g class="pt-libro-hoja"><path d="M10 3.2Q14.4 1.4 18.6 2.8V13.6Q14.4 12.2 10 14Z" fill="#fff" stroke="#C9D1DE" stroke-width=".6"/>'
    + '<path d="M11.4 5.8Q14 4.6 17 5.4M11.4 8.2Q14 7 17 7.8M11.4 10.6Q14 9.4 17 10.2" stroke="#7FA6DA" stroke-width=".8" fill="none" stroke-linecap="round"/></g>' };
  // lo que cae al fondo de la entrada: hojitas de papel con renglones y las letras A, B y C, que flotan como si salieran del libro
  function LIBRO_LETRA(d, c) { return '<path d="' + d + '" stroke="' + c + '" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'; }
  var LIBRO_LLUEVE = { n: 24, z: [12, 24], formas: [
    { modo: 'flota', vb: '0 0 16 20', g: '<path d="M2 1.5h8.5L14 5v13.5H2z" fill="#FFFDF7" stroke="#D8CFBC" stroke-width=".8" stroke-linejoin="round"/>'
      + '<path d="M10.5 1.5V5H14z" fill="#E9E1CF"/><path d="M4.4 8h7.2M4.4 11h7.2M4.4 14h5" stroke="#9FB3D6" stroke-width="1.1" stroke-linecap="round"/>' },
    { modo: 'flota', vb: '0 0 20 20', g: LIBRO_LETRA('M4 17L10 3l6 14M6.6 11.6h6.8', '#FFFFFF') },
    { modo: 'flota', vb: '0 0 20 20', g: LIBRO_LETRA('M5.5 3v14M5.5 3h4.6a3.4 3.4 0 0 1 0 6.8H5.5M5.5 9.8h5.4a3.6 3.6 0 0 1 0 7.2H5.5', '#F2C066') },
    { modo: 'flota', vb: '0 0 20 20', g: LIBRO_LETRA('M15.4 5.6A7 7 0 1 0 15.4 14.4', '#F9A05A') }] };
  alta('libro',
    { m: LIBRO_M, m2: LIBRO_M2, j: LIBRO_J, mov: 'flota', mov2: 'brinca', jmov: 'flota', lluvia: LIBRO_LLUEVE,
      dice: ['¡A leer se ha dicho!', '¡Un capítulo más!', '¡Cuántas historias!', '¡Lee y sueña!'] });
  CSS_FECHAS += '.pt-libro-hoja{transform-box:fill-box;transform-origin:0 50%;animation:pt-libro-hoja 3.4s ease-in-out infinite}'
    + '@keyframes pt-libro-hoja{0%,22%{transform:none}38%{transform:scaleX(.55) skewY(-9deg)}50%{transform:scaleX(0) skewY(-7deg)}62%{transform:scaleX(-.55) skewY(-9deg)}78%,100%{transform:scaleX(-1)}}'
    + '.pt-libro-chispa{transform-box:fill-box;transform-origin:50% 50%;animation:pt-libro-chispa 1.5s ease-in-out infinite alternate}'
    + '@keyframes pt-libro-chispa{from{opacity:.25;transform:scale(.6)}to{opacity:1;transform:scale(1.1)}}';

  // Día del Pingüino (25 de abril): camina meciéndose (aletas y patitas), con su bufanda naranja; y su pingüinito
  function PINGUINO_DIB(o) {
    var c = 'fill="' + o.cu + '" stroke="' + o.bo + '" stroke-width="1.4"';
    return '<ellipse cx="40" cy="98" rx="24" ry="2.4" fill="#050B18" opacity=".35"/>'
      + '<g class="pt-pinguino-pi"><ellipse cx="30" cy="94" rx="9" ry="4.2" fill="#F7A21B"/></g>'
      + '<g class="pt-pinguino-pd"><ellipse cx="50" cy="94" rx="9" ry="4.2" fill="#F7A21B"/></g>'
      + '<g class="pt-pinguino-ala"><path d="M18 44C9 52 6 66 10 76c5-4 9-14 10-24z" ' + c + '/></g>'
      + '<g class="pt-pinguino-ala2"><path d="M62 44c9 8 12 22 8 32-5-4-9-14-10-24z" ' + c + '/></g>'
      + (o.pelo ? '<path d="M38 8c-1-5 2-8 5-6-2 1-1 3 0 5" stroke="' + o.cu + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>' : '')
      + '<path d="M40 6C22 6 14 26 14 52c0 24 11 40 26 40s26-16 26-40C66 26 58 6 40 6z" ' + c + '/>'
      + '<path d="M40 32c-11 0-17 13-17 29 0 16 7 27 17 27s17-11 17-27c0-16-6-29-17-29z" fill="' + o.pa + '"/>'
      + '<ellipse cx="32" cy="30" rx="8" ry="9" fill="' + o.pa + '"/><ellipse cx="48" cy="30" rx="8" ry="9" fill="' + o.pa + '"/>'
      + '<circle cx="33" cy="30" r="3.4" fill="#1A2333"/><circle cx="47" cy="30" r="3.4" fill="#1A2333"/>'
      + '<circle cx="34.2" cy="28.8" r="1.2" fill="#fff"/><circle cx="48.2" cy="28.8" r="1.2" fill="#fff"/>'
      + '<circle cx="27.5" cy="38" r="3" fill="#F29BC4" opacity=".75"/><circle cx="52.5" cy="38" r="3" fill="#F29BC4" opacity=".75"/>'
      + '<path d="M36 36h8l-4 5z" fill="#F7A21B" stroke="#F7A21B" stroke-width="1.6" stroke-linejoin="round"/>'
      + (o.bu ? '<path d="M15 49q25 9 50 0v7q-25 9-50 0z" fill="' + o.bu + '"/><path d="M49 56l6 18-7 1.4-5-17.4z" fill="' + o.bu + '"/>'
        + '<path d="M23 52.6v7M32 54.6v7.4M41 55v7.4M57 52.6v7M48 66.6l6-1.6" stroke="#FFD3A8" stroke-width="2"/>' : '');
  }
  var PINGUINO_M = { vb: '0 0 80 100', g: PINGUINO_DIB({ cu: '#34507F', bo: '#6F8CBB', pa: '#fff', bu: '#F07A1E' }) };
  var PINGUINO_M2 = { vb: '0 0 80 100', g: PINGUINO_DIB({ cu: '#9AA9BE', bo: '#C3CEDD', pa: '#F4F6FA', pelo: true }) };
  var PINGUINO_J = { vb: '0 0 16 18', g: '<ellipse cx="5.4" cy="16.8" rx="2.2" ry="1" fill="#F7A21B"/><ellipse cx="10.6" cy="16.8" rx="2.2" ry="1" fill="#F7A21B"/>'
    + '<path d="M3.4 8.4C1.4 10 .9 12.6 1.5 14.4c1.1-.9 1.9-2.8 2.2-4.8zM12.6 8.4c2 1.6 2.5 4.2 1.9 6-1.1-.9-1.9-2.8-2.2-4.8z" fill="#34507F"/>'
    + '<path d="M8 1C4.4 1 3 4.6 3 9.2 3 13.6 5.2 16.6 8 16.6s5-3 5-7.4C13 4.6 11.6 1 8 1z" fill="#3D5F94"/>'
    + '<path d="M8 6.4c-2.3 0-3.3 2.6-3.3 5.3 0 2.7 1.4 4.6 3.3 4.6s3.3-1.9 3.3-4.6c0-2.7-1-5.3-3.3-5.3z" fill="#fff" stroke="#C9D1DE" stroke-width=".4"/>'
    + '<circle cx="6.3" cy="5.2" r="1.55" fill="#fff"/><circle cx="9.7" cy="5.2" r="1.55" fill="#fff"/>'
    + '<circle cx="6.5" cy="5.3" r=".8" fill="#1A2333"/><circle cx="9.5" cy="5.3" r=".8" fill="#1A2333"/>'
    + '<path d="M7 7.1h2l-1 1.3z" fill="#F7A21B" stroke="#F7A21B" stroke-width=".5" stroke-linejoin="round"/>'
    + '<path d="M3.1 9.3q4.9 1.7 9.8 0v1.6q-4.9 1.7-9.8 0z" fill="#F07A1E"/>' };
  // lo que cae al fondo de la entrada: copos de nieve de seis picos (blancos y celestes) que flotan, entre bolitas de nieve
  function PINGUINO_COPO(c) {
    var d = '', i, a;
    function pt(r, an) { return (10 + r * Math.cos(an)).toFixed(2) + ' ' + (10 + r * Math.sin(an)).toFixed(2); }
    for (i = 0; i < 6; i++) {
      a = Math.PI / 3 * i - Math.PI / 2;
      d += 'M10 10L' + pt(8.6, a) + 'M' + pt(7.4, a - .42) + 'L' + pt(5, a) + 'L' + pt(7.4, a + .42);
    }
    return '<path d="' + d + '" stroke="' + c + '" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="10" r="1.7" fill="' + c + '"/>';
  }
  var PINGUINO_BOLITA = { modo: 'gotea', vb: '0 0 20 20', g: '<circle cx="10" cy="10" r="3.2" fill="#FFFFFF" opacity=".9"/>' };
  var PINGUINO_LLUEVE = { n: 28, z: [10, 22], formas: [
    { modo: 'flota', vb: '0 0 20 20', g: PINGUINO_COPO('#FFFFFF') }, PINGUINO_BOLITA,
    { modo: 'flota', vb: '0 0 20 20', g: PINGUINO_COPO('#BFE3FF') }, PINGUINO_BOLITA] };
  alta('pinguino',
    { m: PINGUINO_M, m2: PINGUINO_M2, j: PINGUINO_J, mov: 'mece', mov2: 'brinca', jmov: 'mece', lluvia: PINGUINO_LLUEVE, w: 90, w2: 70,
      dice: ['¡Hola, amigos!', '¡Paso a pasito!', '¡Qué fresquito!', '¡A deslizarse!'] });
  CSS_FECHAS += '.pt-pinguino-ala{transform-box:fill-box;transform-origin:80% 8%;animation:pt-pinguino-ala .8s ease-in-out infinite alternate}'
    + '@keyframes pt-pinguino-ala{from{transform:rotate(-4deg)}to{transform:rotate(16deg)}}'
    + '.pt-pinguino-ala2{transform-box:fill-box;transform-origin:20% 8%;animation:pt-pinguino-ala2 .8s ease-in-out infinite alternate}'
    + '@keyframes pt-pinguino-ala2{from{transform:rotate(4deg)}to{transform:rotate(-16deg)}}'
    + '.pt-pinguino-pi,.pt-pinguino-pd{transform-box:fill-box;transform-origin:50% 100%;animation:pt-pinguino-pie .8s ease-in-out infinite alternate}'
    + '.pt-pinguino-pd{animation-delay:-.8s}@keyframes pt-pinguino-pie{from{transform:translateY(0)}to{transform:translateY(-38%)}}';

  // Día del Niño (30 de abril): globos que flotan y un papalote que vuela con su cola
  function NINO_GLOBO(cx, cy, rx, ry, col, i) {
    var ky = cy + ry, x0 = Math.min(cx - rx, 45), x1 = Math.max(cx + rx, 45);
    return '<g class="pt-nino-glob" style="transform-origin:' + ((45 - x0) / (x1 - x0) * 100).toFixed(1) + '% 100%;animation-delay:' + (-i * .9).toFixed(1) + 's">'
      + '<path d="M' + cx + ' ' + (ky + 3) + 'Q' + ((cx + 45) / 2 + 6) + ' ' + ((ky + 110) / 2) + ' 45 110" stroke="#C9D1DE" stroke-width="1.2" fill="none"/>'
      + '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + col + '"/>'
      + '<path d="M' + (cx - 3) + ' ' + (ky + 3.5) + 'L' + cx + ' ' + (ky - 1) + 'L' + (cx + 3) + ' ' + (ky + 3.5) + 'Z" fill="' + col + '"/>'
      + '<ellipse cx="' + (cx - rx * .4).toFixed(1) + '" cy="' + (cy - ry * .38).toFixed(1) + '" rx="' + (rx * .17).toFixed(1) + '" ry="' + (ry * .3).toFixed(1) + '" fill="#fff" opacity=".5" transform="rotate(25 ' + (cx - rx * .4).toFixed(1) + ' ' + (cy - ry * .38).toFixed(1) + ')"/></g>';
  }
  var NINO_M = { vb: '0 0 90 118', g: NINO_GLOBO(45, 19, 14, 17, '#F7C531', 3) + NINO_GLOBO(25, 34, 17, 21, '#F07A1E', 0)
    + NINO_GLOBO(65, 32, 17, 21, '#4F9BE8', 1) + NINO_GLOBO(45, 52, 16, 20, '#E8418C', 2)
    + '<path d="M45 110l-7-4.5v9zM45 110l7-4.5v9z" fill="#5BD69A"/><circle cx="45" cy="110" r="2.4" fill="#3FB37F"/>' };
  var NINO_COLA = [[51, 84, '#F07A1E'], [48, 98, '#F7C531'], [37, 110, '#4F9BE8']].map(function (b) {
    return '<path d="M' + b[0] + ' ' + b[1] + 'l-7-4.4v8.8zM' + b[0] + ' ' + b[1] + 'l7-4.4v8.8z" fill="' + b[2] + '"/>';
  }).join('');
  var NINO_M2 = { vb: '0 0 90 116', g: '<path d="M53 37L6 114" stroke="#C9D1DE" stroke-width=".9" opacity=".7"/>'
    + '<g class="pt-nino-cola"><path d="M54 72C46 82 60 90 50 98S40 110 34 114" stroke="#DCE2EC" stroke-width="2" fill="none"/>' + NINO_COLA + '</g>'
    + '<path d="M52 4L84 34 53 37z" fill="#F07A1E"/><path d="M84 34L54 72 53 37z" fill="#F7C531"/><path d="M54 72L22 40 53 37z" fill="#4F9BE8"/><path d="M22 40L52 4 53 37z" fill="#E8418C"/>'
    + '<path d="M52 4L54 72M22 40L84 34" stroke="#FFF3D6" stroke-width="1.6" opacity=".85"/>'
    + '<path d="M52 4L84 34 54 72 22 40z" fill="none" stroke="#FFF3D6" stroke-width="1.2" stroke-linejoin="round" opacity=".6"/>' };
  var NINO_J = { vb: '0 0 18 19', g: '<path d="M5.6 12.6Q7 15.6 9.4 18.4M12.4 13.8Q11 16 9.4 18.4" stroke="#8A94A6" stroke-width=".6" fill="none"/>'
    + '<ellipse cx="5.6" cy="6.4" rx="4.4" ry="5.4" fill="#F07A1E"/><path d="M4.7 12.7l.9-1.3.9 1.3z" fill="#F07A1E"/>'
    + '<ellipse cx="12.4" cy="7.6" rx="4.4" ry="5.4" fill="#4F9BE8"/><path d="M11.5 13.9l.9-1.3.9 1.3z" fill="#4F9BE8"/>'
    + '<ellipse cx="4" cy="4.6" rx=".8" ry="1.5" fill="#fff" opacity=".65" transform="rotate(25 4 4.6)"/><ellipse cx="10.8" cy="5.8" rx=".8" ry="1.5" fill="#fff" opacity=".65" transform="rotate(25 10.8 5.8)"/>' };
  // lo que cae al fondo de la entrada: dulces envueltos y canicas que caen, y globitos (naranja y azul) que suben
  function NINO_GLOBITO(c) {
    return '<path d="M7 16.4q-1.6 2.6 0 5.4" stroke="#DCE2EC" stroke-width=".8" fill="none"/><ellipse cx="7" cy="8.2" rx="5.8" ry="7" fill="' + c + '"/>'
      + '<path d="M5.6 16.6L7 14.8l1.4 1.8z" fill="' + c + '"/><ellipse cx="4.8" cy="5.4" rx="1.3" ry="2.2" transform="rotate(25 4.8 5.4)" fill="#fff" opacity=".55"/>';
  }
  var NINO_LLUEVE = { n: 24, z: [15, 28], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: '<path d="M5.4 10L1 6.2v7.6zM14.6 10l4.4-3.8v7.6z" fill="#F29BC4"/><ellipse cx="10" cy="10" rx="5.6" ry="4.4" fill="#E8418C"/>'
      + '<path d="M7.6 6.4c.9 2 .9 5.2 0 7.2M10.4 5.8c.9 2.4.9 6 0 8.4M13 6.8c.7 1.8.7 4.6 0 6.4" stroke="#FFD1E6" stroke-width="1" fill="none"/>' },
    { modo: 'sube', vb: '0 0 14 22', g: NINO_GLOBITO('#F07A1E') },
    { modo: 'cae', vb: '0 0 20 20', g: '<circle cx="10" cy="10" r="7.6" fill="#5BC8E8"/>'
      + '<path d="M4.4 12.4c2.4-1.2 4-4.6 7.4-5.2 2-.4 3.4.4 4.2 1.6-2.6-.2-4.4 1.6-6.4 3.6-1.6 1.6-3.6 2.4-5.2 0z" fill="#F7C531"/><circle cx="7.2" cy="6.8" r="2" fill="#fff" opacity=".75"/>' },
    { modo: 'sube', vb: '0 0 14 22', g: NINO_GLOBITO('#4F9BE8') }] };
  alta('nino',
    { m: NINO_M, m2: NINO_M2, j: NINO_J, mov: 'flota', mov2: 'vuela', jmov: 'flota', lluvia: NINO_LLUEVE, w: 90, w2: 90,
      dice: ['¡A jugar!', '¡Arriba los globos!', '¡Vuela, papalote!', '¡Feliz día, peques!'] });
  CSS_FECHAS += '.pt-nino-glob{transform-box:fill-box;animation:pt-nino-glob 2.6s ease-in-out infinite alternate}@keyframes pt-nino-glob{from{transform:rotate(-4deg)}to{transform:rotate(4deg)}}'
    + '.pt-nino-cola{transform-box:fill-box;transform-origin:75% 0;animation:pt-nino-cola 1.3s ease-in-out infinite alternate}@keyframes pt-nino-cola{from{transform:rotate(-9deg)}to{transform:rotate(9deg)}}';

  // Día del Trabajo (1 de mayo): el maletín brinca y la medalla con palomita (¡ya acabamos las anuales!)
  var TRABAJO_M = { vb: '0 0 100 84', g: '<ellipse cx="50" cy="81" rx="40" ry="2.8" fill="#050B18" opacity=".35"/>'
    + '<path d="M37 22v-8a6 6 0 0 1 6-6h14a6 6 0 0 1 6 6v8" stroke="#A85A1F" stroke-width="5" fill="none"/>'
    + '<rect x="8" y="20" width="84" height="58" rx="9" fill="#D9691C"/>'
    + '<path d="M8 29a9 9 0 0 1 9-9h66a9 9 0 0 1 9 9v13H8z" fill="#F07A1E"/>'
    + '<path d="M8 42h84" stroke="#B4551A" stroke-width="2"/>'
    + '<rect x="8" y="20" width="84" height="58" rx="9" fill="none" stroke="#B4551A" stroke-width="1.5"/>'
    + '<path d="M14 71h72" stroke="#FFD3A8" stroke-width="1.4" stroke-dasharray="3 3" opacity=".7"/>'
    + '<g fill="#F2C066" stroke="#C99A3A" stroke-width="1"><rect x="20" y="38" width="10" height="9" rx="2"/><rect x="70" y="38" width="10" height="9" rx="2"/><rect x="43" y="36" width="14" height="12" rx="3"/></g>'
    + '<circle cx="50" cy="42" r="1.8" fill="#8A4A1A"/>'
    + '<path d="M16 27h20" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".35"/>' };
  var TRABAJO_M2 = { vb: '0 0 80 108', g: '<path d="M66 2H46L32 50h20z" fill="#F07A1E"/><path d="M60 2h-6L40 50h6z" fill="#FFE0C2"/>'
    + '<path d="M14 2h20l14 48H28z" fill="#3A6FC4"/><path d="M20 2h6l14 48h-6z" fill="#DCE8FA"/>'
    + '<circle cx="40" cy="74" r="30" fill="#E0A93A"/><circle cx="40" cy="74" r="24" fill="#F2C066" stroke="#FFE08A" stroke-width="2"/>'
    + '<path d="M28 74l8 9 16-18" stroke="#1F3864" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<path d="M22 62a22 22 0 0 1 10-9" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".55"/>'
    + '<g class="pt-trabajo-brillo"><path d="M62 50l1.8 4.4 4.4 1.8-4.4 1.8-1.8 4.4-1.8-4.4-4.4-1.8 4.4-1.8z" fill="#fff"/></g>' };
  var TRABAJO_J = { vb: '0 0 18 16', g: '<path d="M6.4 4.6V3a1.4 1.4 0 0 1 1.4-1.4h2.4A1.4 1.4 0 0 1 11.6 3v1.6" stroke="#A85A1F" stroke-width="1.3" fill="none"/>'
    + '<rect x="1" y="4.2" width="16" height="11" rx="2" fill="#D9691C"/>'
    + '<path d="M1 6.2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2V9H1z" fill="#F07A1E"/>'
    + '<path d="M1 9h16" stroke="#B4551A" stroke-width=".5"/>'
    + '<rect x="7.3" y="7.4" width="3.4" height="3.2" rx=".7" fill="#F2C066"/>' };
  // lo que cae al fondo de la entrada: hojas con su clip que flotan, palomitas de «listo» y monedas
  var TRABAJO_LLUEVE = { n: 26, z: [14, 26], formas: [
    { modo: 'flota', vb: '0 0 16 20', g: '<rect x="1.5" y="1.8" width="13" height="17" rx="1.6" fill="#F4F7FC"/>'
      + '<path d="M4.2 7h7.6M4.2 10h7.6M4.2 13h5" stroke="#9FB3D6" stroke-width="1.1" stroke-linecap="round"/>'
      + '<path d="M10 .8v4.6a1.3 1.3 0 0 0 2.6 0V2.4" stroke="#8A94A6" stroke-width="1" fill="none" stroke-linecap="round"/>' },
    { modo: 'cae', vb: '0 0 20 20', g: '<circle cx="10" cy="10" r="8.4" fill="#2BB673"/>'
      + '<path d="M6 10.2l2.9 2.9 5.3-5.9" stroke="#fff" stroke-width="2.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' },
    { modo: 'cae', vb: '0 0 20 20', g: CONTADOR_MONEDA(10, 10, 8)
      + '<path d="M6.6 7.8a4.4 4.4 0 0 1 3-2.6" stroke="#fff" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".75"/>' }] };
  alta('trabajo',
    { m: TRABAJO_M, m2: TRABAJO_M2, j: TRABAJO_J, mov: 'brinca', mov2: 'late', jmov: 'brinca', lluvia: TRABAJO_LLUEVE, w2: 80,
      dice: ['¡A darle con todo!', '¡Gracias, equipo!', '¡Ya acabamos las anuales!', '¡Misión cumplida!'] });
  CSS_FECHAS += '.pt-trabajo-brillo{transform-box:fill-box;transform-origin:50% 50%;animation:pt-trabajo-brillo 1.4s ease-in-out infinite alternate}'
    + '@keyframes pt-trabajo-brillo{from{opacity:.2;transform:scale(.5) rotate(0)}to{opacity:1;transform:scale(1.15) rotate(45deg)}}';

  // Día del Albañil (3 de mayo): el casco amarillo brinca; ladrillos y la cuchara de albañil
  var ALBANIL_M = { vb: '0 0 100 74', g: '<ellipse cx="50" cy="71" rx="40" ry="2.6" fill="#050B18" opacity=".35"/>'
    + '<path d="M4 58c0-4 4-6 10-6h72c6 0 10 2 10 6v1c0 5-20 8-46 8S4 64 4 59z" fill="#E0A800"/>'
    + '<path d="M14 56C14 28 30 10 50 10s36 18 36 46z" fill="#F7C531"/>'
    + '<path d="M43 11.5c2-1 4-1.5 7-1.5s5 .5 7 1.5V56H43z" fill="#FFDA55"/>'
    + '<path d="M30 20c-5 9-7 22-7 36M70 20c5 9 7 22 7 36" stroke="#E5B000" stroke-width="3" fill="none" stroke-linecap="round"/>'
    + '<path d="M21 40c2-10 8-18 16-23" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".5"/>'
    + '<path d="M14 56h72" stroke="#D29A00" stroke-width="3" stroke-linecap="round"/>' };
  function ALBANIL_MURO() {
    var h = '', cs = ['#C8553D', '#D9694C', '#B9482F'], n = 0, f, i, y, xs;
    for (f = 0; f < 4; f++) {
      y = 42 + f * 13; xs = f % 2 ? [[8, 11], [21, 24], [47, 24], [73, 11]] : [[8, 24], [34, 24], [60, 24]];
      for (i = 0; i < xs.length; i++) {
        h += '<rect x="' + xs[i][0] + '" y="' + y + '" width="' + xs[i][1] + '" height="11" rx="1.6" fill="' + cs[n++ % 3] + '"/>'
          + '<path d="M' + (xs[i][0] + 2) + ' ' + (y + 2.2) + 'h' + (xs[i][1] - 4) + '" stroke="#E98B70" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>';
      }
    }
    return h;
  }
  var ALBANIL_M2 = { vb: '0 0 100 96', g: '<ellipse cx="46" cy="94" rx="42" ry="2.4" fill="#050B18" opacity=".35"/>'
    + '<rect x="6" y="40" width="80" height="53" rx="3" fill="#E6D5BC"/>' + ALBANIL_MURO()
    + '<path d="M10 41c3-5 8-5 11-1 3-4 8-4 11 0 3-3 7-3 10 1z" fill="#EFE3D0"/>'
    + '<path d="M40 37L68 17q5-3 8 2l3 8q1 5-4 6z" fill="#C9D1DE" stroke="#8A94A6" stroke-width="1.4" stroke-linejoin="round"/>'
    + '<path d="M47 33L69 20" stroke="#F4F6FA" stroke-width="2" stroke-linecap="round"/>'
    + '<path d="M74 22L80 12" stroke="#6B7894" stroke-width="3" stroke-linecap="round"/>'
    + '<path d="M80 12L90 3" stroke="#A0642E" stroke-width="7" stroke-linecap="round"/><path d="M79 13.4l2.6-3.2" stroke="#8A94A6" stroke-width="4"/>' };
  var ALBANIL_J = { vb: '0 0 20 15', g: '<path d="M1.2 12.2c0-.9.8-1.4 2-1.4h13.6c1.2 0 2 .5 2 1.4 0 1.2-3.8 2-8.8 2s-8.8-.8-8.8-2z" fill="#E0A800"/>'
    + '<path d="M3.4 11.4C3.4 5.4 6.4 1.6 10 1.6s6.6 3.8 6.6 9.8z" fill="#F7C531" stroke="#D9A000" stroke-width=".4"/>'
    + '<path d="M8.6 1.9c.5-.2.9-.3 1.4-.3s.9.1 1.4.3v9.5H8.6z" fill="#FFDD66"/>'
    + '<path d="M5.4 5.8c-.6 1.6-.8 3.2-.8 5.4" stroke="#fff" stroke-width=".8" opacity=".65" fill="none" stroke-linecap="round"/>' };
  // lo que cae al fondo de la entrada: ladrillitos (rojo y naranja) y tuercas
  // el ladrillo en tres caras (enfrente, arriba con sus hoyitos y el lado en sombra)
  function ALBANIL_LADRILLO(c, abajo, luz) {
    return '<path d="M1 5.4h14V13H1z" fill="' + c + '"/><path d="M1 5.4L5 1.6h14l-4 3.8z" fill="' + luz + '"/><path d="M15 5.4l4-3.8v7.6L15 13z" fill="' + abajo + '"/>'
      + '<g fill="' + abajo + '"><ellipse cx="7.2" cy="3.5" rx="1.1" ry=".65"/><ellipse cx="10.2" cy="3.5" rx="1.1" ry=".65"/><ellipse cx="13.2" cy="3.5" rx="1.1" ry=".65"/></g>'
      + '<path d="M3 9.2h10" stroke="' + luz + '" stroke-width=".8" stroke-linecap="round" opacity=".5"/>';
  }
  var ALBANIL_LLUEVE = { n: 24, z: [12, 22], formas: [
    { modo: 'cae', vb: '0 0 20 14', g: ALBANIL_LADRILLO('#C8553D', '#9E3B28', '#E98B70') },
    { modo: 'cae', vb: '0 0 20 20', g: '<path fill-rule="evenodd" d="M10 1.4l7.5 4.3v8.6L10 18.6l-7.5-4.3V5.7zM10 6.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 1 0 0-7.2z" fill="#B8C4D6" stroke="#7E8BA3" stroke-width=".9" stroke-linejoin="round"/>'
      + '<circle cx="10" cy="10" r="4.7" fill="none" stroke="#8A94A6" stroke-width=".9"/><path d="M4.3 6.4L10 3.2" stroke="#fff" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>' },
    { modo: 'cae', vb: '0 0 20 14', g: ALBANIL_LADRILLO('#E07A52', '#B9482F', '#F7B096') }] };
  alta('albanil',
    { m: ALBANIL_M, m2: ALBANIL_M2, j: ALBANIL_J, mov: 'brinca', mov2: 'mece', jmov: 'brinca', lluvia: ALBANIL_LLUEVE,
      dice: ['¡Manos a la obra!', '¡Casco puesto!', '¡Ladrillo a ladrillo!', '¡Gracias, maestro!'] });

  // Día del Espacio (4 de mayo): el cohete con su flama, el planeta con anillos y estrellas fugaces
  function ESPACIO_ESTRELLA(cx, cy, R, r) {
    var p = [], i, a, d;
    for (i = 0; i < 10; i++) { a = Math.PI / 5 * i - Math.PI / 2; d = i % 2 ? r : R; p.push((cx + d * Math.cos(a)).toFixed(1) + ' ' + (cy + d * Math.sin(a)).toFixed(1)); }
    return 'M' + p.join('L') + 'Z';
  }
  var ESPACIO_M = { vb: '2 6 90 128', g: '<g transform="rotate(28 50 62)">'
    + '<g class="pt-espacio-flama"><path d="M38 94Q50 140 62 94Z" fill="#F07A1E"/><path d="M43 94Q50 126 57 94Z" fill="#F9A51E"/><path d="M46 94Q50 112 54 94Z" fill="#FFE27A"/></g>'
    + '<path d="M37 64L23 86l1 12 15-8zM63 64l14 22-1 12-15-8z" fill="#F07A1E"/>'
    + '<path d="M50 8C64 20 68 42 66 72L62 94H38L34 72C32 42 36 20 50 8Z" fill="#F4F6FA" stroke="#C9D1DE" stroke-width="1.2"/>'
    + '<path d="M50 8C58 15 62 23 64 32H36C38 23 42 15 50 8Z" fill="#F07A1E"/>'
    + '<path d="M34.6 74H65.4L64.6 81H35.4Z" fill="#3A6FC4"/>'
    + '<rect x="48" y="80" width="4" height="17" rx="2" fill="#D9621A"/>'
    + '<rect x="40" y="92" width="20" height="5" rx="2" fill="#8A94A6"/>'
    + '<circle cx="50" cy="52" r="9.5" fill="#7FB2EA" stroke="#1F3864" stroke-width="3.4"/>'
    + '<path d="M45 50a6 6 0 0 1 5-5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".85"/>'
    + '<path d="M40 22q4-6 8-9" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".5"/></g>' };
  var ESPACIO_M2 = { vb: '0 0 110 84', g: '<g transform="rotate(-14 55 44)"><path d="M5 44a50 13 0 0 1 100 0" stroke="#F2C066" stroke-width="6" fill="none"/></g>'
    + '<circle cx="55" cy="44" r="26" fill="#9B6FD8"/>'
    + '<path d="M31.5 36Q55 41 78.5 36" stroke="#B994F0" stroke-width="5" fill="none"/><path d="M30.5 50Q55 55 79.5 50" stroke="#7E55BF" stroke-width="5" fill="none"/>'
    + '<circle cx="45" cy="30" r="3" fill="#8A5CC8"/><circle cx="66" cy="58" r="2.4" fill="#8A5CC8"/><circle cx="62" cy="27" r="1.6" fill="#8A5CC8"/>'
    + '<path d="M37 28a21 21 0 0 1 12-7" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".45"/>'
    + '<g transform="rotate(-14 55 44)"><path d="M5 44a50 13 0 0 0 100 0" stroke="#F2C066" stroke-width="6" fill="none"/>'
    + '<path d="M12 44a43 8.5 0 0 0 86 0" stroke="#FFE08A" stroke-width="1.6" fill="none" opacity=".8"/></g>'
    + '<circle cx="98" cy="12" r="5.5" fill="#C9D1DE"/><circle cx="96.4" cy="11" r="1.3" fill="#A9B3C3"/><circle cx="99.6" cy="14" r=".9" fill="#A9B3C3"/>'
    + '<path d="' + ESPACIO_ESTRELLA(12, 12, 5, 2.2) + '" fill="#FFE27A"/>' };
  var ESPACIO_FUGAZ = { vb: '0 0 60 32', g: '<path d="M11 23L58 2 13 29Z" fill="#FFE27A" opacity=".4"/><path d="M12 25L46 8" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>'
    + '<path d="' + ESPACIO_ESTRELLA(10, 25, 6.5, 2.8) + '" fill="#FFE27A"/>' };
  var ESPACIO_J = { vb: '0 0 18 18', g: '<g transform="rotate(38 9 9)">'
    + '<g class="pt-espacio-flama"><path d="M6.8 14.4Q9 21.8 11.2 14.4Z" fill="#F07A1E"/><path d="M7.9 14.4Q9 19 10.1 14.4Z" fill="#FFD23F"/></g>'
    + '<path d="M6.4 10.4L4 13.8l.3 1.8 2.5-1.4zM11.6 10.4l2.4 3.4-.3 1.8-2.5-1.4z" fill="#F07A1E"/>'
    + '<path d="M9 1.2c2.5 2 3.3 5.4 2.9 9.6l-.6 3.8H6.7l-.6-3.8C5.7 6.6 6.5 3.2 9 1.2z" fill="#fff" stroke="#C9D1DE" stroke-width=".6"/>'
    + '<path d="M9 1.2c1.3 1 2.1 2.3 2.5 3.8h-5C6.9 3.5 7.7 2.2 9 1.2z" fill="#F07A1E"/>'
    + '<circle cx="9" cy="8.2" r="1.6" fill="#7FB2EA" stroke="#1F3864" stroke-width=".7"/></g>' };
  alta('espacio',
    { m: ESPACIO_M, m2: ESPACIO_M2, j: ESPACIO_J, mov: 'vuela', mov2: 'flota', jmov: 'flota', lluvia: 'estrellas', w: 84, w2: 110,
      dice: ['¡Despegamos!', '¡3, 2, 1… arriba!', '¡Qué bonitos anillos!', '¡Hola, galaxia!'],
      extra: [['pt-p pt-espacio-fz', svg(ESPACIO_FUGAZ), 'left:13%;top:10%;width:64px', '¡Pide un deseo!', 'pt-brinca'],
        ['pt-p pt-espacio-fz pt-espacio-fz2', svg(ESPACIO_FUGAZ), 'right:12%;top:16%;width:48px', '¡Una estrella fugaz!', 'pt-brinca']] });
  CSS_FECHAS += '.pt-espacio-flama{transform-box:fill-box;transform-origin:50% 0;animation:pt-espacio-flama .32s ease-in-out infinite alternate}'
    + '@keyframes pt-espacio-flama{from{transform:scale(.92,.78)}to{transform:scale(1.05,1.15)}}'
    + '.pt-espacio-fz{animation:pt-espacio-fz 4.2s ease-in infinite}.pt-espacio-fz2{animation-delay:-1.6s}'
    + '@keyframes pt-espacio-fz{0%{opacity:0;transform:translate(45%,-40%)}12%{opacity:1}55%{opacity:0;transform:translate(-70%,60%)}100%{opacity:0;transform:translate(-70%,60%)}}';

  // Día de las Madres (10 de mayo): el ramo de flores se mece y al regalo se le levanta la tapa
  // una rosa vista desde arriba: su espiral
  function MADRES_ROSA(cx, cy, r, c, c2) {
    var s = (r * .22).toFixed(1), s2 = (r * .44).toFixed(1), s3 = (r * .66).toFixed(1);
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + c + '"/><path d="M' + cx + ' ' + cy + 'a' + s + ' ' + s + ' 0 1 1 ' + s + ' ' + s
      + ' ' + s2 + ' ' + s2 + ' 0 1 1 -' + s2 + ' -' + s2 + ' ' + s3 + ' ' + s3 + ' 0 1 1 ' + s3 + ' ' + s3 + '" stroke="' + c2 + '" stroke-width="' + (r * .15).toFixed(1) + '" fill="none" stroke-linecap="round"/>';
  }
  var MADRES_M = { vb: '0 0 90 112', g: '<path d="M8 42L45 106 82 42C68 53 56 49 45 51 34 49 22 53 8 42z" fill="#FCE3EC"/>'
    + '<g fill="#4E9A3A"><path d="M18 46c-12-4-17 1-18 7 9 1 15-2 18-7z"/><path d="M72 46c12-4 17 1 18 7-9 1-15-2-18-7z"/>'
    + '<path d="M24 20c-9-5-15-2-17 3 8 3 13 2 17-3z"/><path d="M66 20c9-5 15-2 17 3-8 3-13 2-17-3z"/><path d="M45 8c-3-6 0-8 4-8 0 4-1 6-4 8z"/></g>'
    + FLOR(22, 36, 12, '#F29BC4', '#E8418C') + FLOR(68, 36, 12, '#F9A51E', '#F07A1E')
    + FLOR(58, 15, 9, '#FFFFFF', '#F4F6FA') + FLOR(45, 48, 9, '#B994F0', '#9B6FD8')
    + MADRES_ROSA(32, 17, 9, '#F29BC4', '#D6336C') + MADRES_ROSA(45, 31, 14, '#E0483A', '#B5262B')
    + '<g fill="#fff"><circle cx="13" cy="24" r="2"/><circle cx="77" cy="24" r="2"/><circle cx="70" cy="52" r="2"/><circle cx="20" cy="52" r="1.8"/><circle cx="45" cy="12" r="1.6"/></g>'
    + '<g fill="#BFE3FF"><circle cx="72" cy="10" r="2"/><circle cx="17" cy="11" r="1.8"/></g>'
    + '<path d="M18 56L45 106 72 56C62 63 52 61 45 63 38 61 28 63 18 56z" fill="#F6B8CF"/>'
    + '<path d="M45 63V105M31 60l10 32M59 60l-10 32" stroke="#E79AB8" stroke-width="1.4" fill="none"/>'
    + '<g fill="#F07A1E"><path d="M45 80c-8-8-16-6-15 0s8 6 15 0z"/><path d="M45 80c8-8 16-6 15 0s-8 6-15 0z"/><path d="M43 81l-5 12 4-1 2 3 1-13z"/><path d="M47 81l5 12-4-1-2 3-1-13z"/></g>'
    + '<circle cx="45" cy="80" r="3.4" fill="#D9621A"/>' };
  var MADRES_M2 = { vb: '0 0 90 92', g: '<ellipse cx="45" cy="89" rx="36" ry="2.6" fill="#050B18" opacity=".35"/>'
    + '<rect x="12" y="40" width="66" height="46" rx="4" fill="#E8418C"/>'
    + '<g fill="#F48FBE"><circle cx="22" cy="52" r="2.6"/><circle cx="30" cy="70" r="2.6"/><circle cx="62" cy="52" r="2.6"/><circle cx="70" cy="76" r="2.4"/><circle cx="22" cy="79" r="2"/><circle cx="58" cy="78" r="2"/></g>'
    + '<rect x="39" y="40" width="12" height="46" fill="#F2C066"/>'
    + '<path d="M60 70s-6-3.8-6-7.6a3 3 0 0 1 6-1.4 3 3 0 0 1 6 1.4c0 3.8-6 7.6-6 7.6z" fill="#fff"/>'
    + '<g class="pt-madres-tapa"><rect x="8" y="30" width="74" height="14" rx="4" fill="#F2639F"/><rect x="39" y="30" width="12" height="14" fill="#F2C066"/>'
    + '<path d="M45 30C34 12 20 16 26 26c3 5 12 5 19 4zM45 30C56 12 70 16 64 26c-3 5-12 5-19 4z" fill="#F2C066" stroke="#D9A13A" stroke-width="1.2"/>'
    + '<circle cx="45" cy="29" r="4" fill="#E0A93A"/></g>' };
  var MADRES_J = { vb: '0 0 16 18', g: '<path d="M4 7.6c-1.8-.4-3.2.6-3.3 1.9 1.6.3 2.7-.3 3.3-1.9zM12 7.6c1.8-.4 3.2.6 3.3 1.9-1.6.3-2.7-.3-3.3-1.9z" fill="#4E9A3A"/>'
    + FLOR(4.4, 6.4, 3.3, '#E8418C', '#F29BC4') + FLOR(11.6, 6.4, 3.3, '#F07A1E', '#F9A51E') + MADRES_ROSA(8, 4, 3.4, '#E0483A', '#B5262B')
    + '<path d="M3.6 9.2L8 17.6 12.4 9.2C10.8 10.2 9.4 10 8 10.4 6.6 10 5.2 10.2 3.6 9.2z" fill="#F6B8CF" stroke="#D98FB0" stroke-width=".5"/>'
    + '<path d="M8 12.8c-1.5-1.3-2.8-.7-2.6.2.2.8 1.6.7 2.6-.2zM8 12.8c1.5-1.3 2.8-.7 2.6.2-.2.8-1.6.7-2.6-.2z" fill="#F07A1E"/>' };
  // lo que cae al fondo de la entrada: pétalos de rosa (rojos y rosas) que flotan y corazoncitos que suben
  function MADRES_PETALO(c, luz, base) {
    return '<path d="M8 19.2C3.4 17.4.8 12.4 1.4 7.6 2 3.2 5 .8 8 .8s6 2.4 6.6 6.8c.6 4.8-2 9.8-6.6 11.6z" fill="' + c + '"/>'
      + '<path d="M4.4 5.6C5.6 3.6 7.6 3 9.6 3.6" stroke="' + luz + '" stroke-width="1.3" fill="none" stroke-linecap="round"/>'
      + '<path d="M8 19.2c-1.4-1.6-1.8-3.4-1.6-5" stroke="' + base + '" stroke-width="1" fill="none" stroke-linecap="round"/>';
  }
  function MADRES_CORAZON(c) {
    return '<path d="M10 17S1.6 12 1.6 6.4A4.4 4.4 0 0 1 10 4.2a4.4 4.4 0 0 1 8.4 2.2C18.4 12 10 17 10 17z" fill="' + c + '"/>'
      + '<ellipse cx="5.6" cy="6.6" rx="1.4" ry="2" transform="rotate(-30 5.6 6.6)" fill="#fff" opacity=".5"/>';
  }
  var MADRES_LLUEVE = { n: 26, z: [12, 24], formas: [
    { modo: 'flota', vb: '0 0 16 20', g: MADRES_PETALO('#E0485F', '#F7A3B3', '#A8203A') },
    { modo: 'sube', vb: '0 0 20 18', g: MADRES_CORAZON('#E8418C') },
    { modo: 'flota', vb: '0 0 16 20', g: MADRES_PETALO('#F29BC4', '#FFE0EE', '#D6336C') },
    { modo: 'sube', vb: '0 0 20 18', g: MADRES_CORAZON('#F07A1E') }] };
  alta('madres',
    { m: MADRES_M, m2: MADRES_M2, j: MADRES_J, mov: 'mece', mov2: 'brinca', jmov: 'mece', lluvia: MADRES_LLUEVE, w: 96, w2: 96,
      dice: ['¡Te quiero, mamá!', '¡Para ti, con amor!', '¡Una sorpresa!', '¡Gracias, mamá!'] });
  CSS_FECHAS += '.pt-madres-tapa{transform-box:fill-box;transform-origin:50% 100%;animation:pt-madres-tapa 2.4s ease-in-out infinite}'
    + '@keyframes pt-madres-tapa{0%,52%,100%{transform:none}64%{transform:translateY(-16%) rotate(-5deg)}74%{transform:none}82%{transform:translateY(-6%) rotate(2deg)}90%{transform:none}}';

  // Día del Maestro (15 de mayo): la manzana roja que brilla y el pizarrón con «A+»
  var MAESTRO_M = { vb: '0 0 90 96', g: '<ellipse cx="45" cy="93" rx="28" ry="2.6" fill="#050B18" opacity=".35"/>'
    + '<path d="M45 28C36 20 14 20 10 44C6 68 22 92 36 92c4 0 6-2 9-2s5 2 9 2c14 0 30-24 26-48C76 20 54 20 45 28z" fill="#E0393E"/>'
    + '<path d="M66 30c8 6 10 18 8 30-2 12-8 22-16 26 6-8 10-18 10-28 0-10-1-20-2-28z" fill="#B82A30" opacity=".5"/>'
    + '<path d="M45 28c0-8 2-14 6-19" stroke="#6B3E1F" stroke-width="4" fill="none" stroke-linecap="round"/>'
    + '<path d="M50 15c7-10 20-10 26-6-6 9-18 12-26 6z" fill="#5BBF59"/><path d="M52 14c6-3 13-4 20-4.4" stroke="#3E9A3A" stroke-width="1.4" fill="none"/>'
    + '<ellipse cx="25" cy="46" rx="6" ry="11" transform="rotate(20 25 46)" fill="#fff" opacity=".45"/><circle cx="27" cy="64" r="2.6" fill="#fff" opacity=".35"/>'
    + '<g class="pt-maestro-brillo"><path d="M70 30l2.2 6 6 2.2-6 2.2-2.2 6-2.2-6-6-2.2 6-2.2z" fill="#fff"/></g>'
    + '<g class="pt-maestro-brillo" style="animation-delay:-.8s"><path d="M16 18l1.6 4.2 4.2 1.6-4.2 1.6-1.6 4.2-1.6-4.2-4.2-1.6 4.2-1.6z" fill="#FFE27A"/></g>' };
  var MAESTRO_M2 = { vb: '0 0 110 96', g: '<path d="M24 74L14 94M86 74l10 20" stroke="#8E5A28" stroke-width="5" stroke-linecap="round"/>'
    + '<rect x="4" y="4" width="102" height="70" rx="5" fill="#B5793A"/><rect x="10" y="10" width="90" height="56" rx="2" fill="#2F6B4F"/>'
    + '<path d="M23 54L34 20l11 34M27.5 42h13" stroke="#F4F6FA" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<path d="M54 37h17M62.5 28.5v17" stroke="#F2C066" stroke-width="5" stroke-linecap="round"/>'
    + '<path d="M20 60q24 4 52-1" stroke="#F4F6FA" stroke-width="2" fill="none" opacity=".55" stroke-linecap="round"/>'
    + '<g class="pt-maestro-brillo"><path d="' + ESPACIO_ESTRELLA(86, 26, 7, 3) + '" fill="#FFE27A"/></g>'
    + '<rect x="8" y="70" width="94" height="6" rx="2" fill="#8E5A28"/><rect x="22" y="66" width="14" height="4" rx="1.5" fill="#fff"/>'
    + '<rect x="74" y="63" width="18" height="7" rx="1.5" fill="#3A6FC4"/><rect x="74" y="63" width="18" height="3" rx="1.5" fill="#DDE5F2"/>' };
  var MAESTRO_J = { vb: '0 0 16 17', g: '<path d="M8 4.6C6.4 3.2 2.6 3.2 1.8 7.4c-.7 4.2 2 8.6 4.6 8.6.7 0 1.1-.4 1.6-.4s.9.4 1.6.4c2.6 0 5.3-4.4 4.6-8.6C13.4 3.2 9.6 3.2 8 4.6z" fill="#E0393E"/>'
    + '<path d="M8 4.6c0-1.4.4-2.6 1.1-3.4" stroke="#7A4A2A" stroke-width=".9" fill="none" stroke-linecap="round"/>'
    + '<path d="M9 2.4c1.3-1.8 3.6-1.8 4.6-1-1 1.6-3.2 2.1-4.6 1z" fill="#5BBF59"/>'
    + '<ellipse cx="4.6" cy="7.8" rx="1" ry="1.9" transform="rotate(20 4.6 7.8)" fill="#fff" opacity=".6"/>'
    + '<g class="pt-maestro-brillo"><path d="M12.6 5.2l.6 1.5 1.5.6-1.5.6-.6 1.5-.6-1.5-1.5-.6 1.5-.6z" fill="#FFE27A"/></g>' };
  // lo que cae al fondo de la entrada: gises de colores (rosa y celeste), estrellitas doradas y manzanitas
  // el gis como cilindrito: su cara plana más clara a la izquierda y la punta gastada a la derecha
  function MAESTRO_GIS(c, luz, sombra) {
    return '<path d="M3 2.2h13.2a2.8 2.8 0 0 1 0 5.6H3z" fill="' + c + '"/><path d="M3 6.6h13.4" stroke="' + sombra + '" stroke-width="1.2" stroke-linecap="round"/>'
      + '<ellipse cx="3" cy="5" rx="1.6" ry="2.8" fill="' + luz + '"/><path d="M6 3.7h8.4" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".6"/>';
  }
  var MAESTRO_LLUEVE = { n: 24, z: [12, 24], formas: [
    { modo: 'cae', vb: '0 0 20 10', g: MAESTRO_GIS('#F29BC4', '#FFE0EE', '#D97BA8') },
    { modo: 'cae', vb: '0 0 20 20', g: '<path d="' + ESPACIO_ESTRELLA(10, 10.8, 9, 3.9) + '" fill="#FFD23F" stroke="#E0A800" stroke-width=".8" stroke-linejoin="round"/>'
      + '<path d="M8.6 6.4l.8-1.8" stroke="#FFF6C4" stroke-width="1.2" stroke-linecap="round"/>' },
    { modo: 'cae', vb: '0 0 16 17', g: '<path d="M8 4.6C6.4 3.2 2.6 3.2 1.8 7.4c-.7 4.2 2 8.6 4.6 8.6.7 0 1.1-.4 1.6-.4s.9.4 1.6.4c2.6 0 5.3-4.4 4.6-8.6C13.4 3.2 9.6 3.2 8 4.6z" fill="#E0393E"/>'
      + '<path d="M8 4.6c0-1.4.4-2.6 1.1-3.4" stroke="#9A6A3A" stroke-width=".9" fill="none" stroke-linecap="round"/>'
      + '<path d="M9 2.4c1.3-1.8 3.6-1.8 4.6-1-1 1.6-3.2 2.1-4.6 1z" fill="#5BBF59"/>'
      + '<ellipse cx="4.6" cy="7.8" rx="1" ry="1.9" transform="rotate(20 4.6 7.8)" fill="#fff" opacity=".6"/>' },
    { modo: 'cae', vb: '0 0 20 10', g: MAESTRO_GIS('#7FD3F2', '#D9F4FF', '#4FAED6') }] };
  alta('maestro',
    { m: MAESTRO_M, m2: MAESTRO_M2, j: MAESTRO_J, mov: 'brinca', mov2: 'saluda', jmov: 'late', lluvia: MAESTRO_LLUEVE, w: 92, w2: 110,
      dice: ['¡Gracias, maestros!', '¡Una manzana para ti!', '¡Diez de calificación!', '¡A+ en todo!'] });
  CSS_FECHAS += '.pt-maestro-brillo{transform-box:fill-box;transform-origin:50% 50%;animation:pt-maestro-brillo 1.3s ease-in-out infinite alternate}'
    + '@keyframes pt-maestro-brillo{from{opacity:.25;transform:scale(.45)}to{opacity:1;transform:scale(1.15) rotate(30deg)}}';

  // Día del Internet (17 de mayo): la señal de wifi enciende sus rayitas una tras otra; y una laptop sin marca
  function INTERNET_WIFI(cx, cy, rs, gr, cols, punto, pr) {
    var h = '', i, s = Math.sin(48 * Math.PI / 180), c = Math.cos(48 * Math.PI / 180);
    for (i = 0; i < rs.length; i++) {
      var r = rs[i];
      h += '<path class="pt-internet-r" style="animation-delay:' + (i * .35).toFixed(2) + 's" d="M' + (cx - r * s).toFixed(2) + ' ' + (cy - r * c).toFixed(2) + 'A' + r + ' ' + r + ' 0 0 1 '
        + (cx + r * s).toFixed(2) + ' ' + (cy - r * c).toFixed(2) + '" stroke="' + cols[i] + '" stroke-width="' + gr + '" fill="none" stroke-linecap="round"/>';
    }
    return h + '<circle cx="' + cx + '" cy="' + cy + '" r="' + pr + '" fill="' + punto + '"/>';
  }
  var INTERNET_M = { vb: '0 0 100 100', g: '<circle cx="50" cy="50" r="46" fill="#24447A" stroke="#4F8BDB" stroke-width="3"/>'
    + '<path d="M22 30a34 34 0 0 1 14-12" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".25"/>'
    + INTERNET_WIFI(50, 72, [16, 31, 46], 9, ['#F07A1E', '#F2C066', '#FFFFFF'], '#F07A1E', 6.5) };
  var INTERNET_M2 = { vb: '0 0 110 76', g: '<ellipse cx="55" cy="74" rx="46" ry="2" fill="#050B18" opacity=".35"/>'
    + '<rect x="18" y="4" width="74" height="54" rx="5" fill="#C9D1DE"/><rect x="22" y="8" width="66" height="46" rx="2" fill="#EAF3FF"/>'
    + '<path d="M22 10a2 2 0 0 1 2-2h62a2 2 0 0 1 2 2v6H22z" fill="#1F3864"/>'
    + '<circle cx="27" cy="12" r="1.6" fill="#F07A1E"/><circle cx="32" cy="12" r="1.6" fill="#F2C066"/><circle cx="37" cy="12" r="1.6" fill="#5BD69A"/>'
    + '<rect x="27" y="21" width="24" height="18" rx="2" fill="#7FB2EA"/><circle cx="45" cy="25.5" r="2.6" fill="#F2C066"/><path d="M27 39l8-9 6 6 4-4 6 7z" fill="#3A6FC4"/>'
    + '<g fill="#B8C4D6"><rect x="55" y="21" width="28" height="3.4" rx="1.7"/><rect x="55" y="28" width="22" height="3.4" rx="1.7"/><rect x="55" y="35" width="25" height="3.4" rx="1.7"/></g>'
    + '<rect x="27" y="44" width="18" height="5" rx="2.5" fill="#F07A1E"/><rect x="55" y="44" width="14" height="5" rx="2.5" fill="#B8C4D6"/>'
    + '<path d="M4 58h102l-6 11a4 4 0 0 1-3.5 2H13.5A4 4 0 0 1 10 69z" fill="#DCE2EC" stroke="#A9B3C3" stroke-width="1"/>'
    + '<path d="M46 58h18v1.4a2 2 0 0 1-2 2H48a2 2 0 0 1-2-2z" fill="#A9B3C3"/>' };
  var INTERNET_J = { vb: '0 0 20 16', g: INTERNET_WIFI(10, 14, [3.8, 7.6, 11.5], 2.2, ['#F07A1E', '#F07A1E', '#F07A1E'], '#3A6FC4', 1.7) };
  // lo que cae al fondo de la entrada: ceros y unos que caen derechito (como datos), arrobas que giran y rayitas de wifi que suben
  var INTERNET_LLUEVE = { n: 26, z: [12, 24], formas: [
    { modo: 'gotea', vb: '0 0 14 20', g: '<ellipse cx="7" cy="10" rx="4.2" ry="6.8" fill="none" stroke="#6FD3FF" stroke-width="2.4"/>' },
    { modo: 'gotea', vb: '0 0 14 20', g: '<path d="M4.2 5.6L7.8 3v14M4.4 17h7" stroke="#FFFFFF" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' },
    { modo: 'cae', vb: '0 0 20 20', g: '<path d="M13 10a3 3 0 1 1-6 0 3 3 0 1 1 6 0zM13 7v4.4c0 1.4.9 2.2 2 2.2 1.6 0 2.6-1.6 2.6-3.6A7.6 7.6 0 1 0 14 16.6" stroke="#F07A1E" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' },
    { modo: 'sube', vb: '0 0 20 16', g: '<path d="M2 6.4a11.4 11.4 0 0 1 16 0M4.8 9.4a7.4 7.4 0 0 1 10.4 0M7.6 12.2a3.4 3.4 0 0 1 4.8 0" stroke="#F2C066" stroke-width="2" fill="none" stroke-linecap="round"/>'
      + '<circle cx="10" cy="14.6" r="1.5" fill="#F07A1E"/>' }] };
  alta('internet',
    { m: INTERNET_M, m2: INTERNET_M2, j: INTERNET_J, mov: 'flota', mov2: 'brinca', jmov: 'late', lluvia: INTERNET_LLUEVE, w: 96, w2: 110,
      dice: ['¡Señal a tope!', '¡Conectados!', '¡Todo en la nube!', '¡Clic y listo!'] });
  CSS_FECHAS += '.pt-internet-r{animation:pt-internet-r 2.4s ease-in-out infinite}'
    + '@keyframes pt-internet-r{0%,8%{opacity:.2}22%,72%{opacity:1}88%,100%{opacity:.2}}';

  // Día de las Abejas (20 de mayo): la abejita vuela aleteando; el panal con su miel que gotea
  function ABEJAS_FRANJA(cx, cy, rx, ry, x1, x2) {
    var arriba = [], abajo = [], i, x, d;
    for (i = 0; i <= 6; i++) {
      x = x1 + (x2 - x1) * i / 6; d = ry * Math.sqrt(Math.max(0, 1 - Math.pow((x - cx) / rx, 2)));
      arriba.push(x.toFixed(2) + ' ' + (cy - d).toFixed(2)); abajo.unshift(x.toFixed(2) + ' ' + (cy + d).toFixed(2));
    }
    return 'M' + arriba.join('L') + 'L' + abajo.join('L') + 'Z';
  }
  function ABEJAS_HEX(cx, cy, r, col) {
    var p = [], i, a;
    for (i = 0; i < 6; i++) { a = Math.PI / 180 * (60 * i - 90); p.push((cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1)); }
    return '<path d="M' + p.join('L') + 'Z" fill="' + col + '" stroke="#D98E1A" stroke-width="3" stroke-linejoin="round"/>';
  }
  var ABEJAS_M = { vb: '0 0 100 84', g: '<g class="pt-abejas-ala"><ellipse cx="46" cy="22" rx="11" ry="17" transform="rotate(-22 46 22)" fill="#EAF6FF" fill-opacity=".92" stroke="#C9D1DE" stroke-width="1.5"/>'
    + '<path d="M46 34q-2-10 2-20" stroke="#C9D1DE" stroke-width="1.2" fill="none"/></g>'
    + '<g class="pt-abejas-ala2"><ellipse cx="63" cy="21" rx="11" ry="17" transform="rotate(20 63 21)" fill="#EAF6FF" fill-opacity=".92" stroke="#C9D1DE" stroke-width="1.5"/>'
    + '<path d="M62 34q1-10-3-20" stroke="#C9D1DE" stroke-width="1.2" fill="none"/></g>'
    + '<path d="M81 48.5L95 52 81 55.5z" fill="#5A3A1E"/>'
    + '<ellipse cx="52" cy="52" rx="32" ry="25" fill="#F7C531"/>'
    + '<path d="' + ABEJAS_FRANJA(52, 52, 32, 25, 50, 58) + ABEJAS_FRANJA(52, 52, 32, 25, 66, 73) + ABEJAS_FRANJA(52, 52, 32, 25, 79, 83.6) + '" fill="#5A3A1E"/>'
    + '<path d="M28 31Q24 18 16 15M38 28Q38 15 44 9" stroke="#5A3A1E" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="16" cy="15" r="3.2" fill="#5A3A1E"/><circle cx="44" cy="9" r="3.2" fill="#5A3A1E"/>'
    + '<circle cx="28" cy="47" r="3.8" fill="#2B2238"/><circle cx="41" cy="46" r="3.8" fill="#2B2238"/><circle cx="29.3" cy="45.6" r="1.3" fill="#fff"/><circle cx="42.3" cy="44.6" r="1.3" fill="#fff"/>'
    + '<path d="M29 56q5.5 4.5 11 0" stroke="#5A3A1E" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
    + '<circle cx="23" cy="55" r="3" fill="#F28B6B" opacity=".6"/><circle cx="46" cy="54" r="3" fill="#F28B6B" opacity=".6"/>'
    + '<path d="M30 34a26 20 0 0 1 14-6" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".45"/>' };
  var ABEJAS_M2 = { vb: '0 0 100 100', g: [[50, 46, '#F2B33D'], [25.75, 46, '#F9CF5A'], [74.25, 46, '#F2B33D'], [37.9, 25, '#F2B33D'], [62.1, 25, '#F9CF5A'], [37.9, 67, '#F9CF5A'], [62.1, 67, '#F2B33D']]
      .map(function (c) { return ABEJAS_HEX(c[0], c[1], 14, c[2]); }).join('')
    + '<path d="M22 40l4-2M58 19l4-2M34 61l4-2" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>'
    + '<path d="M56 79h12v6a6 6 0 0 1-12 0z" fill="#F7A21B"/><path d="M31.9 79h9v3a4.5 4.5 0 0 1-9 0z" fill="#F7A21B"/>'
    + '<g class="pt-abejas-gota"><path d="M62 88c-2 3-3 4.4-3 6a3 3 0 0 0 6 0c0-1.6-1-3-3-6z" fill="#F7A21B"/></g>'
    + FLOR(12, 88, 9, '#fff', '#F4F6FA') + '<circle cx="12" cy="88" r="3" fill="#FFD23F"/>' };
  var ABEJAS_J = { vb: '0 0 18 16', g: '<g class="pt-abejas-ala"><ellipse cx="7.4" cy="4.8" rx="2.8" ry="4" transform="rotate(-20 7.4 4.8)" fill="#EAF6FF" stroke="#C9D1DE" stroke-width=".7"/></g>'
    + '<g class="pt-abejas-ala2"><ellipse cx="11.4" cy="4.6" rx="2.8" ry="4" transform="rotate(18 11.4 4.6)" fill="#EAF6FF" stroke="#C9D1DE" stroke-width=".7"/></g>'
    + '<path d="M15.6 9.6l2.2.9-2.2.9z" fill="#5A3A1E"/>'
    + '<ellipse cx="9.4" cy="10.4" rx="7" ry="5" fill="#F7C531" stroke="#D9A000" stroke-width=".4"/>'
    + '<path d="' + ABEJAS_FRANJA(9.4, 10.4, 7, 5, 9, 11) + ABEJAS_FRANJA(9.4, 10.4, 7, 5, 12.6, 14.4) + '" fill="#5A3A1E"/>'
    + '<circle cx="5.2" cy="9.6" r=".95" fill="#2B2238"/><path d="M4.2 12.2q1.2.9 2.4 0" stroke="#5A3A1E" stroke-width=".55" fill="none" stroke-linecap="round"/>' };
  // lo que cae al fondo de la entrada: florecitas (blancas y rosas) que flotan y gotas de miel
  function ABEJAS_FLORCITA(c, borde) {
    var h = '', i, a;
    for (i = 0; i < 5; i++) { a = Math.PI * 2 / 5 * i - Math.PI / 2; h += '<circle cx="' + (10 + Math.cos(a) * 4.9).toFixed(1) + '" cy="' + (10 + Math.sin(a) * 4.9).toFixed(1) + '" r="4" fill="' + c + '"/>'; }
    return h + '<circle cx="10" cy="10" r="2.9" fill="#FFC21F" stroke="' + borde + '" stroke-width=".8"/>';
  }
  var ABEJAS_LLUEVE = { n: 24, z: [13, 24], formas: [
    { modo: 'flota', vb: '0 0 20 20', g: ABEJAS_FLORCITA('#FFFFFF', '#E0A800') },
    { modo: 'gotea', vb: '0 0 14 20', g: '<path d="M7 1C5 6 2 9 2 13a5 5 0 0 0 10 0c0-4-3-7-5-12z" fill="#F7A21B"/>'
      + '<path d="M4.8 12.6a2.4 2.4 0 0 0 1.8 2.6" stroke="#FFDB8A" stroke-width="1.2" fill="none" stroke-linecap="round"/>' },
    { modo: 'flota', vb: '0 0 20 20', g: ABEJAS_FLORCITA('#F29BC4', '#E8418C') }] };
  alta('abejas',
    { m: ABEJAS_M, m2: ABEJAS_M2, j: ABEJAS_J, mov: 'vuela', mov2: 'mece', jmov: 'vuela', lluvia: ABEJAS_LLUEVE,
      dice: ['¡Bzzz, bzzz!', '¡A polinizar!', '¡Dulce miel!', '¡Cuida a las abejas!'] });
  CSS_FECHAS += '.pt-abejas-ala,.pt-abejas-ala2{transform-box:fill-box;transform-origin:50% 100%;animation:pt-abejas-ala .2s ease-in-out infinite alternate}'
    + '.pt-abejas-ala2{animation-name:pt-abejas-ala2}'
    + '@keyframes pt-abejas-ala{from{transform:none}to{transform:scaleY(.6) rotate(-10deg)}}@keyframes pt-abejas-ala2{from{transform:none}to{transform:scaleY(.6) rotate(10deg)}}'
    + '.pt-abejas-gota{transform-box:fill-box;transform-origin:50% 0;animation:pt-abejas-gota 2.2s ease-in infinite}'
    + '@keyframes pt-abejas-gota{0%{transform:scale(.3);opacity:1}40%{transform:scale(1);opacity:1}80%{transform:translateY(60%);opacity:0}100%{transform:translateY(60%);opacity:0}}';

  // Día del Estudiante (23 de mayo): el birrete vuela (la borla se balancea) y el diploma con listón
  var ESTUDIANTE_M = { vb: '0 0 110 86', g: '<g stroke="#fff" stroke-linecap="round" opacity=".35"><path d="M4 62h14" stroke-width="3"/><path d="M8 72h12" stroke-width="3"/><path d="M2 52h10" stroke-width="2.4"/></g>'
    + '<path d="M22 12l1.4 3.6 3.6 1.4-3.6 1.4-1.4 3.6-1.4-3.6-3.6-1.4 3.6-1.4z" fill="#FFE27A"/>'
    + '<g transform="rotate(-8 55 42)">'
    + '<path d="M30 40v18c0 8 50 8 50 0V40z" fill="#26406E" stroke="#6F8FC8" stroke-width="1.4"/>'
    + '<path d="M6 32l49 18 49-18v4L55 54 6 36z" fill="#1F3864" stroke="#6F8FC8" stroke-width="1.2" stroke-linejoin="round"/>'
    + '<path d="M55 14l49 18-49 18L6 32z" fill="#34528A" stroke="#7FA0D6" stroke-width="1.4" stroke-linejoin="round"/>'
    + '<path d="M58 19l34 12.4" stroke="#5578B4" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>'
    + '<path d="M55 32Q76 34 90 37" stroke="#F2C066" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="55" cy="32" r="3.4" fill="#F2C066"/>'
    + '<g class="pt-estudiante-borla"><path d="M90 37V58" stroke="#F2C066" stroke-width="2.4" stroke-linecap="round"/><circle cx="90" cy="58" r="3" fill="#F2C066"/>'
    + '<path d="M86 60h8l2 16H84z" fill="#F2C066"/><path d="M88 62v13M90 62v13M92 62v13" stroke="#D9A13A" stroke-width="1"/></g></g>' };
  var ESTUDIANTE_M2 = { vb: '0 0 110 76', g: '<ellipse cx="55" cy="73" rx="44" ry="2.4" fill="#050B18" opacity=".35"/>'
    + '<rect x="16" y="22" width="80" height="28" fill="#F7EED8" stroke="#E2D2B6" stroke-width="1.2"/>'
    + '<ellipse cx="96" cy="36" rx="6" ry="14" fill="#EFE2C4" stroke="#D8C59E" stroke-width="1.2"/><path d="M96 31a3 3 0 1 1-2.4 5" stroke="#C9B48A" stroke-width="1.2" fill="none"/>'
    + '<ellipse cx="16" cy="36" rx="6" ry="14" fill="#F7EED8" stroke="#D8C59E" stroke-width="1.2"/>'
    + '<path d="M26 30h20M26 36h16M26 42h18M66 30h20M70 36h16M68 42h18" stroke="#C9B48A" stroke-width="2" stroke-linecap="round"/>'
    + '<rect x="50" y="21" width="12" height="30" fill="#F07A1E"/>'
    + '<path d="M52 48l-7 22 6-3 4 5 2-24zM60 48l7 22-6-3-4 5-2-24z" fill="#D9621A"/>'
    + '<circle cx="56" cy="36" r="9" fill="#F2C066" stroke="#D9A13A" stroke-width="1.4"/>'
    + '<path d="' + ESPACIO_ESTRELLA(56, 36.4, 5.4, 2.3) + '" fill="#fff"/>' };
  var ESTUDIANTE_J = { vb: '0 0 20 16', g: '<path d="M5 7.8v3.6c0 2.2 10 2.2 10 0V7.8z" fill="#2E4A7E" stroke="#9FB3D6" stroke-width=".5"/>'
    + '<path d="M10 1.8l9.4 3.8L10 9.4.6 5.6z" fill="#3A5A94" stroke="#9FB3D6" stroke-width=".5" stroke-linejoin="round"/>'
    + '<circle cx="10" cy="5.6" r=".85" fill="#F2B33D"/><path d="M10 5.6l6.4 1.6" stroke="#F2B33D" stroke-width=".8" stroke-linecap="round"/>'
    + '<g class="pt-estudiante-borla"><path d="M16.4 7.2v4.4" stroke="#F2B33D" stroke-width=".8"/><path d="M15.4 11.2h2l.5 3.6h-3z" fill="#F2B33D"/></g>' };
  // lo que cae al fondo de la entrada: birretes chiquitos (como los que se avientan al graduarse) y lápices amarillos y azules
  function ESTUDIANTE_LAPIZ(c, luz, sombra) {
    return '<path d="M3 1.6h12.6v4.8H3z" fill="' + c + '"/><path d="M3 3h12.6" stroke="' + luz + '" stroke-width="1"/><path d="M3 5.4h12.6" stroke="' + sombra + '" stroke-width=".8"/>'
      + '<path d="M15.6 1.6L21 4l-5.4 2.4z" fill="#F2D29B"/><path d="M19.2 3.2L21 4l-1.8.8z" fill="#3A2A20"/>'
      + '<rect x="1.6" y="1.6" width="2" height="4.8" fill="#C9D1DE"/><path d="M1.6 1.6H1a1 1 0 0 0-1 1v2.8a1 1 0 0 0 1 1h.6z" fill="#F29BC4"/>';
  }
  var ESTUDIANTE_LLUEVE = { n: 24, z: [16, 28], formas: [
    { modo: 'cae', vb: '0 0 20 16', g: '<path d="M5.2 7.6v3.8c0 2.4 9.6 2.4 9.6 0V7.6z" fill="#5577B8" stroke="#A9C1EC" stroke-width=".6"/>'
      + '<path d="M10 1.6l9 3.8L10 9.2 1 5.4z" fill="#86A6E0" stroke="#E2ECFB" stroke-width=".8" stroke-linejoin="round"/>'
      + '<circle cx="10" cy="5.4" r=".9" fill="#F2C066"/><path d="M10 5.4l5.6 1.6v4.4" stroke="#F2C066" stroke-width=".9" fill="none" stroke-linecap="round"/>'
      + '<path d="M14.8 11h1.6l.5 3h-2.6z" fill="#F2C066"/>' },
    { modo: 'cae', vb: '0 0 22 8', g: ESTUDIANTE_LAPIZ('#F7C531', '#FFE27A', '#D9A000') },
    { modo: 'cae', vb: '0 0 22 8', g: ESTUDIANTE_LAPIZ('#4F9BE8', '#A9D0FA', '#2F6FC0') }] };
  alta('estudiante',
    { m: ESTUDIANTE_M, m2: ESTUDIANTE_M2, j: ESTUDIANTE_J, mov: 'vuela', mov2: 'mece', jmov: 'vuela', lluvia: ESTUDIANTE_LLUEVE, w: 110, w2: 104,
      dice: ['¡Lo lograste!', '¡A volar, birrete!', '¡Con honores!', '¡Sigue estudiando!'] });
  CSS_FECHAS += '.pt-estudiante-borla{transform-box:fill-box;transform-origin:50% 0;animation:pt-estudiante-borla 1.1s ease-in-out infinite alternate}'
    + '@keyframes pt-estudiante-borla{from{transform:rotate(12deg)}to{transform:rotate(-14deg)}}';

  // Día del Contador (25 de mayo): la calculadora brinca (se aprieta el «=» y sale la cinta), la gráfica crece,
  // y dos piezas más arriba: las monedas y la hoja de balance con palomita
  var CONTADOR_DIG = ['abcdef', 'bc', 'abdeg', 'abcdg', 'bcfg', 'acdfg', 'acdefg', 'abc', 'abcdefg', 'abcdfg'];
  function CONTADOR_SEG(s, x, y, w, h) {
    var t = w * .2, m = y + h / 2, d = '', i, q, L = {
      a: [x + t, y, x + w - t, y], b: [x + w, y + t, x + w, m - t], c: [x + w, m + t, x + w, y + h - t],
      d: [x + t, y + h, x + w - t, y + h], e: [x, m + t, x, y + h - t], f: [x, y + t, x, m - t], g: [x + t, m, x + w - t, m] };
    for (i = 0; i < s.length; i++) { q = L[s.charAt(i)]; d += 'M' + q[0].toFixed(1) + ' ' + q[1].toFixed(1) + 'L' + q[2].toFixed(1) + ' ' + q[3].toFixed(1); }
    return d;
  }
  function CONTADOR_PANTALLA() {
    var xs = [21, 31, 41, 54, 64], ds = [1, 0, 0, 0, 0], ghost = '', luz = '', i;
    for (i = 0; i < xs.length; i++) { ghost += CONTADOR_SEG('abcdefg', xs[i], 38, 6.4, 12.6); luz += CONTADOR_SEG(CONTADOR_DIG[ds[i]], xs[i], 38, 6.4, 12.6); }
    return '<g transform="translate(6.2 0) skewX(-8)" stroke-linecap="round" fill="none"><path d="' + ghost + '" stroke="#FFB25C" stroke-width="1.9" opacity=".13"/>'
      + '<path d="' + luz + '" stroke="#FFB25C" stroke-width="1.9"/><circle cx="50" cy="50.6" r="1.3" fill="#FFB25C"/></g>';
  }
  function CONTADOR_TECLAS() {
    var h = '', xs = [15, 31, 47, 63], ys = [62, 75, 88, 101], r, c, x, y, cx, cy, col, lab, sim, t;
    for (r = 0; r < 4; r++) for (c = 0; c < 4; c++) {
      x = xs[c]; y = ys[r]; cx = x + 7; cy = y + 5; sim = '';
      if (c === 3) { col = '#F07A1E'; lab = '#C55F12'; sim = ['M' + (cx - 2.4) + ' ' + (cy - 2.4) + 'l4.8 4.8m0-4.8l-4.8 4.8', 'M' + (cx - 3) + ' ' + cy + 'h6', 'M' + (cx - 3) + ' ' + cy + 'h6M' + cx + ' ' + (cy - 3) + 'v6', 'M' + (cx - 3) + ' ' + (cy - 1.7) + 'h6M' + (cx - 3) + ' ' + (cy + 1.7) + 'h6'][r]; }
      else if (r === 0 && c === 0) { col = '#F2C066'; lab = '#C99A3A'; sim = 'M' + (cx + 2.2) + ' ' + (cy - 2) + 'a3 3 0 1 0 0 4'; }
      else { col = '#F4F6FA'; lab = '#9FB3D6'; }
      t = '<rect x="' + x + '" y="' + (y + 1.8) + '" width="14" height="10" rx="2.6" fill="' + lab + '"/><rect x="' + x + '" y="' + y + '" width="14" height="10" rx="2.6" fill="' + col + '"/>'
        + (sim ? '<path d="' + sim + '" stroke="' + (c === 3 ? '#fff' : '#7A4A12') + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>' : '');
      h += r === 3 && c === 3 ? '<g class="pt-contador-tecla">' + t + '</g>' : t;
    }
    return h;
  }
  var CONTADOR_M = { vb: '0 0 92 120', g: '<ellipse cx="46" cy="117" rx="34" ry="2.6" fill="#050B18" opacity=".35"/>'
    + '<g class="pt-contador-cinta"><path d="M26 30V6l3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3V30z" fill="#FFFDF7" stroke="#D8CFBC" stroke-width="1"/>'
    + '<path d="M31 11h17M31 16h20M31 21h15" stroke="#B8C4D6" stroke-width="1.6" stroke-linecap="round"/>'
    + '<path d="M55 11h6M57 16h4" stroke="#B8C4D6" stroke-width="1.6" stroke-linecap="round"/><path d="M53 22l2.4 2.4 4.6-5" stroke="#2BB673" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>'
    + '<rect x="8" y="22" width="76" height="94" rx="13" fill="#2E5FA8"/>'
    + '<path d="M8 100v3a13 13 0 0 0 13 13h50a13 13 0 0 0 13-13v-3z" fill="#244C88"/>'
    + '<rect x="8" y="22" width="76" height="94" rx="13" fill="none" stroke="#5B8BD6" stroke-width="1.6"/>'
    + '<path d="M17 28.5h20" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".3"/>'
    + '<rect x="15" y="33" width="62" height="23" rx="5" fill="#13254A"/>' + CONTADOR_PANTALLA() + CONTADOR_TECLAS() };
  function CONTADOR_BARRA(x, h, col, i) {
    return '<g class="pt-contador-barra" style="animation-delay:' + (i * .15).toFixed(2) + 's"><path d="M' + x + ' 76V' + (79 - h) + 'a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3V76z" fill="' + col + '"/></g>';
  }
  var CONTADOR_M2 = { vb: '0 0 100 92', g: '<rect x="4" y="6" width="92" height="82" rx="10" fill="#F4F7FC" stroke="#C9D1DE" stroke-width="1.2"/>'
    + '<path d="M14 22h72M14 40h72M14 58h72" stroke="#DCE2EC" stroke-width="1"/>'
    + CONTADOR_BARRA(18, 18, '#7FB2EA', 0) + CONTADOR_BARRA(36, 28, '#3A6FC4', 1) + CONTADOR_BARRA(54, 40, '#1F3864', 2) + CONTADOR_BARRA(72, 52, '#F07A1E', 3)
    + '<path d="M14 76h72" stroke="#8A94A6" stroke-width="2" stroke-linecap="round"/>'
    + '<path class="pt-contador-linea" pathLength="100" d="M20 62L42 52 60 38 80 20" stroke="#2BB673" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<path class="pt-contador-punta" d="M85 16L82 23.5 77 17.3Z" fill="#2BB673" stroke="#2BB673" stroke-width="1.4" stroke-linejoin="round"/>'
    + '<circle cx="24" cy="30" r="7" fill="#F2C066" stroke="#D9A13A" stroke-width="1.2"/>'
    + '<path d="M26.4 26.8c-.6-.9-1.6-1.3-2.6-1.3-1.5 0-2.5.8-2.5 1.9 0 2.6 5.4 1.4 5.4 4.2 0 1.2-1.1 2-2.7 2-1.2 0-2.3-.5-2.9-1.4M23.9 24v12" stroke="#A0701A" stroke-width="1.4" fill="none" stroke-linecap="round"/>' };
  function CONTADOR_MONEDA(x, y, r) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#F2C066" stroke="#D9A13A" stroke-width="1.6"/><circle cx="' + x + '" cy="' + y + '" r="' + (r * .72).toFixed(1) + '" fill="none" stroke="#FFE08A" stroke-width="1.2"/>';
  }
  var CONTADOR_MONEDAS = { vb: '0 0 52 46', g: [38, 32, 26, 20].map(function (y) {
      return '<path d="M6 ' + y + 'v4a14 4.5 0 0 0 28 0v-4" fill="#D9A13A"/><ellipse cx="20" cy="' + y + '" rx="14" ry="4.5" fill="#F2C066" stroke="#D9A13A" stroke-width="1"/>';
    }).join('') + CONTADOR_MONEDA(39, 28, 11)
    + '<path d="M42 23.6c-.7-1-1.8-1.5-3-1.5-1.7 0-2.9.9-2.9 2.2 0 3 6.2 1.6 6.2 4.8 0 1.4-1.3 2.3-3.1 2.3-1.4 0-2.6-.6-3.3-1.6M39 21v14" stroke="#A0701A" stroke-width="1.6" fill="none" stroke-linecap="round"/>' };
  var CONTADOR_HOJA = { vb: '0 0 44 54', g: '<path d="M5 3h24l11 11v35a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z" fill="#FFFDF7" stroke="#C9D1DE" stroke-width="1.2"/>'
    + '<path d="M29 3v11h11z" fill="#DCE2EC"/><path d="M8 17h15M8 23h24M8 29h20M8 35h12" stroke="#B8C4D6" stroke-width="2" stroke-linecap="round"/>'
    + '<path d="M8 41h12" stroke="#1F3864" stroke-width="2" stroke-linecap="round"/><path d="M8 44.5h12" stroke="#1F3864" stroke-width="1.2" stroke-linecap="round"/>'
    + '<circle cx="32" cy="42" r="8" fill="#2BB673"/><path d="M28.2 42l2.8 2.9 4.8-5.6" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' };
  var CONTADOR_J = { vb: '0 0 15 16', g: '<rect x=".8" y=".6" width="13.4" height="14.8" rx="2.4" fill="#2E5FA8"/>'
    + '<rect x="2.4" y="2.2" width="10.2" height="3.8" rx=".9" fill="#13254A"/><rect x="6.6" y="3.3" width="5" height="1.6" rx=".5" fill="#FFB25C"/>'
    + [7.4, 10, 12.6].map(function (y) { return [2.4, 5, 7.6].map(function (x) { return '<rect x="' + x + '" y="' + y + '" width="2.2" height="1.8" rx=".5" fill="#F4F6FA"/>'; }).join(''); }).join('')
    + '<rect x="10.2" y="7.4" width="2.4" height="1.8" rx=".5" fill="#F07A1E"/><rect x="10.2" y="10" width="2.4" height="4.4" rx=".6" fill="#F07A1E"/>' };
  // lo que cae al fondo de la entrada: monedas de oro con su $ que caen girando, signos de $ verdes y el 2 y el 5 (del 25 de mayo),
  // con su sombrita naranja, que flotan y caen derechito
  function CONTADOR_TRAZO(d, c, sombra, g) {
    return '<path d="' + d + '" transform="translate(1 1)" stroke="' + sombra + '" stroke-width="' + g + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
      + '<path d="' + d + '" stroke="' + c + '" stroke-width="' + g + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  var CONTADOR_PESOS = 'M10.8 5.4C10 4 8.6 3.4 7 3.4c-2.3 0-3.9 1.2-3.9 2.9 0 4 8.2 2.1 8.2 6.3 0 1.8-1.7 3.1-4.2 3.1-1.8 0-3.5-.8-4.4-2.1M7 1.2v17.6';
  var CONTADOR_LLUEVE = { n: 26, z: [13, 26], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: CONTADOR_MONEDA(10, 10, 8.4)
      + '<path d="M12.5 7c-.6-.9-1.5-1.3-2.5-1.3-1.4 0-2.4.8-2.4 1.8 0 2.5 5.2 1.3 5.2 4 0 1.1-1 1.9-2.6 1.9-1.1 0-2.2-.5-2.8-1.3M10 4.4v11.2" stroke="#A0701A" stroke-width="1.4" fill="none" stroke-linecap="round"/>' },
    { modo: 'flota', vb: '0 0 15 21', g: CONTADOR_TRAZO(CONTADOR_PESOS, '#3CCB84', '#17784A', 2.4) },
    { modo: 'flota', vb: '0 0 15 21', g: CONTADOR_TRAZO('M3.4 6.4c0-2.1 1.7-3.6 3.9-3.6s3.9 1.5 3.9 3.5c0 1.6-.9 2.8-2.4 4.2L3.4 16.6h7.8', '#FFFFFF', '#F07A1E', 2.4) },
    { modo: 'gotea', vb: '0 0 15 21', g: CONTADOR_TRAZO('M10.6 3.2H4.6L4 9.2c.9-.7 2-1.1 3.3-1.1 2.3 0 3.9 1.7 3.9 4.1 0 2.6-1.8 4.4-4.3 4.4-1.6 0-2.9-.6-3.7-1.7', '#9CCBFA', '#F07A1E', 2.4) }] };
  alta('contador',
    { m: CONTADOR_M, m2: CONTADOR_M2, j: CONTADOR_J, mov: 'brinca', mov2: 'late', jmov: 'brinca', lluvia: CONTADOR_LLUEVE, w: 92, w2: 100,
      dice: ['¡Cuadra al centavo!', '¡Feliz día, colegas!', '¡Números sanos!', '¡Todo en orden!'],
      extra: [['pt-p pt-a-flota', svg(CONTADOR_MONEDAS), 'left:12%;top:13%;width:50px', '¡Ahorro en orden!', 'pt-brinca'],
        ['pt-p pt-a-flota pt-a-tarde', svg(CONTADOR_HOJA), 'right:13%;top:11%;width:40px', '¡Balance cuadrado!', 'pt-brinca']] });
  CSS_FECHAS += '.pt-contador-cinta{transform-box:fill-box;transform-origin:50% 100%;animation:pt-contador-cinta 1.7s ease-in-out infinite}'
    + '@keyframes pt-contador-cinta{0%,30%,100%{transform:none}50%{transform:translateY(-14%)}70%{transform:translateY(-8%)}}'
    + '.pt-contador-tecla{transform-box:fill-box;transform-origin:50% 100%;animation:pt-contador-tecla 1.7s ease-in-out infinite}'
    + '@keyframes pt-contador-tecla{0%,20%,44%,100%{transform:none}30%,36%{transform:translateY(14%)}}'
    + '.pt-contador-barra{transform-box:fill-box;transform-origin:50% 100%;animation:pt-contador-barra 3.2s ease-in-out infinite}'
    + '@keyframes pt-contador-barra{0%{transform:scaleY(.12)}28%{transform:scaleY(1.07)}38%,82%{transform:none}100%{transform:scaleY(.12)}}'
    + '.pt-contador-linea{stroke-dasharray:100;animation:pt-contador-linea 3.2s ease-in-out infinite}'
    + '@keyframes pt-contador-linea{0%,12%{stroke-dashoffset:100}46%,82%{stroke-dashoffset:0}100%{stroke-dashoffset:100}}'
    + '.pt-contador-punta{animation:pt-contador-punta 3.2s ease-in-out infinite}@keyframes pt-contador-punta{0%,40%{opacity:0}48%,82%{opacity:1}96%,100%{opacity:0}}';

  // Día de la Hamburguesa (28 de mayo): la hamburguesa brinca (y se le levanta el pan) y la botella de catsup se mece
  var HAMBURGUESA_M = { vb: '0 0 100 90', g: '<ellipse cx="50" cy="87" rx="38" ry="2.6" fill="#050B18" opacity=".35"/>'
    + '<path d="M12 73h76c0 8-7 13-16 13H28c-9 0-16-5-16-13z" fill="#E0943F"/>'
    + '<rect x="9" y="60" width="82" height="15" rx="7.5" fill="#7A4A2A"/>'
    + '<path d="M20 69h10M40 71h12M64 69h10" stroke="#5C3620" stroke-width="2" stroke-linecap="round"/>'
    + '<path d="M10 58h80v3l-9 10-7-10H55l-6 11-6-11H27l-7 8-6-8h-4z" fill="#F7C531" stroke="#F7C531" stroke-width="1.4" stroke-linejoin="round"/>'
    + '<rect x="12" y="53" width="76" height="7.5" rx="3.75" fill="#E0483A"/>'
    + '<path d="M8 51c2.5-5 7.5-5 10 0 2.5-5 7.5-5 10 0 2.5-5 7.5-5 10 0 2.5-5 7.5-5 10 0 2.5-5 7.5-5 10 0 2.5-5 7.5-5 10 0 2.5-5 7.5-5 10 0 2.5-5 7.5-5 10 0v4H8z" fill="#6BBF59"/>'
    + '<g class="pt-hamburguesa-tapa"><path d="M10 41C10 19 28 6 50 6s40 13 40 35c0 3-3 5-6 5H16c-3 0-6-2-6-5z" fill="#EFA24A"/>'
    + '<path d="M18 27c4-10 12-15 22-17" stroke="#fff" stroke-width="3.5" opacity=".35" fill="none" stroke-linecap="round"/>'
    + [[30, 17, -30], [43, 12, 10], [57, 12, -15], [69, 18, 25], [77, 28, 40], [23, 28, -40]].map(function (s) {
      return '<ellipse cx="' + s[0] + '" cy="' + s[1] + '" rx="2.6" ry="1.4" fill="#FFF3D6" transform="rotate(' + s[2] + ' ' + s[0] + ' ' + s[1] + ')"/>';
    }).join('')
    + '<circle cx="40" cy="30" r="3.2" fill="#3A2A20"/><circle cx="60" cy="30" r="3.2" fill="#3A2A20"/><circle cx="41" cy="29" r="1" fill="#fff"/><circle cx="61" cy="29" r="1" fill="#fff"/>'
    + '<path d="M45 35.5q5 4.5 10 0" stroke="#3A2A20" stroke-width="2" fill="none" stroke-linecap="round"/>'
    + '<circle cx="33" cy="36" r="3" fill="#E8735A" opacity=".55"/><circle cx="67" cy="36" r="3" fill="#E8735A" opacity=".55"/></g>' };
  var HAMBURGUESA_M2 = { vb: '0 0 60 112', g: '<ellipse cx="30" cy="109" rx="18" ry="2.4" fill="#050B18" opacity=".35"/>'
    + '<path d="M27.5 5h5l2.5 11h-10z" fill="#EEF1F6" stroke="#C9D1DE" stroke-width="1"/><circle cx="30" cy="4.6" r="2" fill="#D7263D"/>'
    + '<rect x="20" y="15" width="20" height="10" rx="2" fill="#EEF1F6" stroke="#C9D1DE" stroke-width="1"/><path d="M24 18v4M28 18v4M32 18v4M36 18v4" stroke="#C9D1DE" stroke-width="1"/>'
    + '<path d="M14 36c0-8 6-12 16-12s16 4 16 12v62c0 5-4 9-9 9H23c-5 0-9-4-9-9z" fill="#D7263D"/>'
    + '<path d="M19.5 38v54" stroke="#fff" stroke-width="3.5" opacity=".3" stroke-linecap="round"/>'
    + '<rect x="18" y="50" width="24" height="34" rx="6" fill="#FFF3D6"/>'
    + '<path d="M22 56h16M22 78h16" stroke="#F07A1E" stroke-width="2.4" stroke-linecap="round"/>'
    + '<circle cx="30" cy="68" r="7.5" fill="#E0483A"/><path d="M26.5 61.6c1.8 1 2.6 1 3.5 0 .9 1 1.7 1 3.5 0-.8 2-1.8 2.8-3.5 2.8s-2.7-.8-3.5-2.8z" fill="#4E9A3A"/>'
    + '<circle cx="27.4" cy="66" r="1.7" fill="#fff" opacity=".55"/>' };
  var HAMBURGUESA_J = { vb: '0 0 18 16', g: '<path d="M2.2 12h13.6c0 1.8-1.2 2.8-2.8 2.8H5c-1.6 0-2.8-1-2.8-2.8z" fill="#E0943F"/>'
    + '<rect x="1.4" y="9.6" width="15.2" height="2.8" rx="1.4" fill="#7A4A2A"/>'
    + '<path d="M1.8 9.4h14.4l-1.6 2-1.4-1.4-1.4 1.6-1.6-1.6H5.6l-1.4 1.4z" fill="#F7C531"/>'
    + '<path d="M1.2 8.6c.5-1 1.5-1 2 0 .5-1 1.5-1 2 0 .5-1 1.5-1 2 0 .5-1 1.5-1 2 0 .5-1 1.5-1 2 0 .5-1 1.5-1 2 0 .5-1 1.5-1 2 0 .5-1 1.5-1 2 0v1H1.2z" fill="#6BBF59"/>'
    + '<path d="M1.8 7.8C1.8 3.6 5 1.2 9 1.2s7.2 2.4 7.2 6.6c0 .6-.4.9-1 .9H2.8c-.6 0-1-.3-1-.9z" fill="#EFA24A" stroke="#C9772A" stroke-width=".35"/>'
    + '<g fill="#FFF3D6"><ellipse cx="6" cy="4" rx=".7" ry=".4"/><ellipse cx="9" cy="3" rx=".7" ry=".4"/><ellipse cx="12" cy="4.2" rx=".7" ry=".4"/><ellipse cx="7.6" cy="5.8" rx=".7" ry=".4"/><ellipse cx="10.6" cy="5.8" rx=".7" ry=".4"/></g>' };
  // lo que cae al fondo de la entrada: semillitas de ajonjolí y rodajas de pepinillo (con su orilla ondulada) y de tomate
  function HAMBURGUESA_ONDA(r1, r2) {
    var p = [], i, a;
    for (i = 0; i < 24; i++) { a = Math.PI / 12 * i; p.push((10 + (i % 2 ? r2 : r1) * Math.cos(a)).toFixed(2) + ' ' + (10 + (i % 2 ? r2 : r1) * Math.sin(a)).toFixed(2)); }
    return 'M' + p.join('L') + 'Z';
  }
  function HAMBURGUESA_RUEDA(n, r, f) {
    var h = '', i, a;
    for (i = 0; i < n; i++) { a = Math.PI * 2 / n * i + Math.PI / n; h += f((10 + r * Math.cos(a)).toFixed(2), (10 + r * Math.sin(a)).toFixed(2), (a * 180 / Math.PI).toFixed(0)); }
    return h;
  }
  var HAMBURGUESA_LLUEVE = { n: 26, z: [14, 26], formas: [
    { modo: 'cae', vb: '0 0 20 20', g: '<g fill="#FFF3D6" stroke="#E6CFA0" stroke-width=".5"><ellipse cx="6.4" cy="6" rx="3.4" ry="1.8" transform="rotate(-35 6.4 6)"/>'
      + '<ellipse cx="14" cy="8.6" rx="3.4" ry="1.8" transform="rotate(20 14 8.6)"/><ellipse cx="8.4" cy="14.2" rx="3.4" ry="1.8" transform="rotate(-70 8.4 14.2)"/></g>' },
    { modo: 'cae', vb: '0 0 20 20', g: '<path d="' + HAMBURGUESA_ONDA(9, 8) + '" fill="#3F7F2A" stroke="#3F7F2A" stroke-width=".6" stroke-linejoin="round"/>'
      + '<circle cx="10" cy="10" r="6.7" fill="#9CCB5A"/><circle cx="10" cy="10" r="3.4" fill="#C4E28C"/>'
      + HAMBURGUESA_RUEDA(6, 4.6, function (x, y, g) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="1" ry=".6" transform="rotate(' + g + ' ' + x + ' ' + y + ')" fill="#F2FAD9"/>'; }) },
    { modo: 'cae', vb: '0 0 20 20', g: '<circle cx="10" cy="10" r="8.8" fill="#C81F33"/><circle cx="10" cy="10" r="7.4" fill="#EF4B3F"/>'
      + HAMBURGUESA_RUEDA(4, 3.9, function (x, y, g) {
        return '<ellipse cx="' + x + '" cy="' + y + '" rx="2.7" ry="1.8" transform="rotate(' + g + ' ' + x + ' ' + y + ')" fill="#FF8F78"/><circle cx="' + x + '" cy="' + y + '" r=".7" fill="#FFE08A"/>';
      }) + '<circle cx="10" cy="10" r="1.4" fill="#F9A090"/>' }] };
  alta('hamburguesa',
    { m: HAMBURGUESA_M, m2: HAMBURGUESA_M2, j: HAMBURGUESA_J, mov: 'brinca', mov2: 'mece', jmov: 'brinca', lluvia: HAMBURGUESA_LLUEVE, w2: 56,
      dice: ['¡Con todo, porfa!', '¡Doble queso!', '¡Más catsup!', '¡Ñam, qué rica!'] });
  CSS_FECHAS += '.pt-hamburguesa-tapa{transform-box:fill-box;transform-origin:50% 100%;animation:pt-hamburguesa-tapa 1.7s ease-in-out infinite}'
    + '@keyframes pt-hamburguesa-tapa{0%,100%{transform:none}24%{transform:translateY(-12%) rotate(-3deg)}40%{transform:none}50%{transform:translateY(-4%)}60%{transform:none}}';
  return CSS_FECHAS;
});
