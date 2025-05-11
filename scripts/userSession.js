import { renderPage } from "./main.js";

export function setupLogin() {
  document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      renderPage('home'); // Redirect to home page
    } else {
      alert('Invalid username or password');
    }
  });
}

// Call this function during app initialization or when rendering the header

export function setupLogout() {
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token'); // Clear the authentication token
      alert('You have been logged out.');
      renderPage('login'); // Redirect to the login page
    });
  }
}


export function setupRegister() {
  document.getElementById('register-form').addEventListener('submit', async (event) => {
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
        // Redirect to login pag
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


