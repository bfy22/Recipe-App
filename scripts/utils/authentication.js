import { renderPage } from "../main.js";

export function requireAuth(page, callback) {
  const token = localStorage.getItem('token');
  if (!token) {
    
    alert(`Access denied to page "${page}". Redirecting to login.`);
    renderPage('login');
    return;
  }

  console.log(`Access granted to page "${page}".`); // Debug log
  callback();
}