import { http } from "./http";

const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}products`;

export const fetchProducts = async ()=> {
    const data = await http.get("products");
    return data?.data || data || [];
};

export async function getProductById (id) {
  await new Promise((res) => setTimeout(() => res(), 1000));
   const products = await fetchProducts();
   const product = products.find((product) => product.id === id);
   return product;
};
