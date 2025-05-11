import { renderPage } from "./main.js";

//attahces a flag for each function to prevent multiple event listeners
let isLoginListenerAttached = false;
let isLogoutListenerAttached = false;
let isRegisterListenerAttached = false;



export function setupLogin() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  if (isLoginListenerAttached) return; // Prevent multiple listeners
  isLoginListenerAttached = true;

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); 
        // Delay rendering the home page to ensure the token is stored
        setTimeout(() => {
          renderPage('home');
        }, 0);
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login');
    }
  });
}



export function setupLogout() {
  const logoutButton = document.getElementById('logout-button');
  if (!logoutButton) return;

  if (isLogoutListenerAttached) return; 
  isLogoutListenerAttached = true;

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token'); 
    alert('You have been logged out.');

    //resets flags to avoid issues from leftover state of previous sessions
    isLoginListenerAttached = false;
    isRegisterListenerAttached = false;

    setTimeout(() => {
      renderPage('login');
    }, 0);
  });
}



export function setupRegister() {
  const registerForm = document.getElementById('register-form');
  if (!registerForm) return;

  if (isRegisterListenerAttached) return; 
  isRegisterListenerAttached = true;

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    console.log('Submitting registration:', { username, password }); // Debug log
  
    try {
      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        alert('Registration successful! You can now log in.');
        renderPage('login');
        
      } else {
        const errorMessage = await response.text();
        console.error('Registration failed:', errorMessage); // Debug log
        alert(`Registration failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration');
    }
  });
}


