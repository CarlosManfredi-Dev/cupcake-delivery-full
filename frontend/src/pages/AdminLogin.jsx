import React, { useState } from "react";
import { useAuth } from "../context";
import { adminApi } from "../api";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const { token, set } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setLoading(true);
    try {
      const api = adminApi();
      const { access_token } = await api.login(data.username, data.password);
      set(access_token);
      nav("/admin/orders");
    } catch (e) {
      alert("Login inválido");
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    nav("/admin/orders");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-sm mx-auto bg-white p-6 rounded-2xl shadow"
    >
      <h1 className="text-xl font-semibold mb-4">Admin</h1>
      <input
        name="username"
        placeholder="Usuário"
        className="w-full border rounded px-3 py-2 mb-3"
        required
      />
      <input
        name="password"
        placeholder="Senha"
        type="password"
        className="w-full border rounded px-3 py-2 mb-4"
        required
      />
      <button
        disabled={loading}
        className="w-full py-2 rounded-xl bg-gray-800 text-white hover:opacity-90 disabled:opacity-40"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
      <p className="text-xs text-gray-500 mt-3">
        Usuário: admin / Senha: admin123
      </p>
    </form>
  );
}
