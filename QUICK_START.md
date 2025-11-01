# Quick Start - Integrazione OpenRouter

## Setup Rapido

### 1. Configura la funzione Appwrite

La funzione è già deployata con ID: `690627537550b69d322b`

Vai su Appwrite Console → Functions → langchain-fn → Settings → Variables

Aggiungi:
```
OPENROUTER_API_KEY=sk-or-v1-xxxxx
```

Ottieni la chiave su: https://openrouter.ai/keys

### 2. Verifica il file .env

Il file `.env` è già configurato con:
```
EXPO_PUBLIC_APPWRITE_TEXT_GENERATION_FUNCTION_ID=690627537550b69d322b
```

### 3. Testa l'integrazione

1. Avvia l'app: `npm start`
2. Vai su "Nuova Spark"
3. Inserisci un titolo (es. "Innovazione sostenibile")
4. Clicca "Genera con IA"
5. Attendi qualche secondo
6. Il contenuto verrà generato automaticamente!

## Come funziona

1. **App** → Chiama `aiService.generateText()`
2. **Service** → Usa Appwrite Functions SDK
3. **Function** → Chiama OpenRouter API con LangChain
4. **OpenRouter** → Genera il testo con GPT-3.5-turbo
5. **Response** → Torna all'app e viene mostrato

## Modelli disponibili

Puoi cambiare il modello in `app/create-spark.tsx`:

```typescript
const generatedText = await aiService.generateText(
  prompt,
  'openai/gpt-4', // Cambia qui
  0.7
);
```

Modelli consigliati:
- `openai/gpt-3.5-turbo` - Veloce (default)
- `openai/gpt-4` - Più potente
- `anthropic/claude-3-opus` - Creativo
- `meta-llama/llama-3-70b-instruct` - Open source

## Troubleshooting

### Errore: "API key not configured"
→ Aggiungi `OPENROUTER_API_KEY` nelle variabili della funzione

### Errore: "Function execution failed"
→ Controlla i log della funzione nella console Appwrite

### Il testo non viene generato
→ Verifica di avere crediti su OpenRouter: https://openrouter.ai/credits

## Costi

GPT-3.5-turbo costa circa $0.002 per 1000 token (~750 parole)

Una generazione tipica costa meno di $0.001 (un decimo di centesimo)

Monitora l'uso su: https://openrouter.ai/activity
