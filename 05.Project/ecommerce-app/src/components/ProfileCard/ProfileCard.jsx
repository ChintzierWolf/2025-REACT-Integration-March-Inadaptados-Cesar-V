import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { deactivateAccount } from "../../services/userService";
import Button from "../common/Button";
import "./ProfileCard.css";

const ROLE_COLORS = {
  admin: "#2563eb",
  customer: "#22c55e",
};

export default function ProfileCard({ user }) {
  const storeUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  
  const currentUser = user || storeUser;
  const role = currentUser.role || "guest";

  const handleDeleteAccount = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      try {
        await deactivateAccount();
        alert("Cuenta eliminada con éxito.");
        logout();
        navigate("/");
      } catch (error) {
        alert("Error al eliminar la cuenta.");
      }
    }
  };

  const ROLE_ACTIONS = {
    admin: [
      { label: "Editar Perfil", action: () => navigate("/settings") },
      { label: "Cambiar contraseña", action: () => navigate("/settings") },
      { label: "Ver todos los pedidos", action: () => navigate("/orders") },
      { label: "Eliminar cuenta", action: handleDeleteAccount },
    ],
    customer: [
      { label: "Editar Perfil", action: () => navigate("/settings") },
      { label: "Cambiar contraseña", action: () => navigate("/settings") },
      { label: "Ver mis pedidos", action: () => navigate("/orders") },
      { label: "Eliminar cuenta", action: handleDeleteAccount },
    ],
  };

  const actions = ROLE_ACTIONS[role] || [];

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={currentUser.avatar || "/img/user-placeholder.png"}
            alt={
              currentUser.displayName || currentUser.name || currentUser.email
            }
            className="profile-avatar"
          />
          <div className="profile-names">
            <h2>
              {currentUser.displayName || currentUser.name || currentUser.email}
            </h2>
            <span
              className="profile-role-badge"
              style={{ background: ROLE_COLORS[role] }}
            >
              {role}
            </span>
          </div>
        </div>
        <div className="profile-info">
          <div className="info-item">
            <label>Email:</label>
            <span>{currentUser.email || "No disponible"}</span>
          </div>
          <div className="info-item">
            <label>Nombre:</label>
            <span>
              {currentUser.displayName || currentUser.name || "No disponible"}
            </span>
          </div>
          <div className="info-item">
            <label>Estado:</label>
            <span>{currentUser.isActive ? "Activo" : "Inactivo"}</span>
          </div>
          <div className="info-item">
            <label>Última conexión:</label>
            <span>
              {currentUser.loginDate
                ? new Date(currentUser.loginDate).toLocaleString()
                : "No disponible"}
            </span>
          </div>
        </div>
        <div className="profile-actions">
          <h3>Acciones de la cuenta</h3>
          {actions.map((action, idx) => (
            <Button key={idx} type="button" onClick={action.action}>
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
