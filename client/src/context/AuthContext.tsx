import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
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

const INACTIVITY_TIMEOUT =
  1000 * 60 * 30;

// 30 minutes

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(
    null
  );

 const logoutTimer =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
  );

    const resetLogoutTimer = () => {

    if (logoutTimer.current) {
      clearTimeout(
        logoutTimer.current
      );
    }

    logoutTimer.current =
      setTimeout(() => {

        logout();

      }, INACTIVITY_TIMEOUT);
  };

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

    useEffect(() => {

    if (!user) return;

    const events = [
      'mousemove',
      'keydown',
      'click',
      'scroll',
    ];

    const handleActivity = () => {
      resetLogoutTimer();
    };

    events.forEach((event) => {
      window.addEventListener(
        event,
        handleActivity
      );
    });

    resetLogoutTimer();

    return () => {

      events.forEach((event) => {
        window.removeEventListener(
          event,
          handleActivity
        );
      });

      if (logoutTimer.current) {
        clearTimeout(
          logoutTimer.current
        );
      }
    };

  }, [user]);

  const login = (token: string, user: User) => {
    const normalizedUser = {
      ...user,
      id: user.id || (user as any)._id,
    };

    localStorage.setItem('token', token);

  localStorage.setItem(
    'userId',
    normalizedUser.id
  );

  localStorage.setItem(
    'currentUser',
    JSON.stringify(normalizedUser)
  );

    setUser(normalizedUser);
    setToken(token);
    resetLogoutTimer();
  };

  const logout = () => {
  localStorage.removeItem('token');

  localStorage.removeItem('userId');

  localStorage.removeItem('currentUser');

  if (logoutTimer.current) {
    clearTimeout(
      logoutTimer.current
    );
  }

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