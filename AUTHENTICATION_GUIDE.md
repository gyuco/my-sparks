# Guida all'Autenticazione con Appwrite

## ✅ Implementazione Completata

Il sistema di autenticazione con Appwrite è stato implementato con successo!

## 🎯 Funzionalità Implementate

### 1. Login (`app/login.tsx`)
- Form di login con email e password
- Validazione dei campi
- Gestione errori con Alert
- Loading state durante l'autenticazione
- Navigazione automatica alla home dopo il login

### 2. Registrazione (`app/signup.tsx`)
- Form di registrazione completo (nome, email, password, conferma password)
- Validazione password (minimo 8 caratteri)
- Verifica corrispondenza password
- Login automatico dopo la registrazione
- Navigazione tra login e signup

### 3. Home Protetta (`app/(tabs)/index.tsx`)
- Verifica automatica dell'autenticazione
- Redirect al login se non autenticato
- Visualizzazione informazioni utente
- Pulsante logout funzionante
- Avatar con iniziale del nome

### 4. Hook Personalizzato (`hooks/use-auth.ts`)
- Gestione stato autenticazione
- Verifica utente corrente
- Funzione logout
- Refresh dello stato auth

## 🚀 Come Testare

### 1. Configura Appwrite
Assicurati che il file `.env` contenga le tue credenziali:
```
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=6904f22a00130c4fbde3
EXPO_PUBLIC_APPWRITE_DATABASE_ID=69060d01001426c861c9
```

### 2. Crea un Account di Test
1. Avvia l'app: `npm start`
2. Nella schermata di login, clicca su "Sign up"
3. Compila il form:
   - Nome: Test User
   - Email: test@example.com
   - Password: password123
   - Conferma Password: password123
4. Clicca "Sign Up"

### 3. Testa il Login
1. Dopo la registrazione, verrai automaticamente loggato
2. Prova a fare logout (icona in alto a destra)
3. Effettua nuovamente il login con le credenziali create

## 📱 Flusso Utente

```
┌─────────────┐
│   Login     │ ◄─── Schermata iniziale
└──────┬──────┘
       │
       ├─── Sign Up ──► ┌──────────────┐
       │                │  Registrazione│
       │                └───────┬───────┘
       │                        │
       └────────────────────────┼──► Login automatico
                                │
                                ▼
                        ┌───────────────┐
                        │  Home (Tabs)  │
                        └───────┬───────┘
                                │
                                └──► Logout ──► Login
```

## 🔐 Sicurezza

- Le password sono gestite in modo sicuro da Appwrite
- Le sessioni sono gestite automaticamente
- Il token di autenticazione è memorizzato in modo sicuro
- Redirect automatico al login se la sessione scade

## 🛠️ Servizi Disponibili

### authService (`lib/appwrite-service.ts`)
```typescript
// Registrazione
await authService.createAccount(email, password, name);

// Login
await authService.login(email, password);

// Logout
await authService.logout();

// Ottieni utente corrente
const user = await authService.getCurrentUser();

// Verifica se loggato
const isLoggedIn = await authService.isLoggedIn();
```

### useAuth Hook (`hooks/use-auth.ts`)
```typescript
const { user, isLoading, isAuthenticated, logout, refreshAuth } = useAuth();
```

## 📝 Note

- L'app parte sempre dalla schermata di login (configurato in `app/_layout.tsx`)
- La home verifica automaticamente l'autenticazione all'avvio
- Il polyfill URL è già configurato per il corretto funzionamento di Appwrite
- Gli errori vengono mostrati tramite Alert nativi

## 🎨 UI/UX

- Design coerente tra login e signup
- Feedback visivo durante il caricamento (ActivityIndicator)
- Messaggi di errore chiari e informativi
- Transizioni fluide tra le schermate
- Avatar personalizzato con iniziale del nome utente

## 🔄 Prossimi Passi Suggeriti

1. Implementare il reset password
2. Aggiungere autenticazione OAuth (Google, Apple, etc.)
3. Implementare la verifica email
4. Aggiungere persistenza offline
5. Implementare il refresh automatico del token
