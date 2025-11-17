from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import SessionLocal, engine
import models, schemas, crud

# Create tables if not exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Laundry Shop API")

# CORS (open in dev, can restrict later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- Health ----------

@app.get("/health")
def health_check():
    return {"status": "ok"}


# ---------- Customers ----------

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


# ---------- Services ----------

@app.get("/services", response_model=List[schemas.Service])
def list_services(db: Session = Depends(get_db)):
    return crud.get_services(db)

@app.post("/services", response_model=schemas.Service)
def create_service(payload: schemas.ServiceCreate, db: Session = Depends(get_db)):
    return crud.create_service(db, payload)


# ---------- Statuses ----------

@app.get("/statuses", response_model=List[schemas.Status])
def list_statuses(db: Session = Depends(get_db)):
    return crud.get_statuses(db)


# ---------- Orders ----------

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

@app.patch("/orders/{order_id}/status", response_model=schemas.Order)
def update_order_status(order_id: int, status_id: int, db: Session = Depends(get_db)):
    order = crud.update_order(db, order_id, schemas.OrderUpdate(status_id=status_id))
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.delete("/orders/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_order(db, order_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order deleted"}


# ---------- Order Items ----------

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


# ---------- Payments ----------

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
