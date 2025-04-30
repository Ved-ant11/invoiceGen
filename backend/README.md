
# Invoice App Backend

This is the backend server for the Invoice Management Application.

## Setup Instructions

1. **Install dependencies:**
   ```
   npm install
   ```

2. **Configure environment variables:**
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/invoice-app
     JWT_SECRET=your_jwt_secret_key_here
     EMAIL_USER=your_email@example.com
     EMAIL_PASS=your_email_password_here
     ```

3. **Start MongoDB:**
   - Make sure MongoDB is installed and running on your system
   - If using MongoDB Atlas, update the MONGO_URI with your connection string

4. **Start the server:**
   - Development mode: `npm run dev`
   - Production mode: `npm start`

## API Endpoints

### Authentication
- POST `/api/users/register` - Register a new user
- POST `/api/users/login` - Login user
- GET `/api/users/me` - Get current user profile

### Invoices
- GET `/api/invoices` - Get all invoices for logged in user
- GET `/api/invoices/:id` - Get invoice by ID
- POST `/api/invoices` - Create a new invoice
- PUT `/api/invoices/:id` - Update invoice
- PUT `/api/invoices/:id/status` - Update invoice status
- DELETE `/api/invoices/:id` - Delete invoice
- POST `/api/invoices/:id/email` - Send invoice by email

## Technologies Used
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer for email
- PDF generation
