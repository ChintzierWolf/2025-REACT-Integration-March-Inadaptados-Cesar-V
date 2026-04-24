import React, { useState, useEffect } from "react";
import ErrorBoundary from "./ErrorBoundary";

/**
 * RouteErrorBoundary
 * Diseñado para envolver componentes cargados con React.lazy.
 * Captura errores de carga de red (ChunkLoadError) y permite reintentar.
 */
const RouteErrorBoundary = ({ children }) => {
  const [errorKey, setErrorKey] = useState(0);

  const handleRetry = () => {
    // Incrementamos la key para forzar el remount del hijo
    setErrorKey((prev) => prev + 1);
  };

  const fallback = (
    <div className="route-error-container">
      <div className="route-error-content">
        <h3>Error de conexión</h3>
        <p>No se pudo cargar esta sección. Por favor, verifica tu conexión.</p>
        <button className="retry-button small" onClick={handleRetry}>
          Reintentar carga
        </button>
      </div>
    </div>
  );

  return (
    <ErrorBoundary key={errorKey} fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
};

export default RouteErrorBoundary;
