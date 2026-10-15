# OasisEnergy Backend API

The backend REST API for **OasisEnergy**, a full-stack solar energy products and services platform. Built with Node.js, Express.js, and MongoDB, it powers authentication, role-based access, solar product management, installation and maintenance workflows, customer orders, and Paystack payment processing.

## Live Links

- **Live Website:** https://oasisenergy.netlify.app/
- **Backend API:** https://oasisenergy-api.onrender.com
- **Backend Repository:** https://github.com/nasha861/oasis-Backend
- **Frontend Repository:** https://github.com/nasha861/oasis-energy-site

## Technology Stack

- Node.js
- Express.js
- MongoDB and Mongoose
- JSON Web Tokens (JWT)
- bcryptjs for password hashing
- Paystack for payment initialization and verification
- dotenv for environment configuration

## Features

### Authentication and Authorization
- User registration and login
- Protected profile routes
- JWT-based authentication
- Role-based access for administrators, customers, and technicians
- Protected account creation for technicians and administrators

### Solar Products
- Create and manage solar product records
- Store product information and technical specifications
- Support product categories such as panels, inverters, batteries, and racking

### Installation Management
- Installation workflows and technician assignments
- Installation progress and status updates
- Access restrictions for assigned technicians

### Maintenance Management
- Customer maintenance requests
- Administrator management of service requests
- Technician-assigned maintenance jobs
- Maintenance progress and status updates

### Orders and Payments
- Customer order workflows
- Paystack payment initialization
- Payment verification through the backend
- Order and payment status handling

### Services and Quotations
- API support for service and quotation workflows
- Integration with the OasisEnergy frontend

## Project Structure

The backend uses a modular, MVC-oriented architecture.

```text
src/
├── controllers/    # Request handling and business logic
├── middleware/     # Authentication, authorization and validation
├── models/         # Mongoose database models
├── routes/          # API route definitions
└── server.js        # Application entry point
```

## Getting Started

### Prerequisites

- Node.js and npm
- Access to a MongoDB database
- Paystack credentials for testing payment workflows

### 1. Clone the repository

```bash
git clone https://github.com/nasha861/oasis-Backend.git
cd oasis-Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create an environment file in the location expected by the application. Check the source code to confirm the exact environment variable names.

Typical configuration values include:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PAYSTACK_SECRET_KEY=your_paystack_secret_key
```

These names are examples only. Use the exact names expected by the current codebase.

**Security:** Never commit real credentials, database connection strings, private API keys, or production environment files to GitHub.

### 4. Start the server

```bash
npm start
```

The server uses the configured port locally and the port supplied by the hosting platform in production.

## API Route Groups

The API uses the `/api` prefix.

| Route group | Purpose |
|---|---|
| `/api/auth` | Registration, login, profile access, and protected account creation |
| `/api/customers` | Customer management |
| `/api/technicians` | Technician management |
| `/api/solar-products` | Solar product management |
| `/api/installations` | Installation workflows |
| `/api/maintenance` | Maintenance requests and technician assignments |

Orders, payments, quotations, and services are also supported. Refer to the route files in `src/routes/` for the exact endpoint paths, HTTP methods, validation rules, and authorization requirements.

## Deployment

The backend is deployed on **Render**.

**Production API:** https://oasisenergy-api.onrender.com

The deployed service has successfully started and connected to MongoDB. Production environment variables should be configured through Render's environment settings.

The backend CORS configuration must allow requests from the production frontend:

https://oasisenergy.netlify.app/

## Security Practices

- Passwords are hashed before storage.
- Protected endpoints use authentication and role-based authorization.
- Administrative account-creation endpoints require administrator authorization.
- Technician operations are restricted to assigned work and permitted updates.
- Payment secret keys remain on the backend.
- Environment files and credentials must remain outside version control.

## Testing

API requests were tested during development using Postman. For the latest endpoint definitions and supported request payloads, refer to the route and controller implementations in the repository.

## Project Status

The backend is deployed on Render and connected to MongoDB. Core authentication, solar product, installation, maintenance, order, and payment workflows have been implemented.

## Related Project

The React frontend is hosted on Netlify:

https://oasisenergy.netlify.app/

**Frontend source:** https://github.com/nasha861/oasis-energy-site

## Developer

**Aishat Raji**

GitHub: https://github.com/nasha861
