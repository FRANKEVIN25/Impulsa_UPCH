export function calendarDays(year, month) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(year, month, 1 - offset + i);
    return {
      day: d.getDate(),
      current: d.getMonth() === month,
      date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
    };
  });
}
export function matchingSkills(required, owned) {
  return required.filter((s) =>
    owned.some((o) => o.toLowerCase().trim() === s.toLowerCase().trim()),
  );
}
export function filterJobs(jobs, query, filter) {
  const q = query.trim().toLowerCase();
  return jobs.filter(
    (j) =>
      (filter !== "Remoto" || j.mode === "Remoto") &&
      `${j.title} ${j.company} ${j.location}`.toLowerCase().includes(q),
  );
}
export function answerTips(answer) {
  const count = answer.trim().split(/\s+/).filter(Boolean).length;
  return {
    count,
    complete: count >= 25,
    tip:
      count >= 25
        ? "Tu respuesta tiene una extensión útil para practicar. Revisa que incluya tu acción y un resultado concreto."
        : "Amplía tu respuesta con una situación, tu acción y un resultado concreto.",
  };
}
