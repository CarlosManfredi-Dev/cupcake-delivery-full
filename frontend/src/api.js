const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
export const publicApi = {
  cupcakes: () => fetch(`${API_URL}/api/cupcakes`).then(r => r.json()),
  order: (payload) => fetch(`${API_URL}/api/orders`, {
    method: "POST", headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
  }).then(async r => { if(!r.ok) throw new Error((await r.json()).detail); return r.json(); })
};

export const adminApi = (token) => ({
  login: async (username, password) => {
    const r = await fetch(`${API_URL}/api/auth/login`, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({username, password})});
    if(!r.ok) throw new Error("Login inválido"); return r.json();
  },
  listOrders: async () => {
    const r = await fetch(`${API_URL}/api/orders`, { headers: { Authorization: `Bearer ${token}` }});
    if(!r.ok) throw new Error("Erro ao listar pedidos"); return r.json();
  },
  patchOrder: async (id, status) => {
    const r = await fetch(`${API_URL}/api/orders/${id}`, { method:"PATCH", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}`}, body: JSON.stringify({status}) });
    if(!r.ok) throw new Error("Erro ao atualizar"); return r.json();
  },
  createCupcake: async (data) => {
    const r = await fetch(`${API_URL}/api/cupcakes`, { method:"POST", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}`}, body: JSON.stringify(data)});
    if(!r.ok) throw new Error("Erro ao criar"); return r.json();
  },
  updateCupcake: async (id, data) => {
    const r = await fetch(`${API_URL}/api/cupcakes/${id}`, { method:"PUT", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}`}, body: JSON.stringify(data)});
    if(!r.ok) throw new Error("Erro ao atualizar"); return r.json();
  },
  deleteCupcake: async (id) => {
    const r = await fetch(`${API_URL}/api/cupcakes/${id}`, { method:"DELETE", headers:{ Authorization:`Bearer ${token}` }});
    if(!r.ok) throw new Error("Erro ao excluir");
  }
});
