import { useState } from "react";
import { Heart, MessageCircle, Search, Plus, Send } from "lucide-react";
import { PageTitle, Modal, Field, Empty, asset } from "../components/UI";
import { useApp } from "../context/AppContext";
export default function Forum() {
  const { posts, setPosts, profile, notify } = useApp();
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("Para ti"),
    [create, setCreate] = useState(false),
    [selected, setSelected] = useState<string | null>(null),
    [reply, setReply] = useState("");
  const post = posts.find((p) => p.id === selected);
  const visible = posts.filter(
    (p) =>
      (filter === "Para ti" || p.category === filter) &&
      `${p.title} ${p.body} ${p.author}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <PageTitle
        title="Foro"
        subtitle="Comparte lo que aprendes. Crecemos en comunidad."
        action={
          <button className="btn dark" onClick={() => setCreate(true)}>
            <Plus size={17} /> Publicar
          </button>
        }
      />
      <div className="search-box">
        <Search size={19} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar temas, empresas o consejos..."
          aria-label="Buscar en el foro"
        />
      </div>
      <div className="chips">
        {["Para ti", "Prácticas", "CV", "Entrevistas", "Herramientas"].map(
          (t) => (
            <button
              className={t === filter ? "selected" : ""}
              aria-pressed={t === filter}
              key={t}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ),
        )}
      </div>
      <div className="section-heading">
        <h2>Conversaciones recientes</h2>
        <small className="muted">Comunidad de ejemplo</small>
      </div>
      <div className="forum-grid">
        {visible.map((p) => (
          <article className="post-card card" key={p.id}>
            <div className="post-author">
              <span className={"avatar avatar-" + p.initials}>
                {p.initials}
              </span>
              <div className="grow">
                <strong>{p.author}</strong>
                <small>{p.time}</small>
              </div>
              <span className="pill">{p.category}</span>
            </div>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
            {p.image && (
              <img
                className="post-image"
                src={asset(p.image)}
                alt="Vista de los ejercicios y certificaciones en HackerRank"
              />
            )}
            <div className="post-actions">
              <button
                aria-label={p.liked ? "Quitar me gusta" : "Me gusta"}
                aria-pressed={p.liked}
                onClick={() =>
                  setPosts((ps) =>
                    ps.map((x) =>
                      x.id === p.id
                        ? {
                            ...x,
                            liked: !x.liked,
                            likes: x.likes + (x.liked ? -1 : 1),
                          }
                        : x,
                    ),
                  )
                }
                className={p.liked ? "liked" : ""}
              >
                <Heart size={17} fill={p.liked ? "currentColor" : "none"} />
                {p.likes}
              </button>
              <button onClick={() => setSelected(p.id)}>
                <MessageCircle size={17} />
                {p.comments.length} respuestas
              </button>
              <button
                className="read-comments"
                onClick={() => setSelected(p.id)}
              >
                Leer comentarios ›
              </button>
            </div>
          </article>
        ))}
      </div>
      {!visible.length && (
        <Empty
          title="Inicia una conversación"
          detail="No hay publicaciones para esta búsqueda."
          action={
            <button className="btn" onClick={() => setCreate(true)}>
              Publicar
            </button>
          }
        />
      )}
      {create && (
        <Modal title="Nueva publicación" onClose={() => setCreate(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              setPosts((ps) => [
                {
                  id: crypto.randomUUID(),
                  author: profile.name,
                  initials: profile.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join(""),
                  category: String(d.get("category")),
                  time: "Ahora",
                  title: String(d.get("title")).trim(),
                  body: String(d.get("body")).trim(),
                  image: "",
                  likes: 0,
                  liked: false,
                  comments: [],
                },
                ...ps,
              ]);
              setCreate(false);
              setFilter("Para ti");
              setQuery("");
              notify("Publicación guardada en este navegador.");
            }}
          >
            <Field label="Título">
              <input name="title" required pattern=".*\S.*" maxLength={100} />
            </Field>
            <Field label="Categoría">
              <select name="category">
                {["Prácticas", "CV", "Entrevistas", "Herramientas"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="¿Qué quieres compartir?">
              <textarea
                name="body"
                required
                minLength={10}
                maxLength={3000}
                rows={5}
              />
            </Field>
            <p className="muted">Solo se publica en tu demostración local.</p>
            <button className="btn full">Publicar</button>
          </form>
        </Modal>
      )}
      {post && (
        <Modal
          title={post.title}
          onClose={() => {
            setSelected(null);
            setReply("");
          }}
        >
          <p>{post.body}</p>
          <h3>Comentarios ({post.comments.length})</h3>
          {post.comments.map((c, i) => (
            <div className="comment" key={i}>
              <strong>{c.author}</strong>
              <p>{c.body}</p>
            </div>
          ))}
          {!post.comments.length && (
            <p className="muted">Sé el primero en aportar una idea.</p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!reply.trim()) return;
              setPosts((ps) =>
                ps.map((p) =>
                  p.id === post.id
                    ? {
                        ...p,
                        comments: [
                          ...p.comments,
                          { author: profile.name, body: reply.trim() },
                        ],
                      }
                    : p,
                ),
              );
              setReply("");
            }}
          >
            <Field label="Tu comentario">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                required
                maxLength={1000}
              />
            </Field>
            <button className="btn" disabled={!reply.trim()}>
              <Send size={16} /> Comentar
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
