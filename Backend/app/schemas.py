from pydantic import BaseModel, EmailStr
from typing import List

class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float
    quantity: int

class CustomerCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]
