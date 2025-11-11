import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminTabs(){
  const { pathname } = useLocation();
  const tab = pathname.startsWith("/admin/cupcakes") ? "cupcakes" : "orders";
  const base = "px-3 py-1.5 rounded-xl border text-sm";
  const active = "bg-gray-900 text-white border-gray-900";
  const idle = "bg-white text-gray-700 border-gray-300 hover:bg-gray-50";
  return (
    <div className="flex gap-2">
      <Link to="/admin/orders" className={`${base} ${tab==="orders"?active:idle}`}>Pedidos</Link>
      <Link to="/admin/cupcakes" className={`${base} ${tab==="cupcakes"?active:idle}`}>Cupcakes</Link>
    </div>
  );
}
