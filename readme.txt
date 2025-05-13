Project Setup Guide

Backend Configuration Guide

1. Launch the Project in Visual Studio Code
Open Visual Studio Code (VS Code).

Navigate to the root directory of the backend project and open the folder.

2. Open the Integrated Terminal
Right-click on the sidebar within VS Code.

Select “Open in Integrated Terminal” from the context menu.

3. Install Project Dependencies
Execute the following command in the terminal:

npm install
Wait for the installation process to complete.

Note: An active internet connection is required for this step.

4. MongoDB Configuration via MongoDB Atlas
a. Access MongoDB Atlas
Navigate to https://www.mongodb.com/cloud/atlas.

Sign up or log in using your credentials.

b. Create a New Project
Click on “New Project” and provide a name for your project.

c. Build a Database
Navigate to the Database section and click “Build a Database.”

Select the M0 (Free Tier) plan and choose your preferred cloud region.

Click “Create” to proceed.

d. Configure Database User
Create a new database user by setting a username and password.

e. Finalize Setup
Click “Finish and Close” once the database has been created.

f. Whitelist IP Addresses
Whitelist the IP address 0.0.0.0/0 to allow global access.

Click “Add Entry.”

g. Connect to the Database
Click the “Connect” button and select “Compass” as your connection method.

Copy the connection string provided.

h. Integrate MongoDB into Your Project
Open the db.js file in your project directory.

Paste the connection string and replace <password> with the password you configured in Step 4d.

Save the changes.

5. Start the Backend Server
To initiate the backend server, execute:

npm run server

Frontend & Administrative Panel Execution Guide

1. Open the Frontend Project in VS Code
Navigate to the project directory and open it in Visual Studio Code.

2. Open the Integrated Terminal
Right-click on the sidebar and select “Open in Integrated Terminal.”

3. Install Frontend Dependencies
In the terminal, enter the following command:

npm install
Wait until all dependencies are successfully installed.

4. Verify Installation
Upon successful installation, the node_modules directory will be visible in the project structure.

5. Launch the Frontend Application
To start the development server, run:

npm run dev

6. Access the Application
The application will launch automatically in your default web browser.

