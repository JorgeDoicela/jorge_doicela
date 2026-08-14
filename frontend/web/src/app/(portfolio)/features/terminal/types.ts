export interface TerminalHistoryItem {
  id: string;
  type: 'command' | 'output' | 'system' | 'banner';
  content: string;
  prompt?: string;
  cwd?: string;
  timestamp: number;
}

export interface TerminalTab {
  id: string;
  title: string;
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
  action?: 'clear' | 'exit' | 'matrix' | 'open' | 'none';
  actionPayload?: string;
  tabId?: string;
  isBanner?: boolean;
}

export type ConnectionStatus = 'connected' | 'reconnecting' | 'disconnected';
