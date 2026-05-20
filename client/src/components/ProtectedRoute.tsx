import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const { user, token } = useAuth();

  if (!token || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

