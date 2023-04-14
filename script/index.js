const token = sessionStorage.getItem("token")

async function logout() {
try {
const response = await fetch('http://localhost:3000/auth/cookie/logout', {
  method: 'POST',
  credentials: 'include'
});
if (response.ok) {
  sessionStorage.removeItem('token'); 
  window.location.href = 'login.html';
}
} catch (error) {
console.error('Fehler beim Löschen des Tokens', error);
}
}

function checkIfLoggedIn() {
const token = sessionStorage.getItem("token");
if (!token) {
alert('Du bist nicht angemeldet, bitte melde dich an.');
logout();
}
}

checkIfLoggedIn();