interface ProtectedRouteProps {
  children: React.ReactNode;
}

// TESTING MODE: Auth disabled - all routes accessible
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <>{children}</>;
}
