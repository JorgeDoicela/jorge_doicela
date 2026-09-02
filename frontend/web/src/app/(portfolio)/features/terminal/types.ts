export interface TerminalHistoryItem {
  id: string;
  type: 'command' | 'output' | 'system' | 'banner';
  content: string;
  prompt?: string;
  cwd?: string;
  timestamp: number;
}

export interface TerminalPane {
  id: string;
  cwd: string;
  history: TerminalHistoryItem[];
  commandHistory: string[];
  historyIndex: number;
  inputDraft: string;
}

export interface TerminalTab {
  id: string;
  title: string;
  layout: 'single' | 'split-vertical' | 'split-horizontal';
  activePaneId: string;
  panes: TerminalPane[];
  // Campos de compatibilidad directa
  cwd: string;
  history: TerminalHistoryItem[];
  commandHistory: string[];
  historyIndex: number;
  inputDraft: string;
}

export interface TerminalOutputPayload {
  command?: string;
  output: string;
  cwd?: string;
  prompt?: string;
  action?: 'clear' | 'exit' | 'matrix' | 'open' | 'split-v' | 'split-h' | 'close-pane' | 'none';
  actionPayload?: string;
  tabId?: string;
  paneId?: string;
  isBanner?: boolean;
}

export type ConnectionStatus = 'connected' | 'reconnecting' | 'disconnected';
