'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Cpu
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ProjectsMediaGrid() {
  const t = useTranslations('Links');
  const [isLocal, setIsLocal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      setIsLocal(hostname.includes('localhost') || hostname.includes('127.0.0.1'));
    }
  }, []);

  const getSubdomainUrl = (subdomain: string) => {
    return isLocal
      ? `http://${subdomain}.localhost:3001`
      : `https://${subdomain}.jorgedoicela.com`;
  };

  const projects = [
    {
      id: 'bible',
      title: t('project1Badge'),
      icon: BookOpen,
      href: getSubdomainUrl('bible'),
      accentBg: 'group-hover:bg-blue-500/10 group-hover:border-blue-500/30 group-hover:text-blue-400',
    },
    {
      id: 'portfolio',
      title: t('project2Badge'),
      icon: Terminal,
      href: getSubdomainUrl('portfolio'),
      accentBg: 'group-hover:bg-amber-500/10 group-hover:border-amber-500/30 group-hover:text-amber-400',
    },
    {
      id: 'software',
      title: t('project3Badge'),
      icon: Cpu,
      href: getSubdomainUrl('software'),
      accentBg: 'group-hover:bg-purple-500/10 group-hover:border-purple-500/30 group-hover:text-purple-400',
    }
  ];

  return (
    <section className="w-full mb-8">
      {/* Cuadrícula de los 3 Proyectos con Enlaces Directos a Subdominios */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
        {projects.map((project) => {
          const Icon = project.icon;

          return (
            <a
              key={project.id}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square bg-card border border-card-border p-3 flex flex-col items-center justify-center text-center overflow-hidden rounded-xl shadow-sm backdrop-blur-xl transition-all duration-200 hover:scale-105 hover:border-card-hover-border cursor-pointer"
              aria-label={`Visitar ${project.title}`}
            >
              {/* Icono central */}
              <div className={`p-3 rounded-2xl bg-foreground/5 text-foreground transition-all duration-200 mb-2 ${project.accentBg}`}>
                <Icon size={26} />
              </div>

              {/* Título del proyecto */}
              <span className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 leading-tight px-1 font-outfit">
                {project.title}
              </span>

              {/* Overlay interactivo suave */}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/[0.03] transition-colors duration-200" />
            </a>
          );
        })}
      </div>
    </section>
  );
}
