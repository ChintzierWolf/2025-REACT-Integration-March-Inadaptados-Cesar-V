import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../../layout/Layout";
import { useAuthStore } from "../../stores/authStore";
import { useCartStore } from "../../stores/cartStore";
import ErrorBoundary from "../common/ErrorBoundary/ErrorBoundary";
import RouteErrorBoundary from "../common/ErrorBoundary/RouteErrorBoundary";
import Icon from "../common/Icon/Icon";

// Lazy loading de páginas
import Home from "../../pages/Home";
import Cart from "../../pages/Cart";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import Product from "../../pages/Product";
import SearchResults from "../../pages/SearchResults";
import CategoryPage from "../../pages/CategoryPage";
import Profile from "../../pages/Profile";

// Lazy loading solo para rutas pesadas o menos frecuentes
const Checkout = lazy(() => import("../../pages/Checkout"));
const OrderConfirmation = lazy(() => import("../../pages/OrderConfirmation"));
const Orders = lazy(() => import("../../pages/Orders"));
const ProtectedRoute = lazy(() => import("../../pages/ProtectedRoute"));
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
      <ErrorBoundary>
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<RouteErrorBoundary><Home /></RouteErrorBoundary>} />
              <Route path="/cart" element={<RouteErrorBoundary><Cart /></RouteErrorBoundary>} />
              <Route path="/login" element={<RouteErrorBoundary><Login /></RouteErrorBoundary>} />
              <Route path="/register" element={<RouteErrorBoundary><Register /></RouteErrorBoundary>} />
              <Route path="/search" element={<RouteErrorBoundary><SearchResults /></RouteErrorBoundary>} />
              <Route path="/product/:productId" element={<RouteErrorBoundary><Product /></RouteErrorBoundary>} />
              <Route path="/products" element={<RouteErrorBoundary><Home /></RouteErrorBoundary>} />
              <Route path="/category/:categoryId" element={<RouteErrorBoundary><CategoryPage /></RouteErrorBoundary>} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute
                    redirectTo="/login"
                    allowedRoles={["admin", "customer", "cliente"]}
                  >
                    <RouteErrorBoundary><Profile /></RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary><Checkout /></RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary><WishList /></RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary><Orders /></RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route path="/order-confirmation" element={<RouteErrorBoundary><OrderConfirmation /></RouteErrorBoundary>} />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <RouteErrorBoundary><Settings /></RouteErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<div>Ruta no encontrada</div>} />
            </Routes>
          </Suspense>
        </Layout>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;