import { PortfolioProject, ProjectSlide } from '../types';

/**
 * Construye de forma determinista las tarjetas (secciones y galería multimedia)
 * que alimentan la pasarela orbital 3D independiente de cada proyecto.
 */
export function buildProjectSlides(project: PortfolioProject): ProjectSlide[] {
  const slides: ProjectSlide[] = [];

  // 01. Visión General del Sistema (siempre presente)
  slides.push({
    id: `${project.slug}-overview`,
    kind: 'overview',
    shortLabelKey: 'slideOverviewShort',
    titleKey: 'modalOverviewTitle',
    role: project.role,
    content: project.overview || project.description,
    summary: project.description,
  });

  // 02. El Desafío Técnico & Restricciones
  if (project.challenge && project.challenge.trim().length > 0) {
    slides.push({
      id: `${project.slug}-challenge`,
      kind: 'challenge',
      shortLabelKey: 'slideChallengeShort',
      titleKey: 'modalChallengeTitle',
      content: project.challenge,
    });
  }

  // 03. Arquitectura & Decisiones de Ingeniería
  if (project.architectureHighlights && project.architectureHighlights.length > 0) {
    slides.push({
      id: `${project.slug}-architecture`,
      kind: 'architecture',
      shortLabelKey: 'slideArchitectureShort',
      titleKey: 'modalArchitectureTitle',
      highlights: project.architectureHighlights,
    });
  }

  // 04. Stack Tecnológico & Telemetría Verificada
  const hasTech = project.technologies && project.technologies.length > 0;
  const hasMetrics = project.metrics && project.metrics.length > 0;
  if (hasTech || hasMetrics) {
    slides.push({
      id: `${project.slug}-stack-telemetry`,
      kind: 'stack-telemetry',
      shortLabelKey: 'slideStackTelemetryShort',
      titleKey: 'modalTechStack',
      technologies: project.technologies ?? [],
      metrics: project.metrics ?? [],
    });
  }

  // 05+. Galería Multimedia (imágenes o videos futuros)
  if (project.media && project.media.length > 0) {
    const totalMedia = project.media.length;
    project.media.forEach((item, index) => {
      slides.push({
        id: `${project.slug}-media-${index}`,
        kind: 'media',
        shortLabelKey: 'slideMediaShort',
        titleKey: 'slideMediaShort',
        media: item,
        mediaIndex: index + 1,
        mediaTotal: totalMedia,
      });
    });
  }

  return slides;
}
