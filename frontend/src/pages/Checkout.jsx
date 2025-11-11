import React from "react";
import { useCart } from "../context";
import { publicApi } from "../api";
import { useNavigate } from "react-router-dom";

export default function Checkout(){
  const { items, changeQty, remove, total, clear } = useCart();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const payload = {
      customer_name: data.name,
      customer_phone: data.phone,
      delivery_address: data.address,
      items: items.map(i => ({ cupcake_id: i.cupcake.id, quantity: Number(i.qty) }))
    };
    try{
      const res = await publicApi.order(payload);
      clear();
      alert(`Pedido #${res.id} criado! Total: R$ ${res.total.toFixed(2)}`);
      nav("/");
    }catch(err){
      alert(err.message || "Falha ao criar pedido");
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <section>
        <h2 className="text-lg font-semibold mb-3">Seu carrinho</h2>
        {items.length===0 ? <div className="text-sm text-gray-500">Carrinho vazio.</div> : (
          <ul className="space-y-3">
            {items.map(({cupcake, qty}) => (
              <li key={cupcake.id} className="bg-white rounded-xl shadow p-3 flex items-center gap-3">
                <img src={cupcake.image_url || "https://picsum.photos/seed/placeholder/100/80"} className="w-20 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="font-medium">{cupcake.name}</div>
                  <div className="text-xs text-gray-600">R$ {cupcake.price.toFixed(2)}</div>
                </div>
                <input type="number" min="1" value={qty} onChange={e=>changeQty(cupcake.id, Number(e.target.value))} className="w-16 border rounded px-2 py-1"/>
                <button onClick={()=>remove(cupcake.id)} className="text-sm text-gray-500 hover:underline">Remover</button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 font-semibold">Total: R$ {total().toFixed(2)}</div>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-3">Dados para entrega</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <input required name="name" placeholder="Nome completo" className="w-full border rounded px-3 py-2"/>
          <input required name="phone" placeholder="Telefone" className="w-full border rounded px-3 py-2"/>
          <textarea required name="address" placeholder="Endereço completo" className="w-full border rounded px-3 py-2 h-24"></textarea>
          <button disabled={items.length===0} className="w-full py-2 rounded-xl bg-pink-600 text-white hover:opacity-90 disabled:opacity-40">Finalizar Pedido</button>
        </form>
      </section>
    </div>
  );
}
