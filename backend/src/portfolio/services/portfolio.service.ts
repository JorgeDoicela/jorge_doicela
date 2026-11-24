import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TerminalProfile } from '../entities/terminal-profile.entity';
import { PortfolioProject } from '../entities/portfolio-project.entity';
import { PortfolioProjectsService } from './portfolio-projects.service';

export type SupportedLocale = 'es' | 'en';

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

const SKILLS_JSON_CONTENT = JSON.stringify(
  {
    developer: 'Jorge Doicela',
    focus: 'Full-Stack & DevSecOps',
    languages: ['TypeScript', 'JavaScript', 'C#', 'PHP', 'Python', 'C', 'C++'],
    frontend: ['React 19', 'Next.js 16', 'TailwindCSS v4', 'Expo'],
    backend: ['NestJS 11', 'ASP.NET Core', 'Laravel', 'Blade', 'Node.js'],
    databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite'],
    cloud_devops: [
      'AWS Lightsail',
      'Docker',
      'GitHub Actions',
      'Cloudflare',
      'Nginx',
      'PM2',
    ],
    systems: ['Arch Linux', 'Debian 13', 'Neovim', 'tmux', 'Hyprland'],
  },
  null,
  2,
);

@Injectable()
export class PortfolioService implements OnModuleInit {
  private readonly logger = new Logger(PortfolioService.name);
  private readonly serverStartTime = Date.now();
  private readonly profileCache = new Map<SupportedLocale, TerminalProfile>();

  constructor(
    @InjectRepository(TerminalProfile, 'portfolioConnection')
    private readonly terminalProfileRepository: Repository<TerminalProfile>,
    private readonly projectsService: PortfolioProjectsService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.loadProfiles();
  }

  private normalizeLang(lang?: string): SupportedLocale {
    return lang === 'en' ? 'en' : 'es';
  }

  private async loadProfiles(): Promise<void> {
    const profiles = await this.terminalProfileRepository.find();
    this.profileCache.clear();
    for (const profile of profiles) {
      const lang = this.normalizeLang(profile.language);
      this.profileCache.set(lang, profile);
    }
    this.logger.log(
      `Perfiles de terminal cargados desde portfolio.sqlite: [${Array.from(this.profileCache.keys()).join(', ')}]`,
    );
  }

  private async getProfile(lang?: string): Promise<TerminalProfile> {
    const normalized = this.normalizeLang(lang);
    let profile = this.profileCache.get(normalized);
    if (!profile) {
      const fromDb = await this.terminalProfileRepository.findOne({
        where: { language: normalized },
      });
      if (fromDb) {
        this.profileCache.set(normalized, fromDb);
        profile = fromDb;
      }
    }
    if (!profile && normalized !== 'es') {
      return this.getProfile('es');
    }
    if (!profile) {
      throw new Error(
        'Perfil de terminal no encontrado en portfolio.sqlite. Ejecuta pnpm --filter backend seed:portfolio.',
      );
    }
    return profile;
  }

  async getWelcomeBanner(lang?: string): Promise<string> {
    const profile = await this.getProfile(lang);
    return profile.banner.join('\n');
  }

  async getRateLimitMessage(lang?: string): Promise<string> {
    const profile = await this.getProfile(lang);
    return profile.messages.rateLimit;
  }

  private buildProjectFiles(
    projects: PortfolioProject[],
    profile: TerminalProfile,
  ): Record<string, VirtualFile> {
    const children: Record<string, VirtualFile> = {};
    for (const project of projects) {
      const filename = `${project.slug}.txt`;
      const lines = [
        `\x1b[1;33m# ${project.title}\x1b[0m`,
        `${profile.messages.roleLabel}: ${project.role}`,
        `${profile.messages.stackLabel}: ${project.technologies.join(', ')}`,
        '',
        project.overview || project.description,
      ];
      if (project.demoUrl) {
        lines.push('', `URL: ${project.demoUrl}`);
      }
      const content = lines.join('\n');
      children[filename] = {
        type: 'file',
        name: filename,
        size: Buffer.byteLength(content, 'utf8'),
        permissions: '-rw-r--r--',
        updatedAt: 'Nov 23 09:00',
        content,
      };
    }
    return children;
  }

  private async buildFilesystem(
    lang: SupportedLocale,
  ): Promise<Record<string, VirtualFile>> {
    const [profile, projects] = await Promise.all([
      this.getProfile(lang),
      this.projectsService.findAll(lang),
    ]);

    const readmeContent = profile.files.readme.join('\n');
    const expContent = profile.files.experience.join('\n');
    const contactContent = profile.files.contactFile.join('\n');
    const faithContent = profile.files.faith.join('\n');
    const archContent = profile.files.architecture.join('\n');

    return {
      home: {
        type: 'dir',
        name: 'home',
        permissions: 'drwxr-xr-x',
        updatedAt: 'Nov 23 09:00',
        children: {
          jorge: {
            type: 'dir',
            name: 'jorge',
            permissions: 'drwxr-xr-x',
            updatedAt: 'Nov 23 09:00',
            children: {
              'README.md': {
                type: 'file',
                name: 'README.md',
                size: Buffer.byteLength(readmeContent, 'utf8'),
                permissions: '-rw-r--r--',
                updatedAt: 'Nov 23 09:00',
                content: readmeContent,
              },
              'skills.json': {
                type: 'file',
                name: 'skills.json',
                size: Buffer.byteLength(SKILLS_JSON_CONTENT, 'utf8'),
                permissions: '-rw-r--r--',
                updatedAt: 'Nov 23 09:00',
                content: SKILLS_JSON_CONTENT,
              },
              'experience.log': {
                type: 'file',
                name: 'experience.log',
                size: Buffer.byteLength(expContent, 'utf8'),
                permissions: '-rw-r--r--',
                updatedAt: 'Nov 23 09:00',
                content: expContent,
              },
              'contact.txt': {
                type: 'file',
                name: 'contact.txt',
                size: Buffer.byteLength(contactContent, 'utf8'),
                permissions: '-rw-r--r--',
                updatedAt: 'Nov 23 09:00',
                content: contactContent,
              },
              'faith.md': {
                type: 'file',
                name: 'faith.md',
                size: Buffer.byteLength(faithContent, 'utf8'),
                permissions: '-rw-r--r--',
                updatedAt: 'Nov 23 09:00',
                content: faithContent,
              },
              '.audit_backup': {
                type: 'file',
                name: '.audit_backup',
                size: 112,
                permissions: '-rw-------',
                updatedAt: 'Nov 24 03:14',
                content:
                  '# VPS 1GB RAM Audit Snapshot\nstatus=hardened\naudit_flag=FLAG{dotfile_recon_1gb_ram}\n',
              },
              logs: {
                type: 'dir',
                name: 'logs',
                permissions: 'drwxr-xr-x',
                updatedAt: 'Nov 24 04:20',
                children: {
                  'mtls_audit.log': {
                    type: 'file',
                    name: 'mtls_audit.log',
                    size: 268,
                    permissions: '-rw-r-----',
                    updatedAt: 'Nov 24 04:20',
                    content: [
                      '[2026-11-24T04:18:02Z] nginx-mtls INFO  origin_pull=verified client_dn=CN=Cloudflare',
                      '[2026-11-24T04:19:11Z] nginx-mtls WARN  direct_ip_probe=dropped src=198.51.100.42',
                      '[2026-11-24T04:20:00Z] nginx-mtls AUDIT token_b64=RkxBR3ttdGxzX2Nsb3VkZmxhcmVfaGFyZGVuaW5nfQ==',
                    ].join('\n'),
                  },
                },
              },
              projects: {
                type: 'dir',
                name: 'projects',
                permissions: 'drwxr-xr-x',
                updatedAt: 'Nov 23 09:00',
                children: this.buildProjectFiles(projects, profile),
              },
              docs: {
                type: 'dir',
                name: 'docs',
                permissions: 'drwxr-xr-x',
                updatedAt: 'Nov 23 09:00',
                children: {
                  'architecture.md': {
                    type: 'file',
                    name: 'architecture.md',
                    size: Buffer.byteLength(archContent, 'utf8'),
                    permissions: '-rw-r--r--',
                    updatedAt: 'Nov 23 09:00',
                    content: archContent,
                  },
                  '.sandbox_seccomp.cfg': {
                    type: 'file',
                    name: '.sandbox_seccomp.cfg',
                    size: 164,
                    permissions: '-rw-------',
                    updatedAt: 'Nov 24 05:00',
                    content: [
                      '# Docker Live Sandbox Hardening Profile',
                      'network_mode=none',
                      'pids_limit=50',
                      'memory_mb=64',
                      'seccomp_hex=464c41477b6367726f7570735f6169726761705f355f6c61796572737d',
                    ].join('\n'),
                  },
                },
              },
            },
          },
        },
      },
    };
  }

  private resolveDirectory(
    rootFilesystem: Record<string, VirtualFile>,
    cwd: string,
  ): { dir: VirtualFile | null; path: string } {
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
      children: rootFilesystem,
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

  async executeCommand(
    command: string,
    currentCwd: string = '~',
    lang?: string,
  ): Promise<CommandExecutionResult> {
    const rawTrimmed = command.trim();
    if (!rawTrimmed) {
      return { output: '' };
    }

    const locale = this.normalizeLang(lang);
    const profile = await this.getProfile(locale);
    const msg = profile.messages;

    const parts = rawTrimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'help':
        return { output: profile.help.join('\n') };

      case 'tmux':
        return { output: profile.tmux.join('\n') };

      case 'about':
        return { output: profile.about.join('\n') };

      case 'skills':
        return { output: profile.skills.join('\n') };

      case 'contact':
        return { output: profile.contact.join('\n') };

      case 'projects': {
        const projects = await this.projectsService.findAll(locale);
        const lines: string[] = [
          msg.projectsHeader,
          '\x1b[90m------------------------------------------------------------\x1b[0m',
        ];
        projects.forEach((project, idx) => {
          const host = project.demoUrl
            ? project.demoUrl.replace(/^https?:\/\//, '')
            : project.slug;
          lines.push(
            `  \x1b[1;33m${idx + 1}. ${project.title}\x1b[0m  \x1b[90m[${host}]\x1b[0m`,
            `     \x1b[33m• ${msg.roleLabel}:\x1b[0m ${project.role}`,
            `     \x1b[33m• ${msg.stackLabel}:\x1b[0m ${project.technologies.join(', ')}`,
            `     \x1b[90m• ${msg.summaryLabel}:\x1b[0m ${project.description}`,
            '',
          );
        });
        lines.push(msg.projectsHint);
        return { output: lines.join('\n') };
      }

      case 'neofetch':
        return {
          output: [
            '\x1b[1;33m         .---.          \x1b[1;33mdoicela\x1b[0m@\x1b[1;33mdebian\x1b[0m',
            '\x1b[90m        /     \\         -------------------------\x1b[0m',
            '\x1b[90m       | () () |        \x1b[1;33mOS:\x1b[0m Debian GNU/Linux 13 (Trixie) x86_64',
            '\x1b[90m        \\  _  /         \x1b[1;33mHost:\x1b[0m AWS Lightsail (Quito UTC-5)',
            '\x1b[90m         |||||          \x1b[1;33mKernel:\x1b[0m Linux 6.6.15-zen-hardened',
            '\x1b[90m        /     \\         \x1b[1;33mUptime:\x1b[0m ' +
              this.getFormattedUptime(),
            '\x1b[90m       / |   | \\        \x1b[1;33mShell:\x1b[0m zsh 5.9 / tmux 3.4',
            '\x1b[90m      /  |   |  \\       \x1b[1;33mWM:\x1b[0m Hyprland (Wayland compositor)',
            '\x1b[90m     /___|___|___\\      \x1b[1;33mEditor:\x1b[0m Neovim (LazyVim custom config)',
            '\x1b[90m                        \x1b[1;33mCPU:\x1b[0m AMD EPYC Processor (1 vCPU)',
            '\x1b[90m                        \x1b[1;33mMemory:\x1b[0m ~170MB / 1024MB (Optimized)',
            '\x1b[90m                        \x1b[1;33mFaith:\x1b[0m \x1b[1;33mActive (Glory to God)\x1b[0m',
            '\x1b[90m                        \x1b[1;33mSecurity:\x1b[0m \x1b[1;33mDevSecOps & Hardening active\x1b[0m',
            '',
            '\x1b[40m   \x1b[41m   \x1b[42m   \x1b[43m   \x1b[44m   \x1b[45m   \x1b[46m   \x1b[47m   \x1b[0m',
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
            '\x1b[1;32mjorge\x1b[0m (Jorge Ismael Doicela Molina - Full Stack & DevSecOps Developer) [uid=1000, gid=1000]',
        };

      case 'date': {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat(
          locale === 'en' ? 'en-US' : 'es-EC',
          {
            timeZone: 'America/Guayaquil',
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
          },
        ).format(now);
        return { output: formatted };
      }

      case 'uptime':
        return {
          output: `up ${this.getFormattedUptime()}, 1 user, load average: 0.12, 0.08, 0.05 (Debian 13)`,
        };

      case 'echo': {
        let text = args.join(' ');
        text = text
          .replace(/\$USER/g, 'jorge')
          .replace(/\$HOST/g, 'debian')
          .replace(/\$SHELL/g, '/bin/zsh')
          .replace(/\$HOME/g, '/home/jorge')
          .replace(/\$PWD/g, currentCwd);
        const esc = String.fromCharCode(27);
        const ansiPattern = esc + '\\[(?![0-9;]*m)[^a-zA-Z]*[a-zA-Z]';
        text = text.replace(new RegExp(ansiPattern, 'g'), '');
        text = Array.from(text)
          .filter((char) => {
            const code = char.charCodeAt(0);
            return (
              code === 9 ||
              code === 10 ||
              code === 13 ||
              (code >= 32 && code !== 127)
            );
          })
          .join('');
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
        return { output: msg.exit, action: 'exit' };

      case 'matrix':
        return { output: msg.matrixStart, action: 'matrix' };

      case 'open': {
        const target = (args[0] || '').toLowerCase();
        if (!target) {
          return { output: msg.openUsage };
        }
        let url = '';
        if (target.includes('github')) url = 'https://github.com/JorgeDoicela';
        else if (target.includes('linkedin'))
          url = 'https://www.linkedin.com/in/jorgedoicela';
        else if (target.includes('tiktok'))
          url = 'https://tiktok.com/@jorge.doicela';
        else if (target.includes('email') || target.includes('mail'))
          url = 'mailto:jorge.doicela.m@gmail.com';
        else if (target.includes('doiceladev'))
          url = 'https://doiceladev.jorgedoicela.com';
        else if (target.includes('kartex'))
          url = 'https://kartex.jorgedoicela.com';
        else if (target.includes('portfolio'))
          url = 'https://portfolio.jorgedoicela.com';
        else if (target.startsWith('http://') || target.startsWith('https://'))
          url = target;
        else {
          return {
            output: msg.openUnknown.replace('{target}', target),
          };
        }

        return {
          output: msg.openRedirect.replace('{url}', url),
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
              'Date:   Mon Nov 23 09:00:00 2026 -0500',
              '',
              '    feat(portfolio): migrate guided terminal to bilingual SQLite corpus',
              '',
              '\x1b[33mcommit 5a2d8e1f0c4b3a\x1b[0m',
              'Author: Jorge Doicela <jorge.doicela.m@gmail.com>',
              'Date:   Mon Jun 10 18:30:12 2025 -0500',
              '',
              '    feat: complete DoicelaDev platform & Kartex research platform',
              '',
              '\x1b[33mcommit 3e1f9a2b8c4d5e\x1b[0m',
              'Author: Jorge Doicela <jorge.doicela.m@gmail.com>',
              'Date:   Sun Mar 03 14:15:40 2025 -0500',
              '',
              '    feat: setup AWS Lightsail VPS, Cloudflare mTLS & CI/CD pipeline',
              '',
              '\x1b[33mcommit 1a9b8c7d6e5f4a\x1b[0m',
              'Author: Jorge Doicela <jorge.doicela.m@gmail.com>',
              'Date:   Tue Jan 02 09:00:00 2025 -0500',
              '',
              '    feat: initialize high-cohesion isolated monorepo architecture',
            ].join('\n'),
          };
        }
        return { output: msg.gitUsage };
      }

      case 'man': {
        const topic = (args[0] || '').toLowerCase();
        if (!topic) {
          return { output: msg.manUsage };
        }
        const entry = profile.manuals[topic];
        return {
          output: entry
            ? entry.join('\n')
            : msg.manNotFound.replace('{topic}', topic),
        };
      }

      case 'ls': {
        const isLong =
          args.includes('-l') || args.includes('-la') || args.includes('-al');
        const isAll =
          args.includes('-a') || args.includes('-la') || args.includes('-al');

        const rootFs = await this.buildFilesystem(locale);
        const { dir } = this.resolveDirectory(rootFs, currentCwd);
        if (!dir || !dir.children) {
          return { output: msg.lsError };
        }

        const entries = Object.values(dir.children).filter(
          (item) => isAll || !item.name.startsWith('.'),
        );
        if (isLong) {
          const lines: string[] = [`total ${entries.length * 4}`];
          if (isAll) {
            lines.push(
              `drwxr-xr-x 2 jorge jorge 4096 Nov 23 09:00 \x1b[1;34m.\x1b[0m`,
            );
            lines.push(
              `drwxr-xr-x 3 jorge jorge 4096 Nov 23 09:00 \x1b[1;34m..\x1b[0m`,
            );
          }
          for (const item of entries) {
            const isDir = item.type === 'dir';
            const perm =
              item.permissions || (isDir ? 'drwxr-xr-x' : '-rw-r--r--');
            const size = String(item.size || 4096).padStart(6, ' ');
            const date = item.updatedAt || 'Nov 23 09:00';
            const name = isDir
              ? `\x1b[1;34m${item.name}/\x1b[0m`
              : `\x1b[0m${item.name}\x1b[0m`;
            lines.push(`${perm} 1 jorge jorge ${size} ${date} ${name}`);
          }
          return { output: lines.join('\n') };
        }

        const names = entries.map((item) =>
          item.type === 'dir' ? `\x1b[1;34m${item.name}/\x1b[0m` : item.name,
        );
        if (isAll) {
          names.unshift('\x1b[1;34m.\x1b[0m', '\x1b[1;34m..\x1b[0m');
        }
        return { output: names.join('    ') };
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
          if (currentCwd === '/home' || currentCwd === '/') {
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
        const rootFs = await this.buildFilesystem(locale);
        const { dir } = this.resolveDirectory(rootFs, prospectivePath);

        if (!dir || dir.type !== 'dir') {
          return {
            output: msg.cdNotFound.replace('{target}', target),
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
          return { output: msg.catUsage };
        }

        const rootFs = await this.buildFilesystem(locale);
        const { dir } = this.resolveDirectory(rootFs, currentCwd);
        if (!dir || !dir.children || !dir.children[target]) {
          return {
            output: msg.catNotFound.replace('{target}', target),
          };
        }

        const file = dir.children[target];
        if (file.type === 'dir') {
          return {
            output: msg.catIsDir.replace('{target}', target),
          };
        }

        return { output: file.content || '' };
      }

      case 'base64': {
        const isDecode = args[0] === '-d' || args[0] === '--decode';
        const payload = isDecode ? args.slice(1).join(' ') : args.join(' ');
        if (!payload) {
          return {
            output:
              locale === 'en'
                ? 'Usage: base64 [-d] <text>'
                : 'Uso: base64 [-d] <texto>',
          };
        }
        try {
          const result = isDecode
            ? Buffer.from(payload, 'base64').toString('utf8')
            : Buffer.from(payload, 'utf8').toString('base64');
          return { output: result };
        } catch {
          return {
            output:
              locale === 'en'
                ? '\x1b[31mbase64: invalid input\x1b[0m'
                : '\x1b[31mbase64: entrada inválida\x1b[0m',
          };
        }
      }

      case 'hex': {
        const isDecode = args[0] === '-d' || args[0] === '--decode';
        const payload = (
          isDecode ? args.slice(1).join('') : args.join(' ')
        ).trim();
        if (!payload) {
          return {
            output:
              locale === 'en'
                ? 'Usage: hex [-d] <hex_or_text>'
                : 'Uso: hex [-d] <hex_o_texto>',
          };
        }
        if (isDecode && !/^[0-9a-fA-F]+$/.test(payload)) {
          return {
            output:
              locale === 'en'
                ? '\x1b[31mhex: invalid hexadecimal string\x1b[0m'
                : '\x1b[31mhex: cadena hexadecimal inválida\x1b[0m',
          };
        }
        const result = isDecode
          ? Buffer.from(payload, 'hex').toString('utf8')
          : Buffer.from(payload, 'utf8').toString('hex');
        return { output: result };
      }

      default:
        return {
          output: msg.cmdNotFound.replace('{command}', command),
        };
    }
  }

  async getCompletions(
    currentInput: string,
    currentCwd: string,
    lang?: string,
  ): Promise<string[]> {
    const trimmed = currentInput.trimStart();
    const parts = trimmed.split(/\s+/);

    const availableCommands = [
      'help',
      'about',
      'projects',
      'skills',
      'contact',
      'neofetch',
      'tmux',
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
      'base64',
      'hex',
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
      const locale = this.normalizeLang(lang);
      const rootFs = await this.buildFilesystem(locale);
      const { dir } = this.resolveDirectory(rootFs, currentCwd);
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
        'doiceladev',
        'kartex',
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
      Math.floor((Date.now() - this.serverStartTime) / 1000) + 14400;
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    return `${hours} hours, ${minutes} mins`;
  }
}
