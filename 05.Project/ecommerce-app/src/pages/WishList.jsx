import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";
import { useWishlist, useToggleWishlist } from "../hooks/useWishlist";
import Button from "../components/common/Button";
import Icon from "../components/common/Icon/Icon";
import Loading from "../components/common/Loading/Loading";
import ErrorMessage from "../components/common/ErrorMessage/ErrorMessage";
import "./WishList.css";

const formatMoney = (value = 0) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);

export default function WishList() {
  const { user, isAuthenticated } = useAuthStore();
  const isAuth = isAuthenticated();
  const addToCart = useCartStore((state) => state.addToCart);
  const navigate = useNavigate();

  const { data: response, isLoading, error: queryError } = useWishlist();
  const { mutateAsync: toggleWishlist } = useToggleWishlist();

  // El backend devuelve { success, data: { products: [{ product: {...}, _id: ... }] } }
  // Aplanamos la lista para que cada objeto sea el producto directamente
  const wishlist = response?.data?.products?.map(item => ({
    ...item.product,
    wishlistItemId: item._id // Guardamos el ID del item de la lista por si se necesita
  })) || [];

  const loading = isAuth && isLoading;

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await toggleWishlist(productId);
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const handleAddAllToCart = async () => {
    const validProducts = wishlist.filter(p => p.stock > 0);
    if (validProducts.length === 0) return;

    try {
      await Promise.all(validProducts.map(p => addToCart(p, 1)));
    } catch (err) {
      console.error("Error adding all to cart:", err);
    }
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <Loading message="Cargando tu lista de deseos..." />
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <div className="wishlist-page wishlist-empty">
        <Icon name="heart" size={64} />
        <h1>Inicia sesión</h1>
        <p>Para ver tu lista de deseos, necesitas iniciar sesión.</p>
        <Link to="/login">
          <Button variant="primary">Iniciar Sesión</Button>
        </Link>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="wishlist-page wishlist-empty">
        <p>{queryError.message || "No se pudo cargar la lista de deseos"}</p>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page wishlist-empty">
        <Icon name="heart" size={64} />
        <h1>Tu lista de deseos está vacía</h1>
        <p>Explora nuestros productos y guarda tus favoritos.</p>
        <Link to="/">
          <Button variant="primary">Explorar Productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <div>
          <p className="eyebrow">Tus favoritos</p>
          <h1>Mi Lista de Deseos</h1>
          <p className="muted">
            {wishlist.length === 1
              ? "1 producto guardado"
              : `${wishlist.length} productos guardados`}
          </p>
        </div>
        {wishlist.length > 0 && (
          <Button
            variant="secondary"
            onClick={handleAddAllToCart}
            disabled={wishlist.every(p => p.stock <= 0)}
          >
            <Icon name="shoppingCart" size={18} />
            Añadir todo al carrito
          </Button>
        )}
      </div>

      <div className="wishlist-grid">
        {wishlist.map((product) => (
          <div key={product._id} className="wishlist-card">
            <Link to={`/product/${product._id}`} className="wishlist-card-image-link">
              <img
                src={product.image || "/img/products/placeholder.svg"}
                alt={product.name}
                className="wishlist-card-image"
                onError={(e) => {
                  e.target.src = "/img/products/placeholder.svg";
                }}
              />
            </Link>
            
            <button
              className="wishlist-card-remove"
              onClick={() => handleRemoveFromWishlist(product._id)}
              title="Eliminar de la lista"
            >
              <Icon name="x" size={16} />
            </button>

            <div className="wishlist-card-content">
              <Link to={`/product/${product._id}`}>
                <h3 className="wishlist-card-title">{product.name}</h3>
              </Link>
              
              {product.category && (
                <p className="wishlist-card-category">
                  {typeof product.category === 'object' 
                    ? product.category.name 
                    : product.category}
                </p>
              )}

              <div className="wishlist-card-price">
                {formatMoney(product.price)}
              </div>

              <div className="wishlist-card-actions">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={product.stock === 0}
                  onClick={() => handleAddToCart(product)}
                >
                  {product.stock > 0 ? "Agregar al carrito" : "Agotado"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  Ver detalles
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
