import Review from "../models/review.js";

// Crear una Reseña
export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const review = await Review.create({
      user: req.user._id, // asumiendo authMiddleware
      product: productId,
      rating,
      comment,
    });
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Ya enviaste una reseña para este producto.",
        });
    }
    next(error);
  }
};

// Obtener revisiones de un producto
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).populate(
      "user",
      "displayName",
    );
    res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

// Eliminar una reseña
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review no encontrada" });

    // Validar autorización
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({
          success: false,
          message: "No tienes permiso para eliminar esta reseña",
        });
    }

    await review.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Review eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};
