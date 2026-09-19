const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

// Configurar CORS
// Permite las peticiones desde Angular durante el desarrollo.
app.use(cors());

// Middlewares nativos de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión con PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ======================================================
// GET - Obtener todos los usuarios
// ======================================================
const getUsuario = (request, response) => {
  pool.query(
    "SELECT * FROM usuarios ORDER BY id ASC",
    (error, results) => {
      if (error) {
        return response.status(500).json({
          error: error.message
        });
      }

      response.status(200).json(results.rows);
    }
  );
};

// ======================================================
// POST - Crear un usuario
// ======================================================
const crearUsuario = (request, response) => {
  const { nombre, edad, tipo } = request.body;

  console.log(
    "Nombre:",
    nombre,
    "edad:",
    edad,
    "tipo:",
    tipo
  );

  if (!nombre || !edad || !tipo) {
    return response.status(400).json({
      error: "Faltan datos obligatorios en el body"
    });
  }

  pool.query(
    "INSERT INTO usuarios (nombre, edad, tipo) VALUES ($1, $2, $3) RETURNING *",
    [nombre, edad, tipo],
    (error, results) => {
      if (error) {
        return response.status(500).json({
          error: error.message
        });
      }

      response.status(201).json(results.rows[0]);
    }
  );
};

// ======================================================
// PUT - Actualizar un usuario
// ======================================================
const actualizarUsuario = (request, response) => {
  const id = parseInt(request.params.id);

  const { nombre, edad, tipo } = request.body;

  if (!id || !nombre || !edad || !tipo) {
    return response.status(400).json({
      error: "Faltan datos obligatorios"
    });
  }

  pool.query(
    "UPDATE usuarios SET nombre = $1, edad = $2, tipo = $3 WHERE id = $4 RETURNING *",
    [nombre, edad, tipo, id],
    (error, results) => {
      if (error) {
        return response.status(500).json({
          error: error.message
        });
      }

      if (results.rows.length === 0) {
        return response.status(404).json({
          error: "Usuario no encontrado"
        });
      }

      response.status(200).json(results.rows[0]);
    }
  );
};

// ======================================================
// DELETE - Eliminar un usuario
// ======================================================
const eliminarUsuario = (request, response) => {
  const id = parseInt(request.params.id);

  if (!id) {
    return response.status(400).json({
      error: "ID de usuario inválido"
    });
  }

  pool.query(
    "DELETE FROM usuarios WHERE id = $1 RETURNING *",
    [id],
    (error, results) => {
      if (error) {
        return response.status(500).json({
          error: error.message
        });
      }

      if (results.rows.length === 0) {
        return response.status(404).json({
          error: "Usuario no encontrado"
        });
      }

      response.status(200).json({
        mensaje: "Usuario eliminado correctamente",
        usuario: results.rows[0]
      });
    }
  );
};

// ======================================================
// Ruta principal
// ======================================================
app.get("/", (req, res) => {
  res.json({
    Resultado: "Bienvenido al Taller Despliegue Rest - Railway"
  });
});

// ======================================================
// RUTAS REST DE USUARIOS
// ======================================================

app.get("/usuarios", getUsuario);

app.post("/usuarios", crearUsuario);

app.put("/usuarios/:id", actualizarUsuario);

app.delete("/usuarios/:id", eliminarUsuario);

// ======================================================
// ======================================================
// Iniciar servidor
// ======================================================

const port = process.env.PORT || 1337;

app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor iniciado correctamente en el puerto ${port}`);

});
