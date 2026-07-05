"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type User = { email: string; name: string };

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

function setAuthCookie(value: "1" | "") {
  if (value) {
    document.cookie = `hs_auth=1; path=/; max-age=${60 * 60 * 72}; SameSite=Lax`;
  } else {
    document.cookie = "hs_auth=; path=/; max-age=0";
  }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("hs_token");
    const storedUser = localStorage.getItem("hs_user");
    if (stored && storedUser) {
      setToken(stored);
      setUser(JSON.parse(storedUser));
      setAuthCookie("1");
    }
    setLoading(false);
  }, []);

  const persist = (tok: string, usr: User) => {
    localStorage.setItem("hs_token", tok);
    localStorage.setItem("hs_user", JSON.stringify(usr));
    setAuthCookie("1");
    setToken(tok);
    setUser(usr);
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail ?? "Login failed");
    }
    const data = await res.json();
    persist(data.token, data.user);
    router.push("/dashboard");
  };

  const signup = async (name: string, email: string, password: string) => {
    const res = await fetch(`${API}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail ?? "Signup failed");
    }
    const data = await res.json();
    persist(data.token, data.user);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("hs_token");
    localStorage.removeItem("hs_user");
    setAuthCookie("");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}