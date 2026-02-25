import { useEffect, useState } from "react";
import BannerCarousel from "../components/BannerCarousel";
import List from "../components/List/List";
import ErrorMessage from "../components/common/ErrorMessage/ErrorMessage";
import Loading from "../components/common/Loading/Loading";
import homeImages from "../data/homeImages.json";
import { fetchProducts } from "../services/productService";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    const productsData = await fetchProducts();
};

  useEffect(() => {
    let ignore = false;
    (async ()=>{
      try{
        await loadProducts();
      }catch(err){
        if(!ignore){
          setError("No se pudieron cargar los productos. Intenta más tarde.");
          console.error(err);
          setProducts([]);
          setLoading(false);
        }
      }
    })();

    loadProducts();
    return ()=>{
      ignore = true;
    }
  }, []);

  return (
    <div>
      <BannerCarousel banners={homeImages} />
      {loading ? (
        <Loading>Cargando productos...</Loading>
      ) : error ? (
        <ErrorMessage><span>{error}</span>
        <Button type="button" variant="primary" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
        </ErrorMessage>
      ) : products.length > 0 ? (
        <div>
          <List
            title="Productos recomendados"
            products={products}
          />
        </div>
      ) : (
        <ErrorMessage>No hay productos en el catálogo</ErrorMessage>
      )}
    </div>
  );
}
