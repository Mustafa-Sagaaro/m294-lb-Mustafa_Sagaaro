const token = sessionStorage.getItem("token")

//Überprüft, ob man eingeloggt ist
function checkIfLoggedIn() {
  const token = sessionStorage.getItem("token");
  if (!token) {
    alert('Du bist nicht angemeldet, bitte melde dich an.');
    logout();
  }
}

checkIfLoggedIn();

// Nach Tasks suchen

function searchTasks() {
  const suche = document.getElementById('search').value;

  fetch('http://localhost:3000/auth/jwt/tasks', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
    .then((response) => response.json())
    .then((tasks) => {
      const filteredTasks = tasks.filter((task) => {
        return (
          task.title.toLowerCase().includes(suche.toLowerCase()) ||
          task.id.toString().includes(suche)
        );
      });

      Taskanzeigen(filteredTasks);
    });
}

// Tasks anzeigen lassen, als Karten.

function Taskanzeigen(tasks) {
  const taskContainer = document.querySelector('.taskcontainer');
  taskContainer.innerHTML = '';

  tasks.forEach((task) => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('taskcard');
    taskCard.setAttribute('data-task-id', task.id);
    taskCard.innerHTML = `
      <h2>${task.title}</h2>
      <p>Erledigt: ${task.completed}</p>
      <p>id: ${task.id}</p>`;

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="material-icons">delete</i>';
    deleteButton.onclick = () => deleteTask(task.id);
    deleteButton.style.cssText = 'float: right; background-color: transparent; border-radius:5px;';
    taskCard.appendChild(deleteButton);
    taskContainer.appendChild(taskCard);
  });
}

// Anzeigen der Tasks auf 9 begränzt

fetch('http://localhost:3000/auth/jwt/tasks', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
  .then((response) => response.json())
  .then((tasks) => {
    const firstTasks = tasks.slice(0, 9);
    Taskanzeigen(firstTasks);
  });

// Tasks löschen
function deleteTask(taskId) {
  fetch(`http://localhost:3000/auth/jwt/task/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
    .then((response) => {
      if (response.ok) {
        const taskCard = document.querySelector(`.taskcard[data-task-id="${taskId}"]`);
        taskCard.remove();
      } else {
        console.error('Fehler beim Löschen der Task:', response.status);
      }
    })
}



// Tasks hinzufügen

function addTask() {
  const Aufgaben_name = document.getElementById('Aufgaben-name').value;
  const Aufgabe_erledigt = document.getElementById('Aufgabe-erledigt').checked;

  const taskData = {
    title: Aufgaben_name,
    completed: Aufgabe_erledigt,
  };

  fetch('http://localhost:3000/auth/jwt/tasks', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  })
    .then((response) => {
      if (response.ok) {
        alert('Auftrag erfolgreich hinzugefügt!');
        document.getElementById('Aufgaben-name').value = '';
        document.getElementById('Aufgabe-erledigt').checked = false;
      } else {
        alert('Fehler beim Hinzufügen des Auftrags. Bitte versuche es erneut.');
      }
    })
    .catch((error) => {
      console.error('Fehler beim Hinzufügen des Auftrags:', error);
      alert('Fehler beim Hinzufügen des Auftrags. Bitte versuche es erneut.');
    });
}


function editTask(taskId) {
  const newName = prompt('Neuer Aufgabenname:');

  if (newName) {
    fetch(`http://localhost:3000/auth/jwt/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: newName })
    })
      .then((response) => {
        if (response.ok) {
          const taskCard = document.querySelector(`.taskcard[data-task-id="${taskId}"]`);
          const titleElement = taskCard.querySelector('h2');
          titleElement.textContent = newName;
        } else {
          console.error('Fehler beim Ändern des Aufgaben-Namens:', response.status);
        }
      })
  }
}

const titleElement = taskCard.querySelector('h2');
titleElement.addEventListener('click', () => editTask(task.id));

