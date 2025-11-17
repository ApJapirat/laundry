from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import SessionLocal, engine
import models, schemas, crud

# Create DB tables if not exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Laundry Shop API")

# ------------------- CORS -------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------- DB ---------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------------- Health -----------------
@app.get("/health")
def health_check():
    return {"status": "ok"}

# ------------------- CUSTOMERS ---------------
@app.get("/customers", response_model=List[schemas.Customer])
def list_customers(db: Session = Depends(get_db)):
    return crud.get_customers(db)

@app.get("/customers/{customer_id}", response_model=schemas.Customer)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = crud.get_customer(db, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@app.get("/customers/search", response_model=List[schemas.Customer])
def search_customers(
    q: str = Query(..., description="search by name or phone"),
    db: Session = Depends(get_db),
):
    return crud.search_customers(db, q)

@app.post("/customers", response_model=schemas.Customer)
def create_customer(payload: schemas.CustomerCreate, db: Session = Depends(get_db)):
    return crud.create_customer(db, payload)

@app.patch("/customers/{customer_id}", response_model=schemas.Customer)
def update_customer(
    customer_id: int,
    payload: schemas.CustomerUpdate,
    db: Session = Depends(get_db),
):
    customer = crud.update_customer(db, customer_id, payload)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@app.delete("/customers/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_customer(db, customer_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"message": "Customer deleted"}

# ------------------- SERVICES ----------------
@app.get("/services", response_model=List[schemas.Service])
def list_services(db: Session = Depends(get_db)):
    return crud.get_services(db)

@app.post("/services", response_model=schemas.Service)
def create_service(payload: schemas.ServiceCreate, db: Session = Depends(get_db)):
    return crud.create_service(db, payload)

# ------------------- STATUSES ----------------
@app.get("/statuses", response_model=List[schemas.Status])
def list_statuses(db: Session = Depends(get_db)):
    return crud.get_statuses(db)

# ------------------- ORDERS ------------------
@app.get("/orders", response_model=List[schemas.Order])
def list_orders(db: Session = Depends(get_db)):
    return crud.get_orders(db)

@app.get("/orders/{order_id}", response_model=schemas.Order)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = crud.get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.get("/orders/status/{status_id}", response_model=List[schemas.Order])
def get_orders_by_status(status_id: int, db: Session = Depends(get_db)):
    return crud.get_orders_by_status_id(db, status_id)

@app.post("/orders", response_model=schemas.Order)
def create_order(payload: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db, payload)

@app.patch("/orders/{order_id}", response_model=schemas.Order)
def update_order(
    order_id: int,
    payload: schemas.OrderUpdate,
    db: Session = Depends(get_db),
):
    order = crud.update_order(db, order_id, payload)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# -------------- FIXED STATUS ENDPOINT -----------------
# ❗ Your frontend uses PUT + JSON body → THIS is the correct endpoint.
@app.put("/orders/{order_id}/status")
def update_order_status(order_id: int, payload: dict, db: Session = Depends(get_db)):
    status_id = payload.get("status_id")
    updated = crud.update_order_status(db, order_id, status_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Status updated"}

# ------------------- ORDER ITEMS -----------------------
@app.get("/order_items", response_model=List[schemas.OrderItem])
def list_order_items(db: Session = Depends(get_db)):
    return crud.get_order_items(db)

@app.get("/orders/{order_id}/items", response_model=List[schemas.OrderItem])
def list_order_items_for_order(order_id: int, db: Session = Depends(get_db)):
    return crud.get_order_items_for_order(db, order_id)

@app.post("/order_items", response_model=schemas.OrderItem)
def create_order_item(payload: schemas.OrderItemCreate, db: Session = Depends(get_db)):
    return crud.create_order_item(db, payload)

@app.delete("/order_items/{item_id}")
def delete_order_item(item_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_order_item(db, item_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Order item not found")
    return {"message": "Order item deleted"}

# ------------------- PAYMENTS --------------------------
@app.get("/payments", response_model=List[schemas.Payment])
def list_payments(db: Session = Depends(get_db)):
    return crud.get_payments(db)

@app.get("/orders/{order_id}/payments", response_model=List[schemas.Payment])
def list_payments_for_order(order_id: int, db: Session = Depends(get_db)):
    return crud.get_payments_for_order(db, order_id)

@app.post("/payments", response_model=schemas.Payment)
def create_payment(payload: schemas.PaymentCreate, db: Session = Depends(get_db)):
    return crud.create_payment(db, payload)

@app.delete("/payments/{payment_id}")
def delete_payment(payment_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_payment(db, payment_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Payment not found")
    return {"message": "Payment deleted"}

# ------------------- DASHBOARD STATS --------------------
from sqlalchemy import func

@app.get("/stats/summary")
def stats_summary(db: Session = Depends(get_db)):
    total_orders = db.query(models.Order).count()

    total_revenue = db.query(func.sum(models.Payment.amount)).scalar() or 0

    today = func.date(func.now())
    today_revenue = (
        db.query(func.sum(models.Payment.amount))
        .filter(func.date(models.Payment.pay_datetime) == today)
        .scalar()
        or 0
    )

    pending = db.query(models.Order).filter(models.Order.status_id == 1).count()
    washing = db.query(models.Order).filter(models.Order.status_id == 2).count()
    drying = db.query(models.Order).filter(models.Order.status_id == 3).count()
    ironing = db.query(models.Order).filter(models.Order.status_id == 4).count()
    ready = db.query(models.Order).filter(models.Order.status_id == 5).count()
    picked_up = db.query(models.Order).filter(models.Order.status_id == 6).count()

    return {
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "today_revenue": today_revenue,
        "pending": pending,
        "washing": washing,
        "drying": drying,
        "ironing": ironing,
        "ready": ready,
        "picked_up": picked_up,
    }


@app.get("/stats/orders_by_status")
def stats_orders_by_status(db: Session = Depends(get_db)):
    rows = (
        db.query(models.Status.status_name, func.count(models.Order.order_id))
        .join(models.Order, models.Status.status_id == models.Order.status_id)
        .group_by(models.Status.status_name)
        .all()
    )

    return [{"status": r[0], "count": r[1]} for r in rows]


@app.get("/stats/revenue_7_days")
def stats_revenue_last7(db: Session = Depends(get_db)):
    rows = (
        db.query(
            func.date(models.Payment.pay_datetime),
            func.sum(models.Payment.amount)
        )
        .group_by(func.date(models.Payment.pay_datetime))
        .order_by(func.date(models.Payment.pay_datetime).desc())
        .limit(7)
        .all()
    )

    return [
        {"date": str(row[0]), "amount": row[1] or 0}
        for row in rows
    ]
