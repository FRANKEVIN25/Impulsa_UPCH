import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Mail,
  CalendarDays,
  UserRound,
  Shield,
  HelpCircle,
  LogOut,
  Download,
  Trash2,
} from "lucide-react";
import { PageTitle, Toggle, MenuRow, Modal, Field } from "../components/UI";
import { useApp } from "../context/AppContext";
import { downloadJson } from "../utils/download";
export default function Settings({ privacy = false }: { privacy?: boolean }) {
  const app = useApp();
  const { profile, settings, setSettings, notify } = app;
  const nav = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [modal, setModal] = useState<"help" | "password" | "reset" | null>(
    null,
  );
  function toggle(key: keyof typeof settings) {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
    notify("Preferencia guardada solo en este navegador.");
  }
  function exportData() {
    downloadJson(
      {
        version: 1,
        profile,
        settings,
        experiences: app.experiences,
        events: app.events,
        saved: app.saved,
        applications: app.applications,
        posts: app.posts,
      },
      "impulsa-datos.json",
    );
  }
  return (
    <div className="settings-page">
      <PageTitle
        title={privacy ? "Privacidad y seguridad" : "Configuración"}
        subtitle={
          privacy
            ? "Decide cómo se muestra tu información."
            : "Personaliza tu experiencia en ImpulsaUPCH."
        }
      />
      {privacy ? (
        <>
          <div className="info">
            Prototipo local: estas opciones no protegen una cuenta ni cambian
            permisos de un servidor.
          </div>
          <h2>Seguridad de la cuenta</h2>
          <div className="card settings-group">
            <MenuRow
              title="Cambiar contraseña"
              detail="Vista de demostración del formulario."
              icon={<Shield size={19} />}
              onClick={() => {
                setPasswordError("");
                setModal("password");
              }}
            />
          </div>
          <h2>Preferencias de privacidad</h2>
          <div className="card settings-group">
            <Toggle
              label="Visibilidad del perfil ante empleadores"
              detail={
                settings.visible
                  ? "Visible en esta demostración."
                  : "Oculto en esta demostración."
              }
              checked={settings.visible}
              onChange={() => toggle("visible")}
              icon={<UserRound size={19} />}
            />
          </div>
          <h2>Gestión de cuenta</h2>
          <div className="card settings-group">
            <MenuRow
              title="Exportar mis datos"
              detail="Descarga los datos locales en formato JSON."
              icon={<Download size={19} />}
              onClick={exportData}
            />
            <MenuRow
              title="Restablecer demostración"
              detail="Borra tus cambios locales y recupera los ejemplos."
              icon={<Trash2 size={19} />}
              onClick={() => setModal("reset")}
            />
          </div>
          <button
            className="btn secondary full"
            onClick={() => nav("/app/configuracion")}
          >
            Volver a configuración
          </button>
        </>
      ) : (
        <>
          <button className="account-card" onClick={() => nav("/app/perfil")}>
            <span className="account-icon">
              <UserRound size={23} />
            </span>
            <span>
              <h3>Cuenta del estudiante</h3>
              <p>{profile.name} · Cuenta de ejemplo</p>
              <small>{profile.email}</small>
            </span>
            <span className="purple-icon">›</span>
          </button>
          <h2>Notificaciones</h2>
          <div className="card settings-group">
            <Toggle
              label="Notificaciones de ofertas"
              detail={
                settings.offers
                  ? "Activadas · Nuevas vacantes para ti"
                  : "Desactivadas · Sin avisos de ofertas"
              }
              checked={settings.offers}
              onChange={() => toggle("offers")}
              icon={<Bell size={19} />}
            />
            <Toggle
              label="Avisos por correo"
              detail={
                settings.email
                  ? "Activados · Preferencia local"
                  : "Desactivados · Sin avisos por correo"
              }
              checked={settings.email}
              onChange={() => toggle("email")}
              icon={<Mail size={19} />}
            />
            <Toggle
              label="Recordatorios de entrevistas"
              detail={
                settings.interviews
                  ? "Activados · Antes de cada entrevista"
                  : "Desactivados · Sin recordatorios"
              }
              checked={settings.interviews}
              onChange={() => toggle("interviews")}
              icon={<CalendarDays size={19} />}
            />
          </div>
          <h2>Preferencias y ayuda</h2>
          <div className="card settings-group">
            <MenuRow
              title="Ayuda y soporte"
              detail="Encuentra orientación para usar la app."
              icon={<HelpCircle size={19} />}
              onClick={() => setModal("help")}
            />
            <MenuRow
              title="Privacidad y seguridad"
              detail="Contraseña, visibilidad y datos de tu cuenta."
              icon={<Shield size={19} />}
              onClick={() => nav("/app/configuracion/privacidad")}
            />
          </div>
          <button
            className="btn secondary full logout-settings"
            onClick={() => {
              sessionStorage.removeItem("impulsa-session");
              nav("/");
            }}
          >
            <LogOut size={18} /> Cerrar sesión
          </button>
          <p className="footnote">
            Preferencias locales de demostración. No se envían correos ni
            notificaciones push.
          </p>
        </>
      )}
      {modal === "help" && (
        <Modal title="Ayuda y soporte" onClose={() => setModal(null)}>
          {[
            [
              "¿Cómo comienzo?",
              "Completa tu perfil y explora las ofertas. Puedes guardar una para practicar en el simulador.",
            ],
            [
              "¿Cómo descargo mi CV?",
              "Abre Genera tu CV, completa los tres pasos y selecciona Descargar PDF.",
            ],
            [
              "¿Dónde se guardan mis cambios?",
              "Solo en este navegador, mediante localStorage. No se sincronizan entre dispositivos.",
            ],
            [
              "¿Las postulaciones son reales?",
              "Las ofertas, empresas y flujos son ejemplos del prototipo. No se envía información a empleadores.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </Modal>
      )}
      {modal === "password" && (
        <Modal title="Cambiar contraseña · Demo" onClose={() => setModal(null)}>
          <p className="info">
            Este formulario valida la interfaz. No modifica ni almacena una
            contraseña.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              if (d.get("new") !== d.get("confirm")) {
                setPasswordError("Las contraseñas no coinciden.");
                return;
              }
              setModal(null);
              notify(
                "Formulario validado. No se cambió ninguna contraseña real.",
              );
            }}
          >
            <Field label="Contraseña actual de prueba">
              <input type="password" required autoComplete="off" />
            </Field>
            <Field label="Nueva contraseña de prueba">
              <input
                name="new"
                type="password"
                required
                minLength={8}
                autoComplete="off"
              />
            </Field>
            <Field label="Confirmar contraseña de prueba">
              <input
                name="confirm"
                type="password"
                required
                minLength={8}
                autoComplete="off"
              />
            </Field>
            {passwordError && (
              <p className="error" role="alert">
                {passwordError}
              </p>
            )}
            <button className="btn full">Validar demostración</button>
          </form>
        </Modal>
      )}
      {modal === "reset" && (
        <Modal title="Restablecer demostración" onClose={() => setModal(null)}>
          <p>
            Se eliminarán de este navegador tu perfil editado, CV, experiencias,
            eventos, publicaciones y preferencias de ImpulsaUPCH.
          </p>
          <p>Puedes exportar tus datos antes de continuar.</p>
          <div className="modal-actions">
            <button className="btn secondary" onClick={exportData}>
              Exportar datos
            </button>
            <button
              className="btn danger"
              onClick={() => {
                Object.keys(localStorage)
                  .filter((k) => k.startsWith("impulsa:"))
                  .forEach((k) => localStorage.removeItem(k));
                window.location.hash = "/app";
                window.location.reload();
              }}
            >
              Borrar cambios locales
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
