const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { spawn } = require("child_process");
(async () => {
  const vite = spawn(
    process.execPath,
    ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", "5173"],
    { cwd: process.cwd() },
  );
  await new Promise((res, rej) => {
    vite.stdout.on("data", (b) => {
      if (b.toString().includes("Local:")) res();
    });
    vite.on("error", rej);
  });
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.stack));
    async function go(route) {
      await page.goto("http://127.0.0.1:5173/#/app/" + route);
      await page.locator("h1").first().waitFor();
    }
    async function button(name) {
      await page.getByRole("button", { name, exact: true }).click();
    }
    await go("perfil");
    await button("Editar perfil");
    await page
      .getByLabel("Nombre completo", { exact: true })
      .fill("Camila Prueba");
    await button("Guardar cambios");
    await page.getByRole("heading", { name: "Camila Prueba" }).waitFor();
    await page.reload();
    await page.getByRole("heading", { name: "Camila Prueba" }).waitFor();
    console.log("PASS profile persistence");
    await go("ofertas");
    await page.getByRole("textbox", { name: "Buscar prácticas" }).fill("NTT");
    assert.equal(await page.locator(".job-card").count(), 1);
    await button("Añadir a simulación");
    await button("Postular");
    await button("Continuar a postulación");
    await page
      .getByLabel("¿Por qué te interesa esta práctica?")
      .fill(
        "Quiero aprender a proteger sistemas y aplicar mis conocimientos de redes.",
      );
    await page.getByRole("checkbox").check();
    await button("Confirmar postulación demo");
    await page
      .getByText("Postulación registrada en esta demostración.", {
        exact: true,
      })
      .waitFor();
    await button("Cerrar ventana");
    console.log("PASS search save application");
    await go("experiencia");
    await button("Agregar experiencia");
    await page
      .getByLabel("Cargo o nombre del proyecto")
      .fill("Proyecto QA exportado");
    await page.getByLabel("Organización", { exact: true }).fill("UPCH");
    await page.getByLabel("Inicio", { exact: true }).fill("2026-03");
    await page.getByLabel("Fin (vacío si continúa)").fill("2026-07");
    await page
      .getByLabel("Describe tu aporte y tus logros")
      .fill(
        "Construí un prototipo de software para organizar prácticas y mejoré la navegación en teléfonos.",
      );
    await button("Guardar experiencia");
    await page
      .getByRole("heading", { name: "Proyecto QA exportado" })
      .waitFor();
    console.log("PASS experience create");
    await go("cv");
    await button("Crear mi CV");
    await button("Continuar");
    await button("Continuar");
    await button("Generar vista previa");
    await page.getByRole("heading", { name: "¡Tu CV está listo!" }).waitFor();
    const waitDownload = page.waitForEvent("download");
    await page.getByRole("button", { name: "Descargar PDF" }).first().click();
    const download = await waitDownload;
    await download.saveAs(
      require("node:path").join(
        require("node:os").tmpdir(),
        "impulsa-cv-test.pdf",
      ),
    );
    console.log("PASS CV PDF download");
    await go("calendario");
    await button("Agregar evento");
    await page.getByLabel("Título del evento").fill("Evento QA");
    await page.getByLabel("Fecha", { exact: true }).fill("2026-11-15");
    await page.getByLabel("Lugar o modalidad").fill("Virtual");
    await button("Guardar evento");
    await page.getByRole("button", { name: /Evento QA/ }).click();
    await page.getByRole("heading", { name: "Evento QA" }).waitFor();
    await button("Eliminar evento");
    assert.equal(
      await page.getByRole("button", { name: /Evento QA/ }).count(),
      0,
    );
    console.log("PASS calendar create delete");
    await go("foro");
    await button("Publicar");
    await page
      .getByLabel("Título", { exact: true })
      .fill("Mi proyecto de prueba");
    await page
      .getByLabel("¿Qué quieres compartir?")
      .fill(
        "Me gustaría conocer sus ideas para presentar mejor mi proyecto académico.",
      );
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Publicar", exact: true })
      .click();
    const post = page.locator(".post-card").filter({
      has: page.getByRole("heading", { name: "Mi proyecto de prueba" }),
    });
    await post.getByRole("button", { name: "Me gusta", exact: true }).click();
    await post
      .getByRole("button", { name: "Leer comentarios ›", exact: true })
      .click();
    await page
      .getByLabel("Tu comentario")
      .fill("Un comentario guardado en la demo.");
    await button("Comentar");
    await page
      .getByText("Un comentario guardado en la demo.", { exact: true })
      .waitFor();
    await button("Cerrar ventana");
    console.log("PASS forum create like comment");
    await go("simulador");
    await button("Comenzar simulación");
    for (let i = 0; i < 5; i++) {
      await page
        .getByLabel("Tu respuesta", { exact: true })
        .fill(
          "En un proyecto académico trabajé en equipo para construir un prototipo. Mi responsabilidad fue diseñar la interfaz, coordinar las tareas y evaluar los resultados con usuarios para aprender y mejorar.",
        );
      await button(i === 4 ? "Ver resumen" : "Siguiente pregunta");
    }
    await page
      .getByRole("heading", { name: "¡Completaste tu práctica!" })
      .waitFor();
    console.log("PASS simulator 5 answers");
    await go("configuracion");
    const toggle = page.getByRole("switch", {
      name: "Avisos por correo",
      exact: true,
    });
    await toggle.click();
    assert.equal(await toggle.getAttribute("aria-checked"), "true");
    await page.reload();
    assert.equal(
      await page
        .getByRole("switch", { name: "Avisos por correo", exact: true })
        .getAttribute("aria-checked"),
      "true",
    );
    console.log("PASS settings persistence");
    await go("asistente");
    await button("Mejora mi CV");
    await page.getByText(/Para mejorar tu CV, elige una práctica/).waitFor();
    await go("");
    console.log("PASS Ghost navigation regression");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Abrir menú", exact: true }).click();
    await page
      .getByRole("dialog")
      .getByRole("link", { name: "Genera tu CV", exact: true })
      .click();
    await page
      .getByRole("heading", { name: "Genera tu CV", exact: true })
      .waitFor();
    assert.equal(await page.locator("dialog[open]").count(), 0);
    console.log("PASS mobile menu");
    await page.goto("http://127.0.0.1:5173/#/acceso?modo=registro");
    await page
      .getByLabel("Nombre completo", { exact: true })
      .fill("Registro Demo");
    await page
      .getByLabel("Correo institucional", { exact: true })
      .fill("demo@upch.pe");
    await page
      .getByLabel("Carrera profesional", { exact: true })
      .fill("Ingeniería Informática");
    await page
      .getByLabel("Contraseña de demostración", { exact: true })
      .fill("solo-demo-1234");
    await page
      .getByLabel("Confirmar contraseña", { exact: true })
      .fill("incorrecta");
    await button("Registrarme");
    await page.getByRole("alert").waitFor();
    await page
      .getByLabel("Confirmar contraseña", { exact: true })
      .fill("solo-demo-1234");
    await button("Registrarme");
    await page.getByRole("heading", { name: /¡Hola, Registro!/ }).waitFor();
    assert.equal(
      await page.evaluate(() =>
        JSON.stringify(localStorage).includes("solo-demo-1234"),
      ),
      false,
    );
    console.log("PASS auth validation no password persistence");
    assert.deepEqual(errors, []);
    console.log("ALL FLOWS PASSED");
  } finally {
    await browser?.close();
    vite.kill();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
