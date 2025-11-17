from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class CustomerBase(BaseModel):
    full_name: str
    phone: Optional[str]
    line_id: Optional[str]
    address: Optional[str]

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    customer_id: int
    created_at: datetime

    class Config:
        orm_mode = True


class Status(BaseModel):
    status_id: int
    status_name: str
    class Config:
        orm_mode = True


class Service(BaseModel):
    service_id: int
    service_name: str
    base_price: float
    unit: str
    class Config:
        orm_mode = True


class OrderItem(BaseModel):
    item_id: int
    service_id: int
    item_desc: Optional[str]
    qty: float
    unit_price: float
    class Config:
        orm_mode = True


class Payment(BaseModel):
    payment_id: int
    pay_datetime: datetime
    method: str
    amount: float
    remark: Optional[str]
    class Config:
        orm_mode = True


class OrderBase(BaseModel):
    customer_id: int
    status_id: int
    dropoff_datetime: datetime
    pickup_due_datetime: Optional[datetime]
    notes: Optional[str]

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    order_id: int
    created_at: datetime
    customer: Customer
    status: Status
    items: List[OrderItem] = []
    payments: List[Payment] = []

    class Config:
        orm_mode = True
