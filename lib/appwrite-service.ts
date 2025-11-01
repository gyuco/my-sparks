import { account, appwriteConfig, databases, functions, ID } from './appwrite';

// Servizi di autenticazione
export const authService = {
  // Registrazione utente
  async createAccount(email: string, password: string, name: string) {
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (!newAccount) throw new Error("Errore nella creazione dell'account");

      // Login automatico dopo la registrazione
      await this.login(email, password);

      return newAccount;
    } catch (error) {
      console.error('Errore createAccount:', error);
      throw error;
    }
  },

  // Login
  async login(email: string, password: string) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      return session;
    } catch (error) {
      console.error('Errore login:', error);
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Errore logout:', error);
      throw error;
    }
  },

  // Ottieni utente corrente
  async getCurrentUser() {
    try {
      const currentUser = await account.get();
      return currentUser;
    } catch (error) {
      console.error('Errore getCurrentUser:', error);
      return null;
    }
  },

  // Verifica se l'utente è loggato
  async isLoggedIn() {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch {
      return false;
    }
  },
};

// Servizi database
export const databaseService = {
  // Crea un documento
  async createDocument(
    collectionId: string,
    data: Record<string, any>,
    documentId?: string
  ) {
    try {
      const response = await databases.createDocument(
        appwriteConfig.databaseId,
        collectionId,
        documentId || ID.unique(),
        data
      );
      return response;
    } catch (err) {
      console.error('Errore createDocument:', err);
      throw err;
    }
  },

  // Ottieni un documento
  async getDocument(collectionId: string, documentId: string) {
    try {
      const response = await databases.getDocument(
        appwriteConfig.databaseId,
        collectionId,
        documentId
      );
      return response;
    } catch (error) {
      console.error('Errore getDocument:', error);
      throw error;
    }
  },

  // Lista documenti
  async listDocuments(collectionId: string, queries?: string[]) {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        collectionId,
        queries
      );
      return response;
    } catch (error) {
      console.error('Errore listDocuments:', error);
      throw error;
    }
  },

  // Aggiorna documento
  async updateDocument(
    collectionId: string,
    documentId: string,
    data: Record<string, any>
  ) {
    try {
      const response = await databases.updateDocument(
        appwriteConfig.databaseId,
        collectionId,
        documentId,
        data
      );
      return response;
    } catch (error) {
      console.error('Errore updateDocument:', error);
      throw error;
    }
  },

  // Elimina documento
  async deleteDocument(collectionId: string, documentId: string) {
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        collectionId,
        documentId
      );
    } catch (error) {
      console.error('Errore deleteDocument:', error);
      throw error;
    }
  },
};

// Servizi per le Sparks
export const sparksService = {
  // Crea una nuova spark
  async createSpark(title: string, content: string, userId: string) {
    try {
      const response = await databaseService.createDocument(
        appwriteConfig.sparksCollectionId,
        {
          title,
          content,
          user_id: userId,
        }
      );
      return response;
    } catch (error) {
      console.error('Errore createSpark:', error);
      throw error;
    }
  },

  // Ottieni una singola spark
  async getSpark(sparkId: string) {
    try {
      const response = await databaseService.getDocument(
        appwriteConfig.sparksCollectionId,
        sparkId
      );
      return response;
    } catch (error) {
      console.error('Errore getSpark:', error);
      throw error;
    }
  },

  // Ottieni tutte le sparks dell'utente
  async getUserSparks(userId: string) {
    try {
      const { Query } = await import('react-native-appwrite');
      const response = await databaseService.listDocuments(
        appwriteConfig.sparksCollectionId,
        [Query.equal('user_id', userId), Query.orderDesc('$createdAt')]
      );
      return response.documents;
    } catch (error) {
      console.error('Errore getUserSparks:', error);
      throw error;
    }
  },

  // Aggiorna una spark
  async updateSpark(sparkId: string, title: string, content: string) {
    try {
      const response = await databaseService.updateDocument(
        appwriteConfig.sparksCollectionId,
        sparkId,
        {
          title,
          content,
        }
      );
      return response;
    } catch (error) {
      console.error('Errore updateSpark:', error);
      throw error;
    }
  },

  // Elimina una spark
  async deleteSpark(sparkId: string) {
    try {
      await databaseService.deleteDocument(
        appwriteConfig.sparksCollectionId,
        sparkId
      );
    } catch (error) {
      console.error('Errore deleteSpark:', error);
      throw error;
    }
  },
};

// Servizi per l'IA
export const aiService = {
  // Genera testo con IA usando OpenRouter
  async generateText(
    prompt: string,
    model: string = 'openai/gpt-3.5-turbo',
    temperature: number = 0.7
  ) {
    try {
      const body = JSON.stringify({
        prompt,
        model,
        temperature,
      });

      console.log('Chiamata funzione OpenRouter:', {
        functionId: appwriteConfig.textGenerationFunctionId,
        model,
        temperature,
      });

      // Usa l'SDK di Appwrite per chiamare la funzione
      const execution = await functions.createExecution(
        appwriteConfig.textGenerationFunctionId,
        body,
        false // async = false per ottenere la risposta sincrona
      );

      console.log('Execution status:', execution.responseStatusCode);

      if (execution.responseStatusCode !== 200) {
        throw new Error(
          `Function execution failed: ${execution.responseStatusCode}`
        );
      }

      // Parse della risposta
      const responseBody = execution.responseBody;
      console.log('Response body:', responseBody);

      // Parse JSON response
      const parsed = JSON.parse(responseBody);

      if (!parsed.ok) {
        throw new Error(parsed.error || 'Errore nella generazione del testo');
      }

      return parsed.content;
    } catch (error: any) {
      console.error('Errore generateText:', {
        message: error.message,
        functionId: appwriteConfig.textGenerationFunctionId,
      });
      throw error;
    }
  },
};
