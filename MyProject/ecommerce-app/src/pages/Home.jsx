import { useEffect, useState } from "react";
import BannerCarousel from "../components/BannerCarousel/BannerCarousel";
import List from "../components/List/List";
import ErrorMessage from "../components/common/ErrorMessage/ErrorMessage";
import Loading from "../components/common/Loading/Loading";
import homeImagesTop from "../data/homeImagesTop.json";
import homeImagesBottom from "../data/homeImagesBottom.json";
import { fetchProducts } from "../services/productService";
import { http } from "./http";

export const fetchProducts = async () => {
    try {
        const response = await http.get("products");
        return response.data;
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        return [];
    }
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (err) {
        setError("No se pudieron cargar los productos. Intenta más tarde.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div>
      <div className="bg-secondary-color" style={{
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--accent-color)' }}>
          Bienvenido a GamezVazStore
        </h1>
        <p className="muted" style={{ fontSize: '1.2rem' }}>
          Tu destino definitivo para videojuegos, consolas y accesorios.
        </p>
      </div>

      <div className="banner-carousel-top">
        <BannerCarousel  banners={homeImagesTop} />
      </div>
      
      <div className="container">
        {loading ? (
          <Loading>Cargando productos...</Loading>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : products.length > 0 ? (
          <List
            title="Novedades y Destacados"
            products={products}
            layout="grid"
          />
        ) : (
          <ErrorMessage>No hay productos en el catálogo</ErrorMessage>
        )}
      </div>

      <div className="banner-carousel-bottom">
        <BannerCarousel banners={homeImagesBottom} />
      </div>

    </div>
  );
}