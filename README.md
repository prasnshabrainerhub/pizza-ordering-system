# Pizza Ordering System

Welcome to the Pizza Ordering System! This web application allows users to browse and order pizzas, while administrators can manage pizzas, orders, toppings, and coupons. The system is built using Next.js for the frontend, FastAPI for the backend, and PostgreSQL managed via pgAdmin.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [Contributing](#contributing)

## Features

- **User Functionality**:
  - Browse and order pizzas.
  - View personal order history.

- **Admin Functionality**:
  - Manage pizzas, including adding, updating, and deleting.
  - Manage toppings, including adding, updating, and deleting.
  - Manage coupons, including adding, updating, and deleting.
  - Handle orders

## Project Structure

The project is organized into two main directories:

- **backend/**: Contains the FastAPI application, including all server-side logic and database interactions.
- **frontend/**: Contains the Next.js application, responsible for the client-side interface.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Ensure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/pizza-ordering-system.git
   cd pizza-ordering-system

2. **Navigate to the Project Directory**:
    cd pizza-ordering-system

### Environment Variables
    
    Create a .env file in the root directory of the project and add the following environment variables:

    # -------BACKEND CONFIGURATION-------
    # DATABASE CONNECTION
    DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database_name>

    # JWT AUTHENTICATION
    SECRET_KEY=your_secret_key
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    REFRESH_TOKEN_EXPIRE_DAYS=7

    # EMAIL SERVICE
    SMTP_SERVER=smtp.example.com
    SMTP_PORT=587
    SENDER_EMAIL=your_email@example.com
    SENDER_PASSWORD=your_email_password

    # SMS SERVICE
    TWILIO_ACCOUNT_SID=your_twilio_account_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    TWILIO_PHONE_NUMBER=your_twilio_phone_number

    # FRONTEND URL
    FRONTEND_URL=http://localhost:3000

    # PAYMENT GATEWAY
    STRIPE_SECRET_KEY=your_stripe_secret_key
    STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

    # -------FRONTEND CONFIGURATION-------
    # BACKEND URL
    NEXT_PUBLIC_API_URL=http://localhost:8000
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

### Running the Application

1. **Build and Start the Containers**:
    docker-compose up --build

2. **Access the Application**:  
  -  Frontend: http://localhost:3000
  -  Backend (API documentation): http://localhost:8000/docs

### Usage

  - Users can sign up, browse available pizzas, place orders, and view their order history.
  - Admins can log in to the admin panel to manage pizzas, orders, toppings, and coupons.
  - Admins will create pizza's with the respective categories mentioned and that pizza will get display under that categorie's header on Dashboard.

### Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

