import { Injectable } from '@nestjs/common';

@Injectable()
export class PortfolioService {
  executeCommand(command: string): string {
    const trimmed = command.trim().toLowerCase();
    const parts = trimmed.split(' ');
    const cmd = parts[0];

    switch (cmd) {
      case 'help':
        return [
          'Comandos disponibles:',
          '  about       - Sobre mí (quién soy)',
          '  neofetch    - Mostrar información del sistema',
          '  contact     - Canales de contacto profesional',
          '  skills      - Tecnologías y herramientas que domino',
          '  clear       - Limpiar la pantalla de la terminal',
          '  help        - Mostrar esta ayuda',
        ].join('\n');

      case 'about':
        return [
          'Hola, soy Jorge Doicela.',
          'Desarrollador de Software enfocado en el backend con NestJS y frontend con React/Next.js.',
          'Apasionado por la arquitectura limpia, la optimización de recursos y el desarrollo ágil.',
        ].join('\n');

      case 'neofetch':
        return [
          'jorge@vps-1gb-ram',
          '-----------------',
          'OS: Debian GNU/Linux 12 (bookworm)',
          'Kernel: 6.1.0-18-amd64',
          'Uptime: 4 days, 12 hours',
          'Shell: bash 5.2.15',
          'CPU: Intel Xeon (1) @ 2.50GHz',
          'Memory: 412MB / 992MB (41%)',
          'Platform: NestJS Monolith Architecture',
        ].join('\n');

      case 'contact':
        return [
          'Contacto:',
          '  Email:    jorge@doicela.dev',
          '  LinkedIn: linkedin.com/in/jorge-doicela',
          '  GitHub:   github.com/jorge-doicela',
        ].join('\n');

      case 'skills':
        return [
          'Mis Habilidades:',
          '  Backend:  Node.js, TypeScript, NestJS, Express, TypeORM, Prisma, PostgreSQL, SQLite, REST APIs, WebSockets',
          '  Frontend: React, Next.js (FSD), Vite, TailwindCSS, CSS3, HTML5',
          '  DevOps:   Docker, VPS Deployment, Linux (Debian/Ubuntu), Git/GitHub, CI/CD',
        ].join('\n');

      default:
        return `Comando no reconocido: "${command}". Escribe "help" para ver la lista de comandos disponibles.`;
    }
  }
}
