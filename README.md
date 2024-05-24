Authentication API

This project is a backend API for an authentication system with additional features to allow users to set their profiles as public or private. It includes user registration, login, profile management, and access control based on user roles.

Features
User registration with email/password
User login with email/password or third-party services (Google, Facebook, Twitter, GitHub)
User profile management (name, bio, phone, email, password, photo)
Option to set profile as public or private
Admin access to view both public and private user profiles
Normal user access limited to public user profiles
Error handling, validation, and security measures implemented
Technologies Used
Node.js
Express.js
MongoDB (with Mongoose)
JWT (JSON Web Tokens) for authentication
Passport.js for OAuth authentication with third-party services
Swagger for API documentation
Setup Instructions
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/auth-api.git
cd auth-api
Install dependencies:
npm install


Set up environment variables:

Create a .env file in the root directory with the following variables:
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


Run the server:
npm start


Access the API documentation:

Visit http://localhost:3000/api-docs in your browser to view the Swagger documentation and test the API endpoints interactively.

API Endpoints
POST /api/auth/register: Register a new user.
POST /api/auth/login: Login with email/password.
POST /api/auth/login/google: Login with Google OAuth.
POST /api/auth/login/facebook: Login with Facebook OAuth.
POST /api/auth/login/twitter: Login with Twitter OAuth.
POST /api/auth/login/github: Login with GitHub OAuth.
POST /api/auth/logout: Logout the user.
GET /api/profile/me: Get current user's profile.
PUT /api/profile/me: Update current user's profile.
GET /api/profile/public: Get all public profiles.
GET /api/profile/all: Get all profiles (admin only).
