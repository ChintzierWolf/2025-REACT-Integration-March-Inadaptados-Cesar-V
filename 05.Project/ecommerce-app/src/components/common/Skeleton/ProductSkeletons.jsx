import React from "react";
import Skeleton from "./Skeleton";

/**
 * ProductCardSkeleton
 * Muestra una vista previa de la tarjeta de producto mientras carga.
 */
export const ProductCardSkeleton = () => {
  return (
    <div className="product-card-skeleton" style={{
      padding: "1rem",
      border: "1px solid #eee",
      borderRadius: "12px",
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    }}>
      <Skeleton variant="rect" height="200px" width="100%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="40%" />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto" }}>
        <Skeleton variant="text" width="30%" height="24px" />
        <Skeleton variant="circle" width="32px" height="32px" />
      </div>
    </div>
  );
};

/**
 * ProductDetailsSkeleton
 * Muestra la estructura de la página de detalle del producto.
 */
export const ProductDetailsSkeleton = () => {
  return (
    <div className="product-details-skeleton" style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "2rem",
      padding: "2rem"
    }}>
      {/* Columna Imagen */}
      <Skeleton variant="rect" height="500px" width="100%" />
      
      {/* Columna Info */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <Skeleton variant="text" width="90%" height="40px" />
        <Skeleton variant="text" width="30%" height="30px" />
        
        <div style={{ marginTop: "1rem" }}>
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" />
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <Skeleton variant="rect" width="120px" height="45px" />
          <Skeleton variant="rect" width="200px" height="45px" />
        </div>
      </div>
    </div>
  );
};
