# Recipe Matrix

## Overview

Recipe Matrix is a web application designed to help users manage their favorite recipes. It allows users to search and save their favorite recipes in their account for easy access. Built with a focus on simplicity and usability, the app provides a seamless experience for recipe enthusiasts.

## Features

- User Registration and Authentication: Users can create accounts and log in securely.
- Recipe Management: Save and manage your favorite recipes.
- Search: Quickly find desired recipes.
- Simple and Intuitive UI: Easy-to-navigate web interface.

## Installation

### Requirements

- <a href="https://nodejs.org/en/download">node.js</a>
- <a href="https://www.mongodb.com/try/download/community">MongoDB</a> 



### Steps to Install

- Install the latest and platform-compatible long-term support version of node.js
- Install the latest MongoDB Community Edition with your preferred platform and installation method. In the Setup Wizard, choose Complete Setup Type, tick all checkboxes and run as Network Service user. Then restart your device.
- Clone the Repository: Open your terminal or code editor terminal and clone the repository using the link provided under the "<> Code" button on GitHub, assuming you have <a href="https://git-scm.com/downloads">Git</a> installed. 

- Navigate to the Cloned Repository: Move into the project directory.
- Install Dependencies: Use "npm install" to install the necessary packages.

- In the .env file, type your secret key and optionally, your preferred MongoDB URL. 

- Start the Application: Start the server by running the "npm start" command in the terminal.
```
# Clone the repository from GitHub
git clone https://github.com/bfy22/Recipe-Matrix.git

# Navigate to the cloned repository
cd Recipe-App

# Install all the required dependencies using npm
npm install

# Start the application server
npm start
```


### Access the Web Application

Once the server is running, the terminal will provide a link (e.g., http://localhost:4000/). Open this link in your web browser to access the Recipe App.

## Languages and Technologies Used
### Languages

- HTML
- CSS
- JavaScript

### Technologies/Dependencies

- node.js: in vitro JavaScript runtime environment. Provides Path module
- Path: provides unrestricted management and resolution of file paths 
- Express: Fast and minimal web framework for Node.js. 
- Mongoose: MongoDB object modeling for Node.js.
- MongoDB: NoSQL database for storing recipes and user data.
- bcryptjs: Library for hashing passwords securely.
- jsonwebtoken: Library for generating and verifying JSON Web Tokens (JWT).
- CORS: Middleware to enable Cross-Origin Resource Sharing.
- dotenv: For managing sensitive info, secrets and settings like database URI and JWT secret, keeping them out of app code
- Husky: git hook manager


Note: .env is included in the repo for structure only.
Any changes to this file will be blocked from commit via a pre-commit hook.

