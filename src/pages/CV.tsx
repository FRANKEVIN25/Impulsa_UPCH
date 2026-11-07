import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileUser,
  ArrowRight,
  ArrowLeft,
  Download,
  Check,
  CheckCircle2,
} from "lucide-react";
import { PageTitle, Field } from "../components/UI";
import { useApp } from "../context/AppContext";
import { useLocalState } from "../hooks/useLocalState";
import { downloadCV } from "../utils/download";
import type { CVData } from "../utils/download";
export default function CV() {
  const { profile, experiences, notify } = useApp();
  const [step, setStep] = useState(0),
    [busy, setBusy] = useState(false);
  const [cv, setCV] = useLocalState<CVData>("cv", {
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    summary: profile.about,
    career: profile.career,
    university: "Universidad Peruana Cayetano Heredia",
    cycle: profile.cycle,
    skills: profile.skills.join(", "),
    languages: "Español: nativo\nInglés: básico",
  });
  const [included, setIncluded] = useLocalState<string[]>(
    "cv-experiences",
    experiences.map((x) => x.id),
  );
  const selected = experiences.filter((x) => included.includes(x.id));
  const steps = [
    "Datos personales",
    "Formación académica",
    "Experiencia y habilidades",
    "Tu CV está listo",
  ];
  function update(key: keyof CVData, value: string) {
    setCV((c) => ({ ...c, [key]: value }));
  }
  async function download() {
    setBusy(true);
    try {
      await downloadCV(cv, selected);
      notify("Tu CV en PDF está listo.");
    } catch {
      notify("No se pudo generar el PDF. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageTitle
        title="Genera tu CV"
        subtitle="Dale forma a tu talento, paso a paso."
      />
      {step === 0 ? (
        <div className="cv-intro card">
          <div className="feature-icon large">
            <FileUser size={40} />
          </div>
          <span className="eyebrow">TU HISTORIA, BIEN CONTADA</span>
          <h2>
            Un CV que muestre
            <br />
            lo que puedes aportar.
          </h2>
          <p>
            Completa tus datos, elige tus experiencias y descarga un currículum
            listo para compartir.
          </p>
          <div className="cv-features">
            <span>
              <Check size={17} /> Diseño claro y profesional
            </span>
            <span>
              <Check size={17} /> Descarga en PDF
            </span>
            <span>
              <Check size={17} /> Tus datos guardados localmente
            </span>
          </div>
          <button className="btn dark" onClick={() => setStep(1)}>
            Crear mi CV <ArrowRight size={17} />
          </button>
          <small className="muted">
            Generación con plantilla local. No utiliza inteligencia artificial.
          </small>
        </div>
      ) : (
        <>
          <ol className="wizard-steps">
            {steps.map((s, i) => (
              <li
                className={
                  step === i + 1 ? "active" : step > i + 1 ? "done" : ""
                }
                key={s}
              >
                <span>{step > i + 1 ? <Check size={14} /> : i + 1}</span>
                <strong>{s}</strong>
              </li>
            ))}
          </ol>
          {step < 4 ? (
            <section className="card cv-form">
              <span className="eyebrow">PASO {step} DE 3</span>
              <h2>{steps[step - 1]}</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(step + 1);
                }}
              >
                {step === 1 ? (
                  <>
                    <div className="form-grid">
                      {[
                        ["name", "Nombre completo"],
                        ["email", "Correo electrónico"],
                        ["phone", "Teléfono"],
                        ["location", "Ciudad y país"],
                      ].map(([key, label]) => (
                        <Field label={label} key={key}>
                          <input
                            value={cv[key as keyof CVData]}
                            onChange={(e) =>
                              update(key as keyof CVData, e.target.value)
                            }
                            type={key === "email" ? "email" : "text"}
                            required
                            maxLength={120}
                          />
                        </Field>
                      ))}
                    </div>
                    <Field label="Perfil profesional">
                      <textarea
                        value={cv.summary}
                        onChange={(e) => update("summary", e.target.value)}
                        placeholder="Quién eres, qué te interesa y qué puedes aportar"
                        required
                        maxLength={1500}
                        rows={5}
                      />
                    </Field>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => {
                        setCV((c) => ({
                          ...c,
                          name: profile.name,
                          email: profile.email,
                          phone: profile.phone,
                          location: profile.location,
                          summary: profile.about,
                        }));
                        notify("Datos actualizados desde tu perfil.");
                      }}
                    >
                      Actualizar desde mi perfil
                    </button>
                  </>
                ) : step === 2 ? (
                  <>
                    {[
                      ["career", "Carrera profesional"],
                      ["university", "Universidad o institución"],
                      ["cycle", "Ciclo o estado de estudios"],
                    ].map(([key, label]) => (
                      <Field label={label} key={key}>
                        <input
                          value={cv[key as keyof CVData]}
                          onChange={(e) =>
                            update(key as keyof CVData, e.target.value)
                          }
                          required
                          maxLength={150}
                        />
                      </Field>
                    ))}
                  </>
                ) : (
                  <>
                    <h3>Selecciona las experiencias que deseas incluir</h3>
                    {experiences.map((x) => (
                      <label key={x.id} className="experience-check">
                        <input
                          type="checkbox"
                          checked={included.includes(x.id)}
                          onChange={() =>
                            setIncluded((ids) =>
                              ids.includes(x.id)
                                ? ids.filter((id) => id !== x.id)
                                : [...ids, x.id],
                            )
                          }
                        />
                        <span>
                          <strong>{x.title}</strong>
                          <small>{x.organization}</small>
                        </span>
                      </label>
                    ))}
                    {!experiences.length && (
                      <p className="muted">
                        No tienes experiencias guardadas. Puedes crear un CV
                        académico sin experiencia.
                      </p>
                    )}
                    <Link className="text-button" to="/app/experiencia">
                      Administrar mis experiencias →
                    </Link>
                    <Field label="Habilidades">
                      <textarea
                        value={cv.skills}
                        onChange={(e) => update("skills", e.target.value)}
                        required
                        maxLength={1200}
                      />
                    </Field>
                    <Field label="Idiomas y nivel">
                      <textarea
                        value={cv.languages}
                        onChange={(e) => update("languages", e.target.value)}
                        maxLength={600}
                      />
                    </Field>
                  </>
                )}
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={() => setStep(step - 1)}
                  >
                    <ArrowLeft size={16} /> Atrás
                  </button>
                  <button className="btn">
                    {step === 3 ? "Generar vista previa" : "Continuar"}{" "}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </section>
          ) : (
            <>
              <div className="cv-ready">
                <CheckCircle2 size={25} />
                <div>
                  <h2>¡Tu CV está listo!</h2>
                  <p>Revísalo antes de descargarlo y compartirlo.</p>
                </div>
                <button className="btn dark" disabled={busy} onClick={download}>
                  <Download size={17} />
                  {busy ? "Generando..." : "Descargar PDF"}
                </button>
              </div>
              <article className="cv-preview">
                <header>
                  <h1>{cv.name}</h1>
                  <p>
                    {cv.email} · {cv.phone} · {cv.location}
                  </p>
                </header>
                <section>
                  <h2>PERFIL PROFESIONAL</h2>
                  <p className="preserve">{cv.summary}</p>
                </section>
                <section>
                  <h2>FORMACIÓN ACADÉMICA</h2>
                  <h3>{cv.career}</h3>
                  <p>
                    {cv.university} · {cv.cycle}
                  </p>
                </section>
                {!!selected.length && (
                  <section>
                    <h2>EXPERIENCIA Y PROYECTOS</h2>
                    {selected.map((e) => (
                      <div className="cv-experience" key={e.id}>
                        <h3>{e.title}</h3>
                        <small>
                          {e.organization} | {e.start} — {e.end || "Actualidad"}
                        </small>
                        <p className="preserve">{e.description}</p>
                      </div>
                    ))}
                  </section>
                )}
                <section>
                  <h2>HABILIDADES</h2>
                  <p className="preserve">{cv.skills}</p>
                </section>
                {cv.languages && (
                  <section>
                    <h2>IDIOMAS</h2>
                    <p className="preserve">{cv.languages}</p>
                  </section>
                )}
              </article>
              <div className="modal-actions">
                <button className="btn secondary" onClick={() => setStep(1)}>
                  Editar mi CV
                </button>
                <button className="btn" disabled={busy} onClick={download}>
                  <Download size={17} /> Descargar PDF
                </button>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
