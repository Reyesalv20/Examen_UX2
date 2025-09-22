require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes/routes'); // 👈 importa el router

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// logger para ver qué URL llega realmente
app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// monta todas las rutas bajo /api
app.use('/api', routes);

// 404 JSON para depurar paths
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada', path: req.originalUrl });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
