import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(
  null
);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(
    null
  );

  useEffect(() => {
    const storedUser = localStorage.getItem(
      'currentUser'
    );

    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = (token: string, user: User) => {
    const normalizedUser = {
      ...user,
      id: user.id || (user as any)._id,
    };
    localStorage.setItem('token', token);

    localStorage.setItem(
      'currentUser',
      JSON.stringify(normalizedUser)
    );

    setUser(normalizedUser);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');

    localStorage.removeItem('currentUser');

    setUser(null);

    setToken(null);
    };
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
};