import React, { useMemo, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
   SISTEMA DE ÍCONOS SVG EN LÍNEA (sin lucide-react)
   viewBox de 24x24, basado en trazos, grosor de 2 px
   ───────────────────────────────────────────── */
const ICON_PATHS = {
  bookOpen: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  brain: "M9.5 2a3.5 3.5 0 0 0-3 5.1A3.5 3.5 0 0 0 5 10.5 3.5 3.5 0 0 0 6 14a3.5 3.5 0 0 0 2.8 4A3.5 3.5 0 0 0 12 21a3.5 3.5 0 0 0 3.2-3 3.5 3.5 0 0 0 2.8-4 3.5 3.5 0 0 0 1-3.5 3.5 3.5 0 0 0-1.5-3.4A3.5 3.5 0 0 0 14.5 2 3.5 3.5 0 0 0 12 3.5 3.5 3.5 0 0 0 9.5 2zM12 3.5v17.5",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  globe: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  folderOpen: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2zM2 10h20",
  settings: "M12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  settingsGear: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  bot: "M12 8V4H8M8 2h8M2 14a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM9 16h.01M15 16h.01",
  penTool: "M12 19l7-7 3 3-7 7zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18z M2 2l7.586 7.586M11 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  checkCircle: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9 12l2 2 4-4",
  sparkles: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5zM19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75z",
  mic: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8",
  imagePlus: "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7M16 5h6M19 2v6M21 15l-5-5L5 21",
  fileText: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  clock: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
  panelsTopLeft: "M3 3h18a0 0 0 0 1 0 0v18a0 0 0 0 1 0 0H3a0 0 0 0 1 0 0V3zM3 9h18M9 21V9",
  workflow: "M3 3h4v4H3zM17 3h4v4h-4zM10 17h4v4h-4zM5 7v3a4 4 0 0 0 4 4h2M19 7v3a4 4 0 0 1-4 4h-2",
  laptop: "M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9M2 20h20M12 16v4",
  wrench: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  compass: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  refreshCcw: "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15",
  link2: "M9 17H7a5 5 0 0 1 0-10h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  headphones: "M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z",
  table2: "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  layoutGrid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  school: "M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5",
  share2: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98",
  lightbulb: "M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z",
  chevronDown: "M6 9l6 6 6-6",
  alertTriangle: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  layers: "M12 2l10 6.5v7L12 22 2 15.5v-7zM2 8.5l10 6.5 10-6.5M12 22V15",
  messageSquare: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  database: "M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3zM21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5",
};

function Ico({ name, className = "", style = {} }) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d={d} />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   FUENTE + ESTILOS GLOBALES
   ───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
    .ff-display { font-family: 'Fraunces', Georgia, serif; }
    .ff-body { font-family: 'DM Sans', system-ui, sans-serif; }
    .ff-mono { font-family: 'JetBrains Mono', monospace; }
    * { font-family: 'DM Sans', system-ui, sans-serif; }
    .clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  `}</style>
);

/* ─────────────────────────────────────────────
   COLORES
   ───────────────────────────────────────────── */
const C = {
  cream: "#FAF8F4", creamDark: "#F0EDE6", ink: "#1A1A1A", inkLight: "#6B6B6B",
  inkMuted: "#9B9B9B", border: "#E2DFD8", borderLight: "#ECEAE4",
  greenDeep: "#0A3D2E", greenMid: "#10a37f", greenLight: "#E8F5EE", roseAccent: "#E11D48",
};

/* ─────────────────────────────────────────────
   DATOS
   ───────────────────────────────────────────── */
const VERIFIED_DATE = "12 de marzo de 2026";
const LEVELS = [
  { key: "all", label: "Todo" }, { key: "foundation", label: "Fundamentos" },
  { key: "core", label: "Base" }, { key: "power", label: "Avanzado" }, { key: "expert", label: "Experto" },
];

const CORE_FEATURES = [
  { title: "Búsqueda", ico: "globe", color: "#0284c7", description: "Resultados web en tiempo real para hechos actuales, precios, noticias, leyes y cualquier cosa que cambie.", when: "Cualquier cosa que pudiera haber cambiado desde la fecha límite de entrenamiento del modelo." },
  { title: "Investigación profunda", ico: "search", color: "#4f46e5", description: "Investigación documentada de varios pasos a través de fuentes web, archivos y apps conectadas.", when: "Cuando necesitas un informe con fuentes, no una respuesta rápida." },
  { title: "Proyectos", ico: "folderOpen", color: "#059669", description: "Espacio de trabajo persistente con archivos compartidos, instrucciones personalizadas y memoria de conversación.", when: "Cualquier trabajo al que vayas a volver: cursos, clientes, startups." },
  { title: "Memoria", ico: "database", color: "#d97706", description: "Guarda preferencias duraderas y contexto recurrente entre conversaciones.", when: "Preferencias y patrones, no almacenamiento exacto de documentos." },
  { title: "Instrucciones personalizadas", ico: "settingsGear", color: "#57534e", description: "Reglas permanentes de comportamiento para tono, formato y estructura de respuesta.", when: "Cuando quieres que cada chat siga tus reglas por defecto." },
  { title: "Canvas", ico: "panelsTopLeft", color: "#334155", description: "Una superficie visible de trabajo para escribir y programar, con ediciones puntuales en línea.", when: "Edición iterativa de texto largo o código." },
  { title: "Tareas", ico: "clock", color: "#7c3aed", description: "Programa resultados que se ejecutan después y te notifican.", when: "Recordatorios, resúmenes diarios, síntesis recurrentes." },
  { title: "Apps (conectores)", ico: "wrench", color: "#0d9488", description: "Conecta herramientas externas para que ChatGPT pueda leer y actuar sobre tus datos.", when: "Cuando el mejor contexto vive fuera del chat." },
  { title: "Agente", ico: "workflow", color: "#16a34a", description: "Ejecución autónoma a través de navegadores, archivos, código y apps conectadas.", when: "Tareas de varios pasos entre sitios y acciones." },
  { title: "GPTs personalizados", ico: "bot", color: "#44403c", description: "Asistentes reutilizables con instrucciones estables y archivos de conocimiento.", when: "Cuando un flujo de trabajo se repite lo suficiente como para formalizarlo." },
  { title: "Voz", ico: "mic", color: "#e11d48", description: "Interacción hablada para pensar y explorar con menos fricción.", when: "Cuando quieres pensar en voz alta o hacer varias cosas a la vez." },
  { title: "Imágenes", ico: "imagePlus", color: "#c026d3", description: "Sube para analizar, genera a partir de descripciones y edita en línea.", when: "Comprensión visual, creación o refinamiento." },
  { title: "Archivos y datos", ico: "fileText", color: "#0891b2", description: "Sube PDFs, hojas de cálculo y documentos para analizarlos con ejecución de código.", when: "Gráficas, resúmenes, cálculos." },
  { title: "Modelos", ico: "brain", color: "#65a30d", description: "Elige entre modos optimizados para velocidad, equilibrio o razonamiento profundo.", when: "Cuando quieres ajustar la potencia a la complejidad de la tarea." },
];

const ADDITIONAL_FEATURES = [
  { title: "Modo estudio", ico: "school", color: "#059669", description: "Aprendizaje guiado con preguntas y comprobaciones de comprensión." },
  { title: "Grabar", ico: "headphones", color: "#0284c7", description: "Captura reuniones habladas y luego genera resúmenes." },
  { title: "Chats grupales", ico: "users", color: "#7c3aed", description: "Invita a otras personas a una conversación para planear en conjunto." },
  { title: "Enlaces compartidos", ico: "link2", color: "#57534e", description: "Comparte una conversación mediante URL." },
  { title: "Edición de imágenes", ico: "camera", color: "#c026d3", description: "Selecciona y ajusta regiones de imágenes generadas." },
  { title: "Tablas interactivas", ico: "table2", color: "#0891b2", description: "Inspecciona visualmente datos subidos antes de analizarlos." },
  { title: "Skills", ico: "share2", color: "#0d9488", description: "Flujos reutilizables para trabajos repetidos con consistencia." },
  { title: "Pulse", ico: "sparkles", color: "#4f46e5", description: "Investigación asíncrona que te devuelve resúmenes visuales." },
];

const TOOL_CHOOSER = [
  { goal: "Respuesta rápida o borrador", tool: "Chat normal", ico: "messageSquare", reason: "La menor fricción posible." },
  { goal: "Información actual", tool: "Búsqueda", ico: "globe", reason: "Para cualquier cosa que pueda haber cambiado." },
  { goal: "Trabajo continuo con archivos", tool: "Proyecto", ico: "folderOpen", reason: "Conserva el contexto entre sesiones." },
  { goal: "Editar un documento largo", tool: "Canvas", ico: "panelsTopLeft", reason: "Mejor para revisiones quirúrgicas." },
  { goal: "Informe con múltiples fuentes", tool: "Investigación profunda", ico: "search", reason: "Síntesis de varios pasos con citas." },
  { goal: "Tarea compleja en línea", tool: "Agente", ico: "workflow", reason: "Cruza varios sitios y acciones." },
  { goal: "Resultado recurrente", tool: "Tareas", ico: "clock", reason: "Se ejecuta de forma asíncrona y te avisa." },
  { goal: "El mismo flujo una y otra vez", tool: "GPT o Skill", ico: "bot", reason: "Convierte patrones en sistemas." },
];

const PROMPT_BLOCKS = [
  { label: "Objetivo", example: "Escribe un brief de una página para una reunión con inversionistas.", color: "#10a37f" },
  { label: "Contexto", example: "La startup aún no genera ingresos, está en Serie A y es de tecnología climática.", color: "#0284c7" },
  { label: "Restricciones", example: "Menos de 400 palabras. Sin jerga. Sin viñetas.", color: "#7c3aed" },
  { label: "Formato", example: "Estructúralo así: Problema, Solución, Tracción, Solicitud.", color: "#d97706" },
  { label: "Calidad", example: "Escribe al nivel de un associate de McKinsey, no como una plantilla.", color: "#e11d48" },
  { label: "Verificación", example: "Marca cualquier afirmación que necesite una fuente.", color: "#334155" },
];

const GUIDE_SECTIONS = [
  { id:"mental-model", level:"foundation", number:"01", title:"Empieza con el modelo mental correcto", ico:"brain", color:"#65a30d",
    summary:"Trata a ChatGPT como un socio de razonamiento, no como un oráculo. Su primera respuesta es un borrador útil, no una verdad final. Considera cada resultado como provisional hasta revisarlo.",
    whyItMatters:"La mayoría de las decepciones vienen de expectativas mal ajustadas. Espera un primer borrador competente, no certeza.",
    beginnerMoves:["Asume que la primera respuesta es un borrador. Léela con criterio.","Pregunta qué supuestos se hicieron.","Usa ChatGPT para acelerar tu juicio, no para reemplazarlo."],
    advancedMoves:["Pide el contraargumento más fuerte.","Separa exploración, recomendación y revisión de riesgos en distintas pasadas.","Úsalo como segunda opinión en decisiones importantes."],
    commonMistakes:["Confiar en afirmaciones numéricas sin verificarlas.","Asumir que el silencio equivale a confianza.","Copiar resultados textualmente."],
    promptExamples:[{prompt:"¿Qué supuestos hiciste?",why:"Saca a la luz el razonamiento oculto."},{prompt:"¿Qué cuestionaría un experto escéptico?",why:"Autoevaluación adversarial."},{prompt:"Dame el argumento más fuerte en contra de tu recomendación.",why:"Evita el sesgo de confirmación."},{prompt:"Califica tu nivel de confianza en cada afirmación del 1 al 5.",why:"Separa hechos de especulación."}],
    beforeAfter:{before:"Escríbeme un plan de negocios para una cafetería.",after:"Redacta un plan de una página para una cafetería de especialidad en el centro de Boston. Público objetivo: estudiantes de posgrado y personas que trabajan a distancia. Indica qué partes son estimadas y no están respaldadas por fuentes.",improvement:"Añade contexto, audiencia, ubicación y una regla de verificación."},
    visual:"mental" },
  { id:"workspace", level:"foundation", number:"02", title:"Aprende el espacio de trabajo antes de obsesionarte con los prompts", ico:"laptop", color:"#059669",
    summary:"ChatGPT moderno es un espacio de trabajo por capas. Distintos trabajos pertenecen a distintas capas. Un prompt decente en la capa correcta supera a un prompt ingenioso en la capa equivocada.",
    whyItMatters:"Elegir el espacio adecuado es la decisión de mayor impacto antes de escribir una sola palabra.",
    beginnerMoves:["Chat normal para tareas rápidas y únicas.","Proyecto para cualquier cosa a la que vayas a volver.","Chat temporal para empezar desde cero."],
    advancedMoves:["Un proyecto por curso, cliente o iniciativa.","Usa proyectos como centros de conocimiento a largo plazo.","Canvas para edición iterativa; chat para estrategia."],
    commonMistakes:["Abrir un chat nuevo cada vez en lugar de volver a un proyecto.","Usar chat para documentos largos en vez de canvas.","Ignorar por completo tareas y agente."],
    promptExamples:[{prompt:"¿Esto debería ir en un chat, proyecto o GPT?",why:"El modelo elige el espacio adecuado."},{prompt:"Diseña la estructura ideal de proyecto para mi semestre.",why:"Primero planea la arquitectura."},{prompt:"¿Qué archivos e instrucciones debería agregar?",why:"Optimiza el contexto del proyecto."}],
    beforeAfter:{before:"Siempre empiezo chats nuevos y pierdo el contexto.",after:"Crea un Proyecto. Sube referencias. Configura instrucciones. Vuelve siempre al mismo proyecto.",improvement:"Los chats efímeros se convierten en un espacio persistente."},
    visual:"layers" },
  { id:"prompting", level:"foundation", number:"03", title:"Prompts: la claridad vale más que la astucia", ico:"penTool", color:"#0284c7",
    summary:"Los buenos prompts son briefs operativos. La redacción elegante es opcional; las restricciones claras no. El modelo no puede ver los criterios que tienes en la cabeza si no los escribes.",
    whyItMatters:"Los prompts vagos producen resultados genéricos. La mayoría de la frustración viene de entradas poco definidas.",
    beginnerMoves:["Nombra explícitamente la audiencia y el caso de uso.","Indica cómo se ve un buen resultado.","Especifica formato, tono, longitud y qué evitar."],
    advancedMoves:["Primero esquema, luego aprobación y después borrador completo.","Separa hechos de interpretación.","Proporciona una rúbrica para autoevaluación."],
    commonMistakes:["Prompts de tres palabras esperando resultados personalizados.","Demasiadas restricciones al mismo tiempo.","Usar '¿puedes...?' en lugar de instrucciones directas."],
    promptExamples:[{prompt:"Objetivo: ___. Contexto: ___. Restricciones: ___. Entrega: ___.",why:"Estructura universal."},{prompt:"Primero haz el esquema. No redactes todavía.",why:"Evita rehacer una estructura equivocada."},{prompt:"Antes de escribir, dime qué necesitas saber.",why:"El modelo hace preguntas aclaratorias."},{prompt:"Escribe como [rol] explicándole a [audiencia].",why:"Fija el tono y la profundidad."}],
    beforeAfter:{before:"Escribe una carta de presentación.",after:"Carta de presentación para el puesto de Strategy Analyst en McKinsey. Estudiante de posgrado en International Management, con experiencia en SOP y CRM. Tono seguro, no arrogante. 350 palabras. No uses 'I am passionate about.'",improvement:"Rol, trayectoria, tono, longitud y una restricción negativa."},
    visual:"prompt" },
  { id:"revision", level:"core", number:"04", title:"Los flujos de revisión superan a la perfección en un solo intento", ico:"refreshCcw", color:"#7c3aed",
    summary:"El uso sólido es iterativo: enmarcar, redactar, criticar, revisar y empaquetar. La mayoría reinicia cuando debería refinar.",
    whyItMatters:"Un solo intento limita la calidad al primer resultado. Revisar de forma iterativa produce mejores resultados de manera consistente.",
    beginnerMoves:["Después del borrador: '¿Qué está débil o qué falta?'","Revisa con un objetivo más específico.","No reinicies a menos que la dirección esté realmente mal."],
    advancedMoves:["Pasadas fijas: estructura, precisión, tono, compresión y presentación.","Pide autocrítica antes de reescribir.","Especifica porcentajes de reducción."],
    commonMistakes:["Reescribir a mano en vez de pedir autodiagnóstico al modelo.","Comentarios vagos como 'hazlo mejor'.","Demasiadas pasadas sin enfoque."],
    promptExamples:[{prompt:"¿Por qué tu respuesta no cumplió el objetivo?",why:"Autodiagnóstico antes de revisar."},{prompt:"Revísalo para que la lógica sea más sólida. Mantén la estructura.",why:"Delimita el alcance."},{prompt:"Reduce el texto en 35% sin perder lo esencial.",why:"Obliga a priorizar."},{prompt:"Evalúalo con estos criterios. ¿Dónde está por debajo de 4/5?",why:"Autoevaluación estructurada."}],
    beforeAfter:{before:"Eso no está bien. Inténtalo otra vez.",after:"El argumento de la sección 2 es circular. Reescríbelo usando un dato del informe que subí. Deja intacto el resto.",improvement:"Qué está mal, qué corregir y qué conservar."},
    visual:"workflow" },
  { id:"writing", level:"core", number:"05", title:"Escritura, reescritura y transformación", ico:"fileText", color:"#57534e",
    summary:"ChatGPT sobresale en transformación: reescribir para distintas audiencias, cambiar el tono, resumir, reorganizar. A menudo es mejor mejorando texto existente que redactando desde cero.",
    whyItMatters:"La mayoría de la escritura profesional consiste en transformar. Ahí es donde la IA suele dar más retorno.",
    beginnerMoves:["Pega el original. Indica qué se mantiene y qué cambia.","Especifica audiencia, canal y tono.","Pide varias versiones si el tono no está claro."],
    advancedMoves:["Versiones contrastadas: formal, concisa, persuasiva.","Diagnóstico a nivel de frase.","Transferencia de estilo preservando los hechos."],
    commonMistakes:["Redactar desde cero cuando ya existen notas.","Aceptar el primer tono sin comparar alternativas.","No indicar qué debe preservarse."],
    promptExamples:[{prompt:"Reescribe este correo para un profesor: respetuoso, directo, sin relleno.",why:"Transformación precisa."},{prompt:"Dame tres versiones: formal, concisa y persuasiva.",why:"Selección por contraste."},{prompt:"¿Qué frases suenan genéricas y por qué?",why:"Diagnóstico línea por línea."},{prompt:"Mantén los hechos y la estructura. Solo cambia el tono.",why:"Transformación acotada."}],
    beforeAfter:{before:"Mejora este correo.",after:"Reescríbelo para el director del programa. Respetuoso y directo. Elimina la jerga. Máximo 150 palabras. Conserva los puntos de acción.",improvement:"Audiencia, tono, patrones a evitar, longitud y preservación."},
    visual:"writing" },
  { id:"files-data", level:"core", number:"06", title:"Archivos, PDFs, hojas de cálculo y datos", ico:"table2", color:"#0891b2",
    summary:"ChatGPT inspecciona archivos, resume documentos, ejecuta código sobre datos y genera gráficas. La clave: primero describe, luego analiza y después concluye.",
    whyItMatters:"Inspeccionar los datos antes de interpretarlos evita los errores más comunes.",
    beginnerMoves:["Pregunta qué contiene el archivo antes de preguntar qué significa.","Pide primero una auditoría de campos.","En PDFs: separa estructura, argumento y evidencia."],
    advancedMoves:["Exige un rastro de supuestos utilizados.","Haz que repita las tablas extraídas antes de concluir.","Usa ejecución de código para conjuntos de datos grandes."],
    commonMistakes:["Pedir de inmediato 'insights clave'.","Confiar en las etiquetas de una gráfica sin verificarlas.","Asumir que el PDF se analizó perfectamente."],
    promptExamples:[{prompt:"Describe: campos, rango de fechas, valores faltantes y opciones de análisis.",why:"Auditoría antes del análisis."},{prompt:"Extrae el argumento central antes de criticarlo.",why:"Comprensión antes del juicio."},{prompt:"Enumera cada supuesto usado para esta gráfica.",why:"Rastro de auditoría."},{prompt:"Escribe Python para limpiar esto, ejecútalo y muéstrame el resultado.",why:"Análisis reproducible."}],
    beforeAfter:{before:"¿Qué insights clave ves en esta hoja de cálculo?",after:"Haz una auditoría: columnas, tipos, rango de fechas y valores faltantes. Propón tres análisis ordenados por utilidad. No ejecutes nada hasta que yo lo apruebe.",improvement:"Inspección, propuestas y punto de aprobación."},
    visual:"data" },
  { id:"search-research", level:"core", number:"07", title:"Búsqueda, investigación profunda y citas", ico:"search", color:"#4f46e5",
    summary:"Usa búsqueda para respuestas actuales con fuentes. Usa Investigación profunda para informes de varios pasos. Todo lo que sea actual, regulado o cambiante no debería depender de memoria estática.",
    whyItMatters:"Sin búsqueda, ChatGPT responde desde una foto congelada del pasado.",
    beginnerMoves:["Usa búsqueda para cualquier cosa que pueda haber cambiado.","Verifica que las fuentes citadas respalden afirmaciones concretas.","Prefiere fuentes primarias en temas importantes."],
    advancedMoves:["'Separa los hechos confirmados de tus inferencias.'","Especifica tipo de fuentes, región y horizonte temporal.","Usa Investigación profunda con un alcance definido."],
    commonMistakes:["Confiar en el conocimiento del modelo para eventos actuales.","Aceptar afirmaciones 'con fuentes' sin abrirlas.","Usar Investigación profunda para preguntas rápidas de hecho."],
    promptExamples:[{prompt:"Busca. Solo fuentes primarias.",why:"Recuperación en vivo con criterio de calidad."},{prompt:"Separa hechos e inferencias. Etiqueta cada uno.",why:"Estado epistemológico transparente."},{prompt:"¿Qué podría quedar desactualizado en seis meses?",why:"Marca lo sensible al tiempo."},{prompt:"Investigación profunda: [tema]. Alcance: [región, fechas].",why:"Trabajo claramente definido."}],
    beforeAfter:{before:"¿Qué hay de nuevo sobre regulación de IA?",after:"Busca regulación de IA en la UE y EE. UU. de los últimos 30 días. Solo fuentes primarias. Separa lo aprobado de lo propuesto.",improvement:"Alcance, rango temporal, calidad y categorización."},
    visual:"research" },
  { id:"multimodal", level:"core", number:"08", title:"Voz, imágenes y flujos multimodales", ico:"imagePlus", color:"#c026d3",
    summary:"Voz, comprensión de imágenes, generación y edición ya son funciones estándar. La especificidad importa: las peticiones visuales vagas producen resultados genéricos.",
    whyItMatters:"Lo multimodal convierte a ChatGPT en una herramienta de análisis visual, estudio creativo y lluvia de ideas manos libres.",
    beginnerMoves:["Di exactamente qué quieres hacer con una imagen subida.","Usa voz cuando la velocidad importe más que el acabado.","Para generar imágenes: especifica sujeto, encuadre, ambiente y estilo."],
    advancedMoves:["Encadena modos: analiza, explica y luego crea notas.","Usa crítica de imágenes para revisión de diseño.","Edición acotada: selecciona región y describe el cambio."],
    commonMistakes:["Subir imágenes sin instrucciones.","Esperar fotorrealismo con descripciones vagas.","Olvidar que la voz mantiene el mismo contexto que el texto."],
    promptExamples:[{prompt:"Extrae los platillos del menú y organízalos por categoría.",why:"Extracción específica."},{prompt:"Explícale esta gráfica a un ejecutivo no técnico en 120 palabras.",why:"Análisis con restricciones."},{prompt:"Genera: vertical 9:16, cinematográfico, golden hour.",why:"Especificación tipo fotografía."},{prompt:"Cambia el fondo por un estudio blanco. Conserva al sujeto.",why:"Edición acotada."}],
    beforeAfter:{before:"Hazme una imagen padre.",after:"16:9: cafetería moderna en Tokio al atardecer. Fotografía arquitectónica, poca profundidad de campo. Ambiente cálido. Barra de madera, máquina de espresso, luces de ciudad. Sin personas.",improvement:"Proporción, sujeto, estilo, ambiente, elementos y exclusiones."},
    visual:"multimodal" },
  { id:"study-collab", level:"power", number:"09", title:"Estudio, grabación, grupos, enlaces y skills", ico:"layoutGrid", color:"#0d9488",
    summary:"Funciones para aprender, capturar contenido hablado, colaborar, compartir y formalizar flujos de trabajo.",
    whyItMatters:"Aprender no es lo mismo que obtener respuestas. Colaborar no es lo mismo que usar prompts a solas.",
    beginnerMoves:["Usa Modo estudio para aprender, no solo para recibir respuestas.","Usa Grabar para reuniones y clases.","Usa Enlaces compartidos y Chats grupales para colaborar mejor."],
    advancedMoves:["Guarda resúmenes de grabaciones como archivos fuente del proyecto.","Usa Skills para tareas repetidas.","Combina Chats grupales + Proyectos para compartir contexto."],
    commonMistakes:["Usar chat normal para estudiar limita el aprendizaje.","Olvidar que Grabar existe.","Mandar capturas en lugar de Enlaces compartidos."],
    promptExamples:[{prompt:"Hazme preguntas en vez de darme las respuestas.",why:"Enfoque pedagógico."},{prompt:"Convierte esta grabación en puntos de acción y un borrador de seguimiento.",why:"Transformación con múltiples salidas."},{prompt:"Convierte este flujo de trabajo en una Skill.",why:"Formaliza un proceso."}],
    beforeAfter:{before:"Explícame la fotosíntesis.",after:"Estoy estudiando para un examen de biología. No me lo expliques todavía. Hazme preguntas de básico a avanzado para comprobar si realmente lo entiendo, y corrige con explicaciones breves.",improvement:"Pasa de dar respuestas a guiar el aprendizaje."},
    visual:"collab" },
  { id:"personalization", level:"power", number:"10", title:"Memoria, instrucciones, personalidad y chat temporal", ico:"database", color:"#d97706",
    summary:"Memoria guarda contexto. Instrucciones fijan reglas. Personalidad ajusta el estilo. Chat temporal es una sala limpia. No son intercambiables.",
    whyItMatters:"Una personalización mal configurada empeora los resultados más de lo que ayuda.",
    beginnerMoves:["Memoria: preferencias generales y estables.","Instrucciones: reglas globales de escritura.","Chat temporal: cero arrastre de contexto."],
    advancedMoves:["La personalidad añade matiz, no sustituye a las instrucciones.","Prioriza instrucciones específicas del proyecto sobre configuraciones globales.","Haz auditorías periódicas de memoria."],
    commonMistakes:["Guardar todo en Memoria en vez de Instrucciones.","Acumulación de memoria obsoleta.","Usar personalidad para cambiar capacidades y no estilo."],
    promptExamples:[{prompt:"¿Qué recuerdas sobre mí?",why:"Audita la memoria."},{prompt:"Olvida mi preferencia por el tono formal.",why:"Limpieza específica."},{prompt:"Empecemos desde cero. Sin preferencias guardadas.",why:"Modo limpio."}],
    beforeAfter:{before:"Tengo preferencias en memoria pero los resultados siguen siendo inconsistentes.",after:"Pon las reglas de comportamiento en Instrucciones. Los hechos en Memoria. Las reglas de dominio en las instrucciones del proyecto.",improvement:"Separación correcta por capas."},
    visual:"memory" },
  { id:"projects", level:"power", number:"11", title:"Proyectos como tu sistema operativo", ico:"folderOpen", color:"#16a34a",
    summary:"Los Proyectos convierten a ChatGPT en una mesa de trabajo con contexto. Un proyecto bien configurado supera a cualquier interacción en un solo chat.",
    whyItMatters:"Para trabajo de varias sesiones, los proyectos son la herramienta organizativa de mayor impacto.",
    beginnerMoves:["Un proyecto por frente de trabajo. Ponle un nombre claro.","Sube solo archivos relevantes.","Escribe instrucciones para el proyecto."],
    advancedMoves:["Agrega resúmenes de conversaciones como archivos fuente.","Mantén el trabajo semanal en un mismo proyecto, no en chats nuevos.","Crea un metaproyecto para productividad personal."],
    commonMistakes:["Demasiados proyectos demasiado estrechos.","Subirlo todo y saturar el contexto.","No definir instrucciones del proyecto."],
    promptExamples:[{prompt:"Diseña la estructura ideal de proyecto para mi semestre.",why:"Planea primero el espacio de trabajo."},{prompt:"Redacta un memo coherente con mi trabajo anterior.",why:"Aprovecha el contexto acumulado."},{prompt:"Resume las decisiones clave de mis últimas cinco conversaciones.",why:"Resumen vivo."}],
    beforeAfter:{before:"Tengo archivos por todos lados y pierdo el hilo.",after:"Un proyecto por área. Referencias. Instrucciones. Regresa siempre ahí. Haz resúmenes periódicos.",improvement:"Convierte conversaciones dispersas en estructura."},
    visual:"project" },
  { id:"gpts", level:"power", number:"12", title:"Cuándo crear un GPT y cuándo no", ico:"bot", color:"#44403c",
    summary:"Sirve cuando un flujo se repite, tiene instrucciones estables y vale la pena reutilizarlo. Pero la mayoría los crea demasiado pronto.",
    whyItMatters:"Un GPT prematuro congela un flujo todavía inmaduro. Un GPT bien cronometrado convierte un proceso ya probado en una herramienta de un clic.",
    beginnerMoves:["Primero guarda prompts: el prompt es el prototipo.","Formalízalo después de repetirlo tres veces.","Propósito estrecho. Un trabajo."],
    advancedMoves:["Cuatro capas: rol, instrucciones, conocimiento y herramientas.","Reglas explícitas de fallo.","Pruebas adversariales."],
    commonMistakes:["Crear un GPT para algo que solo se hará una vez.","Hacerlo demasiado amplio: 'que haga de todo'.","No incluir archivos de conocimiento."],
    promptExamples:[{prompt:"Convierte nuestro flujo de trabajo en un blueprint para un GPT.",why:"Parte de experiencia real."},{prompt:"Dame instrucciones, esquema de entrada/salida y reglas de fallo.",why:"Especificación completa."},{prompt:"¿Qué casos límite debería manejar este GPT?",why:"Prueba de resiliencia."}],
    beforeAfter:{before:"Quiero un GPT para todo mi correo.",after:"GPT para responderle a profesores. Respetuoso y directo. Menos de 150 palabras. Pide contexto antes de responder. Se niega a actuar sin confirmación. Archivo cargado: guía de estilo.",improvement:"Alcance estrecho, reglas de seguridad y referencias."},
    visual:"gpt" },
  { id:"canvas", level:"power", number:"13", title:"Canvas para revisar texto y código", ico:"panelsTopLeft", color:"#334155",
    summary:"Superficie visible de trabajo junto al chat. Es mejor que una conversación lineal para documentos que requieren cambios precisos.",
    whyItMatters:"Los artefactos largos se degradan en el chat. Canvas pone al documento en el centro.",
    beginnerMoves:["Usa Canvas para piezas largas.","Un archivo por propósito.","Pide ediciones puntuales, no reescrituras vagas."],
    advancedMoves:["Chat para estrategia, canvas para ejecución.","Primero arquitectura, luego diffs acotados.","Usa historial de versiones para comparar."],
    commonMistakes:["Usar chat para documentos largos.","Reescribir todo cuando solo falla un párrafo.","No usar canvas de código para depurar."],
    promptExamples:[{prompt:"Abre un canvas de escritura. Reescribe solo la introducción.",why:"Edición acotada."},{prompt:"Encuentra errores lógicos. Corrige solo esas líneas.",why:"Arreglo de código puntual."},{prompt:"Mueve la sección 3 antes de la 2 y fusiona 4 con 5.",why:"Reorganización estructural."}],
    beforeAfter:{before:"Reescribe mi ensayo. [2000 palabras en el chat]",after:"Ábrelo en canvas. No cambies nada todavía. Marca qué partes son fuertes y cuáles débiles. Luego yo te digo qué editar.",improvement:"Inspección antes de modificar."},
    visual:"canvas" },
  { id:"tasks-apps-agent", level:"expert", number:"14", title:"Tareas, apps, pulse y agente", ico:"workflow", color:"#16a34a",
    summary:"Capa operativa. Tareas corre después. Apps trae datos. Pulse investiga de forma asíncrona. Agente ejecuta trabajo autónomo de varios pasos.",
    whyItMatters:"La mayoría solo usa preguntas y respuestas en tiempo real. Esta capa convierte a ChatGPT en un sistema que trabaja para ti.",
    beginnerMoves:["Tareas: recordatorios, briefs y resúmenes recurrentes.","Apps: cuando la información está en Drive, Slack o correo.","Agente: flujos de varios pasos que a mano tomarían 15 minutos o más."],
    advancedMoves:["Escribe prompts para agente como briefs de trabajo con puntos de pausa.","Usa Pulse para seguir temas de forma proactiva.","Combina Tareas + Proyectos para resúmenes automáticos semanales."],
    commonMistakes:["No saber que Agente existe.","Dar instrucciones vagas al agente sin reglas de detención.","Usar Tareas solo para recordatorios."],
    promptExamples:[{prompt:"Tarea diaria: 8 AM, brief con las 3 noticias principales sobre [tema].",why:"Resumen proactivo."},{prompt:"Haz análisis competitivo usando fuentes conectadas y públicas.",why:"Datos internos y externos."},{prompt:"Agente: sigue estos pasos y pausa antes de enviar nada.",why:"Autonomía con punto de control."}],
    beforeAfter:{before:"Revisa cinco sitios y compara precios.",after:"Agente: visita cinco competidores, extrae precios y arma una tabla comparativa. Pausa si se requiere iniciar sesión. Marca cualquier precio desactualizado.",improvement:"Delegación con alcance y manejo de errores."},
    visual:"agent" },
  { id:"model-choice", level:"expert", number:"15", title:"Elección de modelo y selección de modo", ico:"compass", color:"#65a30d",
    summary:"Distintos modos equilibran velocidad, profundidad de razonamiento y compatibilidad con herramientas. Ajusta la potencia del modelo a la tarea.",
    whyItMatters:"Usar siempre el modo más potente desperdicia tiempo. No escalar cuando hace falta te deja corto.",
    beginnerMoves:["Auto para el trabajo cotidiano.","Escala cuando la lógica o la síntesis sean complejas.","Lo más potente no siempre es lo mejor."],
    advancedMoves:["Usa rápido para borradores y profundo para revisión crítica.","Vigila las limitaciones de herramientas en modos de razonamiento.","Empieza ligero y escala a mitad de la conversación."],
    commonMistakes:["Usar el modo más potente para todo.","Culpar al modelo en lugar del modo.","No revisar el acceso disponible según tu plan."],
    promptExamples:[{prompt:"Primero dame una respuesta rápida y luego una segunda pasada más profunda.",why:"Velocidad primero, profundidad después."},{prompt:"La lógica aquí es compleja. Razona paso a paso.",why:"Pide razonamiento profundo de forma explícita."},{prompt:"¿Para esto conviene rapidez de borrador o razonamiento cuidadoso?",why:"El modelo ayuda a elegir."}],
    beforeAfter:{before:"Siempre usa el modelo más avanzado.",after:"Auto para tareas rápidas. Razonamiento para lógica. Rápido para lluvia de ideas.",improvement:"La potencia se ajusta al tipo de tarea."},
    visual:"models" },
  { id:"privacy-risk", level:"expert", number:"16", title:"Privacidad, control de datos y riesgo", ico:"shield", color:"#e11d48",
    summary:"A más capacidad, más límites hacen falta. Los datos sensibles requieren disciplina al subirlos. Los resultados de alto riesgo necesitan revisión humana.",
    whyItMatters:"La capacidad sin límites puede terminar en exposición de datos o dependencia excesiva.",
    beginnerMoves:["No subas contenido sensible a la ligera.","Elimina identificadores antes de subir archivos.","Usa Chat temporal para el nivel más limpio de privacidad."],
    advancedMoves:["Política tipo semáforo para subidas: rojo, amarillo y verde.","Revisión experta antes de actuar en temas de alto riesgo.","Auditorías periódicas de datos."],
    commonMistakes:["Subir bases completas cuando bastaría con una muestra.","Asumir que Chat temporal significa que nada se procesa.","Usar resultados de IA como decisión final en ámbitos regulados."],
    promptExamples:[{prompt:"¿Qué partes de esto requieren verificación de un experto humano?",why:"Marca limitaciones."},{prompt:"Ayúdame a redactar una versión anonimizada antes de subirlo completo.",why:"Preparación segura."},{prompt:"¿Qué información aquí identifica personalmente a alguien? Quítala.",why:"Detección de PII."}],
    beforeAfter:{before:"Aquí está mi lista completa de clientes, analiza tendencias.",after:"Quita nombres, correos y teléfonos. Anonimiza empresas. Luego analiza ingresos por segmento.",improvement:"Elimina identificadores y conserva el valor analítico."},
    visual:"privacy" },
];

/* ─────────────────────────────────────────────
   VISUALES SVG DE LAS SECCIONES
   ───────────────────────────────────────────── */
function SectionVisual({ type }) {
  const s = "fill-none stroke-current";
  const cls = "h-36 w-full";
  const col = C.greenDeep;
  const tx = (x, y, label, opts = {}) => <text x={x} y={y} textAnchor="middle" fill={col} style={{ fontSize: opts.size || 10, fontWeight: opts.bold ? 600 : 400, opacity: opts.dim ? 0.4 : 1 }}>{label}</text>;
  const V = {
    mental: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}><rect x="24" y="12" width="120" height="44" rx="12" className={s} strokeWidth="2"/><rect x="216" y="12" width="120" height="44" rx="12" className={s} strokeWidth="2"/><rect x="120" y="110" width="120" height="44" rx="12" className={s} strokeWidth="2"/><path d="M144 34h72" className={s} strokeWidth="1.5"/><path d="M84 56l60 54M276 56l-60 54" className={s} strokeWidth="1.5"/>{tx(84,39,"Tu objetivo",{bold:true})}{tx(276,39,"Borrador de IA",{bold:true})}{tx(180,137,"Tu criterio",{bold:true})}{tx(180,84,"revisar, decidir, actuar",{dim:true,size:9})}</svg>,
    layers: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}>{[["40","8","280","24","Chat normal"],["54","38","252","24","Proyectos + Canvas"],["68","68","224","24","Memoria + Instrucciones"],["82","98","196","24","GPTs + Estudio + Skills"],["96","128","168","24","Tareas + Apps + Agente"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(180,Number(y)+16,l,{bold:true,size:9})}</g>)}{tx(336,22,"simple",{dim:true,size:8})}{tx(336,146,"potente",{dim:true,size:8})}</svg>,
    prompt: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}>{[["18","8","Objetivo"],["126","8","Contexto"],["234","8","Reglas"],["18","92","Formato"],["126","92","Calidad"],["234","92","Verificar"]].map(([x,y,l])=><g key={l}><rect x={x} y={y} width="102" height="50" rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+51,Number(y)+30,l,{bold:true,size:11})}</g>)}</svg>,
    workflow: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["30","Marco"],["100","Borrador"],["170","Crítica"],["240","Revisión"],["310","Entrega"]].map(([x,l],i)=><g key={l}><circle cx={x} cy="60" r="22" className={s} strokeWidth="2"/>{tx(Number(x),64,l,{bold:true,size:9})}{i<4&&<path d={`M${Number(x)+22} 60h26`} className={s} strokeWidth="1.5"/>}</g>)}{tx(170,112,"cada pasada añade precisión",{dim:true,size:9})}</svg>,
    writing: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><rect x="134" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><rect x="248" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><path d="M112 59h22M226 59h22" className={s} strokeWidth="1.5"/>{tx(66,38,"Origen",{bold:true})}{tx(180,38,"Transformar",{bold:true})}{tx(294,38,"Resultado",{bold:true})}</svg>,
    data: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="10" width="116" height="96" rx="10" className={s} strokeWidth="2"/><path d="M20 36h116M48 10v96M76 10v96M104 10v96M20 62h116M20 88h116" className={s} strokeWidth="1"/><rect x="186" y="18" width="24" height="70" rx="6" className={s} strokeWidth="2"/><rect x="220" y="40" width="24" height="48" rx="6" className={s} strokeWidth="2"/><rect x="254" y="28" width="24" height="60" rx="6" className={s} strokeWidth="2"/><rect x="288" y="48" width="24" height="40" rx="6" className={s} strokeWidth="2"/><path d="M182 100h136" className={s} strokeWidth="1.5"/>{tx(78,126,"1. Inspeccionar",{dim:true,size:9})}{tx(252,126,"2. Concluir",{dim:true,size:9})}</svg>,
    research: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><circle cx="66" cy="58" r="32" className={s} strokeWidth="2"/><path d="M90 82l22 22" className={s} strokeWidth="2"/><rect x="170" y="10" width="144" height="28" rx="8" className={s} strokeWidth="2"/><rect x="170" y="50" width="144" height="28" rx="8" className={s} strokeWidth="2"/><rect x="170" y="90" width="144" height="28" rx="8" className={s} strokeWidth="2"/>{tx(242,29,"Primaria",{bold:true})}{tx(242,69,"Secundaria",{bold:true})}{tx(242,109,"Inferencia",{bold:true})}<circle cx="326" cy="24" r="4" fill="#10a37f" stroke="none"/><circle cx="326" cy="64" r="4" fill="#F59E0B" stroke="none"/><circle cx="326" cy="104" r="4" fill="#E11D48" stroke="none" opacity="0.5"/></svg>,
    multimodal: <svg viewBox="0 0 360 130" className={cls} style={{ color: col }}>{[["36","Texto"],["120","Imagen"],["204","Voz"],["288","Editar"]].map(([x,l])=><g key={l}><rect x={x} y="20" width="52" height="52" rx="12" className={s} strokeWidth="2"/>{tx(Number(x)+26,50,l,{bold:true,size:9})}</g>)}<path d="M88 46h32M172 46h32M256 46h32" className={s} strokeWidth="1.5"/>{tx(180,102,"encadena los modos",{dim:true,size:9})}</svg>,
    collab: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["18","24","64","42","Grabar"],["100","6","120","42","Estudio"],["100","78","120","42","Grupo"],["238","24","80","42","Compartir"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+26,l,{bold:true,size:10})}</g>)}<path d="M82 45h18M220 27h18M220 99h18" className={s} strokeWidth="1.5"/></svg>,
    memory: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["14","10","74","40","Memoria"],["100","10","120","40","Instrucciones"],["232","10","108","40","Personalidad"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+25,l,{bold:true,size:10})}</g>)}<rect x="60" y="88" width="240" height="40" rx="12" className={s} strokeWidth="2"/>{tx(180,113,"Resultado consistente",{bold:true})}<path d="M51 50l38 38M160 50v38M286 50l-38 38" className={s} strokeWidth="1.5"/></svg>,
    project: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="28" y="4" width="304" height="132" rx="16" className={s} strokeWidth="2"/><rect x="46" y="28" width="72" height="88" rx="8" className={s} strokeWidth="2"/><rect x="130" y="28" width="72" height="88" rx="8" className={s} strokeWidth="2"/><rect x="214" y="28" width="100" height="40" rx="8" className={s} strokeWidth="2"/><rect x="214" y="76" width="100" height="40" rx="8" className={s} strokeWidth="2"/>{tx(82,76,"Chats",{bold:true})}{tx(166,76,"Archivos",{bold:true})}{tx(264,52,"Fuentes",{bold:true,size:9})}{tx(264,100,"Reglas",{bold:true,size:9})}</svg>,
    gpt: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["16","48","78","42","Rol"],["116","4","96","42","Conocimiento"],["116","94","96","42","Herramientas"],["234","48","110","42","Reglas"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+26,l,{bold:true,size:10})}</g>)}<path d="M94 69h22M212 25h22M212 115h22" className={s} strokeWidth="1.5"/><path d="M164 46v48" className={s} strokeWidth="1.5"/></svg>,
    canvas: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="4" width="320" height="132" rx="14" className={s} strokeWidth="2"/><path d="M20 32h320" className={s} strokeWidth="1.5"/><path d="M132 32v104M248 32v104" className={s} strokeWidth="1.2"/>{tx(76,22,"Esquema",{bold:true,size:10})}{tx(190,22,"Borrador",{bold:true,size:10})}{tx(290,22,"Ediciones",{bold:true,size:10})}</svg>,
    agent: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["10","48","60","40","Objetivo"],["90","6","64","40","Navegar"],["90","94","64","40","Archivos"],["174","6","64","40","Apps"],["174","94","64","40","Código"],["258","48","80","40","Listo"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="9" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+24,l,{bold:true,size:9})}</g>)}<path d="M70 68h20M122 46v48M154 26h20M154 114h20M238 26l20 40M238 114l20-40" className={s} strokeWidth="1.5"/></svg>,
    models: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["20","48","72","40","Auto"],["116","4","72","40","Rápido"],["116","96","72","40","Profundo"],["268","48","72","40","Pro"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+25,l,{bold:true,size:10})}</g>)}<path d="M92 68h24M188 24h80M188 116h80" className={s} strokeWidth="1.5"/><path d="M152 44v52" className={s} strokeWidth="1.5"/></svg>,
    privacy: <svg viewBox="0 0 360 150" className={cls} style={{ color: col }}><path d="M180 8l88 32v44c0 34-26 62-88 80-62-18-88-46-88-80V40l88-32z" className={s} strokeWidth="2"/><path d="M150 82l18 18 40-42" className={s} strokeWidth="2.2"/>{tx(180,142,"la capacidad necesita límites",{dim:true,size:9})}</svg>,
  };
  return V[type] || null;
}

/* ─────────────────────────────────────────────
   SUBCOMPONENTES
   ───────────────────────────────────────────── */
function FeatureCard({ title, ico, color, description, when }) {
  return (
    <div className="rounded-2xl border bg-white p-5 transition-shadow duration-200 hover:shadow-md" style={{ borderColor: C.border }}>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: color + "14" }}><Ico name={ico} className="h-4 w-4" style={{ color }} /></div>
        <span className="ff-display text-[15px] font-semibold" style={{ color: C.ink }}>{title}</span>
      </div>
      <p className="text-[13px] leading-relaxed" style={{ color: C.inkLight }}>{description}</p>
      {when && <div className="mt-3 rounded-xl px-3 py-2 text-[12px] leading-relaxed" style={{ backgroundColor: C.cream, color: C.inkLight }}><span className="font-semibold" style={{ color: C.greenDeep }}>Cuándo: </span>{when}</div>}
    </div>
  );
}

function MiniFeature({ title, ico, color, description }) {
  return (
    <div className="rounded-2xl border bg-white p-4 transition-shadow hover:shadow-sm" style={{ borderColor: C.border }}>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: color + "14" }}><Ico name={ico} className="h-3.5 w-3.5" style={{ color }} /></div>
        <span className="text-[13px] font-semibold" style={{ color: C.ink }}>{title}</span>
      </div>
      <p className="text-[12px] leading-relaxed" style={{ color: C.inkLight }}>{description}</p>
    </div>
  );
}

function BeforeAfterBlock({ data }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: C.border, backgroundColor: C.cream }}>
      <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Antes vs. después</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-red-400">Débil</div>
          <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{data.before}</div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Fuerte</div>
          <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{data.after}</div>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed" style={{ color: C.greenDeep }}>
        <Ico name="lightbulb" className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span className="font-medium">{data.improvement}</span>
      </div>
    </div>
  );
}

function PromptExample({ prompt, why }) {
  return (
    <div className="rounded-xl border bg-white px-4 py-3" style={{ borderColor: C.borderLight }}>
      <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{prompt}</div>
      <div className="mt-1.5 text-[11px] leading-snug" style={{ color: C.inkMuted }}>{why}</div>
    </div>
  );
}

function GuideSectionCard({ section, isExpanded, onToggle }) {
  return (
    <section id={section.id} className="scroll-mt-28 overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md" style={{ borderColor: C.border }}>
      <button onClick={onToggle} className="flex w-full items-start gap-4 p-5 text-left md:items-center md:p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: section.color }}><Ico name={section.ico} className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>{section.number} &middot; {section.level.charAt(0).toUpperCase() + section.level.slice(1)}</div>
          <h3 className="ff-display text-[17px] font-semibold leading-snug md:text-[19px]" style={{ color: C.ink }}>{section.title}</h3>
          {!isExpanded && <p className="clamp-2 mt-1 text-[13px] leading-relaxed" style={{ color: C.inkLight }}>{section.summary}</p>}
        </div>
        <Ico name="chevronDown" className={`mt-1 h-5 w-5 shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} style={{ color: C.inkMuted }} />
      </button>
      {isExpanded && (
        <div className="border-t px-5 pb-7 pt-6 md:px-6" style={{ borderColor: C.borderLight }}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="text-[14px] leading-[1.8]" style={{ color: C.ink }}>{section.summary}</p>
              <div className="rounded-xl border p-4" style={{ borderColor: C.borderLight, backgroundColor: C.cream }}>
                <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Por qué importa</div>
                <p className="mt-2 text-[13px] leading-[1.75]" style={{ color: C.ink }}>{section.whyItMatters}</p>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.greenDeep }}>Empieza aquí</div>
                <div className="space-y-2.5">{section.beginnerMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.greenMid }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Avanzado</div>
                <div className="space-y-2.5">{section.advancedMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="arrowRight" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.inkMuted }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.roseAccent }}>Errores comunes</div>
                <div className="space-y-2.5">{section.commonMistakes.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="alertTriangle" className="mt-0.5 h-4 w-4 shrink-0 opacity-60" style={{ color: C.roseAccent }} /><span>{m}</span></div>)}</div>
              </div>
              <BeforeAfterBlock data={section.beforeAfter} />
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl border p-4" style={{ borderColor: C.borderLight, backgroundColor: C.cream }}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Modelo visual</div>
                <SectionVisual type={section.visual} />
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Ejemplos de prompt</div>
                <div className="space-y-2.5">{section.promptExamples.map((p, i) => <PromptExample key={i} {...p} />)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────
   PRINCIPAL
   ───────────────────────────────────────────── */
export default function ChatGPTMasterGuide() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [expanded, setExpanded] = useState(new Set(["mental-model"]));
  const toggleSection = useCallback((id) => { setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }, []);
  const expandAll = useCallback(() => setExpanded(new Set(GUIDE_SECTIONS.map(s => s.id))), []);
  const collapseAll = useCallback(() => setExpanded(new Set()), []);

  const filteredSections = useMemo(() => GUIDE_SECTIONS.filter(s => {
    if (level !== "all" && s.level !== level) return false;
    if (!query.trim()) return true;
    return [s.title, s.summary, s.whyItMatters, ...s.beginnerMoves, ...s.advancedMoves, ...s.commonMistakes, ...s.promptExamples.map(p => p.prompt), s.beforeAfter.before, s.beforeAfter.after].join(" ").toLowerCase().includes(query.toLowerCase());
  }), [level, query]);

  const sectionsByLevel = useMemo(() => {
    const g = { foundation: [], core: [], power: [], expert: [] };
    filteredSections.forEach(s => g[s.level]?.push(s));
    return g;
  }, [filteredSections]);
  const levelLabels = { foundation: "Fundamentos", core: "Habilidades clave", power: "Funciones avanzadas", expert: "Experto" };

  return (
    <div className="ff-body min-h-screen" style={{ backgroundColor: C.cream, color: C.ink }}>
      <GlobalStyles />
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">

        {/* ENCABEZADO */}
        <header className="overflow-hidden rounded-3xl border" style={{ borderColor: C.borderLight, background: `linear-gradient(135deg, ${C.greenLight} 0%, ${C.cream} 40%, ${C.creamDark} 100%)` }}>
          <div className="grid gap-6 p-6 md:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-widest" style={{ borderColor: C.borderLight, color: C.greenDeep }}><Ico name="bookOpen" className="h-3.5 w-3.5" /> Referencia práctica</div>
              <h1 className="ff-display text-3xl font-medium leading-tight tracking-tight md:text-[44px] md:leading-tight" style={{ color: C.ink }}>Guía maestra de ChatGPT</h1>
              <p className="mt-4 max-w-lg text-[15px] leading-[1.8]" style={{ color: C.inkLight }}>Qué hace cada herramienta, cuándo conviene usarla y cómo obtener resultados claramente mejores. Escrita primero para usuarios cotidianos, con secciones más profundas para quienes quieran ir más allá.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Ico name="lightbulb" className="h-3 w-3" style={{ color: C.greenMid }} /> Verificado el {VERIFIED_DATE}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Ico name="layers" className="h-3 w-3" style={{ color: C.greenMid }} /> 16 secciones &middot; más de 60 prompts</span>
              </div>
            </div>
            <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: C.borderLight }}>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Lo que ChatGPT hace hoy</div>
              <svg viewBox="0 0 420 190" className="w-full" style={{ color: C.greenDeep }}>
                {[["16","4","120","38","Responder","chat, búsqueda"],["150","4","120","38","Organizar","proyectos, memoria"],["284","4","120","38","Crear","canvas, imágenes"],["16","120","120","38","Aprender","estudio, grabar"],["150","120","120","38","Compartir","grupos, enlaces"],["284","120","120","38","Ejecutar","tareas, agente"]].map(([x,y,w,h,l,sub])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="9" className="fill-none stroke-current" strokeWidth="1.6"/><text x={Number(x)+Number(w)/2} y={Number(y)+18} textAnchor="middle" fill={C.greenDeep} style={{fontSize:10,fontWeight:600}}>{l}</text><text x={Number(x)+Number(w)/2} y={Number(y)+30} textAnchor="middle" fill={C.greenDeep} style={{fontSize:7,opacity:0.4}}>{sub}</text></g>)}
                <text x="210" y="84" textAnchor="middle" fill={C.greenDeep} style={{fontSize:9,fontWeight:600,opacity:0.25}}>la pila completa</text>
                {[[136,23,150,23],[270,23,284,23],[76,42,76,120],[210,42,210,120],[344,42,344,120]].map(([x1,y1,x2,y2],i)=><line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.greenDeep} strokeWidth="1" opacity="0.15"/>)}
              </svg>
            </div>
          </div>
        </header>

        {/* SEIS PRINCIPIOS */}
        <section className="mt-8">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Seis principios</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[{ico:"penTool",t:"Pide con claridad",d:"Objetivo, contexto, restricciones, formato."},{ico:"layoutGrid",t:"Elige la capa correcta",d:"Chat, proyecto, canvas, búsqueda, agente."},{ico:"shield",t:"Verifica cuando importe",d:"Usa búsqueda para lo actual o de alto riesgo."},{ico:"refreshCcw",t:"Revisa, no reinicies",d:"Los buenos resultados salen de una segunda pasada."},{ico:"bot",t:"Convierte lo que funciona en sistema",d:"Proyecto, GPT, tarea o skill."},{ico:"eye",t:"Usa visuales para pensar más rápido",d:"Tablas, diagramas, capturas."}].map(({ico,t,d})=>(
              <div key={t} className="flex gap-3 rounded-2xl border bg-white p-4" style={{borderColor:C.border}}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Ico name={ico} className="h-4 w-4"/></div>
                <div><div className="text-[13px] font-semibold" style={{color:C.ink}}>{t}</div><div className="mt-0.5 text-[12px] leading-relaxed" style={{color:C.inkLight}}>{d}</div></div>
              </div>
            ))}
          </div>
        </section>

        {/* SELECTOR DE HERRAMIENTA */}
        <section className="mt-8 overflow-hidden rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Tabla de decisión</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>¿Qué herramienta deberías usar?</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border" style={{borderColor:C.borderLight}}>
            <table className="min-w-full text-left text-[13px]">
              <thead><tr style={{backgroundColor:C.cream}}><th className="whitespace-nowrap px-4 py-3 font-semibold" style={{color:C.ink}}>Tu objetivo</th><th className="whitespace-nowrap px-4 py-3 font-semibold" style={{color:C.ink}}>Mejor herramienta</th><th className="hidden whitespace-nowrap px-4 py-3 font-semibold sm:table-cell" style={{color:C.ink}}>Por qué</th></tr></thead>
              <tbody>{TOOL_CHOOSER.map((r,i)=><tr key={r.goal} style={{backgroundColor:i%2===0?"#fff":C.cream}}><td className="px-4 py-3 font-medium" style={{color:C.ink}}>{r.goal}</td><td className="whitespace-nowrap px-4 py-3"><span className="inline-flex items-center gap-1.5 font-semibold" style={{color:C.greenDeep}}><Ico name={r.ico} className="h-3.5 w-3.5"/>{r.tool}</span></td><td className="hidden px-4 py-3 sm:table-cell" style={{color:C.inkLight}}>{r.reason}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        {/* FÓRMULA DE PROMPT */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Patrón de prompt</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>Seis bloques que mejoran cualquier prompt</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROMPT_BLOCKS.map((b,i)=><div key={b.label} className="rounded-xl border p-4" style={{borderColor:C.borderLight,backgroundColor:C.cream}}>
              <div className="mb-1.5 flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold text-white" style={{backgroundColor:b.color}}>{i+1}</span><span className="text-[13px] font-semibold" style={{color:C.ink}}>{b.label}</span></div>
              <p className="ff-mono text-[11px] leading-relaxed" style={{color:C.inkLight}}>{b.example}</p>
            </div>)}
          </div>
        </section>

        {/* FUNCIONES PRINCIPALES */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Conjunto principal</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>Las herramientas principales de ChatGPT</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{CORE_FEATURES.map(f=><FeatureCard key={f.title} {...f}/>)}</div>
        </section>

        {/* ADICIONALES */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Suelen pasarse por alto</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>Funciones que la mayoría de usuarios no aprovecha</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{ADDITIONAL_FEATURES.map(f=><MiniFeature key={f.title} {...f}/>)}</div>
        </section>

        {/* NAVEGADOR */}
        <section className="sticky top-0 z-20 mt-8 rounded-2xl border bg-white p-4 shadow-lg md:p-5" style={{borderColor:C.border}}>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative mr-auto">
              <Ico name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{color:C.inkMuted}}/>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar..." className="w-full rounded-xl border py-2 pl-10 pr-3 text-[13px] outline-none sm:w-48" style={{borderColor:C.border,backgroundColor:C.cream}}/>
            </div>
            {LEVELS.map(l=><button key={l.key} onClick={()=>setLevel(l.key)} className="rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all" style={level===l.key?{backgroundColor:C.greenDeep,color:"#fff"}:{border:`1px solid ${C.border}`,color:C.inkLight}}>{l.label}</button>)}
            <button onClick={expandAll} className="rounded-lg border px-2.5 py-2 text-[11px] font-medium" style={{borderColor:C.border,color:C.inkLight}}>Expandir</button>
            <button onClick={collapseAll} className="rounded-lg border px-2.5 py-2 text-[11px] font-medium" style={{borderColor:C.border,color:C.inkLight}}>Contraer</button>
          </div>
        </section>

        {/* SECCIONES DE LA GUÍA */}
        <main className="mt-8 space-y-10">
          {Object.entries(sectionsByLevel).map(([lev, sections]) => {
            if (!sections.length) return null;
            return (<div key={lev}>
              <div className="mb-4 flex items-center gap-3"><div className="h-px flex-1" style={{backgroundColor:C.border}}/><span className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>{levelLabels[lev]}</span><div className="h-px flex-1" style={{backgroundColor:C.border}}/></div>
              <div className="space-y-4">{sections.map(s=><GuideSectionCard key={s.id} section={s} isExpanded={expanded.has(s.id)} onToggle={()=>toggleSection(s.id)}/>)}</div>
            </div>);
          })}
        </main>

        {/* ALCANCE + CONCLUSIÓN */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{borderColor:C.border}}>
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Alcance</div>
            <h3 className="ff-display mt-2 text-[18px] font-medium" style={{color:C.ink}}>Qué cubre esta guía</h3>
            <div className="mt-4 space-y-2 text-[13px] leading-relaxed" style={{color:C.inkLight}}>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>Funciones para usuarios, no administración empresarial.</div>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>Uso práctico por encima de trivia del producto.</div>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>La disponibilidad varía según el plan y la plataforma.</div>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-200 p-5 shadow-sm" style={{background:`linear-gradient(135deg, ${C.greenLight}, #F0FAF5)`}}>
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.greenDeep}}>La mejora más grande</div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Ico name="sparkles" className="h-5 w-5"/></div>
              <div>
                <div className="ff-display text-[16px] font-semibold" style={{color:C.greenDeep}}>Deja de preguntar "¿cómo hago mejores prompts?"</div>
                <p className="mt-2 text-[13px] leading-[1.75] opacity-80" style={{color:C.greenDeep}}>Empieza a preguntar "¿qué capa de ChatGPT corresponde a este trabajo?" Ese cambio mejora más los resultados que cualquier truco de prompt.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PIE DE PÁGINA */}
        <footer className="mt-8 overflow-hidden rounded-3xl p-6 text-white shadow-lg md:p-10" style={{background:"linear-gradient(135deg, #0A2A1F, #0D3B2E 40%, #143D30)"}}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-300">Conclusión final</div>
              <h2 className="ff-display mt-2 text-2xl font-medium tracking-tight md:text-[28px]">Qué significa dominarlo</h2>
              <p className="mt-4 max-w-xl text-[14px] leading-[1.85] text-emerald-100" style={{opacity:0.8}}>Elige el modo correcto. Define bien el trabajo. Verifica lo que importa. Revisa con criterio. Convierte los aciertos en sistemas reutilizables. Los mejores usuarios son personas que piensan con claridad y además usan IA.</p>
              <p style={{ fontSize: 13, lineHeight: 1.7 }}>
              <br />
              Guía de uso de ChatGPT
              <br />
              © 2026 EugeneYip.com Todos los derechos reservados. 
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-[13px] font-semibold">Sigue revisando</div>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] leading-relaxed text-emerald-200" style={{opacity:0.7}}>
                {["Capacidades","Precios","Notas de lanzamiento","Proyectos","Preguntas frecuentes de Memoria","Canvas","Tareas","Apps","Búsqueda","Investigación profunda","Modo estudio","Grabar","Enlaces compartidos","Grupos","Skills","Agente","Voz","Preguntas frecuentes de Imágenes"].map(i=><div key={i} className="flex items-center gap-1.5"><div className="h-1 w-1 shrink-0 rounded-full bg-emerald-400" style={{opacity:0.5}}/>{i}</div>)}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
