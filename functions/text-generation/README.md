# Text Generation Function

Questa è una Appwrite Function che utilizza Hugging Face per generare testo con il modello Mistral-7B.

## Deploy

Per deployare questa function su Appwrite:

1. Installa la CLI di Appwrite:
   ```bash
   npm install -g appwrite-cli
   ```

2. Login:
   ```bash
   appwrite login
   ```

3. Inizializza il progetto (se non l'hai già fatto):
   ```bash
   appwrite init function
   ```

4. Deploy della function:
   ```bash
   appwrite deploy function
   ```

5. Configura la variabile d'ambiente `HUGGINGFACE_ACCESS_TOKEN` nella console Appwrite:
   - Vai su Functions → text-generation → Settings → Variables
   - Aggiungi `HUGGINGFACE_ACCESS_TOKEN` con il tuo token da Hugging Face

## Utilizzo dalla tua app

Una volta deployata, puoi chiamare la function dalla tua app React Native:

```typescript
import { functions } from '@/lib/appwrite';

const response = await functions.createExecution(
  'text-generation', // Function ID
  JSON.stringify({ 
    prompt: 'Scrivi una storia breve',
    max_new_tokens: 200 
  })
);

const result = JSON.parse(response.responseBody);
console.log(result.completion);
```
