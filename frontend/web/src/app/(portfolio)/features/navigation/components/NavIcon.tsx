import React from 'react';
import {
  User,
  FolderGit2,
  Layers,
  Briefcase,
  Cloud,
  Wrench,
  Compass,
  Terminal,
  Mail,
} from 'lucide-react';
import type { PortfolioNavIconName } from '../types';

interface NavIconProps {
  name: PortfolioNavIconName;
  className?: string;
}

const ICON_MAP: Record<PortfolioNavIconName, React.ComponentType<{ className?: string }>> = {
  user: User,
  projects: FolderGit2,
  stack: Layers,
  experience: Briefcase,
  cloud: Cloud,
  tools: Wrench,
  philosophy: Compass,
  terminal: Terminal,
  contact: Mail,
};

export function NavIcon({ name, className }: NavIconProps) {
  const Icon = ICON_MAP[name];
  return <Icon className={className} aria-hidden="true" />;
}
