import WishList from '../models/wishList.js';

export const toggleWishlistItem = async (req, res, next) => {
  try {
    const { productId } = req.body;
    let wishList = await WishList.findOne({ user: req.user._id });

    if (!wishList) {
      wishList = await WishList.create({ user: req.user._id, products: [productId] });
      return res.status(201).json({ success: true, message: 'Agregado a WishList', data: wishList });
    }

    const index = wishList.products.findIndex(p => p.toString() === productId);
    if (index > -1) {
      wishList.products.splice(index, 1);
    } else {
      wishList.products.push(productId);
    }
    
    await wishList.save();
    res.status(200).json({ success: true, message: 'WishList actualizada', data: wishList });
  } catch (error) {
    next(error);
  }
};

export const getWishList = async (req, res, next) => {
  try {
    const wishList = await WishList.findOne({ user: req.user._id }).populate('products');
    if (!wishList) {
      return res.status(200).json({ success: true, data: { products: [] } });
    }
    res.status(200).json({ success: true, data: wishList });
  } catch (error) {
    next(error);
  }
};
