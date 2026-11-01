/* Portal PROFASE · adornos de temporada (regla de Daniel, 29-oct-2026; escenas animadas: propuesta de Gabriel, 29-oct-2026).
   El signo PROFASE es siempre el logo oficial, con sus colores: nunca se redibuja, ni se tapa, ni se pinta de otro color.
   Daniel: «la idea es que siempre sea el logo de siempre; pero sí se puede poner una arañita cayendo porque es
   Halloween, un Santa Claus porque es Navidad… pero el logo con el azul y tonos y colores, nunca».
   Cada fecha lleva tres cosas (Daniel, 31-oct-2026, 20:56: «Todas es login animado y adentro… animado y 2 inmovibles»):
   - En la entrada (index.html), la escena completa alrededor del signo, sin taparlo, y es interactiva: al picar un
     adorno brinca, gira o suena y dice algo («¡Buuu!», «¡Jo, jo, jo!», «¡Viva México!»), con la felicitación y el día abajo.
   - Ya dentro (las tres vistas, js/menu.js), junto al signo de todos los menús (el encabezado de las tres vistas, en
     computadora y celular, y el menú ☰ del celular), el adorno animado de la fecha, a un lado y sin taparlo (la arañita
     cuelga de su hilo y baja y sube; el Santa se ríe; la banderita ondea; la veladora titila…). Al picarlo sale un
     globito con la felicitación y el día («¡Feliz Día de Muertos!» · «1 y 2 de noviembre»; Daniel, 31-oct-2026, 20:48 y
     20:56: «que le piquen a la animación para que les digas qué fecha es»; «da un mensajito ¡feliz día del…!»). El signo
     y «PROFASE · Asesoría…» siguen llevando al Inicio (js/portal.js); el adorno ya no.
   - Dos adornos chicos arriba a la derecha, junto a la campanita (propuesta #9); quietos, solo brincan si se pican.
     Solo en iPad, laptop y pantallas más grandes, y solo si caben: el encabezado va siempre en un solo renglón y lo
     animado gana a lo estático (Daniel, 31-oct-2026, 17:22 a 17:32: «prefiero ver la animación a lado de profase que esos
     2 estáticos»; «dale siempre preferencia a lo animado que a lo estático»; «y siempre en una línea en cualquier
     pantalla»). En el celular no salen; en lo demás, js/menu.js los quita si no caben.
   En celular, iPad y computadora por igual, en cualquier navegador: cada dibujo lleva tamaño fijo (fija()). En el iPhone
   la arañita no se pintaba dentro de un recuadro con «overflow:hidden» que se mueve con «transform»: su hilo es su propia
   raya que crece y se encoge y la arañita se mueve con «bottom», sin recortes.
   Calendario (TEMPORADAS): el día cuenta como en Monterrey. Si dos fechas caen el mismo día, gana la más corta (un día
   suelto gana a una temporada larga). Una fecha de un solo día que cae en sábado o domingo sale desde el viernes, si ese
   día no es de otra fecha (Daniel, 31-oct-2026, 20:51: «si no se entrelapa con alguna otra sí; ponla desde el viernes»).
   Agregar o quitar fechas solo lo decide Daniel: si lo piden Fernando Cadengo o Gabo, alto y petición a Daniel (Daniel,
   31-oct-2026, 21:02: «Tanto si quieren agregar como si quieren quitar; les pones un alto»; CLAUDE.md).
   Con «reducir movimiento» del dispositivo, todo se queda quieto.
   ?temporada=<clave> en la dirección deja ver una fecha para revisarla (halloween, muertos, navidad…), y ?fecha=AAAA-MM-DD
   deja ver qué fecha saldría ese día. */
(function () {
  'use strict';
  // n: la felicitación al picar la animación; f: el día que se festeja (sale abajo de la felicitación)
  var TEMPORADAS = [
    { k: 'amor', de: [2, 7], a: [2, 14], n: '¡Feliz Día del Amor y la Amistad!', f: '14 de febrero' },
    { k: 'patrias', de: [9, 1], a: [9, 16], n: '¡Viva México!', f: '15 y 16 de septiembre' },
    { k: 'halloween', de: [10, 15], a: [10, 31], n: '¡Feliz Halloween!', f: '31 de octubre' },
    { k: 'muertos', de: [11, 1], a: [11, 3], n: '¡Feliz Día de Muertos!', f: '1 y 2 de noviembre' },
    { k: 'navidad', de: [12, 1], a: [1, 6], n: '¡Feliz Navidad!', f: '25 de diciembre' }
  ];
  var DIA = 864e5;
  function hoyMty() {
    try {
      var s = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Monterrey', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
      var m = s.match(/(\d{4})\D(\d{2})\D(\d{2})/);
      if (m) return [+m[1], +m[2], +m[3]];
    } catch (e) { /* navegador viejo: el día del equipo */ }
    var d = new Date(); return [d.getFullYear(), d.getMonth() + 1, d.getDate()];
  }
  function num(y, m, d) { return Math.round(Date.UTC(y, m - 1, d) / DIA); }
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  // primer y último día (contados desde 1970) de la fecha x en el año y; [2] es el día del festejo si cambia cada año.
  // nth: [mes, día de la semana (0 domingo), cuál] para las que cambian (Día del Padre: tercer domingo de junio).
  function rango(x, y) {
    var i, f, d;
    if (x.nth) {
      d = 1 + (7 + x.nth[1] - new Date(Date.UTC(y, x.nth[0] - 1, 1)).getUTCDay()) % 7 + (x.nth[2] - 1) * 7;
      i = f = num(y, x.nth[0], d);
    } else { i = num(y, x.de[0], x.de[1]); f = num(x.a[0] < x.de[0] ? y + 1 : y, x.a[0], x.a[1]); }
    // un día suelto en sábado o domingo sale desde el viernes (si ese día es de otra fecha, gana la otra: es más corta)
    if (i === f) { var w = new Date(f * DIA).getUTCDay(); if (w === 6) i -= 1; else if (w === 0) i -= 2; }
    return x.nth ? [i, f, d + ' de ' + MESES[x.nth[0] - 1]] : [i, f];
  }
  var ANIO = hoyMty()[0];
  function actual(hoy) {
    var pf = location.search.match(/[?&]fecha=(\d{4})-(\d{2})-(\d{2})/);
    if (pf) hoy = [+pf[1], +pf[2], +pf[3]];
    ANIO = hoy[0];
    var pide = (location.search.match(/[?&]temporada=([a-z]+)/) || [])[1];
    if (pide) return TEMPORADAS.filter(function (x) { return x.k === pide; })[0] || null;
    var n = num(hoy[0], hoy[1], hoy[2]), mejor = null, largo = 1e9;
    TEMPORADAS.forEach(function (x) {
      [hoy[0] - 1, hoy[0]].forEach(function (y) {
        var r = rango(x, y);
        if (n >= r[0] && n <= r[1] && r[1] - r[0] < largo) { mejor = x; largo = r[1] - r[0]; }
      });
    });
    return mejor;
  }
  function fecha(x) { return x.nth ? rango(x, ANIO)[2] : x.f; }

  /* ---------- dibujos (propios; ninguno es el signo) ---------- */
  var ARANA = function (largo) {
    var y = largo - 28;
    return '<svg viewBox="0 0 30 ' + largo + '"><line x1="15" y1="0" x2="15" y2="' + (y - 3) + '" stroke="#cfd6e3" stroke-width="1"/>'
      + '<g fill="#6B7894" stroke="#6B7894" stroke-width="1.6" stroke-linecap="round"><path d="M10 ' + (y + 1) + ' 3 ' + (y - 5) + ' 1 ' + (y - 11) + 'M10 ' + (y + 5) + ' 2 ' + (y + 4) + ' 0 ' + y
      + 'M10 ' + (y + 9) + ' 3 ' + (y + 13) + ' 1 ' + (y + 18) + 'M12 ' + (y + 12) + ' 7 ' + (y + 18) + ' 6 ' + (y + 23)
      + 'M20 ' + (y + 1) + ' 27 ' + (y - 5) + ' 29 ' + (y - 11) + 'M20 ' + (y + 5) + ' 28 ' + (y + 4) + ' 30 ' + y
      + 'M20 ' + (y + 9) + ' 27 ' + (y + 13) + ' 29 ' + (y + 18) + 'M18 ' + (y + 12) + ' 23 ' + (y + 18) + ' 24 ' + (y + 23) + '"/>'
      + '<circle cx="15" cy="' + y + '" r="4.4"/><circle cx="15" cy="' + (y + 9) + '" r="6.4"/></g>'
      + '<circle cx="13.4" cy="' + (y - .6) + '" r="1" fill="#F07A1E"/><circle cx="16.6" cy="' + (y - .6) + '" r="1" fill="#F07A1E"/></svg>';
  };
  var TELARANA = '<svg viewBox="0 0 100 100" fill="none" stroke="#cfd6e3" stroke-width=".8"><path d="M0 0 100 100M0 0 50 100M0 0 100 50M0 0 0 100M0 0 100 0"/>'
    + '<path d="M0 20Q14 14 20 0M0 40Q30 30 40 0M0 62Q46 46 62 0M0 84Q62 62 84 0"/></svg>';
  var CALABAZA = function (c1, c2, cara) {
    return '<svg viewBox="0 0 100 80"><path d="M50 14c-4-8 2-14 8-12" stroke="#3E7A2E" stroke-width="5" fill="none" stroke-linecap="round"/>'
      + '<ellipse cx="30" cy="48" rx="24" ry="28" fill="' + c1 + '"/><ellipse cx="70" cy="48" rx="24" ry="28" fill="' + c1 + '"/><ellipse cx="50" cy="48" rx="26" ry="30" fill="' + c2 + '"/>'
      + '<g class="pt-luz" fill="#FFE066">' + cara + '</g></svg>';
  };
  var CARA1 = '<path d="M34 40l8-6 4 9zM66 40l-8-6-4 9z"/><path d="M30 56q20 14 40 0l-5 3-4-4-4 5-4-5-4 5-4-5-4 4z"/>';
  var CARA2 = '<circle cx="38" cy="42" r="5"/><circle cx="62" cy="42" r="5"/><path d="M36 58q14 8 28 0q-14 14-28 0z"/>';
  var ESQUELETO = '<svg viewBox="0 0 60 100"><g stroke="#EEF1F6" stroke-width="3.2" stroke-linecap="round" fill="none"><circle cx="30" cy="12" r="9" fill="#EEF1F6"/>'
    + '<path d="M30 21v32M23 30h14M24 36h12M25 42h10"/><g class="pt-bi"><path d="M22 28 12 40 8 52"/></g><g class="pt-bd"><path d="M38 28l10 12 4 12"/></g>'
    + '<path d="M24 54h12"/><g class="pt-pi"><path d="M26 55 22 76 20 94"/></g><g class="pt-pd"><path d="M34 55l4 21 2 18"/></g></g>'
    + '<g fill="#0A1222"><circle cx="26.5" cy="11" r="2.3"/><circle cx="33.5" cy="11" r="2.3"/><path d="M27 17h6" stroke="#0A1222" stroke-width="1.4"/></g></svg>';
  var ESFERA = function (largo, color, raya) {
    var y = largo - 18;
    return '<svg viewBox="0 0 30 ' + largo + '"><line x1="15" y1="0" x2="15" y2="' + (y - 16) + '" stroke="#C9A75A" stroke-width="1"/><rect x="11" y="' + (y - 18) + '" width="8" height="6" rx="1" fill="#C9A75A"/>'
      + '<circle cx="15" cy="' + y + '" r="13" fill="' + color + '"/><path d="M4 ' + (y - 2) + 'q11 6 22 0" stroke="' + raya + '" stroke-width="1.6" fill="none"/>'
      + '<circle cx="10" cy="' + (y - 6) + '" r="3" fill="#fff" opacity=".5"/></svg>';
  };
  var PINO = '<svg viewBox="0 0 100 130"><g class="pt-estrella"><path d="M50 2l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" fill="#F2C066"/></g>'
    + '<path d="M50 18 22 56h12L14 84h14L4 114h92L72 84h14L66 56h12z" fill="#1F7A4D"/><rect x="43" y="114" width="14" height="14" fill="#7A4B2A"/>'
    + '<g><circle class="pt-foco" cx="40" cy="50" r="3" fill="#F2C066"/><circle class="pt-foco" cx="60" cy="58" r="3" fill="#C8102E"/><circle class="pt-foco" cx="34" cy="76" r="3" fill="#7FB2EA"/>'
    + '<circle class="pt-foco" cx="64" cy="80" r="3" fill="#F2C066"/><circle class="pt-foco" cx="26" cy="104" r="3" fill="#C8102E"/><circle class="pt-foco" cx="50" cy="96" r="3" fill="#7FB2EA"/>'
    + '<circle class="pt-foco" cx="74" cy="106" r="3" fill="#F2C066"/></g></svg>';
  var SANTA = '<svg viewBox="0 0 110 130"><path d="M30 40C34 14 58 4 80 10l6 22-56 10z" fill="#C8102E"/><circle cx="84" cy="10" r="7" fill="#fff"/><rect x="24" y="36" width="64" height="12" rx="6" fill="#fff"/>'
    + '<g class="pt-panza"><path d="M18 128c0-30 16-50 38-50s38 20 38 50z" fill="#C8102E"/><rect x="18" y="106" width="76" height="10" fill="#222"/><rect x="50" y="104" width="12" height="14" rx="2" fill="#F2C066"/></g>'
    + '<circle cx="56" cy="58" r="16" fill="#F6C9A8"/><path d="M34 60c2 22 12 34 22 34s20-12 22-34c-6 6-12 9-22 9s-16-3-22-9z" fill="#fff"/>'
    + '<path d="M48 54q3-3 6 0M58 54q3-3 6 0" stroke="#3A2A20" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M48 66q8 8 16 0z" fill="#9C2A2A"/>'
    + '<circle cx="44" cy="62" r="3" fill="#E8836B" opacity=".7"/><circle cx="68" cy="62" r="3" fill="#E8836B" opacity=".7"/><circle cx="56" cy="60" r="2.6" fill="#E8836B"/></svg>';
  var BANDERA = '<svg viewBox="0 0 130 150"><rect x="6" y="6" width="5" height="142" rx="2" fill="#C9D1DE"/><circle cx="8.5" cy="6" r="5" fill="#F2C066"/>'
    + '<g class="pt-tela"><path d="M11 12h38v58H11z" fill="#006847"/><path d="M49 12h38v58H49z" fill="#fff"/><path d="M87 12h38v58H87z" fill="#CE1126"/>'
    + '<circle cx="68" cy="41" r="8" fill="#8C6A3D"/><path d="M62 46q6 6 12 0" stroke="#3E7A2E" stroke-width="2" fill="none"/></g></svg>';
  var CHARRO = '<svg viewBox="0 0 130 170"><ellipse cx="62" cy="40" rx="58" ry="12" fill="#C9A75A"/><path d="M38 40c2-26 46-26 48 0z" fill="#B88F3F"/><path d="M40 34h44" stroke="#CE1126" stroke-width="4"/>'
    + '<circle cx="62" cy="62" r="18" fill="#D9A27A"/><path d="M48 70q14 10 28 0" stroke="#3A2A20" stroke-width="5" fill="none" stroke-linecap="round"/>'
    + '<circle cx="55" cy="58" r="2.2" fill="#3A2A20"/><circle cx="69" cy="58" r="2.2" fill="#3A2A20"/><path d="M56 74q6 4 12 0" stroke="#9C2A2A" stroke-width="2" fill="none"/>'
    + '<path d="M24 168c0-44 16-70 38-70s38 26 38 70z" fill="#F7F7F2"/><g stroke="#006847" stroke-width="2" fill="none"><path d="M44 108l6 8 6-8 6 8 6-8 6 8 6-8"/></g>'
    + '<g fill="#CE1126"><circle cx="44" cy="124" r="2.4"/><circle cx="62" cy="124" r="2.4"/><circle cx="80" cy="124" r="2.4"/></g><path d="M62 98v70" stroke="#E2E2DA" stroke-width="1.5"/>'
    + '<path d="M30 128 16 150" stroke="#F7F7F2" stroke-width="12" stroke-linecap="round"/>'
    + '<g class="pt-brinda"><path d="M92 110 104 80" stroke="#F7F7F2" stroke-width="12" stroke-linecap="round"/><circle cx="105" cy="76" r="6" fill="#D9A27A"/>'
    + '<path d="M98 54h14l-2 18h-10z" fill="#F2C066" opacity=".9"/><path d="M98 54h14" stroke="#fff" stroke-width="2"/></g></svg>';
  var PICADO = function (cs) {
    cs = cs || ['#006847', '#fff', '#CE1126']; var h = '';
    for (var i = 0; i < 8; i++) h += '<path d="M' + (10 + i * 75) + ' 4h62v40l-7-5-8 5-8-5-8 5-8-5-8 5-8-5-7 5z" fill="' + cs[i % cs.length] + '"/>';
    return '<svg viewBox="0 0 600 50" preserveAspectRatio="none"><line x1="0" y1="4" x2="600" y2="4" stroke="#cfd6e3" stroke-width="1.2"/>' + h + '</svg>';
  };
  var COHETE = function (c) { return '<svg viewBox="0 0 60 60"><g stroke="' + c + '" stroke-width="2" stroke-linecap="round"><path d="M30 30 30 4M30 30 52 14M30 30 56 34M30 30 44 54M30 30 16 54M30 30 4 34M30 30 8 14"/></g></svg>'; };
  var CORAZON = function (c) { return '<svg viewBox="0 0 16 16"><path d="M8 14.2S1.4 10.1 1.4 5.6A3.5 3.5 0 0 1 8 4a3.5 3.5 0 0 1 6.6 1.6C14.6 10.1 8 14.2 8 14.2z" fill="' + (c || '#D6336C') + '"/></svg>'; };
  var SOMBRERO = '<svg viewBox="0 0 130 60"><ellipse cx="65" cy="44" rx="60" ry="12" fill="#C9A75A"/><path d="M40 44c2-30 48-30 50 0z" fill="#B88F3F"/><path d="M42 36h46" stroke="#CE1126" stroke-width="5"/></svg>';
  var BANDERITA = '<svg viewBox="0 0 40 34"><rect x="2" y="2" width="3" height="32" fill="#C9D1DE"/><path d="M5 4h11v18H5z" fill="#006847"/><path d="M16 4h11v18H16z" fill="#fff"/><path d="M27 4h11v18H27z" fill="#CE1126"/><circle cx="21.5" cy="13" r="2.6" fill="#8C6A3D"/></svg>';


  /* Día de Muertos (Daniel, 31-oct-2026, 20:45: «del 1 al 3 de nov día de muerto? Un altarsito o algo así?»): veladoras
     que titilan, flores de cempasúchil, la calaverita de azúcar y el pan de muerto; caen pétalos naranjas. Dibujos como
     {vb, g}: svg() los arma (grandes en la entrada, chicos junto al signo). */
  function svg(m, mov) { return '<svg viewBox="' + m.vb + '">' + (mov ? '<g class="' + mov + '">' + m.g + '</g>' : m.g) + '</svg>'; }
  function FLOR(cx, cy, r, c1, c2) {
    var h = '', i, a;
    for (i = 0; i < 12; i++) { a = i * Math.PI / 6; h += '<circle cx="' + (cx + Math.cos(a) * r * .62).toFixed(1) + '" cy="' + (cy + Math.sin(a) * r * .62).toFixed(1) + '" r="' + (r * .42).toFixed(1) + '" fill="' + (c1 || '#F07A1E') + '"/>'; }
    for (i = 0; i < 8; i++) { a = i * Math.PI / 4 + .3; h += '<circle cx="' + (cx + Math.cos(a) * r * .32).toFixed(1) + '" cy="' + (cy + Math.sin(a) * r * .32).toFixed(1) + '" r="' + (r * .33).toFixed(1) + '" fill="' + (c2 || '#F9A51E') + '"/>'; }
    return h + '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * .2).toFixed(1) + '" fill="#FFD23F"/>';
  }
  var VELADORA = { vb: '0 0 30 58', g: '<circle class="pt-halo" cx="15" cy="12" r="11" fill="#FFC857" opacity=".28"/>'
    + '<g class="pt-vela"><path d="M15 1C11 7 9 10 9 14a6 6 0 0 0 12 0c0-4-2-7-6-13z" fill="#F7A21B"/><path d="M15 7c-2 4-3 5.6-3 7.6a3 3 0 0 0 6 0c0-2-1-3.6-3-7.6z" fill="#FFE27A"/></g>'
    + '<rect x="14.2" y="19" width="1.6" height="4" fill="#3A2A20"/><rect x="5" y="22" width="20" height="34" rx="3" fill="#F4ECD8" stroke="#C9B48A" stroke-width="1"/>'
    + '<rect x="5.5" y="31" width="19" height="11" fill="#7B2D8E"/><path d="M8 37l2.4-2.4 2.3 2.4 2.3-2.4 2.3 2.4 2.3-2.4L22 37" stroke="#F2C066" stroke-width="1.2" fill="none"/>'
    + '<ellipse cx="15" cy="22.4" rx="9.6" ry="2" fill="#E6DCC4"/>' };
  var CEMPASUCHIL = { vb: '0 0 100 112', g: '<g stroke="#3E7A2E" stroke-width="3" fill="none" stroke-linecap="round"><path d="M50 66C48 50 34 40 28 30M50 66V20M50 66c2-16 14-24 22-32"/></g>'
    + '<path d="M38 52c-8-2-12 2-14 8 7 1 11-2 14-8zM62 50c8-3 13 1 15 7-7 1-12-1-15-7z" fill="#4E9A3A"/>'
    + '<g class="pt-flores">' + FLOR(28, 30, 14) + FLOR(50, 18, 15) + FLOR(73, 32, 13) + '</g>'
    + '<path d="M30 64h40l-4 8c8 6 10 16 6 26-3 7-11 12-22 12s-19-5-22-12c-4-10-2-20 6-26z" fill="#B5522B"/>'
    + '<path d="M32 64h36" stroke="#8E3E1F" stroke-width="4" stroke-linecap="round"/><path d="M33 84c4 3 8-3 12 0s8-3 12 0 8-3 12 0" stroke="#F2C066" stroke-width="2" fill="none"/>'
    + '<g fill="#F4ECD8"><circle cx="38" cy="96" r="1.8"/><circle cx="50" cy="98" r="1.8"/><circle cx="62" cy="96" r="1.8"/></g>' };
  var CALAVERITA = { vb: '0 0 80 84', g: '<path d="M40 3C20 3 7 17 7 35c0 12 6 20 14 24v12c0 4 3 7 7 7h24c4 0 7-3 7-7V59c8-4 14-12 14-24C73 17 60 3 40 3z" fill="#FFF8EC" stroke="#E2D2B6" stroke-width="1.6"/>'
    + FLOR(40, 17, 7, '#E8418C', '#F2C066')
    + '<g class="pt-ojos"><circle cx="26" cy="37" r="9.5" fill="#E8418C"/><circle cx="54" cy="37" r="9.5" fill="#2BB3C0"/>'
    + '<circle cx="26" cy="37" r="5" fill="#1A2333"/><circle cx="54" cy="37" r="5" fill="#1A2333"/><circle cx="24.4" cy="35.4" r="1.5" fill="#fff"/><circle cx="52.4" cy="35.4" r="1.5" fill="#fff"/></g>'
    + '<path d="M40 45l-4.4 7.6h8.8z" fill="#1A2333"/><path d="M12 47q5 5 10 0M58 47q5 5 10 0" stroke="#F07A1E" stroke-width="2" fill="none" stroke-linecap="round"/>'
    + '<path d="M26 65q14 6 28 0" stroke="#1A2333" stroke-width="1.8" fill="none"/><path d="M31 63.6v5M36 64.8v5M40 65v5M44 64.8v5M49 63.6v5" stroke="#1A2333" stroke-width="1.4"/>'
    + '<g fill="#7B2D8E"><circle cx="14" cy="28" r="2"/><circle cx="66" cy="28" r="2"/></g>' };
  var PAN_MUERTO = { vb: '0 0 90 62', g: '<ellipse cx="45" cy="54" rx="40" ry="6" fill="#0A1222" opacity=".25"/>'
    + '<path d="M6 46C6 24 24 12 45 12s39 12 39 34c0 5-17 9-39 9S6 51 6 46z" fill="#D98A3A"/>'
    + '<path d="M14 40c6-10 18-16 31-16s25 6 31 16" stroke="#B9661F" stroke-width="5.5" fill="none" stroke-linecap="round"/>'
    + '<path d="M45 14c-6 8-8 20-6 34M45 14c6 8 8 20 6 34" stroke="#B9661F" stroke-width="5" fill="none" stroke-linecap="round"/>'
    + '<g fill="#B9661F"><circle cx="20" cy="33" r="3.6"/><circle cx="70" cy="33" r="3.6"/><circle cx="40" cy="30" r="3.4"/><circle cx="50" cy="30" r="3.4"/></g>'
    + '<circle cx="45" cy="13" r="6.4" fill="#C26F28"/>'
    + '<g fill="#FFF3D6"><circle cx="24" cy="44" r="1"/><circle cx="32" cy="38" r="1"/><circle cx="58" cy="40" r="1"/><circle cx="66" cy="46" r="1"/><circle cx="46" cy="44" r="1"/><circle cx="36" cy="48" r="1"/><circle cx="54" cy="50" r="1"/><circle cx="28" cy="26" r="1"/><circle cx="62" cy="24" r="1"/><circle cx="42" cy="22" r="1"/></g>' };
  // la veladora chica, junto al signo: su flama titila y su luz respira
  var VELADORA_CHICA = { vb: '0 0 12 20', g: '<circle class="pt-halo" cx="6" cy="4.6" r="4.4" fill="#FFC857" opacity=".3"/>'
    + '<g class="pt-vela"><path d="M6 .5C4.4 3 3.6 4.3 3.6 5.6a2.4 2.4 0 0 0 4.8 0C8.4 4.3 7.6 3 6 .5z" fill="#F7A21B"/><path d="M6 3c-.8 1.4-1.2 2-1.2 2.8a1.2 1.2 0 0 0 2.4 0c0-.8-.4-1.4-1.2-2.8z" fill="#FFE27A"/></g>'
    + '<rect x="5.6" y="7.6" width=".8" height="1.6" fill="#3A2A20"/><rect x="2" y="9" width="8" height="10.6" rx="1.2" fill="#F4ECD8" stroke="#B9A57C" stroke-width=".45"/>'
    + '<rect x="2.25" y="12" width="7.5" height="3.6" fill="#7B2D8E"/><path d="M3.4 13.9l.86-.8.86.8.86-.8.86.8.86-.8.86.8" stroke="#F2C066" stroke-width=".45" fill="none"/>' };

  /* ---------- la escena de la entrada: [clase, dibujo, estilo, qué dice al picarlo, cómo reacciona] ---------- */
  var ESCENAS = {
    halloween: [
      ['pt-telar', TELARANA, 'left:-8px;top:-8px;width:150px'],
      ['pt-telar', TELARANA, 'right:-8px;top:-8px;width:150px;transform:scaleX(-1)'],
      ['pt-p pt-arana', ARANA(120), 'left:22%;top:0;width:34px', '¡Hola!'],
      ['pt-p pt-arana pt-lenta', ARANA(160), 'right:18%;top:0;width:26px', '¡Aquí estoy!'],
      ['pt-p pt-calabaza', CALABAZA('#E8730F', '#F58A1F', CARA1), 'left:7%;bottom:22px;width:92px', '¡Buuu!', 'pt-brinca'],
      ['pt-p pt-calabaza pt-m-no', CALABAZA('#D9650C', '#EE7F18', CARA2), 'left:29%;bottom:18px;width:62px', '¡Muajaja!', 'pt-brinca'],
      ['pt-p pt-esq', ESQUELETO, 'right:9%;bottom:20px;width:62px;height:100px', '¡A bailar!', 'pt-gira'],
      ['pt-p pt-esq pt-tarde pt-m-no', ESQUELETO, 'right:29%;bottom:14px;width:48px;height:80px', '¡Uy, qué miedo!', 'pt-gira']],
    muertos: [
      ['pt-picado', PICADO(['#7B2D8E', '#F07A1E', '#E8418C', '#F2C066', '#2BB3C0']), 'left:0;right:0;top:0;height:56px'],
      ['pt-lluvia ll-petalos', '', 'inset:0'],
      ['pt-p pt-a-mece', svg(CEMPASUCHIL), 'left:6%;bottom:20px;width:100px', '¡Flor de cempasúchil!', 'pt-brinca'],
      ['pt-p pt-m-no', svg(VELADORA), 'left:27%;bottom:18px;width:30px', '¡Que no se apague!', 'pt-brinca'],
      ['pt-p pt-m-no', svg(VELADORA), 'left:33%;bottom:14px;width:24px', '¡Luz para el camino!', 'pt-brinca'],
      ['pt-p pt-a-flota', svg(CALAVERITA), 'right:7%;bottom:22px;width:84px', '¡Calaverita de azúcar!', 'pt-gira'],
      ['pt-p pt-a-brinca pt-a-tarde pt-m-no', svg(PAN_MUERTO), 'right:27%;bottom:14px;width:74px', '¡Pan de muerto!', 'pt-brinca'],
      ['pt-p', svg(VELADORA), 'right:3%;bottom:14px;width:22px', '¡A recordar con cariño!', 'pt-brinca']],
    navidad: [
      ['pt-lluvia ll-nieve', '', 'inset:0'],
      ['pt-p pt-esfera', ESFERA(100, '#C8102E', '#fff'), 'left:16%;top:0;width:34px', '¡Tilín!', 'pt-suena'],
      ['pt-p pt-esfera pt-tarde pt-m-no', ESFERA(80, '#1F7A4D', '#F2C066'), 'left:33%;top:0;width:28px', '¡Tilín!', 'pt-suena'],
      ['pt-p pt-esfera', ESFERA(110, '#F2C066', '#C8102E'), 'right:20%;top:0;width:32px', '¡Tilín!', 'pt-suena'],
      ['pt-p pt-pino', PINO, 'left:6%;bottom:16px;width:120px', '¡Feliz Navidad!', 'pt-brinca'],
      ['pt-p pt-santa', SANTA, 'right:7%;bottom:14px;width:110px', '¡Jo, jo, jo!', 'pt-brinca']],
    patrias: [
      ['pt-picado', PICADO(), 'left:0;right:0;top:0;height:56px'],
      ['pt-cuete', COHETE('#F2C066'), 'left:12%;top:18%;width:70px'],
      ['pt-cuete pt-tarde', COHETE('#5BD69A'), 'right:16%;top:24%;width:56px'],
      ['pt-p pt-bandera', BANDERA, 'left:7%;bottom:26px;width:130px', '¡Viva México!', 'pt-brinca'],
      ['pt-p pt-charro', CHARRO, 'right:7%;bottom:12px;width:130px', '¡Salud y viva México!', 'pt-brinca']],
    amor: [
      ['pt-p pt-sube', CORAZON(), 'left:12%;bottom:40px;width:40px', '¡Feliz día!', 'pt-brinca'],
      ['pt-p pt-sube pt-tarde', CORAZON('#F07A1E'), 'left:30%;bottom:20px;width:28px', '¡Con cariño!', 'pt-brinca'],
      ['pt-p pt-sube pt-lenta', CORAZON('#F29BC4'), 'right:14%;bottom:34px;width:46px', '¡Amor y amistad!', 'pt-brinca'],
      ['pt-p pt-sube pt-m-no', CORAZON(), 'right:32%;bottom:14px;width:24px', '❤', 'pt-brinca']]
  };
  // dentro del portal, a la derecha: dos chicos, quietos hasta que se pican
  var CHICOS = {
    halloween: [CALABAZA('#E8730F', '#F58A1F', CARA1), ARANA(40)],
    muertos: [svg(CALAVERITA), svg(PAN_MUERTO)],
    navidad: [ESFERA(34, '#C8102E', '#fff'), PINO],
    patrias: [BANDERITA, SOMBRERO],
    amor: [CORAZON(), CORAZON('#F07A1E')]
  };

  // junto al signo de cada menú (clases ptc-, para no chocar con las de la escena de la entrada)
  var JUNTO = { halloween: 'arana', muertos: 'veladora', navidad: 'santa', amor: 'corazon', patrias: 'bandera' };
  // ancho de cada dibujo junto al signo (px); el alto sale de su viewBox. Van con tamaño fijo porque Safari (iPhone, iPad
  // y Mac) no siempre saca el alto de un dibujo con «height:auto» y dejaba la arañita fuera de su recuadro, sin verse
  // (Daniel, 31-oct-2026, con una captura de su iPhone: «Hay forma de ver desde aquí la arañita?»).
  var JUNTO_ANCHO = { arana: 13, santa: 17, corazon: 13, bandera: 15, veladora: 11 };
  var JUNTO_SVG = {
    arana: '<svg viewBox="0 8 16 18" fill="none" stroke="currentColor" stroke-linecap="round">'
      + '<path d="M5.6 15.2 2 12.6 1 9.6M5.4 16.6 1.2 15.6 0 13.4M5.6 18.2 1.6 19.6.6 22.4M6.2 19.4 3.8 22.6 3.6 25.2'
      + 'M10.4 15.2 14 12.6l1-3M10.6 16.6l4.2-1 1.2-2.2M10.4 18.2l4 1.4 1 2.8M9.8 19.4l2.4 3.2.2 2.6" stroke-width="1"/>'
      + '<circle cx="8" cy="14.4" r="2.3" fill="currentColor" stroke="none"/><circle cx="8" cy="18.6" r="3.2" fill="currentColor" stroke="none"/>'
      + '<circle cx="7.1" cy="14" r=".55" fill="#F07A1E" stroke="none"/><circle cx="8.9" cy="14" r=".55" fill="#F07A1E" stroke="none"/></svg>',
    // el Santa se ríe: se mece, la borla del gorro se balancea y abre la boca («¡jo, jo, jo!»)
    santa: '<svg viewBox="0 0 20 24"><g class="ptc-jojo"><g class="ptc-gorro"><path d="M3.5 10.5C4.5 4 9 1.2 14.5 2.2l1.2 5.6-12.2 2.7z" fill="#C8102E"/>'
      + '<circle cx="15.6" cy="2.6" r="1.9" fill="#fff" stroke="#D5DAE1" stroke-width=".5"/></g>'
      + '<rect x="2.6" y="9.4" width="14.6" height="3" rx="1.5" fill="#fff" stroke="#D5DAE1" stroke-width=".5"/>'
      + '<circle cx="10" cy="15.2" r="4.2" fill="#F6C9A8"/><circle cx="8.5" cy="14.4" r=".55" fill="#3A2A20"/><circle cx="11.5" cy="14.4" r=".55" fill="#3A2A20"/>'
      + '<circle cx="7.3" cy="16" r=".9" fill="#E8836B" opacity=".55"/><circle cx="12.7" cy="16" r=".9" fill="#E8836B" opacity=".55"/>'
      + '<path d="M4.6 15.6c.4 5 3 7.6 5.4 7.6s5-2.6 5.4-7.6c-1.2 1.6-2.6 2.4-5.4 2.4s-4.2-.8-5.4-2.4z" fill="#fff" stroke="#D5DAE1" stroke-width=".5"/>'
      + '<ellipse class="ptc-boca" cx="10" cy="18.4" rx="1.3" ry=".75" fill="#9C2A2A"/>'
      + '<circle cx="10" cy="16.4" r=".8" fill="#E8836B"/></g></svg>',
    corazon: '<svg viewBox="0 0 16 16"><path class="ptc-lat" d="M8 14.2S1.4 10.1 1.4 5.6A3.5 3.5 0 0 1 8 4a3.5 3.5 0 0 1 6.6 1.6C14.6 10.1 8 14.2 8 14.2z" fill="#D6336C"/></svg>',
    bandera: BANDERA_OLA(),
    veladora: svg(VELADORA_CHICA)
  };
  /* ---------- fechas «chispa» (Daniel, 31-oct-2026, 20:48 a 21:02: «sí a todas»; en la entrada y adentro) ----------
     fecha(x, c) da de alta una fecha: x = {k, de, a} (o nth), n (felicitación) y f (el día); c = sus dibujos como {vb, g}:
     m (principal) y m2 (de compañía), mov y mov2 (cómo se mueven en la entrada: brinca, mece, flota, gira, late, vuela,
     saluda), lluvia (nieve, petalos, confeti, burbujas, estrellas, notas, corazones, numeros), dice (lo que dice cada
     dibujo al picarlo), j y jmov (el adorno de junto al signo; si no, m), c1 y c2 (los dos quietos; si no, m y m2) y
     extra (más piezas de la escena). Su CSS propio va en CSS_FECHAS, con clases pt-<clave>-… */
  var CSS_FECHAS = '';
  function alta(x, c) {
    TEMPORADAS.push(x);
    var k = x.k, mv = c.mov || 'brinca', mv2 = c.mov2 || mv, d = c.dice || [], w = c.w || 104, w2 = c.w2 || 104, m2 = c.m2 || c.m;
    ESCENAS[k] = (c.lluvia ? [['pt-lluvia ll-' + c.lluvia, '', 'inset:0']] : []).concat([
      ['pt-p pt-a-' + mv, svg(c.m), 'left:7%;bottom:22px;width:' + w + 'px', d[0] || x.n, 'pt-brinca'],
      ['pt-p pt-a-' + mv + ' pt-a-tarde pt-m-no', svg(c.m), 'left:29%;bottom:16px;width:' + Math.round(w * .55) + 'px', d[1] || d[0] || x.n, 'pt-brinca'],
      ['pt-p pt-a-' + mv2, svg(m2), 'right:7%;bottom:16px;width:' + w2 + 'px', d[2] || d[0] || x.n, 'pt-brinca'],
      ['pt-p pt-a-' + mv2 + ' pt-a-tarde pt-m-no', svg(m2), 'right:29%;bottom:14px;width:' + Math.round(w2 * .55) + 'px', d[3] || d[1] || d[0] || x.n, 'pt-brinca']
    ]).concat(c.extra || []);
    CHICOS[k] = [svg(c.c1 || c.m), svg(c.c2 || m2)];
    var j = c.j || c.m, vb = j.vb.split(/\s+/).map(Number);
    JUNTO[k] = k; JUNTO_ANCHO[k] = c.ja || Math.min(16, Math.round(19 * vb[2] / vb[3]));
    JUNTO_SVG[k] = svg(j, 'ptc-mov ptc-m-' + (c.jmov || mv));
  }
  /* ---------- aquí van las fechas «chispa» ---------- */

  // La banderita ondea: la tela va en 12 tiras que suben y bajan una tras otra (más cerca del asta, menos), con su sombra.
  function BANDERA_OLA() {
    var h = '<svg viewBox="0 0 18 18"><path d="M2 1.4v15.6" stroke="#8A94A6" stroke-width="1.2" stroke-linecap="round"/><circle cx="2" cy="1.2" r=".95" fill="#C9A75A"/>';
    for (var i = 0; i < 12; i++) {
      var x = 2.6 + i * 1.15, c = i < 4 ? '#006847' : i < 8 ? '#fff' : '#CE1126', d = (i * .11 - 2).toFixed(2);
      h += '<g class="ptc-ola ptc-o' + (1 + Math.floor(i / 3)) + '" style="animation-delay:' + d + 's">'
        + '<rect x="' + x.toFixed(2) + '" y="2" width="1.4" height="8" fill="' + c + '"/>'
        + (c === '#fff' ? '<path d="M' + x.toFixed(2) + ' 2.1h1.2M' + x.toFixed(2) + ' 9.9h1.2" stroke="#C9D1DE" stroke-width=".3"/>' : '')
        + '<rect class="ptc-sombra" x="' + x.toFixed(2) + '" y="2" width="1.15" height="8" fill="#0A1222" style="animation-delay:' + (i * .11 - 2.33).toFixed(2) + 's"/></g>';
    }
    // el escudo, entero, se mueve con la tela de en medio
    return h + '<g class="ptc-ola ptc-o2" style="animation-delay:-1.40s"><circle cx="9.5" cy="6" r="1.1" fill="#8C6A3D"/></g></svg>';
  }

  var CSS = '.pt-escena{position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden}'
    + '.pt-escena>*{position:absolute}.pt-escena svg{display:block;width:100%;height:auto;overflow:visible}'
    + '.pt-escena .pt-p{pointer-events:auto;cursor:pointer;-webkit-tap-highlight-color:transparent}'
    + '.pt-escena .pt-telar{opacity:.55}'
    + '.pt-globo{position:absolute;z-index:3;background:#fff;color:#1A2333;font:800 13px/1.2 Arial,sans-serif;padding:6px 10px;border-radius:12px;text-align:center;max-width:min(240px,calc(100% - 12px));'
    + 'opacity:0;transform:translateY(6px) scale(.9);transition:opacity .25s,transform .25s;pointer-events:none;box-shadow:0 6px 18px rgba(0,0,0,.3)}'
    + '.pt-globo.ver{opacity:1;transform:none}.pt-globo small{display:block;font:600 11px/1.3 Arial,sans-serif;color:#5A6478;margin-top:2px}'
    + '.pt-arana{transform-origin:50% 0;animation:pt-baja 3.2s ease-in-out infinite alternate}.pt-arana.pt-lenta{animation-delay:-1.4s}'
    + '.pt-arana:hover{animation-duration:.9s}@keyframes pt-baja{from{transform:translateY(-10px)}to{transform:translateY(18px)}}'
    + '.pt-luz{animation:pt-flama 1.4s ease-in-out infinite alternate}@keyframes pt-flama{from{opacity:.65}to{opacity:1}}'
    + '.pt-esq{transform-origin:50% 100%;animation:pt-baila 1.1s ease-in-out infinite alternate}.pt-esq.pt-tarde{animation-delay:-.5s}'
    + '.pt-bi{transform-origin:20px 30px;animation:pt-b1 .55s ease-in-out infinite alternate}.pt-bd{transform-origin:40px 30px;animation:pt-b2 .55s ease-in-out infinite alternate}'
    + '.pt-pi{transform-origin:24px 62px;animation:pt-p1 .55s ease-in-out infinite alternate}.pt-pd{transform-origin:36px 62px;animation:pt-p2 .55s ease-in-out infinite alternate}'
    + '@keyframes pt-baila{from{transform:rotate(-6deg)}to{transform:rotate(6deg) translateY(-6px)}}'
    + '@keyframes pt-b1{from{transform:rotate(-50deg)}to{transform:rotate(40deg)}}@keyframes pt-b2{from{transform:rotate(50deg)}to{transform:rotate(-40deg)}}'
    + '@keyframes pt-p1{from{transform:rotate(-18deg)}to{transform:rotate(14deg)}}@keyframes pt-p2{from{transform:rotate(18deg)}to{transform:rotate(-14deg)}}'
    // lluvias de la entrada: nieve, pétalos, confeti, burbujas, estrellas, notas y corazones (lluvia())
    + '.pt-lluvia i{position:absolute;display:block;font-style:normal;line-height:1}'
    + '.pt-ll-nieve{top:-10px;border-radius:50%;background:#fff;animation:pt-cae linear infinite}@keyframes pt-cae{to{transform:translateY(110vh) translateX(30px)}}'
    + '.pt-ll-petalos{top:-12px;border-radius:70% 0 70% 0;animation:pt-petalo linear infinite}@keyframes pt-petalo{to{transform:translate(46px,110vh) rotate(560deg)}}'
    + '.pt-ll-confeti{top:-12px;border-radius:1px;animation:pt-confeti linear infinite}@keyframes pt-confeti{to{transform:translate(-30px,110vh) rotate3d(1,.6,.2,900deg)}}'
    + '.pt-ll-burbujas{bottom:-24px;border:1.5px solid rgba(255,255,255,.55);border-radius:50%;animation:pt-burbuja ease-in infinite}@keyframes pt-burbuja{to{transform:translate(24px,-110vh)}}'
    + '.pt-ll-estrellas{border-radius:50%;background:#fff;animation:pt-brilla ease-in-out infinite alternate}'
    + '.pt-ll-notas,.pt-ll-corazones,.pt-ll-numeros{bottom:-24px;font-weight:700;animation:pt-subell linear infinite}@keyframes pt-subell{0%{transform:translate(0,0);opacity:0}10%{opacity:.9}100%{transform:translate(30px,-80vh) rotate(20deg);opacity:0}}'
    // movimientos de la entrada para los dibujos de cada fecha (el que se pica reacciona encima, con !important)
    + '.pt-a-brinca{transform-origin:50% 100%;animation:pt-a-brinca 1.7s ease-in-out infinite}'
    + '@keyframes pt-a-brinca{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}48%{transform:translateY(0) scale(1.04,.94)}62%{transform:translateY(-4px)}76%{transform:none}}'
    + '.pt-a-mece{transform-origin:50% 100%;animation:pt-a-mece 2.4s ease-in-out infinite alternate}@keyframes pt-a-mece{from{transform:rotate(-6deg)}to{transform:rotate(6deg)}}'
    + '.pt-a-flota{animation:pt-a-flota 3.2s ease-in-out infinite alternate}@keyframes pt-a-flota{from{transform:translateY(0) rotate(-3deg)}to{transform:translateY(-16px) rotate(3deg)}}'
    + '.pt-a-gira{animation:pt-a-gira 7s linear infinite}@keyframes pt-a-gira{to{transform:rotate(360deg)}}'
    + '.pt-a-late{animation:pt-a-late 1.7s ease-in-out infinite}@keyframes pt-a-late{0%,100%{transform:scale(1)}20%{transform:scale(1.09)}40%{transform:scale(1)}}'
    + '.pt-a-vuela{animation:pt-a-vuela 5s ease-in-out infinite}'
    + '@keyframes pt-a-vuela{0%,100%{transform:translate(0,0) rotate(-4deg)}25%{transform:translate(18px,-16px) rotate(4deg)}50%{transform:translate(0,-26px) rotate(-2deg)}75%{transform:translate(-18px,-12px) rotate(3deg)}}'
    + '.pt-a-saluda{transform-origin:50% 100%;animation:pt-a-saluda 1.6s ease-in-out infinite}@keyframes pt-a-saluda{0%,58%,100%{transform:rotate(0)}12%,36%{transform:rotate(-10deg)}24%,48%{transform:rotate(9deg)}}'
    + '.pt-a-tarde{animation-delay:-1.1s}'
    // partes que se mueven dentro de los dibujos (en la entrada y junto al signo; los dos chicos de adentro, quietos)
    + '.pt-vela{transform-box:fill-box;transform-origin:50% 100%;animation:pt-vela .8s ease-in-out infinite alternate}'
    + '@keyframes pt-vela{0%{transform:scale(1,1) rotate(-4deg)}50%{transform:scale(.9,1.08) rotate(2deg)}100%{transform:scale(1.04,.94) rotate(4deg)}}'
    + '.pt-halo{transform-box:fill-box;transform-origin:50% 50%;animation:pt-halo 1.6s ease-in-out infinite alternate}@keyframes pt-halo{from{opacity:.14;transform:scale(.85)}to{opacity:.38;transform:scale(1.08)}}'
    + '.pt-flores{transform-box:fill-box;transform-origin:50% 100%;animation:pt-mece 2.8s ease-in-out infinite alternate}'
    + '.pt-esfera{transform-origin:50% 0;animation:pt-mece 2.6s ease-in-out infinite alternate}.pt-esfera.pt-tarde{animation-delay:-1s}'
    + '@keyframes pt-mece{from{transform:rotate(-8deg)}to{transform:rotate(8deg)}}'
    + '.pt-foco{animation:pt-brilla 1.2s ease-in-out infinite alternate}.pt-foco:nth-child(2n){animation-delay:.4s}.pt-foco:nth-child(3n){animation-delay:.8s}'
    + '@keyframes pt-brilla{from{opacity:.35}to{opacity:1}}'
    + '.pt-estrella{transform-origin:50px 16px;animation:pt-late 2s ease-in-out infinite}@keyframes pt-late{50%{transform:scale(1.18)}}'
    + '.pt-santa{transform-origin:50% 100%;animation:pt-rie 1.6s ease-in-out infinite}'
    + '@keyframes pt-rie{0%,100%{transform:rotate(0)}20%{transform:rotate(-3deg) translateY(-3px)}40%{transform:rotate(3deg)}60%{transform:rotate(-2deg) translateY(-2px)}}'
    + '.pt-panza{transform-origin:56px 100px;animation:pt-panza .4s ease-in-out infinite alternate}@keyframes pt-panza{to{transform:scaleY(1.04) translateY(-1px)}}'
    + '.pt-tela{transform-origin:11px 41px;animation:pt-onda 1.6s ease-in-out infinite}'
    + '@keyframes pt-onda{0%,100%{transform:skewY(0)}25%{transform:skewY(3deg) scaleX(.97)}75%{transform:skewY(-3deg) scaleX(.98)}}'
    + '.pt-picado path{transform-origin:50% 0;transform-box:fill-box;animation:pt-mece 2.2s ease-in-out infinite alternate}.pt-picado path:nth-child(2n){animation-delay:.5s}'
    + '.pt-charro{transform-origin:50% 100%;animation:pt-balancea 1.8s ease-in-out infinite alternate}@keyframes pt-balancea{from{transform:rotate(-3deg)}to{transform:rotate(3deg)}}'
    + '.pt-brinda{transform-origin:92px 110px;animation:pt-brinda 1.8s ease-in-out infinite alternate}@keyframes pt-brinda{to{transform:rotate(-18deg)}}'
    + '.pt-cuete{opacity:0;animation:pt-cuete 2.4s ease-out infinite}.pt-cuete.pt-tarde{animation-delay:1.2s}'
    + '@keyframes pt-cuete{0%{opacity:0;transform:scale(.2)}20%{opacity:1}100%{opacity:0;transform:scale(1.4)}}'
    + '.pt-sube{animation:pt-sube 3.4s ease-in-out infinite alternate}.pt-sube.pt-tarde{animation-delay:-1.2s}.pt-sube.pt-lenta{animation-duration:4.6s}'
    + '@keyframes pt-sube{from{transform:translateY(0) rotate(-6deg)}to{transform:translateY(-26px) rotate(6deg)}}'
    // reacciones al picar
    + '.pt-escena .pt-brinca,.pt-chicos .pt-brinca{animation:pt-brinco .6s ease!important}@keyframes pt-brinco{30%{transform:translateY(-22px) rotate(-6deg)}60%{transform:translateY(0) rotate(4deg)}}'
    + '.pt-escena .pt-gira{animation:pt-gira .8s linear!important}@keyframes pt-gira{to{transform:rotate(360deg)}}'
    + '.pt-escena .pt-suena{animation:pt-suena .9s ease!important}@keyframes pt-suena{20%{transform:rotate(-28deg)}45%{transform:rotate(22deg)}70%{transform:rotate(-12deg)}}'
    // en el celular la entrada es una franja: los adornos más chicos y solo los principales
    + '@media (max-width:859px){.pt-escena .pt-m-no{display:none}.pt-escena .pt-p,.pt-escena .pt-telar,.pt-escena .pt-cuete{zoom:.55}.pt-escena .pt-picado{height:34px!important}}'
    // dentro del portal: dos adornos chicos junto a la campanita
    + '.pt-chicos{display:inline-flex;align-items:flex-end;gap:4px;flex:none;margin-right:2px}'
    + '.pt-chicos button{width:28px;height:28px;padding:0;border:0;background:none;cursor:pointer;display:block;border-radius:6px}'
    + '.pt-chicos button:focus-visible{outline:2px solid #F07A1E;outline-offset:2px}.pt-chicos svg{display:block;width:100%;height:100%;overflow:visible}'
    // en el celular no salen (Daniel, 31-oct-2026, 17:22 a 17:32: «solo de la vista del celular; dale siempre preferencia a
    // lo animado que a lo estático»): el encabezado va en un solo renglón y gana el adorno animado junto al signo. En iPad,
    // laptop y pantallas más grandes sí salen, salvo que no quepan en el renglón (js/menu.js, unRenglon(), los quita primero)
    + '@media (max-width:600px){.pt-chicos{display:none}}'
    // junto al signo de cada menú: el adorno a un lado (aparta su lugar para no encimarse en «PROFASE»)
    + '.ptc-caja.ptc-caja{position:relative;display:block;flex:none;padding-right:15px}'   // doble: le gana a «.pm-cab span» del menú ☰
    + '.ptc-adorno{position:absolute;left:32px;pointer-events:none}.ptc-adorno svg{display:block;flex:none;overflow:visible}'
    // la arañita: el hilo sale de la orilla de arriba (--ptc-d lo mide junto()) y ella baja y sube
    // Sin recortes ni «transform»: en el iPhone (Safari) la arañita no se pintaba dentro del encabezado pegado arriba
    // (sí en el ☰; Daniel, 31-oct-2026, 17:08). Ahora el hilo es su propia raya, que crece y se encoge, y la arañita baja
    // y sube moviendo su «bottom», al mismo compás; nada depende de «overflow:hidden».
    + '.ptc-arana{top:calc(-1 * var(--ptc-d,10px));width:13px;height:calc(var(--ptc-d,10px) + 28px);overflow:visible;color:#2B3445}'
    + ':root[data-theme="dark"] .ptc-arana,.ptc-oscuro .ptc-arana{color:#E5EAF2}'
    + '.ptc-hilo{position:absolute;display:block;left:6px;top:0;width:1px;height:calc(100% - 14px);background:currentColor;opacity:.55;animation:ptc-hilo 2.8s ease-in-out infinite alternate}'
    + '@keyframes ptc-hilo{from{height:calc(100% - 30px)}to{height:calc(100% - 14px)}}'
    + '.ptc-cae{position:absolute;display:block;left:0;width:13px;height:15px;bottom:3px;animation:ptc-baja 2.8s ease-in-out infinite alternate}'
    + '@keyframes ptc-baja{from{bottom:19px}to{bottom:3px}}'
    + '.ptc-santa{bottom:-3px;width:17px}.ptc-corazon{top:2px;width:13px}.ptc-bandera{top:0;width:15px}.ptc-veladora{top:-1px;width:11px}.ptc-gen{top:1px}'
    // el adorno se puede picar (sale su felicitación); su zona de toque es un poco más grande que el dibujo, sin tapar el signo
    + '.ptc-adorno.ptc-adorno{pointer-events:auto;cursor:pointer;-webkit-tap-highlight-color:transparent}.ptc-adorno::before{content:"";position:absolute;inset:-6px -7px -6px 0}'
    + '.ptc-globo{position:fixed;z-index:1000;max-width:min(260px,calc(100vw - 16px));background:#fff;color:#1F3864;border:1px solid #D5DCE8;border-left:4px solid #F07A1E;'
    + 'border-radius:12px;padding:8px 12px;box-shadow:0 8px 24px rgba(10,18,34,.22);font:700 14px/1.25 Arial,sans-serif;text-align:left;pointer-events:none;'
    + 'opacity:0;transform:translateY(-4px);transition:opacity .2s,transform .2s}.ptc-globo.ver{opacity:1;transform:none}'
    + '.ptc-globo span{display:block;font-weight:400;font-size:12.5px;color:#5A6478;margin-top:2px}'
    + ':root[data-theme="dark"] .ptc-globo{background:#1C2A44;color:#fff;border-color:#2A3A58}:root[data-theme="dark"] .ptc-globo span{color:#AAB6CC}'
    // movimientos de las fechas «chispa» junto al signo (en porcentaje del dibujo, para que valgan a cualquier tamaño)
    + '.ptc-mov{transform-box:fill-box;transform-origin:50% 50%}'
    + '.ptc-m-brinca{transform-origin:50% 100%;animation:ptc-m-brinca 1.7s ease-in-out infinite}'
    + '@keyframes ptc-m-brinca{0%,100%{transform:translateY(0)}30%{transform:translateY(-16%)}48%{transform:translateY(0) scale(1.06,.9)}62%{transform:translateY(-5%)}76%{transform:none}}'
    + '.ptc-m-mece{transform-origin:50% 100%;animation:ptc-m-mece 2.2s ease-in-out infinite alternate}@keyframes ptc-m-mece{from{transform:rotate(-12deg)}to{transform:rotate(12deg)}}'
    + '.ptc-m-flota{animation:ptc-m-flota 2.6s ease-in-out infinite alternate}@keyframes ptc-m-flota{from{transform:translateY(6%) rotate(-5deg)}to{transform:translateY(-9%) rotate(5deg)}}'
    + '.ptc-m-gira{animation:ptc-m-gira 4s linear infinite}@keyframes ptc-m-gira{to{transform:rotate(360deg)}}'
    + '.ptc-m-late{animation:ptc-m-late 1.6s ease-in-out infinite}@keyframes ptc-m-late{0%,100%{transform:scale(1)}18%{transform:scale(1.16)}36%{transform:scale(1)}}'
    + '.ptc-m-vuela{animation:ptc-m-vuela 3.6s ease-in-out infinite}'
    + '@keyframes ptc-m-vuela{0%,100%{transform:translate(0,0) rotate(-6deg)}25%{transform:translate(12%,-10%) rotate(6deg)}50%{transform:translate(0,-16%) rotate(-3deg)}75%{transform:translate(-12%,-8%) rotate(4deg)}}'
    + '.ptc-m-saluda{transform-origin:50% 100%;animation:ptc-m-saluda 1.6s ease-in-out infinite}@keyframes ptc-m-saluda{0%,55%,100%{transform:rotate(0)}10%,30%{transform:rotate(-16deg)}20%,40%{transform:rotate(14deg)}}'
    // los dos chicos de junto a la campanita van quietos (solo brincan si se pican)
    + '.pt-chicos svg *{animation:none!important}'
    // el Santa riéndose: se mece y brinca, la borla se balancea y la boca se abre tres veces; luego descansa
    + '.ptc-jojo{transform-origin:10px 23px;animation:ptc-jojo 2.4s ease-in-out infinite}'
    + '@keyframes ptc-jojo{0%,60%,100%{transform:rotate(0)}10%{transform:rotate(-10deg) translateY(-1.4px)}22%{transform:rotate(9deg)}34%{transform:rotate(-7deg) translateY(-1px)}46%{transform:rotate(5deg)}}'
    + '.ptc-gorro{transform-origin:9px 10px;animation:ptc-gorro 2.4s ease-in-out infinite}'
    + '@keyframes ptc-gorro{0%,100%{transform:rotate(0)}14%{transform:rotate(-9deg)}30%{transform:rotate(8deg)}48%{transform:rotate(-6deg)}66%{transform:rotate(3deg)}82%{transform:rotate(-1deg)}}'
    + '.ptc-boca{transform-origin:10px 18.4px;transform:scaleY(.3);animation:ptc-boca 2.4s ease-in-out infinite}'
    + '@keyframes ptc-boca{0%,52%,100%{transform:scaleY(.3)}8%,24%,40%{transform:scaleY(1.1)}16%,32%,48%{transform:scaleY(.3)}}'
    // la banderita ondeando: cada tira sube y baja un poco después de la anterior, con su sombra
    + '.ptc-ola{animation:ptc-o1 1.3s ease-in-out infinite}.ptc-o2{animation-name:ptc-o2}.ptc-o3{animation-name:ptc-o3}.ptc-o4{animation-name:ptc-o4}'
    + '@keyframes ptc-o1{0%,100%{transform:translateY(-.35px)}50%{transform:translateY(.35px)}}'
    + '@keyframes ptc-o2{0%,100%{transform:translateY(-.8px)}50%{transform:translateY(.8px)}}'
    + '@keyframes ptc-o3{0%,100%{transform:translateY(-1.2px)}50%{transform:translateY(1.2px)}}'
    + '@keyframes ptc-o4{0%,100%{transform:translateY(-1.6px)}50%{transform:translateY(1.6px)}}'
    + '.ptc-sombra{opacity:0;animation:ptc-sombra 1.3s ease-in-out infinite}@keyframes ptc-sombra{0%,100%{opacity:0}50%{opacity:.28}}'
    + '.ptc-lat{transform-origin:50% 60%;animation:ptc-lat 1.6s ease-in-out infinite}@keyframes ptc-lat{0%,100%{transform:scale(1)}15%{transform:scale(1.15)}30%{transform:scale(1)}}'
    + CSS_FECHAS
    + '@media (prefers-reduced-motion:reduce){.pt-escena *,.pt-chicos *,.ptc-adorno,.ptc-adorno *{animation:none!important}.pt-lluvia,.ptc-globo{display:none}}'
  // Tamaño fijo de un dibujo: ancho en px y alto según su viewBox (Safari no siempre lo calcula solo con height:auto)
  function fija(svg, ancho) {
    var vb = (svg.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number);
    if (vb.length !== 4 || !(vb[2] > 0) || !(vb[3] > 0)) return;
    if (ancho) {
      var alto = Math.round(ancho * vb[3] / vb[2] * 10) / 10;
      svg.setAttribute('width', ancho); svg.setAttribute('height', alto);
      svg.style.width = ancho + 'px'; svg.style.height = alto + 'px';
    } else svg.style.aspectRatio = vb[2] + ' / ' + vb[3];   // el ancho lo da su caja; el alto, su proporción
  }
  function ponCss() {
    if (document.getElementById('ptemp-css')) return;
    var st = document.createElement('style'); st.id = 'ptemp-css'; st.textContent = CSS; (document.head || document.documentElement).appendChild(st);
  }
  function reacciona(el, clase) {
    if (!clase) return;
    el.classList.remove(clase); void el.getBoundingClientRect(); el.classList.add(clase);
    setTimeout(function () { el.classList.remove(clase); }, 950);
  }
  // el globito de la entrada: lo que dice el dibujo y, abajo, la felicitación y el día
  function globo(caja, el, txt, sub) {
    var g = document.createElement('div'); g.className = 'pt-globo'; g.setAttribute('aria-hidden', 'true');
    g.appendChild(document.createTextNode(txt));
    var c = caja.getBoundingClientRect();
    // la felicitación y el día solo caben sin tapar el signo cuando la entrada es ancha (computadora y tableta)
    if (sub && c.width >= 600) { var s = document.createElement('small'); s.textContent = sub; g.appendChild(s); }
    caja.appendChild(g);
    var r = el.getBoundingClientRect(), w = g.offsetWidth, h = g.offsetHeight;
    // hacia la orilla de su lado, para no tapar el signo de en medio
    g.style.left = (r.left + r.width / 2 < c.left + c.width / 2 ? Math.max(6, Math.min(r.left - c.left, c.width - w - 6))
      : Math.max(6, Math.min(r.right - c.left - w, c.width - w - 6))) + 'px';
    g.style.top = Math.max(6, r.top - c.top - h - 6) + 'px';
    requestAnimationFrame(function () { g.classList.add('ver'); });
    setTimeout(function () { g.classList.remove('ver'); setTimeout(function () { g.remove(); }, 300); }, 1600);
  }

  /* La escena de la entrada: va detrás del signo, dentro de su panel oscuro, y nunca lo tapa */
  // lluvia de la entrada: cuántas piezas, sus colores y, en las de texto, qué signo
  var LLUVIA = {
    nieve: { n: 40, z: [2, 7], col: ['#fff'] },
    petalos: { n: 30, z: [6, 11], col: ['#F07A1E', '#F9A51E', '#FFC23F', '#E8418C'] },
    confeti: { n: 38, z: [5, 9], col: ['#F07A1E', '#F2C066', '#5BD69A', '#7FB2EA', '#E8418C', '#fff'] },
    burbujas: { n: 18, z: [8, 22] },
    estrellas: { n: 34, z: [2, 4], col: ['#fff', '#FFE27A'] },
    notas: { n: 14, z: [16, 26], txt: ['\u266A', '\u266B', '\u2669'], col: ['#fff', '#F2C066', '#7FB2EA'] },
    corazones: { n: 16, z: [14, 24], txt: ['\u2665'], col: ['#E8418C', '#F29BC4', '#F07A1E'] },
    numeros: { n: 18, z: [14, 24], txt: ['3', '1', '4', '1', '5', '9', '2', '6', '$', '%'], col: ['#fff', '#F2C066', '#7FB2EA'] }
  };
  function lluvia(caja, tipo) {
    var c = LLUVIA[tipo]; if (!c) return;
    for (var n = 0; n < c.n; n++) {
      var s = document.createElement('i'), z = c.z[0] + Math.random() * (c.z[1] - c.z[0]), col = c.col ? c.col[n % c.col.length] : '';
      s.className = 'pt-ll-' + tipo;
      var st = 'left:' + (Math.random() * 100).toFixed(1) + '%;opacity:' + (.45 + Math.random() * .55).toFixed(2)
        + ';animation-duration:' + (5 + Math.random() * 7).toFixed(1) + 's;animation-delay:' + (-Math.random() * 10).toFixed(1) + 's';
      if (c.txt) { s.textContent = c.txt[n % c.txt.length]; st += ';font-size:' + z.toFixed(0) + 'px;color:' + col; }
      else {
        st += ';width:' + z.toFixed(1) + 'px;height:' + (tipo === 'confeti' ? z * 1.6 : tipo === 'petalos' ? z * 1.25 : z).toFixed(1) + 'px';
        if (col) st += ';background:' + col;
        if (tipo === 'estrellas') st += ';top:' + (Math.random() * 70).toFixed(1) + '%;animation-duration:' + (.8 + Math.random() * 1.6).toFixed(1) + 's';
      }
      s.style.cssText = st;
      caja.appendChild(s);
    }
  }
  function escena(panel, x) {
    var k = x.k, lista = ESCENAS[k]; if (!lista || panel.querySelector('.pt-escena')) return;
    if (getComputedStyle(panel).position === 'static') panel.style.position = 'relative';
    panel.style.overflow = 'hidden';
    for (var i = 0; i < panel.children.length; i++) { var h = panel.children[i]; if (getComputedStyle(h).position === 'static') { h.style.position = 'relative'; h.style.zIndex = '1'; } }
    var e = document.createElement('div'); e.className = 'pt-escena'; e.setAttribute('aria-hidden', 'true');
    e.innerHTML = lista.map(function (x, i) { return '<div class="' + x[0] + '" style="' + x[2] + '" data-i="' + i + '">' + x[1] + '</div>'; }).join('');
    panel.insertBefore(e, panel.firstChild);
    e.querySelectorAll('svg').forEach(function (g) { fija(g); });
    e.querySelectorAll('.pt-lluvia').forEach(function (l) { lluvia(l, (l.className.match(/\bll-(\w+)/) || [])[1]); });
    e.addEventListener('click', function (ev) {
      var p = ev.target.closest('.pt-p'); if (!p) return;
      var d = lista[+p.getAttribute('data-i')];
      reacciona(p, d[4]); if (d[3]) globo(panel, p, d[3], d[3] === x.n ? fecha(x) : x.n + ' · ' + fecha(x));
    });
  }
  /* Dentro del portal: dos adornos chicos a la derecha, junto a la campanita (.pu-par la pone js/portal.js) */
  function chicos(x) {
    var dibujos = CHICOS[x.k]; if (!dibujos) return;
    var intentos = 0;
    (function busca() {
      var par = document.querySelector('.pu-par');
      if (!par) { if (++intentos < 60) setTimeout(busca, 250); return; }
      if (par.querySelector('.pt-chicos')) return;
      var c = document.createElement('span'); c.className = 'pt-chicos';
      c.innerHTML = dibujos.map(function (d) { return '<button type="button" tabindex="-1" aria-hidden="true">' + d + '</button>'; }).join('');
      c.addEventListener('click', function (ev) { var b = ev.target.closest('button'); if (b) { reacciona(b, 'pt-brinca'); felicita(b, x); } });
      par.insertBefore(c, par.firstChild);
    })();
  }

  /* Junto al signo de un menú: el adorno de la temporada a un lado, sin taparlo ni cambiarlo. La arañita cuelga de
     un hilo que sale de la orilla de arriba del encabezado (o del menú ☰), mida lo que mida en cada pantalla. */
  // el globito de adentro: la felicitación y el día, debajo del adorno; se va solo
  function felicita(el, x) {
    var viejo = document.querySelector('.ptc-globo'); if (viejo) viejo.remove();
    var g = document.createElement('div'); g.className = 'ptc-globo'; g.setAttribute('role', 'status');
    var b = document.createElement('b'), s = document.createElement('span');
    b.textContent = x.n; s.textContent = fecha(x); g.appendChild(b); g.appendChild(s);
    document.body.appendChild(g);
    var r = el.getBoundingClientRect(), w = g.offsetWidth, vw = document.documentElement.clientWidth || innerWidth;
    g.style.left = Math.round(Math.max(8, Math.min(r.left + r.width / 2 - w / 2, vw - w - 8))) + 'px';
    // debajo de la barra del signo (encabezado o ☰), para no tapar el signo
    var barra = el.closest('header, .band, .pm-cab, nav'), abajo = Math.max(r.bottom, barra ? barra.getBoundingClientRect().bottom : 0);
    g.style.top = Math.round(Math.min(abajo + 6, (innerHeight || 600) - g.offsetHeight - 8)) + 'px';
    requestAnimationFrame(function () { g.classList.add('ver'); });
    clearTimeout(felicita.t);
    felicita.t = setTimeout(function () { g.classList.remove('ver'); setTimeout(function () { g.remove(); }, 250); }, 2800);
  }
  function junto(img, x, oscuro) {
    var k = x.k, cual = JUNTO[k];
    if (!cual || !img || !img.parentNode || img.parentNode.classList.contains('ptc-caja')) return;
    var caja = document.createElement('span'); caja.className = 'ptc-caja' + (oscuro ? ' ptc-oscuro' : '');
    img.parentNode.insertBefore(caja, img); caja.appendChild(img);
    var a = document.createElement('span'); a.className = 'ptc-adorno ptc-' + cual + (cual === k ? ' ptc-gen' : '');
    a.setAttribute('aria-hidden', 'true'); a.title = x.n + ' · ' + fecha(x);
    // picar el adorno dice qué día es (no lleva al Inicio: eso lo hace el signo; js/portal.js lo respeta)
    a.addEventListener('click', function (ev) { ev.preventDefault(); felicita(a, x); });
    a.innerHTML = cual === 'arana' ? '<span class="ptc-hilo"></span><span class="ptc-cae">' + JUNTO_SVG.arana + '</span>' : JUNTO_SVG[cual];
    a.style.width = JUNTO_ANCHO[cual] + 'px';
    fija(a.querySelector('svg'), JUNTO_ANCHO[cual]);
    caja.appendChild(a);
    if (cual !== 'arana') return;
    var ref = caja.closest('header,nav') || caja.parentNode;
    var mide = function () {
      // el hilo sale de abajo de la hora y la batería: desde el 30-oct-2026 el encabezado trae ese espacio arriba (pantallas.css)
      var d = caja.getBoundingClientRect().top - ref.getBoundingClientRect().top - (parseFloat(getComputedStyle(ref).paddingTop) || 0);
      caja.style.setProperty('--ptc-d', Math.max(0, Math.round(d)) + 'px');
    };
    mide();
    window.addEventListener('resize', mide);
    if (window.ResizeObserver) new ResizeObserver(mide).observe(ref);
  }

  // grande: el signo de la entrada (la escena va en su panel). Si no: las vistas, con el adorno junto al signo del
  // encabezado y del menú ☰ (.pm-cab, js/menu.js) y los dos adornos chicos a la derecha.
  function pon(logo, opc) {
    opc = opc || {};
    var x = actual(hoyMty());
    if (!x) return null;
    ponCss();
    if (opc.grande) { var panel = logo && (logo.closest('.lado') || logo.parentNode); if (panel) escena(panel, x); }
    else {
      chicos(x);
      junto(logo, x, false);
      var cab = document.querySelector('.pm-cab img');
      if (cab) junto(cab, x, true);
    }
    return x.k;
  }
  // en(a, m, d): qué fecha sale ese día (para el calendario de animaciones)
  window.PROFASE_TEMPORADA = { actual: function () { return actual(hoyMty()); }, en: function (a, m, d) { return actual([a, m, d]); }, pon: pon, lista: TEMPORADAS, fecha: fecha };
})();
