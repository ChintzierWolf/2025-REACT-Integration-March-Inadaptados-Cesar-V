import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage/ErrorMessage";
import Input from "../common/Input";
import "./LoginForm.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Fallo en la comunicación de Autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar Sesión</h2>
        <div className="demo-users">
          <h4>Usuarios de prueba BD:</h4>
          <div className="user-demo">
            <strong>Cliente:</strong> demo@test.com / password123
          </div>
          <div className="user-demo">
            <strong>Admin:</strong> admin@test.com / admin123
          </div>
        </div>
        <form className="login-form" onSubmit={onSubmit}>
          <div className="form-group">
            <Input
              id="email"
              label="Email: "
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Ingresa tu email"
              data-testid="login-email"
              required
            />
          </div>
          <div className="form-group">
            <Input
              id="password"
              label="Contraseña: "
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Ingresa tu contraseña"
              data-testid="login-password"
              required
            />
          </div>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button disabled={loading} type="submit" variant="primary" data-testid="login-submit">
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
        <div className="login-footer">
          <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
          <Link to="/">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
