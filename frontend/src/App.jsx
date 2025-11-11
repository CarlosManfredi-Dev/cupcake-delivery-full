import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Providers, useAuth } from "./context";
import Shop from "./pages/Shop";
import Checkout from "./pages/Checkout";
import AdminLogin from "./pages/AdminLogin";
import AdminOrders from "./pages/AdminOrders";
import AdminCupcakes from "./pages/AdminCupcakes";

function Nav() {
  const { token, set } = useAuth();
  const nav = useNavigate();
  return (
    <nav className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="font-bold text-pink-600">
          🧁 Cupcake Delivery
        </Link>
        <div className="ml-auto flex gap-3">
          <Link to="/" className="hover:underline">
            Loja
          </Link>
          <Link to="/checkout" className="hover:underline">
            Checkout
          </Link>
          <Link to="/admin" className="hover:underline">
            Admin
          </Link>
          {token && (
            <button
              className="text-sm text-gray-500 hover:underline"
              onClick={() => {
                set(null);
                nav("/admin");
              }}
            >
              Sair
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Providers>
      <Nav />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/cupcakes" element={<AdminCupcakes />} />
        </Routes>
      </main>
      <footer className="text-center text-xs text-gray-500 py-6">
        Desenvolvido por Luccas Romão {new Date().getFullYear()}
      </footer>
    </Providers>
  );
}
