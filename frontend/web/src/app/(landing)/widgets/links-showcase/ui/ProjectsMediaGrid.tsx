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
  const [resolvedDomain, setResolvedDomain] = useState({ isLocal: false, protocol: 'https:', port: '' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : '';
      const protocol = window.location.protocol;
      if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
        setResolvedDomain({ isLocal: true, protocol, port });
      }
    }
  }, []);

  const getSubdomainUrl = (subdomain: string) => {
    return resolvedDomain.isLocal
      ? `${resolvedDomain.protocol}//${subdomain}.localhost${resolvedDomain.port}`
      : `https://${subdomain}.jorgedoicela.com`;
  };

  const projects = [
    {
      id: 'bible',
      title: t('project1Badge'),
      icon: BookOpen,
      href: getSubdomainUrl('bible'),
    },
    {
      id: 'portfolio',
      title: t('project2Badge'),
      icon: Terminal,
      href: getSubdomainUrl('portfolio'),
    },
    {
      id: 'software',
      title: t('project3Badge'),
      icon: Cpu,
      href: getSubdomainUrl('software'),
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
              aria-label={`${t('viewLiveProject')}: ${project.title}`}
            >
              {/* Icono central limpio sin fondo */}
              <div className="text-foreground transition-all duration-200 mb-2 group-hover:scale-110">
                <Icon size={28} />
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
