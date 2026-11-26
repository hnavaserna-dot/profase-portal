// La copia de las páginas en Cloudflare (el plan B por si se cae GitHub; Héctor Daniel Nava, 26-nov-2026, 12:41:
// «si a darle… solo es un plan b por si se cae github; pero siempre el plan A es github?»).
//
// Cloudflare sirve cada archivo tal cual, sin pasar por aquí. Este pedacito solo corre cuando lo que se pide no es un
// archivo, y hace lo mismo que GitHub Pages, para que las ligas de siempre sigan abriendo igual:
//   · «/» y «/carpeta/» → su index.html
//   · «/pagina» → «/pagina.html» (como www.quosistemas.com/prueba y /demo)
//   · «/carpeta» → «/carpeta/» si la carpeta trae su index.html
//   · lo demás → 404.html con 404 (o un texto corto si el sitio no trae 404.html)
// Y les pone lo mismo que _headers les pone a los archivos: «Access-Control-Allow-Origin: *» y, en el CRM, quién puede
// meter la página en un marco (MARCOS; la sala de las videollamadas, MARCOS_SALA, porque Q Chat la abre dentro de la
// burbuja de los sistemas Quo).
//
// La versión que manda vive en profase-datos/herramientas/cloudflare/worker.js; cada sitio trae una copia tal cual en
// .cloudflare/worker.js con su huella (.cloudflare/worker.sha256), que pone herramientas/cloudflare/reparte.py. Nunca se
// cambia una copia a mano.

export default {
  async fetch(req, env) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return new Response('Este sitio solo se lee.', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    const url = new URL(req.url);
    const p = url.pathname;

    const pide = async (ruta) => {
      const u = new URL(url);
      u.pathname = ruta;
      const r = await env.ASSETS.fetch(new Request(u, req));
      return r.status === 404 ? null : r;
    };

    const con = (r, ruta, estado) => {
      const fuera = new Response(r.body, { status: estado || r.status, statusText: estado ? 'Not Found' : r.statusText, headers: r.headers });
      const h = fuera.headers;
      if (!h.has('Access-Control-Allow-Origin')) h.set('Access-Control-Allow-Origin', '*');
      const marcos = /\/sala\.html$/.test(ruta) && env.MARCOS_SALA ? env.MARCOS_SALA : env.MARCOS;
      if (marcos && !h.has('Content-Security-Policy')) h.set('Content-Security-Policy', 'frame-ancestors ' + marcos);
      return fuera;
    };

    if (p.endsWith('/')) {
      const r = await pide(p + 'index.html');
      if (r) return con(r, p + 'index.html');
    } else if (!/\.[A-Za-z0-9]{1,8}$/.test(p.slice(p.lastIndexOf('/') + 1))) {
      const r = await pide(p + '.html');
      if (r) return con(r, p + '.html');
      if (await pide(p + '/index.html')) {
        url.pathname = p + '/';
        return Response.redirect(url.toString(), 301);
      }
    }

    const nf = await pide('/404.html');
    if (nf) return con(nf, '/404.html', 404);
    return new Response('No encontramos esta página. Qué hacer: revisa la dirección o regresa al inicio.', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
    });
  },
};
