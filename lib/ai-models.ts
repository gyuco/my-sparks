// Modelli AI disponibili su OpenRouter
export interface AIModel {
  id: string;
  name: string;
  description: string;
  isFree: boolean;
  provider: string;
}

export const AVAILABLE_MODELS: AIModel[] = [
  // Modelli gratuiti
  {
    id: 'meta-llama/llama-3.2-3b-instruct:free',
    name: 'Llama 3.2 3B (Free)',
    description: 'Modello veloce e gratuito di Meta',
    isFree: true,
    provider: 'Meta',
  },
  {
    id: 'meta-llama/llama-3.2-1b-instruct:free',
    name: 'Llama 3.2 1B (Free)',
    description: 'Modello ultra-veloce e gratuito',
    isFree: true,
    provider: 'Meta',
  },
  {
    id: 'google/gemma-2-9b-it:free',
    name: 'Gemma 2 9B (Free)',
    description: 'Modello gratuito di Google',
    isFree: true,
    provider: 'Google',
  },
  {
    id: 'microsoft/phi-3-mini-128k-instruct:free',
    name: 'Phi-3 Mini (Free)',
    description: 'Modello compatto di Microsoft',
    isFree: true,
    provider: 'Microsoft',
  },
  {
    id: 'qwen/qwen-2-7b-instruct:free',
    name: 'Qwen 2 7B (Free)',
    description: 'Modello gratuito di Alibaba',
    isFree: true,
    provider: 'Alibaba',
  },

  // Modelli a pagamento (più potenti)
  {
    id: 'openai/gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Veloce ed economico',
    isFree: false,
    provider: 'OpenAI',
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Bilanciato tra qualità e costo',
    isFree: false,
    provider: 'OpenAI',
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Veloce e preciso',
    isFree: false,
    provider: 'Anthropic',
  },
  {
    id: 'google/gemini-pro',
    name: 'Gemini Pro',
    description: 'Potente modello di Google',
    isFree: false,
    provider: 'Google',
  },
];

// Filtra solo i modelli gratuiti
export const FREE_MODELS = AVAILABLE_MODELS.filter((m) => m.isFree);

// Filtra solo i modelli a pagamento
export const PAID_MODELS = AVAILABLE_MODELS.filter((m) => !m.isFree);
