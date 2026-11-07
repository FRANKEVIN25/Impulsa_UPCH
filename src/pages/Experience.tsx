import { useState } from "react";
import { Plus, BriefcaseBusiness, Pencil, Trash2 } from "lucide-react";
import { PageTitle, Modal, Field, Empty } from "../components/UI";
import { useApp } from "../context/AppContext";
import type { initialExperiences } from "../data/demo";
type ExperienceItem = (typeof initialExperiences)[number];
export default function Experience() {
  const { experiences, setExperiences, notify } = useApp();
  const [edit, setEdit] = useState<ExperienceItem | null | undefined>(
      undefined,
    ),
    [detail, setDetail] = useState<string | null>(null),
    [error, setError] = useState("");
  const selected = experiences.find((x) => x.id === detail);
  return (
    <>
      <PageTitle
        title="Mi experiencia"
        subtitle="Tus proyectos, voluntariados y logros también son experiencia."
        action={
          <button className="btn" onClick={() => setEdit(null)}>
            <Plus size={17} /> Agregar experiencia
          </button>
        }
      />
      <div className="experience-grid">
        {experiences.map((x) => (
          <button
            className="card experience-card"
            key={x.id}
            onClick={() => setDetail(x.id)}
          >
            <span className="feature-icon">
              <BriefcaseBusiness size={24} />
            </span>
            <span className="pill lavender">{x.type}</span>
            <h2>{x.title}</h2>
            <p>{x.organization}</p>
            <small>
              {x.start} — {x.end || "Actualidad"}
            </small>
            <p className="muted line-clamp">{x.description}</p>
            <span className="strong-link">Ver experiencia →</span>
          </button>
        ))}
      </div>
      {!experiences.length && (
        <Empty
          title="Tu historia profesional empieza aquí"
          detail="Agrega tu primer proyecto, práctica o voluntariado."
          action={
            <button className="btn" onClick={() => setEdit(null)}>
              Agregar experiencia
            </button>
          }
        />
      )}
      {edit !== undefined && (
        <Modal
          title={edit ? "Editar experiencia" : "Agregar experiencia"}
          onClose={() => {
            setEdit(undefined);
            setError("");
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              if (
                d.get("end") &&
                String(d.get("end")) < String(d.get("start"))
              ) {
                setError(
                  "La fecha de fin no puede ser anterior a la de inicio.",
                );
                return;
              }
              const item = {
                id: edit?.id || crypto.randomUUID(),
                title: String(d.get("title")),
                organization: String(d.get("organization")),
                type: String(d.get("type")),
                start: String(d.get("start")),
                end: String(d.get("end")),
                description: String(d.get("description")),
              };
              setExperiences((es) =>
                edit
                  ? es.map((x) => (x.id === edit.id ? item : x))
                  : [item, ...es],
              );
              setEdit(undefined);
              setError("");
              notify("Experiencia guardada. Ya puedes incluirla en tu CV.");
            }}
          >
            <Field label="Cargo o nombre del proyecto">
              <input
                name="title"
                defaultValue={edit?.title}
                required
                maxLength={100}
              />
            </Field>
            <Field label="Organización">
              <input
                name="organization"
                defaultValue={edit?.organization}
                required
                maxLength={120}
              />
            </Field>
            <Field label="Tipo de experiencia">
              <select name="type" defaultValue={edit?.type}>
                {[
                  "Proyecto académico",
                  "Prácticas",
                  "Voluntariado",
                  "Trabajo",
                  "Proyecto personal",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <div className="form-grid">
              <Field label="Inicio">
                <input
                  type="month"
                  name="start"
                  defaultValue={edit?.start}
                  required
                />
              </Field>
              <Field label="Fin (vacío si continúa)">
                <input type="month" name="end" defaultValue={edit?.end} />
              </Field>
            </div>
            <Field label="Describe tu aporte y tus logros">
              <textarea
                name="description"
                defaultValue={edit?.description}
                required
                maxLength={2000}
                rows={5}
              />
            </Field>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <button className="btn full">Guardar experiencia</button>
          </form>
        </Modal>
      )}
      {selected && (
        <Modal title="Detalle de experiencia" onClose={() => setDetail(null)}>
          <span className="pill lavender">{selected.type}</span>
          <h2>{selected.title}</h2>
          <p>{selected.organization}</p>
          <small className="muted">
            {selected.start} — {selected.end || "Actualidad"}
          </small>
          <p className="preserve">{selected.description}</p>
          <div className="modal-actions">
            <button
              className="btn"
              onClick={() => {
                setDetail(null);
                setEdit(selected);
              }}
            >
              <Pencil size={16} /> Editar
            </button>
            <button
              className="btn danger"
              onClick={() => {
                setExperiences((es) => es.filter((x) => x.id !== selected.id));
                setDetail(null);
                notify("Experiencia eliminada.");
              }}
            >
              <Trash2 size={16} /> Eliminar
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
