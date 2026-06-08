from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import engine, Base, get_db
from app.core.logger import logger
from app.api.routes import products, customers, orders
from app.models import Product, Customer, Order

# Initialize Database Tables
logger.info("Initializing database tables...")
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

# CORS configuration for Frontend Integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace "*" with your frontend domains (e.g., Vercel/Netlify URL)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Domain Routers
app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)

# Dashboard Summary Endpoint
@app.get("/dashboard/summary", tags=["Dashboard"])
def get_dashboard_summary(db: Session = Depends(get_db)):
    logger.info("Fetching dashboard summary metrics")
    total_products = db.query(Product).count()
    total_customers = db.query(Customer).count()
    total_orders = db.query(Order).count()
    
    # Threshold for low stock is set to 10
    low_stock_products = db.query(Product).filter(Product.quantity < 10).all()
    
    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "low_stock_count": len(low_stock_products),
        "low_stock_items": low_stock_products
    }
