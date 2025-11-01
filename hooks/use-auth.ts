import { authService } from "@/lib/appwrite-service";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Models } from "react-native-appwrite";

export function useAuth() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    refreshAuth: checkAuth,
  };
}
