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
import { 
  useShippingAddresses, 
  usePaymentMethods,
  useCreateAddress,
  useDeleteAddress,
  useCreatePayment,
  useDeletePayment
} from "../hooks/useCheckout";
import CheckoutSkeleton from "../components/Checkout/CheckoutSkeleton";
import { createOrder } from "../services/orderService";
import { getCurrentUser } from "../utils/auth";
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

  // --- DATOS (REACT QUERY) ---
  const { 
    data: addressList = [], 
    isLoading: loadingAddresses, 
    error: addressError 
  } = useShippingAddresses();

  const { 
    data: paymentList = [], 
    isLoading: loadingPayments, 
    error: paymentError 
  } = usePaymentMethods();

  // Mutaciones
  const createAddressMutation = useCreateAddress();
  const deleteAddressMutation = useDeleteAddress();
  const createPaymentMutation = useCreatePayment();
  const deletePaymentMutation = useDeletePayment();

  const loadingData = loadingAddresses || loadingPayments;
  const dataError = addressError || paymentError;

  // --- ESTADOS LOCALES ---
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);

  const [addressSectionOpen, setAddressSectionOpen] = useState(false);
  const [paymentSectionOpen, setPaymentSectionOpen] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [localError, setLocalError] = useState(null);

  // --- EFECTOS DE NAVEGACIÓN ---
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      if (!isOrderFinished) {
        navigate("/cart");
      }
    }
  }, [cartItems, navigate, isOrderFinished]);

  // --- SINCRONIZACIÓN DE DATOS ---
  useEffect(() => {
    if (addressList.length > 0) {
      setAddresses(addressList);
      if (!selectedAddress) {
        const defaultAddr = addressList.find(a => a.isDefault) || addressList[0];
        setSelectedAddress(defaultAddr);
        setAddressSectionOpen(!defaultAddr);
      }
    } else {
      setAddresses([]);
      setSelectedAddress(null);
      setAddressSectionOpen(true);
    }
  }, [addressList, selectedAddress]);

  useEffect(() => {
    if (paymentList.length > 0) {
      setPayments(paymentList);
      if (!selectedPayment) {
        const defaultPay = paymentList.find(p => p.isDefault) || paymentList[0];
        setSelectedPayment(defaultPay);
        setPaymentSectionOpen(!defaultPay);
      }
    } else {
      setPayments([]);
      setSelectedPayment(null);
      setPaymentSectionOpen(true);
    }
  }, [paymentList, selectedPayment]);

  // --- HANDLERS DIRECCIÓN ---
  const handleAddressToggle = () => { setShowAddressForm(false); setEditingAddress(null); setAddressSectionOpen((prev) => !prev); };
  const handleSelectAddress = (address) => { setSelectedAddress(address); setShowAddressForm(false); setEditingAddress(null); setAddressSectionOpen(false); };
  const handleAddressNew = () => { setShowAddressForm(true); setEditingAddress(null); setAddressSectionOpen(true); };
  const handleAddressEdit = (address) => { setShowAddressForm(true); setEditingAddress(address); setAddressSectionOpen(true); };
  
  const handleAddressDelete = async (address) => {
    try {
      await deleteAddressMutation.mutateAsync(address._id);
      if (selectedAddress?._id === address._id) setSelectedAddress(null);
    } catch (err) {
      setLocalError("No se pudo eliminar la dirección.");
    }
  };

  const handleAddressSubmit = async (formData) => {
    try {
      const result = await createAddressMutation.mutateAsync(formData);
      setSelectedAddress(result);
      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressSectionOpen(false);
    } catch (err) {
      setLocalError("Error al guardar la dirección.");
    }
  };

  const handleCancelAddress = () => { setShowAddressForm(false); setEditingAddress(null); setAddressSectionOpen(false); };

  // --- HANDLERS PAGO ---
  const handlePaymentToggle = () => { setShowPaymentForm(false); setEditingPayment(null); setPaymentSectionOpen((prev) => !prev); };
  const handleSelectPayment = (payment) => { setSelectedPayment(payment); setShowPaymentForm(false); setEditingPayment(null); setPaymentSectionOpen(false); };
  const handlePaymentNew = () => { setShowPaymentForm(true); setEditingPayment(null); setPaymentSectionOpen(true); };
  const handlePaymentEdit = (payment) => { setShowPaymentForm(true); setEditingPayment(payment); setPaymentSectionOpen(true); };
  
  const handlePaymentDelete = async (payment) => {
    try {
      await deletePaymentMutation.mutateAsync(payment._id);
      if (selectedPayment?._id === payment._id) setSelectedPayment(null);
    } catch (err) {
      setLocalError("No se pudo eliminar el método de pago.");
    }
  };

  const handlePaymentSubmit = async (formData) => {
    try {
      const result = await createPaymentMutation.mutateAsync(formData);
      setSelectedPayment(result);
      setShowPaymentForm(false);
      setEditingPayment(null);
      setPaymentSectionOpen(false);
    } catch (err) {
      setLocalError("Error al guardar el método de pago.");
    }
  };

  const handleCancelPayment = () => { setShowPaymentForm(false); setEditingPayment(null); setPaymentSectionOpen(false); };

  // --- FINALIZAR COMPRA ---
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

  if (loadingData) {
    return <CheckoutSkeleton />;
  }

  return (
    <div className="checkout-wrapper">
      {(dataError || localError) && (
        <div style={{ marginBottom: '20px' }}>
          <ErrorMessage message={dataError?.message || localError || "Ha ocurrido un error inesperado."} />
        </div>
      )}
      
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
                      <p>{selectedAddress.address}, {selectedAddress.city}</p>
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
                disabled={!selectedAddress || !selectedPayment || !cartItems?.length || createAddressMutation.isPending || createPaymentMutation.isPending}
                onClick={handleCreateOrder}
                size="lg"
                data-testid="confirm-checkout"
              >
                {createAddressMutation.isPending || createPaymentMutation.isPending ? "GUARDANDO..." : "CONFIRMAR ORDEN"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
