# Full-Stack E-Commerce Application

A complete e-commerce solution with Django REST API backend and React TypeScript frontend.

## Project Structure

```
.
├── backend/          # Django REST API
├── frontend/         # React + TypeScript + Vite
└── README.md
```

## Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up PostgreSQL database:
```bash
# Create database
createdb ecommerce_db

# Or using psql:
psql -U postgres
CREATE DATABASE ecommerce_db;
```

5. Create `.env` file:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

6. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

7. Create superuser:
```bash
python manage.py createsuperuser
```

8. Run development server:
```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`
Admin panel at `http://localhost:8000/admin`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Features

### Backend
- Django REST Framework API
- PostgreSQL database
- Django Admin panel for management
- Product management (CRUD)
- Category management
- Shopping cart functionality
- Order management
- Review system
- Image upload support

### Frontend
- Modern React with TypeScript
- Responsive design with Tailwind CSS
- Product browsing and search
- Category filtering
- Shopping cart
- Checkout process
- User-friendly interface

## API Endpoints

- `GET /api/categories/` - List all categories
- `GET /api/products/` - List products (with filters: ?category=slug&search=query)
- `GET /api/products/{id}/` - Get product details
- `GET /api/products/{id}/reviews/` - Get product reviews
- `POST /api/reviews/` - Create review (authenticated)
- `GET /api/cart/my_cart/` - Get current cart
- `POST /api/cart/add_item/` - Add item to cart
- `POST /api/cart/update_item/` - Update cart item
- `POST /api/cart/remove_item/` - Remove item from cart
- `GET /api/orders/` - List user orders
- `POST /api/orders/create_order/` - Create new order

## Technologies Used

### Backend
- Django 4.2
- Django REST Framework
- PostgreSQL
- Pillow (image handling)
- django-cors-headers

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## Development Notes

- Backend runs on port 8000
- Frontend runs on port 5173
- CORS is configured for frontend development
- Media files are served from `/media/` in development
- Make sure PostgreSQL is running before starting the backend
