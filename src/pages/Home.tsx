import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  CalendarDays,
  Target,
} from "lucide-react";
import { asset } from "../components/UI";
import { useApp } from "../context/AppContext";
import { jobs } from "../data/demo";
export default function Home() {
  const { profile, applications, saved, events } = useApp();
  return (
    <>
      <div className="home-heading">
        <div>
          <span className="eyebrow">TU ESPACIO DE CRECIMIENTO</span>
          <h1>
            ¡Hola, {profile.name.split(" ")[0]}! <span className="wave">✦</span>
          </h1>
          <p>Aquí tienes un resumen de tu progreso.</p>
        </div>
        <Link to="/app/calendario" className="date-badge">
          <CalendarDays size={17} /> Mi calendario
        </Link>
      </div>
      <div className="dashboard-grid">
        <section className="profile-progress card">
          <div className="section-caption">
            <span>Tu perfil profesional</span>
            <span className="pill lavender">En progreso</span>
          </div>
          <div className="progress-content">
            <div
              className="progress-ring"
              style={{ "--progress": "68%" } as React.CSSProperties}
            >
              <strong>
                68<span>%</span>
              </strong>
            </div>
            <div>
              <h2>
                Tu talento merece
                <br />
                ser descubierto.
              </h2>
              <p>
                Completa tu perfil para obtener recomendaciones más precisas.
              </p>
              <Link className="strong-link" to="/app/perfil">
                Completar perfil <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="progress-footer">
            <CheckCircle2 size={16} /> Cada paso cuenta para tu próxima
            oportunidad.
          </div>
        </section>
        <section className="next-step">
          <div className="step-icon">
            <Target size={26} />
          </div>
          <span className="eyebrow">TU SIGUIENTE DESAFÍO</span>
          <h2>
            ¿Listo para tu
            <br />
            primera entrevista?
          </h2>
          <p>Practica con confianza y cuenta lo que sabes hacer.</p>
          <Link className="btn dark" to="/app/simulador">
            Ir al simulador <ArrowUpRight size={17} />
          </Link>
        </section>
      </div>
      <div className="section-heading">
        <h2>Tus próximos pasos</h2>
        <span className="muted">Hechos a tu medida</span>
      </div>
      <div className="action-grid">
        {[
          {
            title: "Analiza una oferta",
            text: "Compara tu perfil con los requisitos de la práctica que te interesa.",
            to: "ofertas",
            img: "cc2d4.png",
          },
          {
            title: "Tips para mejorar tu CV",
            text: "Transforma tus responsabilidades en logros medibles y adapta tu perfil a la vacante.",
            to: "cv",
            img: "a62ab.png",
          },
          {
            title: "Conoce tus competencias",
            text: "Identifica tus fortalezas técnicas y blandas mediante tus logros académicos y proyectos.",
            to: "perfil",
            img: "971ff.png",
          },
        ].map((a) => (
          <Link className="action-card card" to={"/app/" + a.to} key={a.to}>
            <img src={asset(a.img)} alt="" />
            <ArrowUpRight className="card-arrow" size={20} />
            <h3>{a.title}</h3>
            <p>{a.text}</p>
          </Link>
        ))}
      </div>
      <div className="dashboard-grid lower">
        <section>
          <div className="section-heading">
            <h2>Oportunidades para ti</h2>
            <Link to="/app/ofertas" className="strong-link">
              Ver todas <ArrowRight size={15} />
            </Link>
          </div>
          {jobs.slice(0, 2).map((j) => (
            <Link
              to={"/app/ofertas?oferta=" + j.id}
              className="compact-job card"
              key={j.id}
            >
              <img src={asset(j.logo)} alt={j.company} />
              <div>
                <strong>{j.title}</strong>
                <small>
                  {j.company} · {j.mode} · {j.location}
                </small>
              </div>
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </section>
        <section>
          <div className="section-heading">
            <h2>Tu actividad</h2>
          </div>
          <div className="activity-card card">
            <div>
              <strong>{applications.length}</strong>
              <span>Postulaciones demo</span>
            </div>
            <div>
              <strong>{saved.length}</strong>
              <span>Ofertas guardadas</span>
            </div>
            <div>
              <strong>{events.length}</strong>
              <span>Eventos en agenda</span>
            </div>
          </div>
        </section>
      </div>
      <Link to="/app/asistente" className="ghost-banner">
        <span className="ghost-avatar">
          <img src={asset("87784.png")} alt="" />
        </span>
        <div>
          <h3>Conoce a “Ghost”, tu asistente virtual</h3>
          <p>Orienta tu búsqueda y prepara tu siguiente paso.</p>
        </div>
        <span className="pill">Demo</span>
        <ArrowRight size={22} />
      </Link>
    </>
  );
}
