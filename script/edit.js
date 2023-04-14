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

    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="material-icons">edit</i>';
    editButton.onclick = () => editTask(task.id);
    editButton.style.cssText = 'float: right; background-color: transparent; border-radius:5px; margin-right: 5px;';
    taskCard.appendChild(editButton);

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
    const firstTasks = tasks.slice();
    Taskanzeigen(firstTasks);
  });


// Task bearbeiten
  async function getTaskById(taskId) {
    const response = await fetch(
      `http://localhost:3000/auth/jwt/task/${taskId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  }


  function editTask(taskId) {
    getTaskById(taskId).then((task) => {
      openModal(task);
    });
  }


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
        alert('aufgabe erfolgreich gelöscht!');
        taskCard.remove();
      } else {
        alert('aufgabe konnte nicht gelöscht werden');
        console.error('Fehler beim Löschen der Task:', response.status);
      }
    })
}


  // Modal zum bearbeiten der Task wird geöffnet
  
  let currentTaskId;

  function openModal(task) {
    const modal = document.getElementById("edit-modal");
    const taskName = document.getElementById("task-name");
    const taskCompleted = document.getElementById("task-completed");
  
    taskName.value = task.title;
    taskCompleted.checked = task.completed;
    currentTaskId = task.id;
  
    modal.style.display = "block";
  }
  
  document.getElementById("edit-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const taskName = document.getElementById("task-name").value;
    const taskCompleted = document.getElementById("task-completed").checked;
  
    if (taskName) {
      fetch("http://localhost:3000/auth/jwt/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: currentTaskId,
          title: taskName,
          completed: taskCompleted,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          alert('Aufgabe erfolgreich bearbeitet')
          location.reload();
        })
        .catch((error) =>
          console.error("Fehler beim bearbeiten der Aufgabe:", error),
          alert('aufgabe konnte nicht gelöscht werden')
        );
    }
  });
  
  const closeButton = document.getElementsByClassName("close")[0];
  closeButton.onclick = () => {
    const modal = document.getElementById("edit-modal");
    modal.style.display = "none";
  };
  
  window.onclick = (event) => {
    const modal = document.getElementById("edit-modal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

