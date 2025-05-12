import { renderPage } from "./main.js";

//attahces a flag for each function to prevent multiple event listeners
let isLoginListenerAttached = false;
let isLogoutListenerAttached = false;
let isRegisterListenerAttached = false;



//calls the backend to route login and registration form submissions
export function setupLogin() {
  // Wait until the DOM is fully updated (login form injected)
  requestAnimationFrame(() => {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) {
      console.warn('Login form not found after render.');
      return;
    }

    // Always remove previous listener if exists
    const newLoginForm = loginForm.cloneNode(true);
    loginForm.parentNode.replaceChild(newLoginForm, loginForm);

    newLoginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('http://localhost:4000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          console.log('Login successful, token stored:', data.token);

          const redirectPage = sessionStorage.getItem('redirectAfterLogin');
          if (redirectPage) {
            sessionStorage.removeItem('redirectAfterLogin');
            renderPage(redirectPage);
          } else {
            renderPage('home');
          }
        } else {
          alert('Invalid username or password');
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login');
      }
    });
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
  
    //console.log('Submitting registration:', { username, password }); 
  
    try {
      const registerResponse = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password }),
      });
  
      if (registerResponse.ok) {
        alert('Registration successful! Logging you in...');
        
        const loginResponse = await fetch('http://localhost:4000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        if (loginResponse.ok) {
          const data = await loginResponse.json();
          localStorage.setItem('token', data.token);
          //console.log('Login successful, token stored:', data.token); 

         
          renderPage('home');
        } else {
          alert('Registration successful, but login failed. Please log in manually.');
          renderPage('login');
        }
        
      } else {
        const errorMessage = await response.text();
        console.error('Registration failed:', errorMessage);
        alert(`Registration failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration');
    }
  });
}


//deals with element visibility, token removal and providing a next clean session
export function setupLogout(page) {
  const logoutButton = document.getElementById('logout-button');
  if (!logoutButton) return;

  if(page === 'home' || page === 'favorites') {
    logoutButton.style.display = 'block';
  } else {
    logoutButton.style.display = 'none';
  }
  

  if (isLogoutListenerAttached) return; 
  isLogoutListenerAttached = true;

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token'); 
    alert('You have been logged out.');

    
    isLoginListenerAttached = false;
    isRegisterListenerAttached = false;

    sessionStorage.removeItem('searchResults');
    sessionStorage.removeItem('userSearchQuery');

    setTimeout(() => {
      renderPage('login');
    }, 0);
  });
}

