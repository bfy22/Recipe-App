import { renderPage } from "./main.js";

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
      window.location.href = 'index.html'; 
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