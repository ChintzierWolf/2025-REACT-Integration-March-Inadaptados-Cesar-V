import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // 👤 Usuario que realizó el pedido
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // 🎮 Lista de productos comprado
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'La cantidad mínima es 1'],
        },
        price: {
          type: Number,
          required: true,
          min: [0, 'El precio no puede ser negativo'],
        },
      },
    ],
    // 📍 Dirección de envío asociada al pedido
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShippingAddress',
      required: true,
    },
    // 💳 Método de pago utilizado
    paymentMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PaymentMethod',
      required: true,
    },
     // 🚚 Costo del envío
    shippingCost: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'El costo del envío no puede ser negativo'],
    },
    // 💰 Precio total del pedido (productos + envío)
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'El precio total no puede ser negativo'],
    },
    // 📦 Estado del pedido
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    // 💸 Estado del pago
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
  },
  {
    // 🕒 Agrega createdAt y updatedAt automáticamente
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;