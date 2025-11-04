// Interfaccia per le impostazioni AI
export interface AISettings {
  $id?: string;
  user_id: string;
  model: string;
  temperature: number;
  $createdAt?: string;
  $updatedAt?: string;
}

// Modelli AI disponibili
export const AVAILABLE_MODELS = [
  { label: 'GPT-3.5 Turbo', value: 'openai/gpt-3.5-turbo' },
  { label: 'GPT-4', value: 'openai/gpt-4' },
  { label: 'GPT-4 Turbo', value: 'openai/gpt-4-turbo' },
  { label: 'Claude 3 Haiku', value: 'anthropic/claude-3-haiku' },
  { label: 'Claude 3 Sonnet', value: 'anthropic/claude-3-sonnet' },
  { label: 'Claude 3 Opus', value: 'anthropic/claude-3-opus' },
  { label: 'Llama 3 70B', value: 'meta-llama/llama-3-70b-instruct' },
  { label: 'Mistral Large', value: 'mistralai/mistral-large' },
] as const;

// Valori di default
export const DEFAULT_AI_SETTINGS: Omit<AISettings, '$id' | 'user_id' | '$createdAt' | '$updatedAt'> = {
  model: 'openai/gpt-3.5-turbo',
  temperature: 0.7,
};
