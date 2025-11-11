from typing import List, Optional
from sqlalchemy.orm import Session
from . import models, schemas

def list_cupcakes(db: Session) -> List[models.Cupcake]:
    return db.query(models.Cupcake).order_by(models.Cupcake.created_at.desc()).all()

def get_cupcake(db: Session, cupcake_id: int) -> Optional[models.Cupcake]:
    return db.query(models.Cupcake).filter(models.Cupcake.id == cupcake_id).first()

def create_cupcake(db: Session, data: schemas.CupcakeCreate) -> models.Cupcake:
    cupcake = models.Cupcake(**data.model_dump())
    db.add(cupcake); db.commit(); db.refresh(cupcake)
    return cupcake

def update_cupcake(db: Session, cupcake_id: int, data: schemas.CupcakeUpdate) -> Optional[models.Cupcake]:
    c = get_cupcake(db, cupcake_id)
    if not c: return None
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(c, k, v)
    db.commit(); db.refresh(c)
    return c

def delete_cupcake(db: Session, cupcake_id: int) -> bool:
    c = get_cupcake(db, cupcake_id)
    if not c: return False
    db.delete(c); db.commit(); return True

def create_order(db: Session, data: schemas.OrderCreate) -> models.Order:
    cupcakes_map = {c.id: c for c in db.query(models.Cupcake).filter(models.Cupcake.id.in_([i.cupcake_id for i in data.items])).all()}
    if any(i.cupcake_id not in cupcakes_map for i in data.items):
        raise ValueError("Cupcake inválido")
    order = models.Order(
        customer_name=data.customer_name,
        customer_phone=data.customer_phone,
        delivery_address=data.delivery_address,
        status="recebido",
        total=0.0
    )
    db.add(order); db.flush()
    total = 0.0
    for item in data.items:
        cupcake = cupcakes_map[item.cupcake_id]
        line_total = cupcake.price * item.quantity
        total += line_total
        db.add(models.OrderItem(
            order_id=order.id,
            cupcake_id=cupcake.id,
            quantity=item.quantity,
            unit_price=cupcake.price
        ))
    order.total = round(total, 2)
    db.commit(); db.refresh(order)
    return order

def list_orders(db: Session):
    return db.query(models.Order).order_by(models.Order.created_at.desc()).all()

def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()

def update_order_status(db: Session, order_id: int, status_str: str):
    o = get_order(db, order_id)
    if not o: return None
    o.status = status_str
    db.commit(); db.refresh(o)
    return o
