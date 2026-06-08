def test_create_product_success(client):
    response = client.post(
        "/products",
        json={
            "name": "Mechanical Keyboard",
            "sku": "KEY-100",
            "price": 89.99,
            "quantity": 50
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Mechanical Keyboard"
    assert data["sku"] == "KEY-100"
    assert "id" in data

def test_create_product_negative_quantity_fails(client):
    response = client.post(
        "/products",
        json={
            "name": "Gaming Mouse",
            "sku": "MOU-200",
            "price": 45.00,
            "quantity": -10
        },
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Quantity cannot be negative"

def test_prevent_duplicate_sku(client):
    # First request should succeed
    client.post(
        "/products",
        json={"name": "Monitor", "sku": "MON-001", "price": 200.0, "quantity": 10},
    )
    
    # Second request with the same SKU should fail
    response = client.post(
        "/products",
        json={"name": "Cheap Monitor", "sku": "MON-001", "price": 100.0, "quantity": 5},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "SKU already exists"

def test_get_products_pagination(client):
    # Create two test products
    client.post("/products", json={"name": "Item 1", "sku": "SKU-1", "price": 10.0, "quantity": 5})
    client.post("/products", json={"name": "Item 2", "sku": "SKU-2", "price": 20.0, "quantity": 5})
    
    # Test the limit parameter
    response = client.get("/products?skip=0&limit=1")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["sku"] == "SKU-1"