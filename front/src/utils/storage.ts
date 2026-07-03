// storage.ts
import { User } from "../typings";

// Keys for localStorage
const TOKEN_KEY = "dishcovery_token";
const USER_KEY = "dishcovery_user";

// Storage utility object
export const storage = {
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const [, payloadBase64] = token.split(".");
      const payload = JSON.parse(atob(payloadBase64));
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < now) {
        localStorage.removeItem(TOKEN_KEY);
        return null;
      }
      return token;
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser(): User | null {
    const token = this.getToken();
    const data = localStorage.getItem(USER_KEY);
    return token && data ? (JSON.parse(data) as User) : null;
  },

  clearUser(): void {
    localStorage.removeItem(USER_KEY);
  },

  clearAll(): void {
    localStorage.clear();
  },

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  },
};