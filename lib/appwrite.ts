import { Account, Client, Databases, ID } from "react-native-appwrite";

// Configurazione Appwrite dalle variabili d'ambiente
const APPWRITE_ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "";
const APPWRITE_PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "";
const APPWRITE_DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || "";
const APPWRITE_SPARKS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_SPARKS_COLLECTION_ID || "";

// Inizializza il client Appwrite
const client = new Client();

client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);

// Servizi Appwrite
export const account = new Account(client);
export const databases = new Databases(client);

// Esporta configurazioni
export const appwriteConfig = {
  endpoint: APPWRITE_ENDPOINT,
  projectId: APPWRITE_PROJECT_ID,
  databaseId: APPWRITE_DATABASE_ID,
  sparksCollectionId: APPWRITE_SPARKS_COLLECTION_ID,
};

export { ID };
