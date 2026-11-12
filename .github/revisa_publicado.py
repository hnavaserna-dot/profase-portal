#!/usr/bin/env python3
"""Revisar lo publicado (Héctor Daniel, 4-nov-2026, 13:11 a 13:12: «Y porque no puedes desde aquí revisar eso?»;
«Si, para lo nuevo y lo anterior porfa»).

Claude trabaja en una computadora en la nube que no puede abrir crmprofase.com.mx, así que no podía confirmar que lo
publicado ya estuviera en vivo. Esta revisión corre en GitHub (que sí entra a internet), sin llaves ni contraseñas, solo
con lo que cualquiera ve sin sesión:

1. Espera a que la página en vivo traiga la misma versión que este repositorio (version.json; hasta 15 minutos).
2. Baja todos los archivos publicados (páginas, scripts, estilos, imágenes; lo nuevo y lo de antes) y revisa que cada
   uno sea idéntico al del repositorio.
3. Dice si el portal está abierto o en cierre temporal (cierre.json).
4. Abre en un navegador cada página, en tamaño iPhone, y las vistas principales también en laptop, y anota si alguna
   truena (error de JavaScript) o pide un archivo del portal que no existe. Sin sesión, las páginas llevan a la entrada:
   así se revisa que todos sus scripts carguen bien.

Corre con cada publicación (push a main), una vez al día con todo lo de antes y cuando se pida a mano. El resultado
queda en el resumen de la corrida y en su última línea («RESULTADO: …»); el Claude de Daniel y el de Fernando lo leen
con `gh run list/view -R hnavaserna-dot/profase-portal` (ver CLAUDE.md de profase-datos, «Revisar lo publicado»).
Si algo sale mal, la corrida sale en rojo. Nunca imprime nada que no sea público.
"""
import hashlib
import json
import os
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone

SITIO = os.environ.get("SITIO", "https://crmprofase.com.mx").rstrip("/")
ESPERA_MAX = int(os.environ.get("ESPERA_MAX", "900"))
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NO_SE_SIRVEN = {"CNAME", "README.md"}
# Lo que una página pide y todavía no existe a propósito (no es falla: sale como nota, para que no se olvide)
ESPERADOS = {}   # (el logo de Multinacional ya está desde el 12-nov-2026: img/multinacional.png)
VISTAS_LAPTOP = ["index.html", "inicio.html", "director.html", "gerentes.html", "contadores.html"]
UA = "PROFASE-revisa-publicado/1.0"
SELLO = os.environ.get("GITHUB_RUN_ID", "") + "-" + str(int(time.time()))
FALLAS = []
NOTAS = []
RESUMEN = []


def falla(m):
    FALLAS.append(m)
    print("FALLA- " + m, flush=True)


def nota(m):
    NOTAS.append(m)
    print("nota - " + m, flush=True)


def baja(ruta, extra=""):
    url = f"{SITIO}/{ruta}?revisa={SELLO}{extra}"
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Cache-Control": "no-cache"})
    try:
        with urllib.request.urlopen(req, timeout=40) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, b""
    except Exception as e:  # noqa: BLE001
        return 0, str(e).encode("utf-8", "replace")


def version_repo():
    with open(os.path.join(RAIZ, "version.json"), encoding="utf-8") as f:
        return json.load(f).get("version")


def espera_version(v):
    t0 = time.time()
    vista = None
    while True:
        st, cuerpo = baja("version.json", "-%d" % int(time.time()))
        if st == 200:
            try:
                vista = json.loads(cuerpo.decode("utf-8")).get("version")
            except ValueError:
                vista = None
            if vista == v:
                seg = round(time.time() - t0)
                print(f"ok   - la página en vivo ya trae la versión {v} (esperé {seg} s)", flush=True)
                RESUMEN.append(f"Versión en vivo: **{v}** (igual a la del repositorio; esperé {seg} s)")
                return True
        if time.time() - t0 > ESPERA_MAX:
            falla(f"después de {ESPERA_MAX // 60} minutos la página en vivo sigue en la versión {vista or '¿?'}"
                  f" y la del repositorio es {v} (GitHub Pages no ha publicado o se quedó a medias)")
            return False
        time.sleep(15)


def archivos():
    out = []
    for raiz, dirs, nombres in os.walk(RAIZ):
        dirs[:] = sorted(d for d in dirs if not d.startswith("."))
        for n in sorted(nombres):
            rel = os.path.relpath(os.path.join(raiz, n), RAIZ).replace(os.sep, "/")
            if n.startswith(".") or rel in NO_SE_SIRVEN:
                continue
            out.append(rel)
    return out


def huella(b):
    return hashlib.sha256(b).hexdigest()


def compara(lista):
    def uno(rel):
        with open(os.path.join(RAIZ, rel), "rb") as f:
            local = f.read()
        st, vivo = baja(rel)
        return rel, st, huella(local) == huella(vivo) if st == 200 else False

    # Lo que recién se publicó puede tardar en llegar a todos los servidores de GitHub (y un cambio que no mueve la
    # versión, como cierre.json, llega sin que version.json cambie): lo que no cuadra se vuelve a revisar cada 20 s,
    # hasta 15 minutos desde que empezó la revisión.
    t0 = time.time()
    pendientes = list(lista)
    while True:
        malos = []
        with ThreadPoolExecutor(max_workers=12) as ex:
            for rel, st, igual in ex.map(uno, pendientes):
                if not igual:
                    malos.append((rel, st))
        if not malos or time.time() - t0 > ESPERA_MAX:
            break
        pendientes = [m[0] for m in malos]
        time.sleep(20)
    for rel, st in malos:
        if st == 200:
            falla(f"{rel}: lo que está en vivo no es igual a lo del repositorio")
        elif st == 0:
            falla(f"{rel}: no se pudo bajar (sin respuesta de la página)")
        else:
            falla(f"{rel}: la página contesta {st} (no está publicado)")
    ok = len(lista) - len(malos)
    print(f"ok   - {ok} de {len(lista)} archivos publicados son idénticos a los del repositorio", flush=True)
    RESUMEN.append(f"Archivos idénticos a los del repositorio: **{ok} de {len(lista)}**")


def cierre():
    st, cuerpo = baja("cierre.json")
    if st != 200:
        falla(f"cierre.json contesta {st}")
        return
    try:
        c = json.loads(cuerpo.decode("utf-8"))
    except ValueError:
        falla("cierre.json no se puede leer (no es JSON)")
        return
    ahora = datetime.now(timezone.utc)

    def hora(t):
        try:
            return datetime.fromisoformat(str(t).replace("Z", "+00:00"))
        except ValueError:
            return None
    cerrado = bool(c.get("cerrado"))
    if cerrado and c.get("hasta") and hora(c["hasta"]) and hora(c["hasta"]) <= ahora:
        cerrado = False
    if cerrado and c.get("desde") and hora(c["desde"]) and hora(c["desde"]) > ahora:
        cerrado = False
    if cerrado:
        nota("el portal está en CIERRE TEMPORAL (cierre.json): a todos los lleva a la pantalla de cierre")
        RESUMEN.append("Portal: **en cierre temporal** (cierre.json)")
    else:
        print("ok   - el portal está abierto (cierre.json)", flush=True)
        RESUMEN.append("Portal: **abierto** (cierre.json)")


def navegador(paginas):
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        falla("no se pudo cargar el navegador de la revisión (playwright)")
        return
    origen = SITIO.split("//", 1)[1]
    revisadas = 0
    with sync_playwright() as p:
        nav = p.chromium.launch()
        formas = [("iPhone", dict(viewport={"width": 390, "height": 844}, device_scale_factor=1, is_mobile=True,
                                   has_touch=True, locale="es-MX", timezone_id="America/Monterrey"), paginas),
                  ("laptop", dict(viewport={"width": 1440, "height": 900}, locale="es-MX",
                                  timezone_id="America/Monterrey"), [x for x in VISTAS_LAPTOP if x in paginas])]
        for forma, opciones, lista in formas:
            for pag in lista:
                ctx = nav.new_context(**opciones)
                pg = ctx.new_page()
                errores, faltan = [], []
                pg.on("pageerror", lambda e, l=errores: l.append(str(e).split("\n")[0][:200]))

                def respuesta(r, l=faltan):
                    try:
                        if origen in r.url and r.status >= 400 and not r.url.split("?")[0].endswith("/favicon.ico"):
                            l.append(f"{r.status} {r.url.split(origen, 1)[1].split('?')[0]}")
                    except Exception:  # noqa: BLE001
                        pass

                def fallo(r, l=faltan):
                    try:
                        if origen in r.url and (r.failure or "") not in ("net::ERR_ABORTED",):
                            l.append(f"no cargó {r.url.split(origen, 1)[1].split('?')[0]} ({r.failure})")
                    except Exception:  # noqa: BLE001
                        pass
                pg.on("response", respuesta)
                pg.on("requestfailed", fallo)
                try:
                    pg.goto(f"{SITIO}/{pag}?revisa={SELLO}", wait_until="load", timeout=45000)
                    pg.wait_for_timeout(3000)
                except Exception as e:  # noqa: BLE001
                    errores.append("no abrió: " + str(e).split("\n")[0][:160])
                ctx.close()
                revisadas += 1
                for e in sorted(set(errores)):
                    falla(f"{pag} ({forma}): error en la página: {e}")
                for e in sorted(set(faltan)):
                    ruta = e.split(" ", 1)[-1]
                    if ruta in ESPERADOS:
                        esperado = f"{pag} pide {ruta}, que todavía no existe: {ESPERADOS[ruta]}"
                        if esperado not in NOTAS:
                            nota(esperado)
                    else:
                        falla(f"{pag} ({forma}): {e}")
                faltan = [e for e in faltan if e.split(" ", 1)[-1] not in ESPERADOS]
                if not errores and not faltan:
                    print(f"ok   - {pag:28} ({forma}) abre sin errores", flush=True)
        nav.close()
    RESUMEN.append(f"Páginas abiertas en el navegador: **{revisadas}** ({len(paginas)} en tamaño iPhone y "
                   f"{len([x for x in VISTAS_LAPTOP if x in paginas])} también en laptop)")


def main():
    v = version_repo()
    print(f"Revisando {SITIO} contra el repositorio (versión {v})", flush=True)
    if espera_version(v):
        lista = archivos()
        compara(lista)
        cierre()
        navegador([x for x in lista if x.endswith(".html") and "/" not in x])
    resumen = os.environ.get("GITHUB_STEP_SUMMARY")
    titulo = "✅ Lo publicado está en vivo y abre bien" if not FALLAS else f"❌ {len(FALLAS)} cosas por revisar en lo publicado"
    texto = [f"## {titulo}", ""] + [f"- {r}" for r in RESUMEN]
    if FALLAS:
        texto += ["", "### Por revisar"] + [f"- {f}" for f in FALLAS[:80]]
    if NOTAS:
        texto += ["", "### Notas"] + [f"- {n}" for n in NOTAS]
    if resumen:
        with open(resumen, "a", encoding="utf-8") as f:
            f.write("\n".join(texto) + "\n")
    if FALLAS:
        print(f"RESULTADO: {len(FALLAS)} cosas por revisar (versión {v})", flush=True)
        sys.exit(1)
    print(f"RESULTADO: ok — la versión {v} está en vivo, todo es idéntico al repositorio y abre sin errores", flush=True)


if __name__ == "__main__":
    main()
