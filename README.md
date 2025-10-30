#  **Project Management system(Full Stack)**



# A modern, secure, and scalable backend for managing projects, tasks, teams, and notes. Built using Node.js, Express, and MongoDB with authentication, role-based access control, and email verification.



🧩 Features**



🔙 Authentication**

* \- User registration with validation
* \- Secure login using JWT
* \- Logout and token handling
* \- Password hashing using \*\*bcrypt\*\*



#### **### ✉️ Forgot / Reset Password**

* \- User requests a password reset link via email
* \- A secure token is generated and sent to the user's email
* \- User resets the password through a frontend page
* \- Token expires automatically after a fixed duration


✉️ Verification Email**



- Upon successful registration, an Email verification Link is sent to the mail.





🧠 Dashboard (Protected)**

*\- Access allowed only for logged-in users
*\- Example sections for:
*\-Projects (Add, Delete and Edit Projects)**
*\- **Notes (per project)(Add and delete Notes)**
*\- Members of the project(Add and Remove along with Modifiable Role Assignment)** 


🏗️ Tech Stack**


**Layer**                                **Technology** 
* Frontend                          React (Vite), Tailwind CSS, React Router DOM, Axios 
* Backend                           Node.js, Express.js 
* Database                          MongoDB + Mongoose 
* Authentication                    JSON Web Tokens (JWT), bcrypt 
* Email Service                     Nodemailer with SMTP (Mailtrap / Gmail) 
* Error Handling                    Custom `ApiError` and `ApiResponse` classes 

Folder Structure

project-root/

│

├── backend/

│ ├── src/

│ │ ├── controllers/

│ │ └── authController.js

│ │ ├── models/

│ │ │ └── userModel.js

│ │ ├── routes/

│ │ │ └── authRoutes.js

│ │ ├── utils/

│ │ │ ├── sendEmail.js

│ │ │ ├── ApiError.js

│ │ │ └── ApiResponse.js

│ │ └── app.js

│ └── server.js

│

├── frontend/

│ ├── src/

│ │ ├── pages/

│ │ │ ├── Register.jsx

│ │ │ ├── Login.jsx

│ │ │ ├── Dashboard.jsx

│ │ │ ├── Projects.jsx

│ │ │ ├── Notes.jsx

│ │ │ └── ResetPassword.jsx

| │ ├── services/

│ │ │ └── api.js

│ │ └── App.jsx

│ └── vite.config.js

│

└── README.md



**Installation and Setup**



 **Clone the repository**

 

 git clone https://github.com/MohammedSameer435/fullstack-Project-Mangement-API.git

 cd fullstack-Project-Mangement-API

 After running this "cd fullstack-Project-Mangement-API". To open the project folder, Run this code in you terminal  - "code ."


**Backend Setup**




1\.**Navigate to backend**

  

  cd backend



 **2.Install dependencies**

 npm install - Not Needed. node\_modules are already pushed into git. 

 Create a .env file



**env file**



MONGO\_URI =<Your MongoDB Connection String>



PORT = 8000

CORS\_ORIGIN=http://localhost:5173



ACCESS\_TOKEN\_SECRET =test

ACCESS\_TOKEN\_EXPIRY= 1d

REFRESH\_TOKEN\_SECRET =test

REFRESH\_TOKEN\_EXPIRY = 10d

//Option 1: Use these if you want to use MailTrap for verification link and Password Changing Link

MAILTRAP\_SMTP\_HOST = sandbox.smtp.mailtrap.io

MAILTRAP\_SMTP\_PORT=2525



MAILTRAP\_SMTP\_USER = 5490938048ac24

MAILTRAP\_SMTP\_PASS = 416fc93991611f



//Option 2: Use these if you want the Verification link and Password Reset link sent to your own mail id

SMTP\_HOST=smtp.gmail.com

SMTP\_PORT=587

SMTP\_USER=their\_gmail\_address@gmail.com

SMTP\_PASS=their\_app\_password

 

FORGOT\_PASSWORD\_REDIRECT\_URL = http://localhost:5173/reset-password



**Start backend**

npm run dev

---

**Frontend Setup**

**Navigate to frontend**

cd frontend





**Install dependencies**

npm install


**Configure API base URL**

Inside src/services/api.js:

import axios from "axios";

export default axios.create({

baseURL: "http://localhost:8000/api/v1", **// adjust if different**

 withCredentials: true,

 });

 

**Start frontend**

npm run dev

👑 **Admin Access** (For Evaluator)
---

Following routes and features (like creating, updating, or deleting projects, members, and tasks) are \*\*restricted to Admins\*\*. So, To test all features. Please Register as an admin. 

**🧩 Admin-only Routes**

**🔹 Project Routes** (routes/projectRoutes.js)


##### **HTTP Method	          Route	                                     Description**

##### PUT	        /api/v1/projects/:projectId	                     Update a project

##### DELETE         	/api/v1/projects/:projectId	                     Delete a project

##### PUT	        /api/v1/projects/:projectId/members/:userId	     Update a member’s role

##### DELETE	        /api/v1/projects/:projectId/members/:userId	     Remove a member from project



##### **🔹 Task Routes(routes/taskRoutes.js)**
##### **HTTP Method	          Route                                      Description**

##### POST	        /api/v1/tasks/:projectId	                     Create a new task

##### DELETE	        /api/v1/tasks/:projectId/t/:taskId	             Delete a task

##### POST	        /api/v1/tasks/:projectId/t/:taskId/subtasks	     Create a subtask

##### DELETE	        /api/v1/tasks/:projectId/st/:subTaskId	             Delete a subtask



##### **🔹 Note Routes (routes/noteRoutes.js)**



##### **HTTP Method	         Route	                                     Description**

##### POST	        /api/v1/notes/:projectId	                     Create a note

##### PUT	        /api/v1/notes/:projectId/n/:noteId	             Update a note

DELETE	        /api/v1/notes/:projectId/n/:noteId	             Delete a note


---

** 🧭 How to Test the Project(Step by Step)**

 

**🪪 Authentication Flow**

1\. Register a new user on `/register`("role:admin"-To be able to test all the features)

2\. Check your email inbox (Mailtrap or Gmail) for a verification link

3\. Click the link to verify your account

4\. Log in using your credentials on `/login`



🔑 Forgot / Reset Password Flow**

1\. Click \*\*"Forgot Password"\*\* on the login page

2\. Enter your registered email

3\. Check your mail(Gmail or Mailtrap) for the reset link

4\. Click the link and set a new password and It will redirect to the login page.

 

**📁 Project Management (Admin Only)**

1\. Log in as Admin

2\. Go to Dashboard → Projects

3\. Create a new project

4\. Add members to the project

5\. Assign or modify member roles

6\. Delete or update projects



**📝 Notes**

 \- Add notes to any project  

\- Create, edit, or delete tasks  

\- Only Admins can modify tasks  

 \- Members can view assigned tasks



**Role-Based Access**



**Admin:** Full access to all project actions

 

Project Admin: Manage tasks, notes, and members



 **Member:** View and update assigned tasks and notes



**Email System**

The email service uses Mailgen and Nodemailer for:

Sending verification emails

Sending password reset emails

Each email includes a clean HTML template.

**API Response Format**

**Successful response:** { "success": true, "statuscode": 200, "data": {}, "message": "Action completed successfully" }

*Error response:** { "success": false, "statuscode": 400, "message": "Something went wrong", "errors": \[] }

**Future Enhancements**

 File uploads for project assets

 Real-time updates with Socket.IO

 Dashboard analytics



##### Calendar integration

###### 

