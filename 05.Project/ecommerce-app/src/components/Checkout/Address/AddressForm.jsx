import { useEffect, useState } from "react";
import Button from "../../common/Button";
import Input from "../../common/Input";
import "./AddressForm.css";

const AddressForm = ({
  onSubmit,
  onCancel,
  initialValues = {},
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    postalCode: "",
    city: "",
    state: "",
    country: "México",
    phone: "",
    isDefault: false,
    ...initialValues,
  });

  // Actualizar formulario cuando initialValues cambia (modo edición)
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData({
        name: "",
        address: "",
        postalCode: "",
        city: "",
        state: "",
        country: "México",
        phone: "",
        isDefault: false,
        ...initialValues,
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    // Resetear formulario solo si es nuevo (no edición)
    if (!isEdit) {
      setFormData({
        name: "",
        address: "",
        postalCode: "",
        city: "",
        state: "",
        country: "México",
        phone: "",
        isDefault: false,
      });
    }
  };

  return (
    <form className="address-form" onSubmit={handleSubmit}>
      <h3>{isEdit ? "Editar Dirección" : "Nueva Dirección"}</h3>

      <Input
        label="Nombre de la dirección (Ej. Casa, Trabajo)"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <Input
        label="Dirección completa"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
      />

      <div className="form-row" style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <Input
            label="Código Postal"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ flex: 1 }}>
          <Input
            label="Teléfono"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <Input
            label="Ciudad"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ flex: 1 }}>
          <Input
            label="Estado"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <Input
        label="País"
        name="country"
        value={formData.country}
        onChange={handleChange}
        required
      />

      <div className="form-checkbox">
        <input
          type="checkbox"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          id="isDefaultAddress"
        />
        <label htmlFor="isDefaultAddress">
          Establecer como dirección predeterminada
        </label>
      </div>

      <div className="form-actions">
        <Button type="submit">
          {isEdit ? "Guardar Cambios" : "Agregar Dirección"}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

export default AddressForm;
