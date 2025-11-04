import { AlertButton, AlertModal } from '@/components/alert-modal';
import React, { createContext, useCallback, useContext, useState } from 'react';

interface AlertOptions {
  title?: string;
  message: string;
  buttons?: AlertButton[];
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState<AlertOptions | null>(null);
  const [visible, setVisible] = useState(false);

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertConfig(options);
    setVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setVisible(false);
    setTimeout(() => setAlertConfig(null), 300);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alertConfig && (
        <AlertModal
          visible={visible}
          title={alertConfig.title}
          message={alertConfig.message}
          buttons={alertConfig.buttons}
          onDismiss={hideAlert}
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert deve essere usato all\'interno di AlertProvider');
  }
  return context;
};

// Funzione helper per compatibilità con Alert.alert
export const alert = (title: string, message?: string, buttons?: AlertButton[]) => {
  // Questa funzione può essere usata solo se AlertProvider è montato
  // Per un uso più sicuro, usa useAlert() nei componenti
  console.warn('Usa useAlert() hook invece di alert() per un comportamento più affidabile');
};
