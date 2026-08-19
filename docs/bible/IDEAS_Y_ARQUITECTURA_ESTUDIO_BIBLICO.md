# 📖 Ecosistema de Estudio Bíblico Profesional: Visión, Módulos y Arquitectura
**Subdominio:** `bible.jorgedoicela.com` (`bible.localhost:3001`)  
**Ecosistema:** Web (Next.js 16) + Móvil (React Native / Expo) + Backend (NestJS 11 + SQLite FTS5)  
**Objetivo:** Brindar una plataforma de estudio bíblico rigurosa, profunda, rápida y accesible para creyentes, pastores, teólogos y estudiantes de todo el mundo.

---

## 1. 🏛️ Módulos de Lectura y Exégesis del Texto Sagrado

### 1.1 Lectura Multi-Versión y Vista Paralela
- [x] **Vista en Múltiples Columnas:** Comparación simultánea de 2 a 4 traducciones en paralelo (ej. *Reina Valera 1960*, *NVI*, *LBLA*, *Biblia de Jerusalén*, *KJV*, *Septuaginta LXX*).
- [x] **Alineación Sincronizada:** Desplazamiento inteligente (scroll sync) y alineación que mantiene los mismos versículos alineados horizontalmente entre todas las columnas abiertas.
- [x] **Comparador de Variantes Textuales:** Resaltado diferencial de texto que muestra qué palabras cambian entre versiones (diferencias de traducción formal vs. equivalencia dinámica vs. variantes de manuscritos).

### 1.2 Modo Interlineal Morfológico Original (Hebreo, Arameo y Griego)
- [x] **Texto Masorético (Hebreo y Arameo - BHS / WLC):**
  - [x] Texto vocalizado con signos masoréticos y cantilación.
  - [x] Porciones en Arameo identificadas y analizadas morfológicamente (Génesis 31:47, Jeremías 10:11, Esdras 4:8–6:18, 7:12–26, Daniel 2:4b–7:28).
- [x] **Nuevo Testamento Griego (NA28 / Textus Receptus / SBLGNT):**
  - [x] Desglose morfológico palabra por palabra (Lema, Categoría gramatical, Caso, Género, Número, Tiempo, Voz, Modo).
- [x] **Interlineal Inverso e Interactivo:**
  - [x] Al hacer hover o tap en cualquier palabra en español, se ilumina la palabra original correspondiente y viceversa.
  - [x] Código Strong con enlace directo a definiciones ampliadas, transliteración fonética y reproducción de audio con pronunciación bíblica auténtica.


### 1.3 Análisis de Estructuras Literarias y Poéticas
- [x] **Visualizador de Quiasmos y Paralelismos:** Identificación visual de patrones poéticos semíticos (paralelismos sinónimos, antitéticos, sintéticos, escalonados) en Salmos, Proverbios y Profetas.
- [x] **Marcadores de Discurso y Cláusulas:** Identificación de proposiciones principales, subordinadas, conjunciones causales, condicionales y de propósito en las Epístolas Paulinas.


---

## 2. 🔍 Motor Lingüístico y Léxico Profundo

### 2.1 Diccionarios y Léxicos Integrados (Offline & Online)
- [x] **Léxicos Hebreo/Arameo:**
  - [x] *Brown-Driver-Briggs (BDB)* completo indexado por raíz triconsonántica.
  - [x] *Gesenius' Hebrew and Chaldee Lexicon*.
  - [x] Diccionario de Teología del Antiguo Testamento.
- [x] **Léxicos Griegos:**
  - [x] *Thayer's Greek-English Lexicon*.
  - [x] *Liddell-Scott-Jones (LSJ)* condensado.
  - [x] *Robertson's Word Pictures in the New Testament* (análisis gramatical e histórico de palabras clave).
  - [x] *Vincent's Word Studies*.


### 2.2 Búsqueda Morfológica Avanzada (Grammar Search Engine)
- [x] Filtro avanzado por atributos gramaticales (ej. *"Buscar todos los verbos en Imperativo Presente Activo en Romanos y Gálatas"*).
- [x] Búsqueda por Raíz / Lema con análisis de frecuencia y gráfico de dispersión en el canon bíblico.
- [x] Concordancia Exhaustiva instantánea mediante SQLite FTS5 (búsqueda instantánea con comodines, frases exactas y operadores booleanos `AND`, `OR`, `NOT`, `NEAR`).

---

## 3. 🗺️ Geografía, Arqueología y Cronología Interactiva

### 3.1 Atlas Bíblico Georreferenciado
- [x] **Mapas Vectoriales Interactivos:** Visualización de rutas, ciudades, montes, ríos y valles de la antigüedad superpuestos sobre topografía moderna y satelital.
- [x] **Rutas Históricas Trazadas:**
  - [x] La Ruta del Éxodo y las estaciones en el desierto.
  - [x] Los viajes misioneros del Apóstol Pablo (1º, 2º, 3º viaje y viaje a Roma).
  - [x] Las campañas militares de Josué y los jueces.
  - [x] El ministerio galileo y de Judea de Jesús de Nazaret.
- [x] **Visualizador 3D / Reconstrucciones Arqueológicas:** Recreación esquemática del Tabernáculo en el Desierto, Templo de Salomón, Templo de Herodes y Jerusalén en el siglo I.

### 3.2 Línea de Tiempo Cronológica Dinámica
- [x] Cronología sincrónica que ubica a los Reyes de Israel y Judá en paralelo con los profetas bíblicos y los imperios contemporáneos (Egipto, Asiria, Babilonia, Medo-Persia, Grecia, Roma).
- [x] Eventos fechados según consensos arqueológicos e históricos con referencias bíblicas asociadas.

### 3.3 Sección de Noticias y Actualidad Arqueológica Bíblica
- [x] Feed de noticias y artículos sobre hallazgos arqueológicos recientes en Tierra Santa (Israel, Cisjordania, Jordania, Egipto, Turquía, Grecia e Italia).
- [x] Reseñas académicas sobre manuscritos del Mar Muerto (Qumrán), inscripciones epigráficas y sellos (bullae).
- [x] Artículos de apologética histórica y confiabilidad de los textos sagrados.

---

## 4. 📚 Biblioteca de Comentarios, Referencias Cruzadas y Teología

### 4.1 Red de Referencias Cruzadas (Visual Cross-References Graph)
- [ ] Integración de la base de datos *Treasury of Scripture Knowledge (TSK)* con más de **340,000 referencias cruzadas**.
- [ ] Visualización en grafo interactivo que muestra las ramificaciones y conexiones proféticas, tipológicas y doctrinales entre el Antiguo y Nuevo Testamento.

### 4.2 Comentarios Clásicos y Exegéticos
- [ ] Acceso directo en panel lateral colapsable a comentarios versículo por versículo:
  - [ ] Matthew Henry (Comentario Bíblico Completo).
  - [ ] Jamieson, Fausset & Brown.
  - [ ] John Gill's Exposition of the Bible.
  - [ ] Notas de Estudio de Ginebra (1599).
  - [ ] Comentario del Texto Griego por A.T. Robertson.

---

## 5. ✍️ Herramientas de Anotación, Estudio y Homilética

### 5.1 Sistema de Resaltado y Marcado Semántico
- [ ] Paleta de resaltadores con significado semántico predeterminado y personalizable:
  - [ ] 🟢 Mandamientos / Exhortaciones.
  - [ ] 🟡 Promesas divinas.
  - [ ] 🔴 Advertencias / Juicio.
  - [ ] 🟣 Atributos de Dios / Cristología.
  - [ ] 🔵 Profecías mesiánicas / Escatología.
- [ ] Filtro para ver únicamente los versículos resaltados por categoría en un panel de resumen.

### 5.2 Cuaderno de Estudio y Notas Exegéticas
- [ ] Editor de texto enriquecido (Markdown + WYSIWYG) anclado a versículos, capítulos o tópicos.
- [ ] Creación de cadenas temáticas (Chain Notes) que conectan pasajes en una secuencia de estudio.
- [ ] Exportación de notas y estudios a PDF, Markdown, Word o formato de presentación para sermones.

### 5.3 Constructor de Bosquejos y Sermones (Homiletics Suite)
- [ ] Asistente estructurado para preparar mensajes bíblicos:
  1. Pasaje central y contexto.
  2. Idea Exegética Principal (IEP).
  3. Idea Homilética Principal (IHP).
  4. Puntos principales con referencias y aplicaciones contemporáneas.
- [ ] Modo Púlpito / Presentador: Pantalla limpia con tipografía de alto contraste, cronómetro integrado y control de tamaño de letra sin distracciones.

---

## 6. 🤖 Asistente de Investigación Contextual e IA Hermenéutica

### 6.1 Tutor Exegético Contextual (AI Hermeneutics Assistant)
- [ ] **Explicación de Contexto Histórico-Cultural:** Respuestas detalladas sobre costumbres de la época, monedas, leyes civiles, vestimentas y trasfondo del autor y destinatarios.
- [ ] **Clarificación de Modismos Idiomáticos:** Detección y explicación de modismos semíticos (ej. *"hijos del trueno"*, *"odiar padre y madre"*, *"ojo bueno / ojo malo"*).
- [ ] **Guarda de Objetividad:** Motor programado para presentar diferentes perspectivas teóricas o históricas reconocidas sin sesgo sectario.

---

## 7. 📱 Estrategia Multiplataforma y Modo Offline

### 7.1 Web (PWA de Alto Rendimiento)
- [ ] Interfaz con tema claro, tema oscuro OLED y tema sepia para lectura prolongada.
- [ ] Caché local en IndexedDB que permite leer capítulos enteros y consultar diccionarios incluso sin conexión a internet.

### 7.2 App Móvil Nativa (React Native / Expo en `frontend/mobile`)
- [ ] Descarga de paquetes bíblicos completos para uso 100% offline en zonas remotas o misiones internacionales.
- [ ] Renderizado ultra optimizado a 60 fps con `FlashList` (Shopify).
- [ ] Versículo del día con notificaciones locales inteligentes y widgets de pantalla de inicio.
- [ ] Sincronización bidireccional cifrada de notas y resaltados entre la web y el móvil al reconectarse.

---

## 8. ⚡ Arquitectura Técnica y Optimización en Servidor (1 GB RAM)

1. **Persistencia Ligera en SQLite (`bible.sqlite`):**
   - [ ] Motor de búsqueda de texto completo con tabla virtual `verses_fts` usando `FTS5` de SQLite (búsquedas en milisegundos con cero consumo de CPU/RAM).
   - [ ] Tablas normalizadas para `lexicon_strong`, `cross_references`, `morphology_greek`, `morphology_hebrew`.
2. **Paginación y Streaming JSON:**
   - [x] Carga fraccionada por capítulo bajo demanda (máximo 50-100 versículos por request) para garantizar tiempos de respuesta < 20ms y menos de 15MB de memoria ocupada por NestJS.
3. **Caché en Memoria Local del Navegador:**
   - [ ] Datos estáticos (libros, morfología, diccionarios) cacheados permanentemente en el cliente mediante React Query / SWR y Service Workers.
