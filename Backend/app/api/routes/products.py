from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.logger import logger
from app.models import Product
from app.schemas import ProductCreate

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("", status_code=201)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    if product.quantity < 0:
        logger.warning(f"Failed product creation: Negative quantity ({product.quantity})")
        raise HTTPException(status_code=400, detail="Quantity cannot be negative")
    
    if db.query(Product).filter(Product.sku == product.sku).first():
        logger.warning(f"Failed product creation: SKU '{product.sku}' already exists")
        raise HTTPException(status_code=400, detail="SKU already exists")
    
    new_product = Product(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    logger.info(f"Created new product: {new_product.name} (SKU: {new_product.sku})")
    return new_product

@router.get("")
def get_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    logger.info(f"Fetching products (skip={skip}, limit={limit})")
    return db.query(Product).offset(skip).limit(limit).all()

@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{product_id}")
def update_product(product_id: int, updated_product: ProductCreate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for key, value in updated_product.model_dump().items():
        setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    logger.info(f"Updated product ID: {product_id}")
    return product

@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    logger.info(f"Deleted product ID: {product_id}")
    return None
