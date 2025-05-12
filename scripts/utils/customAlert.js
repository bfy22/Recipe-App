export function showCustomAlert(message, duration = 3000) {
  const alertBox = document.getElementById('custom-alert');
  alertBox.textContent = message;
  alertBox.classList.remove('hidden');
  alertBox.classList.add('show');

  setTimeout(() => {
    alertBox.classList.remove('show');
    alertBox.classList.add('hidden');
  }, duration);
}