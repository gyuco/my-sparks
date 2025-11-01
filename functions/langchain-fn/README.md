# LangChain OpenRouter Function

Funzione Appwrite che utilizza LangChain per interagire con modelli AI tramite OpenRouter con supporto streaming.

## Setup

1. Installa le dipendenze:
```bash
cd functions/langchain-fn
npm install
```

2. Configura le variabili d'ambiente in Appwrite:
   - `OPENROUTER_API_KEY`: La tua chiave API di OpenRouter
   - `APP_URL`: URL della tua app (opzionale)
   - `APP_NAME`: Nome della tua app (opzionale)

## Utilizzo

### Request

**Endpoint**: POST alla funzione Appwrite

**Body**:
```json
{
  "prompt": "Scrivi una storia breve",
  "model": "openai/gpt-3.5-turbo",
  "temperature": 0.7
}
```

**Parametri**:
- `prompt` (required): Il testo del prompt
- `model` (optional): Il modello da usare (default: "openai/gpt-3.5-turbo")
- `temperature` (optional): Temperatura per la generazione (default: 0.7)

### Response

La funzione restituisce uno stream di eventi Server-Sent Events (SSE):

```
data: {"content":"Testo"}\n\n
data: {"content":" generato"}\n\n
data: {"done":true}\n\n
```

### Modelli Disponibili

Puoi usare qualsiasi modello disponibile su OpenRouter, ad esempio:
- `openai/gpt-3.5-turbo`
- `openai/gpt-4`
- `anthropic/claude-3-opus`
- `meta-llama/llama-3-70b-instruct`
- `google/gemini-pro`

Vedi la lista completa su: https://openrouter.ai/models

## Esempio Client

```javascript
const response = await fetch('YOUR_APPWRITE_FUNCTION_URL', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'Ciao, come stai?',
    model: 'openai/gpt-3.5-turbo',
  }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      if (data.content) {
        console.log(data.content);
      }
      if (data.done) {
        console.log('Stream completato');
      }
    }
  }
}
```
