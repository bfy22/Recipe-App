export function checkAuthentication() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to access this page');
    window.location.href = 'login.html';
  }
}