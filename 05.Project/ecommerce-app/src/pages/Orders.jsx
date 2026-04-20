import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../hooks/useOrders";
import Loading from "../components/common/Loading/Loading";
import Icon from "../components/common/Icon/Icon";
import Button from "../components/common/Button";
import "./Orders.css";

const formatMoney = (value = 0) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);

const formatDate = (isoString) => {
  if (!isoString) return "Fecha desconocida";
  try {
    return new Date(isoString).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    return "Fecha inválida";
  }
};

const getStatusLabel = (status) => {
  const labels = {
    pending: "Pendiente",
    processing: "Procesando",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
    confirmed: "Confirmado"
  };
  return labels[status?.toLowerCase()] || status || "Confirmado";
};

export default function Orders() {
  const { data, isLoading, error: queryError } = useOrders();
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const orders = useMemo(() => {
    if (!data) return [];
    return [...data].sort(
      (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
    );
  }, [data]);

  // Sincronizar el primer pedido seleccionado
  useEffect(() => {
    if (orders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(orders[0]._id);
    }
  }, [orders, selectedOrderId]);

  const selectedOrder = useMemo(
    () => orders.find((order) => order._id === selectedOrderId) || null,
    [orders, selectedOrderId]
  );

  const detailStatusToken = selectedOrder
    ? (selectedOrder.status || "pending").toLowerCase()
    : "pending";
  const detailStatusLabel = getStatusLabel(selectedOrder?.status);

  if (isLoading) {
    return (
      <div className="orders-page">
        <Loading message="Cargando tus pedidos..." />
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="orders-page orders-empty">
        <Icon name="alertCircle" size={48} />
        <h1>Error al cargar pedidos</h1>
        <p>{queryError.message || "No se pudieron cargar las órdenes"}</p>
        <Link to="/" className="orders-link">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="orders-page orders-empty">
        <Icon name="package" size={48} />
        <h1>No tienes pedidos</h1>
        <p>
          Aún no has realizado ninguna compra. Explora nuestros productos y
          realiza tu primera orden.
        </p>
        <Link to="/" className="orders-link">
          <Button>Descubrir productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <p className="eyebrow">Historial de compras</p>
          <h1>Mis pedidos</h1>
          <p className="muted">
            {orders.length === 1
              ? "Tienes 1 pedido"
              : `Tienes ${orders.length} pedidos`}
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => setSelectedOrderId(orders[0]?._id || null)}
        >
          Ver más reciente
        </Button>
      </div>

      <div className="orders-content">
        <div className="orders-list card">
          <div className="orders-list-header">
            <h2>Pedidos</h2>
            <span>{orders.length}</span>
          </div>
          <div className="orders-list-body">
            {orders.map((order) => {
              const itemCount = order.products?.length || 0;
              const statusToken = (order.status || "pending").toLowerCase();
              const isActive = selectedOrderId === order._id;
              return (
                <button
                  key={order._id}
                  className={`order-card${isActive ? " active" : ""}`}
                  onClick={() => setSelectedOrderId(order._id)}
                >
                  <div className="order-card-head">
                    <span className="order-id">#{order._id?.slice(-8)}</span>
                    <span
                      className={`order-status order-status-${statusToken}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="order-date">
                    {formatDate(order.createdAt || order.date)}
                  </p>
                  <div className="order-card-meta">
                    <span>{itemCount} {itemCount === 1 ? "artículo" : "artículos"}</span>
                    <strong>{formatMoney(order.totalPrice || order.total || 0)}</strong>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="orders-detail card">
          {selectedOrder ? (
            <>
              <div className="order-detail-header">
                <div>
                  <p className="eyebrow">Pedido #{selectedOrder._id?.slice(-8)}</p>
                  <h2>{formatMoney(selectedOrder.totalPrice || selectedOrder.total || 0)}</h2>
                  <p className="muted">
                    {formatDate(selectedOrder.createdAt || selectedOrder.date)}
                  </p>
                </div>
                <span
                  className={`order-status order-status-${detailStatusToken}`}
                >
                  {detailStatusLabel}
                </span>
              </div>

              <div className="order-section">
                <h3>Resumen del pedido</h3>
                <ul className="order-summary-list">
                  <li>
                    <span>Subtotal</span>
                    <strong>
                      {formatMoney(selectedOrder.totalPrice - (selectedOrder.shippingCost || 0) - ((selectedOrder.totalPrice - (selectedOrder.shippingCost || 0)) * 0.16 / 1.16) || 0)}
                    </strong>
                  </li>
                  <li>
                    <span>Impuestos</span>
                    <strong>
                      {formatMoney(((selectedOrder.totalPrice - (selectedOrder.shippingCost || 0)) * 0.16 / 1.16) || 0)}
                    </strong>
                  </li>
                  <li>
                    <span>Envío</span>
                    <strong>
                      {selectedOrder.shippingCost === 0
                        ? "Gratis"
                        : formatMoney(selectedOrder.shippingCost || 0)}
                    </strong>
                  </li>
                  <li className="order-summary-total">
                    <span>Total</span>
                    <strong>{formatMoney(selectedOrder.totalPrice || selectedOrder.total || 0)}</strong>
                  </li>
                </ul>
              </div>

              <div className="order-section">
                <h3>Dirección de envío</h3>
                {selectedOrder.shippingAddress ? (
                  <address className="order-address">
                    <strong>{selectedOrder.shippingAddress.name}</strong>
                    <p>{selectedOrder.shippingAddress.street}</p>
                    {selectedOrder.shippingAddress.city && (
                      <p>
                        {selectedOrder.shippingAddress.city},{" "}
                        {selectedOrder.shippingAddress.postalCode}
                      </p>
                    )}
                    {selectedOrder.shippingAddress.country && (
                      <p>{selectedOrder.shippingAddress.country}</p>
                    )}
                  </address>
                ) : (
                  <p className="muted">Sin dirección registrada.</p>
                )}
              </div>

              <div className="order-section">
                <h3>Método de pago</h3>
                {selectedOrder.paymentMethod ? (
                  <div>
                    <p>{selectedOrder.paymentMethod.alias}</p>
                    <p>
                      ****{" "}
                      {selectedOrder.paymentMethod.last4 ||
                        selectedOrder.paymentMethod.cardNumber?.slice(-4) ||
                        "----"}
                    </p>
                  </div>
                ) : (
                  <p className="muted">Sin método de pago registrado.</p>
                )}
              </div>

              <div className="order-section">
                <h3>Productos</h3>
                <ul className="order-items">
                  {selectedOrder.products?.map((item, index) => (
                    <li key={`${selectedOrder._id}-${item.productId?._id || item.product || index}`}>
                      <div>
                        <p>{item.productId?.name || item.name || "Producto"}</p>
                        <span>
                          Cantidad: {item.quantity || 1} · Precio:{" "}
                          {formatMoney(item.price || 0)}
                        </span>
                      </div>
                      <strong>
                        {formatMoney(
                          (item.price || 0) * (item.quantity || 1)
                        )}
                      </strong>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="orders-empty">
              <h3>Selecciona un pedido de la lista</h3>
              <p className="muted">
                Aquí verás el detalle completo: productos, dirección y método de
                pago utilizados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
