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
          'Jorge Ismael Doicela Molina',
          '---------------------------',
          'Desarrollador de software radicado en Quito, Ecuador, y guiado por valores cristianos.',
          'Estudiante de Ingeniería en Inteligencia Artificial y Ciberseguridad en la Universidad',
          'Bolivariana del Ecuador (UB).',
          '',
          'Me apasiona el desarrollo de sistemas web, aplicaciones nativas y la administración',
          'de servidores locales y cloud, orientados a soluciones robustas, escalables y seguras.',
          'Integro principios de diseño seguro y prácticas de DevSecOps desde el inicio del desarrollo.',
        ].join('\n');

      case 'neofetch':
        return [
          'doicela@shell',
          '-------------',
          'OS: Arch Linux / Debian GNU/Linux 12 (vps)',
          'Host: Quito, Ecuador',
          'Kernel: Linux 6.1-amd64 / Zen (local)',
          'Uptime: 2 hours, 45 mins',
          'Shell: zsh / bash',
          'WM/DE: Hyprland (Wayland)',
          'Terminal: Alacritty / tmux',
          'Editor: Neovim (LazyVim)',
          'CPU: Intel Xeon VPS (1 GB RAM)',
          'Memory: 480MB / 1024MB (46%)',
          'Christian Faith: active (Glory to God)',
          'AI / CyberSec: active studies (Engineering)',
        ].join('\n');

      case 'contact':
        return [
          'Canales de Contacto:',
          '  Email:    jorge.doicela.m@gmail.com',
          '  LinkedIn: linkedin.com/in/jorgedoicela',
          '  GitHub:   github.com/JorgeDoicela',
          '  TikTok:   tiktok.com/@jorge.doicela',
          '  Location: Quito, Ecuador',
        ].join('\n');

      case 'skills':
        return [
          'Stack de Tecnologías y Habilidades:',
          '  Client-Side:  React, Next.js, TypeScript, Vite, TailwindCSS, HTML5/CSS3',
          '  Server-Side:  NestJS, Laravel, Blade, PHP, C#, .NET, Python, C, C++, Node.js',
          '  Data-Stores:  PostgreSQL, MySQL, MongoDB, Redis, SQLite',
          '  DevSecOps:    Docker (Hardening), AWS (Lightsail VPS), GitHub Actions CI/CD',
          '  Environment:  Arch Linux, Debian, Neovim, tmux, Hyprland, Figma, Sioyek PDF',
          '  Methodology:  Clean Architecture, Secure by Design, DevSecOps principles',
        ].join('\n');

      default:
        return `Comando no reconocido: "${command}". Escribe "help" para ver la lista de comandos disponibles.`;
    }
  }
}
