import { useEffect, useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import {
  ListarTours,
  ToursDisponibilidad,
  ReservarTour,
} from "./api/tourAppApi";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [tours, setTours] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [nameBy, setNameBy] = useState({});
  const [timeBy, settimeBy] = useState({});

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        setErr("");
        const [r1, r2] = await Promise.all([
          ListarTours(),
          ToursDisponibilidad(),
        ]);
        if (!alive) return;
        setTours(Array.isArray(r1.data) ? r1.data : []);
        setAvailability(Array.isArray(r2.data) ? r2.data : []);
      } catch (e) {
        if (!alive) return;
        setErr(e?.response?.data?.error || e.message || "Error");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, []);

  const slotsByName = useMemo(() => {
    const map = {};
    const now = Date.now();
    for (const s of availability) {
      const t = new Date(s.schedule_time).getTime();
      if (!Number.isFinite(t) || t <= now) continue;
      (map[s.name] ||= []).push(s.schedule_time);
    }
    Object.values(map).forEach((arr) =>
      arr.sort((a, b) => new Date(a) - new Date(b))
    );
    return map;
  }, [availability]);

  return (
    <Container className="py-3">
      <h4 className="mb-3">Tours</h4>
      {loading && (
        <div className="my-3">
          <Spinner animation="border" size="sm" className="me-2" />
          Cargando…
        </div>
      )}
      {err && <Alert variant="danger">{err}</Alert>}
      <ListGroup>
        {tours.map((r) => {
          const horarios = slotsByName[r.name] || [];
          return (
            <ListGroup.Item key={r.id}>
              <div className="fw-semibold">{r.name}</div>
              <div className="text-muted mb-2">{r.description}</div>
              <div className="mb-2">Horarios disponibles:</div>
              {horarios.length === 0 ? (
                <div className="text-muted">No hay horarios</div>
              ) : (
                <div className="mb-2">
                  {horarios.map((raw) => (
                    <Form.Check
                      key={raw}
                      inline
                      type="radio"
                      name={`slot-${r.id}`}
                      label={new Date(raw).toLocaleString()}
                      value={raw}
                      checked={timeBy[r.id] === raw}
                      onChange={(e) =>
                        settimeBy((p) => ({ ...p, [r.id]: e.target.value }))
                      }
                    />
                  ))}
                </div>
              )}

              <Row className="g-2">
                <Col xs={8} md={6}>
                  <Form.Control
                    placeholder="Tu nombre"
                    value={nameBy[r.id] || ""}
                    onChange={(e) =>
                      setNameBy((p) => ({ ...p, [r.id]: e.target.value }))
                    }
                  />
                </Col>
                <Col xs="auto">
                  <Button variant="primary">Reservar</Button>
                </Col>
              </Row>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Container>
  );
}
