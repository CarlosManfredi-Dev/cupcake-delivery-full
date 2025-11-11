import React, { createContext, useContext, useMemo, useState } from "react";

const CartCtx = createContext(null);
const AuthCtx = createContext(null);

export function useCart(){ return useContext(CartCtx); }
export function useAuth(){ return useContext(AuthCtx); }

export function Providers({children}){
  const [items, setItems] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const cart = useMemo(() => ({
    items,
    add: (cupcake) => setItems(prev => {
      const i = prev.findIndex(p => p.cupcake.id === cupcake.id);
      if(i >= 0){ const clone=[...prev]; clone[i]={...clone[i], qty: clone[i].qty+1}; return clone; }
      return [...prev, {cupcake, qty:1}];
    }),
    remove: (id) => setItems(prev => prev.filter(p => p.cupcake.id !== id)),
    changeQty: (id, qty) => setItems(prev => prev.map(p => p.cupcake.id===id? {...p, qty: Math.max(1, qty)}:p)),
    total: () => items.reduce((s, p) => s + p.cupcake.price * p.qty, 0),
    clear: () => setItems([])
  }), [items]);

  const auth = useMemo(() => ({
    token,
    set: (t) => { setToken(t); if(t) localStorage.setItem("token", t); else localStorage.removeItem("token"); }
  }), [token]);

  return (
    <AuthCtx.Provider value={auth}>
      <CartCtx.Provider value={cart}>{children}</CartCtx.Provider>
    </AuthCtx.Provider>
  );
}
