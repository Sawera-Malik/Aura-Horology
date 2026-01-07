# E-commerce Backend API

Django REST API for e-commerce application with PostgreSQL database.

## Setup Instructions

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up PostgreSQL database:
```bash
# Create database
createdb ecommerce_db

# Or using psql:
psql -U postgres
CREATE DATABASE ecommerce_db;
```

4. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Create superuser:
```bash
python manage.py createsuperuser
```

7. Run development server:
```bash
python manage.py runserver
```

## API Endpoints

- `GET /api/categories/` - List all categories
- `GET /api/products/` - List all products (with ?category=slug and ?search=query filters)
- `GET /api/products/{id}/reviews/` - Get product reviews
- `POST /api/reviews/` - Create a review (authenticated)
- `GET /api/cart/my_cart/` - Get current cart
- `POST /api/cart/add_item/` - Add item to cart
- `POST /api/cart/update_item/` - Update cart item quantity
- `POST /api/cart/remove_item/` - Remove item from cart
- `GET /api/orders/` - List user orders
- `POST /api/orders/create_order/` - Create new order

## Admin Panel

Access Django admin at: `http://localhost:8000/admin/`

