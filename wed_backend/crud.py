from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas

# ---------- Customers ----------

def get_customers(db: Session) -> List[models.Customer]:
    return db.query(models.Customer).all()

def get_customer(db: Session, customer_id: int) -> Optional[models.Customer]:
    return db.query(models.Customer).filter(models.Customer.customer_id == customer_id).first()

def search_customers(db: Session, q: str) -> List[models.Customer]:
    return db.query(models.Customer).filter(
        (models.Customer.full_name.like(f"%{q}%")) |
        (models.Customer.phone.like(f"%{q}%"))
    ).all()

def create_customer(db: Session, data: schemas.CustomerCreate) -> models.Customer:
    obj = models.Customer(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_customer(db: Session, customer_id: int, data: schemas.CustomerUpdate) -> Optional[models.Customer]:
    obj = get_customer(db, customer_id)
    if not obj:
        return None
    for field, value in data.dict(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj

def delete_customer(db: Session, customer_id: int) -> bool:
    obj = get_customer(db, customer_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


# ---------- Services ----------

def get_services(db: Session) -> List[models.Service]:
    return db.query(models.Service).all()

def create_service(db: Session, data: schemas.ServiceCreate) -> models.Service:
    obj = models.Service(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


# ---------- Statuses ----------

def get_statuses(db: Session) -> List[models.Status]:
    return db.query(models.Status).all()


# ---------- Orders ----------

def get_orders(db: Session) -> List[models.Order]:
    return db.query(models.Order).all()

def get_order(db: Session, order_id: int) -> Optional[models.Order]:
    return db.query(models.Order).filter(models.Order.order_id == order_id).first()

def get_orders_by_status_id(db: Session, status_id: int) -> List[models.Order]:
    return db.query(models.Order).filter(models.Order.status_id == status_id).all()

def create_order(db: Session, data: schemas.OrderCreate) -> models.Order:
    obj = models.Order(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def update_order(db: Session, order_id: int, data: schemas.OrderUpdate) -> Optional[models.Order]:
    obj = get_order(db, order_id)
    if not obj:
        return None
    for field, value in data.dict(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj

def delete_order(db: Session, order_id: int) -> bool:
    obj = get_order(db, order_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


# ---------- Order Items ----------

def get_order_items(db: Session) -> List[models.OrderItem]:
    return db.query(models.OrderItem).all()

def get_order_items_for_order(db: Session, order_id: int) -> List[models.OrderItem]:
    return db.query(models.OrderItem).filter(models.OrderItem.order_id == order_id).all()

def create_order_item(db: Session, data: schemas.OrderItemCreate) -> models.OrderItem:
    obj = models.OrderItem(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def delete_order_item(db: Session, item_id: int) -> bool:
    obj = db.query(models.OrderItem).filter(models.OrderItem.item_id == item_id).first()
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


# ---------- Payments ----------

def get_payments(db: Session) -> List[models.Payment]:
    return db.query(models.Payment).all()

def get_payments_for_order(db: Session, order_id: int) -> List[models.Payment]:
    return db.query(models.Payment).filter(models.Payment.order_id == order_id).all()

def create_payment(db: Session, data: schemas.PaymentCreate) -> models.Payment:
    obj = models.Payment(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def delete_payment(db: Session, payment_id: int) -> bool:
    obj = db.query(models.Payment).filter(models.Payment.payment_id == payment_id).first()
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True

def update_order_status(db: Session, order_id: int, status_id: int) -> bool:
    order = get_order(db, order_id)
    if not order:
        return False

    order.status_id = status_id
    db.commit()
    db.refresh(order)
    return True

