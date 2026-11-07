import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Home,
  UserRound,
  BriefcaseBusiness,
  AudioLines,
  MessagesSquare,
  CalendarDays,
  FileUser,
  Shapes,
  Settings,
  LogOut,
  Menu,
  Bell,
  X,
  Sparkles,
} from "lucide-react";
import { Brand, Modal, asset } from "./UI";
import { useApp } from "../context/AppContext";
const links = [
  ["", "Inicio", Home, "aa8ae.svg"],
  ["perfil", "Mi perfil", UserRound, "d6333.svg"],
  ["ofertas", "Ofertas", BriefcaseBusiness, "78cc7.svg"],
  ["simulador", "Simulador", AudioLines, "c03a7.svg"],
  ["foro", "Foro", MessagesSquare, "b0133.svg"],
  ["calendario", "Calendario", CalendarDays, "79b9a.svg"],
  ["cv", "Genera tu CV", FileUser, "b7ca7.svg"],
  ["experiencia", "Experiencia", Shapes, "a4d5a.svg"],
  ["configuracion", "Configuración", Settings, "8cabf.svg"],
] as const;
export default function Layout() {
  const [open, setOpen] = useState(false),
    [notifications, setNotifications] = useState(false);
  const { profile, toast, setToast, applications } = useApp();
  const location = useLocation();
  const nav = useNavigate();
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(t);
  }, [toast, setToast]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <button
            className="icon-button mobile-menu"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu />
          </button>
          <Link to="/app" aria-label="ImpulsaUPCH inicio">
            <Brand />
          </Link>
        </div>
        <div className="topbar-right">
          <span className="demo-badge">Prototipo interactivo</span>
          <button
            className="icon-button notification-button"
            onClick={() => setNotifications(true)}
            aria-label="Notificaciones"
          >
            <img src={asset("79c61.svg")} width="20" height="22" alt="" />
            <i />
          </button>
          <Link to="/app/perfil" className="avatar" aria-label="Mi perfil">
            {profile.name
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")}
          </Link>
        </div>
      </header>
      <aside className="desktop-sidebar">
        <p className="sidebar-eyebrow">TU PRÓXIMO LOGRO</p>
        <nav aria-label="Menú principal">
          {links.map(([path, label, Icon, svg]) => (
            <NavLink key={path} end to={"/app" + (path ? "/" + path : "")}>
              <img
                src={asset(svg)}
                className="nav-asset"
                width="20"
                height="20"
                alt=""
              />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-note">
          <Sparkles size={20} />
          <strong>Un paso más cerca.</strong>
          <small>Tu preparación de hoy abre las puertas de mañana.</small>
        </div>
        <button
          className="logout"
          onClick={() => {
            sessionStorage.removeItem("impulsa-session");
            nav("/");
          }}
        >
          <LogOut size={18} /> Cerrar sesión
        </button>
      </aside>
      {open && (
        <Modal title="IMPULSA UPCH" onClose={() => setOpen(false)}>
          <nav className="mobile-navigation">
            {links.map(([path, label, Icon]) => (
              <NavLink
                key={path}
                end
                to={"/app" + (path ? "/" + path : "")}
                onClick={() => setOpen(false)}
              >
                <Icon size={20} />
                {label}
              </NavLink>
            ))}
          </nav>
          <button
            className="btn full"
            onClick={() => {
              sessionStorage.removeItem("impulsa-session");
              nav("/");
            }}
          >
            Cerrar sesión
          </button>
        </Modal>
      )}
      <main className="workspace" id="main-content">
        <Outlet />
      </main>
      <nav className="bottom-nav" aria-label="Navegación rápida">
        {[links[0], links[2], links[3], links[4]].map(([path, label, Icon]) => (
          <NavLink end key={path} to={"/app" + (path ? "/" + path : "")}>
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
        <button onClick={() => setOpen(true)}>
          <Menu size={20} />
          <span>Más</span>
        </button>
      </nav>
      {toast && (
        <div role="status" className="toast">
          {toast}
          <button aria-label="Cerrar aviso" onClick={() => setToast("")}>
            <X size={16} />
          </button>
        </div>
      )}
      {notifications && (
        <Modal title="Notificaciones" onClose={() => setNotifications(false)}>
          <p className="muted">
            Actividad de ejemplo y cambios de tu sesión local.
          </p>
          <div className="notice-item">
            <span className="dot" />
            <div>
              <strong>Tu siguiente oportunidad te espera</strong>
              <p>Explora las ofertas recomendadas para tu perfil.</p>
              <Link to="/app/ofertas" onClick={() => setNotifications(false)}>
                Ver ofertas →
              </Link>
            </div>
          </div>
          <div className="notice-item">
            <span className="dot" />
            <div>
              <strong>Prepara tu próxima entrevista</strong>
              <p>Practica tus respuestas con el simulador.</p>
              <Link to="/app/simulador" onClick={() => setNotifications(false)}>
                Ir al simulador →
              </Link>
            </div>
          </div>
          {applications.length > 0 && (
            <p className="info">
              Tienes {applications.length} postulación(es) de demostración.
            </p>
          )}
        </Modal>
      )}
    </div>
  );
}
