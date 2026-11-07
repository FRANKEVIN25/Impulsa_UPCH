import { useState } from "react";
import {
  Pencil,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Command,
  Plus,
  X,
} from "lucide-react";
import { PageTitle, Modal, Field, asset } from "../components/UI";
import { useApp } from "../context/AppContext";
export default function Profile() {
  const { profile, setProfile, notify } = useApp();
  const [tab, setTab] = useState("Resumen"),
    [edit, setEdit] = useState(false),
    [skill, setSkill] = useState("");
  return (
    <>
      <PageTitle
        title="Mi perfil"
        subtitle="Haz visible lo que te hace único."
      />
      <section className="profile-banner">
        <img className="profile-ribbon" src={asset("66505.png")} alt="" />
        <div className="profile-avatar">
          {profile.name
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <h2>{profile.name}</h2>
          <p>
            {profile.career} | {profile.cycle}
          </p>
          <strong>Universidad Peruana Cayetano Heredia</strong>
        </div>
        <button className="btn secondary" onClick={() => setEdit(true)}>
          <Pencil size={15} /> Editar perfil
        </button>
      </section>
      <div className="tabs" role="tablist" aria-label="Secciones del perfil">
        {["Resumen", "Competencias", "Disponibilidad"].map((t) => (
          <button
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            key={t}
            className={tab === t ? "active" : ""}
          >
            {t}
          </button>
        ))}
      </div>
      <section className="card profile-detail" role="tabpanel" aria-label={tab}>
        {tab === "Resumen" ? (
          <>
            <div className="section-heading">
              <h2>SOBRE MÍ</h2>
              <button className="text-button" onClick={() => setEdit(true)}>
                <Pencil size={15} /> EDITAR
              </button>
            </div>
            <div className="profile-fields">
              {[
                [GraduationCap, "Carrera", profile.career],
                [Command, "Ciclo", profile.cycle],
                [Mail, "Correo institucional", profile.email],
                [Phone, "Teléfono", profile.phone],
                [MapPin, "Ubicación", profile.location],
              ].map(([Icon, label, value]) => {
                const I = Icon as typeof Mail;
                return (
                  <div className="profile-field" key={String(label)}>
                    <span>
                      <I size={27} />
                    </span>
                    <div>
                      <strong>{String(label)}</strong>
                      <p>{String(value)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="profile-about">{profile.about}</p>
          </>
        ) : tab === "Competencias" ? (
          <>
            <h2>Mis competencias</h2>
            <p className="muted">
              Tus conocimientos y habilidades también cuentan tu historia.
            </p>
            <div className="skill-list">
              {profile.skills.map((s) => (
                <span className="skill" key={s}>
                  {s}
                  <button
                    aria-label={"Eliminar " + s}
                    onClick={() =>
                      setProfile((p) => ({
                        ...p,
                        skills: p.skills.filter((x) => x !== s),
                      }))
                    }
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
            <form
              className="inline-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  skill.trim() &&
                  !profile.skills.some(
                    (s) => s.toLowerCase() === skill.trim().toLowerCase(),
                  )
                ) {
                  setProfile((p) => ({
                    ...p,
                    skills: [...p.skills, skill.trim()],
                  }));
                  setSkill("");
                }
              }}
            >
              <input
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="Agregar una competencia"
                aria-label="Nueva competencia"
                maxLength={45}
                required
              />
              <button className="btn">
                <Plus size={16} /> Agregar
              </button>
            </form>
          </>
        ) : (
          <>
            <h2>Mi disponibilidad</h2>
            <p className="muted">
              Indica cómo te gustaría comenzar tus prácticas.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const d = new FormData(e.currentTarget);
                setProfile((p) => ({
                  ...p,
                  availability: String(d.get("availability")),
                  modality: String(d.get("modality")),
                }));
                notify("Disponibilidad guardada en este navegador.");
              }}
              className="form-grid"
            >
              <Field label="Disponibilidad">
                <select name="availability" defaultValue={profile.availability}>
                  <option>Medio tiempo</option>
                  <option>Tiempo completo</option>
                  <option>Fines de semana</option>
                </select>
              </Field>
              <Field label="Modalidad preferida">
                <select name="modality" defaultValue={profile.modality}>
                  <option>Híbrido</option>
                  <option>Remoto</option>
                  <option>Presencial</option>
                </select>
              </Field>
              <button className="btn form-wide">Guardar disponibilidad</button>
            </form>
          </>
        )}
      </section>
      {edit && (
        <Modal title="Editar perfil" onClose={() => setEdit(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const d = Object.fromEntries(new FormData(e.currentTarget));
              setProfile((p) => ({ ...p, ...d }));
              setEdit(false);
              notify("Perfil actualizado en este navegador.");
            }}
          >
            <div className="form-grid">
              {[
                ["name", "Nombre completo"],
                ["career", "Carrera"],
                ["cycle", "Ciclo"],
                ["email", "Correo institucional"],
                ["phone", "Teléfono"],
                ["location", "Ubicación"],
              ].map(([name, label]) => (
                <Field label={label} key={name}>
                  <input
                    name={name}
                    defaultValue={String(profile[name as keyof typeof profile])}
                    type={name === "email" ? "email" : "text"}
                    required
                    maxLength={100}
                  />
                </Field>
              ))}
              <div className="form-wide">
                <Field label="Sobre mí">
                  <textarea
                    name="about"
                    defaultValue={profile.about}
                    maxLength={1000}
                  />
                </Field>
              </div>
            </div>
            <button className="btn full">Guardar cambios</button>
          </form>
        </Modal>
      )}
    </>
  );
}
