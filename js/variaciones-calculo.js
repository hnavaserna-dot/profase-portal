/* Portal PROFASE · el cálculo de Variaciones (los hallazgos que salen de las balanzas con los «Criterios de la bitácora»).
   Una sola pieza para la pantalla Reportes › Variaciones / Movimientos (variaciones.html) y para el «Excel de hallazgos»
   (js/hallazgos.js), que la usa para las cifras de su hoja «Bitácora Variación» desde cualquiera de las tres pantallas de
   Reportes (12-nov-2026, pedido de Fernando Cadengo con la hoja que armó Fernando Barbosa: «3 b, 4 b, sí así es»).
   Es el mismo código que vivía en variaciones.html, tal cual (se movió aquí, no se copió): si cambia un criterio o cómo se
   calcula una variación, se cambia aquí y lo toman las dos. No lee nada de la base salvo los criterios guardados
   (var_criterios/actual, lo mismo que leía la pantalla) y no escribe nada.

   const { construir, normCrit, cargarCriterios, desempaca, … } = window.PROFASE_VARCALC;
   construir(B, C) → { filas: [[rid, cliente, mes, cuenta, variación, mes anterior, mes evaluado, …]], clientes, cuentas, … }
   cifras(fila) → { v, ap, ac, dif, acr, cero }: lo que enseña cada renglón (Variación, Mes anterior, Mes evaluado, Cambio). */
(function(){
"use strict";
if (window.PROFASE_VARCALC) return;

async function desempaca(doc){
  if(!doc || !doc.b64) return null;
  if(typeof DecompressionStream==="undefined") throw new Error("este navegador no puede abrir los datos; actualízalo");
  const bin = Uint8Array.from(atob(doc.b64), c=>c.charCodeAt(0));
  const st = new Blob([bin]).stream().pipeThrough(new DecompressionStream("gzip"));
  return JSON.parse(await new Response(st).text());
}

/* ---------- criterios de la bitácora (editables; de inicio, los de la hoja «Criterios» del Excel) ---------- */
const CRIT_EXCEL = {
  umbral: 100,              // incremento: se registra si sube +umbral % o más
  umbralBaja: 100,          // disminución: se registra si cae umbralBaja % o más
  excluirAltas: true,       // altas en pasivo, capital y bimestrales (saldo inicial o meses anteriores en cero)
  baseUltimo: true,         // (ya no se usa en activo, ingresos, costos y gastos: ver contraCero)
  contraCero: true,         // 3-nov-2026 (Fernando Cadengo): mes anterior en $0 con balanza → se compara contra $0 y se registra
  excluirBajas: true,       // actual en cero
  evaluarEnero: false,      // enero contra diciembre del año anterior
  baseAbs: true,            // (actual − anterior) ÷ |anterior|; si no, actual ÷ anterior − 1
  nomina: true,             // regla de nómina: la baja se registra si rompe patrón
  nominaRangos: "601.01-601.31, 699.01-699.31",
  nominaMeses: 2,           // meses previos del año con movimiento para romper patrón
  bimestral: true,          // regla bimestral (SIPARE): Infonavit, SAR, RCV y sus provisiones
  pagoProv: true,           // la provisión de un mes (abono) debe pagarse completa el mes siguiente (cargo)
  pagoRangos: "211.01.01, 211.02.01-211.02.02, 211.03.01",
  pagoTolMxn: 100,          // tolerancia: diferencias de hasta este importe…
  pagoTolPct: 1,            // …o de este % de la provisión no son hallazgo
  bimestralRangos: "601.27.01, 601.28.01-601.28.02, 211.02.01-211.02.02, 211.03.01-211.03.02",
  acreedora: true,          // pasivo y capital (acreedoras): la variación se mide sobre el saldo, no sobre el movimiento
  acreedoraRangos: "200-399",
  saldoContrario: true      // saldo final negativo (deudor) en una acreedora: hallazgo sin importar el porcentaje
};
function normCrit(x){
  const c = Object.assign({}, CRIT_EXCEL, x||{});
  c.umbral = Math.max(0, Number(c.umbral)||0);
  c.umbralBaja = Math.max(0, Number(c.umbralBaja)||0);
  c.nominaMeses = Math.max(1, Math.round(Number(c.nominaMeses)||1));
  ["excluirAltas","excluirBajas","evaluarEnero","baseAbs","nomina","bimestral","baseUltimo","contraCero","pagoProv","acreedora","saldoContrario"].forEach(k=>{ c[k] = !!c[k]; });
  c.nominaRangos = String(c.nominaRangos||"").slice(0,300);
  c.bimestralRangos = String(c.bimestralRangos==null ? CRIT_EXCEL.bimestralRangos : c.bimestralRangos).slice(0,300);
  c.pagoRangos = String(c.pagoRangos==null ? CRIT_EXCEL.pagoRangos : c.pagoRangos).slice(0,300);
  c.acreedoraRangos = String(c.acreedoraRangos==null ? CRIT_EXCEL.acreedoraRangos : c.acreedoraRangos).slice(0,300);
  c.pagoTolMxn = Math.max(0, Number(c.pagoTolMxn)||0);
  c.pagoTolPct = Math.max(0, Number(c.pagoTolPct)||0);
  return c;
}
const rangosDe = txt => String(txt||"").split(/[,;\n]+/).map(s=>s.trim()).filter(Boolean)
  .map(s=>{ const [a,b] = s.split(/\s*[-–]\s*/); return [a, b||a]; }).filter(([a])=>/^\d{3}(\.\d\d){0,2}$/.test(a));
const enRango = (rs, cta) => rs.some(([a,b])=>{ const k = cta.slice(0,a.length); return k>=a && k<=b.slice(0,a.length); });
/* Cuentas acreedoras (pasivo 2xx y capital 3xx, o los rangos de «Criterios de la bitácora») que se evalúan sobre el saldo.
   Las de «Pago de provisiones», mientras esa regla esté activa, siguen solo con esa regla. */
function acreedoraDe(C, B){
  const rA = C.acreedora && B && B.sal ? rangosDe(C.acreedoraRangos) : [];
  const rP = C.pagoProv && B && B.ca ? rangosDe(C.pagoRangos) : [];
  return cta => rA.length>0 && enRango(rA, cta) && !(rP.length>0 && enRango(rP, cta));
}
const r2 = x => Math.round((Number(x)||0)*100)/100;
const sentidoDe = aum => aum>0 ? "Aumentó" : aum<0 ? "Disminuyó" : "Sin cambio";
async function cargarCriterios(){
  if(!window.claude) return normCrit();
  const db = await claude.use("db").catch(()=>null);
  if(!db) return normCrit();
  try{ const d = await db.doc("var_criterios/actual").get(); return normCrit(d.exists ? d.data() : null); }
  catch(e){ return normCrit(); }
}

/* Aplica los criterios a los movimientos de SQL y arma la bitácora en el formato que usa la página. */
const MESES_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
function rubroDe(cta){
  const p = +cta.slice(0,3);
  if(p===699) return "Gastos no deducibles";
  if(p>=600 && p<700) return "Gastos";
  if(p>=400 && p<500) return "Ingresos";
  if(p===701) return "Gastos financieros";
  if(p===702) return "Productos financieros";
  if(p>=703 && p<800) return "Resultado financiero";
  if(p>=800) return "Cuentas de orden";
  if(p>=500) return "Costos";
  if(p>=300) return "Capital";
  if(p>=200) return "Pasivo";
  return "Activo";
}
/* Meses en que la balanza de un cliente viene completa en $0 (3-nov-2026, pedido de Fernando Cadengo): entre su primer y su
   último mes con balanza, un mes sin movimiento en ninguna cuenta quiere decir que la información de ese mes no está. Ese mes
   no da hallazgos ni se usa para comparar (se compara contra el último mes que sí la trae) y sale en «Balanzas en 0».
   Una sola versión: la usan construir(), «Resueltas» y la lista. */
function mesesVacios(B){
  const con = new Set(), primero = new Map(), hasta = new Map();
  for(const [ci,,p] of (B.mov||[])){
    con.add(ci+"|"+p);
    if(!(primero.get(ci) <= p)) primero.set(ci, p);
    if(!(hasta.get(ci) >= p)) hasta.set(ci, p);
  }
  const es = (ci, p) => { const a = primero.get(ci); return !!a && p>=a && p<=hasta.get(ci) && !con.has(ci+"|"+p); };
  const desde = B.anios && B.anios.length ? B.anios[0]+"-01" : "";
  const lista = [];
  for(const [ci,a] of primero){
    let [y,m] = a.split("-").map(Number); const z = hasta.get(ci);
    for(let n=0; n<240; n++){
      const p = y+"-"+String(m).padStart(2,"0"); if(p > z) break;
      if(p >= desde && !con.has(ci+"|"+p)) lista.push([ci, p]);
      if(++m > 12){ m = 1; y++; }
    }
  }
  return {es, primero, hasta, lista};
}
function construir(B, C){
  if(!B.mov) return B;                       // archivo anterior: ya trae los hallazgos calculados
  const rangos = rangosDe(C.nominaRangos), rangosB = C.bimestral ? rangosDe(C.bimestralRangos) : [];
  const rangosP = C.pagoProv && B.ca ? rangosDe(C.pagoRangos) : [];
  const ca = new Map(); for(const [ci,ct,p,c,a] of (B.ca||[])) ca.set(ci+"|"+ct+"|"+p, [c,a]);
  const sal = new Map(); for(const [ci,ct,p,v] of (B.sal||[])) sal.set(ci+"|"+ct+"|"+p, v);
  const esAcr = acreedoraDe(C, B);
  const fmtP = v => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(v);
  const esNomina = cta => enRango(rangos, cta);
  const per = (y,m) => y+"-"+String(m).padStart(2,"0");
  const atras = (y,m,k) => { m -= k; while(m<1){ m += 12; y--; } return per(y,m); };
  const mesDe = p => MESES_ES[+p.slice(5)-1];
  const mesAnio = p => MESES_ES[+p.slice(5)-1]+" "+p.slice(0,4);
  // último mes con movimiento antes de (y,m), buscando desde «desde» meses atrás y hasta 12 (lo usa la regla bimestral)
  const ultimoCon = (k, y, m, desde) => {
    for(let q=desde; q<=12; q++){ const p = atras(y,m,q), v = mov.get(k+p); if(v) return {p, v}; }
    return null;
  };
  const VAC = mesesVacios(B);
  const mov = new Map(), ultimo = new Map(), pares = new Map();
  for(const [ci,ct,p,v] of B.mov){
    mov.set(ci+"|"+ct+"|"+p, v);
    if(!(ultimo.get(ci) >= p)) ultimo.set(ci, p);
    pares.set(ci+"|"+ct, [ci,ct]);
  }
  // acreedoras: también las que solo traen saldo (un saldo contrario puede no tener movimiento)
  for(const [ci,ct] of (B.sal||[])){ const k = ci+"|"+ct; if(!pares.has(k) && ultimo.has(ci) && esAcr(B.cuentas[ct][0])) pares.set(k, [ci,ct]); }
  const mIni = C.evaluarEnero ? 1 : 2;
  const hall = [];
  for(const [ci,ct] of pares.values()){
    const cta = B.cuentas[ct][0], nom = esNomina(cta), bim = rangosB.length>0 && enRango(rangosB, cta), hasta = ultimo.get(ci);
    const pag = rangosP.length>0 && enRango(rangosP, cta), acr = !pag && esAcr(cta);
    for(const y of B.anios){
      for(let m=mIni; m<=12; m++){
        const p = per(y,m); if(p > hasta) break;
        if(VAC.es(ci, p)) continue;          // la balanza de ese mes viene completa en $0: no da hallazgos
        if(pag){
          // provisión por pagar: el abono del mes anterior (provisión) se paga con el cargo de este mes
          const k = ci+"|"+ct+"|", pAnt = atras(y,m,1);
          const prov = (ca.get(k+pAnt)||[0,0])[1], pago = (ca.get(k+p)||[0,0])[0];
          if(!prov) continue;
          const dif = pago - prov, tol = x => Math.max(C.pagoTolMxn, Math.abs(x)*C.pagoTolPct/100) + 1e-9;
          if(Math.abs(dif) <= tol(prov)) continue;
          if(bim){
            // bimestrales: el pago puede cubrir dos provisiones juntas (las dos del bimestre)
            const prov2 = (ca.get(k+atras(y,m,2))||[0,0])[1], provM = (ca.get(k+p)||[0,0])[1], pagoSig = (ca.get(k+(m===12 ? per(y+1,1) : per(y,m+1)))||[0,0])[0];
            if(Math.abs(pago-(prov+prov2)) <= tol(prov+prov2)) continue;
            if(!pago && Math.abs(pagoSig-(prov+provM)) <= tol(prov+provM)) continue;
          }
          hall.push({ci, ct, y, m, v: dif/Math.abs(prov), ant: prov, act: pago, pago: true,
            tag: pago ? `PAGO DISTINTO: la provisión de ${mesAnio(pAnt)} (${fmtP(prov)}) se pagó por ${fmtP(pago)} en ${MESES_ES[m-1]}; diferencia ${fmtP(dif)}`
                      : `SIN PAGO: la provisión de ${mesAnio(pAnt)} (${fmtP(prov)}) no tiene pago en ${MESES_ES[m-1]}`});
          continue;
        }
        if(acr){
          // cuenta acreedora: aumento del mes = abonos − cargos; variación = (saldo final − saldo inicial) ÷ |saldo inicial|,
          // con el saldo acreedor en positivo (la balanza ya los trae así). Saldo inicial en cero: regla de altas.
          // Saldo final en cero: no es hallazgo (lo decidió Daniel el 28-oct).
          const k = ci+"|"+ct+"|", fin = sal.get(k+p) || 0, mv = mov.get(k+p) || 0, ini = r2(fin - mv);
          if(!fin) continue;
          const cav = ca.get(k+p) || (B.caTodas && /^[23]/.test(cta) ? [0,0] : null), aum = cav ? r2(cav[1] - cav[0]) : r2(mv);
          const contra = C.saldoContrario && fin < -0.004;
          let v = null, porVar = false, alta = false;
          if(!ini){ if(!C.excluirAltas){ alta = true; v = fin>0 ? 1 : -1; } }
          else { v = (fin - ini)/Math.abs(ini); porVar = v>=0 ? v*100 >= C.umbral - 1e-9 : -v*100 >= C.umbralBaja - 1e-9; }
          if(!porVar && !alta && !contra) continue;
          if(v===null) v = fin>0 ? 1 : -1;
          const cambio = !aum && (!cav || (!cav[0] && !cav[1])) ? "sin movimiento en el mes"
            : `${sentidoDe(aum).toLowerCase()} ${fmtP(Math.abs(aum))}`+(cav ? ` (abonos ${fmtP(cav[1])} − cargos ${fmtP(cav[0])})` : "");
          const tag = contra ? `SALDO CONTRARIO A SU NATURALEZA: saldo final deudor de ${fmtP(Math.abs(fin))}; saldo inicial ${fmtP(ini)}; ${cambio}`
            : alta ? `ALTA DE CUENTA: saldo inicial en cero; saldo final ${fmtP(fin)}; ${cambio}`
            : `VARIACIÓN DE SALDO: saldo inicial ${fmtP(ini)} → saldo final ${fmtP(fin)}; ${cambio}`;
          hall.push({ci, ct, y, m, v, ant: ini, act: fin, tag, acr: true, contra, aum});
          continue;
        }
        if(bim){
          // cuentas que se mueven cada dos meses: el mes en cero es normal y la base es el mismo mes del bimestre anterior
          const k = ci+"|"+ct+"|", act = mov.get(k+p) || 0;
          const a1 = mov.get(k+atras(y,m,1)) || 0, a2 = mov.get(k+atras(y,m,2)) || 0;
          if(!act){
            if(a1 || !a2) continue;
            if(VAC.es(ci, atras(y,m,1))) continue;   // el mes anterior no trae balanza: no se sabe si faltó

            const previos = [];
            for(let q=1; q<m; q++) if(mov.get(k+per(y,q))) previos.push(MESES_ES[q-1]);
            if(previos.length < C.nominaMeses) continue;
            hall.push({ci, ct, y, m, v:-1, ant:a2, act:0,
              tag:`FALTA BIMESTRE: sin movimiento en ${mesDe(atras(y,m,1))} ni ${MESES_ES[m-1]}; traía en ${previos.join(", ")}`});
            continue;
          }
          let ant = a2 || a1, base = a2 ? atras(y,m,2) : atras(y,m,1), reap = null;
          if(!ant){ reap = ultimoCon(k, y, m, 3); if(reap){ ant = reap.v; base = reap.p; } }
          let v, tag;
          if(!ant){
            if(C.excluirAltas) continue;
            v = act>0 ? 1 : -1; tag = "ALTA DE CUENTA";
          } else {
            v = C.baseAbs ? (act-ant)/Math.abs(ant) : act/ant - 1;
            if(v>=0 ? v*100 < C.umbral - 1e-9 : -v*100 < C.umbralBaja - 1e-9) continue;
            tag = reap ? `REAPARECE: último movimiento en ${mesAnio(base)}; comparado contra ese mes`
                       : `BIMESTRAL: comparado contra ${mesDe(base)} (${a2 ? "mismo mes del bimestre anterior" : "mes anterior"})`;
          }
          hall.push({ci, ct, y, m, v, ant, act, tag});
          continue;
        }
        // activo, ingresos, costos y gastos: contra el mes anterior; si ese mes la balanza viene completa en $0, contra el
        // último mes que sí la trae (hasta 12 atrás). Si el mes anterior sí trae balanza y esta cuenta está en $0, se compara
        // contra $0 («Comparado contra $0»; 3-nov-2026, Fernando Cadengo). Antes del primer mes con balanza no hay base.
        let q = 1, bp = atras(y,m,1);
        while(q<12 && VAC.es(ci, bp)){ q++; bp = atras(y,m,q); }
        const pri = VAC.primero.get(ci);
        if(!pri || bp < pri || VAC.es(ci, bp)) continue;
        let ant = mov.get(ci+"|"+ct+"|"+bp) || 0;
        const act = mov.get(ci+"|"+ct+"|"+p) || 0;
        if(ant===0 && act===0) continue;
        const salto = q>1 ? (q===2 ? " (el mes de en medio no trae balanza)" : ` (los ${q-1} meses de en medio no traen balanza)`) : "";
        let v, tag = "", cero = false;
        if(ant===0){
          if(C.contraCero){
            v = act>0 ? 1 : -1; cero = true;
            tag = `CONTRA CERO: ${mesAnio(bp)} sin movimiento en esta cuenta${salto}; se compara contra $0 y la variación puede verse muy alta`;
          } else {
            if(C.excluirAltas) continue;
            v = act>0 ? 1 : -1; tag = "ALTA DE CUENTA";
          }
        } else {
          v = C.baseAbs ? (act-ant)/Math.abs(ant) : act/ant - 1;
          if(act===0){
            const previos = [];
            for(let k=1; k<m; k++) if(mov.get(ci+"|"+ct+"|"+per(y,k))) previos.push(MESES_ES[k-1]);
            if(C.nomina && nom && previos.length >= C.nominaMeses) tag = "ROMPE PATRÓN NÓMINA: "+previos.join(", ");
            else if(C.excluirBajas || (C.nomina && nom)) continue;
            else tag = `BAJA DE CUENTA: ${mesAnio(bp)} traía ${fmtP(ant)}${salto} y ${MESES_ES[m-1].toLowerCase()} quedó en $0`;
          } else if(v>=0 ? v*100 < C.umbral - 1e-9 : -v*100 < C.umbralBaja - 1e-9) continue;
          if(salto && !tag) tag = `MES ANTERIOR SIN BALANZA: comparado contra ${mesAnio(bp)}${salto}`;
        }
        hall.push({ci, ct, y, m, v, ant, act, tag, cero});
      }
    }
  }
  const rec = new Map(); hall.forEach(h=>{ const k=h.y+"|"+h.ci+"|"+h.ct; rec.set(k,(rec.get(k)||0)+1); });
  const usadosC = [...new Set(hall.map(h=>h.ci))].sort((a,b)=>a-b);
  const usadosK = [...new Set(hall.map(h=>h.ct))].sort((a,b)=>B.cuentas[a][0].localeCompare(B.cuentas[b][0]));
  const iC = new Map(usadosC.map((c,i)=>[c,i])), iK = new Map(usadosK.map((c,i)=>[c,i]));
  const rubros = [...new Set(usadosK.map(k=>rubroDe(B.cuentas[k][0])))];
  const mesesPorAnio = {};
  let ultimoGlobal = "";
  for(const p of ultimo.values()) if(p > ultimoGlobal) ultimoGlobal = p;
  for(const y of B.anios){
    let max = 0; for(const p of ultimo.values()) if(p.startsWith(y+"-")) max = Math.max(max, +p.slice(5));
    if(!max && String(ultimoGlobal) > String(y)) max = 12;
    mesesPorAnio[y] = []; for(let m=mIni; m<=Math.max(mIni,max); m++) mesesPorAnio[y].push([m, MESES_ES[m-1]]);
  }
  const yU = B.anios[B.anios.length-1];
  return {
    generado: B.generado, anios: B.anios, totalClientes: B.totalClientes, rubros, mesesPorAnio,
    periodo: `${MESES_ES[mIni-1]} ${B.anios[0]} a ${ultimoGlobal ? MESES_ES[+ultimoGlobal.slice(5)-1] : ""} ${yU}`,
    clientes: usadosC.map(c=>B.clientes[c]),
    cuentas: usadosK.map(k=>{ const [cta,n] = B.cuentas[k]; return [cta, +cta.replace(/\D/g,""), n, rubros.indexOf(rubroDe(cta)), esNomina(cta)?1:0]; }),
    // [rid, cliente, mes, cuenta, variación, mes anterior, mes evaluado, recurrencia, calculado, marca, año,
    //  acreedora (sobre saldo), saldo contrario, aumento del mes (abonos − cargos), cargos del mes, abonos del mes,
    //  comparado contra $0]
    // En las acreedoras, «mes anterior» es el saldo inicial y «mes evaluado» el saldo final del mes.
    filas: hall.sort((a,b)=>a.ci-b.ci || a.y-b.y || a.m-b.m || B.cuentas[a.ct][0].localeCompare(B.cuentas[b.ct][0])).map(h=>{
      const cav = ca.get(h.ci+"|"+h.ct+"|"+per(h.y,h.m)) || (h.acr && B.caTodas && /^[23]/.test(B.cuentas[h.ct][0]) ? [0,0] : null);
      return [B.clientes[h.ci][1]+"_"+h.m+"_"+B.cuentas[h.ct][0]+(h.pago ? "_pago" : "")+(h.y===B.anioBase ? "" : "_"+h.y),
      iC.get(h.ci), h.m, iK.get(h.ct), h.v, h.ant, h.act, rec.get(h.y+"|"+h.ci+"|"+h.ct), 0, h.tag, h.y,
      h.acr ? 1 : 0, h.contra ? 1 : 0, h.acr ? h.aum : null, cav ? cav[0] : null, cav ? cav[1] : null, h.cero ? 1 : 0]; }),
    // meses con la balanza completa en $0: [cliente (índice de B.clientes), "AAAA-MM"]
    vacios: VAC.lista
  };
}

/* lo que enseña un renglón de la bitácora: la variación, el mes anterior, el mes evaluado y el cambio (en las acreedoras, el
   aumento del mes: abonos − cargos), y si se comparó contra $0 (sin porcentaje). La pantalla y el Excel, igual. */
function cifras(r){
  const ap = r[5], ac = r[6], acr = !!r[11], aum = r[13]==null ? null : r[13];
  const dif = acr && aum!==null ? aum : (ap!==null && ac!==null) ? ac-ap : null;
  return { v: r[4], ap, ac, dif, acr, aum, cero: !!r[16] || /^CONTRA CERO/.test(r[9]||"") };
}

window.PROFASE_VARCALC = { CRIT_EXCEL, normCrit, rangosDe, enRango, acreedoraDe, r2, sentidoDe, cargarCriterios, MESES_ES, rubroDe,
  mesesVacios, construir, desempaca, cifras };
})();
