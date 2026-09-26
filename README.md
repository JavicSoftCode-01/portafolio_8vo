# Eduardo Javier Quinteros Pacheco (JSC / JAVICSOFTCODE) — Portfolio & Design System

Plataforma web profesional para exhibición de proyectos de desarrollo backend, arquitecturas de APIs y soluciones full-stack. Integra directrices de accesibilidad WCAG 2.2 AA, rendimiento optimizado y sistema de tokens centralizado.

## Arquitectura de Archivos

```text
portafolio_8vo/
├── index.html        # Marcado semántico, landmarks ARIA y metadatos estructurados
├── main.css          # Design tokens centralizados en :root (colores, fuentes, escalas)
├── styles.css        # Reset, retículas, layouts adaptativos y estilos de componentes
├── app.js            # Controladores interactivos, filtrado, accesibilidad y estado de tema
├── README.md         # Especificación técnica del sistema
└── .gitignore        # Exclusiones de control de versiones
```

## Especificación del Sistema de Diseño

### 1. Sistema Cromático
- **Primary**: Indigo/Violet (`#6366F1`, `#4F46E5`, `#818CF8`, `#C0C1FF`) — Jerarquía principal y acciones dominantes.
- **Secondary**: Cyan / Teal (`#06B6D4`, `#4CD7F6`) — Énfasis complementario y telemetría visual.
- **Support / Semantic**: Emerald (`#10B981`) para disponibilidad/éxito, Amber (`#F59E0B`) para estados transitorios, Coral (`#FFB4AB`) para errores.
- **Surfaces & Elevations**: Escala tonal profunda (`#0A0E17`, `#0F131C`, `#181B25`, `#1C1F29`, `#262A34`, `#31353F`).
- **Contraste mínimo**: 14.5:1 en textos primarios sobre fondo base, superando WCAG 2.2 nivel AAA.

### 2. Tipografía y Escalas
- **Titulares**: Plus Jakarta Sans (600, 700, 800) — Tracking óptico ajustado (-0.03em a -0.015em).
- **Cuerpo de texto**: Inter (400, 500, 600) — Lecturabilidad prolongada y espaciado proporcional.
- **Datos técnicos y código**: JetBrains Mono (400, 500, 600) — Tablas, tags y microdatos.

### 3. Escala Geométrica y Retícula
- **Escala de Espaciado**: Múltiplos basados en sistema geométrico de 8px (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px).
- **Retícula**: Retícula fluida de 12 columnas en desktop, 8 columnas en tablet y 4 columnas en mobile con márgenes de seguridad de 2rem y gutters de 1.5rem.
- **Ancho máximo de contenedor**: 1200px para contenido estructurado, 680px para columnas de lectura técnica.

## Módulos y Componentes

- **Cabecera y Navegación**: Barra fija con desenfoque de fondo (`backdrop-filter: blur`), skip link para lectores de pantalla, enlaces de sección y conmutador de tema.
- **Hero**: Presentación profesional con indicador de disponibilidad pulsante, propuesta de valor técnica, acciones directas y módulo visual con credenciales.
- **Perfil & Métricas**: Narrativa profesional, micro-retícula de métricas clave (rendimiento, tokens, CLS) y panel bento de datos de contacto y especialidad.
- **Matriz de Competencias**: Desglose por áreas (Frontend Architecture, UI/UX & Design Systems, Backend & Tooling) con barras de progreso accesibles y chips tecnológicos.
- **Galería de Proyectos**: Tarjetas asimétricas con visualización en alta definición, metadata contextual, tags técnicos, enlaces a código/demo y filtrado dinámico en cliente.
- **Sistema de Diseño (Vistas/Sección)**: Muestrarios en vivo de tokens de color con función de copiado al portapapeles, espécimen tipográfico, escala de espaciado y biblioteca de componentes atómicos.
- **Formulario de Contacto**: Interfaz con etiquetas explícitas, validación de campos obligatorios, selector de asunto de proyecto, prevención de inyecciones y retroalimentación de estado.
- **Pie de Página**: Enlaces a perfiles profesionales (GitHub, LinkedIn, Twitter/X, Dribbble), estado de disponibilidad y aviso de derechos.
