import { Navigate } from 'react-router-dom';

// Root redirect - always go to app dashboard
export default function Index() {
  return <Navigate to="/app/dashboard/operational" replace />;
}