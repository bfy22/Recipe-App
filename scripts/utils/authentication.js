import { renderPage } from "../main.js";

export function requireAuth(page, callback) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to access this page');
    renderPage('login');
  } else {
    callback(page);
  }
}