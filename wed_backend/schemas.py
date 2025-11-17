from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# ---------- Customers ----------

class CustomerBase(BaseModel):
    full_name: str
    phone: Optional[str] = None
    line_id: Optional[str] = None
    address: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    line_id: Optional[str] = None
    address: Optional[str] = None

class Customer(CustomerBase):
    customer_id: int
    created_at: datetime

    class Config:
        orm_mode = True


# ---------- Status ----------

class Status(BaseModel):
    status_id: int
    status_name: str

    class Config:
        orm_mode = True


# ---------- Services ----------

class ServiceBase(BaseModel):
    service_name: str
    base_price: float
    unit: str

class ServiceCreate(ServiceBase):
    pass

class Service(ServiceBase):
    service_id: int

    class Config:
        orm_mode = True


# ---------- Order Items ----------

class OrderItemBase(BaseModel):
    order_id: int
    service_id: int
    item_desc: Optional[str] = None
    qty: float
    unit_price: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    item_id: int
    amount: Optional[float] = None

    class Config:
        orm_mode = True


# ---------- Payments ----------

class PaymentBase(BaseModel):
    order_id: int
    pay_datetime: datetime
    method: str
    amount: float
    remark: Optional[str] = None

class PaymentCreate(PaymentBase):
    pass

class Payment(PaymentBase):
    payment_id: int

    class Config:
        orm_mode = True


# ---------- Orders ----------

class OrderBase(BaseModel):
    customer_id: int
    status_id: int
    dropoff_datetime: datetime
    pickup_due_datetime: Optional[datetime] = None
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    status_id: Optional[int] = None
    pickup_due_datetime: Optional[datetime] = None
    notes: Optional[str] = None

class Order(OrderBase):
    order_id: int
    created_at: datetime
    customer: Customer
    status: Status
    items: List[OrderItem] = []
    payments: List[Payment] = []

    class Config:
        orm_mode = True
