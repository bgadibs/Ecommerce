import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});


// =====================================
// ADD TOKEN TO EVERY REQUEST
// =====================================

API.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;

    },
    (error) => {
        return Promise.reject(error);
    }
);


// =====================================
// AUTH
// =====================================

export const registerUser = (userData) =>
    API.post("/auth/register", userData);

export const loginUser = (userData) =>
    API.post("/auth/login", userData);


// =====================================
// PRODUCTS
// =====================================

export const getProducts = () =>
    API.get("/products");

export const getProductById = (id) =>
    API.get(`/products/${id}`);


// =====================================
// CART
// =====================================

// GET CART
export const getCart = () =>
    API.get("/cart");


// ADD TO CART
export const addToCart = (
    productId,
    quantity = 1
) =>
    API.post("/cart", {
        product_id: productId,
        quantity: quantity
    });


// UPDATE CART QUANTITY
export const updateCartQuantity = async (
    productId,
    quantity
) => {

    console.log("Updating cart:");
    console.log("Product ID:", productId);
    console.log("Quantity:", quantity);

    const response = await API.put(
        `/cart/${productId}`,
        {
            quantity: quantity
        }
    );

    console.log(
        "Update response:",
        response.data
    );

    return response.data;
};


// REMOVE FROM CART
export const removeFromCart = (
    productId
) =>
    API.delete(`/cart/${productId}`);


// =====================================
// WISHLIST
// =====================================

// GET WISHLIST
export const getWishlist = () =>
    API.get("/wishlist");


// ADD TO WISHLIST
export const addToWishlist = (
    productId
) =>
    API.post("/wishlist", {
        product_id: productId
    });


// REMOVE FROM WISHLIST
export const removeFromWishlist = (
    productId
) =>
    API.delete(`/wishlist/${productId}`);


// =====================================
// ORDERS
// =====================================

// CREATE ORDER
export const createOrder = (
    orderData
) =>
    API.post("/orders", orderData);


// GET MY ORDERS
export const getMyOrders = () =>
    API.get("/orders");


// GET ORDER DETAILS
export const getOrderDetails = (
    orderId
) =>
    API.get(`/orders/${orderId}`);


// =====================================
// SEARCH PRODUCTS
// =====================================

export const searchProducts = (
    search
) =>
    API.get(
        `/products/search?search=${encodeURIComponent(search)}`
    );


// =====================================
// ADMIN PRODUCTS
// =====================================

export const createProduct = (
    productData
) =>
    API.post("/products", productData);

export const updateProduct = (
    id,
    productData
) =>
    API.put(
        `/products/${id}`,
        productData
    );

export const deleteProduct = (
    id
) =>
    API.delete(`/products/${id}`);


// =====================================
// CATEGORIES
// =====================================

export const getCategories = () =>
    API.get("/categories");

export const createCategory = (
    categoryData
) =>
    API.post(
        "/categories",
        categoryData
    );

export const updateCategory = (
    id,
    categoryData
) =>
    API.put(
        `/categories/${id}`,
        categoryData
    );

export const deleteCategory = (
    id
) =>
    API.delete(`/categories/${id}`);


// =====================================
// USERS
// =====================================

export const getUsers = () =>
    API.get("/users");

export const searchUsers = (
    search
) =>
    API.get(
        `/users/search?q=${encodeURIComponent(search)}`
    );

export const deleteUser = (
    id
) =>
    API.delete(`/users/${id}`);


// =====================================
// PROFILE
// =====================================

export const getProfile = () =>
    API.get("/profile");


export const updateProfile = (
    profileData
) =>
    API.put(
        "/profile",
        profileData
    );

// =====================================
// SUPER ADMIN
// =====================================

export const getSuperAdminDashboard = () => {

    const token =
        localStorage.getItem("adminToken");

    return API.get(
        "/superadmin/dashboard",
        {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );

};


export const getSuperAdmins = () => {

    const token =
        localStorage.getItem("adminToken");

    return API.get(
        "/superadmin/admins",
        {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );

};


export const deleteSuperAdminAdmin = (id) => {

    const token =
        localStorage.getItem("adminToken");

    return API.delete(
        `/superadmin/admins/${id}`,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );

};
// =====================================
// EXPORT API
// =====================================

export default API;