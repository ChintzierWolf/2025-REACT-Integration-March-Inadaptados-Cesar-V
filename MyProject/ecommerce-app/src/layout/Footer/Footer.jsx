import { Link, useLocation } from "react-router-dom";
import Icon from "../../components/common/Icon/Icon";
import "./Footer.css";

export default function Footer() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <footer className="footer">
      {/* Main Footer */}
      {isHome && (
        <section className="footer-main">
          <div className="container">
            <div className="footer-content">
              {/* Company Info */}
              <div className="footer-section">
                <div className="footer-logo">
                  <Link to="/" className="logo">
                    GamezVazStore.com
                  </Link>
                </div>
                <p className="footer-description">
                  Tu tienda online de confianza. Ofrecemos los mejores productos
                  con la mejor calidad y servicio al cliente excepcional.
                </p>
                <div className="social-links">
                  <h4>Síguenos</h4>
                  <div className="social-icons">
                    <Link to="#" aria-label="Facebook">
                      <Icon name="facebook" size={20} />
                    |</Link>
                    <Link to="#" aria-label="Twitter">
                      <Icon name="twitter" size={20} />
                    </Link>
                    <Link to="#" aria-label="Instagram">
                      <Icon name="instagram" size={20} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="footer-section">
                <h3>Categorías</h3>
                <ul>
                  <li>
                    <Link to={"/category/68b0d4189b825d20ce1e5740"} aria-label="Consolas">
                      Consolas
                    </Link>
                  </li>
                  <li>
                    <Link to={"/category/68b0d4189b825d20ce1e5750"} aria-label="Videojuegos">
                      Videojuegos
                    </Link>
                  </li>
                  <li>
                    <Link to={"/category/68b0d4189b825d20ce1e5760"} aria-label="Accesorios">
                      Accesorios
                    </Link>
                  </li>
                  <li>
                    <Link to={"/category/68b0d4189b825d20ce1e5770"} aria-label="Más">
                      Más
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Customer Service */}
              <div className="footer-section">
                <h3>Atención al Cliente</h3>
                <ul>
                  <li>
                    <Link to="#">Centro de Ayuda</Link>
                  </li>
                  <li>
                    <Link to="#">Cómo Comprar</Link>
                  </li>
                  <li>
                    <Link to="#">Envíos y Devoluciones</Link>
                  </li>
                  <li>
                    <Link to="#">Contacto</Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div className="footer-section">
                <h3>Empresa</h3>
                <ul>
                  <li>
                    <Link to="#">Sobre Nosotros</Link>
                  </li>
                  <li>
                    <Link to="#">Blog</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trust Section */}
      {isHome && (
        <section className="footer-trust">
          <div className="container">
            <div className="trust-content">
              <div className="trust-item">
                <Icon name="shield" size={24} />
                <div>
                  <strong>Seguridad</strong>
                  <span>Protección SSL</span>
                </div>
              </div>
              <div className="trust-item">
                <Icon name="truck" size={24} />
                <div>
                  <strong>Envío</strong>
                  <span>En pedidos +$50</span>
                </div>
              </div>
              <div className="trust-item">
                <Icon name="rotateLeft" size={24} />
                <div>
                  <strong>Garantía</strong>
                  <span>30 Días</span>
                </div>
              </div>
              <div className="trust-item">
                <Icon name="headphones" size={24} />
                <div>
                  <strong>Soporte</strong>
                  <span>24/7</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Payment Methods */}
      {isHome && (
        <section className="footer-payment">
          <div className="container">
            <div className="payment-content">
              <div className="payment-section">
                <h4>Métodos de Pago</h4>
                <div className="payment-icons">
                  <Icon name="visa" size={32} />
                  <Icon name="mastercard" size={32} />
                  <Icon name="paypal" size={32} />
                </div>
              </div>
              <div className="contact-info">
                <h4>Contacto</h4>
                <div className="contact-details">
                  <span>
                    <Icon name="whatsapp" size={16} />
                    01-800-GamezVazStore
                  </span>
                  <span>
                    <Icon name="mail" size={16} />
                    help@GamezVazStore.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer Bottom */}
      <section className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; {new Date().getFullYear()} GamezVazStore.com. Todos los derechos
              reservados.
            </p>
            <nav className="legal-links">
              <Link to="#">Política de Privacidad</Link>
              <Link to="#">Términos y Condiciones</Link>
              <Link to="#">Política de Cookies</Link>
              <Link to="#">Accesibilidad</Link>
            </nav>
          </div>
        </div>
      </section>
    </footer>
  );
}
