/* Portal PROFASE · adornos de temporada (regla de Daniel, 29-oct-2026; escenas animadas: propuesta de Gabriel, 29-oct-2026).
   El signo PROFASE es siempre el logo oficial, con sus colores: nunca se redibuja, ni se tapa, ni se pinta de otro color.
   Daniel: «la idea es que siempre sea el logo de siempre; pero sí se puede poner una arañita cayendo porque es
   Halloween, un Santa Claus porque es Navidad… pero el logo con el azul y tonos y colores, nunca».
   - En la entrada (index.html) va la escena completa alrededor del signo, sin taparlo, y es interactiva: al picar un
     adorno brinca, gira o suena y dice algo («¡Buuu!», «¡Jo, jo, jo!», «¡Viva México!»).
     · Halloween y Día de Muertos: telarañas, arañas que suben y bajan, calabazas que brillan y esqueletos bailando.
     · Navidad y Año Nuevo: nieve, esferas que se mecen, el pino con foquitos y un Santa que se ríe.
     · Fiestas patrias: papel picado, cohetes, la bandera ondeando y un personaje con sombrero y camisa bordada que brinda.
     · Amor y amistad: corazones que suben.
   - Ya dentro (las tres vistas, js/menu.js) solo van dos adornos chicos arriba a la derecha, junto a la campanita;
     están quietos y solo brincan si se pican.
   - Con «reducir movimiento» del dispositivo, todo se queda quieto.
   ?temporada=navidad en la dirección deja ver otra temporada para revisarla (amor, patrias, muertos o navidad). */
(function () {
  'use strict';
  var TEMPORADAS = [
    { k: 'amor', de: [2, 7], a: [2, 14] },
    { k: 'patrias', de: [9, 1], a: [9, 16] },
    { k: 'muertos', de: [10, 15], a: [11, 2] },
    { k: 'navidad', de: [12, 1], a: [1, 6] }
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
  var PICADO = function () {
    var cs = ['#006847', '#fff', '#CE1126'], h = '';
    for (var i = 0; i < 8; i++) h += '<path d="M' + (10 + i * 75) + ' 4h62v40l-7-5-8 5-8-5-8 5-8-5-8 5-8-5-7 5z" fill="' + cs[i % 3] + '"/>';
    return '<svg viewBox="0 0 600 50" preserveAspectRatio="none"><line x1="0" y1="4" x2="600" y2="4" stroke="#cfd6e3" stroke-width="1.2"/>' + h + '</svg>';
  };
  var COHETE = function (c) { return '<svg viewBox="0 0 60 60"><g stroke="' + c + '" stroke-width="2" stroke-linecap="round"><path d="M30 30 30 4M30 30 52 14M30 30 56 34M30 30 44 54M30 30 16 54M30 30 4 34M30 30 8 14"/></g></svg>'; };
  var CORAZON = function (c) { return '<svg viewBox="0 0 16 16"><path d="M8 14.2S1.4 10.1 1.4 5.6A3.5 3.5 0 0 1 8 4a3.5 3.5 0 0 1 6.6 1.6C14.6 10.1 8 14.2 8 14.2z" fill="' + (c || '#D6336C') + '"/></svg>'; };
  var SOMBRERO = '<svg viewBox="0 0 130 60"><ellipse cx="65" cy="44" rx="60" ry="12" fill="#C9A75A"/><path d="M40 44c2-30 48-30 50 0z" fill="#B88F3F"/><path d="M42 36h46" stroke="#CE1126" stroke-width="5"/></svg>';
  var BANDERITA = '<svg viewBox="0 0 40 34"><rect x="2" y="2" width="3" height="32" fill="#C9D1DE"/><path d="M5 4h11v18H5z" fill="#006847"/><path d="M16 4h11v18H16z" fill="#fff"/><path d="M27 4h11v18H27z" fill="#CE1126"/><circle cx="21.5" cy="13" r="2.6" fill="#8C6A3D"/></svg>';

  /* ---------- la escena de la entrada: [clase, dibujo, estilo, qué dice al picarlo, cómo reacciona] ---------- */
  var ESCENAS = {
    muertos: [
      ['pt-telar', TELARANA, 'left:-8px;top:-8px;width:150px'],
      ['pt-telar', TELARANA, 'right:-8px;top:-8px;width:150px;transform:scaleX(-1)'],
      ['pt-p pt-arana', ARANA(120), 'left:22%;top:0;width:34px', '¡Hola!'],
      ['pt-p pt-arana pt-lenta', ARANA(160), 'right:18%;top:0;width:26px', '¡Aquí estoy!'],
      ['pt-p pt-calabaza', CALABAZA('#E8730F', '#F58A1F', CARA1), 'left:7%;bottom:22px;width:92px', '¡Buuu!', 'pt-brinca'],
      ['pt-p pt-calabaza pt-m-no', CALABAZA('#D9650C', '#EE7F18', CARA2), 'left:29%;bottom:18px;width:62px', '¡Muajaja!', 'pt-brinca'],
      ['pt-p pt-esq', ESQUELETO, 'right:9%;bottom:20px;width:62px;height:100px', '¡A bailar!', 'pt-gira'],
      ['pt-p pt-esq pt-tarde pt-m-no', ESQUELETO, 'right:29%;bottom:14px;width:48px;height:80px', '¡Uy, qué miedo!', 'pt-gira']],
    navidad: [
      ['pt-nieve', '', 'inset:0'],
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
    muertos: [CALABAZA('#E8730F', '#F58A1F', CARA1), ARANA(40)],
    navidad: [ESFERA(34, '#C8102E', '#fff'), PINO],
    patrias: [BANDERITA, SOMBRERO],
    amor: [CORAZON(), CORAZON('#F07A1E')]
  };

  var CSS = '.pt-escena{position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden}'
    + '.pt-escena>*{position:absolute}.pt-escena svg{display:block;width:100%;height:auto;overflow:visible}'
    + '.pt-escena .pt-p{pointer-events:auto;cursor:pointer;-webkit-tap-highlight-color:transparent}'
    + '.pt-escena .pt-telar{opacity:.55}'
    + '.pt-globo{position:absolute;z-index:3;background:#fff;color:#1A2333;font:800 13px/1.2 Arial,sans-serif;padding:6px 10px;border-radius:12px;white-space:nowrap;'
    + 'opacity:0;transform:translateY(6px) scale(.9);transition:opacity .25s,transform .25s;pointer-events:none;box-shadow:0 6px 18px rgba(0,0,0,.3)}'
    + '.pt-globo.ver{opacity:1;transform:none}'
    + '.pt-arana{transform-origin:50% 0;animation:pt-baja 3.2s ease-in-out infinite alternate}.pt-arana.pt-lenta{animation-delay:-1.4s}'
    + '.pt-arana:hover{animation-duration:.9s}@keyframes pt-baja{from{transform:translateY(-10px)}to{transform:translateY(18px)}}'
    + '.pt-luz{animation:pt-flama 1.4s ease-in-out infinite alternate}@keyframes pt-flama{from{opacity:.65}to{opacity:1}}'
    + '.pt-esq{transform-origin:50% 100%;animation:pt-baila 1.1s ease-in-out infinite alternate}.pt-esq.pt-tarde{animation-delay:-.5s}'
    + '.pt-bi{transform-origin:20px 30px;animation:pt-b1 .55s ease-in-out infinite alternate}.pt-bd{transform-origin:40px 30px;animation:pt-b2 .55s ease-in-out infinite alternate}'
    + '.pt-pi{transform-origin:24px 62px;animation:pt-p1 .55s ease-in-out infinite alternate}.pt-pd{transform-origin:36px 62px;animation:pt-p2 .55s ease-in-out infinite alternate}'
    + '@keyframes pt-baila{from{transform:rotate(-6deg)}to{transform:rotate(6deg) translateY(-6px)}}'
    + '@keyframes pt-b1{from{transform:rotate(-50deg)}to{transform:rotate(40deg)}}@keyframes pt-b2{from{transform:rotate(50deg)}to{transform:rotate(-40deg)}}'
    + '@keyframes pt-p1{from{transform:rotate(-18deg)}to{transform:rotate(14deg)}}@keyframes pt-p2{from{transform:rotate(18deg)}to{transform:rotate(-14deg)}}'
    + '.pt-nieve i{position:absolute;top:-10px;border-radius:50%;background:#fff;animation:pt-cae linear infinite}@keyframes pt-cae{to{transform:translateY(720px) translateX(30px)}}'
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
    + '@media (max-width:600px){.pt-chicos button:last-child{display:none}.pt-chicos button{width:24px;height:24px}}'
    + '@media (prefers-reduced-motion:reduce){.pt-escena *,.pt-chicos *{animation:none!important}.pt-nieve{display:none}}';
  function ponCss() {
    if (document.getElementById('pt-css')) return;
    var st = document.createElement('style'); st.id = 'pt-css'; st.textContent = CSS; (document.head || document.documentElement).appendChild(st);
  }
  function reacciona(el, clase) {
    if (!clase) return;
    el.classList.remove(clase); void el.getBoundingClientRect(); el.classList.add(clase);
    setTimeout(function () { el.classList.remove(clase); }, 950);
  }
  function globo(caja, el, txt) {
    var g = document.createElement('div'); g.className = 'pt-globo'; g.textContent = txt; g.setAttribute('aria-hidden', 'true');
    var r = el.getBoundingClientRect(), c = caja.getBoundingClientRect();
    g.style.left = Math.max(6, Math.min(r.left - c.left, c.width - 150)) + 'px';
    g.style.top = Math.max(6, r.top - c.top - 34) + 'px';
    caja.appendChild(g);
    requestAnimationFrame(function () { g.classList.add('ver'); });
    setTimeout(function () { g.classList.remove('ver'); setTimeout(function () { g.remove(); }, 300); }, 1600);
  }

  /* La escena de la entrada: va detrás del signo, dentro de su panel oscuro, y nunca lo tapa */
  function escena(panel, k) {
    var lista = ESCENAS[k]; if (!lista || panel.querySelector('.pt-escena')) return;
    if (getComputedStyle(panel).position === 'static') panel.style.position = 'relative';
    panel.style.overflow = 'hidden';
    for (var i = 0; i < panel.children.length; i++) { var h = panel.children[i]; if (getComputedStyle(h).position === 'static') { h.style.position = 'relative'; h.style.zIndex = '1'; } }
    var e = document.createElement('div'); e.className = 'pt-escena'; e.setAttribute('aria-hidden', 'true');
    e.innerHTML = lista.map(function (x, i) { return '<div class="' + x[0] + '" style="' + x[2] + '" data-i="' + i + '">' + x[1] + '</div>'; }).join('');
    panel.insertBefore(e, panel.firstChild);
    var nieve = e.querySelector('.pt-nieve');
    if (nieve) for (var n = 0; n < 40; n++) {
      var s = document.createElement('i'), z = 2 + Math.random() * 5;
      s.style.cssText = 'left:' + (Math.random() * 100) + '%;width:' + z + 'px;height:' + z + 'px;opacity:' + (.4 + Math.random() * .6)
        + ';animation-duration:' + (5 + Math.random() * 7) + 's;animation-delay:' + (-Math.random() * 10) + 's';
      nieve.appendChild(s);
    }
    e.addEventListener('click', function (ev) {
      var p = ev.target.closest('.pt-p'); if (!p) return;
      var x = lista[+p.getAttribute('data-i')];
      reacciona(p, x[4]); if (x[3]) globo(panel, p, x[3]);
    });
  }
  /* Dentro del portal: dos adornos chicos a la derecha, junto a la campanita (.pu-par la pone js/portal.js) */
  function chicos(k) {
    var dibujos = CHICOS[k]; if (!dibujos) return;
    var intentos = 0;
    (function busca() {
      var par = document.querySelector('.pu-par');
      if (!par) { if (++intentos < 60) setTimeout(busca, 250); return; }
      if (par.querySelector('.pt-chicos')) return;
      var c = document.createElement('span'); c.className = 'pt-chicos';
      c.innerHTML = dibujos.map(function (d) { return '<button type="button" tabindex="-1" aria-hidden="true">' + d + '</button>'; }).join('');
      c.addEventListener('click', function (ev) { var b = ev.target.closest('button'); if (b) reacciona(b, 'pt-brinca'); });
      par.insertBefore(c, par.firstChild);
    })();
  }

  // grande: el signo de la entrada (la escena va en su panel). Si no: las vistas, con los dos adornos chicos a la derecha.
  function pon(logo, opc) {
    opc = opc || {};
    var x = actual(new Date());
    if (!x) return null;
    ponCss();
    if (opc.grande) { var panel = logo && (logo.closest('.lado') || logo.parentNode); if (panel) escena(panel, x.k); }
    else chicos(x.k);
    return x.k;
  }
  window.PROFASE_TEMPORADA = { actual: function () { return actual(new Date()); }, pon: pon };
})();
