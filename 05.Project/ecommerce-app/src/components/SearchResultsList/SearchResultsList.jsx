import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import List from "../List/List";
import FiltersSidebar from "../FiltersSidebar/FiltersSidebar";
import "./SearchResultsList.css";

export default function SearchResultsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Extraer filtros de la URL
  const query = searchParams.get("q") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const inStock = searchParams.get("inStock") || "";
  const sort = searchParams.get("sort") || "";
  
  // Estado local para los inputs (para evitar re-renders excesivos)
  const [localFilters, setLocalFilters] = useState({
    minPrice,
    maxPrice
  });

  // Sincronizar estado local con la URL cuando esta cambie externamente
  useEffect(() => {
    setLocalFilters({ minPrice, maxPrice });
  }, [minPrice, maxPrice]);

  // Hook useProducts ahora recibe los filtros para hacer la petición al BE
  const { data: products = [], isLoading: loading } = useProducts({
    q: query,
    minPrice,
    maxPrice,
    inStock,
    sort
  });

  const handleFilterChange = (name, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    
    // Si es un cambio de precio, actualizamos localmente primero
    if (name === 'minPrice' || name === 'maxPrice') {
      setLocalFilters(prev => ({ ...prev, [name]: value }));
      
      // Debounce manual para no saturar la URL/API mientras se escribe
      const timeoutId = setTimeout(() => {
        setSearchParams(newParams);
      }, 500);
      return () => clearTimeout(timeoutId);
    }

    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams(query ? { q: query } : {});
    setLocalFilters({ minPrice: '', maxPrice: '' });
  };

  const hasQuery = query.length > 0;
  const showNoResults = !loading && products.length === 0;

  return (
    <div className="search-results-page-container">
      <div className="search-results-layout">
        <FiltersSidebar 
          filters={{ 
            minPrice: localFilters.minPrice, 
            maxPrice: localFilters.maxPrice, 
            inStock, 
            sort 
          }}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <div className="search-results-content">
          <header className="search-results-header">
            <div>
              <h1 className="search-results-title">
                {hasQuery
                  ? `Resultados para "${query}"`
                  : "Explora nuestro catálogo"}
              </h1>
              <p className="search-results-description">
                {products.length} productos encontrados.
              </p>
            </div>
          </header>

          {loading && (
            <div className="search-results-message">
              <h3>Buscando productos...</h3>
              <p>Esto puede tomar unos segundos.</p>
            </div>
          )}

          {!loading && showNoResults && (
            <div className="search-results-message">
              <h3>No encontramos coincidencias</h3>
              <p>
                Prueba ajustando los filtros o recorre nuestras{" "}
                <Link to="/">novedades</Link>.
              </p>
            </div>
          )}

          {!loading && !showNoResults && (
            <List
              products={products}
              layout="grid"
              title={hasQuery ? `Búsqueda: ${query}` : "Catálogo"}
            />
          )}
        </div>
      </div>
    </div>
  );
}
