# MERZADO - Mini B2B RFQ Marketplace

A mini B2B Request for Quotation (RFQ) marketplace that connects buyers who need products/services with suppliers who can submit quotations.

## Features

### Buyer
- Register and login
- Create RFQs
- View own RFQs
- Edit own RFQs
- Delete own RFQs
- View quotations received for an RFQ

### Supplier
- Register and login
- Browse available RFQs
- Search RFQs by product/service name
- View RFQ details
- Submit quotations
- View submitted quotations

## RFQ Details

Each RFQ contains:
- Product/service name
- Description
- Quantity
- Delivery location
- Deadline

## Quotation Details

Each quotation contains:
- Quoted price
- Estimated delivery time
- Message/notes

## Technology Stack

### Backend
- Python
- Django
- Django REST Framework
- JWT Authentication
- SQLite

### Frontend
- TypeScript
- HTML
- CSS
- JavaScript/TypeScript Fetch API

### Development Tools
- Visual Studio Code
- Git
- GitHub
- Thunder Client

## Authentication

The application uses JWT-based authentication.

After login, the backend returns an access token and refresh token.

Protected API requests use:

    Authorization: Bearer <access_token>

## API Endpoints

### Authentication

    POST /api/accounts/register/
    POST /api/accounts/login/

### RFQs

    POST /api/rfqs/
    GET /api/rfqs/list/
    GET /api/rfqs/my/
    GET /api/rfqs/<id>/
    PUT /api/rfqs/<id>/
    DELETE /api/rfqs/<id>/

### Quotations

    POST /api/quotations/
    GET /api/quotations/my/
    GET /api/quotations/rfq/<rfq_id>/

## Setup

Clone the repository:

    git clone <YOUR_GITHUB_REPOSITORY_URL>

Go into the project:

    cd b2b-merzado

Create a virtual environment:

    python -m venv .venv

Activate it on Windows:

    .venv\Scripts\activate

Install dependencies:

    pip install -r requirements.txt

Go to the backend:

    cd backend

Run migrations:

    python manage.py migrate

Start the Django server:

    python manage.py runserver

## Environment Variables

If environment variables are used, create a `.env` file and configure the required values.

Do not commit passwords, secret keys, access tokens, or other sensitive credentials to GitHub.

## API Authentication Flow

1. User registers as Buyer or Supplier.
2. User logs in.
3. Backend returns JWT access and refresh tokens.
4. Frontend stores the access token.
5. Protected API requests send the access token using the Authorization header.
6. Backend checks authentication and role permissions.

## Architecture

The application follows a frontend-backend architecture.

Frontend:
- Provides the user interface.
- Sends HTTP requests to the backend.
- Stores and sends the JWT access token.

Backend:
- Django REST Framework APIs.
- Handles authentication and authorization.
- Validates requests.
- Manages RFQs and quotations.
- Stores application data in the database.

## Validation and Security

- Passwords are handled using Django's password hashing.
- JWT authentication protects private endpoints.
- Buyer and Supplier roles are separated using role-based permissions.
- Users can only modify their own RFQs.
- Protected endpoints require authentication.
- API input is validated through Django REST Framework serializers.

## Error Handling

The frontend displays error messages when API requests fail and provides loading and empty states for data lists.

## Assumptions and Limitations

- This is a mini RFQ marketplace created as a technical assignment.
- Email verification and password reset are outside the current scope.
- Payment processing is not included.
- Advanced supplier ranking and automated bidding are outside the current scope.

## Future Improvements

- Email notifications
- Advanced RFQ filtering
- Supplier profiles
- File attachments
- Real-time notifications
- PostgreSQL for production
- Production deployment with HTTPS