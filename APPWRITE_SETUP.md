# Configurazione Appwrite

## 1. Crea un progetto Appwrite

1. Vai su [Appwrite Cloud](https://cloud.appwrite.io/) o usa la tua istanza self-hosted
2. Crea un nuovo progetto
3. Annota il **Project ID**

## 2. Configura la piattaforma

Nella dashboard del progetto:

1. Vai su **Settings** → **Platforms**
2. Aggiungi una nuova piattaforma:
   - Per iOS: aggiungi iOS app con il tuo Bundle ID
   - Per Android: aggiungi Android app con il tuo Package Name
   - Per Web: aggiungi Web app con `localhost` o il tuo dominio

## 3. Crea il database

1. Vai su **Databases** nella sidebar
2. Crea un nuovo database e annota il **Database ID**
3. Crea le collezioni necessarie per la tua app

### Esempio di collezione:

**Nome**: `users_data`
**Attributi**:
- `userId` (string, required)
- `name` (string, required)
- `email` (string, required)
- `createdAt` (datetime)

**Permissions**: Configura i permessi appropriati (es. read/write per l'utente autenticato)

## 4. Configura le variabili d'ambiente

1. Copia `.env.example` in `.env`:
   ```bash
   cp .env.example .env
   ```

2. Modifica `.env` con i tuoi valori:
   ```
   EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   EXPO_PUBLIC_APPWRITE_PROJECT_ID=il_tuo_project_id
   EXPO_PUBLIC_APPWRITE_DATABASE_ID=il_tuo_database_id
   ```

3. Aggiorna `lib/appwrite.ts` per usare le variabili d'ambiente:
   ```typescript
   const APPWRITE_ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
   const APPWRITE_PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
   const APPWRITE_DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
   ```

## 5. Utilizzo

### Autenticazione

```typescript
import { authService } from '@/lib/appwrite-service';

// Registrazione
await authService.createAccount('email@example.com', 'password123', 'Nome Utente');

// Login
await authService.login('email@example.com', 'password123');

// Logout
await authService.logout();

// Ottieni utente corrente
const user = await authService.getCurrentUser();
```

### Database

```typescript
import { databaseService } from '@/lib/appwrite-service';

// Crea documento
await databaseService.createDocument('collection_id', {
  name: 'Test',
  value: 123
});

// Lista documenti
const docs = await databaseService.listDocuments('collection_id');

// Aggiorna documento
await databaseService.updateDocument('collection_id', 'document_id', {
  name: 'Updated'
});

// Elimina documento
await databaseService.deleteDocument('collection_id', 'document_id');
```

## Note

- Il polyfill `react-native-url-polyfill` è già configurato in `app/_layout.tsx`
- Assicurati di configurare correttamente i permessi nelle collezioni Appwrite
- Per query avanzate, usa il [Query Builder di Appwrite](https://appwrite.io/docs/products/databases/queries)
