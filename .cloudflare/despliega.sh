#!/usr/bin/env bash
# Sube la copia de crmprofase.com.mx a Cloudflare y revisa que sea idéntica a lo que publicó GitHub. La pone
# profase-datos/herramientas/cloudflare/reparte.py: no se cambia a mano. Se corre desde la raíz del repositorio, con la
# llave CLOUDFLARE_API_TOKEN en el ambiente (nunca se imprime).
set -uo pipefail
NOMBRE="crmprofase"
CARPETA="."
CUENTA="fbd0807e5e668493ce847adbb0a09fb6"
COPIA="https://crmprofase.hnavaserna.workers.dev"
PRUEBA="index.html version.json cierre.json js/portal.js js/menu.js"
MARCOS="si"

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "::notice::Todavía no está la llave de Cloudflare (CLOUDFLARE_API_TOKEN): no se sube la copia. GitHub Pages sigue igual."
  exit 0
fi
(cd .cloudflare && sha256sum -c --quiet worker.sha256) || {
  echo "::error::.cloudflare/worker.js no es la copia de profase-datos. Qué hacer: en profase-datos corre «python3 -I herramientas/cloudflare/reparte.py» y sube lo que cambie."
  exit 1
}
export CLOUDFLARE_ACCOUNT_ID="$CUENTA"
subio=""
for i in 1 2 3; do
  if (cd .cloudflare && npx --yes wrangler@4 deploy --config wrangler.jsonc); then subio=1; break; fi
  echo "Cloudflare no aceptó la copia (intento $i de 3); se vuelve a intentar en 20 segundos."
  sleep 20
done
if [ -z "$subio" ]; then
  echo "::error::Cloudflare no aceptó la copia de $NOMBRE en 3 intentos. Las páginas siguen en GitHub Pages; la copia de Cloudflare se queda con la versión anterior. Qué hacer: vuelve a correr esta acción; si sigue, revisa que la llave CLOUDFLARE_API_TOKEN siga vigente (la saca y la pega Héctor Daniel)."
  exit 1
fi

# La copia tiene que ser idéntica: archivo por archivo y sus cabeceras. Cloudflare tarda unos segundos en tenerla.
revisa() {
  local mal=""
  for f in $PRUEBA; do
    [ -f "$CARPETA/$f" ] || continue
    local aqui ahi
    aqui=$(sha256sum < "$CARPETA/$f" | cut -d' ' -f1)
    ahi=$(curl -fsS -m 20 "$COPIA/$f?revisa=$RANDOM" | sha256sum | cut -d' ' -f1) || ahi="no contestó"
    [ "$aqui" = "$ahi" ] || mal="$mal $f"
  done
  local cab
  cab=$(curl -fsS -m 20 -o /dev/null -D - "$COPIA/index.html" | tr -d '
') || cab=""
  echo "$cab" | grep -qi '^access-control-allow-origin: \*$' || mal="$mal (cabecera de acceso)"
  if [ "$MARCOS" = "si" ]; then
    echo "$cab" | grep -qi "^content-security-policy: frame-ancestors 'self'$" || mal="$mal (cabecera de los marcos)"
  fi
  local nada
  nada=$(curl -s -m 20 -o /dev/null -w '%{http_code}' "$COPIA/no-existe-$RANDOM.html")
  [ "$nada" = "404" ] || mal="$mal (página que no existe: $nada)"
  echo "$mal"
}
for i in $(seq 1 9); do
  mal=$(revisa)
  if [ -z "$mal" ]; then
    echo "La copia de Cloudflare ($COPIA) es idéntica a lo publicado."
    exit 0
  fi
  sleep 10
done
echo "::error::La copia de Cloudflare de $NOMBRE no es idéntica a lo publicado:$mal. Qué hacer: vuelve a correr esta acción; si sigue, es de nuestro lado: lo revisa Claude (las páginas siguen en GitHub Pages)."
exit 1
