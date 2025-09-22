const express = require("express");
const router = express.Router();
const { pool } = require("../db");

//Devuelve una lista de tours limitada por el limit y offset.Ambos parámetros tienen un valor por defecto:
//Limit 10
//Offset 0
router.get("/tours", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  try {
    const result = await pool.query(
      "SELECT *FROM tourApp.tours LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    res.json(result.rows);
  } catch (wrong) {
    res.status(500).json({ error: wrong.message });
  }
});

//GET /tours/availability
//Devuelve la disponibilidad de los tours en base a la fecha actual,
//solamente de fechas futuras.Tampoco devuelve las horas que ya han sido reservadas.

router.get("/tours/availability", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tourApp.tour_schedules WHERE schedule_time>now() and seats_available>0"
    );
    res.json(result.rows);
  } catch (wrong) {
    res.status(500).json({ error: wrong.message });
  }
});

//PUT /tours/reserve
//Endpoint para reservar un tour a una hora específica.
//Setea en true la columna reserved. Actualiza la columna reservedBy con el personName.
// personName - scheduleTime - tourId

//pues yo digo que es asi inge no le entendi mucho esta api:(
router.put("/tours/reserve", async (req, res) => {
  const { person_name, reserved_at, tour_schedule_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE tourApp.reservations SET person_name=$1,reserved_at=$2 WHERE tour_schedule_id=$3 and status='CONFIRMED' RETURNING * ",
      [person_name, reserved_at, tour_schedule_id]
    );
    res.json(result.rows);
  } catch (wrong) {
    res.status(500).json({ error: wrong.message });
  }
});
module.exports = router;
