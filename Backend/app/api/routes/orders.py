from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.core.logger import logger
from app.models import Order, OrderItem, Customer, Product
from app.schemas import OrderCreate

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", status_code=201)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    # 1. Verify Customer
    if not db.query(Customer).filter(Customer.id == order.customer_id).first():
        logger.warning(f"Order failed: Customer ID {order.customer_id} not found")
        raise HTTPException(status_code=404, detail="Customer not found")
    
    total_amount = 0.0
    new_order = Order(customer_id=order.customer_id, total_amount=0)
    db.add(new_order)
    db.flush() # Flush to get the new_order.id before committing
    
    # 2. Process Items and Inventory
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            db.rollback()
            raise HTTPException(status_code=404, detail=f"Product ID {item.product_id} not found")
        
        if product.quantity < item.quantity:
            db.rollback()
            logger.warning(f"Order failed: Insufficient inventory for product ID {product.id}")
            raise HTTPException(status_code=400, detail=f"Insufficient inventory for product {product.name}")
        
        # Deduct inventory & calculate running total
        product.quantity -= item.quantity
        total_amount += (product.price * item.quantity)
        
        # Add the line item to the database
        db.add(OrderItem(order_id=new_order.id, product_id=product.id, quantity=item.quantity))
        
    # 3. Finalize Order
    new_order.total_amount = total_amount
    db.commit()
    db.refresh(new_order)
    logger.info(f"Successfully created Order ID {new_order.id} for Customer ID {order.customer_id}")
    return new_order

@router.get("")
def get_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    logger.info(f"Fetching orders (skip={skip}, limit={limit})")
    # Added joinedload to eagerly fetch the nested items
    return db.query(Order).options(joinedload(Order.items)).offset(skip).limit(limit).all()

@router.get("/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)):
    # Added joinedload to eagerly fetch the nested items for the details page
    order = db.query(Order).options(joinedload(Order.items)).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.delete("/{order_id}", status_code=204)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db.delete(order)
    db.commit()
    logger.info(f"Deleted Order ID: {order_id}")
    return None