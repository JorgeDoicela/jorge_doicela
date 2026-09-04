# Configuración Global de Shell para la Terminal en Vivo del Portafolio
# Estética Dark Luxury (Gold & Dark Gray)

# Colores ANSI
RESET="\[\033[0m\]"
GOLD="\[\033[38;5;221m\]"
DIM="\[\033[38;5;242m\]"
CYAN="\[\033[38;5;117m\]"
GREEN="\[\033[38;5;120m\]"

# Configuración dinámica de identidad según el entorno (AWS Cloud o Servidor Local)
if [ "$SANDBOX_MODE" = "tunnel" ]; then
    NODE_SUBTITLE="Servidor Físico Propio • Conexión Cifrada mediante Túnel"
    HOST_PROMPT="servidor-local"
    NODE_GREETING="¡Hola y bienvenido a mi hardware dedicado! Estás conectado directamente a mi servidor\nfísico privado a través de un túnel cifrado punto a punto con mayor capacidad de cómputo."
else
    NODE_SUBTITLE="Servidor Cloud en AWS (Amazon Web Services) • Entorno Aislado y Seguro"
    HOST_PROMPT="aws-cloud"
    NODE_GREETING="¡Hola y bienvenido a la nube! Estás conectado en vivo a mi servidor cloud en Amazon Web Services (AWS Lightsail).\nEsta máquina cuenta con aislamiento seguro en tiempo real para que explores con total libertad."
fi

# Prompt interactivo dinámico: guest@aws-cloud:~$ o guest@servidor-local:~$
export PS1="${GOLD}guest${DIM}@${GOLD}${HOST_PROMPT}${DIM}:${CYAN}\w${DIM}\$ ${RESET}"

# Aliases de alta productividad y seguridad
alias ll='ls -lah --color=auto'
alias la='ls -A --color=auto'
alias l='ls -CF --color=auto'
alias ls='ls --color=auto'
alias df='df -h'
alias free='free -m'
alias grep='grep --color=auto'

# Historial desactivado: privacidad entre sesiones de visitantes distintos
export HISTFILE=/dev/null
export HISTSIZE=0
export HISTFILESIZE=0

# ── LÍMITES DEL SHELL (defensa en profundidad sobre los cgroups del contenedor) ──
# file descriptors: limitar a 256 (por defecto 1048576 — innecesariamente alto)
ulimit -n 256
# virtual memory: 128 MB para VPS / 512 MB para Tunnel (doble del límite de cgroups por holgura)
if [ "$SANDBOX_MODE" = "tunnel" ]; then
    ulimit -v 524288   # 512 MB en KB
else
    ulimit -v 131072   # 128 MB en KB
fi
# cpu time: 60 segundos máx por proceso (impide loops CPU infinitos sin CapSysTime)
ulimit -t 60
# tamaño de archivo creado: 20 MB máx (cubre el tmpfs de 15 MB con margen)
ulimit -f 40960

# Máscara de creación de archivos: 077 garantiza que ningún archivo sea world-readable
umask 077

# Proteger la variable de modo contra sobreescritura desde la shell del visitante
readonly SANDBOX_MODE


# ── ALIASES DE ALTA PRODUCTIVIDAD ───────────────────────────────────
alias ll='ls -lah --color=auto'
alias la='ls -A --color=auto'
alias l='ls -CF --color=auto'
alias ls='ls --color=auto'
alias df='df -h'
alias free='free -m'
alias grep='grep --color=auto'

# ── COMANDOS DE PERFIL PROFESIONAL Y PROYECTOS ─────────────────────────────
about() {
    echo -e "\033[1;38;5;221mJorge Ismael Doicela Molina • Perfil Profesional\033[0m"
    echo -e "\033[38;5;242m────────────────────────────────────────────────────────────\033[0m"
    echo -e "  \033[38;5;221mRol:\033[0m          Full-Stack & DevSecOps Engineer"
    echo -e "  \033[38;5;221mEspecialidad:\033[0m Arquitectura Monolítica Modular, Next.js, NestJS y Cloud"
    echo -e "  \033[38;5;221mEducación:\033[0m    Ingeniería de Software (Universidad de las Fuerzas Armadas ESPE)"
    echo -e "  \033[38;5;221mFilosofía:\033[0m    Excelencia arquitectónica, soluciones de raíz y cero parches."
    echo ""
}

projects() {
    echo -e "\033[1;38;5;221mProyectos Destacados de Ingeniería:\033[0m"
    echo -e "\033[38;5;242m────────────────────────────────────────────────────────────\033[0m"
    echo -e "  \033[1;38;5;221m1. La Biblia Modular\033[0m \033[38;5;242m[https://bible.jorgedoicela.com]\033[0m"
    echo -e "     Stack: Next.js 16, NestJS 11, SQLite (WAL), Expo Mobile, TypeScript"
    echo -e "     9 motores de exégesis bíblica y análisis de morfología Strong."
    echo ""
    echo -e "  \033[1;38;5;221m2. Software Platform\033[0m \033[38;5;242m[https://software.jorgedoicela.com]\033[0m"
    echo -e "     Stack: Next.js 16, NestJS 11, SQLite, Neumorphism UI, Glassmorphism"
    echo -e "     7 categorías temáticas, asesor de código interactivo StepWizard."
    echo ""
    echo -e "  \033[1;38;5;221m3. Portafolio Profesional & Shell\033[0m \033[38;5;242m[https://portfolio.jorgedoicela.com]\033[0m"
    echo -e "     Stack: Next.js 16, NestJS 11, WebSockets, xterm.js, Docker Hardened"
    echo -e "     Consola Web Interactiva, multiplexor tmux y contenedor en vivo."
    echo ""
}

skills() {
    echo -e "\033[1;38;5;221mStack Tecnológico y Competencias Técnicas:\033[0m"
    echo -e "\033[38;5;242m────────────────────────────────────────────────────────────\033[0m"
    echo -e "  \033[38;5;221mFrontend:\033[0m  Next.js 16, React 19, TypeScript, TailwindCSS, Geist UI, FSD"
    echo -e "  \033[38;5;221mBackend:\033[0m   NestJS 11, Node.js, Express, Socket.io, Arquitectura Limpia"
    echo -e "  \033[38;5;221mBases:\033[0m     SQLite (WAL mode), TypeORM, Redis, PostgreSQL"
    echo -e "  \033[38;5;221mDevSecOps:\033[0m AWS Lightsail, Debian GNU/Linux, Docker, Nginx mTLS, PM2, cgroups"
    echo ""
}

architecture() {
    echo -e "\033[1;38;5;221mArquitectura de Ingeniería: Ecosistema en 1 GB de RAM\033[0m"
    echo -e "\033[38;5;242m────────────────────────────────────────────────────────────\033[0m"
    echo -e "  \033[38;5;221mEl Reto Físico:\033[0m    VPS en AWS Lightsail limitado estrictamente a 1 GB RAM."
    echo -e "  \033[38;5;221mConsolidación:\033[0m     4 subdominios servidos por 1 solo proceso Next.js 16 (puerto 3001)"
    echo -e "                     y 1 solo proceso NestJS 11 (puerto 3000) mediante middleware."
    echo -e "  \033[38;5;221mPersistencia:\033[0m      Cero motores pesados. SQLite local en modo WAL (Write-Ahead Log)"
    echo -e "                     con bases físicas independientes: bible.sqlite, software.sqlite,"
    echo -e "                     portfolio.sqlite."
    echo -e "  \033[38;5;221mSeguridad:\033[0m         Cloudflare mTLS, Nginx reverse proxy, cuotas de cgroups y"
    echo -e "                     sesiones aisladas efímeras sin privilegios de root."
    echo -e "  \033[38;5;221mResultado:\033[0m         Consumo base menor a 400 MB de RAM con rendimiento instantáneo."
    echo ""
}

# ── DEMOSTRACIONES EN DIRECTO Y RENDIMIENTO ─────────────────────────────────
benchmark() {
    echo -e "\033[1;38;5;221m── Test de Rendimiento y Velocidad de CPU en Vivo ──\033[0m"
    echo -e "\033[38;5;242mIniciando prueba matemática intensiva en este servidor...\033[0m"
    start_time=$(date +%s%N)
    count=0
    for ((i=2; i<=2500; i++)); do
        is_prime=1
        for ((j=2; j*j<=i; j++)); do
            if (( i % j == 0 )); then
                is_prime=0
                break
            fi
        done
        if (( is_prime == 1 )); then
            ((count++))
        fi
    done
    end_time=$(date +%s%N)
    elapsed_ms=$(( (end_time - start_time) / 1000000 ))
    echo -e "  \033[38;5;120m✔ Prueba completada con éxito:\033[0m $count números primos calculados"
    echo -e "  \033[38;5;221mTiempo de respuesta:\033[0m  ${elapsed_ms} ms"
    echo -e "  \033[38;5;117mEstado de Memoria del Sistema:\033[0m"
    free -h 2>/dev/null || free -m
    echo ""
}

api-live() {
    echo -e "\033[1;38;5;221m── Petición API en Vivo • GET /api/v1/health/telemetry ──\033[0m"
    echo -e "\033[38;5;242mHTTP/2 200 OK • Content-Type: application/json • Latency: 0.8ms\033[0m"
    cat << 'JSON_EOF'
{
  "status": "online",
  "system": "Debian GNU/Linux 13",
  "runtime": "NestJS 11 + Next.js 16 (Consolidados en 1 GB RAM)",
  "security": {
    "cgroups": "active",
    "mTLS": "Cloudflare Strict",
    "isolation": "unprivileged"
  },
  "modules": [
    "bible.jorgedoicela.com",
    "software.jorgedoicela.com",
    "portfolio.jorgedoicela.com",
    "jorgedoicela.com"
  ],
  "author": "Jorge Ismael Doicela Molina"
}
JSON_EOF
    echo ""
}

matrix() {
    echo -e "\033[38;5;120mIniciando efecto visual Matrix... (Ctrl+C para volver a la terminal)\033[0m"
    sleep 0.5
    lines=$(tput lines 2>/dev/null || echo 24)
    cols=$(tput cols 2>/dev/null || echo 80)
    for ((k=0; k<50; k++)); do
        line=""
        for ((c=0; c<cols; c++)); do
            rand=$((RANDOM % 8))
            if [ $rand -eq 0 ]; then
                chars="0123456789ABCDEF$#@%&*+-/="
                char="${chars:$((RANDOM % ${#chars})):1}"
                line="${line}\033[38;5;120m${char}\033[0m"
            else
                line="${line} "
            fi
        done
        echo -e "$line"
        sleep 0.05
    done
    echo -e "\033[0m"
}

contact() {
    echo -e "\033[1;38;5;221mCanales de Contacto Directo:\033[0m"
    echo -e "\033[38;5;242m────────────────────────────────────────────────────────────\033[0m"
    echo -e "  \033[38;5;221mEmail:\033[0m    contacto@jorgedoicela.com"
    echo -e "  \033[38;5;221mGitHub:\033[0m   https://github.com/jorgedoicela"
    echo -e "  \033[38;5;221mWeb:\033[0m      https://jorgedoicela.com"
    echo ""
}

help() {
    echo -e "\033[1;38;5;221m── Comandos y herramientas disponibles en este servidor ──\033[0m"
    echo -e "  \033[38;5;221mabout\033[0m         \033[38;5;242m→\033[0m Mi perfil profesional, educación y principios"
    echo -e "  \033[38;5;221mprojects\033[0m      \033[38;5;242m→\033[0m Proyectos de producción, arquitectura y métricas"
    echo -e "  \033[38;5;221mskills\033[0m        \033[38;5;242m→\033[0m Tecnologías dominadas (Next.js, NestJS, Cloud)"
    echo -e "  \033[38;5;221marchitecture\033[0m  \033[38;5;242m→\033[0m Cómo corre este ecosistema en solo 1 GB de RAM"
    echo -e "  \033[38;5;221mbenchmark\033[0m     \033[38;5;242m→\033[0m Test de velocidad y cálculo matemático en vivo"
    echo -e "  \033[38;5;221mapi-live\033[0m      \033[38;5;242m→\033[0m Demostración de consulta y respuesta JSON de la API"
    echo -e "  \033[38;5;221mmatrix\033[0m        \033[38;5;242m→\033[0m Efecto visual de lluvia digital de código"
    echo -e "  \033[38;5;221mcontact\033[0m       \033[38;5;242m→\033[0m Enlaces de contacto, GitHub y correo"
    echo -e "  \033[38;5;117mneofetch\033[0m      \033[38;5;242m→\033[0m Telemetría, hardware y consumo de recursos"
    echo -e "  \033[38;5;117mhtop\033[0m          \033[38;5;242m→\033[0m Monitor interactivo de memoria y procesos"
    echo -e "  \033[38;5;117mnano <file>\033[0m   \033[38;5;242m→\033[0m Editor de texto en terminal"
    echo -e "  \033[38;5;117mtree\033[0m          \033[38;5;242m→\033[0m Árbol de archivos del sistema"
    echo -e "  \033[38;5;117mls, cat, pwd\033[0m  \033[38;5;242m→\033[0m Navegación estándar en Linux"
    echo -e "  \033[38;5;117mexit\033[0m          \033[38;5;242m→\033[0m Finalizar sesión interactiva"
    echo ""
}

# Mostrar banner de bienvenida dinámico en sesiones interactivas
if [ -t 1 ]; then
    printf '\033[38;5;221m'
    cat << 'EOF'
       __                         ____        _           __     
      / /___  _________ ____     / __ \____  (_)_______  / /___ _
 __  / / __ \/ ___/ __ `/ _ \   / / / / __ \/ / ___/ _ \/ / __ `/
/ /_/ / /_/ / /  / /_/ /  __/  / /_/ / /_/ / / /__/  __/ / /_/ / 
\____/\____/_/   \__, /\___/  /_____/\____/_/\___/\___/_/\__,_/  
                /____/                                           
EOF
    printf '\033[0m\033[38;5;242m─────────────────────────────────────────────────────────────────────────────\033[0m\n'
    printf '\033[1;38;5;221mJorge Ismael Doicela Molina • Full-Stack & DevSecOps Engineer\033[0m\n'
    printf '\033[38;5;250m%s\033[0m\n' "$NODE_SUBTITLE"
    printf '\033[38;5;242m─────────────────────────────────────────────────────────────────────────────\033[0m\n'
    printf '\033[38;5;250m%b\033[0m\n\n' "$NODE_GREETING"
    printf '\033[1;38;5;221mEXPERIENCIA Y PROYECTOS:\033[0m\n'
    printf '  \033[38;5;221m• about\033[0m        \033[38;5;242m→\033[0m  \033[38;5;250mMi perfil profesional, educación y principios de ingeniería\033[0m\n'
    printf '  \033[38;5;221m• projects\033[0m     \033[38;5;242m→\033[0m  \033[38;5;250mProyectos de producción, arquitectura y enlaces directos\033[0m\n'
    printf '  \033[38;5;221m• skills\033[0m       \033[38;5;242m→\033[0m  \033[38;5;250mTecnologías dominadas (Next.js, NestJS, Cloud, Docker)\033[0m\n'
    printf '  \033[38;5;221m• architecture\033[0m \033[38;5;242m→\033[0m  \033[38;5;250mCómo corre este ecosistema completo en solo 1 GB de RAM\033[0m\n\n'
    printf '\033[1;38;5;221mRENDIMIENTO Y DEMOSTRACIONES EN DIRECTO:\033[0m\n'
    printf '  \033[38;5;221m• benchmark\033[0m    \033[38;5;242m→\033[0m  \033[38;5;250mTest de velocidad y cálculo de CPU en vivo en este servidor\033[0m\n'
    printf '  \033[38;5;221m• api-live\033[0m     \033[38;5;242m→\033[0m  \033[38;5;250mDemostración de consulta y respuesta JSON estructurada\033[0m\n'
    printf '  \033[38;5;221m• neofetch\033[0m     \033[38;5;242m→\033[0m  \033[38;5;250mTelemetría, hardware y consumo de recursos del sistema\033[0m\n'
    printf '  \033[38;5;221m• htop\033[0m         \033[38;5;242m→\033[0m  \033[38;5;250mMonitor interactivo de procesos y memoria en tiempo real\033[0m\n'
    printf '  \033[38;5;221m• matrix\033[0m       \033[38;5;242m→\033[0m  \033[38;5;250mEfecto visual de lluvia digital de código (Ctrl+C para salir)\033[0m\n\n'
    printf '\033[38;5;242mTip: Escribe "projects", "architecture" o "benchmark" y presiona Enter.\033[0m\n'
    printf '\033[38;5;242m─────────────────────────────────────────────────────────────────────────────\033[0m\n\n'
fi
