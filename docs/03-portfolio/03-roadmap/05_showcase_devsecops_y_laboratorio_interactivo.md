# Especificación Maestra: Showcase Técnico DevSecOps y Laboratorio Interactivo en Terminal Linux

Este documento recopila la propuesta y diseño arquitectónico para evolucionar la terminal interactiva del portafolio (`portfolio.jorgedoicela.com`) desde una consola informativa hacia un **Laboratorio de Ingeniería DevSecOps de Nivel Enterprise**.

El objetivo es proyectar ante Directores de Tecnología (CTO), Tech Leads y Principal Engineers un dominio riguroso de **seguridad en el kernel de Linux, hardening de contenedores, observabilidad de bajo nivel (cgroups v2), Site Reliability Engineering (Chaos Engineering), criptografía de red (mTLS) y respuesta ante incidentes (DFIR)**, respetando de forma estricta las limitaciones físicas de hardware del VPS en AWS Lightsail (**1 GB de RAM**).

---

## 1. Visión y Justificación Arquitectónica

La terminal actual implementa una arquitectura sólida y aislada mediante `Alpine 3.20`, `dockerode`, `tmpfs`, `CapDrop: ALL` y WebSockets bidireccionales con `xterm.js`. Sin embargo, a nivel de experiencia de usuario, se percibe como una terminal estática con comandos informativos (`about`, `projects`, `skills`, `architecture`, `neofetch`).

Para elevar el impacto profesional, el sistema se estructurará en dos grandes vertientes complementarias:
1. **Showcase Enterprise & Observabilidad de Bajo Nivel:** Módulos que inspeccionan y demuestran la ingeniería real del sistema (cgroups v2, auditoría CIS Benchmark, mTLS, latencia hop-by-hop).
2. **Defensa Activa y Retos DevSecOps (Interactive Sandbox / Mini-CTF):** Pruebas interactivas donde el visitante intenta romper el contenedor y el sistema le enseña en tiempo real cómo y por qué falló el ataque, o bien resuelve incidentes forenses reales.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PORTAFOLIO TERMINAL - SHOWCASE DEVSECOPS                 │
├──────────────────────────────────────┬──────────────────────────────────────┤
│    PILAR 1: ENTERPRISE SHOWCASE      │    PILAR 2: DEFENSA ACTIVA & RETOS   │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ 1. Auditoría CIS Benchmark (Score)   │ 1. "Audit My Sandbox" (Pentesting)   │
│ 2. Telemetría cgroups v2 en Vivo     │ 2. Mini-CTF Linux (Permisos/Cripto)  │
│ 3. Chaos Engineering (Inyección OOM) │ 3. Simulador de Incidentes SRE       │
│ 4. Inspector Zero-Trust mTLS & Red   │ 4. Laboratorio Forense DFIR          │
│ 5. Trazabilidad de Latencia Edge     │ 5. Gamificación React (WebSockets)   │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 2. Bloque 1: Showcase Técnico Enterprise (Nivel Senior / Principal)

### 2.1 Auditor Automatizado de Cumplimiento (CIS Docker Benchmark Scanner)
* **Comando CLI:** `compliance` o `cis-audit`
* **Propósito:** Auditar el propio contenedor en tiempo de ejecución frente a los lineamientos oficiales de la industria (**CIS Docker Benchmark Level 2** y lineamientos NIST).
* **Mecanismo:** Un script ejecutable en `/usr/local/bin/cis-audit` que comprueba:
  * Verificación de usuario sin privilegios (`id -u` == 1000).
  * Ausencia de capacidades del kernel (`CapDrop: ALL`, validado leyendo CapEff en `/proc/self/status`).
  * Estado de `no-new-privileges` mediante llamada de sistema `prctl`.
  * Verificación de `ReadonlyRootfs` intentando escribir un archivo temporal en `/etc/`.
  * Verificación de flags de montaje en `tmpfs` (`/home/guest` y `/tmp` montados con `noexec,nosuid`).
  * Ausencia de interfaces de red activas (`ip link` o `/proc/net/dev` reflejando `NetworkMode: 'none'`).
  * Enmascaramiento de rutas de hardware del host (`/proc/kcore`, `/sys/firmware`).
  * Nivel de entropía ASLR (`/proc/sys/kernel/randomize_va_space`).
* **Salida en Terminal:**
  ```text
  [+] EJECUTANDO AUDITORÍA CIS BENCHMARK & HARDENING SCORE...
  ────────────────────────────────────────────────────────────────────────────
  [PASS] CIS-4.1  | Usuario no root verificado (UID 1000: guest)
  [PASS] CIS-4.6  | Capabilities del Kernel: ALL despojadas (CapEff: 0000000000000000)
  [PASS] CIS-4.7  | Flag No-New-Privileges activo a nivel de kernel (PR_GET_NO_NEW_PRIVS)
  [PASS] CIS-4.8  | Filesystem raíz montado en modo SOLO LECTURA (EROFS: Read-only fs)
  [PASS] CIS-4.10 | tmpfs (/home/guest, /tmp) montados con flags 'noexec, nosuid'
  [PASS] CIS-5.1  | Aislamiento de Red: NetworkMode 'none' (Cero sockets expuestos)
  [PASS] CIS-5.2  | Enmascaramiento de rutas de kernel (/proc/kcore, /sys/firmware)
  [PASS] KERN-01  | Entropía de memoria ASLR activa (randomize_va_space = 2)
  ────────────────────────────────────────────────────────────────────────────
  RESULTADO: 100% CUMPLIMIENTO | HARDENING SCORE: 98/100 (GRADO: A+ ENTERPRISE)
  ```

---

### 2.2 Telemetría de Kernel y cgroups v2 en Tiempo Real
* **Comando CLI:** `cgroups` o `telemetry`
* **Propósito:** Mostrar cómo el kernel de Linux aísla y raciona los recursos físicos entre el contenedor y el host de AWS Lightsail (1 GB de RAM).
* **Mecanismo:** Lectura en vivo de los controladores del pseudofilesystem `/sys/fs/cgroup/`:
  * `memory.max`: Límite máximo de memoria asignado (64 MB en AWS / 256 MB en Servidor Propio).
  * `memory.current`: Consumo real actual en bytes.
  * `memory.swap.max`: Límite de swap asignado (0 bytes para evitar thrashing de I/O en disco).
  * `memory.events`: Contadores de presurización de memoria (`oom`, `oom_kill`, `high`, `max`).
  * `cpu.max`: Quota de CPU asignada frente al periodo base (ej. `25000 100000` = 0.25 vCPU en AWS; `100000 100000` = 1.0 vCPU en Servidor Propio).
  * `pids.current` / `pids.max`: Procesos vivos en el árbol del contenedor versus el límite estricto (50 en AWS / 100 en Servidor Propio).
* **Salida en Terminal:**
  ```text
  [KERNEL LINUX CGROUPS V2 SUBSYSTEM TELEMETRY]
  ────────────────────────────────────────────────────────────────────────────
  Controlador        Métrica Real                    Límite Asignado
  ────────────────────────────────────────────────────────────────────────────
  memory.max         12.4 MB (Activo)                 64.0 MB (Hard Limit VPS)
  memory.swap.max    0 bytes                          0 bytes (Swap Desactivado)
  memory.events      oom_kill: 0 | high: 0 | max: 0   Cero degradación de memoria
  cpu.max            quota: 25000 / period: 100000    0.25 vCPU (25% Host Core)
  pids.current       3 procesos activos               50 PIDs (Anti-Forkbomb)
  pids.events        max: 0                           Cero rechazos de procesos
  ────────────────────────────────────────────────────────────────────────────
  Host Shielding: Protegido contra Starvation y OOM del VPS (1 GB RAM Lightsail)
  ```

---

### 2.3 Simulador de Chaos Engineering (Inyección de Fallos Controlada)
* **Comando CLI:** `chaos run <scenario>`
* **Propósito:** Emular pruebas de ingeniería del caos para validar la resiliencia del sistema ante incidentes extremos sin poner en riesgo la estabilidad del host.
* **Escenarios Disponibles:**
  1. `chaos run oom`: Ejecuta un proceso auxiliar en memoria que intenta alocar buffers progresivamente hasta superar la cuota del cgroup (64 MB o 256 MB). Demuestra cómo el kernel ejecuta el **OOM-Killer** aislando y liquidando al proceso infractor (`SIGKILL`) sin tumbar el shell interactivo (PID 1) ni degradar a Node.js en el host.
  2. `chaos run fork`: Ejecuta un bucle de bifurcación de subshell hasta saturar el `pids.max`. El kernel rechaza la creación de nuevos PIDs (`Resource temporarily unavailable`) y el comando expone el informe de mitigación.
  3. `chaos run net-leak`: Intenta forzar la apertura de un socket raw o conexión UDP saliente para demostrar cómo el kernel descarta la operación inmediatamente debido a `NetworkMode: 'none'`.
* **Salida en Terminal:**
  ```text
  [CHAOS INJECTION: MEMORY PRESSURE ATTEMPT]
  [!] Asignando 80 MB de memoria en buffer dinámico...
  [KERNEL INTERVENTION] cgroup memory.max (64 MB) violado.
  [KERNEL ACTION] OOM-Killer invocó SIGKILL sobre el proceso PID 42 (stress_alloc).
  [RESILIENCE REPORT]
    - Proceso contenedor principal: VIVO (PID 1 intacto)
    - Socket Web/PTY: ESTABLE (Cero desconexión de sesión)
    - Host VPS (AWS): 100% INTACTO (Sin afectación a Next.js / NestJS)
  ```

---

### 2.4 Inspector Criptográfico Zero-Trust y Latencia de Red
* **Comando CLI:** `inspect-edge` o `tls-trace`
* **Propósito:** Evidenciar la arquitectura de seguridad perimetral que protege al ecosistema (**Cloudflare Edge + mTLS + Nginx con Rate Limiting en memoria compartida**).
* **Mecanismo:**
  * Inspecciona mediante `openssl` el certificado de origen, la fecha de emisión, el algoritmo de firma (`sha256WithRSAEncryption`), la versión TLS negociada (`TLSv1.3`) y los ciphers activos (`TLS_AES_256_GCM_SHA384`).
  * Explica el algoritmo **Token Bucket** configurado en Nginx (`limit_req_zone` de 10 MB para 15 req/s en API y 35 req/s en Web) y cómo se extrae la IP real mediante `$http_cf_connecting_ip`.
  * Grafica el salto de paquetes y latencias:
    ```text
    Navegador (TLS 1.3) ──► Cloudflare Edge (WAF + mTLS) [22 ms]
                         ──► Nginx Reverse Proxy (Keepalive upstream) [1.1 ms]
                         ──► NestJS Socket.io (Node.js Loopback) [0.4 ms]
                         ──► Docker PTY Stream (Alpine Linux tty) [0.2 ms]
    Latencia total del pipeline: 23.7 ms
    ```

---

### 2.5 Laboratorio DFIR (Digital Forensics & Incident Response)
* **Comando CLI:** `incident-investigate`
* **Escenario Realista:** *"Alerta de seguridad: Un pipeline de CI/CD comprometido introdujo un artefacto sospechoso en `/opt/audit/`. Encuentra el vector de ataque y genera el informe de IoCs (Indicators of Compromise)."*
* **Flujo de Trabajo del Visitante:**
  1. Inspeccionar metadatos de archivos e inodos (`stat /opt/audit/artifact`).
  2. Generar hashes criptográficos de integridad (`sha256sum`).
  3. Correlacionar marcas de tiempo en logs de auditoría simulados (`auditd.log`).
  4. Extraer cadenas y artefactos ofuscados (`strings`, `xxd`).
  5. Entregar informe con `incident-report submit <hash>`, lo cual valida la resolución y emite el reconocimiento.

---

## 3. Bloque 2: Defensa Activa, Retos DevSecOps y Mini-CTF

### 3.1 "Audit My Sandbox" (Pruebas de Pentesting con Mitigación Explicada)
En lugar de prohibir comandos de ataque, se permite que el visitante los ejecute conscientemente, haciendo que el shell intercepte el intento y explique la defensa técnica aplicada:

| Intento de Ataque | Comando Típico | Mecanismo de Defensa Activo | Respuesta Pedagógica en Terminal |
|---|---|---|---|
| **Denegación por Forkbomb** | `:(){ :|:& };:` | `PidsLimit: 50` + `ulimit -u 50` | `[DEFENSA ACTIVA] Forkbomb neutralizada por cgroups PidsLimit=50 y ulimit. El host de AWS no sufrió degradación.` |
| **Escalamiento a Root** | `sudo su`, `su -` | Usuario `guest` (1000) + `CapDrop: ALL` + `no-new-privileges` | `[DEFENSA ACTIVA] Intento de escalamiento bloqueado. Todas las capacidades de Linux (CAP_SYS_ADMIN, etc.) fueron despojadas en runtime.` |
| **Reconocimiento de Hardware** | `cat /proc/kcore`, `cat /proc/cpuinfo` | `MaskedPaths: ['/proc/kcore', ...]` | `[DEFENSA ACTIVA] Acceso a descriptores de memoria física y CPU del host enmascarados por Docker para prevenir fingerprinting.` |
| **Agotamiento de Memoria** | Bucle malloc en memoria | `Memory: 64MB` + OOM-Killer | `[DEFENSA ACTIVA] Proceso infractor terminado por cgroups OOM-Killer. El contenedor y la sesión PTY permanecen intactos.` |
| **Pivoting de Red / Escaneo** | `ping`, `curl`, `nmap` | `NetworkMode: 'none'` | `[DEFENSA ACTIVA] Cero sockets de red activos. El kernel no provee interfaces para evitar pivoting o exfiltración.` |

---

### 3.2 Mini-CTF de Linux y DevSecOps (`challenge` / `ctf`)
Diseñado en 4 o 5 niveles progresivos inspirados en la metodología de *Bandit (OverTheWire)*, contenidos dentro del directorio protegido `/opt/challenges/`:

* **Nivel 1: Permisos y Auditoría de Archivos**
  * *Pista:* *"Un archivo de configuración sensible quedó abandonado en el sistema con permisos permisivos. Encuentra la flag."*
  * *Habilidad:* `find / -type f -perm 644 -name "*.conf" 2>/dev/null` o grep recursivo.
  * *Flag:* `FLAG{LINUX_PERMISSIONS_MASTER}`.
* **Nivel 2: Criptografía, Hashes y Ofuscación**
  * *Pista:* *"Se interceptó una credencial de despliegue ofuscada en Base64 y con salt en `/var/log/incident.log`."*
  * *Habilidad:* Pipes de Linux: `cat incident.log | grep token | cut -d':' -f2 | base64 -d`.
  * *Flag:* `FLAG{DECODE_PIPELINE_EXPERT}`.
* **Nivel 3: Criptografía PKI y Certificados X.509**
  * *Pista:* *"Inspecciona un certificado simulado en `/etc/ssl/certs/mock.crt` y extrae el Common Name (CN) y la fecha exacta de expiración usando openssl."*
  * *Habilidad:* `openssl x509 -in /etc/ssl/certs/mock.crt -text -noout`.
  * *Flag:* `FLAG{PKI_CERT_INSPECTOR}`.
* **Nivel 4: Inspección de Procesos y Descriptores de Kernel**
  * *Pista:* *"Un demonio en segundo plano está emitiendo datos a un descriptor anónimo en `/proc/$PID/fd/`. Recupera la flag antes de que finalice el ciclo."*
  * *Habilidad:* `ps aux`, inspección de `/proc/$PID/fd/`.
  * *Flag:* `FLAG{PROC_DESCRIPTOR_WIZARD}`.

---

### 3.3 Simulador de Incidentes SRE / Troubleshooting (`troubleshoot`)
* **Comando CLI:** `troubleshoot start`
* **Escenario:** El visitante asume el rol de un ingeniero DevOps en guardia (*on-call*). Un servicio local simulado (Nginx o Node.js) dentro de `/home/guest/incident-01/` falla al arrancar.
* **Secuencia de Resolución:**
  1. Revisar los logs en `error.log`.
  2. Identificar el defecto (ej. puerto ocupado en mock, sintaxis errónea en un archivo de configuración JSON/Nginx, o permisos denegados).
  3. Corregir el archivo utilizando `nano`.
  4. Ejecutar `./verify.sh`.
  5. El verificador comprueba la solución y emite el reconocimiento.

---

## 4. Gamificación e Integración con el Frontend (React + WebSockets)

La experiencia no debe quedarse aislada en la terminal; debe retroalimentar la interfaz de usuario del portafolio:

```text
[ Terminal xterm.js ] ──► Comando: 'submit-flag FLAG{...}'
                                   │
                                   ▼ (WebSocket Event: 'validate-flag')
                        [ NestJS: SandboxGateway ]
                                   │
                                   ▼ (Verificación interna)
                        [ WebSocket Emit: 'challenge-completed' ]
                                   │
                                   ▼
                        [ Next.js: SandboxTerminal.tsx ]
                        ├── Modal Flotante Dark Luxury: "¡Reto Superado!"
                        ├── Badge Dorado Desbloqueado: "DevSecOps Scout"
                        └── Progreso Global: [ 2 / 5 Retos Completados ]
```

### Componentes de Frontend a Enriquecer:
1. **Contador de Progreso en Cabecera:** Muestra medallas o estrellas doradas junto al selector de modo (VPS / Servidor Propio).
2. **Modal de Felicitación con Efecto Glassmorphism:** Notificación sutil sin interrumpir el flujo del terminal.
3. **Descarga de Badge / Certificado:** Permite al reclutador descargar o visualizar un reporte criptográficamente firmado que certifique que completó los retos en el portafolio.

---

## 5. Explotación Estratégica: AWS Lightsail vs Servidor Propio

La existencia de dos entornos con capacidades de hardware distintas debe reflejarse en los retos disponibles:

| Módulo / Reto | AWS Lightsail (64 MB RAM / 0.25 vCPU) | Servidor Propio (256 MB RAM / 1.0 vCPU) |
|---|---|---|
| **Auditoría CIS Benchmark** | Sí (Análisis estático ultraligero) | Sí |
| **Telemetría cgroups v2** | Sí (Refleja cuota de 64 MB) | Sí (Refleja cuota de 256 MB y 1 vCPU) |
| **Chaos Engineering: OOM** | Dispara OOM al exceder 64 MB | Dispara OOM al exceder 256 MB |
| **Mini-CTF (Niveles 1 al 4)** | Sí (Bajo consumo en disco tmpfs) | Sí |
| **Retos de Cómputo Intensivo** | Deshabilitados para proteger el VPS | **Habilitados:** Compilación mínima de código C/Go o benchmark de CPU completo |
| **Análisis de Tráfico Simulada** | Básico | **Habilitado:** Inspección de dumps de red (`pcap`/`tcpdump`) más extensos |

---

## 6. Plan de Implementación por Fases (Sin Afectar Producción)

### Fase 1: Enriquecimiento de Shell y Comandos Base (`sandbox_profile.sh`)
* Añadir funciones nativas de Bash en [sandbox_profile.sh](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/src/portfolio/docker/sandbox_profile.sh) para `compliance`, `cgroups`, `chaos` y `inspect-edge`.
* Diseñar las respuestas de intercepción para ataques comunes (`forkbomb`, `sudo`).
* **Impacto:** Cero cambios en dependencias, cero aumento de consumo de RAM.

### Fase 2: Inclusión de Pistas y Escenarios en Dockerfile
* Modificar [Dockerfile](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/src/portfolio/docker/Dockerfile) para crear el árbol de retos en `/opt/challenges/` con permisos de lectura específicos.
* Generar los certificados mock y logs simulados.
* Reconstruir la imagen `portfolio-sandbox:latest`.

### Fase 3: Gateway WebSocket y Validación de Banderas
* Extender [SandboxGateway](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/src/portfolio/gateways/sandbox.gateway.ts) con el evento `@SubscribeMessage('submit-flag')`.
* Validar hashes de banderas contra una tabla estática en memoria.
* Emitir `challenge-completed` al socket del cliente.

### Fase 4: Retroalimentación Visual en React
* Actualizar [useSandboxTerminal.ts](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(portfolio)/features/terminal/hooks/useSandboxTerminal.ts) para escuchar `challenge-completed`.
* Crear el componente visual de medallas y progreso en [SandboxTerminal.tsx](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(portfolio)/features/terminal/components/SandboxTerminal.tsx).
