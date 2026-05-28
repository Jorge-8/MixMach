"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/authService";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: number; email: string; name: string } | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        if (typeof window === "undefined") return false;
        return !!localStorage.getItem("accessToken");
    });

    const [user, setUser] = useState(() => {
        if (typeof window === "undefined") return null;
        const u = localStorage.getItem("user");
        return u ? JSON.parse(u) : null;
    });
    
    useEffect(() => {
        const handleAuthChange = () => {
            setIsAuthenticated(authService.isAuthenticated());
            setUser(authService.getUser());
        };
        window.addEventListener("auth-change", handleAuthChange);
        return () => window.removeEventListener("auth-change", handleAuthChange);
    }, []);
    
    const logout = () => {
        authService.logout();
        window.dispatchEvent(new Event("auth-change"));
        window.location.href = "/login";
    };
    
    return (
        <AuthContext.Provider value={{ isAuthenticated, user, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);