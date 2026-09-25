# Portafolio Digital

Proyecto web frontend para portafolio profesional, diseñado con enfoque estricto en accesibilidad (A11y), rendimiento, optimización SEO y separación limpia de responsabilidades.

## Estructura del Proyecto

```text
portafolio_8vo/
├── index.html        # Estructura semántica, metadatos SEO/OpenGraph y accesibilidad ARIA
├── main.css          # Fichas de diseño (:root variables, paletas, tipografías, tokens)
├── styles.css        # Reset, layout (Grid/Flexbox), estilos de componentes y media queries
├── app.js            # Lógica cliente (DOM safe execution, A11y, animaciones, sanitización)
├── README.md         # Documentación técnica del proyecto
└── .gitignore        # Exclusiones de control de versiones
```

## Pilares de Arquitectura

1. **Semántica HTML y A11y (WCAG 2.2 AA)**:
   - Uso de tags semánticos (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`).
   - Landmark roles ARIA (`banner`, `main`, `contentinfo`).
   - Enlace de salto (`.skip-link`).
   - Estados dinámicos gestionados (`aria-expanded`, `aria-controls`, `aria-hidden`).
   - Formularios 100% accesibles con labels explícitos y atributos requeridos.

2. **SEO y Metadatos**:
   - Meta tags exhaustivos (description, keywords, author, robots).
   - Protocolo Open Graph y Twitter Cards.
   - Enlace canónico (`canonical`).
   - Datos estructurados con JSON-LD (Schema.org).

3. **Arquitectura CSS Modular**:
   - `main.css`: Definición centralizada de tokens de diseño en `:root` (colores, espaciados, tipografías, transiciones, sombras).
   - `styles.css`: Reset universal, layouts bidimensionales (CSS Grid) y unidimensionales (Flexbox), media queries (992px, 768px, 480px).

4. **JavaScript Seguro y Eficiente**:
   - Encapsulado bajo `DOMContentLoaded`.
   - Renderizado eficiente con `requestAnimationFrame`.
   - Respeto por preferencias de usuario (`prefers-reduced-motion`).
   - Sanitización contra XSS en manipulación de texto dinámico.
