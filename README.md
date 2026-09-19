# CRUD Usuarios — Angular + REST

Proyecto de ejemplo, muy simple, para mostrar el consumo de un servicio REST (GET/POST, y PUT/DELETE si tu backend los soporta) desde Angular.

## 1. Instalar dependencias

Necesitas Node.js instalado. Luego, dentro de la carpeta del proyecto:

```bash
npm install
```

## 2. Levantar tu endpoint local

Asegúrate de que tu servicio REST esté corriendo en `http://localhost:1337/usuarios` antes de iniciar Angular.

### ⚠️ CORS (muy importante)

Angular correrá en `http://localhost:4200` y tu API en `http://localhost:1337`. Son orígenes distintos, así que el navegador bloqueará las peticiones si tu backend no habilita CORS explícitamente.

- Si tu backend es Node/Express, agrega el middleware `cors`:
  ```js
  const cors = require('cors');
  app.use(cors());
  ```
- Si usas otro framework, habilita CORS para el origen `http://localhost:4200` (o `*` en desarrollo).

Sin esto, verás errores en la consola del navegador aunque el endpoint funcione bien desde Postman.

## 3. Ejecutar el proyecto Angular

```bash
npm start
```

Abre `http://localhost:4200`.

## 4. Qué incluye

- **Listar usuarios** (`GET /usuarios`) al cargar la página y con el botón "Recargar".
- **Crear usuario** (`POST /usuarios`) desde el formulario.
- **Editar usuario** (`PUT /usuarios/:id`) — usa el botón "Editar" para cargar el registro en el formulario.
- **Eliminar usuario** (`DELETE /usuarios/:id`) con confirmación.

> Tu enunciado confirma que el endpoint soporta GET y POST. Si tu backend **no** tiene aún las rutas `PUT /usuarios/:id` y `DELETE /usuarios/:id`, esas dos acciones fallarán hasta que las agregues (es habitual si usas `json-server`, que las incluye automáticamente; si es una API hecha a mano, hay que programarlas).

## 5. Estructura del proyecto

```
src/
  app/
    models/
      usuario.model.ts      → interfaz Usuario
    services/
      usuario.service.ts    → llamadas HTTP al endpoint REST
    app.component.ts        → estado y lógica del CRUD
    app.component.html      → formulario + tabla
    app.component.css
    app.config.ts           → registra HttpClient
  main.ts
  styles.css
  index.html
```

## 6. Cambiar la URL del endpoint

Si tu API corre en otro puerto o ruta, edita esta línea en `src/app/services/usuario.service.ts`:

```ts
```typescript
private readonly apiUrl =
  'https://crud-usuarios-production-5e28.up.railway.app/usuarios';
```

