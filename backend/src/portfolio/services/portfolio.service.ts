import { Injectable } from '@nestjs/common';

export interface CommandExecutionResult {
  output: string;
  newCwd?: string;
  action?: 'clear' | 'exit' | 'matrix' | 'open' | 'none';
  actionPayload?: string;
}

interface VirtualFile {
  type: 'file' | 'dir';
  name: string;
  size?: number;
  permissions?: string;
  updatedAt?: string;
  content?: string;
  children?: Record<string, VirtualFile>;
}

@Injectable()
export class PortfolioService {
  private readonly serverStartTime = Date.now();

  // Virtual Filesystem Definition
  private readonly rootFilesystem: Record<string, VirtualFile> = {
    home: {
      type: 'dir',
      name: 'home',
      permissions: 'drwxr-xr-x',
      updatedAt: 'Aug 14 12:00',
      children: {
        jorge: {
          type: 'dir',
          name: 'jorge',
          permissions: 'drwxr-xr-x',
          updatedAt: 'Aug 14 12:00',
          children: {
            'README.md': {
              type: 'file',
              name: 'README.md',
              size: 1420,
              permissions: '-rw-r--r--',
              updatedAt: 'Aug 14 12:05',
              content: [
                '\x1b[1;33m# Jorge Ismael Doicela Molina\x1b[0m',
                'Desarrollador de Software con enfoque en DevSecOps y Arquitectura Limpia.',
                '',
                'Bienvenido a mi entorno de desarrollo interactivo. Esta terminal simula una',
                'sesión SSH segura sobre un VPS optimizado de bajos recursos.',
                '',
                '\x1b[36mEscribe "help" para ver la lista de comandos disponibles.\x1b[0m',
                '\x1b[36mEscribe "neofetch" para inspeccionar las especificaciones del sistema.\x1b[0m',
              ].join('\n'),
            },
            'skills.json': {
              type: 'file',
              name: 'skills.json',
              size: 980,
              permissions: '-rw-r--r--',
              updatedAt: 'Aug 14 12:10',
              content: JSON.stringify(
                {
                  developer: 'Jorge Doicela',
                  focus: 'Full-Stack & DevSecOps',
                  languages: [
                    'TypeScript',
                    'JavaScript',
                    'C#',
                    'PHP',
                    'Python',
                    'C',
                    'C++',
                  ],
                  frontend: [
                    'React 19',
                    'Next.js 16',
                    'TailwindCSS v4',
                    'Vite',
                    'HTML5/CSS3',
                  ],
                  backend: [
                    'NestJS',
                    'ASP.NET Core',
                    'Laravel',
                    'Blade',
                    'Node.js',
                  ],
                  databases: [
                    'PostgreSQL',
                    'MySQL',
                    'MongoDB',
                    'Redis',
                    'SQLite',
                  ],
                  cloud_devops: [
                    'AWS Lightsail',
                    'Docker',
                    'GitHub Actions',
                    'Cloudflare',
                    'Nginx',
                    'PM2',
                  ],
                  systems: [
                    'Arch Linux',
                    'Debian',
                    'Neovim',
                    'tmux',
                    'Hyprland',
                  ],
                },
                null,
                2,
              ),
            },
            'experience.log': {
              type: 'file',
              name: 'experience.log',
              size: 1250,
              permissions: '-rw-r--r--',
              updatedAt: 'Aug 14 12:15',
              content: [
                '\x1b[1;32m[2024 - Presente] Emplifi\x1b[0m',
                '  Rol: Full-Stack Developer',
                '  Descripción: Desarrollo de APIs REST, optimización de consultas SQL y mejoras en UI.',
                '',
                '\x1b[1;32m[2023 - 2024] Consejo Nacional de Competencias (CNC)\x1b[0m',
                '  Rol: Desarrollador Backend & DevOps',
                '  Descripción: Estabilización de arquitectura, módulos en NestJS/Laravel y empaquetado Docker.',
              ].join('\n'),
            },
            'contact.txt': {
              type: 'file',
              name: 'contact.txt',
              size: 450,
              permissions: '-rw-r--r--',
              updatedAt: 'Aug 14 12:20',
              content: [
                'Canales de Contacto Directo:',
                '  \x1b[33mEmail:\x1b[0m    jorge.doicela.m@gmail.com',
                '  \x1b[34mLinkedIn:\x1b[0m https://linkedin.com/in/jorgedoicela',
                '  \x1b[35mGitHub:\x1b[0m   https://github.com/JorgeDoicela',
                '  \x1b[36mTikTok:\x1b[0m   https://tiktok.com/@jorge.doicela',
                '  \x1b[32mUbicación:\x1b[0m Quito, Ecuador (UTC-5)',
              ].join('\n'),
            },
            'faith.md': {
              type: 'file',
              name: 'faith.md',
              size: 620,
              permissions: '-rw-r--r--',
              updatedAt: 'Aug 14 12:25',
              content: [
                '\x1b[1;33m# Principios y Valores\x1b[0m',
                'Mi trabajo e ingeniería están fundamentados en valores cristianos:',
                'Integridad, excelencia en el servicio, honestidad técnica y mejora continua.',
                '"Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres." - Colosenses 3:23',
              ].join('\n'),
            },
            projects: {
              type: 'dir',
              name: 'projects',
              permissions: 'drwxr-xr-x',
              updatedAt: 'Aug 14 12:30',
              children: {
                'bible_modular.txt': {
                  type: 'file',
                  name: 'bible_modular.txt',
                  size: 512,
                  permissions: '-rw-r--r--',
                  updatedAt: 'Aug 14 12:30',
                  content:
                    'Biblia Modular: Lector minimalista de las Sagradas Escrituras con Next.js, NestJS y SQLite.',
                },
                'software_hub.txt': {
                  type: 'file',
                  name: 'software_hub.txt',
                  size: 580,
                  permissions: '-rw-r--r--',
                  updatedAt: 'Aug 14 12:30',
                  content:
                    'Software Hub: Plataforma de contenidos sobre IA, Ciberseguridad, Noticias, Tutoriales y Foros.',
                },
                'portfolio_ssh.txt': {
                  type: 'file',
                  name: 'portfolio_ssh.txt',
                  size: 490,
                  permissions: '-rw-r--r--',
                  updatedAt: 'Aug 14 12:30',
                  content:
                    'Portfolio SSH: Terminal virtual interactiva en tiempo real sobre WebSockets con Socket.io.',
                },
              },
            },
            docs: {
              type: 'dir',
              name: 'docs',
              permissions: 'drwxr-xr-x',
              updatedAt: 'Aug 14 12:35',
              children: {
                'architecture.md': {
                  type: 'file',
                  name: 'architecture.md',
                  size: 850,
                  permissions: '-rw-r--r--',
                  updatedAt: 'Aug 14 12:35',
                  content:
                    'Monorepo modular con desacoplamiento total en pnpm, NestJS consolidado y Next.js multi-subdominio.',
                },
              },
            },
          },
        },
      },
    },
  };

  /**
   * Resuelve el nodo de directorio según la ruta virtual actual
   */
  private resolveDirectory(cwd: string): {
    dir: VirtualFile | null;
    path: string;
  } {
    let normalized = cwd.trim();
    if (normalized.startsWith('~')) {
      normalized = '/home/jorge' + normalized.slice(1);
    }
    if (!normalized.startsWith('/')) {
      normalized = '/' + normalized;
    }
    const segments = normalized.split('/').filter(Boolean);

    let current: VirtualFile = {
      type: 'dir',
      name: 'root',
      children: this.rootFilesystem,
    };

    for (const segment of segments) {
      if (
        !current.children ||
        !current.children[segment] ||
        current.children[segment].type !== 'dir'
      ) {
        return { dir: null, path: normalized };
      }
      current = current.children[segment];
    }

    return { dir: current, path: normalized };
  }

  /**
   * Ejecuta un comando con soporte de sesión de directorio (cwd)
   */
  executeCommand(
    command: string,
    currentCwd: string = '~',
  ): CommandExecutionResult {
    const rawTrimmed = command.trim();
    if (!rawTrimmed) {
      return { output: '' };
    }

    const parts = rawTrimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'help':
        return {
          output: [
            '\x1b[1;33mComandos Disponibles del Sistema:\x1b[0m',
            '  \x1b[32mhelp\x1b[0m                   Muestra este menú de ayuda interactivo',
            '  \x1b[32mabout\x1b[0m                  Información biográfica y perfil profesional',
            '  \x1b[32mneofetch\x1b[0m               Especificaciones completas del sistema y servidor',
            '  \x1b[32mskills\x1b[0m                 Stack de tecnologías y lenguajes',
            '  \x1b[32mcontact\x1b[0m                Canales oficiales de contacto y redes',
            '  \x1b[32mls [-la]\x1b[0m               Lista archivos y carpetas del directorio actual',
            '  \x1b[32mcd <directorio>\x1b[0m        Cambia el directorio de trabajo actual',
            '  \x1b[32mcat <archivo>\x1b[0m          Muestra el contenido de un archivo de texto',
            '  \x1b[32mpwd\x1b[0m                    Imprime la ruta del directorio de trabajo actual',
            '  \x1b[32mwhoami\x1b[0m                 Muestra el usuario y permisos de la sesión',
            '  \x1b[32mdate\x1b[0m                   Muestra la hora y fecha en huso horario de Quito (UTC-5)',
            '  \x1b[32muptime\x1b[0m                 Tiempo de actividad ininterrumpida del servidor',
            '  \x1b[32mman <comando>\x1b[0m          Abre el manual detallado de un comando',
            '  \x1b[32mecho <texto>\x1b[0m           Imprime texto o variables de entorno ($USER, $HOST)',
            '  \x1b[32mcurl <url>\x1b[0m             Simula una petición HTTP REST',
            '  \x1b[32mgit log\x1b[0m                Historial cronológico de commits e hitos de carrera',
            '  \x1b[32msudo <comando>\x1b[0m         Ejecución de privilegios elevados (simulado)',
            '  \x1b[32mopen <enlace>\x1b[0m          Abre enlaces web (github, linkedin, tiktok, email)',
            '  \x1b[32mmatrix\x1b[0m                 Inicia la animación digital rain de Matrix',
            '  \x1b[32mclear\x1b[0m                  Limpia la pantalla de la consola',
            '  \x1b[32mexit\x1b[0m                   Cierra la sesión SSH simulada',
          ].join('\n'),
        };

      case 'about':
        return {
          output: [
            '\x1b[1;33mJorge Ismael Doicela Molina\x1b[0m',
            '\x1b[90m------------------------------------------------------------\x1b[0m',
            'Desarrollador de Software radicado en \x1b[36mQuito, Ecuador\x1b[0m, guiado por principios y valores cristianos.',
            'Estudiante de \x1b[33mIngeniería en Inteligencia Artificial y Ciberseguridad\x1b[0m en la Universidad Bolivariana del Ecuador (UB).',
            '',
            'Especializado en arquitecturas limpias, desarrollo Full-Stack (Next.js, NestJS, .NET, Laravel),',
            'diseño de APIs REST de alto rendimiento y administración de infraestructura segura (DevSecOps, Docker, AWS).',
          ].join('\n'),
        };

      case 'neofetch':
        return {
          output: [
            '\x1b[1;33m         .---.          \x1b[1;36mdoicela\x1b[0m@\x1b[1;33mvps-1gb-ram\x1b[0m',
            '\x1b[1;33m        /     \\         \x1b[90m-------------------------\x1b[0m',
            '\x1b[1;33m       | () () |        \x1b[1;33mOS:\x1b[0m Arch Linux / Debian GNU/Linux 13 (Trixie)',
            '\x1b[1;33m        \\  _  /         \x1b[1;33mHost:\x1b[0m AWS Lightsail VPS (Quito UTC-5)',
            '\x1b[1;33m         |||||          \x1b[1;33mKernel:\x1b[0m Linux 6.6.15-zen-hardened x86_64',
            '\x1b[1;33m        /     \\         \x1b[1;33mUptime:\x1b[0m ' +
              this.getFormattedUptime(),
            '\x1b[1;33m       / |   | \\        \x1b[1;33mShell:\x1b[0m zsh 5.9 / tmux 3.4',
            '\x1b[1;33m      /  |   |  \\       \x1b[1;33mWM:\x1b[0m Hyprland (Wayland compositor)',
            '\x1b[1;33m     /___|___|___\\      \x1b[1;33mEditor:\x1b[0m Neovim (LazyVim custom config)',
            '\x1b[1;33m                        \x1b[1;33mCPU:\x1b[0m AMD EPYC Processor (1 vCPU)',
            '                        \x1b[1;33mMemory:\x1b[0m 420MB / 1024MB (41% - Optimized)',
            '                        \x1b[1;33mFaith:\x1b[0m \x1b[32mActive (Glory to God)\x1b[0m',
            '                        \x1b[1;33mSecurity:\x1b[0m \x1b[36mDevSecOps & Hardening active\x1b[0m',
            '',
            '\x1b[40m   \x1b[41m   \x1b[42m   \x1b[43m   \x1b[44m   \x1b[45m   \x1b[46m   \x1b[47m   \x1b[0m',
          ].join('\n'),
        };

      case 'skills':
        return {
          output: [
            '\x1b[1;33mStack Tecnológico & Especialidades:\x1b[0m',
            '\x1b[90m------------------------------------------------------------\x1b[0m',
            '  \x1b[34mFrontend:\x1b[0m       React 19, Next.js 16, TypeScript, TailwindCSS v4, Vite',
            '  \x1b[32mBackend:\x1b[0m        NestJS, ASP.NET Core (.NET 9), C#, Laravel, Blade, PHP, Python',
            '  \x1b[36mBases de Datos:\x1b[0m PostgreSQL, MySQL, MongoDB, Redis, SQLite (better-sqlite3)',
            '  \x1b[35mDevSecOps:\x1b[0m      Docker, AWS Lightsail, GitHub Actions CI/CD, Nginx, Cloudflare',
            '  \x1b[33mEntorno:\x1b[0m        Arch Linux, Debian, Neovim, tmux, Hyprland, Sioyek, Figma',
            '  \x1b[31mSeguridad:\x1b[0m      Hardening de servidores, SSL Estricto, Validación de DTOs, OWASP Top 10',
          ].join('\n'),
        };

      case 'contact':
        return {
          output: [
            '\x1b[1;33mCanales Oficiales de Comunicación:\x1b[0m',
            '  \x1b[33m• Correo:\x1b[0m    jorge.doicela.m@gmail.com',
            '  \x1b[34m• LinkedIn:\x1b[0m  https://linkedin.com/in/jorgedoicela',
            '  \x1b[35m• GitHub:\x1b[0m    https://github.com/JorgeDoicela',
            '  \x1b[36m• TikTok:\x1b[0m    https://tiktok.com/@jorge.doicela',
            '  \x1b[32m• Ubicación:\x1b[0m Quito, Ecuador (UTC-5)',
            '',
            '\x1b[90m(Puedes usar "open linkedin" o "open github" para abrirlos directamente)\x1b[0m',
          ].join('\n'),
        };

      case 'pwd':
        return {
          output: currentCwd.startsWith('~')
            ? '/home/jorge' + currentCwd.slice(1)
            : currentCwd,
        };

      case 'whoami':
        return {
          output:
            '\x1b[1;32mjorge\x1b[0m (Jorge Ismael Doicela Molina - Full Stack & DevSecOps Engineer) [uid=1000, gid=1000]',
        };

      case 'date': {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('es-EC', {
          timeZone: 'America/Guayaquil',
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
        }).format(now);
        return { output: formatted };
      }

      case 'uptime':
        return {
          output: `up ${this.getFormattedUptime()}, 1 user, load average: 0.12, 0.08, 0.05 (VPS 1GB RAM)`,
        };

      case 'echo': {
        let text = args.join(' ');
        text = text
          .replace(/\$USER/g, 'jorge')
          .replace(/\$HOST/g, 'vps-1gb-ram')
          .replace(/\$SHELL/g, '/bin/zsh')
          .replace(/\$HOME/g, '/home/jorge')
          .replace(/\$PWD/g, currentCwd);
        return { output: text };
      }

      case 'sudo':
        return {
          output: [
            `[sudo] password for visitor: \x1b[31m**********\x1b[0m`,
            `\x1b[1;31mvisitor is not in the sudoers file.\x1b[0m`,
            `This incident will be reported to Jorge Doicela.`,
          ].join('\n'),
        };

      case 'clear':
        return { output: '', action: 'clear' };

      case 'exit':
        return {
          output:
            '\x1b[33mConnection to vps-1gb-ram.jorgedoicela.com closed by remote host.\x1b[0m',
          action: 'exit',
        };

      case 'matrix':
        return {
          output:
            '\x1b[1;32mIniciando secuencia de flujo Matrix... (Presiona cualquier tecla para salir)\x1b[0m',
          action: 'matrix',
        };

      case 'open': {
        const target = (args[0] || '').toLowerCase();
        if (!target) {
          return {
            output:
              'Uso: open <github|linkedin|tiktok|email|software|bible|portfolio>',
          };
        }
        let url = '';
        if (target.includes('github')) url = 'https://github.com/JorgeDoicela';
        else if (target.includes('linkedin'))
          url = 'https://linkedin.com/in/jorgedoicela';
        else if (target.includes('tiktok'))
          url = 'https://tiktok.com/@jorge.doicela';
        else if (target.includes('email') || target.includes('mail'))
          url = 'mailto:jorge.doicela.m@gmail.com';
        else if (target.includes('software'))
          url = 'https://software.jorgedoicela.com';
        else if (target.includes('bible'))
          url = 'https://bible.jorgedoicela.com';
        else if (target.includes('portfolio'))
          url = 'https://portfolio.jorgedoicela.com';
        else if (target.startsWith('http://') || target.startsWith('https://'))
          url = target;
        else {
          return {
            output: `Destino desconocido: "${target}". Opciones: github, linkedin, tiktok, email, software, bible.`,
          };
        }

        return {
          output: `\x1b[32mRedirigiendo a ${url}...\x1b[0m`,
          action: 'open',
          actionPayload: url,
        };
      }

      case 'curl': {
        const url = args[0] || 'https://jorgedoicela.com/api/info';
        return {
          output: [
            `\x1b[90m> GET ${url} HTTP/1.1\x1b[0m`,
            `\x1b[90m> Host: ${url.replace(/https?:\/\//, '').split('/')[0]}\x1b[0m`,
            `\x1b[90m> User-Agent: curl/8.5.0\x1b[0m`,
            `\x1b[90m< HTTP/1.1 200 OK\x1b[0m`,
            `\x1b[90m< Content-Type: application/json; charset=utf-8\x1b[0m`,
            `\x1b[90m< Server: Nginx (Cloudflare Edge Strict)\x1b[0m`,
            '',
            JSON.stringify(
              {
                status: 'success',
                developer: 'Jorge Doicela',
                location: 'Quito, Ecuador',
                faith: 'Christian',
                specialization: 'DevSecOps & Full Stack',
                vps_ram: '1GB AWS Lightsail',
                uptime: this.getFormattedUptime(),
              },
              null,
              2,
            ),
          ].join('\n'),
        };
      }

      case 'git': {
        if (args[0] === 'log') {
          return {
            output: [
              '\x1b[33mcommit 7f3b8a1c9e4d2a (HEAD -> main, origin/main)\x1b[0m',
              'Author: Jorge Doicela <jorge.doicela.m@gmail.com>',
              'Date:   Wed Aug 14 12:00:00 2024 -0500',
              '',
              '    feat: implement terminal SSH emulated shell with WebSockets & tmux tabs',
              '',
              '\x1b[33mcommit 5a2d8e1f0c4b3a\x1b[0m',
              'Author: Jorge Doicela <jorge.doicela.m@gmail.com>',
              'Date:   Mon Jun 10 18:30:12 2024 -0500',
              '',
              '    feat: complete Software Hub platform & modular Bible reader',
              '',
              '\x1b[33mcommit 3e1f9a2b8c4d5e\x1b[0m',
              'Author: Jorge Doicela <jorge.doicela.m@gmail.com>',
              'Date:   Sun Mar 03 14:15:40 2024 -0500',
              '',
              '    feat: setup AWS Lightsail VPS, Cloudflare SSL Full (Strict) & CI/CD pipeline',
              '',
              '\x1b[33mcommit 1a9b8c7d6e5f4a\x1b[0m',
              'Author: Jorge Doicela <jorge.doicela.m@gmail.com>',
              'Date:   Tue Jan 02 09:00:00 2024 -0500',
              '',
              '    feat: initialize high-cohesion isolated monorepo architecture',
            ].join('\n'),
          };
        }
        return {
          output: 'Uso de git en la terminal virtual: git log',
        };
      }

      case 'man': {
        const topic = (args[0] || '').toLowerCase();
        if (!topic) {
          return {
            output:
              '¿Qué página de manual deseas consultar? Ejemplo: man ls, man cat, man cd',
          };
        }
        return { output: this.getManualPage(topic) };
      }

      case 'ls': {
        const isLong =
          args.includes('-l') || args.includes('-la') || args.includes('-al');
        const isAll =
          args.includes('-a') || args.includes('-la') || args.includes('-al');

        const { dir } = this.resolveDirectory(currentCwd);
        if (!dir || !dir.children) {
          return {
            output:
              '\x1b[31mls: no se puede acceder al directorio actual\x1b[0m',
          };
        }

        const entries = Object.values(dir.children);
        if (isLong) {
          const lines: string[] = [`total ${entries.length * 4}`];
          if (isAll) {
            lines.push(
              `drwxr-xr-x 2 jorge jorge 4096 Aug 14 12:00 \x1b[1;34m.\x1b[0m`,
            );
            lines.push(
              `drwxr-xr-x 3 jorge jorge 4096 Aug 14 12:00 \x1b[1;34m..\x1b[0m`,
            );
          }
          for (const item of entries) {
            const isDir = item.type === 'dir';
            const perm =
              item.permissions || (isDir ? 'drwxr-xr-x' : '-rw-r--r--');
            const size = String(item.size || 4096).padStart(6, ' ');
            const date = item.updatedAt || 'Aug 14 12:00';
            const name = isDir
              ? `\x1b[1;34m${item.name}/\x1b[0m`
              : `\x1b[0m${item.name}\x1b[0m`;
            lines.push(`${perm} 1 jorge jorge ${size} ${date} ${name}`);
          }
          return { output: lines.join('\n') };
        } else {
          const names = entries.map((item) =>
            item.type === 'dir' ? `\x1b[1;34m${item.name}/\x1b[0m` : item.name,
          );
          if (isAll) {
            names.unshift('\x1b[1;34m.\x1b[0m', '\x1b[1;34m..\x1b[0m');
          }
          return { output: names.join('    ') };
        }
      }

      case 'cd': {
        const target = args[0] || '~';
        if (target === '~' || target === '/home/jorge' || target === '') {
          return { output: '', newCwd: '~' };
        }

        if (target === '..') {
          if (currentCwd === '~' || currentCwd === '/home/jorge') {
            return { output: '', newCwd: '/home' };
          }
          if (currentCwd === '/home') {
            return { output: '', newCwd: '/' };
          }
          if (currentCwd === '/') {
            return { output: '', newCwd: '/' };
          }
          const segments = currentCwd.split('/').filter(Boolean);
          segments.pop();
          const newPath = '/' + segments.join('/');
          return { output: '', newCwd: newPath.replace('/home/jorge', '~') };
        }

        let prospectivePath = target.startsWith('/')
          ? target
          : currentCwd === '~'
            ? `/home/jorge/${target}`
            : `${currentCwd}/${target}`;

        prospectivePath = prospectivePath
          .replace(/\/+/g, '/')
          .replace(/\/$/, '');
        const { dir } = this.resolveDirectory(prospectivePath);

        if (!dir || dir.type !== 'dir') {
          return {
            output: `\x1b[31mcd: no existe el directorio o carpeta: ${target}\x1b[0m`,
          };
        }

        const displayPath = prospectivePath.startsWith('/home/jorge')
          ? prospectivePath.replace('/home/jorge', '~')
          : prospectivePath;

        return { output: '', newCwd: displayPath };
      }

      case 'cat': {
        const target = args[0];
        if (!target) {
          return { output: 'Uso: cat <nombre_archivo>' };
        }

        const { dir } = this.resolveDirectory(currentCwd);
        if (!dir || !dir.children || !dir.children[target]) {
          return {
            output: `\x1b[31mcat: ${target}: No existe el archivo en el directorio actual\x1b[0m`,
          };
        }

        const file = dir.children[target];
        if (file.type === 'dir') {
          return {
            output: `\x1b[31mcat: ${target}: Es un directorio (usa 'cd' o 'ls')\x1b[0m`,
          };
        }

        return { output: file.content || '' };
      }

      default:
        return {
          output: `\x1b[31mzsh: comando no encontrado: ${command}\x1b[0m. Escribe \x1b[33mhelp\x1b[0m para ver la lista de comandos disponibles.`,
        };
    }
  }

  /**
   * Generador de autocompletado para la tecla Tab
   */
  getCompletions(currentInput: string, currentCwd: string): string[] {
    const trimmed = currentInput.trimStart();
    const parts = trimmed.split(/\s+/);

    const availableCommands = [
      'help',
      'about',
      'neofetch',
      'skills',
      'contact',
      'ls',
      'cd',
      'cat',
      'pwd',
      'whoami',
      'date',
      'uptime',
      'man',
      'echo',
      'curl',
      'git',
      'sudo',
      'open',
      'matrix',
      'clear',
      'exit',
    ];

    if (parts.length <= 1 && !currentInput.endsWith(' ')) {
      const prefix = parts[0] || '';
      return availableCommands.filter((c) => c.startsWith(prefix));
    }

    const cmd = parts[0].toLowerCase();
    const lastArg = parts[parts.length - 1];

    if (['cat', 'cd', 'ls'].includes(cmd)) {
      const { dir } = this.resolveDirectory(currentCwd);
      if (!dir || !dir.children) return [];

      const entries = Object.keys(dir.children);
      if (cmd === 'cd') {
        return entries.filter(
          (name) =>
            dir.children![name].type === 'dir' && name.startsWith(lastArg),
        );
      }
      return entries.filter((name) => name.startsWith(lastArg));
    }

    if (cmd === 'open') {
      const targets = [
        'github',
        'linkedin',
        'tiktok',
        'email',
        'software',
        'bible',
        'portfolio',
      ];
      return targets.filter((t) => t.startsWith(lastArg));
    }

    if (cmd === 'man') {
      return availableCommands.filter((c) => c.startsWith(lastArg));
    }

    return [];
  }

  private getFormattedUptime(): string {
    const elapsedSeconds =
      Math.floor((Date.now() - this.serverStartTime) / 1000) + 14400; // +4h offset
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    return `${hours} hours, ${minutes} mins`;
  }

  private getManualPage(command: string): string {
    const manuals: Record<string, string> = {
      ls: [
        '\x1b[1mNOMBRE\x1b[0m',
        '    ls - lista los contenidos de un directorio',
        '\x1b[1mSINOPSIS\x1b[0m',
        '    ls [-l] [-a] [-la] [directorio]',
        '\x1b[1mDESCRIPCIÓN\x1b[0m',
        '    Lista información sobre los archivos (en el directorio actual por defecto).',
        '    -a, --all        no oculta entradas que comiencen con .',
        '    -l               usa un formato de listado largo con permisos y tamaños',
      ].join('\n'),
      cat: [
        '\x1b[1mNOMBRE\x1b[0m',
        '    cat - concatena y muestra archivos en la salida estándar',
        '\x1b[1mSINOPSIS\x1b[0m',
        '    cat <archivo>',
        '\x1b[1mEJEMPLO\x1b[0m',
        '    cat README.md',
        '    cat skills.json',
      ].join('\n'),
      cd: [
        '\x1b[1mNOMBRE\x1b[0m',
        '    cd - cambia el directorio de trabajo de la terminal',
        '\x1b[1mSINOPSIS\x1b[0m',
        '    cd [directorio | ~ | ..]',
      ].join('\n'),
      neofetch: [
        '\x1b[1mNOMBRE\x1b[0m',
        '    neofetch - herramienta CLI para desplegar información del sistema',
        '\x1b[1mDESCRIPCIÓN\x1b[0m',
        '    Muestra un resumen estilizado del hardware, sistema operativo, kernel y estado del VPS.',
      ].join('\n'),
      matrix: [
        '\x1b[1mNOMBRE\x1b[0m',
        '    matrix - simulador visual de lluvia digital de código',
        '\x1b[1mDESCRIPCIÓN\x1b[0m',
        '    Inicia una animación de caracteres cayendo en cascada en la terminal. Se desactiva al presionar cualquier tecla.',
      ].join('\n'),
    };

    return (
      manuals[command] ||
      `No hay entrada en el manual para "${command}". Escribe "help" para ver comandos disponibles.`
    );
  }
}
