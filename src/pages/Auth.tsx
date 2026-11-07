import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  LockKeyhole,
  UserRound,
  GraduationCap,
} from "lucide-react";
import { Brand, asset } from "../components/UI";
import { useApp } from "../context/AppContext";
export function Welcome() {
  return (
    <main className="welcome" id="main-content">
      <div className="welcome-copy">
        <Brand />
        <img className="welcome-ribbon" src={asset("66505.png")} alt="" />
        <div className="welcome-intro">
          <span className="eyebrow">TU FUTURO EMPIEZA CONTIGO</span>
          <h1>
            Tu preparación,
            <br />
            tu próximo logro.
          </h1>
          <p>
            Conoce tus fortalezas, identifica lo que necesitas mejorar y
            prepárate para las prácticas que te interesan.
          </p>
        </div>
        <div className="welcome-actions">
          <Link className="btn dark full" to="/acceso">
            Comenzar <ArrowRight size={18} />
          </Link>
          <Link to="/acceso?modo=registro" className="underlink">
            ¿No tienes una cuenta?
          </Link>
          <Link to="/app" className="text-button">
            Explorar demostración →
          </Link>
        </div>
      </div>
      <div className="welcome-art">
        <img
          src={asset("45229.png")}
          alt="Ilustración de estudiantes conversando en una entrevista"
        />
        <div className="welcome-caption">
          <span>APRENDE. PRACTICA. AVANZA.</span>
          <h2>
            El siguiente paso
            <br />
            es tuyo.
          </h2>
        </div>
      </div>
    </main>
  );
}
export default function Auth() {
  const [params] = useSearchParams();
  const register = params.get("modo") === "registro";
  const [visible, setVisible] = useState(false),
    [error, setError] = useState(""),
    [recovery, setRecovery] = useState(false),
    [sent, setSent] = useState(false);
  const { setProfile } = useApp();
  const nav = useNavigate();
  return (
    <main className="auth-layout" id="main-content">
      <aside>
        <Link to="/">
          <Brand />
        </Link>
        <h1>
          Prepárate para
          <br />
          lo que viene.
        </h1>
        <img
          src={asset("45229.png")}
          alt="Estudiantes en una conversación profesional"
        />
        <p>Tu preparación, tu próximo logro.</p>
      </aside>
      <section className="auth-panel">
        <Link className="back-link" to="/">
          ← Volver
        </Link>
        <div className="auth-card">
          <Brand />
          <h1>
            {recovery
              ? "Recuperar acceso"
              : register
                ? "Crea tu cuenta"
                : "¡Bienvenido/a!"}
          </h1>
          <p>
            {recovery
              ? "Vista de recuperación de contraseña."
              : register
                ? "Para continuar, completa tus datos."
                : "Inicia sesión en tu cuenta para continuar."}
          </p>
          <div className="info">
            Modo demostración: no se crean cuentas ni se autentican
            credenciales.
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setError("");
              const data = new FormData(e.currentTarget);
              if (recovery) {
                setSent(true);
                return;
              }
              if (
                register &&
                data.get("password") !== data.get("confirmation")
              ) {
                setError("Las contraseñas no coinciden.");
                return;
              }
              if (register)
                setProfile((p) => ({
                  ...p,
                  name: String(data.get("name")),
                  email: String(data.get("email")),
                  career: String(data.get("career")),
                }));
              sessionStorage.setItem("impulsa-session", "demo");
              nav("/app");
            }}
          >
            {register && !recovery && (
              <>
                <label className="input-icon">
                  <UserRound size={20} />
                  <input
                    name="name"
                    placeholder="Nombre completo"
                    aria-label="Nombre completo"
                    required
                    maxLength={90}
                  />
                </label>
              </>
            )}
            <label className="input-icon">
              <Mail size={20} />
              <input
                name="email"
                type="email"
                placeholder="Ingrese correo institucional"
                aria-label="Correo institucional"
                required
              />
            </label>
            {register && !recovery && (
              <label className="input-icon">
                <GraduationCap size={20} />
                <input
                  name="career"
                  placeholder="Carrera profesional"
                  aria-label="Carrera profesional"
                  required
                />
              </label>
            )}
            {!recovery && (
              <>
                <label className="input-icon">
                  <LockKeyhole size={20} />
                  <input
                    name="password"
                    type={visible ? "text" : "password"}
                    placeholder="Contraseña de demostración"
                    aria-label="Contraseña de demostración"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={
                      visible ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    onClick={() => setVisible(!visible)}
                  >
                    {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </label>
                {register && (
                  <label className="input-icon">
                    <LockKeyhole size={20} />
                    <input
                      name="confirmation"
                      type={visible ? "text" : "password"}
                      placeholder="Confirmar contraseña"
                      aria-label="Confirmar contraseña"
                      required
                      minLength={6}
                    />
                  </label>
                )}
              </>
            )}
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            {sent && (
              <p className="info" role="status">
                Flujo de demostración completado. No se envió ningún correo; el
                envío requiere un backend.
              </p>
            )}
            <button className="btn dark full">
              {recovery
                ? "Simular recuperación"
                : register
                  ? "Registrarme"
                  : "Iniciar sesión"}
            </button>
          </form>
          {!register && !recovery && (
            <button className="text-button" onClick={() => setRecovery(true)}>
              ¿Olvidaste tu contraseña?
            </button>
          )}
          {recovery ? (
            <button
              className="text-button"
              onClick={() => {
                setRecovery(false);
                setSent(false);
              }}
            >
              Volver a iniciar sesión
            </button>
          ) : (
            <Link
              className="underlink"
              to={register ? "/acceso" : "/acceso?modo=registro"}
            >
              {register
                ? "¿Ya tienes una cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"}
            </Link>
          )}
          <Link className="btn secondary full" to="/app">
            Entrar a la demostración
          </Link>
          <small className="muted">
            Las contraseñas no se guardan ni se envían.
          </small>
        </div>
      </section>
    </main>
  );
}
