import products from '../data/products.json'
import { http } from './http';

export const fetchProducts = async ( page= 1, limit= 10) => {
    const data = await http.get(`products?page=${page}&limit=${limit}`);
    return data || { products: [], pagination: { total: 0 } };
};

export const searchProducts = async(
    // aqui, dentro de searchProducts, se encuentra cada uno de los parametros que se envian desde el componente Search
    // y que se utilizan para filtrar los productos
    // por ejemplo, si el usuario escribe "laptop" en el buscador, se envia el parametro q="laptop"
    // si el usuario selecciona una categoria, se envia el parametro category="categoria"
    // si el usuario selecciona un rango de precios, se envia el parametro minPrice="precio"
    // si el usuario selecciona un rango de precios, se envia el parametro maxPrice="precio"
    // si el usuario selecciona "en stock", se envia el parametro inStock="true"
    // si el usuario selecciona un orden, se envia el parametro sort="orden"
    // si el usuario selecciona una pagina, se envia el parametro page="pagina"
    // si el usuario selecciona un limite, se envia el parametro limit="limite"
    // y se envian todos los parametros a la funcion searchProduct

    q="",
    category="",
    minPrice,
    maxPrice,
    inStock,
    sort,
    order,
    page = 1,
    limit = 10
) => {
    const params = new URLSearchParams({
        // aquí, dentro de URLSearchParams, que es un objeto, me va a ayudar a filtrar cada uno de los parametros
        // que va a ir anexando por cada una de las clases definidas anteriormente y que se van a ir enviando a la API

        ...(q && { q }),
        ...(category && { category }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(inStock !== undefined && { inStock }),
        ...(sort && { sort }),
        ...(order && { order }),
        page,
        limit,
    });
    const data = await http.get(`products/search?${params.toString()}`);
    return data || [];
};

export const getProductsByCategory = async (categoryId, page = 1, limit = 10) => {
    const params = new URLSearchParams({
        category: categoryId,
        page,
        limit,
    });
    const data = await http.get(`products/category/${categoryId}?${params.toString()}`);
    return data || [];
};

export const getProductById = async (id) => {
    const data = await http.get(`products/${id}`);
    return data || null;
};

export const createProduct = async (product) => {
    const data = await http.post(`products`, product);
    return data || { products: [], pagination: { total: 0 } };
}