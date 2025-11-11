import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context";
import { publicApi, adminApi } from "../api";
import { useNavigate } from "react-router-dom";
import AdminTabs from "../components/AdminTabs";

function RowEditor({ row, onCancel, onSave }){
  const [form, setForm] = useState({
    name: row?.name ?? "",
    description: row?.description ?? "",
    price: row?.price ?? 0,
    image_url: row?.image_url ?? ""
  });

  const isEdit = !!row?.id;
  const canSave = form.name.trim().length >= 2 && form.description.trim().length >= 2 && Number(form.price) >= 0;

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold mb-3">{isEdit? `Editar #${row.id}` : "Novo Cupcake"}</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <input className="border rounded px-3 py-2" placeholder="Nome" value={form.name} onChange={e=>setForm(f=>({...f, name: e.target.value}))}/>
        <input className="border rounded px-3 py-2" placeholder="Preço (ex: 9.90)" type="number" min="0" step="0.01" value={form.price} onChange={e=>setForm(f=>({...f, price: e.target.value}))}/>
        <input className="border rounded px-3 py-2 sm:col-span-2" placeholder="URL da imagem (opcional)" value={form.image_url} onChange={e=>setForm(f=>({...f, image_url: e.target.value}))}/>
        <textarea className="border rounded px-3 py-2 sm:col-span-2 h-24" placeholder="Descrição" value={form.description} onChange={e=>setForm(f=>({...f, description: e.target.value}))}/>
      </div>
      <div className="flex gap-2 mt-4">
        <button disabled={!canSave} onClick={()=>onSave(form)} className="px-4 py-2 rounded-xl bg-gray-900 text-white disabled:opacity-40">
          {isEdit? "Salvar" : "Criar"}
        </button>
        <button onClick={onCancel} className="px-4 py-2 rounded-xl border">Cancelar</button>
      </div>
    </div>
  );
}

export default function AdminCupcakes(){
  const { token } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cupcakes, setCupcakes] = useState([]);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const api = useMemo(()=> token ? adminApi(token) : null, [token]);

  useEffect(()=>{
    if(!token){ nav("/admin"); return; }
    (async ()=>{
      try { setCupcakes(await publicApi.cupcakes()); }
      finally { setLoading(false); }
    })();
  }, [token]);

  const refresh = async ()=>{
    const data = await publicApi.cupcakes();
    setCupcakes(data);
  };

  const onCreate = async (payload)=>{
    if(!api) return;
    try{
      await api.createCupcake({
        name: payload.name.trim(),
        description: payload.description.trim(),
        price: Number(payload.price),
        image_url: payload.image_url?.trim() || null
      });
      setCreating(false);
      await refresh();
    }catch(e){ alert(e.message || "Erro ao criar"); }
  };

  const onUpdate = async (id, payload)=>{
    if(!api) return;
    try{
      await api.updateCupcake(id, {
        name: payload.name.trim(),
        description: payload.description.trim(),
        price: Number(payload.price),
        image_url: payload.image_url?.trim() || null
      });
      setEditingId(null);
      await refresh();
    }catch(e){ alert(e.message || "Erro ao atualizar"); }
  };

  const onDelete = async (id)=>{
    if(!api) return;
    if(!confirm(`Excluir cupcake #${id}?`)) return;
    try{
      await api.deleteCupcake(id);
      await refresh();
    }catch(e){ alert(e.message || "Erro ao excluir"); }
  };

  if(!token) return null;
  if(loading) return <div>Carregando...</div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl font-semibold">Admin</h1>
        <div className="ml-auto"><AdminTabs/></div>
      </div>

      {!creating && (
        <button onClick={()=>setCreating(true)} className="mb-4 px-4 py-2 rounded-xl bg-pink-600 text-white">
          + Novo Cupcake
        </button>
      )}

      {creating && (
        <div className="mb-6">
          <RowEditor onCancel={()=>setCreating(false)} onSave={onCreate}/>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cupcakes.map(c => (
          <div key={c.id} className="bg-white rounded-2xl shadow p-4 flex flex-col">
            {editingId === c.id ? (
              <RowEditor row={c} onCancel={()=>setEditingId(null)} onSave={(f)=>onUpdate(c.id, f)} />
            ) : (
              <>
                <img src={c.image_url || "https://picsum.photos/seed/placeholder/400/300"} alt={c.name} className="rounded-xl h-40 w-full object-cover"/>
                <div className="mt-3">
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{c.description}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className="font-bold">R$ {c.price.toFixed(2)}</span>
                  <div className="flex gap-2">
                    <button onClick={()=>setEditingId(c.id)} className="px-3 py-1.5 rounded-xl border">Editar</button>
                    <button onClick={()=>onDelete(c.id)} className="px-3 py-1.5 rounded-xl border text-red-600">Excluir</button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {cupcakes.length===0 && !creating && (
        <div className="text-sm text-gray-500 mt-6">Nenhum cupcake cadastrado.</div>
      )}
    </div>
  );
}
