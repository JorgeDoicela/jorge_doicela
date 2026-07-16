# Proyectos de Software (software.jorgedoicela.com)

Este documento detalla la arquitectura, el funcionamiento y el modelo de datos de la Galería de Proyectos de Software, accesible mediante el subdominio `software.jorgedoicela.com`.

---

## 1. Descripción General
La aplicación de Software actúa como el portafolio y catálogo técnico de proyectos y herramientas desarrolladas por Jorge Doicela. Está diseñada con una interfaz avanzada de alta fidelidad estética (utilizando bordes esmerilados y paneles satinados cóncavos/convexos) para exhibir de forma clara las tecnologías empleadas, la descripción técnica de los proyectos y enlaces de acceso.

---

## 2. Frontend (Next.js)

El frontend está desarrollado bajo el grupo de rutas `(software)`.

### 2.1 Secciones e Interfaz
* **Header Satinado Convexo**: Encabezado principal que introduce la galería de proyectos, integrando un conmutador de tema claro/oscuro y un chip de titanio grabado de forma cóncava que resalta el carácter modular de la aplicación.
* **Malla de Proyectos (`ProjectGrid`)**: Renderiza los proyectos mediante tarjetas que destacan su stack técnico y proporcionan accesos directos al código fuente y al despliegue en producción.
* **Manejo de Datos (`useProjects`)**: Hook personalizado [useProjects.ts](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(software)/features/projects/hooks/useProjects.ts) que gestiona la llamada asíncrona hacia el backend, el almacenamiento de la respuesta y el control de errores o pantallas de carga en la malla de proyectos.

---

## 3. Backend y Modelo de Datos (NestJS)

La lógica del servidor reside en el directorio [backend/src/software/](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/src/software). Opera conectado a la base de datos local `software.sqlite` de forma desacoplada utilizando la conexión de TypeORM denominada `'softwareConnection'`.

### 3.1 Entidad `Project` (Persistencia)
Define la estructura de almacenamiento de cada proyecto en el motor relacional SQLite:
* `id`: Clave primaria autoincremental de tipo entero.
* `name`: Nombre descriptivo del proyecto de software (ej: "Sistema Diitra").
* `description`: Texto extenso con la descripción técnica y propósito del software.
* `techStack`: Cadena de texto que lista las tecnologías clave separadas por comas o delimitadores.
* `repoUrl`: Dirección URL opcional que apunta al repositorio público en GitHub.
* `liveUrl`: Dirección URL opcional que permite interactuar con la aplicación desplegada en producción.

---

## 4. Endpoints del Backend

Las llamadas REST están expuestas bajo el prefijo `/software/*`:

### 4.1 Proyectos (`/software/projects`)
* `GET /software/projects`: Retorna la lista completa de proyectos del catálogo.
* `GET /software/projects/:id`: Retorna la información de un único proyecto según su ID numérico.
* `POST /software/projects`: Agrega un nuevo proyecto de software al catálogo (validado en el cuerpo mediante `CreateProjectDto`).
* `PATCH /software/projects/:id`: Permite actualizar campos específicos de un proyecto existente (validado mediante `UpdateProjectDto`).
* `DELETE /software/projects/:id`: Elimina permanentemente un proyecto de la base de datos SQLite.
