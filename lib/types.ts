// Interfaccia per le impostazioni AI
export interface AISettings {
  $id?: string;
  user_id: string;
  model: string;
  temperature: number;
  $createdAt?: string;
  $updatedAt?: string;
}

// Valori di default
export const DEFAULT_AI_SETTINGS: Omit<
  AISettings,
  '$id' | 'user_id' | '$createdAt' | '$updatedAt'
> = {
  model: 'z-ai/glm-4.5-air:free',
  temperature: 0.7,
};
