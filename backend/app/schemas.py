from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict

class CupcakeBase(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    description: str = Field(min_length=2, max_length=500)
    price: float = Field(ge=0)
    image_url: Optional[str] = None

class CupcakeCreate(CupcakeBase): pass

class CupcakeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(default=None, ge=0)
    image_url: Optional[str] = None

class CupcakeOut(CupcakeBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class OrderItemIn(BaseModel):
    cupcake_id: int
    quantity: int = Field(ge=1)

class OrderCreate(BaseModel):
    customer_name: str = Field(min_length=2, max_length=120)
    customer_phone: str = Field(min_length=6, max_length=40)
    delivery_address: str = Field(min_length=5, max_length=500)
    items: List[OrderItemIn]

class OrderItemOut(BaseModel):
    cupcake_id: int
    quantity: int
    unit_price: float
    model_config = ConfigDict(from_attributes=True)

class OrderOut(BaseModel):
    id: int
    customer_name: str
    customer_phone: str
    delivery_address: str
    status: str
    total: float
    items: List[OrderItemOut]
    model_config = ConfigDict(from_attributes=True)

class AdminLogin(BaseModel):
    username: str
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

class OrderStatusUpdate(BaseModel):
    status: str
