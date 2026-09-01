FROM alpine:3.20

# Instalación de utilidades esenciales para una experiencia interactiva completa (< 50 MB total)
RUN apk add --no-cache \
    bash \
    coreutils \
    procps \
    htop \
    nano \
    curl \
    jq \
    git \
    tree \
    file \
    neofetch \
    ncurses \
    util-linux

# Limpiar posible usuario 'guest' residual de Alpine y recrear con UID/GID 1000 explícito
RUN deluser guest 2>/dev/null || true && \
    delgroup guest 2>/dev/null || true && \
    addgroup -g 1000 guest && \
    adduser -u 1000 -G guest -s /bin/bash -D -h /home/guest guest && \
    mkdir -p /home/guest && \
    chown -R guest:guest /home/guest && \
    chmod 700 /home/guest

# Variables de entorno globales del shell
ENV HOME=/home/guest \
    TERM=xterm-256color \
    SHELL=/bin/bash \
    USER=guest \
    PAGER=cat \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

# Configuración global del shell en /etc/profile.d/ y /etc/bash.bashrc
# Inmunidad ante montaje de tmpfs volátil sobre /home/guest en tiempo de ejecución
COPY sandbox_profile.sh /etc/profile.d/sandbox.sh
COPY sandbox_profile.sh /etc/bash.bashrc
COPY welcome.txt /etc/motd

# Permisos de lectura pública para la configuración global del sistema
RUN chmod 644 /etc/profile.d/sandbox.sh /etc/bash.bashrc /etc/motd

WORKDIR /home/guest
USER guest

# Modo login shell: lee /etc/profile y ejecuta scripts en /etc/profile.d/
CMD ["/bin/bash", "--login"]
