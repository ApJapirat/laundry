from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, crud, schemas

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------------------
# Customers
# ---------------------------
@app.get("/customers", response_model=list[schemas.Customer])
def list_customers(db: Session = Depends(get_db)):
    return crud.get_customers(db)

@app.post("/customers", response_model=schemas.Customer)
def create_customer(customer: schemas.CustomerCreate, 
                    db: Session = Depends(get_db)):
    return crud.create_customer(db, customer)


# ---------------------------
# Orders
# ---------------------------
@app.get("/orders", response_model=list[schemas.Order])
def list_orders(db: Session = Depends(get_db)):
    return crud.get_orders(db)

@app.post("/orders", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate,
                 db: Session = Depends(get_db)):
    return crud.create_order(db, order)
