from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.logger import logger
from app.models import Customer
from app.schemas import CustomerCreate

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.post("", status_code=201)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    if db.query(Customer).filter(Customer.email == customer.email).first():
        logger.warning(f"Failed customer creation: Email '{customer.email}' already registered")
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_customer = Customer(**customer.model_dump())
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    logger.info(f"Created new customer: {new_customer.email}")
    return new_customer

@router.get("")
def get_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    logger.info(f"Fetching customers (skip={skip}, limit={limit})")
    return db.query(Customer).offset(skip).limit(limit).all()

@router.get("/{customer_id}")
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@router.put("/{customer_id}")
def update_customer(customer_id: int, customer_data: CustomerCreate, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        logger.warning(f"Failed customer update: ID {customer_id} not found")
        raise HTTPException(status_code=404, detail="Customer not found")

    if customer_data.email != customer.email:
        existing_email = db.query(Customer).filter(Customer.email == customer_data.email).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already registered")

    for key, value in customer_data.model_dump().items():
        setattr(customer, key, value)
    
    # 4. Save to the database
    db.commit()
    db.refresh(customer)
    logger.info(f"Updated customer ID: {customer_id}")
    return customer

@router.delete("/{customer_id}", status_code=204)
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    db.delete(customer)
    db.commit()
    logger.info(f"Deleted customer ID: {customer_id}")
    return None
