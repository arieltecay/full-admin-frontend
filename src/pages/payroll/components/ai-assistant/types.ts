export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIAssistantProps {
  messages: ChatMessage[];
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
  isOpen: boolean;
  onToggle: () => void;
}
