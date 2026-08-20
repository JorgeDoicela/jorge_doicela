# Marco Legal, Fuentes Críticas y Conexión Oficial API.Bible

Este documento define la política legal, el catálogo de fuentes textuales de dominio público y la arquitectura de integración con la API oficial de las Sociedades Bíblicas para la **Biblia Modular** (`bible.jorgedoicela.com`).

---

## 1. Filosofía de Cumplimiento Legal y Derechos de Autor

> [!IMPORTANT]
> **Cero Piratería y Cero Riesgo Legal:**  
> La Biblia Modular opera bajo una arquitectura de **estricto cumplimiento de copyright** y respeto a la propiedad intelectual. Ningún texto bíblico moderno con derechos de autor se almacena ilegalmente ni se extrae mediante scraping.  
> Se implementa una **Estrategia Híbrida Oficial**:
> 1. **Versiones Contemporáneas con Derechos:** Se consumen en vivo mediante **API.Bible** (*American Bible Society* & *Digital Bible Library*).
> 2. **Textos Originales y Motores Exegéticos:** Se basan exclusivamente en **ediciones críticas de Dominio Público Universal** y licencias académicas abiertas.

---

## 2. Radiografía de Versiones y Fuentes Textuales

### 2.1 Versiones Bíblicas Contemporáneas (Conexión Oficial API)

| Versión | Abreviación | Titular de Derechos | Modalidad de Uso | Estado en Plataforma |
|---|---|---|---|---|
| **Nueva Biblia de las Américas** | `NBLA` | The Lockman Foundation | Conexión autorizada vía API.Bible ($0/mo) | ✅ En vivo (Toda la Biblia) |
| **Nueva Traducción Viviente** | `NTV` | Tyndale House Publishers | Conexión autorizada vía API.Bible ($0/mo) | ✅ En vivo (Toda la Biblia) |
| **New International Version** | `NIV` | Bíblica, Inc. / Zondervan | Conexión autorizada vía API.Bible ($0/mo) | ✅ En vivo (Toda la Biblia) |

### 2.2 Textos en Idiomas Originales (Dominio Público Universal)

| Texto Original | Abreviación | Edición Crítica / Manuscrito | Estado Legal | Ubicación / Fuente |
|---|---|---|---|---|
| **Hebreo Masorético (AT)** | `BHS` | **Códice de Leningrado (WLC / BHS, 1008 d.C.)** | **Dominio Público Universal** | *J. Alan Groves Center* / *Open Scriptures* |
| **Griego Nuevo Testamento** | `NA28` | **Texto Crítico Griego (Nestle-Aland 28 / UBS 5 / Nestle 1904)** | **Dominio Público Universal** | *Internet Archive* / SBLGNT |

---

## 3. Fuentes Académicas de los 4 Motores de Estudio

### 3.1 🟡 Motor Interlineal Inverso
* **Antiguo Testamento:** Texto consonántico, vocales masoréticas (*Nikkud*), acentos litúrgicos y cantilación del **Westminster Leningrad Codex (1008 d.C.)**.
* **Nuevo Testamento:** Texto crítico griego de **Eberhard Nestle (1904)** cotejado con Westcott-Hort (1881) y Tischendorf (1869).
* **Morfología y Glosas:** Lematización consonántica y glosas literales de libre distribución (*Open Scriptures Hebrew* y *MorphGNT*).
* **Regla de Fluidez:** Partículas gramaticales intransferibles (ej. marcador de objeto directo hebreo `אֵת` Strong H853) se omiten en la lectura castellana corrida superior para garantizar naturalidad y se muestran con su ficha técnica completa en el desglose masorético inferior.

### 3.2 🟣 Análisis de Palabra y Léxicos
* **Hebreo / Arameo:**
  * *Brown-Driver-Briggs Hebrew and English Lexicon (BDB, 1906)* $\rightarrow$ Dominio Público.
  * *Wilhelm Gesenius Hebrew and Chaldee Lexicon (1857)* $\rightarrow$ Dominio Público.
* **Griego Koiné:**
  * *Joseph Henry Thayer Greek-English Lexicon of the New Testament (1889)* $\rightarrow$ Dominio Público.
  * *Liddell-Scott-Jones Greek-English Lexicon (Edición Clásica)* $\rightarrow$ Dominio Público.
* **Numeración Concordante:** Códigos numéricos universales del *Dr. James Strong (Exhaustive Concordance of the Bible, 1890)* $\rightarrow$ Dominio Público.

### 3.3 🟢 Estructuras Literarias y Quiasmos
* **Análisis Poético Semítico:** Diagramación simétrica objetiva de paralelismos (sinónimos, antitéticos, sintéticos) y macroestructuras quiásticas (Hexamerón de Génesis 1, discurso paulino de Romanos 8).
* **Estado Legal:** Análisis literario estructural de libre divulgación.

### 3.4 🔴 Contexto Histórico, Atlas y Arqueología
* **Atlas Bíblico Georreferenciado:** Coordenadas espaciales WGS84 derivadas de datos satelitales públicos (NASA Earth Data, USGS y OpenStreetMap).
* **Cronología Sincrónica:** Tablas cronológicas de datación del Antiguo Cercano Oriente (reyes de Israel/Judá vs imperios egipcio, asirio, babilónico y persa).
* **Arqueología Bíblica:** Documentación de artefactos y epigrafía de dominio público custodiados en museos estatales (Estela de Tel Dan, Cilindro de Ciro, Inscripción de Siloé, Papiros de Oxirrinco).

---

## 4. Arquitectura de Integración API.Bible en NestJS

### 4.1 Servicio Adaptador (`ApiBibleService`)
El servicio [`backend/src/bible/verses/services/api-bible.service.ts`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/src/bible/verses/services/api-bible.service.ts) gestiona la comunicación autorizada con los servidores de American Bible Society:

```text
Usuario solicita pasaje (ej. Juan 3 en NTV)
       │
       ▼
1. Consulta rápida en SQLite local (bible.sqlite)
       ├── ¿Existe en caché local? ──► SÍ ──► Retorno en 0 ms
       └── NO
            │
            ▼
2. ApiBibleService.fetchChapterVerses(translation, book, chapter)
            │
            ├── Traduce abreviación a código USFM estándar (JUA -> JHN)
            ├── Petición HTTP autenticada con header 'api-key: API_BIBLE_KEY'
            ├── Parseo regex ultrarrápido de versículos por capítulo
            │
            ▼
3. Persistencia automática en bible.sqlite (Caché inteligente)
            │
            ▼
4. Retorno de versículos enriquecidos al Frontend
```

### 4.2 Configuración de Variables de Entorno (`.env`)
En `backend/.env`:
```env
# Clave oficial de API.Bible (American Bible Society / Digital Bible Library)
API_BIBLE_KEY=tu_clave_de_desarrollador_aqui
```

### 4.3 Mapeo Canónico de Libros USFM
El backend traduce automáticamente las abreviaciones canónicas en español a códigos internacionales USFM de 3 letras de la Digital Bible Library:
* `GEN` $\rightarrow$ `GEN`
* `SAL` $\rightarrow$ `PSA`
* `JUA` $\rightarrow$ `JHN`
* `HEC` $\rightarrow$ `ACT`
* `APO` $\rightarrow$ `REV`

---

## 5. Avisos Oficiales de Atribución de Copyright (Frontend UI)

El lector continuo ([`ContinuousReadingView.tsx`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(bible)/features/verses/components/continuous-view/ContinuousReadingView.tsx)) y el hook de versiones ([`useTranslations.ts`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(bible)/features/translations/hooks/useTranslations.ts)) muestran la nota de atribución legal requerida al pie de cada capítulo:

* **Nueva Biblia de las Américas (`NBLA`):**  
  > *«Nueva Biblia de las Américas ® © 2005 por The Lockman Foundation. Conectada vía API autorizada.»*
* **Nueva Traducción Viviente (`NTV`):**  
  > *«Santa Biblia, Nueva Traducción Viviente, © Tyndale House Foundation, 2010. Conectada vía API autorizada.»*
* **New International Version (`NIV`):**  
  > *«Holy Bible, NEW INTERNATIONAL VERSION ® NIV ® © 1973, 1978, 1984, 2011 by Biblica, Inc. ® Conectada vía API autorizada.»*
* **Biblia Hebraica Stuttgartensia (`BHS`):**  
  > *«Texto Masorético WLC. J. Alan Groves Center / Open Scriptures. Licencia Abierta CC BY 4.0.»*
* **Septuaginta Griega (`LXX`):**  
  > *«Septuaginta Griega (LXX - Swete / Rahlfs). Dominio Público Académico.»*
