# ⛽ FuelCard REST API

A specialized backend service for managing digital fuel cards. This API allows users to manage their fuel budget, track various fuel types, and monitor spending habits through detailed transaction histories.

---

## 🚀 Features

* **User Management**: Secure registration and JWT-based authentication.
* **Card Management**: Add, view, and delete multiple fuel cards.
* **Wallet Actions**: 
    * **Top-up**: Manually add funds to a specific card.
    * **Spend**: Log fuel purchases with dynamic fuel types and pricing.
* **Transaction History**: 
    * Filter by type: `topup` or `spend`.
    * Filter by date range.
    * Detailed logs including fuel type and price per unit.

---

## 🛠 Tech Stack

* **Language**: [Insert Language, e.g., Node.js]
* **Framework**: [Insert Framework, e.g., Express]
* **Database**: [Insert Database, e.g., PostgreSQL]
* **Auth**: JWT (JSON Web Tokens)

---

## 🛣 API Endpoints

### 1. Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Create a new user account |
| `POST` | `/api/auth/login` | Login and receive a JWT token |

### 2. Fuel Cards
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/cards` | List all cards for the user |
| `POST` | `/api/cards` | Register a new fuel card |
| `DELETE` | `/api/cards/:id` | Remove a specific card |

### 3. Transactions
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/cards/:id/topup` | Manually add balance to a card |
| `POST` | `/api/cards/:id/spend` | Record a fuel purchase |
| `GET` | `/api/transactions` | View all history (Supports filtering) |

---

## 🔍 Filtering Transactions

You can filter the transaction history using query parameters on the `GET /api/transactions` endpoint:

* **By Type**: `?type=topup` or `?type=spend`
* **By Date**: `?startDate=2024-01-01&endDate=2024-01-31`

**Example Request:** `GET /api/transactions?type=spend&startDate=2024-03-01`

---

## 📝 Usage Examples

### Spend Money (Record Purchase)
**Request:** `POST /api/cards/card_123/spend`
```json
{
  "fuel_type": "95 Octane",
  "fuel_price": 1.65,
  "total_spent": 50.00
}
```
Response (201 Created):
```json
{
  "transaction_id": "tx_8892",
  "card_id": "card_123",
  "status": "success",
  "remaining_balance": 125.50,
  "timestamp": "2024-03-15T14:20:00Z"
}
```
---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/turgut5534/fuel_cards_api_nestJS.git
   cd fuel-card-api
   ```
2. Install dependencies
   ```
   pnpm install
   ```
3- Environment Variables Create a .env file in the root directory and configure your credentials:
```
PORT=3000
DATABASE_URL=your_connection_string
JWT_SECRET=your_secret_key
```
4- Run the application
```
npm run start:dev
```

🔒 Security

authentication: All private routes require a Bearer <token> passed in the Authorization header.

Authorisation: Strict ownership checks are in place. Users can only access, delete, or spend from cards linked to their specific account.

Data Integrity: Fuel prices and types are validated server-side during the "spend" transaction process.


