document.getElementById('register-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:4000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    alert('Registration successful! You can now log in.');
    window.location.href = 'login.html'; // Redirect to the login page
  } else {
    const errorMessage = await response.text();
    alert(`Registration failed: ${errorMessage}`);
  }
});