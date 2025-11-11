import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context";
import { adminApi } from "../api";
import { Link, useNavigate } from "react-router-dom";
import AdminTabs from "../components/AdminTabs";

const STATUS = ["recebido","em_preparo","enviado","entregue","cancelado"];

export default function AdminOrders(){
  const { token } = useAuth();
  const nav = useNavigate();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(()=>{
    if(!token){ nav("/admin"); return; }
    const api = adminApi(token);
    api.listOrders().then(setOrders).catch(()=>alert("Erro ao buscar pedidos"));
  }, [token]);

  const filtered = useMemo(()=> statusFilter? orders.filter(o=>o.status===statusFilter) : orders, [orders, statusFilter]);

  const updateStatus = async (id, status) => {
    const api = adminApi(token);
    try {
      const u = await api.patchOrder(id, status);
      setOrders(prev => prev.map(o => o.id===id? u:o));
    } catch { alert("Falha ao atualizar"); }
  };

  if(!token) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl font-semibold">Admin</h1>
        <div className="ml-auto"><AdminTabs/></div>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold">Pedidos</h2>
        <select className="border rounded px-2 py-1 ml-auto" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          <option value="">Todos</option>
          {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="space-y-3">
        {filtered.map(o => (
          <div key={o.id} className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center gap-3">
              <div className="font-semibold">#{o.id}</div>
              <div className="text-sm text-gray-500">R$ {o.total.toFixed(2)}</div>
              <div className="ml-auto">
                <select className="border rounded px-2 py-1" value={o.status} onChange={e=>updateStatus(o.id, e.target.value)}>
                  {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-700 mt-2">{o.customer_name} · {o.customer_phone}</div>
            <div className="text-xs text-gray-500">{o.delivery_address}</div>
            <ul className="mt-3 text-sm list-disc ml-5">
              {o.items.map((it, idx) => (
                <li key={idx}>Cupcake #{it.cupcake_id} x {it.quantity} — R$ {it.unit_price.toFixed(2)}</li>
              ))}
            </ul>
          </div>
        ))}
        {filtered.length===0 && <div className="text-sm text-gray-500">Sem pedidos.</div>}
      </div>
      <div className="mt-8">
        <Link to="/" className="text-sm underline">← Voltar para loja</Link>
      </div>
    </div>
  );
}
