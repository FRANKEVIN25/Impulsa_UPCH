# ImpulsaUPCH

Frontend de preparación para prácticas preprofesionales, basado en el diseño de ImpulsaUPCH. React + TypeScript + Vite, con tipografía Inter, menú negro y acentos morados `#8A7CF3`.

## Ejecutar en Windows, macOS o Linux

Requisito: **Node.js 22.12 o superior** (o Node 24 LTS). Si tienes Node 22.15, puedes usarlo.

1. Extrae el ZIP completo.
2. Abre la carpeta `impulsa-upch` en VS Code.
3. En la terminal de esa carpeta ejecuta:

```bash
npm ci
npm run dev
```

4. Abre la dirección que muestre la terminal, normalmente `http://localhost:5173`.
5. Pulsa **Explorar demostración** para recorrer la aplicación sin ingresar credenciales.

No abras `index.html` con doble clic: utiliza el servidor de Vite.

## Probar en el celular

Conecta la PC y el celular a la misma red Wi-Fi y ejecuta:

```bash
npm run dev -- --host 0.0.0.0
```

Abre en el celular la dirección **Network** que aparece en la terminal, por ejemplo `http://192.168.1.10:5173`. Si Windows pregunta, permite el acceso del servidor en tu red privada. La interfaz se adapta al tamaño de pantalla. Es una aplicación web responsive; el ZIP no contiene un APK ni una aplicación nativa.

## Qué puedes probar

- Bienvenida, registro, inicio de sesión y recuperación como flujos de demostración.
- Inicio con progreso, accesos rápidos y actividad local.
- Perfil editable: datos, competencias y disponibilidad.
- Ofertas: búsqueda, filtro remoto, guardadas, coincidencia de habilidades y postulación demo.
- Simulador: cinco preguntas, respuestas escritas, navegación y resumen con reglas transparentes.
- Foro: buscar, filtrar, publicar, dar me gusta y comentar.
- Calendario: cambiar de mes, seleccionar días, ver detalles, agregar y eliminar eventos.
- CV: tres pasos, selección de experiencias, vista previa y **descarga real en PDF**, con paginación.
- Experiencia: agregar, editar, consultar y eliminar proyectos, prácticas y voluntariados.
- Configuración: interruptores, ayuda, privacidad, exportación JSON y restablecimiento local.
- Ghost: conversación guiada con respuestas preparadas sobre CV, ofertas y entrevistas.

Los cambios se guardan en `localStorage`, únicamente en el navegador usado. El modo incógnito o el borrado de datos del sitio puede eliminarlos. No hay backend, base de datos, sincronización, autenticación real, envío de correos, postulaciones reales ni servicios de IA. Las contraseñas de prueba nunca se guardan ni se envían. Los interruptores representan preferencias locales, no permisos ni seguridad efectiva.

## Organización

```text
impulsa-upch/
  public/assets/       Imágenes e íconos exportados de Figma
  src/
    components/        Layout, navegación, diálogos y controles compartidos
    context/           Estado compartido de la aplicación
    data/              Datos de ejemplo y preguntas del simulador
    hooks/             Persistencia local
    pages/             Pantallas organizadas por funcionalidad
    styles/            Estilos y adaptación responsive
    utils/             Calendario, filtros, descargas y generación PDF
    App.tsx            Rutas
    main.tsx           Entrada de React
  tests/               Pruebas de lógica de dominio
  docs/                Alcance, referencia visual y validación
  dist/                Versión compilada para publicar
  package-lock.json    Dependencias fijadas para npm ci
```

## Comandos

```bash
npm run dev       # Desarrollo con recarga automática
npm run build     # Verificación TypeScript y compilación
npm run preview   # Servir la compilación localmente
npm test          # Pruebas de lógica
npm run format    # Formatear código y documentación
```

`dist/` ya está incluido como referencia de la versión verificada. Para probarlo después de instalar dependencias, ejecuta `npm run preview`. Puedes publicar su contenido en cualquier hosting estático. Las rutas usan `HashRouter` (`/#/app/ofertas`) para funcionar sin reglas de reescritura del servidor. Se usan rutas relativas para recursos, por lo que también puede alojarse en una subcarpeta.

## Personalizar

- Colores y tamaños: variables de `src/styles/global.css`.
- Ofertas, perfil inicial y ejemplos: `src/data/demo.ts`.
- Pantallas y funciones: `src/pages/`.
- PDF: `src/utils/download.ts`.
- Rutas: `src/App.tsx`.

Consulta [docs/ALCANCE.md](docs/ALCANCE.md) para conocer qué se extrajo de Figma y qué se adaptó.

## Prueba opcional de flujos en navegador

Además de `npm test`, puedes ejecutar el recorrido automatizado. El script inicia su propio servidor local en el puerto 5173; deja ese puerto libre.

```bash
npx playwright install chromium
npm run test:browser
```

Comprueba edición y persistencia del perfil, ofertas, guardadas, postulación demo, experiencias, PDF, eventos, foro, simulador, configuración, Ghost, menú móvil y validación del registro. El PDF de prueba se escribe en la carpeta temporal del sistema.
