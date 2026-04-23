import Button from "../../common/Button";
import "./PaymentItem.css";

const PaymentItem = ({ payment, isSelected, onSelect, onEdit, onDelete }) => {
  return (
    <div
      className={`payment-item ${isSelected ? "selected" : ""} ${
        payment.isDefault ? "isDefault" : ""
      }`}
    >
      <div className="payment-content">
        <h4>{payment.alias}</h4>
        <p className="payment-card-number">
          **** **** **** {payment.cardNumber?.slice(-4)}
        </p>
        <p className="payment-holder">{payment.cardHolderName}</p>
        <p className="payment-expiry">Exp: {payment.expiryDate}</p>
        {payment.isDefault && (
          <span className="default-badge">Predeterminado</span>
        )}
      </div>
      <div className="payment-actions">
        <Button onClick={() => onSelect(payment)} disabled={isSelected}>
          {isSelected ? "Seleccionada" : "Seleccionar"}
        </Button>
        <Button variant="secondary" onClick={() => onEdit(payment)}>
          Editar
        </Button>
        <Button variant="danger" onClick={() => onDelete(payment)}>
          Eliminar
        </Button>
      </div>
    </div>
  );
};

export default PaymentItem;
