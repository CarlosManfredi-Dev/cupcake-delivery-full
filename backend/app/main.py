import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from .database import Base, engine, get_db
from . import models, schemas, crud, auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cupcake Delivery API", version="0.2.0")

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/auth/login", response_model=schemas.TokenOut)
def login(payload: schemas.AdminLogin):
    if not auth.verify_admin(payload.username, payload.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
    token = auth.create_access_token(sub=payload.username)
    return schemas.TokenOut(access_token=token)

# Público
@app.get("/api/cupcakes", response_model=List[schemas.CupcakeOut])
def get_cupcakes(db: Session = Depends(get_db)):
    return crud.list_cupcakes(db)

@app.get("/api/cupcakes/{cupcake_id}", response_model=schemas.CupcakeOut)
def get_cupcake(cupcake_id: int, db: Session = Depends(get_db)):
    c = crud.get_cupcake(db, cupcake_id)
    if not c:
        raise HTTPException(status_code=404, detail="Cupcake não encontrado")
    return c

@app.post("/api/orders", response_model=schemas.OrderOut, status_code=201)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    try:
        o = crud.create_order(db, order)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {
        "id": o.id,
        "customer_name": o.customer_name,
        "customer_phone": o.customer_phone,
        "delivery_address": o.delivery_address,
        "status": o.status,
        "total": o.total,
        "items": [{"cupcake_id": it.cupcake_id, "quantity": it.quantity, "unit_price": it.unit_price} for it in o.items]
    }

# Admin (JWT)
@app.post("/api/cupcakes", response_model=schemas.CupcakeOut, status_code=201)
def create_cupcake(data: schemas.CupcakeCreate, db: Session = Depends(get_db), _admin: str = Depends(auth.get_current_admin)):
    return crud.create_cupcake(db, data)

@app.put("/api/cupcakes/{cupcake_id}", response_model=schemas.CupcakeOut)
def update_cupcake(cupcake_id: int, data: schemas.CupcakeUpdate, db: Session = Depends(get_db), _admin: str = Depends(auth.get_current_admin)):
    c = crud.update_cupcake(db, cupcake_id, data)
    if not c: raise HTTPException(status_code=404, detail="Cupcake não encontrado")
    return c

@app.delete("/api/cupcakes/{cupcake_id}", status_code=204)
def delete_cupcake(cupcake_id: int, db: Session = Depends(get_db), _admin: str = Depends(auth.get_current_admin)):
    ok = crud.delete_cupcake(db, cupcake_id)
    if not ok: raise HTTPException(status_code=404, detail="Cupcake não encontrado")
    return

@app.get("/api/orders", response_model=List[schemas.OrderOut])
def get_orders(db: Session = Depends(get_db), _admin: str = Depends(auth.get_current_admin)):
    res = []
    for o in crud.list_orders(db):
        res.append({
            "id": o.id,
            "customer_name": o.customer_name,
            "customer_phone": o.customer_phone,
            "delivery_address": o.delivery_address,
            "status": o.status,
            "total": o.total,
            "items": [{"cupcake_id": it.cupcake_id, "quantity": it.quantity, "unit_price": it.unit_price} for it in o.items]
        })
    return res

@app.get("/api/orders/{order_id}", response_model=schemas.OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db), _admin: str = Depends(auth.get_current_admin)):
    o = crud.get_order(db, order_id)
    if not o: raise HTTPException(status_code=404, detail="Pedido não encontrado")
    return {
        "id": o.id,
        "customer_name": o.customer_name,
        "customer_phone": o.customer_phone,
        "delivery_address": o.delivery_address,
        "status": o.status,
        "total": o.total,
        "items": [{"cupcake_id": it.cupcake_id, "quantity": it.quantity, "unit_price": it.unit_price} for it in o.items]
    }

@app.patch("/api/orders/{order_id}", response_model=schemas.OrderOut)
def patch_order(order_id: int, data: schemas.OrderStatusUpdate, db: Session = Depends(get_db), _admin: str = Depends(auth.get_current_admin)):
    if data.status not in {"recebido","em_preparo","enviado","entregue","cancelado"}:
        raise HTTPException(status_code=400, detail="Status inválido")
    o = crud.update_order_status(db, order_id, data.status)
    if not o: raise HTTPException(status_code=404, detail="Pedido não encontrado")
    return {
        "id": o.id,
        "customer_name": o.customer_name,
        "customer_phone": o.customer_phone,
        "delivery_address": o.delivery_address,
        "status": o.status,
        "total": o.total,
        "items": [{"cupcake_id": it.cupcake_id, "quantity": it.quantity, "unit_price": it.unit_price} for it in o.items]
    }
