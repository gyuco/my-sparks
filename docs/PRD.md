# My Sparks - Documento dei Requisiti Funzionali

## 1. Introduzione

### 1.1 Scopo del Documento

Questo documento descrive i requisiti funzionali per l'applicazione **My Sparks**. L'obiettivo è fornire una chiara comprensione delle funzionalità dell'app, del suo comportamento e delle interazioni con l'utente. Questo documento è destinato a sviluppatori, designer e stakeholder del progetto.

### 1.2 Contesto del Progetto

My Sparks è un'applicazione mobile progettata per aiutare gli utenti a catturare, sviluppare e organizzare le proprie idee (chiamate "Sparks"). L'app si distingue per la sua integrazione con modelli di intelligenza artificiale avanzati, che assistono l'utente nella generazione di contenuti e nello sviluppo delle proprie intuizioni.

### 1.3 Definizioni

- **Spark:** Una singola idea o nota creata dall'utente. Ogni spark è composta da un titolo e un contenuto.
- **Utente:** Una persona che ha registrato un account sull'applicazione.
- **IA:** Intelligenza Artificiale, utilizzata per generare testo e assistere l'utente.
- **OpenRouter:** Il servizio di terze parti che fornisce l'accesso a vari modelli di IA.

## 2. Autenticazione Utente

### 2.1 Registrazione

- **Descrizione:** I nuovi utenti devono potersi registrare per creare un account personale.
- **Requisiti:**
    - L'utente deve fornire un indirizzo email valido e una password.
    - La password deve avere requisiti minimi di sicurezza (es. lunghezza).
    - Il sistema deve verificare che l'email non sia già in uso.
    - Dopo la registrazione, l'utente viene autenticato e reindirizzato alla schermata principale.

### 2.2 Login

- **Descrizione:** Gli utenti registrati devono poter accedere al proprio account.
- **Requisiti:**
    - L'utente deve inserire l'email e la password associate al proprio account.
    - Il sistema deve validare le credenziali.
    - In caso di successo, l'utente viene reindirizzato alla schermata principale.
    - In caso di fallimento, viene mostrato un messaggio di errore chiaro.

### 2.3 Logout

- **Descrizione:** Gli utenti devono poter uscire dal proprio account.
- **Requisiti:**
    - Un pulsante o un'opzione di logout deve essere disponibile all'interno dell'app (es. nella schermata Home o Impostazioni).
    - Una volta effettuato il logout, l'utente viene reindirizzato alla schermata di login.

## 3. Gestione delle Sparks

### 3.1 Creazione di una Nuova Spark

- **Descrizione:** Gli utenti possono creare una nuova spark per salvare un'idea.
- **Requisiti:**
    - L'utente deve poter inserire un **titolo** (massimo 200 caratteri).
    - L'utente deve poter inserire un **contenuto** (massimo 1000 caratteri).
    - Un pulsante "Crea Spark" salva la nuova nota.
    - Dopo la creazione, l'utente viene reindirizzato alla schermata principale, dove la nuova spark è visibile in cima alla lista.

### 3.2 Visualizzazione della Lista di Sparks

- **Descrizione:** La schermata principale (Home) mostra tutte le sparks create dall'utente.
- **Requisiti:**
    - Le sparks sono presentate in un elenco ordinato cronologicamente (dalla più recente alla più vecchia).
    - Ogni elemento della lista mostra:
        - Il titolo della spark.
        - Un'anteprima del contenuto (prime 2-3 righe).
        - La data di creazione.
    - Se non ci sono sparks, viene mostrato un messaggio che invita l'utente a crearne una.
    - L'utente può aggiornare la lista (pull-to-refresh).

### 3.3 Visualizzazione di una Singola Spark

- **Descrizione:** L'utente può visualizzare il contenuto completo di una singola spark.
- **Requisiti:**
    - Toccando una spark dalla lista, l'utente viene reindirizzato a una schermata di dettaglio.
    - La schermata di dettaglio mostra il titolo completo e il contenuto completo della spark.
    - (Futuro) L'utente potrà modificare o eliminare la spark da questa schermata.

## 4. Integrazione con Intelligenza Artificiale

### 4.1 Generazione di Contenuto con IA

- **Descrizione:** L'IA assiste l'utente nella creazione del contenuto di una spark.
- **Requisiti:**
    - Nella schermata di creazione/modifica di una spark, è presente un pulsante "Genera con IA".
    - Per utilizzare la funzione, l'utente deve aver inserito almeno un titolo.
    - Quando l'utente preme il pulsante, il sistema invia una richiesta a un servizio di IA (tramite Appwrite e OpenRouter).
    - Il prompt inviato all'IA è costruito a partire dal titolo della spark.
    - Il testo generato dall'IA viene mostrato in tempo reale (streaming) nel campo del contenuto.

### 4.2 Indicatore di Generazione

- **Descrizione:** L'utente riceve un feedback visivo durante la generazione del testo.
- **Requisiti:**
    - Durante lo streaming del testo, viene mostrato un indicatore visivo (es. un'animazione pulsante).
    - I campi di input e i pulsanti non essenziali vengono disabilitati durante il processo.

### 4.3 Gestione Errori IA

- **Descrizione:** Il sistema gestisce in modo controllato i possibili errori del servizio di IA.
- **Requisiti:**
    - Se la generazione fallisce (es. errore del server, modello non valido), viene mostrato un popup di errore.
    - Il messaggio di errore deve essere chiaro e, se possibile, suggerire una soluzione (es. "Verifica la configurazione del modello nelle impostazioni").
    - L'utente può chiudere il popup e tornare all'editor.

## 5. Impostazioni Utente

### 5.1 Configurazione IA

- **Descrizione:** Gli utenti possono personalizzare le impostazioni del servizio di IA.
- **Requisiti:**
    - Una schermata "Impostazioni" permette di configurare i parametri dell'IA.
    - L'utente può selezionare il **modello di IA** da un elenco predefinito (es. `openai/gpt-4`, `meta-llama/llama-3-70b-instruct`).
    - L'utente può regolare la **temperatura** del modello (un valore che controlla la creatività della risposta).
    - Le impostazioni vengono salvate per l'utente e utilizzate per le future generazioni di testo.

## 6. Interfaccia Utente e User Experience

### 6.1 Navigazione

- **Descrizione:** L'app utilizza una navigazione a tab per un accesso rapido alle sezioni principali.
- **Requisiti:**
    - La barra di navigazione contiene le seguenti sezioni:
        - **Home:** La schermata principale con la lista delle sparks.
        - **Crea Spark (+):** Un pulsante centrale per accedere rapidamente alla schermata di creazione.
        - **Impostazioni:** La schermata per le configurazioni dell'utente.

### 6.2 Design e Stile

- **Descrizione:** L'app ha un'interfaccia moderna, pulita e coerente.
- **Requisiti:**
    - Il design segue una palette di colori definita (tema scuro con accenti ciano/blu).
    - I componenti UI (pulsanti, input, card) hanno uno stile uniforme in tutta l'app.
    - L'app è responsiva e si adatta a diverse dimensioni di schermo.

### 6.3 Feedback Utente

- **Descrizione:** L'app fornisce feedback chiari per le azioni dell'utente.
- **Requisiti:**
    - Vengono utilizzati indicatori di caricamento (loading spinners) durante le operazioni di rete (es. login, caricamento sparks).
    - Vengono mostrati messaggi di conferma o di errore (tramite popup o alert) per le azioni critiche (es. creazione spark, errori di rete).
    - L'uso di feedback aptico (vibrazione) migliora l'esperienza su determinate interazioni (es. pressione di pulsanti importanti).

algo1