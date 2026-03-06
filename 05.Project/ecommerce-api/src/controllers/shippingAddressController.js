import ShippingAddress from '../models/shippingAddress.js';

export const createAddress = async (req, res, next) => {
  try {
    const address = await ShippingAddress.create({
      user: req.user._id,
      ...req.body
    });
    res.status(201).json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
};

export const getUserAddresses = async (req, res, next) => {
  try {
    const addresses = await ShippingAddress.find({ user: req.user._id });
    res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const address = await ShippingAddress.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!address) {
      return res.status(404).json({ success: false, message: 'Dirección no encontrada' });
    }
    res.status(200).json({ success: true, message: 'Dirección eliminada' });
  } catch (error) {
    next(error);
  }
};
