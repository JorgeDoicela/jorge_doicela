# Roadmap y Funcionalidades: Biblia Modular

Catálogo exhaustivo de requerimientos, módulos completados y objetivos futuros para la **Biblia Modular** (`bible.jorgedoicela.com` y app móvil).

---

## 1. Módulos de Lectura y Exégesis
- [x] **Vista Paralela Multi-Columna:** Comparador de 2 a 4 traducciones con desplazamiento sincronizado.
- [x] **Comparador de Variantes Textuales:** Algoritmo LCS para resaltar divergencias entre traducciones.
- [x] **Interlineal Inverso Morfológico:** Texto Masorético Hebreo/Arameo y NA28 Griego con códigos Strong y hover bidireccional.
- [x] **Léxicos Integrados:** Diccionarios BDB, Gesenius, Thayer y concordancia exhaustiva de James Strong.
- [x] **Atlas Bíblico WGS84:** Rutas del Éxodo, viajes apostólicos e itinerarios bíblicos.
- [x] **Línea de Tiempo Sincrónica:** Reyes de Israel/Judá vs profetas e imperios contemporáneos.
- [x] **Evidencias & Arqueología:** Catálogo de artefactos, manuscritos del Mar Muerto y epigrafía.
- [x] **Evangelización y Apologética:** Rutas soteriológicas canónicas, banco de objeciones y tratados homiléticos.
- [ ] **Red de Referencias Cruzadas:** Integración de las referencias del *Treasury of Scripture Knowledge (TSK)*.
- [ ] **Comentarios Clásicos Versículo por Versículo:** Matthew Henry, Jamieson-Fausset-Brown, John Gill.

---

## 2. Herramientas de Estudio y Anotación
- [ ] **Sistema de Resaltado Semántico:** Colores categorizados por doctrina (promesas, mandamientos, juicio, cristología).
- [ ] **Editor de Notas Exegéticas:** Cuaderno de notas anclado a pasajes con exportación a PDF y Markdown.
- [ ] **Constructor de Sermones (Homiletics Suite):** Asistente para preparar bosquejos y modo púlpito sin distracciones.
- [ ] **Asistente de IA Hermenéutica:** Explicación contextual de trasfondo histórico y modismos semíticos.

---

---

## 4. Internacionalización y SEO (next-intl)
- [x] **Metadatos SEO Dinámicos (`generateMetadata`):** Título, descripción y Open Graph en español e inglés.
- [x] **Indexación Internacional (`hreflang`):** Etiquetas `es-EC` y `en-US` configuradas en `layout.tsx`.
- [x] **Cero Parpadeos (SSR):** Integración con `NextIntlClientProvider` y `messages/*.json`.

