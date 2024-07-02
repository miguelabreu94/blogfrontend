# Blog Application Frontend (Rumos)

The Blog Application Frontend (Rumos) is a responsive and interactive client-side application built with React. It serves as the user interface for the Blog Application, enabling users to browse, create, edit, and interact with blog content seamlessly, providing different levels of access and functionality based on the user role. This project communicates with the backend application (built with Java and Spring Boot) via RESTful APIs. The application is styled with CSS and utilizes React Router for navigation.

---

## Features

- User Authentication: Secure login and registration using JWT tokens.
- Role-Based Access: Different interfaces and functionalities for Admin, Moderator, and Common User.
- Blog Management: Create, read, update, and delete blog posts.
- User Interaction: Commenting, liking, and sharing blog posts.
- Responsive Design: Optimized for both desktop and mobile devices.

## Setup and Installation
### Option 1

1. Clone the Repository

```bash
git clone https://github.com/miguelabreu94/blogfrontend
cd blogfrontend
```

2. Install dependencies

```bash
npm install
```

3. Run the App

```bash
npm start
```
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Option 2

1. Clone the repository.
2. Ensure Docker and Docker Compose are installed on your machine.
3. Open a terminal in the root directory of the project.
4. Run the following command to build and start the containers defined in your docker-compose.yml

```bash
docker-compose up
```

This command will automatically build the Docker image (if necessary) and start the container. Once the container is running, the application will be accessible through the browser at http://localhost:3000.

To stop and remove the containers, use the command:

```bash
docker-compose down
```

## User Application Credentials

| Role  | Username        | Password  |
|-------|-----------------|-----------|
| Admin | labreu          | password  |
| User  | jabreu          | password  |

## Tools and Libraries

- React Router for navigation
- JWT for authentication

---

Build for Production

```bash
npm run build
```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

Testing

```bash
npm test
```
Launches the test runner in the interactive watch mode.\



