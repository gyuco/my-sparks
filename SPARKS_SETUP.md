# Configurazione Sparks

## Setup della Collection Sparks in Appwrite

### 1. Crea la Collection

1. Vai alla tua dashboard Appwrite
2. Seleziona il tuo database
3. Crea una nuova collection chiamata "sparks"
4. Copia l'ID della collection

### 2. Configura le Variabili d'Ambiente

Aggiungi l'ID della collection al tuo file `.env`:

```env
EXPO_PUBLIC_APPWRITE_SPARKS_COLLECTION_ID=your_sparks_collection_id_here
```

### 3. Struttura della Tabella Sparks

La collection deve avere i seguenti attributi:

| Campo | Tipo | Dimensione | Required | Indexed |
|-------|------|------------|----------|---------|
| `$id` | string | - | ✓ | ✓ |
| `title` | string | 200 | ✓ | - |
| `content` | string | 1000 | ✓ | - |
| `user_id` | string | 100 | ✓ | - |
| `$createdAt` | datetime | - | auto | - |
| `$updatedAt` | datetime | - | auto | - |

### 4. Permessi

Configura i permessi della collection:

- **Create**: Any authenticated user
- **Read**: User (owner only) - Aggiungi una regola: `user_id` = `$userId`
- **Update**: User (owner only) - Aggiungi una regola: `user_id` = `$userId`
- **Delete**: User (owner only) - Aggiungi una regola: `user_id` = `$userId`

### 5. Funzionalità Implementate

#### Dashboard (`app/(tabs)/index.tsx`)
- ✅ Visualizza tutte le sparks create dall'utente loggato
- ✅ Conteggio delle note
- ✅ Data di creazione formattata (formato italiano)
- ✅ Anteprima del contenuto (max 3 righe)
- ✅ Stato di caricamento
- ✅ Stato vuoto quando non ci sono sparks
- ✅ Pull-to-refresh per aggiornare la lista
- ✅ Navigazione alla schermata di dettaglio al tap sulla card
- ✅ Pulsante "+" per creare nuove sparks

#### Creazione Spark (`app/create-spark.tsx`)
- ✅ Form per creare una nuova spark
- ✅ Campo titolo (max 200 caratteri)
- ✅ Campo contenuto (max 1000 caratteri)
- ✅ Contatore caratteri in tempo reale
- ✅ Validazione dei campi
- ✅ Stato di caricamento durante il salvataggio
- ✅ Ritorno automatico alla dashboard dopo la creazione

#### Dettaglio/Modifica Spark (`app/spark/[id].tsx`)
- ✅ Visualizzazione dettagliata della spark
- ✅ Modalità lettura e modifica
- ✅ Pulsante per attivare la modalità modifica
- ✅ Salvataggio delle modifiche
- ✅ Eliminazione della spark con conferma
- ✅ Validazione dei campi in modifica
- ✅ Contatore caratteri durante la modifica

#### Servizi Appwrite (`lib/appwrite-service.ts`)
- ✅ `createSpark()` - Crea una nuova spark
- ✅ `getSpark()` - Recupera una singola spark
- ✅ `getUserSparks()` - Recupera tutte le sparks dell'utente
- ✅ `updateSpark()` - Aggiorna una spark esistente
- ✅ `deleteSpark()` - Elimina una spark

### 6. Come Usare l'App

1. **Visualizzare le Sparks**: Nella dashboard vedrai tutte le tue sparks ordinate per data di creazione
2. **Creare una Spark**: Tocca il pulsante "+" in basso al centro
3. **Visualizzare una Spark**: Tocca su una card per vedere i dettagli
4. **Modificare una Spark**: Nella schermata di dettaglio, tocca l'icona matita
5. **Eliminare una Spark**: Nella schermata di dettaglio, tocca l'icona cestino
6. **Aggiornare la lista**: Trascina verso il basso nella dashboard per ricaricare
