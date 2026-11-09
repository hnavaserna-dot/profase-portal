/* Portal PROFASE · menú lateral con módulos y sub módulos (pedido de Fernando Cadengo, 29-oct-2026).
   Va en las tres vistas (director, gerentes, contadores). No cambia cómo funciona cada pestaña: las pestañas siguen
   siendo los botones de siempre (.vsw), que aquí se esconden; el menú solo los pica. Por eso cada quien ve en el
   menú exactamente lo que ya veía: un sub módulo aparece solo si su botón está a la vista (lo deciden la página y
   la base) y si la base no dice que no le toca (menu_sin(), 134_menu_lo_tuyo.sql: «solo les salga menús si tienen algo
   que hacer», Daniel, 2-nov-2026), y un módulo sin sub módulos no se pinta.
   - Computadora: el menú se encoge a una tira de íconos («Ocultar menú» o ☰); al pasar el mouse por un ícono
     salen sus sub módulos. Se recuerda en el navegador de cada quien.
   - Celular (900 px o menos): el menú se esconde completo y ☰ lo abre encima de la página.
   - La dirección de la página lleva la sección (#panel, #cartera…): al recargar se queda donde estaba.
   - Un solo menú, el de la izquierda (Héctor Daniel, 2-nov-2026, 14:25: «quiero quitar la opción del menú arriba…
     el menú de arriba los que lo tenga, quitaselos y oblígalos a actualizar para que solo usen el menú lateral»). El
     «Menú arriba» (tira de íconos arriba al centro, propuesta de Gabriel del 29-oct-2026) se quitó: ya no hay botón
     para escogerlo y quien lo tenía (guardado en su navegador, o el celular que arrancaba con él) pasa solo al menú de
     la izquierda (☰ en el celular). A esas personas les sale una vez un recorrido corto (portal/menu_rec_tab.js, con
     la marca «portal.menu.venia_arriba» que deja quitaArriba(), abajo). No lo regreses sin que Daniel lo diga
     (construir.py, exige_sin_menu_arriba()).
   - El signo PROFASE es siempre el logo oficial, con sus colores (regla de Daniel, 29-oct-2026). En temporadas se le
     pone al lado un adorno aparte (js/temporada.js: arañita en Halloween y Día de Muertos, Santa en Navidad, corazón el
     14 de febrero, banderita en las fiestas patrias) que nunca tapa ni cambia el signo. Esto reemplazó el «signo de temporada» de un
     solo color de la propuesta #3; el menú de arriba de esa propuesta se quedó igual.
   - Picar el signo PROFASE (el del encabezado o el del ☰, con su adorno de temporada) lleva al Inicio, en celular,
     iPad y computadora (Daniel, 31-oct-2026: «si desde ahí le pico al logo de profase; me mandes a home»). Lo reparte
     js/portal.js (P.alInicio, P.signoInicio); aquí, PORTAL_MENU.alInicio().
   - Riel de íconos (29-oct-2026, propuesta de Gabriel): en computadora el menú arranca como una tira de íconos grandes
     con su nombre corto e «Inicio» arriba; al picar o pasar el mouse sale la tarjeta del módulo, como en el celular
     (qué es y cada opción con su explicación). En el celular, el menú se abre con ☰. Cada quien puede abrir el riel
     al menú completo («Mostrar menú» / «Ocultar menú») y su navegador lo recuerda.
   - Submenús siempre completos (pedido de Daniel, 30-oct-2026: «no alcanzo a ver todo el sub menú … siempre se tiene
     que ver bien»): la tarjeta de cada módulo (en el riel) sale junto a su ícono y, si no cabe
     hacia abajo, sube lo necesario; si es más alta que la pantalla, sus opciones se deslizan dentro de la tarjeta con
     el título fijo arriba. El riel y el menú se deslizan solos si la pantalla es baja. Los módulos no llevan el
     globito del navegador («title»), que tapaba la tarjeta, y el menú abierto queda encima de los avisos flotantes.
     La prueba es herramientas/pruebas/pantallas/prueba_submenus.py (profase-datos). */
(function () {
  'use strict';
  var ROL = document.documentElement.getAttribute('data-rol') || '';
  if (['director', 'gerente', 'contador'].indexOf(ROL) < 0 || window.top !== window.self) return;

  var IC = {
    wf: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17"/>',
    rep: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    agd: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/><path d="m9 15 2 2 4-4"/>',   // Agenda: calendario con palomita
    adm: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
    quo: '<circle cx="11.5" cy="11.5" r="7.5"/><path d="m16.5 16.5 4 4"/>',
    ayuda: '<path d="M12 3.5l1.8 4.9 4.9 1.8-4.9 1.8L12 16.9l-1.8-4.9-4.9-1.8 4.9-1.8z"/><path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/><path d="M5.5 2.8l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5z"/>',   // destellos: la IA del portal
    access: '<ellipse cx="12" cy="5.5" rx="8" ry="2.8"/><path d="M4 5.5v13c0 1.5 3.6 2.8 8 2.8s8-1.3 8-2.8v-13M4 12c0 1.5 3.6 2.8 8 2.8s8-1.3 8-2.8"/>',
    clis: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><circle cx="9" cy="11" r="2.6"/><path d="M5.6 16.5c.6-1.6 1.9-2.5 3.4-2.5s2.8.9 3.4 2.5M14.5 9.5h4M14.5 13h3"/>',
    mas: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    msj: '<path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.1A8.5 8.5 0 1 1 21 12Z"/><path d="M8 10.5h8M8 14h5"/>',
    tes: '<rect x="2.5" y="6" width="19" height="13" rx="2"/><circle cx="12" cy="12.5" r="3"/><path d="M6 9.5h.01M18 15.5h.01M5 6l2.5-3h9L19 6"/>',
    usr: '<rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1.5"/>',
    mul: '<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/>',   // Multinacional: una caja (la comercializadora)
    cen: '<path d="M4 4.5h16v4H4z"/><path d="M5.5 8.5v11h13v-11"/><path d="M10 12.5h4"/><path d="m9 16 2 2 4-4"/>',   // Centauro: la bóveda de XML (una caja de archivo con palomita)
    rh: '<circle cx="9" cy="7" r="3.5"/><path d="M2.5 20v-1.5A4.5 4.5 0 0 1 7 14h4a4.5 4.5 0 0 1 4.5 4.5V20"/><path d="M17 11h5M19.5 8.5v5"/>',
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>'
  };
  // k: lo que va en la dirección; v: el botón de la pestaña (data-view); q: la sub pestaña de QUO; p: la pestaña de una
  // pantalla en su marco (Q Chat: el botón de la vista dice la que está abierta con data-sub y la vista la abre con
  // window.PROFASE_SUB[v](p))
  var MODS = [
    /* Menú reacomodado el 31-oct-2026 (Héctor Daniel: «re acomoda el menú, pestañas y demás, para que esté todo donde debe
       de estar; cuida siempre los permisos»). Desde el lunes 2 ya no se usa el Access, así que el módulo «Access» se
       repartió donde va cada cosa: lo del cliente en «Clientes» (nuevo), las tareas y el historial de actividades en
       «Workflow» y las facturas del Access en «Tesorería». Las claves (k y v) no cambiaron, así que las ligas, el Inicio,
       los recorridos y los permisos siguen igual: el menú solo enseña lo que cada quien ya ve (lo deciden la página y la
       base). Orden: lo de todos los días primero. */
    /* Reacomodo del 1-nov-2026 (Héctor Daniel, 16:59: «a las 19 hagas un reacomodo de menús y sub menús, para que todo quede
       perfecto… para que todo esté en sintonía, fluido y excelente el lunes»; 17:05: «Sí, así»): lo de todos los días
       primero, en el mismo orden del recorrido general (Workflow, Agenda, Clientes, Chat, Tesorería, Reportes, RH,
       Administración, Usuarios, QUO y al final SuperConta, que también está en el «?» de arriba). Sale «Tareas y proyectos»
       (las tareas ya son Agenda › Pendientes y Recordatorios) y cuatro nombres dejan de repetirse: Tesorería › Préstamos
       por entregar y Reportes de cobranza, RH › Expedientes del personal y Usuarios › Personas del WorkFlow. Las claves
       no cambian: permisos, ligas, Inicio y recorridos siguen igual. */
    { k: 'wf', t: 'Workflow', d: 'El avance del trabajo de cada cliente y de cada contador.', subs: [
      { k: 'panel', v: 'wf', t: 'Panel', tc: 'Mi panel', d: 'Obligaciones, vencimientos y pausas.' },
      { k: 'workflow-trabajo', v: 'wft', t: 'Panel de trabajo', d: 'Cada actividad con su ficha: estatus, comentarios, documentos y autorización.' },   // etapa 2 del Access (29-oct-2026)
      { k: 'clientes', v: 'cli', t: 'Avance por cliente', d: 'Cada cliente y cómo va su trabajo.' },
      { k: 'comentarios', v: 'com', t: 'Comentarios', d: 'Ideas de cambio para las pantallas del Workflow.' },
      { k: 'workflow-config', v: 'wfc', t: 'Configuración', d: 'Catálogo de actividades, plantillas y las plantillas de cada cliente.' },   // las pantallas de configuración del Access (30-oct-2026, pedido de Fernando Cadengo)
      { k: 'access-wf', v: 'axwf', t: 'Historial del Access', d: 'Las actividades como quedaron en el Access: estatus, bitácora y documentos.' }] },   // antes Access › WorkFlow; al final (1-nov-2026)
    /* «Agenda» (Héctor Daniel, 1-nov-2026, 04:54: «Si dale ya», a la propuesta de un menú propio para lo personal de
       todos los días): el Calendario, los Recordatorios y las Notificaciones salieron de «Administración». Aquí van
       también los Pendientes del expediente de clientes cuando se publiquen. Las claves no cambiaron. */
    { k: 'agd', t: 'Agenda', d: 'Tu calendario, los eventos del despacho, tus recordatorios, tus pendientes y tus avisos de todos los días.', subs: [
      { k: 'calendario', v: 'cal', t: 'Calendario', d: 'Tu agenda: citas, fechas de entrega y límite, cumpleaños y eventos.' },   // cumpleaños, aniversarios y eventos: todos lo ven
      // Pendientes (31-oct-2026, pedido de Daniel; en «Agenda» desde el 1-nov, 04:54: «Si dale ya»): lo que hay que hacer, quién y
      // para cuándo, y las minutas que faltan de las reuniones con clientes (expedientes.html; 112_expedientes.sql; exp_tab.js)
      { k: 'pendientes', v: 'pen', t: 'Pendientes', d: 'Lo tuyo, lo que pediste y lo que revisas, con fecha y avisos; y las minutas que te faltan.' },
      { k: 'mis-recordatorios', v: 'rcd', t: 'Recordatorios', d: 'Para ti y tu equipo: de una vez o que se repiten.' },   // 31-oct-2026, pedido de Daniel (107_recordatorios_agenda.sql); todos lo tienen
      // Eventos PROFASE (Héctor Daniel, 1-nov-2026: sale de RH y va en Agenda): la posada y los festejos en lista y calendario para
      // todos; el Reporte, a quien la base deja (ev_estado(), 114_eventos_reporte.sql). calendario.html?vista=eventos; bloque cal_tab.js
      { k: 'eventos', v: 'evt', t: 'Eventos PROFASE', d: 'La posada y los festejos del despacho: confirma tu asistencia, en lista o en calendario.' },
      { k: 'notificaciones', v: 'ntf', t: 'Notificaciones', d: 'Avisos para ti y para todos.' }] },   // las de cada quien y las de todos (29-oct-2026, pedido de Daniel)
    // Clientes (31-oct-2026): la ficha de cada cliente y lo del SAT, juntos
    { k: 'clis', t: 'Clientes', d: 'El expediente y la ficha de cada cliente, sus claves del SAT, la renovación de e.firma y sellos y los avisos de su buzón tributario.', subs: [
      { k: 'expedientes', v: 'exp', t: 'Expedientes', d: 'Cada cliente por grupo y razón social: cómo vamos, pendientes, reuniones, notas y documentos en carpetas.' },   // 31-oct-2026, pedido de Daniel (112_expedientes.sql); 3-nov-2026, carpetas (188)
      { k: 'base-clientes', v: 'bcli', t: 'Base de clientes', d: 'La ficha de cada cliente: datos, contactos, servicios y precios.' },   // etapa 4 del Access (29-oct-2026); antes en Administración
      { k: 'access-clientes', v: 'axcli', t: 'Claves SAT y renovaciones', d: 'Contraseñas y archivos del SAT de tus clientes y la e.firma y sellos por vencer.' },   // antes Access › Clientes
      { k: 'buzon', v: 'bzt', t: 'Buzón tributario', d: 'Los avisos del SAT del buzón de cada cliente: quién lo tiene, en qué va y quién lo cerró.' }] },   // 3-nov-2026, pedido de Fernando Cadengo (195_buzon_tributario.sql)
    // Chat interno (30-oct-2026, pedido de Daniel): cada quien ve solo sus conversaciones
    { k: 'msj', t: 'Chat', d: 'Mensajes y archivos con el equipo, 1 a 1 y en grupos.', subs: [
      { k: 'chat', v: 'chat', t: 'Chat interno', d: 'Tus conversaciones; solo las ven quienes están en ellas.' },
      // Héctor Daniel, 1-nov-2026, 13:45 («Si»): un acceso a las videollamadas con clientes (las citas con videollamada de la
      // Agenda; una sola versión). Solo a la dirección y los gerentes (chat_sala_puedo(); el botón lo pone llamada_tab.js)
      { k: 'videollamada-cliente', v: 'vcl', t: 'Videollamada con cliente', d: 'Entra a las de hoy, copia la invitación o empieza una ahora.' }] },
    // Tesorería (30-oct-2026, decisiones de Daniel, 21:05 a 21:25: «una pestaña… que se llame Tesorería»; «todo a tesorería;
    // pero trata de usar los mismos submenús para todos»). Cada quien ve solo lo suyo (lo decide la base: fac_permiso(),
    // rec_permisos, veo_comisiones(), comisiones_direccion, tes_estado(); portal/sql/79_tesoreria.sql)
    { k: 'tes', t: 'Tesorería', d: 'Facturas, pagos, cobranza, comisiones y préstamos.', subs: [
      { k: 'facturacion', v: 'fac', t: 'Facturación', d: 'Alta y control de facturas.' },   // etapa 5 del Access (29-oct-2026)
      { k: 'pagos', v: 'pag', t: 'Pagos', d: 'Pagos de los clientes y su reparto a facturas.' },   // etapa 5 del Access (29-oct-2026)
      { k: 'cobranza', v: 'cxc', t: 'Cobranza', d: 'Lo que falta por cobrar, por grupo.' },
      { k: 'recordatorios', v: 'rec', t: 'Recordatorios de pago', d: 'Recordatorios de saldos a los clientes.' },   // etapa 5 del Access (29-oct-2026)
      { k: 'access-comisiones', v: 'axcom', t: 'Comisiones', d: 'Las comisiones del periodo según lo cobrado.' },   // antes en Access
      { k: 'comisiones-direccion', v: 'cdir', t: 'Comisiones de dirección', d: 'Facturas con comisión, gastos, reserva y utilidad del periodo.' },   // solo quien Daniel decidió
      { k: 'tes-prestamos', v: 'tpre', t: 'Préstamos por entregar', d: 'Préstamos al personal ya autorizados, por entregar.' },   // Dora y la dirección
      { k: 'tes-reportes', v: 'trep', t: 'Reportes de cobranza', d: 'Cobranza por cliente y facturas del periodo.' },
      { k: 'tes-estado-cuenta', v: 'tbc', t: 'Estado de cuenta bancario', d: 'El Excel de saldos de Tesorería y la revisión de los depósitos.' },   // solo la dirección y Eva (Daniel, 2-nov-2026)
      { k: 'tes-tdc', v: 'tdc', t: 'TDC DECOMSA', d: 'Los cargos de la tarjeta de crédito de DECOMSA y a quién va cada gasto.' },   // la dirección, Eva y Dora (Héctor Daniel Nava, 4-nov-2026; 248)
      { k: 'access-facturas', v: 'axfac', t: 'Facturas del Access', d: 'Facturas, pagos y recordatorios como quedaron en el Access, para consultar.' }] },   // antes Access › Facturas
    { k: 'rep', t: 'Reportes', d: 'Los reportes para revisar los números del despacho.', subs: [
      { k: 'cartera', v: 'car', t: 'Depuración de CxC / CxP', d: 'Saldos por cobrar y por pagar de los clientes, según su Quo (antes «Cartera»).' },
      { k: 'variaciones', v: 'var', t: 'Variaciones / Movimientos', d: 'Variaciones contables mes a mes (antes «Variaciones»).' },
      { k: 'activofijo', v: 'af', t: 'Reclasificación de activo fijo', d: 'Compras y ventas de activo fijo mal registradas y su corrección (antes «Activo fijo»).' },
      // Carga de Quo (2-nov-2026, pedido de Fernando Cadengo): el control de lo que se carga de Quo; la base decide quién (qc_yo, 171)
      { k: 'quo-carga', v: 'qcar', t: 'Carga de Quo', d: 'Qué se cargó de Quo, cliente por cliente y mes por mes, si cuadra y qué hay que atender.' }] },
    // Centauro (3-nov-2026, Héctor Daniel: «crea un nuevo menú en CRM llamado Centauro donde vayamos a correr esto»): lo de los
    // programas de la bóveda de XML de la oficina, hecho en el CRM. Por el momento lo ven Héctor Daniel Nava, Héctor Nava Ramos
    // (solo consulta), Fernando Gutiérrez y Fernando Cadengo (cen_estado(), portal/sql/198_centauro.sql; bloque cen_tab.js)
    { k: 'cen', t: 'Centauro', d: 'Los XML de cada cliente tal cual los entrega el SAT, las canceladas contra QUO, la lista 69-B y sus reportes.', subs: [
      { k: 'centauro-semaforo', v: 'cenx', t: 'Semáforo', d: 'Cada cliente mes por mes: lo que hay que corregir (rojo) y revisar (amarillo).' },
      { k: 'centauro-riesgos', v: 'cenf', t: 'Riesgos fiscales', d: 'Lo que encontró la revisión fiscal de las declaraciones, de todos los clientes en una sola lista.' },
      { k: 'centauro-declaraciones', v: 'cend', t: 'Declaraciones', d: 'Las declaraciones de cada cliente que el robot baja del portal del SAT, con su acuse.' },
      // 317 (6-nov-2026; Héctor Daniel: «dale luz verde»): cómo van en el SAT los trámites de devolución y si cuadran con el WorkFlow
      { k: 'centauro-devoluciones', v: 'cenv', t: 'Devoluciones', d: 'Cómo van en el SAT las devoluciones de cada cliente y si cuadran con el WorkFlow.' },
      { k: 'centauro-boveda', v: 'cenb', t: 'Bóveda XML', d: 'Los XML de cada cliente: búscalos, velos y bájalos tal cual.' },
      { k: 'centauro-canceladas', v: 'cenc', t: 'Canceladas SAT vs QUO', d: 'Lo cancelado en el SAT que sigue activo en QUO, por cliente.' },
      { k: 'centauro-69b', v: 'cen9', t: 'Lista 69-B', d: 'Los proveedores de cada cliente en la lista 69-B del SAT.' },
      { k: 'centauro-ficha', v: 'cens', t: 'Ficha contra el SAT', d: 'La constancia de situación fiscal de cada cliente contra su ficha: qué se corrigió y qué revisar.' },
      // 331 (9-nov-2026; petición de Frank, Héctor Daniel: «Sí, así es.»): la e.firma y los sellos de cada cliente contra el SAT
      { k: 'centauro-certificados', v: 'cent', t: 'Certificados', d: 'La e.firma y los sellos de cada cliente contra el SAT: estatus, vencimiento y si coinciden con la ficha.' },
      { k: 'centauro-reportes', v: 'cenr', t: 'Reportes', d: 'Lo que sale de los XML: resumen por mes, XML Datos 4.0, Nómina 1.2, método de pago, tablero anual y pagos.' }] },
    // RH (30-oct-2026, pedido de Daniel; lo propuso Alex Luna): solo Alex Luna, HNR y Daniel (y Colaboradores, quien
    // los captura); quién ve cada opción lo decide la base (rh_estado(), portal/sql/72_rh.sql; bloque rh_tab.js)
    // 1-nov-2026 (pedido de Daniel; 115_rh_solicitudes.sql): RH le aparece a todos, cada quien con lo suyo: Mis solicitudes
    // (todos menos la dirección), Por autorizar (los gerentes) y Solicitudes (RH: Alex, HNR y Daniel)
    { k: 'rh', t: 'RH', d: 'Recursos humanos: tus solicitudes y, para RH, vacaciones, préstamos, colaboradores, altas y bajas.', subs: [
      { k: 'mis-solicitudes', v: 'rhs', t: 'Mis solicitudes', d: 'Pide vacaciones, permisos, incapacidad o un préstamo, y mira cómo va.' },
      { k: 'por-autorizar', v: 'rha', t: 'Por autorizar', d: 'Lo que pide tu equipo: decide con un motivo de la lista.' },
      { k: 'solicitudes-rh', v: 'rhb', t: 'Solicitudes', d: 'Todo lo que pide el equipo: decidir, en camino y por platicar.' },
      // Coberturas (1-nov-2026, Parte 165; 117_cobertura_ausencias.sql): el plan de cobertura de las ausencias; lo ven los
      // gerentes, RH y la dirección, y quien se va o cubre, lo suyo (cob_estado())
      { k: 'coberturas', v: 'rhk', t: 'Coberturas', d: 'Quién cubre lo que vence mientras alguien de tu equipo está fuera.' },
      { k: 'rh-vacaciones', v: 'rhv', t: 'Vacaciones y permisos', d: 'Quién está fuera y cuántos días le quedan a cada quien.' },
      { k: 'rh-prestamos', v: 'rhp', t: 'Préstamos', d: 'Préstamos al personal, su autorización y sus descuentos.' },
      { k: 'rh-colaboradores', v: 'rhc', t: 'Colaboradores', d: 'Cumpleaños, ingreso y área de cada colaborador.' },
      { k: 'rh-altas', v: 'rhm', t: 'Altas y bajas', d: 'Ingresos y salidas del personal.' },
      { k: 'rh-expedientes', v: 'rhx', t: 'Expedientes del personal', d: 'Los documentos de cada colaborador: INE, domicilio, acta y lo demás.' }] },
    { k: 'adm', t: 'Administración', d: 'Lo del despacho: caja chica, cotizadores, el IMPI, los costos de los sistemas y cambios al portal.', subs: [
      { k: 'cajachica', v: 'caja', t: 'Caja chica', d: 'Gastos menores y sus comprobantes.' },
      { k: 'cotizador', v: 'cot', t: 'Cotizador DECOMSA', d: 'Cotizaciones de DECOMSA.' },
      { k: 'cotizador-profase', v: 'cpf', t: 'Cotizador PROFASE', d: 'Cotizaciones con la marca PROFASE: e.firma y sellos.' },   // solo la dirección (30-oct-2026; 80_cotizar_renovaciones.sql)
      // Campañas Facebook (Héctor Daniel, 3-nov-2026: «en administración, campañas facebook… que nadamás me salga a mi»):
      // autoriza las campañas de la página Profase Fiscal; solo él (fb_estado(), 190_campanas_facebook.sql; bloque fbk_tab.js)
      { k: 'campanas-facebook', v: 'fbk', t: 'Campañas Facebook', d: 'Las publicaciones de la página de Facebook: autoriza, pide cambios o no las publiques.' },
      // IMPI (Héctor Daniel, 3-nov-2026, 17:15: «podemos subir lo del IMPI a CRM? Administración - IMPI?»; «Solo tú y HNR
      // (lector)»): el control de las notificaciones de su cuenta PASE (impi_estado(), 204_impi.sql; bloque impi_tab.js)
      { k: 'impi', v: 'imp', t: 'IMPI', d: 'Las notificaciones del IMPI: cada oficio, qué pide y su fecha límite para contestar.' },
      // Costos de sistemas (Héctor Daniel Nava, 6-nov-2026: «para saber cuánto he gastado y cuánto se ha consumido, al día, en
      // cada sistema»; «Lo ven solo daniel.nava y hnava»): cos_estado(), 304_costos_sistemas.sql; bloque cos_tab.js
      { k: 'costos-sistemas', v: 'cos', t: 'Costos de sistemas', d: 'Cuánto se gasta y se consume en cada sistema de PROFASE: CRM, Quo Contabilita y Quo Facturita.' },
      { k: 'cambios', v: 'chg', t: 'Cambios al portal', d: 'Propuestas de cambios y su autorización.' }] },   // propuestas de Gabo; las autorizan Daniel o Fernando Cadengo
    // Usuarios (30-oct-2026, decisiones de Daniel, 18:44 a 20:50): quién entra al portal y la bitácora de Accesos.
    // Daniel y Fernando Cadengo dan altas, bajas y códigos; HNR solo ve; Cadengo ve Accesos sin lo de la dirección
    // (usr_estado(), portal/sql/82_usuarios.sql; bloque usr_tab.js)
    // (295, 5-nov-2026) Usuarios del portal también a los gerentes, solo para el permiso de cerrar avisos del Buzón tributario
    { k: 'usr', t: 'Usuarios', d: 'Quién entra al portal: altas, bajas, contraseñas, permisos, accesos y las personas del WorkFlow.', subs: [
      { k: 'usuarios', v: 'usr', t: 'Usuarios del portal', d: 'Altas, bajas, códigos para la contraseña, regresos y el permiso de cerrar avisos del Buzón.' },
      { k: 'usuarios-wf', v: 'uwf', t: 'Personas del WorkFlow', d: 'Las personas del WorkFlow: cómo salen, si salen como contador, sus teléfonos y su carga.' },   // la pantalla «Usuarios» del Access (31-oct-2026): Daniel, Cadengo y Gabo
      { k: 'accesos', v: 'acc', t: 'Accesos', d: 'Quién entró al portal y cuándo.' }] },
    /* QUO: lo de los sistemas Quo junto, lo que se vende y su soporte (Héctor Daniel Nava, 8-nov-2026, 15:46: «Así es»; antes
       Q Chat iba en Chat). Q Chat es una sola pantalla (qchat.html, vista qch) con tres opciones: cada una abre su pestaña
       (p; el botón de la vista dice cuál está abierta con data-sub, lo pone qch_tab.js). Solo a quien la base deja
       (qchat_estado(), 326_qchat.sql); el cotizador y las membresías, a quien ya los tiene (es_quo()). La clave «qchat» no
       cambió (las ligas de la campanita y los recorridos siguen igual). */
    { k: 'quo', t: 'QUO', d: 'Los sistemas Quo: cotizaciones, membresías y su soporte (Q Chat).', subs: [
      { k: 'quo-cotizador', v: 'quo', q: 'cot', t: 'Cotizador QUO', d: 'Cotizaciones de Quo Contabilita.' },
      { k: 'quo-membresias', v: 'quo', q: 'mem', t: 'Control de membresías', d: 'Membresías y sus pagos.' },
      { k: 'qchat', v: 'qch', p: 'conv', t: 'Conversaciones', d: 'Q Chat: la fila, lo que contesta la asistente y lo que atiende el equipo, por chat o llamada.' },
      { k: 'qchat-tickets', v: 'qch', p: 'tk', t: 'Tickets a desarrollo', d: 'Q Chat: lo que solo se arregla cambiando el sistema, con su folio para el cliente.' },
      { k: 'qchat-eficiencia', v: 'qch', p: 'efi', t: 'Eficiencia del soporte', d: 'Q Chat: lo que resolvió la asistente, lo que atendió cada persona y la espera.' }] },
    // Multinacional (2-nov-2026, Héctor Daniel, 12:01 a 12:20): la comercializadora de la dirección; no tiene que ver con
    // las compañías que facturan el despacho. Solo la ven Mónica Pedraza (sube las facturas), Eva Rangel (marca las
    // cobradas) y la dirección (mul_estado(), portal/sql/136_multinacional.sql; bloque mul_tab.js)
    { k: 'mul', t: 'Multinacional', d: 'La comercializadora: cotizaciones, facturas, su banco y las comisiones.', subs: [
      { k: 'mul-cotizador', v: 'mulq', t: 'Cotizador', d: 'Captura un pedido con el costo del proveedor; el CRM pone el precio.' },   // 143_multinacional_cotizador.sql
      { k: 'mul-cotizaciones', v: 'mulc', t: 'Cotizaciones', d: 'Cada pedido con su costo, su precio, su estatus y su factura.' },
      { k: 'mul-facturas', v: 'mulf', t: 'Facturas', d: 'Las facturas de Multinacional (llegan del SAT o se suben): por cobrar y cobradas.' },
      { k: 'mul-estado', v: 'mule', t: 'Estado de cuenta', d: 'El banco de Multinacional y cada depósito de Juárez contra su factura.' },
      { k: 'mul-comisiones', v: 'mulk', t: 'Comisiones', d: 'La comisión de lo que paga Juárez, por mes: entregado y por entregar.' },
      { k: 'mul-pagos', v: 'mulp', t: 'Pagos', d: 'Lo que pagó cada cliente y a qué facturas se aplicó, como en Tesorería › Pagos.' }] },   // 332_multinacional_pagos.sql
    // SuperConta (29-oct-2026, pedido de Fernando Cadengo; quién lo usa lo decide Daniel): preguntas en palabras sobre la
    // empresa. El 31-oct-2026 Héctor Daniel pidió que el menú se llame «SuperConta (IA)» (antes «Ayuda»).
    { k: 'ayuda', t: 'SuperConta (IA)', d: 'La inteligencia artificial del portal: pregúntale lo que quieras saber de la empresa.', subs: [
      { k: 'superconta', v: 'sc', t: 'Pregúntale a SuperConta', d: 'Pregúntale como a alguien del equipo; contesta con los datos del portal.' }] }
  ];
  // Una pestaña nueva que todavía no tenga lugar en el menú sale en «Más», para que nunca se pierda
  var MAS = { k: 'mas', t: 'Más', d: 'Pestañas nuevas que todavía no tienen lugar en el menú.', subs: [] };
  var ENT = {};
  MODS.forEach(function (m) { m.subs.forEach(function (s) { s.m = m; ENT[s.k] = s; }); });
  // Inicio (30-oct-2026, pedido de Daniel): la página de tarjetas de cada quien (ini_tab.js). No va dentro de un
  // módulo: es la casita de arriba del menú, y es donde abre el portal cuando la dirección no pide otra sección.
  var INI = { k: 'inicio', v: 'ini', t: 'Inicio', d: 'Lo que necesita tu atención hoy.', m: { k: 'ini', t: 'PROFASE', d: '' } };
  ENT.inicio = INI;

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento: no se recuerda */ } }
  };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function svg(d, cls) { return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
  var FLECHA = '<path d="m9 6 6 6-6 6"/>';

  var CORTO = { wf: 'Workflow', clis: 'Clientes', msj: 'Chat', agd: 'Agenda', rep: 'Reportes', cen: 'Centauro', adm: 'Admin', usr: 'Usuarios', rh: 'RH', tes: 'Tesorería', quo: 'QUO', mul: 'Multi', access: 'Access', ayuda: 'SuperConta (IA)', mas: 'Más' };
  // Una sombrita arriba o abajo cuando quedan opciones por deslizar (se va sola al llegar a la orilla)
  var SOMBRAS = 'background:linear-gradient(var(--surface,#fff) 30%,transparent) top/100% 28px no-repeat local,'
    + 'linear-gradient(transparent,var(--surface,#fff) 70%) bottom/100% 28px no-repeat local,'
    + 'radial-gradient(farthest-side at 50% 0,rgba(10,18,32,.22),transparent) top/100% 10px no-repeat scroll,'
    + 'radial-gradient(farthest-side at 50% 100%,rgba(10,18,32,.22),transparent) bottom/100% 10px no-repeat scroll';
  var CSS = ':root{--pm-sw:248px;--pm-rail:88px;--pm-top:0px}'
    + '.pm-oculto{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;white-space:nowrap!important;margin:-1px!important;padding:0!important;border:0!important}'
    + '#v-quo .qsub{display:none!important}'
    + '.pm-ham{flex:none;width:38px;height:38px;border:0;background:none;border-radius:8px;cursor:pointer;display:grid;place-items:center;color:var(--navy,#1F3864);margin-left:-6px;padding:0}'
    + '.pm-ham:hover{background:var(--navy-soft,#E6ECF6)}.pm-ham svg{width:22px;height:22px;display:block}'
    + ':root[data-theme="dark"] .pm-ham{color:var(--ink,#E5EAF2)}'   // modo oscuro: el azul no se ve sobre fondo oscuro
    + '.pm-tit{display:flex;flex-direction:column;min-width:0;flex:0 1 auto}'
    + '.pm-crumb{font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted,#5A6577);line-height:1.1;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    + 'header.band .meta{margin-left:auto}'
    + '.pm-side{position:fixed;left:0;top:var(--pm-top);bottom:0;width:var(--pm-sw);background:var(--navy,#1F3864);color:#DCE5F3;display:flex;flex-direction:column;z-index:30;transition:width .18s ease;font-family:var(--f-body,inherit)}'
    + '.pm-side button{font:inherit}'
    + '.pm-cab{display:none}'
    + '.pm-lista{flex:1;overflow-y:auto;overflow-x:hidden;padding:10px 8px;overscroll-behavior:contain}'
    + '.pm-mod{margin-bottom:2px;position:relative}'
    + '.pm-mb{width:100%;display:flex;align-items:center;gap:12px;border:0;background:none;color:#DCE5F3;padding:10px;border-radius:8px;cursor:pointer;font-weight:600;font-size:14px;text-align:left;white-space:nowrap}'
    + '.pm-mb:hover{background:rgba(255,255,255,.1)}'
    + '.pm-mb:focus-visible,.pm-subs a:focus-visible,.pm-pie button:focus-visible{outline:2px solid var(--accent,#F07A1E);outline-offset:-2px}'
    + '.pm-ic{width:20px;height:20px;flex:none;display:block}'
    + '.pm-lbl{flex:1;overflow:hidden;text-overflow:ellipsis}'
    + '.pm-car{width:14px;height:14px;opacity:.7;transition:transform .15s;flex:none;display:block}'
    + '.pm-mod[data-open="true"] .pm-car{transform:rotate(90deg)}'
    + '.pm-mod.on>.pm-mb{color:#fff}.pm-mod.on>.pm-mb .pm-ic{color:var(--accent,#F07A1E)}'
    + '.pm-subs{margin:2px 0 6px;padding:0 0 0 22px;display:none}.pm-sl{list-style:none;margin:0;padding:0}'
    + '.pm-mod[data-open="true"] .pm-subs{display:block}'
    + '.pm-subs a{display:block;color:#A9BBD8;text-decoration:none;padding:7px 10px 7px 20px;font-size:13.5px;border-left:2px solid rgba(255,255,255,.14);border-radius:0 7px 7px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    + '.pm-subs a:hover{color:#fff;background:rgba(255,255,255,.1)}'
    + '.pm-subs a[aria-current="page"]{color:#fff;font-weight:700;border-left:3px solid var(--accent,#F07A1E);background:rgba(240,122,30,.18)}'
    // aviso de una pestaña (data-aviso en su botón; por ahora «Cambios al portal»): número junto al nombre y punto en el módulo
    + '.pm-av{display:inline-block;min-width:19px;margin-left:6px;padding:0 6px;border-radius:999px;background:var(--accent,#F07A1E);color:#fff;font-size:11.5px;font-weight:700;line-height:19px;text-align:center;vertical-align:1px}'
    + '.pm-mb{position:relative}.pm-mod.con-aviso>.pm-mb::after{content:"";position:absolute;left:24px;top:8px;width:8px;height:8px;border-radius:50%;background:var(--accent,#F07A1E);box-shadow:0 0 0 2px var(--navy,#1F3864)}'
    + '.pm-fly{display:none}.pm-fd,.pm-sd,.pm-ct{display:none}'
    + '.pm-inicio{margin-bottom:6px}'
    + '.pm-pie{border-top:1px solid rgba(255,255,255,.12);padding:8px}'
    + '.pm-pie button{width:100%;display:flex;align-items:center;gap:12px;border:0;background:none;color:#A9BBD8;padding:9px 10px;border-radius:8px;cursor:pointer;font-size:13px;white-space:nowrap;text-align:left}'
    + '.pm-pie button:hover{background:rgba(255,255,255,.1);color:#fff}'
    + '.pm-pmini svg{transition:transform .18s}'
    + '.pm-scrim{display:none}'
    + '@media (min-width:901px){'
    + 'body.pm{padding-left:var(--pm-sw)!important}body.pm header.band{margin-left:calc(-1 * var(--pm-sw))}'
    + 'body.pm.pm-mini{padding-left:var(--pm-rail)!important}body.pm.pm-mini header.band{margin-left:calc(-1 * var(--pm-rail))}'
    + 'body:not(.pm-mini) .pm-mod[data-open="true"]>.pm-mb:not(.pm-inicio){background:rgba(255,255,255,.09)}'   // el módulo abierto, sombreado como encabezado de sus opciones
    + 'body.pm-mini .pm-side{width:var(--pm-rail)}'
    + 'body.pm-mini .pm-car{display:none}'
    // el riel se desliza si la pantalla es baja (las tarjetas van aparte, fijas en la pantalla, y no se recortan)
    + 'body.pm-mini .pm-lista{overflow-x:hidden;overflow-y:auto;padding:10px 10px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.3) transparent;overscroll-behavior:contain}'
    + 'body.pm-mini .pm-side:hover,body.pm-mini .pm-side:focus-within,body.pm-mini .pm-side.pm-fly-on{z-index:85}'   // la tarjeta abierta, encima de los avisos flotantes
    + 'body.pm-mini .pm-mod{margin-bottom:6px}'
    + 'body.pm-mini .pm-mb{flex-direction:column;justify-content:center;gap:5px;padding:10px 0 8px;border-radius:14px}'
    + 'body.pm-mini .pm-mb .pm-ic{width:26px;height:26px}'
    + 'body.pm-mini .pm-mb .pm-lbl{flex:none;max-width:100%;font-size:10px;font-weight:800;letter-spacing:.03em;text-transform:uppercase;color:#A9BBD8;white-space:normal;overflow:visible;text-overflow:clip;text-align:center;line-height:1.25;padding:0 2px}'
    + 'body.pm-mini .pm-mb .pm-lbl .pm-lg{display:none}body.pm-mini .pm-mb .pm-lbl .pm-ct{display:inline}'
    + 'body.pm-mini .pm-mod.on>.pm-mb{background:rgba(240,122,30,.18);box-shadow:inset 3px 0 0 var(--accent,#F07A1E)}body.pm-mini .pm-mod.on>.pm-mb .pm-lbl{color:#fff}'
    + 'body.pm-mini .pm-mod.con-aviso>.pm-mb::after{left:auto;right:14px;top:8px}'
    + 'body.pm-mini .pm-inicio{width:52px;height:52px;margin:2px auto 10px;padding:0;border-radius:50%;background:#2C4A80;box-shadow:0 6px 16px rgba(0,0,0,.3)}'
    + 'body.pm-mini .pm-inicio .pm-lbl{display:none}body.pm-mini .pm-inicio:hover{background:#365A99}'
    + 'body.pm-mini .pm-pie button{justify-content:center}body.pm-mini .pm-pie .pm-lbl{display:none}body.pm-mini .pm-pmini svg{transform:rotate(180deg)}'
    // la tarjeta del módulo, igual que la del menú arriba
    // fija en la pantalla: colocaTarjeta() la pone a la altura de su ícono, sin salirse por abajo ni por arriba
    + 'body.pm-mini .pm-subs{display:none!important;position:fixed;left:var(--pm-fx,98px);top:var(--pm-fy,8px);width:348px;max-width:calc(100vw - var(--pm-fx,98px) - 8px);max-height:var(--pm-fh,calc(100vh - 16px));box-sizing:border-box;flex-direction:column;background:var(--surface,#fff);color:var(--ink,#132036);border:1px solid var(--line,#DCE2EB);border-left:3px solid var(--accent,#F07A1E);border-radius:14px;padding:14px 12px 10px;box-shadow:0 18px 44px rgba(10,18,32,.3);margin:0;z-index:31}'
    + 'body.pm-mini .pm-mod:hover .pm-subs,body.pm-mini .pm-mod:focus-within .pm-subs,body.pm-mini .pm-mod.fly .pm-subs{display:flex!important}'
    + 'body.pm-mini .pm-mod.pm-mide .pm-subs{display:flex!important;visibility:hidden!important}'   // solo para medirla
    + 'body.pm-mini .pm-subs::before{content:"";position:absolute;left:-14px;top:0;bottom:0;width:14px}'
    + 'body.pm-mini .pm-sl{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;' + SOMBRAS + '}'   // si no caben, las opciones se deslizan; el título se queda arriba
    // el encabezado de la tarjeta (nombre y qué es) va en una franja sombreada, para que se vea que abajo están sus opciones
    // (pedido de Daniel, 30-oct-2026); en claro, el azul grisáceo de PROFASE; en oscuro, un tono más claro que la tarjeta
    + 'body.pm-mini .pm-fly{display:block;flex:none;margin:-14px -12px 8px;padding:13px 18px 11px;background:var(--navy-soft,#E6ECF6);border-bottom:1px solid var(--line,#DCE2EB);border-radius:11px 13px 0 0/13px 13px 0 0;font-size:15px;font-weight:700;color:var(--ink,#132036);letter-spacing:0;text-transform:none}'
    + 'body.pm-mini .pm-fly .pm-fd{display:block;font-size:12.5px;font-weight:400;color:var(--muted,#5A6577);margin-top:2px}'
    + 'body.pm-mini .pm-subs a{border-left:0;padding:8px 10px;border-radius:9px;color:var(--ink,#132036);white-space:normal;font-weight:600;font-size:13.5px}'
    + 'body.pm-mini .pm-subs a:hover{background:var(--navy-soft,#E6ECF6);color:var(--ink,#132036)}'
    + 'body.pm-mini .pm-subs a .pm-sd{display:block;font-size:12px;font-weight:400;color:var(--muted,#5A6577)}'
    + 'body.pm-mini .pm-subs a[aria-current="page"]{border-left:0;color:var(--ink,#132036);background:var(--accent-soft,#FDEBDC);box-shadow:inset 3px 0 0 var(--accent,#F07A1E)}'
    + '}'
    + '@media (max-width:900px){'
    // abierto, encima de los avisos flotantes (que antes tapaban las últimas opciones); con las orillas del iPhone
    + '.pm-side{top:0;width:min(290px,85vw);box-sizing:border-box;padding-left:env(safe-area-inset-left,0px);transform:translateX(-105%);transition:transform .2s ease;z-index:86;box-shadow:none}'
    + 'body.pm-abierto .pm-side{transform:none;box-shadow:8px 0 30px rgba(0,0,0,.3)}'
    + 'body.pm-abierto .pm-scrim{display:block;position:fixed;inset:0;background:rgba(10,18,32,.45);z-index:85}'
    + '.pm-cab{display:flex;align-items:center;gap:10px;padding:calc(12px + env(safe-area-inset-top,0px)) 10px 10px 16px;border-bottom:1px solid rgba(255,255,255,.12)}'
    + '.pm-lista{padding-bottom:calc(10px + env(safe-area-inset-bottom,0px))}'
    + '.pm-mod[data-open="true"]>.pm-mb:not(.pm-inicio){background:rgba(255,255,255,.09)}'
    + '.pm-cab img{width:30px;height:30px;object-fit:contain;display:block;background:#fff;border-radius:8px;padding:3px;box-sizing:border-box}'
    + '.pm-cab span{flex:1;font-family:Arial,"Helvetica Neue",Helvetica,sans-serif;font-weight:700;letter-spacing:.16em;color:#fff;font-size:15px}'
    + '.pm-cab button{border:0;background:none;color:#fff;width:36px;height:36px;border-radius:8px;cursor:pointer;display:grid;place-items:center}'
    + '.pm-cab button:hover{background:rgba(255,255,255,.1)}.pm-cab svg{width:20px;height:20px;display:block}'
    + '.pm-pie{display:none}'   // en el celular el pie se quedó vacío («Ocultar menú» no aplica ahí)
    + '}'
    // en el celular la sección se ve COMPLETA (Daniel, 30-oct-2026, con una captura: salía «Altas …»): nunca se corta con
    // «…» ni se parte a media palabra; si no cabe en un renglón, pasa entera al segundo dentro de su lugar, y el
    // encabezado sigue en un solo renglón (Daniel, 31-oct-2026, 17:22; pantallas.css y cabeSeccion(), abajo)
    + '@media (max-width:600px){header.band .tag{display:none}.pm-tit{flex:1 1 auto}.pm-tit h1{font-size:15px;line-height:1.15;white-space:normal;overflow:visible;text-overflow:clip;overflow-wrap:normal;word-break:normal;-webkit-hyphens:manual;hyphens:manual}}'
    // la franja de abajo del encabezado («Datos al…», Notas, «Privado · …»): en el celular siempre; en lo demás, solo si
    // no caben en el renglón del encabezado (acomodaInfo(), abajo)
    // (.meta.pm-info: le gana a «.meta» de la página, que viene después en el código)
    + '.meta.pm-info{display:none}'
    + '.meta.pm-info.pm-con{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;column-gap:14px;row-gap:0;font-size:12.5px;color:var(--muted,#5A6577)}.pm-info>*{margin:6px 0}'
    // para que el encabezado quepa en un renglón (acomodaInfo(), abajo): primero lo estático, al último el texto del signo
    + 'header.band.pm-sin-chicos .pt-chicos,header.band.pm-sin-lema .brandtxt,header.band.pm-sin-modulo .pm-crumb{display:none!important}'
    + 'header.band.pm-apretado .wrap{flex-wrap:nowrap}header.band.pm-apretado .pm-tit{flex:1 1 auto;min-width:0}'
    + 'header.band.pm-apretado .pm-tit h1{white-space:normal;overflow:visible;text-overflow:clip;overflow-wrap:normal;word-break:normal;line-height:1.15}'
    + '@media (prefers-reduced-motion:reduce){.pm-side,.pm-car,.pm-pie svg{transition:none}}';

  var sw, side, lista, hdr, titulo, crumb, pendiente = 0, listo = false, quoObs = null, hecho = '', cerrarAlPintar = false;
  // Mientras el recorrido general (bienvenida_tab.js) explica un módulo, su tarjeta se queda abierta aunque el mouse
  // salga del menú o se pique «Siguiente» (ver ensena() y suelta(), abajo)
  var retiene = false;

  function movil() { return matchMedia('(max-width:900px)').matches; }
  function boton(v) { return sw.querySelector('button[data-view="' + v + '"]'); }
  function aLaVista(b) { return !!b && !b.hidden && getComputedStyle(b).display !== 'none'; }
  function subQuo(q) { return document.querySelector('#v-quo .qsw button[data-q="' + q + '"]'); }

  /* Solo lo que cada quien tiene (Héctor Daniel, 2-nov-2026, 11:44, revisando con Dora su CRM: «solo les salga menús si
     tienen "algo que hacer" en submenús, si no quítaselos… Aplica para todos los usuarios»). Además de lo que cada pestaña
     ya enseña solo si la base la deja, aquí no salen las opciones que la base dice que no le tocan a quien entró
     (menu_sin(), portal/sql/134_menu_lo_tuyo.sql: hoy, lo del WorkFlow y los clientes a quien no trabaja ningún cliente),
     y un módulo que se queda sin opciones no se pinta. Lo mismo vale para el recorrido general, el «?», SuperConta y las
     ligas del Inicio, que preguntan aquí. Mientras la base contesta, a un contador solo se le pinta el Inicio (para que
     nada salga y luego se quite); si no contesta, se enseña todo como antes (las reglas de cada pantalla no cambian). */
  var SIN = ROL === 'contador' ? null : {}, sinListo = null;
  function pideSin() {
    var P = window.PORTAL, hecho = false, avisa;
    sinListo = new Promise(function (r) { avisa = r; });
    function fin(l) {
      if (hecho) return;
      hecho = true;
      var o = {}; (Array.isArray(l) ? l : []).forEach(function (v) { o[v] = 1; });
      SIN = o; avisa(); if (sw) luego();
    }
    if (SIN) return fin([]);
    if (!P || !P.listo || !P.sb) return fin([]);
    setTimeout(function () { fin([]); }, 10000);   // si la base no contesta, como antes
    P.listo.then(function (p) {
      if (!p) return fin([]);
      return P.sb.rpc('menu_sin').then(function (r) { fin(!r.error ? r.data : []); });
    }).catch(function () { fin([]); });
  }
  pideSin();
  // ¿Esta opción le toca y está a la vista? (una sola versión: la usan el menú, ir() y PORTAL_MENU.ve())
  function tiene(s) {
    if (s === INI) return aLaVista(boton(s.v));
    return !!SIN && !SIN[s.v] && aLaVista(boton(s.v)) && (!s.q || !!subQuo(s.q));
  }

  // Qué sub módulos ve esta persona (en el orden del menú), más los botones nuevos que no estén en el menú
  function modulos() {
    var conocidos = { ini: 1 }, out = [];
    MODS.forEach(function (m) {
      var subs = m.subs.filter(function (s) { conocidos[s.v] = 1; return tiene(s); });
      if (subs.length) out.push({ m: m, subs: subs });
    });
    var extra = [];
    sw.querySelectorAll('button[data-view]').forEach(function (b) {
      var v = b.dataset.view;
      if (conocidos[v] || !SIN || SIN[v] || !aLaVista(b)) return;
      var s = ENT['v-' + v] || (ENT['v-' + v] = { k: v, v: v, t: b.textContent.trim(), m: MAS });
      extra.push(s);
    });
    if (extra.length) out.push({ m: MAS, subs: extra });
    return out;
  }
  function activo() {
    var b = sw.querySelector('button[aria-pressed="true"]');
    if (!b) return null;
    var v = b.dataset.view;
    if (v === 'quo') {
      var q = document.querySelector('#v-quo .qsw button[aria-pressed="true"]');
      return ENT[q && q.dataset.q === 'mem' ? 'quo-membresias' : 'quo-cotizador'];
    }
    var p = b.dataset.sub;   // una pantalla con varias opciones (Q Chat): la que está abierta
    if (p) for (var kp in ENT) if (ENT[kp].v === v && ENT[kp].p === p) return ENT[kp];
    for (var k in ENT) if (ENT[k].v === v && !ENT[k].q) return ENT[k];
    return null;
  }
  function nombre(s) { return ROL === 'contador' && s.tc ? s.tc : s.t; }

  // «Abriendo…» (Fernando Cadengo, 6-nov-2026: «porque cuando se actualiza la pagina se va a otra pagina y regresa?»;
  // «sí, así es»): mientras se abre la sección pedida, la vista tapa lo que trae de fábrica (el Panel del WorkFlow o la
  // Cobranza) y dice a dónde va. La tapa la pone el <head> de las tres vistas (construir.py, con_abriendo()); aquí se
  // quita en cuanto la sección se abre, si no hay sección que abrir o, a los 12 s, al abrir el Inicio.
  function quitaCarga() { document.documentElement.classList.remove('pm-cargando'); }
  function ir(k) {
    var s = ENT[k] || ENT['v-' + k];
    if (!s || !tiene(s)) return false;
    var b = boton(s.v);
    if (s.q) {
      var x = subQuo(s.q);
      if (!x) return false;
      x.click();      // primero la sub pestaña (para que no cargue la otra), luego QUO
    }
    if (s.p) b.dataset.sub = s.p;   // el menú ya dice cuál; la pantalla abre esa pestaña (abajo)
    b.click();
    if (s.p) { try { var fp = (window.PROFASE_SUB || {})[s.v]; if (typeof fp === 'function') fp(s.p); } catch (e) { /* se queda en la que tenga */ } }
    listo = true; quitaCarga();
    if (movil()) abre(false);
    cierraFly(); cerrarAlPintar = true;   // escogida la opción, su tarjeta se cierra
    pinta();
    return true;
  }

  var espera = null;   // la sección que se está abriendo: el encabezado y el menú ya la dicen
  function abriendo(e) {
    espera = e;
    var ct = document.querySelector('#pm-carga .pc-t');
    if (ct) ct.textContent = 'Abriendo ' + (e === INI ? 'tu Inicio' : nombre(e)) + '…';
  }
  function pinta() {
    pendiente = 0;
    var abiertos = {};
    try { abiertos = JSON.parse(store.get('portal.menu.abiertos') || '{}') || {}; } catch (e) { abiertos = {}; }
    var act = (!listo && espera) ? espera : activo(), h = '', guarda = false;
    modulos().forEach(function (x) {
      var m = x.m, on = !!act && x.subs.indexOf(act) >= 0, open = on || abiertos[m.k] === true;
      var av = x.subs.some(function (s) { var b = boton(s.v); return b && +b.dataset.aviso > 0; });
      // el módulo de la sección abierta se queda abierto aunque luego se elija otro, hasta que lo cierren
      if (on && abiertos[m.k] !== true) { abiertos[m.k] = true; guarda = true; }
      h += '<div class="pm-mod' + (on ? ' on' : '') + (av ? ' con-aviso' : '') + '" data-m="' + m.k + '" data-open="' + open + '">'
        // sin «title»: el globito del navegador tapaba el nombre y la descripción de la tarjeta (30-oct-2026)
        + '<button type="button" class="pm-mb" aria-expanded="' + open + '" aria-label="' + esc(m.t) + '">' + svg(IC[m.k] || IC.mas, 'pm-ic')
        + '<span class="pm-lbl"><span class="pm-lg">' + esc(m.t) + '</span><span class="pm-ct">' + esc(CORTO[m.k] || m.t) + '</span></span>' + svg(FLECHA, 'pm-car') + '</button>'
        + '<div class="pm-subs"><div class="pm-fly" aria-hidden="true">' + esc(m.t) + '<span class="pm-fd">' + esc(m.d || '') + '</span></div><ul class="pm-sl">'
        + x.subs.map(function (s) {
          var n = +((boton(s.v) || {}).dataset || {}).aviso || 0;
          return '<li><a href="#' + esc(s.k) + '" data-k="' + esc(s.k) + '"' + (s === act ? ' aria-current="page"' : '') + '>' + esc(nombre(s))
            + (n > 0 ? '<span class="pm-av" aria-label="' + n + ' pendientes">' + n + '</span>' : '') + (s.d ? '<span class="pm-sd">' + esc(s.d) + '</span>' : '') + '</a></li>';
        }).join('') + '</ul></div></div>';
    });
    if (h) h = '<div class="pm-mod' + (act === INI ? ' on' : '') + '"><button type="button" class="pm-mb pm-inicio" title="Inicio" aria-label="Inicio"' + (act === INI ? ' aria-current="page"' : '') + '>' + svg(IC.home, 'pm-ic') + '<span class="pm-lbl">Inicio</span></button></div>' + h;
    if (guarda) store.set('portal.menu.abiertos', JSON.stringify(abiertos));
    if (h !== hecho) {
      // Si la tarjeta de un módulo está abierta cuando el menú se vuelve a pintar solo (por ejemplo, porque llegó un
      // mensaje al Chat y cambió su número), se queda abierta y en el mismo lugar; antes se cerraba bajo el mouse.
      // Al escoger una opción sí se cierra (ir() pone cerrarAlPintar).
      var ab = !cerrarAlPintar && enRiel() ? tarjetaAbierta() : null, km = ab && ab.dataset.m;
      var sl = ab && ab.querySelector('.pm-sl'), st = sl ? sl.scrollTop : 0, rs = lista.scrollTop;
      lista.innerHTML = h; hecho = h; sobre = null;
      lista.scrollTop = rs;
      var nm = km ? lista.querySelector('.pm-mod[data-m="' + km + '"]') : null;
      if (nm) {
        nm.classList.add('fly'); side.classList.add('pm-fly-on');
        colocaTarjeta(nm);
        var ns = nm.querySelector('.pm-sl'); if (ns) ns.scrollTop = st;
      } else { side.classList.remove('pm-fly-on'); recoloca(); }
    }
    cerrarAlPintar = false;
    if (act) {
      crumb.textContent = act.m.t;
      var t = nombre(act);
      if (titulo.textContent !== t) titulo.textContent = t;
      document.title = t + ' · Portal PROFASE';
      if (listo && location.hash !== '#' + act.k) { try { history.replaceState(null, '', '#' + act.k); } catch (e) { /* sin historial */ } }
    }
  }
  function luego() { if (!pendiente) pendiente = requestAnimationFrame(pinta); }

  // Inicio: la casita del menú; si la persona no tiene Inicio, la primera opción de su menú
  function inicio() { if (aLaVista(boton(INI.v))) return INI; var m = modulos()[0]; return m ? m.subs[0] : null; }

  // Submenús siempre completos en la pantalla (pedido de Daniel, 30-oct-2026). Los lugares van en variables del riel
  // (--pm-fx, --pm-fy, --pm-fh), fuera de lo que se vuelve a pintar.
  var MARGEN = 8, sobre = null;
  function altoPantalla() { return window.innerHeight || document.documentElement.clientHeight; }
  function enRiel() { return document.body.classList.contains('pm-mini') && !movil(); }
  // La tarjeta del módulo en el riel: a la altura de su ícono; si no cabe hacia abajo, sube lo necesario; si es más
  // alta que la pantalla, ocupa la pantalla y sus opciones se deslizan dentro (el título se queda arriba).
  function colocaTarjeta(mod) {
    if (!mod || !side || !enRiel()) return;
    var t = mod.querySelector('.pm-subs'), b = mod.querySelector('.pm-mb');
    if (!t || !b) return;
    var rb = b.getBoundingClientRect(), H = altoPantalla();
    side.style.setProperty('--pm-fx', Math.round(rb.right + 10) + 'px');
    side.style.setProperty('--pm-fh', Math.max(120, H - 2 * MARGEN) + 'px');
    mod.classList.add('pm-mide');
    var h = t.offsetHeight;
    mod.classList.remove('pm-mide');
    side.style.setProperty('--pm-fy', Math.round(Math.max(MARGEN, Math.min(rb.top - 6, H - MARGEN - h))) + 'px');
  }
  function tarjetaAbierta() {
    if (!lista) return null;
    try { return lista.querySelector('.pm-mod.fly') || lista.querySelector('.pm-mod:hover') || lista.querySelector('.pm-mod:focus-within'); } catch (e) { return null; }
  }
  function recoloca() { var m = tarjetaAbierta(); if (m) colocaTarjeta(m); }
  function cierraFly(salvo) {
    if (!lista) return;
    lista.querySelectorAll('.pm-mod.fly').forEach(function (m) { if (m !== salvo) m.classList.remove('fly'); });
    side.classList.toggle('pm-fly-on', !!lista.querySelector('.pm-mod.fly'));
  }
  // Un solo menú abierto a la vez (regla de Daniel, 30-oct-2026: «que no se entrelapen»): al abrir la tarjeta del riel
  // o el ☰ del celular se avisa (js/portal.js, PORTAL.abreMenu) y se cierran los demás menús
  function avisaMenu(q) { try { if (window.PORTAL && window.PORTAL.abreMenu) window.PORTAL.abreMenu(q); } catch (e) { /* sin aviso */ } }
  /* Sin «Menú arriba» (Héctor Daniel, 2-nov-2026, 14:25: «el menú de arriba los que lo tenga, quitaselos… para que solo
     usen el menú lateral»). Quien lo traía en este navegador (lo escogió, o es un celular que nunca escogió nada, que
     arrancaba con él) queda con el menú de la izquierda y con la marca «portal.menu.venia_arriba», para que
     portal/menu_rec_tab.js le enseñe una sola vez dónde quedó su menú. «portal.menu.modo» queda en «lado» para que la
     marca no se vuelva a poner en ese navegador. */
  function quitaArriba() {
    var m = store.get('portal.menu.modo');
    if (m === 'lado') return;
    if (m === 'arriba' || (!m && movil())) store.set('portal.menu.venia_arriba', '1');
    store.set('portal.menu.modo', 'lado');
  }
  quitaArriba();   // al cargar, antes que las pestañas (menu_rec_tab.js lee la marca en cuanto arranca)

  function estaMini() { return store.get('portal.menu.mini') !== '0'; }   // sin escoger: el riel de íconos
  function mini(v) {
    if (v !== undefined) store.set('portal.menu.mini', v ? '1' : '0');
    var on = estaMini();
    document.body.classList.toggle('pm-mini', on);
    var l = side.querySelector('.pm-pmini .pm-lbl');
    if (l) l.textContent = on ? 'Mostrar menú' : 'Ocultar menú';
    side.querySelector('.pm-pmini').setAttribute('aria-label', on ? 'Mostrar menú' : 'Ocultar menú');
    setTimeout(alto, 200);
  }
  function abre(v) { document.body.classList.toggle('pm-abierto', v); if (v) avisaMenu('pm-cajon'); }
  // En computadora el menú empieza justo abajo del encabezado
  function alto() {
    var r = hdr.getBoundingClientRect();
    document.documentElement.style.setProperty('--pm-top', Math.max(0, r.bottom) + 'px');
    recoloca();   // si el encabezado cambia de alto, la tarjeta abierta se vuelve a acomodar
  }
  /* Celular, 600 px o menos (Daniel, 30-oct-2026: «que todo sea responsive y que se vea bien y todo quepa»): el
     encabezado se queda pegado arriba (pantallas.css; así el iPhone y el iPad no lo difuminan) y lleva solo lo de
     siempre: ☰, el signo, la sección completa, el chat, la campanita, la foto y el claro/oscuro. Lo demás que traía
     («Datos al…», Notas, «Privado · …») baja a una franja justo abajo del encabezado, que se va al deslizar la página.
     Son los mismos botones (con sus funciones); al agrandarse la pantalla regresan al encabezado, en su orden.
     «Equipo DECOMSA · …» se queda: js/portal.js pone en su lugar la foto y los botones. Desde el 31-oct-2026 todo va
     en un solo renglón, en cualquier pantalla (abajo). */
  var info = null, celInfo = window.matchMedia ? matchMedia('(max-width:600px)') : null;
  /* El encabezado va SIEMPRE en un solo renglón, en cualquier pantalla (Daniel, 31-oct-2026, 17:22 a 17:32, con una
     captura de su iPhone: «no me gustó que se bajara una línea todo lo demás… lo quiero ver siempre en una sola línea»;
     «y siempre en una línea en cualquier pantalla»; «dale siempre preferencia a lo animado que a lo estático»). Si no
     cabe todo, se prueba en este orden y se queda el primero que cabe:
       1. todo en el encabezado;
       2. «Datos al…», Notas, «Privado · …» bajan a la franja de abajo (no se pierden; son los mismos botones);
       3. además se quitan los dos adornos quietos de junto a la campanita (lo estático; js/temporada.js);
       4. además se quita el texto «PROFASE · Asesoría Contable, Legal y Fiscal» junto al signo;
       5. y el nombre de la sección, completo, pasa a dos renglones dentro de su lugar (pm-apretado).
     El módulo chiquito de arriba de la sección, si no cabe completo, no sale (pm-sin-modulo).
     El signo oficial y su adorno animado nunca se quitan. En el celular (600 px o menos) siempre es el paso 5 (los adornos
     quietos ni salen; pantallas.css). En el último paso, si aun así no cabe, cabeSeccion() le baja la letra a la sección
     poco a poco (nunca «…» ni a media palabra). */
  var cabObs = [], acomodando = false, altoCab = -1, anchoCab = -1, pidioCab = 0;
  function cabeSeccion(minimo) {
    if (!titulo) return;
    titulo.style.fontSize = '';
    if (!titulo.getClientRects().length) return;
    var base = parseFloat(getComputedStyle(titulo).fontSize) || 15;
    for (var px = base; px >= minimo; px -= 0.5) {
      if (px !== base) titulo.style.fontSize = px + 'px';
      var lh = parseFloat(getComputedStyle(titulo).lineHeight) || px * 1.15;
      if (titulo.scrollWidth <= titulo.clientWidth + 1 && titulo.getBoundingClientRect().height <= lh * 2 + 1 && enUnRenglon()) return;
    }
  }
  function enUnRenglon() {
    var w = hdr.querySelector('.wrap') || hdr, b = hdr.querySelector('.brand');
    if (!b) return true;
    var bb = b.getBoundingClientRect(), ok = true;
    Array.prototype.forEach.call(w.querySelectorAll(':scope > *, :scope > .meta > *'), function (e) {
      if (!ok || e === b || e.classList.contains('meta') || e.classList.contains('pm-oculto') || !e.getClientRects().length) return;
      var r = e.getBoundingClientRect();
      if (r.width && (r.top >= bb.bottom - 2 || r.bottom <= bb.top + 2)) ok = false;
    });
    return ok && w.scrollWidth <= w.clientWidth + 1 && (!titulo || titulo.scrollWidth <= titulo.clientWidth + 1);
  }
  function extrasAbajo(meta, abajo) {
    if (abajo) Array.prototype.slice.call(meta.children).forEach(function (el) {
      if (el === sw || el.classList.contains('pu-par') || el.classList.contains('equipo')) return;
      info.appendChild(el);
    });
    else if (info.firstChild) {
      var pu = meta.querySelector(':scope > .pu-par, :scope > .equipo');
      while (info.firstChild) meta.insertBefore(info.firstChild, pu);
    }
    info.classList.toggle('pm-con', !!info.firstChild);
  }
  function acomodaInfo() {
    if (!hdr || !celInfo || acomodando) return;
    var meta = hdr.querySelector('.meta');
    if (!meta) return;
    acomodando = true;
    if (!info) {
      info = document.createElement('div');
      info.className = 'wrap meta pm-info';
      info.setAttribute('role', 'group'); info.setAttribute('aria-label', 'Datos de la sección');
    }
    if (hdr.nextElementSibling !== info) hdr.parentNode.insertBefore(info, hdr.nextSibling);   // siempre pegada al encabezado
    var cel = celInfo.matches, pasos = cel ? [[1, 1, 1, 1]] : [[0, 0, 0, 0], [1, 0, 0, 0], [1, 1, 0, 0], [1, 1, 1, 0], [1, 1, 1, 1]];
    for (var i = 0; i < pasos.length; i++) {
      extrasAbajo(meta, pasos[i][0]);
      hdr.classList.toggle('pm-sin-chicos', !!pasos[i][1]);
      hdr.classList.toggle('pm-sin-lema', !!pasos[i][2]);
      hdr.classList.toggle('pm-apretado', !!pasos[i][3] && !cel);
      if (i === pasos.length - 1) cabeSeccion(cel ? 11 : 12);
      else titulo.style.fontSize = '';
      if (enUnRenglon()) break;
    }
    // el módulo chiquito de arriba de la sección («PROFASE», «WORKFLOW»…): si no cabe completo, no sale (nunca «PROFA…»)
    hdr.classList.remove('pm-sin-modulo');
    if (crumb && crumb.getClientRects().length && crumb.scrollWidth > crumb.clientWidth + 1) hdr.classList.add('pm-sin-modulo');
    var r = hdr.getBoundingClientRect(); altoCab = Math.round(r.height); anchoCab = Math.round(r.width);
    cabObs.forEach(function (o) { o.takeRecords(); });   // lo que movimos aquí no vuelve a llamar
    acomodando = false;
  }
  function pideAcomodo() { if (!pidioCab) pidioCab = requestAnimationFrame(function () { pidioCab = 0; acomodaInfo(); }); }

  function arranca() {
    sw = document.querySelector('header .vsw');
    hdr = document.querySelector('header.band');
    titulo = document.getElementById('vtitle');
    if (!sw || !hdr || !titulo) return;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    sw.classList.add('pm-oculto');
    document.body.classList.add('pm');

    // ☰ al inicio del encabezado y, arriba del título, el módulo
    var ham = document.createElement('button');
    ham.type = 'button'; ham.className = 'pm-ham'; ham.setAttribute('aria-label', 'Mostrar u ocultar el menú'); ham.setAttribute('aria-controls', 'pm-side');
    ham.innerHTML = svg('<path d="M4 7h16M4 12h16M4 17h16"/>', '');
    var brand = hdr.querySelector('.brand') || titulo.parentNode;
    brand.insertBefore(ham, brand.firstChild);
    var tit = document.createElement('div'); tit.className = 'pm-tit';
    crumb = document.createElement('span'); crumb.className = 'pm-crumb';
    titulo.parentNode.insertBefore(tit, titulo);
    tit.appendChild(crumb); tit.appendChild(titulo);

    side = document.createElement('nav');
    side.className = 'pm-side'; side.id = 'pm-side'; side.setAttribute('aria-label', 'Menú del portal');
    var logo = hdr.querySelector('img.logo');
    side.innerHTML = '<div class="pm-cab">' + (logo ? '<img alt="" src="' + esc(logo.getAttribute('src')) + '">' : '') + '<span>PROFASE</span>'
      + '<button type="button" aria-label="Cerrar el menú">' + svg('<path d="M6 6l12 12M18 6 6 18"/>', '') + '</button></div>'
      + '<div class="pm-lista"></div>'
      + '<div class="pm-pie"><button type="button" class="pm-pmini">' + svg('<path d="m11 17-5-5 5-5M18 17l-5-5 5-5"/>', 'pm-ic') + '<span class="pm-lbl">Ocultar menú</span></button></div>';
    document.body.appendChild(side);
    var scrim = document.createElement('div'); scrim.className = 'pm-scrim';
    document.body.appendChild(scrim);
    lista = side.querySelector('.pm-lista');

    ham.onclick = function () { if (movil()) abre(!document.body.classList.contains('pm-abierto')); else mini(!estaMini()); };
    side.querySelector('.pm-pmini').onclick = function () { mini(!estaMini()); };

    side.querySelector('.pm-cab button').onclick = function () { abre(false); };
    if (window.PROFASE_TEMPORADA) window.PROFASE_TEMPORADA.pon(logo);   // js/temporada.js
    // el signo del ☰ también lleva al Inicio (el del encabezado ya lo marcó js/portal.js; Daniel, 31-oct-2026)
    if (window.PORTAL && window.PORTAL.signoInicio) window.PORTAL.signoInicio(side.querySelector('.pm-cab'));
    scrim.onclick = function () { abre(false); };
    // con el dedo se desliza el menú, nunca la pantalla de abajo; sobre el fondo oscuro no se mueve nada (4-nov-2026; js/portal.js)
    if (window.PORTAL && window.PORTAL.deslizaDentro) { window.PORTAL.deslizaDentro(side); window.PORTAL.deslizaDentro(scrim); }
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (document.body.classList.contains('pm-abierto')) abre(false);
    });

    lista.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-k]');
      if (a) { e.preventDefault(); ir(a.dataset.k); return; }
      if (e.target.closest('.pm-inicio')) { var ini = inicio(); if (ini) ir(ini.k); return; }
      var mb = e.target.closest('.pm-mb');
      if (!mb) return;
      var mod = mb.parentNode;
      if (enRiel()) {
        // en el riel, picar el ícono deja fija su tarjeta (en tableta no hay mouse); solo una a la vez
        var ya = mod.classList.contains('fly');
        cierraFly();
        if (!ya) { mod.classList.add('fly'); side.classList.add('pm-fly-on'); colocaTarjeta(mod); avisaMenu('pm-fly'); } else mb.blur();
        return;
      }
      var o = mod.dataset.open !== 'true';
      mod.dataset.open = o; mb.setAttribute('aria-expanded', o);
      var ab = {};
      try { ab = JSON.parse(store.get('portal.menu.abiertos') || '{}') || {}; } catch (er) { ab = {}; }
      ab[mod.dataset.m] = o; store.set('portal.menu.abiertos', JSON.stringify(ab));
    });
    lista.addEventListener('mouseleave', function () { sobre = null; if (!retiene) cierraFly(); });
    // al llegar a otro ícono del riel, su tarjeta se acomoda dentro de la pantalla y se cierran las demás
    lista.addEventListener('mouseover', function (e) {
      var m = e.target.closest('.pm-mod');
      if (!m || m === sobre) return;
      sobre = m;
      cierraFly(m);
      var f = document.activeElement;
      if (f && f !== document.body && lista.contains(f) && !m.contains(f) && enRiel()) f.blur();
      colocaTarjeta(m);
    });
    lista.addEventListener('focusin', function (e) { colocaTarjeta(e.target.closest('.pm-mod')); });
    lista.addEventListener('scroll', recoloca, { passive: true });
    document.addEventListener('click', function (e) { if (!retiene && e.target.isConnected && !side.contains(e.target)) cierraFly(); });
    // si se abre otro menú (el de la foto, la campanita, los filtros…) o se toca dentro de una pestaña, se cierran los del menú
    document.addEventListener('profase-menu', function (e) {
      if (retiene) return;   // el recorrido general deja abierta la tarjeta que está enseñando
      var q = e.detail;
      if (q !== 'pm-fly' && lista.querySelector('.pm-mod.fly')) cierraFly();
      if (q !== 'pm-cajon' && document.body.classList.contains('pm-abierto')) abre(false);
    });

    // Cuando una pestaña aparece (la base dice que sí), cambia o se elige, el menú se vuelve a pintar
    new MutationObserver(luego).observe(sw, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'aria-pressed', 'data-aviso', 'data-sub'] });
    function vigilaQuo() {
      var q = document.querySelector('#v-quo .qsw');
      if (q && !quoObs) { quoObs = new MutationObserver(luego); quoObs.observe(q, { subtree: true, attributes: true, attributeFilter: ['aria-pressed'] }); luego(); }
    }
    new MutationObserver(vigilaQuo).observe(document.body, { childList: true });
    vigilaQuo();

    mini();
    // la franja de abajo del encabezado en el celular: lo que llegue después al encabezado (la foto la pone js/portal.js)
    // y lo que otra pestaña ponga junto a él (el aviso del Calendario) no la separan del encabezado
    // y que todo vaya en un solo renglón: al cambiar el ancho, la letra o lo que trae el encabezado (los adornos de la
    // temporada, la foto, «Datos al…») se vuelve a acomodar; lo que se mueve aquí mismo no vuelve a llamar
    acomodaInfo();
    if (window.ResizeObserver) new ResizeObserver(function () {
      var r = hdr.getBoundingClientRect();
      if (Math.round(r.width) !== anchoCab || Math.round(r.height) !== altoCab) pideAcomodo();
    }).observe(hdr);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(pideAcomodo);
    if (celInfo) {
      if (celInfo.addEventListener) celInfo.addEventListener('change', acomodaInfo); else if (celInfo.addListener) celInfo.addListener(acomodaInfo);
      var metaH = hdr.querySelector('.meta'), mo;
      if (metaH) { mo = new MutationObserver(pideAcomodo); mo.observe(metaH, { childList: true }); cabObs.push(mo); }
      mo = new MutationObserver(pideAcomodo); mo.observe(document.body, { childList: true }); cabObs.push(mo);
      // la sección o su módulo cambian (los pone esta página o la pestaña): se vuelve a acomodar
      mo = new MutationObserver(pideAcomodo); mo.observe(titulo, { childList: true, characterData: true, subtree: true }); cabObs.push(mo);
      mo = new MutationObserver(pideAcomodo); mo.observe(crumb, { childList: true, characterData: true, subtree: true }); cabObs.push(mo);
    }
    alto();
    addEventListener('resize', function () { alto(); if (!movil()) abre(false); recoloca(); });
    addEventListener('scroll', alto, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(alto).observe(hdr);
    addEventListener('hashchange', function () { var k = location.hash.slice(1); var a = activo(); if (k && (!a || a.k !== k)) ir(k); });

    // Abre la sección de la dirección (#cartera…) en cuanto su pestaña esté a la vista; algunas esperan a la base
    var pedida = location.hash.slice(1), t0 = Date.now();
    // Al entrar al portal (la entrada deja la marca «portal.entrada») o sin sección pedida, todos ven primero su Inicio
    // (regla de Daniel, 30-oct-2026: «siempre que ingreses sesión veas el home, todos»). Al recargar o con una liga a una
    // sección, se queda en esa. Un aviso del chat (?chat=…) lo abre chat_tab.js.
    var entrada = false;
    try { entrada = sessionStorage.getItem('portal.entrada') === '1'; sessionStorage.removeItem('portal.entrada'); } catch (e) { entrada = false; }
    if ((entrada || !ENT[pedida]) && !/[?&]chat=/.test(location.search) && aLaVista(boton(INI.v))) pedida = INI.k;
    if (ENT[pedida]) abriendo(ENT[pedida]);
    document.documentElement.classList.add('pm-carga-dest');
    pinta();
    if (!pedida || !(ENT[pedida])) { listo = true; quitaCarga(); pinta(); return; }
    (function intenta() {
      if (listo) return;
      // una sección que no le toca (134_menu_lo_tuyo.sql: una liga vieja, por ejemplo) abre su Inicio
      if (SIN && ENT[pedida] && ENT[pedida] !== INI && SIN[ENT[pedida].v] && aLaVista(boton(INI.v))) { pedida = INI.k; abriendo(INI); pinta(); }
      if (ir(pedida)) return;
      // no se pudo abrir: a su Inicio (antes se quedaba en lo que la vista trae de fábrica)
      if (Date.now() - t0 > 12000) { if (!(pedida !== INI.k && aLaVista(boton(INI.v)) && ir(INI.k))) { listo = true; pinta(); } quitaCarga(); return; }
      setTimeout(intenta, 250);
    })();
  }
  // Recorrido general del portal (bienvenida_tab.js; Daniel, 30-oct-2026: «hagas un recorrido de todo a cada usuario para
  // que sepan»): qué módulos y opciones ve esta persona, y abrir la tarjeta de un módulo donde esté su menú (riel, menú
  // completo o ☰ del celular) para iluminarla. No cambia de pantalla ni de sección.
  function datosModulos() {
    return modulos().map(function (x) {
      return { k: x.m.k, t: x.m.t, d: x.m.d || '', subs: x.subs.map(function (s) { return { k: s.k, t: nombre(s), d: s.d || '', v: s.v }; }) };
    });
  }
  function ensena(k) {
    if (!sw || !lista) return null;
    retiene = true;
    var m = lista.querySelector('.pm-mod[data-m="' + k + '"]');
    if (!m) return null;
    if (enRiel()) {
      cierraFly();
      m.classList.add('fly'); side.classList.add('pm-fly-on');
      colocaTarjeta(m);
      avisaMenu('pm-fly');
      return m.querySelector('.pm-subs');
    }
    if (movil()) abre(true);
    m.dataset.open = 'true';
    var mb = m.querySelector('.pm-mb'); if (mb) mb.setAttribute('aria-expanded', 'true');
    try { m.scrollIntoView({ block: 'nearest' }); } catch (e) { /* se queda donde está */ }
    return m;
  }
  function suelta() {
    retiene = false;
    if (!sw || !lista) return;
    cierraFly();
    if (movil()) abre(false);
    pinta();
  }
  function forma() { return movil() ? 'cel' : (estaMini() ? 'riel' : 'lado'); }
  var COMO = { riel: 'Cada ícono es un módulo. Pásale el mouse o pícale y sale su tarjeta con sus opciones, cada una con su explicación.',
    lado: 'Aquí están tus módulos; pica uno y se abren sus opciones.',
    cel: 'Pica ☰ para abrir tu menú con todos tus módulos y sus opciones.' };
  window.PORTAL_MENU = {
    ir: function (k) { return !!sw && ir(k); },
    // el signo PROFASE lleva al Inicio de quien entró (js/portal.js, P.alInicio; Daniel, 31-oct-2026): cierra el ☰ y
    // las tarjetas abiertas, abre el Inicio y sube hasta arriba
    alInicio: function () {
      if (!sw) return false;
      var i = inicio();
      if (!i) return false;
      if (document.body.classList.contains('pm-abierto')) abre(false);
      cierraFly();
      if (!ir(i.k)) return false;
      try { window.scrollTo(0, 0); var m = document.scrollingElement; if (m) m.scrollTop = 0; } catch (e) { /* sin página */ }
      return true;
    },
    ve: function (k) { var s = ENT[k]; return !!(sw && s && tiene(s)); },
    modulos: function () { return sw ? datosModulos() : []; },
    // se cumple cuando ya se sabe qué opciones le tocan a quien entró (menu_sin(); el recorrido general lo espera)
    listo: sinListo,
    // la sección abierta (para el botón «?» de ayuda, portal/guia_tab.js): su clave, su nombre y su módulo
    actual: function () { var a = sw ? activo() : null; return a ? { k: a.k, t: nombre(a), v: a.v, m: a.m.k, mt: a.m.t } : null; },
    ensena: ensena,
    suelta: suelta,
    // En qué forma está el menú y cómo se usa, en palabras (una sola versión: la usan el recorrido general,
    // bienvenida_tab.js, y el aviso de que se quitó el menú arriba, menu_rec_tab.js)
    forma: forma,
    comoSeUsa: function () { return COMO[forma()]; },
    // el menú tal como se ve ahora (el ☰ en el celular), para iluminarlo en un recorrido
    donde: function () { return movil() ? document.querySelector('.pm-ham') : side; }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arranca);
  else arranca();
})();
