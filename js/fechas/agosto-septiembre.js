/* Portal PROFASE · dibujos de las fechas «chispa» de agosto y septiembre (Daniel, 31-oct-2026: «sí a todas»; en la entrada y
   adentro). js/temporada.js baja este archivo solo los días de una de sus fechas, para que el portal siga ligero; las
   fechas, su felicitación y su día viven allá, en TEMPORADAS. Dibujos propios: ninguno es el signo PROFASE, ni marcas,
   ni personajes. Agregar o quitar fechas solo lo decide Daniel (CLAUDE.md). */
(window.PROFASE_TEMPORADA_FECHAS = window.PROFASE_TEMPORADA_FECHAS || []).push(function (T) {
  'use strict';
  var alta = T.alta, CSS_FECHAS = '';
  /* ---------- fechas «chispa», parte D: agosto y septiembre ---------- */

  // destello de cuatro puntas (lo usan varias fechas de esta parte; titila con la clase pt-sandia-chispa)
  function SANDIA_CHISPA(x, y, r, color) {
    return '<path d="M' + x + ' ' + (y - r) + 'Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y + r)
      + 'Q' + x + ' ' + y + ' ' + (x - r) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y - r) + 'Z" fill="' + (color || '#FFE27A') + '"/>';
  }
  function SANDIA_BRILLA(x, y, r, tarde, color) {
    return '<g class="pt-sandia-chispa' + (tarde ? ' pt-sandia-tarde' : '') + '">' + SANDIA_CHISPA(x, y, r, color) + '</g>';
  }
  CSS_FECHAS += '.pt-sandia-chispa{transform-box:fill-box;transform-origin:50% 50%;animation:pt-sandia-chispa 1.8s ease-in-out infinite}.pt-sandia-tarde{animation-delay:-.9s}'
    + '@keyframes pt-sandia-chispa{0%,100%{opacity:.15;transform:scale(.4) rotate(0)}50%{opacity:1;transform:scale(1) rotate(45deg)}}';

  // Día de la Sandía (3 de agosto): la rebanada se mece como cunita; la sandía entera brinca
  function SANDIA_PEPITAS(lista, cx, cy, a, b) {
    return lista.map(function (p) {
      var g = Math.atan2(p[1] - cy, p[0] - cx) * 180 / Math.PI - 90;
      return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="' + a + '" ry="' + b + '" transform="rotate(' + g.toFixed(0) + ' ' + p[0] + ' ' + p[1] + ')"/>';
    }).join('');
  }
  function SANDIA_RAYA(k) {   // raya en zigzag de la sandía entera, de punta a punta
    var d = '', i, t, x, y;
    for (i = 0; i <= 20; i++) {
      t = -.94 + i * .094; x = 50 + 44 * t;
      y = 40 + k * 28 * Math.sqrt(Math.max(0, 1 - t * t)) + 1.7 * (i % 2 ? 1 : -1);
      d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
    }
    return '<path d="' + d + '"/>';
  }
  var SANDIA_M = { vb: '0 0 100 66', g: SANDIA_BRILLA(86, 6, 5) + SANDIA_BRILLA(13, 8, 3.6, 1)
    + '<path d="M2 16A48 48 0 0 0 98 16Z" fill="#2E8B3E"/><path d="M6.5 16A43.5 43.5 0 0 0 93.5 16Z" fill="#B8E07A"/>'
    + '<path d="M10 16A40 40 0 0 0 90 16Z" fill="#F0455A"/><path d="M11 16h78" stroke="#FF8A94" stroke-width="2.4" stroke-linecap="round"/>'
    + '<path d="M18 24q5 13 17 20" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".35"/>'
    + '<g fill="#3A2A20">' + SANDIA_PEPITAS([[30, 24], [50, 23], [70, 24], [21, 33], [40, 34], [60, 34], [79, 33], [30, 44], [50, 46], [70, 44], [42, 50], [58, 50]], 50, 16, 1.6, 2.8) + '</g>' };
  var SANDIA_M2 = { vb: '0 0 100 72', g: '<path d="M7 38c-4-2-5-7-2-10" stroke="#8C6A3D" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    + '<ellipse cx="50" cy="40" rx="45" ry="29" fill="#5DB85A"/>'
    + '<g stroke="#2A7A36" stroke-width="4.4" fill="none" stroke-linecap="round" stroke-linejoin="round">' + [-.7, -.35, 0, .35, .7].map(SANDIA_RAYA).join('') + '</g>'
    + '<ellipse cx="33" cy="25" rx="12" ry="4.6" fill="#fff" opacity=".22" transform="rotate(-14 33 25)"/>' };
  var SANDIA_J = { vb: '0 0 18 18', g: '<path d="M.4 14.6Q9 19.8 17.6 14.6L17 13.2Q9 18 1 13.2Z" fill="#2E8B3E"/>'
    + '<path d="M1 13.2Q9 18 17 13.2L16.3 12Q9 16.4 1.7 12Z" fill="#B8E07A"/><path d="M9 1.2 1.7 12Q9 16.4 16.3 12Z" fill="#F0455A" stroke="#F0455A" stroke-width=".8" stroke-linejoin="round"/>'
    + '<g fill="#3A2A20">' + SANDIA_PEPITAS([[9, 6.6], [6.6, 10.2], [11.4, 10.2], [9, 12.6]], 9, 1.2, .6, 1) + '</g>' };
  alta('sandia',
    { m: SANDIA_M, m2: SANDIA_M2, j: SANDIA_J, mov: 'mece', mov2: 'brinca', jmov: 'mece', lluvia: 'confeti',
      dice: ['¡Fresquecita!', '¡Qué rica!', '¡Una rebanada!', '¡Ñam, ñam!'] });

  // Día de la Galleta (4 de agosto): la galleta con chispas gira; el vaso de leche brinca y su leche se mueve
  function GALLETA_CHISPAS(lista, s) {   // chispas de chocolate: [x, y, giro]
    return lista.map(function (q) {
      var c = Math.cos(q[2]), n = Math.sin(q[2]), d = '';
      [[-3, -1], [.4, -3.2], [3.2, -.2], [.4, 2.8]].forEach(function (p, i) {
        d += (i ? 'L' : 'M') + (q[0] + s * (p[0] * c - p[1] * n)).toFixed(1) + ' ' + (q[1] + s * (p[0] * n + p[1] * c)).toFixed(1);
      });
      return '<path d="' + d + 'Z"/>';
    }).join('');
  }
  var GALLETA_M = { vb: '0 0 100 100', g: '<path d="M74.63 13.53A44 44 0 1 0 90.99 33.97A16 16 0 0 1 74.63 13.53Z" fill="#E3A552" stroke="#B9782F" stroke-width="2.4" stroke-linejoin="round"/>'
    + '<path d="M18 38q8-19 30-26" stroke="#F4C77E" stroke-width="3.2" fill="none" stroke-linecap="round"/>'
    + '<g fill="#C98A3E"><circle cx="40" cy="20" r="1.2"/><circle cx="64" cy="24" r="1.2"/><circle cx="20" cy="42" r="1.2"/><circle cx="58" cy="48" r="1.2"/><circle cx="30" cy="66" r="1.2"/>'
    + '<circle cx="50" cy="88" r="1.2"/><circle cx="74" cy="74" r="1.2"/><circle cx="86" cy="54" r="1.2"/><circle cx="42" cy="42" r="1.2"/><circle cx="22" cy="76" r="1.2"/></g>'
    + '<g fill="#5A3420" stroke="#5A3420" stroke-width="2.6" stroke-linejoin="round">'
    + GALLETA_CHISPAS([[32, 30, .2], [54, 32, 1.2], [26, 54, 2], [47, 57, .6], [68, 56, 2.4], [38, 77, 1], [60, 78, -.4], [77, 40, .8], [80, 66, 1.8]], 1.4) + '</g>' };
  var GALLETA_M2 = { vb: '0 0 72 100', g: '<path d="M10 8h50l-5 84q-.3 4-4.3 4H19.3q-4 0-4.3-4z" fill="#fff" fill-opacity=".14"/>'
    + '<path d="M12.6 30H57.4L53.8 90.2Q53.6 93.5 50.3 93.5H19.7Q16.4 93.5 16.2 90.2Z" fill="#fff"/>'
    + '<path d="M50.6 36 48 87" stroke="#E1E8F2" stroke-width="5" stroke-linecap="round"/>'
    + '<g class="pt-galleta-leche"><ellipse cx="35" cy="30" rx="22.4" ry="3.6" fill="#EEF3F9"/></g>'
    + '<path d="M10 8 15 92q.3 4 4.3 4H50.7q4 0 4.3-4L60 8" fill="none" stroke="#C9D1DE" stroke-width="2.4" stroke-linejoin="round"/>'
    + '<ellipse cx="35" cy="8" rx="25" ry="3.4" fill="none" stroke="#C9D1DE" stroke-width="2.2"/>'
    + '<path d="M15 14 18.4 80" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>'
    + '<circle cx="58" cy="14" r="11" fill="#E3A552" stroke="#B9782F" stroke-width="1.8"/>'
    + '<g fill="#5A3420" stroke="#5A3420" stroke-width="1.6" stroke-linejoin="round">' + GALLETA_CHISPAS([[54, 10, .4], [62, 12, 1.6], [56, 18.4, 2.6], [63.4, 19, .9]], .8) + '</g>' };
  var GALLETA_J = { vb: '0 0 20 20', g: '<path d="M14.93 2.71A8.8 8.8 0 1 0 18.2 6.79A3.2 3.2 0 0 1 14.93 2.71Z" fill="#E3A552" stroke="#B9782F" stroke-width=".9" stroke-linejoin="round"/>'
    + '<g fill="#5A3420" stroke="#5A3420" stroke-width=".9" stroke-linejoin="round">' + GALLETA_CHISPAS([[7, 6.4, .3], [11.8, 8.8, 1.4], [5.6, 11.8, 2.2], [10, 14.4, .7], [14.4, 12.8, 2.6]], .5) + '</g>' };
  alta('galleta',
    { m: GALLETA_M, m2: GALLETA_M2, j: GALLETA_J, mov: 'gira', mov2: 'brinca', jmov: 'gira', lluvia: 'burbujas', w2: 80,
      dice: ['¡Recién horneada!', '¡Con chispas!', '¡Con lechita!', '¡A remojar!'] });
  CSS_FECHAS += '.pt-galleta-leche{transform-box:fill-box;transform-origin:50% 50%;animation:pt-galleta-leche 1.6s ease-in-out infinite alternate}'
    + '@keyframes pt-galleta-leche{from{transform:scaleY(.55)}to{transform:scaleY(1.3)}}';

  // Día del Gato (8 de agosto): gatito sentado que mueve la cola y parpadea; su bola de estambre brinca
  var GATO_NAR = '#F08A2E', GATO_RAYA = '#C8601A', GATO_CREMA = '#FFE6C7', GATO_ROSA = '#F7A8B8';
  var GATO_M = { vb: '0 0 100 100', g: '<g class="pt-gato-cola"><path d="M62 90C80 93 90 82 86 68C83 58 76 54 80 45" stroke="' + GATO_NAR + '" stroke-width="9" fill="none" stroke-linecap="round"/>'
    + '<path d="M79.5 82.5 85 88.3M76.8 57.8 84 54.4" stroke="' + GATO_RAYA + '" stroke-width="2.6" stroke-linecap="round"/></g>'
    + '<path d="M26 94C22 74 30 56 46 54C62 56 70 74 66 94Q46 98 26 94Z" fill="' + GATO_NAR + '"/>'
    + '<path d="M29 70q4-2 7 1M27 79q4-2 7 1M63 70q-4-2-7 1M65 79q-4-2-7 1" stroke="' + GATO_RAYA + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    + '<ellipse cx="46" cy="78" rx="11" ry="14" fill="' + GATO_CREMA + '"/>'
    + '<ellipse cx="39.5" cy="93.5" rx="6.2" ry="4" fill="' + GATO_CREMA + '"/><ellipse cx="52.5" cy="93.5" rx="6.2" ry="4" fill="' + GATO_CREMA + '"/>'
    + '<path d="M37.5 92.4v2.4M41.5 92.4v2.4M50.5 92.4v2.4M54.5 92.4v2.4" stroke="#E0B58A" stroke-width="1.1" stroke-linecap="round"/>'
    + '<path d="M25 28 23 7 41 18ZM67 28 69 7 51 18Z" fill="' + GATO_NAR + '" stroke="' + GATO_NAR + '" stroke-width="4" stroke-linejoin="round"/>'
    + '<path d="M27.5 22 26.6 12.6 35 18ZM64.5 22 65.4 12.6 57 18Z" fill="' + GATO_ROSA + '"/>'
    + '<ellipse cx="46" cy="36" rx="25" ry="21" fill="' + GATO_NAR + '"/>'
    + '<path d="M46 16v7M40 17.4l1.2 5M52 17.4l-1.2 5M21.6 34h5M22.4 40h4M70.4 34h-5M69.6 40h-4" stroke="' + GATO_RAYA + '" stroke-width="2.6" stroke-linecap="round"/>'
    + '<circle cx="31" cy="43" r="3.2" fill="' + GATO_ROSA + '" opacity=".8"/><circle cx="61" cy="43" r="3.2" fill="' + GATO_ROSA + '" opacity=".8"/>'
    + '<ellipse cx="41.6" cy="45" rx="6" ry="4.6" fill="' + GATO_CREMA + '"/><ellipse cx="50.4" cy="45" rx="6" ry="4.6" fill="' + GATO_CREMA + '"/>'
    + '<path d="M43.4 41h5.2L46 44z" fill="#E8708A" stroke="#E8708A" stroke-width="1" stroke-linejoin="round"/>'
    + '<path d="M46 44v1.8M46 45.8q-2 2.2-4 .4M46 45.8q2 2.2 4 .4" stroke="#8A4A2A" stroke-width="1.2" fill="none" stroke-linecap="round"/>'
    + '<g class="pt-gato-ojos"><ellipse cx="37" cy="33.5" rx="3.8" ry="4.8" fill="#2B3445"/><ellipse cx="55" cy="33.5" rx="3.8" ry="4.8" fill="#2B3445"/>'
    + '<circle cx="38.2" cy="31.6" r="1.4" fill="#fff"/><circle cx="56.2" cy="31.6" r="1.4" fill="#fff"/></g>'
    + '<path d="M35 45.5l-15-2.5M35 48l-15 2.5M57 45.5l15-2.5M57 48l15 2.5" stroke="#FFF3E6" stroke-width="1.1" stroke-linecap="round"/>'
    + '<path d="M31 56.4q15 6 30 0" stroke="#1F3864" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="46" cy="60.6" r="3.2" fill="#F2C066"/>' };
  var GATO_M2 = { vb: '0 0 100 80', g: '<g class="pt-gato-hebra"><path d="M68 64C80 72 88 60 96 74" stroke="#E86A9A" stroke-width="3" fill="none" stroke-linecap="round"/></g>'
    + '<circle cx="44" cy="42" r="34" fill="#E86A9A"/>'
    + '<g stroke="#B8406E" stroke-width="2.4" fill="none" stroke-linecap="round"><path d="M14 30Q44 50 68 20M12 46Q44 64 76 34M18 62Q46 76 74 52"/>'
    + '<path d="M31 12Q20 44 36 74M47 9Q36 44 53 74M62 15Q56 44 68 64"/></g>'
    + '<path d="M22 26q6-12 18-16" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".35"/>' };
  var GATO_J = { vb: '0 0 20 19', g: '<g class="pt-gato-cola"><path d="M13 17.8C16.6 18.4 18.6 16 17.8 13C17.3 11.2 16 10.6 16.8 8.8" stroke="' + GATO_NAR + '" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>'
    + '<path d="M4.6 18.6C4 14.6 5.6 11.2 9 10.8C12.4 11.2 14 14.6 13.4 18.6Q9 19.4 4.6 18.6Z" fill="' + GATO_NAR + '"/>'
    + '<ellipse cx="9" cy="15.6" rx="2.3" ry="2.8" fill="' + GATO_CREMA + '"/>'
    + '<path d="M4.2 6.4 3.6 1 8.2 3.8ZM13.8 6.4 14.4 1 9.8 3.8Z" fill="' + GATO_NAR + '" stroke="' + GATO_NAR + '" stroke-width="1" stroke-linejoin="round"/>'
    + '<path d="M4.8 4.9 4.6 2.6 6.6 3.8ZM13.2 4.9 13.4 2.6 11.4 3.8Z" fill="' + GATO_ROSA + '"/>'
    + '<ellipse cx="9" cy="7.4" rx="5.6" ry="4.7" fill="' + GATO_NAR + '"/><path d="M9 3v1.6" stroke="' + GATO_RAYA + '" stroke-width=".8" stroke-linecap="round"/>'
    + '<g class="pt-gato-ojos"><ellipse cx="7" cy="7.2" rx=".85" ry="1.1" fill="#2B3445"/><ellipse cx="11" cy="7.2" rx=".85" ry="1.1" fill="#2B3445"/></g>'
    + '<path d="M8.4 8.7h1.2L9 9.4z" fill="#E8708A" stroke="#E8708A" stroke-width=".3" stroke-linejoin="round"/>' };
  alta('gato',
    { m: GATO_M, m2: GATO_M2, j: GATO_J, mov: 'mece', mov2: 'brinca', jmov: 'mece', lluvia: 'estrellas',
      dice: ['¡Miau!', '¡Prrr, prrr!', '¡A jugar!', '¡Miau, miau!'] });
  CSS_FECHAS += '.pt-gato-cola{transform-box:fill-box;transform-origin:12% 90%;animation:pt-gato-cola 1.5s ease-in-out infinite alternate}'
    + '@keyframes pt-gato-cola{from{transform:rotate(-10deg)}to{transform:rotate(14deg)}}'
    + '.pt-gato-ojos{transform-box:fill-box;transform-origin:50% 50%;animation:pt-gato-ojos 3.6s ease-in-out infinite}'
    + '@keyframes pt-gato-ojos{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}'
    + '.pt-gato-hebra{transform-box:fill-box;transform-origin:0 0;animation:pt-gato-hebra 1.4s ease-in-out infinite alternate}'
    + '@keyframes pt-gato-hebra{from{transform:rotate(-6deg)}to{transform:rotate(8deg)}}';

  // Día de los Zurdos (13 de agosto): la mano izquierda (palma al frente, pulgar a la izquierda) saluda; el lápiz,
  // inclinado como lo toma un zurdo, va escribiendo su rayita
  var ZURDOS_PIEL = '#F5C6A0', ZURDOS_LINEA = '#D9946A';
  var ZURDOS_M = { vb: '0 0 90 104', g: '<g class="pt-zurdos-rayas" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round">'
    + '<path d="M74 16q8 6 8 16M81 7q12 9 11 24M14 30q-6 6-6 16"/></g>'
    + '<g stroke="' + ZURDOS_PIEL + '" stroke-linecap="round"><path d="M30 70 13 50" stroke-width="11"/><path d="M35 50 33 20M45.5 48 46 13M56 50 58 18" stroke-width="10.4"/>'
    + '<path d="M65 56 69 32" stroke-width="9.2"/></g>'
    + '<rect x="27" y="44" width="44" height="40" rx="16" fill="' + ZURDOS_PIEL + '"/>'
    + '<g stroke="' + ZURDOS_LINEA + '" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M40.4 47v-7M51 47v-7M61 50v-6"/><path d="M37 58q4 12 2 22M46 63q9-1 18-6"/></g>'
    + '<rect x="31" y="82" width="36" height="20" rx="5" fill="#F07A1E"/><rect x="31" y="82" width="36" height="6" rx="3" fill="#F4F7FB"/>' };
  var ZURDOS_M2 = { vb: '0 0 100 80', g: '<path class="pt-zurdos-trazo" d="M4 70q4.5-9 9 0t9 0 9 0 9 0 9 0 9 0 9 0 9 0" stroke="#7FB2EA" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
    + '<g transform="translate(4.7 20.1) rotate(35)"><path d="M6 -7H11V7H6A5 5 0 0 1 1 2V-2A5 5 0 0 1 6 -7Z" fill="#F29BB0"/>'
    + '<rect x="11" y="-7.4" width="8" height="14.8" fill="#C9D1DE"/><path d="M13.6 -7.4v14.8M16.4 -7.4v14.8" stroke="#9AA5B8" stroke-width="1"/>'
    + '<rect x="19" y="-7" width="50" height="14" fill="#F2C066"/><rect x="19" y="-7" width="50" height="4.6" fill="#F7D47E"/><rect x="19" y="2.4" width="50" height="4.6" fill="#E0A93E"/>'
    + '<path d="M69 -7 87 0 69 7Z" fill="#F2D3A0"/><path d="M81 -2.33 87 0 81 2.33Z" fill="#5A6478"/></g>' };
  var ZURDOS_J = { vb: '0 0 20 19', g: '<g stroke="' + ZURDOS_LINEA + '" stroke-linecap="round"><path d="M6.4 14 2.6 9.4" stroke-width="4"/>'
    + '<path d="M7.6 10 7.2 3.6M10.2 9.6 10.3 2M12.8 10 13.3 3" stroke-width="3.6"/><path d="M15 11 16 5.4" stroke-width="3.3"/></g>'
    + '<rect x="5" y="8" width="12.2" height="9.4" rx="4" fill="' + ZURDOS_LINEA + '"/>'
    + '<g stroke="' + ZURDOS_PIEL + '" stroke-linecap="round"><path d="M6.4 14 2.6 9.4" stroke-width="2.9"/>'
    + '<path d="M7.6 10 7.2 3.6M10.2 9.6 10.3 2M12.8 10 13.3 3" stroke-width="2.5"/><path d="M15 11 16 5.4" stroke-width="2.2"/></g>'
    + '<rect x="5.6" y="8.6" width="11" height="8.2" rx="3.5" fill="' + ZURDOS_PIEL + '"/>'
    + '<rect x="6.8" y="15.8" width="8.4" height="3" rx="1" fill="#F07A1E"/>' };
  alta('zurdos',
    { m: ZURDOS_M, m2: ZURDOS_M2, j: ZURDOS_J, mov: 'saluda', mov2: 'mece', jmov: 'saluda', lluvia: 'confeti', w: 92,
      dice: ['¡Hola, zurdos!', '¡Con la izquierda!', '¡A escribir!', '¡Arriba los zurdos!'] });
  CSS_FECHAS += '.pt-zurdos-rayas{animation:pt-zurdos-rayas 1.6s ease-in-out infinite}@keyframes pt-zurdos-rayas{0%,100%{opacity:.15}30%,60%{opacity:.9}}'
    + '.pt-zurdos-trazo{stroke-dasharray:110;stroke-dashoffset:0;animation:pt-zurdos-trazo 2.8s ease-in-out infinite}'
    + '@keyframes pt-zurdos-trazo{0%{stroke-dashoffset:110}70%,100%{stroke-dashoffset:0}}';

  // Día de la Fotografía (19 de agosto): la cámara destella con su flash; la foto instantánea se revela mientras se agita
  var FOTO_M = { vb: '0 0 100 82', g: '<g class="pt-foto-flash" stroke="#FFE27A" stroke-width="3" stroke-linecap="round">'
    + '<circle cx="22" cy="10" r="5" fill="#FFF6C8" stroke="none"/><path d="M22 1v-3M13 10h-4M31 10h4M15.6 3.6l-2.6-2.6M28.4 3.6l2.6-2.6"/></g>'
    + '<path d="M36 28 41 16H63L68 28Z" fill="#C9D1DE" stroke="#C9D1DE" stroke-width="3" stroke-linejoin="round"/>'
    + '<rect x="72" y="20" width="12" height="9" rx="2.5" fill="#F07A1E"/>'
    + '<rect x="6" y="26" width="88" height="52" rx="10" fill="#E6EBF2"/><rect x="6" y="40" width="88" height="24" fill="#1F3864"/>'
    + '<rect x="6" y="26" width="88" height="52" rx="10" fill="none" stroke="#C9D1DE" stroke-width="2.4"/>'
    + '<rect x="14" y="17" width="16" height="10" rx="2" fill="#fff" stroke="#9AA5B8" stroke-width="1.5"/>'
    + '<rect class="pt-foto-luz" x="15" y="18" width="14" height="8" rx="1.5" fill="#FFE27A" opacity="0"/>'
    + '<circle cx="50" cy="52" r="21" fill="#9AA5B8"/><circle cx="50" cy="52" r="16.5" fill="#1F3864"/><circle cx="50" cy="52" r="11" fill="#2E5A9C"/><circle cx="50" cy="52" r="5.6" fill="#16294F"/>'
    + '<circle cx="44" cy="46" r="3.4" fill="#fff" opacity=".85"/><circle cx="55.4" cy="57.4" r="1.6" fill="#fff" opacity=".5"/>'
    + '<circle cx="84" cy="34" r="2.6" fill="#5BD69A"/>' };
  var FOTO_M2 = { vb: '0 0 84 94', g: '<g transform="rotate(-6 42 47)"><rect x="6" y="5" width="72" height="84" rx="3" fill="#fff" stroke="#C9D1DE" stroke-width="1.6"/>'
    + '<rect x="12" y="11" width="60" height="58" fill="#7FB2EA"/><circle cx="57" cy="25" r="7" fill="#F2C066"/>'
    + '<path d="M12 69V55L24 43 32 31 38 41 44 35 54 47 62 43 72 51V69Z" fill="#3E9A5A"/><path d="M12 69V62Q30 54 46 60T72 58V69Z" fill="#5DB85A"/>'
    + '<rect class="pt-foto-revela" x="12" y="11" width="60" height="58" fill="#5A6478" opacity="0"/>'
    + '<path d="M24 80q4-4 8 0t8 0 8 0" stroke="#1F3864" stroke-width="1.8" fill="none" stroke-linecap="round"/></g>' };
  var FOTO_J = { vb: '0 0 20 16', g: '<g class="pt-foto-flash" stroke="#F7A21B" stroke-width="1" stroke-linecap="round"><path d="M4.4 1.8V.2M2 2.8 1 2M6.8 2.8 7.8 2"/></g>'
    + '<path d="M7 5.2 8.4 2.8h4.2L14 5.2Z" fill="#C9D1DE" stroke="#9AA5B8" stroke-width=".6" stroke-linejoin="round"/>'
    + '<rect x="14.4" y="3.4" width="3" height="2.2" rx=".6" fill="#F07A1E"/>'
    + '<rect x="1" y="5" width="18" height="10.6" rx="2.2" fill="#E6EBF2"/><rect x="1" y="8" width="18" height="4.8" fill="#1F3864"/>'
    + '<rect x="1" y="5" width="18" height="10.6" rx="2.2" fill="none" stroke="#9AA5B8" stroke-width=".7"/>'
    + '<rect x="2.6" y="3.4" width="3.6" height="2" rx=".5" fill="#fff" stroke="#9AA5B8" stroke-width=".5"/>'
    + '<circle cx="10" cy="10.3" r="4.3" fill="#9AA5B8"/><circle cx="10" cy="10.3" r="3.2" fill="#2E5A9C"/><circle cx="10" cy="10.3" r="1.5" fill="#16294F"/>'
    + '<circle cx="8.8" cy="9.1" r=".9" fill="#fff"/>' };
  alta('foto',
    { m: FOTO_M, m2: FOTO_M2, j: FOTO_J, mov: 'brinca', mov2: 'saluda', jmov: 'late', lluvia: 'estrellas', w2: 90,
      dice: ['¡Sonríe!', '¡Clic!', '¡Qué buena foto!', '¡Digan «queso»!'] });
  CSS_FECHAS += '.pt-foto-flash{transform-box:fill-box;transform-origin:50% 50%;animation:pt-foto-flash 2.4s ease-out infinite}'
    + '@keyframes pt-foto-flash{0%,60%{opacity:0;transform:scale(.3)}68%{opacity:1;transform:scale(1.12)}82%{opacity:.7;transform:scale(1)}100%{opacity:0;transform:scale(1.2)}}'
    + '.pt-foto-luz{animation:pt-foto-luz 2.4s ease-out infinite}@keyframes pt-foto-luz{0%,60%{opacity:0}68%{opacity:1}100%{opacity:0}}'
    + '.pt-foto-revela{animation:pt-foto-revela 4s ease-in-out infinite}@keyframes pt-foto-revela{0%,8%{opacity:.85}55%,92%{opacity:0}100%{opacity:.85}}';

  // Día del Perro (26 de agosto): perrito sentado que mueve la cola, jadea y mueve las orejas; el hueso flota
  var PERRO_CAFE = '#D99A5B', PERRO_OSCURO = '#8E5A30', PERRO_CREMA = '#FFE9CC', PERRO_NARIZ = '#3A2A20';
  var PERRO_M = { vb: '0 0 100 100', g: '<g class="pt-perro-cola"><path d="M64 86C77 84 85 74 87 60" stroke="' + PERRO_CAFE + '" stroke-width="8.5" fill="none" stroke-linecap="round"/></g>'
    + '<path d="M28 96C24 76 32 58 48 56C64 58 72 76 68 96Q48 99 28 96Z" fill="' + PERRO_CAFE + '"/>'
    + '<ellipse cx="48" cy="80" rx="10" ry="13" fill="' + PERRO_CREMA + '"/>'
    + '<ellipse cx="41" cy="95.4" rx="6.5" ry="4" fill="' + PERRO_CREMA + '"/><ellipse cx="55" cy="95.4" rx="6.5" ry="4" fill="' + PERRO_CREMA + '"/>'
    + '<path d="M39 94.4v2.4M43 94.4v2.4M53 94.4v2.4M57 94.4v2.4" stroke="#E0BE92" stroke-width="1.1" stroke-linecap="round"/>'
    + '<ellipse cx="48" cy="38" rx="22" ry="19" fill="' + PERRO_CAFE + '"/>'
    + '<g class="pt-perro-oreja"><path d="M30 23C19 22 14 38 18 51C21 58 29 55 31 46Z" fill="' + PERRO_OSCURO + '"/></g>'
    + '<g class="pt-perro-oreja pt-perro-oreja2"><path d="M66 23C77 22 82 38 78 51C75 58 67 55 65 46Z" fill="' + PERRO_OSCURO + '"/></g>'
    + '<ellipse cx="40" cy="34" rx="6.4" ry="5.8" fill="#B8763E"/>'
    + '<circle cx="40" cy="35" r="3.4" fill="' + PERRO_NARIZ + '"/><circle cx="56" cy="35" r="3.4" fill="' + PERRO_NARIZ + '"/>'
    + '<circle cx="41.2" cy="33.8" r="1.2" fill="#fff"/><circle cx="57.2" cy="33.8" r="1.2" fill="#fff"/>'
    + '<ellipse cx="48" cy="47" rx="11.5" ry="8.4" fill="' + PERRO_CREMA + '"/>'
    + '<g class="pt-perro-lengua"><path d="M44.6 50.6q3.4 10 6.8 0z" fill="#F2708A"/><path d="M48 51v5" stroke="#D95A75" stroke-width="1" stroke-linecap="round"/></g>'
    + '<path d="M42.4 42q5.6-2.6 11.2 0q-1 4.6-5.6 5.6q-4.6-1-5.6-5.6z" fill="' + PERRO_NARIZ + '"/><ellipse cx="46.4" cy="42.6" rx="1.6" ry=".8" fill="#fff" opacity=".5"/>'
    + '<path d="M48 47.6v2.2M48 49.8q-3 3-6.4.6M48 49.8q3 3 6.4.6" stroke="' + PERRO_NARIZ + '" stroke-width="1.4" fill="none" stroke-linecap="round"/>'
    + '<path d="M32 58.4q16 7 32 0" stroke="#1F3864" stroke-width="4.4" fill="none" stroke-linecap="round"/><circle cx="48" cy="63.4" r="3.6" fill="#F2C066"/>' };
  var PERRO_M2 = { vb: '0 0 100 56', g: '<g transform="rotate(-12 50 28)"><g fill="#C9D1DE"><circle cx="16" cy="18" r="11.6"/><circle cx="16" cy="38" r="11.6"/><circle cx="84" cy="18" r="11.6"/><circle cx="84" cy="38" r="11.6"/><rect x="16" y="16.4" width="68" height="23.2"/></g>'
    + '<g fill="#FFF8EC"><circle cx="16" cy="18" r="10"/><circle cx="16" cy="38" r="10"/><circle cx="84" cy="18" r="10"/><circle cx="84" cy="38" r="10"/><rect x="16" y="18" width="68" height="20"/></g>'
    + '<path d="M22 34h56" stroke="#EADFCB" stroke-width="3" stroke-linecap="round"/></g>' + SANDIA_BRILLA(88, 6, 5) + SANDIA_BRILLA(10, 50, 3.6, 1) };
  var PERRO_J = { vb: '0 0 20 19', g: '<g class="pt-perro-cola"><path d="M13.4 16.8C16.2 16.2 17.8 13.8 18.2 11" stroke="' + PERRO_CAFE + '" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>'
    + '<path d="M5 18.6C4.3 14.6 6 11.4 9.4 11C12.8 11.4 14.5 14.6 13.8 18.6Q9.4 19.4 5 18.6Z" fill="' + PERRO_CAFE + '"/>'
    + '<ellipse cx="9.4" cy="15.6" rx="2.2" ry="2.8" fill="' + PERRO_CREMA + '"/>'
    + '<ellipse cx="9.4" cy="7.4" rx="5.2" ry="4.6" fill="' + PERRO_CAFE + '"/>'
    + '<path d="M5.4 4C2.8 4 1.8 8 2.6 10.6C3.4 12 5 11 5.6 9.2ZM13.4 4C16 4 17 8 16.2 10.6C15.4 12 13.8 11 13.2 9.2Z" fill="' + PERRO_OSCURO + '"/>'
    + '<ellipse cx="9.4" cy="9.6" rx="2.9" ry="2.1" fill="' + PERRO_CREMA + '"/><ellipse cx="9.4" cy="8.7" rx="1.2" ry=".85" fill="' + PERRO_NARIZ + '"/>'
    + '<circle cx="7.5" cy="6.6" r=".8" fill="' + PERRO_NARIZ + '"/><circle cx="11.3" cy="6.6" r=".8" fill="' + PERRO_NARIZ + '"/>'
    + '<path d="M5.8 11.8q3.6 1.6 7.2 0" stroke="#2F5597" stroke-width="1" fill="none" stroke-linecap="round"/>' };
  alta('perro',
    { m: PERRO_M, m2: PERRO_M2, j: PERRO_J, mov: 'brinca', mov2: 'flota', jmov: 'brinca', lluvia: 'confeti',
      dice: ['¡Guau!', '¡Guau, guau!', '¡Un huesito!', '¡Mi favorito!'] });
  CSS_FECHAS += '.pt-perro-cola{transform-box:fill-box;transform-origin:10% 92%;animation:pt-perro-cola .36s ease-in-out infinite alternate}'
    + '@keyframes pt-perro-cola{from{transform:rotate(-16deg)}to{transform:rotate(16deg)}}'
    + '.pt-perro-oreja{transform-box:fill-box;transform-origin:50% 8%;animation:pt-perro-oreja 1.3s ease-in-out infinite alternate}.pt-perro-oreja2{animation-direction:alternate-reverse}'
    + '@keyframes pt-perro-oreja{from{transform:rotate(-6deg)}to{transform:rotate(6deg)}}'
    + '.pt-perro-lengua{transform-box:fill-box;transform-origin:50% 0;animation:pt-perro-lengua .5s ease-in-out infinite alternate}'
    + '@keyframes pt-perro-lengua{from{transform:scaleY(.8)}to{transform:scaleY(1.12)}}';

  // Día de los Abuelos (28 de agosto): la mecedora se mece; los lentes y la bola de tejido flotan y los lentes brillan
  var ABUELOS_MADERA = '#D9995A', ABUELOS_OSCURA = '#A9692F';
  var ABUELOS_M = { vb: '0 0 100 100', g: '<path d="M6 80A90 90 0 0 0 94 80" stroke="' + ABUELOS_OSCURA + '" stroke-width="6" fill="none" stroke-linecap="round"/>'
    + '<path d="M26 89 29 58M72 89 70 58" stroke="' + ABUELOS_OSCURA + '" stroke-width="5" stroke-linecap="round"/>'
    + '<path d="M36 57 22 8" stroke="' + ABUELOS_OSCURA + '" stroke-width="5" stroke-linecap="round"/>'
    + '<path d="M20 58 9 12M9 12Q20 4 31 10" stroke="' + ABUELOS_MADERA + '" stroke-width="6" fill="none" stroke-linecap="round"/>'
    + '<path d="M17 20l10 36M22 15l11 38" stroke="' + ABUELOS_MADERA + '" stroke-width="3.4" stroke-linecap="round"/>'
    + '<path d="M18 52q16-4 22 2l1 4H20z" fill="#7FB2EA"/>'
    + '<path d="M20 54H80Q83 54 83 57V59Q83 62 80 62H20Q17 62 17 59V57Q17 54 20 54Z" fill="' + ABUELOS_MADERA + '"/>'
    + '<path d="M28 54Q30 46 38 46H70Q78 46 78 54Z" fill="#F07A1E"/><path d="M34 50h38" stroke="#F7A25E" stroke-width="2" stroke-linecap="round"/>'
    + '<path d="M15 34 74 31M72 32 70 56" stroke="' + ABUELOS_MADERA + '" stroke-width="4.6" fill="none" stroke-linecap="round"/>'
    + '<path d="M8 13Q20 6 32 12L35 30Q22 32 12 28Z" fill="#7FB2EA"/><path d="M10 19q12-4 23-1M11.6 25q11-3 22.6-.6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>'
    + '<g fill="#E8418C"><circle cx="16" cy="16.4" r="1.4"/><circle cx="24" cy="15" r="1.4"/><circle cx="31" cy="17" r="1.4"/></g>' };
  var ABUELOS_M2 = { vb: '0 0 100 82', g: '<path d="M30 6 60 52M72 6 42 50" stroke="#C9D1DE" stroke-width="3" stroke-linecap="round"/><circle cx="30" cy="6" r="3.8" fill="#F07A1E"/><circle cx="72" cy="6" r="3.8" fill="#F07A1E"/>'
    + '<path d="M70 50c10 8 20 2 26 12" stroke="#9B6FD0" stroke-width="2.8" fill="none" stroke-linecap="round"/>'
    + '<circle cx="50" cy="40" r="26" fill="#9B6FD0"/>'
    + '<g stroke="#7048A8" stroke-width="2.2" fill="none" stroke-linecap="round"><path d="M27 30Q50 44 70 22M25 44Q50 58 75 36M31 58Q52 68 72 52M38 17Q30 40 42 64M54 15Q46 40 60 64"/></g>'
    + '<path d="M33 26q5-9 15-12" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".35"/>'
    + '<path d="M22 60 10 53M74 60 86 53" stroke="#F2C066" stroke-width="3" stroke-linecap="round"/>'
    + '<circle cx="34" cy="64" r="12" fill="#DCEBFA" fill-opacity=".85" stroke="#F2C066" stroke-width="3.4"/><circle cx="62" cy="64" r="12" fill="#DCEBFA" fill-opacity=".85" stroke="#F2C066" stroke-width="3.4"/>'
    + '<path d="M46 62Q48 57.6 50 62" stroke="#F2C066" stroke-width="3" fill="none" stroke-linecap="round"/>'
    + '<g class="pt-abuelos-brillo" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".7"><path d="M28 62l5-5M56 62l5-5"/></g>' };
  var ABUELOS_J = { vb: '0 0 20 19', g: '<path d="M1.4 15.6A18 18 0 0 0 18.6 15.6" stroke="' + ABUELOS_OSCURA + '" stroke-width="1.9" fill="none" stroke-linecap="round"/>'
    + '<path d="M5.6 17.4 6.2 11.6M14.4 17.4 14 11.6" stroke="' + ABUELOS_OSCURA + '" stroke-width="1.6" stroke-linecap="round"/>'
    + '<path d="M5 11.4 2.4 1.8M2.2 2Q4.4.8 6.6 2.2M6.8 11 4.8 2.4" stroke="' + ABUELOS_MADERA + '" stroke-width="1.9" fill="none" stroke-linecap="round"/>'
    + '<path d="M3.6 6.8 15 6.4M14.6 6.6V11" stroke="' + ABUELOS_MADERA + '" stroke-width="1.3" fill="none" stroke-linecap="round"/>'
    + '<rect x="3.8" y="10.2" width="12.6" height="2.2" rx="1.1" fill="' + ABUELOS_MADERA + '"/>'
    + '<path d="M5.6 10.2Q6 8.6 7.6 8.6H13.6Q15.2 8.6 15.4 10.2Z" fill="#F07A1E"/>' };
  alta('abuelos',
    { m: ABUELOS_M, m2: ABUELOS_M2, j: ABUELOS_J, mov: 'mece', mov2: 'flota', jmov: 'mece', lluvia: 'corazones',
      dice: ['¡Gracias, abuelos!', '¡Los queremos!', '¡Con mucho cariño!', '¡Un abrazote!'] });
  CSS_FECHAS += '.pt-abuelos-brillo{animation:pt-abuelos-brillo 2.6s ease-in-out infinite}@keyframes pt-abuelos-brillo{0%,55%,100%{opacity:0}72%{opacity:.95}}';

  // Día Internacional de la Paz (21 de septiembre): la paloma con su ramita de olivo vuela y aletea; el arcoíris flota
  var PAZ_BLANCO = '#FFFFFF', PAZ_ORILLA = '#C9D1DE';
  var PAZ_M = { vb: '0 0 100 74', g: '<path d="M26 40C16 34 8 30 2 32C4 38 4 44 2 50C8 52 16 50 26 46Z" fill="' + PAZ_BLANCO + '" stroke="' + PAZ_ORILLA + '" stroke-width="1.6" stroke-linejoin="round"/>'
    + '<path d="M6 37l14 5M6 45l14-1" stroke="' + PAZ_ORILLA + '" stroke-width="1.2" stroke-linecap="round"/>'
    + '<path d="M20 44C26 30 48 28 62 32C70 22 84 22 88 32C90 38 86 42 80 44C72 56 46 60 28 52C24 50 20 48 20 44Z" fill="' + PAZ_BLANCO + '" stroke="' + PAZ_ORILLA + '" stroke-width="1.6"/>'
    + '<path d="M88 30.6 96 33.6 88 36.4Z" fill="#F07A1E" stroke="#F07A1E" stroke-width="1" stroke-linejoin="round"/>'
    + '<path d="M90 36C93 43 92 50 87 57" stroke="#3E7A2E" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
    + '<g fill="#5DB85A"><ellipse cx="94.6" cy="43" rx="2" ry="4.6" transform="rotate(-30 94.6 43)"/><ellipse cx="87.6" cy="46" rx="2" ry="4.6" transform="rotate(40 87.6 46)"/>'
    + '<ellipse cx="93.4" cy="52.6" rx="2" ry="4.4" transform="rotate(-50 93.4 52.6)"/><ellipse cx="84.6" cy="56" rx="2" ry="4.2" transform="rotate(60 84.6 56)"/></g>'
    + '<circle cx="90.6" cy="48.8" r="1.8" fill="#8BAA3A"/>'
    + '<circle cx="81.6" cy="30.4" r="2" fill="#1F3864"/>'
    + '<g class="pt-paz-ala"><path d="M46 38C44 22 52 8 66 4C64 12 66 16 62 22C68 20 72 22 70 28C64 32 56 36 50 40Z" fill="' + PAZ_BLANCO + '" stroke="' + PAZ_ORILLA + '" stroke-width="1.6" stroke-linejoin="round"/>'
    + '<path d="M52 33 61 20M56 35 66 26" stroke="' + PAZ_ORILLA + '" stroke-width="1.2" stroke-linecap="round"/></g>' };
  function PAZ_ARCO(r, c) { return '<path d="M' + (50 - r) + ' 58A' + r + ' ' + r + ' 0 0 1 ' + (50 + r) + ' 58" stroke="' + c + '" stroke-width="6.8" fill="none"/>'; }
  function PAZ_NUBE(x) {
    return '<g fill="' + PAZ_BLANCO + '" stroke="' + PAZ_ORILLA + '" stroke-width="1.4"><circle cx="' + (x - 7) + '" cy="58" r="7"/><circle cx="' + (x + 7) + '" cy="58" r="7"/><circle cx="' + x + '" cy="52" r="8.4"/></g>'
      + '<g fill="' + PAZ_BLANCO + '"><circle cx="' + (x - 7) + '" cy="58" r="6.3"/><circle cx="' + (x + 7) + '" cy="58" r="6.3"/><circle cx="' + x + '" cy="52" r="7.7"/><rect x="' + (x - 7) + '" y="56" width="14" height="8.3"/></g>';
  }
  var PAZ_M2 = { vb: '0 0 100 68', g: PAZ_ARCO(42, '#E8574A') + PAZ_ARCO(35.5, '#F07A1E') + PAZ_ARCO(29, '#F2C066') + PAZ_ARCO(22.5, '#5BD69A') + PAZ_ARCO(16, '#4FA3E0')
    + PAZ_NUBE(11) + PAZ_NUBE(89) + SANDIA_BRILLA(50, 6, 4.6) + SANDIA_BRILLA(18, 18, 3.4, 1) + SANDIA_BRILLA(84, 16, 3.4, 1) };
  var PAZ_J = { vb: '0 0 21 15', g: '<path d="M5.6 9.6 1.2 7.6Q.6 9.8 1.2 11.8Z" fill="' + PAZ_BLANCO + '" stroke="' + PAZ_ORILLA + '" stroke-width="1" stroke-linejoin="round"/>'
    + '<path d="M4.6 10C6 6.6 11 6 14 7C15 4.6 18 4.8 18.6 7C19 8.4 18 9.4 16.6 9.8C14.6 12.6 9 13 6 11.6C5 11.2 4.6 10.6 4.6 10Z" fill="' + PAZ_BLANCO + '" stroke="' + PAZ_ORILLA + '" stroke-width="1"/>'
    + '<path d="M18.7 6.4 20.8 7.3 18.7 8.1Z" fill="#F07A1E" stroke="#F07A1E" stroke-width=".4" stroke-linejoin="round"/><circle cx="17.1" cy="6.6" r=".6" fill="#1F3864"/>'
    + '<path d="M19.2 8.2C19.8 10 19.4 11.8 18.2 13.4" stroke="#3E7A2E" stroke-width=".7" fill="none" stroke-linecap="round"/>'
    + '<g fill="#5DB85A"><ellipse cx="20.2" cy="10.4" rx=".75" ry="1.6" transform="rotate(-30 20.2 10.4)"/><ellipse cx="17.8" cy="11.6" rx=".75" ry="1.5" transform="rotate(45 17.8 11.6)"/></g>'
    + '<g class="pt-paz-ala"><path d="M9.6 8.4C9 4.6 11 1.6 14.2.8C13.8 3 14.2 3.8 13.2 5.2C14.6 5 15.2 5.6 14.6 6.8C13 7.8 11.4 8.4 10 9.2Z" fill="#E6EDF7" stroke="' + PAZ_ORILLA + '" stroke-width="1" stroke-linejoin="round"/></g>' };
  alta('paz',
    { m: PAZ_M, m2: PAZ_M2, j: PAZ_J, mov: 'vuela', mov2: 'flota', jmov: 'vuela', lluvia: 'petalos',
      dice: ['¡Paz para todos!', '¡Vivamos en paz!', '¡Con respeto!', '¡Paz y armonía!'] });
  CSS_FECHAS += '.pt-paz-ala{transform-box:fill-box;transform-origin:14% 94%;animation:pt-paz-ala .7s ease-in-out infinite alternate}'
    + '@keyframes pt-paz-ala{from{transform:rotate(-12deg)}to{transform:rotate(34deg) scaleY(.75)}}';

  // Día Mundial del Turismo (27 de septiembre): el avioncito da la vuelta con su estela; la maleta con calcomanías brinca
  function TURISMO_AVION() {   // avioncito de lado, con la nariz a la derecha (fuselaje de 0 a 50 en x)
    return '<path d="M4 -2 0 -13H7L14 -3Z" fill="#F07A1E" stroke="#F07A1E" stroke-width="1.6" stroke-linejoin="round"/>'
      + '<path d="M2 0C2 -4 7 -6 13 -6H38C44 -6 48 -3 50 0C48 3 44 5 38 5H12C6 5 2 3 2 0Z" fill="#fff" stroke="#C9D1DE" stroke-width="1.6"/>'
      + '<path d="M6 2.6H44" stroke="#F07A1E" stroke-width="2" stroke-linecap="round"/>'
      + '<g fill="#4FA3E0"><circle cx="18" cy="-1.6" r="1.8"/><circle cx="24" cy="-1.6" r="1.8"/><circle cx="30" cy="-1.6" r="1.8"/><path d="M40 -4.6Q45 -4 47 -1.4H40Z"/></g>'
      + '<path d="M21 1 15 13H21L31 1Z" fill="#F07A1E" stroke="#F07A1E" stroke-width="1.6" stroke-linejoin="round"/>'
      + '<rect x="50" y="-1.6" width="2.4" height="3.2" rx="1" fill="#9AA5B8"/>'
      + '<g class="pt-turismo-helice"><ellipse cx="53.4" cy="0" rx="1.4" ry="8" fill="#C9D1DE"/></g>';
  }
  var TURISMO_M = { vb: '0 0 100 100', g: '<path d="M21.4 66.5A33 33 0 0 1 25.5 27.9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="1 6" opacity=".6"/>'
    + '<g transform="translate(18 17) scale(1.2)">' + TURISMO_AVION() + '</g>' };
  var TURISMO_C1 = { vb: '-1 -16 57 31', g: TURISMO_AVION() };
  function TURISMO_ESTAMPA(x, y, r) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#fff"/>'; }
  var TURISMO_M2 = { vb: '0 0 90 90', g: '<path d="M34 20V12Q34 8 38 8H52Q56 8 56 12V20" stroke="#9AA5B8" stroke-width="4.4" fill="none"/>'
    + '<circle cx="20" cy="82" r="5.4" fill="#5A6478"/><circle cx="70" cy="82" r="5.4" fill="#5A6478"/><circle cx="20" cy="82" r="2" fill="#C9D1DE"/><circle cx="70" cy="82" r="2" fill="#C9D1DE"/>'
    + '<rect x="8" y="18" width="74" height="60" rx="9" fill="#F07A1E"/>'
    + '<path d="M28 18v60M62 18v60" stroke="#C9601A" stroke-width="5"/>'
    + TURISMO_ESTAMPA(22, 34, 9.6) + '<circle cx="22" cy="34" r="4.4" fill="#F2C066"/>'
    + '<path d="M22 26.6v2.2M22 39.2v2.2M14.6 34h2.2M27.2 34h2.2M16.8 28.8l1.5 1.5M25.7 37.7l1.5 1.5M16.8 39.2l1.5-1.5M25.7 30.3l1.5-1.5" stroke="#F2C066" stroke-width="1.6" stroke-linecap="round"/>'
    + '<g transform="rotate(10 50 34)"><rect x="38" y="26" width="24" height="16" rx="2.4" fill="#fff"/><rect x="40.4" y="28.4" width="19.2" height="11.2" rx="1.2" fill="#7FB2EA"/>'
    + '<path d="M40.4 36.4q4.8-3 9.6 0t9.6 0V39.6H40.4Z" fill="#2E5A9C"/><circle cx="55" cy="31.6" r="2" fill="#F2C066"/></g>'
    + '<path d="M68 52 70.6 57.6 76.6 58.2 72 62.2 73.4 68.2 68 65.1 62.6 68.2 64 62.2 59.4 58.2 65.4 57.6Z" fill="#fff" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/>'
    + '<path d="M68 52 70.6 57.6 76.6 58.2 72 62.2 73.4 68.2 68 65.1 62.6 68.2 64 62.2 59.4 58.2 65.4 57.6Z" fill="#5BD69A"/>'
    + '<g transform="rotate(-12 26 62)"><rect x="14" y="54" width="24" height="16" rx="8" fill="#fff"/><path d="M26 66.4S20 62.8 20 59.6A2.6 2.6 0 0 1 26 58.4A2.6 2.6 0 0 1 32 59.6C32 62.8 26 66.4 26 66.4Z" fill="#E8418C"/></g>'
    + '<path d="M60 8q6 0 6 6v6" stroke="#F2C066" stroke-width="1.4" fill="none"/><rect x="61" y="19" width="10" height="13" rx="2" fill="#F2C066" transform="rotate(8 66 25)"/>' };
  var TURISMO_J = { vb: '0 0 21 14', g: '<g class="pt-turismo-estela" stroke="#9AA5B8" stroke-width=".9" stroke-linecap="round"><path d="M-2.4 6.2h2.6M-1.6 8.6h2"/></g>'
    + '<path d="M3.2 6.4 1.6 1.6H4.6L7.2 5.6Z" fill="#F07A1E" stroke="#F07A1E" stroke-width=".6" stroke-linejoin="round"/>'
    + '<path d="M2.6 7.2C2.6 5.8 4 5.2 6 5.2H14.6C17 5.2 18.8 6.2 19.4 7.4C18.8 8.6 17 9.4 14.6 9.4H5.4C3.6 9.4 2.6 8.6 2.6 7.2Z" fill="#F4F7FB" stroke="#C9D1DE" stroke-width=".9"/>'
    + '<g fill="#2E5A9C"><circle cx="9.4" cy="6.8" r=".6"/><circle cx="11.4" cy="6.8" r=".6"/><circle cx="13.4" cy="6.8" r=".6"/><path d="M15.6 5.9Q17.6 6 18.4 7H15.6Z"/></g>'
    + '<path d="M9.4 8.2 7.2 12.8H9.4L13 8.2Z" fill="#F07A1E" stroke="#F07A1E" stroke-width=".6" stroke-linejoin="round"/>' };
  alta('turismo',
    { m: TURISMO_M, m2: TURISMO_M2, j: TURISMO_J, c1: TURISMO_C1, mov: 'gira', mov2: 'brinca', jmov: 'vuela', lluvia: 'confeti', w2: 96,
      dice: ['¡A viajar!', '¡Buen viaje!', '¡Lista la maleta!', '¡A conocer México!'] });
  CSS_FECHAS += '.pt-turismo-helice{transform-box:fill-box;transform-origin:50% 50%;animation:pt-turismo-helice .2s linear infinite alternate}'
    + '@keyframes pt-turismo-helice{from{transform:scaleY(1)}to{transform:scaleY(.15)}}'
    + '.pt-turismo-estela{animation:pt-turismo-estela 1s linear infinite}@keyframes pt-turismo-estela{from{opacity:.9;transform:translateX(0)}to{opacity:0;transform:translateX(-2px)}}';

  // Día Nacional del Maíz (29 de septiembre): el elote brilla; las tortillas, calientitas en su canasta, echan vapor
  var MAIZ_HOJA = '#5DB85A', MAIZ_HOJA2 = '#3E8E3A';
  function MAIZ_GRANOS(cx, top, bot, hw, s) {   // granos del elote en filas
    var h = '', y, x, a, mid = (top + bot) / 2, half = (bot - top) / 2;
    for (y = top + s * .8; y <= bot - s * .6; y += s * 1.1) {
      a = hw * Math.sqrt(Math.max(0, 1 - Math.pow((y - mid) / half, 2)));
      for (x = cx - Math.floor(a / s - .45) * s; x <= cx + a - s * .45; x += s) {
        h += '<rect x="' + (x - s * .44).toFixed(1) + '" y="' + (y - s * .5).toFixed(1) + '" width="' + (s * .88).toFixed(1) + '" height="' + s.toFixed(1) + '" rx="' + (s * .4).toFixed(1) + '"/>';
      }
    }
    return h;
  }
  function MAIZ_RAYOS() {   // rayitos de luz alrededor del elote
    var h = '', a, c, n;
    [-165, -135, -110, -70, -45, -15].forEach(function (g) {
      a = g * Math.PI / 180; c = Math.cos(a); n = Math.sin(a);
      h += 'M' + (40 + 27 * c).toFixed(1) + ' ' + (44 + 42 * n).toFixed(1) + 'L' + (40 + 35 * c).toFixed(1) + ' ' + (44 + 52 * n).toFixed(1);
    });
    return '<g class="pt-maiz-halo"><path d="' + h + '" stroke="#FFE27A" stroke-width="3" stroke-linecap="round"/></g>';
  }
  var MAIZ_M = { vb: '0 -10 80 122', g: MAIZ_RAYOS()
    + SANDIA_BRILLA(10, 16, 5) + SANDIA_BRILLA(72, 22, 4, 1) + SANDIA_BRILLA(70, 70, 3.4)
    + '<path d="M38 104C18 92 12 66 16 40C24 56 30 74 40 92Z" fill="' + MAIZ_HOJA2 + '"/><path d="M42 104C62 92 68 66 64 40C56 56 50 74 40 92Z" fill="' + MAIZ_HOJA + '"/>'
    + '<path d="M40 6C52 6 58 20 58 44C58 66 52 86 40 90C28 86 22 66 22 44C22 20 28 6 40 6Z" fill="#E5A92E"/>'
    + '<g fill="#FFD84D">' + MAIZ_GRANOS(40, 7, 90, 17, 6) + '</g>'
    + '<path d="M40 6q-3-5 1-9M40 6q4-4 2-9" stroke="#F2D9A0" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
    + '<path d="M40 110C22 102 17 82 21 62C27 76 34 88 44 98Z" fill="' + MAIZ_HOJA + '"/><path d="M40 110C58 102 63 82 59 62C53 76 46 88 36 98Z" fill="' + MAIZ_HOJA2 + '"/>'
    + '<path d="M28 70q4 16 12 28M52 70q-4 16-12 28" stroke="#8BD06A" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".7"/>' };
  var MAIZ_M2 = { vb: '0 0 110 82', g: '<g class="pt-maiz-vapor" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"><path d="M40 22q-4-5 0-10t0-10"/></g>'
    + '<g class="pt-maiz-vapor pt-maiz-v2" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"><path d="M56 20q-4-5 0-10t0-10"/></g>'
    + '<g class="pt-maiz-vapor pt-maiz-v3" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".7"><path d="M72 22q-4-5 0-10t0-10"/></g>'
    + '<path d="M16 34Q26 18 55 20Q84 18 94 34Z" fill="#fff"/><path d="M22 28h66" stroke="#E8418C" stroke-width="1.6" stroke-dasharray="3 3"/>'
    + '<path d="M14 36A41 10 0 0 1 96 36" stroke="#A9692F" stroke-width="4" fill="none"/>'
    + '<ellipse cx="55" cy="38" rx="36" ry="8.4" fill="#E9C77A"/><ellipse cx="55" cy="35.6" rx="36" ry="8.4" fill="#F5DFA0"/>'
    + '<g fill="#D9B060"><ellipse cx="40" cy="34" rx="3" ry="1.4"/><ellipse cx="62" cy="37" rx="3.6" ry="1.5"/><ellipse cx="70" cy="33" rx="2.4" ry="1.1"/><ellipse cx="50" cy="38.6" rx="2" ry="1"/><ellipse cx="30" cy="37" rx="2" ry="1"/></g>'
    + '<path d="M14 36A41 10 0 0 0 96 36Q94 76 55 78Q16 76 14 36Z" fill="#D9995A"/>'
    + '<g stroke="#A9692F" stroke-width="4" fill="none" stroke-dasharray="6 4"><path d="M17 50Q55 68 93 50"/><path d="M22 62Q55 78 88 62" stroke-dashoffset="5"/></g>'
    + '<path d="M14 36A41 10 0 0 0 96 36" stroke="#A9692F" stroke-width="4" fill="none"/>'
    + '<path d="M70 44Q84 46 95 38L90 66Q85 58 79 64Q76 54 70 44Z" fill="#fff" stroke="#E6ECF6" stroke-width="1" stroke-linejoin="round"/>'
    + '<g fill="#E8418C"><circle cx="84" cy="50" r="2"/><circle cx="80" cy="56" r="1.6"/></g><circle cx="88" cy="56" r="1.6" fill="#F07A1E"/>'
    + '<path d="M86 52l2 2M78 52l1.6 2" stroke="#5DB85A" stroke-width="1.2" stroke-linecap="round"/>' };
  var MAIZ_J = { vb: '0 0 18 19', g: SANDIA_BRILLA(16, 2.6, 2.2, 0, '#F7A21B')
    + '<path d="M8.6 18.6C4.6 16.6 3 12 3.6 7.4C5.4 10.6 6.8 13.6 9 16Z" fill="' + MAIZ_HOJA2 + '"/><path d="M9.4 18.6C13.4 16.6 15 12 14.4 7.4C12.6 10.6 11.2 13.6 9 16Z" fill="' + MAIZ_HOJA + '"/>'
    + '<path d="M9 1C11.8 1 13 4 13 8C13 12 11.8 15.4 9 16.2C6.2 15.4 5 12 5 8C5 4 6.2 1 9 1Z" fill="#E5A92E" stroke="#C98A1E" stroke-width=".5"/>'
    + '<g fill="#FFD84D">' + MAIZ_GRANOS(9, 1.2, 16, 3.6, 1.7) + '</g>'
    + '<path d="M9 18.8C5.4 17.6 4.4 14.4 5 11.6C6.2 13.6 7.6 15 9.6 16.4Z" fill="' + MAIZ_HOJA + '"/><path d="M9 18.8C12.6 17.6 13.6 14.4 13 11.6C11.8 13.6 10.4 15 8.4 16.4Z" fill="' + MAIZ_HOJA2 + '"/>' };
  alta('maiz',
    { m: MAIZ_M, m2: MAIZ_M2, j: MAIZ_J, mov: 'mece', mov2: 'brinca', jmov: 'mece', lluvia: 'estrellas', w: 84, w2: 112,
      dice: ['¡Elotes, elotes!', '¡Maíz de mi tierra!', '¡Tortillas calientes!', '¡Hechas a mano!'] });
  CSS_FECHAS += '.pt-maiz-halo{transform-box:fill-box;transform-origin:50% 50%;animation:pt-maiz-halo 1.8s ease-in-out infinite alternate}'
    + '@keyframes pt-maiz-halo{from{opacity:.35;transform:scale(.94)}to{opacity:1;transform:scale(1.06)}}'
    + '.pt-maiz-vapor{transform-box:fill-box;transform-origin:50% 100%;animation:pt-maiz-vapor 2.4s ease-in-out infinite}.pt-maiz-v2{animation-delay:-.8s}.pt-maiz-v3{animation-delay:-1.6s}'
    + '@keyframes pt-maiz-vapor{0%{opacity:0;transform:translateY(25%)}40%{opacity:.8}100%{opacity:0;transform:translateY(-30%)}}';
  return CSS_FECHAS;
});
