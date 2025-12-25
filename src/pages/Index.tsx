import { Navigate } from 'react-router-dom';

// TESTING MODE: Always redirect to dashboard (no auth check)
export default function Index() {
  return <Navigate to="/dashboard/operational" replace />;
}
