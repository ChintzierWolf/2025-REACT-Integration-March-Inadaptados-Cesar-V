import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function ProtectedRoute({
  children,
  redirectTo = "/login",
  allowedRoles,
}) {
  const { user, isAuthenticated, loading } = useAuthStore();
  const isAuth = isAuthenticated();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuth) {
    return <Navigate to={redirectTo} />;
  }

  if (allowedRoles) {
    if (!allowedRoles.includes(user?.role)) {
      return (
        <div style={{ textAlign: "center", padding: "48px" }}>
          <h2>Acceso denegado</h2>
          <p>No tienes permisos para acceder a esta página.</p>
        </div>
      );
    }
  }
  return children;
}