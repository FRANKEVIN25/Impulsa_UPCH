import { useState, useEffect, useRef } from "react";
import { Send, Sparkles } from "lucide-react";
import { PageTitle, asset } from "../components/UI";
const responses = [
  {
    words: ["cv", "currículum", "curriculum"],
    text: "Para mejorar tu CV, elige una práctica y destaca dos proyectos relacionados. Explica el problema, tu aporte y el resultado. En «Genera tu CV» puedes crear y descargar una versión en PDF.",
  },
  {
    words: ["entrevista", "simulador", "nervios"],
    text: "Prepara una presentación de un minuto y un ejemplo de trabajo en equipo. Organiza cada respuesta en situación, tarea, acción y resultado. Puedes ensayarlo en el Simulador.",
  },
  {
    words: ["práctica", "practica", "oferta", "empleo"],
    text: "Revisa primero las habilidades requeridas y la modalidad. Guarda las ofertas que te interesan, compara los requisitos con tus competencias y prepara un CV específico para cada puesto.",
  },
  {
    words: ["habilidad", "competencia", "perfil"],
    text: "Incluye habilidades que puedas demostrar con proyectos o experiencias. En Mi perfil puedes agregar tus competencias; luego, las ofertas muestran cuáles coinciden con sus requisitos.",
  },
];
export default function Assistant() {
  const [messages, setMessages] = useState([
      {
        role: "assistant",
        text: "¡Hola! Soy Ghost. Esta es una conversación de demostración con respuestas preparadas. Puedo darte orientación general sobre CV, entrevistas y búsqueda de prácticas.",
      },
    ]),
    [input, setInput] = useState("");
  const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);
  function send(value: string) {
    const text = value.trim();
    if (!text) return;
    const match = responses.find((r) =>
      r.words.some((w) => text.toLowerCase().includes(w)),
    );
    setMessages((m) => [
      ...m,
      { role: "user", text },
      {
        role: "assistant",
        text:
          match?.text ||
          "Puedo orientarte sobre CV, entrevistas, competencias y ofertas de prácticas. Elige uno de esos temas para continuar. Esta demo no interpreta otras consultas ni se conecta a un modelo de IA.",
      },
    ]);
    setInput("");
  }
  return (
    <>
      <PageTitle
        title="Ghost, tu asistente"
        subtitle="Una pequeña guía para tu siguiente gran paso."
      />
      <div className="assistant-layout card">
        <div className="assistant-header">
          <img src={asset("87784.png")} alt="Ghost" />
          <div>
            <strong>Ghost</strong>
            <small>Respuestas guiadas · Demo sin IA</small>
          </div>
          <Sparkles size={21} />
        </div>
        <div
          className="chat-messages"
          role="log"
          aria-label="Conversación con Ghost"
        >
          {messages.map((m, i) => (
            <div key={i} className={"chat-bubble " + m.role}>
              <small>{m.role === "user" ? "Tú" : "Ghost"}</small>
              <p>{m.text}</p>
            </div>
          ))}
          <div ref={bottom} />
        </div>
        <div className="chat-suggestions">
          {["Mejora mi CV", "Practicar entrevista", "Buscar prácticas"].map(
            (t) => (
              <button className="pill" key={t} onClick={() => send(t)}>
                {t}
              </button>
            ),
          )}
        </div>
        <form
          className="chat-form"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Mensaje para Ghost"
            placeholder="Escribe tu consulta..."
            maxLength={1000}
          />
          <button
            className="btn"
            aria-label="Enviar mensaje"
            disabled={!input.trim()}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
}
