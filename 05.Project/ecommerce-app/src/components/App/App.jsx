import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../../layout/Layout";
import { useAuthStore } from "../../stores/authStore";
import { useCartStore } from "../../stores/cartStore";
import Icon from "../common/Icon/Icon";

// Lazy loading de páginas
const Cart = lazy(() => import("../../pages/Cart"));
const CategoryPage = lazy(() => import("../../pages/CategoryPage"));
const Checkout = lazy(() => import("../../pages/Checkout"));
const Home = lazy(() => import("../../pages/Home"));
const Login = lazy(() => import("../../pages/Login"));
const Register = lazy(() => import("../../pages/Register"));
const OrderConfirmation = lazy(() => import("../../pages/OrderConfirmation"));
const Orders = lazy(() => import("../../pages/Orders"));
const Product = lazy(() => import("../../pages/Product"));
const Profile = lazy(() => import("../../pages/Profile"));
const ProtectedRoute = lazy(() => import("../../pages/ProtectedRoute"));
const SearchResults = lazy(() => import("../../pages/SearchResults"));
const Settings = lazy(() => import("../../pages/Settings"));
const WishList = lazy(() => import("../../pages/WishList"));

// Componente de carga simple
const PageLoader = () => (
  <div style={{ 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    height: "50vh",
    flexDirection: "column",
    gap: "16px",
    color: "var(--primary-color)"
  }}>
    <div className="spinner" style={{
      width: "40px",
      height: "40px",
      border: "4px solid rgba(0,0,0,0.1)",
      borderTop: "4px solid var(--primary-color)",
      borderRadius: "50%",
      animation: "spin 1s linear infinite"
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
    <p>Cargando...</p>
  </div>
);

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
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;