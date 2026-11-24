export { ProjectDetailModal } from './components/ProjectDetailModal';
export { ProjectShowcase } from './components/ProjectShowcase';
export { ProjectSlideCard } from './components/ProjectSlideCard';
export { getPortfolioProjects } from './api/getProjects';
export { useProjects } from './hooks/useProjects';
export { useOrbitalCarousel } from './hooks/useOrbitalCarousel';
export { buildProjectSlides } from './utils/buildProjectSlides';
export type {
  PortfolioProject,
  ProjectMedia,
  ProjectMetric,
  ProjectSlide,
  ProjectSlideKind,
} from './types';
