import { lazy, Suspense } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Layout from "./components/Layout";
import Auth, { Welcome } from "./pages/Auth";
import Home from "./pages/Home";
const Profile = lazy(() => import("./pages/Profile"));
const Offers = lazy(() => import("./pages/Offers"));
const Simulator = lazy(() => import("./pages/Simulator"));
const Forum = lazy(() => import("./pages/Forum"));
const Calendar = lazy(() => import("./pages/Calendar"));
const CV = lazy(() => import("./pages/CV"));
const Experience = lazy(() => import("./pages/Experience"));
const Settings = lazy(() => import("./pages/Settings"));
const Assistant = lazy(() => import("./pages/Assistant"));
export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <Suspense
        fallback={
          <div className="loading" role="status">
            Cargando tu espacio...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/acceso" element={<Auth />} />
          <Route path="/app" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="perfil" element={<Profile />} />
            <Route path="ofertas" element={<Offers />} />
            <Route path="simulador" element={<Simulator />} />
            <Route path="foro" element={<Forum />} />
            <Route path="calendario" element={<Calendar />} />
            <Route path="cv" element={<CV />} />
            <Route path="experiencia" element={<Experience />} />
            <Route path="configuracion" element={<Settings />} />
            <Route
              path="configuracion/privacidad"
              element={<Settings privacy />}
            />
            <Route path="asistente" element={<Assistant />} />
          </Route>
          <Route
            path="*"
            element={
              <div className="empty">
                <h1>No encontramos esta página</h1>
                <Link className="btn" to="/app">
                  Volver al inicio
                </Link>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}
