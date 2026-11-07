import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  AudioLines,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import { PageTitle, Field } from "../components/UI";
import { questions, jobs } from "../data/demo";
import { answerTips } from "../utils/domain.mjs";
import { useLocalState } from "../hooks/useLocalState";
export default function Simulator() {
  const [params] = useSearchParams();
  const [jobId, setJobId] = useState(params.get("oferta") || "1");
  const [phase, setPhase] = useState<"prep" | "practice" | "results">("prep");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    Array(questions.length).fill(""),
  );
  const [history, setHistory] = useLocalState<
    { date: string; responses: number }[]
  >("interviews", []);
  const job = jobs.find((j) => j.id === Number(jobId)) || jobs[0];
  const current = answerTips(answers[index]);
  return (
    <>
      <PageTitle
        title="Simulador de entrevistas"
        subtitle="Practica a tu ritmo. Gana confianza para tu siguiente paso."
      />
      <div className="info">
        <Lightbulb size={16} /> Práctica escrita de demostración. Las
        sugerencias siguen reglas de extensión y estructura; no son una
        evaluación de IA.
      </div>
      {phase === "prep" ? (
        <div className="simulator-prep">
          <section className="card">
            <div className="feature-icon">
              <AudioLines size={30} />
            </div>
            <h2>
              Tu próxima entrevista
              <br />
              empieza aquí.
            </h2>
            <p className="muted">
              Ensaya con cinco preguntas habituales y revisa tus respuestas al
              terminar.
            </p>
            <Field label="Selecciona una oferta para practicar">
              <select value={jobId} onChange={(e) => setJobId(e.target.value)}>
                {jobs.map((j) => (
                  <option value={j.id} key={j.id}>
                    {j.title} · {j.company}
                  </option>
                ))}
              </select>
            </Field>
            <button
              className="btn dark full"
              onClick={() => {
                setIndex(0);
                setAnswers(Array(questions.length).fill(""));
                setPhase("practice");
              }}
            >
              Comenzar simulación <ArrowRight size={17} />
            </button>
          </section>
          <section className="card tips-card">
            <span className="eyebrow">ANTES DE COMENZAR</span>
            <h2>
              Cuenta tu historia
              <br />
              con claridad.
            </h2>
            <ol>
              <li>Lee la oferta e identifica qué puedes aportar.</li>
              <li>Usa ejemplos de cursos, proyectos o experiencias.</li>
              <li>Explica la situación, tu acción y el resultado.</li>
              <li>Responde con tus palabras: no hay un guion perfecto.</li>
            </ol>
            <small className="muted">
              {history.length} prácticas completadas en este navegador.
            </small>
          </section>
        </div>
      ) : phase === "practice" ? (
        <section className="card interview-card">
          <div className="section-caption">
            <span className="pill lavender">{job.company}</span>
            <small>
              Pregunta {index + 1} de {questions.length}
            </small>
          </div>
          <progress value={index + 1} max={questions.length} />
          <span className="eyebrow">PRACTICA TU RESPUESTA</span>
          <h2>{questions[index]}</h2>
          <Field label="Tu respuesta">
            <textarea
              value={answers[index]}
              onChange={(e) =>
                setAnswers((a) =>
                  a.map((x, i) => (i === index ? e.target.value : x)),
                )
              }
              placeholder="Describe una situación concreta y lo que aprendiste..."
              maxLength={4000}
              rows={8}
            />
          </Field>
          <p className="muted">
            {current.count} palabras · {current.tip}
          </p>
          <div className="modal-actions">
            <button
              className="btn secondary"
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
            >
              Anterior
            </button>
            <button
              className="btn"
              disabled={!answers[index].trim()}
              onClick={() => {
                if (index < questions.length - 1) setIndex(index + 1);
                else {
                  setHistory((h) => [
                    {
                      date: new Date().toISOString(),
                      responses: answers.filter((a) => answerTips(a).complete)
                        .length,
                    },
                    ...h,
                  ]);
                  setPhase("results");
                }
              }}
            >
              {index === questions.length - 1
                ? "Ver resumen"
                : "Siguiente pregunta"}{" "}
              <ArrowRight size={16} />
            </button>
          </div>
          <button className="text-button" onClick={() => setPhase("prep")}>
            Salir de la práctica
          </button>
        </section>
      ) : (
        <section className="card results-card">
          <div className="feature-icon">
            <CheckCircle2 size={32} />
          </div>
          <span className="eyebrow">UN PASO MÁS CERCA</span>
          <h2>¡Completaste tu práctica!</h2>
          <p>
            Respondiste las {questions.length} preguntas.{" "}
            {answers.filter((a) => answerTips(a).complete).length} tienen al
            menos 25 palabras.
          </p>
          <div className="info">
            La extensión no mide tu capacidad ni garantiza un resultado en una
            entrevista real. Revisa si tus ejemplos muestran tus acciones y
            aprendizajes.
          </div>
          {questions.map((q, i) => (
            <details key={q}>
              <summary>
                {i + 1}. {q}
              </summary>
              <p>{answers[i]}</p>
              <small className="muted">{answerTips(answers[i]).tip}</small>
            </details>
          ))}
          <div className="modal-actions">
            <button className="btn" onClick={() => setPhase("prep")}>
              <RotateCcw size={16} /> Volver a practicar
            </button>
            <Link className="btn secondary" to="/app/perfil">
              Revisar competencias
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
