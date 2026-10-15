# OasisEnergy Backend API

A RESTful backend API for the OasisEnergy solar energy platform, built with Node.js, Express.js, and MongoDB.

The API supports user authentication, role-based access, solar product management, installation and maintenance services, order management, and Paystack payment integration.

## Features

- **Authentication and authorization** — JWT-based authentication and role-based access for administrators, customers, and technicians.
- **Customer management** — Customer-related API operations.
- **Solar product management** — Manage solar products and their specifications.
- **Installation services** — Support installation-related operations.
- **Maintenance services** — Submit and manage maintenance requests.
- **Order management** — Support customer orders and order status updates.
- **Online payments** — Paystack payment initialization and verification.
- **REST API** — Organized API routes and controllers.

## Technology Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- Paystack
- Postman for API testing

## Project Structure

The backend follows an organized Express application structure. The source code includes API routes, controllers, models, middleware, and configuration where applicable.

```text
backend/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── ...
├── .gitignore
├── package.json
└── README.md
```

*Note: Adjust the structure above to match the actual files in your repository.*

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB database
- Paystack account and API credentials for payment testing

### Installation

**Prerequisites**
- Node.js and npm
- A MongoDB database

**Setup**

1. Clone the repository:

   ```bash
   git clone https://github.com/nasha861/oasis-Backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd oasis-Backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure the environment variables required by the application in a local `.env` file. Do not commit this file to GitHub.

5. Start the backend:

   ```bash
   npm start
   ```

The start command runs `node src/server.js`. Ensure the required environment variables and MongoDB connection are configured before starting the application.

## Environment Variables

Configure the variables required by your application. These may include:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `PAYSTACK_SECRET_KEY`

Check the backend configuration to confirm the exact variable names. Never commit real credentials or secret keys to GitHub.

## API Testing with Postman

The repository includes a Postman collection for testing the OasisEnergy API locally.

### Import the collection

1. Download the Postman collection JSON file from this repository.
2. Open Postman and select **Import**.
3. Import the downloaded JSON file.
4. Create or select an environment with these variables:

   | Variable | Example value |
   |---|---|
   | `baseUrl` | `http://localhost:5000` |
   | `authToken` | Leave empty initially |

5. Start the backend with `npm start`.
6. Send the Health request to confirm that the API is responding.
7. Register a test customer or log in, then use the returned token for protected requests.

The collection currently includes health-check, authentication, profile, and customer requests. Additional endpoints can be documented as the API testing collection grows.

**Security:** Use test accounts and never commit real authentication tokens, passwords, or API secrets.

## Frontend

The OasisEnergy frontend is maintained separately:

- [Frontend repository](https://github.com/nasha861/oasis-energy-site)
- [Live application](https://oasisnergy.netlify.app/)

## Security

- Keep environment files and secret credentials out of version control.
- Use authenticated and role-restricted routes for protected operations.
- Never publish real database credentials, JWT secrets, or Paystack secret keys.

## Project Purpose

This project demonstrates practical full-stack application development, REST API design, authentication, role-based authorization, database integration, and payment processing.

## Author

Developed as part of my software development portfolio.
