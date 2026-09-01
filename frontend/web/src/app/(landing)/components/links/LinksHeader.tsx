'use client';

import React from 'react';
import Image from 'next/image';
import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';

function GithubIcon({ size = 26, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ size = 26, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function TiktokIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.28 6.34 6.34 0 0 0 9.34 21.6c3.5 0 6.34-2.84 6.34-6.33V8.86c1.33.95 2.94 1.5 4.68 1.55v-3.48c-.26-.01-.52-.09-.77-.24z" />
    </svg>
  );
}

function YoutubeIcon({ size = 25, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function LinksHeader() {
  const t = useTranslations('Links');

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: LinkedinIcon,
      href: 'https://linkedin.com/in/jorgedoicela',
    },
    {
      name: 'GitHub',
      icon: GithubIcon,
      href: 'https://github.com/JorgeDoicela',
    },
    {
      name: 'TikTok',
      icon: TiktokIcon,
      href: 'https://www.tiktok.com/@jorge.doicela',
    },
    {
      name: 'YouTube',
      icon: YoutubeIcon,
      href: 'https://www.youtube.com/@jorge.doicela',
    },
    {
      name: 'Email',
      icon: Mail,
      href: 'mailto:jorge.doicela.m@gmail.com',
    }
  ];

  return (
    <header className="w-full flex flex-col items-center text-center mb-7">
      {/* Avatar Circular Único y Limpio */}
      <div className="relative mb-4 flex items-center justify-center">
        <Image
          src="/landing/perfil/perfil.webp"
          alt="Jorge Doicela"
          width={160}
          height={160}
          className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full object-cover object-top shadow-xl hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>

      {/* Nombre */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-outfit text-foreground tracking-tight mb-1.5">
        {t('title')}
      </h1>

      {/* Tagline / Subtítulo */}
      <p className="text-sm sm:text-base md:text-lg text-text-muted font-normal max-w-xl leading-relaxed mb-1">
        {t('role')}
      </p>

      {/* Ubicación */}
      <p className="text-xs sm:text-sm text-text-subtitle font-mono flex items-center justify-center gap-1.5 mb-4 tracking-wide">
        <span>Quito, Ecuador</span>
      </p>

      {/* Iconos Sociales en Fila Equilibrada */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 text-text-muted">
        {socialLinks.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-foreground p-2 sm:p-2.5 rounded-xl hover:bg-foreground/5 active:scale-95 transition-all duration-200"
              aria-label={social.name}
              title={social.name}
            >
              <Icon size={22} />
            </a>
          );
        })}
      </div>
    </header>
  );
}
