# Guida Alert Modal

## Panoramica

Questo progetto utilizza un sistema di modal personalizzato per sostituire `Alert.alert` di React Native, che non funziona correttamente in alcuni contesti.

## Componenti

### 1. AlertModal (`components/alert-modal.tsx`)
Componente UI che mostra una modal con titolo, messaggio e pulsanti personalizzabili.

### 2. AlertService (`lib/alert-service.tsx`)
Context provider e hook per gestire gli alert in modo centralizzato.

## Utilizzo

### Setup (già configurato)

Il `AlertProvider` è già configurato in `app/_layout.tsx` e avvolge tutta l'applicazione.

### Mostrare un Alert

```tsx
import { useAlert } from '@/lib/alert-service';

function MyComponent() {
  const { showAlert } = useAlert();

  const handleError = () => {
    showAlert({
      title: 'Errore',
      message: 'Qualcosa è andato storto',
    });
  };

  const handleSuccess = () => {
    showAlert({
      title: 'Successo',
      message: 'Operazione completata!',
    });
  };

  return (
    // ... il tuo componente
  );
}
```

### Alert con Pulsanti Personalizzati

```tsx
showAlert({
  title: 'Conferma',
  message: 'Sei sicuro di voler continuare?',
  buttons: [
    {
      text: 'Annulla',
      style: 'cancel',
      onPress: () => console.log('Annullato'),
    },
    {
      text: 'Elimina',
      style: 'destructive',
      onPress: () => handleDelete(),
    },
  ],
});
```

## Tipi di Pulsanti

- `default`: Pulsante blu standard
- `cancel`: Pulsante grigio per annullare
- `destructive`: Pulsante rosso per azioni distruttive

## Stili

Gli stili della modal sono personalizzabili in `components/alert-modal.tsx`. Il design attuale segue il tema dark dell'app con:
- Overlay semi-trasparente
- Modal con bordi arrotondati
- Colori che seguono la palette dell'app

## Migrazione da Alert.alert

**Prima:**
```tsx
Alert.alert('Errore', 'Messaggio di errore');
```

**Dopo:**
```tsx
const { showAlert } = useAlert();
showAlert({
  title: 'Errore',
  message: 'Messaggio di errore',
});
```

## File Aggiornati

Tutti gli usi di `Alert.alert` sono stati sostituiti nei seguenti file:
- `app/create-spark.tsx`
- `app/(tabs)/settings.tsx`
- `app/spark/[id].tsx`
