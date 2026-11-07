# Alcance y decisiones

## Referencia

Diseño: https://www.figma.com/design/Sx9hQwsEVZzGzGIeNSr7kE/ImpulsaUPCH?node-id=0-1

Se inspeccionó la estructura de la página y se extrajeron código de referencia, imágenes, íconos y capturas de estas pantallas:

| Nodo     | Pantalla               | Implementación                                                       |
| -------- | ---------------------- | -------------------------------------------------------------------- |
| 1:2      | Inicio de ImpulsaUPCH  | Bienvenida con logo, trama e ilustración originales                  |
| 15:71    | Barra lateral / Inicio | Menú e información del inicio, reorganizados para escritorio y móvil |
| 41:1098  | Mi perfil / Resumen    | Cabecera, avatar, pestañas y datos del perfil                        |
| 381:6173 | Ofertas                | Logos originales, tarjetas, buscador y acciones                      |
| 118:2    | Foro                   | Autores, categorías, publicación e imagen de referencia              |
| 404:498  | Configuración          | Cuenta, interruptores, ayuda, privacidad y cierre de sesión          |
| 404:208  | Mi calendario          | Calendario, eventos, detalle y acción de agregar                     |

Figma informó que se alcanzó el límite de consultas MCP del plan Starter. Por ello no se obtuvo el contexto detallado de todas las pantallas restantes. Registro, competencias, disponibilidad, simulación, CV, experiencias, privacidad, conversación con Ghost y subflujos se completaron como una **adaptación funcional coherente con el sistema visual disponible**. No se presenta como una copia exacta de todas las pantallas de Figma.

La versión de escritorio amplía el diseño móvil: navegación lateral persistente, cuadrículas y mejor aprovechamiento del ancho. En móvil se utiliza un menú modal y navegación inferior para acceder con facilidad a las secciones.

## Arquitectura

React 19, TypeScript y Vite. CSS sin framework visual adicional. Componentes compartidos para controles, formularios y diálogos. Lucide para iconografía complementaria; recursos originales descargados en `public/assets`. Inter se sirve localmente desde el paquete Fontsource, sin Google Fonts ni URLs temporales de Figma en ejecución.

Las pantallas se cargan bajo demanda. El generador PDF también se carga al descargar, para reducir el JavaScript inicial. La aplicación funciona sin servidor de negocio ni claves de API.

## Comportamientos locales

Los ejemplos del archivo Figma se conservan como demostración, incluyendo el perfil de Ángel. Puedes cambiarlos desde Mi perfil; no se utilizan datos personales reales del propietario del proyecto.

Las ofertas y el foro están basados en contenido de ejemplo. Las empresas no han publicado convocatorias a través de esta aplicación. Una postulación únicamente agrega un identificador al estado local.

Los resultados del simulador no son puntuaciones de empleabilidad. Se cuenta la extensión de las respuestas y se ofrecen recordatorios generales; no se analiza su veracidad, calidad profesional, voz o imagen.

El PDF se crea con una plantilla local; puede tener una distribución distinta de la vista previa HTML. El contenido del PDF sí se deriva de los campos del asistente y las experiencias seleccionadas. Puede ocupar varias páginas. El exportador PDF usa las fuentes estándar de PDF y está preparado para español y alfabeto latino; escrituras como chino, árabe o emoji requieren incorporar otras fuentes.

Los formularios de acceso y contraseña solo validan interacciones. No existe protección de rutas ni permisos. Nunca deben usarse contraseñas reales en la demostración.

El almacenamiento está asociado al origen del sitio y al navegador; no sincroniza entre PC y celular. Si el navegador bloquea el almacenamiento o se llena la cuota, los cambios siguen en memoria durante la sesión, pero podrían no persistir.

## Continuación futura

Para convertirlo en un producto conectado se deberán agregar autenticación, API, autorización, almacenamiento de archivos y datos, convocatorias reales y servicios de mensajería. La separación entre estado, datos y pantallas permite incorporar esa capa después sin rehacer la navegación.
