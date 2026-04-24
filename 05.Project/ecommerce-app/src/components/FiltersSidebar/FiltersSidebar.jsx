import React from 'react';
import './FiltersSidebar.css';

export default function FiltersSidebar({ filters, onFilterChange, onClearFilters }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFilterChange(name, type === 'checkbox' ? checked : value);
  };

  return (
    <aside className="filters-sidebar">
      <div className="filters-header">
        <h3>Filtros</h3>
        <button className="clear-filters-btn" onClick={onClearFilters}>
          Limpiar
        </button>
      </div>

      <div className="filter-group">
        <h4>Precio</h4>
        <div className="price-inputs">
          <input
            type="number"
            name="minPrice"
            placeholder="Mín"
            value={filters.minPrice || ''}
            onChange={handleChange}
            min="0"
          />
          <span>-</span>
          <input
            type="number"
            name="maxPrice"
            placeholder="Máx"
            value={filters.maxPrice || ''}
            onChange={handleChange}
            min="0"
          />
        </div>
      </div>

      <div className="filter-group">
        <h4>Disponibilidad</h4>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="inStock"
            checked={filters.inStock === 'true' || filters.inStock === true}
            onChange={(e) => onFilterChange('inStock', e.target.checked ? 'true' : '')}
          />
          Solo en stock
        </label>
      </div>

      <div className="filter-group">
        <h4>Ordenar por</h4>
        <select name="sort" value={filters.sort || ''} onChange={handleChange}>
          <option value="">Destacados</option>
          <option value="price">Precio: Menor a Mayor</option>
          <option value="price_desc">Precio: Mayor a Menor</option>
          <option value="name">Nombre: A-Z</option>
          <option value="name_desc">Nombre: Z-A</option>
        </select>
      </div>
    </aside>
  );
}
