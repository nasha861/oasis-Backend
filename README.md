# OasisEnergy Backend API

REST API for **OasisEnergy**, a solar-energy products and services platform. The backend is built with Node.js and Express and uses MongoDB for persistence. It provides authentication, role-based access, solar product management, installation and maintenance workflows, orders, and Paystack payment processing.

## Live links

- **Frontend:** https://oasisenergy.netlify.app/
- **Backend API:** https://oasisenergy-api.onrender.com
- **Backend repository:** https://github.com/nasha861/oasis-Backend
- **Frontend repository:** https://github.com/nasha861/oasis-energy-site

## Technology stack

- Node.js
- Express.js
- MongoDB and Mongoose
- JSON Web Tokens (JWT)
- bcryptjs for password hashing
- Paystack for payment initialization and verification
- dotenv for environment configuration

## Features

- **Authentication and authorization:** registration, login, protected profile routes, and role-based access.
- **User roles:** administrator, customer, and technician.
- **Account administration:** protected admin functionality for creating technician and administrator accounts.
- **Solar products:** create and manage solar product records.
- **Installations:** installation workflows, technician assignments, and job progress updates.
- **Maintenance:** customer requests, administrator management, technician assignments, and status updates.
- **Orders and payments:** order workflows and Paystack payment initialization/verification.
- **Services and quotations:** API support for service and quotation workflows.

## Project structure

The backend uses a modular, MVC-oriented structure:

```text
src/
├── controllers/    # Request handling and business logic
├── middleware/     # Authentication, authorization and validation
├── models/         # Mongoose models
├── routes/         # API route definitions
└── server.js       # Application entry point
```

## Run locally

### Prerequisites

- Node.js and npm
- A MongoDB database
- Paystack credentials to test payment flows

### Install dependencies

```bash
git clone https://github.com/nasha861/oasis-Backend.git
cd oasis-Backend
npm install
```

### Configure environment variables

Create the environment file in the location expected by the application. Check the source code for the exact environment variable names used by your current configuration. Typical settings include:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
PAYSTACK_SECRET_KEY=your_paystack_secret_key
```

These names are examples; use the exact names read by the application. Do not commit real secrets, database credentials, or production environment files to GitHub.

### Start the server

```bash
npm start
```

The application uses the hosting provider's assigned port in production. The deployed Render service has reported a successful startup and MongoDB connection.

## API route groups

The API is organized under the `/api` prefix. Core route groups include:

| Route group | Purpose |
|---|---|
| `/api/auth` | Registration, login, profile access, and protected account creation |
| `/api/customers` | Customer management |
| `/api/technicians` | Technician management |
| `/api/solar-products` | Solar product management |
| `/api/installations` | Installation workflows |
| `/api/maintenance` | Maintenance requests and technician assignments |

Orders, payments, quotations, and services are also supported. Refer to `src/routes/` for the exact endpoints, HTTP methods, and authorization requirements.

## Deployment

The backend is deployed on **Render**:

https://oasisenergy-api.onrender.com

Production credentials should be configured through Render's environment settings, not committed to the repository. The backend must allow requests from the deployed frontend origin through its CORS configuration.

## Security

- Passwords are hashed before storage.
- Protected API operations use authentication and role-based authorization.
- Administrative account-creation endpoints are restricted to administrators.
- Technician operations are restricted to assigned work and permitted update fields.
- Paystack secret credentials must remain on the server.
- Keep `.env` files and credentials out of version control.

## Project status

The backend is deployed on Render and has successfully connected to MongoDB. Core authentication, product, installation, maintenance, order, and payment workflows have been implemented.
