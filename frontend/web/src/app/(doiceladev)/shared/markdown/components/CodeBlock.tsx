'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, Check, Terminal, Code2, FileCode } from 'lucide-react';
import { MermaidBlock } from './MermaidBlock';
import Prism from 'prismjs';

// Gramáticas comunes de Prism
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-nginx';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-ini';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-diff';
import 'prismjs/components/prism-toml';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-protobuf';
import 'prismjs/components/prism-hcl';

export interface CodeBlockProps {
  code: string;
  language?: string;
  meta?: string;
  className?: string;
}

const LANGUAGE_LABELS: Record<string, string> = {
  ts: 'TypeScript',
  typescript: 'TypeScript',
  js: 'JavaScript',
  javascript: 'JavaScript',
  jsx: 'JSX',
  tsx: 'TSX',
  bash: 'Bash',
  sh: 'Bash',
  zsh: 'Shell',
  shell: 'Shell',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  sql: 'SQL',
  nginx: 'Nginx',
  docker: 'Docker',
  dockerfile: 'Dockerfile',
  python: 'Python',
  py: 'Python',
  md: 'Markdown',
  markdown: 'Markdown',
  ini: 'INI Config',
  rs: 'Rust',
  rust: 'Rust',
  go: 'Go',
  golang: 'Go',
  c: 'C',
  cpp: 'C++',
  'c++': 'C++',
  cs: 'C#',
  csharp: 'C#',
  diff: 'Git Diff',
  patch: 'Git Diff',
  toml: 'TOML',
  hcl: 'HCL / Terraform',
  tf: 'Terraform',
  terraform: 'Terraform',
  proto: 'Protobuf',
  protobuf: 'Protobuf',
  gql: 'GraphQL',
  graphql: 'GraphQL',
  text: 'logs / output',
  plaintext: 'logs / output',
  log: 'logs / output',
  logs: 'logs / output',
  output: 'logs / output',
  out: 'logs / output',
  console: 'logs / output',
  terminal: 'logs / output',
  stdout: 'logs / output',
  stderr: 'logs / output',
};

/**
 * Extrae defensivamente un posible nombre de archivo o ruta de la primera línea de código
 */
function extractFilename(code: string): string | null {
  if (!code) return null;
  const firstLine = code.split('\n')[0].trim();
  const match = firstLine.match(/^(?:\/\/|#|\/\*)\s*(?:[A-Za-z0-9_./-]+\/)?([A-Za-z0-9_.-]+\.[A-Za-z0-9]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

/**
 * Determina inteligentemente si un bloque de código debe ofrecer la acción de copiar.
 * Se basa en 3 capas:
 * 1. Meta directivas explícitas en markdown o comentarios mágicos (# output, // no-copy, # copy)
 * 2. Existencia de un archivo de configuración real (ej. 99-hardening.conf, .env, nginx.conf)
 * 3. Inspección semántica de lenguaje y contenido (logs de kernel/firewall, timestamps, trazas vs comandos ejecutables)
 */
function isBlockCopyable({
  code,
  language,
  meta,
  hasFilename,
}: {
  code: string;
  language: string;
  meta?: string;
  hasFilename: boolean;
}): boolean {
  if (!code) return false;

  const normalizedLang = language.toLowerCase().trim();
  const normalizedMeta = (meta || '').toLowerCase().trim();
  const firstLines = code.split('\n').slice(0, 5).map((l) => l.trim());
  const firstLine = firstLines[0] || '';

  // 1. Directivas explícitas en meta de Markdown (ej: ```bash output o ```text no-copy o ```text copy)
  if (
    normalizedMeta.includes('no-copy') ||
    normalizedMeta.includes('nocopy') ||
    normalizedMeta.includes('output') ||
    normalizedMeta.includes('readonly')
  ) {
    return false;
  }
  if (normalizedMeta.includes('copy')) {
    return true;
  }

  // 2. Directivas explícitas en comentarios mágicos en la primera línea
  if (/^(?:\/\/|#|\/\*)\s*(?:no-copy|nocopy|output|readonly)\b/i.test(firstLine)) {
    return false;
  }
  if (/^(?:\/\/|#|\/\*)\s*copy\b/i.test(firstLine)) {
    return true;
  }

  // 3. Si tiene un nombre de archivo válido extraído (ej: 99-hardening.conf, nginx.conf), siempre es copiable
  if (hasFilename) {
    return true;
  }

  // 4. Si el lenguaje es explícitamente de salida o logs (text, plaintext, log, output, console, etc.)
  const isOutputLanguage =
    normalizedLang === 'text' ||
    normalizedLang === 'plaintext' ||
    normalizedLang === 'log' ||
    normalizedLang === 'logs' ||
    normalizedLang === 'output' ||
    normalizedLang === 'out' ||
    normalizedLang === 'console' ||
    normalizedLang === 'terminal' ||
    normalizedLang === 'stdout' ||
    normalizedLang === 'stderr' ||
    !normalizedLang;

  // 5. Patrones exhaustivos de trazas de logs, volcados de diagnóstico, tablas y salidas del sistema
  const outputOrDiagnosticPatterns = [
    // 5.1 Logs de Kernel, Firewall y Auditoría
    /^\[UFW\s+(?:BLOCK|ALLOW|AUDIT|LIMIT)\]/i,                      // Netfilter / UFW logs
    /^kernel:\s*\[/i,                                              // Linux kernel dmesg
    /^(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d+/i,  // Timestamps syslog (/var/log/*)
    /^\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}/,                    // Timestamps ISO estándar
    /^(?:TRACE|DEBUG|INFO|WARN|ERROR|FATAL)\s*[:\]]/i,             // Prefijos estándar de logs

    // 5.2 Salidas de Estado y Comandos de Inspección
    /^Status:\s*(?:active|inactive)\b/i,                           // `ufw status`
    /^(?:PORT|STATE|SERVICE|REASON)\s+(?:STATE|SERVICE)/i,          // `nmap` port scan table
    /^(?:USER|PID|%CPU|%MEM|VSZ|RSS)\s+/i,                          // `ps aux` / `top` table
    /^(?:CONTAINER ID|IMAGE|COMMAND|CREATED|STATUS)\s+/i,          // `docker ps` table
    /^(?:Proto|Recv-Q|Send-Q|Local Address)\s+/i,                   // `netstat` / `ss` table
    /^(?:Filesystem|S\.ficheros)\s+(?:1K-blocks|Size|Used|Tamaño)/i,// `df -h` table

    // 5.3 Salidas de Control de Versiones (Git)
    /^On branch\s+\S+/i,                                           // `git status`
    /^Your branch is\s+/i,                                         // `git status`
    /^nothing to commit\b/i,                                       // `git status`
    /^commit\s+[0-9a-f]{7,40}\b/i,                                 // `git log`
    /^Author:\s+.+<.+>/i,                                          // `git log`

    // 5.4 Salidas de Red y Protocolos
    /^PING\s+\S+\s+\(/i,                                           // `ping`
    /^\d+\s+bytes from\s+/i,                                       // `ping` replies
    /^---\s+\S+\s+ping statistics\s+---/i,                         // `ping` summary
    /^traceroute to\s+\S+/i,                                       // `traceroute`
    /^HTTP\/(?:1\.[01]|2(?:\.0)?)\s+\d{3}\b/i,                     // HTTP response headers
    /^;; (?:QUESTION|ANSWER|AUTHORITY|ADDITIONAL) SECTION:/i,      // `dig` DNS output

    // 5.5 Salidas de Sistemas de Archivos y Listados
    /^total\s+\d+$/i,                                              // `ls -l` header
    /^[-dcbpsl][rwx-]{9}/,                                         // Permisos `ls -l` (drwxr-xr-x...)

    // 5.6 Salidas de Gestores de Paquetes y Test Runners
    /^Reading package lists\.\.\./i,                               // `apt update`
    /^Building dependency tree\.\.\./i,                            // `apt update`
    /^Setting up\s+\S+/i,                                          // `dpkg` / `apt install`
    /^(?:PASS|FAIL)\s+\S+\.(?:spec|test)\b/i,                      // Jest / Vitest test runner
    /^(?:Tests?|Test Suites?):\s+\d+\s+(?:passed|failed)/i,        // Test summary

    // 5.7 Tablas ASCII de Bases de Datos y Estructuras de Árbol
    /^\+[-+]+\+$/,                                                 // Tablas SQL (+-----+-----+)
    /^\([0-9]+\s+rows?\)$/i,                                       // PostgreSQL / MySQL `(5 rows)`
    /^[│├└─\s]*[├──└──]/,                                          // Árboles de directorios (`tree`)
    /^\+={3,}\+/,                                                  // Bordes de tablas Markdown/ASCII

    // 5.8 Excepciones y Trazas de Error
    /^Traceback \(most recent call last\):/i,                      // Python stack trace
    /^Error:\s+\w+/i,                                              // Node.js / JS stack trace
    /^\s+at\s+(?:.+?\s+\()?.+?:\d+:\d+\)?/i,                       // Stack frame (`at Module._compile`)
    /^npm ERR!/i,                                                  // npm error log
    /^panic:\s+/i,                                                 // Go panic
  ];

  const hasOutputOrDiagnosticPattern = firstLines.some((line) =>
    outputOrDiagnosticPatterns.some((pattern) => pattern.test(line))
  );

  if (hasOutputOrDiagnosticPattern) {
    return false;
  }

  // Si fue etiquetado como lenguaje de salida/texto y no tiene comandos ejecutables ni código
  if (isOutputLanguage) {
    // Si contiene comandos bash estándar identificables (ej: sudo, apt, systemctl, etc.)
    const hasExecutableCommands = firstLines.some((line) =>
      /^(?:sudo|systemctl|docker|git|pnpm|npm|npx|apt|apt-get|curl|wget|chmod|chown|mkdir|cat|echo|export|grep|sed|awk)\s+/i.test(
        line.replace(/^[$#]\s*/, '')
      )
    );

    if (hasExecutableCommands) {
      return true;
    }

    // Por defecto, bloques text/plaintext/log sin comandos ni archivo son salidas no copiables
    return false;
  }

  // 6. Lenguajes de programación, scripts y configuración son copiables
  return true;
}

export function CodeBlock({ code, language = 'text', meta }: CodeBlockProps) {
  const t = useTranslations('Markdown');
  const [copied, setCopied] = useState<boolean>(false);

  const cleanCode = code ? code.replace(/\n$/, '') : '';
  const normalizedLang = language.toLowerCase().trim();

  // Si el bloque es Mermaid, delegamos directamente a MermaidBlock
  if (normalizedLang === 'mermaid') {
    return <MermaidBlock chart={cleanCode} />;
  }

  const isBashOrShell =
    normalizedLang === 'bash' ||
    normalizedLang === 'sh' ||
    normalizedLang === 'zsh' ||
    normalizedLang === 'shell';
  const displayLabel = LANGUAGE_LABELS[normalizedLang] || normalizedLang;
  const detectedFilename = extractFilename(cleanCode);

  const copyable = useMemo(
    () =>
      isBlockCopyable({
        code: cleanCode,
        language: normalizedLang,
        meta,
        hasFilename: !!detectedFilename,
      }),
    [cleanCode, normalizedLang, meta, detectedFilename]
  );

  // Resaltado de sintaxis con Prism
  const highlightedHtml = useMemo(() => {
    try {
      const grammar = Prism.languages[normalizedLang] || Prism.languages.javascript || Prism.languages.plain;
      if (grammar) {
        return Prism.highlight(cleanCode, grammar, normalizedLang);
      }
    } catch {
      // Fallback seguro
    }
    return null;
  }, [cleanCode, normalizedLang]);

  const handleCopy = async () => {
    try {
      // Limpiar prefijo de prompt '$ ' si el bloque contiene comandos con prompt
      const textToCopy = isBashOrShell && /^\$\s+/.test(cleanCode)
        ? cleanCode.replace(/^\$\s+/gm, '')
        : cleanCode;

      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="my-6 rounded-2xl bg-[#f6f8fa] dark:bg-[#12161f] border border-black/[0.08] dark:border-white/[0.08] overflow-hidden text-xs font-mono select-text transition-all duration-300">
      {/* Cabecera Inteligente y Localizada: Contexto de Archivo / Terminal / Código */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/[0.025] dark:bg-white/[0.025] border-b border-black/[0.06] dark:border-white/[0.06] select-none">
        <div className="flex items-center gap-2 min-w-0">
          {detectedFilename ? (
            <>
              <FileCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-[12px] font-mono font-semibold text-slate-800 dark:text-zinc-200 truncate">
                {detectedFilename}
              </span>
              <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-zinc-400 uppercase px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 shrink-0">
                {displayLabel}
              </span>
            </>
          ) : !copyable ? (
            <>
              <Terminal className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400 shrink-0" />
              <span className="text-[11px] font-mono font-medium text-slate-700 dark:text-zinc-300">
                {t('terminal')}
              </span>
            </>
          ) : isBashOrShell ? (
            <>
              <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-[11px] font-mono font-semibold text-slate-700 dark:text-zinc-300">
                {displayLabel}
              </span>
            </>
          ) : (
            <>
              <Code2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-[11px] font-mono font-semibold text-slate-700 dark:text-zinc-300">
                {displayLabel}
              </span>
            </>
          )}
        </div>

        {/* Botón Copiar con confirmación: Solo se renderiza en bloques de acción/código */}
        {copyable && (
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded-md text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 shrink-0"
            title={copied ? t('copied') : t('copyCodeAria')}
            aria-label={t('copyCodeAria')}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Cuerpo del código */}
      <pre
        tabIndex={0}
        suppressHydrationWarning
        className="p-4 sm:p-5 overflow-x-auto text-[#1d1d1f] dark:text-[#f0f6fc] leading-relaxed font-mono text-[13px] scrollbar-thin selection:bg-blue-500/20 dark:selection:bg-blue-500/30"
      >
        {highlightedHtml ? (
          <code
            className={`language-${normalizedLang}`}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <code className={`language-${normalizedLang}`}>{cleanCode}</code>
        )}
      </pre>
    </div>
  );
}

/**
 * Componente para código en línea (`inline code`) con calibración sobria y sin bordes
 */
export function InlineCode({ children, className = '', ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={`px-1.5 py-0.5 rounded-md bg-slate-200/55 dark:bg-zinc-800/80 text-slate-800 dark:text-zinc-200 font-mono text-[0.875em] font-medium tracking-tight align-baseline select-text border-0 ${className}`.trim()}
      {...props}
    >
      {children}
    </code>
  );
}
