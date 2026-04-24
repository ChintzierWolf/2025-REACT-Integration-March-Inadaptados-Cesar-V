import React from "react";
import "./Skeleton.css";

/**
 * Skeleton Component
 * Proporciona un marcador de posición animado para contenido en carga.
 * 
 * @param {string} width - Ancho del esqueleto (ej: '100%', '200px')
 * @param {string} height - Alto del esqueleto
 * @param {string} variant - 'text', 'rect', 'circle'
 * @param {string} className - Clases adicionales
 */
const Skeleton = ({ 
  width = "100%", 
  height = "20px", 
  variant = "text", 
  className = "" 
}) => {
  const styles = {
    width,
    height,
  };

  return (
    <div 
      className={`skeleton skeleton-${variant} ${className}`} 
      style={styles}
    />
  );
};

export default Skeleton;
