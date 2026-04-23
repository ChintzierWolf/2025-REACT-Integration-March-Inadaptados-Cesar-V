import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { updateProfile, changePassword } from "../services/userService";
import Button from "../components/common/Button";
import "./Profile.css"; // Reutilizamos estilos de perfil o creamos específicos

export default function Settings() {
  const { user, setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfile(formData);
      setUser(response.user);
      setMessage({ text: "Perfil actualizado con éxito", type: "success" });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Error al actualizar", type: "error" });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setMessage({ text: "Las contraseñas no coinciden", type: "error" });
    }
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setMessage({ text: "Contraseña cambiada con éxito", type: "success" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Error al cambiar contraseña", type: "error" });
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card" style={{ maxWidth: '600px' }}>
        <h2>Configuración de la cuenta</h2>
        
        {message.text && (
          <div className={`message-alert ${message.type}`}>
            {message.text}
          </div>
        )}

        <section className="settings-section">
          <h3>Editar Perfil</h3>
          <form onSubmit={handleProfileUpdate}>
            <div className="info-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <label>Nombre:</label>
              <input 
                type="text" 
                value={formData.displayName} 
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
              />
            </div>
            <div className="info-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <label>Email:</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
              />
            </div>
            <Button type="submit">Guardar cambios</Button>
          </form>
        </section>

        <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />

        <section className="settings-section">
          <h3>Cambiar Contraseña</h3>
          <form onSubmit={handleChangePassword}>
            <div className="info-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <label>Contraseña actual:</label>
              <input 
                type="password" 
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
              />
            </div>
            <div className="info-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <label>Nueva contraseña:</label>
              <input 
                type="password" 
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
              />
            </div>
            <div className="info-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <label>Confirmar nueva contraseña:</label>
              <input 
                type="password" 
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
              />
            </div>
            <Button type="submit">Actualizar contraseña</Button>
          </form>
        </section>
      </div>
    </div>
  );
}
