import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarDays,
  Trash2,
} from "lucide-react";
import { PageTitle, Modal, Field, Empty } from "../components/UI";
import { useApp } from "../context/AppContext";
import { calendarDays } from "../utils/domain.mjs";
export default function Calendar() {
  const { events, setEvents, notify } = useApp();
  const [month, setMonth] = useState(new Date(2026, 10, 1)),
    [selected, setSelected] = useState("2026-11-06"),
    [filter, setFilter] = useState(false),
    [create, setCreate] = useState(false),
    [detail, setDetail] = useState<string | null>(null),
    [error, setError] = useState("");
  const event = events.find((e) => e.id === detail);
  const days = calendarDays(month.getFullYear(), month.getMonth());
  const visible = events
    .filter(
      (e) =>
        e.date.startsWith(
          `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`,
        ) &&
        (!filter || e.date === selected),
    )
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  function changeMonth(offset: number) {
    setMonth(new Date(month.getFullYear(), month.getMonth() + offset, 1));
    setFilter(false);
  }
  return (
    <>
      <PageTitle
        title="Mi calendario"
        subtitle="Organiza tus próximos pasos profesionales."
        action={
          <button className="btn" onClick={() => setCreate(true)}>
            <Plus size={17} /> Agregar evento
          </button>
        }
      />
      <div className="info">
        Eventos de ejemplo · Puedes agregar tus propios recordatorios locales.
      </div>
      <div className="calendar-layout">
        <section className="calendar-card card">
          <div className="section-caption">
            <h2 className="capitalize">
              {month.toLocaleDateString("es-PE", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="inline-buttons">
              <button
                className="icon-button outlined"
                aria-label="Mes anterior"
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className="icon-button outlined"
                aria-label="Mes siguiente"
                onClick={() => changeMonth(1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="calendar-grid">
            {"LMXJVSD".split("").map((d, i) => (
              <span key={i} className="day-label">
                {d}
              </span>
            ))}
            {days.map((d) => (
              <button
                key={d.date}
                aria-label={
                  d.date +
                  (events.some((e) => e.date === d.date) ? ", con eventos" : "")
                }
                aria-pressed={selected === d.date}
                className={`calendar-day ${d.current ? "" : "outside"} ${selected === d.date ? "selected" : ""} ${d.date === new Date().toLocaleDateString("en-CA") ? "today" : ""}`}
                onClick={() => {
                  setSelected(d.date);
                  setFilter(true);
                  if (!d.current) setMonth(new Date(d.date + "T12:00:00"));
                }}
              >
                <span>{d.day}</span>
                {events.some((e) => e.date === d.date) && <i />}
              </button>
            ))}
          </div>
          <div className="calendar-legend">
            <span>
              <i /> Con evento
            </span>
            <button className="text-button" onClick={() => setFilter(false)}>
              Ver todo el mes
            </button>
          </div>
        </section>
        <section>
          <div className="section-heading">
            <h2>{filter ? "Actividades del día" : "Próximas actividades"}</h2>
            <small>{visible.length} eventos</small>
          </div>
          <div className="event-list">
            {visible.map((e) => (
              <button
                key={e.id}
                className={
                  "event-card card " + (e.date === selected ? "highlight" : "")
                }
                onClick={() => setDetail(e.id)}
              >
                <span className="event-date">
                  <strong>{Number(e.date.slice(8))}</strong>
                  <small>
                    {new Date(e.date + "T12:00:00").toLocaleDateString("es", {
                      month: "short",
                    })}
                  </small>
                </span>
                <span className="grow">
                  <strong>{e.title}</strong>
                  <small>
                    {e.type} · {e.time}–{e.end} · {e.location}
                  </small>
                </span>
                <ChevronRight size={17} />
              </button>
            ))}
            {!visible.length && (
              <Empty
                title="Un espacio para tu próximo paso"
                detail="No hay actividades en este período."
                action={
                  <button className="btn" onClick={() => setCreate(true)}>
                    Agregar evento
                  </button>
                }
              />
            )}
          </div>
        </section>
      </div>
      {create && (
        <Modal
          title="Agregar evento"
          onClose={() => {
            setCreate(false);
            setError("");
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              if (String(d.get("end")) < String(d.get("time"))) {
                setError(
                  "La hora de fin debe ser igual o posterior a la de inicio.",
                );
                return;
              }
              setEvents((es) => [
                ...es,
                {
                  id: crypto.randomUUID(),
                  title: String(d.get("title")),
                  date: String(d.get("date")),
                  time: String(d.get("time")),
                  end: String(d.get("end")),
                  type: String(d.get("type")),
                  location: String(d.get("location")),
                  notes: String(d.get("notes")),
                },
              ]);
              setMonth(
                new Date(String(d.get("date")).slice(0, 7) + "-01T12:00:00"),
              );
              setFilter(false);
              setCreate(false);
              setError("");
              notify("Evento agregado a tu calendario local.");
            }}
          >
            <Field label="Título del evento">
              <input name="title" required maxLength={100} />
            </Field>
            <div className="form-grid">
              <Field label="Fecha">
                <input
                  type="date"
                  name="date"
                  defaultValue={selected}
                  required
                />
              </Field>
              <Field label="Tipo">
                <select name="type">
                  <option>Entrevista</option>
                  <option>Taller</option>
                  <option>Feria laboral</option>
                  <option>Vencimiento</option>
                  <option>Personal</option>
                </select>
              </Field>
              <Field label="Hora de inicio">
                <input type="time" name="time" defaultValue="10:00" required />
              </Field>
              <Field label="Hora de fin">
                <input type="time" name="end" defaultValue="11:00" required />
              </Field>
            </div>
            <Field label="Lugar o modalidad">
              <input
                name="location"
                placeholder="Virtual / dirección"
                required
                maxLength={120}
              />
            </Field>
            <Field label="Notas">
              <textarea name="notes" maxLength={1000} />
            </Field>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <button className="btn full">Guardar evento</button>
          </form>
        </Modal>
      )}
      {event && (
        <Modal title="Detalle del evento" onClose={() => setDetail(null)}>
          <div className="feature-icon">
            <CalendarDays size={26} />
          </div>
          <h2>{event.title}</h2>
          <p>
            {new Date(event.date + "T12:00:00").toLocaleDateString("es-PE", {
              dateStyle: "full",
            })}
          </p>
          <p>
            {event.time}–{event.end} · {event.location}
          </p>
          <span className="pill lavender">{event.type}</span>
          <p>{event.notes || "Sin notas adicionales."}</p>
          <button
            className="btn danger"
            onClick={() => {
              setEvents((es) => es.filter((e) => e.id !== event.id));
              setDetail(null);
              notify("Evento eliminado.");
            }}
          >
            <Trash2 size={16} /> Eliminar evento
          </button>
        </Modal>
      )}
    </>
  );
}
