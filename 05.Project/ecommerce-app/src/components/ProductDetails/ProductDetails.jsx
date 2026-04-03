import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import categoriesData from "../../data/categories.json";
import Breadcrumb from "../../layout/Breadcrumb/Breadcrumb";
import { useProduct } from "../../hooks/useProducts";
import { useReviews, useCreateReview } from "../../hooks/useReviews";
import Badge from "../common/Badge";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage/ErrorMessage";
import Loading from "../common/Loading/Loading";
import Icon from "../common/Icon/Icon";
import "./ProductDetails.css";

export default function ProductDetails({ productId }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  // Queries
  const { data: product, isLoading: productLoading, error: productError } = useProduct(productId);
  const { data: reviews = [], isLoading: reviewsLoading } = useReviews(productId);
  const { mutateAsync: createReviewMutation } = useCreateReview();

  // Local States for form UI
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  const resolvedCategory = useMemo(() => {
    if (!product?.category) return null;
    if (typeof product.category === 'string') {
        return categoriesData.find(c => c.name === product.category);
    }
    return null;
  }, [product]);

  const categorySlug = resolvedCategory?.id || null;

  const handleAddToCart = () => {
    if (product) addToCart(product, 1);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      setReviewError("Inicia sesión para dejar una reseña");
      return;
    }
    
    setSubmitting(true);
    setReviewError(null);

    try {
      await createReviewMutation({ 
        productId, 
        rating: newReview.rating, 
        comment: newReview.comment 
      });
      setNewReview({ rating: 5, comment: "" });
    } catch (err) {
      setReviewError(err.message || "Error al enviar la reseña");
    } finally {
      setSubmitting(false);
    }
  };

  if (productLoading) {
    return (
      <div className="product-details-container">
        <Loading message="Cargando producto..." />
      </div>
    );
  }

  if (productError) {
    return (
      <div className="product-details-container">
        <ErrorMessage message={productError.message || "Ocurrio un error al cargar el producto"}>
          <p className="muted">
            Revisa nuestra <Link to="/">página principal</Link> o explora otras
            categorías.
          </p>
        </ErrorMessage>
      </div>
    );
  }

  if (!product) return null;

  const { name, description, price, stock, image, category } = product;
  const stockBadge = stock > 0 ? "success" : "error";
  const stockLabel = stock > 0 ? "En stock" : "Agotado";

  return (
    <div className="product-details-container">
      <Breadcrumb
        items={[
          { label: "Inicio", to: "/" },
          categorySlug
            ? {
                label: resolvedCategory?.name || category?.name || "Categoría",
                to: `/category/${categorySlug}`,
              }
            : { label: "Categoría" },
          { label: name },
        ]}
      />
      <div className="product-details-main">
        <div className="product-details-image">
          <img
            src={image || "/img/products/placeholder.svg"}
            alt={name}
            onError={(event) => {
              event.target.src = "/img/products/placeholder.svg";
            }}
          />
        </div>
        <div className="product-details-info">
          <div className="product-details-title">
            <h1 className="h1">{name}</h1>
            {(resolvedCategory?.name || category) && (
              <span className="product-details-category">
                {resolvedCategory?.name || category}
              </span>
            )}
          </div>
          <p className="product-details-description">{description}</p>
          <div className="product-details-stock">
            <Badge text={stockLabel} variant={stockBadge} />
            {stock > 0 && (
              <span className="muted">{stock} unidades disponibles</span>
            )}
          </div>
          <div className="product-details-price">${price}</div>
          <div className="product-details-actions">
            <Button
              variant="primary"
              size="lg"
              disabled={stock === 0}
              onClick={handleAddToCart}
            >
              Agregar al carrito
            </Button>
            <Link to="/cart" className="btn btn-outline btn-lg">
              Ver carrito
            </Link>
          </div>
        </div>
      </div>

      <div className="product-reviews-section">
        <h2>Reseñas ({reviews.length})</h2>

        {reviewsLoading ? (
          <Loading message="Cargando reseñas..." />
        ) : (
          <>
            {reviews.length > 0 && product?.ratingsAverage && (
              <div className="product-rating-summary">
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      name={star <= Math.round(product.ratingsAverage) ? "star" : "starOutline"}
                      size={24}
                      className="rating-star"
                    />
                  ))}
                </div>
                <span className="rating-value">
                  {product.ratingsAverage.toFixed(1)} de 5 ({product.ratingsQuantity} reseñas)
                </span>
              </div>
            )}

            {isAuthenticated() && (
              <form className="review-form" onSubmit={handleSubmitReview}>
                <h3>Deja tu reseña</h3>
                <div className="review-form-group">
                  <label>Calificación:</label>
                  <div className="rating-input">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${newReview.rating >= star ? "active" : ""}`}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                      >
                        <Icon
                          name={newReview.rating >= star ? "star" : "starOutline"}
                          size={28}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="review-form-group">
                  <label>Comentario (opcional):</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Cuéntanos tu experiencia con este producto..."
                    maxLength={500}
                    rows={3}
                  />
                </div>
                {reviewError && <ErrorMessage>{reviewError}</ErrorMessage>}
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Enviando..." : "Enviar Reseña"}
                </Button>
              </form>
            )}

            {!isAuthenticated() && (
              <p className="review-login-prompt">
                <Link to="/login">Inicia sesión</Link> para dejar una reseña
              </p>
            )}

            <div className="reviews-list">
              {reviews.length === 0 ? (
                <p className="no-reviews">Aún no hay reseñas para este producto. ¡Sé el primero!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="review-card">
                    <div className="review-header">
                      <div className="review-user">
                        <Icon name="user" size={20} />
                        <span>{review.user?.displayName || "Usuario"}</span>
                      </div>
                      <div className="review-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Icon
                            key={star}
                            name={star <= review.rating ? "star" : "starOutline"}
                            size={16}
                            className={star <= review.rating ? "star-filled" : ""}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="review-comment">{review.comment}</p>
                    )}
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString("es-MX")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
