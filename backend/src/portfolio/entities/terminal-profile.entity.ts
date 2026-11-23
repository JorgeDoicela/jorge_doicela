import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export interface TerminalVirtualFiles {
  readme: string[];
  experience: string[];
  contactFile: string[];
  faith: string[];
  architecture: string[];
}

export interface TerminalMessages {
  rateLimit: string;
  exit: string;
  matrixStart: string;
  openUsage: string;
  openUnknown: string;
  openRedirect: string;
  gitUsage: string;
  manUsage: string;
  manNotFound: string;
  lsError: string;
  cdNotFound: string;
  catUsage: string;
  catNotFound: string;
  catIsDir: string;
  cmdNotFound: string;
  projectsHeader: string;
  projectsHint: string;
  roleLabel: string;
  stackLabel: string;
  summaryLabel: string;
}

@Entity('portfolio_terminal_profiles')
@Index(['language'], { unique: true })
export class TerminalProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  language: string; // 'es' | 'en'

  @Column({ type: 'simple-json' })
  banner: string[];

  @Column({ type: 'simple-json' })
  help: string[];

  @Column({ type: 'simple-json' })
  tmux: string[];

  @Column({ type: 'simple-json' })
  about: string[];

  @Column({ type: 'simple-json' })
  skills: string[];

  @Column({ type: 'simple-json' })
  contact: string[];

  @Column({ type: 'simple-json' })
  files: TerminalVirtualFiles;

  @Column({ type: 'simple-json' })
  manuals: Record<string, string[]>;

  @Column({ type: 'simple-json' })
  messages: TerminalMessages;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
