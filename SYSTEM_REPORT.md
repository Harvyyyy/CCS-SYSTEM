# CCS System Presentation Script

Good day. I will explain the code structure of the CCS System. The project is split into a backend for data handling and a frontend for the user interface, and the important part is how these files connect.

I will begin with [backend/server.js](backend/server.js). This is the main backend entry point. It creates the Express app, applies JSON and CORS middleware, connects to MongoDB through the database configuration, and mounts the route files under their API paths. In other words, this file is the starting point for all server-side requests.

For authentication, I will show [backend/routes/authRoutes.js](backend/routes/authRoutes.js) and [backend/controllers/authController.js](backend/controllers/authController.js). The route file only defines the endpoints and attaches middleware, while the controller file contains the actual logic for login, registration, profile retrieval, and password change. This separation keeps the route definitions clean and moves the processing logic into one place.

On the frontend side, I will show [frontend/src/main.jsx](frontend/src/main.jsx). This file initializes the React application and configures Axios so every request can include the stored token automatically. It also defines the response behavior for unauthorized requests, which is important because it protects the session flow.

Then I will show [frontend/src/App.jsx](frontend/src/App.jsx). This file controls the app-level routing and session state. It checks the saved role, decides whether the user stays on the login page or moves to the dashboard, and handles forced sign-out if a password reset is required. This is the main file that connects authentication state to page access.

For the page structure, I will show [frontend/src/layouts/MainLayout.jsx](frontend/src/layouts/MainLayout.jsx). This file builds the shared dashboard shell, including the sidebar, top bar, and role-based menu items. The important code here is the role menu mapping, because it determines which links appear for student, faculty, and admin users.

For the business logic examples, I will show [backend/controllers/studentController.js](backend/controllers/studentController.js) and [backend/controllers/courseController.js](backend/controllers/courseController.js). These files show the CRUD flow clearly: read data from the request, validate it, query or update MongoDB, and return a response. They are useful examples because they show how the backend handles real data operations in a structured way.

If I want to show the login form itself, I will use [frontend/src/pages/auth/Login.jsx](frontend/src/pages/auth/Login.jsx). That file collects the credentials, sends the login request, stores the returned token and user data, and passes the role back to the app. It is a simple example of how the frontend and backend work together.

Overall, the code is organized into clear layers: routes define endpoints, controllers hold logic, models store data rules, and the frontend manages the user experience and routing. That structure makes the project easier to understand when explaining how the code actually works.