import http from '../utils/http';
import { fetchProducts as getAllProducts } from './productService';

export const fetchCategories = async () => {
  return await http.get('/categories');
};

export const fetchProducts = async () => {
  return await getAllProducts();
};

export const searchCategories = async (query) => {
  const lowerQuery = query.trim().toLowerCase();
  const data = await fetchCategories();
  
  return data.filter(
    (cat) =>
      cat.name.toLowerCase().includes(lowerQuery) ||
      cat.description?.toLowerCase().includes(lowerQuery)
  );
};

export const getCategoryById = async (categoryId) => {
  return await http.get(`/categories/${categoryId}`);
};

export const getChildCategories = async (parentCategoryId) => {
  const data = await fetchCategories();
  return data.filter((cat) => cat.parentCategory?._id === parentCategoryId);
};

export const getProductsByCategory = async (categoryId) => {
  return await http.get(`/products/category/${categoryId}`);
};

export const getProductsByCategoryAndChildren = async (categoryId) => {
  const allCategories = await fetchCategories();
  const category = allCategories.find((cat) => cat._id === categoryId);

  if (!category) return [];

  if (!category.parentCategory) {
    const childCategoryIds = allCategories
      .filter((cat) => cat.parentCategory?._id === categoryId)
      .map((cat) => cat._id);

    const allCategoryIds = [categoryId, ...childCategoryIds];
    
    const allProducts = await Promise.all(
      allCategoryIds.map((id) => http.get(`/products/category/${id}`))
    );
    
    return allProducts.flat();
  }

  return await getProductsByCategory(categoryId);
};

export const getParentCategories = async () => {
  const data = await fetchCategories();
  return data.filter((cat) => cat.parentCategory === null);
};
