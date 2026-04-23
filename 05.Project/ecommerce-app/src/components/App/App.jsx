import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../../layout/Layout";
import { useAuthStore } from "../../stores/authStore";
import { useCartStore } from "../../stores/cartStore";
import Cart from "../../pages/Cart";
import CategoryPage from "../../pages/CategoryPage";
import Checkout from "../../pages/Checkout";
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import OrderConfirmation from "../../pages/OrderConfirmation";
import Orders from "../../pages/Orders";
import Product from "../../pages/Product";
import Profile from "../../pages/Profile";
import ProtectedRoute from "../../pages/ProtectedRoute";
import SearchResults from "../../pages/SearchResults";
import Settings from "../../pages/Settings";
import WishList from "../../pages/WishList";

function App() {
  const { user } = useAuthStore();
  const syncCart = useCartStore((state) => state.syncCartWithBackend);

  useEffect(() => {
    if (user?._id) {
      syncCart();
    }
  }, [user?._id, syncCart]);

  return (
    <BrowserRouter>
      <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/product/:productId" element={<Product />} />
              <Route path="/products" element={<Home />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute
                    redirectTo="/login"
                    allowedRoles={["admin", "customer", "cliente"]}
                  >
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <WishList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<div>Ruta no encontrada</div>} />
            </Routes>
          </Layout>
        </BrowserRouter>
  );
}

export default App;