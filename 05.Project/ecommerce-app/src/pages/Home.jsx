import { useProducts } from "../hooks/useProducts";
import BannerCarousel from "../components/BannerCarousel/BannerCarousel";
import List from "../components/List/List";
import ErrorMessage from "../components/common/ErrorMessage/ErrorMessage";
import Loading from "../components/common/Loading/Loading";
import homeImagesTop from "../data/homeImagesTop.json";
import homeImagesBottom from "../data/homeImagesBottom.json";

export default function Home() {
  const { data: products, isLoading, error } = useProducts();

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
        {isLoading ? (
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