# Setup OpenRouter con LangChain

Questa guida spiega come configurare la funzione OpenRouter per la generazione di testo con IA.

## 1. Preparazione della Funzione

### Installa le dipendenze
```bash
cd functions/langchain-fn
npm install
```

## 2. Deploy su Appwrite

### Opzione A: Deploy da CLI
```bash
appwrite deploy function
```

### Opzione B: Deploy manuale
1. Vai alla console Appwrite
2. Crea una nuova funzione chiamata `langchain-fn`
3. Configura:
   - **Runtime**: Node.js 18+
   - **Entrypoint**: `src/main.js`
   - **Build Commands**: `npm install`

## 3. Configurazione Variabili d'Ambiente

Nella console Appwrite, vai alla tua funzione e aggiungi queste variabili:

### Variabili Richieste
- `OPENROUTER_API_KEY`: La tua chiave API di OpenRouter
  - Ottienila su: https://openrouter.ai/keys

### Variabili Opzionali
- `APP_URL`: URL della tua app (es. `http://localhost:8081`)
- `APP_NAME`: Nome della tua app (es. `Sparks App`)

## 4. Configurazione App

### Aggiorna il file `.env`
```bash
# Copia il file .env.example
cp .env.example .env

# Modifica .env e aggiungi:
EXPO_PUBLIC_APPWRITE_TEXT_GENERATION_FUNCTION_ID=<ID_DELLA_TUA_FUNZIONE>
```

L'ID della funzione lo trovi nella console Appwrite dopo il deploy.

## 5. Test della Funzione

### Test dall'app
1. Avvia l'app: `npm start`
2. Vai su "Nuova Spark"
3. Inserisci un titolo
4. Clicca su "Genera con IA"
5. Dovresti vedere il testo generarsi in tempo reale

### Test manuale con curl
```bash
curl -X POST https://<FUNCTION_ID>.nyc.appwrite.run/ \
  -H "Content-Type: application/json" \
  -H "X-Appwrite-Project: <PROJECT_ID>" \
  -d '{
    "prompt": "Scrivi una storia breve",
    "model": "openai/gpt-3.5-turbo",
    "temperature": 0.7
  }'
```

## 6. Modelli Disponibili

Puoi cambiare il modello nel codice (`app/create-spark.tsx`):

```typescript
const generatedText = await aiService.generateText(
  prompt,
  'openai/gpt-4', // Cambia qui il modello
  0.7,
  (chunk) => setContent((prev) => prev + chunk)
);
```

### Modelli consigliati:
- `openai/gpt-3.5-turbo` - Veloce ed economico
- `openai/gpt-4` - Più potente ma più costoso
- `anthropic/claude-3-opus` - Ottimo per testi creativi
- `meta-llama/llama-3-70b-instruct` - Open source
- `google/gemini-pro` - Buon rapporto qualità/prezzo

Lista completa: https://openrouter.ai/models

## 7. Caratteristiche

### Streaming in Tempo Reale
Il testo viene generato e mostrato progressivamente mentre l'IA lo scrive, offrendo un'esperienza utente fluida.

### Callback per Aggiornamenti
```typescript
await aiService.generateText(
  prompt,
  model,
  temperature,
  (chunk) => {
    // Questo viene chiamato per ogni chunk ricevuto
    console.log('Nuovo chunk:', chunk);
  }
);
```

## 8. Troubleshooting

### Errore: "API key not configured"
- Verifica di aver aggiunto `OPENROUTER_API_KEY` nelle variabili d'ambiente della funzione

### Errore: "HTTP error! status: 404"
- Verifica che l'ID della funzione in `.env` sia corretto
- Assicurati che la funzione sia stata deployata correttamente

### Il testo non si genera
- Controlla i log della funzione nella console Appwrite
- Verifica che la chiave API OpenRouter sia valida
- Controlla di avere crediti sufficienti su OpenRouter

### Lo streaming non funziona
- Assicurati di usare la versione più recente del codice
- Verifica che il browser/app supporti gli stream

## 9. Costi

OpenRouter addebita in base al modello utilizzato:
- GPT-3.5-turbo: ~$0.002 per 1000 token
- GPT-4: ~$0.03 per 1000 token

Monitora l'uso su: https://openrouter.ai/activity

## 10. Prossimi Passi

- Aggiungi selezione del modello nell'UI
- Implementa controllo della temperatura
- Aggiungi cronologia delle generazioni
- Implementa retry automatico in caso di errore
