# Landing Page (jorgedoicela.com)

Este documento detalla la estructura, funcionamiento y diseño de la página de aterrizaje (Landing Page) principal del monorepo, accesible a través del dominio principal `jorgedoicela.com`.

---

## 1. Descripción General
La Landing Page sirve como el portal de bienvenida central y tarjeta de presentación de Jorge Doicela. Está diseñada para ofrecer una primera impresión de alta fidelidad, con una estética visual moderna que utiliza efectos de cristal (glassmorphism) y un diseño minimalista. 

Su función principal es centralizar y redirigir a los visitantes hacia los diferentes proyectos del ecosistema: la **Biblia**, el **Software** y el **Portafolio**. También expone los canales directos de contacto (correo, GitHub y TikTok).

---

## 2. Aislamiento e Infraestructura
* **Solo Frontend**: A diferencia de los otros proyectos del ecosistema, la Landing Page es **100% del lado del cliente** en Next.js. No tiene base de datos ni endpoints dedicados en el backend de NestJS.
* **Aislamiento de Estilos**: Cuenta con su propio archivo independiente [globals.css](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(landing)/globals.css) para evitar cualquier tipo de contaminación de clases CSS con los demás subproyectos.
* **Enrutamiento del Host**: El enrutador [middleware.ts](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/middleware.ts) asume que cualquier petición al dominio principal sin subdominio se sirve desde el grupo de rutas `(landing)`.

---

## 3. Características y Funcionalidades Clave

### 3.1 Resolutor de Enlaces en Desarrollo y Producción
Para facilitar el flujo de desarrollo local sin romper los enlaces absolutos de producción, el componente principal resuelve dinámicamente el host de la petición en el ciclo de vida de React (`useEffect`):
* **Local**: Si detecta `localhost`, `127.0.0.1` o IPs locales, los enlaces se mapean hacia `http://*.localhost:3001` (manteniendo el puerto de desarrollo de Next.js).
* **Producción**: En el VPS, los enlaces apuntan directamente a los subdominios de producción con SSL (`https://*.jorgedoicela.com`).

### 3.2 Widget de Reloj Local y Saludo Dinámico
* **Hora Local (Quito, Ecuador)**: Para reflejar el huso horario local (UTC-5), el reloj de la cabecera se formatea explícitamente usando la zona horaria `'America/Guayaquil'`. Esto garantiza que, sin importar la zona horaria del navegador del visitante, siempre se muestre la hora local en Quito.
* **Saludo Dinámico**: Un script calcula la hora en Quito y adapta el mensaje de bienvenida de la siguiente forma:
  * De 6:00 a 11:59 $\rightarrow$ *Buenos días*
  * De 12:00 a 18:59 $\rightarrow$ *Buenas tardes*
  * De 19:00 a 5:59 $\rightarrow$ *Buenas noches*

### 3.3 Soporte de Tema Claro / Oscuro (Light & Dark Mode)
* El usuario puede alternar entre temas mediante un botón en la cabecera.
* Se guarda la preferencia del usuario en el almacenamiento local (`localStorage`) bajo la clave `'landing-theme'`.
* El cambio se aplica dinámicamente alternando la clase `.light` en el elemento raíz de la página (`document.documentElement`).

---

## 4. Estructura de Directorios

El código del proyecto se encuentra encapsulado en:
* [(landing)/page.tsx](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(landing)/page.tsx): Contiene la estructura completa de la interfaz en React, incluyendo las tarjetas de redirección e integraciones de iconos.
* [(landing)/layout.tsx](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(landing)/layout.tsx): Define el contenedor global e importa los estilos locales de la Landing.
* [(landing)/globals.css](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(landing)/globals.css): Configura los tokens visuales, fuentes de Google (Inter y Outfit) y las reglas de Tailwind CSS v4 para la Landing.

---

## 5. Diseño y Estética
* **Static Glass Cards**: Paneles de fondo semi-transparentes con desenfoque de fondo y bordes ultra-delgados para simular cristal templado.
* **Interactive Glass Cards**: Tarjetas interactivas con sutiles micro-animaciones al posicionar el cursor (`hover`), tales como pequeñas traslaciones vectoriales en los iconos de flecha y efectos de iluminación en los bordes.
* **Fondo Dinámico Sutil**: Integración de dos elipses degradadas con difuminados de alta densidad en el fondo (`blur-[130px]`) que otorgan profundidad a la página sin sobrecargar la renderización de la GPU.
