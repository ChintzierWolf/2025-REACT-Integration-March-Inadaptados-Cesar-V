import products from '../data/products.json'
import { http } from './http';

export const fetchProducts = async () => {
    const data = await http.get("products");
    return data?.data || data || [];
};

export const getProductById = async (id) => {
    const data = await http.get(`products/${id}`);
    return data?.data || data || null;
};

export const getProductsByCategory = async (categoryId) => {
    return fetchProducts().then((data) => 
        data.filter((product) => product.category?._id === categoryId)
    );
};

export async function getProductById(id) {
    // Simulación de retraso y búsqueda en mock de data
    await new Promise((resolve) => setTimeout(() => resolve(), 1000));
    const product = await fetchProducts();
    return product.find((p) => p._id === id) || null;
}