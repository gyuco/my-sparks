import { account, appwriteConfig, databases, ID } from "./appwrite";

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
      console.error("Errore createAccount:", error);
      throw error;
    }
  },

  // Login
  async login(email: string, password: string) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      return session;
    } catch (error) {
      console.error("Errore login:", error);
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      await account.deleteSession("current");
    } catch (error) {
      console.error("Errore logout:", error);
      throw error;
    }
  },

  // Ottieni utente corrente
  async getCurrentUser() {
    try {
      const currentUser = await account.get();
      return currentUser;
    } catch (error) {
      console.error("Errore getCurrentUser:", error);
      return null;
    }
  },

  // Verifica se l'utente è loggato
  async isLoggedIn() {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
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
    } catch (error) {
      console.error("Errore createDocument:", error);
      throw error;
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
      console.error("Errore getDocument:", error);
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
      console.error("Errore listDocuments:", error);
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
      console.error("Errore updateDocument:", error);
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
      console.error("Errore deleteDocument:", error);
      throw error;
    }
  },
};
