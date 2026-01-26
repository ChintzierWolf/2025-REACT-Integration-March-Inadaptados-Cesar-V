const API_URL = `${process.env.REACT_APP_API_URL}products`;


//export const getProducts = async () => {
//    try {
//        const response = await fetch(API_URL);
//        if (!response.ok) {
//            console.log('Network response was not ok');
//            throw new Error("Network response was not ok");
//        }
//
//        const data = await response.json();
//        return data;
//    } catch (error) {
//        console.log('Error fetching products:', error);
//        throw new Error("Error fetching products");
//    }
//};

export const getProducts = async () => {
    try {
        const response = await http.get("products", { params: { page, limit } });
        return response.data;
    } catch (error) {
        console.log("Error fetching products:", error);
        throw new Error("Error fetching products");
    }
};

export const getProductById = async (id) => {
    try {
        const response = await http.get(`products/${id}`);
        return response.data;
    } catch (error) {
        console.log("Error fetching product by id:", error);
        throw new Error("Error fetching product by id");
    }
};
