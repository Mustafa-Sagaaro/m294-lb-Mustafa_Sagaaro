const login = document.getElementById('login-form');

login.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email-input').value;
  const password = document.getElementById('password-input').value;

  try {
    const response = await fetch('http://localhost:3000/auth/jwt/sign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (response.status === 200) {
      sessionStorage.setItem("token", data.token);
      window.location.replace('http://127.0.0.1:5500/public/index.html');
    } else if (response.status === 400) {
      alert('Deine Eingabe war leider falsch, bitte versuche es erneut!');
    }
  } catch (error) {
    console.error(error);
  }
});


async function logout() {
  try {
    const response = await fetch('http://localhost:3000/auth/cookie/logout', {
      method: 'POST',
      credentials: 'include'
    });
    if (response.ok) {
      window.location.href = 'login.html';
    }
  } catch (error) {
    console.error('Fehler beim Löschen des Tokens', error);
  }
}
