# ecom-123446789

A two-page ecommerce storefront that pairs a React + Vite shop experience with a lightweight ASP.NET Core backend for cart selection and unselection.

## Stack overview

- **Frontend:** React 18 + Vite, two pages (Shop + Cart) with client-side routing and a shared cart state.
- **Backend:** ASP.NET Core Minimal API (net8.0) exposing a static catalog, cart persistence, and selection/unselection actions.
- **User flow:** Use the Shop page to select items, then review/remove them on the Cart page. Each action updates the backend cart.

## Local development

### Backend

```bash
cd backend/Ecommerce.Api
dotnet restore
dotnet run --urls http://localhost:5000
```

The API runs on port 5000 by default and includes CORS policies that allow the Vite dev server to call it.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite serves the React app on port 5173 and proxies `/api` to the backend. Set `VITE_API_BASE_URL` in `.env` or `.env.local` if the backend runs elsewhere.

## API endpoints

- `GET /api/products` — catalog of available items.
- `GET /api/cart` — current cart contents (product, quantity, price).
- `POST /api/cart/{productId}` — select/add a product to the cart.
- `DELETE /api/cart/{productId}` — unselect/remove one unit of the product.

## Cart selection & unselection

The frontend calls the API after every selection or unselection action to keep the UI synchronized. Selecting increments the quantity and automatically adds the item if it was not present. Unselection decrements the quantity and removes the item from the cart when the quantity reaches zero.

See `frontend/.env.example` for a sample override of `VITE_API_BASE_URL`.
