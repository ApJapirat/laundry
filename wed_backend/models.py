from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, DECIMAL, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    phone = Column(String(20))
    line_id = Column(String(50))
    address = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

    orders = relationship("Order", back_populates="customer")


class Status(Base):
    __tablename__ = "statuses"

    status_id = Column(Integer, primary_key=True, index=True)
    status_name = Column(String(50), unique=True, nullable=False)

    orders = relationship("Order", back_populates="status")


class Service(Base):
    __tablename__ = "services"

    service_id = Column(Integer, primary_key=True, index=True)
    service_name = Column(String(80), nullable=False)
    base_price = Column(DECIMAL(10, 2), nullable=False)
    unit = Column(String(20), nullable=False)

    items = relationship("OrderItem", back_populates="service")


class Order(Base):
    __tablename__ = "orders"

    order_id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.customer_id"), nullable=False)
    status_id = Column(Integer, ForeignKey("statuses.status_id"), nullable=False)
    dropoff_datetime = Column(DateTime, nullable=False)
    pickup_due_datetime = Column(DateTime)
    notes = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

    customer = relationship("Customer", back_populates="orders")
    status = relationship("Status", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    item_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.service_id"), nullable=False)
    item_desc = Column(String(120))
    qty = Column(DECIMAL(10, 2), nullable=False)
    unit_price = Column(DECIMAL(10, 2), nullable=False)
    # MySQL generates this; we still map it so we can read it
    amount = Column(DECIMAL(10, 2))

    order = relationship("Order", back_populates="items")
    service = relationship("Service", back_populates="items")


class Payment(Base):
    __tablename__ = "payments"

    payment_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"), nullable=False)
    pay_datetime = Column(DateTime, nullable=False)
    method = Column(Enum("cash", "qr", "transfer", "card"), nullable=False)
    amount = Column(DECIMAL(10, 2), nullable=False)
    remark = Column(String(120))

    order = relationship("Order", back_populates="payments")
