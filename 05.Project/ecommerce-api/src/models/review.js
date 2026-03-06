import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    // 👤 Usuario que hizo la reseña
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'La reseña debe estar asociada a un usuario'],
    },

    // 🎮 Producto reseñado
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'La reseña debe estar asociada a un producto'],
    },

    // ⭐ Calificación del producto (1 a 5)
    rating: {
      type: Number,
      required: [true, 'La calificación es obligatoria'],
      min: [1, 'La calificación mínima es 1'],
      max: [5, 'La calificación máxima es 5'],
    },

    // 💬 Comentario opcional del usuario
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'El comentario no puede exceder los 500 caracteres'],
    },
  },
  {
    // 🕒 Agrega createdAt y updatedAt automáticamente
    timestamps: true,
  }
);

// 🚫 Evita reseñas duplicadas por el mismo usuario en el mismo producto
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// 📊 Middleware para actualizar estadísticas del producto (ratingsAverage y ratingsQuantity)
reviewSchema.post('save', async function () {
  const Product = mongoose.model('Product');

  const stats = await this.constructor.aggregate([
    { $match: { product: this.product } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        numRatings: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(this.product, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].numRatings,
    });
  } else {
    await Product.findByIdAndUpdate(this.product, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;