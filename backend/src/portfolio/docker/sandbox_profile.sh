# Configuración Global de Shell para el Sandbox del Portafolio
# Estética Dark Luxury (Gold & Dark Gray)

# Colores ANSI
RESET="\[\033[0m\]"
GOLD="\[\033[38;5;221m\]"
DIM="\[\033[38;5;242m\]"
CYAN="\[\033[38;5;117m\]"
GREEN="\[\033[38;5;120m\]"

# Prompt interactivo: [guest@sandbox ~]$ 
export PS1="${DIM}[${RESET}${GOLD}\u${DIM}@${CYAN}sandbox${RESET} ${GREEN}\w${DIM}]${RESET}\$ "

# Aliases de alta productividad y seguridad
alias ll='ls -lah --color=auto'
alias la='ls -A --color=auto'
alias l='ls -CF --color=auto'
alias ls='ls --color=auto'
alias df='df -h'
alias free='free -m'
alias grep='grep --color=auto'

# Historial volátil en memoria
export HISTFILE=/home/guest/.bash_history
export HISTSIZE=200
export HISTFILESIZE=200

# Función de ayuda contextual rápida
help() {
    echo -e "\033[38;5;221m── Comandos y herramientas disponibles en este Sandbox ──\033[0m"
    echo -e "  \033[38;5;117mneofetch\033[0m      - Información del sistema y arte ASCII"
    echo -e "  \033[38;5;117mhtop\033[0m          - Monitor interactivo de procesos"
    echo -e "  \033[38;5;117mnano <file>\033[0m   - Editor de texto interactivo"
    echo -e "  \033[38;5;117mtree\033[0m          - Árbol de directorios"
    echo -e "  \033[38;5;117mgit\033[0m           - Control de versiones (modo offline)"
    echo -e "  \033[38;5;117mls, cat, pwd\033[0m  - Navegación básica en Linux"
    echo -e "  \033[38;5;117mexit\033[0m          - Cerrar sesión y destruir contenedor"
    echo ""
}

# Mostrar banner de bienvenida con secuencias ANSI reales en sesiones interactivas
if [ -t 1 ]; then
    printf '\033[38;5;221m'
    cat << 'EOF'
     _                                 _           _            _        
    | |  ___   _ __  __ _   ___     __| |  ___   (_)  ___  ___ | |  __ _ 
 _  | | / _ \ | '__|/ _` | / _ \   / _` | / _ \  | | / __|/ _ \| | / _` |
| |_| || (_) || |  | (_| ||  __/  | (_| || (_) | | || (__|  __/| || (_| |
 \___/  \___/ |_|   \__, | \___|   \__,_| \___/  |_| \___|\___||_| \__,_|
                    |___/                                                
EOF
    printf '\033[0m\033[38;5;242m─────────────────────────────────────────────────────────────────────────────\033[0m\n'
    printf '\033[1;38;5;221mJORGE DOICELA — INTERACTIVE LINUX CONSOLE\033[0m\n'
    printf '\033[38;5;242m─────────────────────────────────────────────────────────────────────────────\033[0m\n'
    printf '\033[38;5;250mBienvenido a mi entorno de demostración técnica interactiva.\033[0m\n'
    printf '\033[38;5;250mComandos disponibles: \033[38;5;117mneofetch, htop, nano, git, curl, jq, tree, ls, whoami\033[0m\n'
    printf '\033[38;5;242mEscribe '\''help'\'' o '\''neofetch'\'' para comenzar a explorar.\033[0m\n'
    printf '\033[38;5;242m─────────────────────────────────────────────────────────────────────────────\033[0m\n\n'
fi
