# Deploy Rapido - LangChain OpenRouter Function

## 1. Installa dipendenze
```bash
npm install
```

## 2. Deploy su Appwrite

### Via Console Web
1. Vai su https://cloud.appwrite.io
2. Seleziona il tuo progetto
3. Vai su "Functions" → "Create Function"
4. Configura:
   - **Name**: `langchain-fn`
   - **Runtime**: Node.js 18.x o superiore
   - **Entrypoint**: `src/main.js`
   - **Execute Access**: Any (o configura permessi specifici)

5. Carica il codice:
   - Comprimi la cartella `functions/langchain-fn` in un file ZIP
   - Carica il file ZIP nella sezione "Deployment"

6. Aggiungi variabili d'ambiente:
   - `OPENROUTER_API_KEY`: La tua chiave da https://openrouter.ai/keys
   - `APP_URL`: (opzionale) URL della tua app
   - `APP_NAME`: (opzionale) Nome della tua app

7. Attiva la funzione

### Via CLI Appwrite
```bash
# Dalla root del progetto
appwrite deploy function

# Oppure specifica la funzione
appwrite deploy function --functionId <FUNCTION_ID>
```

## 3. Ottieni l'ID della funzione
Dopo il deploy, copia l'ID della funzione dalla console e aggiornalo nel file `.env`:

```bash
EXPO_PUBLIC_APPWRITE_TEXT_GENERATION_FUNCTION_ID=<IL_TUO_FUNCTION_ID>
```

## 4. Test
```bash
# Test rapido con curl
curl -X POST https://<FUNCTION_ID>.nyc.appwrite.run/ \
  -H "Content-Type: application/json" \
  -H "X-Appwrite-Project: <PROJECT_ID>" \
  -d '{"prompt":"Ciao, come stai?","model":"openai/gpt-3.5-turbo"}'
```

## Note
- Assicurati di avere crediti su OpenRouter
- Il primo deploy può richiedere qualche minuto
- Controlla i log nella console Appwrite in caso di errori
