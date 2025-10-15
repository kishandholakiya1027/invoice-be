# Invoice Management System API

A comprehensive invoice management system built with NestJS, featuring Razorpay payment integration, JWT authentication, and Swagger documentation.

## Features

### Finance Manager (Creditor) Functions:

- **Authentication**: Secure JWT-based authentication
- **Create Invoices**: Generate invoices with customer details, amounts, and due dates
- **View Invoices**: List, search, and filter invoices with pagination
- **Generate Payment Links**: Create secure payment links for customers using Razorpay

### Customer (Debtor) Functions:

- **No Login Required**: Customers can pay without registration
- **Payment Links**: Secure payment processing through Razorpay integration

## Tech Stack

- **Backend**: NestJS, TypeScript
- **Database**: Postgress with TypeORM
- **Authentication**: JWT with Passport
- **Payment**: Razorpay integration
- **Documentation**: Swagger/OpenAPI
- **Validation**: Class-validator, Class-transformer

## Prerequisites

- Node.js (v18 or higher)
- Postgress database
- Razorpay account (for payment processing)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd invoice-management-api
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp env.example .env
```

4. Configure your `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=invoice_management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Razorpay Configuration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Application Configuration
NODE_ENV=development
PORT=3000
```

5. Create Postgress database:

```sql
CREATE DATABASE invoice_management;
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The API will be available at `http://localhost:3000`
Swagger documentation: `http://localhost:3000/api`

## API Endpoints

### Authentication

- `POST /auth/register` - Register new finance manager
- `POST /auth/login` - Login finance manager
- `GET /auth/profile` - Get current user profile

### Invoices

- `POST /invoices` - Create new invoice
- `GET /invoices` - Get all invoices (with filtering and pagination)
- `GET /invoices/:id` - Get invoice by ID
- `PATCH /invoices/:id` - Update invoice
- `DELETE /invoices/:id` - Delete invoice

### Payments

- `POST /payments/generate-link` - Generate payment link for invoice
- `GET /payments/payment-page/:invoiceId` - Get payment page (no auth required)
- `POST /payments/callback` - Handle Razorpay payment callback
- `GET /payments/verify/:invoiceId` - Verify payment status

### Dashboard

- `GET /dashboard` - Get comprehensive dashboard overview with statistics, recent invoices, and monthly trends
- `GET /dashboard/analytics` - Get detailed analytics including status breakdown and top customers
- `GET /dashboard/stats` - Get key performance indicators and statistics

## Database Schema

### Users Table

- `id` (UUID, Primary Key)
- `username` (String, Unique)
- `email` (String, Unique)
- `password` (String, Hashed)
- `isActive` (Boolean)
- `createdAt`, `updatedAt` (Timestamps)

### Invoices Table

- `id` (UUID, Primary Key)
- `invoiceNumber` (String, Unique)
- `customerName`, `customerEmail`, `customerPhone`, `customerAddress`
- `amount` (Decimal)
- `invoiceDate`, `dueDate` (Date)
- `paymentStatus` (Enum: pending, paid, expired, cancelled)
- `description` (Text)
- `paymentLink` (String)
- `razorpayOrderId`, `razorpayPaymentId` (String)
- `paidAt`, `linkExpiresAt` (Timestamp)
- `createdBy` (Foreign Key to Users)
- `createdAt`, `updatedAt` (Timestamps)

## Testing

The API includes comprehensive test cases covering:

### Finance Manager Test Cases:

1. **Authentication**: Successful login, Invalid credentials
2. **Create Invoice**: Valid invoice creation, Missing customer information
3. **View Invoices**: List all invoices, Search invoices, Filter invoices
4. **Generate Payment Links**: Create payment links

### Customer Test Cases:

1. **No Login Required**: Access payment links without authentication
2. **Payment Processing**: Successful payment, Payment link expiration

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- SQL injection prevention through TypeORM
- Razorpay signature verification

## Error Handling

- Global exception filter
- Comprehensive error responses
- Input validation errors
- Database constraint violations
- Payment processing errors

## Development

```bash
# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Run with coverage
npm run test:cov

# Lint code
npm run lint

# Format code
npm run format
```

## Deployment

1. Set up production environment variables
2. Configure production database
3. Set up Razorpay production credentials
4. Build the application:

```bash
npm run build
npm run start:prod
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
