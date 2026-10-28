# Portal PROFASE

Página del equipo en crmprofase.com.mx: WorkFlow y reportes de DECOMSA para gerentes y contadores.

- `index.html`: entrada con usuario y contraseña, y alta con código de un solo uso.
- `gerentes.html` y `contadores.html`: se arman automáticamente; no se editan a mano.
- `js/portal.js`: sesión y conexión a la base. La llave que trae es la publicable; lo que cada quien puede ver lo decide la base según su rol.

Aquí no hay datos: los datos viven en la base y solo los ve quien entra con su usuario.
