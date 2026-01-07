import mongoose from 'mongoose';

const shippingAddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: [true,'La dirección del usuario es requerido'],
    trim: true,
  },
  city: {
    type: String,
    required: [true,'La ciudad de residencia es requerida'],
    trim: true,
  },
  state: {
    type: String,
    required: [true,'El estado de residencia es requerido'],
    trim: true,
  },
  postalCode: {
    type: String,
    required: [true,'El código postal es requerido'],
    min: [4,'El número mínimo debe de ser 4'],
    max: [6,'El número máximo debe de ser 6'],
    trim: true,
  },
  country: {
    type: String,
    required: true,
    default: 'México',
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  addressType: {
    type: String,
    enum: ['home', 'work', 'other'],
    default: 'home',
  },
});

const ShippingAddress = mongoose.model('ShippingAddress', shippingAddressSchema);

export default ShippingAddress;