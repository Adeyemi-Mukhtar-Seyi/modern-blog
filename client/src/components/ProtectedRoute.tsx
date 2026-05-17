import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const token = localStorage.getItem('token');

  const currentUser = JSON.parse(
    localStorage.getItem('currentUser') || 'null'
  );

  if (!token || currentUser?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;