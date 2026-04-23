import React from 'react';
import './Skeleton.css';

/**
 * Componente Skeleton para estados de carga visual (Shimmer effect).
 * 
 * @param {string} width - Ancho del skeleton (ej: '100%', '200px')
 * @param {string} height - Alto del skeleton
 * @param {string} variant - 'text', 'circular', 'rectangular'
 * @param {string} className - Clases adicionales
 */
const Skeleton = ({ 
  width, 
  height, 
  variant = 'rectangular', 
  className = '',
  style = {} 
}) => {
  const skeletonStyles = {
    width,
    height,
    ...style
  };

  return (
    <div 
      className={`skeleton skeleton-${variant} ${className}`} 
      style={skeletonStyles}
    />
  );
};

export default Skeleton;
