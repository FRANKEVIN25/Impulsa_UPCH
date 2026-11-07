import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Bookmark, Check, Search, ArrowUpRight } from "lucide-react";
import { PageTitle, Modal, Empty, asset, Field } from "../components/UI";
import { jobs } from "../data/demo";
import { useApp } from "../context/AppContext";
import { filterJobs, matchingSkills } from "../utils/domain.mjs";
export default function Offers() {
  const { saved, setSaved, applications, setApplications, profile, notify } =
    useApp();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("Para ti"),
    [apply, setApply] = useState(false);
  const selected = jobs.find((j) => j.id === Number(params.get("oferta")));
  const visible = (filterJobs(jobs, query, filter) as typeof jobs)
    .filter((j) => filter !== "Guardadas" || saved.includes(j.id))
    .filter(
      (j) => filter !== "Mis postulaciones" || applications.includes(j.id),
    );
  function toggleSave(id: number) {
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }
  return (
    <>
      <PageTitle
        title="Ofertas de prácticas"
        subtitle="Encuentra una oportunidad que crezca contigo."
      />
      <div className="search-box">
        <Search size={19} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar prácticas, empresas..."
          aria-label="Buscar prácticas"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-button">
            Limpiar
          </button>
        )}
      </div>
      <div className="chips">
        {[
          "Para ti",
          "Prácticas",
          "Remoto",
          "Guardadas",
          "Mis postulaciones",
        ].map((t) => (
          <button
            key={t}
            aria-pressed={filter === t}
            className={filter === t ? "selected" : ""}
            onClick={() => setFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="section-heading">
        <h2>{filter === "Para ti" ? "Recomendadas para ti" : filter}</h2>
        <small className="muted">
          {visible.length} oportunidades de ejemplo
        </small>
      </div>
      <div className="offers-grid">
        {visible.map((j) => (
          <article className="job-card card" key={j.id}>
            <div className="job-heading">
              <img
                className="company-logo"
                src={asset(j.logo)}
                alt={j.company}
              />
              <div className="grow">
                <h3>{j.title}</h3>
                <small>{j.company}</small>
              </div>
              <button
                className="btn dark small"
                onClick={() => {
                  setParams({ oferta: String(j.id) });
                  setApply(false);
                }}
              >
                {applications.includes(j.id) ? "Ver postulación" : "Postular"}
              </button>
            </div>
            <div className="job-meta">
              <span>
                <img src={asset("42a9d.png")} alt="" />
                {j.mode}
              </span>
              <span>
                <img src={asset("a4cc6.png")} alt="" />
                {j.location}
              </span>
              <span>
                <img src={asset("30723.png")} alt="" />
                {j.age}
              </span>
            </div>
            <p>Dirigido a estudiantes de {j.cycle}.° ciclo en adelante</p>
            <div className="job-actions">
              <button
                className={
                  "save-button " + (saved.includes(j.id) ? "saved" : "")
                }
                onClick={() => toggleSave(j.id)}
              >
                <img src={asset("14a29.png")} alt="" />
                {saved.includes(j.id)
                  ? "Guardada para simulación"
                  : "Añadir a simulación"}
              </button>
              <button
                className="text-button"
                onClick={() => {
                  setParams({ oferta: String(j.id) });
                  setApply(false);
                }}
              >
                Ver detalles <ArrowUpRight size={13} />
              </button>
            </div>
          </article>
        ))}
      </div>
      {visible.length === 0 && (
        <Empty
          title="No encontramos ofertas"
          detail="Prueba otra búsqueda o cambia el filtro."
          action={
            <button
              className="btn"
              onClick={() => {
                setQuery("");
                setFilter("Para ti");
              }}
            >
              Ver todas
            </button>
          }
        />
      )}
      <p className="footnote">
        Convocatorias ficticias para demostrar la interfaz. No se envían
        postulaciones a empresas.
      </p>
      {selected && (
        <Modal
          title={apply ? "Prepara tu postulación" : selected.title}
          onClose={() => {
            setParams({});
            setApply(false);
          }}
        >
          <div className="company-line">
            <img src={asset(selected.logo)} alt={selected.company} />
            <div>
              <strong>{selected.company}</strong>
              <p>
                {selected.mode} · {selected.location}
              </p>
            </div>
          </div>
          <p>{selected.description}</p>
          <h3>Requisitos</h3>
          <p>
            Desde {selected.cycle}.° ciclo. Interés por aprender y
            disponibilidad para prácticas.
          </p>
          <div className="skill-list">
            {selected.skills.map((s) => (
              <span
                className={
                  "skill " + (profile.skills.includes(s) ? "matched" : "")
                }
                key={s}
              >
                {s}
              </span>
            ))}
          </div>
          <div className="info">
            Tu perfil coincide con{" "}
            {matchingSkills(selected.skills, profile.skills).length} de{" "}
            {selected.skills.length} habilidades de esta oferta.
          </div>
          {applications.includes(selected.id) ? (
            <div className="success">
              <Check size={20} /> Postulación registrada en esta demostración.
            </div>
          ) : apply ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setApplications((a) => [...a, selected.id]);
                setApply(false);
                notify(
                  "Postulación demo registrada. No se ha enviado a la empresa.",
                );
              }}
            >
              <Field label="¿Por qué te interesa esta práctica?">
                <textarea
                  required
                  minLength={20}
                  maxLength={1500}
                  name="motivation"
                  placeholder="Cuéntanos qué te gustaría aportar y aprender..."
                />
              </Field>
              <label className="checkbox-line">
                <input type="checkbox" required /> Entiendo que esta es una
                postulación de demostración.
              </label>
              <button className="btn full">Confirmar postulación demo</button>
            </form>
          ) : (
            <button className="btn dark full" onClick={() => setApply(true)}>
              Continuar a postulación
            </button>
          )}
          <div className="modal-actions">
            <button
              className="btn secondary"
              onClick={() => toggleSave(selected.id)}
            >
              <Bookmark size={16} />
              {saved.includes(selected.id)
                ? "Quitar de guardadas"
                : "Guardar oferta"}
            </button>
            <Link
              className="btn secondary"
              to={"/app/simulador?oferta=" + selected.id}
            >
              Practicar entrevista
            </Link>
          </div>
        </Modal>
      )}
    </>
  );
}
