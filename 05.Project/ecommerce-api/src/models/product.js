import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // 🎮 Nombre del videojuego
    name: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
      maxLength: [100, 'El nombre no puede superar los 100 caracteres'],
    },

    // 📝 Descripción breve del juego
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxLength: [1000, 'La descripción no puede superar los 1000 caracteres'],
    },

    // 💰 Precio del producto
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [1, 'El precio mínimo debe ser 1'],
    },

    // 📦 Stock disponible
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
    },

    // 🖼️ URL de imagen del producto
    image: {
        type: String,
        default: 'https://placehold.co/800x600.png',
        trim: true,
    },

    // 🗂️ Categoría general (ej. "Videojuegos", "Accesorios")
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'La categoría es obligatoria'],
      index: true,
    },

    // 🕹️ Plataforma del videojuego
    platform: {
      type: String,
      enum: ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile'],
      required: false,
      index: true,
    },

    // 🎭 Género del videojuego
    genre: {
      type: String,
      enum: [
        'Action',
        'Adventure',
        'RPG',
        'Shooter',
        'Strategy',
        'Sports',
        'Puzzle',
      ],
      required: false,
    },

    // 📅 Fecha de lanzamiento
    releaseDate: {
      type: Date,
      required: false,
    },

    // ⭐ Promedio de calificaciones (de reseñas)
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'La calificación mínima es 1'],
      max: [5, 'La calificación máxima es 5'],
      set: val => Math.round(val * 10) / 10, // Redondeo a 1 decimal
    },

    // 🧮 Cantidad de reseñas recibidas
    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    // 🌟 Producto destacado
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    // 🕒 Agrega campos createdAt y updatedAt automáticamente
    timestamps: true,

    // Permite que los virtuals se incluyan en JSON y objetos
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;