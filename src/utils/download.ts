export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export type CVData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  career: string;
  university: string;
  cycle: string;
  skills: string;
  languages: string;
};
export async function downloadCV(
  cv: CVData,
  experiences: {
    title: string;
    organization: string;
    start: string;
    end: string;
    description: string;
  }[],
) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const margin = 20,
    width = 170;
  let y = 23;
  const text = (value: string, size = 11, bold = false, color = "#242230") => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(value || "—", width) as string[];
    for (const line of lines) {
      if (y > 277) {
        doc.addPage();
        y = 23;
      }
      doc.text(line, margin, y);
      y += size * 0.46;
    }
    y += 4;
  };
  const section = (title: string) => {
    if (y > 255) {
      doc.addPage();
      y = 23;
    }
    y += 4;
    text(title, 12, true, "#6554ba");
  };
  text(cv.name, 23, true);
  text([cv.email, cv.phone, cv.location].filter(Boolean).join(" | "), 10);
  section("PERFIL PROFESIONAL");
  text(cv.summary);
  section("FORMACIÓN ACADÉMICA");
  text(cv.career, 12, true);
  text(`${cv.university} · ${cv.cycle}`);
  if (experiences.length) {
    section("EXPERIENCIA Y PROYECTOS");
    for (const e of experiences) {
      text(e.title, 12, true);
      text(`${e.organization} | ${e.start} - ${e.end || "Actualidad"}`, 10);
      text(e.description);
    }
  }
  section("HABILIDADES");
  text(cv.skills);
  if (cv.languages.trim()) {
    section("IDIOMAS");
    text(cv.languages);
  }
  for (let i = 1; i <= doc.getNumberOfPages(); i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor("#737080");
    doc.text(`${i} / ${doc.getNumberOfPages()}`, 190, 289, { align: "right" });
  }
  doc.save(`CV_${cv.name.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ]/g, "_")}.pdf`);
}
