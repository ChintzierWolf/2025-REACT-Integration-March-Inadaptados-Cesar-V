import React, { memo } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../../stores/cartStore";
import { useAuthStore } from "../../stores/authStore";
import Badge from "../common/Badge";
import Button from "../common/Button";
import Icon from "../common/Icon/Icon";
import { useToggleWishlist } from "../../hooks/useWishlist";
import "./ProductCard.css";

const ProductCard = memo(({ product, orientation = "vertical" }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { mutateAsync: toggleWishlist, isLoading: isToggling } = useToggleWishlist();
  const { name, price, stock, image, description } = product || {};

  if (!product) {
    return (
      <div
        className="product-card"
        style={{ padding: "24px", textAlign: "center" }}
      >
        <p className="muted">Producto no disponible</p>
      </div>
    );
  }

  const stockBadge =
    stock > 0
      ? { text: "En stock", variant: "success" }
      : { text: "Agotado", variant: "error" };
  const hasDiscount = product.discount && product.discount > 0;
  const handleAddToCart = () => addToCart(product, 1);
  const productLink = `/product/${product._id}`;
  const cardClass = `product-card product-card--${orientation}`;

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      alert("Inicia sesión para agregar a tu lista de deseos");
      return;
    }
    
    try {
      await toggleWishlist(product._id);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  return (
    <div className={cardClass}>
      <Link to={productLink} className="product-card-image-link">
        <img
          src={image || "/img/products/placeholder.svg"}
          alt={name}
          className="product-card-image"
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.target.src = "/img/products/placeholder.svg";
          }}
        />
      </Link>
      <button
        className="product-card-wishlist-btn"
        onClick={handleToggleWishlist}
        disabled={isToggling}
        title={isAuthenticated() ? "Agregar a favoritos" : "Inicia sesión para guardar en favoritos"}
      >
        <Icon 
          name={product.isInWishlist ? "heart" : "heart"} 
          size={20} 
          className={product.isInWishlist ? "wishlist-active" : ""}
        />
      </button>
      <div className="product-card-content">
        <h3 className="product-card-title">
          <Link
            to={productLink}
            style={{ color: "inherit", textDecoration: "none" }}
            data-testid={`product-link-${product._id}`}
          >
            {name}
          </Link>
        </h3>
        {description && (
          <p
            className="muted"
            style={{ fontSize: "13px", marginBottom: "8px" }}
          >
            {description.length > 60
              ? `${description.substring(0, 60)}...`
              : description}
          </p>
        )}
        <div className="product-card-price">${price}</div>
      </div>
      <div className="product-card-actions">
        <div style={{ display: "flex", gap: "8px" }}>
          <Badge text={stockBadge.text} variant={stockBadge.variant} />
          {hasDiscount && (
            <Badge text={`-${product.discount}%`} variant="warning" />
          )}
        </div>
        <Button
          variant="primary"
          size="sm"
          disabled={stock === 0}
          onClick={handleAddToCart}
          data-testid={`add-to-cart-${product._id}`}
        >
          Agregar al carrito
        </Button>
      </div>
    </div>
  );
});

export default ProductCard;
