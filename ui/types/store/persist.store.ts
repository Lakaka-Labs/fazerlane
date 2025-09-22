interface Token {
  jwt: string;
  refreshToken?: string;
}

interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type Session = Token & { user: User };

export type PersistMainStoreState = {
  user: User;
  token: Token;
  session: Session;
};

export type PersistMainStoreActions = {
  setUser: (user: User) => void;
  setToken: (token: Token) => void;
  setSession: (session: Session) => void;
};
