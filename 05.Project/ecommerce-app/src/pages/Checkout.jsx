import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartView from "../components/Cart/CartView";
import AddressForm from "../components/Checkout/Address/AddressForm";
import AddressList from "../components/Checkout/Address/AddressList";
import PaymentForm from "../components/Checkout/Payment/PaymentForm";
import PaymentList from "../components/Checkout/Payment/PaymentList";
import SummarySection from "../components/Checkout/shared/SummarySection";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage/ErrorMessage";
import Loading from "../components/common/Loading/Loading";
import Icon from "../components/common/Icon/Icon";
import { useCartStore } from "../stores/cartStore";
import { getCurrentUser } from "../utils/auth";
import {
  getDefaultPaymentMethod,
  getPaymentMethods,
} from "../services/paymentService";
import {
  getDefaultShippingAddress,
  getShippingAddresses,
} from "../services/shippingService";
import { createOrder } from "../services/cartService";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.cartItems);
  const total = useCartStore((state) => state.total);
  const clearCart = useCartStore((state) => state.clearCart);

  // --- LÓGICA DE NEGOCIO FINANCIERA ---
  const subtotal = typeof total === "number" ? total : 0;
  const TAX_RATE = 0.16; // IVA 16%
  const SHIPPING_RATE = 350; // Costo de envío estándar
  const FREE_SHIPPING_THRESHOLD = 1000; // Envío gratis si subtotal >= 1000

  const taxAmount = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;
  const grandTotal = parseFloat(
    (subtotal + taxAmount + shippingCost).toFixed(2)
  );
  const [isOrderFinished, setIsOrderFinished] = useState(false);

  // Utilidad para formatear moneda (MXN)
  const formatMoney = (v) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(v);

  // --- EFECTOS Y REFERENCIAS ---
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      if (!isOrderFinished) {
        navigate("/cart");
      }
    }
  }, [cartItems, navigate]);

  // --- ESTADOS LOCALES ---
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loadingLocal, setLoadingLocal] = useState(true);
  const [localError, setLocalError] = useState(null);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);

  const [addressSectionOpen, setAddressSectionOpen] = useState(false);
  const [paymentSectionOpen, setPaymentSectionOpen] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // --- CARGA DE DATOS INICIAL ---
  useEffect(() => {
    async function loadData() {
      setLoadingLocal(true);
      setLocalError(null);
      try {
        const [addrList, firstAddress, payList, firstPayment] =
          await Promise.all([
            getShippingAddresses(),
            getDefaultShippingAddress(),
            getPaymentMethods(),
            getDefaultPaymentMethod(),
          ]);

        setAddresses(addrList || []);
        setPayments(payList || []);
        setSelectedAddress(firstAddress);
        setSelectedPayment(firstPayment);
        setAddressSectionOpen(!firstAddress);
        setPaymentSectionOpen(!firstPayment);
      } catch (err) {
        setLocalError("No se pudo cargar direcciones o métodos de pago.");
      } finally {
        setLoadingLocal(false);
      }
    }
    loadData();
  }, []);

  // --- HANDLERS ---
  // (Manteniendo la misma lógica pero simplificada para el ejemplo)
  const handleAddressToggle = () => { setShowAddressForm(false); setEditingAddress(null); setAddressSectionOpen((prev) => !prev); };
  const handleSelectAddress = (address) => { setSelectedAddress(address); setShowAddressForm(false); setEditingAddress(null); setAddressSectionOpen(false); };
  const handleAddressNew = () => { setShowAddressForm(true); setEditingAddress(null); setAddressSectionOpen(true); };
  const handleAddressEdit = (address) => { setShowAddressForm(true); setEditingAddress(address); setAddressSectionOpen(true); };
  const handleAddressDelete = (address) => {
    const updatedAddresses = addresses.filter((add) => add._id !== address._id);
    if (selectedAddress?._id === address._id) setSelectedAddress(updatedAddresses[0] || null);
    setAddresses(updatedAddresses);
  };
  const handleAddressSubmit = (formData) => {
    let updatedAddresses;
    let newSelectedAddress = selectedAddress;
    if (editingAddress) {
      updatedAddresses = addresses.map((addr) => addr._id === editingAddress._id ? { ...addr, ...formData } : addr);
      if (selectedAddress?._id === editingAddress._id) newSelectedAddress = updatedAddresses.find((a) => a._id === editingAddress._id);
    } else {
      const newAddress = { _id: Date.now().toString(), ...formData };
      updatedAddresses = [...addresses, newAddress];
      newSelectedAddress = newAddress;
    }
    setAddresses(updatedAddresses);
    setSelectedAddress(newSelectedAddress);
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressSectionOpen(false);
  };
  const handleCancelAddress = () => { setShowAddressForm(false); setEditingAddress(null); setAddressSectionOpen(false); };

  const handlePaymentToggle = () => { setShowPaymentForm(false); setEditingPayment(null); setPaymentSectionOpen((prev) => !prev); };
  const handleSelectPayment = (payment) => { setSelectedPayment(payment); setShowPaymentForm(false); setEditingPayment(null); setPaymentSectionOpen(false); };
  const handlePaymentNew = () => { setShowPaymentForm(true); setEditingPayment(null); setPaymentSectionOpen(true); };
  const handlePaymentEdit = (payment) => { setShowPaymentForm(true); setEditingPayment(payment); setPaymentSectionOpen(true); };
  const handlePaymentDelete = (payment) => {
    const updatedPayments = payments.filter((pay) => pay._id !== payment._id);
    if (selectedPayment?._id === payment._id) setSelectedPayment(updatedPayments[0] || null);
    setPayments(updatedPayments);
  };
  const handlePaymentSubmit = (formData) => {
    let updatedPayments;
    let newSelectedPayment = selectedPayment;
    if (editingPayment) {
      updatedPayments = payments.map((pay) => pay._id === editingPayment._id ? { ...pay, ...formData } : pay);
      if (selectedPayment?._id === editingPayment._id) newSelectedPayment = updatedPayments.find((p) => p._id === editingPayment._id);
    } else {
      const newPayment = { _id: Date.now().toString(), ...formData };
      updatedPayments = [...payments, newPayment];
      newSelectedPayment = newPayment;
    }
    setPayments(updatedPayments);
    setSelectedPayment(newSelectedPayment);
    setShowPaymentForm(false);
    setEditingPayment(null);
    setPaymentSectionOpen(false);
  };
  const handleCancelPayment = () => { setShowPaymentForm(false); setEditingPayment(null); setPaymentSectionOpen(false); };

  const handleCreateOrder = async () => {
    if (!selectedAddress || !selectedPayment || !cartItems || cartItems.length === 0) return;

    const user = getCurrentUser();
    if (!user?._id) {
      setLocalError("Debes iniciar sesión para realizar una orden");
      return;
    }

    const orderData = {
      user: user._id,
      products: cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: selectedAddress._id,
      paymentMethod: selectedPayment._id,
      shippingCost,
    };

    try {
      const orderResponse = await createOrder(orderData);
      
      const order = {
        _id: orderResponse._id,
        date: new Date().toISOString(),
        items: cartItems.map((item) => ({ ...item, subtotal: item.price * item.quantity })),
        subtotal,
        tax: taxAmount,
        shipping: shippingCost,
        total: grandTotal,
        shippingAddress: selectedAddress,
        paymentMethod: selectedPayment,
        status: "pending",
      };

      setIsOrderFinished(true);
      navigate("/order-confirmation", { state: { order } });
      clearCart();
    } catch (error) {
      setLocalError("Error al crear la orden: " + error.message);
    }
  };

  return (
    loadingLocal ? (
      <Loading message="Iniciando sistema de checkout..." />
    ) : localError ? (
      <ErrorMessage message={localError} />
    ) : (
      <div className="checkout-wrapper">
        <div className="checkout-header">
          <div className="checkout-title">
            <Icon name="shield" size={32} />
            <h1>CONFIRMACIÓN DE ORDEN</h1>
          </div>
          <div className="checkout-status">
            <span className="status-dot"></span>
            SISTEMA SEGURO: ONLINE
          </div>
        </div>

        <div className="checkout-grid">
          <div className="checkout-main">
            {/* Módulo de Dirección */}
            <div className={`checkout-module ${addressSectionOpen ? 'active' : ''}`}>
              <div className="module-header" onClick={handleAddressToggle}>
                <div className="module-title">
                  <span className="module-number">01</span>
                  <h3>COORDENADAS DE ENVÍO</h3>
                </div>
                <Icon name={addressSectionOpen ? "chevronUp" : "chevronDown"} size={20} />
              </div>
              
              <div className="module-content">
                {addressSectionOpen ? (
                  !showAddressForm && !editingAddress ? (
                    <AddressList
                      addresses={addresses}
                      selectedAddress={selectedAddress}
                      onSelect={handleSelectAddress}
                      onEdit={handleAddressEdit}
                      onAdd={handleAddressNew}
                      onDelete={handleAddressDelete}
                    />
                  ) : (
                    <AddressForm
                      onSubmit={handleAddressSubmit}
                      onCancel={handleCancelAddress}
                      initialValues={editingAddress || {}}
                      isEdit={!!editingAddress}
                    />
                  )
                ) : (
                  selectedAddress && (
                    <div className="selected-preview">
                      <Icon name="mapPin" size={18} />
                      <div>
                        <strong>{selectedAddress.name}</strong>
                        <p>{selectedAddress.address1}, {selectedAddress.city}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Módulo de Pago */}
            <div className={`checkout-module ${paymentSectionOpen ? 'active' : ''}`}>
              <div className="module-header" onClick={handlePaymentToggle}>
                <div className="module-title">
                  <span className="module-number">02</span>
                  <h3>MÉTODO DE PAGO</h3>
                </div>
                <Icon name={paymentSectionOpen ? "chevronUp" : "chevronDown"} size={20} />
              </div>

              <div className="module-content">
                {paymentSectionOpen ? (
                  !showPaymentForm && !editingPayment ? (
                    <PaymentList
                      payments={payments}
                      selectedPayment={selectedPayment}
                      onSelect={handleSelectPayment}
                      onEdit={handlePaymentEdit}
                      onAdd={handlePaymentNew}
                      onDelete={handlePaymentDelete}
                    />
                  ) : (
                    <PaymentForm
                      onSubmit={handlePaymentSubmit}
                      onCancel={handleCancelPayment}
                      initialValues={editingPayment || {}}
                      isEdit={!!editingPayment}
                    />
                  )
                ) : (
                  selectedPayment && (
                    <div className="selected-preview">
                      <Icon name="creditCard" size={18} />
                      <div>
                        <strong>{selectedPayment.alias}</strong>
                        <p>**** {selectedPayment.cardNumber?.slice(-4)}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Módulo de Items */}
            <div className="checkout-module active">
              <div className="module-header">
                <div className="module-title">
                  <span className="module-number">03</span>
                  <h3>INVENTARIO SELECCIONADO</h3>
                </div>
              </div>
              <div className="module-content">
                <CartView />
              </div>
            </div>
          </div>

          {/* Panel Lateral de Resumen */}
          <div className="checkout-sidebar">
            <div className="order-summary-card">
              <div className="summary-header">
                <h3>RESUMEN DE MISIÓN</h3>
              </div>
              
              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Impuestos (16%)</span>
                  <span>{formatMoney(taxAmount)}</span>
                </div>
                <div className="summary-row">
                  <span>Envío</span>
                  <span className={shippingCost === 0 ? "free-text" : ""}>
                    {shippingCost === 0 ? "GRATIS" : formatMoney(shippingCost)}
                  </span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>TOTAL</span>
                  <span>{formatMoney(grandTotal)}</span>
                </div>
              </div>

              <div className="summary-footer">
                <p className="delivery-estimate">
                  <Icon name="truck" size={16} />
                  Entrega estimada: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
                
                <Button
                  className="checkout-btn"
                  disabled={!selectedAddress || !selectedPayment || !cartItems?.length}
                  onClick={handleCreateOrder}
                  size="lg"
                >
                  CONFIRMAR ORDEN
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
