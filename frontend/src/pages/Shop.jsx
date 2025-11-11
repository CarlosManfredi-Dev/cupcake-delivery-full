import React, { useEffect, useState } from "react";
import { publicApi } from "../api";
import { useCart } from "../context";

export default function Shop(){
  const [loading, setLoading] = useState(true);
  const [cupcakes, setCupcakes] = useState([]);
  const { add } = useCart();

  useEffect(()=>{ (async ()=>{
    try { setCupcakes(await publicApi.cupcakes()); } finally { setLoading(false); }
  })(); }, []);

  if(loading) return <div>Carregando...</div>;

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {cupcakes.map(c => (
        <div key={c.id} className="bg-white rounded-2xl shadow p-4 flex flex-col">
          <img src={c.image_url || "https://picsum.photos/seed/placeholder/400/300"} alt={c.name} className="rounded-xl h-40 w-full object-cover"/>
          <div className="mt-3">
            <h3 className="font-semibold">{c.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{c.description}</p>
          </div>
          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="font-bold">R$ {c.price.toFixed(2)}</span>
            <button className="px-3 py-1.5 rounded-xl bg-pink-600 text-white hover:opacity-90" onClick={()=>add(c)}>Adicionar</button>
          </div>
        </div>
      ))}
    </div>
  );
}
