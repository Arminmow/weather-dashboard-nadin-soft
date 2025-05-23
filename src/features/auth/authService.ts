const USER_KEY = "username";

const AuthService = {
  login(username: string) {

    localStorage.setItem(USER_KEY, username);
  },

  logout() {
    localStorage.removeItem(USER_KEY);
  },

  getUsername(): string | null {
    return localStorage.getItem(USER_KEY);
  },

  isLoggedIn(): boolean {
    return !!localStorage.getItem(USER_KEY);
  },
};

export default AuthService;
